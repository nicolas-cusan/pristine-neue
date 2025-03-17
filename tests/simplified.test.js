import { describe, test, expect, beforeEach, vi } from 'vitest';
import Pristine from '../src/pristine.js';

describe('Pristine Core Functionality', () => {
  let form;
  let pristine;

  beforeEach(() => {
    // Create a basic form with various input types
    const fixture = createFormFixture(`
      <form id="form" novalidate method="post">
        <div class="field">
          <input id="text-input" type="text" class="form-control" />
        </div>
        <div class="field">
          <input id="email-input" type="email" class="form-control" />
        </div>
        <div class="field">
          <textarea id="textarea" class="form-control"></textarea>
        </div>
        <div class="field">
          <select id="select" class="form-control">
            <option value="">Please select</option>
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
          </select>
        </div>
        <button type="submit">Submit</button>
      </form>
    `);

    form = document.getElementById('form');
    pristine = new Pristine(form);
  });

  test('should initialize with default config', () => {
    expect(pristine.form).toBe(form);
    expect(pristine.config).toMatchObject({
      classTo: 'field',
      errorClass: 'error',
      successClass: 'success',
      errorTextParent: 'field',
      errorTextTag: 'div',
      errorTextClass: 'error-msg',
    });
  });

  test('should initialize with custom config', () => {
    const customConfig = {
      classTo: 'custom-field',
      errorClass: 'custom-error',
      successClass: 'custom-success',
      errorTextParent: 'custom-parent',
      errorTextTag: 'span',
      errorTextClass: 'custom-error-msg',
    };

    const customPristine = new Pristine(form, customConfig);

    expect(customPristine.config).toMatchObject(customConfig);
  });

  test('should add custom validator', async () => {
    const textInput = document.getElementById('text-input');

    // Add a custom validator
    pristine.addValidator(
      textInput,
      function (value) {
        return value === 'valid';
      },
      'Value must be "valid"'
    );

    // Test with invalid value
    textInput.value = 'invalid';
    let result = await pristine.validate(textInput);
    expect(result).toBe(false);

    // Test with valid value
    textInput.value = 'valid';
    result = await pristine.validate(textInput);
    expect(result).toBe(true);
  });

  test('should add and remove errors', async () => {
    const textInput = document.getElementById('text-input');

    // First add a validator to initialize the pristine object on the input
    pristine.addValidator(
      textInput,
      function (value) {
        return value === 'valid';
      },
      'Value must be "valid"'
    );

    // Validate to trigger error
    textInput.value = 'invalid';
    await pristine.validate(textInput);

    // Check error class is added
    const fieldElement = textInput.closest('.field');
    expect(fieldElement.classList.contains('error')).toBe(true);

    // Reset errors
    pristine.reset();

    // Check error classes are removed
    expect(fieldElement.classList.contains('error')).toBe(false);
  });

  test('should handle async validators', async () => {
    const textInput = document.getElementById('text-input');

    // Mock async validator
    const mockAsyncCheck = vi.fn().mockImplementation((value) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(value === 'async-valid');
        }, 100);
      });
    });

    // Add async validator
    pristine.addValidator(
      textInput,
      (value) => {
        return mockAsyncCheck(value);
      },
      'This value is not valid'
    );

    // Test with invalid value
    textInput.value = 'async-invalid';
    let result = await pristine.validate(textInput);
    expect(result).toBe(false);
    expect(mockAsyncCheck).toHaveBeenCalledWith('async-invalid');

    // Test with valid value
    vi.clearAllMocks();
    textInput.value = 'async-valid';
    result = await pristine.validate(textInput);
    expect(result).toBe(true);
    expect(mockAsyncCheck).toHaveBeenCalledWith('async-valid');
  });
});

describe('Pristine Localization', () => {
  let form;
  let pristine;

  beforeEach(() => {
    // Create a form with fields for testing localization
    const fixture = createFormFixture(`
      <form id="form" novalidate method="post">
        <div class="field">
          <input id="custom-message"
                 type="text"
                 data-pristine-required-message="This field is absolutely required"
                 data-pristine-required-message-fr="Ce champ est absolument requis"
                 class="form-control" />
        </div>
      </form>
    `);

    form = document.getElementById('form');
    pristine = new Pristine(form);
  });

  test('should use field-specific custom messages', async () => {
    const customMessageInput = document.getElementById('custom-message');

    // Add required validator with custom message
    pristine.addValidator(
      customMessageInput,
      function (value) {
        return value !== undefined && value !== '';
      },
      'This field is absolutely required'
    );

    // Validate with English locale
    await pristine.validate(customMessageInput);

    // Get error message
    const errorElement = customMessageInput
      .closest('.field')
      .querySelector('.pristine-error');
    expect(errorElement.textContent).toBe('This field is absolutely required');
  });
});
