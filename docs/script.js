import Pristine from '../src/pristine';

const form = document.querySelector('form');

Pristine.addValidator(
  'async',
  async function (val, endpointUrl, csrfToken) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(false);
      }, 2000);
    });
  },
  { msg: 'This email is already in use.' },
  5,
  false
);

const pristine = new Pristine(form, {});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const valid = await pristine.validate();
  if (!valid) {
    console.log('Form is invalid');
  }
});
