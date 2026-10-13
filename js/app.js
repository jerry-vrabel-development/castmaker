// Castmaker — interface.

import { rollCharacter, rerollSection, toggleLock, upgradeCharacter, STRENGTHS } from "./engine/generate.js";
import { GENRES, GENRE_ORDER } from "./data/genres/index.js";
import { renderProse } from "./prose/provider.js";
import { textContext, loveLabel } from "./prose/templates.js";
import { fill, cap, stripArticle, PRONOUNS } from "./engine/text.js";
import { oneIn } from "./engine/dice.js";
import { MORAL_NAMES } from "./data/shared.js";
import { toDnd5e, signed, ABILITIES } from "./engine/adapters/dnd5e.js";
import { toMarkdown, toJSON } from "./export.js";
import { storage } from "./storage.js";
import { computeRarity, TIERS } from "./engine/rarity.js";
import { ORIENTATION_SOURCE } from "./data/orientation.js";
import { sfx, reducedMotion, playReveal, skipReveal, isRevealing, flashSection } from "./reveal.js";

const SMOOTH = () => (reducedMotion() ? "auto" : "smooth");

// ---------- state ----------

const SETTINGS_KEY = "castmaker.settings.v1";
const CURRENT_KEY = "castmaker.current.v1";

const defaults = { genre: "fantasy", mode: "tabletop", depth: "full", system: "dnd5e", level: 1, format: "md", reveal: "animated", sound: "on", orient: "realistic" };
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
  tabletop: "Tabletop", writer: "Story", gift: "Gift", morality: "Moral compass", love: "Love life",
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
      <span class="rarity-story">${esc(r.tierInfo.story)}</span>
      <span class="rarity-meta">${esc(oneIn(r.gradeOdds))} rolls</span>
      <button type="button" class="icon-btn grade-lock" data-action="lock" data-section="grade" aria-pressed="${locked}" aria-label="${locked ? "Unlock" : "Lock"} grade">${locked ? ICON.lock : ICON.unlock}<span class="lbl">${locked ? "Grade locked" : "Lock grade"}</span></button>
    </div>
    <details class="odds">
      <summary>How the grade works</summary>
      <p class="odds-note">A character has one rarity: its grade. It comes from real dice: six ability scores rolled 4d6, dropping the lowest die. The total sets the grade (Common up to 73, Uncommon 74+, Rare 79+, Epic 84+, Legendary 88+), so each grade's chance is the exact chance of rolling that well. This total of ${r.total} or better comes up ${esc(oneIn(r.atLeast))} rolls. The grade decides how much story the character carries: gifts, the size of their secrets and wants, and how deep their arc goes. Lock the grade to keep a hero and reroll everything else.</p>
    </details>
  </div>`;
}

// Moral compass: order runs left (Order) to right (Freedom), mercy top (Mercy) to bottom (Ruthless).
function compassBody(c, p, x, system, level) {
  const m = c.core.morality;
  const f = (s) => esc(fill(s, x));
  // Kept inside the frame so a character at an extreme still shows fully.
  const left = 8 + ((1 - m.order) / 2) * 84;
  const top = 8 + ((1 - m.mercy) / 2) * 84;
  const band = (v) => (v >= 0.33 ? 0 : v <= -0.33 ? 2 : 1);
  const cells = MORAL_NAMES.flatMap((row, ri) => row.map((name, ci) =>
    `<span class="cell ${ri === band(m.mercy) && ci === band(m.order) ? "on" : ""}">${esc(name)}</span>`)).join("");
  return `<div class="compass-wrap">
    <div class="compass-frame">
      <span class="axis ax-top">Mercy</span>
      <span class="axis ax-bottom">Ruthlessness</span>
      <span class="axis ax-left">Order</span>
      <span class="axis ax-right">Freedom</span>
      <div class="compass" role="img" aria-label="Moral compass: ${esc(p.moral.label)}. Order ${m.order}, mercy ${m.mercy}.">
        ${cells}
        <span class="compass-dot" style="left:${left.toFixed(1)}%;top:${top.toFixed(1)}%"></span>
      </div>
    </div>
    <div class="compass-text">
      <p class="moral-name">${esc(p.moral.label)}</p>
      ${kv("The line", f(cap(m.line)) + ".")}
      ${kv("Would cross it", f(cap(m.breakingPoint)) + ".")}
      ${system === "dnd5e" ? kv("D&D 5e alignment", esc(toDnd5e(c, level).alignment)) : ""}
    </div>
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
  B.personality = sectionShell("personality", LABELS.personality, `
    <div class="trait-list">${pe.traits.map((t) => `<span class="trait">${esc(t.t)}</span>`).join("")}</div>
    ${kv("Temperament", `${esc(cap(pe.temperament.t))}: ${f(pe.temperament.phrase)}`)}
    ${quick ? "" : kv("Quirks", pe.quirks.map((q) => `${first} ${f(q)}.`).join(" "))}`, c);

  const fl = c.core.flaws;
  B.flaws = sectionShell("flaws", LABELS.flaws, `<div class="grid-2">
    ${kv("Flaws", fl.weaknesses.map((w) => esc(cap(fill(w, x)))).join(". ") + ".")}
    ${kv("Fears", fl.fears.map((w) => esc(cap(fill(w, x)))).join(". ") + ".")}
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

  B.gift = c.core.gift?.none ? "" : sectionShell("gift", LABELS.gift, `<p>${esc(p.gift)}</p>`, c);
  B.love = !showLove ? "" : sectionShell("love", LABELS.love, `<div class="grid-2">
      ${kv("Orientation", esc(cap(loveLabel(c))))}
      ${kv("Status", esc(cap(c.core.love.status)))}
    </div>
    <p>${esc(p.love)}</p>
    <p class="note">${c.options?.orientation === "even"
      ? "Orientation drawn with even odds."
      : `Orientation drawn with real-world odds from <a href="${ORIENTATION_SOURCE.url}" target="_blank" rel="noopener">${ORIENTATION_SOURCE.short}</a>. It never affects the grade.`}</p>`, c);
  B.morality = sectionShell("morality", LABELS.morality, compassBody(c, p, x, system, level), c);

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
  sheet.classList.remove("glow-3", "glow-4");
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
  const grade = c.core.grade?.tier ?? 2;
  // Story depth follows grade: extras get a role and a want, named NPCs add
  // the lie and wound, supporting characters and up get a full arc.
  if (grade === 0) {
    return `<div class="grid-2">
        ${kv("Story role", esc(cap(wr.role)))}
        ${kv("Wants", f(cap(c.core.motivation.want)))}
      </div>
      <p class="note">Background characters don't carry an arc. Lock anything you like and roll again for a bigger part.</p>`;
  }
  if (grade === 1) {
    return `<div class="grid-2">
        ${kv("Story role", esc(cap(wr.role)))}
        ${kv("Wants", f(cap(c.core.motivation.want)))}
      </div>
      ${kv("The lie they believe", `<span class="lie">“${esc(wr.lie)}”</span>`)}
      ${kv("The wound", esc(p.wound) + ".")}
      <p class="note">Named NPCs carry a lie and a wound, but not a full arc.</p>`;
  }
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
  return format === "json" ? toJSON(state.current) : toMarkdown(state.current, { mode, system, level, showLove: state.settings.orient !== "off" });
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
