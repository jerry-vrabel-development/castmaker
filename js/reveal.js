// The slot-machine reveal: the name reel spins, the six dice tumble and land,
// tension builds, the grade stamps in, then the sections flip in one by one.
// Clicking anywhere on the sheet (or rolling again) skips to the result.

import { GENRES } from "./data/genres/index.js";
import { SoundEngine } from "./audio.js";

export const reducedMotion = () => {
  try { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch { return false; }
};

// ---------- sound ----------
// A thin wrapper around SoundEngine (js/audio.js) that creates the audio
// context on first use, which browsers only allow after a click or key press.

export const sfx = {
  engine: null,
  enabled: true,
  ensure() {
    if (!this.enabled) return null;
    if (!this.engine) {
      try { this.engine = new SoundEngine(new (window.AudioContext || window.webkitAudioContext)()); } catch { this.engine = null; }
    }
    const ctx = this.engine?.ctx;
    if (ctx && ctx.state === "suspended") ctx.resume().catch(() => {});
    return this.engine;
  },
  play(cue, ...args) {
    const e = this.ensure();
    if (!e) return 0;
    try { return e[cue](...args) || 0; } catch { return 0; }
  },
  tick() { this.play("tick"); },
  land() { this.play("land"); },
  flip() { this.play("flip"); },
  rattle() { this.play("rattle"); },
  dieLand(v) { this.play("dieLand", v); },
  anticipation(tier) { return this.play("anticipation", tier); },
  stamp(tier) { this.play("stamp", tier); },
  ui() { this.play("ui"); },
};

// ---------- reveal ----------

let runId = 0;
let finishFn = null;

export const isRevealing = () => !!finishFn;

export function skipReveal() {
  if (finishFn) finishFn();
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function playReveal(sheet, c, rarity) {
  const run = ++runId;
  const steps = [...sheet.querySelectorAll("[data-reveal]")];
  const nameEl = sheet.querySelector(".char-name");
  const realName = nameEl ? nameEl.textContent : "";
  const badge = sheet.querySelector(".rarity-badge");

  // The end state, reached either by playing through or by skipping.
  const finalState = () => {
    steps.forEach((el) => el.classList.remove("pending"));
    sheet.querySelectorAll(".die").forEach((d) => { if (d.dataset.final) d.textContent = d.dataset.final; d.classList.remove("rolling"); });
    sheet.querySelector(".dice-total")?.classList.remove("hidden-total");
    if (nameEl) { nameEl.textContent = realName; nameEl.classList.remove("spinning"); }
    sheet.classList.remove("revealing");
    if (badge) { badge.classList.remove("charging"); badge.classList.add("stamped"); }
    sheet.querySelector(".rarity-zone")?.classList.remove("awaiting");
    finishFn = null;
  };
  finishFn = () => { runId++; finalState(); };

  sheet.classList.remove("glow-3", "glow-4");
  sheet.classList.add("revealing");
  steps.forEach((el) => el.classList.add("pending"));
  // Hide the result before anything fades in: blank dice, no total, no grade.
  const zone = sheet.querySelector(".rarity-zone");
  if (zone) {
    zone.classList.add("awaiting");
    zone.querySelector(".dice-total")?.classList.add("hidden-total");
    zone.querySelectorAll(".die").forEach((d) => { d.dataset.final = d.textContent; d.textContent = "?"; d.classList.add("rolling"); });
  }
  const alive = () => run === runId;

  // 1. Name reel (skipped when identity is locked: the name isn't changing).
  const head = sheet.querySelector(".dossier-head");
  if (head) head.classList.remove("pending");
  if (nameEl && !c.locks.includes("identity")) {
    const culture = GENRES[c.genre].cultures[c.core.identity.culture];
    const pick = (a) => a[Math.floor(Math.random() * a.length)];
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
      await rollDice(el, alive);
      if (!alive()) return;
      // Tension, then the grade.
      if (badge) badge.classList.add("charging", `charge-${rarity.tier}`);
      const wait = sfx.anticipation(rarity.tier) || [0.25, 0.4, 0.6, 0.85, 1.15][rarity.tier];
      await sleep(wait * 1000);
      if (!alive()) return;
      if (badge) {
        badge.classList.remove("charging");
        badge.classList.add("stamped");
        el.classList.remove("awaiting");
        sfx.stamp(rarity.tier);
        if (rarity.tier >= 3) burst(badge, rarity.tier);
        if (rarity.tier >= 3) sheet.classList.add(`glow-${rarity.tier}`);
      }
      await sleep(450 + rarity.tier * 220);
      continue;
    }
    el.classList.remove("pending");
    sfx.flip();
    await sleep(120);
  }
  if (alive()) finalState();
}

// The six ability dice tumble, then land one by one.
async function rollDice(zone, alive) {
  const dice = [...zone.querySelectorAll(".die")];
  const total = zone.querySelector(".dice-total");
  if (total) total.classList.add("hidden-total");
  dice.forEach((d) => { if (!d.dataset.final) d.dataset.final = d.textContent; d.classList.add("rolling"); });
  for (let i = 0; i < dice.length; i++) {
    const frames = 5 + i;
    for (let f = 0; f < frames; f++) {
      if (!alive()) return;
      for (let j = i; j < dice.length; j++) dice[j].textContent = 3 + Math.floor(Math.random() * 16);
      if (f % 2 === 0) sfx.rattle();
      await sleep(38);
    }
    dice[i].textContent = dice[i].dataset.final;
    dice[i].classList.remove("rolling");
    dice[i].classList.add("landed");
    sfx.dieLand(Number(dice[i].dataset.final));
    await sleep(85);
  }
  if (total) total.classList.remove("hidden-total");
}

// Small particle burst for legendary rolls.
function burst(anchor, tier = 4) {
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

// Flash one section after a single-section reroll.
export function flashSection(el) {
  if (!el) return;
  sfx.flip();
  el.style.setProperty("--flash", "var(--accent)");
  el.classList.add("flash");
  setTimeout(() => el.classList.remove("flash"), 900);
}
