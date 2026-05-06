import { ItemView, WorkspaceLeaf, TFile } from "obsidian";
import type TodayPlugin from "./main";
import {
  Habit,
  parseHabitsFile,
  countHabitOccurrences,
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

    this.renderRow(root, "Day", dayCells);
    this.renderRow(root, "Week", weekCells);
    this.renderRow(root, "Month", monthCells);
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
    cells: HeatmapCell[],
  ): void {
    const row = parent.createDiv({ cls: "dp-heatmap-row" });
    row.createDiv({ cls: "dp-heatmap-row-title", text: title });
    const grid = row.createDiv({ cls: "dp-heatmap-grid" });
    let totalReps = 0;
    let completedSum = 0;
    let totalPossible = 0;
    for (const c of cells) {
      const cell = grid.createDiv({ cls: "dp-heatmap-cell" });
      cell.style.setProperty("--dp-heatmap-intensity", c.rate.toFixed(3));
      cell.setAttribute("aria-label", c.tooltip);
      cell.title = c.tooltip;
      cell.createSpan({ cls: "dp-heatmap-cell-label", text: c.label });
      totalReps += c.exerciseReps;
      completedSum += c.habitsCompleted;
      totalPossible += c.habitsTotal;
    }
    const totals = row.createDiv({ cls: "dp-heatmap-totals" });
    totals.createSpan({
      cls: "dp-heatmap-total",
      text: totalPossible > 0 ? `${completedSum}/${totalPossible}` : "—",
    });
    totals.createSpan({ cls: "dp-heatmap-sep", text: " • " });
    totals.createSpan({
      cls: "dp-heatmap-total-reps",
      text: `${totalReps} reps`,
    });
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
      cell.label = start
        .toLocaleDateString(undefined, { weekday: "narrow" })
        .toUpperCase();
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
      cell.label = start.toLocaleDateString(undefined, { month: "short" });
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
    const combined = contents.join("\n");
    let completed = 0;
    for (const h of habits) {
      const n = countHabitOccurrences(
        combined,
        this.plugin.settings.habitPrefix,
        h.period,
        h.slug,
      );
      if (n > 0) completed++;
    }
    const total = habits.length;
    let reps = 0;
    for (const c of contents) {
      const summaries = parseExercises(c, this.plugin.settings.prefixes);
      for (const s of summaries) {
        for (const set of s.sets) reps += set.reps;
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
    };
  }
}
