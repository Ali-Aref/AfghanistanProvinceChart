import { INTL_LOCALES } from "../data/provinces.js";
import type { Locale, ValueFormatter } from "../types/index.js";

/** Default numeric formatter using the locale's conventional digits and separators. */
export function formatNumber(value: number, locale: Locale = "en"): string {
  if (!Number.isFinite(value)) return "—";
  const intlLocale = INTL_LOCALES[locale] ?? INTL_LOCALES.en;
  try {
    return new Intl.NumberFormat(intlLocale, { maximumFractionDigits: 2 }).format(value);
  } catch {
    return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(value);
  }
}

/** Creates a formatter callback, useful when a consumer wants locale-aware defaults. */
export function createValueFormatter(locale: Locale = "en"): ValueFormatter {
  return (value: number) => formatNumber(value, locale);
}

/** Returns `true` only for finite numeric values. `null`, `undefined` and `NaN` are missing. */
export function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}
