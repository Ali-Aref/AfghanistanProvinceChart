import { UI_STRINGS } from "../data/strings.js";
import { INTL_LOCALES, getLocaleDirection } from "../data/provinces.js";
import type { MapLegendProps } from "../types/index.js";
import { createColorScale } from "../utils/colorScale.js";
import { formatNumber } from "../utils/formatting.js";

/** Accessible continuous color legend for {@link AfghanistanChoropleth}. */
export function MapLegend({
  domain,
  palette,
  missingColor,
  hasMissingValues = false,
  formatValue,
  locale = "en",
  title,
  className,
  style,
}: MapLegendProps) {
  const direction = getLocaleDirection(locale);
  const strings = UI_STRINGS[locale];
  const scale = createColorScale({}, { domain, palette, missingColor });
  const format = formatValue ?? ((value: number) => formatNumber(value, locale));
  const [min, max] = scale.domain;
  const titleText = title ?? strings.legendTitle;
  const gradient =
    direction === "rtl"
      ? `linear-gradient(to left, ${scale.palette[0]}, ${scale.palette[1]})`
      : `linear-gradient(to right, ${scale.palette[0]}, ${scale.palette[1]})`;

  return (
    <div
      className={["af-legend", className].filter(Boolean).join(" ")}
      dir={direction}
      lang={INTL_LOCALES[locale]}
      role="group"
      aria-label={`${titleText}: ${format(min)} – ${format(max)}`}
      style={style}
    >
      <span className="af-legend__title">{titleText}</span>
      <div className="af-legend__scale">
        <span className="af-legend__endpoint">
          <span className="af-legend__sr-only">{strings.min}: </span>
          {format(min)}
        </span>
        <span
          className="af-legend__gradient"
          style={{ background: gradient }}
          aria-hidden="true"
        />
        <span className="af-legend__endpoint">
          <span className="af-legend__sr-only">{strings.max}: </span>
          {format(max)}
        </span>
      </div>
      {hasMissingValues ? (
        <span className="af-legend__missing">
          <span
            className="af-legend__swatch"
            style={{ background: scale.missingColor }}
            aria-hidden="true"
          />
          {strings.noData}
        </span>
      ) : null}
    </div>
  );
}
