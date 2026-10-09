# Documentation site: design

Date: 2026-10-09. Status: design approved in conversation; this written spec is awaiting review.

## Goal

Replace the old test page on GitHub Pages (https://nicolas-cusan.github.io/pristine-neue/) with real documentation. That means guide pages, an API reference and live examples you can type into.

The README stays complete; this was the user's decision. So the README and the docs site both document the full API and must be kept in sync.

## Decisions

- **Generator:** VitePress 1.6.4 with its default theme. It is the current stable release (2.x is still alpha) and builds on Vite 5.4, the same Vite as the library build.
- **README:** keep the full README, but fix its factual errors (see "README corrections").
- **Look:** a green brand accent and a check-mark logo.
- **npm package:** add `"files": ["dist", "src"]` to `package.json`, so docs, tests, workflows and CLAUDE.md stop being published.
- **Library fix:** validators added with `pristine.addValidator()` without a priority get priority 1, as the README already states.
- **Old test page:** remove it. The live examples replace it, and `pnpm dev` runs the docs site.

## Site structure

The VitePress source directory is `docs/`. The site is built into `dist-docs/` and served under `/pristine-neue/`.

| Page | File | Content |
| --- | --- | --- |
| Home | `docs/index.md` | Home layout. Hero: name, one-line pitch, "Get started" and GitHub buttons. Four features: uses the HTML attributes you already write; custom validators; async validation; translated messages. Below that, "Try it" with the `signup` demo. |
| Getting started | `docs/guide/getting-started.md` | Install with npm, pnpm or yarn (a code group). Load it from a CDN as ESM, or as UMD, whose global is lowercase `pristine`. The markup Pristine expects (`.field` wrappers). `new Pristine(form, config, live)` and validating on submit, with the full submit-handler pattern. Live validation, and what `liveAfterFirstValitation` does. Demos: `basic`, `live`. |
| Built-in validators | `docs/guide/built-in-validators.md` | Table of validators and how to enable each one (attribute or `data-pristine-*`). Notes: `equals` takes an `#id` selector; checkbox groups need the attribute on every checkbox; pattern escaping in HTML versus JS strings. Demos: `length`, `number`, `pattern`, `equals`, `checkboxes`. |
| Custom validators | `docs/guide/custom-validators.md` | Validators for one field (`pristine.addValidator`) and global ones (`Pristine.addValidator`, registered before `new Pristine`). How `data-pristine-*` values become arguments: pattern kept whole; JSON objects passed as one argument; JSON arrays spread into separate arguments; otherwise split on commas. Priority and `halt`. Async validators, which return a Promise. Demos: `custom-field`, `custom-global`, `async`. |
| Error messages & languages | `docs/guide/messages.md` | Per-field messages (`data-pristine-<name>-message`, `-message-<locale>`); placeholders (`${0}` is the value, `${1}`… are the parameters); function messages; `Pristine.addMessages` and `Pristine.setLocale`; the order Pristine picks a message in (from `_getErrorMessage`). Demos: `messages`, `locales`. |
| Styling | `docs/guide/styling.md` | The config options (`classTo`, `errorClass`, `successClass`, `errorTextParent`, `errorTextTag`, `errorTextClass`), the markup Pristine generates (shown as a code block), and example CSS. Demo: `custom-classes`. |
| API reference | `docs/api.md` | Constructor and config. Global methods: `addValidator`, `addMessages`, `setLocale`. Instance methods: `validate`, `addValidator`, `getErrors`, `addError`, `reset`, `destroy`, `setGlobalConfig`. Gives arguments, defaults and return values as the code implements them. |

**Nav:** Guide, API, a version label read from `package.json` (linking to GitHub releases), and social links for GitHub and npm.

**Sidebar:** a "Guide" group with the five guide pages, then a "Reference" group with API.

**Site features:** local search, an "Edit this page on GitHub" link pointing to `master`, and clean URLs. The footer reads "Released under the MIT License. A fork of PristineJS by sha256."

The docs describe what the code does. Where the README differs, the README gets fixed.

## Live examples

Each example is a pair of files in `docs/examples/`:

- `<name>.html` is the markup and includes the `<form>` element.
- `<name>.js` must not touch the DOM at import time, because pages are pre-rendered in Node:

  ```js
  import Pristine from 'pristine-neue';

  export default function setup(form) {
    // #region usage
    const pristine = new Pristine(form);
    // #endregion usage
    return pristine;
  }
  ```

  `pristine-neue` is a Vite alias for `src/pristine.js`, set in both the VitePress config and the Vitest config. The examples therefore run the local source, while the code shown looks like real usage.

The `<Demo name="…">` component (`docs/.vitepress/theme/Demo.vue`, registered globally):

- Finds the pair through `import.meta.glob` (eager; the HTML is imported with `?raw`) and renders the HTML with `v-html`, so it is pre-rendered.
- On mount, calls `setup(form)` and keeps the returned instance.
- Owns the submit handling: prevents the real submit, shows "Checking…", awaits `pristine.validate()`, then shows "Valid" or "Has errors" in an `aria-live="polite"` status line.
- Has a Reset button that runs `form.reset()`, then `pristine.reset()`, and clears the status.
- On unmount, calls `pristine.destroy()` and `Pristine.setLocale('en')`, because the locale is global.

Each demo is followed by a code group: `<<< @/examples/<name>.html` and `<<< @/examples/<name>.js#usage`. What the page shows is exactly what runs.

| Example | Page | Shows |
| --- | --- | --- |
| `signup` | Home | Name (required, min length 2), email, password (min length 8), confirmation (`equals`), terms checkbox (required). |
| `basic` | Getting started | Required text and email with default settings. |
| `live` | Getting started | `liveAfterFirstValitation: false`: errors appear while typing, before any submit. |
| `length` | Built-in | `minlength`, `maxlength`. |
| `number` | Built-in | `type="number"` with `min`/`max`, and `data-pristine-type="integer"`. |
| `pattern` | Built-in | `pattern` with a regex. |
| `equals` | Built-in | Password confirmation. |
| `checkboxes` | Built-in | A checkbox group with `min`/`max` on every checkbox. |
| `custom-field` | Custom | `pristine.addValidator(el, …)`: the first letter must be a capital. |
| `custom-global` | Custom | `Pristine.addValidator('my-range', …)` with `data-pristine-my-range="10,30"` and a `${1}`/`${2}` message. |
| `async` | Custom | Async "username taken" check with a fixed 600 ms delay; `admin` and `root` are taken. |
| `messages` | Messages | `data-pristine-required-message`, and a min-length message using `${1}`. |
| `locales` | Messages | Language buttons (en/de/fr). `setup` registers the German and French messages once with `addMessages`. Each button calls `setLocale`, then validates the form again. |
| `custom-classes` | Styling | A non-default config (`classTo`, `errorClass`, `errorTextTag`…). |

## Look

- The default VitePress theme, so dark mode and the mobile layout come for free.
- The brand colors are mapped to VitePress's green palette: `--vp-c-brand-1/2/3/soft` come from `--vp-c-green-*`.
- `docs/public/logo.svg` is a simple check mark, used as the nav logo and the favicon. The favicon `head` link needs the `/pristine-neue/` prefix.
- Demo styling lives in `docs/.vitepress/theme/custom.css`. Only VitePress CSS variables are used, so it works in light and dark mode:
  - inputs, labels and buttons
  - the `.field.error` and `.field.success` states (border colors)
  - `.pristine-error` text in the danger color
  - the status line

## Build, dev, deploy

- **Dependencies:** add `vitepress` (^1.6.4) and `vue` as devDependencies. With pnpm, `vue` must be a direct dependency, because the theme's `.vue` file imports it.
- **`docs/.vitepress/config.js`:**
  - `base: '/pristine-neue/'`
  - `outDir: '../dist-docs'`
  - `srcExclude: ['superpowers/**']`
  - `cleanUrls: true`
  - `vite.resolve.alias` for `pristine-neue`
  - plus nav, sidebar, search, editLink, socialLinks and footer
- **`docs/.vitepress/theme/index.js`:** extends `vitepress/theme`, registers `Demo` and imports `custom.css`.
- **`docs/public/.nojekyll`:** GitHub Pages deploys the `gh-pages` branch through Jekyll, which drops files whose names start with `_`.
- **`package.json` scripts:**
  - `dev` becomes `vitepress dev docs`
  - `build:docs` becomes `vitepress build docs`
  - `preview` becomes `vitepress preview docs`
  - `build`, `build:all` and the test scripts stay as they are
- **`vite.config.js`:** drop `root: 'docs'` (it only served the old test page) and make `entry`/`outDir` relative to the repo root. The library output in `dist/` must stay byte-identical; check this by rebuilding and diffing.
- **`vitest.config.js`:** add the same `pristine-neue` alias, so the example test can import the examples.
- **Delete:** `vite.config.docs.js`, `docs/index.html`, `docs/script.js`, `docs/style.css`.
- **`.gitignore`:** add `docs/.vitepress/cache`. `dist-docs` is already ignored.
- **`deploy-docs.yml`:** unchanged. It already runs `pnpm run build:docs` and deploys `dist-docs/`.
- **`run-tests.yml`:** add a "Build documentation" step, so a broken docs build fails on branches and PRs.

## Testing and verification

- **`tests/docs-examples.test.js`:** for every example pair, put the HTML in a fixture, run `setup(form)`, and expect an object with `validate`. Then `await pristine.validate()` must resolve to a boolean without throwing. Finally destroy the instance and reset the locale to `en`.
- **Library fix test (in `tests/custom-validators.test.js`):**
  1. Register a global validator with priority 0 that records whether it was called.
  2. Add a failing validator with `halt: true` and no priority through `pristine.addValidator`.
  3. Validate: the priority-0 validator must not run.

  This fails on the current code and passes with the fix.
- **Builds:** `pnpm build:docs` succeeds on Node 24 locally and on Node 26 (through mise). `pnpm build` leaves `dist/` unchanged apart from the library fix.
- **Visual check:** look at every page in a browser at desktop and phone width, in light and dark mode. Try each demo: an invalid submit, a valid submit, Reset, and the language switch. Also check that the deployed paths (`/pristine-neue/…`) resolve in `pnpm preview`.

## README corrections

All of these were checked against `src/pristine.js` and `dist/`:

- Add a link to the docs site at the top, and replace the "Living demo" section (it links to the original library's demo) with that link.
- **Script tag:** the example loads `dist/pristine.js`, which is ESM and fails in a classic `<script>`. Document `type="module"` with the ESM build, or the UMD build with the lowercase global `pristine`.
- **`getErrors()`** returns an array of `{ input, errors }`, not an object keyed by input.
- **JSON parameters:** arrays are spread into separate arguments; only objects are passed as one argument.
- **Global `Pristine.addValidator`:** add the missing `halt` row.
- **`addError(input, error)`:** `input` is required.
- **`setLocale`** affects every instance from the next validation on, not only new forms.
- **`setGlobalConfig`** replaces the defaults (it doesn't merge) and applies to instances created afterwards.
- **Default config block:** fix the comma placement, which makes it invalid JS.
- **Pattern note:** in HTML, write the regex as is; escape backslashes only inside JS strings.
- **Messages:** mention per-locale message attributes (`data-pristine-<name>-message-<locale>`).
- Fix typos: "prsitinejs", "con containinng", "Tipically", "spcific", "intance", "methids", "configuation", "error error".

## Library fix

In `src/pristine.js`, `self.addValidator` pushes `{ fn, msg, priority, halt }` with no default. Sorting with an `undefined` priority leaves the validator last, after the priority-0 `text` validator.

The fix: `priority === undefined ? 1 : priority`, matching the global `_()` helper. It goes in its own commit with a rebuilt `dist/`.

## CLAUDE.md updates

- **Commands:** `pnpm dev` now runs the docs site, and `pnpm preview` serves the built docs.
- **Docs layout:** VitePress in `docs/`, example pairs plus `<Demo>`, the `pristine-neue` alias, the base path, and `.nojekyll`.
- **Maintenance:** API changes need updates in both `README.md` and the docs, and the published package contains only `dist/` and `src/` (the `files` field).

## Out of scope

- Renaming the UMD global (a breaking change).
- Accessibility changes to Pristine's error markup, such as `aria-describedby`.
- Versioned docs, a custom domain, and translating the docs.
- Switching Pages to the Actions-based deployment.
