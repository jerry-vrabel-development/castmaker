// Token filling, pronoun agreement and small text helpers.

export const PRONOUNS = {
  she: { label: "she/her", they: "she", them: "her", their: "her", theirs: "hers", themself: "herself", was: "was", is: "is", has: "has", does: "does" },
  he: { label: "he/him", they: "he", them: "him", their: "his", theirs: "his", themself: "himself", was: "was", is: "is", has: "has", does: "does" },
  they: { label: "they/them", they: "they", them: "them", their: "their", theirs: "theirs", themself: "themself", was: "were", is: "are", has: "have", does: "do" },
};

// Replace {token} with ctx values. {Token} capitalizes the result.
// Runs twice so tokens inside filled values (e.g. an event's short name) resolve too.
export function fill(str, ctx) {
  if (str == null) return "";
  let out = String(str);
  for (let pass = 0; pass < 2; pass++) {
    out = out.replace(/\{(\w+)\}/g, (m, key) => {
      const lower = key[0].toLowerCase() + key.slice(1);
      const v = ctx[lower];
      if (v == null) return m;
      const s = String(v);
      return key[0] !== lower[0] ? cap(s) : s;
    });
  }
  return out;
}

export const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s);

export const article = (word) => (/^[aeiou]/i.test(word) ? "an" : "a");

export const stripArticle = (s) => s.replace(/^(a|an|the) /i, "");

export function joinList(items) {
  if (items.length <= 1) return items.join("");
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}
