import { useCallback, useMemo } from "react";
import type { SyntheticEvent } from "react";
import { getProvinceByCode } from "../data/provinces.js";
import { UI_STRINGS } from "../data/strings.js";
import { useProvinceSelection } from "../hooks/useProvinceSelection.js";
import type {
  AfghanistanChoroplethProps,
  ProvinceCode,
  ValueFormatter,
} from "../types/index.js";
import { createColorScale } from "../utils/colorScale.js";
import { formatNumber, isFiniteNumber } from "../utils/formatting.js";
import { MapCanvas } from "./MapCanvas.js";
import { MapLegend } from "./MapLegend.js";

/**
 * Choropleth of Afghanistan's 34 provinces.
 *
 * Values are keyed by canonical ISO province code. Missing keys are rendered with
 * the missing-data color and are never coerced to zero.
 */
export function AfghanistanChoropleth({
  data,
  domain,
  palette,
  missingColor,
  formatValue,
  showLegend = false,
  legendTitle,
  locale,
  width,
  height,
  className,
  style,
  selectedProvince,
  defaultSelectedProvince,
  onProvinceClick,
  onSelectionChange,
  showTooltip = true,
  showProvinceLabels = false,
  colors,
  renderTooltip,
  ariaLabel,
  interactive = true,
}: AfghanistanChoroplethProps) {
  const resolvedLocale = locale ?? "en";
  const strings = UI_STRINGS[resolvedLocale];

  const scale = useMemo(
    () => createColorScale(data, { domain, palette, missingColor }),
    [data, domain, missingColor, palette],
  );

  const formatter = useMemo<ValueFormatter>(
    () => formatValue ?? ((value: number) => formatNumber(value, resolvedLocale)),
    [formatValue, resolvedLocale],
  );

  const { selectedProvince: currentSelection, setSelectedProvince } = useProvinceSelection({
    selectedProvince,
    defaultSelectedProvince,
    onSelectionChange,
  });

  const handleActivate = useCallback(
    (
      code: ProvinceCode,
      source: "pointer" | "keyboard",
      event: SyntheticEvent<SVGPathElement>,
    ) => {
      const province = getProvinceByCode(code);
      if (!province) return;
      onProvinceClick?.({ province, code, source, event });
      setSelectedProvince(currentSelection === code ? null : code);
    },
    [currentSelection, onProvinceClick, setSelectedProvince],
  );

  const fillFor = useCallback(
    (code: ProvinceCode) => scale.colorFor(data[code] ?? null),
    [data, scale],
  );

  const valueFor = useCallback(
    (code: ProvinceCode) => {
      const value = data[code];
      return isFiniteNumber(value) ? value : null;
    },
    [data],
  );

  return (
    <div
      className={["af-choropleth", className].filter(Boolean).join(" ")}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        ...style,
      }}
    >
      <MapCanvas
        locale={resolvedLocale}
        selectedProvince={currentSelection}
        onActivate={handleActivate}
        showTooltip={showTooltip}
        showProvinceLabels={showProvinceLabels}
        colors={colors}
        renderTooltip={renderTooltip}
        ariaLabel={ariaLabel ?? strings.mapLabel}
        interactive={interactive}
        width="100%"
        height={height}
        className={undefined}
        style={undefined}
        fillFor={fillFor}
        valueFor={valueFor}
        formatValue={formatter}
        choropleth
      />
      {showLegend ? (
        <MapLegend
          domain={scale.domain}
          palette={scale.palette}
          missingColor={scale.missingColor}
          hasMissingValues={scale.hasMissingValues}
          formatValue={formatter}
          locale={resolvedLocale}
          {...(legendTitle !== undefined ? { title: legendTitle } : {})}
        />
      ) : null}
    </div>
  );
}
