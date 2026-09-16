import { test, expect } from "@playwright/test";
import { mockUsers, signup } from "./utils";
import { resetDatabase } from "./setup";

/**
 * MonumentPickerMap is a MapLibre canvas with dynamically-projected marker
 * pixel positions — there's no stable DOM hook to reliably click a specific
 * marker from Playwright, and doing so via computed screen coordinates is
 * flaky (viewport/projection-dependent). This is a smoke test instead: it
 * verifies the map opens and renders without throwing, which still catches
 * real regressions (e.g. a broken style URL or a JS error in map init)
 * without the flakiness of simulated marker clicks.
 */
test.describe("Monument picker map", () => {
  test.beforeAll(async () => {
    await resetDatabase();
  });

  test("opens and renders without a page error", async ({ page }) => {
    test.setTimeout(60_000);

    const pageErrors: Error[] = [];
    page.on("pageerror", (error) => pageErrors.push(error));

    await page.goto("./");
    await signup({ page, user: mockUsers[0] });

    await page.getByText("Créer un constat d'état").click();
    await page.waitForURL((url) => url.pathname.startsWith("/constat/"));

    await page.getByRole("button", { name: "Choisir sur la carte" }).click();
    await expect(page.locator("canvas.maplibregl-canvas")).toBeVisible({ timeout: 15_000 });

    // Give the map a moment to finish its style/data load cycle
    await page.waitForTimeout(1000);

    await page.getByRole("button", { name: "Fermer la carte" }).click();
    await expect(page.locator("canvas.maplibregl-canvas")).not.toBeVisible();

    expect(pageErrors, `Unexpected page errors: ${pageErrors.map((e) => e.message).join(", ")}`).toHaveLength(0);
  });
});
