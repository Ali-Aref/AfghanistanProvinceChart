import "./styles/map.css";

export { AfghanistanChoropleth } from "./components/AfghanistanChoropleth.js";
export { AfghanistanMap } from "./components/AfghanistanMap.js";
export { MapLegend } from "./components/MapLegend.js";
export {
  DEFAULT_LOCALE,
  INTL_LOCALES,
  SUPPORTED_LOCALES,
  getLocaleDirection,
  getProvinceByCode,
  getProvinceName,
  getProvinces,
  isProvinceCode,
} from "./data/provinces.js";
export type {
  AfghanistanChoroplethProps,
  AfghanistanMapProps,
  ColorPalette,
  Direction,
  Locale,
  MapColors,
  MapLegendProps,
  Province,
  ProvinceCode,
  ProvinceInteraction,
  ProvinceNumericData,
  ProvinceTooltipContext,
  ValueFormatter,
} from "./types/index.js";
