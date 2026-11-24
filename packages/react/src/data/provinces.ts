import type { Locale, Province, ProvinceCode } from "../types/index.js";

/** Default locale used when a component does not receive a `locale` prop. */
export const DEFAULT_LOCALE: Locale = "en";

/** Locales supported by the library, in documentation order. */
export const SUPPORTED_LOCALES: readonly Locale[] = Object.freeze(["en", "prs", "ps"]);

/**
 * Canonical ISO 3166-2 codes for Afghanistan's 34 provinces.
 *
 * The source GeoJSON uses a few non-canonical codes (`AF_BDN` and `AF_KAN`); the
 * generated data is normalised to the codes below. See `data/README.md`.
 */
export const PROVINCE_CODES = [
  "AF-BAL",
  "AF-BAM",
  "AF-BDG",
  "AF-BDS",
  "AF-BGL",
  "AF-DAY",
  "AF-FRA",
  "AF-FYB",
  "AF-GHA",
  "AF-GHO",
  "AF-HEL",
  "AF-HER",
  "AF-JOW",
  "AF-KAB",
  "AF-KAN",
  "AF-KAP",
  "AF-KDZ",
  "AF-KHO",
  "AF-KNR",
  "AF-LAG",
  "AF-LOG",
  "AF-NAN",
  "AF-NIM",
  "AF-NUR",
  "AF-PAN",
  "AF-PAR",
  "AF-PIA",
  "AF-PKA",
  "AF-SAM",
  "AF-SAR",
  "AF-TAK",
  "AF-URU",
  "AF-WAR",
  "AF-ZAB",
] as const satisfies readonly ProvinceCode[];

/**
 * Province name registry.
 *
 * English names follow common international usage. Dari names were checked
 * against the Persian Wikipedia article "ولایت‌های افغانستان" and Pashto names
 * against the Pashto Wikipedia article "د افغانستان ولايتونه" (retrieved
 * 2026-11-23). Dialectal spellings vary; corrections are welcome.
 */
const PROVINCE_NAMES: Readonly<
  Record<ProvinceCode, { readonly en: string; readonly prs: string; readonly ps: string }>
> = {
  "AF-BAL": { en: "Balkh", prs: "بلخ", ps: "بلخ" },
  "AF-BAM": { en: "Bamyan", prs: "بامیان", ps: "بامیان" },
  "AF-BDG": { en: "Badghis", prs: "بادغیس", ps: "بادغیس" },
  "AF-BDS": { en: "Badakhshan", prs: "بدخشان", ps: "بدخشان" },
  "AF-BGL": { en: "Baghlan", prs: "بغلان", ps: "بغلان" },
  "AF-DAY": { en: "Daykundi", prs: "دایکندی", ps: "دایکندی" },
  "AF-FRA": { en: "Farah", prs: "فراه", ps: "فراه" },
  "AF-FYB": { en: "Faryab", prs: "فاریاب", ps: "فاریاب" },
  "AF-GHA": { en: "Ghazni", prs: "غزنی", ps: "غزني" },
  "AF-GHO": { en: "Ghor", prs: "غور", ps: "غور" },
  "AF-HEL": { en: "Helmand", prs: "هلمند", ps: "هلمند" },
  "AF-HER": { en: "Herat", prs: "هرات", ps: "هرات" },
  "AF-JOW": { en: "Jowzjan", prs: "جوزجان", ps: "جوزجان" },
  "AF-KAB": { en: "Kabul", prs: "کابل", ps: "کابل" },
  "AF-KAN": { en: "Kandahar", prs: "قندهار", ps: "کندهار" },
  "AF-KAP": { en: "Kapisa", prs: "کاپیسا", ps: "کاپیسا" },
  "AF-KDZ": { en: "Kunduz", prs: "کندز", ps: "کندوز" },
  "AF-KHO": { en: "Khost", prs: "خوست", ps: "خوست" },
  "AF-KNR": { en: "Kunar", prs: "کنر", ps: "کونړ" },
  "AF-LAG": { en: "Laghman", prs: "لغمان", ps: "لغمان" },
  "AF-LOG": { en: "Logar", prs: "لوگر", ps: "لوگر" },
  "AF-NAN": { en: "Nangarhar", prs: "ننگرهار", ps: "ننگرهار" },
  "AF-NIM": { en: "Nimroz", prs: "نیمروز", ps: "نیمروز" },
  "AF-NUR": { en: "Nuristan", prs: "نورستان", ps: "نورستان" },
  "AF-PAN": { en: "Panjshir", prs: "پنجشیر", ps: "پنجشېر" },
  "AF-PAR": { en: "Parwan", prs: "پروان", ps: "پروان" },
  "AF-PIA": { en: "Paktia", prs: "پکتیا", ps: "پکتیا" },
  "AF-PKA": { en: "Paktika", prs: "پکتیکا", ps: "پکتیکا" },
  "AF-SAM": { en: "Samangan", prs: "سمنگان", ps: "سمنگان" },
  "AF-SAR": { en: "Sar-e Pol", prs: "سرپل", ps: "سر پل" },
  "AF-TAK": { en: "Takhar", prs: "تخار", ps: "تخار" },
  "AF-URU": { en: "Uruzgan", prs: "اروزگان", ps: "روزگان" },
  "AF-WAR": { en: "Wardak", prs: "وردک", ps: "وردګ" },
  "AF-ZAB": { en: "Zabul", prs: "زابل", ps: "زابل" },
};

function freezeProvince(code: ProvinceCode): Province {
  return Object.freeze({
    code,
    names: Object.freeze({ ...PROVINCE_NAMES[code] }),
  });
}

/** Immutable registry of all 34 provinces, ordered by ISO code. */
export const PROVINCES: readonly Province[] = Object.freeze(PROVINCE_CODES.map(freezeProvince));

const PROVINCE_BY_CODE: Readonly<Record<ProvinceCode, Province>> = Object.freeze(
  Object.fromEntries(PROVINCES.map((province) => [province.code, province])) as Record<
    ProvinceCode,
    Province
  >,
);

/**
 * Returns the full province registry.
 *
 * The returned array is immutable and shared between calls, so it is safe to use
 * directly in render.
 */
export function getProvinces(): readonly Province[] {
  return PROVINCES;
}

/** Looks up a province by canonical ISO code. */
export function getProvinceByCode(code: ProvinceCode): Province {
  return PROVINCE_BY_CODE[code];
}

/**
 * Returns a localized province name.
 *
 * Unknown runtime values fall back to the English name and finally to the input
 * code, which keeps JavaScript consumers safe without weakening the TypeScript
 * contract.
 */
export function getProvinceName(code: ProvinceCode, locale: Locale = DEFAULT_LOCALE): string {
  const province = PROVINCE_BY_CODE[code];
  if (!province) return String(code);
  return province.names[locale] ?? province.names.en;
}

/** Narrows an arbitrary string to a canonical province code. */
export function isProvinceCode(value: string): value is ProvinceCode {
  return Object.prototype.hasOwnProperty.call(PROVINCE_BY_CODE, value);
}

/** Resolved text direction for a locale. */
export function getLocaleDirection(locale: Locale): "ltr" | "rtl" {
  return locale === "prs" || locale === "ps" ? "rtl" : "ltr";
}

/** BCP 47 locale used for `Intl` number formatting. */
export const INTL_LOCALES: Readonly<Record<Locale, string>> = Object.freeze({
  en: "en-US",
  prs: "fa-AF",
  ps: "ps-AF",
});
