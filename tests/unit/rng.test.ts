import { describe, expect, it } from "vitest";
import { makeRng, newSeed } from "../../src/engine/rng.ts";

describe("seeded random numbers", () => {
  it("repeats exactly for the same seed", () => {
    const a = makeRng("same");
    const b = makeRng("same");
    for (let i = 0; i < 100; i++) expect(a.float()).toBe(b.float());
  });

  it("differs for different seeds", () => {
    expect(makeRng("one").float()).not.toBe(makeRng("two").float());
  });

  it("never picks an entry with zero weight", () => {
    const rng = makeRng("weights");
    for (let i = 0; i < 500; i++) expect(rng.weighted(["a", "b", "c"], (x) => (x === "b" ? 0 : 1))).not.toBe("b");
  });

  it("samples distinct items and honors vetoes", () => {
    const rng = makeRng("sample");
    const picked = rng.sample(
      [1, 2, 3, 4, 5, 6],
      3,
      () => 1,
      (x, chosen) => !(x === 2 && chosen.includes(1)),
    );
    expect(new Set(picked).size).toBe(3);
    expect(picked.includes(1) && picked.includes(2) && picked.indexOf(2) > picked.indexOf(1)).toBe(false);
  });

  it("refuses to pick from an empty table", () => {
    expect(() => makeRng("empty").pick([])).toThrow();
  });

  it("makes short, readable seeds", () => {
    expect(newSeed()).toMatch(/^[a-z2-9]{7}$/);
  });
});
