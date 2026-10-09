import { describe, test, expect, afterEach } from 'vitest';
import Pristine from 'pristine-neue';

const markup = import.meta.glob('../docs/examples/*.html', {
  query: '?raw',
  import: 'default',
  eager: true,
});
const setups = import.meta.glob('../docs/examples/*.js', {
  import: 'default',
  eager: true,
});

const names = Object.keys(setups).map(
  (path) => path.match(/([\w-]+)\.js$/)[1]
);

describe('docs examples', () => {
  afterEach(() => {
    // The locales example switches the global language
    Pristine.setLocale('en');
  });

  test('there are examples', () => {
    expect(names.length).toBeGreaterThan(0);
  });

  test.each(names)('%s sets up and validates', async (name) => {
    const html = markup[`../docs/examples/${name}.html`];
    expect(html).toBeTypeOf('string');

    createFormFixture(html);
    const form = document.querySelector('#fixture form');
    const pristine = setups[`../docs/examples/${name}.js`](form);

    expect(pristine.validate).toBeTypeOf('function');
    await expect(pristine.validate()).resolves.toBeTypeOf('boolean');

    pristine.destroy();
  });
});
