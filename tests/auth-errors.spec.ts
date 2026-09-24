import { test, expect } from "@playwright/test";
import { mockUsers, mockServices, signup, login } from "./utils";
import { resetDatabase } from "./setup";
import { db } from "../packages/backend/src/db/db";

const MAILPIT_WEB_PORT = process.env.MAILPIT_WEB_PORT ?? "3018";

test.describe("Auth error paths", () => {
  test.beforeAll(async ({ browser }) => {
    await resetDatabase();

    // Register mockUsers[0] once so the duplicate-email and wrong-password
    // tests have a real account to collide/authenticate against.
    const context = await browser.newContext();
    const page = await context.newPage();
    await signup({ page, user: mockUsers[0] });
    await context.close();
  });

  test.beforeEach(async ({ page }) => {
    await page.goto("./");
  });

  test("signup with a non-whitelisted email is rejected", async ({ page }) => {
    await page.goto("./inscription");

    await page.fill("input[name=nom]", "Intrus");
    await page.fill("input[name=prenom]", "Test");
    await page.fill("input[name=email]", "not-whitelisted@example.com");
    await page.fill("input[name=password]", "Password123!");
    await page.getByLabel("Fonction").selectOption("Autre...");
    await page.getByLabel("Précisez votre fonction").fill("Testeur");
    await page.selectOption("select[name=service_id]", mockServices[0].id);
    await page.check("input[name=cgu]", { force: true });
    await page.click("button[type=submit]");

    await expect(page.getByText(/n'est pas autorisé à accéder à cette application/)).toBeVisible({
      timeout: 10_000,
    });
    // Should stay on the signup page, not be logged in
    expect(new URL(page.url()).pathname).toBe("/inscription");
  });

  test("signup with an already-registered email surfaces an error", async ({ page }) => {
    // mockUsers[0] was registered in beforeAll — Keycloak rejects the duplicate
    // username/email, which authService.createUser re-throws as an AppError
    // surfaced in the SignupForm's mutation alert.
    await page.goto("./inscription");

    await page.fill("input[name=nom]", "Autre");
    await page.fill("input[name=prenom]", "Nom");
    await page.fill("input[name=email]", mockUsers[0].email);
    await page.fill("input[name=password]", "Password123!");
    await page.getByLabel("Fonction").selectOption("Autre...");
    await page.getByLabel("Précisez votre fonction").fill("Testeur");
    await page.selectOption("select[name=service_id]", mockServices[0].id);
    await page.check("input[name=cgu]", { force: true });
    await page.click("button[type=submit]");

    await expect(page.locator(".fr-alert--error, [class*='MuiAlert-standardError']")).toBeVisible({
      timeout: 10_000,
    });
    expect(new URL(page.url()).pathname).toBe("/inscription");
  });

  test("signup with a weak password is blocked client-side", async ({ page }) => {
    await page.goto("./inscription");

    await page.fill("input[name=nom]", "Faible");
    await page.fill("input[name=prenom]", "Motdepasse");
    await page.fill("input[name=email]", "weak-password@example.com");
    await page.fill("input[name=password]", "abc");
    await page.getByLabel("Fonction").selectOption("Autre...");
    await page.getByLabel("Précisez votre fonction").fill("Testeur");
    await page.selectOption("select[name=service_id]", mockServices[0].id);
    await page.check("input[name=cgu]", { force: true });
    await page.click("button[type=submit]");

    // SignupPasswordInput replaces the raw validation message with a live requirements
    // checklist (chiffre / majuscule / minuscule / caractère spécial) once the field is
    // invalid — assert that checklist appears rather than a specific error string.
    await expect(page.getByText("Un chiffre")).toBeVisible();
    await expect(page.getByText("Une majuscule")).toBeVisible();
    expect(new URL(page.url()).pathname).toBe("/inscription");

    // Should never have reached the backend / been registered — email isn't even whitelisted
    const row = await db
      .selectFrom("user")
      .where("email", "=", "weak-password@example.com")
      .selectAll()
      .executeTakeFirst();
    expect(row).toBeUndefined();
  });

  test("login with the wrong password shows an error and does not navigate", async ({ page }) => {
    await page.goto("./connexion");

    await page.fill("input[name=email]", mockUsers[0].email);
    await page.fill("input[name=password]", "definitely-wrong-password");
    await page.click("button[type=submit]");

    await expect(page.locator(".fr-alert--error, [class*='MuiAlert-standardError']")).toBeVisible({
      timeout: 10_000,
    });
    expect(new URL(page.url()).pathname).toBe("/connexion");
  });

  test("password reset: request link, use it, log in with the new password, then confirm the account still isn't admin", async ({
    page,
    request,
  }) => {
    test.setTimeout(60_000);

    // Sign up a dedicated user for this flow (mockUsers[1] is untouched so far)
    await signup({ page, user: mockUsers[1] });

    // Log out through the real UI flow — auth is persisted in IndexedDB (idb-keyval),
    // not localStorage, so clearing browser storage directly wouldn't actually end the
    // session.
    await page.getByRole("button", { name: "Déconnexion" }).click();
    await page.waitForURL((url) => url.pathname === "/connexion");

    await request.delete(`http://localhost:${MAILPIT_WEB_PORT}/api/v1/messages`);

    await page.goto("./reset-password");
    await page.getByLabel("Courriel").fill(mockUsers[1].email);
    await page.getByRole("button", { name: "Valider" }).click();
    await expect(page.locator("[class*='MuiAlert-standardSuccess'], .fr-alert--success")).toBeVisible({
      timeout: 10_000,
    });

    const messagesResp = await request.get(`http://localhost:${MAILPIT_WEB_PORT}/api/v1/messages`);
    const { messages } = await messagesResp.json();
    const resetMail = messages.find((m: any) => (m.Subject as string)?.includes("Réinitialisation de mot de passe"));
    expect(resetMail, "Password reset email should have been sent").toBeTruthy();

    const messageResp = await request.get(`http://localhost:${MAILPIT_WEB_PORT}/api/v1/message/${resetMail.ID}`);
    const messageData = await messageResp.json();
    const emailHtml: string = messageData.HTML ?? messageData.Text ?? "";
    const linkMatch = emailHtml.match(/\/reset-password\/[0-9a-fA-F-]+/);
    expect(linkMatch, "Reset email should contain a reset link with a token").not.toBeNull();
    const resetLink = linkMatch![0];

    const newPassword = "NewPassword123!";
    await page.goto(`.${resetLink}`);
    await page.getByRole("textbox", { name: "Mot de passe" }).fill(newPassword);
    await page.getByRole("button", { name: "Valider" }).click();
    await expect(page.locator("[class*='MuiAlert-standardSuccess'], .fr-alert--success")).toBeVisible({
      timeout: 10_000,
    });

    // Log in with the new password
    await login({ page, user: { ...mockUsers[1], password: newPassword } });
    expect(new URL(page.url()).pathname).toBe("/");

    // This user is a regular (non-admin) account — visiting /admin should be
    // blocked with an access-denied message, not the admin panel itself.
    await page.goto("./admin");
    await expect(page.getByText("Vous n'avez pas les droits pour accéder à cette page.")).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.locator("#whitelist-table")).toHaveCount(0);
  });
});
