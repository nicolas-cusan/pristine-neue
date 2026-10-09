import Pristine from 'pristine-neue';

export default function setup(form) {
  // #region usage
  const pristine = new Pristine(form, { liveAfterFirstValitation: false });
  // #endregion usage
  return pristine;
}
