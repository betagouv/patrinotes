import { test, expect } from "@playwright/test";
import { mockUsers, signup } from "./utils";
import { resetDatabase } from "./setup";
import * as fs from "fs";
import * as path from "path";

const FIXTURE_DIR = path.join(__dirname, "fixtures");
const TEST_IMAGE_PATH = path.join(FIXTURE_DIR, "test-image.jpg");

test.describe("Image upload — constat flow", () => {
  test.beforeAll(async () => {
    fs.mkdirSync(FIXTURE_DIR, { recursive: true });
    await resetDatabase();
  });

  test.beforeEach(async ({ page }) => {
    await page.goto("./");
  });

  test("should upload images in all constat locations and generate PDF", async ({ page }) => {
    test.setTimeout(120_000);

    // ---------------------------------------------------------------------------
    // Step 1: Sign up
    // ---------------------------------------------------------------------------
    await signup({ page, user: mockUsers[0] });

    // ---------------------------------------------------------------------------
    // Step 2: Configure alert emails on the service page (required for alerts drawer)
    // ---------------------------------------------------------------------------
    await page.waitForTimeout(1000); // wait for potential pending operations from signup to finish
    await page.goto("./service");
    await page.waitForURL((url) => url.pathname === "/service");
    await page.locator("#alertes-mh").scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await page.getByLabel("Courriel CRMH").fill("crmh-alert@test.com");
    await page.getByLabel("Courriel CAOA").fill("caoa-alert@test.com");
    await page.getByLabel("Courriel UDAP").fill("udap-alert@test.com");
    await page.getByLabel("Courriel SRA").fill("sra-alert@test.com");
    const alertesForm = page.locator("form").filter({ has: page.getByLabel("Courriel CRMH") });
    await alertesForm.getByRole("button", { name: "Enregistrer" }).click();
    await page.waitForResponse((response) => response.url().includes("/upload-data") && response.status() === 200);

    // ---------------------------------------------------------------------------
    // Step 3: Create constat
    // ---------------------------------------------------------------------------
    await page.goto("./");
    await page.getByText("Créer un constat d'état").click();
    await page.waitForURL((url) => url.pathname.startsWith("/constat/"));

    // ---------------------------------------------------------------------------
    // Step 3: Informations — select monument
    // ---------------------------------------------------------------------------
    const autocomplete = page.getByLabel("Nom ou référence du monument");
    await autocomplete.waitFor();
    await autocomplete.fill("Château de Test");
    await page.getByRole("option", { name: /Château de Test/ }).click();
    await page.waitForFunction(() => document.body.innerText.includes("Château de Test"));

    // ---------------------------------------------------------------------------
    // Step 4: Contexte de la visite
    // ---------------------------------------------------------------------------
    await page.getByRole("button", { name: "Contexte de la visite" }).click();
    await page.waitForURL((url) => url.search.includes("contexte-visite"));

    await page.locator("input[id=nature-visite-0]").check({ force: true });
    await page.getByLabel("Date de la visite").fill("2024-01-15");
    await page.fill("input[name=redacted_by]", "Agent Test");
    await page.fill("input[name=proprietaire]", "Jean Dupont");
    await page.fill("input[name=proprietaire_email]", "jean.dupont@example.com");

    // ---------------------------------------------------------------------------
    // Step 5: Constat détaillé — upload in SectionImageUpload (Dialog)
    // ---------------------------------------------------------------------------
    await page.getByRole("button", { name: /Constat d'état/ }).click();
    await page.waitForURL((url) => url.search.includes("constat-detaille"));

    await page.getByRole("button", { name: "Couverture" }).click();
    const dialog = page.getByRole("dialog");
    await dialog.waitFor();

    await dialog.getByRole("radio", { name: "Bon" }).check({ force: true });
    await dialog.getByRole("radio", { name: "50%" }).check({ force: true });

    // Upload image 1
    let fcPromise = page.waitForEvent("filechooser");
    await dialog.getByRole("button", { name: "Ajouter photo" }).click();
    await (await fcPromise).setFiles(TEST_IMAGE_PATH);
    await expect(dialog.locator("canvas[data-picture-id]")).toHaveCount(1, { timeout: 15_000 });

    // Upload image 2
    fcPromise = page.waitForEvent("filechooser");
    await dialog.getByRole("button", { name: "Ajouter photo" }).click();
    await (await fcPromise).setFiles(TEST_IMAGE_PATH);
    await expect(dialog.locator("canvas[data-picture-id]")).toHaveCount(2, { timeout: 15_000 });

    // Verify the uploaded image has actual pixel content (not blank)
    const imgHasContent = await dialog
      .locator("canvas[data-picture-id]")
      .first()
      .evaluate((canvas: HTMLCanvasElement) => {
        if (canvas.width === 0 || canvas.height === 0) return false;
        const ctx = canvas.getContext("2d");
        if (!ctx) return false;
        const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < data.length; i += 4) {
          if (data[i] > 0 || data[i + 1] > 0 || data[i + 2] > 0 || data[i + 3] > 0) return true;
        }
        return false;
      });
    expect(imgHasContent).toBe(true);

    // Button stays visible (multiple=true)
    await expect(dialog.getByRole("button", { name: "Ajouter photo" })).toBeVisible();

    await dialog.getByRole("button", { name: "Enregistrer" }).click();
    await dialog.waitFor({ state: "hidden" });

    // ---------------------------------------------------------------------------
    // Step 6: Open Alertes drawer — upload in SectionPhotos
    // ---------------------------------------------------------------------------
    await page.getByRole("button", { name: "Alertes" }).click();
    const drawer = page.locator(".MuiDrawer-paper");
    await drawer.waitFor();
    await expect(drawer.getByText("Alertes")).toBeVisible();

    await drawer.getByRole("button", { name: /Édifice en péril/ }).click();
    await drawer.locator("textarea").waitFor();
    await drawer.locator("textarea").fill("Fissures importantes sur la façade.");

    // SectionPhotos is rendered below the commentaires textarea — scroll button into view
    const addPhotoBtn = drawer.getByRole("button", { name: "Ajouter photo" });
    await addPhotoBtn.scrollIntoViewIfNeeded();

    fcPromise = page.waitForEvent("filechooser");
    await addPhotoBtn.click();
    await (await fcPromise).setFiles(TEST_IMAGE_PATH);
    await expect(drawer.locator("canvas[data-picture-id]")).toHaveCount(1, { timeout: 15_000 });

    await drawer.getByRole("button", { name: "Enregistrer" }).click();
    await drawer.getByRole("button", { name: /Édifice en péril/ }).waitFor();

    // Close drawer
    await page.waitForTimeout(500);
    await page.keyboard.press("Escape");
    await drawer.waitFor({ state: "hidden" });

    // ---------------------------------------------------------------------------
    // Step 7: Constat général — upload PlanSituation, PlanEdifice, VuesGenerales
    // ---------------------------------------------------------------------------
    await page.getByRole("button", { name: "Constat général" }).click();
    await page.waitForURL((url) => url.search.includes("constat-general"));

    // Mandatory fields
    await page.getByRole("radio", { name: "Bon" }).first().check({ force: true });
    await page.getByRole("radio", { name: "50%" }).first().check({ force: true });

    // Scope each upload section by its label text → parent Box
    const planSituationSection = page.getByText("Plan de situation").locator("..");
    const planEdificeSection = page.getByText("Plan de l'édifice").locator("..");
    const vuesGeneralesSection = page.getByText("Vues générales de l'édifice").locator("..");

    // ---- PlanSituation (multiple=false) ----
    fcPromise = page.waitForEvent("filechooser");
    await planSituationSection.getByRole("button", { name: "Ajouter photo" }).click();
    await (await fcPromise).setFiles(TEST_IMAGE_PATH);
    await expect(planSituationSection.locator("canvas[data-picture-id]")).toHaveCount(1, { timeout: 15_000 });
    // Button disappears after single upload
    await expect(planSituationSection.getByRole("button", { name: "Ajouter photo" })).toHaveCount(0);

    // ---- PlanEdifice (multiple=false) ----
    fcPromise = page.waitForEvent("filechooser");
    await planEdificeSection.getByRole("button", { name: "Ajouter photo" }).click();
    await (await fcPromise).setFiles(TEST_IMAGE_PATH);
    await expect(planEdificeSection.locator("canvas[data-picture-id]")).toHaveCount(1, { timeout: 15_000 });
    await expect(planEdificeSection.getByRole("button", { name: "Ajouter photo" })).toHaveCount(0);

    // ---- VuesGenerales (multiple=true) ----
    fcPromise = page.waitForEvent("filechooser");
    await vuesGeneralesSection.getByRole("button", { name: "Ajouter photo" }).click();
    await (await fcPromise).setFiles(TEST_IMAGE_PATH);
    await expect(vuesGeneralesSection.locator("canvas[data-picture-id]")).toHaveCount(1, { timeout: 15_000 });

    fcPromise = page.waitForEvent("filechooser");
    await vuesGeneralesSection.getByRole("button", { name: "Ajouter photo" }).click();
    await (await fcPromise).setFiles(TEST_IMAGE_PATH);
    await expect(vuesGeneralesSection.locator("canvas[data-picture-id]")).toHaveCount(2, { timeout: 15_000 });

    // Button stays visible (multiple=true)
    await expect(vuesGeneralesSection.getByRole("button", { name: "Ajouter photo" })).toBeVisible();

    // ---------------------------------------------------------------------------
    // Step 8: Finalize constat → PDF view → send
    // ---------------------------------------------------------------------------
    await page.getByRole("button", { name: "Finaliser le constat" }).click();
    await page.waitForURL((url) => url.pathname.includes("/pdf") && url.search.includes("mode=view"));

    await page.getByRole("button", { name: "Continuer" }).click();
    await page.waitForURL((url) => url.search.includes("mode=send"));

    const mailId = new Date().getTime();
    const emailInput = page.locator('input[type="text"]').first();
    await emailInput.waitFor();
    await emailInput.fill(`image-constat+${mailId}@example.com`);
    await emailInput.press("Enter");
    await page.getByText(`image-constat+${mailId}@example.com`).waitFor();

    const mailpitPort = process.env.MAILPIT_WEB_PORT ?? "3018";
    await page.request.delete(`http://localhost:${mailpitPort}/api/v1/messages`);

    await page.getByRole("button", { name: "Envoyer" }).click();
    await page.waitForURL((url) => url.search.includes("mode=sent"));
    await expect(page.getByText("Votre constat d'état a bien été envoyé !")).toBeVisible();

    // ---------------------------------------------------------------------------
    // Step 9: Verify email reached Mailpit
    // ---------------------------------------------------------------------------
    const mailResponse = await page.request.get(`http://localhost:${mailpitPort}/api/v1/messages`);
    expect(mailResponse.ok()).toBeTruthy();
    const { messages } = await mailResponse.json();
    const sentMail = messages.find((m: any) =>
      (m.To as { Address: string }[])?.some((t) => t.Address.includes(`image-constat+${mailId}`)),
    );
    expect(sentMail, "Email with constat PDF should be received in Mailpit").toBeTruthy();
  });
});
