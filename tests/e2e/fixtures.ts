import { test as base, expect, type Page } from "@playwright/test";

/** Settings most tests start from: instant reveal and no sound keep runs fast and quiet. */
export const FAST = { reveal: "instant", sound: "off" };

export const test = base.extend<{ settings: Record<string, string> }>({
  settings: [FAST, { option: true }],
  page: async ({ page, settings }, use) => {
    // Web fonts are the only outside requests. Serve them empty so tests
    // never depend on the network and fallback fonts are used instead.
    await page.route(/fonts\.(googleapis|gstatic)\.com/, (r) =>
      r.fulfill({ status: 200, contentType: "text/css", body: "" }),
    );
    await page.addInitScript((s) => {
      // Only on the first load, so reloads keep what the test changed.
      if (!sessionStorage.getItem("e2e-init")) {
        localStorage.setItem("castmaker.settings.v1", JSON.stringify(s));
        sessionStorage.setItem("e2e-init", "1");
      }
    }, settings);
    await page.goto("/");
    await expect(page.locator(".char-name")).toBeVisible();
    await use(page);
  },
});

export { expect };

export const nameOf = (page: Page) => page.locator(".char-name").innerText();

/** Rolls and waits until the sheet shows a different character. */
export async function rollNew(page: Page): Promise<string> {
  const seed = await page.locator(".seed-stamp").innerText();
  await page.locator("#btn-roll:visible, #btn-roll-mobile:visible").first().click();
  await expect(page.locator(".seed-stamp")).not.toHaveText(seed);
  await expect(page.locator("#sheet")).not.toHaveClass(/revealing/);
  return nameOf(page);
}
