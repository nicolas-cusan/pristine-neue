export function findAncestor(el, cls) {
  while ((el = el.parentElement) && !el.classList.contains(cls));
  return el;
}

export function tmpl(str, ...args) {
  if (typeof str !== 'string') return '';
  return str.replace(/\${(\d+)}/g, (match, index) => {
    return args[parseInt(index)] !== undefined ? args[parseInt(index)] : match;
  });
}

export function groupedElemCount(input) {
  return input.pristine.self.form.querySelectorAll(
    'input[name="' + input.getAttribute('name') + '"]:checked'
  ).length;
}

export function mergeConfig(obj1, obj2) {
  for (let attr in obj2) {
    if (!(attr in obj1)) {
      obj1[attr] = obj2[attr];
    }
  }
  return obj1;
}
