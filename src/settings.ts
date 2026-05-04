import {
  AbstractInputSuggest,
  App,
  PluginSettingTab,
  Setting,
  TFile,
} from "obsidian";
import type TodayPlugin from "./main";
import { TagPrefixes, DEFAULT_PREFIXES } from "./parser";
import { ProjectColor, DEFAULT_PALETTE, isValidHex } from "./colors";

export interface TodaySettings {
  visibleStartHour: number;
  visibleEndHour: number;
  workStartHour: number;
  workEndHour: number;
  wakeHour: number;
  sleepHour: number;
  snapMin: number;
  pxPerMin: number;
  prefixes: TagPrefixes;
  dailyNoteFormatFallback: string;
  dailyNoteFolderFallback: string;
  dailyNoteTemplate: string;
  defaultDurationMin: number;
  projectColors: ProjectColor[];
}

export const DEFAULT_SETTINGS: TodaySettings = {
  visibleStartHour: 6,
  visibleEndHour: 23,
  workStartHour: 8,
  workEndHour: 18,
  wakeHour: 6,
  sleepHour: 23,
  snapMin: 15,
  pxPerMin: 1,
  prefixes: { ...DEFAULT_PREFIXES },
  dailyNoteFormatFallback: "YYYY-MM-DD",
  dailyNoteFolderFallback: "daily",
  dailyNoteTemplate: "",
  defaultDurationMin: 15,
  projectColors: [],
};

export class TodaySettingTab extends PluginSettingTab {
  plugin: TodayPlugin;

  constructor(app: App, plugin: TodayPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    this.renderDefaultsSection(containerEl);
    this.renderProjectsSection(containerEl);
    this.renderTemplatingSection(containerEl);
    this.renderDayConfigSection(containerEl);
  }

  private renderDefaultsSection(containerEl: HTMLElement): void {
    new Setting(containerEl).setName("Defaults").setHeading();

    new Setting(containerEl)
      .setName("Default duration (minutes)")
      .setDesc(
        "Used for tasks that have a #t/ start time but no #d/ tag. Drag the bottom edge of the block to commit a real duration.",
      )
      .addText((t) =>
        t
          .setValue(this.plugin.settings.defaultDurationMin.toString())
          .onChange(async (v) => {
            this.plugin.settings.defaultDurationMin = clampInt(
              v,
              1,
              480,
              this.plugin.settings.defaultDurationMin,
            );
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName("Snap interval (minutes)")
      .setDesc("Drag-drop snaps to this granularity.")
      .addText((t) =>
        t
          .setValue(this.plugin.settings.snapMin.toString())
          .onChange(async (v) => {
            this.plugin.settings.snapMin = clampInt(
              v,
              1,
              60,
              this.plugin.settings.snapMin,
            );
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName("Pixels per minute")
      .setDesc("Vertical scale of the timeline.")
      .addText((t) =>
        t
          .setValue(this.plugin.settings.pxPerMin.toString())
          .onChange(async (v) => {
            const n = parseFloat(v);
            if (!isNaN(n) && n > 0 && n <= 10) {
              this.plugin.settings.pxPerMin = n;
              await this.plugin.saveSettings();
            }
          }),
      );

    new Setting(containerEl)
      .setName("Duration tag prefix")
      .setDesc(buildDurationDesc())
      .addText((t) =>
        t
          .setValue(this.plugin.settings.prefixes.duration)
          .onChange(async (v) => {
            if (/^[a-zA-Z]+$/.test(v)) {
              this.plugin.settings.prefixes.duration = v;
              await this.plugin.saveSettings();
            }
          }),
      );

    new Setting(containerEl)
      .setName("Time tag prefix")
      .setDesc(buildTimeDesc())
      .addText((t) =>
        t.setValue(this.plugin.settings.prefixes.time).onChange(async (v) => {
          if (/^[a-zA-Z]+$/.test(v)) {
            this.plugin.settings.prefixes.time = v;
            await this.plugin.saveSettings();
          }
        }),
      );

    new Setting(containerEl)
      .setName("Order tag prefix")
      .setDesc(buildOrderDesc())
      .addText((t) =>
        t.setValue(this.plugin.settings.prefixes.order).onChange(async (v) => {
          if (/^[a-zA-Z]+$/.test(v)) {
            this.plugin.settings.prefixes.order = v;
            await this.plugin.saveSettings();
          }
        }),
      );
  }

  private renderTemplatingSection(containerEl: HTMLElement): void {
    new Setting(containerEl).setName("Templating").setHeading();

    new Setting(containerEl)
      .setName("Daily note format fallback")
      .setDesc(
        "Used if the core Daily Notes plugin isn't enabled. Tokens: YYYY MM DD.",
      )
      .addText((t) =>
        t
          .setValue(this.plugin.settings.dailyNoteFormatFallback)
          .onChange(async (v) => {
            if (v.trim()) {
              this.plugin.settings.dailyNoteFormatFallback = v.trim();
              await this.plugin.saveSettings();
            }
          }),
      );

    new Setting(containerEl)
      .setName("Daily notes folder")
      .setDesc("Where should your daily notes be saved?")
      .addText((t) =>
        t
          .setValue(this.plugin.settings.dailyNoteFolderFallback)
          .onChange(async (v) => {
            this.plugin.settings.dailyNoteFolderFallback = v.trim();
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName("Daily note template")
      .setDesc(
        "Vault path to a template file (e.g. Templates/Daily.md). Its contents are copied verbatim into newly created daily notes. Leave blank for empty notes.",
      )
      .addText((t) => {
        t.setPlaceholder("Templates/Daily.md")
          .setValue(this.plugin.settings.dailyNoteTemplate)
          .onChange(async (v) => {
            this.plugin.settings.dailyNoteTemplate = v.trim();
            await this.plugin.saveSettings();
          });
        new FileSuggest(this.app, t.inputEl, async (file) => {
          t.setValue(file.path);
          this.plugin.settings.dailyNoteTemplate = file.path;
          await this.plugin.saveSettings();
        });
      });
  }

  private renderDayConfigSection(containerEl: HTMLElement): void {
    new Setting(containerEl).setName("Day config").setHeading();

    new Setting(containerEl)
      .setName("Visible start hour")
      .setDesc("First hour shown on the timeline (0-23).")
      .addText((t) =>
        t
          .setValue(this.plugin.settings.visibleStartHour.toString())
          .onChange(async (v) => {
            const n = clampInt(v, 0, 23, this.plugin.settings.visibleStartHour);
            this.plugin.settings.visibleStartHour = n;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName("Visible end hour")
      .setDesc("Last hour shown (1-24, must exceed start).")
      .addText((t) =>
        t
          .setValue(this.plugin.settings.visibleEndHour.toString())
          .onChange(async (v) => {
            const n = clampInt(v, 1, 24, this.plugin.settings.visibleEndHour);
            this.plugin.settings.visibleEndHour = n;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName("Working hours start")
      .setDesc("Start of the working window (0-23). Used for the 'Working hours open' stat.")
      .addText((t) =>
        t
          .setValue(this.plugin.settings.workStartHour.toString())
          .onChange(async (v) => {
            this.plugin.settings.workStartHour = clampInt(
              v,
              0,
              23,
              this.plugin.settings.workStartHour,
            );
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName("Working hours end")
      .setDesc("End of the working window (1-24, must exceed start).")
      .addText((t) =>
        t
          .setValue(this.plugin.settings.workEndHour.toString())
          .onChange(async (v) => {
            this.plugin.settings.workEndHour = clampInt(
              v,
              1,
              24,
              this.plugin.settings.workEndHour,
            );
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName("Wake hour")
      .setDesc("Start of the awake window (0-23). Used for the 'Day available' stat.")
      .addText((t) =>
        t
          .setValue(this.plugin.settings.wakeHour.toString())
          .onChange(async (v) => {
            this.plugin.settings.wakeHour = clampInt(
              v,
              0,
              23,
              this.plugin.settings.wakeHour,
            );
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName("Sleep hour")
      .setDesc("End of the awake window (1-24, must exceed wake hour).")
      .addText((t) =>
        t
          .setValue(this.plugin.settings.sleepHour.toString())
          .onChange(async (v) => {
            this.plugin.settings.sleepHour = clampInt(
              v,
              1,
              24,
              this.plugin.settings.sleepHour,
            );
            await this.plugin.saveSettings();
          }),
      );
  }

  private renderProjectsSection(containerEl: HTMLElement): void {
    new Setting(containerEl).setName("Projects").setHeading();

    new Setting(containerEl)
      .setName("Project tag prefix")
      .setDesc(buildProjectPrefixDesc())
      .addText((t) =>
        t.setValue(this.plugin.settings.prefixes.project).onChange(async (v) => {
          if (/^[a-zA-Z]+$/.test(v)) {
            this.plugin.settings.prefixes.project = v;
            await this.plugin.saveSettings();
            this.display();
          }
        }),
      );

    const prefix = this.plugin.settings.prefixes.project;

    const desc = document.createDocumentFragment();
    desc.append(
      "Pin a color to a specific project. Enter just the project name — the plugin matches it against ",
      makeCode(`#${prefix}/<name>`),
      " in your tasks. For example, entering ",
      makeCode("sally"),
      " matches ",
      makeCode(`#${prefix}/sally`),
      ". Don't include the ",
      makeCode(`${prefix}/`),
      " prefix; it's added automatically. Projects without a pinned color get distinct auto-assigned colors alphabetically.",
    );

    new Setting(containerEl)
      .setName("Project colors")
      .setDesc(desc)
      .addButton((b) =>
        b
          .setButtonText("Add project color")
          .setCta()
          .onClick(async () => {
            this.plugin.settings.projectColors.push({
              project: "",
              color:
                DEFAULT_PALETTE[
                  this.plugin.settings.projectColors.length %
                    DEFAULT_PALETTE.length
                ],
            });
            await this.plugin.saveSettings();
            this.display();
          }),
      );

    const list = containerEl.createDiv({ cls: "dp-project-colors-list" });
    this.plugin.settings.projectColors.forEach((entry, idx) => {
      const row = list.createDiv({ cls: "dp-project-color-row" });

      const nameWrap = row.createDiv({ cls: "dp-project-color-name-wrap" });
      nameWrap.createSpan({
        cls: "dp-project-color-prefix",
        text: `#${prefix}/`,
      });
      const nameInput = nameWrap.createEl("input", {
        cls: "dp-project-color-name",
        attr: { type: "text", placeholder: "project-name" },
      });
      nameInput.value = entry.project;
      const stripPrefix = (s: string): string =>
        s.replace(new RegExp(`^#?${prefix}/`, "i"), "");
      nameInput.addEventListener("input", () => {
        const original = nameInput.value;
        const stripped = stripPrefix(original);
        if (stripped !== original) {
          const pos = Math.max(0, nameInput.selectionStart ?? 0);
          nameInput.value = stripped;
          const newPos = Math.max(0, pos - (original.length - stripped.length));
          nameInput.setSelectionRange(newPos, newPos);
        }
      });
      nameInput.addEventListener("change", async () => {
        const v = stripPrefix(nameInput.value.trim());
        nameInput.value = v;
        this.plugin.settings.projectColors[idx].project = v;
        await this.plugin.saveSettings();
      });

      const colorInput = row.createEl("input", {
        cls: "dp-project-color-swatch",
        attr: { type: "color" },
      });
      colorInput.value = normalizeHex(entry.color);
      colorInput.addEventListener("change", async () => {
        if (isValidHex(colorInput.value)) {
          this.plugin.settings.projectColors[idx].color = colorInput.value;
          hexInput.value = colorInput.value;
          await this.plugin.saveSettings();
        }
      });

      const hexInput = row.createEl("input", {
        cls: "dp-project-color-hex",
        attr: { type: "text", placeholder: "#5B8DEF" },
      });
      hexInput.value = entry.color;
      hexInput.addEventListener("change", async () => {
        const v = hexInput.value.trim();
        if (isValidHex(v)) {
          this.plugin.settings.projectColors[idx].color = v;
          colorInput.value = normalizeHex(v);
          await this.plugin.saveSettings();
        } else {
          hexInput.value = entry.color;
        }
      });

      const remove = row.createEl("button", {
        cls: "dp-project-color-remove",
        text: "Remove",
      });
      remove.addEventListener("click", async () => {
        this.plugin.settings.projectColors.splice(idx, 1);
        await this.plugin.saveSettings();
        this.display();
      });
    });
  }
}

function clampInt(v: string, lo: number, hi: number, fallback: number): number {
  const n = parseInt(v, 10);
  if (isNaN(n)) return fallback;
  return Math.max(lo, Math.min(hi, n));
}

function makeCode(text: string): HTMLElement {
  const el = document.createElement("code");
  el.textContent = text;
  return el;
}

function buildDurationDesc(): DocumentFragment {
  const f = document.createDocumentFragment();
  f.append(
    "How long a task takes. Default prefix ",
    makeCode("d"),
    ". Combine hours and minutes — at least one is required. Examples: ",
    makeCode("#d/30m"),
    " (30 minutes), ",
    makeCode("#d/2h"),
    " (2 hours), ",
    makeCode("#d/1h30m"),
    " (1 hour 30 minutes), ",
    makeCode("#d/90m"),
    " (also 1h30m).",
  );
  return f;
}

function buildTimeDesc(): DocumentFragment {
  const f = document.createDocumentFragment();
  f.append(
    "Start time of a task. Default prefix ",
    makeCode("t"),
    ". 12-hour format with an ",
    makeCode("a"),
    " / ",
    makeCode("am"),
    " / ",
    makeCode("p"),
    " / ",
    makeCode("pm"),
    " suffix. Minutes go right after the hour with no colon. Examples: ",
    makeCode("#t/9a"),
    " (9:00 AM), ",
    makeCode("#t/930a"),
    " (9:30 AM), ",
    makeCode("#t/130p"),
    " (1:30 PM), ",
    makeCode("#t/12p"),
    " (noon).",
  );
  return f;
}

function buildOrderDesc(): DocumentFragment {
  const f = document.createDocumentFragment();
  f.append(
    "Manual ordering for unscheduled tasks. Default prefix ",
    makeCode("o"),
    ". The plugin manages this automatically when you drag to reorder unscheduled cards, so you usually don't type it yourself. Example: ",
    makeCode("#o/3"),
    " puts a task third in the unscheduled list.",
  );
  return f;
}

function buildProjectPrefixDesc(): DocumentFragment {
  const f = document.createDocumentFragment();
  f.append(
    "Groups tasks by project for color-coding. Default prefix ",
    makeCode("p"),
    ". Tag a task with ",
    makeCode("#p/<name>"),
    " — for example, ",
    makeCode("#p/sally"),
    " or ",
    makeCode("#p/work-1"),
    " — and the timeline block plus the row in the Project totals table will share the same color. Names can use letters, digits, dashes, and underscores.",
  );
  return f;
}

function normalizeHex(hex: string): string {
  const trimmed = hex.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(trimmed)) return trimmed.toLowerCase();
  if (/^#[0-9a-fA-F]{3}$/.test(trimmed)) {
    const s = trimmed.slice(1);
    return (
      "#" +
      s
        .split("")
        .map((c) => c + c)
        .join("")
        .toLowerCase()
    );
  }
  return "#5b8def";
}

class FileSuggest extends AbstractInputSuggest<TFile> {
  private inputEl: HTMLInputElement;
  private onSelectFile: (file: TFile) => void | Promise<void>;

  constructor(
    app: App,
    inputEl: HTMLInputElement,
    onSelectFile: (file: TFile) => void | Promise<void>,
  ) {
    super(app, inputEl);
    this.inputEl = inputEl;
    this.onSelectFile = onSelectFile;
  }

  protected getSuggestions(query: string): TFile[] {
    const q = query.toLowerCase();
    const files = this.app.vault.getMarkdownFiles();
    const matches = q
      ? files.filter((f) => f.path.toLowerCase().includes(q))
      : files;
    return matches.sort((a, b) => a.path.localeCompare(b.path)).slice(0, 50);
  }

  renderSuggestion(file: TFile, el: HTMLElement): void {
    el.addClass("dp-file-suggestion");
    el.createDiv({ cls: "dp-file-suggestion-name", text: file.basename });
    const parent = file.parent?.path;
    if (parent && parent !== "/") {
      el.createDiv({ cls: "dp-file-suggestion-path", text: parent });
    }
  }

  selectSuggestion(file: TFile): void {
    this.inputEl.value = file.path;
    this.inputEl.dispatchEvent(new Event("input"));
    void this.onSelectFile(file);
    this.close();
  }
}
