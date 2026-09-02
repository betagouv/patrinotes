import { test, expect } from "@playwright/test";
import { mockUsers, signup, fillMinimalConstat, finalizeConstat } from "./utils";
import { resetDatabase } from "./setup";

test.describe("Constat d'état flow", () => {
  test.beforeAll(async () => {
    await resetDatabase();
  });

  test.beforeEach(async ({ page }) => {
    await page.goto("./");
  });

  test("should complete the full constat flow", async ({ page }) => {
    test.setTimeout(60_000);
    // 1. Sign up
    await signup({ page, user: mockUsers[0] });

    // 2. Create the constat, select the monument, fill contexte-visite and one section
    await fillMinimalConstat(page);

    // 3. Constat général — fill mandatory fields and finalize (-> /pdf?mode=view)
    await finalizeConstat(page);

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
    const backendPort = process.env.BACKEND_PORT ?? "3011";

    const mailResponse = await page.request.get(`http://localhost:${mailpitPort}/api/v1/messages`);
    expect(mailResponse.ok()).toBeTruthy();

    const mailData = await mailResponse.json();
    expect(mailData.total).toBeGreaterThan(0);

    const lastMail = mailData.messages[0];
    const recipients: { Address: string }[] = lastMail.To;
    expect(recipients.some((r) => r.Address === `jean.dupont+${mailId}@example.com`)).toBe(true);

    // ---------------------------------------------------------------------------
    // Step 9: Verify the email contains an /attachment/ redirect link (not a
    // direct S3 URL), and that following it resolves to the PDF
    // ---------------------------------------------------------------------------
    const messageResp = await page.request.get(`http://localhost:${mailpitPort}/api/v1/message/${lastMail.ID}`);
    const messageData = await messageResp.json();
    const emailHtml: string = messageData.HTML ?? messageData.Text ?? "";

    const linkMatch = emailHtml.match(/href="(https?:\/\/[^"]+\/attachment\/[^"]+)"/);
    expect(linkMatch, "Email should contain an /attachment/ redirect link").not.toBeNull();

    const attachmentUrl = linkMatch![1].replace(/&amp;/g, "&");
    expect(attachmentUrl).toContain(`localhost:${backendPort}/attachment/`);

    // Following the redirect should resolve to the actual PDF
    const pdfResponse = await page.request.get(attachmentUrl);
    expect(pdfResponse.ok(), "Redirect should resolve to the PDF file").toBeTruthy();
  });

  test("sends to multiple recipients at once", async ({ page }) => {
    test.setTimeout(60_000);

    await signup({ page, user: mockUsers[1] });
    await fillMinimalConstat(page);
    await finalizeConstat(page);

    await page.getByRole("button", { name: "Continuer" }).click();
    await page.waitForURL((url) => url.search.includes("mode=send"));

    const mailId = new Date().getTime();
    const emailA = `recipient-a+${mailId}@example.com`;
    const emailB = `recipient-b+${mailId}@example.com`;

    const emailInput = page.locator('input[type="text"]').first();
    await emailInput.waitFor();
    await emailInput.fill(emailA);
    await emailInput.press("Enter");
    await page.getByText(emailA).waitFor();
    await emailInput.fill(emailB);
    await emailInput.press("Enter");
    await page.getByText(emailB).waitFor();

    const mailpitPort = process.env.MAILPIT_WEB_PORT ?? "3018";
    await page.request.delete(`http://localhost:${mailpitPort}/api/v1/messages`);

    await page.getByRole("button", { name: "Envoyer" }).click();
    await page.waitForURL((url) => url.search.includes("mode=sent"));

    const mailResponse = await page.request.get(`http://localhost:${mailpitPort}/api/v1/messages`);
    const mailData = await mailResponse.json();
    expect(mailData.total).toBeGreaterThan(0);

    const recipients: string[] = mailData.messages[0].To.map((r: { Address: string }) => r.Address);
    expect(recipients).toContain(emailA);
    expect(recipients).toContain(emailB);
  });

  test("survives special characters and very long text in comment fields", async ({ page }) => {
    test.setTimeout(60_000);

    const longComment =
      "Commentaire très long ".repeat(80) + "avec des caractères spéciaux: <script>alert('x')</script> & \"quotes\" 'apos' — é à ç ù €";

    await signup({ page, user: mockUsers[2] });
    await fillMinimalConstat(page, { sectionComment: longComment });
    await finalizeConstat(page);

    // PDF preview should render without crashing the app
    await page.getByRole("button", { name: "Continuer" }).click();
    await page.waitForURL((url) => url.search.includes("mode=send"));

    const mailId = new Date().getTime();
    const recipientEmail = `special-chars+${mailId}@example.com`;
    const emailInput = page.locator('input[type="text"]').first();
    await emailInput.waitFor();
    await emailInput.fill(recipientEmail);
    await emailInput.press("Enter");
    await page.getByText(recipientEmail).waitFor();

    await page.getByRole("button", { name: "Envoyer" }).click();
    await page.waitForURL((url) => url.search.includes("mode=sent"));
    await expect(page.getByText("Votre constat d'état a bien été envoyé !")).toBeVisible();
  });
});
