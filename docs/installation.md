# Installation

## Package managers

```bash
pnpm add @afghan-charts/react
```

```bash
npm install @afghan-charts/react
```

```bash
yarn add @afghan-charts/react
```

> `0.1.0-beta.0` is not published to npm yet. Until release approval, install
> the local tarball (`pnpm pack` in `packages/react`) or use the workspace.

## Peer dependencies

- `react` `^18.0.0 || ^19.0.0`
- `react-dom` `^18.0.0 || ^19.0.0`

The library is ESM-only and externalizes React. It has no runtime dependencies.

## Stylesheet

```ts
import "@afghan-charts/react/styles.css";
```

Import it once. It is not injected automatically, which keeps SSR and CSS
cascade order predictable.

## Verify the installation

```tsx
import { AfghanistanMap } from "@afghan-charts/react";
import "@afghan-charts/react/styles.css";

export default function App() {
  return <AfghanistanMap locale="en" height={480} />;
}
```

You should see 34 province paths, a country outline and a working tooltip.

## Local tarball installation

From the repository root:

```bash
pnpm --filter @afghan-charts/react build
pnpm --filter @afghan-charts/react pack --pack-destination .artifacts
```

In a consumer project:

```bash
pnpm add /absolute/path/to/.artifacts/afghan-charts-react-0.1.0-beta.0.tgz
```

`pnpm verify:package` automates this for React 18 and React 19, including type
checking, Vite builds and SSR rendering.

## Common issues

- **Unstyled map:** missing `@afghan-charts/react/styles.css` import.
- **React hooks error in Next.js:** add `"use client"` to the file using
  callbacks or controlled selection.
- **Map has no height:** give the parent a width; optionally set `height`.
- **Tooltip is clipped:** remove `overflow: hidden` from the immediate card.
- **CJS `require` fails:** the package is ESM-only; use `import` or dynamic
  `import()`.

## Upgrading

This is the first release line. Check the
[changelog](../CHANGELOG.md) before upgrading. Province identifiers and public
ISO codes are intended to be stable.
