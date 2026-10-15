// Building blocks for the character sheet. Every function returns HTML;
// all character text passes through esc() first.

import {
  ABILITIES,
  BIG5_DIMS,
  FOUNDATIONS,
  STRENGTHS,
  VALUES,
  cap,
  fill,
  oneIn,
  signed,
  toDnd5e,
  type Big5,
  type Character,
  type ProseResult,
  type RarityInfo,
  type SectionKey,
  type TextContext,
} from "../../engine/index.ts";
import { ICON, esc } from "../dom.ts";

export const kv = (k: string, v: string): string =>
  `<div class="kv"><span class="k">${esc(k)}</span><p class="v">${v}</p></div>`;

const fmt1 = (n: number) => Number(n).toFixed(1);
/** Position of a 1-5 score along a bar, as a percentage. */
const pct = (v: number) => (((v - 1) / 4) * 100).toFixed(1);

export function tools(key: SectionKey, title: string, locked: boolean): string {
  return `<div class="tools">
    <button type="button" class="icon-btn" data-action="lock" data-section="${key}" aria-pressed="${locked}" aria-label="${locked ? "Unlock" : "Lock"} ${esc(title)}">${locked ? ICON.lock : ICON.unlock}<span class="lbl">${locked ? "Locked" : "Lock"}</span></button>
    <button type="button" class="icon-btn" data-action="reroll" data-section="${key}" aria-label="Reroll ${esc(title)}" ${locked ? "disabled" : ""}>${ICON.dice}<span class="lbl">Reroll</span></button>
  </div>`;
}

export function sectionShell(key: SectionKey, title: string, body: string, c: Character): string {
  const locked = c.locks.includes(key);
  return `<section class="sec ${locked ? "is-locked" : ""}" aria-label="${esc(title)}" data-reveal data-section-key="${key}">
    <div class="sec-head">
      <h2 class="sec-title">${esc(title)}</h2>
      ${tools(key, title, locked)}
    </div>
    <div class="sec-body">${body}</div>
  </section>`;
}

/** The six dice, their total, and the grade badge. */
export function rarityZone(r: RarityInfo, c: Character): string {
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

/** Big Five: each dimension as a scale between its two poles. */
export function big5Body(big5: Big5): string {
  return `<div class="b5">${BIG5_DIMS.map(
    (d) => `
    <div class="b5-row">
      <span class="b5-low">${esc(d.low)}</span>
      <span class="b5-track" role="img" aria-label="${esc(d.label)} ${fmt1(big5[d.id])} of 5"><span class="b5-dot" style="left:${pct(big5[d.id])}%"></span></span>
      <span class="b5-high">${esc(d.high)}</span>
      <span class="b5-name">${esc(d.label)}</span>
    </div>`,
  ).join("")}</div>`;
}

function foundationsBlock(c: Character, p: ProseResult): string {
  const sum = p.moral?.foundations;
  if (!sum) return "";
  const f = c.core.morality.foundations;
  return `<div class="moral-block">
    <h3 class="moral-title">Moral Foundations</h3>
    <p class="moral-sum">${esc(sum.text)}</p>
    <div class="bars">${FOUNDATIONS.map(
      (d) => `
      <div class="bar-row ${d.id === sum.top.id ? "is-top" : d.id === sum.bottom.id ? "is-low" : ""}">
        <span class="bar-label" title="${esc(d.desc)}">${esc(d.label)}</span>
        <span class="bar"><span class="bar-fill" style="width:${pct(f[d.id] ?? 3)}%"></span></span>
        <span class="bar-val">${fmt1(f[d.id] ?? 3)}</span>
      </div>`,
    ).join("")}</div>
  </div>`;
}

/** Schwartz values as a ten-spoke wheel; neighbors are compatible, opposites conflict. */
function valuesBlock(c: Character, p: ProseResult): string {
  const sum = p.moral?.values;
  if (!sum) return "";
  const v = c.core.morality.values;
  const n = VALUES.length;
  const R = 78;
  const top = new Set(sum.top.map((t) => t.id));
  const pt = (i: number, r: number): [number, number] => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2;
    return [Math.cos(a) * r, Math.sin(a) * r];
  };
  const xy = (q: [number, number]) => q.map((x) => x.toFixed(1)).join(",");
  const reach = (id: string) => R * (0.15 + 0.85 * (((v[id] ?? 3) - 1) / 4));
  const rings = [0.25, 0.5, 0.75, 1]
    .map((k) => `<polygon class="w-ring" points="${VALUES.map((_, i) => xy(pt(i, R * k))).join(" ")}"/>`)
    .join("");
  const spokes = VALUES.map((_, i) => {
    const [x, y] = pt(i, R);
    return `<line class="w-spoke" x1="0" y1="0" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}"/>`;
  }).join("");
  const shape = VALUES.map((d, i) => xy(pt(i, reach(d.id)))).join(" ");
  const dots = VALUES.map((d, i) => {
    const [x, y] = pt(i, reach(d.id));
    return `<circle class="w-dot ${top.has(d.id) ? "is-top" : ""}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${top.has(d.id) ? 4 : 2.5}"/>`;
  }).join("");
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

export interface MoralityView {
  ethics: "foundations" | "values" | "both";
  showAlignment: boolean;
  level: number;
}

export function moralityBody(c: Character, p: ProseResult, x: TextContext, view: MoralityView): string {
  const m = c.core.morality;
  const f = (s: string) => esc(fill(s, x));
  const blocks = [
    view.ethics !== "values" ? foundationsBlock(c, p) : "",
    view.ethics !== "foundations" ? valuesBlock(c, p) : "",
  ].filter(Boolean);
  return `<div class="moral-grid ${blocks.length > 1 ? "two" : ""}">${blocks.join("")}</div>
    <div class="grid-2">
      ${kv("The line", f(cap(m.line)) + ".")}
      ${kv("Would cross it", f(cap(m.breakingPoint)) + ".")}
      ${view.showAlignment ? kv("D&D 5e alignment", esc(toDnd5e(c, view.level).alignment)) : ""}
    </div>`;
}

export function tabletopBody(
  c: Character,
  p: ProseResult,
  x: TextContext,
  { quick, system, level }: { quick: boolean; system: "dnd5e" | "agnostic"; level: number },
): string {
  const tt = c.layers.tabletop;
  const f = (s: string) => esc(fill(s, x));
  const strengths = `<div class="strengths">${STRENGTHS.map(
    (s) => `
    <div class="strength"><span class="k">${cap(s)}</span>
      <span class="pips" role="img" aria-label="${cap(s)} ${tt.strengths[s]} of 5">${[1, 2, 3, 4, 5].map((i) => `<span class="pip ${i <= tt.strengths[s] ? "on" : ""}"></span>`).join("")}</span>
    </div>`,
  ).join("")}</div>`;

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

export function writerBody(c: Character, p: ProseResult, x: TextContext): string {
  const wr = c.layers.writer;
  const f = (s: string) => esc(fill(s, x));
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
