import { describe, expect, it } from "vitest";
import { PRONOUNS, article, cap, fill, joinList, stripArticle } from "../../src/engine/text.ts";

describe("text", () => {
  it("fills tokens and capitalizes {Token}", () => {
    expect(fill("{They} said {their} piece.", { ...PRONOUNS.she })).toBe("She said her piece.");
  });

  it("keeps verbs in agreement with the pronoun", () => {
    const line = "{they} {is} sure {they} {has} it and {does}n't care; {they} know{s}.";
    expect(fill(line, { ...PRONOUNS.they })).toBe("they are sure they have it and don't care; they know.");
    expect(fill(line, { ...PRONOUNS.he })).toBe("he is sure he has it and doesn't care; he knows.");
  });

  it("resolves tokens nested inside filled values", () => {
    expect(fill("Bring up {eventShort}.", { eventShort: "{their} wedding", their: "his" })).toBe(
      "Bring up his wedding.",
    );
  });

  it("leaves unknown tokens visible so tests can catch them", () => {
    expect(fill("A {mystery}.", {})).toBe("A {mystery}.");
  });

  it("handles articles, capitals and lists", () => {
    expect(article("ostler")).toBe("an");
    expect(article("smith")).toBe("a");
    expect(stripArticle("an ER nurse")).toBe("ER nurse");
    expect(cap("hello")).toBe("Hello");
    expect(joinList(["a"])).toBe("a");
    expect(joinList(["a", "b"])).toBe("a and b");
    expect(joinList(["a", "b", "c"])).toBe("a, b, and c");
  });
});
