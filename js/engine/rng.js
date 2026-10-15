// Seeded random numbers. The same seed always produces the same character,
// which makes rerolls predictable and characters shareable by seed.

function hashString(str) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  h = Math.imul(h ^ (h >>> 16), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);
  return (h ^ (h >>> 16)) >>> 0;
}

export function makeRng(seed) {
  let a = hashString(String(seed));
  const float = () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const int = (min, max) => min + Math.floor(float() * (max - min + 1));
  const pick = (arr) => arr[Math.floor(float() * arr.length)];
  const weighted = (arr, weightFn) => {
    const weights = arr.map((x) => Math.max(0, weightFn(x)));
    const total = weights.reduce((s, w) => s + w, 0);
    if (total <= 0) return pick(arr);
    let r = float() * total;
    for (let i = 0; i < arr.length; i++) {
      r -= weights[i];
      if (r < 0) return arr[i];
    }
    return arr[arr.length - 1];
  };
  // Pick n distinct items. `allow(item, chosen)` can veto conflicting picks.
  const sample = (arr, n, weightFn = () => 1, allow = () => true) => {
    const chosen = [];
    let pool = arr.slice();
    while (chosen.length < n && pool.length) {
      const item = weighted(pool, weightFn);
      pool = pool.filter((x) => x !== item);
      if (allow(item, chosen)) chosen.push(item);
    }
    return chosen;
  };
  const chance = (p) => float() < p;
  return { float, int, pick, weighted, sample, chance };
}

export function newSeed() {
  const chars = "abcdefghjkmnpqrstuvwxyz23456789";
  let s = "";
  for (let i = 0; i < 7; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}
