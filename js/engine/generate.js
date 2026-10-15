// The rules engine. Builds a structured character section by section.
//
// Coherence comes from a running "tag bag": every section records the tags of
// what it picked, and later picks are weighted toward entries sharing those
// tags. Locked sections are never regenerated, but their tags still steer
// everything else.

import * as T from "../data/shared.js";
import { GENRES } from "../data/genres/index.js";
import { makeRng, newSeed } from "./rng.js";
import { stakeOf, occupationWeight, GRADE_MATCH } from "../data/rarity.js";
import { roll4d6DropLowest, gradeOfTotal } from "./dice.js";
import { ORIENTATIONS, STATUS_BY_STAGE, LOVE_NOTES } from "../data/orientation.js";
import * as P from "../data/psyche.js";

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const round1 = (v) => Math.round(v * 10) / 10;

// Scores are widened so profiles feel distinct, then re-centered on 3 so no
// dimension leans one way across all characters (measured by simulation).
const SPREAD = 1.4;
const CENTER = {
  O: 0.43, C: 0.83, E: -0.1, A: 0.25, N: 0.53,
  care: 0.4, fairness: 0.5, loyalty: 0.6, authority: 0.57, sanctity: 0.42, liberty: 0.27,
  selfDirection: 0.44, stimulation: 0.27, hedonism: 0, achievement: 0.63, power: 0.5,
  security: 0.83, conformity: 0.37, tradition: 0.51, benevolence: 0.48, universalism: 0.23,
};

// Weight for an entry tagged with a Big Five code like "A+ N-": higher when
// the character's profile leans the same way.
export function b5Weight(code, big5) {
  if (!code || !big5) return 1;
  let sum = 0;
  for (const part of code.split(" ")) {
    const d = part[0];
    const sign = part[1] === "-" ? -1 : 1;
    sum += sign * ((big5[d] ?? 3) - 3) / 2;
  }
  return Math.max(0.12, 1 + 1.6 * sum);
}

// Combine coherence with the character's grade: entries whose stakes are
// close to the grade are much more likely. Heroes get heroic stakes.
const graded = (w, kind, keyOf, grade) => (item) =>
  w(item) * GRADE_MATCH[Math.abs(stakeOf(kind, item, keyOf(item)) - grade)];

const gradeOf = (c) => c.core.grade?.tier ?? 0;

// ---------- no-repeat memory ----------
// When avoidRepeats is on (the app turns it on; tests leave it off so seeds
// stay reproducible), anything picked in the last few rolls is made 50x less
// likely. The window scales with the size of each table.
let AVOID = false;
let ROLL_N = 0;
const SEEN = new Map();

export function resetRecent() { SEEN.clear(); ROLL_N = 0; }

function fresh(kind, keyOf, poolLen, perRoll = 1, windowOverride) {
  if (!AVOID) return () => 1;
  const windowSize = windowOverride ?? Math.max(2, Math.min(40, Math.floor((poolLen * 0.6) / perRoll)));
  return (item) => {
    const last = SEEN.get(kind + "|" + keyOf(item));
    return last != null && ROLL_N - last < windowSize ? 0.02 : 1;
  };
}
function mark(kind, key) { if (AVOID) SEEN.set(kind + "|" + key, ROLL_N); }
const both = (...fns) => (item) => fns.reduce((p, f) => p * f(item), 1);
const T_ = (x) => x.t;
const ID = (x) => x;

// Pick one, preferring entries not seen recently, and remember it.
function pickFresh(rng, kind, arr, keyOf = ID, weight = () => 1, windowOverride) {
  const item = rng.weighted(arr, both(weight, fresh(kind, keyOf, arr.length, 1, windowOverride)));
  mark(kind, keyOf(item));
  return item;
}
function sampleFresh(rng, kind, arr, n, keyOf = ID, weight = () => 1, allow) {
  const items = rng.sample(arr, n, both(weight, fresh(kind, keyOf, arr.length, n)), allow);
  for (const it of items) mark(kind, keyOf(it));
  return items;
}

export const CORE_SECTIONS = ["grade", "identity", "love", "background", "personality", "flaws", "motivation", "morality", "gift", "appearance", "voice", "hook", "relationships"];
export const LAYER_SECTIONS = ["tabletop", "writer"];
export const SECTIONS = [...CORE_SECTIONS, ...LAYER_SECTIONS];

// When a section is rerolled, these unlocked sections follow it so the
// character stays consistent.
const DEPENDENTS = {
  grade: ["gift", "background", "motivation", "hook", "morality", "tabletop", "writer"],
  identity: ["love", "tabletop"],
  background: ["writer", "morality", "flaws"],
  personality: ["voice", "morality", "flaws", "tabletop"],
  motivation: ["morality"],
};

// Grade nudges: how far strengths move, and how extreme morality gets.
const GRADE_STRENGTH = [-2, -1, 0, 1, 3];
const GRADE_MORAL = [0.75, 0.9, 1, 1.2, 1.45];

// Gift slots per grade: each slot has a chance to appear and odds for gift
// strength 1-4 (knack, talent, rare power, destiny).
const GIFT_SLOTS = [
  [{ p: 0.5, tiers: [1, 0, 0, 0] }],
  [{ p: 0.9, tiers: [3, 1, 0, 0] }, { p: 0.25, tiers: [1, 0, 0, 0] }],
  [{ p: 1, tiers: [1, 3, 0.4, 0] }, { p: 0.5, tiers: [3, 1, 0, 0] }],
  [{ p: 1, tiers: [0, 1, 4, 0] }, { p: 0.85, tiers: [2, 2, 0.5, 0] }, { p: 0.3, tiers: [1, 1, 0, 0] }],
  [{ p: 1, tiers: [0, 0, 0, 1] }, { p: 1, tiers: [0, 1, 2, 0.2] }, { p: 0.45, tiers: [1, 2, 1, 0] }],
];

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
  // Six ability scores rolled 4d6-drop-lowest. Their total sets the grade.
  grade(c, rng) {
    const rolls = Array.from({ length: 6 }, () => roll4d6DropLowest(rng));
    const total = rolls.reduce((a, b) => a + b, 0);
    return { rolls, total, tier: gradeOfTotal(total), _tags: [] };
  },

  identity(c, rng, bag, G) {
    const origin = pickFresh(rng, "origin", G.origins, T_, weigher(bag, 1));
    const cultureId = rng.pick(origin.cultures);
    const culture = G.cultures[cultureId];
    const people = G.peoples[culture.people];
    const first = pickFresh(rng, "first", culture.first);
    const last = pickFresh(rng, "last", culture.last);
    const [lo, hi] = people.age;
    const age = lo + Math.floor((hi - lo) * Math.pow(rng.float(), 1.6));
    const pronouns = rng.weighted(["she", "he", "they"], (p) => (p === "they" ? 1 : 2));
    const originBag = { ...bag };
    for (const t of origin.tags) originBag[t] = (originBag[t] || 0) + 1;
    const occ = pickFresh(rng, "occupation", G.occupations, T_, (o) => weigher(originBag, 2)(o) * occupationWeight(G.id, o));
    return {
      name: `${first} ${last}`, first, last, age, pronouns,
      people: culture.people, peopleLabel: people.label, culture: cultureId,
      origin: origin.t, originShort: origin.short,
      occupation: { t: occ.t, arch: occ.arch, skills: occ.skills },
      _tags: uniq([...origin.tags, ...occ.tags]),
    };
  },

  background(c, rng, bag, G) {
    const up = pickFresh(rng, "upbringing", G.upbringings, T_, weigher(bag));
    const bag2 = { ...bag };
    for (const t of up.tags) bag2[t] = (bag2[t] || 0) + 1;
    const ev = pickFresh(rng, "event", G.events, (e) => e.short, graded(weigher(bag2), "event", (e) => e.short, gradeOf(c)));
    const turn = pickFresh(rng, "turn", T.TURNING_POINTS, T_, weigher(bag2, 1));
    return {
      upbringing: up.t,
      event: { t: ev.t, short: ev.short, wound: ev.wound, tags: ev.tags },
      turningPoint: turn.t,
      _tags: uniq([...up.tags, ...ev.tags, ...ev.tags]),
    };
  },

  // Personality rests on a Big Five profile built from the character's
  // history. The profile then steers traits and behavior, so a reserved,
  // anxious character gets reserved, anxious habits.
  personality(c, rng, bag) {
    const big5 = {};
    for (const d of P.BIG5) {
      let v = 0;
      for (const [t, w] of Object.entries(P.TAG_B5)) v += Math.min(bag[t] || 0, 2) * (w[d.id] || 0);
      const noise = (rng.float() + rng.float() + rng.float() - 1.5) * 1.3;
      big5[d.id] = round1(clamp(3 + (v * 0.35 + noise) * SPREAD - (CENTER[d.id] || 0), 1, 5));
    }
    const fit = (code) => b5Weight(code, big5);
    const traits = sampleFresh(rng, "trait", T.TRAITS, 3, T_, (t) => weigher(bag, 2.5)(t) * fit(P.TRAIT_B5[t.t]), (item, chosen) =>
      !chosen.some((x) => x.opp === item.t || item.opp === x.t));
    const temp = pickFresh(rng, "temperament", T.TEMPERAMENTS, T_, weigher(bag, 2));
    const quirks = sampleFresh(rng, "quirk", T.QUIRKS, 2, T_, weigher(bag, 2));
    const likes = sampleFresh(rng, "like", P.LIKES, 2, T_, weigher(bag, 2));
    const dislikes = sampleFresh(rng, "dislike", P.DISLIKES, 2, T_, weigher(bag, 2));
    return {
      big5,
      traits: traits.map((x) => ({ t: x.t, law: x.law || 0, good: x.good || 0 })),
      temperament: { t: temp.t, phrase: temp.phrase, voices: temp.voices },
      stress: pickFresh(rng, "stress", P.UNDER_STRESS, T_, (x) => fit(x.b5)).t,
      conflict: pickFresh(rng, "conflict", P.IN_CONFLICT, T_, (x) => fit(x.b5)).t,
      strangers: pickFresh(rng, "strangers", P.WITH_STRANGERS, T_, (x) => fit(x.b5)).t,
      humor: pickFresh(rng, "humor", P.HUMOR, T_, (x) => fit(x.b5)).t,
      strengths: sampleFresh(rng, "strength", P.STRENGTHS, 2, T_, (x) => fit(x.b5)).map(T_),
      likes: likes.map(T_),
      dislikes: dislikes.map(T_),
      habit: pickFresh(rng, "habit", P.HABITS, T_, weigher(bag, 2)).t,
      quirks: quirks.map(T_),
      _tags: uniq([...traits.flatMap((x) => x.tags), ...temp.tags]),
    };
  },

  // Flaws and fears in layers: one defining flaw, smaller ones, a vice; a deep
  // fear rooted in the defining event, a phobia, a social fear, and how the
  // character copes when afraid.
  flaws(c, rng, bag) {
    const big5 = c.core.personality?.big5 || { O: 3, C: 3, E: 3, A: 3, N: 3 };
    const flaws = sampleFresh(rng, "flaw", T.FLAWS, 3, T_, weigher(bag, 2.5));
    const evTags = c.core.background?.event?.tags || [];
    const overlap = (f) => (f.tags || []).filter((t) => evTags.includes(t)).length;
    const deep = pickFresh(rng, "fear", T.FEARS, T_, (f) => weigher(bag, 1)(f) * (overlap(f) ? 10 * overlap(f) : 1));
    return {
      defining: flaws[0].t,
      minor: flaws.slice(1).map(T_),
      vice: pickFresh(rng, "vice", P.VICES, T_, weigher(bag, 2)).t,
      deepFear: deep.t,
      rooted: overlap(deep) > 0,
      phobia: pickFresh(rng, "phobia", P.PHOBIAS),
      socialFear: pickFresh(rng, "socialFear", P.SOCIAL_FEARS, T_, weigher(bag, 2)).t,
      coping: pickFresh(rng, "coping", P.COPING, T_, (x) => b5Weight(x.b5, big5)).t,
      _tags: [],
    };
  },

  motivation(c, rng, bag, _G) {
    const want = pickFresh(rng, "want", T.WANTS, (w) => w.short, graded(weigher(bag, 2.5), "want", (w) => w.short, gradeOf(c)));
    return { want: want.t, short: want.short, why: rng.pick(want.why), _tags: want.tags };
  },

  // Morality, two ways (the app can show either or both while we compare):
  // Moral Foundations scores and Schwartz basic values, both 1-5, built from
  // history and personality. Higher grades are pushed toward the extremes.
  morality(c, rng, bag) {
    const big5 = c.core.personality?.big5 || { O: 3, C: 3, E: 3, A: 3, N: 3 };
    const k = GRADE_MORAL[gradeOf(c)];
    const score = (def) => {
      let v = 0;
      for (const [t, w] of Object.entries(def.tags)) v += Math.min(bag[t] || 0, 2) * w;
      for (const [d, w] of Object.entries(def.b5 || {})) v += (big5[d] - 3) * w;
      const noise = (rng.float() + rng.float() + rng.float() - 1.5) * 1.2;
      return round1(clamp(3 + (v * 0.35 + noise) * k * SPREAD - (CENTER[def.id] || 0), 1, 5));
    };
    const foundations = Object.fromEntries(P.FOUNDATIONS.map((f) => [f.id, score(f)]));
    const values = Object.fromEntries(P.VALUES.map((v) => [v.id, score(v)]));
    const good = (foundations.care + foundations.fairness) / 2 - 3;
    const line = pickFresh(rng, "moralLine", T.MORAL_LINES, T_, (l) => weigher(bag, 2)(l) * (l.mercy != null && good < l.mercy * 2 - 1 ? 0.3 : 1));
    const breaking = pickFresh(rng, "breaking", T.BREAKING_POINTS, T_, weigher(bag, 2));
    return { foundations, values, line: line.t, breakingPoint: breaking.t, _tags: [] };
  },

  // Gifts: a character can have none, one or several. Grade raises both how
  // many and how strong.
  gift(c, rng, bag, G) {
    const slots = GIFT_SLOTS[gradeOf(c)];
    const list = [];
    for (const slot of slots) {
      if (!rng.chance(slot.p)) continue;
      const tier = 1 + rng.weighted([0, 1, 2, 3], (i) => slot.tiers[i]);
      const options = G.gifts.filter((g) => g.tier === tier && !list.some((x) => x.t === g.t));
      if (!options.length) continue;
      const g = pickFresh(rng, "gift", options, T_, weigher(bag, 2));
      list.push({ t: g.t, tier: g.tier });
    }
    list.sort((a, b) => b.tier - a.tier);
    return { list, _tags: [] };
  },

  appearance(c, rng, bag, G) {
    const A = G.appearance;
    return {
      build: rng.pick(A.builds),
      features: sampleFresh(rng, "feature", A.features, 2),
      style: pickFresh(rng, "style", A.styles),
      item: pickFresh(rng, "item", A.items),
      _tags: [],
    };
  },

  voice(c, rng) {
    const temp = c.core.personality?.temperament;
    const options = Object.keys(T.VOICES);
    const style = temp && rng.chance(0.8) ? rng.pick(temp.voices) : rng.pick(options);
    const v = T.VOICES[style];
    return { style, desc: v.desc, habits: sampleFresh(rng, "habit", v.habits, 2), line: pickFresh(rng, "line", v.lines), _tags: [] };
  },

  // Secrets: hand-written ones at every scale, plus, for smaller characters,
  // secrets built from parts (an act, a person, a twist) so they rarely repeat.
  hook(c, rng, bag) {
    const grade = gradeOf(c);
    if (grade <= 2 && rng.chance(0.55)) {
      const P = T.SECRET_PARTS;
      const act = pickFresh(rng, "secretAct", P.acts, T_, (a) => GRADE_MATCH[Math.abs(a.tier - grade)]);
      const whom = pickFresh(rng, "secretWhom", P.whom);
      const twist = rng.pick(P.twists);
      const t = `${act.t} ${whom}${twist}.`;
      mark("hook", t);
      return { t, built: true, _tags: [] };
    }
    const h = pickFresh(rng, "hook", T.HOOKS, T_, graded(weigher(bag, 2), "hook", T_, grade));
    return { t: h.t, _tags: [] };
  },

  // Love life. Orientation follows real-world odds (Gallup 2025) or an even
  // spread, and never feeds the tag bag: it shapes the love life only.
  love(c, rng, bag, G) {
    const id = c.core.identity;
    const mode = c.options?.orientation === "even" ? "even" : "realistic";
    const o = rng.weighted(ORIENTATIONS, (x) => x[mode]);
    const gender = { she: "woman", he: "man", they: "nonbinary" }[id.pronouns] || "nonbinary";
    const other = gender === "woman" ? "man" : gender === "man" ? "woman" : null;
    let target = null;
    if (o.kind === "different") target = other || rng.pick(["man", "woman"]);
    if (o.kind === "same") target = gender !== "nonbinary" ? gender : rng.pick(["man", "woman"]);
    const variant = o.id === "pan-queer" ? rng.pick(["pansexual", "queer"]) : null;

    const [lo, hi] = (G.peoples[id.people] || { age: [18, 70] }).age;
    const f = (id.age - lo) / Math.max(1, hi - lo);
    const stage = f < 0.15 ? "young" : f > 0.6 ? "older" : "middle";
    const status = rng.weighted(Object.keys(STATUS_BY_STAGE[stage]), (s) =>
      STATUS_BY_STAGE[stage][s] * (o.kind === "none" && s === "single" ? 2.5 : 1));

    let partner = null;
    let years = 0;
    if (status !== "single") {
      const pg = target || rng.weighted(["man", "woman", "nonbinary"], (g) => (g === "nonbinary" ? 1 : 4.5));
      const culture = G.cultures[id.culture] || Object.values(G.cultures)[0];
      const pname = pickFresh(rng, "first", culture.first.filter((n) => n !== id.first));
      partner = { name: pname, gender: pg };
      const span = Math.max(2, Math.min(60, Math.floor((id.age - lo) * 0.8)));
      years = status === "dating" ? 0 : rng.int(1, span);
    }
    const pool = o.kind === "none" && status === "single" && rng.chance(0.5) ? LOVE_NOTES.asexualSingle : LOVE_NOTES[status];
    const note = pickFresh(rng, "love-" + status, pool);
    return { orientation: o.id, kind: o.kind, target, variant, status, partner, years, note, _tags: [] };
  },

  relationships(c, rng, bag, G) {
    const id = c.core.identity;
    const culture = G.cultures[id?.culture] || Object.values(G.cultures)[0];
    const types = sampleFresh(rng, "relType", T.RELATIONSHIP_TYPES, 3, (r) => r.type, weigher(bag, 1.5));
    const famLast = ["Sibling", "Parent", "Child"];
    return {
      list: types.map((r) => {
        const first = pickFresh(rng, "first", culture.first.filter((n) => n !== id?.first));
        const last = famLast.includes(r.type) && id ? id.last : rng.pick(culture.last);
        return { type: r.type, name: `${first} ${last}`, note: pickFresh(rng, "relNote", r.notes, ID, () => 1, 20) };
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
    // Grade lifts or lowers the whole profile: heroes peak, extras flatten.
    let shift = GRADE_STRENGTH[gradeOf(c)];
    while (shift > 0) {
      const up = STRENGTHS.filter((s) => strengths[s] < 5).sort((a, b) => strengths[b] - strengths[a])[0];
      if (!up) break;
      strengths[up] += 1; shift -= 1;
    }
    while (shift < 0) {
      const down = STRENGTHS.filter((s) => strengths[s] > 1).sort((a, b) => strengths[b] - strengths[a])[0];
      if (!down) break;
      strengths[down] -= 1; shift += 1;
    }

    const dndClass = rng.weighted(DND5E_CLASSES[archKey], (cl) => {
      let w = 2;
      for (const t of CLASS_TAGS[cl] || []) w += Math.min(bag[t] || 0, 2);
      return w;
    });

    return {
      archetype: archKey,
      strengths,
      combatStyle: pickFresh(rng, "combat", G.combat[archKey]),
      abilities: uniq([...occ.skills, ...G.abilities[archKey]]),
      partyHook: pickFresh(rng, "partyHook", T.PARTY_HOOKS),
      systems: { dnd5e: { class: dndClass } },
      _tags: [],
    };
  },

  writer(c, rng, bag, _G) {
    const evBag = { ...bag };
    for (const t of c.core.background?._tags || []) evBag[t] = (evBag[t] || 0) + 2;
    const lie = pickFresh(rng, "lie", T.LIES, (x) => x.lie, weigher(evBag, 2));
    // Any character can fill any role; grade doesn't limit it.
    const f = c.core.morality?.foundations || { care: 3, fairness: 3, liberty: 3, authority: 3 };
    const good = ((f.care + f.fairness) / 2 - 3) / 2; // -1 .. +1
    const chaos = f.liberty - f.authority > 1;
    const age = c.core.identity?.age || 30;
    const role = rng.weighted(T.ROLES, (r) => {
      if (r.t === "protagonist" && good < -0.3) return 0.3;
      if (r.t === "antagonist") return good < -0.2 ? 4 : 0.4;
      if (r.minGood != null && good < r.minGood) return 0.3;
      if (r.minAge && age < r.minAge) return 0.2;
      if (r.chaos && !chaos) return 0.4;
      return r.t === "protagonist" ? 3 : 1.5;
    });
    const arcType = role.t === "antagonist"
      ? rng.weighted(["positive", "negative", "flat"], (a) => ({ positive: 1, negative: 4, flat: 1 })[a])
      : rng.weighted(["positive", "negative", "flat"], (a) => ({ positive: 6, negative: 2, flat: 2 })[a]);
    return {
      lie: lie.lie, need: lie.need, never: lie.never, lieTags: lie.tags,
      role: role.t, arcType,
      turn: pickFresh(rng, "arcTurn", T.ARC_TURNS, T_).t,
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
export function rollCharacter({ genre = "fantasy", seed = newSeed(), prev = null, locks = [], avoidRepeats = false, orientation = "realistic" } = {}) {
  const keep = prev && prev.genre === genre ? locks.filter((s) => getSection(prev, s)) : [];
  const c = {
    id: uuid(),
    version: 2,
    genre,
    nature: "living",
    options: { orientation },
    seed,
    nonces: {},
    locks: keep.slice(),
    core: {},
    layers: {},
    created: new Date().toISOString(),
  };
  for (const s of keep) setSection(c, s, structuredCloneSafe(getSection(prev, s)));
  withMemory(avoidRepeats, () => {
    for (const s of SECTIONS) {
      if (keep.includes(s)) continue;
      runSection(c, s, sectionRng(c, s));
    }
  });
  c.updated = c.created;
  return c;
}

function withMemory(on, fn) {
  if (!on) return fn();
  AVOID = true;
  ROLL_N++;
  try { return fn(); } finally { AVOID = false; }
}

// Reroll one section (and any unlocked sections that depend on it).
export function rerollSection(prev, s, { avoidRepeats = false, orientation } = {}) {
  const c = structuredCloneSafe(prev);
  if (orientation) c.options = { ...(c.options || {}), orientation };
  const queue = [s, ...(DEPENDENTS[s] || []).filter((d) => !c.locks.includes(d))];
  withMemory(avoidRepeats, () => {
    for (const sec of queue) {
      c.nonces[sec] = (c.nonces[sec] || 0) + 1;
      runSection(c, sec, sectionRng(c, sec));
    }
  });
  c.updated = new Date().toISOString();
  return c;
}

// Fill in any sections a character saved by an older version is missing
// (for example grade, gift and morality in v0.3, love life in v0.4).
const OUTDATED = {
  personality: (x) => !x.big5,
  flaws: (x) => !x.defining,
  morality: (x) => !x.foundations,
  gift: (x) => !Array.isArray(x.list),
};

export function upgradeCharacter(prev) {
  const missing = SECTIONS.filter((s) => !getSection(prev, s) || OUTDATED[s]?.(getSection(prev, s)));
  if (!missing.length) return prev;
  const c = structuredCloneSafe(prev);
  c.locks = c.locks || [];
  c.nonces = c.nonces || {};
  for (const s of missing) runSection(c, s, sectionRng(c, s));
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
