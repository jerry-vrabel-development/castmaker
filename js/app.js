// Castmaker v0.1 — interface.

import { rollCharacter, rerollSection, toggleLock, STRENGTHS } from "./engine/generate.js";
import { GENRES, GENRE_ORDER } from "./data/genres/index.js";
import { renderProse } from "./prose/provider.js";
import { textContext } from "./prose/templates.js";
import { fill, cap, stripArticle, PRONOUNS } from "./engine/text.js";
import { toDnd5e, signed, ABILITIES } from "./engine/adapters/dnd5e.js";
import { toMarkdown, toJSON } from "./export.js";
import { storage } from "./storage.js";

// ---------- state ----------

const SETTINGS_KEY = "castmaker.settings.v1";
const CURRENT_KEY = "castmaker.current.v1";

const defaults = { genre: "fantasy", mode: "tabletop", depth: "full", system: "dnd5e", level: 1, format: "md" };
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
  if (key === "genre") {
    setCurrent(rollCharacter({ genre: value }), true);
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
  const prev = state.current;
  const c = rollCharacter({ genre: state.settings.genre, prev, locks: prev?.locks || [] });
  // Keep the same identity record when the person's identity is locked, so it stays one character.
  if (prev && prev.locks.includes("identity")) c.id = prev.id;
  state.savedSnapshot = c.id === prev?.id ? state.savedSnapshot : null;
  setCurrent(c, true);
}

function reroll(section) {
  setCurrent(rerollSection(state.current, section), false);
}

function lock(section) {
  setCurrent(toggleLock(state.current, section));
}

async function save() {
  const saved = await storage.save(state.current);
  state.current = saved;
  state.savedSnapshot = JSON.stringify(saved.core) + JSON.stringify(saved.layers);
  writeLocal(CURRENT_KEY, saved);
  state.roster = await storage.list();
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
        <span class="r-name">${esc(id.name)}</span>
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
  state.roster = await storage.list();
  if (state.current?.id === id) state.savedSnapshot = null;
  renderRoster();
  renderSaveButton();
  toast("Deleted");
}

// ---------- sheet rendering ----------

const LABELS = {
  background: "Background", personality: "Personality", flaws: "Flaws & fears", motivation: "Motivation",
  appearance: "Appearance", voice: "Voice", hook: "Secret / hook", relationships: "Relationships",
  tabletop: "Tabletop", writer: "Story",
};

function sectionShell(key, title, body, c) {
  const locked = c.locks.includes(key);
  return `<section class="sec ${locked ? "is-locked" : ""}" aria-label="${esc(title)}">
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
    <p class="pitch">${esc(p.pitch)}</p>
    <div class="chips">
      <span class="chip">${esc(cap(id.peopleLabel))}</span>
      <span class="chip">Age ${id.age}</span>
      <span class="chip">${esc(PRONOUNS[id.pronouns].label)}</span>
      <span class="chip">${esc(cap(stripArticle(id.occupation.t)))}</span>
      <span class="chip">From ${f(id.originShort)}</span>
    </div>
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

  const rels = quick ? c.core.relationships.list.slice(0, 2) : c.core.relationships.list;
  B.relationships = sectionShell("relationships", LABELS.relationships, `<ul class="rels">
    ${rels.map((r) => `<li><span class="k">${esc(r.type)}</span><span><b>${esc(r.name)}</b> ${f(r.note)}.</span></li>`).join("")}
  </ul>`, c);

  B.tabletop = sectionShell("tabletop", system === "dnd5e" ? "Tabletop · D&D 5e" : "Tabletop · Any system", tabletopBody(c, p, x, { quick, system, level }), c);
  B.writer = sectionShell("writer", LABELS.writer, writerBody(c, p, x), c);

  const order = mode === "writer"
    ? ["identity", "writer", "background", "motivation", "personality", "flaws", "voice", "appearance", "relationships", "hook"]
    : quick
      ? ["identity", "tabletop", "personality", "motivation", "hook", "voice"]
      : ["identity", "tabletop", "background", "personality", "flaws", "motivation", "voice", "appearance", "hook", "relationships"];

  const sheet = $("#sheet");
  sheet.innerHTML = order.map((k) => B[k]).join("");
  if (animate) {
    sheet.classList.remove("just-rolled");
    void sheet.offsetWidth;
    sheet.classList.add("just-rolled");
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
      ${d.note ? `<p class="note">${esc(d.note)}</p>` : ""}
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
  return format === "json" ? toJSON(state.current) : toMarkdown(state.current, { mode, system, level });
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
  renderGroups();
  const persistent = await storage.init();
  $("#storage-note").hidden = persistent;
  state.roster = await storage.list();
  const last = readLocal(CURRENT_KEY, null);
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
