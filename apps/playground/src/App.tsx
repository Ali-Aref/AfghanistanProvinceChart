import { useEffect, useState } from "react";
import {
  AfghanistanChoropleth,
  AfghanistanMap,
  INTL_LOCALES,
  getProvinceName,
  type Locale,
} from "afghanistan-province-chart";
import { ApiReference } from "./components/ApiReference.js";
import { CodeBlock } from "./components/CodeBlock.js";
import { DemoPlayground } from "./components/DemoPlayground.js";
import { SAMPLE_DATA, SAMPLE_TOP_VALUES } from "./examples/sampleData.js";
import {
  SHOWCASE_MESSAGES,
  SITE_LANG,
  applyDocumentLocale,
  getBasePath,
  isLocale,
  localeFromPath,
  localePath,
  preferredLocale,
} from "./i18n.js";

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

const FEATURES = ["map", "keyboard", "globe", "bolt"] as const;

const LOCALIZED_CARDS: Array<{
  title: string;
  locale: Locale;
  script: string;
  name: string;
  direction: "ltr" | "rtl";
}> = [
  { title: "English", locale: "en", script: "Latin", name: "Kabul", direction: "ltr" },
  { title: "دری", locale: "prs", script: "فارسی افغانستان", name: "کابل", direction: "rtl" },
  { title: "پښتو", locale: "ps", script: "پښتو", name: "کابل", direction: "rtl" },
];

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getInitialLocale(): Locale {
  if (typeof window === "undefined") return "en";
  const fromPath = localeFromPath(window.location.pathname);
  if (fromPath) return fromPath;
  // A bare URL is always English unless the visitor has chosen a language or
  // explicitly prefers an Afghan language. No guess is made for fa-IR.
  try {
    const saved = window.localStorage.getItem("af-showcase-locale");
    if (saved && isLocale(saved)) return saved;
  } catch {
    // Storage can be disabled without disabling the language switcher.
  }
  return preferredLocale(navigator.languages ?? [navigator.language]);
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
  const [locale, setLocale] = useState<Locale>(getInitialLocale);
  const [installCopied, setInstallCopied] = useState(false);
  const t = SHOWCASE_MESSAGES[locale].site;
  const basePath = typeof window === "undefined" ? "/" : getBasePath(window.location.pathname);

  useEffect(() => {
    applyDocumentLocale(locale);
  }, [locale]);

  useEffect(() => {
    if (locale !== "en" && !localeFromPath(window.location.pathname)) {
      window.history.replaceState(
        null,
        "",
        `${localePath(basePath, locale)}${window.location.search}${window.location.hash}`,
      );
    }
  }, [basePath, locale]);

  useEffect(() => {
    const syncLocation = () => setLocale(localeFromPath(window.location.pathname) ?? "en");
    window.addEventListener("popstate", syncLocation);
    return () => window.removeEventListener("popstate", syncLocation);
  }, []);

  const changeLocale = (next: Locale) => {
    setLocale(next);
    window.history.pushState(
      null,
      "",
      `${localePath(basePath, next)}${window.location.search}${window.location.hash}`,
    );
    try {
      window.localStorage.setItem("af-showcase-locale", next);
    } catch {
      // Browser storage is optional.
    }
  };

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
        {t.skip}
      </a>

      <header className="pg-header">
        <a className="pg-brand" href="#top">
          <span className="pg-brand-mark" aria-hidden="true">
            A
          </span>
          <span>
            <strong>{t.brand}</strong>
            <small>{t.brandSubtitle}</small>
          </span>
        </a>
        <nav className="pg-nav" aria-label={t.primaryNav}>
          <a href="#playground">{t.playground}</a>
          <a href="#choropleth">{t.choropleth}</a>
          <a href="#api">{t.api}</a>
          <a href="#docs">{t.docs}</a>
        </nav>
        <label className="pg-site-language">
          <span className="pg-sr-only">{t.language}</span>
          <select
            aria-label={t.language}
            value={locale}
            onChange={(event) => changeLocale(event.target.value as Locale)}
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
        </label>
        <button
          className="pg-theme-toggle"
          type="button"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label={t.switchTheme.replace("{theme}", theme === "dark" ? t.light : t.dark)}
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
          <span>{theme === "dark" ? t.light : t.dark}</span>
        </button>
      </header>

      <main id="main">
        <section className="pg-hero" id="top">
          <div className="pg-hero-copy">
            <span className="pg-pill">
              <span className="pg-pill-dot" aria-hidden="true" />
              {t.heroBadge}
            </span>
            <h1>
              {t.heroTitle}
              <br />
              <em>{t.heroEmphasis}</em>
            </h1>
            <p className="pg-lede">{t.heroDescription}</p>
            <div className="pg-hero-actions">
              <a className="pg-button" href="#playground">
                {t.tryPlayground}
              </a>
              <a className="pg-button pg-button--ghost" href="#api">
                {t.browseApi}
              </a>
            </div>
            <div className="pg-install">
              <code dir="ltr">{INSTALL_COMMAND}</code>
              <button type="button" onClick={copyInstall} aria-label={t.copyInstall}>
                {installCopied ? t.copied : t.copy}
              </button>
            </div>
            <ul className="pg-hero-points">
              <li>{t.heroPointCodes}</li>
              <li>{t.heroPointInput}</li>
              <li>{t.heroPointRtl}</li>
            </ul>
          </div>

          <div className="pg-hero-visual">
            <div className="pg-orbit pg-orbit--one" aria-hidden="true" />
            <div className="pg-orbit pg-orbit--two" aria-hidden="true" />
            <div className="pg-hero-map-frame">
              <AfghanistanMap
                locale={locale}
                defaultSelectedProvince="AF-KAB"
                showTooltip={false}
                colors={heroPalette}
                ariaLabel={t.previewMap}
              />
              <div className="pg-hero-map-caption">
                <span>{t.provinces}</span>
                <span>{t.oneSvg}</span>
              </div>
            </div>
            <div className="pg-float-card">
              <span className="pg-float-kicker">{t.localized}</span>
              <strong>{t.threeLanguages}</strong>
              <span>EN · دری · پښتو</span>
            </div>
          </div>
        </section>

        <section className="pg-features" aria-label={t.highlights}>
          {FEATURES.map((icon, index) => (
            <article className="pg-feature" key={icon}>
              <span className="pg-feature-icon">
                <FeatureIcon name={icon} />
              </span>
              <h2>{t.features[index]?.title}</h2>
              <p>{t.features[index]?.body}</p>
            </article>
          ))}
        </section>

        <section className="pg-section" id="playground">
          <div className="pg-section-head">
            <span className="pg-eyebrow">{t.livePlayground}</span>
            <h2>{t.playgroundTitle}</h2>
            <p>{t.playgroundDescription}</p>
          </div>
          <DemoPlayground theme={theme} siteLocale={locale} metricLabel={t.metric} />
        </section>

        <section className="pg-section" id="choropleth">
          <div className="pg-section-head">
            <span className="pg-eyebrow">{t.dataViz}</span>
            <h2>{t.dataTitle}</h2>
            <p>{t.dataDescription}</p>
          </div>

          <div className="pg-showcase">
            <div className="pg-showcase-map">
              <div className="pg-showcase-head">
                <span className="pg-eyebrow">{t.illustrativeDataset}</span>
                <span className="pg-chip" dir="ltr">
                  0–100
                </span>
              </div>
              <AfghanistanChoropleth
                locale={locale}
                data={SAMPLE_DATA}
                defaultSelectedProvince="AF-HER"
                showLegend
                legendTitle={t.metric}
              />
            </div>
            <div className="pg-showcase-copy">
              <h3>{t.missingTitle}</h3>
              <p>{t.missingDescription}</p>
              <ol className="pg-rank" aria-label={t.highestValues}>
                {SAMPLE_TOP_VALUES.map(({ code, value }, index) => {
                  return (
                    <li key={code}>
                      <span className="pg-rank-index" dir="ltr">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="pg-rank-name" lang={SITE_LANG[locale]}>
                        {getProvinceName(code, locale)}
                      </span>
                      <span
                        className="pg-rank-bar"
                        style={{ width: `${value}%` }}
                        aria-hidden="true"
                      />
                      <strong>
                        {new Intl.NumberFormat(INTL_LOCALES[locale]).format(value)}
                      </strong>
                    </li>
                  );
                })}
              </ol>
              <p className="pg-note">{t.fabricated}</p>
            </div>
          </div>
        </section>

        <section className="pg-section" id="api">
          <div className="pg-section-head">
            <span className="pg-eyebrow">{t.apiReference}</span>
            <h2>{t.apiTitle}</h2>
            <p>{t.apiDescription}</p>
          </div>
          <ApiReference locale={locale} />
        </section>

        <section className="pg-section" id="localization">
          <div className="pg-section-head">
            <span className="pg-eyebrow">{t.localization}</span>
            <h2>{t.localizationTitle}</h2>
            <p>{t.localizationDescription}</p>
          </div>
          <div className="pg-locale-grid">
            {LOCALIZED_CARDS.map((card) => (
              <article
                className="pg-locale-card"
                key={card.locale}
                dir={card.direction}
                lang={SITE_LANG[card.locale]}
              >
                <span className="pg-eyebrow">{card.title}</span>
                <strong>{card.name}</strong>
                <span className="pg-locale-meta">
                  {card.locale} · {card.script}
                </span>
              </article>
            ))}
          </div>
          <p className="pg-note pg-note--center">{t.nameSources}</p>
        </section>

        <section className="pg-section" id="docs">
          <div className="pg-section-head">
            <span className="pg-eyebrow">{t.documentation}</span>
            <h2>{t.docsTitle}</h2>
            <p>{t.docsDescription}</p>
            <a
              className="pg-docs-link"
              href={`https://github.com/Ali-Aref/AfghanistanProvinceChart/blob/production/docs/${locale === "en" ? "" : `${locale}/`}README.md`}
              target="_blank"
              rel="noreferrer"
            >
              {t.fullGuide}
            </a>
          </div>

          <div className="pg-docs-grid">
            <article className="pg-doc-card">
              <span className="pg-step">01</span>
              <h3>{t.install}</h3>
              <p>{t.installDescription}</p>
              <CodeBlock code={INSTALL_COMMAND} label="sh" locale={locale} />
            </article>
            <article className="pg-doc-card">
              <span className="pg-step">02</span>
              <h3>{t.render}</h3>
              <p>{t.renderDescription}</p>
              <CodeBlock code={QUICK_START} locale={locale} />
            </article>
            <article className="pg-doc-card">
              <span className="pg-step">03</span>
              <h3 lang="en" dir="ltr">
                Next.js
              </h3>
              <p>
                {t.nextDescription} <code dir="ltr">&quot;use client&quot;</code>{" "}
                {t.nextDescriptionEnd}
              </p>
              <CodeBlock code={NEXT_STEPS} locale={locale} />
            </article>
          </div>

          <div className="pg-data-card">
            <div>
              <span className="pg-eyebrow">{t.geographicData}</span>
              <h3>{t.geographicTitle}</h3>
              <p>{t.geographicDescription}</p>
              <p>{t.geographicSource}</p>
            </div>
            <div className="pg-data-stats">
              <div>
                <strong>34</strong>
                <span>{t.admUnits}</span>
              </div>
              <div>
                <strong>2007</strong>
                <span>{t.boundaryYear}</span>
              </div>
              <div>
                <strong>0</strong>
                <span>{t.runtimeDownloads}</span>
              </div>
            </div>
            <a
              className="pg-button pg-button--ghost"
              href="https://www.geoboundaries.org"
              target="_blank"
              rel="noreferrer"
            >
              <span lang="en" dir="ltr">
                geoBoundaries.org
              </span>
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
              <strong>{t.brandFull}</strong>
              <small lang="en" dir="ltr">
                afghanistan-province-chart
              </small>
            </span>
          </a>
          <p>{t.footerNote}</p>
        </div>
        <nav aria-label={t.footerNav}>
          <a href="#playground">{t.playground}</a>
          <a href="#api">{t.api}</a>
          <a href="#docs">{t.docs}</a>
          <a href="#localization">{t.localization}</a>
        </nav>
      </footer>
    </div>
  );
}
