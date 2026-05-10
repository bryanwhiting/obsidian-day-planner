import { ItemView, Notice, TFile, WorkspaceLeaf } from "obsidian";
import type TodayPlugin from "./main";
import {
  buildFallback,
  buildWindowColorMap,
  colorFor,
  loadDayWindow,
  loadInboxTasks,
  summarizeWindow,
  type DayBundle,
  type InboxBundle,
  type WindowSummary,
} from "./multiDay";
import { addDays, sameDay, startOfDay } from "./dailyNote";
import {
  formatClockShort,
  parseDuration,
  removeOrderTag,
  removeTimeTag,
  setDurationTag,
  setOrderTag,
  setTimeTag,
  snapToInterval,
  sumSubtaskDurations,
  type ParsedTask,
} from "./parser";
import { layoutTimeline } from "./scheduler";
import { moveTaskBetweenDailyNotes } from "./taskMove";

export const VIEW_TYPE_MULTI_DAY_2 = "today-multi-day-2";

// 3-day window for the new TS-based view; matches the spec ("3 days at a time").
const VISIBLE_DAYS = 3;
const TIMELINE_PX_PER_MIN = 0.9;
const TIMELINE_LANE_CAP = 2;
// When the inbox renders proportional heights, anchor 1 minute to this many
// pixels. A 30-min task ~= 18px tall; long-running tasks visibly outweigh
// short ones without dominating the rail.
const INBOX_PX_PER_MIN = 0.6;
const INBOX_FLAT_HEIGHT_PX = 28;

type DragOrigin = "inbox" | "day";

interface DragState {
  task: ParsedTask;
  origin: DragOrigin;
  fromFile: TFile;
  // Cursor offset within the dragged element when the drag started, so that
  // dropping on a timeline preserves the mouse-anchor point rather than
  // snapping the block's top to the cursor.
  grabOffsetY: number;
}

export class MultiDay2View extends ItemView {
  plugin: TodayPlugin;
  private rerenderTimer: number | null = null;
  private anchor: Date = startOfDay(new Date());
  private searchQuery: string = "";
  private projectFilter: Set<string> = new Set();
  private filterAllSelected: boolean = true;
  private inboxProportionalHeights: boolean = false;
  private days: DayBundle[] = [];
  private inbox: InboxBundle = { path: "", file: null, tasks: [] };
  private dragState: DragState | null = null;
  private dropIndicator: HTMLElement | null = null;

  constructor(leaf: WorkspaceLeaf, plugin: TodayPlugin) {
    super(leaf);
    this.plugin = plugin;
  }

  getViewType(): string {
    return VIEW_TYPE_MULTI_DAY_2;
  }

  getDisplayText(): string {
    return "Multi-day 2";
  }

  getIcon(): string {
    return "calendar-days";
  }

  async onOpen(): Promise<void> {
    this.registerEvent(
      this.app.vault.on("modify", () => this.scheduleRefresh()),
    );
    this.registerEvent(
      this.app.vault.on("delete", () => this.scheduleRefresh()),
    );
    this.registerEvent(
      this.app.vault.on("create", () => this.scheduleRefresh()),
    );
    await this.refresh();
  }

  async onClose(): Promise<void> {
    if (this.rerenderTimer !== null) window.clearTimeout(this.rerenderTimer);
  }

  private scheduleRefresh(): void {
    if (this.rerenderTimer !== null) window.clearTimeout(this.rerenderTimer);
    this.rerenderTimer = window.setTimeout(() => {
      this.rerenderTimer = null;
      void this.refresh();
    }, 100);
  }

  private async refresh(): Promise<void> {
    const [d, i] = await Promise.all([
      loadDayWindow(this.app, this.plugin.settings, this.anchor, VISIBLE_DAYS),
      loadInboxTasks(this.app, this.plugin.settings),
    ]);
    this.days = d;
    this.inbox = i;
    this.render();
  }

  private render(): void {
    const root = this.containerEl.children[1] as HTMLElement;
    root.empty();
    root.addClass("today-root");
    root.addClass("dp-multiday2");

    const wrap = root.createDiv({ cls: "dp-md2-root" });

    this.renderHeader(wrap);

    const colorMap = buildWindowColorMap(
      this.days,
      this.inbox.tasks,
      this.plugin.settings.projectColors,
    );
    const summary = summarizeWindow(this.days, this.plugin.settings.projectColors);
    this.renderSummary(wrap, summary);

    const body = wrap.createDiv({ cls: "dp-md2-body" });
    this.renderInbox(body, colorMap);
    this.renderGrid(body, colorMap);
  }

  // ---------- header ----------

  private renderHeader(parent: HTMLElement): void {
    const header = parent.createDiv({ cls: "dp-md2-header" });
    const nav = header.createDiv({ cls: "dp-md2-nav" });

    const prev = nav.createEl("button", {
      cls: "dp-md2-nav-btn",
      text: "‹",
      attr: { "aria-label": "Previous days" },
    });
    prev.addEventListener("click", () => {
      this.anchor = addDays(this.anchor, -VISIBLE_DAYS);
      void this.refresh();
    });

    const today = nav.createEl("button", {
      cls: "dp-md2-today-btn",
      text: "Today",
    });
    today.addEventListener("click", () => {
      this.anchor = startOfDay(new Date());
      void this.refresh();
    });

    const next = nav.createEl("button", {
      cls: "dp-md2-nav-btn",
      text: "›",
      attr: { "aria-label": "Next days" },
    });
    next.addEventListener("click", () => {
      this.anchor = addDays(this.anchor, VISIBLE_DAYS);
      void this.refresh();
    });

    const range = header.createDiv({ cls: "dp-md2-range" });
    const last = addDays(this.anchor, VISIBLE_DAYS - 1);
    range.setText(`${this.fmtRangeDate(this.anchor)} – ${this.fmtRangeDate(last)}`);
  }

  private fmtRangeDate(d: Date): string {
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  }

  // ---------- summary ----------

  private renderSummary(parent: HTMLElement, summary: WindowSummary): void {
    const wrap = parent.createDiv({ cls: "dp-md2-summary" });
    if (summary.totalMin === 0) {
      wrap.createDiv({
        cls: "dp-md2-summary-empty",
        text: "No scheduled time in this window.",
      });
      return;
    }
    const bar = wrap.createDiv({ cls: "dp-md2-summary-bar" });
    for (const p of summary.byProject) {
      const seg = bar.createDiv({ cls: "dp-md2-summary-seg" });
      seg.style.width = `${(p.minutes / summary.totalMin) * 100}%`;
      seg.style.background = p.color;
      seg.setAttribute("title", `${p.project} · ${fmtMin(p.minutes)}`);
    }
    const legend = wrap.createDiv({ cls: "dp-md2-summary-legend" });
    legend.createSpan({
      cls: "dp-md2-summary-total",
      text: `${fmtMin(summary.totalMin)} total`,
    });
    for (const p of summary.byProject) {
      const chip = legend.createSpan({ cls: "dp-md2-summary-chip" });
      const dot = chip.createSpan({ cls: "dp-md2-summary-dot" });
      dot.style.background = p.color;
      chip.createSpan({ cls: "dp-md2-summary-name", text: p.project });
      chip.createSpan({
        cls: "dp-md2-summary-min",
        text: fmtMin(p.minutes),
      });
    }
  }

  // ---------- inbox panel (left) ----------

  private renderInbox(parent: HTMLElement, colorMap: Map<string, string>): void {
    const panel = parent.createDiv({ cls: "dp-md2-inbox" });
    const header = panel.createDiv({ cls: "dp-md2-inbox-header" });
    header.createSpan({ cls: "dp-md2-inbox-title", text: "Inbox" });
    const count = header.createSpan({ cls: "dp-md2-inbox-count" });

    // Allow dropping a scheduled block back on the inbox column to
    // unschedule it (move into the inbox file + strip its time tag).
    panel.addEventListener("dragover", (ev) => {
      if (!this.dragState || this.dragState.origin !== "day") return;
      if (!this.inbox.file) return;
      ev.preventDefault();
      if (ev.dataTransfer) ev.dataTransfer.dropEffect = "move";
      panel.addClass("is-drop-target");
    });
    panel.addEventListener("dragleave", (ev) => {
      const related = ev.relatedTarget as Node | null;
      if (!related || !panel.contains(related)) panel.removeClass("is-drop-target");
    });
    panel.addEventListener("drop", (ev) => {
      panel.removeClass("is-drop-target");
      if (!this.dragState || this.dragState.origin !== "day") return;
      if (!this.inbox.file) return;
      ev.preventDefault();
      void this.dropToInbox(this.dragState);
    });

    const controls = panel.createDiv({ cls: "dp-md2-inbox-controls" });
    const search = controls.createEl("input", {
      cls: "dp-md2-inbox-search",
      attr: { type: "text", placeholder: "Search inbox" },
    }) as HTMLInputElement;
    search.value = this.searchQuery;
    search.addEventListener("input", () => {
      this.searchQuery = search.value;
      this.renderInboxList(panel, listEl, count, colorMap);
    });

    const heightToggle = controls.createEl("button", {
      cls: "dp-md2-inbox-height-toggle",
      text: this.inboxProportionalHeights ? "Flat" : "Duration",
      attr: { "aria-label": "Toggle inbox row height" },
    });
    heightToggle.addEventListener("click", () => {
      this.inboxProportionalHeights = !this.inboxProportionalHeights;
      heightToggle.setText(
        this.inboxProportionalHeights ? "Flat" : "Duration",
      );
      this.renderInboxList(panel, listEl, count, colorMap);
    });

    // Project chip filter row. Single-click selects exactly that project; the
    // "All" chip restores the default. Chips show the project's color so the
    // selection state mirrors the timeline blocks.
    const chipRow = panel.createDiv({ cls: "dp-md2-inbox-filters" });
    const projects = uniqueProjects(this.inbox.tasks);
    const allChip = chipRow.createSpan({
      cls: "dp-md2-filter-chip" + (this.filterAllSelected ? " is-active" : ""),
      text: "All",
    });
    allChip.addEventListener("click", () => {
      this.filterAllSelected = true;
      this.projectFilter.clear();
      this.render();
    });
    for (const proj of projects) {
      const isOn = !this.filterAllSelected && this.projectFilter.has(proj);
      const chip = chipRow.createSpan({
        cls: "dp-md2-filter-chip" + (isOn ? " is-active" : ""),
        text: proj,
      });
      const color = colorMap.get(proj) ?? null;
      if (color) chip.style.borderColor = color;
      chip.addEventListener("click", () => {
        if (this.filterAllSelected) {
          this.filterAllSelected = false;
          this.projectFilter = new Set([proj]);
        } else if (this.projectFilter.has(proj)) {
          this.projectFilter.delete(proj);
          if (this.projectFilter.size === 0) this.filterAllSelected = true;
        } else {
          this.projectFilter.add(proj);
        }
        this.render();
      });
    }

    const listEl = panel.createEl("ul", { cls: "dp-md2-inbox-list" });
    this.renderInboxList(panel, listEl, count, colorMap);
  }

  private renderInboxList(
    panel: HTMLElement,
    listEl: HTMLElement,
    countEl: HTMLElement,
    colorMap: Map<string, string>,
  ): void {
    listEl.empty();
    const filtered = this.filteredInboxTasks();
    countEl.setText(String(filtered.length));
    if (!this.inbox.file) {
      listEl.createDiv({
        cls: "dp-md2-inbox-empty",
        text: "No inbox file at this path.",
      });
      return;
    }
    if (filtered.length === 0) {
      listEl.createDiv({
        cls: "dp-md2-inbox-empty",
        text: this.inbox.tasks.length === 0
          ? "Inbox is clear."
          : "No tasks match.",
      });
      return;
    }
    for (const task of filtered) {
      const li = listEl.createEl("li", { cls: "dp-md2-inbox-item" });
      li.draggable = true;
      li.style.height = this.inboxProportionalHeights
        ? `${Math.max(20, task.durationMin * INBOX_PX_PER_MIN)}px`
        : `${INBOX_FLAT_HEIGHT_PX}px`;
      const color = colorFor(task, colorMap);
      if (color) {
        li.style.setProperty("--dp-md2-color", color);
        li.addClass("has-color");
      }
      const dot = li.createSpan({ cls: "dp-md2-inbox-dot" });
      if (color) {
        dot.style.background = color;
        dot.style.borderColor = color;
      }
      const text = li.createSpan({
        cls: "dp-md2-inbox-text",
        text: bodyText(task),
      });
      // Title attribute keeps full text accessible when the row is clipped.
      li.setAttribute("title", `${bodyText(task)} · ${fmtMin(task.durationMin)}`);
      void text;

      li.addEventListener("dragstart", (ev) => {
        if (!this.inbox.file) return;
        const rect = li.getBoundingClientRect();
        this.dragState = {
          task,
          origin: "inbox",
          fromFile: this.inbox.file,
          grabOffsetY: ev.clientY - rect.top,
        };
        li.addClass("is-dragging");
        if (ev.dataTransfer) {
          ev.dataTransfer.setData("text/plain", task.rawLine);
          ev.dataTransfer.effectAllowed = "move";
        }
      });
      li.addEventListener("dragend", () => {
        li.removeClass("is-dragging");
        this.dragState = null;
        this.hideDropIndicator();
      });
      li.addEventListener("click", () => void this.openTask(task, this.inbox.file));
    }
  }

  private filteredInboxTasks(): ParsedTask[] {
    const q = this.searchQuery.trim().toLowerCase();
    return this.inbox.tasks.filter((t) => {
      if (this.filterAllSelected) {
        // pass
      } else if (!t.project || !this.projectFilter.has(t.project)) {
        return false;
      }
      if (!q) return true;
      return bodyText(t).toLowerCase().includes(q);
    });
  }

  // ---------- day grid (right) ----------

  private renderGrid(parent: HTMLElement, colorMap: Map<string, string>): void {
    const grid = parent.createDiv({ cls: "dp-md2-grid" });
    grid.style.gridTemplateColumns = `repeat(${this.days.length}, minmax(0, 1fr))`;
    for (const day of this.days) this.renderDayColumn(grid, day, colorMap);
  }

  private renderDayColumn(
    parent: HTMLElement,
    day: DayBundle,
    colorMap: Map<string, string>,
  ): void {
    const col = parent.createDiv({ cls: "dp-md2-day" });
    if (sameDay(day.date, new Date())) col.addClass("is-today");

    const header = col.createDiv({ cls: "dp-md2-day-header" });
    const link = header.createEl("button", {
      cls: "dp-md2-day-link",
      text: this.fmtDayHeader(day.date),
    });
    link.addEventListener("click", () => void this.openDay(day));
    header.createSpan({
      cls: "dp-md2-day-count",
      text: String(day.tasks.length),
    });

    this.renderTimeline(col, day, colorMap);
  }

  private fmtDayHeader(d: Date): string {
    return d.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }

  private renderTimeline(
    parent: HTMLElement,
    day: DayBundle,
    colorMap: Map<string, string>,
  ): void {
    const settings = this.plugin.settings;
    const startMin = settings.visibleStartHour * 60;
    const endMin = settings.visibleEndHour * 60;
    const totalMin = endMin - startMin;
    const heightPx = totalMin * TIMELINE_PX_PER_MIN;

    const timeline = parent.createDiv({ cls: "dp-md2-timeline" });
    timeline.style.height = `${heightPx}px`;

    for (let h = settings.visibleStartHour; h <= settings.visibleEndHour; h++) {
      const top = (h * 60 - startMin) * TIMELINE_PX_PER_MIN;
      const row = timeline.createDiv({ cls: "dp-md2-timeline-row" });
      row.style.top = `${top}px`;
      row.createDiv({ cls: "dp-md2-timeline-line" });
      row.createDiv({
        cls: "dp-md2-timeline-label",
        text: formatClockShort(h * 60),
      });
    }

    const blocksLayer = timeline.createDiv({ cls: "dp-md2-timeline-blocks" });
    const scheduled = day.tasks.filter((t) => t.startMin !== null);
    const layout = layoutTimeline(
      scheduled,
      startMin,
      TIMELINE_PX_PER_MIN,
      TIMELINE_LANE_CAP,
    );
    for (const b of layout) {
      const el = blocksLayer.createEl("button", {
        cls: "dp-md2-timeline-block",
      });
      if (b.task.checked) el.addClass("is-done");
      el.style.top = `${b.topPx}px`;
      el.style.height = `${Math.max(8, b.heightPx)}px`;
      el.style.left = `${b.leftPct}%`;
      el.style.width = `calc(${b.widthPct}% - 2px)`;
      const color = colorFor(b.task, colorMap);
      el.style.setProperty("--dp-md2-color", color ?? "var(--color-accent)");
      el.setAttribute("title", bodyText(b.task));
      el.createSpan({
        cls: "dp-md2-timeline-block-text",
        text: bodyText(b.task),
      });
      el.addEventListener("click", () => void this.openTask(b.task, day.file));

      // Re-drag scheduled blocks: dragging from the timeline lets the user
      // reschedule (drop on another column) or unschedule (drop on inbox).
      el.draggable = true;
      el.addEventListener("dragstart", (ev) => {
        if (!day.file) return;
        const rect = el.getBoundingClientRect();
        this.dragState = {
          task: b.task,
          origin: "day",
          fromFile: day.file,
          grabOffsetY: ev.clientY - rect.top,
        };
        el.addClass("is-dragging");
        if (ev.dataTransfer) {
          ev.dataTransfer.setData("text/plain", b.task.rawLine);
          ev.dataTransfer.effectAllowed = "move";
        }
      });
      el.addEventListener("dragend", () => {
        el.removeClass("is-dragging");
        this.dragState = null;
        this.hideDropIndicator();
      });
    }

    // Drop handling: snap to settings.snapMin, show a preview indicator, and
    // on drop write time + (optionally) move the task between daily notes.
    const computeSnap = (clientY: number): number | null => {
      if (!this.dragState) return null;
      const rect = timeline.getBoundingClientRect();
      const yPx = clientY - rect.top + timeline.scrollTop - this.dragState.grabOffsetY;
      const rawMin = yPx / TIMELINE_PX_PER_MIN + startMin;
      const snapped = snapToInterval(rawMin, settings.snapMin);
      const maxStart = endMin - this.dragState.task.durationMin;
      return Math.max(startMin, Math.min(maxStart, snapped));
    };

    timeline.addEventListener("dragover", (ev) => {
      if (!this.dragState) return;
      ev.preventDefault();
      if (ev.dataTransfer) ev.dataTransfer.dropEffect = "move";
      const snapped = computeSnap(ev.clientY);
      if (snapped === null) return;
      this.showDropIndicator(
        blocksLayer,
        snapped,
        this.dragState.task.durationMin,
        startMin,
      );
    });
    timeline.addEventListener("dragleave", (ev) => {
      const related = ev.relatedTarget as Node | null;
      if (!related || !timeline.contains(related)) this.hideDropIndicator();
    });
    timeline.addEventListener("drop", (ev) => {
      if (!this.dragState) return;
      ev.preventDefault();
      const snapped = computeSnap(ev.clientY);
      this.hideDropIndicator();
      if (snapped === null) return;
      void this.dropToDay(this.dragState, day, snapped);
    });
  }

  // ---------- drop indicator ----------

  private showDropIndicator(
    layer: HTMLElement,
    snappedStartMin: number,
    durationMin: number,
    rangeStartMin: number,
  ): void {
    if (!this.dropIndicator || this.dropIndicator.parentElement !== layer) {
      this.dropIndicator?.detach();
      this.dropIndicator = layer.createDiv({ cls: "dp-md2-drop-indicator" });
    }
    const ind = this.dropIndicator;
    ind.empty();
    ind.style.top = `${(snappedStartMin - rangeStartMin) * TIMELINE_PX_PER_MIN}px`;
    ind.style.height = `${Math.max(18, durationMin * TIMELINE_PX_PER_MIN)}px`;
    ind.createDiv({
      cls: "dp-md2-drop-indicator-time",
      text: `${formatClockShort(snappedStartMin)}–${formatClockShort(
        snappedStartMin + durationMin,
      )}`,
    });
  }

  private hideDropIndicator(): void {
    this.dropIndicator?.detach();
    this.dropIndicator = null;
  }

  // ---------- drop handlers ----------

  private async dropToDay(
    drag: DragState,
    day: DayBundle,
    newStartMin: number,
  ): Promise<void> {
    const settings = this.plugin.settings;
    const prefixes = settings.prefixes;
    const fallback = buildFallback(settings);

    // Adopt subtask-sum duration when a parent without #d/ is being scheduled
    // for the first time — mirrors the same-day timeline drop in TodayView so
    // calendar blocks reflect what the user planned.
    const subtaskSum =
      drag.origin === "inbox" && !drag.task.hasExplicitDuration
        ? sumSubtaskDurations(
            drag.task.subtasks.map((s) => s.rawLine),
            prefixes,
          )
        : 0;

    const inSameFile =
      day.file !== null && drag.fromFile.path === day.file.path;

    if (inSameFile && day.file) {
      // Reschedule within the same daily note: rewrite the time tag in place.
      await this.app.vault.process(day.file, (content) => {
        const lines = content.split("\n");
        const idx = drag.task.lineNumber;
        if (idx < 0 || idx >= lines.length || lines[idx] !== drag.task.rawLine)
          return content;
        let next = setTimeTag(lines[idx], newStartMin, prefixes);
        next = removeOrderTag(next, prefixes);
        if (subtaskSum > 0 && parseDuration(next, prefixes) === null) {
          next = setDurationTag(next, subtaskSum, prefixes);
        }
        if (next === lines[idx]) return content;
        lines[idx] = next;
        return lines.join("\n");
      });
      await this.refresh();
      return;
    }

    // Cross-file move: write the time tag onto the line first, then let
    // moveTaskBetweenDailyNotes handle the file split.
    await this.app.vault.process(drag.fromFile, (content) => {
      const lines = content.split("\n");
      const idx = drag.task.lineNumber;
      if (idx < 0 || idx >= lines.length || lines[idx] !== drag.task.rawLine)
        return content;
      let next = setTimeTag(lines[idx], newStartMin, prefixes);
      next = removeOrderTag(next, prefixes);
      if (subtaskSum > 0 && parseDuration(next, prefixes) === null) {
        next = setDurationTag(next, subtaskSum, prefixes);
      }
      if (next === lines[idx]) return content;
      lines[idx] = next;
      return lines.join("\n");
    });

    // Re-parse from the source file so moveTaskBetweenDailyNotes sees the
    // updated rawLine and the move splices the right lineNumbers across.
    const updatedTask = await this.refetchTask(drag.fromFile, drag.task);
    if (!updatedTask) {
      new Notice("Today: source line changed since drag started.");
      await this.refresh();
      return;
    }
    await moveTaskBetweenDailyNotes(
      this.app,
      drag.fromFile,
      updatedTask,
      day.date,
      fallback,
      { notify: false },
    );
    await this.refresh();
  }

  private async dropToInbox(drag: DragState): Promise<void> {
    if (!this.inbox.file) return;
    if (drag.fromFile.path === this.inbox.file.path) {
      // No-op: dropping inbox→inbox isn't meaningful.
      return;
    }
    const prefixes = this.plugin.settings.prefixes;
    // Strip the time tag from the source line so the moved task lands as
    // unscheduled, then move into the inbox file.
    await this.app.vault.process(drag.fromFile, (content) => {
      const lines = content.split("\n");
      const idx = drag.task.lineNumber;
      if (idx < 0 || idx >= lines.length || lines[idx] !== drag.task.rawLine)
        return content;
      let next = removeTimeTag(lines[idx], prefixes);
      // Append to existing inbox order: bump after the current max so the
      // task lands at the bottom rather than colliding with an existing #o/.
      const maxOrder = this.inbox.tasks.reduce(
        (acc, t) => (t.order !== null && t.order > acc ? t.order : acc),
        0,
      );
      next = setOrderTag(next, maxOrder + 1, prefixes);
      if (next === lines[idx]) return content;
      lines[idx] = next;
      return lines.join("\n");
    });

    const updatedTask = await this.refetchTask(drag.fromFile, drag.task);
    if (!updatedTask) {
      await this.refresh();
      return;
    }
    await moveTaskBetweenDailyNotes(
      this.app,
      drag.fromFile,
      updatedTask,
      new Date(), // unused — targetFile bypasses date resolution
      buildFallback(this.plugin.settings),
      { targetFile: this.inbox.file, notify: false },
    );
    await this.refresh();
  }

  private async refetchTask(
    file: TFile,
    original: ParsedTask,
  ): Promise<ParsedTask | null> {
    // Re-read the file and locate the task by its body snapshot. The line
    // number is unreliable across edits (we just rewrote a tag), so we match
    // on the original cleaned body to avoid acting on a stale rawLine.
    const { parseFileTasks } = await import("./parser");
    const content = await this.app.vault.read(file);
    const tasks = parseFileTasks(
      file.path,
      content,
      this.plugin.settings.prefixes,
      this.plugin.settings.defaultDurationMin,
    );
    // Try same line first, then fall back to body text.
    const sameLine = tasks.find((t) => t.lineNumber === original.lineNumber);
    if (sameLine && bodyText(sameLine) === bodyText(original)) return sameLine;
    return tasks.find((t) => bodyText(t) === bodyText(original)) ?? null;
  }

  // ---------- task / day open ----------

  private async openTask(task: ParsedTask, file: TFile | null): Promise<void> {
    if (!file) return;
    const leaf = this.app.workspace.getLeaf(false);
    await leaf.openFile(file, { eState: { line: task.lineNumber } });
  }

  private async openDay(day: DayBundle): Promise<void> {
    if (day.file) {
      const leaf = this.app.workspace.getLeaf(false);
      await leaf.openFile(day.file);
    } else {
      await this.app.workspace.openLinkText(day.path, "");
    }
  }
}

// ---------- helpers ----------

function bodyText(task: ParsedTask): string {
  return task.body.replace(/#\S+/g, "").trim() || task.body.trim();
}

function fmtMin(min: number): string {
  if (min <= 0) return "0m";
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

function uniqueProjects(tasks: ParsedTask[]): string[] {
  const set = new Set<string>();
  for (const t of tasks) if (t.project) set.add(t.project);
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}
