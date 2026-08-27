import { test, expect } from "@playwright/test";
import { mockClauses, mockServiceInstructeur, mockUsers, signup } from "./utils";
import { resetDatabase } from "./setup";
import * as fs from "fs";
import * as path from "path";

const FIXTURE_DIR = path.join(__dirname, "fixtures");
const TEST_IMAGE_PATH = path.join(FIXTURE_DIR, "test-image.jpg");
const NON_IMAGE_PATH = path.join(FIXTURE_DIR, "not-an-image.txt");
const BACKEND_URL = `http://localhost:${process.env.BACKEND_PORT}`;

test.describe("Upload robustness", () => {
  test.beforeAll(async () => {
    fs.mkdirSync(FIXTURE_DIR, { recursive: true });
    fs.writeFileSync(NON_IMAGE_PATH, "this is definitely not an image");
    await resetDatabase();
  });

  test.beforeEach(async ({ page }) => {
    await page.goto("./");
  });

  const createCompteRendu = async (page: import("@playwright/test").Page) => {
    await page.getByText("Créer un compte-rendu").click();
    await page.waitForURL((url) => url.pathname.startsWith("/edit/"));
    await page.waitForResponse((response) => response.url().includes("/upload-data") && response.status() === 200);

    await page.fill("input[name=applicantName]", "Marie Dupont");
    await page.getByLabel("Date").fill("2024-03-20");
    await page.getByLabel("Horaire").fill("10:30");

    const siInput = page.getByLabel("Service instructeur");
    await siInput.fill(mockServiceInstructeur.short_name);
    await page.getByRole("option", { name: mockServiceInstructeur.short_name }).click();
    await page.getByRole("button", { name: mockClauses.find((c) => c.key === "type-espace")!.value }).click();

    // The photo upload button ("Ajouter photo") lives on the Bilan tab, not RDV
    await page.getByRole("button", { name: "Rédiger le bilan" }).click();
    await page.waitForURL((url) => url.search.includes("tab=notes"));
    await page.getByRole("button", { name: mockClauses.find((c) => c.key === "decision")!.value }).click();
    await page.locator("textarea[id=precisions]").fill("Test upload robustness.");
  };

  test("uploading a non-image file surfaces a visible error instead of failing silently", async ({ page }) => {
    test.setTimeout(60_000);

    await signup({ page, user: mockUsers[0] });
    await createCompteRendu(page);

    const fcPromise = page.waitForEvent("filechooser");
    await page.getByRole("button", { name: "Ajouter photo" }).click();
    await (await fcPromise).setFiles(NON_IMAGE_PATH);

    // A visible error message with a retry action should appear — not a thumbnail
    // stuck pending forever with no explanation.
    await expect(page.getByText(/n'est pas une image valide|Impossible d'envoyer cette photo/)).toBeVisible({
      timeout: 15_000,
    });
    const retryButton = page.getByRole("button", { name: "Réessayer" });
    await expect(retryButton).toBeVisible();

    // Retrying a permanently-invalid file should not crash the app — it re-fails visibly.
    await retryButton.click();
    await expect(page.getByText(/n'est pas une image valide|Impossible d'envoyer cette photo/)).toBeVisible({
      timeout: 15_000,
    });
  });

  test("deleting an uploaded photo removes it from the UI", async ({ page }) => {
    test.setTimeout(60_000);

    await signup({ page, user: mockUsers[1] });
    await createCompteRendu(page);

    const fcPromise = page.waitForEvent("filechooser");
    await page.getByRole("button", { name: "Ajouter photo" }).click();
    await (await fcPromise).setFiles(TEST_IMAGE_PATH);
    await expect(page.locator("img[data-picture-id]")).toHaveCount(1, { timeout: 15_000 });

    await page.getByRole("button", { name: "Supprimer la photo" }).first().click();
    await expect(page.locator("img[data-picture-id]")).toHaveCount(0, { timeout: 15_000 });
  });

  test("GET /api/attachment and /api/attachment/size round-trip a real upload and 404 on unknown paths", async ({
    request,
  }) => {
    await request.post(`${BACKEND_URL}/api/create-user`, {
      data: {
        name: "Upload Tester",
        email: mockUsers[2].email,
        password: mockUsers[2].password,
        job: "Testeur",
        service_id: "service-1",
        newsletter: false,
        cgu: true,
      },
    });

    const loginResp = await request.post(`${BACKEND_URL}/api/login-user`, {
      data: { email: mockUsers[2].email, password: mockUsers[2].password },
    });
    const { accessToken } = (await loginResp.json()) as { accessToken: string };
    const headers = { Authorization: `Bearer ${accessToken}` };

    const filePath = `test-upload-errors/${Date.now()}.txt`;
    const content = "hello attachment round-trip";

    const presignedResp = await request.get(`${BACKEND_URL}/api/upload/attachment/presigned-url`, {
      headers,
      params: { filePath },
    });
    expect(presignedResp.ok()).toBeTruthy();
    const { url } = await presignedResp.json();

    const putResp = await request.put(url, { data: content });
    expect(putResp.ok()).toBeTruthy();

    const sizeResp = await request.get(`${BACKEND_URL}/api/upload/attachment/size`, { headers, params: { filePath } });
    expect(sizeResp.ok()).toBeTruthy();
    const { size } = await sizeResp.json();
    expect(size).toBe(Buffer.byteLength(content));

    const getResp = await request.get(`${BACKEND_URL}/api/upload/attachment`, { headers, params: { filePath } });
    expect(getResp.ok()).toBeTruthy();
    expect(await getResp.text()).toBe(content);

    const unknownPath = `test-upload-errors/does-not-exist-${Date.now()}.txt`;
    const missingGetResp = await request.get(`${BACKEND_URL}/api/upload/attachment`, { headers, params: { filePath: unknownPath } });
    expect(missingGetResp.status()).toBe(404);

    const missingSizeResp = await request.get(`${BACKEND_URL}/api/upload/attachment/size`, {
      headers,
      params: { filePath: unknownPath },
    });
    expect(missingSizeResp.status()).toBe(404);
  });

  test("attachment endpoints require authentication", async ({ request }) => {
    // authMiddleware.authenticate throws 403 (not 401) for a missing/invalid token —
    // that's this app's consistent convention (see also adminMiddleware.ts).
    const resp = await request.get(`${BACKEND_URL}/api/upload/attachment`, { params: { filePath: "whatever" } });
    expect(resp.status()).toBe(403);
  });
});
