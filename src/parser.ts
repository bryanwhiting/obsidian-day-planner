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
  subproject: string | null;
  description: string | null;
  indent: string;
  subtasks: ParsedSubtask[];
  // Task-context labels parsed from `#tc/<slug>` tags. Free-form labels the
  // user attaches to tasks for filtering / categorisation (e.g. `billable`,
  // `client-acme`). Multiple per line are allowed; rendered as chips next to
  // the project label.
  tags: string[];
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
  taskId: string;
  actual: string;
  taskContext: string;
  taskCreated: string;
}

export const DEFAULT_PREFIXES: TagPrefixes = {
  duration: "d",
  time: "t",
  order: "o",
  project: "p",
  exercise: "x",
  taskId: "tid",
  actual: "ta",
  taskContext: "tc",
  taskCreated: "tcr",
};

export interface ExerciseSet {
  reps: number;
  weight: number | null;
  done: boolean;
}

export interface ExerciseSummary {
  name: string;
  sets: ExerciseSet[];
}

const TASK_LINE = /^(\s*)- \[([ xX/\-!?*<>])\]\s+(.*)$/;
// Inline description in `{…}`. Only single-level braces are recognised so
// stray `{` characters don't accidentally swallow rest-of-line content.
const DESCRIPTION_RE = /\{([^{}]*)\}/;

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
    // Project tag supports an optional `/<subproject>` segment, e.g.
    // `#tp/silvermine/back-end`. Group 1 is the project, group 2 the subproject.
    project: new RegExp(
      `#${esc(prefixes.project)}\\/([\\w-]+)(?:\\/([\\w-]+))?`,
    ),
    // Numeric segments accept `_` as a decimal separator (Obsidian tags treat
    // `.` as a tag terminator), so `#x/Run/1_5` parses as 1.5 reps and
    // `#x/BodyWeight/189_3` as 189.3.
    exercise: new RegExp(
      `#${esc(prefixes.exercise)}\\/([\\w-]+)\\/(\\d+(?:[._]\\d+)?)(?:\\/(\\d+(?:[._]\\d+)?))?`,
      "g",
    ),
    taskId: new RegExp(`#${esc(prefixes.taskId)}\\/([A-Za-z0-9]+)\\b`),
    actual: new RegExp(
      `#${esc(prefixes.actual)}\\/(?:(\\d+)h)?(?:(\\d+)m)?(?=\\s|$)`,
    ),
    // Repeatable label tag — `g` flag so callers can collect every match on
    // a line via matchAll.
    taskContext: new RegExp(
      `#${esc(prefixes.taskContext)}\\/([\\w-]+)`,
      "g",
    ),
    taskCreated: new RegExp(
      `#${esc(prefixes.taskCreated)}\\/(\\d{4}-\\d{2}-\\d{2})\\b`,
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
    // Tags only count when they're on a task line. Plain prose / bullets are
    // skipped — there's no completion state to read on a non-task line.
    if (!taskMatch) continue;
    const done = taskMatch[2] === "x" || taskMatch[2] === "X";
    for (const m of taskMatch[3].matchAll(re)) {
      const name = m[1];
      const reps = parseFloat(m[2].replace("_", "."));
      const weight =
        m[3] !== undefined ? parseFloat(m[3].replace("_", ".")) : null;
      if (!isFinite(reps) || reps <= 0) continue;
      let summary = byName.get(name);
      if (!summary) {
        summary = { name, sets: [] };
        byName.set(name, summary);
        out.push(summary);
      }
      summary.sets.push({ reps, weight, done });
    }
  }
  return out;
}

// Aggregates a list of sets into a display string. Bodyweight sets collapse
// into a single rep total ("50"); weighted sets group by weight bucket and
// sum reps within each ("10×135, 8×155"). Returns "" for an empty list.
function formatSets(sets: ExerciseSet[]): string {
  if (sets.length === 0) return "";
  const hasWeight = sets.some((s) => s.weight !== null);
  if (!hasWeight) {
    return String(sets.reduce((a, s) => a + s.reps, 0));
  }
  const buckets = new Map<string, { reps: number; weight: number | null }>();
  for (const set of sets) {
    const key = set.weight === null ? "" : String(set.weight);
    const cur = buckets.get(key);
    if (cur) cur.reps += set.reps;
    else buckets.set(key, { reps: set.reps, weight: set.weight });
  }
  const parts: string[] = [];
  for (const { reps, weight } of buckets.values()) {
    parts.push(weight === null ? `${reps}` : `${reps}×${weight}`);
  }
  return parts.join(", ");
}

export function formatExerciseSummary(summary: ExerciseSummary): string {
  const done = formatSets(summary.sets.filter((s) => s.done));
  const pending = formatSets(summary.sets.filter((s) => !s.done));
  if (done && pending) return `${summary.name} ${done} (${pending})`;
  if (done) return `${summary.name} ${done}`;
  if (pending) return `${summary.name} (${pending})`;
  return summary.name;
}

// Scans a file for the first `#<tag>` occurrence and returns the trailing
// text on that line (trimmed). Returns null if the tag is absent or bare
// with no following text. The lookahead guards against substrings like
// `#intentional` or nested tags like `#intention/foo`.
export function parseTaggedLine(
  content: string,
  tagName: string,
): string | null {
  const tag = tagName.replace(/^#+/, "").trim();
  if (!tag) return null;
  const esc = tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`#${esc}(?![A-Za-z0-9_/])\\s*([^\\n]*)`);
  for (const line of content.split("\n")) {
    const m = re.exec(line);
    if (!m) continue;
    const text = m[1].trim();
    if (text.length === 0) continue;
    return text;
  }
  return null;
}

// Reads the frontmatter property whose name matches `tagName` (with any
// leading `#` stripped) and returns it as a non-empty trimmed string. Lists
// return their first non-empty entry. Numbers/booleans are stringified.
// Returns null when the property is missing, empty, or not a value we can
// represent inline.
export function parseFrontmatterField(
  frontmatter: Record<string, unknown> | null | undefined,
  tagName: string,
): string | null {
  if (!frontmatter) return null;
  const key = tagName.replace(/^#+/, "").trim();
  if (!key) return null;
  const v = frontmatter[key];
  if (v == null) return null;
  if (typeof v === "string") {
    const t = v.trim();
    return t.length ? t : null;
  }
  if (typeof v === "number" || typeof v === "boolean") {
    return String(v);
  }
  if (Array.isArray(v)) {
    for (const item of v) {
      if (typeof item === "string") {
        const t = item.trim();
        if (t.length) return t;
      } else if (typeof item === "number" || typeof item === "boolean") {
        return String(item);
      }
    }
    return null;
  }
  return null;
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

export function parseSubproject(
  body: string,
  prefixes: TagPrefixes,
): string | null {
  const m = buildTagRegexes(prefixes).project.exec(body);
  return m && m[2] ? m[2] : null;
}

// Returns every `#<taskContext>/<slug>` label on the line, in source order
// with duplicates removed.
export function parseTaskContexts(
  body: string,
  prefixes: TagPrefixes,
): string[] {
  const re = buildTagRegexes(prefixes).taskContext;
  const seen = new Set<string>();
  const out: string[] = [];
  for (const m of body.matchAll(re)) {
    const tag = m[1];
    if (!seen.has(tag)) {
      seen.add(tag);
      out.push(tag);
    }
  }
  return out;
}

export function parseDescription(body: string): string | null {
  const m = DESCRIPTION_RE.exec(body);
  if (!m) return null;
  const text = m[1].trim();
  return text.length > 0 ? text : null;
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

// Sums #d/ durations across the given subtask lines. Subtasks without a
// duration tag are skipped. Returns 0 when nothing contributes — callers
// treat that as "no subtask-derived duration" and fall back to whatever
// they would have used otherwise (default duration, modal value, etc.).
export function sumSubtaskDurations(
  subtaskRawLines: string[],
  prefixes: TagPrefixes,
): number {
  let total = 0;
  for (const line of subtaskRawLines) {
    const d = parseDuration(line, prefixes);
    if (d !== null) total += d;
  }
  return total;
}

// Walks the file content for top-level tasks lacking a #d/ tag whose
// subtasks contribute durations, and rewrites each parent line with
// #d/<sum>. Used when a daily note is first created from a template (and
// when a new task is appended) so the calendar layout reflects the
// subtask breakdown the user planned. Parent lines with an explicit
// #d/ tag are left alone.
export function applyComputedParentDurations(
  content: string,
  prefixes: TagPrefixes,
): string {
  const tasks = parseFileTasks("", content, prefixes, 0);
  let lines: string[] | null = null;
  for (const t of tasks) {
    if (t.hasExplicitDuration) continue;
    const sum = sumSubtaskDurations(
      t.subtasks.map((s) => s.rawLine),
      prefixes,
    );
    if (sum <= 0) continue;
    if (!lines) lines = content.split("\n");
    if (lines[t.lineNumber] !== t.rawLine) continue;
    lines[t.lineNumber] = setDurationTag(t.rawLine, sum, prefixes);
  }
  return lines ? lines.join("\n") : content;
}

export function parseActualTime(
  body: string,
  prefixes: TagPrefixes,
): number | null {
  const m = buildTagRegexes(prefixes).actual.exec(body);
  if (!m) return null;
  const h = m[1] ? parseInt(m[1], 10) : 0;
  const min = m[2] ? parseInt(m[2], 10) : 0;
  const total = h * 60 + min;
  return total > 0 ? total : null;
}

export function formatActualTime(
  totalMin: number,
  prefixes: TagPrefixes,
): string {
  const safe = Math.max(1, Math.round(totalMin));
  const h = Math.floor(safe / 60);
  const m = safe % 60;
  let body: string;
  if (h === 0) body = `${m}m`;
  else if (m === 0) body = `${h}h`;
  else body = `${h}h${m}m`;
  return `#${prefixes.actual}/${body}`;
}

// Adds `addMin` minutes onto the line's existing #ta/ tag (creating it if
// none is present). Used by the pomodoro timer to accumulate actual work
// time on the parent task or active sub-task across sessions.
export function addActualTimeTag(
  rawLine: string,
  addMin: number,
  prefixes: TagPrefixes,
): string {
  if (addMin <= 0) return rawLine;
  const re = buildTagRegexes(prefixes).actual;
  const m = re.exec(rawLine);
  const existing =
    m === null
      ? 0
      : (m[1] ? parseInt(m[1], 10) : 0) * 60 +
        (m[2] ? parseInt(m[2], 10) : 0);
  const total = existing + addMin;
  const newTag = formatActualTime(total, prefixes);
  if (m) return rawLine.replace(re, newTag);
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
  const subproject = parseSubproject(body, prefixes);
  const description = parseDescription(body);
  const checked = m[2] !== " ";
  const tags = parseTaskContexts(body, prefixes);
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
    subproject,
    description,
    indent,
    subtasks: [],
    tags,
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
  // Tracks the indent of the most recent top-level task and the parent we'd
  // attach a subtask to. `visibleParent === null` means the top-level was
  // dropped (migrated `[>]`) — subsequent indented children are dropped too
  // so they don't accidentally re-attach to an earlier parent or get parsed
  // as fresh top-level tasks. Migrated tasks (`- [>]`) are hidden from the
  // UI on the source day; they live elsewhere now and should only show on
  // the destination day.
  let last: { indentLen: number; visibleParent: ParsedTask | null } | null =
    null;
  for (let i = 0; i < lines.length; i++) {
    const m = TASK_LINE.exec(lines[i]);
    if (!m) continue;
    const indent = m[1];
    const migrated = m[2] === ">";
    if (last && indent.length > last.indentLen) {
      if (migrated) continue; // hide migrated subtask
      if (last.visibleParent === null) continue; // parent was hidden
      last.visibleParent.subtasks.push({
        lineNumber: i,
        rawLine: lines[i],
        text: m[3],
        checked: m[2] !== " ",
      });
      continue;
    }
    if (migrated) {
      last = { indentLen: indent.length, visibleParent: null };
      continue;
    }
    const t = parseTaskLine(filePath, i, lines[i], prefixes, defaultDurationMin);
    if (!t) continue;
    tasks.push(t);
    last = { indentLen: indent.length, visibleParent: t };
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

export function removeDurationTag(rawLine: string, prefixes: TagPrefixes): string {
  const re = buildTagRegexes(prefixes).duration;
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

// `project` may include an optional `/subproject` segment (e.g.
// `silvermine/back-end`). Both segments are validated against [\w-].
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

// Replaces every existing `#<taskContext>/<x>` tag on the line with the
// supplied list (in order, deduped, [\w-] only). Empty list strips them.
// Tags are appended at the end of the line if there were none before.
export function setTaskContextTags(
  rawLine: string,
  tags: string[],
  prefixes: TagPrefixes,
): string {
  const re = buildTagRegexes(prefixes).taskContext;
  const seen = new Set<string>();
  const cleaned: string[] = [];
  for (const t of tags) {
    const norm = t.trim();
    if (!norm || !/^[\w-]+$/.test(norm)) continue;
    if (seen.has(norm)) continue;
    seen.add(norm);
    cleaned.push(norm);
  }
  let stripped = rawLine
    .replace(re, "")
    .replace(/[ \t]+$/, "")
    .replace(/  +/g, " ");
  if (cleaned.length === 0) return stripped;
  const formatted = cleaned
    .map((t) => `#${prefixes.taskContext}/${t}`)
    .join(" ");
  return `${stripped} ${formatted}`.replace(/  +/g, " ");
}

export function parseTaskId(
  body: string,
  prefixes: TagPrefixes,
): string | null {
  const m = buildTagRegexes(prefixes).taskId.exec(body);
  return m ? m[1] : null;
}

export function setTaskIdTag(
  rawLine: string,
  id: string,
  prefixes: TagPrefixes,
): string {
  const re = buildTagRegexes(prefixes).taskId;
  const newTag = `#${prefixes.taskId}/${id}`;
  if (re.test(rawLine)) return rawLine.replace(re, newTag);
  return appendTag(rawLine, newTag);
}

export function generateTaskId(length: number): string {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const len = Math.max(1, Math.floor(length));
  let id = "";
  for (let i = 0; i < len; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
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

// Marks a task line as migrated by replacing its checkbox with `[>]`. The
// migrated state is distinct from completion: the task moved to another
// file (typically the inbox) where a `[ ]` copy carrying the same
// `#tid/<id>` continues to live.
export function setTaskMigrated(rawLine: string): string {
  const m = TASK_LINE.exec(rawLine);
  if (!m) return rawLine;
  const indent = m[1];
  const body = m[3];
  return `${indent}- [>] ${body}`;
}

export function parseTaskCreated(
  body: string,
  prefixes: TagPrefixes,
): string | null {
  const m = buildTagRegexes(prefixes).taskCreated.exec(body);
  return m ? m[1] : null;
}

// Adds `#<taskCreated>/<YYYY-MM-DD>` to the line if it doesn't already
// carry one. No-op when a creation tag is already present — we never
// overwrite an existing date.
export function setTaskCreatedTag(
  rawLine: string,
  dateStr: string,
  prefixes: TagPrefixes,
): string {
  const re = buildTagRegexes(prefixes).taskCreated;
  if (re.test(rawLine)) return rawLine;
  return appendTag(rawLine, `#${prefixes.taskCreated}/${dateStr}`);
}

// Replace-or-append variant: always ends with exactly one `#<taskCreated>/<dateStr>`
// tag, regardless of whether the line already carried one. Used by the edit modal
// when the user changes the "Created" date through the collapsible.
export function replaceTaskCreatedTag(
  rawLine: string,
  dateStr: string,
  prefixes: TagPrefixes,
): string {
  const re = buildTagRegexes(prefixes).taskCreated;
  const newTag = `#${prefixes.taskCreated}/${dateStr}`;
  if (re.test(rawLine)) return rawLine.replace(re, newTag);
  return appendTag(rawLine, newTag);
}

export function removeTaskCreatedTag(
  rawLine: string,
  prefixes: TagPrefixes,
): string {
  const re = buildTagRegexes(prefixes).taskCreated;
  return rawLine.replace(re, "").replace(/[ \t]+$/, "").replace(/  +/g, " ");
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
    `#(?:${esc(prefixes.duration)}|${esc(prefixes.time)}|${esc(prefixes.order)}|${esc(prefixes.project)}|${esc(prefixes.exercise)}|${esc(prefixes.taskId)}|${esc(prefixes.taskContext)}|${esc(prefixes.taskCreated)})\\/`,
  );
  const tagMatch = tagRe.exec(body);
  let tagsPart = tagMatch ? body.slice(tagMatch.index).trim() : "";
  const beforeTags = tagMatch ? body.slice(0, tagMatch.index) : body;

  // Preserve any inline {description} so editing the title doesn't drop it.
  const descMatch = DESCRIPTION_RE.exec(beforeTags);
  const descPart = descMatch ? `{${descMatch[1].trim()}}` : "";

  // Preserve bare hashtags like `#meeting` (context tags) — the modal hides
  // them from the title input, but we must not silently delete them on save.
  const bareTags: string[] = [];
  for (const bm of beforeTags.matchAll(/#[A-Za-z][\w-]*(?![\w/-])/g)) {
    bareTags.push(bm[0]);
  }

  // If the new title contains a tag of a single-instance prefix
  // (duration/time/order/project), drop the matching tag from tagsPart so
  // the user's typed value wins instead of being stacked alongside the old
  // one. Exercise and task-id are left alone since they can repeat.
  const singletonPrefixes = [
    prefixes.duration,
    prefixes.time,
    prefixes.order,
    prefixes.project,
  ];
  for (const p of singletonPrefixes) {
    if (new RegExp(`#${esc(p)}\\/\\S+`).test(newTitle)) {
      tagsPart = tagsPart
        .replace(new RegExp(`#${esc(p)}\\/\\S+`, "g"), "")
        .replace(/\s+/g, " ")
        .trim();
    }
  }

  const trimmedTitle = newTitle.trim();
  const parts: string[] = [trimmedTitle];
  for (const t of bareTags) parts.push(t);
  if (descPart) parts.push(descPart);
  if (tagsPart) parts.push(tagsPart);
  return `${indent}- [${checkbox}] ${parts.join(" ")}`;
}

export function setTaskDescription(
  rawLine: string,
  newDescription: string,
  prefixes: TagPrefixes,
): string {
  const m = TASK_LINE.exec(rawLine);
  if (!m) return rawLine;
  const indent = m[1];
  const checkbox = m[2];
  const body = m[3];

  const trimmed = newDescription.trim();
  const hasDesc = DESCRIPTION_RE.test(body);

  if (hasDesc) {
    const next = trimmed
      ? body.replace(DESCRIPTION_RE, `{${trimmed}}`)
      : body.replace(DESCRIPTION_RE, "").replace(/[ \t]+/g, " ").trim();
    return `${indent}- [${checkbox}] ${next}`;
  }

  if (!trimmed) return rawLine;

  const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const tagRe = new RegExp(
    `#(?:${esc(prefixes.duration)}|${esc(prefixes.time)}|${esc(prefixes.order)}|${esc(prefixes.project)}|${esc(prefixes.exercise)}|${esc(prefixes.taskId)}|${esc(prefixes.taskContext)}|${esc(prefixes.taskCreated)})\\/`,
  );
  const tagMatch = tagRe.exec(body);
  if (tagMatch) {
    const before = body.slice(0, tagMatch.index).replace(/\s+$/, "");
    const after = body.slice(tagMatch.index);
    return `${indent}- [${checkbox}] ${before} {${trimmed}} ${after}`.replace(/  +/g, " ");
  }
  return `${indent}- [${checkbox}] ${body.replace(/\s+$/, "")} {${trimmed}}`;
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

// Decimal-hours form for the Reporting view: 210 → "3.5", 30 → "0.5",
// 120 → "2", 75 → "1.25". Two-decimal max, trailing zeros trimmed.
export function formatHoursDecimal(totalMin: number): string {
  if (totalMin <= 0) return "0";
  const hours = totalMin / 60;
  return hours.toFixed(2).replace(/\.?0+$/, "");
}

// Compact 12-hour clock label: "7a" (no minutes), "12p" (noon), "7:30p"
// (half-hour). The colon goes in for display; strip it before writing as a
// `#t/` tag body (the parser regex doesn't allow ":").
export function formatClockShort(totalMin: number): string {
  const h24 = Math.floor(totalMin / 60) % 24;
  const m = totalMin % 60;
  const ampm = h24 < 12 ? "a" : "p";
  let h12 = h24 % 12;
  if (h12 === 0) h12 = 12;
  return m === 0
    ? `${h12}${ampm}`
    : `${h12}:${m.toString().padStart(2, "0")}${ampm}`;
}

// Hour and half-hour clock labels across [startHour, endHour). Used by the
// time-trigger autocomplete in both the modal title and the markdown editor.
export function buildTimeOptions(startHour: number, endHour: number): string[] {
  const out: string[] = [];
  const lo = Math.max(0, Math.min(23, Math.floor(startHour)));
  const hi = Math.max(lo + 1, Math.min(24, Math.floor(endHour)));
  for (let h = lo; h < hi; h++) {
    out.push(formatClockShort(h * 60));
    out.push(formatClockShort(h * 60 + 30));
  }
  return out;
}

// "7p" stays "7p"; "7:30p" → "730p". Drops the colon so the result fits the
// `#t/` tag's regex (which expects digits + am/pm only).
export function timeDisplayToTagBody(display: string): string {
  return display.replace(":", "");
}

// Compact form used on quick-duration chips: "15m", "1h", "1h30m" (no space).
export function formatCompactDuration(totalMin: number): string {
  if (totalMin <= 0) return "0m";
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h${m}m`;
}

// Parses chip strings like "5m", "10m", "1h", "1h30m", "90m". Whitespace is
// ignored. Returns minutes, or null if the input doesn't match.
export function parseCompactDuration(raw: string): number | null {
  const s = raw.replace(/\s+/g, "").toLowerCase();
  if (!s) return null;
  const m = /^(?:(\d+)h)?(?:(\d+)m)?$/.exec(s);
  if (!m || (!m[1] && !m[2])) return null;
  const total = (m[1] ? parseInt(m[1], 10) : 0) * 60 + (m[2] ? parseInt(m[2], 10) : 0);
  return total > 0 ? total : null;
}
