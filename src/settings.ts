import {
  AbstractInputSuggest,
  App,
  PluginSettingTab,
  Setting,
  setIcon,
  TFile,
  TFolder,
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

// Inline-autocomplete trigger strings. Each opens a different picker when
// typed in the task title input or directly in a daily note. Stored as a
// record so future shortcut triggers can be added without changing the
// Settings shape.
export interface AutocompleteSettings {
  // Default "##" — opens the project picker.
  projectTrigger: string;
  // Default "#@" — opens the time picker.
  timeTrigger: string;
  // Default "#$" — opens the duration picker.
  durationTrigger: string;
  // Default "@" — opens the relative-date picker (today/tomorrow/Nd → daily-note link).
  dateTrigger: string;
}

export const DEFAULT_AUTOCOMPLETE: AutocompleteSettings = {
  projectTrigger: "##",
  timeTrigger: "#@",
  durationTrigger: "#$",
  dateTrigger: "@",
};

// Optional vault paths to template files keyed by day-of-week. When non-empty,
// the matching weekday template is appended to the base daily note template
// (`dailyNoteTemplate`) at note-creation time. Empty values fall back to the
// base template alone. Keys are lowercase day names so they line up with the
// JS Date.getDay() table (0=Sunday..6=Saturday) via WEEKDAY_NAMES below.
export interface DailyNoteWeekdayTemplates {
  sunday: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
}

export const DEFAULT_WEEKDAY_TEMPLATES: DailyNoteWeekdayTemplates = {
  sunday: "",
  monday: "",
  tuesday: "",
  wednesday: "",
  thursday: "",
  friday: "",
  saturday: "",
};

export const WEEKDAY_NAMES: (keyof DailyNoteWeekdayTemplates)[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

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
  autocomplete: AutocompleteSettings;
  dailyNoteFormatFallback: string;
  dailyNoteFolderFallback: string;
  dailyNoteTemplate: string;
  // Per-weekday templates appended to the base `dailyNoteTemplate` when a
  // daily note is created on that day of the week. Empty values are skipped.
  dailyNoteTemplatesByDay: DailyNoteWeekdayTemplates;
  defaultDurationMin: number;
  quickDurationsMin: number[];
  projectColors: ProjectColor[];
  contextTags: ContextTag[];
  // Bare hashtag (no leading "#") that flags a task as a "note" — an event the
  // user wants on their day at a specific time but doesn't want occupying a
  // calendar block. Notes render as a dot in the timeline gutter instead of a
  // block. Default: "note", matching #note. Set to "tc/note" for #tc/note, etc.
  noteTag: string;
  // Bare hashtag (no leading "#") that flags an "intention" line for the day.
  // The text following the tag on the line is shown next to the daily-note
  // path in the dashboard header. Default: "intention", matching #intention.
  intentionTag: string;
  timelineHeightDesktop: string;
  timelineHeightMobile: string;
  pomodoroWorkMin: number;
  pomodoroBreakMin: number;
  pomodoroAutoStart: boolean;
  pomodoroAutoCycle: boolean;
  pomodoroAutoReturn: boolean;
  taskIdLength: number;
  // Moment.js format for the visible label of @-trigger date links. Empty
  // string falls back to the bare filename (no alias).
  dateLinkFormat: string;
  // Vault folder that holds one markdown file per person. When non-empty, the
  // @-trigger picker mixes basenames from this folder in with the date
  // suggestions so typing "@bob" surfaces every Bob alongside today/tomorrow.
  // Empty disables people lookup entirely.
  peopleFolder: string;
  // Path to the habits-source file (e.g. "daily/_habits.md"). Plain hashtag
  // lines like `#h-day/call-mom Call mom` define habits. Append `/N` to set a
  // weekly/monthly target (e.g. `#h-week/laundry/2`, `#h-day/drink/4`).
  habitsFile: string;
  // Single-letter tag prefix for habits. Default "h" → goal tags look like
  // `#h-day/call-mom`, log tags like `#h/call-mom`. Validated against
  // /^[a-zA-Z]+$/.
  habitPrefix: string;
  // First day of the habit week. 0=Sunday..6=Saturday. Default Sunday.
  habitWeekStart: number;
  // When true, completed habits disappear from the dashboard line; when
  // false, they remain with strikethrough styling.
  habitsHideCompleted: boolean;
  // Number of buckets shown in each heatmap row in the stats pane.
  habitsStatsWindow: number;
  // Set after the one-shot rewrite of legacy `#h-<period>/<slug>` log tags
  // inside daily notes to the short `#h/<slug>` form. Goal tags in the habits
  // file keep the `-<period>` segment.
  habitLogTagsMigrated: boolean;
  // When the user picks a prior task from the title-autocomplete in the task
  // edit/new modal, copy the source task's sub-tasks too. Project, duration,
  // description, and tags are always copied; sub-tasks are gated by this flag
  // because most "recurring task" use-cases want a fresh, empty checklist.
  copySubtasksOnAutocomplete: boolean;
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
  autocomplete: { ...DEFAULT_AUTOCOMPLETE },
  dailyNoteFormatFallback: "YYYY-MM-DD",
  dailyNoteFolderFallback: "daily",
  dailyNoteTemplate: "",
  dailyNoteTemplatesByDay: { ...DEFAULT_WEEKDAY_TEMPLATES },
  defaultDurationMin: 15,
  quickDurationsMin: [15, 30, 45, 60, 90, 120],
  projectColors: [],
  contextTags: [],
  noteTag: "note",
  intentionTag: "intention",
  timelineHeightDesktop: "",
  timelineHeightMobile: "",
  pomodoroWorkMin: 25,
  pomodoroBreakMin: 5,
  pomodoroAutoStart: true,
  pomodoroAutoCycle: true,
  pomodoroAutoReturn: true,
  taskIdLength: 4,
  dateLinkFormat: "ddd, MMM D, YYYY",
  peopleFolder: "",
  habitsFile: "daily/_habits.md",
  habitPrefix: "h",
  habitWeekStart: 0,
  habitsHideCompleted: false,
  habitsStatsWindow: 10,
  habitLogTagsMigrated: false,
  copySubtasksOnAutocomplete: false,
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

type SettingsTab =
  | "general"
  | "templating"
  | "tasks"
  | "day"
  | "view"
  | "projects"
  | "pomodoro"
  | "habits";

interface TabSpec {
  label: string;
  icon: string;
}

const TAB_SPECS: Record<SettingsTab, TabSpec> = {
  general: { label: "Automations", icon: "sliders-horizontal" },
  templating: { label: "Templating", icon: "file-text" },
  tasks: { label: "Tasks", icon: "list-checks" },
  day: { label: "Day", icon: "sun" },
  view: { label: "View", icon: "eye" },
  projects: { label: "Projects", icon: "folder-kanban" },
  pomodoro: { label: "Pomodoro", icon: "timer" },
  habits: { label: "Habits", icon: "repeat" },
};

export class TodaySettingTab extends PluginSettingTab {
  plugin: TodayPlugin;
  // Captured the first time the tab is opened, cleared on hide(). Persists
  // across re-renders triggered from inside display() (e.g. project section
  // calling this.display() after a prefix edit), so we can compare the user's
  // final state against where they started when the tab closes.
  private prefixSnapshot: TagPrefixes | null = null;
  private activeTab: SettingsTab = "general";

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
    containerEl.addClass("dp-settings");

    this.renderIntro(containerEl);
    this.renderTabs(containerEl);

    const pane = containerEl.createDiv({ cls: "dp-settings-pane" });
    switch (this.activeTab) {
      case "general":
        this.renderAutocompleteSection(pane);
        break;
      case "templating":
        this.renderTemplatingSection(pane);
        break;
      case "tasks":
        this.renderTaskDefaultsSection(pane);
        this.renderTaskIdSection(pane);
        this.renderNotesSection(pane);
        break;
      case "day":
        this.renderDaySection(pane);
        break;
      case "view":
        this.renderViewSection(pane);
        break;
      case "projects":
        this.renderProjectsSection(pane);
        this.renderContextTagsSection(pane);
        break;
      case "pomodoro":
        this.renderPomodoroSection(pane);
        break;
      case "habits":
        this.renderHabitsSection(pane);
        break;
    }
  }

  private renderIntro(containerEl: HTMLElement): void {
    const intro = containerEl.createDiv({ cls: "dp-settings-intro" });
    intro.createEl("h2", {
      cls: "dp-settings-intro-title",
      text: "Today plugin settings",
    });
    const sub = intro.createEl("p", { cls: "dp-settings-intro-sub" });
    sub.append(
      "Configure how the Today dashboard parses your daily notes, colors your projects, and runs the pomodoro and habit trackers. Tag prefixes and trigger strings are global — change them here and the plugin migrates existing tags on close. See the ",
      makeAnchor(
        "https://github.com/silvermineai/obsidian-today",
        "README",
      ),
      " for the full tag reference.",
    );
  }

  private renderTabs(containerEl: HTMLElement): void {
    const bar = containerEl.createDiv({ cls: "dp-settings-tabs" });
    (Object.keys(TAB_SPECS) as SettingsTab[]).forEach((tab) => {
      const spec = TAB_SPECS[tab];
      const btn = bar.createEl("button", { cls: "dp-settings-tab" });
      const iconEl = btn.createSpan({ cls: "dp-settings-tab-icon" });
      setIcon(iconEl, spec.icon);
      btn.createSpan({ cls: "dp-settings-tab-label", text: spec.label });
      if (tab === this.activeTab) btn.addClass("is-active");
      btn.addEventListener("click", () => {
        if (this.activeTab === tab) return;
        this.activeTab = tab;
        this.display();
      });
    });
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
      "actual",
      "taskContext",
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

  private renderTaskDefaultsSection(containerEl: HTMLElement): void {
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
      .setName("Task context tag prefix")
      .setDesc(
        "Prefix for free-form task labels (e.g. #tc/billable, #tc/client-acme). Multiple tags per task are allowed and rendered as chips next to the project label.",
      )
      .addText((t) =>
        t
          .setValue(this.plugin.settings.prefixes.taskContext)
          .onChange(async (v) => {
            if (/^[a-zA-Z]+$/.test(v)) {
              this.plugin.settings.prefixes.taskContext = v;
              await this.plugin.saveSettings();
            }
          }),
      );

    new Setting(containerEl)
      .setName("Copy sub-tasks on title autocomplete")
      .setDesc(
        "When you pick a prior task from the title autocomplete in the new/edit task modal, also copy its sub-tasks (all unchecked). Off keeps just the project, duration, description, and tags.",
      )
      .addToggle((t) =>
        t
          .setValue(this.plugin.settings.copySubtasksOnAutocomplete)
          .onChange(async (v) => {
            this.plugin.settings.copySubtasksOnAutocomplete = v;
            await this.plugin.saveSettings();
          }),
      );

  }

  private renderPomodoroSection(containerEl: HTMLElement): void {
    new Setting(containerEl).setName("Pomodoro").setHeading();

    new Setting(containerEl)
      .setName("Actual time tag prefix")
      .setDesc(
        "Prefix for actual-time tags written by the pomodoro timer (e.g. #ta/25m). Whole minutes only; subsequent sessions add to the existing tag.",
      )
      .addText((t) =>
        t
          .setValue(this.plugin.settings.prefixes.actual)
          .onChange(async (v) => {
            if (/^[a-zA-Z]+$/.test(v)) {
              this.plugin.settings.prefixes.actual = v;
              await this.plugin.saveSettings();
            }
          }),
      );

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

  private renderTaskIdSection(containerEl: HTMLElement): void {
    new Setting(containerEl).setName("Task ID").setHeading();

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

    new Setting(containerEl)
      .setName("Task ID length")
      .setDesc(
        "Number of alphanumeric characters in IDs minted by Migrate incomplete. Shorter is easier to scan; longer reduces collision odds. Existing IDs in your notes are still recognized regardless of length.",
      )
      .addText((t) =>
        t
          .setValue(this.plugin.settings.taskIdLength.toString())
          .onChange(async (v) => {
            this.plugin.settings.taskIdLength = clampInt(
              v,
              2,
              12,
              this.plugin.settings.taskIdLength,
            );
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
      .addText((t) => {
        t.setValue(this.plugin.settings.dailyNoteFolderFallback).onChange(
          async (v) => {
            this.plugin.settings.dailyNoteFolderFallback = v.trim();
            await this.plugin.saveSettings();
          },
        );
        new FolderSuggest(this.app, t.inputEl, async (folder) => {
          t.setValue(folder.path);
          this.plugin.settings.dailyNoteFolderFallback = folder.path;
          await this.plugin.saveSettings();
        });
      });

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

    new Setting(containerEl).setName("Per-weekday templates").setHeading();

    const weekdayDesc = containerEl.createEl("p", {
      cls: "setting-item-description",
    });
    weekdayDesc.append(
      "Optional vault paths to weekday-specific template files. The matching file's contents are appended to the base ",
      makeCode("Daily note template"),
      " when a daily note is created on that day — handy for routines that vary by day (e.g. ",
      makeCode("monday.md"),
      " for the weekly review). Leave a row blank to skip; the base template still applies.",
    );

    const dayLabels: Record<keyof DailyNoteWeekdayTemplates, string> = {
      sunday: "Sunday",
      monday: "Monday",
      tuesday: "Tuesday",
      wednesday: "Wednesday",
      thursday: "Thursday",
      friday: "Friday",
      saturday: "Saturday",
    };
    for (const day of WEEKDAY_NAMES) {
      new Setting(containerEl)
        .setName(dayLabels[day])
        .setDesc(`Appended to the base template on ${dayLabels[day]}.`)
        .addText((t) => {
          t.setPlaceholder(`Templates/${day}.md`)
            .setValue(this.plugin.settings.dailyNoteTemplatesByDay[day])
            .onChange(async (v) => {
              this.plugin.settings.dailyNoteTemplatesByDay[day] = v.trim();
              await this.plugin.saveSettings();
            });
          new FileSuggest(this.app, t.inputEl, async (file) => {
            t.setValue(file.path);
            this.plugin.settings.dailyNoteTemplatesByDay[day] = file.path;
            await this.plugin.saveSettings();
          });
        });
    }
  }

  private renderDaySection(containerEl: HTMLElement): void {
    new Setting(containerEl).setName("Day").setHeading();

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

  private renderViewSection(containerEl: HTMLElement): void {
    new Setting(containerEl).setName("View").setHeading();

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

  private renderAutocompleteSection(containerEl: HTMLElement): void {
    new Setting(containerEl).setName("Autocomplete").setHeading();

    const intro = containerEl.createEl("p", { cls: "setting-item-description" });
    intro.append(
      "Type a trigger string in a task title (in the new/edit modal) or in any markdown file to open a picker. Trigger strings can be anything that's unlikely to appear naturally — defaults are ",
      makeCode("##"),
      ", ",
      makeCode("#@"),
      ", ",
      makeCode("#$"),
      ", and ",
      makeCode("@"),
      ". Selecting a suggestion either fills the matching field in the modal, inserts the corresponding ",
      makeCode("#prefix/value"),
      " tag inline, or — for the date trigger — drops in a link to the matching daily note (",
      makeCode("@today"),
      ", ",
      makeCode("@tomorrow"),
      ", ",
      makeCode("@yesterday"),
      ", ",
      makeCode("@2d"),
      ", ",
      makeCode("@Nd"),
      "). These are mostly conveniences for mobile where typing is slow.",
    );

    new Setting(containerEl)
      .setName("Project trigger")
      .setDesc(
        "Opens the project picker. Modal: fills the project field. Editor: inserts #p/<name>.",
      )
      .addText((t) =>
        t
          .setPlaceholder("##")
          .setValue(this.plugin.settings.autocomplete.projectTrigger)
          .onChange(async (v) => {
            const trimmed = v.trim();
            if (!trimmed) return;
            this.plugin.settings.autocomplete.projectTrigger = trimmed;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName("Time trigger")
      .setDesc(
        "Opens the time picker. Suggestions are drawn from your visible-hours range at hour and half-hour marks. Inserts #t/<value>.",
      )
      .addText((t) =>
        t
          .setPlaceholder("#@")
          .setValue(this.plugin.settings.autocomplete.timeTrigger)
          .onChange(async (v) => {
            const trimmed = v.trim();
            if (!trimmed) return;
            this.plugin.settings.autocomplete.timeTrigger = trimmed;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName("Duration trigger")
      .setDesc(
        "Opens the duration picker. Suggestions come from your quick-duration chips. Modal: updates the duration selection. Editor: inserts #d/<value>.",
      )
      .addText((t) =>
        t
          .setPlaceholder("#$")
          .setValue(this.plugin.settings.autocomplete.durationTrigger)
          .onChange(async (v) => {
            const trimmed = v.trim();
            if (!trimmed) return;
            this.plugin.settings.autocomplete.durationTrigger = trimmed;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName("Date trigger")
      .setDesc(
        "Opens the relative-date picker. Suggestions: today, tomorrow, yesterday, and Nd (e.g. 2d, 7d). Selecting one inserts a link to the matching daily note.",
      )
      .addText((t) =>
        t
          .setPlaceholder("@")
          .setValue(this.plugin.settings.autocomplete.dateTrigger)
          .onChange(async (v) => {
            const trimmed = v.trim();
            if (!trimmed) return;
            this.plugin.settings.autocomplete.dateTrigger = trimmed;
            await this.plugin.saveSettings();
          }),
      );

    const dateFormatDesc = document.createDocumentFragment();
    dateFormatDesc.append(
      "Moment.js format for the visible label on date-trigger links. Default ",
      makeCode("ddd, MMM D, YYYY"),
      " renders as e.g. ",
      makeCode("Mon, Mar 5, 2026"),
      ". Leave blank to drop the alias and use just the file basename. The link target itself uses the daily-note format from the Templating section.",
    );
    new Setting(containerEl)
      .setName("Date link format")
      .setDesc(dateFormatDesc)
      .addText((t) =>
        t
          .setPlaceholder("ddd, MMM D, YYYY")
          .setValue(this.plugin.settings.dateLinkFormat)
          .onChange(async (v) => {
            this.plugin.settings.dateLinkFormat = v;
            await this.plugin.saveSettings();
          }),
      );

    const peopleDesc = document.createDocumentFragment();
    peopleDesc.append(
      "Vault folder containing one markdown file per person. When set, the date trigger also matches basenames in this folder — e.g. ",
      makeCode("@bob"),
      " surfaces every Bob alongside ",
      makeCode("today"),
      " / ",
      makeCode("tomorrow"),
      ". Picking a person inserts a link to their note. Leave blank to disable.",
    );
    new Setting(containerEl)
      .setName("People folder")
      .setDesc(peopleDesc)
      .addText((t) => {
        t.setPlaceholder("people")
          .setValue(this.plugin.settings.peopleFolder)
          .onChange(async (v) => {
            this.plugin.settings.peopleFolder = v.trim();
            await this.plugin.saveSettings();
          });
        new FolderSuggest(this.app, t.inputEl, async (folder) => {
          t.setValue(folder.path);
          this.plugin.settings.peopleFolder = folder.path;
          await this.plugin.saveSettings();
        });
      });
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

    const intentionDesc = document.createDocumentFragment();
    intentionDesc.append(
      "Anywhere this hashtag appears in the daily note, the rest of the line is treated as your intention for the day and shown next to the daily-note path in the dashboard header. Enter the bare tag without the leading ",
      makeCode("#"),
      " — e.g. ",
      makeCode("intention"),
      " matches ",
      makeCode("#intention be present"),
      ". If multiple ",
      makeCode("#intention"),
      " lines exist, only the first is shown.",
    );

    new Setting(containerEl)
      .setName("Intention tag")
      .setDesc(intentionDesc)
      .addText((t) =>
        t
          .setPlaceholder("intention")
          .setValue(this.plugin.settings.intentionTag)
          .onChange(async (v) => {
            this.plugin.settings.intentionTag = v.trim().replace(/^#+/, "");
            await this.plugin.saveSettings();
          }),
      );
  }

  private renderHabitsSection(containerEl: HTMLElement): void {
    new Setting(containerEl).setName("Habits").setHeading();

    const desc = document.createDocumentFragment();
    desc.append(
      "Habits live in a single source file as plain hashtag lines like ",
      makeCode("#h-day/call-mom Call mom"),
      " or ",
      makeCode("#h-week/review-monarch"),
      ". Append ",
      makeCode("/N"),
      " to set a per-period target — e.g. ",
      makeCode("#h-week/laundry/2"),
      " counts as done once two completed log entries appear in that week, and ",
      makeCode("#h-day/drink/4"),
      " expects four water-glasses each day. Daily notes log habits with the short shape ",
      makeCode("#h/<slug>"),
      " (or ",
      makeCode("#h/<slug>/N"),
      " to log multiples on one line — same grammar as exercise sets). Clicking a habit on the dashboard appends ",
      makeCode("- [x] <slug> #h/<slug>"),
      " to the displayed daily note; manually edit the line to add ",
      makeCode("/N"),
      " or to add another line for repeat completions.",
    );
    new Setting(containerEl).setDesc(desc);

    new Setting(containerEl)
      .setName("Habits file")
      .setDesc("Vault path to the habits-source file. Default: daily/_habits.md.")
      .addText((t) => {
        t.setPlaceholder("daily/_habits.md")
          .setValue(this.plugin.settings.habitsFile)
          .onChange(async (v) => {
            this.plugin.settings.habitsFile = v.trim();
            await this.plugin.saveSettings();
          });
        new FileSuggest(this.app, t.inputEl, async (file) => {
          t.setValue(file.path);
          this.plugin.settings.habitsFile = file.path;
          await this.plugin.saveSettings();
        });
      });

    new Setting(containerEl)
      .setName("Habit tag prefix")
      .setDesc(
        "Letter(s) used at the start of habit tags. Default `h` → goal tags `#h-day/call-mom`, log tags `#h/call-mom`.",
      )
      .addText((t) =>
        t
          .setPlaceholder("h")
          .setValue(this.plugin.settings.habitPrefix)
          .onChange(async (v) => {
            if (/^[a-zA-Z]+$/.test(v)) {
              this.plugin.settings.habitPrefix = v;
              await this.plugin.saveSettings();
            }
          }),
      );

    new Setting(containerEl)
      .setName("Week start")
      .setDesc(
        "First day of the habit week. Affects when weekly habits reset and how the weekly heatmap is bucketed.",
      )
      .addDropdown((d) =>
        d
          .addOption("0", "Sunday")
          .addOption("1", "Monday")
          .addOption("2", "Tuesday")
          .addOption("3", "Wednesday")
          .addOption("4", "Thursday")
          .addOption("5", "Friday")
          .addOption("6", "Saturday")
          .setValue(this.plugin.settings.habitWeekStart.toString())
          .onChange(async (v) => {
            const n = parseInt(v, 10);
            if (Number.isFinite(n) && n >= 0 && n <= 6) {
              this.plugin.settings.habitWeekStart = n;
              await this.plugin.saveSettings();
            }
          }),
      );

    new Setting(containerEl)
      .setName("Hide completed habits")
      .setDesc(
        "When on, every completed habit disappears from the dashboard. When off (default), a weekly/monthly habit appears with strikethrough only on the day it was actually checked — other days in the same window stay clean.",
      )
      .addToggle((t) =>
        t
          .setValue(this.plugin.settings.habitsHideCompleted)
          .onChange(async (v) => {
            this.plugin.settings.habitsHideCompleted = v;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName("Stats window")
      .setDesc(
        "Number of cells in each heatmap row in the stats pane (last N days / weeks / months). Range 5–30.",
      )
      .addText((t) =>
        t
          .setValue(this.plugin.settings.habitsStatsWindow.toString())
          .onChange(async (v) => {
            const n = clampInt(
              v,
              5,
              30,
              this.plugin.settings.habitsStatsWindow,
            );
            this.plugin.settings.habitsStatsWindow = n;
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
    "), the plugin marks the original parent as completed, generates a short alphanumeric ID (length configurable below), and stamps ",
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

class FolderSuggest extends AbstractInputSuggest<TFolder> {
  private inputEl: HTMLInputElement;
  private onSelectFolder: (folder: TFolder) => void | Promise<void>;

  constructor(
    app: App,
    inputEl: HTMLInputElement,
    onSelectFolder: (folder: TFolder) => void | Promise<void>,
  ) {
    super(app, inputEl);
    this.inputEl = inputEl;
    this.onSelectFolder = onSelectFolder;
  }

  protected getSuggestions(query: string): TFolder[] {
    const q = query.toLowerCase();
    const folders: TFolder[] = [];
    const walk = (folder: TFolder): void => {
      // Skip the vault root from the picker — it's almost never what the user
      // wants and shows up as an empty path that's ambiguous to read.
      if (folder.path !== "/") folders.push(folder);
      for (const child of folder.children) {
        if (child instanceof TFolder) walk(child);
      }
    };
    walk(this.app.vault.getRoot());
    const matches = q
      ? folders.filter((f) => f.path.toLowerCase().includes(q))
      : folders;
    return matches.sort((a, b) => a.path.localeCompare(b.path)).slice(0, 50);
  }

  renderSuggestion(folder: TFolder, el: HTMLElement): void {
    el.addClass("dp-file-suggestion");
    el.createDiv({ cls: "dp-file-suggestion-name", text: folder.name });
    const parent = folder.parent?.path;
    if (parent && parent !== "/") {
      el.createDiv({ cls: "dp-file-suggestion-path", text: parent });
    }
  }

  selectSuggestion(folder: TFolder): void {
    this.inputEl.value = folder.path;
    this.inputEl.dispatchEvent(new Event("input"));
    void this.onSelectFolder(folder);
    this.close();
  }
}
