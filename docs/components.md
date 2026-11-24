# Components

The package exports three components.

## `<AfghanistanMap />`

Renders an interactive map. Province shapes carry canonical ISO codes and
localized accessible names.

```tsx
<AfghanistanMap
  locale="en"
  width="100%"
  height={480}
  selectedProvince={selected}
  onSelectionChange={setSelected}
  onProvinceClick={({ province, code, source }) => {}}
  showTooltip
  showProvinceLabels
  colors={{ selectedFill: "#0f766e" }}
  renderTooltip={({ province, locale }) => <span>{province.names[locale]}</span>}
/>
```

### Behavior

- **Uncontrolled:** omit `selectedProvince` and optionally set
  `defaultSelectedProvince`.
- **Controlled:** pass `selectedProvince` (or `null`) and update it from
  `onSelectionChange`.
- **Deselect:** activating the selected province calls
  `onSelectionChange(null)`.
- **Non-interactive:** set `interactive={false}`. The map remains accessible as
  a set of named images but cannot be focused or activated.
- **Labels:** `showProvinceLabels` is off by default because small provinces can
  crowd at narrow widths.
- **Tooltips:** `showTooltip` defaults to `true`; hover and keyboard focus both
  show the tooltip.

### Interaction payload

```ts
interface ProvinceInteraction {
  province: Province;
  code: ProvinceCode;
  source: "pointer" | "keyboard";
  event: React.SyntheticEvent<SVGPathElement>;
}
```

## `<AfghanistanChoropleth />`

Accepts every map prop plus data-specific props.

```tsx
<AfghanistanChoropleth
  data={data}
  domain={[0, 100]}
  palette={["#dff3ef", "#0f766e"]}
  missingColor="#eef1f5"
  formatValue={(value) => `${value}%`}
  showLegend
  legendTitle="Coverage"
/>
```

### Data semantics

- Data is keyed by canonical ISO codes.
- Missing keys, `undefined`, `null`, `NaN` and non-finite numbers are missing.
- `0` is data, not missing.
- Negative numbers are supported.
- Values outside a fixed domain are clamped for color resolution.
- If the domain is fixed, the map and legend use it exactly.
- Automatic domains are the minimum and maximum finite values in `data`.
- A partial dataset triggers the missing-data swatch in the legend.

### Color scale

The default scale is a continuous linear interpolation in sRGB between two hex
colors. If minimum and maximum are equal, every value receives the midpoint
color. Invalid palette colors fall back to the default teal palette. The
palette must use `#rgb` or `#rrggbb` syntax.

## `<MapLegend />`

A standalone continuous legend using the same tokens as the map.

```tsx
import { MapLegend } from "@afghan-charts/react";

<MapLegend
  domain={[0, 100]}
  palette={["#dff3ef", "#0f766e"]}
  hasMissingValues
  locale="prs"
  formatValue={(value) => `${value}%`}
  title="Coverage"
/>;
```

The legend reverses its gradient and label order under RTL. Its accessible group
name includes the title and minimum/maximum values.

## Utilities

```ts
import {
  getProvinces,
  getProvinceByCode,
  getProvinceName,
  isProvinceCode,
  getLocaleDirection,
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  INTL_LOCALES,
} from "@afghan-charts/react";
```

- `getProvinces()` returns a frozen array of all 34 provinces.
- `getProvinceByCode("AF-KAB")` returns the frozen province record.
- `getProvinceName("AF-KAB", "prs")` returns `"کابل"`.
- `isProvinceCode(value)` narrows a string to `ProvinceCode`.
- `getLocaleDirection("ps")` returns `"rtl"`.

## Tooltip context

```ts
interface ProvinceTooltipContext {
  province: Province;
  locale: Locale;
  value: number | null;
  formattedValue: string | null;
  direction: "ltr" | "rtl";
}
```

For the plain map, `value` and `formattedValue` are `null`. For the choropleth,
missing values produce `null` and the built-in tooltip renders the localized
"No data" copy.

Custom tooltips must return React nodes. The library never interprets an HTML
string.
