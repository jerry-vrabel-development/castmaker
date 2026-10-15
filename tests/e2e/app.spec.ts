import { test, expect, nameOf, rollNew } from "./fixtures.ts";

test("shows a full character on first load", async ({ page }) => {
  await expect(page.locator(".rarity-badge")).toBeVisible();
  for (const title of ["Personality", "Flaws & fears", "Background"]) {
    await expect(page.getByRole("region", { name: title, exact: true })).toBeVisible();
  }
});

test("rolls a new character with the button and the R key", async ({ page }) => {
  await rollNew(page);
  const seed = await page.locator(".seed-stamp").innerText();
  await page.locator("body").press("r");
  await expect(page.locator(".seed-stamp")).not.toHaveText(seed);
});

test("keeps a locked section when rolling again", async ({ page }) => {
  const personality = page.getByRole("region", { name: "Personality", exact: true });
  const traits = await personality.locator(".trait").allTextContents();
  await page.getByRole("button", { name: "Lock Personality" }).click();
  await expect(page.getByRole("button", { name: "Unlock Personality" })).toHaveAttribute("aria-pressed", "true");
  await rollNew(page);
  await expect(personality.locator(".trait")).toHaveText(traits);
  await expect(page.getByRole("button", { name: "Reroll Personality" })).toBeDisabled();
});

test("rerolls one section and leaves the name alone", async ({ page }) => {
  const name = await nameOf(page);
  const appearance = page.getByRole("region", { name: "Appearance", exact: true });
  const before = await appearance.innerText();
  // A reroll can land on the same lines by chance, so allow a few tries.
  await expect(async () => {
    await page.getByRole("button", { name: "Reroll Appearance" }).click();
    expect(await appearance.innerText()).not.toBe(before);
  }).toPass({ timeout: 5000 });
  expect(await nameOf(page)).toBe(name);
});

test("saves to the cast and survives a reload", async ({ page }) => {
  const name = await nameOf(page);
  await page.locator("#btn-save").click();
  const roster = page.locator("#roster");
  await expect(roster).toContainText(name);
  await expect(page.locator("#cast-count")).toHaveText("1");
  await page.reload();
  await expect(roster).toContainText(name);

  await rollNew(page);
  await roster.locator("button.open", { hasText: name }).click();
  await expect(page.locator(".char-name")).toHaveText(name);
});

test("exports Markdown and JSON", async ({ page }) => {
  const name = await nameOf(page);
  await page.locator("#btn-export").click();
  const text = page.locator("#export-text");
  await expect(text).toHaveValue(new RegExp(`^# ${name}`));
  await page.locator("#format-json").click();
  const json = JSON.parse(await text.inputValue());
  expect(json.core.identity.name).toBe(name);
  const download = page.waitForEvent("download");
  await page.locator("#btn-download").click();
  expect((await download).suggestedFilename()).toMatch(/\.json$/);
  await page.locator("#btn-close-export").click();
  await expect(page.locator("#export-dialog")).not.toBeVisible();
});

test("settings change the sheet and persist", async ({ page }) => {
  await page.locator("#mode-writer").click();
  await expect(page.getByRole("region", { name: "Story", exact: true })).toBeVisible();
  await expect(page.getByRole("region", { name: "Tabletop", exact: true })).toHaveCount(0);
  await expect(page.locator("#tt-system")).toBeHidden();

  await page.locator("#mode-tabletop").click();
  await page.locator("#system-agnostic").click();
  await expect(page.locator("#tt-level")).toBeHidden();

  await page.locator("#genre-scifi").click();
  await expect(page.locator(".mode-label")).toContainText("Science fiction");
  await page.reload();
  await expect(page.locator("#genre-scifi")).toHaveAttribute("aria-checked", "true");
  await expect(page.locator("#system-agnostic")).toHaveAttribute("aria-checked", "true");
});

test("fits the screen without sideways scrolling", async ({ page }) => {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test.describe("animated reveal", () => {
  test.use({ settings: { reveal: "animated", sound: "off" } });

  test("can be skipped with a click", async ({ page }) => {
    await page.locator("#btn-roll:visible, #btn-roll-mobile:visible").first().click();
    await expect(page.locator("#sheet")).toHaveClass(/revealing/);
    await page.locator("#sheet").click({ position: { x: 20, y: 20 } });
    await expect(page.locator("#sheet")).not.toHaveClass(/revealing/);
    await expect(page.locator(".pending")).toHaveCount(0);
  });
});

test("no errors in the console", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(e.message));
  await page.reload();
  await expect(page.locator(".char-name")).toBeVisible();
  await rollNew(page);
  expect(errors).toEqual([]);
});
