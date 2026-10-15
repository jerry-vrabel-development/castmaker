// Rolls many characters in every genre and mode and checks the output for
// crashes, unfilled {tokens}, "undefined", and broken lock/reroll behavior.
// Run: node tools/smoke-test.js [samples]

import { rollCharacter, rerollSection, toggleLock, SECTIONS } from "../src/engine/generate.ts";
import { toMarkdown } from "../src/engine/export.ts";
import { GENRE_ORDER } from "../src/engine/data/genres/index.ts";

const N = Number(process.argv[2] || 300);
let failures = 0;
const fail = (msg) => { failures++; if (failures <= 15) console.error("FAIL:", msg); };

for (const genre of GENRE_ORDER) {
  const names = new Set();
  for (let i = 0; i < N; i++) {
    let c = rollCharacter({ genre, seed: `${genre}-${i}`, orientation: i % 2 ? "even" : "realistic" });
    names.add(c.core.identity.name);
    for (const [mode, system, level] of [["tabletop", "dnd5e", 1 + (i % 20)], ["tabletop", "agnostic", 1], ["writer", "", 1]]) {
      const md = toMarkdown(c, { mode, system, level });
      const bad = md.match(/\{[A-Za-z]+\}|undefined|NaN|\[object/);
      if (bad) fail(`${genre} #${i} ${mode}: "${bad[0]}" in ...${md.slice(Math.max(0, bad.index - 80), bad.index + 40)}`);
    }
    // determinism
    const again = rollCharacter({ genre, seed: `${genre}-${i}`, orientation: i % 2 ? "even" : "realistic" });
    if (JSON.stringify(again.core) !== JSON.stringify(c.core)) fail(`${genre} #${i}: same seed gave a different character`);
    // lock + reroll keeps the locked section
    c = toggleLock(c, "identity");
    const before = c.core.identity.name;
    const next = rollCharacter({ genre, prev: c, locks: c.locks });
    if (next.core.identity.name !== before) fail(`${genre} #${i}: locked identity changed on reroll`);
    for (const s of SECTIONS) rerollSection(next, s);
  }
  console.log(`${genre}: ${N} characters OK-checked, ${names.size} distinct names`);
}

const sample = rollCharacter({ genre: "fantasy", seed: "demo1" });
console.log("\n" + toMarkdown(sample, { mode: "tabletop", system: "dnd5e", level: 3 }));
console.log("\n" + toMarkdown(rollCharacter({ genre: "scifi", seed: "demo2" }), { mode: "writer" }));

if (failures) { console.error(`\n${failures} failure(s)`); process.exit(1); }
console.log("\nAll checks passed.");
