import { App, Notice, TFile } from "obsidian";
import type { ParsedTask } from "./parser";
import { findLastTaskLine } from "./parser";
import { ensureDailyNote, type DailyNoteFallback } from "./dailyNote";

export interface MoveTaskOptions {
  // When set, skips ensureDailyNote and writes directly to this file.
  // Useful when the caller already resolved the target.
  targetFile?: TFile;
  notify?: boolean;
}

// Moves a task (parent + its sub-task lines) from `sourceFile` into the daily
// note for `targetDate`, appending after the last existing task line. Returns
// true on success. Used by both the single-day view's "move to date" actions
// and the multi-day view's drag-from-inbox flow.
export async function moveTaskBetweenDailyNotes(
  app: App,
  sourceFile: TFile,
  task: ParsedTask,
  targetDate: Date,
  fallback: DailyNoteFallback,
  options: MoveTaskOptions = {},
): Promise<boolean> {
  const notify = options.notify !== false;
  const targetFile =
    options.targetFile ?? (await ensureDailyNote(app, targetDate, fallback));
  if (targetFile.path === sourceFile.path) {
    if (notify) new Notice("Source and target are the same file.");
    return false;
  }

  const lineNumbers = [
    task.lineNumber,
    ...task.subtasks.map((s) => s.lineNumber),
  ].sort((a, b) => a - b);
  let movedLines: string[] = [];
  await app.vault.process(sourceFile, (content) => {
    const lines = content.split("\n");
    movedLines = lineNumbers
      .filter((n) => n < lines.length)
      .map((n) => lines[n]);
    for (let i = lineNumbers.length - 1; i >= 0; i--) {
      const n = lineNumbers[i];
      if (n < lines.length) lines.splice(n, 1);
    }
    return lines.join("\n");
  });
  if (movedLines.length === 0) {
    if (notify) new Notice("Today: nothing to move.");
    return false;
  }

  await app.vault.process(targetFile, (content) => {
    const lines = content.split("\n");
    const lastIdx = findLastTaskLine(content);
    const insertAt = lastIdx === -1 ? lines.length : lastIdx + 1;
    lines.splice(insertAt, 0, ...movedLines);
    return lines.join("\n");
  });

  if (notify) new Notice(`Moved to ${targetFile.path}`);
  return true;
}
