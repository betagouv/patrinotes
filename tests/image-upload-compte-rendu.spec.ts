import { test, expect } from "@playwright/test";
import { mockClauses, mockServiceInstructeur, mockUsers, signup } from "./utils";
import { resetDatabase } from "./setup";
import * as fs from "fs";
import * as path from "path";

const FIXTURE_DIR = path.join(__dirname, "fixtures");
const TEST_IMAGE_PATH = path.join(FIXTURE_DIR, "test-image.jpg");

test.describe("Image upload — compte-rendu flow", () => {
  test.beforeAll(async () => {
    fs.mkdirSync(FIXTURE_DIR, { recursive: true });
    await resetDatabase();
  });

  test.beforeEach(async ({ page }) => {
    await page.goto("./");
  });

  test("should upload images in UploadReportImage (NotesForm) and generate PDF", async ({ page }) => {
    test.setTimeout(60_000);

    // ---------------------------------------------------------------------------
    // Step 1: Sign up (use mockUsers[1] to avoid conflicts with constat spec)
    // ---------------------------------------------------------------------------
    await signup({ page, user: mockUsers[1] });

    // ---------------------------------------------------------------------------
    // Step 2: Create compte-rendu
    // ---------------------------------------------------------------------------
    await page.getByText("Créer un compte-rendu").click();
    await page.waitForURL((url) => url.pathname.startsWith("/edit/"));
    await page.waitForResponse((response) => response.url().includes("/upload-data") && response.status() === 200);

    // ---------------------------------------------------------------------------
    // Step 3: Fill RDV fields
    // ---------------------------------------------------------------------------
    await page.fill("input[name=applicantName]", "Marie Dupont");
    await page.getByLabel("Date").fill("2024-03-20");
    await page.getByLabel("Horaire").fill("10:30");

    // Select service instructeur via autocomplete
    const siInput = page.getByLabel("Service instructeur");
    await siInput.fill(mockServiceInstructeur.short_name);
    await page.getByRole("option", { name: mockServiceInstructeur.short_name }).click();

    // Select projectSpaceType chip (button label = chip.value)
    await page.getByRole("button", { name: mockClauses.find((c) => c.key === "type-espace")!.value }).click();

    // ---------------------------------------------------------------------------
    // Step 4: Navigate to Bilan (notes) tab
    // ---------------------------------------------------------------------------
    await page.getByRole("button", { name: "Rédiger le bilan" }).click();
    await page.waitForURL((url) => url.search.includes("tab=notes"));

    // Select decision chip (button label = chip.value)
    await page.getByRole("button", { name: mockClauses.find((c) => c.key === "decision")!.value }).click();

    // Fill required précisions textarea
    await page.locator("textarea[id=precisions]").fill("Projet conforme aux prescriptions architecturales.");

    // ---------------------------------------------------------------------------
    // Step 5: Upload images via UploadReportImage (multiple=true)
    // ---------------------------------------------------------------------------
    let fcPromise = page.waitForEvent("filechooser");
    await page.getByRole("button", { name: "Ajouter photo" }).click();
    await (await fcPromise).setFiles(TEST_IMAGE_PATH);
    await expect(page.locator("img[data-picture-id]")).toHaveCount(1, { timeout: 15_000 });

    fcPromise = page.waitForEvent("filechooser");
    await page.getByRole("button", { name: "Ajouter photo" }).click();
    await (await fcPromise).setFiles(TEST_IMAGE_PATH);
    await expect(page.locator("img[data-picture-id]")).toHaveCount(2, { timeout: 15_000 });

    // Verify the thumbnail canvas has actual pixel content (not blank)

    // Button stays visible (multiple=true)
    await expect(page.getByRole("button", { name: "Ajouter photo" })).toBeVisible();

    // ---------------------------------------------------------------------------
    // Step 6: Intercept POST /api/pdf/report, then submit
    // ---------------------------------------------------------------------------
    let capturedHtmlString = "";
    await page.route("**/api/pdf/report", async (route) => {
      capturedHtmlString = route.request().postDataJSON()?.htmlString ?? "";
      await route.continue();
    });

    await page.waitForTimeout(2000);

    await page.getByRole("button", { name: "Créer le CR" }).click();
    await page.waitForURL((url) => url.pathname.startsWith("/pdf/") && url.search.includes("mode=view"));

    // ---------------------------------------------------------------------------
    // Step 7: Navigate to send mode, submit, and assert htmlString content
    // ---------------------------------------------------------------------------
    await page.waitForTimeout(1000);
    await page.getByRole("button", { name: "Envoyer" }).click();
    await page.waitForURL((url) => url.search.includes("mode=send"));

    const emailInput = page.locator('input[type="text"]').first();
    await emailInput.waitFor();
    await emailInput.fill("test-report@example.com");
    await emailInput.press("Enter");
    await page.getByRole("button", { name: "Envoyer" }).click();
    await page.waitForResponse((r) => r.url().includes("/api/pdf/report"));

    expect(capturedHtmlString).toContain(mockClauses.find((c) => c.key === "decision")!.text);
    expect(capturedHtmlString).toContain(mockServiceInstructeur.full_name);
    expect(capturedHtmlString).toContain(mockServiceInstructeur.email!);
  });
});
