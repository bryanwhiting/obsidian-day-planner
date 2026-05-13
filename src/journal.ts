import { App, Modal, Notice, TFile, normalizePath } from "obsidian";
import type TodayPlugin from "./main";
import type { JournalFlow, JournalFlowKey } from "./settings";
import { ensureDailyNote } from "./dailyNote";

// "qa" writes `> question` + answer blocks (Begin/Close Day journaling).
// "bullet" appends `- answer` lines under the section, ignoring the question
// text in the output (used for Distractions — questions only steer the modal
// prompt; the output is a flat bullet list for quick capture).
// "dump" is templateless quick-capture: one big textarea, each non-empty
// line of the answer becomes its own `- bullet` under the section. No day
// picker, no template, no per-question loop.
type FlowFormat = "qa" | "bullet" | "dump";

interface FlowSpec {
  key: JournalFlowKey;
  format: FlowFormat;
  // Human label used in Notice copy ("Begin Day journal saved.").
  label: string;
}

const FLOWS: Record<JournalFlowKey, FlowSpec> = {
  beginDay: { key: "beginDay", format: "qa", label: "Begin Day" },
  closeDay: { key: "closeDay", format: "qa", label: "Close Day" },
  distractions: { key: "distractions", format: "bullet", label: "Distraction" },
  brainDump: { key: "brainDump", format: "dump", label: "Brain Dump" },
};

// Day choices offered by the journal day-picker. Distractions skip the
// picker entirely (always today); Begin/Close Day open the picker so the
// user can backfill yesterday's close-day or pre-fill tomorrow's begin-day.
type DayChoice = "today" | "yesterday" | "tomorrow";

const DAY_OFFSETS: Record<DayChoice, number> = {
  today: 0,
  yesterday: -1,
  tomorrow: 1,
};

const DAY_LABELS: Record<DayChoice, string> = {
  today: "Today",
  yesterday: "Yesterday",
  tomorrow: "Tomorrow",
};

export async function runJournal(
  plugin: TodayPlugin,
  flowKey: JournalFlowKey,
): Promise<void> {
  const spec = FLOWS[flowKey];
  const flow = plugin.settings.journal[flowKey];
  const sectionTitle = (flow.sectionTitle || "").trim();
  if (!sectionTitle) {
    new Notice(`Today: set a section title for ${spec.label} in settings.`);
    return;
  }

  // Distractions are quick-capture by design — skip the day picker so the
  // first modal the user sees is the question itself. Begin/Close Day open
  // a three-option picker first; Enter on the picker selects Today. Brain
  // Dump is the most aggressive form of quick-capture and always logs to
  // today's note with a single textarea — no template, no picker.
  let dayChoice: DayChoice = "today";
  if (spec.format === "qa") {
    const picked = await pickDay(plugin.app, spec.label);
    if (picked === null) return;
    dayChoice = picked;
  }

  if (spec.format === "dump") {
    const file = await ensureNoteForOffset(plugin, DAY_OFFSETS[dayChoice]);
    const dump = await askDump(plugin.app, spec.label);
    if (dump === null) return; // Escape / Cancel — nothing was written.
    const bullets = formatDumpBullets(dump);
    if (bullets.length === 0) return;
    await appendToSection(plugin.app, file, sectionTitle, bullets);
    new Notice(`${spec.label} logged.`);
    return;
  }

  const questions = await readQuestions(plugin.app, flow);
  if (questions === null) return;
  if (questions.length === 0) {
    new Notice(
      `Today: template for ${spec.label} has no questions — add one line per question.`,
    );
    return;
  }

  const file = await ensureNoteForOffset(plugin, DAY_OFFSETS[dayChoice]);

  let wroteAny = false;
  for (const question of questions) {
    const answer = await askQuestion(plugin.app, spec.label, question);
    if (answer === null) break; // Escape / Cancel — prior answers persist.
    if (answer.length === 0) continue; // empty submit skips this question.
    if (spec.format === "qa") {
      await appendToSection(
        plugin.app,
        file,
        sectionTitle,
        formatQABlock(question, answer),
      );
    } else {
      await appendToSection(
        plugin.app,
        file,
        sectionTitle,
        formatBullet(answer),
      );
    }
    wroteAny = true;
  }
  if (wroteAny) {
    const dayWord = DAY_LABELS[dayChoice].toLowerCase();
    new Notice(
      dayChoice === "today"
        ? `${spec.label} logged.`
        : `${spec.label} logged for ${dayWord}.`,
    );
  }
}

async function ensureNoteForOffset(
  plugin: TodayPlugin,
  dayOffset: number,
): Promise<TFile> {
  const settings = plugin.settings;
  const target = new Date();
  target.setHours(0, 0, 0, 0);
  target.setDate(target.getDate() + dayOffset);
  return ensureDailyNote(
    plugin.app,
    target,
    {
      folder: settings.dailyNoteFolderFallback,
      format: settings.dailyNoteFormatFallback,
      template: settings.dailyNoteTemplate,
      templatesByDay: settings.dailyNoteTemplatesByDay,
      dateLinkFormat: settings.dateLinkFormat,
      prefixes: settings.prefixes,
      quotesFile: settings.quotesFile,
      addCreatedTag: settings.addCreatedTagToFrontmatter,
    },
    false,
  );
}

function pickDay(app: App, flowLabel: string): Promise<DayChoice | null> {
  return new Promise((resolve) => {
    new DayChoiceModal(app, flowLabel, resolve).open();
  });
}

// Loads the template, splits on lines, trims, drops empties. Returns null
// when the template can't be loaded (after surfacing a Notice) so callers
// abort cleanly without confusing the user with a follow-up modal.
async function readQuestions(
  app: App,
  flow: JournalFlow,
): Promise<string[] | null> {
  const raw = (flow.templatePath || "").trim();
  if (!raw) {
    new Notice(
      `Today: pick a template file for "${flow.sectionTitle}" in Settings → Journal & Logs.`,
    );
    return null;
  }
  const withExt = raw.toLowerCase().endsWith(".md") ? raw : `${raw}.md`;
  const path = normalizePath(withExt);
  const file = app.vault.getAbstractFileByPath(path);
  if (!(file instanceof TFile)) {
    new Notice(`Today: template not found at ${path}`);
    return null;
  }
  const content = await app.vault.read(file);
  return content
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
}

function formatQABlock(question: string, answer: string): string {
  // Quote the question (multi-line questions stay quoted on every line) so
  // it stands out from the answer body in the rendered note.
  const quoted = question
    .split(/\r?\n/)
    .map((l) => `> ${l}`)
    .join("\n");
  return `${quoted}\n\n${answer}\n`;
}

function formatBullet(answer: string): string {
  // Each bullet is a single list item. If the user pasted a multi-line
  // answer, indent continuation lines so they belong to the same bullet.
  const lines = answer.split(/\r?\n/);
  if (lines.length === 1) return `- ${lines[0]}\n`;
  const head = lines[0];
  const rest = lines.slice(1).map((l) => `  ${l}`);
  return `- ${head}\n${rest.join("\n")}\n`;
}

// Brain Dump format: split the textarea by newlines; each non-empty line
// becomes its own `- bullet` so a rapid-fire dump produces a clean list
// rather than one merged bullet with indented continuations. Returns "" if
// every line is blank (caller treats that as nothing-to-write).
function formatDumpBullets(answer: string): string {
  const lines = answer
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
  if (lines.length === 0) return "";
  return lines.map((l) => `- ${l}`).join("\n") + "\n";
}

function askDump(app: App, flowLabel: string): Promise<string | null> {
  // Same modal shell as the per-question prompter but with no question body
  // and a roomier textarea — Brain Dump is meant for stream-of-consciousness
  // input, so Shift+Enter inserts newlines and plain Enter still submits.
  return new Promise((resolve) => {
    const modal = new QuestionModal(app, flowLabel, "", resolve);
    modal.rows = 10;
    modal.placeholder = "Dump it…";
    modal.open();
  });
}

// Inserts `block` at the end of the `## sectionTitle` section. If the heading
// is missing it gets appended at the end of the file. The block is separated
// from prior content by a single blank line so successive runs stack cleanly
// without collapsing into the previous answer. Uses `app.vault.process` so
// concurrent modifies (e.g. another journal step mid-flow) compose safely.
async function appendToSection(
  app: App,
  file: TFile,
  sectionTitle: string,
  block: string,
): Promise<void> {
  await app.vault.process(file, (content) =>
    insertIntoSection(content, sectionTitle, block),
  );
}

// Pure string transform: returns `content` with `block` inserted at the end
// of the `## sectionTitle` section (the run of lines after the matching
// heading, stopping at the next heading of equal-or-lesser depth or EOF).
// When the heading isn't found, appends a fresh `## sectionTitle` block to
// the end of the file.
export function insertIntoSection(
  content: string,
  sectionTitle: string,
  block: string,
): string {
  const lines = content.split("\n");
  const headingRe = /^(#{1,6})\s+(.*?)\s*$/;
  // Target heading is `##` + sectionTitle. Matching is case-insensitive and
  // ignores leading/trailing whitespace so users who hand-wrote slightly
  // different casing don't get a duplicate section.
  const target = sectionTitle.trim().toLowerCase();
  let headingIdx = -1;
  let headingDepth = 0;
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(headingRe);
    if (!m) continue;
    if (m[2].trim().toLowerCase() === target) {
      headingIdx = i;
      headingDepth = m[1].length;
      break;
    }
  }
  if (headingIdx < 0) {
    // Append new section. Leading blank line keeps prior content separated.
    const sep = content.length === 0 || content.endsWith("\n\n") ? "" : (
      content.endsWith("\n") ? "\n" : "\n\n"
    );
    const trailingBlock = block.endsWith("\n") ? block : block + "\n";
    return `${content}${sep}## ${sectionTitle}\n\n${trailingBlock}`;
  }
  // Find the end of this section — first line past `headingIdx` that's a
  // heading of equal-or-lesser depth, else end-of-file.
  let endIdx = lines.length;
  for (let i = headingIdx + 1; i < lines.length; i++) {
    const m = lines[i].match(headingRe);
    if (m && m[1].length <= headingDepth) {
      endIdx = i;
      break;
    }
  }
  // Strip trailing blank lines inside the section so successive blocks don't
  // pile up empty rows. We'll re-insert exactly one blank line as separator.
  let insertAt = endIdx;
  while (insertAt > headingIdx + 1 && lines[insertAt - 1].trim() === "") {
    insertAt--;
  }
  // Ensure the line immediately before the heading body has a blank after
  // the heading itself when the section is fresh.
  const needsLeadingBlank = insertAt === headingIdx + 1;
  const trimmedBlock = block.replace(/\n+$/, "");
  const blockLines = trimmedBlock.split("\n");
  const insertLines: string[] = [];
  if (needsLeadingBlank) {
    // Newly-created section body: `## Title\n\n<block>\n`.
    insertLines.push("");
    insertLines.push(...blockLines);
    insertLines.push("");
  } else {
    // Existing content above: keep a blank line between the prior block and
    // this one for readability, then the new block, then a trailing blank.
    insertLines.push("");
    insertLines.push(...blockLines);
    insertLines.push("");
  }
  const before = lines.slice(0, insertAt);
  const after = lines.slice(endIdx);
  return [...before, ...insertLines, ...after].join("\n");
}

function askQuestion(
  app: App,
  flowLabel: string,
  question: string,
): Promise<string | null> {
  return new Promise((resolve) => {
    new QuestionModal(app, flowLabel, question, resolve).open();
  });
}

class QuestionModal extends Modal {
  private flowLabel: string;
  private question: string;
  private resolve: (answer: string | null) => void;
  private settled = false;
  private textarea!: HTMLTextAreaElement;
  // Optional overrides for non-Q+A callers (e.g. Brain Dump wants a bigger
  // textarea + a different placeholder than per-question prompts).
  rows = 4;
  placeholder = "Type your answer…";

  constructor(
    app: App,
    flowLabel: string,
    question: string,
    resolve: (answer: string | null) => void,
  ) {
    super(app);
    this.flowLabel = flowLabel;
    this.question = question;
    this.resolve = resolve;
  }

  onOpen(): void {
    this.modalEl.addClass("dp-title-modal");
    this.modalEl.addClass("dp-journal-modal");
    this.titleEl.setText(this.flowLabel);

    // Brain Dump passes an empty question — skip the prompt div in that
    // case so the textarea sits flush under the title.
    if (this.question.length > 0) {
      const prompt = this.contentEl.createDiv({ cls: "dp-journal-prompt" });
      prompt.setText(this.question);
    }

    this.textarea = this.contentEl.createEl("textarea", {
      cls: "dp-journal-input",
    });
    this.textarea.rows = this.rows;
    this.textarea.placeholder = this.placeholder;
    // Submit on Enter (Shift+Enter inserts a newline). Escape cancels via
    // the modal's default close handler.
    this.textarea.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter" && !ev.shiftKey) {
        ev.preventDefault();
        this.submit();
      }
    });
    window.setTimeout(() => this.textarea.focus(), 0);

    const actions = this.contentEl.createDiv({ cls: "dp-edit-actions" });
    const cancel = actions.createEl("button", {
      cls: "dp-edit-show-btn",
      text: "Cancel",
    });
    cancel.type = "button";
    cancel.addEventListener("click", () => this.close());

    const save = actions.createEl("button", {
      cls: "dp-edit-save-btn mod-cta",
      text: "Save",
    });
    save.type = "button";
    save.addEventListener("click", () => this.submit());
  }

  private submit(): void {
    const value = this.textarea.value.trim();
    if (value.length === 0) {
      // Empty answers are skipped rather than written — but we still treat
      // the question as "answered" so the flow moves on. Cancel via Escape
      // / Cancel button when you want to abort the whole sequence.
      this.settled = true;
      this.close();
      this.resolve("");
      return;
    }
    this.settled = true;
    this.close();
    this.resolve(value);
  }

  onClose(): void {
    this.contentEl.empty();
    if (!this.settled) this.resolve(null);
  }
}

// Day-picker shown before Begin/Close Day flows. Three buttons (Today,
// Yesterday, Tomorrow) — no button is focused by default, so plain Enter
// does nothing and the user is forced to commit a choice. The Cmd/Ctrl+Enter
// shortcut is a power-user accelerator that picks Today, so a frequent user
// can blast through the picker without taking their hands off the keyboard.
// Escape cancels the whole flow (no daily note touched).
class DayChoiceModal extends Modal {
  private flowLabel: string;
  private resolve: (choice: DayChoice | null) => void;
  private settled = false;

  constructor(
    app: App,
    flowLabel: string,
    resolve: (choice: DayChoice | null) => void,
  ) {
    super(app);
    this.flowLabel = flowLabel;
    this.resolve = resolve;
  }

  onOpen(): void {
    this.modalEl.addClass("dp-title-modal");
    this.titleEl.setText(`${this.flowLabel} — pick a day`);

    const hint = this.contentEl.createDiv({ cls: "dp-journal-day-hint" });
    hint.setText(
      "Which day's note should this log against? Cmd/Ctrl + Enter picks Today.",
    );

    const row = this.contentEl.createDiv({ cls: "dp-dup-mode-row" });
    const choices: DayChoice[] = ["today", "yesterday", "tomorrow"];
    for (const c of choices) {
      const btn = row.createEl("button", { cls: "dp-dup-mode-btn" });
      btn.type = "button";
      btn.createDiv({ cls: "dp-dup-mode-btn-label", text: DAY_LABELS[c] });
      btn.createDiv({
        cls: "dp-dup-mode-btn-sub",
        text: describeOffset(DAY_OFFSETS[c]),
      });
      btn.addEventListener("click", () => this.finish(c));
    }

    this.scope.register(["Mod"], "Enter", (ev) => {
      ev.preventDefault();
      this.finish("today");
    });
  }

  private finish(choice: DayChoice): void {
    this.settled = true;
    this.close();
    this.resolve(choice);
  }

  onClose(): void {
    this.contentEl.empty();
    if (!this.settled) this.resolve(null);
  }
}

// Short relative-date hint shown under each button, e.g. "Mon, May 12, 2026".
function describeOffset(offset: number): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + offset);
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
