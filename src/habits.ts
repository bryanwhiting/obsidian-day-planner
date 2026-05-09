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
  // Sum of `/N` counts (bare tag = 1) across checked task lines in the habit's
  // window that's required to mark the habit "done". Decimals allowed via the
  // `_` separator (e.g. `#h-day/drink/4_5`).
  target: number;
  // Empty if the habits-file line had no trailing description.
  label: string;
}

const SLUG_PATTERN = "[\\w-]+";
// `_` is allowed as the decimal separator since Obsidian tags can't hold a
// literal `.` (e.g. `#h/drink/2_5` = 2.5).
const NUM_PATTERN = "\\d+(?:[._]\\d+)?";

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function parseNum(s: string): number {
  return parseFloat(s.replace("_", "."));
}

// Builds the regex for a habit-GOAL tag (i.e. lines in `_habits.md` like
// `#h-day/foo` / `#h-day/foo/3`). Pass `period` or `slug` to lock those
// segments; otherwise they're captured. The trailing `/N` target is matched
// but not captured. The trailing negative lookahead keeps
// `#h-day/foo/bar` (extra non-numeric path segment) from matching as
// `#h-day/foo`.
export function buildHabitTagRegex(
  prefix: string,
  period?: HabitPeriod,
  slug?: string,
): RegExp {
  const periodPart = period ?? "(day|week|month)";
  const slugPart = slug ? escapeRegex(slug) : `(${SLUG_PATTERN})`;
  return new RegExp(
    `#${escapeRegex(prefix)}-${periodPart}\\/${slugPart}(?:\\/${NUM_PATTERN})?(?![\\w\\-/])`,
    "g",
  );
}

// Builds the regex for a habit-LOG tag (i.e. lines inside daily notes). Logs
// use the short shape `#h/<slug>[/N]` — same shape as exercise sets — but the
// regex also tolerates the legacy `#h-(day|week|month)/<slug>[/N]` shape so
// pre-migration notes still count. Group 1 is always the count (`N` if
// present, else undefined). Pass `slug` to lock that segment.
export function buildHabitLogTagRegex(
  prefix: string,
  slug?: string,
): RegExp {
  const slugPart = slug ? escapeRegex(slug) : SLUG_PATTERN;
  return new RegExp(
    `#${escapeRegex(prefix)}(?:-(?:day|week|month))?\\/${slugPart}(?:\\/(${NUM_PATTERN}))?(?![\\w\\-/])`,
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
  // Target accepts `_` as a decimal separator since Obsidian tags can't hold
  // a literal `.` (e.g. `#x-day/Run/1_5` = 1.5).
  const re = new RegExp(
    `#${escapeRegex(exercisePrefix)}-(day|week|month)\\/([\\w-]+)\\/(\\d+(?:[._]\\d+)?)(?![\\w-])(.*)$`,
  );
  const goals: ExerciseGoal[] = [];
  const seen = new Set<string>();
  for (const line of content.split("\n")) {
    const m = re.exec(line);
    if (!m) continue;
    const period = m[1] as HabitPeriod;
    const name = m[2];
    const target = parseFloat(m[3].replace("_", "."));
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
// sets the target (default 1, decimals allowed via `_`). Duplicate
// (period, slug) pairs collapse to the first occurrence.
export function parseHabitsFile(content: string, prefix: string): Habit[] {
  const re = new RegExp(
    `#${escapeRegex(prefix)}-(day|week|month)\\/(${SLUG_PATTERN})(?:\\/(${NUM_PATTERN}))?(?![\\w\\-/])(.*)$`,
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
    const parsed = targetRaw ? parseNum(targetRaw) : 1;
    const target = Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
    const key = `${period}/${slug}`;
    if (seen.has(key)) continue;
    seen.add(key);
    habits.push({ period, slug, target, label });
  }
  return habits;
}

// Appends `- [x] <slug> #<prefix>/<slug>` to `content`, ensuring the file
// ends with exactly one newline. Used only when no task line for this habit
// already exists; toggling an existing line uses `toggleHabitOnContent`. The
// count is intentionally NOT included on the appended tag — bare = 1 by
// convention; the user types `/N` by hand to log multiples on a single line.
export function appendHabitLine(
  content: string,
  prefix: string,
  slug: string,
): string {
  const line = `- [x] ${slug} #${prefix}/${slug}`;
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
  // Sum of `/N` counts on the line (bare tag = 1). Decimals possible. A line
  // with two log tags for the same slug — e.g. `#h/drink #h/drink/3` — sums
  // to 4.
  count: number;
}

// Finds every task line in `content` that contains a log tag for `slug`.
// Bare-tag lines in prose are intentionally ignored — only `- [ ]` / `- [x]`
// lines participate. The returned `count` is the sum of `/N` segments
// (bare = 1) across every log-tag occurrence on the line, so callers can
// compute "completions" by summing `count` over checked entries.
export function findHabitTaskLines(
  content: string,
  prefix: string,
  slug: string,
): HabitTaskLine[] {
  const out: HabitTaskLine[] = [];
  const lines = content.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const tm = HABIT_TASK_LINE_RE.exec(lines[i]);
    if (!tm) continue;
    const tagRe = buildHabitLogTagRegex(prefix, slug);
    let count = 0;
    let any = false;
    for (const m of lines[i].matchAll(tagRe)) {
      any = true;
      count += m[1] !== undefined ? parseNum(m[1]) : 1;
    }
    if (!any) continue;
    out.push({
      lineNumber: i,
      checked: tm[2] === "x" || tm[2] === "X",
      count,
    });
  }
  return out;
}

// Toggles the habit on `content`:
//   - If a task line containing the log tag exists, flip its checkbox in
//     place (`[ ]` ↔ `[x]`). Never deletes the line.
//   - Otherwise, append a new `- [x] <slug> #<prefix>/<slug>` line.
// When multiple matching task lines exist, only the first is flipped — the
// dashboard surfaces a duplicate indicator so the user can clean up by hand.
// This protects pre-templated planned-ahead lines from being deleted on a
// second click.
export function toggleHabitOnContent(
  content: string,
  prefix: string,
  slug: string,
): string {
  const tagRe = buildHabitLogTagRegex(prefix, slug);
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
  return appendHabitLine(content, prefix, slug);
}

// Rewrites legacy log-tag occurrences `#<prefix>-<period>/<slug>[/N]` to the
// short shape `#<prefix>/<slug>[/N]`. Returns the new content and the number
// of replacements. Goal tags in `_habits.md` are NOT rewritten — callers must
// only feed daily-note content here.
export function migrateHabitLogTags(
  content: string,
  prefix: string,
): { content: string; replacements: number } {
  const re = new RegExp(
    `#${escapeRegex(prefix)}-(?:day|week|month)\\/(${SLUG_PATTERN})((?:\\/${NUM_PATTERN})?)(?![\\w\\-/])`,
    "g",
  );
  let replacements = 0;
  const next = content.replace(re, (_full, slug: string, tail: string) => {
    replacements++;
    return `#${prefix}/${slug}${tail}`;
  });
  return { content: next, replacements };
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
