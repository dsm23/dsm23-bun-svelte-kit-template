import { expect, test } from "@playwright/test";
import type { PlaywrightTestArgs } from "@playwright/test";

const checkFavicon = async ({ page }: Pick<PlaywrightTestArgs, "page">) => {
  const favicon = page.locator('link[rel*="icon"]');
  const href = await favicon.getAttribute("href");

  expect(href).toBeTruthy();

  if (href) {
    const faviconUrl = new URL(href, page.url()).href;

    const response = await page.request.get(faviconUrl);
    const contentType = response.headers()["content-type"];

    const faviconMimeRegex =
      /^image\/(x-icon|vnd\.microsoft\.icon|png|svg\+xml|gif|jpeg)$/;

    expect(response.ok()).toBe(true);
    expect(contentType).toMatch(faviconMimeRegex);
  }
};

test("favicon link is not broken", async ({ page }) => {
  await page.goto("/");

  await checkFavicon({ page });
});
