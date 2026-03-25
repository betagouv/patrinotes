import { test, expect } from "@playwright/test";
import { mockUsers, signup } from "./utils";
import { resetDatabase } from "./setup";
import { db } from "../packages/backend/src/db/db";
import { v4 } from "uuid";

const mailpitPort = process.env.MAILPIT_WEB_PORT ?? "3018";
const backendPort = process.env.BACKEND_PORT ?? "3011";
const validatorEmail = "validator@example.com";

test.describe("Constat validation flow", () => {
  test.beforeAll(async () => {
    await resetDatabase();
  });

  test("should send validation email and let validator accept the constat", async ({ page, request }) => {
    test.setTimeout(120_000);

    // -------------------------------------------------------------------------
    // 1. Sign up
    // -------------------------------------------------------------------------
    await signup({ page, user: mockUsers[0] });

    // -------------------------------------------------------------------------
    // 2. Enable validation in account page
    // Navigate via the in-app link to avoid a full page reload (auth is saved
    // async to storage; a page.goto would race with that save).
    // -------------------------------------------------------------------------
    await page.locator('a[href="/account"]').first().click();
    await page.waitForURL((url) => url.pathname === "/account");

    // Toggle "Envoyer les constats sous couvert de validation"
    await page.getByLabel("Envoyer les constats sous couvert de validation").check({ force: true });

    // The email input appears — fill it
    await page.getByLabel("Courriel du validateur").fill(validatorEmail);

    // Save — the "4. Validation" section's save button. Disambiguate by targeting
    // the button inside the section (all save buttons share the same text so we
    // use the one that comes after the toggle label in the DOM).
    const validationSaveBtn = page
      .locator("h3#validation")
      .locator("xpath=..")
      .getByRole("button", { name: "Enregistrer" });
    await validationSaveBtn.click();

    // Give PowerSync a moment to flush the write to PostgreSQL
    await page.waitForTimeout(1500);

    // -------------------------------------------------------------------------
    // 3. Complete the constat flow (same as constat.spec.ts)
    // -------------------------------------------------------------------------
    await page.goto("./");
    await page.getByText("Créer un constat d'état").click();
    await page.waitForURL((url) => url.pathname.startsWith("/constat/"));

    // Step 1: Informations
    const autocomplete = page.getByLabel("Nom ou référence du monument");
    await autocomplete.waitFor();
    await autocomplete.fill("Château de Test");
    await page.getByRole("option", { name: /Château de Test/ }).click();
    await page.waitForFunction(() => document.body.innerText.includes("Château de Test"));
    await page.getByRole("button", { name: "Contexte de la visite" }).click();
    await page.waitForURL((url) => url.search.includes("contexte-visite"));

    // Step 2: Contexte de la visite
    await page.locator("input[id=nature-visite-0]").check({ force: true });
    await page.getByLabel("Date de la visite").fill("2024-01-15");
    await page.fill("input[name=redacted_by]", "Agent Test");
    await page.fill("input[name=proprietaire]", "Jean Dupont");
    await page.fill("input[name=proprietaire_email]", "jean.dupont@example.com");
    await page.getByRole("button", { name: /Constat d'état/ }).click();
    await page.waitForURL((url) => url.search.includes("constat-detaille"));

    // Step 3: Constat détaillé
    await page.getByRole("button", { name: "Couverture" }).click();
    const dialog = page.getByRole("dialog");
    await dialog.waitFor();
    await dialog.getByRole("radio", { name: "Bon" }).check({ force: true });
    await dialog.getByRole("radio", { name: "50%" }).check({ force: true });
    await dialog.locator("textarea").fill("Bon état général.");
    await dialog.getByRole("button", { name: "Enregistrer" }).click();
    await dialog.waitFor({ state: "hidden" });
    await page.getByRole("button", { name: "Constat général" }).click();
    await page.waitForURL((url) => url.search.includes("constat-general"));

    // Step 4: Constat général
    await page.getByRole("radio", { name: "Bon" }).first().check({ force: true });
    await page.getByRole("radio", { name: "50%" }).first().check({ force: true });
    await page.getByRole("button", { name: "Finaliser le constat" }).click();
    await page.waitForURL((url) => url.pathname.includes("/pdf") && url.search.includes("mode=view"));

    // Step 5: PDF preview → send mode
    await page.getByRole("button", { name: "Continuer" }).click();
    await page.waitForURL((url) => url.search.includes("mode=send"));

    // -------------------------------------------------------------------------
    // 4. Send — add a recipient email, click Envoyer
    // -------------------------------------------------------------------------
    const mailId = new Date().getTime();
    const recipientEmail = `recipient+${mailId}@example.com`;

    const emailInput = page.locator('input[type="text"]').first();
    await emailInput.waitFor();
    await emailInput.fill(recipientEmail);
    await emailInput.press("Enter");
    await page.getByText(recipientEmail).waitFor();
    await page.getByRole("button", { name: "Envoyer" }).click();

    // -------------------------------------------------------------------------
    // 5. Sent confirmation screen
    // -------------------------------------------------------------------------
    await page.waitForURL((url) => url.search.includes("mode=sent"));
    await expect(
      page.getByText("Votre constat a été transmis pour validation. Il sera envoyé aux destinataires après approbation."),
    ).toBeVisible();

    // 5b. Navigate home and check the list badge shows "En attente de validation"
    await page.getByRole("button", { name: "Accueil" }).click();
    await page.waitForURL((url) => url.pathname === "/");
    await expect(page.getByText("En attente de validation").first()).toBeVisible({ timeout: 15_000 });

    // -------------------------------------------------------------------------
    // 6. Verify the validation email was sent to the validator — NOT the recipient
    // -------------------------------------------------------------------------
    const messagesResp = await request.get(`http://localhost:${mailpitPort}/api/v1/messages`);
    expect(messagesResp.ok()).toBeTruthy();
    const messagesData = await messagesResp.json();

    const validationMail = messagesData.messages.find((m: any) =>
      m.To.some((r: { Address: string }) => r.Address === validatorEmail),
    );
    expect(validationMail, "Validation email should have been sent to the validator").toBeDefined();

    const recipientReceivedMail = messagesData.messages.find((m: any) =>
      m.To.some((r: { Address: string }) => r.Address === recipientEmail),
    );
    expect(recipientReceivedMail, "Recipient should NOT have received the email yet").toBeUndefined();

    // -------------------------------------------------------------------------
    // 7. Extract the magic link from the validation email body
    // -------------------------------------------------------------------------
    const messageResp = await request.get(
      `http://localhost:${mailpitPort}/api/v1/message/${validationMail.ID}`,
    );
    const messageData = await messageResp.json();
    const emailHtml: string = messageData.HTML ?? messageData.Text ?? "";

    const urlMatch = emailHtml.match(/https?:\/\/[^\s"<>]+constat-validation[^\s"<>]+/);
    expect(urlMatch, "Email should contain a validation link").not.toBeNull();
    const validationUrl = urlMatch![0].replace(/&amp;/g, "&");

    // -------------------------------------------------------------------------
    // 8. Open the validation page (no login required)
    // -------------------------------------------------------------------------
    await page.goto(validationUrl);
    await expect(page.getByText(/Validation du constat d'état/)).toBeVisible();
    await expect(page.locator("iframe")).toBeVisible();
    await expect(page.getByRole("button", { name: "Accepter" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Refuser" })).toBeVisible();

    const validationToken = new URL(validationUrl).pathname.split("/").pop()!;
    const pdfResp = await request.get(`http://127.0.0.1:${backendPort}/api/constat-validation/${validationToken}/pdf`);
    expect(pdfResp.ok(), "PDF proxy endpoint should return 200").toBeTruthy();
    const pdfBody = await pdfResp.body();
    expect(pdfBody.length, "PDF should not be empty").toBeGreaterThan(0);

    // -------------------------------------------------------------------------
    // 9. Accept with a comment
    // -------------------------------------------------------------------------
    await page.locator("input[name=comment]").fill("Document conforme, approuvé.");
    await page.getByRole("button", { name: "Accepter" }).click();
    await expect(page.getByText("Constat accepté")).toBeVisible();

    // -------------------------------------------------------------------------
    // 10. Verify the constat email was now sent to the original recipient
    // -------------------------------------------------------------------------
    const finalMessagesResp = await request.get(`http://localhost:${mailpitPort}/api/v1/messages`);
    const finalMessagesData = await finalMessagesResp.json();

    const finalRecipientMail = finalMessagesData.messages.find((m: any) =>
      m.To.some((r: { Address: string }) => r.Address === recipientEmail),
    );
    expect(finalRecipientMail, "Recipient should have received the email after acceptance").toBeDefined();

    // -------------------------------------------------------------------------
    // 11. Verify the creator was notified of the acceptance
    // -------------------------------------------------------------------------
    const creatorNotificationMail = finalMessagesData.messages.find(
      (m: any) =>
        m.To.some((r: { Address: string }) => r.Address === mockUsers[0].email) &&
        m.Subject?.includes("Accepté"),
    );
    expect(creatorNotificationMail, "Creator should have received an acceptance notification").toBeDefined();
  });

  test("should allow validator to decline the constat", async ({ page, request }) => {
    test.setTimeout(120_000);

    // Clear mailpit messages from previous test
    await request.delete(`http://localhost:${mailpitPort}/api/v1/messages`);

    // -------------------------------------------------------------------------
    // Sign up a fresh user (mockUsers[1]) and inject user_settings directly via DB
    // so we don't depend on test 1's state.
    // -------------------------------------------------------------------------
    await signup({ page, user: mockUsers[1] });

    const dbUser = await db
      .selectFrom("user")
      .where("email", "=", mockUsers[1].email)
      .select(["id", "service_id"])
      .executeTakeFirstOrThrow();

    await db
      .insertInto("user_settings")
      .values({
        id: v4(),
        user_id: dbUser.id,
        service_id: dbUser.service_id,
        default_emails: null,
        validation_enabled: true,
        validation_email: validatorEmail,
      })
      .execute();

    // Navigate within the SPA to avoid losing in-memory auth state
    await page.locator('a[href="/"]').first().click();
    await page.waitForURL((url) => url.pathname === "/");
    await page.getByText("Créer un constat d'état").click();
    await page.waitForURL((url) => url.pathname.startsWith("/constat/"));

    const autocomplete = page.getByLabel("Nom ou référence du monument");
    await autocomplete.waitFor();
    await autocomplete.fill("Château de Test");
    await page.getByRole("option", { name: /Château de Test/ }).click();
    await page.waitForFunction(() => document.body.innerText.includes("Château de Test"));
    await page.getByRole("button", { name: "Contexte de la visite" }).click();
    await page.waitForURL((url) => url.search.includes("contexte-visite"));

    await page.locator("input[id=nature-visite-0]").check({ force: true });
    await page.getByLabel("Date de la visite").fill("2024-01-20");
    await page.fill("input[name=redacted_by]", "Agent Test");
    await page.fill("input[name=proprietaire]", "Jean Dupont");
    await page.fill("input[name=proprietaire_email]", "jean.dupont@example.com");
    await page.getByRole("button", { name: /Constat d'état/ }).click();
    await page.waitForURL((url) => url.search.includes("constat-detaille"));

    await page.getByRole("button", { name: "Couverture" }).click();
    const dialog = page.getByRole("dialog");
    await dialog.waitFor();
    await dialog.getByRole("radio", { name: "Bon" }).check({ force: true });
    await dialog.getByRole("radio", { name: "50%" }).check({ force: true });
    await dialog.locator("textarea").fill("Bon état général.");
    await dialog.getByRole("button", { name: "Enregistrer" }).click();
    await dialog.waitFor({ state: "hidden" });
    await page.getByRole("button", { name: "Constat général" }).click();
    await page.waitForURL((url) => url.search.includes("constat-general"));

    await page.getByRole("radio", { name: "Bon" }).first().check({ force: true });
    await page.getByRole("radio", { name: "50%" }).first().check({ force: true });
    await page.getByRole("button", { name: "Finaliser le constat" }).click();
    await page.waitForURL((url) => url.pathname.includes("/pdf") && url.search.includes("mode=view"));

    await page.getByRole("button", { name: "Continuer" }).click();
    await page.waitForURL((url) => url.search.includes("mode=send"));

    const mailId = new Date().getTime();
    const recipientEmail = `recipient+${mailId}@example.com`;
    const emailInput = page.locator('input[type="text"]').first();
    await emailInput.waitFor();
    await emailInput.fill(recipientEmail);
    await emailInput.press("Enter");
    await page.getByText(recipientEmail).waitFor();
    await page.getByRole("button", { name: "Envoyer" }).click();
    await page.waitForURL((url) => url.search.includes("mode=sent"));

    // Check the list badge shows "En attente de validation"
    await page.getByRole("button", { name: "Accueil" }).click();
    await page.waitForURL((url) => url.pathname === "/");
    await expect(page.getByText("En attente de validation").first()).toBeVisible({ timeout: 15_000 });

    // Navigate back to get the validation link
    await page.goBack();
    await page.waitForURL((url) => url.search.includes("mode=sent"));

    // Get validation link
    const messagesResp = await request.get(`http://localhost:${mailpitPort}/api/v1/messages`);
    const messagesData = await messagesResp.json();
    const validationMail = messagesData.messages.find((m: any) =>
      m.To.some((r: { Address: string }) => r.Address === validatorEmail),
    );
    expect(validationMail).toBeDefined();

    const messageResp = await request.get(
      `http://localhost:${mailpitPort}/api/v1/message/${validationMail.ID}`,
    );
    const messageData = await messageResp.json();
    const emailHtml: string = messageData.HTML ?? messageData.Text ?? "";
    const urlMatch = emailHtml.match(/https?:\/\/[^\s"<>]+constat-validation[^\s"<>]+/);
    expect(urlMatch).not.toBeNull();
    const validationUrl = urlMatch![0].replace(/&amp;/g, "&");

    // -------------------------------------------------------------------------
    // Open the validation page and decline
    // -------------------------------------------------------------------------
    await page.goto(validationUrl);
    await expect(page.getByText(/Validation du constat d'état/)).toBeVisible();

    const validationToken = new URL(validationUrl).pathname.split("/").pop()!;
    const pdfResp = await request.get(`http://127.0.0.1:${backendPort}/api/constat-validation/${validationToken}/pdf`);
    expect(pdfResp.ok(), "PDF proxy endpoint should return 200").toBeTruthy();
    const pdfBody = await pdfResp.body();
    expect(pdfBody.length, "PDF should not be empty").toBeGreaterThan(0);

    await page.locator("input[name=comment]").fill("Document incomplet, merci de corriger.");
    await page.getByRole("button", { name: "Refuser" }).click();
    await expect(page.getByText("Constat refusé")).toBeVisible();

    // Recipient should NOT have received the email
    const finalMessagesResp = await request.get(`http://localhost:${mailpitPort}/api/v1/messages`);
    const finalMessagesData = await finalMessagesResp.json();

    const recipientMail = finalMessagesData.messages.find((m: any) =>
      m.To.some((r: { Address: string }) => r.Address === recipientEmail),
    );
    expect(recipientMail, "Recipient should NOT have received the email after decline").toBeUndefined();

    // Creator should have been notified of the refusal
    const creatorDeclineMail = finalMessagesData.messages.find(
      (m: any) =>
        m.To.some((r: { Address: string }) => r.Address === mockUsers[1].email) &&
        m.Subject?.includes("Refusé"),
    );
    expect(creatorDeclineMail, "Creator should have received a decline notification").toBeDefined();
  });
});
