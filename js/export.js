// Markdown and JSON export.

import { renderProse, } from "./prose/provider.js";
import { textContext, loveLabel } from "./prose/templates.js";
import { fill, cap, stripArticle } from "./engine/text.js";
import { toDnd5e, signed, ABILITIES, ATTRIBUTION } from "./engine/adapters/dnd5e.js";
import { STRENGTHS } from "./engine/generate.js";
import { PRONOUNS } from "./engine/text.js";
import { GENRES } from "./data/genres/index.js";
import { computeRarity } from "./engine/rarity.js";
import { oneIn } from "./engine/dice.js";
import { BIG5, FOUNDATIONS, VALUES } from "./data/psyche.js";

export function toJSON(c) {
  const strip = (o) => JSON.parse(JSON.stringify(o, (k, v) => (k === "_tags" ? undefined : v)));
  return JSON.stringify(strip(c), null, 2);
}

export function toMarkdown(c, { mode = "tabletop", system = "dnd5e", level = 1, showLove = true, ethics = "both" } = {}) {
  const p = renderProse(c);
  const x = textContext(c);
  const f = (s) => fill(s, x);
  const id = c.core.identity;
  const first = id.first;
  const L = [];

  L.push(`# ${id.name}`, "", `*${p.pitch}*`, "");
  L.push(`**${cap(id.peopleLabel)}, ${id.age}** · ${PRONOUNS[id.pronouns].label} · ${cap(stripArticle(id.occupation.t))} · ${GENRES[c.genre].label}`, "");

  const r = computeRarity(c);
  L.push(`**Grade: ${r.tierInfo.label}** · rolled ${r.rolls.join(", ")} = ${r.total} · ${oneIn(r.gradeOdds)} rolls land in this grade`, "");
  if (p.gifts.length) L.push(`**Gift${p.gifts.length > 1 ? "s" : ""}:** ${p.gifts.join(" ")}`, "");
  if (p.love && showLove) L.push(`**Love life:** ${cap(loveLabel(c))}. ${p.love}`, "");
  L.push("## Background", "", p.backstory, "");
  const pe = c.core.personality;
  L.push("## Personality", "");
  L.push(`- **Big Five:** ${BIG5.map((d) => `${d.label} ${pe.big5[d.id].toFixed(1)}`).join(", ")} (1 to 5)`);
  L.push(`- **Traits:** ${pe.traits.map((t) => t.t).join(", ")}`);
  L.push(`- **Temperament:** ${pe.temperament.t}, ${f(pe.temperament.phrase)}`);
  L.push(`- **Strengths:** ${pe.strengths.map(f).join("; ")}`);
  L.push(`- **Under stress:** ${f(pe.stress)}`);
  L.push(`- **In conflict:** ${f(pe.conflict)}`);
  L.push(`- **With strangers:** ${f(pe.strangers)}`);
  L.push(`- **Humor:** ${f(pe.humor)}`);
  L.push(`- **Likes:** ${pe.likes.map(f).join(", ")} · **Dislikes:** ${pe.dislikes.map(f).join(", ")}`);
  L.push(`- **Habit:** ${first} ${f(pe.habit)}`);
  L.push(`- **Quirks:** ${pe.quirks.map((q) => `${first} ${f(q)}`).join("; ")}`, "");
  const fl = c.core.flaws;
  L.push("## Flaws & fears", "");
  L.push(`- **Defining flaw:** ${f(fl.defining)}`);
  L.push(`- **Other flaws:** ${fl.minor.map(f).join("; ")}`);
  L.push(`- **Vice:** ${f(fl.vice)}`);
  L.push(`- **Deep fear:** ${f(fl.deepFear)}${fl.rooted ? `, rooted in ${f(c.core.background.event.short)}` : ""}`);
  L.push(`- **Phobia:** ${f(fl.phobia)}`);
  L.push(`- **Social fear:** ${f(fl.socialFear)}`);
  L.push(`- **When afraid:** ${first} ${f(fl.coping)}`, "");
  if (p.moral) {
    const m = c.core.morality;
    L.push("## Morality", "");
    if (ethics !== "values" && p.moral.foundations) {
      L.push(`**Moral Foundations:** ${p.moral.foundations.text}`, "");
      L.push(`${FOUNDATIONS.map((d) => `${d.label} ${m.foundations[d.id].toFixed(1)}`).join(" · ")} (1 to 5)`, "");
    }
    if (ethics !== "foundations" && p.moral.values) {
      L.push(`**Values:** ${p.moral.values.text}`, "");
      L.push(`${VALUES.map((d) => `${d.label} ${m.values[d.id].toFixed(1)}`).join(" · ")} (1 to 5)`, "");
    }
    L.push(p.moral.line, "");
  }

  const ap = c.core.appearance;
  L.push("## Appearance", "", `${cap(ap.build)}, with ${ap.features.map(f).join(" and ")}. Wears ${f(ap.style)}. Never without ${f(ap.item)}.`, "");
  L.push("## Voice", "", `Speaks ${f(c.core.voice.desc)}. ${c.core.voice.habits.map((h) => `${first} ${f(h)}.`).join(" ")}`, "", `> "${p.voiceLine}"`, "");
  L.push("## Hook", "", p.hook, "");
  L.push("## Relationships", "");
  for (const r of c.core.relationships.list) L.push(`- **${r.type}: ${r.name}** ${f(r.note)}.`);
  L.push("");

  if (mode === "tabletop") {
    const tt = c.layers.tabletop;
    L.push("## Tabletop", "");
    L.push(`- **Archetype:** ${p.archetypeLabel}`);
    L.push(`- **Strengths:** ${STRENGTHS.map((s) => `${cap(s)} ${tt.strengths[s]}/5`).join(", ")}`);
    L.push(`- **Combat style:** ${f(tt.combatStyle)}`);
    L.push(`- **Abilities:** ${tt.abilities.map(f).join("; ")}`);
    L.push(`- **Party hook:** ${p.partyHook}`);
    L.push(`- **GM notes:** ${p.gmNotes}`, "");
    if (system === "dnd5e") {
      const d = toDnd5e(c, level);
      L.push(`### D&D 5e`, "", `**${d.ancestry} ${d.className} ${d.level}** · ${d.size} · ${d.alignment}`, "");
      L.push(`| ${ABILITIES.map((a) => a.toUpperCase()).join(" | ")} |`, `|${ABILITIES.map(() => "---").join("|")}|`);
      L.push(`| ${ABILITIES.map((a) => `${d.scores[a]} (${signed(d.mods[a])})`).join(" | ")} |`, "");
      L.push(`- **AC** ${d.ac} (${d.armor}) · **HP** ${d.hp} (${d.hitDice}) · **Speed** ${d.speed} ft. · **Proficiency** ${signed(d.prof)}`);
      L.push(`- **Saving throws:** ${d.saves.join(", ")}`);
      if (d.note) L.push(`- *${d.note}*`);
      L.push("", `<sub>${ATTRIBUTION}</sub>`, "");
    }
  } else {
    const wr = c.layers.writer;
    L.push("## Writer", "");
    L.push(`- **Story role:** ${cap(wr.role)}`);
    L.push(`- **Want:** ${f(c.core.motivation.want)}`);
    L.push(`- **Need:** ${f(wr.need)}`);
    L.push(`- **The lie:** "${wr.lie}"`);
    L.push(`- **The wound:** ${p.wound}`);
    L.push(`- **Would never say:** "${wr.never}"`, "");
    L.push(`### ${cap(wr.arcType)} arc`, "", `1. ${p.arc.start}`, `2. ${p.arc.turn}`, `3. ${p.arc.end}`, "");
  }

  L.push("---", `Generated by Castmaker · seed \`${c.seed}\``);
  return L.join("\n");
}
