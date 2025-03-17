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
function I(s, l) {
  for (; (s = s.parentElement) && !s.classList.contains(l); ) ;
  return s;
}
function E(s, ...l) {
  if (typeof s != "string") return "";
  const o = [...l].shift;
  return s.replace(/\${(\d+)}/g, (r, y) => o[parseInt(y)] !== void 0 ? o[parseInt(y)] : r);
}
function C(s) {
  return s.pristine.self.form.querySelectorAll(
    'input[name="' + s.getAttribute("name") + '"]:checked'
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
const L = "pristine-error", S = "input:not([disabled]):not([type^=hidden]):not([type^=submit]):not([type^=button]):not([data-pristine-ignore]), select, textarea", N = [
  "required",
  "min",
  "max",
  "minlength",
  "maxlength",
  "pattern"
], O = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, V = /-message(?:-([a-z]{2}(?:_[A-Z]{2})?))?/;
let m = "en";
const _ = {}, d = (s, l) => {
  l.name = s, l.priority === void 0 && (l.priority = 1), _[s] = l;
};
d("text", { fn: (s, l) => !0, priority: 0 });
d("required", {
  fn: (s, l) => l.type === "radio" || l.type === "checkbox" ? C(l) : s !== void 0 && s !== "",
  priority: 99,
  halt: !0
});
d("email", { fn: (s, l) => !s || O.test(s) });
d("number", { fn: (s, l) => !s || !isNaN(parseFloat(s)), priority: 2 });
d("integer", { fn: (s, l) => !s || /^\d+$/.test(s) });
d("minlength", {
  fn: (s, l, o) => !s || s.length >= parseInt(o)
});
d("maxlength", {
  fn: (s, l, o) => !s || s.length <= parseInt(o)
});
d("min", {
  fn: (s, l, o) => !s || (l.type === "checkbox" ? C(l) >= parseInt(o) : parseFloat(s) >= parseFloat(o))
});
d("max", {
  fn: (s, l, o) => !s || (l.type === "checkbox" ? C(l) <= parseInt(o) : parseFloat(s) <= parseFloat(o))
});
d("pattern", {
  fn: (s, l, o) => {
    if (!s) return !0;
    let r = typeof o == "string" ? o.match(new RegExp("^/(.*?)/([gimy]*)$")) : null;
    return r ? new RegExp(r[1], r[2]).test(s) : new RegExp(o).test(s);
  }
});
d("equals", {
  fn: (s, l, o) => {
    let r;
    return typeof o == "string" && o.startsWith("#") ? r = document.querySelector(o) : o instanceof HTMLElement && (r = o), r && (!s && !r.value || r.value === s);
  }
});
function q(s, l, o = !0) {
  const r = this;
  let y = !1;
  $(s, l, o);
  function $(e, n, i) {
    e.setAttribute("novalidate", "true"), r.form = e, r.config = { ...R, ...n || {} }, r.live = i !== !1, r.fields = Array.from(e.querySelectorAll(S)).map((t) => {
      const c = [], a = {}, f = {};
      Array.from(t.attributes).forEach((u) => {
        if (/^data-pristine-/.test(u.name)) {
          let p = u.name.substr(14);
          const T = p.match(V);
          if (T !== null) {
            const b = T[1] === void 0 ? "en" : T[1];
            f.hasOwnProperty(b) || (f[b] = {}), f[b][p.slice(0, p.length - T[0].length)] = u.value;
            return;
          }
          let M = u.value;
          p === "type" && (p = M), x(c, a, p, M);
        } else N.includes(u.name) ? x(c, a, u.name, u.value) : u.name === "type" && x(c, a, u.value);
      }), c.sort((u, p) => p.priority - u.priority);
      const g = (u) => {
        r.config.liveAfterFirstValitation && y ? r.validate(u.target) : r.config.liveAfterFirstValitation || r.validate(u.target);
      };
      return r.live && (t.addEventListener("change", g), ["radio", "checkbox"].includes(t.getAttribute("type")) || t.addEventListener("input", g)), t.pristine = {
        input: t,
        validators: c,
        params: a,
        messages: f,
        self: r
      };
    });
  }
  function x(e, n, i, t) {
    let c = _[i];
    if (c && (e.push(c), t)) {
      let a;
      if (i === "pattern")
        a = [t];
      else if (t.trim().startsWith("{") || t.trim().startsWith("["))
        try {
          const f = JSON.parse(t);
          a = Array.isArray(f) ? f : [f];
        } catch {
          a = t.split(",");
        }
      else
        a = t.split(",");
      a.unshift(null), n[i] = a;
    }
  }
  r.validate = (e = null, n = !1) => {
    let i = r.fields;
    e ? e instanceof HTMLElement ? i = [e.pristine] : (e instanceof NodeList || e instanceof (window.$ || Array) || Array.isArray(e)) && (i = Array.from(e).map((a) => a.pristine)) : y = !0;
    let t = !0;
    const c = [];
    for (let a = 0; i[a]; a++) {
      const f = i[a], g = r.validateField(f);
      g instanceof Promise ? c.push(
        g.then((u) => (u ? !n && w(f) : (t = !1, !n && A(f)), u))
      ) : g ? !n && w(f) : (t = !1, !n && A(f));
    }
    return c.length > 0 ? Promise.all(c).then(() => t) : Promise.resolve(t);
  }, r.getErrors = function(e) {
    if (!e) {
      let n = [];
      for (let i = 0; i < r.fields.length; i++) {
        let t = r.fields[i];
        t.errors.length && n.push({ input: t.input, errors: t.errors });
      }
      return n;
    }
    return e.tagName && e.tagName.toLowerCase() === "select" ? e.pristine.errors : e.length ? e[0].pristine.errors : e.pristine.errors;
  }, r.validateField = function(e) {
    let n = [], i = !0, t = [];
    for (let c = 0; e.validators[c]; c++) {
      let a = e.validators[c], f = e.params[a.name] ? [...e.params[a.name]] : [];
      f[0] = e.input.value, f.length > 1 ? f.splice(1, 0, e.input) : f.push(e.input);
      let g = a.fn.apply(null, f);
      if (g instanceof Promise)
        t.push(
          g.then((u) => {
            if (!u) {
              i = !1;
              let p = v(e, a, f);
              n.push(p);
            }
            return u;
          })
        );
      else if (!g) {
        i = !1;
        let u = v(e, a, f);
        if (n.push(u), a.halt === !0)
          break;
      }
    }
    return t.length > 0 ? Promise.all(t).then(() => (e.errors = n, i && n.length === 0)) : (e.errors = n, i);
  };
  function v(e, n, i) {
    let t = null;
    return typeof n.msg == "function" ? t = n.msg(e.input.value, i) : typeof n.msg == "string" ? t = E(n.msg, ...i) : n.msg === Object(n.msg) && n.msg[m] ? t = E(n.msg[m], ...i) : e.messages[m] && e.messages[m][n.name] ? t = E(
      e.messages[m][n.name],
      ...i
    ) : h[m] && h[m][n.name] ? t = E(h[m][n.name], ...i) : h[m] && h[m].default ? t = E(h[m].default, ...i) : t = `Validation failed for ${n.name}`, !t || t.trim() === "" ? `Validation failed for ${n.name}` : t;
  }
  r.addValidator = function(e, n, i, t, c) {
    e instanceof HTMLElement ? (e.pristine.validators.push({ fn: n, msg: i, priority: t, halt: c }), e.pristine.validators.sort((a, f) => f.priority - a.priority)) : console.warn("The parameter elem must be a dom element");
  };
  function P(e) {
    if (e.errorElements)
      return e.errorElements;
    let n = I(e.input, r.config.classTo), i = null, t = null;
    if (r.config.classTo === r.config.errorTextParent)
      i = n;
    else {
      if (!n) return [null, null];
      i = n.querySelector(
        "." + r.config.errorTextParent
      );
    }
    return i && (t = i.querySelector("." + L), t || (t = document.createElement(r.config.errorTextTag), t.className = L + " " + r.config.errorTextClass, i.appendChild(t), t.pristineDisplay = t.style.display)), e.errorElements = [n, t];
  }
  function A(e) {
    let n = P(e), i = n[0], t = n[1];
    i && (i.classList.remove(r.config.successClass), i.classList.add(r.config.errorClass)), t && (t.innerHTML = e.errors.join("<br/>"), t.style.display = t.pristineDisplay || "");
  }
  r.addError = function(e, n) {
    e = e.length ? e[0] : e, e.pristine.errors.push(n), A(e.pristine);
  }, r.removeError = function(e) {
    let n = P(e), i = n[0], t = n[1];
    return i && (i.classList.remove(r.config.errorClass), i.classList.remove(r.config.successClass)), t && (t.innerHTML = "", t.style.display = "none"), n;
  };
  function w(e) {
    let n = r.removeError(e)[0];
    n && n.classList.add(r.config.successClass);
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
q.addValidator = function(s, l, o, r, y) {
  d(s, { fn: l, msg: o, priority: r, halt: y });
};
q.addMessages = function(s, l) {
  let o = h.hasOwnProperty(s) ? h[s] : h[s] = {};
  Object.keys(l).forEach(function(r, y) {
    o[r] = l[r];
  });
};
q.setLocale = function(s) {
  m = s;
};
export {
  q as default
};
//# sourceMappingURL=pristine.js.map
