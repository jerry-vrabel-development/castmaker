// Grades, stakes and real-world odds.
//
// Only the whole character has a rarity: its grade, rolled with real dice
// (see js/engine/dice.js). Nothing else is labeled.
//
// Behind the scenes, two things still shape what a roll contains:
//  - STAKES (0-4): how big a secret, want or defining event is. Entries close
//    to the character's grade are much more likely, so background characters
//    get small, personal stakes and heroes get world-shaking ones.
//  - REAL ODDS: modern occupations turn up in proportion to real U.S. job
//    counts, so nurses and truckers are common and private eyes are not.
//
// Identity (name, culture, pronouns, orientation, ancestry, age) never
// affects the grade and is never ranked.

export const TIERS = [
  { id: "common", label: "Common" },
  { id: "uncommon", label: "Uncommon" },
  { id: "rare", label: "Rare" },
  { id: "epic", label: "Epic" },
  { id: "legendary", label: "Legendary" },
];

// How strongly an entry's stakes should match the character's grade.
// Index = distance between the two.
export const GRADE_MATCH = [4, 1.6, 0.35, 0.1, 0.03];

// Source: U.S. Bureau of Labor Statistics, Occupational Outlook Handbook,
// "Number of Jobs, 2025" (https://www.bls.gov/ooh/). Retrieved Oct 2026.
export const REAL_SOURCE = {
  short: "BLS 2025",
  long: "U.S. Bureau of Labor Statistics, Occupational Outlook Handbook, number of jobs in 2025",
  url: "https://www.bls.gov/ooh/",
};

const OOH = "https://www.bls.gov/ooh/";
export const REAL_JOBS = {
  modern: {
    "an ER nurse": { count: 3465400, basis: "registered nurses", url: OOH + "healthcare/registered-nurses.htm" },
    "a line cook": { count: 1417500, basis: "restaurant cooks", url: OOH + "food-preparation-and-serving/cooks.htm" },
    "a public defender": { count: 863700, basis: "all lawyers (public defenders are a small share)", url: OOH + "legal/lawyers.htm" },
    "a paramedic": { count: 102200, basis: "paramedics", url: OOH + "healthcare/emts-and-paramedics.htm" },
    "a high school teacher": { count: 1087500, basis: "high school teachers", url: OOH + "education-training-and-library/high-school-teachers.htm" },
    "a bartender": { count: 762600, basis: "bartenders", url: OOH + "food-preparation-and-serving/bartenders.htm" },
    "an investigative reporter": { count: 47100, basis: "news analysts, reporters and journalists", url: OOH + "media-and-communication/reporters-correspondents-and-broadcast-news-analysts.htm" },
    "a private investigator": { count: 39500, basis: "private detectives and investigators", url: OOH + "protective-service/private-detectives-and-investigators.htm" },
    "a software engineer": { count: 1717800, basis: "software developers", url: OOH + "computer-and-information-technology/software-developers.htm" },
    "a mechanic": { count: 825800, basis: "automotive service technicians and mechanics", url: OOH + "installation-maintenance-and-repair/automotive-service-technicians-and-mechanics.htm" },
    "a police detective": { count: 120500, basis: "detectives and criminal investigators", url: OOH + "protective-service/police-and-detectives.htm" },
    "a social worker": { count: 816100, basis: "social workers", url: OOH + "community-and-social-service/social-workers.htm" },
    "a session musician": { count: 170400, basis: "musicians and singers", url: OOH + "entertainment-and-sports/musicians-and-singers.htm" },
    "a long-haul trucker": { count: 2221200, basis: "heavy and tractor-trailer truck drivers", url: OOH + "transportation-and-material-moving/heavy-and-tractor-trailer-truck-drivers.htm" },
    "an electrician": { count: 821000, basis: "electricians", url: OOH + "construction-and-extraction/electricians.htm" },
    "a firefighter": { count: 355300, basis: "firefighters (excluding volunteers)", url: OOH + "protective-service/firefighters.htm" },
    "a pharmacist": { count: 325200, basis: "pharmacists", url: OOH + "healthcare/pharmacists.htm" },
    "a plumber": { count: 510600, basis: "plumbers, pipefitters and steamfitters", url: OOH + "construction-and-extraction/plumbers-pipefitters-and-steamfitters.htm" },
    "a real estate agent": { count: 530600, basis: "real estate brokers and sales agents", url: OOH + "sales/real-estate-brokers-and-sales-agents.htm" },
    "a night-shift security guard": { count: 1294300, basis: "security guards", url: OOH + "protective-service/security-guards.htm" },
    "a farmer": { count: 788700, basis: "farmers, ranchers and other agricultural managers", url: OOH + "management/farmers-ranchers-and-other-agricultural-managers.htm" },
    "a librarian": { count: 142300, basis: "librarians and library media specialists", url: OOH + "education-training-and-library/librarians.htm" },
    "a veterinarian": { count: 91100, basis: "veterinarians", url: OOH + "healthcare/veterinarians.htm" },
    "a commercial pilot": { count: 154900, basis: "airline and commercial pilots", url: OOH + "transportation-and-material-moving/airline-and-commercial-pilots.htm" },
    "an accountant": { count: 1595200, basis: "accountants and auditors", url: OOH + "business-and-financial/accountants-and-auditors.htm" },
    "a flight attendant": { count: 133700, basis: "flight attendants", url: OOH + "transportation-and-material-moving/flight-attendants.htm" },
    "a funeral director": { count: 34800, basis: "funeral home managers", url: OOH + "personal-care-and-service/funeral-service-occupations.htm" },
    "a chef": { count: 220300, basis: "chefs and head cooks", url: OOH + "food-preparation-and-serving/chefs-and-head-cooks.htm" },
    "a carpenter": { count: 889700, basis: "carpenters", url: OOH + "construction-and-extraction/carpenters.htm" },
  },
};

// Hand-set stakes for entries written before stakes moved into the tables.
// New entries carry their own `tier`. Anything unlisted is 0.
const LEGACY_STAKES = {
  event: {
    "the betrayal": 1, "the tavern death": 1, "the mage who left": 3, "the seizure of the family lands": 1,
    "the lost winter": 2, "the indenture": 1, "the miracle": 4, "{their} sister's disappearance": 2,
    "{their} brother's overdose": 1, "the testimony": 3, "the accident": 1, "the house fire": 1,
    "the deployment": 1, "the video": 3,
    "the breach": 1, "the water scandal": 2, "the surplus order": 1, "the failed contact": 4, "the sale": 1,
    "the caretaker years": 3, "the mutiny": 2, "the lottery seat": 1,
  },
  want: {
    "clear {their} family's name": 1, "learn the truth about the past": 1, "make up for a terrible choice": 1,
    "go where no map reaches": 2, "bring down the powerful": 2, "keep a dangerous promise": 3, "prove {their} mentor wrong": 1,
    "stop the catastrophe only {they} can see": 4, "break {their} family's curse": 3, "overthrow the power that rules {their} world": 4,
    "find the one who betrayed {them}": 1, "pay off a dangerous debt": 1, "keep a younger sibling safe": 1,
  },
  hook: {
    "is carrying a {package} {they} {was} paid to deliver. {They} read it. {They} {has}n't delivered it.": 2,
    "is the only living witness to a crime that powerful people want forgotten.": 2,
    "has been sending money every month to a family that doesn't know who it comes from.": 1,
    "once went by a different name, and someone in {city} just recognized the old one.": 1,
    "found something on {their} last job that {they} {has}n't told anyone about.": 1,
    "made a promise to a dying stranger and still {does}n't know what it means.": 3,
    "has a twin nobody here knows about.": 2,
    "keeps receiving {messages} from someone {they} buried.": 3,
    "stole something small years ago that turned out to matter enormously.": 2,
    "knows where the missing heir is hiding.": 3,
    "is secretly the person everyone is looking for.": 4,
    "is the subject of a prophecy {they} {has} spent {their} whole life trying to outrun.": 4,
    "carries the only key to something that was locked away for a very good reason.": 3,
    "is the lost heir of the very power {they} {is} fighting against.": 4,
    "owes a large sum to someone who would much rather be owed a favor.": 1,
    "is being quietly watched, and {has} noticed.": 1,
    "was promised a reward for a job and is about to learn the reward was a lie.": 1,
  },
};

// Hand-set odds for occupations with no real-world statistic, relative to a
// job with a million U.S. workers (1.0). Unlisted fantasy and sci-fi jobs are 1.
const DESIGNED_JOB_ODDS = {
  "a hedge witch": 0.3, "a court scribe": 0.55, "a failed wizard's apprentice": 0.55, "a traveling minstrel": 0.55,
  "a deserter from the duke's army": 0.55, "a monster hunter for hire": 0.3, "a smuggler on the river barges": 0.55,
  "a grave warden": 0.3, "a cartographer": 0.3, "an oath-bound knight": 0.15, "a cultist who escaped": 0.15, "an alchemist": 0.3,
  "a small-time con artist": 0.12, "a security consultant who used to be a burglar": 0.05, "a youth pastor": 0.25,
  "a smuggler": 0.55, "a xenobiologist": 0.3, "a freelance hacker": 0.55, "a colonial marshal": 0.3, "a salvager": 0.55,
  "an AI ethicist": 0.15, "a diplomat": 0.3, "a preacher of the Long Signal": 0.15, "an archivist of lost Earth": 0.06,
};

// The stakes of a secret, want or event entry.
export function stakeOf(kind, entry, key) {
  if (entry && entry.tier != null) return entry.tier;
  return LEGACY_STAKES[kind]?.[key] ?? 0;
}

// Roll weight for an occupation. Real data: proportional to the square root
// of the job count, so a 3.5M-job nurse is about 9x as likely as a 40k-job
// private investigator rather than 88x. Otherwise hand-set odds.
export function occupationWeight(genre, occ) {
  const real = REAL_JOBS[genre]?.[occ.t];
  if (real) return Math.sqrt(real.count / 1_000_000);
  return occ.w ?? DESIGNED_JOB_ODDS[occ.t] ?? 1;
}

export function realJob(genre, t) {
  return REAL_JOBS[genre]?.[t] || null;
}
