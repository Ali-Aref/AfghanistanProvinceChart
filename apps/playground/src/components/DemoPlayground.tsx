import { useMemo, useState } from "react";
import {
  AfghanistanChoropleth,
  AfghanistanMap,
  INTL_LOCALES,
  getLocaleDirection,
  getProvinceByCode,
  type Locale,
  type ProvinceCode,
} from "afghanistan-province-chart";
import { CodeBlock } from "./CodeBlock.js";
import { SAMPLE_DATA } from "../examples/sampleData.js";
import { SHOWCASE_MESSAGES } from "../i18n.js";

type Theme = "light" | "dark";
type Mode = "map" | "choropleth";

interface Palette {
  fill: string;
  hoverFill: string;
  selectedFill: string;
}

const PALETTES: Record<Theme, Palette> = {
  light: { fill: "#e8edf2", hoverFill: "#cfe0ee", selectedFill: "#0f766e" },
  dark: { fill: "#243244", hoverFill: "#33475d", selectedFill: "#2dd4bf" },
};

interface DemoPlaygroundProps {
  theme: Theme;
  siteLocale: Locale;
  metricLabel: string;
}

function buildCode(
  mode: Mode,
  locale: Locale,
  palette: Palette,
  showTooltip: boolean,
  showLabels: boolean,
): string {
  const common = [
    `      locale="${locale}"`,
    `      selectedProvince={selected}`,
    `      onSelectionChange={setSelected}`,
    showTooltip ? "      showTooltip" : "      showTooltip={false}",
    `      showProvinceLabels={${showLabels}}`,
  ].join("\n");

  if (mode === "choropleth") {
    return `import { useState } from "react";
import {
  AfghanistanChoropleth,
  type ProvinceCode,
} from "afghanistan-province-chart";
import "afghanistan-province-chart/styles.css";

const data = {
  "AF-KAB": 96,
  "AF-HER": 72,
  "AF-BAL": 68,
  "AF-KAN": 64,
  "AF-NAN": 61,
};

export default function Report() {
  const [selected, setSelected] = useState<ProvinceCode | null>("AF-KAB");

  return (
    <AfghanistanChoropleth
      data={data}
${common}
      showLegend
    />
  );
}`;
  }

  return `import { useState } from "react";
import {
  AfghanistanMap,
  type ProvinceCode,
} from "afghanistan-province-chart";
import "afghanistan-province-chart/styles.css";

export default function MapCard() {
  const [selected, setSelected] = useState<ProvinceCode | null>("AF-KAB");

  return (
    <AfghanistanMap
${common}
      colors={{
        fill: "${palette.fill}",
        hoverFill: "${palette.hoverFill}",
        selectedFill: "${palette.selectedFill}",
      }}
    />
  );
}`;
}

export function DemoPlayground({ theme, siteLocale, metricLabel }: DemoPlaygroundProps) {
  const [mapLocaleOverride, setMapLocaleOverride] = useState<Locale | null>(null);
  const locale = mapLocaleOverride ?? siteLocale;
  const t = SHOWCASE_MESSAGES[siteLocale].demo;
  const [mode, setMode] = useState<Mode>("map");
  const [selected, setSelected] = useState<ProvinceCode | null>("AF-KAB");
  const [showTooltip, setShowTooltip] = useState(true);
  const [showLabels, setShowLabels] = useState(false);
  const [customPalette, setCustomPalette] = useState<Palette | null>(null);
  const palette = customPalette ?? PALETTES[theme];

  const province = selected ? getProvinceByCode(selected) : null;
  const direction = getLocaleDirection(locale);
  const rawValue = selected ? SAMPLE_DATA[selected] : undefined;
  const hasValue = typeof rawValue === "number" && Number.isFinite(rawValue);
  const code = useMemo(
    () => buildCode(mode, locale, palette, showTooltip, showLabels),
    [locale, mode, palette, showLabels, showTooltip],
  );

  const reset = () => {
    setMapLocaleOverride(null);
    setMode("map");
    setSelected("AF-KAB");
    setShowTooltip(true);
    setShowLabels(false);
    setCustomPalette(null);
  };

  return (
    <div className="pg-demo">
      <div className="pg-demo-grid">
        <aside className="pg-controls" aria-label={t.configuration}>
          <div className="pg-controls-head">
            <span className="pg-eyebrow">{t.configuration}</span>
            <button className="pg-text-button" type="button" onClick={reset}>
              {t.reset}
            </button>
          </div>

          <fieldset className="pg-field">
            <legend>{t.display}</legend>
            <div className="pg-segmented" role="group" aria-label={t.displayMode}>
              <button
                type="button"
                aria-pressed={mode === "map"}
                onClick={() => setMode("map")}
              >
                {t.map}
              </button>
              <button
                type="button"
                aria-pressed={mode === "choropleth"}
                onClick={() => setMode("choropleth")}
              >
                {t.choropleth}
              </button>
            </div>
          </fieldset>

          <label className="pg-field">
            <span>{t.language}</span>
            <span className="pg-select-shell">
              <select
                value={locale}
                onChange={(event) => setMapLocaleOverride(event.target.value as Locale)}
              >
                <option value="en" lang="en">
                  English
                </option>
                <option value="prs" lang="fa-AF">
                  دری
                </option>
                <option value="ps" lang="ps-AF">
                  پښتو
                </option>
              </select>
            </span>
          </label>

          <fieldset className="pg-field">
            <legend>{t.mapColors}</legend>
            <p className="pg-field-note">
              {mode === "choropleth" ? t.choroplethColors : t.liveColors}
            </p>
            <div className="pg-color-grid">
              <label>
                <span>{t.base}</span>
                <input
                  type="color"
                  value={palette.fill}
                  disabled={mode === "choropleth"}
                  aria-label={t.baseColor}
                  onChange={(event) =>
                    setCustomPalette({ ...palette, fill: event.target.value })
                  }
                />
                <code dir="ltr">{palette.fill}</code>
              </label>
              <label>
                <span>{t.hover}</span>
                <input
                  type="color"
                  value={palette.hoverFill}
                  disabled={mode === "choropleth"}
                  aria-label={t.hoverColor}
                  onChange={(event) =>
                    setCustomPalette({
                      ...palette,
                      hoverFill: event.target.value,
                    })
                  }
                />
                <code dir="ltr">{palette.hoverFill}</code>
              </label>
              <label>
                <span>{t.selected}</span>
                <input
                  type="color"
                  value={palette.selectedFill}
                  disabled={mode === "choropleth"}
                  aria-label={t.selectedColor}
                  onChange={(event) =>
                    setCustomPalette({
                      ...palette,
                      selectedFill: event.target.value,
                    })
                  }
                />
                <code dir="ltr">{palette.selectedFill}</code>
              </label>
            </div>
          </fieldset>

          <fieldset className="pg-field">
            <legend>{t.options}</legend>
            <label className="pg-switch">
              <input
                type="checkbox"
                checked={showTooltip}
                onChange={(event) => setShowTooltip(event.target.checked)}
              />
              <span>{t.showTooltips}</span>
            </label>
            <label className="pg-switch">
              <input
                type="checkbox"
                checked={showLabels}
                onChange={(event) => setShowLabels(event.target.checked)}
              />
              <span>{t.showLabels}</span>
            </label>
          </fieldset>
        </aside>

        <div className="pg-demo-mapcard">
          <div className="pg-demo-maphead">
            <div>
              <span className="pg-eyebrow">{t.livePreview}</span>
              <h3>{mode === "map" ? t.interactiveMap : t.provinceChoropleth}</h3>
            </div>
            <span className="pg-chip" dir="ltr">
              {locale.toUpperCase()}
            </span>
          </div>

          <div className="pg-demo-mapstage">
            {mode === "map" ? (
              <AfghanistanMap
                locale={locale}
                selectedProvince={selected}
                onSelectionChange={setSelected}
                showTooltip={showTooltip}
                showProvinceLabels={showLabels}
                colors={palette}
              />
            ) : (
              <AfghanistanChoropleth
                data={SAMPLE_DATA}
                locale={locale}
                selectedProvince={selected}
                onSelectionChange={setSelected}
                showTooltip={showTooltip}
                showProvinceLabels={showLabels}
                showLegend
                legendTitle={
                  mapLocaleOverride ? SHOWCASE_MESSAGES[locale].site.metric : metricLabel
                }
              />
            )}
          </div>

          <div className="pg-demo-selection" dir={direction}>
            {province ? (
              <>
                <div>
                  <span className="pg-eyebrow">{t.selectedProvince}</span>
                  <strong className="pg-demo-province">{province.names[locale]}</strong>
                  <code className="pg-chip" dir="ltr">
                    {province.code}
                  </code>
                </div>
                <div className="pg-demo-value">
                  {mode === "choropleth" ? (
                    <>
                      <span className="pg-eyebrow">{t.sampleValue}</span>
                      <strong>
                        {hasValue
                          ? new Intl.NumberFormat(INTL_LOCALES[locale]).format(rawValue)
                          : SHOWCASE_MESSAGES[locale].demo.noData}
                      </strong>
                    </>
                  ) : (
                    <span className="pg-demo-hint">{t.selectHint}</span>
                  )}
                </div>
              </>
            ) : (
              <span className="pg-demo-hint">{t.noneSelected}</span>
            )}
          </div>
        </div>
      </div>

      <div className="pg-demo-code">
        <div className="pg-code-intro">
          <span className="pg-eyebrow">{t.sourcePreview}</span>
          <p>{t.sourceDescription}</p>
        </div>
        <CodeBlock code={code} locale={siteLocale} />
      </div>
    </div>
  );
}
