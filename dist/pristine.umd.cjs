(function(d,y){typeof exports=="object"&&typeof module<"u"?module.exports=y():typeof define=="function"&&define.amd?define(y):(d=typeof globalThis<"u"?globalThis:d||self,d.pristine=y())})(this,function(){"use strict";const d={en:{required:"This field is required",email:"This field requires a valid e-mail address",number:"This field requires a number",integer:"This field requires an integer value",url:"This field requires a valid website URL",tel:"This field requires a valid telephone number",maxlength:"This fields length must be < ${1}",minlength:"This fields length must be > ${1}",min:"Minimum value for this field is ${1}",max:"Maximum value for this field is ${1}",pattern:"Please match the requested format",equals:"The two fields do not match",default:"Please enter a correct value"}};function y(t,l){for(;(t=t.parentElement)&&!t.classList.contains(l););return t}function E(t,...l){return typeof t!="string"?"":t.replace(/\${(\d+)}/g,(o,r)=>l[parseInt(r)]!==void 0?l[parseInt(r)]:o)}function b(t){return t.pristine.self.form.querySelectorAll('input[name="'+t.getAttribute("name")+'"]:checked').length}const P={classTo:"field",errorClass:"error",successClass:"success",errorTextParent:"field",errorTextTag:"div",errorTextClass:"error-msg",liveAfterFirstValitation:!0},L="pristine-error",S="input:not([disabled]):not([type^=hidden]):not([type^=submit]):not([type^=button]):not([data-pristine-ignore]), select, textarea",N=["required","min","max","minlength","maxlength","pattern"],O=/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,$=/-message(?:-([a-z]{2}(?:_[A-Z]{2})?))?/;let p="en";const w={},m=(t,l)=>{l.name=t,l.priority===void 0&&(l.priority=1),w[t]=l};m("text",{fn:(t,l)=>!0,priority:0}),m("required",{fn:(t,l)=>l.type==="radio"||l.type==="checkbox"?b(l):t!==void 0&&t!=="",priority:99,halt:!0}),m("email",{fn:(t,l)=>!t||O.test(t)}),m("number",{fn:(t,l)=>!t||!isNaN(parseFloat(t)),priority:2}),m("integer",{fn:(t,l)=>!t||/^\d+$/.test(t)}),m("minlength",{fn:(t,l,o)=>!t||t.length>=parseInt(o)}),m("maxlength",{fn:(t,l,o)=>!t||t.length<=parseInt(o)}),m("min",{fn:(t,l,o)=>!t||(l.type==="checkbox"?b(l)>=parseInt(o):parseFloat(t)>=parseFloat(o))}),m("max",{fn:(t,l,o)=>!t||(l.type==="checkbox"?b(l)<=parseInt(o):parseFloat(t)<=parseFloat(o))}),m("pattern",{fn:(t,l,o)=>{if(!t)return!0;let r=typeof o=="string"?o.match(new RegExp("^/(.*?)/([gimy]*)$")):null;return r?new RegExp(r[1],r[2]).test(t):new RegExp(o).test(t)}}),m("equals",{fn:(t,l,o)=>{let r;return typeof o=="string"&&o.startsWith("#")?r=document.querySelector(o):o instanceof HTMLElement&&(r=o),r&&(!t&&!r.value||r.value===t)}});function x(t,l,o=!0){const r=this;let T=!1;F(t,l,o);function F(e,s,i){e.setAttribute("novalidate","true"),r.form=e,r.config={...P,...s||{}},r.live=i!==!1,r.fields=Array.from(e.querySelectorAll(S)).map(n=>{const c=[],a={},f={};Array.from(n.attributes).forEach(u=>{if(/^data-pristine-/.test(u.name)){let h=u.name.substr(14);const A=h.match($);if(A!==null){const v=A[1]===void 0?"en":A[1];f.hasOwnProperty(v)||(f[v]={}),f[v][h.slice(0,h.length-A[0].length)]=u.value;return}let I=u.value;h==="type"&&(h=I),C(c,a,h,I)}else N.includes(u.name)?C(c,a,u.name,u.value):u.name==="type"&&C(c,a,u.value)}),c.sort((u,h)=>h.priority-u.priority);const g=u=>{r.config.liveAfterFirstValitation&&T?r.validate(u.target):r.config.liveAfterFirstValitation||r.validate(u.target)};return r.live&&(n.addEventListener("change",g),["radio","checkbox"].includes(n.getAttribute("type"))||n.addEventListener("input",g)),n.pristine={input:n,validators:c,params:a,messages:f,self:r}})}function C(e,s,i,n){let c=w[i];if(c&&(e.push(c),n)){let a;if(i==="pattern")a=[n];else if(n.trim().startsWith("{")||n.trim().startsWith("["))try{const f=JSON.parse(n);a=Array.isArray(f)?f:[f]}catch{a=n.split(",")}else a=n.split(",");a.unshift(null),s[i]=a}}r.validate=(e=null,s=!1)=>{let i=r.fields;e?e instanceof HTMLElement?i=[e.pristine]:(e instanceof NodeList||e instanceof(window.$||Array)||Array.isArray(e))&&(i=Array.from(e).map(a=>a.pristine)):T=!0;let n=!0;const c=[];for(let a=0;i[a];a++){const f=i[a],g=r.validateField(f);g instanceof Promise?c.push(g.then(u=>(u?!s&&_(f):(n=!1,!s&&q(f)),u))):g?!s&&_(f):(n=!1,!s&&q(f))}return c.length>0?Promise.all(c).then(()=>n):Promise.resolve(n)},r.getErrors=function(e){if(!e){let s=[];for(let i=0;i<r.fields.length;i++){let n=r.fields[i];n.errors.length&&s.push({input:n.input,errors:n.errors})}return s}return e.tagName&&e.tagName.toLowerCase()==="select"?e.pristine.errors:e.length?e[0].pristine.errors:e.pristine.errors},r.validateField=function(e){let s=[],i=!0,n=[];for(let c=0;e.validators[c];c++){let a=e.validators[c],f=e.params[a.name]?e.params[a.name]:[];f[0]=e.input.value,f.length>1?f.splice(1,0,e.input):f.push(e.input);let g=a.fn.apply(null,f);if(g instanceof Promise)n.push(g.then(u=>{if(!u){i=!1;let h=M(e,a,f);s.push(h)}return u}));else if(!g){i=!1;let u=M(e,a,f);if(s.push(u),a.halt===!0)break}}return n.length>0?Promise.all(n).then(()=>(e.errors=s,i&&s.length===0)):(e.errors=s,i)};function M(e,s,i){return typeof s.msg=="function"?s.msg(e.input.value,i):typeof s.msg=="string"?E(s.msg,...i):s.msg===Object(s.msg)&&s.msg[p]?E(s.msg[p],...i):e.messages[p]&&e.messages[p][s.name]?E(e.messages[p][s.name],...i):d[p]&&d[p][s.name]?E(d[p][s.name],...i):E(d[p].default,...i)}r.addValidator=function(e,s,i,n,c){e instanceof HTMLElement?(e.pristine.validators.push({fn:s,msg:i,priority:n,halt:c}),e.pristine.validators.sort((a,f)=>f.priority-a.priority)):console.warn("The parameter elem must be a dom element")};function R(e){if(e.errorElements)return e.errorElements;let s=y(e.input,r.config.classTo),i=null,n=null;if(r.config.classTo===r.config.errorTextParent)i=s;else{if(!s)return[null,null];i=s.querySelector("."+r.config.errorTextParent)}return i&&(n=i.querySelector("."+L),n||(n=document.createElement(r.config.errorTextTag),n.className=L+" "+r.config.errorTextClass,i.appendChild(n),n.pristineDisplay=n.style.display)),e.errorElements=[s,n]}function q(e){let s=R(e),i=s[0],n=s[1];i&&(i.classList.remove(r.config.successClass),i.classList.add(r.config.errorClass)),n&&(n.innerHTML=e.errors.join("<br/>"),n.style.display=n.pristineDisplay||"")}r.addError=function(e,s){e=e.length?e[0]:e,e.pristine.errors.push(s),q(e.pristine)},r.removeError=function(e){let s=R(e),i=s[0],n=s[1];return i&&(i.classList.remove(r.config.errorClass),i.classList.remove(r.config.successClass)),n&&(n.innerHTML="",n.style.display="none"),s};function _(e){let s=r.removeError(e)[0];s&&s.classList.add(r.config.successClass)}return r.reset=function(){for(let e=0;r.fields[e];e++)r.fields[e].errorElements=null;Array.from(r.form.querySelectorAll("."+L)).map(function(e){e.parentNode.removeChild(e)}),Array.from(r.form.querySelectorAll("."+r.config.classTo)).map(function(e){e.classList.remove(r.config.successClass),e.classList.remove(r.config.errorClass)})},r.destroy=function(){r.reset(),r.fields.forEach(function(e){delete e.input.pristine}),r.fields=[]},r.setGlobalConfig=function(e){P=e},r}return x.addValidator=function(t,l,o,r,T){m(t,{fn:l,msg:o,priority:r,halt:T})},x.addMessages=function(t,l){let o=d.hasOwnProperty(t)?d[t]:d[t]={};Object.keys(l).forEach(function(r,T){o[r]=l[r]})},x.setLocale=function(t){p=t},x});
//# sourceMappingURL=pristine.umd.cjs.map
