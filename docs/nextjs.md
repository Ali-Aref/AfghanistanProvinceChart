# Next.js integration

The components are server-render safe. They do not touch `window`, `document`,
`localStorage` or `matchMedia` at module initialization.

## App Router

`AfghanistanMap` uses React hooks for selection, focus and tooltips. Any file
that **passes callbacks or controls selection** must be a Client Component.

```tsx
// app/province-panel.tsx
"use client";

import { useState } from "react";
import { AfghanistanMap, type ProvinceCode } from "@afghan-province-charts/react";
import "@afghan-province-charts/react/styles.css";

export function ProvincePanel() {
  const [selected, setSelected] = useState<ProvinceCode | null>(null);

  return (
    <AfghanistanMap
      locale="en"
      selectedProvince={selected}
      onSelectionChange={setSelected}
      height={480}
    />
  );
}
```

```tsx
// app/page.tsx
import { ProvincePanel } from "./province-panel";

export default function Page() {
  return (
    <main>
      <ProvincePanel />
    </main>
  );
}
```

A purely static, non-interactive map can be rendered without `"use client"` if
you do not pass functions and set `interactive={false}`. In practice, adding
`"use client"` to the wrapper is simpler and recommended.

## Stylesheet

Import the stylesheet from the Client Component or from the root layout:

```tsx
import "@afghan-province-charts/react/styles.css";
```

Next.js supports global CSS imports from the App Router root layout. The package
exports the file explicitly:

```ts
import "@afghan-province-charts/react/styles.css";
```

## Dynamic data

Fetch data in a Server Component and pass plain serializable values into the
Client Component:

```tsx
// app/report/page.tsx
import { ReportMap } from "./report-map";

export default async function Page() {
  const data = await loadProvinceMetrics();
  return <ReportMap data={data} />;
}
```

```tsx
// app/report/report-map.tsx
"use client";

import { AfghanistanChoropleth } from "@afghan-province-charts/react";
import type { ProvinceNumericData } from "@afghan-province-charts/react";

export function ReportMap({ data }: { data: ProvinceNumericData }) {
  return <AfghanistanChoropleth data={data} showLegend showTooltip />;
}
```

Do not pass functions across the Server/Client boundary.

## Hydration

Province IDs, geometry and labels are deterministic. The library uses React's
`useId` for SVG description IDs, so server and client IDs match. The test suite
covers `renderToString` plus `hydrateRoot`.

## CSS variables and Tailwind

You do not need Tailwind. If you use it, style a wrapper and set map variables:

```tsx
<div className="[--af-map-fill:#e8edf2] [--af-map-selected-fill:#0f766e]">
  <AfghanistanMap />
</div>
```

The library classes are scoped and should not collide with utility classes.

## Avoid dynamic import unless needed

Dynamic import is not required for SSR. Use it only if you want to defer the map
bundle until below the fold:

```tsx
const AfghanistanMap = dynamic(
  () => import("@afghan-province-charts/react").then((module) => module.AfghanistanMap),
  { ssr: true },
);
```

If you do this, import `@afghan-province-charts/react/styles.css` once in a layout or the
component that uses the map.

## Troubleshooting

- **"useState only works in Client Components"** — add `"use client"` to the file
  that renders the map with callbacks.
- **Unstyled map** — import `@afghan-province-charts/react/styles.css`.
- **Map has unexpected height** — set a `height` or give the parent a width.
- **Tooltip appears clipped** — remove `overflow: hidden` from the immediate card
  or place the map in a container that allows overflow.
- **RTL flips the map** — the library never sets `direction: rtl` on the SVG; if
  your own CSS does, scope it to text-only wrappers.
