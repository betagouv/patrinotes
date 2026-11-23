import { test, expect, type Page } from "@playwright/test";
import { mockUsers, signup } from "./utils";
import { resetDatabase } from "./setup";

const createReport = async (page: Page) => {
  await page.getByText("Créer un compte-rendu").click();
  await page.waitForURL((url) => url.pathname.startsWith("/edit/"));
};

const isReportUpload = (body: string | null) => {
  try {
    return JSON.parse(body ?? "{}").type === "report";
  } catch {
    return false;
  }
};

test.describe("Déconnexion et écritures non enregistrées", () => {
  test.beforeEach(async ({ page }) => {
    await resetDatabase();
    await page.goto("./");
  });

  test("warns before logging out with changes not sent, refuses offline, then empties the device", async ({
    page,
    context,
  }) => {
    test.setTimeout(60_000);
    await signup({ page, user: mockUsers[0] });

    // the server cannot be reached for uploads: the new compte-rendu stays in the upload queue
    await page.route("**/api/upload-data", (route) => route.abort("internetdisconnected"));
    await createReport(page);

    await page.getByRole("button", { name: "Déconnexion" }).first().click();
    await expect(page.getByText(/pas encore envoyée/)).toBeVisible();
    await page.locator("button", { hasText: "Attendre" }).click();
    await expect(page.getByText(/pas encore envoyée/)).toBeHidden();
    expect(new URL(page.url()).pathname).toMatch(/^\/edit\//);

    await context.setOffline(true);
    await page.getByRole("button", { name: "Déconnexion" }).first().click();
    await expect(
      page.getByText(
        "Vous êtes hors ligne et des modifications ne sont pas encore envoyées. Reconnectez-vous à Internet avant de vous déconnecter.",
      ),
    ).toBeVisible();
    await page
      .locator("button", { hasText: /^Fermer$/ })
      .last()
      .click();
    await context.setOffline(false);

    await page.getByRole("button", { name: "Déconnexion" }).first().click();
    await page.locator("button", { hasText: "Se déconnecter quand même" }).click();
    // the purge ends with a full page load of /connexion (a navigation in progress may be aborted by it)
    await expect(page).toHaveURL(/\/connexion$/, { timeout: 20_000 });
    await expect(page.locator("input[name=email]")).toBeVisible();

    // nothing is left on the device: the session is gone and the next visit asks to sign in again
    const authKeys = await page.evaluate(
      () =>
        new Promise<number>((resolve, reject) => {
          const request = indexedDB.open("auth");
          request.onerror = () => reject(request.error);
          request.onsuccess = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains("access")) return resolve(0);
            const count = db.transaction("access").objectStore("access").count();
            count.onsuccess = () => resolve(count.result);
          };
        }),
    );
    // only the backend url may remain
    expect(authKeys).toBeLessThanOrEqual(1);
    await page.goto("./");
    await expect(page.locator("input[name=email]")).toBeVisible();
  });

  test("shows a write refused by the server until the agent acknowledges it", async ({ page }) => {
    test.setTimeout(60_000);
    await signup({ page, user: mockUsers[0] });

    let refused = false;
    await page.route("**/api/upload-data", async (route) => {
      if (!refused && isReportUpload(route.request().postData())) {
        refused = true;
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ success: false, error: "Forbidden", reason: "droits insuffisants sur report" }),
        });
      }
      return route.continue();
    });
    await createReport(page);

    const banner = page.locator(".fr-alert", { hasText: "pas pu être enregistrée" });
    // the upload may wait for PowerSync's next attempt
    await expect(banner).toContainText("Une modification n'a pas pu être enregistrée.", { timeout: 20_000 });

    await banner.locator("button", { hasText: "Voir le détail" }).click();
    const dialog = page.locator(".MuiDialog-root");
    await expect(dialog).toContainText("Compte rendu");
    await expect(dialog).toContainText("droits insuffisants sur report");

    await dialog.locator("button", { hasText: "J'ai compris" }).click();
    await expect(banner).toBeHidden();

    // the list is stored on the device: acknowledged, it stays empty after a reload
    await page.goto("./");
    await expect(page.getByText("Créer un compte-rendu")).toBeVisible();
    await expect(banner).toBeHidden();
  });
});
