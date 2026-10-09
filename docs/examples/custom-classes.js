import Pristine from 'pristine-neue';

export default function setup(form) {
  // #region usage
  const pristine = new Pristine(form, {
    classTo: 'form-group',
    errorClass: 'has-danger',
    successClass: 'has-success',
    errorTextParent: 'form-group',
    errorTextTag: 'p',
    errorTextClass: 'text-help',
  });
  // #endregion usage
  return pristine;
}
