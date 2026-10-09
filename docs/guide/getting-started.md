# Getting started

Pristine Neue checks forms in the browser. It reads the validation attributes on your fields, such as `required`, `type="email"` or `minlength`. It then shows a message next to every invalid field and tells you whether the whole form is valid.

## Installation

::: code-group

```sh [npm]
npm install pristine-neue
```

```sh [pnpm]
pnpm add pristine-neue
```

```sh [yarn]
yarn add pristine-neue
```

:::

Then import it:

```js
import Pristine from 'pristine-neue';
```

### Without a build step

Load the ES module build from a CDN:

```html
<script type="module">
  import Pristine from 'https://cdn.jsdelivr.net/npm/pristine-neue@1/dist/pristine.js';
</script>
```

Or load the UMD build with a classic script tag. It defines a global called `pristine`, in lowercase:

```html
<script src="https://unpkg.com/pristine-neue@1/dist/pristine.umd.cjs"></script>
<script>
  const Pristine = window.pristine;
</script>
```

::: tip
jsDelivr serves `.cjs` files with a content type that browsers refuse to run, so load the UMD build from unpkg, or from your own server with a JavaScript content type.
:::

## Your first form

Wrap each field and its label in an element with the class `field`. Pristine adds the class `error` or `success` to that wrapper and puts the error message inside it. You can change these class names, see [Styling](./styling).

<Demo name="basic" />

::: code-group

<<< @/examples/basic.html [HTML]

<<< @/examples/basic.js#usage [JavaScript]

:::

## Validate on submit

`validate()` checks every field, shows the messages and resolves to `true` when the form is valid. It always returns a Promise, because validators can be asynchronous.

```js
const form = document.querySelector('form');
const pristine = new Pristine(form);

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (await pristine.validate()) {
    form.submit();
  }
});
```

Pristine adds `novalidate` to the form, so the browser doesn't show its own error bubbles as well.

## Live validation

The constructor takes three arguments:

```js
new Pristine(form, config, live);
```

- `form` is the element that contains the fields. It doesn't have to be a `<form>`.
- `config` holds options, see the [API reference](../api#constructor). It's optional.
- `live` turns validation while typing on or off. It defaults to `true`.

By default, live validation starts after the first full `validate()` call, so nobody sees errors before they submit. Set `liveAfterFirstValitation` to `false` to check every field from the first keystroke. The option name is spelled this way in the library.

<Demo name="live" />

::: code-group

<<< @/examples/live.html [HTML]

<<< @/examples/live.js#usage [JavaScript]

:::

Pass `false` as the third argument to turn live validation off completely. Fields are then only checked when you call `validate()`.

## Which fields are checked

Pristine collects the fields when you create the instance: every `input`, `select` and `textarea` inside the form. It skips inputs that are `disabled`, of type `hidden`, `submit` or `button`, or marked with `data-pristine-ignore`.

Fields added to the page later aren't picked up. Call `destroy()` and create a new instance instead.
