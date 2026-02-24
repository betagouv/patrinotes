import test, { expect, Page } from "@playwright/test";
import { cleanupDb, mockUser1, mockUser2, signup } from "./utils";

const ctx: Context = {} as any;
type Context = {
  page1: Page;
  page2: Page;
};

// test.afterAll(async () => {
//   await cleanupDb();
// });

// test.beforeAll(async ({ browser }) => {
//   const context1 = await browser.newContext();
//   const context2 = await browser.newContext();

//   const page1 = await context1.newPage();
//   const page2 = await context2.newPage();

//   await Promise.all([page1.goto("./"), page2.goto("./")]);

//   await Promise.all([signup({ page: page1, user: mockUser1 }), signup({ page: page2, user: mockUser2 })]);

//   ctx.page1 = page1;
//   ctx.page2 = page2;
// });

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
