import { test, expect } from "@playwright/test";
import { mockUsers, signup } from "./utils";

test.describe("Constat d'état flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("./");
  });

  test("should complete the full constat flow", async ({ page }) => {
    test.setTimeout(60_000);
    // 1. Sign up
    await signup({ page, user: mockUsers[0] });

    // 2. Click "Créer un constat d'état" on home page
    await page.getByText("Créer un constat d'état").click();
    await page.waitForURL((url) => url.pathname.startsWith("/constat/"));

    // ---------------------------------------------------------------------------
    // Step 1: Informations — search and select a Monument Historique
    // ---------------------------------------------------------------------------
    const autocomplete = page.getByLabel("Nom ou référence du monument");
    await autocomplete.waitFor();
    await autocomplete.fill("Château de Test");

    await page.getByRole("option", { name: /Château de Test/ }).click();

    // After selection the autocomplete is replaced by the monument title + "Changer de monument" link
    await page.waitForFunction(() => document.body.innerText.includes("Château de Test"));

    // Navigate to next step
    await page.getByRole("button", { name: "Contexte de la visite" }).click();
    await page.waitForURL((url) => url.search.includes("contexte-visite"));

    // ---------------------------------------------------------------------------
    // Step 2: Contexte de la visite — fill mandatory fields
    // ---------------------------------------------------------------------------
    // Nature de la visite — DSFR hides the radio input behind its label, force required
    await page.locator("input[id=nature-visite-0]").check({ force: true });

    // Date de la visite
    await page.getByLabel("Date de la visite").fill("2024-01-15");

    // Rédacteur du constat
    await page.fill("input[name=redacted_by]", "Agent Test");

    // Propriétaire
    await page.fill("input[name=proprietaire]", "Jean Dupont");

    // Courriel du propriétaire
    await page.fill("input[name=proprietaire_email]", "jean.dupont@example.com");

    // Navigate to Constat détaillé
    await page.getByRole("button", { name: /Constat d'état/ }).click();
    await page.waitForURL((url) => url.search.includes("constat-detaille"));

    // ---------------------------------------------------------------------------
    // Step 3: Constat détaillé — fill one section
    // ---------------------------------------------------------------------------
    // Click the "Couverture" section tile to open the modal
    await page.getByRole("button", { name: "Couverture" }).click();

    const dialog = page.getByRole("dialog");
    await dialog.waitFor();

    // État général de la section — force required for DSFR hidden radio inputs
    await dialog.getByRole("radio", { name: "Bon" }).check({ force: true });

    // Proportion dans cet état
    await dialog.getByRole("radio", { name: "50%" }).check({ force: true });

    // Commentaires
    await dialog.locator("textarea").fill("Bon état général, pas de dégradation visible.");

    // Save and close modal
    await dialog.getByRole("button", { name: "Enregistrer" }).click();
    await dialog.waitFor({ state: "hidden" });

    // Navigate to Constat général
    await page.getByRole("button", { name: "Constat général" }).click();
    await page.waitForURL((url) => url.search.includes("constat-general"));

    // ---------------------------------------------------------------------------
    // Step 4: Constat général — fill mandatory fields and finalize
    // ---------------------------------------------------------------------------
    // État général de l'édifice — force required for DSFR hidden radio inputs
    await page.getByRole("radio", { name: "Bon" }).first().check({ force: true });

    // Proportion dans cet état
    await page.getByRole("radio", { name: "50%" }).first().check({ force: true });

    // Finalize the constat — navigates to /constat/$id/pdf?mode=view
    await page.getByRole("button", { name: "Finaliser le constat" }).click();
    await page.waitForURL((url) => url.pathname.includes("/pdf") && url.search.includes("mode=view"));

    // ---------------------------------------------------------------------------
    // Step 5: PDF preview — click "Continuer" to go to send mode
    // ---------------------------------------------------------------------------
    await page.getByRole("button", { name: "Continuer" }).click();
    await page.waitForURL((url) => url.search.includes("mode=send"));

    // ---------------------------------------------------------------------------
    // Step 6: Send mode — type recipient email and send
    // ---------------------------------------------------------------------------
    // The EmailInput has no label; locate it as the only text input in the banner
    const emailInput = page.locator('input[type="text"]').first();
    await emailInput.waitFor();
    const mailId = new Date().getTime();
    await emailInput.fill(`jean.dupont+${mailId}@example.com`);
    await emailInput.press("Enter");

    // Confirm the tag appeared before submitting
    await page.getByText(`jean.dupont+${mailId}@example.com`).waitFor();

    await page.getByRole("button", { name: "Envoyer" }).click();

    // ---------------------------------------------------------------------------
    // Step 7: Sent confirmation screen
    // ---------------------------------------------------------------------------
    await page.waitForURL((url) => url.search.includes("mode=sent"));
    await expect(page.getByText("Votre constat d'état a bien été envoyé !")).toBeVisible();

    // ---------------------------------------------------------------------------
    // Step 8: Verify the email reached mailpit
    // ---------------------------------------------------------------------------
    const mailpitPort = process.env.MAILPIT_WEB_PORT ?? "3018";
    const mailResponse = await page.request.get(`http://localhost:${mailpitPort}/api/v1/messages`);
    expect(mailResponse.ok()).toBeTruthy();

    const mailData = await mailResponse.json();
    expect(mailData.total).toBeGreaterThan(0);

    const lastMail = mailData.messages[0];
    const recipients: { Address: string }[] = lastMail.To;
    expect(recipients.some((r) => r.Address === `jean.dupont+${mailId}@example.com`)).toBe(true);
  });
});
