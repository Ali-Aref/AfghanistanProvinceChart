# API reference

All exports are available from the package root:

```ts
import {
  AfghanistanMap,
  AfghanistanChoropleth,
  MapLegend,
  getProvinces,
  getProvinceByCode,
  getProvinceName,
  isProvinceCode,
  getLocaleDirection,
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  INTL_LOCALES,
} from "@afghan-province-charts/react";
```

Import styles once:

```ts
import "@afghan-province-charts/react/styles.css";
```

## Core types

```ts
type Locale = "en" | "prs" | "ps";
type Direction = "ltr" | "rtl";

type ProvinceCode =
  | "AF-BAL"
  | "AF-BAM"
  | "AF-BDG"
  | "AF-BDS"
  | "AF-BGL"
  | "AF-DAY"
  | "AF-FRA"
  | "AF-FYB"
  | "AF-GHA"
  | "AF-GHO"
  | "AF-HEL"
  | "AF-HER"
  | "AF-JOW"
  | "AF-KAB"
  | "AF-KAN"
  | "AF-KAP"
  | "AF-KDZ"
  | "AF-KHO"
  | "AF-KNR"
  | "AF-LAG"
  | "AF-LOG"
  | "AF-NAN"
  | "AF-NIM"
  | "AF-NUR"
  | "AF-PAN"
  | "AF-PAR"
  | "AF-PIA"
  | "AF-PKA"
  | "AF-SAM"
  | "AF-SAR"
  | "AF-TAK"
  | "AF-URU"
  | "AF-WAR"
  | "AF-ZAB";

interface Province {
  readonly code: ProvinceCode;
  readonly names: { readonly en: string; readonly prs: string; readonly ps: string };
}

type ProvinceNumericData = Partial<Record<ProvinceCode, number | null>>;
type ValueFormatter = (value: number) => string;
```

## `AfghanistanMapProps`

| Prop                      | Type                     | Default     | Notes                                           |
| ------------------------- | ------------------------ | ----------- | ----------------------------------------------- |
| `locale`                  | `Locale`                 | `"en"`      | Names, UI copy and text direction.              |
| `width`                   | `number \| string`       | `"100%"`    | Container width.                                |
| `height`                  | `number \| string`       | auto        | Container height; the SVG uses `xMidYMid meet`. |
| `className`               | `string`                 | —           | Applied to the map container.                   |
| `style`                   | `CSSProperties`          | —           | Applied to the map container.                   |
| `selectedProvince`        | `ProvinceCode \| null`   | `undefined` | Controlled selection.                           |
| `defaultSelectedProvince` | `ProvinceCode \| null`   | `null`      | Initial uncontrolled selection.                 |
| `onProvinceClick`         | `(interaction) => void`  | —           | Fires for pointer and keyboard activation.      |
| `onSelectionChange`       | `(code \| null) => void` | —           | Fires on select and deselect.                   |
| `showTooltip`             | `boolean`                | `true`      | Built-in tooltip.                               |
| `showProvinceLabels`      | `boolean`                | `false`     | Localized labels inside the map.                |
| `colors`                  | `Partial<MapColors>`     | theme       | CSS-variable color overrides.                   |
| `renderTooltip`           | `(context) => ReactNode` | —           | Replaces built-in tooltip content.              |
| `ariaLabel`               | `string`                 | localized   | Accessible name for the SVG group.              |
| `interactive`             | `boolean`                | `true`      | When false, paths are non-focusable images.     |

## `AfghanistanChoroplethProps`

Every map prop plus:

| Prop           | Type                        | Default             | Notes                                               |
| -------------- | --------------------------- | ------------------- | --------------------------------------------------- |
| `data`         | `ProvinceNumericData`       | required            | Values by canonical province code.                  |
| `domain`       | `readonly [number, number]` | auto                | Fixed scale domain. Reversed tuples are normalized. |
| `palette`      | `readonly [string, string]` | teal                | Two-stop hex palette.                               |
| `missingColor` | `string`                    | `--af-map-no-data`  | Any CSS color, including a variable.                |
| `formatValue`  | `ValueFormatter`            | `Intl.NumberFormat` | Tooltip and legend formatting.                      |
| `showLegend`   | `boolean`                   | `false`             | Continuous legend below the map.                    |
| `legendTitle`  | `string`                    | localized           | Legend heading.                                     |

## `MapLegendProps`

| Prop               | Type                        | Default              |
| ------------------ | --------------------------- | -------------------- |
| `domain`           | `readonly [number, number]` | required             |
| `palette`          | `readonly [string, string]` | required             |
| `missingColor`     | `string`                    | `--af-map-no-data`   |
| `hasMissingValues` | `boolean`                   | `false`              |
| `formatValue`      | `ValueFormatter`            | locale number format |
| `locale`           | `Locale`                    | `"en"`               |
| `title`            | `string`                    | localized            |
| `className`        | `string`                    | —                    |
| `style`            | `CSSProperties`             | —                    |

## `MapColors`

| Token               | CSS variable              | Purpose                                              |
| ------------------- | ------------------------- | ---------------------------------------------------- |
| `fill`              | `--af-map-fill`           | Default province fill.                               |
| `hoverFill`         | `--af-map-hover-fill`     | Hover fill on the plain map.                         |
| `selectedFill`      | `--af-map-selected-fill`  | Selected fill on the plain map.                      |
| `noData`            | `--af-map-no-data`        | Missing-data fill in choropleths.                    |
| `disabledFill`      | `--af-map-disabled-fill`  | Fill when `interactive={false}`.                     |
| `border`            | `--af-map-border`         | Province border color.                               |
| `outline`           | `--af-map-outline`        | Country outline.                                     |
| `borderWidth`       | `--af-map-border-width`   | Border width in CSS pixels; strokes are non-scaling. |
| `focus`             | `--af-map-focus`          | Focus and selected outline.                          |
| `label`             | `--af-map-label`          | Province label text.                                 |
| `labelHalo`         | `--af-map-label-halo`     | Halo behind labels.                                  |
| `tooltipBackground` | `--af-map-tooltip-bg`     | Tooltip background.                                  |
| `tooltipText`       | `--af-map-tooltip-text`   | Tooltip text.                                        |
| `tooltipBorder`     | `--af-map-tooltip-border` | Tooltip border.                                      |

## Interaction types

```ts
interface ProvinceInteraction {
  readonly province: Province;
  readonly code: ProvinceCode;
  readonly source: "pointer" | "keyboard";
  readonly event: SyntheticEvent<SVGPathElement>;
}

interface ProvinceTooltipContext {
  readonly province: Province;
  readonly locale: Locale;
  readonly value: number | null;
  readonly formattedValue: string | null;
  readonly direction: Direction;
}
```

## Utility signatures

```ts
function getProvinces(): readonly Province[];
function getProvinceByCode(code: ProvinceCode): Province;
function getProvinceName(code: ProvinceCode, locale?: Locale): string;
function isProvinceCode(value: string): value is ProvinceCode;
function getLocaleDirection(locale: Locale): "ltr" | "rtl";

const SUPPORTED_LOCALES: readonly Locale[]; // ["en", "prs", "ps"]
const DEFAULT_LOCALE: Locale; // "en"
const INTL_LOCALES: Readonly<Record<Locale, string>>;
```

`getProvinceName` falls back to English for a missing translation and finally to
the raw code for untyped runtime input.

## Selection semantics

| Mode         | Prop                   | Update                                                       |
| ------------ | ---------------------- | ------------------------------------------------------------ |
| Uncontrolled | omitted / `undefined`  | Internal state; `onSelectionChange` is still called.         |
| Controlled   | `ProvinceCode \| null` | Parent updates the prop; `onSelectionChange` reports intent. |

Activating the selected province toggles to `null`.

## Data validation rules

The choropleth treats these as missing: absent keys, `undefined`, `null`, `NaN`,
`Infinity` and `-Infinity`. Zero is valid. Values outside a fixed domain are
clamped for color resolution only; the original value remains in tooltips and
accessible labels.

## Package exports

```json
{
  ".": { "types": "./dist/index.d.ts", "import": "./dist/index.js" },
  "./styles.css": "./dist/styles.css",
  "./package.json": "./package.json"
}
```

There are no deep internal imports. The package is ESM-only and externalizes
React.
