// Measures repetition: rolls batches of 20 characters (one sitting at the
// table) and counts how many times a line you've already seen in that batch
// shows up again. Lower is better.
// Run: npm run variety -- [batches]

import * as gen from "../src/engine/generate.ts";
import type { Character } from "../src/engine/types.ts";
import { GENRE_ORDER } from "../src/engine/data/genres/index.ts";

const BATCHES = Number(process.argv[2] || 100);
const BATCH = 20;

const FIELDS: Record<string, (c: Character) => string[]> = {
  occupation: (c) => [c.core.identity.occupation.t],
  upbringing: (c) => [c.core.background.upbringing],
  event: (c) => [c.core.background.event.t],
  "turning point": (c) => [c.core.background.turningPoint],
  traits: (c) => c.core.personality.traits.map((t) => t.t),
  quirks: (c) => c.core.personality.quirks,
  flaws: (c) => [c.core.flaws.defining, ...c.core.flaws.minor],
  fears: (c) => [c.core.flaws.deepFear, c.core.flaws.phobia, c.core.flaws.socialFear],
  behavior: (c) => [
    c.core.personality.stress,
    c.core.personality.conflict,
    c.core.personality.strangers,
    c.core.personality.humor,
  ],
  want: (c) => [c.core.motivation.want],
  secret: (c) => [c.core.hook.t],
  gifts: (c) => c.core.gift.list.map((g) => g.t),
  "voice line": (c) => [c.core.voice.line],
  "signature item": (c) => [c.core.appearance.item],
  "relationship notes": (c) => c.core.relationships.list.map((r) => r.note),
  "moral line": (c) => [c.core.morality.line],
  lie: (c) => [c.layers.writer.lie],
  "party hook": (c) => [c.layers.tabletop.partyHook],
};

function measure(avoid: boolean): Record<string, number> {
  const totals: Record<string, number> = Object.fromEntries(Object.keys(FIELDS).map((k) => [k, 0]));
  let runs = 0;
  for (const genre of GENRE_ORDER) {
    for (let b = 0; b < BATCHES; b++) {
      gen.resetRecent();
      const seen = new Map(Object.keys(FIELDS).map((k) => [k, new Set<string>()]));
      for (let i = 0; i < BATCH; i++) {
        const c = gen.rollCharacter({ genre, seed: `var-${genre}-${b}-${i}`, avoidRepeats: avoid });
        for (const [k, fn] of Object.entries(FIELDS)) {
          for (const v of fn(c)) {
            const set = seen.get(k)!;
            if (set.has(v)) totals[k]!++;
            set.add(v);
          }
        }
      }
      runs++;
    }
  }
  for (const k of Object.keys(totals)) totals[k]! /= runs;
  return totals;
}

const off = measure(false);
const on = measure(true);
const total = (t: Record<string, number>) => Object.values(t).reduce((a, b) => a + b, 0);

console.log(`Repeated lines per ${BATCH} rolls (average over ${BATCHES} batches x ${GENRE_ORDER.length} genres)\n`);
console.log("field".padEnd(20) + "no memory".padStart(11) + "with memory".padStart(13));
for (const k of Object.keys(FIELDS)) {
  console.log(k.padEnd(20) + off[k]!.toFixed(1).padStart(11) + on[k]!.toFixed(1).padStart(13));
}
console.log("TOTAL".padEnd(20) + total(off).toFixed(1).padStart(11) + total(on).toFixed(1).padStart(13));
