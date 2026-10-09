import Pristine from 'pristine-neue';

export default function setup(form) {
  // #region usage
  const pristine = new Pristine(form);

  pristine.addValidator(
    form.elements.city,
    (value) => value === '' || value[0] === value[0].toUpperCase(),
    'Start with a capital letter',
    2,
    false
  );
  // #endregion usage
  return pristine;
}
