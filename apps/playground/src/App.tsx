import { useEffect, useState } from "react";
import {
  AfghanistanChoropleth,
  AfghanistanMap,
  getProvinceByCode,
  type Locale,
} from "afghanistan-province-chart";
import { ApiReference } from "./components/ApiReference.js";
import { CodeBlock } from "./components/CodeBlock.js";
import { DemoPlayground } from "./components/DemoPlayground.js";
import { SAMPLE_DATA, SAMPLE_METRIC_LABEL, SAMPLE_TOP_VALUES } from "./examples/sampleData.js";

type Theme = "light" | "dark";

const INSTALL_COMMAND = "pnpm add afghanistan-province-chart";

const QUICK_START = `import { AfghanistanMap } from "afghanistan-province-chart";
import "afghanistan-province-chart/styles.css";

export default function Dashboard() {
  return (
    <AfghanistanMap
      locale="en"
      height={480}
      onProvinceClick={({ province }) => {
        console.log(province.code);
      }}
    />
  );
}`;

const NEXT_STEPS = `"use client";

import { useState } from "react";
import {
  AfghanistanChoropleth,
  type ProvinceCode,
} from "afghanistan-province-chart";
import "afghanistan-province-chart/styles.css";

export function ProvinceReport({ data }: { data: Record<string, number> }) {
  const [selected, setSelected] = useState<ProvinceCode | null>(null);

  return (
    <AfghanistanChoropleth
      data={data}
      selectedProvince={selected}
      onSelectionChange={setSelected}
      showLegend
    />
  );
}`;

const FEATURES = [
  {
    icon: "map",
    title: "34 real province paths",
    body: "Build-time projected geometry from geoBoundaries ADM1. Exact ISO 3166-2 identifiers, no positional guesses.",
  },
  {
    icon: "keyboard",
    title: "Keyboard and screen-reader ready",
    body: "Roving focus, arrow-key navigation, Enter and Space activation, live announcements and visible focus rings.",
  },
  {
    icon: "globe",
    title: "English · Dari · Pashto",
    body: "Localized names and interface chrome with RTL tooltips and legends — the physical map is never mirrored.",
  },
  {
    icon: "bolt",
    title: "No map service required",
    body: "No API keys, tiles, CDNs or runtime network requests. Just a typed React component and ~32 kB gzipped JS.",
  },
] as const;

const LOCALIZED_CARDS: Array<{
  title: string;
  locale: Locale;
  script: string;
  name: string;
  direction: "ltr" | "rtl";
}> = [
  { title: "English", locale: "en", script: "Latin", name: "Kabul", direction: "ltr" },
  { title: "Dari", locale: "prs", script: "دری", name: "کابل", direction: "rtl" },
  { title: "Pashto", locale: "ps", script: "پښتو", name: "کابل", direction: "rtl" },
];

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function FeatureIcon({ name }: { name: string }) {
  if (name === "keyboard") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="2.5" y="5.5" width="19" height="13" rx="3" />
        <path d="M6 9h.01M9.5 9h.01M13 9h.01M16.5 9h.01M6 12.5h.01M9.5 12.5h.01M13 12.5h.01M16.5 12.5h.01M8 16h8" />
      </svg>
    );
  }
  if (name === "globe") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M3.5 12h17M12 3c2.5 2.7 3.8 5.8 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.8-3.8-9S9.5 5.7 12 3z" />
      </svg>
    );
  }
  if (name === "bolt") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M13 2.5 5.5 13H11l-1 8.5L18.5 11H13z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 6.5 9 3l6 3.5L21 3v14.5L15 21l-6-3.5L3 21z" />
      <path d="M9 3v14.5M15 6.5V21" />
    </svg>
  );
}

export default function App() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [installCopied, setInstallCopied] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.pgTheme = theme;
    root.style.colorScheme = theme;
    document.body.style.background = theme === "dark" ? "#080e17" : "#f6f7f9";
  }, [theme]);

  const copyInstall = async () => {
    try {
      await navigator.clipboard.writeText(INSTALL_COMMAND);
      setInstallCopied(true);
      window.setTimeout(() => setInstallCopied(false), 1600);
    } catch {
      setInstallCopied(false);
    }
  };

  const heroPalette =
    theme === "dark"
      ? { fill: "#1b2a3d", hoverFill: "#2a4058", selectedFill: "#2dd4bf" }
      : { fill: "#dfe7ef", hoverFill: "#c7d9e8", selectedFill: "#0f766e" };

  return (
    <div className="pg" data-theme={theme}>
      <a className="pg-skip" href="#main">
        Skip to content
      </a>

      <header className="pg-header">
        <a className="pg-brand" href="#top">
          <span className="pg-brand-mark" aria-hidden="true">
            A
          </span>
          <span>
            <strong>Afghanistan</strong>
            <small>Province Charts</small>
          </span>
        </a>
        <nav className="pg-nav" aria-label="Primary">
          <a href="#playground">Playground</a>
          <a href="#choropleth">Choropleth</a>
          <a href="#api">API</a>
          <a href="#docs">Docs</a>
        </nav>
        <button
          className="pg-theme-toggle"
          type="button"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
        >
          {theme === "dark" ? (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20 15.5A8.5 8.5 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5z" />
            </svg>
          )}
          <span>{theme === "dark" ? "Light" : "Dark"}</span>
        </button>
      </header>

      <main id="main">
        <section className="pg-hero" id="top">
          <div className="pg-hero-copy">
            <span className="pg-pill">
              <span className="pg-pill-dot" aria-hidden="true" />
              v0.1.0 · MIT · no API keys
            </span>
            <h1>
              Afghanistan,
              <br />
              <em>province by province.</em>
            </h1>
            <p className="pg-lede">
              A developer-first React library for interactive maps and data-driven choropleths
              of all 34 provinces. Typed, accessible, localization-ready and completely
              self-contained.
            </p>
            <div className="pg-hero-actions">
              <a className="pg-button" href="#playground">
                Try the playground
              </a>
              <a className="pg-button pg-button--ghost" href="#api">
                Browse the API
              </a>
            </div>
            <div className="pg-install">
              <code>{INSTALL_COMMAND}</code>
              <button type="button" onClick={copyInstall} aria-label="Copy install command">
                {installCopied ? "Copied" : "Copy"}
              </button>
            </div>
            <ul className="pg-hero-points">
              <li>34 canonical ISO codes</li>
              <li>Mouse, touch and keyboard</li>
              <li>Dari and Pashto RTL UI</li>
            </ul>
          </div>

          <div className="pg-hero-visual">
            <div className="pg-orbit pg-orbit--one" aria-hidden="true" />
            <div className="pg-orbit pg-orbit--two" aria-hidden="true" />
            <div className="pg-hero-map-frame">
              <AfghanistanMap
                defaultSelectedProvince="AF-KAB"
                showTooltip={false}
                colors={heroPalette}
                ariaLabel="Preview map of Afghanistan's provinces"
              />
              <div className="pg-hero-map-caption">
                <span>34 provinces</span>
                <span>1 lightweight SVG</span>
              </div>
            </div>
            <div className="pg-float-card">
              <span className="pg-float-kicker">Localized</span>
              <strong>3 languages</strong>
              <span>EN · دری · پښتو</span>
            </div>
          </div>
        </section>

        <section className="pg-features" aria-label="Library highlights">
          {FEATURES.map((feature) => (
            <article className="pg-feature" key={feature.title}>
              <span className="pg-feature-icon">
                <FeatureIcon name={feature.icon} />
              </span>
              <h2>{feature.title}</h2>
              <p>{feature.body}</p>
            </article>
          ))}
        </section>

        <section className="pg-section" id="playground">
          <div className="pg-section-head">
            <span className="pg-eyebrow">Live playground</span>
            <h2>Every prop, one map.</h2>
            <p>
              Change the language, theme and colors. Switch to a choropleth to see missing
              values kept distinct from zero. The code panel always matches the preview.
            </p>
          </div>
          <DemoPlayground theme={theme} />
        </section>

        <section className="pg-section" id="choropleth">
          <div className="pg-section-head">
            <span className="pg-eyebrow">Data visualization</span>
            <h2>Data without losing the map.</h2>
            <p>
              Partial datasets are first-class. Missing values get their own color, zero keeps
              its real scale position, and the legend, tooltip and screen-reader label all
              agree.
            </p>
          </div>

          <div className="pg-showcase">
            <div className="pg-showcase-map">
              <div className="pg-showcase-head">
                <span className="pg-eyebrow">Illustrative dataset</span>
                <span className="pg-chip">0–100</span>
              </div>
              <AfghanistanChoropleth
                data={SAMPLE_DATA}
                defaultSelectedProvince="AF-HER"
                showLegend
                legendTitle={SAMPLE_METRIC_LABEL}
              />
            </div>
            <div className="pg-showcase-copy">
              <h3>Missing is not zero.</h3>
              <p>
                Six provinces deliberately have no value in this demo. They render in the
                neutral missing-data color instead of collapsing to the bottom of the scale.
              </p>
              <ol className="pg-rank" aria-label="Highest illustrative sample values">
                {SAMPLE_TOP_VALUES.map(({ code, value }, index) => {
                  const province = getProvinceByCode(code);
                  return (
                    <li key={code}>
                      <span className="pg-rank-index">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="pg-rank-name">{province.names.en}</span>
                      <span
                        className="pg-rank-bar"
                        style={{ width: `${value}%` }}
                        aria-hidden="true"
                      />
                      <strong>{value}</strong>
                    </li>
                  );
                })}
              </ol>
              <p className="pg-note">
                These numbers are fabricated for the demo and are not official statistics.
              </p>
            </div>
          </div>
        </section>

        <section className="pg-section" id="api">
          <div className="pg-section-head">
            <span className="pg-eyebrow">API reference</span>
            <h2>Small surface. Strong types.</h2>
            <p>
              Everything is exported from the package root, including the ISO province union,
              interaction payloads and tooltip context. No deep imports required.
            </p>
          </div>
          <ApiReference />
        </section>

        <section className="pg-section" id="localization">
          <div className="pg-section-head">
            <span className="pg-eyebrow">Localization</span>
            <h2>Three languages. One geography.</h2>
            <p>
              Switch locale at runtime. Province identifiers never change, and RTL applies to
              interface chrome only — the country is not flipped.
            </p>
          </div>
          <div className="pg-locale-grid">
            {LOCALIZED_CARDS.map((card) => (
              <article className="pg-locale-card" key={card.locale} dir={card.direction}>
                <span className="pg-eyebrow">{card.title}</span>
                <strong>{card.name}</strong>
                <span className="pg-locale-meta">
                  {card.locale} · {card.script}
                </span>
              </article>
            ))}
          </div>
          <p className="pg-note pg-note--center">
            Names were checked against Persian and Pashto Wikipedia province lists. Dialectal
            spellings vary; corrections are welcome.
          </p>
        </section>

        <section className="pg-section" id="docs">
          <div className="pg-section-head">
            <span className="pg-eyebrow">Documentation</span>
            <h2>From install to dashboard.</h2>
            <p>
              The repository ships a playground, API docs, localization notes and a data
              provenance record. Start with three lines of code.
            </p>
          </div>

          <div className="pg-docs-grid">
            <article className="pg-doc-card">
              <span className="pg-step">01</span>
              <h3>Install</h3>
              <p>Add the package with pnpm, then import the scoped stylesheet once.</p>
              <CodeBlock code={INSTALL_COMMAND} label="sh" />
            </article>
            <article className="pg-doc-card">
              <span className="pg-step">02</span>
              <h3>Render</h3>
              <p>Drop the map into any card, grid, panel or full-page layout.</p>
              <CodeBlock code={QUICK_START} />
            </article>
            <article className="pg-doc-card">
              <span className="pg-step">03</span>
              <h3>Next.js</h3>
              <p>
                Components are SSR-safe. Add <code>&quot;use client&quot;</code> when you pass
                callbacks or control selection.
              </p>
              <CodeBlock code={NEXT_STEPS} />
            </article>
          </div>

          <div className="pg-data-card">
            <div>
              <span className="pg-eyebrow">Geographic data</span>
              <h3>Reproducible, attributed, bundled locally.</h3>
              <p>
                Geometry comes from geoBoundaries <code>gbOpen</code> AFG ADM1 (boundary year
                2007). The boundary dataset is public domain; geoBoundaries project code and
                derivative works are CC BY 4.0 and require attribution. Two source codes (
                <code>AF_BDN</code> and <code>AF_KAN</code>) are normalised to ISO 3166-2.
              </p>
              <p>
                The source GeoJSON, checksum, reviewed name mapping and generation script are
                kept in the repository. Projection happens at build time, so D3 is not shipped
                to the browser.
              </p>
            </div>
            <div className="pg-data-stats">
              <div>
                <strong>34</strong>
                <span>ADM1 units</span>
              </div>
              <div>
                <strong>2007</strong>
                <span>boundary year</span>
              </div>
              <div>
                <strong>0</strong>
                <span>runtime downloads</span>
              </div>
            </div>
            <a
              className="pg-button pg-button--ghost"
              href="https://www.geoboundaries.org"
              target="_blank"
              rel="noreferrer"
            >
              geoBoundaries.org
            </a>
          </div>
        </section>
      </main>

      <footer className="pg-footer">
        <div>
          <a className="pg-brand pg-brand--footer" href="#top">
            <span className="pg-brand-mark" aria-hidden="true">
              A
            </span>
            <span>
              <strong>Afghanistan Province Charts</strong>
              <small>afghanistan-province-chart</small>
            </span>
          </a>
          <p>
            MIT-licensed source. Boundary data public domain, with geoBoundaries attribution.
            Not a legal or survey-grade boundary source.
          </p>
        </div>
        <nav aria-label="Footer">
          <a href="#playground">Playground</a>
          <a href="#api">API</a>
          <a href="#docs">Docs</a>
          <a href="#localization">Localization</a>
        </nav>
      </footer>
    </div>
  );
}
