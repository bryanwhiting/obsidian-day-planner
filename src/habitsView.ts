import { ItemView, WorkspaceLeaf, TFile } from "obsidian";
import type TodayPlugin from "./main";
import {
  Habit,
  HabitPeriod,
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

interface PeriodSection {
  name: string;
  period: HabitPeriod;
  dateRange: string;
  buckets: Bucket[];
  rows: HabitRow[];
  totalReps: number;
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

    const dayBuckets = this.buildDayBuckets(today, window);
    const weekBuckets = this.buildWeekBuckets(today, window);
    const monthBuckets = this.buildMonthBuckets(today, window);

    const daySection = await this.buildSection(
      "Day",
      "day",
      dayBuckets,
      habits,
      fallback,
    );
    const weekSection = await this.buildSection(
      "Week",
      "week",
      weekBuckets,
      habits,
      fallback,
    );
    const monthSection = await this.buildSection(
      "Month",
      "month",
      monthBuckets,
      habits,
      fallback,
    );

    this.renderSection(root, daySection);
    this.renderSection(root, weekSection);
    this.renderSection(root, monthSection);
  }

  private async loadHabits(): Promise<Habit[]> {
    const path = this.plugin.settings.habitsFile;
    const f = this.app.vault.getAbstractFileByPath(path);
    if (!(f instanceof TFile)) return [];
    const content = await this.plugin.habitsScanner.getContent(f);
    return parseHabitsFile(content, this.plugin.settings.habitPrefix);
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
        label: `${start.getMonth() + 1}/${start.getDate()}`,
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
    fallback: DailyNoteFallback,
  ): Promise<PeriodSection> {
    const settings = this.plugin.settings;
    const habits = allHabits.filter((h) => h.period === period);

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
            h.period,
            h.slug,
          );
          for (const l of lines) if (l.checked) count++;
        }
        cells.push({ bucket: b, checkedCount: count });
        totalChecked += count;
        if (count > 0) hits++;
      }
      rows.push({ habit: h, cells, totalChecked, hits });
    }

    // Reps + per-exercise breakdown across the entire window.
    let totalReps = 0;
    const exerciseTotals = new Map<string, number>();
    for (const c of contentByTime.values()) {
      const summaries = parseExercises(c, settings.prefixes);
      for (const s of summaries) {
        for (const set of s.sets) {
          totalReps += set.reps;
          exerciseTotals.set(
            s.name,
            (exerciseTotals.get(s.name) ?? 0) + set.reps,
          );
        }
      }
    }

    return {
      name,
      period,
      dateRange: formatBucketsRange(buckets, period),
      buckets,
      rows,
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

    if (section.rows.length === 0) {
      sectionEl.createDiv({
        cls: "dp-heatmap-no-habits",
        text: `No ${section.name.toLowerCase()} habits.`,
      });
    } else {
      const grid = sectionEl.createDiv({ cls: "dp-heatmap-grid-rows" });
      grid.style.gridTemplateColumns = `auto repeat(${section.buckets.length}, var(--dp-heatmap-cell))`;

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
        const summary = `${row.hits}/${row.cells.length}`;
        labelEl.createSpan({
          cls: "dp-heatmap-habit-summary",
          text: summary,
        });
        if (row.habit.label) labelEl.title = row.habit.label;
        for (const cell of row.cells) {
          const cellEl = grid.createDiv({
            cls:
              "dp-heatmap-cell q" +
              quintile(cell.checkedCount) +
              (cell.bucket.isCurrent ? " is-current" : ""),
          });
          const word =
            cell.checkedCount === 1 ? "completion" : "completions";
          cellEl.title = `${row.habit.slug} · ${cell.bucket.tooltip}\n${cell.checkedCount} ${word}`;
        }
      }
    }

    // Section totals: reps + per-exercise breakdown.
    const totals = sectionEl.createDiv({ cls: "dp-heatmap-totals" });
    totals.createSpan({
      cls: "dp-heatmap-total-reps",
      text: `${section.totalReps.toLocaleString()} reps`,
    });

    if (section.exerciseTotals.size > 0) {
      const breakdown = sectionEl.createDiv({ cls: "dp-heatmap-breakdown" });
      const sorted = Array.from(section.exerciseTotals.entries()).sort(
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
