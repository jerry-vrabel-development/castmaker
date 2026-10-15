// D&D 5e adapter. Translates the system-agnostic tabletop layer into a
// 5e-style stat block using only SRD 5.1 content (CC BY 4.0).
// Ancestries, classes, hit dice and armor values are from the SRD 5.1.

export const ATTRIBUTION =
  "This work includes material taken from the System Reference Document 5.1 (\"SRD 5.1\") by Wizards of the Coast LLC and available at https://dnd.wizards.com/resources/systems-reference-document. The SRD 5.1 is licensed under the Creative Commons Attribution 4.0 International License available at https://creativecommons.org/licenses/by/4.0/legalcode.";

const ANCESTRIES = {
  human: { name: "Human", bonus: { str: 1, dex: 1, con: 1, int: 1, wis: 1, cha: 1 }, speed: 30, size: "Medium" },
  elf: { name: "High Elf", bonus: { dex: 2, int: 1 }, speed: 30, size: "Medium" },
  dwarf: { name: "Hill Dwarf", bonus: { con: 2, wis: 1 }, speed: 25, size: "Medium" },
  halfling: { name: "Lightfoot Halfling", bonus: { dex: 2, cha: 1 }, speed: 25, size: "Small" },
  gnome: { name: "Rock Gnome", bonus: { int: 2, con: 1 }, speed: 25, size: "Small" },
  halforc: { name: "Half-Orc", bonus: { str: 2, con: 1 }, speed: 30, size: "Medium" },
  tiefling: { name: "Tiefling", bonus: { cha: 2, int: 1 }, speed: 30, size: "Medium" },
  dragonborn: { name: "Dragonborn", bonus: { str: 2, cha: 1 }, speed: 30, size: "Medium" },
  halfelf: { name: "Half-Elf", bonus: { cha: 2 }, flex: 2, speed: 30, size: "Medium" },
};

const CLASSES = {
  Barbarian: { hd: 12, prim: ["str", "con"], saves: ["str", "con"], armor: "barbarian" },
  Bard: { hd: 8, prim: ["cha", "dex"], saves: ["dex", "cha"], armor: "leather" },
  Cleric: { hd: 8, prim: ["wis", "con"], saves: ["wis", "cha"], armor: "scale+shield" },
  Druid: { hd: 8, prim: ["wis", "con"], saves: ["int", "wis"], armor: "leather+shield" },
  Fighter: { hd: 10, prim: ["str", "con"], saves: ["str", "con"], armor: "chain+shield" },
  Monk: { hd: 8, prim: ["dex", "wis"], saves: ["str", "dex"], armor: "monk" },
  Paladin: { hd: 10, prim: ["str", "cha"], saves: ["wis", "cha"], armor: "chain+shield" },
  Ranger: { hd: 10, prim: ["dex", "wis"], saves: ["str", "dex"], armor: "scale" },
  Rogue: { hd: 8, prim: ["dex", "con"], saves: ["dex", "int"], armor: "leather" },
  Sorcerer: { hd: 6, prim: ["cha", "con"], saves: ["con", "cha"], armor: "none" },
  Warlock: { hd: 8, prim: ["cha", "con"], saves: ["wis", "cha"], armor: "leather" },
  Wizard: { hd: 6, prim: ["int", "con"], saves: ["int", "wis"], armor: "none" },
};

const ARMOR_LABEL = {
  none: "no armor", leather: "leather armor", "leather+shield": "leather armor, shield", scale: "scale mail",
  "scale+shield": "scale mail, shield", "chain+shield": "chain mail, shield", barbarian: "unarmored defense", monk: "unarmored defense",
};

export const ABILITIES = ["str", "dex", "con", "int", "wis", "cha"];
const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8]; // fallback for characters saved before rolled stats
const ASI_LEVELS = [4, 8, 12, 16, 19];

export const mod = (score) => Math.floor((score - 10) / 2);
export const signed = (n) => (n >= 0 ? `+${n}` : `${n}`);

function armorClass(kind, m) {
  switch (kind) {
    case "leather": return 11 + m.dex;
    case "leather+shield": return 13 + m.dex;
    case "scale": return 14 + Math.min(m.dex, 2);
    case "scale+shield": return 16 + Math.min(m.dex, 2);
    case "chain+shield": return 18;
    case "barbarian": return 10 + m.dex + m.con;
    case "monk": return 10 + m.dex + m.wis;
    default: return 10 + m.dex;
  }
}

// Moral Foundations map onto the nine 5e alignments: care and fairness give
// good versus evil; authority and loyalty against liberty give law versus chaos.
export function alignment(c) {
  const f = c.core.morality?.foundations;
  let law, good;
  if (f) {
    const g = (f.care + f.fairness) / 2 - 3;
    const l = (f.authority + f.loyalty) / 2 - f.liberty;
    good = g >= 0.6 ? 1 : g <= -0.6 ? -1 : 0;
    law = l >= 0.8 ? 1 : l <= -0.8 ? -1 : 0;
  }
  else {
    const traits = c.core.personality?.traits || [];
    law = traits.reduce((s, t) => s + (t.law || 0), 0);
    good = traits.reduce((s, t) => s + (t.good || 0), 0);
  }
  const a = law >= 1 ? "Lawful" : law <= -1 ? "Chaotic" : "Neutral";
  const b = good >= 1 ? "Good" : good <= -1 ? "Evil" : "Neutral";
  return a === "Neutral" && b === "Neutral" ? "Neutral" : `${a} ${b}`;
}

export function toDnd5e(c, level = 1) {
  const tt = c.layers.tabletop;
  const id = c.core.identity;
  const cls = CLASSES[tt.systems.dnd5e.class] ? tt.systems.dnd5e.class : "Fighter";
  const K = CLASSES[cls];
  const anc = ANCESTRIES[c.genre === "fantasy" ? id.people : "human"] || ANCESTRIES.human;
  const s = tt.strengths;

  // Rank the six abilities: class primaries first, then by agnostic strengths.
  const affinity = {
    str: s.might, dex: s.agility, con: s.resolve, int: s.wits,
    wis: (s.wits + s.resolve) / 2 + 0.1, cha: s.presence,
  };
  const rest = ABILITIES.filter((a) => !K.prim.includes(a)).sort((a, b) => affinity[b] - affinity[a]);
  const order = [...K.prim, ...rest];
  const scores = {};
  // Rolled scores (4d6 drop lowest), highest assigned to the class's key abilities.
  const values = (c.core.grade?.rolls || STANDARD_ARRAY).slice().sort((x, y) => y - x);
  order.forEach((a, i) => { scores[a] = values[i]; });

  for (const [a, v] of Object.entries(anc.bonus)) scores[a] += v;
  if (anc.flex) {
    rest.concat(K.prim).filter((a) => a !== "cha").slice(0, anc.flex).forEach((a) => { scores[a] += 1; });
  }
  // Ability score improvements go into the primary ability, capped at 20.
  for (const lv of ASI_LEVELS) {
    if (level >= lv) {
      let pts = 2;
      for (const a of K.prim) {
        while (pts > 0 && scores[a] < 20) { scores[a] += 1; pts -= 1; }
      }
    }
  }

  const m = Object.fromEntries(ABILITIES.map((a) => [a, mod(scores[a])]));
  const prof = 2 + Math.floor((level - 1) / 4);
  const perLevel = Math.max(1, K.hd / 2 + 1 + m.con);
  const hp = Math.max(1, K.hd + m.con) + (level - 1) * perLevel;

  return {
    ancestry: anc.name,
    size: anc.size,
    className: cls,
    level,
    alignment: alignment(c),
    rolled: values,
    scores,
    mods: m,
    ac: armorClass(K.armor, m),
    armor: ARMOR_LABEL[K.armor],
    hp,
    hitDice: `${level}d${K.hd}`,
    speed: anc.speed,
    prof,
    saves: K.saves.map((a) => `${a.toUpperCase()} ${signed(m[a] + prof)}`),
    note: c.genre === "fantasy" ? "" : "Non-fantasy character: built as a Human with a reskinned class.",
  };
}
