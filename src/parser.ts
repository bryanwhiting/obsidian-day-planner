export interface ParsedTask {
  filePath: string;
  lineNumber: number;
  rawLine: string;
  body: string;
  durationMin: number;
  hasExplicitDuration: boolean;
  startMin: number | null;
  order: number | null;
  checked: boolean;
  project: string | null;
  indent: string;
  subtasks: ParsedSubtask[];
}

export interface ParsedSubtask {
  lineNumber: number;
  rawLine: string;
  text: string;
  checked: boolean;
}

export interface TagPrefixes {
  duration: string;
  time: string;
  order: string;
  project: string;
  exercise: string;
}

export const DEFAULT_PREFIXES: TagPrefixes = {
  duration: "d",
  time: "t",
  order: "o",
  project: "p",
  exercise: "x",
};

export interface ExerciseSet {
  reps: number;
  weight: number | null;
}

export interface ExerciseSummary {
  name: string;
  sets: ExerciseSet[];
}

const TASK_LINE = /^(\s*)- \[([ xX/\-!?*<>])\]\s+(.*)$/;

export function buildTagRegexes(prefixes: TagPrefixes) {
  const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return {
    duration: new RegExp(
      `#${esc(prefixes.duration)}\\/(?:(\\d+)h)?(?:(\\d+)m)?(?=\\s|$)`,
    ),
    time: new RegExp(
      `#${esc(prefixes.time)}\\/(\\d{1,2})(\\d{2})?(am?|pm?)\\b`,
      "i",
    ),
    order: new RegExp(`#${esc(prefixes.order)}\\/(\\d+)\\b`),
    project: new RegExp(`#${esc(prefixes.project)}\\/([\\w-]+)`),
    exercise: new RegExp(
      `#${esc(prefixes.exercise)}\\/([\\w-]+)\\/(\\d+)(?:\\/(\\d+(?:\\.\\d+)?))?`,
      "g",
    ),
  };
}

export function parseExercises(
  content: string,
  prefixes: TagPrefixes,
): ExerciseSummary[] {
  const re = buildTagRegexes(prefixes).exercise;
  const out: ExerciseSummary[] = [];
  const byName = new Map<string, ExerciseSummary>();
  for (const line of content.split("\n")) {
    const taskMatch = TASK_LINE.exec(line);
    // Only completed task lines count toward the workout summary. Skip open
    // tasks, plain bullets, prose — anything without an explicit "x" status.
    if (!taskMatch) continue;
    const status = taskMatch[2];
    if (status !== "x" && status !== "X") continue;
    for (const m of taskMatch[3].matchAll(re)) {
      const name = m[1];
      const reps = parseInt(m[2], 10);
      const weight = m[3] !== undefined ? parseFloat(m[3]) : null;
      if (!isFinite(reps) || reps <= 0) continue;
      let summary = byName.get(name);
      if (!summary) {
        summary = { name, sets: [] };
        byName.set(name, summary);
        out.push(summary);
      }
      summary.sets.push({ reps, weight });
    }
  }
  return out;
}

export function formatExerciseSummary(summary: ExerciseSummary): string {
  const hasWeight = summary.sets.some((s) => s.weight !== null);
  if (!hasWeight) {
    const total = summary.sets.reduce((a, s) => a + s.reps, 0);
    return `${summary.name} ${total}`;
  }
  // Group sets that share a weight (or no weight) and sum their reps. Insertion
  // order is preserved so the most-recent weights don't reshuffle the line.
  const buckets = new Map<string, { reps: number; weight: number | null }>();
  for (const set of summary.sets) {
    const key = set.weight === null ? "" : String(set.weight);
    const cur = buckets.get(key);
    if (cur) cur.reps += set.reps;
    else buckets.set(key, { reps: set.reps, weight: set.weight });
  }
  const parts: string[] = [];
  for (const { reps, weight } of buckets.values()) {
    parts.push(weight === null ? `${reps}` : `${reps}×${weight}`);
  }
  return `${summary.name} ${parts.join(", ")}`;
}

export function formatExerciseLine(summaries: ExerciseSummary[]): string {
  return summaries.map(formatExerciseSummary).join(" • ");
}

export function parseDuration(
  body: string,
  prefixes: TagPrefixes,
): number | null {
  const m = buildTagRegexes(prefixes).duration.exec(body);
  if (!m) return null;
  const h = m[1] ? parseInt(m[1], 10) : 0;
  const min = m[2] ? parseInt(m[2], 10) : 0;
  const total = h * 60 + min;
  return total > 0 ? total : null;
}

export function parseTime(
  body: string,
  prefixes: TagPrefixes,
): number | null {
  const m = buildTagRegexes(prefixes).time.exec(body);
  if (!m) return null;
  const hour = parseInt(m[1], 10);
  const min = m[2] ? parseInt(m[2], 10) : 0;
  const ampm = m[3].toLowerCase().startsWith("p") ? "p" : "a";
  if (hour < 1 || hour > 12 || min > 59) return null;
  let h24 = hour % 12;
  if (ampm === "p") h24 += 12;
  return h24 * 60 + min;
}

export function parseOrder(
  body: string,
  prefixes: TagPrefixes,
): number | null {
  const m = buildTagRegexes(prefixes).order.exec(body);
  return m ? parseInt(m[1], 10) : null;
}

export function parseProject(
  body: string,
  prefixes: TagPrefixes,
): string | null {
  const m = buildTagRegexes(prefixes).project.exec(body);
  return m ? m[1] : null;
}

export function formatDuration(totalMin: number, prefixes: TagPrefixes): string {
  const safe = Math.max(1, Math.round(totalMin));
  const h = Math.floor(safe / 60);
  const m = safe % 60;
  let body: string;
  if (h === 0) body = `${m}m`;
  else if (m === 0) body = `${h}h`;
  else body = `${h}h${m}m`;
  return `#${prefixes.duration}/${body}`;
}

export function setDurationTag(
  rawLine: string,
  newDurationMin: number,
  prefixes: TagPrefixes,
): string {
  const re = buildTagRegexes(prefixes).duration;
  const newTag = formatDuration(newDurationMin, prefixes);
  if (re.test(rawLine)) return rawLine.replace(re, newTag);
  return appendTag(rawLine, newTag);
}

export function formatTime(totalMin: number, prefixes: TagPrefixes): string {
  const h24 = Math.floor(totalMin / 60) % 24;
  const min = totalMin % 60;
  const ampm = h24 < 12 ? "a" : "p";
  let h12 = h24 % 12;
  if (h12 === 0) h12 = 12;
  const minPart = min === 0 ? "" : min.toString().padStart(2, "0");
  return `#${prefixes.time}/${h12}${minPart}${ampm}`;
}

export function parseTaskLine(
  filePath: string,
  lineNumber: number,
  rawLine: string,
  prefixes: TagPrefixes,
  defaultDurationMin: number,
): ParsedTask | null {
  const m = TASK_LINE.exec(rawLine);
  if (!m) return null;
  const indent = m[1];
  const body = m[3];
  const explicitDuration = parseDuration(body, prefixes);
  const startMin = parseTime(body, prefixes);
  const durationMin = explicitDuration ?? defaultDurationMin;
  const order = parseOrder(body, prefixes);
  const project = parseProject(body, prefixes);
  const checked = m[2] !== " ";
  return {
    filePath,
    lineNumber,
    rawLine,
    body,
    durationMin,
    hasExplicitDuration: explicitDuration !== null,
    startMin,
    order,
    checked,
    project,
    indent,
    subtasks: [],
  };
}

// A sub-task is any task line whose indent is strictly greater than its
// nearest preceding top-level task. Sub-tasks are attached to that parent
// and excluded from the returned list (so they don't appear on the planner).
export function parseFileTasks(
  filePath: string,
  fileContent: string,
  prefixes: TagPrefixes,
  defaultDurationMin: number,
): ParsedTask[] {
  const lines = fileContent.split("\n");
  const tasks: ParsedTask[] = [];
  let parent: ParsedTask | null = null;
  for (let i = 0; i < lines.length; i++) {
    const m = TASK_LINE.exec(lines[i]);
    if (!m) continue;
    const indent = m[1];
    if (parent && indent.length > parent.indent.length) {
      parent.subtasks.push({
        lineNumber: i,
        rawLine: lines[i],
        text: m[3],
        checked: m[2] !== " ",
      });
      continue;
    }
    const t = parseTaskLine(filePath, i, lines[i], prefixes, defaultDurationMin);
    if (!t) continue;
    tasks.push(t);
    parent = t;
  }
  return tasks;
}

export function setTimeTag(
  rawLine: string,
  newStartMin: number,
  prefixes: TagPrefixes,
): string {
  const re = buildTagRegexes(prefixes).time;
  const newTag = formatTime(newStartMin, prefixes);
  if (re.test(rawLine)) {
    return rawLine.replace(re, newTag);
  }
  return appendTag(rawLine, newTag);
}

export function removeTimeTag(rawLine: string, prefixes: TagPrefixes): string {
  const re = buildTagRegexes(prefixes).time;
  return rawLine.replace(re, "").replace(/[ \t]+$/, "").replace(/  +/g, " ");
}

export function setOrderTag(
  rawLine: string,
  order: number,
  prefixes: TagPrefixes,
): string {
  const re = buildTagRegexes(prefixes).order;
  const newTag = `#${prefixes.order}/${order}`;
  if (re.test(rawLine)) {
    return rawLine.replace(re, newTag);
  }
  return appendTag(rawLine, newTag);
}

export function removeOrderTag(rawLine: string, prefixes: TagPrefixes): string {
  const re = buildTagRegexes(prefixes).order;
  return rawLine.replace(re, "").replace(/[ \t]+$/, "").replace(/  +/g, " ");
}

export function setProjectTag(
  rawLine: string,
  project: string,
  prefixes: TagPrefixes,
): string {
  const re = buildTagRegexes(prefixes).project;
  const newTag = `#${prefixes.project}/${project}`;
  if (re.test(rawLine)) return rawLine.replace(re, newTag);
  return appendTag(rawLine, newTag);
}

export function removeProjectTag(
  rawLine: string,
  prefixes: TagPrefixes,
): string {
  const re = buildTagRegexes(prefixes).project;
  return rawLine.replace(re, "").replace(/[ \t]+$/, "").replace(/  +/g, " ");
}

function appendTag(rawLine: string, tag: string): string {
  const trimmed = rawLine.replace(/[ \t]+$/, "");
  const sep = trimmed.endsWith(" ") ? "" : " ";
  return trimmed + sep + tag;
}

export function snapToInterval(min: number, intervalMin: number): number {
  return Math.round(min / intervalMin) * intervalMin;
}

export function findLastTaskLine(content: string): number {
  const lines = content.split("\n");
  for (let i = lines.length - 1; i >= 0; i--) {
    if (TASK_LINE.test(lines[i])) return i;
  }
  return -1;
}

export function setTaskChecked(rawLine: string, checked: boolean): string {
  const m = TASK_LINE.exec(rawLine);
  if (!m) return rawLine;
  const indent = m[1];
  const body = m[3];
  return `${indent}- [${checked ? "x" : " "}] ${body}`;
}

export function setTaskTitle(
  rawLine: string,
  newTitle: string,
  prefixes: TagPrefixes,
): string {
  const m = TASK_LINE.exec(rawLine);
  if (!m) return rawLine;
  const indent = m[1];
  const checkbox = m[2];
  const body = m[3];

  const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const tagRe = new RegExp(
    `#(?:${esc(prefixes.duration)}|${esc(prefixes.time)}|${esc(prefixes.order)}|${esc(prefixes.project)}|${esc(prefixes.exercise)})\\/`,
  );
  const tagMatch = tagRe.exec(body);
  const tagsPart = tagMatch ? body.slice(tagMatch.index).trim() : "";

  const trimmedTitle = newTitle.trim();
  const newBody = tagsPart
    ? `${trimmedTitle} ${tagsPart}`
    : trimmedTitle;
  return `${indent}- [${checkbox}] ${newBody}`;
}

export function buildTaskLine(
  body: string,
  prefixes: TagPrefixes,
  opts: { startMin?: number; durationMin: number; project?: string | null },
): string {
  const tags: string[] = [];
  if (opts.startMin !== undefined) {
    tags.push(formatTime(opts.startMin, prefixes));
  }
  tags.push(formatDuration(opts.durationMin, prefixes));
  if (opts.project) {
    tags.push(`#${prefixes.project}/${opts.project}`);
  }
  return `- [ ] ${body} ${tags.join(" ")}`;
}

export function formatTotal(totalMin: number): string {
  if (totalMin <= 0) return "0m";
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}
