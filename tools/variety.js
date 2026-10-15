// Measures repetition: rolls batches of 20 characters (one sitting at the
// table) and counts how many times a line you've already seen in that batch
// shows up again. Lower is better.
// Run: node tools/variety.js [batches]

import * as gen from "../js/engine/generate.js";
import { GENRE_ORDER } from "../js/data/genres/index.js";

const BATCHES = Number(process.argv[2] || 100);
const BATCH = 20;

const FIELDS = {
  occupation: (c) => [c.core.identity.occupation.t],
  upbringing: (c) => [c.core.background.upbringing],
  event: (c) => [c.core.background.event.t],
  "turning point": (c) => [c.core.background.turningPoint],
  traits: (c) => c.core.personality.traits.map((t) => t.t),
  quirks: (c) => c.core.personality.quirks,
  flaws: (c) => [c.core.flaws.defining, ...c.core.flaws.minor],
  fears: (c) => [c.core.flaws.deepFear, c.core.flaws.phobia, c.core.flaws.socialFear],
  behavior: (c) => [c.core.personality.stress, c.core.personality.conflict, c.core.personality.strangers, c.core.personality.humor],
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

function measure(avoid) {
  const totals = Object.fromEntries(Object.keys(FIELDS).map((k) => [k, 0]));
  let runs = 0;
  for (const genre of GENRE_ORDER) {
    for (let b = 0; b < BATCHES; b++) {
      if (gen.resetRecent) gen.resetRecent();
      const seen = Object.fromEntries(Object.keys(FIELDS).map((k) => [k, new Set()]));
      for (let i = 0; i < BATCH; i++) {
        const c = gen.rollCharacter({ genre, seed: `var-${genre}-${b}-${i}`, avoidRepeats: avoid });
        for (const [k, fn] of Object.entries(FIELDS)) {
          for (const v of fn(c)) {
            if (seen[k].has(v)) totals[k]++;
            seen[k].add(v);
          }
        }
      }
      runs++;
    }
  }
  for (const k of Object.keys(totals)) totals[k] /= runs;
  return totals;
}

const off = measure(false);
const on = gen.resetRecent ? measure(true) : null;
const total = (t) => Object.values(t).reduce((a, b) => a + b, 0);

console.log(`Repeated lines per ${BATCH} rolls (average over ${BATCHES} batches x ${GENRE_ORDER.length} genres)\n`);
console.log("field".padEnd(20) + "no memory".padStart(11) + (on ? "with memory".padStart(13) : ""));
for (const k of Object.keys(FIELDS)) {
  console.log(k.padEnd(20) + off[k].toFixed(1).padStart(11) + (on ? on[k].toFixed(1).padStart(13) : ""));
}
console.log("TOTAL".padEnd(20) + total(off).toFixed(1).padStart(11) + (on ? total(on).toFixed(1).padStart(13) : ""));
