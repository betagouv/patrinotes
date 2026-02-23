import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import { expand } from "dotenv-expand";

expand(dotenv.config({ path: "./.env.test" }));

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  globalSetup: "./tests/setup.ts",
  globalTeardown: "./tests/teardown.ts",
  testDir: "./tests",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: `http://localhost:${process.env.FRONTEND_PORT}`,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
    headless: false,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },

    // {
    //   name: "firefox",
    //   use: { ...devices["Desktop Firefox"] },
    // },

    // {
    //   name: "webkit",
    //   use: { ...devices["Desktop Safari"] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  webServer: [
    // {
    //   command: `docker compose -p patrinotes-test -f docker-compose.test.yaml --env-file ./.env.test up --wait && pnpm migration:up && pnpm backend dev`,
    //   reuseExistingServer: false,
    //   url: `http://localhost:${process.env.BACKEND_PORT}/health`,
    //   env: {
    //     NODE_ENV: "test",
    //   },
    // },
    {
      command: `pnpm frontend dev --mode test --port ${process.env.FRONTEND_PORT}`,
      url: `http://localhost:${process.env.FRONTEND_PORT}`,
      env: {
        NODE_ENV: "test",
      },
      reuseExistingServer: false,
    },
  ],
});
