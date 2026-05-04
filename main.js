var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => DayPlannerPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian4 = require("obsidian");

// src/view.ts
var import_obsidian2 = require("obsidian");

// src/parser.ts
var DEFAULT_PREFIXES = {
  duration: "d",
  time: "h",
  order: "o"
};
var TASK_LINE = /^(\s*)- \[([ xX/\-!?*<>])\]\s+(.*)$/;
function buildTagRegexes(prefixes) {
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return {
    duration: new RegExp(
      `#${esc(prefixes.duration)}\\/(?:(\\d+)h)?(?:(\\d+)m)?(?=\\s|$)`
    ),
    time: new RegExp(
      `#${esc(prefixes.time)}\\/(\\d{1,2})(\\d{2})?(am?|pm?)\\b`,
      "i"
    ),
    order: new RegExp(`#${esc(prefixes.order)}\\/(\\d+)\\b`)
  };
}
function parseDuration(body, prefixes) {
  const m = buildTagRegexes(prefixes).duration.exec(body);
  if (!m)
    return null;
  const h = m[1] ? parseInt(m[1], 10) : 0;
  const min = m[2] ? parseInt(m[2], 10) : 0;
  const total = h * 60 + min;
  return total > 0 ? total : null;
}
function parseTime(body, prefixes) {
  const m = buildTagRegexes(prefixes).time.exec(body);
  if (!m)
    return null;
  const hour = parseInt(m[1], 10);
  const min = m[2] ? parseInt(m[2], 10) : 0;
  const ampm = m[3].toLowerCase().startsWith("p") ? "p" : "a";
  if (hour < 1 || hour > 12 || min > 59)
    return null;
  let h24 = hour % 12;
  if (ampm === "p")
    h24 += 12;
  return h24 * 60 + min;
}
function parseOrder(body, prefixes) {
  const m = buildTagRegexes(prefixes).order.exec(body);
  return m ? parseInt(m[1], 10) : null;
}
function formatDuration(totalMin, prefixes) {
  const safe = Math.max(1, Math.round(totalMin));
  const h = Math.floor(safe / 60);
  const m = safe % 60;
  let body;
  if (h === 0)
    body = `${m}m`;
  else if (m === 0)
    body = `${h}h`;
  else
    body = `${h}h${m}m`;
  return `#${prefixes.duration}/${body}`;
}
function setDurationTag(rawLine, newDurationMin, prefixes) {
  const re = buildTagRegexes(prefixes).duration;
  const newTag = formatDuration(newDurationMin, prefixes);
  if (re.test(rawLine))
    return rawLine.replace(re, newTag);
  return appendTag(rawLine, newTag);
}
function formatTime(totalMin, prefixes) {
  const h24 = Math.floor(totalMin / 60) % 24;
  const min = totalMin % 60;
  const ampm = h24 < 12 ? "a" : "p";
  let h12 = h24 % 12;
  if (h12 === 0)
    h12 = 12;
  const minPart = min === 0 ? "" : min.toString().padStart(2, "0");
  return `#${prefixes.time}/${h12}${minPart}${ampm}`;
}
function parseTaskLine(filePath, lineNumber, rawLine, prefixes, defaultDurationMin) {
  const m = TASK_LINE.exec(rawLine);
  if (!m)
    return null;
  const body = m[3];
  const explicitDuration = parseDuration(body, prefixes);
  const startMin = parseTime(body, prefixes);
  const durationMin = explicitDuration != null ? explicitDuration : defaultDurationMin;
  const order = parseOrder(body, prefixes);
  const checked = m[2] !== " ";
  return {
    filePath,
    lineNumber,
    rawLine,
    body,
    durationMin,
    hasExplicitDuration: explicitDuration !== null,
    startMin,
    order,
    checked
  };
}
function parseFileTasks(filePath, fileContent, prefixes, defaultDurationMin) {
  const lines = fileContent.split("\n");
  const tasks = [];
  for (let i = 0; i < lines.length; i++) {
    const t = parseTaskLine(filePath, i, lines[i], prefixes, defaultDurationMin);
    if (t)
      tasks.push(t);
  }
  return tasks;
}
function setTimeTag(rawLine, newStartMin, prefixes) {
  const re = buildTagRegexes(prefixes).time;
  const newTag = formatTime(newStartMin, prefixes);
  if (re.test(rawLine)) {
    return rawLine.replace(re, newTag);
  }
  return appendTag(rawLine, newTag);
}
function removeTimeTag(rawLine, prefixes) {
  const re = buildTagRegexes(prefixes).time;
  return rawLine.replace(re, "").replace(/[ \t]+$/, "").replace(/  +/g, " ");
}
function setOrderTag(rawLine, order, prefixes) {
  const re = buildTagRegexes(prefixes).order;
  const newTag = `#${prefixes.order}/${order}`;
  if (re.test(rawLine)) {
    return rawLine.replace(re, newTag);
  }
  return appendTag(rawLine, newTag);
}
function removeOrderTag(rawLine, prefixes) {
  const re = buildTagRegexes(prefixes).order;
  return rawLine.replace(re, "").replace(/[ \t]+$/, "").replace(/  +/g, " ");
}
function appendTag(rawLine, tag) {
  const trimmed = rawLine.replace(/[ \t]+$/, "");
  const sep = trimmed.endsWith(" ") ? "" : " ";
  return trimmed + sep + tag;
}
function snapToInterval(min, intervalMin) {
  return Math.round(min / intervalMin) * intervalMin;
}
function formatTotal(totalMin) {
  if (totalMin <= 0)
    return "0m";
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h === 0)
    return `${m}m`;
  if (m === 0)
    return `${h}h`;
  return `${h}h ${m}m`;
}

// src/scheduler.ts
function partition(tasks) {
  const scheduled = [];
  const unscheduled = [];
  for (const t of tasks) {
    if (t.startMin !== null)
      scheduled.push(t);
    else
      unscheduled.push(t);
  }
  scheduled.sort((a, b) => a.startMin - b.startMin);
  unscheduled.sort((a, b) => {
    if (a.order !== null && b.order !== null)
      return a.order - b.order;
    if (a.order !== null)
      return -1;
    if (b.order !== null)
      return 1;
    return a.lineNumber - b.lineNumber;
  });
  return { scheduled, unscheduled };
}
function computeTotals(tasks) {
  let scheduledMin = 0;
  let unscheduledMin = 0;
  for (const t of tasks) {
    if (t.startMin !== null)
      scheduledMin += t.durationMin;
    else
      unscheduledMin += t.durationMin;
  }
  return { scheduledMin, unscheduledMin };
}
function layoutTimeline(scheduled, rangeStartMin, pxPerMin) {
  const groups = groupOverlaps(scheduled);
  const blocks = [];
  for (const group of groups) {
    const columns = [];
    for (const t of group) {
      let placed = false;
      for (const col of columns) {
        const last = col[col.length - 1];
        if (last.startMin + last.durationMin <= t.startMin) {
          col.push(t);
          placed = true;
          break;
        }
      }
      if (!placed)
        columns.push([t]);
    }
    const colCount = columns.length;
    const widthPct = 100 / colCount;
    columns.forEach((col, idx) => {
      for (const t of col) {
        blocks.push({
          task: t,
          topPx: (t.startMin - rangeStartMin) * pxPerMin,
          heightPx: t.durationMin * pxPerMin,
          leftPct: idx * widthPct,
          widthPct
        });
      }
    });
  }
  return blocks;
}
function groupOverlaps(scheduled) {
  const groups = [];
  let current = [];
  let currentEnd = -1;
  for (const t of scheduled) {
    const start = t.startMin;
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
  if (current.length)
    groups.push(current);
  return groups;
}

// src/dailyNote.ts
var import_obsidian = require("obsidian");
async function resolveDailyNote(app, date, fallback) {
  var _a;
  const opts = readDailyNotesOptions(app);
  const format = (opts.format || fallback.format).trim();
  const folder = ((_a = opts.folder) != null ? _a : fallback.folder).trim();
  const fileName = formatDate(date, format) + ".md";
  const path = (0, import_obsidian.normalizePath)(folder ? `${folder}/${fileName}` : fileName);
  const file = app.vault.getAbstractFileByPath(path);
  return {
    path,
    file: file instanceof import_obsidian.TFile ? file : null
  };
}
async function ensureDailyNote(app, date, fallback, notify = true) {
  const resolved = await resolveDailyNote(app, date, fallback);
  if (resolved.file)
    return resolved.file;
  const folder = resolved.path.includes("/") ? resolved.path.slice(0, resolved.path.lastIndexOf("/")) : "";
  if (folder) {
    const existing = app.vault.getAbstractFileByPath(folder);
    if (!existing)
      await app.vault.createFolder(folder);
  }
  const file = await app.vault.create(resolved.path, "");
  if (notify)
    new import_obsidian.Notice(`Created ${resolved.path}`);
  return file;
}
function readDailyNotesOptions(app) {
  var _a, _b, _c;
  const internal = app.internalPlugins;
  const plugin = (_a = internal == null ? void 0 : internal.getPluginById) == null ? void 0 : _a.call(internal, "daily-notes");
  return (_c = (_b = plugin == null ? void 0 : plugin.instance) == null ? void 0 : _b.options) != null ? _c : {};
}
function formatDate(d, format) {
  const pad = (n, w = 2) => n.toString().padStart(w, "0");
  const replacements = {
    YYYY: d.getFullYear().toString(),
    MM: pad(d.getMonth() + 1),
    DD: pad(d.getDate()),
    HH: pad(d.getHours()),
    mm: pad(d.getMinutes()),
    ss: pad(d.getSeconds())
  };
  return format.replace(/YYYY|MM|DD|HH|mm|ss/g, (m) => {
    var _a;
    return (_a = replacements[m]) != null ? _a : m;
  });
}
function addDays(d, n) {
  const next = new Date(d);
  next.setDate(next.getDate() + n);
  return next;
}
function addMonths(d, n) {
  const next = new Date(d);
  next.setDate(1);
  next.setMonth(next.getMonth() + n);
  return next;
}
function startOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function endOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}
function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function startOfDay(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

// src/view.ts
var VIEW_TYPE_DAY_PLANNER = "day-planner-view";
var TRANSPARENT_PIXEL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkAAIAAAoAAv/lxKUAAAAASUVORK5CYII=";
var DayPlannerView = class extends import_obsidian2.ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.rerenderTimer = null;
    this.dragPayload = null;
    this.dropIndicator = null;
    this.selectedDate = startOfDay(new Date());
    this.calendarMonth = startOfMonth(new Date());
    this.calendarOpen = false;
    this.plugin = plugin;
  }
  getViewType() {
    return VIEW_TYPE_DAY_PLANNER;
  }
  getDisplayText() {
    return "Day Planner";
  }
  getIcon() {
    return "calendar-clock";
  }
  async onOpen() {
    this.registerEvent(
      this.app.metadataCache.on("changed", (file) => {
        if (file instanceof import_obsidian2.TFile)
          this.scheduleRender();
      })
    );
    this.registerEvent(
      this.app.workspace.on("active-leaf-change", () => this.scheduleRender())
    );
    this.registerEvent(
      this.app.vault.on("modify", () => this.scheduleRender())
    );
    await this.render();
  }
  async onClose() {
    if (this.rerenderTimer !== null)
      window.clearTimeout(this.rerenderTimer);
  }
  scheduleRender() {
    if (this.rerenderTimer !== null)
      window.clearTimeout(this.rerenderTimer);
    this.rerenderTimer = window.setTimeout(() => {
      this.rerenderTimer = null;
      void this.render();
    }, 100);
  }
  async render() {
    const root = this.containerEl.children[1];
    const prevRootScroll = root.scrollTop;
    const prevTimelineScrolls = Array.from(
      root.querySelectorAll(".dp-timeline-wrap")
    ).map((el) => el.scrollTop);
    root.empty();
    root.addClass("day-planner-root");
    const fallback = {
      folder: this.plugin.settings.dailyNoteFolderFallback,
      format: this.plugin.settings.dailyNoteFormatFallback
    };
    const dailyResolved = await resolveDailyNote(
      this.app,
      this.selectedDate,
      fallback
    );
    const dailyTasks = await this.readTasks(dailyResolved.file);
    const activeFile = this.app.workspace.getActiveFile();
    const activeIsDaily = activeFile && dailyResolved.file && activeFile.path === dailyResolved.file.path;
    const activeTasks = activeFile && !activeIsDaily ? await this.readTasks(activeFile) : [];
    this.renderDateNav(root);
    this.renderSection(
      root,
      this.formatDateLabel(this.selectedDate),
      dailyResolved.path,
      dailyResolved.file,
      dailyResolved.path,
      dailyTasks,
      true
    );
    if (activeFile && !activeIsDaily) {
      this.renderSection(
        root,
        `Active note: ${activeFile.basename}`,
        "",
        activeFile,
        activeFile.path,
        activeTasks,
        false
      );
    }
    root.scrollTop = prevRootScroll;
    const newTimelines = root.querySelectorAll(".dp-timeline-wrap");
    newTimelines.forEach((el, i) => {
      const prev = prevTimelineScrolls[i];
      if (prev !== void 0)
        el.scrollTop = prev;
    });
  }
  renderDateNav(parent) {
    const nav = parent.createDiv({ cls: "dp-datenav" });
    const prev = nav.createEl("button", {
      cls: "dp-nav-btn dp-nav-arrow",
      attr: { "aria-label": "Previous day" }
    });
    (0, import_obsidian2.setIcon)(prev, "chevron-left");
    const label = nav.createDiv({ cls: "dp-datenav-label" });
    label.textContent = this.formatDateLabel(this.selectedDate);
    const today = nav.createEl("button", { cls: "dp-today-btn", text: "Today" });
    const calBtn = nav.createEl("button", {
      cls: "dp-cal-btn",
      attr: { "aria-label": "Toggle calendar" }
    });
    (0, import_obsidian2.setIcon)(calBtn, "calendar");
    if (this.calendarOpen)
      calBtn.addClass("is-active");
    const next = nav.createEl("button", {
      cls: "dp-nav-btn dp-nav-arrow",
      attr: { "aria-label": "Next day" }
    });
    (0, import_obsidian2.setIcon)(next, "chevron-right");
    prev.addEventListener(
      "click",
      () => void this.navigateTo(addDays(this.selectedDate, -1))
    );
    next.addEventListener(
      "click",
      () => void this.navigateTo(addDays(this.selectedDate, 1))
    );
    today.addEventListener("click", () => void this.navigateTo(new Date()));
    calBtn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      this.calendarOpen = !this.calendarOpen;
      this.scheduleRender();
    });
    if (this.calendarOpen)
      this.renderCalendar(nav);
  }
  async navigateTo(date) {
    const target = startOfDay(date);
    this.selectedDate = target;
    this.calendarMonth = startOfMonth(target);
    const fallback = {
      folder: this.plugin.settings.dailyNoteFolderFallback,
      format: this.plugin.settings.dailyNoteFormatFallback
    };
    const resolved = await resolveDailyNote(this.app, target, fallback);
    if (!resolved.file) {
      try {
        await ensureDailyNote(this.app, target, fallback);
      } catch (e) {
        new import_obsidian2.Notice(`Day Planner: failed to create note (${e.message})`);
      }
    }
    this.scheduleRender();
  }
  renderCalendar(parent) {
    const cal = parent.createDiv({ cls: "dp-calendar" });
    const head = cal.createDiv({ cls: "dp-cal-head" });
    const prev = head.createEl("button", { cls: "dp-nav-btn", text: "\u25C0" });
    const monthLabel = head.createDiv({ cls: "dp-cal-month" });
    monthLabel.textContent = this.calendarMonth.toLocaleDateString(void 0, {
      month: "long",
      year: "numeric"
    });
    const next = head.createEl("button", { cls: "dp-nav-btn", text: "\u25B6" });
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
        i
      );
      this.renderCalDay(grid, d, today, false);
    }
    const totalCells = startDow + monthEnd.getDate();
    const trailing = (7 - totalCells % 7) % 7;
    for (let i = 1; i <= trailing; i++) {
      const d = addDays(monthEnd, i);
      this.renderCalDay(grid, d, today, true);
    }
  }
  renderCalDay(grid, d, today, isOtherMonth) {
    const cell = grid.createDiv({ cls: "dp-cal-day", text: d.getDate().toString() });
    if (isOtherMonth)
      cell.addClass("is-other-month");
    if (sameDay(d, today))
      cell.addClass("is-today");
    if (sameDay(d, this.selectedDate))
      cell.addClass("is-selected");
    cell.addEventListener("click", () => {
      this.calendarOpen = false;
      void this.navigateTo(d);
    });
  }
  formatDateLabel(d) {
    return d.toLocaleDateString(void 0, {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  }
  async readTasks(file) {
    if (!file)
      return [];
    const content = await this.app.vault.read(file);
    return parseFileTasks(
      file.path,
      content,
      this.plugin.settings.prefixes,
      this.plugin.settings.defaultDurationMin
    );
  }
  renderSection(parent, title, subtitle, file, path, tasks, isPrimary) {
    const section = parent.createDiv({ cls: "dp-section" });
    const header = section.createDiv({ cls: "dp-header" });
    if (!isPrimary && title)
      header.createDiv({ cls: "dp-title", text: title });
    if (subtitle)
      header.createDiv({ cls: "dp-subtitle", text: subtitle });
    const totals = computeTotals(tasks);
    const totalsRow = header.createDiv({ cls: "dp-totals" });
    totalsRow.createSpan({
      text: `Scheduled: ${formatTotal(totals.scheduledMin)}`
    });
    totalsRow.createSpan({
      text: `Unscheduled: ${formatTotal(totals.unscheduledMin)}`
    });
    if (!file && isPrimary) {
      const create = section.createEl("button", {
        cls: "dp-create",
        text: `Create ${path}`
      });
      create.addEventListener("click", async () => {
        const fallback = {
          folder: this.plugin.settings.dailyNoteFolderFallback,
          format: this.plugin.settings.dailyNoteFormatFallback
        };
        await ensureDailyNote(this.app, this.selectedDate, fallback);
        this.scheduleRender();
      });
      return;
    }
    if (!file)
      return;
    const body = section.createDiv({ cls: "dp-body" });
    const { scheduled, unscheduled } = partition(tasks);
    this.renderTimeline(body, file, scheduled);
    this.renderUnscheduled(body, file, unscheduled);
  }
  renderTimeline(parent, file, scheduled) {
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
      this.renderBlock(blocksLayer, file, block);
    const computeSnap = (clientY) => {
      if (!this.dragPayload)
        return null;
      const rect = timeline.getBoundingClientRect();
      const yPx = clientY - rect.top + timeline.scrollTop - this.dragPayload.grabOffsetY;
      const rawMin = yPx / settings.pxPerMin + startMin;
      const snapped = snapToInterval(rawMin, settings.snapMin);
      const maxStart = endMin - this.dragPayload.durationMin;
      return Math.max(startMin, Math.min(maxStart, snapped));
    };
    timeline.addEventListener("dragover", (ev) => {
      if (!this.dragPayload)
        return;
      ev.preventDefault();
      const snapped = computeSnap(ev.clientY);
      if (snapped === null)
        return;
      this.showDropIndicator(
        blocksLayer,
        snapped,
        this.dragPayload.durationMin,
        startMin,
        settings.pxPerMin
      );
    });
    timeline.addEventListener("drop", (ev) => {
      if (!this.dragPayload)
        return;
      ev.preventDefault();
      const snapped = computeSnap(ev.clientY);
      if (snapped !== null)
        void this.handleDropOnTimeline(this.dragPayload, snapped);
      this.dragPayload = null;
      this.hideDropIndicator();
    });
    timeline.addEventListener("dragleave", (ev) => {
      const related = ev.relatedTarget;
      if (!related || !timeline.contains(related))
        this.hideDropIndicator();
    });
  }
  showDropIndicator(layer, snappedStartMin, durationMin, rangeStartMin, pxPerMin) {
    var _a, _b;
    if (!this.dropIndicator || this.dropIndicator.parentElement !== layer) {
      (_a = this.dropIndicator) == null ? void 0 : _a.detach();
      this.dropIndicator = layer.createDiv({ cls: "dp-drop-indicator" });
    }
    const ind = this.dropIndicator;
    ind.empty();
    ind.style.top = `${(snappedStartMin - rangeStartMin) * pxPerMin}px`;
    ind.style.height = `${Math.max(18, durationMin * pxPerMin)}px`;
    ind.createDiv({
      cls: "dp-drop-indicator-time",
      text: `${this.fmtClock(snappedStartMin)}\u2013${this.fmtClock(
        snappedStartMin + durationMin
      )}`
    });
    if ((_b = this.dragPayload) == null ? void 0 : _b.bodyText) {
      ind.createDiv({
        cls: "dp-drop-indicator-text",
        text: this.dragPayload.bodyText
      });
    }
  }
  hideDropIndicator() {
    var _a;
    (_a = this.dropIndicator) == null ? void 0 : _a.detach();
    this.dropIndicator = null;
  }
  renderBlock(layer, file, block) {
    const el = layer.createDiv({ cls: "dp-block" });
    el.style.top = `${block.topPx}px`;
    el.style.height = `${Math.max(18, block.heightPx)}px`;
    el.style.left = `${block.leftPct}%`;
    el.style.width = `${block.widthPct}%`;
    if (block.task.checked)
      el.addClass("is-done");
    if (!block.task.hasExplicitDuration)
      el.addClass("is-implicit-duration");
    el.draggable = true;
    const row = el.createDiv({ cls: "dp-block-row" });
    if (!block.task.hasExplicitDuration) {
      const warn = row.createSpan({ cls: "dp-warn" });
      (0, import_obsidian2.setIcon)(warn, "alert-triangle");
      warn.setAttribute("aria-label", "No #d/ tag \u2014 using default duration");
    }
    row.createSpan({
      cls: "dp-block-time",
      text: this.formatBlockTime(block.task)
    });
    row.createSpan({ cls: "dp-block-sep", text: "\xB7" });
    row.createSpan({
      cls: "dp-block-text",
      text: this.cleanBody(block.task.body)
    });
    el.addEventListener("dragstart", (ev) => {
      var _a;
      const rect = el.getBoundingClientRect();
      this.dragPayload = {
        filePath: file.path,
        lineNumber: block.task.lineNumber,
        rawLine: block.task.rawLine,
        source: "timeline",
        grabOffsetY: ev.clientY - rect.top,
        durationMin: block.task.durationMin,
        bodyText: this.cleanBody(block.task.body)
      };
      el.addClass("is-dragging");
      this.suppressNativeDragImage(ev);
      (_a = ev.dataTransfer) == null ? void 0 : _a.setData("text/plain", block.task.rawLine);
      if (ev.dataTransfer)
        ev.dataTransfer.effectAllowed = "move";
    });
    el.addEventListener("dragend", () => {
      el.removeClass("is-dragging");
      this.dragPayload = null;
      this.hideDropIndicator();
    });
    el.addEventListener("click", () => this.openLine(file, block.task.lineNumber));
    const handle = el.createDiv({ cls: "dp-resize-handle" });
    handle.addEventListener(
      "pointerdown",
      (ev) => this.beginResize(ev, el, file, block)
    );
  }
  beginResize(ev, blockEl, file, block) {
    ev.preventDefault();
    ev.stopPropagation();
    const handle = ev.currentTarget;
    const settings = this.plugin.settings;
    const startY = ev.clientY;
    const startHeightPx = blockEl.offsetHeight;
    const minDuration = settings.snapMin;
    const pxPerMin = settings.pxPerMin;
    let pendingDuration = block.task.durationMin;
    blockEl.draggable = false;
    blockEl.addClass("is-resizing");
    handle.setPointerCapture(ev.pointerId);
    const onMove = (e) => {
      const dy = e.clientY - startY;
      const newHeightPx = Math.max(minDuration * pxPerMin, startHeightPx + dy);
      const rawMin = newHeightPx / pxPerMin;
      pendingDuration = Math.max(
        minDuration,
        snapToInterval(rawMin, settings.snapMin)
      );
      blockEl.style.height = `${pendingDuration * pxPerMin}px`;
      const timeEl = blockEl.querySelector(".dp-block-time");
      if (timeEl && block.task.startMin !== null) {
        const start = block.task.startMin;
        timeEl.textContent = `${this.fmtClock(start)}\u2013${this.fmtClock(start + pendingDuration)}`;
      }
    };
    const onUp = (e) => {
      handle.removeEventListener("pointermove", onMove);
      handle.removeEventListener("pointerup", onUp);
      handle.removeEventListener("pointercancel", onUp);
      blockEl.removeClass("is-resizing");
      try {
        handle.releasePointerCapture(e.pointerId);
      } catch (e2) {
      }
      const finalDuration = pendingDuration;
      if (finalDuration === block.task.durationMin) {
        blockEl.draggable = true;
        return;
      }
      void this.applyDurationChange(file, block.task, finalDuration).finally(
        () => {
          blockEl.draggable = true;
        }
      );
    };
    handle.addEventListener("pointermove", onMove);
    handle.addEventListener("pointerup", onUp);
    handle.addEventListener("pointercancel", onUp);
  }
  async applyDurationChange(file, task, newDurationMin) {
    const prefixes = this.plugin.settings.prefixes;
    await this.editLine(
      {
        filePath: file.path,
        lineNumber: task.lineNumber,
        rawLine: task.rawLine,
        source: "timeline",
        grabOffsetY: 0,
        durationMin: task.durationMin,
        bodyText: ""
      },
      (line) => setDurationTag(line, newDurationMin, prefixes)
    );
  }
  suppressNativeDragImage(ev) {
    if (!ev.dataTransfer)
      return;
    const img = new Image();
    img.src = TRANSPARENT_PIXEL;
    try {
      ev.dataTransfer.setDragImage(img, 0, 0);
    } catch (e) {
    }
  }
  renderUnscheduled(parent, file, unscheduled) {
    const list = parent.createDiv({ cls: "dp-unscheduled" });
    const head = list.createDiv({ cls: "dp-unscheduled-head" });
    head.createSpan({ text: "Unscheduled" });
    const icon = head.createSpan({ cls: "dp-icon" });
    (0, import_obsidian2.setIcon)(icon, "list");
    if (unscheduled.length === 0) {
      list.createDiv({ cls: "dp-empty", text: "No unscheduled tasks." });
    }
    unscheduled.forEach((task, idx) => {
      const card = list.createDiv({ cls: "dp-card" });
      if (task.checked)
        card.addClass("is-done");
      if (!task.hasExplicitDuration)
        card.addClass("is-implicit-duration");
      card.draggable = true;
      const meta = card.createDiv({ cls: "dp-card-meta" });
      if (!task.hasExplicitDuration) {
        const warn = meta.createSpan({ cls: "dp-warn" });
        (0, import_obsidian2.setIcon)(warn, "alert-triangle");
        warn.setAttribute("aria-label", "No #d/ tag \u2014 using default duration");
      }
      meta.createSpan({ text: formatTotal(task.durationMin) });
      const text = card.createDiv({ cls: "dp-card-text" });
      text.textContent = this.cleanBody(task.body);
      card.addEventListener("dragstart", (ev) => {
        var _a;
        const rect = card.getBoundingClientRect();
        this.dragPayload = {
          filePath: file.path,
          lineNumber: task.lineNumber,
          rawLine: task.rawLine,
          source: "unscheduled",
          grabOffsetY: ev.clientY - rect.top,
          durationMin: task.durationMin,
          bodyText: this.cleanBody(task.body)
        };
        card.addClass("is-dragging");
        this.suppressNativeDragImage(ev);
        (_a = ev.dataTransfer) == null ? void 0 : _a.setData("text/plain", task.rawLine);
        if (ev.dataTransfer)
          ev.dataTransfer.effectAllowed = "move";
      });
      card.addEventListener("dragend", () => {
        card.removeClass("is-dragging");
        this.dragPayload = null;
        this.hideDropIndicator();
      });
      card.addEventListener("dragover", (ev) => {
        var _a;
        if (((_a = this.dragPayload) == null ? void 0 : _a.source) === "unscheduled")
          ev.preventDefault();
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
          idx
        );
        this.dragPayload = null;
      });
      card.addEventListener("click", () => this.openLine(file, task.lineNumber));
    });
    list.addEventListener("dragover", (ev) => {
      var _a;
      if (((_a = this.dragPayload) == null ? void 0 : _a.source) === "timeline")
        ev.preventDefault();
    });
    list.addEventListener("drop", (ev) => {
      if (!this.dragPayload || this.dragPayload.source !== "timeline")
        return;
      ev.preventDefault();
      void this.handleUnschedule(this.dragPayload, unscheduled);
      this.dragPayload = null;
    });
  }
  async handleDropOnTimeline(payload, newStartMin) {
    const prefixes = this.plugin.settings.prefixes;
    await this.editLine(payload, (line) => {
      let next = setTimeTag(line, newStartMin, prefixes);
      next = removeOrderTag(next, prefixes);
      return next;
    });
  }
  async handleUnschedule(payload, unscheduled) {
    const prefixes = this.plugin.settings.prefixes;
    const maxOrder = unscheduled.reduce(
      (acc, t) => t.order !== null && t.order > acc ? t.order : acc,
      0
    );
    await this.editLine(payload, (line) => {
      let next = removeTimeTag(line, prefixes);
      next = setOrderTag(next, maxOrder + 1, prefixes);
      return next;
    });
  }
  async handleReorderUnscheduled(file, unscheduled, payload, targetIdx) {
    const prefixes = this.plugin.settings.prefixes;
    const sourceIdx = unscheduled.findIndex(
      (t) => t.lineNumber === payload.lineNumber
    );
    if (sourceIdx === -1 || sourceIdx === targetIdx)
      return;
    const reordered = [...unscheduled];
    const [moved] = reordered.splice(sourceIdx, 1);
    reordered.splice(targetIdx, 0, moved);
    const content = await this.app.vault.read(file);
    const lines = content.split("\n");
    let dirty = false;
    reordered.forEach((task, i) => {
      const desiredOrder = i + 1;
      if (task.order === desiredOrder)
        return;
      const idx = task.lineNumber;
      if (idx < 0 || idx >= lines.length)
        return;
      if (lines[idx] !== task.rawLine)
        return;
      lines[idx] = setOrderTag(lines[idx], desiredOrder, prefixes);
      dirty = true;
    });
    if (!dirty)
      return;
    await this.app.vault.modify(file, lines.join("\n"));
  }
  async editLine(payload, transform) {
    const file = this.app.vault.getAbstractFileByPath(payload.filePath);
    if (!(file instanceof import_obsidian2.TFile)) {
      new import_obsidian2.Notice("Day Planner: source file no longer exists.");
      this.scheduleRender();
      return;
    }
    const content = await this.app.vault.read(file);
    const lines = content.split("\n");
    const idx = payload.lineNumber;
    if (idx < 0 || idx >= lines.length || lines[idx] !== payload.rawLine) {
      new import_obsidian2.Notice("Day Planner: file changed since last render \u2014 refreshing.");
      this.scheduleRender();
      return;
    }
    const next = transform(lines[idx]);
    if (next === lines[idx])
      return;
    lines[idx] = next;
    await this.app.vault.modify(file, lines.join("\n"));
  }
  formatHourLabel(h) {
    const ampm = h < 12 || h === 24 ? "a" : "p";
    let h12 = h % 12;
    if (h12 === 0)
      h12 = 12;
    return `${h12}${ampm}`;
  }
  formatBlockTime(task) {
    if (task.startMin === null)
      return "";
    const start = task.startMin;
    const end = start + task.durationMin;
    return `${this.fmtClock(start)}\u2013${this.fmtClock(end)}`;
  }
  fmtClock(totalMin) {
    const h24 = Math.floor(totalMin / 60) % 24;
    const m = totalMin % 60;
    const ampm = h24 < 12 ? "a" : "p";
    let h12 = h24 % 12;
    if (h12 === 0)
      h12 = 12;
    return m === 0 ? `${h12}${ampm}` : `${h12}:${m.toString().padStart(2, "0")}${ampm}`;
  }
  cleanBody(body) {
    const p = this.plugin.settings.prefixes;
    return body.replace(new RegExp(`#${p.duration}\\/\\S+`, "g"), "").replace(new RegExp(`#${p.time}\\/\\S+`, "g"), "").replace(new RegExp(`#${p.order}\\/\\d+`, "g"), "").replace(/\s+/g, " ").trim();
  }
  async openLine(file, line) {
    var _a;
    const leaf = this.app.workspace.getLeaf(false);
    await leaf.openFile(file);
    const view = leaf.view;
    (_a = view.editor) == null ? void 0 : _a.setCursor({ line, ch: 0 });
  }
};

// src/settings.ts
var import_obsidian3 = require("obsidian");
var DEFAULT_SETTINGS = {
  visibleStartHour: 6,
  visibleEndHour: 23,
  snapMin: 15,
  pxPerMin: 1,
  prefixes: { ...DEFAULT_PREFIXES },
  dailyNoteFormatFallback: "YYYY-MM-DD",
  dailyNoteFolderFallback: "daily",
  defaultDurationMin: 15
};
var DayPlannerSettingTab = class extends import_obsidian3.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    new import_obsidian3.Setting(containerEl).setName("Visible start hour").setDesc("First hour shown on the timeline (0-23).").addText(
      (t) => t.setValue(this.plugin.settings.visibleStartHour.toString()).onChange(async (v) => {
        const n = clampInt(v, 0, 23, this.plugin.settings.visibleStartHour);
        this.plugin.settings.visibleStartHour = n;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian3.Setting(containerEl).setName("Visible end hour").setDesc("Last hour shown (1-24, must exceed start).").addText(
      (t) => t.setValue(this.plugin.settings.visibleEndHour.toString()).onChange(async (v) => {
        const n = clampInt(v, 1, 24, this.plugin.settings.visibleEndHour);
        this.plugin.settings.visibleEndHour = n;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian3.Setting(containerEl).setName("Default duration (minutes)").setDesc(
      "Used for tasks that have a #h/ start time but no #d/ tag. Drag the bottom edge of the block to commit a real duration."
    ).addText(
      (t) => t.setValue(this.plugin.settings.defaultDurationMin.toString()).onChange(async (v) => {
        this.plugin.settings.defaultDurationMin = clampInt(
          v,
          1,
          480,
          this.plugin.settings.defaultDurationMin
        );
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian3.Setting(containerEl).setName("Snap interval (minutes)").setDesc("Drag-drop snaps to this granularity.").addText(
      (t) => t.setValue(this.plugin.settings.snapMin.toString()).onChange(async (v) => {
        this.plugin.settings.snapMin = clampInt(
          v,
          1,
          60,
          this.plugin.settings.snapMin
        );
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian3.Setting(containerEl).setName("Pixels per minute").setDesc("Vertical scale of the timeline.").addText(
      (t) => t.setValue(this.plugin.settings.pxPerMin.toString()).onChange(async (v) => {
        const n = parseFloat(v);
        if (!isNaN(n) && n > 0 && n <= 10) {
          this.plugin.settings.pxPerMin = n;
          await this.plugin.saveSettings();
        }
      })
    );
    new import_obsidian3.Setting(containerEl).setName("Duration tag prefix").setDesc("Default 'd' \u2192 #d/90m.").addText(
      (t) => t.setValue(this.plugin.settings.prefixes.duration).onChange(async (v) => {
        if (/^[a-zA-Z]+$/.test(v)) {
          this.plugin.settings.prefixes.duration = v;
          await this.plugin.saveSettings();
        }
      })
    );
    new import_obsidian3.Setting(containerEl).setName("Time tag prefix").setDesc("Default 'h' \u2192 #h/10a.").addText(
      (t) => t.setValue(this.plugin.settings.prefixes.time).onChange(async (v) => {
        if (/^[a-zA-Z]+$/.test(v)) {
          this.plugin.settings.prefixes.time = v;
          await this.plugin.saveSettings();
        }
      })
    );
    new import_obsidian3.Setting(containerEl).setName("Order tag prefix").setDesc("Default 'o' \u2192 #o/3 (used for unscheduled drag-reorder).").addText(
      (t) => t.setValue(this.plugin.settings.prefixes.order).onChange(async (v) => {
        if (/^[a-zA-Z]+$/.test(v)) {
          this.plugin.settings.prefixes.order = v;
          await this.plugin.saveSettings();
        }
      })
    );
    new import_obsidian3.Setting(containerEl).setName("Daily note format fallback").setDesc(
      "Used if the core Daily Notes plugin isn't enabled. Tokens: YYYY MM DD."
    ).addText(
      (t) => t.setValue(this.plugin.settings.dailyNoteFormatFallback).onChange(async (v) => {
        if (v.trim()) {
          this.plugin.settings.dailyNoteFormatFallback = v.trim();
          await this.plugin.saveSettings();
        }
      })
    );
    new import_obsidian3.Setting(containerEl).setName("Daily note folder fallback").setDesc(
      "Folder for newly created daily notes when navigating dates. Used if the core Daily Notes plugin isn't enabled."
    ).addText(
      (t) => t.setValue(this.plugin.settings.dailyNoteFolderFallback).onChange(async (v) => {
        this.plugin.settings.dailyNoteFolderFallback = v.trim();
        await this.plugin.saveSettings();
      })
    );
  }
};
function clampInt(v, lo, hi, fallback) {
  const n = parseInt(v, 10);
  if (isNaN(n))
    return fallback;
  return Math.max(lo, Math.min(hi, n));
}

// src/main.ts
var DayPlannerPlugin = class extends import_obsidian4.Plugin {
  async onload() {
    await this.loadSettings();
    this.registerView(
      VIEW_TYPE_DAY_PLANNER,
      (leaf) => new DayPlannerView(leaf, this)
    );
    this.addRibbonIcon("calendar-clock", "Open Day Planner", () => {
      void this.activateView();
    });
    this.addCommand({
      id: "open-day-planner",
      name: "Open Day Planner",
      callback: () => void this.activateView()
    });
    this.addSettingTab(new DayPlannerSettingTab(this.app, this));
  }
  async onunload() {
  }
  async loadSettings() {
    var _a;
    const data = await this.loadData();
    this.settings = {
      ...DEFAULT_SETTINGS,
      ...data != null ? data : {},
      prefixes: { ...DEFAULT_PREFIXES, ...(_a = data == null ? void 0 : data.prefixes) != null ? _a : {} }
    };
  }
  async saveSettings() {
    await this.saveData(this.settings);
    for (const leaf of this.app.workspace.getLeavesOfType(
      VIEW_TYPE_DAY_PLANNER
    )) {
      const view = leaf.view;
      view.scheduleRender();
    }
  }
  async activateView() {
    const existing = this.app.workspace.getLeavesOfType(VIEW_TYPE_DAY_PLANNER);
    if (existing.length > 0) {
      this.app.workspace.revealLeaf(existing[0]);
      return;
    }
    const leaf = this.app.workspace.getRightLeaf(false);
    if (!leaf)
      return;
    await leaf.setViewState({
      type: VIEW_TYPE_DAY_PLANNER,
      active: true
    });
    this.app.workspace.revealLeaf(leaf);
  }
};
