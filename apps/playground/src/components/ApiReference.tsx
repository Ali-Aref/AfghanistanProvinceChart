import type { Locale } from "afghanistan-province-chart";
import { SHOWCASE_MESSAGES, type ShowcaseMessages } from "../i18n.js";

interface ApiRow {
  name: string;
  type: string;
  defaultValue: string;
  descriptionKey: keyof ShowcaseMessages["api"]["rows"];
}

const MAP_ROWS: ApiRow[] = [
  {
    name: "locale",
    type: '"en" | "prs" | "ps"',
    defaultValue: '"en"',
    descriptionKey: "locale",
  },
  {
    name: "width / height",
    type: "number | string",
    defaultValue: '"100%" / auto',
    descriptionKey: "dimensions",
  },
  {
    name: "selectedProvince",
    type: "ProvinceCode | null",
    defaultValue: "undefined",
    descriptionKey: "selectedProvince",
  },
  {
    name: "defaultSelectedProvince",
    type: "ProvinceCode | null",
    defaultValue: "null",
    descriptionKey: "defaultSelectedProvince",
  },
  {
    name: "onProvinceClick",
    type: "(interaction: ProvinceInteraction) => void",
    defaultValue: "—",
    descriptionKey: "onProvinceClick",
  },
  {
    name: "onSelectionChange",
    type: "(code: ProvinceCode | null) => void",
    defaultValue: "—",
    descriptionKey: "onSelectionChange",
  },
  {
    name: "showTooltip",
    type: "boolean",
    defaultValue: "true",
    descriptionKey: "showTooltip",
  },
  {
    name: "showProvinceLabels",
    type: "boolean",
    defaultValue: "false",
    descriptionKey: "showProvinceLabels",
  },
  {
    name: "colors",
    type: "Partial<MapColors>",
    defaultValue: "theme defaults",
    descriptionKey: "colors",
  },
  {
    name: "renderTooltip",
    type: "(context: ProvinceTooltipContext) => ReactNode",
    defaultValue: "—",
    descriptionKey: "renderTooltip",
  },
  {
    name: "interactive",
    type: "boolean",
    defaultValue: "true",
    descriptionKey: "interactive",
  },
  {
    name: "ariaLabel",
    type: "string",
    defaultValue: "localized",
    descriptionKey: "ariaLabel",
  },
];

const CHOROPLETH_ROWS: ApiRow[] = [
  {
    name: "data",
    type: "ProvinceNumericData",
    defaultValue: "required",
    descriptionKey: "data",
  },
  {
    name: "domain",
    type: "readonly [number, number]",
    defaultValue: "auto min/max",
    descriptionKey: "domain",
  },
  {
    name: "palette",
    type: "readonly [string, string]",
    defaultValue: "teal scale",
    descriptionKey: "palette",
  },
  {
    name: "missingColor",
    type: "string",
    defaultValue: "scoped token",
    descriptionKey: "missingColor",
  },
  {
    name: "formatValue",
    type: "(value: number) => string",
    defaultValue: "Intl.NumberFormat",
    descriptionKey: "formatValue",
  },
  {
    name: "showLegend",
    type: "boolean",
    defaultValue: "false",
    descriptionKey: "showLegend",
  },
  {
    name: "legendTitle",
    type: "string",
    defaultValue: "localized",
    descriptionKey: "legendTitle",
  },
];

function ApiTable({ rows, locale }: { rows: ApiRow[]; locale: Locale }) {
  const t = SHOWCASE_MESSAGES[locale].api;
  const defaultLabels: Record<string, string> = {
    "theme defaults": t.defaults.theme,
    localized: t.defaults.localized,
    required: t.defaults.required,
    "auto min/max": t.defaults.autoDomain,
    "teal scale": t.defaults.teal,
    "scoped token": t.defaults.scoped,
  };
  return (
    <div className="pg-table-wrap">
      <table className="pg-table">
        <thead>
          <tr>
            <th scope="col">{t.prop}</th>
            <th scope="col">{t.type}</th>
            <th scope="col">{t.default}</th>
            <th scope="col">{t.notes}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name}>
              <td>
                <code dir="ltr" lang="en">
                  {row.name}
                </code>
              </td>
              <td>
                <code className="pg-type" dir="ltr" lang="en">
                  {row.type}
                </code>
              </td>
              <td>
                <code
                  className="pg-default"
                  dir={defaultLabels[row.defaultValue] ? undefined : "ltr"}
                >
                  {defaultLabels[row.defaultValue] ?? row.defaultValue}
                </code>
              </td>
              <td>{t.rows[row.descriptionKey]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ApiReference({ locale }: { locale: Locale }) {
  const t = SHOWCASE_MESSAGES[locale].api;
  return (
    <div className="pg-api">
      <article>
        <h3>
          <code>&lt;AfghanistanMap /&gt;</code>
        </h3>
        <ApiTable rows={MAP_ROWS} locale={locale} />
      </article>
      <article>
        <h3>
          <code>&lt;AfghanistanChoropleth /&gt;</code>
        </h3>
        <p className="pg-api-note">{t.mapPlus}</p>
        <ApiTable rows={CHOROPLETH_ROWS} locale={locale} />
      </article>
      <article className="pg-api-utilities">
        <h3>{t.utilities}</h3>
        <div className="pg-utility-grid">
          <div>
            <code dir="ltr">getProvinces()</code>
            <span>{t.utilityDescriptions.getProvinces}</span>
          </div>
          <div>
            <code dir="ltr">getProvinceByCode(code)</code>
            <span>{t.utilityDescriptions.getProvinceByCode}</span>
          </div>
          <div>
            <code dir="ltr">getProvinceName(code, locale)</code>
            <span>{t.utilityDescriptions.getProvinceName}</span>
          </div>
          <div>
            <code dir="ltr">isProvinceCode(value)</code>
            <span>{t.utilityDescriptions.isProvinceCode}</span>
          </div>
        </div>
      </article>
    </div>
  );
}
