# Custom validators

A validator is a function that receives the field's value and returns `true` when the value is valid. When it returns `false`, Pristine shows the message you registered with it.

## For one field

```js
pristine.addValidator(element, fn, message, priority, halt);
```

`element` has to be one of the instance's fields. `priority` defaults to 1 and `halt` to `false`.

<Demo name="custom-field" />

::: code-group

<<< @/examples/custom-field.html [HTML]

<<< @/examples/custom-field.js#usage [JavaScript]

:::

## Global validators

Register a validator once with `Pristine.addValidator()`. Then turn it on for any field with a `data-pristine-<name>` attribute. The attribute's value becomes the validator's parameters.

Register global validators before you create the Pristine instance, because the attributes are read when the instance is created.

<Demo name="custom-global" />

::: code-group

<<< @/examples/custom-global.html [HTML]

<<< @/examples/custom-global.js#usage [JavaScript]

:::

Write messages with normal quotes, not backticks. Inside a JavaScript template literal, `${1}` would be filled in by JavaScript before Pristine sees it.

## How parameters are passed

A validator receives the value, the field element and then the parameters from its `data-pristine-<name>` attribute:

| Attribute | The validator receives |
| --- | --- |
| `data-pristine-my-range="10,30"` | `(value, element, '10', '30')`, split at commas |
| `data-pristine-config='{"min": 10}'` | `(value, element, { min: 10 })`, a JSON object as one argument |
| `data-pristine-options='[10, 30]'` | `(value, element, 10, 30)`, a JSON array spread into separate arguments |
| `data-pristine-pattern="/^a,b$/"` | `(value, element, '/^a,b$/')`, because the `pattern` value is never split |

Comma-separated parameters arrive as strings, so convert them with `Number()` before comparing.

## Priority and halt

The validators on a field run from the highest priority to the lowest. `required` has priority 99, and most built-in validators have 1. When a validator with `halt: true` fails, the remaining validators on that field are skipped.

## Async validators

Return a Promise, or use an `async` function, to check a value with your server:

<Demo name="async" />

::: code-group

<<< @/examples/async.html [HTML]

<<< @/examples/async.js#usage [JavaScript]

:::

`validate()` waits for every async validator before it resolves. `halt` only applies to validators that fail synchronously, so async validators always run alongside the others.

## Messages

The `message` argument can be:

- **a string:** use `${0}` for the value, and `${1}`, `${2}`… for the parameters
- **an object with a message per language:** for example `{ en: 'Too short', de: 'Zu kurz' }`
- **a function:** `(value, params, locale) => string`, where `params` is `[value, element, ...parameters]`

To override messages for one field or one language, see [Error messages & languages](./messages).
