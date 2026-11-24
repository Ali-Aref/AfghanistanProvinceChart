# Contributing

Thank you for helping improve accessible maps for Afghanistan's 34 provinces.

## Ground rules

- Be respectful and constructive. This project documents geographic data; keep
  discussions factual and sourced.
- Do not publish to npm or push tags without explicit maintainer approval.
- Do not replace geographic boundary data silently. Follow
  [data-and-licensing.md](./data-and-licensing.md).
- Do not commit fabricated statistics, screenshots or test results.
- Keep the public API small. New prop proposals need a demonstrated use case.

## Setup

Requirements: Node.js 22.12+ and pnpm 10+.

```bash
corepack enable
pnpm install
pnpm build
pnpm dev
```

The playground runs at <http://localhost:5173>. The root `dev` script builds the
library first because the playground imports the built package.

## Workspace

```text
apps/playground      Vite + React demo and documentation site
packages/react       Published library
scripts              Data generation, validation, packaging checks
data                 Preserved source, metadata and mapping
docs                 Documentation
e2e                  Playwright tests
```

## Commands

| Command               | Purpose                                        |
| --------------------- | ---------------------------------------------- |
| `pnpm dev`            | Build the library and start the playground     |
| `pnpm build`          | Build the library and playground               |
| `pnpm test`           | Vitest unit and component tests                |
| `pnpm test:e2e`       | Playwright tests (requires a built playground) |
| `pnpm typecheck`      | Strict TypeScript checks                       |
| `pnpm lint`           | ESLint                                         |
| `pnpm format`         | Prettier                                       |
| `pnpm data:geometry`  | Regenerate SVG geometry                        |
| `pnpm data:validate`  | Validate provenance, registry and geometry     |
| `pnpm package:check`  | publint and Are The Types Wrong                |
| `pnpm verify:package` | Pack and test in isolated React 18/19 apps     |

## Code style

- TypeScript strict mode, no `any` in public code.
- Prefer small, typed helpers over abstraction.
- Keep interaction logic in `MapCanvas` shared by both components.
- Keep runtime dependencies at zero. D3 belongs to build scripts only.
- Use `af-` class prefixes in the library and keep CSS specificity low.
- Add tests with every behavior change.

## Data changes

Province names: include a reliable source in the pull request. Translation
corrections are valuable, but do not invent spellings.

Geometry changes: preserve the source, update checksums and mapping, regenerate,
and include before/after screenshots from the real playground.

## Accessibility checks

Before opening a pull request that touches interaction:

- tab into the map and traverse it with arrow keys;
- activate with Enter and Space;
- verify focus is visible in light and dark themes;
- verify the live region announces the focused province and value;
- test an RTL locale;
- check that tooltips do not block selection;
- run with reduced motion enabled.

## Tests

```bash
pnpm test
pnpm data:validate
pnpm build
pnpm typecheck
pnpm lint
pnpm test:e2e
```

For Playwright locally without installed browsers, a system Chrome can be used:

```bash
PLAYWRIGHT_CHANNEL=chrome pnpm test:e2e
```

## Commit and pull request checklist

- [ ] The change is scoped and explained.
- [ ] Tests cover the new behavior.
- [ ] Documentation matches the API.
- [ ] `pnpm typecheck`, `pnpm test`, `pnpm data:validate` pass.
- [ ] No generated files were edited by hand.
- [ ] No credentials, tokens or unpublished data are included.
- [ ] Screenshots, if any, come from the running playground.

## Release process

The maintainer handles releases. Before publishing:

1. Confirm access to the `@afghan-province-charts` npm scope.
2. Update the version and changelog.
3. Run the checks above, pack the package and inspect its contents.
4. Publish using an authorized npm account.

`0.1.0-beta.0` has not been published to npm yet.
