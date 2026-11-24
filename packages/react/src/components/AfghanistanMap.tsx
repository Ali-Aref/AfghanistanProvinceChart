import { useCallback } from "react";
import type { SyntheticEvent } from "react";
import { getProvinceByCode } from "../data/provinces.js";
import { UI_STRINGS } from "../data/strings.js";
import { useProvinceSelection } from "../hooks/useProvinceSelection.js";
import type { AfghanistanMapProps, ProvinceCode } from "../types/index.js";
import { MapCanvas } from "./MapCanvas.js";

/**
 * Interactive, responsive SVG map of Afghanistan's 34 provinces.
 *
 * Supports controlled and uncontrolled selection, pointer, touch and keyboard
 * interaction, localized UI, custom tooltips and CSS-variable theming.
 */
export function AfghanistanMap({
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
}: AfghanistanMapProps) {
  const resolvedLocale = locale ?? "en";
  const strings = UI_STRINGS[resolvedLocale];
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

  return (
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
      width={width}
      height={height}
      className={className}
      style={style}
      choropleth={false}
    />
  );
}
