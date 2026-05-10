import { App, Modal, Notice, TFile, normalizePath } from "obsidian";
import type TodayPlugin from "./main";
import {
  TagPrefixes,
  generateTaskId,
  parseTaskId,
  parseTaskCreated,
  setTaskCreatedTag,
  setTaskIdTag,
  setTaskMigrated,
} from "./parser";
import {
  DailyNoteOptions,
  getDailyNoteOptions,
  listDailyNotes,
  todayDateStr,
} from "./dailyNote";

const TASK_LINE = /^(\s*)- \[([ xX/\-!?*<>])\]\s+(.*)$/;

type Scope = "past" | "today";

interface SourceLineEdit {
  lineNumber: number;
  oldText: string;
  newText: string;
}

interface FileEdit {
  file: TFile;
  date: string;
  edits: SourceLineEdit[];
  inboxLines: string[];
}

interface MigrationPlan {
  edits: FileEdit[];
  totalCount: number;
  inboxPath: string;
  previewTitles: string[];
}

export async function collectUnfinished(plugin: TodayPlugin): Promise<void> {
  const fallback = {
    folder: plugin.settings.dailyNoteFolderFallback,
    format: plugin.settings.dailyNoteFormatFallback,
  };
  const dailyOptions = getDailyNoteOptions(plugin.app, fallback);
  const inboxPath = resolveInboxPath(
    plugin.settings.inboxPath,
    dailyOptions.folder,
  );
  if (!inboxPath) {
    new Notice("Today: set an inbox file path in settings before collecting.");
    return;
  }

  const scope = await pickScope(plugin.app);
  if (!scope) return;

  const plan = await buildMigrationPlan(plugin, dailyOptions, inboxPath, scope);
  if (plan.totalCount === 0) {
    new Notice("Today: no unfinished tasks to migrate.");
    return;
  }

  if (plugin.settings.confirmCollectMigration) {
    const ok = await confirmMigration(plugin.app, plan);
    if (!ok) return;
  }
  await applyPlan(plugin.app, plan);
  new Notice(
    `Today: migrated ${plan.totalCount} task${
      plan.totalCount === 1 ? "" : "s"
    } to ${plan.inboxPath}.`,
  );
}

export function resolveInboxPath(template: string, dailyFolder: string): string {
  const t = (template || "").trim();
  if (!t) return "";
  return normalizePath(t.replace(/\{daily\}/g, dailyFolder));
}

function pickScope(app: App): Promise<Scope | null> {
  return new Promise((resolve) => {
    new ScopeModal(app, resolve).open();
  });
}

function confirmMigration(app: App, plan: MigrationPlan): Promise<boolean> {
  return new Promise((resolve) => {
    new ConfirmModal(app, plan, resolve).open();
  });
}

class ScopeModal extends Modal {
  private settled = false;
  private resolve: (scope: Scope | null) => void;

  constructor(app: App, resolve: (scope: Scope | null) => void) {
    super(app);
    this.resolve = resolve;
  }

  onOpen(): void {
    this.modalEl.addClass("dp-title-modal");
    this.titleEl.setText("Collect unfinished tasks");

    const desc = this.contentEl.createDiv({ cls: "dp-migrate-summary" });
    desc.createDiv({
      cls: "dp-migrate-summary-row",
      text: "Sweep unchecked tasks from which daily notes?",
    });

    const actions = this.contentEl.createDiv({ cls: "dp-edit-actions" });
    const past = actions.createEl("button", {
      cls: "dp-edit-save-btn mod-cta",
      text: "All past",
    });
    past.type = "button";
    past.addEventListener("click", () => this.finish("past"));

    const today = actions.createEl("button", {
      cls: "dp-edit-show-btn",
      text: "Today",
    });
    today.type = "button";
    today.addEventListener("click", () => this.finish("today"));

    const cancel = actions.createEl("button", {
      cls: "dp-edit-show-btn",
      text: "Cancel",
    });
    cancel.type = "button";
    cancel.addEventListener("click", () => this.close());
  }

  private finish(scope: Scope): void {
    this.settled = true;
    this.close();
    this.resolve(scope);
  }

  onClose(): void {
    this.contentEl.empty();
    if (!this.settled) this.resolve(null);
  }
}

class ConfirmModal extends Modal {
  private plan: MigrationPlan;
  private resolve: (ok: boolean) => void;
  private settled = false;

  constructor(
    app: App,
    plan: MigrationPlan,
    resolve: (ok: boolean) => void,
  ) {
    super(app);
    this.plan = plan;
    this.resolve = resolve;
  }

  onOpen(): void {
    this.modalEl.addClass("dp-title-modal");
    this.modalEl.addClass("dp-migrate-modal");
    this.titleEl.setText("Migrate unfinished tasks");

    const summary = this.contentEl.createDiv({ cls: "dp-migrate-summary" });
    const row = summary.createDiv({ cls: "dp-migrate-summary-row" });
    row.createSpan({ cls: "dp-migrate-summary-label", text: "Inbox" });
    row.createSpan({
      cls: "dp-migrate-summary-value",
      text: this.plan.inboxPath,
    });

    const stats = this.contentEl.createDiv({ cls: "dp-migrate-stats" });
    const fileWord = this.plan.edits.length === 1 ? "file" : "files";
    const taskWord = this.plan.totalCount === 1 ? "task" : "tasks";
    stats.setText(
      `Migrating ${this.plan.totalCount} ${taskWord} from ${this.plan.edits.length} ${fileWord}.`,
    );

    const list = this.contentEl.createDiv({ cls: "dp-migrate-files" });
    const previewLimit = 30;
    const titles = this.plan.previewTitles.slice(0, previewLimit);
    for (const title of titles) {
      const r = list.createDiv({ cls: "dp-migrate-file-row" });
      r.createSpan({ cls: "dp-migrate-file-path", text: title });
    }
    if (this.plan.previewTitles.length > previewLimit) {
      const r = list.createDiv({ cls: "dp-migrate-file-row" });
      r.createSpan({
        cls: "dp-migrate-file-path",
        text: `…and ${this.plan.previewTitles.length - previewLimit} more`,
      });
    }

    const actions = this.contentEl.createDiv({ cls: "dp-edit-actions" });
    const cancel = actions.createEl("button", {
      cls: "dp-edit-show-btn",
      text: "Cancel",
    });
    cancel.type = "button";
    cancel.addEventListener("click", () => this.close());

    const apply = actions.createEl("button", {
      cls: "dp-edit-save-btn mod-cta",
      text: `Migrate ${this.plan.totalCount} ${taskWord}`,
    });
    apply.type = "button";
    apply.addEventListener("click", () => {
      this.settled = true;
      this.close();
      this.resolve(true);
    });
  }

  onClose(): void {
    this.contentEl.empty();
    if (!this.settled) this.resolve(false);
  }
}

async function buildMigrationPlan(
  plugin: TodayPlugin,
  options: DailyNoteOptions,
  inboxPath: string,
  scope: Scope,
): Promise<MigrationPlan> {
  const today = todayDateStr();
  const candidates = listDailyNotes(plugin.app, options).filter(
    ({ file, date }) => {
      if (file.path === inboxPath) return false;
      if (scope === "past") return date < today;
      return date === today;
    },
  );

  const prefixes = plugin.settings.prefixes;
  const idLength = plugin.settings.taskIdLength;
  const edits: FileEdit[] = [];
  let totalCount = 0;
  const previewTitles: string[] = [];

  for (const { file, date } of candidates) {
    const content = await plugin.app.vault.read(file);
    const result = scanContent(content, date, prefixes, idLength);
    if (result.inboxLines.length === 0) continue;
    edits.push({
      file,
      date,
      edits: result.edits,
      inboxLines: result.inboxLines,
    });
    totalCount += result.inboxLines.length;
    for (const line of result.inboxLines) {
      previewTitles.push(extractTitle(line));
    }
  }

  return { edits, totalCount, inboxPath, previewTitles };
}

interface TaskLineRecord {
  lineNumber: number;
  indent: string;
  checked: boolean;
  migrated: boolean;
  body: string;
  rawLine: string;
}

function scanContent(
  content: string,
  date: string,
  prefixes: TagPrefixes,
  idLength: number,
): { edits: SourceLineEdit[]; inboxLines: string[] } {
  const lines = content.split("\n");
  const taskLines: TaskLineRecord[] = [];
  for (let i = 0; i < lines.length; i++) {
    const m = TASK_LINE.exec(lines[i]);
    if (!m) continue;
    const ch = m[2];
    taskLines.push({
      lineNumber: i,
      indent: m[1],
      checked: ch === "x" || ch === "X",
      migrated: ch === ">",
      body: m[3],
      rawLine: lines[i],
    });
  }

  const edits: SourceLineEdit[] = [];
  const inboxLines: string[] = [];

  let i = 0;
  while (i < taskLines.length) {
    const t = taskLines[i];
    if (t.checked || t.migrated || !isMigrationRoot(taskLines, i)) {
      i++;
      continue;
    }
    // Gather subtree: every later task line whose indent is strictly
    // deeper than the root's, until we exit the subtree.
    const subtree: TaskLineRecord[] = [t];
    let k = i + 1;
    while (k < taskLines.length) {
      const next = taskLines[k];
      if (next.indent.length <= t.indent.length) break;
      if (!next.checked && !next.migrated) subtree.push(next);
      k++;
    }
    appendBlockToPlan(subtree, t, date, prefixes, idLength, edits, inboxLines);
    i = k;
  }

  return { edits, inboxLines };
}

// A task line is a migration root when its nearest ancestor task (the closest
// preceding task at strictly smaller indent) is missing, checked, or already
// migrated. Otherwise that ancestor will sweep this line as part of its own
// subtree, so the line is not its own root.
function isMigrationRoot(taskLines: TaskLineRecord[], i: number): boolean {
  const t = taskLines[i];
  for (let j = i - 1; j >= 0; j--) {
    const a = taskLines[j];
    if (a.indent.length < t.indent.length) {
      return a.checked || a.migrated;
    }
  }
  return true;
}

function appendBlockToPlan(
  subtree: TaskLineRecord[],
  root: TaskLineRecord,
  date: string,
  prefixes: TagPrefixes,
  idLength: number,
  edits: SourceLineEdit[],
  inboxLines: string[],
): void {
  for (const line of subtree) {
    let id = parseTaskId(line.body, prefixes);
    let updatedSource = line.rawLine;
    if (!id) {
      id = generateTaskId(idLength);
      updatedSource = setTaskIdTag(updatedSource, id, prefixes);
    }
    const migratedSource = setTaskMigrated(updatedSource);

    // Inbox copy: same body as the (possibly tid-stamped) source, but with
    // `[ ]` and rebased indent so the root sits at the file's left margin.
    const rebasedIndent = stripIndentPrefix(line.indent, root.indent);
    const sourceBodyMatch = TASK_LINE.exec(updatedSource);
    const inboxBody = sourceBodyMatch ? sourceBodyMatch[3] : line.body;
    let inboxLine = `${rebasedIndent}- [ ] ${inboxBody}`;
    // Stamp the source-day's date when the line lacks a creation tag.
    if (parseTaskCreated(inboxBody, prefixes) === null) {
      inboxLine = setTaskCreatedTag(inboxLine, date, prefixes);
    }

    edits.push({
      lineNumber: line.lineNumber,
      oldText: line.rawLine,
      newText: migratedSource,
    });
    inboxLines.push(inboxLine);
  }
}

function stripIndentPrefix(indent: string, rootIndent: string): string {
  if (indent.startsWith(rootIndent)) return indent.slice(rootIndent.length);
  return indent;
}

async function applyPlan(app: App, plan: MigrationPlan): Promise<void> {
  for (const fe of plan.edits) {
    await app.vault.process(fe.file, (content) => {
      const lines = content.split("\n");
      for (const e of fe.edits) {
        if (lines[e.lineNumber] === e.oldText) {
          lines[e.lineNumber] = e.newText;
        }
      }
      return lines.join("\n");
    });
  }

  const allInboxLines: string[] = [];
  for (const fe of plan.edits) allInboxLines.push(...fe.inboxLines);
  await appendToInbox(app, plan.inboxPath, allInboxLines);
}

async function appendToInbox(
  app: App,
  inboxPath: string,
  newLines: string[],
): Promise<void> {
  if (newLines.length === 0) return;
  const payload = newLines.join("\n") + "\n";
  const existing = app.vault.getAbstractFileByPath(inboxPath);
  if (existing instanceof TFile) {
    await app.vault.process(existing, (content) => {
      if (content.length === 0) return payload;
      const sep = content.endsWith("\n") ? "" : "\n";
      return content + sep + payload;
    });
    return;
  }
  // File doesn't exist — create the parent folder if needed and write.
  const slash = inboxPath.lastIndexOf("/");
  if (slash > 0) {
    const folder = inboxPath.slice(0, slash);
    if (!app.vault.getAbstractFileByPath(folder)) {
      await app.vault.createFolder(folder);
    }
  }
  await app.vault.create(inboxPath, payload);
}

// Strips every `#prefix/value` and bare `#word` from a task line and
// returns the trimmed remainder — used as the title shown in the
// confirmation modal so a long tag list doesn't dominate the preview.
function extractTitle(rawLine: string): string {
  const m = TASK_LINE.exec(rawLine);
  if (!m) return rawLine.trim();
  return m[3]
    .replace(/#[A-Za-z][\w-]*(?:\/[\w./_-]+)?/g, "")
    .replace(/\{[^{}]*\}/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
