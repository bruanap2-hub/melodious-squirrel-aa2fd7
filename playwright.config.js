import { defineConfig, devices } from "@playwright/test";

// Run against an existing Netlify Preview; this config never starts a server.
export default defineConfig({
  testDir: "./tests",
  timeout: 65000,
  expect: { timeout: 10000 },
  outputDir: ".playwright-artifacts",
  use: {
    baseURL: process.env.PREVIEW_URL || "http://localhost:8889",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "desktop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: "mobile",
      use: { ...devices["iPhone 13"], browserName: "chromium" },
    },
  ],
});
