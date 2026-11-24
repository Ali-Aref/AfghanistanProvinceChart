import type { CSSProperties, ReactNode, SyntheticEvent } from "react";

/** Supported interface locales. `prs` is Dari, `ps` is Pashto. */
export type Locale = "en" | "prs" | "ps";

/** Text direction for localized interface chrome. Map geometry is never mirrored. */
export type Direction = "ltr" | "rtl";

/**
 * Canonical ISO 3166-2 codes for the 34 first-level administrative divisions
 * (provinces) of Afghanistan.
 */
export type ProvinceCode =
  | "AF-BAL"
  | "AF-BAM"
  | "AF-BDG"
  | "AF-BDS"
  | "AF-BGL"
  | "AF-DAY"
  | "AF-FRA"
  | "AF-FYB"
  | "AF-GHA"
  | "AF-GHO"
  | "AF-HEL"
  | "AF-HER"
  | "AF-JOW"
  | "AF-KAB"
  | "AF-KAN"
  | "AF-KAP"
  | "AF-KDZ"
  | "AF-KHO"
  | "AF-KNR"
  | "AF-LAG"
  | "AF-LOG"
  | "AF-NAN"
  | "AF-NIM"
  | "AF-NUR"
  | "AF-PAN"
  | "AF-PAR"
  | "AF-PIA"
  | "AF-PKA"
  | "AF-SAM"
  | "AF-SAR"
  | "AF-TAK"
  | "AF-URU"
  | "AF-WAR"
  | "AF-ZAB";

/** Localized province metadata. */
export interface Province {
  readonly code: ProvinceCode;
  readonly names: {
    /** English (Latin script). */
    readonly en: string;
    /** Dari (Persian/Arabic script). */
    readonly prs: string;
    /** Pashto (Persian/Arabic script). */
    readonly ps: string;
  };
}

/** Numeric values keyed by canonical province code. Missing keys are treated as missing data, not zero. */
export type ProvinceNumericData = Partial<Record<ProvinceCode, number | null>>;

/** Map color tokens. Every token is exposed as a CSS custom property as well. */
export interface MapColors {
  /** Default province fill. */
  fill: string;
  /** Fill used while a province is hovered. */
  hoverFill: string;
  /** Fill used for the selected province. */
  selectedFill: string;
  /** Fill used for provinces without data in a choropleth. */
  noData: string;
  /** Fill used when the map is non-interactive. */
  disabledFill: string;
  /** Province and country border color. */
  border: string;
  /** Country outline color. */
  outline: string;
  /** Border width in CSS pixels. Borders use non-scaling strokes. */
  borderWidth: number;
  /** Focus ring color. */
  focus: string;
  /** Province label color. */
  label: string;
  /** Halo behind province labels. */
  labelHalo: string;
  /** Tooltip background. */
  tooltipBackground: string;
  /** Tooltip text color. */
  tooltipText: string;
  /** Tooltip border color. */
  tooltipBorder: string;
}

/** A two-stop continuous palette. Colors must be valid CSS hex colors. */
export type ColorPalette = readonly [string, string];

/** Payload passed to {@link AfghanistanMapProps.onProvinceClick}. */
export interface ProvinceInteraction {
  /** Canonical province metadata. */
  readonly province: Province;
  /** Canonical ISO code, repeated for convenience. */
  readonly code: ProvinceCode;
  /** How the interaction was triggered. */
  readonly source: "pointer" | "keyboard";
  /** Underlying React event. */
  readonly event: SyntheticEvent<SVGPathElement>;
}

/** Context passed to a custom tooltip renderer. */
export interface ProvinceTooltipContext {
  readonly province: Province;
  readonly locale: Locale;
  /** Numeric value for choropleths, or `null` for a plain map / missing value. */
  readonly value: number | null;
  /** Value pre-formatted with the active formatter, or `null` when no value exists. */
  readonly formattedValue: string | null;
  /** Resolved text direction for interface chrome. */
  readonly direction: Direction;
}

/** Formats a numeric metric for tooltips, legends and accessible descriptions. */
export type ValueFormatter = (value: number) => string;

/** Props for {@link AfghanistanMap}. */
export interface AfghanistanMapProps {
  /** Interface language. Defaults to `"en"`. */
  locale?: Locale;

  /** Rendered width. Defaults to `100%`. */
  width?: number | string;

  /** Rendered height. Defaults to the map's intrinsic aspect ratio. */
  height?: number | string;

  className?: string;
  style?: CSSProperties;

  /** Controlled selected province. Pass `null` to clear the selection. */
  selectedProvince?: ProvinceCode | null;

  /** Initially selected province when uncontrolled. */
  defaultSelectedProvince?: ProvinceCode | null;

  /** Called whenever a province is activated with a pointer or keyboard. */
  onProvinceClick?: (interaction: ProvinceInteraction) => void;

  /** Called when the selection changes, including deselection (`null`). */
  onSelectionChange?: (code: ProvinceCode | null) => void;

  /** Show the built-in tooltip. Defaults to `true`. */
  showTooltip?: boolean;

  /** Render province names inside the map. Defaults to `false`. */
  showProvinceLabels?: boolean;

  /** Override individual color tokens. */
  colors?: Partial<MapColors>;

  /** Replace the built-in tooltip content. Do not return untrusted HTML. */
  renderTooltip?: (context: ProvinceTooltipContext) => ReactNode;

  /** Accessible name for the map. A localized default is used when omitted. */
  ariaLabel?: string;

  /**
   * Whether provinces can be focused and activated. When false the map is still
   * announced accessibly but renders in a muted, non-interactive state.
   * Defaults to `true`.
   */
  interactive?: boolean;
}

/** Props for {@link AfghanistanChoropleth}. */
export interface AfghanistanChoroplethProps extends AfghanistanMapProps {
  /** Numeric values keyed by ISO province code. Partial datasets are supported. */
  data: ProvinceNumericData;

  /** Fixed numeric domain. When omitted, the domain is derived from `data`. */
  domain?: readonly [number, number];

  /** Two-stop palette. Defaults to a restrained teal scale. */
  palette?: ColorPalette;

  /** Fill for missing or invalid values. Defaults to the scoped `--af-map-no-data` token. */
  missingColor?: string;

  /** Formatter for tooltip and legend values. Defaults to locale-aware number formatting. */
  formatValue?: ValueFormatter;

  /** Show the color legend below the map. Defaults to `false`. */
  showLegend?: boolean;

  /** Explicit legend title. A localized default is used when omitted. */
  legendTitle?: string;
}

/** Props for {@link MapLegend}. */
export interface MapLegendProps {
  /** Numeric domain used to build the gradient. */
  domain: readonly [number, number];
  /** Two-stop palette matching the rendered map. */
  palette: ColorPalette;
  /** Fill used for provinces without data. */
  missingColor?: string;
  /** Show a swatch explaining the missing-data color. */
  hasMissingValues?: boolean;
  /** Formatter for the minimum and maximum labels. */
  formatValue?: ValueFormatter;
  /** Interface locale, used for labels and direction. */
  locale?: Locale;
  /** Legend title. */
  title?: string;
  className?: string;
  style?: CSSProperties;
}

export interface ColorScale {
  readonly domain: readonly [number, number];
  /** Validated palette actually used by the scale. */
  readonly palette: ColorPalette;
  /** Validated missing-data color actually used by the scale. */
  readonly missingColor: string;
  readonly hasData: boolean;
  readonly hasMissingValues: boolean;
  /** Resolves a value to an `rgb(...)` color. Missing or invalid values use the missing color. */
  colorFor: (value: number | null | undefined) => string;
}
