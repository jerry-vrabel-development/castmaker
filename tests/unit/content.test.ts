// Rolls thousands of characters and checks every line of output for the
// mistakes content edits tend to introduce: unfilled tokens, missing values,
// and pronoun-verb disagreement.

import { describe, expect, it } from "vitest";
import { toMarkdown, type Character } from "../../src/engine/index.ts";
import { TRAIT_B5 } from "../../src/engine/data/psyche.ts";
import { TEMPERAMENTS, TRAITS, VOICES } from "../../src/engine/data/shared.ts";
import { rollMany } from "./helpers.ts";

const BROKEN = /\{[A-Za-z]+\}|undefined|NaN|\[object |\.\.(?!\.)/;
const THEY_DISAGREE = /\b[Tt]hey (is|was|has|does|doesn't|knows|wants|starts)\b/;
// "as if she were" is correct (subjunctive), so "were" only counts when no "if" comes right before.
const SINGULAR_DISAGREE = /(?<!\bif )\b(?:[Ss]he|[Hh]e) (?:are|were|have|do|don't)\b/;

const outputs = (c: Character) => [
  toMarkdown(c, { mode: "tabletop", system: "dnd5e", level: 5 }),
  toMarkdown(c, { mode: "tabletop", system: "agnostic" }),
  toMarkdown(c, { mode: "writer", ethics: "both" }),
];

describe("generated text", () => {
  const characters = rollMany(400, "content");

  it("has no unfilled tokens or missing values", () => {
    for (const c of characters) {
      for (const md of outputs(c)) {
        const m = md.match(BROKEN);
        expect(
          m,
          m ? `${c.seed}: …${md.slice(Math.max(0, (m.index ?? 0) - 60), (m.index ?? 0) + 40)}…` : "",
        ).toBeNull();
      }
    }
  });

  it("keeps verbs in agreement with the character's pronouns", () => {
    for (const c of characters) {
      const md = outputs(c)[2]!;
      const re = c.core.identity.pronouns === "they" ? THEY_DISAGREE : SINGULAR_DISAGREE;
      const m = md.match(re);
      expect(
        m,
        m
          ? `${c.seed} (${c.core.identity.pronouns}): …${md.slice(Math.max(0, (m.index ?? 0) - 60), (m.index ?? 0) + 40)}…`
          : "",
      ).toBeNull();
    }
  });
});

describe("content tables", () => {
  it("give every trait a Big Five lean", () => {
    expect(TRAITS.filter((t) => !TRAIT_B5[t.t]).map((t) => t.t)).toEqual([]);
  });

  it("only point temperaments at voices that exist", () => {
    for (const t of TEMPERAMENTS) for (const v of t.voices) expect(VOICES[v], `${t.t} → ${v}`).toBeDefined();
  });

  it("have no duplicate traits", () => {
    const names = TRAITS.map((t) => t.t);
    expect(new Set(names).size).toBe(names.length);
  });
});
