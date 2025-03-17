import { describe, test, expect, beforeEach } from 'vitest';
import Pristine from '../src/pristine.js';

describe('Pristine Custom Validator Messages', () => {
  let form;
  let pristine;

  beforeEach(() => {
    // Create a form with a field that has a custom validator
    const fixture = createFormFixture(`
      <form id="form" novalidate method="post">
        <div class="field">
          <input id="custom-validator" type="text" data-pristine-custom-test class="form-control" />
        </div>
        <div class="field">
          <input id="custom-validator-no-message" type="text" data-pristine-custom-no-message class="form-control" />
        </div>
        <div class="field">
          <input id="custom-validator-with-lang" type="text" data-pristine-custom-lang class="form-control" />
        </div>
      </form>
    `);

    form = document.getElementById('form');

    // Add a global validator with a message
    Pristine.addValidator(
      'custom-test',
      function (value) {
        return value === 'valid';
      },
      'Value must be "valid", got "${0}"'
    );

    // Add a global validator without a message
    Pristine.addValidator('custom-no-message', function (value) {
      return value === 'valid';
    });

    // Add a global validator that will use a message from the language file
    Pristine.addValidator('custom-lang', function (value) {
      return value === 'valid';
    });

    // Add a message to the language file
    Pristine.addMessages('en', {
      'custom-lang':
        'Value must be "valid" according to language file, got "${0}"',
    });

    pristine = new Pristine(form);
  });

  test('should display custom validator message', async () => {
    const customValidator = document.getElementById('custom-validator');

    // Set an invalid value
    customValidator.value = 'invalid';

    // Validate and check for error message
    await pristine.validate(customValidator);

    // Get error message element
    const errorElement = customValidator
      .closest('.field')
      .querySelector('.pristine-error');

    // Check that the error message contains the expected text
    expect(errorElement.textContent).toContain('Value must be "valid"');
    expect(errorElement.textContent).toContain('invalid');
  });

  test('should display default message for validator without message', async () => {
    const customValidatorNoMessage = document.getElementById(
      'custom-validator-no-message'
    );

    // Manually add the validator to the field
    pristine.addValidator(customValidatorNoMessage, function (value) {
      return value === 'valid';
    });

    // Set an invalid value
    customValidatorNoMessage.value = 'invalid';

    // Validate and check for error message
    await pristine.validate(customValidatorNoMessage);

    // Get error message element
    const errorElement = customValidatorNoMessage
      .closest('.field')
      .querySelector('.pristine-error');

    // Check that the error message is the default message from the language file
    expect(errorElement.textContent).toBe('Please enter a correct value');
  });

  test('should display message from language file', async () => {
    const customValidatorWithLang = document.getElementById(
      'custom-validator-with-lang'
    );

    // Set an invalid value
    customValidatorWithLang.value = 'invalid';

    // Validate and check for error message
    await pristine.validate(customValidatorWithLang);

    // Get error message element
    const errorElement = customValidatorWithLang
      .closest('.field')
      .querySelector('.pristine-error');

    // Check that the error message contains the expected text from language file
    expect(errorElement.textContent).toContain('according to language file');
    expect(errorElement.textContent).toContain('invalid');
  });
});
