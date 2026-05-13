import { App, Modal, Notice, TFile, normalizePath } from "obsidian";
import type TodayPlugin from "./main";
import type { JournalFlow, JournalFlowKey } from "./settings";
import { ensureDailyNote } from "./dailyNote";

// "qa" writes `> question` + answer blocks (Begin/Close Day journaling).
// "bullet" appends `- answer` lines under the section, ignoring the question
// text in the output (used for Distractions — questions only steer the modal
// prompt; the output is a flat bullet list for quick capture).
type FlowFormat = "qa" | "bullet";

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

  const questions = await readQuestions(plugin.app, flow);
  if (questions === null) return;
  if (questions.length === 0) {
    new Notice(
      `Today: template for ${spec.label} has no questions — add one line per question.`,
    );
    return;
  }

  const file = await ensureTodaysNote(plugin);

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
  if (wroteAny) new Notice(`${spec.label} logged.`);
}

async function ensureTodaysNote(plugin: TodayPlugin): Promise<TFile> {
  const settings = plugin.settings;
  return ensureDailyNote(
    plugin.app,
    new Date(),
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

    const prompt = this.contentEl.createDiv({ cls: "dp-journal-prompt" });
    prompt.setText(this.question);

    this.textarea = this.contentEl.createEl("textarea", {
      cls: "dp-journal-input",
    });
    this.textarea.rows = 4;
    this.textarea.placeholder = "Type your answer…";
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
