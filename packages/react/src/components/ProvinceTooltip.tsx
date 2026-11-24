import type { CSSProperties, ReactNode } from "react";
import { INTL_LOCALES } from "../data/provinces.js";
import { UI_STRINGS } from "../data/strings.js";
import type { ProvinceTooltipContext } from "../types/index.js";

export interface ProvinceTooltipProps {
  id: string;
  context: ProvinceTooltipContext;
  showValue: boolean;
  position: CSSProperties;
  placement: "above" | "below";
  align: "start" | "center" | "end";
  renderTooltip?: ((context: ProvinceTooltipContext) => ReactNode) | undefined;
}

/** Built-in, non-HTML tooltip. Custom content is rendered as React nodes only. */
export function ProvinceTooltip({
  id,
  context,
  showValue,
  position,
  placement,
  align,
  renderTooltip,
}: ProvinceTooltipProps) {
  const { province, locale, formattedValue, direction } = context;
  const strings = UI_STRINGS[locale];
  const custom = renderTooltip?.(context);

  return (
    <div
      id={id}
      role="tooltip"
      className="af-map__tooltip"
      data-placement={placement}
      data-align={align}
      dir={direction}
      lang={INTL_LOCALES[locale]}
      style={position}
    >
      {custom ?? (
        <>
          <span className="af-map__tooltip-name">{province.names[locale]}</span>
          {showValue ? (
            <span className="af-map__tooltip-value">
              {formattedValue ?? (
                <span className="af-map__tooltip-empty">{strings.noData}</span>
              )}
            </span>
          ) : null}
        </>
      )}
    </div>
  );
}
