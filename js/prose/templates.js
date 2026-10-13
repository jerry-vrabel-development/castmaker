// Built-in template prose provider. Turns the structured character into
// readable text with no network and no AI. Every ProseProvider returns the
// same shape, so an AI provider can replace any field later.

import { GENRES } from "../data/genres/index.js";
import { PRONOUNS, fill, cap, article, stripArticle } from "../engine/text.js";
import { ARCHETYPES } from "../engine/generate.js";
import { MORAL_NAMES } from "../data/shared.js";

// Name for a point on the moral compass.
export function moralLabel(m) {
  if (!m) return "Unknown";
  const band = (v) => (v >= 0.33 ? 0 : v <= -0.33 ? 2 : 1);
  return MORAL_NAMES[band(m.mercy)][band(m.order)];
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
  };
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

    const pitch = `${cap(article(traits[0]))} ${traits[0]} ${occ} from ${f(id.originShort)} who wants to ${f(mo.short)}.`;

    const backstory = [
      `${first} comes from ${f(id.origin)} and grew up ${f(bg.upbringing)}.`,
      (c.core.grade?.tier ?? 2) >= 2 ? `Everything changed when ${f(bg.event.t)}.` : `What shaped ${first} most: ${f(bg.event.t)}.`,
      `Then came the turning point: ${f(bg.turningPoint)}.`,
      `Now ${first} is ${article(traits[0])} ${traits.join(", ")} ${occ}. ${f("{They} {is}")} ${f(pe.temperament.phrase)}.`,
      c.core.gift && !c.core.gift.none ? `And ${first} ${f(c.core.gift.t)}.` : "",
      `What ${first} wants most is ${f(mo.want)}, ${f(mo.why)}.`,
      `${f("{They}")} won't admit it, but ${f("{they} {is}")} afraid of ${f(fl.fears[0])}.`,
    ].filter(Boolean).join(" ");

    const mo2 = c.core.morality;
    const moral = mo2 ? {
      label: moralLabel(mo2),
      line: `${first} ${f(mo2.line)}, but would cross that line ${f(mo2.breakingPoint)}.`,
    } : null;

    const gmNotes = [
      `Play ${first} ${f(vo.desc)}. ${first} ${f(vo.habits[0])}.`,
      `Under pressure, ${first} ${f(fl.weaknesses[0])}.`,
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
      gift: c.core.gift && !c.core.gift.none ? `${first} ${f(c.core.gift.t)}.` : null,
      archetypeLabel: ARCHETYPES[tt.archetype].label,
    };
  },
};
