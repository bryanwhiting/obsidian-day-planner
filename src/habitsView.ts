import { ItemView, WorkspaceLeaf, TFile } from "obsidian";
import type TodayPlugin from "./main";
import {
  Habit,
  parseHabitsFile,
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
import { parseExercises } from "./parser";

export const VIEW_TYPE_HABITS_STATS = "today-habits-stats";

interface HeatmapCell {
  start: Date;
  end: Date;
  label: string;
  tooltip: string;
  habitsCompleted: number;
  habitsTotal: number;
  rate: number;
  exerciseReps: number;
  exerciseTotals: Map<string, number>;
}

export class HabitsStatsView extends ItemView {
  plugin: TodayPlugin;
  private rerenderTimer: number | null = null;

  constructor(leaf: WorkspaceLeaf, plugin: TodayPlugin) {
    super(leaf);
    this.plugin = plugin;
  }

  getViewType(): string {
    return VIEW_TYPE_HABITS_STATS;
  }

  getDisplayText(): string {
    return "Habit stats";
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
      dateLinkFormat: settings.dateLinkFormat,
    };

    const heading = root.createDiv({ cls: "dp-habit-stats-header" });
    heading.createEl("h3", { text: "Habit stats" });

    const habits = await this.loadHabits();
    if (habits.length === 0) {
      root.createDiv({
        cls: "dp-habit-stats-empty",
        text: `No habits found. Add tags like #${settings.habitPrefix}/day/<slug> to ${settings.habitsFile}.`,
      });
      return;
    }

    const today = startOfDay(new Date());
    const window = settings.habitsStatsWindow;

    const dayCells = await this.buildDayHeatmap(habits, fallback, today, window);
    const weekCells = await this.buildWeekHeatmap(habits, fallback, today, window);
    const monthCells = await this.buildMonthHeatmap(habits, fallback, today, window);

    // Day row spans `count` days ending today (inclusive).
    const dayStart = addDays(today, -(window - 1));
    const dayEndExclusive = addDays(today, 1);
    this.renderRow(
      root,
      "Day",
      formatDayRange(dayStart, dayEndExclusive),
      dayCells,
    );

    // Week row spans `count` weeks ending with the current week.
    const thisWeek = weekRange(today, settings.habitWeekStart);
    const weekStart = addDays(thisWeek.start, -7 * (window - 1));
    this.renderRow(
      root,
      "Week",
      formatDayRange(weekStart, thisWeek.end),
      weekCells,
    );

    // Month row spans `count` months ending with the current month.
    const thisMonth = monthRange(today);
    const monthStart = addMonths(thisMonth.start, -(window - 1));
    this.renderRow(
      root,
      "Month",
      formatMonthRange(monthStart, thisMonth.end),
      monthCells,
    );
  }

  private async loadHabits(): Promise<Habit[]> {
    const path = this.plugin.settings.habitsFile;
    const f = this.app.vault.getAbstractFileByPath(path);
    if (!(f instanceof TFile)) return [];
    const content = await this.plugin.habitsScanner.getContent(f);
    return parseHabitsFile(content, this.plugin.settings.habitPrefix);
  }

  private renderRow(
    parent: HTMLElement,
    title: string,
    dateRange: string,
    cells: HeatmapCell[],
  ): void {
    const row = parent.createDiv({ cls: "dp-heatmap-row" });
    const titleEl = row.createDiv({ cls: "dp-heatmap-row-title" });
    titleEl.createSpan({ cls: "dp-heatmap-row-name", text: title });
    titleEl.createSpan({ cls: "dp-heatmap-row-sep", text: " · " });
    titleEl.createSpan({ cls: "dp-heatmap-row-range", text: dateRange });

    const grid = row.createDiv({ cls: "dp-heatmap-grid" });
    let totalReps = 0;
    let completedSum = 0;
    let totalPossible = 0;
    const aggExercise = new Map<string, number>();
    for (const c of cells) {
      const cell = grid.createDiv({
        cls: `dp-heatmap-cell q${quintile(c.rate)}`,
      });
      cell.style.setProperty("--dp-heatmap-intensity", c.rate.toFixed(3));
      cell.setAttribute("aria-label", c.tooltip);
      cell.title = c.tooltip;
      cell.createSpan({ cls: "dp-heatmap-cell-label", text: c.label });
      totalReps += c.exerciseReps;
      completedSum += c.habitsCompleted;
      totalPossible += c.habitsTotal;
      for (const [name, reps] of c.exerciseTotals) {
        aggExercise.set(name, (aggExercise.get(name) ?? 0) + reps);
      }
    }

    const totals = row.createDiv({ cls: "dp-heatmap-totals" });
    totals.createSpan({
      cls: "dp-heatmap-total",
      text:
        totalPossible > 0
          ? `${completedSum}/${totalPossible} habits`
          : "no habits",
    });
    totals.createSpan({ cls: "dp-heatmap-sep", text: " • " });
    totals.createSpan({
      cls: "dp-heatmap-total-reps",
      text: `${totalReps.toLocaleString()} reps`,
    });

    if (aggExercise.size > 0) {
      const breakdown = row.createDiv({ cls: "dp-heatmap-breakdown" });
      const sorted = Array.from(aggExercise.entries()).sort(
        (a, b) => b[1] - a[1],
      );
      sorted.forEach(([name, reps], idx) => {
        if (idx > 0) {
          breakdown.createSpan({
            cls: "dp-heatmap-breakdown-sep",
            text: " · ",
          });
        }
        const item = breakdown.createSpan({ cls: "dp-heatmap-breakdown-item" });
        item.createSpan({ cls: "dp-heatmap-breakdown-name", text: name });
        item.appendText(" ");
        item.createSpan({
          cls: "dp-heatmap-breakdown-reps",
          text: reps.toLocaleString(),
        });
      });
    }
  }

  private async buildDayHeatmap(
    habits: Habit[],
    fallback: DailyNoteFallback,
    today: Date,
    count: number,
  ): Promise<HeatmapCell[]> {
    const dayHabits = habits.filter((h) => h.period === "day");
    const cells: HeatmapCell[] = [];
    for (let i = count - 1; i >= 0; i--) {
      const start = addDays(today, -i);
      const end = addDays(start, 1);
      const cell = await this.buildCell(start, end, dayHabits, fallback);
      cell.label = start.getDate().toString();
      cell.tooltip = `${start.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}\n${cell.habitsCompleted}/${cell.habitsTotal} habits · ${cell.exerciseReps} reps`;
      cells.push(cell);
    }
    return cells;
  }

  private async buildWeekHeatmap(
    habits: Habit[],
    fallback: DailyNoteFallback,
    today: Date,
    count: number,
  ): Promise<HeatmapCell[]> {
    const weekHabits = habits.filter((h) => h.period === "week");
    const weekStart = this.plugin.settings.habitWeekStart;
    const cells: HeatmapCell[] = [];
    const thisWeek = weekRange(today, weekStart);
    for (let i = count - 1; i >= 0; i--) {
      const start = addDays(thisWeek.start, -7 * i);
      const end = addDays(start, 7);
      const cell = await this.buildCell(start, end, weekHabits, fallback);
      cell.label = `${start.getMonth() + 1}/${start.getDate()}`;
      cell.tooltip = `Week of ${start.toLocaleDateString(undefined, { month: "short", day: "numeric" })}\n${cell.habitsCompleted}/${cell.habitsTotal} habits · ${cell.exerciseReps} reps`;
      cells.push(cell);
    }
    return cells;
  }

  private async buildMonthHeatmap(
    habits: Habit[],
    fallback: DailyNoteFallback,
    today: Date,
    count: number,
  ): Promise<HeatmapCell[]> {
    const monthHabits = habits.filter((h) => h.period === "month");
    const cells: HeatmapCell[] = [];
    const thisMonth = monthRange(today);
    for (let i = count - 1; i >= 0; i--) {
      const start = addMonths(thisMonth.start, -i);
      const end = addMonths(start, 1);
      const cell = await this.buildCell(start, end, monthHabits, fallback);
      cell.label = start
        .toLocaleDateString(undefined, { month: "short" })
        .slice(0, 3);
      cell.tooltip = `${start.toLocaleDateString(undefined, { month: "long", year: "numeric" })}\n${cell.habitsCompleted}/${cell.habitsTotal} habits · ${cell.exerciseReps} reps`;
      cells.push(cell);
    }
    return cells;
  }

  private async buildCell(
    start: Date,
    end: Date,
    habits: Habit[],
    fallback: DailyNoteFallback,
  ): Promise<HeatmapCell> {
    const dates = enumerateDailyNoteDatesInRange(start, end);
    const contents: string[] = [];
    for (const d of dates) {
      const c = await this.plugin.habitsScanner.readDateContent(d, fallback);
      if (c) contents.push(c);
    }
    let completed = 0;
    for (const h of habits) {
      let hasChecked = false;
      for (const c of contents) {
        const lines = findHabitTaskLines(
          c,
          this.plugin.settings.habitPrefix,
          h.period,
          h.slug,
        );
        if (lines.some((l) => l.checked)) {
          hasChecked = true;
          break;
        }
      }
      if (hasChecked) completed++;
    }
    const total = habits.length;
    let reps = 0;
    const exerciseTotals = new Map<string, number>();
    for (const c of contents) {
      const summaries = parseExercises(c, this.plugin.settings.prefixes);
      for (const s of summaries) {
        for (const set of s.sets) {
          reps += set.reps;
          exerciseTotals.set(
            s.name,
            (exerciseTotals.get(s.name) ?? 0) + set.reps,
          );
        }
      }
    }
    return {
      start,
      end,
      label: "",
      tooltip: "",
      habitsCompleted: completed,
      habitsTotal: total,
      rate: total > 0 ? completed / total : 0,
      exerciseReps: reps,
      exerciseTotals,
    };
  }
}

// Maps a 0..1 rate to one of five quintile buckets used for cell coloring.
// rate=0 maps to q0 (empty); any positive rate gets at least q1 so a lone
// completion is visible.
function quintile(rate: number): number {
  if (rate <= 0) return 0;
  if (rate < 0.25) return 1;
  if (rate < 0.5) return 2;
  if (rate < 0.75) return 3;
  return 4;
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
