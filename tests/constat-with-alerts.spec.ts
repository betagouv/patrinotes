import { test, expect } from "@playwright/test";
import { mockUsers, signup } from "./utils";
import { resetDatabase } from "./setup";
import { db } from "../packages/backend/src/db/db";
import { v4 } from "uuid";

test.describe("Constat with alerts flow", () => {
  test.beforeAll(async () => {
    await resetDatabase();
  });

  test.beforeEach(async ({ page }) => {
    await page.goto("./");
  });

  test("should create constat with alerts and verify emails sent", async ({ page }) => {
    test.setTimeout(90_000);

    // ---------------------------------------------------------------------------
    // Step 1: Sign up
    // ---------------------------------------------------------------------------
    await signup({ page, user: mockUsers[0] });

    // add delay
    // ---------------------------------------------------------------------------
    // Step 2: Configure alert emails on the service page
    // ---------------------------------------------------------------------------
    await page.goto("./service");
    await page.waitForURL((url) => url.pathname === "/service");

    // Scroll to alertes-mh section
    await page.locator("#alertes-mh").scrollIntoViewIfNeeded();

    await page.waitForTimeout(1000);
    await page.getByLabel("Courriel CRMH").fill("crmh-alert@test.com");
    await page.getByLabel("Courriel CAOA").fill("caoa-alert@test.com");
    await page.getByLabel("Courriel UDAP").fill("udap-alert@test.com");
    await page.getByLabel("Courriel SRA").fill("sra-alert@test.com");

    // Save — there are multiple "Enregistrer" buttons on the page; target the one in the Alertes MH form
    // which is the form containing the CRMH input
    const alertesForm = page.locator("form").filter({ has: page.getByLabel("Courriel CRMH") });
    await alertesForm.getByRole("button", { name: "Enregistrer" }).click();

    // Wait a moment for the save to complete
    await page.waitForResponse((response) => response.url().includes("/upload-data") && response.status() === 200);

    // ---------------------------------------------------------------------------
    // Step 3: Create a new constat
    // ---------------------------------------------------------------------------
    await page.goto("./");
    await page.getByText("Créer un constat d'état").click();
    await page.waitForURL((url) => url.pathname.startsWith("/constat/"));

    // ---------------------------------------------------------------------------
    // Step 4: Informations — select monument
    // ---------------------------------------------------------------------------
    const autocomplete = page.getByLabel("Nom ou référence du monument");
    await autocomplete.waitFor();
    await autocomplete.fill("Château de Test");
    await page.getByRole("option", { name: /Château de Test/ }).click();
    await page.waitForFunction(() => document.body.innerText.includes("Château de Test"));

    await page.getByRole("button", { name: "Contexte de la visite" }).click();
    await page.waitForURL((url) => url.search.includes("contexte-visite"));

    // ---------------------------------------------------------------------------
    // Step 5: Contexte de la visite
    // ---------------------------------------------------------------------------
    await page.locator("input[id=nature-visite-0]").check({ force: true });
    await page.getByLabel("Date de la visite").fill("2024-01-15");
    await page.fill("input[name=redacted_by]", "Agent Test");
    await page.fill("input[name=proprietaire]", "Jean Dupont");
    await page.fill("input[name=proprietaire_email]", "jean.dupont@example.com");

    await page.getByRole("button", { name: /Constat d'état/ }).click();
    await page.waitForURL((url) => url.search.includes("constat-detaille"));

    // ---------------------------------------------------------------------------
    // Step 6: Constat détaillé — fill one section
    // ---------------------------------------------------------------------------
    await page.getByRole("button", { name: "Couverture" }).click();

    const sectionDialog = page.getByRole("dialog");
    await sectionDialog.waitFor();
    await sectionDialog.getByRole("radio", { name: "Bon" }).check({ force: true });
    await sectionDialog.getByRole("radio", { name: "50%" }).check({ force: true });
    await sectionDialog.locator("textarea").fill("Bon état général, pas de dégradation visible.");
    await sectionDialog.getByRole("button", { name: "Valider" }).click();
    await sectionDialog.waitFor({ state: "hidden" });

    // ---------------------------------------------------------------------------
    // Step 7: Open Alertes panel
    // ---------------------------------------------------------------------------
    await page.getByRole("button", { name: "Alertes" }).click();

    // Wait for the alerts drawer to open (MuiDrawer-paper is the stable container)
    const drawer = page.locator(".MuiDrawer-paper");
    await drawer.waitFor();
    await expect(drawer.getByText("Alertes")).toBeVisible();

    // ---------------------------------------------------------------------------
    // Alert 1: "Édifice en péril" — minimal (commentaire only)
    // ---------------------------------------------------------------------------
    await drawer.getByRole("button", { name: /Édifice en péril/ }).click();
    await drawer.locator("textarea").waitFor();
    await drawer.locator("textarea").fill("Des fissures importantes sont visibles sur la façade principale.");
    await drawer.getByRole("button", { name: "Valider" }).click();

    // Wait to go back to section list
    await drawer.getByRole("button", { name: /Édifice en péril/ }).waitFor();

    // ---------------------------------------------------------------------------
    // Alert 2: "Abords de l'édifice" — commentaire + extra email
    // ---------------------------------------------------------------------------
    await drawer.getByRole("button", { name: /Abords de l/ }).click();
    await drawer.locator("textarea").waitFor();
    await drawer.locator("textarea").fill("Végétation envahissante menaçant les fondations.");

    // Open email editing mode
    await drawer.getByRole("button", { name: "Modifier" }).click();

    // Add an additional recipient
    await drawer.getByRole("button", { name: /Ajouter un destinataire/ }).click();

    // Fill the last "additional-email" input that appeared
    const additionalEmailInputs = drawer.locator('input[autocomplete^="additional-email"]');
    await additionalEmailInputs.last().fill("extra-alert@test.com");

    // Wait for debounce to flush
    await page.waitForTimeout(700);

    await drawer.getByRole("button", { name: "Valider" }).click();
    await drawer.getByRole("button", { name: /Abords de l/ }).waitFor();

    // ---------------------------------------------------------------------------
    // Alert 3: "Archéologie" — commentaire + should_send OFF
    // ---------------------------------------------------------------------------
    await drawer.getByRole("button", { name: /Archéologie/ }).click();
    await drawer.locator("textarea").waitFor();
    await drawer.locator("textarea").fill("Présence de vestiges archéologiques potentiels.");

    // Toggle "Envoyer par courriel" OFF — it is on by default (checked)
    // DSFR ToggleSwitch renders a hidden checkbox behind a label; use force
    await drawer.locator('input[title="Envoyer par courriel"]').uncheck({ force: true });

    await drawer.getByRole("button", { name: "Valider" }).click();
    await drawer.getByRole("button", { name: /Archéologie/ }).waitFor();

    // ---------------------------------------------------------------------------
    // Alert 4: "Objets et mobiliers" — 2 objects
    // ---------------------------------------------------------------------------
    await drawer.getByRole("button", { name: /Objets et mobiliers/ }).click();

    // Wait for the spinner to disappear (objects are loading)
    await drawer
      .locator('[class*="Spinner"], [aria-label="Chargement"]')
      .waitFor({ state: "hidden" })
      .catch(() => {});
    // Wait for the objet select to appear
    await drawer.getByLabel("Objet ou mobilier concerné").first().waitFor();

    // Object 1: Table de test — Objet absent
    await drawer.getByLabel("Objet ou mobilier concerné").first().selectOption("OBJ00001");
    await drawer.getByRole("radio", { name: "Objet absent" }).first().check({ force: true });
    await drawer.locator("textarea").first().fill("Table absente de son emplacement habituel.");

    // Add second object
    await drawer.getByRole("button", { name: "Ajouter objet ou mobilier" }).click();

    // Wait for the second objet select to appear
    await expect(drawer.getByLabel("Objet ou mobilier concerné")).toHaveCount(2);

    // Object 2: Tableau de test — Dégradation importante
    await drawer.getByLabel("Objet ou mobilier concerné").nth(1).selectOption("OBJ00002");
    await drawer.getByRole("radio", { name: "Dégradation importante" }).last().check({ force: true });
    await drawer.locator("textarea").last().fill("Tableau présentant des traces d'humidité importantes.");

    // Wait for debounce
    await page.waitForTimeout(700);

    // Save and go back to section list
    await drawer.getByRole("button", { name: "Valider" }).click();
    await drawer.getByRole("button", { name: /Objets et mobiliers/ }).waitFor();

    // ---------------------------------------------------------------------------
    // Step 8: Close the alerts drawer
    // ---------------------------------------------------------------------------
    await page.waitForTimeout(500);
    await page.keyboard.press("Escape");
    await drawer.waitFor({ state: "hidden" });

    // ---------------------------------------------------------------------------
    // Step 9: Navigate to Constat général
    // ---------------------------------------------------------------------------
    await page.getByRole("button", { name: "Constat général" }).click();
    await page.waitForURL((url) => url.search.includes("constat-general"));

    await page.getByRole("radio", { name: "Bon" }).first().check({ force: true });
    await page.getByRole("radio", { name: "50%" }).first().check({ force: true });

    // Finalize
    await page.waitForTimeout(1000);
    await page.getByRole("button", { name: "Finaliser le constat" }).click();
    await page.waitForURL((url) => url.pathname.includes("/pdf") && url.search.includes("mode=view"));

    // ---------------------------------------------------------------------------
    // Step 10: PDF preview → send mode → send
    // ---------------------------------------------------------------------------
    await page.getByRole("button", { name: "Continuer" }).click();
    await page.waitForURL((url) => url.search.includes("mode=send"));

    // ---------------------------------------------------------------------------
    // Step 10a: Verify AlertsReminder accordion
    // ---------------------------------------------------------------------------
    // Open the accordion (it lists alerts with should_send=true only)
    await page.getByRole("button", { name: /alerte.*MH signalée/ }).click();

    // Archéologie must NOT appear — should_send was turned off
    await expect(page.getByText("Archéologie")).not.toBeVisible();

    // Édifice en péril must appear with CRMH email
    await expect(page.getByText("Édifice en péril")).toBeVisible();
    // exact: true to avoid collision with "caoa-alert@test.com, crmh-alert@test.com" in the Objets row
    await expect(page.getByText("crmh-alert@test.com", { exact: true })).toBeVisible();

    // Abords de l'édifice must appear with UDAP + extra emails
    await expect(page.getByText(/Abords de l/)).toBeVisible();
    await expect(
      page.getByText(/udap-alert@test\.com.*extra-alert@test\.com|extra-alert@test\.com.*udap-alert@test\.com/),
    ).toBeVisible();

    // Objets et mobiliers must appear with CAOA + CRMH emails
    await expect(page.getByText("Objets ou mobiliers")).toBeVisible();
    await expect(page.getByText(/caoa-alert@test\.com/)).toBeVisible();

    const mailId = new Date().getTime();
    const emailInput = page.locator('input[type="text"]').first();
    await emailInput.waitFor();
    await emailInput.fill(`proprietaire+${mailId}@example.com`);
    await emailInput.press("Enter");
    await page.getByText(`proprietaire+${mailId}@example.com`).waitFor();

    // Clear mailbox before sending so we only see emails from this test run
    const mailpitPortPre = process.env.MAILPIT_WEB_PORT ?? "3018";
    await page.request.delete(`http://localhost:${mailpitPortPre}/api/v1/messages`);

    await page.getByRole("button", { name: "Envoyer" }).click();
    await page.waitForURL((url) => url.search.includes("mode=sent"));
    await expect(page.getByText("Votre constat d'état a bien été envoyé !")).toBeVisible();

    // ---------------------------------------------------------------------------
    // Step 11: Verify emails in Mailpit
    // ---------------------------------------------------------------------------
    const mailpitPort = process.env.MAILPIT_WEB_PORT ?? "3018";
    const resp = await page.request.get(`http://localhost:${mailpitPort}/api/v1/messages`);
    expect(resp.ok()).toBeTruthy();

    const { messages } = await resp.json();
    expect(messages.length).toBeGreaterThan(0);

    const findBySubject = (sub: string) => messages.find((m: any) => (m.Subject as string)?.includes(sub));

    // 1. Main constat email to proprietaire
    const mainMail = messages.find((m: any) =>
      (m.To as { Address: string }[])?.some((t) => t.Address.includes(`proprietaire+${mailId}`)),
    );
    expect(mainMail, "Main constat email should be sent to proprietaire").toBeTruthy();

    // 2. Édifice en péril → crmh-alert@test.com
    const edificeMail = findBySubject("Édifice en péril");
    expect(edificeMail, "Alert email for 'Édifice en péril' should have been sent").toBeTruthy();
    const edificeTos = (edificeMail.To as { Address: string }[]).map((t) => t.Address);
    expect(edificeTos.join(","), "Édifice en péril email should go to crmh-alert@test.com").toContain(
      "crmh-alert@test.com",
    );

    // 3. Abords de l'édifice → udap-alert@test.com + extra-alert@test.com
    const abordsMail = findBySubject("Abords de l");
    expect(abordsMail, "Alert email for 'Abords de l'édifice' should have been sent").toBeTruthy();
    const abordsTos = (abordsMail.To as { Address: string }[]).map((t) => t.Address).join(",");
    expect(abordsTos, "Abords email should go to udap-alert@test.com").toContain("udap-alert@test.com");
    expect(abordsTos, "Abords email should also go to extra-alert@test.com").toContain("extra-alert@test.com");

    // 4. Archéologie → should NOT be sent (should_send was OFF)
    const archaeoMail = findBySubject("Archéologie");
    expect(archaeoMail, "No alert email should be sent for 'Archéologie' (should_send=false)").toBeUndefined();

    // 5. Objets et mobiliers → caoa-alert@test.com and crmh-alert@test.com
    const objetsMail = findBySubject("Objets et mobiliers");
    expect(objetsMail, "Alert email for 'Objets et mobiliers' should have been sent").toBeTruthy();
    const objetsTos = (objetsMail.To as { Address: string }[]).map((t) => t.Address).join(",");
    expect(objetsTos, "Objets email should go to caoa-alert@test.com").toContain("caoa-alert@test.com");
    expect(objetsTos, "Objets email should also go to crmh-alert@test.com").toContain("crmh-alert@test.com");
  });
});

test.describe("Alerts with validation flow", () => {
  const mailpitPort = process.env.MAILPIT_WEB_PORT ?? "3018";
  const validatorEmail = "validator-alerts@example.com";

  test.beforeAll(async () => {
    await resetDatabase();
  });

  test("should send alerts on first submission and not resend after validator refusal", async ({ page, request }) => {
    test.setTimeout(120_000);

    // -------------------------------------------------------------------------
    // 1. Sign up and inject validation settings via DB
    // -------------------------------------------------------------------------
    await page.goto("./");
    await signup({ page, user: mockUsers[2] });

    const dbUser = await db
      .selectFrom("user")
      .where("email", "=", mockUsers[2].email)
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

    // -------------------------------------------------------------------------
    // 2. Configure alert email on the service page
    // -------------------------------------------------------------------------
    await page.goto("./service");
    await page.waitForURL((url) => url.pathname === "/service");
    await page.locator("#alertes-mh").scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await page.getByLabel("Courriel CRMH").fill("crmh-alert-validation@test.com");

    const alertesForm = page.locator("form").filter({ has: page.getByLabel("Courriel CRMH") });
    await alertesForm.getByRole("button", { name: "Enregistrer" }).click();
    await page.waitForResponse((response) => response.url().includes("/upload-data") && response.status() === 200);

    // -------------------------------------------------------------------------
    // 3. Create a constat
    // -------------------------------------------------------------------------
    await page.goto("./");
    await page.getByText("Créer un constat d'état").click();
    await page.waitForURL((url) => url.pathname.startsWith("/constat/"));
    const constatBaseUrl = page.url().split("?")[0];

    const autocomplete = page.getByLabel("Nom ou référence du monument");
    await autocomplete.waitFor();
    await autocomplete.fill("Château de Test");
    await page.getByRole("option", { name: /Château de Test/ }).click();
    await page.waitForFunction(() => document.body.innerText.includes("Château de Test"));
    await page.getByRole("button", { name: "Contexte de la visite" }).click();
    await page.waitForURL((url) => url.search.includes("contexte-visite"));

    await page.locator("input[id=nature-visite-0]").check({ force: true });
    await page.getByLabel("Date de la visite").fill("2024-03-01");
    await page.fill("input[name=redacted_by]", "Agent Test");
    await page.fill("input[name=proprietaire]", "Jean Dupont");
    await page.fill("input[name=proprietaire_email]", "jean.dupont@example.com");
    await page.getByRole("button", { name: /Constat d'état/ }).click();
    await page.waitForURL((url) => url.search.includes("constat-detaille"));

    // Fill one section
    await page.getByRole("button", { name: "Couverture" }).click();
    const sectionDialog = page.getByRole("dialog");
    await sectionDialog.waitFor();
    await sectionDialog.getByRole("radio", { name: "Bon" }).check({ force: true });
    await sectionDialog.getByRole("radio", { name: "50%" }).check({ force: true });
    await sectionDialog.locator("textarea").fill("Bon état général.");
    await sectionDialog.getByRole("button", { name: "Valider" }).click();
    await sectionDialog.waitFor({ state: "hidden" });

    // -------------------------------------------------------------------------
    // 4. Add an alert (Édifice en péril)
    // -------------------------------------------------------------------------
    await page.getByRole("button", { name: "Alertes" }).click();
    const drawer = page.locator(".MuiDrawer-paper");
    await drawer.waitFor();

    await drawer.getByRole("button", { name: /Édifice en péril/ }).click();
    await drawer.locator("textarea").waitFor();
    await drawer.locator("textarea").fill("Fissures importantes sur la façade.");
    await drawer.getByRole("button", { name: "Valider" }).click();
    await drawer.getByRole("button", { name: /Édifice en péril/ }).waitFor();

    await page.waitForTimeout(500);
    await page.keyboard.press("Escape");

    await drawer.waitFor({ state: "hidden" });

    // -------------------------------------------------------------------------
    // 5. Finalize and go to send mode
    // -------------------------------------------------------------------------
    await page.getByRole("button", { name: "Constat général" }).click();
    await page.waitForURL((url) => url.search.includes("constat-general"));
    await page.getByRole("radio", { name: "Bon" }).first().check({ force: true });
    await page.getByRole("radio", { name: "50%" }).first().check({ force: true });
    await page.waitForTimeout(1000);
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

    // Clear mailbox right before sending so we only capture emails from this submission
    await request.delete(`http://localhost:${mailpitPort}/api/v1/messages`);

    await page.getByRole("button", { name: "Envoyer" }).click();
    await page.waitForURL((url) => url.search.includes("mode=sent"));

    // -------------------------------------------------------------------------
    // 6. Verify alert email was sent on first submission (even with validation)
    // -------------------------------------------------------------------------
    const firstSubmitMessages = await (await request.get(`http://localhost:${mailpitPort}/api/v1/messages`)).json();

    const alertMailFirst = firstSubmitMessages.messages.find((m: any) =>
      (m.Subject as string)?.includes("Édifice en péril"),
    );
    expect(
      alertMailFirst,
      "Alert email should be sent immediately on first submission, before validator acts",
    ).toBeDefined();

    // Constat email should NOT have reached the recipient yet (pending validation)
    const recipientMailFirst = firstSubmitMessages.messages.find((m: any) =>
      m.To.some((r: { Address: string }) => r.Address === recipientEmail),
    );
    expect(recipientMailFirst, "Constat email should not reach recipient until validator approves").toBeUndefined();

    // -------------------------------------------------------------------------
    // 7. Validator declines via API (avoids page navigation that would break auth)
    // -------------------------------------------------------------------------
    const validationMail = firstSubmitMessages.messages.find((m: any) =>
      m.To.some((r: { Address: string }) => r.Address === validatorEmail),
    );
    expect(validationMail, "Validation email should have been sent to the validator").toBeDefined();

    const messageResp = await request.get(`http://localhost:${mailpitPort}/api/v1/message/${validationMail.ID}`);
    const messageData = await messageResp.json();
    const emailHtml: string = messageData.HTML ?? messageData.Text ?? "";
    const urlMatch = emailHtml.match(/https?:\/\/[^\s"<>]+constat-validation\/([^/\s"<>?]+)/);
    expect(urlMatch, "Validation email should contain a validation link").not.toBeNull();
    const validationToken = urlMatch![1];

    const backendPort = process.env.BACKEND_PORT ?? "3011";
    const declineResp = await request.post(
      `http://localhost:${backendPort}/api/constat-validation/${validationToken}/decline`,
      { data: { comment: "Document à corriger." } },
    );
    expect(declineResp.ok(), "Decline API call should succeed").toBeTruthy();

    // -------------------------------------------------------------------------
    // 8. Clear mailbox and user re-submits (page is still on the main app)
    // -------------------------------------------------------------------------
    await request.delete(`http://localhost:${mailpitPort}/api/v1/messages`);

    // Navigate to constat-general directly (reference_pop exists → home list also lands here)
    await page.goto(`${constatBaseUrl}?step=constat-general&mode=view`);
    await page.waitForURL((url) => url.search.includes("constat-general"));
    await page.waitForTimeout(1000);

    await page.getByRole("button", { name: "Finaliser le constat" }).click();
    await page.waitForURL((url) => url.pathname.includes("/pdf") && url.search.includes("mode=view"));
    await page.getByRole("button", { name: "Continuer" }).click();
    await page.waitForURL((url) => url.search.includes("mode=send"));

    const emailInput2 = page.locator('input[type="text"]').first();
    await emailInput2.waitFor();
    await emailInput2.fill(recipientEmail);
    await emailInput2.press("Enter");
    await page.getByText(recipientEmail).waitFor();

    await page.getByRole("button", { name: "Envoyer" }).click();
    await page.waitForURL((url) => url.search.includes("mode=sent"));

    // -------------------------------------------------------------------------
    // 9. Verify alert was NOT resent on the second submission
    // -------------------------------------------------------------------------
    const secondSubmitMessages = await (await request.get(`http://localhost:${mailpitPort}/api/v1/messages`)).json();

    const alertMailSecond = secondSubmitMessages.messages?.find((m: any) =>
      (m.Subject as string)?.includes("Édifice en péril"),
    );
    expect(
      alertMailSecond,
      "Alert email should NOT be resent on re-submission after validator refusal",
    ).toBeUndefined();

    // Validation email should have been sent again (new validation cycle)
    const validationMailSecond = secondSubmitMessages.messages?.find((m: any) =>
      m.To.some((r: { Address: string }) => r.Address === validatorEmail),
    );
    expect(
      validationMailSecond,
      "A new validation email should be sent to the validator on re-submission",
    ).toBeDefined();
  });
});
