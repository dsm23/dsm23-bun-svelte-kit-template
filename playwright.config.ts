import fs from "node:fs";
import path from "node:path";
import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

const portDev = 5173;
const portProd = 4173;

const injectFromEnvFile = () => {
  const envDir = ".";
  const envFiles = [
    /** default file */ `.env`,
    /** local file */ `.env.local`,
    /** mode file */ `.env.playwright`,
    /** mode local file */ `.env.playwright.local`,
  ];

  envFiles.forEach((file) => {
    const filePath = path.join(envDir, file);
    if (fs.existsSync(filePath)) {
      dotenv.config({ path: filePath });
    }
  });
};

injectFromEnvFile();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "blob" : "html",
  use: {
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium-dev",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: `http://localhost:${portDev}`,
      },
    },

    {
      name: "firefox-dev",
      use: {
        ...devices["Desktop Firefox"],
        baseURL: `http://localhost:${portDev}`,
      },
    },

    {
      name: "webkit-dev",
      use: {
        ...devices["Desktop Safari"],
        baseURL: `http://localhost:${portDev}`,
      },
    },

    {
      name: "chromium-prod",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: `http://localhost:${portProd}`,
      },
    },

    {
      name: "firefox-prod",
      use: {
        ...devices["Desktop Firefox"],
        baseURL: `http://localhost:${portProd}`,
      },
    },

    {
      name: "webkit-prod",
      use: {
        ...devices["Desktop Safari"],
        baseURL: `http://localhost:${portProd}`,
      },
    },
  ],

  webServer: [
    {
      command: `bun run build && bun run preview --port ${portProd}`,
      url: `http://localhost:${portProd}`,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: `bun run dev --port ${portDev}`,
      url: `http://localhost:${portDev}`,
      reuseExistingServer: !process.env.CI,
    },
  ],
});
