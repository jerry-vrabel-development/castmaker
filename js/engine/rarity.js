// The character's one rarity: its grade, set by real dice.

import { TIERS } from "../data/rarity.js";
import { gradeOdds, oddsAtLeast } from "./dice.js";

export function computeRarity(c) {
  const g = c.core.grade;
  return {
    tier: g.tier,
    tierInfo: TIERS[g.tier],
    total: g.total,
    rolls: g.rolls,
    gradeOdds: gradeOdds(g.tier),
    atLeast: oddsAtLeast(g.total),
  };
}

export { TIERS };
