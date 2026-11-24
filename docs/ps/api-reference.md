# د API لارښود

لاندې ټول توکي له `afghanistan-province-chart` څخه صادریږي. سټایل فایل یو ځل په `import "afghanistan-province-chart/styles.css"` وارد کړئ. د [ډولونو او ځانګړنو بشپړ انګلیسي نوملړ](../api-reference.md) کره مرجع ده؛ د کوډ نومونه په ټولو ژبو یو شان دي.

## کامپوننټونه

| نوم                     | کار                                                   |
| ----------------------- | ----------------------------------------------------- |
| `AfghanistanMap`        | د ۳۴ ولایتونو متقابله SVG نقشه                        |
| `AfghanistanChoropleth` | د ISO کوډونو له مخې د شمېره‌ییزو معلوماتو رنګیزه نقشه |
| `MapLegend`             | خپلواک رنګیز لارښود                                   |

ګډې ځانګړنې: `locale` (اصلي `en`؛ د دري لپاره `prs` او د پښتو لپاره `ps`)، `width`، `height`، `selectedProvince`، `defaultSelectedProvince`، `onProvinceClick`، `onSelectionChange`، `showTooltip`، `showProvinceLabels`، `colors`، `renderTooltip`، `ariaLabel` او `interactive`.

د رنګیزې نقشې ځانګړنې: `data` (اړین)، `domain`، `palette`، `missingColor`، `formatValue`، `showLegend` او `legendTitle`. که `legendTitle` پخپله وټاکئ، بسته یې نه ژباړي. ورک ارزښت صفر نه دی؛ `NaN` او `null` هم ورک ګڼل کېږي.

## مرستندویه دندې

`getProvinces()`، `getProvinceByCode(code)`، `getProvinceName(code, locale)`، `isProvinceCode(value)` او `getLocaleDirection(locale)`؛ همدارنګه `SUPPORTED_LOCALES`، `DEFAULT_LOCALE` او `INTL_LOCALES`.

```tsx
import { getProvinceName } from "afghanistan-province-chart";

getProvinceName("AF-KAN", "prs"); // "قندهار"
getProvinceName("AF-KAN", "ps"); // "کندهار"
```
