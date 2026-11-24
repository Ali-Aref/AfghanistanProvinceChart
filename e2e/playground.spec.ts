import { expect, test } from "@playwright/test";
import {
  SHOWCASE_MESSAGES,
  SITE_LANG,
  getBasePath,
  localeFromPath,
  localePath,
  preferredLocale,
} from "../apps/playground/src/i18n.js";

function checkStrings(value: unknown): void {
  if (typeof value === "string") {
    expect(value.trim().length).toBeGreaterThan(0);
  } else if (value && typeof value === "object") {
    for (const item of Object.values(value)) checkStrings(item);
  }
}

function checkShape(reference: unknown, translation: unknown): void {
  if (typeof reference === "string") {
    expect(typeof translation).toBe("string");
    return;
  }
  expect(Array.isArray(translation)).toBe(Array.isArray(reference));
  const original = reference as Record<string, unknown>;
  const translated = translation as Record<string, unknown>;
  expect(Object.keys(translated)).toEqual(Object.keys(original));
  for (const key of Object.keys(original)) checkShape(original[key], translated[key]);
}

test("provides complete showcase copy for every locale", () => {
  for (const locale of ["en", "prs", "ps"] as const) {
    checkStrings(SHOWCASE_MESSAGES[locale]);
    checkShape(SHOWCASE_MESSAGES.en, SHOWCASE_MESSAGES[locale]);
  }
});

test("resolves shareable locale paths and browser language without guessing Iranian Persian", () => {
  expect(getBasePath("/demo/prs/index.html")).toBe("/demo/");
  expect(localeFromPath("/demo/ps/")).toBe("ps");
  expect(localePath("/demo/", "prs")).toBe("/demo/prs/");
  expect(localePath("/demo/", "en")).toBe("/demo/");
  expect(preferredLocale(["fa-AF", "en-US"])).toBe("prs");
  expect(preferredLocale(["ps-AF", "en-US"])).toBe("ps");
  expect(preferredLocale(["fa-IR", "en-US"])).toBe("en");
});

test("serves localized HTML and a bundled font license at direct URLs", async ({ request }) => {
  for (const locale of ["prs", "ps"] as const) {
    const response = await request.get(`/${locale}/`);
    expect(response.ok()).toBe(true);
    const html = await response.text();
    expect(html).toContain(`<html lang="${SITE_LANG[locale]}" dir="rtl">`);
    expect(html).toContain(SHOWCASE_MESSAGES[locale].meta.title);
    expect(html).toContain(SHOWCASE_MESSAGES[locale].meta.description);
  }
  const license = await request.get("/fonts/OFL.txt");
  expect(license.ok()).toBe(true);
  expect(await license.text()).toContain("SIL OPEN FONT LICENSE Version 1.1");
});

test.describe("playground", () => {
  test("renders the hero map and all 34 provinces", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Afghanistan");
    await expect(page.locator(".pg-hero-map-frame [data-province-code]")).toHaveCount(34);
    await expect(page.locator(".af-map__outline").first()).toBeAttached();
  });

  test("selects a province and updates the detail panel", async ({ page }) => {
    await page.goto("/#playground");
    const herat = page.locator('#playground [data-province-code="AF-HER"]');
    await herat.click();
    await expect(herat).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator(".pg-demo-province")).toHaveText("Herat");
    await expect(page.locator(".pg-demo-selection")).toContainText("AF-HER");
  });

  test("localizes names, tooltips and RTL chrome without mirroring geometry", async ({
    page,
  }) => {
    await page.goto("/#playground");
    const map = page.locator("#playground .af-map");
    const viewBox = await map.locator("svg").getAttribute("viewBox");
    await page.getByLabel("Map language").selectOption("prs");

    const kabul = page.locator('#playground [data-province-code="AF-KAB"]');
    await kabul.focus();
    const tooltip = page.getByRole("tooltip");
    await expect(tooltip).toContainText("کابل");
    await expect(tooltip).toHaveAttribute("dir", "rtl");
    await expect(map.locator("svg")).toHaveAttribute("viewBox", viewBox ?? "");
  });

  test("switches to choropleth and exposes a legend", async ({ page }) => {
    await page.goto("/#playground");
    await page.getByRole("button", { name: "Choropleth" }).click();

    await expect(page.locator("#playground .af-legend")).toBeVisible();
    await expect(page.locator("#playground .af-legend__title")).toContainText("service-reach");
    await expect(page.locator("#playground .af-legend__missing")).toBeVisible();

    const missing = page.locator('#playground [data-province-code="AF-NIM"]');
    await expect(missing).toHaveAttribute("style", /--af-map-no-data/);
  });

  test("moves focus with arrow keys and activates with Enter", async ({ page }) => {
    await page.goto("/#playground");
    const balkh = page.locator('#playground [data-province-code="AF-BAL"]');
    await balkh.focus();
    await page.keyboard.press("ArrowRight");

    const focusedCode = await page.evaluate(
      () => document.activeElement?.getAttribute("data-province-code") ?? null,
    );
    expect(focusedCode).not.toBeNull();
    expect(focusedCode).not.toBe("AF-BAL");

    await page.keyboard.press("Enter");
    await expect(page.locator(".pg-demo-province")).not.toHaveText("No province selected");
  });

  test("toggles light and dark themes", async ({ page }) => {
    await page.goto("/");
    const pageRoot = page.locator(".pg");
    const primaryButton = page.locator(".pg-hero-actions .pg-button").first();
    await expect(pageRoot).toHaveAttribute("data-theme", "light");
    await expect(primaryButton).toHaveCSS("color", "rgb(255, 255, 255)");
    await page.locator(".pg-theme-toggle").click();
    await expect(pageRoot).toHaveAttribute("data-theme", "dark");
    await expect(primaryButton).toHaveCSS("color", "rgb(6, 42, 38)");
    await page.locator(".pg-theme-toggle").click();
    await expect(pageRoot).toHaveAttribute("data-theme", "light");
  });

  test("has no horizontal overflow on mobile", async ({ page }) => {
    await page.goto("/");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
    await expect(page.locator("#playground .af-map")).toBeVisible();
  });

  test("captures documentation screenshots", async ({ page }) => {
    if (test.info().project.name !== "desktop-light") test.skip();
    await page.setViewportSize({ width: 1440, height: 940 });
    await page.goto("/", { waitUntil: "networkidle" });
    await page.screenshot({ path: "docs/assets/playground-hero-light.png" });

    await page.locator("#playground").scrollIntoViewIfNeeded();
    await page.waitForTimeout(250);
    await page.screenshot({ path: "docs/assets/playground-light.png" });

    await page.locator(".pg-theme-toggle").click();
    await page.waitForTimeout(300);
    await page.screenshot({ path: "docs/assets/playground-dark.png" });

    await page.getByRole("button", { name: "Choropleth" }).click();
    await page.getByLabel("Map language").selectOption("prs");
    await page.waitForTimeout(300);
    await page.screenshot({ path: "docs/assets/playground-choropleth-dark.png" });

    for (const locale of ["prs", "ps"] as const) {
      await page.goto(`/${locale}/`, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({ path: `docs/assets/playground-hero-${locale}.png` });
    }

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "networkidle" });
    await page.screenshot({ path: "docs/assets/playground-mobile-light.png" });
  });

  for (const locale of ["prs", "ps"] as const) {
    test(`serves a complete ${locale} site with static metadata and unchanged geometry`, async ({
      page,
      request,
    }) => {
      const response = await request.get(`/${locale}/`);
      const html = await response.text();
      expect(response.ok()).toBe(true);
      expect(html).toContain(`<html lang="${SITE_LANG[locale]}" dir="rtl">`);
      expect(html).toContain(SHOWCASE_MESSAGES[locale].meta.title);

      await page.goto(`/${locale}/#playground`);
      await expect(page.locator("html")).toHaveAttribute("lang", SITE_LANG[locale]);
      await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
      expect(
        await page.evaluate(async () => {
          const faces = await document.fonts.load("400 16px Vazirmatn", "کابل");
          return faces.some((face) => face.status === "loaded");
        }),
      ).toBe(true);
      await expect(page).toHaveTitle(SHOWCASE_MESSAGES[locale].meta.title);
      await expect(page.getByRole("heading", { level: 1 })).toContainText(
        SHOWCASE_MESSAGES[locale].site.heroEmphasis,
      );
      await expect(page.locator(".pg-demo-province")).toHaveText("کابل");
      await expect(page.locator(".pg-hero-map-frame .af-map")).toHaveAttribute(
        "data-af-locale",
        locale,
      );
      await expect(page.locator(".pg-showcase-map .af-legend__title")).toHaveText(
        SHOWCASE_MESSAGES[locale].site.metric,
      );
      await expect(page.locator(".pg-note").first()).toHaveText(
        SHOWCASE_MESSAGES[locale].site.fabricated,
      );
      await expect(page.locator(".pg-rank-name").first()).toHaveText("کابل");
      await expect(page.locator("#playground .af-map [data-province-code]")).toHaveCount(34);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(1);
    });
  }

  test("changes the site language without losing the page or the demo controls", async ({
    page,
  }) => {
    await page.goto("/#playground");
    await page.getByLabel("Site language").selectOption("ps");
    await expect(page.locator(".pg-site-language")).toHaveCSS("border-top-width", "1px");
    await expect(page).toHaveURL(/\/ps\/#playground$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "ps-AF");
    await expect(page.locator("#playground .af-map")).toHaveAttribute("data-af-locale", "ps");
    await page.getByLabel("د نقشې ژبه").selectOption("en");
    await expect(page.locator("#playground .af-map")).toHaveAttribute("data-af-locale", "en");
    await expect(page.locator(".pg-showcase-map .af-map")).toHaveAttribute(
      "data-af-locale",
      "ps",
    );
    await page.getByRole("button", { name: "بیا پیل" }).click();
    await expect(page.locator("#playground .af-map")).toHaveAttribute("data-af-locale", "ps");
    await page.goBack();
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await page.goForward();
    await expect(page.locator("html")).toHaveAttribute("lang", "ps-AF");
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("lang", "ps-AF");
  });

  test("RTL map retains spatial arrow navigation and localized accessible labels", async ({
    page,
  }) => {
    await page.goto("/ps/#playground");
    const kabul = page.locator('#playground [data-province-code="AF-KAB"]');
    const viewBox = await page.locator("#playground svg").first().getAttribute("viewBox");
    await kabul.focus();
    await expect(page.locator("#playground .af-map__sr-only")).toContainText("کابل");
    await page.keyboard.press("ArrowRight");
    await expect(kabul).not.toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("#playground svg").first()).toHaveAttribute(
      "viewBox",
      viewBox ?? "",
    );
  });

  test("has no horizontal overflow in RTL on mobile", async ({ page }) => {
    for (const locale of ["prs", "ps"] as const) {
      await page.goto(`/${locale}/`);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(1);
    }
  });
});
