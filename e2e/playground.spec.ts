import { expect, test } from "@playwright/test";

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
    await page.getByLabel("Language").selectOption("prs");

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
    await expect(pageRoot).toHaveAttribute("data-theme", "light");
    await page.locator(".pg-theme-toggle").click();
    await expect(pageRoot).toHaveAttribute("data-theme", "dark");
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
    await page.getByLabel("Language").selectOption("prs");
    await page.waitForTimeout(300);
    await page.screenshot({ path: "docs/assets/playground-choropleth-dark.png" });

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "networkidle" });
    await page.screenshot({ path: "docs/assets/playground-mobile-light.png" });
  });
});
