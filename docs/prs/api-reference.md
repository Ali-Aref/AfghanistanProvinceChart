# راهنمای API

تمام موارد زیر از `afghanistan-province-chart` صادر می‌شوند. شیوه‌نامه را یک‌بار با `import "afghanistan-province-chart/styles.css"` وارد کنید. [فهرست دقیق نوع‌ها و ویژگی‌ها به انگلیسی](../api-reference.md) مرجع کامل است؛ نام‌های کد در همهٔ زبان‌ها یکسان‌اند.

## کامپوننت‌ها

| نام                     | کاربرد                                    |
| ----------------------- | ----------------------------------------- |
| `AfghanistanMap`        | نقشهٔ SVG تعاملی با ۳۴ ولایت               |
| `AfghanistanChoropleth` | نقشهٔ رنگی برای داده‌های عددی با کدهای ISO |
| `MapLegend`             | راهنمای رنگ مستقل                         |

ویژگی‌های مشترک: `locale` (پیش‌فرض `en`؛ برای دری `prs` و برای پشتو `ps`)، `width`، `height`، `selectedProvince`، `defaultSelectedProvince`، `onProvinceClick`، `onSelectionChange`، `showTooltip`، `showProvinceLabels`، `colors`، `renderTooltip`، `ariaLabel` و `interactive`.

ویژگی‌های نقشهٔ رنگی: `data` (الزامی)، `domain`، `palette`، `missingColor`، `formatValue`، `showLegend` و `legendTitle`. اگر `legendTitle` را به‌صورت دستی وارد کنید، بسته آن را ترجمه نمی‌کند. دادهٔ مفقود صفر نیست؛ `NaN` و `null` نیز مفقود شمرده می‌شوند.

## توابع کمکی

`getProvinces()`، `getProvinceByCode(code)`، `getProvinceName(code, locale)`، `isProvinceCode(value)` و `getLocaleDirection(locale)`؛ همچنین `SUPPORTED_LOCALES`، `DEFAULT_LOCALE` و `INTL_LOCALES`.

```tsx
import { getProvinceName } from "afghanistan-province-chart";

getProvinceName("AF-KAN", "prs"); // "قندهار"
getProvinceName("AF-KAN", "ps"); // "کندهار"
```
