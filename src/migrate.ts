import { App, Modal, Notice, TFile } from "obsidian";
import { TagPrefixes } from "./parser";

export interface PrefixChange {
  key: keyof TagPrefixes;
  oldPrefix: string;
  newPrefix: string;
}

interface MigrationOpts {
  changes: PrefixChange[];
  // Empty string means scan the entire vault.
  folder: string;
}

interface FileMatches {
  file: TFile;
  count: number;
}

const escapeRegex = (s: string): string =>
  s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export class TagMigrationModal extends Modal {
  private opts: MigrationOpts;
  private matches: FileMatches[] = [];
  private totalReplacements = 0;
  private scanning = true;

  constructor(app: App, opts: MigrationOpts) {
    super(app);
    this.opts = opts;
  }

  async onOpen(): Promise<void> {
    this.modalEl.addClass("dp-title-modal");
    this.modalEl.addClass("dp-migrate-modal");
    this.titleEl.setText("Migrate task tags");
    this.renderScanning();
    await this.scan();
    this.scanning = false;
    this.render();
  }

  private renderScanning(): void {
    this.contentEl.empty();
    this.contentEl.createDiv({
      cls: "dp-migrate-scanning",
      text: "Scanning…",
    });
  }

  private collectFiles(): TFile[] {
    const all = this.app.vault.getMarkdownFiles();
    const folder = this.opts.folder.trim().replace(/\/+$/, "");
    if (!folder) return all;
    const prefix = `${folder}/`;
    return all.filter((f) => f.path.startsWith(prefix));
  }

  private buildAlternationRegex(): RegExp {
    // Sort by length desc so e.g. "td" matches before "t" when both are
    // present, avoiding partial matches that would corrupt the longer prefix.
    const ordered = [...this.opts.changes].sort(
      (a, b) => b.oldPrefix.length - a.oldPrefix.length,
    );
    const alternation = ordered
      .map((c) => escapeRegex(c.oldPrefix))
      .join("|");
    return new RegExp(`#(${alternation})\\/`, "g");
  }

  private prefixMap(): Map<string, string> {
    const m = new Map<string, string>();
    for (const ch of this.opts.changes) m.set(ch.oldPrefix, ch.newPrefix);
    return m;
  }

  private async scan(): Promise<void> {
    const files = this.collectFiles();
    const re = this.buildAlternationRegex();
    const matches: FileMatches[] = [];
    let total = 0;
    for (const file of files) {
      const content = await this.app.vault.read(file);
      const found = content.match(re);
      if (found && found.length > 0) {
        matches.push({ file, count: found.length });
        total += found.length;
      }
    }
    this.matches = matches.sort((a, b) =>
      a.file.path.localeCompare(b.file.path),
    );
    this.totalReplacements = total;
  }

  private render(): void {
    this.contentEl.empty();

    const warn = this.contentEl.createDiv({ cls: "dp-migrate-warn" });
    warn.setText(
      "This rewrites task lines in your vault. The change can't be undone — make a backup if you're unsure.",
    );

    const summary = this.contentEl.createDiv({ cls: "dp-migrate-summary" });
    const folderText = this.opts.folder.trim() || "entire vault";
    const folderRow = summary.createDiv({ cls: "dp-migrate-summary-row" });
    folderRow.createSpan({ cls: "dp-migrate-summary-label", text: "Folder" });
    folderRow.createSpan({
      cls: "dp-migrate-summary-value",
      text: folderText,
    });
    for (const ch of this.opts.changes) {
      const row = summary.createDiv({ cls: "dp-migrate-summary-row" });
      row.createSpan({
        cls: "dp-migrate-summary-label",
        text: keyLabel(ch.key),
      });
      row.createSpan({
        cls: "dp-migrate-summary-value",
        text: `#${ch.oldPrefix}/ → #${ch.newPrefix}/`,
      });
    }

    if (this.matches.length === 0) {
      const none = this.contentEl.createDiv({ cls: "dp-migrate-none" });
      none.setText("No matches found in the selected folder.");
    } else {
      const stats = this.contentEl.createDiv({ cls: "dp-migrate-stats" });
      const fileWord = this.matches.length === 1 ? "file" : "files";
      const tagWord = this.totalReplacements === 1 ? "tag" : "tags";
      stats.setText(
        `Found ${this.totalReplacements} ${tagWord} across ${this.matches.length} ${fileWord}.`,
      );

      const list = this.contentEl.createDiv({ cls: "dp-migrate-files" });
      this.matches.forEach((m) => {
        const row = list.createDiv({ cls: "dp-migrate-file-row" });
        row.createSpan({ cls: "dp-migrate-file-path", text: m.file.path });
        row.createSpan({
          cls: "dp-migrate-file-count",
          text: m.count.toString(),
        });
      });
    }

    const actions = this.contentEl.createDiv({ cls: "dp-edit-actions" });
    const skip = actions.createEl("button", {
      cls: "dp-edit-show-btn",
      text: "Skip",
    });
    skip.type = "button";
    skip.addEventListener("click", () => this.close());

    if (this.matches.length > 0) {
      const apply = actions.createEl("button", {
        cls: "dp-edit-save-btn mod-cta",
        text: `Migrate ${this.totalReplacements} ${
          this.totalReplacements === 1 ? "tag" : "tags"
        }`,
      });
      apply.type = "button";
      apply.addEventListener("click", () => void this.apply(apply));
    }
  }

  private async apply(applyBtn: HTMLButtonElement): Promise<void> {
    applyBtn.disabled = true;
    applyBtn.setText("Migrating…");
    const re = this.buildAlternationRegex();
    const map = this.prefixMap();
    let total = 0;
    let touched = 0;
    for (const m of this.matches) {
      let fileChanges = 0;
      await this.app.vault.process(m.file, (content) => {
        return content.replace(re, (_full, oldPrefix: string) => {
          fileChanges++;
          const newPrefix = map.get(oldPrefix) ?? oldPrefix;
          return `#${newPrefix}/`;
        });
      });
      if (fileChanges > 0) {
        total += fileChanges;
        touched++;
      }
    }
    new Notice(
      `Migrated ${total} tag${total === 1 ? "" : "s"} across ${touched} file${touched === 1 ? "" : "s"}.`,
    );
    this.close();
  }

  onClose(): void {
    this.contentEl.empty();
  }
}

function keyLabel(key: keyof TagPrefixes): string {
  switch (key) {
    case "duration":
      return "Duration";
    case "time":
      return "Time";
    case "order":
      return "Order";
    case "project":
      return "Project";
    case "subproject":
      return "Sub-project";
    case "exercise":
      return "Exercise";
  }
}
