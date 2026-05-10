import { ItemView, WorkspaceLeaf, TFile } from "obsidian";
import type TodayPlugin from "./main";
import {
  Habit,
  HabitPeriod,
  ExerciseGoal,
  parseHabitsFile,
  parseExerciseGoals,
  findHabitTaskLines,
  weekRange,
  monthRange,
  enumerateDailyNoteDatesInRange,
} from "./habits";
import {
  addDays,
  addMonths,
  startOfDay,
  type DailyNoteFallback,
} from "./dailyNote";
import {
  parseExercises,
  parseFileTasks,
  formatHoursDecimal,
} from "./parser";
import { resolveProjectColors } from "./colors";

export const VIEW_TYPE_HABITS_STATS = "today-habits-stats";

interface Bucket {
  start: Date;
  end: Date;
  label: string;
  tooltip: string;
  isCurrent: boolean;
}

interface HabitCell {
  bucket: Bucket;
  checkedCount: number;
}

interface HabitRow {
  habit: Habit;
  cells: HabitCell[];
  totalChecked: number;
  hits: number; // number of cells with at least one completion
}

interface GoalCell {
  bucket: Bucket;
  reps: number;
  target: number;
  met: boolean;
}

interface GoalRow {
  goal: ExerciseGoal;
  cells: GoalCell[];
  metCount: number;
}

interface PeriodSection {
  name: string;
  period: HabitPeriod;
  dateRange: string;
  buckets: Bucket[];
  rows: HabitRow[];
  goalRows: GoalRow[];
  totalReps: number;
  exerciseTotals: Map<string, number>;
}

type StatsTab = "habits" | "workouts" | "projects";

// Sentinel row name for completed tasks with no project. Real project names
// come from `[[wikilinks]]` and never match this literal.
const UNCATEGORIZED = "Uncategorized";
const UNCATEGORIZED_COLOR = "#8a8f98";

export class HabitsStatsView extends ItemView {
  plugin: TodayPlugin;
  private rerenderTimer: number | null = null;
  private activeTab: StatsTab = "habits";

  constructor(leaf: WorkspaceLeaf, plugin: TodayPlugin) {
    super(leaf);
    this.plugin = plugin;
  }

  getViewType(): string {
    return VIEW_TYPE_HABITS_STATS;
  }

  getDisplayText(): string {
    return "Reporting";
  }

  getIcon(): string {
    return "activity";
  }

  async onOpen(): Promise<void> {
    this.registerEvent(
      this.app.vault.on("modify", () => this.scheduleRender()),
    );
    this.registerEvent(
      this.app.vault.on("delete", () => this.scheduleRender()),
    );
    this.registerEvent(
      this.app.metadataCache.on("changed", () => this.scheduleRender()),
    );
    await this.render();
  }

  async onClose(): Promise<void> {
    if (this.rerenderTimer !== null) window.clearTimeout(this.rerenderTimer);
  }

  scheduleRender(): void {
    if (this.rerenderTimer !== null) window.clearTimeout(this.rerenderTimer);
    this.rerenderTimer = window.setTimeout(() => {
      this.rerenderTimer = null;
      void this.render();
    }, 100);
  }

  private async render(): Promise<void> {
    const root = this.containerEl.children[1] as HTMLElement;
    root.empty();
    root.addClass("today-root");
    root.addClass("dp-habit-stats");

    const settings = this.plugin.settings;
    const fallback: DailyNoteFallback = {
      folder: settings.dailyNoteFolderFallback,
      format: settings.dailyNoteFormatFallback,
      template: settings.dailyNoteTemplate,
      templatesByDay: settings.dailyNoteTemplatesByDay,
      dateLinkFormat: settings.dateLinkFormat,
      quotesFile: settings.quotesFile,
    };

    const heading = root.createDiv({ cls: "dp-habit-stats-header" });
    heading.createEl("h3", { text: "Reporting" });

    this.renderTabs(root);

    const today = startOfDay(new Date());
    const window = settings.habitsStatsWindow;

    if (this.activeTab === "projects") {
      await this.renderProjectsByWeek(root, today, window, fallback);
      return;
    }

    const { habits, goals } = await this.loadHabitsAndGoals();
    if (habits.length === 0 && goals.length === 0) {
      root.createDiv({
        cls: "dp-habit-stats-empty",
        text: `No habits found. Add tags like #${settings.habitPrefix}/day/<slug> to ${settings.habitsFile}.`,
      });
      return;
    }

    if (this.activeTab === "workouts") {
      await this.renderWorkoutLog(root, today, window, fallback);
      return;
    }

    const dayBuckets = this.buildDayBuckets(today, window);
    const weekBuckets = this.buildWeekBuckets(today, window);
    const monthBuckets = this.buildMonthBuckets(today, window);

    const daySection = await this.buildSection(
      "Day",
      "day",
      dayBuckets,
      habits,
      goals,
      fallback,
    );
    const weekSection = await this.buildSection(
      "Week",
      "week",
      weekBuckets,
      habits,
      goals,
      fallback,
    );
    const monthSection = await this.buildSection(
      "Month",
      "month",
      monthBuckets,
      habits,
      goals,
      fallback,
    );

    this.renderSection(root, daySection);
    this.renderSection(root, weekSection);
    this.renderSection(root, monthSection);
  }

  private renderTabs(parent: HTMLElement): void {
    const tabsEl = parent.createDiv({ cls: "dp-habit-stats-tabs" });
    const make = (key: StatsTab, label: string) => {
      const el = tabsEl.createEl("button", {
        cls:
          "dp-habit-stats-tab" +
          (this.activeTab === key ? " is-active" : ""),
        text: label,
      });
      el.onclick = () => {
        if (this.activeTab === key) return;
        this.activeTab = key;
        void this.render();
      };
    };
    make("habits", "Habits");
    make("workouts", "Workouts");
    make("projects", "Projects");
  }

  private async renderWorkoutLog(
    parent: HTMLElement,
    today: Date,
    window: number,
    fallback: DailyNoteFallback,
  ): Promise<void> {
    const settings = this.plugin.settings;
    const days: Date[] = [];
    for (let i = window - 1; i >= 0; i--) days.push(addDays(today, -i));

    // Sum reps per exercise per day, restricted to completed (`- [x]`) sets
    // — pending sets on a logged-but-not-yet-done day shouldn't show up as
    // reps the user "did".
    const repsByDate = new Map<number, Map<string, number>>();
    const totalsByName = new Map<string, number>();
    for (const d of days) {
      const c = await this.plugin.habitsScanner.readDateContent(d, fallback);
      const m = new Map<string, number>();
      if (c) {
        const summaries = parseExercises(c, settings.prefixes);
        for (const s of summaries) {
          let reps = 0;
          for (const set of s.sets) if (set.done) reps += set.reps;
          if (reps > 0) {
            m.set(s.name, reps);
            totalsByName.set(s.name, (totalsByName.get(s.name) ?? 0) + reps);
          }
        }
      }
      repsByDate.set(d.getTime(), m);
    }

    const sectionEl = parent.createDiv({ cls: "dp-heatmap-section" });
    if (totalsByName.size === 0) {
      sectionEl.createDiv({
        cls: "dp-heatmap-no-habits",
        text: "No completed exercise sets in this window.",
      });
      return;
    }

    // Sort exercises by total reps desc so the most-active ones land on top.
    const sortedNames = Array.from(totalsByName.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([n]) => n);

    const table = sectionEl.createEl("table", { cls: "dp-workout-log" });
    const thead = table.createEl("thead");
    const headRow = thead.createEl("tr");
    headRow.createEl("th", { cls: "dp-workout-log-name-h", text: "Exercise" });
    for (const d of days) {
      const th = headRow.createEl("th", {
        cls:
          "dp-workout-log-date" +
          (d.getTime() === today.getTime() ? " is-current" : ""),
        text: d.getDate().toString(),
      });
      th.title = d.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
    headRow.createEl("th", { cls: "dp-workout-log-total-h", text: "Total" });

    const tbody = table.createEl("tbody");
    for (const name of sortedNames) {
      const tr = tbody.createEl("tr");
      tr.createEl("td", { cls: "dp-workout-log-name", text: name });
      for (const d of days) {
        const reps = repsByDate.get(d.getTime())?.get(name) ?? 0;
        const td = tr.createEl("td", {
          cls:
            "dp-workout-log-cell" +
            (reps === 0 ? " is-empty" : "") +
            (d.getTime() === today.getTime() ? " is-current" : ""),
          text: reps > 0 ? reps.toString() : "",
        });
        td.title = `${name} · ${d.toLocaleDateString(undefined, {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        })}\n${reps} ${reps === 1 ? "rep" : "reps"}`;
      }
      tr.createEl("td", {
        cls: "dp-workout-log-total",
        text: (totalsByName.get(name) ?? 0).toLocaleString(),
      });
    }
  }

  private async renderProjectsByWeek(
    parent: HTMLElement,
    today: Date,
    window: number,
    fallback: DailyNoteFallback,
  ): Promise<void> {
    // Three stacked pivots — daily / weekly / monthly — so the user can see
    // recent activity at a glance and zoom out to longer trends without
    // switching tabs. Daily is fixed at 7 cols (the user-requested "last 7
    // days"); week + month follow `habitsStatsWindow` so all three sections
    // honor the same setting the heatmap uses.
    const dayBuckets = this.buildDayBuckets(today, 7);
    const weekBuckets = this.buildWeekBuckets(today, window);
    const monthBuckets = this.buildMonthBuckets(today, window);
    await this.renderProjectsPivot(parent, "Day", "day", dayBuckets, fallback);
    await this.renderProjectsPivot(parent, "Week", "week", weekBuckets, fallback);
    await this.renderProjectsPivot(
      parent,
      "Month",
      "month",
      monthBuckets,
      fallback,
    );
  }

  private async renderProjectsPivot(
    parent: HTMLElement,
    name: string,
    period: HabitPeriod,
    buckets: Bucket[],
    fallback: DailyNoteFallback,
  ): Promise<void> {
    const settings = this.plugin.settings;

    // Aggregate completed-task minutes into a (project → bucketIdx → mins)
    // map. Only `- [x]` lines count, matching how the workouts tab counts
    // only completed sets — a planned-but-not-done block shouldn't inflate
    // the "what I actually did" totals this report exists to show.
    // Tasks without a project are bucketed under UNCATEGORIZED so the
    // report shows where un-tagged time is going instead of silently
    // dropping it.
    const totals = new Map<string, number[]>();
    const colTotals = new Array<number>(buckets.length).fill(0);
    let grandTotal = 0;
    for (let bi = 0; bi < buckets.length; bi++) {
      const b = buckets[bi];
      for (const d of enumerateDailyNoteDatesInRange(b.start, b.end)) {
        const content = await this.plugin.habitsScanner.readDateContent(
          d,
          fallback,
        );
        if (!content) continue;
        const tasks = parseFileTasks(
          "",
          content,
          settings.prefixes,
          settings.defaultDurationMin,
        );
        for (const t of tasks) {
          if (!t.checked) continue;
          if (t.durationMin <= 0) continue;
          const key = t.project || UNCATEGORIZED;
          let row = totals.get(key);
          if (!row) {
            row = new Array<number>(buckets.length).fill(0);
            totals.set(key, row);
          }
          row[bi] += t.durationMin;
          colTotals[bi] += t.durationMin;
          grandTotal += t.durationMin;
        }
      }
    }

    const sectionEl = parent.createDiv({ cls: "dp-heatmap-section" });

    // Section header mirrors the Habits tab's "Day · Apr 27 – May 9" title
    // so the three-section stack reads consistently across tabs.
    const titleEl = sectionEl.createDiv({ cls: "dp-heatmap-row-title" });
    titleEl.createSpan({ cls: "dp-heatmap-row-name", text: name });
    titleEl.createSpan({ cls: "dp-heatmap-row-sep", text: " · " });
    titleEl.createSpan({
      cls: "dp-heatmap-row-range",
      text: formatBucketsRange(buckets, period),
    });

    if (totals.size === 0) {
      sectionEl.createDiv({
        cls: "dp-heatmap-no-habits",
        text: `No completed tasks in this ${name.toLowerCase()} window.`,
      });
      return;
    }

    // Don't feed UNCATEGORIZED into the palette resolver — it would burn an
    // auto-color that might collide with a real project. We hand it a fixed
    // neutral gray below.
    const colorMap = resolveProjectColors(
      Array.from(totals.keys())
        .filter((p) => p !== UNCATEGORIZED)
        .map((p) => ({ project: p })),
      settings.projectColors,
    );

    const rows = Array.from(totals.entries())
      .map(([rowName, cells]) => ({
        name: rowName,
        cells,
        rowTotal: cells.reduce((a, b) => a + b, 0),
      }))
      // Uncategorized always sinks to the bottom regardless of total — it's
      // a catch-all bucket, not a project the user is tracking.
      .sort((a, b) => {
        const au = a.name === UNCATEGORIZED ? 1 : 0;
        const bu = b.name === UNCATEGORIZED ? 1 : 0;
        if (au !== bu) return au - bu;
        return b.rowTotal - a.rowTotal || a.name.localeCompare(b.name);
      });

    const table = sectionEl.createEl("table", { cls: "dp-workout-log" });
    const thead = table.createEl("thead");
    const headRow = thead.createEl("tr");
    headRow.createEl("th", { cls: "dp-workout-log-name-h", text: "Project" });
    for (const b of buckets) {
      const th = headRow.createEl("th", {
        cls:
          "dp-workout-log-date" + (b.isCurrent ? " is-current" : ""),
        text: formatPivotColLabel(b, period),
      });
      th.title = b.tooltip;
    }
    headRow.createEl("th", { cls: "dp-workout-log-total-h", text: "Total" });

    const tbody = table.createEl("tbody");
    for (const row of rows) {
      const tr = tbody.createEl("tr");
      const nameTd = tr.createEl("td", { cls: "dp-workout-log-name" });
      const swatch = nameTd.createSpan({ cls: "dp-st-swatch" });
      const color =
        row.name === UNCATEGORIZED
          ? UNCATEGORIZED_COLOR
          : colorMap.get(row.name);
      if (color) swatch.style.backgroundColor = color;
      nameTd.createSpan({ text: row.name });
      for (let i = 0; i < buckets.length; i++) {
        const mins = row.cells[i];
        const td = tr.createEl("td", {
          cls:
            "dp-workout-log-cell" +
            (mins === 0 ? " is-empty" : "") +
            (buckets[i].isCurrent ? " is-current" : ""),
          text: mins > 0 ? formatHoursDecimal(mins) : "",
        });
        td.title = `${row.name} · ${buckets[i].tooltip}\n${formatHoursDecimal(mins)}`;
      }
      tr.createEl("td", {
        cls: "dp-workout-log-total",
        text: formatHoursDecimal(row.rowTotal),
      });
    }

    // Column-totals footer row. `tfoot` so the row visually pairs with the
    // header rather than blending into the body.
    const tfoot = table.createEl("tfoot");
    const footRow = tfoot.createEl("tr");
    footRow.createEl("td", {
      cls: "dp-workout-log-name dp-workout-log-foot",
      text: "Total",
    });
    for (let i = 0; i < buckets.length; i++) {
      footRow.createEl("td", {
        cls:
          "dp-workout-log-cell dp-workout-log-foot" +
          (colTotals[i] === 0 ? " is-empty" : "") +
          (buckets[i].isCurrent ? " is-current" : ""),
        text: colTotals[i] > 0 ? formatHoursDecimal(colTotals[i]) : "",
      });
    }
    footRow.createEl("td", {
      cls: "dp-workout-log-total dp-workout-log-foot",
      text: formatHoursDecimal(grandTotal),
    });
  }

  private async loadHabitsAndGoals(): Promise<{
    habits: Habit[];
    goals: ExerciseGoal[];
  }> {
    const path = this.plugin.settings.habitsFile;
    const f = this.app.vault.getAbstractFileByPath(path);
    if (!(f instanceof TFile)) return { habits: [], goals: [] };
    const content = await this.plugin.habitsScanner.getContent(f);
    const settings = this.plugin.settings;
    return {
      habits: parseHabitsFile(content, settings.habitPrefix),
      goals: parseExerciseGoals(content, settings.prefixes.exercise),
    };
  }

  private buildDayBuckets(today: Date, count: number): Bucket[] {
    const out: Bucket[] = [];
    for (let i = count - 1; i >= 0; i--) {
      const start = addDays(today, -i);
      const end = addDays(start, 1);
      out.push({
        start,
        end,
        label: start.getDate().toString(),
        tooltip: start.toLocaleDateString(undefined, {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        isCurrent: i === 0,
      });
    }
    return out;
  }

  private buildWeekBuckets(today: Date, count: number): Bucket[] {
    const weekStart = this.plugin.settings.habitWeekStart;
    const thisWeek = weekRange(today, weekStart);
    const out: Bucket[] = [];
    for (let i = count - 1; i >= 0; i--) {
      const start = addDays(thisWeek.start, -7 * i);
      const end = addDays(start, 7);
      out.push({
        start,
        end,
        label: start.getDate().toString(),
        tooltip: `Week of ${start.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}`,
        isCurrent: i === 0,
      });
    }
    return out;
  }

  private buildMonthBuckets(today: Date, count: number): Bucket[] {
    const thisMonth = monthRange(today);
    const out: Bucket[] = [];
    for (let i = count - 1; i >= 0; i--) {
      const start = addMonths(thisMonth.start, -i);
      const end = addMonths(start, 1);
      out.push({
        start,
        end,
        label: start
          .toLocaleDateString(undefined, { month: "short" })
          .slice(0, 3),
        tooltip: start.toLocaleDateString(undefined, {
          month: "long",
          year: "numeric",
        }),
        isCurrent: i === 0,
      });
    }
    return out;
  }

  private async buildSection(
    name: string,
    period: HabitPeriod,
    buckets: Bucket[],
    allHabits: Habit[],
    allGoals: ExerciseGoal[],
    fallback: DailyNoteFallback,
  ): Promise<PeriodSection> {
    const settings = this.plugin.settings;
    const habits = allHabits.filter((h) => h.period === period);
    const goals = allGoals.filter((g) => g.period === period);

    // Prefetch every unique daily-note in the union of bucket ranges so we
    // don't repeat resolveDailyNote() per habit. The scanner cache then
    // makes subsequent renders cheap.
    const dateMap = new Map<number, Date>();
    for (const b of buckets) {
      for (const d of enumerateDailyNoteDatesInRange(b.start, b.end)) {
        const day = startOfDay(d);
        dateMap.set(day.getTime(), day);
      }
    }
    const contentByTime = new Map<number, string>();
    for (const [t, d] of dateMap) {
      const c = await this.plugin.habitsScanner.readDateContent(d, fallback);
      if (c) contentByTime.set(t, c);
    }

    const rows: HabitRow[] = [];
    for (const h of habits) {
      const cells: HabitCell[] = [];
      let totalChecked = 0;
      let hits = 0;
      for (const b of buckets) {
        let count = 0;
        for (const d of enumerateDailyNoteDatesInRange(b.start, b.end)) {
          const c = contentByTime.get(startOfDay(d).getTime());
          if (!c) continue;
          const lines = findHabitTaskLines(
            c,
            settings.habitPrefix,
            h.slug,
          );
          for (const l of lines) if (l.checked) count += l.count;
        }
        cells.push({ bucket: b, checkedCount: count });
        totalChecked += count;
        if (count >= h.target) hits++;
      }
      rows.push({ habit: h, cells, totalChecked, hits });
    }

    // Reps + per-exercise breakdown across the entire window. Only counts
    // sets on completed (`- [x]`) tasks — pending sets on future or unchecked
    // days would otherwise inflate the totals with intent rather than work
    // done. Also tracks a per-date map of done-set reps by exercise name so
    // the goal grid below can attribute reps to each bucket without
    // re-parsing the content.
    let totalReps = 0;
    const exerciseTotals = new Map<string, number>();
    const doneRepsByDate = new Map<number, Map<string, number>>();
    for (const [t, c] of contentByTime) {
      const summaries = parseExercises(c, settings.prefixes);
      const doneByName = new Map<string, number>();
      for (const s of summaries) {
        for (const set of s.sets) {
          if (!set.done) continue;
          totalReps += set.reps;
          exerciseTotals.set(
            s.name,
            (exerciseTotals.get(s.name) ?? 0) + set.reps,
          );
          doneByName.set(s.name, (doneByName.get(s.name) ?? 0) + set.reps);
        }
      }
      if (doneByName.size > 0) doneRepsByDate.set(t, doneByName);
    }

    // Per-goal cells: count completed reps for the goal's exercise name in
    // each bucket's date range, compare against the target.
    const goalRows: GoalRow[] = [];
    for (const g of goals) {
      const cells: GoalCell[] = [];
      let metCount = 0;
      for (const b of buckets) {
        let reps = 0;
        for (const d of enumerateDailyNoteDatesInRange(b.start, b.end)) {
          const m = doneRepsByDate.get(startOfDay(d).getTime());
          if (!m) continue;
          reps += m.get(g.name) ?? 0;
        }
        const met = reps >= g.target;
        cells.push({ bucket: b, reps, target: g.target, met });
        if (met) metCount++;
      }
      goalRows.push({ goal: g, cells, metCount });
    }

    return {
      name,
      period,
      dateRange: formatBucketsRange(buckets, period),
      buckets,
      rows,
      goalRows,
      totalReps,
      exerciseTotals,
    };
  }

  private renderSection(parent: HTMLElement, section: PeriodSection): void {
    const sectionEl = parent.createDiv({ cls: "dp-heatmap-section" });

    const titleEl = sectionEl.createDiv({ cls: "dp-heatmap-row-title" });
    titleEl.createSpan({ cls: "dp-heatmap-row-name", text: section.name });
    titleEl.createSpan({ cls: "dp-heatmap-row-sep", text: " · " });
    titleEl.createSpan({
      cls: "dp-heatmap-row-range",
      text: section.dateRange,
    });

    if (section.rows.length === 0 && section.goalRows.length === 0) {
      sectionEl.createDiv({
        cls: "dp-heatmap-no-habits",
        text: `No ${section.name.toLowerCase()} habits.`,
      });
    } else if (section.rows.length === 0) {
      // No habits but goals exist — skip the habits grid entirely so the goal
      // grid can render flush against the section header.
    } else {
      // Grid uses explicit fixed widths for the label column and each cell
      // track so the layout is predictable across browsers and doesn't get
      // distorted by the parent's flex sizing. Inline-grid keeps the grid's
      // intrinsic width so it doesn't stretch into the available space and
      // push cells around on wide panes.
      const grid = sectionEl.createDiv({ cls: "dp-heatmap-grid-rows" });
      const cellCols = section.buckets.map(() => "12px").join(" ");
      grid.style.gridTemplateColumns = `140px ${cellCols}`;

      // Month band: groups consecutive buckets in the same calendar month
      // and renders the month name above them, so the bare-day-number column
      // labels below stay short. Skipped for the month section (its labels
      // already are month abbreviations) and the day section (labels are
      // already 1–2 chars and don't squish).
      if (section.period === "week") {
        grid.createDiv({ cls: "dp-heatmap-band-corner" });
        const bands = buildMonthBands(section.buckets);
        for (const band of bands) {
          const bandEl = grid.createDiv({
            cls: "dp-heatmap-band-label",
            text: band.label,
          });
          bandEl.style.gridColumn = `span ${band.span}`;
        }
      }

      // Header row: empty corner + bucket labels.
      grid.createDiv({ cls: "dp-heatmap-corner" });
      for (const b of section.buckets) {
        const labelEl = grid.createDiv({
          cls:
            "dp-heatmap-col-label" + (b.isCurrent ? " is-current" : ""),
          text: b.label,
        });
        labelEl.title = b.tooltip;
      }

      // One row per habit.
      for (const row of section.rows) {
        const labelEl = grid.createDiv({ cls: "dp-heatmap-habit-label" });
        labelEl.createSpan({
          cls: "dp-heatmap-habit-name",
          text: row.habit.slug,
        });
        if (row.habit.target > 1) {
          labelEl.createSpan({
            cls: "dp-heatmap-habit-target",
            text: `≥${row.habit.target}`,
          });
        }
        const summary = `${row.hits}/${row.cells.length}`;
        labelEl.createSpan({
          cls: "dp-heatmap-habit-summary",
          text: summary,
        });
        if (row.habit.label) labelEl.title = row.habit.label;
        for (const cell of row.cells) {
          // For target>1 habits, color is met/not-met (matching the
          // exercise-goal grid) so the heatmap reads as "did I hit my
          // weekly target." For target=1 habits, use the count-based
          // intensity scale so multiple checks in a single bucket still
          // shade darker.
          const intensity =
            row.habit.target > 1
              ? cell.checkedCount >= row.habit.target
                ? 4
                : 0
              : quintile(cell.checkedCount);
          const cellEl = grid.createDiv({
            cls:
              "dp-heatmap-cell q" +
              intensity +
              (cell.bucket.isCurrent ? " is-current" : ""),
          });
          const word =
            cell.checkedCount === 1 ? "completion" : "completions";
          const targetSuffix =
            row.habit.target > 1 ? ` (target ${row.habit.target})` : "";
          cellEl.title = `${row.habit.slug} · ${cell.bucket.tooltip}\n${cell.checkedCount} ${word}${targetSuffix}`;
        }
      }
    }

    // Section totals on a single line: `675 • Push-ups 250 · Sit-ups 225 · …`.
    // Total reps first, then a `•` separator, then the per-exercise
    // breakdown (sorted by reps descending).
    const totals = sectionEl.createDiv({ cls: "dp-heatmap-totals" });
    totals.createSpan({
      cls: "dp-heatmap-total-reps",
      text: section.totalReps.toLocaleString(),
    });
    totals.appendText(" reps");

    if (section.exerciseTotals.size > 0) {
      totals.createSpan({ cls: "dp-heatmap-sep", text: " • " });
      const sorted = Array.from(section.exerciseTotals.entries()).sort(
        (a, b) => b[1] - a[1],
      );
      sorted.forEach(([name, reps], idx) => {
        if (idx > 0) {
          totals.createSpan({
            cls: "dp-heatmap-breakdown-sep",
            text: " · ",
          });
        }
        const item = totals.createSpan({ cls: "dp-heatmap-breakdown-item" });
        item.createSpan({ cls: "dp-heatmap-breakdown-name", text: name });
        item.appendText(" ");
        item.createSpan({
          cls: "dp-heatmap-breakdown-reps",
          text: reps.toLocaleString(),
        });
      });
    }

    // Workout-goal grid: same shape as the habit grid, but each row is an
    // exercise goal and each cell is filled if the bucket's completed reps
    // hit the target. Rendered below the reps total so the user reads
    // "what I did" before "did I hit my goal".
    if (section.goalRows.length > 0) {
      const grid = sectionEl.createDiv({
        cls: "dp-heatmap-grid-rows dp-heatmap-grid-goals",
      });
      const cellCols = section.buckets.map(() => "12px").join(" ");
      grid.style.gridTemplateColumns = `140px ${cellCols}`;

      for (const row of section.goalRows) {
        const labelEl = grid.createDiv({ cls: "dp-heatmap-habit-label" });
        labelEl.createSpan({
          cls: "dp-heatmap-habit-name",
          text: row.goal.name,
        });
        labelEl.createSpan({
          cls: "dp-heatmap-habit-target",
          text: `≥${row.goal.target}`,
        });
        labelEl.createSpan({
          cls: "dp-heatmap-habit-summary",
          text: `${row.metCount}/${row.cells.length}`,
        });
        if (row.goal.label) labelEl.title = row.goal.label;
        for (const cell of row.cells) {
          const cellEl = grid.createDiv({
            cls:
              "dp-heatmap-cell q" +
              (cell.met ? "4" : "0") +
              (cell.bucket.isCurrent ? " is-current" : ""),
          });
          const pct =
            cell.target > 0
              ? Math.round((cell.reps / cell.target) * 100)
              : 0;
          cellEl.title = `${row.goal.name} · ${cell.bucket.tooltip}\n${cell.reps}/${cell.target} reps (${pct}%)`;
        }
      }
    }
  }
}

// Groups consecutive buckets that share a calendar month into a single band
// entry, so the heatmap can render one month label spanning all those columns
// instead of repeating it on every column header.
function buildMonthBands(buckets: Bucket[]): { label: string; span: number }[] {
  const out: { label: string; span: number }[] = [];
  let current: { key: string; label: string; span: number } | null = null;
  for (const b of buckets) {
    const key = `${b.start.getFullYear()}-${b.start.getMonth()}`;
    if (current && current.key === key) {
      current.span++;
    } else {
      if (current) out.push({ label: current.label, span: current.span });
      const label = b.start.toLocaleDateString(undefined, { month: "short" });
      current = { key, label, span: 1 };
    }
  }
  if (current) out.push({ label: current.label, span: current.span });
  return out;
}

// Maps a per-cell completion count to one of five color tiers.
//   0  → q0 (empty)
//   1  → q1
//   2  → q2
//   3  → q3
//   4+ → q4
// Daily habits typically max at 1 per cell, weekly at 7, monthly higher;
// keeping a single absolute scale makes the legend predictable across
// sections (a darker cell always means "more").
function quintile(count: number): number {
  if (count <= 0) return 0;
  if (count === 1) return 1;
  if (count === 2) return 2;
  if (count === 3) return 3;
  return 4;
}

// Per-period column label for the project pivot. Day = weekday short
// ("Sat"), Week = M/D of week-start ("5/4"), Month = month abbreviation
// ("May"). Tooltip on each <th> still carries the full date for ambiguity.
function formatPivotColLabel(bucket: Bucket, period: HabitPeriod): string {
  if (period === "day") {
    return bucket.start.toLocaleDateString(undefined, { weekday: "short" });
  }
  if (period === "month") {
    return bucket.start.toLocaleDateString(undefined, { month: "short" });
  }
  return bucket.start.toLocaleDateString(undefined, {
    month: "numeric",
    day: "numeric",
  });
}

function formatBucketsRange(buckets: Bucket[], period: HabitPeriod): string {
  if (buckets.length === 0) return "";
  const first = buckets[0].start;
  const last = buckets[buckets.length - 1].end;
  return period === "month"
    ? formatMonthRange(first, last)
    : formatDayRange(first, last);
}

// Renders a date range like "Apr 27 – May 6" or "Apr 27, 2025 – May 6, 2026"
// when the years differ. `endExclusive` is the half-open upper bound; we show
// the last inclusive day for human readability.
function formatDayRange(start: Date, endExclusive: Date): string {
  const last = addDays(endExclusive, -1);
  const sameYear = start.getFullYear() === last.getFullYear();
  const startStr = start.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    ...(sameYear ? {} : { year: "numeric" }),
  });
  const endStr = last.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return `${startStr} – ${endStr}`;
}

// Renders a month range like "Aug – May 2026" or "Aug 2025 – May 2026" when
// the years differ. Always shows the year on the end label so the reader can
// anchor the range.
function formatMonthRange(start: Date, endExclusive: Date): string {
  const last = addMonths(endExclusive, -1);
  const sameYear = start.getFullYear() === last.getFullYear();
  const startStr = start.toLocaleDateString(undefined, {
    month: "short",
    ...(sameYear ? {} : { year: "numeric" }),
  });
  const endStr = last.toLocaleDateString(undefined, {
    month: "short",
    year: "numeric",
  });
  return `${startStr} – ${endStr}`;
}
