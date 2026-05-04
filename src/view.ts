import {
  ItemView,
  WorkspaceLeaf,
  TFile,
  Notice,
  Modal,
  App,
  setIcon,
} from "obsidian";
import type DailyNotesPlannerPlugin from "./main";
import {
  ParsedTask,
  parseFileTasks,
  setTimeTag,
  removeTimeTag,
  setOrderTag,
  removeOrderTag,
  setDurationTag,
  snapToInterval,
  formatTotal,
  findLastTaskLine,
  buildTaskLine,
} from "./parser";
import {
  partition,
  computeTotals,
  computeFreeMin,
  layoutTimeline,
  LayoutBlock,
} from "./scheduler";
import { resolveProjectColors, contrastingTextColor } from "./colors";
import {
  resolveDailyNote,
  ensureDailyNote,
  addDays,
  addMonths,
  startOfMonth,
  endOfMonth,
  sameDay,
  startOfDay,
} from "./dailyNote";

export const VIEW_TYPE_DAILY_NOTES_PLANNER = "daily-notes-planner-view";

interface DragPayload {
  filePath: string;
  lineNumber: number;
  rawLine: string;
  source: "timeline" | "unscheduled";
  grabOffsetY: number;
  durationMin: number;
  bodyText: string;
}

const TRANSPARENT_PIXEL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkAAIAAAoAAv/lxKUAAAAASUVORK5CYII=";

export class DailyNotesPlannerView extends ItemView {
  plugin: DailyNotesPlannerPlugin;
  private rerenderTimer: number | null = null;
  private dragPayload: DragPayload | null = null;
  private dropIndicator: HTMLElement | null = null;
  private selectedDate: Date = startOfDay(new Date());
  private calendarMonth: Date = startOfMonth(new Date());
  private calendarOpen: boolean = false;
  private overrideFilePath: string | null = null;

  constructor(leaf: WorkspaceLeaf, plugin: DailyNotesPlannerPlugin) {
    super(leaf);
    this.plugin = plugin;
  }

  getViewType(): string {
    return VIEW_TYPE_DAILY_NOTES_PLANNER;
  }

  getDisplayText(): string {
    return "Daily Notes Planner";
  }

  getIcon(): string {
    return "calendar-clock";
  }

  async onOpen(): Promise<void> {
    this.registerEvent(
      this.app.metadataCache.on("changed", (file) => {
        if (file instanceof TFile) this.scheduleRender();
      }),
    );
    this.registerEvent(
      this.app.workspace.on("active-leaf-change", () => this.scheduleRender()),
    );
    this.registerEvent(
      this.app.vault.on("modify", () => this.scheduleRender()),
    );
    this.registerDomEvent(this.containerEl, "keydown", (ev) =>
      this.handleKeydown(ev),
    );
    await this.render();
  }

  private handleKeydown(ev: KeyboardEvent): void {
    if (ev.metaKey || ev.ctrlKey || ev.altKey) return;
    if (ev.key !== "ArrowLeft" && ev.key !== "ArrowRight") return;
    const t = ev.target as HTMLElement | null;
    if (
      t &&
      (t.tagName === "INPUT" ||
        t.tagName === "TEXTAREA" ||
        t.isContentEditable)
    )
      return;
    ev.preventDefault();
    const delta = ev.key === "ArrowLeft" ? -1 : 1;
    void this.navigateTo(addDays(this.selectedDate, delta));
  }

  async onClose(): Promise<void> {
    if (this.rerenderTimer !== null) window.clearTimeout(this.rerenderTimer);
  }

  scheduleRender(): void {
    if (this.rerenderTimer !== null) window.clearTimeout(this.rerenderTimer);
    this.rerenderTimer = window.setTimeout(() => {
      this.rerenderTimer = null;
      void this.render();
    }, 100);
  }

  openCalendar(): void {
    this.calendarOpen = true;
    this.scheduleRender();
  }

  async render(): Promise<void> {
    const root = this.containerEl.children[1] as HTMLElement;
    const prevRootScroll = root.scrollTop;
    const prevTimelineScrolls = Array.from(
      root.querySelectorAll<HTMLElement>(".dp-timeline-wrap"),
    ).map((el) => el.scrollTop);
    root.empty();
    root.addClass("daily-notes-planner-root");
    // Make the pane focusable so left/right arrow keys can be captured.
    // tabindex=-1 keeps it out of normal Tab order but accepts focus on click.
    if (!root.hasAttribute("tabindex")) root.setAttribute("tabindex", "-1");

    const fallback = {
      folder: this.plugin.settings.dailyNoteFolderFallback,
      format: this.plugin.settings.dailyNoteFormatFallback,
      template: this.plugin.settings.dailyNoteTemplate,
    };

    const dailyResolved = await resolveDailyNote(
      this.app,
      this.selectedDate,
      fallback,
    );

    let displayFile: TFile | null = dailyResolved.file;
    let displayPath: string = dailyResolved.path;

    if (this.overrideFilePath) {
      const f = this.app.vault.getAbstractFileByPath(this.overrideFilePath);
      if (f instanceof TFile) {
        displayFile = f;
        displayPath = f.path;
      } else {
        this.overrideFilePath = null;
      }
    }

    const tasks = await this.readTasks(displayFile);

    const activeFile = this.app.workspace.getActiveFile();
    const showOpenActiveLink =
      activeFile !== null &&
      (!displayFile || activeFile.path !== displayFile.path);

    this.renderDateNav(root);

    const projects = tasks
      .map((t) => t.project)
      .filter((p): p is string => p !== null);
    const colorMap = resolveProjectColors(
      projects,
      this.plugin.settings.projectColors,
    );

    this.renderSection(
      root,
      this.formatDateLabel(this.selectedDate),
      displayPath,
      displayFile,
      displayPath,
      tasks,
      true,
      colorMap,
      showOpenActiveLink ? activeFile : null,
    );

    root.scrollTop = prevRootScroll;
    const newTimelines = root.querySelectorAll<HTMLElement>(".dp-timeline-wrap");
    newTimelines.forEach((el, i) => {
      const prev = prevTimelineScrolls[i];
      if (prev !== undefined) el.scrollTop = prev;
    });
  }

  private renderDateNav(parent: HTMLElement): void {
    const nav = parent.createDiv({ cls: "dp-datenav" });

    const prev = nav.createEl("button", {
      cls: "dp-nav-btn dp-nav-arrow",
      attr: { "aria-label": "Previous day" },
    });
    setIcon(prev, "chevron-left");

    const today = nav.createEl("button", {
      cls: "dp-today-btn",
      attr: { "aria-label": "Jump to today" },
    });
    setIcon(today, "sun");

    const label = nav.createDiv({ cls: "dp-datenav-label" });
    label.textContent = this.formatDateLabel(this.selectedDate);

    const calBtn = nav.createEl("button", {
      cls: "dp-cal-btn",
      attr: { "aria-label": "Toggle calendar" },
    });
    setIcon(calBtn, "calendar");
    if (this.calendarOpen) calBtn.addClass("is-active");

    const next = nav.createEl("button", {
      cls: "dp-nav-btn dp-nav-arrow",
      attr: { "aria-label": "Next day" },
    });
    setIcon(next, "chevron-right");

    prev.addEventListener("click", () =>
      void this.navigateTo(addDays(this.selectedDate, -1)),
    );
    next.addEventListener("click", () =>
      void this.navigateTo(addDays(this.selectedDate, 1)),
    );
    today.addEventListener("click", () => void this.navigateTo(new Date()));
    calBtn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      this.calendarOpen = !this.calendarOpen;
      this.scheduleRender();
    });

    if (this.calendarOpen) this.renderCalendar(nav);
  }

  private async navigateTo(date: Date): Promise<void> {
    const target = startOfDay(date);
    this.selectedDate = target;
    this.calendarMonth = startOfMonth(target);
    this.overrideFilePath = null;
    const fallback = {
      folder: this.plugin.settings.dailyNoteFolderFallback,
      format: this.plugin.settings.dailyNoteFormatFallback,
      template: this.plugin.settings.dailyNoteTemplate,
    };
    const resolved = await resolveDailyNote(this.app, target, fallback);
    if (!resolved.file) {
      try {
        await ensureDailyNote(this.app, target, fallback);
      } catch (e) {
        new Notice(`Daily Notes Planner: failed to create note (${(e as Error).message})`);
      }
    }
    this.scheduleRender();
  }

  private renderCalendar(parent: HTMLElement): void {
    const cal = parent.createDiv({ cls: "dp-calendar" });
    const head = cal.createDiv({ cls: "dp-cal-head" });
    const prev = head.createEl("button", { cls: "dp-nav-btn", text: "◀" });
    const monthLabel = head.createDiv({ cls: "dp-cal-month" });
    monthLabel.textContent = this.calendarMonth.toLocaleDateString(undefined, {
      month: "long",
      year: "numeric",
    });
    const next = head.createEl("button", { cls: "dp-nav-btn", text: "▶" });

    prev.addEventListener("click", () => {
      this.calendarMonth = addMonths(this.calendarMonth, -1);
      this.scheduleRender();
    });
    next.addEventListener("click", () => {
      this.calendarMonth = addMonths(this.calendarMonth, 1);
      this.scheduleRender();
    });

    const grid = cal.createDiv({ cls: "dp-cal-grid" });
    for (const dow of ["S", "M", "T", "W", "T", "F", "S"]) {
      grid.createDiv({ cls: "dp-cal-dow", text: dow });
    }

    const monthStart = startOfMonth(this.calendarMonth);
    const startDow = monthStart.getDay();
    const monthEnd = endOfMonth(this.calendarMonth);
    const today = new Date();

    for (let i = startDow - 1; i >= 0; i--) {
      const d = addDays(monthStart, -i - 1);
      this.renderCalDay(grid, d, today, true);
    }
    for (let i = 1; i <= monthEnd.getDate(); i++) {
      const d = new Date(
        this.calendarMonth.getFullYear(),
        this.calendarMonth.getMonth(),
        i,
      );
      this.renderCalDay(grid, d, today, false);
    }
    const totalCells = startDow + monthEnd.getDate();
    const trailing = (7 - (totalCells % 7)) % 7;
    for (let i = 1; i <= trailing; i++) {
      const d = addDays(monthEnd, i);
      this.renderCalDay(grid, d, today, true);
    }
  }

  private renderCalDay(
    grid: HTMLElement,
    d: Date,
    today: Date,
    isOtherMonth: boolean,
  ): void {
    const cell = grid.createDiv({ cls: "dp-cal-day", text: d.getDate().toString() });
    if (isOtherMonth) cell.addClass("is-other-month");
    if (sameDay(d, today)) cell.addClass("is-today");
    if (sameDay(d, this.selectedDate)) cell.addClass("is-selected");
    cell.addEventListener("click", () => {
      this.calendarOpen = false;
      void this.navigateTo(d);
    });
  }

  private formatDateLabel(d: Date): string {
    return d.toLocaleDateString(undefined, {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  private async readTasks(file: TFile | null): Promise<ParsedTask[]> {
    if (!file) return [];
    const content = await this.app.vault.read(file);
    return parseFileTasks(
      file.path,
      content,
      this.plugin.settings.prefixes,
      this.plugin.settings.defaultDurationMin,
    );
  }

  private renderSection(
    parent: HTMLElement,
    title: string,
    subtitle: string,
    file: TFile | null,
    path: string,
    tasks: ParsedTask[],
    isPrimary: boolean,
    colorMap: Map<string, string>,
    openActiveTarget: TFile | null = null,
  ): void {
    const section = parent.createDiv({ cls: "dp-section" });

    const header = section.createDiv({ cls: "dp-header" });
    if (!isPrimary && title) header.createDiv({ cls: "dp-title", text: title });
    if (subtitle || openActiveTarget) {
      const sub = header.createDiv({ cls: "dp-subtitle" });
      if (subtitle) {
        if (file) {
          const pathLink = sub.createEl("a", {
            cls: "dp-subtitle-link dp-subtitle-path",
            text: subtitle,
            attr: { href: "#", title: `Open ${file.path}` },
          });
          pathLink.addEventListener("click", (ev) => {
            ev.preventDefault();
            void this.openFile(file);
          });
        } else {
          sub.createSpan({ text: subtitle });
        }
      }
      if (openActiveTarget) {
        if (subtitle) sub.createSpan({ cls: "dp-subtitle-sep", text: "•" });
        const link = sub.createEl("a", {
          cls: "dp-subtitle-link",
          text: "Open Active Note",
          attr: {
            href: "#",
            "aria-label": `Open active note: ${openActiveTarget.path}`,
            title: openActiveTarget.path,
          },
        });
        link.addEventListener("click", (ev) => {
          ev.preventDefault();
          this.overrideFilePath = openActiveTarget.path;
          this.scheduleRender();
        });
      }
    }

    const statsRow = header.createDiv({ cls: "dp-stats-row" });
    this.renderPlannedTable(statsRow, tasks);
    if (isPrimary) this.renderFreeTable(statsRow, tasks);
    this.renderProjectTable(statsRow, tasks, colorMap);

    if (!file && isPrimary) {
      const create = section.createEl("button", {
        cls: "dp-create",
        text: `Create ${path}`,
      });
      create.addEventListener("click", async () => {
        const fallback = {
          folder: this.plugin.settings.dailyNoteFolderFallback,
          format: this.plugin.settings.dailyNoteFormatFallback,
          template: this.plugin.settings.dailyNoteTemplate,
        };
        await ensureDailyNote(this.app, this.selectedDate, fallback);
        this.scheduleRender();
      });
      return;
    }

    if (!file) return;

    const body = section.createDiv({ cls: "dp-body" });
    const { scheduled, unscheduled } = partition(tasks);

    this.renderTimeline(body, file, scheduled, colorMap);
    this.renderUnscheduled(body, file, unscheduled, colorMap);
  }

  private renderTimeline(
    parent: HTMLElement,
    file: TFile,
    scheduled: ParsedTask[],
    colorMap: Map<string, string>,
  ): void {
    const settings = this.plugin.settings;
    const startMin = settings.visibleStartHour * 60;
    const endMin = settings.visibleEndHour * 60;
    const totalMin = endMin - startMin;
    const heightPx = totalMin * settings.pxPerMin;

    const wrap = parent.createDiv({ cls: "dp-timeline-wrap" });
    const timeline = wrap.createDiv({ cls: "dp-timeline" });
    timeline.style.height = `${heightPx}px`;

    for (let h = settings.visibleStartHour; h <= settings.visibleEndHour; h++) {
      const top = (h * 60 - startMin) * settings.pxPerMin;
      const row = timeline.createDiv({ cls: "dp-hour-row" });
      row.style.top = `${top}px`;
      row.createDiv({ cls: "dp-hour-label", text: this.formatHourLabel(h) });
      row.createDiv({ cls: "dp-hour-line" });
    }

    const blocksLayer = timeline.createDiv({ cls: "dp-blocks" });
    const layout = layoutTimeline(scheduled, startMin, settings.pxPerMin);
    for (const block of layout)
      this.renderBlock(blocksLayer, file, block, colorMap);

    this.renderGutter(timeline, blocksLayer, file, startMin, endMin);

    const computeSnap = (clientY: number): number | null => {
      if (!this.dragPayload) return null;
      const rect = timeline.getBoundingClientRect();
      const yPx =
        clientY - rect.top + timeline.scrollTop - this.dragPayload.grabOffsetY;
      const rawMin = yPx / settings.pxPerMin + startMin;
      const snapped = snapToInterval(rawMin, settings.snapMin);
      const maxStart = endMin - this.dragPayload.durationMin;
      return Math.max(startMin, Math.min(maxStart, snapped));
    };

    timeline.addEventListener("dragover", (ev) => {
      if (!this.dragPayload) return;
      ev.preventDefault();
      const snapped = computeSnap(ev.clientY);
      if (snapped === null) return;
      this.showDropIndicator(
        blocksLayer,
        snapped,
        this.dragPayload.durationMin,
        startMin,
        settings.pxPerMin,
      );
    });
    timeline.addEventListener("drop", (ev) => {
      if (!this.dragPayload) return;
      ev.preventDefault();
      const snapped = computeSnap(ev.clientY);
      if (snapped !== null) void this.handleDropOnTimeline(this.dragPayload, snapped);
      this.dragPayload = null;
      this.hideDropIndicator();
    });
    timeline.addEventListener("dragleave", (ev) => {
      const related = ev.relatedTarget as Node | null;
      if (!related || !timeline.contains(related)) this.hideDropIndicator();
    });
  }

  private showDropIndicator(
    layer: HTMLElement,
    snappedStartMin: number,
    durationMin: number,
    rangeStartMin: number,
    pxPerMin: number,
  ): void {
    if (!this.dropIndicator || this.dropIndicator.parentElement !== layer) {
      this.dropIndicator?.detach();
      this.dropIndicator = layer.createDiv({ cls: "dp-drop-indicator" });
    }
    const ind = this.dropIndicator;
    ind.empty();
    ind.style.top = `${(snappedStartMin - rangeStartMin) * pxPerMin}px`;
    ind.style.height = `${Math.max(18, durationMin * pxPerMin)}px`;
    ind.createDiv({
      cls: "dp-drop-indicator-time",
      text: `${this.fmtClock(snappedStartMin)}–${this.fmtClock(
        snappedStartMin + durationMin,
      )}`,
    });
    if (this.dragPayload?.bodyText) {
      ind.createDiv({
        cls: "dp-drop-indicator-text",
        text: this.dragPayload.bodyText,
      });
    }
  }

  private hideDropIndicator(): void {
    this.dropIndicator?.detach();
    this.dropIndicator = null;
  }

  private renderGutter(
    timeline: HTMLElement,
    blocksLayer: HTMLElement,
    file: TFile,
    startMin: number,
    endMin: number,
  ): void {
    const settings = this.plugin.settings;
    const gutter = timeline.createDiv({ cls: "dp-gutter" });
    const eyebrow = gutter.createDiv({ cls: "dp-gutter-eyebrow" });
    eyebrow.createSpan({ cls: "dp-gutter-eyebrow-mark", text: "+" });
    eyebrow.createSpan({ cls: "dp-gutter-eyebrow-text", text: "new" });

    const reveal = () => timeline.addClass("is-gutter-revealed");
    const hide = () => {
      if (gutter.dataset.dragging) return;
      timeline.removeClass("is-gutter-revealed");
    };

    timeline.addEventListener("pointerenter", reveal);
    timeline.addEventListener("pointerleave", hide);

    const minuteFromY = (clientY: number): number => {
      const rect = timeline.getBoundingClientRect();
      const y = clientY - rect.top + timeline.scrollTop;
      const raw = y / settings.pxPerMin + startMin;
      return snapToInterval(raw, settings.snapMin);
    };

    const DRAG_THRESHOLD_PX = 4;
    let pending: { startClientY: number; anchorMin: number } | null = null;
    let dragState: {
      pointerId: number;
      anchorMin: number;
      indicator: HTMLElement;
    } | null = null;
    // After a drag commits in `pointerup`, the browser still synthesizes a
    // `click` event from the same pointerdown/up pair. Without this guard the
    // click handler would fire a second createTaskAtTime() at the cursor's
    // release-Y, racing the drag write on disk and clobbering it.
    let suppressNextClick = false;

    const updateIndicator = (
      indicator: HTMLElement,
      topMin: number,
      durationMin: number,
    ): void => {
      indicator.style.top = `${(topMin - startMin) * settings.pxPerMin}px`;
      indicator.style.height = `${Math.max(18, durationMin * settings.pxPerMin)}px`;
      let timeEl = indicator.querySelector<HTMLElement>(".dp-drop-indicator-time");
      if (!timeEl) {
        timeEl = indicator.createDiv({ cls: "dp-drop-indicator-time" });
      }
      timeEl.textContent = `${this.fmtClock(topMin)}–${this.fmtClock(
        topMin + durationMin,
      )}`;
      let textEl = indicator.querySelector<HTMLElement>(".dp-drop-indicator-text");
      if (!textEl) {
        textEl = indicator.createDiv({
          cls: "dp-drop-indicator-text",
          text: "New task",
        });
      }
    };

    const beginDrag = (ev: PointerEvent, anchor: number): void => {
      const indicator = blocksLayer.createDiv({
        cls: "dp-drop-indicator dp-create-indicator",
      });
      updateIndicator(indicator, anchor, settings.defaultDurationMin);
      dragState = { pointerId: ev.pointerId, anchorMin: anchor, indicator };
      try {
        gutter.setPointerCapture(ev.pointerId);
      } catch {}
      gutter.dataset.dragging = "1";
    };

    const cancelDrag = (): void => {
      if (!dragState) return;
      dragState.indicator.detach();
      try {
        gutter.releasePointerCapture(dragState.pointerId);
      } catch {}
      delete gutter.dataset.dragging;
      dragState = null;
    };

    gutter.addEventListener("pointerdown", (ev) => {
      if (ev.button !== 0) return;
      reveal();
      const anchor = Math.max(
        startMin,
        Math.min(endMin - settings.snapMin, minuteFromY(ev.clientY)),
      );
      pending = { startClientY: ev.clientY, anchorMin: anchor };
    });

    gutter.addEventListener("pointermove", (ev) => {
      if (dragState) {
        const m = Math.max(
          startMin,
          Math.min(endMin, minuteFromY(ev.clientY)),
        );
        const top = Math.min(dragState.anchorMin, m);
        const bottom = Math.max(dragState.anchorMin + settings.snapMin, m);
        updateIndicator(dragState.indicator, top, bottom - top);
        return;
      }
      if (
        pending &&
        Math.abs(ev.clientY - pending.startClientY) > DRAG_THRESHOLD_PX
      ) {
        beginDrag(ev, pending.anchorMin);
      }
    });

    gutter.addEventListener("pointerup", (ev) => {
      if (!dragState) return;
      // Drag committed: handle here so the trailing synthetic click is suppressed.
      ev.preventDefault();
      ev.stopPropagation();
      const state = dragState;
      const m = Math.max(
        startMin,
        Math.min(endMin, minuteFromY(ev.clientY)),
      );
      const top = Math.min(state.anchorMin, m);
      const bottom = Math.max(state.anchorMin + settings.snapMin, m);
      const duration = bottom - top;
      const clampedTop = Math.min(top, endMin - duration);
      cancelDrag();
      pending = null;
      suppressNextClick = true;
      void this.createTaskAtTime(file, clampedTop, duration);
      if (!timeline.matches(":hover"))
        timeline.removeClass("is-gutter-revealed");
    });

    gutter.addEventListener("pointercancel", () => {
      cancelDrag();
      pending = null;
    });

    // Single-click handler: runs after pointerup when the pointer barely moved.
    // Using `click` (rather than committing in pointerup) sidesteps Obsidian's
    // sidebar-leaf activation, which can swallow the first pointerdown when the
    // daily-notes-planner pane isn't yet the active leaf.
    gutter.addEventListener("click", (ev) => {
      ev.stopPropagation();
      if (suppressNextClick) {
        suppressNextClick = false;
        return;
      }
      const anchor = pending
        ? pending.anchorMin
        : Math.max(
            startMin,
            Math.min(endMin - settings.snapMin, minuteFromY(ev.clientY)),
          );
      pending = null;
      void this.createTaskAtTime(file, anchor, settings.defaultDurationMin);
      if (!timeline.matches(":hover"))
        timeline.removeClass("is-gutter-revealed");
    });
  }

  private createTaskAtTime(
    file: TFile,
    startMin: number,
    durationMin: number,
  ): void {
    const prefixes = this.plugin.settings.prefixes;
    new TitlePromptModal(this.app, {
      heading: `New task at ${this.fmtClock(startMin)}`,
      placeholder: "Task title…",
      onSubmit: (title) => {
        const newLine = buildTaskLine(title, prefixes, { startMin, durationMin });
        void this.appendTaskAfterLast(file, newLine);
      },
    }).open();
  }

  private createUnscheduledTask(file: TFile): void {
    const prefixes = this.plugin.settings.prefixes;
    new TitlePromptModal(this.app, {
      heading: "New unscheduled task",
      placeholder: "Task title…",
      onSubmit: (title) => {
        const newLine = buildTaskLine(title, prefixes, {
          durationMin: this.plugin.settings.defaultDurationMin,
        });
        void this.appendTaskAfterLast(file, newLine);
      },
    }).open();
  }

  private async appendTaskAfterLast(
    file: TFile,
    newLine: string,
  ): Promise<void> {
    const content = await this.app.vault.read(file);
    const lines = content.split("\n");
    const lastIdx = findLastTaskLine(content);
    const insertAt = lastIdx === -1 ? lines.length : lastIdx + 1;
    lines.splice(insertAt, 0, newLine);
    await this.app.vault.modify(file, lines.join("\n"));
    // Land cursor at end of the new line so the user can keep editing.
    void this.openLine(file, insertAt, newLine.length);
  }

  private renderBlock(
    layer: HTMLElement,
    file: TFile,
    block: LayoutBlock,
    colorMap: Map<string, string>,
  ): void {
    const el = layer.createDiv({ cls: "dp-block" });
    el.style.top = `${block.topPx}px`;
    el.style.height = `${Math.max(18, block.heightPx)}px`;
    el.style.left = `${block.leftPct}%`;
    el.style.width = `${block.widthPct}%`;
    if (block.task.checked) el.addClass("is-done");
    if (!block.task.hasExplicitDuration) el.addClass("is-implicit-duration");
    if (block.task.durationMin < 25) el.addClass("is-compact");
    const color = block.task.project ? colorMap.get(block.task.project) : null;
    if (color) {
      el.style.setProperty("--dp-color", color);
      el.style.setProperty("--dp-on-color", contrastingTextColor(color));
      el.addClass("has-project-color");
    }
    el.draggable = true;

    const row = el.createDiv({ cls: "dp-block-row" });
    if (!block.task.hasExplicitDuration) {
      const warn = row.createSpan({ cls: "dp-warn" });
      setIcon(warn, "alert-triangle");
      warn.setAttribute("aria-label", "No #d/ tag — using default duration");
    }
    row.createSpan({
      cls: "dp-block-time",
      text: this.formatBlockTime(block.task),
    });
    row.createSpan({ cls: "dp-block-sep", text: "·" });
    if (block.task.project) {
      row.createSpan({ cls: "dp-block-project", text: block.task.project });
      row.createSpan({ cls: "dp-block-sep", text: "·" });
    }
    row.createSpan({
      cls: "dp-block-text",
      text: this.cleanBody(block.task.body),
    });

    el.addEventListener("dragstart", (ev) => {
      const rect = el.getBoundingClientRect();
      this.dragPayload = {
        filePath: file.path,
        lineNumber: block.task.lineNumber,
        rawLine: block.task.rawLine,
        source: "timeline",
        grabOffsetY: ev.clientY - rect.top,
        durationMin: block.task.durationMin,
        bodyText: this.cleanBody(block.task.body),
      };
      el.addClass("is-dragging");
      this.suppressNativeDragImage(ev);
      ev.dataTransfer?.setData("text/plain", block.task.rawLine);
      if (ev.dataTransfer) ev.dataTransfer.effectAllowed = "move";
    });
    el.addEventListener("dragend", () => {
      el.removeClass("is-dragging");
      this.dragPayload = null;
      this.hideDropIndicator();
    });
    el.addEventListener("click", () =>
      this.openLine(file, block.task.lineNumber, this.endOfTitleCh(block.task.rawLine)),
    );

    const handle = el.createDiv({ cls: "dp-resize-handle" });
    handle.addEventListener("pointerdown", (ev) =>
      this.beginResize(ev, el, file, block),
    );
  }

  private beginResize(
    ev: PointerEvent,
    blockEl: HTMLElement,
    file: TFile,
    block: LayoutBlock,
  ): void {
    ev.preventDefault();
    ev.stopPropagation();
    const handle = ev.currentTarget as HTMLElement;
    const settings = this.plugin.settings;
    const startY = ev.clientY;
    const startHeightPx = blockEl.offsetHeight;
    const minDuration = settings.snapMin;
    const pxPerMin = settings.pxPerMin;
    let pendingDuration = block.task.durationMin;

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
      const timeEl = blockEl.querySelector<HTMLElement>(".dp-block-time");
      if (timeEl && block.task.startMin !== null) {
        const start = block.task.startMin;
        timeEl.textContent =
          `${this.fmtClock(start)}–${this.fmtClock(start + pendingDuration)}`;
      }
    };

    const onUp = (e: PointerEvent) => {
      handle.removeEventListener("pointermove", onMove);
      handle.removeEventListener("pointerup", onUp);
      handle.removeEventListener("pointercancel", onUp);
      blockEl.removeClass("is-resizing");
      try {
        handle.releasePointerCapture(e.pointerId);
      } catch {}
      const finalDuration = pendingDuration;
      if (finalDuration === block.task.durationMin) {
        blockEl.draggable = true;
        return;
      }
      void this.applyDurationChange(file, block.task, finalDuration).finally(
        () => {
          blockEl.draggable = true;
        },
      );
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
    await this.editLine(
      {
        filePath: file.path,
        lineNumber: task.lineNumber,
        rawLine: task.rawLine,
        source: "timeline",
        grabOffsetY: 0,
        durationMin: task.durationMin,
        bodyText: "",
      },
      (line) => setDurationTag(line, newDurationMin, prefixes),
    );
  }

  private suppressNativeDragImage(ev: DragEvent): void {
    if (!ev.dataTransfer) return;
    const img = new Image();
    img.src = TRANSPARENT_PIXEL;
    try {
      ev.dataTransfer.setDragImage(img, 0, 0);
    } catch {}
  }

  private renderUnscheduled(
    parent: HTMLElement,
    file: TFile,
    unscheduled: ParsedTask[],
    colorMap: Map<string, string>,
  ): void {
    const list = parent.createDiv({ cls: "dp-unscheduled" });
    const head = list.createDiv({ cls: "dp-unscheduled-head" });
    head.createSpan({ text: "Unscheduled" });
    const addBtn = head.createEl("button", {
      cls: "dp-unscheduled-add",
      attr: { "aria-label": "Add unscheduled task" },
    });
    setIcon(addBtn, "plus");
    addBtn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      void this.createUnscheduledTask(file);
    });

    if (unscheduled.length === 0) {
      list.createDiv({ cls: "dp-empty", text: "No unscheduled tasks." });
    }

    unscheduled.forEach((task, idx) => {
      const card = list.createDiv({ cls: "dp-card" });
      if (task.checked) card.addClass("is-done");
      if (!task.hasExplicitDuration) card.addClass("is-implicit-duration");
      const color = task.project ? colorMap.get(task.project) : null;
      if (color) {
        card.style.setProperty("--dp-color", color);
        card.addClass("has-project-color");
      }
      card.draggable = true;
      const meta = card.createDiv({ cls: "dp-card-meta" });
      if (!task.hasExplicitDuration) {
        const warn = meta.createSpan({ cls: "dp-warn" });
        setIcon(warn, "alert-triangle");
        warn.setAttribute("aria-label", "No #d/ tag — using default duration");
      }
      meta.createSpan({ text: formatTotal(task.durationMin) });
      if (task.project) {
        card.createSpan({ cls: "dp-card-project", text: task.project });
      }
      const text = card.createDiv({ cls: "dp-card-text" });
      text.textContent = this.cleanBody(task.body);

      card.addEventListener("dragstart", (ev) => {
        const rect = card.getBoundingClientRect();
        this.dragPayload = {
          filePath: file.path,
          lineNumber: task.lineNumber,
          rawLine: task.rawLine,
          source: "unscheduled",
          grabOffsetY: ev.clientY - rect.top,
          durationMin: task.durationMin,
          bodyText: this.cleanBody(task.body),
        };
        card.addClass("is-dragging");
        this.suppressNativeDragImage(ev);
        ev.dataTransfer?.setData("text/plain", task.rawLine);
        if (ev.dataTransfer) ev.dataTransfer.effectAllowed = "move";
      });
      card.addEventListener("dragend", () => {
        card.removeClass("is-dragging");
        this.dragPayload = null;
        this.hideDropIndicator();
      });
      card.addEventListener("dragover", (ev) => {
        if (this.dragPayload?.source === "unscheduled") ev.preventDefault();
      });
      card.addEventListener("drop", (ev) => {
        if (!this.dragPayload || this.dragPayload.source !== "unscheduled")
          return;
        ev.preventDefault();
        ev.stopPropagation();
        void this.handleReorderUnscheduled(
          file,
          unscheduled,
          this.dragPayload,
          idx,
        );
        this.dragPayload = null;
      });
      card.addEventListener("click", () =>
        this.openLine(file, task.lineNumber, this.endOfTitleCh(task.rawLine)),
      );
    });

    list.addEventListener("dragover", (ev) => {
      if (this.dragPayload?.source === "timeline") ev.preventDefault();
    });
    list.addEventListener("drop", (ev) => {
      if (!this.dragPayload || this.dragPayload.source !== "timeline") return;
      ev.preventDefault();
      void this.handleUnschedule(this.dragPayload, unscheduled);
      this.dragPayload = null;
    });
  }

  private async handleDropOnTimeline(
    payload: DragPayload,
    newStartMin: number,
  ): Promise<void> {
    const prefixes = this.plugin.settings.prefixes;
    await this.editLine(payload, (line) => {
      let next = setTimeTag(line, newStartMin, prefixes);
      next = removeOrderTag(next, prefixes);
      return next;
    });
  }

  private async handleUnschedule(
    payload: DragPayload,
    unscheduled: ParsedTask[],
  ): Promise<void> {
    const prefixes = this.plugin.settings.prefixes;
    const maxOrder = unscheduled.reduce(
      (acc, t) => (t.order !== null && t.order > acc ? t.order : acc),
      0,
    );
    await this.editLine(payload, (line) => {
      let next = removeTimeTag(line, prefixes);
      next = setOrderTag(next, maxOrder + 1, prefixes);
      return next;
    });
  }

  private async handleReorderUnscheduled(
    file: TFile,
    unscheduled: ParsedTask[],
    payload: DragPayload,
    targetIdx: number,
  ): Promise<void> {
    const prefixes = this.plugin.settings.prefixes;
    const sourceIdx = unscheduled.findIndex(
      (t) => t.lineNumber === payload.lineNumber,
    );
    if (sourceIdx === -1 || sourceIdx === targetIdx) return;
    const reordered = [...unscheduled];
    const [moved] = reordered.splice(sourceIdx, 1);
    reordered.splice(targetIdx, 0, moved);

    const content = await this.app.vault.read(file);
    const lines = content.split("\n");
    let dirty = false;
    reordered.forEach((task, i) => {
      const desiredOrder = i + 1;
      if (task.order === desiredOrder) return;
      const idx = task.lineNumber;
      if (idx < 0 || idx >= lines.length) return;
      if (lines[idx] !== task.rawLine) return;
      lines[idx] = setOrderTag(lines[idx], desiredOrder, prefixes);
      dirty = true;
    });
    if (!dirty) return;
    await this.app.vault.modify(file, lines.join("\n"));
  }

  private async editLine(
    payload: DragPayload,
    transform: (line: string) => string,
  ): Promise<void> {
    const file = this.app.vault.getAbstractFileByPath(payload.filePath);
    if (!(file instanceof TFile)) {
      new Notice("Daily Notes Planner: source file no longer exists.");
      this.scheduleRender();
      return;
    }
    const content = await this.app.vault.read(file);
    const lines = content.split("\n");
    const idx = payload.lineNumber;
    if (idx < 0 || idx >= lines.length || lines[idx] !== payload.rawLine) {
      new Notice("Daily Notes Planner: file changed since last render — refreshing.");
      this.scheduleRender();
      return;
    }
    const next = transform(lines[idx]);
    if (next === lines[idx]) return;
    lines[idx] = next;
    await this.app.vault.modify(file, lines.join("\n"));
  }

  private formatHourLabel(h: number): string {
    const ampm = h < 12 || h === 24 ? "a" : "p";
    let h12 = h % 12;
    if (h12 === 0) h12 = 12;
    return `${h12}${ampm}`;
  }

  private renderPlannedTable(
    parent: HTMLElement,
    tasks: ParsedTask[],
  ): void {
    const totals = computeTotals(tasks);
    const total = totals.scheduledMin + totals.unscheduledMin;

    const table = parent.createDiv({ cls: "dp-stat-table" });
    table.createSpan({ cls: "dp-st-h", text: "Type" });
    table.createSpan({ cls: "dp-st-h dp-st-h-right", text: "Planned" });
    this.renderStatRow(table, "Scheduled", totals.scheduledMin);
    this.renderStatRow(table, "Unscheduled", totals.unscheduledMin);
    this.renderStatRow(table, "Total", total, true);
  }

  private renderFreeTable(
    parent: HTMLElement,
    tasks: ParsedTask[],
  ): void {
    const settings = this.plugin.settings;
    const scheduled = tasks.filter((t) => t.startMin !== null);
    const wakeMin = settings.wakeHour * 60;
    const sleepMin = settings.sleepHour * 60;
    const workStartMin = settings.workStartHour * 60;
    const workEndMin = settings.workEndHour * 60;

    const workOpen = computeFreeMin(scheduled, workStartMin, workEndMin);
    const beforeWork = computeFreeMin(
      scheduled,
      wakeMin,
      Math.min(workStartMin, sleepMin),
    );
    const afterWork = computeFreeMin(
      scheduled,
      Math.max(workEndMin, wakeMin),
      sleepMin,
    );
    const nonWorkOpen = beforeWork + afterWork;
    const totalDay = workOpen + nonWorkOpen;

    const table = parent.createDiv({ cls: "dp-stat-table" });
    table.createSpan({ cls: "dp-st-h", text: "Free Time" });
    table.createSpan({ cls: "dp-st-h dp-st-h-right", text: "Available" });
    this.renderStatRow(table, "Working Hours", workOpen);
    this.renderStatRow(table, "Non-Work Hours", nonWorkOpen);
    this.renderStatRow(table, "Total Day", totalDay, true);
  }

  private renderStatRow(
    table: HTMLElement,
    label: string,
    mins: number,
    strong: boolean = false,
  ): void {
    const nameCls = strong ? "dp-st-name dp-st-strong" : "dp-st-name";
    const valueCls = strong ? "dp-st-value dp-st-strong" : "dp-st-value";
    table.createSpan({ cls: nameCls, text: label });
    table.createSpan({ cls: valueCls, text: formatTotal(mins) });
  }

  private renderProjectTable(
    parent: HTMLElement,
    tasks: ParsedTask[],
    colorMap: Map<string, string>,
  ): void {
    const totals = new Map<string, number>();
    let unassignedMin = 0;
    for (const t of tasks) {
      if (t.project) {
        totals.set(t.project, (totals.get(t.project) ?? 0) + t.durationMin);
      } else {
        unassignedMin += t.durationMin;
      }
    }
    if (totals.size === 0 && unassignedMin === 0) return;
    const sorted = [...totals.entries()].sort((a, b) =>
      a[0].localeCompare(b[0]),
    );

    const table = parent.createDiv({ cls: "dp-stat-table" });
    table.createSpan({ cls: "dp-st-h", text: "Project" });
    table.createSpan({ cls: "dp-st-h dp-st-h-right", text: "Planned" });
    for (const [name, mins] of sorted) {
      const nameCell = table.createDiv({ cls: "dp-st-name" });
      const swatch = nameCell.createSpan({ cls: "dp-st-swatch" });
      const color = colorMap.get(name);
      if (color) swatch.style.backgroundColor = color;
      nameCell.createSpan({ text: name });
      table.createSpan({ cls: "dp-st-value", text: formatTotal(mins) });
    }
    if (unassignedMin > 0) {
      const nameCell = table.createDiv({ cls: "dp-st-name dp-st-unassigned" });
      nameCell.createSpan({ cls: "dp-st-swatch dp-st-swatch-unassigned" });
      nameCell.createSpan({ text: "Unassigned" });
      table.createSpan({
        cls: "dp-st-value dp-st-unassigned",
        text: formatTotal(unassignedMin),
      });
    }
  }

  private formatBlockTime(task: ParsedTask): string {
    if (task.startMin === null) return "";
    const start = task.startMin;
    const end = start + task.durationMin;
    return `${this.fmtClock(start)}–${this.fmtClock(end)}`;
  }

  private fmtClock(totalMin: number): string {
    const h24 = Math.floor(totalMin / 60) % 24;
    const m = totalMin % 60;
    const ampm = h24 < 12 ? "a" : "p";
    let h12 = h24 % 12;
    if (h12 === 0) h12 = 12;
    return m === 0
      ? `${h12}${ampm}`
      : `${h12}:${m.toString().padStart(2, "0")}${ampm}`;
  }

  private cleanBody(body: string): string {
    const p = this.plugin.settings.prefixes;
    return body
      .replace(new RegExp(`#${p.duration}\\/\\S+`, "g"), "")
      .replace(new RegExp(`#${p.time}\\/\\S+`, "g"), "")
      .replace(new RegExp(`#${p.order}\\/\\d+`, "g"), "")
      .replace(new RegExp(`#${p.project}\\/[\\w-]+`, "g"), "")
      .replace(/\s+/g, " ")
      .trim();
  }

  private endOfTitleCh(rawLine: string): number {
    const p = this.plugin.settings.prefixes;
    const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(
      `#(?:${esc(p.duration)}|${esc(p.time)}|${esc(p.order)}|${esc(p.project)})\\/`,
    );
    const m = re.exec(rawLine);
    const cutoff = m ? m.index : rawLine.length;
    let end = cutoff;
    while (end > 0 && /\s/.test(rawLine[end - 1])) end--;
    return end;
  }

  private async openLine(file: TFile, line: number, ch: number = 0): Promise<void> {
    const leaf = this.app.workspace.getLeaf(false);
    await leaf.openFile(file);
    const view = leaf.view as {
      editor?: {
        setCursor: (p: { line: number; ch: number }) => void;
        focus?: () => void;
      };
    };
    view.editor?.setCursor({ line, ch });
    view.editor?.focus?.();
  }

  private async openFile(file: TFile): Promise<void> {
    const leaf = this.app.workspace.getLeaf(false);
    await leaf.openFile(file);
  }
}

class TitlePromptModal extends Modal {
  private opts: {
    heading: string;
    placeholder: string;
    onSubmit: (title: string) => void;
  };

  constructor(
    app: App,
    opts: {
      heading: string;
      placeholder: string;
      onSubmit: (title: string) => void;
    },
  ) {
    super(app);
    this.opts = opts;
  }

  onOpen(): void {
    this.modalEl.addClass("dp-title-modal");
    this.titleEl.setText(this.opts.heading);

    const input = this.contentEl.createEl("input", {
      type: "text",
      cls: "dp-title-input",
      attr: { placeholder: this.opts.placeholder },
    });
    input.focus();

    input.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter") {
        ev.preventDefault();
        const title = input.value.trim();
        this.opts.onSubmit(title);
        this.close();
      }
      // Escape is handled by Modal's default close behavior — no task created.
    });
  }

  onClose(): void {
    this.contentEl.empty();
  }
}
