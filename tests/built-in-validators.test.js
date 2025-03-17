import { describe, test, expect, beforeEach } from 'vitest';
import Pristine from '../src/pristine.js';

describe('Pristine Built-in Validators', () => {
  let form;
  let pristine;

  beforeEach(() => {
    // Create a form with fields for testing built-in validators
    const fixture = createFormFixture(`
      <form id="form" novalidate method="post">
        <div class="field">
          <input id="required-text" type="text" required class="form-control" />
        </div>
        <div class="field">
          <input id="email" type="email" class="form-control" />
        </div>
        <div class="field">
          <input id="number" type="number" class="form-control" />
        </div>
        <div class="field">
          <input id="integer" type="text" data-pristine-type="integer" class="form-control" />
        </div>
        <div class="field">
          <input id="min-length" type="text" minlength="5" class="form-control" />
        </div>
        <div class="field">
          <input id="max-length" type="text" maxlength="10" class="form-control" />
        </div>
        <div class="field">
          <input id="min-value" type="number" min="5" class="form-control" />
        </div>
        <div class="field">
          <input id="max-value" type="number" max="10" class="form-control" />
        </div>
        <div class="field">
          <input id="pattern" type="text" pattern="^[A-Z]{3}\\d{3}$" class="form-control" />
        </div>
        <div class="field">
          <input id="password" type="password" class="form-control" />
        </div>
        <div class="field">
          <input id="confirm-password" type="password" data-pristine-equals="#password" class="form-control" />
        </div>
        <div class="field">
          <input id="checkbox1" type="checkbox" name="checkboxGroup" min="2" class="form-control" />
          <input id="checkbox2" type="checkbox" name="checkboxGroup" class="form-control" />
          <input id="checkbox3" type="checkbox" name="checkboxGroup" class="form-control" />
        </div>
      </form>
    `);

    form = document.getElementById('form');
    pristine = new Pristine(form);
  });

  test('should validate required fields', async () => {
    const requiredText = document.getElementById('required-text');

    // Empty required field should fail
    let result = await pristine.validate(requiredText);
    expect(result).toBe(false);

    // Non-empty required field should pass
    requiredText.value = 'Some text';
    result = await pristine.validate(requiredText);
    expect(result).toBe(true);
  });

  test('should validate email fields', async () => {
    const emailInput = document.getElementById('email');

    // Empty email is valid (not required)
    let result = await pristine.validate(emailInput);
    expect(result).toBe(true);

    // Invalid email formats
    const invalidEmails = [
      'plaintext',
      'missing@tld',
      '@missingname.com',
      'spaces in@email.com',
      'multiple..dots@email.com',
    ];

    for (const invalidEmail of invalidEmails) {
      emailInput.value = invalidEmail;
      result = await pristine.validate(emailInput);
      expect(result).toBe(false);
    }

    // Valid email formats
    const validEmails = [
      'simple@example.com',
      'very.common@example.com',
      'disposable.style.email.with+symbol@example.com',
      'other.email-with-hyphen@example.com',
      'fully-qualified-domain@example.com',
      'user.name+tag+sorting@example.com',
      'x@example.com',
      'example-indeed@strange-example.com',
    ];

    for (const validEmail of validEmails) {
      emailInput.value = validEmail;
      result = await pristine.validate(emailInput);
      expect(result).toBe(true);
    }
  });

  test('should validate number fields', async () => {
    const numberInput = document.getElementById('number');

    // Empty number is valid (not required)
    let result = await pristine.validate(numberInput);
    expect(result).toBe(true);

    // Valid numbers
    const validNumbers = [
      '0',
      '123',
      '-123',
      '0.5',
      '-0.5',
      '1e3',
      '-1e3',
      '1.5e3',
    ];

    for (const validNumber of validNumbers) {
      numberInput.value = validNumber;
      result = await pristine.validate(numberInput);
      expect(result).toBe(true);
    }

    // Invalid numbers
    const invalidNumbers = ['abc', '123abc', '123.456.789'];

    for (const invalidNumber of invalidNumbers) {
      numberInput.value = invalidNumber;
      result = await pristine.validate(numberInput);
      expect(result).toBe(false);
    }

    // Empty string should be valid (not required)
    numberInput.value = '';
    result = await pristine.validate(numberInput);
    expect(result).toBe(true);
  });

  test('should validate integer fields', async () => {
    const integerInput = document.getElementById('integer');

    // Empty integer is valid (not required)
    let result = await pristine.validate(integerInput);
    expect(result).toBe(true);

    // Valid integers
    const validIntegers = ['0', '123', '456789'];

    for (const validInteger of validIntegers) {
      integerInput.value = validInteger;
      result = await pristine.validate(integerInput);
      expect(result).toBe(true);
    }

    // Invalid integers
    const invalidIntegers = ['abc', '123.45', '-123', '1e3'];

    for (const invalidInteger of invalidIntegers) {
      integerInput.value = invalidInteger;
      result = await pristine.validate(integerInput);
      expect(result).toBe(false);
    }
  });

  test('should validate minlength', async () => {
    const minLengthInput = document.getElementById('min-length');

    // Empty input is valid (not required)
    let result = await pristine.validate(minLengthInput);
    expect(result).toBe(true);

    // Too short
    minLengthInput.value = 'abcd';
    result = await pristine.validate(minLengthInput);
    expect(result).toBe(false);

    // Exactly minimum length
    minLengthInput.value = 'abcde';
    result = await pristine.validate(minLengthInput);
    expect(result).toBe(true);

    // Longer than minimum
    minLengthInput.value = 'abcdefgh';
    result = await pristine.validate(minLengthInput);
    expect(result).toBe(true);
  });

  test('should validate maxlength', async () => {
    const maxLengthInput = document.getElementById('max-length');

    // Empty input is valid (not required)
    let result = await pristine.validate(maxLengthInput);
    expect(result).toBe(true);

    // Shorter than maximum
    maxLengthInput.value = 'abcde';
    result = await pristine.validate(maxLengthInput);
    expect(result).toBe(true);

    // Exactly maximum length
    maxLengthInput.value = 'abcdefghij';
    result = await pristine.validate(maxLengthInput);
    expect(result).toBe(true);

    // Too long
    maxLengthInput.value = 'abcdefghijk';
    result = await pristine.validate(maxLengthInput);
    expect(result).toBe(false);
  });

  test('should validate min value', async () => {
    const minValueInput = document.getElementById('min-value');

    // Empty input is valid (not required)
    let result = await pristine.validate(minValueInput);
    expect(result).toBe(true);

    // Below minimum
    minValueInput.value = '4';
    result = await pristine.validate(minValueInput);
    expect(result).toBe(false);

    // Exactly minimum
    minValueInput.value = '5';
    result = await pristine.validate(minValueInput);
    expect(result).toBe(true);

    // Above minimum
    minValueInput.value = '6';
    result = await pristine.validate(minValueInput);
    expect(result).toBe(true);
  });

  test('should validate max value', async () => {
    const maxValueInput = document.getElementById('max-value');

    // Empty input is valid (not required)
    let result = await pristine.validate(maxValueInput);
    expect(result).toBe(true);

    // Below maximum
    maxValueInput.value = '9';
    result = await pristine.validate(maxValueInput);
    expect(result).toBe(true);

    // Exactly maximum
    maxValueInput.value = '10';
    result = await pristine.validate(maxValueInput);
    expect(result).toBe(true);

    // Above maximum
    maxValueInput.value = '11';
    result = await pristine.validate(maxValueInput);
    expect(result).toBe(false);
  });

  test('should validate pattern', async () => {
    const patternInput = document.getElementById('pattern');

    // Empty input is valid (not required)
    let result = await pristine.validate(patternInput);
    expect(result).toBe(true);

    // Invalid patterns
    const invalidPatterns = ['abc', 'ABC', 'ABC12', 'abc123'];

    for (const invalidPattern of invalidPatterns) {
      patternInput.value = invalidPattern;
      result = await pristine.validate(patternInput);
      expect(result).toBe(false);
    }

    // Valid pattern (3 uppercase letters followed by 3 digits)
    patternInput.value = 'ABC123';
    result = await pristine.validate(patternInput);
    expect(result).toBe(true);
  });

  test('should validate equals', async () => {
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');

    // Both empty is valid
    let result = await pristine.validate(confirmPasswordInput);
    expect(result).toBe(true);

    // Different values
    passwordInput.value = 'password123';
    confirmPasswordInput.value = 'different';
    result = await pristine.validate(confirmPasswordInput);
    expect(result).toBe(false);

    // Same values
    confirmPasswordInput.value = 'password123';
    result = await pristine.validate(confirmPasswordInput);
    expect(result).toBe(true);
  });

  test('should validate checkbox min', async () => {
    const checkbox1 = document.getElementById('checkbox1');
    const checkbox2 = document.getElementById('checkbox2');
    const checkbox3 = document.getElementById('checkbox3');

    // No checkboxes checked (min is 2)
    let result = await pristine.validate(checkbox1);
    expect(result).toBe(false);

    // One checkbox checked
    checkbox1.checked = true;
    result = await pristine.validate(checkbox1);
    expect(result).toBe(false);

    // Two checkboxes checked
    checkbox2.checked = true;
    result = await pristine.validate(checkbox1);
    expect(result).toBe(true);

    // Three checkboxes checked
    checkbox3.checked = true;
    result = await pristine.validate(checkbox1);
    expect(result).toBe(true);
  });
});
