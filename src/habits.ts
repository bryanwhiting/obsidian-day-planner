import { App, TFile } from "obsidian";
import {
  resolveDailyNote,
  addDays,
  addMonths,
  startOfDay,
  startOfMonth,
  type DailyNoteFallback,
} from "./dailyNote";

export type HabitPeriod = "day" | "week" | "month";

export interface Habit {
  period: HabitPeriod;
  slug: string;
  // How many checked task lines in the habit's window count as "done". Defaults
  // to 1 when the habit tag has no trailing `/N` segment.
  target: number;
  // Empty if the habits-file line had no trailing description.
  label: string;
}

const SLUG_PATTERN = "[\\w-]+";

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Builds the regex that matches a habit tag in arbitrary content. Pass `period`
// or `slug` to lock those segments; otherwise they're captured as groups 1/2.
// The optional `/N` target segment is matched but not captured here — both
// `#h-day/foo` and `#h-day/foo/3` count as "this habit". The trailing negative
// lookahead `[\w-/]` keeps `#h-day/foo/bar` (extra path segment, no digits)
// from matching as `#h-day/foo`.
export function buildHabitTagRegex(
  prefix: string,
  period?: HabitPeriod,
  slug?: string,
): RegExp {
  const periodPart = period ?? "(day|week|month)";
  const slugPart = slug ? escapeRegex(slug) : `(${SLUG_PATTERN})`;
  return new RegExp(
    `#${escapeRegex(prefix)}-${periodPart}\\/${slugPart}(?:\\/\\d+)?(?![\\w\\-/])`,
    "g",
  );
}

// An exercise goal sourced from the habits file. Tags look like
// `#<exercise>-<period>/<name>/<target>` (e.g. `#x-day/Pushups/25`,
// `#x-week/Push-ups/50`). The dashboard compares completed reps in the
// daily-note range against `target` to decide whether the goal was met.
export interface ExerciseGoal {
  period: HabitPeriod;
  name: string;
  target: number;
  // Empty if the source line had no trailing description.
  label: string;
}

// Parses exercise-goal lines out of the habits-source file. The hyphen in the
// prefix segment (`x-day` instead of `x/day`) keeps these from colliding with
// the existing `#x/<name>/<reps>` exercise-set tags used inside daily notes.
// Duplicate (period, name) pairs collapse to the first occurrence.
export function parseExerciseGoals(
  content: string,
  exercisePrefix: string,
): ExerciseGoal[] {
  const re = new RegExp(
    `#${escapeRegex(exercisePrefix)}-(day|week|month)\\/([\\w-]+)\\/(\\d+)(?![\\w-])(.*)$`,
  );
  const goals: ExerciseGoal[] = [];
  const seen = new Set<string>();
  for (const line of content.split("\n")) {
    const m = re.exec(line);
    if (!m) continue;
    const period = m[1] as HabitPeriod;
    const name = m[2];
    const target = parseInt(m[3], 10);
    if (!Number.isFinite(target) || target <= 0) continue;
    const label = (m[4] ?? "").trim();
    const key = `${period}/${name}`;
    if (seen.has(key)) continue;
    seen.add(key);
    goals.push({ period, name, target, label });
  }
  return goals;
}

// Parses the habits-source file. Each line that contains a habit tag becomes
// one Habit. Text after the tag on the same line is the human label; lines
// without a tag are silently skipped. The optional `/N` segment after the slug
// sets the target (default 1). Duplicate (period, slug) pairs collapse to the
// first occurrence.
export function parseHabitsFile(content: string, prefix: string): Habit[] {
  const re = new RegExp(
    `#${escapeRegex(prefix)}-(day|week|month)\\/(${SLUG_PATTERN})(?:\\/(\\d+))?(?![\\w\\-/])(.*)$`,
  );
  const habits: Habit[] = [];
  const seen = new Set<string>();
  for (const line of content.split("\n")) {
    const m = re.exec(line);
    if (!m) continue;
    const period = m[1] as HabitPeriod;
    const slug = m[2];
    const targetRaw = m[3];
    const label = (m[4] ?? "").trim();
    const parsed = targetRaw ? parseInt(targetRaw, 10) : 1;
    const target = Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
    const key = `${period}/${slug}`;
    if (seen.has(key)) continue;
    seen.add(key);
    habits.push({ period, slug, target, label });
  }
  return habits;
}

// Appends `- [x] <slug> #<prefix>-<period>/<slug>` to `content`, ensuring the
// file ends with exactly one newline. Used only when no task line for this
// habit already exists; toggling an existing line uses `toggleHabitOnContent`.
// The target is intentionally NOT included on the appended tag — completion is
// counted across task lines, and the source target lives in `_habits.md`.
export function appendHabitLine(
  content: string,
  prefix: string,
  period: HabitPeriod,
  slug: string,
): string {
  const line = `- [x] ${slug} #${prefix}-${period}/${slug}`;
  if (content.length === 0) return line + "\n";
  if (content.endsWith("\n")) return content + line + "\n";
  return content + "\n" + line + "\n";
}

// Captures `- [ ] body` / `- [x] body` style lines. Group 1 = indent, group 2
// = checkbox char (space or x/X), group 3 = body. Other Obsidian checkbox
// states (`/`, `-`, `!`, etc.) intentionally don't match — habits only care
// about the unchecked / checked binary.
const HABIT_TASK_LINE_RE = /^(\s*)- \[([ xX])\]\s+(.*)$/;

export interface HabitTaskLine {
  lineNumber: number;
  checked: boolean;
}

// Finds every task line in `content` that contains the habit tag. Bare-tag
// lines in prose are intentionally ignored — only `- [ ]` / `- [x]` lines
// participate in habit completion / toggle.
export function findHabitTaskLines(
  content: string,
  prefix: string,
  period: HabitPeriod,
  slug: string,
): HabitTaskLine[] {
  const tagRe = buildHabitTagRegex(prefix, period, slug);
  const out: HabitTaskLine[] = [];
  const lines = content.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const tm = HABIT_TASK_LINE_RE.exec(lines[i]);
    if (!tm) continue;
    tagRe.lastIndex = 0;
    if (!tagRe.test(lines[i])) continue;
    out.push({ lineNumber: i, checked: tm[2] === "x" || tm[2] === "X" });
  }
  return out;
}

// Toggles the habit on `content`:
//   - If a task line containing the habit tag exists, flip its checkbox in
//     place (`[ ]` ↔ `[x]`). Never deletes the line.
//   - Otherwise, append a new `- [x] <slug> #<prefix>/<period>/<slug>` line.
// When multiple matching task lines exist, only the first is flipped — the
// dashboard surfaces a duplicate indicator so the user can clean up by hand.
// This protects pre-templated planned-ahead lines from being deleted on a
// second click.
export function toggleHabitOnContent(
  content: string,
  prefix: string,
  period: HabitPeriod,
  slug: string,
): string {
  const tagRe = buildHabitTagRegex(prefix, period, slug);
  const lines = content.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const tm = HABIT_TASK_LINE_RE.exec(lines[i]);
    if (!tm) continue;
    tagRe.lastIndex = 0;
    if (!tagRe.test(lines[i])) continue;
    const checked = tm[2] === "x" || tm[2] === "X";
    lines[i] = `${tm[1]}- [${checked ? " " : "x"}] ${tm[3]}`;
    return lines.join("\n");
  }
  return appendHabitLine(content, prefix, period, slug);
}

// Returns the half-open [start, end) bounds of the calendar week containing
// `date`. weekStart 0=Sunday..6=Saturday.
export function weekRange(
  date: Date,
  weekStart: number,
): { start: Date; end: Date } {
  const d = startOfDay(date);
  const dow = d.getDay();
  const offset = (dow - weekStart + 7) % 7;
  const start = addDays(d, -offset);
  const end = addDays(start, 7);
  return { start, end };
}

// Returns the half-open [start, end) bounds of the calendar month containing
// `date`.
export function monthRange(date: Date): { start: Date; end: Date } {
  const start = startOfMonth(date);
  const end = addMonths(start, 1);
  return { start, end };
}

// Walks calendar dates from `start` (inclusive) to `end` (exclusive).
export function enumerateDailyNoteDatesInRange(
  start: Date,
  end: Date,
): Date[] {
  const out: Date[] = [];
  let d = startOfDay(start);
  const stop = end.getTime();
  while (d.getTime() < stop) {
    out.push(d);
    d = addDays(d, 1);
  }
  return out;
}

interface CacheEntry {
  mtime: number;
  content: string;
}

// Memoized reader for daily notes. Cache is keyed by file path and validated
// against TFile.stat.mtime, so vault writes invalidate entries automatically
// on the next access. Used by both the dashboard view (weekly/monthly habit
// completion checks) and the stats view (heatmap aggregations); without
// caching, a 30-day month re-reads 30 files on every render.
export class HabitsScanner {
  private cache: Map<string, CacheEntry> = new Map();

  constructor(private app: App) {}

  invalidate(path: string): void {
    this.cache.delete(path);
  }

  clear(): void {
    this.cache.clear();
  }

  async getContent(file: TFile): Promise<string> {
    const cached = this.cache.get(file.path);
    if (cached && cached.mtime === file.stat.mtime) return cached.content;
    const content = await this.app.vault.read(file);
    this.cache.set(file.path, { mtime: file.stat.mtime, content });
    return content;
  }

  async readDateContent(
    date: Date,
    fallback: DailyNoteFallback,
  ): Promise<string> {
    const resolved = await resolveDailyNote(this.app, date, fallback);
    if (!resolved.file) return "";
    return this.getContent(resolved.file);
  }
}
