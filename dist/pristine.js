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
function S(t, l) {
  for (; (t = t.parentElement) && !t.classList.contains(l); ) ;
  return t;
}
function E(t, ...l) {
  return typeof t != "string" ? "" : t.replace(/\${(\d+)}/g, (o, r) => l[parseInt(r)] !== void 0 ? l[parseInt(r)] : o);
}
function C(t) {
  return t.pristine.self.form.querySelectorAll(
    'input[name="' + t.getAttribute("name") + '"]:checked'
  ).length;
}
let R = {
  classTo: "field",
  errorClass: "error",
  successClass: "success",
  errorTextParent: "field",
  errorTextTag: "div",
  errorTextClass: "error-msg",
  liveAfterFirstValitation: !0
};
const L = "pristine-error", N = "input:not([disabled]):not([type^=hidden]):not([type^=submit]):not([type^=button]):not([data-pristine-ignore]), select, textarea", O = [
  "required",
  "min",
  "max",
  "minlength",
  "maxlength",
  "pattern"
], $ = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, F = /-message(?:-([a-z]{2}(?:_[A-Z]{2})?))?/;
let p = "en";
const _ = {}, m = (t, l) => {
  l.name = t, l.priority === void 0 && (l.priority = 1), _[t] = l;
};
m("text", { fn: (t, l) => !0, priority: 0 });
m("required", {
  fn: (t, l) => l.type === "radio" || l.type === "checkbox" ? C(l) : t !== void 0 && t !== "",
  priority: 99,
  halt: !0
});
m("email", { fn: (t, l) => !t || $.test(t) });
m("number", { fn: (t, l) => !t || !isNaN(parseFloat(t)), priority: 2 });
m("integer", { fn: (t, l) => !t || /^\d+$/.test(t) });
m("minlength", {
  fn: (t, l, o) => !t || t.length >= parseInt(o)
});
m("maxlength", {
  fn: (t, l, o) => !t || t.length <= parseInt(o)
});
m("min", {
  fn: (t, l, o) => !t || (l.type === "checkbox" ? C(l) >= parseInt(o) : parseFloat(t) >= parseFloat(o))
});
m("max", {
  fn: (t, l, o) => !t || (l.type === "checkbox" ? C(l) <= parseInt(o) : parseFloat(t) <= parseFloat(o))
});
m("pattern", {
  fn: (t, l, o) => {
    if (!t) return !0;
    let r = typeof o == "string" ? o.match(new RegExp("^/(.*?)/([gimy]*)$")) : null;
    return r ? new RegExp(r[1], r[2]).test(t) : new RegExp(o).test(t);
  }
});
m("equals", {
  fn: (t, l, o) => {
    let r;
    return typeof o == "string" && o.startsWith("#") ? r = document.querySelector(o) : o instanceof HTMLElement && (r = o), r && (!t && !r.value || r.value === t);
  }
});
function q(t, l, o = !0) {
  const r = this;
  let y = !1;
  I(t, l, o);
  function I(e, s, i) {
    e.setAttribute("novalidate", "true"), r.form = e, r.config = { ...R, ...s || {} }, r.live = i !== !1, r.fields = Array.from(e.querySelectorAll(N)).map((n) => {
      const c = [], a = {}, f = {};
      Array.from(n.attributes).forEach((u) => {
        if (/^data-pristine-/.test(u.name)) {
          let g = u.name.substr(14);
          const T = g.match(F);
          if (T !== null) {
            const b = T[1] === void 0 ? "en" : T[1];
            f.hasOwnProperty(b) || (f[b] = {}), f[b][g.slice(0, g.length - T[0].length)] = u.value;
            return;
          }
          let M = u.value;
          g === "type" && (g = M), x(c, a, g, M);
        } else O.includes(u.name) ? x(c, a, u.name, u.value) : u.name === "type" && x(c, a, u.value);
      }), c.sort((u, g) => g.priority - u.priority);
      const d = (u) => {
        r.config.liveAfterFirstValitation && y ? r.validate(u.target) : r.config.liveAfterFirstValitation || r.validate(u.target);
      };
      return r.live && (n.addEventListener("change", d), ["radio", "checkbox"].includes(n.getAttribute("type")) || n.addEventListener("input", d)), n.pristine = {
        input: n,
        validators: c,
        params: a,
        messages: f,
        self: r
      };
    });
  }
  function x(e, s, i, n) {
    let c = _[i];
    if (c && (e.push(c), n)) {
      let a;
      if (i === "pattern")
        a = [n];
      else if (n.trim().startsWith("{") || n.trim().startsWith("["))
        try {
          const f = JSON.parse(n);
          a = Array.isArray(f) ? f : [f];
        } catch {
          a = n.split(",");
        }
      else
        a = n.split(",");
      a.unshift(null), s[i] = a;
    }
  }
  r.validate = (e = null, s = !1) => {
    let i = r.fields;
    e ? e instanceof HTMLElement ? i = [e.pristine] : (e instanceof NodeList || e instanceof (window.$ || Array) || Array.isArray(e)) && (i = Array.from(e).map((a) => a.pristine)) : y = !0;
    let n = !0;
    const c = [];
    for (let a = 0; i[a]; a++) {
      const f = i[a], d = r.validateField(f);
      d instanceof Promise ? c.push(
        d.then((u) => (u ? !s && w(f) : (n = !1, !s && A(f)), u))
      ) : d ? !s && w(f) : (n = !1, !s && A(f));
    }
    return c.length > 0 ? Promise.all(c).then(() => n) : Promise.resolve(n);
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
    for (let c = 0; e.validators[c]; c++) {
      let a = e.validators[c], f = e.params[a.name] ? e.params[a.name] : [];
      f[0] = e.input.value, f.length > 1 ? f.splice(1, 0, e.input) : f.push(e.input);
      let d = a.fn.apply(null, f);
      if (d instanceof Promise)
        n.push(
          d.then((u) => {
            if (!u) {
              i = !1;
              let g = v(e, a, f);
              s.push(g);
            }
            return u;
          })
        );
      else if (!d) {
        i = !1;
        let u = v(e, a, f);
        if (s.push(u), a.halt === !0)
          break;
      }
    }
    return n.length > 0 ? Promise.all(n).then(() => (e.errors = s, i && s.length === 0)) : (e.errors = s, i);
  };
  function v(e, s, i) {
    return typeof s.msg == "function" ? s.msg(e.input.value, i) : typeof s.msg == "string" ? E(s.msg, ...i) : s.msg === Object(s.msg) && s.msg[p] ? E(s.msg[p], ...i) : e.messages[p] && e.messages[p][s.name] ? E(e.messages[p][s.name], ...i) : h[p] && h[p][s.name] ? E(h[p][s.name], ...i) : E(h[p].default, ...i);
  }
  r.addValidator = function(e, s, i, n, c) {
    e instanceof HTMLElement ? (e.pristine.validators.push({ fn: s, msg: i, priority: n, halt: c }), e.pristine.validators.sort((a, f) => f.priority - a.priority)) : console.warn("The parameter elem must be a dom element");
  };
  function P(e) {
    if (e.errorElements)
      return e.errorElements;
    let s = S(e.input, r.config.classTo), i = null, n = null;
    if (r.config.classTo === r.config.errorTextParent)
      i = s;
    else {
      if (!s) return [null, null];
      i = s.querySelector(
        "." + r.config.errorTextParent
      );
    }
    return i && (n = i.querySelector("." + L), n || (n = document.createElement(r.config.errorTextTag), n.className = L + " " + r.config.errorTextClass, i.appendChild(n), n.pristineDisplay = n.style.display)), e.errorElements = [s, n];
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
    Array.from(r.form.querySelectorAll("." + L)).map(function(e) {
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
    R = e;
  }, r;
}
q.addValidator = function(t, l, o, r, y) {
  m(t, { fn: l, msg: o, priority: r, halt: y });
};
q.addMessages = function(t, l) {
  let o = h.hasOwnProperty(t) ? h[t] : h[t] = {};
  Object.keys(l).forEach(function(r, y) {
    o[r] = l[r];
  });
};
q.setLocale = function(t) {
  p = t;
};
export {
  q as default
};
//# sourceMappingURL=pristine.js.map
