# Getting started

`@afghan-province-charts/react` is an ESM React component library that renders a
responsive SVG map of Afghanistan's 34 provinces. It works in React 18 and 19,
Vite, Next.js and any environment that supports server rendering plus SVG.

## Requirements

- Node.js 22.12 or newer for development of this repository.
- React 18 or 19 in the consuming application.
- A bundler that understands ESM and CSS imports (Vite, Next.js, webpack,
  Rollup, Parcel).

The library is ESM-only. It has no runtime dependencies.

## Install

```bash
pnpm add @afghan-province-charts/react
```

```tsx
import { AfghanistanMap } from "@afghan-province-charts/react";
import "@afghan-province-charts/react/styles.css";

export default function Dashboard() {
  return <AfghanistanMap locale="en" height={480} />;
}
```

Import the stylesheet **once** near your application entry point. The library
does not inject global CSS and does not require Tailwind, MUI, Ant Design or any
other component framework.

## First interactive map

```tsx
import { useState } from "react";
import { AfghanistanMap, type ProvinceCode } from "@afghan-province-charts/react";
import "@afghan-province-charts/react/styles.css";

export function ProvincePanel() {
  const [selected, setSelected] = useState<ProvinceCode | null>("AF-KAB");

  return (
    <AfghanistanMap
      locale="en"
      selectedProvince={selected}
      onSelectionChange={setSelected}
      onProvinceClick={({ province, source }) => {
        console.log(source, province.code, province.names.en);
      }}
      showTooltip
    />
  );
}
```

Clicking a province selects it. Clicking the selected province clears the
selection (`null`). In controlled mode the parent owns the state; the component
never changes the `selectedProvince` prop itself.

## First choropleth

```tsx
import { AfghanistanChoropleth } from "@afghan-province-charts/react";
import "@afghan-province-charts/react/styles.css";

const data = {
  "AF-KAB": 96,
  "AF-HER": 72,
  "AF-BAL": 68,
  "AF-KAN": 64,
  "AF-NAN": 61,
};

export function ReachMap() {
  return (
    <AfghanistanChoropleth
      data={data}
      locale="en"
      showLegend
      showTooltip
      legendTitle="Service reach (illustrative)"
    />
  );
}
```

Provinces missing from `data` use the missing-data color. An explicit `0` is a
real value and receives a position on the scale.

## Styling

The map uses scoped `.af-*` classes and CSS custom properties. You can pass
`colors` per component or override variables on an ancestor:

```tsx
<AfghanistanMap colors={{ fill: "#e8edf2", selectedFill: "#0f766e" }} />
```

```css
.dashboard-map {
  --af-map-fill: #e8edf2;
  --af-map-selected-fill: #0f766e;
}
```

See [customization.md](./customization.md).

## Localization

```tsx
<AfghanistanMap locale="prs" />
<AfghanistanMap locale="ps" />
```

Switch the prop at runtime; no reload is needed. Province identifiers stay the
same. See [localization.md](./localization.md).

## Server rendering

The components do not read `window` or `document` at module initialization.
`renderToString` and hydration are covered by the test suite. In Next.js, add
`"use client"` to files that pass callbacks or control selection. See
[nextjs.md](./nextjs.md).

## Bundle size

Measured from the built package at `0.1.0-beta.0`:

- `dist/index.js`: about 94 kB raw, **32.0 kB gzip**, including all 34 province
  paths and the province registry.
- `dist/styles.css`: about 6.2 kB raw, **1.8 kB gzip**.

The README records the measurement method and updates it when geometry changes.

## Next steps

- [Components](./components.md)
- [API reference](./api-reference.md)
- [Examples](./examples.md)
- [Accessibility](./accessibility.md)
