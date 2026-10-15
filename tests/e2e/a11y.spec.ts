import AxeBuilder from "@axe-core/playwright";
import type { Page } from "@playwright/test";
import { test, expect } from "./fixtures.ts";

const scan = (page: Page) => new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();

test("the main screen has no accessibility violations", async ({ page }) => {
  const { violations } = await scan(page);
  expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(", ")}`)).toEqual([]);
});

test("writer mode has no accessibility violations", async ({ page }) => {
  await page.locator("#mode-writer").click();
  const { violations } = await scan(page);
  expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(", ")}`)).toEqual([]);
});

test("the export dialog has no accessibility violations", async ({ page }) => {
  await page.locator("#btn-export").click();
  await expect(page.locator("#export-dialog")).toBeVisible();
  const { violations } = await scan(page);
  expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(", ")}`)).toEqual([]);
});
