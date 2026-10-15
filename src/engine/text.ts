import type { PronounSet } from "./types.ts";

// Token filling, pronoun agreement and small text helpers.

export interface PronounForms {
  label: string;
  they: string;
  them: string;
  their: string;
  theirs: string;
  themself: string;
  was: string;
  is: string;
  has: string;
  does: string;
  s: string;
  es: string;
}

export const PRONOUNS: Record<PronounSet, PronounForms> = {
  she: {
    label: "she/her",
    they: "she",
    them: "her",
    their: "her",
    theirs: "hers",
    themself: "herself",
    was: "was",
    is: "is",
    has: "has",
    does: "does",
    s: "s",
    es: "es",
  },
  he: {
    label: "he/him",
    they: "he",
    them: "him",
    their: "his",
    theirs: "his",
    themself: "himself",
    was: "was",
    is: "is",
    has: "has",
    does: "does",
    s: "s",
    es: "es",
  },
  they: {
    label: "they/them",
    they: "they",
    them: "them",
    their: "their",
    theirs: "theirs",
    themself: "themself",
    was: "were",
    is: "are",
    has: "have",
    does: "do",
    s: "",
    es: "",
  },
};

// Replace {token} with ctx values. {Token} capitalizes the result.
// Runs twice so tokens inside filled values (e.g. an event's short name) resolve too.
export type TextContext = Record<string, string | number | undefined>;

export function fill(str: string | null | undefined, ctx: TextContext): string {
  if (str == null) return "";
  let out = String(str);
  for (let pass = 0; pass < 2; pass++) {
    out = out.replace(/\{(\w+)\}/g, (m: string, key: string) => {
      const lower = key.charAt(0).toLowerCase() + key.slice(1);
      const v = ctx[lower];
      if (v == null) return m;
      const s = String(v);
      return key.charAt(0) !== lower.charAt(0) ? cap(s) : s;
    });
  }
  return out;
}

export const cap = (s: string): string => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

export const article = (word: string): string => (/^[aeiou]/i.test(word) ? "an" : "a");

export const stripArticle = (s: string): string => s.replace(/^(a|an|the) /i, "");

export function joinList(items: string[]): string {
  if (items.length <= 1) return items.join("");
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}
