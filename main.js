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
  default: () => TodayPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian4 = require("obsidian");

// src/view.ts
var import_obsidian2 = require("obsidian");

// src/parser.ts
var DEFAULT_PREFIXES = {
  duration: "d",
  time: "t",
  order: "o",
  project: "p"
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
    order: new RegExp(`#${esc(prefixes.order)}\\/(\\d+)\\b`),
    project: new RegExp(`#${esc(prefixes.project)}\\/([\\w-]+)`)
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
function parseProject(body, prefixes) {
  const m = buildTagRegexes(prefixes).project.exec(body);
  return m ? m[1] : null;
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
  const project = parseProject(body, prefixes);
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
    checked,
    project
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
function findLastTaskLine(content) {
  const lines = content.split("\n");
  for (let i = lines.length - 1; i >= 0; i--) {
    if (TASK_LINE.test(lines[i]))
      return i;
  }
  return -1;
}
function buildTaskLine(body, prefixes, opts) {
  const tags = [];
  if (opts.startMin !== void 0) {
    tags.push(formatTime(opts.startMin, prefixes));
  }
  tags.push(formatDuration(opts.durationMin, prefixes));
  return `- [ ] ${body} ${tags.join(" ")}`;
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
function computeFreeMin(scheduled, windowStartMin, windowEndMin) {
  const windowLen = Math.max(0, windowEndMin - windowStartMin);
  if (windowLen === 0)
    return 0;
  const intervals = [];
  for (const t of scheduled) {
    if (t.startMin === null)
      continue;
    const start = Math.max(windowStartMin, t.startMin);
    const end = Math.min(windowEndMin, t.startMin + t.durationMin);
    if (end > start)
      intervals.push([start, end]);
  }
  intervals.sort((a, b) => a[0] - b[0]);
  let occupied = 0;
  let curStart = -1;
  let curEnd = -1;
  for (const [s, e] of intervals) {
    if (curEnd === -1 || s > curEnd) {
      if (curEnd !== -1)
        occupied += curEnd - curStart;
      curStart = s;
      curEnd = e;
    } else if (e > curEnd) {
      curEnd = e;
    }
  }
  if (curEnd !== -1)
    occupied += curEnd - curStart;
  return Math.max(0, windowLen - occupied);
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

// src/colors.ts
var DEFAULT_PALETTE = [
  "#5B8DEF",
  "#3FB68B",
  "#E07A5F",
  "#9C6ADE",
  "#E8A23C",
  "#3DB5A8",
  "#D85F8C",
  "#7B8794",
  "#C77E2A",
  "#5DA3B5",
  "#A4985E",
  "#B25DA8"
];
function resolveProjectColors(projects, userMappings, palette = DEFAULT_PALETTE) {
  var _a, _b;
  const result = /* @__PURE__ */ new Map();
  const userMap = /* @__PURE__ */ new Map();
  for (const m of userMappings) {
    const project = (_a = m.project) == null ? void 0 : _a.trim();
    const color = (_b = m.color) == null ? void 0 : _b.trim();
    if (project && color)
      userMap.set(project.toLowerCase(), color);
  }
  const unique = Array.from(new Set(projects));
  const userColorsUsed = /* @__PURE__ */ new Set();
  for (const proj of unique) {
    const userColor = userMap.get(proj.toLowerCase());
    if (userColor) {
      result.set(proj, userColor);
      userColorsUsed.add(userColor.toLowerCase());
    }
  }
  const remaining = unique.filter((p) => !userMap.has(p.toLowerCase())).sort((a, b) => a.localeCompare(b));
  const available = palette.filter(
    (c) => !userColorsUsed.has(c.toLowerCase())
  );
  const pool = available.length > 0 ? available : palette;
  remaining.forEach((proj, i) => {
    result.set(proj, pool[i % pool.length]);
  });
  return result;
}
function contrastingTextColor(hex) {
  const c = parseHex(hex);
  if (!c)
    return "#ffffff";
  const lin = (v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const L = 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b);
  return L > 0.55 ? "#1a1a1a" : "#ffffff";
}
function parseHex(hex) {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
  if (!m)
    return null;
  let s = m[1];
  if (s.length === 3)
    s = s.split("").map((c) => c + c).join("");
  return {
    r: parseInt(s.slice(0, 2), 16),
    g: parseInt(s.slice(2, 4), 16),
    b: parseInt(s.slice(4, 6), 16)
  };
}
function isValidHex(hex) {
  return parseHex(hex) !== null;
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
  const initialContent = await readTemplateContent(app, fallback.template);
  const file = await app.vault.create(resolved.path, initialContent);
  if (notify)
    new import_obsidian.Notice(`Created ${resolved.path}`);
  return file;
}
async function readTemplateContent(app, templatePath) {
  const raw = (templatePath != null ? templatePath : "").trim();
  if (!raw)
    return "";
  const withExt = raw.toLowerCase().endsWith(".md") ? raw : `${raw}.md`;
  const path = (0, import_obsidian.normalizePath)(withExt);
  const file = app.vault.getAbstractFileByPath(path);
  if (!(file instanceof import_obsidian.TFile)) {
    new import_obsidian.Notice(`Today: template not found at ${path}`);
    return "";
  }
  return app.vault.read(file);
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
var VIEW_TYPE_TODAY = "today-view";
var TRANSPARENT_PIXEL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkAAIAAAoAAv/lxKUAAAAASUVORK5CYII=";
var TodayView = class extends import_obsidian2.ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.rerenderTimer = null;
    this.dragPayload = null;
    this.dropIndicator = null;
    this.selectedDate = startOfDay(new Date());
    this.calendarMonth = startOfMonth(new Date());
    this.calendarOpen = false;
    this.overrideFilePath = null;
    this.plugin = plugin;
  }
  getViewType() {
    return VIEW_TYPE_TODAY;
  }
  getDisplayText() {
    return "Today";
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
    this.registerDomEvent(
      this.containerEl,
      "keydown",
      (ev) => this.handleKeydown(ev)
    );
    await this.render();
  }
  handleKeydown(ev) {
    if (ev.metaKey || ev.ctrlKey || ev.altKey)
      return;
    if (ev.key !== "ArrowLeft" && ev.key !== "ArrowRight")
      return;
    const t = ev.target;
    if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable))
      return;
    ev.preventDefault();
    const delta = ev.key === "ArrowLeft" ? -1 : 1;
    void this.navigateTo(addDays(this.selectedDate, delta));
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
  openCalendar() {
    this.calendarOpen = true;
    this.scheduleRender();
  }
  async render() {
    const root = this.containerEl.children[1];
    const prevRootScroll = root.scrollTop;
    const prevTimelineScrolls = Array.from(
      root.querySelectorAll(".dp-timeline-wrap")
    ).map((el) => el.scrollTop);
    root.empty();
    root.addClass("today-root");
    if (!root.hasAttribute("tabindex"))
      root.setAttribute("tabindex", "-1");
    const fallback = {
      folder: this.plugin.settings.dailyNoteFolderFallback,
      format: this.plugin.settings.dailyNoteFormatFallback,
      template: this.plugin.settings.dailyNoteTemplate
    };
    const dailyResolved = await resolveDailyNote(
      this.app,
      this.selectedDate,
      fallback
    );
    let displayFile = dailyResolved.file;
    let displayPath = dailyResolved.path;
    if (this.overrideFilePath) {
      const f = this.app.vault.getAbstractFileByPath(this.overrideFilePath);
      if (f instanceof import_obsidian2.TFile) {
        displayFile = f;
        displayPath = f.path;
      } else {
        this.overrideFilePath = null;
      }
    }
    const tasks = await this.readTasks(displayFile);
    const activeFile = this.app.workspace.getActiveFile();
    const showOpenActiveLink = activeFile !== null && (!displayFile || activeFile.path !== displayFile.path);
    this.renderDateNav(root);
    const projects = tasks.map((t) => t.project).filter((p) => p !== null);
    const colorMap = resolveProjectColors(
      projects,
      this.plugin.settings.projectColors
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
      showOpenActiveLink ? activeFile : null
    );
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
    const today = nav.createEl("button", {
      cls: "dp-today-btn",
      attr: { "aria-label": "Jump to today" }
    });
    (0, import_obsidian2.setIcon)(today, "sun");
    const label = nav.createDiv({ cls: "dp-datenav-label" });
    label.textContent = this.formatDateLabel(this.selectedDate);
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
    this.overrideFilePath = null;
    const fallback = {
      folder: this.plugin.settings.dailyNoteFolderFallback,
      format: this.plugin.settings.dailyNoteFormatFallback,
      template: this.plugin.settings.dailyNoteTemplate
    };
    const resolved = await resolveDailyNote(this.app, target, fallback);
    if (!resolved.file) {
      try {
        await ensureDailyNote(this.app, target, fallback);
      } catch (e) {
        new import_obsidian2.Notice(`Today: failed to create note (${e.message})`);
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
  renderSection(parent, title, subtitle, file, path, tasks, isPrimary, colorMap, openActiveTarget = null) {
    const section = parent.createDiv({ cls: "dp-section" });
    const header = section.createDiv({ cls: "dp-header" });
    if (!isPrimary && title)
      header.createDiv({ cls: "dp-title", text: title });
    if (subtitle || openActiveTarget) {
      const sub = header.createDiv({ cls: "dp-subtitle" });
      if (subtitle) {
        if (file) {
          const pathLink = sub.createEl("a", {
            cls: "dp-subtitle-link dp-subtitle-path",
            text: subtitle,
            attr: { href: "#", title: `Open ${file.path}` }
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
        if (subtitle)
          sub.createSpan({ cls: "dp-subtitle-sep", text: "\u2022" });
        const link = sub.createEl("a", {
          cls: "dp-subtitle-link",
          text: "Open Active Note",
          attr: {
            href: "#",
            "aria-label": `Open active note: ${openActiveTarget.path}`,
            title: openActiveTarget.path
          }
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
    if (isPrimary)
      this.renderFreeTable(statsRow, tasks);
    this.renderProjectTable(statsRow, tasks, colorMap);
    if (!file && isPrimary) {
      const create = section.createEl("button", {
        cls: "dp-create",
        text: `Create ${path}`
      });
      create.addEventListener("click", async () => {
        const fallback = {
          folder: this.plugin.settings.dailyNoteFolderFallback,
          format: this.plugin.settings.dailyNoteFormatFallback,
          template: this.plugin.settings.dailyNoteTemplate
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
    this.renderTimeline(body, file, scheduled, colorMap);
    this.renderUnscheduled(body, file, unscheduled, colorMap);
  }
  renderTimeline(parent, file, scheduled, colorMap) {
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
  renderGutter(timeline, blocksLayer, file, startMin, endMin) {
    const settings = this.plugin.settings;
    const gutter = timeline.createDiv({ cls: "dp-gutter" });
    const eyebrow = gutter.createDiv({ cls: "dp-gutter-eyebrow" });
    eyebrow.createSpan({ cls: "dp-gutter-eyebrow-mark", text: "+" });
    eyebrow.createSpan({ cls: "dp-gutter-eyebrow-text", text: "new" });
    const reveal = () => timeline.addClass("is-gutter-revealed");
    const hide = () => {
      if (gutter.dataset.dragging)
        return;
      timeline.removeClass("is-gutter-revealed");
    };
    timeline.addEventListener("pointerenter", reveal);
    timeline.addEventListener("pointerleave", hide);
    const minuteFromY = (clientY) => {
      const rect = timeline.getBoundingClientRect();
      const y = clientY - rect.top + timeline.scrollTop;
      const raw = y / settings.pxPerMin + startMin;
      return snapToInterval(raw, settings.snapMin);
    };
    const DRAG_THRESHOLD_PX = 4;
    let pending = null;
    let dragState = null;
    let suppressNextClick = false;
    const updateIndicator = (indicator, topMin, durationMin) => {
      indicator.style.top = `${(topMin - startMin) * settings.pxPerMin}px`;
      indicator.style.height = `${Math.max(18, durationMin * settings.pxPerMin)}px`;
      let timeEl = indicator.querySelector(".dp-drop-indicator-time");
      if (!timeEl) {
        timeEl = indicator.createDiv({ cls: "dp-drop-indicator-time" });
      }
      timeEl.textContent = `${this.fmtClock(topMin)}\u2013${this.fmtClock(
        topMin + durationMin
      )}`;
      let textEl = indicator.querySelector(".dp-drop-indicator-text");
      if (!textEl) {
        textEl = indicator.createDiv({
          cls: "dp-drop-indicator-text",
          text: "New task"
        });
      }
    };
    const beginDrag = (ev, anchor) => {
      const indicator = blocksLayer.createDiv({
        cls: "dp-drop-indicator dp-create-indicator"
      });
      updateIndicator(indicator, anchor, settings.defaultDurationMin);
      dragState = { pointerId: ev.pointerId, anchorMin: anchor, indicator };
      try {
        gutter.setPointerCapture(ev.pointerId);
      } catch (e) {
      }
      gutter.dataset.dragging = "1";
    };
    const cancelDrag = () => {
      if (!dragState)
        return;
      dragState.indicator.detach();
      try {
        gutter.releasePointerCapture(dragState.pointerId);
      } catch (e) {
      }
      delete gutter.dataset.dragging;
      dragState = null;
    };
    gutter.addEventListener("pointerdown", (ev) => {
      if (ev.button !== 0)
        return;
      reveal();
      const anchor = Math.max(
        startMin,
        Math.min(endMin - settings.snapMin, minuteFromY(ev.clientY))
      );
      pending = { startClientY: ev.clientY, anchorMin: anchor };
    });
    gutter.addEventListener("pointermove", (ev) => {
      if (dragState) {
        const m = Math.max(
          startMin,
          Math.min(endMin, minuteFromY(ev.clientY))
        );
        const top = Math.min(dragState.anchorMin, m);
        const bottom = Math.max(dragState.anchorMin + settings.snapMin, m);
        updateIndicator(dragState.indicator, top, bottom - top);
        return;
      }
      if (pending && Math.abs(ev.clientY - pending.startClientY) > DRAG_THRESHOLD_PX) {
        beginDrag(ev, pending.anchorMin);
      }
    });
    gutter.addEventListener("pointerup", (ev) => {
      if (!dragState)
        return;
      ev.preventDefault();
      ev.stopPropagation();
      const state = dragState;
      const m = Math.max(
        startMin,
        Math.min(endMin, minuteFromY(ev.clientY))
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
    gutter.addEventListener("click", (ev) => {
      ev.stopPropagation();
      if (suppressNextClick) {
        suppressNextClick = false;
        return;
      }
      const anchor = pending ? pending.anchorMin : Math.max(
        startMin,
        Math.min(endMin - settings.snapMin, minuteFromY(ev.clientY))
      );
      pending = null;
      void this.createTaskAtTime(file, anchor, settings.defaultDurationMin);
      if (!timeline.matches(":hover"))
        timeline.removeClass("is-gutter-revealed");
    });
  }
  createTaskAtTime(file, startMin, durationMin) {
    const prefixes = this.plugin.settings.prefixes;
    new TitlePromptModal(this.app, {
      heading: `New task at ${this.fmtClock(startMin)}`,
      placeholder: "Task title\u2026",
      onSubmit: (title) => {
        const newLine = buildTaskLine(title, prefixes, { startMin, durationMin });
        void this.appendTaskAfterLast(file, newLine);
      }
    }).open();
  }
  createUnscheduledTask(file) {
    const prefixes = this.plugin.settings.prefixes;
    new TitlePromptModal(this.app, {
      heading: "New unscheduled task",
      placeholder: "Task title\u2026",
      onSubmit: (title) => {
        const newLine = buildTaskLine(title, prefixes, {
          durationMin: this.plugin.settings.defaultDurationMin
        });
        void this.appendTaskAfterLast(file, newLine);
      }
    }).open();
  }
  async appendTaskAfterLast(file, newLine) {
    const content = await this.app.vault.read(file);
    const lines = content.split("\n");
    const lastIdx = findLastTaskLine(content);
    const insertAt = lastIdx === -1 ? lines.length : lastIdx + 1;
    lines.splice(insertAt, 0, newLine);
    await this.app.vault.modify(file, lines.join("\n"));
    void this.openLine(file, insertAt, newLine.length);
  }
  renderBlock(layer, file, block, colorMap) {
    const el = layer.createDiv({ cls: "dp-block" });
    el.style.top = `${block.topPx}px`;
    el.style.height = `${Math.max(18, block.heightPx)}px`;
    el.style.left = `${block.leftPct}%`;
    el.style.width = `${block.widthPct}%`;
    if (block.task.checked)
      el.addClass("is-done");
    if (!block.task.hasExplicitDuration)
      el.addClass("is-implicit-duration");
    if (block.task.durationMin < 25)
      el.addClass("is-compact");
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
      (0, import_obsidian2.setIcon)(warn, "alert-triangle");
      warn.setAttribute("aria-label", "No #d/ tag \u2014 using default duration");
    }
    row.createSpan({
      cls: "dp-block-time",
      text: this.formatBlockTime(block.task)
    });
    row.createSpan({ cls: "dp-block-sep", text: "\xB7" });
    if (block.task.project) {
      row.createSpan({ cls: "dp-block-project", text: block.task.project });
      row.createSpan({ cls: "dp-block-sep", text: "\xB7" });
    }
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
    el.addEventListener(
      "click",
      () => this.openLine(file, block.task.lineNumber, this.endOfTitleCh(block.task.rawLine))
    );
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
  renderUnscheduled(parent, file, unscheduled, colorMap) {
    const list = parent.createDiv({ cls: "dp-unscheduled" });
    const head = list.createDiv({ cls: "dp-unscheduled-head" });
    head.createSpan({ text: "Unscheduled" });
    const addBtn = head.createEl("button", {
      cls: "dp-unscheduled-add",
      attr: { "aria-label": "Add unscheduled task" }
    });
    (0, import_obsidian2.setIcon)(addBtn, "plus");
    addBtn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      void this.createUnscheduledTask(file);
    });
    if (unscheduled.length === 0) {
      list.createDiv({ cls: "dp-empty", text: "No unscheduled tasks." });
    }
    unscheduled.forEach((task, idx) => {
      const card = list.createDiv({ cls: "dp-card" });
      if (task.checked)
        card.addClass("is-done");
      if (!task.hasExplicitDuration)
        card.addClass("is-implicit-duration");
      const color = task.project ? colorMap.get(task.project) : null;
      if (color) {
        card.style.setProperty("--dp-color", color);
        card.addClass("has-project-color");
      }
      card.draggable = true;
      const meta = card.createDiv({ cls: "dp-card-meta" });
      if (!task.hasExplicitDuration) {
        const warn = meta.createSpan({ cls: "dp-warn" });
        (0, import_obsidian2.setIcon)(warn, "alert-triangle");
        warn.setAttribute("aria-label", "No #d/ tag \u2014 using default duration");
      }
      meta.createSpan({ text: formatTotal(task.durationMin) });
      if (task.project) {
        card.createSpan({ cls: "dp-card-project", text: task.project });
      }
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
      card.addEventListener(
        "click",
        () => this.openLine(file, task.lineNumber, this.endOfTitleCh(task.rawLine))
      );
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
      new import_obsidian2.Notice("Today: source file no longer exists.");
      this.scheduleRender();
      return;
    }
    const content = await this.app.vault.read(file);
    const lines = content.split("\n");
    const idx = payload.lineNumber;
    if (idx < 0 || idx >= lines.length || lines[idx] !== payload.rawLine) {
      new import_obsidian2.Notice("Today: file changed since last render \u2014 refreshing.");
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
  renderPlannedTable(parent, tasks) {
    const totals = computeTotals(tasks);
    const total = totals.scheduledMin + totals.unscheduledMin;
    const table = parent.createDiv({ cls: "dp-stat-table" });
    table.createSpan({ cls: "dp-st-h", text: "Type" });
    table.createSpan({ cls: "dp-st-h dp-st-h-right", text: "Planned" });
    this.renderStatRow(table, "Scheduled", totals.scheduledMin);
    this.renderStatRow(table, "Unscheduled", totals.unscheduledMin);
    this.renderStatRow(table, "Total", total, true);
  }
  renderFreeTable(parent, tasks) {
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
      Math.min(workStartMin, sleepMin)
    );
    const afterWork = computeFreeMin(
      scheduled,
      Math.max(workEndMin, wakeMin),
      sleepMin
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
  renderStatRow(table, label, mins, strong = false) {
    const nameCls = strong ? "dp-st-name dp-st-strong" : "dp-st-name";
    const valueCls = strong ? "dp-st-value dp-st-strong" : "dp-st-value";
    table.createSpan({ cls: nameCls, text: label });
    table.createSpan({ cls: valueCls, text: formatTotal(mins) });
  }
  renderProjectTable(parent, tasks, colorMap) {
    var _a;
    const totals = /* @__PURE__ */ new Map();
    let unassignedMin = 0;
    for (const t of tasks) {
      if (t.project) {
        totals.set(t.project, ((_a = totals.get(t.project)) != null ? _a : 0) + t.durationMin);
      } else {
        unassignedMin += t.durationMin;
      }
    }
    if (totals.size === 0 && unassignedMin === 0)
      return;
    const sorted = [...totals.entries()].sort(
      (a, b) => a[0].localeCompare(b[0])
    );
    const table = parent.createDiv({ cls: "dp-stat-table" });
    table.createSpan({ cls: "dp-st-h", text: "Project" });
    table.createSpan({ cls: "dp-st-h dp-st-h-right", text: "Planned" });
    for (const [name, mins] of sorted) {
      const nameCell = table.createDiv({ cls: "dp-st-name" });
      const swatch = nameCell.createSpan({ cls: "dp-st-swatch" });
      const color = colorMap.get(name);
      if (color)
        swatch.style.backgroundColor = color;
      nameCell.createSpan({ text: name });
      table.createSpan({ cls: "dp-st-value", text: formatTotal(mins) });
    }
    if (unassignedMin > 0) {
      const nameCell = table.createDiv({ cls: "dp-st-name dp-st-unassigned" });
      nameCell.createSpan({ cls: "dp-st-swatch dp-st-swatch-unassigned" });
      nameCell.createSpan({ text: "Unassigned" });
      table.createSpan({
        cls: "dp-st-value dp-st-unassigned",
        text: formatTotal(unassignedMin)
      });
    }
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
    return body.replace(new RegExp(`#${p.duration}\\/\\S+`, "g"), "").replace(new RegExp(`#${p.time}\\/\\S+`, "g"), "").replace(new RegExp(`#${p.order}\\/\\d+`, "g"), "").replace(new RegExp(`#${p.project}\\/[\\w-]+`, "g"), "").replace(/\s+/g, " ").trim();
  }
  endOfTitleCh(rawLine) {
    const p = this.plugin.settings.prefixes;
    const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(
      `#(?:${esc(p.duration)}|${esc(p.time)}|${esc(p.order)}|${esc(p.project)})\\/`
    );
    const m = re.exec(rawLine);
    const cutoff = m ? m.index : rawLine.length;
    let end = cutoff;
    while (end > 0 && /\s/.test(rawLine[end - 1]))
      end--;
    return end;
  }
  async openLine(file, line, ch = 0) {
    var _a, _b, _c;
    const leaf = this.app.workspace.getLeaf(false);
    await leaf.openFile(file);
    const view = leaf.view;
    (_a = view.editor) == null ? void 0 : _a.setCursor({ line, ch });
    (_c = (_b = view.editor) == null ? void 0 : _b.focus) == null ? void 0 : _c.call(_b);
  }
  async openFile(file) {
    const leaf = this.app.workspace.getLeaf(false);
    await leaf.openFile(file);
  }
};
var TitlePromptModal = class extends import_obsidian2.Modal {
  constructor(app, opts) {
    super(app);
    this.opts = opts;
  }
  onOpen() {
    this.modalEl.addClass("dp-title-modal");
    this.titleEl.setText(this.opts.heading);
    const input = this.contentEl.createEl("input", {
      type: "text",
      cls: "dp-title-input",
      attr: { placeholder: this.opts.placeholder }
    });
    input.focus();
    input.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter") {
        ev.preventDefault();
        const title = input.value.trim();
        this.opts.onSubmit(title);
        this.close();
      }
    });
  }
  onClose() {
    this.contentEl.empty();
  }
};

// src/settings.ts
var import_obsidian3 = require("obsidian");
var DEFAULT_SETTINGS = {
  visibleStartHour: 6,
  visibleEndHour: 23,
  workStartHour: 8,
  workEndHour: 18,
  wakeHour: 6,
  sleepHour: 23,
  snapMin: 15,
  pxPerMin: 1,
  prefixes: { ...DEFAULT_PREFIXES },
  dailyNoteFormatFallback: "YYYY-MM-DD",
  dailyNoteFolderFallback: "daily",
  dailyNoteTemplate: "",
  defaultDurationMin: 15,
  projectColors: []
};
var TodaySettingTab = class extends import_obsidian3.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    this.renderProjectsSection(containerEl);
    this.renderDefaultsSection(containerEl);
    this.renderTemplatingSection(containerEl);
    this.renderDayConfigSection(containerEl);
  }
  renderDefaultsSection(containerEl) {
    new import_obsidian3.Setting(containerEl).setName("Defaults").setHeading();
    new import_obsidian3.Setting(containerEl).setName("Default duration (minutes)").setDesc(
      "Used for tasks that have a #t/ start time but no #d/ tag. Drag the bottom edge of the block to commit a real duration."
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
    new import_obsidian3.Setting(containerEl).setName("Duration tag prefix").setDesc(buildDurationDesc()).addText(
      (t) => t.setValue(this.plugin.settings.prefixes.duration).onChange(async (v) => {
        if (/^[a-zA-Z]+$/.test(v)) {
          this.plugin.settings.prefixes.duration = v;
          await this.plugin.saveSettings();
        }
      })
    );
    new import_obsidian3.Setting(containerEl).setName("Time tag prefix").setDesc(buildTimeDesc()).addText(
      (t) => t.setValue(this.plugin.settings.prefixes.time).onChange(async (v) => {
        if (/^[a-zA-Z]+$/.test(v)) {
          this.plugin.settings.prefixes.time = v;
          await this.plugin.saveSettings();
        }
      })
    );
    new import_obsidian3.Setting(containerEl).setName("Order tag prefix").setDesc(buildOrderDesc()).addText(
      (t) => t.setValue(this.plugin.settings.prefixes.order).onChange(async (v) => {
        if (/^[a-zA-Z]+$/.test(v)) {
          this.plugin.settings.prefixes.order = v;
          await this.plugin.saveSettings();
        }
      })
    );
  }
  renderTemplatingSection(containerEl) {
    new import_obsidian3.Setting(containerEl).setName("Templating").setHeading();
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
    new import_obsidian3.Setting(containerEl).setName("Daily notes folder").setDesc("Where should your daily notes be saved?").addText(
      (t) => t.setValue(this.plugin.settings.dailyNoteFolderFallback).onChange(async (v) => {
        this.plugin.settings.dailyNoteFolderFallback = v.trim();
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian3.Setting(containerEl).setName("Daily note template").setDesc(
      "Vault path to a template file (e.g. Templates/Daily.md). Its contents are copied verbatim into newly created daily notes. Leave blank for empty notes."
    ).addText((t) => {
      t.setPlaceholder("Templates/Daily.md").setValue(this.plugin.settings.dailyNoteTemplate).onChange(async (v) => {
        this.plugin.settings.dailyNoteTemplate = v.trim();
        await this.plugin.saveSettings();
      });
      new FileSuggest(this.app, t.inputEl, async (file) => {
        t.setValue(file.path);
        this.plugin.settings.dailyNoteTemplate = file.path;
        await this.plugin.saveSettings();
      });
    });
  }
  renderDayConfigSection(containerEl) {
    new import_obsidian3.Setting(containerEl).setName("Day config").setHeading();
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
    new import_obsidian3.Setting(containerEl).setName("Working hours start").setDesc("Start of the working window (0-23). Used for the 'Working hours open' stat.").addText(
      (t) => t.setValue(this.plugin.settings.workStartHour.toString()).onChange(async (v) => {
        this.plugin.settings.workStartHour = clampInt(
          v,
          0,
          23,
          this.plugin.settings.workStartHour
        );
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian3.Setting(containerEl).setName("Working hours end").setDesc("End of the working window (1-24, must exceed start).").addText(
      (t) => t.setValue(this.plugin.settings.workEndHour.toString()).onChange(async (v) => {
        this.plugin.settings.workEndHour = clampInt(
          v,
          1,
          24,
          this.plugin.settings.workEndHour
        );
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian3.Setting(containerEl).setName("Wake hour").setDesc("Start of the awake window (0-23). Used for the 'Day available' stat.").addText(
      (t) => t.setValue(this.plugin.settings.wakeHour.toString()).onChange(async (v) => {
        this.plugin.settings.wakeHour = clampInt(
          v,
          0,
          23,
          this.plugin.settings.wakeHour
        );
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian3.Setting(containerEl).setName("Sleep hour").setDesc("End of the awake window (1-24, must exceed wake hour).").addText(
      (t) => t.setValue(this.plugin.settings.sleepHour.toString()).onChange(async (v) => {
        this.plugin.settings.sleepHour = clampInt(
          v,
          1,
          24,
          this.plugin.settings.sleepHour
        );
        await this.plugin.saveSettings();
      })
    );
  }
  renderProjectsSection(containerEl) {
    new import_obsidian3.Setting(containerEl).setName("Projects").setHeading();
    new import_obsidian3.Setting(containerEl).setName("Project tag prefix").setDesc(buildProjectPrefixDesc()).addText(
      (t) => t.setValue(this.plugin.settings.prefixes.project).onChange(async (v) => {
        if (/^[a-zA-Z]+$/.test(v)) {
          this.plugin.settings.prefixes.project = v;
          await this.plugin.saveSettings();
          this.display();
        }
      })
    );
    const prefix = this.plugin.settings.prefixes.project;
    const desc = document.createDocumentFragment();
    desc.append(
      "Pin a color to a specific project. Enter just the project name \u2014 the plugin matches it against ",
      makeCode(`#${prefix}/<name>`),
      " in your tasks. For example, entering ",
      makeCode("sally"),
      " matches ",
      makeCode(`#${prefix}/sally`),
      ". Don't include the ",
      makeCode(`${prefix}/`),
      " prefix; it's added automatically. Projects without a pinned color get distinct auto-assigned colors alphabetically."
    );
    new import_obsidian3.Setting(containerEl).setName("Project colors").setDesc(desc).addButton(
      (b) => b.setButtonText("Add project color").setCta().onClick(async () => {
        this.plugin.settings.projectColors.push({
          project: "",
          color: DEFAULT_PALETTE[this.plugin.settings.projectColors.length % DEFAULT_PALETTE.length]
        });
        await this.plugin.saveSettings();
        this.display();
      })
    );
    const list = containerEl.createDiv({ cls: "dp-project-colors-list" });
    this.plugin.settings.projectColors.forEach((entry, idx) => {
      const row = list.createDiv({ cls: "dp-project-color-row" });
      const nameWrap = row.createDiv({ cls: "dp-project-color-name-wrap" });
      nameWrap.createSpan({
        cls: "dp-project-color-prefix",
        text: `#${prefix}/`
      });
      const nameInput = nameWrap.createEl("input", {
        cls: "dp-project-color-name",
        attr: { type: "text", placeholder: "project-name" }
      });
      nameInput.value = entry.project;
      const stripPrefix = (s) => s.replace(new RegExp(`^#?${prefix}/`, "i"), "");
      nameInput.addEventListener("input", () => {
        var _a;
        const original = nameInput.value;
        const stripped = stripPrefix(original);
        if (stripped !== original) {
          const pos = Math.max(0, (_a = nameInput.selectionStart) != null ? _a : 0);
          nameInput.value = stripped;
          const newPos = Math.max(0, pos - (original.length - stripped.length));
          nameInput.setSelectionRange(newPos, newPos);
        }
      });
      nameInput.addEventListener("change", async () => {
        const v = stripPrefix(nameInput.value.trim());
        nameInput.value = v;
        this.plugin.settings.projectColors[idx].project = v;
        await this.plugin.saveSettings();
      });
      const colorInput = row.createEl("input", {
        cls: "dp-project-color-swatch",
        attr: { type: "color" }
      });
      colorInput.value = normalizeHex(entry.color);
      colorInput.addEventListener("change", async () => {
        if (isValidHex(colorInput.value)) {
          this.plugin.settings.projectColors[idx].color = colorInput.value;
          hexInput.value = colorInput.value;
          await this.plugin.saveSettings();
        }
      });
      const hexInput = row.createEl("input", {
        cls: "dp-project-color-hex",
        attr: { type: "text", placeholder: "#5B8DEF" }
      });
      hexInput.value = entry.color;
      hexInput.addEventListener("change", async () => {
        const v = hexInput.value.trim();
        if (isValidHex(v)) {
          this.plugin.settings.projectColors[idx].color = v;
          colorInput.value = normalizeHex(v);
          await this.plugin.saveSettings();
        } else {
          hexInput.value = entry.color;
        }
      });
      const remove = row.createEl("button", {
        cls: "dp-project-color-remove",
        text: "Remove"
      });
      remove.addEventListener("click", async () => {
        this.plugin.settings.projectColors.splice(idx, 1);
        await this.plugin.saveSettings();
        this.display();
      });
    });
  }
};
function clampInt(v, lo, hi, fallback) {
  const n = parseInt(v, 10);
  if (isNaN(n))
    return fallback;
  return Math.max(lo, Math.min(hi, n));
}
function makeCode(text) {
  const el = document.createElement("code");
  el.textContent = text;
  return el;
}
function buildDurationDesc() {
  const f = document.createDocumentFragment();
  f.append(
    "How long a task takes. Default prefix ",
    makeCode("d"),
    ". Combine hours and minutes \u2014 at least one is required. Examples: ",
    makeCode("#d/30m"),
    " (30 minutes), ",
    makeCode("#d/2h"),
    " (2 hours), ",
    makeCode("#d/1h30m"),
    " (1 hour 30 minutes), ",
    makeCode("#d/90m"),
    " (also 1h30m)."
  );
  return f;
}
function buildTimeDesc() {
  const f = document.createDocumentFragment();
  f.append(
    "Start time of a task. Default prefix ",
    makeCode("t"),
    ". 12-hour format with an ",
    makeCode("a"),
    " / ",
    makeCode("am"),
    " / ",
    makeCode("p"),
    " / ",
    makeCode("pm"),
    " suffix. Minutes go right after the hour with no colon. Examples: ",
    makeCode("#t/9a"),
    " (9:00 AM), ",
    makeCode("#t/930a"),
    " (9:30 AM), ",
    makeCode("#t/130p"),
    " (1:30 PM), ",
    makeCode("#t/12p"),
    " (noon)."
  );
  return f;
}
function buildOrderDesc() {
  const f = document.createDocumentFragment();
  f.append(
    "Manual ordering for unscheduled tasks. Default prefix ",
    makeCode("o"),
    ". The plugin manages this automatically when you drag to reorder unscheduled cards, so you usually don't type it yourself. Example: ",
    makeCode("#o/3"),
    " puts a task third in the unscheduled list."
  );
  return f;
}
function buildProjectPrefixDesc() {
  const f = document.createDocumentFragment();
  f.append(
    "Groups tasks by project for color-coding. Default prefix ",
    makeCode("p"),
    ". Tag a task with ",
    makeCode("#p/<name>"),
    " \u2014 for example, ",
    makeCode("#p/sally"),
    " or ",
    makeCode("#p/work-1"),
    " \u2014 and the timeline block plus the row in the Project totals table will share the same color. Names can use letters, digits, dashes, and underscores."
  );
  return f;
}
function normalizeHex(hex) {
  const trimmed = hex.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(trimmed))
    return trimmed.toLowerCase();
  if (/^#[0-9a-fA-F]{3}$/.test(trimmed)) {
    const s = trimmed.slice(1);
    return "#" + s.split("").map((c) => c + c).join("").toLowerCase();
  }
  return "#5b8def";
}
var FileSuggest = class extends import_obsidian3.AbstractInputSuggest {
  constructor(app, inputEl, onSelectFile) {
    super(app, inputEl);
    this.inputEl = inputEl;
    this.onSelectFile = onSelectFile;
  }
  getSuggestions(query) {
    const q = query.toLowerCase();
    const files = this.app.vault.getMarkdownFiles();
    const matches = q ? files.filter((f) => f.path.toLowerCase().includes(q)) : files;
    return matches.sort((a, b) => a.path.localeCompare(b.path)).slice(0, 50);
  }
  renderSuggestion(file, el) {
    var _a;
    el.addClass("dp-file-suggestion");
    el.createDiv({ cls: "dp-file-suggestion-name", text: file.basename });
    const parent = (_a = file.parent) == null ? void 0 : _a.path;
    if (parent && parent !== "/") {
      el.createDiv({ cls: "dp-file-suggestion-path", text: parent });
    }
  }
  selectSuggestion(file) {
    this.inputEl.value = file.path;
    this.inputEl.dispatchEvent(new Event("input"));
    void this.onSelectFile(file);
    this.close();
  }
};

// src/main.ts
var TodayPlugin = class extends import_obsidian4.Plugin {
  async onload() {
    await this.loadSettings();
    this.registerView(
      VIEW_TYPE_TODAY,
      (leaf) => new TodayView(leaf, this)
    );
    this.addRibbonIcon("calendar-clock", "Open Today", () => {
      void this.activateView();
    });
    this.addCommand({
      id: "open-today",
      name: "Open Today",
      callback: () => void this.activateView()
    });
    this.addCommand({
      id: "open-calendar",
      name: "Open Calendar",
      callback: () => void this.activateView({ openCalendar: true })
    });
    this.addSettingTab(new TodaySettingTab(this.app, this));
  }
  async onunload() {
  }
  async loadSettings() {
    var _a;
    const data = await this.loadData();
    this.settings = {
      ...DEFAULT_SETTINGS,
      ...data != null ? data : {},
      prefixes: { ...DEFAULT_PREFIXES, ...(_a = data == null ? void 0 : data.prefixes) != null ? _a : {} },
      projectColors: Array.isArray(data == null ? void 0 : data.projectColors) ? data.projectColors.filter(
        (c) => c && typeof c.project === "string" && typeof c.color === "string"
      ) : []
    };
  }
  async saveSettings() {
    await this.saveData(this.settings);
    for (const leaf of this.app.workspace.getLeavesOfType(
      VIEW_TYPE_TODAY
    )) {
      const view = leaf.view;
      view.scheduleRender();
    }
  }
  async activateView(opts = {}) {
    const existing = this.app.workspace.getLeavesOfType(VIEW_TYPE_TODAY);
    let leaf;
    if (existing.length > 0) {
      leaf = existing[0];
      this.app.workspace.revealLeaf(leaf);
    } else {
      leaf = this.app.workspace.getRightLeaf(false);
      if (!leaf)
        return;
      await leaf.setViewState({
        type: VIEW_TYPE_TODAY,
        active: true
      });
      this.app.workspace.revealLeaf(leaf);
    }
    if (opts.openCalendar && leaf.view instanceof TodayView) {
      leaf.view.openCalendar();
    }
  }
};
