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
}

export interface TagPrefixes {
  duration: string;
  time: string;
  order: string;
  project: string;
}

export const DEFAULT_PREFIXES: TagPrefixes = {
  duration: "d",
  time: "t",
  order: "o",
  project: "p",
};

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
  };
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
  };
}

export function parseFileTasks(
  filePath: string,
  fileContent: string,
  prefixes: TagPrefixes,
  defaultDurationMin: number,
): ParsedTask[] {
  const lines = fileContent.split("\n");
  const tasks: ParsedTask[] = [];
  for (let i = 0; i < lines.length; i++) {
    const t = parseTaskLine(filePath, i, lines[i], prefixes, defaultDurationMin);
    if (t) tasks.push(t);
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
    `#(?:${esc(prefixes.duration)}|${esc(prefixes.time)}|${esc(prefixes.order)}|${esc(prefixes.project)})\\/`,
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
