# Accessibility

Bootstrap UI Sounds adds optional audio feedback to Bootstrap components. Sound should only ever enhance an interface, never be the only way information is conveyed.

## Our commitment

- Every sound accompanies a visual change that Bootstrap already provides, so no information is available through audio alone.
- Sounds are short, quiet and non-intrusive, and never play automatically on page load.
- Sounds are opt-in: they only play once `data-ui-sounds` is added to a page or component, and `data-ui-sounds="false"` turns them off again.
- Sounds are triggered only by user interaction.
- The library does not change the markup, focus order, ARIA attributes or keyboard behavior of Bootstrap components.
- The documentation site aims to meet [WCAG 2.2](https://www.w3.org/TR/WCAG22/) Level AA.

## Recommendations for using this library

- Provide a visible control that lets users mute or disable UI sounds, and remember their choice.
- Keep volume low and avoid adding sounds to high-frequency interactions.
- Test with screen readers to make sure sounds do not mask or interrupt spoken output.

## Reporting an accessibility issue

If you find an accessibility barrier in the library or its documentation, please [open an issue](https://github.com/coliff/bootstrap-ui-sounds/issues/new) describing the problem, the component affected, and the browser and assistive technology you were using.
