const h = {
  en: {
    required: "This field is required",
    email: "This field requires a valid e-mail address",
    number: "This field requires a number",
    integer: "This field requires an integer value",
    url: "This field requires a valid website URL",
    tel: "This field requires a valid telephone number",
    maxlength: "This fields length must be < ${1}",
    minlength: "This fields length must be > ${1}",
    min: "Minimum value for this field is ${1}",
    max: "Maximum value for this field is ${1}",
    pattern: "Please match the requested format",
    equals: "The two fields do not match",
    default: "Please enter a correct value"
  }
};
function R(t, l) {
  for (; (t = t.parentElement) && !t.classList.contains(l); ) ;
  return t;
}
function E(t) {
  return this.replace(/\${([^{}]*)}/g, (l, a) => arguments[a]);
}
function L(t) {
  return t.pristine.self.form.querySelectorAll('input[name="' + t.getAttribute("name") + '"]:checked').length;
}
function _(t, l) {
  for (let a in l)
    a in t || (t[a] = l[a]);
  return t;
}
const S = {
  classTo: "field",
  errorClass: "error",
  successClass: "success",
  errorTextParent: "field",
  errorTextTag: "div",
  errorTextClass: "error-msg",
  liveAfterFirstValitation: !0
}, C = "pristine-error", N = "input:not([disabled]):not([type^=hidden]):not([type^=submit]):not([type^=button]):not([data-pristine-ignore]), select, textarea", O = [
  "required",
  "min",
  "max",
  "minlength",
  "maxlength",
  "pattern"
], $ = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, I = /-message(?:-([a-z]{2}(?:_[A-Z]{2})?))?/;
let g = "en";
const F = {}, m = (t, l) => {
  l.name = t, l.priority === void 0 && (l.priority = 1), F[t] = l;
};
m("text", { fn: (t, l) => !0, priority: 0 });
m("required", {
  fn: (t, l) => l.type === "radio" || l.type === "checkbox" ? L(l) : t !== void 0 && t !== "",
  priority: 99,
  halt: !0
});
m("email", { fn: (t, l) => !t || $.test(t) });
m("number", { fn: (t, l) => !t || !isNaN(parseFloat(t)), priority: 2 });
m("integer", { fn: (t, l) => !t || /^\d+$/.test(t) });
m("minlength", {
  fn: (t, l, a) => !t || t.length >= parseInt(a)
});
m("maxlength", {
  fn: (t, l, a) => !t || t.length <= parseInt(a)
});
m("min", {
  fn: (t, l, a) => !t || (l.type === "checkbox" ? L(l) >= parseInt(a) : parseFloat(t) >= parseFloat(a))
});
m("max", {
  fn: (t, l, a) => !t || (l.type === "checkbox" ? L(l) <= parseInt(a) : parseFloat(t) <= parseFloat(a))
});
m("pattern", {
  fn: (t, l, a) => {
    let r = a.match(new RegExp("^/(.*?)/([gimy]*)$"));
    return !t || new RegExp(r[1], r[2]).test(t);
  }
});
m("equals", {
  fn: (t, l, a) => {
    let r = document.querySelector(a);
    return r && (!t && !r.value || r.value === t);
  }
});
function v(t, l, a = !0) {
  const r = this;
  let y = !1;
  M(t, l, a);
  function M(e, s, i) {
    e.setAttribute("novalidate", "true"), r.form = e, r.config = _(s || {}, S), r.live = i, r.fields = Array.from(e.querySelectorAll(N)).map((n) => {
      const u = [], o = {}, f = {};
      Array.from(n.attributes).forEach((c) => {
        if (/^data-pristine-/.test(c.name)) {
          const d = c.name.substr(14), T = d.match(I);
          if (T !== null) {
            const b = T[1] === void 0 ? "en" : T[1];
            f.hasOwnProperty(b) || (f[b] = {}), f[b][d.slice(0, d.length - T[0].length)] = c.value;
            return;
          }
          d === "type" && (d = c.value), x(u, o, d, c.value);
        } else O.includes(c.name) ? x(u, o, c.name, c.value) : c.name === "type" && x(u, o, c.value);
      }), u.sort((c, d) => d.priority - c.priority);
      const p = (c) => {
        r.config.liveAfterFirstValitation && y ? r.validate(c.target) : r.config.liveAfterFirstValitation || r.validate(c.target);
      };
      return r.live && (n.addEventListener("change", p), ["radio", "checkbox"].includes(n.getAttribute("type")) || n.addEventListener("input", p)), n.pristine = {
        input: n,
        validators: u,
        params: o,
        messages: f,
        self: r
      };
    });
  }
  function x(e, s, i, n) {
    let u = F[i];
    if (u && (e.push(u), n)) {
      let o;
      if (i === "pattern")
        o = [n];
      else if (n.trim().startsWith("{") || n.trim().startsWith("["))
        try {
          const f = JSON.parse(n);
          o = Array.isArray(f) ? f : [f];
        } catch {
          o = n.split(",");
        }
      else
        o = n.split(",");
      o.unshift(null), s[i] = o;
    }
  }
  r.validate = (e = null, s = !1) => {
    let i = r.fields;
    e ? e instanceof HTMLElement ? i = [e.pristine] : (e instanceof NodeList || e instanceof (window.$ || Array) || Array.isArray(e)) && (i = Array.from(e).map((o) => o.pristine)) : y = !0;
    let n = !0;
    const u = [];
    for (let o = 0; i[o]; o++) {
      const f = i[o], p = r.validateField(f);
      p instanceof Promise ? u.push(
        p.then((c) => (c ? !s && w(f) : (n = !1, !s && A(f)), c))
      ) : p ? !s && w(f) : (n = !1, !s && A(f));
    }
    return u.length > 0 ? Promise.all(u).then(() => n) : Promise.resolve(n);
  }, r.getErrors = function(e) {
    if (!e) {
      let s = [];
      for (let i = 0; i < r.fields.length; i++) {
        let n = r.fields[i];
        n.errors.length && s.push({ input: n.input, errors: n.errors });
      }
      return s;
    }
    return e.tagName && e.tagName.toLowerCase() === "select" ? e.pristine.errors : e.length ? e[0].pristine.errors : e.pristine.errors;
  }, r.validateField = function(e) {
    let s = [], i = !0, n = [];
    for (let u = 0; e.validators[u]; u++) {
      let o = e.validators[u], f = e.params[o.name] ? e.params[o.name] : [];
      f[0] = e.input.value, f.length > 1 ? f.splice(1, 0, e.input) : f.push(e.input);
      let p = o.fn.apply(null, f);
      if (p instanceof Promise)
        n.push(
          p.then((c) => {
            if (!c) {
              i = !1;
              let d = q(e, o, f);
              s.push(d);
            }
            return c;
          })
        );
      else if (!p) {
        i = !1;
        let c = q(e, o, f);
        if (s.push(c), o.halt === !0)
          break;
      }
    }
    return n.length > 0 ? Promise.all(n).then(() => (e.errors = s, i && s.length === 0)) : (e.errors = s, i);
  };
  function q(e, s, i) {
    return typeof s.msg == "function" ? s.msg(e.input.value, i) : typeof s.msg == "string" ? E.apply(s.msg, i) : s.msg === Object(s.msg) && s.msg[g] ? E.apply(s.msg[g], i) : e.messages[g] && e.messages[g][s.name] ? E.apply(e.messages[g][s.name], i) : h[g] && h[g][s.name] ? E.apply(h[g][s.name], i) : E.apply(h[g].default, i);
  }
  r.addValidator = function(e, s, i, n, u) {
    e instanceof HTMLElement ? (e.pristine.validators.push({ fn: s, msg: i, priority: n, halt: u }), e.pristine.validators.sort((o, f) => f.priority - o.priority)) : console.warn("The parameter elem must be a dom element");
  };
  function P(e) {
    if (e.errorElements)
      return e.errorElements;
    let s = R(e.input, r.config.classTo), i = null, n = null;
    if (r.config.classTo === r.config.errorTextParent)
      i = s;
    else {
      if (!s) return [null, null];
      i = s.querySelector(
        "." + r.config.errorTextParent
      );
    }
    return i && (n = i.querySelector("." + C), n || (n = document.createElement(r.config.errorTextTag), n.className = C + " " + r.config.errorTextClass, i.appendChild(n), n.pristineDisplay = n.style.display)), e.errorElements = [s, n];
  }
  function A(e) {
    let s = P(e), i = s[0], n = s[1];
    i && (i.classList.remove(r.config.successClass), i.classList.add(r.config.errorClass)), n && (n.innerHTML = e.errors.join("<br/>"), n.style.display = n.pristineDisplay || "");
  }
  r.addError = function(e, s) {
    e = e.length ? e[0] : e, e.pristine.errors.push(s), A(e.pristine);
  }, r.removeError = function(e) {
    let s = P(e), i = s[0], n = s[1];
    return i && (i.classList.remove(r.config.errorClass), i.classList.remove(r.config.successClass)), n && (n.innerHTML = "", n.style.display = "none"), s;
  };
  function w(e) {
    let s = r.removeError(e)[0];
    s && s.classList.add(r.config.successClass);
  }
  return r.reset = function() {
    for (let e = 0; r.fields[e]; e++)
      r.fields[e].errorElements = null;
    Array.from(r.form.querySelectorAll("." + C)).map(function(e) {
      e.parentNode.removeChild(e);
    }), Array.from(r.form.querySelectorAll("." + r.config.classTo)).map(
      function(e) {
        e.classList.remove(r.config.successClass), e.classList.remove(r.config.errorClass);
      }
    );
  }, r.destroy = function() {
    r.reset(), r.fields.forEach(function(e) {
      delete e.input.pristine;
    }), r.fields = [];
  }, r.setGlobalConfig = function(e) {
    S = e;
  }, r;
}
v.addValidator = function(t, l, a, r, y) {
  m(t, { fn: l, msg: a, priority: r, halt: y });
};
v.addMessages = function(t, l) {
  let a = h.hasOwnProperty(t) ? h[t] : h[t] = {};
  Object.keys(l).forEach(function(r, y) {
    a[r] = l[r];
  });
};
v.setLocale = function(t) {
  g = t;
};
export {
  v as default
};
//# sourceMappingURL=pristine.js.map
