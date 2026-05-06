import {
  ItemView,
  WorkspaceLeaf,
  TFile,
  Notice,
  Modal,
  App,
  Platform,
  setIcon,
  moment,
} from "obsidian";
import { parseTimelineHeight } from "./settings";
import type TodayPlugin from "./main";
import {
  ParsedTask,
  ParsedSubtask,
  ExerciseSummary,
  TagPrefixes,
  parseFileTasks,
  parseExercises,
  parseIntention,
  parseTime,
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
  addActualTimeTag,
  setTaskIdTag,
  parseTaskId,
  generateTaskId,
  snapToInterval,
  formatTotal,
  formatCompactDuration,
  parseCompactDuration,
  formatClockShort,
  buildTimeOptions,
  timeDisplayToTagBody,
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
import {
  resolveProjectColors,
  getTaskColor,
  contrastingTextColor,
  ContextTag,
} from "./colors";
import {
  resolveDailyNote,
  ensureDailyNote,
  addDays,
  addMonths,
  startOfMonth,
  endOfMonth,
  sameDay,
  startOfDay,
  buildDateSuggestions,
  buildDateLinkInsert,
} from "./dailyNote";
import type { DailyNoteFallback } from "./dailyNote";
import {
  Habit,
  HabitPeriod,
  parseHabitsFile,
  findHabitTaskLines,
  toggleHabitOnContent,
  weekRange,
  monthRange,
  enumerateDailyNoteDatesInRange,
} from "./habits";

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

interface HabitDisplay {
  habit: Habit;
  // True when at least one `- [x]` task line containing the habit tag exists
  // in the relevant window (today's daily note for `day`, this week's notes
  // for `week`, this month's for `month`). Bare-tag-in-prose lines and
  // unchecked `- [ ]` lines are NOT enough — pre-templated planned-ahead
  // habits stay marked incomplete until the user actually checks them.
  isComplete: boolean;
  // True when at least one file in the window has 2+ task lines for this
  // habit. Cross-file repetition (a weekly habit tracked across multiple
  // days) is intentionally NOT a duplicate — only same-file dups warrant
  // attention.
  hasDuplicate: boolean;
  // Highest per-file task-line count across the window. Shown in the UI
  // next to the duplicate badge so the user knows how many copies to remove.
  maxPerFile: number;
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
  private pomodoroState: {
    filePath: string;
    taskLineNumber: number;
    taskBodySnapshot: string;
    startedAt: number;
    phase: "work" | "rest";
    paused: boolean;
    pausedRemainingMs: number | null;
    // Total work-phase ms banked from completed/paused work runs in the
    // current focus block. Live work since the last bank is added on demand
    // by bankWorkProgress().
    actualMs: number;
    // Within the current work phase, how many ms of elapsed work have already
    // been folded into actualMs. Resets to 0 when the work phase ends.
    workPhaseBankedMs: number;
  } | null = null;
  private pomodoroTickHandle: number | null = null;
  private pomodoroHidden: boolean = false;
  private pomodoroSubtaskHistory: number[] = [];

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
    const t = ev.target as HTMLElement | null;
    if (
      t &&
      (t.tagName === "INPUT" ||
        t.tagName === "TEXTAREA" ||
        t.isContentEditable)
    )
      return;

    const inPomo = this.pomodoroState !== null && !this.pomodoroHidden;

    if (ev.key === "p") {
      ev.preventDefault();
      if (this.isPopout()) void this.returnLeafToMain();
      else void this.popOutLeaf();
      return;
    }

    if (ev.key === "t" && this.pomodoroState !== null) {
      ev.preventDefault();
      this.pomodoroHidden = !this.pomodoroHidden;
      this.scheduleRender();
      return;
    }

    if (inPomo) {
      if (ev.key === "x") {
        ev.preventDefault();
        void this.exitPomodoroWithCommit();
        return;
      }
      if (ev.key === " ") {
        ev.preventDefault();
        this.togglePomodoroPause();
        return;
      }
      if (ev.key === "Enter") {
        ev.preventDefault();
        void this.advancePomodoroComplete();
        return;
      }
      if (ev.key === "z") {
        ev.preventDefault();
        void this.undoLastSubtask();
        return;
      }
      return;
    }

    if (ev.key === "h") {
      ev.preventDefault();
      void this.navigateTo(new Date());
      return;
    }
    if (ev.key === "c") {
      ev.preventDefault();
      this.calendarOpen = !this.calendarOpen;
      this.scheduleRender();
      return;
    }
    if (ev.key === "s") {
      ev.preventDefault();
      this.summariesCollapsed = !this.summariesCollapsed;
      this.scheduleRender();
      return;
    }

    if (ev.key !== "ArrowLeft" && ev.key !== "ArrowRight") return;
    ev.preventDefault();
    const delta = ev.key === "ArrowLeft" ? -1 : 1;
    void this.navigateTo(addDays(this.selectedDate, delta));
  }

  private togglePomodoroPause(): void {
    const state = this.pomodoroState;
    if (!state) return;
    const workMs = this.plugin.settings.pomodoroWorkMin * 60_000;
    const breakMs = this.plugin.settings.pomodoroBreakMin * 60_000;
    const phaseMs = state.phase === "work" ? workMs : breakMs;
    const expired =
      state.paused &&
      state.pausedRemainingMs !== null &&
      state.pausedRemainingMs <= 0;
    if (expired) {
      // Phase already ran to completion; ensure work time is banked before
      // we flip and clear the per-phase counter for the new phase.
      this.bankWorkProgress();
      state.phase = state.phase === "work" ? "rest" : "work";
      state.startedAt = Date.now();
      state.paused = false;
      state.pausedRemainingMs = null;
      state.workPhaseBankedMs = 0;
    } else if (state.paused) {
      const remain = state.pausedRemainingMs ?? phaseMs;
      state.startedAt = Date.now() - (phaseMs - remain);
      state.paused = false;
      state.pausedRemainingMs = null;
    } else {
      // Manual pause: capture work-phase progress before flipping the flag.
      this.bankWorkProgress();
      const elapsed = Date.now() - state.startedAt;
      state.paused = true;
      state.pausedRemainingMs = Math.max(0, phaseMs - elapsed);
    }
    this.scheduleRender();
  }

  // Enter-key behavior: check off the next unfinished subtask if there is one,
  // otherwise mark the parent task done and exit focus mode.
  private async advancePomodoroComplete(): Promise<void> {
    const state = this.pomodoroState;
    if (!state) return;
    const file = this.app.vault.getAbstractFileByPath(state.filePath);
    if (!(file instanceof TFile)) return;
    const content = await this.app.vault.read(file);
    const tasks = parseFileTasks(
      file.path,
      content,
      this.plugin.settings.prefixes,
      this.plugin.settings.defaultDurationMin,
    );
    let task = tasks.find((t) => t.lineNumber === state.taskLineNumber);
    if (!task || this.cleanBody(task.body) !== state.taskBodySnapshot) {
      task = tasks.find(
        (t) => this.cleanBody(t.body) === state.taskBodySnapshot,
      );
      if (task) state.taskLineNumber = task.lineNumber;
    }
    if (!task) {
      this.exitPomodoro();
      return;
    }
    const nextSub = task.subtasks.find((s) => !s.checked);
    if (nextSub) {
      this.pomodoroSubtaskHistory.push(nextSub.lineNumber);
      await this.commitActualTime(file, nextSub.lineNumber);
      await this.applyLineChecked(file, nextSub.lineNumber, true);
      this.scheduleRender();
      return;
    }
    await this.commitActualTime(file, task.lineNumber);
    await this.applyLineChecked(file, task.lineNumber, true);
    this.exitPomodoro();
  }

  private async undoLastSubtask(): Promise<void> {
    const lineNumber = this.pomodoroSubtaskHistory.pop();
    if (lineNumber === undefined) return;
    const state = this.pomodoroState;
    if (!state) return;
    const file = this.app.vault.getAbstractFileByPath(state.filePath);
    if (!(file instanceof TFile)) return;
    await this.applyLineChecked(file, lineNumber, false);
    this.scheduleRender();
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

    if (this.pomodoroState && !this.pomodoroHidden) {
      const handled = await this.renderPomodoro(root);
      if (handled) return;
    }

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
      dateLinkFormat: this.plugin.settings.dateLinkFormat,
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
    const intention = displayFile
      ? parseIntention(fileContent, this.plugin.settings.intentionTag)
      : null;

    const activeFile = this.app.workspace.getActiveFile();
    const showOpenActiveLink =
      activeFile !== null &&
      (!displayFile || activeFile.path !== displayFile.path);

    this.renderDateNav(root);

    const colorMap = resolveProjectColors(
      tasks.filter(
        (t): t is typeof t & { project: string } => t.project !== null,
      ),
      this.plugin.settings.projectColors,
    );

    const habitDisplays = await this.loadHabitDisplays(
      this.selectedDate,
      fileContent,
      fallback,
    );

    this.renderSection(
      root,
      this.formatDateLabel(this.selectedDate),
      displayPath,
      displayFile,
      displayPath,
      tasks,
      exercises,
      habitDisplays,
      true,
      colorMap,
      showOpenActiveLink ? activeFile : null,
      intention,
    );

    this.renderTimelineHints(root);

    root.scrollTop = prevRootScroll;
    const newTimelines = root.querySelectorAll<HTMLElement>(".dp-timeline-wrap");
    newTimelines.forEach((el, i) => {
      const prev = prevTimelineScrolls[i];
      if (prev !== undefined) el.scrollTop = prev;
    });
    this.hasRendered = true;
  }

  private renderTimelineHints(root: HTMLElement): void {
    const hints = root.createDiv({ cls: "dp-timeline-hints" });
    const addHint = (key: string, label: string): void => {
      const item = hints.createSpan({ cls: "dp-pomo-hint" });
      item.createEl("kbd", { cls: "dp-pomo-kbd", text: key });
      item.createSpan({ cls: "dp-pomo-hint-label", text: label });
    };
    addHint("←/→", "day");
    addHint("h", "today");
    addHint("c", "calendar");
    addHint("s", "summaries");
    if (this.pomodoroState !== null) addHint("t", "focus");
    addHint("p", this.isPopout() ? "return" : "pop out");
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

    const calBtn = nav.createEl("button", {
      cls: "dp-cal-btn",
      attr: { "aria-label": "Toggle calendar" },
    });
    setIcon(calBtn, "calendar");
    if (this.calendarOpen) calBtn.addClass("is-active");

    const label = nav.createDiv({ cls: "dp-datenav-label" });
    label.textContent = this.formatDateLabel(this.selectedDate);

    if (this.pomodoroState && this.pomodoroHidden) {
      const focusBtn = nav.createEl("button", {
        cls: "dp-nav-btn dp-pomo-resume",
        attr: { "aria-label": "Back to focus" },
      });
      setIcon(focusBtn, "timer");
      focusBtn.addEventListener("click", () => {
        this.pomodoroHidden = false;
        this.scheduleRender();
      });
    }

    const collapseBtn = nav.createEl("button", {
      cls: "dp-nav-btn",
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

    const popoutBtn = nav.createEl("button", {
      cls: "dp-nav-btn dp-popout-btn",
      attr: {
        "aria-label": this.isPopout()
          ? "Return to main window"
          : "Open in new window",
      },
    });
    setIcon(popoutBtn, this.isPopout() ? "monitor" : "picture-in-picture-2");
    popoutBtn.addEventListener("click", () => {
      if (this.isPopout()) void this.returnLeafToMain();
      else void this.popOutLeaf();
    });

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
      dateLinkFormat: this.plugin.settings.dateLinkFormat,
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
    habitDisplays: HabitDisplay[],
    isPrimary: boolean,
    colorMap: Map<string, string>,
    openActiveTarget: TFile | null = null,
    intention: string | null = null,
  ): void {
    const section = parent.createDiv({ cls: "dp-section" });
    if (this.summariesCollapsed) section.addClass("is-summaries-collapsed");

    const header = section.createDiv({ cls: "dp-header" });
    if (!isPrimary && title) header.createDiv({ cls: "dp-title", text: title });
    if (subtitle || openActiveTarget || intention) {
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
      if (intention) {
        if (subtitle) sub.createSpan({ cls: "dp-subtitle-sep", text: "•" });
        sub.createSpan({ cls: "dp-intention", text: intention });
      }
      if (openActiveTarget) {
        if (subtitle || intention)
          sub.createSpan({ cls: "dp-subtitle-sep", text: "•" });
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
      this.renderHabitsLine(header, habitDisplays, file);
    }

    // Notes are excluded from time / project totals — by definition they
    // don't block the calendar, so counting their durations would skew the
    // "scheduled minutes" figure.
    const nonNoteTasks = tasks.filter((t) => !this.isNoteTask(t));
    const statsRow = header.createDiv({ cls: "dp-stats-row" });
    this.renderTimeTable(statsRow, nonNoteTasks);
    this.renderProjectTable(statsRow, nonNoteTasks, colorMap);

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
    // Pull timed notes out of `scheduled` so they don't get laid out as
    // blocks; they render as gutter dots instead. Untimed notes fall through
    // to `unscheduled` and render as ordinary cards.
    const timedNotes = scheduled.filter((t) => this.isNoteTask(t));
    const blockTasks = scheduled.filter((t) => !this.isNoteTask(t));

    this.renderTimeline(body, file, blockTasks, timedNotes, colorMap);
    this.renderUnscheduled(body, file, unscheduled, colorMap);
  }

  private renderTimeline(
    parent: HTMLElement,
    file: TFile,
    scheduled: ParsedTask[],
    notes: ParsedTask[],
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

    if (notes.length > 0) {
      const notesLayer = timeline.createDiv({ cls: "dp-notes-layer" });
      for (const note of notes) {
        if (note.startMin === null) continue;
        if (note.startMin < startMin || note.startMin > endMin) continue;
        this.renderNoteStrip(
          notesLayer,
          file,
          note,
          (note.startMin - startMin) * settings.pxPerMin,
          colorMap,
        );
      }
    }

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
    this.openNewTaskModal(
      file,
      `New task at ${this.fmtClock(startMin)}`,
      defaultDurationMin,
      (title, description, durationMin, project) => {
        const body = description ? `${title} {${description}}` : title;
        return buildTaskLine(body, prefixes, {
          startMin,
          durationMin,
          project,
        });
      },
    );
  }

  private createUnscheduledTask(file: TFile): void {
    const prefixes = this.plugin.settings.prefixes;
    this.openNewTaskModal(
      file,
      "New unscheduled task",
      this.plugin.settings.defaultDurationMin,
      (title, description, durationMin, project) => {
        const body = description ? `${title} {${description}}` : title;
        return buildTaskLine(body, prefixes, {
          durationMin,
          project,
        });
      },
    );
  }

  private openNewTaskModal(
    file: TFile,
    modalTitle: string,
    defaultDurationMin: number,
    buildLine: (
      title: string,
      description: string | null,
      durationMin: number,
      project: string | null,
    ) => string,
  ): void {
    new TaskEditModal(this.app, {
      mode: "new",
      modalTitle,
      initialTitle: "",
      initialDescription: "",
      initialDurationMin: defaultDurationMin,
      initialProject: null,
      initialChecked: false,
      subtasks: [],
      projects: this.collectProjectNames(),
      durations: quickDurations(this.plugin.settings.quickDurationsMin),
      prefixes: this.plugin.settings.prefixes,
      projectTrigger: this.plugin.settings.autocomplete.projectTrigger,
      timeTrigger: this.plugin.settings.autocomplete.timeTrigger,
      durationTrigger: this.plugin.settings.autocomplete.durationTrigger,
      dateTrigger: this.plugin.settings.autocomplete.dateTrigger,
      dailyNoteFormat: this.plugin.settings.dailyNoteFormatFallback,
      dailyNoteFolder: this.plugin.settings.dailyNoteFolderFallback,
      dateLinkFormat: this.plugin.settings.dateLinkFormat,
      visibleStartHour: this.plugin.settings.visibleStartHour,
      visibleEndHour: this.plugin.settings.visibleEndHour,
      quickDurationsMin: this.plugin.settings.quickDurationsMin,
      cleanBody: (body) => this.cleanBody(body),
      onSave: (title, description, durationMin, project, _checked, extras) => {
        const proj =
          project === undefined || project === "" ? null : project;
        const dur = durationMin ?? defaultDurationMin;
        const newLine = buildLine(title, description, dur, proj);
        void this.appendTaskAfterLast(
          file,
          newLine,
          extras?.subtaskRawLines ?? [],
          extras?.postAction ?? "none",
        );
      },
    }).open();
  }

  private async appendTaskAfterLast(
    file: TFile,
    newLine: string,
    subtaskLines: string[] = [],
    postAction: NewTaskPostAction = "none",
  ): Promise<void> {
    let taskLineNumber = -1;
    await this.app.vault.process(file, (content) => {
      const lines = content.split("\n");
      const lastIdx = findLastTaskLine(content);
      const insertAt = lastIdx === -1 ? lines.length : lastIdx + 1;
      taskLineNumber = insertAt;
      lines.splice(insertAt, 0, newLine, ...subtaskLines);
      return lines.join("\n");
    });
    if (postAction === "none" || taskLineNumber < 0) return;
    if (postAction === "show") {
      void this.openLine(file, taskLineNumber, this.endOfTitleCh(newLine));
      return;
    }
    if (postAction === "pomodoro") {
      // Re-parse the file so we can hand enterPomodoro a real ParsedTask
      // (with the freshly assigned lineNumber and any sub-tasks attached).
      const content = await this.app.vault.read(file);
      const tasks = parseFileTasks(
        file.path,
        content,
        this.plugin.settings.prefixes,
        this.plugin.settings.defaultDurationMin,
      );
      const fresh = tasks.find((t) => t.lineNumber === taskLineNumber);
      if (fresh) this.enterPomodoro(file, fresh);
    }
  }

  // A timed note renders as a thin one-line block on the timeline at its
  // start time — a dot, the time, and the title, all visible inline. Click
  // opens the editor for the full description and editing UI. The strip
  // inherits the task's project / context color so notes group visually
  // with their project.
  private renderNoteStrip(
    layer: HTMLElement,
    file: TFile,
    note: ParsedTask,
    topPx: number,
    colorMap: Map<string, string>,
  ): void {
    const strip = layer.createDiv({ cls: "dp-note-strip" });
    if (note.checked) strip.addClass("is-done");
    strip.style.top = `${topPx}px`;

    const ctx = this.findContextTag(note);
    const projectColor = getTaskColor(note.project, note.subproject, colorMap);
    const color = ctx?.color ?? projectColor ?? null;
    if (color) strip.style.setProperty("--dp-color", color);

    strip.createSpan({ cls: "dp-note-strip-dot" });
    const timeText = note.hasExplicitDuration
      ? `${this.fmtClock(note.startMin!)}–${this.fmtClock(note.startMin! + note.durationMin)}`
      : this.fmtClock(note.startMin!);
    strip.createSpan({ cls: "dp-note-strip-time", text: timeText });
    strip.createSpan({
      cls: "dp-note-strip-title",
      text: this.cleanBody(note.body) || "(untitled)",
    });

    strip.addEventListener("click", (ev) => {
      ev.stopPropagation();
      this.openTaskEditor(file, note);
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
    const projectColor = getTaskColor(
      block.task.project,
      block.task.subproject,
      colorMap,
    );
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
      const prefixes = this.plugin.settings.prefixes;
      block.task.subtasks.forEach((sub) => {
        const subRow = subList.createDiv({ cls: "dp-block-subtask" });
        if (sub.checked) subRow.addClass("is-done");
        const text = subRow.createSpan({ cls: "dp-block-subtask-text" });
        const subMin = parseTime(sub.text, prefixes);
        if (subMin !== null) {
          // Show the parsed time (e.g. "6:25p") instead of the raw `#t/625p`
          // tag — `cleanBody` strips the tag, so the rest of the body
          // renders cleanly after the chip.
          text.createSpan({
            cls: "dp-block-subtask-time",
            text: this.fmtClock(subMin),
          });
          const body = this.cleanBody(sub.text);
          if (body) text.appendText(" " + body);
        } else {
          text.setText(this.cleanBody(sub.text));
        }
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
      const projectColor = getTaskColor(task.project, task.subproject, colorMap);
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
      .replace(new RegExp(`#${p.actual}\\/\\S+`, "g"), "")
      .replace(new RegExp(`#${p.taskId}\\/[A-Za-z0-9]+\\b`, "g"), "")
      .replace(/\{[^{}]*\}/g, "");
    for (const ctx of this.plugin.settings.contextTags) {
      const tag = ctx.tag?.trim();
      if (!tag) continue;
      const esc = tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      out = out.replace(new RegExp(`#${esc}(?![\\w/-])`, "gi"), "");
    }
    const noteTag = this.plugin.settings.noteTag?.trim();
    if (noteTag) {
      const esc = noteTag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      out = out.replace(new RegExp(`#${esc}(?![\\w/-])`, "gi"), "");
    }
    return out.replace(/\s+/g, " ").trim();
  }

  // Detects the configured note tag on a task body. Notes are events the
  // user wants pinned to a specific time without occupying a calendar block.
  private isNoteTask(task: ParsedTask): boolean {
    const tag = this.plugin.settings.noteTag?.trim();
    if (!tag) return false;
    const esc = tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`#${esc}(?![\\w/-])`, "i").test(task.body);
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
    const prefixes = this.plugin.settings.prefixes;
    // Compose the full "proj/sub" path so the input shows the actual
    // project on the line, not just the parent. setProjectTag accepts the
    // composed form and writes it back as `#p/proj/sub` on save.
    const initialProjectFull = task.project
      ? task.subproject
        ? `${task.project}/${task.subproject}`
        : task.project
      : null;
    new TaskEditModal(this.app, {
      mode: "edit",
      modalTitle: "Edit task",
      initialTitle: this.cleanBody(task.body),
      initialDescription: task.description ?? "",
      initialDurationMin: task.durationMin,
      initialProject: initialProjectFull,
      initialChecked: task.checked,
      initialTaskId: parseTaskId(task.body, prefixes),
      taskIdPrefix: prefixes.taskId,
      subtasks: task.subtasks,
      projects: this.collectProjectNames(),
      durations: quickDurations(this.plugin.settings.quickDurationsMin),
      prefixes: this.plugin.settings.prefixes,
      projectTrigger: this.plugin.settings.autocomplete.projectTrigger,
      timeTrigger: this.plugin.settings.autocomplete.timeTrigger,
      durationTrigger: this.plugin.settings.autocomplete.durationTrigger,
      dateTrigger: this.plugin.settings.autocomplete.dateTrigger,
      dailyNoteFormat: this.plugin.settings.dailyNoteFormatFallback,
      dailyNoteFolder: this.plugin.settings.dailyNoteFolderFallback,
      dateLinkFormat: this.plugin.settings.dateLinkFormat,
      visibleStartHour: this.plugin.settings.visibleStartHour,
      visibleEndHour: this.plugin.settings.visibleEndHour,
      quickDurationsMin: this.plugin.settings.quickDurationsMin,
      cleanBody: (body) => this.cleanBody(body),
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
      onEditSubtask: async (sub, newText) => {
        await this.applySubtaskText(file, sub.lineNumber, newText);
      },
      onSetSubtaskTime: async (sub, totalMin) => {
        await this.applySubtaskTime(file, sub.lineNumber, totalMin);
      },
      onReorderSubtasks: async (ordered) => {
        await this.applySubtaskReorder(file, ordered);
      },
      onShowInNote: () => {
        void this.openLine(file, task.lineNumber, this.endOfTitleCh(task.rawLine));
      },
      moveChoices: this.buildMoveChoices(file, task),
      moveCalendarPick: {
        hotkey: "c",
        initialMonth: this.selectedDate,
        selectedDate: this.selectedDate,
        onPick: (d) => this.moveTaskWholeToDate(file, task, d),
      },
      onStartPomodoro: () => this.enterPomodoro(file, task),
      onDelete: () => this.deleteTaskLines(file, task),
      onUnschedule: () => this.unscheduleTask(file, task),
      onDuplicate: (includeSubtasks) =>
        this.duplicateTask(file, task, includeSubtasks),
      hasSubtasks: task.subtasks.length > 0,
    }).open();
  }

  // Removes the task's parent line and all of its sub-task lines from `file`.
  // Highest line number first so earlier indices stay valid as we splice.
  private async deleteTaskLines(file: TFile, task: ParsedTask): Promise<void> {
    const lineNumbers = [
      task.lineNumber,
      ...task.subtasks.map((s) => s.lineNumber),
    ].sort((a, b) => b - a);
    await this.app.vault.process(file, (content) => {
      const lines = content.split("\n");
      for (const n of lineNumbers) {
        if (n < lines.length) lines.splice(n, 1);
      }
      return lines.join("\n");
    });
    new Notice("Task deleted");
  }

  // Inserts a copy of the task line (and optionally its sub-tasks) directly
  // under the existing block. Strips any `#tid/<id>` tag from the copies so
  // task IDs stay unique — the duplicate stays untagged until the user edits
  // it (or another flow re-assigns one).
  private async duplicateTask(
    file: TFile,
    task: ParsedTask,
    includeSubtasks: boolean,
  ): Promise<void> {
    const prefixes = this.plugin.settings.prefixes;
    const escTid = prefixes.taskId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const tidRe = new RegExp(`\\s*#${escTid}\\/[A-Za-z0-9]+\\b`, "g");
    const stripTid = (line: string): string =>
      line.replace(tidRe, "").replace(/[ \t]+$/, "");

    await this.app.vault.process(file, (content) => {
      const lines = content.split("\n");
      if (task.lineNumber >= lines.length) return content;
      const subNums = task.subtasks
        .map((s) => s.lineNumber)
        .filter((n) => n < lines.length)
        .sort((a, b) => a - b);
      const lastIdx =
        subNums.length > 0 ? subNums[subNums.length - 1] : task.lineNumber;

      const copyBlock: string[] = [stripTid(lines[task.lineNumber])];
      if (includeSubtasks) {
        for (const n of subNums) copyBlock.push(stripTid(lines[n]));
      }
      lines.splice(lastIdx + 1, 0, ...copyBlock);
      return lines.join("\n");
    });
    new Notice(
      includeSubtasks ? "Task duplicated (with sub-tasks)" : "Task duplicated",
    );
  }

  // Strips the `#t/` time tag from the task's parent line. The modal closes
  // afterwards; the caller (Today view) re-renders on file modify, dropping
  // the now-untimed task into the unscheduled list.
  private async unscheduleTask(file: TFile, task: ParsedTask): Promise<void> {
    const prefixes = this.plugin.settings.prefixes;
    await this.app.vault.process(file, (content) => {
      const lines = content.split("\n");
      if (task.lineNumber >= lines.length) return content;
      lines[task.lineNumber] = removeTimeTag(lines[task.lineNumber], prefixes);
      return lines.join("\n");
    });
    new Notice("Unscheduled");
  }

  // Computes the date-picker entries for the edit modal's "Move" button:
  // tomorrow, +2 days, +3 days, and the first day of next week (driven by
  // habitWeekStart). The `next week` entry is dropped when its date already
  // appears as one of the next-3-days. All offsets are relative to the
  // currently-viewed day, so opening the modal on a future-dated note pushes
  // tasks forward from there rather than from real today.
  private buildMoveChoices(file: TFile, task: ParsedTask): MoveChoice[] {
    const sel = startOfDay(this.selectedDate);
    const weekStart = this.plugin.settings.habitWeekStart;
    const day1 = addDays(sel, 1);
    const day2 = addDays(sel, 2);
    const day3 = addDays(sel, 3);
    const offset = ((weekStart - sel.getDay() + 7) % 7) || 7;
    const nextWeek = addDays(sel, offset);
    const dayLabel = (d: Date): string =>
      d.toLocaleDateString(undefined, { weekday: "short" });
    const choices: MoveChoice[] = [
      {
        label: "tomorrow",
        hotkey: "1",
        onChoose: () => this.moveTaskWholeToDate(file, task, day1),
      },
      {
        label: dayLabel(day2),
        hotkey: "2",
        onChoose: () => this.moveTaskWholeToDate(file, task, day2),
      },
      {
        label: dayLabel(day3),
        hotkey: "3",
        onChoose: () => this.moveTaskWholeToDate(file, task, day3),
      },
    ];
    const nextWeekIsDup =
      sameDay(nextWeek, day1) ||
      sameDay(nextWeek, day2) ||
      sameDay(nextWeek, day3);
    if (!nextWeekIsDup) {
      choices.push({
        label: "next week",
        hotkey: "4",
        onChoose: () => this.moveTaskWholeToDate(file, task, nextWeek),
      });
    }
    return choices;
  }

  // Moves a task line (and its sub-task lines) from `file` to the daily note
  // for `targetDate`. No-op if source and target are the same file.
  // Returns true on success.
  private async moveTaskWholeToDate(
    file: TFile,
    task: ParsedTask,
    targetDate: Date,
  ): Promise<boolean> {
    const fallback = {
      folder: this.plugin.settings.dailyNoteFolderFallback,
      format: this.plugin.settings.dailyNoteFormatFallback,
      template: this.plugin.settings.dailyNoteTemplate,
      dateLinkFormat: this.plugin.settings.dateLinkFormat,
    };
    const targetFile = await ensureDailyNote(this.app, targetDate, fallback);
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

  // Carries the task title (with most tags) and any unfinished sub-tasks into
  // the daily note for `targetDate`, while keeping the completed sub-tasks on
  // the source day as a record of partial progress. The source parent is
  // checked off and stamped with a #tid/<id> tag; the new-day copy gets the
  // same tag, so the two can be cross-referenced via search. The order tag
  // (#o/) is stripped on the new copy because positioning is per-day.
  private async migrateIncompleteToDate(
    file: TFile,
    task: ParsedTask,
    targetDate: Date,
  ): Promise<boolean> {
    const fallback = {
      folder: this.plugin.settings.dailyNoteFolderFallback,
      format: this.plugin.settings.dailyNoteFormatFallback,
      template: this.plugin.settings.dailyNoteTemplate,
      dateLinkFormat: this.plugin.settings.dateLinkFormat,
    };
    const targetFile = await ensureDailyNote(this.app, targetDate, fallback);
    if (targetFile.path === file.path) {
      new Notice("Source and target are the same file.");
      return false;
    }

    const prefixes = this.plugin.settings.prefixes;

    // Re-parse to pick up any sub-task changes the user made in the modal
    // since it opened — those persist immediately in edit mode and the
    // captured `task` argument is stale on the sub-task front.
    const fresh = parseFileTasks(
      file.path,
      await this.app.vault.read(file),
      prefixes,
      this.plugin.settings.defaultDurationMin,
    );
    let current =
      fresh.find((t) => t.lineNumber === task.lineNumber) ??
      fresh.find((t) => this.cleanBody(t.body) === this.cleanBody(task.body));
    if (!current) {
      new Notice("Couldn't locate the task to migrate.");
      return false;
    }

    const existingId = parseTaskId(current.body, prefixes);
    const taskId =
      existingId ?? generateTaskId(this.plugin.settings.taskIdLength);

    const orderRe = new RegExp(
      `\\s*#${prefixes.order.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\/\\d+\\b`,
    );
    let newParentLine = current.rawLine.replace(orderRe, "");
    newParentLine = setTaskChecked(newParentLine, false);
    newParentLine = setTaskIdTag(newParentLine, taskId, prefixes);

    const uncheckedSubLines = current.subtasks
      .filter((s) => !s.checked)
      .map((s) => s.rawLine);

    await this.app.vault.process(file, (content) => {
      const lines = content.split("\n");
      if (current!.lineNumber < lines.length) {
        let parent = lines[current!.lineNumber];
        parent = setTaskChecked(parent, true);
        parent = setTaskIdTag(parent, taskId, prefixes);
        lines[current!.lineNumber] = parent;
      }
      const removeNumbers = current!.subtasks
        .filter((s) => !s.checked)
        .map((s) => s.lineNumber)
        .sort((a, b) => b - a);
      for (const n of removeNumbers) {
        if (n < lines.length) lines.splice(n, 1);
      }
      return lines.join("\n");
    });

    await this.app.vault.process(targetFile, (content) => {
      const lines = content.split("\n");
      const lastIdx = findLastTaskLine(content);
      const insertAt = lastIdx === -1 ? lines.length : lastIdx + 1;
      lines.splice(insertAt, 0, newParentLine, ...uncheckedSubLines);
      return lines.join("\n");
    });

    new Notice(`Migrated to ${targetFile.path}`);
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

  // Builds the per-habit completion state for the displayed daily note. Daily
  // habits look only at the displayed note's content (already in hand);
  // weekly/monthly habits scan all daily notes in the corresponding period
  // around the displayed date via the shared scanner cache.
  private async loadHabitDisplays(
    displayDate: Date,
    displayContent: string,
    fallback: DailyNoteFallback,
  ): Promise<HabitDisplay[]> {
    const settings = this.plugin.settings;
    const habitsFile = this.app.vault.getAbstractFileByPath(settings.habitsFile);
    if (!(habitsFile instanceof TFile)) return [];
    const habitsContent = await this.plugin.habitsScanner.getContent(habitsFile);
    const habits = parseHabitsFile(habitsContent, settings.habitPrefix);
    if (habits.length === 0) return [];

    const week = weekRange(displayDate, settings.habitWeekStart);
    const month = monthRange(displayDate);

    // Read each daily note in the window separately so we can detect
    // per-file duplicates (a single note containing 2+ task lines for the
    // same habit). Concatenating would conflate cross-file repetition with
    // intra-file duplicates.
    const readWindowFiles = async (
      start: Date,
      end: Date,
    ): Promise<string[]> => {
      const out: string[] = [];
      for (const d of enumerateDailyNoteDatesInRange(start, end)) {
        const c = await this.plugin.habitsScanner.readDateContent(d, fallback);
        if (c) out.push(c);
      }
      return out;
    };

    const needWeek = habits.some((h) => h.period === "week");
    const needMonth = habits.some((h) => h.period === "month");
    const weekFiles = needWeek
      ? await readWindowFiles(week.start, week.end)
      : [];
    const monthFiles = needMonth
      ? await readWindowFiles(month.start, month.end)
      : [];

    const out: HabitDisplay[] = [];
    for (const h of habits) {
      const files: string[] =
        h.period === "day"
          ? [displayContent]
          : h.period === "week"
            ? weekFiles
            : monthFiles;
      let checkedCount = 0;
      let maxPerFile = 0;
      for (const c of files) {
        const lines = findHabitTaskLines(
          c,
          settings.habitPrefix,
          h.period,
          h.slug,
        );
        for (const l of lines) if (l.checked) checkedCount++;
        if (lines.length > maxPerFile) maxPerFile = lines.length;
      }
      out.push({
        habit: h,
        isComplete: checkedCount > 0,
        hasDuplicate: maxPerFile > 1,
        maxPerFile,
      });
    }
    return out;
  }

  private renderHabitsLine(
    parent: HTMLElement,
    displays: HabitDisplay[],
    displayFile: TFile | null,
  ): void {
    if (displays.length === 0) return;
    const settings = this.plugin.settings;
    const wrap = parent.createDiv({ cls: "dp-habits" });

    const periods: HabitPeriod[] = ["day", "week", "month"];
    const groups: Record<HabitPeriod, HabitDisplay[]> = {
      day: [],
      week: [],
      month: [],
    };
    for (const d of displays) groups[d.habit.period].push(d);

    let firstSegment = true;
    for (const period of periods) {
      const items = groups[period];
      if (items.length === 0) continue;
      const visible = settings.habitsHideCompleted
        ? items.filter((i) => !i.isComplete)
        : items;

      if (!firstSegment) {
        wrap.createSpan({ cls: "dp-habit-sep", text: " • " });
      }
      firstSegment = false;

      const labelText =
        period === "day" ? "d:" : period === "week" ? "w:" : "m:";
      wrap.createSpan({ cls: "dp-habit-period", text: labelText });
      wrap.appendText(" ");

      if (visible.length === 0) {
        wrap.createSpan({ cls: "dp-habit-allcomplete", text: "✓" });
        continue;
      }

      visible.forEach((d, idx) => {
        if (idx > 0) wrap.appendText(", ");
        const cls =
          "dp-habit" +
          (d.isComplete ? " is-done" : "") +
          (d.hasDuplicate ? " has-dup" : "");
        const chip = wrap.createSpan({ cls });
        chip.createSpan({ cls: "dp-habit-name", text: d.habit.slug });
        if (d.hasDuplicate) {
          chip.createSpan({
            cls: "dp-habit-dup",
            text: `·${d.maxPerFile}`,
          });
        }
        const tooltipParts: string[] = [];
        if (d.habit.label) tooltipParts.push(d.habit.label);
        if (d.hasDuplicate) {
          tooltipParts.push(
            `${d.maxPerFile} task lines for this habit in one daily note — clean up duplicates by hand`,
          );
        }
        if (tooltipParts.length > 0) chip.title = tooltipParts.join("\n");
        chip.addEventListener("click", (ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          void this.applyHabitToggle(
            displayFile,
            d.habit.period,
            d.habit.slug,
          );
        });
      });
    }

    if (!firstSegment) {
      wrap.appendText("  ");
      const stats = wrap.createEl("a", {
        cls: "dp-habit-stats-link",
        text: "[stats]",
        attr: { href: "#" },
      });
      stats.addEventListener("click", (ev) => {
        ev.preventDefault();
        void this.plugin.activateHabitsStatsView();
      });
    }
  }

  // Toggles a habit on the displayed daily note. The mutator finds the first
  // `- [ ]` / `- [x]` task line containing the habit tag and flips its
  // checkbox in place; if no such line exists, it appends a fresh `- [x]`
  // line. The line is never deleted, which preserves user-templated
  // planned-ahead habits across click/un-click cycles. Creates the daily
  // note if missing.
  private async applyHabitToggle(
    file: TFile | null,
    period: HabitPeriod,
    slug: string,
  ): Promise<void> {
    const settings = this.plugin.settings;
    const fallback: DailyNoteFallback = {
      folder: settings.dailyNoteFolderFallback,
      format: settings.dailyNoteFormatFallback,
      template: settings.dailyNoteTemplate,
      dateLinkFormat: settings.dateLinkFormat,
    };
    const target = file
      ? file
      : await ensureDailyNote(this.app, this.selectedDate, fallback);
    await this.app.vault.process(target, (content) =>
      toggleHabitOnContent(content, settings.habitPrefix, period, slug),
    );
    this.plugin.habitsScanner.invalidate(target.path);
  }

  private isPopout(): boolean {
    const win = this.containerEl.ownerDocument?.defaultView;
    return !!win && win !== window;
  }

  private async popOutLeaf(): Promise<void> {
    await this.app.workspace.moveLeafToPopout(this.leaf);
  }

  // Move this view back to the main Obsidian window. Pomodoro state and the
  // selected date are transferred to the new view instance so the session
  // doesn't reset on the trip back.
  private async returnLeafToMain(): Promise<void> {
    const pomo = this.pomodoroState;
    const selectedDate = this.selectedDate;

    let target: WorkspaceLeaf | null = null;
    for (const leaf of this.app.workspace.getLeavesOfType(VIEW_TYPE_TODAY)) {
      const win = leaf.view.containerEl.ownerDocument?.defaultView;
      if (win === window) {
        target = leaf;
        break;
      }
    }
    if (!target) target = this.app.workspace.getRightLeaf(false);
    if (!target) return;

    await target.setViewState({ type: VIEW_TYPE_TODAY, active: true });
    this.app.workspace.revealLeaf(target);

    if (target.view instanceof TodayView) {
      target.view.selectedDate = selectedDate;
      if (pomo) {
        target.view.adoptPomodoroState(pomo);
        target.view.pomodoroHidden = this.pomodoroHidden;
        target.view.pomodoroSubtaskHistory = [...this.pomodoroSubtaskHistory];
      }
      target.view.scheduleRender();
    }

    if (this.pomodoroTickHandle !== null) {
      window.clearInterval(this.pomodoroTickHandle);
      this.pomodoroTickHandle = null;
    }
    this.pomodoroState = null;
    this.leaf.detach();
  }

  // Picks up an in-flight pomodoro session from a sibling TodayView instance
  // (used when bouncing between the main window and a popout).
  adoptPomodoroState(state: NonNullable<TodayView["pomodoroState"]>): void {
    this.pomodoroState = state;
    if (this.pomodoroTickHandle === null) {
      this.pomodoroTickHandle = window.setInterval(
        () => this.scheduleRender(),
        1000,
      );
      this.registerInterval(this.pomodoroTickHandle);
    }
  }

  private enterPomodoro(file: TFile, task: ParsedTask): void {
    this.pomodoroState = {
      filePath: file.path,
      taskLineNumber: task.lineNumber,
      taskBodySnapshot: this.cleanBody(task.body),
      startedAt: Date.now(),
      phase: "work",
      paused: !this.plugin.settings.pomodoroAutoStart,
      pausedRemainingMs: this.plugin.settings.pomodoroAutoStart
        ? null
        : this.plugin.settings.pomodoroWorkMin * 60_000,
      actualMs: 0,
      workPhaseBankedMs: 0,
    };
    this.pomodoroHidden = false;
    this.pomodoroSubtaskHistory = [];
    if (this.pomodoroTickHandle === null) {
      this.pomodoroTickHandle = window.setInterval(
        () => this.scheduleRender(),
        1000,
      );
      this.registerInterval(this.pomodoroTickHandle);
    }
    this.scheduleRender();
  }

  private exitPomodoro(): void {
    this.pomodoroState = null;
    this.pomodoroHidden = false;
    this.pomodoroSubtaskHistory = [];
    if (this.pomodoroTickHandle !== null) {
      window.clearInterval(this.pomodoroTickHandle);
      this.pomodoroTickHandle = null;
    }
    if (this.plugin.settings.pomodoroAutoReturn && this.isPopout()) {
      void this.returnLeafToMain();
      return;
    }
    this.scheduleRender();
  }

  // User-initiated exit (button or 'x' key). Commits any unwritten work-phase
  // minutes to the currently active sub-task (or the parent task if none) so
  // the time the user just spent is preserved on the note.
  private async exitPomodoroWithCommit(): Promise<void> {
    const state = this.pomodoroState;
    if (!state) return;
    this.bankWorkProgress();
    const minutes = Math.floor(state.actualMs / 60_000);
    if (minutes > 0) {
      const file = this.app.vault.getAbstractFileByPath(state.filePath);
      if (file instanceof TFile) {
        try {
          const content = await this.app.vault.read(file);
          const tasks = parseFileTasks(
            file.path,
            content,
            this.plugin.settings.prefixes,
            this.plugin.settings.defaultDurationMin,
          );
          let task = tasks.find((t) => t.lineNumber === state.taskLineNumber);
          if (!task) {
            task = tasks.find(
              (t) => this.cleanBody(t.body) === state.taskBodySnapshot,
            );
          }
          if (task) {
            const nextSub = task.subtasks.find((s) => !s.checked);
            const target = nextSub ? nextSub.lineNumber : task.lineNumber;
            await this.commitActualTime(file, target);
          }
        } catch (e) {
          new Notice(`Today: failed to write actual time (${(e as Error).message})`);
        }
      }
    }
    this.exitPomodoro();
  }

  // Returns ms elapsed in the current phase, clamped to the phase length.
  // Honors the paused/running anchor used elsewhere in the timer math.
  private currentPhaseElapsedMs(): number {
    const state = this.pomodoroState;
    if (!state) return 0;
    const phaseMin =
      state.phase === "work"
        ? this.plugin.settings.pomodoroWorkMin
        : this.plugin.settings.pomodoroBreakMin;
    const phaseMs = phaseMin * 60_000;
    if (state.paused) {
      const remain = state.pausedRemainingMs ?? phaseMs;
      return Math.max(0, Math.min(phaseMs, phaseMs - remain));
    }
    return Math.max(0, Math.min(phaseMs, Date.now() - state.startedAt));
  }

  // Folds any work-phase progress that has not yet been counted into actualMs.
  // Safe to call any time; only adds the delta since the last bank.
  private bankWorkProgress(): void {
    const state = this.pomodoroState;
    if (!state || state.phase !== "work") return;
    const phaseElapsed = this.currentPhaseElapsedMs();
    const delta = phaseElapsed - state.workPhaseBankedMs;
    if (delta > 0) {
      state.actualMs += delta;
      state.workPhaseBankedMs = phaseElapsed;
    }
  }

  // Writes the accumulated whole minutes onto a task line (parent or sub-task)
  // and resets the in-memory accumulator. workPhaseBankedMs stays so we don't
  // double-count time already accounted for in this work phase.
  private async commitActualTime(file: TFile, lineNumber: number): Promise<void> {
    const state = this.pomodoroState;
    if (!state) return;
    this.bankWorkProgress();
    const minutes = Math.floor(state.actualMs / 60_000);
    if (minutes <= 0) return;
    const prefixes = this.plugin.settings.prefixes;
    await this.app.vault.process(file, (content) => {
      const lines = content.split("\n");
      if (lineNumber >= lines.length) return content;
      lines[lineNumber] = addActualTimeTag(lines[lineNumber], minutes, prefixes);
      return lines.join("\n");
    });
    state.actualMs = 0;
  }

  // Returns true if the pomodoro UI handled the render, false if the caller
  // should fall through to the normal timeline render (task gone, etc.).
  private async renderPomodoro(root: HTMLElement): Promise<boolean> {
    const state = this.pomodoroState;
    if (!state) return false;

    const file = this.app.vault.getAbstractFileByPath(state.filePath);
    if (!(file instanceof TFile)) {
      this.exitPomodoro();
      return false;
    }

    const content = await this.app.vault.read(file);
    const tasks = parseFileTasks(
      file.path,
      content,
      this.plugin.settings.prefixes,
      this.plugin.settings.defaultDurationMin,
    );

    let task = tasks.find((t) => t.lineNumber === state.taskLineNumber);
    if (!task || this.cleanBody(task.body) !== state.taskBodySnapshot) {
      task = tasks.find(
        (t) => this.cleanBody(t.body) === state.taskBodySnapshot,
      );
      if (task) state.taskLineNumber = task.lineNumber;
    }
    if (!task) {
      this.exitPomodoro();
      return false;
    }

    const workMs = this.plugin.settings.pomodoroWorkMin * 60_000;
    const breakMs = this.plugin.settings.pomodoroBreakMin * 60_000;
    const phaseMs = state.phase === "work" ? workMs : breakMs;

    let remainingMs: number;
    if (state.paused && state.pausedRemainingMs !== null) {
      remainingMs = state.pausedRemainingMs;
    } else {
      remainingMs = phaseMs - (Date.now() - state.startedAt);
    }

    if (remainingMs <= 0 && !state.paused) {
      // Phase ran to completion. Bank work-phase progress (no-op for rest)
      // before mutating phase/paused so we capture the full work duration.
      this.bankWorkProgress();
      if (this.plugin.settings.pomodoroAutoCycle) {
        const nextPhase: "work" | "rest" =
          state.phase === "work" ? "rest" : "work";
        new Notice(nextPhase === "rest" ? "Break time" : "Back to focus");
        state.phase = nextPhase;
        state.startedAt = Date.now();
        state.workPhaseBankedMs = 0;
        const nextMs = nextPhase === "work" ? workMs : breakMs;
        remainingMs = nextMs;
      } else {
        remainingMs = 0;
        state.paused = true;
        state.pausedRemainingMs = 0;
      }
    }

    root.empty();
    root.addClass("today-root");
    if (!root.hasAttribute("tabindex")) root.setAttribute("tabindex", "-1");

    const wrap = root.createDiv({ cls: "dp-pomo" });

    const topBar = wrap.createDiv({ cls: "dp-pomo-topbar" });

    const editTask = topBar.createEl("button", {
      cls: "dp-pomo-iconbtn",
      attr: { "aria-label": "Edit task" },
    });
    setIcon(editTask, "pencil");
    editTask.addEventListener("click", () => {
      this.openTaskEditor(file, task);
    });

    const showTimeline = topBar.createEl("button", {
      cls: "dp-pomo-iconbtn",
      attr: { "aria-label": "Show timeline" },
    });
    setIcon(showTimeline, "list");
    showTimeline.addEventListener("click", () => {
      this.pomodoroHidden = true;
      this.scheduleRender();
    });

    const popout = topBar.createEl("button", {
      cls: "dp-pomo-iconbtn",
      attr: {
        "aria-label": this.isPopout()
          ? "Return to main window"
          : "Open in new window",
      },
    });
    setIcon(popout, this.isPopout() ? "monitor" : "picture-in-picture-2");
    popout.addEventListener("click", () => {
      if (this.isPopout()) void this.returnLeafToMain();
      else void this.popOutLeaf();
    });

    const exit = topBar.createEl("button", {
      cls: "dp-pomo-iconbtn",
      attr: { "aria-label": "Exit focus mode" },
    });
    setIcon(exit, "x");
    exit.addEventListener("click", () => void this.exitPomodoroWithCommit());

    wrap.createDiv({
      cls: "dp-pomo-phase",
      text: state.phase === "work" ? "Focus" : "Break",
    });

    const totalSec = Math.max(0, Math.ceil(remainingMs / 1000));
    const mm = Math.floor(totalSec / 60);
    const ss = totalSec % 60;
    wrap.createDiv({
      cls: "dp-pomo-timer",
      text: `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`,
    });

    wrap.createDiv({
      cls: "dp-pomo-title",
      text: this.cleanBody(task.body) || "(untitled)",
    });

    const nextSub = task.subtasks.find((s) => !s.checked);
    if (nextSub) {
      const card = wrap.createDiv({ cls: "dp-pomo-subtask" });
      card.createSpan({
        cls: "dp-pomo-subtask-check",
        attr: { "aria-hidden": "true" },
      });
      card.createSpan({
        cls: "dp-pomo-subtask-text",
        text: this.cleanBody(nextSub.text) || "(untitled)",
      });
      card.addEventListener("click", async () => {
        this.pomodoroSubtaskHistory.push(nextSub.lineNumber);
        await this.commitActualTime(file, nextSub.lineNumber);
        await this.applyLineChecked(file, nextSub.lineNumber, true);
        this.scheduleRender();
      });
    } else if (task.subtasks.length > 0) {
      const addBtn = wrap.createEl("button", {
        cls: "dp-pomo-subtask-add",
        text: "+ Add sub-task",
      });
      addBtn.type = "button";
      addBtn.addEventListener("click", () => {
        new SubtaskQuickAddModal(this.app, async (text) => {
          const sub = await this.appendSubtask(file, task, text);
          if (sub) this.scheduleRender();
          return sub !== null;
        }).open();
      });
    }

    const actions = wrap.createDiv({ cls: "dp-pomo-actions" });

    const expired = remainingMs <= 0 && state.paused;
    const pauseBtn = actions.createEl("button", {
      cls: "dp-pomo-pause-btn",
      text: expired
        ? state.phase === "work"
          ? "Start break"
          : "Start next pomo"
        : state.paused
          ? "Start"
          : "Pause",
    });
    pauseBtn.type = "button";
    pauseBtn.addEventListener("click", () => {
      if (expired) {
        this.bankWorkProgress();
        state.phase = state.phase === "work" ? "rest" : "work";
        state.startedAt = Date.now();
        state.paused = false;
        state.pausedRemainingMs = null;
        state.workPhaseBankedMs = 0;
      } else if (state.paused) {
        const remain = state.pausedRemainingMs ?? phaseMs;
        state.startedAt = Date.now() - (phaseMs - remain);
        state.paused = false;
        state.pausedRemainingMs = null;
      } else {
        this.bankWorkProgress();
        const elapsed = Date.now() - state.startedAt;
        state.paused = true;
        state.pausedRemainingMs = Math.max(0, phaseMs - elapsed);
      }
      this.scheduleRender();
    });

    const completeBtn = actions.createEl("button", {
      cls: "dp-pomo-complete-btn mod-cta",
      text: "Complete",
    });
    completeBtn.type = "button";
    completeBtn.addEventListener("click", async () => {
      completeBtn.disabled = true;
      await this.commitActualTime(file, task.lineNumber);
      await this.applyLineChecked(file, task.lineNumber, true);
      this.exitPomodoro();
    });

    const hints = wrap.createDiv({ cls: "dp-pomo-hints" });
    const addHint = (key: string, label: string): void => {
      const item = hints.createSpan({ cls: "dp-pomo-hint" });
      item.createEl("kbd", { cls: "dp-pomo-kbd", text: key });
      item.createSpan({ cls: "dp-pomo-hint-label", text: label });
    };
    addHint("space", state.paused ? "start" : "pause");
    addHint("enter", nextSub ? "done sub-task" : "complete");
    if (this.pomodoroSubtaskHistory.length > 0) addHint("z", "undo");
    addHint("t", "timeline");
    addHint("p", this.isPopout() ? "return" : "pop out");
    addHint("x", "close");

    // Re-focusing every tick would steal focus from anything the user clicks
    // on elsewhere in Obsidian. Only grab focus when it's already within our
    // view (or on body, the default after a button is removed) — never when
    // the user has clicked into another pane.
    const doc = root.ownerDocument;
    const active = doc?.activeElement as HTMLElement | null;
    const focusElsewhere =
      !!active && active !== doc?.body && !this.containerEl.contains(active);
    const isEditable =
      !!active &&
      (active.tagName === "INPUT" ||
        active.tagName === "TEXTAREA" ||
        active.isContentEditable);
    if (!focusElsewhere && !isEditable && active !== root) {
      root.focus({ preventScroll: true });
    }

    return true;
  }

  private async applySubtaskText(
    file: TFile,
    lineNumber: number,
    newText: string,
  ): Promise<void> {
    const trimmed = newText.trim();
    if (!trimmed) return;
    const prefixes = this.plugin.settings.prefixes;
    await this.app.vault.process(file, (content) => {
      const lines = content.split("\n");
      if (lineNumber >= lines.length) return content;
      lines[lineNumber] = setTaskTitle(lines[lineNumber], trimmed, prefixes);
      return lines.join("\n");
    });
  }

  private async applySubtaskTime(
    file: TFile,
    lineNumber: number,
    totalMin: number | null,
  ): Promise<void> {
    const prefixes = this.plugin.settings.prefixes;
    await this.app.vault.process(file, (content) => {
      const lines = content.split("\n");
      if (lineNumber >= lines.length) return content;
      lines[lineNumber] =
        totalMin === null
          ? removeTimeTag(lines[lineNumber], prefixes)
          : setTimeTag(lines[lineNumber], totalMin, prefixes);
      return lines.join("\n");
    });
  }

  // Reorders sub-task lines in the file. The slots are the existing line
  // numbers (sorted ascending); we write each ordered sub's current rawLine
  // into the corresponding slot. This preserves any blank/non-task lines
  // interleaved between sub-tasks.
  private async applySubtaskReorder(
    file: TFile,
    orderedSubs: ParsedSubtask[],
  ): Promise<void> {
    const slots = orderedSubs
      .map((s) => s.lineNumber)
      .slice()
      .sort((a, b) => a - b);
    await this.app.vault.process(file, (content) => {
      const lines = content.split("\n");
      for (let i = 0; i < orderedSubs.length; i++) {
        const slot = slots[i];
        if (slot < lines.length) lines[slot] = orderedSubs[i].rawLine;
      }
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

type NewTaskPostAction = "none" | "show" | "pomodoro";

interface NewTaskExtras {
  // Pending sub-task lines accumulated in-memory (the parent task does not yet
  // exist on disk). The caller is responsible for writing these underneath the
  // newly created task line.
  subtaskRawLines: string[];
  // What to do once the task line is on disk: stay (none), reveal it in the
  // note (show), or launch the pomodoro view on it (pomodoro).
  postAction: NewTaskPostAction;
}

interface TaskEditOpts {
  // Both modes share the same layout. In "new" mode sub-task ops mutate the
  // local list in memory and are flushed on save; in "edit" mode they persist
  // immediately via the optional callbacks.
  mode: "edit" | "new";
  modalTitle: string;
  initialTitle: string;
  initialDescription: string;
  initialDurationMin: number;
  initialProject: string | null;
  initialChecked: boolean;
  // When the task already carries a `#tid/<id>` tag, surface it as a clickable
  // header pill (search for other instances) instead of leaking it into the
  // title input where the user would have to delete it to avoid duplication.
  initialTaskId?: string | null;
  taskIdPrefix?: string;
  subtasks: ParsedSubtask[];
  projects: string[];
  durations: { label: string; min: number }[];
  prefixes: TagPrefixes;
  // Trigger strings for the in-title autocompletes (e.g. "##", "#@", "#$", "@").
  projectTrigger: string;
  timeTrigger: string;
  durationTrigger: string;
  dateTrigger: string;
  // Daily-note resolution + display format used by the date trigger to build
  // the inserted link.
  dailyNoteFormat: string;
  dailyNoteFolder: string;
  dateLinkFormat: string;
  // Hours that anchor the title-input time picker (visibleStartHour through
  // visibleEndHour from settings).
  visibleStartHour: number;
  visibleEndHour: number;
  // Quick durations the title-input duration picker offers.
  quickDurationsMin: number[];
  cleanBody: (body: string) => string;
  // durationMin is null when the user did not pick a new duration — leave the
  // existing #d/ tag (or its absence) alone. In "new" mode it's always set
  // because every new task needs a duration.
  // description is null when unchanged; otherwise it's the new value (empty
  // string clears the {…} block).
  // project is undefined when unchanged; "" means remove the tag; otherwise set.
  // checked is null when unchanged.
  // extras is supplied only in "new" mode and carries any pending sub-tasks
  // plus the post-save action the user picked (Add / Show in note / Pomodoro).
  onSave: (
    title: string,
    description: string | null,
    durationMin: number | null,
    project: string | null | undefined,
    checked: boolean | null,
    extras?: NewTaskExtras,
  ) => void;
  // Edit-only callbacks. Required in "edit" mode, omitted in "new" mode.
  onToggleSubtask?: (sub: ParsedSubtask, checked: boolean) => Promise<void>;
  onAddSubtask?: (text: string) => Promise<ParsedSubtask | null>;
  onEditSubtask?: (sub: ParsedSubtask, newText: string) => Promise<void>;
  onSetSubtaskTime?: (
    sub: ParsedSubtask,
    totalMin: number | null,
  ) => Promise<void>;
  onReorderSubtasks?: (ordered: ParsedSubtask[]) => Promise<void>;
  onShowInNote?: () => void;
  // Date-picker entries shown when "Move" is clicked. Each is a `{label,
  // hotkey, onChoose}` triple; the modal only renders / wires keys, the
  // caller decides which dates appear and what happens on click.
  moveChoices?: MoveChoice[];
  // Optional last entry in the move cluster: a calendar-icon button that
  // swaps the choices popover for an interactive calendar grid. The picker
  // re-uses the same `dp-calendar` markup as the navbar widget so it visually
  // matches. `onPick` is invoked when the user clicks a day; returning
  // `true` closes the modal, `false` keeps it open.
  moveCalendarPick?: {
    hotkey: string;
    initialMonth: Date;
    selectedDate: Date;
    onPick: (date: Date) => Promise<boolean>;
  };
  onStartPomodoro?: () => void;
  // Drops the task line and any sub-tasks. The modal handles confirmation;
  // the caller just performs the file mutation.
  onDelete?: () => Promise<void>;
  // Strips the `#t/` time tag from the task line so it falls out of the
  // schedule and back into the unscheduled bucket.
  onUnschedule?: () => Promise<void>;
  // Duplicates the task. The modal prompts for "include sub-tasks?" before
  // calling this — when there are no sub-tasks the prompt is skipped and
  // `includeSubtasks` is always false.
  onDuplicate?: (includeSubtasks: boolean) => Promise<void>;
  // Drives whether the duplicate flow asks the y/n sub-task prompt at all.
  hasSubtasks?: boolean;
}

interface MoveChoice {
  label: string;
  hotkey: string;
  onChoose: () => Promise<boolean>;
}

// Renders the same calendar-grid markup as the navbar's dp-calendar dropdown,
// but as a self-contained picker: the caller passes initial month + selected
// day and an onPick callback. Prev/next month buttons mutate a closure-local
// `month` so the popover keeps its own browse state across re-renders.
function renderPickerCalendar(
  parent: HTMLElement,
  opts: {
    initialMonth: Date;
    selectedDate: Date;
    onPickDay: (date: Date) => void;
  },
): void {
  let month = startOfMonth(opts.initialMonth);
  const draw = (): void => {
    parent.empty();
    const cal = parent.createDiv({ cls: "dp-calendar" });
    const head = cal.createDiv({ cls: "dp-cal-head" });
    const prev = head.createEl("button", { cls: "dp-nav-btn", text: "◀" });
    prev.type = "button";
    const monthLabel = head.createDiv({ cls: "dp-cal-month" });
    monthLabel.textContent = month.toLocaleDateString(undefined, {
      month: "long",
      year: "numeric",
    });
    const next = head.createEl("button", { cls: "dp-nav-btn", text: "▶" });
    next.type = "button";
    prev.addEventListener("click", (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      month = addMonths(month, -1);
      draw();
    });
    next.addEventListener("click", (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      month = addMonths(month, 1);
      draw();
    });

    const grid = cal.createDiv({ cls: "dp-cal-grid" });
    for (const dow of ["S", "M", "T", "W", "T", "F", "S"]) {
      grid.createDiv({ cls: "dp-cal-dow", text: dow });
    }

    const monthStart = startOfMonth(month);
    const startDow = monthStart.getDay();
    const monthEnd = endOfMonth(month);
    const today = new Date();

    const renderDay = (d: Date, isOtherMonth: boolean): void => {
      const cell = grid.createDiv({
        cls: "dp-cal-day",
        text: d.getDate().toString(),
      });
      if (isOtherMonth) cell.addClass("is-other-month");
      if (sameDay(d, today)) cell.addClass("is-today");
      if (sameDay(d, opts.selectedDate)) cell.addClass("is-selected");
      cell.addEventListener("click", (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        opts.onPickDay(d);
      });
    };

    for (let i = startDow - 1; i >= 0; i--) {
      renderDay(addDays(monthStart, -i - 1), true);
    }
    for (let i = 1; i <= monthEnd.getDate(); i++) {
      renderDay(new Date(month.getFullYear(), month.getMonth(), i), false);
    }
    const totalCells = startDow + monthEnd.getDate();
    const trailing = (7 - (totalCells % 7)) % 7;
    for (let i = 1; i <= trailing; i++) renderDay(addDays(monthEnd, i), true);
  };
  draw();
}

// Wires a custom autocomplete popover onto a project input. The popover lists
// matching project / sub-project paths (sub-projects rendered with a muted
// "/sub" suffix), supports arrow-key navigation and click-to-select, and
// always allows free-form entry — typing a brand-new name and pressing Enter
// submits it as-is rather than picking a suggestion.
function attachProjectSuggest(
  input: HTMLInputElement,
  wrap: HTMLElement,
  projects: string[],
): void {
  const popover = wrap.createDiv({ cls: "dp-project-suggest" });
  popover.style.display = "none";
  let visible: string[] = [];
  let activeIdx = -1;

  const filter = (q: string): string[] => {
    const needle = q.trim().toLowerCase();
    if (!needle) return projects.slice(0, 12);
    const starts = projects.filter((p) => p.toLowerCase().startsWith(needle));
    const contains = projects.filter(
      (p) =>
        !p.toLowerCase().startsWith(needle) &&
        p.toLowerCase().includes(needle),
    );
    return [...starts, ...contains].slice(0, 12);
  };

  const renderItems = (): void => {
    popover.empty();
    visible.forEach((name, i) => {
      const item = popover.createDiv({ cls: "dp-project-suggest-item" });
      if (i === activeIdx) item.addClass("is-active");
      // Show the full "proj/subproj" path in one piece so the sub-project is
      // unmistakably visible — earlier rendering split it into project + a
      // muted "/sub" span that some themes rendered nearly invisible.
      item.setText(name);
      // mousedown (not click) so we beat the input's blur and the value
      // commits before the popover hides.
      item.addEventListener("mousedown", (ev) => {
        ev.preventDefault();
        input.value = name;
        hide();
        input.focus();
      });
      item.addEventListener("mousemove", () => {
        if (activeIdx === i) return;
        activeIdx = i;
        updateActive();
      });
    });
  };

  const updateActive = (): void => {
    const items = popover.querySelectorAll<HTMLElement>(
      ".dp-project-suggest-item",
    );
    items.forEach((el, i) => el.toggleClass("is-active", i === activeIdx));
    if (activeIdx >= 0 && items[activeIdx]) {
      items[activeIdx].scrollIntoView({ block: "nearest" });
    }
  };

  const show = (): void => {
    visible = filter(input.value);
    if (visible.length === 0) {
      hide();
      return;
    }
    if (activeIdx < 0 || activeIdx >= visible.length) activeIdx = 0;
    renderItems();
    popover.style.display = "";
  };

  const hide = (): void => {
    popover.style.display = "none";
    activeIdx = -1;
  };

  input.addEventListener("input", show);
  input.addEventListener("focus", show);
  input.addEventListener("blur", () => {
    // Delay so a mousedown on a popover item registers before we hide.
    window.setTimeout(hide, 100);
  });
  input.addEventListener("keydown", (ev) => {
    if (ev.key === "ArrowDown") {
      ev.preventDefault();
      if (popover.style.display === "none") {
        show();
        return;
      }
      activeIdx = Math.min(activeIdx + 1, visible.length - 1);
      updateActive();
    } else if (ev.key === "ArrowUp") {
      if (popover.style.display === "none") return;
      ev.preventDefault();
      activeIdx = Math.max(activeIdx - 1, 0);
      updateActive();
    } else if (ev.key === "Enter") {
      // Pick the highlighted suggestion only when it differs from what's
      // typed — otherwise let Enter fall through to the modal's submit.
      if (
        popover.style.display !== "none" &&
        activeIdx >= 0 &&
        activeIdx < visible.length &&
        input.value !== visible[activeIdx]
      ) {
        ev.preventDefault();
        ev.stopImmediatePropagation();
        input.value = visible[activeIdx];
        hide();
      }
    } else if (ev.key === "Escape") {
      if (popover.style.display !== "none") {
        ev.preventDefault();
        ev.stopPropagation();
        hide();
      }
    }
  });
}

// Description of a single inline trigger: how to detect it, what to show,
// what to do when an item is picked. The helper below accepts any number of
// these per input.
interface TitleSuggestRule {
  trigger: string;
  // Suggestions for the typed query (the chars after the trigger, up to the
  // cursor — guaranteed not to contain whitespace or "#").
  getSuggestions: (query: string) => string[];
  // Decorate the popover row for one suggestion. The wrapper element has
  // already been created.
  renderItem: (el: HTMLElement, value: string) => void;
  // Called when the user picks `value`. The callback decides what to do with
  // the [triggerStart, cursor] range — typically either rewrites it to the
  // resolved tag text or strips it and updates a separate field.
  commit: (value: string, triggerStart: number, cursor: number) => void;
}

// Watches a free-text input (the modal's title field) for any of the
// configured triggers. Whichever trigger appears latest in the text before
// the cursor wins, so the user can stack multiple shortcuts inside one title
// without them stepping on each other.
function attachTitleSuggest(
  input: HTMLInputElement,
  wrap: HTMLElement,
  rules: TitleSuggestRule[],
): void {
  const live = rules.filter((r) => r.trigger);
  if (live.length === 0) return;
  const popover = wrap.createDiv({ cls: "dp-project-suggest" });
  popover.style.display = "none";
  let visible: string[] = [];
  let activeIdx = -1;
  let triggerStart = -1;
  let activeRule: TitleSuggestRule | null = null;

  const renderItems = (): void => {
    popover.empty();
    if (!activeRule) return;
    visible.forEach((value, i) => {
      const item = popover.createDiv({ cls: "dp-project-suggest-item" });
      if (i === activeIdx) item.addClass("is-active");
      activeRule!.renderItem(item, value);
      item.addEventListener("mousedown", (ev) => {
        ev.preventDefault();
        commit(value);
      });
      item.addEventListener("mousemove", () => {
        if (activeIdx === i) return;
        activeIdx = i;
        updateActive();
      });
    });
  };

  const updateActive = (): void => {
    const items = popover.querySelectorAll<HTMLElement>(
      ".dp-project-suggest-item",
    );
    items.forEach((el, i) => el.toggleClass("is-active", i === activeIdx));
    if (activeIdx >= 0 && items[activeIdx]) {
      items[activeIdx].scrollIntoView({ block: "nearest" });
    }
  };

  const detect = ():
    | { rule: TitleSuggestRule; start: number; query: string }
    | null => {
    const cursor = input.selectionStart ?? input.value.length;
    const before = input.value.slice(0, cursor);
    let best: { rule: TitleSuggestRule; start: number; query: string } | null =
      null;
    for (const rule of live) {
      const idx = before.lastIndexOf(rule.trigger);
      if (idx < 0) continue;
      const query = before.slice(idx + rule.trigger.length);
      if (/[\s#]/.test(query)) continue;
      if (!best) {
        best = { rule, start: idx, query };
        continue;
      }
      const bestEnd = best.start + best.rule.trigger.length;
      const cEnd = idx + rule.trigger.length;
      // Latest match-end wins; on ties prefer the longer trigger so e.g.
      // "#@" beats its own "@" suffix when both are configured.
      if (cEnd > bestEnd) {
        best = { rule, start: idx, query };
      } else if (
        cEnd === bestEnd &&
        rule.trigger.length > best.rule.trigger.length
      ) {
        best = { rule, start: idx, query };
      }
    }
    return best;
  };

  const refresh = (): void => {
    const det = detect();
    if (!det) {
      hide();
      return;
    }
    activeRule = det.rule;
    triggerStart = det.start;
    visible = det.rule.getSuggestions(det.query);
    if (visible.length === 0) {
      hide();
      return;
    }
    if (activeIdx < 0 || activeIdx >= visible.length) activeIdx = 0;
    renderItems();
    popover.style.display = "";
  };

  const hide = (): void => {
    popover.style.display = "none";
    activeIdx = -1;
    triggerStart = -1;
    activeRule = null;
  };

  const commit = (value: string): void => {
    if (!activeRule || triggerStart < 0) return;
    const cursor = input.selectionStart ?? input.value.length;
    const rule = activeRule;
    const start = triggerStart;
    hide();
    rule.commit(value, start, cursor);
    input.focus();
  };

  input.addEventListener("input", refresh);
  input.addEventListener("click", refresh);
  input.addEventListener("keyup", (ev) => {
    if (ev.key === "ArrowLeft" || ev.key === "ArrowRight") refresh();
  });
  input.addEventListener("blur", () => {
    window.setTimeout(hide, 100);
  });
  input.addEventListener("keydown", (ev) => {
    if (popover.style.display === "none") return;
    if (ev.key === "ArrowDown") {
      ev.preventDefault();
      activeIdx = Math.min(activeIdx + 1, visible.length - 1);
      updateActive();
    } else if (ev.key === "ArrowUp") {
      ev.preventDefault();
      activeIdx = Math.max(activeIdx - 1, 0);
      updateActive();
    } else if (ev.key === "Enter" || ev.key === "Tab") {
      if (activeIdx >= 0 && activeIdx < visible.length) {
        ev.preventDefault();
        ev.stopImmediatePropagation();
        commit(visible[activeIdx]);
      }
    } else if (ev.key === "Escape") {
      ev.preventDefault();
      ev.stopPropagation();
      hide();
    }
  });
}

// Filters `pool` against `query` with a "starts-with first, then contains"
// ordering, capped at `limit`. Used by every inline-suggest list.
function filterSuggestions(
  pool: string[],
  query: string,
  limit = 12,
): string[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return pool.slice(0, limit);
  const starts = pool.filter((p) => p.toLowerCase().startsWith(needle));
  const contains = pool.filter(
    (p) =>
      !p.toLowerCase().startsWith(needle) && p.toLowerCase().includes(needle),
  );
  return [...starts, ...contains].slice(0, limit);
}


// Project segments only allow [\w-]; "/" separates a sub-project segment so
// users can type "My Project/Sub" and end up with #p/My-Project/Sub. Anything
// else becomes a dash; runs of dashes/slashes collapse and trim.
function sanitizeProjectName(raw: string): string {
  return raw
    .trim()
    .replace(/[^\w/-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/\/+/g, "/")
    .replace(/-?\/-?/g, "/")
    .replace(/^[-/]+|[-/]+$/g, "");
}

class TaskEditModal extends Modal {
  private opts: TaskEditOpts;
  private selectedDurationMin: number;
  private durationChanged = false;
  private checked: boolean;
  private checkedChanged = false;

  constructor(app: App, opts: TaskEditOpts) {
    super(app);
    this.opts = opts;
    this.selectedDurationMin = opts.initialDurationMin;
    this.checked = opts.initialChecked;
  }

  onOpen(): void {
    this.modalEl.addClass("dp-title-modal");
    // Body marker so mobile CSS can target this modal's container without
    // relying on :has(). Removed in onClose.
    document.body.addClass("today-edit-open");
    this.titleEl.setText(this.opts.modalTitle);
    if (this.opts.initialTaskId && this.opts.taskIdPrefix) {
      const id = this.opts.initialTaskId;
      const prefix = this.opts.taskIdPrefix;
      const pill = this.titleEl.createEl("a", {
        cls: "dp-edit-tid-pill",
        text: `#${prefix}/${id}`,
        href: "#",
        attr: {
          "aria-label": `Search for #${prefix}/${id}`,
          title: `Search for other instances of this task`,
        },
      });
      pill.addEventListener("click", (ev) => {
        ev.preventDefault();
        const search = (this.app as unknown as {
          internalPlugins?: {
            getPluginById?: (id: string) => {
              instance?: { openGlobalSearch?: (q: string) => void };
            } | null;
          };
        }).internalPlugins?.getPluginById?.("global-search");
        search?.instance?.openGlobalSearch?.(`tag:#${prefix}/${id}`);
        this.close();
      });
    }
    this.contentEl.empty();

    // On mobile, the on-screen keyboard often covers the field that just
    // gained focus. Browser auto-scroll inside a position:fixed modal is
    // unreliable, so wait for the keyboard to settle and pull the focused
    // input into view ourselves.
    this.contentEl.addEventListener(
      "focusin",
      (ev) => {
        const target = ev.target as HTMLElement | null;
        if (!target) return;
        const tag = target.tagName;
        if (tag !== "INPUT" && tag !== "TEXTAREA") return;
        window.setTimeout(() => {
          target.scrollIntoView({ block: "center", behavior: "smooth" });
        }, 250);
      },
      true,
    );

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

    const titleWrap = titleRow.createDiv({ cls: "dp-title-input-wrap" });
    const input = titleWrap.createEl("input", {
      type: "text",
      cls: "dp-title-input",
      attr: { placeholder: "Task title…", autocomplete: "off" },
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
      cls: "dp-prompt-step-label is-mobile-hidden",
      text: "Project",
    });
    projLabel.setAttribute("aria-hidden", "true");

    const projRow = this.contentEl.createDiv({ cls: "dp-project-row" });
    const projWrap = projRow.createDiv({ cls: "dp-project-input-wrap" });
    const projInput = projWrap.createEl("input", {
      type: "text",
      cls: "dp-project-input",
      attr: { placeholder: "(none)", autocomplete: "off" },
    });
    projInput.value = this.opts.initialProject ?? "";
    attachProjectSuggest(projInput, projWrap, this.opts.projects);
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
      cls: "dp-prompt-step-label is-mobile-hidden",
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
        updateSummary();
      });
      buttons.push(btn);
    });

    // Mobile-only quick-insert bar plus a small summary line, positioned
    // directly under the title row. The bar replaces the project/duration
    // form fields (hidden on mobile via CSS) — users tap a button to fire
    // the autocomplete trigger and the summary echoes the selected values
    // in a minimalist three-cell row underneath.
    const quickInsert = createDiv({ cls: "dp-edit-quick-insert" });
    const summary = createDiv({ cls: "dp-edit-quick-summary" });
    titleRow.after(quickInsert);
    quickInsert.after(summary);

    const summaryProj = summary.createDiv({ cls: "dp-edit-quick-summary-cell" });
    const summaryTime = summary.createDiv({ cls: "dp-edit-quick-summary-cell" });
    const summaryDur = summary.createDiv({ cls: "dp-edit-quick-summary-cell" });

    const insertTriggerAtCursor = (trigger: string): void => {
      if (!trigger) return;
      if (document.activeElement !== input) input.focus();
      const cursor = input.selectionStart ?? input.value.length;
      const before = input.value.slice(0, cursor);
      const after = input.value.slice(cursor);
      const needsLead = before.length > 0 && !/\s$/.test(before);
      const insertion = (needsLead ? " " : "") + trigger;
      input.value = before + insertion + after;
      const newPos = before.length + insertion.length;
      input.setSelectionRange(newPos, newPos);
      input.dispatchEvent(new Event("input", { bubbles: true }));
    };

    const addQuickBtn = (
      trigger: string,
      iconName: string,
      label: string,
    ): void => {
      const btn = quickInsert.createEl("button", {
        cls: "dp-edit-quick-btn",
        attr: { "aria-label": `Insert ${label.toLowerCase()}` },
      });
      btn.type = "button";
      setIcon(btn, iconName);
      btn.createSpan({ cls: "dp-edit-quick-label", text: label });
      // pointerdown + preventDefault keeps focus on the title input so the
      // mobile keyboard doesn't dismiss between taps.
      btn.addEventListener("pointerdown", (ev) => {
        ev.preventDefault();
        insertTriggerAtCursor(trigger);
      });
    };
    addQuickBtn(this.opts.projectTrigger, "folder", "Project");
    addQuickBtn(this.opts.timeTrigger, "clock", "Time");
    addQuickBtn(this.opts.durationTrigger, "timer", "Duration");

    const updateSummary = (): void => {
      const proj = projInput.value.trim();
      summaryProj.setText(proj || "—");
      summaryProj.toggleClass("is-empty", !proj);

      const timeMin = parseTime(input.value, this.opts.prefixes);
      summaryTime.setText(
        timeMin !== null ? formatClockShort(timeMin) : "—",
      );
      summaryTime.toggleClass("is-empty", timeMin === null);

      summaryDur.setText(formatCompactDuration(this.selectedDurationMin));
    };
    input.addEventListener("input", updateSummary);
    projInput.addEventListener("input", updateSummary);
    updateSummary();

    const projectPool = this.opts.projects;
    const timePool = buildTimeOptions(
      this.opts.visibleStartHour,
      this.opts.visibleEndHour,
    );
    const durationPool = this.opts.quickDurationsMin.map((m) =>
      formatCompactDuration(m),
    );
    // Replaces the [triggerStart, cursor] range in the title input. When
    // `replacement` is empty we also trim a trailing space we'd otherwise
    // leave behind (so "foo ##bar" → "foo", not "foo "). Dispatches an
    // `input` event afterward so listeners (autocomplete refresh, the
    // mobile summary line) stay in sync with the post-commit text.
    const replaceTriggerRange = (
      start: number,
      cursor: number,
      replacement: string,
    ): void => {
      let before = input.value.slice(0, start);
      const after = input.value.slice(cursor);
      if (!replacement) before = before.replace(/\s+$/, "");
      input.value = before + replacement + after;
      const newCursor = before.length + replacement.length;
      input.setSelectionRange(newCursor, newCursor);
      input.dispatchEvent(new Event("input", { bubbles: true }));
    };
    attachTitleSuggest(input, titleWrap, [
      {
        trigger: this.opts.projectTrigger,
        getSuggestions: (q) => filterSuggestions(projectPool, q),
        renderItem: (el, name) => {
          // Render the full "proj/subproj" path plainly so the sub-project
          // is fully visible; the prior split rendering muted "/sub" so
          // hard it disappeared on some themes.
          el.setText(name);
        },
        commit: (name, start, cursor) => {
          // Set projInput first so the input event dispatched by
          // replaceTriggerRange picks up the new project value.
          projInput.value = name;
          replaceTriggerRange(start, cursor, "");
        },
      },
      {
        trigger: this.opts.timeTrigger,
        getSuggestions: (q) => filterSuggestions(timePool, q),
        renderItem: (el, value) => {
          el.createSpan({ text: value });
        },
        commit: (display, start, cursor) => {
          const tag = `#${this.opts.prefixes.time}/${timeDisplayToTagBody(display)} `;
          replaceTriggerRange(start, cursor, tag);
        },
      },
      {
        trigger: this.opts.durationTrigger,
        getSuggestions: (q) => filterSuggestions(durationPool, q),
        renderItem: (el, value) => {
          el.createSpan({ text: value });
        },
        commit: (display, start, cursor) => {
          const min = parseCompactDuration(display);
          if (min !== null) {
            this.selectedDurationMin = min;
            this.durationChanged = true;
            buttons.forEach((b, i) => {
              b.toggleClass(
                "is-selected",
                this.opts.durations[i]?.min === min,
              );
            });
          }
          replaceTriggerRange(start, cursor, "");
          updateSummary();
        },
      },
      // Date rule keeps the resolved Date alongside the keyword in a parallel
      // map so commit() can rebuild the link without re-parsing the keyword.
      ((): TitleSuggestRule => {
        const dateMap = new Map<string, Date>();
        const fmt = this.opts.dateLinkFormat;
        return {
          trigger: this.opts.dateTrigger,
          getSuggestions: (q) => {
            dateMap.clear();
            const items = buildDateSuggestions(q);
            for (const it of items) dateMap.set(it.keyword, it.date);
            return items.map((it) => it.keyword);
          },
          renderItem: (el, keyword) => {
            el.createSpan({ text: keyword });
            const d = dateMap.get(keyword);
            if (d && fmt.trim()) {
              el.createSpan({
                cls: "dp-project-suggest-sub",
                text: ` ${moment(d).format(fmt.trim())}`,
              });
            }
          },
          commit: (keyword, start, cursor) => {
            const d = dateMap.get(keyword);
            if (!d) {
              replaceTriggerRange(start, cursor, "");
              return;
            }
            const link = buildDateLinkInsert(
              this.app,
              d,
              this.opts.dailyNoteFormat,
              this.opts.dailyNoteFolder,
              fmt,
            );
            replaceTriggerRange(start, cursor, link + " ");
          },
        };
      })(),
    ]);

    const resolveProject = (): string | null | undefined => {
      const raw = projInput.value.trim();
      if (this.opts.mode === "new") {
        return raw ? sanitizeProjectName(raw) || null : null;
      }
      const initial = this.opts.initialProject ?? "";
      if (raw === initial) return undefined;
      if (!raw) return "";
      return sanitizeProjectName(raw) || undefined;
    };

    const resolveDescription = (): string | null => {
      // Task lines are single-line markdown; collapse any newlines the user
      // typed into spaces so we never write a broken line back to the file.
      const raw = descInput.value.replace(/\s+/g, " ").trim();
      if (this.opts.mode === "new") return raw || null;
      if (raw === this.opts.initialDescription.trim()) return null;
      return raw;
    };

    const submit = (postAction: NewTaskPostAction = "none"): void => {
      const title = input.value.trim();
      if (this.opts.mode === "new" && !title) {
        input.focus();
        return;
      }
      const extras: NewTaskExtras | undefined =
        this.opts.mode === "new"
          ? {
              subtaskRawLines: subs.map((s) => s.rawLine),
              postAction,
            }
          : undefined;
      this.opts.onSave(
        title,
        resolveDescription(),
        this.opts.mode === "new" || this.durationChanged
          ? this.selectedDurationMin
          : null,
        resolveProject(),
        this.checkedChanged ? this.checked : null,
        extras,
      );
      this.close();
    };

    // Plain Enter (no modifier) on the title / project inputs submits.
    // Cmd/Ctrl+Enter is handled by the modal-level keydown below so it can
    // also fire from the description textarea (where plain Enter inserts a
    // newline) and from outside any input.
    const enterToSubmit = (ev: KeyboardEvent): void => {
      if (
        ev.key === "Enter" &&
        !ev.metaKey &&
        !ev.ctrlKey &&
        !ev.altKey &&
        !ev.shiftKey
      ) {
        ev.preventDefault();
        submit();
      }
    };
    input.addEventListener("keydown", enterToSubmit);
    projInput.addEventListener("keydown", enterToSubmit);

    const subHeader = this.contentEl.createDiv({ cls: "dp-edit-subtask-header" });
    const subLabel = subHeader.createDiv({
      cls: "dp-prompt-step-label",
      text: "Sub-tasks",
    });
    subLabel.setAttribute("aria-hidden", "true");
    const sortBtn = subHeader.createEl("button", {
      cls: "dp-edit-subtask-sort",
      text: "Sort by time",
    });
    sortBtn.type = "button";

    const list = this.contentEl.createDiv({ cls: "dp-edit-subtasks" });
    // Local mutable state — the array order reflects the visual order; each
    // sub keeps its original lineNumber as its file slot until a reorder is
    // persisted, at which point we rewrite each sub's lineNumber to match.
    const subs: ParsedSubtask[] = this.opts.subtasks.slice();
    const prefixes = this.opts.prefixes;
    const cleanBody = this.opts.cleanBody;
    let dragSourceIdx: number | null = null;
    // Negative line numbers tag in-memory sub-tasks added in "new" mode so
    // they don't collide with real file line numbers (always >= 0). These
    // get serialized into rawLines and appended on save.
    let pendingSubLineCounter = -1;

    const persistOrder = (): void => {
      if (!this.opts.onReorderSubtasks) return;
      const slots = subs
        .map((s) => s.lineNumber)
        .slice()
        .sort((a, b) => a - b);
      const ordered = subs.slice();
      void this.opts.onReorderSubtasks(ordered);
      // Update each sub's lineNumber to its new slot so subsequent edits
      // target the right line.
      ordered.forEach((s, i) => {
        s.lineNumber = slots[i];
      });
    };

    const renderList = (): void => {
      list.empty();
      subs.forEach((sub, idx) => renderSubtask(sub, idx));
    };

    const renderSubtask = (sub: ParsedSubtask, idx: number): void => {
      let checked = sub.checked;
      const row = list.createDiv({ cls: "dp-edit-subtask" });
      row.dataset.idx = String(idx);
      if (checked) row.addClass("is-done");

      const box = row.createSpan({ cls: "dp-edit-check" });
      if (checked) box.addClass("is-checked");

      const timeChip = row.createSpan({ cls: "dp-edit-subtask-time" });
      const renderTimeChip = (): void => {
        const min = parseTime(sub.text, prefixes);
        if (min === null) {
          timeChip.setText("+ time");
          timeChip.addClass("is-empty");
        } else {
          timeChip.setText(formatClockShort(min));
          timeChip.removeClass("is-empty");
        }
      };
      renderTimeChip();

      const textEl = row.createSpan({
        cls: "dp-edit-subtask-text",
        text: cleanBody(sub.text),
      });

      const handle = row.createSpan({ cls: "dp-edit-subtask-handle" });
      setIcon(handle, "grip-vertical");
      handle.draggable = true;

      const toggleChecked = (): void => {
        checked = !checked;
        row.toggleClass("is-done", checked);
        box.toggleClass("is-checked", checked);
        sub.checked = checked;
        // Keep the in-memory rawLine in sync so "new" mode serializes the
        // right checkbox state on save. Edit mode then persists via callback.
        sub.rawLine = sub.rawLine.replace(
          /^(\s*-\s*\[)[^\]](\])/,
          `$1${checked ? "x" : " "}$2`,
        );
        if (this.opts.onToggleSubtask) {
          void this.opts.onToggleSubtask(sub, checked);
        }
      };
      box.addEventListener("click", (ev) => {
        ev.stopPropagation();
        toggleChecked();
      });

      timeChip.addEventListener("click", (ev) => {
        ev.stopPropagation();
        const current = parseTime(sub.text, prefixes);
        const editor = row.createEl("input", {
          type: "text",
          cls: "dp-edit-subtask-time-input",
          attr: { placeholder: "e.g. 7p, 6:30p" },
        });
        editor.value = current === null ? "" : formatClockShort(current);
        timeChip.style.display = "none";
        editor.focus();
        editor.select();
        let done = false;
        const finish = (commit: boolean): void => {
          if (done) return;
          done = true;
          const raw = editor.value.trim();
          editor.remove();
          timeChip.style.display = "";
          if (!commit) return;
          let totalMin: number | null = null;
          if (raw !== "") {
            const cleaned = raw.toLowerCase().replace(/[\s:]/g, "");
            const tagPrefix = `#${prefixes.time}/`;
            const stripped = cleaned.startsWith(tagPrefix)
              ? cleaned.slice(tagPrefix.length)
              : cleaned;
            const parsed = parseTime(`${tagPrefix}${stripped}`, prefixes);
            if (parsed === null) {
              new Notice("Invalid time, try e.g. 7p or 6:30p");
              return;
            }
            totalMin = parsed;
          }
          if (totalMin === current) return;
          sub.rawLine =
            totalMin === null
              ? removeTimeTag(sub.rawLine, prefixes)
              : setTimeTag(sub.rawLine, totalMin, prefixes);
          const m = /^\s*-\s*\[[^\]]\]\s+(.*)$/.exec(sub.rawLine);
          if (m) sub.text = m[1];
          renderTimeChip();
          if (this.opts.onSetSubtaskTime) {
            void this.opts.onSetSubtaskTime(sub, totalMin);
          }
        };
        editor.addEventListener("keydown", (kev) => {
          if (kev.key === "Enter") {
            kev.preventDefault();
            finish(true);
          } else if (kev.key === "Escape") {
            kev.preventDefault();
            finish(false);
          }
        });
        editor.addEventListener("blur", () => finish(true));
      });

      textEl.addEventListener("click", (ev) => {
        ev.stopPropagation();
        const editor = row.createEl("input", {
          type: "text",
          cls: "dp-edit-subtask-text-input",
        });
        editor.value = cleanBody(sub.text);
        textEl.style.display = "none";
        editor.focus();
        editor.select();
        let done = false;
        const finish = (commit: boolean): void => {
          if (done) return;
          done = true;
          const next = editor.value.trim();
          editor.remove();
          const before = cleanBody(sub.text);
          if (commit && next && next !== before) {
            sub.rawLine = setTaskTitle(sub.rawLine, next, prefixes);
            const m = /^\s*-\s*\[[^\]]\]\s+(.*)$/.exec(sub.rawLine);
            if (m) sub.text = m[1];
            textEl.setText(cleanBody(sub.text));
            if (this.opts.onEditSubtask) {
              void this.opts.onEditSubtask(sub, next);
            }
          }
          textEl.style.display = "";
        };
        editor.addEventListener("keydown", (kev) => {
          if (kev.key === "Enter") {
            kev.preventDefault();
            finish(true);
          } else if (kev.key === "Escape") {
            kev.preventDefault();
            finish(false);
          }
        });
        editor.addEventListener("blur", () => finish(true));
      });

      handle.addEventListener("dragstart", (ev) => {
        dragSourceIdx = idx;
        row.addClass("is-dragging");
        if (ev.dataTransfer) {
          ev.dataTransfer.effectAllowed = "move";
          ev.dataTransfer.setData("text/plain", String(idx));
          const rect = row.getBoundingClientRect();
          ev.dataTransfer.setDragImage(
            row,
            ev.clientX - rect.left,
            ev.clientY - rect.top,
          );
        }
      });
      handle.addEventListener("dragend", () => {
        dragSourceIdx = null;
        list
          .querySelectorAll(".dp-edit-subtask")
          .forEach((el) => {
            el.classList.remove("is-dragging");
            el.classList.remove("drop-above");
            el.classList.remove("drop-below");
          });
      });

      row.addEventListener("dragover", (ev) => {
        if (dragSourceIdx === null || dragSourceIdx === idx) return;
        ev.preventDefault();
        if (ev.dataTransfer) ev.dataTransfer.dropEffect = "move";
        const rect = row.getBoundingClientRect();
        const isAbove = ev.clientY < rect.top + rect.height / 2;
        row.toggleClass("drop-above", isAbove);
        row.toggleClass("drop-below", !isAbove);
      });
      row.addEventListener("dragleave", () => {
        row.removeClass("drop-above");
        row.removeClass("drop-below");
      });
      row.addEventListener("drop", (ev) => {
        if (dragSourceIdx === null || dragSourceIdx === idx) return;
        ev.preventDefault();
        const rect = row.getBoundingClientRect();
        const isAbove = ev.clientY < rect.top + rect.height / 2;
        const from = dragSourceIdx;
        const moved = subs.splice(from, 1)[0];
        let to = idx;
        if (from < idx) to = idx - 1;
        if (!isAbove) to += 1;
        subs.splice(to, 0, moved);
        dragSourceIdx = null;
        renderList();
        persistOrder();
      });
    };

    renderList();

    sortBtn.addEventListener("click", () => {
      // Stable sort: preserves relative order among subs without a time, and
      // pushes them to the end.
      subs.sort((a, b) => {
        const ta = parseTime(a.text, prefixes);
        const tb = parseTime(b.text, prefixes);
        if (ta === null && tb === null) return 0;
        if (ta === null) return 1;
        if (tb === null) return -1;
        return ta - tb;
      });
      renderList();
      persistOrder();
    });

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
      let sub: ParsedSubtask | null;
      if (this.opts.onAddSubtask) {
        sub = await this.opts.onAddSubtask(text);
      } else {
        // New mode: build the sub-task in memory; it'll be flushed to the
        // file alongside the parent task when the user saves.
        sub = {
          lineNumber: pendingSubLineCounter--,
          rawLine: `\t- [ ] ${text}`,
          text,
          checked: false,
        };
      }
      addInput.disabled = false;
      addBtn.disabled = false;
      if (sub) {
        subs.push(sub);
        renderSubtask(sub, subs.length - 1);
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

    // Delete: bottom-left of the action row, danger styling. Confirms before
    // dropping the line so accidental clicks / hotkey presses are recoverable.
    // `margin-right: auto` (in CSS) pushes the rest of the actions to the
    // right edge.
    const runDelete = async (): Promise<void> => {
      if (!this.opts.onDelete) return;
      const ok = window.confirm("Delete this task and its sub-tasks?");
      if (!ok) return;
      await this.opts.onDelete();
      this.close();
    };
    const runUnschedule = async (): Promise<void> => {
      if (!this.opts.onUnschedule) return;
      await this.opts.onUnschedule();
      this.close();
    };
    const runDuplicate = async (): Promise<void> => {
      if (!this.opts.onDuplicate) return;
      // Only ask the y/n question when the task actually has sub-tasks.
      // window.confirm OK = yes, Cancel = no — same pattern the Delete
      // confirm uses.
      const includeSubs = this.opts.hasSubtasks
        ? window.confirm("Copy sub-tasks too?")
        : false;
      await this.opts.onDuplicate(includeSubs);
      this.close();
    };

    if (this.opts.mode === "edit" && this.opts.onDelete) {
      const deleteBtn = actions.createEl("button", {
        cls: "dp-edit-delete-btn",
        text: "Delete",
        attr: { "aria-label": "Delete task (x)" },
      });
      deleteBtn.type = "button";
      deleteBtn.addEventListener("click", () => void runDelete());
    }

    const showBtn = actions.createEl("button", {
      cls: "dp-edit-icon-btn",
      attr: { "aria-label": "Show in note (s)" },
    });
    showBtn.type = "button";
    setIcon(showBtn, "eye");
    showBtn.addEventListener("click", () => {
      if (this.opts.mode === "new") {
        // Persist the task first, then jump to it; the caller wires the
        // post-action through after appending the line.
        submit("show");
        return;
      }
      this.close();
      this.opts.onShowInNote!();
    });

    let editModeMoveBtn: HTMLButtonElement | null = null;
    if (this.opts.mode === "edit") {
      const moveChoices = this.opts.moveChoices ?? [];
      const calendarPick = this.opts.moveCalendarPick;
      const moveWrap = actions.createDiv({ cls: "dp-edit-move-wrap" });
      const moveBtn = moveWrap.createEl("button", {
        cls: "dp-edit-icon-btn",
        attr: { "aria-label": "Move to… (m)" },
      });
      moveBtn.type = "button";
      setIcon(moveBtn, "forward");
      editModeMoveBtn = moveBtn;

      const choices = moveWrap.createDiv({ cls: "dp-edit-move-choices" });
      choices.style.display = "none";

      // Sibling popover that hosts the calendar picker. Lives next to the
      // choices row inside the same wrap so it inherits the existing pointer
      // anchor and z-index. Toggled in/out when the user picks "calendar".
      const calPopover = moveWrap.createDiv({
        cls: "dp-edit-move-calpopover",
      });
      calPopover.style.display = "none";

      const choiceBtns: HTMLButtonElement[] = [];
      for (const choice of moveChoices) {
        const btn = choices.createEl("button", {
          cls: "dp-edit-move-choice",
          attr: {
            "aria-label": `Move to ${choice.label} (${choice.hotkey})`,
          },
        });
        btn.type = "button";
        btn.createEl("span", {
          cls: "dp-edit-move-hotkey",
          text: `(${choice.hotkey})`,
        });
        btn.appendText(` ${choice.label}`);
        btn.addEventListener("click", () => void runWith(choice.onChoose));
        choiceBtns.push(btn);
      }

      // Calendar-icon button at the end of the row (hotkey "c"). Clicking it
      // swaps the choices popover for the calendar grid; picking a day fires
      // the move and closes the modal on success.
      let calBtn: HTMLButtonElement | null = null;
      if (calendarPick) {
        calBtn = choices.createEl("button", {
          cls: "dp-edit-move-choice is-calendar",
          attr: {
            "aria-label": `Pick date (${calendarPick.hotkey})`,
          },
        });
        calBtn.type = "button";
        calBtn.createEl("span", {
          cls: "dp-edit-move-hotkey",
          text: `(${calendarPick.hotkey})`,
        });
        const iconWrap = calBtn.createSpan({ cls: "dp-edit-move-calicon" });
        setIcon(iconWrap, "calendar");
        calBtn.addEventListener("click", () => openCalendar());
        choiceBtns.push(calBtn);
      }

      let stageTwoActive = false;
      let calendarActive = false;
      let keyHandler: ((ev: KeyboardEvent) => void) | null = null;

      const setSubBtnsDisabled = (disabled: boolean): void => {
        for (const b of choiceBtns) b.disabled = disabled;
      };

      const exitStageTwo = (): void => {
        stageTwoActive = false;
        choices.style.display = "none";
        choices.removeClass("is-open");
        closeCalendar();
        if (keyHandler) {
          this.contentEl.removeEventListener("keydown", keyHandler, true);
          keyHandler = null;
        }
      };

      const closeCalendar = (): void => {
        if (!calendarActive) return;
        calendarActive = false;
        calPopover.style.display = "none";
        calPopover.empty();
      };

      const openCalendar = (): void => {
        if (!calendarPick) return;
        // Hide the choices row (calendar takes over the same anchor) but keep
        // stageTwoActive true so Escape still routes here.
        choices.style.display = "none";
        choices.removeClass("is-open");
        calendarActive = true;
        calPopover.style.display = "";
        renderPickerCalendar(calPopover, {
          initialMonth: calendarPick.initialMonth,
          selectedDate: calendarPick.selectedDate,
          onPickDay: (date) => {
            void runWith(() => calendarPick.onPick(date));
          },
        });
      };

      const runWith = async (
        action: () => Promise<boolean>,
      ): Promise<void> => {
        setSubBtnsDisabled(true);
        const moved = await action();
        if (moved) this.close();
        else {
          setSubBtnsDisabled(false);
          // The action declined (e.g. same-file move). Restore the choices
          // row so the user can pick something else.
          if (calendarActive) {
            closeCalendar();
            choices.style.display = "";
            choices.removeClass("is-open");
            void choices.offsetWidth;
            choices.addClass("is-open");
          }
        }
      };

      moveBtn.addEventListener("click", () => {
        if (stageTwoActive) {
          exitStageTwo();
          moveBtn.focus();
          return;
        }
        if (choiceBtns.length === 0) return;
        stageTwoActive = true;
        choices.style.display = "";
        // Re-trigger the staggered pop-in animation each time the cluster
        // opens by toggling the class across a forced reflow.
        choices.removeClass("is-open");
        void choices.offsetWidth;
        choices.addClass("is-open");
        choiceBtns[0].focus();
        keyHandler = (ev: KeyboardEvent) => {
          if (!stageTwoActive) return;
          // Don't intercept while typing in inputs (title field, sub-task
          // editors, etc.) — only fire when focus is on a non-input element.
          const target = ev.target as HTMLElement | null;
          if (
            target &&
            (target.tagName === "INPUT" || target.tagName === "TEXTAREA")
          ) {
            return;
          }
          if (ev.key === "Escape") {
            ev.preventDefault();
            ev.stopPropagation();
            if (calendarActive) {
              // First Escape closes the calendar back to the choices row;
              // the next Escape will dismiss the cluster entirely.
              closeCalendar();
              choices.style.display = "";
              choices.removeClass("is-open");
              void choices.offsetWidth;
              choices.addClass("is-open");
              return;
            }
            exitStageTwo();
            moveBtn.focus();
            return;
          }
          if (calendarActive) return;
          for (const choice of moveChoices) {
            if (ev.key === choice.hotkey) {
              ev.preventDefault();
              ev.stopPropagation();
              void runWith(choice.onChoose);
              return;
            }
          }
          if (
            calendarPick &&
            ev.key.toLowerCase() === calendarPick.hotkey.toLowerCase()
          ) {
            ev.preventDefault();
            ev.stopPropagation();
            openCalendar();
          }
        };
        this.contentEl.addEventListener("keydown", keyHandler, true);
      });
    }

    const pomoBtn = actions.createEl("button", {
      cls: "dp-edit-icon-btn",
      attr: { "aria-label": "Pomodoro (p)" },
    });
    pomoBtn.type = "button";
    setIcon(pomoBtn, "timer");
    pomoBtn.addEventListener("click", () => {
      if (this.opts.mode === "new") {
        submit("pomodoro");
        return;
      }
      this.close();
      this.opts.onStartPomodoro!();
    });

    if (this.opts.mode === "edit" && this.opts.onUnschedule) {
      const unschedBtn = actions.createEl("button", {
        cls: "dp-edit-icon-btn",
        attr: { "aria-label": "Unschedule (u)" },
      });
      unschedBtn.type = "button";
      setIcon(unschedBtn, "calendar-x");
      unschedBtn.addEventListener("click", () => void runUnschedule());
    }

    if (this.opts.mode === "edit" && this.opts.onDuplicate) {
      const dupBtn = actions.createEl("button", {
        cls: "dp-edit-icon-btn",
        attr: { "aria-label": "Duplicate (y)" },
      });
      dupBtn.type = "button";
      setIcon(dupBtn, "copy");
      dupBtn.addEventListener("click", () => void runDuplicate());
    }

    const saveBtn = actions.createEl("button", {
      cls: "dp-edit-save-btn mod-cta",
      text: this.opts.mode === "new" ? "Add task" : "Save",
    });
    saveBtn.type = "button";
    saveBtn.addEventListener("click", () => submit());

    // Modal-level hotkeys (edit mode):
    //   i → focus title          o → focus description
    //   d → focus selected duration button
    //   s → show in note         m → open move popover
    //   p → pomodoro             y → duplicate
    //   x → delete (with confirm)
    //   u → unschedule (strip #t/)
    // Attached to `modalEl` so events from the default-focused close button
    // (which sits outside contentEl) still bubble in. Defers to the move
    // stage-two popup / calendar popover when open so their own hotkey
    // tables win, and skips while the user is typing in any input/textarea.
    const focusInputAtEnd = (
      el: HTMLInputElement | HTMLTextAreaElement,
    ): void => {
      el.focus();
      const end = el.value.length;
      el.setSelectionRange(end, end);
    };
    const onModalKey = (ev: KeyboardEvent): void => {
      // Cmd/Ctrl+Enter saves from anywhere, including from any input or
      // textarea — so the user can commit without first clicking out of a
      // focused field.
      if (ev.key === "Enter" && (ev.metaKey || ev.ctrlKey)) {
        ev.preventDefault();
        submit();
        return;
      }
      const target = ev.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA")
      ) {
        return;
      }
      const moveOpen = this.contentEl.querySelector<HTMLElement>(
        ".dp-edit-move-choices",
      );
      if (moveOpen && moveOpen.style.display !== "none") return;
      const calOpen = this.contentEl.querySelector<HTMLElement>(
        ".dp-edit-move-calpopover",
      );
      if (calOpen && calOpen.style.display !== "none") return;
      // Modifier-augmented combos belong to the OS / browser, not us.
      if (ev.metaKey || ev.ctrlKey || ev.altKey) return;
      const k = ev.key.toLowerCase();
      if (k === "i") {
        ev.preventDefault();
        // Append a trailing space (edit mode) so typing immediately extends
        // the title without a manual " " first; submit() trims it.
        if (this.opts.mode === "edit" && !/\s$/.test(input.value)) {
          input.value = input.value + " ";
        }
        focusInputAtEnd(input);
      } else if (k === "o") {
        ev.preventDefault();
        focusInputAtEnd(descInput);
      } else if (k === "d") {
        ev.preventDefault();
        const selected = buttons.find((b) =>
          b.classList.contains("is-selected"),
        );
        (selected ?? buttons[0])?.focus();
      } else if (k === "s") {
        ev.preventDefault();
        showBtn.click();
      } else if (k === "m" && editModeMoveBtn) {
        ev.preventDefault();
        editModeMoveBtn.click();
      } else if (k === "p") {
        ev.preventDefault();
        pomoBtn.click();
      } else if (k === "x" && this.opts.onDelete) {
        ev.preventDefault();
        void runDelete();
      } else if (k === "u" && this.opts.onUnschedule) {
        ev.preventDefault();
        void runUnschedule();
      } else if (k === "y" && this.opts.onDuplicate) {
        ev.preventDefault();
        void runDuplicate();
      }
    };
    this.modalEl.addEventListener("keydown", onModalKey);

    // New mode: focus the title input so the user can immediately type the
    // task name. Edit mode: leave focus on Obsidian's default (the close
    // button, outside contentEl) so the modal-level hotkeys above fire from
    // the get-go without the user first having to Escape out of an input.
    // Press `i` to enter the title; we re-apply the trailing-space trick
    // inside that hotkey so submit()'s trim still cleans it up.
    window.setTimeout(() => {
      if (this.opts.mode !== "new") return;
      input.focus();
      const end = input.value.length;
      input.setSelectionRange(end, end);
    }, 0);
  }

  onClose(): void {
    this.contentEl.empty();
    document.body.removeClass("today-edit-open");
  }
}

// Minimal one-input modal for adding a sub-task from the pomodoro view.
// Enter submits and clears the field so multiple sub-tasks can be added in
// a single session; Esc / blur close the modal.
class SubtaskQuickAddModal extends Modal {
  private onSubmit: (text: string) => Promise<boolean>;

  constructor(app: App, onSubmit: (text: string) => Promise<boolean>) {
    super(app);
    this.onSubmit = onSubmit;
  }

  onOpen(): void {
    this.modalEl.addClass("dp-title-modal");
    this.titleEl.setText("Add sub-task");
    this.contentEl.empty();

    const input = this.contentEl.createEl("input", {
      type: "text",
      cls: "dp-title-input",
      attr: { placeholder: "New sub-task…" },
    });

    let submitting = false;
    const submit = async (): Promise<void> => {
      if (submitting) return;
      const text = input.value.trim();
      if (!text) return;
      submitting = true;
      input.disabled = true;
      const ok = await this.onSubmit(text);
      input.disabled = false;
      submitting = false;
      if (ok) {
        input.value = "";
        input.focus();
      }
    };

    input.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter") {
        ev.preventDefault();
        void submit();
      }
    });

    window.setTimeout(() => input.focus(), 0);
  }

  onClose(): void {
    this.contentEl.empty();
  }
}
