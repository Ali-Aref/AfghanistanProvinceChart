import { useCallback, useId, useMemo, useRef, useState } from "react";
import type {
  CSSProperties,
  FocusEvent,
  KeyboardEvent,
  MouseEvent,
  PointerEvent,
  ReactNode,
  SyntheticEvent,
} from "react";
import {
  AFGHANISTAN_VIEWBOX,
  COUNTRY_OUTLINE_PATH,
  PROVINCE_GEOMETRY,
} from "../data/geometry.js";
import {
  INTL_LOCALES,
  PROVINCE_CODES,
  getLocaleDirection,
  getProvinceByCode,
} from "../data/provinces.js";
import { UI_STRINGS } from "../data/strings.js";
import type {
  Locale,
  MapColors,
  ProvinceCode,
  ProvinceTooltipContext,
  ValueFormatter,
} from "../types/index.js";
import { mapColorsToCssVars } from "../utils/colors.js";
import { formatNumber, isFiniteNumber } from "../utils/formatting.js";
import { ProvincePath } from "./ProvincePath.js";
import { ProvinceTooltip } from "./ProvinceTooltip.js";

export interface MapCanvasProps {
  locale: Locale;
  selectedProvince: ProvinceCode | null;
  onActivate: (
    code: ProvinceCode,
    source: "pointer" | "keyboard",
    event: SyntheticEvent<SVGPathElement>,
  ) => void;
  showTooltip: boolean;
  showProvinceLabels: boolean;
  colors?: Partial<MapColors> | undefined;
  renderTooltip?: ((context: ProvinceTooltipContext) => ReactNode) | undefined;
  ariaLabel: string;
  interactive: boolean;
  width?: number | string | undefined;
  height?: number | string | undefined;
  className?: string | undefined;
  style?: CSSProperties | undefined;
  /** When supplied, provinces are colored from this function instead of base map tokens. */
  fillFor?: ((code: ProvinceCode) => string) | undefined;
  valueFor?: ((code: ProvinceCode) => number | null) | undefined;
  formatValue?: ValueFormatter | undefined;
  choropleth: boolean;
}

interface PointerPosition {
  x: number;
  y: number;
  align: "start" | "center" | "end";
}

const VIEWBOX = AFGHANISTAN_VIEWBOX;
const MAP_CODES = PROVINCE_CODES;
const FIRST_CODE = MAP_CODES[0] as ProvinceCode;
const LAST_CODE = MAP_CODES[MAP_CODES.length - 1] as ProvinceCode;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function nextIndex(code: ProvinceCode, direction: 1 | -1): ProvinceCode {
  const index = MAP_CODES.indexOf(code);
  const next = MAP_CODES[(index + direction + MAP_CODES.length) % MAP_CODES.length];
  return next ?? FIRST_CODE;
}

/**
 * Shared SVG rendering and interaction engine for the map and choropleth.
 *
 * Keeping this internal means both public components have identical keyboard,
 * touch, tooltip, focus and accessibility behavior.
 */
export function MapCanvas({
  locale,
  selectedProvince,
  onActivate,
  showTooltip,
  showProvinceLabels,
  colors,
  renderTooltip,
  ariaLabel,
  interactive,
  width,
  height,
  className,
  style,
  fillFor,
  valueFor,
  formatValue,
  choropleth,
}: MapCanvasProps) {
  const [hoveredCode, setHoveredCode] = useState<ProvinceCode | null>(null);
  const [focusedCode, setFocusedCode] = useState<ProvinceCode | null>(null);
  const [activeCode, setActiveCode] = useState<ProvinceCode>(selectedProvince ?? FIRST_CODE);
  const [pointer, setPointer] = useState<PointerPosition | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipId = useId();
  const instructionsId = useId();

  const strings = UI_STRINGS[locale];
  const direction = getLocaleDirection(locale);

  const resolvedFormatter = useMemo<ValueFormatter>(
    () => formatValue ?? ((value: number) => formatNumber(value, locale)),
    [formatValue, locale],
  );

  const tooltipCode = hoveredCode ?? focusedCode;
  const tooltipProvince = tooltipCode ? getProvinceByCode(tooltipCode) : null;
  const tooltipValue = tooltipCode && valueFor ? valueFor(tooltipCode) : null;
  const numericValue = isFiniteNumber(tooltipValue) ? tooltipValue : null;
  const formattedValue = numericValue === null ? null : resolvedFormatter(numericValue);

  const tooltipContext = useMemo<ProvinceTooltipContext | null>(() => {
    if (!tooltipProvince) return null;
    return {
      province: tooltipProvince,
      locale,
      value: numericValue,
      formattedValue,
      direction,
    };
  }, [direction, formattedValue, locale, numericValue, tooltipProvince]);

  const updatePointer = useCallback((event: PointerEvent<SVGPathElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0 || rect.height === 0) {
      setPointer(null);
      return;
    }
    setPointer({
      x: clamp(event.clientX - rect.left, 14, rect.width - 14),
      y: clamp(event.clientY - rect.top, 14, rect.height - 14),
      align:
        event.clientX - rect.left < 140
          ? "start"
          : event.clientX - rect.left > rect.width - 140
            ? "end"
            : "center",
    });
  }, []);

  const handlePointerEnter = useCallback(
    (code: ProvinceCode, event: PointerEvent<SVGPathElement>) => {
      setHoveredCode(code);
      updatePointer(event);
    },
    [updatePointer],
  );

  const handlePointerMove = useCallback(
    (code: ProvinceCode, event: PointerEvent<SVGPathElement>) => {
      setHoveredCode(code);
      updatePointer(event);
    },
    [updatePointer],
  );

  const handlePointerLeave = useCallback(() => {
    setHoveredCode(null);
    setPointer(null);
  }, []);

  const handleClick = useCallback(
    (code: ProvinceCode, event: MouseEvent<SVGPathElement>) => {
      setActiveCode(code);
      onActivate(code, "pointer", event);
    },
    [onActivate],
  );

  const handleFocus = useCallback((code: ProvinceCode, _event: FocusEvent<SVGPathElement>) => {
    setFocusedCode(code);
    setActiveCode(code);
    setPointer(null);
  }, []);

  const handleBlur = useCallback((_event: FocusEvent<SVGPathElement>) => {
    setFocusedCode(null);
  }, []);

  const moveFocus = useCallback((code: ProvinceCode, key: string) => {
    const current = PROVINCE_GEOMETRY[code].label;
    let target: ProvinceCode | null = null;

    if (key === "Home") target = FIRST_CODE;
    else if (key === "End") target = LAST_CODE;
    else {
      const horizontal = key === "ArrowLeft" || key === "ArrowRight";
      const positive = key === "ArrowRight" || key === "ArrowDown";
      let bestScore = Number.POSITIVE_INFINITY;

      for (const candidate of MAP_CODES) {
        if (candidate === code) continue;
        const point = PROVINCE_GEOMETRY[candidate].label;
        const dx = point.x - current.x;
        const dy = point.y - current.y;
        const primary = horizontal ? dx : dy;
        const secondary = horizontal ? dy : dx;
        if (positive ? primary <= 4 : primary >= -4) continue;
        const score = Math.abs(primary) + Math.abs(secondary) * 2.5;
        if (score < bestScore) {
          bestScore = score;
          target = candidate;
        }
      }

      if (!target) target = nextIndex(code, positive ? 1 : -1);
    }

    if (!target) return;
    setActiveCode(target);
    setPointer(null);
    const node = containerRef.current?.querySelector<SVGPathElement>(
      `[data-province-code="${target}"]`,
    );
    if (node && typeof node.focus === "function") node.focus();
  }, []);

  const handleKeyDown = useCallback(
    (code: ProvinceCode, event: KeyboardEvent<SVGPathElement>) => {
      if (event.key === "Enter" || event.key === " " || event.key === "Spacebar") {
        event.preventDefault();
        onActivate(code, "keyboard", event);
        return;
      }

      if (
        event.key === "ArrowLeft" ||
        event.key === "ArrowRight" ||
        event.key === "ArrowUp" ||
        event.key === "ArrowDown" ||
        event.key === "Home" ||
        event.key === "End"
      ) {
        event.preventDefault();
        moveFocus(code, event.key);
      }
    },
    [moveFocus, onActivate],
  );

  const tooltipStyle = useMemo<CSSProperties | null>(() => {
    if (!tooltipCode) return null;
    if (pointer) return { left: pointer.x, top: pointer.y };
    const point = PROVINCE_GEOMETRY[tooltipCode].label;
    return {
      left: `${(point.x / VIEWBOX.width) * 100}%`,
      top: `${(point.y / VIEWBOX.height) * 100}%`,
    };
  }, [pointer, tooltipCode]);

  const tooltipPlacement: "above" | "below" = pointer
    ? pointer.y < 110
      ? "below"
      : "above"
    : tooltipCode && PROVINCE_GEOMETRY[tooltipCode].label.y / VIEWBOX.height < 0.2
      ? "below"
      : "above";

  const tooltipAlign: "start" | "center" | "end" = pointer
    ? pointer.align
    : tooltipCode && PROVINCE_GEOMETRY[tooltipCode].label.x / VIEWBOX.width < 0.15
      ? "start"
      : tooltipCode && PROVINCE_GEOMETRY[tooltipCode].label.x / VIEWBOX.width > 0.85
        ? "end"
        : "center";

  const announcement = useMemo(() => {
    if (!focusedCode) return "";
    const province = getProvinceByCode(focusedCode);
    if (!province) return "";
    const parts = [province.names[locale]];
    if (selectedProvince === focusedCode) parts.push(strings.selected);
    if (choropleth) {
      const value = valueFor?.(focusedCode) ?? null;
      const numeric = isFiniteNumber(value) ? value : null;
      parts.push(
        `${strings.value}: ${numeric === null ? strings.noData : resolvedFormatter(numeric)}`,
      );
    }
    return parts.join(", ");
  }, [choropleth, focusedCode, locale, resolvedFormatter, selectedProvince, strings, valueFor]);

  const containerStyle: CSSProperties = {
    ...mapColorsToCssVars(colors),
    width: typeof width === "number" ? `${width}px` : (width ?? "100%"),
    ...(height !== undefined
      ? { height: typeof height === "number" ? `${height}px` : height }
      : {}),
    ...style,
  };

  const svgStyle: CSSProperties = {
    width: "100%",
    height: height !== undefined ? "100%" : "auto",
  };

  const fillForCode = (code: ProvinceCode): string => {
    if (choropleth) return fillFor ? fillFor(code) : "var(--af-map-no-data)";
    if (!interactive) return "var(--af-map-disabled-fill)";
    if (selectedProvince === code) return "var(--af-map-selected-fill)";
    if (hoveredCode === code) return "var(--af-map-hover-fill)";
    return "var(--af-map-fill)";
  };

  const ariaLabelFor = (code: ProvinceCode): string => {
    const province = getProvinceByCode(code);
    if (!province) return code;
    const parts = [province.names[locale]];
    if (selectedProvince === code) parts.push(strings.selected);
    if (choropleth) {
      const value = valueFor?.(code) ?? null;
      const numeric = isFiniteNumber(value) ? value : null;
      parts.push(
        `${strings.value}: ${numeric === null ? strings.noData : resolvedFormatter(numeric)}`,
      );
    }
    return parts.join(", ");
  };

  return (
    <div
      ref={containerRef}
      className={["af-map", className].filter(Boolean).join(" ")}
      style={containerStyle}
      data-af-choropleth={choropleth ? "true" : "false"}
      data-af-locale={locale}
      lang={INTL_LOCALES[locale]}
    >
      <svg
        className="af-map__svg"
        viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
        preserveAspectRatio="xMidYMid meet"
        role="group"
        aria-label={ariaLabel}
        aria-describedby={interactive ? instructionsId : undefined}
        style={svgStyle}
      >
        <desc id={instructionsId}>{strings.instructions}</desc>
        {MAP_CODES.map((code) => {
          const geometry = PROVINCE_GEOMETRY[code];
          return (
            <ProvincePath
              key={code}
              code={code}
              d={geometry.d}
              fill={fillForCode(code)}
              selected={selectedProvince === code}
              hovered={hoveredCode === code}
              choropleth={choropleth}
              interactive={interactive}
              tabIndex={code === activeCode ? 0 : -1}
              ariaLabel={ariaLabelFor(code)}
              onPointerEnter={handlePointerEnter}
              onPointerMove={handlePointerMove}
              onPointerLeave={handlePointerLeave}
              onClick={handleClick}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
            />
          );
        })}
        <path
          className="af-map__outline"
          d={COUNTRY_OUTLINE_PATH}
          aria-hidden="true"
          vectorEffect="non-scaling-stroke"
        />
        {showProvinceLabels ? (
          <g className="af-map__labels" aria-hidden="true">
            {MAP_CODES.map((code) => {
              const geometry = PROVINCE_GEOMETRY[code];
              const province = getProvinceByCode(code);
              if (!province) return null;
              const small = geometry.bounds.width < 46 || geometry.bounds.height < 46;
              return (
                <text
                  key={code}
                  className={small ? "af-map__label af-map__label--small" : "af-map__label"}
                  x={geometry.label.x}
                  y={geometry.label.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  direction={direction}
                >
                  {province.names[locale]}
                </text>
              );
            })}
          </g>
        ) : null}
      </svg>

      {interactive ? (
        <div className="af-map__sr-only" dir={direction} aria-live="polite" aria-atomic="true">
          {announcement}
        </div>
      ) : null}

      {showTooltip && tooltipCode && tooltipContext && tooltipStyle ? (
        <ProvinceTooltip
          id={tooltipId}
          context={tooltipContext}
          showValue={choropleth}
          position={tooltipStyle}
          placement={tooltipPlacement}
          align={tooltipAlign}
          renderTooltip={renderTooltip}
        />
      ) : null}
    </div>
  );
}
