// The slot-machine reveal: the name reel spins, the six dice tumble and land,
// tension builds, the grade stamps in, then the sections flip in one by one.
// Clicking anywhere on the sheet (or rolling again) skips to the result.

import { GENRES, type Character, type RarityInfo } from "../engine/index.ts";
import { reducedMotion } from "./dom.ts";
import { sfx } from "./sound.ts";

// ---------- reveal ----------

let runId = 0;
let finishFn: (() => void) | null = null;

export const isRevealing = (): boolean => !!finishFn;

export function skipReveal(): void {
  if (finishFn) finishFn();
}

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export async function playReveal(sheet: HTMLElement, c: Character, rarity: RarityInfo): Promise<void> {
  const run = ++runId;
  const steps = [...sheet.querySelectorAll<HTMLElement>("[data-reveal]")];
  const nameEl = sheet.querySelector<HTMLElement>(".char-name");
  const realName = nameEl ? nameEl.textContent : "";
  const badge = sheet.querySelector<HTMLElement>(".rarity-badge");

  // The end state, reached either by playing through or by skipping.
  const tierClass = `tier-${rarity.tier}`;
  const finalState = () => {
    steps.forEach((el) => el.classList.remove("pending"));
    sheet.querySelectorAll<HTMLElement>(".die").forEach((d) => {
      if (d.dataset.final) d.textContent = d.dataset.final;
      d.classList.remove("rolling");
    });
    sheet.querySelector(".dice-total")?.classList.remove("hidden-total");
    if (nameEl) {
      nameEl.textContent = realName;
      nameEl.classList.remove("spinning");
    }
    sheet.classList.remove("revealing");
    if (badge) {
      badge.classList.remove("charging");
      badge.classList.add("stamped");
    }
    sheet.classList.remove("rolling");
    sheet.classList.add(tierClass);
    sheet.querySelector(".rarity-zone")?.classList.remove("awaiting");
    finishFn = null;
  };
  finishFn = () => {
    runId++;
    finalState();
  };

  // The card cycles through every grade color while the dice roll, then
  // settles on the one rolled.
  sheet.classList.remove("landed", ...["tier-0", "tier-1", "tier-2", "tier-3", "tier-4"]);
  sheet.classList.add("revealing", "rolling");
  sheet.style.setProperty("--heat", "0");
  steps.forEach((el) => el.classList.add("pending"));
  // Hide the result before anything fades in: blank dice, no total, no grade.
  const zone = sheet.querySelector<HTMLElement>(".rarity-zone");
  if (zone) {
    zone.classList.add("awaiting");
    zone.querySelector(".dice-total")?.classList.add("hidden-total");
    zone.querySelectorAll<HTMLElement>(".die").forEach((d) => {
      d.dataset.final = d.textContent;
      d.textContent = "?";
      d.classList.add("rolling");
    });
  }
  const alive = () => run === runId;

  // 1. Name reel (skipped when identity is locked: the name isn't changing).
  const head = sheet.querySelector(".dossier-head");
  if (head) head.classList.remove("pending");
  if (nameEl && !c.locks.includes("identity")) {
    const culture = GENRES[c.genre].cultures[c.core.identity.culture] ?? { first: [realName], last: [""] };
    const pick = (a: string[]) => a[Math.floor(Math.random() * a.length)] ?? "";
    nameEl.classList.add("spinning");
    const frames = 14;
    for (let i = 0; i < frames; i++) {
      if (!alive()) return;
      nameEl.textContent = `${pick(culture.first)} ${pick(culture.last)}`;
      sfx.tick();
      await sleep(35 + i * i * 0.9);
    }
    if (!alive()) return;
    nameEl.textContent = realName;
    nameEl.classList.remove("spinning");
    sfx.land();
  }
  await sleep(140);

  // 2. Everything else, one by one. Rare pieces chime and flash.
  for (const el of steps) {
    if (!alive()) return;
    if (el.classList.contains("rarity-zone")) {
      el.classList.remove("pending");
      el.classList.add("awaiting");
      growIn(el);
      await rollDice(el, alive, sheet);
      if (!alive()) return;
      // Tension, then the grade.
      if (badge) badge.classList.add("charging", `charge-${rarity.tier}`);
      const wait = sfx.anticipation(rarity.tier) || ([0.25, 0.4, 0.6, 0.85, 1.15][rarity.tier] ?? 0.5);
      await sleep(wait * 1000);
      if (!alive()) return;
      if (badge) {
        badge.classList.remove("charging");
        badge.classList.add("stamped");
        el.classList.remove("awaiting");
        sfx.stamp(rarity.tier);
        if (rarity.tier >= 3) burst(badge, rarity.tier);
        sheet.classList.remove("rolling");
        sheet.classList.add(tierClass, "landed");
        setTimeout(() => sheet.classList.remove("landed"), 2200);
      }
      await sleep(450 + rarity.tier * 220);
      continue;
    }
    el.classList.remove("pending");
    growIn(el);
    sfx.flip();
    await sleep(120);
  }
  if (alive()) finalState();
}

// Expand a newly revealed part from zero height, so the card grows around it.
function growIn(el: HTMLElement): void {
  if (reducedMotion() || !el.animate) return;
  const h = el.offsetHeight;
  el.style.overflow = "hidden";
  const anim = el.animate(
    [
      { height: "0px", opacity: 0, transform: "translateY(-6px)" },
      { height: `${h}px`, opacity: 1, transform: "none" },
    ],
    { duration: 300, easing: "cubic-bezier(0.2, 0.8, 0.25, 1)" },
  );
  const done = () => {
    el.style.overflow = "";
  };
  anim.onfinish = done;
  anim.oncancel = done;
}

// The six ability dice tumble, then land one by one.
async function rollDice(zone: HTMLElement, alive: () => boolean, sheet: HTMLElement): Promise<void> {
  let landedSum = 0;
  const dice = [...zone.querySelectorAll<HTMLElement>(".die")];
  const total = zone.querySelector<HTMLElement>(".dice-total");
  if (total) total.classList.add("hidden-total");
  dice.forEach((d) => {
    if (!d.dataset.final) d.dataset.final = d.textContent;
    d.classList.add("rolling");
  });
  for (let i = 0; i < dice.length; i++) {
    const frames = 5 + i;
    for (let f = 0; f < frames; f++) {
      if (!alive()) return;
      for (let j = i; j < dice.length; j++) dice[j]!.textContent = String(3 + Math.floor(Math.random() * 16));
      if (f % 2 === 0) sfx.rattle();
      await sleep(38);
    }
    const die = dice[i]!;
    die.textContent = die.dataset.final ?? "";
    die.classList.remove("rolling");
    die.classList.add("landed");
    sfx.dieLand(Number(die.dataset.final));
    // Heat rises as hot dice land: the card's colors speed up and brighten.
    landedSum += Number(die.dataset.final);
    const avg = landedSum / (i + 1);
    sheet.style.setProperty("--heat", Math.max(0, Math.min(1, (avg - 10) / 6)).toFixed(2));
    await sleep(85);
  }
  if (total) total.classList.remove("hidden-total");
}

// Small particle burst for legendary rolls.
function burst(anchor: HTMLElement, tier = 4): void {
  if (reducedMotion()) return;
  const n = tier >= 4 ? 30 : 14;
  for (let i = 0; i < n; i++) {
    const s = document.createElement("span");
    s.className = `spark t${tier}`;
    const a = (Math.PI * 2 * i) / n + Math.random() * 0.3;
    const d = (tier >= 4 ? 60 : 40) + Math.random() * 60;
    s.style.setProperty("--dx", `${Math.cos(a) * d}px`);
    s.style.setProperty("--dy", `${Math.sin(a) * d}px`);
    anchor.appendChild(s);
    setTimeout(() => s.remove(), 1100);
  }
}

/** Flash one section after a single-section reroll. */
export function flashSection(el: HTMLElement | null): void {
  if (!el) return;
  sfx.flip();
  el.style.setProperty("--flash", "var(--accent)");
  el.classList.add("flash");
  setTimeout(() => el.classList.remove("flash"), 900);
}
