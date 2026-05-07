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

    const { habits, goals } = await this.loadHabitsAndGoals();
    if (habits.length === 0 && goals.length === 0) {
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
            h.period,
            h.slug,
          );
          for (const l of lines) if (l.checked) count++;
        }
        cells.push({ bucket: b, checkedCount: count });
        totalChecked += count;
        if (count >= h.target) hits++;
      }
      rows.push({ habit: h, cells, totalChecked, hits });
    }

    // Reps + per-exercise breakdown across the entire window. Also tracks a
    // per-date map of done-set reps by exercise name so the goal grid below
    // can attribute reps to each bucket without re-parsing the content.
    let totalReps = 0;
    const exerciseTotals = new Map<string, number>();
    const doneRepsByDate = new Map<number, Map<string, number>>();
    for (const [t, c] of contentByTime) {
      const summaries = parseExercises(c, settings.prefixes);
      const doneByName = new Map<string, number>();
      for (const s of summaries) {
        for (const set of s.sets) {
          totalReps += set.reps;
          exerciseTotals.set(
            s.name,
            (exerciseTotals.get(s.name) ?? 0) + set.reps,
          );
          if (set.done) {
            doneByName.set(s.name, (doneByName.get(s.name) ?? 0) + set.reps);
          }
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
