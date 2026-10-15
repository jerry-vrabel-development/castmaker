// Castmaker — interface.

import { rollCharacter, rerollSection, toggleLock, upgradeCharacter, STRENGTHS } from "../src/engine/generate.ts";
import { GENRES, GENRE_ORDER } from "../src/engine/data/genres/index.ts";
import { renderProse } from "../src/engine/prose/provider.ts";
import { textContext, loveLabel, giftList } from "../src/engine/prose/templates.ts";
import { fill, cap, stripArticle, PRONOUNS } from "../src/engine/text.ts";
import { oneIn } from "../src/engine/dice.ts";
import { BIG5, FOUNDATIONS, VALUES } from "../src/engine/data/psyche.ts";
import { toDnd5e, signed, ABILITIES } from "../src/engine/adapters/dnd5e.ts";
import { toMarkdown, toJSON } from "../src/engine/export.ts";
import { storage } from "./storage.js";
import { computeRarity, TIERS } from "../src/engine/rarity.ts";
import { sfx, reducedMotion, playReveal, skipReveal, isRevealing, flashSection } from "./reveal.js";

const SMOOTH = () => (reducedMotion() ? "auto" : "smooth");

// ---------- state ----------

const SETTINGS_KEY = "castmaker.settings.v1";
const CURRENT_KEY = "castmaker.current.v1";

const defaults = { genre: "fantasy", mode: "tabletop", depth: "full", system: "dnd5e", level: 1, format: "md", reveal: "animated", sound: "on", orient: "realistic", ethics: "both" };
const state = {
  settings: { ...defaults, ...readLocal(SETTINGS_KEY, {}) },
  current: null,
  savedSnapshot: null, // JSON of the last saved version of current
  roster: [],
};

function readLocal(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
}
function writeLocal(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage blocked */ }
}

// ---------- small helpers ----------

const $ = (sel) => document.querySelector(sel);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]);

const ICON = {
  lock: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
  unlock: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 7.6-1.7"/></svg>',
  dice: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="3.5"/><circle cx="8.5" cy="8.5" r="1.3"/><circle cx="15.5" cy="15.5" r="1.3"/><circle cx="12" cy="12" r="1.3"/></svg>',
};

let toastTimer;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.hidden = true; }, 1800);
}

const inFrame = (() => { try { return window.self !== window.top; } catch { return true; } })();

// ---------- segmented controls ----------

const GROUPS = {
  genre: { el: "#genre-group", options: GENRE_ORDER.map((g) => [g, { fantasy: "Fantasy", modern: "Modern", scifi: "Sci-fi" }[g]]) },
  mode: { el: "#mode-group", options: [["tabletop", "Tabletop"], ["writer", "Writer"]] },
  depth: { el: "#depth-group", options: [["quick", "Quick NPC"], ["full", "Full character"]] },
  system: { el: "#system-group", options: [["dnd5e", "D&D 5e"], ["agnostic", "Any system"]] },
  format: { el: "#format-group", options: [["md", "Markdown"], ["json", "JSON"]] },
  reveal: { el: "#reveal-group", options: [["animated", "Spin"], ["instant", "Fast"]] },
  sound: { el: "#sound-group", options: [["on", "On"], ["off", "Off"]] },
  orient: { el: "#orient-group", options: [["realistic", "Real"], ["even", "Even"], ["off", "Hide"]] },
  ethics: { el: "#ethics-group", options: [["foundations", "Foundations"], ["values", "Values"], ["both", "Both"]] },
};

function renderGroups() {
  for (const [key, g] of Object.entries(GROUPS)) {
    $(g.el).innerHTML = g.options.map(([v, label]) =>
      `<button type="button" role="radio" id="${key}-${v}" data-group="${key}" data-value="${v}" aria-checked="${state.settings[key] === v}">${esc(label)}</button>`).join("");
  }
  const tt = state.settings.mode === "tabletop";
  $("#tt-depth").hidden = !tt;
  $("#tt-system").hidden = !tt;
  $("#tt-level").hidden = !(tt && state.settings.system === "dnd5e");
  $("#level").value = state.settings.level;
}

function setSetting(key, value) {
  if (state.settings[key] === value) return;
  state.settings[key] = value;
  writeLocal(SETTINGS_KEY, state.settings);
  renderGroups();
  sfx.enabled = state.settings.sound === "on";
  if (key === "reveal") return;
  if (key === "ethics") { renderSheet(); return; }
  if (key === "sound") { if (value === "on") sfx.land(); return; }
  if (key === "orient") {
    // Switching between real-world and even odds rerolls only the love life.
    if (value !== "off" && state.current && state.current.options?.orientation !== value) {
      setCurrent(rerollSection(state.current, "love", { avoidRepeats: true, orientation: value }));
    } else renderSheet();
    return;
  }
  if (key === "genre") {
    setCurrent(rollCharacter({ genre: value, avoidRepeats: true, orientation: orientMode() }), true);
    scrollToTop();
    toast(`New ${GENRES[value].label.toLowerCase()} character`);
  } else if (key === "format") {
    fillExport();
  } else {
    renderSheet();
  }
}

// ---------- character actions ----------

function setCurrent(c, animate = false) {
  state.current = c;
  writeLocal(CURRENT_KEY, c);
  renderSheet(animate);
  renderSaveButton();
  renderRoster();
}

function roll() {
  if (isRevealing()) { skipReveal(); return; }
  const prev = state.current;
  const c = rollCharacter({ genre: state.settings.genre, prev, locks: prev?.locks || [], avoidRepeats: true, orientation: orientMode() });
  // Keep the same identity record when the person's identity is locked, so it stays one character.
  if (prev && prev.locks.includes("identity")) c.id = prev.id;
  state.savedSnapshot = c.id === prev?.id ? state.savedSnapshot : null;
  setCurrent(c, true);
  scrollToTop();
}

const orientMode = () => (state.settings.orient === "even" ? "even" : "realistic");

// After a full roll, jump back to the top so the reveal is in view.
function scrollToTop() {
  try { window.scrollTo({ top: 0, behavior: SMOOTH() }); } catch { window.scrollTo(0, 0); }
}

function reroll(section) {
  if (isRevealing()) skipReveal();
  setCurrent(rerollSection(state.current, section, { avoidRepeats: true }), false);
  if (state.settings.reveal !== "animated" || reducedMotion()) return;
  flashSection(document.querySelector(`#sheet [data-section-key="${section}"]`));
}

function lock(section) {
  sfx.ui();
  setCurrent(toggleLock(state.current, section));
}

async function save() {
  const saved = await storage.save(state.current);
  state.current = saved;
  state.savedSnapshot = JSON.stringify(saved.core) + JSON.stringify(saved.layers);
  writeLocal(CURRENT_KEY, saved);
  state.roster = (await storage.list()).map(upgradeCharacter);
  renderSaveButton();
  renderRoster();
  toast(`Saved ${saved.core.identity.first}`);
}

function isSaved() {
  const c = state.current;
  return !!c && state.savedSnapshot === JSON.stringify(c.core) + JSON.stringify(c.layers);
}

function renderSaveButton() {
  const b = $("#btn-save");
  const saved = isSaved();
  b.textContent = saved ? "Saved" : state.roster.some((r) => r.id === state.current?.id) ? "Save changes" : "Save to cast";
  b.classList.toggle("is-saved", saved);
}

// ---------- roster ----------

let confirmingId = null;
let confirmTimer;

function renderRoster() {
  const list = $("#roster");
  $("#cast-count").textContent = state.roster.length;
  if (!state.roster.length) {
    list.innerHTML = '<li><p class="roster-empty">Saved characters appear here. Roll one you like and choose Save to cast.</p></li>';
    return;
  }
  list.innerHTML = state.roster.map((c) => {
    const id = c.core.identity;
    const current = c.id === state.current?.id;
    const confirming = confirmingId === c.id;
    return `<li class="${current ? "is-current" : ""}">
      <button type="button" class="open" data-action="open" data-id="${esc(c.id)}">
        <span class="r-name"><span class="dot t${computeRarity(c).tier}" title="${esc(TIERS[computeRarity(c).tier].label)}"></span>${esc(id.name)}</span>
        <span class="r-meta">${esc(cap(stripArticle(id.occupation.t)))} · ${esc(GENRES[c.genre].label)}</span>
      </button>
      <button type="button" class="del ${confirming ? "is-confirming" : ""}" data-action="delete" data-id="${esc(c.id)}" aria-label="Delete ${esc(id.name)}">${confirming ? "Delete?" : "✕"}</button>
    </li>`;
  }).join("");
}

async function openSaved(id) {
  const c = state.roster.find((r) => r.id === id);
  if (!c) return;
  if (c.genre !== state.settings.genre) {
    state.settings.genre = c.genre;
    writeLocal(SETTINGS_KEY, state.settings);
    renderGroups();
  }
  state.savedSnapshot = JSON.stringify(c.core) + JSON.stringify(c.layers);
  setCurrent(JSON.parse(JSON.stringify(c)), true);
}

async function deleteSaved(id) {
  if (confirmingId !== id) {
    confirmingId = id;
    renderRoster();
    clearTimeout(confirmTimer);
    confirmTimer = setTimeout(() => { confirmingId = null; renderRoster(); }, 3000);
    return;
  }
  confirmingId = null;
  await storage.remove(id);
  state.roster = (await storage.list()).map(upgradeCharacter);
  if (state.current?.id === id) state.savedSnapshot = null;
  renderRoster();
  renderSaveButton();
  toast("Deleted");
}

// ---------- sheet rendering ----------

const LABELS = {
  background: "Background", personality: "Personality", flaws: "Flaws & fears", motivation: "Motivation",
  appearance: "Appearance", voice: "Voice", hook: "Secret / hook", relationships: "Relationships",
  tabletop: "Tabletop", writer: "Story", gift: "Gift", morality: "Morality", love: "Love life",
};

function sectionShell(key, title, body, c) {
  const locked = c.locks.includes(key);
  return `<section class="sec ${locked ? "is-locked" : ""}" aria-label="${esc(title)}" data-reveal data-section-key="${key}">
    <div class="sec-head">
      <h2 class="sec-title">${esc(title)}</h2>
      ${tools(key, title, locked)}
    </div>
    <div class="sec-body">${body}</div>
  </section>`;
}

function tools(key, title, locked) {
  return `<div class="tools">
    <button type="button" class="icon-btn" data-action="lock" data-section="${key}" aria-pressed="${locked}" aria-label="${locked ? "Unlock" : "Lock"} ${esc(title)}">${locked ? ICON.lock : ICON.unlock}<span class="lbl">${locked ? "Locked" : "Lock"}</span></button>
    <button type="button" class="icon-btn" data-action="reroll" data-section="${key}" aria-label="Reroll ${esc(title)}" ${locked ? "disabled" : ""}>${ICON.dice}<span class="lbl">Reroll</span></button>
  </div>`;
}

const kv = (k, v) => `<div class="kv"><span class="k">${esc(k)}</span><p class="v">${v}</p></div>`;

function rarityZone(r, c) {
  const locked = c.locks.includes("grade");
  return `<div class="rarity-zone ${locked ? "is-locked" : ""}" data-reveal>
    <div class="dice" aria-label="Ability rolls: ${r.rolls.join(", ")}, total ${r.total}">
      ${r.rolls.map((v) => `<span class="die ${v >= 17 ? "hot" : v <= 7 ? "cold" : ""}" data-v="${v}">${v}</span>`).join("")}
      <span class="dice-total">= <b>${r.total}</b></span>
    </div>
    <div class="rarity-row">
      <span class="rarity-badge t${r.tier}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l2.6 6.9L22 9.3l-5.6 4.6 1.9 7.1L12 17l-6.3 4 1.9-7.1L2 9.3l7.4-.4z"/></svg>${esc(r.tierInfo.label)}</span>
      <span class="rarity-meta">${esc(oneIn(r.gradeOdds))} rolls</span>
      <button type="button" class="icon-btn grade-lock" data-action="lock" data-section="grade" aria-pressed="${locked}" aria-label="${locked ? "Unlock" : "Lock"} grade">${locked ? ICON.lock : ICON.unlock}<span class="lbl">${locked ? "Grade locked" : "Lock grade"}</span></button>
    </div>
  </div>`;
}

// ---------- personality, flaws and morality ----------

const fmt1 = (n) => Number(n).toFixed(1);
const pct = (v) => (((v - 1) / 4) * 100).toFixed(1);

// Big Five: each dimension as a scale between its two poles.
function big5Body(big5) {
  return `<div class="b5">${BIG5.map((d) => `
    <div class="b5-row">
      <span class="b5-low">${esc(d.low)}</span>
      <span class="b5-track" role="img" aria-label="${esc(d.label)} ${fmt1(big5[d.id])} of 5"><span class="b5-dot" style="left:${pct(big5[d.id])}%"></span></span>
      <span class="b5-high">${esc(d.high)}</span>
      <span class="b5-name">${esc(d.label)}</span>
    </div>`).join("")}</div>`;
}

function foundationsBlock(c, p) {
  const sum = p.moral.foundations;
  const f = c.core.morality.foundations;
  return `<div class="moral-block">
    <h3 class="moral-title">Moral Foundations</h3>
    <p class="moral-sum">${esc(sum.text)}</p>
    <div class="bars">${FOUNDATIONS.map((d) => `
      <div class="bar-row ${d.id === sum.top.id ? "is-top" : d.id === sum.bottom.id ? "is-low" : ""}">
        <span class="bar-label" title="${esc(d.desc)}">${esc(d.label)}</span>
        <span class="bar"><span class="bar-fill" style="width:${pct(f[d.id])}%"></span></span>
        <span class="bar-val">${fmt1(f[d.id])}</span>
      </div>`).join("")}</div>
  </div>`;
}

// Schwartz values as a ten-spoke wheel; neighbors are compatible, opposites conflict.
function valuesBlock(c, p) {
  const sum = p.moral.values;
  const v = c.core.morality.values;
  const n = VALUES.length;
  const R = 78;
  const top = new Set(sum.top.map((t) => t.id));
  const pt = (i, r) => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2;
    return [Math.cos(a) * r, Math.sin(a) * r];
  };
  const rings = [0.25, 0.5, 0.75, 1].map((k) => `<polygon class="w-ring" points="${VALUES.map((_, i) => pt(i, R * k).map((q) => q.toFixed(1)).join(",")).join(" ")}"/>`).join("");
  const spokes = VALUES.map((_, i) => { const [x, y] = pt(i, R); return `<line class="w-spoke" x1="0" y1="0" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}"/>`; }).join("");
  const shape = VALUES.map((d, i) => pt(i, R * (0.15 + 0.85 * ((v[d.id] - 1) / 4))).map((q) => q.toFixed(1)).join(",")).join(" ");
  const dots = VALUES.map((d, i) => { const [x, y] = pt(i, R * (0.15 + 0.85 * ((v[d.id] - 1) / 4))); return `<circle class="w-dot ${top.has(d.id) ? "is-top" : ""}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${top.has(d.id) ? 4 : 2.5}"/>`; }).join("");
  const labels = VALUES.map((d, i) => {
    const [x, y] = pt(i, R + 12);
    const anchor = Math.abs(x) < 6 ? "middle" : x > 0 ? "start" : "end";
    return `<text class="w-label ${top.has(d.id) ? "is-top" : ""}" x="${x.toFixed(1)}" y="${(y + 4).toFixed(1)}" text-anchor="${anchor}">${esc(d.label)}</text>`;
  }).join("");
  return `<div class="moral-block">
    <h3 class="moral-title">Values</h3>
    <p class="moral-sum">${esc(sum.text)}</p>
    <div class="wheel-wrap"><svg class="wheel" viewBox="-170 -108 340 216" role="img" aria-label="Values: ${esc(sum.top.map((t) => t.label).join(", "))} highest">
      ${rings}${spokes}<polygon class="w-shape" points="${shape}"/>${dots}${labels}
    </svg></div>
  </div>`;
}

function moralityBody(c, p, x, system, level) {
  const m = c.core.morality;
  const f = (s) => esc(fill(s, x));
  const view = state.settings.ethics;
  const blocks = [view !== "values" ? foundationsBlock(c, p) : "", view !== "foundations" ? valuesBlock(c, p) : ""].filter(Boolean);
  return `<div class="moral-grid ${blocks.length > 1 ? "two" : ""}">${blocks.join("")}</div>
    <div class="grid-2">
      ${kv("The line", f(cap(m.line)) + ".")}
      ${kv("Would cross it", f(cap(m.breakingPoint)) + ".")}
      ${system === "dnd5e" && state.settings.mode === "tabletop" ? kv("D&D 5e alignment", esc(toDnd5e(c, level).alignment)) : ""}
    </div>`;
}

function renderSheet(animate = false) {
  const c = state.current;
  if (!c) return;
  const { mode, depth, system, level } = state.settings;
  const p = renderProse(c);
  const x = textContext(c);
  const f = (s) => esc(fill(s, x));
  const id = c.core.identity;
  const first = esc(id.first);
  const quick = mode === "tabletop" && depth === "quick";
  const r = computeRarity(c);
  const showLove = state.settings.orient !== "off" && c.core.love;

  const B = {};

  // Header (identity)
  const lockedId = c.locks.includes("identity");
  const modeName = mode === "writer" ? "Writer" : quick ? "Quick NPC" : "Tabletop";
  B.identity = `<section class="dossier-head ${lockedId ? "is-locked" : ""}" aria-label="Identity">
    <div class="dossier-top">
      <span class="mode-label">${modeName} · ${esc(GENRES[c.genre].label)}</span>
      ${tools("identity", "Identity", lockedId)}
    </div>
    <h1 class="char-name">${esc(id.name)}</h1>
    <p class="pitch" data-reveal>${esc(p.pitch)}</p>
    <div class="chips" data-reveal>
      <span class="chip">${esc(cap(id.peopleLabel))}</span>
      <span class="chip">Age ${id.age}</span>
      <span class="chip">${esc(PRONOUNS[id.pronouns].label)}</span>
      ${showLove ? `<span class="chip">${esc(cap(loveLabel(c)))}</span>` : ""}
      <span class="chip">${esc(cap(stripArticle(id.occupation.t)))}</span>
      <span class="chip">From ${f(id.originShort)}</span>
    </div>
    ${rarityZone(r, c)}
    <span class="seed-stamp">Seed ${esc(c.seed)}</span>
  </section>`;

  const bg = c.core.background;
  B.background = sectionShell("background", LABELS.background, `
    <p>${esc(p.backstory)}</p>
    <div class="grid-2">
      ${kv("Grew up", f(bg.upbringing))}
      ${kv("Defining event", esc(cap(fill(bg.event.t, x))))}
      ${kv("Turning point", esc(cap(fill(bg.turningPoint, x))))}
    </div>`, c);

  const pe = c.core.personality;
  const sentence = (s) => esc(cap(fill(s, x))) + ".";
  B.personality = sectionShell("personality", LABELS.personality, `
    <div class="trait-list">${pe.traits.map((t) => `<span class="trait">${esc(t.t)}</span>`).join("")}</div>
    ${kv("Temperament", `${esc(cap(pe.temperament.t))}: ${f(pe.temperament.phrase)}`)}
    ${quick ? kv("Under stress", sentence(pe.stress)) : `
    ${big5Body(pe.big5)}
    <div class="grid-2">
      ${kv("Strengths", pe.strengths.map(sentence).join(" "))}
      ${kv("Under stress", sentence(pe.stress))}
      ${kv("In conflict", sentence(pe.conflict))}
      ${kv("With strangers", sentence(pe.strangers))}
      ${kv("Sense of humor", sentence(pe.humor))}
      ${kv("Daily habit", sentence(pe.habit))}
      ${kv("Likes", esc(cap(pe.likes.map((l) => fill(l, x)).join(", "))) + ".")}
      ${kv("Dislikes", esc(cap(pe.dislikes.map((l) => fill(l, x)).join(", "))) + ".")}
    </div>
    ${kv("Quirks", pe.quirks.map((q) => `${first} ${f(q)}.`).join(" "))}`}`, c);

  const fl = c.core.flaws;
  B.flaws = sectionShell("flaws", LABELS.flaws, `
    <div class="defining">${kv("Defining flaw", sentence(fl.defining))}</div>
    <div class="grid-2">
      ${kv("Other flaws", fl.minor.map(sentence).join(" "))}
      ${kv("Vice", sentence(fl.vice))}
      ${kv("Deep fear", `${sentence(fl.deepFear)}${fl.rooted ? ` <span class="note">Rooted in ${f(bg.event.short)}.</span>` : ""}`)}
      ${kv("Phobia", sentence(fl.phobia))}
      ${kv("Social fear", sentence(fl.socialFear))}
      ${kv("When afraid", `${first} ${f(fl.coping)}.`)}
    </div>`, c);

  const mo = c.core.motivation;
  B.motivation = sectionShell("motivation", LABELS.motivation, `
    ${kv("Wants", `${f(cap(mo.want))}`)}
    ${kv("Why", f(cap(mo.why)) + ".")}`, c);

  const ap = c.core.appearance;
  B.appearance = sectionShell("appearance", LABELS.appearance, `
    <p>${esc(cap(ap.build))}, with ${ap.features.map(f).join(" and ")}. Wears ${f(ap.style)}.</p>
    ${kv("Never without", f(ap.item))}`, c);

  const vo = c.core.voice;
  B.voice = sectionShell("voice", LABELS.voice, `
    <blockquote class="line">“${esc(p.voiceLine)}”</blockquote>
    <p>Speaks ${f(vo.desc)}. ${quick ? "" : vo.habits.map((h) => `${first} ${f(h)}.`).join(" ")}</p>`, c);

  B.hook = sectionShell("hook", LABELS.hook, `<p>${esc(p.hook)}</p>`, c);

  const gifts = giftList(c);
  B.gift = !gifts.length ? "" : sectionShell("gift", gifts.length > 1 ? "Gifts" : "Gift", `<ul class="gifts">${gifts.map((g) =>
    `<li class="gift-item g${g.tier}"><span class="gift-power" aria-label="Strength ${g.tier} of 4">${"◆".repeat(g.tier)}<span class="dim">${"◆".repeat(4 - g.tier)}</span></span><span>${first} ${f(g.t)}.</span></li>`).join("")}</ul>`, c);
  B.love = !showLove ? "" : sectionShell("love", LABELS.love, `<div class="grid-2">
      ${kv("Orientation", esc(cap(loveLabel(c))))}
      ${kv("Status", esc(cap(c.core.love.status)))}
    </div>
    <p>${esc(p.love)}</p>`, c);
  B.morality = sectionShell("morality", LABELS.morality, moralityBody(c, p, x, system, level), c);

  const rels = quick ? c.core.relationships.list.slice(0, 2) : c.core.relationships.list;
  B.relationships = sectionShell("relationships", LABELS.relationships, `<ul class="rels">
    ${rels.map((r) => `<li><span class="k">${esc(r.type)}</span><span><b>${esc(r.name)}</b> ${f(r.note)}.</span></li>`).join("")}
  </ul>`, c);

  B.tabletop = sectionShell("tabletop", system === "dnd5e" ? "Tabletop · D&D 5e" : "Tabletop · Any system", tabletopBody(c, p, x, { quick, system, level }), c);
  B.writer = sectionShell("writer", LABELS.writer, writerBody(c, p, x), c);

  const order = mode === "writer"
    ? ["identity", "gift", "writer", "morality", "background", "motivation", "love", "personality", "flaws", "voice", "appearance", "relationships", "hook"]
    : quick
      ? ["identity", "gift", "tabletop", "personality", "morality", "motivation", "hook", "voice"]
      : ["identity", "gift", "tabletop", "morality", "background", "personality", "flaws", "motivation", "love", "voice", "appearance", "hook", "relationships"];

  const sheet = $("#sheet");
  sheet.classList.remove("landed", "rolling", "tier-0", "tier-1", "tier-2", "tier-3", "tier-4");
  sheet.classList.add("card", `tier-${r.tier}`);
  sheet.innerHTML = order.map((k) => B[k]).join("");
  if (animate) {
    if (state.settings.reveal === "animated" && !reducedMotion()) {
      playReveal(sheet, c, r);
    } else {
      sheet.querySelector(".rarity-badge")?.classList.add("stamped");
      sfx.stamp(r.tier);
    }
  } else {
    sheet.querySelector(".rarity-badge")?.classList.add("stamped", "at-rest");
  }
}

function tabletopBody(c, p, x, { quick, system, level }) {
  const tt = c.layers.tabletop;
  const f = (s) => esc(fill(s, x));
  const strengths = `<div class="strengths">${STRENGTHS.map((s) => `
    <div class="strength"><span class="k">${cap(s)}</span>
      <span class="pips" role="img" aria-label="${cap(s)} ${tt.strengths[s]} of 5">${[1, 2, 3, 4, 5].map((i) => `<span class="pip ${i <= tt.strengths[s] ? "on" : ""}"></span>`).join("")}</span>
    </div>`).join("")}</div>`;

  let out = `<div class="grid-2">
    ${kv("Archetype", esc(p.archetypeLabel))}
    ${kv("In a fight", f(cap(tt.combatStyle)))}
  </div>
  ${strengths}`;
  if (!quick) {
    out += kv("Abilities", tt.abilities.map((a) => f(cap(a))).join(" · "));
    out += kv("Party hook", esc(p.partyHook));
  }
  out += kv("GM notes", esc(p.gmNotes));

  if (system === "dnd5e") {
    const d = toDnd5e(c, level);
    out += `<div class="statblock">
      <div><h3 class="statblock-title">${esc(d.ancestry)} ${esc(d.className)} ${d.level}</h3>
      <p class="statblock-sub">${esc(d.size)} · ${esc(d.alignment)}</p></div>
      <div class="abilities">${ABILITIES.map((a) => `<div class="ability"><div class="ab">${a.toUpperCase()}</div><div class="score">${d.scores[a]}</div><div class="md">${signed(d.mods[a])}</div></div>`).join("")}</div>
      <ul class="vitals">
        <li><b>AC</b>${d.ac} <span class="note">(${esc(d.armor)})</span></li>
        <li><b>HP</b>${d.hp} <span class="note">(${d.hitDice})</span></li>
        <li><b>SPEED</b>${d.speed} ft.</li>
        <li><b>PROF</b>${signed(d.prof)}</li>
        <li><b>SAVES</b>${esc(d.saves.join(", "))}</li>
      </ul>
      <p class="note">Scores rolled 4d6 drop lowest (${d.rolled.join(", ")}), highest placed in ${esc(d.className)} key abilities.${d.note ? ` ${esc(d.note)}` : ""}</p>
    </div>`;
  }
  return out;
}

function writerBody(c, p, x) {
  const wr = c.layers.writer;
  const f = (s) => esc(fill(s, x));
  return `
    <div class="grid-2">
      ${kv("Story role", esc(cap(wr.role)))}
      ${kv("Arc", esc(cap(wr.arcType)))}
      ${kv("Wants", f(cap(c.core.motivation.want)))}
      ${kv("Needs", f(cap(wr.need)))}
    </div>
    ${kv("The lie they believe", `<span class="lie">“${esc(wr.lie)}”</span>`)}
    ${kv("The wound", esc(p.wound) + ".")}
    ${kv("Would never say", `“${esc(wr.never)}”`)}
    <ol class="arc">
      <li><span class="k">Start</span>${esc(p.arc.start)}</li>
      <li><span class="k">Turn</span>${esc(p.arc.turn)}</li>
      <li><span class="k">End</span>${esc(p.arc.end)}</li>
    </ol>`;
}

// ---------- export ----------

function exportText() {
  const { mode, system, level, format } = state.settings;
  return format === "json" ? toJSON(state.current) : toMarkdown(state.current, { mode, system, level, showLove: state.settings.orient !== "off", ethics: state.settings.ethics });
}

function fillExport() {
  const ta = $("#export-text");
  if (ta) ta.value = exportText();
}

function openExport() {
  renderGroups();
  fillExport();
  $("#btn-download").hidden = inFrame;
  const d = $("#export-dialog");
  if (typeof d.showModal === "function") d.showModal(); else d.setAttribute("open", "");
}

async function copyExport() {
  const ta = $("#export-text");
  try {
    await navigator.clipboard.writeText(ta.value);
    toast("Copied");
  } catch {
    ta.focus();
    ta.select();
    toast("Text selected. Press Ctrl+C or ⌘C to copy");
  }
}

function downloadExport() {
  const json = state.settings.format === "json";
  const blob = new Blob([exportText()], { type: json ? "application/json" : "text/markdown" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${state.current.core.identity.name.replace(/[^\w-]+/g, "-").toLowerCase()}.${json ? "json" : "md"}`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

// ---------- events ----------

document.addEventListener("click", (e) => {
  // A click on the sheet mid-reveal skips to the result; a button click also does its job.
  if (isRevealing() && e.target.closest("#sheet")) {
    skipReveal();
    if (!e.target.closest("[data-action]")) return;
  }
  const seg = e.target.closest("[data-group]");
  if (seg) { setSetting(seg.dataset.group, seg.dataset.value); return; }
  const btn = e.target.closest("[data-action]");
  if (!btn) return;
  const { action, section, id } = btn.dataset;
  if (action === "roll") roll();
  else if (action === "reroll") reroll(section);
  else if (action === "lock") lock(section);
  else if (action === "save") save();
  else if (action === "export") openExport();
  else if (action === "copy") copyExport();
  else if (action === "download") downloadExport();
  else if (action === "open") openSaved(id);
  else if (action === "delete") deleteSaved(id);
});

$("#level").addEventListener("change", (e) => {
  const v = Math.max(1, Math.min(20, parseInt(e.target.value, 10) || 1));
  e.target.value = v;
  state.settings.level = v;
  writeLocal(SETTINGS_KEY, state.settings);
  renderSheet();
});

document.addEventListener("keydown", (e) => {
  if (e.key !== "r" && e.key !== "R") return;
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  if (e.target.closest("input, textarea, dialog[open]")) return;
  e.preventDefault();
  roll();
});

// ---------- start ----------

async function start() {
  sfx.enabled = state.settings.sound === "on";
  renderGroups();
  const persistent = await storage.init();
  $("#storage-note").hidden = persistent;
  state.roster = (await storage.list()).map(upgradeCharacter);
  let last = readLocal(CURRENT_KEY, null);
  if (last && last.core && GENRES[last.genre]) last = upgradeCharacter(last);
  if (last && last.core && GENRES[last.genre]) {
    state.settings.genre = last.genre;
    renderGroups();
    const savedCopy = state.roster.find((r) => r.id === last.id);
    if (savedCopy) state.savedSnapshot = JSON.stringify(savedCopy.core) + JSON.stringify(savedCopy.layers);
    setCurrent(last);
  } else {
    setCurrent(rollCharacter({ genre: state.settings.genre }));
  }

  if ("serviceWorker" in navigator && location.protocol.startsWith("http") && !inFrame) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
}

start();
