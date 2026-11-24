# afghanistan-province-chart

Accessible, responsive SVG maps and choropleths for the 34 provinces of
Afghanistan. React 18 and 19. No API keys, map services or runtime network
requests.

> **Status:** `0.1.0-beta.0` is not published to npm yet. The public API and
> visual design have been reviewed.

## Install

```bash
pnpm add afghanistan-province-chart
```

## Map

```tsx
import { AfghanistanMap } from "afghanistan-province-chart";
import "afghanistan-province-chart/styles.css";

export function MapCard() {
  return (
    <AfghanistanMap
      locale="en"
      height={480}
      onProvinceClick={({ province }) => {
        console.log(province.code);
      }}
    />
  );
}
```

## Choropleth

```tsx
import { AfghanistanChoropleth } from "afghanistan-province-chart";
import "afghanistan-province-chart/styles.css";

const data = {
  "AF-KAB": 96,
  "AF-HER": 72,
  "AF-BAL": 68,
  "AF-KAN": 64,
};

export function Report() {
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

Missing keys render with the missing-data color. They are never coerced to zero.
Zero values keep a real position on the scale.

## Locales

- `en` — English
- `prs` — Dari
- `ps` — Pashto

Province names, tooltips, legends and accessible labels are localized. RTL
affects interface chrome only; the map geometry is never mirrored.

## Styling

Import `afghanistan-province-chart/styles.css` once. Override scoped variables on any
ancestor or pass `colors`:

```tsx
<AfghanistanMap colors={{ fill: "#e8edf2", hoverFill: "#cfe0ee", selectedFill: "#0f766e" }} />
```

## API

Components: `AfghanistanMap`, `AfghanistanChoropleth`, `MapLegend`.

Utilities: `getProvinces`, `getProvinceByCode`, `getProvinceName`,
`isProvinceCode`, `getLocaleDirection`, `SUPPORTED_LOCALES`, `DEFAULT_LOCALE`,
`INTL_LOCALES`.

All province identifiers are canonical ISO 3166-2:AF codes.

## Data

Boundary data: geoBoundaries gbOpen AFG ADM1, boundary year 2007, listed as
public domain. geoBoundaries attribution is required. The dataset is a
generalised cartographic source, not a legal or survey-grade boundary.

See `DATA_LICENSE.md` in this package and the repository documentation for full
provenance, checksums and limitations.

## License

MIT for original source code. Geographic data retains its own license and
attribution. See `LICENSE` and `DATA_LICENSE.md`.
