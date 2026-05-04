import { ItemView, WorkspaceLeaf, TFile, Notice, setIcon } from "obsidian";
import type DayPlannerPlugin from "./main";
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
} from "./parser";
import {
  partition,
  computeTotals,
  layoutTimeline,
  LayoutBlock,
} from "./scheduler";
import { resolveTodayDailyNote, ensureTodayDailyNote } from "./dailyNote";

export const VIEW_TYPE_DAY_PLANNER = "day-planner-view";

interface DragPayload {
  filePath: string;
  lineNumber: number;
  rawLine: string;
  source: "timeline" | "unscheduled";
}

export class DayPlannerView extends ItemView {
  plugin: DayPlannerPlugin;
  private rerenderTimer: number | null = null;
  private dragPayload: DragPayload | null = null;

  constructor(leaf: WorkspaceLeaf, plugin: DayPlannerPlugin) {
    super(leaf);
    this.plugin = plugin;
  }

  getViewType(): string {
    return VIEW_TYPE_DAY_PLANNER;
  }

  getDisplayText(): string {
    return "Day Planner";
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
    await this.render();
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

  async render(): Promise<void> {
    const root = this.containerEl.children[1] as HTMLElement;
    root.empty();
    root.addClass("day-planner-root");

    const dailyResolved = await resolveTodayDailyNote(
      this.app,
      this.plugin.settings.dailyNoteFormatFallback,
    );
    const dailyTasks = await this.readTasks(dailyResolved.file);

    const activeFile = this.app.workspace.getActiveFile();
    const activeIsDaily =
      activeFile && dailyResolved.file && activeFile.path === dailyResolved.file.path;
    const activeTasks =
      activeFile && !activeIsDaily ? await this.readTasks(activeFile) : [];

    this.renderSection(
      root,
      "Today",
      this.formatToday(),
      dailyResolved.file,
      dailyResolved.path,
      dailyTasks,
      true,
    );

    if (activeFile && !activeIsDaily) {
      this.renderSection(
        root,
        `Active note: ${activeFile.basename}`,
        "",
        activeFile,
        activeFile.path,
        activeTasks,
        false,
      );
    }
  }

  private async readTasks(file: TFile | null): Promise<ParsedTask[]> {
    if (!file) return [];
    const content = await this.app.vault.read(file);
    return parseFileTasks(file.path, content, this.plugin.settings.prefixes);
  }

  private formatToday(): string {
    const d = new Date();
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
    isPrimary: boolean,
  ): void {
    const section = parent.createDiv({ cls: "dp-section" });

    const header = section.createDiv({ cls: "dp-header" });
    header.createDiv({ cls: "dp-title", text: title });
    if (subtitle) header.createDiv({ cls: "dp-subtitle", text: subtitle });

    const totals = computeTotals(tasks);
    const totalsRow = header.createDiv({ cls: "dp-totals" });
    totalsRow.createSpan({
      text: `Scheduled: ${formatTotal(totals.scheduledMin)}`,
    });
    totalsRow.createSpan({
      text: `Unscheduled: ${formatTotal(totals.unscheduledMin)}`,
    });

    if (!file && isPrimary) {
      const create = section.createEl("button", {
        cls: "dp-create",
        text: `Create today's daily note (${path})`,
      });
      create.addEventListener("click", async () => {
        await ensureTodayDailyNote(this.app);
        this.scheduleRender();
      });
      return;
    }

    if (!file) return;

    const body = section.createDiv({ cls: "dp-body" });
    const { scheduled, unscheduled } = partition(tasks);

    this.renderTimeline(body, file, scheduled);
    this.renderUnscheduled(body, file, unscheduled);
  }

  private renderTimeline(
    parent: HTMLElement,
    file: TFile,
    scheduled: ParsedTask[],
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
    for (const block of layout) this.renderBlock(blocksLayer, file, block);

    timeline.addEventListener("dragover", (ev) => {
      if (!this.dragPayload) return;
      ev.preventDefault();
    });
    timeline.addEventListener("drop", (ev) => {
      if (!this.dragPayload) return;
      ev.preventDefault();
      const rect = timeline.getBoundingClientRect();
      const yPx = ev.clientY - rect.top + timeline.scrollTop;
      const rawMin = yPx / settings.pxPerMin + startMin;
      const snapped = snapToInterval(rawMin, settings.snapMin);
      const clamped = Math.max(startMin, Math.min(endMin - 15, snapped));
      void this.handleDropOnTimeline(this.dragPayload, clamped);
      this.dragPayload = null;
    });
  }

  private renderBlock(
    layer: HTMLElement,
    file: TFile,
    block: LayoutBlock,
  ): void {
    const el = layer.createDiv({ cls: "dp-block" });
    el.style.top = `${block.topPx}px`;
    el.style.height = `${Math.max(18, block.heightPx)}px`;
    el.style.left = `${block.leftPct}%`;
    el.style.width = `${block.widthPct}%`;
    if (block.task.checked) el.addClass("is-done");
    el.draggable = true;

    const time = el.createDiv({ cls: "dp-block-time" });
    time.textContent = this.formatBlockTime(block.task);

    const text = el.createDiv({ cls: "dp-block-text" });
    text.textContent = this.cleanBody(block.task.body);

    el.addEventListener("dragstart", (ev) => {
      this.dragPayload = {
        filePath: file.path,
        lineNumber: block.task.lineNumber,
        rawLine: block.task.rawLine,
        source: "timeline",
      };
      ev.dataTransfer?.setData("text/plain", block.task.rawLine);
      if (ev.dataTransfer) ev.dataTransfer.effectAllowed = "move";
    });
    el.addEventListener("click", () => this.openLine(file, block.task.lineNumber));

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
      },
      (line) => setDurationTag(line, newDurationMin, prefixes),
    );
  }

  private renderUnscheduled(
    parent: HTMLElement,
    file: TFile,
    unscheduled: ParsedTask[],
  ): void {
    const list = parent.createDiv({ cls: "dp-unscheduled" });
    const head = list.createDiv({ cls: "dp-unscheduled-head" });
    head.createSpan({ text: "Unscheduled" });
    const icon = head.createSpan({ cls: "dp-icon" });
    setIcon(icon, "list");

    if (unscheduled.length === 0) {
      list.createDiv({ cls: "dp-empty", text: "No unscheduled tasks." });
    }

    unscheduled.forEach((task, idx) => {
      const card = list.createDiv({ cls: "dp-card" });
      if (task.checked) card.addClass("is-done");
      card.draggable = true;
      const meta = card.createDiv({ cls: "dp-card-meta" });
      meta.textContent = formatTotal(task.durationMin);
      const text = card.createDiv({ cls: "dp-card-text" });
      text.textContent = this.cleanBody(task.body);

      card.addEventListener("dragstart", (ev) => {
        this.dragPayload = {
          filePath: file.path,
          lineNumber: task.lineNumber,
          rawLine: task.rawLine,
          source: "unscheduled",
        };
        ev.dataTransfer?.setData("text/plain", task.rawLine);
        if (ev.dataTransfer) ev.dataTransfer.effectAllowed = "move";
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
      card.addEventListener("click", () => this.openLine(file, task.lineNumber));
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
      new Notice("Day Planner: source file no longer exists.");
      this.scheduleRender();
      return;
    }
    const content = await this.app.vault.read(file);
    const lines = content.split("\n");
    const idx = payload.lineNumber;
    if (idx < 0 || idx >= lines.length || lines[idx] !== payload.rawLine) {
      new Notice("Day Planner: file changed since last render — refreshing.");
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
      .replace(/\s+/g, " ")
      .trim();
  }

  private async openLine(file: TFile, line: number): Promise<void> {
    const leaf = this.app.workspace.getLeaf(false);
    await leaf.openFile(file);
    const view = leaf.view as { editor?: { setCursor: (p: { line: number; ch: number }) => void } };
    view.editor?.setCursor({ line, ch: 0 });
  }
}
