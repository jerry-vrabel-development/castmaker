// The slot-machine reveal: a spinning name reel, sections flipping in one by
// one, chimes for rare pieces, and a final rarity stamp. Clicking anywhere on
// the sheet (or rolling again) skips straight to the result.

import { GENRES } from "./data/genres/index.js";

export const reducedMotion = () => {
  try { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch { return false; }
};

// ---------- sound (synthesized, no audio files) ----------

export const sfx = {
  ctx: null,
  enabled: true,
  ensure() {
    if (!this.ctx) {
      try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch { this.ctx = null; }
    }
    if (this.ctx && this.ctx.state === "suspended") this.ctx.resume().catch(() => {});
    return this.ctx;
  },
  tone(freq, dur, type = "sine", vol = 0.06, when = 0) {
    if (!this.enabled) return;
    const ctx = this.ensure();
    if (!ctx) return;
    const t = ctx.currentTime + when;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(ctx.destination);
    o.start(t);
    o.stop(t + dur + 0.03);
  },
  tick() { this.tone(1400, 0.035, "square", 0.018); },
  land() { this.tone(523, 0.14, "triangle", 0.07); this.tone(784, 0.16, "triangle", 0.04, 0.03); },
  flip() { this.tone(300, 0.05, "triangle", 0.025); },
  piece(tier) {
    const base = [0, 0, 784, 988, 1175][tier];
    if (!base) return;
    this.tone(base, 0.2, "sine", 0.07);
    this.tone(base * 1.5, 0.26, "sine", 0.045, 0.07);
    if (tier >= 4) this.tone(base * 2, 0.4, "sine", 0.04, 0.14);
  },
  stamp(tier) {
    const chords = [[392], [440, 554], [523, 659, 784], [587, 740, 880, 1175], [523, 659, 784, 1047, 1319, 1568]];
    chords[tier].forEach((f, i) => this.tone(f, 0.45 + tier * 0.12, "triangle", 0.05, i * 0.075));
  },
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
  const near = sheet.querySelector(".near-miss");

  // The end state, reached either by playing through or by skipping.
  const finalState = () => {
    steps.forEach((el) => el.classList.remove("pending"));
    sheet.querySelectorAll(".die").forEach((d) => { if (d.dataset.final) d.textContent = d.dataset.final; d.classList.remove("rolling"); });
    sheet.querySelector(".dice-total")?.classList.remove("hidden-total");
    if (nameEl) { nameEl.textContent = realName; nameEl.classList.remove("spinning"); }
    sheet.classList.remove("revealing");
    if (badge) badge.classList.add("stamped");
    if (near) near.classList.add("shown");
    finishFn = null;
  };
  finishFn = () => { runId++; finalState(); };

  sheet.classList.add("revealing");
  steps.forEach((el) => el.classList.add("pending"));
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
      await rollDice(el, alive);
      if (!alive()) return;
      await sleep(180);
      if (badge) {
        badge.classList.add("stamped");
        sfx.stamp(rarity.tier);
        if (rarity.tier >= 4) burst(badge);
      }
      await sleep(500 + rarity.tier * 180);
      continue;
    }
    el.classList.remove("pending");
    const tiers = [...el.querySelectorAll("[data-tier]")].map((n) => Number(n.dataset.tier));
    const top = tiers.length ? Math.max(...tiers) : 0;
    if (top >= 2) {
      sfx.piece(top);
      el.style.setProperty("--flash", `var(--t${top})`);
      el.classList.add("flash");
      setTimeout(() => el.classList.remove("flash"), 900);
      await sleep(260 + top * 60);
    } else {
      sfx.flip();
      await sleep(150);
    }
  }
  if (alive()) finalState();
}

// The six ability dice tumble, then land one by one.
async function rollDice(zone, alive) {
  const dice = [...zone.querySelectorAll(".die")];
  const total = zone.querySelector(".dice-total");
  if (total) total.classList.add("hidden-total");
  dice.forEach((d) => { d.dataset.final = d.textContent; d.classList.add("rolling"); });
  for (let i = 0; i < dice.length; i++) {
    const frames = 5 + i;
    for (let f = 0; f < frames; f++) {
      if (!alive()) return;
      for (let j = i; j < dice.length; j++) dice[j].textContent = 3 + Math.floor(Math.random() * 16);
      sfx.tick();
      await sleep(38);
    }
    dice[i].textContent = dice[i].dataset.final;
    dice[i].classList.remove("rolling");
    sfx.tone(380 + Number(dice[i].dataset.final) * 22, 0.08, "triangle", 0.05);
    await sleep(70);
  }
  if (total) total.classList.remove("hidden-total");
  sfx.land();
}

// Small particle burst for legendary rolls.
function burst(anchor) {
  if (reducedMotion()) return;
  const n = 22;
  for (let i = 0; i < n; i++) {
    const s = document.createElement("span");
    s.className = "spark";
    const a = (Math.PI * 2 * i) / n + Math.random() * 0.3;
    const d = 50 + Math.random() * 60;
    s.style.setProperty("--dx", `${Math.cos(a) * d}px`);
    s.style.setProperty("--dy", `${Math.sin(a) * d}px`);
    anchor.appendChild(s);
    setTimeout(() => s.remove(), 1100);
  }
}

// Flash one section after a single-section reroll.
export function flashSection(el, tier) {
  if (!el) return;
  if (tier >= 2) sfx.piece(tier); else sfx.flip();
  el.style.setProperty("--flash", `var(--t${Math.max(tier, 1)})`);
  el.classList.add("flash");
  setTimeout(() => el.classList.remove("flash"), 900);
}
