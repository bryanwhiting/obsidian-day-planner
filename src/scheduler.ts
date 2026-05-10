import { ParsedTask } from "./parser";

export interface LayoutBlock {
  task: ParsedTask;
  topPx: number;
  heightPx: number;
  leftPct: number;
  widthPct: number;
}

export interface Totals {
  scheduledMin: number;
  unscheduledMin: number;
}

export function partition(
  tasks: ParsedTask[],
): { scheduled: ParsedTask[]; unscheduled: ParsedTask[] } {
  const scheduled: ParsedTask[] = [];
  const unscheduled: ParsedTask[] = [];
  for (const t of tasks) {
    if (t.startMin !== null) scheduled.push(t);
    else unscheduled.push(t);
  }
  scheduled.sort((a, b) => (a.startMin! - b.startMin!));
  unscheduled.sort((a, b) => {
    if (a.order !== null && b.order !== null) return a.order - b.order;
    if (a.order !== null) return -1;
    if (b.order !== null) return 1;
    return a.lineNumber - b.lineNumber;
  });
  return { scheduled, unscheduled };
}

export function computeTotals(tasks: ParsedTask[]): Totals {
  // Scheduled total measures the union of occupied time, not the sum of
  // durations — two overlapping 1h tasks count as 1h on the calendar, not 2h.
  const intervals: Array<[number, number]> = [];
  let unscheduledMin = 0;
  for (const t of tasks) {
    if (t.startMin !== null) {
      intervals.push([t.startMin, t.startMin + t.durationMin]);
    } else {
      unscheduledMin += t.durationMin;
    }
  }
  intervals.sort((a, b) => a[0] - b[0]);

  let scheduledMin = 0;
  let curStart = -1;
  let curEnd = -1;
  for (const [s, e] of intervals) {
    if (curEnd === -1 || s > curEnd) {
      if (curEnd !== -1) scheduledMin += curEnd - curStart;
      curStart = s;
      curEnd = e;
    } else if (e > curEnd) {
      curEnd = e;
    }
  }
  if (curEnd !== -1) scheduledMin += curEnd - curStart;

  return { scheduledMin, unscheduledMin };
}

export function computeFreeMin(
  scheduled: ParsedTask[],
  windowStartMin: number,
  windowEndMin: number,
): number {
  const windowLen = Math.max(0, windowEndMin - windowStartMin);
  if (windowLen === 0) return 0;

  const intervals: Array<[number, number]> = [];
  for (const t of scheduled) {
    if (t.startMin === null) continue;
    const start = Math.max(windowStartMin, t.startMin);
    const end = Math.min(windowEndMin, t.startMin + t.durationMin);
    if (end > start) intervals.push([start, end]);
  }
  intervals.sort((a, b) => a[0] - b[0]);

  let occupied = 0;
  let curStart = -1;
  let curEnd = -1;
  for (const [s, e] of intervals) {
    if (curEnd === -1 || s > curEnd) {
      if (curEnd !== -1) occupied += curEnd - curStart;
      curStart = s;
      curEnd = e;
    } else if (e > curEnd) {
      curEnd = e;
    }
  }
  if (curEnd !== -1) occupied += curEnd - curStart;

  return Math.max(0, windowLen - occupied);
}

export function layoutTimeline(
  scheduled: ParsedTask[],
  rangeStartMin: number,
  pxPerMin: number,
  maxColumns?: number,
): LayoutBlock[] {
  const groups = groupOverlaps(scheduled);
  const blocks: LayoutBlock[] = [];
  for (const group of groups) {
    const columns: ParsedTask[][] = [];
    for (const t of group) {
      let placed = false;
      for (const col of columns) {
        const last = col[col.length - 1];
        if (last.startMin! + last.durationMin <= t.startMin!) {
          col.push(t);
          placed = true;
          break;
        }
      }
      if (!placed) {
        if (maxColumns && columns.length >= maxColumns) {
          // Cap reached: drop the new task into the column whose last task
          // ends earliest, accepting the visual overlap so the lane stays at
          // maxColumns wide.
          let bestIdx = 0;
          let bestEnd =
            columns[0][columns[0].length - 1].startMin! +
            columns[0][columns[0].length - 1].durationMin;
          for (let i = 1; i < columns.length; i++) {
            const last = columns[i][columns[i].length - 1];
            const end = last.startMin! + last.durationMin;
            if (end < bestEnd) {
              bestEnd = end;
              bestIdx = i;
            }
          }
          columns[bestIdx].push(t);
        } else {
          columns.push([t]);
        }
      }
    }
    // Position each block within the cluster's column slot (anchored by
    // greedy idx), then let it EXTEND in BOTH directions into adjacent
    // columns whose blocks don't overlap this one in time. Both directions
    // matters when transitive grouping puts a non-conflicting block in a
    // later column: e.g. group [A 7:30-13:00, B 11:30-13:00, C 8:30-9:00]
    // packs C into col1 because col0 is held by A's long span; without
    // left-extension, C renders at right-half despite having no time
    // conflict with anyone.
    const colCount = columns.length;
    const slotPct = 100 / colCount;
    columns.forEach((col, idx) => {
      for (const t of col) {
        const leftExt = leftExtensionCols(t, idx, columns);
        const rightExt = rightExtensionCols(t, idx, columns);
        const span = leftExt + 1 + rightExt;
        blocks.push({
          task: t,
          topPx: (t.startMin! - rangeStartMin) * pxPerMin,
          heightPx: t.durationMin * pxPerMin,
          leftPct: (idx - leftExt) * slotPct,
          widthPct: span * slotPct,
        });
      }
    });
  }
  return blocks;
}

// Count of EXTRA columns to the right of `idx` this block can claim
// without colliding with any other column's block in time. Excludes the
// own column — pairs with `leftExtensionCols` so the call site can compute
// `span = leftExt + 1 + rightExt` without double-counting `idx`.
function rightExtensionCols(
  t: ParsedTask,
  idx: number,
  columns: ParsedTask[][],
): number {
  const tStart = t.startMin!;
  const tEnd = tStart + t.durationMin;
  let ext = 0;
  for (let j = idx + 1; j < columns.length; j++) {
    if (columnCollides(columns[j], tStart, tEnd)) break;
    ext++;
  }
  return ext;
}

// Mirror of rightExtensionCols, walking back from idx-1 toward 0. Returns
// the count of additional columns to the left this block can claim. Two
// blocks can each claim the same neighbor column during DIFFERENT time
// windows — they don't visually overlap because the column-collision check
// gates the extension on actual time overlap, not column ownership.
function leftExtensionCols(
  t: ParsedTask,
  idx: number,
  columns: ParsedTask[][],
): number {
  const tStart = t.startMin!;
  const tEnd = tStart + t.durationMin;
  let ext = 0;
  for (let j = idx - 1; j >= 0; j--) {
    if (columnCollides(columns[j], tStart, tEnd)) break;
    ext++;
  }
  return ext;
}

function columnCollides(
  col: ParsedTask[],
  tStart: number,
  tEnd: number,
): boolean {
  return col.some((o) => {
    const oStart = o.startMin!;
    const oEnd = oStart + o.durationMin;
    return oStart < tEnd && tStart < oEnd;
  });
}

function groupOverlaps(scheduled: ParsedTask[]): ParsedTask[][] {
  const groups: ParsedTask[][] = [];
  let current: ParsedTask[] = [];
  let currentEnd = -1;
  for (const t of scheduled) {
    const start = t.startMin!;
    const end = start + t.durationMin;
    if (current.length === 0 || start < currentEnd) {
      current.push(t);
      currentEnd = Math.max(currentEnd, end);
    } else {
      groups.push(current);
      current = [t];
      currentEnd = end;
    }
  }
  if (current.length) groups.push(current);
  return groups;
}
