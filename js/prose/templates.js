// Built-in template prose provider. Turns the structured character into
// readable text with no network and no AI. Every ProseProvider returns the
// same shape, so an AI provider can replace any field later.

import { GENRES } from "../data/genres/index.js";
import { PRONOUNS, fill, cap, article, stripArticle } from "../engine/text.js";
import { ARCHETYPES } from "../engine/generate.js";
import { FOUNDATIONS, VALUES } from "../data/psyche.js";
import { joinList } from "../engine/text.js";
import { orientationLabel, spouseWord } from "../data/orientation.js";

const PARTNER_PRONOUNS = {
  woman: { pthey: "she", pthem: "her", ptheir: "her" },
  man: { pthey: "he", pthem: "him", ptheir: "his" },
  nonbinary: { pthey: "they", pthem: "them", ptheir: "their" },
};

// Moral Foundations: strongest and weakest foundation.
export function foundationSummary(c) {
  const f = c.core.morality?.foundations;
  if (!f) return null;
  const ranked = FOUNDATIONS.map((d) => ({ ...d, v: f[d.id] })).sort((a, b) => b.v - a.v);
  const top = ranked[0];
  const bottom = ranked[ranked.length - 1];
  const x = textContext(c);
  return {
    top, bottom, ranked,
    text: `${c.core.identity.first} ${fill(top.high, x)}, but ${fill(bottom.low, x)}.`,
  };
}

// Schwartz values: the top three, the least important, and any tension
// between top values that sit on opposite sides of the circle.
export function valuesSummary(c) {
  const v = c.core.morality?.values;
  if (!v) return null;
  const ranked = VALUES.map((d, i) => ({ ...d, i, v: v[d.id] })).sort((a, b) => b.v - a.v);
  const top = ranked.slice(0, 3);
  const least = ranked[ranked.length - 1];
  const dist = (a, b) => { const d = Math.abs(a.i - b.i); return Math.min(d, VALUES.length - d); };
  const torn = dist(top[0], top[1]) >= 4 ? [top[0], top[1]] : null;
  const first = c.core.identity.first;
  let text = `${first} is driven by ${joinList(top.map((t) => t.label.toLowerCase()))}, and cares least about ${least.label.toLowerCase()}.`;
  if (torn) text += ` ${torn[0].label} and ${torn[1].label.toLowerCase()} pull in opposite directions, and ${first} feels it.`;
  return { top, least, torn, ranked, text };
}

export function giftList(c) {
  const g = c.core.gift;
  if (!g) return [];
  if (Array.isArray(g.list)) return g.list;
  return g.none ? [] : [{ t: g.t, tier: g.tier }];
}

export function textContext(c) {
  const id = c.core.identity;
  const P = PRONOUNS[id.pronouns] || PRONOUNS.they;
  const G = GENRES[c.genre];
  return {
    ...P,
    ...G.vocab,
    name: id.name,
    first: id.first,
    originShort: id.originShort,
    eventShort: c.core.background?.event.short || "the past",
    wantShort: c.core.motivation?.short || "get what they want",
    ...loveTokens(c.core.love),
  };
}

function loveTokens(love) {
  if (!love || !love.partner) return {};
  const g = love.partner.gender;
  return {
    partner: love.partner.name,
    spouse: spouseWord(g),
    duration: love.years <= 1 ? "a year" : `${love.years} years`,
    ...(PARTNER_PRONOUNS[g] || PARTNER_PRONOUNS.nonbinary),
  };
}

// "bisexual", "lesbian", "attracted to men" and so on.
export function loveLabel(c) {
  const love = c.core.love;
  if (!love) return "";
  return orientationLabel({ id: love.orientation, target: love.target }, c.core.identity.pronouns, love.variant);
}

export const TemplateProvider = {
  id: "templates",
  label: "Built-in templates",
  available: true,

  render(c) {
    const x = textContext(c);
    const f = (s) => fill(s, x);
    const id = c.core.identity;
    const bg = c.core.background;
    const pe = c.core.personality;
    const fl = c.core.flaws;
    const mo = c.core.motivation;
    const vo = c.core.voice;
    const tt = c.layers.tabletop;
    const wr = c.layers.writer;
    const first = id.first;
    const traits = pe.traits.map((t) => t.t);
    const occ = stripArticle(id.occupation.t);
    const gifts = giftList(c);

    const pitch = `${cap(article(traits[0]))} ${traits[0]} ${occ} from ${f(id.originShort)} who wants to ${f(mo.short)}.`;

    const backstory = [
      `${first} comes from ${f(id.origin)} and grew up ${f(bg.upbringing)}.`,
      `Everything changed when ${f(bg.event.t)}.`,
      `Then came the turning point: ${f(bg.turningPoint)}.`,
      `Now ${first} is ${article(traits[0])} ${traits.join(", ")} ${occ}. ${f("{They} {is}")} ${f(pe.temperament.phrase)}.`,
      gifts.length ? `And ${first} ${joinList(gifts.map((g) => f(g.t)))}.` : "",
      `What ${first} wants most is ${f(mo.want)}, ${f(mo.why)}.`,
      `${f("{They}")} won't admit it, but ${f("{they} {is}")} afraid of ${f(fl.deepFear || fl.fears?.[0] || "the dark")}.`,
    ].filter(Boolean).join(" ");

    const mo2 = c.core.morality;
    const moral = mo2 ? {
      foundations: foundationSummary(c),
      values: valuesSummary(c),
      line: `${first} ${f(mo2.line)}, but would cross that line ${f(mo2.breakingPoint)}.`,
    } : null;

    const gmNotes = [
      `Play ${first} ${f(vo.desc)}. ${first} ${f(vo.habits[0])}.`,
      `Under pressure, ${first} ${f(fl.defining || fl.weaknesses?.[0] || "")}.`,
      `Bring up ${f(bg.event.short)} and watch ${f("{them}")} go quiet.`,
      moral ? moral.line : "",
    ].filter(Boolean).join(" ");

    let arc;
    if (wr.arcType === "positive") {
      arc = {
        start: `${first} sets out to ${f(mo.short)}, believing "${wr.lie}"`,
        turn: `${cap(f(wr.turn))}.`,
        end: `${first} learns ${f(wr.need)}.`,
      };
    } else if (wr.arcType === "negative") {
      arc = {
        start: `${first} sets out to ${f(mo.short)}, believing "${wr.lie}"`,
        turn: `${cap(f(wr.turn))}.`,
        end: `${first} doubles down on the lie and gets what ${f("{they}")} wanted, at a cost that can't be undone.`,
      };
    } else {
      arc = {
        start: `${first} has already seen through the lie "${wr.lie}"`,
        turn: `${cap(f(wr.turn))}.`,
        end: `${first} holds firm, and someone close to ${f("{them}")} lets go of that same lie.`,
      };
    }

    return {
      pitch,
      backstory,
      gmNotes,
      arc,
      wound: cap(f(bg.event.wound)),
      partyHook: `${first} ${f(tt.partyHook)}`,
      hook: `${first} ${f(c.core.hook.t)}`,
      voiceLine: f(vo.line),
      moral,
      gifts: gifts.map((g) => `${first} ${f(g.t)}.`),
      love: c.core.love ? `${first} ${f(c.core.love.note)}.` : null,
      archetypeLabel: ARCHETYPES[tt.archetype].label,
    };
  },
};
