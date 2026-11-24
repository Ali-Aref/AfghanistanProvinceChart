import { useMemo, useState } from "react";
import {
  AfghanistanChoropleth,
  AfghanistanMap,
  getLocaleDirection,
  getProvinceByCode,
  type Locale,
  type ProvinceCode,
} from "@afghan-province-charts/react";
import { CodeBlock } from "./CodeBlock.js";
import { SAMPLE_DATA, SAMPLE_METRIC_LABEL } from "../examples/sampleData.js";

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
} from "@afghan-province-charts/react";
import "@afghan-province-charts/react/styles.css";

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
} from "@afghan-province-charts/react";
import "@afghan-province-charts/react/styles.css";

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

export function DemoPlayground({ theme }: DemoPlaygroundProps) {
  const [locale, setLocale] = useState<Locale>("en");
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
    setLocale("en");
    setMode("map");
    setSelected("AF-KAB");
    setShowTooltip(true);
    setShowLabels(false);
    setCustomPalette(null);
  };

  return (
    <div className="pg-demo">
      <div className="pg-demo-grid">
        <aside className="pg-controls" aria-label="Map configuration">
          <div className="pg-controls-head">
            <span className="pg-eyebrow">Configuration</span>
            <button className="pg-text-button" type="button" onClick={reset}>
              Reset
            </button>
          </div>

          <fieldset className="pg-field">
            <legend>Display</legend>
            <div className="pg-segmented" role="group" aria-label="Display mode">
              <button
                type="button"
                aria-pressed={mode === "map"}
                onClick={() => setMode("map")}
              >
                Map
              </button>
              <button
                type="button"
                aria-pressed={mode === "choropleth"}
                onClick={() => setMode("choropleth")}
              >
                Choropleth
              </button>
            </div>
          </fieldset>

          <label className="pg-field">
            <span>Language</span>
            <select
              value={locale}
              onChange={(event) => setLocale(event.target.value as Locale)}
            >
              <option value="en">English</option>
              <option value="prs">Dari — دری</option>
              <option value="ps">Pashto — پښتو</option>
            </select>
          </label>

          <fieldset className="pg-field">
            <legend>Map colors</legend>
            <p className="pg-field-note">
              {mode === "choropleth"
                ? "Choropleth fills come from the data scale. Switch to Map to edit these colors."
                : "Selection and hover colors update live."}
            </p>
            <div className="pg-color-grid">
              <label>
                <span>Base</span>
                <input
                  type="color"
                  value={palette.fill}
                  disabled={mode === "choropleth"}
                  aria-label="Base fill color"
                  onChange={(event) =>
                    setCustomPalette({ ...palette, fill: event.target.value })
                  }
                />
                <code>{palette.fill}</code>
              </label>
              <label>
                <span>Hover</span>
                <input
                  type="color"
                  value={palette.hoverFill}
                  disabled={mode === "choropleth"}
                  aria-label="Hover fill color"
                  onChange={(event) =>
                    setCustomPalette({
                      ...palette,
                      hoverFill: event.target.value,
                    })
                  }
                />
                <code>{palette.hoverFill}</code>
              </label>
              <label>
                <span>Selected</span>
                <input
                  type="color"
                  value={palette.selectedFill}
                  disabled={mode === "choropleth"}
                  aria-label="Selected fill color"
                  onChange={(event) =>
                    setCustomPalette({
                      ...palette,
                      selectedFill: event.target.value,
                    })
                  }
                />
                <code>{palette.selectedFill}</code>
              </label>
            </div>
          </fieldset>

          <fieldset className="pg-field">
            <legend>Options</legend>
            <label className="pg-switch">
              <input
                type="checkbox"
                checked={showTooltip}
                onChange={(event) => setShowTooltip(event.target.checked)}
              />
              <span>Show tooltips</span>
            </label>
            <label className="pg-switch">
              <input
                type="checkbox"
                checked={showLabels}
                onChange={(event) => setShowLabels(event.target.checked)}
              />
              <span>Show province labels</span>
            </label>
          </fieldset>
        </aside>

        <div className="pg-demo-mapcard">
          <div className="pg-demo-maphead">
            <div>
              <span className="pg-eyebrow">Live preview</span>
              <h3>{mode === "map" ? "Interactive province map" : "Province choropleth"}</h3>
            </div>
            <span className="pg-chip">{locale.toUpperCase()}</span>
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
                legendTitle={SAMPLE_METRIC_LABEL}
              />
            )}
          </div>

          <div className="pg-demo-selection" dir={direction}>
            {province ? (
              <>
                <div>
                  <span className="pg-eyebrow">Selected province</span>
                  <strong className="pg-demo-province">{province.names[locale]}</strong>
                  <code className="pg-chip">{province.code}</code>
                </div>
                <div className="pg-demo-value">
                  {mode === "choropleth" ? (
                    <>
                      <span className="pg-eyebrow">Sample value</span>
                      <strong>{hasValue ? rawValue : "No data"}</strong>
                    </>
                  ) : (
                    <span className="pg-demo-hint">
                      Click a province — or focus it and press Enter — to select.
                    </span>
                  )}
                </div>
              </>
            ) : (
              <span className="pg-demo-hint">No province selected. Pick one on the map.</span>
            )}
          </div>
        </div>
      </div>

      <div className="pg-demo-code">
        <div className="pg-code-intro">
          <span className="pg-eyebrow">Source for this preview</span>
          <p>Every control above maps to a typed prop — no hidden wrappers.</p>
        </div>
        <CodeBlock code={code} />
      </div>
    </div>
  );
}
