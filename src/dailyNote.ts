import { App, TFile, normalizePath, Notice, moment } from "obsidian";
import {
  WEEKDAY_NAMES,
  type DailyNoteWeekdayTemplates,
} from "./settings";
import {
  applyComputedParentDurations,
  type TagPrefixes,
} from "./parser";

interface DailyNotesOptions {
  format?: string;
  folder?: string;
  template?: string;
}

export interface ResolvedDailyNote {
  path: string;
  file: TFile | null;
}

export interface DailyNoteFallback {
  folder: string;
  format: string;
  template?: string;
  // Optional per-weekday templates appended to `template` based on the date's
  // day-of-week (Date.getDay(): 0=Sunday..6=Saturday). Empty entries are
  // skipped so the base template applies alone on those days.
  templatesByDay?: DailyNoteWeekdayTemplates;
  // Moment.js format used for the visible alias on date links written by the
  // template parser. Empty/absent → no alias; the link uses just the basename.
  dateLinkFormat?: string;
  // Tag prefixes used to detect/rewrite #d/ tags. When present, parent
  // tasks in the rendered template that lack a #d/ tag and whose subtasks
  // carry #d/ tags get their duration computed as the subtask sum and
  // written onto the parent line before the file is created.
  prefixes?: TagPrefixes;
}

export async function resolveDailyNote(
  app: App,
  date: Date,
  fallback: DailyNoteFallback,
): Promise<ResolvedDailyNote> {
  const opts = readDailyNotesOptions(app);
  const format = (opts.format || fallback.format).trim();
  const folder = (opts.folder ?? fallback.folder).trim();
  const fileName = formatDate(date, format) + ".md";
  const path = normalizePath(folder ? `${folder}/${fileName}` : fileName);
  const file = app.vault.getAbstractFileByPath(path);
  return {
    path,
    file: file instanceof TFile ? file : null,
  };
}

export async function ensureDailyNote(
  app: App,
  date: Date,
  fallback: DailyNoteFallback,
  notify = true,
): Promise<TFile> {
  const resolved = await resolveDailyNote(app, date, fallback);
  if (resolved.file) return resolved.file;
  const folder = resolved.path.includes("/")
    ? resolved.path.slice(0, resolved.path.lastIndexOf("/"))
    : "";
  if (folder) {
    const existing = app.vault.getAbstractFileByPath(folder);
    if (!existing) await app.vault.createFolder(folder);
  }
  const basename = resolved.path
    .split("/")
    .pop()!
    .replace(/\.md$/i, "");
  const rawTemplate = await readCombinedTemplate(app, fallback, date);
  const expanded = expandDateTemplate(
    rawTemplate,
    basename,
    app,
    fallback.format,
    fallback.folder,
    fallback.dateLinkFormat ?? "",
  );
  const initialContent = fallback.prefixes
    ? applyComputedParentDurations(expanded, fallback.prefixes)
    : expanded;
  const file = await app.vault.create(resolved.path, initialContent);
  if (notify) new Notice(`Created ${resolved.path}`);
  return file;
}

// Backstop for when Obsidian (or any other plugin) creates a daily-note file
// behind our back — most commonly when the user clicks an unresolved wiki
// link to "daily/2026-05-08" and Obsidian writes an empty file. We listen for
// vault create events and, if the new file lives in the configured daily
// folder, has a basename that parses against the daily-note format, and is
// still empty, write the expanded template into it. The empty-content guard
// keeps us from overwriting any other plugin (or our own ensureDailyNote
// path, which writes content up front so this handler is a no-op there).
export async function applyDailyNoteTemplateIfEmpty(
  app: App,
  file: TFile,
  fallback: DailyNoteFallback,
): Promise<void> {
  if (file.extension !== "md") return;
  const opts = readDailyNotesOptions(app);
  const folder = stripSlashes((opts.folder ?? fallback.folder).trim());
  const format = (opts.format || fallback.format).trim() || "YYYY-MM-DD";
  const fileFolder = stripSlashes(file.parent?.path ?? "");
  if (fileFolder !== folder) return;
  if (!parseFilenameDate(file.basename, format)) return;
  const existing = await app.vault.read(file);
  if (existing.length > 0) return;
  const parsed = parseFilenameDate(file.basename, format);
  const refDate = parsed ?? new Date();
  const template = await readCombinedTemplate(app, fallback, refDate);
  if (!template) return;
  const expanded = expandDateTemplate(
    template,
    file.basename,
    app,
    format,
    folder,
    fallback.dateLinkFormat ?? "",
  );
  const finalContent = fallback.prefixes
    ? applyComputedParentDurations(expanded, fallback.prefixes)
    : expanded;
  await app.vault.modify(file, finalContent);
}

function stripSlashes(s: string): string {
  return s.replace(/^\/+|\/+$/g, "");
}

async function readTemplateContent(
  app: App,
  templatePath: string | undefined,
): Promise<string> {
  const raw = (templatePath ?? "").trim();
  if (!raw) return "";
  const withExt = raw.toLowerCase().endsWith(".md") ? raw : `${raw}.md`;
  const path = normalizePath(withExt);
  const file = app.vault.getAbstractFileByPath(path);
  if (!(file instanceof TFile)) {
    new Notice(`Today: template not found at ${path}`);
    return "";
  }
  return app.vault.read(file);
}

// Reads the base template and (if configured) the weekday-specific template
// for `date`'s day-of-week, then concatenates them with a newline separator
// when both are non-empty. The weekday template is appended after the base.
async function readCombinedTemplate(
  app: App,
  fallback: DailyNoteFallback,
  date: Date,
): Promise<string> {
  const base = await readTemplateContent(app, fallback.template);
  const byDay = fallback.templatesByDay;
  if (!byDay) return base;
  const dayKey = WEEKDAY_NAMES[date.getDay()];
  const dayPath = byDay[dayKey];
  if (!dayPath) return base;
  const dayContent = await readTemplateContent(app, dayPath);
  if (!dayContent) return base;
  if (!base) return dayContent;
  // Ensure exactly one blank line separates the two so the appended block
  // doesn't run into the base template's trailing content.
  const baseTrimmed = base.replace(/\s+$/, "");
  return `${baseTrimmed}\n\n${dayContent}`;
}

function readDailyNotesOptions(app: App): DailyNotesOptions {
  const internal = (app as unknown as {
    internalPlugins?: {
      getPluginById?: (id: string) => {
        instance?: { options?: DailyNotesOptions };
        enabled?: boolean;
      } | null;
    };
  }).internalPlugins;
  const plugin = internal?.getPluginById?.("daily-notes");
  return plugin?.instance?.options ?? {};
}

export function formatDate(d: Date, format: string): string {
  const pad = (n: number, w = 2) => n.toString().padStart(w, "0");
  const replacements: Record<string, string> = {
    YYYY: d.getFullYear().toString(),
    MM: pad(d.getMonth() + 1),
    DD: pad(d.getDate()),
    HH: pad(d.getHours()),
    mm: pad(d.getMinutes()),
    ss: pad(d.getSeconds()),
  };
  return format.replace(/YYYY|MM|DD|HH|mm|ss/g, (m) => replacements[m] ?? m);
}

export function addDays(d: Date, n: number): Date {
  const next = new Date(d);
  next.setDate(next.getDate() + n);
  return next;
}

export function addMonths(d: Date, n: number): Date {
  const next = new Date(d);
  next.setDate(1);
  next.setMonth(next.getMonth() + n);
  return next;
}

export function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export function endOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

export function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

// One entry returned by buildDateSuggestions — fed to the picker UI, which
// uses `keyword` as the visible label and resolves `date` to a daily-note link
// when the user picks it.
export interface DateSuggestion {
  keyword: string;
  date: Date;
}

// Resolves a single date keyword (today / tomorrow / yesterday / Nd) to a
// concrete Date relative to `refDate`. Returns null for anything else. Used by
// both the @-trigger picker (when matching exact keywords) and the template
// parser (which expects exact, not prefix, matches).
export function resolveDateKeyword(kw: string, refDate: Date): Date | null {
  const k = kw.trim().toLowerCase();
  if (k === "today") return refDate;
  if (k === "tomorrow") return addDays(refDate, 1);
  if (k === "yesterday") return addDays(refDate, -1);
  const m = k.match(/^(\d+)d$/);
  if (m) {
    const n = parseInt(m[1], 10);
    if (Number.isFinite(n) && n >= 0 && n <= 365) return addDays(refDate, n);
  }
  return null;
}

// Substitutes <@today>, <@tomorrow>, <@yesterday>, <@Nd> placeholders inside
// `content` with daily-note links. The bare form is anchored to wall-clock
// today; the `-rel` suffix (e.g. <@today-rel>, <@yesterday-rel>) anchors to
// the date parsed out of `fileBasename` via `fileFormat`. So a template
// applied to 2026-03-04.md says <@yesterday-rel> = 03-03 even when the
// real-world date is something else, while <@today> always tracks the actual
// day the note is created — that's what lets the same template stay
// meaningful both for backfilled and pre-created daily notes.
export function expandDateTemplate(
  content: string,
  fileBasename: string,
  app: App,
  fileFormat: string,
  folder: string,
  displayFormat: string,
): string {
  if (!content) return content;
  return content.replace(
    /<@([A-Za-z0-9]+)(-rel)?>/g,
    (match, kw: string, rel: string | undefined) => {
      let ref: Date;
      if (rel) {
        const parsed = parseFilenameDate(fileBasename, fileFormat);
        if (!parsed) return match;
        ref = parsed;
      } else {
        ref = new Date();
      }
      const date = resolveDateKeyword(kw, ref);
      if (!date) return match;
      return buildDateLinkInsert(app, date, fileFormat, folder, displayFormat);
    },
  );
}

// Parses `basename` against `fileFormat` (a moment.js pattern, e.g.
// "YYYY-MM-DD") in strict mode. Returns null when the filename doesn't match
// the expected daily-note shape — callers should leave the placeholder
// untouched in that case so users can spot the mismatch.
function parseFilenameDate(basename: string, fileFormat: string): Date | null {
  const fmt = (fileFormat || "YYYY-MM-DD").trim();
  const m = moment(basename, fmt, true);
  return m.isValid() ? m.toDate() : null;
}

const MONTH_NAMES = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december",
];

// Resolves a month-name query (e.g. "apr", "april", "may 5") to two candidate
// suggestions per matching month: the upcoming occurrence (>= today) and the
// most recent past occurrence (< today), in that order. The year is included
// in the keyword so the picker can show "apr 5 2027" vs "apr 5 2026" as
// distinct rows. Without a day in the query, day defaults to 1. Years span
// today ± 4 so a leap-day query like "feb 29" still finds candidates.
function buildMonthSuggestions(q: string, today: Date): DateSuggestion[] {
  const m = q.match(/^([a-z]+)(?:\s+(\d{1,2}))?$/);
  if (!m) return [];
  const monthQ = m[1];
  const dayStr = m[2];
  const out: DateSuggestion[] = [];
  const ref = startOfDay(today).getTime();
  for (const name of MONTH_NAMES) {
    if (!name.startsWith(monthQ)) continue;
    const monthIdx = MONTH_NAMES.indexOf(name);
    const day = dayStr ? parseInt(dayStr, 10) : 1;
    let future: Date | null = null;
    let past: Date | null = null;
    for (let yr = today.getFullYear() - 4; yr <= today.getFullYear() + 4; yr++) {
      const daysInMonth = new Date(yr, monthIdx + 1, 0).getDate();
      if (day < 1 || day > daysInMonth) continue;
      const candidate = new Date(yr, monthIdx, day);
      const t = startOfDay(candidate).getTime();
      if (t >= ref) {
        if (!future) future = candidate;
      } else {
        past = candidate;
      }
    }
    const slug = name.slice(0, 3);
    if (future) {
      out.push({
        keyword: `${slug} ${day} ${future.getFullYear()}`,
        date: future,
      });
    }
    if (past) {
      out.push({
        keyword: `${slug} ${day} ${past.getFullYear()}`,
        date: past,
      });
    }
  }
  return out;
}

// Resolves the relative-date keywords supported by the @-trigger autocomplete
// against the provided `today`. Empty query returns the full default list
// (today / tomorrow / yesterday plus a few Nd shortcuts); a non-empty query
// either prefix-matches the named keywords, parses a month name (with
// optional day, e.g. "apr 5"), or, when numeric, yields a single "Nd" entry.
export function buildDateSuggestions(
  query: string,
  today: Date = new Date(),
): DateSuggestion[] {
  const q = query.trim().toLowerCase();
  const out: DateSuggestion[] = [];
  const named: { kw: string; offset: number }[] = [
    { kw: "today", offset: 0 },
    { kw: "tomorrow", offset: 1 },
    { kw: "yesterday", offset: -1 },
  ];
  for (const n of named) {
    if (!q || n.kw.startsWith(q)) {
      out.push({ keyword: n.kw, date: addDays(today, n.offset) });
    }
  }
  out.push(...buildMonthSuggestions(q, today));
  const numeric = q.match(/^(\d+)d?$/);
  if (numeric) {
    const n = parseInt(numeric[1], 10);
    if (Number.isFinite(n) && n >= 0 && n <= 365) {
      out.push({ keyword: `${n}d`, date: addDays(today, n) });
    }
  } else if (!q) {
    for (const n of [2, 3, 7]) {
      out.push({ keyword: `${n}d`, date: addDays(today, n) });
    }
  }
  return out;
}

// Builds the inline replacement string for a picked date suggestion.
// `displayFormat` is a moment.js pattern; empty disables the alias and uses
// the bare file basename. Honors Obsidian's "Use [[Wikilinks]]" toggle to pick
// between wiki and markdown link syntax.
export function buildDateLinkInsert(
  app: App,
  date: Date,
  fileFormat: string,
  folder: string,
  displayFormat: string,
): string {
  const m = moment(date);
  const fileBasename = m.format(fileFormat || "YYYY-MM-DD");
  const cleanFolder = (folder || "").replace(/^\/+|\/+$/g, "");
  const linkPath = cleanFolder ? `${cleanFolder}/${fileBasename}` : fileBasename;
  const display = (displayFormat || "").trim()
    ? m.format(displayFormat.trim())
    : "";
  const useMd =
    (app.vault as unknown as {
      getConfig?: (key: string) => unknown;
    }).getConfig?.("useMarkdownLinks") === true;
  if (useMd) {
    const url = encodeURI(`${linkPath}.md`);
    const label = display || fileBasename;
    return `[${label}](${url})`;
  }
  if (display && display !== fileBasename) {
    return `[[${linkPath}|${display}]]`;
  }
  return `[[${linkPath}]]`;
}
