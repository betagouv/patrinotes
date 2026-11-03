import { test, expect } from "@playwright/test";
import { clearLoginMails, getLoginMail, login, mockServices, mockUsers, signup } from "./utils";
import { resetDatabase } from "./setup";
import { db } from "../packages/backend/src/db/db";

const requestCode = async (page: import("@playwright/test").Page, email: string) => {
  await clearLoginMails(email);
  await page.goto("./connexion");
  await page.fill("input[name=email]", email);
  await page.getByRole("button", { name: "Recevoir un lien de connexion" }).click();
};

test.describe("Auth error paths", () => {
  test.beforeAll(async ({ browser }) => {
    await resetDatabase();

    // Register mockUsers[0] once so the sign-in tests have a real account.
    const context = await browser.newContext();
    const page = await context.newPage();
    await signup({ page, user: mockUsers[0] });
    await context.close();
  });

  test("sign-in with a non-whitelisted email is rejected", async ({ page }) => {
    await requestCode(page, "not-whitelisted@example.com");

    await expect(page.getByText(/n'est pas autorisé à accéder à cette application/)).toBeVisible({
      timeout: 10_000,
    });
    expect(new URL(page.url()).pathname).toBe("/connexion");
    await expect(page.locator("input[name=code]")).toHaveCount(0);
  });

  test("a wrong code shows an error and does not sign in", async ({ page }) => {
    await requestCode(page, mockUsers[0].email);
    await page.waitForSelector("input[name=code]");
    const { code } = await getLoginMail(mockUsers[0].email);

    const wrongCode = code === "000000" ? "111111" : "000000";
    await page.fill("input[name=code]", wrongCode);
    await page.getByRole("button", { name: "Se connecter" }).click();

    await expect(page.getByText("Le lien ou le code est invalide ou a expiré")).toBeVisible({ timeout: 10_000 });
    expect(new URL(page.url()).pathname).toBe("/connexion");
  });

  test("a code stops working after too many wrong attempts", async ({ page }) => {
    await requestCode(page, mockUsers[0].email);
    await page.waitForSelector("input[name=code]");
    const { code } = await getLoginMail(mockUsers[0].email);
    const wrongCode = code === "000000" ? "111111" : "000000";

    for (let attempt = 0; attempt < 5; attempt++) {
      await page.fill("input[name=code]", wrongCode);
      await page.getByRole("button", { name: "Se connecter" }).click();
      await expect(page.getByText("Le lien ou le code est invalide ou a expiré")).toBeVisible();
    }

    // even the right code is refused now
    await page.fill("input[name=code]", code);
    await page.getByRole("button", { name: "Se connecter" }).click();
    await page.waitForTimeout(1_000);
    expect(new URL(page.url()).pathname).toBe("/connexion");
  });

  test("the profile form requires the CGU", async ({ page }) => {
    await requestCode(page, mockUsers[1].email);
    await page.waitForSelector("input[name=code]");
    const { code } = await getLoginMail(mockUsers[1].email);
    await page.fill("input[name=code]", code);
    await page.getByRole("button", { name: "Se connecter" }).click();
    await page.waitForURL((url) => url.pathname === "/inscription");

    await page.fill("input[name=nom]", "Sans");
    await page.fill("input[name=prenom]", "Cgu");
    await page.getByLabel("Fonction").selectOption("Autre...");
    await page.getByLabel("Précisez votre fonction").fill("Testeur");
    await page.selectOption("select[name=service_id]", mockServices[0].id);
    await page.click("button[type=submit]");

    await page.waitForTimeout(1_000);
    expect(new URL(page.url()).pathname).toBe("/inscription");
    const row = await db.selectFrom("user").where("email", "=", mockUsers[1].email).selectAll().executeTakeFirst();
    expect(row).toBeUndefined();
  });

  test("a regular account cannot open the admin page", async ({ page }) => {
    await login({ page, user: mockUsers[0] });

    await page.goto("./admin");
    await expect(page.getByText("Vous n'avez pas les droits pour accéder à cette page.")).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.locator("#whitelist-table")).toHaveCount(0);
  });
});
