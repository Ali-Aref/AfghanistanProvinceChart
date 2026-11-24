# Examples

## Dashboard card with a selected province

```tsx
import { useState } from "react";
import {
  AfghanistanMap,
  getProvinceByCode,
  type ProvinceCode,
} from "@afghan-province-charts/react";
import "@afghan-province-charts/react/styles.css";

export function ProvinceCard() {
  const [selected, setSelected] = useState<ProvinceCode | null>("AF-KAB");
  const province = selected ? getProvinceByCode(selected) : null;

  return (
    <section style={{ maxWidth: 520 }}>
      <AfghanistanMap
        selectedProvince={selected}
        onSelectionChange={setSelected}
        height={360}
      />
      <footer>
        {province ? (
          <>
            <strong>{province.names.en}</strong> <code>{province.code}</code>
          </>
        ) : (
          "Select a province"
        )}
      </footer>
    </section>
  );
}
```

## Choropleth with a fixed domain and formatter

A fixed domain keeps colors stable as data refreshes.

```tsx
import { AfghanistanChoropleth } from "@afghan-province-charts/react";

const data = {
  "AF-KAB": 82.4,
  "AF-HER": 61.9,
  "AF-BAL": 58.1,
  "AF-KAN": 54.0,
  "AF-NAN": 49.7,
};

export function CoverageReport() {
  return (
    <AfghanistanChoropleth
      data={data}
      domain={[0, 100]}
      palette={["#f1f5f9", "#0f766e"]}
      formatValue={(value) => `${value.toFixed(1)}%`}
      showLegend
      legendTitle="Coverage"
      showTooltip
    />
  );
}
```

## Missing data is explicit

```tsx
const data = {
  "AF-KAB": 0, // real zero, positioned at the bottom of the scale
  "AF-HER": 72,
  // AF-BAL is missing: it renders with the missing-data color
};
```

Do not fill gaps with zero unless zero is the real value.

## Custom tooltip

```tsx
import {
  AfghanistanChoropleth,
  type ProvinceTooltipContext,
} from "@afghan-province-charts/react";

function Tooltip({ province, formattedValue }: ProvinceTooltipContext) {
  return (
    <div style={{ display: "grid", gap: 2 }}>
      <strong>{province.names.en}</strong>
      <span>{formattedValue ?? "No data"}</span>
      <small>{province.code}</small>
    </div>
  );
}

export function MapWithTooltip({ data }: { data: Record<string, number> }) {
  return (
    <AfghanistanChoropleth
      data={data}
      renderTooltip={(context) => <Tooltip {...context} />}
      showLegend
    />
  );
}
```

Custom tooltips return React nodes. Never inject unsanitized HTML.

## Localized map switcher

```tsx
import { useState } from "react";
import { AfghanistanMap, type Locale } from "@afghan-province-charts/react";

const locales: Locale[] = ["en", "prs", "ps"];

export function LocalizedMap() {
  const [locale, setLocale] = useState<Locale>("en");

  return (
    <>
      <select value={locale} onChange={(event) => setLocale(event.target.value as Locale)}>
        <option value="en">English</option>
        <option value="prs">Dari — دری</option>
        <option value="ps">Pashto — پښتو</option>
      </select>
      <AfghanistanMap locale={locale} />
    </>
  );
}
```

## Themed wrapper

```css
.dark-map {
  --af-map-fill: #243244;
  --af-map-hover-fill: #33475d;
  --af-map-selected-fill: #2dd4bf;
  --af-map-border: #0b1220;
  --af-map-label: #f1f5f9;
}
```

```tsx
export function ThemedMap() {
  return (
    <div className="dark-map">
      <AfghanistanMap />
    </div>
  );
}
```

## Two maps side by side

```tsx
<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
  <AfghanistanMap defaultSelectedProvince="AF-KAB" showTooltip={false} />
  <AfghanistanChoropleth data={data} showLegend />
</div>
```

Maps are independent and keep separate uncontrolled state.

## Legend without a map

```tsx
import { MapLegend } from "@afghan-province-charts/react";

<MapLegend
  domain={[0, 100]}
  palette={["#dff3ef", "#0f766e"]}
  hasMissingValues
  title="Coverage"
  formatValue={(value) => `${value}%`}
/>;
```

This is useful when the map is exported as an image and the legend is rendered
separately.
