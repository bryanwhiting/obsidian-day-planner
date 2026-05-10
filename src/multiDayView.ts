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
import { contrastingTextColor } from "./colors";
import { layoutTimeline } from "./scheduler";
import { moveTaskBetweenDailyNotes } from "./taskMove";
import { TodayView, VIEW_TYPE_TODAY } from "./view";

export const VIEW_TYPE_MULTI_DAY = "today-multi-day";

// 3-day window — matches the spec ("3 days at a time").
const VISIBLE_DAYS = 3;
const TIMELINE_PX_PER_MIN = 0.9;
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

export class MultiDayView extends ItemView {
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
    return VIEW_TYPE_MULTI_DAY;
  }

  getDisplayText(): string {
    return "Multi-day";
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
    root.addClass("dp-multiday");

    const wrap = root.createDiv({ cls: "dp-md-root" });

    this.renderHeader(wrap);

    const colorMap = buildWindowColorMap(
      this.days,
      this.inbox.tasks,
      this.plugin.settings.projectColors,
    );
    const summary = summarizeWindow(this.days, this.plugin.settings.projectColors);
    this.renderSummary(wrap, summary);

    const body = wrap.createDiv({ cls: "dp-md-body" });
    this.renderInbox(body, colorMap);
    this.renderGrid(body, colorMap);
  }

  // ---------- header ----------

  private renderHeader(parent: HTMLElement): void {
    const header = parent.createDiv({ cls: "dp-md-header" });
    const nav = header.createDiv({ cls: "dp-md-nav" });

    const prev = nav.createEl("button", {
      cls: "dp-md-nav-btn",
      text: "‹",
      attr: { "aria-label": "Previous days" },
    });
    prev.addEventListener("click", () => {
      this.anchor = addDays(this.anchor, -VISIBLE_DAYS);
      void this.refresh();
    });

    const today = nav.createEl("button", {
      cls: "dp-md-today-btn",
      text: "Today",
    });
    today.addEventListener("click", () => {
      this.anchor = startOfDay(new Date());
      void this.refresh();
    });

    const next = nav.createEl("button", {
      cls: "dp-md-nav-btn",
      text: "›",
      attr: { "aria-label": "Next days" },
    });
    next.addEventListener("click", () => {
      this.anchor = addDays(this.anchor, VISIBLE_DAYS);
      void this.refresh();
    });

    const range = header.createDiv({ cls: "dp-md-range" });
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
    const wrap = parent.createDiv({ cls: "dp-md-summary" });
    if (summary.totalMin === 0) {
      wrap.createDiv({
        cls: "dp-md-summary-empty",
        text: "No scheduled time in this window.",
      });
      return;
    }
    const bar = wrap.createDiv({ cls: "dp-md-summary-bar" });
    for (const p of summary.byProject) {
      const seg = bar.createDiv({ cls: "dp-md-summary-seg" });
      seg.style.width = `${(p.minutes / summary.totalMin) * 100}%`;
      seg.style.background = p.color;
      seg.setAttribute("title", `${p.project} · ${fmtMin(p.minutes)}`);
    }
    const legend = wrap.createDiv({ cls: "dp-md-summary-legend" });
    legend.createSpan({
      cls: "dp-md-summary-total",
      text: `${fmtMin(summary.totalMin)} total`,
    });
    for (const p of summary.byProject) {
      const chip = legend.createSpan({ cls: "dp-md-summary-chip" });
      const dot = chip.createSpan({ cls: "dp-md-summary-dot" });
      dot.style.background = p.color;
      chip.createSpan({ cls: "dp-md-summary-name", text: p.project });
      chip.createSpan({
        cls: "dp-md-summary-min",
        text: fmtMin(p.minutes),
      });
    }
  }

  // ---------- inbox panel (left) ----------

  private renderInbox(parent: HTMLElement, colorMap: Map<string, string>): void {
    const panel = parent.createDiv({ cls: "dp-md-inbox" });
    const header = panel.createDiv({ cls: "dp-md-inbox-header" });
    header.createSpan({ cls: "dp-md-inbox-title", text: "Inbox" });
    const count = header.createSpan({ cls: "dp-md-inbox-count" });

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

    const controls = panel.createDiv({ cls: "dp-md-inbox-controls" });
    const search = controls.createEl("input", {
      cls: "dp-md-inbox-search",
      attr: { type: "text", placeholder: "Search inbox" },
    }) as HTMLInputElement;
    search.value = this.searchQuery;
    search.addEventListener("input", () => {
      this.searchQuery = search.value;
      this.renderInboxList(panel, listEl, count, colorMap);
    });

    const heightToggle = controls.createEl("button", {
      cls: "dp-md-inbox-height-toggle",
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
    const chipRow = panel.createDiv({ cls: "dp-md-inbox-filters" });
    const projects = uniqueProjects(this.inbox.tasks);
    const allChip = chipRow.createSpan({
      cls: "dp-md-filter-chip" + (this.filterAllSelected ? " is-active" : ""),
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
        cls: "dp-md-filter-chip" + (isOn ? " is-active" : ""),
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

    const listEl = panel.createEl("ul", { cls: "dp-md-inbox-list" });
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
        cls: "dp-md-inbox-empty",
        text: "No inbox file at this path.",
      });
      return;
    }
    if (filtered.length === 0) {
      listEl.createDiv({
        cls: "dp-md-inbox-empty",
        text: this.inbox.tasks.length === 0
          ? "Inbox is clear."
          : "No tasks match.",
      });
      return;
    }
    for (const task of filtered) {
      const li = listEl.createEl("li", { cls: "dp-md-inbox-item" });
      li.draggable = true;
      li.style.height = this.inboxProportionalHeights
        ? `${Math.max(20, task.durationMin * INBOX_PX_PER_MIN)}px`
        : `${INBOX_FLAT_HEIGHT_PX}px`;
      const color = colorFor(task, colorMap);
      if (color) {
        li.style.setProperty("--dp-color", color);
        li.addClass("has-color");
      }
      const dot = li.createSpan({ cls: "dp-md-inbox-dot" });
      if (color) {
        dot.style.background = color;
        dot.style.borderColor = color;
      }
      const text = li.createSpan({
        cls: "dp-md-inbox-text",
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
      // Inbox tasks aren't tied to a specific day; the modal anchors its
      // move-picker to today, since that's the most likely target.
      li.addEventListener("click", () => {
        void this.openEditor(this.inbox.file, task, new Date());
      });
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
    const grid = parent.createDiv({ cls: "dp-md-grid" });
    grid.style.gridTemplateColumns = `repeat(${this.days.length}, minmax(0, 1fr))`;
    for (const day of this.days) this.renderDayColumn(grid, day, colorMap);
  }

  private renderDayColumn(
    parent: HTMLElement,
    day: DayBundle,
    colorMap: Map<string, string>,
  ): void {
    const col = parent.createDiv({ cls: "dp-md-day" });
    if (sameDay(day.date, new Date())) col.addClass("is-today");

    const header = col.createDiv({ cls: "dp-md-day-header" });
    const link = header.createEl("button", {
      cls: "dp-md-day-link",
      text: this.fmtDayHeader(day.date),
    });
    link.addEventListener("click", () => void this.openDay(day));
    header.createSpan({
      cls: "dp-md-day-count",
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

    const timeline = parent.createDiv({ cls: "dp-md-timeline" });
    timeline.style.height = `${heightPx}px`;

    // Left gutter holds the hour labels so blocks don't overlap them. The
    // blocks layer sits to the right of this gutter, mirroring how the
    // daily-view timeline lays out its hour labels + block lanes.
    const gutter = timeline.createDiv({ cls: "dp-md-timeline-gutter" });
    for (let h = settings.visibleStartHour; h <= settings.visibleEndHour; h++) {
      const top = (h * 60 - startMin) * TIMELINE_PX_PER_MIN;
      const lbl = gutter.createDiv({
        cls: "dp-md-timeline-label",
        text: formatClockShort(h * 60),
      });
      lbl.style.top = `${top}px`;
    }

    const lanes = timeline.createDiv({ cls: "dp-md-timeline-lanes" });
    for (let h = settings.visibleStartHour; h <= settings.visibleEndHour; h++) {
      const top = (h * 60 - startMin) * TIMELINE_PX_PER_MIN;
      const line = lanes.createDiv({ cls: "dp-md-timeline-line" });
      line.style.top = `${top}px`;
    }

    const blocksLayer = lanes.createDiv({ cls: "dp-md-timeline-blocks" });
    const scheduled = day.tasks.filter((t) => t.startMin !== null);
    // No lane cap — every overlapping cluster splits the day column N-ways
    // so two simultaneous tasks never visually stack on top of each other.
    // Trade-off: a 4-way overlap in 7-day mode shrinks each block to ~25% of
    // a narrow column, but the user has explicitly preferred no-overlap over
    // wider-but-stacked.
    const layout = layoutTimeline(scheduled, startMin, TIMELINE_PX_PER_MIN);
    for (const b of layout) {
      this.renderBlock(blocksLayer, day, b, colorMap);
    }

    // Drop handling: snap to settings.snapMin, show a preview indicator, and
    // on drop write time + (optionally) move the task between daily notes.
    const computeSnap = (clientY: number): number | null => {
      if (!this.dragState) return null;
      const rect = lanes.getBoundingClientRect();
      const yPx = clientY - rect.top + timeline.scrollTop - this.dragState.grabOffsetY;
      const rawMin = yPx / TIMELINE_PX_PER_MIN + startMin;
      const snapped = snapToInterval(rawMin, settings.snapMin);
      const maxStart = endMin - this.dragState.task.durationMin;
      return Math.max(startMin, Math.min(maxStart, snapped));
    };

    lanes.addEventListener("dragover", (ev) => {
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
    lanes.addEventListener("dragleave", (ev) => {
      const related = ev.relatedTarget as Node | null;
      if (!related || !lanes.contains(related)) this.hideDropIndicator();
    });
    lanes.addEventListener("drop", (ev) => {
      if (!this.dragState) return;
      ev.preventDefault();
      const snapped = computeSnap(ev.clientY);
      this.hideDropIndicator();
      if (snapped === null) return;
      void this.dropToDay(this.dragState, day, snapped);
    });
  }

  // Render a single timeline block using the daily-view's `dp-block` DOM and
  // class names so multi-day blocks inherit the same color, padding, and
  // resize-handle styling. A `.dp-block-md` modifier opts in to the narrower
  // typography this view needs.
  private renderBlock(
    layer: HTMLElement,
    day: DayBundle,
    block: { task: ParsedTask; topPx: number; heightPx: number; leftPct: number; widthPct: number },
    colorMap: Map<string, string>,
  ): void {
    const el = layer.createDiv({ cls: "dp-block dp-block-md" });
    if (block.task.checked) el.addClass("is-done");
    if (!block.task.hasExplicitDuration) el.addClass("is-implicit-duration");
    if (block.task.durationMin <= 20) el.addClass("is-compact");
    if (block.widthPct < 99.5) el.addClass("is-narrow");

    el.style.top = `${block.topPx}px`;
    el.style.height = `${Math.max(18, block.heightPx)}px`;
    el.style.left = `${block.leftPct}%`;
    el.style.width = `calc(${block.widthPct}% - 2px)`;

    const color = colorFor(block.task, colorMap);
    if (color) {
      el.style.setProperty("--dp-color", color);
      el.style.setProperty("--dp-on-color", contrastingTextColor(color));
      el.addClass("has-project-color");
    }

    const row = el.createDiv({ cls: "dp-block-row" });
    if (block.task.startMin !== null) {
      const meta = row.createSpan({ cls: "dp-block-meta" });
      meta.createSpan({
        cls: "dp-block-time",
        text: formatClockShort(block.task.startMin),
      });
    }
    row.createSpan({
      cls: "dp-block-text",
      text: bodyText(block.task),
    });

    el.setAttribute("title", bodyText(block.task));

    el.addEventListener("click", () => {
      void this.openEditor(day.file, block.task, day.date);
    });

    el.draggable = true;
    el.addEventListener("dragstart", (ev) => {
      if (!day.file) return;
      const rect = el.getBoundingClientRect();
      this.dragState = {
        task: block.task,
        origin: "day",
        fromFile: day.file,
        grabOffsetY: ev.clientY - rect.top,
      };
      el.addClass("is-dragging");
      if (ev.dataTransfer) {
        ev.dataTransfer.setData("text/plain", block.task.rawLine);
        ev.dataTransfer.effectAllowed = "move";
      }
    });
    el.addEventListener("dragend", () => {
      el.removeClass("is-dragging");
      this.dragState = null;
      this.hideDropIndicator();
    });

    // Resize handles — bottom adjusts duration only, top adjusts both start
    // and duration (anchored end). Mirrors the daily-view block.
    if (day.file) {
      const file = day.file;
      const bottom = el.createDiv({ cls: "dp-resize-handle" });
      bottom.addEventListener("pointerdown", (ev) =>
        this.beginResize(ev, el, file, block.task),
      );
      if (block.task.startMin !== null) {
        const top = el.createDiv({
          cls: "dp-resize-handle dp-resize-handle-top",
        });
        top.addEventListener("pointerdown", (ev) =>
          this.beginResizeTop(ev, el, file, block.task),
        );
      }
    }
  }

  // Bottom-edge drag → adjust duration. Snaps to settings.snapMin; on
  // pointerup writes a new `#d/<…>` tag onto the line. Duplicates the
  // daily-view behavior so the multi-day timeline feels the same.
  private beginResize(
    ev: PointerEvent,
    blockEl: HTMLElement,
    file: TFile,
    task: ParsedTask,
  ): void {
    ev.preventDefault();
    ev.stopPropagation();
    const handle = ev.currentTarget as HTMLElement;
    const settings = this.plugin.settings;
    const startY = ev.clientY;
    const startHeightPx = blockEl.offsetHeight;
    const minDuration = settings.snapMin;
    const pxPerMin = TIMELINE_PX_PER_MIN;
    let pendingDuration = task.durationMin;

    blockEl.draggable = false;
    blockEl.addClass("is-resizing");
    handle.setPointerCapture(ev.pointerId);

    const onMove = (e: PointerEvent) => {
      const dy = e.clientY - startY;
      const newHeightPx = Math.max(minDuration * pxPerMin, startHeightPx + dy);
      const rawMin = newHeightPx / pxPerMin;
      pendingDuration = Math.max(
        minDuration,
        snapToInterval(rawMin, settings.snapMin),
      );
      blockEl.style.height = `${pendingDuration * pxPerMin}px`;
    };

    const onUp = (e: PointerEvent) => {
      handle.removeEventListener("pointermove", onMove);
      handle.removeEventListener("pointerup", onUp);
      handle.removeEventListener("pointercancel", onUp);
      blockEl.removeClass("is-resizing");
      try {
        handle.releasePointerCapture(e.pointerId);
      } catch {}
      // Swallow the click that fires after pointerup so it doesn't bubble to
      // the block and open the edit modal.
      const suppressClick = (clickEv: MouseEvent) => clickEv.stopPropagation();
      blockEl.addEventListener("click", suppressClick, { capture: true });
      window.setTimeout(
        () => blockEl.removeEventListener("click", suppressClick, true),
        0,
      );
      const finalDuration = pendingDuration;
      if (finalDuration === task.durationMin) {
        blockEl.draggable = true;
        return;
      }
      void this.applyDurationChange(file, task, finalDuration).finally(() => {
        blockEl.draggable = true;
      });
    };

    handle.addEventListener("pointermove", onMove);
    handle.addEventListener("pointerup", onUp);
    handle.addEventListener("pointercancel", onUp);
  }

  // Top-edge drag → move the start time, anchoring the end so the duration
  // shrinks/grows by the inverse of the start delta.
  private beginResizeTop(
    ev: PointerEvent,
    blockEl: HTMLElement,
    file: TFile,
    task: ParsedTask,
  ): void {
    if (task.startMin === null) return;
    ev.preventDefault();
    ev.stopPropagation();
    const handle = ev.currentTarget as HTMLElement;
    const settings = this.plugin.settings;
    const startY = ev.clientY;
    const startTopPx = blockEl.offsetTop;
    const startHeightPx = blockEl.offsetHeight;
    const startStartMin = task.startMin;
    const startDurationMin = task.durationMin;
    const minDuration = settings.snapMin;
    const pxPerMin = TIMELINE_PX_PER_MIN;
    let pendingStart = startStartMin;
    let pendingDuration = startDurationMin;

    blockEl.draggable = false;
    blockEl.addClass("is-resizing");
    handle.setPointerCapture(ev.pointerId);

    const onMove = (e: PointerEvent) => {
      const dy = e.clientY - startY;
      const rawNewStart = startStartMin + dy / pxPerMin;
      let snappedStart = snapToInterval(rawNewStart, settings.snapMin);
      const maxStart = startStartMin + startDurationMin - minDuration;
      if (snappedStart > maxStart) snappedStart = maxStart;
      if (snappedStart < 0) snappedStart = 0;
      pendingStart = snappedStart;
      pendingDuration = startDurationMin - (snappedStart - startStartMin);
      const deltaPx = (snappedStart - startStartMin) * pxPerMin;
      blockEl.style.top = `${startTopPx + deltaPx}px`;
      blockEl.style.height = `${startHeightPx - deltaPx}px`;
    };

    const onUp = (e: PointerEvent) => {
      handle.removeEventListener("pointermove", onMove);
      handle.removeEventListener("pointerup", onUp);
      handle.removeEventListener("pointercancel", onUp);
      blockEl.removeClass("is-resizing");
      try {
        handle.releasePointerCapture(e.pointerId);
      } catch {}
      const suppressClick = (clickEv: MouseEvent) => clickEv.stopPropagation();
      blockEl.addEventListener("click", suppressClick, { capture: true });
      window.setTimeout(
        () => blockEl.removeEventListener("click", suppressClick, true),
        0,
      );
      if (
        pendingStart === startStartMin &&
        pendingDuration === startDurationMin
      ) {
        blockEl.draggable = true;
        return;
      }
      void this.applyStartAndDurationChange(
        file,
        task,
        pendingStart,
        pendingDuration,
      ).finally(() => {
        blockEl.draggable = true;
      });
    };

    handle.addEventListener("pointermove", onMove);
    handle.addEventListener("pointerup", onUp);
    handle.addEventListener("pointercancel", onUp);
  }

  private async applyDurationChange(
    file: TFile,
    task: ParsedTask,
    newDurationMin: number,
  ): Promise<void> {
    const prefixes = this.plugin.settings.prefixes;
    await this.app.vault.process(file, (content) => {
      const lines = content.split("\n");
      const idx = task.lineNumber;
      if (idx < 0 || idx >= lines.length || lines[idx] !== task.rawLine)
        return content;
      const next = setDurationTag(lines[idx], newDurationMin, prefixes);
      if (next === lines[idx]) return content;
      lines[idx] = next;
      return lines.join("\n");
    });
    await this.refresh();
  }

  private async applyStartAndDurationChange(
    file: TFile,
    task: ParsedTask,
    newStartMin: number,
    newDurationMin: number,
  ): Promise<void> {
    const prefixes = this.plugin.settings.prefixes;
    await this.app.vault.process(file, (content) => {
      const lines = content.split("\n");
      const idx = task.lineNumber;
      if (idx < 0 || idx >= lines.length || lines[idx] !== task.rawLine)
        return content;
      let next = setTimeTag(lines[idx], newStartMin, prefixes);
      next = setDurationTag(next, newDurationMin, prefixes);
      if (next === lines[idx]) return content;
      lines[idx] = next;
      return lines.join("\n");
    });
    await this.refresh();
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
      this.dropIndicator = layer.createDiv({ cls: "dp-md-drop-indicator" });
    }
    const ind = this.dropIndicator;
    ind.empty();
    ind.style.top = `${(snappedStartMin - rangeStartMin) * TIMELINE_PX_PER_MIN}px`;
    ind.style.height = `${Math.max(18, durationMin * TIMELINE_PX_PER_MIN)}px`;
    ind.createDiv({
      cls: "dp-md-drop-indicator-time",
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

  // Click → edit modal. We delegate to an existing TodayView instance so we
  // can reuse its TaskEditModal + the entire callback graph (apply edits,
  // toggle subtasks, move-to-date, etc.) without re-implementing any of it.
  // No TodayView open? Open the file at the line as a graceful fallback.
  private async openEditor(
    file: TFile | null,
    task: ParsedTask,
    date: Date,
  ): Promise<void> {
    if (!file) return;
    const leaf = this.app.workspace.getLeavesOfType(VIEW_TYPE_TODAY)[0];
    const view = leaf?.view;
    if (view instanceof TodayView) {
      view.openTaskEditorForDay(file, task, date);
      return;
    }
    const fallbackLeaf = this.app.workspace.getLeaf(false);
    await fallbackLeaf.openFile(file, { eState: { line: task.lineNumber } });
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
