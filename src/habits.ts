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
  // Empty if the habits-file line had no trailing description.
  label: string;
}

const SLUG_PATTERN = "[\\w-]+";

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Builds the regex that matches a habit tag in arbitrary content. Pass `period`
// or `slug` to lock those segments; otherwise they're captured as groups 1/2.
// The trailing negative lookahead prevents `#h/day/foo` from being matched when
// the user means `#h/day/foo-bar`.
export function buildHabitTagRegex(
  prefix: string,
  period?: HabitPeriod,
  slug?: string,
): RegExp {
  const periodPart = period ?? "(day|week|month)";
  const slugPart = slug ? escapeRegex(slug) : `(${SLUG_PATTERN})`;
  return new RegExp(
    `#${escapeRegex(prefix)}\\/${periodPart}\\/${slugPart}(?![\\w-])`,
    "g",
  );
}

// Parses the habits-source file. Each line that contains a habit tag becomes
// one Habit. Text after the tag on the same line is the human label; lines
// without a tag are silently skipped. Duplicate (period, slug) pairs collapse
// to the first occurrence.
export function parseHabitsFile(content: string, prefix: string): Habit[] {
  const re = new RegExp(
    `#${escapeRegex(prefix)}\\/(day|week|month)\\/(${SLUG_PATTERN})(?![\\w-])(.*)$`,
  );
  const habits: Habit[] = [];
  const seen = new Set<string>();
  for (const line of content.split("\n")) {
    const m = re.exec(line);
    if (!m) continue;
    const period = m[1] as HabitPeriod;
    const slug = m[2];
    const label = (m[3] ?? "").trim();
    const key = `${period}/${slug}`;
    if (seen.has(key)) continue;
    seen.add(key);
    habits.push({ period, slug, label });
  }
  return habits;
}

// Counts how many times the given habit tag appears anywhere in `content`.
// Counts non-task lines too — the user can drop the bare tag in prose and the
// click-handler writes a `- [x]` line; both should register as completion.
export function countHabitOccurrences(
  content: string,
  prefix: string,
  period: HabitPeriod,
  slug: string,
): number {
  const re = buildHabitTagRegex(prefix, period, slug);
  let count = 0;
  for (const _ of content.matchAll(re)) count++;
  return count;
}

// Appends `- [x] <slug> #<prefix>/<period>/<slug>` to `content`, ensuring the
// file ends with exactly one newline.
export function appendHabitLine(
  content: string,
  prefix: string,
  period: HabitPeriod,
  slug: string,
): string {
  const line = `- [x] ${slug} #${prefix}/${period}/${slug}`;
  if (content.length === 0) return line + "\n";
  if (content.endsWith("\n")) return content + line + "\n";
  return content + "\n" + line + "\n";
}

const CHECKED_TASK_RE = /^\s*- \[[xX]\]\s+/;

// Removes the FIRST `- [x]` line containing the habit tag. Bare-tag lines in
// prose are never deleted — the click-handler only writes `- [x]` lines, and
// preserving prose-level tags protects user-authored text from accidental
// deletion. If multiple matching lines exist, only the first is removed.
export function removeHabitLine(
  content: string,
  prefix: string,
  period: HabitPeriod,
  slug: string,
): string {
  const tagRe = buildHabitTagRegex(prefix, period, slug);
  const lines = content.split("\n");
  for (let i = 0; i < lines.length; i++) {
    if (!CHECKED_TASK_RE.test(lines[i])) continue;
    tagRe.lastIndex = 0;
    if (!tagRe.test(lines[i])) continue;
    lines.splice(i, 1);
    return lines.join("\n");
  }
  return content;
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
