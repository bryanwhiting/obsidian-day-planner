import {
  Editor,
  EditorPosition,
  EditorSuggest,
  EditorSuggestContext,
  EditorSuggestTriggerInfo,
  Platform,
  Plugin,
  TFile,
  WorkspaceLeaf,
} from "obsidian";
import { polyfill as mobileDragDropPolyfill } from "mobile-drag-drop";
import { TodayView, VIEW_TYPE_TODAY } from "./view";
import {
  TodaySettings,
  TodaySettingTab,
  DEFAULT_SETTINGS,
  DEFAULT_AUTOCOMPLETE,
} from "./settings";
import {
  DEFAULT_PREFIXES,
  buildTimeOptions,
  formatCompactDuration,
  timeDisplayToTagBody,
} from "./parser";
import {
  buildDateSuggestions,
  buildDateLinkInsert,
  applyDailyNoteTemplateIfEmpty,
  ensureDailyNote,
} from "./dailyNote";
import { buildPeopleSuggestions, buildPersonLinkInsert } from "./people";
import { HabitsScanner } from "./habits";
import { HabitsStatsView, VIEW_TYPE_HABITS_STATS } from "./habitsView";
import { moment } from "obsidian";

let polyfillInstalled = false;

export default class TodayPlugin extends Plugin {
  settings!: TodaySettings;
  habitsScanner!: HabitsScanner;

  async onload(): Promise<void> {
    await this.loadSettings();
    this.habitsScanner = new HabitsScanner(this.app);

    // HTML5 drag-and-drop doesn't fire on touch — install the polyfill once
    // on mobile so timeline blocks and unscheduled cards become draggable.
    // `holdToDrag` keeps tap-to-open intact (drag only after a brief press).
    if (Platform.isMobile && !polyfillInstalled) {
      mobileDragDropPolyfill({ holdToDrag: 200 });
      polyfillInstalled = true;
    }

    this.registerView(
      VIEW_TYPE_TODAY,
      (leaf) => new TodayView(leaf, this),
    );

    this.registerView(
      VIEW_TYPE_HABITS_STATS,
      (leaf) => new HabitsStatsView(leaf, this),
    );

    this.addRibbonIcon("calendar-clock", "Open Today", () => {
      void this.activateView();
    });

    this.addCommand({
      id: "open-today",
      name: "Open Today",
      callback: () => void this.activateView(),
    });

    this.addCommand({
      id: "open-calendar",
      name: "Open calendar",
      callback: () => void this.activateView({ openCalendar: true }),
    });

    this.addCommand({
      id: "open-habits-stats",
      name: "Open habit stats",
      callback: () => void this.activateHabitsStatsView(),
    });

    this.addCommand({
      id: "open-daily-note-today",
      name: "Open today's daily note",
      callback: () => void this.openDailyNoteForOffset(0),
    });

    this.addCommand({
      id: "open-daily-note-yesterday",
      name: "Open yesterday's daily note",
      callback: () => void this.openDailyNoteForOffset(-1),
    });

    this.addCommand({
      id: "open-daily-note-tomorrow",
      name: "Open tomorrow's daily note",
      callback: () => void this.openDailyNoteForOffset(1),
    });

    this.addSettingTab(new TodaySettingTab(this.app, this));
    this.registerEditorSuggest(new InlineSuggest(this));

    // When Obsidian (or any other plugin) creates a daily-note file empty —
    // most commonly when the user clicks an unresolved wiki link to a future
    // date — drop our template into it. The handler is a no-op for files
    // outside the daily folder, files whose names don't parse against the
    // daily-note format, and files that already have content (so our own
    // ensureDailyNote path, which writes content up front, isn't disturbed).
    this.registerEvent(
      this.app.vault.on("create", (af) => {
        if (!(af instanceof TFile)) return;
        void applyDailyNoteTemplateIfEmpty(this.app, af, {
          folder: this.settings.dailyNoteFolderFallback,
          format: this.settings.dailyNoteFormatFallback,
          template: this.settings.dailyNoteTemplate,
          dateLinkFormat: this.settings.dateLinkFormat,
        });
      }),
    );
  }

  async onunload(): Promise<void> {}

  async loadSettings(): Promise<void> {
    const data = (await this.loadData()) as Partial<TodaySettings> | null;
    this.settings = {
      ...DEFAULT_SETTINGS,
      ...(data ?? {}),
      prefixes: { ...DEFAULT_PREFIXES, ...(data?.prefixes ?? {}) },
      autocomplete: {
        ...DEFAULT_AUTOCOMPLETE,
        ...(data?.autocomplete ?? {}),
      },
      projectColors: Array.isArray(data?.projectColors)
        ? data!.projectColors!.filter(
            (c) => c && typeof c.project === "string" && typeof c.color === "string",
          )
        : [],
    };
  }

  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
    for (const leaf of this.app.workspace.getLeavesOfType(
      VIEW_TYPE_TODAY,
    )) {
      const view = leaf.view as TodayView;
      view.scheduleRender();
    }
  }

  async activateView(opts: { openCalendar?: boolean } = {}): Promise<void> {
    const existing = this.app.workspace.getLeavesOfType(VIEW_TYPE_TODAY);
    let leaf: WorkspaceLeaf | null;
    if (existing.length > 0) {
      leaf = existing[0];
      this.app.workspace.revealLeaf(leaf);
    } else {
      leaf = this.app.workspace.getRightLeaf(false);
      if (!leaf) return;
      await leaf.setViewState({
        type: VIEW_TYPE_TODAY,
        active: true,
      });
      this.app.workspace.revealLeaf(leaf);
    }
    if (opts.openCalendar && leaf.view instanceof TodayView) {
      leaf.view.openCalendar();
    }
  }

  async openDailyNoteForOffset(dayOffset: number): Promise<void> {
    const target = moment().startOf("day").add(dayOffset, "day").toDate();
    const fallback = {
      folder: this.settings.dailyNoteFolderFallback,
      format: this.settings.dailyNoteFormatFallback,
      template: this.settings.dailyNoteTemplate,
      dateLinkFormat: this.settings.dateLinkFormat,
    };
    const file = await ensureDailyNote(this.app, target, fallback, false);
    const leaf = this.app.workspace.getLeaf(false);
    await leaf.openFile(file);
  }

  async activateHabitsStatsView(): Promise<void> {
    const existing = this.app.workspace.getLeavesOfType(
      VIEW_TYPE_HABITS_STATS,
    );
    let leaf: WorkspaceLeaf | null;
    if (existing.length > 0) {
      leaf = existing[0];
      this.app.workspace.revealLeaf(leaf);
      return;
    }
    leaf = this.app.workspace.getRightLeaf(false);
    if (!leaf) return;
    await leaf.setViewState({
      type: VIEW_TYPE_HABITS_STATS,
      active: true,
    });
    this.app.workspace.revealLeaf(leaf);
  }
}

type SuggestKind = "project" | "time" | "duration" | "date";

interface SuggestItem {
  kind: SuggestKind;
  // Display string shown in the popover (e.g. "sally", "7:30p", "1h30m").
  display: string;
  // The text that gets inserted in place of the trigger+query. Always a full
  // tag with trailing space so the cursor lands ready for the next word.
  insert: string;
  // Optional sub-segment shown muted alongside the display (e.g. "/back-end"
  // for a sub-project).
  subDisplay?: string;
}

// Single editor-suggest that handles every configured inline trigger
// (project / time / duration). Whichever trigger appears latest in the line
// before the cursor wins, and the resulting selection replaces that trigger
// range with the corresponding "#prefix/value " tag.
class InlineSuggest extends EditorSuggest<SuggestItem> {
  private plugin: TodayPlugin;

  constructor(plugin: TodayPlugin) {
    super(plugin.app);
    this.plugin = plugin;
  }

  onTrigger(
    cursor: EditorPosition,
    editor: Editor,
    _file: TFile | null,
  ): EditorSuggestTriggerInfo | null {
    const auto = this.plugin.settings.autocomplete;
    const candidates: { trigger: string; kind: SuggestKind }[] = [
      { trigger: auto.projectTrigger, kind: "project" },
      { trigger: auto.timeTrigger, kind: "time" },
      { trigger: auto.durationTrigger, kind: "duration" },
      { trigger: auto.dateTrigger, kind: "date" },
    ];
    const line = editor.getLine(cursor.line);
    const before = line.slice(0, cursor.ch);
    // Pick by latest match-end so the trigger nearest the cursor wins; on
    // ties prefer the longer trigger so e.g. "#@" beats its own "@" suffix
    // when both are configured.
    let best: { idx: number; kind: SuggestKind; trigger: string } | null = null;
    for (const c of candidates) {
      if (!c.trigger) continue;
      const idx = before.lastIndexOf(c.trigger);
      if (idx < 0) continue;
      if (!best) {
        best = { idx, kind: c.kind, trigger: c.trigger };
        continue;
      }
      const bestEnd = best.idx + best.trigger.length;
      const cEnd = idx + c.trigger.length;
      if (cEnd > bestEnd) {
        best = { idx, kind: c.kind, trigger: c.trigger };
      } else if (cEnd === bestEnd && c.trigger.length > best.trigger.length) {
        best = { idx, kind: c.kind, trigger: c.trigger };
      }
    }
    if (!best) return null;
    // For "#"-starting triggers, require non-whitespace earlier on the line so
    // a column-0 "##" stays a markdown heading rather than opening the picker.
    // Other triggers (e.g. "@") have no markdown ambiguity, so allow them to
    // fire at the start of a line — this matters for plain notes and task
    // lines where the user might begin a sentence with "@today".
    if (
      best.trigger.startsWith("#") &&
      !/\S/.test(before.slice(0, best.idx))
    ) {
      return null;
    }
    const query = before.slice(best.idx + best.trigger.length);
    if (/#/.test(query)) return null;
    if (/\s/.test(query)) {
      // Only the date trigger accepts a space — for "@apr 5" style queries.
      if (best.kind !== "date" || !/^[A-Za-z]+ \d{0,2}$/.test(query)) {
        return null;
      }
    }
    return {
      start: { line: cursor.line, ch: best.idx },
      end: cursor,
      // Smuggle the kind through the query string so getSuggestions knows
      // which list to build. Format: "<kind>:<query>".
      query: `${best.kind}:${query}`,
    };
  }

  getSuggestions(ctx: EditorSuggestContext): SuggestItem[] {
    const colon = ctx.query.indexOf(":");
    if (colon < 0) return [];
    const kind = ctx.query.slice(0, colon) as SuggestKind;
    const query = ctx.query.slice(colon + 1);
    const prefixes = this.plugin.settings.prefixes;
    if (kind === "project") {
      const pool = this.collectProjects();
      return this.filter(pool, query).map((name) => {
        const slash = name.indexOf("/");
        return {
          kind,
          display: slash >= 0 ? name.slice(0, slash) : name,
          subDisplay: slash >= 0 ? name.slice(slash) : undefined,
          insert: `#${prefixes.project}/${name} `,
        };
      });
    }
    if (kind === "time") {
      const settings = this.plugin.settings;
      const pool = buildTimeOptions(
        settings.visibleStartHour,
        settings.visibleEndHour,
      );
      return this.filter(pool, query).map((display) => ({
        kind,
        display,
        insert: `#${prefixes.time}/${timeDisplayToTagBody(display)} `,
      }));
    }
    if (kind === "date") {
      const settings = this.plugin.settings;
      const fmt = settings.dateLinkFormat;
      const dateItems: SuggestItem[] = buildDateSuggestions(query).map((s) => ({
        kind,
        display: s.keyword,
        subDisplay: fmt.trim() ? ` ${moment(s.date).format(fmt.trim())}` : undefined,
        insert:
          buildDateLinkInsert(
            this.app,
            s.date,
            settings.dailyNoteFormatFallback,
            settings.dailyNoteFolderFallback,
            fmt,
          ) + " ",
      }));
      const personItems: SuggestItem[] = buildPeopleSuggestions(
        this.app,
        settings.peopleFolder,
        query,
      ).map((p) => ({
        kind,
        display: p.basename,
        subDisplay: p.folder ? ` ${p.folder}` : undefined,
        insert: buildPersonLinkInsert(this.app, p.path) + " ",
      }));
      return [...dateItems, ...personItems];
    }
    const pool = this.plugin.settings.quickDurationsMin.map((m) =>
      formatCompactDuration(m),
    );
    return this.filter(pool, query).map((display) => ({
      kind,
      display,
      insert: `#${prefixes.duration}/${display} `,
    }));
  }

  renderSuggestion(item: SuggestItem, el: HTMLElement): void {
    el.addClass("dp-project-suggest-item");
    el.createSpan({ text: item.display });
    if (item.subDisplay) {
      el.createSpan({ cls: "dp-project-suggest-sub", text: item.subDisplay });
    }
  }

  selectSuggestion(
    item: SuggestItem,
    _evt: MouseEvent | KeyboardEvent,
  ): void {
    if (!this.context) return;
    this.context.editor.replaceRange(
      item.insert,
      this.context.start,
      this.context.end,
    );
    this.close();
  }

  private filter(pool: string[], query: string, limit = 12): string[] {
    const needle = query.trim().toLowerCase();
    if (!needle) return pool.slice(0, limit);
    const starts = pool.filter((p) => p.toLowerCase().startsWith(needle));
    const contains = pool.filter(
      (p) =>
        !p.toLowerCase().startsWith(needle) &&
        p.toLowerCase().includes(needle),
    );
    return [...starts, ...contains].slice(0, limit);
  }

  private collectProjects(): string[] {
    const prefix = `#${this.plugin.settings.prefixes.project}/`.toLowerCase();
    const names = new Set<string>();
    const cache = this.app.metadataCache as unknown as {
      getTags?: () => Record<string, number>;
    };
    const tags = cache.getTags?.() ?? {};
    for (const tag of Object.keys(tags)) {
      if (tag.toLowerCase().startsWith(prefix)) {
        const name = tag.slice(prefix.length);
        if (name) names.add(name);
      }
    }
    for (const pc of this.plugin.settings.projectColors) {
      if (pc.project) names.add(pc.project);
    }
    return Array.from(names).sort((a, b) => a.localeCompare(b));
  }
}
