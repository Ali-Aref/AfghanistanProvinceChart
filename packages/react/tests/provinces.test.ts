import { describe, expect, it } from "vitest";
import {
  DEFAULT_LOCALE,
  INTL_LOCALES,
  PROVINCE_CODES,
  SUPPORTED_LOCALES,
  getLocaleDirection,
  getProvinceByCode,
  getProvinceName,
  getProvinces,
  isProvinceCode,
} from "../src/data/provinces.js";
import { UI_STRINGS } from "../src/data/strings.js";

describe("province registry", () => {
  it("contains exactly 34 unique canonical provinces", () => {
    expect(PROVINCE_CODES).toHaveLength(34);
    expect(new Set(PROVINCE_CODES).size).toBe(34);
    expect(getProvinces()).toHaveLength(34);
  });

  it("uses uppercase ISO 3166-2 AF codes", () => {
    for (const code of PROVINCE_CODES) {
      expect(code).toMatch(/^AF-[A-Z]{3}$/);
    }
  });

  it("is immutable and returns a stable reference", () => {
    expect(Object.isFrozen(getProvinces())).toBe(true);
    expect(getProvinces()).toBe(getProvinces());
    expect(Object.isFrozen(getProvinceByCode("AF-KAB"))).toBe(true);
    expect(Object.isFrozen(getProvinceByCode("AF-KAB").names)).toBe(true);
  });

  it("has non-empty English, Dari and Pashto names for every province", () => {
    for (const province of getProvinces()) {
      for (const locale of SUPPORTED_LOCALES) {
        expect(province.names[locale].trim().length).toBeGreaterThan(0);
        expect(province.names[locale]).not.toBe(province.code);
      }
    }
  });

  it("exposes localized lookup helpers", () => {
    expect(getProvinceByCode("AF-KAB").names.en).toBe("Kabul");
    expect(getProvinceName("AF-KAB", "en")).toBe("Kabul");
    expect(getProvinceName("AF-KAB", "prs")).toBe("کابل");
    expect(getProvinceName("AF-KAB", "ps")).toBe("کابل");
    expect(getProvinceName("AF-KAN", "prs")).toBe("قندهار");
    expect(getProvinceName("AF-KAN", "ps")).toBe("کندهار");
    expect(getProvinceName("AF-KAB")).toBe("Kabul");
    expect(DEFAULT_LOCALE).toBe("en");
  });

  it("normalises source irregularities in the public registry", () => {
    expect(getProvinceByCode("AF-BDS").names.en).toBe("Badakhshan");
    expect(getProvinceByCode("AF-GHA").names.en).toBe("Ghazni");
    expect(getProvinceByCode("AF-NIM").names.en).toBe("Nimroz");
  });

  it("narrows arbitrary strings to province codes", () => {
    expect(isProvinceCode("AF-KAB")).toBe(true);
    expect(isProvinceCode("AF-XXX")).toBe(false);
    expect(isProvinceCode("kabul")).toBe(false);
  });

  it("resolves text direction", () => {
    expect(getLocaleDirection("en")).toBe("ltr");
    expect(getLocaleDirection("prs")).toBe("rtl");
    expect(getLocaleDirection("ps")).toBe("rtl");
  });

  it("provides complete UI copy for every locale", () => {
    for (const locale of SUPPORTED_LOCALES) {
      const strings = UI_STRINGS[locale];
      for (const value of Object.values(strings)) {
        expect(value.trim().length).toBeGreaterThan(0);
      }
      expect(INTL_LOCALES[locale].length).toBeGreaterThan(0);
    }
    expect(INTL_LOCALES.prs).toBe("fa-AF");
    expect(INTL_LOCALES.ps).toBe("ps-AF");
  });
});
