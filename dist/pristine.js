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
function I(t, l) {
  for (; (t = t.parentElement) && !t.classList.contains(l); ) ;
  return t;
}
function E(t, ...l) {
  return typeof t != "string" ? "" : t.replace(/\${(\d+)}/g, (o, r) => l[parseInt(r)] !== void 0 ? l[parseInt(r)] : o);
}
function C(t) {
  const o = t.getAttribute("name").replace(/\[\d*\]$/, "");
  return t.pristine.self.form.querySelectorAll(
    `input[name^="${o}["]:checked, input[name="${o}"]:checked`
  ).length;
}
let M = {
  classTo: "field",
  errorClass: "error",
  successClass: "success",
  errorTextParent: "field",
  errorTextTag: "div",
  errorTextClass: "error-msg",
  liveAfterFirstValitation: !0
};
const L = "pristine-error", N = "input:not([disabled]):not([type^=hidden]):not([type^=submit]):not([type^=button]):not([data-pristine-ignore]), select, textarea", S = [
  "required",
  "min",
  "max",
  "minlength",
  "maxlength",
  "pattern"
], F = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, O = /-message(?:-([a-z]{2}(?:_[A-Z]{2})?))?/;
let m = "en";
const R = {}, p = (t, l) => {
  l.name = t, l.priority === void 0 && (l.priority = 1), R[t] = l;
};
p("text", { fn: (t, l) => !0, priority: 0 });
p("required", {
  fn: (t, l) => l.type === "radio" || l.type === "checkbox" ? C(l) : t !== void 0 && t !== "",
  priority: 99,
  halt: !0
});
p("email", { fn: (t, l) => !t || F.test(t) });
p("number", {
  // parseFloat alone would accept '123abc', isFinite alone would accept blank strings
  fn: (t, l) => !t || !isNaN(parseFloat(t)) && isFinite(t),
  priority: 2
});
p("integer", { fn: (t, l) => !t || /^\d+$/.test(t) });
p("minlength", {
  fn: (t, l, o) => !t || t.length >= parseInt(o)
});
p("maxlength", {
  fn: (t, l, o) => !t || t.length <= parseInt(o)
});
p("min", {
  fn: (t, l, o) => !t || (l.type === "checkbox" ? C(l) >= parseInt(o) : parseFloat(t) >= parseFloat(o))
});
p("max", {
  fn: (t, l, o) => !t || (l.type === "checkbox" ? C(l) <= parseInt(o) : parseFloat(t) <= parseFloat(o))
});
p("pattern", {
  fn: (t, l, o) => {
    if (!t) return !0;
    let r = typeof o == "string" ? o.match(new RegExp("^/(.*?)/([gimy]*)$")) : null;
    return r ? new RegExp(r[1], r[2]).test(t) : new RegExp(o).test(t);
  }
});
p("equals", {
  fn: (t, l, o) => {
    let r;
    return typeof o == "string" && o.startsWith("#") ? r = document.querySelector(o) : o instanceof HTMLElement && (r = o), r && (!t && !r.value || r.value === t);
  }
});
function q(t, l, o = !0) {
  const r = this;
  let y = !1;
  _(t, l, o);
  function _(e, n, i) {
    e.setAttribute("novalidate", "true"), r.form = e, r.config = { ...M, ...n || {} }, r.live = i !== !1, r.fields = Array.from(e.querySelectorAll(N)).map((s) => {
      const c = [], a = {}, f = {};
      Array.from(s.attributes).forEach((u) => {
        if (/^data-pristine-/.test(u.name)) {
          let g = u.name.substr(14);
          const T = g.match(O);
          if (T !== null) {
            const b = T[1] === void 0 ? "en" : T[1];
            f.hasOwnProperty(b) || (f[b] = {}), f[b][g.slice(0, g.length - T[0].length)] = u.value;
            return;
          }
          let $ = u.value;
          g === "type" && (g = $), A(c, a, g, $);
        } else S.includes(u.name) ? A(c, a, u.name, u.value) : u.name === "type" && A(c, a, u.value);
      }), c.sort((u, g) => g.priority - u.priority);
      const d = (u) => {
        r.config.liveAfterFirstValitation && y ? r.validate(u.target) : r.config.liveAfterFirstValitation || r.validate(u.target);
      };
      return r.live && (s.addEventListener("change", d), ["radio", "checkbox"].includes(s.getAttribute("type")) || s.addEventListener("input", d)), s.pristine = {
        input: s,
        validators: c,
        params: a,
        messages: f,
        self: r
      };
    });
  }
  function A(e, n, i, s) {
    let c = R[i];
    if (c && (e.push(c), s)) {
      let a;
      if (i === "pattern")
        a = [s];
      else if (s.trim().startsWith("{") || s.trim().startsWith("["))
        try {
          const f = JSON.parse(s);
          a = Array.isArray(f) ? f : [f];
        } catch {
          a = s.split(",");
        }
      else
        a = s.split(",");
      a.unshift(null), n[i] = a;
    }
  }
  r.validate = (e = null, n = !1) => {
    let i = r.fields;
    e ? e instanceof HTMLElement ? i = [e.pristine] : (e instanceof NodeList || e instanceof (window.$ || Array) || Array.isArray(e)) && (i = Array.from(e).map((a) => a.pristine)) : y = !0;
    let s = !0;
    const c = [];
    for (let a = 0; i[a]; a++) {
      const f = i[a], d = r.validateField(f);
      d instanceof Promise ? c.push(
        d.then((u) => (u ? !n && w(f) : (s = !1, !n && x(f)), u))
      ) : d ? !n && w(f) : (s = !1, !n && x(f));
    }
    return c.length > 0 ? Promise.all(c).then(() => s) : Promise.resolve(s);
  }, r.getErrors = function(e) {
    if (!e) {
      let n = [];
      for (let i = 0; i < r.fields.length; i++) {
        let s = r.fields[i];
        s.errors.length && n.push({ input: s.input, errors: s.errors });
      }
      return n;
    }
    return e.tagName && e.tagName.toLowerCase() === "select" ? e.pristine.errors : e.length ? e[0].pristine.errors : e.pristine.errors;
  }, r.validateField = function(e) {
    let n = [], i = !0, s = [];
    for (let c = 0; e.validators[c]; c++) {
      let a = e.validators[c], f = e.params[a.name] ? [...e.params[a.name]] : [];
      f[0] = e.input.value, f.length > 1 ? f.splice(1, 0, e.input) : f.push(e.input);
      let d = a.fn.apply(null, f);
      if (d instanceof Promise)
        s.push(
          d.then((u) => {
            if (!u) {
              i = !1;
              let g = v(e, a, f);
              n.push(g);
            }
            return u;
          })
        );
      else if (!d) {
        i = !1;
        let u = v(e, a, f);
        if (n.push(u), a.halt === !0)
          break;
      }
    }
    return s.length > 0 ? Promise.all(s).then(() => (e.errors = n, i && n.length === 0)) : (e.errors = n, i);
  };
  function v(e, n, i) {
    if (typeof n.msg == "function")
      return n.msg(e.input.value, i, m);
    const s = [i[0], ...i.slice(2)];
    return n.msg === Object(n.msg) && n.msg[m] ? E(n.msg[m], ...s) : e.messages[m] && e.messages[m][n.name] ? E(e.messages[m][n.name], ...s) : h[m] && h[m][n.name] ? E(h[m][n.name], ...s) : typeof n.msg == "string" ? E(n.msg, ...s) : h[m] && h[m].default ? E(h[m].default, ...s) : `Validation failed for ${n.name}`;
  }
  r.addValidator = function(e, n, i, s, c) {
    e instanceof HTMLElement ? (e.pristine.validators.push({ fn: n, msg: i, priority: s, halt: c }), e.pristine.validators.sort((a, f) => f.priority - a.priority)) : console.warn("The parameter elem must be a dom element");
  };
  function P(e) {
    if (e.errorElements)
      return e.errorElements;
    let n = I(e.input, r.config.classTo), i = null, s = null;
    if (r.config.classTo === r.config.errorTextParent)
      i = n;
    else {
      if (!n) return [null, null];
      i = n.querySelector(
        "." + r.config.errorTextParent
      );
    }
    return i && (s = i.querySelector("." + L), s || (s = document.createElement(r.config.errorTextTag), s.className = L + " " + r.config.errorTextClass, i.appendChild(s), s.pristineDisplay = s.style.display)), e.errorElements = [n, s];
  }
  function x(e) {
    let n = P(e), i = n[0], s = n[1];
    i && (i.classList.remove(r.config.successClass), i.classList.add(r.config.errorClass)), s && (s.innerHTML = e.errors.join("<br/>"), s.style.display = s.pristineDisplay || "");
  }
  r.addError = function(e, n) {
    e = e.length ? e[0] : e, e.pristine.errors.push(n), x(e.pristine);
  }, r.removeError = function(e) {
    let n = P(e), i = n[0], s = n[1];
    return i && (i.classList.remove(r.config.errorClass), i.classList.remove(r.config.successClass)), s && (s.innerHTML = "", s.style.display = "none"), n;
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
    M = e;
  }, r;
}
q.addValidator = function(t, l, o, r, y) {
  p(t, { fn: l, msg: o, priority: r, halt: y });
};
q.addMessages = function(t, l) {
  let o = h.hasOwnProperty(t) ? h[t] : h[t] = {};
  Object.keys(l).forEach(function(r, y) {
    o[r] = l[r];
  });
};
q.setLocale = function(t) {
  m = t;
};
export {
  q as default
};
//# sourceMappingURL=pristine.js.map
