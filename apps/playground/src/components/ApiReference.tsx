interface ApiRow {
  name: string;
  type: string;
  defaultValue: string;
  description: string;
}

const MAP_ROWS: ApiRow[] = [
  {
    name: "locale",
    type: '"en" | "prs" | "ps"',
    defaultValue: '"en"',
    description: "Province names, UI copy and text direction.",
  },
  {
    name: "width / height",
    type: "number | string",
    defaultValue: '"100%" / auto',
    description: "Container dimensions. The SVG keeps its aspect ratio.",
  },
  {
    name: "selectedProvince",
    type: "ProvinceCode | null",
    defaultValue: "undefined",
    description: "Controlled selection. Passing null clears the selection.",
  },
  {
    name: "defaultSelectedProvince",
    type: "ProvinceCode | null",
    defaultValue: "null",
    description: "Initial selection for uncontrolled usage.",
  },
  {
    name: "onProvinceClick",
    type: "(interaction: ProvinceInteraction) => void",
    defaultValue: "—",
    description: "Canonical province metadata plus the originating event.",
  },
  {
    name: "onSelectionChange",
    type: "(code: ProvinceCode | null) => void",
    defaultValue: "—",
    description: "Fires on select and deselect, including keyboard activation.",
  },
  {
    name: "showTooltip",
    type: "boolean",
    defaultValue: "true",
    description: "Built-in tooltip on hover and keyboard focus.",
  },
  {
    name: "showProvinceLabels",
    type: "boolean",
    defaultValue: "false",
    description: "Localized province names drawn inside the map.",
  },
  {
    name: "colors",
    type: "Partial<MapColors>",
    defaultValue: "theme defaults",
    description: "Maps to scoped CSS variables for full theme control.",
  },
  {
    name: "renderTooltip",
    type: "(context: ProvinceTooltipContext) => ReactNode",
    defaultValue: "—",
    description: "Replace tooltip content with React nodes. Never HTML strings.",
  },
  {
    name: "interactive",
    type: "boolean",
    defaultValue: "true",
    description: "Render a muted, non-focusable map when false.",
  },
  {
    name: "ariaLabel",
    type: "string",
    defaultValue: "localized",
    description: "Accessible name applied to the SVG group.",
  },
];

const CHOROPLETH_ROWS: ApiRow[] = [
  {
    name: "data",
    type: "ProvinceNumericData",
    defaultValue: "required",
    description: "Values keyed by ISO code. Missing keys are not zero.",
  },
  {
    name: "domain",
    type: "readonly [number, number]",
    defaultValue: "auto min/max",
    description: "Fixed numeric domain for a stable scale across renders.",
  },
  {
    name: "palette",
    type: "readonly [string, string]",
    defaultValue: "teal scale",
    description: "Two-stop continuous palette using CSS hex colors.",
  },
  {
    name: "missingColor",
    type: "string",
    defaultValue: "scoped token",
    description: "Fill for missing, null, NaN or out-of-province data.",
  },
  {
    name: "formatValue",
    type: "(value: number) => string",
    defaultValue: "Intl.NumberFormat",
    description: "Custom metric formatting for tooltip and legend.",
  },
  {
    name: "showLegend",
    type: "boolean",
    defaultValue: "false",
    description: "Continuous legend with min, max and missing-data swatch.",
  },
  {
    name: "legendTitle",
    type: "string",
    defaultValue: "localized",
    description: "Legend heading, useful for naming the metric.",
  },
];

function ApiTable({ rows }: { rows: ApiRow[] }) {
  return (
    <div className="pg-table-wrap">
      <table className="pg-table">
        <thead>
          <tr>
            <th scope="col">Prop</th>
            <th scope="col">Type</th>
            <th scope="col">Default</th>
            <th scope="col">Notes</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name}>
              <td>
                <code>{row.name}</code>
              </td>
              <td>
                <code className="pg-type">{row.type}</code>
              </td>
              <td>
                <code className="pg-default">{row.defaultValue}</code>
              </td>
              <td>{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ApiReference() {
  return (
    <div className="pg-api">
      <article>
        <h3>
          <code>&lt;AfghanistanMap /&gt;</code>
        </h3>
        <ApiTable rows={MAP_ROWS} />
      </article>
      <article>
        <h3>
          <code>&lt;AfghanistanChoropleth /&gt;</code>
        </h3>
        <p className="pg-api-note">
          Accepts every map prop plus the data-specific props below.
        </p>
        <ApiTable rows={CHOROPLETH_ROWS} />
      </article>
      <article className="pg-api-utilities">
        <h3>Utility exports</h3>
        <div className="pg-utility-grid">
          <div>
            <code>getProvinces()</code>
            <span>Immutable registry of all 34 provinces.</span>
          </div>
          <div>
            <code>getProvinceByCode(code)</code>
            <span>Canonical metadata for an ISO code.</span>
          </div>
          <div>
            <code>getProvinceName(code, locale)</code>
            <span>Localized name with a safe English fallback.</span>
          </div>
          <div>
            <code>isProvinceCode(value)</code>
            <span>Runtime narrowing for untrusted strings.</span>
          </div>
        </div>
      </article>
    </div>
  );
}
