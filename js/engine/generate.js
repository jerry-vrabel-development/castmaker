// The rules engine. Builds a structured character section by section.
//
// Coherence comes from a running "tag bag": every section records the tags of
// what it picked, and later picks are weighted toward entries sharing those
// tags. Locked sections are never regenerated, but their tags still steer
// everything else.

import * as T from "../data/shared.js";
import { GENRES } from "../data/genres/index.js";
import { makeRng, newSeed } from "./rng.js";

export const CORE_SECTIONS = ["identity", "background", "personality", "flaws", "motivation", "appearance", "voice", "hook", "relationships"];
export const LAYER_SECTIONS = ["tabletop", "writer"];
export const SECTIONS = [...CORE_SECTIONS, ...LAYER_SECTIONS];

// When a section is rerolled, these unlocked sections follow it so the
// character stays consistent.
const DEPENDENTS = {
  identity: ["tabletop"],
  background: ["writer"],
  personality: ["voice", "tabletop"],
};

export const ARCHETYPES = {
  warrior: { label: "Warrior", tags: ["violence", "duty"], base: { might: 4, agility: 3, wits: 2, presence: 2, resolve: 4 } },
  skulker: { label: "Skulker", tags: ["crime", "secrecy"], base: { might: 2, agility: 5, wits: 3, presence: 3, resolve: 2 } },
  caster: { label: "Caster", tags: ["learning", "chaos", "tech"], base: { might: 1, agility: 2, wits: 5, presence: 3, resolve: 3 } },
  face: { label: "Face", tags: ["art", "wealth", "ambition"], base: { might: 2, agility: 3, wits: 3, presence: 5, resolve: 2 } },
  healer: { label: "Healer", tags: ["healing", "faith"], base: { might: 2, agility: 2, wits: 3, presence: 3, resolve: 5 } },
  sage: { label: "Sage", tags: ["learning", "order"], base: { might: 1, agility: 2, wits: 5, presence: 2, resolve: 4 } },
  wild: { label: "Wilder", tags: ["wild", "travel", "isolation"], base: { might: 3, agility: 4, wits: 3, presence: 2, resolve: 3 } },
};

export const STRENGTHS = ["might", "agility", "wits", "presence", "resolve"];

const TRAIT_STRENGTH = {
  charming: "presence", gregarious: "presence", vain: "presence", cheerful: "presence",
  meticulous: "wits", curious: "wits", inventive: "wits", calculating: "wits",
  stubborn: "resolve", dutiful: "resolve", principled: "resolve", devout: "resolve",
  restless: "agility", impulsive: "agility", watchful: "agility",
  protective: "might", blunt: "might", reckless: "might", ruthless: "might",
};

const DND5E_CLASSES = {
  warrior: ["Fighter", "Barbarian", "Paladin"],
  skulker: ["Rogue", "Ranger", "Monk"],
  caster: ["Wizard", "Sorcerer", "Warlock"],
  face: ["Bard", "Warlock", "Sorcerer"],
  healer: ["Cleric", "Druid", "Paladin"],
  sage: ["Wizard", "Cleric", "Monk"],
  wild: ["Ranger", "Druid", "Barbarian"],
};
const CLASS_TAGS = {
  Cleric: ["faith", "healing"], Paladin: ["faith", "duty", "order"], Druid: ["wild", "healing"],
  Ranger: ["wild", "travel"], Rogue: ["crime", "secrecy"], Wizard: ["learning"], Bard: ["art"],
  Warlock: ["secrecy", "ambition", "betrayal"], Sorcerer: ["chaos", "family"], Barbarian: ["violence", "wild", "chaos"],
  Fighter: ["violence", "duty"], Monk: ["order", "faith", "isolation"],
};

// ---------- helpers ----------

export function getSection(c, s) {
  return CORE_SECTIONS.includes(s) ? c.core[s] : c.layers[s];
}
function setSection(c, s, value) {
  if (CORE_SECTIONS.includes(s)) c.core[s] = value;
  else c.layers[s] = value;
}

function tagBag(c, exclude) {
  const bag = {};
  for (const s of SECTIONS) {
    if (s === exclude) continue;
    const sec = getSection(c, s);
    for (const t of sec?._tags || []) bag[t] = (bag[t] || 0) + 1;
  }
  return bag;
}

function weigher(bag, strength = 2) {
  return (item) => {
    let score = 0;
    for (const t of item.tags || []) score += Math.min(bag[t] || 0, 2);
    return 1 + strength * score;
  };
}

const uniq = (arr) => [...new Set(arr)];

// ---------- section generators ----------

const GEN = {
  identity(c, rng, bag, G) {
    const origin = rng.weighted(G.origins, weigher(bag, 1));
    const cultureId = rng.pick(origin.cultures);
    const culture = G.cultures[cultureId];
    const people = G.peoples[culture.people];
    const first = rng.pick(culture.first);
    const last = rng.pick(culture.last);
    const [lo, hi] = people.age;
    const age = lo + Math.floor((hi - lo) * Math.pow(rng.float(), 1.6));
    const pronouns = rng.weighted(["she", "he", "they"], (p) => (p === "they" ? 1 : 2));
    const originBag = { ...bag };
    for (const t of origin.tags) originBag[t] = (originBag[t] || 0) + 1;
    const occ = rng.weighted(G.occupations, weigher(originBag, 2));
    return {
      name: `${first} ${last}`, first, last, age, pronouns,
      people: culture.people, peopleLabel: people.label, culture: cultureId,
      origin: origin.t, originShort: origin.short,
      occupation: { t: occ.t, arch: occ.arch, skills: occ.skills },
      _tags: uniq([...origin.tags, ...occ.tags]),
    };
  },

  background(c, rng, bag, G) {
    const up = rng.weighted(G.upbringings, weigher(bag));
    const bag2 = { ...bag };
    for (const t of up.tags) bag2[t] = (bag2[t] || 0) + 1;
    const ev = rng.weighted(G.events, weigher(bag2));
    const turn = rng.weighted(T.TURNING_POINTS, weigher(bag2, 1));
    return {
      upbringing: up.t,
      event: { t: ev.t, short: ev.short, wound: ev.wound },
      turningPoint: turn.t,
      _tags: uniq([...up.tags, ...ev.tags, ...ev.tags]),
    };
  },

  personality(c, rng, bag) {
    const traits = rng.sample(T.TRAITS, 3, weigher(bag, 2.5), (item, chosen) =>
      !chosen.some((x) => x.opp === item.t || item.opp === x.t));
    const temp = rng.weighted(T.TEMPERAMENTS, weigher(bag, 2));
    const quirks = rng.sample(T.QUIRKS, 2, weigher(bag, 2));
    return {
      traits: traits.map((x) => ({ t: x.t, law: x.law || 0, good: x.good || 0 })),
      temperament: { t: temp.t, phrase: temp.phrase, voices: temp.voices },
      quirks: quirks.map((q) => q.t),
      _tags: uniq([...traits.flatMap((x) => x.tags), ...temp.tags]),
    };
  },

  flaws(c, rng, bag) {
    const weaknesses = rng.sample(T.FLAWS, 2, weigher(bag, 2.5));
    const fears = rng.sample(T.FEARS, 2, weigher(bag, 2.5));
    return {
      weaknesses: weaknesses.map((x) => x.t),
      fears: fears.map((x) => x.t),
      _tags: [],
    };
  },

  motivation(c, rng, bag) {
    const want = rng.weighted(T.WANTS, weigher(bag, 2.5));
    return { want: want.t, short: want.short, why: rng.pick(want.why), _tags: want.tags };
  },

  appearance(c, rng, bag, G) {
    const A = G.appearance;
    return {
      build: rng.pick(A.builds),
      features: rng.sample(A.features, 2),
      style: rng.pick(A.styles),
      item: rng.pick(A.items),
      _tags: [],
    };
  },

  voice(c, rng) {
    const temp = c.core.personality?.temperament;
    const options = Object.keys(T.VOICES);
    const style = temp && rng.chance(0.8) ? rng.pick(temp.voices) : rng.pick(options);
    const v = T.VOICES[style];
    return { style, desc: v.desc, habits: rng.sample(v.habits, 2), line: rng.pick(v.lines), _tags: [] };
  },

  hook(c, rng, bag) {
    const h = rng.weighted(T.HOOKS, weigher(bag, 2));
    return { t: h.t, _tags: [] };
  },

  relationships(c, rng, bag, G) {
    const id = c.core.identity;
    const culture = G.cultures[id?.culture] || Object.values(G.cultures)[0];
    const types = rng.sample(T.RELATIONSHIP_TYPES, 3, weigher(bag, 1.5));
    return {
      list: types.map((r) => {
        const first = rng.pick(culture.first.filter((n) => n !== id?.first));
        const last = r.type === "Sibling" && id ? id.last : rng.pick(culture.last);
        return { type: r.type, name: `${first} ${last}`, note: rng.pick(r.notes) };
      }),
      _tags: [],
    };
  },

  tabletop(c, rng, bag, G) {
    const occ = c.core.identity?.occupation || { arch: [], skills: [] };
    const archKey = rng.weighted(Object.keys(ARCHETYPES), (k) => {
      let w = 1;
      if (occ.arch.includes(k)) w += 10;
      for (const t of ARCHETYPES[k].tags) w += Math.min(bag[t] || 0, 2);
      return w;
    });
    const strengths = { ...ARCHETYPES[archKey].base };
    for (const tr of c.core.personality?.traits || []) {
      const s = TRAIT_STRENGTH[tr.t];
      if (s) strengths[s] += 1;
    }
    strengths[rng.pick(STRENGTHS)] += rng.pick([-1, 1]);
    for (const s of STRENGTHS) strengths[s] = Math.max(1, Math.min(5, strengths[s]));

    const dndClass = rng.weighted(DND5E_CLASSES[archKey], (cl) => {
      let w = 2;
      for (const t of CLASS_TAGS[cl] || []) w += Math.min(bag[t] || 0, 2);
      return w;
    });

    return {
      archetype: archKey,
      strengths,
      combatStyle: rng.pick(G.combat[archKey]),
      abilities: uniq([...occ.skills, ...G.abilities[archKey]]),
      partyHook: rng.pick(T.PARTY_HOOKS),
      systems: { dnd5e: { class: dndClass } },
      _tags: [],
    };
  },

  writer(c, rng, bag) {
    const evBag = { ...bag };
    for (const t of c.core.background?._tags || []) evBag[t] = (evBag[t] || 0) + 2;
    const lie = rng.weighted(T.LIES, weigher(evBag, 2));
    const good = (c.core.personality?.traits || []).reduce((s, x) => s + x.good, 0);
    const chaos = (c.core.personality?.traits || []).reduce((s, x) => s - x.law, 0) > 0;
    const age = c.core.identity?.age || 30;
    const role = rng.weighted(T.ROLES, (r) => {
      if (r.minGood != null && good < r.minGood) return 0.3;
      if (r.maxGood != null && good > r.maxGood) return 0.3;
      if (r.minAge && age < r.minAge) return 0.2;
      if (r.chaos && !chaos) return 0.4;
      return r.t === "protagonist" ? 3 : 1.5;
    });
    const arcType = role.t === "antagonist"
      ? rng.weighted(["positive", "negative", "flat"], (a) => ({ positive: 1, negative: 4, flat: 1 })[a])
      : rng.weighted(["positive", "negative", "flat"], (a) => ({ positive: 6, negative: 2, flat: 2 })[a]);
    return {
      lie: lie.lie, need: lie.need, never: lie.never,
      role: role.t, arcType,
      turn: rng.pick(T.ARC_TURNS).t,
      _tags: [],
    };
  },
};

function runSection(c, s, rng) {
  const G = GENRES[c.genre];
  const bag = tagBag(c, s);
  setSection(c, s, GEN[s](c, rng, bag, G));
}

function sectionRng(c, s) {
  return makeRng(`${c.seed}:${s}:${c.nonces[s] || 0}`);
}

function uuid() {
  try { return crypto.randomUUID(); } catch { return "c-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }
}

// Roll a whole character. Locked sections of `prev` are kept when the genre matches.
export function rollCharacter({ genre = "fantasy", seed = newSeed(), prev = null, locks = [] } = {}) {
  const keep = prev && prev.genre === genre ? locks.filter((s) => getSection(prev, s)) : [];
  const c = {
    id: uuid(),
    version: 1,
    genre,
    nature: "living",
    seed,
    nonces: {},
    locks: keep.slice(),
    core: {},
    layers: {},
    created: new Date().toISOString(),
  };
  for (const s of keep) setSection(c, s, structuredCloneSafe(getSection(prev, s)));
  for (const s of SECTIONS) {
    if (keep.includes(s)) continue;
    runSection(c, s, sectionRng(c, s));
  }
  c.updated = c.created;
  return c;
}

// Reroll one section (and any unlocked sections that depend on it).
export function rerollSection(prev, s) {
  const c = structuredCloneSafe(prev);
  const queue = [s, ...(DEPENDENTS[s] || []).filter((d) => !c.locks.includes(d))];
  for (const sec of queue) {
    c.nonces[sec] = (c.nonces[sec] || 0) + 1;
    runSection(c, sec, sectionRng(c, sec));
  }
  c.updated = new Date().toISOString();
  return c;
}

export function toggleLock(prev, s) {
  const c = structuredCloneSafe(prev);
  c.locks = c.locks.includes(s) ? c.locks.filter((x) => x !== s) : [...c.locks, s];
  return c;
}

function structuredCloneSafe(o) {
  return JSON.parse(JSON.stringify(o));
}
