var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key2, value) => key2 in obj ? __defProp(obj, key2, { enumerable: true, configurable: true, writable: true, value }) : obj[key2] = value;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key2 of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key2) && key2 !== except)
        __defProp(to, key2, { get: () => from[key2], enumerable: !(desc = __getOwnPropDesc(from, key2)) || desc.enumerable });
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
var __publicField = (obj, key2, value) => {
  __defNormalProp(obj, typeof key2 !== "symbol" ? key2 + "" : key2, value);
  return value;
};
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var __privateMethod = (obj, member, method) => {
  __accessCheck(obj, member, "access private method");
  return method;
};

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
var import_obsidian12 = require("obsidian");
var import_mobile_drag_drop = __toESM(require_index_min());

// src/view.ts
var import_obsidian5 = require("obsidian");

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
  actual: "ta",
  taskContext: "tc",
  taskCreated: "tcr"
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
  for (const set2 of sets) {
    const key2 = set2.weight === null ? "" : String(set2.weight);
    const cur = buckets.get(key2);
    if (cur)
      cur.reps += set2.reps;
    else
      buckets.set(key2, { reps: set2.reps, weight: set2.weight });
  }
  const parts = [];
  for (const { reps, weight } of buckets.values()) {
    parts.push(weight === null ? `${reps}` : `${reps}\xD7${weight}`);
  }
  return parts.join(", ");
}
function formatExerciseSummary(summary) {
  const done = formatSets(summary.sets.filter((s) => s.done));
  const pending2 = formatSets(summary.sets.filter((s) => !s.done));
  if (done && pending2)
    return `${summary.name} ${done} (${pending2})`;
  if (done)
    return `${summary.name} ${done}`;
  if (pending2)
    return `${summary.name} (${pending2})`;
  return summary.name;
}
function parseTaggedLine(content, tagName) {
  const tag2 = tagName.replace(/^#+/, "").trim();
  if (!tag2)
    return null;
  const esc = tag2.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`#${esc}(?![A-Za-z0-9_/])\\s*([^\\n]*)`);
  for (const line of content.split("\n")) {
    const m = re.exec(line);
    if (!m)
      continue;
    const text2 = m[1].trim();
    if (text2.length === 0)
      continue;
    return text2;
  }
  return null;
}
function parseFrontmatterField(frontmatter, tagName) {
  if (!frontmatter)
    return null;
  const key2 = tagName.replace(/^#+/, "").trim();
  if (!key2)
    return null;
  const v = frontmatter[key2];
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
    const tag2 = m[1];
    if (!seen.has(tag2)) {
      seen.add(tag2);
      out.push(tag2);
    }
  }
  return out;
}
function parseDescription(body) {
  const m = DESCRIPTION_RE.exec(body);
  if (!m)
    return null;
  const text2 = m[1].trim();
  return text2.length > 0 ? text2 : null;
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
function appendTag(rawLine, tag2) {
  const trimmed = rawLine.replace(/[ \t]+$/, "");
  const sep = trimmed.endsWith(" ") ? "" : " ";
  return trimmed + sep + tag2;
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
    const next2 = trimmed ? body.replace(DESCRIPTION_RE, `{${trimmed}}`) : body.replace(DESCRIPTION_RE, "").replace(/[ \t]+/g, " ").trim();
    return `${indent}- [${checkbox}] ${next2}`;
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
  var _a5, _b3;
  const result = /* @__PURE__ */ new Map();
  const userMap = /* @__PURE__ */ new Map();
  for (const m of userMappings) {
    const key2 = (_a5 = m.project) == null ? void 0 : _a5.trim();
    const color = (_b3 = m.color) == null ? void 0 : _b3.trim();
    if (key2 && color)
      userMap.set(key2.toLowerCase(), color);
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
  var _a5;
  if (!project)
    return null;
  if (subproject) {
    const sub = colorMap.get(`${project}/${subproject}`);
    if (sub)
      return sub;
  }
  return (_a5 = colorMap.get(project)) != null ? _a5 : null;
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
      const apply2 = actions.createEl("button", {
        cls: "dp-edit-save-btn mod-cta",
        text: `Migrate ${this.totalReplacements} ${this.totalReplacements === 1 ? "tag" : "tags"}`
      });
      apply2.type = "button";
      apply2.addEventListener("click", () => void this.apply(apply2));
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
          var _a5;
          fileChanges++;
          const newPrefix = (_a5 = map.get(oldPrefix)) != null ? _a5 : oldPrefix;
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
function keyLabel(key2) {
  switch (key2) {
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
    const current2 = this.plugin.settings.prefixes;
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
    for (const key2 of keys) {
      const oldP = snap[key2];
      const newP = current2[key2];
      if (oldP && newP && oldP !== newP) {
        changes.push({ key: key2, oldPrefix: oldP, newPrefix: newP });
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
      "Optional vault paths to weekday-specific template files. The matching file's contents are appended to the base ",
      makeCode("Daily note template"),
      " when a daily note is created on that day \u2014 handy for routines that vary by day (e.g. ",
      makeCode("monday.md"),
      " for the weekly review). Leave a row blank to skip; the base template still applies."
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
      new import_obsidian2.Setting(containerEl).setName(dayLabels[day]).setDesc(`Appended to the base template on ${dayLabels[day]}.`).addText((t) => {
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
      var _a5;
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
        var _a6;
        const original = nameInput.value;
        const stripped = stripPrefix(original);
        if (stripped !== original) {
          const pos = Math.max(0, (_a6 = nameInput.selectionStart) != null ? _a6 : 0);
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
      iconInput.value = (_a5 = entry.icon) != null ? _a5 : "";
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
      var _a5;
      const row = list.createDiv({ cls: "dp-project-color-row" });
      const nameWrap = row.createDiv({ cls: "dp-project-color-name-wrap" });
      nameWrap.createSpan({ cls: "dp-project-color-prefix", text: "#" });
      const nameInput = nameWrap.createEl("input", {
        cls: "dp-project-color-name",
        attr: { type: "text", placeholder: "tag" }
      });
      nameInput.value = entry.tag;
      nameInput.addEventListener("input", () => {
        var _a6;
        if (nameInput.value.startsWith("#")) {
          const pos = Math.max(0, ((_a6 = nameInput.selectionStart) != null ? _a6 : 1) - 1);
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
      iconInput.value = (_a5 = entry.icon) != null ? _a5 : "";
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
function clampInt(v, lo, hi, fallback2) {
  const n = parseInt(v, 10);
  if (isNaN(n))
    return fallback2;
  return Math.max(lo, Math.min(hi, n));
}
function makeCode(text2) {
  const el = document.createElement("code");
  el.textContent = text2;
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
function makeAnchor(href, text2) {
  const a = document.createElement("a");
  a.href = href;
  a.textContent = text2;
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
    var _a5;
    el.addClass("dp-file-suggestion");
    el.createDiv({ cls: "dp-file-suggestion-name", text: file.basename });
    const parent = (_a5 = file.parent) == null ? void 0 : _a5.path;
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
      for (const child2 of folder.children) {
        if (child2 instanceof import_obsidian2.TFolder)
          walk(child2);
      }
    };
    walk(this.app.vault.getRoot());
    const matches = q ? folders.filter((f) => f.path.toLowerCase().includes(q)) : folders;
    return matches.sort((a, b) => a.path.localeCompare(b.path)).slice(0, 50);
  }
  renderSuggestion(folder, el) {
    var _a5;
    el.addClass("dp-file-suggestion");
    el.createDiv({ cls: "dp-file-suggestion-name", text: folder.name });
    const parent = (_a5 = folder.parent) == null ? void 0 : _a5.path;
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
  let current2 = [];
  let currentEnd = -1;
  for (const t of scheduled) {
    const start = t.startMin;
    const end = start + t.durationMin;
    if (current2.length === 0 || start < currentEnd) {
      current2.push(t);
      currentEnd = Math.max(currentEnd, end);
    } else {
      groups.push(current2);
      current2 = [t];
      currentEnd = end;
    }
  }
  if (current2.length)
    groups.push(current2);
  return groups;
}

// src/dailyNote.ts
var import_obsidian3 = require("obsidian");
async function resolveDailyNote(app, date, fallback2) {
  var _a5;
  const opts = readDailyNotesOptions(app);
  const format = (opts.format || fallback2.format).trim();
  const folder = ((_a5 = opts.folder) != null ? _a5 : fallback2.folder).trim();
  const fileName = formatDate(date, format) + ".md";
  const path = (0, import_obsidian3.normalizePath)(folder ? `${folder}/${fileName}` : fileName);
  const file = app.vault.getAbstractFileByPath(path);
  return {
    path,
    file: file instanceof import_obsidian3.TFile ? file : null
  };
}
async function ensureDailyNote(app, date, fallback2, notify = true) {
  var _a5;
  const resolved = await resolveDailyNote(app, date, fallback2);
  if (resolved.file)
    return resolved.file;
  const folder = resolved.path.includes("/") ? resolved.path.slice(0, resolved.path.lastIndexOf("/")) : "";
  if (folder) {
    const existing = app.vault.getAbstractFileByPath(folder);
    if (!existing)
      await app.vault.createFolder(folder);
  }
  const basename = resolved.path.split("/").pop().replace(/\.md$/i, "");
  const rawTemplate = await readCombinedTemplate(app, fallback2, date);
  const quote = await pickRandomQuote(app, fallback2.quotesFile);
  const expanded = expandDateTemplate(
    rawTemplate,
    basename,
    app,
    fallback2.format,
    fallback2.folder,
    (_a5 = fallback2.dateLinkFormat) != null ? _a5 : "",
    quote
  );
  const withDurations = fallback2.prefixes ? applyComputedParentDurations(expanded, fallback2.prefixes) : expanded;
  const initialContent = fallback2.addCreatedTag && fallback2.prefixes ? addFrontmatterTag(
    withDurations,
    `${fallback2.prefixes.taskCreated}/${todayDateStr()}`
  ) : withDurations;
  const file = await app.vault.create(resolved.path, initialContent);
  if (notify)
    new import_obsidian3.Notice(`Created ${resolved.path}`);
  return file;
}
async function applyDailyNoteTemplateIfEmpty(app, file, fallback2) {
  var _a5, _b3, _c2, _d;
  if (file.extension !== "md")
    return;
  const opts = readDailyNotesOptions(app);
  const folder = stripSlashes(((_a5 = opts.folder) != null ? _a5 : fallback2.folder).trim());
  const format = (opts.format || fallback2.format).trim() || "YYYY-MM-DD";
  const fileFolder = stripSlashes((_c2 = (_b3 = file.parent) == null ? void 0 : _b3.path) != null ? _c2 : "");
  if (fileFolder !== folder)
    return;
  if (!parseFilenameDate(file.basename, format))
    return;
  const existing = await app.vault.read(file);
  if (existing.length > 0)
    return;
  const parsed = parseFilenameDate(file.basename, format);
  const refDate = parsed != null ? parsed : new Date();
  const template = await readCombinedTemplate(app, fallback2, refDate);
  if (!template)
    return;
  const quote = await pickRandomQuote(app, fallback2.quotesFile);
  const expanded = expandDateTemplate(
    template,
    file.basename,
    app,
    format,
    folder,
    (_d = fallback2.dateLinkFormat) != null ? _d : "",
    quote
  );
  const withDurations = fallback2.prefixes ? applyComputedParentDurations(expanded, fallback2.prefixes) : expanded;
  const finalContent = fallback2.addCreatedTag && fallback2.prefixes ? addFrontmatterTag(
    withDurations,
    `${fallback2.prefixes.taskCreated}/${todayDateStr()}`
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
async function readCombinedTemplate(app, fallback2, date) {
  const base = await readTemplateContent(app, fallback2.template);
  const byDay = fallback2.templatesByDay;
  if (!byDay)
    return base;
  const dayKey = WEEKDAY_NAMES[date.getDay()];
  const dayPath = byDay[dayKey];
  if (!dayPath)
    return base;
  const dayContent = await readTemplateContent(app, dayPath);
  if (!dayContent)
    return base;
  if (!base)
    return dayContent;
  const baseTrimmed = base.replace(/\s+$/, "");
  return `${baseTrimmed}

${dayContent}`;
}
function readDailyNotesOptions(app) {
  var _a5, _b3, _c2;
  const internal = app.internalPlugins;
  const plugin = (_a5 = internal == null ? void 0 : internal.getPluginById) == null ? void 0 : _a5.call(internal, "daily-notes");
  return (_c2 = (_b3 = plugin == null ? void 0 : plugin.instance) == null ? void 0 : _b3.options) != null ? _c2 : {};
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
    var _a5;
    return (_a5 = replacements[m]) != null ? _a5 : m;
  });
}
function addDays(d, n) {
  const next2 = new Date(d);
  next2.setDate(next2.getDate() + n);
  return next2;
}
function addMonths(d, n) {
  const next2 = new Date(d);
  next2.setDate(1);
  next2.setMonth(next2.getMonth() + n);
  return next2;
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
function getDailyNoteOptions(app, fallback2) {
  var _a5;
  const opts = readDailyNotesOptions(app);
  const format = (opts.format || fallback2.format || "YYYY-MM-DD").trim();
  const folder = stripSlashes(((_a5 = opts.folder) != null ? _a5 : fallback2.folder).trim());
  return { folder, format };
}
function parseDailyNoteDateStr(basename, format) {
  const d = parseFilenameDate(basename, format);
  return d ? toIsoDateStr(d) : null;
}
function listDailyNotes(app, options) {
  var _a5, _b3;
  const out = [];
  for (const file of app.vault.getMarkdownFiles()) {
    const fileFolder = stripSlashes((_b3 = (_a5 = file.parent) == null ? void 0 : _a5.path) != null ? _b3 : "");
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
function addFrontmatterTag(content, tag2) {
  const fmRe = /^---\r?\n([\s\S]*?)\r?\n---(\r?\n|$)/;
  const match = content.match(fmRe);
  if (!match) {
    return `---
tags:
  - ${tag2}
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
    const insert = ["tags:", `  - ${tag2}`];
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
    if (bullets.includes(tag2))
      return content;
    if (value === "[]")
      lines[tagsIdx] = "tags:";
    lines.splice(lastBulletIdx + 1, 0, `  - ${tag2}`);
  } else if (value.startsWith("[") && value.endsWith("]")) {
    const inner = value.slice(1, -1).trim();
    const items = inner === "" ? [] : inner.split(",").map((s) => s.trim().replace(/^["']|["']$/g, "")).filter((s) => s.length > 0);
    if (items.includes(tag2))
      return content;
    items.push(tag2);
    lines[tagsIdx] = `tags: [${items.join(", ")}]`;
  } else {
    const items = value.split(",").map((s) => s.trim().replace(/^["']|["']$/g, "")).filter((s) => s.length > 0);
    if (items.includes(tag2))
      return content;
    items.push(tag2);
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
  var _a5, _b3;
  const m = (0, import_obsidian3.moment)(date);
  const fileBasename = m.format(fileFormat || "YYYY-MM-DD");
  const cleanFolder = (folder || "").replace(/^\/+|\/+$/g, "");
  const linkPath = cleanFolder ? `${cleanFolder}/${fileBasename}` : fileBasename;
  const display = (displayFormat || "").trim() ? m.format(displayFormat.trim()) : "";
  const useMd = ((_b3 = (_a5 = app.vault).getConfig) == null ? void 0 : _b3.call(_a5, "useMarkdownLinks")) === true;
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
    var _a5;
    const dir = (((_a5 = f.parent) == null ? void 0 : _a5.path) || "").toLowerCase();
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
    var _a5;
    return {
      basename: f.basename,
      path: f.path,
      folder: ((_a5 = f.parent) == null ? void 0 : _a5.path) || ""
    };
  });
}
function buildPersonLinkInsert(app, path) {
  var _a5, _b3;
  const basename = (path.split("/").pop() || path).replace(/\.md$/i, "");
  const useMd = ((_b3 = (_a5 = app.vault).getConfig) == null ? void 0 : _b3.call(_a5, "useMarkdownLinks")) === true;
  if (useMd) {
    const url = encodeURI(path);
    return `[${basename}](${url})`;
  }
  return `[[${basename}]]`;
}

// src/taskMove.ts
var import_obsidian4 = require("obsidian");
async function moveTaskBetweenDailyNotes(app, sourceFile, task, targetDate, fallback2, options = {}) {
  var _a5;
  const notify = options.notify !== false;
  const targetFile = (_a5 = options.targetFile) != null ? _a5 : await ensureDailyNote(app, targetDate, fallback2);
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
  var _a5;
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
    const label = ((_a5 = m[4]) != null ? _a5 : "").trim();
    const key2 = `${period}/${name}`;
    if (seen.has(key2))
      continue;
    seen.add(key2);
    goals.push({ period, name, target, label });
  }
  return goals;
}
function parseHabitsFile(content, prefix) {
  var _a5;
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
    const label = ((_a5 = m[4]) != null ? _a5 : "").trim();
    const parsed = targetRaw ? parseNum(targetRaw) : 1;
    const target = Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
    const key2 = `${period}/${slug}`;
    if (seen.has(key2))
      continue;
    seen.add(key2);
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
  async readDateContent(date, fallback2) {
    const resolved = await resolveDailyNote(this.app, date, fallback2);
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
        var _a5, _b3;
        const path = (_b3 = (_a5 = this.app.workspace.getActiveFile()) == null ? void 0 : _a5.path) != null ? _b3 : null;
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
    const next2 = !allCollapsed;
    this.summariesCollapsed = next2;
    this.habitsCollapsed = next2;
  }
  togglePomodoroPause() {
    var _a5;
    const state2 = this.pomodoroState;
    if (!state2)
      return;
    const workMs = this.plugin.settings.pomodoroWorkMin * 6e4;
    const breakMs = this.plugin.settings.pomodoroBreakMin * 6e4;
    const phaseMs = state2.phase === "work" ? workMs : breakMs;
    const expired = state2.paused && state2.pausedRemainingMs !== null && state2.pausedRemainingMs <= 0;
    if (expired) {
      this.bankWorkProgress();
      state2.phase = state2.phase === "work" ? "rest" : "work";
      state2.startedAt = Date.now();
      state2.paused = false;
      state2.pausedRemainingMs = null;
      state2.workPhaseBankedMs = 0;
    } else if (state2.paused) {
      const remain = (_a5 = state2.pausedRemainingMs) != null ? _a5 : phaseMs;
      state2.startedAt = Date.now() - (phaseMs - remain);
      state2.paused = false;
      state2.pausedRemainingMs = null;
    } else {
      this.bankWorkProgress();
      const elapsed = Date.now() - state2.startedAt;
      state2.paused = true;
      state2.pausedRemainingMs = Math.max(0, phaseMs - elapsed);
    }
    this.scheduleRender();
  }
  // Enter-key behavior: check off the next unfinished subtask if there is one,
  // otherwise mark the parent task done and exit focus mode.
  async advancePomodoroComplete() {
    const state2 = this.pomodoroState;
    if (!state2)
      return;
    const file = this.app.vault.getAbstractFileByPath(state2.filePath);
    if (!(file instanceof import_obsidian5.TFile))
      return;
    const content = await this.app.vault.read(file);
    const tasks = parseFileTasks(
      file.path,
      content,
      this.plugin.settings.prefixes,
      this.plugin.settings.defaultDurationMin
    );
    let task = tasks.find((t) => t.lineNumber === state2.taskLineNumber);
    if (!task || this.cleanBody(task.body) !== state2.taskBodySnapshot) {
      task = tasks.find(
        (t) => this.cleanBody(t.body) === state2.taskBodySnapshot
      );
      if (task)
        state2.taskLineNumber = task.lineNumber;
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
    const state2 = this.pomodoroState;
    if (!state2)
      return;
    const file = this.app.vault.getAbstractFileByPath(state2.filePath);
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
    var _a5, _b3, _c2, _d, _e;
    const root7 = this.containerEl.children[1];
    if (this.pomodoroState && !this.pomodoroHidden) {
      const handled = await this.renderPomodoro(root7);
      if (handled)
        return;
    }
    const prevRootScroll = root7.scrollTop;
    const prevTimelineScrolls = Array.from(
      root7.querySelectorAll(".dp-timeline-wrap")
    ).map((el) => el.scrollTop);
    root7.empty();
    root7.addClass("today-root");
    if (!root7.hasAttribute("tabindex"))
      root7.setAttribute("tabindex", "-1");
    const fallback2 = {
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
      fallback2
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
    const frontmatter = displayFile ? (_b3 = (_a5 = this.app.metadataCache.getFileCache(displayFile)) == null ? void 0 : _a5.frontmatter) != null ? _b3 : null : null;
    const intention = displayFile ? (_c2 = parseFrontmatterField(frontmatter, this.plugin.settings.intentionTag)) != null ? _c2 : parseTaggedLine(fileContent, this.plugin.settings.intentionTag) : null;
    const quote = displayFile ? (_d = parseFrontmatterField(frontmatter, this.plugin.settings.quoteTag)) != null ? _d : parseTaggedLine(fileContent, this.plugin.settings.quoteTag) : null;
    const activeFile = this.app.workspace.getActiveFile();
    this.lastActiveFilePath = (_e = activeFile == null ? void 0 : activeFile.path) != null ? _e : null;
    const showOpenActiveLink = activeFile !== null && (!displayFile || activeFile.path !== displayFile.path);
    this.renderDateNav(root7, displayFile);
    const colorMap = resolveProjectColors(
      tasks.filter(
        (t) => t.project !== null
      ),
      this.plugin.settings.projectColors
    );
    const habitDisplays = await this.loadHabitDisplays(
      this.selectedDate,
      fileContent,
      fallback2
    );
    this.renderSection(
      root7,
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
    this.renderTimelineHints(root7);
    root7.scrollTop = prevRootScroll;
    const newTimelines = root7.querySelectorAll(".dp-timeline-wrap");
    newTimelines.forEach((el, i) => {
      const prev = prevTimelineScrolls[i];
      if (prev !== void 0)
        el.scrollTop = prev;
    });
    this.hasRendered = true;
  }
  renderTimelineHints(root7) {
    if (!this.hintsVisible)
      return;
    const overlay = root7.createDiv({ cls: "dp-hints-overlay" });
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
    const addHint = (key2, label) => {
      const item = hints.createSpan({ cls: "dp-pomo-hint" });
      item.createEl("kbd", { cls: "dp-pomo-kbd", text: key2 });
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
    const next2 = nav.createEl("button", {
      cls: "dp-nav-btn dp-nav-arrow",
      attr: { "aria-label": "Next day" }
    });
    (0, import_obsidian5.setIcon)(next2, "chevron-right");
    prev.addEventListener(
      "click",
      () => void this.navigateTo(addDays(this.selectedDate, -1))
    );
    next2.addEventListener(
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
    const fallback2 = {
      folder: this.plugin.settings.dailyNoteFolderFallback,
      format: this.plugin.settings.dailyNoteFormatFallback,
      template: this.plugin.settings.dailyNoteTemplate,
      templatesByDay: this.plugin.settings.dailyNoteTemplatesByDay,
      dateLinkFormat: this.plugin.settings.dateLinkFormat,
      prefixes: this.plugin.settings.prefixes,
      quotesFile: this.plugin.settings.quotesFile,
      addCreatedTag: this.plugin.settings.addCreatedTagToFrontmatter
    };
    const resolved = await resolveDailyNote(this.app, target, fallback2);
    if (!resolved.file) {
      try {
        await ensureDailyNote(this.app, target, fallback2);
      } catch (e) {
        new import_obsidian5.Notice(`Today: failed to create note (${e.message})`);
      }
    }
    this.scheduleRender();
  }
  renderCalendar(parent) {
    const cal = parent.createDiv({ cls: "dp-calendar" });
    const head2 = cal.createDiv({ cls: "dp-cal-head" });
    const prev = head2.createEl("button", { cls: "dp-nav-btn", text: "\u25C0" });
    const monthLabel = head2.createDiv({ cls: "dp-cal-month" });
    monthLabel.textContent = this.calendarMonth.toLocaleDateString(void 0, {
      month: "long",
      year: "numeric"
    });
    const next2 = head2.createEl("button", { cls: "dp-nav-btn", text: "\u25B6" });
    prev.addEventListener("click", () => {
      this.calendarMonth = addMonths(this.calendarMonth, -1);
      this.scheduleRender();
    });
    next2.addEventListener("click", () => {
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
  renderInlineMarkdown(text2, el, sourcePath) {
    void import_obsidian5.MarkdownRenderer.render(this.app, text2, el, sourcePath, this).then(
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
        const link2 = sub.createEl("a", {
          cls: "dp-subtitle-link",
          text: "Open Active Note",
          attr: {
            href: "#",
            "aria-label": `Open active note: ${openActiveTarget.path}`,
            title: openActiveTarget.path
          }
        });
        link2.addEventListener("click", (ev) => {
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
        const fallback2 = {
          folder: this.plugin.settings.dailyNoteFolderFallback,
          format: this.plugin.settings.dailyNoteFormatFallback,
          template: this.plugin.settings.dailyNoteTemplate,
          templatesByDay: this.plugin.settings.dailyNoteTemplatesByDay,
          prefixes: this.plugin.settings.prefixes,
          quotesFile: this.plugin.settings.quotesFile,
          addCreatedTag: this.plugin.settings.addCreatedTagToFrontmatter
        };
        await ensureDailyNote(this.app, this.selectedDate, fallback2);
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
    for (const block2 of layout)
      this.renderBlock(blocksLayer, file, block2, colorMap);
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
    var _a5, _b3;
    if (!this.dropIndicator || this.dropIndicator.parentElement !== layer) {
      (_a5 = this.dropIndicator) == null ? void 0 : _a5.detach();
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
    if ((_b3 = this.dragPayload) == null ? void 0 : _b3.bodyText) {
      ind.createDiv({
        cls: "dp-drop-indicator-text",
        text: this.dragPayload.bodyText
      });
    }
  }
  hideDropIndicator() {
    var _a5;
    (_a5 = this.dropIndicator) == null ? void 0 : _a5.detach();
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
        var _a5, _b3;
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
          (_a5 = extras == null ? void 0 : extras.subtaskRawLines) != null ? _a5 : [],
          (_b3 = extras == null ? void 0 : extras.postAction) != null ? _b3 : "none"
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
    var _a5, _b3;
    const strip = layer.createDiv({ cls: "dp-note-strip" });
    if (note.checked)
      strip.addClass("is-done");
    strip.style.top = `${topPx}px`;
    const ctx = this.findContextTag(note);
    const projectColor = getTaskColor(note.project, note.subproject, colorMap);
    const color = (_b3 = (_a5 = ctx == null ? void 0 : ctx.color) != null ? _a5 : projectColor) != null ? _b3 : null;
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
  renderBlock(layer, file, block2, colorMap) {
    var _a5, _b3;
    const el = layer.createDiv({ cls: "dp-block" });
    el.style.top = `${block2.topPx}px`;
    el.style.height = `${Math.max(18, block2.heightPx)}px`;
    el.style.left = `${block2.leftPct}%`;
    el.style.width = `${block2.widthPct}%`;
    if (block2.task.checked)
      el.addClass("is-done");
    if (!block2.task.hasExplicitDuration)
      el.addClass("is-implicit-duration");
    if (block2.task.durationMin < 25)
      el.addClass("is-compact");
    const narrow = block2.widthPct < 99.5;
    if (narrow) {
      el.addClass("is-narrow");
      if (block2.task.durationMin <= 15)
        el.addClass("is-narrow-mini");
      else if (block2.task.durationMin <= 30)
        el.addClass("is-narrow-2line");
    }
    if (import_obsidian5.Platform.isMobile)
      el.addClass("is-mobile-condensed");
    const ctx = this.findContextTag(block2.task);
    const projectColor = getTaskColor(
      block2.task.project,
      block2.task.subproject,
      colorMap
    );
    const color = (_b3 = (_a5 = ctx == null ? void 0 : ctx.color) != null ? _a5 : projectColor) != null ? _b3 : null;
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
    if (!block2.task.hasExplicitDuration) {
      const warn = meta.createSpan({ cls: "dp-warn" });
      (0, import_obsidian5.setIcon)(warn, "alert-triangle");
      warn.setAttribute("aria-label", "No #d/ tag \u2014 using default duration");
    }
    const compactTime = block2.task.startMin !== null && (import_obsidian5.Platform.isMobile || narrow && block2.task.durationMin <= 30);
    meta.createSpan({
      cls: "dp-block-time",
      text: compactTime ? this.fmtClock(block2.task.startMin) : this.formatBlockTime(block2.task)
    });
    row.createSpan({ cls: "dp-block-sep", text: "\xB7" });
    if (block2.task.project) {
      const projWrap = row.createSpan({ cls: "dp-block-project-wrap" });
      const projIcon = this.resolveProjectIcon(block2.task.project);
      if (projIcon) {
        const ic = projWrap.createSpan({ cls: "dp-block-project-icon" });
        (0, import_obsidian5.setIcon)(ic, projIcon);
      }
      projWrap.createSpan({ cls: "dp-block-project", text: block2.task.project });
      if (block2.task.subproject) {
        projWrap.createSpan({
          cls: "dp-block-subproject",
          text: `/${block2.task.subproject}`
        });
      }
      row.createSpan({ cls: "dp-block-sep", text: "\xB7" });
    }
    if (block2.task.tags.length > 0) {
      const tagsWrap = row.createSpan({ cls: "dp-block-tags" });
      for (const tag2 of block2.task.tags) {
        tagsWrap.createSpan({ cls: "dp-block-tag", text: tag2 });
      }
      row.createSpan({ cls: "dp-block-sep", text: "\xB7" });
    }
    const titleText = row.createSpan({
      cls: "dp-block-text",
      text: this.cleanBody(block2.task.body)
    });
    titleText.addEventListener("click", (ev) => {
      ev.stopPropagation();
      void this.applyLineChecked(
        file,
        block2.task.lineNumber,
        !block2.task.checked
      );
    });
    titleText.addEventListener("pointerdown", (ev) => ev.stopPropagation());
    titleText.addEventListener("mousedown", (ev) => ev.stopPropagation());
    titleText.addEventListener("dragstart", (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
    });
    if (block2.task.description && block2.heightPx >= 36) {
      el.createDiv({
        cls: "dp-block-description",
        text: block2.task.description
      });
    }
    if (block2.task.subtasks.length > 0 && block2.heightPx >= 44) {
      const subList = el.createDiv({ cls: "dp-block-subtasks" });
      const prefixes = this.plugin.settings.prefixes;
      block2.task.subtasks.forEach((sub) => {
        const subRow = subList.createDiv({ cls: "dp-block-subtask" });
        if (sub.checked)
          subRow.addClass("is-done");
        const text2 = subRow.createSpan({ cls: "dp-block-subtask-text" });
        const subMin = parseTime(sub.text, prefixes);
        if (subMin !== null) {
          text2.createSpan({
            cls: "dp-block-subtask-time",
            text: this.fmtClock(subMin)
          });
          const body = this.cleanBody(sub.text);
          if (body)
            text2.appendText(" " + body);
        } else {
          text2.setText(this.cleanBody(sub.text));
        }
        text2.addEventListener("click", (ev) => {
          ev.stopPropagation();
          void this.applyLineChecked(file, sub.lineNumber, !sub.checked);
        });
        text2.addEventListener("pointerdown", (ev) => ev.stopPropagation());
        text2.addEventListener("mousedown", (ev) => ev.stopPropagation());
        text2.addEventListener("dragstart", (ev) => {
          ev.preventDefault();
          ev.stopPropagation();
        });
      });
    }
    el.addEventListener("dragstart", (ev) => {
      var _a6;
      const rect = el.getBoundingClientRect();
      this.dragPayload = {
        filePath: file.path,
        lineNumber: block2.task.lineNumber,
        rawLine: block2.task.rawLine,
        source: "timeline",
        grabOffsetY: ev.clientY - rect.top,
        durationMin: block2.task.durationMin,
        bodyText: this.cleanBody(block2.task.body),
        hasExplicitDuration: block2.task.hasExplicitDuration,
        subtaskRawLines: block2.task.subtasks.map((s) => s.rawLine)
      };
      el.addClass("is-dragging");
      this.suppressNativeDragImage(ev);
      (_a6 = ev.dataTransfer) == null ? void 0 : _a6.setData("text/plain", block2.task.rawLine);
      if (ev.dataTransfer)
        ev.dataTransfer.effectAllowed = "move";
    });
    el.addEventListener("dragend", () => {
      el.removeClass("is-dragging");
      this.dragPayload = null;
      this.hideDropIndicator();
    });
    el.addEventListener("click", () => this.openTaskEditor(file, block2.task));
    const handle = el.createDiv({ cls: "dp-resize-handle" });
    handle.addEventListener(
      "pointerdown",
      (ev) => this.beginResize(ev, el, file, block2)
    );
    if (block2.task.startMin !== null) {
      const topHandle = el.createDiv({
        cls: "dp-resize-handle dp-resize-handle-top"
      });
      topHandle.addEventListener(
        "pointerdown",
        (ev) => this.beginResizeTop(ev, el, file, block2)
      );
    }
  }
  beginResize(ev, blockEl, file, block2) {
    ev.preventDefault();
    ev.stopPropagation();
    const handle = ev.currentTarget;
    const settings = this.plugin.settings;
    const startY = ev.clientY;
    const startHeightPx = blockEl.offsetHeight;
    const minDuration = settings.snapMin;
    const pxPerMin = settings.pxPerMin;
    let pendingDuration = block2.task.durationMin;
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
      if (timeEl && block2.task.startMin !== null) {
        const start = block2.task.startMin;
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
      if (finalDuration === block2.task.durationMin) {
        blockEl.draggable = true;
        return;
      }
      void this.applyDurationChange(file, block2.task, finalDuration).finally(
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
  beginResizeTop(ev, blockEl, file, block2) {
    if (block2.task.startMin === null)
      return;
    ev.preventDefault();
    ev.stopPropagation();
    const handle = ev.currentTarget;
    const settings = this.plugin.settings;
    const startY = ev.clientY;
    const startTopPx = blockEl.offsetTop;
    const startHeightPx = blockEl.offsetHeight;
    const startStartMin = block2.task.startMin;
    const startDurationMin = block2.task.durationMin;
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
        block2.task,
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
        let next2 = setTimeTag(line, newStartMin, prefixes);
        next2 = setDurationTag(next2, newDurationMin, prefixes);
        return next2;
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
    const head2 = list.createDiv({ cls: "dp-unscheduled-head" });
    if (import_obsidian5.Platform.isMobile) {
      const toggleBtn = head2.createEl("button", {
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
    head2.createSpan({ cls: "dp-unscheduled-title", text: "Unscheduled" });
    if (import_obsidian5.Platform.isMobile && unscheduled.length > 0) {
      head2.createSpan({
        cls: "dp-unscheduled-count",
        text: String(unscheduled.length)
      });
    }
    const addBtn = head2.createEl("button", {
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
      var _a5, _b3;
      const card = body.createDiv({ cls: "dp-card" });
      if (task.checked)
        card.addClass("is-done");
      if (!task.hasExplicitDuration)
        card.addClass("is-implicit-duration");
      const ctx = this.findContextTag(task);
      const projectColor = getTaskColor(task.project, task.subproject, colorMap);
      const color = (_b3 = (_a5 = ctx == null ? void 0 : ctx.color) != null ? _a5 : projectColor) != null ? _b3 : null;
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
        for (const tag2 of task.tags) {
          tagsWrap.createSpan({ cls: "dp-card-tag", text: tag2 });
        }
      }
      const textCol = card.createDiv({ cls: "dp-card-text-col" });
      const text2 = textCol.createDiv({ cls: "dp-card-text" });
      text2.textContent = this.cleanBody(task.body);
      if (task.description) {
        textCol.createDiv({
          cls: "dp-card-description",
          text: task.description
        });
      }
      card.addEventListener("dragstart", (ev) => {
        var _a6;
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
        (_a6 = ev.dataTransfer) == null ? void 0 : _a6.setData("text/plain", task.rawLine);
        if (ev.dataTransfer)
          ev.dataTransfer.effectAllowed = "move";
      });
      card.addEventListener("dragend", () => {
        card.removeClass("is-dragging");
        this.dragPayload = null;
        this.hideDropIndicator();
      });
      card.addEventListener("dragover", (ev) => {
        var _a6;
        if (((_a6 = this.dragPayload) == null ? void 0 : _a6.source) === "unscheduled")
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
      var _a5;
      if (((_a5 = this.dragPayload) == null ? void 0 : _a5.source) === "timeline")
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
      let next2 = setTimeTag(line, newStartMin, prefixes);
      next2 = removeOrderTag(next2, prefixes);
      if (subtaskSum > 0 && parseDuration(next2, prefixes) === null) {
        next2 = setDurationTag(next2, subtaskSum, prefixes);
      }
      return next2;
    });
  }
  async handleUnschedule(payload, unscheduled) {
    const prefixes = this.plugin.settings.prefixes;
    const maxOrder = unscheduled.reduce(
      (acc, t) => t.order !== null && t.order > acc ? t.order : acc,
      0
    );
    await this.editLine(payload, (line) => {
      let next2 = removeTimeTag(line, prefixes);
      next2 = setOrderTag(next2, maxOrder + 1, prefixes);
      return next2;
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
      const next2 = transform(lines[idx]);
      if (next2 === lines[idx])
        return content;
      lines[idx] = next2;
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
    var _a5;
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
          ((_a5 = agg.subs.get(t.subproject)) != null ? _a5 : 0) + t.durationMin
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
    var _a5, _b3;
    const p = this.plugin.settings.prefixes;
    let out = body.replace(new RegExp(`#${p.duration}\\/\\S+`, "g"), "").replace(new RegExp(`#${p.time}\\/\\S+`, "g"), "").replace(new RegExp(`#${p.order}\\/\\d+`, "g"), "").replace(new RegExp(`#${p.project}\\/[\\w-]+(?:\\/[\\w-]+)?`, "g"), "").replace(new RegExp(`#${p.exercise}\\/\\S+`, "g"), "").replace(new RegExp(`#${p.actual}\\/\\S+`, "g"), "").replace(new RegExp(`#${p.taskId}\\/[A-Za-z0-9]+\\b`, "g"), "").replace(new RegExp(`#${p.taskContext}\\/[\\w-]+`, "g"), "").replace(/\{[^{}]*\}/g, "");
    for (const ctx of this.plugin.settings.contextTags) {
      const tag2 = (_a5 = ctx.tag) == null ? void 0 : _a5.trim();
      if (!tag2)
        continue;
      const esc = tag2.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      out = out.replace(new RegExp(`#${esc}(?![\\w/-])`, "gi"), "");
    }
    const noteTag = (_b3 = this.plugin.settings.noteTag) == null ? void 0 : _b3.trim();
    if (noteTag) {
      const esc = noteTag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      out = out.replace(new RegExp(`#${esc}(?![\\w/-])`, "gi"), "");
    }
    return out.replace(/\s+/g, " ").trim();
  }
  // Detects the configured note tag on a task body. Notes are events the
  // user wants pinned to a specific time without occupying a calendar block.
  isNoteTask(task) {
    var _a5;
    const tag2 = (_a5 = this.plugin.settings.noteTag) == null ? void 0 : _a5.trim();
    if (!tag2)
      return false;
    const esc = tag2.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`#${esc}(?![\\w/-])`, "i").test(task.body);
  }
  // Returns the first configured context tag whose `#<tag>` appears in the
  // task body, matching whole-tag (not as a prefix of another tag). Order
  // follows the user's settings list so they can prioritise.
  findContextTag(task) {
    var _a5;
    const tags = this.plugin.settings.contextTags;
    if (!tags || tags.length === 0)
      return null;
    for (const ctx of tags) {
      const tag2 = (_a5 = ctx.tag) == null ? void 0 : _a5.trim();
      if (!tag2)
        continue;
      const esc = tag2.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      if (new RegExp(`#${esc}(?![\\w/-])`, "i").test(task.body))
        return ctx;
    }
    return null;
  }
  resolveProjectIcon(project) {
    var _a5;
    if (!project)
      return null;
    for (const pc of this.plugin.settings.projectColors) {
      if (pc.icon && ((_a5 = pc.project) == null ? void 0 : _a5.toLowerCase()) === project.toLowerCase()) {
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
    var _a5;
    const prefixes = this.plugin.settings.prefixes;
    const initialProjectFull = task.project ? task.subproject ? `${task.project}/${task.subproject}` : task.project : null;
    new TaskEditModal(this.app, {
      mode: "edit",
      modalTitle: "Edit task",
      initialTitle: this.cleanBody(task.body),
      initialDescription: (_a5 = task.description) != null ? _a5 : "",
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
      onAddSubtask: async (text2) => {
        return await this.appendSubtask(file, task, text2);
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
    const fallback2 = {
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
      fallback2
    );
  }
  // Carries the task title (with most tags) and any unfinished sub-tasks into
  // the daily note for `targetDate`, while keeping the completed sub-tasks on
  // the source day as a record of partial progress. The source parent is
  // checked off and stamped with a #tid/<id> tag; the new-day copy gets the
  // same tag, so the two can be cross-referenced via search. The order tag
  // (#o/) is stripped on the new copy because positioning is per-day.
  async migrateIncompleteToDate(file, task, targetDate) {
    var _a5;
    const fallback2 = {
      folder: this.plugin.settings.dailyNoteFolderFallback,
      format: this.plugin.settings.dailyNoteFormatFallback,
      template: this.plugin.settings.dailyNoteTemplate,
      templatesByDay: this.plugin.settings.dailyNoteTemplatesByDay,
      dateLinkFormat: this.plugin.settings.dateLinkFormat,
      prefixes: this.plugin.settings.prefixes,
      quotesFile: this.plugin.settings.quotesFile,
      addCreatedTag: this.plugin.settings.addCreatedTagToFrontmatter
    };
    const targetFile = await ensureDailyNote(this.app, targetDate, fallback2);
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
    let current2 = (_a5 = fresh.find((t) => t.lineNumber === task.lineNumber)) != null ? _a5 : fresh.find((t) => this.cleanBody(t.body) === this.cleanBody(task.body));
    if (!current2) {
      new import_obsidian5.Notice("Couldn't locate the task to migrate.");
      return false;
    }
    const existingId = parseTaskId(current2.body, prefixes);
    const taskId = existingId != null ? existingId : generateTaskId(this.plugin.settings.taskIdLength);
    const orderRe = new RegExp(
      `\\s*#${prefixes.order.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\/\\d+\\b`
    );
    let newParentLine = current2.rawLine.replace(orderRe, "");
    newParentLine = setTaskChecked(newParentLine, false);
    newParentLine = setTaskIdTag(newParentLine, taskId, prefixes);
    const uncheckedSubLines = current2.subtasks.filter((s) => !s.checked).map((s) => s.rawLine);
    await this.app.vault.process(file, (content) => {
      const lines = content.split("\n");
      if (current2.lineNumber < lines.length) {
        let parent = lines[current2.lineNumber];
        parent = setTaskChecked(parent, true);
        parent = setTaskIdTag(parent, taskId, prefixes);
        lines[current2.lineNumber] = parent;
      }
      const removeNumbers = current2.subtasks.filter((s) => !s.checked).map((s) => s.lineNumber).sort((a, b) => b - a);
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
  async appendSubtask(file, task, text2) {
    const trimmed = text2.trim();
    if (!trimmed)
      return null;
    let inserted = null;
    await this.app.vault.process(file, (content) => {
      var _a5, _b3;
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
      const subIndent = fresh.subtasks.length > 0 ? (_b3 = (_a5 = /^(\s*)/.exec(fresh.subtasks[fresh.subtasks.length - 1].rawLine)) == null ? void 0 : _a5[1]) != null ? _b3 : fresh.indent + "	" : fresh.indent + "	";
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
    var _a5, _b3;
    const prefix = `#${this.plugin.settings.prefixes.project}/`.toLowerCase();
    const names = /* @__PURE__ */ new Set();
    const cache = this.app.metadataCache;
    const tags = (_b3 = (_a5 = cache.getTags) == null ? void 0 : _a5.call(cache)) != null ? _b3 : {};
    for (const tag2 of Object.keys(tags)) {
      if (tag2.toLowerCase().startsWith(prefix)) {
        const name = tag2.slice(prefix.length);
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
    var _a5, _b3;
    const prefix = `#${this.plugin.settings.prefixes.taskContext}/`.toLowerCase();
    const names = /* @__PURE__ */ new Set();
    const cache = this.app.metadataCache;
    const tags = (_b3 = (_a5 = cache.getTags) == null ? void 0 : _a5.call(cache)) != null ? _b3 : {};
    for (const tag2 of Object.keys(tags)) {
      if (tag2.toLowerCase().startsWith(prefix)) {
        const name = tag2.slice(prefix.length);
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
    var _a5;
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
        const key2 = title.toLowerCase();
        if (seen.has(key2))
          continue;
        seen.add(key2);
        const project = t.project ? t.subproject ? `${t.project}/${t.subproject}` : t.project : null;
        const subtaskRawLines = t.subtasks.map((sub) => {
          const m = /^\s*-\s*\[[^\]]\]\s*(.*)$/.exec(sub.rawLine);
          const text2 = m ? m[1] : sub.text;
          return `	- [ ] ${text2}`;
        });
        out.push({
          title,
          project,
          description: (_a5 = t.description) != null ? _a5 : "",
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
  async loadHabitDisplays(displayDate, displayContent, fallback2) {
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
        const c = await this.plugin.habitsScanner.readDateContent(d, fallback2);
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
    const fallback2 = {
      folder: settings.dailyNoteFolderFallback,
      format: settings.dailyNoteFormatFallback,
      template: settings.dailyNoteTemplate,
      templatesByDay: settings.dailyNoteTemplatesByDay,
      dateLinkFormat: settings.dateLinkFormat,
      prefixes: settings.prefixes,
      quotesFile: settings.quotesFile,
      addCreatedTag: settings.addCreatedTagToFrontmatter
    };
    const target = file ? file : await ensureDailyNote(this.app, this.selectedDate, fallback2);
    await this.app.vault.process(
      target,
      (content) => toggleHabitOnContent(content, settings.habitPrefix, slug)
    );
    this.plugin.habitsScanner.invalidate(target.path);
  }
  isPopout() {
    var _a5;
    const win = (_a5 = this.containerEl.ownerDocument) == null ? void 0 : _a5.defaultView;
    return !!win && win !== window;
  }
  async popOutLeaf() {
    await this.app.workspace.moveLeafToPopout(this.leaf);
  }
  // Move this view back to the main Obsidian window. Pomodoro state and the
  // selected date are transferred to the new view instance so the session
  // doesn't reset on the trip back.
  async returnLeafToMain() {
    var _a5;
    const pomo = this.pomodoroState;
    const selectedDate = this.selectedDate;
    let target = null;
    for (const leaf of this.app.workspace.getLeavesOfType(VIEW_TYPE_TODAY)) {
      const win = (_a5 = leaf.view.containerEl.ownerDocument) == null ? void 0 : _a5.defaultView;
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
  adoptPomodoroState(state2) {
    this.pomodoroState = state2;
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
    const state2 = this.pomodoroState;
    if (!state2)
      return;
    this.bankWorkProgress();
    const minutes = Math.floor(state2.actualMs / 6e4);
    if (minutes > 0) {
      const file = this.app.vault.getAbstractFileByPath(state2.filePath);
      if (file instanceof import_obsidian5.TFile) {
        try {
          const content = await this.app.vault.read(file);
          const tasks = parseFileTasks(
            file.path,
            content,
            this.plugin.settings.prefixes,
            this.plugin.settings.defaultDurationMin
          );
          let task = tasks.find((t) => t.lineNumber === state2.taskLineNumber);
          if (!task) {
            task = tasks.find(
              (t) => this.cleanBody(t.body) === state2.taskBodySnapshot
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
    var _a5;
    const state2 = this.pomodoroState;
    if (!state2)
      return 0;
    const phaseMin = state2.phase === "work" ? this.plugin.settings.pomodoroWorkMin : this.plugin.settings.pomodoroBreakMin;
    const phaseMs = phaseMin * 6e4;
    if (state2.paused) {
      const remain = (_a5 = state2.pausedRemainingMs) != null ? _a5 : phaseMs;
      return Math.max(0, Math.min(phaseMs, phaseMs - remain));
    }
    return Math.max(0, Math.min(phaseMs, Date.now() - state2.startedAt));
  }
  // Folds any work-phase progress that has not yet been counted into actualMs.
  // Safe to call any time; only adds the delta since the last bank.
  bankWorkProgress() {
    const state2 = this.pomodoroState;
    if (!state2 || state2.phase !== "work")
      return;
    const phaseElapsed = this.currentPhaseElapsedMs();
    const delta = phaseElapsed - state2.workPhaseBankedMs;
    if (delta > 0) {
      state2.actualMs += delta;
      state2.workPhaseBankedMs = phaseElapsed;
    }
  }
  // Writes the accumulated whole minutes onto a task line (parent or sub-task)
  // and resets the in-memory accumulator. workPhaseBankedMs stays so we don't
  // double-count time already accounted for in this work phase.
  async commitActualTime(file, lineNumber) {
    const state2 = this.pomodoroState;
    if (!state2)
      return;
    this.bankWorkProgress();
    const minutes = Math.floor(state2.actualMs / 6e4);
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
    state2.actualMs = 0;
  }
  // Returns true if the pomodoro UI handled the render, false if the caller
  // should fall through to the normal timeline render (task gone, etc.).
  async renderPomodoro(root7) {
    const state2 = this.pomodoroState;
    if (!state2)
      return false;
    const file = this.app.vault.getAbstractFileByPath(state2.filePath);
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
    let task = tasks.find((t) => t.lineNumber === state2.taskLineNumber);
    if (!task || this.cleanBody(task.body) !== state2.taskBodySnapshot) {
      task = tasks.find(
        (t) => this.cleanBody(t.body) === state2.taskBodySnapshot
      );
      if (task)
        state2.taskLineNumber = task.lineNumber;
    }
    if (!task) {
      this.exitPomodoro();
      return false;
    }
    const workMs = this.plugin.settings.pomodoroWorkMin * 6e4;
    const breakMs = this.plugin.settings.pomodoroBreakMin * 6e4;
    const phaseMs = state2.phase === "work" ? workMs : breakMs;
    let remainingMs;
    if (state2.paused && state2.pausedRemainingMs !== null) {
      remainingMs = state2.pausedRemainingMs;
    } else {
      remainingMs = phaseMs - (Date.now() - state2.startedAt);
    }
    if (remainingMs <= 0 && !state2.paused) {
      this.bankWorkProgress();
      if (this.plugin.settings.pomodoroAutoCycle) {
        const nextPhase = state2.phase === "work" ? "rest" : "work";
        new import_obsidian5.Notice(nextPhase === "rest" ? "Break time" : "Back to focus");
        state2.phase = nextPhase;
        state2.startedAt = Date.now();
        state2.workPhaseBankedMs = 0;
        const nextMs = nextPhase === "work" ? workMs : breakMs;
        remainingMs = nextMs;
      } else {
        remainingMs = 0;
        state2.paused = true;
        state2.pausedRemainingMs = 0;
      }
    }
    root7.empty();
    root7.addClass("today-root");
    if (!root7.hasAttribute("tabindex"))
      root7.setAttribute("tabindex", "-1");
    const wrap = root7.createDiv({ cls: "dp-pomo" });
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
      text: state2.phase === "work" ? "Focus" : "Break"
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
        new SubtaskQuickAddModal(this.app, async (text2) => {
          const sub = await this.appendSubtask(file, task, text2);
          if (sub)
            this.scheduleRender();
          return sub !== null;
        }).open();
      });
    }
    const actions = wrap.createDiv({ cls: "dp-pomo-actions" });
    const expired = remainingMs <= 0 && state2.paused;
    const pauseBtn = actions.createEl("button", {
      cls: "dp-pomo-pause-btn",
      text: expired ? state2.phase === "work" ? "Start break" : "Start next pomo" : state2.paused ? "Start" : "Pause"
    });
    pauseBtn.type = "button";
    pauseBtn.addEventListener("click", () => {
      var _a5;
      if (expired) {
        this.bankWorkProgress();
        state2.phase = state2.phase === "work" ? "rest" : "work";
        state2.startedAt = Date.now();
        state2.paused = false;
        state2.pausedRemainingMs = null;
        state2.workPhaseBankedMs = 0;
      } else if (state2.paused) {
        const remain = (_a5 = state2.pausedRemainingMs) != null ? _a5 : phaseMs;
        state2.startedAt = Date.now() - (phaseMs - remain);
        state2.paused = false;
        state2.pausedRemainingMs = null;
      } else {
        this.bankWorkProgress();
        const elapsed = Date.now() - state2.startedAt;
        state2.paused = true;
        state2.pausedRemainingMs = Math.max(0, phaseMs - elapsed);
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
      const addHint = (key2, label) => {
        const item = hints.createSpan({ cls: "dp-pomo-hint" });
        item.createEl("kbd", { cls: "dp-pomo-kbd", text: key2 });
        item.createSpan({ cls: "dp-pomo-hint-label", text: label });
      };
      addHint("space", state2.paused ? "start" : "pause");
      addHint("enter", nextSub ? "done sub-task" : "complete");
      if (this.pomodoroSubtaskHistory.length > 0)
        addHint("z", "undo");
      addHint("t", "timeline");
      addHint("p", this.isPopout() ? "return" : "pop out");
      addHint("x", "close");
      addHint("?", "toggle hints");
    }
    const doc = root7.ownerDocument;
    const active = doc == null ? void 0 : doc.activeElement;
    const focusElsewhere = !!active && active !== (doc == null ? void 0 : doc.body) && !this.containerEl.contains(active);
    const isEditable = !!active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA" || active.isContentEditable);
    if (!focusElsewhere && !isEditable && active !== root7) {
      root7.focus({ preventScroll: true });
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
        const slot2 = slots[i];
        if (slot2 < lines.length)
          lines[slot2] = orderedSubs[i].rawLine;
      }
      return lines.join("\n");
    });
  }
  async openLine(file, line, ch = 0) {
    var _a5, _b3, _c2;
    const leaf = this.app.workspace.getLeaf(false);
    await leaf.openFile(file);
    const view = leaf.view;
    (_a5 = view.editor) == null ? void 0 : _a5.setCursor({ line, ch });
    (_c2 = (_b3 = view.editor) == null ? void 0 : _b3.focus) == null ? void 0 : _c2.call(_b3);
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
    const head2 = cal.createDiv({ cls: "dp-cal-head" });
    const prev = head2.createEl("button", { cls: "dp-nav-btn", text: "\u25C0" });
    prev.type = "button";
    const monthLabel = head2.createDiv({ cls: "dp-cal-month" });
    monthLabel.textContent = month.toLocaleDateString(void 0, {
      month: "long",
      year: "numeric"
    });
    const next2 = head2.createEl("button", { cls: "dp-nav-btn", text: "\u25B6" });
    next2.type = "button";
    prev.addEventListener("click", (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      month = addMonths(month, -1);
      draw();
    });
    next2.addEventListener("click", (ev) => {
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
    var _a5, _b3;
    const cursor = (_a5 = input.selectionStart) != null ? _a5 : input.value.length;
    const before = input.value.slice(0, cursor);
    let best = null;
    for (const rule of live) {
      const idx = before.lastIndexOf(rule.trigger);
      if (idx < 0)
        continue;
      const query = before.slice(idx + rule.trigger.length);
      const accept = (_b3 = rule.acceptQuery) != null ? _b3 : (q) => !/[\s#]/.test(q);
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
    var _a5;
    if (!activeRule || triggerStart < 0)
      return;
    const cursor = (_a5 = input.selectionStart) != null ? _a5 : input.value.length;
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
    var _a5, _b3;
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
        var _a6, _b4, _c2, _d;
        ev.preventDefault();
        const search = (_b4 = (_a6 = this.app.internalPlugins) == null ? void 0 : _a6.getPluginById) == null ? void 0 : _b4.call(_a6, "global-search");
        (_d = (_c2 = search == null ? void 0 : search.instance) == null ? void 0 : _c2.openGlobalSearch) == null ? void 0 : _d.call(_c2, `tag:#${prefix}/${id}`);
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
        const tag2 = target.tagName;
        if (tag2 !== "INPUT" && tag2 !== "TEXTAREA")
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
    projInput.value = (_a5 = this.opts.initialProject) != null ? _a5 : "";
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
      currentTags.forEach((tag2, idx) => {
        const chip = tagsHost.createSpan({ cls: "dp-tag-chip" });
        chip.createSpan({ cls: "dp-tag-chip-text", text: tag2 });
        const x = chip.createEl("button", {
          cls: "dp-tag-chip-remove",
          text: "\xD7",
          attr: { "aria-label": `Remove tag ${tag2}` }
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
        var _a6;
        b.toggleClass(
          "is-selected",
          ((_a6 = this.opts.durations[i]) == null ? void 0 : _a6.min) === this.selectedDurationMin
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
      var _a6;
      if (!trigger)
        return;
      if (document.activeElement !== input)
        input.focus();
      const cursor = (_a6 = input.selectionStart) != null ? _a6 : input.value.length;
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
          const tag2 = `#${this.opts.prefixes.time}/${timeDisplayToTagBody(display)} `;
          replaceTriggerRange(start, cursor, tag2);
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
          renderItem: (el, key2) => {
            const person = personMap.get(key2);
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
            el.createSpan({ text: key2 });
            const d = dateMap.get(key2);
            if (d && fmt.trim()) {
              el.createSpan({
                cls: "dp-project-suggest-sub",
                text: ` ${(0, import_obsidian5.moment)(d).format(fmt.trim())}`
              });
            }
          },
          commit: (key2, start, cursor) => {
            const person = personMap.get(key2);
            if (person) {
              const link3 = buildPersonLinkInsert(this.app, person.path);
              replaceTriggerRange(start, cursor, link3 + " ");
              return;
            }
            const d = dateMap.get(key2);
            if (!d) {
              replaceTriggerRange(start, cursor, "");
              return;
            }
            const link2 = buildDateLinkInsert(
              this.app,
              d,
              this.opts.dailyNoteFormat,
              this.opts.dailyNoteFolder,
              fmt
            );
            replaceTriggerRange(start, cursor, link2 + " ");
          }
        };
      })()
    ]);
    const resolveProject = () => {
      var _a6;
      const raw = projInput.value.trim();
      if (this.opts.mode === "new") {
        return raw ? sanitizeProjectName(raw) || null : null;
      }
      const initial = (_a6 = this.opts.initialProject) != null ? _a6 : "";
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
      const pending2 = sanitizeTag(tagInput.value);
      const final = [...currentTags];
      if (pending2 && /^[\w-]+$/.test(pending2) && !final.includes(pending2)) {
        final.push(pending2);
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
          var _a6;
          return acc + ((_a6 = parseDuration(s.text, prefixes)) != null ? _a6 : 0);
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
        const current2 = parseTime(sub.text, prefixes);
        const editor = row2.createEl("input", {
          type: "text",
          cls: "dp-edit-subtask-time-input",
          attr: { placeholder: "e.g. 7p, 6:30p" }
        });
        editor.value = current2 === null ? "" : formatClockShort(current2);
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
          if (totalMin === current2)
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
        const current2 = parseDuration(sub.text, prefixes);
        const editor = row2.createEl("input", {
          type: "text",
          cls: "dp-edit-subtask-time-input",
          attr: { placeholder: "e.g. 30m, 1h30m" }
        });
        editor.value = current2 === null ? "" : formatCompactDuration(current2);
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
          if (totalMin === current2)
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
          const next2 = editor.value.trim();
          editor.remove();
          const before = cleanBody(sub.text);
          if (commit && next2 && next2 !== before) {
            sub.rawLine = setTaskTitle(sub.rawLine, next2, prefixes);
            const m = /^\s*-\s*\[[^\]]\]\s+(.*)$/.exec(sub.rawLine);
            if (m)
              sub.text = m[1];
            textEl.setText(cleanBody(sub.text));
            updateSubTotal();
            if (this.opts.onEditSubtask) {
              void this.opts.onEditSubtask(sub, next2);
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
      const text2 = addInput.value.trim();
      if (!text2)
        return;
      addInput.disabled = true;
      addBtn.disabled = true;
      let sub;
      if (this.opts.onAddSubtask) {
        sub = await this.opts.onAddSubtask(text2);
      } else {
        sub = {
          lineNumber: pendingSubLineCounter--,
          rawLine: `	- [ ] ${text2}`,
          text: text2,
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
      const isTriggerActive = (text2) => {
        const tp = triggerPopoverEl();
        if (tp && tp.style.display !== "none")
          return true;
        return triggerStrings.some((t) => text2.includes(t));
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
        var _a6;
        input.value = sugg.title;
        input.setSelectionRange(sugg.title.length, sugg.title.length);
        descInput.value = sugg.description;
        projInput.value = (_a6 = sugg.project) != null ? _a6 : "";
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
            const text2 = m ? m[1] : rawLine;
            subs.push({
              lineNumber: pendingSubLineCounter--,
              rawLine,
              text: text2,
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
      const moveChoices = (_b3 = this.opts.moveChoices) != null ? _b3 : [];
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
      const runWith = async (action2) => {
        setSubBtnsDisabled(true);
        const moved = await action2();
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
      var _a6;
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
        (_a6 = selected != null ? selected : buttons[0]) == null ? void 0 : _a6.focus();
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
      const text2 = input.value.trim();
      if (!text2)
        return;
      submitting = true;
      input.disabled = true;
      const ok = await this.onSubmit(text2);
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

// src/collect.ts
var import_obsidian6 = require("obsidian");
var TASK_LINE2 = /^(\s*)- \[([ xX/\-!?*<>])\]\s+(.*)$/;
async function collectUnfinished(plugin) {
  const fallback2 = {
    folder: plugin.settings.dailyNoteFolderFallback,
    format: plugin.settings.dailyNoteFormatFallback
  };
  const dailyOptions = getDailyNoteOptions(plugin.app, fallback2);
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
    const apply2 = actions.createEl("button", {
      cls: "dp-edit-save-btn mod-cta",
      text: `Migrate ${this.plan.totalCount} ${taskWord}`
    });
    apply2.type = "button";
    apply2.addEventListener("click", () => {
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
      const next2 = taskLines[k];
      if (next2.indent.length <= t.indent.length)
        break;
      if (!next2.checked && !next2.migrated)
        subtree.push(next2);
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
function appendBlockToPlan(subtree, root7, date, prefixes, idLength, edits, inboxLines) {
  for (const line of subtree) {
    let id = parseTaskId(line.body, prefixes);
    let updatedSource = line.rawLine;
    if (!id) {
      id = generateTaskId(idLength);
      updatedSource = setTaskIdTag(updatedSource, id, prefixes);
    }
    const migratedSource = setTaskMigrated(updatedSource);
    const rebasedIndent = stripIndentPrefix(line.indent, root7.indent);
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
var VIEW_TYPE_HABITS_STATS = "today-habits-stats";
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
    const root7 = this.containerEl.children[1];
    root7.empty();
    root7.addClass("today-root");
    root7.addClass("dp-habit-stats");
    const settings = this.plugin.settings;
    const fallback2 = {
      folder: settings.dailyNoteFolderFallback,
      format: settings.dailyNoteFormatFallback,
      template: settings.dailyNoteTemplate,
      templatesByDay: settings.dailyNoteTemplatesByDay,
      dateLinkFormat: settings.dateLinkFormat,
      quotesFile: settings.quotesFile
    };
    const heading = root7.createDiv({ cls: "dp-habit-stats-header" });
    heading.createEl("h3", { text: "Habit stats" });
    this.renderTabs(root7);
    const { habits, goals } = await this.loadHabitsAndGoals();
    if (habits.length === 0 && goals.length === 0) {
      root7.createDiv({
        cls: "dp-habit-stats-empty",
        text: `No habits found. Add tags like #${settings.habitPrefix}/day/<slug> to ${settings.habitsFile}.`
      });
      return;
    }
    const today = startOfDay(new Date());
    const window2 = settings.habitsStatsWindow;
    if (this.activeTab === "workouts") {
      await this.renderWorkoutLog(root7, today, window2, fallback2);
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
      fallback2
    );
    const weekSection = await this.buildSection(
      "Week",
      "week",
      weekBuckets,
      habits,
      goals,
      fallback2
    );
    const monthSection = await this.buildSection(
      "Month",
      "month",
      monthBuckets,
      habits,
      goals,
      fallback2
    );
    this.renderSection(root7, daySection);
    this.renderSection(root7, weekSection);
    this.renderSection(root7, monthSection);
  }
  renderTabs(parent) {
    const tabsEl = parent.createDiv({ cls: "dp-habit-stats-tabs" });
    const make = (key2, label) => {
      const el = tabsEl.createEl("button", {
        cls: "dp-habit-stats-tab" + (this.activeTab === key2 ? " is-active" : ""),
        text: label
      });
      el.onclick = () => {
        if (this.activeTab === key2)
          return;
        this.activeTab = key2;
        void this.render();
      };
    };
    make("habits", "Habits");
    make("workouts", "Workouts");
  }
  async renderWorkoutLog(parent, today, window2, fallback2) {
    var _a5, _b3, _c2, _d;
    const settings = this.plugin.settings;
    const days = [];
    for (let i = window2 - 1; i >= 0; i--)
      days.push(addDays(today, -i));
    const repsByDate = /* @__PURE__ */ new Map();
    const totalsByName = /* @__PURE__ */ new Map();
    for (const d of days) {
      const c = await this.plugin.habitsScanner.readDateContent(d, fallback2);
      const m = /* @__PURE__ */ new Map();
      if (c) {
        const summaries = parseExercises(c, settings.prefixes);
        for (const s of summaries) {
          let reps = 0;
          for (const set2 of s.sets)
            if (set2.done)
              reps += set2.reps;
          if (reps > 0) {
            m.set(s.name, reps);
            totalsByName.set(s.name, ((_a5 = totalsByName.get(s.name)) != null ? _a5 : 0) + reps);
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
        const reps = (_c2 = (_b3 = repsByDate.get(d.getTime())) == null ? void 0 : _b3.get(name)) != null ? _c2 : 0;
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
  async buildSection(name, period, buckets, allHabits, allGoals, fallback2) {
    var _a5, _b3, _c2;
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
      const c = await this.plugin.habitsScanner.readDateContent(d, fallback2);
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
        for (const set2 of s.sets) {
          if (!set2.done)
            continue;
          totalReps += set2.reps;
          exerciseTotals.set(
            s.name,
            ((_a5 = exerciseTotals.get(s.name)) != null ? _a5 : 0) + set2.reps
          );
          doneByName.set(s.name, ((_b3 = doneByName.get(s.name)) != null ? _b3 : 0) + set2.reps);
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
          reps += (_c2 = m.get(g.name)) != null ? _c2 : 0;
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
  let current2 = null;
  for (const b of buckets) {
    const key2 = `${b.start.getFullYear()}-${b.start.getMonth()}`;
    if (current2 && current2.key === key2) {
      current2.span++;
    } else {
      if (current2)
        out.push({ label: current2.label, span: current2.span });
      const label = b.start.toLocaleDateString(void 0, { month: "short" });
      current2 = { key: key2, label, span: 1 };
    }
  }
  if (current2)
    out.push({ label: current2.label, span: current2.span });
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

// src/multiDayView.ts
var import_obsidian11 = require("obsidian");

// node_modules/esm-env/dev-fallback.js
var _a, _b;
var node_env = (_b = (_a = globalThis.process) == null ? void 0 : _a.env) == null ? void 0 : _b.NODE_ENV;
var dev_fallback_default = node_env && !node_env.toLowerCase().startsWith("prod");

// node_modules/svelte/src/internal/shared/utils.js
var is_array = Array.isArray;
var index_of = Array.prototype.indexOf;
var includes = Array.prototype.includes;
var array_from = Array.from;
var object_keys = Object.keys;
var define_property = Object.defineProperty;
var get_descriptor = Object.getOwnPropertyDescriptor;
var get_descriptors = Object.getOwnPropertyDescriptors;
var object_prototype = Object.prototype;
var array_prototype = Array.prototype;
var get_prototype_of = Object.getPrototypeOf;
var is_extensible = Object.isExtensible;
var noop = () => {
};
function run_all(arr) {
  for (var i = 0; i < arr.length; i++) {
    arr[i]();
  }
}
function deferred() {
  var resolve;
  var reject;
  var promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

// node_modules/svelte/src/internal/client/constants.js
var DERIVED = 1 << 1;
var EFFECT = 1 << 2;
var RENDER_EFFECT = 1 << 3;
var MANAGED_EFFECT = 1 << 24;
var BLOCK_EFFECT = 1 << 4;
var BRANCH_EFFECT = 1 << 5;
var ROOT_EFFECT = 1 << 6;
var BOUNDARY_EFFECT = 1 << 7;
var CONNECTED = 1 << 9;
var CLEAN = 1 << 10;
var DIRTY = 1 << 11;
var MAYBE_DIRTY = 1 << 12;
var INERT = 1 << 13;
var DESTROYED = 1 << 14;
var REACTION_RAN = 1 << 15;
var DESTROYING = 1 << 25;
var EFFECT_TRANSPARENT = 1 << 16;
var EAGER_EFFECT = 1 << 17;
var HEAD_EFFECT = 1 << 18;
var EFFECT_PRESERVED = 1 << 19;
var USER_EFFECT = 1 << 20;
var EFFECT_OFFSCREEN = 1 << 25;
var WAS_MARKED = 1 << 16;
var REACTION_IS_UPDATING = 1 << 21;
var ASYNC = 1 << 22;
var ERROR_VALUE = 1 << 23;
var STATE_SYMBOL = Symbol("$state");
var LEGACY_PROPS = Symbol("legacy props");
var LOADING_ATTR_SYMBOL = Symbol("");
var PROXY_PATH_SYMBOL = Symbol("proxy path");
var HMR_ANCHOR = Symbol("hmr anchor");
var STALE_REACTION = new class StaleReactionError extends Error {
  constructor() {
    super(...arguments);
    __publicField(this, "name", "StaleReactionError");
    __publicField(this, "message", "The reaction that called `getAbortSignal()` was re-run or destroyed");
  }
}();
var _a2;
var IS_XHTML = (
  // We gotta write it like this because after downleveling the pure comment may end up in the wrong location
  !!((_a2 = globalThis.document) == null ? void 0 : _a2.contentType) && /* @__PURE__ */ globalThis.document.contentType.includes("xml")
);
var TEXT_NODE = 3;
var COMMENT_NODE = 8;

// node_modules/svelte/src/internal/shared/errors.js
function invariant_violation(message) {
  if (dev_fallback_default) {
    const error = new Error(`invariant_violation
An invariant violation occurred, meaning Svelte's internal assumptions were flawed. This is a bug in Svelte, not your app \u2014 please open an issue at https://github.com/sveltejs/svelte, citing the following message: "${message}"
https://svelte.dev/e/invariant_violation`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/invariant_violation`);
  }
}

// node_modules/svelte/src/internal/client/errors.js
function async_derived_orphan() {
  if (dev_fallback_default) {
    const error = new Error(`async_derived_orphan
Cannot create a \`$derived(...)\` with an \`await\` expression outside of an effect tree
https://svelte.dev/e/async_derived_orphan`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/async_derived_orphan`);
  }
}
function derived_references_self() {
  if (dev_fallback_default) {
    const error = new Error(`derived_references_self
A derived value cannot reference itself recursively
https://svelte.dev/e/derived_references_self`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/derived_references_self`);
  }
}
function each_key_duplicate(a, b, value) {
  if (dev_fallback_default) {
    const error = new Error(`each_key_duplicate
${value ? `Keyed each block has duplicate key \`${value}\` at indexes ${a} and ${b}` : `Keyed each block has duplicate key at indexes ${a} and ${b}`}
https://svelte.dev/e/each_key_duplicate`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/each_key_duplicate`);
  }
}
function each_key_volatile(index2, a, b) {
  if (dev_fallback_default) {
    const error = new Error(`each_key_volatile
Keyed each block has key that is not idempotent \u2014 the key for item at index ${index2} was \`${a}\` but is now \`${b}\`. Keys must be the same each time for a given item
https://svelte.dev/e/each_key_volatile`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/each_key_volatile`);
  }
}
function effect_in_teardown(rune) {
  if (dev_fallback_default) {
    const error = new Error(`effect_in_teardown
\`${rune}\` cannot be used inside an effect cleanup function
https://svelte.dev/e/effect_in_teardown`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/effect_in_teardown`);
  }
}
function effect_in_unowned_derived() {
  if (dev_fallback_default) {
    const error = new Error(`effect_in_unowned_derived
Effect cannot be created inside a \`$derived\` value that was not itself created inside an effect
https://svelte.dev/e/effect_in_unowned_derived`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/effect_in_unowned_derived`);
  }
}
function effect_orphan(rune) {
  if (dev_fallback_default) {
    const error = new Error(`effect_orphan
\`${rune}\` can only be used inside an effect (e.g. during component initialisation)
https://svelte.dev/e/effect_orphan`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/effect_orphan`);
  }
}
function effect_update_depth_exceeded() {
  if (dev_fallback_default) {
    const error = new Error(`effect_update_depth_exceeded
Maximum update depth exceeded. This typically indicates that an effect reads and writes the same piece of state
https://svelte.dev/e/effect_update_depth_exceeded`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/effect_update_depth_exceeded`);
  }
}
function hydration_failed() {
  if (dev_fallback_default) {
    const error = new Error(`hydration_failed
Failed to hydrate the application
https://svelte.dev/e/hydration_failed`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/hydration_failed`);
  }
}
function props_invalid_value(key2) {
  if (dev_fallback_default) {
    const error = new Error(`props_invalid_value
Cannot do \`bind:${key2}={undefined}\` when \`${key2}\` has a fallback value
https://svelte.dev/e/props_invalid_value`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/props_invalid_value`);
  }
}
function rune_outside_svelte(rune) {
  if (dev_fallback_default) {
    const error = new Error(`rune_outside_svelte
The \`${rune}\` rune is only available inside \`.svelte\` and \`.svelte.js/ts\` files
https://svelte.dev/e/rune_outside_svelte`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/rune_outside_svelte`);
  }
}
function state_descriptors_fixed() {
  if (dev_fallback_default) {
    const error = new Error(`state_descriptors_fixed
Property descriptors defined on \`$state\` objects must contain \`value\` and always be \`enumerable\`, \`configurable\` and \`writable\`.
https://svelte.dev/e/state_descriptors_fixed`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/state_descriptors_fixed`);
  }
}
function state_prototype_fixed() {
  if (dev_fallback_default) {
    const error = new Error(`state_prototype_fixed
Cannot set prototype of \`$state\` object
https://svelte.dev/e/state_prototype_fixed`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/state_prototype_fixed`);
  }
}
function state_unsafe_mutation() {
  if (dev_fallback_default) {
    const error = new Error(`state_unsafe_mutation
Updating state inside \`$derived(...)\`, \`$inspect(...)\` or a template expression is forbidden. If the value should not be reactive, declare it without \`$state\`
https://svelte.dev/e/state_unsafe_mutation`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/state_unsafe_mutation`);
  }
}
function svelte_boundary_reset_onerror() {
  if (dev_fallback_default) {
    const error = new Error(`svelte_boundary_reset_onerror
A \`<svelte:boundary>\` \`reset\` function cannot be called while an error is still being handled
https://svelte.dev/e/svelte_boundary_reset_onerror`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/svelte_boundary_reset_onerror`);
  }
}

// node_modules/svelte/src/constants.js
var EACH_ITEM_REACTIVE = 1;
var EACH_INDEX_REACTIVE = 1 << 1;
var EACH_IS_CONTROLLED = 1 << 2;
var EACH_IS_ANIMATED = 1 << 3;
var EACH_ITEM_IMMUTABLE = 1 << 4;
var PROPS_IS_IMMUTABLE = 1;
var PROPS_IS_RUNES = 1 << 1;
var PROPS_IS_UPDATED = 1 << 2;
var PROPS_IS_BINDABLE = 1 << 3;
var PROPS_IS_LAZY_INITIAL = 1 << 4;
var TRANSITION_OUT = 1 << 1;
var TRANSITION_GLOBAL = 1 << 2;
var TEMPLATE_FRAGMENT = 1;
var TEMPLATE_USE_IMPORT_NODE = 1 << 1;
var TEMPLATE_USE_SVG = 1 << 2;
var TEMPLATE_USE_MATHML = 1 << 3;
var HYDRATION_START = "[";
var HYDRATION_START_ELSE = "[!";
var HYDRATION_START_FAILED = "[?";
var HYDRATION_END = "]";
var HYDRATION_ERROR = {};
var ELEMENT_PRESERVE_ATTRIBUTE_CASE = 1 << 1;
var ELEMENT_IS_INPUT = 1 << 2;
var UNINITIALIZED = Symbol();
var FILENAME = Symbol("filename");
var HMR = Symbol("hmr");
var NAMESPACE_HTML = "http://www.w3.org/1999/xhtml";

// node_modules/svelte/src/internal/client/warnings.js
var bold = "font-weight: bold";
var normal = "font-weight: normal";
function await_reactivity_loss(name) {
  if (dev_fallback_default) {
    console.warn(`%c[svelte] await_reactivity_loss
%cDetected reactivity loss when reading \`${name}\`. This happens when state is read in an async function after an earlier \`await\`
https://svelte.dev/e/await_reactivity_loss`, bold, normal);
  } else {
    console.warn(`https://svelte.dev/e/await_reactivity_loss`);
  }
}
function await_waterfall(name, location) {
  if (dev_fallback_default) {
    console.warn(`%c[svelte] await_waterfall
%cAn async derived, \`${name}\` (${location}) was not read immediately after it resolved. This often indicates an unnecessary waterfall, which can slow down your app
https://svelte.dev/e/await_waterfall`, bold, normal);
  } else {
    console.warn(`https://svelte.dev/e/await_waterfall`);
  }
}
function derived_inert() {
  if (dev_fallback_default) {
    console.warn(`%c[svelte] derived_inert
%cReading a derived belonging to a now-destroyed effect may result in stale values
https://svelte.dev/e/derived_inert`, bold, normal);
  } else {
    console.warn(`https://svelte.dev/e/derived_inert`);
  }
}
function hydration_attribute_changed(attribute, html2, value) {
  if (dev_fallback_default) {
    console.warn(`%c[svelte] hydration_attribute_changed
%cThe \`${attribute}\` attribute on \`${html2}\` changed its value between server and client renders. The client value, \`${value}\`, will be ignored in favour of the server value
https://svelte.dev/e/hydration_attribute_changed`, bold, normal);
  } else {
    console.warn(`https://svelte.dev/e/hydration_attribute_changed`);
  }
}
function hydration_mismatch(location) {
  if (dev_fallback_default) {
    console.warn(
      `%c[svelte] hydration_mismatch
%c${location ? `Hydration failed because the initial UI does not match what was rendered on the server. The error occurred near ${location}` : "Hydration failed because the initial UI does not match what was rendered on the server"}
https://svelte.dev/e/hydration_mismatch`,
      bold,
      normal
    );
  } else {
    console.warn(`https://svelte.dev/e/hydration_mismatch`);
  }
}
function lifecycle_double_unmount() {
  if (dev_fallback_default) {
    console.warn(`%c[svelte] lifecycle_double_unmount
%cTried to unmount a component that was not mounted
https://svelte.dev/e/lifecycle_double_unmount`, bold, normal);
  } else {
    console.warn(`https://svelte.dev/e/lifecycle_double_unmount`);
  }
}
function state_proxy_equality_mismatch(operator) {
  if (dev_fallback_default) {
    console.warn(`%c[svelte] state_proxy_equality_mismatch
%cReactive \`$state(...)\` proxies and the values they proxy have different identities. Because of this, comparisons with \`${operator}\` will produce unexpected results
https://svelte.dev/e/state_proxy_equality_mismatch`, bold, normal);
  } else {
    console.warn(`https://svelte.dev/e/state_proxy_equality_mismatch`);
  }
}
function state_proxy_unmount() {
  if (dev_fallback_default) {
    console.warn(`%c[svelte] state_proxy_unmount
%cTried to unmount a state proxy, rather than a component
https://svelte.dev/e/state_proxy_unmount`, bold, normal);
  } else {
    console.warn(`https://svelte.dev/e/state_proxy_unmount`);
  }
}
function svelte_boundary_reset_noop() {
  if (dev_fallback_default) {
    console.warn(`%c[svelte] svelte_boundary_reset_noop
%cA \`<svelte:boundary>\` \`reset\` function only resets the boundary the first time it is called
https://svelte.dev/e/svelte_boundary_reset_noop`, bold, normal);
  } else {
    console.warn(`https://svelte.dev/e/svelte_boundary_reset_noop`);
  }
}

// node_modules/svelte/src/internal/client/dom/hydration.js
var hydrating = false;
function set_hydrating(value) {
  hydrating = value;
}
var hydrate_node;
function set_hydrate_node(node) {
  if (node === null) {
    hydration_mismatch();
    throw HYDRATION_ERROR;
  }
  return hydrate_node = node;
}
function hydrate_next() {
  return set_hydrate_node(get_next_sibling(hydrate_node));
}
function reset(node) {
  if (!hydrating)
    return;
  if (get_next_sibling(hydrate_node) !== null) {
    hydration_mismatch();
    throw HYDRATION_ERROR;
  }
  hydrate_node = node;
}
function next(count = 1) {
  if (hydrating) {
    var i = count;
    var node = hydrate_node;
    while (i--) {
      node = /** @type {TemplateNode} */
      get_next_sibling(node);
    }
    hydrate_node = node;
  }
}
function skip_nodes(remove = true) {
  var depth = 0;
  var node = hydrate_node;
  while (true) {
    if (node.nodeType === COMMENT_NODE) {
      var data = (
        /** @type {Comment} */
        node.data
      );
      if (data === HYDRATION_END) {
        if (depth === 0)
          return node;
        depth -= 1;
      } else if (data === HYDRATION_START || data === HYDRATION_START_ELSE || // "[1", "[2", etc. for if blocks
      data[0] === "[" && !isNaN(Number(data.slice(1)))) {
        depth += 1;
      }
    }
    var next2 = (
      /** @type {TemplateNode} */
      get_next_sibling(node)
    );
    if (remove)
      node.remove();
    node = next2;
  }
}
function read_hydration_instruction(node) {
  if (!node || node.nodeType !== COMMENT_NODE) {
    hydration_mismatch();
    throw HYDRATION_ERROR;
  }
  return (
    /** @type {Comment} */
    node.data
  );
}

// node_modules/svelte/src/internal/client/reactivity/equality.js
function equals(value) {
  return value === this.v;
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || a !== null && typeof a === "object" || typeof a === "function";
}
function safe_equals(value) {
  return !safe_not_equal(value, this.v);
}

// node_modules/svelte/src/internal/flags/index.js
var async_mode_flag = false;
var legacy_mode_flag = false;
var tracing_mode_flag = false;

// node_modules/svelte/src/internal/client/dev/tracing.js
var tracing_expressions = null;
function tag(source2, label) {
  source2.label = label;
  tag_proxy(source2.v, label);
  return source2;
}
function tag_proxy(value, label) {
  var _a5;
  (_a5 = value == null ? void 0 : value[PROXY_PATH_SYMBOL]) == null ? void 0 : _a5.call(value, label);
  return value;
}

// node_modules/svelte/src/internal/shared/dev.js
function get_error(label) {
  const error = new Error();
  const stack2 = get_stack();
  if (stack2.length === 0) {
    return null;
  }
  stack2.unshift("\n");
  define_property(error, "stack", {
    value: stack2.join("\n")
  });
  define_property(error, "name", {
    value: label
  });
  return (
    /** @type {Error & { stack: string }} */
    error
  );
}
function get_stack() {
  const limit = Error.stackTraceLimit;
  Error.stackTraceLimit = Infinity;
  const stack2 = new Error().stack;
  Error.stackTraceLimit = limit;
  if (!stack2)
    return [];
  const lines = stack2.split("\n");
  const new_lines = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const posixified = line.replaceAll("\\", "/");
    if (line.trim() === "Error") {
      continue;
    }
    if (line.includes("validate_each_keys")) {
      return [];
    }
    if (posixified.includes("svelte/src/internal") || posixified.includes("node_modules/.vite")) {
      continue;
    }
    new_lines.push(line);
  }
  return new_lines;
}
function invariant(condition, message) {
  if (!dev_fallback_default) {
    throw new Error("invariant(...) was not guarded by if (DEV)");
  }
  if (!condition)
    invariant_violation(message);
}

// node_modules/svelte/src/internal/client/context.js
var component_context = null;
function set_component_context(context) {
  component_context = context;
}
var dev_stack = null;
function set_dev_stack(stack2) {
  dev_stack = stack2;
}
var dev_current_component_function = null;
function set_dev_current_component_function(fn) {
  dev_current_component_function = fn;
}
function push(props, runes = false, fn) {
  component_context = {
    p: component_context,
    i: false,
    c: null,
    e: null,
    s: props,
    x: null,
    r: (
      /** @type {Effect} */
      active_effect
    ),
    l: legacy_mode_flag && !runes ? { s: null, u: null, $: [] } : null
  };
  if (dev_fallback_default) {
    component_context.function = fn;
    dev_current_component_function = fn;
  }
}
function pop(component2) {
  var _a5;
  var context = (
    /** @type {ComponentContext} */
    component_context
  );
  var effects = context.e;
  if (effects !== null) {
    context.e = null;
    for (var fn of effects) {
      create_user_effect(fn);
    }
  }
  if (component2 !== void 0) {
    context.x = component2;
  }
  context.i = true;
  component_context = context.p;
  if (dev_fallback_default) {
    dev_current_component_function = (_a5 = component_context == null ? void 0 : component_context.function) != null ? _a5 : null;
  }
  return component2 != null ? component2 : (
    /** @type {T} */
    {}
  );
}
function is_runes() {
  return !legacy_mode_flag || component_context !== null && component_context.l === null;
}

// node_modules/svelte/src/internal/client/dom/task.js
var micro_tasks = [];
function run_micro_tasks() {
  var tasks = micro_tasks;
  micro_tasks = [];
  run_all(tasks);
}
function queue_micro_task(fn) {
  if (micro_tasks.length === 0 && !is_flushing_sync) {
    var tasks = micro_tasks;
    queueMicrotask(() => {
      if (tasks === micro_tasks)
        run_micro_tasks();
    });
  }
  micro_tasks.push(fn);
}
function flush_tasks() {
  while (micro_tasks.length > 0) {
    run_micro_tasks();
  }
}

// node_modules/svelte/src/internal/client/error-handling.js
var adjustments = /* @__PURE__ */ new WeakMap();
function handle_error(error) {
  var effect2 = active_effect;
  if (effect2 === null) {
    active_reaction.f |= ERROR_VALUE;
    return error;
  }
  if (dev_fallback_default && error instanceof Error && !adjustments.has(error)) {
    adjustments.set(error, get_adjustments(error, effect2));
  }
  if ((effect2.f & REACTION_RAN) === 0 && (effect2.f & EFFECT) === 0) {
    if (dev_fallback_default && !effect2.parent && error instanceof Error) {
      apply_adjustments(error);
    }
    throw error;
  }
  invoke_error_boundary(error, effect2);
}
function invoke_error_boundary(error, effect2) {
  while (effect2 !== null) {
    if ((effect2.f & BOUNDARY_EFFECT) !== 0) {
      if ((effect2.f & REACTION_RAN) === 0) {
        throw error;
      }
      try {
        effect2.b.error(error);
        return;
      } catch (e) {
        error = e;
      }
    }
    effect2 = effect2.parent;
  }
  if (dev_fallback_default && error instanceof Error) {
    apply_adjustments(error);
  }
  throw error;
}
function get_adjustments(error, effect2) {
  var _a5, _b3, _c2;
  const message_descriptor = get_descriptor(error, "message");
  if (message_descriptor && !message_descriptor.configurable)
    return;
  var indent = is_firefox ? "  " : "	";
  var component_stack = `
${indent}in ${((_a5 = effect2.fn) == null ? void 0 : _a5.name) || "<unknown>"}`;
  var context = effect2.ctx;
  while (context !== null) {
    component_stack += `
${indent}in ${(_b3 = context.function) == null ? void 0 : _b3[FILENAME].split("/").pop()}`;
    context = context.p;
  }
  return {
    message: error.message + `
${component_stack}
`,
    stack: (_c2 = error.stack) == null ? void 0 : _c2.split("\n").filter((line) => !line.includes("svelte/src/internal")).join("\n")
  };
}
function apply_adjustments(error) {
  const adjusted = adjustments.get(error);
  if (adjusted) {
    define_property(error, "message", {
      value: adjusted.message
    });
    define_property(error, "stack", {
      value: adjusted.stack
    });
  }
}

// node_modules/svelte/src/internal/client/reactivity/status.js
var STATUS_MASK = ~(DIRTY | MAYBE_DIRTY | CLEAN);
function set_signal_status(signal, status) {
  signal.f = signal.f & STATUS_MASK | status;
}
function update_derived_status(derived2) {
  if ((derived2.f & CONNECTED) !== 0 || derived2.deps === null) {
    set_signal_status(derived2, CLEAN);
  } else {
    set_signal_status(derived2, MAYBE_DIRTY);
  }
}

// node_modules/svelte/src/internal/client/reactivity/utils.js
function clear_marked(deps) {
  if (deps === null)
    return;
  for (const dep of deps) {
    if ((dep.f & DERIVED) === 0 || (dep.f & WAS_MARKED) === 0) {
      continue;
    }
    dep.f ^= WAS_MARKED;
    clear_marked(
      /** @type {Derived} */
      dep.deps
    );
  }
}
function defer_effect(effect2, dirty_effects, maybe_dirty_effects) {
  if ((effect2.f & DIRTY) !== 0) {
    dirty_effects.add(effect2);
  } else if ((effect2.f & MAYBE_DIRTY) !== 0) {
    maybe_dirty_effects.add(effect2);
  }
  clear_marked(effect2.deps);
  set_signal_status(effect2, CLEAN);
}

// node_modules/svelte/src/internal/client/reactivity/store.js
var legacy_is_updating_store = false;
var is_store_binding = false;
var IS_UNMOUNTED = Symbol();
function capture_store_binding(fn) {
  var previous_is_store_binding = is_store_binding;
  try {
    is_store_binding = false;
    return [fn(), is_store_binding];
  } finally {
    is_store_binding = previous_is_store_binding;
  }
}

// node_modules/svelte/src/internal/client/reactivity/batch.js
var batches = /* @__PURE__ */ new Set();
var current_batch = null;
var previous_batch = null;
var batch_values = null;
var last_scheduled_effect = null;
var is_flushing_sync = false;
var is_processing = false;
var collected_effects = null;
var legacy_updates = null;
var flush_count = 0;
var source_stacks = dev_fallback_default ? /* @__PURE__ */ new Set() : null;
var uid = 1;
var _commit_callbacks, _discard_callbacks, _fork_commit_callbacks, _pending, _blocking_pending, _deferred, _roots, _new_effects, _dirty_effects, _maybe_dirty_effects, _skipped_branches, _unskipped_branches, _decrement_queued, _blockers, _is_deferred, is_deferred_fn, _is_blocked, is_blocked_fn, _process, process_fn, _traverse, traverse_fn, _defer_effects, defer_effects_fn, _commit, commit_fn;
var _Batch = class {
  constructor() {
    __privateAdd(this, _is_deferred);
    __privateAdd(this, _is_blocked);
    __privateAdd(this, _process);
    /**
     * Traverse the effect tree, executing effects or stashing
     * them for later execution as appropriate
     * @param {Effect} root
     * @param {Effect[]} effects
     * @param {Effect[]} render_effects
     */
    __privateAdd(this, _traverse);
    /**
     * @param {Effect[]} effects
     */
    __privateAdd(this, _defer_effects);
    __privateAdd(this, _commit);
    __publicField(this, "id", uid++);
    /**
     * The current values of any signals that are updated in this batch.
     * Tuple format: [value, is_derived] (note: is_derived is false for deriveds, too, if they were overridden via assignment)
     * They keys of this map are identical to `this.#previous`
     * @type {Map<Value, [any, boolean]>}
     */
    __publicField(this, "current", /* @__PURE__ */ new Map());
    /**
     * The values of any signals (sources and deriveds) that are updated in this batch _before_ those updates took place.
     * They keys of this map are identical to `this.#current`
     * @type {Map<Value, any>}
     */
    __publicField(this, "previous", /* @__PURE__ */ new Map());
    /**
     * When the batch is committed (and the DOM is updated), we need to remove old branches
     * and append new ones by calling the functions added inside (if/each/key/etc) blocks
     * @type {Set<(batch: Batch) => void>}
     */
    __privateAdd(this, _commit_callbacks, /* @__PURE__ */ new Set());
    /**
     * If a fork is discarded, we need to destroy any effects that are no longer needed
     * @type {Set<(batch: Batch) => void>}
     */
    __privateAdd(this, _discard_callbacks, /* @__PURE__ */ new Set());
    /**
     * Callbacks that should run only when a fork is committed.
     * @type {Set<(batch: Batch) => void>}
     */
    __privateAdd(this, _fork_commit_callbacks, /* @__PURE__ */ new Set());
    /**
     * Async effects that are currently in flight
     * @type {Map<Effect, number>}
     */
    __privateAdd(this, _pending, /* @__PURE__ */ new Map());
    /**
     * Async effects that are currently in flight, _not_ inside a pending boundary
     * @type {Map<Effect, number>}
     */
    __privateAdd(this, _blocking_pending, /* @__PURE__ */ new Map());
    /**
     * A deferred that resolves when the batch is committed, used with `settled()`
     * TODO replace with Promise.withResolvers once supported widely enough
     * @type {{ promise: Promise<void>, resolve: (value?: any) => void, reject: (reason: unknown) => void } | null}
     */
    __privateAdd(this, _deferred, null);
    /**
     * The root effects that need to be flushed
     * @type {Effect[]}
     */
    __privateAdd(this, _roots, []);
    /**
     * Effects created while this batch was active.
     * @type {Effect[]}
     */
    __privateAdd(this, _new_effects, []);
    /**
     * Deferred effects (which run after async work has completed) that are DIRTY
     * @type {Set<Effect>}
     */
    __privateAdd(this, _dirty_effects, /* @__PURE__ */ new Set());
    /**
     * Deferred effects that are MAYBE_DIRTY
     * @type {Set<Effect>}
     */
    __privateAdd(this, _maybe_dirty_effects, /* @__PURE__ */ new Set());
    /**
     * A map of branches that still exist, but will be destroyed when this batch
     * is committed — we skip over these during `process`.
     * The value contains child effects that were dirty/maybe_dirty before being reset,
     * so they can be rescheduled if the branch survives.
     * @type {Map<Effect, { d: Effect[], m: Effect[] }>}
     */
    __privateAdd(this, _skipped_branches, /* @__PURE__ */ new Map());
    /**
     * Inverse of #skipped_branches which we need to tell prior batches to unskip them when committing
     * @type {Set<Effect>}
     */
    __privateAdd(this, _unskipped_branches, /* @__PURE__ */ new Set());
    __publicField(this, "is_fork", false);
    __privateAdd(this, _decrement_queued, false);
    /** @type {Set<Batch>} */
    __privateAdd(this, _blockers, /* @__PURE__ */ new Set());
  }
  /**
   * Add an effect to the #skipped_branches map and reset its children
   * @param {Effect} effect
   */
  skip_effect(effect2) {
    if (!__privateGet(this, _skipped_branches).has(effect2)) {
      __privateGet(this, _skipped_branches).set(effect2, { d: [], m: [] });
    }
    __privateGet(this, _unskipped_branches).delete(effect2);
  }
  /**
   * Remove an effect from the #skipped_branches map and reschedule
   * any tracked dirty/maybe_dirty child effects
   * @param {Effect} effect
   * @param {(e: Effect) => void} callback
   */
  unskip_effect(effect2, callback = (e) => this.schedule(e)) {
    var tracked = __privateGet(this, _skipped_branches).get(effect2);
    if (tracked) {
      __privateGet(this, _skipped_branches).delete(effect2);
      for (var e of tracked.d) {
        set_signal_status(e, DIRTY);
        callback(e);
      }
      for (e of tracked.m) {
        set_signal_status(e, MAYBE_DIRTY);
        callback(e);
      }
    }
    __privateGet(this, _unskipped_branches).add(effect2);
  }
  /**
   * Associate a change to a given source with the current
   * batch, noting its previous and current values
   * @param {Value} source
   * @param {any} value
   * @param {boolean} [is_derived]
   */
  capture(source2, value, is_derived = false) {
    if (source2.v !== UNINITIALIZED && !this.previous.has(source2)) {
      this.previous.set(source2, source2.v);
    }
    if ((source2.f & ERROR_VALUE) === 0) {
      this.current.set(source2, [value, is_derived]);
      batch_values == null ? void 0 : batch_values.set(source2, value);
    }
    if (!this.is_fork) {
      source2.v = value;
    }
  }
  activate() {
    current_batch = this;
  }
  deactivate() {
    current_batch = null;
    batch_values = null;
  }
  flush() {
    var source_stacks2 = dev_fallback_default ? /* @__PURE__ */ new Set() : null;
    try {
      is_processing = true;
      current_batch = this;
      __privateMethod(this, _process, process_fn).call(this);
    } finally {
      flush_count = 0;
      last_scheduled_effect = null;
      collected_effects = null;
      legacy_updates = null;
      is_processing = false;
      current_batch = null;
      batch_values = null;
      old_values.clear();
      if (dev_fallback_default) {
        for (
          const source2 of
          /** @type {Set<Source>} */
          source_stacks2
        ) {
          source2.updated = null;
        }
      }
    }
  }
  discard() {
    for (const fn of __privateGet(this, _discard_callbacks))
      fn(this);
    __privateGet(this, _discard_callbacks).clear();
    __privateGet(this, _fork_commit_callbacks).clear();
    batches.delete(this);
  }
  /**
   * @param {Effect} effect
   */
  register_created_effect(effect2) {
    __privateGet(this, _new_effects).push(effect2);
  }
  /**
   * @param {boolean} blocking
   * @param {Effect} effect
   */
  increment(blocking, effect2) {
    var _a5, _b3;
    let pending_count = (_a5 = __privateGet(this, _pending).get(effect2)) != null ? _a5 : 0;
    __privateGet(this, _pending).set(effect2, pending_count + 1);
    if (blocking) {
      let blocking_pending_count = (_b3 = __privateGet(this, _blocking_pending).get(effect2)) != null ? _b3 : 0;
      __privateGet(this, _blocking_pending).set(effect2, blocking_pending_count + 1);
    }
  }
  /**
   * @param {boolean} blocking
   * @param {Effect} effect
   * @param {boolean} skip - whether to skip updates (because this is triggered by a stale reaction)
   */
  decrement(blocking, effect2, skip) {
    var _a5, _b3;
    let pending_count = (_a5 = __privateGet(this, _pending).get(effect2)) != null ? _a5 : 0;
    if (pending_count === 1) {
      __privateGet(this, _pending).delete(effect2);
    } else {
      __privateGet(this, _pending).set(effect2, pending_count - 1);
    }
    if (blocking) {
      let blocking_pending_count = (_b3 = __privateGet(this, _blocking_pending).get(effect2)) != null ? _b3 : 0;
      if (blocking_pending_count === 1) {
        __privateGet(this, _blocking_pending).delete(effect2);
      } else {
        __privateGet(this, _blocking_pending).set(effect2, blocking_pending_count - 1);
      }
    }
    if (__privateGet(this, _decrement_queued) || skip)
      return;
    __privateSet(this, _decrement_queued, true);
    queue_micro_task(() => {
      __privateSet(this, _decrement_queued, false);
      this.flush();
    });
  }
  /**
   * @param {Set<Effect>} dirty_effects
   * @param {Set<Effect>} maybe_dirty_effects
   */
  transfer_effects(dirty_effects, maybe_dirty_effects) {
    for (const e of dirty_effects) {
      __privateGet(this, _dirty_effects).add(e);
    }
    for (const e of maybe_dirty_effects) {
      __privateGet(this, _maybe_dirty_effects).add(e);
    }
    dirty_effects.clear();
    maybe_dirty_effects.clear();
  }
  /** @param {(batch: Batch) => void} fn */
  oncommit(fn) {
    __privateGet(this, _commit_callbacks).add(fn);
  }
  /** @param {(batch: Batch) => void} fn */
  ondiscard(fn) {
    __privateGet(this, _discard_callbacks).add(fn);
  }
  /** @param {(batch: Batch) => void} fn */
  on_fork_commit(fn) {
    __privateGet(this, _fork_commit_callbacks).add(fn);
  }
  run_fork_commit_callbacks() {
    for (const fn of __privateGet(this, _fork_commit_callbacks))
      fn(this);
    __privateGet(this, _fork_commit_callbacks).clear();
  }
  settled() {
    var _a5;
    return ((_a5 = __privateGet(this, _deferred)) != null ? _a5 : __privateSet(this, _deferred, deferred())).promise;
  }
  static ensure() {
    if (current_batch === null) {
      const batch = current_batch = new _Batch();
      if (!is_processing) {
        batches.add(current_batch);
        if (!is_flushing_sync) {
          queue_micro_task(() => {
            if (current_batch !== batch) {
              return;
            }
            batch.flush();
          });
        }
      }
    }
    return current_batch;
  }
  apply() {
    if (!async_mode_flag || !this.is_fork && batches.size === 1) {
      batch_values = null;
      return;
    }
    batch_values = /* @__PURE__ */ new Map();
    for (const [source2, [value]] of this.current) {
      batch_values.set(source2, value);
    }
    for (const batch of batches) {
      if (batch === this || batch.is_fork)
        continue;
      var intersects = false;
      var differs = false;
      if (batch.id < this.id) {
        for (const [source2, [, is_derived]] of batch.current) {
          if (is_derived)
            continue;
          intersects || (intersects = this.current.has(source2));
          differs || (differs = !this.current.has(source2));
        }
      }
      if (intersects && differs) {
        __privateGet(this, _blockers).add(batch);
      } else {
        for (const [source2, previous] of batch.previous) {
          if (!batch_values.has(source2)) {
            batch_values.set(source2, previous);
          }
        }
      }
    }
  }
  /**
   *
   * @param {Effect} effect
   */
  schedule(effect2) {
    var _a5;
    last_scheduled_effect = effect2;
    if (((_a5 = effect2.b) == null ? void 0 : _a5.is_pending) && (effect2.f & (EFFECT | RENDER_EFFECT | MANAGED_EFFECT)) !== 0 && (effect2.f & REACTION_RAN) === 0) {
      effect2.b.defer_effect(effect2);
      return;
    }
    var e = effect2;
    while (e.parent !== null) {
      e = e.parent;
      var flags2 = e.f;
      if (collected_effects !== null && e === active_effect) {
        if (async_mode_flag)
          return;
        if ((active_reaction === null || (active_reaction.f & DERIVED) === 0) && !legacy_is_updating_store) {
          return;
        }
      }
      if ((flags2 & (ROOT_EFFECT | BRANCH_EFFECT)) !== 0) {
        if ((flags2 & CLEAN) === 0) {
          return;
        }
        e.f ^= CLEAN;
      }
    }
    __privateGet(this, _roots).push(e);
  }
};
var Batch = _Batch;
_commit_callbacks = new WeakMap();
_discard_callbacks = new WeakMap();
_fork_commit_callbacks = new WeakMap();
_pending = new WeakMap();
_blocking_pending = new WeakMap();
_deferred = new WeakMap();
_roots = new WeakMap();
_new_effects = new WeakMap();
_dirty_effects = new WeakMap();
_maybe_dirty_effects = new WeakMap();
_skipped_branches = new WeakMap();
_unskipped_branches = new WeakMap();
_decrement_queued = new WeakMap();
_blockers = new WeakMap();
_is_deferred = new WeakSet();
is_deferred_fn = function() {
  return this.is_fork || __privateGet(this, _blocking_pending).size > 0;
};
_is_blocked = new WeakSet();
is_blocked_fn = function() {
  for (const batch of __privateGet(this, _blockers)) {
    for (const effect2 of __privateGet(batch, _blocking_pending).keys()) {
      var skipped = false;
      var e = effect2;
      while (e.parent !== null) {
        if (__privateGet(this, _skipped_branches).has(e)) {
          skipped = true;
          break;
        }
        e = e.parent;
      }
      if (!skipped) {
        return true;
      }
    }
  }
  return false;
};
_process = new WeakSet();
process_fn = function() {
  var _a5, _b3;
  if (flush_count++ > 1e3) {
    batches.delete(this);
    infinite_loop_guard();
  }
  if (!__privateMethod(this, _is_deferred, is_deferred_fn).call(this)) {
    for (const e of __privateGet(this, _dirty_effects)) {
      __privateGet(this, _maybe_dirty_effects).delete(e);
      set_signal_status(e, DIRTY);
      this.schedule(e);
    }
    for (const e of __privateGet(this, _maybe_dirty_effects)) {
      set_signal_status(e, MAYBE_DIRTY);
      this.schedule(e);
    }
  }
  const roots = __privateGet(this, _roots);
  __privateSet(this, _roots, []);
  this.apply();
  var effects = collected_effects = [];
  var render_effects = [];
  var updates = legacy_updates = [];
  for (const root7 of roots) {
    try {
      __privateMethod(this, _traverse, traverse_fn).call(this, root7, effects, render_effects);
    } catch (e) {
      reset_all(root7);
      throw e;
    }
  }
  current_batch = null;
  if (updates.length > 0) {
    var batch = _Batch.ensure();
    for (const e of updates) {
      batch.schedule(e);
    }
  }
  collected_effects = null;
  legacy_updates = null;
  if (__privateMethod(this, _is_deferred, is_deferred_fn).call(this) || __privateMethod(this, _is_blocked, is_blocked_fn).call(this)) {
    __privateMethod(this, _defer_effects, defer_effects_fn).call(this, render_effects);
    __privateMethod(this, _defer_effects, defer_effects_fn).call(this, effects);
    for (const [e, t] of __privateGet(this, _skipped_branches)) {
      reset_branch(e, t);
    }
  } else {
    if (__privateGet(this, _pending).size === 0) {
      batches.delete(this);
    }
    __privateGet(this, _dirty_effects).clear();
    __privateGet(this, _maybe_dirty_effects).clear();
    for (const fn of __privateGet(this, _commit_callbacks))
      fn(this);
    __privateGet(this, _commit_callbacks).clear();
    previous_batch = this;
    flush_queued_effects(render_effects);
    flush_queued_effects(effects);
    previous_batch = null;
    (_a5 = __privateGet(this, _deferred)) == null ? void 0 : _a5.resolve();
  }
  var next_batch = (
    /** @type {Batch | null} */
    /** @type {unknown} */
    current_batch
  );
  if (__privateGet(this, _roots).length > 0) {
    const batch2 = next_batch != null ? next_batch : next_batch = this;
    __privateGet(batch2, _roots).push(...__privateGet(this, _roots).filter((r) => !__privateGet(batch2, _roots).includes(r)));
  }
  if (next_batch !== null) {
    batches.add(next_batch);
    if (dev_fallback_default) {
      for (const source2 of this.current.keys()) {
        source_stacks.add(source2);
      }
    }
    __privateMethod(_b3 = next_batch, _process, process_fn).call(_b3);
  }
  if (async_mode_flag && !batches.has(this)) {
    __privateMethod(this, _commit, commit_fn).call(this);
  }
};
_traverse = new WeakSet();
traverse_fn = function(root7, effects, render_effects) {
  root7.f ^= CLEAN;
  var effect2 = root7.first;
  while (effect2 !== null) {
    var flags2 = effect2.f;
    var is_branch = (flags2 & (BRANCH_EFFECT | ROOT_EFFECT)) !== 0;
    var is_skippable_branch = is_branch && (flags2 & CLEAN) !== 0;
    var skip = is_skippable_branch || (flags2 & INERT) !== 0 || __privateGet(this, _skipped_branches).has(effect2);
    if (!skip && effect2.fn !== null) {
      if (is_branch) {
        effect2.f ^= CLEAN;
      } else if ((flags2 & EFFECT) !== 0) {
        effects.push(effect2);
      } else if (async_mode_flag && (flags2 & (RENDER_EFFECT | MANAGED_EFFECT)) !== 0) {
        render_effects.push(effect2);
      } else if (is_dirty(effect2)) {
        if ((flags2 & BLOCK_EFFECT) !== 0)
          __privateGet(this, _maybe_dirty_effects).add(effect2);
        update_effect(effect2);
      }
      var child2 = effect2.first;
      if (child2 !== null) {
        effect2 = child2;
        continue;
      }
    }
    while (effect2 !== null) {
      var next2 = effect2.next;
      if (next2 !== null) {
        effect2 = next2;
        break;
      }
      effect2 = effect2.parent;
    }
  }
};
_defer_effects = new WeakSet();
defer_effects_fn = function(effects) {
  for (var i = 0; i < effects.length; i += 1) {
    defer_effect(effects[i], __privateGet(this, _dirty_effects), __privateGet(this, _maybe_dirty_effects));
  }
};
_commit = new WeakSet();
commit_fn = function() {
  var _a5, _b3, _c2;
  for (const batch of batches) {
    var is_earlier = batch.id < this.id;
    var sources = [];
    for (const [source3, [value, is_derived]] of this.current) {
      if (batch.current.has(source3)) {
        var batch_value = (
          /** @type {[any, boolean]} */
          batch.current.get(source3)[0]
        );
        if (is_earlier && value !== batch_value) {
          batch.current.set(source3, [value, is_derived]);
        } else {
          continue;
        }
      }
      sources.push(source3);
    }
    var others = [...batch.current.keys()].filter((s) => !this.current.has(s));
    if (others.length === 0) {
      if (is_earlier) {
        batch.discard();
      }
    } else if (sources.length > 0) {
      if (dev_fallback_default) {
        invariant(__privateGet(batch, _roots).length === 0, "Batch has scheduled roots");
      }
      if (is_earlier) {
        for (const unskipped of __privateGet(this, _unskipped_branches)) {
          batch.unskip_effect(unskipped, (e) => {
            var _a6;
            if ((e.f & (BLOCK_EFFECT | ASYNC)) !== 0) {
              batch.schedule(e);
            } else {
              __privateMethod(_a6 = batch, _defer_effects, defer_effects_fn).call(_a6, [e]);
            }
          });
        }
      }
      batch.activate();
      var marked = /* @__PURE__ */ new Set();
      var checked = /* @__PURE__ */ new Map();
      for (var source2 of sources) {
        mark_effects(source2, others, marked, checked);
      }
      checked = /* @__PURE__ */ new Map();
      var current_unequal = [...batch.current.keys()].filter(
        (c) => this.current.has(c) ? (
          /** @type {[any, boolean]} */
          this.current.get(c)[0] !== c
        ) : true
      );
      for (const effect2 of __privateGet(this, _new_effects)) {
        if ((effect2.f & (DESTROYED | INERT | EAGER_EFFECT)) === 0 && depends_on(effect2, current_unequal, checked)) {
          if ((effect2.f & (ASYNC | BLOCK_EFFECT)) !== 0) {
            set_signal_status(effect2, DIRTY);
            batch.schedule(effect2);
          } else {
            __privateGet(batch, _dirty_effects).add(effect2);
          }
        }
      }
      if (__privateGet(batch, _roots).length > 0) {
        batch.apply();
        for (var root7 of __privateGet(batch, _roots)) {
          __privateMethod(_a5 = batch, _traverse, traverse_fn).call(_a5, root7, [], []);
        }
        __privateSet(batch, _roots, []);
      }
      batch.deactivate();
    }
  }
  for (const batch of batches) {
    if (__privateGet(batch, _blockers).has(this)) {
      __privateGet(batch, _blockers).delete(this);
      if (__privateGet(batch, _blockers).size === 0 && !__privateMethod(_b3 = batch, _is_deferred, is_deferred_fn).call(_b3)) {
        batch.activate();
        __privateMethod(_c2 = batch, _process, process_fn).call(_c2);
      }
    }
  }
};
function flushSync(fn) {
  var was_flushing_sync = is_flushing_sync;
  is_flushing_sync = true;
  try {
    var result;
    if (fn) {
      if (current_batch !== null && !current_batch.is_fork) {
        current_batch.flush();
      }
      result = fn();
    }
    while (true) {
      flush_tasks();
      if (current_batch === null) {
        return (
          /** @type {T} */
          result
        );
      }
      current_batch.flush();
    }
  } finally {
    is_flushing_sync = was_flushing_sync;
  }
}
function infinite_loop_guard() {
  var _a5;
  if (dev_fallback_default) {
    var updates = /* @__PURE__ */ new Map();
    for (
      const source2 of
      /** @type {Batch} */
      current_batch.current.keys()
    ) {
      for (const [stack2, update2] of (_a5 = source2.updated) != null ? _a5 : []) {
        var entry = updates.get(stack2);
        if (!entry) {
          entry = { error: update2.error, count: 0 };
          updates.set(stack2, entry);
        }
        entry.count += update2.count;
      }
    }
    for (const update2 of updates.values()) {
      if (update2.error) {
        console.error(update2.error);
      }
    }
  }
  try {
    effect_update_depth_exceeded();
  } catch (error) {
    if (dev_fallback_default) {
      define_property(error, "stack", { value: "" });
    }
    invoke_error_boundary(error, last_scheduled_effect);
  }
}
var eager_block_effects = null;
function flush_queued_effects(effects) {
  var length = effects.length;
  if (length === 0)
    return;
  var i = 0;
  while (i < length) {
    var effect2 = effects[i++];
    if ((effect2.f & (DESTROYED | INERT)) === 0 && is_dirty(effect2)) {
      eager_block_effects = /* @__PURE__ */ new Set();
      update_effect(effect2);
      if (effect2.deps === null && effect2.first === null && effect2.nodes === null && effect2.teardown === null && effect2.ac === null) {
        unlink_effect(effect2);
      }
      if ((eager_block_effects == null ? void 0 : eager_block_effects.size) > 0) {
        old_values.clear();
        for (const e of eager_block_effects) {
          if ((e.f & (DESTROYED | INERT)) !== 0)
            continue;
          const ordered_effects = [e];
          let ancestor = e.parent;
          while (ancestor !== null) {
            if (eager_block_effects.has(ancestor)) {
              eager_block_effects.delete(ancestor);
              ordered_effects.push(ancestor);
            }
            ancestor = ancestor.parent;
          }
          for (let j = ordered_effects.length - 1; j >= 0; j--) {
            const e2 = ordered_effects[j];
            if ((e2.f & (DESTROYED | INERT)) !== 0)
              continue;
            update_effect(e2);
          }
        }
        eager_block_effects.clear();
      }
    }
  }
  eager_block_effects = null;
}
function mark_effects(value, sources, marked, checked) {
  if (marked.has(value))
    return;
  marked.add(value);
  if (value.reactions !== null) {
    for (const reaction of value.reactions) {
      const flags2 = reaction.f;
      if ((flags2 & DERIVED) !== 0) {
        mark_effects(
          /** @type {Derived} */
          reaction,
          sources,
          marked,
          checked
        );
      } else if ((flags2 & (ASYNC | BLOCK_EFFECT)) !== 0 && (flags2 & DIRTY) === 0 && depends_on(reaction, sources, checked)) {
        set_signal_status(reaction, DIRTY);
        schedule_effect(
          /** @type {Effect} */
          reaction
        );
      }
    }
  }
}
function depends_on(reaction, sources, checked) {
  const depends = checked.get(reaction);
  if (depends !== void 0)
    return depends;
  if (reaction.deps !== null) {
    for (const dep of reaction.deps) {
      if (includes.call(sources, dep)) {
        return true;
      }
      if ((dep.f & DERIVED) !== 0 && depends_on(
        /** @type {Derived} */
        dep,
        sources,
        checked
      )) {
        checked.set(
          /** @type {Derived} */
          dep,
          true
        );
        return true;
      }
    }
  }
  checked.set(reaction, false);
  return false;
}
function schedule_effect(effect2) {
  current_batch.schedule(effect2);
}
function reset_branch(effect2, tracked) {
  if ((effect2.f & BRANCH_EFFECT) !== 0 && (effect2.f & CLEAN) !== 0) {
    return;
  }
  if ((effect2.f & DIRTY) !== 0) {
    tracked.d.push(effect2);
  } else if ((effect2.f & MAYBE_DIRTY) !== 0) {
    tracked.m.push(effect2);
  }
  set_signal_status(effect2, CLEAN);
  var e = effect2.first;
  while (e !== null) {
    reset_branch(e, tracked);
    e = e.next;
  }
}
function reset_all(effect2) {
  set_signal_status(effect2, CLEAN);
  var e = effect2.first;
  while (e !== null) {
    reset_all(e);
    e = e.next;
  }
}

// node_modules/svelte/src/reactivity/create-subscriber.js
function createSubscriber(start) {
  let subscribers = 0;
  let version = source(0);
  let stop;
  if (dev_fallback_default) {
    tag(version, "createSubscriber version");
  }
  return () => {
    if (effect_tracking()) {
      get2(version);
      render_effect(() => {
        if (subscribers === 0) {
          stop = untrack(() => start(() => increment(version)));
        }
        subscribers += 1;
        return () => {
          queue_micro_task(() => {
            subscribers -= 1;
            if (subscribers === 0) {
              stop == null ? void 0 : stop();
              stop = void 0;
              increment(version);
            }
          });
        };
      });
    }
  };
}

// node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var flags = EFFECT_TRANSPARENT | EFFECT_PRESERVED;
function boundary(node, props, children, transform_error) {
  new Boundary(node, props, children, transform_error);
}
var _anchor, _hydrate_open, _props, _children, _effect, _main_effect, _pending_effect, _failed_effect, _offscreen_fragment, _local_pending_count, _pending_count, _pending_count_update_queued, _dirty_effects2, _maybe_dirty_effects2, _effect_pending, _effect_pending_subscriber, _hydrate_resolved_content, hydrate_resolved_content_fn, _hydrate_failed_content, hydrate_failed_content_fn, _hydrate_pending_content, hydrate_pending_content_fn, _render, render_fn, _resolve, resolve_fn, _run, run_fn, _update_pending_count, update_pending_count_fn, _handle_error, handle_error_fn;
var Boundary = class {
  /**
   * @param {TemplateNode} node
   * @param {BoundaryProps} props
   * @param {((anchor: Node) => void)} children
   * @param {((error: unknown) => unknown) | undefined} [transform_error]
   */
  constructor(node, props, children, transform_error) {
    __privateAdd(this, _hydrate_resolved_content);
    /**
     * @param {unknown} error The deserialized error from the server's hydration comment
     */
    __privateAdd(this, _hydrate_failed_content);
    __privateAdd(this, _hydrate_pending_content);
    __privateAdd(this, _render);
    /**
     * @param {Batch} batch
     */
    __privateAdd(this, _resolve);
    /**
     * @template T
     * @param {() => T} fn
     */
    __privateAdd(this, _run);
    /**
     * Updates the pending count associated with the currently visible pending snippet,
     * if any, such that we can replace the snippet with content once work is done
     * @param {1 | -1} d
     * @param {Batch} batch
     */
    __privateAdd(this, _update_pending_count);
    /**
     * @param {unknown} error
     */
    __privateAdd(this, _handle_error);
    /** @type {Boundary | null} */
    __publicField(this, "parent");
    __publicField(this, "is_pending", false);
    /**
     * API-level transformError transform function. Transforms errors before they reach the `failed` snippet.
     * Inherited from parent boundary, or defaults to identity.
     * @type {(error: unknown) => unknown}
     */
    __publicField(this, "transform_error");
    /** @type {TemplateNode} */
    __privateAdd(this, _anchor, void 0);
    /** @type {TemplateNode | null} */
    __privateAdd(this, _hydrate_open, hydrating ? hydrate_node : null);
    /** @type {BoundaryProps} */
    __privateAdd(this, _props, void 0);
    /** @type {((anchor: Node) => void)} */
    __privateAdd(this, _children, void 0);
    /** @type {Effect} */
    __privateAdd(this, _effect, void 0);
    /** @type {Effect | null} */
    __privateAdd(this, _main_effect, null);
    /** @type {Effect | null} */
    __privateAdd(this, _pending_effect, null);
    /** @type {Effect | null} */
    __privateAdd(this, _failed_effect, null);
    /** @type {DocumentFragment | null} */
    __privateAdd(this, _offscreen_fragment, null);
    __privateAdd(this, _local_pending_count, 0);
    __privateAdd(this, _pending_count, 0);
    __privateAdd(this, _pending_count_update_queued, false);
    /** @type {Set<Effect>} */
    __privateAdd(this, _dirty_effects2, /* @__PURE__ */ new Set());
    /** @type {Set<Effect>} */
    __privateAdd(this, _maybe_dirty_effects2, /* @__PURE__ */ new Set());
    /**
     * A source containing the number of pending async deriveds/expressions.
     * Only created if `$effect.pending()` is used inside the boundary,
     * otherwise updating the source results in needless `Batch.ensure()`
     * calls followed by no-op flushes
     * @type {Source<number> | null}
     */
    __privateAdd(this, _effect_pending, null);
    __privateAdd(this, _effect_pending_subscriber, createSubscriber(() => {
      __privateSet(this, _effect_pending, source(__privateGet(this, _local_pending_count)));
      if (dev_fallback_default) {
        tag(__privateGet(this, _effect_pending), "$effect.pending()");
      }
      return () => {
        __privateSet(this, _effect_pending, null);
      };
    }));
    var _a5, _b3;
    __privateSet(this, _anchor, node);
    __privateSet(this, _props, props);
    __privateSet(this, _children, (anchor) => {
      var effect2 = (
        /** @type {Effect} */
        active_effect
      );
      effect2.b = this;
      effect2.f |= BOUNDARY_EFFECT;
      children(anchor);
    });
    this.parent = /** @type {Effect} */
    active_effect.b;
    this.transform_error = (_b3 = transform_error != null ? transform_error : (_a5 = this.parent) == null ? void 0 : _a5.transform_error) != null ? _b3 : (e) => e;
    __privateSet(this, _effect, block(() => {
      if (hydrating) {
        const comment2 = (
          /** @type {Comment} */
          __privateGet(this, _hydrate_open)
        );
        hydrate_next();
        const server_rendered_pending = comment2.data === HYDRATION_START_ELSE;
        const server_rendered_failed = comment2.data.startsWith(HYDRATION_START_FAILED);
        if (server_rendered_failed) {
          const serialized_error = JSON.parse(comment2.data.slice(HYDRATION_START_FAILED.length));
          __privateMethod(this, _hydrate_failed_content, hydrate_failed_content_fn).call(this, serialized_error);
        } else if (server_rendered_pending) {
          __privateMethod(this, _hydrate_pending_content, hydrate_pending_content_fn).call(this);
        } else {
          __privateMethod(this, _hydrate_resolved_content, hydrate_resolved_content_fn).call(this);
        }
      } else {
        __privateMethod(this, _render, render_fn).call(this);
      }
    }, flags));
    if (hydrating) {
      __privateSet(this, _anchor, hydrate_node);
    }
  }
  /**
   * Defer an effect inside a pending boundary until the boundary resolves
   * @param {Effect} effect
   */
  defer_effect(effect2) {
    defer_effect(effect2, __privateGet(this, _dirty_effects2), __privateGet(this, _maybe_dirty_effects2));
  }
  /**
   * Returns `false` if the effect exists inside a boundary whose pending snippet is shown
   * @returns {boolean}
   */
  is_rendered() {
    return !this.is_pending && (!this.parent || this.parent.is_rendered());
  }
  has_pending_snippet() {
    return !!__privateGet(this, _props).pending;
  }
  /**
   * Update the source that powers `$effect.pending()` inside this boundary,
   * and controls when the current `pending` snippet (if any) is removed.
   * Do not call from inside the class
   * @param {1 | -1} d
   * @param {Batch} batch
   */
  update_pending_count(d, batch) {
    __privateMethod(this, _update_pending_count, update_pending_count_fn).call(this, d, batch);
    __privateSet(this, _local_pending_count, __privateGet(this, _local_pending_count) + d);
    if (!__privateGet(this, _effect_pending) || __privateGet(this, _pending_count_update_queued))
      return;
    __privateSet(this, _pending_count_update_queued, true);
    queue_micro_task(() => {
      __privateSet(this, _pending_count_update_queued, false);
      if (__privateGet(this, _effect_pending)) {
        internal_set(__privateGet(this, _effect_pending), __privateGet(this, _local_pending_count));
      }
    });
  }
  get_effect_pending() {
    __privateGet(this, _effect_pending_subscriber).call(this);
    return get2(
      /** @type {Source<number>} */
      __privateGet(this, _effect_pending)
    );
  }
  /** @param {unknown} error */
  error(error) {
    var _a5;
    if (!__privateGet(this, _props).onerror && !__privateGet(this, _props).failed) {
      throw error;
    }
    if ((_a5 = current_batch) == null ? void 0 : _a5.is_fork) {
      if (__privateGet(this, _main_effect))
        current_batch.skip_effect(__privateGet(this, _main_effect));
      if (__privateGet(this, _pending_effect))
        current_batch.skip_effect(__privateGet(this, _pending_effect));
      if (__privateGet(this, _failed_effect))
        current_batch.skip_effect(__privateGet(this, _failed_effect));
      current_batch.on_fork_commit(() => {
        __privateMethod(this, _handle_error, handle_error_fn).call(this, error);
      });
    } else {
      __privateMethod(this, _handle_error, handle_error_fn).call(this, error);
    }
  }
};
_anchor = new WeakMap();
_hydrate_open = new WeakMap();
_props = new WeakMap();
_children = new WeakMap();
_effect = new WeakMap();
_main_effect = new WeakMap();
_pending_effect = new WeakMap();
_failed_effect = new WeakMap();
_offscreen_fragment = new WeakMap();
_local_pending_count = new WeakMap();
_pending_count = new WeakMap();
_pending_count_update_queued = new WeakMap();
_dirty_effects2 = new WeakMap();
_maybe_dirty_effects2 = new WeakMap();
_effect_pending = new WeakMap();
_effect_pending_subscriber = new WeakMap();
_hydrate_resolved_content = new WeakSet();
hydrate_resolved_content_fn = function() {
  try {
    __privateSet(this, _main_effect, branch(() => __privateGet(this, _children).call(this, __privateGet(this, _anchor))));
  } catch (error) {
    this.error(error);
  }
};
_hydrate_failed_content = new WeakSet();
hydrate_failed_content_fn = function(error) {
  const failed = __privateGet(this, _props).failed;
  if (!failed)
    return;
  __privateSet(this, _failed_effect, branch(() => {
    failed(
      __privateGet(this, _anchor),
      () => error,
      () => () => {
      }
    );
  }));
};
_hydrate_pending_content = new WeakSet();
hydrate_pending_content_fn = function() {
  const pending2 = __privateGet(this, _props).pending;
  if (!pending2)
    return;
  this.is_pending = true;
  __privateSet(this, _pending_effect, branch(() => pending2(__privateGet(this, _anchor))));
  queue_micro_task(() => {
    var fragment = __privateSet(this, _offscreen_fragment, document.createDocumentFragment());
    var anchor = create_text();
    fragment.append(anchor);
    __privateSet(this, _main_effect, __privateMethod(this, _run, run_fn).call(this, () => {
      return branch(() => __privateGet(this, _children).call(this, anchor));
    }));
    if (__privateGet(this, _pending_count) === 0) {
      __privateGet(this, _anchor).before(fragment);
      __privateSet(this, _offscreen_fragment, null);
      pause_effect(
        /** @type {Effect} */
        __privateGet(this, _pending_effect),
        () => {
          __privateSet(this, _pending_effect, null);
        }
      );
      __privateMethod(this, _resolve, resolve_fn).call(
        this,
        /** @type {Batch} */
        current_batch
      );
    }
  });
};
_render = new WeakSet();
render_fn = function() {
  try {
    this.is_pending = this.has_pending_snippet();
    __privateSet(this, _pending_count, 0);
    __privateSet(this, _local_pending_count, 0);
    __privateSet(this, _main_effect, branch(() => {
      __privateGet(this, _children).call(this, __privateGet(this, _anchor));
    }));
    if (__privateGet(this, _pending_count) > 0) {
      var fragment = __privateSet(this, _offscreen_fragment, document.createDocumentFragment());
      move_effect(__privateGet(this, _main_effect), fragment);
      const pending2 = (
        /** @type {(anchor: Node) => void} */
        __privateGet(this, _props).pending
      );
      __privateSet(this, _pending_effect, branch(() => pending2(__privateGet(this, _anchor))));
    } else {
      __privateMethod(this, _resolve, resolve_fn).call(
        this,
        /** @type {Batch} */
        current_batch
      );
    }
  } catch (error) {
    this.error(error);
  }
};
_resolve = new WeakSet();
resolve_fn = function(batch) {
  this.is_pending = false;
  batch.transfer_effects(__privateGet(this, _dirty_effects2), __privateGet(this, _maybe_dirty_effects2));
};
_run = new WeakSet();
run_fn = function(fn) {
  var previous_effect = active_effect;
  var previous_reaction = active_reaction;
  var previous_ctx = component_context;
  set_active_effect(__privateGet(this, _effect));
  set_active_reaction(__privateGet(this, _effect));
  set_component_context(__privateGet(this, _effect).ctx);
  try {
    Batch.ensure();
    return fn();
  } catch (e) {
    handle_error(e);
    return null;
  } finally {
    set_active_effect(previous_effect);
    set_active_reaction(previous_reaction);
    set_component_context(previous_ctx);
  }
};
_update_pending_count = new WeakSet();
update_pending_count_fn = function(d, batch) {
  var _a5;
  if (!this.has_pending_snippet()) {
    if (this.parent) {
      __privateMethod(_a5 = this.parent, _update_pending_count, update_pending_count_fn).call(_a5, d, batch);
    }
    return;
  }
  __privateSet(this, _pending_count, __privateGet(this, _pending_count) + d);
  if (__privateGet(this, _pending_count) === 0) {
    __privateMethod(this, _resolve, resolve_fn).call(this, batch);
    if (__privateGet(this, _pending_effect)) {
      pause_effect(__privateGet(this, _pending_effect), () => {
        __privateSet(this, _pending_effect, null);
      });
    }
    if (__privateGet(this, _offscreen_fragment)) {
      __privateGet(this, _anchor).before(__privateGet(this, _offscreen_fragment));
      __privateSet(this, _offscreen_fragment, null);
    }
  }
};
_handle_error = new WeakSet();
handle_error_fn = function(error) {
  if (__privateGet(this, _main_effect)) {
    destroy_effect(__privateGet(this, _main_effect));
    __privateSet(this, _main_effect, null);
  }
  if (__privateGet(this, _pending_effect)) {
    destroy_effect(__privateGet(this, _pending_effect));
    __privateSet(this, _pending_effect, null);
  }
  if (__privateGet(this, _failed_effect)) {
    destroy_effect(__privateGet(this, _failed_effect));
    __privateSet(this, _failed_effect, null);
  }
  if (hydrating) {
    set_hydrate_node(
      /** @type {TemplateNode} */
      __privateGet(this, _hydrate_open)
    );
    next();
    set_hydrate_node(skip_nodes());
  }
  var onerror = __privateGet(this, _props).onerror;
  let failed = __privateGet(this, _props).failed;
  var did_reset = false;
  var calling_on_error = false;
  const reset2 = () => {
    if (did_reset) {
      svelte_boundary_reset_noop();
      return;
    }
    did_reset = true;
    if (calling_on_error) {
      svelte_boundary_reset_onerror();
    }
    if (__privateGet(this, _failed_effect) !== null) {
      pause_effect(__privateGet(this, _failed_effect), () => {
        __privateSet(this, _failed_effect, null);
      });
    }
    __privateMethod(this, _run, run_fn).call(this, () => {
      __privateMethod(this, _render, render_fn).call(this);
    });
  };
  const handle_error_result = (transformed_error) => {
    try {
      calling_on_error = true;
      onerror == null ? void 0 : onerror(transformed_error, reset2);
      calling_on_error = false;
    } catch (error2) {
      invoke_error_boundary(error2, __privateGet(this, _effect) && __privateGet(this, _effect).parent);
    }
    if (failed) {
      __privateSet(this, _failed_effect, __privateMethod(this, _run, run_fn).call(this, () => {
        try {
          return branch(() => {
            var effect2 = (
              /** @type {Effect} */
              active_effect
            );
            effect2.b = this;
            effect2.f |= BOUNDARY_EFFECT;
            failed(
              __privateGet(this, _anchor),
              () => transformed_error,
              () => reset2
            );
          });
        } catch (error2) {
          invoke_error_boundary(
            error2,
            /** @type {Effect} */
            __privateGet(this, _effect).parent
          );
          return null;
        }
      }));
    }
  };
  queue_micro_task(() => {
    var result;
    try {
      result = this.transform_error(error);
    } catch (e) {
      invoke_error_boundary(e, __privateGet(this, _effect) && __privateGet(this, _effect).parent);
      return;
    }
    if (result !== null && typeof result === "object" && typeof /** @type {any} */
    result.then === "function") {
      result.then(
        handle_error_result,
        /** @param {unknown} e */
        (e) => invoke_error_boundary(e, __privateGet(this, _effect) && __privateGet(this, _effect).parent)
      );
    } else {
      handle_error_result(result);
    }
  });
};

// node_modules/svelte/src/internal/client/reactivity/async.js
function flatten(blockers, sync, async2, fn) {
  const d = is_runes() ? derived : derived_safe_equal;
  var pending2 = blockers.filter((b) => !b.settled);
  if (async2.length === 0 && pending2.length === 0) {
    fn(sync.map(d));
    return;
  }
  var parent = (
    /** @type {Effect} */
    active_effect
  );
  var restore = capture();
  var blocker_promise = pending2.length === 1 ? pending2[0].promise : pending2.length > 1 ? Promise.all(pending2.map((b) => b.promise)) : null;
  function finish(values) {
    restore();
    try {
      fn(values);
    } catch (error) {
      if ((parent.f & DESTROYED) === 0) {
        invoke_error_boundary(error, parent);
      }
    }
    unset_context();
  }
  if (async2.length === 0) {
    blocker_promise.then(() => finish(sync.map(d)));
    return;
  }
  var decrement_pending = increment_pending();
  function run3() {
    Promise.all(async2.map((expression) => async_derived(expression))).then((result) => finish([...sync.map(d), ...result])).catch((error) => invoke_error_boundary(error, parent)).finally(() => decrement_pending());
  }
  if (blocker_promise) {
    blocker_promise.then(() => {
      restore();
      run3();
      unset_context();
    });
  } else {
    run3();
  }
}
function capture() {
  var previous_effect = (
    /** @type {Effect} */
    active_effect
  );
  var previous_reaction = active_reaction;
  var previous_component_context = component_context;
  var previous_batch2 = (
    /** @type {Batch} */
    current_batch
  );
  if (dev_fallback_default) {
    var previous_dev_stack = dev_stack;
  }
  return function restore(activate_batch = true) {
    set_active_effect(previous_effect);
    set_active_reaction(previous_reaction);
    set_component_context(previous_component_context);
    if (activate_batch && (previous_effect.f & DESTROYED) === 0) {
      previous_batch2 == null ? void 0 : previous_batch2.activate();
      previous_batch2 == null ? void 0 : previous_batch2.apply();
    }
    if (dev_fallback_default) {
      set_reactivity_loss_tracker(null);
      set_dev_stack(previous_dev_stack);
    }
  };
}
function unset_context(deactivate_batch = true) {
  var _a5;
  set_active_effect(null);
  set_active_reaction(null);
  set_component_context(null);
  if (deactivate_batch)
    (_a5 = current_batch) == null ? void 0 : _a5.deactivate();
  if (dev_fallback_default) {
    set_reactivity_loss_tracker(null);
    set_dev_stack(null);
  }
}
function increment_pending() {
  var effect2 = (
    /** @type {Effect} */
    active_effect
  );
  var boundary2 = (
    /** @type {Boundary} */
    effect2.b
  );
  var batch = (
    /** @type {Batch} */
    current_batch
  );
  var blocking = boundary2.is_rendered();
  boundary2.update_pending_count(1, batch);
  batch.increment(blocking, effect2);
  return (skip = false) => {
    boundary2.update_pending_count(-1, batch);
    batch.decrement(blocking, effect2, skip);
  };
}

// node_modules/svelte/src/internal/client/reactivity/deriveds.js
var reactivity_loss_tracker = null;
function set_reactivity_loss_tracker(v) {
  reactivity_loss_tracker = v;
}
var recent_async_deriveds = /* @__PURE__ */ new Set();
function derived(fn) {
  var flags2 = DERIVED | DIRTY;
  if (active_effect !== null) {
    active_effect.f |= EFFECT_PRESERVED;
  }
  const signal = {
    ctx: component_context,
    deps: null,
    effects: null,
    equals,
    f: flags2,
    fn,
    reactions: null,
    rv: 0,
    v: (
      /** @type {V} */
      UNINITIALIZED
    ),
    wv: 0,
    parent: active_effect,
    ac: null
  };
  if (dev_fallback_default && tracing_mode_flag) {
    signal.created = get_error("created at");
  }
  return signal;
}
function async_derived(fn, label, location) {
  let parent = (
    /** @type {Effect | null} */
    active_effect
  );
  if (parent === null) {
    async_derived_orphan();
  }
  var promise = (
    /** @type {Promise<V>} */
    /** @type {unknown} */
    void 0
  );
  var signal = source(
    /** @type {V} */
    UNINITIALIZED
  );
  if (dev_fallback_default)
    signal.label = label;
  var should_suspend = !active_reaction;
  var deferreds = /* @__PURE__ */ new Map();
  async_effect(() => {
    var _a5;
    var effect2 = (
      /** @type {Effect} */
      active_effect
    );
    if (dev_fallback_default) {
      reactivity_loss_tracker = { effect: effect2, effect_deps: /* @__PURE__ */ new Set(), warned: false };
    }
    var d = deferred();
    promise = d.promise;
    try {
      Promise.resolve(fn()).then(d.resolve, d.reject).finally(unset_context);
    } catch (error) {
      d.reject(error);
      unset_context();
    }
    if (dev_fallback_default) {
      if (reactivity_loss_tracker) {
        if (effect2.deps !== null) {
          for (let i = 0; i < skipped_deps; i += 1) {
            reactivity_loss_tracker.effect_deps.add(effect2.deps[i]);
          }
        }
        if (new_deps !== null) {
          for (let i = 0; i < new_deps.length; i += 1) {
            reactivity_loss_tracker.effect_deps.add(new_deps[i]);
          }
        }
      }
      reactivity_loss_tracker = null;
    }
    var batch = (
      /** @type {Batch} */
      current_batch
    );
    if (should_suspend) {
      if ((effect2.f & REACTION_RAN) !== 0) {
        var decrement_pending = increment_pending();
      }
      if (
        /** @type {Boundary} */
        parent.b.is_rendered()
      ) {
        (_a5 = deferreds.get(batch)) == null ? void 0 : _a5.reject(STALE_REACTION);
        deferreds.delete(batch);
      } else {
        for (const d2 of deferreds.values()) {
          d2.reject(STALE_REACTION);
        }
        deferreds.clear();
      }
      deferreds.set(batch, d);
    }
    const handler = (value, error = void 0) => {
      if (dev_fallback_default) {
        reactivity_loss_tracker = null;
      }
      if (decrement_pending) {
        var skip = error === STALE_REACTION;
        decrement_pending(skip);
      }
      if (error === STALE_REACTION || (effect2.f & DESTROYED) !== 0) {
        return;
      }
      batch.activate();
      if (error) {
        signal.f |= ERROR_VALUE;
        internal_set(signal, error);
      } else {
        if ((signal.f & ERROR_VALUE) !== 0) {
          signal.f ^= ERROR_VALUE;
        }
        internal_set(signal, value);
        for (const [b, d2] of deferreds) {
          deferreds.delete(b);
          if (b === batch)
            break;
          d2.reject(STALE_REACTION);
        }
        if (dev_fallback_default && location !== void 0) {
          recent_async_deriveds.add(signal);
          setTimeout(() => {
            if (recent_async_deriveds.has(signal)) {
              await_waterfall(
                /** @type {string} */
                signal.label,
                location
              );
              recent_async_deriveds.delete(signal);
            }
          });
        }
      }
      batch.deactivate();
    };
    d.promise.then(handler, (e) => handler(null, e || "unknown"));
  });
  teardown(() => {
    for (const d of deferreds.values()) {
      d.reject(STALE_REACTION);
    }
  });
  if (dev_fallback_default) {
    signal.f |= ASYNC;
  }
  return new Promise((fulfil) => {
    function next2(p) {
      function go() {
        if (p === promise) {
          fulfil(signal);
        } else {
          next2(promise);
        }
      }
      p.then(go, go);
    }
    next2(promise);
  });
}
function user_derived(fn) {
  const d = derived(fn);
  if (!async_mode_flag)
    push_reaction_value(d);
  return d;
}
function derived_safe_equal(fn) {
  const signal = derived(fn);
  signal.equals = safe_equals;
  return signal;
}
function destroy_derived_effects(derived2) {
  var effects = derived2.effects;
  if (effects !== null) {
    derived2.effects = null;
    for (var i = 0; i < effects.length; i += 1) {
      destroy_effect(
        /** @type {Effect} */
        effects[i]
      );
    }
  }
}
var stack = [];
function execute_derived(derived2) {
  var value;
  var prev_active_effect = active_effect;
  var parent = derived2.parent;
  if (!is_destroying_effect && parent !== null && (parent.f & (DESTROYED | INERT)) !== 0) {
    derived_inert();
    return derived2.v;
  }
  set_active_effect(parent);
  if (dev_fallback_default) {
    let prev_eager_effects = eager_effects;
    set_eager_effects(/* @__PURE__ */ new Set());
    try {
      if (includes.call(stack, derived2)) {
        derived_references_self();
      }
      stack.push(derived2);
      derived2.f &= ~WAS_MARKED;
      destroy_derived_effects(derived2);
      value = update_reaction(derived2);
    } finally {
      set_active_effect(prev_active_effect);
      set_eager_effects(prev_eager_effects);
      stack.pop();
    }
  } else {
    try {
      derived2.f &= ~WAS_MARKED;
      destroy_derived_effects(derived2);
      value = update_reaction(derived2);
    } finally {
      set_active_effect(prev_active_effect);
    }
  }
  return value;
}
function update_derived(derived2) {
  var _a5, _b3;
  var value = execute_derived(derived2);
  if (!derived2.equals(value)) {
    derived2.wv = increment_write_version();
    if (!((_a5 = current_batch) == null ? void 0 : _a5.is_fork) || derived2.deps === null) {
      if (current_batch !== null) {
        current_batch.capture(derived2, value, true);
      } else {
        derived2.v = value;
      }
      if (derived2.deps === null) {
        set_signal_status(derived2, CLEAN);
        return;
      }
    }
  }
  if (is_destroying_effect) {
    return;
  }
  if (batch_values !== null) {
    if (effect_tracking() || ((_b3 = current_batch) == null ? void 0 : _b3.is_fork)) {
      batch_values.set(derived2, value);
    }
  } else {
    update_derived_status(derived2);
  }
}
function freeze_derived_effects(derived2) {
  var _a5, _b3;
  if (derived2.effects === null)
    return;
  for (const e of derived2.effects) {
    if (e.teardown || e.ac) {
      (_a5 = e.teardown) == null ? void 0 : _a5.call(e);
      (_b3 = e.ac) == null ? void 0 : _b3.abort(STALE_REACTION);
      e.teardown = noop;
      e.ac = null;
      remove_reactions(e, 0);
      destroy_effect_children(e);
    }
  }
}
function unfreeze_derived_effects(derived2) {
  if (derived2.effects === null)
    return;
  for (const e of derived2.effects) {
    if (e.teardown) {
      update_effect(e);
    }
  }
}

// node_modules/svelte/src/internal/client/reactivity/sources.js
var eager_effects = /* @__PURE__ */ new Set();
var old_values = /* @__PURE__ */ new Map();
function set_eager_effects(v) {
  eager_effects = v;
}
var eager_effects_deferred = false;
function set_eager_effects_deferred() {
  eager_effects_deferred = true;
}
function source(v, stack2) {
  var signal = {
    f: 0,
    // TODO ideally we could skip this altogether, but it causes type errors
    v,
    reactions: null,
    equals,
    rv: 0,
    wv: 0
  };
  if (dev_fallback_default && tracing_mode_flag) {
    signal.created = stack2 != null ? stack2 : get_error("created at");
    signal.updated = null;
    signal.set_during_effect = false;
    signal.trace = null;
  }
  return signal;
}
function state(v, stack2) {
  const s = source(v, stack2);
  push_reaction_value(s);
  return s;
}
function mutable_source(initial_value, immutable = false, trackable = true) {
  var _a5, _b3;
  const s = source(initial_value);
  if (!immutable) {
    s.equals = safe_equals;
  }
  if (legacy_mode_flag && trackable && component_context !== null && component_context.l !== null) {
    ((_b3 = (_a5 = component_context.l).s) != null ? _b3 : _a5.s = []).push(s);
  }
  return s;
}
function set(source2, value, should_proxy = false) {
  if (active_reaction !== null && // since we are untracking the function inside `$inspect.with` we need to add this check
  // to ensure we error if state is set inside an inspect effect
  (!untracking || (active_reaction.f & EAGER_EFFECT) !== 0) && is_runes() && (active_reaction.f & (DERIVED | BLOCK_EFFECT | ASYNC | EAGER_EFFECT)) !== 0 && (current_sources === null || !includes.call(current_sources, source2))) {
    state_unsafe_mutation();
  }
  let new_value = should_proxy ? proxy(value) : value;
  if (dev_fallback_default) {
    tag_proxy(
      new_value,
      /** @type {string} */
      source2.label
    );
  }
  return internal_set(source2, new_value, legacy_updates);
}
function internal_set(source2, value, updated_during_traversal = null) {
  var _a5, _b3, _c2;
  if (!source2.equals(value)) {
    old_values.set(source2, is_destroying_effect ? value : source2.v);
    var batch = Batch.ensure();
    batch.capture(source2, value);
    if (dev_fallback_default) {
      if (tracing_mode_flag || active_effect !== null) {
        (_a5 = source2.updated) != null ? _a5 : source2.updated = /* @__PURE__ */ new Map();
        const count = ((_c2 = (_b3 = source2.updated.get("")) == null ? void 0 : _b3.count) != null ? _c2 : 0) + 1;
        source2.updated.set("", { error: (
          /** @type {any} */
          null
        ), count });
        if (tracing_mode_flag || count > 5) {
          const error = get_error("updated at");
          if (error !== null) {
            let entry = source2.updated.get(error.stack);
            if (!entry) {
              entry = { error, count: 0 };
              source2.updated.set(error.stack, entry);
            }
            entry.count++;
          }
        }
      }
      if (active_effect !== null) {
        source2.set_during_effect = true;
      }
    }
    if ((source2.f & DERIVED) !== 0) {
      const derived2 = (
        /** @type {Derived} */
        source2
      );
      if ((source2.f & DIRTY) !== 0) {
        execute_derived(derived2);
      }
      if (batch_values === null) {
        update_derived_status(derived2);
      }
    }
    source2.wv = increment_write_version();
    mark_reactions(source2, DIRTY, updated_during_traversal);
    if (is_runes() && active_effect !== null && (active_effect.f & CLEAN) !== 0 && (active_effect.f & (BRANCH_EFFECT | ROOT_EFFECT)) === 0) {
      if (untracked_writes === null) {
        set_untracked_writes([source2]);
      } else {
        untracked_writes.push(source2);
      }
    }
    if (!batch.is_fork && eager_effects.size > 0 && !eager_effects_deferred) {
      flush_eager_effects();
    }
  }
  return value;
}
function flush_eager_effects() {
  eager_effects_deferred = false;
  for (const effect2 of eager_effects) {
    if ((effect2.f & CLEAN) !== 0) {
      set_signal_status(effect2, MAYBE_DIRTY);
    }
    if (is_dirty(effect2)) {
      update_effect(effect2);
    }
  }
  eager_effects.clear();
}
function increment(source2) {
  set(source2, source2.v + 1);
}
function mark_reactions(signal, status, updated_during_traversal) {
  var _a5;
  var reactions = signal.reactions;
  if (reactions === null)
    return;
  var runes = is_runes();
  var length = reactions.length;
  for (var i = 0; i < length; i++) {
    var reaction = reactions[i];
    var flags2 = reaction.f;
    if (!runes && reaction === active_effect)
      continue;
    if (dev_fallback_default && (flags2 & EAGER_EFFECT) !== 0) {
      eager_effects.add(reaction);
      continue;
    }
    var not_dirty = (flags2 & DIRTY) === 0;
    if (not_dirty) {
      set_signal_status(reaction, status);
    }
    if ((flags2 & DERIVED) !== 0) {
      var derived2 = (
        /** @type {Derived} */
        reaction
      );
      (_a5 = batch_values) == null ? void 0 : _a5.delete(derived2);
      if ((flags2 & WAS_MARKED) === 0) {
        if (flags2 & CONNECTED && (active_effect === null || (active_effect.f & REACTION_IS_UPDATING) === 0)) {
          reaction.f |= WAS_MARKED;
        }
        mark_reactions(derived2, MAYBE_DIRTY, updated_during_traversal);
      }
    } else if (not_dirty) {
      var effect2 = (
        /** @type {Effect} */
        reaction
      );
      if ((flags2 & BLOCK_EFFECT) !== 0 && eager_block_effects !== null) {
        eager_block_effects.add(effect2);
      }
      if (updated_during_traversal !== null) {
        updated_during_traversal.push(effect2);
      } else {
        schedule_effect(effect2);
      }
    }
  }
}

// node_modules/svelte/src/internal/client/proxy.js
var regex_is_valid_identifier = /^[a-zA-Z_$][a-zA-Z_$0-9]*$/;
function proxy(value) {
  if (typeof value !== "object" || value === null || STATE_SYMBOL in value) {
    return value;
  }
  const prototype = get_prototype_of(value);
  if (prototype !== object_prototype && prototype !== array_prototype) {
    return value;
  }
  var sources = /* @__PURE__ */ new Map();
  var is_proxied_array = is_array(value);
  var version = state(0);
  var stack2 = dev_fallback_default && tracing_mode_flag ? get_error("created at") : null;
  var parent_version = update_version;
  var with_parent = (fn) => {
    if (update_version === parent_version) {
      return fn();
    }
    var reaction = active_reaction;
    var version2 = update_version;
    set_active_reaction(null);
    set_update_version(parent_version);
    var result = fn();
    set_active_reaction(reaction);
    set_update_version(version2);
    return result;
  };
  if (is_proxied_array) {
    sources.set("length", state(
      /** @type {any[]} */
      value.length,
      stack2
    ));
    if (dev_fallback_default) {
      value = /** @type {any} */
      inspectable_array(
        /** @type {any[]} */
        value
      );
    }
  }
  var path = "";
  let updating = false;
  function update_path(new_path) {
    if (updating)
      return;
    updating = true;
    path = new_path;
    tag(version, `${path} version`);
    for (const [prop2, source2] of sources) {
      tag(source2, get_label(path, prop2));
    }
    updating = false;
  }
  return new Proxy(
    /** @type {any} */
    value,
    {
      defineProperty(_, prop2, descriptor) {
        if (!("value" in descriptor) || descriptor.configurable === false || descriptor.enumerable === false || descriptor.writable === false) {
          state_descriptors_fixed();
        }
        var s = sources.get(prop2);
        if (s === void 0) {
          with_parent(() => {
            var s2 = state(descriptor.value, stack2);
            sources.set(prop2, s2);
            if (dev_fallback_default && typeof prop2 === "string") {
              tag(s2, get_label(path, prop2));
            }
            return s2;
          });
        } else {
          set(s, descriptor.value, true);
        }
        return true;
      },
      deleteProperty(target, prop2) {
        var s = sources.get(prop2);
        if (s === void 0) {
          if (prop2 in target) {
            const s2 = with_parent(() => state(UNINITIALIZED, stack2));
            sources.set(prop2, s2);
            increment(version);
            if (dev_fallback_default) {
              tag(s2, get_label(path, prop2));
            }
          }
        } else {
          set(s, UNINITIALIZED);
          increment(version);
        }
        return true;
      },
      get(target, prop2, receiver) {
        var _a5;
        if (prop2 === STATE_SYMBOL) {
          return value;
        }
        if (dev_fallback_default && prop2 === PROXY_PATH_SYMBOL) {
          return update_path;
        }
        var s = sources.get(prop2);
        var exists = prop2 in target;
        if (s === void 0 && (!exists || ((_a5 = get_descriptor(target, prop2)) == null ? void 0 : _a5.writable))) {
          s = with_parent(() => {
            var p = proxy(exists ? target[prop2] : UNINITIALIZED);
            var s2 = state(p, stack2);
            if (dev_fallback_default) {
              tag(s2, get_label(path, prop2));
            }
            return s2;
          });
          sources.set(prop2, s);
        }
        if (s !== void 0) {
          var v = get2(s);
          return v === UNINITIALIZED ? void 0 : v;
        }
        return Reflect.get(target, prop2, receiver);
      },
      getOwnPropertyDescriptor(target, prop2) {
        var descriptor = Reflect.getOwnPropertyDescriptor(target, prop2);
        if (descriptor && "value" in descriptor) {
          var s = sources.get(prop2);
          if (s)
            descriptor.value = get2(s);
        } else if (descriptor === void 0) {
          var source2 = sources.get(prop2);
          var value2 = source2 == null ? void 0 : source2.v;
          if (source2 !== void 0 && value2 !== UNINITIALIZED) {
            return {
              enumerable: true,
              configurable: true,
              value: value2,
              writable: true
            };
          }
        }
        return descriptor;
      },
      has(target, prop2) {
        var _a5;
        if (prop2 === STATE_SYMBOL) {
          return true;
        }
        var s = sources.get(prop2);
        var has = s !== void 0 && s.v !== UNINITIALIZED || Reflect.has(target, prop2);
        if (s !== void 0 || active_effect !== null && (!has || ((_a5 = get_descriptor(target, prop2)) == null ? void 0 : _a5.writable))) {
          if (s === void 0) {
            s = with_parent(() => {
              var p = has ? proxy(target[prop2]) : UNINITIALIZED;
              var s2 = state(p, stack2);
              if (dev_fallback_default) {
                tag(s2, get_label(path, prop2));
              }
              return s2;
            });
            sources.set(prop2, s);
          }
          var value2 = get2(s);
          if (value2 === UNINITIALIZED) {
            return false;
          }
        }
        return has;
      },
      set(target, prop2, value2, receiver) {
        var _a5;
        var s = sources.get(prop2);
        var has = prop2 in target;
        if (is_proxied_array && prop2 === "length") {
          for (var i = value2; i < /** @type {Source<number>} */
          s.v; i += 1) {
            var other_s = sources.get(i + "");
            if (other_s !== void 0) {
              set(other_s, UNINITIALIZED);
            } else if (i in target) {
              other_s = with_parent(() => state(UNINITIALIZED, stack2));
              sources.set(i + "", other_s);
              if (dev_fallback_default) {
                tag(other_s, get_label(path, i));
              }
            }
          }
        }
        if (s === void 0) {
          if (!has || ((_a5 = get_descriptor(target, prop2)) == null ? void 0 : _a5.writable)) {
            s = with_parent(() => state(void 0, stack2));
            if (dev_fallback_default) {
              tag(s, get_label(path, prop2));
            }
            set(s, proxy(value2));
            sources.set(prop2, s);
          }
        } else {
          has = s.v !== UNINITIALIZED;
          var p = with_parent(() => proxy(value2));
          set(s, p);
        }
        var descriptor = Reflect.getOwnPropertyDescriptor(target, prop2);
        if (descriptor == null ? void 0 : descriptor.set) {
          descriptor.set.call(receiver, value2);
        }
        if (!has) {
          if (is_proxied_array && typeof prop2 === "string") {
            var ls = (
              /** @type {Source<number>} */
              sources.get("length")
            );
            var n = Number(prop2);
            if (Number.isInteger(n) && n >= ls.v) {
              set(ls, n + 1);
            }
          }
          increment(version);
        }
        return true;
      },
      ownKeys(target) {
        get2(version);
        var own_keys = Reflect.ownKeys(target).filter((key3) => {
          var source3 = sources.get(key3);
          return source3 === void 0 || source3.v !== UNINITIALIZED;
        });
        for (var [key2, source2] of sources) {
          if (source2.v !== UNINITIALIZED && !(key2 in target)) {
            own_keys.push(key2);
          }
        }
        return own_keys;
      },
      setPrototypeOf() {
        state_prototype_fixed();
      }
    }
  );
}
function get_label(path, prop2) {
  var _a5;
  if (typeof prop2 === "symbol")
    return `${path}[Symbol(${(_a5 = prop2.description) != null ? _a5 : ""})]`;
  if (regex_is_valid_identifier.test(prop2))
    return `${path}.${prop2}`;
  return /^\d+$/.test(prop2) ? `${path}[${prop2}]` : `${path}['${prop2}']`;
}
function get_proxied_value(value) {
  try {
    if (value !== null && typeof value === "object" && STATE_SYMBOL in value) {
      return value[STATE_SYMBOL];
    }
  } catch (e) {
  }
  return value;
}
var ARRAY_MUTATING_METHODS = /* @__PURE__ */ new Set([
  "copyWithin",
  "fill",
  "pop",
  "push",
  "reverse",
  "shift",
  "sort",
  "splice",
  "unshift"
]);
function inspectable_array(array) {
  return new Proxy(array, {
    get(target, prop2, receiver) {
      var value = Reflect.get(target, prop2, receiver);
      if (!ARRAY_MUTATING_METHODS.has(
        /** @type {string} */
        prop2
      )) {
        return value;
      }
      return function(...args) {
        set_eager_effects_deferred();
        var result = value.apply(this, args);
        flush_eager_effects();
        return result;
      };
    }
  });
}

// node_modules/svelte/src/internal/client/dev/equality.js
function init_array_prototype_warnings() {
  const array_prototype2 = Array.prototype;
  const cleanup = Array.__svelte_cleanup;
  if (cleanup) {
    cleanup();
  }
  const { indexOf, lastIndexOf, includes: includes2 } = array_prototype2;
  array_prototype2.indexOf = function(item, from_index) {
    const index2 = indexOf.call(this, item, from_index);
    if (index2 === -1) {
      for (let i = from_index != null ? from_index : 0; i < this.length; i += 1) {
        if (get_proxied_value(this[i]) === item) {
          state_proxy_equality_mismatch("array.indexOf(...)");
          break;
        }
      }
    }
    return index2;
  };
  array_prototype2.lastIndexOf = function(item, from_index) {
    const index2 = lastIndexOf.call(this, item, from_index != null ? from_index : this.length - 1);
    if (index2 === -1) {
      for (let i = 0; i <= (from_index != null ? from_index : this.length - 1); i += 1) {
        if (get_proxied_value(this[i]) === item) {
          state_proxy_equality_mismatch("array.lastIndexOf(...)");
          break;
        }
      }
    }
    return index2;
  };
  array_prototype2.includes = function(item, from_index) {
    const has = includes2.call(this, item, from_index);
    if (!has) {
      for (let i = 0; i < this.length; i += 1) {
        if (get_proxied_value(this[i]) === item) {
          state_proxy_equality_mismatch("array.includes(...)");
          break;
        }
      }
    }
    return has;
  };
  Array.__svelte_cleanup = () => {
    array_prototype2.indexOf = indexOf;
    array_prototype2.lastIndexOf = lastIndexOf;
    array_prototype2.includes = includes2;
  };
}

// node_modules/svelte/src/internal/client/dom/operations.js
var $window;
var $document;
var is_firefox;
var first_child_getter;
var next_sibling_getter;
function init_operations() {
  if ($window !== void 0) {
    return;
  }
  $window = window;
  $document = document;
  is_firefox = /Firefox/.test(navigator.userAgent);
  var element_prototype = Element.prototype;
  var node_prototype = Node.prototype;
  var text_prototype = Text.prototype;
  first_child_getter = get_descriptor(node_prototype, "firstChild").get;
  next_sibling_getter = get_descriptor(node_prototype, "nextSibling").get;
  if (is_extensible(element_prototype)) {
    element_prototype.__click = void 0;
    element_prototype.__className = void 0;
    element_prototype.__attributes = null;
    element_prototype.__style = void 0;
    element_prototype.__e = void 0;
  }
  if (is_extensible(text_prototype)) {
    text_prototype.__t = void 0;
  }
  if (dev_fallback_default) {
    element_prototype.__svelte_meta = null;
    init_array_prototype_warnings();
  }
}
function create_text(value = "") {
  return document.createTextNode(value);
}
function get_first_child(node) {
  return (
    /** @type {TemplateNode | null} */
    first_child_getter.call(node)
  );
}
function get_next_sibling(node) {
  return (
    /** @type {TemplateNode | null} */
    next_sibling_getter.call(node)
  );
}
function child(node, is_text) {
  if (!hydrating) {
    return get_first_child(node);
  }
  var child2 = get_first_child(hydrate_node);
  if (child2 === null) {
    child2 = hydrate_node.appendChild(create_text());
  } else if (is_text && child2.nodeType !== TEXT_NODE) {
    var text2 = create_text();
    child2 == null ? void 0 : child2.before(text2);
    set_hydrate_node(text2);
    return text2;
  }
  if (is_text) {
    merge_text_nodes(
      /** @type {Text} */
      child2
    );
  }
  set_hydrate_node(child2);
  return child2;
}
function first_child(node, is_text = false) {
  var _a5, _b3;
  if (!hydrating) {
    var first = get_first_child(node);
    if (first instanceof Comment && first.data === "")
      return get_next_sibling(first);
    return first;
  }
  if (is_text) {
    if (((_a5 = hydrate_node) == null ? void 0 : _a5.nodeType) !== TEXT_NODE) {
      var text2 = create_text();
      (_b3 = hydrate_node) == null ? void 0 : _b3.before(text2);
      set_hydrate_node(text2);
      return text2;
    }
    merge_text_nodes(
      /** @type {Text} */
      hydrate_node
    );
  }
  return hydrate_node;
}
function sibling(node, count = 1, is_text = false) {
  let next_sibling = hydrating ? hydrate_node : node;
  var last_sibling;
  while (count--) {
    last_sibling = next_sibling;
    next_sibling = /** @type {TemplateNode} */
    get_next_sibling(next_sibling);
  }
  if (!hydrating) {
    return next_sibling;
  }
  if (is_text) {
    if ((next_sibling == null ? void 0 : next_sibling.nodeType) !== TEXT_NODE) {
      var text2 = create_text();
      if (next_sibling === null) {
        last_sibling == null ? void 0 : last_sibling.after(text2);
      } else {
        next_sibling.before(text2);
      }
      set_hydrate_node(text2);
      return text2;
    }
    merge_text_nodes(
      /** @type {Text} */
      next_sibling
    );
  }
  set_hydrate_node(next_sibling);
  return next_sibling;
}
function clear_text_content(node) {
  node.textContent = "";
}
function should_defer_append() {
  if (!async_mode_flag)
    return false;
  if (eager_block_effects !== null)
    return false;
  var flags2 = (
    /** @type {Effect} */
    active_effect.f
  );
  return (flags2 & REACTION_RAN) !== 0;
}
function create_element(tag2, namespace, is2) {
  let options = is2 ? { is: is2 } : void 0;
  return (
    /** @type {T extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[T] : Element} */
    document.createElementNS(namespace != null ? namespace : NAMESPACE_HTML, tag2, options)
  );
}
function merge_text_nodes(text2) {
  if (
    /** @type {string} */
    text2.nodeValue.length < 65536
  ) {
    return;
  }
  let next2 = text2.nextSibling;
  while (next2 !== null && next2.nodeType === TEXT_NODE) {
    next2.remove();
    text2.nodeValue += /** @type {string} */
    next2.nodeValue;
    next2 = text2.nextSibling;
  }
}

// node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function without_reactive_context(fn) {
  var previous_reaction = active_reaction;
  var previous_effect = active_effect;
  set_active_reaction(null);
  set_active_effect(null);
  try {
    return fn();
  } finally {
    set_active_reaction(previous_reaction);
    set_active_effect(previous_effect);
  }
}

// node_modules/svelte/src/internal/client/reactivity/effects.js
function validate_effect(rune) {
  if (active_effect === null) {
    if (active_reaction === null) {
      effect_orphan(rune);
    }
    effect_in_unowned_derived();
  }
  if (is_destroying_effect) {
    effect_in_teardown(rune);
  }
}
function push_effect(effect2, parent_effect) {
  var parent_last = parent_effect.last;
  if (parent_last === null) {
    parent_effect.last = parent_effect.first = effect2;
  } else {
    parent_last.next = effect2;
    effect2.prev = parent_last;
    parent_effect.last = effect2;
  }
}
function create_effect(type, fn) {
  var _a5, _b3;
  var parent = active_effect;
  if (dev_fallback_default) {
    while (parent !== null && (parent.f & EAGER_EFFECT) !== 0) {
      parent = parent.parent;
    }
  }
  if (parent !== null && (parent.f & INERT) !== 0) {
    type |= INERT;
  }
  var effect2 = {
    ctx: component_context,
    deps: null,
    nodes: null,
    f: type | DIRTY | CONNECTED,
    first: null,
    fn,
    last: null,
    next: null,
    parent,
    b: parent && parent.b,
    prev: null,
    teardown: null,
    wv: 0,
    ac: null
  };
  if (dev_fallback_default) {
    effect2.component_function = dev_current_component_function;
  }
  (_a5 = current_batch) == null ? void 0 : _a5.register_created_effect(effect2);
  var e = effect2;
  if ((type & EFFECT) !== 0) {
    if (collected_effects !== null) {
      collected_effects.push(effect2);
    } else {
      Batch.ensure().schedule(effect2);
    }
  } else if (fn !== null) {
    try {
      update_effect(effect2);
    } catch (e2) {
      destroy_effect(effect2);
      throw e2;
    }
    if (e.deps === null && e.teardown === null && e.nodes === null && e.first === e.last && // either `null`, or a singular child
    (e.f & EFFECT_PRESERVED) === 0) {
      e = e.first;
      if ((type & BLOCK_EFFECT) !== 0 && (type & EFFECT_TRANSPARENT) !== 0 && e !== null) {
        e.f |= EFFECT_TRANSPARENT;
      }
    }
  }
  if (e !== null) {
    e.parent = parent;
    if (parent !== null) {
      push_effect(e, parent);
    }
    if (active_reaction !== null && (active_reaction.f & DERIVED) !== 0 && (type & ROOT_EFFECT) === 0) {
      var derived2 = (
        /** @type {Derived} */
        active_reaction
      );
      ((_b3 = derived2.effects) != null ? _b3 : derived2.effects = []).push(e);
    }
  }
  return effect2;
}
function effect_tracking() {
  return active_reaction !== null && !untracking;
}
function teardown(fn) {
  const effect2 = create_effect(RENDER_EFFECT, null);
  set_signal_status(effect2, CLEAN);
  effect2.teardown = fn;
  return effect2;
}
function user_effect(fn) {
  var _a5;
  validate_effect("$effect");
  if (dev_fallback_default) {
    define_property(fn, "name", {
      value: "$effect"
    });
  }
  var flags2 = (
    /** @type {Effect} */
    active_effect.f
  );
  var defer = !active_reaction && (flags2 & BRANCH_EFFECT) !== 0 && (flags2 & REACTION_RAN) === 0;
  if (defer) {
    var context = (
      /** @type {ComponentContext} */
      component_context
    );
    ((_a5 = context.e) != null ? _a5 : context.e = []).push(fn);
  } else {
    return create_user_effect(fn);
  }
}
function create_user_effect(fn) {
  return create_effect(EFFECT | USER_EFFECT, fn);
}
function effect_root(fn) {
  Batch.ensure();
  const effect2 = create_effect(ROOT_EFFECT | EFFECT_PRESERVED, fn);
  return () => {
    destroy_effect(effect2);
  };
}
function component_root(fn) {
  Batch.ensure();
  const effect2 = create_effect(ROOT_EFFECT | EFFECT_PRESERVED, fn);
  return (options = {}) => {
    return new Promise((fulfil) => {
      if (options.outro) {
        pause_effect(effect2, () => {
          destroy_effect(effect2);
          fulfil(void 0);
        });
      } else {
        destroy_effect(effect2);
        fulfil(void 0);
      }
    });
  };
}
function async_effect(fn) {
  return create_effect(ASYNC | EFFECT_PRESERVED, fn);
}
function render_effect(fn, flags2 = 0) {
  return create_effect(RENDER_EFFECT | flags2, fn);
}
function template_effect(fn, sync = [], async2 = [], blockers = []) {
  flatten(blockers, sync, async2, (values) => {
    create_effect(RENDER_EFFECT, () => fn(...values.map(get2)));
  });
}
function block(fn, flags2 = 0) {
  var effect2 = create_effect(BLOCK_EFFECT | flags2, fn);
  if (dev_fallback_default) {
    effect2.dev_stack = dev_stack;
  }
  return effect2;
}
function branch(fn) {
  return create_effect(BRANCH_EFFECT | EFFECT_PRESERVED, fn);
}
function execute_effect_teardown(effect2) {
  var teardown2 = effect2.teardown;
  if (teardown2 !== null) {
    const previously_destroying_effect = is_destroying_effect;
    const previous_reaction = active_reaction;
    set_is_destroying_effect(true);
    set_active_reaction(null);
    try {
      teardown2.call(null);
    } finally {
      set_is_destroying_effect(previously_destroying_effect);
      set_active_reaction(previous_reaction);
    }
  }
}
function destroy_effect_children(signal, remove_dom = false) {
  var effect2 = signal.first;
  signal.first = signal.last = null;
  while (effect2 !== null) {
    const controller = effect2.ac;
    if (controller !== null) {
      without_reactive_context(() => {
        controller.abort(STALE_REACTION);
      });
    }
    var next2 = effect2.next;
    if ((effect2.f & ROOT_EFFECT) !== 0) {
      effect2.parent = null;
    } else {
      destroy_effect(effect2, remove_dom);
    }
    effect2 = next2;
  }
}
function destroy_block_effect_children(signal) {
  var effect2 = signal.first;
  while (effect2 !== null) {
    var next2 = effect2.next;
    if ((effect2.f & BRANCH_EFFECT) === 0) {
      destroy_effect(effect2);
    }
    effect2 = next2;
  }
}
function destroy_effect(effect2, remove_dom = true) {
  var removed = false;
  if ((remove_dom || (effect2.f & HEAD_EFFECT) !== 0) && effect2.nodes !== null && effect2.nodes.end !== null) {
    remove_effect_dom(
      effect2.nodes.start,
      /** @type {TemplateNode} */
      effect2.nodes.end
    );
    removed = true;
  }
  set_signal_status(effect2, DESTROYING);
  destroy_effect_children(effect2, remove_dom && !removed);
  remove_reactions(effect2, 0);
  var transitions = effect2.nodes && effect2.nodes.t;
  if (transitions !== null) {
    for (const transition2 of transitions) {
      transition2.stop();
    }
  }
  execute_effect_teardown(effect2);
  effect2.f ^= DESTROYING;
  effect2.f |= DESTROYED;
  var parent = effect2.parent;
  if (parent !== null && parent.first !== null) {
    unlink_effect(effect2);
  }
  if (dev_fallback_default) {
    effect2.component_function = null;
  }
  effect2.next = effect2.prev = effect2.teardown = effect2.ctx = effect2.deps = effect2.fn = effect2.nodes = effect2.ac = effect2.b = null;
}
function remove_effect_dom(node, end) {
  while (node !== null) {
    var next2 = node === end ? null : get_next_sibling(node);
    node.remove();
    node = next2;
  }
}
function unlink_effect(effect2) {
  var parent = effect2.parent;
  var prev = effect2.prev;
  var next2 = effect2.next;
  if (prev !== null)
    prev.next = next2;
  if (next2 !== null)
    next2.prev = prev;
  if (parent !== null) {
    if (parent.first === effect2)
      parent.first = next2;
    if (parent.last === effect2)
      parent.last = prev;
  }
}
function pause_effect(effect2, callback, destroy = true) {
  var transitions = [];
  pause_children(effect2, transitions, true);
  var fn = () => {
    if (destroy)
      destroy_effect(effect2);
    if (callback)
      callback();
  };
  var remaining = transitions.length;
  if (remaining > 0) {
    var check = () => --remaining || fn();
    for (var transition2 of transitions) {
      transition2.out(check);
    }
  } else {
    fn();
  }
}
function pause_children(effect2, transitions, local) {
  if ((effect2.f & INERT) !== 0)
    return;
  effect2.f ^= INERT;
  var t = effect2.nodes && effect2.nodes.t;
  if (t !== null) {
    for (const transition2 of t) {
      if (transition2.is_global || local) {
        transitions.push(transition2);
      }
    }
  }
  var child2 = effect2.first;
  while (child2 !== null) {
    var sibling2 = child2.next;
    if ((child2.f & ROOT_EFFECT) === 0) {
      var transparent = (child2.f & EFFECT_TRANSPARENT) !== 0 || // If this is a branch effect without a block effect parent,
      // it means the parent block effect was pruned. In that case,
      // transparency information was transferred to the branch effect.
      (child2.f & BRANCH_EFFECT) !== 0 && (effect2.f & BLOCK_EFFECT) !== 0;
      pause_children(child2, transitions, transparent ? local : false);
    }
    child2 = sibling2;
  }
}
function resume_effect(effect2) {
  resume_children(effect2, true);
}
function resume_children(effect2, local) {
  if ((effect2.f & INERT) === 0)
    return;
  effect2.f ^= INERT;
  if ((effect2.f & CLEAN) === 0) {
    set_signal_status(effect2, DIRTY);
    Batch.ensure().schedule(effect2);
  }
  var child2 = effect2.first;
  while (child2 !== null) {
    var sibling2 = child2.next;
    var transparent = (child2.f & EFFECT_TRANSPARENT) !== 0 || (child2.f & BRANCH_EFFECT) !== 0;
    resume_children(child2, transparent ? local : false);
    child2 = sibling2;
  }
  var t = effect2.nodes && effect2.nodes.t;
  if (t !== null) {
    for (const transition2 of t) {
      if (transition2.is_global || local) {
        transition2.in();
      }
    }
  }
}
function move_effect(effect2, fragment) {
  if (!effect2.nodes)
    return;
  var node = effect2.nodes.start;
  var end = effect2.nodes.end;
  while (node !== null) {
    var next2 = node === end ? null : get_next_sibling(node);
    fragment.append(node);
    node = next2;
  }
}

// node_modules/svelte/src/internal/client/legacy.js
var captured_signals = null;

// node_modules/svelte/src/internal/client/runtime.js
var is_updating_effect = false;
var is_destroying_effect = false;
function set_is_destroying_effect(value) {
  is_destroying_effect = value;
}
var active_reaction = null;
var untracking = false;
function set_active_reaction(reaction) {
  active_reaction = reaction;
}
var active_effect = null;
function set_active_effect(effect2) {
  active_effect = effect2;
}
var current_sources = null;
function push_reaction_value(value) {
  if (active_reaction !== null && (!async_mode_flag || (active_reaction.f & DERIVED) !== 0)) {
    if (current_sources === null) {
      current_sources = [value];
    } else {
      current_sources.push(value);
    }
  }
}
var new_deps = null;
var skipped_deps = 0;
var untracked_writes = null;
function set_untracked_writes(value) {
  untracked_writes = value;
}
var write_version = 1;
var read_version = 0;
var update_version = read_version;
function set_update_version(value) {
  update_version = value;
}
function increment_write_version() {
  return ++write_version;
}
function is_dirty(reaction) {
  var flags2 = reaction.f;
  if ((flags2 & DIRTY) !== 0) {
    return true;
  }
  if (flags2 & DERIVED) {
    reaction.f &= ~WAS_MARKED;
  }
  if ((flags2 & MAYBE_DIRTY) !== 0) {
    var dependencies = (
      /** @type {Value[]} */
      reaction.deps
    );
    var length = dependencies.length;
    for (var i = 0; i < length; i++) {
      var dependency = dependencies[i];
      if (is_dirty(
        /** @type {Derived} */
        dependency
      )) {
        update_derived(
          /** @type {Derived} */
          dependency
        );
      }
      if (dependency.wv > reaction.wv) {
        return true;
      }
    }
    if ((flags2 & CONNECTED) !== 0 && // During time traveling we don't want to reset the status so that
    // traversal of the graph in the other batches still happens
    batch_values === null) {
      set_signal_status(reaction, CLEAN);
    }
  }
  return false;
}
function schedule_possible_effect_self_invalidation(signal, effect2, root7 = true) {
  var reactions = signal.reactions;
  if (reactions === null)
    return;
  if (!async_mode_flag && current_sources !== null && includes.call(current_sources, signal)) {
    return;
  }
  for (var i = 0; i < reactions.length; i++) {
    var reaction = reactions[i];
    if ((reaction.f & DERIVED) !== 0) {
      schedule_possible_effect_self_invalidation(
        /** @type {Derived} */
        reaction,
        effect2,
        false
      );
    } else if (effect2 === reaction) {
      if (root7) {
        set_signal_status(reaction, DIRTY);
      } else if ((reaction.f & CLEAN) !== 0) {
        set_signal_status(reaction, MAYBE_DIRTY);
      }
      schedule_effect(
        /** @type {Effect} */
        reaction
      );
    }
  }
}
function update_reaction(reaction) {
  var _a5, _b3, _c2;
  var previous_deps = new_deps;
  var previous_skipped_deps = skipped_deps;
  var previous_untracked_writes = untracked_writes;
  var previous_reaction = active_reaction;
  var previous_sources = current_sources;
  var previous_component_context = component_context;
  var previous_untracking = untracking;
  var previous_update_version = update_version;
  var flags2 = reaction.f;
  new_deps = /** @type {null | Value[]} */
  null;
  skipped_deps = 0;
  untracked_writes = null;
  active_reaction = (flags2 & (BRANCH_EFFECT | ROOT_EFFECT)) === 0 ? reaction : null;
  current_sources = null;
  set_component_context(reaction.ctx);
  untracking = false;
  update_version = ++read_version;
  if (reaction.ac !== null) {
    without_reactive_context(() => {
      reaction.ac.abort(STALE_REACTION);
    });
    reaction.ac = null;
  }
  try {
    reaction.f |= REACTION_IS_UPDATING;
    var fn = (
      /** @type {Function} */
      reaction.fn
    );
    var result = fn();
    reaction.f |= REACTION_RAN;
    var deps = reaction.deps;
    var is_fork = (_a5 = current_batch) == null ? void 0 : _a5.is_fork;
    if (new_deps !== null) {
      var i;
      if (!is_fork) {
        remove_reactions(reaction, skipped_deps);
      }
      if (deps !== null && skipped_deps > 0) {
        deps.length = skipped_deps + new_deps.length;
        for (i = 0; i < new_deps.length; i++) {
          deps[skipped_deps + i] = new_deps[i];
        }
      } else {
        reaction.deps = deps = new_deps;
      }
      if (effect_tracking() && (reaction.f & CONNECTED) !== 0) {
        for (i = skipped_deps; i < deps.length; i++) {
          ((_c2 = (_b3 = deps[i]).reactions) != null ? _c2 : _b3.reactions = []).push(reaction);
        }
      }
    } else if (!is_fork && deps !== null && skipped_deps < deps.length) {
      remove_reactions(reaction, skipped_deps);
      deps.length = skipped_deps;
    }
    if (is_runes() && untracked_writes !== null && !untracking && deps !== null && (reaction.f & (DERIVED | MAYBE_DIRTY | DIRTY)) === 0) {
      for (i = 0; i < /** @type {Source[]} */
      untracked_writes.length; i++) {
        schedule_possible_effect_self_invalidation(
          untracked_writes[i],
          /** @type {Effect} */
          reaction
        );
      }
    }
    if (previous_reaction !== null && previous_reaction !== reaction) {
      read_version++;
      if (previous_reaction.deps !== null) {
        for (let i2 = 0; i2 < previous_skipped_deps; i2 += 1) {
          previous_reaction.deps[i2].rv = read_version;
        }
      }
      if (previous_deps !== null) {
        for (const dep of previous_deps) {
          dep.rv = read_version;
        }
      }
      if (untracked_writes !== null) {
        if (previous_untracked_writes === null) {
          previous_untracked_writes = untracked_writes;
        } else {
          previous_untracked_writes.push(.../** @type {Source[]} */
          untracked_writes);
        }
      }
    }
    if ((reaction.f & ERROR_VALUE) !== 0) {
      reaction.f ^= ERROR_VALUE;
    }
    return result;
  } catch (error) {
    return handle_error(error);
  } finally {
    reaction.f ^= REACTION_IS_UPDATING;
    new_deps = previous_deps;
    skipped_deps = previous_skipped_deps;
    untracked_writes = previous_untracked_writes;
    active_reaction = previous_reaction;
    current_sources = previous_sources;
    set_component_context(previous_component_context);
    untracking = previous_untracking;
    update_version = previous_update_version;
  }
}
function remove_reaction(signal, dependency) {
  let reactions = dependency.reactions;
  if (reactions !== null) {
    var index2 = index_of.call(reactions, signal);
    if (index2 !== -1) {
      var new_length = reactions.length - 1;
      if (new_length === 0) {
        reactions = dependency.reactions = null;
      } else {
        reactions[index2] = reactions[new_length];
        reactions.pop();
      }
    }
  }
  if (reactions === null && (dependency.f & DERIVED) !== 0 && // Destroying a child effect while updating a parent effect can cause a dependency to appear
  // to be unused, when in fact it is used by the currently-updating parent. Checking `new_deps`
  // allows us to skip the expensive work of disconnecting and immediately reconnecting it
  (new_deps === null || !includes.call(new_deps, dependency))) {
    var derived2 = (
      /** @type {Derived} */
      dependency
    );
    if ((derived2.f & CONNECTED) !== 0) {
      derived2.f ^= CONNECTED;
      derived2.f &= ~WAS_MARKED;
    }
    if (derived2.v !== UNINITIALIZED) {
      update_derived_status(derived2);
    }
    freeze_derived_effects(derived2);
    remove_reactions(derived2, 0);
  }
}
function remove_reactions(signal, start_index) {
  var dependencies = signal.deps;
  if (dependencies === null)
    return;
  for (var i = start_index; i < dependencies.length; i++) {
    remove_reaction(signal, dependencies[i]);
  }
}
function update_effect(effect2) {
  var _a5;
  var flags2 = effect2.f;
  if ((flags2 & DESTROYED) !== 0) {
    return;
  }
  set_signal_status(effect2, CLEAN);
  var previous_effect = active_effect;
  var was_updating_effect = is_updating_effect;
  active_effect = effect2;
  is_updating_effect = true;
  if (dev_fallback_default) {
    var previous_component_fn = dev_current_component_function;
    set_dev_current_component_function(effect2.component_function);
    var previous_stack = (
      /** @type {any} */
      dev_stack
    );
    set_dev_stack((_a5 = effect2.dev_stack) != null ? _a5 : dev_stack);
  }
  try {
    if ((flags2 & (BLOCK_EFFECT | MANAGED_EFFECT)) !== 0) {
      destroy_block_effect_children(effect2);
    } else {
      destroy_effect_children(effect2);
    }
    execute_effect_teardown(effect2);
    var teardown2 = update_reaction(effect2);
    effect2.teardown = typeof teardown2 === "function" ? teardown2 : null;
    effect2.wv = write_version;
    if (dev_fallback_default && tracing_mode_flag && (effect2.f & DIRTY) !== 0 && effect2.deps !== null) {
      for (var dep of effect2.deps) {
        if (dep.set_during_effect) {
          dep.wv = increment_write_version();
          dep.set_during_effect = false;
        }
      }
    }
  } finally {
    is_updating_effect = was_updating_effect;
    active_effect = previous_effect;
    if (dev_fallback_default) {
      set_dev_current_component_function(previous_component_fn);
      set_dev_stack(previous_stack);
    }
  }
}
function get2(signal) {
  var _a5, _b3, _c2;
  var flags2 = signal.f;
  var is_derived = (flags2 & DERIVED) !== 0;
  (_a5 = captured_signals) == null ? void 0 : _a5.add(signal);
  if (active_reaction !== null && !untracking) {
    var destroyed = active_effect !== null && (active_effect.f & DESTROYED) !== 0;
    if (!destroyed && (current_sources === null || !includes.call(current_sources, signal))) {
      var deps = active_reaction.deps;
      if ((active_reaction.f & REACTION_IS_UPDATING) !== 0) {
        if (signal.rv < read_version) {
          signal.rv = read_version;
          if (new_deps === null && deps !== null && deps[skipped_deps] === signal) {
            skipped_deps++;
          } else if (new_deps === null) {
            new_deps = [signal];
          } else {
            new_deps.push(signal);
          }
        }
      } else {
        ((_b3 = active_reaction.deps) != null ? _b3 : active_reaction.deps = []).push(signal);
        var reactions = signal.reactions;
        if (reactions === null) {
          signal.reactions = [active_reaction];
        } else if (!includes.call(reactions, active_reaction)) {
          reactions.push(active_reaction);
        }
      }
    }
  }
  if (dev_fallback_default) {
    if (!untracking && reactivity_loss_tracker && !reactivity_loss_tracker.warned && (reactivity_loss_tracker.effect.f & REACTION_IS_UPDATING) === 0 && !reactivity_loss_tracker.effect_deps.has(signal)) {
      reactivity_loss_tracker.warned = true;
      await_reactivity_loss(
        /** @type {string} */
        signal.label
      );
      var trace2 = get_error("traced at");
      if (trace2)
        console.warn(trace2);
    }
    recent_async_deriveds.delete(signal);
    if (tracing_mode_flag && !untracking && tracing_expressions !== null && active_reaction !== null && tracing_expressions.reaction === active_reaction) {
      if (signal.trace) {
        signal.trace();
      } else {
        trace2 = get_error("traced at");
        if (trace2) {
          var entry = tracing_expressions.entries.get(signal);
          if (entry === void 0) {
            entry = { traces: [] };
            tracing_expressions.entries.set(signal, entry);
          }
          var last = entry.traces[entry.traces.length - 1];
          if (trace2.stack !== (last == null ? void 0 : last.stack)) {
            entry.traces.push(trace2);
          }
        }
      }
    }
  }
  if (is_destroying_effect && old_values.has(signal)) {
    return old_values.get(signal);
  }
  if (is_derived) {
    var derived2 = (
      /** @type {Derived} */
      signal
    );
    if (is_destroying_effect) {
      var value = derived2.v;
      if ((derived2.f & CLEAN) === 0 && derived2.reactions !== null || depends_on_old_values(derived2)) {
        value = execute_derived(derived2);
      }
      old_values.set(derived2, value);
      return value;
    }
    var should_connect = (derived2.f & CONNECTED) === 0 && !untracking && active_reaction !== null && (is_updating_effect || (active_reaction.f & CONNECTED) !== 0);
    var is_new = (derived2.f & REACTION_RAN) === 0;
    if (is_dirty(derived2)) {
      if (should_connect) {
        derived2.f |= CONNECTED;
      }
      update_derived(derived2);
    }
    if (should_connect && !is_new) {
      unfreeze_derived_effects(derived2);
      reconnect(derived2);
    }
  }
  if ((_c2 = batch_values) == null ? void 0 : _c2.has(signal)) {
    return batch_values.get(signal);
  }
  if ((signal.f & ERROR_VALUE) !== 0) {
    throw signal.v;
  }
  return signal.v;
}
function reconnect(derived2) {
  var _a5;
  derived2.f |= CONNECTED;
  if (derived2.deps === null)
    return;
  for (const dep of derived2.deps) {
    ((_a5 = dep.reactions) != null ? _a5 : dep.reactions = []).push(derived2);
    if ((dep.f & DERIVED) !== 0 && (dep.f & CONNECTED) === 0) {
      unfreeze_derived_effects(
        /** @type {Derived} */
        dep
      );
      reconnect(
        /** @type {Derived} */
        dep
      );
    }
  }
}
function depends_on_old_values(derived2) {
  if (derived2.v === UNINITIALIZED)
    return true;
  if (derived2.deps === null)
    return false;
  for (const dep of derived2.deps) {
    if (old_values.has(dep)) {
      return true;
    }
    if ((dep.f & DERIVED) !== 0 && depends_on_old_values(
      /** @type {Derived} */
      dep
    )) {
      return true;
    }
  }
  return false;
}
function untrack(fn) {
  var previous_untracking = untracking;
  try {
    untracking = true;
    return fn();
  } finally {
    untracking = previous_untracking;
  }
}

// node_modules/svelte/src/utils.js
var DOM_BOOLEAN_ATTRIBUTES = [
  "allowfullscreen",
  "async",
  "autofocus",
  "autoplay",
  "checked",
  "controls",
  "default",
  "disabled",
  "formnovalidate",
  "indeterminate",
  "inert",
  "ismap",
  "loop",
  "multiple",
  "muted",
  "nomodule",
  "novalidate",
  "open",
  "playsinline",
  "readonly",
  "required",
  "reversed",
  "seamless",
  "selected",
  "webkitdirectory",
  "defer",
  "disablepictureinpicture",
  "disableremoteplayback"
];
var DOM_PROPERTIES = [
  ...DOM_BOOLEAN_ATTRIBUTES,
  "formNoValidate",
  "isMap",
  "noModule",
  "playsInline",
  "readOnly",
  "value",
  "volume",
  "defaultValue",
  "defaultChecked",
  "srcObject",
  "noValidate",
  "allowFullscreen",
  "disablePictureInPicture",
  "disableRemotePlayback"
];
var PASSIVE_EVENTS = ["touchstart", "touchmove"];
function is_passive_event(name) {
  return PASSIVE_EVENTS.includes(name);
}
var STATE_CREATION_RUNES = (
  /** @type {const} */
  [
    "$state",
    "$state.raw",
    "$derived",
    "$derived.by"
  ]
);
var RUNES = (
  /** @type {const} */
  [
    ...STATE_CREATION_RUNES,
    "$state.eager",
    "$state.snapshot",
    "$props",
    "$props.id",
    "$bindable",
    "$effect",
    "$effect.pre",
    "$effect.tracking",
    "$effect.root",
    "$effect.pending",
    "$inspect",
    "$inspect().with",
    "$inspect.trace",
    "$host"
  ]
);

// node_modules/svelte/src/internal/client/dom/elements/events.js
var event_symbol = Symbol("events");
var all_registered_events = /* @__PURE__ */ new Set();
var root_event_handles = /* @__PURE__ */ new Set();
function create_event(event_name, dom, handler, options = {}) {
  function target_handler(event2) {
    if (!options.capture) {
      handle_event_propagation.call(dom, event2);
    }
    if (!event2.cancelBubble) {
      return without_reactive_context(() => {
        return handler == null ? void 0 : handler.call(this, event2);
      });
    }
  }
  if (event_name.startsWith("pointer") || event_name.startsWith("touch") || event_name === "wheel") {
    queue_micro_task(() => {
      dom.addEventListener(event_name, target_handler, options);
    });
  } else {
    dom.addEventListener(event_name, target_handler, options);
  }
  return target_handler;
}
function event(event_name, dom, handler, capture2, passive2) {
  var options = { capture: capture2, passive: passive2 };
  var target_handler = create_event(event_name, dom, handler, options);
  if (dom === document.body || // @ts-ignore
  dom === window || // @ts-ignore
  dom === document || // Firefox has quirky behavior, it can happen that we still get "canplay" events when the element is already removed
  dom instanceof HTMLMediaElement) {
    teardown(() => {
      dom.removeEventListener(event_name, target_handler, options);
    });
  }
}
function delegated(event_name, element2, handler) {
  var _a5;
  ((_a5 = element2[event_symbol]) != null ? _a5 : element2[event_symbol] = {})[event_name] = handler;
}
function delegate(events) {
  for (var i = 0; i < events.length; i++) {
    all_registered_events.add(events[i]);
  }
  for (var fn of root_event_handles) {
    fn(events);
  }
}
var last_propagated_event = null;
function handle_event_propagation(event2) {
  var _a5, _b3;
  var handler_element = this;
  var owner_document = (
    /** @type {Node} */
    handler_element.ownerDocument
  );
  var event_name = event2.type;
  var path = ((_a5 = event2.composedPath) == null ? void 0 : _a5.call(event2)) || [];
  var current_target = (
    /** @type {null | Element} */
    path[0] || event2.target
  );
  last_propagated_event = event2;
  var path_idx = 0;
  var handled_at = last_propagated_event === event2 && event2[event_symbol];
  if (handled_at) {
    var at_idx = path.indexOf(handled_at);
    if (at_idx !== -1 && (handler_element === document || handler_element === /** @type {any} */
    window)) {
      event2[event_symbol] = handler_element;
      return;
    }
    var handler_idx = path.indexOf(handler_element);
    if (handler_idx === -1) {
      return;
    }
    if (at_idx <= handler_idx) {
      path_idx = at_idx;
    }
  }
  current_target = /** @type {Element} */
  path[path_idx] || event2.target;
  if (current_target === handler_element)
    return;
  define_property(event2, "currentTarget", {
    configurable: true,
    get() {
      return current_target || owner_document;
    }
  });
  var previous_reaction = active_reaction;
  var previous_effect = active_effect;
  set_active_reaction(null);
  set_active_effect(null);
  try {
    var throw_error;
    var other_errors = [];
    while (current_target !== null) {
      var parent_element = current_target.assignedSlot || current_target.parentNode || /** @type {any} */
      current_target.host || null;
      try {
        var delegated2 = (_b3 = current_target[event_symbol]) == null ? void 0 : _b3[event_name];
        if (delegated2 != null && (!/** @type {any} */
        current_target.disabled || // DOM could've been updated already by the time this is reached, so we check this as well
        // -> the target could not have been disabled because it emits the event in the first place
        event2.target === current_target)) {
          delegated2.call(current_target, event2);
        }
      } catch (error) {
        if (throw_error) {
          other_errors.push(error);
        } else {
          throw_error = error;
        }
      }
      if (event2.cancelBubble || parent_element === handler_element || parent_element === null) {
        break;
      }
      current_target = parent_element;
    }
    if (throw_error) {
      for (let error of other_errors) {
        queueMicrotask(() => {
          throw error;
        });
      }
      throw throw_error;
    }
  } finally {
    event2[event_symbol] = handler_element;
    delete event2.currentTarget;
    set_active_reaction(previous_reaction);
    set_active_effect(previous_effect);
  }
}

// node_modules/svelte/src/internal/client/dom/reconciler.js
var _a3;
var policy = (
  // We gotta write it like this because after downleveling the pure comment may end up in the wrong location
  ((_a3 = globalThis == null ? void 0 : globalThis.window) == null ? void 0 : _a3.trustedTypes) && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", {
    /** @param {string} html */
    createHTML: (html2) => {
      return html2;
    }
  })
);
function create_trusted_html(html2) {
  var _a5;
  return (
    /** @type {string} */
    (_a5 = policy == null ? void 0 : policy.createHTML(html2)) != null ? _a5 : html2
  );
}
function create_fragment_from_html(html2) {
  var elem = create_element("template");
  elem.innerHTML = create_trusted_html(html2.replaceAll("<!>", "<!---->"));
  return elem.content;
}

// node_modules/svelte/src/internal/client/dom/template.js
function assign_nodes(start, end) {
  var effect2 = (
    /** @type {Effect} */
    active_effect
  );
  if (effect2.nodes === null) {
    effect2.nodes = { start, end, a: null, t: null };
  }
}
function from_html(content, flags2) {
  var is_fragment = (flags2 & TEMPLATE_FRAGMENT) !== 0;
  var use_import_node = (flags2 & TEMPLATE_USE_IMPORT_NODE) !== 0;
  var node;
  var has_start = !content.startsWith("<!>");
  return () => {
    if (hydrating) {
      assign_nodes(hydrate_node, null);
      return hydrate_node;
    }
    if (node === void 0) {
      node = create_fragment_from_html(has_start ? content : "<!>" + content);
      if (!is_fragment)
        node = /** @type {TemplateNode} */
        get_first_child(node);
    }
    var clone = (
      /** @type {TemplateNode} */
      use_import_node || is_firefox ? document.importNode(node, true) : node.cloneNode(true)
    );
    if (is_fragment) {
      var start = (
        /** @type {TemplateNode} */
        get_first_child(clone)
      );
      var end = (
        /** @type {TemplateNode} */
        clone.lastChild
      );
      assign_nodes(start, end);
    } else {
      assign_nodes(clone, clone);
    }
    return clone;
  };
}
function append(anchor, dom) {
  if (hydrating) {
    var effect2 = (
      /** @type {Effect & { nodes: EffectNodes }} */
      active_effect
    );
    if ((effect2.f & REACTION_RAN) === 0 || effect2.nodes.end === null) {
      effect2.nodes.end = hydrate_node;
    }
    hydrate_next();
    return;
  }
  if (anchor === null) {
    return;
  }
  anchor.before(
    /** @type {Node} */
    dom
  );
}

// node_modules/svelte/src/internal/client/render.js
var should_intro = true;
function set_text(text2, value) {
  var _a5;
  var str = value == null ? "" : typeof value === "object" ? `${value}` : value;
  if (str !== ((_a5 = text2.__t) != null ? _a5 : text2.__t = text2.nodeValue)) {
    text2.__t = str;
    text2.nodeValue = `${str}`;
  }
}
function mount(component2, options) {
  return _mount(component2, options);
}
function hydrate(component2, options) {
  var _a5;
  init_operations();
  options.intro = (_a5 = options.intro) != null ? _a5 : false;
  const target = options.target;
  const was_hydrating = hydrating;
  const previous_hydrate_node = hydrate_node;
  try {
    var anchor = get_first_child(target);
    while (anchor && (anchor.nodeType !== COMMENT_NODE || /** @type {Comment} */
    anchor.data !== HYDRATION_START)) {
      anchor = get_next_sibling(anchor);
    }
    if (!anchor) {
      throw HYDRATION_ERROR;
    }
    set_hydrating(true);
    set_hydrate_node(
      /** @type {Comment} */
      anchor
    );
    const instance = _mount(component2, { ...options, anchor });
    set_hydrating(false);
    return (
      /**  @type {Exports} */
      instance
    );
  } catch (error) {
    if (error instanceof Error && error.message.split("\n").some((line) => line.startsWith("https://svelte.dev/e/"))) {
      throw error;
    }
    if (error !== HYDRATION_ERROR) {
      console.warn("Failed to hydrate: ", error);
    }
    if (options.recover === false) {
      hydration_failed();
    }
    init_operations();
    clear_text_content(target);
    set_hydrating(false);
    return mount(component2, options);
  } finally {
    set_hydrating(was_hydrating);
    set_hydrate_node(previous_hydrate_node);
  }
}
var listeners = /* @__PURE__ */ new Map();
function _mount(Component, { target, anchor, props = {}, events, context, intro = true, transformError }) {
  init_operations();
  var component2 = void 0;
  var unmount2 = component_root(() => {
    var anchor_node = anchor != null ? anchor : target.appendChild(create_text());
    boundary(
      /** @type {TemplateNode} */
      anchor_node,
      {
        pending: () => {
        }
      },
      (anchor_node2) => {
        push({});
        var ctx = (
          /** @type {ComponentContext} */
          component_context
        );
        if (context)
          ctx.c = context;
        if (events) {
          props.$$events = events;
        }
        if (hydrating) {
          assign_nodes(
            /** @type {TemplateNode} */
            anchor_node2,
            null
          );
        }
        should_intro = intro;
        component2 = Component(anchor_node2, props) || {};
        should_intro = true;
        if (hydrating) {
          active_effect.nodes.end = hydrate_node;
          if (hydrate_node === null || hydrate_node.nodeType !== COMMENT_NODE || /** @type {Comment} */
          hydrate_node.data !== HYDRATION_END) {
            hydration_mismatch();
            throw HYDRATION_ERROR;
          }
        }
        pop();
      },
      transformError
    );
    var registered_events = /* @__PURE__ */ new Set();
    var event_handle = (events2) => {
      for (var i = 0; i < events2.length; i++) {
        var event_name = events2[i];
        if (registered_events.has(event_name))
          continue;
        registered_events.add(event_name);
        var passive2 = is_passive_event(event_name);
        for (const node of [target, document]) {
          var counts = listeners.get(node);
          if (counts === void 0) {
            counts = /* @__PURE__ */ new Map();
            listeners.set(node, counts);
          }
          var count = counts.get(event_name);
          if (count === void 0) {
            node.addEventListener(event_name, handle_event_propagation, { passive: passive2 });
            counts.set(event_name, 1);
          } else {
            counts.set(event_name, count + 1);
          }
        }
      }
    };
    event_handle(array_from(all_registered_events));
    root_event_handles.add(event_handle);
    return () => {
      var _a5;
      for (var event_name of registered_events) {
        for (const node of [target, document]) {
          var counts = (
            /** @type {Map<string, number>} */
            listeners.get(node)
          );
          var count = (
            /** @type {number} */
            counts.get(event_name)
          );
          if (--count == 0) {
            node.removeEventListener(event_name, handle_event_propagation);
            counts.delete(event_name);
            if (counts.size === 0) {
              listeners.delete(node);
            }
          } else {
            counts.set(event_name, count);
          }
        }
      }
      root_event_handles.delete(event_handle);
      if (anchor_node !== anchor) {
        (_a5 = anchor_node.parentNode) == null ? void 0 : _a5.removeChild(anchor_node);
      }
    };
  });
  mounted_components.set(component2, unmount2);
  return component2;
}
var mounted_components = /* @__PURE__ */ new WeakMap();
function unmount(component2, options) {
  const fn = mounted_components.get(component2);
  if (fn) {
    mounted_components.delete(component2);
    return fn(options);
  }
  if (dev_fallback_default) {
    if (STATE_SYMBOL in component2) {
      state_proxy_unmount();
    } else {
      lifecycle_double_unmount();
    }
  }
  return Promise.resolve();
}

// node_modules/svelte/src/internal/client/dom/blocks/branches.js
var _batches, _onscreen, _offscreen, _outroing, _transition, _commit2, _discard;
var BranchManager = class {
  /**
   * @param {TemplateNode} anchor
   * @param {boolean} transition
   */
  constructor(anchor, transition2 = true) {
    /** @type {TemplateNode} */
    __publicField(this, "anchor");
    /** @type {Map<Batch, Key>} */
    __privateAdd(this, _batches, /* @__PURE__ */ new Map());
    /**
     * Map of keys to effects that are currently rendered in the DOM.
     * These effects are visible and actively part of the document tree.
     * Example:
     * ```
     * {#if condition}
     * 	foo
     * {:else}
     * 	bar
     * {/if}
     * ```
     * Can result in the entries `true->Effect` and `false->Effect`
     * @type {Map<Key, Effect>}
     */
    __privateAdd(this, _onscreen, /* @__PURE__ */ new Map());
    /**
     * Similar to #onscreen with respect to the keys, but contains branches that are not yet
     * in the DOM, because their insertion is deferred.
     * @type {Map<Key, Branch>}
     */
    __privateAdd(this, _offscreen, /* @__PURE__ */ new Map());
    /**
     * Keys of effects that are currently outroing
     * @type {Set<Key>}
     */
    __privateAdd(this, _outroing, /* @__PURE__ */ new Set());
    /**
     * Whether to pause (i.e. outro) on change, or destroy immediately.
     * This is necessary for `<svelte:element>`
     */
    __privateAdd(this, _transition, true);
    /**
     * @param {Batch} batch
     */
    __privateAdd(this, _commit2, (batch) => {
      if (!__privateGet(this, _batches).has(batch))
        return;
      var key2 = (
        /** @type {Key} */
        __privateGet(this, _batches).get(batch)
      );
      var onscreen = __privateGet(this, _onscreen).get(key2);
      if (onscreen) {
        resume_effect(onscreen);
        __privateGet(this, _outroing).delete(key2);
      } else {
        var offscreen = __privateGet(this, _offscreen).get(key2);
        if (offscreen) {
          __privateGet(this, _onscreen).set(key2, offscreen.effect);
          __privateGet(this, _offscreen).delete(key2);
          if (dev_fallback_default) {
            offscreen.fragment.lastChild[HMR_ANCHOR] = this.anchor;
          }
          offscreen.fragment.lastChild.remove();
          this.anchor.before(offscreen.fragment);
          onscreen = offscreen.effect;
        }
      }
      for (const [b, k] of __privateGet(this, _batches)) {
        __privateGet(this, _batches).delete(b);
        if (b === batch) {
          break;
        }
        const offscreen2 = __privateGet(this, _offscreen).get(k);
        if (offscreen2) {
          destroy_effect(offscreen2.effect);
          __privateGet(this, _offscreen).delete(k);
        }
      }
      for (const [k, effect2] of __privateGet(this, _onscreen)) {
        if (k === key2 || __privateGet(this, _outroing).has(k))
          continue;
        const on_destroy = () => {
          const keys = Array.from(__privateGet(this, _batches).values());
          if (keys.includes(k)) {
            var fragment = document.createDocumentFragment();
            move_effect(effect2, fragment);
            fragment.append(create_text());
            __privateGet(this, _offscreen).set(k, { effect: effect2, fragment });
          } else {
            destroy_effect(effect2);
          }
          __privateGet(this, _outroing).delete(k);
          __privateGet(this, _onscreen).delete(k);
        };
        if (__privateGet(this, _transition) || !onscreen) {
          __privateGet(this, _outroing).add(k);
          pause_effect(effect2, on_destroy, false);
        } else {
          on_destroy();
        }
      }
    });
    /**
     * @param {Batch} batch
     */
    __privateAdd(this, _discard, (batch) => {
      __privateGet(this, _batches).delete(batch);
      const keys = Array.from(__privateGet(this, _batches).values());
      for (const [k, branch2] of __privateGet(this, _offscreen)) {
        if (!keys.includes(k)) {
          destroy_effect(branch2.effect);
          __privateGet(this, _offscreen).delete(k);
        }
      }
    });
    this.anchor = anchor;
    __privateSet(this, _transition, transition2);
  }
  /**
   *
   * @param {any} key
   * @param {null | ((target: TemplateNode) => void)} fn
   */
  ensure(key2, fn) {
    var batch = (
      /** @type {Batch} */
      current_batch
    );
    var defer = should_defer_append();
    if (fn && !__privateGet(this, _onscreen).has(key2) && !__privateGet(this, _offscreen).has(key2)) {
      if (defer) {
        var fragment = document.createDocumentFragment();
        var target = create_text();
        fragment.append(target);
        __privateGet(this, _offscreen).set(key2, {
          effect: branch(() => fn(target)),
          fragment
        });
      } else {
        __privateGet(this, _onscreen).set(
          key2,
          branch(() => fn(this.anchor))
        );
      }
    }
    __privateGet(this, _batches).set(batch, key2);
    if (defer) {
      for (const [k, effect2] of __privateGet(this, _onscreen)) {
        if (k === key2) {
          batch.unskip_effect(effect2);
        } else {
          batch.skip_effect(effect2);
        }
      }
      for (const [k, branch2] of __privateGet(this, _offscreen)) {
        if (k === key2) {
          batch.unskip_effect(branch2.effect);
        } else {
          batch.skip_effect(branch2.effect);
        }
      }
      batch.oncommit(__privateGet(this, _commit2));
      batch.ondiscard(__privateGet(this, _discard));
    } else {
      if (hydrating) {
        this.anchor = hydrate_node;
      }
      __privateGet(this, _commit2).call(this, batch);
    }
  }
};
_batches = new WeakMap();
_onscreen = new WeakMap();
_offscreen = new WeakMap();
_outroing = new WeakMap();
_transition = new WeakMap();
_commit2 = new WeakMap();
_discard = new WeakMap();

// node_modules/svelte/src/internal/client/dom/blocks/if.js
function if_block(node, fn, elseif = false) {
  var marker;
  if (hydrating) {
    marker = hydrate_node;
    hydrate_next();
  }
  var branches = new BranchManager(node);
  var flags2 = elseif ? EFFECT_TRANSPARENT : 0;
  function update_branch(key2, fn2) {
    if (hydrating) {
      var data = read_hydration_instruction(
        /** @type {TemplateNode} */
        marker
      );
      if (key2 !== parseInt(data.substring(1))) {
        var anchor = skip_nodes();
        set_hydrate_node(anchor);
        branches.anchor = anchor;
        set_hydrating(false);
        branches.ensure(key2, fn2);
        set_hydrating(true);
        return;
      }
    }
    branches.ensure(key2, fn2);
  }
  block(() => {
    var has_branch = false;
    fn((fn2, key2 = 0) => {
      has_branch = true;
      update_branch(key2, fn2);
    });
    if (!has_branch) {
      update_branch(-1, null);
    }
  }, flags2);
}

// node_modules/svelte/src/internal/client/dom/blocks/key.js
var NAN = Symbol("NaN");

// node_modules/svelte/src/internal/client/dom/blocks/each.js
function index(_, i) {
  return i;
}
function pause_effects(state2, to_destroy, controlled_anchor) {
  var _a5;
  var transitions = [];
  var length = to_destroy.length;
  var group;
  var remaining = to_destroy.length;
  for (var i = 0; i < length; i++) {
    let effect2 = to_destroy[i];
    pause_effect(
      effect2,
      () => {
        if (group) {
          group.pending.delete(effect2);
          group.done.add(effect2);
          if (group.pending.size === 0) {
            var groups = (
              /** @type {Set<EachOutroGroup>} */
              state2.outrogroups
            );
            destroy_effects(state2, array_from(group.done));
            groups.delete(group);
            if (groups.size === 0) {
              state2.outrogroups = null;
            }
          }
        } else {
          remaining -= 1;
        }
      },
      false
    );
  }
  if (remaining === 0) {
    var fast_path = transitions.length === 0 && controlled_anchor !== null;
    if (fast_path) {
      var anchor = (
        /** @type {Element} */
        controlled_anchor
      );
      var parent_node = (
        /** @type {Element} */
        anchor.parentNode
      );
      clear_text_content(parent_node);
      parent_node.append(anchor);
      state2.items.clear();
    }
    destroy_effects(state2, to_destroy, !fast_path);
  } else {
    group = {
      pending: new Set(to_destroy),
      done: /* @__PURE__ */ new Set()
    };
    ((_a5 = state2.outrogroups) != null ? _a5 : state2.outrogroups = /* @__PURE__ */ new Set()).add(group);
  }
}
function destroy_effects(state2, to_destroy, remove_dom = true) {
  var preserved_effects;
  if (state2.pending.size > 0) {
    preserved_effects = /* @__PURE__ */ new Set();
    for (const keys of state2.pending.values()) {
      for (const key2 of keys) {
        preserved_effects.add(
          /** @type {EachItem} */
          state2.items.get(key2).e
        );
      }
    }
  }
  for (var i = 0; i < to_destroy.length; i++) {
    var e = to_destroy[i];
    if (preserved_effects == null ? void 0 : preserved_effects.has(e)) {
      e.f |= EFFECT_OFFSCREEN;
      const fragment = document.createDocumentFragment();
      move_effect(e, fragment);
    } else {
      destroy_effect(to_destroy[i], remove_dom);
    }
  }
}
var offscreen_anchor;
function each(node, flags2, get_collection, get_key, render_fn2, fallback_fn = null) {
  var anchor = node;
  var items = /* @__PURE__ */ new Map();
  var is_controlled = (flags2 & EACH_IS_CONTROLLED) !== 0;
  if (is_controlled) {
    var parent_node = (
      /** @type {Element} */
      node
    );
    anchor = hydrating ? set_hydrate_node(get_first_child(parent_node)) : parent_node.appendChild(create_text());
  }
  if (hydrating) {
    hydrate_next();
  }
  var fallback2 = null;
  var each_array = derived_safe_equal(() => {
    var collection = get_collection();
    return is_array(collection) ? collection : collection == null ? [] : array_from(collection);
  });
  if (dev_fallback_default) {
    tag(each_array, "{#each ...}");
  }
  var array;
  var pending2 = /* @__PURE__ */ new Map();
  var first_run = true;
  function commit(batch) {
    if ((state2.effect.f & DESTROYED) !== 0) {
      return;
    }
    state2.pending.delete(batch);
    state2.fallback = fallback2;
    reconcile(state2, array, anchor, flags2, get_key);
    if (fallback2 !== null) {
      if (array.length === 0) {
        if ((fallback2.f & EFFECT_OFFSCREEN) === 0) {
          resume_effect(fallback2);
        } else {
          fallback2.f ^= EFFECT_OFFSCREEN;
          move(fallback2, null, anchor);
        }
      } else {
        pause_effect(fallback2, () => {
          fallback2 = null;
        });
      }
    }
  }
  function discard(batch) {
    state2.pending.delete(batch);
  }
  var effect2 = block(() => {
    array = /** @type {V[]} */
    get2(each_array);
    var length = array.length;
    let mismatch = false;
    if (hydrating) {
      var is_else = read_hydration_instruction(anchor) === HYDRATION_START_ELSE;
      if (is_else !== (length === 0)) {
        anchor = skip_nodes();
        set_hydrate_node(anchor);
        set_hydrating(false);
        mismatch = true;
      }
    }
    var keys = /* @__PURE__ */ new Set();
    var batch = (
      /** @type {Batch} */
      current_batch
    );
    var defer = should_defer_append();
    for (var index2 = 0; index2 < length; index2 += 1) {
      if (hydrating && hydrate_node.nodeType === COMMENT_NODE && /** @type {Comment} */
      hydrate_node.data === HYDRATION_END) {
        anchor = /** @type {Comment} */
        hydrate_node;
        mismatch = true;
        set_hydrating(false);
      }
      var value = array[index2];
      var key2 = get_key(value, index2);
      if (dev_fallback_default) {
        var key_again = get_key(value, index2);
        if (key2 !== key_again) {
          each_key_volatile(String(index2), String(key2), String(key_again));
        }
      }
      var item = first_run ? null : items.get(key2);
      if (item) {
        if (item.v)
          internal_set(item.v, value);
        if (item.i)
          internal_set(item.i, index2);
        if (defer) {
          batch.unskip_effect(item.e);
        }
      } else {
        item = create_item(
          items,
          first_run ? anchor : offscreen_anchor != null ? offscreen_anchor : offscreen_anchor = create_text(),
          value,
          key2,
          index2,
          render_fn2,
          flags2,
          get_collection
        );
        if (!first_run) {
          item.e.f |= EFFECT_OFFSCREEN;
        }
        items.set(key2, item);
      }
      keys.add(key2);
    }
    if (length === 0 && fallback_fn && !fallback2) {
      if (first_run) {
        fallback2 = branch(() => fallback_fn(anchor));
      } else {
        fallback2 = branch(() => fallback_fn(offscreen_anchor != null ? offscreen_anchor : offscreen_anchor = create_text()));
        fallback2.f |= EFFECT_OFFSCREEN;
      }
    }
    if (length > keys.size) {
      if (dev_fallback_default) {
        validate_each_keys(array, get_key);
      } else {
        each_key_duplicate("", "", "");
      }
    }
    if (hydrating && length > 0) {
      set_hydrate_node(skip_nodes());
    }
    if (!first_run) {
      pending2.set(batch, keys);
      if (defer) {
        for (const [key3, item2] of items) {
          if (!keys.has(key3)) {
            batch.skip_effect(item2.e);
          }
        }
        batch.oncommit(commit);
        batch.ondiscard(discard);
      } else {
        commit(batch);
      }
    }
    if (mismatch) {
      set_hydrating(true);
    }
    get2(each_array);
  });
  var state2 = { effect: effect2, flags: flags2, items, pending: pending2, outrogroups: null, fallback: fallback2 };
  first_run = false;
  if (hydrating) {
    anchor = hydrate_node;
  }
}
function skip_to_branch(effect2) {
  while (effect2 !== null && (effect2.f & BRANCH_EFFECT) === 0) {
    effect2 = effect2.next;
  }
  return effect2;
}
function reconcile(state2, array, anchor, flags2, get_key) {
  var _a5, _b3, _c2, _d, _e, _f, _g, _h, _i;
  var is_animated = (flags2 & EACH_IS_ANIMATED) !== 0;
  var length = array.length;
  var items = state2.items;
  var current2 = skip_to_branch(state2.effect.first);
  var seen;
  var prev = null;
  var to_animate;
  var matched = [];
  var stashed = [];
  var value;
  var key2;
  var effect2;
  var i;
  if (is_animated) {
    for (i = 0; i < length; i += 1) {
      value = array[i];
      key2 = get_key(value, i);
      effect2 = /** @type {EachItem} */
      items.get(key2).e;
      if ((effect2.f & EFFECT_OFFSCREEN) === 0) {
        (_b3 = (_a5 = effect2.nodes) == null ? void 0 : _a5.a) == null ? void 0 : _b3.measure();
        (to_animate != null ? to_animate : to_animate = /* @__PURE__ */ new Set()).add(effect2);
      }
    }
  }
  for (i = 0; i < length; i += 1) {
    value = array[i];
    key2 = get_key(value, i);
    effect2 = /** @type {EachItem} */
    items.get(key2).e;
    if (state2.outrogroups !== null) {
      for (const group of state2.outrogroups) {
        group.pending.delete(effect2);
        group.done.delete(effect2);
      }
    }
    if ((effect2.f & INERT) !== 0) {
      resume_effect(effect2);
      if (is_animated) {
        (_d = (_c2 = effect2.nodes) == null ? void 0 : _c2.a) == null ? void 0 : _d.unfix();
        (to_animate != null ? to_animate : to_animate = /* @__PURE__ */ new Set()).delete(effect2);
      }
    }
    if ((effect2.f & EFFECT_OFFSCREEN) !== 0) {
      effect2.f ^= EFFECT_OFFSCREEN;
      if (effect2 === current2) {
        move(effect2, null, anchor);
      } else {
        var next2 = prev ? prev.next : current2;
        if (effect2 === state2.effect.last) {
          state2.effect.last = effect2.prev;
        }
        if (effect2.prev)
          effect2.prev.next = effect2.next;
        if (effect2.next)
          effect2.next.prev = effect2.prev;
        link(state2, prev, effect2);
        link(state2, effect2, next2);
        move(effect2, next2, anchor);
        prev = effect2;
        matched = [];
        stashed = [];
        current2 = skip_to_branch(prev.next);
        continue;
      }
    }
    if (effect2 !== current2) {
      if (seen !== void 0 && seen.has(effect2)) {
        if (matched.length < stashed.length) {
          var start = stashed[0];
          var j;
          prev = start.prev;
          var a = matched[0];
          var b = matched[matched.length - 1];
          for (j = 0; j < matched.length; j += 1) {
            move(matched[j], start, anchor);
          }
          for (j = 0; j < stashed.length; j += 1) {
            seen.delete(stashed[j]);
          }
          link(state2, a.prev, b.next);
          link(state2, prev, a);
          link(state2, b, start);
          current2 = start;
          prev = b;
          i -= 1;
          matched = [];
          stashed = [];
        } else {
          seen.delete(effect2);
          move(effect2, current2, anchor);
          link(state2, effect2.prev, effect2.next);
          link(state2, effect2, prev === null ? state2.effect.first : prev.next);
          link(state2, prev, effect2);
          prev = effect2;
        }
        continue;
      }
      matched = [];
      stashed = [];
      while (current2 !== null && current2 !== effect2) {
        (seen != null ? seen : seen = /* @__PURE__ */ new Set()).add(current2);
        stashed.push(current2);
        current2 = skip_to_branch(current2.next);
      }
      if (current2 === null) {
        continue;
      }
    }
    if ((effect2.f & EFFECT_OFFSCREEN) === 0) {
      matched.push(effect2);
    }
    prev = effect2;
    current2 = skip_to_branch(effect2.next);
  }
  if (state2.outrogroups !== null) {
    for (const group of state2.outrogroups) {
      if (group.pending.size === 0) {
        destroy_effects(state2, array_from(group.done));
        (_e = state2.outrogroups) == null ? void 0 : _e.delete(group);
      }
    }
    if (state2.outrogroups.size === 0) {
      state2.outrogroups = null;
    }
  }
  if (current2 !== null || seen !== void 0) {
    var to_destroy = [];
    if (seen !== void 0) {
      for (effect2 of seen) {
        if ((effect2.f & INERT) === 0) {
          to_destroy.push(effect2);
        }
      }
    }
    while (current2 !== null) {
      if ((current2.f & INERT) === 0 && current2 !== state2.fallback) {
        to_destroy.push(current2);
      }
      current2 = skip_to_branch(current2.next);
    }
    var destroy_length = to_destroy.length;
    if (destroy_length > 0) {
      var controlled_anchor = (flags2 & EACH_IS_CONTROLLED) !== 0 && length === 0 ? anchor : null;
      if (is_animated) {
        for (i = 0; i < destroy_length; i += 1) {
          (_g = (_f = to_destroy[i].nodes) == null ? void 0 : _f.a) == null ? void 0 : _g.measure();
        }
        for (i = 0; i < destroy_length; i += 1) {
          (_i = (_h = to_destroy[i].nodes) == null ? void 0 : _h.a) == null ? void 0 : _i.fix();
        }
      }
      pause_effects(state2, to_destroy, controlled_anchor);
    }
  }
  if (is_animated) {
    queue_micro_task(() => {
      var _a6, _b4;
      if (to_animate === void 0)
        return;
      for (effect2 of to_animate) {
        (_b4 = (_a6 = effect2.nodes) == null ? void 0 : _a6.a) == null ? void 0 : _b4.apply();
      }
    });
  }
}
function create_item(items, anchor, value, key2, index2, render_fn2, flags2, get_collection) {
  var v = (flags2 & EACH_ITEM_REACTIVE) !== 0 ? (flags2 & EACH_ITEM_IMMUTABLE) === 0 ? mutable_source(value, false, false) : source(value) : null;
  var i = (flags2 & EACH_INDEX_REACTIVE) !== 0 ? source(index2) : null;
  if (dev_fallback_default && v) {
    v.trace = () => {
      var _a5;
      get_collection()[(_a5 = i == null ? void 0 : i.v) != null ? _a5 : index2];
    };
  }
  return {
    v,
    i,
    e: branch(() => {
      render_fn2(anchor, v != null ? v : value, i != null ? i : index2, get_collection);
      return () => {
        items.delete(key2);
      };
    })
  };
}
function move(effect2, next2, anchor) {
  if (!effect2.nodes)
    return;
  var node = effect2.nodes.start;
  var end = effect2.nodes.end;
  var dest = next2 && (next2.f & EFFECT_OFFSCREEN) === 0 ? (
    /** @type {EffectNodes} */
    next2.nodes.start
  ) : anchor;
  while (node !== null) {
    var next_node = (
      /** @type {TemplateNode} */
      get_next_sibling(node)
    );
    dest.before(node);
    if (node === end) {
      return;
    }
    node = next_node;
  }
}
function link(state2, prev, next2) {
  if (prev === null) {
    state2.effect.first = next2;
  } else {
    prev.next = next2;
  }
  if (next2 === null) {
    state2.effect.last = prev;
  } else {
    next2.prev = prev;
  }
}
function validate_each_keys(array, key_fn) {
  const keys = /* @__PURE__ */ new Map();
  const length = array.length;
  for (let i = 0; i < length; i++) {
    const key2 = key_fn(array[i], i);
    if (keys.has(key2)) {
      const a = String(keys.get(key2));
      const b = String(i);
      let k = String(key2);
      if (k.startsWith("[object "))
        k = null;
      each_key_duplicate(a, b, k);
    }
    keys.set(key2, i);
  }
}

// node_modules/svelte/src/internal/shared/attributes.js
var whitespace = [..." 	\n\r\f\xA0\v\uFEFF"];
function to_class(value, hash2, directives) {
  var classname = value == null ? "" : "" + value;
  if (hash2) {
    classname = classname ? classname + " " + hash2 : hash2;
  }
  if (directives) {
    for (var key2 of Object.keys(directives)) {
      if (directives[key2]) {
        classname = classname ? classname + " " + key2 : key2;
      } else if (classname.length) {
        var len = key2.length;
        var a = 0;
        while ((a = classname.indexOf(key2, a)) >= 0) {
          var b = a + len;
          if ((a === 0 || whitespace.includes(classname[a - 1])) && (b === classname.length || whitespace.includes(classname[b]))) {
            classname = (a === 0 ? "" : classname.substring(0, a)) + classname.substring(b + 1);
          } else {
            a = b;
          }
        }
      }
    }
  }
  return classname === "" ? null : classname;
}
function append_styles(styles, important = false) {
  var separator = important ? " !important;" : ";";
  var css = "";
  for (var key2 of Object.keys(styles)) {
    var value = styles[key2];
    if (value != null && value !== "") {
      css += " " + key2 + ": " + value + separator;
    }
  }
  return css;
}
function to_css_name(name) {
  if (name[0] !== "-" || name[1] !== "-") {
    return name.toLowerCase();
  }
  return name;
}
function to_style(value, styles) {
  if (styles) {
    var new_style = "";
    var normal_styles;
    var important_styles;
    if (Array.isArray(styles)) {
      normal_styles = styles[0];
      important_styles = styles[1];
    } else {
      normal_styles = styles;
    }
    if (value) {
      value = String(value).replaceAll(/\s*\/\*.*?\*\/\s*/g, "").trim();
      var in_str = false;
      var in_apo = 0;
      var in_comment = false;
      var reserved_names = [];
      if (normal_styles) {
        reserved_names.push(...Object.keys(normal_styles).map(to_css_name));
      }
      if (important_styles) {
        reserved_names.push(...Object.keys(important_styles).map(to_css_name));
      }
      var start_index = 0;
      var name_index = -1;
      const len = value.length;
      for (var i = 0; i < len; i++) {
        var c = value[i];
        if (in_comment) {
          if (c === "/" && value[i - 1] === "*") {
            in_comment = false;
          }
        } else if (in_str) {
          if (in_str === c) {
            in_str = false;
          }
        } else if (c === "/" && value[i + 1] === "*") {
          in_comment = true;
        } else if (c === '"' || c === "'") {
          in_str = c;
        } else if (c === "(") {
          in_apo++;
        } else if (c === ")") {
          in_apo--;
        }
        if (!in_comment && in_str === false && in_apo === 0) {
          if (c === ":" && name_index === -1) {
            name_index = i;
          } else if (c === ";" || i === len - 1) {
            if (name_index !== -1) {
              var name = to_css_name(value.substring(start_index, name_index).trim());
              if (!reserved_names.includes(name)) {
                if (c !== ";") {
                  i++;
                }
                var property = value.substring(start_index, i).trim();
                new_style += " " + property + ";";
              }
            }
            start_index = i + 1;
            name_index = -1;
          }
        }
      }
    }
    if (normal_styles) {
      new_style += append_styles(normal_styles);
    }
    if (important_styles) {
      new_style += append_styles(important_styles, true);
    }
    new_style = new_style.trim();
    return new_style === "" ? null : new_style;
  }
  return value == null ? null : String(value);
}

// node_modules/svelte/src/internal/client/dom/elements/class.js
function set_class(dom, is_html, value, hash2, prev_classes, next_classes) {
  var prev = dom.__className;
  if (hydrating || prev !== value || prev === void 0) {
    var next_class_name = to_class(value, hash2, next_classes);
    if (!hydrating || next_class_name !== dom.getAttribute("class")) {
      if (next_class_name == null) {
        dom.removeAttribute("class");
      } else if (is_html) {
        dom.className = next_class_name;
      } else {
        dom.setAttribute("class", next_class_name);
      }
    }
    dom.__className = value;
  } else if (next_classes && prev_classes !== next_classes) {
    for (var key2 in next_classes) {
      var is_present = !!next_classes[key2];
      if (prev_classes == null || is_present !== !!prev_classes[key2]) {
        dom.classList.toggle(key2, is_present);
      }
    }
  }
  return next_classes;
}

// node_modules/svelte/src/internal/client/dom/elements/style.js
function update_styles(dom, prev = {}, next2, priority) {
  for (var key2 in next2) {
    var value = next2[key2];
    if (prev[key2] !== value) {
      if (next2[key2] == null) {
        dom.style.removeProperty(key2);
      } else {
        dom.style.setProperty(key2, value, priority);
      }
    }
  }
}
function set_style(dom, value, prev_styles, next_styles) {
  var prev = dom.__style;
  if (hydrating || prev !== value) {
    var next_style_attr = to_style(value, next_styles);
    if (!hydrating || next_style_attr !== dom.getAttribute("style")) {
      if (next_style_attr == null) {
        dom.removeAttribute("style");
      } else {
        dom.style.cssText = next_style_attr;
      }
    }
    dom.__style = value;
  } else if (next_styles) {
    if (Array.isArray(next_styles)) {
      update_styles(dom, prev_styles == null ? void 0 : prev_styles[0], next_styles[0]);
      update_styles(dom, prev_styles == null ? void 0 : prev_styles[1], next_styles[1], "important");
    } else {
      update_styles(dom, prev_styles, next_styles);
    }
  }
  return next_styles;
}

// node_modules/svelte/src/internal/client/dom/elements/attributes.js
var CLASS = Symbol("class");
var STYLE = Symbol("style");
var IS_CUSTOM_ELEMENT = Symbol("is custom element");
var IS_HTML = Symbol("is html");
var LINK_TAG = IS_XHTML ? "link" : "LINK";
function set_attribute2(element2, attribute, value, skip_warning) {
  var attributes = get_attributes(element2);
  if (hydrating) {
    attributes[attribute] = element2.getAttribute(attribute);
    if (attribute === "src" || attribute === "srcset" || attribute === "href" && element2.nodeName === LINK_TAG) {
      if (!skip_warning) {
        check_src_in_dev_hydration(element2, attribute, value != null ? value : "");
      }
      return;
    }
  }
  if (attributes[attribute] === (attributes[attribute] = value))
    return;
  if (attribute === "loading") {
    element2[LOADING_ATTR_SYMBOL] = value;
  }
  if (value == null) {
    element2.removeAttribute(attribute);
  } else if (typeof value !== "string" && get_setters(element2).includes(attribute)) {
    element2[attribute] = value;
  } else {
    element2.setAttribute(attribute, value);
  }
}
function get_attributes(element2) {
  var _a5;
  return (
    /** @type {Record<string | symbol, unknown>} **/
    // @ts-expect-error
    (_a5 = element2.__attributes) != null ? _a5 : element2.__attributes = {
      [IS_CUSTOM_ELEMENT]: element2.nodeName.includes("-"),
      [IS_HTML]: element2.namespaceURI === NAMESPACE_HTML
    }
  );
}
var setters_cache = /* @__PURE__ */ new Map();
function get_setters(element2) {
  var cache_key = element2.getAttribute("is") || element2.nodeName;
  var setters = setters_cache.get(cache_key);
  if (setters)
    return setters;
  setters_cache.set(cache_key, setters = []);
  var descriptors;
  var proto = element2;
  var element_proto = Element.prototype;
  while (element_proto !== proto) {
    descriptors = get_descriptors(proto);
    for (var key2 in descriptors) {
      if (descriptors[key2].set) {
        setters.push(key2);
      }
    }
    proto = get_prototype_of(proto);
  }
  return setters;
}
function check_src_in_dev_hydration(element2, attribute, value) {
  var _a5;
  if (!dev_fallback_default)
    return;
  if (attribute === "srcset" && srcset_url_equal(element2, value))
    return;
  if (src_url_equal((_a5 = element2.getAttribute(attribute)) != null ? _a5 : "", value))
    return;
  hydration_attribute_changed(
    attribute,
    element2.outerHTML.replace(element2.innerHTML, element2.innerHTML && "..."),
    String(value)
  );
}
function src_url_equal(element_src, url) {
  if (element_src === url)
    return true;
  return new URL(element_src, document.baseURI).href === new URL(url, document.baseURI).href;
}
function split_srcset(srcset) {
  return srcset.split(",").map((src) => src.trim().split(" ").filter(Boolean));
}
function srcset_url_equal(element2, srcset) {
  var element_urls = split_srcset(element2.srcset);
  var urls = split_srcset(srcset);
  return urls.length === element_urls.length && urls.every(
    ([url, width], i) => width === element_urls[i][1] && // We need to test both ways because Vite will create an a full URL with
    // `new URL(asset, import.meta.url).href` for the client when `base: './'`, and the
    // relative URLs inside srcset are not automatically resolved to absolute URLs by
    // browsers (in contrast to img.src). This means both SSR and DOM code could
    // contain relative or absolute URLs.
    (src_url_equal(element_urls[i][0], url) || src_url_equal(url, element_urls[i][0]))
  );
}

// node_modules/svelte/src/internal/client/dom/elements/bindings/size.js
var _listeners, _observer, _options, _getObserver, getObserver_fn;
var _ResizeObserverSingleton = class {
  /** @param {ResizeObserverOptions} options */
  constructor(options) {
    __privateAdd(this, _getObserver);
    /** */
    __privateAdd(this, _listeners, /* @__PURE__ */ new WeakMap());
    /** @type {ResizeObserver | undefined} */
    __privateAdd(this, _observer, void 0);
    /** @type {ResizeObserverOptions} */
    __privateAdd(this, _options, void 0);
    __privateSet(this, _options, options);
  }
  /**
   * @param {Element} element
   * @param {(entry: ResizeObserverEntry) => any} listener
   */
  observe(element2, listener) {
    var listeners2 = __privateGet(this, _listeners).get(element2) || /* @__PURE__ */ new Set();
    listeners2.add(listener);
    __privateGet(this, _listeners).set(element2, listeners2);
    __privateMethod(this, _getObserver, getObserver_fn).call(this).observe(element2, __privateGet(this, _options));
    return () => {
      var listeners3 = __privateGet(this, _listeners).get(element2);
      listeners3.delete(listener);
      if (listeners3.size === 0) {
        __privateGet(this, _listeners).delete(element2);
        __privateGet(this, _observer).unobserve(element2);
      }
    };
  }
};
var ResizeObserverSingleton = _ResizeObserverSingleton;
_listeners = new WeakMap();
_observer = new WeakMap();
_options = new WeakMap();
_getObserver = new WeakSet();
getObserver_fn = function() {
  var _a5;
  return (_a5 = __privateGet(this, _observer)) != null ? _a5 : __privateSet(this, _observer, new ResizeObserver(
    /** @param {any} entries */
    (entries) => {
      for (var entry of entries) {
        _ResizeObserverSingleton.entries.set(entry.target, entry);
        for (var listener of __privateGet(this, _listeners).get(entry.target) || []) {
          listener(entry);
        }
      }
    }
  ));
};
/** @static */
__publicField(ResizeObserverSingleton, "entries", /* @__PURE__ */ new WeakMap());

// node_modules/svelte/src/internal/client/reactivity/props.js
function prop(props, key2, flags2, fallback2) {
  var _a5, _b3;
  var runes = !legacy_mode_flag || (flags2 & PROPS_IS_RUNES) !== 0;
  var bindable = (flags2 & PROPS_IS_BINDABLE) !== 0;
  var lazy = (flags2 & PROPS_IS_LAZY_INITIAL) !== 0;
  var fallback_value = (
    /** @type {V} */
    fallback2
  );
  var fallback_dirty = true;
  var get_fallback = () => {
    if (fallback_dirty) {
      fallback_dirty = false;
      fallback_value = lazy ? untrack(
        /** @type {() => V} */
        fallback2
      ) : (
        /** @type {V} */
        fallback2
      );
    }
    return fallback_value;
  };
  let setter;
  if (bindable) {
    var is_entry_props = STATE_SYMBOL in props || LEGACY_PROPS in props;
    setter = (_b3 = (_a5 = get_descriptor(props, key2)) == null ? void 0 : _a5.set) != null ? _b3 : is_entry_props && key2 in props ? (v) => props[key2] = v : void 0;
  }
  var initial_value;
  var is_store_sub = false;
  if (bindable) {
    [initial_value, is_store_sub] = capture_store_binding(() => (
      /** @type {V} */
      props[key2]
    ));
  } else {
    initial_value = /** @type {V} */
    props[key2];
  }
  if (initial_value === void 0 && fallback2 !== void 0) {
    initial_value = get_fallback();
    if (setter) {
      if (runes)
        props_invalid_value(key2);
      setter(initial_value);
    }
  }
  var getter;
  if (runes) {
    getter = () => {
      var value = (
        /** @type {V} */
        props[key2]
      );
      if (value === void 0)
        return get_fallback();
      fallback_dirty = true;
      return value;
    };
  } else {
    getter = () => {
      var value = (
        /** @type {V} */
        props[key2]
      );
      if (value !== void 0) {
        fallback_value = /** @type {V} */
        void 0;
      }
      return value === void 0 ? fallback_value : value;
    };
  }
  if (runes && (flags2 & PROPS_IS_UPDATED) === 0) {
    return getter;
  }
  if (setter) {
    var legacy_parent = props.$$legacy;
    return (
      /** @type {() => V} */
      function(value, mutation) {
        if (arguments.length > 0) {
          if (!runes || !mutation || legacy_parent || is_store_sub) {
            setter(mutation ? getter() : value);
          }
          return value;
        }
        return getter();
      }
    );
  }
  var overridden = false;
  var d = ((flags2 & PROPS_IS_IMMUTABLE) !== 0 ? derived : derived_safe_equal)(() => {
    overridden = false;
    return getter();
  });
  if (dev_fallback_default) {
    d.label = key2;
  }
  if (bindable)
    get2(d);
  var parent_effect = (
    /** @type {Effect} */
    active_effect
  );
  return (
    /** @type {() => V} */
    function(value, mutation) {
      if (arguments.length > 0) {
        const new_value = mutation ? get2(d) : runes && bindable ? proxy(value) : value;
        set(d, new_value);
        overridden = true;
        if (fallback_value !== void 0) {
          fallback_value = new_value;
        }
        return value;
      }
      if (is_destroying_effect && overridden || (parent_effect.f & DESTROYED) !== 0) {
        return d.v;
      }
      return get2(d);
    }
  );
}

// node_modules/svelte/src/legacy/legacy-client.js
function createClassComponent(options) {
  return new Svelte4Component(options);
}
var _events, _instance;
var Svelte4Component = class {
  /**
   * @param {ComponentConstructorOptions & {
   *  component: any;
   * }} options
   */
  constructor(options) {
    /** @type {any} */
    __privateAdd(this, _events, void 0);
    /** @type {Record<string, any>} */
    __privateAdd(this, _instance, void 0);
    var _a5, _b3;
    var sources = /* @__PURE__ */ new Map();
    var add_source = (key2, value) => {
      var s = mutable_source(value, false, false);
      sources.set(key2, s);
      return s;
    };
    const props = new Proxy(
      { ...options.props || {}, $$events: {} },
      {
        get(target, prop2) {
          var _a6;
          return get2((_a6 = sources.get(prop2)) != null ? _a6 : add_source(prop2, Reflect.get(target, prop2)));
        },
        has(target, prop2) {
          var _a6;
          if (prop2 === LEGACY_PROPS)
            return true;
          get2((_a6 = sources.get(prop2)) != null ? _a6 : add_source(prop2, Reflect.get(target, prop2)));
          return Reflect.has(target, prop2);
        },
        set(target, prop2, value) {
          var _a6;
          set((_a6 = sources.get(prop2)) != null ? _a6 : add_source(prop2, value), value);
          return Reflect.set(target, prop2, value);
        }
      }
    );
    __privateSet(this, _instance, (options.hydrate ? hydrate : mount)(options.component, {
      target: options.target,
      anchor: options.anchor,
      props,
      context: options.context,
      intro: (_a5 = options.intro) != null ? _a5 : false,
      recover: options.recover,
      transformError: options.transformError
    }));
    if (!async_mode_flag && (!((_b3 = options == null ? void 0 : options.props) == null ? void 0 : _b3.$$host) || options.sync === false)) {
      flushSync();
    }
    __privateSet(this, _events, props.$$events);
    for (const key2 of Object.keys(__privateGet(this, _instance))) {
      if (key2 === "$set" || key2 === "$destroy" || key2 === "$on")
        continue;
      define_property(this, key2, {
        get() {
          return __privateGet(this, _instance)[key2];
        },
        /** @param {any} value */
        set(value) {
          __privateGet(this, _instance)[key2] = value;
        },
        enumerable: true
      });
    }
    __privateGet(this, _instance).$set = /** @param {Record<string, any>} next */
    (next2) => {
      Object.assign(props, next2);
    };
    __privateGet(this, _instance).$destroy = () => {
      unmount(__privateGet(this, _instance));
    };
  }
  /** @param {Record<string, any>} props */
  $set(props) {
    __privateGet(this, _instance).$set(props);
  }
  /**
   * @param {string} event
   * @param {(...args: any[]) => any} callback
   * @returns {any}
   */
  $on(event2, callback) {
    __privateGet(this, _events)[event2] = __privateGet(this, _events)[event2] || [];
    const cb = (...args) => callback.call(this, ...args);
    __privateGet(this, _events)[event2].push(cb);
    return () => {
      __privateGet(this, _events)[event2] = __privateGet(this, _events)[event2].filter(
        /** @param {any} fn */
        (fn) => fn !== cb
      );
    };
  }
  $destroy() {
    __privateGet(this, _instance).$destroy();
  }
};
_events = new WeakMap();
_instance = new WeakMap();

// node_modules/svelte/src/internal/client/dom/elements/custom-element.js
var SvelteElement;
if (typeof HTMLElement === "function") {
  SvelteElement = class extends HTMLElement {
    /**
     * @param {*} $$componentCtor
     * @param {*} $$slots
     * @param {ShadowRootInit | undefined} shadow_root_init
     */
    constructor($$componentCtor, $$slots, shadow_root_init) {
      super();
      /** The Svelte component constructor */
      __publicField(this, "$$ctor");
      /** Slots */
      __publicField(this, "$$s");
      /** @type {any} The Svelte component instance */
      __publicField(this, "$$c");
      /** Whether or not the custom element is connected */
      __publicField(this, "$$cn", false);
      /** @type {Record<string, any>} Component props data */
      __publicField(this, "$$d", {});
      /** `true` if currently in the process of reflecting component props back to attributes */
      __publicField(this, "$$r", false);
      /** @type {Record<string, CustomElementPropDefinition>} Props definition (name, reflected, type etc) */
      __publicField(this, "$$p_d", {});
      /** @type {Record<string, EventListenerOrEventListenerObject[]>} Event listeners */
      __publicField(this, "$$l", {});
      /** @type {Map<EventListenerOrEventListenerObject, Function>} Event listener unsubscribe functions */
      __publicField(this, "$$l_u", /* @__PURE__ */ new Map());
      /** @type {any} The managed render effect for reflecting attributes */
      __publicField(this, "$$me");
      /** @type {ShadowRoot | null} The ShadowRoot of the custom element */
      __publicField(this, "$$shadowRoot", null);
      this.$$ctor = $$componentCtor;
      this.$$s = $$slots;
      if (shadow_root_init) {
        this.$$shadowRoot = this.attachShadow(shadow_root_init);
      }
    }
    /**
     * @param {string} type
     * @param {EventListenerOrEventListenerObject} listener
     * @param {boolean | AddEventListenerOptions} [options]
     */
    addEventListener(type, listener, options) {
      this.$$l[type] = this.$$l[type] || [];
      this.$$l[type].push(listener);
      if (this.$$c) {
        const unsub = this.$$c.$on(type, listener);
        this.$$l_u.set(listener, unsub);
      }
      super.addEventListener(type, listener, options);
    }
    /**
     * @param {string} type
     * @param {EventListenerOrEventListenerObject} listener
     * @param {boolean | AddEventListenerOptions} [options]
     */
    removeEventListener(type, listener, options) {
      super.removeEventListener(type, listener, options);
      if (this.$$c) {
        const unsub = this.$$l_u.get(listener);
        if (unsub) {
          unsub();
          this.$$l_u.delete(listener);
        }
      }
    }
    async connectedCallback() {
      this.$$cn = true;
      if (!this.$$c) {
        let create_slot = function(name) {
          return (anchor) => {
            const slot2 = create_element("slot");
            if (name !== "default")
              slot2.name = name;
            append(anchor, slot2);
          };
        };
        await Promise.resolve();
        if (!this.$$cn || this.$$c) {
          return;
        }
        const $$slots = {};
        const existing_slots = get_custom_elements_slots(this);
        for (const name of this.$$s) {
          if (name in existing_slots) {
            if (name === "default" && !this.$$d.children) {
              this.$$d.children = create_slot(name);
              $$slots.default = true;
            } else {
              $$slots[name] = create_slot(name);
            }
          }
        }
        for (const attribute of this.attributes) {
          const name = this.$$g_p(attribute.name);
          if (!(name in this.$$d)) {
            this.$$d[name] = get_custom_element_value(name, attribute.value, this.$$p_d, "toProp");
          }
        }
        for (const key2 in this.$$p_d) {
          if (!(key2 in this.$$d) && this[key2] !== void 0) {
            this.$$d[key2] = this[key2];
            delete this[key2];
          }
        }
        this.$$c = createClassComponent({
          component: this.$$ctor,
          target: this.$$shadowRoot || this,
          props: {
            ...this.$$d,
            $$slots,
            $$host: this
          }
        });
        this.$$me = effect_root(() => {
          render_effect(() => {
            var _a5;
            this.$$r = true;
            for (const key2 of object_keys(this.$$c)) {
              if (!((_a5 = this.$$p_d[key2]) == null ? void 0 : _a5.reflect))
                continue;
              this.$$d[key2] = this.$$c[key2];
              const attribute_value = get_custom_element_value(
                key2,
                this.$$d[key2],
                this.$$p_d,
                "toAttribute"
              );
              if (attribute_value == null) {
                this.removeAttribute(this.$$p_d[key2].attribute || key2);
              } else {
                this.setAttribute(this.$$p_d[key2].attribute || key2, attribute_value);
              }
            }
            this.$$r = false;
          });
        });
        for (const type in this.$$l) {
          for (const listener of this.$$l[type]) {
            const unsub = this.$$c.$on(type, listener);
            this.$$l_u.set(listener, unsub);
          }
        }
        this.$$l = {};
      }
    }
    // We don't need this when working within Svelte code, but for compatibility of people using this outside of Svelte
    // and setting attributes through setAttribute etc, this is helpful
    /**
     * @param {string} attr
     * @param {string} _oldValue
     * @param {string} newValue
     */
    attributeChangedCallback(attr2, _oldValue, newValue) {
      var _a5;
      if (this.$$r)
        return;
      attr2 = this.$$g_p(attr2);
      this.$$d[attr2] = get_custom_element_value(attr2, newValue, this.$$p_d, "toProp");
      (_a5 = this.$$c) == null ? void 0 : _a5.$set({ [attr2]: this.$$d[attr2] });
    }
    disconnectedCallback() {
      this.$$cn = false;
      Promise.resolve().then(() => {
        if (!this.$$cn && this.$$c) {
          this.$$c.$destroy();
          this.$$me();
          this.$$c = void 0;
        }
      });
    }
    /**
     * @param {string} attribute_name
     */
    $$g_p(attribute_name) {
      return object_keys(this.$$p_d).find(
        (key2) => this.$$p_d[key2].attribute === attribute_name || !this.$$p_d[key2].attribute && key2.toLowerCase() === attribute_name
      ) || attribute_name;
    }
  };
}
function get_custom_element_value(prop2, value, props_definition, transform) {
  var _a5;
  const type = (_a5 = props_definition[prop2]) == null ? void 0 : _a5.type;
  value = type === "Boolean" && typeof value !== "boolean" ? value != null : value;
  if (!transform || !props_definition[prop2]) {
    return value;
  } else if (transform === "toAttribute") {
    switch (type) {
      case "Object":
      case "Array":
        return value == null ? null : JSON.stringify(value);
      case "Boolean":
        return value ? "" : null;
      case "Number":
        return value == null ? null : value;
      default:
        return value;
    }
  } else {
    switch (type) {
      case "Object":
      case "Array":
        return value && JSON.parse(value);
      case "Boolean":
        return value;
      case "Number":
        return value != null ? +value : value;
      default:
        return value;
    }
  }
}
function get_custom_elements_slots(element2) {
  const result = {};
  element2.childNodes.forEach((node) => {
    result[
      /** @type {Element} node */
      node.slot || "default"
    ] = true;
  });
  return result;
}

// node_modules/svelte/src/index-client.js
if (dev_fallback_default) {
  let throw_rune_error = function(rune) {
    if (!(rune in globalThis)) {
      let value;
      Object.defineProperty(globalThis, rune, {
        configurable: true,
        // eslint-disable-next-line getter-return
        get: () => {
          if (value !== void 0) {
            return value;
          }
          rune_outside_svelte(rune);
        },
        set: (v) => {
          value = v;
        }
      });
    }
  };
  throw_rune_error("$state");
  throw_rune_error("$effect");
  throw_rune_error("$derived");
  throw_rune_error("$inspect");
  throw_rune_error("$props");
  throw_rune_error("$bindable");
}

// node_modules/svelte/src/version.js
var PUBLIC_VERSION = "5";

// node_modules/svelte/src/internal/disclose-version.js
var _a4, _b2, _c;
if (typeof window !== "undefined") {
  ((_c = (_b2 = (_a4 = window.__svelte) != null ? _a4 : window.__svelte = {}).v) != null ? _c : _b2.v = /* @__PURE__ */ new Set()).add(PUBLIC_VERSION);
}

// src/multiDay.ts
var import_obsidian8 = require("obsidian");
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
  const fallback2 = buildFallback(settings);
  const start = startOfDay(anchor);
  const out = [];
  for (let i = 0; i < count; i++) {
    const date = addDays(start, i);
    const resolved = await resolveDailyNote(app, date, fallback2);
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
  var _a5, _b3, _c2;
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
    const key2 = (_a5 = t.project) != null ? _a5 : "Unassigned";
    minutesByKey.set(key2, ((_b3 = minutesByKey.get(key2)) != null ? _b3 : 0) + t.durationMin);
  }
  const byProject = [];
  let totalMin = 0;
  for (const [project, minutes] of minutesByKey) {
    totalMin += minutes;
    const color = project === "Unassigned" ? "#7B8794" : (_c2 = getTaskColor(project, null, colorMap)) != null ? _c2 : "#7B8794";
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

// src/multiday/SummaryBar.svelte
var root_1 = from_html(`<div class="dp-md-summary-empty">No scheduled time in this window.</div>`);
var root_3 = from_html(`<div class="dp-md-summary-seg"></div>`);
var root_4 = from_html(`<span class="dp-md-summary-chip"><span class="dp-md-summary-dot"></span> <span class="dp-md-summary-name"> </span> <span class="dp-md-summary-min"> </span></span>`);
var root_2 = from_html(`<div class="dp-md-summary-bar"></div> <div class="dp-md-summary-legend"><span class="dp-md-summary-total"> </span> <!></div>`, 1);
var root = from_html(`<div class="dp-md-summary"><!></div>`);
function SummaryBar($$anchor, $$props) {
  push($$props, true);
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
  var div = root();
  var node = child(div);
  {
    var consequent = ($$anchor2) => {
      var div_1 = root_1();
      append($$anchor2, div_1);
    };
    var alternate = ($$anchor2) => {
      var fragment = root_2();
      var div_2 = first_child(fragment);
      each(div_2, 21, () => $$props.summary.byProject, index, ($$anchor3, p) => {
        var div_3 = root_3();
        let styles;
        template_effect(
          ($0) => {
            var _a5;
            set_attribute2(div_3, "title", `${(_a5 = get2(p).project) != null ? _a5 : ""} \xB7 ${$0 != null ? $0 : ""}`);
            styles = set_style(div_3, "", styles, {
              width: `${get2(p).minutes / $$props.summary.totalMin * 100}%`,
              background: get2(p).color
            });
          },
          [() => fmtMin(get2(p).minutes)]
        );
        append($$anchor3, div_3);
      });
      reset(div_2);
      var div_4 = sibling(div_2, 2);
      var span = child(div_4);
      var text2 = child(span);
      reset(span);
      var node_1 = sibling(span, 2);
      each(node_1, 17, () => $$props.summary.byProject, index, ($$anchor3, p) => {
        var span_1 = root_4();
        var span_2 = child(span_1);
        let styles_1;
        var span_3 = sibling(span_2, 2);
        var text_1 = child(span_3, true);
        reset(span_3);
        var span_4 = sibling(span_3, 2);
        var text_2 = child(span_4, true);
        reset(span_4);
        reset(span_1);
        template_effect(
          ($0) => {
            styles_1 = set_style(span_2, "", styles_1, { background: get2(p).color });
            set_text(text_1, get2(p).project);
            set_text(text_2, $0);
          },
          [() => fmtMin(get2(p).minutes)]
        );
        append($$anchor3, span_1);
      });
      reset(div_4);
      template_effect(($0) => set_text(text2, `${$0 != null ? $0 : ""} total`), [() => fmtMin($$props.summary.totalMin)]);
      append($$anchor2, fragment);
    };
    if_block(node, ($$render) => {
      if ($$props.summary.totalMin === 0)
        $$render(consequent);
      else
        $$render(alternate, -1);
    });
  }
  reset(div);
  append($$anchor, div);
  pop();
}

// src/multiday/InboxPanel.svelte
var import_obsidian9 = require("obsidian");

// src/multiday/dragStore.ts
var current = null;
function setDrag(state2) {
  current = state2;
}
function getDrag() {
  return current;
}

// src/multiday/InboxPanel.svelte
var root_12 = from_html(`<div class="dp-md-inbox-empty">No inbox file at this path.</div>`);
var root_22 = from_html(`<div class="dp-md-inbox-empty">Inbox is clear.</div>`);
var root_42 = from_html(`<li class="dp-md-inbox-item"><span class="dp-md-inbox-dot"></span> <span class="dp-md-inbox-text"> </span></li>`);
var root_32 = from_html(`<ul class="dp-md-inbox-list"></ul>`);
var root2 = from_html(`<div class="dp-md-inbox"><div class="dp-md-inbox-header"><span class="dp-md-inbox-title">Inbox</span> <span class="dp-md-inbox-count"> </span></div> <!></div>`);
function InboxPanel($$anchor, $$props) {
  push($$props, true);
  function onDragStart(ev, task) {
    if (!ev.dataTransfer)
      return;
    setDrag({ task, fromInbox: true });
    ev.dataTransfer.setData("text/plain", task.rawLine);
    ev.dataTransfer.effectAllowed = "move";
  }
  function onDragEnd() {
    setDrag(null);
  }
  async function openTask(task) {
    if (!$$props.file)
      return;
    const leaf = $$props.plugin.app.workspace.getLeaf(false);
    await leaf.openFile($$props.file, { eState: { line: task.lineNumber } });
  }
  function bodyText(task) {
    return task.body.replace(/#\S+/g, "").trim() || task.body.trim();
  }
  var div = root2();
  var div_1 = child(div);
  var span = sibling(child(div_1), 2);
  var text2 = child(span, true);
  reset(span);
  reset(div_1);
  var node = sibling(div_1, 2);
  {
    var consequent = ($$anchor2) => {
      var div_2 = root_12();
      append($$anchor2, div_2);
    };
    var consequent_1 = ($$anchor2) => {
      var div_3 = root_22();
      append($$anchor2, div_3);
    };
    var alternate = ($$anchor2) => {
      var ul = root_32();
      each(ul, 21, () => $$props.tasks, (task) => task.lineNumber, ($$anchor3, task) => {
        const color = user_derived(() => colorFor(get2(task), $$props.colorMap));
        var li = root_42();
        set_attribute2(li, "draggable", true);
        var span_1 = child(li);
        let styles;
        var span_2 = sibling(span_1, 2);
        var text_1 = child(span_2, true);
        reset(span_2);
        reset(li);
        template_effect(
          ($0) => {
            var _a5, _b3;
            styles = set_style(span_1, "", styles, {
              background: (_a5 = get2(color)) != null ? _a5 : "transparent",
              "border-color": (_b3 = get2(color)) != null ? _b3 : "var(--background-modifier-border)"
            });
            set_text(text_1, $0);
          },
          [() => bodyText(get2(task))]
        );
        event("dragstart", li, (ev) => onDragStart(ev, get2(task)));
        event("dragend", li, onDragEnd);
        delegated("click", li, () => openTask(get2(task)));
        append($$anchor3, li);
      });
      reset(ul);
      append($$anchor2, ul);
    };
    if_block(node, ($$render) => {
      if (!$$props.file)
        $$render(consequent);
      else if ($$props.tasks.length === 0)
        $$render(consequent_1, 1);
      else
        $$render(alternate, -1);
    });
  }
  reset(div);
  template_effect(() => set_text(text2, $$props.tasks.length));
  append($$anchor, div);
  pop();
}
delegate(["click"]);

// src/multiday/DayColumn.svelte
var import_obsidian10 = require("obsidian");

// src/multiday/MiniTimeline.svelte
var root_13 = from_html(`<div class="dp-md-timeline-hour"><span class="dp-md-timeline-hour-label"> </span></div>`);
var root_23 = from_html(`<button><span class="dp-md-timeline-block-text"> </span></button>`);
var root3 = from_html(`<div class="dp-md-timeline"><!> <!></div>`);
function MiniTimeline($$anchor, $$props) {
  push($$props, true);
  var _a5;
  var _b3;
  const startHour = user_derived(() => (_a5 = $$props.plugin.settings.visibleStartHour) !== null && _a5 !== void 0 ? _a5 : 6);
  const endHour = user_derived(() => (_b3 = $$props.plugin.settings.visibleEndHour) !== null && _b3 !== void 0 ? _b3 : 22);
  const startMin = user_derived(() => get2(startHour) * 60);
  const endMin = user_derived(() => get2(endHour) * 60);
  const totalMin = user_derived(() => get2(endMin) - get2(startMin));
  const PX_PER_MIN = 0.5;
  const heightPx = user_derived(() => get2(totalMin) * PX_PER_MIN);
  const hourMarks = user_derived(() => {
    const out = [];
    for (let h = get2(startHour); h <= get2(endHour); h++)
      out.push(h);
    return out;
  });
  function blockTop(task) {
    var _a6;
    const s = (_a6 = task.startMin) !== null && _a6 !== void 0 ? _a6 : get2(startMin);
    return Math.max(0, (s - get2(startMin)) * PX_PER_MIN);
  }
  function blockHeight(task) {
    var _a6;
    const s = (_a6 = task.startMin) !== null && _a6 !== void 0 ? _a6 : get2(startMin);
    const end = Math.min(get2(endMin), s + task.durationMin);
    return Math.max(8, (end - Math.max(get2(startMin), s)) * PX_PER_MIN);
  }
  function fmtClock(min) {
    const h = Math.floor(min / 60);
    const m = min % 60;
    const hh = (h + 11) % 12 + 1;
    const mm = m.toString().padStart(2, "0");
    return `${hh}:${mm}`;
  }
  function bodyText(task) {
    return task.body.replace(/#\S+/g, "").trim() || task.body.trim();
  }
  var div = root3();
  let styles;
  var node = child(div);
  each(node, 17, () => get2(hourMarks), index, ($$anchor2, h) => {
    var div_1 = root_13();
    let styles_1;
    var span = child(div_1);
    var text2 = child(span, true);
    reset(span);
    reset(div_1);
    template_effect(() => {
      styles_1 = set_style(div_1, "", styles_1, { top: `${(get2(h) * 60 - get2(startMin)) * PX_PER_MIN}px` });
      set_text(text2, get2(h));
    });
    append($$anchor2, div_1);
  });
  var node_1 = sibling(node, 2);
  each(node_1, 17, () => $$props.tasks, (task) => task.lineNumber, ($$anchor2, task) => {
    const color = user_derived(() => colorFor(get2(task), $$props.colorMap));
    const top = user_derived(() => blockTop(get2(task)));
    const height = user_derived(() => blockHeight(get2(task)));
    var button = root_23();
    let styles_2;
    var span_1 = child(button);
    var text_1 = child(span_1, true);
    reset(span_1);
    reset(button);
    template_effect(
      ($0, $1, $2) => {
        var _a6, _b4, _c2;
        set_class(button, 1, "dp-md-timeline-block" + (get2(task).checked ? " is-done" : ""));
        set_attribute2(button, "title", `${$0 != null ? $0 : ""} \xB7 ${$1 != null ? $1 : ""}`);
        styles_2 = set_style(button, "", styles_2, {
          top: `${(_a6 = get2(top)) != null ? _a6 : ""}px`,
          height: `${(_b4 = get2(height)) != null ? _b4 : ""}px`,
          background: (_c2 = get2(color)) != null ? _c2 : "var(--background-modifier-border)"
        });
        set_text(text_1, $2);
      },
      [
        () => {
          var _a6;
          return fmtClock((_a6 = get2(task).startMin) != null ? _a6 : 0);
        },
        () => bodyText(get2(task)),
        () => bodyText(get2(task))
      ]
    );
    delegated("click", button, () => $$props.onClickTask(get2(task)));
    append($$anchor2, button);
  });
  reset(div);
  template_effect(() => {
    var _a6;
    return styles = set_style(div, "", styles, { height: `${(_a6 = get2(heightPx)) != null ? _a6 : ""}px` });
  });
  append($$anchor, div);
  pop();
}
delegate(["click"]);

// src/multiday/DayColumn.svelte
var root_14 = from_html(`<div class="dp-md-unsched-empty">\u2014</div>`);
var root_33 = from_html(`<li><span class="dp-md-unsched-dot"></span> <span class="dp-md-unsched-text"> </span></li>`);
var root_24 = from_html(`<ul class="dp-md-unsched-list"></ul>`);
var root4 = from_html(`<div role="region" aria-label="Day column"><div class="dp-md-day-header"><button class="dp-md-day-link"> </button> <span class="dp-md-day-count"> </span></div> <!> <div class="dp-md-unsched"><!></div></div>`);
function DayColumn($$anchor, $$props) {
  push($$props, true);
  let dragOver = state(false);
  const isToday = user_derived(() => sameDay($$props.day.date, new Date()));
  const scheduled = user_derived(() => $$props.day.tasks.filter((t) => t.startMin !== null));
  const unscheduled = user_derived(() => $$props.day.tasks.filter((t) => t.startMin === null));
  function fmtHeader(d) {
    return d.toLocaleDateString(void 0, { weekday: "short", month: "short", day: "numeric" });
  }
  async function openDay(ev) {
    ev.preventDefault();
    if ($$props.day.file) {
      const leaf = $$props.plugin.app.workspace.getLeaf(false);
      await leaf.openFile($$props.day.file);
    } else {
      await $$props.plugin.app.workspace.openLinkText($$props.day.path, "");
    }
  }
  async function openTask(task) {
    if (!$$props.day.file)
      return;
    const leaf = $$props.plugin.app.workspace.getLeaf(false);
    await leaf.openFile($$props.day.file, { eState: { line: task.lineNumber } });
  }
  function onDragOver(ev) {
    const drag = getDrag();
    if (!drag || !drag.fromInbox)
      return;
    ev.preventDefault();
    if (ev.dataTransfer)
      ev.dataTransfer.dropEffect = "move";
    set(dragOver, true);
  }
  function onDragLeave() {
    set(dragOver, false);
  }
  async function onDrop(ev) {
    ev.preventDefault();
    set(dragOver, false);
    const drag = getDrag();
    if (!drag || !drag.fromInbox)
      return;
    if (!$$props.inboxFile)
      return;
    const fallback2 = buildFallback($$props.plugin.settings);
    await moveTaskBetweenDailyNotes($$props.plugin.app, $$props.inboxFile, drag.task, $$props.day.date, fallback2);
    await $$props.onMoved();
  }
  function bodyText(task) {
    return task.body.replace(/#\S+/g, "").trim() || task.body.trim();
  }
  var div = root4();
  var div_1 = child(div);
  var button = child(div_1);
  var text2 = child(button, true);
  reset(button);
  var span = sibling(button, 2);
  var text_1 = child(span, true);
  reset(span);
  reset(div_1);
  var node = sibling(div_1, 2);
  MiniTimeline(node, {
    get plugin() {
      return $$props.plugin;
    },
    get tasks() {
      return get2(scheduled);
    },
    get colorMap() {
      return $$props.colorMap;
    },
    onClickTask: openTask
  });
  var div_2 = sibling(node, 2);
  var node_1 = child(div_2);
  {
    var consequent = ($$anchor2) => {
      var div_3 = root_14();
      append($$anchor2, div_3);
    };
    var alternate = ($$anchor2) => {
      var ul = root_24();
      each(ul, 21, () => get2(unscheduled), (task) => task.lineNumber, ($$anchor3, task) => {
        const color = user_derived(() => colorFor(get2(task), $$props.colorMap));
        var li = root_33();
        var span_1 = child(li);
        let styles;
        var span_2 = sibling(span_1, 2);
        var text_2 = child(span_2, true);
        reset(span_2);
        reset(li);
        template_effect(
          ($0) => {
            var _a5, _b3;
            set_class(li, 1, "dp-md-unsched-item" + (get2(task).checked ? " is-done" : ""));
            styles = set_style(span_1, "", styles, {
              background: (_a5 = get2(color)) != null ? _a5 : "transparent",
              "border-color": (_b3 = get2(color)) != null ? _b3 : "var(--background-modifier-border)"
            });
            set_text(text_2, $0);
          },
          [() => bodyText(get2(task))]
        );
        delegated("click", li, () => openTask(get2(task)));
        append($$anchor3, li);
      });
      reset(ul);
      append($$anchor2, ul);
    };
    if_block(node_1, ($$render) => {
      if (get2(unscheduled).length === 0)
        $$render(consequent);
      else
        $$render(alternate, -1);
    });
  }
  reset(div_2);
  reset(div);
  template_effect(
    ($0) => {
      set_class(div, 1, "dp-md-day" + (get2(isToday) ? " is-today" : "") + (get2(dragOver) ? " is-drop-target" : ""));
      set_text(text2, $0);
      set_text(text_1, $$props.day.tasks.length);
    },
    [() => fmtHeader($$props.day.date)]
  );
  event("dragover", div, onDragOver);
  event("dragleave", div, onDragLeave);
  event("drop", div, onDrop);
  delegated("click", button, openDay);
  append($$anchor, div);
  pop();
}
delegate(["click"]);

// src/multiday/DayGrid.svelte
var root5 = from_html(`<div class="dp-md-grid"></div>`);
function DayGrid($$anchor, $$props) {
  push($$props, true);
  var div = root5();
  let styles;
  each(div, 21, () => $$props.days, (day) => day.path, ($$anchor2, day) => {
    DayColumn($$anchor2, {
      get plugin() {
        return $$props.plugin;
      },
      get day() {
        return get2(day);
      },
      get colorMap() {
        return $$props.colorMap;
      },
      get inboxFile() {
        return $$props.inboxFile;
      },
      get onMoved() {
        return $$props.onMoved;
      }
    });
  });
  reset(div);
  template_effect(() => {
    var _a5;
    return styles = set_style(div, "", styles, {
      "grid-template-columns": `repeat(${(_a5 = $$props.days.length) != null ? _a5 : ""}, minmax(0, 1fr))`
    });
  });
  append($$anchor, div);
  pop();
}

// src/multiday/MultiDayApp.svelte
var root_15 = from_html(`<div class="dp-md-loading">Loading\u2026</div>`);
var root6 = from_html(`<div class="dp-md-root"><div class="dp-md-header"><div class="dp-md-nav"><button class="dp-md-nav-btn" aria-label="Previous">\u2039</button> <button class="dp-md-today-btn">Today</button> <button class="dp-md-nav-btn" aria-label="Next">\u203A</button></div> <div class="dp-md-count-toggle"><button>3</button> <button>7</button></div></div> <!> <div class="dp-md-body"><!> <!></div> <!></div>`);
function MultiDayApp($$anchor, $$props) {
  push($$props, true);
  var _a5;
  let plugin = prop($$props, "plugin", 7);
  let anchor = state(proxy(startOfDay(new Date())));
  let count = state(proxy((_a5 = plugin().settings.multiDayCount) !== null && _a5 !== void 0 ? _a5 : 7));
  let days = state(proxy([]));
  let inbox = state(proxy({ path: "", file: null, tasks: [] }));
  let loading = state(true);
  const summary = user_derived(() => summarizeWindow(get2(days), plugin().settings.projectColors));
  const colorMap = user_derived(() => buildWindowColorMap(get2(days), get2(inbox).tasks, plugin().settings.projectColors));
  async function refresh() {
    set(loading, true);
    const [d, i] = await Promise.all([
      loadDayWindow(plugin().app, plugin().settings, get2(anchor), get2(count)),
      loadInboxTasks(plugin().app, plugin().settings)
    ]);
    set(days, d, true);
    set(inbox, i, true);
    set(loading, false);
  }
  $$props.registerRefresh(refresh);
  user_effect(() => {
    void get2(anchor);
    void get2(count);
    void refresh();
  });
  function shiftDays(delta) {
    set(anchor, addDays(get2(anchor), delta), true);
  }
  function jumpToToday() {
    set(anchor, startOfDay(new Date()), true);
  }
  async function setCount(n) {
    set(count, n, true);
    plugin().settings.multiDayCount = n;
    await plugin().saveSettings();
  }
  async function handleDropRefresh() {
    await refresh();
  }
  var div = root6();
  var div_1 = child(div);
  var div_2 = child(div_1);
  var button = child(div_2);
  var button_1 = sibling(button, 2);
  var button_2 = sibling(button_1, 2);
  reset(div_2);
  var div_3 = sibling(div_2, 2);
  var button_3 = child(div_3);
  var button_4 = sibling(button_3, 2);
  reset(div_3);
  reset(div_1);
  var node = sibling(div_1, 2);
  SummaryBar(node, {
    get summary() {
      return get2(summary);
    }
  });
  var div_4 = sibling(node, 2);
  var node_1 = child(div_4);
  InboxPanel(node_1, {
    get plugin() {
      return plugin();
    },
    get tasks() {
      return get2(inbox).tasks;
    },
    get file() {
      return get2(inbox).file;
    },
    get colorMap() {
      return get2(colorMap);
    }
  });
  var node_2 = sibling(node_1, 2);
  DayGrid(node_2, {
    get plugin() {
      return plugin();
    },
    get days() {
      return get2(days);
    },
    get colorMap() {
      return get2(colorMap);
    },
    get inboxFile() {
      return get2(inbox).file;
    },
    onMoved: handleDropRefresh
  });
  reset(div_4);
  var node_3 = sibling(div_4, 2);
  {
    var consequent = ($$anchor2) => {
      var div_5 = root_15();
      append($$anchor2, div_5);
    };
    if_block(node_3, ($$render) => {
      if (get2(loading) && get2(days).length === 0)
        $$render(consequent);
    });
  }
  reset(div);
  template_effect(() => {
    set_class(button_3, 1, "dp-md-count-btn" + (get2(count) === 3 ? " is-active" : ""));
    set_class(button_4, 1, "dp-md-count-btn" + (get2(count) === 7 ? " is-active" : ""));
  });
  delegated("click", button, () => shiftDays(-get2(count)));
  delegated("click", button_1, jumpToToday);
  delegated("click", button_2, () => shiftDays(get2(count)));
  delegated("click", button_3, () => setCount(3));
  delegated("click", button_4, () => setCount(7));
  append($$anchor, div);
  pop();
}
delegate(["click"]);

// src/multiDayView.ts
var VIEW_TYPE_MULTI_DAY = "today-multi-day";
var MultiDayView = class extends import_obsidian11.ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.app$ = null;
    this.rerenderTimer = null;
    this.refreshFn = null;
    this.plugin = plugin;
  }
  getViewType() {
    return VIEW_TYPE_MULTI_DAY;
  }
  getDisplayText() {
    return "Multi-day view";
  }
  getIcon() {
    return "calendar-range";
  }
  async onOpen() {
    const root7 = this.containerEl.children[1];
    root7.empty();
    root7.addClass("today-root");
    root7.addClass("dp-multiday");
    this.app$ = mount(MultiDayApp, {
      target: root7,
      props: {
        plugin: this.plugin,
        registerRefresh: (fn) => {
          this.refreshFn = fn;
        }
      }
    });
    this.registerEvent(
      this.app.vault.on("modify", () => this.scheduleRefresh())
    );
    this.registerEvent(
      this.app.vault.on("delete", () => this.scheduleRefresh())
    );
    this.registerEvent(
      this.app.vault.on("create", () => this.scheduleRefresh())
    );
  }
  async onClose() {
    if (this.rerenderTimer !== null)
      window.clearTimeout(this.rerenderTimer);
    if (this.app$) {
      unmount(this.app$);
      this.app$ = null;
    }
  }
  scheduleRefresh() {
    if (this.rerenderTimer !== null)
      window.clearTimeout(this.rerenderTimer);
    this.rerenderTimer = window.setTimeout(() => {
      var _a5;
      this.rerenderTimer = null;
      (_a5 = this.refreshFn) == null ? void 0 : _a5.call(this);
    }, 100);
  }
};

// src/main.ts
var import_obsidian13 = require("obsidian");
var polyfillInstalled = false;
var TodayPlugin = class extends import_obsidian12.Plugin {
  async onload() {
    await this.loadSettings();
    this.habitsScanner = new HabitsScanner(this.app);
    if (import_obsidian12.Platform.isMobile && !polyfillInstalled) {
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
      name: "Open habit stats",
      callback: () => void this.activateHabitsStatsView()
    });
    this.addCommand({
      id: "open-multi-day",
      name: "Open multi-day view",
      hotkeys: [{ modifiers: ["Mod", "Shift"], key: "M" }],
      callback: () => void this.activateMultiDayView()
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
        if (!(af instanceof import_obsidian12.TFile))
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
    var _a5, _b3, _c2;
    const data = await this.loadData();
    this.settings = {
      ...DEFAULT_SETTINGS,
      ...data != null ? data : {},
      prefixes: { ...DEFAULT_PREFIXES, ...(_a5 = data == null ? void 0 : data.prefixes) != null ? _a5 : {} },
      autocomplete: {
        ...DEFAULT_AUTOCOMPLETE,
        ...(_b3 = data == null ? void 0 : data.autocomplete) != null ? _b3 : {}
      },
      dailyNoteTemplatesByDay: {
        ...DEFAULT_WEEKDAY_TEMPLATES,
        ...(_c2 = data == null ? void 0 : data.dailyNoteTemplatesByDay) != null ? _c2 : {}
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
    const target = (0, import_obsidian13.moment)().startOf("day").add(dayOffset, "day").toDate();
    const fallback2 = {
      folder: this.settings.dailyNoteFolderFallback,
      format: this.settings.dailyNoteFormatFallback,
      template: this.settings.dailyNoteTemplate,
      templatesByDay: this.settings.dailyNoteTemplatesByDay,
      dateLinkFormat: this.settings.dateLinkFormat,
      prefixes: this.settings.prefixes,
      quotesFile: this.settings.quotesFile,
      addCreatedTag: this.settings.addCreatedTagToFrontmatter
    };
    const file = await ensureDailyNote(this.app, target, fallback2, false);
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
var InlineSuggest = class extends import_obsidian12.EditorSuggest {
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
        subDisplay: fmt.trim() ? ` ${(0, import_obsidian13.moment)(s.date).format(fmt.trim())}` : void 0,
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
    var _a5, _b3;
    const prefix = `#${this.plugin.settings.prefixes.project}/`.toLowerCase();
    const names = /* @__PURE__ */ new Set();
    const cache = this.app.metadataCache;
    const tags = (_b3 = (_a5 = cache.getTags) == null ? void 0 : _a5.call(cache)) != null ? _b3 : {};
    for (const tag2 of Object.keys(tags)) {
      if (tag2.toLowerCase().startsWith(prefix)) {
        const name = tag2.slice(prefix.length);
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
