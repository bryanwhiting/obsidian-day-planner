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
var import_obsidian5 = require("obsidian");
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
  exercise: "x"
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
    project: new RegExp(`#${esc(prefixes.project)}\\/([\\w-]+)`),
    exercise: new RegExp(
      `#${esc(prefixes.exercise)}\\/([\\w-]+)\\/(\\d+)(?:\\/(\\d+(?:\\.\\d+)?))?`,
      "g"
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
  const indent = m[1];
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
    project,
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
    `#(?:${esc(prefixes.duration)}|${esc(prefixes.time)}|${esc(prefixes.order)}|${esc(prefixes.project)}|${esc(prefixes.exercise)})\\/`
  );
  const tagMatch = tagRe.exec(body);
  const tagsPart = tagMatch ? body.slice(tagMatch.index).trim() : "";
  const trimmedTitle = newTitle.trim();
  const newBody = tagsPart ? `${trimmedTitle} ${tagsPart}` : trimmedTitle;
  return `${indent}- [${checkbox}] ${newBody}`;
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
  }
}

// src/settings.ts
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
  projectColors: [],
  timelineHeightDesktop: "",
  timelineHeightMobile: ""
};
var CSS_LENGTH_RE = /^\d+(?:\.\d+)?(?:px|vh|vw|em|rem|%)$/;
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
    this.renderProjectsSection(containerEl);
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
      "exercise"
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
      " prefix; it's added automatically. Projects without a pinned color get distinct auto-assigned colors alphabetically."
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
    new import_obsidian3.Notice(`Created ${resolved.path}`);
  return file;
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

// src/view.ts
var VIEW_TYPE_TODAY = "today-view";
var TRANSPARENT_PIXEL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkAAIAAAoAAv/lxKUAAAAASUVORK5CYII=";
function nowMinutes() {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
}
var QUICK_DURATIONS = [
  { label: "15m", min: 15 },
  { label: "30m", min: 30 },
  { label: "45m", min: 45 },
  { label: "1h", min: 60 },
  { label: "1h30m", min: 90 },
  { label: "2h", min: 120 },
  { label: "3h", min: 180 }
];
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
      exercises,
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
    this.hasRendered = true;
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
    const label = nav.createDiv({ cls: "dp-datenav-label" });
    label.textContent = this.formatDateLabel(this.selectedDate);
    const calBtn = nav.createEl("button", {
      cls: "dp-cal-btn",
      attr: { "aria-label": "Toggle calendar" }
    });
    (0, import_obsidian4.setIcon)(calBtn, "calendar");
    if (this.calendarOpen)
      calBtn.addClass("is-active");
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
      template: this.plugin.settings.dailyNoteTemplate
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
  renderSection(parent, title, subtitle, file, path, tasks, exercises, isPrimary, colorMap, openActiveTarget = null) {
    const section = parent.createDiv({ cls: "dp-section" });
    if (this.summariesCollapsed)
      section.addClass("is-summaries-collapsed");
    const header = section.createDiv({ cls: "dp-header" });
    if (isPrimary) {
      const collapseBtn = header.createEl("button", {
        cls: "dp-summaries-toggle",
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
    }
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
    if (isPrimary) {
      const workout = header.createDiv({ cls: "dp-workout" });
      workout.textContent = formatExerciseLine(exercises);
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
    new TitlePromptModal(this.app, {
      heading: `New task at ${this.fmtClock(startMin)}`,
      placeholder: "Task title\u2026",
      durations: QUICK_DURATIONS,
      projects: this.collectProjectNames(),
      defaultDurationMin,
      onSubmit: (title, durationMin, project) => {
        const newLine = buildTaskLine(title, prefixes, {
          startMin,
          durationMin,
          project
        });
        void this.appendTaskAfterLast(file, newLine);
      }
    }).open();
  }
  createUnscheduledTask(file) {
    const prefixes = this.plugin.settings.prefixes;
    new TitlePromptModal(this.app, {
      heading: "New unscheduled task",
      placeholder: "Task title\u2026",
      durations: QUICK_DURATIONS,
      projects: this.collectProjectNames(),
      defaultDurationMin: this.plugin.settings.defaultDurationMin,
      onSubmit: (title, durationMin, project) => {
        const newLine = buildTaskLine(title, prefixes, { durationMin, project });
        void this.appendTaskAfterLast(file, newLine);
      }
    }).open();
  }
  async appendTaskAfterLast(file, newLine) {
    await this.app.vault.process(file, (content) => {
      const lines = content.split("\n");
      const lastIdx = findLastTaskLine(content);
      const insertAt = lastIdx === -1 ? lines.length : lastIdx + 1;
      lines.splice(insertAt, 0, newLine);
      return lines.join("\n");
    });
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
      (0, import_obsidian4.setIcon)(warn, "alert-triangle");
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
      const card = body.createDiv({ cls: "dp-card" });
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
        (0, import_obsidian4.setIcon)(warn, "alert-triangle");
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
  renderPlannedTable(parent, tasks) {
    const totals = computeTotals(tasks);
    const total = totals.scheduledMin + totals.unscheduledMin;
    const settings = this.plugin.settings;
    const workdayMin = Math.max(
      0,
      (settings.workEndHour - settings.workStartHour) * 60
    );
    const workRange = `${this.formatHourLabel(settings.workStartHour)}-${this.formatHourLabel(settings.workEndHour)}`;
    const headerLabel = `Workday (${workRange}; ${formatTotal(workdayMin)})`;
    const table = parent.createDiv({ cls: "dp-stat-table" });
    table.createSpan({ cls: "dp-st-h", text: headerLabel });
    table.createSpan({ cls: "dp-st-h dp-st-h-right", text: "Planned" });
    this.renderStatRow(table, "Scheduled", totals.scheduledMin);
    this.renderStatRow(table, "Unscheduled", totals.unscheduledMin);
    this.renderStatRow(table, "Total", total, true);
    if (total > workdayMin) {
      this.renderStatRow(table, "Overbooked", total - workdayMin);
      const cells = Array.from(table.children);
      cells.slice(-2).forEach((el) => el.classList.add("dp-st-warn"));
    }
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
    const totFree = workOpen + nonWorkOpen;
    const sleepDurationMin = 24 * 60 - (sleepMin - wakeMin);
    const table = parent.createDiv({ cls: "dp-stat-table" });
    table.createSpan({ cls: "dp-st-h", text: "Unblocked" });
    table.createSpan({ cls: "dp-st-h dp-st-h-right", text: "Free" });
    this.renderStatRow(table, "Workday", workOpen);
    this.renderStatRow(table, "Other", nonWorkOpen);
    this.renderStatRow(table, "Sleep", sleepDurationMin);
    this.renderStatRow(table, "Tot Free", totFree, true);
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
    const p = this.plugin.settings.prefixes;
    return body.replace(new RegExp(`#${p.duration}\\/\\S+`, "g"), "").replace(new RegExp(`#${p.time}\\/\\S+`, "g"), "").replace(new RegExp(`#${p.order}\\/\\d+`, "g"), "").replace(new RegExp(`#${p.project}\\/[\\w-]+`, "g"), "").replace(new RegExp(`#${p.exercise}\\/\\S+`, "g"), "").replace(/\s+/g, " ").trim();
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
    new TaskEditModal(this.app, {
      initialTitle: this.cleanBody(task.body),
      initialDurationMin: task.durationMin,
      initialProject: task.project,
      initialChecked: task.checked,
      subtasks: task.subtasks,
      projects: this.collectProjectNames(),
      durations: QUICK_DURATIONS,
      onSave: (title, durationMin, project, checked) => {
        void this.applyTaskEdit(file, task, title, durationMin, project, checked);
      },
      onToggleSubtask: async (sub, checked) => {
        await this.applyLineChecked(file, sub.lineNumber, checked);
      },
      onAddSubtask: async (text) => {
        return await this.appendSubtask(file, task, text);
      },
      onShowInNote: () => {
        void this.openLine(file, task.lineNumber, this.endOfTitleCh(task.rawLine));
      }
    }).open();
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
      const subIndent = fresh.indent + "  ";
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
  async applyTaskEdit(file, task, newTitle, newDurationMin, newProject, newChecked) {
    const prefixes = this.plugin.settings.prefixes;
    await this.app.vault.process(file, (content) => {
      const lines = content.split("\n");
      if (task.lineNumber >= lines.length)
        return content;
      let updated = setTaskTitle(lines[task.lineNumber], newTitle, prefixes);
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
var TitlePromptModal = class extends import_obsidian4.Modal {
  constructor(app, opts) {
    super(app);
    this.opts = opts;
    this.datalistId = `dp-projects-${Math.random().toString(36).slice(2, 9)}`;
  }
  onOpen() {
    this.modalEl.addClass("dp-title-modal");
    this.titleEl.setText(this.opts.heading);
    this.renderTitleStep();
  }
  renderTitleStep() {
    this.contentEl.empty();
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
        if (this.opts.durations && this.opts.durations.length > 0) {
          this.renderDurationStep(title);
        } else {
          this.opts.onSubmit(title, this.opts.defaultDurationMin, null);
          this.close();
        }
      }
    });
  }
  renderDurationStep(title) {
    var _a, _b;
    this.contentEl.empty();
    const summary = this.contentEl.createDiv({ cls: "dp-prompt-summary" });
    summary.createSpan({ cls: "dp-prompt-summary-label", text: "Task" });
    summary.createSpan({
      cls: "dp-prompt-summary-value",
      text: title || "(untitled)"
    });
    const projLabel = this.contentEl.createDiv({
      cls: "dp-prompt-step-label",
      text: "Project"
    });
    projLabel.setAttribute("aria-hidden", "true");
    const projRow = this.contentEl.createDiv({ cls: "dp-project-row" });
    const projInput = projRow.createEl("input", {
      type: "text",
      cls: "dp-project-input",
      attr: {
        placeholder: "(none)",
        list: this.datalistId,
        autocomplete: "off"
      }
    });
    const datalist = projRow.createEl("datalist");
    datalist.id = this.datalistId;
    ((_a = this.opts.projects) != null ? _a : []).forEach((name) => {
      datalist.createEl("option", { attr: { value: name } });
    });
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
      cls: "dp-prompt-step-label",
      text: "How long?"
    });
    durLabel.setAttribute("aria-hidden", "true");
    const row = this.contentEl.createDiv({ cls: "dp-duration-row" });
    const durations = (_b = this.opts.durations) != null ? _b : [];
    const buttons = [];
    const resolveProject = () => {
      const raw = projInput.value.trim();
      if (!raw)
        return null;
      return sanitizeProjectName(raw) || null;
    };
    durations.forEach((d, idx) => {
      const btn = row.createEl("button", {
        cls: "dp-duration-btn",
        text: d.label
      });
      btn.type = "button";
      btn.setAttribute("aria-label", `${d.label} (${idx + 1})`);
      btn.addEventListener("click", () => {
        this.opts.onSubmit(title, d.min, resolveProject());
        this.close();
      });
      buttons.push(btn);
    });
    projInput.addEventListener("keydown", (ev) => {
      var _a2;
      if (ev.key === "Enter") {
        ev.preventDefault();
        projInput.blur();
        (_a2 = buttons[0]) == null ? void 0 : _a2.focus();
      }
    });
    durations.forEach((d, idx) => {
      this.scope.register([], `${idx + 1}`, (ev) => {
        if (document.activeElement === projInput)
          return;
        ev.preventDefault();
        this.opts.onSubmit(title, d.min, resolveProject());
        this.close();
        return false;
      });
    });
    projInput.focus();
  }
  onClose() {
    this.contentEl.empty();
  }
};
function sanitizeProjectName(raw) {
  return raw.trim().replace(/[^\w-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}
var TaskEditModal = class extends import_obsidian4.Modal {
  constructor(app, opts) {
    super(app);
    this.durationChanged = false;
    this.checkedChanged = false;
    this.opts = opts;
    this.selectedDurationMin = opts.initialDurationMin;
    this.checked = opts.initialChecked;
    this.datalistId = `dp-projects-${Math.random().toString(36).slice(2, 9)}`;
  }
  onOpen() {
    var _a;
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
    const input = titleRow.createEl("input", {
      type: "text",
      cls: "dp-title-input",
      attr: { placeholder: "Task title\u2026" }
    });
    input.value = this.opts.initialTitle;
    const projLabel = this.contentEl.createDiv({
      cls: "dp-prompt-step-label",
      text: "Project"
    });
    projLabel.setAttribute("aria-hidden", "true");
    const projRow = this.contentEl.createDiv({ cls: "dp-project-row" });
    const projInput = projRow.createEl("input", {
      type: "text",
      cls: "dp-project-input",
      attr: {
        placeholder: "(none)",
        list: this.datalistId,
        autocomplete: "off"
      }
    });
    projInput.value = (_a = this.opts.initialProject) != null ? _a : "";
    const datalist = projRow.createEl("datalist");
    datalist.id = this.datalistId;
    this.opts.projects.forEach((name) => {
      datalist.createEl("option", { attr: { value: name } });
    });
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
      cls: "dp-prompt-step-label",
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
      });
      buttons.push(btn);
    });
    const resolveProject = () => {
      var _a2;
      const raw = projInput.value.trim();
      const initial = (_a2 = this.opts.initialProject) != null ? _a2 : "";
      if (raw === initial)
        return void 0;
      if (!raw)
        return "";
      return sanitizeProjectName(raw) || void 0;
    };
    const submit = () => {
      this.opts.onSave(
        input.value.trim(),
        this.durationChanged ? this.selectedDurationMin : null,
        resolveProject(),
        this.checkedChanged ? this.checked : null
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
    const subLabel = this.contentEl.createDiv({
      cls: "dp-prompt-step-label",
      text: "Sub-tasks"
    });
    subLabel.setAttribute("aria-hidden", "true");
    const list = this.contentEl.createDiv({ cls: "dp-edit-subtasks" });
    const renderSubtask = (sub) => {
      let checked = sub.checked;
      const row2 = list.createDiv({ cls: "dp-edit-subtask" });
      if (checked)
        row2.addClass("is-done");
      const box = row2.createSpan({ cls: "dp-edit-check" });
      if (checked)
        box.addClass("is-checked");
      row2.createSpan({
        cls: "dp-edit-subtask-text",
        text: sub.text
      });
      row2.addEventListener("click", () => {
        checked = !checked;
        row2.toggleClass("is-done", checked);
        box.toggleClass("is-checked", checked);
        void this.opts.onToggleSubtask(sub, checked);
      });
    };
    this.opts.subtasks.forEach(renderSubtask);
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
      text: "Show in note"
    });
    showBtn.type = "button";
    showBtn.addEventListener("click", () => {
      this.close();
      this.opts.onShowInNote();
    });
    const saveBtn = actions.createEl("button", {
      cls: "dp-edit-save-btn mod-cta",
      text: "Save"
    });
    saveBtn.type = "button";
    saveBtn.addEventListener("click", submit);
    input.focus();
    input.select();
  }
  onClose() {
    this.contentEl.empty();
  }
};

// src/main.ts
var polyfillInstalled = false;
var TodayPlugin = class extends import_obsidian5.Plugin {
  async onload() {
    await this.loadSettings();
    if (import_obsidian5.Platform.isMobile && !polyfillInstalled) {
      (0, import_mobile_drag_drop.polyfill)({ holdToDrag: 200 });
      polyfillInstalled = true;
    }
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
      name: "Open calendar",
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
/*! Bundled license information:

mobile-drag-drop/index.min.js:
  (*! mobile-drag-drop 3.0.0-rc.0 | Copyright (c) 2022 Tim Ruffles | MIT License *)
*/
