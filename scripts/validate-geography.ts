/**
 * Validates the preserved geographic source, the reviewed name mapping, the
 * canonical province registry and the generated SVG geometry.
 *
 * Run with: pnpm data:validate
 * Exits non-zero on any mismatch so CI can gate the repository.
 */
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { FeatureCollection, MultiPolygon, Polygon } from "geojson";
import {
  PROVINCE_CODES,
  PROVINCES,
  SUPPORTED_LOCALES,
  getProvinceName,
} from "../packages/react/src/data/provinces.js";
import { UI_STRINGS } from "../packages/react/src/data/strings.js";
import {
  AFGHANISTAN_VIEWBOX,
  COUNTRY_OUTLINE_PATH,
  PROVINCE_GEOMETRY,
} from "../packages/react/src/data/geometry.js";
import type { ProvinceCode } from "../packages/react/src/types/index.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const problems: string[] = [];

function check(condition: boolean, message: string): void {
  if (!condition) problems.push(message);
}

function isInside(
  label: { x: number; y: number },
  box: { x: number; y: number; width: number; height: number },
): boolean {
  return (
    label.x >= box.x &&
    label.x <= box.x + box.width &&
    label.y >= box.y &&
    label.y <= box.y + box.height
  );
}

interface SourceProperties {
  shapeName: string;
  shapeISO: string;
}

const sourceBuffer = await readFile(
  resolve(root, "data/source/geoBoundaries-AFG-ADM1.geojson"),
);
const source = JSON.parse(sourceBuffer.toString("utf8")) as FeatureCollection<
  Polygon | MultiPolygon,
  SourceProperties
>;
const metadata = JSON.parse(
  await readFile(resolve(root, "data/metadata/source.json"), "utf8"),
) as { sourceSha256: string; admUnitCount: number };
const mappingFile = JSON.parse(
  await readFile(resolve(root, "data/metadata/province-source-mapping.json"), "utf8"),
) as { mapping: Record<string, string> };

const hash = createHash("sha256").update(sourceBuffer).digest("hex");
check(hash === metadata.sourceSha256, `Source sha256 mismatch: ${hash}`);
check(
  source.features.length === 34,
  `Expected 34 source features, found ${source.features.length}.`,
);
check(metadata.admUnitCount === 34, "Source metadata does not declare 34 ADM1 units.");

const shapeNames = new Set<string>();
for (const feature of source.features) {
  const name = feature.properties?.shapeName;
  check(typeof name === "string" && name.length > 0, "A source feature has no shapeName.");
  if (name) {
    check(!shapeNames.has(name), `Duplicate source shapeName: ${name}.`);
    shapeNames.add(name);
    check(Boolean(mappingFile.mapping[name]), `Source shapeName is not mapped: ${name}.`);
  }
}

check(
  Object.keys(mappingFile.mapping).length === 34,
  `Mapping contains ${Object.keys(mappingFile.mapping).length} entries instead of 34.`,
);
const mappedCodes = Object.values(mappingFile.mapping);
check(new Set(mappedCodes).size === 34, "Mapping produces duplicate canonical codes.");

check(
  PROVINCE_CODES.length === 34,
  `Registry contains ${PROVINCE_CODES.length} province codes.`,
);
check(new Set(PROVINCE_CODES).size === 34, "Registry contains duplicate province codes.");
check(PROVINCES.length === 34, `Province registry contains ${PROVINCES.length} entries.`);

const generatedCodes = Object.keys(PROVINCE_GEOMETRY).sort();
check(
  generatedCodes.join(",") === [...PROVINCE_CODES].sort().join(","),
  "Generated geometry codes do not match the canonical registry.",
);

for (const province of PROVINCES) {
  check(
    PROVINCE_CODES.includes(province.code),
    `Province ${province.code} is not in PROVINCE_CODES.`,
  );
  for (const locale of SUPPORTED_LOCALES) {
    const name = getProvinceName(province.code, locale);
    check(name.trim().length > 0, `Missing ${locale} name for ${province.code}.`);
    check(
      name !== province.code,
      `Name for ${province.code} fell back to its code in ${locale}.`,
    );
    check(UI_STRINGS[locale].mapLabel.trim().length > 0, `Missing ${locale} map label.`);
  }
}

check(COUNTRY_OUTLINE_PATH.startsWith("M"), "Country outline path is empty or malformed.");
check(COUNTRY_OUTLINE_PATH.endsWith("Z"), "Country outline path is not closed.");
check(!COUNTRY_OUTLINE_PATH.includes("NaN"), "Country outline path contains NaN.");

for (const code of PROVINCE_CODES) {
  const geometry = PROVINCE_GEOMETRY[code as ProvinceCode];
  check(Boolean(geometry), `Missing generated geometry for ${code}.`);
  if (!geometry) continue;

  check(geometry.code === code, `Geometry code mismatch for ${code}.`);
  check(geometry.d.startsWith("M"), `${code} path does not start with M.`);
  check(geometry.d.endsWith("Z"), `${code} path is not closed.`);
  check(!geometry.d.includes("NaN"), `${code} path contains NaN.`);
  check(geometry.d.length > 100, `${code} path is suspiciously short.`);
  check(
    /^[MLZ0-9.,\- ]+$/.test(geometry.d),
    `${code} path contains unsupported or malformed commands.`,
  );

  check(
    geometry.bounds.x >= 0 &&
      geometry.bounds.y >= 0 &&
      geometry.bounds.x + geometry.bounds.width <= AFGHANISTAN_VIEWBOX.width &&
      geometry.bounds.y + geometry.bounds.height <= AFGHANISTAN_VIEWBOX.height,
    `${code} bounds fall outside the viewBox.`,
  );
  check(isInside(geometry.label, geometry.bounds), `${code} label is outside its bounds.`);
  check(
    geometry.label.x >= 0 &&
      geometry.label.x <= AFGHANISTAN_VIEWBOX.width &&
      geometry.label.y >= 0 &&
      geometry.label.y <= AFGHANISTAN_VIEWBOX.height,
    `${code} label is outside the viewBox.`,
  );
}

if (problems.length > 0) {
  console.error(`\n✖ Geographic validation failed with ${problems.length} problem(s):`);
  for (const problem of problems) console.error(`  • ${problem}`);
  process.exit(1);
}

console.log("✔ Geography validated:");
console.log(`  • ${PROVINCES.length} provinces, ${SUPPORTED_LOCALES.length} locales`);
console.log(`  • Source sha256 ${hash.slice(0, 12)}… (34 ADM1 features)`);
console.log(
  `  • ${Object.keys(PROVINCE_GEOMETRY).length} SVG paths inside a ${AFGHANISTAN_VIEWBOX.width}×${AFGHANISTAN_VIEWBOX.height} viewBox`,
);
