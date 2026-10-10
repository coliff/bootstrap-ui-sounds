# Bootstrap UI Sounds

[![Super-Linter](https://github.com/coliff/bootstrap-ui-sounds/actions/workflows/super-linter.yml/badge.svg)](https://github.com/coliff/bootstrap-ui-sounds/actions/workflows/super-linter.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![GitHub stars](https://img.shields.io/github/stars/coliff/bootstrap-ui-sounds)](https://github.com/coliff/bootstrap-ui-sounds/stargazers)
[![npm package](https://img.shields.io/npm/v/bootstrap-ui-sounds.svg)](https://www.npmjs.com/package/bootstrap-ui-sounds)

UI Sounds for Bootstrap 6. Subtle Web Audio API feedback for every interactive Bootstrap component, with no audio files to load.

**[Live demo](https://coliff.github.io/bootstrap-ui-sounds/docs/)**

> [!NOTE]
> This version targets [Bootstrap 6.0.0-alpha.1](https://www.npmjs.com/package/bootstrap/v/6.0.0-alpha.1). Bootstrap 6 renamed several components (Modal is now Dialog, Offcanvas is now Drawer, Dropdown is now Menu), so Bootstrap 5 projects should stay on v0.0.3.

## Usage

Bootstrap 6's JavaScript is ESM-only, so load it with `type="module"`. Then add the UI sounds script:

```html
<script
  type="module"
  src="https://cdn.jsdelivr.net/npm/bootstrap@6.0.0-alpha.1/dist/js/bootstrap.bundle.min.js"
></script>
<script
  src="https://cdn.jsdelivr.net/npm/bootstrap-ui-sounds/js/bootstrap-ui-sounds.min.js"
  defer
></script>
```

Sounds are off by default. Turn them on by adding `data-ui-sounds` to `<html>`, `<body>`, or any component:

```html
<html lang="en" data-ui-sounds="true"></html>
```

Set `data-ui-sounds="false"` on an element to mute it and everything inside it.

## Supported components

- Accordion (native `<details>`) and details/summary
- Alerts (shown and dismissed)
- Buttons, toggle buttons, and close buttons
- Carousel (previous, next, indicators, and play/pause)
- Chips (add and remove)
- Collapse
- Combobox
- Datepicker
- Dialog
- Drawer
- Form controls (focus and change), checkboxes, radios, switches, and range
- Form validation (valid and invalid submit)
- Menu
- OTP input
- Password strength
- Popovers and tooltips
- Tabs
- Toasts
- Toggler

## License

[MIT](LICENSE)
