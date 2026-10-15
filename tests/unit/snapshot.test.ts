// Fixed seeds, fixed output. A failing snapshot means generation changed:
// review the diff, and if the change is intended, update with `npm test -- -u`.

import { describe, expect, it } from "vitest";
import { rollCharacter, toMarkdown } from "../../src/engine/index.ts";

describe("snapshots", () => {
  for (const [genre, seed] of [
    ["fantasy", "snap-1"],
    ["modern", "snap-2"],
    ["scifi", "snap-3"],
  ] as const) {
    it(`${genre} character ${seed}`, () => {
      const c = rollCharacter({ genre, seed });
      expect(toMarkdown(c, { mode: "tabletop", system: "dnd5e", level: 3 })).toMatchSnapshot();
    });
  }
});
