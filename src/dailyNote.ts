import { App, TFile, normalizePath, Notice } from "obsidian";

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
    new Notice(`Daily Notes Planner: template not found at ${path}`);
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
