import {
  ItemView,
  WorkspaceLeaf,
  TFile,
  Notice,
  Modal,
  App,
  Platform,
  setIcon,
} from "obsidian";
import { parseTimelineHeight } from "./settings";
import type TodayPlugin from "./main";
import {
  ParsedTask,
  ParsedSubtask,
  ExerciseSummary,
  parseFileTasks,
  parseExercises,
  formatExerciseLine,
  setTimeTag,
  removeTimeTag,
  setOrderTag,
  removeOrderTag,
  setDurationTag,
  setProjectTag,
  removeProjectTag,
  setTaskTitle,
  setTaskDescription,
  setTaskChecked,
  snapToInterval,
  formatTotal,
  formatCompactDuration,
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
import { resolveProjectColors, contrastingTextColor, ContextTag } from "./colors";
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

export const VIEW_TYPE_TODAY = "today-view";

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

function nowMinutes(): number {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
}

function quickDurations(
  mins: number[],
): { label: string; min: number }[] {
  return mins.map((m) => ({ label: formatCompactDuration(m), min: m }));
}

export class TodayView extends ItemView {
  plugin: TodayPlugin;
  private rerenderTimer: number | null = null;
  private dragPayload: DragPayload | null = null;
  private dropIndicator: HTMLElement | null = null;
  private selectedDate: Date = startOfDay(new Date());
  private calendarMonth: Date = startOfMonth(new Date());
  private calendarOpen: boolean = false;
  private summariesCollapsed: boolean = false;
  private unscheduledCollapsed: boolean = Platform.isMobile;
  private overrideFilePath: string | null = null;
  private hasRendered: boolean = false;

  constructor(leaf: WorkspaceLeaf, plugin: TodayPlugin) {
    super(leaf);
    this.plugin = plugin;
  }

  getViewType(): string {
    return VIEW_TYPE_TODAY;
  }

  getDisplayText(): string {
    return "Today";
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
    this.registerInterval(
      window.setInterval(() => this.refreshNowLines(), 60000),
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
    root.addClass("today-root");
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

    const fileContent = displayFile
      ? await this.app.vault.read(displayFile)
      : "";
    const tasks = displayFile
      ? parseFileTasks(
          displayFile.path,
          fileContent,
          this.plugin.settings.prefixes,
          this.plugin.settings.defaultDurationMin,
        )
      : [];
    const exercises = parseExercises(fileContent, this.plugin.settings.prefixes);

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
      exercises,
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
    this.hasRendered = true;
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
        new Notice(`Today: failed to create note (${(e as Error).message})`);
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

  private renderSection(
    parent: HTMLElement,
    title: string,
    subtitle: string,
    file: TFile | null,
    path: string,
    tasks: ParsedTask[],
    exercises: ExerciseSummary[],
    isPrimary: boolean,
    colorMap: Map<string, string>,
    openActiveTarget: TFile | null = null,
  ): void {
    const section = parent.createDiv({ cls: "dp-section" });
    if (this.summariesCollapsed) section.addClass("is-summaries-collapsed");

    const header = section.createDiv({ cls: "dp-header" });
    if (isPrimary) {
      const collapseBtn = header.createEl("button", {
        cls: "dp-summaries-toggle",
        attr: {
          "aria-label": this.summariesCollapsed
            ? "Expand summaries"
            : "Collapse summaries",
          "aria-expanded": this.summariesCollapsed ? "false" : "true",
        },
      });
      setIcon(
        collapseBtn,
        this.summariesCollapsed ? "chevron-down" : "chevron-up",
      );
      collapseBtn.addEventListener("click", (ev) => {
        ev.stopPropagation();
        this.summariesCollapsed = !this.summariesCollapsed;
        this.scheduleRender();
      });
    }
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

    if (isPrimary) {
      const workout = header.createDiv({ cls: "dp-workout" });
      workout.textContent = formatExerciseLine(exercises);
    }

    const statsRow = header.createDiv({ cls: "dp-stats-row" });
    this.renderTimeTable(statsRow, tasks);
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
    const configuredHeight = Platform.isMobile
      ? settings.timelineHeightMobile
      : settings.timelineHeightDesktop;
    const parsedHeight = parseTimelineHeight(configuredHeight);
    if (parsedHeight) wrap.style.maxHeight = parsedHeight;
    const timeline = wrap.createDiv({ cls: "dp-timeline" });
    timeline.style.height = `${heightPx}px`;
    // One snap interval in px — sizes each gutter mark's hit box so they
    // tile the band edge-to-edge, centered on their mark line.
    const snapPx = settings.snapMin * settings.pxPerMin;
    timeline.style.setProperty("--dp-snap-px", `${snapPx}px`);

    for (let h = settings.visibleStartHour; h <= settings.visibleEndHour; h++) {
      const top = (h * 60 - startMin) * settings.pxPerMin;
      const row = timeline.createDiv({ cls: "dp-hour-row" });
      row.style.top = `${top}px`;
      row.createDiv({ cls: "dp-hour-line" });
      const band = row.createDiv({ cls: "dp-hour-band" });
      const isLast = h >= settings.visibleEndHour;
      band.style.height = isLast ? "0px" : `${60 * settings.pxPerMin}px`;
      const label = band.createDiv({
        cls: "dp-hour-label",
        text: this.formatHourLabel(h),
      });
      // The closing line at endHour is decorative — clicking it would create
      // a task past the visible end of day, so leave it inert.
      if (isLast) continue;
      label.addClass("is-clickable");
      label.setAttribute("aria-label", `New task at ${this.formatHourLabel(h)}`);
      label.addEventListener("click", (ev) => {
        ev.stopPropagation();
        void this.createTaskAtTime(file, h * 60, settings.defaultDurationMin);
      });
      const snap = settings.snapMin;
      if (snap > 0 && snap < 60) {
        for (let m = snap; m < 60; m += snap) {
          const mm = m.toString().padStart(2, "0");
          const sub = band.createDiv({
            cls: "dp-hour-submark is-clickable",
            text: `:${mm}`,
          });
          // Center the hit box on the mark line: half a snap above the mark.
          sub.style.top = `${m * settings.pxPerMin - snapPx / 2}px`;
          sub.setAttribute(
            "aria-label",
            `New task at ${this.formatHourLabel(h)}:${mm}`,
          );
          sub.addEventListener("click", (ev) => {
            ev.stopPropagation();
            void this.createTaskAtTime(
              file,
              h * 60 + m,
              settings.defaultDurationMin,
            );
          });
        }
      }
    }

    const blocksLayer = timeline.createDiv({ cls: "dp-blocks" });
    const layout = layoutTimeline(scheduled, startMin, settings.pxPerMin);
    for (const block of layout)
      this.renderBlock(blocksLayer, file, block, colorMap);

    // Now-line: only when viewing today and the current time falls inside the
    // visible window. Stored on the wrap so refreshNowLines() can update it
    // every minute without a full re-render.
    if (sameDay(this.selectedDate, new Date())) {
      const nowLine = timeline.createDiv({ cls: "dp-now-line" });
      nowLine.dataset.startMin = String(startMin);
      nowLine.dataset.endMin = String(endMin);
      nowLine.dataset.pxPerMin = String(settings.pxPerMin);
      this.positionNowLine(nowLine);
      // First render: scroll the wrap so the now-line sits ~30% from the top.
      // The caller restores prevTimelineScrolls AFTER this method returns,
      // so we register a one-shot to override that.
      if (!this.hasRendered) {
        const visibleNowMin = nowMinutes();
        if (visibleNowMin >= startMin && visibleNowMin <= endMin) {
          const topPx = (visibleNowMin - startMin) * settings.pxPerMin;
          window.requestAnimationFrame(() => {
            const offset = wrap.clientHeight * 0.3;
            wrap.scrollTop = Math.max(0, topPx - offset);
          });
        }
      }
    }

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

  private createTaskAtTime(
    file: TFile,
    startMin: number,
    defaultDurationMin: number,
  ): void {
    const prefixes = this.plugin.settings.prefixes;
    new TitlePromptModal(this.app, {
      heading: `New task at ${this.fmtClock(startMin)}`,
      placeholder: "Task title…",
      durations: quickDurations(this.plugin.settings.quickDurationsMin),
      projects: this.collectProjectNames(),
      defaultDurationMin,
      onSubmit: (title, durationMin, project) => {
        const newLine = buildTaskLine(title, prefixes, {
          startMin,
          durationMin,
          project,
        });
        void this.appendTaskAfterLast(file, newLine);
      },
    }).open();
  }

  private createUnscheduledTask(file: TFile): void {
    const prefixes = this.plugin.settings.prefixes;
    new TitlePromptModal(this.app, {
      heading: "New unscheduled task",
      placeholder: "Task title…",
      durations: quickDurations(this.plugin.settings.quickDurationsMin),
      projects: this.collectProjectNames(),
      defaultDurationMin: this.plugin.settings.defaultDurationMin,
      onSubmit: (title, durationMin, project) => {
        const newLine = buildTaskLine(title, prefixes, { durationMin, project });
        void this.appendTaskAfterLast(file, newLine);
      },
    }).open();
  }

  private async appendTaskAfterLast(
    file: TFile,
    newLine: string,
  ): Promise<void> {
    await this.app.vault.process(file, (content) => {
      const lines = content.split("\n");
      const lastIdx = findLastTaskLine(content);
      const insertAt = lastIdx === -1 ? lines.length : lastIdx + 1;
      lines.splice(insertAt, 0, newLine);
      return lines.join("\n");
    });
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
    const ctx = this.findContextTag(block.task);
    const projectColor = block.task.project
      ? colorMap.get(block.task.project)
      : null;
    // Context-tag color overrides the project color so a meeting/walk visibly
    // pops on top of an otherwise-uniform project palette.
    const color = ctx?.color ?? projectColor ?? null;
    if (color) {
      el.style.setProperty("--dp-color", color);
      el.style.setProperty("--dp-on-color", contrastingTextColor(color));
      el.addClass("has-project-color");
    }
    el.draggable = true;

    const row = el.createDiv({ cls: "dp-block-row" });
    if (ctx?.icon) {
      const ctxIcon = row.createSpan({ cls: "dp-block-context-icon" });
      setIcon(ctxIcon, ctx.icon);
      ctxIcon.setAttribute("aria-label", `#${ctx.tag}`);
    }
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
      const projWrap = row.createSpan({ cls: "dp-block-project-wrap" });
      const projIcon = this.resolveProjectIcon(block.task.project);
      if (projIcon) {
        const ic = projWrap.createSpan({ cls: "dp-block-project-icon" });
        setIcon(ic, projIcon);
      }
      projWrap.createSpan({ cls: "dp-block-project", text: block.task.project });
      if (block.task.subproject) {
        projWrap.createSpan({
          cls: "dp-block-subproject",
          text: `/${block.task.subproject}`,
        });
      }
      row.createSpan({ cls: "dp-block-sep", text: "·" });
    }
    const titleText = row.createSpan({
      cls: "dp-block-text",
      text: this.cleanBody(block.task.body),
    });
    // Only the title text toggles the parent task. Clicks elsewhere in the
    // header row (time, project, empty space) fall through to the block's
    // own click handler, which opens the edit modal.
    titleText.addEventListener("click", (ev) => {
      ev.stopPropagation();
      void this.applyLineChecked(
        file,
        block.task.lineNumber,
        !block.task.checked,
      );
    });
    titleText.addEventListener("pointerdown", (ev) => ev.stopPropagation());
    titleText.addEventListener("mousedown", (ev) => ev.stopPropagation());
    titleText.addEventListener("dragstart", (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
    });

    // Description (inline `{…}`) sits below the title and above sub-tasks,
    // styled at the same scale as a sub-task row.
    if (block.task.description && block.heightPx >= 36) {
      el.createDiv({
        cls: "dp-block-description",
        text: block.task.description,
      });
    }

    // Show sub-tasks inside the block if there's enough vertical room. The
    // header row consumes ~22px, and each sub-task row is ~16px — we need
    // at least one full sub-task row (and a little breathing room) before
    // we bother rendering. Excess rows are clipped by overflow:hidden.
    if (block.task.subtasks.length > 0 && block.heightPx >= 44) {
      const subList = el.createDiv({ cls: "dp-block-subtasks" });
      block.task.subtasks.forEach((sub) => {
        const subRow = subList.createDiv({ cls: "dp-block-subtask" });
        if (sub.checked) subRow.addClass("is-done");
        const text = subRow.createSpan({
          cls: "dp-block-subtask-text",
          text: sub.text,
        });
        // Clicking the text toggles the sub-task. Anywhere else on the
        // block falls through to the block's own click handler, which
        // opens the edit modal.
        text.addEventListener("click", (ev) => {
          ev.stopPropagation();
          void this.applyLineChecked(file, sub.lineNumber, !sub.checked);
        });
        // Don't let a press on the text initiate the block's drag.
        text.addEventListener("pointerdown", (ev) => ev.stopPropagation());
        text.addEventListener("mousedown", (ev) => ev.stopPropagation());
        text.addEventListener("dragstart", (ev) => {
          ev.preventDefault();
          ev.stopPropagation();
        });
      });
    }

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
    el.addEventListener("click", () => this.openTaskEditor(file, block.task));

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
          `${this.fmtClock(start)}–${this.fmtClock(start + pendingDuration)} (${formatTotal(pendingDuration)})`;
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
      // Swallow the click the browser fires after pointerup so it doesn't
      // bubble to the block and open the editor modal.
      const suppressClick = (ev: MouseEvent) => ev.stopPropagation();
      blockEl.addEventListener("click", suppressClick, { capture: true });
      window.setTimeout(
        () => blockEl.removeEventListener("click", suppressClick, true),
        0,
      );
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
    if (Platform.isMobile && this.unscheduledCollapsed) {
      list.addClass("is-collapsed");
    }
    const head = list.createDiv({ cls: "dp-unscheduled-head" });
    if (Platform.isMobile) {
      const toggleBtn = head.createEl("button", {
        cls: "dp-unscheduled-toggle",
        attr: {
          "aria-label": this.unscheduledCollapsed
            ? "Expand unscheduled"
            : "Collapse unscheduled",
          "aria-expanded": this.unscheduledCollapsed ? "false" : "true",
        },
      });
      setIcon(
        toggleBtn,
        this.unscheduledCollapsed ? "chevron-up" : "chevron-down",
      );
      toggleBtn.addEventListener("click", (ev) => {
        ev.stopPropagation();
        this.unscheduledCollapsed = !this.unscheduledCollapsed;
        this.scheduleRender();
      });
    }
    head.createSpan({ cls: "dp-unscheduled-title", text: "Unscheduled" });
    if (Platform.isMobile && unscheduled.length > 0) {
      head.createSpan({
        cls: "dp-unscheduled-count",
        text: String(unscheduled.length),
      });
    }
    const addBtn = head.createEl("button", {
      cls: "dp-unscheduled-add",
      attr: { "aria-label": "Add unscheduled task" },
    });
    setIcon(addBtn, "plus");
    addBtn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      if (Platform.isMobile && this.unscheduledCollapsed) {
        this.unscheduledCollapsed = false;
      }
      void this.createUnscheduledTask(file);
    });

    const body = list.createDiv({ cls: "dp-unscheduled-body" });

    if (unscheduled.length === 0) {
      body.createDiv({ cls: "dp-empty", text: "No unscheduled tasks." });
    }

    unscheduled.forEach((task, idx) => {
      const card = body.createDiv({ cls: "dp-card" });
      if (task.checked) card.addClass("is-done");
      if (!task.hasExplicitDuration) card.addClass("is-implicit-duration");
      const ctx = this.findContextTag(task);
      const projectColor = task.project ? colorMap.get(task.project) : null;
      const color = ctx?.color ?? projectColor ?? null;
      if (color) {
        card.style.setProperty("--dp-color", color);
        card.addClass("has-project-color");
      }
      card.draggable = true;
      const meta = card.createDiv({ cls: "dp-card-meta" });
      if (ctx?.icon) {
        const ctxIcon = meta.createSpan({ cls: "dp-card-context-icon" });
        setIcon(ctxIcon, ctx.icon);
        ctxIcon.setAttribute("aria-label", `#${ctx.tag}`);
      }
      if (!task.hasExplicitDuration) {
        const warn = meta.createSpan({ cls: "dp-warn" });
        setIcon(warn, "alert-triangle");
        warn.setAttribute("aria-label", "No #d/ tag — using default duration");
      }
      meta.createSpan({ text: formatTotal(task.durationMin) });
      if (task.project) {
        const projGroup = card.createSpan({ cls: "dp-card-project-wrap" });
        const projIcon = this.resolveProjectIcon(task.project);
        if (projIcon) {
          const ic = projGroup.createSpan({ cls: "dp-card-project-icon" });
          setIcon(ic, projIcon);
        }
        projGroup.createSpan({ cls: "dp-card-project", text: task.project });
        if (task.subproject) {
          projGroup.createSpan({
            cls: "dp-card-subproject",
            text: `/${task.subproject}`,
          });
        }
      }
      const textCol = card.createDiv({ cls: "dp-card-text-col" });
      const text = textCol.createDiv({ cls: "dp-card-text" });
      text.textContent = this.cleanBody(task.body);
      if (task.description) {
        textCol.createDiv({
          cls: "dp-card-description",
          text: task.description,
        });
      }

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
      card.addEventListener("click", () => this.openTaskEditor(file, task));
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

    await this.app.vault.process(file, (content) => {
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
      return dirty ? lines.join("\n") : content;
    });
  }

  private async editLine(
    payload: DragPayload,
    transform: (line: string) => string,
  ): Promise<void> {
    const file = this.app.vault.getAbstractFileByPath(payload.filePath);
    if (!(file instanceof TFile)) {
      new Notice("Today: source file no longer exists.");
      this.scheduleRender();
      return;
    }
    let stale = false;
    await this.app.vault.process(file, (content) => {
      const lines = content.split("\n");
      const idx = payload.lineNumber;
      if (idx < 0 || idx >= lines.length || lines[idx] !== payload.rawLine) {
        stale = true;
        return content;
      }
      const next = transform(lines[idx]);
      if (next === lines[idx]) return content;
      lines[idx] = next;
      return lines.join("\n");
    });
    if (stale) {
      new Notice("Today: file changed since last render — refreshing.");
      this.scheduleRender();
    }
  }

  private formatHourLabel(h: number): string {
    const ampm = h < 12 || h === 24 ? "a" : "p";
    let h12 = h % 12;
    if (h12 === 0) h12 = 12;
    return `${h12}${ampm}`;
  }

  private renderTimeTable(
    parent: HTMLElement,
    tasks: ParsedTask[],
  ): void {
    const settings = this.plugin.settings;
    const totals = computeTotals(tasks);
    const planned = totals.scheduledMin + totals.unscheduledMin;
    const workdayMin = Math.max(
      0,
      (settings.workEndHour - settings.workStartHour) * 60,
    );

    const scheduledTasks = tasks.filter((t) => t.startMin !== null);
    const wakeMin = settings.wakeHour * 60;
    const sleepMin = settings.sleepHour * 60;
    const workStartMin = settings.workStartHour * 60;
    const workEndMin = settings.workEndHour * 60;
    const workOpen = computeFreeMin(
      scheduledTasks,
      workStartMin,
      workEndMin,
    );
    const morningOpen = computeFreeMin(
      scheduledTasks,
      wakeMin,
      Math.min(workStartMin, sleepMin),
    );
    const eveningOpen = computeFreeMin(
      scheduledTasks,
      Math.max(workEndMin, wakeMin),
      sleepMin,
    );
    // Sleep = the slice of the 24h day outside the configured wake window.
    const sleepDurationMin = 24 * 60 - (sleepMin - wakeMin);

    const morningRange = `${this.formatHourLabel(settings.wakeHour)}-${this.formatHourLabel(settings.workStartHour)}`;
    const workRange = `${this.formatHourLabel(settings.workStartHour)}-${this.formatHourLabel(settings.workEndHour)}`;
    const eveningRange = `${this.formatHourLabel(settings.workEndHour)}-${this.formatHourLabel(settings.sleepHour)}`;

    const column = parent.createDiv({ cls: "dp-stat-col" });
    const table = column.createDiv({ cls: "dp-stat-table" });
    this.renderStatRow(table, "Scheduled", totals.scheduledMin, {
      kind: "scheduled",
    });
    this.renderStatRow(table, "Unscheduled", totals.unscheduledMin, {
      kind: "unscheduled",
    });
    if (planned > workdayMin) {
      this.renderStatRow(table, "Overbooked", planned - workdayMin);
      const cells = Array.from(table.children) as HTMLElement[];
      cells.slice(-2).forEach((el) => el.classList.add("dp-st-danger"));
    }

    const freeTotal = morningOpen + workOpen + eveningOpen;

    table.createDiv({ cls: "dp-st-row-divider" });
    this.renderStatRow(table, "Free Time", freeTotal, { kind: "free" });
    this.renderStatRow(table, `Morning (${morningRange})`, morningOpen, {
      indent: true,
    });
    this.renderStatRow(table, `Workday (${workRange})`, workOpen, {
      indent: true,
    });
    this.renderStatRow(table, `Evening (${eveningRange})`, eveningOpen, {
      indent: true,
    });
    this.renderStatRow(table, "Sleep", sleepDurationMin, { kind: "sleep" });

    this.renderDayDotGrid(column, {
      scheduledMin: totals.scheduledMin,
      unscheduledMin: totals.unscheduledMin,
      freeMin: freeTotal,
      sleepMin: sleepDurationMin,
    });
  }

  private renderDayDotGrid(
    parent: HTMLElement,
    parts: {
      scheduledMin: number;
      unscheduledMin: number;
      freeMin: number;
      sleepMin: number;
    },
  ): void {
    const TOTAL_DOTS = 96; // 24h at 15-minute granularity
    const MIN_PER_DOT = 1440 / TOTAL_DOTS;

    // Allocate dots in priority order so rounding never overflows the 24h grid.
    // Unscheduled visually consumes part of the free-time pool, since those
    // tasks still need to be slotted into the day.
    const order: Array<{ key: string; mins: number }> = [
      { key: "sleep", mins: parts.sleepMin },
      { key: "scheduled", mins: parts.scheduledMin },
      {
        key: "unscheduled",
        mins: Math.min(parts.unscheduledMin, parts.freeMin),
      },
      {
        key: "free",
        mins: Math.max(0, parts.freeMin - parts.unscheduledMin),
      },
    ];

    let used = 0;
    const counts: Record<string, number> = {
      sleep: 0,
      scheduled: 0,
      unscheduled: 0,
      free: 0,
    };
    for (let i = 0; i < order.length; i++) {
      const isLast = i === order.length - 1;
      const raw = order[i].mins / MIN_PER_DOT;
      const n = isLast
        ? Math.max(0, TOTAL_DOTS - used)
        : Math.min(TOTAL_DOTS - used, Math.round(raw));
      counts[order[i].key] = n;
      used += n;
    }

    const grid = parent.createDiv({ cls: "dp-day-grid" });
    const sequence: Array<["scheduled" | "unscheduled" | "free" | "sleep", number]> = [
      ["scheduled", counts.scheduled],
      ["unscheduled", counts.unscheduled],
      ["free", counts.free],
      ["sleep", counts.sleep],
    ];
    for (const [kind, n] of sequence) {
      for (let i = 0; i < n; i++) {
        grid.createSpan({ cls: `dp-day-dot dp-day-dot-${kind}` });
      }
    }
  }

  private renderStatRow(
    table: HTMLElement,
    label: string,
    mins: number,
    opts: {
      strong?: boolean;
      indent?: boolean;
      kind?: "scheduled" | "unscheduled" | "free" | "sleep";
    } = {},
  ): void {
    const nameClasses = ["dp-st-name"];
    const valueClasses = ["dp-st-value"];
    if (opts.strong) {
      nameClasses.push("dp-st-strong");
      valueClasses.push("dp-st-strong");
    }
    if (opts.indent) nameClasses.push("dp-st-indent");
    if (opts.kind) {
      const k = `dp-st-kind-${opts.kind}`;
      nameClasses.push(k);
      valueClasses.push(k);
    }
    table.createSpan({ cls: nameClasses.join(" "), text: label });
    table.createSpan({ cls: valueClasses.join(" "), text: formatTotal(mins) });
  }

  private renderProjectTable(
    parent: HTMLElement,
    tasks: ParsedTask[],
    colorMap: Map<string, string>,
  ): void {
    interface ProjectAgg {
      total: number;
      subs: Map<string, number>;
    }
    const projects = new Map<string, ProjectAgg>();
    let unassignedMin = 0;
    for (const t of tasks) {
      if (!t.project) {
        unassignedMin += t.durationMin;
        continue;
      }
      let agg = projects.get(t.project);
      if (!agg) {
        agg = { total: 0, subs: new Map() };
        projects.set(t.project, agg);
      }
      agg.total += t.durationMin;
      if (t.subproject) {
        agg.subs.set(
          t.subproject,
          (agg.subs.get(t.subproject) ?? 0) + t.durationMin,
        );
      }
    }
    if (projects.size === 0 && unassignedMin === 0) return;
    const sorted = [...projects.entries()].sort(
      (a, b) => b[1].total - a[1].total || a[0].localeCompare(b[0]),
    );

    const table = parent.createDiv({ cls: "dp-stat-table" });
    table.createSpan({ cls: "dp-st-h", text: "Project" });
    table.createSpan({ cls: "dp-st-h dp-st-h-right", text: "Planned" });
    for (const [name, agg] of sorted) {
      const nameCell = table.createDiv({ cls: "dp-st-name" });
      const swatch = nameCell.createSpan({ cls: "dp-st-swatch" });
      const color = colorMap.get(name);
      if (color) swatch.style.backgroundColor = color;
      const projIconName = this.resolveProjectIcon(name);
      if (projIconName) {
        const ic = nameCell.createSpan({ cls: "dp-st-project-icon" });
        setIcon(ic, projIconName);
      }
      nameCell.createSpan({ text: name });
      if (agg.subs.size > 0) {
        const subs = [...agg.subs.entries()].sort(
          (a, b) => b[1] - a[1] || a[0].localeCompare(b[0]),
        );
        const breakdown = subs
          .map(([sub, mins]) => `${sub} ${formatCompactDuration(mins)}`)
          .join(", ");
        nameCell.createSpan({
          cls: "dp-st-subprojects",
          text: ` (${breakdown})`,
        });
      }
      table.createSpan({ cls: "dp-st-value", text: formatTotal(agg.total) });
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
    return `${this.fmtClock(start)}–${this.fmtClock(end)} (${formatTotal(task.durationMin)})`;
  }

  private positionNowLine(el: HTMLElement): void {
    const startMin = Number(el.dataset.startMin);
    const endMin = Number(el.dataset.endMin);
    const pxPerMin = Number(el.dataset.pxPerMin);
    const now = nowMinutes();
    if (now < startMin || now > endMin) {
      el.style.display = "none";
      return;
    }
    el.style.display = "";
    el.style.top = `${(now - startMin) * pxPerMin}px`;
  }

  private refreshNowLines(): void {
    const lines = this.containerEl.querySelectorAll<HTMLElement>(".dp-now-line");
    lines.forEach((el) => this.positionNowLine(el));
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
    let out = body
      .replace(new RegExp(`#${p.duration}\\/\\S+`, "g"), "")
      .replace(new RegExp(`#${p.time}\\/\\S+`, "g"), "")
      .replace(new RegExp(`#${p.order}\\/\\d+`, "g"), "")
      .replace(new RegExp(`#${p.project}\\/[\\w-]+(?:\\/[\\w-]+)?`, "g"), "")
      .replace(new RegExp(`#${p.exercise}\\/\\S+`, "g"), "")
      .replace(/\{[^{}]*\}/g, "");
    for (const ctx of this.plugin.settings.contextTags) {
      const tag = ctx.tag?.trim();
      if (!tag) continue;
      const esc = tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      out = out.replace(new RegExp(`#${esc}(?![\\w/-])`, "gi"), "");
    }
    return out.replace(/\s+/g, " ").trim();
  }

  // Returns the first configured context tag whose `#<tag>` appears in the
  // task body, matching whole-tag (not as a prefix of another tag). Order
  // follows the user's settings list so they can prioritise.
  private findContextTag(task: ParsedTask): ContextTag | null {
    const tags = this.plugin.settings.contextTags;
    if (!tags || tags.length === 0) return null;
    for (const ctx of tags) {
      const tag = ctx.tag?.trim();
      if (!tag) continue;
      const esc = tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      if (new RegExp(`#${esc}(?![\\w/-])`, "i").test(task.body)) return ctx;
    }
    return null;
  }

  private resolveProjectIcon(project: string | null): string | null {
    if (!project) return null;
    for (const pc of this.plugin.settings.projectColors) {
      if (
        pc.icon &&
        pc.project?.toLowerCase() === project.toLowerCase()
      ) {
        return pc.icon;
      }
    }
    return null;
  }

  private endOfTitleCh(rawLine: string): number {
    const p = this.plugin.settings.prefixes;
    const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(
      `#(?:${esc(p.duration)}|${esc(p.time)}|${esc(p.order)}|${esc(p.project)}|${esc(p.exercise)})\\/`,
    );
    const m = re.exec(rawLine);
    const cutoff = m ? m.index : rawLine.length;
    let end = cutoff;
    while (end > 0 && /\s/.test(rawLine[end - 1])) end--;
    return end;
  }

  private openTaskEditor(file: TFile, task: ParsedTask): void {
    new TaskEditModal(this.app, {
      initialTitle: this.cleanBody(task.body),
      initialDescription: task.description ?? "",
      initialDurationMin: task.durationMin,
      initialProject: task.project,
      initialChecked: task.checked,
      subtasks: task.subtasks,
      projects: this.collectProjectNames(),
      durations: quickDurations(this.plugin.settings.quickDurationsMin),
      onSave: (title, description, durationMin, project, checked) => {
        void this.applyTaskEdit(
          file,
          task,
          title,
          description,
          durationMin,
          project,
          checked,
        );
      },
      onToggleSubtask: async (sub, checked) => {
        await this.applyLineChecked(file, sub.lineNumber, checked);
      },
      onAddSubtask: async (text) => {
        return await this.appendSubtask(file, task, text);
      },
      onShowInNote: () => {
        void this.openLine(file, task.lineNumber, this.endOfTitleCh(task.rawLine));
      },
      onMoveToTomorrow: () => this.moveTaskToTomorrow(file, task),
    }).open();
  }

  // Moves a task line (and its sub-task lines) from `file` to tomorrow's daily
  // note. Tomorrow is computed relative to the day currently being viewed.
  // No-op if tomorrow's daily note doesn't exist. Returns true on success.
  private async moveTaskToTomorrow(
    file: TFile,
    task: ParsedTask,
  ): Promise<boolean> {
    const fallback = {
      folder: this.plugin.settings.dailyNoteFolderFallback,
      format: this.plugin.settings.dailyNoteFormatFallback,
      template: this.plugin.settings.dailyNoteTemplate,
    };
    const target = addDays(this.selectedDate, 1);
    const targetFile = await ensureDailyNote(this.app, target, fallback);
    if (targetFile.path === file.path) {
      new Notice("Source and target are the same file.");
      return false;
    }

    // Snapshot the lines to move (parent + sub-tasks) from the source file
    // and remove them in one process pass. Highest indices first so the
    // earlier ones stay valid as we splice.
    const lineNumbers = [task.lineNumber, ...task.subtasks.map((s) => s.lineNumber)]
      .sort((a, b) => a - b);
    let movedLines: string[] = [];
    await this.app.vault.process(file, (content) => {
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
      new Notice("Today: nothing to move.");
      return false;
    }

    await this.app.vault.process(targetFile, (content) => {
      const lines = content.split("\n");
      const lastIdx = findLastTaskLine(content);
      const insertAt = lastIdx === -1 ? lines.length : lastIdx + 1;
      lines.splice(insertAt, 0, ...movedLines);
      return lines.join("\n");
    });

    new Notice(`Moved to ${targetFile.path}`);
    return true;
  }

  // Inserts a new sub-task line below the parent's existing sub-tasks (or
  // directly below the parent if none exist). Re-parses on each call so
  // line numbers stay correct across multiple additions in one session.
  private async appendSubtask(
    file: TFile,
    task: ParsedTask,
    text: string,
  ): Promise<ParsedSubtask | null> {
    const trimmed = text.trim();
    if (!trimmed) return null;
    let inserted: ParsedSubtask | null = null;
    await this.app.vault.process(file, (content) => {
      const lines = content.split("\n");
      const fresh = parseFileTasks(
        file.path,
        content,
        this.plugin.settings.prefixes,
        this.plugin.settings.defaultDurationMin,
      ).find((t) => t.lineNumber === task.lineNumber);
      if (!fresh) return content;
      const insertAt =
        fresh.subtasks.length > 0
          ? fresh.subtasks[fresh.subtasks.length - 1].lineNumber + 1
          : fresh.lineNumber + 1;
      // Match the indent of any existing sub-task so we don't mix tabs and
      // spaces; otherwise add one tab beneath the parent's own indent.
      const subIndent =
        fresh.subtasks.length > 0
          ? (/^(\s*)/.exec(fresh.subtasks[fresh.subtasks.length - 1].rawLine)?.[1] ?? fresh.indent + "\t")
          : fresh.indent + "\t";
      const newLine = `${subIndent}- [ ] ${trimmed}`;
      lines.splice(insertAt, 0, newLine);
      inserted = {
        lineNumber: insertAt,
        rawLine: newLine,
        text: trimmed,
        checked: false,
      };
      return lines.join("\n");
    });
    return inserted;
  }

  private collectProjectNames(): string[] {
    const prefix = `#${this.plugin.settings.prefixes.project}/`.toLowerCase();
    const names = new Set<string>();
    const cache = this.app.metadataCache as unknown as {
      getTags?: () => Record<string, number>;
    };
    const tags = cache.getTags?.() ?? {};
    for (const tag of Object.keys(tags)) {
      if (tag.toLowerCase().startsWith(prefix)) {
        const name = tag.slice(prefix.length);
        if (name) names.add(name);
      }
    }
    for (const pc of this.plugin.settings.projectColors) {
      if (pc.project) names.add(pc.project);
    }
    return Array.from(names).sort((a, b) => a.localeCompare(b));
  }

  private async applyTaskEdit(
    file: TFile,
    task: ParsedTask,
    newTitle: string,
    // null = leave the description untouched
    newDescription: string | null,
    newDurationMin: number | null,
    // undefined = leave the project tag alone, "" = remove it, otherwise set
    newProject: string | null | undefined,
    newChecked: boolean | null,
  ): Promise<void> {
    const prefixes = this.plugin.settings.prefixes;
    await this.app.vault.process(file, (content) => {
      const lines = content.split("\n");
      if (task.lineNumber >= lines.length) return content;
      let updated = setTaskTitle(lines[task.lineNumber], newTitle, prefixes);
      if (newDescription !== null) {
        updated = setTaskDescription(updated, newDescription, prefixes);
      }
      if (newDurationMin !== null) {
        updated = setDurationTag(updated, newDurationMin, prefixes);
      }
      if (newProject !== undefined) {
        updated = newProject
          ? setProjectTag(updated, newProject, prefixes)
          : removeProjectTag(updated, prefixes);
      }
      if (newChecked !== null) {
        updated = setTaskChecked(updated, newChecked);
      }
      lines[task.lineNumber] = updated;
      return lines.join("\n");
    });
  }

  private async applyLineChecked(
    file: TFile,
    lineNumber: number,
    checked: boolean,
  ): Promise<void> {
    await this.app.vault.process(file, (content) => {
      const lines = content.split("\n");
      if (lineNumber >= lines.length) return content;
      lines[lineNumber] = setTaskChecked(lines[lineNumber], checked);
      return lines.join("\n");
    });
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

interface TitlePromptOpts {
  heading: string;
  placeholder: string;
  defaultDurationMin: number;
  // If provided, the modal advances to a duration-picker step after the title
  // is entered. If omitted, the title submit fires onSubmit with
  // defaultDurationMin immediately and no project.
  durations?: { label: string; min: number }[];
  projects?: string[];
  onSubmit: (
    title: string,
    durationMin: number,
    project: string | null,
  ) => void;
}

class TitlePromptModal extends Modal {
  private opts: TitlePromptOpts;
  private datalistId: string;

  constructor(app: App, opts: TitlePromptOpts) {
    super(app);
    this.opts = opts;
    this.datalistId = `dp-projects-${Math.random().toString(36).slice(2, 9)}`;
  }

  onOpen(): void {
    this.modalEl.addClass("dp-title-modal");
    this.titleEl.setText(this.opts.heading);
    this.renderTitleStep();
  }

  private renderTitleStep(): void {
    this.contentEl.empty();
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
        if (this.opts.durations && this.opts.durations.length > 0) {
          this.renderDurationStep(title);
        } else {
          this.opts.onSubmit(title, this.opts.defaultDurationMin, null);
          this.close();
        }
      }
      // Escape is handled by Modal's default close behavior — no task created.
    });
  }

  private renderDurationStep(title: string): void {
    this.contentEl.empty();
    const summary = this.contentEl.createDiv({ cls: "dp-prompt-summary" });
    summary.createSpan({ cls: "dp-prompt-summary-label", text: "Task" });
    summary.createSpan({
      cls: "dp-prompt-summary-value",
      text: title || "(untitled)",
    });

    const projLabel = this.contentEl.createDiv({
      cls: "dp-prompt-step-label",
      text: "Project",
    });
    projLabel.setAttribute("aria-hidden", "true");

    const projRow = this.contentEl.createDiv({ cls: "dp-project-row" });
    const projInput = projRow.createEl("input", {
      type: "text",
      cls: "dp-project-input",
      attr: {
        placeholder: "(none)",
        list: this.datalistId,
        autocomplete: "off",
      },
    });
    const datalist = projRow.createEl("datalist");
    datalist.id = this.datalistId;
    (this.opts.projects ?? []).forEach((name) => {
      datalist.createEl("option", { attr: { value: name } });
    });
    const clearBtn = projRow.createEl("button", {
      cls: "dp-project-clear",
      attr: { "aria-label": "Clear project" },
    });
    clearBtn.type = "button";
    clearBtn.setText("×");
    clearBtn.addEventListener("click", () => {
      projInput.value = "";
      projInput.focus();
    });

    const durLabel = this.contentEl.createDiv({
      cls: "dp-prompt-step-label",
      text: "How long?",
    });
    durLabel.setAttribute("aria-hidden", "true");

    const row = this.contentEl.createDiv({ cls: "dp-duration-row" });
    const durations = this.opts.durations ?? [];
    const buttons: HTMLButtonElement[] = [];

    const resolveProject = (): string | null => {
      const raw = projInput.value.trim();
      if (!raw) return null;
      return sanitizeProjectName(raw) || null;
    };

    durations.forEach((d, idx) => {
      const btn = row.createEl("button", {
        cls: "dp-duration-btn",
        text: d.label,
      });
      btn.type = "button";
      btn.setAttribute("aria-label", `${d.label} (${idx + 1})`);
      btn.addEventListener("click", () => {
        this.opts.onSubmit(title, d.min, resolveProject());
        this.close();
      });
      buttons.push(btn);
    });

    // Enter on the project input commits the typed/selected project and
    // moves focus to the duration row so the user can press 1/2/3 next.
    projInput.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter") {
        ev.preventDefault();
        projInput.blur();
        buttons[0]?.focus();
      }
    });

    // Number-key shortcuts: 1 → first option, 2 → second, etc.
    // Suppressed while the project input is focused so digits typed there
    // (e.g. a project named "v2") aren't swallowed.
    durations.forEach((d, idx) => {
      this.scope.register([], `${idx + 1}`, (ev) => {
        if (document.activeElement === projInput) return;
        ev.preventDefault();
        this.opts.onSubmit(title, d.min, resolveProject());
        this.close();
        return false;
      });
    });

    projInput.focus();
  }

  onClose(): void {
    this.contentEl.empty();
  }
}

interface TaskEditOpts {
  initialTitle: string;
  initialDescription: string;
  initialDurationMin: number;
  initialProject: string | null;
  initialChecked: boolean;
  subtasks: ParsedSubtask[];
  projects: string[];
  durations: { label: string; min: number }[];
  // durationMin is null when the user did not pick a new duration — leave the
  // existing #d/ tag (or its absence) alone.
  // description is null when unchanged; otherwise it's the new value (empty
  // string clears the {…} block).
  // project is undefined when unchanged; "" means remove the tag; otherwise set.
  // checked is null when unchanged.
  onSave: (
    title: string,
    description: string | null,
    durationMin: number | null,
    project: string | null | undefined,
    checked: boolean | null,
  ) => void;
  onToggleSubtask: (sub: ParsedSubtask, checked: boolean) => Promise<void>;
  onAddSubtask: (text: string) => Promise<ParsedSubtask | null>;
  onShowInNote: () => void;
  onMoveToTomorrow: () => Promise<boolean>;
}

// Project tags only allow [\w-]; replace anything else with dashes so users
// can type "My Project" and end up with #p/My-Project rather than a broken tag.
function sanitizeProjectName(raw: string): string {
  return raw
    .trim()
    .replace(/[^\w-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

class TaskEditModal extends Modal {
  private opts: TaskEditOpts;
  private selectedDurationMin: number;
  private durationChanged = false;
  private checked: boolean;
  private checkedChanged = false;
  private datalistId: string;

  constructor(app: App, opts: TaskEditOpts) {
    super(app);
    this.opts = opts;
    this.selectedDurationMin = opts.initialDurationMin;
    this.checked = opts.initialChecked;
    this.datalistId = `dp-projects-${Math.random().toString(36).slice(2, 9)}`;
  }

  onOpen(): void {
    this.modalEl.addClass("dp-title-modal");
    this.titleEl.setText("Edit task");
    this.contentEl.empty();

    const titleRow = this.contentEl.createDiv({ cls: "dp-edit-title-row" });
    const checkBox = titleRow.createSpan({
      cls: "dp-edit-check",
      attr: {
        role: "checkbox",
        tabindex: "0",
        "aria-label": "Mark task complete",
        "aria-checked": this.checked ? "true" : "false",
      },
    });
    if (this.checked) checkBox.addClass("is-checked");
    const toggleChecked = (): void => {
      this.checked = !this.checked;
      this.checkedChanged = true;
      checkBox.toggleClass("is-checked", this.checked);
      checkBox.setAttribute("aria-checked", this.checked ? "true" : "false");
    };
    checkBox.addEventListener("click", toggleChecked);
    checkBox.addEventListener("keydown", (ev) => {
      if (ev.key === " " || ev.key === "Enter") {
        ev.preventDefault();
        toggleChecked();
      }
    });

    const input = titleRow.createEl("input", {
      type: "text",
      cls: "dp-title-input",
      attr: { placeholder: "Task title…" },
    });
    input.value = this.opts.initialTitle;

    const descLabel = this.contentEl.createDiv({
      cls: "dp-prompt-step-label",
      text: "Description",
    });
    descLabel.setAttribute("aria-hidden", "true");

    const descInput = this.contentEl.createEl("textarea", {
      cls: "dp-description-input",
      attr: { placeholder: "Optional details…", rows: "2" },
    });
    descInput.value = this.opts.initialDescription;

    const projLabel = this.contentEl.createDiv({
      cls: "dp-prompt-step-label",
      text: "Project",
    });
    projLabel.setAttribute("aria-hidden", "true");

    const projRow = this.contentEl.createDiv({ cls: "dp-project-row" });
    const projInput = projRow.createEl("input", {
      type: "text",
      cls: "dp-project-input",
      attr: {
        placeholder: "(none)",
        list: this.datalistId,
        autocomplete: "off",
      },
    });
    projInput.value = this.opts.initialProject ?? "";
    const datalist = projRow.createEl("datalist");
    datalist.id = this.datalistId;
    this.opts.projects.forEach((name) => {
      datalist.createEl("option", { attr: { value: name } });
    });
    const clearBtn = projRow.createEl("button", {
      cls: "dp-project-clear",
      attr: { "aria-label": "Clear project" },
    });
    clearBtn.type = "button";
    clearBtn.setText("×");
    clearBtn.addEventListener("click", () => {
      projInput.value = "";
      projInput.focus();
    });

    const durLabel = this.contentEl.createDiv({
      cls: "dp-prompt-step-label",
      text: "Duration",
    });
    durLabel.setAttribute("aria-hidden", "true");

    const row = this.contentEl.createDiv({ cls: "dp-duration-row" });
    const buttons: HTMLButtonElement[] = [];
    this.opts.durations.forEach((d) => {
      const btn = row.createEl("button", {
        cls: "dp-duration-btn",
        text: d.label,
      });
      btn.type = "button";
      if (d.min === this.selectedDurationMin) btn.addClass("is-selected");
      btn.addEventListener("click", () => {
        this.selectedDurationMin = d.min;
        this.durationChanged = true;
        buttons.forEach((b) => b.removeClass("is-selected"));
        btn.addClass("is-selected");
      });
      buttons.push(btn);
    });

    const resolveProject = (): string | null | undefined => {
      const raw = projInput.value.trim();
      const initial = this.opts.initialProject ?? "";
      if (raw === initial) return undefined;
      if (!raw) return "";
      return sanitizeProjectName(raw) || undefined;
    };

    const resolveDescription = (): string | null => {
      // Task lines are single-line markdown; collapse any newlines the user
      // typed into spaces so we never write a broken line back to the file.
      const raw = descInput.value.replace(/\s+/g, " ").trim();
      if (raw === this.opts.initialDescription.trim()) return null;
      return raw;
    };

    const submit = (): void => {
      this.opts.onSave(
        input.value.trim(),
        resolveDescription(),
        this.durationChanged ? this.selectedDurationMin : null,
        resolveProject(),
        this.checkedChanged ? this.checked : null,
      );
      this.close();
    };

    const enterToSubmit = (ev: KeyboardEvent): void => {
      if (ev.key === "Enter") {
        ev.preventDefault();
        submit();
      }
    };
    input.addEventListener("keydown", enterToSubmit);
    projInput.addEventListener("keydown", enterToSubmit);
    // Cmd/Ctrl+Enter submits from the description textarea so plain Enter
    // can still create newlines inside the description.
    descInput.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter" && (ev.metaKey || ev.ctrlKey)) {
        ev.preventDefault();
        submit();
      }
    });

    const subLabel = this.contentEl.createDiv({
      cls: "dp-prompt-step-label",
      text: "Sub-tasks",
    });
    subLabel.setAttribute("aria-hidden", "true");
    const list = this.contentEl.createDiv({ cls: "dp-edit-subtasks" });

    const renderSubtask = (sub: ParsedSubtask): void => {
      let checked = sub.checked;
      const row = list.createDiv({ cls: "dp-edit-subtask" });
      if (checked) row.addClass("is-done");
      const box = row.createSpan({ cls: "dp-edit-check" });
      if (checked) box.addClass("is-checked");
      row.createSpan({
        cls: "dp-edit-subtask-text",
        text: sub.text,
      });
      row.addEventListener("click", () => {
        checked = !checked;
        row.toggleClass("is-done", checked);
        box.toggleClass("is-checked", checked);
        void this.opts.onToggleSubtask(sub, checked);
      });
    };

    this.opts.subtasks.forEach(renderSubtask);

    const addRow = this.contentEl.createDiv({ cls: "dp-edit-subtask-add" });
    const addInput = addRow.createEl("input", {
      type: "text",
      cls: "dp-edit-subtask-input",
      attr: { placeholder: "New sub-task…" },
    });
    const addBtn = addRow.createEl("button", {
      cls: "dp-edit-subtask-add-btn",
      text: "Add",
    });
    addBtn.type = "button";
    const submitNewSubtask = async (): Promise<void> => {
      const text = addInput.value.trim();
      if (!text) return;
      addInput.disabled = true;
      addBtn.disabled = true;
      const sub = await this.opts.onAddSubtask(text);
      addInput.disabled = false;
      addBtn.disabled = false;
      if (sub) {
        renderSubtask(sub);
        addInput.value = "";
      }
      addInput.focus();
    };
    addBtn.addEventListener("click", () => {
      void submitNewSubtask();
    });
    addInput.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter") {
        ev.preventDefault();
        void submitNewSubtask();
      }
    });

    const actions = this.contentEl.createDiv({ cls: "dp-edit-actions" });
    const showBtn = actions.createEl("button", {
      cls: "dp-edit-show-btn",
      text: "Show in note",
    });
    showBtn.type = "button";
    showBtn.addEventListener("click", () => {
      this.close();
      this.opts.onShowInNote();
    });

    const moveBtn = actions.createEl("button", {
      cls: "dp-edit-show-btn",
      text: "Move to tomorrow",
    });
    moveBtn.type = "button";
    moveBtn.addEventListener("click", async () => {
      moveBtn.disabled = true;
      const moved = await this.opts.onMoveToTomorrow();
      if (moved) this.close();
      else moveBtn.disabled = false;
    });

    const saveBtn = actions.createEl("button", {
      cls: "dp-edit-save-btn mod-cta",
      text: "Save",
    });
    saveBtn.type = "button";
    saveBtn.addEventListener("click", submit);

    input.focus();
    input.select();
  }

  onClose(): void {
    this.contentEl.empty();
  }
}
