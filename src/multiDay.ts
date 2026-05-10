import { App, TFile } from "obsidian";
import {
  parseFileTasks,
  type ParsedTask,
} from "./parser";
import {
  resolveDailyNote,
  addDays,
  startOfDay,
  type DailyNoteFallback,
} from "./dailyNote";
import {
  resolveProjectColors,
  getTaskColor,
  type ProjectColor,
} from "./colors";
import { resolveInboxPath } from "./collect";
import type { TodaySettings } from "./settings";

export interface DayBundle {
  date: Date;
  path: string;
  file: TFile | null;
  tasks: ParsedTask[];
}

export interface InboxBundle {
  path: string;
  file: TFile | null;
  tasks: ParsedTask[];
}

export interface ProjectSummary {
  project: string;
  minutes: number;
  color: string;
}

export interface WindowSummary {
  totalMin: number;
  byProject: ProjectSummary[];
}

export function buildFallback(settings: TodaySettings): DailyNoteFallback {
  return {
    folder: settings.dailyNoteFolderFallback,
    format: settings.dailyNoteFormatFallback,
    template: settings.dailyNoteTemplate,
    templatesByDay: settings.dailyNoteTemplatesByDay,
    dateLinkFormat: settings.dateLinkFormat,
    prefixes: settings.prefixes,
    quotesFile: settings.quotesFile,
    addCreatedTag: settings.addCreatedTagToFrontmatter,
  };
}

export async function loadInboxTasks(
  app: App,
  settings: TodaySettings,
): Promise<InboxBundle> {
  const path = resolveInboxPath(
    settings.inboxPath,
    settings.dailyNoteFolderFallback,
  );
  if (!path) return { path: "", file: null, tasks: [] };
  const af = app.vault.getAbstractFileByPath(path);
  if (!(af instanceof TFile)) return { path, file: null, tasks: [] };
  const content = await app.vault.read(af);
  const all = parseFileTasks(
    path,
    content,
    settings.prefixes,
    settings.defaultDurationMin,
  );
  return { path, file: af, tasks: all.filter((t) => !t.checked) };
}

export async function loadDayWindow(
  app: App,
  settings: TodaySettings,
  anchor: Date,
  count: number,
): Promise<DayBundle[]> {
  const fallback = buildFallback(settings);
  const start = startOfDay(anchor);
  const out: DayBundle[] = [];
  for (let i = 0; i < count; i++) {
    const date = addDays(start, i);
    const resolved = await resolveDailyNote(app, date, fallback);
    let tasks: ParsedTask[] = [];
    if (resolved.file) {
      const content = await app.vault.read(resolved.file);
      tasks = parseFileTasks(
        resolved.path,
        content,
        settings.prefixes,
        settings.defaultDurationMin,
      );
    }
    out.push({ date, path: resolved.path, file: resolved.file, tasks });
  }
  return out;
}

// Aggregates scheduled-task minutes per project across the visible window.
// Unscheduled tasks (startMin === null) are excluded — the summary is "what's
// on the calendar," not "what's planned." Tasks without a project bucket
// under a synthetic "Unassigned" key with a neutral color so the bar still
// reflects total committed time.
export function summarizeWindow(
  days: DayBundle[],
  projectColors: ProjectColor[],
): WindowSummary {
  const allTasks: ParsedTask[] = [];
  for (const d of days) for (const t of d.tasks) allTasks.push(t);
  const colorInputs = allTasks
    .filter((t): t is ParsedTask & { project: string } => !!t.project)
    .map((t) => ({ project: t.project, subproject: t.subproject }));
  const colorMap = resolveProjectColors(colorInputs, projectColors);

  const minutesByKey = new Map<string, number>();
  for (const t of allTasks) {
    if (t.startMin === null) continue;
    const key = t.project ?? "Unassigned";
    minutesByKey.set(key, (minutesByKey.get(key) ?? 0) + t.durationMin);
  }

  const byProject: ProjectSummary[] = [];
  let totalMin = 0;
  for (const [project, minutes] of minutesByKey) {
    totalMin += minutes;
    const color =
      project === "Unassigned"
        ? "#7B8794"
        : getTaskColor(project, null, colorMap) ?? "#7B8794";
    byProject.push({ project, minutes, color });
  }
  byProject.sort((a, b) => b.minutes - a.minutes);
  return { totalMin, byProject };
}

// Builds a colorMap keyed by project so components can look up a color for
// any task in the window without re-running resolveProjectColors per task.
export function buildWindowColorMap(
  days: DayBundle[],
  inbox: ParsedTask[],
  projectColors: ProjectColor[],
): Map<string, string> {
  const all: { project: string; subproject?: string | null }[] = [];
  for (const d of days)
    for (const t of d.tasks)
      if (t.project) all.push({ project: t.project, subproject: t.subproject });
  for (const t of inbox)
    if (t.project) all.push({ project: t.project, subproject: t.subproject });
  return resolveProjectColors(all, projectColors);
}

export function colorFor(
  task: ParsedTask,
  colorMap: Map<string, string>,
): string | null {
  return getTaskColor(task.project, task.subproject, colorMap);
}
