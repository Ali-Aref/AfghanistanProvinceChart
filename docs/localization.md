# Localization

The package supports three interface locales:

| Code  | Language | Direction |
| ----- | -------- | --------- |
| `en`  | English  | LTR       |
| `prs` | Dari     | RTL       |
| `ps`  | Pashto   | RTL       |

`prs` is used for Dari because it is the ISO 639-3 code for the language. For
`Intl` number formatting the library maps locales to BCP 47 tags:

```ts
{ en: "en-US", prs: "fa-AF", ps: "ps-AF" }
```

## Switching locale

```tsx
<AfghanistanMap locale="prs" />
<AfghanistanChoropleth data={data} locale="ps" showLegend />
```

Locale is a prop, not a document-wide setting. Switching it re-renders names,
tooltips, legends and accessible copy without a page reload. It does not depend
on `<html lang>` and does not require a provider.

## What is localized

- All 34 province names.
- Map accessible name and keyboard instructions.
- Tooltip "No data" copy.
- Selected-state text in accessible labels.
- Legend title, minimum/maximum labels and missing-data label.
- Number formatting through `Intl.NumberFormat`.

## What does not change

Province identifiers are always canonical ISO codes:

```ts
"AF-KAB"; // Kabul / کابل / کابل
```

The physical map is never mirrored under RTL. Text direction affects tooltip
content, legend order and gradient direction only. This is intentional: mirroring
geography would misrepresent the country.

## Name sources

English names follow common international usage. Dari names were checked against
the Persian Wikipedia article **ولایت‌های افغانستان**; Pashto names were checked
against **د افغانستان ولايتونه** (retrieved 2026-11-23). Dialectal spellings
vary. Corrections with a reliable source are welcome.

Some source spellings are normalized publicly:

| Source | Public              |
| ------ | ------------------- |
| Ghanzi | Ghazni              |
| Nimruz | Nimroz              |
| AF-BDN | AF-BDS (Badakhshan) |
| AF_KAN | AF-KAN (Kandahar)   |

## Runtime lookup

```ts
import { getProvinceName, getProvinces, getLocaleDirection } from "afghanistan-province-chart";

getProvinceName("AF-KAN", "prs"); // "قندهار"
getProvinceName("AF-KAN", "ps"); // "کندهار"
getLocaleDirection("ps"); // "rtl"
getProvinces()[0].names; // frozen en/prs/ps record
```

`getProvinceName` falls back to English if a translation is missing at runtime,
then to the raw code for untyped input.

## Adding a language

v0.1 intentionally keeps the API small. A future locale requires:

1. a new entry in `Locale` and the name registry;
2. localized UI strings;
3. an `Intl` mapping and direction;
4. validation tests for all 34 names.

Do not ship partially translated locales. The data validation script fails on
missing translations.

## Accessible labels

Path labels include the localized province name and, for choropleths, the
formatted value or "No data". RTL text is placed with `direction: rtl`; the
geometry and path order are unchanged.
