import test, { expect, Page } from "@playwright/test";

const ctx: Context = {} as any;
type Context = {
  page1: Page;
  page2: Page;
};

test.describe("Report creation", () => {
  test.skip("user 1 should create a report", async () => {
    const { page1, page2 } = ctx;

    const page1Count = await page1.evaluate(() => document.querySelectorAll(".report-list-item").length);
    expect(page1Count).toBe(0);

    await page2.click("button[data-value=udap]");
    let page2Count = await page2.evaluate(() => document.querySelectorAll(".report-list-item").length);
    expect(page2Count).toBe(0);

    await page1.click("button[data-test-id=create-report]");
    await page1.waitForURL((url) => url.pathname === "/report");

    expect(page1.url()).toContain("/report");

    page2Count = await page2.evaluate(() => document.querySelectorAll(".report-list-item").length);

    expect(page2Count).toBe(1);
  });
});
