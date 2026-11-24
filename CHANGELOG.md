# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Full pnpm monorepo with `@afghan-province-charts/react` and a Vite playground.
- Build-time geometry pipeline from preserved geoBoundaries AFG ADM1 data.
- Reviewed mapping of all 34 source shapes to ISO 3166-2:AF codes, including
  corrections for Badakhshan and Kandahar.
- Interactive, responsive SVG map with controlled and uncontrolled selection.
- Pointer, touch, focus, Enter/Space and spatial arrow-key interaction.
- Accessible roving tab index, localized live announcements and accessible names.
- Built-in tooltips with custom React-node rendering and edge-aware placement.
- English, Dari and Pashto province names and localized UI chrome.
- RTL tooltips and legends without mirroring map geometry.
- Light and dark CSS-variable theming with `colors` overrides.
- Choropleth with partial data support, missing-vs-zero semantics, negative
  values, fixed domains, custom formatters and a continuous legend.
- SSR and hydration coverage.
- Vitest + React Testing Library suite, Playwright interaction/visual suite.
- Package validation with publint, Are The Types Wrong and an isolated tarball
  installer for React 18 and React 19.

### Notes

- `0.1.0-beta.0` is not published to npm yet.
- Boundary data is from 2007 and is a generalised cartographic source, not a
  legal or survey-grade boundary.
