// Rarity data.
//
// Two kinds of rarity:
//  - REAL: drawn from real-world statistics. Roll odds follow the real
//    numbers (square-root damped so rare jobs still turn up), and the tier
//    comes from the real count.
//  - DESIGNED: no real-world statistic exists (fantasy, sci-fi, or a
//    situation nobody counts). Tier is set by hand.
//
// Identity (name, culture, pronouns, ancestry, age) is deliberately never
// given a rarity: it would rank real kinds of people as "common" or "rare".

// Tiers double as character grades. A grade says how much story a character
// can carry, from a face in the crowd to a hero of legend.
export const TIERS = [
  { id: "common", label: "Common", weight: 1, story: "Background character", blurb: "A face in the crowd: the barkeep, the gate guard, the clerk." },
  { id: "uncommon", label: "Uncommon", weight: 0.55, story: "Named NPC", blurb: "Someone worth a name and one good scene." },
  { id: "rare", label: "Rare", weight: 0.28, story: "Supporting character", blurb: "A companion, rival or mentor with a story of their own." },
  { id: "epic", label: "Epic", weight: 0.12, story: "Protagonist", blurb: "Strong enough to carry a story." },
  { id: "legendary", label: "Legendary", weight: 0.05, story: "Hero of legend", blurb: "The kind of figure stories are told about." },
];

// How strongly a table entry's tier should match the character's grade.
// Index = distance between the two. A Legendary hero mostly gets
// Legendary-scale secrets; a background character mostly gets small ones.
export const GRADE_MATCH = [4, 1.6, 0.35, 0.1, 0.03];

// Tier cut-offs for real job counts (U.S. jobs).
export const JOB_TIERS = [
  { min: 1_000_000, tier: 0 },
  { min: 500_000, tier: 1 },
  { min: 100_000, tier: 2 },
  { min: 0, tier: 3 },
];

// Source: U.S. Bureau of Labor Statistics, Occupational Outlook Handbook,
// "Number of Jobs, 2025" (https://www.bls.gov/ooh/). Retrieved Oct 2026.
export const REAL_SOURCE = {
  short: "BLS 2025",
  long: "U.S. Bureau of Labor Statistics, Occupational Outlook Handbook, number of jobs in 2025",
  url: "https://www.bls.gov/ooh/",
};

export const REAL = {
  modern: {
    occupation: {
      "an ER nurse": { count: 3465400, basis: "registered nurses", url: "https://www.bls.gov/ooh/healthcare/registered-nurses.htm" },
      "a line cook": { count: 1417500, basis: "restaurant cooks", url: "https://www.bls.gov/ooh/food-preparation-and-serving/cooks.htm" },
      "a public defender": { count: 863700, basis: "all lawyers (public defenders are a small share)", url: "https://www.bls.gov/ooh/legal/lawyers.htm" },
      "a paramedic": { count: 102200, basis: "paramedics", url: "https://www.bls.gov/ooh/healthcare/emts-and-paramedics.htm" },
      "a high school teacher": { count: 1087500, basis: "high school teachers", url: "https://www.bls.gov/ooh/education-training-and-library/high-school-teachers.htm" },
      "a bartender": { count: 762600, basis: "bartenders", url: "https://www.bls.gov/ooh/food-preparation-and-serving/bartenders.htm" },
      "an investigative reporter": { count: 47100, basis: "news analysts, reporters and journalists", url: "https://www.bls.gov/ooh/media-and-communication/reporters-correspondents-and-broadcast-news-analysts.htm" },
      "a private investigator": { count: 39500, basis: "private detectives and investigators", url: "https://www.bls.gov/ooh/protective-service/private-detectives-and-investigators.htm" },
      "a software engineer": { count: 1717800, basis: "software developers", url: "https://www.bls.gov/ooh/computer-and-information-technology/software-developers.htm" },
      "a mechanic": { count: 825800, basis: "automotive service technicians and mechanics", url: "https://www.bls.gov/ooh/installation-maintenance-and-repair/automotive-service-technicians-and-mechanics.htm" },
      "a police detective": { count: 120500, basis: "detectives and criminal investigators", url: "https://www.bls.gov/ooh/protective-service/police-and-detectives.htm" },
      "a social worker": { count: 816100, basis: "social workers", url: "https://www.bls.gov/ooh/community-and-social-service/social-workers.htm" },
      "a session musician": { count: 170400, basis: "musicians and singers", url: "https://www.bls.gov/ooh/entertainment-and-sports/musicians-and-singers.htm" },
      "a long-haul trucker": { count: 2221200, basis: "heavy and tractor-trailer truck drivers", url: "https://www.bls.gov/ooh/transportation-and-material-moving/heavy-and-tractor-trailer-truck-drivers.htm" },
    },
  },
};

// Hand-set tiers: 0 common, 1 uncommon, 2 rare, 3 epic, 4 legendary.
// Anything not listed is common.
export const DESIGNED = {
  occupation: {
    fantasy: {
      "a hedge witch": 2, "a court scribe": 1, "a failed wizard's apprentice": 1, "a traveling minstrel": 1,
      "a deserter from the duke's army": 1, "a monster hunter for hire": 2, "a smuggler on the river barges": 1,
      "a grave warden": 2, "a cartographer": 2, "an oath-bound knight": 3, "a cultist who escaped": 3, "an alchemist": 2,
    },
    modern: {
      // No labor statistic counts these.
      "a small-time con artist": 3, "a security consultant who used to be a burglar": 4, "a youth pastor": 2,
    },
    scifi: {
      "a smuggler": 1, "a xenobiologist": 2, "a freelance hacker": 1, "a colonial marshal": 2, "a salvager": 1,
      "an AI ethicist": 3, "a diplomat": 2, "a preacher of the Long Signal": 3, "an archivist of lost Earth": 4,
    },
  },
  event: {
    fantasy: {
      "the betrayal": 1, "the tavern death": 1, "the mage who left": 3, "the seizure of the family lands": 1,
      "the lost winter": 2, "the indenture": 1, "the miracle": 4, "{their} sister's disappearance": 2,
    },
    modern: {
      "{their} brother's overdose": 1, "the testimony": 3, "the accident": 1, "the house fire": 1,
      "the deployment": 1, "the video": 3,
    },
    scifi: {
      "the breach": 1, "the water scandal": 2, "the surplus order": 1, "the failed contact": 4, "the sale": 1,
      "the caretaker years": 3, "the mutiny": 2, "the lottery seat": 1,
    },
  },
  want: {
    "clear {their} family's name": 1, "learn the truth about the past": 1, "make up for a terrible choice": 1,
    "go where no map reaches": 2, "bring down the powerful": 2, "keep a dangerous promise": 3, "prove {their} mentor wrong": 1,
    "stop the catastrophe only {they} can see": 4, "break {their} family's curse": 3, "overthrow the power that rules {their} world": 4,
  },
  hook: {
    "is carrying a {package} {they} {was} paid to deliver. {They} read it. {They} {has}n't delivered it.": 2,
    "is the only living witness to a crime that powerful people want forgotten.": 2,
    "has been sending money every month to a family that doesn't know who it comes from.": 1,
    "once went by a different name, and someone in {city} just recognized the old one.": 1,
    "found something on {their} last job that {they} {has}n't told anyone about.": 1,
    "made a promise to a dying stranger and still {does}n't know what it means.": 3,
    "has a twin nobody here knows about.": 3,
    "keeps receiving {messages} from someone {they} buried.": 4,
    "stole something small years ago that turned out to matter enormously.": 2,
    "knows where the missing heir is hiding.": 3,
    "is secretly the person everyone is looking for.": 4,
    "is the subject of a prophecy {they} {has} spent {their} whole life trying to outrun.": 4,
    "carries the only key to something that was locked away for a very good reason.": 3,
    "is the lost heir of the very power {they} {is} fighting against.": 4,
    // tier 0 entries (small secrets) are common by default
  },
  lie: {
    "Power is the only real safety.": 1, "The rules exist for a reason, and the reason is always good.": 1,
    "Feelings get people killed.": 1, "If I stop moving, I'll have to feel it.": 1,
    "Being clever is the same as being right.": 2, "The world can't change, so why try?": 1,
    "Faith protects the faithful.": 3,
  },
};

const tierFromCount = (count) => JOB_TIERS.find((t) => count >= t.min).tier;

// Rarity facts for one rolled piece.
export function rarityOf(kind, genre, key) {
  const real = REAL[genre]?.[kind]?.[key];
  if (real) {
    return {
      tier: tierFromCount(real.count),
      source: "real",
      count: real.count,
      basis: real.basis,
      url: real.url,
    };
  }
  const table = DESIGNED[kind];
  const tier = (table?.[genre] && typeof table[genre] === "object" ? table[genre][key] : table?.[key]) ?? 0;
  return { tier, source: "designed" };
}

// Roll weight for a table entry. Real data: proportional to the square root
// of the real count (so a 3.5M-job nurse is ~9x as likely as a 40k-job
// investigator, not 88x). Designed: by tier.
export function rollWeight(kind, genre, key) {
  const real = REAL[genre]?.[kind]?.[key];
  if (real) return Math.sqrt(real.count / 1_000_000);
  return TIERS[rarityOf(kind, genre, key).tier].weight;
}
