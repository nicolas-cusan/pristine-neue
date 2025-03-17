import { describe, test, expect, beforeEach } from 'vitest';
import Pristine from '../src/pristine.js';

describe('Pristine Parameter Persistence', () => {
  let form;
  let pristine;

  beforeEach(() => {
    // Create a form with a field that has a custom validator with parameters
    const fixture = createFormFixture(`
      <form id="form" novalidate method="post">
        <div class="field">
          <input id="range-input" type="number" data-pristine-range="10,20" class="form-control" />
        </div>
      </form>
    `);

    form = document.getElementById('form');

    // Add a global validator for range checking
    Pristine.addValidator(
      'range',
      function (value, el, min, max) {
        if (!value) return true;
        const numValue = parseFloat(value);
        return numValue >= parseFloat(min) && numValue <= parseFloat(max);
      },
      'Value must be between ${1} and ${2}'
    );

    pristine = new Pristine(form);
  });

  test('should preserve validator parameters between validation runs', async () => {
    const rangeInput = document.getElementById('range-input');

    // First validation - value below range
    rangeInput.value = '5';
    let result = await pristine.validate(rangeInput);
    expect(result).toBe(false);

    // Second validation - value within range
    rangeInput.value = '15';
    result = await pristine.validate(rangeInput);
    expect(result).toBe(true);

    // Third validation - value above range
    rangeInput.value = '25';
    result = await pristine.validate(rangeInput);
    expect(result).toBe(false);

    // Fourth validation - back to within range
    rangeInput.value = '15';
    result = await pristine.validate(rangeInput);
    expect(result).toBe(true);
  });
});
