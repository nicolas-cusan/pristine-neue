# Built-in validators

Pristine reads these attributes from your fields. The examples on this page all use `new Pristine(form)` with the default settings, so only their HTML is shown.

| Validator | Attribute | Passes when |
| --- | --- | --- |
| `required` | `required` | The field isn't empty. For checkboxes and radio buttons: at least one in the group is checked. |
| `email` | `type="email"` | The value looks like an email address. |
| `number` | `type="number"` | The value is a number, such as `42`, `-0.5` or `1e3`. |
| `integer` | `data-pristine-type="integer"` | The value only contains digits, with no sign or decimal point. |
| `minlength` | `minlength="3"` | The value has at least that many characters. |
| `maxlength` | `maxlength="16"` | The value has at most that many characters. |
| `min` | `min="18"` | The number is at least that value. For checkboxes: at least that many in the group are checked. |
| `max` | `max="120"` | The number is at most that value. For checkboxes: at most that many are checked. |
| `pattern` | `pattern="…"` | The value matches the regular expression. |
| `equals` | `data-pristine-equals="#id"` | The value is the same as that of the field with this ID. |

Every attribute also works with a `data-pristine-` prefix, such as `data-pristine-minlength="3"` or `data-pristine-type="email"`. Use the prefixed form when you don't want the browser to act on the attribute itself.

Every validator except `required` passes when the field is empty, so optional fields can have rules too. Add `required` when a value is needed.

`required` runs first, and when it fails it stops the other validators on that field. An empty required field only shows "This field is required".

## Length

<Demo name="length" />

<<< @/examples/length.html

The browser's own `maxlength` attribute stops people from typing past the limit, so its message rarely appears. Use `data-pristine-maxlength` when you'd rather let people type and then show a message, as both fields here do.

## Numbers

<Demo name="number" />

<<< @/examples/number.html

A number input (`type="number"`) only passes on values the browser can read as a number. Anything else arrives as an empty string, which passes every validator except `required`. To reject input like `12abc` with a message, use a text input with `data-pristine-type="number"` or `data-pristine-type="integer"`, as the seats field does.

## Patterns

<Demo name="pattern" />

<<< @/examples/pattern.html

Write the pattern as `/…/flags` to use flags such as `i`, or as a plain regular expression without slashes. It differs from the browser's own `pattern` check in two ways:

- Pristine doesn't add `^` and `$` for you, so a plain pattern can match anywhere in the value. Anchor it yourself.
- In HTML, write backslashes as they are (`\d`). Only escape them (`\\d`) when the markup sits inside a JavaScript string.

## Matching another field

<Demo name="equals" />

<<< @/examples/equals.html

`data-pristine-equals` takes an ID selector, starting with `#`. Pristine looks for that element in the whole document, not only in the form.

## Checkbox groups

<Demo name="checkboxes" />

<<< @/examples/checkboxes.html

For checkboxes, `required`, `min` and `max` count the checked boxes that share a `name` (`toppings` and `toppings[]` count as the same group). Two things to keep in mind:

- Put the attributes, and any messages, on every checkbox in the group.
- Keep the group inside one `.field` wrapper, so the group shares one message.
