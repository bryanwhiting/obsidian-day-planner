import {
  AbstractInputSuggest,
  App,
  PluginSettingTab,
  Setting,
  TFile,
} from "obsidian";
import type TodayPlugin from "./main";
import {
  TagPrefixes,
  DEFAULT_PREFIXES,
  formatCompactDuration,
  parseCompactDuration,
} from "./parser";
import { ContextTag, ProjectColor, DEFAULT_PALETTE, isValidHex } from "./colors";
import { TagMigrationModal, PrefixChange } from "./migrate";

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
  quickDurationsMin: number[];
  projectColors: ProjectColor[];
  contextTags: ContextTag[];
  // Bare hashtag (no leading "#") that flags a task as a "note" — an event the
  // user wants on their day at a specific time but doesn't want occupying a
  // calendar block. Notes render as a dot in the timeline gutter instead of a
  // block. Default: "note", matching #note. Set to "tc/note" for #tc/note, etc.
  noteTag: string;
  timelineHeightDesktop: string;
  timelineHeightMobile: string;
  pomodoroWorkMin: number;
  pomodoroBreakMin: number;
  pomodoroAutoStart: boolean;
  pomodoroAutoCycle: boolean;
  pomodoroAutoReturn: boolean;
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
  quickDurationsMin: [15, 30, 45, 60, 90, 120],
  projectColors: [],
  contextTags: [],
  noteTag: "note",
  timelineHeightDesktop: "",
  timelineHeightMobile: "",
  pomodoroWorkMin: 25,
  pomodoroBreakMin: 5,
  pomodoroAutoStart: true,
  pomodoroAutoCycle: true,
  pomodoroAutoReturn: true,
};

const CSS_LENGTH_RE = /^\d+(?:\.\d+)?(?:px|vh|vw|em|rem|%)$/;

export const MAX_QUICK_DURATIONS = 9;

// Parses a comma-separated list like "5m, 10m, 1h, 1h30m" into unique minute
// values, capped at MAX_QUICK_DURATIONS. Returns null if any token is invalid
// or the list is empty.
export function parseQuickDurations(raw: string): number[] | null {
  const tokens = raw
    .split(",")
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
  if (tokens.length === 0) return null;
  const out: number[] = [];
  const seen = new Set<number>();
  for (const tok of tokens) {
    const min = parseCompactDuration(tok);
    if (min === null) return null;
    if (seen.has(min)) continue;
    seen.add(min);
    out.push(min);
    if (out.length >= MAX_QUICK_DURATIONS) break;
  }
  return out.length > 0 ? out : null;
}

export function formatQuickDurations(mins: number[]): string {
  return mins.map((m) => formatCompactDuration(m)).join(", ");
}

/** Accept bare integers (treated as px) or "<num><unit>" with a known unit.
 *  Returns the canonical CSS length, or null if the input is not parseable. */
export function parseTimelineHeight(raw: string): string | null {
  const v = raw.trim();
  if (!v) return null;
  if (/^\d+(?:\.\d+)?$/.test(v)) return `${v}px`;
  return CSS_LENGTH_RE.test(v) ? v : null;
}

export class TodaySettingTab extends PluginSettingTab {
  plugin: TodayPlugin;
  // Captured the first time the tab is opened, cleared on hide(). Persists
  // across re-renders triggered from inside display() (e.g. project section
  // calling this.display() after a prefix edit), so we can compare the user's
  // final state against where they started when the tab closes.
  private prefixSnapshot: TagPrefixes | null = null;

  constructor(app: App, plugin: TodayPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    if (!this.prefixSnapshot) {
      this.prefixSnapshot = { ...this.plugin.settings.prefixes };
    }
    containerEl.empty();

    this.renderDefaultsSection(containerEl);
    this.renderPomodoroSection(containerEl);
    this.renderProjectsSection(containerEl);
    this.renderContextTagsSection(containerEl);
    this.renderNotesSection(containerEl);
    this.renderTemplatingSection(containerEl);
    this.renderDayConfigSection(containerEl);
  }

  hide(): void {
    if (!this.prefixSnapshot) return;
    const snap = this.prefixSnapshot;
    this.prefixSnapshot = null;
    const current = this.plugin.settings.prefixes;
    const keys: (keyof TagPrefixes)[] = [
      "duration",
      "time",
      "order",
      "project",
      "exercise",
      "taskId",
    ];
    const changes: PrefixChange[] = [];
    for (const key of keys) {
      const oldP = snap[key];
      const newP = current[key];
      if (oldP && newP && oldP !== newP) {
        changes.push({ key, oldPrefix: oldP, newPrefix: newP });
      }
    }
    if (changes.length > 0) {
      new TagMigrationModal(this.app, {
        changes,
        folder: this.plugin.settings.dailyNoteFolderFallback,
      }).open();
    }
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
      .setName("Quick duration chips")
      .setDesc(
        `Comma-separated durations for the chips on the new-task and edit-task modals (max ${MAX_QUICK_DURATIONS}). Accepts forms like 5m, 1h, 1h30m, 90m.`,
      )
      .addText((t) => {
        const initial = formatQuickDurations(
          this.plugin.settings.quickDurationsMin,
        );
        t.setPlaceholder("15m, 30m, 45m, 1h, 1h30m, 2h").setValue(initial);
        t.inputEl.addEventListener("blur", async () => {
          const parsed = parseQuickDurations(t.inputEl.value);
          if (parsed) {
            this.plugin.settings.quickDurationsMin = parsed;
            await this.plugin.saveSettings();
            t.setValue(formatQuickDurations(parsed));
          } else {
            t.setValue(formatQuickDurations(this.plugin.settings.quickDurationsMin));
          }
        });
      });

    new Setting(containerEl)
      .setName("Snap interval (minutes)")
      .setDesc(
        "Drag-drop snaps to this granularity. Also controls the sub-marks revealed on hover in the timeline gutter (e.g. 15 → :15, :30, :45).",
      )
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

    new Setting(containerEl)
      .setName("Exercise tag prefix")
      .setDesc(buildExerciseDesc())
      .addText((t) =>
        t
          .setValue(this.plugin.settings.prefixes.exercise)
          .onChange(async (v) => {
            if (/^[a-zA-Z]+$/.test(v)) {
              this.plugin.settings.prefixes.exercise = v;
              await this.plugin.saveSettings();
            }
          }),
      );

    new Setting(containerEl)
      .setName("Task ID tag prefix")
      .setDesc(buildTaskIdDesc())
      .addText((t) =>
        t
          .setValue(this.plugin.settings.prefixes.taskId)
          .onChange(async (v) => {
            if (/^[a-zA-Z]+$/.test(v)) {
              this.plugin.settings.prefixes.taskId = v;
              await this.plugin.saveSettings();
            }
          }),
      );
  }

  private renderPomodoroSection(containerEl: HTMLElement): void {
    new Setting(containerEl).setName("Pomodoro").setHeading();

    new Setting(containerEl)
      .setName("Work duration (minutes)")
      .setDesc("Length of one focus interval.")
      .addText((t) =>
        t
          .setValue(this.plugin.settings.pomodoroWorkMin.toString())
          .onChange(async (v) => {
            this.plugin.settings.pomodoroWorkMin = clampInt(
              v,
              1,
              240,
              this.plugin.settings.pomodoroWorkMin,
            );
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName("Rest duration (minutes)")
      .setDesc("Length of one break between focus intervals.")
      .addText((t) =>
        t
          .setValue(this.plugin.settings.pomodoroBreakMin.toString())
          .onChange(async (v) => {
            this.plugin.settings.pomodoroBreakMin = clampInt(
              v,
              1,
              60,
              this.plugin.settings.pomodoroBreakMin,
            );
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName("Auto-start timer")
      .setDesc("Begin counting down as soon as focus mode opens.")
      .addToggle((t) =>
        t
          .setValue(this.plugin.settings.pomodoroAutoStart)
          .onChange(async (v) => {
            this.plugin.settings.pomodoroAutoStart = v;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName("Auto-cycle work and rest")
      .setDesc(
        "When a phase ends, automatically roll into the next one. If off, the timer waits for a click.",
      )
      .addToggle((t) =>
        t
          .setValue(this.plugin.settings.pomodoroAutoCycle)
          .onChange(async (v) => {
            this.plugin.settings.pomodoroAutoCycle = v;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName("Auto-return to main window")
      .setDesc(
        "When the focus view exits inside a popped-out window, move the Today view back to the main Obsidian window.",
      )
      .addToggle((t) =>
        t
          .setValue(this.plugin.settings.pomodoroAutoReturn)
          .onChange(async (v) => {
            this.plugin.settings.pomodoroAutoReturn = v;
            await this.plugin.saveSettings();
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

    new Setting(containerEl)
      .setName("Timeline height (desktop)")
      .setDesc(
        "Max height of the scrollable timeline on desktop. Bare numbers are treated as px (e.g. 600). Units accepted: px, vh, vw, em, rem, %. Leave blank for the default (60vh).",
      )
      .addText((t) =>
        t
          .setPlaceholder("60vh")
          .setValue(this.plugin.settings.timelineHeightDesktop)
          .onChange(async (v) => {
            const trimmed = v.trim();
            if (trimmed === "" || parseTimelineHeight(trimmed) !== null) {
              this.plugin.settings.timelineHeightDesktop = trimmed;
              await this.plugin.saveSettings();
            }
          }),
      );

    new Setting(containerEl)
      .setName("Timeline height (mobile)")
      .setDesc(
        "Max height of the scrollable timeline on mobile. Bare numbers are treated as px (e.g. 200). Units accepted: px, vh, vw, em, rem, %. Leave blank for the default (40vh).",
      )
      .addText((t) =>
        t
          .setPlaceholder("40vh")
          .setValue(this.plugin.settings.timelineHeightMobile)
          .onChange(async (v) => {
            const trimmed = v.trim();
            if (trimmed === "" || parseTimelineHeight(trimmed) !== null) {
              this.plugin.settings.timelineHeightMobile = trimmed;
              await this.plugin.saveSettings();
            }
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
      " prefix; it's added automatically. Projects without a pinned color get distinct auto-assigned colors alphabetically. ",
      "Sub-projects inherit their parent project's color by default — to override a single sub-project, enter ",
      makeCode("project/subproject"),
      " (e.g. ",
      makeCode("silvermine/back-end"),
      " to recolor only ",
      makeCode(`#${prefix}/silvermine/back-end`),
      " while other ",
      makeCode(`#${prefix}/silvermine/…`),
      " tasks keep the parent color).",
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
        attr: { type: "text", placeholder: "project or project/subproject" },
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

      const iconInput = row.createEl("input", {
        cls: "dp-project-color-icon",
        attr: {
          type: "text",
          placeholder: "lucide icon",
          spellcheck: "false",
        },
      });
      iconInput.value = entry.icon ?? "";
      iconInput.addEventListener("change", async () => {
        const v = iconInput.value.trim();
        this.plugin.settings.projectColors[idx].icon = v || undefined;
        await this.plugin.saveSettings();
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

  private renderContextTagsSection(containerEl: HTMLElement): void {
    new Setting(containerEl).setName("Context tags").setHeading();

    const desc = document.createDocumentFragment();
    desc.append(
      "Pin a color and a Lucide icon to a hashtag (e.g. ",
      makeCode("#meeting"),
      " or ",
      makeCode("#walking"),
      "). Tasks containing the hashtag are colored with the context color (overriding the project color) and show the icon on the block. Browse icon names at ",
      makeAnchor("https://lucide.dev/icons", "lucide.dev/icons"),
      ".",
    );

    new Setting(containerEl)
      .setName("Tags")
      .setDesc(desc)
      .addButton((b) =>
        b
          .setButtonText("Add context tag")
          .setCta()
          .onClick(async () => {
            this.plugin.settings.contextTags.push({
              tag: "",
              color:
                DEFAULT_PALETTE[
                  this.plugin.settings.contextTags.length %
                    DEFAULT_PALETTE.length
                ],
              icon: "",
            });
            await this.plugin.saveSettings();
            this.display();
          }),
      );

    const list = containerEl.createDiv({ cls: "dp-project-colors-list" });
    this.plugin.settings.contextTags.forEach((entry, idx) => {
      const row = list.createDiv({ cls: "dp-project-color-row" });

      const nameWrap = row.createDiv({ cls: "dp-project-color-name-wrap" });
      nameWrap.createSpan({ cls: "dp-project-color-prefix", text: "#" });
      const nameInput = nameWrap.createEl("input", {
        cls: "dp-project-color-name",
        attr: { type: "text", placeholder: "tag" },
      });
      nameInput.value = entry.tag;
      // Strip leading "#" if the user types it.
      nameInput.addEventListener("input", () => {
        if (nameInput.value.startsWith("#")) {
          const pos = Math.max(0, (nameInput.selectionStart ?? 1) - 1);
          nameInput.value = nameInput.value.replace(/^#+/, "");
          nameInput.setSelectionRange(pos, pos);
        }
      });
      nameInput.addEventListener("change", async () => {
        const v = nameInput.value.trim().replace(/^#+/, "");
        nameInput.value = v;
        this.plugin.settings.contextTags[idx].tag = v;
        await this.plugin.saveSettings();
      });

      const colorInput = row.createEl("input", {
        cls: "dp-project-color-swatch",
        attr: { type: "color" },
      });
      colorInput.value = normalizeHex(entry.color);
      colorInput.addEventListener("change", async () => {
        if (isValidHex(colorInput.value)) {
          this.plugin.settings.contextTags[idx].color = colorInput.value;
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
          this.plugin.settings.contextTags[idx].color = v;
          colorInput.value = normalizeHex(v);
          await this.plugin.saveSettings();
        } else {
          hexInput.value = entry.color;
        }
      });

      const iconInput = row.createEl("input", {
        cls: "dp-project-color-icon",
        attr: {
          type: "text",
          placeholder: "lucide icon",
          spellcheck: "false",
        },
      });
      iconInput.value = entry.icon ?? "";
      iconInput.addEventListener("change", async () => {
        this.plugin.settings.contextTags[idx].icon = iconInput.value.trim();
        await this.plugin.saveSettings();
      });

      const remove = row.createEl("button", {
        cls: "dp-project-color-remove",
        text: "Remove",
      });
      remove.addEventListener("click", async () => {
        this.plugin.settings.contextTags.splice(idx, 1);
        await this.plugin.saveSettings();
        this.display();
      });
    });
  }

  private renderNotesSection(containerEl: HTMLElement): void {
    new Setting(containerEl).setName("Notes").setHeading();

    const desc = document.createDocumentFragment();
    desc.append(
      "A timed task containing this hashtag renders as a small dot in the timeline gutter instead of a calendar block — useful for events you need to be aware of (a delivery window, a kid's pickup) but don't want eating up planning space. Hover the dot to see the title and description. Enter the bare tag without the leading ",
      makeCode("#"),
      " — e.g. ",
      makeCode("note"),
      " matches ",
      makeCode("#note"),
      ", or ",
      makeCode("tc/note"),
      " matches ",
      makeCode("#tc/note"),
      ". Untimed notes still appear in the unscheduled list.",
    );

    new Setting(containerEl)
      .setName("Note tag")
      .setDesc(desc)
      .addText((t) =>
        t
          .setPlaceholder("note")
          .setValue(this.plugin.settings.noteTag)
          .onChange(async (v) => {
            this.plugin.settings.noteTag = v.trim().replace(/^#+/, "");
            await this.plugin.saveSettings();
          }),
      );
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

function buildExerciseDesc(): DocumentFragment {
  const f = document.createDocumentFragment();
  f.append(
    "Logs a workout set inline in your daily note. Default prefix ",
    makeCode("x"),
    ". Format: ",
    makeCode("#x/<name>/<reps>"),
    " for bodyweight, or ",
    makeCode("#x/<name>/<reps>/<weight>"),
    " when weighted. Examples: ",
    makeCode("#x/pushups/25"),
    " (25 pushups), ",
    makeCode("#x/bench/10/135"),
    " (10 reps at 135 lbs). The plugin sums reps per exercise (and per weight bucket when weighted) and renders a one-line summary at the top of the section.",
  );
  return f;
}

function buildTaskIdDesc(): DocumentFragment {
  const f = document.createDocumentFragment();
  f.append(
    "Cross-references a task across days. Default prefix ",
    makeCode("tid"),
    ". When you migrate a task's incomplete sub-tasks to the next day from the edit modal (",
    makeCode("Move to tomorrow → Migrate incomplete"),
    "), the plugin marks the original parent as completed, generates a 6-character ID, and stamps ",
    makeCode("#tid/<id>"),
    " onto both the source-day parent and the new-day copy so you can search either side and find the partner. Example: ",
    makeCode("#tid/a3xK9p"),
    ". The migrate-incomplete flow lets you check off the work you finished today while carrying the task title and unfinished sub-tasks (without the completed ones) into tomorrow's note — useful for showing partial progress while continuing the task. If all sub-tasks are already done, the original is still marked complete and a fresh empty parent is queued for tomorrow, so you can keep working on it.",
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
    " — and the timeline block plus the row in the Project totals table will share the same color. Add an optional sub-project segment with ",
    makeCode("#p/<name>/<sub>"),
    " (e.g. ",
    makeCode("#p/silvermine/back-end"),
    "); sub-projects are shown next to the project label and broken out under the project's row in the totals table. Names can use letters, digits, dashes, and underscores.",
  );
  return f;
}

function makeAnchor(href: string, text: string): HTMLElement {
  const a = document.createElement("a");
  a.href = href;
  a.textContent = text;
  a.target = "_blank";
  a.rel = "noopener";
  return a;
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
