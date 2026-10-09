---
outline: [2, 3]
---

# API reference

## Constructor

```js
const pristine = new Pristine(form, config, live);
```

| Parameter | Default | Description |
| --- | --- | --- |
| `form` | (required) | The element that contains the fields. It doesn't have to be a `<form>`. Pristine adds `novalidate` to it. |
| `config` | see below | Options, merged with the defaults. |
| `live` | `true` | Validate fields while the user types, on `input` and `change` events. |

### Config

```js
{
  classTo: 'field',
  errorClass: 'error',
  successClass: 'success',
  errorTextParent: 'field',
  errorTextTag: 'div',
  errorTextClass: 'error-msg',
  liveAfterFirstValitation: true,
}
```

- `liveAfterFirstValitation`: when `true`, live validation only starts after the first `validate()` call without arguments. The option name is spelled this way in the library.
- The other options set the classes and the message element, see [Styling](./guide/styling#options).

## Global methods

### Pristine.addValidator(name, fn, message, priority, halt)

Registers a validator that any field can use through a `data-pristine-<name>` attribute. Register it before creating the instances that use it.

| Parameter | Default | Description |
| --- | --- | --- |
| `name` | (required) | The validator's name, as used in `data-pristine-<name>`. |
| `fn` | (required) | `(value, element, ...params)`. Returns `true` or `false`, or a Promise of either. See [how parameters are passed](./guide/custom-validators#how-parameters-are-passed). |
| `message` | (required) | A string, an object with one string per language, or a function. See [Messages](./guide/custom-validators#messages). |
| `priority` | `1` | Validators with a higher priority run first. |
| `halt` | `false` | When this validator fails synchronously, skip the remaining validators on the field. |

### Pristine.addMessages(locale, messages)

Adds or replaces the messages of a language. `messages` maps validator names to message strings, and can include `default`.

### Pristine.setLocale(locale)

Sets the language of every instance, from the next validation on. The default is `'en'`.

## Instance methods

### validate(inputs, silent)

Checks the fields and returns a `Promise` that resolves to `true` when all of them are valid.

| Parameter | Default | Description |
| --- | --- | --- |
| `inputs` | all fields | A field, a `NodeList`, an array or a jQuery collection of fields. |
| `silent` | `false` | When `true`, check the fields without changing classes or messages. |

Validating the whole form, without `inputs`, also starts live validation when `liveAfterFirstValitation` is `true`.

### addValidator(element, fn, message, priority, halt)

Adds a validator to one field. The arguments are the same as for `Pristine.addValidator()`, with the field element instead of a name. `priority` defaults to `1` and `halt` to `false`.

### getErrors(input)

- With an `input`: returns that field's messages, as an array of strings.
- Without one: returns `{ input, errors }` for every invalid field.

Call `validate()` first.

### addError(input, error)

Adds a message to a field and shows it. Call `validate()` first, because that creates the field's list of errors.

### reset()

Removes all error and success classes and all messages.

### destroy()

Calls `reset()` and detaches Pristine from the fields. Its event listeners stay attached but no longer do anything.

### setGlobalConfig(config)

Replaces the default config for instances created afterwards. It doesn't merge with the current defaults, so pass every option.
