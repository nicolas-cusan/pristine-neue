# Error messages & languages

## Messages for one field

Set the message for one validator on one field with `data-pristine-<validator>-message`:

<Demo name="messages" />

::: code-group

<<< @/examples/messages.html [HTML]

<<< @/examples/messages.js#usage [JavaScript]

:::

## Placeholders

Messages can contain placeholders:

- `${0}` is the field's value.
- `${1}`, `${2}`… are the validator's parameters. For `minlength="3"`, `${1}` is `3`.

::: warning
Pristine inserts messages as HTML. Don't put untrusted text into messages. Note that `${0}` inserts exactly what the person typed.
:::

## Languages

Pristine ships with English messages. Add messages for other languages with `Pristine.addMessages()`, and switch between them with `Pristine.setLocale()`:

<Demo name="locales" />

::: code-group

<<< @/examples/locales.html [HTML]

<<< @/examples/locales.js#usage [JavaScript]

:::

`setLocale()` is global. It changes the language of every Pristine instance on the page, starting with the next validation.

Messages for one field can be language-specific too. Add a two-letter language code to the attribute name, as in `data-pristine-required-message-de` above. An attribute without a code applies to English (`en`).

## The default messages

| Validator | English message |
| --- | --- |
| `required` | This field is required |
| `email` | This field requires a valid e-mail address |
| `number` | This field requires a number |
| `integer` | This field requires an integer value |
| `minlength` | This fields length must be &gt; `${1}` |
| `maxlength` | This fields length must be &lt; `${1}` |
| `min` | Minimum value for this field is `${1}` |
| `max` | Maximum value for this field is `${1}` |
| `pattern` | Please match the requested format |
| `equals` | The two fields do not match |
| `default` | Please enter a correct value |

`default` is used when nothing else matches. To replace any of these, pass new texts, for example `Pristine.addMessages('en', { required: 'Please fill this in' })`.

## Which message is shown

When a validator fails, Pristine uses the first of these that exists:

1. The validator's message, if it's a function.
2. The validator's message for the current language, if it's an object like `{ en: '…' }`.
3. The field's `data-pristine-<validator>-message` attribute for the current language.
4. The message added with `Pristine.addMessages()` for that validator, or the built-in one.
5. The validator's message, if it's a string.
6. The language's `default` message.

So `addMessages()` overrides a global validator's own string message, and an attribute on the field overrides both.
