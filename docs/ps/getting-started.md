# پیل کول

## نصب

```sh
pnpm add afghanistan-province-chart
```

د سټایل فایل یو ځل وارد کړئ او نقشه په `locale="ps"` پښتو وښایئ:

```tsx
import { AfghanistanMap } from "afghanistan-province-chart";
import "afghanistan-province-chart/styles.css";

export function ProvinceMap() {
  return <AfghanistanMap locale="ps" height={480} />;
}
```

د دري لپاره `locale="prs"` او د انګلیسي لپاره `locale="en"` وکاروئ. د نقشې ژبه د کامپوننټ ځانګړنه ده؛ د ټول سند ژبې بدلولو ته اړتیا نشته.

## په رنګیزه نقشه کې معلومات

```tsx
import { AfghanistanChoropleth } from "afghanistan-province-chart";

const data = { "AF-KAB": 96, "AF-HER": 72, "AF-PAN": 0 };

export function ProvinceReport() {
  return <AfghanistanChoropleth locale="ps" data={data} showLegend />;
}
```

معلومات د **ولایت په کوډ** ثبت کړئ، نه په ژباړلي نوم. ورک کلید له صفر سره توپیر لري؛ صفر رښتینی ارزښت دی. دا شمېرې یوازې بېلګه دي، رسمي احصایه نه ده. د ټولو ځانګړنو لپاره [د API لارښود](./api-reference.md) وګورئ.
