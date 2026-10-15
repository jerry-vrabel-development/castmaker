// The character's one rarity: its grade, set by real dice.

import type { Character, Tier } from "./types.ts";
import { TIERS } from "./data/rarity.ts";
import { gradeOdds, oddsAtLeast } from "./dice.ts";

export interface RarityInfo {
  tier: Tier;
  tierInfo: { id: string; label: string };
  total: number;
  rolls: number[];
  gradeOdds: number;
  atLeast: number;
}

export function computeRarity(c: Character): RarityInfo {
  const g = c.core.grade;
  return {
    tier: g.tier,
    tierInfo: TIERS[g.tier]!,
    total: g.total,
    rolls: g.rolls,
    gradeOdds: gradeOdds(g.tier),
    atLeast: oddsAtLeast(g.total),
  };
}

export { TIERS };
