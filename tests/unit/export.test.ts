import { describe, expect, it } from "vitest";
import { rollCharacter, toJSON, toMarkdown } from "../../src/engine/index.ts";

describe("export", () => {
  const c = rollCharacter({ genre: "fantasy", seed: "export" });

  it("leaves internal coherence tags out of JSON", () => {
    const json = toJSON(c);
    expect(json).not.toContain("_tags");
    expect(JSON.parse(json).core.identity.name).toBe(c.core.identity.name);
  });

  it("includes the stat block only for D&D 5e", () => {
    expect(toMarkdown(c, { system: "dnd5e" })).toContain("### D&D 5e");
    expect(toMarkdown(c, { system: "agnostic" })).not.toContain("### D&D 5e");
  });

  it("switches between tabletop and writer sections", () => {
    expect(toMarkdown(c, { mode: "tabletop" })).toContain("## Tabletop");
    expect(toMarkdown(c, { mode: "writer" })).toContain("## Writer");
  });

  it("hides the love life when asked", () => {
    expect(toMarkdown(c, { showLove: true })).toContain("**Love life:**");
    expect(toMarkdown(c, { showLove: false })).not.toContain("**Love life:**");
  });

  it("shows either or both moral systems", () => {
    expect(toMarkdown(c, { ethics: "foundations" })).not.toContain("**Values:**");
    expect(toMarkdown(c, { ethics: "values" })).not.toContain("**Moral Foundations:**");
    const both = toMarkdown(c, { ethics: "both" });
    expect(both).toContain("**Values:**");
    expect(both).toContain("**Moral Foundations:**");
  });
});
