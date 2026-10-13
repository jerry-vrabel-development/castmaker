// Orientation and love life.
//
// Orientation is part of identity, like pronouns: it is never part of the
// grade, and it never feeds the tag system, so it can't nudge personality,
// flaws, jobs or anything else. It only shapes the character's love life.
//
// REALISTIC odds come from Gallup's 2025 survey of 13,454 U.S. adults
// (published Feb 16, 2026): 86% straight, 5.3% bisexual, 1.6% gay,
// 1.4% lesbian, 0.5% other (e.g. queer, pansexual), 5% no answer.
// https://news.gallup.com/poll/702206/lgbtq-identification-holds.aspx
// Gallup doesn't report asexual identity separately; 1% is a commonly cited
// research estimate and is marked as an estimate here.
// Transgender identity is a gender identity, not an orientation, so it is not
// part of this table.

export const ORIENTATION_SOURCE = {
  short: "Gallup 2025",
  url: "https://news.gallup.com/poll/702206/lgbtq-identification-holds.aspx",
};

// kind: who the character is drawn to.
//   different: a gender other than their own; same: their own gender;
//   multi: more than one gender; none: little or no sexual attraction.
export const ORIENTATIONS = [
  { id: "straight", kind: "different", realistic: 86, even: 1 },
  { id: "gay-lesbian", kind: "same", realistic: 3.0, even: 1 },
  { id: "bisexual", kind: "multi", realistic: 5.3, even: 1 },
  { id: "pan-queer", kind: "multi", realistic: 0.5, even: 1 },
  { id: "asexual", kind: "none", realistic: 1.0, even: 1, estimate: true },
];

// Pronouns stand in for gender when labeling: she = woman, he = man,
// they = nonbinary.
export function orientationLabel(o, pronouns, variant) {
  switch (o.id) {
    case "straight":
      return pronouns === "they" ? `attracted to ${o.target === "woman" ? "women" : "men"}` : "straight";
    case "gay-lesbian":
      if (pronouns === "she") return "lesbian";
      if (pronouns === "he") return "gay";
      return `attracted to ${o.target === "woman" ? "women" : "men"}`;
    case "bisexual": return "bisexual";
    case "pan-queer": return variant || "pansexual";
    case "asexual": return "asexual";
    default: return "";
  }
}

// Relationship status by stage of life. Designed odds, not statistics.
export const STATUS_BY_STAGE = {
  young: { single: 45, dating: 33, partnered: 12, married: 9, divorced: 1, widowed: 0 },
  middle: { single: 20, dating: 11, partnered: 14, married: 38, divorced: 14, widowed: 3 },
  older: { single: 14, dating: 5, partnered: 8, married: 38, divorced: 15, widowed: 20 },
};

const SPOUSE = { woman: "wife", man: "husband", nonbinary: "spouse" };
export const spouseWord = (g) => SPOUSE[g] || "spouse";
export const personWord = (g) => ({ woman: "woman", man: "man", nonbinary: "nonbinary person" })[g] || "person";

// Notes after the character's name. Tokens: {partner} partner's name,
// {spouse} wife/husband/spouse, {pthey} {pthem} {ptheir} partner's pronouns,
// {duration} together.
export const LOVE_NOTES = {
  single: [
    "is single and hasn't looked for anyone in years",
    "is single, and quietly hoping someone will notice",
    "is single and prefers it that way",
    "is single and still getting over someone",
    "is single, and {their} friends keep trying to set {them} up",
    "is single and too busy to think about it, or says so",
    "is single, and writes letters {they} never send",
    "has been single since a bad ending {they} won't talk about",
  ],
  dating: [
    "is seeing {partner}, and it's getting serious",
    "has been on three dates with {partner} and can't stop thinking about {pthem}",
    "is seeing {partner} in secret",
    "is dating {partner}, and {their} family doesn't approve",
    "has just started seeing {partner}, who is far too good at cards",
    "is seeing {partner}, and neither of them wants to name it yet",
  ],
  partnered: [
    "has been with {partner} for {duration}, and they've never felt the need to marry",
    "lives with {partner}, who knows more of {their} secrets than anyone",
    "is with {partner}, though they spend more time apart than together",
    "has been with {partner} for {duration} and still leaves {pthem} notes",
    "is with {partner}, and they fight loudly and make up quickly",
  ],
  married: [
    "has been married to {partner}, {their} {spouse}, for {duration}",
    "is married to {partner}, and the marriage is quieter than it used to be",
    "is happily married to {partner}, which surprises people who meet {them}",
    "is married to {partner}, who thinks {they} {is} someone else entirely",
    "married {partner} young, and they grew up together",
    "is married to {partner}; it was arranged, and it became love anyway",
    "is married to {partner}, and they're saving for a life they never quite reach",
  ],
  divorced: [
    "is divorced from {partner}, and they still can't be in the same room",
    "is divorced from {partner}, and they've somehow become friends",
    "is divorced, and {partner} kept the house",
    "left {partner} {duration} ago and has never fully explained why",
    "is divorced from {partner}, who still writes every year on the same day",
  ],
  widowed: [
    "lost {their} {spouse}, {partner}, {duration} ago",
    "has been widowed for {duration} and still sets out two cups in the morning",
    "lost {partner} to illness and hasn't been the same since",
    "lost {partner} and wears {ptheir} ring on a cord",
  ],
  asexualSingle: [
    "is asexual and single, and {their} friends are {their} family",
    "is asexual, and has never felt the pull most people describe",
  ],
};
