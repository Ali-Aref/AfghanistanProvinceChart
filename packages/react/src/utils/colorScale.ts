import { isProvinceCode } from "../data/provinces.js";
import type { ColorPalette, ColorScale, ProvinceNumericData } from "../types/index.js";
import { isFiniteNumber } from "./formatting.js";

export const DEFAULT_PALETTE: ColorPalette = Object.freeze(["#dff3ef", "#0f766e"] as const);
/**
 * The missing-data color is a CSS variable so the default follows the scoped
 * light/dark tokens. Consumers can pass any CSS color (including a variable) via
 * the `missingColor` prop.
 */
export const DEFAULT_MISSING_COLOR = "var(--af-map-no-data, #eef1f5)";

type Rgb = readonly [number, number, number];

/** Parses `#rgb` and `#rrggbb` values. Returns `null` for unsupported syntax. */
export function parseHexColor(color: string): Rgb | null {
  const value = color.trim();
  if (!/^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(value)) return null;

  const hex = value.slice(1);
  if (hex.length === 3) {
    const r = Number.parseInt(`${hex[0]}${hex[0]}`, 16);
    const g = Number.parseInt(`${hex[1]}${hex[1]}`, 16);
    const b = Number.parseInt(`${hex[2]}${hex[2]}`, 16);
    return [r, g, b];
  }

  return [
    Number.parseInt(hex.slice(0, 2), 16),
    Number.parseInt(hex.slice(2, 4), 16),
    Number.parseInt(hex.slice(4, 6), 16),
  ];
}

function toRgbColor([r, g, b]: Rgb): string {
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}

function mixColors(from: Rgb, to: Rgb, t: number): Rgb {
  const amount = Math.min(1, Math.max(0, t));
  return [
    from[0] + (to[0] - from[0]) * amount,
    from[1] + (to[1] - from[1]) * amount,
    from[2] + (to[2] - from[2]) * amount,
  ];
}

export interface ColorScaleOptions {
  domain?: readonly [number, number] | undefined;
  palette?: ColorPalette | undefined;
  missingColor?: string | undefined;
}

function resolvePalette(palette: ColorPalette | undefined): {
  colors: ColorPalette;
  rgb: readonly [Rgb, Rgb];
} {
  const candidate = palette ?? DEFAULT_PALETTE;
  const from = parseHexColor(candidate[0]);
  const to = parseHexColor(candidate[1]);
  if (!from || !to) {
    const fallbackFrom = parseHexColor(DEFAULT_PALETTE[0]) as Rgb;
    const fallbackTo = parseHexColor(DEFAULT_PALETTE[1]) as Rgb;
    return { colors: DEFAULT_PALETTE, rgb: [fallbackFrom, fallbackTo] };
  }
  return { colors: candidate, rgb: [from, to] };
}

/**
 * Builds a deterministic, continuous two-stop color scale from partial province data.
 *
 * Invalid, `null`, `undefined` and `NaN` values are treated as missing and never
 * coerced to zero. A partial dataset therefore produces the missing-data color,
 * while an explicit `0` receives a real scale position.
 */
export function createColorScale(
  data: ProvinceNumericData,
  options: ColorScaleOptions = {},
): ColorScale {
  const values: number[] = [];
  let hasInvalidValues = false;
  let validCount = 0;

  for (const [code, value] of Object.entries(data)) {
    if (!isProvinceCode(code)) continue;
    if (isFiniteNumber(value)) {
      values.push(value);
      validCount += 1;
    } else {
      hasInvalidValues = true;
    }
  }

  // A partial dataset means at least one canonical province has no usable value.
  const hasMissingValues = hasInvalidValues || validCount < 34;

  let min = values.length > 0 ? Math.min(...values) : 0;
  let max = values.length > 0 ? Math.max(...values) : 1;

  if (
    options.domain &&
    isFiniteNumber(options.domain[0]) &&
    isFiniteNumber(options.domain[1])
  ) {
    const [a, b] = options.domain;
    min = Math.min(a, b);
    max = Math.max(a, b);
  }

  const { colors, rgb } = resolvePalette(options.palette);
  const missingCandidate = options.missingColor?.trim();
  const missingColor =
    missingCandidate && missingCandidate.length > 0 ? missingCandidate : DEFAULT_MISSING_COLOR;

  const colorFor = (value: number | null | undefined): string => {
    if (!isFiniteNumber(value)) return missingColor;
    const t = max === min ? 0.5 : (value - min) / (max - min);
    return toRgbColor(mixColors(rgb[0], rgb[1], t));
  };

  return {
    domain: [min, max] as const,
    palette: colors,
    missingColor,
    hasData: values.length > 0,
    hasMissingValues,
    colorFor,
  };
}

/** Returns the valid numeric values present in a partial dataset. */
export function getNumericValues(data: ProvinceNumericData): number[] {
  return Object.entries(data)
    .filter(([code, value]) => isProvinceCode(code) && isFiniteNumber(value))
    .map(([, value]) => value as number);
}
