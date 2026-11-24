# Accessibility

The library targets WCAG 2.2 AA-relevant interaction behavior. Accessibility is
part of the component model, not an add-on.

## Keyboard support

Each interactive province is a focusable `role="button"` with a roving tab index:

| Key                        | Action                                                    |
| -------------------------- | --------------------------------------------------------- |
| `Tab`                      | Moves into the map, landing on the active province.       |
| `ArrowRight` / `ArrowLeft` | Moves focus to the nearest province to the right or left. |
| `ArrowDown` / `ArrowUp`    | Moves focus to the nearest province below or above.       |
| `Home` / `End`             | Moves to the first or last province in canonical order.   |
| `Enter` / `Space`          | Selects or deselects the focused province.                |
| `Shift+Tab`                | Leaves the map.                                           |

Spatial navigation uses the precomputed label anchors, so focus follows the
geography rather than an arbitrary array order. If no candidate exists in the
chosen direction, focus wraps to the next province.

## Focus visibility

Focused provinces receive a non-scaling outline using `--af-map-focus`. The
outline is visible in light, dark and forced-colors modes. The map itself does
not trap focus.

## Accessible names

Each province path has a localized `aria-label`:

- plain map: province name, plus "Selected" when selected;
- choropleth: province name, selected state, metric label and formatted value, or
  "No data".

Selection is exposed with `aria-pressed`.

The SVG group has a localized name and description of the keyboard controls.
A polite live region announces the focused province and value. Tooltips do not
replace accessible names; all information is available without hovering.

## Color is not the only signal

- The selected province gets a distinct outline, not just a fill change.
- Choropleth values are in accessible names, tooltips and the legend.
- The legend labels minimum and maximum textually and announces the domain.
- Missing values have a legend swatch and a localized "No data" label.
- Focus rings are independent of the data palette.

## RTL

RTL locales set text direction on tooltips and legends. Province order, geometry
and SVG coordinates are never mirrored. Screen readers receive localized Arabic
script names.

## Touch

Tap selects; pointer events drive the same state as mouse interaction. The
tooltip does not intercept touches. The SVG uses `touch-action: manipulation` to
avoid accidental double-tap zoom on province paths.

## Motion

All transitions are 140 ms or shorter and disabled under
`prefers-reduced-motion: reduce`.

## Contrast

Default tokens are chosen for readable province labels with a halo and readable
tooltip text. If you replace colors, verify contrast for:

- labels against province fills;
- tooltip text against tooltip background;
- focus outline against adjacent fills and page background;
- selected outline in both light and dark themes.

## Testing

The repository includes:

- React Testing Library tests for keyboard activation, arrow navigation, RTL,
  controlled/uncontrolled state, labels and tooltips;
- SSR and hydration tests;
- Playwright tests for keyboard focus, locale switching and theme switching;
- visual screenshots in light, dark, mobile and RTL configurations.

Automated checks do not replace a manual screen-reader pass. Before a stable
release, test with VoiceOver, NVDA and TalkBack on representative dashboards.
