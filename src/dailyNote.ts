import { App, TFile, normalizePath, Notice, moment } from "obsidian";

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
  const initialContent = await readTemplateContent(app, fallback.template);
  const file = await app.vault.create(resolved.path, initialContent);
  if (notify) new Notice(`Created ${resolved.path}`);
  return file;
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

// Resolves the relative-date keywords supported by the @-trigger autocomplete
// against the provided `today`. Empty query returns the full default list
// (today / tomorrow / yesterday plus a few Nd shortcuts); a non-empty query
// either prefix-matches the named keywords or, when numeric, yields a single
// "Nd" entry. Anything else returns no suggestions.
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
