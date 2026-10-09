---
layout: home

hero:
  name: Pristine Neue
  text: Vanilla JavaScript form validation
  tagline: About 3 kB gzipped, with no dependencies. It validates from the HTML attributes you already write, and supports custom, async and translated validators.
  actions:
    - theme: brand
      text: Get started
      link: /guide/getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/nicolas-cusan/pristine-neue

features:
  - title: Uses your HTML
    details: required, type="email", min, max, minlength, maxlength and pattern work as they are. There's no schema to write.
  - title: Custom validators
    details: Add a rule to one field, or register it once and use it anywhere with a data-pristine-* attribute.
  - title: Async validation
    details: Validators can return a Promise, so you can check a username or a coupon code with your server.
  - title: Translated messages
    details: Override any message per field or per language, with placeholders for the value and the parameters.
---
