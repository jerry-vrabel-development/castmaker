// Rolls many characters and reports how often each grade comes up (it should
// match the exact dice odds), gift counts, roles, and strongest moral foundation.
// Run: node tools/rarity-sim.js [count]

import { rollCharacter } from "../src/engine/generate.ts";
import { computeRarity, TIERS } from "../src/engine/rarity.ts";
import { gradeOdds } from "../src/engine/dice.ts";
import { GENRE_ORDER } from "../src/engine/data/genres/index.ts";
import { foundationSummary } from "../src/engine/prose/templates.ts";

const N = Number(process.argv[2] || 3000);
console.log("Exact dice odds: " + TIERS.map((t, i) => `${t.label} ${(100 * gradeOdds(i)).toFixed(1)}%`).join("  "));
for (const genre of GENRE_ORDER) {
  const tiers = [0, 0, 0, 0, 0];
  const spread = [[], [], [], [], []];
  const roles = {};
  const labels = {};
  for (let i = 0; i < N; i++) {
    const c = rollCharacter({ genre, seed: `sim-${genre}-${i}` });
    const r = computeRarity(c);
    tiers[r.tier]++;
    spread[r.tier].push(c.core.gift.list.length);
    roles[c.layers.writer.role] = (roles[c.layers.writer.role] || 0) + 1;
    const l = foundationSummary(c).top.label;
    labels[l] = (labels[l] || 0) + 1;
  }
  const avg = (a) => (a.length ? (a.reduce((x, y) => x + y, 0) / a.length).toFixed(2) : "-");
  console.log(`\n${genre}: ` + TIERS.map((t, i) => `${t.label} ${(100 * tiers[i] / N).toFixed(1)}%`).join("  "));
  console.log("  average gifts by grade:", spread.map(avg).join(" / "));
  console.log("  roles:", Object.entries(roles).map(([k, v]) => `${k} ${(100 * v / N).toFixed(0)}%`).join(", "));
  console.log("  strongest foundation:", Object.entries(labels).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${(100 * v / N).toFixed(0)}%`).join(", "));
}
