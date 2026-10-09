# Pristine Neue - Vanilla javascript form validation library

**Documentation and live examples: https://nicolas-cusan.github.io/pristine-neue/**

## Credits

This library is a fork of [PristineJS](https://github.com/sha256/Pristine) by [sha256](https://github.com/sha256)

## Live demo

Try every validator in the [documentation](https://nicolas-cusan.github.io/pristine-neue/).

## Installation

```sh
$ npm install pristine-neue --save
```

## Usage

Import it in your JavaScript:

```js
import Pristine from 'pristine-neue';
```

Or load it in the browser without a build step, either as an ES module:

```html
<script type="module">
  import Pristine from 'https://cdn.jsdelivr.net/npm/pristine-neue@1/dist/pristine.js';
</script>
```

or with a classic script tag. The UMD build defines a global named `pristine` (lowercase). Load it from unpkg: jsDelivr serves `.cjs` files with a content type that browsers refuse to run.

```html
<script src="https://unpkg.com/pristine-neue@1/dist/pristine.umd.cjs"></script>
<script>
  const Pristine = window.pristine;
</script>
```

Create a Pristine instance and handle the submission.

```js
document.addEventListener('DOMContentLoaded', () => {
  var form = document.getElementById('form1');
  var pristine = new Pristine(form);

  // Handle the form submission
  form.addEventListener('submit', async (e) => {
    // The validate method return as Promise that resolves to true / false
    const valid = await pristine.validate();

    if (valid) {
      // Submit the form..
    }
  });
});
```

Pristine automatically validates `required, min, max, minlength, maxlength, pattern` attributes and the value of type attributes
like `email, number` and more..

`Pristine` takes `3` parameters

- **form** The DOM element containing the fields to validate. Typically a form element, but it can be any DOM element.
- **config** An object containing the configuration. [See default configuration](#default-configuration).
- **live** A boolean value indicating whether pristine should validate as you type, default is `true`.

## Adding custom validators

You can add custom validators to a specific Pristine instance or add them globally.

### Adding a custom validator to an instance

```javascript
var pristine = new Pristine(document.getElementById('form'));

var elem = document.getElementById('email');

// A validator to check if the first letter is capitalized
pristine.addValidator(
  elem,
  (value) => {
    if (value.length && value[0] === value[0].toUpperCase()) {
      return true;
    }
    return false;
  },
  'The first character must be capitalized',
  2,
  false
);
```

### Adding a global custom validator

Global validators must be added before creating the pristine instance

```javascript
// A validator to check if the input value is within a specified range
Pristine.addValidator(
  'my-range',
  (value, el, param1, param2) => {
    return parseInt(param1) <= value && value <= parseInt(param2);
  },
  'The value (${0}) must be between ${1} and ${2}',
  5,
  false
);

var pristine = new Pristine(document.getElementById('form'));
```

Assign the new validator to inputs like this:

```html
<input type="text" class="form-control" data-pristine-my-range="10,30" />
```

### Validator Function Arguments

Validator functions receive arguments in the following order:

1. **value** - The current value of the input field being validated
2. **element** - The DOM element (input, select, textarea) being validated
3. **Additional parameters** - These come from the `data-pristine-*` attributes and are processed as follows:

   - **Pattern attributes** (`data-pristine-pattern`): The entire pattern string is passed as a single argument
   - **JSON values**: If the attribute value is valid JSON (starts with `{` or `[`), it is parsed. An object is passed as a single argument, and an array is spread into separate arguments
   - **Regular strings**: For all other cases, the attribute value is split at commas (`,`) and each part is passed as a separate argument

#### Examples:

```html
<!-- Regular comma-separated values -->
<input data-pristine-min-max="5,10" />
<!-- Validator receives: (value, element, "5", "10") -->

<!-- Pattern value -->
<input data-pristine-pattern="/^[A-Z]+$/i" />
<!-- Validator receives: (value, element, "/^[A-Z]+$/i") -->

<!-- JSON value -->
<input data-pristine-custom-config='{"option1": true, "option2": "value"}' />
<!-- Validator receives: (value, element, {"option1": true, "option2": "value"}) -->

<!-- JSON array -->
<input data-pristine-range='[5, 10]' />
<!-- Validator receives: (value, element, 5, 10) -->
```

When creating custom validators, ensure your function accepts the appropriate number of parameters based on how you plan to configure it in HTML.

### Add custom error messages

```html
<input required data-pristine-required-message="My custom message" />
```

Add an attribute like `data-pristine-<ValidatorName>-message`with the custom message as value to show custom error messages. You can add custom messages like this for as many validators as you need. Here `ValidatorName` means `required`, `email`, `min`, `max` etc. Add a two-letter language code to show a message only in that language, e.g. `data-pristine-required-message-de`. Without a code, the message is used for English (`en`).

## Built-in validators

| Name        | Usage                                                                                                   |
| ----------- | ------------------------------------------------------------------------------------------------------- |
| `required`  | `required` or `data-pristine-required`                                                                  |
| `email`     | `type="email"` or `data-pristine-type="email"`                                                          |
| `number`    | `type="number"` or `data-pristine-type="number"`                                                        |
| `integer`   | `data-pristine-type="integer"`                                                                          |
| `minlength` | `minlength="10"` or `data-pristine-minlength="10"`                                                      |
| `maxlength` | `maxlength="10"` or `data-pristine-maxlength="10"`                                                      |
| `min`       | `min="20"` or `data-pristine-min="20"`                                                                  |
| `max`       | `max="100"` or `data-pristine-max="100"`                                                                |
| `pattern`   | `pattern="/[a-z]+$/i"` or `data-pristine-pattern="/[a-z]+$/i"`. In HTML, write backslashes as they are (`\d`); escape them (`\\d`) only inside JavaScript strings. Pristine doesn't anchor the pattern, so add `^` and `$` yourself |
| `equals`    | `data-pristine-equals="#field-selector"`, Check that two fields are equal                               |

## API

#### `Pristine(form, config, live)`

Constructor function

| Parameter | Default   | Required?          | Description                                                    |
| --------- | --------- | ------------------ | -------------------------------------------------------------- |
| `form`    | -         | <center>✔</center> | DOM element containing form fields, does not need to be a form |
| `config`  | See below | <center>✕</center> | Config object                                                  |
| `live`    | `true`    | <center>✕</center> | Whether pristine should validate as you type                   |

##### Default configuration

```js
{
  classTo: 'field', // Class of the parent element that gets the error/success class
  errorClass: 'error', // Error class
  successClass: 'success', // Success class
  errorTextParent: 'field', // Class of the parent element the error element is appended to
  errorTextTag: 'div', // Element type to create for the error text
  errorTextClass: 'error-msg', // Class of the error text element
  liveAfterFirstValitation: true, // Enable live validation only after the first form submission (requires the live parameter to be true)
}
```

### Global methods

#### `Pristine.addValidator(name, fn, msg, priority, halt)`

Add a global custom validator

| Parameter  | Default            | Required?          | Description                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ---------- | ------------------ | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`     | <center>-</center> | <center>✔</center> | A string, the name of the validator, you can then use `data-pristine-<NAME>` attribute in form fields to apply this validator                                                                                                                                                                                                                                                                                                       |
| `fn`       | -                  | <center>✔</center> | The function that validates the field. See [Validator function arguments](#validator-function-arguments)                                                                                                                                                                                                                                                                                                                            |
| `message`  | -                  | <center>✔</center> | The message to show when the validation fails. If the arguments are strings, it supports simple templating. `${0}` for the input's value, `${1}` and so on are for the attribute values. For the above example, `${0}` will get replaced by `myValue`, `${1}` by `10`, `${2}` by `20`, `${3}` by `dhaka`. It can also be a function which should return the error string. The values and inputs are available as function arguments |
| `priority` | 1                  | <center>✕</center> | Priority of the validator function. The higher the value, the earlier it gets called when there are multiple validators on one field.                                                                                                                                                                                                                                                                                               |
| `halt`     | `false`            | <center>✕</center> | Whether to halt validation on the current field after this validator fails. When `true`, the remaining validators on the field are skipped. |

#### `Pristine.setLocale(locale)`

Set the current locale globally

| Parameter | Default | Required?          | Description                                                                     |
| --------- | ------- | ------------------ | ------------------------------------------------------------------------------- |
| `locale`  | -       | <center>✔</center> | Error messages of all Pristine instances use this locale, starting with the next validation |

#### `Pristine.addMessages(locale, messages)`

Set the messages for a specific locale globally

| Parameter  | Default | Required?          | Description                                                         |
| ---------- | ------- | ------------------ | ------------------------------------------------------------------- |
| `locale`   | -       | <center>✔</center> | The corresponding locale                                            |
| `messages` | -       | <center>✔</center> | Object containing validator names as keys and error texts as values |

### Instance methods

#### `pristine.validate(inputs, silent)`

_Validate the form or field(s)_

| Parameter | Default | Required?          | Description                                                                                                                                                                                  |
| --------- | ------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `inputs`  | -       | <center>✕</center> | When not given, full form is validated. inputs can be one DOM element or a collection of DOM elements returned by `document.getElement...`, `document.querySelector...` or even `jquery` dom |
| `silent`  | `false` | <center>✕</center> | Does not show error messages when `silent` is `true`                                                                                                                                   |

Returns a `Promise` that resolves to `true` or `false`

#### `pristine.addValidator(elem, fn, msg, priority, halt)`

Add a custom validator

| Parameter  | Default | Required?          | Description                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ---------- | ------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `elem`     | -       | <center>✔</center> | The dom element where validator is applied to.                                                                                                                                                                                                                                                                                                                                                                                      |
| `fn`       | -       | <center>✔</center> | The function that validates the field. See [Validator function arguments](#validator-function-arguments)                                                                                                                                                                                                                                                                                                                            |
| `message`  | -       | <center>✔</center> | The message to show when the validation fails. If the arguments are strings, it supports simple templating. `${0}` for the input's value, `${1}` and so on are for the attribute values. For the above example, `${0}` will get replaced by `myValue`, `${1}` by `10`, `${2}` by `20`, `${3}` by `dhaka`. It can also be a function which should return the error string. The values and inputs are available as function arguments |
| `priority` | 1       | <center>✕</center> | Priority of the validator function. The higher the value, the earlier it gets called when there are multiple validators on one field.                                                                                                                                                                                                                                                                                               |
| `halt`     | `false` | <center>✕</center> | Whether to halt validation on the current field after this validation. When `true` after validating the current validator, rest of the validators are ignored on the current field.                                                                                                                                                                                                                                                 |

#### `pristine.getErrors(input)`

_Get the errors of the form or a specific field_

| Parameter | Default | Required?          | Description                                                                                                                                                                                                                                                            |
| --------- | ------- | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `input`   | -       | <center>✕</center> | When `input` is given, it returns the errors of that input element as an array of strings. Otherwise it returns an array of `{ input, errors }` objects, one for each invalid field. `validate()` must be called before expecting this method to return correctly. |

#### `pristine.addError(input, error)`

_Add A custom error to an input element_

| Parameter | Default | Required?          | Description                                          |
| --------- | ------- | ------------------ | ---------------------------------------------------- |
| `input`   | -       | <center>✔</center> | The input element to add the error to. Call `validate()` first, which creates the field's list of errors |
| `error`   | -       | <center>✔</center> | The error string                                     |

#### `pristine.setGlobalConfig(config)`

_Set the global configuration_

| Parameter | Default | Required?          | Description                                                 |
| --------- | ------- | ------------------ | ----------------------------------------------------------- |
| `config`  | -       | <center>✔</center> | Replace the default configuration used by Pristine instances created afterwards. It replaces the defaults instead of merging with them, so pass every option. |

#### `pristine.reset()`

_Reset the errors in the form_

#### `pristine.destroy()`

_Destroy the pristine object_

> The goal of this library is not to provide every possible type of validation and thus becoming a bloat.
> The goal is to provide most common types of validations and a neat way to add custom validators.

## License

[MIT](http://opensource.org/licenses/MIT)

## Testing

Pristine Neue uses Vitest for testing. The test suite covers core functionality, built-in validators, custom validators, and localization features.

### Running Tests

```sh
# Run all tests once
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

For more details about the test suite, see the [tests/README.md](tests/README.md) file.

## Continuous Integration

Pristine Neue uses GitHub Actions for continuous integration. The following workflows are set up:

- **Run Tests**: Runs the test suite on every push and pull request.
- **Deploy Documentation**: Builds and deploys the documentation to GitHub Pages when changes are pushed to the master branch.
- **Publish Package**: Publishes the package to npm when a new release is created.
