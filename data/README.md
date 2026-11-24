# Data directory

This directory preserves the inputs and provenance for the bundled SVG geometry.

```text
data/
├── source/
│   ├── geoBoundaries-AFG-ADM1.geojson          # original source geometry
│   ├── geoBoundaries-AFG-ADM1-metaData.json    # source metadata
│   └── CITATION-AND-USE-geoBoundaries.txt      # citation and use notes
└── metadata/
    ├── source.json                             # URLs, license, checksum, retrieval date
    └── province-source-mapping.json            # reviewed source name -> ISO code map
```

## Rules

- Do not edit the source GeoJSON or source metadata. They are preserved for
  reproducibility and checksum verification.
- Every source shape must appear in the reviewed mapping. Fuzzy matching is not
  used.
- The public identifiers are ISO 3166-2:AF codes. The source uses `AF_BDN` for
  Badakhshan and `AF_KAN` for Kandahar; both are corrected during generation.
- Run `pnpm data:geometry` after an intentional source or mapping change, then
  `pnpm data:validate`.
- The generated file `packages/react/src/data/geometry.ts` is committed and must
  not be edited by hand.

## Provenance

See [../DATA_LICENSE.md](../DATA_LICENSE.md) and
[../docs/data-and-licensing.md](../docs/data-and-licensing.md).

Source checksum:

```text
9c044ab9a0852fba5c89a1b922f5ed244969439f9a2673b9f6763c255e7a46fe
```
