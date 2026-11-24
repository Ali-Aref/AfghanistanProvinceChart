import type { CSSProperties } from "react";
import type { MapColors } from "../types/index.js";

/** Default color tokens. The values mirror the CSS defaults in `styles/map.css`. */
export const DEFAULT_MAP_COLORS: Readonly<MapColors> = Object.freeze({
  fill: "#e8edf2",
  hoverFill: "#cfe0ee",
  selectedFill: "#0f766e",
  noData: "#eef1f5",
  disabledFill: "#f3f4f6",
  border: "#ffffff",
  outline: "#7c8ba1",
  borderWidth: 1,
  focus: "#0f766e",
  label: "#24313d",
  labelHalo: "#f8fafc",
  tooltipBackground: "#0f172a",
  tooltipText: "#f8fafc",
  tooltipBorder: "rgba(148, 163, 184, 0.35)",
});

type CssVariableStyle = CSSProperties & Record<`--${string}`, string>;

/**
 * Converts consumer color overrides into inline CSS custom properties.
 *
 * Only provided tokens are emitted, so the stylesheet defaults (including its
 * automatic dark-mode palette) remain in effect for everything else.
 */
export function mapColorsToCssVars(colors: Partial<MapColors> | undefined): CssVariableStyle {
  const style: CssVariableStyle = {};
  if (!colors) return style;

  if (colors.fill !== undefined) style["--af-map-fill"] = colors.fill;
  if (colors.hoverFill !== undefined) style["--af-map-hover-fill"] = colors.hoverFill;
  if (colors.selectedFill !== undefined) style["--af-map-selected-fill"] = colors.selectedFill;
  if (colors.noData !== undefined) style["--af-map-no-data"] = colors.noData;
  if (colors.disabledFill !== undefined) style["--af-map-disabled-fill"] = colors.disabledFill;
  if (colors.border !== undefined) style["--af-map-border"] = colors.border;
  if (colors.outline !== undefined) style["--af-map-outline"] = colors.outline;
  if (colors.borderWidth !== undefined)
    style["--af-map-border-width"] = `${colors.borderWidth}px`;
  if (colors.focus !== undefined) style["--af-map-focus"] = colors.focus;
  if (colors.label !== undefined) style["--af-map-label"] = colors.label;
  if (colors.labelHalo !== undefined) style["--af-map-label-halo"] = colors.labelHalo;
  if (colors.tooltipBackground !== undefined) {
    style["--af-map-tooltip-bg"] = colors.tooltipBackground;
  }
  if (colors.tooltipText !== undefined) style["--af-map-tooltip-text"] = colors.tooltipText;
  if (colors.tooltipBorder !== undefined)
    style["--af-map-tooltip-border"] = colors.tooltipBorder;

  return style;
}
