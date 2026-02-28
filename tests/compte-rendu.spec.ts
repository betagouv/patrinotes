import { test, expect } from "@playwright/test";
import { mockUsers, signup } from "./utils";
import { resetDatabase } from "./setup";

test.describe("Compte-rendu flow", () => {
  test.beforeAll(async () => {
    await resetDatabase();
  });

  test.beforeEach(async ({ page }) => {
    await page.goto("./");
  });

  test("should complete the full compte-rendu flow", async ({ page }) => {
    test.setTimeout(60_000);
    // 1. Sign up
    await signup({ page, user: mockUsers[0] });

    // 2. Click "Créer un compte-rendu" on home page
    await page.getByText("Créer un compte-rendu").click();
    await page.waitForURL((url) => url.pathname.startsWith("/edit/"));
    await page.waitForResponse((response) => response.url().includes("/upload-data") && response.status() === 200);

    // ---------------------------------------------------------------------------
    // Step 1: RDV — fill mandatory fields
    // ---------------------------------------------------------------------------
    // Nom du demandeur
    await page.fill("input[name=applicantName]", "Marie Dupont");

    // Date du rendez-vous
    await page.getByLabel("Date").fill("2024-03-20");

    // Horaire du rendez-vous
    await page.getByLabel("Horaire").fill("10:30");

    // Navigate to Bilan tab
    await page.getByRole("button", { name: "Rédiger le bilan" }).click();
    await page.waitForURL((url) => url.search.includes("tab=notes"));

    // ---------------------------------------------------------------------------
    // Step 2: Bilan — fill mandatory fields and finalize
    // ---------------------------------------------------------------------------
    // Commentaire
    await page.locator("textarea[id=precisions]").fill("Projet conforme aux prescriptions architecturales.");

    // Submit — navigates to /pdf/$reportId?mode=view
    await page.getByRole("button", { name: "Créer le CR" }).click();
    await page.waitForURL((url) => url.pathname.startsWith("/pdf/") && url.search.includes("mode=view"));

    // ---------------------------------------------------------------------------
    // Step 3: PDF preview — click "Envoyer" to go to send mode
    // ---------------------------------------------------------------------------
    await page.getByRole("button", { name: "Envoyer" }).click();
    await page.waitForURL((url) => url.search.includes("mode=send"));

    // ---------------------------------------------------------------------------
    // Step 4: Send mode — type recipient email and send
    // ---------------------------------------------------------------------------
    // The EmailInput has no label; locate it as the only text input in the banner
    const emailInput = page.locator('input[type="text"]').first();
    await emailInput.waitFor();
    const mailId = new Date().getTime();
    await emailInput.fill(`marie.dupont+${mailId}@example.com`);
    await emailInput.press("Enter");

    // Confirm the tag appeared before submitting
    await page.getByText(`marie.dupont+${mailId}@example.com`).waitFor();

    await page.getByRole("button", { name: "Envoyer" }).click();

    // ---------------------------------------------------------------------------
    // Step 5: Sent confirmation screen
    // ---------------------------------------------------------------------------
    await page.waitForURL((url) => url.search.includes("mode=sent"));
    await expect(page.getByText("Votre compte-rendu a bien été envoyé !")).toBeVisible();

    // ---------------------------------------------------------------------------
    // Step 6: Verify the email reached mailpit
    // ---------------------------------------------------------------------------
    const mailpitPort = process.env.MAILPIT_WEB_PORT ?? "3018";
    const mailResponse = await page.request.get(`http://localhost:${mailpitPort}/api/v1/messages`);
    expect(mailResponse.ok()).toBeTruthy();

    const mailData = await mailResponse.json();
    expect(mailData.total).toBeGreaterThan(0);

    const lastMail = mailData.messages[0];
    const recipients: { Address: string }[] = lastMail.To;
    expect(recipients.some((r) => r.Address === `marie.dupont+${mailId}@example.com`)).toBe(true);
  });
});
