import Pristine from 'pristine-neue';

export default function setup(form) {
  // #region usage
  // Stands in for a request to your server
  const isAvailable = (username) =>
    new Promise((resolve) => {
      setTimeout(() => resolve(!['admin', 'root'].includes(username)), 600);
    });

  Pristine.addValidator(
    'available',
    async (value) => value === '' || (await isAvailable(value)),
    'This username is already taken'
  );

  const pristine = new Pristine(form);
  // #endregion usage
  return pristine;
}
