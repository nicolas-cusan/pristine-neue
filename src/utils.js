export function findAncestor(el, cls) {
  while ((el = el.parentElement) && !el.classList.contains(cls));
  return el;
}

export function tmpl(str, ...args) {
  if (typeof str !== 'string') return '';
  const replacements = [...args].shift;
  return str.replace(/\${(\d+)}/g, (match, index) => {
    return replacements[parseInt(index)] !== undefined
      ? replacements[parseInt(index)]
      : match;
  });
}

export function groupedElemCount(input) {
  const name = input.getAttribute('name');
  const baseName = name.replace(/\[\d*\]$/, '');

  return input.pristine.self.form.querySelectorAll(
    `input[name^="${baseName}["]:checked, input[name="${baseName}"]:checked`
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
