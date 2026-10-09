import Pristine from 'pristine-neue';

export default function setup(form) {
  // #region usage
  // Register global validators before creating the instance
  Pristine.addValidator(
    'my-range',
    (value, el, min, max) => {
      if (value === '') return true;
      const number = Number(value);
      return number >= Number(min) && number <= Number(max);
    },
    'Enter a number from ${1} to ${2}',
    5,
    false
  );

  const pristine = new Pristine(form);
  // #endregion usage
  return pristine;
}
