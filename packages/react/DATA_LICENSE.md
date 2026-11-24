# Data license and attribution

This project contains two kinds of material with different licensing:

1. **Original source code** in this repository and the `afghanistan-province-chart`
   package is licensed under the MIT License. See [LICENSE](./LICENSE).
2. **Geographic boundary data** is derived from geoBoundaries and carries its
   own provenance, public-domain status and attribution requirements, described
   below.

The generated SVG geometry in `packages/react/src/data/geometry.ts` is a
projected derivative of the boundary dataset.

## Source dataset

| Field                   | Value                                                                                                                              |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Dataset                 | geoBoundaries gbOpen, Afghanistan, ADM1                                                                                            |
| Boundary ID             | `AFG-ADM1-12653393`                                                                                                                |
| Administrative units    | 34 provinces (wilayat)                                                                                                             |
| Boundary reference year | 2007                                                                                                                               |
| Boundary source         | Wikimedia / geoBoundaries                                                                                                          |
| Dataset page            | <https://www.geoboundaries.org/api/current/gbOpen/AFG/ADM1/>                                                                       |
| File URL                | <https://media.githubusercontent.com/media/wmgeolab/geoBoundaries/main/releaseData/gbOpen/AFG/ADM1/geoBoundaries-AFG-ADM1.geojson> |
| Boundary license        | Public Domain (as listed in the geoBoundaries metadata)                                                                            |
| Source file             | `data/source/geoBoundaries-AFG-ADM1.geojson`                                                                                       |
| Source SHA-256          | `9c044ab9a0852fba5c89a1b922f5ed244969439f9a2673b9f6763c255e7a46fe`                                                                 |
| Retrieved               | 2026-11-23                                                                                                                         |

The original geoBoundaries metadata and citation files are preserved in
`data/source/`. The machine-readable provenance record is
`data/metadata/source.json`.

## Attribution

The boundary metadata lists the dataset as public domain. The geoBoundaries
project nevertheless requires attribution for use of its data product and
releases its project code and derivative works under CC BY 4.0. Include, at
minimum:

> Boundary data: geoBoundaries (https://www.geoboundaries.org).

Academic citation:

> Runfola D, Anderson A, Baier H, Crittenden M, Dowker E, Fuhrig S, et al.
> (2020) geoBoundaries: A global database of political administrative
> boundaries. PLoS ONE 15(4): e0231866.
> <https://doi.org/10.1371/journal.pone.0231866>

## Processing and corrections

The source is transformed reproducibly by `scripts/generate-geometry.ts`:

- the source checksum is verified before generation;
- source features are mapped to canonical ISO 3166-2:AF codes using the
  reviewed, explicit mapping in `data/metadata/province-source-mapping.json`;
- source codes `AF_BDN` (Badakhshan) and `AF_KAN` (Kandahar) are normalised to
  `AF-BDS` and `AF-KAN`;
- the source shape name `Ghanzi` is exposed as `Ghazni`, and `Nimruz` as
  `Nimroz`;
- geometry is projected once with a conic conformal projection (rotated to
  67.5°E, standard parallels 29.5°/38.5°);
- paths are serialised at one-decimal precision and rendered with
  `fill-rule="evenodd"`;
- label anchors are computed with a pole-of-inaccessibility algorithm.

No runtime downloads, projections or map-service requests occur.

## Limitations

- The boundary year is **2007**. It is a generalised cartographic dataset and
  does not claim to represent current administrative geography.
- The dataset is not a legal, cadastral or survey-grade boundary source.
- Province names and translations are provided for interface convenience.
  Dialectal spellings vary and corrections are welcome.

## New datasets

If a more suitable, accurately licensed dataset is adopted, update
`data/source/`, `data/metadata/source.json`, the reviewed mapping and this file
together, then regenerate and re-validate the geometry. Do not replace the
dataset silently.
