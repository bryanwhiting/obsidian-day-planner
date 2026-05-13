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
  DEFAULT_WEEKDAY_TEMPLATES,
  DEFAULT_JOURNAL_SETTINGS,
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
import {
  buildPeopleSuggestions,
  buildPersonLinkInsert,
  createPerson,
  findPersonByName,
  sanitizePersonName,
} from "./people";
import { collectUnfinished } from "./collect";
import { runJournal } from "./journal";
import { HabitsScanner } from "./habits";
import { HabitsStatsView, VIEW_TYPE_HABITS_STATS } from "./habitsView";
import { MultiDayView, VIEW_TYPE_MULTI_DAY } from "./multiDayView";
import { ShellView, VIEW_TYPE_SHELL } from "./shellView";
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

    this.registerView(
      VIEW_TYPE_MULTI_DAY,
      (leaf) => new MultiDayView(leaf, this),
    );

    this.registerView(
      VIEW_TYPE_SHELL,
      (leaf) => new ShellView(leaf, this),
    );

    this.addRibbonIcon("layout-dashboard", "Open Today shell", () => {
      void this.activateShellView();
    });

    this.addRibbonIcon("calendar-clock", "Open Today", () => {
      void this.activateView();
    });

    this.addRibbonIcon("calendar-range", "Open multi-day view", () => {
      void this.activateMultiDayView();
    });

    this.addCommand({
      id: "open-today-shell",
      name: "Open Today shell",
      callback: () => void this.activateShellView(),
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
      name: "Open reporting",
      callback: () => void this.activateHabitsStatsView(),
    });

    this.addCommand({
      id: "open-multi-day",
      name: "Open multi-day view",
      hotkeys: [{ modifiers: ["Mod", "Shift"], key: "M" }],
      callback: () => void this.activateMultiDayView(),
    });

    this.addCommand({
      id: "open-combined-popout",
      name: "Open Today + multi-day + reporting in popout",
      callback: () => void this.openCombinedPopout(),
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

    this.addCommand({
      id: "collect-unfinished",
      name: "Collect unfinished tasks into inbox",
      callback: () => void collectUnfinished(this),
    });

    this.addCommand({
      id: "journal-begin-day",
      name: "Log Begin Day",
      callback: () => void runJournal(this, "beginDay"),
    });

    this.addCommand({
      id: "journal-close-day",
      name: "Log Close Day",
      callback: () => void runJournal(this, "closeDay"),
    });

    this.addCommand({
      id: "journal-distraction",
      name: "Log Distraction",
      callback: () => void runJournal(this, "distractions"),
    });

    this.addCommand({
      id: "journal-brain-dump",
      name: "Log Brain Dump",
      callback: () => void runJournal(this, "brainDump"),
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
          templatesByDay: this.settings.dailyNoteTemplatesByDay,
          dateLinkFormat: this.settings.dateLinkFormat,
          prefixes: this.settings.prefixes,
          quotesFile: this.settings.quotesFile,
          addCreatedTag: this.settings.addCreatedTagToFrontmatter,
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
      dailyNoteTemplatesByDay: {
        ...DEFAULT_WEEKDAY_TEMPLATES,
        ...(data?.dailyNoteTemplatesByDay ?? {}),
      },
      journal: {
        beginDay: {
          ...DEFAULT_JOURNAL_SETTINGS.beginDay,
          ...(data?.journal?.beginDay ?? {}),
        },
        closeDay: {
          ...DEFAULT_JOURNAL_SETTINGS.closeDay,
          ...(data?.journal?.closeDay ?? {}),
        },
        distractions: {
          ...DEFAULT_JOURNAL_SETTINGS.distractions,
          ...(data?.journal?.distractions ?? {}),
        },
        brainDump: {
          ...DEFAULT_JOURNAL_SETTINGS.brainDump,
          ...(data?.journal?.brainDump ?? {}),
        },
      },
      projectColors: Array.isArray(data?.projectColors)
        ? data!.projectColors!.filter(
            (c) => c && typeof c.project === "string" && typeof c.color === "string",
          )
        : [],
      upcomingTagOverrides: Array.isArray(data?.upcomingTagOverrides)
        ? data!.upcomingTagOverrides!.filter(
            (o) =>
              o &&
              typeof o.tag === "string" &&
              typeof o.daysAhead === "number" &&
              Number.isFinite(o.daysAhead),
          )
        : [],
      upcomingFields: this.resolveUpcomingFields(data),
    };
    // Drop legacy keys from the previous schema so they don't get re-saved
    // forever via the spread above. Harmless if absent.
    const sx = this.settings as unknown as Record<string, unknown>;
    delete sx.birthdayField;
    delete sx.anniversaryField;
    delete sx.birthdayIcon;
    delete sx.anniversaryIcon;
  }

  // Loads `upcomingFields` from saved data, falling back to a migration from
  // the deprecated four-field shape (birthdayField/anniversaryField/
  // birthdayIcon/anniversaryIcon) for users who saved data on the prior
  // release. Empty `field` entries are dropped. If nothing usable is found,
  // returns a fresh clone of the defaults.
  private resolveUpcomingFields(
    data: Partial<TodaySettings> | null,
  ): TodaySettings["upcomingFields"] {
    const raw = (data as unknown as Record<string, unknown>) ?? {};
    if (Array.isArray(raw.upcomingFields)) {
      const cleaned = raw.upcomingFields
        .filter(
          (f) =>
            f &&
            typeof (f as { field?: unknown }).field === "string" &&
            typeof (f as { icon?: unknown }).icon === "string",
        )
        .map((f) => ({
          field: (f as { field: string }).field.trim(),
          icon: (f as { icon: string }).icon.trim(),
        }))
        .filter((f) => f.field.length > 0);
      if (cleaned.length > 0) return cleaned;
    }
    const legacy: { field: string; icon: string }[] = [];
    const bField = typeof raw.birthdayField === "string"
      ? (raw.birthdayField as string).trim()
      : "";
    const bIcon = typeof raw.birthdayIcon === "string"
      ? (raw.birthdayIcon as string).trim()
      : "";
    const aField = typeof raw.anniversaryField === "string"
      ? (raw.anniversaryField as string).trim()
      : "";
    const aIcon = typeof raw.anniversaryIcon === "string"
      ? (raw.anniversaryIcon as string).trim()
      : "";
    if (bField) legacy.push({ field: bField, icon: bIcon || "cake" });
    if (aField) legacy.push({ field: aField, icon: aIcon || "gem" });
    if (legacy.length > 0) return legacy;
    return DEFAULT_SETTINGS.upcomingFields.map((f) => ({ ...f }));
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
      templatesByDay: this.settings.dailyNoteTemplatesByDay,
      dateLinkFormat: this.settings.dateLinkFormat,
      prefixes: this.settings.prefixes,
      quotesFile: this.settings.quotesFile,
      addCreatedTag: this.settings.addCreatedTagToFrontmatter,
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

  async openCombinedPopout(): Promise<void> {
    if (Platform.isMobile) {
      // Popout windows are desktop-only; just open each in a tab.
      await this.activateView();
      await this.activateMultiDayView();
      await this.activateHabitsStatsView();
      return;
    }
    const todayLeaf = this.app.workspace.openPopoutLeaf({
      size: { width: 1500, height: 950 },
    });
    await todayLeaf.setViewState({ type: VIEW_TYPE_TODAY, active: true });
    const multiLeaf = this.app.workspace.createLeafBySplit(
      todayLeaf,
      "vertical",
    );
    await multiLeaf.setViewState({ type: VIEW_TYPE_MULTI_DAY, active: false });
    const habitsLeaf = this.app.workspace.createLeafBySplit(
      multiLeaf,
      "vertical",
    );
    await habitsLeaf.setViewState({
      type: VIEW_TYPE_HABITS_STATS,
      active: false,
    });
    this.app.workspace.setActiveLeaf(todayLeaf, { focus: true });
  }

  async activateShellView(): Promise<void> {
    const existing = this.app.workspace.getLeavesOfType(VIEW_TYPE_SHELL);
    let leaf: WorkspaceLeaf | null;
    if (existing.length > 0) {
      leaf = existing[0];
      this.app.workspace.revealLeaf(leaf);
      return;
    }
    leaf = this.app.workspace.getLeaf("tab");
    if (!leaf) return;
    await leaf.setViewState({
      type: VIEW_TYPE_SHELL,
      active: true,
    });
    this.app.workspace.revealLeaf(leaf);
  }

  async activateMultiDayView(): Promise<void> {
    const existing = this.app.workspace.getLeavesOfType(VIEW_TYPE_MULTI_DAY);
    let leaf: WorkspaceLeaf | null;
    if (existing.length > 0) {
      leaf = existing[0];
      this.app.workspace.revealLeaf(leaf);
      return;
    }
    leaf = this.app.workspace.getLeaf("tab");
    if (!leaf) return;
    await leaf.setViewState({
      type: VIEW_TYPE_MULTI_DAY,
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
  // Optional async action that runs before the insert. Currently used by the
  // "Create new person" entry under the @-trigger picker: at selection time we
  // create the file in the people folder, then resolve the insert from the
  // created path so the inserted wiki link points at the real note.
  action?: "create-person";
  // Free-form payload — for "create-person" it's the sanitized basename to
  // create (separate from `display` so we can render "Create new person: …").
  payload?: string;
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
      // The date trigger doubles as the people trigger: allow up to one space
      // so "@apr 5" date queries and two-word person names like "@Bob Dylan"
      // (existing match or "Create new person: …") keep the popover open. A
      // second space closes it.
      if (best.kind !== "date" || /\s.*\s/.test(query)) {
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

      // Offer "Create new person: <name>" as the last entry when the user
      // typed something, the people folder is configured, and nobody already
      // has that exact basename. Skipped for queries that match a relative
      // date keyword exactly so "today" / "tomorrow" don't tempt the user
      // into creating a person literally named "today".
      const createItems: SuggestItem[] = [];
      const trimmed = query.trim();
      const sanitized = sanitizePersonName(trimmed);
      const exactDateMatch = dateItems.some(
        (d) => d.display.toLowerCase() === trimmed.toLowerCase(),
      );
      if (
        settings.peopleFolder &&
        sanitized.length > 0 &&
        !exactDateMatch &&
        !findPersonByName(this.app, settings.peopleFolder, sanitized)
      ) {
        createItems.push({
          kind,
          display: `Create new person: ${sanitized}`,
          subDisplay: ` in ${settings.peopleFolder}`,
          insert: "",
          action: "create-person",
          payload: sanitized,
        });
      }
      return [...dateItems, ...personItems, ...createItems];
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
    if (item.action === "create-person" && item.payload) {
      // Capture context up front — close() clears `this.context` and we still
      // need to know which range to replace once the async create resolves.
      const ctx = this.context;
      const settings = this.plugin.settings;
      this.close();
      void (async () => {
        const file = await createPerson(this.app, {
          folder: settings.peopleFolder,
          name: item.payload!,
          seedFields: settings.upcomingFields.map((f) => f.field),
          templatePath: settings.personTemplate,
        });
        if (!file) return;
        const insert = buildPersonLinkInsert(this.app, file.path) + " ";
        ctx.editor.replaceRange(insert, ctx.start, ctx.end);
      })();
      return;
    }
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
