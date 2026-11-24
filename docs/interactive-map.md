# Interactive map

`<AfghanistanMap />` is the core component. It renders a responsive SVG, handles
pointer, touch and keyboard input, and manages selection.

```tsx
import { AfghanistanMap } from "@afghan-charts/react";
import "@afghan-charts/react/styles.css";

export default function App() {
  return <AfghanistanMap locale="en" height={500} showTooltip />;
}
```

## Selection

Uncontrolled:

```tsx
<AfghanistanMap defaultSelectedProvince="AF-KAB" />
```

Controlled:

```tsx
const [selected, setSelected] = useState<ProvinceCode | null>(null);

<AfghanistanMap
  selectedProvince={selected}
  onSelectionChange={setSelected}
  onProvinceClick={({ province, source }) => {
    console.log(source, province.code);
  }}
/>;
```

Clicking the selected province calls `onSelectionChange(null)`.

## Keyboard

Tab into the map, use arrow keys to move spatially between provinces, and press
Enter or Space to select. Home and End jump to the first and last canonical
province. Focus is visible and the live region announces the focused name.

## Tooltips

```tsx
<AfghanistanMap
  renderTooltip={({ province, locale }) => <span>{province.names[locale]}</span>}
/>
```

Set `showTooltip={false}` to hide the built-in tooltip. Tooltips are also shown
on keyboard focus, not only hover.

## Labels

```tsx
<AfghanistanMap showProvinceLabels />
```

Labels are off by default. Small provinces can crowd at narrow widths; test your
specific layout.

## Non-interactive

```tsx
<AfghanistanMap interactive={false} />
```

The map renders in a muted state, keeps accessible province names, and removes
focus/activation behavior.

## Sizing

```tsx
<AfghanistanMap width={640} height={420} />
<AfghanistanMap width="100%" />
```

The default width is `100%`; the default height follows the viewBox ratio. A
fixed height letterboxes rather than crops the geometry.

## Types

```ts
import type {
  AfghanistanMapProps,
  ProvinceCode,
  ProvinceInteraction,
  ProvinceTooltipContext,
} from "@afghan-charts/react";
```

See [api-reference.md](./api-reference.md) for the full prop table.
