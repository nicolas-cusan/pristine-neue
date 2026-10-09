import Pristine from '../src/pristine';

const form = document.querySelector('form');

Pristine.addValidator(
  'async',
  async function () {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(false);
      }, 2000);
    });
  },
  'This name is already taken.',
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
