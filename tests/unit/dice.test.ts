import { describe, expect, it } from "vitest";
import {
  GRADE_MIN,
  gradeOdds,
  gradeOfTotal,
  oddsAtLeast,
  oneIn,
  P_SINGLE_18,
  roll4d6DropLowest,
} from "../../src/engine/dice.ts";
import { makeRng } from "../../src/engine/rng.ts";

describe("dice odds", () => {
  it("knows the exact chance of an 18 on 4d6 drop lowest (21 of 1296)", () => {
    expect(P_SINGLE_18).toBeCloseTo(21 / 1296, 12);
  });

  it("has grade odds that add up to exactly 1", () => {
    const total = [0, 1, 2, 3, 4].reduce((s, t) => s + gradeOdds(t), 0);
    expect(total).toBeCloseTo(1, 12);
  });

  it("matches the published grade table", () => {
    expect(gradeOdds(0)).toBeCloseTo(0.494, 3);
    expect(gradeOdds(1)).toBeCloseTo(0.266, 3);
    expect(gradeOdds(2)).toBeCloseTo(0.167, 3);
    expect(gradeOdds(3)).toBeCloseTo(0.054, 3);
    expect(gradeOdds(4)).toBeCloseTo(0.018, 3);
    expect(oneIn(gradeOdds(4))).toBe("1 in 55");
  });

  it("puts totals in the right grade at every boundary", () => {
    expect(GRADE_MIN).toEqual([0, 74, 79, 84, 88]);
    expect(gradeOfTotal(73)).toBe(0);
    expect(gradeOfTotal(74)).toBe(1);
    expect(gradeOfTotal(78)).toBe(1);
    expect(gradeOfTotal(79)).toBe(2);
    expect(gradeOfTotal(84)).toBe(3);
    expect(gradeOfTotal(87)).toBe(3);
    expect(gradeOfTotal(88)).toBe(4);
    expect(gradeOfTotal(108)).toBe(4);
  });

  it("gives certainty for the minimum and nothing beyond the maximum", () => {
    expect(oddsAtLeast(18)).toBeCloseTo(1, 12);
    expect(oddsAtLeast(109)).toBe(0);
  });

  it("only ever rolls 3 to 18", () => {
    const rng = makeRng("dice-range");
    for (let i = 0; i < 5000; i++) {
      const v = roll4d6DropLowest(rng);
      expect(v).toBeGreaterThanOrEqual(3);
      expect(v).toBeLessThanOrEqual(18);
    }
  });

  it("formats odds in plain words", () => {
    expect(oneIn(0)).toBe("never");
    expect(oneIn(0.9)).toBe("most rolls");
    expect(oneIn(0.25)).toBe("1 in 4");
    expect(oneIn(0.001)).toBe("1 in 1,000");
  });
});
