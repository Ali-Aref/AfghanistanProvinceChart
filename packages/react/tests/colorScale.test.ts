import { describe, expect, it } from "vitest";
import { PROVINCE_CODES } from "../src/data/provinces.js";
import type { ProvinceNumericData } from "../src/types/index.js";
import {
  DEFAULT_MISSING_COLOR,
  DEFAULT_PALETTE,
  createColorScale,
  parseHexColor,
} from "../src/utils/colorScale.js";
import { formatNumber, isFiniteNumber } from "../src/utils/formatting.js";

const fullData = Object.fromEntries(
  PROVINCE_CODES.map((code, index) => [code, index]),
) as ProvinceNumericData;

describe("color scale", () => {
  it("calculates an automatic domain", () => {
    const scale = createColorScale({ "AF-KAB": 10, "AF-HER": 30, "AF-BAL": -10 });
    expect(scale.domain).toEqual([-10, 30]);
    expect(scale.hasData).toBe(true);
    expect(scale.hasMissingValues).toBe(true);
  });

  it("treats zero as data and missing keys as missing", () => {
    const scale = createColorScale({ "AF-KAB": 0 });
    expect(scale.colorFor(0)).not.toBe(scale.missingColor);
    expect(scale.colorFor(undefined)).toBe(scale.missingColor);
    expect(scale.colorFor(null)).toBe(scale.missingColor);
    expect(scale.colorFor(Number.NaN)).toBe(scale.missingColor);
    expect(scale.domain).toEqual([0, 0]);
  });

  it("handles equal minimum and maximum deterministically", () => {
    const scale = createColorScale({ "AF-KAB": 42, "AF-HER": 42 });
    expect(scale.domain).toEqual([42, 42]);
    expect(scale.colorFor(42)).toBe(scale.colorFor(42));
    expect(scale.colorFor(42)).toMatch(/^rgb\(\d+, \d+, \d+\)$/);
  });

  it("clamps values to a fixed domain", () => {
    const scale = createColorScale({ "AF-KAB": 0, "AF-HER": 10 }, { domain: [0, 100] });
    expect(scale.domain).toEqual([0, 100]);
    expect(scale.colorFor(-10)).toBe(scale.colorFor(0));
    expect(scale.colorFor(1000)).toBe(scale.colorFor(100));
  });

  it("normalises a reversed domain", () => {
    const scale = createColorScale({ "AF-KAB": 0 }, { domain: [100, 0] });
    expect(scale.domain).toEqual([0, 100]);
  });

  it("supports negative values", () => {
    const scale = createColorScale({ "AF-KAB": -50, "AF-HER": 50 });
    expect(scale.domain).toEqual([-50, 50]);
    expect(scale.colorFor(-50)).not.toBe(scale.colorFor(50));
  });

  it("uses the supplied missing color", () => {
    const scale = createColorScale({}, { missingColor: "#ff00aa" });
    expect(scale.colorFor(undefined)).toBe("#ff00aa");
    expect(scale.missingColor).toBe("#ff00aa");
  });

  it("falls back to the default palette for invalid colors", () => {
    const scale = createColorScale(
      { "AF-KAB": 1, "AF-HER": 2 },
      { palette: ["not-a-color", "#ffffff"] },
    );
    expect(scale.palette).toEqual(DEFAULT_PALETTE);
  });

  it("detects complete versus partial datasets", () => {
    expect(createColorScale(fullData).hasMissingValues).toBe(false);
    expect(createColorScale({ ...fullData, "AF-KAB": null }).hasMissingValues).toBe(true);
    expect(createColorScale({ "AF-KAB": 1 }).hasMissingValues).toBe(true);
    expect(createColorScale({}).hasMissingValues).toBe(true);
  });

  it("uses the documented missing color by default", () => {
    expect(createColorScale({}).missingColor).toBe(DEFAULT_MISSING_COLOR);
    expect(DEFAULT_MISSING_COLOR).toContain("--af-map-no-data");
  });
});

describe("color helpers", () => {
  it("parses shorthand and full hex colors", () => {
    expect(parseHexColor("#fff")).toEqual([255, 255, 255]);
    expect(parseHexColor("#0f766e")).toEqual([15, 118, 110]);
    expect(parseHexColor("rgb(1,2,3)")).toBeNull();
    expect(parseHexColor("#12")).toBeNull();
  });

  it("formats numbers by locale", () => {
    expect(formatNumber(1500, "en")).toBe("1,500");
    expect(formatNumber(Number.NaN, "en")).toBe("—");
  });

  it("recognises only finite numbers", () => {
    expect(isFiniteNumber(0)).toBe(true);
    expect(isFiniteNumber(Number.NaN)).toBe(false);
    expect(isFiniteNumber(Infinity)).toBe(false);
    expect(isFiniteNumber("1")).toBe(false);
    expect(isFiniteNumber(null)).toBe(false);
  });
});
