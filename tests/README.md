# Pristine Neue Tests

This directory contains tests for the Pristine Neue form validation library using Vitest.

## Test Structure

The tests are organized into several files:

- `core.test.js` - Tests for core functionality of the library
- `built-in-validators.test.js` - Tests for all built-in validators
- `custom-validators.test.js` - Tests for custom validator functionality
- `localization.test.js` - Tests for internationalization and localization features

## Running Tests

You can run the tests using the following npm scripts:

```bash
# Run all tests once
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Environment

Tests use JSDOM to simulate a browser environment. The test setup is configured in `setup.js`, which provides helper functions for creating and cleaning up DOM fixtures.

## Writing New Tests

When writing new tests:

1. Use the `createFormFixture()` helper to set up your DOM elements
2. Tests are automatically cleaned up after each test
3. Use async/await for validation tests since Pristine supports async validation
4. Group related tests in describe blocks
5. Use descriptive test names that explain what is being tested

Example:

```javascript
import { describe, test, expect } from 'vitest';
import Pristine from '../src/pristine.js';

describe('My Feature', () => {
  let form;
  let pristine;

  beforeEach(() => {
    const fixture = createFormFixture(`
      <form id="form">
        <div class="field">
          <input id="my-input" type="text" />
        </div>
      </form>
    `);

    form = document.getElementById('form');
    pristine = new Pristine(form);
  });

  test('should do something', async () => {
    // Test code here
  });
});
```
