# Styling and theming

The library ships one scoped stylesheet. Import it once:

```ts
import "@afghan-province-charts/react/styles.css";
```

All classes use an `af-` prefix. The library does not use Tailwind, CSS-in-JS,
global element selectors or a component framework.

## Three levels of customization

1. **Color props** — the fastest path, forwarded to scoped variables.
2. **CSS variables** — theme an entire area without touching component code.
3. **Class overrides** — target `.af-map__province`, `.af-map__tooltip` and
   related classes from your own stylesheet.

### Color props

```tsx
<AfghanistanMap
  colors={{
    fill: "#e8edf2",
    hoverFill: "#cfe0ee",
    selectedFill: "#0f766e",
    border: "#ffffff",
    outline: "#7c8ba1",
    focus: "#0f766e",
    label: "#24313d",
    labelHalo: "#f8fafc",
    tooltipBackground: "#0f172a",
    tooltipText: "#f8fafc",
  }}
/>
```

Only provided tokens are emitted as inline variables, so unspecified tokens keep
the stylesheet defaults and automatic dark-mode behavior.

### CSS variables

```css
.map-region {
  --af-map-fill: #e8edf2;
  --af-map-hover-fill: #cfe0ee;
  --af-map-selected-fill: #0f766e;
  --af-map-no-data: #eef1f5;
  --af-map-disabled-fill: #f3f4f6;
  --af-map-border: #ffffff;
  --af-map-border-width: 1px;
  --af-map-outline: #7c8ba1;
  --af-map-focus: #0f766e;
  --af-map-label: #24313d;
  --af-map-label-halo: #f8fafc;
  --af-map-tooltip-bg: #0f172a;
  --af-map-tooltip-text: #f8fafc;
  --af-map-tooltip-border: rgba(148, 163, 184, 0.35);
  --af-map-transition: 140ms ease;
  --af-map-font: system-ui, sans-serif;
}
```

```tsx
<div className="map-region">
  <AfghanistanMap />
</div>
```

### Class overrides

```css
.map-region .af-map__province {
  stroke-linejoin: round;
}

.map-region .af-map__tooltip {
  border-radius: 10px;
  font-size: 13px;
}
```

Keep specificity low. The library avoids `!important` except for the
reduced-motion block.

## Dark mode

Default tokens adapt through `prefers-color-scheme: dark`. If your application
already has a theme switch, override the map variables on a themed ancestor:

```css
[data-theme="dark"] .af-map {
  --af-map-fill: #243244;
  --af-map-hover-fill: #33475d;
  --af-map-selected-fill: #2dd4bf;
  --af-map-no-data: #1c2733;
  --af-map-border: #0b1220;
  --af-map-outline: #7dd3c8;
  --af-map-focus: #5eead4;
  --af-map-label: #f1f5f9;
  --af-map-label-halo: #0b1220;
  --af-map-tooltip-bg: #f8fafc;
  --af-map-tooltip-text: #0f172a;
}
```

Because `colors` writes inline variables, a token passed via props wins over
ancestor CSS. Theme switch implementations should update the prop or omit it for
tokens that should follow the theme.

## Layout and responsiveness

- The SVG uses a fixed coordinate system and `viewBox`; it scales without
  distortion.
- By default the map fills `100%` of its container width and derives height from
  the viewBox.
- Setting `height` switches the SVG to fill the container without cropping
  (`preserveAspectRatio="xMidYMid meet"`), which may add letterbox space.
- The map works in CSS grid and flex layouts. Give the container a width.

```tsx
<div style={{ maxWidth: 720 }}>
  <AfghanistanChoropleth data={data} showLegend />
</div>
```

## Tooltip positioning

The tooltip is absolutely positioned inside the map container. It flips above or
below the pointer or label anchor near the top edge and aligns start/center/end
near the side edges. `pointer-events: none` keeps it from blocking province
selection. Keep the container free of `overflow: hidden` if you want the tooltip
to be able to extend outside it.

## Motion

Transitions are short (140 ms) and disabled under
`prefers-reduced-motion: reduce`.

## Choropleth colors

Choropleth fills come from the data scale, not `--af-map-fill`. Use:

- `palette` for the two-stop data gradient;
- `missingColor` for missing values;
- `colors.focus` / `--af-map-focus` for the selected outline;
- `--af-map-label` for labels and legend text.

## Forced colors

A `forced-colors: active` block maps province borders to `ButtonText` and
selected/focused outlines to `Highlight`.

## Bundle note

The stylesheet is about 6.2 kB raw (1.8 kB gzip). It is not injected
automatically; importing it explicitly keeps SSR and CSS ordering predictable.
