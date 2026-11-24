# Choropleth charts

`<AfghanistanChoropleth />` colors provinces from numeric data while keeping the
same interaction, localization and accessibility model as the map.

```tsx
import { AfghanistanChoropleth } from "@afghan-province-charts/react";
import "@afghan-province-charts/react/styles.css";

const data = {
  "AF-KAB": 96,
  "AF-HER": 72,
  "AF-BAL": 68,
  "AF-KAN": 64,
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

## Partial data

Only the provinces present in `data` receive a data color. All other provinces
use the missing-data color. A partial dataset also adds a missing-data swatch to
the legend.

```tsx
const data = {
  "AF-KAB": 0, // real zero
  "AF-HER": 72,
  // AF-BAL absent -> missing
};
```

Zero is valid and is positioned on the scale. `null`, `undefined`, `NaN` and
non-finite values are missing.

## Domains

Automatic domain:

```tsx
<AfghanistanChoropleth data={data} />
```

Fixed domain, useful for dashboards that update:

```tsx
<AfghanistanChoropleth data={data} domain={[0, 100]} />
```

Values outside a fixed domain are clamped for color resolution only. Tooltips
and accessible labels keep the original value.

## Palettes and missing color

```tsx
<AfghanistanChoropleth data={data} palette={["#f1f5f9", "#0f766e"]} missingColor="#eef1f5" />
```

Palettes are two-stop hex gradients. The default missing color is the scoped
`--af-map-no-data` variable, so it follows light/dark tokens. You can pass any
CSS color, including a custom variable.

## Formatting

```tsx
<AfghanistanChoropleth data={data} formatValue={(value) => `${value.toFixed(1)}%`} showLegend />
```

The formatter is used in the legend, tooltip and accessible labels.

## Legend

```tsx
<AfghanistanChoropleth data={data} showLegend legendTitle="Coverage" />
```

The legend displays minimum and maximum values, reverses under RTL, and includes
a missing-data swatch when applicable. A standalone `MapLegend` is also
exported for image exports and split layouts.

## Color is not the only signal

Tooltips and screen-reader labels include the formatted value. The legend names
the domain. Selected provinces get a stroke, so selection survives low-contrast
palettes.

## Types

```ts
import type {
  AfghanistanChoroplethProps,
  ProvinceNumericData,
  ColorPalette,
  ValueFormatter,
} from "@afghan-province-charts/react";
```

See [api-reference.md](./api-reference.md) and
[data-and-licensing.md](./data-and-licensing.md).
