# Geographic data and licensing

This page records the provenance of the bundled geometry so consumers and
contributors can audit it.

## Source

| Field            | Value                                                        |
| ---------------- | ------------------------------------------------------------ |
| Dataset          | geoBoundaries `gbOpen` Afghanistan ADM1                      |
| Boundary ID      | `AFG-ADM1-12653393`                                          |
| Features         | 34                                                           |
| Boundary year    | 2007                                                         |
| Source           | Wikimedia / geoBoundaries                                    |
| Dataset page     | <https://www.geoboundaries.org/api/current/gbOpen/AFG/ADM1/> |
| Boundary license | Public Domain (per source metadata)                          |
| Attribution      | geoBoundaries, CC BY 4.0 for project code/derivatives        |

Preserved files:

- `data/source/geoBoundaries-AFG-ADM1.geojson`
- `data/source/geoBoundaries-AFG-ADM1-metaData.json`
- `data/source/CITATION-AND-USE-geoBoundaries.txt`
- `data/metadata/source.json` (URLs, retrieval date, checksum, notes)
- `data/metadata/province-source-mapping.json` (reviewed name-to-code map)

Source SHA-256:

```text
9c044ab9a0852fba5c89a1b922f5ed244969439f9a2673b9f6763c255e7a46fe
```

## Attribution

> Boundary data: geoBoundaries (<https://www.geoboundaries.org>).

Academic citation:

> Runfola D, Anderson A, Baier H, Crittenden M, Dowker E, Fuhrig S, et al.
> (2020) geoBoundaries: A global database of political administrative
> boundaries. PLoS ONE 15(4): e0231866.
> <https://doi.org/10.1371/journal.pone.0231866>

The boundary metadata lists the dataset as public domain. geoBoundaries asks
for attribution and releases its project code and derivative works under
CC BY 4.0. Keep the attribution in published products and documentation.

## Code mapping

The source `shapeISO` values are not fully canonical. The reviewed mapping in
`data/metadata/province-source-mapping.json` maps **shape names** to canonical
ISO 3166-2:AF codes:

| Source name | Source code | Canonical code | Note                              |
| ----------- | ----------- | -------------- | --------------------------------- |
| Badakhshan  | `AF_BDN`    | `AF-BDS`       | `AF-BDN` is not valid ISO 3166-2. |
| Kandahar    | `AF_KAN`    | `AF-KAN`       | Underscore normalized.            |
| Ghanzi      | `AF-GHA`    | `AF-GHA`       | Public name corrected to Ghazni.  |
| Nimruz      | `AF-NIM`    | `AF-NIM`       | Public English name Nimroz.       |

Fuzzy matching is not used. Every source shape must have an explicit mapping
entry, and validation fails on an unmapped feature.

## Generation

```bash
pnpm data:geometry
pnpm data:validate
```

`scripts/generate-geometry.ts`:

1. verifies the source checksum;
2. maps all 34 features and rejects duplicates or missing codes;
3. projects coordinates with a conic conformal projection
   (rotate 67.5°E, standard parallels 29.5°/38.5°);
4. fits the country to a `1000 × 780` viewBox without distortion;
5. serializes planar rings to SVG paths at one-decimal precision;
6. computes label anchors with `polylabel`;
7. merges a country outline with TopoJSON;
8. writes `packages/react/src/data/geometry.ts` with a deterministic header.

The generated file is committed. Do not edit it by hand.

### Why planar rings?

Some public GeoJSON files wind exterior rings clockwise. D3's spherical polygon
clipping interprets those rings as the complement of the globe, producing broken
or pole-crossing shapes. Afghanistan does not cross the antimeridian, so the
generator serializes projected planar rings directly and renders with
`fill-rule="evenodd"`. This preserves holes and disjoint geometry without
depending on winding order.

## Runtime guarantees

- No GeoJSON download at install time or render time.
- No projection at runtime.
- No external map service, tile server or CDN.
- No API keys or environment variables.
- D3 is a build-time dependency only.

## Accuracy and limitations

- The boundary year is 2007. Do not claim it represents current administrative
  geography without independent verification.
- The dataset is generalised cartographic geometry. It is not a legal,
  cadastral, electoral or survey-grade boundary.
- Province names are interface metadata and do not imply political claims.
- Labels for very small provinces may overlap when `showProvinceLabels` is on;
  labels are off by default.

## Replacing the dataset

1. Review the new license and attribution.
2. Preserve the source and metadata under `data/source/`.
3. Update `data/metadata/source.json` and the checksum.
4. Update the reviewed mapping.
5. Run `pnpm data:geometry` and inspect the rendered map.
6. Run `pnpm data:validate`, `pnpm test` and `pnpm test:e2e`.
7. Update this file, `DATA_LICENSE.md`, the README and the changelog.
