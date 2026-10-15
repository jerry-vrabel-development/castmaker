import { describe, expect, it } from "vitest";
import {
  GENRES,
  SECTIONS,
  computeRarity,
  gradeOdds,
  rerollSection,
  resetRecent,
  rollCharacter,
  toggleLock,
  upgradeCharacter,
  type Character,
} from "../../src/engine/index.ts";
import { rollMany, stable } from "./helpers.ts";

describe("rolling characters", () => {
  it("gives the same character for the same seed", () => {
    const a = rollCharacter({ genre: "modern", seed: "repeat-me" });
    const b = rollCharacter({ genre: "modern", seed: "repeat-me" });
    expect(stable(a)).toEqual(stable(b));
  });

  it("fills every section", () => {
    const c = rollCharacter({ seed: "full" });
    for (const s of SECTIONS) expect(s in c.core || s in c.layers).toBe(true);
  });

  it("keeps locked sections when rolling again", () => {
    let c = rollCharacter({ genre: "scifi", seed: "lock-a" });
    c = toggleLock(toggleLock(c, "identity"), "grade");
    const next = rollCharacter({ genre: "scifi", seed: "lock-b", prev: c, locks: c.locks });
    expect(next.core.identity).toEqual(c.core.identity);
    expect(next.core.grade).toEqual(c.core.grade);
    expect(next.locks).toEqual(["identity", "grade"]);
  });

  it("drops locks when the genre changes", () => {
    const c = toggleLock(rollCharacter({ genre: "fantasy", seed: "g1" }), "identity");
    const next = rollCharacter({ genre: "modern", seed: "g2", prev: c, locks: c.locks });
    expect(next.locks).toEqual([]);
  });

  it("toggles locks on and off", () => {
    const c = rollCharacter({ seed: "toggle" });
    expect(toggleLock(c, "hook").locks).toEqual(["hook"]);
    expect(toggleLock(toggleLock(c, "hook"), "hook").locks).toEqual([]);
  });

  it("rerolls a section and its dependents, but not unrelated sections", () => {
    const c = rollCharacter({ genre: "fantasy", seed: "reroll" });
    const next = rerollSection(c, "appearance");
    expect(next.core.appearance).not.toEqual(c.core.appearance);
    expect(next.core.identity).toEqual(c.core.identity);
    expect(next.core.background).toEqual(c.core.background);
    expect(next.nonces.appearance).toBe(1);
  });

  it("never rerolls a locked dependent", () => {
    const c = toggleLock(rollCharacter({ seed: "dep" }), "tabletop");
    const next = rerollSection(c, "identity");
    expect(next.layers.tabletop).toEqual(c.layers.tabletop);
  });

  it("switches orientation odds for one section only", () => {
    const c = rollCharacter({ seed: "orient" });
    const next = rerollSection(c, "love", { orientation: "even" });
    expect(next.options.orientation).toBe("even");
    expect(next.core.identity).toEqual(c.core.identity);
  });
});

describe("grades", () => {
  it("match the exact dice odds over many rolls", () => {
    const N = 6000;
    const counts = [0, 0, 0, 0, 0];
    for (let i = 0; i < N; i++) counts[rollCharacter({ seed: `grade-${i}` }).core.grade.tier]! += 1;
    counts.forEach((n, tier) => {
      const expected = gradeOdds(tier);
      const sd = Math.sqrt((expected * (1 - expected)) / N);
      expect(Math.abs(n / N - expected)).toBeLessThan(4 * sd + 0.002);
    });
  });

  it("give more and stronger gifts at higher grades", () => {
    const byGrade: number[][] = [[], [], [], [], []];
    for (const c of rollMany(400, "gifts")) byGrade[c.core.grade.tier]!.push(c.core.gift.list.length);
    const avg = byGrade.map((a) => a.reduce((x, y) => x + y, 0) / Math.max(1, a.length));
    for (let i = 1; i < avg.length; i++) expect(avg[i]!).toBeGreaterThan(avg[i - 1]!);
  });

  it("always give a Legendary character a destiny-level gift", () => {
    for (let i = 0; i < 3000; i++) {
      const c = rollCharacter({ seed: `leg-${i}` });
      if (c.core.grade.tier === 4) expect(c.core.gift.list.some((g) => g.tier === 4)).toBe(true);
    }
  });

  it("report one rarity for the whole character", () => {
    const c = rollCharacter({ seed: "rarity" });
    const r = computeRarity(c);
    expect(r.tier).toBe(c.core.grade.tier);
    expect(r.total).toBe(c.core.grade.rolls.reduce((a, b) => a + b, 0));
  });
});

describe("variety", () => {
  it("repeats less with no-repeat memory on", () => {
    const repeats = (avoid: boolean) => {
      resetRecent();
      const seen = new Set<string>();
      let n = 0;
      for (let i = 0; i < 30; i++) {
        const c = rollCharacter({ genre: "fantasy", seed: `var-${i}`, avoidRepeats: avoid });
        for (const q of c.core.personality.quirks) {
          if (seen.has(q)) n++;
          seen.add(q);
        }
      }
      return n;
    };
    expect(repeats(true)).toBeLessThan(repeats(false));
  });
});

describe("saved characters from older versions", () => {
  it("gain missing sections and replace outdated shapes", () => {
    const c = rollCharacter({ seed: "old" });
    const old = structuredClone(c) as unknown as { core: Record<string, unknown> };
    delete old.core.love;
    old.core.gift = { none: true, tier: 0, _tags: [] };
    old.core.morality = { order: 0.2, mercy: -0.1, line: "x", breakingPoint: "y", _tags: [] };
    const up = upgradeCharacter(old as unknown as Character);
    expect(up.core.love).toBeDefined();
    expect(Array.isArray(up.core.gift.list)).toBe(true);
    expect(up.core.morality.foundations).toBeDefined();
    expect(up.core.identity).toEqual(c.core.identity);
  });

  it("are returned unchanged when already current", () => {
    const c = rollCharacter({ seed: "current" });
    expect(upgradeCharacter(c)).toBe(c);
  });
});

describe("data integrity", () => {
  it("has gifts at every strength in every genre", () => {
    for (const g of Object.values(GENRES)) {
      for (const tier of [1, 2, 3, 4]) expect(g.gifts.filter((x) => x.tier === tier).length).toBeGreaterThanOrEqual(6);
    }
  });
});
