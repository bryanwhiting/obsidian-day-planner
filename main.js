var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/mobile-drag-drop/index.min.js
var require_index_min = __commonJS({
  "node_modules/mobile-drag-drop/index.min.js"(exports, module2) {
    !function(t, i) {
      "object" == typeof exports && "undefined" != typeof module2 ? i(exports) : "function" == typeof define && define.amd ? define(["exports"], i) : i(t.MobileDragDrop = t.MobileDragDrop || {});
    }(exports, function(t) {
      "use strict";
      var c = "dnd-poly-", s = ["none", "copy", "copyLink", "copyMove", "link", "linkMove", "move", "all"], f = ["none", "copy", "move", "link"];
      function i() {
        var t2 = false;
        try {
          var i2 = Object.defineProperty({}, "passive", { get: function() {
            t2 = true;
          } });
          window.addEventListener("test", null, i2);
        } catch (t3) {
        }
        return t2;
      }
      var e = i();
      function l(t2) {
        return t2 && t2.tagName;
      }
      function h(t2, i2, s2) {
        void 0 === s2 && (s2 = true), document.addEventListener(t2, i2, !!e && { passive: s2 });
      }
      function n(t2, i2) {
        document.removeEventListener(t2, i2);
      }
      function u(t2, i2, s2, n2) {
        void 0 === n2 && (n2 = false);
        var h2 = e ? { passive: true, capture: n2 } : n2;
        return t2.addEventListener(i2, s2, h2), { off: function() {
          t2.removeEventListener(i2, s2, h2);
        } };
      }
      function o(t2) {
        return 0 === t2.length ? 0 : t2.reduce(function(t3, i2) {
          return i2 + t3;
        }, 0) / t2.length;
      }
      function r(t2, i2) {
        for (var s2 = 0; s2 < t2.changedTouches.length; s2++)
          if (t2.changedTouches[s2].identifier === i2)
            return true;
        return false;
      }
      function a(t2, i2, s2) {
        for (var n2 = [], h2 = [], e2 = 0; e2 < i2.touches.length; e2++) {
          var r2 = i2.touches[e2];
          n2.push(r2[t2 + "X"]), h2.push(r2[t2 + "Y"]);
        }
        s2.x = o(n2), s2.y = o(h2);
      }
      var d = ["", "-webkit-"];
      function v(t2, i2, s2, n2, h2) {
        var e2 = i2.x, i2 = i2.y;
        n2 && (e2 += n2.x, i2 += n2.y), (h2 = void 0 === h2 || h2) && (e2 -= parseInt(t2.offsetWidth, 10) / 2, i2 -= parseInt(t2.offsetHeight, 10) / 2);
        for (var r2 = "translate3d(" + e2 + "px," + i2 + "px, 0)", o2 = 0; o2 < d.length; o2++) {
          var u2 = d[o2] + "transform";
          t2.style[u2] = r2 + " " + s2[o2];
        }
      }
      var p = (Object.defineProperty(g.prototype, "dropEffect", { get: function() {
        return this.t;
      }, set: function(t2) {
        0 !== this.i.mode && -1 < s.indexOf(t2) && (this.t = t2);
      }, enumerable: false, configurable: true }), Object.defineProperty(g.prototype, "types", { get: function() {
        if (0 !== this.i.mode)
          return Object.freeze(this.i.types);
      }, enumerable: false, configurable: true }), Object.defineProperty(g.prototype, "effectAllowed", { get: function() {
        return this.i.effectAllowed;
      }, set: function(t2) {
        2 === this.i.mode && -1 < s.indexOf(t2) && (this.i.effectAllowed = t2);
      }, enumerable: false, configurable: true }), g.prototype.setData = function(t2, i2) {
        if (2 === this.i.mode) {
          if (-1 < t2.indexOf(" "))
            throw new Error("illegal arg: type contains space");
          this.i.data[t2] = i2, -1 === this.i.types.indexOf(t2) && this.i.types.push(t2);
        }
      }, g.prototype.getData = function(t2) {
        if (1 === this.i.mode || 2 === this.i.mode)
          return this.i.data[t2] || "";
      }, g.prototype.clearData = function(t2) {
        2 === this.i.mode && (t2 && this.i.data[t2] ? (delete this.i.data[t2], -1 < (t2 = this.i.types.indexOf(t2)) && this.i.types.splice(t2, 1)) : (this.i.data = {}, this.i.types = []));
      }, g.prototype.setDragImage = function(t2, i2, s2) {
        2 === this.i.mode && this.h(t2, i2, s2);
      }, g);
      function g(t2, i2) {
        this.i = t2, this.h = i2, this.t = f[0];
      }
      function m(t2, i2) {
        return t2 ? t2 === s[0] ? f[0] : 0 === t2.indexOf(s[1]) || t2 === s[7] ? f[1] : 0 === t2.indexOf(s[4]) ? f[3] : t2 === s[6] ? f[2] : f[1] : 3 === i2.nodeType && "A" === i2.tagName ? f[3] : f[1];
      }
      function y(u2, t2, a2, i2, s2, n2, c2) {
        void 0 === c2 && (c2 = null);
        s2 = function(t3, i3, s3, n3, h2, e2, r2) {
          void 0 === c2 && (r2 = null);
          var o2 = a2.changedTouches[0], n3 = new Event(u2, { bubbles: true, cancelable: n3 });
          n3.dataTransfer = e2, n3.relatedTarget = r2, n3.screenX = o2.screenX, n3.screenY = o2.screenY, n3.clientX = o2.clientX, n3.clientY = o2.clientY, n3.pageX = o2.pageX, n3.pageY = o2.pageY;
          t3 = t3.getBoundingClientRect();
          return n3.offsetX = n3.clientX - t3.left, n3.offsetY = n3.clientY - t3.top, n3;
        }(t2, 0, 0, n2 = void 0 === n2 || n2, document.defaultView, s2, c2), s2 = !t2.dispatchEvent(s2);
        return i2.mode = 0, s2;
      }
      function b(t2, i2) {
        if (!t2 || t2 === s[7])
          return i2;
        if (i2 === f[1]) {
          if (0 === t2.indexOf(f[1]))
            return f[1];
        } else if (i2 === f[3]) {
          if (0 === t2.indexOf(f[3]) || -1 < t2.indexOf("Link"))
            return f[3];
        } else if (i2 === f[2] && (0 === t2.indexOf(f[2]) || -1 < t2.indexOf("Move")))
          return f[2];
        return f[0];
      }
      var w = (x.prototype.o = function() {
        var n2 = this;
        this.u = 1, this.l = f[0], this.v = { data: {}, effectAllowed: void 0, mode: 3, types: [] }, this.p = { x: null, y: null }, this.g = { x: null, y: null };
        var h2 = this.m;
        if (this.I = new p(this.v, function(t3, i3, s3) {
          h2 = t3, "number" != typeof i3 && "number" != typeof s3 || (n2.j = { x: i3 || 0, y: s3 || 0 });
        }), this.v.mode = 2, this.I.dropEffect = f[0], y("dragstart", this.m, this.k, this.v, this.I))
          return this.u = 3, this.C(), false;
        a("page", this.k, this.g);
        var i2, t2, s2 = this.S.dragImageSetup(h2);
        return this.A = (i2 = s2, d.map(function(t3) {
          t3 = i2.style[t3 + "transform"];
          return t3 && "none" !== t3 ? t3.replace(/translate\(\D*\d+[^,]*,\D*\d+[^,]*\)\s*/g, "") : "";
        })), s2.style.position = "absolute", s2.style.left = "0px", s2.style.top = "0px", s2.style.zIndex = "999999", s2.classList.add("dnd-poly-drag-image"), s2.classList.add("dnd-poly-icon"), this.O = s2, this.j || (this.S.dragImageOffset ? this.j = { x: this.S.dragImageOffset.x, y: this.S.dragImageOffset.y } : this.S.dragImageCenterOnTouch ? (t2 = getComputedStyle(h2), this.j = { x: 0 - parseInt(t2.marginLeft, 10), y: 0 - parseInt(t2.marginTop, 10) }) : (s2 = h2.getBoundingClientRect(), t2 = getComputedStyle(h2), this.j = { x: s2.left - this.M.clientX - parseInt(t2.marginLeft, 10) + s2.width / 2, y: s2.top - this.M.clientY - parseInt(t2.marginTop, 10) + s2.height / 2 })), v(this.O, this.g, this.A, this.j, this.S.dragImageCenterOnTouch), document.body.appendChild(this.O), this.D = window.setInterval(function() {
          n2.F || (n2.F = true, n2.N(), n2.F = false);
        }, this.S.iterationInterval), true;
      }, x.prototype.C = function() {
        this.D && (clearInterval(this.D), this.D = null), n("touchmove", this.P), n("touchend", this.T), n("touchcancel", this.T), this.O && (this.O.parentNode.removeChild(this.O), this.O = null), this.L(this.S, this.k, this.u);
      }, x.prototype._ = function(t2) {
        var s2 = this;
        if (false !== r(t2, this.M.identifier)) {
          if (this.k = t2, 0 === this.u) {
            var i2 = void 0;
            if (this.S.dragStartConditionOverride)
              try {
                i2 = this.S.dragStartConditionOverride(t2);
              } catch (t3) {
                i2 = false;
              }
            else
              i2 = 1 === t2.touches.length;
            return i2 ? void (true === this.o() && (this.H.preventDefault(), t2.preventDefault())) : void this.C();
          }
          if (t2.preventDefault(), a("client", t2, this.p), a("page", t2, this.g), this.S.dragImageTranslateOverride)
            try {
              var n2 = false;
              if (this.S.dragImageTranslateOverride(t2, { x: this.p.x, y: this.p.y }, this.V, function(t3, i3) {
                s2.O && (n2 = true, s2.p.x += t3, s2.p.y += i3, s2.g.x += t3, s2.g.y += i3, v(s2.O, s2.g, s2.A, s2.j, s2.S.dragImageCenterOnTouch));
              }), n2)
                return;
            } catch (t3) {
            }
          v(this.O, this.g, this.A, this.j, this.S.dragImageCenterOnTouch);
        }
      }, x.prototype.X = function(t2) {
        if (false !== r(t2, this.M.identifier)) {
          if (this.S.dragImageTranslateOverride)
            try {
              this.S.dragImageTranslateOverride(void 0, void 0, void 0, function() {
              });
            } catch (t3) {
            }
          0 !== this.u ? (t2.preventDefault(), this.u = "touchcancel" === t2.type ? 3 : 2) : this.C();
        }
      }, x.prototype.N = function() {
        var t2 = this, i2 = this.l;
        this.v.mode = 3, this.I.dropEffect = f[0];
        var s2, n2, h2, e2, r2, o2 = y("drag", this.m, this.k, this.v, this.I);
        if (o2 && (this.l = f[0]), o2 || 2 === this.u || 3 === this.u)
          return this.Y(this.u) ? (e2 = this.m, s2 = this.O, n2 = this.A, a2 = function() {
            t2.q();
          }, void ("hidden" !== (r2 = getComputedStyle(e2)).visibility && "none" !== r2.display ? (s2.classList.add("dnd-poly-snapback"), h2 = getComputedStyle(s2), o2 = parseFloat(h2.transitionDuration), isNaN(o2) || 0 === o2 ? a2() : ((e2 = { x: (u2 = e2.getBoundingClientRect()).left, y: u2.top }).x += document.body.scrollLeft || document.documentElement.scrollLeft, e2.y += document.body.scrollTop || document.documentElement.scrollTop, e2.x -= parseInt(r2.marginLeft, 10), e2.y -= parseInt(r2.marginTop, 10), u2 = parseFloat(h2.transitionDelay), u2 = Math.round(1e3 * (o2 + u2)), v(s2, e2, n2, void 0, false), setTimeout(a2, u2))) : a2())) : void this.q();
        var u2 = this.S.elementFromPoint(this.p.x, this.p.y), a2 = this.B;
        u2 !== this.V && u2 !== this.B && (this.V = u2, null !== this.B && (this.v.mode = 3, this.I.dropEffect = f[0], y("dragexit", this.B, this.k, this.v, this.I, false)), null === this.V ? this.B = this.V : (this.v.mode = 3, this.I.dropEffect = m(this.v.effectAllowed, this.m), y("dragenter", this.V, this.k, this.v, this.I) ? (this.B = this.V, this.l = b(this.I.effectAllowed, this.I.dropEffect)) : this.V !== document.body && (this.B = document.body))), a2 !== this.B && l(a2) && (this.v.mode = 3, this.I.dropEffect = f[0], y("dragleave", a2, this.k, this.v, this.I, false, this.B)), l(this.B) && (this.v.mode = 3, this.I.dropEffect = m(this.v.effectAllowed, this.m), false === y("dragover", this.B, this.k, this.v, this.I) ? this.l = f[0] : this.l = b(this.I.effectAllowed, this.I.dropEffect)), i2 !== this.l && this.O.classList.remove(c + i2);
        i2 = c + this.l;
        this.O.classList.add(i2);
      }, x.prototype.Y = function(t2) {
        t2 = this.l === f[0] || null === this.B || 3 === t2;
        return t2 ? l(this.B) && (this.v.mode = 3, this.I.dropEffect = f[0], y("dragleave", this.B, this.k, this.v, this.I, false)) : l(this.B) && (this.v.mode = 1, this.I.dropEffect = this.l, true === y("drop", this.B, this.k, this.v, this.I) ? this.l = this.I.dropEffect : this.l = f[0]), t2;
      }, x.prototype.q = function() {
        this.v.mode = 3, this.I.dropEffect = this.l, y("dragend", this.m, this.k, this.v, this.I, false), this.u = 2, this.C();
      }, x);
      function x(t2, i2, s2, n2) {
        this.H = t2, this.S = i2, this.m = s2, this.L = n2, this.u = 0, this.V = null, this.B = null, this.k = t2, this.M = t2.changedTouches[0], this.P = this._.bind(this), this.T = this.X.bind(this), h("touchmove", this.P, false), h("touchend", this.T, false), h("touchcancel", this.T, false);
      }
      var I, j = { iterationInterval: 150, tryFindDraggableTarget: function(t2) {
        for (var i2 = 0, s2 = t2.composedPath(); i2 < s2.length; i2++) {
          var n2 = s2[i2];
          do {
            if (false !== n2.draggable) {
              if (true === n2.draggable)
                return n2;
              if (n2.getAttribute && "true" === n2.getAttribute("draggable"))
                return n2;
            }
          } while ((n2 = n2.parentNode) && n2 !== document.body);
        }
      }, dragImageSetup: function(t2) {
        var i2 = t2.cloneNode(true);
        return function t3(i3, s2) {
          if (1 === i3.nodeType) {
            for (var n2, h2, e2 = getComputedStyle(i3), r2 = 0; r2 < e2.length; r2++) {
              var o2 = e2[r2];
              s2.style.setProperty(o2, e2.getPropertyValue(o2), e2.getPropertyPriority(o2));
            }
            s2.style.pointerEvents = "none", s2.removeAttribute("id"), s2.removeAttribute("class"), s2.removeAttribute("draggable"), "CANVAS" === s2.nodeName && (n2 = s2, h2 = (h2 = i3).getContext("2d").getImageData(0, 0, h2.width, h2.height), n2.getContext("2d").putImageData(h2, 0, 0));
          }
          if (i3.hasChildNodes())
            for (r2 = 0; r2 < i3.childNodes.length; r2++)
              t3(i3.childNodes[r2], s2.childNodes[r2]);
          !function t4(i4) {
            if (i4 instanceof HTMLElement && (i4.style.pointerEvents = "none"), i4.children && i4.children.length)
              for (var s3 = 0; s3 < i4.children.length; s3++)
                t4(i4.children[s3]);
            if (i4.shadowRoot && i4.shadowRoot.children.length)
              for (s3 = 0; s3 < i4.shadowRoot.children.length; s3++)
                t4(i4.shadowRoot.children[s3]);
          }(s2);
        }(t2, i2), i2;
      }, elementFromPoint: function(t2, i2) {
        var s2 = document.elementFromPoint(t2, i2);
        if (s2) {
          for (; s2.shadowRoot; ) {
            var n2 = s2.shadowRoot.elementFromPoint(t2, i2);
            if (null === n2 || n2 === s2)
              break;
            s2 = n2;
          }
          return s2;
        }
      } };
      function k(i2) {
        if (!I) {
          var t2 = j.tryFindDraggableTarget(i2);
          if (t2)
            try {
              I = new w(i2, j, t2, S);
            } catch (t3) {
              throw S(j, i2, 3), t3;
            }
        }
      }
      function C(t2) {
        function i2(t3) {
          h2.off(), e2.off(), r2.off(), o2.off(), s2 && s2.dispatchEvent(new CustomEvent("dnd-poly-dragstart-cancel", { bubbles: true, cancelable: true })), clearTimeout(n2);
        }
        var s2 = t2.target;
        s2 && s2.dispatchEvent(new CustomEvent("dnd-poly-dragstart-pending", { bubbles: true, cancelable: true }));
        var n2 = window.setTimeout(function() {
          h2.off(), e2.off(), r2.off(), o2.off(), k(t2);
        }, j.holdToDrag), h2 = u(s2, "touchend", i2), e2 = u(s2, "touchcancel", i2), r2 = u(s2, "touchmove", i2), o2 = u(window, "scroll", i2, true);
      }
      function S(t2, i2, s2) {
        if (0 === s2 && t2.defaultActionOverride)
          try {
            t2.defaultActionOverride(i2), i2.defaultPrevented;
          } catch (t3) {
          }
        I = null;
      }
      t.polyfill = function(i2) {
        if (i2 && Object.keys(i2).forEach(function(t3) {
          j[t3] = i2[t3];
        }), !j.forceApply) {
          t2 = (t2 = !!window.chrome || /chrome/i.test(navigator.userAgent), { dragEvents: "ondragstart" in document.documentElement, draggable: "draggable" in document.documentElement, userAgentSupportingNativeDnD: !(/iPad|iPhone|iPod|Android/.test(navigator.userAgent) || t2 && "ontouchstart" in document.documentElement) });
          if (t2.userAgentSupportingNativeDnD && t2.draggable && t2.dragEvents)
            return false;
        }
        var t2;
        return j.holdToDrag ? h("touchstart", C, false) : h("touchstart", k, false), true;
      }, t.supportsPassiveEventListener = i, Object.defineProperty(t, "G", { value: true });
    });
  }
});

// src/parser.ts
var parser_exports = {};
__export(parser_exports, {
  DEFAULT_PREFIXES: () => DEFAULT_PREFIXES,
  addActualTimeTag: () => addActualTimeTag,
  applyComputedParentDurations: () => applyComputedParentDurations,
  buildTagRegexes: () => buildTagRegexes,
  buildTaskLine: () => buildTaskLine,
  buildTimeOptions: () => buildTimeOptions,
  findLastTaskLine: () => findLastTaskLine,
  formatActualTime: () => formatActualTime,
  formatClockShort: () => formatClockShort,
  formatCompactDuration: () => formatCompactDuration,
  formatDuration: () => formatDuration,
  formatExerciseLine: () => formatExerciseLine,
  formatExerciseSummary: () => formatExerciseSummary,
  formatHoursDecimal: () => formatHoursDecimal,
  formatTime: () => formatTime,
  formatTotal: () => formatTotal,
  generateTaskId: () => generateTaskId,
  parseActualTime: () => parseActualTime,
  parseCompactDuration: () => parseCompactDuration,
  parseDescription: () => parseDescription,
  parseDuration: () => parseDuration,
  parseExercises: () => parseExercises,
  parseFileTasks: () => parseFileTasks,
  parseFrontmatterField: () => parseFrontmatterField,
  parseOrder: () => parseOrder,
  parseProject: () => parseProject,
  parseSubproject: () => parseSubproject,
  parseTaggedLine: () => parseTaggedLine,
  parseTaskContexts: () => parseTaskContexts,
  parseTaskCreated: () => parseTaskCreated,
  parseTaskId: () => parseTaskId,
  parseTaskLine: () => parseTaskLine,
  parseTime: () => parseTime,
  removeDurationTag: () => removeDurationTag,
  removeOrderTag: () => removeOrderTag,
  removeProjectTag: () => removeProjectTag,
  removeTimeTag: () => removeTimeTag,
  setDurationTag: () => setDurationTag,
  setOrderTag: () => setOrderTag,
  setProjectTag: () => setProjectTag,
  setTaskChecked: () => setTaskChecked,
  setTaskContextTags: () => setTaskContextTags,
  setTaskCreatedTag: () => setTaskCreatedTag,
  setTaskDescription: () => setTaskDescription,
  setTaskIdTag: () => setTaskIdTag,
  setTaskMigrated: () => setTaskMigrated,
  setTaskTitle: () => setTaskTitle,
  setTimeTag: () => setTimeTag,
  snapToInterval: () => snapToInterval,
  sumSubtaskDurations: () => sumSubtaskDurations,
  timeDisplayToTagBody: () => timeDisplayToTagBody
});
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
    // Project tag supports an optional `/<subproject>` segment, e.g.
    // `#tp/silvermine/back-end`. Group 1 is the project, group 2 the subproject.
    project: new RegExp(
      `#${esc(prefixes.project)}\\/([\\w-]+)(?:\\/([\\w-]+))?`
    ),
    // Numeric segments accept `_` as a decimal separator (Obsidian tags treat
    // `.` as a tag terminator), so `#x/Run/1_5` parses as 1.5 reps and
    // `#x/BodyWeight/189_3` as 189.3.
    exercise: new RegExp(
      `#${esc(prefixes.exercise)}\\/([\\w-]+)\\/(\\d+(?:[._]\\d+)?)(?:\\/(\\d+(?:[._]\\d+)?))?`,
      "g"
    ),
    taskId: new RegExp(`#${esc(prefixes.taskId)}\\/([A-Za-z0-9]+)\\b`),
    actual: new RegExp(
      `#${esc(prefixes.actual)}\\/(?:(\\d+)h)?(?:(\\d+)m)?(?=\\s|$)`
    ),
    // Repeatable label tag — `g` flag so callers can collect every match on
    // a line via matchAll.
    taskContext: new RegExp(
      `#${esc(prefixes.taskContext)}\\/([\\w-]+)`,
      "g"
    ),
    taskCreated: new RegExp(
      `#${esc(prefixes.taskCreated)}\\/(\\d{4}-\\d{2}-\\d{2})\\b`
    )
  };
}
function parseExercises(content, prefixes) {
  const re = buildTagRegexes(prefixes).exercise;
  const out = [];
  const byName = /* @__PURE__ */ new Map();
  for (const line of content.split("\n")) {
    const taskMatch = TASK_LINE.exec(line);
    if (!taskMatch)
      continue;
    const done = taskMatch[2] === "x" || taskMatch[2] === "X";
    for (const m of taskMatch[3].matchAll(re)) {
      const name = m[1];
      const reps = parseFloat(m[2].replace("_", "."));
      const weight = m[3] !== void 0 ? parseFloat(m[3].replace("_", ".")) : null;
      if (!isFinite(reps) || reps <= 0)
        continue;
      let summary = byName.get(name);
      if (!summary) {
        summary = { name, sets: [] };
        byName.set(name, summary);
        out.push(summary);
      }
      summary.sets.push({ reps, weight, done });
    }
  }
  return out;
}
function formatSets(sets) {
  if (sets.length === 0)
    return "";
  const hasWeight = sets.some((s) => s.weight !== null);
  if (!hasWeight) {
    return String(sets.reduce((a, s) => a + s.reps, 0));
  }
  const buckets = /* @__PURE__ */ new Map();
  for (const set of sets) {
    const key = set.weight === null ? "" : String(set.weight);
    const cur = buckets.get(key);
    if (cur)
      cur.reps += set.reps;
    else
      buckets.set(key, { reps: set.reps, weight: set.weight });
  }
  const parts = [];
  for (const { reps, weight } of buckets.values()) {
    parts.push(weight === null ? `${reps}` : `${reps}\xD7${weight}`);
  }
  return parts.join(", ");
}
function formatExerciseSummary(summary) {
  const done = formatSets(summary.sets.filter((s) => s.done));
  const pending = formatSets(summary.sets.filter((s) => !s.done));
  if (done && pending)
    return `${summary.name} ${done} (${pending})`;
  if (done)
    return `${summary.name} ${done}`;
  if (pending)
    return `${summary.name} (${pending})`;
  return summary.name;
}
function parseTaggedLine(content, tagName) {
  const tag = tagName.replace(/^#+/, "").trim();
  if (!tag)
    return null;
  const esc = tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`#${esc}(?![A-Za-z0-9_/])\\s*([^\\n]*)`);
  for (const line of content.split("\n")) {
    const m = re.exec(line);
    if (!m)
      continue;
    const text = m[1].trim();
    if (text.length === 0)
      continue;
    return text;
  }
  return null;
}
function parseFrontmatterField(frontmatter, tagName) {
  if (!frontmatter)
    return null;
  const key = tagName.replace(/^#+/, "").trim();
  if (!key)
    return null;
  const v = frontmatter[key];
  if (v == null)
    return null;
  if (typeof v === "string") {
    const t = v.trim();
    return t.length ? t : null;
  }
  if (typeof v === "number" || typeof v === "boolean") {
    return String(v);
  }
  if (Array.isArray(v)) {
    for (const item of v) {
      if (typeof item === "string") {
        const t = item.trim();
        if (t.length)
          return t;
      } else if (typeof item === "number" || typeof item === "boolean") {
        return String(item);
      }
    }
    return null;
  }
  return null;
}
function formatExerciseLine(summaries) {
  return summaries.map(formatExerciseSummary).join(" \u2022 ");
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
function parseSubproject(body, prefixes) {
  const m = buildTagRegexes(prefixes).project.exec(body);
  return m && m[2] ? m[2] : null;
}
function parseTaskContexts(body, prefixes) {
  const re = buildTagRegexes(prefixes).taskContext;
  const seen = /* @__PURE__ */ new Set();
  const out = [];
  for (const m of body.matchAll(re)) {
    const tag = m[1];
    if (!seen.has(tag)) {
      seen.add(tag);
      out.push(tag);
    }
  }
  return out;
}
function parseDescription(body) {
  const m = DESCRIPTION_RE.exec(body);
  if (!m)
    return null;
  const text = m[1].trim();
  return text.length > 0 ? text : null;
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
function sumSubtaskDurations(subtaskRawLines, prefixes) {
  let total = 0;
  for (const line of subtaskRawLines) {
    const d = parseDuration(line, prefixes);
    if (d !== null)
      total += d;
  }
  return total;
}
function applyComputedParentDurations(content, prefixes) {
  const tasks = parseFileTasks("", content, prefixes, 0);
  let lines = null;
  for (const t of tasks) {
    if (t.hasExplicitDuration)
      continue;
    const sum = sumSubtaskDurations(
      t.subtasks.map((s) => s.rawLine),
      prefixes
    );
    if (sum <= 0)
      continue;
    if (!lines)
      lines = content.split("\n");
    if (lines[t.lineNumber] !== t.rawLine)
      continue;
    lines[t.lineNumber] = setDurationTag(t.rawLine, sum, prefixes);
  }
  return lines ? lines.join("\n") : content;
}
function parseActualTime(body, prefixes) {
  const m = buildTagRegexes(prefixes).actual.exec(body);
  if (!m)
    return null;
  const h = m[1] ? parseInt(m[1], 10) : 0;
  const min = m[2] ? parseInt(m[2], 10) : 0;
  const total = h * 60 + min;
  return total > 0 ? total : null;
}
function formatActualTime(totalMin, prefixes) {
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
  return `#${prefixes.actual}/${body}`;
}
function addActualTimeTag(rawLine, addMin, prefixes) {
  if (addMin <= 0)
    return rawLine;
  const re = buildTagRegexes(prefixes).actual;
  const m = re.exec(rawLine);
  const existing = m === null ? 0 : (m[1] ? parseInt(m[1], 10) : 0) * 60 + (m[2] ? parseInt(m[2], 10) : 0);
  const total = existing + addMin;
  const newTag = formatActualTime(total, prefixes);
  if (m)
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
  const indent = m[1];
  const body = m[3];
  const explicitDuration = parseDuration(body, prefixes);
  const startMin = parseTime(body, prefixes);
  const durationMin = explicitDuration != null ? explicitDuration : defaultDurationMin;
  const order = parseOrder(body, prefixes);
  const project = parseProject(body, prefixes);
  const subproject = parseSubproject(body, prefixes);
  const description = parseDescription(body);
  const checked = m[2] !== " ";
  const tags = parseTaskContexts(body, prefixes);
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
    project,
    subproject,
    description,
    indent,
    subtasks: [],
    tags
  };
}
function parseFileTasks(filePath, fileContent, prefixes, defaultDurationMin) {
  const lines = fileContent.split("\n");
  const tasks = [];
  let parent = null;
  for (let i = 0; i < lines.length; i++) {
    const m = TASK_LINE.exec(lines[i]);
    if (!m)
      continue;
    const indent = m[1];
    if (parent && indent.length > parent.indent.length) {
      parent.subtasks.push({
        lineNumber: i,
        rawLine: lines[i],
        text: m[3],
        checked: m[2] !== " "
      });
      continue;
    }
    const t = parseTaskLine(filePath, i, lines[i], prefixes, defaultDurationMin);
    if (!t)
      continue;
    tasks.push(t);
    parent = t;
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
function removeDurationTag(rawLine, prefixes) {
  const re = buildTagRegexes(prefixes).duration;
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
function setProjectTag(rawLine, project, prefixes) {
  const re = buildTagRegexes(prefixes).project;
  const newTag = `#${prefixes.project}/${project}`;
  if (re.test(rawLine))
    return rawLine.replace(re, newTag);
  return appendTag(rawLine, newTag);
}
function removeProjectTag(rawLine, prefixes) {
  const re = buildTagRegexes(prefixes).project;
  return rawLine.replace(re, "").replace(/[ \t]+$/, "").replace(/  +/g, " ");
}
function setTaskContextTags(rawLine, tags, prefixes) {
  const re = buildTagRegexes(prefixes).taskContext;
  const seen = /* @__PURE__ */ new Set();
  const cleaned = [];
  for (const t of tags) {
    const norm = t.trim();
    if (!norm || !/^[\w-]+$/.test(norm))
      continue;
    if (seen.has(norm))
      continue;
    seen.add(norm);
    cleaned.push(norm);
  }
  let stripped = rawLine.replace(re, "").replace(/[ \t]+$/, "").replace(/  +/g, " ");
  if (cleaned.length === 0)
    return stripped;
  const formatted = cleaned.map((t) => `#${prefixes.taskContext}/${t}`).join(" ");
  return `${stripped} ${formatted}`.replace(/  +/g, " ");
}
function parseTaskId(body, prefixes) {
  const m = buildTagRegexes(prefixes).taskId.exec(body);
  return m ? m[1] : null;
}
function setTaskIdTag(rawLine, id, prefixes) {
  const re = buildTagRegexes(prefixes).taskId;
  const newTag = `#${prefixes.taskId}/${id}`;
  if (re.test(rawLine))
    return rawLine.replace(re, newTag);
  return appendTag(rawLine, newTag);
}
function generateTaskId(length) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const len = Math.max(1, Math.floor(length));
  let id = "";
  for (let i = 0; i < len; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
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
function setTaskChecked(rawLine, checked) {
  const m = TASK_LINE.exec(rawLine);
  if (!m)
    return rawLine;
  const indent = m[1];
  const body = m[3];
  return `${indent}- [${checked ? "x" : " "}] ${body}`;
}
function setTaskMigrated(rawLine) {
  const m = TASK_LINE.exec(rawLine);
  if (!m)
    return rawLine;
  const indent = m[1];
  const body = m[3];
  return `${indent}- [>] ${body}`;
}
function parseTaskCreated(body, prefixes) {
  const m = buildTagRegexes(prefixes).taskCreated.exec(body);
  return m ? m[1] : null;
}
function setTaskCreatedTag(rawLine, dateStr, prefixes) {
  const re = buildTagRegexes(prefixes).taskCreated;
  if (re.test(rawLine))
    return rawLine;
  return appendTag(rawLine, `#${prefixes.taskCreated}/${dateStr}`);
}
function setTaskTitle(rawLine, newTitle, prefixes) {
  const m = TASK_LINE.exec(rawLine);
  if (!m)
    return rawLine;
  const indent = m[1];
  const checkbox = m[2];
  const body = m[3];
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const tagRe = new RegExp(
    `#(?:${esc(prefixes.duration)}|${esc(prefixes.time)}|${esc(prefixes.order)}|${esc(prefixes.project)}|${esc(prefixes.exercise)}|${esc(prefixes.taskId)}|${esc(prefixes.taskContext)}|${esc(prefixes.taskCreated)})\\/`
  );
  const tagMatch = tagRe.exec(body);
  let tagsPart = tagMatch ? body.slice(tagMatch.index).trim() : "";
  const beforeTags = tagMatch ? body.slice(0, tagMatch.index) : body;
  const descMatch = DESCRIPTION_RE.exec(beforeTags);
  const descPart = descMatch ? `{${descMatch[1].trim()}}` : "";
  const bareTags = [];
  for (const bm of beforeTags.matchAll(/#[A-Za-z][\w-]*(?![\w/-])/g)) {
    bareTags.push(bm[0]);
  }
  const singletonPrefixes = [
    prefixes.duration,
    prefixes.time,
    prefixes.order,
    prefixes.project
  ];
  for (const p of singletonPrefixes) {
    if (new RegExp(`#${esc(p)}\\/\\S+`).test(newTitle)) {
      tagsPart = tagsPart.replace(new RegExp(`#${esc(p)}\\/\\S+`, "g"), "").replace(/\s+/g, " ").trim();
    }
  }
  const trimmedTitle = newTitle.trim();
  const parts = [trimmedTitle];
  for (const t of bareTags)
    parts.push(t);
  if (descPart)
    parts.push(descPart);
  if (tagsPart)
    parts.push(tagsPart);
  return `${indent}- [${checkbox}] ${parts.join(" ")}`;
}
function setTaskDescription(rawLine, newDescription, prefixes) {
  const m = TASK_LINE.exec(rawLine);
  if (!m)
    return rawLine;
  const indent = m[1];
  const checkbox = m[2];
  const body = m[3];
  const trimmed = newDescription.trim();
  const hasDesc = DESCRIPTION_RE.test(body);
  if (hasDesc) {
    const next = trimmed ? body.replace(DESCRIPTION_RE, `{${trimmed}}`) : body.replace(DESCRIPTION_RE, "").replace(/[ \t]+/g, " ").trim();
    return `${indent}- [${checkbox}] ${next}`;
  }
  if (!trimmed)
    return rawLine;
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const tagRe = new RegExp(
    `#(?:${esc(prefixes.duration)}|${esc(prefixes.time)}|${esc(prefixes.order)}|${esc(prefixes.project)}|${esc(prefixes.exercise)}|${esc(prefixes.taskId)}|${esc(prefixes.taskContext)}|${esc(prefixes.taskCreated)})\\/`
  );
  const tagMatch = tagRe.exec(body);
  if (tagMatch) {
    const before = body.slice(0, tagMatch.index).replace(/\s+$/, "");
    const after = body.slice(tagMatch.index);
    return `${indent}- [${checkbox}] ${before} {${trimmed}} ${after}`.replace(/  +/g, " ");
  }
  return `${indent}- [${checkbox}] ${body.replace(/\s+$/, "")} {${trimmed}}`;
}
function buildTaskLine(body, prefixes, opts) {
  const tags = [];
  if (opts.startMin !== void 0) {
    tags.push(formatTime(opts.startMin, prefixes));
  }
  tags.push(formatDuration(opts.durationMin, prefixes));
  if (opts.project) {
    tags.push(`#${prefixes.project}/${opts.project}`);
  }
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
function formatHoursDecimal(totalMin) {
  if (totalMin <= 0)
    return "0";
  const hours = totalMin / 60;
  return hours.toFixed(2).replace(/\.?0+$/, "");
}
function formatClockShort(totalMin) {
  const h24 = Math.floor(totalMin / 60) % 24;
  const m = totalMin % 60;
  const ampm = h24 < 12 ? "a" : "p";
  let h12 = h24 % 12;
  if (h12 === 0)
    h12 = 12;
  return m === 0 ? `${h12}${ampm}` : `${h12}:${m.toString().padStart(2, "0")}${ampm}`;
}
function buildTimeOptions(startHour, endHour) {
  const out = [];
  const lo = Math.max(0, Math.min(23, Math.floor(startHour)));
  const hi = Math.max(lo + 1, Math.min(24, Math.floor(endHour)));
  for (let h = lo; h < hi; h++) {
    out.push(formatClockShort(h * 60));
    out.push(formatClockShort(h * 60 + 30));
  }
  return out;
}
function timeDisplayToTagBody(display) {
  return display.replace(":", "");
}
function formatCompactDuration(totalMin) {
  if (totalMin <= 0)
    return "0m";
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h === 0)
    return `${m}m`;
  if (m === 0)
    return `${h}h`;
  return `${h}h${m}m`;
}
function parseCompactDuration(raw) {
  const s = raw.replace(/\s+/g, "").toLowerCase();
  if (!s)
    return null;
  const m = /^(?:(\d+)h)?(?:(\d+)m)?$/.exec(s);
  if (!m || !m[1] && !m[2])
    return null;
  const total = (m[1] ? parseInt(m[1], 10) : 0) * 60 + (m[2] ? parseInt(m[2], 10) : 0);
  return total > 0 ? total : null;
}
var DEFAULT_PREFIXES, TASK_LINE, DESCRIPTION_RE;
var init_parser = __esm({
  "src/parser.ts"() {
    DEFAULT_PREFIXES = {
      duration: "d",
      time: "t",
      order: "o",
      project: "p",
      exercise: "x",
      taskId: "tid",
      actual: "ta",
      taskContext: "tc",
      taskCreated: "tcr"
    };
    TASK_LINE = /^(\s*)- \[([ xX/\-!?*<>])\]\s+(.*)$/;
    DESCRIPTION_RE = /\{([^{}]*)\}/;
  }
});

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => TodayPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian10 = require("obsidian");
var import_mobile_drag_drop = __toESM(require_index_min());

// src/view.ts
var import_obsidian5 = require("obsidian");

// src/settings.ts
var import_obsidian2 = require("obsidian");
init_parser();

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
function resolveProjectColors(tasks, userMappings, palette = DEFAULT_PALETTE) {
  var _a, _b;
  const result = /* @__PURE__ */ new Map();
  const userMap = /* @__PURE__ */ new Map();
  for (const m of userMappings) {
    const key = (_a = m.project) == null ? void 0 : _a.trim();
    const color = (_b = m.color) == null ? void 0 : _b.trim();
    if (key && color)
      userMap.set(key.toLowerCase(), color);
  }
  const projectsFromTasks = [];
  const subKeysFromTasks = [];
  const seenProj = /* @__PURE__ */ new Set();
  const seenSub = /* @__PURE__ */ new Set();
  for (const t of tasks) {
    if (!t.project)
      continue;
    if (!seenProj.has(t.project)) {
      seenProj.add(t.project);
      projectsFromTasks.push(t.project);
    }
    if (t.subproject) {
      const k = `${t.project}/${t.subproject}`;
      if (!seenSub.has(k)) {
        seenSub.add(k);
        subKeysFromTasks.push(k);
      }
    }
  }
  const userColorsUsed = /* @__PURE__ */ new Set();
  for (const proj of projectsFromTasks) {
    const userColor = userMap.get(proj.toLowerCase());
    if (userColor) {
      result.set(proj, userColor);
      userColorsUsed.add(userColor.toLowerCase());
    }
  }
  for (const subKey of subKeysFromTasks) {
    const userColor = userMap.get(subKey.toLowerCase());
    if (userColor) {
      result.set(subKey, userColor);
      userColorsUsed.add(userColor.toLowerCase());
    }
  }
  const remaining = projectsFromTasks.filter((p) => !userMap.has(p.toLowerCase())).sort((a, b) => a.localeCompare(b));
  const available = palette.filter(
    (c) => !userColorsUsed.has(c.toLowerCase())
  );
  const pool = available.length > 0 ? available : palette;
  remaining.forEach((proj, i) => {
    result.set(proj, pool[i % pool.length]);
  });
  return result;
}
function getTaskColor(project, subproject, colorMap) {
  var _a;
  if (!project)
    return null;
  if (subproject) {
    const sub = colorMap.get(`${project}/${subproject}`);
    if (sub)
      return sub;
  }
  return (_a = colorMap.get(project)) != null ? _a : null;
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

// src/migrate.ts
var import_obsidian = require("obsidian");
var escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
var TagMigrationModal = class extends import_obsidian.Modal {
  constructor(app, opts) {
    super(app);
    this.matches = [];
    this.totalReplacements = 0;
    this.scanning = true;
    this.opts = opts;
  }
  async onOpen() {
    this.modalEl.addClass("dp-title-modal");
    this.modalEl.addClass("dp-migrate-modal");
    this.titleEl.setText("Migrate task tags");
    this.renderScanning();
    await this.scan();
    this.scanning = false;
    this.render();
  }
  renderScanning() {
    this.contentEl.empty();
    this.contentEl.createDiv({
      cls: "dp-migrate-scanning",
      text: "Scanning\u2026"
    });
  }
  collectFiles() {
    const all = this.app.vault.getMarkdownFiles();
    const folder = this.opts.folder.trim().replace(/\/+$/, "");
    if (!folder)
      return all;
    const prefix = `${folder}/`;
    return all.filter((f) => f.path.startsWith(prefix));
  }
  buildAlternationRegex() {
    const ordered = [...this.opts.changes].sort(
      (a, b) => b.oldPrefix.length - a.oldPrefix.length
    );
    const alternation = ordered.map((c) => escapeRegex(c.oldPrefix)).join("|");
    return new RegExp(`#(${alternation})\\/`, "g");
  }
  prefixMap() {
    const m = /* @__PURE__ */ new Map();
    for (const ch of this.opts.changes)
      m.set(ch.oldPrefix, ch.newPrefix);
    return m;
  }
  async scan() {
    const files = this.collectFiles();
    const re = this.buildAlternationRegex();
    const matches = [];
    let total = 0;
    for (const file of files) {
      const content = await this.app.vault.read(file);
      const found = content.match(re);
      if (found && found.length > 0) {
        matches.push({ file, count: found.length });
        total += found.length;
      }
    }
    this.matches = matches.sort(
      (a, b) => a.file.path.localeCompare(b.file.path)
    );
    this.totalReplacements = total;
  }
  render() {
    this.contentEl.empty();
    const warn = this.contentEl.createDiv({ cls: "dp-migrate-warn" });
    warn.setText(
      "This rewrites task lines in your vault. The change can't be undone \u2014 make a backup if you're unsure."
    );
    const summary = this.contentEl.createDiv({ cls: "dp-migrate-summary" });
    const folderText = this.opts.folder.trim() || "entire vault";
    const folderRow = summary.createDiv({ cls: "dp-migrate-summary-row" });
    folderRow.createSpan({ cls: "dp-migrate-summary-label", text: "Folder" });
    folderRow.createSpan({
      cls: "dp-migrate-summary-value",
      text: folderText
    });
    for (const ch of this.opts.changes) {
      const row = summary.createDiv({ cls: "dp-migrate-summary-row" });
      row.createSpan({
        cls: "dp-migrate-summary-label",
        text: keyLabel(ch.key)
      });
      row.createSpan({
        cls: "dp-migrate-summary-value",
        text: `#${ch.oldPrefix}/ \u2192 #${ch.newPrefix}/`
      });
    }
    if (this.matches.length === 0) {
      const none = this.contentEl.createDiv({ cls: "dp-migrate-none" });
      none.setText("No matches found in the selected folder.");
    } else {
      const stats = this.contentEl.createDiv({ cls: "dp-migrate-stats" });
      const fileWord = this.matches.length === 1 ? "file" : "files";
      const tagWord = this.totalReplacements === 1 ? "tag" : "tags";
      stats.setText(
        `Found ${this.totalReplacements} ${tagWord} across ${this.matches.length} ${fileWord}.`
      );
      const list = this.contentEl.createDiv({ cls: "dp-migrate-files" });
      this.matches.forEach((m) => {
        const row = list.createDiv({ cls: "dp-migrate-file-row" });
        row.createSpan({ cls: "dp-migrate-file-path", text: m.file.path });
        row.createSpan({
          cls: "dp-migrate-file-count",
          text: m.count.toString()
        });
      });
    }
    const actions = this.contentEl.createDiv({ cls: "dp-edit-actions" });
    const skip = actions.createEl("button", {
      cls: "dp-edit-show-btn",
      text: "Skip"
    });
    skip.type = "button";
    skip.addEventListener("click", () => this.close());
    if (this.matches.length > 0) {
      const apply = actions.createEl("button", {
        cls: "dp-edit-save-btn mod-cta",
        text: `Migrate ${this.totalReplacements} ${this.totalReplacements === 1 ? "tag" : "tags"}`
      });
      apply.type = "button";
      apply.addEventListener("click", () => void this.apply(apply));
    }
  }
  async apply(applyBtn) {
    applyBtn.disabled = true;
    applyBtn.setText("Migrating\u2026");
    const re = this.buildAlternationRegex();
    const map = this.prefixMap();
    let total = 0;
    let touched = 0;
    for (const m of this.matches) {
      let fileChanges = 0;
      await this.app.vault.process(m.file, (content) => {
        return content.replace(re, (_full, oldPrefix) => {
          var _a;
          fileChanges++;
          const newPrefix = (_a = map.get(oldPrefix)) != null ? _a : oldPrefix;
          return `#${newPrefix}/`;
        });
      });
      if (fileChanges > 0) {
        total += fileChanges;
        touched++;
      }
    }
    new import_obsidian.Notice(
      `Migrated ${total} tag${total === 1 ? "" : "s"} across ${touched} file${touched === 1 ? "" : "s"}.`
    );
    this.close();
  }
  onClose() {
    this.contentEl.empty();
  }
};
function keyLabel(key) {
  switch (key) {
    case "duration":
      return "Duration";
    case "time":
      return "Time";
    case "order":
      return "Order";
    case "project":
      return "Project";
    case "exercise":
      return "Exercise";
    case "taskId":
      return "Task ID";
    case "actual":
      return "Actual time";
    case "taskContext":
      return "Task context";
    case "taskCreated":
      return "Task created";
  }
}

// src/settings.ts
var DEFAULT_AUTOCOMPLETE = {
  projectTrigger: "##",
  timeTrigger: "#@",
  durationTrigger: "#$",
  dateTrigger: "@"
};
var DEFAULT_WEEKDAY_TEMPLATES = {
  sunday: "",
  monday: "",
  tuesday: "",
  wednesday: "",
  thursday: "",
  friday: "",
  saturday: ""
};
var WEEKDAY_NAMES = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday"
];
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
  autocomplete: { ...DEFAULT_AUTOCOMPLETE },
  dailyNoteFormatFallback: "YYYY-MM-DD",
  dailyNoteFolderFallback: "daily",
  dailyNoteTemplate: "",
  dailyNoteTemplatesByDay: { ...DEFAULT_WEEKDAY_TEMPLATES },
  quotesFile: "daily/_quotes.md",
  addCreatedTagToFrontmatter: true,
  defaultDurationMin: 15,
  quickDurationsMin: [15, 30, 45, 60, 90, 120],
  projectColors: [],
  contextTags: [],
  noteTag: "note",
  intentionTag: "intention",
  quoteTag: "quote",
  timelineHeightDesktop: "",
  timelineHeightMobile: "",
  pomodoroWorkMin: 25,
  pomodoroBreakMin: 5,
  pomodoroAutoStart: true,
  pomodoroAutoCycle: true,
  pomodoroAutoReturn: true,
  taskIdLength: 4,
  dateLinkFormat: "ddd, MMM D, YYYY",
  peopleFolder: "",
  habitsFile: "daily/_habits.md",
  habitPrefix: "h",
  habitWeekStart: 0,
  habitsHideCompleted: false,
  habitsStatsWindow: 10,
  copySubtasksOnAutocomplete: false,
  inboxPath: "{daily}/_inbox.md",
  confirmCollectMigration: true,
  multiDayCount: 7
};
var CSS_LENGTH_RE = /^\d+(?:\.\d+)?(?:px|vh|vw|em|rem|%)$/;
var MAX_QUICK_DURATIONS = 9;
function parseQuickDurations(raw) {
  const tokens = raw.split(",").map((t) => t.trim()).filter((t) => t.length > 0);
  if (tokens.length === 0)
    return null;
  const out = [];
  const seen = /* @__PURE__ */ new Set();
  for (const tok of tokens) {
    const min = parseCompactDuration(tok);
    if (min === null)
      return null;
    if (seen.has(min))
      continue;
    seen.add(min);
    out.push(min);
    if (out.length >= MAX_QUICK_DURATIONS)
      break;
  }
  return out.length > 0 ? out : null;
}
function formatQuickDurations(mins) {
  return mins.map((m) => formatCompactDuration(m)).join(", ");
}
function parseTimelineHeight(raw) {
  const v = raw.trim();
  if (!v)
    return null;
  if (/^\d+(?:\.\d+)?$/.test(v))
    return `${v}px`;
  return CSS_LENGTH_RE.test(v) ? v : null;
}
var TAB_SPECS = {
  general: { label: "Automations", icon: "sliders-horizontal" },
  templating: { label: "Templating", icon: "file-text" },
  tasks: { label: "Tasks", icon: "list-checks" },
  day: { label: "Day", icon: "sun" },
  view: { label: "View", icon: "eye" },
  projects: { label: "Projects", icon: "folder-kanban" },
  pomodoro: { label: "Pomodoro", icon: "timer" },
  habits: { label: "Habits", icon: "repeat" }
};
var TodaySettingTab = class extends import_obsidian2.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    // Captured the first time the tab is opened, cleared on hide(). Persists
    // across re-renders triggered from inside display() (e.g. project section
    // calling this.display() after a prefix edit), so we can compare the user's
    // final state against where they started when the tab closes.
    this.prefixSnapshot = null;
    this.activeTab = "general";
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    if (!this.prefixSnapshot) {
      this.prefixSnapshot = { ...this.plugin.settings.prefixes };
    }
    containerEl.empty();
    containerEl.addClass("dp-settings");
    this.renderIntro(containerEl);
    this.renderTabs(containerEl);
    const pane = containerEl.createDiv({ cls: "dp-settings-pane" });
    switch (this.activeTab) {
      case "general":
        this.renderAutocompleteSection(pane);
        break;
      case "templating":
        this.renderTemplatingSection(pane);
        break;
      case "tasks":
        this.renderTaskDefaultsSection(pane);
        this.renderTaskIdSection(pane);
        this.renderNotesSection(pane);
        break;
      case "day":
        this.renderDaySection(pane);
        break;
      case "view":
        this.renderViewSection(pane);
        break;
      case "projects":
        this.renderProjectsSection(pane);
        this.renderContextTagsSection(pane);
        break;
      case "pomodoro":
        this.renderPomodoroSection(pane);
        break;
      case "habits":
        this.renderHabitsSection(pane);
        break;
    }
  }
  renderIntro(containerEl) {
    const intro = containerEl.createEl("details", {
      cls: "dp-settings-intro"
    });
    intro.createEl("summary", {
      cls: "dp-settings-intro-title",
      text: "Today plugin settings"
    });
    const sub = intro.createEl("p", { cls: "dp-settings-intro-sub" });
    sub.append(
      "Configure how the Today dashboard parses your daily notes, colors your projects, and runs the pomodoro and habit trackers. Tag prefixes and trigger strings are global \u2014 change them here and the plugin migrates existing tags on close. See the ",
      makeAnchor(
        "https://github.com/silvermineai/obsidian-today",
        "README"
      ),
      " for the full tag reference."
    );
  }
  renderTabs(containerEl) {
    const bar = containerEl.createDiv({ cls: "dp-settings-tabs" });
    Object.keys(TAB_SPECS).forEach((tab) => {
      const spec = TAB_SPECS[tab];
      const btn = bar.createEl("button", { cls: "dp-settings-tab" });
      const iconEl = btn.createSpan({ cls: "dp-settings-tab-icon" });
      (0, import_obsidian2.setIcon)(iconEl, spec.icon);
      btn.createSpan({ cls: "dp-settings-tab-label", text: spec.label });
      if (tab === this.activeTab)
        btn.addClass("is-active");
      btn.addEventListener("click", () => {
        if (this.activeTab === tab)
          return;
        this.activeTab = tab;
        this.display();
      });
    });
  }
  hide() {
    if (!this.prefixSnapshot)
      return;
    const snap = this.prefixSnapshot;
    this.prefixSnapshot = null;
    const current = this.plugin.settings.prefixes;
    const keys = [
      "duration",
      "time",
      "order",
      "project",
      "exercise",
      "taskId",
      "actual",
      "taskContext",
      "taskCreated"
    ];
    const changes = [];
    for (const key of keys) {
      const oldP = snap[key];
      const newP = current[key];
      if (oldP && newP && oldP !== newP) {
        changes.push({ key, oldPrefix: oldP, newPrefix: newP });
      }
    }
    if (changes.length > 0) {
      new TagMigrationModal(this.app, {
        changes,
        folder: this.plugin.settings.dailyNoteFolderFallback
      }).open();
    }
  }
  renderTaskDefaultsSection(containerEl) {
    new import_obsidian2.Setting(containerEl).setName("Defaults").setHeading();
    new import_obsidian2.Setting(containerEl).setName("Default duration (minutes)").setDesc(
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
    new import_obsidian2.Setting(containerEl).setName("Quick duration chips").setDesc(
      `Comma-separated durations for the chips on the new-task and edit-task modals (max ${MAX_QUICK_DURATIONS}). Accepts forms like 5m, 1h, 1h30m, 90m.`
    ).addText((t) => {
      const initial = formatQuickDurations(
        this.plugin.settings.quickDurationsMin
      );
      t.setPlaceholder("15m, 30m, 45m, 1h, 1h30m, 2h").setValue(initial);
      t.inputEl.addEventListener("blur", async () => {
        const parsed = parseQuickDurations(t.inputEl.value);
        if (parsed) {
          this.plugin.settings.quickDurationsMin = parsed;
          await this.plugin.saveSettings();
          t.setValue(formatQuickDurations(parsed));
        } else {
          t.setValue(formatQuickDurations(this.plugin.settings.quickDurationsMin));
        }
      });
    });
    new import_obsidian2.Setting(containerEl).setName("Snap interval (minutes)").setDesc(
      "Drag-drop snaps to this granularity. Also controls the sub-marks revealed on hover in the timeline gutter (e.g. 15 \u2192 :15, :30, :45)."
    ).addText(
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
    new import_obsidian2.Setting(containerEl).setName("Duration tag prefix").setDesc(buildDurationDesc()).addText(
      (t) => t.setValue(this.plugin.settings.prefixes.duration).onChange(async (v) => {
        if (/^[a-zA-Z]+$/.test(v)) {
          this.plugin.settings.prefixes.duration = v;
          await this.plugin.saveSettings();
        }
      })
    );
    new import_obsidian2.Setting(containerEl).setName("Time tag prefix").setDesc(buildTimeDesc()).addText(
      (t) => t.setValue(this.plugin.settings.prefixes.time).onChange(async (v) => {
        if (/^[a-zA-Z]+$/.test(v)) {
          this.plugin.settings.prefixes.time = v;
          await this.plugin.saveSettings();
        }
      })
    );
    new import_obsidian2.Setting(containerEl).setName("Order tag prefix").setDesc(buildOrderDesc()).addText(
      (t) => t.setValue(this.plugin.settings.prefixes.order).onChange(async (v) => {
        if (/^[a-zA-Z]+$/.test(v)) {
          this.plugin.settings.prefixes.order = v;
          await this.plugin.saveSettings();
        }
      })
    );
    new import_obsidian2.Setting(containerEl).setName("Exercise tag prefix").setDesc(buildExerciseDesc()).addText(
      (t) => t.setValue(this.plugin.settings.prefixes.exercise).onChange(async (v) => {
        if (/^[a-zA-Z]+$/.test(v)) {
          this.plugin.settings.prefixes.exercise = v;
          await this.plugin.saveSettings();
        }
      })
    );
    new import_obsidian2.Setting(containerEl).setName("Task context tag prefix").setDesc(
      "Prefix for free-form task labels (e.g. #tc/billable, #tc/client-acme). Multiple tags per task are allowed and rendered as chips next to the project label."
    ).addText(
      (t) => t.setValue(this.plugin.settings.prefixes.taskContext).onChange(async (v) => {
        if (/^[a-zA-Z]+$/.test(v)) {
          this.plugin.settings.prefixes.taskContext = v;
          await this.plugin.saveSettings();
        }
      })
    );
    new import_obsidian2.Setting(containerEl).setName("Copy sub-tasks on title autocomplete").setDesc(
      "When you pick a prior task from the title autocomplete in the new/edit task modal, also copy its sub-tasks (all unchecked). Off keeps just the project, duration, description, and tags."
    ).addToggle(
      (t) => t.setValue(this.plugin.settings.copySubtasksOnAutocomplete).onChange(async (v) => {
        this.plugin.settings.copySubtasksOnAutocomplete = v;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian2.Setting(containerEl).setName("Inbox").setHeading();
    const inboxDesc = document.createDocumentFragment();
    inboxDesc.append(
      "Where the ",
      makeCode("Collect unfinished tasks into inbox"),
      " command writes. Use ",
      makeCode("{daily}"),
      " to refer to your daily-notes folder. Default ",
      makeCode("{daily}/_inbox.md"),
      ". Migrated tasks are appended to this file as ",
      makeCode("- [ ]"),
      " copies; the source line gets ",
      makeCode("- [>]"),
      " (migrated) and both share a ",
      makeCode("#tid/"),
      " task id."
    );
    new import_obsidian2.Setting(containerEl).setName("Inbox file path").setDesc(inboxDesc).addText((t) => {
      t.setPlaceholder("{daily}/_inbox.md").setValue(this.plugin.settings.inboxPath).onChange(async (v) => {
        this.plugin.settings.inboxPath = v.trim();
        await this.plugin.saveSettings();
      });
    });
    new import_obsidian2.Setting(containerEl).setName("Confirm before migrating").setDesc(
      "Show a preview modal listing the tasks to migrate before writing. Off skips straight to the write and shows a notice with the count."
    ).addToggle(
      (t) => t.setValue(this.plugin.settings.confirmCollectMigration).onChange(async (v) => {
        this.plugin.settings.confirmCollectMigration = v;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian2.Setting(containerEl).setName("Task created tag prefix").setDesc(
      "Stamps a creation date on tasks made through the new-task modal. Default `tcr` \u2192 `#tcr/2026-05-09`. Carried with migrated tasks so the inbox copy keeps the original date."
    ).addText(
      (t) => t.setValue(this.plugin.settings.prefixes.taskCreated).onChange(async (v) => {
        if (/^[a-zA-Z]+$/.test(v)) {
          this.plugin.settings.prefixes.taskCreated = v;
          await this.plugin.saveSettings();
        }
      })
    );
  }
  renderPomodoroSection(containerEl) {
    new import_obsidian2.Setting(containerEl).setName("Pomodoro").setHeading();
    new import_obsidian2.Setting(containerEl).setName("Actual time tag prefix").setDesc(
      "Prefix for actual-time tags written by the pomodoro timer (e.g. #ta/25m). Whole minutes only; subsequent sessions add to the existing tag."
    ).addText(
      (t) => t.setValue(this.plugin.settings.prefixes.actual).onChange(async (v) => {
        if (/^[a-zA-Z]+$/.test(v)) {
          this.plugin.settings.prefixes.actual = v;
          await this.plugin.saveSettings();
        }
      })
    );
    new import_obsidian2.Setting(containerEl).setName("Work duration (minutes)").setDesc("Length of one focus interval.").addText(
      (t) => t.setValue(this.plugin.settings.pomodoroWorkMin.toString()).onChange(async (v) => {
        this.plugin.settings.pomodoroWorkMin = clampInt(
          v,
          1,
          240,
          this.plugin.settings.pomodoroWorkMin
        );
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian2.Setting(containerEl).setName("Rest duration (minutes)").setDesc("Length of one break between focus intervals.").addText(
      (t) => t.setValue(this.plugin.settings.pomodoroBreakMin.toString()).onChange(async (v) => {
        this.plugin.settings.pomodoroBreakMin = clampInt(
          v,
          1,
          60,
          this.plugin.settings.pomodoroBreakMin
        );
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian2.Setting(containerEl).setName("Auto-start timer").setDesc("Begin counting down as soon as focus mode opens.").addToggle(
      (t) => t.setValue(this.plugin.settings.pomodoroAutoStart).onChange(async (v) => {
        this.plugin.settings.pomodoroAutoStart = v;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian2.Setting(containerEl).setName("Auto-cycle work and rest").setDesc(
      "When a phase ends, automatically roll into the next one. If off, the timer waits for a click."
    ).addToggle(
      (t) => t.setValue(this.plugin.settings.pomodoroAutoCycle).onChange(async (v) => {
        this.plugin.settings.pomodoroAutoCycle = v;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian2.Setting(containerEl).setName("Auto-return to main window").setDesc(
      "When the focus view exits inside a popped-out window, move the Today view back to the main Obsidian window."
    ).addToggle(
      (t) => t.setValue(this.plugin.settings.pomodoroAutoReturn).onChange(async (v) => {
        this.plugin.settings.pomodoroAutoReturn = v;
        await this.plugin.saveSettings();
      })
    );
  }
  renderTaskIdSection(containerEl) {
    new import_obsidian2.Setting(containerEl).setName("Task ID").setHeading();
    new import_obsidian2.Setting(containerEl).setName("Task ID tag prefix").setDesc(buildTaskIdDesc()).addText(
      (t) => t.setValue(this.plugin.settings.prefixes.taskId).onChange(async (v) => {
        if (/^[a-zA-Z]+$/.test(v)) {
          this.plugin.settings.prefixes.taskId = v;
          await this.plugin.saveSettings();
        }
      })
    );
    new import_obsidian2.Setting(containerEl).setName("Task ID length").setDesc(
      "Number of alphanumeric characters in IDs minted by Migrate incomplete. Shorter is easier to scan; longer reduces collision odds. Existing IDs in your notes are still recognized regardless of length."
    ).addText(
      (t) => t.setValue(this.plugin.settings.taskIdLength.toString()).onChange(async (v) => {
        this.plugin.settings.taskIdLength = clampInt(
          v,
          2,
          12,
          this.plugin.settings.taskIdLength
        );
        await this.plugin.saveSettings();
      })
    );
  }
  renderTemplatingSection(containerEl) {
    new import_obsidian2.Setting(containerEl).setName("Templating").setHeading();
    const placeholders = containerEl.createEl("p", {
      cls: "setting-item-description"
    });
    placeholders.append(
      "Template placeholders are expanded when a daily note is created from a template. ",
      makeCode("<@today>"),
      ", ",
      makeCode("<@yesterday>"),
      ", ",
      makeCode("<@tomorrow>"),
      ", and ",
      makeCode("<@Nd>"),
      " (e.g. ",
      makeCode("<@2d>"),
      ", ",
      makeCode("<@7d>"),
      ") are replaced with a link to the matching daily note. The bare form is anchored to wall-clock today; append ",
      makeCode("-rel"),
      " (e.g. ",
      makeCode("<@today-rel>"),
      ", ",
      makeCode("<@yesterday-rel>"),
      ") to anchor to the file's own date instead \u2014 so a backfilled or future note resolves these against its own filename rather than the day it was created. ",
      makeCode("<@quote>"),
      " is replaced with a random line from the configured quotes file (see below)."
    );
    new import_obsidian2.Setting(containerEl).setName("Daily note format fallback").setDesc(
      "Used if the core Daily Notes plugin isn't enabled. Tokens: YYYY MM DD."
    ).addText(
      (t) => t.setValue(this.plugin.settings.dailyNoteFormatFallback).onChange(async (v) => {
        if (v.trim()) {
          this.plugin.settings.dailyNoteFormatFallback = v.trim();
          await this.plugin.saveSettings();
        }
      })
    );
    new import_obsidian2.Setting(containerEl).setName("Daily notes folder").setDesc("Where should your daily notes be saved?").addText((t) => {
      t.setValue(this.plugin.settings.dailyNoteFolderFallback).onChange(
        async (v) => {
          this.plugin.settings.dailyNoteFolderFallback = v.trim();
          await this.plugin.saveSettings();
        }
      );
      new FolderSuggest(this.app, t.inputEl, async (folder) => {
        t.setValue(folder.path);
        this.plugin.settings.dailyNoteFolderFallback = folder.path;
        await this.plugin.saveSettings();
      });
    });
    new import_obsidian2.Setting(containerEl).setName("Daily note template").setDesc(
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
    const quotesDesc = document.createDocumentFragment();
    quotesDesc.append(
      "Vault path to a markdown file holding one quote per line \u2014 each carriage return starts a new quote. When the template contains ",
      makeCode("<@quote>"),
      ", a random line from this file is substituted at note-creation time. Default: ",
      makeCode("daily/_quotes.md"),
      ". Leave blank to disable the placeholder."
    );
    new import_obsidian2.Setting(containerEl).setName("Quotes file").setDesc(quotesDesc).addText((t) => {
      t.setPlaceholder("daily/_quotes.md").setValue(this.plugin.settings.quotesFile).onChange(async (v) => {
        this.plugin.settings.quotesFile = v.trim();
        await this.plugin.saveSettings();
      });
      new FileSuggest(this.app, t.inputEl, async (file) => {
        t.setValue(file.path);
        this.plugin.settings.quotesFile = file.path;
        await this.plugin.saveSettings();
      });
    });
    const createdTagDesc = document.createDocumentFragment();
    createdTagDesc.append(
      "When a daily note is created, inject a ",
      makeCode(`#${this.plugin.settings.prefixes.taskCreated}/YYYY-MM-DD`),
      " tag (today's wall-clock date) into the frontmatter ",
      makeCode("tags:"),
      " property. Creates the frontmatter block if the template doesn't already have one. Mirrors the ",
      makeCode(`#${this.plugin.settings.prefixes.taskCreated}/`),
      " stamp written onto new tasks."
    );
    new import_obsidian2.Setting(containerEl).setName("Stamp creation date in frontmatter tags").setDesc(createdTagDesc).addToggle(
      (t) => t.setValue(this.plugin.settings.addCreatedTagToFrontmatter).onChange(async (v) => {
        this.plugin.settings.addCreatedTagToFrontmatter = v;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian2.Setting(containerEl).setName("Per-weekday templates").setHeading();
    const weekdayDesc = containerEl.createEl("p", {
      cls: "setting-item-description"
    });
    weekdayDesc.append(
      "Optional vault paths to weekday-specific template files. The matching file's contents are substituted into the base ",
      makeCode("Daily note template"),
      " wherever the ",
      makeCode("<@dow_template>"),
      " placeholder appears, when a daily note is created on that day \u2014 handy for routines that vary by day (e.g. ",
      makeCode("monday.md"),
      " for the weekly review). Leave a row blank to collapse the placeholder to nothing on that day; if the base template lacks the placeholder, weekday templates are ignored."
    );
    const dayLabels = {
      sunday: "Sunday",
      monday: "Monday",
      tuesday: "Tuesday",
      wednesday: "Wednesday",
      thursday: "Thursday",
      friday: "Friday",
      saturday: "Saturday"
    };
    for (const day of WEEKDAY_NAMES) {
      new import_obsidian2.Setting(containerEl).setName(dayLabels[day]).setDesc(
        `Substituted into the base template at <@dow_template> on ${dayLabels[day]}.`
      ).addText((t) => {
        t.setPlaceholder(`Templates/${day}.md`).setValue(this.plugin.settings.dailyNoteTemplatesByDay[day]).onChange(async (v) => {
          this.plugin.settings.dailyNoteTemplatesByDay[day] = v.trim();
          await this.plugin.saveSettings();
        });
        new FileSuggest(this.app, t.inputEl, async (file) => {
          t.setValue(file.path);
          this.plugin.settings.dailyNoteTemplatesByDay[day] = file.path;
          await this.plugin.saveSettings();
        });
      });
    }
  }
  renderDaySection(containerEl) {
    new import_obsidian2.Setting(containerEl).setName("Day").setHeading();
    new import_obsidian2.Setting(containerEl).setName("Working hours start").setDesc("Start of the working window (0-23). Used for the 'Working hours open' stat.").addText(
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
    new import_obsidian2.Setting(containerEl).setName("Working hours end").setDesc("End of the working window (1-24, must exceed start).").addText(
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
    new import_obsidian2.Setting(containerEl).setName("Wake hour").setDesc("Start of the awake window (0-23). Used for the 'Day available' stat.").addText(
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
    new import_obsidian2.Setting(containerEl).setName("Sleep hour").setDesc("End of the awake window (1-24, must exceed wake hour).").addText(
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
  renderViewSection(containerEl) {
    new import_obsidian2.Setting(containerEl).setName("View").setHeading();
    new import_obsidian2.Setting(containerEl).setName("Pixels per minute").setDesc("Vertical scale of the timeline.").addText(
      (t) => t.setValue(this.plugin.settings.pxPerMin.toString()).onChange(async (v) => {
        const n = parseFloat(v);
        if (!isNaN(n) && n > 0 && n <= 10) {
          this.plugin.settings.pxPerMin = n;
          await this.plugin.saveSettings();
        }
      })
    );
    new import_obsidian2.Setting(containerEl).setName("Visible start hour").setDesc("First hour shown on the timeline (0-23).").addText(
      (t) => t.setValue(this.plugin.settings.visibleStartHour.toString()).onChange(async (v) => {
        const n = clampInt(v, 0, 23, this.plugin.settings.visibleStartHour);
        this.plugin.settings.visibleStartHour = n;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian2.Setting(containerEl).setName("Visible end hour").setDesc("Last hour shown (1-24, must exceed start).").addText(
      (t) => t.setValue(this.plugin.settings.visibleEndHour.toString()).onChange(async (v) => {
        const n = clampInt(v, 1, 24, this.plugin.settings.visibleEndHour);
        this.plugin.settings.visibleEndHour = n;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian2.Setting(containerEl).setName("Timeline height (desktop)").setDesc(
      "Max height of the scrollable timeline on desktop. Bare numbers are treated as px (e.g. 600). Units accepted: px, vh, vw, em, rem, %. Leave blank for the default (60vh)."
    ).addText(
      (t) => t.setPlaceholder("60vh").setValue(this.plugin.settings.timelineHeightDesktop).onChange(async (v) => {
        const trimmed = v.trim();
        if (trimmed === "" || parseTimelineHeight(trimmed) !== null) {
          this.plugin.settings.timelineHeightDesktop = trimmed;
          await this.plugin.saveSettings();
        }
      })
    );
    new import_obsidian2.Setting(containerEl).setName("Timeline height (mobile)").setDesc(
      "Max height of the scrollable timeline on mobile. Bare numbers are treated as px (e.g. 200). Units accepted: px, vh, vw, em, rem, %. Leave blank for the default (40vh)."
    ).addText(
      (t) => t.setPlaceholder("40vh").setValue(this.plugin.settings.timelineHeightMobile).onChange(async (v) => {
        const trimmed = v.trim();
        if (trimmed === "" || parseTimelineHeight(trimmed) !== null) {
          this.plugin.settings.timelineHeightMobile = trimmed;
          await this.plugin.saveSettings();
        }
      })
    );
  }
  renderAutocompleteSection(containerEl) {
    new import_obsidian2.Setting(containerEl).setName("Autocomplete").setHeading();
    const intro = containerEl.createEl("p", { cls: "setting-item-description" });
    intro.append(
      "Type a trigger string in a task title (in the new/edit modal) or in any markdown file to open a picker. Trigger strings can be anything that's unlikely to appear naturally \u2014 defaults are ",
      makeCode("##"),
      ", ",
      makeCode("#@"),
      ", ",
      makeCode("#$"),
      ", and ",
      makeCode("@"),
      ". Selecting a suggestion either fills the matching field in the modal, inserts the corresponding ",
      makeCode("#prefix/value"),
      " tag inline, or \u2014 for the date trigger \u2014 drops in a link to the matching daily note (",
      makeCode("@today"),
      ", ",
      makeCode("@tomorrow"),
      ", ",
      makeCode("@yesterday"),
      ", ",
      makeCode("@2d"),
      ", ",
      makeCode("@Nd"),
      "). These are mostly conveniences for mobile where typing is slow."
    );
    new import_obsidian2.Setting(containerEl).setName("Project trigger").setDesc(
      "Opens the project picker. Modal: fills the project field. Editor: inserts #p/<name>."
    ).addText(
      (t) => t.setPlaceholder("##").setValue(this.plugin.settings.autocomplete.projectTrigger).onChange(async (v) => {
        const trimmed = v.trim();
        if (!trimmed)
          return;
        this.plugin.settings.autocomplete.projectTrigger = trimmed;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian2.Setting(containerEl).setName("Time trigger").setDesc(
      "Opens the time picker. Suggestions are drawn from your visible-hours range at hour and half-hour marks. Inserts #t/<value>."
    ).addText(
      (t) => t.setPlaceholder("#@").setValue(this.plugin.settings.autocomplete.timeTrigger).onChange(async (v) => {
        const trimmed = v.trim();
        if (!trimmed)
          return;
        this.plugin.settings.autocomplete.timeTrigger = trimmed;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian2.Setting(containerEl).setName("Duration trigger").setDesc(
      "Opens the duration picker. Suggestions come from your quick-duration chips. Modal: updates the duration selection. Editor: inserts #d/<value>."
    ).addText(
      (t) => t.setPlaceholder("#$").setValue(this.plugin.settings.autocomplete.durationTrigger).onChange(async (v) => {
        const trimmed = v.trim();
        if (!trimmed)
          return;
        this.plugin.settings.autocomplete.durationTrigger = trimmed;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian2.Setting(containerEl).setName("Date trigger").setDesc(
      "Opens the relative-date picker. Suggestions: today, tomorrow, yesterday, and Nd (e.g. 2d, 7d). Selecting one inserts a link to the matching daily note."
    ).addText(
      (t) => t.setPlaceholder("@").setValue(this.plugin.settings.autocomplete.dateTrigger).onChange(async (v) => {
        const trimmed = v.trim();
        if (!trimmed)
          return;
        this.plugin.settings.autocomplete.dateTrigger = trimmed;
        await this.plugin.saveSettings();
      })
    );
    const dateFormatDesc = document.createDocumentFragment();
    dateFormatDesc.append(
      "Moment.js format for the visible label on date-trigger links. Default ",
      makeCode("ddd, MMM D, YYYY"),
      " renders as e.g. ",
      makeCode("Mon, Mar 5, 2026"),
      ". Leave blank to drop the alias and use just the file basename. The link target itself uses the daily-note format from the Templating section."
    );
    new import_obsidian2.Setting(containerEl).setName("Date link format").setDesc(dateFormatDesc).addText(
      (t) => t.setPlaceholder("ddd, MMM D, YYYY").setValue(this.plugin.settings.dateLinkFormat).onChange(async (v) => {
        this.plugin.settings.dateLinkFormat = v;
        await this.plugin.saveSettings();
      })
    );
    const peopleDesc = document.createDocumentFragment();
    peopleDesc.append(
      "Vault folder containing one markdown file per person. When set, the date trigger also matches basenames in this folder \u2014 e.g. ",
      makeCode("@bob"),
      " surfaces every Bob alongside ",
      makeCode("today"),
      " / ",
      makeCode("tomorrow"),
      ". Picking a person inserts a link to their note. Leave blank to disable."
    );
    new import_obsidian2.Setting(containerEl).setName("People folder").setDesc(peopleDesc).addText((t) => {
      t.setPlaceholder("people").setValue(this.plugin.settings.peopleFolder).onChange(async (v) => {
        this.plugin.settings.peopleFolder = v.trim();
        await this.plugin.saveSettings();
      });
      new FolderSuggest(this.app, t.inputEl, async (folder) => {
        t.setValue(folder.path);
        this.plugin.settings.peopleFolder = folder.path;
        await this.plugin.saveSettings();
      });
    });
  }
  renderProjectsSection(containerEl) {
    new import_obsidian2.Setting(containerEl).setName("Projects").setHeading();
    new import_obsidian2.Setting(containerEl).setName("Project tag prefix").setDesc(buildProjectPrefixDesc()).addText(
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
      " prefix; it's added automatically. Projects without a pinned color get distinct auto-assigned colors alphabetically. ",
      "Sub-projects inherit their parent project's color by default \u2014 to override a single sub-project, enter ",
      makeCode("project/subproject"),
      " (e.g. ",
      makeCode("silvermine/back-end"),
      " to recolor only ",
      makeCode(`#${prefix}/silvermine/back-end`),
      " while other ",
      makeCode(`#${prefix}/silvermine/\u2026`),
      " tasks keep the parent color)."
    );
    new import_obsidian2.Setting(containerEl).setName("Project colors").setDesc(desc).addButton(
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
      var _a;
      const row = list.createDiv({ cls: "dp-project-color-row" });
      const nameWrap = row.createDiv({ cls: "dp-project-color-name-wrap" });
      nameWrap.createSpan({
        cls: "dp-project-color-prefix",
        text: `#${prefix}/`
      });
      const nameInput = nameWrap.createEl("input", {
        cls: "dp-project-color-name",
        attr: { type: "text", placeholder: "project or project/subproject" }
      });
      nameInput.value = entry.project;
      const stripPrefix = (s) => s.replace(new RegExp(`^#?${prefix}/`, "i"), "");
      nameInput.addEventListener("input", () => {
        var _a2;
        const original = nameInput.value;
        const stripped = stripPrefix(original);
        if (stripped !== original) {
          const pos = Math.max(0, (_a2 = nameInput.selectionStart) != null ? _a2 : 0);
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
      const iconInput = row.createEl("input", {
        cls: "dp-project-color-icon",
        attr: {
          type: "text",
          placeholder: "lucide icon",
          spellcheck: "false"
        }
      });
      iconInput.value = (_a = entry.icon) != null ? _a : "";
      iconInput.addEventListener("change", async () => {
        const v = iconInput.value.trim();
        this.plugin.settings.projectColors[idx].icon = v || void 0;
        await this.plugin.saveSettings();
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
  renderContextTagsSection(containerEl) {
    new import_obsidian2.Setting(containerEl).setName("Context tags").setHeading();
    const desc = document.createDocumentFragment();
    desc.append(
      "Pin a color and a Lucide icon to a hashtag (e.g. ",
      makeCode("#meeting"),
      " or ",
      makeCode("#walking"),
      "). Tasks containing the hashtag are colored with the context color (overriding the project color) and show the icon on the block. Browse icon names at ",
      makeAnchor("https://lucide.dev/icons", "lucide.dev/icons"),
      "."
    );
    new import_obsidian2.Setting(containerEl).setName("Tags").setDesc(desc).addButton(
      (b) => b.setButtonText("Add context tag").setCta().onClick(async () => {
        this.plugin.settings.contextTags.push({
          tag: "",
          color: DEFAULT_PALETTE[this.plugin.settings.contextTags.length % DEFAULT_PALETTE.length],
          icon: ""
        });
        await this.plugin.saveSettings();
        this.display();
      })
    );
    const list = containerEl.createDiv({ cls: "dp-project-colors-list" });
    this.plugin.settings.contextTags.forEach((entry, idx) => {
      var _a;
      const row = list.createDiv({ cls: "dp-project-color-row" });
      const nameWrap = row.createDiv({ cls: "dp-project-color-name-wrap" });
      nameWrap.createSpan({ cls: "dp-project-color-prefix", text: "#" });
      const nameInput = nameWrap.createEl("input", {
        cls: "dp-project-color-name",
        attr: { type: "text", placeholder: "tag" }
      });
      nameInput.value = entry.tag;
      nameInput.addEventListener("input", () => {
        var _a2;
        if (nameInput.value.startsWith("#")) {
          const pos = Math.max(0, ((_a2 = nameInput.selectionStart) != null ? _a2 : 1) - 1);
          nameInput.value = nameInput.value.replace(/^#+/, "");
          nameInput.setSelectionRange(pos, pos);
        }
      });
      nameInput.addEventListener("change", async () => {
        const v = nameInput.value.trim().replace(/^#+/, "");
        nameInput.value = v;
        this.plugin.settings.contextTags[idx].tag = v;
        await this.plugin.saveSettings();
      });
      const colorInput = row.createEl("input", {
        cls: "dp-project-color-swatch",
        attr: { type: "color" }
      });
      colorInput.value = normalizeHex(entry.color);
      colorInput.addEventListener("change", async () => {
        if (isValidHex(colorInput.value)) {
          this.plugin.settings.contextTags[idx].color = colorInput.value;
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
          this.plugin.settings.contextTags[idx].color = v;
          colorInput.value = normalizeHex(v);
          await this.plugin.saveSettings();
        } else {
          hexInput.value = entry.color;
        }
      });
      const iconInput = row.createEl("input", {
        cls: "dp-project-color-icon",
        attr: {
          type: "text",
          placeholder: "lucide icon",
          spellcheck: "false"
        }
      });
      iconInput.value = (_a = entry.icon) != null ? _a : "";
      iconInput.addEventListener("change", async () => {
        this.plugin.settings.contextTags[idx].icon = iconInput.value.trim();
        await this.plugin.saveSettings();
      });
      const remove = row.createEl("button", {
        cls: "dp-project-color-remove",
        text: "Remove"
      });
      remove.addEventListener("click", async () => {
        this.plugin.settings.contextTags.splice(idx, 1);
        await this.plugin.saveSettings();
        this.display();
      });
    });
  }
  renderNotesSection(containerEl) {
    new import_obsidian2.Setting(containerEl).setName("Notes").setHeading();
    const desc = document.createDocumentFragment();
    desc.append(
      "A timed task containing this hashtag renders as a small dot in the timeline gutter instead of a calendar block \u2014 useful for events you need to be aware of (a delivery window, a kid's pickup) but don't want eating up planning space. Hover the dot to see the title and description. Enter the bare tag without the leading ",
      makeCode("#"),
      " \u2014 e.g. ",
      makeCode("note"),
      " matches ",
      makeCode("#note"),
      ", or ",
      makeCode("tc/note"),
      " matches ",
      makeCode("#tc/note"),
      ". Untimed notes still appear in the unscheduled list."
    );
    new import_obsidian2.Setting(containerEl).setName("Note tag").setDesc(desc).addText(
      (t) => t.setPlaceholder("note").setValue(this.plugin.settings.noteTag).onChange(async (v) => {
        this.plugin.settings.noteTag = v.trim().replace(/^#+/, "");
        await this.plugin.saveSettings();
      })
    );
    const intentionDesc = document.createDocumentFragment();
    intentionDesc.append(
      "Today will search for either the Obsidian property ",
      makeCode("intention"),
      " (configurable) or the hashtag ",
      makeCode("#intention"),
      " in the daily note, and show the result next to the daily-note path in the dashboard header. The frontmatter property takes priority when both are set. Enter the bare tag without the leading ",
      makeCode("#"),
      " \u2014 e.g. ",
      makeCode("intention"),
      " matches both the property ",
      makeCode("intention: be present"),
      " and the inline ",
      makeCode("#intention be present"),
      ". If multiple ",
      makeCode("#intention"),
      " lines exist, only the first is shown."
    );
    new import_obsidian2.Setting(containerEl).setName("Intention tag").setDesc(intentionDesc).addText(
      (t) => t.setPlaceholder("intention").setValue(this.plugin.settings.intentionTag).onChange(async (v) => {
        this.plugin.settings.intentionTag = v.trim().replace(/^#+/, "");
        await this.plugin.saveSettings();
      })
    );
    const quoteDesc = document.createDocumentFragment();
    quoteDesc.append(
      "Today will search for either the Obsidian property ",
      makeCode("quote"),
      " (configurable) or the hashtag ",
      makeCode("#quote"),
      " in the daily note, and show the result on its own row in the dashboard header beneath the intention. The frontmatter property takes priority when both are set. Pairs with the ",
      makeCode("<@quote>"),
      " template placeholder \u2014 e.g. ",
      makeCode("#quote <@quote>"),
      " seeds a random quote into the note at creation time and surfaces it in the header. Enter the bare tag without the leading ",
      makeCode("#"),
      ". If multiple ",
      makeCode("#quote"),
      " lines exist, only the first is shown."
    );
    new import_obsidian2.Setting(containerEl).setName("Quote tag").setDesc(quoteDesc).addText(
      (t) => t.setPlaceholder("quote").setValue(this.plugin.settings.quoteTag).onChange(async (v) => {
        this.plugin.settings.quoteTag = v.trim().replace(/^#+/, "");
        await this.plugin.saveSettings();
      })
    );
  }
  renderHabitsSection(containerEl) {
    new import_obsidian2.Setting(containerEl).setName("Habits").setHeading();
    const desc = document.createDocumentFragment();
    desc.append(
      "Habits live in a single source file as plain hashtag lines like ",
      makeCode("#h-day/call-mom Call mom"),
      " or ",
      makeCode("#h-week/review-monarch"),
      ". Append ",
      makeCode("/N"),
      " to set a per-period target \u2014 e.g. ",
      makeCode("#h-week/laundry/2"),
      " counts as done once two completed log entries appear in that week, and ",
      makeCode("#h-day/drink/4"),
      " expects four water-glasses each day. Daily notes log habits with the short shape ",
      makeCode("#h/<slug>"),
      " (or ",
      makeCode("#h/<slug>/N"),
      " to log multiples on one line \u2014 same grammar as exercise sets). Clicking a habit on the dashboard appends ",
      makeCode("- [x] <slug> #h/<slug>"),
      " to the displayed daily note; manually edit the line to add ",
      makeCode("/N"),
      " or to add another line for repeat completions."
    );
    new import_obsidian2.Setting(containerEl).setDesc(desc);
    new import_obsidian2.Setting(containerEl).setName("Habits file").setDesc("Vault path to the habits-source file. Default: daily/_habits.md.").addText((t) => {
      t.setPlaceholder("daily/_habits.md").setValue(this.plugin.settings.habitsFile).onChange(async (v) => {
        this.plugin.settings.habitsFile = v.trim();
        await this.plugin.saveSettings();
      });
      new FileSuggest(this.app, t.inputEl, async (file) => {
        t.setValue(file.path);
        this.plugin.settings.habitsFile = file.path;
        await this.plugin.saveSettings();
      });
    });
    new import_obsidian2.Setting(containerEl).setName("Habit tag prefix").setDesc(
      "Letter(s) used at the start of habit tags. Default `h` \u2192 goal tags `#h-day/call-mom`, log tags `#h/call-mom`."
    ).addText(
      (t) => t.setPlaceholder("h").setValue(this.plugin.settings.habitPrefix).onChange(async (v) => {
        if (/^[a-zA-Z]+$/.test(v)) {
          this.plugin.settings.habitPrefix = v;
          await this.plugin.saveSettings();
        }
      })
    );
    new import_obsidian2.Setting(containerEl).setName("Week start").setDesc(
      "First day of the habit week. Affects when weekly habits reset and how the weekly heatmap is bucketed."
    ).addDropdown(
      (d) => d.addOption("0", "Sunday").addOption("1", "Monday").addOption("2", "Tuesday").addOption("3", "Wednesday").addOption("4", "Thursday").addOption("5", "Friday").addOption("6", "Saturday").setValue(this.plugin.settings.habitWeekStart.toString()).onChange(async (v) => {
        const n = parseInt(v, 10);
        if (Number.isFinite(n) && n >= 0 && n <= 6) {
          this.plugin.settings.habitWeekStart = n;
          await this.plugin.saveSettings();
        }
      })
    );
    new import_obsidian2.Setting(containerEl).setName("Hide completed habits").setDesc(
      "When on, every completed habit disappears from the dashboard. When off (default), a weekly/monthly habit appears with strikethrough only on the day it was actually checked \u2014 other days in the same window stay clean."
    ).addToggle(
      (t) => t.setValue(this.plugin.settings.habitsHideCompleted).onChange(async (v) => {
        this.plugin.settings.habitsHideCompleted = v;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian2.Setting(containerEl).setName("Stats window").setDesc(
      "Number of cells in each heatmap row in the stats pane (last N days / weeks / months). Range 5\u201330."
    ).addText(
      (t) => t.setValue(this.plugin.settings.habitsStatsWindow.toString()).onChange(async (v) => {
        const n = clampInt(
          v,
          5,
          30,
          this.plugin.settings.habitsStatsWindow
        );
        this.plugin.settings.habitsStatsWindow = n;
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
function buildExerciseDesc() {
  const f = document.createDocumentFragment();
  f.append(
    "Logs a workout set inline in your daily note. Default prefix ",
    makeCode("x"),
    ". Format: ",
    makeCode("#x/<name>/<reps>"),
    " for bodyweight, or ",
    makeCode("#x/<name>/<reps>/<weight>"),
    " when weighted. Examples: ",
    makeCode("#x/pushups/25"),
    " (25 pushups), ",
    makeCode("#x/bench/10/135"),
    " (10 reps at 135 lbs). The plugin sums reps per exercise (and per weight bucket when weighted) and renders a one-line summary at the top of the section."
  );
  return f;
}
function buildTaskIdDesc() {
  const f = document.createDocumentFragment();
  f.append(
    "Cross-references a task across days. Default prefix ",
    makeCode("tid"),
    ". When you migrate a task's incomplete sub-tasks to the next day from the edit modal (",
    makeCode("Move to tomorrow \u2192 Migrate incomplete"),
    "), the plugin marks the original parent as completed, generates a short alphanumeric ID (length configurable below), and stamps ",
    makeCode("#tid/<id>"),
    " onto both the source-day parent and the new-day copy so you can search either side and find the partner. Example: ",
    makeCode("#tid/a3xK9p"),
    ". The migrate-incomplete flow lets you check off the work you finished today while carrying the task title and unfinished sub-tasks (without the completed ones) into tomorrow's note \u2014 useful for showing partial progress while continuing the task. If all sub-tasks are already done, the original is still marked complete and a fresh empty parent is queued for tomorrow, so you can keep working on it."
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
    " \u2014 and the timeline block plus the row in the Project totals table will share the same color. Add an optional sub-project segment with ",
    makeCode("#p/<name>/<sub>"),
    " (e.g. ",
    makeCode("#p/silvermine/back-end"),
    "); sub-projects are shown next to the project label and broken out under the project's row in the totals table. Names can use letters, digits, dashes, and underscores."
  );
  return f;
}
function makeAnchor(href, text) {
  const a = document.createElement("a");
  a.href = href;
  a.textContent = text;
  a.target = "_blank";
  a.rel = "noopener";
  return a;
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
var FileSuggest = class extends import_obsidian2.AbstractInputSuggest {
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
var FolderSuggest = class extends import_obsidian2.AbstractInputSuggest {
  constructor(app, inputEl, onSelectFolder) {
    super(app, inputEl);
    this.inputEl = inputEl;
    this.onSelectFolder = onSelectFolder;
  }
  getSuggestions(query) {
    const q = query.toLowerCase();
    const folders = [];
    const walk = (folder) => {
      if (folder.path !== "/")
        folders.push(folder);
      for (const child of folder.children) {
        if (child instanceof import_obsidian2.TFolder)
          walk(child);
      }
    };
    walk(this.app.vault.getRoot());
    const matches = q ? folders.filter((f) => f.path.toLowerCase().includes(q)) : folders;
    return matches.sort((a, b) => a.path.localeCompare(b.path)).slice(0, 50);
  }
  renderSuggestion(folder, el) {
    var _a;
    el.addClass("dp-file-suggestion");
    el.createDiv({ cls: "dp-file-suggestion-name", text: folder.name });
    const parent = (_a = folder.parent) == null ? void 0 : _a.path;
    if (parent && parent !== "/") {
      el.createDiv({ cls: "dp-file-suggestion-path", text: parent });
    }
  }
  selectSuggestion(folder) {
    this.inputEl.value = folder.path;
    this.inputEl.dispatchEvent(new Event("input"));
    void this.onSelectFolder(folder);
    this.close();
  }
};

// src/view.ts
init_parser();

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
  const intervals = [];
  let unscheduledMin = 0;
  for (const t of tasks) {
    if (t.startMin !== null) {
      intervals.push([t.startMin, t.startMin + t.durationMin]);
    } else {
      unscheduledMin += t.durationMin;
    }
  }
  intervals.sort((a, b) => a[0] - b[0]);
  let scheduledMin = 0;
  let curStart = -1;
  let curEnd = -1;
  for (const [s, e] of intervals) {
    if (curEnd === -1 || s > curEnd) {
      if (curEnd !== -1)
        scheduledMin += curEnd - curStart;
      curStart = s;
      curEnd = e;
    } else if (e > curEnd) {
      curEnd = e;
    }
  }
  if (curEnd !== -1)
    scheduledMin += curEnd - curStart;
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
function layoutTimeline(scheduled, rangeStartMin, pxPerMin, maxColumns) {
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
      if (!placed) {
        if (maxColumns && columns.length >= maxColumns) {
          let bestIdx = 0;
          let bestEnd = columns[0][columns[0].length - 1].startMin + columns[0][columns[0].length - 1].durationMin;
          for (let i = 1; i < columns.length; i++) {
            const last = columns[i][columns[i].length - 1];
            const end = last.startMin + last.durationMin;
            if (end < bestEnd) {
              bestEnd = end;
              bestIdx = i;
            }
          }
          columns[bestIdx].push(t);
        } else {
          columns.push([t]);
        }
      }
    }
    const colCount = columns.length;
    const slotPct = 100 / colCount;
    columns.forEach((col, idx) => {
      for (const t of col) {
        const leftExt = leftExtensionCols(t, idx, columns);
        const rightExt = rightExtensionCols(t, idx, columns);
        const span = leftExt + 1 + rightExt;
        blocks.push({
          task: t,
          topPx: (t.startMin - rangeStartMin) * pxPerMin,
          heightPx: t.durationMin * pxPerMin,
          leftPct: (idx - leftExt) * slotPct,
          widthPct: span * slotPct
        });
      }
    });
  }
  return blocks;
}
function rightExtensionCols(t, idx, columns) {
  const tStart = t.startMin;
  const tEnd = tStart + t.durationMin;
  let ext = 0;
  for (let j = idx + 1; j < columns.length; j++) {
    if (columnCollides(columns[j], tStart, tEnd))
      break;
    ext++;
  }
  return ext;
}
function leftExtensionCols(t, idx, columns) {
  const tStart = t.startMin;
  const tEnd = tStart + t.durationMin;
  let ext = 0;
  for (let j = idx - 1; j >= 0; j--) {
    if (columnCollides(columns[j], tStart, tEnd))
      break;
    ext++;
  }
  return ext;
}
function columnCollides(col, tStart, tEnd) {
  return col.some((o) => {
    const oStart = o.startMin;
    const oEnd = oStart + o.durationMin;
    return oStart < tEnd && tStart < oEnd;
  });
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
var import_obsidian3 = require("obsidian");
init_parser();
async function resolveDailyNote(app, date, fallback) {
  var _a;
  const opts = readDailyNotesOptions(app);
  const format = (opts.format || fallback.format).trim();
  const folder = ((_a = opts.folder) != null ? _a : fallback.folder).trim();
  const fileName = formatDate(date, format) + ".md";
  const path = (0, import_obsidian3.normalizePath)(folder ? `${folder}/${fileName}` : fileName);
  const file = app.vault.getAbstractFileByPath(path);
  return {
    path,
    file: file instanceof import_obsidian3.TFile ? file : null
  };
}
async function ensureDailyNote(app, date, fallback, notify = true) {
  var _a;
  const resolved = await resolveDailyNote(app, date, fallback);
  if (resolved.file)
    return resolved.file;
  const folder = resolved.path.includes("/") ? resolved.path.slice(0, resolved.path.lastIndexOf("/")) : "";
  if (folder) {
    const existing = app.vault.getAbstractFileByPath(folder);
    if (!existing)
      await app.vault.createFolder(folder);
  }
  const basename = resolved.path.split("/").pop().replace(/\.md$/i, "");
  const rawTemplate = await readCombinedTemplate(app, fallback, date);
  const quote = await pickRandomQuote(app, fallback.quotesFile);
  const expanded = expandDateTemplate(
    rawTemplate,
    basename,
    app,
    fallback.format,
    fallback.folder,
    (_a = fallback.dateLinkFormat) != null ? _a : "",
    quote
  );
  const withDurations = fallback.prefixes ? applyComputedParentDurations(expanded, fallback.prefixes) : expanded;
  const initialContent = fallback.addCreatedTag && fallback.prefixes ? addFrontmatterTag(
    withDurations,
    `${fallback.prefixes.taskCreated}/${todayDateStr()}`
  ) : withDurations;
  const file = await app.vault.create(resolved.path, initialContent);
  if (notify)
    new import_obsidian3.Notice(`Created ${resolved.path}`);
  return file;
}
async function applyDailyNoteTemplateIfEmpty(app, file, fallback) {
  var _a, _b, _c, _d;
  if (file.extension !== "md")
    return;
  const opts = readDailyNotesOptions(app);
  const folder = stripSlashes(((_a = opts.folder) != null ? _a : fallback.folder).trim());
  const format = (opts.format || fallback.format).trim() || "YYYY-MM-DD";
  const fileFolder = stripSlashes((_c = (_b = file.parent) == null ? void 0 : _b.path) != null ? _c : "");
  if (fileFolder !== folder)
    return;
  if (!parseFilenameDate(file.basename, format))
    return;
  const existing = await app.vault.read(file);
  if (existing.length > 0)
    return;
  const parsed = parseFilenameDate(file.basename, format);
  const refDate = parsed != null ? parsed : new Date();
  const template = await readCombinedTemplate(app, fallback, refDate);
  if (!template)
    return;
  const quote = await pickRandomQuote(app, fallback.quotesFile);
  const expanded = expandDateTemplate(
    template,
    file.basename,
    app,
    format,
    folder,
    (_d = fallback.dateLinkFormat) != null ? _d : "",
    quote
  );
  const withDurations = fallback.prefixes ? applyComputedParentDurations(expanded, fallback.prefixes) : expanded;
  const finalContent = fallback.addCreatedTag && fallback.prefixes ? addFrontmatterTag(
    withDurations,
    `${fallback.prefixes.taskCreated}/${todayDateStr()}`
  ) : withDurations;
  await app.vault.modify(file, finalContent);
}
function stripSlashes(s) {
  return s.replace(/^\/+|\/+$/g, "");
}
async function readTemplateContent(app, templatePath) {
  const raw = (templatePath != null ? templatePath : "").trim();
  if (!raw)
    return "";
  const withExt = raw.toLowerCase().endsWith(".md") ? raw : `${raw}.md`;
  const path = (0, import_obsidian3.normalizePath)(withExt);
  const file = app.vault.getAbstractFileByPath(path);
  if (!(file instanceof import_obsidian3.TFile)) {
    new import_obsidian3.Notice(`Today: template not found at ${path}`);
    return "";
  }
  return app.vault.read(file);
}
async function readCombinedTemplate(app, fallback, date) {
  const base = await readTemplateContent(app, fallback.template);
  if (!base.includes("<@dow_template>"))
    return base;
  const byDay = fallback.templatesByDay;
  const dayKey = WEEKDAY_NAMES[date.getDay()];
  const dayPath = byDay == null ? void 0 : byDay[dayKey];
  const dayContent = dayPath ? await readTemplateContent(app, dayPath) : "";
  return base.replace(/<@dow_template>/g, dayContent);
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
function resolveDateKeyword(kw, refDate) {
  const k = kw.trim().toLowerCase();
  if (k === "today")
    return refDate;
  if (k === "tomorrow")
    return addDays(refDate, 1);
  if (k === "yesterday")
    return addDays(refDate, -1);
  const m = k.match(/^(\d+)d$/);
  if (m) {
    const n = parseInt(m[1], 10);
    if (Number.isFinite(n) && n >= 0 && n <= 365)
      return addDays(refDate, n);
  }
  return null;
}
function expandDateTemplate(content, fileBasename, app, fileFormat, folder, displayFormat, quote = "") {
  if (!content)
    return content;
  return content.replace(
    /<@([A-Za-z0-9]+)(-rel)?>/g,
    (match, kw, rel) => {
      if (kw === "quote" && !rel)
        return quote;
      let ref;
      if (rel) {
        const parsed = parseFilenameDate(fileBasename, fileFormat);
        if (!parsed)
          return match;
        ref = parsed;
      } else {
        ref = new Date();
      }
      const date = resolveDateKeyword(kw, ref);
      if (!date)
        return match;
      return buildDateLinkInsert(app, date, fileFormat, folder, displayFormat);
    }
  );
}
async function pickRandomQuote(app, quotesPath) {
  const raw = (quotesPath != null ? quotesPath : "").trim();
  if (!raw)
    return "";
  const withExt = raw.toLowerCase().endsWith(".md") ? raw : `${raw}.md`;
  const path = (0, import_obsidian3.normalizePath)(withExt);
  const file = app.vault.getAbstractFileByPath(path);
  if (!(file instanceof import_obsidian3.TFile))
    return "";
  const content = await app.vault.read(file);
  const lines = content.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);
  if (lines.length === 0)
    return "";
  return lines[Math.floor(Math.random() * lines.length)];
}
function parseFilenameDate(basename, fileFormat) {
  const fmt = (fileFormat || "YYYY-MM-DD").trim();
  const m = (0, import_obsidian3.moment)(basename, fmt, true);
  return m.isValid() ? m.toDate() : null;
}
function getDailyNoteOptions(app, fallback) {
  var _a;
  const opts = readDailyNotesOptions(app);
  const format = (opts.format || fallback.format || "YYYY-MM-DD").trim();
  const folder = stripSlashes(((_a = opts.folder) != null ? _a : fallback.folder).trim());
  return { folder, format };
}
function parseDailyNoteDateStr(basename, format) {
  const d = parseFilenameDate(basename, format);
  return d ? toIsoDateStr(d) : null;
}
function listDailyNotes(app, options) {
  var _a, _b;
  const out = [];
  for (const file of app.vault.getMarkdownFiles()) {
    const fileFolder = stripSlashes((_b = (_a = file.parent) == null ? void 0 : _a.path) != null ? _b : "");
    if (fileFolder !== options.folder)
      continue;
    const date = parseDailyNoteDateStr(file.basename, options.format);
    if (date)
      out.push({ file, date });
  }
  out.sort((a, b) => a.date.localeCompare(b.date));
  return out;
}
function todayDateStr() {
  return toIsoDateStr(new Date());
}
function addFrontmatterTag(content, tag) {
  const fmRe = /^---\r?\n([\s\S]*?)\r?\n---(\r?\n|$)/;
  const match = content.match(fmRe);
  if (!match) {
    return `---
tags:
  - ${tag}
---

${content}`;
  }
  const fmBody = match[1];
  const fmTerminator = match[2];
  const after = content.slice(match[0].length);
  const lines = fmBody.split(/\r?\n/);
  let tagsIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/^tags\s*:/.test(lines[i])) {
      tagsIdx = i;
      break;
    }
  }
  if (tagsIdx < 0) {
    const insert = ["tags:", `  - ${tag}`];
    const newBody2 = [...insert, ...lines].join("\n");
    return `---
${newBody2}
---${fmTerminator}${after}`;
  }
  const tagsLine = lines[tagsIdx];
  const valueMatch = tagsLine.match(/^tags\s*:\s*(.*)$/);
  const value = valueMatch ? valueMatch[1].trim() : "";
  if (value === "" || value === "[]") {
    let lastBulletIdx = tagsIdx;
    const bullets = [];
    for (let i = tagsIdx + 1; i < lines.length; i++) {
      const m = lines[i].match(/^\s+-\s+(.*)$/);
      if (m) {
        bullets.push(m[1].trim().replace(/^["']|["']$/g, ""));
        lastBulletIdx = i;
      } else if (lines[i].trim() === "") {
        continue;
      } else {
        break;
      }
    }
    if (bullets.includes(tag))
      return content;
    if (value === "[]")
      lines[tagsIdx] = "tags:";
    lines.splice(lastBulletIdx + 1, 0, `  - ${tag}`);
  } else if (value.startsWith("[") && value.endsWith("]")) {
    const inner = value.slice(1, -1).trim();
    const items = inner === "" ? [] : inner.split(",").map((s) => s.trim().replace(/^["']|["']$/g, "")).filter((s) => s.length > 0);
    if (items.includes(tag))
      return content;
    items.push(tag);
    lines[tagsIdx] = `tags: [${items.join(", ")}]`;
  } else {
    const items = value.split(",").map((s) => s.trim().replace(/^["']|["']$/g, "")).filter((s) => s.length > 0);
    if (items.includes(tag))
      return content;
    items.push(tag);
    lines[tagsIdx] = `tags: [${items.join(", ")}]`;
  }
  const newBody = lines.join("\n");
  return `---
${newBody}
---${fmTerminator}${after}`;
}
function toIsoDateStr(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
var MONTH_NAMES = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december"
];
function buildMonthSuggestions(q, today) {
  const m = q.match(/^([a-z]+)(?:\s+(\d{1,2}))?$/);
  if (!m)
    return [];
  const monthQ = m[1];
  const dayStr = m[2];
  const out = [];
  const ref = startOfDay(today).getTime();
  for (const name of MONTH_NAMES) {
    if (!name.startsWith(monthQ))
      continue;
    const monthIdx = MONTH_NAMES.indexOf(name);
    const day = dayStr ? parseInt(dayStr, 10) : 1;
    let future = null;
    let past = null;
    for (let yr = today.getFullYear() - 4; yr <= today.getFullYear() + 4; yr++) {
      const daysInMonth = new Date(yr, monthIdx + 1, 0).getDate();
      if (day < 1 || day > daysInMonth)
        continue;
      const candidate = new Date(yr, monthIdx, day);
      const t = startOfDay(candidate).getTime();
      if (t >= ref) {
        if (!future)
          future = candidate;
      } else {
        past = candidate;
      }
    }
    const slug = name.slice(0, 3);
    if (future) {
      out.push({
        keyword: `${slug} ${day} ${future.getFullYear()}`,
        date: future
      });
    }
    if (past) {
      out.push({
        keyword: `${slug} ${day} ${past.getFullYear()}`,
        date: past
      });
    }
  }
  return out;
}
function buildDateSuggestions(query, today = new Date()) {
  const q = query.trim().toLowerCase();
  const out = [];
  const named = [
    { kw: "today", offset: 0 },
    { kw: "tomorrow", offset: 1 },
    { kw: "yesterday", offset: -1 }
  ];
  for (const n of named) {
    if (!q || n.kw.startsWith(q)) {
      out.push({ keyword: n.kw, date: addDays(today, n.offset) });
    }
  }
  out.push(...buildMonthSuggestions(q, today));
  const numeric = q.match(/^(\d+)d?$/);
  if (numeric) {
    const n = parseInt(numeric[1], 10);
    if (Number.isFinite(n) && n >= 0 && n <= 365) {
      out.push({ keyword: `${n}d`, date: addDays(today, n) });
    }
  } else if (!q) {
    for (const n of [2, 3, 7]) {
      out.push({ keyword: `${n}d`, date: addDays(today, n) });
    }
  }
  return out;
}
function buildDateLinkInsert(app, date, fileFormat, folder, displayFormat) {
  var _a, _b;
  const m = (0, import_obsidian3.moment)(date);
  const fileBasename = m.format(fileFormat || "YYYY-MM-DD");
  const cleanFolder = (folder || "").replace(/^\/+|\/+$/g, "");
  const linkPath = cleanFolder ? `${cleanFolder}/${fileBasename}` : fileBasename;
  const display = (displayFormat || "").trim() ? m.format(displayFormat.trim()) : "";
  const useMd = ((_b = (_a = app.vault).getConfig) == null ? void 0 : _b.call(_a, "useMarkdownLinks")) === true;
  if (useMd) {
    const url = encodeURI(`${linkPath}.md`);
    const label = display || fileBasename;
    return `[${label}](${url})`;
  }
  if (display && display !== fileBasename) {
    return `[[${linkPath}|${display}]]`;
  }
  return `[[${linkPath}]]`;
}

// src/people.ts
function buildPeopleSuggestions(app, folder, query, limit = 12) {
  const cleanFolder = (folder || "").replace(/^\/+|\/+$/g, "");
  if (!cleanFolder)
    return [];
  const folderLc = cleanFolder.toLowerCase();
  const files = app.vault.getMarkdownFiles().filter((f) => {
    var _a;
    const dir = (((_a = f.parent) == null ? void 0 : _a.path) || "").toLowerCase();
    return dir === folderLc || dir.startsWith(folderLc + "/");
  });
  const q = query.trim().toLowerCase();
  const ranked = q ? [
    ...files.filter((f) => f.basename.toLowerCase().startsWith(q)),
    ...files.filter(
      (f) => !f.basename.toLowerCase().startsWith(q) && f.basename.toLowerCase().includes(q)
    )
  ] : files.slice().sort((a, b) => a.basename.localeCompare(b.basename));
  return ranked.slice(0, limit).map((f) => {
    var _a;
    return {
      basename: f.basename,
      path: f.path,
      folder: ((_a = f.parent) == null ? void 0 : _a.path) || ""
    };
  });
}
function buildPersonLinkInsert(app, path) {
  var _a, _b;
  const basename = (path.split("/").pop() || path).replace(/\.md$/i, "");
  const useMd = ((_b = (_a = app.vault).getConfig) == null ? void 0 : _b.call(_a, "useMarkdownLinks")) === true;
  if (useMd) {
    const url = encodeURI(path);
    return `[${basename}](${url})`;
  }
  return `[[${basename}]]`;
}

// src/taskMove.ts
var import_obsidian4 = require("obsidian");
init_parser();
async function moveTaskBetweenDailyNotes(app, sourceFile, task, targetDate, fallback, options = {}) {
  var _a;
  const notify = options.notify !== false;
  const targetFile = (_a = options.targetFile) != null ? _a : await ensureDailyNote(app, targetDate, fallback);
  if (targetFile.path === sourceFile.path) {
    if (notify)
      new import_obsidian4.Notice("Source and target are the same file.");
    return false;
  }
  const lineNumbers = [
    task.lineNumber,
    ...task.subtasks.map((s) => s.lineNumber)
  ].sort((a, b) => a - b);
  let movedLines = [];
  await app.vault.process(sourceFile, (content) => {
    const lines = content.split("\n");
    movedLines = lineNumbers.filter((n) => n < lines.length).map((n) => lines[n]);
    for (let i = lineNumbers.length - 1; i >= 0; i--) {
      const n = lineNumbers[i];
      if (n < lines.length)
        lines.splice(n, 1);
    }
    return lines.join("\n");
  });
  if (movedLines.length === 0) {
    if (notify)
      new import_obsidian4.Notice("Today: nothing to move.");
    return false;
  }
  await app.vault.process(targetFile, (content) => {
    const lines = content.split("\n");
    const lastIdx = findLastTaskLine(content);
    const insertAt = lastIdx === -1 ? lines.length : lastIdx + 1;
    lines.splice(insertAt, 0, ...movedLines);
    return lines.join("\n");
  });
  if (notify)
    new import_obsidian4.Notice(`Moved to ${targetFile.path}`);
  return true;
}

// src/habits.ts
var SLUG_PATTERN = "[\\w-]+";
var NUM_PATTERN = "\\d+(?:[._]\\d+)?";
function escapeRegex2(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function parseNum(s) {
  return parseFloat(s.replace("_", "."));
}
function buildHabitLogTagRegex(prefix, slug) {
  const slugPart = slug ? escapeRegex2(slug) : SLUG_PATTERN;
  return new RegExp(
    `#${escapeRegex2(prefix)}(?:-(?:day|week|month))?\\/${slugPart}(?:\\/(${NUM_PATTERN}))?(?![\\w\\-/])`,
    "g"
  );
}
function parseExerciseGoals(content, exercisePrefix) {
  var _a;
  const re = new RegExp(
    `#${escapeRegex2(exercisePrefix)}-(day|week|month)\\/([\\w-]+)\\/(\\d+(?:[._]\\d+)?)(?![\\w-])(.*)$`
  );
  const goals = [];
  const seen = /* @__PURE__ */ new Set();
  for (const line of content.split("\n")) {
    const m = re.exec(line);
    if (!m)
      continue;
    const period = m[1];
    const name = m[2];
    const target = parseFloat(m[3].replace("_", "."));
    if (!Number.isFinite(target) || target <= 0)
      continue;
    const label = ((_a = m[4]) != null ? _a : "").trim();
    const key = `${period}/${name}`;
    if (seen.has(key))
      continue;
    seen.add(key);
    goals.push({ period, name, target, label });
  }
  return goals;
}
function parseHabitsFile(content, prefix) {
  var _a;
  const re = new RegExp(
    `#${escapeRegex2(prefix)}-(day|week|month)\\/(${SLUG_PATTERN})(?:\\/(${NUM_PATTERN}))?(?![\\w\\-/])(.*)$`
  );
  const habits = [];
  const seen = /* @__PURE__ */ new Set();
  for (const line of content.split("\n")) {
    const m = re.exec(line);
    if (!m)
      continue;
    const period = m[1];
    const slug = m[2];
    const targetRaw = m[3];
    const label = ((_a = m[4]) != null ? _a : "").trim();
    const parsed = targetRaw ? parseNum(targetRaw) : 1;
    const target = Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
    const key = `${period}/${slug}`;
    if (seen.has(key))
      continue;
    seen.add(key);
    habits.push({ period, slug, target, label });
  }
  return habits;
}
function appendHabitLine(content, prefix, slug) {
  const line = `- [x] ${slug} #${prefix}/${slug}`;
  if (content.length === 0)
    return line + "\n";
  if (content.endsWith("\n"))
    return content + line + "\n";
  return content + "\n" + line + "\n";
}
var HABIT_TASK_LINE_RE = /^(\s*)- \[([ xX])\]\s+(.*)$/;
function findHabitTaskLines(content, prefix, slug) {
  const out = [];
  const lines = content.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const tm = HABIT_TASK_LINE_RE.exec(lines[i]);
    if (!tm)
      continue;
    const tagRe = buildHabitLogTagRegex(prefix, slug);
    let count = 0;
    let any = false;
    for (const m of lines[i].matchAll(tagRe)) {
      any = true;
      count += m[1] !== void 0 ? parseNum(m[1]) : 1;
    }
    if (!any)
      continue;
    out.push({
      lineNumber: i,
      checked: tm[2] === "x" || tm[2] === "X",
      count
    });
  }
  return out;
}
function toggleHabitOnContent(content, prefix, slug) {
  const tagRe = buildHabitLogTagRegex(prefix, slug);
  const lines = content.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const tm = HABIT_TASK_LINE_RE.exec(lines[i]);
    if (!tm)
      continue;
    tagRe.lastIndex = 0;
    if (!tagRe.test(lines[i]))
      continue;
    const checked = tm[2] === "x" || tm[2] === "X";
    lines[i] = `${tm[1]}- [${checked ? " " : "x"}] ${tm[3]}`;
    return lines.join("\n");
  }
  return appendHabitLine(content, prefix, slug);
}
function weekRange(date, weekStart) {
  const d = startOfDay(date);
  const dow = d.getDay();
  const offset = (dow - weekStart + 7) % 7;
  const start = addDays(d, -offset);
  const end = addDays(start, 7);
  return { start, end };
}
function monthRange(date) {
  const start = startOfMonth(date);
  const end = addMonths(start, 1);
  return { start, end };
}
function enumerateDailyNoteDatesInRange(start, end) {
  const out = [];
  let d = startOfDay(start);
  const stop = end.getTime();
  while (d.getTime() < stop) {
    out.push(d);
    d = addDays(d, 1);
  }
  return out;
}
var HabitsScanner = class {
  constructor(app) {
    this.app = app;
    this.cache = /* @__PURE__ */ new Map();
  }
  invalidate(path) {
    this.cache.delete(path);
  }
  clear() {
    this.cache.clear();
  }
  async getContent(file) {
    const cached = this.cache.get(file.path);
    if (cached && cached.mtime === file.stat.mtime)
      return cached.content;
    const content = await this.app.vault.read(file);
    this.cache.set(file.path, { mtime: file.stat.mtime, content });
    return content;
  }
  async readDateContent(date, fallback) {
    const resolved = await resolveDailyNote(this.app, date, fallback);
    if (!resolved.file)
      return "";
    return this.getContent(resolved.file);
  }
};

// src/view.ts
var VIEW_TYPE_TODAY = "today-view";
var TRANSPARENT_PIXEL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkAAIAAAoAAv/lxKUAAAAASUVORK5CYII=";
function nowMinutes() {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
}
function quickDurations(mins) {
  return mins.map((m) => ({ label: formatCompactDuration(m), min: m }));
}
var TodayView = class extends import_obsidian5.ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.rerenderTimer = null;
    this.dragPayload = null;
    this.dropIndicator = null;
    this.selectedDate = startOfDay(new Date());
    this.calendarMonth = startOfMonth(new Date());
    this.calendarOpen = false;
    this.summariesCollapsed = false;
    this.habitsCollapsed = false;
    this.hintsVisible = false;
    this.unscheduledCollapsed = import_obsidian5.Platform.isMobile;
    this.overrideFilePath = null;
    this.hasRendered = false;
    // Path of the workspace's active file at the last render. The
    // active-leaf-change listener uses this to skip the rerender when nothing
    // we display has changed — otherwise every click into the pane (which
    // activates the leaf) would wipe the DOM and feel like the click was lost.
    this.lastActiveFilePath = null;
    this.pomodoroState = null;
    this.pomodoroTickHandle = null;
    this.pomodoroHidden = false;
    this.pomodoroSubtaskHistory = [];
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
        if (file instanceof import_obsidian5.TFile)
          this.scheduleRender();
      })
    );
    this.registerEvent(
      this.app.workspace.on("active-leaf-change", () => {
        var _a, _b;
        const path = (_b = (_a = this.app.workspace.getActiveFile()) == null ? void 0 : _a.path) != null ? _b : null;
        if (path !== this.lastActiveFilePath)
          this.scheduleRender();
      })
    );
    this.registerEvent(
      this.app.vault.on("modify", () => this.scheduleRender())
    );
    this.registerDomEvent(
      this.containerEl,
      "keydown",
      (ev) => this.handleKeydown(ev)
    );
    this.registerInterval(
      window.setInterval(() => this.refreshNowLines(), 6e4)
    );
    await this.render();
  }
  handleKeydown(ev) {
    if (ev.metaKey || ev.ctrlKey || ev.altKey)
      return;
    const t = ev.target;
    if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable))
      return;
    const inPomo = this.pomodoroState !== null && !this.pomodoroHidden;
    if (ev.key === "?") {
      ev.preventDefault();
      this.hintsVisible = !this.hintsVisible;
      this.scheduleRender();
      return;
    }
    if (ev.key === "Escape" && this.hintsVisible) {
      ev.preventDefault();
      this.hintsVisible = false;
      this.scheduleRender();
      return;
    }
    if (ev.key === "p") {
      ev.preventDefault();
      if (this.isPopout())
        void this.returnLeafToMain();
      else
        void this.popOutLeaf();
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
    if (ev.key === "h") {
      ev.preventDefault();
      this.habitsCollapsed = !this.habitsCollapsed;
      this.scheduleRender();
      return;
    }
    if (ev.key === "b") {
      ev.preventDefault();
      this.toggleBothCollapsed();
      this.scheduleRender();
      return;
    }
    if (ev.key !== "ArrowLeft" && ev.key !== "ArrowRight")
      return;
    ev.preventDefault();
    const delta = ev.key === "ArrowLeft" ? -1 : 1;
    void this.navigateTo(addDays(this.selectedDate, delta));
  }
  toggleBothCollapsed() {
    const allCollapsed = this.summariesCollapsed && this.habitsCollapsed;
    const next = !allCollapsed;
    this.summariesCollapsed = next;
    this.habitsCollapsed = next;
  }
  togglePomodoroPause() {
    var _a;
    const state = this.pomodoroState;
    if (!state)
      return;
    const workMs = this.plugin.settings.pomodoroWorkMin * 6e4;
    const breakMs = this.plugin.settings.pomodoroBreakMin * 6e4;
    const phaseMs = state.phase === "work" ? workMs : breakMs;
    const expired = state.paused && state.pausedRemainingMs !== null && state.pausedRemainingMs <= 0;
    if (expired) {
      this.bankWorkProgress();
      state.phase = state.phase === "work" ? "rest" : "work";
      state.startedAt = Date.now();
      state.paused = false;
      state.pausedRemainingMs = null;
      state.workPhaseBankedMs = 0;
    } else if (state.paused) {
      const remain = (_a = state.pausedRemainingMs) != null ? _a : phaseMs;
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
  }
  // Enter-key behavior: check off the next unfinished subtask if there is one,
  // otherwise mark the parent task done and exit focus mode.
  async advancePomodoroComplete() {
    const state = this.pomodoroState;
    if (!state)
      return;
    const file = this.app.vault.getAbstractFileByPath(state.filePath);
    if (!(file instanceof import_obsidian5.TFile))
      return;
    const content = await this.app.vault.read(file);
    const tasks = parseFileTasks(
      file.path,
      content,
      this.plugin.settings.prefixes,
      this.plugin.settings.defaultDurationMin
    );
    let task = tasks.find((t) => t.lineNumber === state.taskLineNumber);
    if (!task || this.cleanBody(task.body) !== state.taskBodySnapshot) {
      task = tasks.find(
        (t) => this.cleanBody(t.body) === state.taskBodySnapshot
      );
      if (task)
        state.taskLineNumber = task.lineNumber;
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
  async undoLastSubtask() {
    const lineNumber = this.pomodoroSubtaskHistory.pop();
    if (lineNumber === void 0)
      return;
    const state = this.pomodoroState;
    if (!state)
      return;
    const file = this.app.vault.getAbstractFileByPath(state.filePath);
    if (!(file instanceof import_obsidian5.TFile))
      return;
    await this.applyLineChecked(file, lineNumber, false);
    this.scheduleRender();
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
    var _a, _b, _c, _d, _e;
    const root = this.containerEl.children[1];
    if (this.pomodoroState && !this.pomodoroHidden) {
      const handled = await this.renderPomodoro(root);
      if (handled)
        return;
    }
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
      template: this.plugin.settings.dailyNoteTemplate,
      templatesByDay: this.plugin.settings.dailyNoteTemplatesByDay,
      dateLinkFormat: this.plugin.settings.dateLinkFormat,
      prefixes: this.plugin.settings.prefixes,
      quotesFile: this.plugin.settings.quotesFile,
      addCreatedTag: this.plugin.settings.addCreatedTagToFrontmatter
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
      if (f instanceof import_obsidian5.TFile) {
        displayFile = f;
        displayPath = f.path;
      } else {
        this.overrideFilePath = null;
      }
    }
    const fileContent = displayFile ? await this.app.vault.read(displayFile) : "";
    const tasks = displayFile ? parseFileTasks(
      displayFile.path,
      fileContent,
      this.plugin.settings.prefixes,
      this.plugin.settings.defaultDurationMin
    ) : [];
    const exercises = parseExercises(fileContent, this.plugin.settings.prefixes);
    const frontmatter = displayFile ? (_b = (_a = this.app.metadataCache.getFileCache(displayFile)) == null ? void 0 : _a.frontmatter) != null ? _b : null : null;
    const intention = displayFile ? (_c = parseFrontmatterField(frontmatter, this.plugin.settings.intentionTag)) != null ? _c : parseTaggedLine(fileContent, this.plugin.settings.intentionTag) : null;
    const quote = displayFile ? (_d = parseFrontmatterField(frontmatter, this.plugin.settings.quoteTag)) != null ? _d : parseTaggedLine(fileContent, this.plugin.settings.quoteTag) : null;
    const activeFile = this.app.workspace.getActiveFile();
    this.lastActiveFilePath = (_e = activeFile == null ? void 0 : activeFile.path) != null ? _e : null;
    const showOpenActiveLink = activeFile !== null && (!displayFile || activeFile.path !== displayFile.path);
    this.renderDateNav(root, displayFile);
    const colorMap = resolveProjectColors(
      tasks.filter(
        (t) => t.project !== null
      ),
      this.plugin.settings.projectColors
    );
    const habitDisplays = await this.loadHabitDisplays(
      this.selectedDate,
      fileContent,
      fallback
    );
    this.renderSection(
      root,
      this.formatDateLabel(this.selectedDate),
      "",
      displayFile,
      displayPath,
      tasks,
      exercises,
      habitDisplays,
      true,
      colorMap,
      showOpenActiveLink ? activeFile : null,
      intention,
      quote
    );
    this.renderTimelineHints(root);
    root.scrollTop = prevRootScroll;
    const newTimelines = root.querySelectorAll(".dp-timeline-wrap");
    newTimelines.forEach((el, i) => {
      const prev = prevTimelineScrolls[i];
      if (prev !== void 0)
        el.scrollTop = prev;
    });
    this.hasRendered = true;
  }
  renderTimelineHints(root) {
    if (!this.hintsVisible)
      return;
    const overlay = root.createDiv({ cls: "dp-hints-overlay" });
    overlay.addEventListener("click", (ev) => {
      if (ev.target === overlay) {
        this.hintsVisible = false;
        this.scheduleRender();
      }
    });
    const hints = overlay.createDiv({ cls: "dp-timeline-hints is-visible" });
    const closeBtn = hints.createEl("button", {
      cls: "dp-hints-close",
      attr: { "aria-label": "Close" },
      text: "\xD7"
    });
    closeBtn.addEventListener("click", () => {
      this.hintsVisible = false;
      this.scheduleRender();
    });
    const addHint = (key, label) => {
      const item = hints.createSpan({ cls: "dp-pomo-hint" });
      item.createEl("kbd", { cls: "dp-pomo-kbd", text: key });
      item.createSpan({ cls: "dp-pomo-hint-label", text: label });
    };
    addHint("\u2190/\u2192", "day");
    addHint("c", "calendar");
    addHint("s", "summary");
    addHint("h", "habits");
    addHint("b", "both");
    if (this.pomodoroState !== null)
      addHint("t", "focus");
    addHint("p", this.isPopout() ? "return" : "pop out");
    addHint("?", "toggle hints");
  }
  renderDateNav(parent, displayFile) {
    const nav = parent.createDiv({ cls: "dp-datenav" });
    const prev = nav.createEl("button", {
      cls: "dp-nav-btn dp-nav-arrow",
      attr: { "aria-label": "Previous day" }
    });
    (0, import_obsidian5.setIcon)(prev, "chevron-left");
    const today = nav.createEl("button", {
      cls: "dp-today-btn",
      attr: { "aria-label": "Jump to today" }
    });
    (0, import_obsidian5.setIcon)(today, "sun");
    const calBtn = nav.createEl("button", {
      cls: "dp-cal-btn",
      attr: { "aria-label": "Toggle calendar" }
    });
    (0, import_obsidian5.setIcon)(calBtn, "calendar");
    if (this.calendarOpen)
      calBtn.addClass("is-active");
    const labelText = this.formatDateLabel(this.selectedDate);
    if (displayFile) {
      const label = nav.createEl("a", {
        cls: "dp-datenav-label is-clickable",
        text: labelText,
        attr: { href: "#", title: `Open ${displayFile.path}` }
      });
      label.addEventListener("click", (ev) => {
        ev.preventDefault();
        void this.openFile(displayFile);
      });
    } else {
      const label = nav.createDiv({ cls: "dp-datenav-label" });
      label.textContent = labelText;
    }
    if (this.pomodoroState && this.pomodoroHidden) {
      const focusBtn = nav.createEl("button", {
        cls: "dp-nav-btn dp-pomo-resume",
        attr: { "aria-label": "Back to focus" }
      });
      (0, import_obsidian5.setIcon)(focusBtn, "timer");
      focusBtn.addEventListener("click", () => {
        this.pomodoroHidden = false;
        this.scheduleRender();
      });
    }
    const allCollapsed = this.summariesCollapsed && this.habitsCollapsed;
    const collapseBtn = nav.createEl("button", {
      cls: "dp-nav-btn",
      attr: {
        "aria-label": allCollapsed ? "Expand summary and habits" : "Collapse summary and habits",
        "aria-expanded": allCollapsed ? "false" : "true"
      }
    });
    (0, import_obsidian5.setIcon)(collapseBtn, allCollapsed ? "chevron-down" : "chevron-up");
    collapseBtn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      this.toggleBothCollapsed();
      this.scheduleRender();
    });
    const popoutBtn = nav.createEl("button", {
      cls: "dp-nav-btn dp-popout-btn",
      attr: {
        "aria-label": this.isPopout() ? "Return to main window" : "Open in new window"
      }
    });
    (0, import_obsidian5.setIcon)(popoutBtn, this.isPopout() ? "monitor" : "picture-in-picture-2");
    popoutBtn.addEventListener("click", () => {
      if (this.isPopout())
        void this.returnLeafToMain();
      else
        void this.popOutLeaf();
    });
    const next = nav.createEl("button", {
      cls: "dp-nav-btn dp-nav-arrow",
      attr: { "aria-label": "Next day" }
    });
    (0, import_obsidian5.setIcon)(next, "chevron-right");
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
      template: this.plugin.settings.dailyNoteTemplate,
      templatesByDay: this.plugin.settings.dailyNoteTemplatesByDay,
      dateLinkFormat: this.plugin.settings.dateLinkFormat,
      prefixes: this.plugin.settings.prefixes,
      quotesFile: this.plugin.settings.quotesFile,
      addCreatedTag: this.plugin.settings.addCreatedTagToFrontmatter
    };
    const resolved = await resolveDailyNote(this.app, target, fallback);
    if (!resolved.file) {
      try {
        await ensureDailyNote(this.app, target, fallback);
      } catch (e) {
        new import_obsidian5.Notice(`Today: failed to create note (${e.message})`);
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
  // Renders `text` as inline Markdown into `el` — bold/italic/links/code in
  // intentions and quotes get formatted instead of shown as raw `_foo_` /
  // `**foo**`. Obsidian's MarkdownRenderer wraps single-line input in a `<p>`
  // tag; we unwrap it so the result still flows inline next to surrounding
  // header text. Fire-and-forget on purpose — the caller has already
  // appended the empty span, so the rendered children fill it asynchronously
  // without holding up the rest of the view render.
  renderInlineMarkdown(text, el, sourcePath) {
    void import_obsidian5.MarkdownRenderer.render(this.app, text, el, sourcePath, this).then(
      () => {
        const p = el.querySelector(":scope > p");
        if (p) {
          while (p.firstChild)
            el.insertBefore(p.firstChild, p);
          p.remove();
        }
      }
    );
  }
  renderSection(parent, title, subtitle, file, path, tasks, exercises, habitDisplays, isPrimary, colorMap, openActiveTarget = null, intention = null, quote = null) {
    const section = parent.createDiv({ cls: "dp-section" });
    if (this.summariesCollapsed)
      section.addClass("is-summaries-collapsed");
    if (this.habitsCollapsed)
      section.addClass("is-habits-collapsed");
    const header = section.createDiv({ cls: "dp-header" });
    if (!isPrimary && title)
      header.createDiv({ cls: "dp-title", text: title });
    if (subtitle || openActiveTarget || intention) {
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
      if (intention) {
        if (subtitle)
          sub.createSpan({ cls: "dp-subtitle-sep", text: "\u2022" });
        const intentionEl = sub.createSpan({ cls: "dp-intention" });
        this.renderInlineMarkdown(intention, intentionEl, path);
      }
      if (openActiveTarget) {
        if (subtitle || intention)
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
    if (quote) {
      const quoteRow = header.createDiv({ cls: "dp-quote-row" });
      const quoteEl = quoteRow.createSpan({ cls: "dp-quote" });
      this.renderInlineMarkdown(quote, quoteEl, path);
    }
    if (isPrimary) {
      const workout = header.createDiv({ cls: "dp-workout" });
      workout.textContent = formatExerciseLine(exercises);
      this.renderHabitsLine(header, habitDisplays, file);
    }
    const nonNoteTasks = tasks.filter((t) => !this.isNoteTask(t));
    const statsRow = header.createDiv({ cls: "dp-stats-row" });
    this.renderTimeTable(statsRow, nonNoteTasks);
    this.renderProjectTable(statsRow, nonNoteTasks, colorMap);
    if (!file && isPrimary) {
      const create = section.createEl("button", {
        cls: "dp-create",
        text: `Create ${path}`
      });
      create.addEventListener("click", async () => {
        const fallback = {
          folder: this.plugin.settings.dailyNoteFolderFallback,
          format: this.plugin.settings.dailyNoteFormatFallback,
          template: this.plugin.settings.dailyNoteTemplate,
          templatesByDay: this.plugin.settings.dailyNoteTemplatesByDay,
          prefixes: this.plugin.settings.prefixes,
          quotesFile: this.plugin.settings.quotesFile,
          addCreatedTag: this.plugin.settings.addCreatedTagToFrontmatter
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
    const timedNotes = scheduled.filter((t) => this.isNoteTask(t));
    const blockTasks = scheduled.filter((t) => !this.isNoteTask(t));
    this.renderTimeline(body, file, blockTasks, timedNotes, colorMap);
    this.renderUnscheduled(body, file, unscheduled, colorMap);
  }
  renderTimeline(parent, file, scheduled, notes, colorMap) {
    const settings = this.plugin.settings;
    const startMin = settings.visibleStartHour * 60;
    const endMin = settings.visibleEndHour * 60;
    const totalMin = endMin - startMin;
    const heightPx = totalMin * settings.pxPerMin;
    const wrap = parent.createDiv({ cls: "dp-timeline-wrap" });
    const configuredHeight = import_obsidian5.Platform.isMobile ? settings.timelineHeightMobile : settings.timelineHeightDesktop;
    const parsedHeight = parseTimelineHeight(configuredHeight);
    if (parsedHeight)
      wrap.style.maxHeight = parsedHeight;
    const timeline = wrap.createDiv({ cls: "dp-timeline" });
    timeline.style.height = `${heightPx}px`;
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
        text: this.formatHourLabel(h)
      });
      if (isLast)
        continue;
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
            text: `:${mm}`
          });
          sub.style.top = `${m * settings.pxPerMin - snapPx / 2}px`;
          sub.setAttribute(
            "aria-label",
            `New task at ${this.formatHourLabel(h)}:${mm}`
          );
          sub.addEventListener("click", (ev) => {
            ev.stopPropagation();
            void this.createTaskAtTime(
              file,
              h * 60 + m,
              settings.defaultDurationMin
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
        if (note.startMin === null)
          continue;
        if (note.startMin < startMin || note.startMin > endMin)
          continue;
        this.renderNoteStrip(
          notesLayer,
          file,
          note,
          (note.startMin - startMin) * settings.pxPerMin,
          colorMap
        );
      }
    }
    if (sameDay(this.selectedDate, new Date())) {
      const nowLine = timeline.createDiv({ cls: "dp-now-line" });
      nowLine.dataset.startMin = String(startMin);
      nowLine.dataset.endMin = String(endMin);
      nowLine.dataset.pxPerMin = String(settings.pxPerMin);
      this.positionNowLine(nowLine);
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
  createTaskAtTime(file, startMin, defaultDurationMin) {
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
          project
        });
      }
    );
  }
  createUnscheduledTask(file) {
    const prefixes = this.plugin.settings.prefixes;
    this.openNewTaskModal(
      file,
      "New unscheduled task",
      this.plugin.settings.defaultDurationMin,
      (title, description, durationMin, project) => {
        const body = description ? `${title} {${description}}` : title;
        return buildTaskLine(body, prefixes, {
          durationMin,
          project
        });
      }
    );
  }
  openNewTaskModal(file, modalTitle, defaultDurationMin, buildLine) {
    new TaskEditModal(this.app, {
      mode: "new",
      modalTitle,
      initialTitle: "",
      initialDescription: "",
      initialDurationMin: defaultDurationMin,
      initialProject: null,
      initialChecked: false,
      initialTags: [],
      availableTags: this.collectContextTagNames(),
      subtasks: [],
      projects: this.collectProjectNames(),
      getPriorTasks: () => this.collectPriorTaskSuggestions(),
      copySubtasksOnAutocomplete: this.plugin.settings.copySubtasksOnAutocomplete,
      durations: quickDurations(this.plugin.settings.quickDurationsMin),
      prefixes: this.plugin.settings.prefixes,
      projectTrigger: this.plugin.settings.autocomplete.projectTrigger,
      timeTrigger: this.plugin.settings.autocomplete.timeTrigger,
      durationTrigger: this.plugin.settings.autocomplete.durationTrigger,
      dateTrigger: this.plugin.settings.autocomplete.dateTrigger,
      dailyNoteFormat: this.plugin.settings.dailyNoteFormatFallback,
      dailyNoteFolder: this.plugin.settings.dailyNoteFolderFallback,
      dateLinkFormat: this.plugin.settings.dateLinkFormat,
      peopleFolder: this.plugin.settings.peopleFolder,
      visibleStartHour: this.plugin.settings.visibleStartHour,
      visibleEndHour: this.plugin.settings.visibleEndHour,
      quickDurationsMin: this.plugin.settings.quickDurationsMin,
      cleanBody: (body) => this.cleanBody(body),
      onSave: (title, description, durationMin, project, _checked, tags, extras) => {
        var _a, _b;
        const proj = project === void 0 || project === "" ? null : project;
        const subtaskSum = durationMin === null && (extras == null ? void 0 : extras.subtaskRawLines) ? sumSubtaskDurations(
          extras.subtaskRawLines,
          this.plugin.settings.prefixes
        ) : 0;
        const dur = durationMin != null ? durationMin : subtaskSum > 0 ? subtaskSum : defaultDurationMin;
        let newLine = buildLine(title, description, dur, proj);
        if (tags && tags.length > 0) {
          newLine = setTaskContextTags(
            newLine,
            tags,
            this.plugin.settings.prefixes
          );
        }
        newLine = setTaskCreatedTag(
          newLine,
          todayDateStr(),
          this.plugin.settings.prefixes
        );
        void this.appendTaskAfterLast(
          file,
          newLine,
          (_a = extras == null ? void 0 : extras.subtaskRawLines) != null ? _a : [],
          (_b = extras == null ? void 0 : extras.postAction) != null ? _b : "none"
        );
      }
    }).open();
  }
  async appendTaskAfterLast(file, newLine, subtaskLines = [], postAction = "none") {
    let taskLineNumber = -1;
    await this.app.vault.process(file, (content) => {
      const lines = content.split("\n");
      const lastIdx = findLastTaskLine(content);
      const insertAt = lastIdx === -1 ? lines.length : lastIdx + 1;
      taskLineNumber = insertAt;
      lines.splice(insertAt, 0, newLine, ...subtaskLines);
      return lines.join("\n");
    });
    if (postAction === "none" || taskLineNumber < 0)
      return;
    if (postAction === "show") {
      void this.openLine(file, taskLineNumber, this.endOfTitleCh(newLine));
      return;
    }
    if (postAction === "pomodoro") {
      const content = await this.app.vault.read(file);
      const tasks = parseFileTasks(
        file.path,
        content,
        this.plugin.settings.prefixes,
        this.plugin.settings.defaultDurationMin
      );
      const fresh = tasks.find((t) => t.lineNumber === taskLineNumber);
      if (fresh)
        this.enterPomodoro(file, fresh);
    }
  }
  // A timed note renders as a thin one-line block on the timeline at its
  // start time — a dot, the time, and the title, all visible inline. Click
  // opens the editor for the full description and editing UI. The strip
  // inherits the task's project / context color so notes group visually
  // with their project.
  renderNoteStrip(layer, file, note, topPx, colorMap) {
    var _a, _b;
    const strip = layer.createDiv({ cls: "dp-note-strip" });
    if (note.checked)
      strip.addClass("is-done");
    strip.style.top = `${topPx}px`;
    const ctx = this.findContextTag(note);
    const projectColor = getTaskColor(note.project, note.subproject, colorMap);
    const color = (_b = (_a = ctx == null ? void 0 : ctx.color) != null ? _a : projectColor) != null ? _b : null;
    if (color)
      strip.style.setProperty("--dp-color", color);
    strip.createSpan({ cls: "dp-note-strip-dot" });
    const timeText = note.hasExplicitDuration ? `${this.fmtClock(note.startMin)}\u2013${this.fmtClock(note.startMin + note.durationMin)}` : this.fmtClock(note.startMin);
    strip.createSpan({ cls: "dp-note-strip-time", text: timeText });
    const titleEl = strip.createSpan({
      cls: "dp-note-strip-title",
      text: this.cleanBody(note.body) || "(untitled)"
    });
    titleEl.addEventListener("click", (ev) => {
      ev.stopPropagation();
      void this.applyLineChecked(file, note.lineNumber, !note.checked);
    });
    strip.addEventListener("click", (ev) => {
      ev.stopPropagation();
      this.openTaskEditor(file, note);
    });
  }
  renderBlock(layer, file, block, colorMap) {
    var _a, _b;
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
    const narrow = block.widthPct < 99.5;
    if (narrow) {
      el.addClass("is-narrow");
      if (block.task.durationMin <= 15)
        el.addClass("is-narrow-mini");
      else if (block.task.durationMin <= 30)
        el.addClass("is-narrow-2line");
    }
    if (import_obsidian5.Platform.isMobile)
      el.addClass("is-mobile-condensed");
    const ctx = this.findContextTag(block.task);
    const projectColor = getTaskColor(
      block.task.project,
      block.task.subproject,
      colorMap
    );
    const color = (_b = (_a = ctx == null ? void 0 : ctx.color) != null ? _a : projectColor) != null ? _b : null;
    if (color) {
      el.style.setProperty("--dp-color", color);
      el.style.setProperty("--dp-on-color", contrastingTextColor(color));
      el.addClass("has-project-color");
    }
    el.draggable = true;
    const row = el.createDiv({ cls: "dp-block-row" });
    const meta = row.createSpan({ cls: "dp-block-meta" });
    if (ctx == null ? void 0 : ctx.icon) {
      const ctxIcon = meta.createSpan({ cls: "dp-block-context-icon" });
      (0, import_obsidian5.setIcon)(ctxIcon, ctx.icon);
      ctxIcon.setAttribute("aria-label", `#${ctx.tag}`);
    }
    if (!block.task.hasExplicitDuration) {
      const warn = meta.createSpan({ cls: "dp-warn" });
      (0, import_obsidian5.setIcon)(warn, "alert-triangle");
      warn.setAttribute("aria-label", "No #d/ tag \u2014 using default duration");
    }
    const compactTime = block.task.startMin !== null && (import_obsidian5.Platform.isMobile || narrow && block.task.durationMin <= 30);
    meta.createSpan({
      cls: "dp-block-time",
      text: compactTime ? this.fmtClock(block.task.startMin) : this.formatBlockTime(block.task)
    });
    row.createSpan({ cls: "dp-block-sep", text: "\xB7" });
    if (block.task.project) {
      const projWrap = row.createSpan({ cls: "dp-block-project-wrap" });
      const projIcon = this.resolveProjectIcon(block.task.project);
      if (projIcon) {
        const ic = projWrap.createSpan({ cls: "dp-block-project-icon" });
        (0, import_obsidian5.setIcon)(ic, projIcon);
      }
      projWrap.createSpan({ cls: "dp-block-project", text: block.task.project });
      if (block.task.subproject) {
        projWrap.createSpan({
          cls: "dp-block-subproject",
          text: `/${block.task.subproject}`
        });
      }
      row.createSpan({ cls: "dp-block-sep", text: "\xB7" });
    }
    if (block.task.tags.length > 0) {
      const tagsWrap = row.createSpan({ cls: "dp-block-tags" });
      for (const tag of block.task.tags) {
        tagsWrap.createSpan({ cls: "dp-block-tag", text: tag });
      }
      row.createSpan({ cls: "dp-block-sep", text: "\xB7" });
    }
    const titleText = row.createSpan({
      cls: "dp-block-text",
      text: this.cleanBody(block.task.body)
    });
    titleText.addEventListener("click", (ev) => {
      ev.stopPropagation();
      void this.applyLineChecked(
        file,
        block.task.lineNumber,
        !block.task.checked
      );
    });
    titleText.addEventListener("pointerdown", (ev) => ev.stopPropagation());
    titleText.addEventListener("mousedown", (ev) => ev.stopPropagation());
    titleText.addEventListener("dragstart", (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
    });
    if (block.task.description && block.heightPx >= 36) {
      el.createDiv({
        cls: "dp-block-description",
        text: block.task.description
      });
    }
    if (block.task.subtasks.length > 0 && block.heightPx >= 44) {
      const subList = el.createDiv({ cls: "dp-block-subtasks" });
      const prefixes = this.plugin.settings.prefixes;
      block.task.subtasks.forEach((sub) => {
        const subRow = subList.createDiv({ cls: "dp-block-subtask" });
        if (sub.checked)
          subRow.addClass("is-done");
        const text = subRow.createSpan({ cls: "dp-block-subtask-text" });
        const subMin = parseTime(sub.text, prefixes);
        if (subMin !== null) {
          text.createSpan({
            cls: "dp-block-subtask-time",
            text: this.fmtClock(subMin)
          });
          const body = this.cleanBody(sub.text);
          if (body)
            text.appendText(" " + body);
        } else {
          text.setText(this.cleanBody(sub.text));
        }
        text.addEventListener("click", (ev) => {
          ev.stopPropagation();
          void this.applyLineChecked(file, sub.lineNumber, !sub.checked);
        });
        text.addEventListener("pointerdown", (ev) => ev.stopPropagation());
        text.addEventListener("mousedown", (ev) => ev.stopPropagation());
        text.addEventListener("dragstart", (ev) => {
          ev.preventDefault();
          ev.stopPropagation();
        });
      });
    }
    el.addEventListener("dragstart", (ev) => {
      var _a2;
      const rect = el.getBoundingClientRect();
      this.dragPayload = {
        filePath: file.path,
        lineNumber: block.task.lineNumber,
        rawLine: block.task.rawLine,
        source: "timeline",
        grabOffsetY: ev.clientY - rect.top,
        durationMin: block.task.durationMin,
        bodyText: this.cleanBody(block.task.body),
        hasExplicitDuration: block.task.hasExplicitDuration,
        subtaskRawLines: block.task.subtasks.map((s) => s.rawLine)
      };
      el.addClass("is-dragging");
      this.suppressNativeDragImage(ev);
      (_a2 = ev.dataTransfer) == null ? void 0 : _a2.setData("text/plain", block.task.rawLine);
      if (ev.dataTransfer)
        ev.dataTransfer.effectAllowed = "move";
    });
    el.addEventListener("dragend", () => {
      el.removeClass("is-dragging");
      this.dragPayload = null;
      this.hideDropIndicator();
    });
    el.addEventListener("click", () => this.openTaskEditor(file, block.task));
    const handle = el.createDiv({ cls: "dp-resize-handle" });
    handle.addEventListener(
      "pointerdown",
      (ev) => this.beginResize(ev, el, file, block)
    );
    if (block.task.startMin !== null) {
      const topHandle = el.createDiv({
        cls: "dp-resize-handle dp-resize-handle-top"
      });
      topHandle.addEventListener(
        "pointerdown",
        (ev) => this.beginResizeTop(ev, el, file, block)
      );
    }
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
        timeEl.textContent = `${this.fmtClock(start)}\u2013${this.fmtClock(start + pendingDuration)} (${formatTotal(pendingDuration)})`;
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
      const suppressClick = (ev2) => ev2.stopPropagation();
      blockEl.addEventListener("click", suppressClick, { capture: true });
      window.setTimeout(
        () => blockEl.removeEventListener("click", suppressClick, true),
        0
      );
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
        bodyText: "",
        hasExplicitDuration: task.hasExplicitDuration,
        subtaskRawLines: task.subtasks.map((s) => s.rawLine)
      },
      (line) => setDurationTag(line, newDurationMin, prefixes)
    );
  }
  beginResizeTop(ev, blockEl, file, block) {
    if (block.task.startMin === null)
      return;
    ev.preventDefault();
    ev.stopPropagation();
    const handle = ev.currentTarget;
    const settings = this.plugin.settings;
    const startY = ev.clientY;
    const startTopPx = blockEl.offsetTop;
    const startHeightPx = blockEl.offsetHeight;
    const startStartMin = block.task.startMin;
    const startDurationMin = block.task.durationMin;
    const minDuration = settings.snapMin;
    const pxPerMin = settings.pxPerMin;
    let pendingStart = startStartMin;
    let pendingDuration = startDurationMin;
    blockEl.draggable = false;
    blockEl.addClass("is-resizing");
    handle.setPointerCapture(ev.pointerId);
    const onMove = (e) => {
      const dy = e.clientY - startY;
      const rawNewStart = startStartMin + dy / pxPerMin;
      let snappedStart = snapToInterval(rawNewStart, settings.snapMin);
      const maxStart = startStartMin + startDurationMin - minDuration;
      if (snappedStart > maxStart)
        snappedStart = maxStart;
      if (snappedStart < 0)
        snappedStart = 0;
      pendingStart = snappedStart;
      pendingDuration = startDurationMin - (snappedStart - startStartMin);
      const deltaPx = (snappedStart - startStartMin) * pxPerMin;
      blockEl.style.top = `${startTopPx + deltaPx}px`;
      blockEl.style.height = `${startHeightPx - deltaPx}px`;
      const timeEl = blockEl.querySelector(".dp-block-time");
      if (timeEl) {
        timeEl.textContent = `${this.fmtClock(pendingStart)}\u2013${this.fmtClock(pendingStart + pendingDuration)} (${formatTotal(pendingDuration)})`;
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
      const suppressClick = (ev2) => ev2.stopPropagation();
      blockEl.addEventListener("click", suppressClick, { capture: true });
      window.setTimeout(
        () => blockEl.removeEventListener("click", suppressClick, true),
        0
      );
      if (pendingStart === startStartMin && pendingDuration === startDurationMin) {
        blockEl.draggable = true;
        return;
      }
      void this.applyStartAndDurationChange(
        file,
        block.task,
        pendingStart,
        pendingDuration
      ).finally(() => {
        blockEl.draggable = true;
      });
    };
    handle.addEventListener("pointermove", onMove);
    handle.addEventListener("pointerup", onUp);
    handle.addEventListener("pointercancel", onUp);
  }
  async applyStartAndDurationChange(file, task, newStartMin, newDurationMin) {
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
        hasExplicitDuration: task.hasExplicitDuration,
        subtaskRawLines: task.subtasks.map((s) => s.rawLine)
      },
      (line) => {
        let next = setTimeTag(line, newStartMin, prefixes);
        next = setDurationTag(next, newDurationMin, prefixes);
        return next;
      }
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
    if (import_obsidian5.Platform.isMobile && this.unscheduledCollapsed) {
      list.addClass("is-collapsed");
    }
    const head = list.createDiv({ cls: "dp-unscheduled-head" });
    if (import_obsidian5.Platform.isMobile) {
      const toggleBtn = head.createEl("button", {
        cls: "dp-unscheduled-toggle",
        attr: {
          "aria-label": this.unscheduledCollapsed ? "Expand unscheduled" : "Collapse unscheduled",
          "aria-expanded": this.unscheduledCollapsed ? "false" : "true"
        }
      });
      (0, import_obsidian5.setIcon)(
        toggleBtn,
        this.unscheduledCollapsed ? "chevron-up" : "chevron-down"
      );
      toggleBtn.addEventListener("click", (ev) => {
        ev.stopPropagation();
        this.unscheduledCollapsed = !this.unscheduledCollapsed;
        this.scheduleRender();
      });
    }
    head.createSpan({ cls: "dp-unscheduled-title", text: "Unscheduled" });
    if (import_obsidian5.Platform.isMobile && unscheduled.length > 0) {
      head.createSpan({
        cls: "dp-unscheduled-count",
        text: String(unscheduled.length)
      });
    }
    const addBtn = head.createEl("button", {
      cls: "dp-unscheduled-add",
      attr: { "aria-label": "Add unscheduled task" }
    });
    (0, import_obsidian5.setIcon)(addBtn, "plus");
    addBtn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      if (import_obsidian5.Platform.isMobile && this.unscheduledCollapsed) {
        this.unscheduledCollapsed = false;
      }
      void this.createUnscheduledTask(file);
    });
    const body = list.createDiv({ cls: "dp-unscheduled-body" });
    if (unscheduled.length === 0) {
      body.createDiv({ cls: "dp-empty", text: "No unscheduled tasks." });
    }
    unscheduled.forEach((task, idx) => {
      var _a, _b;
      const card = body.createDiv({ cls: "dp-card" });
      if (task.checked)
        card.addClass("is-done");
      if (!task.hasExplicitDuration)
        card.addClass("is-implicit-duration");
      const ctx = this.findContextTag(task);
      const projectColor = getTaskColor(task.project, task.subproject, colorMap);
      const color = (_b = (_a = ctx == null ? void 0 : ctx.color) != null ? _a : projectColor) != null ? _b : null;
      if (color) {
        card.style.setProperty("--dp-color", color);
        card.addClass("has-project-color");
      }
      card.draggable = true;
      const meta = card.createDiv({ cls: "dp-card-meta" });
      if (ctx == null ? void 0 : ctx.icon) {
        const ctxIcon = meta.createSpan({ cls: "dp-card-context-icon" });
        (0, import_obsidian5.setIcon)(ctxIcon, ctx.icon);
        ctxIcon.setAttribute("aria-label", `#${ctx.tag}`);
      }
      if (!task.hasExplicitDuration) {
        const warn = meta.createSpan({ cls: "dp-warn" });
        (0, import_obsidian5.setIcon)(warn, "alert-triangle");
        warn.setAttribute("aria-label", "No #d/ tag \u2014 using default duration");
      }
      meta.createSpan({ text: formatTotal(task.durationMin) });
      if (task.project) {
        const projGroup = card.createSpan({ cls: "dp-card-project-wrap" });
        const projIcon = this.resolveProjectIcon(task.project);
        if (projIcon) {
          const ic = projGroup.createSpan({ cls: "dp-card-project-icon" });
          (0, import_obsidian5.setIcon)(ic, projIcon);
        }
        projGroup.createSpan({ cls: "dp-card-project", text: task.project });
        if (task.subproject) {
          projGroup.createSpan({
            cls: "dp-card-subproject",
            text: `/${task.subproject}`
          });
        }
      }
      if (task.tags.length > 0) {
        const tagsWrap = card.createSpan({ cls: "dp-card-tags" });
        for (const tag of task.tags) {
          tagsWrap.createSpan({ cls: "dp-card-tag", text: tag });
        }
      }
      const textCol = card.createDiv({ cls: "dp-card-text-col" });
      const text = textCol.createDiv({ cls: "dp-card-text" });
      text.textContent = this.cleanBody(task.body);
      if (task.description) {
        textCol.createDiv({
          cls: "dp-card-description",
          text: task.description
        });
      }
      card.addEventListener("dragstart", (ev) => {
        var _a2;
        const rect = card.getBoundingClientRect();
        this.dragPayload = {
          filePath: file.path,
          lineNumber: task.lineNumber,
          rawLine: task.rawLine,
          source: "unscheduled",
          grabOffsetY: ev.clientY - rect.top,
          durationMin: task.durationMin,
          bodyText: this.cleanBody(task.body),
          hasExplicitDuration: task.hasExplicitDuration,
          subtaskRawLines: task.subtasks.map((s) => s.rawLine)
        };
        card.addClass("is-dragging");
        this.suppressNativeDragImage(ev);
        (_a2 = ev.dataTransfer) == null ? void 0 : _a2.setData("text/plain", task.rawLine);
        if (ev.dataTransfer)
          ev.dataTransfer.effectAllowed = "move";
      });
      card.addEventListener("dragend", () => {
        card.removeClass("is-dragging");
        this.dragPayload = null;
        this.hideDropIndicator();
      });
      card.addEventListener("dragover", (ev) => {
        var _a2;
        if (((_a2 = this.dragPayload) == null ? void 0 : _a2.source) === "unscheduled")
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
      card.addEventListener("click", () => this.openTaskEditor(file, task));
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
    const subtaskSum = payload.source === "unscheduled" && !payload.hasExplicitDuration ? sumSubtaskDurations(payload.subtaskRawLines, prefixes) : 0;
    await this.editLine(payload, (line) => {
      let next = setTimeTag(line, newStartMin, prefixes);
      next = removeOrderTag(next, prefixes);
      if (subtaskSum > 0 && parseDuration(next, prefixes) === null) {
        next = setDurationTag(next, subtaskSum, prefixes);
      }
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
    await this.app.vault.process(file, (content) => {
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
      return dirty ? lines.join("\n") : content;
    });
  }
  async editLine(payload, transform) {
    const file = this.app.vault.getAbstractFileByPath(payload.filePath);
    if (!(file instanceof import_obsidian5.TFile)) {
      new import_obsidian5.Notice("Today: source file no longer exists.");
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
      if (next === lines[idx])
        return content;
      lines[idx] = next;
      return lines.join("\n");
    });
    if (stale) {
      new import_obsidian5.Notice("Today: file changed since last render \u2014 refreshing.");
      this.scheduleRender();
    }
  }
  formatHourLabel(h) {
    const ampm = h < 12 || h === 24 ? "a" : "p";
    let h12 = h % 12;
    if (h12 === 0)
      h12 = 12;
    return `${h12}${ampm}`;
  }
  renderTimeTable(parent, tasks) {
    const settings = this.plugin.settings;
    const totals = computeTotals(tasks);
    const planned = totals.scheduledMin + totals.unscheduledMin;
    const workdayMin = Math.max(
      0,
      (settings.workEndHour - settings.workStartHour) * 60
    );
    const scheduledTasks = tasks.filter((t) => t.startMin !== null);
    const wakeMin = settings.wakeHour * 60;
    const sleepMin = settings.sleepHour * 60;
    const workStartMin = settings.workStartHour * 60;
    const workEndMin = settings.workEndHour * 60;
    const workOpen = computeFreeMin(
      scheduledTasks,
      workStartMin,
      workEndMin
    );
    const morningOpen = computeFreeMin(
      scheduledTasks,
      wakeMin,
      Math.min(workStartMin, sleepMin)
    );
    const eveningOpen = computeFreeMin(
      scheduledTasks,
      Math.max(workEndMin, wakeMin),
      sleepMin
    );
    const sleepDurationMin = 24 * 60 - (sleepMin - wakeMin);
    const morningRange = `${this.formatHourLabel(settings.wakeHour)}-${this.formatHourLabel(settings.workStartHour)}`;
    const workRange = `${this.formatHourLabel(settings.workStartHour)}-${this.formatHourLabel(settings.workEndHour)}`;
    const eveningRange = `${this.formatHourLabel(settings.workEndHour)}-${this.formatHourLabel(settings.sleepHour)}`;
    const column = parent.createDiv({ cls: "dp-stat-col" });
    const table = column.createDiv({ cls: "dp-stat-table" });
    this.renderStatRow(table, "Scheduled", totals.scheduledMin, {
      kind: "scheduled"
    });
    this.renderStatRow(table, "Unscheduled", totals.unscheduledMin, {
      kind: "unscheduled"
    });
    if (planned > workdayMin) {
      this.renderStatRow(table, "Overbooked", planned - workdayMin);
      const cells = Array.from(table.children);
      cells.slice(-2).forEach((el) => el.classList.add("dp-st-danger"));
    }
    const freeTotal = morningOpen + workOpen + eveningOpen;
    table.createDiv({ cls: "dp-st-row-divider" });
    this.renderStatRow(table, "Free Time", freeTotal, { kind: "free" });
    this.renderStatRow(table, `Morning (${morningRange})`, morningOpen, {
      indent: true
    });
    this.renderStatRow(table, `Workday (${workRange})`, workOpen, {
      indent: true
    });
    this.renderStatRow(table, `Evening (${eveningRange})`, eveningOpen, {
      indent: true
    });
    this.renderStatRow(table, "Sleep", sleepDurationMin, { kind: "sleep" });
    this.renderDayDotGrid(column, {
      scheduledMin: totals.scheduledMin,
      unscheduledMin: totals.unscheduledMin,
      freeMin: freeTotal,
      sleepMin: sleepDurationMin
    });
  }
  renderDayDotGrid(parent, parts) {
    const TOTAL_DOTS = 96;
    const MIN_PER_DOT = 1440 / TOTAL_DOTS;
    const order = [
      { key: "sleep", mins: parts.sleepMin },
      { key: "scheduled", mins: parts.scheduledMin },
      {
        key: "unscheduled",
        mins: Math.min(parts.unscheduledMin, parts.freeMin)
      },
      {
        key: "free",
        mins: Math.max(0, parts.freeMin - parts.unscheduledMin)
      }
    ];
    let used = 0;
    const counts = {
      sleep: 0,
      scheduled: 0,
      unscheduled: 0,
      free: 0
    };
    for (let i = 0; i < order.length; i++) {
      const isLast = i === order.length - 1;
      const raw = order[i].mins / MIN_PER_DOT;
      const n = isLast ? Math.max(0, TOTAL_DOTS - used) : Math.min(TOTAL_DOTS - used, Math.round(raw));
      counts[order[i].key] = n;
      used += n;
    }
    const grid = parent.createDiv({ cls: "dp-day-grid" });
    const sequence = [
      ["scheduled", counts.scheduled],
      ["unscheduled", counts.unscheduled],
      ["free", counts.free],
      ["sleep", counts.sleep]
    ];
    for (const [kind, n] of sequence) {
      for (let i = 0; i < n; i++) {
        grid.createSpan({ cls: `dp-day-dot dp-day-dot-${kind}` });
      }
    }
  }
  renderStatRow(table, label, mins, opts = {}) {
    const nameClasses = ["dp-st-name"];
    const valueClasses = ["dp-st-value"];
    if (opts.strong) {
      nameClasses.push("dp-st-strong");
      valueClasses.push("dp-st-strong");
    }
    if (opts.indent)
      nameClasses.push("dp-st-indent");
    if (opts.kind) {
      const k = `dp-st-kind-${opts.kind}`;
      nameClasses.push(k);
      valueClasses.push(k);
    }
    table.createSpan({ cls: nameClasses.join(" "), text: label });
    table.createSpan({ cls: valueClasses.join(" "), text: formatTotal(mins) });
  }
  renderProjectTable(parent, tasks, colorMap) {
    var _a;
    const projects = /* @__PURE__ */ new Map();
    let unassignedMin = 0;
    for (const t of tasks) {
      if (!t.project) {
        unassignedMin += t.durationMin;
        continue;
      }
      let agg = projects.get(t.project);
      if (!agg) {
        agg = { total: 0, subs: /* @__PURE__ */ new Map() };
        projects.set(t.project, agg);
      }
      agg.total += t.durationMin;
      if (t.subproject) {
        agg.subs.set(
          t.subproject,
          ((_a = agg.subs.get(t.subproject)) != null ? _a : 0) + t.durationMin
        );
      }
    }
    if (projects.size === 0 && unassignedMin === 0)
      return;
    const sorted = [...projects.entries()].sort(
      (a, b) => b[1].total - a[1].total || a[0].localeCompare(b[0])
    );
    const column = parent.createDiv({ cls: "dp-stat-col" });
    const table = column.createDiv({ cls: "dp-stat-table" });
    table.createSpan({ cls: "dp-st-h", text: "Project" });
    table.createSpan({ cls: "dp-st-h dp-st-h-right", text: "Planned" });
    for (const [name, agg] of sorted) {
      const nameCell = table.createDiv({ cls: "dp-st-name" });
      const swatch = nameCell.createSpan({ cls: "dp-st-swatch" });
      const color = colorMap.get(name);
      if (color)
        swatch.style.backgroundColor = color;
      const projIconName = this.resolveProjectIcon(name);
      if (projIconName) {
        const ic = nameCell.createSpan({ cls: "dp-st-project-icon" });
        (0, import_obsidian5.setIcon)(ic, projIconName);
      }
      nameCell.createSpan({ text: name });
      if (agg.subs.size > 0) {
        const subs = [...agg.subs.entries()].sort(
          (a, b) => b[1] - a[1] || a[0].localeCompare(b[0])
        );
        const breakdown = subs.map(([sub, mins]) => `${sub} ${formatCompactDuration(mins)}`).join(", ");
        nameCell.createSpan({
          cls: "dp-st-subprojects",
          text: ` (${breakdown})`
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
        text: formatTotal(unassignedMin)
      });
    }
    this.renderProjectDotGrid(column, sorted, unassignedMin, colorMap);
  }
  renderProjectDotGrid(parent, sorted, unassignedMin, colorMap) {
    const MIN_PER_DOT = 15;
    const dots = [];
    for (const [name, agg] of sorted) {
      if (agg.total <= 0)
        continue;
      const n = Math.max(1, Math.round(agg.total / MIN_PER_DOT));
      const color = colorMap.get(name);
      for (let i = 0; i < n; i++)
        dots.push({ kind: "project", color });
    }
    if (unassignedMin > 0) {
      const n = Math.max(1, Math.round(unassignedMin / MIN_PER_DOT));
      for (let i = 0; i < n; i++)
        dots.push({ kind: "unassigned" });
    }
    if (dots.length === 0)
      return;
    const grid = parent.createDiv({ cls: "dp-day-grid dp-project-grid" });
    for (const dot of dots) {
      const el = grid.createSpan({
        cls: dot.kind === "unassigned" ? "dp-day-dot dp-day-dot-unassigned" : "dp-day-dot dp-day-dot-project"
      });
      if (dot.kind === "project" && dot.color) {
        el.style.backgroundColor = dot.color;
      }
    }
  }
  formatBlockTime(task) {
    if (task.startMin === null)
      return "";
    const start = task.startMin;
    const end = start + task.durationMin;
    return `${this.fmtClock(start)}\u2013${this.fmtClock(end)} (${formatTotal(task.durationMin)})`;
  }
  positionNowLine(el) {
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
  refreshNowLines() {
    const lines = this.containerEl.querySelectorAll(".dp-now-line");
    lines.forEach((el) => this.positionNowLine(el));
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
    var _a, _b;
    const p = this.plugin.settings.prefixes;
    let out = body.replace(new RegExp(`#${p.duration}\\/\\S+`, "g"), "").replace(new RegExp(`#${p.time}\\/\\S+`, "g"), "").replace(new RegExp(`#${p.order}\\/\\d+`, "g"), "").replace(new RegExp(`#${p.project}\\/[\\w-]+(?:\\/[\\w-]+)?`, "g"), "").replace(new RegExp(`#${p.exercise}\\/\\S+`, "g"), "").replace(new RegExp(`#${p.actual}\\/\\S+`, "g"), "").replace(new RegExp(`#${p.taskId}\\/[A-Za-z0-9]+\\b`, "g"), "").replace(new RegExp(`#${p.taskContext}\\/[\\w-]+`, "g"), "").replace(/\{[^{}]*\}/g, "");
    for (const ctx of this.plugin.settings.contextTags) {
      const tag = (_a = ctx.tag) == null ? void 0 : _a.trim();
      if (!tag)
        continue;
      const esc = tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      out = out.replace(new RegExp(`#${esc}(?![\\w/-])`, "gi"), "");
    }
    const noteTag = (_b = this.plugin.settings.noteTag) == null ? void 0 : _b.trim();
    if (noteTag) {
      const esc = noteTag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      out = out.replace(new RegExp(`#${esc}(?![\\w/-])`, "gi"), "");
    }
    return out.replace(/\s+/g, " ").trim();
  }
  // Detects the configured note tag on a task body. Notes are events the
  // user wants pinned to a specific time without occupying a calendar block.
  isNoteTask(task) {
    var _a;
    const tag = (_a = this.plugin.settings.noteTag) == null ? void 0 : _a.trim();
    if (!tag)
      return false;
    const esc = tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`#${esc}(?![\\w/-])`, "i").test(task.body);
  }
  // Returns the first configured context tag whose `#<tag>` appears in the
  // task body, matching whole-tag (not as a prefix of another tag). Order
  // follows the user's settings list so they can prioritise.
  findContextTag(task) {
    var _a;
    const tags = this.plugin.settings.contextTags;
    if (!tags || tags.length === 0)
      return null;
    for (const ctx of tags) {
      const tag = (_a = ctx.tag) == null ? void 0 : _a.trim();
      if (!tag)
        continue;
      const esc = tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      if (new RegExp(`#${esc}(?![\\w/-])`, "i").test(task.body))
        return ctx;
    }
    return null;
  }
  resolveProjectIcon(project) {
    var _a;
    if (!project)
      return null;
    for (const pc of this.plugin.settings.projectColors) {
      if (pc.icon && ((_a = pc.project) == null ? void 0 : _a.toLowerCase()) === project.toLowerCase()) {
        return pc.icon;
      }
    }
    return null;
  }
  endOfTitleCh(rawLine) {
    const p = this.plugin.settings.prefixes;
    const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(
      `#(?:${esc(p.duration)}|${esc(p.time)}|${esc(p.order)}|${esc(p.project)}|${esc(p.exercise)})\\/`
    );
    const m = re.exec(rawLine);
    const cutoff = m ? m.index : rawLine.length;
    let end = cutoff;
    while (end > 0 && /\s/.test(rawLine[end - 1]))
      end--;
    return end;
  }
  // External-entry-point counterpart to openTaskEditor: callers from other
  // views (e.g. the multi-day grid) pass the task's day so the move-picker /
  // calendar inside the modal anchor to the right reference date instead of
  // whatever day this view happens to be showing.
  openTaskEditorForDay(file, task, date) {
    this.selectedDate = startOfDay(date);
    this.calendarMonth = startOfMonth(this.selectedDate);
    this.openTaskEditor(file, task);
  }
  // External-entry-point counterpart to createTaskAtTime: lets the multi-day
  // grid open the same "new task at HH:MM" modal a daily-view gutter click
  // would, anchored to the clicked day so subsequent date pickers default
  // correctly.
  createTaskAtTimeForDay(file, date, startMin) {
    this.selectedDate = startOfDay(date);
    this.calendarMonth = startOfMonth(this.selectedDate);
    this.createTaskAtTime(
      file,
      startMin,
      this.plugin.settings.defaultDurationMin
    );
  }
  openTaskEditor(file, task) {
    var _a;
    const prefixes = this.plugin.settings.prefixes;
    const initialProjectFull = task.project ? task.subproject ? `${task.project}/${task.subproject}` : task.project : null;
    new TaskEditModal(this.app, {
      mode: "edit",
      modalTitle: "Edit task",
      initialTitle: this.cleanBody(task.body),
      initialDescription: (_a = task.description) != null ? _a : "",
      initialDurationMin: task.durationMin,
      initialProject: initialProjectFull,
      initialChecked: task.checked,
      initialTags: task.tags,
      availableTags: this.collectContextTagNames(),
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
      peopleFolder: this.plugin.settings.peopleFolder,
      visibleStartHour: this.plugin.settings.visibleStartHour,
      visibleEndHour: this.plugin.settings.visibleEndHour,
      quickDurationsMin: this.plugin.settings.quickDurationsMin,
      cleanBody: (body) => this.cleanBody(body),
      onSave: (title, description, durationMin, project, checked, tags) => {
        void this.applyTaskEdit(
          file,
          task,
          title,
          description,
          durationMin,
          project,
          checked,
          tags
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
      onSetSubtaskDuration: async (sub, durationMin) => {
        await this.applySubtaskDuration(file, sub.lineNumber, durationMin);
      },
      onDeleteSubtask: async (sub) => {
        await this.applyDeleteSubtask(file, sub.lineNumber);
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
        onPick: (d) => this.moveTaskWholeToDate(file, task, d)
      },
      onStartPomodoro: () => this.enterPomodoro(file, task),
      onDelete: () => this.deleteTaskLines(file, task),
      onUnschedule: () => this.unscheduleTask(file, task),
      onDuplicate: (includeSubtasks) => this.duplicateTask(file, task, includeSubtasks),
      hasSubtasks: task.subtasks.length > 0
    }).open();
  }
  // Removes the task's parent line and all of its sub-task lines from `file`.
  // Highest line number first so earlier indices stay valid as we splice.
  async deleteTaskLines(file, task) {
    const lineNumbers = [
      task.lineNumber,
      ...task.subtasks.map((s) => s.lineNumber)
    ].sort((a, b) => b - a);
    await this.app.vault.process(file, (content) => {
      const lines = content.split("\n");
      for (const n of lineNumbers) {
        if (n < lines.length)
          lines.splice(n, 1);
      }
      return lines.join("\n");
    });
    new import_obsidian5.Notice("Task deleted");
  }
  // Inserts a copy of the task line (and optionally its sub-tasks) directly
  // under the existing block. Strips any `#tid/<id>` tag from the copies so
  // task IDs stay unique — the duplicate stays untagged until the user edits
  // it (or another flow re-assigns one).
  async duplicateTask(file, task, includeSubtasks) {
    const prefixes = this.plugin.settings.prefixes;
    const escTid = prefixes.taskId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const tidRe = new RegExp(`\\s*#${escTid}\\/[A-Za-z0-9]+\\b`, "g");
    const stripTid = (line) => line.replace(tidRe, "").replace(/[ \t]+$/, "");
    await this.app.vault.process(file, (content) => {
      const lines = content.split("\n");
      if (task.lineNumber >= lines.length)
        return content;
      const subNums = task.subtasks.map((s) => s.lineNumber).filter((n) => n < lines.length).sort((a, b) => a - b);
      const lastIdx = subNums.length > 0 ? subNums[subNums.length - 1] : task.lineNumber;
      const copyBlock = [stripTid(lines[task.lineNumber])];
      if (includeSubtasks) {
        for (const n of subNums)
          copyBlock.push(stripTid(lines[n]));
      }
      lines.splice(lastIdx + 1, 0, ...copyBlock);
      return lines.join("\n");
    });
    new import_obsidian5.Notice(
      includeSubtasks ? "Task duplicated (with sub-tasks)" : "Task duplicated"
    );
  }
  // Strips the `#t/` time tag from the task's parent line. The modal closes
  // afterwards; the caller (Today view) re-renders on file modify, dropping
  // the now-untimed task into the unscheduled list.
  async unscheduleTask(file, task) {
    const prefixes = this.plugin.settings.prefixes;
    await this.app.vault.process(file, (content) => {
      const lines = content.split("\n");
      if (task.lineNumber >= lines.length)
        return content;
      lines[task.lineNumber] = removeTimeTag(lines[task.lineNumber], prefixes);
      return lines.join("\n");
    });
    new import_obsidian5.Notice("Unscheduled");
  }
  // Computes the date-picker entries for the edit modal's "Move" button:
  // tomorrow, +2 days, +3 days, and the first day of next week (driven by
  // habitWeekStart). The `next week` entry is dropped when its date already
  // appears as one of the next-3-days. All offsets are relative to the
  // currently-viewed day, so opening the modal on a future-dated note pushes
  // tasks forward from there rather than from real today.
  buildMoveChoices(file, task) {
    const sel = startOfDay(this.selectedDate);
    const weekStart = this.plugin.settings.habitWeekStart;
    const day1 = addDays(sel, 1);
    const day2 = addDays(sel, 2);
    const day3 = addDays(sel, 3);
    const offset = (weekStart - sel.getDay() + 7) % 7 || 7;
    const nextWeek = addDays(sel, offset);
    const dayLabel = (d) => d.toLocaleDateString(void 0, { weekday: "short" });
    const choices = [
      {
        label: "tomorrow",
        hotkey: "1",
        onChoose: () => this.moveTaskWholeToDate(file, task, day1)
      },
      {
        label: dayLabel(day2),
        hotkey: "2",
        onChoose: () => this.moveTaskWholeToDate(file, task, day2)
      },
      {
        label: dayLabel(day3),
        hotkey: "3",
        onChoose: () => this.moveTaskWholeToDate(file, task, day3)
      }
    ];
    const nextWeekIsDup = sameDay(nextWeek, day1) || sameDay(nextWeek, day2) || sameDay(nextWeek, day3);
    if (!nextWeekIsDup) {
      choices.push({
        label: "next week",
        hotkey: "4",
        onChoose: () => this.moveTaskWholeToDate(file, task, nextWeek)
      });
    }
    return choices;
  }
  // Moves a task line (and its sub-task lines) from `file` to the daily note
  // for `targetDate`. No-op if source and target are the same file.
  // Returns true on success.
  async moveTaskWholeToDate(file, task, targetDate) {
    const fallback = {
      folder: this.plugin.settings.dailyNoteFolderFallback,
      format: this.plugin.settings.dailyNoteFormatFallback,
      template: this.plugin.settings.dailyNoteTemplate,
      templatesByDay: this.plugin.settings.dailyNoteTemplatesByDay,
      dateLinkFormat: this.plugin.settings.dateLinkFormat,
      prefixes: this.plugin.settings.prefixes,
      quotesFile: this.plugin.settings.quotesFile,
      addCreatedTag: this.plugin.settings.addCreatedTagToFrontmatter
    };
    return moveTaskBetweenDailyNotes(
      this.app,
      file,
      task,
      targetDate,
      fallback
    );
  }
  // Carries the task title (with most tags) and any unfinished sub-tasks into
  // the daily note for `targetDate`, while keeping the completed sub-tasks on
  // the source day as a record of partial progress. The source parent is
  // checked off and stamped with a #tid/<id> tag; the new-day copy gets the
  // same tag, so the two can be cross-referenced via search. The order tag
  // (#o/) is stripped on the new copy because positioning is per-day.
  async migrateIncompleteToDate(file, task, targetDate) {
    var _a;
    const fallback = {
      folder: this.plugin.settings.dailyNoteFolderFallback,
      format: this.plugin.settings.dailyNoteFormatFallback,
      template: this.plugin.settings.dailyNoteTemplate,
      templatesByDay: this.plugin.settings.dailyNoteTemplatesByDay,
      dateLinkFormat: this.plugin.settings.dateLinkFormat,
      prefixes: this.plugin.settings.prefixes,
      quotesFile: this.plugin.settings.quotesFile,
      addCreatedTag: this.plugin.settings.addCreatedTagToFrontmatter
    };
    const targetFile = await ensureDailyNote(this.app, targetDate, fallback);
    if (targetFile.path === file.path) {
      new import_obsidian5.Notice("Source and target are the same file.");
      return false;
    }
    const prefixes = this.plugin.settings.prefixes;
    const fresh = parseFileTasks(
      file.path,
      await this.app.vault.read(file),
      prefixes,
      this.plugin.settings.defaultDurationMin
    );
    let current = (_a = fresh.find((t) => t.lineNumber === task.lineNumber)) != null ? _a : fresh.find((t) => this.cleanBody(t.body) === this.cleanBody(task.body));
    if (!current) {
      new import_obsidian5.Notice("Couldn't locate the task to migrate.");
      return false;
    }
    const existingId = parseTaskId(current.body, prefixes);
    const taskId = existingId != null ? existingId : generateTaskId(this.plugin.settings.taskIdLength);
    const orderRe = new RegExp(
      `\\s*#${prefixes.order.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\/\\d+\\b`
    );
    let newParentLine = current.rawLine.replace(orderRe, "");
    newParentLine = setTaskChecked(newParentLine, false);
    newParentLine = setTaskIdTag(newParentLine, taskId, prefixes);
    const uncheckedSubLines = current.subtasks.filter((s) => !s.checked).map((s) => s.rawLine);
    await this.app.vault.process(file, (content) => {
      const lines = content.split("\n");
      if (current.lineNumber < lines.length) {
        let parent = lines[current.lineNumber];
        parent = setTaskChecked(parent, true);
        parent = setTaskIdTag(parent, taskId, prefixes);
        lines[current.lineNumber] = parent;
      }
      const removeNumbers = current.subtasks.filter((s) => !s.checked).map((s) => s.lineNumber).sort((a, b) => b - a);
      for (const n of removeNumbers) {
        if (n < lines.length)
          lines.splice(n, 1);
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
    new import_obsidian5.Notice(`Migrated to ${targetFile.path}`);
    return true;
  }
  // Inserts a new sub-task line below the parent's existing sub-tasks (or
  // directly below the parent if none exist). Re-parses on each call so
  // line numbers stay correct across multiple additions in one session.
  async appendSubtask(file, task, text) {
    const trimmed = text.trim();
    if (!trimmed)
      return null;
    let inserted = null;
    await this.app.vault.process(file, (content) => {
      var _a, _b;
      const lines = content.split("\n");
      const fresh = parseFileTasks(
        file.path,
        content,
        this.plugin.settings.prefixes,
        this.plugin.settings.defaultDurationMin
      ).find((t) => t.lineNumber === task.lineNumber);
      if (!fresh)
        return content;
      const insertAt = fresh.subtasks.length > 0 ? fresh.subtasks[fresh.subtasks.length - 1].lineNumber + 1 : fresh.lineNumber + 1;
      const subIndent = fresh.subtasks.length > 0 ? (_b = (_a = /^(\s*)/.exec(fresh.subtasks[fresh.subtasks.length - 1].rawLine)) == null ? void 0 : _a[1]) != null ? _b : fresh.indent + "	" : fresh.indent + "	";
      const newLine = `${subIndent}- [ ] ${trimmed}`;
      lines.splice(insertAt, 0, newLine);
      inserted = {
        lineNumber: insertAt,
        rawLine: newLine,
        text: trimmed,
        checked: false
      };
      return lines.join("\n");
    });
    return inserted;
  }
  collectProjectNames() {
    var _a, _b;
    const prefix = `#${this.plugin.settings.prefixes.project}/`.toLowerCase();
    const names = /* @__PURE__ */ new Set();
    const cache = this.app.metadataCache;
    const tags = (_b = (_a = cache.getTags) == null ? void 0 : _a.call(cache)) != null ? _b : {};
    for (const tag of Object.keys(tags)) {
      if (tag.toLowerCase().startsWith(prefix)) {
        const name = tag.slice(prefix.length);
        if (name)
          names.add(name);
      }
    }
    for (const pc of this.plugin.settings.projectColors) {
      if (pc.project)
        names.add(pc.project);
    }
    return Array.from(names).sort((a, b) => a.localeCompare(b));
  }
  // Mirror of collectProjectNames for the `#tc/<slug>` tag space — feeds the
  // edit-modal tag picker so the user gets autocomplete on labels they've
  // already used elsewhere.
  collectContextTagNames() {
    var _a, _b;
    const prefix = `#${this.plugin.settings.prefixes.taskContext}/`.toLowerCase();
    const names = /* @__PURE__ */ new Set();
    const cache = this.app.metadataCache;
    const tags = (_b = (_a = cache.getTags) == null ? void 0 : _a.call(cache)) != null ? _b : {};
    for (const tag of Object.keys(tags)) {
      if (tag.toLowerCase().startsWith(prefix)) {
        const name = tag.slice(prefix.length);
        if (name && /^[\w-]+$/.test(name))
          names.add(name);
      }
    }
    return Array.from(names).sort((a, b) => a.localeCompare(b));
  }
  // Walks every markdown file in the vault, parses its tasks, and returns
  // one entry per unique (case-insensitive) title — the most recently
  // modified file wins ties. Feeds the title-input autocomplete on the
  // new/edit task modal so the user can re-pick a prior task by name and
  // have its project / duration / description / tags / sub-tasks pre-filled.
  // Reads via `cachedRead` so it's cheap on warm caches.
  async collectPriorTaskSuggestions() {
    var _a;
    const settings = this.plugin.settings;
    const prefixes = settings.prefixes;
    const files = this.app.vault.getMarkdownFiles();
    files.sort((a, b) => b.stat.mtime - a.stat.mtime);
    const seen = /* @__PURE__ */ new Set();
    const out = [];
    for (const file of files) {
      let content;
      try {
        content = await this.app.vault.cachedRead(file);
      } catch (e) {
        continue;
      }
      const tasks = parseFileTasks(
        file.path,
        content,
        prefixes,
        settings.defaultDurationMin
      );
      for (const t of tasks) {
        const title = this.cleanBody(t.body);
        if (!title)
          continue;
        const key = title.toLowerCase();
        if (seen.has(key))
          continue;
        seen.add(key);
        const project = t.project ? t.subproject ? `${t.project}/${t.subproject}` : t.project : null;
        const subtaskRawLines = t.subtasks.map((sub) => {
          const m = /^\s*-\s*\[[^\]]\]\s*(.*)$/.exec(sub.rawLine);
          const text = m ? m[1] : sub.text;
          return `	- [ ] ${text}`;
        });
        out.push({
          title,
          project,
          description: (_a = t.description) != null ? _a : "",
          durationMin: t.hasExplicitDuration ? t.durationMin : null,
          tags: [...t.tags],
          subtaskRawLines
        });
      }
    }
    return out;
  }
  async applyTaskEdit(file, task, newTitle, newDescription, newDurationMin, newProject, newChecked, newTags) {
    const prefixes = this.plugin.settings.prefixes;
    await this.app.vault.process(file, (content) => {
      const lines = content.split("\n");
      if (task.lineNumber >= lines.length)
        return content;
      let updated = setTaskTitle(lines[task.lineNumber], newTitle, prefixes);
      if (newDescription !== null) {
        updated = setTaskDescription(updated, newDescription, prefixes);
      }
      if (newDurationMin !== null) {
        updated = setDurationTag(updated, newDurationMin, prefixes);
      }
      if (newProject !== void 0) {
        updated = newProject ? setProjectTag(updated, newProject, prefixes) : removeProjectTag(updated, prefixes);
      }
      if (newChecked !== null) {
        updated = setTaskChecked(updated, newChecked);
      }
      if (newTags !== null) {
        updated = setTaskContextTags(updated, newTags, prefixes);
      }
      lines[task.lineNumber] = updated;
      return lines.join("\n");
    });
  }
  async applyLineChecked(file, lineNumber, checked) {
    await this.app.vault.process(file, (content) => {
      const lines = content.split("\n");
      if (lineNumber >= lines.length)
        return content;
      lines[lineNumber] = setTaskChecked(lines[lineNumber], checked);
      return lines.join("\n");
    });
  }
  // Builds the per-habit completion state for the displayed daily note. Daily
  // habits look only at the displayed note's content (already in hand);
  // weekly/monthly habits scan all daily notes in the corresponding period
  // around the displayed date via the shared scanner cache.
  async loadHabitDisplays(displayDate, displayContent, fallback) {
    const settings = this.plugin.settings;
    const habitsFile = this.app.vault.getAbstractFileByPath(settings.habitsFile);
    if (!(habitsFile instanceof import_obsidian5.TFile))
      return [];
    const habitsContent = await this.plugin.habitsScanner.getContent(habitsFile);
    const habits = parseHabitsFile(habitsContent, settings.habitPrefix);
    if (habits.length === 0)
      return [];
    const week = weekRange(displayDate, settings.habitWeekStart);
    const month = monthRange(displayDate);
    const readWindowFiles = async (start, end) => {
      const out2 = [];
      for (const d of enumerateDailyNoteDatesInRange(start, end)) {
        const c = await this.plugin.habitsScanner.readDateContent(d, fallback);
        if (c)
          out2.push(c);
      }
      return out2;
    };
    const needWeek = habits.some((h) => h.period === "week");
    const needMonth = habits.some((h) => h.period === "month");
    const weekFiles = needWeek ? await readWindowFiles(week.start, week.end) : [];
    const monthFiles = needMonth ? await readWindowFiles(month.start, month.end) : [];
    const out = [];
    for (const h of habits) {
      const files = h.period === "day" ? [displayContent] : h.period === "week" ? weekFiles : monthFiles;
      let checkedCount = 0;
      let maxPerFile = 0;
      for (const c of files) {
        const lines = findHabitTaskLines(
          c,
          settings.habitPrefix,
          h.slug
        );
        for (const l of lines)
          if (l.checked)
            checkedCount += l.count;
        if (lines.length > maxPerFile)
          maxPerFile = lines.length;
      }
      const displayLines = findHabitTaskLines(
        displayContent,
        settings.habitPrefix,
        h.slug
      );
      const checkedOnDisplayedDate = displayLines.some((l) => l.checked);
      out.push({
        habit: h,
        checkedCount,
        isComplete: checkedCount >= h.target,
        checkedOnDisplayedDate,
        hasDuplicate: h.target === 1 && maxPerFile > 1,
        maxPerFile
      });
    }
    return out;
  }
  renderHabitsLine(parent, displays, displayFile) {
    if (displays.length === 0)
      return;
    const settings = this.plugin.settings;
    const wrap = parent.createDiv({ cls: "dp-habits" });
    const periods = ["day", "week", "month"];
    const groups = {
      day: [],
      week: [],
      month: []
    };
    for (const d of displays)
      groups[d.habit.period].push(d);
    let firstSegment = true;
    for (const period of periods) {
      const items = groups[period];
      if (items.length === 0)
        continue;
      const visible = items.filter((i) => {
        if (settings.habitsHideCompleted)
          return !i.isComplete;
        return !i.isComplete || i.checkedOnDisplayedDate;
      });
      if (!firstSegment) {
        wrap.createSpan({ cls: "dp-habit-sep", text: " \u2022 " });
      }
      firstSegment = false;
      const labelText = period === "day" ? "d:" : period === "week" ? "w:" : "m:";
      wrap.createSpan({ cls: "dp-habit-period", text: labelText });
      wrap.appendText(" ");
      if (visible.length === 0) {
        wrap.createSpan({ cls: "dp-habit-allcomplete", text: "\u2713" });
        continue;
      }
      visible.forEach((d, idx) => {
        if (idx > 0)
          wrap.appendText(", ");
        const cls = "dp-habit" + (d.isComplete ? " is-done" : "") + (d.hasDuplicate ? " has-dup" : "");
        const chip = wrap.createSpan({ cls });
        chip.createSpan({ cls: "dp-habit-name", text: d.habit.slug });
        if (d.habit.target > 1) {
          chip.createSpan({
            cls: "dp-habit-progress",
            text: ` ${d.checkedCount}/${d.habit.target}`
          });
        }
        if (d.hasDuplicate) {
          chip.createSpan({
            cls: "dp-habit-dup",
            text: `\xB7${d.maxPerFile}`
          });
        }
        const tooltipParts = [];
        if (d.habit.label)
          tooltipParts.push(d.habit.label);
        if (d.habit.target > 1) {
          tooltipParts.push(
            `Target ${d.habit.target}\xD7 per ${d.habit.period}`
          );
        }
        if (d.hasDuplicate) {
          tooltipParts.push(
            `${d.maxPerFile} task lines for this habit in one daily note \u2014 clean up duplicates by hand`
          );
        }
        if (tooltipParts.length > 0)
          chip.title = tooltipParts.join("\n");
        chip.addEventListener("click", (ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          void this.applyHabitToggle(displayFile, d.habit.slug);
        });
      });
    }
    if (!firstSegment) {
      wrap.appendText("  ");
      const stats = wrap.createEl("a", {
        cls: "dp-habit-stats-link",
        text: "[stats]",
        attr: { href: "#" }
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
  async applyHabitToggle(file, slug) {
    const settings = this.plugin.settings;
    const fallback = {
      folder: settings.dailyNoteFolderFallback,
      format: settings.dailyNoteFormatFallback,
      template: settings.dailyNoteTemplate,
      templatesByDay: settings.dailyNoteTemplatesByDay,
      dateLinkFormat: settings.dateLinkFormat,
      prefixes: settings.prefixes,
      quotesFile: settings.quotesFile,
      addCreatedTag: settings.addCreatedTagToFrontmatter
    };
    const target = file ? file : await ensureDailyNote(this.app, this.selectedDate, fallback);
    await this.app.vault.process(
      target,
      (content) => toggleHabitOnContent(content, settings.habitPrefix, slug)
    );
    this.plugin.habitsScanner.invalidate(target.path);
  }
  isPopout() {
    var _a;
    const win = (_a = this.containerEl.ownerDocument) == null ? void 0 : _a.defaultView;
    return !!win && win !== window;
  }
  async popOutLeaf() {
    await this.app.workspace.moveLeafToPopout(this.leaf);
  }
  // Move this view back to the main Obsidian window. Pomodoro state and the
  // selected date are transferred to the new view instance so the session
  // doesn't reset on the trip back.
  async returnLeafToMain() {
    var _a;
    const pomo = this.pomodoroState;
    const selectedDate = this.selectedDate;
    let target = null;
    for (const leaf of this.app.workspace.getLeavesOfType(VIEW_TYPE_TODAY)) {
      const win = (_a = leaf.view.containerEl.ownerDocument) == null ? void 0 : _a.defaultView;
      if (win === window) {
        target = leaf;
        break;
      }
    }
    if (!target)
      target = this.app.workspace.getRightLeaf(false);
    if (!target)
      return;
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
  adoptPomodoroState(state) {
    this.pomodoroState = state;
    if (this.pomodoroTickHandle === null) {
      this.pomodoroTickHandle = window.setInterval(
        () => this.scheduleRender(),
        1e3
      );
      this.registerInterval(this.pomodoroTickHandle);
    }
  }
  enterPomodoro(file, task) {
    this.pomodoroState = {
      filePath: file.path,
      taskLineNumber: task.lineNumber,
      taskBodySnapshot: this.cleanBody(task.body),
      startedAt: Date.now(),
      phase: "work",
      paused: !this.plugin.settings.pomodoroAutoStart,
      pausedRemainingMs: this.plugin.settings.pomodoroAutoStart ? null : this.plugin.settings.pomodoroWorkMin * 6e4,
      actualMs: 0,
      workPhaseBankedMs: 0
    };
    this.pomodoroHidden = false;
    this.pomodoroSubtaskHistory = [];
    if (this.pomodoroTickHandle === null) {
      this.pomodoroTickHandle = window.setInterval(
        () => this.scheduleRender(),
        1e3
      );
      this.registerInterval(this.pomodoroTickHandle);
    }
    this.scheduleRender();
  }
  exitPomodoro() {
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
  async exitPomodoroWithCommit() {
    const state = this.pomodoroState;
    if (!state)
      return;
    this.bankWorkProgress();
    const minutes = Math.floor(state.actualMs / 6e4);
    if (minutes > 0) {
      const file = this.app.vault.getAbstractFileByPath(state.filePath);
      if (file instanceof import_obsidian5.TFile) {
        try {
          const content = await this.app.vault.read(file);
          const tasks = parseFileTasks(
            file.path,
            content,
            this.plugin.settings.prefixes,
            this.plugin.settings.defaultDurationMin
          );
          let task = tasks.find((t) => t.lineNumber === state.taskLineNumber);
          if (!task) {
            task = tasks.find(
              (t) => this.cleanBody(t.body) === state.taskBodySnapshot
            );
          }
          if (task) {
            const nextSub = task.subtasks.find((s) => !s.checked);
            const target = nextSub ? nextSub.lineNumber : task.lineNumber;
            await this.commitActualTime(file, target);
          }
        } catch (e) {
          new import_obsidian5.Notice(`Today: failed to write actual time (${e.message})`);
        }
      }
    }
    this.exitPomodoro();
  }
  // Returns ms elapsed in the current phase, clamped to the phase length.
  // Honors the paused/running anchor used elsewhere in the timer math.
  currentPhaseElapsedMs() {
    var _a;
    const state = this.pomodoroState;
    if (!state)
      return 0;
    const phaseMin = state.phase === "work" ? this.plugin.settings.pomodoroWorkMin : this.plugin.settings.pomodoroBreakMin;
    const phaseMs = phaseMin * 6e4;
    if (state.paused) {
      const remain = (_a = state.pausedRemainingMs) != null ? _a : phaseMs;
      return Math.max(0, Math.min(phaseMs, phaseMs - remain));
    }
    return Math.max(0, Math.min(phaseMs, Date.now() - state.startedAt));
  }
  // Folds any work-phase progress that has not yet been counted into actualMs.
  // Safe to call any time; only adds the delta since the last bank.
  bankWorkProgress() {
    const state = this.pomodoroState;
    if (!state || state.phase !== "work")
      return;
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
  async commitActualTime(file, lineNumber) {
    const state = this.pomodoroState;
    if (!state)
      return;
    this.bankWorkProgress();
    const minutes = Math.floor(state.actualMs / 6e4);
    if (minutes <= 0)
      return;
    const prefixes = this.plugin.settings.prefixes;
    await this.app.vault.process(file, (content) => {
      const lines = content.split("\n");
      if (lineNumber >= lines.length)
        return content;
      lines[lineNumber] = addActualTimeTag(lines[lineNumber], minutes, prefixes);
      return lines.join("\n");
    });
    state.actualMs = 0;
  }
  // Returns true if the pomodoro UI handled the render, false if the caller
  // should fall through to the normal timeline render (task gone, etc.).
  async renderPomodoro(root) {
    const state = this.pomodoroState;
    if (!state)
      return false;
    const file = this.app.vault.getAbstractFileByPath(state.filePath);
    if (!(file instanceof import_obsidian5.TFile)) {
      this.exitPomodoro();
      return false;
    }
    const content = await this.app.vault.read(file);
    const tasks = parseFileTasks(
      file.path,
      content,
      this.plugin.settings.prefixes,
      this.plugin.settings.defaultDurationMin
    );
    let task = tasks.find((t) => t.lineNumber === state.taskLineNumber);
    if (!task || this.cleanBody(task.body) !== state.taskBodySnapshot) {
      task = tasks.find(
        (t) => this.cleanBody(t.body) === state.taskBodySnapshot
      );
      if (task)
        state.taskLineNumber = task.lineNumber;
    }
    if (!task) {
      this.exitPomodoro();
      return false;
    }
    const workMs = this.plugin.settings.pomodoroWorkMin * 6e4;
    const breakMs = this.plugin.settings.pomodoroBreakMin * 6e4;
    const phaseMs = state.phase === "work" ? workMs : breakMs;
    let remainingMs;
    if (state.paused && state.pausedRemainingMs !== null) {
      remainingMs = state.pausedRemainingMs;
    } else {
      remainingMs = phaseMs - (Date.now() - state.startedAt);
    }
    if (remainingMs <= 0 && !state.paused) {
      this.bankWorkProgress();
      if (this.plugin.settings.pomodoroAutoCycle) {
        const nextPhase = state.phase === "work" ? "rest" : "work";
        new import_obsidian5.Notice(nextPhase === "rest" ? "Break time" : "Back to focus");
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
    if (!root.hasAttribute("tabindex"))
      root.setAttribute("tabindex", "-1");
    const wrap = root.createDiv({ cls: "dp-pomo" });
    const topBar = wrap.createDiv({ cls: "dp-pomo-topbar" });
    const editTask = topBar.createEl("button", {
      cls: "dp-pomo-iconbtn",
      attr: { "aria-label": "Edit task" }
    });
    (0, import_obsidian5.setIcon)(editTask, "pencil");
    editTask.addEventListener("click", () => {
      this.openTaskEditor(file, task);
    });
    const showTimeline = topBar.createEl("button", {
      cls: "dp-pomo-iconbtn",
      attr: { "aria-label": "Show timeline" }
    });
    (0, import_obsidian5.setIcon)(showTimeline, "list");
    showTimeline.addEventListener("click", () => {
      this.pomodoroHidden = true;
      this.scheduleRender();
    });
    const popout = topBar.createEl("button", {
      cls: "dp-pomo-iconbtn",
      attr: {
        "aria-label": this.isPopout() ? "Return to main window" : "Open in new window"
      }
    });
    (0, import_obsidian5.setIcon)(popout, this.isPopout() ? "monitor" : "picture-in-picture-2");
    popout.addEventListener("click", () => {
      if (this.isPopout())
        void this.returnLeafToMain();
      else
        void this.popOutLeaf();
    });
    const exit = topBar.createEl("button", {
      cls: "dp-pomo-iconbtn",
      attr: { "aria-label": "Exit focus mode" }
    });
    (0, import_obsidian5.setIcon)(exit, "x");
    exit.addEventListener("click", () => void this.exitPomodoroWithCommit());
    wrap.createDiv({
      cls: "dp-pomo-phase",
      text: state.phase === "work" ? "Focus" : "Break"
    });
    const totalSec = Math.max(0, Math.ceil(remainingMs / 1e3));
    const mm = Math.floor(totalSec / 60);
    const ss = totalSec % 60;
    wrap.createDiv({
      cls: "dp-pomo-timer",
      text: `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`
    });
    wrap.createDiv({
      cls: "dp-pomo-title",
      text: this.cleanBody(task.body) || "(untitled)"
    });
    const nextSub = task.subtasks.find((s) => !s.checked);
    if (nextSub) {
      const card = wrap.createDiv({ cls: "dp-pomo-subtask" });
      card.createSpan({
        cls: "dp-pomo-subtask-check",
        attr: { "aria-hidden": "true" }
      });
      card.createSpan({
        cls: "dp-pomo-subtask-text",
        text: this.cleanBody(nextSub.text) || "(untitled)"
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
        text: "+ Add sub-task"
      });
      addBtn.type = "button";
      addBtn.addEventListener("click", () => {
        new SubtaskQuickAddModal(this.app, async (text) => {
          const sub = await this.appendSubtask(file, task, text);
          if (sub)
            this.scheduleRender();
          return sub !== null;
        }).open();
      });
    }
    const actions = wrap.createDiv({ cls: "dp-pomo-actions" });
    const expired = remainingMs <= 0 && state.paused;
    const pauseBtn = actions.createEl("button", {
      cls: "dp-pomo-pause-btn",
      text: expired ? state.phase === "work" ? "Start break" : "Start next pomo" : state.paused ? "Start" : "Pause"
    });
    pauseBtn.type = "button";
    pauseBtn.addEventListener("click", () => {
      var _a;
      if (expired) {
        this.bankWorkProgress();
        state.phase = state.phase === "work" ? "rest" : "work";
        state.startedAt = Date.now();
        state.paused = false;
        state.pausedRemainingMs = null;
        state.workPhaseBankedMs = 0;
      } else if (state.paused) {
        const remain = (_a = state.pausedRemainingMs) != null ? _a : phaseMs;
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
      text: "Complete"
    });
    completeBtn.type = "button";
    completeBtn.addEventListener("click", async () => {
      completeBtn.disabled = true;
      await this.commitActualTime(file, task.lineNumber);
      await this.applyLineChecked(file, task.lineNumber, true);
      this.exitPomodoro();
    });
    if (this.hintsVisible) {
      const overlay = wrap.createDiv({ cls: "dp-hints-overlay" });
      overlay.addEventListener("click", (ev) => {
        if (ev.target === overlay) {
          this.hintsVisible = false;
          this.scheduleRender();
        }
      });
      const hints = overlay.createDiv({ cls: "dp-pomo-hints is-visible" });
      const closeBtn = hints.createEl("button", {
        cls: "dp-hints-close",
        attr: { "aria-label": "Close" },
        text: "\xD7"
      });
      closeBtn.addEventListener("click", () => {
        this.hintsVisible = false;
        this.scheduleRender();
      });
      const addHint = (key, label) => {
        const item = hints.createSpan({ cls: "dp-pomo-hint" });
        item.createEl("kbd", { cls: "dp-pomo-kbd", text: key });
        item.createSpan({ cls: "dp-pomo-hint-label", text: label });
      };
      addHint("space", state.paused ? "start" : "pause");
      addHint("enter", nextSub ? "done sub-task" : "complete");
      if (this.pomodoroSubtaskHistory.length > 0)
        addHint("z", "undo");
      addHint("t", "timeline");
      addHint("p", this.isPopout() ? "return" : "pop out");
      addHint("x", "close");
      addHint("?", "toggle hints");
    }
    const doc = root.ownerDocument;
    const active = doc == null ? void 0 : doc.activeElement;
    const focusElsewhere = !!active && active !== (doc == null ? void 0 : doc.body) && !this.containerEl.contains(active);
    const isEditable = !!active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA" || active.isContentEditable);
    if (!focusElsewhere && !isEditable && active !== root) {
      root.focus({ preventScroll: true });
    }
    return true;
  }
  async applySubtaskText(file, lineNumber, newText) {
    const trimmed = newText.trim();
    if (!trimmed)
      return;
    const prefixes = this.plugin.settings.prefixes;
    await this.app.vault.process(file, (content) => {
      const lines = content.split("\n");
      if (lineNumber >= lines.length)
        return content;
      lines[lineNumber] = setTaskTitle(lines[lineNumber], trimmed, prefixes);
      return lines.join("\n");
    });
  }
  async applySubtaskTime(file, lineNumber, totalMin) {
    const prefixes = this.plugin.settings.prefixes;
    await this.app.vault.process(file, (content) => {
      const lines = content.split("\n");
      if (lineNumber >= lines.length)
        return content;
      lines[lineNumber] = totalMin === null ? removeTimeTag(lines[lineNumber], prefixes) : setTimeTag(lines[lineNumber], totalMin, prefixes);
      return lines.join("\n");
    });
  }
  async applySubtaskDuration(file, lineNumber, durationMin) {
    const prefixes = this.plugin.settings.prefixes;
    await this.app.vault.process(file, (content) => {
      const lines = content.split("\n");
      if (lineNumber >= lines.length)
        return content;
      lines[lineNumber] = durationMin === null ? removeDurationTag(lines[lineNumber], prefixes) : setDurationTag(lines[lineNumber], durationMin, prefixes);
      return lines.join("\n");
    });
  }
  async applyDeleteSubtask(file, lineNumber) {
    await this.app.vault.process(file, (content) => {
      const lines = content.split("\n");
      if (lineNumber >= lines.length)
        return content;
      lines.splice(lineNumber, 1);
      return lines.join("\n");
    });
  }
  // Reorders sub-task lines in the file. The slots are the existing line
  // numbers (sorted ascending); we write each ordered sub's current rawLine
  // into the corresponding slot. This preserves any blank/non-task lines
  // interleaved between sub-tasks.
  async applySubtaskReorder(file, orderedSubs) {
    const slots = orderedSubs.map((s) => s.lineNumber).slice().sort((a, b) => a - b);
    await this.app.vault.process(file, (content) => {
      const lines = content.split("\n");
      for (let i = 0; i < orderedSubs.length; i++) {
        const slot = slots[i];
        if (slot < lines.length)
          lines[slot] = orderedSubs[i].rawLine;
      }
      return lines.join("\n");
    });
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
function renderPickerCalendar(parent, opts) {
  let month = startOfMonth(opts.initialMonth);
  const draw = () => {
    parent.empty();
    const cal = parent.createDiv({ cls: "dp-calendar" });
    const head = cal.createDiv({ cls: "dp-cal-head" });
    const prev = head.createEl("button", { cls: "dp-nav-btn", text: "\u25C0" });
    prev.type = "button";
    const monthLabel = head.createDiv({ cls: "dp-cal-month" });
    monthLabel.textContent = month.toLocaleDateString(void 0, {
      month: "long",
      year: "numeric"
    });
    const next = head.createEl("button", { cls: "dp-nav-btn", text: "\u25B6" });
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
    const renderDay = (d, isOtherMonth) => {
      const cell = grid.createDiv({
        cls: "dp-cal-day",
        text: d.getDate().toString()
      });
      if (isOtherMonth)
        cell.addClass("is-other-month");
      if (sameDay(d, today))
        cell.addClass("is-today");
      if (sameDay(d, opts.selectedDate))
        cell.addClass("is-selected");
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
    const trailing = (7 - totalCells % 7) % 7;
    for (let i = 1; i <= trailing; i++)
      renderDay(addDays(monthEnd, i), true);
  };
  draw();
}
function attachProjectSuggest(input, wrap, projects) {
  const popover = wrap.createDiv({ cls: "dp-project-suggest" });
  popover.style.display = "none";
  let visible = [];
  let activeIdx = -1;
  const filter = (q) => {
    const needle = q.trim().toLowerCase();
    if (!needle)
      return projects.slice(0, 12);
    const starts = projects.filter((p) => p.toLowerCase().startsWith(needle));
    const contains = projects.filter(
      (p) => !p.toLowerCase().startsWith(needle) && p.toLowerCase().includes(needle)
    );
    return [...starts, ...contains].slice(0, 12);
  };
  const renderItems = () => {
    popover.empty();
    visible.forEach((name, i) => {
      const item = popover.createDiv({ cls: "dp-project-suggest-item" });
      if (i === activeIdx)
        item.addClass("is-active");
      item.setText(name);
      item.addEventListener("mousedown", (ev) => {
        ev.preventDefault();
        input.value = name;
        hide();
        input.focus();
      });
      item.addEventListener("mousemove", () => {
        if (activeIdx === i)
          return;
        activeIdx = i;
        updateActive();
      });
    });
  };
  const updateActive = () => {
    const items = popover.querySelectorAll(
      ".dp-project-suggest-item"
    );
    items.forEach((el, i) => el.toggleClass("is-active", i === activeIdx));
    if (activeIdx >= 0 && items[activeIdx]) {
      items[activeIdx].scrollIntoView({ block: "nearest" });
    }
  };
  const show = () => {
    visible = filter(input.value);
    if (visible.length === 0) {
      hide();
      return;
    }
    if (activeIdx < 0 || activeIdx >= visible.length)
      activeIdx = 0;
    renderItems();
    popover.style.display = "";
  };
  const hide = () => {
    popover.style.display = "none";
    activeIdx = -1;
  };
  input.addEventListener("input", show);
  input.addEventListener("focus", show);
  input.addEventListener("blur", () => {
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
      if (popover.style.display === "none")
        return;
      ev.preventDefault();
      activeIdx = Math.max(activeIdx - 1, 0);
      updateActive();
    } else if (ev.key === "Enter") {
      if (popover.style.display !== "none" && activeIdx >= 0 && activeIdx < visible.length && input.value !== visible[activeIdx]) {
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
function attachTitleSuggest(input, wrap, rules) {
  const live = rules.filter((r) => r.trigger);
  if (live.length === 0)
    return;
  const popover = wrap.createDiv({ cls: "dp-project-suggest" });
  popover.style.display = "none";
  let visible = [];
  let activeIdx = -1;
  let triggerStart = -1;
  let activeRule = null;
  const renderItems = () => {
    popover.empty();
    if (!activeRule)
      return;
    visible.forEach((value, i) => {
      const item = popover.createDiv({ cls: "dp-project-suggest-item" });
      if (i === activeIdx)
        item.addClass("is-active");
      activeRule.renderItem(item, value);
      item.addEventListener("mousedown", (ev) => {
        ev.preventDefault();
        commit(value);
      });
      item.addEventListener("mousemove", () => {
        if (activeIdx === i)
          return;
        activeIdx = i;
        updateActive();
      });
    });
  };
  const updateActive = () => {
    const items = popover.querySelectorAll(
      ".dp-project-suggest-item"
    );
    items.forEach((el, i) => el.toggleClass("is-active", i === activeIdx));
    if (activeIdx >= 0 && items[activeIdx]) {
      items[activeIdx].scrollIntoView({ block: "nearest" });
    }
  };
  const detect = () => {
    var _a, _b;
    const cursor = (_a = input.selectionStart) != null ? _a : input.value.length;
    const before = input.value.slice(0, cursor);
    let best = null;
    for (const rule of live) {
      const idx = before.lastIndexOf(rule.trigger);
      if (idx < 0)
        continue;
      const query = before.slice(idx + rule.trigger.length);
      const accept = (_b = rule.acceptQuery) != null ? _b : (q) => !/[\s#]/.test(q);
      if (!accept(query))
        continue;
      if (!best) {
        best = { rule, start: idx, query };
        continue;
      }
      const bestEnd = best.start + best.rule.trigger.length;
      const cEnd = idx + rule.trigger.length;
      if (cEnd > bestEnd) {
        best = { rule, start: idx, query };
      } else if (cEnd === bestEnd && rule.trigger.length > best.rule.trigger.length) {
        best = { rule, start: idx, query };
      }
    }
    return best;
  };
  const refresh = () => {
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
    if (activeIdx < 0 || activeIdx >= visible.length)
      activeIdx = 0;
    renderItems();
    popover.style.display = "";
  };
  const hide = () => {
    popover.style.display = "none";
    activeIdx = -1;
    triggerStart = -1;
    activeRule = null;
  };
  const commit = (value) => {
    var _a;
    if (!activeRule || triggerStart < 0)
      return;
    const cursor = (_a = input.selectionStart) != null ? _a : input.value.length;
    const rule = activeRule;
    const start = triggerStart;
    hide();
    rule.commit(value, start, cursor);
    input.focus();
  };
  input.addEventListener("input", refresh);
  input.addEventListener("click", refresh);
  input.addEventListener("keyup", (ev) => {
    if (ev.key === "ArrowLeft" || ev.key === "ArrowRight")
      refresh();
  });
  input.addEventListener("blur", () => {
    window.setTimeout(hide, 100);
  });
  input.addEventListener("keydown", (ev) => {
    if (popover.style.display === "none")
      return;
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
function filterSuggestions(pool, query, limit = 12) {
  const needle = query.trim().toLowerCase();
  if (!needle)
    return pool.slice(0, limit);
  const starts = pool.filter((p) => p.toLowerCase().startsWith(needle));
  const contains = pool.filter(
    (p) => !p.toLowerCase().startsWith(needle) && p.toLowerCase().includes(needle)
  );
  return [...starts, ...contains].slice(0, limit);
}
function sanitizeProjectName(raw) {
  return raw.trim().replace(/[^\w/-]+/g, "-").replace(/-+/g, "-").replace(/\/+/g, "/").replace(/-?\/-?/g, "/").replace(/^[-/]+|[-/]+$/g, "");
}
var TaskEditModal = class extends import_obsidian5.Modal {
  constructor(app, opts) {
    super(app);
    this.durationChanged = false;
    this.checkedChanged = false;
    this.opts = opts;
    this.selectedDurationMin = opts.initialDurationMin;
    this.checked = opts.initialChecked;
  }
  onOpen() {
    var _a, _b;
    this.modalEl.addClass("dp-title-modal");
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
          title: `Search for other instances of this task`
        }
      });
      pill.addEventListener("click", (ev) => {
        var _a2, _b2, _c, _d;
        ev.preventDefault();
        const search = (_b2 = (_a2 = this.app.internalPlugins) == null ? void 0 : _a2.getPluginById) == null ? void 0 : _b2.call(_a2, "global-search");
        (_d = (_c = search == null ? void 0 : search.instance) == null ? void 0 : _c.openGlobalSearch) == null ? void 0 : _d.call(_c, `tag:#${prefix}/${id}`);
        this.close();
      });
    }
    this.contentEl.empty();
    this.contentEl.addEventListener(
      "focusin",
      (ev) => {
        const target = ev.target;
        if (!target)
          return;
        const tag = target.tagName;
        if (tag !== "INPUT" && tag !== "TEXTAREA")
          return;
        window.setTimeout(() => {
          target.scrollIntoView({ block: "center", behavior: "smooth" });
        }, 250);
      },
      true
    );
    const titleRow = this.contentEl.createDiv({ cls: "dp-edit-title-row" });
    const checkBox = titleRow.createSpan({
      cls: "dp-edit-check",
      attr: {
        role: "checkbox",
        tabindex: "0",
        "aria-label": "Mark task complete",
        "aria-checked": this.checked ? "true" : "false"
      }
    });
    if (this.checked)
      checkBox.addClass("is-checked");
    const toggleChecked = () => {
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
      attr: { placeholder: "Task title\u2026", autocomplete: "off" }
    });
    input.value = this.opts.initialTitle;
    const descLabel = this.contentEl.createDiv({
      cls: "dp-prompt-step-label",
      text: "Description"
    });
    descLabel.setAttribute("aria-hidden", "true");
    const descInput = this.contentEl.createEl("textarea", {
      cls: "dp-description-input",
      attr: { placeholder: "Optional details\u2026", rows: "2" }
    });
    descInput.value = this.opts.initialDescription;
    const projLabel = this.contentEl.createDiv({
      cls: "dp-prompt-step-label is-mobile-hidden",
      text: "Project"
    });
    projLabel.setAttribute("aria-hidden", "true");
    const projRow = this.contentEl.createDiv({ cls: "dp-project-row" });
    const projWrap = projRow.createDiv({ cls: "dp-project-input-wrap" });
    const projInput = projWrap.createEl("input", {
      type: "text",
      cls: "dp-project-input",
      attr: { placeholder: "(none)", autocomplete: "off" }
    });
    projInput.value = (_a = this.opts.initialProject) != null ? _a : "";
    attachProjectSuggest(projInput, projWrap, this.opts.projects);
    const clearBtn = projRow.createEl("button", {
      cls: "dp-project-clear",
      attr: { "aria-label": "Clear project" }
    });
    clearBtn.type = "button";
    clearBtn.setText("\xD7");
    clearBtn.addEventListener("click", () => {
      projInput.value = "";
      projInput.focus();
    });
    const tagsWrap = projRow.createDiv({ cls: "dp-tags-input-wrap" });
    const tagPrefix = this.opts.prefixes.taskContext;
    const currentTags = [...this.opts.initialTags];
    const tagInput = tagsWrap.createEl("input", {
      type: "text",
      cls: "dp-tag-input",
      attr: {
        placeholder: `Add tag (#${tagPrefix}/\u2026)`,
        autocomplete: "off",
        "aria-label": "Add task context tag"
      }
    });
    const tagsHost = tagsWrap.createDiv({ cls: "dp-tags-chips" });
    const tagPopover = tagsWrap.createDiv({
      cls: "dp-project-suggest dp-tag-suggest"
    });
    tagPopover.style.display = "none";
    let tagVisible = [];
    let tagActiveIdx = -1;
    const renderTagChips = () => {
      tagsHost.empty();
      tagsHost.toggleClass("is-empty", currentTags.length === 0);
      currentTags.forEach((tag, idx) => {
        const chip = tagsHost.createSpan({ cls: "dp-tag-chip" });
        chip.createSpan({ cls: "dp-tag-chip-text", text: tag });
        const x = chip.createEl("button", {
          cls: "dp-tag-chip-remove",
          text: "\xD7",
          attr: { "aria-label": `Remove tag ${tag}` }
        });
        x.type = "button";
        x.addEventListener("click", () => {
          currentTags.splice(idx, 1);
          renderTagChips();
          tagInput.focus();
        });
      });
    };
    renderTagChips();
    const sanitizeTag = (s) => s.replace(/^#?[\w-]*\//, "").trim();
    const addTag = (raw) => {
      const t = sanitizeTag(raw);
      if (!t || !/^[\w-]+$/.test(t))
        return false;
      if (currentTags.includes(t))
        return false;
      currentTags.push(t);
      renderTagChips();
      tagInput.focus();
      return true;
    };
    const filterTags = (q) => {
      const needle = sanitizeTag(q).toLowerCase();
      const pool = this.opts.availableTags.filter(
        (t) => !currentTags.includes(t)
      );
      if (!needle)
        return pool.slice(0, 10);
      const starts = pool.filter((p) => p.toLowerCase().startsWith(needle));
      const contains = pool.filter(
        (p) => !p.toLowerCase().startsWith(needle) && p.toLowerCase().includes(needle)
      );
      return [...starts, ...contains].slice(0, 10);
    };
    const renderTagSuggest = () => {
      tagPopover.empty();
      tagVisible.forEach((name, i) => {
        const item = tagPopover.createDiv({
          cls: "dp-project-suggest-item"
        });
        if (i === tagActiveIdx)
          item.addClass("is-active");
        item.setText(name);
        item.addEventListener("mousedown", (ev) => {
          ev.preventDefault();
          addTag(name);
          tagInput.value = "";
          showTagSuggest();
        });
        item.addEventListener("mousemove", () => {
          if (tagActiveIdx === i)
            return;
          tagActiveIdx = i;
          updateTagActive();
        });
      });
    };
    const updateTagActive = () => {
      const items = tagPopover.querySelectorAll(
        ".dp-project-suggest-item"
      );
      items.forEach(
        (el, i) => el.toggleClass("is-active", i === tagActiveIdx)
      );
      if (tagActiveIdx >= 0 && items[tagActiveIdx]) {
        items[tagActiveIdx].scrollIntoView({ block: "nearest" });
      }
    };
    const showTagSuggest = () => {
      tagVisible = filterTags(tagInput.value);
      if (tagVisible.length === 0) {
        hideTagSuggest();
        return;
      }
      if (tagActiveIdx < 0 || tagActiveIdx >= tagVisible.length) {
        tagActiveIdx = 0;
      }
      renderTagSuggest();
      tagPopover.style.display = "";
    };
    const hideTagSuggest = () => {
      tagPopover.style.display = "none";
      tagActiveIdx = -1;
    };
    tagInput.addEventListener("input", showTagSuggest);
    tagInput.addEventListener("focus", showTagSuggest);
    tagInput.addEventListener("blur", () => {
      window.setTimeout(hideTagSuggest, 100);
    });
    tagInput.addEventListener("keydown", (ev) => {
      if (ev.key === "ArrowDown") {
        ev.preventDefault();
        if (tagPopover.style.display === "none") {
          showTagSuggest();
          return;
        }
        tagActiveIdx = Math.min(tagActiveIdx + 1, tagVisible.length - 1);
        updateTagActive();
      } else if (ev.key === "ArrowUp") {
        if (tagPopover.style.display === "none")
          return;
        ev.preventDefault();
        tagActiveIdx = Math.max(tagActiveIdx - 1, 0);
        updateTagActive();
      } else if (ev.key === "Enter") {
        if (tagPopover.style.display !== "none" && tagActiveIdx >= 0 && tagActiveIdx < tagVisible.length && tagInput.value.trim() !== tagVisible[tagActiveIdx]) {
          ev.preventDefault();
          ev.stopImmediatePropagation();
          addTag(tagVisible[tagActiveIdx]);
          tagInput.value = "";
          showTagSuggest();
        } else if (tagInput.value.trim()) {
          ev.preventDefault();
          ev.stopImmediatePropagation();
          if (addTag(tagInput.value))
            tagInput.value = "";
          showTagSuggest();
        }
      } else if (ev.key === "Backspace" && tagInput.value === "") {
        if (currentTags.length > 0) {
          ev.preventDefault();
          currentTags.pop();
          renderTagChips();
        }
      } else if (ev.key === "Escape") {
        if (tagPopover.style.display !== "none") {
          ev.preventDefault();
          ev.stopPropagation();
          hideTagSuggest();
        }
      }
    });
    const durLabel = this.contentEl.createDiv({
      cls: "dp-prompt-step-label is-mobile-hidden",
      text: "Duration"
    });
    durLabel.setAttribute("aria-hidden", "true");
    const row = this.contentEl.createDiv({ cls: "dp-duration-row" });
    const buttons = [];
    let durInput;
    let updateSubTotal = () => {
    };
    const refreshDurButtons = () => {
      buttons.forEach((b, i) => {
        var _a2;
        b.toggleClass(
          "is-selected",
          ((_a2 = this.opts.durations[i]) == null ? void 0 : _a2.min) === this.selectedDurationMin
        );
      });
    };
    this.opts.durations.forEach((d) => {
      const btn = row.createEl("button", {
        cls: "dp-duration-btn",
        text: d.label
      });
      btn.type = "button";
      if (d.min === this.selectedDurationMin)
        btn.addClass("is-selected");
      btn.addEventListener("click", () => {
        this.selectedDurationMin = d.min;
        this.durationChanged = true;
        refreshDurButtons();
        if (document.activeElement !== durInput) {
          durInput.value = formatCompactDuration(d.min);
        }
        updateSummary();
        updateSubTotal();
      });
      buttons.push(btn);
    });
    const customRow = this.contentEl.createDiv({
      cls: "dp-duration-custom-row is-mobile-hidden"
    });
    durInput = customRow.createEl("input", {
      type: "text",
      cls: "dp-duration-custom-input",
      attr: {
        placeholder: "Custom (e.g. 30m, 1h30m)",
        autocomplete: "off",
        "aria-label": "Custom duration"
      }
    });
    durInput.value = formatCompactDuration(this.selectedDurationMin);
    const durTagPrefix = this.opts.prefixes.duration;
    const stripDurTag = (s) => {
      const t = s.trim();
      const re = new RegExp(`^#?${durTagPrefix}\\s*[/:]\\s*`, "i");
      return t.replace(re, "");
    };
    durInput.addEventListener("input", () => {
      const min = parseCompactDuration(stripDurTag(durInput.value));
      if (min === null) {
        durInput.removeClass("is-invalid");
        return;
      }
      this.selectedDurationMin = min;
      this.durationChanged = true;
      refreshDurButtons();
      durInput.removeClass("is-invalid");
      updateSummary();
      updateSubTotal();
    });
    durInput.addEventListener("blur", () => {
      const min = parseCompactDuration(stripDurTag(durInput.value));
      if (min !== null) {
        durInput.value = formatCompactDuration(min);
        durInput.removeClass("is-invalid");
      } else if (durInput.value.trim()) {
        durInput.addClass("is-invalid");
      }
    });
    durInput.addEventListener("focus", () => {
      durInput.select();
    });
    const quickInsert = createDiv({ cls: "dp-edit-quick-insert" });
    const summary = createDiv({ cls: "dp-edit-quick-summary" });
    titleRow.after(quickInsert);
    quickInsert.after(summary);
    const summaryProj = summary.createDiv({ cls: "dp-edit-quick-summary-cell" });
    const summaryTime = summary.createDiv({ cls: "dp-edit-quick-summary-cell" });
    const summaryDur = summary.createDiv({ cls: "dp-edit-quick-summary-cell" });
    const insertTriggerAtCursor = (trigger) => {
      var _a2;
      if (!trigger)
        return;
      if (document.activeElement !== input)
        input.focus();
      const cursor = (_a2 = input.selectionStart) != null ? _a2 : input.value.length;
      const before = input.value.slice(0, cursor);
      const after = input.value.slice(cursor);
      const needsLead = before.length > 0 && !/\s$/.test(before);
      const insertion = (needsLead ? " " : "") + trigger;
      input.value = before + insertion + after;
      const newPos = before.length + insertion.length;
      input.setSelectionRange(newPos, newPos);
      input.dispatchEvent(new Event("input", { bubbles: true }));
    };
    const addQuickBtn = (trigger, iconName, label) => {
      const btn = quickInsert.createEl("button", {
        cls: "dp-edit-quick-btn",
        attr: { "aria-label": `Insert ${label.toLowerCase()}` }
      });
      btn.type = "button";
      (0, import_obsidian5.setIcon)(btn, iconName);
      btn.createSpan({ cls: "dp-edit-quick-label", text: label });
      btn.addEventListener("pointerdown", (ev) => {
        ev.preventDefault();
        insertTriggerAtCursor(trigger);
      });
    };
    addQuickBtn(this.opts.projectTrigger, "folder", "Project");
    addQuickBtn(this.opts.timeTrigger, "clock", "Time");
    addQuickBtn(this.opts.durationTrigger, "timer", "Duration");
    const updateSummary = () => {
      const proj = projInput.value.trim();
      summaryProj.setText(proj || "\u2014");
      summaryProj.toggleClass("is-empty", !proj);
      const timeMin = parseTime(input.value, this.opts.prefixes);
      summaryTime.setText(
        timeMin !== null ? formatClockShort(timeMin) : "\u2014"
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
      this.opts.visibleEndHour
    );
    const durationPool = this.opts.quickDurationsMin.map(
      (m) => formatCompactDuration(m)
    );
    const replaceTriggerRange = (start, cursor, replacement) => {
      let before = input.value.slice(0, start);
      const after = input.value.slice(cursor);
      if (!replacement)
        before = before.replace(/\s+$/, "");
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
          el.setText(name);
        },
        commit: (name, start, cursor) => {
          projInput.value = name;
          replaceTriggerRange(start, cursor, "");
        }
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
        }
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
            refreshDurButtons();
            durInput.value = formatCompactDuration(min);
          }
          replaceTriggerRange(start, cursor, "");
          updateSummary();
          updateSubTotal();
        }
      },
      // Date rule keeps the resolved Date alongside the keyword in a parallel
      // map so commit() can rebuild the link without re-parsing the keyword.
      // People suggestions ride the same trigger: their keys are full vault
      // paths (always end with .md) so they never collide with date keywords.
      (() => {
        const dateMap = /* @__PURE__ */ new Map();
        const personMap = /* @__PURE__ */ new Map();
        const fmt = this.opts.dateLinkFormat;
        return {
          trigger: this.opts.dateTrigger,
          acceptQuery: (q) => !/#/.test(q) && (!/\s/.test(q) || /^[A-Za-z]+ \d{0,2}$/.test(q)),
          getSuggestions: (q) => {
            dateMap.clear();
            personMap.clear();
            const items = buildDateSuggestions(q);
            for (const it of items)
              dateMap.set(it.keyword, it.date);
            const people = buildPeopleSuggestions(
              this.app,
              this.opts.peopleFolder,
              q
            );
            for (const p of people)
              personMap.set(p.path, p);
            return [
              ...items.map((it) => it.keyword),
              ...people.map((p) => p.path)
            ];
          },
          renderItem: (el, key) => {
            const person = personMap.get(key);
            if (person) {
              el.createSpan({ text: person.basename });
              if (person.folder) {
                el.createSpan({
                  cls: "dp-project-suggest-sub",
                  text: ` ${person.folder}`
                });
              }
              return;
            }
            el.createSpan({ text: key });
            const d = dateMap.get(key);
            if (d && fmt.trim()) {
              el.createSpan({
                cls: "dp-project-suggest-sub",
                text: ` ${(0, import_obsidian5.moment)(d).format(fmt.trim())}`
              });
            }
          },
          commit: (key, start, cursor) => {
            const person = personMap.get(key);
            if (person) {
              const link2 = buildPersonLinkInsert(this.app, person.path);
              replaceTriggerRange(start, cursor, link2 + " ");
              return;
            }
            const d = dateMap.get(key);
            if (!d) {
              replaceTriggerRange(start, cursor, "");
              return;
            }
            const link = buildDateLinkInsert(
              this.app,
              d,
              this.opts.dailyNoteFormat,
              this.opts.dailyNoteFolder,
              fmt
            );
            replaceTriggerRange(start, cursor, link + " ");
          }
        };
      })()
    ]);
    const resolveProject = () => {
      var _a2;
      const raw = projInput.value.trim();
      if (this.opts.mode === "new") {
        return raw ? sanitizeProjectName(raw) || null : null;
      }
      const initial = (_a2 = this.opts.initialProject) != null ? _a2 : "";
      if (raw === initial)
        return void 0;
      if (!raw)
        return "";
      return sanitizeProjectName(raw) || void 0;
    };
    const resolveDescription = () => {
      const raw = descInput.value.replace(/\s+/g, " ").trim();
      if (this.opts.mode === "new")
        return raw || null;
      if (raw === this.opts.initialDescription.trim())
        return null;
      return raw;
    };
    const resolveTags = () => {
      const pending = sanitizeTag(tagInput.value);
      const final = [...currentTags];
      if (pending && /^[\w-]+$/.test(pending) && !final.includes(pending)) {
        final.push(pending);
      }
      if (this.opts.mode === "new")
        return final;
      const initial = this.opts.initialTags;
      if (final.length === initial.length && final.every((t, i) => t === initial[i])) {
        return null;
      }
      return final;
    };
    const submit = (postAction = "none") => {
      const title = input.value.trim();
      if (this.opts.mode === "new" && !title) {
        input.focus();
        return;
      }
      const extras = this.opts.mode === "new" ? {
        subtaskRawLines: subs.map((s) => s.rawLine),
        postAction
      } : void 0;
      this.opts.onSave(
        title,
        resolveDescription(),
        this.durationChanged ? this.selectedDurationMin : null,
        resolveProject(),
        this.checkedChanged ? this.checked : null,
        resolveTags(),
        extras
      );
      this.close();
    };
    const enterToSubmit = (ev) => {
      if (ev.key === "Enter" && !ev.metaKey && !ev.ctrlKey && !ev.altKey && !ev.shiftKey) {
        ev.preventDefault();
        submit();
      }
    };
    input.addEventListener("keydown", enterToSubmit);
    projInput.addEventListener("keydown", enterToSubmit);
    durInput.addEventListener("keydown", enterToSubmit);
    const subHeader = this.contentEl.createDiv({ cls: "dp-edit-subtask-header" });
    const subLabel = subHeader.createDiv({
      cls: "dp-prompt-step-label",
      text: "Sub-tasks"
    });
    subLabel.setAttribute("aria-hidden", "true");
    const subTotal = subLabel.createSpan({ cls: "dp-edit-subtask-total" });
    const sortBtn = subHeader.createEl("button", {
      cls: "dp-edit-subtask-sort",
      text: "Sort by time"
    });
    sortBtn.type = "button";
    const list = this.contentEl.createDiv({ cls: "dp-edit-subtasks" });
    const subs = this.opts.subtasks.slice();
    const prefixes = this.opts.prefixes;
    const cleanBody = this.opts.cleanBody;
    let dragSourceIdx = null;
    let pendingSubLineCounter = -1;
    const persistOrder = () => {
      if (!this.opts.onReorderSubtasks)
        return;
      const slots = subs.map((s) => s.lineNumber).slice().sort((a, b) => a - b);
      const ordered = subs.slice();
      void this.opts.onReorderSubtasks(ordered);
      ordered.forEach((s, i) => {
        s.lineNumber = slots[i];
      });
    };
    const renderList = () => {
      list.empty();
      subs.forEach((sub, idx) => renderSubtask(sub, idx));
      updateSubTotal();
    };
    updateSubTotal = () => {
      const total = subs.reduce(
        (acc, s) => {
          var _a2;
          return acc + ((_a2 = parseDuration(s.text, prefixes)) != null ? _a2 : 0);
        },
        0
      );
      if (total <= 0) {
        subTotal.setText("");
        subTotal.removeClass("is-over");
        return;
      }
      subTotal.setText(` (${formatCompactDuration(total)})`);
      subTotal.toggleClass("is-over", total > this.selectedDurationMin);
    };
    const startTextEditAt = (idx) => {
      const row2 = list.querySelector(
        `.dp-edit-subtask[data-idx="${idx}"]`
      );
      const textEl = row2 == null ? void 0 : row2.querySelector(".dp-edit-subtask-text");
      textEl == null ? void 0 : textEl.click();
    };
    const renderSubtask = (sub, idx) => {
      let checked = sub.checked;
      const row2 = list.createDiv({ cls: "dp-edit-subtask" });
      row2.dataset.idx = String(idx);
      if (checked)
        row2.addClass("is-done");
      const box = row2.createSpan({ cls: "dp-edit-check" });
      if (checked)
        box.addClass("is-checked");
      const timeChip = row2.createSpan({ cls: "dp-edit-subtask-time" });
      const renderTimeChip = () => {
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
      const durChip = row2.createSpan({ cls: "dp-edit-subtask-duration" });
      const renderDurChip = () => {
        const min = parseDuration(sub.text, prefixes);
        if (min === null) {
          durChip.setText("+ dur");
          durChip.addClass("is-empty");
        } else {
          durChip.setText(formatCompactDuration(min));
          durChip.removeClass("is-empty");
        }
      };
      renderDurChip();
      const textEl = row2.createSpan({
        cls: "dp-edit-subtask-text",
        text: cleanBody(sub.text)
      });
      const deleteBtn = row2.createSpan({
        cls: "dp-edit-subtask-delete",
        attr: { "aria-label": "Delete sub-task", role: "button", tabindex: "0" }
      });
      (0, import_obsidian5.setIcon)(deleteBtn, "x");
      deleteBtn.addEventListener("click", (ev) => {
        ev.stopPropagation();
        const removedLine = sub.lineNumber;
        subs.splice(idx, 1);
        if (removedLine >= 0) {
          subs.forEach((s) => {
            if (s.lineNumber > removedLine)
              s.lineNumber -= 1;
          });
        }
        renderList();
        if (this.opts.onDeleteSubtask) {
          void this.opts.onDeleteSubtask(sub);
        }
      });
      const handle = row2.createSpan({ cls: "dp-edit-subtask-handle" });
      (0, import_obsidian5.setIcon)(handle, "grip-vertical");
      handle.draggable = true;
      const toggleChecked2 = () => {
        checked = !checked;
        row2.toggleClass("is-done", checked);
        box.toggleClass("is-checked", checked);
        sub.checked = checked;
        sub.rawLine = sub.rawLine.replace(
          /^(\s*-\s*\[)[^\]](\])/,
          `$1${checked ? "x" : " "}$2`
        );
        if (this.opts.onToggleSubtask) {
          void this.opts.onToggleSubtask(sub, checked);
        }
      };
      box.addEventListener("click", (ev) => {
        ev.stopPropagation();
        toggleChecked2();
      });
      timeChip.addEventListener("click", (ev) => {
        ev.stopPropagation();
        const current = parseTime(sub.text, prefixes);
        const editor = row2.createEl("input", {
          type: "text",
          cls: "dp-edit-subtask-time-input",
          attr: { placeholder: "e.g. 7p, 6:30p" }
        });
        editor.value = current === null ? "" : formatClockShort(current);
        timeChip.style.display = "none";
        editor.focus();
        editor.select();
        let done = false;
        const finish = (commit) => {
          if (done)
            return;
          done = true;
          const raw = editor.value.trim();
          editor.remove();
          timeChip.style.display = "";
          if (!commit)
            return;
          let totalMin = null;
          if (raw !== "") {
            const cleaned = raw.toLowerCase().replace(/[\s:]/g, "");
            const tagPrefix2 = `#${prefixes.time}/`;
            const stripped = cleaned.startsWith(tagPrefix2) ? cleaned.slice(tagPrefix2.length) : cleaned;
            const parsed = parseTime(`${tagPrefix2}${stripped}`, prefixes);
            if (parsed === null) {
              new import_obsidian5.Notice("Invalid time, try e.g. 7p or 6:30p");
              return;
            }
            totalMin = parsed;
          }
          if (totalMin === current)
            return;
          sub.rawLine = totalMin === null ? removeTimeTag(sub.rawLine, prefixes) : setTimeTag(sub.rawLine, totalMin, prefixes);
          const m = /^\s*-\s*\[[^\]]\]\s+(.*)$/.exec(sub.rawLine);
          if (m)
            sub.text = m[1];
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
      durChip.addEventListener("click", (ev) => {
        ev.stopPropagation();
        const current = parseDuration(sub.text, prefixes);
        const editor = row2.createEl("input", {
          type: "text",
          cls: "dp-edit-subtask-time-input",
          attr: { placeholder: "e.g. 30m, 1h30m" }
        });
        editor.value = current === null ? "" : formatCompactDuration(current);
        durChip.style.display = "none";
        editor.focus();
        editor.select();
        let done = false;
        const finish = (commit) => {
          if (done)
            return;
          done = true;
          const raw = editor.value.trim();
          editor.remove();
          durChip.style.display = "";
          if (!commit)
            return;
          let totalMin = null;
          if (raw !== "") {
            const stripped = raw.replace(new RegExp(`^#?${prefixes.duration}\\s*[/:]\\s*`, "i"), "").trim();
            const parsed = parseCompactDuration(stripped);
            if (parsed === null) {
              new import_obsidian5.Notice("Invalid duration, try e.g. 30m or 1h30m");
              return;
            }
            totalMin = parsed;
          }
          if (totalMin === current)
            return;
          sub.rawLine = totalMin === null ? removeDurationTag(sub.rawLine, prefixes) : setDurationTag(sub.rawLine, totalMin, prefixes);
          const m = /^\s*-\s*\[[^\]]\]\s+(.*)$/.exec(sub.rawLine);
          if (m)
            sub.text = m[1];
          renderDurChip();
          updateSubTotal();
          if (this.opts.onSetSubtaskDuration) {
            void this.opts.onSetSubtaskDuration(sub, totalMin);
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
        const editor = row2.createEl("input", {
          type: "text",
          cls: "dp-edit-subtask-text-input"
        });
        editor.value = cleanBody(sub.text);
        textEl.style.display = "none";
        editor.focus();
        editor.select();
        let done = false;
        const finish = (commit) => {
          if (done)
            return;
          done = true;
          const next = editor.value.trim();
          editor.remove();
          const before = cleanBody(sub.text);
          if (commit && next && next !== before) {
            sub.rawLine = setTaskTitle(sub.rawLine, next, prefixes);
            const m = /^\s*-\s*\[[^\]]\]\s+(.*)$/.exec(sub.rawLine);
            if (m)
              sub.text = m[1];
            textEl.setText(cleanBody(sub.text));
            updateSubTotal();
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
          } else if (kev.key === "ArrowUp") {
            kev.preventDefault();
            if (idx > 0) {
              finish(true);
              startTextEditAt(idx - 1);
            }
          } else if (kev.key === "ArrowDown") {
            kev.preventDefault();
            finish(true);
            if (idx < subs.length - 1) {
              startTextEditAt(idx + 1);
            } else {
              addInput.focus();
            }
          }
        });
        editor.addEventListener("blur", () => finish(true));
      });
      handle.addEventListener("dragstart", (ev) => {
        dragSourceIdx = idx;
        row2.addClass("is-dragging");
        if (ev.dataTransfer) {
          ev.dataTransfer.effectAllowed = "move";
          ev.dataTransfer.setData("text/plain", String(idx));
          const rect = row2.getBoundingClientRect();
          ev.dataTransfer.setDragImage(
            row2,
            ev.clientX - rect.left,
            ev.clientY - rect.top
          );
        }
      });
      handle.addEventListener("dragend", () => {
        dragSourceIdx = null;
        list.querySelectorAll(".dp-edit-subtask").forEach((el) => {
          el.classList.remove("is-dragging");
          el.classList.remove("drop-above");
          el.classList.remove("drop-below");
        });
      });
      row2.addEventListener("dragover", (ev) => {
        if (dragSourceIdx === null || dragSourceIdx === idx)
          return;
        ev.preventDefault();
        if (ev.dataTransfer)
          ev.dataTransfer.dropEffect = "move";
        const rect = row2.getBoundingClientRect();
        const isAbove = ev.clientY < rect.top + rect.height / 2;
        row2.toggleClass("drop-above", isAbove);
        row2.toggleClass("drop-below", !isAbove);
      });
      row2.addEventListener("dragleave", () => {
        row2.removeClass("drop-above");
        row2.removeClass("drop-below");
      });
      row2.addEventListener("drop", (ev) => {
        if (dragSourceIdx === null || dragSourceIdx === idx)
          return;
        ev.preventDefault();
        const rect = row2.getBoundingClientRect();
        const isAbove = ev.clientY < rect.top + rect.height / 2;
        const from = dragSourceIdx;
        const moved = subs.splice(from, 1)[0];
        let to = idx;
        if (from < idx)
          to = idx - 1;
        if (!isAbove)
          to += 1;
        subs.splice(to, 0, moved);
        dragSourceIdx = null;
        renderList();
        persistOrder();
      });
    };
    renderList();
    sortBtn.addEventListener("click", () => {
      subs.sort((a, b) => {
        const ta = parseTime(a.text, prefixes);
        const tb = parseTime(b.text, prefixes);
        if (ta === null && tb === null)
          return 0;
        if (ta === null)
          return 1;
        if (tb === null)
          return -1;
        return ta - tb;
      });
      renderList();
      persistOrder();
    });
    const addRow = this.contentEl.createDiv({ cls: "dp-edit-subtask-add" });
    const addInput = addRow.createEl("input", {
      type: "text",
      cls: "dp-edit-subtask-input",
      attr: { placeholder: "New sub-task\u2026" }
    });
    const addBtn = addRow.createEl("button", {
      cls: "dp-edit-subtask-add-btn",
      text: "Add"
    });
    addBtn.type = "button";
    const submitNewSubtask = async () => {
      const text = addInput.value.trim();
      if (!text)
        return;
      addInput.disabled = true;
      addBtn.disabled = true;
      let sub;
      if (this.opts.onAddSubtask) {
        sub = await this.opts.onAddSubtask(text);
      } else {
        sub = {
          lineNumber: pendingSubLineCounter--,
          rawLine: `	- [ ] ${text}`,
          text,
          checked: false
        };
      }
      addInput.disabled = false;
      addBtn.disabled = false;
      if (sub) {
        subs.push(sub);
        renderSubtask(sub, subs.length - 1);
        updateSubTotal();
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
      } else if (ev.key === "ArrowUp") {
        if (addInput.value === "" && subs.length > 0) {
          ev.preventDefault();
          startTextEditAt(subs.length - 1);
        }
      }
    });
    if (this.opts.mode === "new" && this.opts.getPriorTasks) {
      const taskPopover = titleWrap.createDiv({
        cls: "dp-project-suggest dp-task-suggest"
      });
      taskPopover.style.display = "none";
      let priorTasks = [];
      let visiblePrior = [];
      let priorActiveIdx = -1;
      const triggerStrings = [
        this.opts.projectTrigger,
        this.opts.timeTrigger,
        this.opts.durationTrigger,
        this.opts.dateTrigger
      ].filter((s) => !!s);
      const triggerPopoverEl = () => titleWrap.querySelector(
        ".dp-project-suggest:not(.dp-task-suggest)"
      );
      const isTriggerActive = (text) => {
        const tp = triggerPopoverEl();
        if (tp && tp.style.display !== "none")
          return true;
        return triggerStrings.some((t) => text.includes(t));
      };
      const filterPrior = (q) => {
        const needle = q.trim().toLowerCase();
        if (!needle)
          return [];
        const starts = [];
        const contains = [];
        for (const p of priorTasks) {
          const lc = p.title.toLowerCase();
          if (lc === needle)
            continue;
          if (lc.startsWith(needle))
            starts.push(p);
          else if (lc.includes(needle))
            contains.push(p);
        }
        return [...starts, ...contains].slice(0, 8);
      };
      const renderPriorList = () => {
        taskPopover.empty();
        visiblePrior.forEach((sugg, i) => {
          const item = taskPopover.createDiv({
            cls: "dp-project-suggest-item"
          });
          if (i === priorActiveIdx)
            item.addClass("is-active");
          item.createSpan({ text: sugg.title });
          if (sugg.project) {
            item.createSpan({
              cls: "dp-project-suggest-sub",
              text: ` ${sugg.project}`
            });
          }
          item.addEventListener("mousedown", (ev) => {
            ev.preventDefault();
            applyPriorPick(sugg);
          });
          item.addEventListener("mousemove", () => {
            if (priorActiveIdx === i)
              return;
            priorActiveIdx = i;
            updatePriorActive();
          });
        });
      };
      const updatePriorActive = () => {
        const items = taskPopover.querySelectorAll(
          ".dp-project-suggest-item"
        );
        items.forEach(
          (el, i) => el.toggleClass("is-active", i === priorActiveIdx)
        );
        if (priorActiveIdx >= 0 && items[priorActiveIdx]) {
          items[priorActiveIdx].scrollIntoView({ block: "nearest" });
        }
      };
      const showPriorSuggest = () => {
        if (isTriggerActive(input.value)) {
          hidePriorSuggest();
          return;
        }
        visiblePrior = filterPrior(input.value);
        if (visiblePrior.length === 0) {
          hidePriorSuggest();
          return;
        }
        if (priorActiveIdx < 0 || priorActiveIdx >= visiblePrior.length) {
          priorActiveIdx = 0;
        }
        renderPriorList();
        taskPopover.style.display = "";
      };
      const hidePriorSuggest = () => {
        taskPopover.style.display = "none";
        priorActiveIdx = -1;
      };
      const applyPriorPick = (sugg) => {
        var _a2;
        input.value = sugg.title;
        input.setSelectionRange(sugg.title.length, sugg.title.length);
        descInput.value = sugg.description;
        projInput.value = (_a2 = sugg.project) != null ? _a2 : "";
        if (sugg.durationMin !== null) {
          this.selectedDurationMin = sugg.durationMin;
          this.durationChanged = true;
          refreshDurButtons();
          durInput.value = formatCompactDuration(sugg.durationMin);
          durInput.removeClass("is-invalid");
        }
        currentTags.length = 0;
        currentTags.push(...sugg.tags);
        renderTagChips();
        if (this.opts.copySubtasksOnAutocomplete) {
          subs.length = 0;
          for (const rawLine of sugg.subtaskRawLines) {
            const m = /^\s*-\s*\[[^\]]\]\s*(.*)$/.exec(rawLine);
            const text = m ? m[1] : rawLine;
            subs.push({
              lineNumber: pendingSubLineCounter--,
              rawLine,
              text,
              checked: false
            });
          }
          renderList();
        }
        updateSummary();
        updateSubTotal();
        hidePriorSuggest();
        input.focus();
      };
      void this.opts.getPriorTasks().then((list2) => {
        priorTasks = list2;
        if (document.activeElement === input)
          showPriorSuggest();
      });
      input.addEventListener("input", showPriorSuggest);
      input.addEventListener("focus", showPriorSuggest);
      input.addEventListener("blur", () => {
        window.setTimeout(hidePriorSuggest, 100);
      });
      input.addEventListener(
        "keydown",
        (ev) => {
          if (taskPopover.style.display === "none")
            return;
          if (ev.key === "ArrowDown") {
            ev.preventDefault();
            ev.stopImmediatePropagation();
            priorActiveIdx = Math.min(
              priorActiveIdx + 1,
              visiblePrior.length - 1
            );
            updatePriorActive();
          } else if (ev.key === "ArrowUp") {
            ev.preventDefault();
            ev.stopImmediatePropagation();
            priorActiveIdx = Math.max(priorActiveIdx - 1, 0);
            updatePriorActive();
          } else if (ev.key === "Enter" || ev.key === "Tab") {
            if (priorActiveIdx >= 0 && priorActiveIdx < visiblePrior.length) {
              ev.preventDefault();
              ev.stopImmediatePropagation();
              applyPriorPick(visiblePrior[priorActiveIdx]);
            }
          } else if (ev.key === "Escape") {
            ev.preventDefault();
            ev.stopImmediatePropagation();
            hidePriorSuggest();
          }
        },
        true
      );
    }
    const actions = this.contentEl.createDiv({ cls: "dp-edit-actions" });
    const runDelete = async () => {
      if (!this.opts.onDelete)
        return;
      const ok = window.confirm("Delete this task and its sub-tasks?");
      if (!ok)
        return;
      await this.opts.onDelete();
      this.close();
    };
    const runUnschedule = async () => {
      if (!this.opts.onUnschedule)
        return;
      await this.opts.onUnschedule();
      this.close();
    };
    const runDuplicate = async () => {
      if (!this.opts.onDuplicate)
        return;
      const includeSubs = this.opts.hasSubtasks ? window.confirm("Copy sub-tasks too?") : false;
      await this.opts.onDuplicate(includeSubs);
      this.close();
    };
    if (this.opts.mode === "edit" && this.opts.onDelete) {
      const deleteBtn = actions.createEl("button", {
        cls: "dp-edit-delete-btn",
        text: "Delete",
        attr: { "aria-label": "Delete task (x)" }
      });
      deleteBtn.type = "button";
      deleteBtn.addEventListener("click", () => void runDelete());
    }
    const showBtn = actions.createEl("button", {
      cls: "dp-edit-icon-btn",
      attr: { "aria-label": "Show in note (s)" }
    });
    showBtn.type = "button";
    (0, import_obsidian5.setIcon)(showBtn, "eye");
    showBtn.addEventListener("click", () => {
      if (this.opts.mode === "new") {
        submit("show");
        return;
      }
      this.close();
      this.opts.onShowInNote();
    });
    let editModeMoveBtn = null;
    if (this.opts.mode === "edit") {
      const moveChoices = (_b = this.opts.moveChoices) != null ? _b : [];
      const calendarPick = this.opts.moveCalendarPick;
      const moveWrap = actions.createDiv({ cls: "dp-edit-move-wrap" });
      const moveBtn = moveWrap.createEl("button", {
        cls: "dp-edit-icon-btn",
        attr: { "aria-label": "Move to\u2026 (m)" }
      });
      moveBtn.type = "button";
      (0, import_obsidian5.setIcon)(moveBtn, "forward");
      editModeMoveBtn = moveBtn;
      const choices = moveWrap.createDiv({ cls: "dp-edit-move-choices" });
      choices.style.display = "none";
      const calPopover = moveWrap.createDiv({
        cls: "dp-edit-move-calpopover"
      });
      calPopover.style.display = "none";
      const choiceBtns = [];
      for (const choice of moveChoices) {
        const btn = choices.createEl("button", {
          cls: "dp-edit-move-choice",
          attr: {
            "aria-label": `Move to ${choice.label} (${choice.hotkey})`
          }
        });
        btn.type = "button";
        btn.createEl("span", {
          cls: "dp-edit-move-hotkey",
          text: `(${choice.hotkey})`
        });
        btn.appendText(` ${choice.label}`);
        btn.addEventListener("click", () => void runWith(choice.onChoose));
        choiceBtns.push(btn);
      }
      let calBtn = null;
      if (calendarPick) {
        calBtn = choices.createEl("button", {
          cls: "dp-edit-move-choice is-calendar",
          attr: {
            "aria-label": `Pick date (${calendarPick.hotkey})`
          }
        });
        calBtn.type = "button";
        calBtn.createEl("span", {
          cls: "dp-edit-move-hotkey",
          text: `(${calendarPick.hotkey})`
        });
        const iconWrap = calBtn.createSpan({ cls: "dp-edit-move-calicon" });
        (0, import_obsidian5.setIcon)(iconWrap, "calendar");
        calBtn.addEventListener("click", () => openCalendar());
        choiceBtns.push(calBtn);
      }
      let stageTwoActive = false;
      let calendarActive = false;
      let keyHandler = null;
      const setSubBtnsDisabled = (disabled) => {
        for (const b of choiceBtns)
          b.disabled = disabled;
      };
      const exitStageTwo = () => {
        stageTwoActive = false;
        choices.style.display = "none";
        choices.removeClass("is-open");
        closeCalendar();
        if (keyHandler) {
          this.contentEl.removeEventListener("keydown", keyHandler, true);
          keyHandler = null;
        }
      };
      const closeCalendar = () => {
        if (!calendarActive)
          return;
        calendarActive = false;
        calPopover.style.display = "none";
        calPopover.empty();
      };
      const openCalendar = () => {
        if (!calendarPick)
          return;
        choices.style.display = "none";
        choices.removeClass("is-open");
        calendarActive = true;
        calPopover.style.display = "";
        renderPickerCalendar(calPopover, {
          initialMonth: calendarPick.initialMonth,
          selectedDate: calendarPick.selectedDate,
          onPickDay: (date) => {
            void runWith(() => calendarPick.onPick(date));
          }
        });
      };
      const runWith = async (action) => {
        setSubBtnsDisabled(true);
        const moved = await action();
        if (moved)
          this.close();
        else {
          setSubBtnsDisabled(false);
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
        if (choiceBtns.length === 0)
          return;
        stageTwoActive = true;
        choices.style.display = "";
        choices.removeClass("is-open");
        void choices.offsetWidth;
        choices.addClass("is-open");
        choiceBtns[0].focus();
        keyHandler = (ev) => {
          if (!stageTwoActive)
            return;
          const target = ev.target;
          if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
            return;
          }
          if (ev.key === "Escape") {
            ev.preventDefault();
            ev.stopPropagation();
            if (calendarActive) {
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
          if (calendarActive)
            return;
          for (const choice of moveChoices) {
            if (ev.key === choice.hotkey) {
              ev.preventDefault();
              ev.stopPropagation();
              void runWith(choice.onChoose);
              return;
            }
          }
          if (calendarPick && ev.key.toLowerCase() === calendarPick.hotkey.toLowerCase()) {
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
      attr: { "aria-label": "Pomodoro (p)" }
    });
    pomoBtn.type = "button";
    (0, import_obsidian5.setIcon)(pomoBtn, "timer");
    pomoBtn.addEventListener("click", () => {
      if (this.opts.mode === "new") {
        submit("pomodoro");
        return;
      }
      this.close();
      this.opts.onStartPomodoro();
    });
    if (this.opts.mode === "edit" && this.opts.onUnschedule) {
      const unschedBtn = actions.createEl("button", {
        cls: "dp-edit-icon-btn",
        attr: { "aria-label": "Unschedule (u)" }
      });
      unschedBtn.type = "button";
      (0, import_obsidian5.setIcon)(unschedBtn, "calendar-x");
      unschedBtn.addEventListener("click", () => void runUnschedule());
    }
    if (this.opts.mode === "edit" && this.opts.onDuplicate) {
      const dupBtn = actions.createEl("button", {
        cls: "dp-edit-icon-btn",
        attr: { "aria-label": "Duplicate (y)" }
      });
      dupBtn.type = "button";
      (0, import_obsidian5.setIcon)(dupBtn, "copy");
      dupBtn.addEventListener("click", () => void runDuplicate());
    }
    const saveBtn = actions.createEl("button", {
      cls: "dp-edit-save-btn mod-cta",
      text: this.opts.mode === "new" ? "Add task" : "Save"
    });
    saveBtn.type = "button";
    saveBtn.addEventListener("click", () => submit());
    const focusInputAtEnd = (el) => {
      el.focus();
      const end = el.value.length;
      el.setSelectionRange(end, end);
    };
    const onModalKey = (ev) => {
      var _a2;
      if (ev.key === "Enter" && (ev.metaKey || ev.ctrlKey)) {
        ev.preventDefault();
        submit();
        return;
      }
      const target = ev.target;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
        return;
      }
      const moveOpen = this.contentEl.querySelector(
        ".dp-edit-move-choices"
      );
      if (moveOpen && moveOpen.style.display !== "none")
        return;
      const calOpen = this.contentEl.querySelector(
        ".dp-edit-move-calpopover"
      );
      if (calOpen && calOpen.style.display !== "none")
        return;
      if (ev.metaKey || ev.ctrlKey || ev.altKey)
        return;
      const k = ev.key.toLowerCase();
      if (k === "i") {
        ev.preventDefault();
        if (this.opts.mode === "edit" && !/\s$/.test(input.value)) {
          input.value = input.value + " ";
        }
        focusInputAtEnd(input);
      } else if (k === "o") {
        ev.preventDefault();
        focusInputAtEnd(descInput);
      } else if (k === "d") {
        ev.preventDefault();
        const selected = buttons.find(
          (b) => b.classList.contains("is-selected")
        );
        (_a2 = selected != null ? selected : buttons[0]) == null ? void 0 : _a2.focus();
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
    window.setTimeout(() => {
      if (this.opts.mode !== "new")
        return;
      input.focus();
      const end = input.value.length;
      input.setSelectionRange(end, end);
    }, 0);
  }
  onClose() {
    this.contentEl.empty();
    document.body.removeClass("today-edit-open");
  }
};
var SubtaskQuickAddModal = class extends import_obsidian5.Modal {
  constructor(app, onSubmit) {
    super(app);
    this.onSubmit = onSubmit;
  }
  onOpen() {
    this.modalEl.addClass("dp-title-modal");
    this.titleEl.setText("Add sub-task");
    this.contentEl.empty();
    const input = this.contentEl.createEl("input", {
      type: "text",
      cls: "dp-title-input",
      attr: { placeholder: "New sub-task\u2026" }
    });
    let submitting = false;
    const submit = async () => {
      if (submitting)
        return;
      const text = input.value.trim();
      if (!text)
        return;
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
  onClose() {
    this.contentEl.empty();
  }
};

// src/main.ts
init_parser();

// src/collect.ts
var import_obsidian6 = require("obsidian");
init_parser();
var TASK_LINE2 = /^(\s*)- \[([ xX/\-!?*<>])\]\s+(.*)$/;
async function collectUnfinished(plugin) {
  const fallback = {
    folder: plugin.settings.dailyNoteFolderFallback,
    format: plugin.settings.dailyNoteFormatFallback
  };
  const dailyOptions = getDailyNoteOptions(plugin.app, fallback);
  const inboxPath = resolveInboxPath(
    plugin.settings.inboxPath,
    dailyOptions.folder
  );
  if (!inboxPath) {
    new import_obsidian6.Notice("Today: set an inbox file path in settings before collecting.");
    return;
  }
  const scope = await pickScope(plugin.app);
  if (!scope)
    return;
  const plan = await buildMigrationPlan(plugin, dailyOptions, inboxPath, scope);
  if (plan.totalCount === 0) {
    new import_obsidian6.Notice("Today: no unfinished tasks to migrate.");
    return;
  }
  if (plugin.settings.confirmCollectMigration) {
    const ok = await confirmMigration(plugin.app, plan);
    if (!ok)
      return;
  }
  await applyPlan(plugin.app, plan);
  new import_obsidian6.Notice(
    `Today: migrated ${plan.totalCount} task${plan.totalCount === 1 ? "" : "s"} to ${plan.inboxPath}.`
  );
}
function resolveInboxPath(template, dailyFolder) {
  const t = (template || "").trim();
  if (!t)
    return "";
  return (0, import_obsidian6.normalizePath)(t.replace(/\{daily\}/g, dailyFolder));
}
function pickScope(app) {
  return new Promise((resolve) => {
    new ScopeModal(app, resolve).open();
  });
}
function confirmMigration(app, plan) {
  return new Promise((resolve) => {
    new ConfirmModal(app, plan, resolve).open();
  });
}
var ScopeModal = class extends import_obsidian6.Modal {
  constructor(app, resolve) {
    super(app);
    this.settled = false;
    this.resolve = resolve;
  }
  onOpen() {
    this.modalEl.addClass("dp-title-modal");
    this.titleEl.setText("Collect unfinished tasks");
    const desc = this.contentEl.createDiv({ cls: "dp-migrate-summary" });
    desc.createDiv({
      cls: "dp-migrate-summary-row",
      text: "Sweep unchecked tasks from which daily notes?"
    });
    const actions = this.contentEl.createDiv({ cls: "dp-edit-actions" });
    const past = actions.createEl("button", {
      cls: "dp-edit-save-btn mod-cta",
      text: "All past"
    });
    past.type = "button";
    past.addEventListener("click", () => this.finish("past"));
    const today = actions.createEl("button", {
      cls: "dp-edit-show-btn",
      text: "Today"
    });
    today.type = "button";
    today.addEventListener("click", () => this.finish("today"));
    const cancel = actions.createEl("button", {
      cls: "dp-edit-show-btn",
      text: "Cancel"
    });
    cancel.type = "button";
    cancel.addEventListener("click", () => this.close());
  }
  finish(scope) {
    this.settled = true;
    this.close();
    this.resolve(scope);
  }
  onClose() {
    this.contentEl.empty();
    if (!this.settled)
      this.resolve(null);
  }
};
var ConfirmModal = class extends import_obsidian6.Modal {
  constructor(app, plan, resolve) {
    super(app);
    this.settled = false;
    this.plan = plan;
    this.resolve = resolve;
  }
  onOpen() {
    this.modalEl.addClass("dp-title-modal");
    this.modalEl.addClass("dp-migrate-modal");
    this.titleEl.setText("Migrate unfinished tasks");
    const summary = this.contentEl.createDiv({ cls: "dp-migrate-summary" });
    const row = summary.createDiv({ cls: "dp-migrate-summary-row" });
    row.createSpan({ cls: "dp-migrate-summary-label", text: "Inbox" });
    row.createSpan({
      cls: "dp-migrate-summary-value",
      text: this.plan.inboxPath
    });
    const stats = this.contentEl.createDiv({ cls: "dp-migrate-stats" });
    const fileWord = this.plan.edits.length === 1 ? "file" : "files";
    const taskWord = this.plan.totalCount === 1 ? "task" : "tasks";
    stats.setText(
      `Migrating ${this.plan.totalCount} ${taskWord} from ${this.plan.edits.length} ${fileWord}.`
    );
    const list = this.contentEl.createDiv({ cls: "dp-migrate-files" });
    const previewLimit = 30;
    const titles = this.plan.previewTitles.slice(0, previewLimit);
    for (const title of titles) {
      const r = list.createDiv({ cls: "dp-migrate-file-row" });
      r.createSpan({ cls: "dp-migrate-file-path", text: title });
    }
    if (this.plan.previewTitles.length > previewLimit) {
      const r = list.createDiv({ cls: "dp-migrate-file-row" });
      r.createSpan({
        cls: "dp-migrate-file-path",
        text: `\u2026and ${this.plan.previewTitles.length - previewLimit} more`
      });
    }
    const actions = this.contentEl.createDiv({ cls: "dp-edit-actions" });
    const cancel = actions.createEl("button", {
      cls: "dp-edit-show-btn",
      text: "Cancel"
    });
    cancel.type = "button";
    cancel.addEventListener("click", () => this.close());
    const apply = actions.createEl("button", {
      cls: "dp-edit-save-btn mod-cta",
      text: `Migrate ${this.plan.totalCount} ${taskWord}`
    });
    apply.type = "button";
    apply.addEventListener("click", () => {
      this.settled = true;
      this.close();
      this.resolve(true);
    });
  }
  onClose() {
    this.contentEl.empty();
    if (!this.settled)
      this.resolve(false);
  }
};
async function buildMigrationPlan(plugin, options, inboxPath, scope) {
  const today = todayDateStr();
  const candidates = listDailyNotes(plugin.app, options).filter(
    ({ file, date }) => {
      if (file.path === inboxPath)
        return false;
      if (scope === "past")
        return date < today;
      return date === today;
    }
  );
  const prefixes = plugin.settings.prefixes;
  const idLength = plugin.settings.taskIdLength;
  const edits = [];
  let totalCount = 0;
  const previewTitles = [];
  for (const { file, date } of candidates) {
    const content = await plugin.app.vault.read(file);
    const result = scanContent(content, date, prefixes, idLength);
    if (result.inboxLines.length === 0)
      continue;
    edits.push({
      file,
      date,
      edits: result.edits,
      inboxLines: result.inboxLines
    });
    totalCount += result.inboxLines.length;
    for (const line of result.inboxLines) {
      previewTitles.push(extractTitle(line));
    }
  }
  return { edits, totalCount, inboxPath, previewTitles };
}
function scanContent(content, date, prefixes, idLength) {
  const lines = content.split("\n");
  const taskLines = [];
  for (let i2 = 0; i2 < lines.length; i2++) {
    const m = TASK_LINE2.exec(lines[i2]);
    if (!m)
      continue;
    const ch = m[2];
    taskLines.push({
      lineNumber: i2,
      indent: m[1],
      checked: ch === "x" || ch === "X",
      migrated: ch === ">",
      body: m[3],
      rawLine: lines[i2]
    });
  }
  const edits = [];
  const inboxLines = [];
  let i = 0;
  while (i < taskLines.length) {
    const t = taskLines[i];
    if (t.checked || t.migrated || !isMigrationRoot(taskLines, i)) {
      i++;
      continue;
    }
    const subtree = [t];
    let k = i + 1;
    while (k < taskLines.length) {
      const next = taskLines[k];
      if (next.indent.length <= t.indent.length)
        break;
      if (!next.checked && !next.migrated)
        subtree.push(next);
      k++;
    }
    appendBlockToPlan(subtree, t, date, prefixes, idLength, edits, inboxLines);
    i = k;
  }
  return { edits, inboxLines };
}
function isMigrationRoot(taskLines, i) {
  const t = taskLines[i];
  for (let j = i - 1; j >= 0; j--) {
    const a = taskLines[j];
    if (a.indent.length < t.indent.length) {
      return a.checked || a.migrated;
    }
  }
  return true;
}
function appendBlockToPlan(subtree, root, date, prefixes, idLength, edits, inboxLines) {
  for (const line of subtree) {
    let id = parseTaskId(line.body, prefixes);
    let updatedSource = line.rawLine;
    if (!id) {
      id = generateTaskId(idLength);
      updatedSource = setTaskIdTag(updatedSource, id, prefixes);
    }
    const migratedSource = setTaskMigrated(updatedSource);
    const rebasedIndent = stripIndentPrefix(line.indent, root.indent);
    const sourceBodyMatch = TASK_LINE2.exec(updatedSource);
    const inboxBody = sourceBodyMatch ? sourceBodyMatch[3] : line.body;
    let inboxLine = `${rebasedIndent}- [ ] ${inboxBody}`;
    if (parseTaskCreated(inboxBody, prefixes) === null) {
      inboxLine = setTaskCreatedTag(inboxLine, date, prefixes);
    }
    edits.push({
      lineNumber: line.lineNumber,
      oldText: line.rawLine,
      newText: migratedSource
    });
    inboxLines.push(inboxLine);
  }
}
function stripIndentPrefix(indent, rootIndent) {
  if (indent.startsWith(rootIndent))
    return indent.slice(rootIndent.length);
  return indent;
}
async function applyPlan(app, plan) {
  for (const fe of plan.edits) {
    await app.vault.process(fe.file, (content) => {
      const lines = content.split("\n");
      for (const e of fe.edits) {
        if (lines[e.lineNumber] === e.oldText) {
          lines[e.lineNumber] = e.newText;
        }
      }
      return lines.join("\n");
    });
  }
  const allInboxLines = [];
  for (const fe of plan.edits)
    allInboxLines.push(...fe.inboxLines);
  await appendToInbox(app, plan.inboxPath, allInboxLines);
}
async function appendToInbox(app, inboxPath, newLines) {
  if (newLines.length === 0)
    return;
  const payload = newLines.join("\n") + "\n";
  const existing = app.vault.getAbstractFileByPath(inboxPath);
  if (existing instanceof import_obsidian6.TFile) {
    await app.vault.process(existing, (content) => {
      if (content.length === 0)
        return payload;
      const sep = content.endsWith("\n") ? "" : "\n";
      return content + sep + payload;
    });
    return;
  }
  const slash = inboxPath.lastIndexOf("/");
  if (slash > 0) {
    const folder = inboxPath.slice(0, slash);
    if (!app.vault.getAbstractFileByPath(folder)) {
      await app.vault.createFolder(folder);
    }
  }
  await app.vault.create(inboxPath, payload);
}
function extractTitle(rawLine) {
  const m = TASK_LINE2.exec(rawLine);
  if (!m)
    return rawLine.trim();
  return m[3].replace(/#[A-Za-z][\w-]*(?:\/[\w./_-]+)?/g, "").replace(/\{[^{}]*\}/g, "").replace(/\s+/g, " ").trim();
}

// src/habitsView.ts
var import_obsidian7 = require("obsidian");
init_parser();
var VIEW_TYPE_HABITS_STATS = "today-habits-stats";
var UNCATEGORIZED = "Uncategorized";
var UNCATEGORIZED_COLOR = "#8a8f98";
var HabitsStatsView = class extends import_obsidian7.ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.rerenderTimer = null;
    this.activeTab = "habits";
    this.plugin = plugin;
  }
  getViewType() {
    return VIEW_TYPE_HABITS_STATS;
  }
  getDisplayText() {
    return "Reporting";
  }
  getIcon() {
    return "activity";
  }
  async onOpen() {
    this.registerEvent(
      this.app.vault.on("modify", () => this.scheduleRender())
    );
    this.registerEvent(
      this.app.vault.on("delete", () => this.scheduleRender())
    );
    this.registerEvent(
      this.app.metadataCache.on("changed", () => this.scheduleRender())
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
    root.addClass("today-root");
    root.addClass("dp-habit-stats");
    const settings = this.plugin.settings;
    const fallback = {
      folder: settings.dailyNoteFolderFallback,
      format: settings.dailyNoteFormatFallback,
      template: settings.dailyNoteTemplate,
      templatesByDay: settings.dailyNoteTemplatesByDay,
      dateLinkFormat: settings.dateLinkFormat,
      quotesFile: settings.quotesFile
    };
    const heading = root.createDiv({ cls: "dp-habit-stats-header" });
    heading.createEl("h3", { text: "Reporting" });
    this.renderTabs(root);
    const today = startOfDay(new Date());
    const window2 = settings.habitsStatsWindow;
    if (this.activeTab === "projects") {
      await this.renderProjectsByWeek(root, today, window2, fallback);
      return;
    }
    const { habits, goals } = await this.loadHabitsAndGoals();
    if (habits.length === 0 && goals.length === 0) {
      root.createDiv({
        cls: "dp-habit-stats-empty",
        text: `No habits found. Add tags like #${settings.habitPrefix}/day/<slug> to ${settings.habitsFile}.`
      });
      return;
    }
    if (this.activeTab === "workouts") {
      await this.renderWorkoutLog(root, today, window2, fallback);
      return;
    }
    const dayBuckets = this.buildDayBuckets(today, window2);
    const weekBuckets = this.buildWeekBuckets(today, window2);
    const monthBuckets = this.buildMonthBuckets(today, window2);
    const daySection = await this.buildSection(
      "Day",
      "day",
      dayBuckets,
      habits,
      goals,
      fallback
    );
    const weekSection = await this.buildSection(
      "Week",
      "week",
      weekBuckets,
      habits,
      goals,
      fallback
    );
    const monthSection = await this.buildSection(
      "Month",
      "month",
      monthBuckets,
      habits,
      goals,
      fallback
    );
    this.renderSection(root, daySection);
    this.renderSection(root, weekSection);
    this.renderSection(root, monthSection);
  }
  renderTabs(parent) {
    const tabsEl = parent.createDiv({ cls: "dp-habit-stats-tabs" });
    const make = (key, label) => {
      const el = tabsEl.createEl("button", {
        cls: "dp-habit-stats-tab" + (this.activeTab === key ? " is-active" : ""),
        text: label
      });
      el.onclick = () => {
        if (this.activeTab === key)
          return;
        this.activeTab = key;
        void this.render();
      };
    };
    make("habits", "Habits");
    make("workouts", "Workouts");
    make("projects", "Projects");
  }
  async renderWorkoutLog(parent, today, window2, fallback) {
    var _a, _b, _c, _d;
    const settings = this.plugin.settings;
    const days = [];
    for (let i = window2 - 1; i >= 0; i--)
      days.push(addDays(today, -i));
    const repsByDate = /* @__PURE__ */ new Map();
    const totalsByName = /* @__PURE__ */ new Map();
    for (const d of days) {
      const c = await this.plugin.habitsScanner.readDateContent(d, fallback);
      const m = /* @__PURE__ */ new Map();
      if (c) {
        const summaries = parseExercises(c, settings.prefixes);
        for (const s of summaries) {
          let reps = 0;
          for (const set of s.sets)
            if (set.done)
              reps += set.reps;
          if (reps > 0) {
            m.set(s.name, reps);
            totalsByName.set(s.name, ((_a = totalsByName.get(s.name)) != null ? _a : 0) + reps);
          }
        }
      }
      repsByDate.set(d.getTime(), m);
    }
    const sectionEl = parent.createDiv({ cls: "dp-heatmap-section" });
    if (totalsByName.size === 0) {
      sectionEl.createDiv({
        cls: "dp-heatmap-no-habits",
        text: "No completed exercise sets in this window."
      });
      return;
    }
    const sortedNames = Array.from(totalsByName.entries()).sort((a, b) => b[1] - a[1]).map(([n]) => n);
    const table = sectionEl.createEl("table", { cls: "dp-workout-log" });
    const thead = table.createEl("thead");
    const headRow = thead.createEl("tr");
    headRow.createEl("th", { cls: "dp-workout-log-name-h", text: "Exercise" });
    for (const d of days) {
      const th = headRow.createEl("th", {
        cls: "dp-workout-log-date" + (d.getTime() === today.getTime() ? " is-current" : ""),
        text: d.getDate().toString()
      });
      th.title = d.toLocaleDateString(void 0, {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric"
      });
    }
    headRow.createEl("th", { cls: "dp-workout-log-total-h", text: "Total" });
    const tbody = table.createEl("tbody");
    for (const name of sortedNames) {
      const tr = tbody.createEl("tr");
      tr.createEl("td", { cls: "dp-workout-log-name", text: name });
      for (const d of days) {
        const reps = (_c = (_b = repsByDate.get(d.getTime())) == null ? void 0 : _b.get(name)) != null ? _c : 0;
        const td = tr.createEl("td", {
          cls: "dp-workout-log-cell" + (reps === 0 ? " is-empty" : "") + (d.getTime() === today.getTime() ? " is-current" : ""),
          text: reps > 0 ? reps.toString() : ""
        });
        td.title = `${name} \xB7 ${d.toLocaleDateString(void 0, {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric"
        })}
${reps} ${reps === 1 ? "rep" : "reps"}`;
      }
      tr.createEl("td", {
        cls: "dp-workout-log-total",
        text: ((_d = totalsByName.get(name)) != null ? _d : 0).toLocaleString()
      });
    }
  }
  async renderProjectsByWeek(parent, today, window2, fallback) {
    const dayBuckets = this.buildDayBuckets(today, 7);
    const weekBuckets = this.buildWeekBuckets(today, window2);
    const monthBuckets = this.buildMonthBuckets(today, window2);
    await this.renderProjectsPivot(parent, "Day", "day", dayBuckets, fallback);
    await this.renderProjectsPivot(parent, "Week", "week", weekBuckets, fallback);
    await this.renderProjectsPivot(
      parent,
      "Month",
      "month",
      monthBuckets,
      fallback
    );
  }
  async renderProjectsPivot(parent, name, period, buckets, fallback) {
    const settings = this.plugin.settings;
    const totals = /* @__PURE__ */ new Map();
    const colTotals = new Array(buckets.length).fill(0);
    let grandTotal = 0;
    for (let bi = 0; bi < buckets.length; bi++) {
      const b = buckets[bi];
      for (const d of enumerateDailyNoteDatesInRange(b.start, b.end)) {
        const content = await this.plugin.habitsScanner.readDateContent(
          d,
          fallback
        );
        if (!content)
          continue;
        const tasks = parseFileTasks(
          "",
          content,
          settings.prefixes,
          settings.defaultDurationMin
        );
        for (const t of tasks) {
          if (!t.checked)
            continue;
          if (t.durationMin <= 0)
            continue;
          const key = t.project || UNCATEGORIZED;
          let row = totals.get(key);
          if (!row) {
            row = new Array(buckets.length).fill(0);
            totals.set(key, row);
          }
          row[bi] += t.durationMin;
          colTotals[bi] += t.durationMin;
          grandTotal += t.durationMin;
        }
      }
    }
    const sectionEl = parent.createDiv({ cls: "dp-heatmap-section" });
    const titleEl = sectionEl.createDiv({ cls: "dp-heatmap-row-title" });
    titleEl.createSpan({ cls: "dp-heatmap-row-name", text: name });
    titleEl.createSpan({ cls: "dp-heatmap-row-sep", text: " \xB7 " });
    titleEl.createSpan({
      cls: "dp-heatmap-row-range",
      text: formatBucketsRange(buckets, period)
    });
    if (totals.size === 0) {
      sectionEl.createDiv({
        cls: "dp-heatmap-no-habits",
        text: `No completed tasks in this ${name.toLowerCase()} window.`
      });
      return;
    }
    const colorMap = resolveProjectColors(
      Array.from(totals.keys()).filter((p) => p !== UNCATEGORIZED).map((p) => ({ project: p })),
      settings.projectColors
    );
    const rows = Array.from(totals.entries()).map(([rowName, cells]) => ({
      name: rowName,
      cells,
      rowTotal: cells.reduce((a, b) => a + b, 0)
    })).sort((a, b) => {
      const au = a.name === UNCATEGORIZED ? 1 : 0;
      const bu = b.name === UNCATEGORIZED ? 1 : 0;
      if (au !== bu)
        return au - bu;
      return b.rowTotal - a.rowTotal || a.name.localeCompare(b.name);
    });
    const table = sectionEl.createEl("table", { cls: "dp-workout-log" });
    const thead = table.createEl("thead");
    const headRow = thead.createEl("tr");
    headRow.createEl("th", { cls: "dp-workout-log-name-h", text: "Project" });
    for (const b of buckets) {
      const th = headRow.createEl("th", {
        cls: "dp-workout-log-date" + (b.isCurrent ? " is-current" : ""),
        text: formatPivotColLabel(b, period)
      });
      th.title = b.tooltip;
    }
    headRow.createEl("th", { cls: "dp-workout-log-total-h", text: "Total" });
    const tbody = table.createEl("tbody");
    for (const row of rows) {
      const tr = tbody.createEl("tr");
      const nameTd = tr.createEl("td", { cls: "dp-workout-log-name" });
      const swatch = nameTd.createSpan({ cls: "dp-st-swatch" });
      const color = row.name === UNCATEGORIZED ? UNCATEGORIZED_COLOR : colorMap.get(row.name);
      if (color)
        swatch.style.backgroundColor = color;
      nameTd.createSpan({ text: row.name });
      for (let i = 0; i < buckets.length; i++) {
        const mins = row.cells[i];
        const td = tr.createEl("td", {
          cls: "dp-workout-log-cell" + (mins === 0 ? " is-empty" : "") + (buckets[i].isCurrent ? " is-current" : ""),
          text: mins > 0 ? formatHoursDecimal(mins) : ""
        });
        td.title = `${row.name} \xB7 ${buckets[i].tooltip}
${formatHoursDecimal(mins)}`;
      }
      tr.createEl("td", {
        cls: "dp-workout-log-total",
        text: formatHoursDecimal(row.rowTotal)
      });
    }
    const tfoot = table.createEl("tfoot");
    const footRow = tfoot.createEl("tr");
    footRow.createEl("td", {
      cls: "dp-workout-log-name dp-workout-log-foot",
      text: "Total"
    });
    for (let i = 0; i < buckets.length; i++) {
      footRow.createEl("td", {
        cls: "dp-workout-log-cell dp-workout-log-foot" + (colTotals[i] === 0 ? " is-empty" : "") + (buckets[i].isCurrent ? " is-current" : ""),
        text: colTotals[i] > 0 ? formatHoursDecimal(colTotals[i]) : ""
      });
    }
    footRow.createEl("td", {
      cls: "dp-workout-log-total dp-workout-log-foot",
      text: formatHoursDecimal(grandTotal)
    });
  }
  async loadHabitsAndGoals() {
    const path = this.plugin.settings.habitsFile;
    const f = this.app.vault.getAbstractFileByPath(path);
    if (!(f instanceof import_obsidian7.TFile))
      return { habits: [], goals: [] };
    const content = await this.plugin.habitsScanner.getContent(f);
    const settings = this.plugin.settings;
    return {
      habits: parseHabitsFile(content, settings.habitPrefix),
      goals: parseExerciseGoals(content, settings.prefixes.exercise)
    };
  }
  buildDayBuckets(today, count) {
    const out = [];
    for (let i = count - 1; i >= 0; i--) {
      const start = addDays(today, -i);
      const end = addDays(start, 1);
      out.push({
        start,
        end,
        label: start.getDate().toString(),
        tooltip: start.toLocaleDateString(void 0, {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric"
        }),
        isCurrent: i === 0
      });
    }
    return out;
  }
  buildWeekBuckets(today, count) {
    const weekStart = this.plugin.settings.habitWeekStart;
    const thisWeek = weekRange(today, weekStart);
    const out = [];
    for (let i = count - 1; i >= 0; i--) {
      const start = addDays(thisWeek.start, -7 * i);
      const end = addDays(start, 7);
      out.push({
        start,
        end,
        label: start.getDate().toString(),
        tooltip: `Week of ${start.toLocaleDateString(void 0, {
          month: "short",
          day: "numeric",
          year: "numeric"
        })}`,
        isCurrent: i === 0
      });
    }
    return out;
  }
  buildMonthBuckets(today, count) {
    const thisMonth = monthRange(today);
    const out = [];
    for (let i = count - 1; i >= 0; i--) {
      const start = addMonths(thisMonth.start, -i);
      const end = addMonths(start, 1);
      out.push({
        start,
        end,
        label: start.toLocaleDateString(void 0, { month: "short" }).slice(0, 3),
        tooltip: start.toLocaleDateString(void 0, {
          month: "long",
          year: "numeric"
        }),
        isCurrent: i === 0
      });
    }
    return out;
  }
  async buildSection(name, period, buckets, allHabits, allGoals, fallback) {
    var _a, _b, _c;
    const settings = this.plugin.settings;
    const habits = allHabits.filter((h) => h.period === period);
    const goals = allGoals.filter((g) => g.period === period);
    const dateMap = /* @__PURE__ */ new Map();
    for (const b of buckets) {
      for (const d of enumerateDailyNoteDatesInRange(b.start, b.end)) {
        const day = startOfDay(d);
        dateMap.set(day.getTime(), day);
      }
    }
    const contentByTime = /* @__PURE__ */ new Map();
    for (const [t, d] of dateMap) {
      const c = await this.plugin.habitsScanner.readDateContent(d, fallback);
      if (c)
        contentByTime.set(t, c);
    }
    const rows = [];
    for (const h of habits) {
      const cells = [];
      let totalChecked = 0;
      let hits = 0;
      for (const b of buckets) {
        let count = 0;
        for (const d of enumerateDailyNoteDatesInRange(b.start, b.end)) {
          const c = contentByTime.get(startOfDay(d).getTime());
          if (!c)
            continue;
          const lines = findHabitTaskLines(
            c,
            settings.habitPrefix,
            h.slug
          );
          for (const l of lines)
            if (l.checked)
              count += l.count;
        }
        cells.push({ bucket: b, checkedCount: count });
        totalChecked += count;
        if (count >= h.target)
          hits++;
      }
      rows.push({ habit: h, cells, totalChecked, hits });
    }
    let totalReps = 0;
    const exerciseTotals = /* @__PURE__ */ new Map();
    const doneRepsByDate = /* @__PURE__ */ new Map();
    for (const [t, c] of contentByTime) {
      const summaries = parseExercises(c, settings.prefixes);
      const doneByName = /* @__PURE__ */ new Map();
      for (const s of summaries) {
        for (const set of s.sets) {
          if (!set.done)
            continue;
          totalReps += set.reps;
          exerciseTotals.set(
            s.name,
            ((_a = exerciseTotals.get(s.name)) != null ? _a : 0) + set.reps
          );
          doneByName.set(s.name, ((_b = doneByName.get(s.name)) != null ? _b : 0) + set.reps);
        }
      }
      if (doneByName.size > 0)
        doneRepsByDate.set(t, doneByName);
    }
    const goalRows = [];
    for (const g of goals) {
      const cells = [];
      let metCount = 0;
      for (const b of buckets) {
        let reps = 0;
        for (const d of enumerateDailyNoteDatesInRange(b.start, b.end)) {
          const m = doneRepsByDate.get(startOfDay(d).getTime());
          if (!m)
            continue;
          reps += (_c = m.get(g.name)) != null ? _c : 0;
        }
        const met = reps >= g.target;
        cells.push({ bucket: b, reps, target: g.target, met });
        if (met)
          metCount++;
      }
      goalRows.push({ goal: g, cells, metCount });
    }
    return {
      name,
      period,
      dateRange: formatBucketsRange(buckets, period),
      buckets,
      rows,
      goalRows,
      totalReps,
      exerciseTotals
    };
  }
  renderSection(parent, section) {
    const sectionEl = parent.createDiv({ cls: "dp-heatmap-section" });
    const titleEl = sectionEl.createDiv({ cls: "dp-heatmap-row-title" });
    titleEl.createSpan({ cls: "dp-heatmap-row-name", text: section.name });
    titleEl.createSpan({ cls: "dp-heatmap-row-sep", text: " \xB7 " });
    titleEl.createSpan({
      cls: "dp-heatmap-row-range",
      text: section.dateRange
    });
    if (section.rows.length === 0 && section.goalRows.length === 0) {
      sectionEl.createDiv({
        cls: "dp-heatmap-no-habits",
        text: `No ${section.name.toLowerCase()} habits.`
      });
    } else if (section.rows.length === 0) {
    } else {
      const grid = sectionEl.createDiv({ cls: "dp-heatmap-grid-rows" });
      const cellCols = section.buckets.map(() => "12px").join(" ");
      grid.style.gridTemplateColumns = `140px ${cellCols}`;
      if (section.period === "week") {
        grid.createDiv({ cls: "dp-heatmap-band-corner" });
        const bands = buildMonthBands(section.buckets);
        for (const band of bands) {
          const bandEl = grid.createDiv({
            cls: "dp-heatmap-band-label",
            text: band.label
          });
          bandEl.style.gridColumn = `span ${band.span}`;
        }
      }
      grid.createDiv({ cls: "dp-heatmap-corner" });
      for (const b of section.buckets) {
        const labelEl = grid.createDiv({
          cls: "dp-heatmap-col-label" + (b.isCurrent ? " is-current" : ""),
          text: b.label
        });
        labelEl.title = b.tooltip;
      }
      for (const row of section.rows) {
        const labelEl = grid.createDiv({ cls: "dp-heatmap-habit-label" });
        labelEl.createSpan({
          cls: "dp-heatmap-habit-name",
          text: row.habit.slug
        });
        if (row.habit.target > 1) {
          labelEl.createSpan({
            cls: "dp-heatmap-habit-target",
            text: `\u2265${row.habit.target}`
          });
        }
        const summary = `${row.hits}/${row.cells.length}`;
        labelEl.createSpan({
          cls: "dp-heatmap-habit-summary",
          text: summary
        });
        if (row.habit.label)
          labelEl.title = row.habit.label;
        for (const cell of row.cells) {
          const intensity = row.habit.target > 1 ? cell.checkedCount >= row.habit.target ? 4 : 0 : quintile(cell.checkedCount);
          const cellEl = grid.createDiv({
            cls: "dp-heatmap-cell q" + intensity + (cell.bucket.isCurrent ? " is-current" : "")
          });
          const word = cell.checkedCount === 1 ? "completion" : "completions";
          const targetSuffix = row.habit.target > 1 ? ` (target ${row.habit.target})` : "";
          cellEl.title = `${row.habit.slug} \xB7 ${cell.bucket.tooltip}
${cell.checkedCount} ${word}${targetSuffix}`;
        }
      }
    }
    const totals = sectionEl.createDiv({ cls: "dp-heatmap-totals" });
    totals.createSpan({
      cls: "dp-heatmap-total-reps",
      text: section.totalReps.toLocaleString()
    });
    totals.appendText(" reps");
    if (section.exerciseTotals.size > 0) {
      totals.createSpan({ cls: "dp-heatmap-sep", text: " \u2022 " });
      const sorted = Array.from(section.exerciseTotals.entries()).sort(
        (a, b) => b[1] - a[1]
      );
      sorted.forEach(([name, reps], idx) => {
        if (idx > 0) {
          totals.createSpan({
            cls: "dp-heatmap-breakdown-sep",
            text: " \xB7 "
          });
        }
        const item = totals.createSpan({ cls: "dp-heatmap-breakdown-item" });
        item.createSpan({ cls: "dp-heatmap-breakdown-name", text: name });
        item.appendText(" ");
        item.createSpan({
          cls: "dp-heatmap-breakdown-reps",
          text: reps.toLocaleString()
        });
      });
    }
    if (section.goalRows.length > 0) {
      const grid = sectionEl.createDiv({
        cls: "dp-heatmap-grid-rows dp-heatmap-grid-goals"
      });
      const cellCols = section.buckets.map(() => "12px").join(" ");
      grid.style.gridTemplateColumns = `140px ${cellCols}`;
      for (const row of section.goalRows) {
        const labelEl = grid.createDiv({ cls: "dp-heatmap-habit-label" });
        labelEl.createSpan({
          cls: "dp-heatmap-habit-name",
          text: row.goal.name
        });
        labelEl.createSpan({
          cls: "dp-heatmap-habit-target",
          text: `\u2265${row.goal.target}`
        });
        labelEl.createSpan({
          cls: "dp-heatmap-habit-summary",
          text: `${row.metCount}/${row.cells.length}`
        });
        if (row.goal.label)
          labelEl.title = row.goal.label;
        for (const cell of row.cells) {
          const cellEl = grid.createDiv({
            cls: "dp-heatmap-cell q" + (cell.met ? "4" : "0") + (cell.bucket.isCurrent ? " is-current" : "")
          });
          const pct = cell.target > 0 ? Math.round(cell.reps / cell.target * 100) : 0;
          cellEl.title = `${row.goal.name} \xB7 ${cell.bucket.tooltip}
${cell.reps}/${cell.target} reps (${pct}%)`;
        }
      }
    }
  }
};
function buildMonthBands(buckets) {
  const out = [];
  let current = null;
  for (const b of buckets) {
    const key = `${b.start.getFullYear()}-${b.start.getMonth()}`;
    if (current && current.key === key) {
      current.span++;
    } else {
      if (current)
        out.push({ label: current.label, span: current.span });
      const label = b.start.toLocaleDateString(void 0, { month: "short" });
      current = { key, label, span: 1 };
    }
  }
  if (current)
    out.push({ label: current.label, span: current.span });
  return out;
}
function quintile(count) {
  if (count <= 0)
    return 0;
  if (count === 1)
    return 1;
  if (count === 2)
    return 2;
  if (count === 3)
    return 3;
  return 4;
}
function formatPivotColLabel(bucket, period) {
  if (period === "day") {
    return bucket.start.toLocaleDateString(void 0, { weekday: "short" });
  }
  if (period === "month") {
    return bucket.start.toLocaleDateString(void 0, { month: "short" });
  }
  return bucket.start.toLocaleDateString(void 0, {
    month: "numeric",
    day: "numeric"
  });
}
function formatBucketsRange(buckets, period) {
  if (buckets.length === 0)
    return "";
  const first = buckets[0].start;
  const last = buckets[buckets.length - 1].end;
  return period === "month" ? formatMonthRange(first, last) : formatDayRange(first, last);
}
function formatDayRange(start, endExclusive) {
  const last = addDays(endExclusive, -1);
  const sameYear = start.getFullYear() === last.getFullYear();
  const startStr = start.toLocaleDateString(void 0, {
    month: "short",
    day: "numeric",
    ...sameYear ? {} : { year: "numeric" }
  });
  const endStr = last.toLocaleDateString(void 0, {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
  return `${startStr} \u2013 ${endStr}`;
}
function formatMonthRange(start, endExclusive) {
  const last = addMonths(endExclusive, -1);
  const sameYear = start.getFullYear() === last.getFullYear();
  const startStr = start.toLocaleDateString(void 0, {
    month: "short",
    ...sameYear ? {} : { year: "numeric" }
  });
  const endStr = last.toLocaleDateString(void 0, {
    month: "short",
    year: "numeric"
  });
  return `${startStr} \u2013 ${endStr}`;
}

// src/multiDayView.ts
var import_obsidian9 = require("obsidian");

// src/multiDay.ts
var import_obsidian8 = require("obsidian");
init_parser();
function buildFallback(settings) {
  return {
    folder: settings.dailyNoteFolderFallback,
    format: settings.dailyNoteFormatFallback,
    template: settings.dailyNoteTemplate,
    templatesByDay: settings.dailyNoteTemplatesByDay,
    dateLinkFormat: settings.dateLinkFormat,
    prefixes: settings.prefixes,
    quotesFile: settings.quotesFile,
    addCreatedTag: settings.addCreatedTagToFrontmatter
  };
}
async function loadInboxTasks(app, settings) {
  const path = resolveInboxPath(
    settings.inboxPath,
    settings.dailyNoteFolderFallback
  );
  if (!path)
    return { path: "", file: null, tasks: [] };
  const af = app.vault.getAbstractFileByPath(path);
  if (!(af instanceof import_obsidian8.TFile))
    return { path, file: null, tasks: [] };
  const content = await app.vault.read(af);
  const all = parseFileTasks(
    path,
    content,
    settings.prefixes,
    settings.defaultDurationMin
  );
  return { path, file: af, tasks: all.filter((t) => !t.checked) };
}
async function loadDayWindow(app, settings, anchor, count) {
  const fallback = buildFallback(settings);
  const start = startOfDay(anchor);
  const out = [];
  for (let i = 0; i < count; i++) {
    const date = addDays(start, i);
    const resolved = await resolveDailyNote(app, date, fallback);
    let tasks = [];
    if (resolved.file) {
      const content = await app.vault.read(resolved.file);
      tasks = parseFileTasks(
        resolved.path,
        content,
        settings.prefixes,
        settings.defaultDurationMin
      );
    }
    out.push({ date, path: resolved.path, file: resolved.file, tasks });
  }
  return out;
}
function summarizeWindow(days, projectColors) {
  var _a, _b, _c;
  const allTasks = [];
  for (const d of days)
    for (const t of d.tasks)
      allTasks.push(t);
  const colorInputs = allTasks.filter((t) => !!t.project).map((t) => ({ project: t.project, subproject: t.subproject }));
  const colorMap = resolveProjectColors(colorInputs, projectColors);
  const minutesByKey = /* @__PURE__ */ new Map();
  for (const t of allTasks) {
    if (t.startMin === null)
      continue;
    const key = (_a = t.project) != null ? _a : "Unassigned";
    minutesByKey.set(key, ((_b = minutesByKey.get(key)) != null ? _b : 0) + t.durationMin);
  }
  const byProject = [];
  let totalMin = 0;
  for (const [project, minutes] of minutesByKey) {
    totalMin += minutes;
    const color = project === "Unassigned" ? "#7B8794" : (_c = getTaskColor(project, null, colorMap)) != null ? _c : "#7B8794";
    byProject.push({ project, minutes, color });
  }
  byProject.sort((a, b) => b.minutes - a.minutes);
  return { totalMin, byProject };
}
function buildWindowColorMap(days, inbox, projectColors) {
  const all = [];
  for (const d of days)
    for (const t of d.tasks)
      if (t.project)
        all.push({ project: t.project, subproject: t.subproject });
  for (const t of inbox)
    if (t.project)
      all.push({ project: t.project, subproject: t.subproject });
  return resolveProjectColors(all, projectColors);
}
function colorFor(task, colorMap) {
  return getTaskColor(task.project, task.subproject, colorMap);
}

// src/multiDayView.ts
init_parser();
var VIEW_TYPE_MULTI_DAY = "today-multi-day";
var VISIBLE_DAYS = 3;
var TIMELINE_PX_PER_MIN = 0.9;
var INBOX_PX_PER_MIN = 0.6;
var INBOX_FLAT_HEIGHT_PX = 28;
var MultiDayView = class extends import_obsidian9.ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.rerenderTimer = null;
    this.anchor = startOfDay(new Date());
    this.searchQuery = "";
    this.projectFilter = /* @__PURE__ */ new Set();
    this.filterAllSelected = true;
    this.inboxProportionalHeights = false;
    this.days = [];
    this.inbox = { path: "", file: null, tasks: [] };
    this.dragState = null;
    this.dropIndicator = null;
    this.plugin = plugin;
  }
  getViewType() {
    return VIEW_TYPE_MULTI_DAY;
  }
  getDisplayText() {
    return "Multi-day";
  }
  getIcon() {
    return "calendar-days";
  }
  async onOpen() {
    this.registerEvent(
      this.app.vault.on("modify", () => this.scheduleRefresh())
    );
    this.registerEvent(
      this.app.vault.on("delete", () => this.scheduleRefresh())
    );
    this.registerEvent(
      this.app.vault.on("create", () => this.scheduleRefresh())
    );
    await this.refresh();
  }
  async onClose() {
    if (this.rerenderTimer !== null)
      window.clearTimeout(this.rerenderTimer);
  }
  scheduleRefresh() {
    if (this.rerenderTimer !== null)
      window.clearTimeout(this.rerenderTimer);
    this.rerenderTimer = window.setTimeout(() => {
      this.rerenderTimer = null;
      void this.refresh();
    }, 100);
  }
  async refresh() {
    const [d, i] = await Promise.all([
      loadDayWindow(this.app, this.plugin.settings, this.anchor, VISIBLE_DAYS),
      loadInboxTasks(this.app, this.plugin.settings)
    ]);
    this.days = d;
    this.inbox = i;
    this.render();
  }
  render() {
    const root = this.containerEl.children[1];
    root.empty();
    root.addClass("today-root");
    root.addClass("dp-multiday");
    const wrap = root.createDiv({ cls: "dp-md-root" });
    this.renderHeader(wrap);
    const colorMap = buildWindowColorMap(
      this.days,
      this.inbox.tasks,
      this.plugin.settings.projectColors
    );
    const summary = summarizeWindow(this.days, this.plugin.settings.projectColors);
    this.renderSummary(wrap, summary);
    const body = wrap.createDiv({ cls: "dp-md-body" });
    this.renderInbox(body, colorMap);
    this.renderGrid(body, colorMap);
  }
  // ---------- header ----------
  renderHeader(parent) {
    const header = parent.createDiv({ cls: "dp-md-header" });
    const nav = header.createDiv({ cls: "dp-md-nav" });
    const prev = nav.createEl("button", {
      cls: "dp-md-nav-btn",
      text: "\u2039",
      attr: { "aria-label": "Previous days" }
    });
    prev.addEventListener("click", () => {
      this.anchor = addDays(this.anchor, -VISIBLE_DAYS);
      void this.refresh();
    });
    const today = nav.createEl("button", {
      cls: "dp-md-today-btn",
      text: "Today"
    });
    today.addEventListener("click", () => {
      this.anchor = startOfDay(new Date());
      void this.refresh();
    });
    const next = nav.createEl("button", {
      cls: "dp-md-nav-btn",
      text: "\u203A",
      attr: { "aria-label": "Next days" }
    });
    next.addEventListener("click", () => {
      this.anchor = addDays(this.anchor, VISIBLE_DAYS);
      void this.refresh();
    });
    const range = header.createDiv({ cls: "dp-md-range" });
    const last = addDays(this.anchor, VISIBLE_DAYS - 1);
    range.setText(`${this.fmtRangeDate(this.anchor)} \u2013 ${this.fmtRangeDate(last)}`);
  }
  fmtRangeDate(d) {
    return d.toLocaleDateString(void 0, {
      month: "short",
      day: "numeric"
    });
  }
  // ---------- summary ----------
  renderSummary(parent, summary) {
    const wrap = parent.createDiv({ cls: "dp-md-summary" });
    if (summary.totalMin === 0) {
      wrap.createDiv({
        cls: "dp-md-summary-empty",
        text: "No scheduled time in this window."
      });
      return;
    }
    const bar = wrap.createDiv({ cls: "dp-md-summary-bar" });
    for (const p of summary.byProject) {
      const seg = bar.createDiv({ cls: "dp-md-summary-seg" });
      seg.style.width = `${p.minutes / summary.totalMin * 100}%`;
      seg.style.background = p.color;
      seg.setAttribute("title", `${p.project} \xB7 ${fmtMin(p.minutes)}`);
    }
    const legend = wrap.createDiv({ cls: "dp-md-summary-legend" });
    legend.createSpan({
      cls: "dp-md-summary-total",
      text: `${fmtMin(summary.totalMin)} total`
    });
    for (const p of summary.byProject) {
      const chip = legend.createSpan({ cls: "dp-md-summary-chip" });
      const dot = chip.createSpan({ cls: "dp-md-summary-dot" });
      dot.style.background = p.color;
      chip.createSpan({ cls: "dp-md-summary-name", text: p.project });
      chip.createSpan({
        cls: "dp-md-summary-min",
        text: fmtMin(p.minutes)
      });
    }
  }
  // ---------- inbox panel (left) ----------
  renderInbox(parent, colorMap) {
    var _a;
    const panel = parent.createDiv({ cls: "dp-md-inbox" });
    const header = panel.createDiv({ cls: "dp-md-inbox-header" });
    header.createSpan({ cls: "dp-md-inbox-title", text: "Inbox" });
    const count = header.createSpan({ cls: "dp-md-inbox-count" });
    panel.addEventListener("dragover", (ev) => {
      if (!this.dragState || this.dragState.origin !== "day")
        return;
      if (!this.inbox.file)
        return;
      ev.preventDefault();
      if (ev.dataTransfer)
        ev.dataTransfer.dropEffect = "move";
      panel.addClass("is-drop-target");
    });
    panel.addEventListener("dragleave", (ev) => {
      const related = ev.relatedTarget;
      if (!related || !panel.contains(related))
        panel.removeClass("is-drop-target");
    });
    panel.addEventListener("drop", (ev) => {
      panel.removeClass("is-drop-target");
      if (!this.dragState || this.dragState.origin !== "day")
        return;
      if (!this.inbox.file)
        return;
      ev.preventDefault();
      void this.dropToInbox(this.dragState);
    });
    const controls = panel.createDiv({ cls: "dp-md-inbox-controls" });
    const search = controls.createEl("input", {
      cls: "dp-md-inbox-search",
      attr: { type: "text", placeholder: "Search inbox" }
    });
    search.value = this.searchQuery;
    search.addEventListener("input", () => {
      this.searchQuery = search.value;
      this.renderInboxList(panel, listEl, count, colorMap);
    });
    const heightToggle = controls.createEl("button", {
      cls: "dp-md-inbox-height-toggle",
      text: this.inboxProportionalHeights ? "Flat" : "Duration",
      attr: { "aria-label": "Toggle inbox row height" }
    });
    heightToggle.addEventListener("click", () => {
      this.inboxProportionalHeights = !this.inboxProportionalHeights;
      heightToggle.setText(
        this.inboxProportionalHeights ? "Flat" : "Duration"
      );
      this.renderInboxList(panel, listEl, count, colorMap);
    });
    const chipRow = panel.createDiv({ cls: "dp-md-inbox-filters" });
    const projects = uniqueProjects(this.inbox.tasks);
    const allChip = chipRow.createSpan({
      cls: "dp-md-filter-chip" + (this.filterAllSelected ? " is-active" : ""),
      text: "All"
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
        text: proj
      });
      const color = (_a = colorMap.get(proj)) != null ? _a : null;
      if (color)
        chip.style.borderColor = color;
      chip.addEventListener("click", () => {
        if (this.filterAllSelected) {
          this.filterAllSelected = false;
          this.projectFilter = /* @__PURE__ */ new Set([proj]);
        } else if (this.projectFilter.has(proj)) {
          this.projectFilter.delete(proj);
          if (this.projectFilter.size === 0)
            this.filterAllSelected = true;
        } else {
          this.projectFilter.add(proj);
        }
        this.render();
      });
    }
    const listEl = panel.createEl("ul", { cls: "dp-md-inbox-list" });
    this.renderInboxList(panel, listEl, count, colorMap);
  }
  renderInboxList(panel, listEl, countEl, colorMap) {
    listEl.empty();
    const filtered = this.filteredInboxTasks();
    countEl.setText(String(filtered.length));
    if (!this.inbox.file) {
      listEl.createDiv({
        cls: "dp-md-inbox-empty",
        text: "No inbox file at this path."
      });
      return;
    }
    if (filtered.length === 0) {
      listEl.createDiv({
        cls: "dp-md-inbox-empty",
        text: this.inbox.tasks.length === 0 ? "Inbox is clear." : "No tasks match."
      });
      return;
    }
    for (const task of filtered) {
      const li = listEl.createEl("li", { cls: "dp-md-inbox-item" });
      li.draggable = true;
      li.style.height = this.inboxProportionalHeights ? `${Math.max(20, task.durationMin * INBOX_PX_PER_MIN)}px` : `${INBOX_FLAT_HEIGHT_PX}px`;
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
        text: bodyText(task)
      });
      li.setAttribute("title", `${bodyText(task)} \xB7 ${fmtMin(task.durationMin)}`);
      li.addEventListener("dragstart", (ev) => {
        if (!this.inbox.file)
          return;
        const rect = li.getBoundingClientRect();
        this.dragState = {
          task,
          origin: "inbox",
          fromFile: this.inbox.file,
          grabOffsetY: ev.clientY - rect.top
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
      li.addEventListener("click", () => {
        void this.openEditor(this.inbox.file, task, new Date());
      });
    }
  }
  filteredInboxTasks() {
    const q = this.searchQuery.trim().toLowerCase();
    return this.inbox.tasks.filter((t) => {
      if (this.filterAllSelected) {
      } else if (!t.project || !this.projectFilter.has(t.project)) {
        return false;
      }
      if (!q)
        return true;
      return bodyText(t).toLowerCase().includes(q);
    });
  }
  // ---------- day grid (right) ----------
  renderGrid(parent, colorMap) {
    const grid = parent.createDiv({ cls: "dp-md-grid" });
    grid.style.gridTemplateColumns = `repeat(${this.days.length}, minmax(0, 1fr))`;
    for (const day of this.days)
      this.renderDayColumn(grid, day, colorMap);
  }
  renderDayColumn(parent, day, colorMap) {
    const col = parent.createDiv({ cls: "dp-md-day" });
    if (sameDay(day.date, new Date()))
      col.addClass("is-today");
    const header = col.createDiv({ cls: "dp-md-day-header" });
    const link = header.createEl("button", {
      cls: "dp-md-day-link",
      text: this.fmtDayHeader(day.date)
    });
    link.addEventListener("click", () => void this.openDay(day));
    header.createSpan({
      cls: "dp-md-day-count",
      text: String(day.tasks.length)
    });
    this.renderTimeline(col, day, colorMap);
  }
  fmtDayHeader(d) {
    return d.toLocaleDateString(void 0, {
      weekday: "short",
      month: "short",
      day: "numeric"
    });
  }
  renderTimeline(parent, day, colorMap) {
    const settings = this.plugin.settings;
    const startMin = settings.visibleStartHour * 60;
    const endMin = settings.visibleEndHour * 60;
    const totalMin = endMin - startMin;
    const heightPx = totalMin * TIMELINE_PX_PER_MIN;
    const timeline = parent.createDiv({ cls: "dp-md-timeline" });
    timeline.style.height = `${heightPx}px`;
    const gutter = timeline.createDiv({ cls: "dp-md-timeline-gutter" });
    for (let h = settings.visibleStartHour; h <= settings.visibleEndHour; h++) {
      const top = (h * 60 - startMin) * TIMELINE_PX_PER_MIN;
      const lbl = gutter.createDiv({
        cls: "dp-md-timeline-label",
        text: formatClockShort(h * 60)
      });
      lbl.style.top = `${top}px`;
      if (h >= settings.visibleEndHour)
        continue;
      lbl.addClass("is-clickable");
      lbl.setAttribute("aria-label", `New task at ${formatClockShort(h * 60)}`);
      lbl.addEventListener("click", (ev) => {
        ev.stopPropagation();
        void this.createTaskAt(day, h * 60);
      });
    }
    const lanes = timeline.createDiv({ cls: "dp-md-timeline-lanes" });
    for (let h = settings.visibleStartHour; h <= settings.visibleEndHour; h++) {
      const top = (h * 60 - startMin) * TIMELINE_PX_PER_MIN;
      const line = lanes.createDiv({ cls: "dp-md-timeline-line" });
      line.style.top = `${top}px`;
    }
    const blocksLayer = lanes.createDiv({ cls: "dp-md-timeline-blocks" });
    const scheduled = day.tasks.filter((t) => t.startMin !== null);
    const layout = layoutTimeline(scheduled, startMin, TIMELINE_PX_PER_MIN);
    for (const b of layout) {
      this.renderBlock(blocksLayer, day, b, colorMap);
    }
    const computeSnap = (clientY) => {
      if (!this.dragState)
        return null;
      const rect = lanes.getBoundingClientRect();
      const yPx = clientY - rect.top + timeline.scrollTop - this.dragState.grabOffsetY;
      const rawMin = yPx / TIMELINE_PX_PER_MIN + startMin;
      const snapped = snapToInterval(rawMin, settings.snapMin);
      const maxStart = endMin - this.dragState.task.durationMin;
      return Math.max(startMin, Math.min(maxStart, snapped));
    };
    lanes.addEventListener("dragover", (ev) => {
      if (!this.dragState)
        return;
      ev.preventDefault();
      if (ev.dataTransfer)
        ev.dataTransfer.dropEffect = "move";
      const snapped = computeSnap(ev.clientY);
      if (snapped === null)
        return;
      this.showDropIndicator(
        blocksLayer,
        snapped,
        this.dragState.task.durationMin,
        startMin
      );
    });
    lanes.addEventListener("dragleave", (ev) => {
      const related = ev.relatedTarget;
      if (!related || !lanes.contains(related))
        this.hideDropIndicator();
    });
    lanes.addEventListener("drop", (ev) => {
      if (!this.dragState)
        return;
      ev.preventDefault();
      const snapped = computeSnap(ev.clientY);
      this.hideDropIndicator();
      if (snapped === null)
        return;
      void this.dropToDay(this.dragState, day, snapped);
    });
  }
  // Render a single timeline block using the daily-view's `dp-block` DOM and
  // class names so multi-day blocks inherit the same color, padding, and
  // resize-handle styling. A `.dp-block-md` modifier opts in to the narrower
  // typography this view needs.
  renderBlock(layer, day, block, colorMap) {
    const el = layer.createDiv({ cls: "dp-block dp-block-md" });
    if (block.task.checked)
      el.addClass("is-done");
    if (!block.task.hasExplicitDuration)
      el.addClass("is-implicit-duration");
    if (block.task.durationMin <= 20)
      el.addClass("is-compact");
    if (block.widthPct < 99.5)
      el.addClass("is-narrow");
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
        text: formatClockShort(block.task.startMin)
      });
    }
    row.createSpan({
      cls: "dp-block-text",
      text: bodyText(block.task)
    });
    el.setAttribute("title", bodyText(block.task));
    el.addEventListener("click", () => {
      void this.openEditor(day.file, block.task, day.date);
    });
    el.draggable = true;
    el.addEventListener("dragstart", (ev) => {
      if (!day.file)
        return;
      const rect = el.getBoundingClientRect();
      this.dragState = {
        task: block.task,
        origin: "day",
        fromFile: day.file,
        grabOffsetY: ev.clientY - rect.top
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
    if (day.file) {
      const file = day.file;
      const bottom = el.createDiv({ cls: "dp-resize-handle" });
      bottom.addEventListener(
        "pointerdown",
        (ev) => this.beginResize(ev, el, file, block.task)
      );
      if (block.task.startMin !== null) {
        const top = el.createDiv({
          cls: "dp-resize-handle dp-resize-handle-top"
        });
        top.addEventListener(
          "pointerdown",
          (ev) => this.beginResizeTop(ev, el, file, block.task)
        );
      }
    }
  }
  // Bottom-edge drag → adjust duration. Snaps to settings.snapMin; on
  // pointerup writes a new `#d/<…>` tag onto the line. Duplicates the
  // daily-view behavior so the multi-day timeline feels the same.
  beginResize(ev, blockEl, file, task) {
    ev.preventDefault();
    ev.stopPropagation();
    const handle = ev.currentTarget;
    const settings = this.plugin.settings;
    const startY = ev.clientY;
    const startHeightPx = blockEl.offsetHeight;
    const minDuration = settings.snapMin;
    const pxPerMin = TIMELINE_PX_PER_MIN;
    let pendingDuration = task.durationMin;
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
      const suppressClick = (clickEv) => clickEv.stopPropagation();
      blockEl.addEventListener("click", suppressClick, { capture: true });
      window.setTimeout(
        () => blockEl.removeEventListener("click", suppressClick, true),
        0
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
  beginResizeTop(ev, blockEl, file, task) {
    if (task.startMin === null)
      return;
    ev.preventDefault();
    ev.stopPropagation();
    const handle = ev.currentTarget;
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
    const onMove = (e) => {
      const dy = e.clientY - startY;
      const rawNewStart = startStartMin + dy / pxPerMin;
      let snappedStart = snapToInterval(rawNewStart, settings.snapMin);
      const maxStart = startStartMin + startDurationMin - minDuration;
      if (snappedStart > maxStart)
        snappedStart = maxStart;
      if (snappedStart < 0)
        snappedStart = 0;
      pendingStart = snappedStart;
      pendingDuration = startDurationMin - (snappedStart - startStartMin);
      const deltaPx = (snappedStart - startStartMin) * pxPerMin;
      blockEl.style.top = `${startTopPx + deltaPx}px`;
      blockEl.style.height = `${startHeightPx - deltaPx}px`;
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
      const suppressClick = (clickEv) => clickEv.stopPropagation();
      blockEl.addEventListener("click", suppressClick, { capture: true });
      window.setTimeout(
        () => blockEl.removeEventListener("click", suppressClick, true),
        0
      );
      if (pendingStart === startStartMin && pendingDuration === startDurationMin) {
        blockEl.draggable = true;
        return;
      }
      void this.applyStartAndDurationChange(
        file,
        task,
        pendingStart,
        pendingDuration
      ).finally(() => {
        blockEl.draggable = true;
      });
    };
    handle.addEventListener("pointermove", onMove);
    handle.addEventListener("pointerup", onUp);
    handle.addEventListener("pointercancel", onUp);
  }
  async applyDurationChange(file, task, newDurationMin) {
    const prefixes = this.plugin.settings.prefixes;
    await this.app.vault.process(file, (content) => {
      const lines = content.split("\n");
      const idx = task.lineNumber;
      if (idx < 0 || idx >= lines.length || lines[idx] !== task.rawLine)
        return content;
      const next = setDurationTag(lines[idx], newDurationMin, prefixes);
      if (next === lines[idx])
        return content;
      lines[idx] = next;
      return lines.join("\n");
    });
    await this.refresh();
  }
  async applyStartAndDurationChange(file, task, newStartMin, newDurationMin) {
    const prefixes = this.plugin.settings.prefixes;
    await this.app.vault.process(file, (content) => {
      const lines = content.split("\n");
      const idx = task.lineNumber;
      if (idx < 0 || idx >= lines.length || lines[idx] !== task.rawLine)
        return content;
      let next = setTimeTag(lines[idx], newStartMin, prefixes);
      next = setDurationTag(next, newDurationMin, prefixes);
      if (next === lines[idx])
        return content;
      lines[idx] = next;
      return lines.join("\n");
    });
    await this.refresh();
  }
  // ---------- drop indicator ----------
  showDropIndicator(layer, snappedStartMin, durationMin, rangeStartMin) {
    var _a;
    if (!this.dropIndicator || this.dropIndicator.parentElement !== layer) {
      (_a = this.dropIndicator) == null ? void 0 : _a.detach();
      this.dropIndicator = layer.createDiv({ cls: "dp-md-drop-indicator" });
    }
    const ind = this.dropIndicator;
    ind.empty();
    ind.style.top = `${(snappedStartMin - rangeStartMin) * TIMELINE_PX_PER_MIN}px`;
    ind.style.height = `${Math.max(18, durationMin * TIMELINE_PX_PER_MIN)}px`;
    ind.createDiv({
      cls: "dp-md-drop-indicator-time",
      text: `${formatClockShort(snappedStartMin)}\u2013${formatClockShort(
        snappedStartMin + durationMin
      )}`
    });
  }
  hideDropIndicator() {
    var _a;
    (_a = this.dropIndicator) == null ? void 0 : _a.detach();
    this.dropIndicator = null;
  }
  // ---------- drop handlers ----------
  async dropToDay(drag, day, newStartMin) {
    const settings = this.plugin.settings;
    const prefixes = settings.prefixes;
    const fallback = buildFallback(settings);
    const subtaskSum = drag.origin === "inbox" && !drag.task.hasExplicitDuration ? sumSubtaskDurations(
      drag.task.subtasks.map((s) => s.rawLine),
      prefixes
    ) : 0;
    const inSameFile = day.file !== null && drag.fromFile.path === day.file.path;
    if (inSameFile && day.file) {
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
        if (next === lines[idx])
          return content;
        lines[idx] = next;
        return lines.join("\n");
      });
      await this.refresh();
      return;
    }
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
      if (next === lines[idx])
        return content;
      lines[idx] = next;
      return lines.join("\n");
    });
    const updatedTask = await this.refetchTask(drag.fromFile, drag.task);
    if (!updatedTask) {
      new import_obsidian9.Notice("Today: source line changed since drag started.");
      await this.refresh();
      return;
    }
    await moveTaskBetweenDailyNotes(
      this.app,
      drag.fromFile,
      updatedTask,
      day.date,
      fallback,
      { notify: false }
    );
    await this.refresh();
  }
  async dropToInbox(drag) {
    if (!this.inbox.file)
      return;
    if (drag.fromFile.path === this.inbox.file.path) {
      return;
    }
    const prefixes = this.plugin.settings.prefixes;
    await this.app.vault.process(drag.fromFile, (content) => {
      const lines = content.split("\n");
      const idx = drag.task.lineNumber;
      if (idx < 0 || idx >= lines.length || lines[idx] !== drag.task.rawLine)
        return content;
      let next = removeTimeTag(lines[idx], prefixes);
      const maxOrder = this.inbox.tasks.reduce(
        (acc, t) => t.order !== null && t.order > acc ? t.order : acc,
        0
      );
      next = setOrderTag(next, maxOrder + 1, prefixes);
      if (next === lines[idx])
        return content;
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
      new Date(),
      // unused — targetFile bypasses date resolution
      buildFallback(this.plugin.settings),
      { targetFile: this.inbox.file, notify: false }
    );
    await this.refresh();
  }
  async refetchTask(file, original) {
    var _a;
    const { parseFileTasks: parseFileTasks2 } = await Promise.resolve().then(() => (init_parser(), parser_exports));
    const content = await this.app.vault.read(file);
    const tasks = parseFileTasks2(
      file.path,
      content,
      this.plugin.settings.prefixes,
      this.plugin.settings.defaultDurationMin
    );
    const sameLine = tasks.find((t) => t.lineNumber === original.lineNumber);
    if (sameLine && bodyText(sameLine) === bodyText(original))
      return sameLine;
    return (_a = tasks.find((t) => bodyText(t) === bodyText(original))) != null ? _a : null;
  }
  // ---------- task / day open ----------
  // Click → edit modal. We delegate to an existing TodayView instance so we
  // can reuse its TaskEditModal + the entire callback graph (apply edits,
  // toggle subtasks, move-to-date, etc.) without re-implementing any of it.
  // No TodayView open? Open the file at the line as a graceful fallback.
  async openEditor(file, task, date) {
    if (!file)
      return;
    const leaf = this.app.workspace.getLeavesOfType(VIEW_TYPE_TODAY)[0];
    const view = leaf == null ? void 0 : leaf.view;
    if (view instanceof TodayView) {
      view.openTaskEditorForDay(file, task, date);
      return;
    }
    const fallbackLeaf = this.app.workspace.getLeaf(false);
    await fallbackLeaf.openFile(file, { eState: { line: task.lineNumber } });
  }
  // Gutter click → "new task at HH:MM" modal for that day. Mirrors the
  // daily-view gutter, delegating to TodayView so the modal, autocomplete,
  // and onSave plumbing (including Pomodoro / open-line post-actions) stay
  // single-sourced. Creates the daily note on demand, and spins up a
  // background TodayView leaf if none exists so the gutter works standalone
  // without forcing the user to open the daily view themselves.
  async createTaskAt(day, startMin) {
    let file = day.file;
    if (!file) {
      file = await ensureDailyNote(
        this.app,
        day.date,
        buildFallback(this.plugin.settings)
      );
    }
    const view = await this.ensureTodayView();
    if (!view) {
      new import_obsidian9.Notice("Could not open Today view to host the new-task modal.");
      return;
    }
    view.createTaskAtTimeForDay(file, day.date, startMin);
  }
  // Returns the existing TodayView (if any) or creates one in the right
  // sidebar with `active: false` so focus stays on the multi-day view. The
  // background leaf hosts the TaskEditModal and reuses every onSave /
  // postAction path the daily view already wires up.
  async ensureTodayView() {
    const existing = this.app.workspace.getLeavesOfType(VIEW_TYPE_TODAY)[0];
    if ((existing == null ? void 0 : existing.view) instanceof TodayView)
      return existing.view;
    const leaf = this.app.workspace.getRightLeaf(false);
    if (!leaf)
      return null;
    await leaf.setViewState({ type: VIEW_TYPE_TODAY, active: false });
    return leaf.view instanceof TodayView ? leaf.view : null;
  }
  async openDay(day) {
    if (day.file) {
      const leaf = this.app.workspace.getLeaf(false);
      await leaf.openFile(day.file);
    } else {
      await this.app.workspace.openLinkText(day.path, "");
    }
  }
};
function bodyText(task) {
  return task.body.replace(/#\S+/g, "").trim() || task.body.trim();
}
function fmtMin(min) {
  if (min <= 0)
    return "0m";
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0)
    return `${m}m`;
  if (m === 0)
    return `${h}h`;
  return `${h}h ${m}m`;
}
function uniqueProjects(tasks) {
  const set = /* @__PURE__ */ new Set();
  for (const t of tasks)
    if (t.project)
      set.add(t.project);
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

// src/main.ts
var import_obsidian11 = require("obsidian");
var polyfillInstalled = false;
var TodayPlugin = class extends import_obsidian10.Plugin {
  async onload() {
    await this.loadSettings();
    this.habitsScanner = new HabitsScanner(this.app);
    if (import_obsidian10.Platform.isMobile && !polyfillInstalled) {
      (0, import_mobile_drag_drop.polyfill)({ holdToDrag: 200 });
      polyfillInstalled = true;
    }
    this.registerView(
      VIEW_TYPE_TODAY,
      (leaf) => new TodayView(leaf, this)
    );
    this.registerView(
      VIEW_TYPE_HABITS_STATS,
      (leaf) => new HabitsStatsView(leaf, this)
    );
    this.registerView(
      VIEW_TYPE_MULTI_DAY,
      (leaf) => new MultiDayView(leaf, this)
    );
    this.addRibbonIcon("calendar-clock", "Open Today", () => {
      void this.activateView();
    });
    this.addRibbonIcon("calendar-range", "Open multi-day view", () => {
      void this.activateMultiDayView();
    });
    this.addCommand({
      id: "open-today",
      name: "Open Today",
      callback: () => void this.activateView()
    });
    this.addCommand({
      id: "open-calendar",
      name: "Open calendar",
      callback: () => void this.activateView({ openCalendar: true })
    });
    this.addCommand({
      id: "open-habits-stats",
      name: "Open reporting",
      callback: () => void this.activateHabitsStatsView()
    });
    this.addCommand({
      id: "open-multi-day",
      name: "Open multi-day view",
      hotkeys: [{ modifiers: ["Mod", "Shift"], key: "M" }],
      callback: () => void this.activateMultiDayView()
    });
    this.addCommand({
      id: "open-combined-popout",
      name: "Open Today + multi-day + reporting in popout",
      callback: () => void this.openCombinedPopout()
    });
    this.addCommand({
      id: "open-daily-note-today",
      name: "Open today's daily note",
      callback: () => void this.openDailyNoteForOffset(0)
    });
    this.addCommand({
      id: "open-daily-note-yesterday",
      name: "Open yesterday's daily note",
      callback: () => void this.openDailyNoteForOffset(-1)
    });
    this.addCommand({
      id: "open-daily-note-tomorrow",
      name: "Open tomorrow's daily note",
      callback: () => void this.openDailyNoteForOffset(1)
    });
    this.addCommand({
      id: "collect-unfinished",
      name: "Collect unfinished tasks into inbox",
      callback: () => void collectUnfinished(this)
    });
    this.addSettingTab(new TodaySettingTab(this.app, this));
    this.registerEditorSuggest(new InlineSuggest(this));
    this.registerEvent(
      this.app.vault.on("create", (af) => {
        if (!(af instanceof import_obsidian10.TFile))
          return;
        void applyDailyNoteTemplateIfEmpty(this.app, af, {
          folder: this.settings.dailyNoteFolderFallback,
          format: this.settings.dailyNoteFormatFallback,
          template: this.settings.dailyNoteTemplate,
          templatesByDay: this.settings.dailyNoteTemplatesByDay,
          dateLinkFormat: this.settings.dateLinkFormat,
          prefixes: this.settings.prefixes,
          quotesFile: this.settings.quotesFile,
          addCreatedTag: this.settings.addCreatedTagToFrontmatter
        });
      })
    );
  }
  async onunload() {
  }
  async loadSettings() {
    var _a, _b, _c;
    const data = await this.loadData();
    this.settings = {
      ...DEFAULT_SETTINGS,
      ...data != null ? data : {},
      prefixes: { ...DEFAULT_PREFIXES, ...(_a = data == null ? void 0 : data.prefixes) != null ? _a : {} },
      autocomplete: {
        ...DEFAULT_AUTOCOMPLETE,
        ...(_b = data == null ? void 0 : data.autocomplete) != null ? _b : {}
      },
      dailyNoteTemplatesByDay: {
        ...DEFAULT_WEEKDAY_TEMPLATES,
        ...(_c = data == null ? void 0 : data.dailyNoteTemplatesByDay) != null ? _c : {}
      },
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
  async openDailyNoteForOffset(dayOffset) {
    const target = (0, import_obsidian11.moment)().startOf("day").add(dayOffset, "day").toDate();
    const fallback = {
      folder: this.settings.dailyNoteFolderFallback,
      format: this.settings.dailyNoteFormatFallback,
      template: this.settings.dailyNoteTemplate,
      templatesByDay: this.settings.dailyNoteTemplatesByDay,
      dateLinkFormat: this.settings.dateLinkFormat,
      prefixes: this.settings.prefixes,
      quotesFile: this.settings.quotesFile,
      addCreatedTag: this.settings.addCreatedTagToFrontmatter
    };
    const file = await ensureDailyNote(this.app, target, fallback, false);
    const leaf = this.app.workspace.getLeaf(false);
    await leaf.openFile(file);
  }
  async activateHabitsStatsView() {
    const existing = this.app.workspace.getLeavesOfType(
      VIEW_TYPE_HABITS_STATS
    );
    let leaf;
    if (existing.length > 0) {
      leaf = existing[0];
      this.app.workspace.revealLeaf(leaf);
      return;
    }
    leaf = this.app.workspace.getRightLeaf(false);
    if (!leaf)
      return;
    await leaf.setViewState({
      type: VIEW_TYPE_HABITS_STATS,
      active: true
    });
    this.app.workspace.revealLeaf(leaf);
  }
  async openCombinedPopout() {
    if (import_obsidian10.Platform.isMobile) {
      await this.activateView();
      await this.activateMultiDayView();
      await this.activateHabitsStatsView();
      return;
    }
    const todayLeaf = this.app.workspace.openPopoutLeaf({
      size: { width: 1500, height: 950 }
    });
    await todayLeaf.setViewState({ type: VIEW_TYPE_TODAY, active: true });
    const multiLeaf = this.app.workspace.createLeafBySplit(
      todayLeaf,
      "vertical"
    );
    await multiLeaf.setViewState({ type: VIEW_TYPE_MULTI_DAY, active: false });
    const habitsLeaf = this.app.workspace.createLeafBySplit(
      multiLeaf,
      "vertical"
    );
    await habitsLeaf.setViewState({
      type: VIEW_TYPE_HABITS_STATS,
      active: false
    });
    this.app.workspace.setActiveLeaf(todayLeaf, { focus: true });
  }
  async activateMultiDayView() {
    const existing = this.app.workspace.getLeavesOfType(VIEW_TYPE_MULTI_DAY);
    let leaf;
    if (existing.length > 0) {
      leaf = existing[0];
      this.app.workspace.revealLeaf(leaf);
      return;
    }
    leaf = this.app.workspace.getLeaf("tab");
    if (!leaf)
      return;
    await leaf.setViewState({
      type: VIEW_TYPE_MULTI_DAY,
      active: true
    });
    this.app.workspace.revealLeaf(leaf);
  }
};
var InlineSuggest = class extends import_obsidian10.EditorSuggest {
  constructor(plugin) {
    super(plugin.app);
    this.plugin = plugin;
  }
  onTrigger(cursor, editor, _file) {
    const auto = this.plugin.settings.autocomplete;
    const candidates = [
      { trigger: auto.projectTrigger, kind: "project" },
      { trigger: auto.timeTrigger, kind: "time" },
      { trigger: auto.durationTrigger, kind: "duration" },
      { trigger: auto.dateTrigger, kind: "date" }
    ];
    const line = editor.getLine(cursor.line);
    const before = line.slice(0, cursor.ch);
    let best = null;
    for (const c of candidates) {
      if (!c.trigger)
        continue;
      const idx = before.lastIndexOf(c.trigger);
      if (idx < 0)
        continue;
      if (!best) {
        best = { idx, kind: c.kind, trigger: c.trigger };
        continue;
      }
      const bestEnd = best.idx + best.trigger.length;
      const cEnd = idx + c.trigger.length;
      if (cEnd > bestEnd) {
        best = { idx, kind: c.kind, trigger: c.trigger };
      } else if (cEnd === bestEnd && c.trigger.length > best.trigger.length) {
        best = { idx, kind: c.kind, trigger: c.trigger };
      }
    }
    if (!best)
      return null;
    if (best.trigger.startsWith("#") && !/\S/.test(before.slice(0, best.idx))) {
      return null;
    }
    const query = before.slice(best.idx + best.trigger.length);
    if (/#/.test(query))
      return null;
    if (/\s/.test(query)) {
      if (best.kind !== "date" || !/^[A-Za-z]+ \d{0,2}$/.test(query)) {
        return null;
      }
    }
    return {
      start: { line: cursor.line, ch: best.idx },
      end: cursor,
      // Smuggle the kind through the query string so getSuggestions knows
      // which list to build. Format: "<kind>:<query>".
      query: `${best.kind}:${query}`
    };
  }
  getSuggestions(ctx) {
    const colon = ctx.query.indexOf(":");
    if (colon < 0)
      return [];
    const kind = ctx.query.slice(0, colon);
    const query = ctx.query.slice(colon + 1);
    const prefixes = this.plugin.settings.prefixes;
    if (kind === "project") {
      const pool2 = this.collectProjects();
      return this.filter(pool2, query).map((name) => {
        const slash = name.indexOf("/");
        return {
          kind,
          display: slash >= 0 ? name.slice(0, slash) : name,
          subDisplay: slash >= 0 ? name.slice(slash) : void 0,
          insert: `#${prefixes.project}/${name} `
        };
      });
    }
    if (kind === "time") {
      const settings = this.plugin.settings;
      const pool2 = buildTimeOptions(
        settings.visibleStartHour,
        settings.visibleEndHour
      );
      return this.filter(pool2, query).map((display) => ({
        kind,
        display,
        insert: `#${prefixes.time}/${timeDisplayToTagBody(display)} `
      }));
    }
    if (kind === "date") {
      const settings = this.plugin.settings;
      const fmt = settings.dateLinkFormat;
      const dateItems = buildDateSuggestions(query).map((s) => ({
        kind,
        display: s.keyword,
        subDisplay: fmt.trim() ? ` ${(0, import_obsidian11.moment)(s.date).format(fmt.trim())}` : void 0,
        insert: buildDateLinkInsert(
          this.app,
          s.date,
          settings.dailyNoteFormatFallback,
          settings.dailyNoteFolderFallback,
          fmt
        ) + " "
      }));
      const personItems = buildPeopleSuggestions(
        this.app,
        settings.peopleFolder,
        query
      ).map((p) => ({
        kind,
        display: p.basename,
        subDisplay: p.folder ? ` ${p.folder}` : void 0,
        insert: buildPersonLinkInsert(this.app, p.path) + " "
      }));
      return [...dateItems, ...personItems];
    }
    const pool = this.plugin.settings.quickDurationsMin.map(
      (m) => formatCompactDuration(m)
    );
    return this.filter(pool, query).map((display) => ({
      kind,
      display,
      insert: `#${prefixes.duration}/${display} `
    }));
  }
  renderSuggestion(item, el) {
    el.addClass("dp-project-suggest-item");
    el.createSpan({ text: item.display });
    if (item.subDisplay) {
      el.createSpan({ cls: "dp-project-suggest-sub", text: item.subDisplay });
    }
  }
  selectSuggestion(item, _evt) {
    if (!this.context)
      return;
    this.context.editor.replaceRange(
      item.insert,
      this.context.start,
      this.context.end
    );
    this.close();
  }
  filter(pool, query, limit = 12) {
    const needle = query.trim().toLowerCase();
    if (!needle)
      return pool.slice(0, limit);
    const starts = pool.filter((p) => p.toLowerCase().startsWith(needle));
    const contains = pool.filter(
      (p) => !p.toLowerCase().startsWith(needle) && p.toLowerCase().includes(needle)
    );
    return [...starts, ...contains].slice(0, limit);
  }
  collectProjects() {
    var _a, _b;
    const prefix = `#${this.plugin.settings.prefixes.project}/`.toLowerCase();
    const names = /* @__PURE__ */ new Set();
    const cache = this.app.metadataCache;
    const tags = (_b = (_a = cache.getTags) == null ? void 0 : _a.call(cache)) != null ? _b : {};
    for (const tag of Object.keys(tags)) {
      if (tag.toLowerCase().startsWith(prefix)) {
        const name = tag.slice(prefix.length);
        if (name)
          names.add(name);
      }
    }
    for (const pc of this.plugin.settings.projectColors) {
      if (pc.project)
        names.add(pc.project);
    }
    return Array.from(names).sort((a, b) => a.localeCompare(b));
  }
};
/*! Bundled license information:

mobile-drag-drop/index.min.js:
  (*! mobile-drag-drop 3.0.0-rc.0 | Copyright (c) 2022 Tim Ruffles | MIT License *)
*/
