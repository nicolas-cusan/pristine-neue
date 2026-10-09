# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

`pristine-neue` is a dependency-free vanilla JS form validation library published to npm. It is a fork of [PristineJS](https://github.com/sha256/Pristine). The library is `src/pristine.js`, plus the small helper files `src/utils.js` and `src/lang.js` (default English messages). `README.md` is the user-facing API reference. `README.html` is an old VS Code export that is no longer updated, so edit `README.md`.

## Commands

Dependencies are installed with pnpm. `pnpm-lock.yaml` is the only lockfile, so don't create a `package-lock.json`.

```sh
pnpm install
pnpm test                                              # vitest run (jsdom)
pnpm test:watch
pnpm test:coverage                                     # covers src/ only; report in coverage/
pnpm vitest run tests/core.test.js                     # one file
pnpm vitest run tests/core.test.js -t "custom config"  # tests whose names match
pnpm build                                             # dist/pristine.js (ESM) + dist/pristine.umd.cjs (UMD)
pnpm build:docs                                        # demo page from docs/ -> dist-docs/
pnpm dev                                               # Vite dev server rooted at docs/: a manual playground; docs/script.js imports ../src
```

There is no lint or format script.

## Architecture

The whole library is a single constructor function in `src/pristine.js`.

- **Module-level global state.** The validator registry (`validators`), `currentLocale`, the `lang` message table and `defaultConfig` are module singletons. `Pristine.addValidator(name, …)`, `Pristine.addMessages` and `Pristine.setLocale` change them for every instance. So does the instance method `setGlobalConfig`, which *replaces* `defaultConfig` instead of merging into it. These changes also carry over to later tests in the same file, because Vitest only isolates modules between files.
- **Everything is resolved in the constructor.** `new Pristine(form, config, live)` collects fields once, using `SELECTOR`. It then parses each field's attributes into a validator list sorted by descending `priority`. Three kinds of attribute are read: `data-pristine-<name>[="args"]`, the native attributes listed in `ALLOWED_ATTRIBUTES`, and `type`/`data-pristine-type`. A type value is looked up as a validator name and is ignored if no such validator is registered. Note that `lang.js` has `url`/`tel` messages but there are no validators with those names. Global validators registered after construction aren't applied to existing instances, and neither are fields added to the DOM later.
- **Per-field state lives on the DOM node** as `input.pristine`. It holds `validators`, `params` and `messages`, and later `errors` and the cached `errorElements`. It also holds `self`, the owning instance, which `groupedElemCount` uses to count the checked radios or checkboxes that share a name (`name`, `name[]`, `name[0]`).
- **Validator call signature.** Attribute values are stored as `params[name] = [null, ...args]`. A `pattern` value is kept whole, a value starting with `{` or `[` is JSON-parsed, and anything else is split on commas. On each run the stored array is copied (mutating it in place was a past bug). The copy gets the value at index 0 and the element spliced in at index 1, so validators are called as `fn(value, el, ...args)`. In message templates, `${0}` is the value and `${1}…` are the args, with the element left out. A function `msg` instead receives the raw `params` array, element included. Changes to this index bookkeeping have caused regressions before, so cover them with tests.
- **Error message resolution** (`_getErrorMessage`) uses the first of these that exists:
  1. a function `msg`
  2. a `msg` object keyed by locale
  3. the field's `data-pristine-<name>-message[-<locale>]` attribute (one without a locale suffix is stored under `en`, so it only applies while the locale is `en`)
  4. `lang[locale][name]`
  5. a string `msg`
  6. `lang[locale].default`
  7. a generic fallback
- **Async.** A validator may return a Promise. `validateField` returns either a boolean or a Promise, and `validate()` always returns `Promise<boolean>`. `halt` stops the remaining validators on a field only when a validator fails *synchronously*. `required` has `halt` set and priority 99.
- **Live validation** listens to `change` on every field, plus `input` on fields that aren't radios or checkboxes. The config key `liveAfterFirstValitation` is misspelled, but it is public config, so don't rename it. When it is `true` (the default), live validation only starts after a full-form `validate()` call with no arguments.
- **Error DOM.** `errorClass`/`successClass` go on the nearest ancestor that has the `classTo` class. The message element gets the class `pristine-error` plus `errorTextClass`. It is created inside the `errorTextParent` element and cached on the field. `reset()` clears that cache and removes those elements.

## Build & release

- `dist/` is committed. Source fixes run `pnpm build` and commit the rebuilt `dist/` together with the `src/` change.
- `module` → `dist/pristine.js` and `main` → `dist/pristine.umd.cjs`. The UMD global is `pristine` (lowercase).
- Version bumps are separate commits whose message is just the version (e.g. `1.1.9`), tagged `v1.1.9`, the way `npm version` makes them.
- CI in `.github/workflows/` also installs with pnpm 9 (via `pnpm/action-setup`). `run-tests.yml` runs on every push. `deploy-docs.yml` pushes `dist-docs/` to the `gh-pages` branch on pushes to `master`. `publish.yml` runs `npm publish` when a GitHub release is created. It authenticates through npm trusted publishing (OIDC), not a token. The trusted publisher configured on npmjs.com is tied to the file name `publish.yml`, so renaming that file breaks publishing.

## Tests

`tests/setup.js` defines the global `createFormFixture(html)`. It appends a `#fixture` container to `document.body`, which is removed automatically after each test. Validation is always async, so `await pristine.validate(...)`.

jsdom, like browsers, empties any non-numeric value assigned to a `type="number"` input, so the validator never sees it. To test invalid numeric strings, use a text input with `data-pristine-type="number"`.
