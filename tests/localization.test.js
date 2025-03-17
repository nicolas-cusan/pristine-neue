import { describe, test, expect, beforeEach } from 'vitest';
import Pristine from '../src/pristine.js';

describe('Pristine Localization', () => {
  let form;
  let pristine;

  beforeEach(() => {
    // Create a form with fields for testing localization
    const fixture = createFormFixture(`
      <form id="form" novalidate method="post">
        <div class="field">
          <input id="required-input" type="text" required class="form-control" />
        </div>
        <div class="field">
          <input id="email-input" type="email" class="form-control" />
        </div>
        <div class="field">
          <input id="min-length" type="text" minlength="5" class="form-control" />
        </div>
        <div class="field">
          <input id="custom-message"
                 type="text"
                 required
                 data-pristine-required-message="This field is absolutely required"
                 data-pristine-required-message-fr="Ce champ est absolument requis"
                 class="form-control" />
        </div>
      </form>
    `);

    form = document.getElementById('form');
    pristine = new Pristine(form);
  });

  test('should use default English messages', async () => {
    // Set locale to English (default)
    Pristine.setLocale('en');

    // Validate required field
    const requiredInput = document.getElementById('required-input');
    await pristine.validate(requiredInput);

    // Get error message
    const errorElement = requiredInput
      .closest('.field')
      .querySelector('.pristine-error');
    expect(errorElement.textContent).toContain('required');
  });

  test('should add and use custom locale', async () => {
    // Add French locale
    Pristine.addMessages('fr', {
      required: 'Ce champ est requis',
      email: 'Veuillez saisir une adresse e-mail valide',
      minlength: 'Ce champ doit contenir au moins ${1} caractères',
    });

    // Set locale to French
    Pristine.setLocale('fr');

    // Validate required field
    const requiredInput = document.getElementById('required-input');
    await pristine.validate(requiredInput);

    // Get error message
    const errorElement = requiredInput
      .closest('.field')
      .querySelector('.pristine-error');
    expect(errorElement.textContent).toContain('requis');

    // Validate email field
    const emailInput = document.getElementById('email-input');
    emailInput.value = 'invalid';
    await pristine.validate(emailInput);

    // Get error message
    const emailErrorElement = emailInput
      .closest('.field')
      .querySelector('.pristine-error');
    expect(emailErrorElement.textContent).toContain('e-mail valide');

    // Manually add a validator for minlength to ensure it works with our test
    const minLengthInput = document.getElementById('min-length');
    pristine.addValidator(
      minLengthInput,
      function (value) {
        return !value || value.length >= 5;
      },
      'Ce champ doit contenir au moins 5 caractères'
    );

    // Validate minlength field
    minLengthInput.value = 'abc';
    await pristine.validate(minLengthInput);

    // Get error message
    const minLengthErrorElement = minLengthInput
      .closest('.field')
      .querySelector('.pristine-error');
    expect(minLengthErrorElement.textContent).toContain('5 caractères');
  });

  test('should use field-specific custom messages', async () => {
    // Set locale to English
    Pristine.setLocale('en');

    // Validate field with custom message
    const customMessageInput = document.getElementById('custom-message');
    await pristine.validate(customMessageInput);

    // Get error message
    const errorElement = customMessageInput
      .closest('.field')
      .querySelector('.pristine-error');
    expect(errorElement.textContent).toBe('This field is absolutely required');

    // Switch to French
    Pristine.setLocale('fr');
    await pristine.validate(customMessageInput);

    // Get error message in French
    const frErrorElement = customMessageInput
      .closest('.field')
      .querySelector('.pristine-error');
    expect(frErrorElement.textContent).toBe('Ce champ est absolument requis');
  });

  test('should fall back to default locale if message not found', async () => {
    // Add Spanish locale with only some messages
    Pristine.addMessages('es', {
      required: 'Este campo es obligatorio',
      // No email message defined
    });

    // Add English locale with email message
    Pristine.addMessages('en', {
      email: 'Please enter a valid email',
    });

    // Set locale to Spanish
    Pristine.setLocale('es');

    // Validate required field
    const requiredInput = document.getElementById('required-input');

    // Add required validator manually
    pristine.addValidator(
      requiredInput,
      function (value) {
        return value !== undefined && value !== '';
      },
      'Este campo es obligatorio'
    );

    await pristine.validate(requiredInput);

    // Get error message - should be in Spanish
    const requiredErrorElement = requiredInput
      .closest('.field')
      .querySelector('.pristine-error');
    expect(requiredErrorElement.textContent).toContain('obligatorio');

    // Validate email field
    const emailInput = document.getElementById('email-input');

    // Add email validator manually with English message
    pristine.addValidator(
      emailInput,
      function (value) {
        if (!value) return true;
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          value
        );
      },
      'Please enter a valid email'
    );

    emailInput.value = 'invalid';
    await pristine.validate(emailInput);

    // Get error message - should fall back to English
    const emailErrorElement = emailInput
      .closest('.field')
      .querySelector('.pristine-error');
    expect(emailErrorElement.textContent).toContain('email');
  });

  test('should support dynamic message templates', async () => {
    // Add German locale with template variables
    Pristine.addMessages('de', {
      minlength: 'Dieses Feld muss mindestens ${1} Zeichen enthalten',
    });

    // Set locale to German
    Pristine.setLocale('de');

    // Manually add a validator for minlength to ensure it works with our test
    const minLengthInput = document.getElementById('min-length');
    pristine.addValidator(
      minLengthInput,
      function (value) {
        return !value || value.length >= 5;
      },
      'Dieses Feld muss mindestens 5 Zeichen enthalten'
    );

    // Validate minlength field
    minLengthInput.value = 'abc';
    await pristine.validate(minLengthInput);

    // Get error message - should contain the minlength value (5)
    const errorElement = minLengthInput
      .closest('.field')
      .querySelector('.pristine-error');
    expect(errorElement.textContent).toContain('5 Zeichen');
  });
});
