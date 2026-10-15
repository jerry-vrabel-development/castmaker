// Renders the current character onto the card.

import {
  GENRES,
  PRONOUNS,
  cap,
  computeRarity,
  fill,
  giftList,
  loveLabel,
  renderProse,
  stripArticle,
  textContext,
  type SectionKey,
} from "../../engine/index.ts";
import { $, esc, reducedMotion } from "../dom.ts";
import { state } from "../state.ts";
import { playReveal } from "../reveal.ts";
import { sfx } from "../sound.ts";
import { big5Body, kv, moralityBody, rarityZone, sectionShell, tabletopBody, tools, writerBody } from "./parts.ts";

const LABELS: Partial<Record<SectionKey, string>> = {
  background: "Background",
  personality: "Personality",
  flaws: "Flaws & fears",
  motivation: "Motivation",
  appearance: "Appearance",
  voice: "Voice",
  hook: "Secret / hook",
  relationships: "Relationships",
  tabletop: "Tabletop",
  writer: "Story",
  gift: "Gift",
  morality: "Morality",
  love: "Love life",
};
const label = (k: SectionKey) => LABELS[k] ?? k;

// Section order for each view.
const ORDER: Record<"writer" | "quick" | "full", SectionKey[]> = {
  writer: [
    "identity",
    "gift",
    "writer",
    "morality",
    "background",
    "motivation",
    "love",
    "personality",
    "flaws",
    "voice",
    "appearance",
    "relationships",
    "hook",
  ],
  quick: ["identity", "gift", "tabletop", "personality", "morality", "motivation", "hook", "voice"],
  full: [
    "identity",
    "gift",
    "tabletop",
    "morality",
    "background",
    "personality",
    "flaws",
    "motivation",
    "love",
    "voice",
    "appearance",
    "hook",
    "relationships",
  ],
};

export function renderSheet(animate = false): void {
  const c = state.current;
  if (!c) return;
  const { mode, depth, system, level } = state.settings;
  const p = renderProse(c);
  const x = textContext(c);
  const f = (s: string) => esc(fill(s, x));
  const sentence = (s: string) => esc(cap(fill(s, x))) + ".";
  const id = c.core.identity;
  const first = esc(id.first);
  const quick = mode === "tabletop" && depth === "quick";
  const r = computeRarity(c);
  const showLove = state.settings.orient !== "off" && !!c.core.love;

  const B: Partial<Record<SectionKey, string>> = {};

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
  B.background = sectionShell(
    "background",
    label("background"),
    `
    <p>${esc(p.backstory)}</p>
    <div class="grid-2">
      ${kv("Grew up", f(bg.upbringing))}
      ${kv("Defining event", esc(cap(fill(bg.event.t, x))))}
      ${kv("Turning point", esc(cap(fill(bg.turningPoint, x))))}
    </div>`,
    c,
  );

  const pe = c.core.personality;
  B.personality = sectionShell(
    "personality",
    label("personality"),
    `
    <div class="trait-list">${pe.traits.map((t) => `<span class="trait">${esc(t.t)}</span>`).join("")}</div>
    ${kv("Temperament", `${esc(cap(pe.temperament.t))}: ${f(pe.temperament.phrase)}`)}
    ${
      quick
        ? kv("Under stress", sentence(pe.stress))
        : `
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
    ${kv("Quirks", pe.quirks.map((q) => `${first} ${f(q)}.`).join(" "))}`
    }`,
    c,
  );

  const fl = c.core.flaws;
  B.flaws = sectionShell(
    "flaws",
    label("flaws"),
    `
    <div class="defining">${kv("Defining flaw", sentence(fl.defining))}</div>
    <div class="grid-2">
      ${kv("Other flaws", fl.minor.map(sentence).join(" "))}
      ${kv("Vice", sentence(fl.vice))}
      ${kv("Deep fear", `${sentence(fl.deepFear)}${fl.rooted ? ` <span class="note">Rooted in ${f(bg.event.short)}.</span>` : ""}`)}
      ${kv("Phobia", sentence(fl.phobia))}
      ${kv("Social fear", sentence(fl.socialFear))}
      ${kv("When afraid", `${first} ${f(fl.coping)}.`)}
    </div>`,
    c,
  );

  const mo = c.core.motivation;
  B.motivation = sectionShell(
    "motivation",
    label("motivation"),
    `
    ${kv("Wants", `${f(cap(mo.want))}`)}
    ${kv("Why", f(cap(mo.why)) + ".")}`,
    c,
  );

  const ap = c.core.appearance;
  B.appearance = sectionShell(
    "appearance",
    label("appearance"),
    `
    <p>${esc(cap(ap.build))}, with ${ap.features.map(f).join(" and ")}. Wears ${f(ap.style)}.</p>
    ${kv("Never without", f(ap.item))}`,
    c,
  );

  const vo = c.core.voice;
  B.voice = sectionShell(
    "voice",
    label("voice"),
    `
    <blockquote class="line">“${esc(p.voiceLine)}”</blockquote>
    <p>Speaks ${f(vo.desc)}. ${quick ? "" : vo.habits.map((h) => `${first} ${f(h)}.`).join(" ")}</p>`,
    c,
  );

  B.hook = sectionShell("hook", label("hook"), `<p>${esc(p.hook)}</p>`, c);

  const gifts = giftList(c);
  B.gift = !gifts.length
    ? ""
    : sectionShell(
        "gift",
        gifts.length > 1 ? "Gifts" : "Gift",
        `<ul class="gifts">${gifts
          .map(
            (g) =>
              `<li class="gift-item g${g.tier}"><span class="gift-power" aria-label="Strength ${g.tier} of 4">${"◆".repeat(g.tier)}<span class="dim">${"◆".repeat(4 - g.tier)}</span></span><span>${first} ${f(g.t)}.</span></li>`,
          )
          .join("")}</ul>`,
        c,
      );

  B.love = !showLove
    ? ""
    : sectionShell(
        "love",
        label("love"),
        `<div class="grid-2">
      ${kv("Orientation", esc(cap(loveLabel(c))))}
      ${kv("Status", esc(cap(c.core.love.status)))}
    </div>
    <p>${esc(p.love)}</p>`,
        c,
      );

  B.morality = sectionShell(
    "morality",
    label("morality"),
    moralityBody(c, p, x, {
      ethics: state.settings.ethics,
      showAlignment: system === "dnd5e" && mode === "tabletop",
      level,
    }),
    c,
  );

  const rels = quick ? c.core.relationships.list.slice(0, 2) : c.core.relationships.list;
  B.relationships = sectionShell(
    "relationships",
    label("relationships"),
    `<ul class="rels">
    ${rels.map((rel) => `<li><span class="k">${esc(rel.type)}</span><span><b>${esc(rel.name)}</b> ${f(rel.note)}.</span></li>`).join("")}
  </ul>`,
    c,
  );

  B.tabletop = sectionShell(
    "tabletop",
    system === "dnd5e" ? "Tabletop · D&D 5e" : "Tabletop · Any system",
    tabletopBody(c, p, x, { quick, system, level }),
    c,
  );
  B.writer = sectionShell("writer", label("writer"), writerBody(c, p, x), c);

  const order = ORDER[mode === "writer" ? "writer" : quick ? "quick" : "full"];

  const sheet = $("#sheet");
  sheet.classList.remove("landed", "rolling", "tier-0", "tier-1", "tier-2", "tier-3", "tier-4");
  sheet.classList.add("card", `tier-${r.tier}`);
  sheet.innerHTML = order.map((k) => B[k] ?? "").join("");
  if (animate) {
    if (state.settings.reveal === "animated" && !reducedMotion()) {
      void playReveal(sheet, c, r);
    } else {
      sheet.querySelector(".rarity-badge")?.classList.add("stamped");
      sfx.stamp(r.tier);
    }
  } else {
    sheet.querySelector(".rarity-badge")?.classList.add("stamped", "at-rest");
  }
}
