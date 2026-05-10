import type { ParsedTask } from "../parser";

// Shared drag state between InboxPanel and DayColumn. The HTML5 dataTransfer
// can only carry strings, but ParsedTask has nested subtask records and other
// fields we need on drop — this module-level slot holds the live object so
// the drop handler can recover the full task without re-parsing the inbox.
export interface DragState {
  task: ParsedTask;
  // True when the drag started in the inbox panel — drop handlers ignore
  // payloads originating elsewhere (e.g., the timeline drag on the main
  // today-view) so we don't accidentally treat a stale state as ours.
  fromInbox: boolean;
}

let current: DragState | null = null;

export function setDrag(state: DragState | null): void {
  current = state;
}

export function getDrag(): DragState | null {
  return current;
}
