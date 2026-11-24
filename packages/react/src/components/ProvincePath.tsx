import { memo } from "react";
import type { FocusEvent, KeyboardEvent, MouseEvent, PointerEvent } from "react";
import type { ProvinceCode } from "../types/index.js";

export interface ProvincePathProps {
  code: ProvinceCode;
  d: string;
  fill: string;
  selected: boolean;
  hovered: boolean;
  choropleth: boolean;
  interactive: boolean;
  tabIndex: number | undefined;
  ariaLabel: string;
  onPointerEnter: (code: ProvinceCode, event: PointerEvent<SVGPathElement>) => void;
  onPointerMove: (code: ProvinceCode, event: PointerEvent<SVGPathElement>) => void;
  onPointerLeave: (event: PointerEvent<SVGPathElement>) => void;
  onClick: (code: ProvinceCode, event: MouseEvent<SVGPathElement>) => void;
  onFocus: (code: ProvinceCode, event: FocusEvent<SVGPathElement>) => void;
  onBlur: (event: FocusEvent<SVGPathElement>) => void;
  onKeyDown: (code: ProvinceCode, event: KeyboardEvent<SVGPathElement>) => void;
}

/**
 * A single interactive province shape. Memoised so that hovering one province
 * does not rerender the other 33 path elements. Handlers are passed with a
 * stable identity and receive the province code as their first argument.
 */
export const ProvincePath = memo(function ProvincePath({
  code,
  d,
  fill,
  selected,
  hovered,
  choropleth,
  interactive,
  tabIndex,
  ariaLabel,
  onPointerEnter,
  onPointerMove,
  onPointerLeave,
  onClick,
  onFocus,
  onBlur,
  onKeyDown,
}: ProvincePathProps) {
  const className = [
    "af-map__province",
    choropleth ? "af-map__province--choropleth" : "af-map__province--default",
    selected ? "is-selected" : "",
    hovered ? "is-hovered" : "",
    interactive ? "" : "is-disabled",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <path
      className={className}
      d={d}
      style={{ fill }}
      data-province-code={code}
      data-selected={selected ? "true" : "false"}
      data-hovered={hovered ? "true" : "false"}
      role={interactive ? "button" : "img"}
      tabIndex={interactive ? tabIndex : undefined}
      aria-label={ariaLabel}
      aria-pressed={interactive ? selected : undefined}
      fillRule="evenodd"
      vectorEffect="non-scaling-stroke"
      onPointerEnter={interactive ? (event) => onPointerEnter(code, event) : undefined}
      onPointerMove={interactive ? (event) => onPointerMove(code, event) : undefined}
      onPointerLeave={interactive ? onPointerLeave : undefined}
      onClick={interactive ? (event) => onClick(code, event) : undefined}
      onFocus={(event) => onFocus(code, event)}
      onBlur={onBlur}
      onKeyDown={interactive ? (event) => onKeyDown(code, event) : undefined}
    />
  );
});
