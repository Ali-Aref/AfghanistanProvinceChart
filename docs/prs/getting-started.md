# شروع کار

## نصب

```sh
pnpm add afghanistan-province-chart
```

شیوه‌نامه را یک‌بار وارد کنید و نقشه را با `locale="prs"` به دری نمایش دهید:

```tsx
import { AfghanistanMap } from "afghanistan-province-chart";
import "afghanistan-province-chart/styles.css";

export function ProvinceMap() {
  return <AfghanistanMap locale="prs" height={480} />;
}
```

برای پشتو از `locale="ps"` و برای انگلیسی از `locale="en"` استفاده کنید. زبان نقشه یک ویژگی کامپوننت است و نیازی به تغییر زبان همهٔ سند ندارد.

## داده‌ها در نقشهٔ رنگی

```tsx
import { AfghanistanChoropleth } from "afghanistan-province-chart";

const data = { "AF-KAB": 96, "AF-HER": 72, "AF-PAN": 0 };

export function ProvinceReport() {
  return <AfghanistanChoropleth locale="prs" data={data} showLegend />;
}
```

داده باید با **کد ولایت** ثبت شود، نه نام ترجمه‌شده. کلید مفقود با صفر فرق دارد؛ صفر مقدار واقعی است. این اعداد صرفاً نمونه‌اند و آمار رسمی نیستند. برای تمام ویژگی‌ها [راهنمای API](./api-reference.md) را ببینید.
