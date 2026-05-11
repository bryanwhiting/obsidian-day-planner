import { App, TFile, moment } from "obsidian";

// One configured tag → days-ahead override. The tag is the bare hashtag body
// (no leading "#"), e.g. "p/family" matches `#p/family`. When a person file
// contains multiple matching overrides, the largest `daysAhead` wins so the
// most generous lookahead is honored.
export interface UpcomingTagOverride {
  tag: string;
  daysAhead: number;
}

export type UpcomingKind = "birthday" | "anniversary";

export interface UpcomingEvent {
  kind: UpcomingKind;
  // Person file basename (e.g. "Bob") and full vault path (used to open).
  name: string;
  path: string;
  // Days until next occurrence: 0 = today, 1 = tomorrow, etc.
  daysUntil: number;
  // Month (1-12) and day-of-month of the event.
  month: number;
  day: number;
  // Display label like "May 15".
  dateLabel: string;
  // The lookahead window this person resolved to, after applying the
  // largest matching tag override. Used purely for diagnostics — not rendered.
  daysAhead: number;
}

// Accept a handful of common date shapes for birthday/anniversary frontmatter:
//   "1990-05-15"  (full ISO)
//   "05-15"       (month-day)
//   "05/15"
//   "May 15"
//   "May 15, 1990"
//   "15 May"
// Returns null if nothing matches. Year, when present, is ignored for the
// countdown — only month/day drive the next-occurrence calculation.
export function parseUpcomingDate(
  raw: string,
): { month: number; day: number } | null {
  const s = (raw || "").trim();
  if (!s) return null;
  const formats = [
    "YYYY-MM-DD",
    "YYYY/MM/DD",
    "MM-DD",
    "MM/DD",
    "M-D",
    "M/D",
    "MMM D",
    "MMM D, YYYY",
    "MMMM D",
    "MMMM D, YYYY",
    "D MMM",
    "D MMMM",
    "D MMM YYYY",
    "D MMMM YYYY",
  ];
  for (const fmt of formats) {
    const m = moment(s, fmt, true);
    if (m.isValid()) return { month: m.month() + 1, day: m.date() };
  }
  // Last-ditch: let moment guess. Permissive but useful for odd inputs.
  const guess = moment(s);
  if (guess.isValid()) return { month: guess.month() + 1, day: guess.date() };
  return null;
}

// Days from `today` (midnight) to the next occurrence of month/day. 0 means
// today, positive integers are future. Feb 29 in non-leap years falls back to
// Feb 28 so February birthdays don't disappear three years out of four.
export function daysUntilAnniversary(
  month: number,
  day: number,
  today: Date,
): number {
  const t = moment(today).startOf("day");
  const year = t.year();
  let target = moment([year, month - 1, day]);
  if (!target.isValid()) target = moment([year, month - 1, 28]);
  if (target.isBefore(t, "day")) {
    target = moment([year + 1, month - 1, day]);
    if (!target.isValid()) target = moment([year + 1, month - 1, 28]);
  }
  return target.diff(t, "day");
}

// Renders an event's date as "May 15". Year is intentionally omitted — the
// row already shows a (Nd) countdown, which is what the user wants.
export function formatEventDate(month: number, day: number): string {
  return moment([2000, month - 1, day]).format("MMM D");
}

// Pretty-prints the countdown: "today", "1d", "7d", "21d".
export function formatDaysUntil(days: number): string {
  if (days <= 0) return "today";
  return `${days}d`;
}

interface ScanOptions {
  peopleFolder: string;
  birthdayField: string;
  anniversaryField: string;
  defaultDaysAhead: number;
  tagOverrides: UpcomingTagOverride[];
  today: Date;
}

// Walks every markdown file in `peopleFolder`, reads frontmatter for the
// configured birthday/anniversary fields, computes days-until-next, and keeps
// only the ones whose countdown falls inside the (per-person) lookahead
// window. Returns events sorted soonest-first.
export function getUpcomingEvents(
  app: App,
  opts: ScanOptions,
): UpcomingEvent[] {
  const folder = (opts.peopleFolder || "").replace(/^\/+|\/+$/g, "");
  if (!folder) return [];
  const folderLc = folder.toLowerCase();
  const files = app.vault.getMarkdownFiles().filter((f) => {
    const dir = (f.parent?.path || "").toLowerCase();
    return dir === folderLc || dir.startsWith(folderLc + "/");
  });
  const out: UpcomingEvent[] = [];
  for (const file of files) {
    const cache = app.metadataCache.getFileCache(file);
    const fm = cache?.frontmatter as Record<string, unknown> | undefined;
    const daysAhead = resolveDaysAheadForFile(file, cache, opts);
    pushEvent(out, file, fm, opts.birthdayField, "birthday", daysAhead, opts.today);
    pushEvent(out, file, fm, opts.anniversaryField, "anniversary", daysAhead, opts.today);
  }
  out.sort((a, b) => a.daysUntil - b.daysUntil || a.name.localeCompare(b.name));
  return out;
}

function pushEvent(
  out: UpcomingEvent[],
  file: TFile,
  fm: Record<string, unknown> | undefined,
  field: string,
  kind: UpcomingKind,
  daysAhead: number,
  today: Date,
): void {
  if (!field || !fm) return;
  const raw = fm[field];
  let value: string | null = null;
  if (typeof raw === "string") value = raw;
  else if (typeof raw === "number") value = String(raw);
  else if (raw instanceof Date) value = moment(raw).format("YYYY-MM-DD");
  if (!value) return;
  const md = parseUpcomingDate(value);
  if (!md) return;
  const daysUntil = daysUntilAnniversary(md.month, md.day, today);
  if (daysUntil > daysAhead) return;
  out.push({
    kind,
    name: file.basename,
    path: file.path,
    daysUntil,
    month: md.month,
    day: md.day,
    dateLabel: formatEventDate(md.month, md.day),
    daysAhead,
  });
}

// Picks the longest applicable lookahead for one person. We check both
// frontmatter `tags:` (single string or list) and inline hashtags from the
// metadata cache. The override with the largest `daysAhead` wins so that a
// person tagged with both `#p/close` (21d) and `#p/casual` (10d) still gets
// the 3-week alert window.
function resolveDaysAheadForFile(
  file: TFile,
  cache: ReturnType<App["metadataCache"]["getFileCache"]>,
  opts: ScanOptions,
): number {
  let best = opts.defaultDaysAhead;
  if (!opts.tagOverrides.length) return best;
  const tags = collectFileTags(cache);
  if (!tags.length) return best;
  for (const o of opts.tagOverrides) {
    const wanted = (o.tag || "").replace(/^#+/, "").toLowerCase();
    if (!wanted) continue;
    if (tags.includes(wanted) && o.daysAhead > best) best = o.daysAhead;
  }
  return best;
}

function collectFileTags(
  cache: ReturnType<App["metadataCache"]["getFileCache"]>,
): string[] {
  const out = new Set<string>();
  if (!cache) return [];
  // Inline hashtags (`#p/family` in the body). Strip the leading "#".
  for (const t of cache.tags ?? []) {
    const body = (t.tag || "").replace(/^#+/, "").toLowerCase();
    if (body) out.add(body);
  }
  // Frontmatter tags can be a string or list. Obsidian's parsed form keeps
  // them in `tags`/`tag` — accept either, and accept comma/space-separated
  // single-string values for hand-written notes.
  const fm = cache.frontmatter as Record<string, unknown> | undefined;
  if (fm) {
    const raw = fm.tags ?? fm.tag;
    if (typeof raw === "string") {
      for (const tok of raw.split(/[\s,]+/)) {
        const v = tok.replace(/^#+/, "").trim().toLowerCase();
        if (v) out.add(v);
      }
    } else if (Array.isArray(raw)) {
      for (const item of raw) {
        if (typeof item === "string") {
          const v = item.replace(/^#+/, "").trim().toLowerCase();
          if (v) out.add(v);
        }
      }
    }
  }
  return Array.from(out);
}
