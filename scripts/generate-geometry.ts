/**
 * Generates the projected SVG geometry consumed by the React package.
 *
 * Run with: pnpm data:geometry
 *
 * The source GeoJSON is never shipped to consumers. Projection, label placement
 * and path serialisation all happen here, at build time.
 *
 * Paths are built from projected planar rings rather than `geoPath`. Some public
 * GeoJSON files wind exterior rings clockwise; d3's spherical clipping treats
 * those rings as the complement of the globe, which produces broken maps. Since
 * Afghanistan does not cross the antimeridian, planar ring serialisation is both
 * simpler and immune to winding order. `fill-rule: evenodd` handles holes.
 */
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { geoConicConformal } from "d3-geo";
import type { GeoProjection } from "d3-geo";
import type { Feature, FeatureCollection, MultiPolygon, Polygon, Position } from "geojson";
import polylabel from "polylabel";
import { merge } from "topojson-client";
import { topology } from "topojson-server";
import type { GeometryObject, Topology } from "topojson-specification";
import { PROVINCE_CODES } from "../packages/react/src/data/provinces.js";
import type { ProvinceCode } from "../packages/react/src/types/index.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = resolve(root, "data/source/geoBoundaries-AFG-ADM1.geojson");
const mappingPath = resolve(root, "data/metadata/province-source-mapping.json");
const outputPath = resolve(root, "packages/react/src/data/geometry.ts");

const VIEWBOX_WIDTH = 1000;
const PADDING = 24;
const PATH_PRECISION = 1;

interface SourceProperties {
  shapeName: string;
  shapeISO: string;
  shapeID: string;
  shapeGroup: string;
  shapeType: string;
}

type SourceGeometry = Polygon | MultiPolygon;
interface MappingFile {
  mapping: Record<string, string>;
}

interface SourceMetadata {
  sourceFile: string;
  sourceSha256: string;
}

interface Points {
  x: number;
  y: number;
}

interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ProjectedGeometry {
  d: string;
  bounds: Bounds;
  polygons: Position[][][];
}

interface GeneratedProvince {
  code: ProvinceCode;
  d: string;
  label: Points;
  bounds: Bounds;
}

function fail(message: string): never {
  console.error(`\n✖ ${message}\n`);
  process.exitCode = 1;
  throw new Error(message);
}

function round(value: number, digits = PATH_PRECISION): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function formatNumber(value: number): string {
  const rounded = round(value);
  return Object.is(rounded, -0) ? "0" : String(rounded);
}

function sha256(value: Buffer): string {
  return createHash("sha256").update(value).digest("hex");
}

function planarArea(ring: Position[]): number {
  let area = 0;
  for (let index = 0, previous = ring.length - 1; index < ring.length; previous = index++) {
    const a = ring[index];
    const b = ring[previous];
    if (!a || !b) continue;
    area += (b[0] ?? 0) * (a[1] ?? 0) - (a[0] ?? 0) * (b[1] ?? 0);
  }
  return Math.abs(area / 2);
}

function projectPoint(projection: GeoProjection, point: Position): [number, number] {
  const projected = projection([point[0] ?? 0, point[1] ?? 0]);
  if (!projected) fail("Projection returned null for a source coordinate.");
  return projected;
}

function geometryPolygons(geometry: SourceGeometry): Position[][][] {
  return geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;
}

function allPositions(geometry: SourceGeometry): Position[] {
  const positions: Position[] = [];
  for (const polygon of geometryPolygons(geometry)) {
    for (const ring of polygon) positions.push(...ring);
  }
  return positions;
}

function projectGeometry(
  geometry: SourceGeometry,
  projection: GeoProjection,
): ProjectedGeometry {
  const polygons = geometryPolygons(geometry);
  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;
  let d = "";
  const projectedPolygons: Position[][][] = [];

  for (const polygon of polygons) {
    const projectedRings: Position[][] = [];
    for (const ring of polygon) {
      if (ring.length === 0) continue;
      const projectedRing = ring.map((point) => {
        const [x, y] = projectPoint(projection, point);
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
        return [x, y] as Position;
      });
      if (projectedRing.length < 3) continue;
      const first = projectedRing[0];
      if (!first) continue;
      d += `M${formatNumber(first[0])},${formatNumber(first[1])}`;
      for (let index = 1; index < projectedRing.length; index += 1) {
        const point = projectedRing[index];
        if (!point) continue;
        d += `L${formatNumber(point[0])},${formatNumber(point[1])}`;
      }
      d += "Z";
      projectedRings.push(projectedRing);
    }
    if (projectedRings.length > 0) projectedPolygons.push(projectedRings);
  }

  if (!Number.isFinite(minX) || !Number.isFinite(minY)) {
    fail("A feature produced no projected coordinates.");
  }

  return {
    d,
    bounds: {
      x: round(minX),
      y: round(minY),
      width: round(maxX - minX),
      height: round(maxY - minY),
    },
    polygons: projectedPolygons,
  };
}

function findLabelPoint(projected: ProjectedGeometry): Points {
  let best: { area: number; point: Points } | null = null;

  for (const polygon of projected.polygons) {
    const outer = polygon[0];
    if (!outer || outer.length < 4) continue;
    const area = planarArea(outer);
    if (best && area <= best.area) continue;

    try {
      const label = polylabel(polygon, 1) as number[];
      const point = { x: round(label[0] ?? 0), y: round(label[1] ?? 0) };
      best = { area, point };
    } catch {
      // Fall through to the outer-ring average for degenerate polygons.
    }
  }

  if (best) return best.point;

  const all = projected.polygons.flatMap((polygon) => polygon[0] ?? []);
  if (all.length === 0) fail("Could not place a label for a province.");
  const sum = all.reduce(
    (accumulator, point) => ({
      x: accumulator.x + (point[0] ?? 0),
      y: accumulator.y + (point[1] ?? 0),
    }),
    { x: 0, y: 0 },
  );
  return { x: round(sum.x / all.length), y: round(sum.y / all.length) };
}

async function main(): Promise<void> {
  const [sourceBuffer, mappingBuffer, metadataBuffer] = await Promise.all([
    readFile(sourcePath),
    readFile(mappingPath, "utf8"),
    readFile(resolve(root, "data/metadata/source.json"), "utf8"),
  ]);

  const source = JSON.parse(sourceBuffer.toString("utf8")) as FeatureCollection<
    Polygon | MultiPolygon,
    SourceProperties
  >;
  const mappingFile = JSON.parse(mappingBuffer) as MappingFile;
  const metadata = JSON.parse(metadataBuffer) as SourceMetadata;

  const hash = sha256(sourceBuffer);
  if (hash !== metadata.sourceSha256) {
    fail(
      `Source checksum mismatch. Expected ${metadata.sourceSha256}, received ${hash}. ` +
        "Update data/metadata/source.json only after reviewing the new dataset.",
    );
  }

  if (source.type !== "FeatureCollection" || !Array.isArray(source.features)) {
    fail("Source file is not a GeoJSON FeatureCollection.");
  }
  if (source.features.length !== 34) {
    fail(`Expected 34 source features, found ${source.features.length}.`);
  }

  const mapping = mappingFile.mapping;
  const seenCodes = new Set<string>();
  const mappedFeatures: Array<Feature<Polygon | MultiPolygon, { code: ProvinceCode }>> = [];

  for (const feature of source.features) {
    const shapeName = feature.properties?.shapeName;
    if (!shapeName) fail("A source feature is missing shapeName.");

    const code = mapping[shapeName];
    if (!code) fail(`Unmapped source feature: "${shapeName}". Add it to the reviewed mapping.`);
    if (!(PROVINCE_CODES as readonly string[]).includes(code)) {
      fail(`Mapping for "${shapeName}" produced a non-canonical code: ${code}.`);
    }
    if (seenCodes.has(code)) fail(`Duplicate canonical code in source: ${code}.`);
    seenCodes.add(code);

    mappedFeatures.push({
      type: "Feature",
      properties: { code: code as ProvinceCode },
      geometry: feature.geometry,
    });
  }

  for (const code of PROVINCE_CODES) {
    if (!seenCodes.has(code)) fail(`Missing source geometry for ${code}.`);
  }

  const collection: FeatureCollection<Polygon | MultiPolygon, { code: ProvinceCode }> = {
    type: "FeatureCollection",
    features: mappedFeatures,
  };

  // Measure the raw projection at scale 1 so the viewBox follows the real
  // aspect ratio instead of stretching the country to a fixed rectangle.
  const rawProjection = geoConicConformal()
    .rotate([-67.5, 0])
    .parallels([29.5, 38.5])
    .scale(1)
    .translate([0, 0]);

  let rawMinX = Number.POSITIVE_INFINITY;
  let rawMinY = Number.POSITIVE_INFINITY;
  let rawMaxX = Number.NEGATIVE_INFINITY;
  let rawMaxY = Number.NEGATIVE_INFINITY;
  for (const feature of mappedFeatures) {
    for (const point of allPositions(feature.geometry)) {
      const [x, y] = projectPoint(rawProjection, point);
      rawMinX = Math.min(rawMinX, x);
      rawMinY = Math.min(rawMinY, y);
      rawMaxX = Math.max(rawMaxX, x);
      rawMaxY = Math.max(rawMaxY, y);
    }
  }

  const spanX = rawMaxX - rawMinX;
  const spanY = rawMaxY - rawMinY;
  if (!Number.isFinite(spanX) || !Number.isFinite(spanY) || spanX <= 0 || spanY <= 0) {
    fail("The projected geography has an invalid extent.");
  }

  const viewBoxHeight = Math.round(VIEWBOX_WIDTH / (spanX / spanY));
  const scale = Math.min(
    (VIEWBOX_WIDTH - PADDING * 2) / spanX,
    (viewBoxHeight - PADDING * 2) / spanY,
  );
  const centerX = (rawMinX + rawMaxX) / 2;
  const centerY = (rawMinY + rawMaxY) / 2;

  const projection = geoConicConformal()
    .rotate([-67.5, 0])
    .parallels([29.5, 38.5])
    .scale(scale)
    .translate([VIEWBOX_WIDTH / 2 - scale * centerX, viewBoxHeight / 2 - scale * centerY]);

  const generated: GeneratedProvince[] = [];

  for (const feature of mappedFeatures) {
    const projected = projectGeometry(feature.geometry, projection);
    if (!projected.d.startsWith("M") || !projected.d.endsWith("Z")) {
      fail(`Invalid SVG path for ${feature.properties.code}.`);
    }

    const label = findLabelPoint(projected);
    if (label.x < 0 || label.x > VIEWBOX_WIDTH || label.y < 0 || label.y > viewBoxHeight) {
      fail(`Label for ${feature.properties.code} falls outside the viewBox.`);
    }

    generated.push({
      code: feature.properties.code,
      d: projected.d,
      label,
      bounds: projected.bounds,
    });
  }

  generated.sort(
    (a, b) =>
      (PROVINCE_CODES as readonly string[]).indexOf(a.code) -
      (PROVINCE_CODES as readonly string[]).indexOf(b.code),
  );

  const topo = topology({ country: collection }, 1_000_000) as unknown as Topology<{
    country: GeometryObject<{ code: ProvinceCode }>;
  }>;
  const merged = merge(topo, topo.objects.country.geometries) as MultiPolygon;
  const outlinePath = projectGeometry(merged, projection).d;
  if (!outlinePath) fail("Could not generate the country outline.");

  const geometryEntries = generated
    .map((entry) => {
      const json = JSON.stringify(entry.d);
      return `  ${JSON.stringify(entry.code)}: {
    code: ${JSON.stringify(entry.code)},
    d: ${json},
    label: { x: ${entry.label.x}, y: ${entry.label.y} },
    bounds: { x: ${entry.bounds.x}, y: ${entry.bounds.y}, width: ${entry.bounds.width}, height: ${entry.bounds.height} },
  },`;
    })
    .join("\n");

  const contents = `/**
 * GENERATED FILE — DO NOT EDIT BY HAND.
 *
 * Generated by scripts/generate-geometry.ts from:
 *   data/source/${metadata.sourceFile}
 *   sha256:${metadata.sourceSha256}
 *
 * Projection: conic conformal, rotated to 67.5°E, standard parallels 29.5°/38.5°.
 * ViewBox: ${VIEWBOX_WIDTH} × ${viewBoxHeight}. No runtime projection is required.
 * Paths use planar ring serialisation and render with fill-rule="evenodd".
 */
import type { ProvinceCode } from "../types/index.js";

export const AFGHANISTAN_VIEWBOX = {
  width: ${VIEWBOX_WIDTH},
  height: ${viewBoxHeight},
} as const;

export interface ProvinceGeometry {
  readonly code: ProvinceCode;
  readonly d: string;
  readonly label: { readonly x: number; readonly y: number };
  readonly bounds: {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
  };
}

export const PROVINCE_GEOMETRY: Readonly<Record<ProvinceCode, ProvinceGeometry>> = {
${geometryEntries}
};

export const COUNTRY_OUTLINE_PATH = ${JSON.stringify(outlinePath)};
`;

  await writeFile(outputPath, contents, "utf8");

  const sizeKb = Buffer.byteLength(contents, "utf8") / 1024;
  console.log(
    `✔ Generated ${generated.length} province paths in a ${VIEWBOX_WIDTH}×${viewBoxHeight} viewBox ` +
      `(${sizeKb.toFixed(1)} KiB).`,
  );
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
