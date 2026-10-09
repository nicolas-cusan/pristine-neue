# Styling

Pristine doesn't come with any CSS. It adds classes and a message element to your markup, and you style those.

## What Pristine adds

With the default settings, an invalid field ends up like this:

```html
<div class="field error">
  <label for="email">Email</label>
  <input id="email" type="email" required>
  <div class="pristine-error error-msg">This field requires a valid e-mail address</div>
</div>
```

Once the value is valid, the wrapper gets `success` instead. The message element stays in place, but it's emptied and hidden:

```html
<div class="field success">
  <label for="email">Email</label>
  <input id="email" type="email" required>
  <div class="pristine-error error-msg" style="display: none;"></div>
</div>
```

When a field has several errors, they're shown in the same element, separated by `<br/>`.

## Example CSS

```css
.field.error input {
  border-color: #e5484d;
}

.field.success input {
  border-color: #30a46c;
}

.pristine-error {
  color: #e5484d;
  font-size: 0.875rem;
}
```

## Options

| Option | Default | What it does |
| --- | --- | --- |
| `classTo` | `'field'` | Class of the ancestor that gets the error and success classes. |
| `errorClass` | `'error'` | Class added to that ancestor when the field is invalid. |
| `successClass` | `'success'` | Class added when the field is valid. |
| `errorTextParent` | `'field'` | Class of the element the message is added to. If it differs from `classTo`, it has to be inside the `classTo` element. |
| `errorTextTag` | `'div'` | Tag of the message element. |
| `errorTextClass` | `'error-msg'` | Class of the message element, next to `pristine-error`. |

## Your own class names

Pass the options when you create the instance, for example to match Bootstrap-style markup:

<Demo name="custom-classes" />

::: code-group

<<< @/examples/custom-classes.html [HTML]

<<< @/examples/custom-classes.js#usage [JavaScript]

:::
