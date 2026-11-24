import { describe, expect, it } from "vitest";
import {
  AFGHANISTAN_VIEWBOX,
  COUNTRY_OUTLINE_PATH,
  PROVINCE_GEOMETRY,
} from "../src/data/geometry.js";
import { PROVINCE_CODES } from "../src/data/provinces.js";

describe("generated geometry", () => {
  it("has one path per canonical province and no extras", () => {
    expect(Object.keys(PROVINCE_GEOMETRY).sort()).toEqual([...PROVINCE_CODES].sort());
  });

  it("uses a positive viewBox", () => {
    expect(AFGHANISTAN_VIEWBOX.width).toBeGreaterThan(0);
    expect(AFGHANISTAN_VIEWBOX.height).toBeGreaterThan(0);
  });

  it("produces non-empty closed paths without NaN", () => {
    for (const code of PROVINCE_CODES) {
      const geometry = PROVINCE_GEOMETRY[code];
      expect(geometry.code).toBe(code);
      expect(geometry.d.startsWith("M")).toBe(true);
      expect(geometry.d.endsWith("Z")).toBe(true);
      expect(geometry.d).not.toContain("NaN");
      expect(geometry.d.length).toBeGreaterThan(100);
    }
  });

  it("places every label and bounds inside the viewBox", () => {
    const { width, height } = AFGHANISTAN_VIEWBOX;
    for (const code of PROVINCE_CODES) {
      const { bounds, label } = PROVINCE_GEOMETRY[code];
      expect(bounds.x).toBeGreaterThanOrEqual(0);
      expect(bounds.y).toBeGreaterThanOrEqual(0);
      expect(bounds.x + bounds.width).toBeLessThanOrEqual(width);
      expect(bounds.y + bounds.height).toBeLessThanOrEqual(height);
      expect(label.x).toBeGreaterThanOrEqual(bounds.x);
      expect(label.x).toBeLessThanOrEqual(bounds.x + bounds.width);
      expect(label.y).toBeGreaterThanOrEqual(bounds.y);
      expect(label.y).toBeLessThanOrEqual(bounds.y + bounds.height);
    }
  });

  it("includes a closed country outline", () => {
    expect(COUNTRY_OUTLINE_PATH.startsWith("M")).toBe(true);
    expect(COUNTRY_OUTLINE_PATH.endsWith("Z")).toBe(true);
    expect(COUNTRY_OUTLINE_PATH).not.toContain("NaN");
    expect(COUNTRY_OUTLINE_PATH.length).toBeGreaterThan(1000);
  });
});
