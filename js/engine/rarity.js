// Summarizes a character's grade (set by real dice) and the rarity of its
// key story pieces.

import { TIERS, rarityOf } from "../data/rarity.js";
import { gradeOdds, oddsAtLeast } from "./dice.js";

export const PIECES = [
  { kind: "occupation", label: "Occupation", section: "identity", key: (c) => c.core.identity.occupation.t },
  { kind: "gift", label: "Gift", section: "gift", key: (c) => c.core.gift?.t },
  { kind: "event", label: "Defining event", section: "background", key: (c) => c.core.background.event.short },
  { kind: "want", label: "Want", section: "motivation", key: (c) => c.core.motivation.short },
  { kind: "hook", label: "Secret", section: "hook", key: (c) => c.core.hook.t },
];

export function computeRarity(c) {
  const g = c.core.grade;
  const pieces = PIECES.map((p) => {
    if (p.kind === "gift") {
      const gift = c.core.gift || { none: true, tier: 0 };
      return { kind: p.kind, label: p.label, section: p.section, tier: gift.tier, source: "designed", none: !!gift.none };
    }
    return { kind: p.kind, label: p.label, section: p.section, ...rarityOf(p.kind, c.genre, p.key(c)) };
  });
  // Resonance: the defining event, the want and the lie share a theme.
  const evTags = c.core.background.event.tags || [];
  const wantTags = c.core.motivation._tags || [];
  const lieTags = c.layers.writer?.lieTags || [];
  const theme = evTags.find((t) => wantTags.includes(t) && lieTags.includes(t)) || null;
  return {
    tier: g.tier,
    tierInfo: TIERS[g.tier],
    total: g.total,
    rolls: g.rolls,
    gradeOdds: gradeOdds(g.tier),
    atLeast: oddsAtLeast(g.total),
    pieces,
    theme,
  };
}

export { TIERS };
