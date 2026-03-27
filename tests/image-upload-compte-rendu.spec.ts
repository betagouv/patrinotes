import { test, expect } from "@playwright/test";
import { mockUsers, signup } from "./utils";
import { resetDatabase } from "./setup";
import * as fs from "fs";
import * as path from "path";

const FIXTURE_DIR = path.join(__dirname, "fixtures");
const TEST_IMAGE_PATH = path.join(FIXTURE_DIR, "test-image.png");

// Minimal 1×1 transparent PNG — valid image that browser-image-compression can process
const MINIMAL_PNG_B64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

test.describe("Image upload — compte-rendu flow", () => {
  test.beforeAll(async () => {
    fs.mkdirSync(FIXTURE_DIR, { recursive: true });
    fs.writeFileSync(TEST_IMAGE_PATH, Buffer.from(MINIMAL_PNG_B64, "base64"));
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

    // ---------------------------------------------------------------------------
    // Step 4: Navigate to Bilan (notes) tab
    // ---------------------------------------------------------------------------
    await page.getByRole("button", { name: "Rédiger le bilan" }).click();
    await page.waitForURL((url) => url.search.includes("tab=notes"));

    // Fill required précisions textarea
    await page.locator("textarea[id=precisions]").fill("Projet conforme aux prescriptions architecturales.");

    // ---------------------------------------------------------------------------
    // Step 5: Upload images via UploadReportImage (multiple=true)
    // ---------------------------------------------------------------------------
    let fcPromise = page.waitForEvent("filechooser");
    await page.getByRole("button", { name: "Ajouter photo" }).click();
    await (await fcPromise).setFiles(TEST_IMAGE_PATH);
    await expect(page.locator("canvas[data-picture-id]")).toHaveCount(1, { timeout: 15_000 });

    fcPromise = page.waitForEvent("filechooser");
    await page.getByRole("button", { name: "Ajouter photo" }).click();
    await (await fcPromise).setFiles(TEST_IMAGE_PATH);
    await expect(page.locator("canvas[data-picture-id]")).toHaveCount(2, { timeout: 15_000 });

    // Verify the thumbnail canvas has actual pixel content (not blank)
    const canvasHasContent = await page.locator("canvas[data-picture-id]").first().evaluate((canvas: HTMLCanvasElement) => {
      const ctx = canvas.getContext("2d");
      if (!ctx || canvas.width === 0 || canvas.height === 0) return false;
      const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < data.length; i += 4) {
        if (data[i] > 0 || data[i + 1] > 0 || data[i + 2] > 0 || data[i + 3] > 0) return true;
      }
      return false;
    });
    expect(canvasHasContent).toBe(true);

    // Button stays visible (multiple=true)
    await expect(page.getByRole("button", { name: "Ajouter photo" })).toBeVisible();

    // ---------------------------------------------------------------------------
    // Step 6: Submit — verify PDF is generated without errors
    // ---------------------------------------------------------------------------
    await page.getByRole("button", { name: "Créer le CR" }).click();
    await page.waitForURL((url) => url.pathname.startsWith("/pdf/") && url.search.includes("mode=view"));
  });
});
