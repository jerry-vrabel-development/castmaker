// Real dice. A character's grade comes from rolling six ability scores with
// 4d6-drop-lowest, the classic heroic method. The total decides the grade,
// so the chance of a Legendary character is exactly the chance of rolling
// that well: about 1 in 55.

export function roll4d6DropLowest(rng) {
  const d = [rng.int(1, 6), rng.int(1, 6), rng.int(1, 6), rng.int(1, 6)].sort((a, b) => a - b);
  return d[1] + d[2] + d[3];
}

// Exact probability of each single score (3..18).
const SINGLE = (() => {
  const counts = new Array(19).fill(0);
  for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) for (let c = 1; c <= 6; c++) for (let d = 1; d <= 6; d++) {
    counts[a + b + c + d - Math.min(a, b, c, d)]++;
  }
  return counts.map((n) => n / 1296);
})();

// Exact probability of each six-score total (18..108), by convolution.
const TOTALS = (() => {
  let dist = [1];
  for (let k = 0; k < 6; k++) {
    const next = new Array(dist.length + 18).fill(0);
    dist.forEach((p, i) => { if (p) SINGLE.forEach((q, s) => { if (q) next[i + s] += p * q; }); });
    dist = next;
  }
  return dist;
})();

export const P_SINGLE_18 = SINGLE[18]; // ≈ 1.6%

// Chance of rolling this total or higher.
export function oddsAtLeast(total) {
  let p = 0;
  for (let s = total; s < TOTALS.length; s++) p += TOTALS[s] || 0;
  return p;
}

// Lowest total for each grade: Common, Uncommon, Rare, Epic, Legendary.
export const GRADE_MIN = [0, 74, 79, 84, 88];

export function gradeOfTotal(total) {
  let g = 0;
  GRADE_MIN.forEach((min, i) => { if (total >= min) g = i; });
  return g;
}

// Chance of landing in a grade band.
export function gradeOdds(tier) {
  const lo = GRADE_MIN[tier];
  const hi = tier < 4 ? GRADE_MIN[tier + 1] : 999;
  return oddsAtLeast(lo) - (hi < 999 ? oddsAtLeast(hi) : 0);
}

export function oneIn(p) {
  if (p <= 0) return "never";
  const n = 1 / p;
  if (n < 1.5) return "most rolls";
  if (n < 10) return `1 in ${n.toFixed(1).replace(/\.0$/, "")}`;
  if (n < 1000) return `1 in ${Math.round(n)}`;
  return `1 in ${Math.round(n).toLocaleString("en-US")}`;
}
