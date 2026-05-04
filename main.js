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
function parseTaskLine(filePath, lineNumber, rawLine, prefixes) {
  const m = TASK_LINE.exec(rawLine);
  if (!m)
    return null;
  const body = m[3];
  const durationMin = parseDuration(body, prefixes);
  if (durationMin === null)
    return null;
  const startMin = parseTime(body, prefixes);
  const order = parseOrder(body, prefixes);
  const checked = m[2] !== " ";
  return {
    filePath,
    lineNumber,
    rawLine,
    body,
    durationMin,
    startMin,
    order,
    checked
  };
}
function parseFileTasks(filePath, fileContent, prefixes) {
  const lines = fileContent.split("\n");
  const tasks = [];
  for (let i = 0; i < lines.length; i++) {
    const t = parseTaskLine(filePath, i, lines[i], prefixes);
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
async function resolveTodayDailyNote(app, fallbackFormat = "YYYY-MM-DD") {
  const opts = readDailyNotesOptions(app);
  const format = opts.format || fallbackFormat;
  const folder = (opts.folder || "").trim();
  const fileName = formatDate(new Date(), format) + ".md";
  const path = (0, import_obsidian.normalizePath)(folder ? `${folder}/${fileName}` : fileName);
  const file = app.vault.getAbstractFileByPath(path);
  return {
    path,
    file: file instanceof import_obsidian.TFile ? file : null
  };
}
async function ensureTodayDailyNote(app) {
  const resolved = await resolveTodayDailyNote(app);
  if (resolved.file)
    return resolved.file;
  const folder = resolved.path.includes("/") ? resolved.path.slice(0, resolved.path.lastIndexOf("/")) : "";
  if (folder) {
    const existing = app.vault.getAbstractFileByPath(folder);
    if (!existing)
      await app.vault.createFolder(folder);
  }
  return app.vault.create(resolved.path, "");
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

// src/view.ts
var VIEW_TYPE_DAY_PLANNER = "day-planner-view";
var DayPlannerView = class extends import_obsidian2.ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.rerenderTimer = null;
    this.dragPayload = null;
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
    root.empty();
    root.addClass("day-planner-root");
    const dailyResolved = await resolveTodayDailyNote(
      this.app,
      this.plugin.settings.dailyNoteFormatFallback
    );
    const dailyTasks = await this.readTasks(dailyResolved.file);
    const activeFile = this.app.workspace.getActiveFile();
    const activeIsDaily = activeFile && dailyResolved.file && activeFile.path === dailyResolved.file.path;
    const activeTasks = activeFile && !activeIsDaily ? await this.readTasks(activeFile) : [];
    this.renderSection(
      root,
      "Today",
      this.formatToday(),
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
  }
  async readTasks(file) {
    if (!file)
      return [];
    const content = await this.app.vault.read(file);
    return parseFileTasks(file.path, content, this.plugin.settings.prefixes);
  }
  formatToday() {
    const d = new Date();
    return d.toLocaleDateString(void 0, {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  }
  renderSection(parent, title, subtitle, file, path, tasks, isPrimary) {
    const section = parent.createDiv({ cls: "dp-section" });
    const header = section.createDiv({ cls: "dp-header" });
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
        text: `Create today's daily note (${path})`
      });
      create.addEventListener("click", async () => {
        await ensureTodayDailyNote(this.app);
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
    timeline.addEventListener("dragover", (ev) => {
      if (!this.dragPayload)
        return;
      ev.preventDefault();
    });
    timeline.addEventListener("drop", (ev) => {
      if (!this.dragPayload)
        return;
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
  renderBlock(layer, file, block) {
    const el = layer.createDiv({ cls: "dp-block" });
    el.style.top = `${block.topPx}px`;
    el.style.height = `${Math.max(18, block.heightPx)}px`;
    el.style.left = `${block.leftPct}%`;
    el.style.width = `${block.widthPct}%`;
    if (block.task.checked)
      el.addClass("is-done");
    el.draggable = true;
    const time = el.createDiv({ cls: "dp-block-time" });
    time.textContent = this.formatBlockTime(block.task);
    const text = el.createDiv({ cls: "dp-block-text" });
    text.textContent = this.cleanBody(block.task.body);
    el.addEventListener("dragstart", (ev) => {
      var _a;
      this.dragPayload = {
        filePath: file.path,
        lineNumber: block.task.lineNumber,
        rawLine: block.task.rawLine,
        source: "timeline"
      };
      (_a = ev.dataTransfer) == null ? void 0 : _a.setData("text/plain", block.task.rawLine);
      if (ev.dataTransfer)
        ev.dataTransfer.effectAllowed = "move";
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
        source: "timeline"
      },
      (line) => setDurationTag(line, newDurationMin, prefixes)
    );
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
      card.draggable = true;
      const meta = card.createDiv({ cls: "dp-card-meta" });
      meta.textContent = formatTotal(task.durationMin);
      const text = card.createDiv({ cls: "dp-card-text" });
      text.textContent = this.cleanBody(task.body);
      card.addEventListener("dragstart", (ev) => {
        var _a;
        this.dragPayload = {
          filePath: file.path,
          lineNumber: task.lineNumber,
          rawLine: task.rawLine,
          source: "unscheduled"
        };
        (_a = ev.dataTransfer) == null ? void 0 : _a.setData("text/plain", task.rawLine);
        if (ev.dataTransfer)
          ev.dataTransfer.effectAllowed = "move";
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
  dailyNoteFormatFallback: "YYYY-MM-DD"
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
