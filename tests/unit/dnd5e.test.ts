import { describe, expect, it } from "vitest";
import { alignment, armorClass, mod, signed, toDnd5e } from "../../src/engine/adapters/dnd5e.ts";
import { rollCharacter, type Character } from "../../src/engine/index.ts";

const withFoundations = (f: Record<string, number>): Character => {
  const c = rollCharacter({ seed: "align" });
  c.core.morality.foundations = { care: 3, fairness: 3, loyalty: 3, authority: 3, sanctity: 3, liberty: 3, ...f };
  return c;
};

describe("D&D 5e adapter", () => {
  it("computes modifiers and signs", () => {
    expect([1, 8, 9, 10, 11, 12, 18, 20].map(mod)).toEqual([-5, -1, -1, 0, 0, 1, 4, 5]);
    expect(signed(2)).toBe("+2");
    expect(signed(0)).toBe("+0");
    expect(signed(-1)).toBe("-1");
  });

  it("computes armor class by armor type", () => {
    const m = { str: 0, dex: 3, con: 2, int: 0, wis: 1, cha: 0 };
    expect(armorClass("none", m)).toBe(13);
    expect(armorClass("leather", m)).toBe(14);
    expect(armorClass("scale", m)).toBe(16);
    expect(armorClass("chain+shield", m)).toBe(18);
    expect(armorClass("barbarian", m)).toBe(15);
    expect(armorClass("monk", m)).toBe(14);
  });

  it("maps Moral Foundations onto the nine alignments", () => {
    expect(alignment(withFoundations({ care: 5, fairness: 5, authority: 5, loyalty: 5, liberty: 1 }))).toBe(
      "Lawful Good",
    );
    expect(alignment(withFoundations({ care: 1, fairness: 1, authority: 1, loyalty: 1, liberty: 5 }))).toBe(
      "Chaotic Evil",
    );
    expect(alignment(withFoundations({}))).toBe("Neutral");
  });

  it("uses the rolled scores and adds ability increases from level 4", () => {
    const c = rollCharacter({ seed: "stats" });
    const l1 = toDnd5e(c, 1);
    const l4 = toDnd5e(c, 4);
    expect([...l1.rolled].sort()).toEqual([...c.core.grade.rolls].sort());
    const sum = (s: Record<string, number>) => Object.values(s).reduce((a, b) => a + b, 0);
    expect(sum(l4.scores) - sum(l1.scores)).toBeGreaterThan(0);
    expect(Math.max(...Object.values(l4.scores))).toBeLessThanOrEqual(20);
    expect(l4.prof).toBe(2);
    expect(toDnd5e(c, 5).prof).toBe(3);
  });

  it("gives non-fantasy characters a human build with a note", () => {
    const d = toDnd5e(rollCharacter({ genre: "modern", seed: "modern-5e" }));
    expect(d.ancestry).toBe("Human");
    expect(d.note).not.toBe("");
  });
});
