import { App, TFile, normalizePath } from "obsidian";

interface DailyNotesOptions {
  format?: string;
  folder?: string;
  template?: string;
}

export interface ResolvedDailyNote {
  path: string;
  file: TFile | null;
}

export async function resolveTodayDailyNote(
  app: App,
  fallbackFormat = "YYYY-MM-DD",
): Promise<ResolvedDailyNote> {
  const opts = readDailyNotesOptions(app);
  const format = opts.format || fallbackFormat;
  const folder = (opts.folder || "").trim();
  const fileName = formatDate(new Date(), format) + ".md";
  const path = normalizePath(folder ? `${folder}/${fileName}` : fileName);
  const file = app.vault.getAbstractFileByPath(path);
  return {
    path,
    file: file instanceof TFile ? file : null,
  };
}

export async function ensureTodayDailyNote(app: App): Promise<TFile> {
  const resolved = await resolveTodayDailyNote(app);
  if (resolved.file) return resolved.file;
  const folder = resolved.path.includes("/")
    ? resolved.path.slice(0, resolved.path.lastIndexOf("/"))
    : "";
  if (folder) {
    const existing = app.vault.getAbstractFileByPath(folder);
    if (!existing) await app.vault.createFolder(folder);
  }
  return app.vault.create(resolved.path, "");
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

function formatDate(d: Date, format: string): string {
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
