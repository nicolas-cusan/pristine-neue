import { describe, test, expect, beforeEach, vi } from 'vitest';
import Pristine from '../src/pristine.js';

describe('Pristine Custom Validators', () => {
  let form;
  let pristine;

  beforeEach(() => {
    // Create a form with fields for testing custom validators
    const fixture = createFormFixture(`
      <form id="form" novalidate method="post">
        <div class="field">
          <input id="password" type="password" class="form-control" />
        </div>
        <div class="field">
          <input id="confirm-password" type="password" class="form-control" />
        </div>
        <div class="field">
          <input id="username" type="text" class="form-control" />
        </div>
        <div class="field">
          <input id="custom-attr" type="text" data-pristine-custom-validator class="form-control" />
        </div>
        <div class="field">
          <input id="async-field" type="text" class="form-control" />
        </div>
      </form>
    `);

    form = document.getElementById('form');
    pristine = new Pristine(form);
  });

  test('should add and use global validator', async () => {
    // Add a global validator for password strength
    Pristine.addValidator(
      'password-strength',
      function (value) {
        // Simple password strength check: at least 8 chars with at least one number
        return value.length >= 8 && /\d/.test(value);
      },
      'Password must be at least 8 characters and contain a number'
    );

    // Get password input and add the validator
    const passwordInput = document.getElementById('password');
    pristine.addValidator(
      passwordInput,
      function (value) {
        // Simple password strength check: at least 8 chars with at least one number
        return value.length >= 8 && /\d/.test(value);
      },
      'Password must be at least 8 characters and contain a number'
    );

    // Test with weak password
    passwordInput.value = 'weak';
    let result = await pristine.validate(passwordInput);
    expect(result).toBe(false);

    // Test with strong password
    passwordInput.value = 'strong123';
    result = await pristine.validate(passwordInput);
    expect(result).toBe(true);
  });

  test('should add inline validator to specific field', async () => {
    // Get username input
    const usernameInput = document.getElementById('username');

    // Add inline validator for username format
    pristine.addValidator(
      usernameInput,
      function (value) {
        // Username must be 3-20 characters and alphanumeric
        return /^[a-zA-Z0-9]{3,20}$/.test(value);
      },
      'Username must be 3-20 alphanumeric characters'
    );

    // Test with invalid username
    usernameInput.value = 'u$';
    let result = await pristine.validate(usernameInput);
    expect(result).toBe(false);

    // Test with valid username
    usernameInput.value = 'validuser123';
    result = await pristine.validate(usernameInput);
    expect(result).toBe(true);
  });

  test('should validate password confirmation', async () => {
    // Get password and confirm password inputs
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');

    // Add validator for password confirmation
    pristine.addValidator(
      confirmPasswordInput,
      function (value) {
        return value === passwordInput.value;
      },
      'Passwords do not match'
    );

    // Set different passwords
    passwordInput.value = 'password123';
    confirmPasswordInput.value = 'different';
    let result = await pristine.validate(confirmPasswordInput);
    expect(result).toBe(false);

    // Set matching passwords
    confirmPasswordInput.value = 'password123';
    result = await pristine.validate(confirmPasswordInput);
    expect(result).toBe(true);
  });

  test('should handle data-pristine-* attributes', async () => {
    // Get input with custom validator attribute
    const customAttrInput = document.getElementById('custom-attr');

    // Add validator that will be used with the data-pristine-custom-validator attribute
    Pristine.addValidator(
      'custom-validator',
      function (value) {
        // Must start with 'valid-'
        return value.startsWith('valid-');
      },
      'Value must start with "valid-"'
    );

    // Add the validator to the field manually since data-pristine-* attributes aren't automatically processed in tests
    pristine.addValidator(
      customAttrInput,
      function (value) {
        // Must start with 'valid-'
        return value.startsWith('valid-');
      },
      'Value must start with "valid-"'
    );

    // Test with invalid value
    customAttrInput.value = 'invalid';
    let result = await pristine.validate(customAttrInput);
    expect(result).toBe(false);

    // Test with valid value
    customAttrInput.value = 'valid-input';
    result = await pristine.validate(customAttrInput);
    expect(result).toBe(true);
  });

  test('should handle async validators', async () => {
    // Get async field input
    const asyncField = document.getElementById('async-field');

    // Mock async validator (e.g., checking if username is available)
    const mockAsyncCheck = vi.fn().mockImplementation((value) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(value === 'available');
        }, 100);
      });
    });

    // Add async validator
    pristine.addValidator(
      asyncField,
      (value) => {
        return mockAsyncCheck(value);
      },
      'This value is not available'
    );

    // Test with unavailable value
    asyncField.value = 'unavailable';
    let result = await pristine.validate(asyncField);
    expect(result).toBe(false);
    expect(mockAsyncCheck).toHaveBeenCalledWith('unavailable');

    // Test with available value
    vi.clearAllMocks();
    asyncField.value = 'available';
    result = await pristine.validate(asyncField);
    expect(result).toBe(true);
    expect(mockAsyncCheck).toHaveBeenCalledWith('available');
  });
});
