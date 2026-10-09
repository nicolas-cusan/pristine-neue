import Pristine from 'pristine-neue';

export default function setup(form) {
  // #region usage
  Pristine.addMessages('de', {
    required: 'Dieses Feld ist erforderlich',
    email: 'Bitte gib eine gültige E-Mail-Adresse ein',
  });
  Pristine.addMessages('fr', {
    required: 'Ce champ est obligatoire',
    email: 'Veuillez saisir une adresse e-mail valide',
  });

  const pristine = new Pristine(form);

  form.querySelectorAll('[data-locale]').forEach((button) => {
    button.addEventListener('click', () => {
      Pristine.setLocale(button.dataset.locale);
      pristine.validate();
    });
  });
  // #endregion usage

  // Highlight the selected language (only needed for this demo)
  form.querySelectorAll('[data-locale]').forEach((button) => {
    button.addEventListener('click', () => {
      form.querySelectorAll('[data-locale]').forEach((other) => {
        other.setAttribute('aria-pressed', String(other === button));
      });
    });
  });

  return pristine;
}
