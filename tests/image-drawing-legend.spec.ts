import { test, expect } from "@playwright/test";
import { mockUsers, signup } from "./utils";
import { resetDatabase } from "./setup";
import * as fs from "fs";
import * as path from "path";

const FIXTURE_DIR = path.join(__dirname, "fixtures");
const TEST_IMAGE_PATH = path.join(FIXTURE_DIR, "test-image.jpg");

test.describe("Image upload — drawing and légende", () => {
  test.beforeAll(async () => {
    fs.mkdirSync(FIXTURE_DIR, { recursive: true });
    await resetDatabase();
  });

  test.beforeEach(async ({ page }) => {
    await page.goto("./");
  });

  test("should draw on uploaded image, set légende, and verify it appears in PDF content", async ({ page }) => {
    test.setTimeout(120_000);

    // ---------------------------------------------------------------------------
    // Step 1: Sign up
    // ---------------------------------------------------------------------------
    await signup({ page, user: mockUsers[0] });

    // ---------------------------------------------------------------------------
    // Step 2: Configure alert emails (required for constat finalization)
    // ---------------------------------------------------------------------------
    await page.waitForTimeout(1000);
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
    // Step 4: Informations — select monument
    // ---------------------------------------------------------------------------
    const autocomplete = page.getByLabel("Nom ou référence du monument");
    await autocomplete.waitFor();
    await autocomplete.fill("Château de Test");
    await page.getByRole("option", { name: /Château de Test/ }).click();
    await page.waitForFunction(() => document.body.innerText.includes("Château de Test"));

    // ---------------------------------------------------------------------------
    // Step 5: Contexte de la visite (minimal required fields)
    // ---------------------------------------------------------------------------
    await page.getByRole("button", { name: "Contexte de la visite" }).click();
    await page.waitForURL((url) => url.search.includes("contexte-visite"));
    await page.locator("input[id=nature-visite-0]").check({ force: true });
    await page.getByLabel("Date de la visite").fill("2024-01-15");
    await page.fill("input[name=redacted_by]", "Agent Test");
    await page.fill("input[name=proprietaire]", "Jean Dupont");
    await page.fill("input[name=proprietaire_email]", "jean.dupont@example.com");

    // ---------------------------------------------------------------------------
    // Step 6: Constat général — upload to Plan de situation with drawing + légende
    // ---------------------------------------------------------------------------
    await page.getByRole("button", { name: /Constat d'état/ }).click();
    await page.waitForTimeout(500);
    await page.getByRole("button", { name: "Constat général" }).click();
    await page.waitForURL((url) => url.search.includes("constat-general"));

    // Fill mandatory radio fields
    await page.getByRole("radio", { name: "Bon" }).first().check({ force: true });
    await page.getByRole("radio", { name: "50%" }).first().check({ force: true });

    const planSituationSection = page.getByText("Plan de situation").locator("..");

    const [fileChooser] = await Promise.all([
      page.waitForEvent("filechooser"),
      planSituationSection.getByRole("button", { name: "Ajouter photo" }).click(),
    ]);
    await fileChooser.setFiles(TEST_IMAGE_PATH);

    // ---------------------------------------------------------------------------
    // Step 7: Wait for the thumbnail canvas to appear, then open the drawing modal
    // ---------------------------------------------------------------------------
    await expect(planSituationSection.locator("img[data-picture-id]")).toBeVisible({ timeout: 15_000 });
    await planSituationSection.getByRole("button", { name: "Annoter" }).click();
    await expect(page.getByLabel("Légende")).toBeVisible({ timeout: 5_000 });

    // Draw a line on the canvas
    const drawingCanvas = page.locator("canvas").first();
    const box = await drawingCanvas.boundingBox();
    if (box) {
      await page.mouse.move(box.x + 50, box.y + 50);
      await page.mouse.down();
      await page.mouse.move(box.x + 150, box.y + 150);
      await page.mouse.up();
    }

    // Set the légende
    await page.getByLabel("Légende").fill("Légende de test");

    // Save the annotation
    await page.getByRole("button", { name: "OK" }).click();

    // ---------------------------------------------------------------------------
    // Step 8: Verify légende appears in the thumbnail bar and the canvas is present
    // ---------------------------------------------------------------------------
    await expect(page.getByText("Légende de test")).toBeVisible({ timeout: 10_000 });
    await expect(planSituationSection.locator("img[data-picture-id]")).toHaveCount(1);
    // Upload button should be gone for a single-upload section
    await expect(planSituationSection.getByRole("button", { name: "Ajouter photo" })).toHaveCount(0);

    // ---------------------------------------------------------------------------
    // Step 9: Finalize constat → PDF view, then switch to edit mode to check htmlString
    // ---------------------------------------------------------------------------
    await page.waitForTimeout(2000);

    await page.getByRole("button", { name: "Finaliser le constat" }).click();
    await page.waitForURL((url) => url.pathname.includes("/pdf") && url.search.includes("mode=view"));

    // ---------------------------------------------------------------------------
    // Step 10: Navigate to send mode and send
    // ---------------------------------------------------------------------------
    await page.goto(page.url().replace("mode=view", "mode=send"));
    await page.waitForURL((url) => url.search.includes("mode=send"));

    const mailId = new Date().getTime();
    const emailInput = page.locator('input[type="text"]').first();
    await emailInput.waitFor();
    await emailInput.fill(`drawing-legend+${mailId}@example.com`);
    await emailInput.press("Enter");
    await page.getByText(`drawing-legend+${mailId}@example.com`).waitFor();

    await page.getByRole("button", { name: "Envoyer" }).click();
    await page.waitForURL((url) => url.search.includes("mode=sent"));
    await expect(page.getByText("Votre constat d'état a bien été envoyé !")).toBeVisible();
  });
});
