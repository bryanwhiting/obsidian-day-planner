var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => TodayPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian6 = require("obsidian");
var import_mobile_drag_drop = __toESM(require_index_min());

// src/view.ts
var import_obsidian4 = require("obsidian");

// src/settings.ts
var import_obsidian2 = require("obsidian");

// src/parser.ts
var DEFAULT_PREFIXES = {
  duration: "d",
  time: "t",
  order: "o",
  project: "p",
  exercise: "x",
  taskId: "tid",
  actual: "ta"
};
var TASK_LINE = /^(\s*)- \[([ xX/\-!?*<>])\]\s+(.*)$/;
var DESCRIPTION_RE = /\{([^{}]*)\}/;
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
    exercise: new RegExp(
      `#${esc(prefixes.exercise)}\\/([\\w-]+)\\/(\\d+)(?:\\/(\\d+(?:\\.\\d+)?))?`,
      "g"
    ),
    taskId: new RegExp(`#${esc(prefixes.taskId)}\\/([A-Za-z0-9]+)\\b`),
    actual: new RegExp(
      `#${esc(prefixes.actual)}\\/(?:(\\d+)h)?(?:(\\d+)m)?(?=\\s|$)`
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
      const reps = parseInt(m[2], 10);
      const weight = m[3] !== void 0 ? parseFloat(m[3]) : null;
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
function parseIntention(content, intentionTag) {
  const tag = intentionTag.replace(/^#+/, "").trim();
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
    subtasks: []
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
function setTaskTitle(rawLine, newTitle, prefixes) {
  const m = TASK_LINE.exec(rawLine);
  if (!m)
    return rawLine;
  const indent = m[1];
  const checkbox = m[2];
  const body = m[3];
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const tagRe = new RegExp(
    `#(?:${esc(prefixes.duration)}|${esc(prefixes.time)}|${esc(prefixes.order)}|${esc(prefixes.project)}|${esc(prefixes.exercise)}|${esc(prefixes.taskId)})\\/`
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
    `#(?:${esc(prefixes.duration)}|${esc(prefixes.time)}|${esc(prefixes.order)}|${esc(prefixes.project)}|${esc(prefixes.exercise)}|${esc(prefixes.taskId)})\\/`
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
  }
}

// src/settings.ts
var DEFAULT_AUTOCOMPLETE = {
  projectTrigger: "##",
  timeTrigger: "#@",
  durationTrigger: "#$",
  dateTrigger: "@"
};
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
  defaultDurationMin: 15,
  quickDurationsMin: [15, 30, 45, 60, 90, 120],
  projectColors: [],
  contextTags: [],
  noteTag: "note",
  intentionTag: "intention",
  timelineHeightDesktop: "",
  timelineHeightMobile: "",
  pomodoroWorkMin: 25,
  pomodoroBreakMin: 5,
  pomodoroAutoStart: true,
  pomodoroAutoCycle: true,
  pomodoroAutoReturn: true,
  taskIdLength: 4,
  dateLinkFormat: "ddd, MMM D, YYYY",
  habitsFile: "daily/_habits.md",
  habitPrefix: "h",
  habitWeekStart: 0,
  habitsHideCompleted: false,
  habitsStatsWindow: 10
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
var TodaySettingTab = class extends import_obsidian2.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    // Captured the first time the tab is opened, cleared on hide(). Persists
    // across re-renders triggered from inside display() (e.g. project section
    // calling this.display() after a prefix edit), so we can compare the user's
    // final state against where they started when the tab closes.
    this.prefixSnapshot = null;
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    if (!this.prefixSnapshot) {
      this.prefixSnapshot = { ...this.plugin.settings.prefixes };
    }
    containerEl.empty();
    this.renderDefaultsSection(containerEl);
    this.renderPomodoroSection(containerEl);
    this.renderTaskIdSection(containerEl);
    this.renderAutocompleteSection(containerEl);
    this.renderProjectsSection(containerEl);
    this.renderContextTagsSection(containerEl);
    this.renderNotesSection(containerEl);
    this.renderHabitsSection(containerEl);
    this.renderTemplatingSection(containerEl);
    this.renderDayConfigSection(containerEl);
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
      "actual"
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
  renderDefaultsSection(containerEl) {
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
    new import_obsidian2.Setting(containerEl).setName("Pixels per minute").setDesc("Vertical scale of the timeline.").addText(
      (t) => t.setValue(this.plugin.settings.pxPerMin.toString()).onChange(async (v) => {
        const n = parseFloat(v);
        if (!isNaN(n) && n > 0 && n <= 10) {
          this.plugin.settings.pxPerMin = n;
          await this.plugin.saveSettings();
        }
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
    new import_obsidian2.Setting(containerEl).setName("Daily notes folder").setDesc("Where should your daily notes be saved?").addText(
      (t) => t.setValue(this.plugin.settings.dailyNoteFolderFallback).onChange(async (v) => {
        this.plugin.settings.dailyNoteFolderFallback = v.trim();
        await this.plugin.saveSettings();
      })
    );
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
  }
  renderDayConfigSection(containerEl) {
    new import_obsidian2.Setting(containerEl).setName("Day config").setHeading();
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
      "Anywhere this hashtag appears in the daily note, the rest of the line is treated as your intention for the day and shown next to the daily-note path in the dashboard header. Enter the bare tag without the leading ",
      makeCode("#"),
      " \u2014 e.g. ",
      makeCode("intention"),
      " matches ",
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
  }
  renderHabitsSection(containerEl) {
    new import_obsidian2.Setting(containerEl).setName("Habits").setHeading();
    const desc = document.createDocumentFragment();
    desc.append(
      "Habits live in a single source file as plain hashtag lines like ",
      makeCode("#h/day/call-mom Call mom"),
      " or ",
      makeCode("#h/week/review-monarch"),
      ". The dashboard renders uncompleted habits below the workout line; clicking a habit appends ",
      makeCode("- [x] <slug> #h/<period>/<slug>"),
      " to the displayed daily note. The point is to avoid muddying your daily checklist \u2014 habits stay invisible in the note unless completed."
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
      "Letter(s) used between # and the period segment. Default `h` \u2192 tags look like `#h/day/call-mom`."
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
      "When on, completed habits disappear from the dashboard line. When off (default), they stay visible with strikethrough."
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
var import_obsidian3 = require("obsidian");
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
  const rawTemplate = await readTemplateContent(app, fallback.template);
  const basename = resolved.path.split("/").pop().replace(/\.md$/i, "");
  const initialContent = expandDateTemplate(
    rawTemplate,
    basename,
    app,
    fallback.format,
    fallback.folder,
    (_a = fallback.dateLinkFormat) != null ? _a : ""
  );
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
  const template = await readTemplateContent(app, fallback.template);
  if (!template)
    return;
  const expanded = expandDateTemplate(
    template,
    file.basename,
    app,
    format,
    folder,
    (_d = fallback.dateLinkFormat) != null ? _d : ""
  );
  await app.vault.modify(file, expanded);
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
function expandDateTemplate(content, fileBasename, app, fileFormat, folder, displayFormat) {
  if (!content)
    return content;
  return content.replace(
    /<@([A-Za-z0-9]+)(-rel)?>/g,
    (match, kw, rel) => {
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
function parseFilenameDate(basename, fileFormat) {
  const fmt = (fileFormat || "YYYY-MM-DD").trim();
  const m = (0, import_obsidian3.moment)(basename, fmt, true);
  return m.isValid() ? m.toDate() : null;
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

// src/habits.ts
var SLUG_PATTERN = "[\\w-]+";
function escapeRegex2(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function buildHabitTagRegex(prefix, period, slug) {
  const periodPart = period != null ? period : "(day|week|month)";
  const slugPart = slug ? escapeRegex2(slug) : `(${SLUG_PATTERN})`;
  return new RegExp(
    `#${escapeRegex2(prefix)}\\/${periodPart}\\/${slugPart}(?![\\w-])`,
    "g"
  );
}
function parseExerciseGoals(content, exercisePrefix) {
  var _a;
  const re = new RegExp(
    `#${escapeRegex2(exercisePrefix)}-(day|week|month)\\/([\\w-]+)\\/(\\d+)(?![\\w-])(.*)$`
  );
  const goals = [];
  const seen = /* @__PURE__ */ new Set();
  for (const line of content.split("\n")) {
    const m = re.exec(line);
    if (!m)
      continue;
    const period = m[1];
    const name = m[2];
    const target = parseInt(m[3], 10);
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
    `#${escapeRegex2(prefix)}\\/(day|week|month)\\/(${SLUG_PATTERN})(?![\\w-])(.*)$`
  );
  const habits = [];
  const seen = /* @__PURE__ */ new Set();
  for (const line of content.split("\n")) {
    const m = re.exec(line);
    if (!m)
      continue;
    const period = m[1];
    const slug = m[2];
    const label = ((_a = m[3]) != null ? _a : "").trim();
    const key = `${period}/${slug}`;
    if (seen.has(key))
      continue;
    seen.add(key);
    habits.push({ period, slug, label });
  }
  return habits;
}
function appendHabitLine(content, prefix, period, slug) {
  const line = `- [x] ${slug} #${prefix}/${period}/${slug}`;
  if (content.length === 0)
    return line + "\n";
  if (content.endsWith("\n"))
    return content + line + "\n";
  return content + "\n" + line + "\n";
}
var HABIT_TASK_LINE_RE = /^(\s*)- \[([ xX])\]\s+(.*)$/;
function findHabitTaskLines(content, prefix, period, slug) {
  const tagRe = buildHabitTagRegex(prefix, period, slug);
  const out = [];
  const lines = content.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const tm = HABIT_TASK_LINE_RE.exec(lines[i]);
    if (!tm)
      continue;
    tagRe.lastIndex = 0;
    if (!tagRe.test(lines[i]))
      continue;
    out.push({ lineNumber: i, checked: tm[2] === "x" || tm[2] === "X" });
  }
  return out;
}
function toggleHabitOnContent(content, prefix, period, slug) {
  const tagRe = buildHabitTagRegex(prefix, period, slug);
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
  return appendHabitLine(content, prefix, period, slug);
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
var TodayView = class extends import_obsidian4.ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.rerenderTimer = null;
    this.dragPayload = null;
    this.dropIndicator = null;
    this.selectedDate = startOfDay(new Date());
    this.calendarMonth = startOfMonth(new Date());
    this.calendarOpen = false;
    this.summariesCollapsed = false;
    this.unscheduledCollapsed = import_obsidian4.Platform.isMobile;
    this.overrideFilePath = null;
    this.hasRendered = false;
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
        if (file instanceof import_obsidian4.TFile)
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
    if (ev.key !== "ArrowLeft" && ev.key !== "ArrowRight")
      return;
    ev.preventDefault();
    const delta = ev.key === "ArrowLeft" ? -1 : 1;
    void this.navigateTo(addDays(this.selectedDate, delta));
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
    if (!(file instanceof import_obsidian4.TFile))
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
    if (!(file instanceof import_obsidian4.TFile))
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
      dateLinkFormat: this.plugin.settings.dateLinkFormat
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
      if (f instanceof import_obsidian4.TFile) {
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
    const intention = displayFile ? parseIntention(fileContent, this.plugin.settings.intentionTag) : null;
    const activeFile = this.app.workspace.getActiveFile();
    const showOpenActiveLink = activeFile !== null && (!displayFile || activeFile.path !== displayFile.path);
    this.renderDateNav(root);
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
      displayPath,
      displayFile,
      displayPath,
      tasks,
      exercises,
      habitDisplays,
      true,
      colorMap,
      showOpenActiveLink ? activeFile : null,
      intention
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
    const hints = root.createDiv({ cls: "dp-timeline-hints" });
    const addHint = (key, label) => {
      const item = hints.createSpan({ cls: "dp-pomo-hint" });
      item.createEl("kbd", { cls: "dp-pomo-kbd", text: key });
      item.createSpan({ cls: "dp-pomo-hint-label", text: label });
    };
    addHint("\u2190/\u2192", "day");
    addHint("h", "today");
    addHint("c", "calendar");
    addHint("s", "summaries");
    if (this.pomodoroState !== null)
      addHint("t", "focus");
    addHint("p", this.isPopout() ? "return" : "pop out");
  }
  renderDateNav(parent) {
    const nav = parent.createDiv({ cls: "dp-datenav" });
    const prev = nav.createEl("button", {
      cls: "dp-nav-btn dp-nav-arrow",
      attr: { "aria-label": "Previous day" }
    });
    (0, import_obsidian4.setIcon)(prev, "chevron-left");
    const today = nav.createEl("button", {
      cls: "dp-today-btn",
      attr: { "aria-label": "Jump to today" }
    });
    (0, import_obsidian4.setIcon)(today, "sun");
    const calBtn = nav.createEl("button", {
      cls: "dp-cal-btn",
      attr: { "aria-label": "Toggle calendar" }
    });
    (0, import_obsidian4.setIcon)(calBtn, "calendar");
    if (this.calendarOpen)
      calBtn.addClass("is-active");
    const label = nav.createDiv({ cls: "dp-datenav-label" });
    label.textContent = this.formatDateLabel(this.selectedDate);
    if (this.pomodoroState && this.pomodoroHidden) {
      const focusBtn = nav.createEl("button", {
        cls: "dp-nav-btn dp-pomo-resume",
        attr: { "aria-label": "Back to focus" }
      });
      (0, import_obsidian4.setIcon)(focusBtn, "timer");
      focusBtn.addEventListener("click", () => {
        this.pomodoroHidden = false;
        this.scheduleRender();
      });
    }
    const collapseBtn = nav.createEl("button", {
      cls: "dp-nav-btn",
      attr: {
        "aria-label": this.summariesCollapsed ? "Expand summaries" : "Collapse summaries",
        "aria-expanded": this.summariesCollapsed ? "false" : "true"
      }
    });
    (0, import_obsidian4.setIcon)(
      collapseBtn,
      this.summariesCollapsed ? "chevron-down" : "chevron-up"
    );
    collapseBtn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      this.summariesCollapsed = !this.summariesCollapsed;
      this.scheduleRender();
    });
    const popoutBtn = nav.createEl("button", {
      cls: "dp-nav-btn dp-popout-btn",
      attr: {
        "aria-label": this.isPopout() ? "Return to main window" : "Open in new window"
      }
    });
    (0, import_obsidian4.setIcon)(popoutBtn, this.isPopout() ? "monitor" : "picture-in-picture-2");
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
    (0, import_obsidian4.setIcon)(next, "chevron-right");
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
      dateLinkFormat: this.plugin.settings.dateLinkFormat
    };
    const resolved = await resolveDailyNote(this.app, target, fallback);
    if (!resolved.file) {
      try {
        await ensureDailyNote(this.app, target, fallback);
      } catch (e) {
        new import_obsidian4.Notice(`Today: failed to create note (${e.message})`);
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
  renderSection(parent, title, subtitle, file, path, tasks, exercises, habitDisplays, isPrimary, colorMap, openActiveTarget = null, intention = null) {
    const section = parent.createDiv({ cls: "dp-section" });
    if (this.summariesCollapsed)
      section.addClass("is-summaries-collapsed");
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
        sub.createSpan({ cls: "dp-intention", text: intention });
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
    const configuredHeight = import_obsidian4.Platform.isMobile ? settings.timelineHeightMobile : settings.timelineHeightDesktop;
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
        var _a, _b;
        const proj = project === void 0 || project === "" ? null : project;
        const dur = durationMin != null ? durationMin : defaultDurationMin;
        const newLine = buildLine(title, description, dur, proj);
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
    strip.createSpan({
      cls: "dp-note-strip-title",
      text: this.cleanBody(note.body) || "(untitled)"
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
    if (ctx == null ? void 0 : ctx.icon) {
      const ctxIcon = row.createSpan({ cls: "dp-block-context-icon" });
      (0, import_obsidian4.setIcon)(ctxIcon, ctx.icon);
      ctxIcon.setAttribute("aria-label", `#${ctx.tag}`);
    }
    if (!block.task.hasExplicitDuration) {
      const warn = row.createSpan({ cls: "dp-warn" });
      (0, import_obsidian4.setIcon)(warn, "alert-triangle");
      warn.setAttribute("aria-label", "No #d/ tag \u2014 using default duration");
    }
    row.createSpan({
      cls: "dp-block-time",
      text: this.formatBlockTime(block.task)
    });
    row.createSpan({ cls: "dp-block-sep", text: "\xB7" });
    if (block.task.project) {
      const projWrap = row.createSpan({ cls: "dp-block-project-wrap" });
      const projIcon = this.resolveProjectIcon(block.task.project);
      if (projIcon) {
        const ic = projWrap.createSpan({ cls: "dp-block-project-icon" });
        (0, import_obsidian4.setIcon)(ic, projIcon);
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
      block.task.subtasks.forEach((sub) => {
        const subRow = subList.createDiv({ cls: "dp-block-subtask" });
        if (sub.checked)
          subRow.addClass("is-done");
        const text = subRow.createSpan({
          cls: "dp-block-subtask-text",
          text: sub.text
        });
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
        bodyText: this.cleanBody(block.task.body)
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
    if (import_obsidian4.Platform.isMobile && this.unscheduledCollapsed) {
      list.addClass("is-collapsed");
    }
    const head = list.createDiv({ cls: "dp-unscheduled-head" });
    if (import_obsidian4.Platform.isMobile) {
      const toggleBtn = head.createEl("button", {
        cls: "dp-unscheduled-toggle",
        attr: {
          "aria-label": this.unscheduledCollapsed ? "Expand unscheduled" : "Collapse unscheduled",
          "aria-expanded": this.unscheduledCollapsed ? "false" : "true"
        }
      });
      (0, import_obsidian4.setIcon)(
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
    if (import_obsidian4.Platform.isMobile && unscheduled.length > 0) {
      head.createSpan({
        cls: "dp-unscheduled-count",
        text: String(unscheduled.length)
      });
    }
    const addBtn = head.createEl("button", {
      cls: "dp-unscheduled-add",
      attr: { "aria-label": "Add unscheduled task" }
    });
    (0, import_obsidian4.setIcon)(addBtn, "plus");
    addBtn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      if (import_obsidian4.Platform.isMobile && this.unscheduledCollapsed) {
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
        (0, import_obsidian4.setIcon)(ctxIcon, ctx.icon);
        ctxIcon.setAttribute("aria-label", `#${ctx.tag}`);
      }
      if (!task.hasExplicitDuration) {
        const warn = meta.createSpan({ cls: "dp-warn" });
        (0, import_obsidian4.setIcon)(warn, "alert-triangle");
        warn.setAttribute("aria-label", "No #d/ tag \u2014 using default duration");
      }
      meta.createSpan({ text: formatTotal(task.durationMin) });
      if (task.project) {
        const projGroup = card.createSpan({ cls: "dp-card-project-wrap" });
        const projIcon = this.resolveProjectIcon(task.project);
        if (projIcon) {
          const ic = projGroup.createSpan({ cls: "dp-card-project-icon" });
          (0, import_obsidian4.setIcon)(ic, projIcon);
        }
        projGroup.createSpan({ cls: "dp-card-project", text: task.project });
        if (task.subproject) {
          projGroup.createSpan({
            cls: "dp-card-subproject",
            text: `/${task.subproject}`
          });
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
          bodyText: this.cleanBody(task.body)
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
    if (!(file instanceof import_obsidian4.TFile)) {
      new import_obsidian4.Notice("Today: source file no longer exists.");
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
      new import_obsidian4.Notice("Today: file changed since last render \u2014 refreshing.");
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
    const table = parent.createDiv({ cls: "dp-stat-table" });
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
        (0, import_obsidian4.setIcon)(ic, projIconName);
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
    let out = body.replace(new RegExp(`#${p.duration}\\/\\S+`, "g"), "").replace(new RegExp(`#${p.time}\\/\\S+`, "g"), "").replace(new RegExp(`#${p.order}\\/\\d+`, "g"), "").replace(new RegExp(`#${p.project}\\/[\\w-]+(?:\\/[\\w-]+)?`, "g"), "").replace(new RegExp(`#${p.exercise}\\/\\S+`, "g"), "").replace(new RegExp(`#${p.actual}\\/\\S+`, "g"), "").replace(new RegExp(`#${p.taskId}\\/[A-Za-z0-9]+\\b`, "g"), "").replace(/\{[^{}]*\}/g, "");
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
  openTaskEditor(file, task) {
    var _a;
    const prefixes = this.plugin.settings.prefixes;
    new TaskEditModal(this.app, {
      mode: "edit",
      modalTitle: "Edit task",
      initialTitle: this.cleanBody(task.body),
      initialDescription: (_a = task.description) != null ? _a : "",
      initialDurationMin: task.durationMin,
      initialProject: task.project,
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
          checked
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
      onStartPomodoro: () => this.enterPomodoro(file, task)
    }).open();
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
      dateLinkFormat: this.plugin.settings.dateLinkFormat
    };
    const targetFile = await ensureDailyNote(this.app, targetDate, fallback);
    if (targetFile.path === file.path) {
      new import_obsidian4.Notice("Source and target are the same file.");
      return false;
    }
    const lineNumbers = [task.lineNumber, ...task.subtasks.map((s) => s.lineNumber)].sort((a, b) => a - b);
    let movedLines = [];
    await this.app.vault.process(file, (content) => {
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
      new import_obsidian4.Notice("Today: nothing to move.");
      return false;
    }
    await this.app.vault.process(targetFile, (content) => {
      const lines = content.split("\n");
      const lastIdx = findLastTaskLine(content);
      const insertAt = lastIdx === -1 ? lines.length : lastIdx + 1;
      lines.splice(insertAt, 0, ...movedLines);
      return lines.join("\n");
    });
    new import_obsidian4.Notice(`Moved to ${targetFile.path}`);
    return true;
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
      dateLinkFormat: this.plugin.settings.dateLinkFormat
    };
    const targetFile = await ensureDailyNote(this.app, targetDate, fallback);
    if (targetFile.path === file.path) {
      new import_obsidian4.Notice("Source and target are the same file.");
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
      new import_obsidian4.Notice("Couldn't locate the task to migrate.");
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
    new import_obsidian4.Notice(`Migrated to ${targetFile.path}`);
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
  async applyTaskEdit(file, task, newTitle, newDescription, newDurationMin, newProject, newChecked) {
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
    if (!(habitsFile instanceof import_obsidian4.TFile))
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
          h.period,
          h.slug
        );
        for (const l of lines)
          if (l.checked)
            checkedCount++;
        if (lines.length > maxPerFile)
          maxPerFile = lines.length;
      }
      out.push({
        habit: h,
        isComplete: checkedCount > 0,
        hasDuplicate: maxPerFile > 1,
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
      const visible = settings.habitsHideCompleted ? items.filter((i) => !i.isComplete) : items;
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
        if (d.hasDuplicate) {
          chip.createSpan({
            cls: "dp-habit-dup",
            text: `\xB7${d.maxPerFile}`
          });
        }
        const tooltipParts = [];
        if (d.habit.label)
          tooltipParts.push(d.habit.label);
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
          void this.applyHabitToggle(
            displayFile,
            d.habit.period,
            d.habit.slug
          );
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
  async applyHabitToggle(file, period, slug) {
    const settings = this.plugin.settings;
    const fallback = {
      folder: settings.dailyNoteFolderFallback,
      format: settings.dailyNoteFormatFallback,
      template: settings.dailyNoteTemplate,
      dateLinkFormat: settings.dateLinkFormat
    };
    const target = file ? file : await ensureDailyNote(this.app, this.selectedDate, fallback);
    await this.app.vault.process(
      target,
      (content) => toggleHabitOnContent(content, settings.habitPrefix, period, slug)
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
      if (file instanceof import_obsidian4.TFile) {
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
          new import_obsidian4.Notice(`Today: failed to write actual time (${e.message})`);
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
    if (!(file instanceof import_obsidian4.TFile)) {
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
        new import_obsidian4.Notice(nextPhase === "rest" ? "Break time" : "Back to focus");
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
    (0, import_obsidian4.setIcon)(editTask, "pencil");
    editTask.addEventListener("click", () => {
      this.openTaskEditor(file, task);
    });
    const showTimeline = topBar.createEl("button", {
      cls: "dp-pomo-iconbtn",
      attr: { "aria-label": "Show timeline" }
    });
    (0, import_obsidian4.setIcon)(showTimeline, "list");
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
    (0, import_obsidian4.setIcon)(popout, this.isPopout() ? "monitor" : "picture-in-picture-2");
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
    (0, import_obsidian4.setIcon)(exit, "x");
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
    const hints = wrap.createDiv({ cls: "dp-pomo-hints" });
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
      const slash = name.indexOf("/");
      if (slash >= 0) {
        item.createSpan({ text: name.slice(0, slash) });
        item.createSpan({
          cls: "dp-project-suggest-sub",
          text: name.slice(slash)
        });
      } else {
        item.createSpan({ text: name });
      }
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
  };
  const detect = () => {
    var _a;
    const cursor = (_a = input.selectionStart) != null ? _a : input.value.length;
    const before = input.value.slice(0, cursor);
    let best = null;
    for (const rule of live) {
      const idx = before.lastIndexOf(rule.trigger);
      if (idx < 0)
        continue;
      const query = before.slice(idx + rule.trigger.length);
      if (/[\s#]/.test(query))
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
var TaskEditModal = class extends import_obsidian4.Modal {
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
    const durLabel = this.contentEl.createDiv({
      cls: "dp-prompt-step-label is-mobile-hidden",
      text: "Duration"
    });
    durLabel.setAttribute("aria-hidden", "true");
    const row = this.contentEl.createDiv({ cls: "dp-duration-row" });
    const buttons = [];
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
        buttons.forEach((b) => b.removeClass("is-selected"));
        btn.addClass("is-selected");
        updateSummary();
      });
      buttons.push(btn);
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
      (0, import_obsidian4.setIcon)(btn, iconName);
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
          const slash = name.indexOf("/");
          if (slash >= 0) {
            el.createSpan({ text: name.slice(0, slash) });
            el.createSpan({
              cls: "dp-project-suggest-sub",
              text: name.slice(slash)
            });
          } else {
            el.createSpan({ text: name });
          }
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
            buttons.forEach((b, i) => {
              var _a2;
              b.toggleClass(
                "is-selected",
                ((_a2 = this.opts.durations[i]) == null ? void 0 : _a2.min) === min
              );
            });
          }
          replaceTriggerRange(start, cursor, "");
          updateSummary();
        }
      },
      // Date rule keeps the resolved Date alongside the keyword in a parallel
      // map so commit() can rebuild the link without re-parsing the keyword.
      (() => {
        const dateMap = /* @__PURE__ */ new Map();
        const fmt = this.opts.dateLinkFormat;
        return {
          trigger: this.opts.dateTrigger,
          getSuggestions: (q) => {
            dateMap.clear();
            const items = buildDateSuggestions(q);
            for (const it of items)
              dateMap.set(it.keyword, it.date);
            return items.map((it) => it.keyword);
          },
          renderItem: (el, keyword) => {
            el.createSpan({ text: keyword });
            const d = dateMap.get(keyword);
            if (d && fmt.trim()) {
              el.createSpan({
                cls: "dp-project-suggest-sub",
                text: ` ${(0, import_obsidian4.moment)(d).format(fmt.trim())}`
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
        this.opts.mode === "new" || this.durationChanged ? this.selectedDurationMin : null,
        resolveProject(),
        this.checkedChanged ? this.checked : null,
        extras
      );
      this.close();
    };
    const enterToSubmit = (ev) => {
      if (ev.key === "Enter") {
        ev.preventDefault();
        submit();
      }
    };
    input.addEventListener("keydown", enterToSubmit);
    projInput.addEventListener("keydown", enterToSubmit);
    descInput.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter" && (ev.metaKey || ev.ctrlKey)) {
        ev.preventDefault();
        submit();
      }
    });
    const subHeader = this.contentEl.createDiv({ cls: "dp-edit-subtask-header" });
    const subLabel = subHeader.createDiv({
      cls: "dp-prompt-step-label",
      text: "Sub-tasks"
    });
    subLabel.setAttribute("aria-hidden", "true");
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
      const textEl = row2.createSpan({
        cls: "dp-edit-subtask-text",
        text: cleanBody(sub.text)
      });
      const handle = row2.createSpan({ cls: "dp-edit-subtask-handle" });
      (0, import_obsidian4.setIcon)(handle, "grip-vertical");
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
            const tagPrefix = `#${prefixes.time}/`;
            const stripped = cleaned.startsWith(tagPrefix) ? cleaned.slice(tagPrefix.length) : cleaned;
            const parsed = parseTime(`${tagPrefix}${stripped}`, prefixes);
            if (parsed === null) {
              new import_obsidian4.Notice("Invalid time, try e.g. 7p or 6:30p");
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
      cls: "dp-edit-icon-btn",
      attr: { "aria-label": "Show in note", title: "Show in note" }
    });
    showBtn.type = "button";
    (0, import_obsidian4.setIcon)(showBtn, "eye");
    showBtn.addEventListener("click", () => {
      if (this.opts.mode === "new") {
        submit("show");
        return;
      }
      this.close();
      this.opts.onShowInNote();
    });
    if (this.opts.mode === "edit") {
      const moveChoices = (_b = this.opts.moveChoices) != null ? _b : [];
      const moveWrap = actions.createDiv({ cls: "dp-edit-move-wrap" });
      const moveBtn = moveWrap.createEl("button", {
        cls: "dp-edit-icon-btn",
        attr: { "aria-label": "Move to\u2026", title: "Move to\u2026" }
      });
      moveBtn.type = "button";
      (0, import_obsidian4.setIcon)(moveBtn, "forward");
      const choices = moveWrap.createDiv({ cls: "dp-edit-move-choices" });
      choices.style.display = "none";
      const choiceBtns = [];
      for (const choice of moveChoices) {
        const btn = choices.createEl("button", {
          cls: "dp-edit-move-choice",
          attr: {
            "aria-label": `Move to ${choice.label} (${choice.hotkey})`,
            title: `Move to ${choice.label} (${choice.hotkey})`
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
      let stageTwoActive = false;
      let keyHandler = null;
      const setSubBtnsDisabled = (disabled) => {
        for (const b of choiceBtns)
          b.disabled = disabled;
      };
      const exitStageTwo = () => {
        stageTwoActive = false;
        choices.style.display = "none";
        choices.removeClass("is-open");
        if (keyHandler) {
          this.contentEl.removeEventListener("keydown", keyHandler, true);
          keyHandler = null;
        }
      };
      const runWith = async (action) => {
        setSubBtnsDisabled(true);
        const moved = await action();
        if (moved)
          this.close();
        else
          setSubBtnsDisabled(false);
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
            exitStageTwo();
            moveBtn.focus();
            return;
          }
          for (const choice of moveChoices) {
            if (ev.key === choice.hotkey) {
              ev.preventDefault();
              ev.stopPropagation();
              void runWith(choice.onChoose);
              return;
            }
          }
        };
        this.contentEl.addEventListener("keydown", keyHandler, true);
      });
    }
    const pomoBtn = actions.createEl("button", {
      cls: "dp-edit-icon-btn",
      attr: { "aria-label": "Pomodoro", title: "Pomodoro" }
    });
    pomoBtn.type = "button";
    (0, import_obsidian4.setIcon)(pomoBtn, "timer");
    pomoBtn.addEventListener("click", () => {
      if (this.opts.mode === "new") {
        submit("pomodoro");
        return;
      }
      this.close();
      this.opts.onStartPomodoro();
    });
    const saveBtn = actions.createEl("button", {
      cls: "dp-edit-save-btn mod-cta",
      text: this.opts.mode === "new" ? "Add task" : "Save"
    });
    saveBtn.type = "button";
    saveBtn.addEventListener("click", () => submit());
    window.setTimeout(() => {
      input.focus();
      if (this.opts.mode === "edit" && !/\s$/.test(input.value)) {
        input.value = input.value + " ";
      }
      const end = input.value.length;
      input.setSelectionRange(end, end);
    }, 0);
  }
  onClose() {
    this.contentEl.empty();
    document.body.removeClass("today-edit-open");
  }
};
var SubtaskQuickAddModal = class extends import_obsidian4.Modal {
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

// src/habitsView.ts
var import_obsidian5 = require("obsidian");
var VIEW_TYPE_HABITS_STATS = "today-habits-stats";
var HabitsStatsView = class extends import_obsidian5.ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.rerenderTimer = null;
    this.plugin = plugin;
  }
  getViewType() {
    return VIEW_TYPE_HABITS_STATS;
  }
  getDisplayText() {
    return "Habit stats";
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
      dateLinkFormat: settings.dateLinkFormat
    };
    const heading = root.createDiv({ cls: "dp-habit-stats-header" });
    heading.createEl("h3", { text: "Habit stats" });
    const { habits, goals } = await this.loadHabitsAndGoals();
    if (habits.length === 0 && goals.length === 0) {
      root.createDiv({
        cls: "dp-habit-stats-empty",
        text: `No habits found. Add tags like #${settings.habitPrefix}/day/<slug> to ${settings.habitsFile}.`
      });
      return;
    }
    const today = startOfDay(new Date());
    const window2 = settings.habitsStatsWindow;
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
  async loadHabitsAndGoals() {
    const path = this.plugin.settings.habitsFile;
    const f = this.app.vault.getAbstractFileByPath(path);
    if (!(f instanceof import_obsidian5.TFile))
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
            h.period,
            h.slug
          );
          for (const l of lines)
            if (l.checked)
              count++;
        }
        cells.push({ bucket: b, checkedCount: count });
        totalChecked += count;
        if (count > 0)
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
          totalReps += set.reps;
          exerciseTotals.set(
            s.name,
            ((_a = exerciseTotals.get(s.name)) != null ? _a : 0) + set.reps
          );
          if (set.done) {
            doneByName.set(s.name, ((_b = doneByName.get(s.name)) != null ? _b : 0) + set.reps);
          }
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
        const summary = `${row.hits}/${row.cells.length}`;
        labelEl.createSpan({
          cls: "dp-heatmap-habit-summary",
          text: summary
        });
        if (row.habit.label)
          labelEl.title = row.habit.label;
        for (const cell of row.cells) {
          const cellEl = grid.createDiv({
            cls: "dp-heatmap-cell q" + quintile(cell.checkedCount) + (cell.bucket.isCurrent ? " is-current" : "")
          });
          const word = cell.checkedCount === 1 ? "completion" : "completions";
          cellEl.title = `${row.habit.slug} \xB7 ${cell.bucket.tooltip}
${cell.checkedCount} ${word}`;
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

// src/main.ts
var import_obsidian7 = require("obsidian");
var polyfillInstalled = false;
var TodayPlugin = class extends import_obsidian6.Plugin {
  async onload() {
    await this.loadSettings();
    this.habitsScanner = new HabitsScanner(this.app);
    if (import_obsidian6.Platform.isMobile && !polyfillInstalled) {
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
      name: "Open calendar",
      callback: () => void this.activateView({ openCalendar: true })
    });
    this.addCommand({
      id: "open-habits-stats",
      name: "Open habit stats",
      callback: () => void this.activateHabitsStatsView()
    });
    this.addSettingTab(new TodaySettingTab(this.app, this));
    this.registerEditorSuggest(new InlineSuggest(this));
    this.registerEvent(
      this.app.vault.on("create", (af) => {
        if (!(af instanceof import_obsidian6.TFile))
          return;
        void applyDailyNoteTemplateIfEmpty(this.app, af, {
          folder: this.settings.dailyNoteFolderFallback,
          format: this.settings.dailyNoteFormatFallback,
          template: this.settings.dailyNoteTemplate,
          dateLinkFormat: this.settings.dateLinkFormat
        });
      })
    );
  }
  async onunload() {
  }
  async loadSettings() {
    var _a, _b;
    const data = await this.loadData();
    this.settings = {
      ...DEFAULT_SETTINGS,
      ...data != null ? data : {},
      prefixes: { ...DEFAULT_PREFIXES, ...(_a = data == null ? void 0 : data.prefixes) != null ? _a : {} },
      autocomplete: {
        ...DEFAULT_AUTOCOMPLETE,
        ...(_b = data == null ? void 0 : data.autocomplete) != null ? _b : {}
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
};
var InlineSuggest = class extends import_obsidian6.EditorSuggest {
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
    if (/[\s#]/.test(query))
      return null;
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
      return buildDateSuggestions(query).map((s) => ({
        kind,
        display: s.keyword,
        subDisplay: fmt.trim() ? ` ${(0, import_obsidian7.moment)(s.date).format(fmt.trim())}` : void 0,
        insert: buildDateLinkInsert(
          this.app,
          s.date,
          settings.dailyNoteFormatFallback,
          settings.dailyNoteFolderFallback,
          fmt
        ) + " "
      }));
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
