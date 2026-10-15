// Shared types for the Castmaker engine. The engine has no browser code, so
// it can run in tests, tools, a server, or another app.

// ---------- content ----------

/** Themes that link table entries together; see "How coherence works" in the README. */
export const TAGS = [
  "loss",
  "violence",
  "faith",
  "wealth",
  "poverty",
  "learning",
  "crime",
  "duty",
  "wild",
  "art",
  "betrayal",
  "ambition",
  "family",
  "isolation",
  "craft",
  "travel",
  "healing",
  "secrecy",
  "order",
  "chaos",
  "tech",
] as const;
export type Tag = (typeof TAGS)[number];
export type TagBag = Partial<Record<Tag, number>>;

/** Stakes and grades both run 0 (Common) to 4 (Legendary). */
export type Tier = 0 | 1 | 2 | 3 | 4;

export type GenreId = "fantasy" | "modern" | "scifi";
export type PronounSet = "she" | "he" | "they";
export type Archetype = "warrior" | "skulker" | "caster" | "face" | "healer" | "sage" | "wild";
export type Big5Dim = "O" | "C" | "E" | "A" | "N";
export type Big5 = Record<Big5Dim, number>;
/** A Big Five lean such as "A+ N-". */
export type Big5Code = string;

/** The simplest table entry: a phrase and the themes it carries. */
export interface Tagged {
  t: string;
  tags: Tag[];
}

export interface TraitEntry extends Tagged {
  law?: number;
  good?: number;
  opp?: string;
}

export interface TemperamentEntry extends Tagged {
  phrase: string;
  voices: string[];
}

export interface VoiceStyle {
  desc: string;
  habits: string[];
  lines: string[];
}

export interface WantEntry extends Tagged {
  short: string;
  why: string[];
  tier?: Tier;
}

export interface StakedEntry extends Tagged {
  tier?: Tier;
}

export interface LieEntry {
  lie: string;
  need: string;
  never: string;
  tags: Tag[];
}

export interface RoleEntry {
  t: string;
  minGood?: number;
  maxGood?: number;
  minAge?: number;
  chaos?: boolean;
}

export interface RelationshipType {
  type: string;
  tags: Tag[];
  notes: string[];
}

export interface MoralLine extends Tagged {
  mercy?: number;
  order?: number;
}

export interface SecretParts {
  acts: { t: string; tier: Tier }[];
  whom: string[];
  twists: string[];
}

export interface B5Entry {
  t: string;
  b5: Big5Code;
}

export interface ScoredDimension {
  id: string;
  label: string;
  desc: string;
  tags: TagBag;
  b5: Partial<Big5>;
}

export interface Foundation extends ScoredDimension {
  high: string;
  low: string;
}

// ---------- genres ----------

export interface Culture {
  people: string;
  first: string[];
  last: string[];
}

export interface People {
  label: string;
  age: [number, number];
}

export interface Origin extends Tagged {
  short: string;
  cultures: string[];
}

export interface Occupation extends Tagged {
  arch: Archetype[];
  skills: string[];
  /** Hand-set odds relative to a million-job real occupation. */
  w?: number;
}

export interface EventEntry extends Tagged {
  short: string;
  wound: string;
  tier?: Tier;
}

export interface GiftEntry extends Tagged {
  tier: 1 | 2 | 3 | 4;
}

export interface Genre {
  id: GenreId;
  label: string;
  vocab: Record<string, string>;
  cultures: Record<string, Culture>;
  peoples: Record<string, People>;
  origins: Origin[];
  upbringings: Tagged[];
  occupations: Occupation[];
  events: EventEntry[];
  gifts: GiftEntry[];
  appearance: { builds: string[]; features: string[]; styles: string[]; items: string[] };
  combat: Record<Archetype, string[]>;
  abilities: Record<Archetype, string[]>;
}

// ---------- a character ----------

export interface GradeSection {
  rolls: number[];
  total: number;
  tier: Tier;
}

export interface IdentitySection {
  name: string;
  first: string;
  last: string;
  age: number;
  pronouns: PronounSet;
  people: string;
  peopleLabel: string;
  culture: string;
  origin: string;
  originShort: string;
  occupation: { t: string; arch: Archetype[]; skills: string[] };
}

export interface LoveSection {
  orientation: string;
  kind: "different" | "same" | "multi" | "none";
  target: "man" | "woman" | null;
  variant: string | null;
  status: string;
  partner: { name: string; gender: "man" | "woman" | "nonbinary" } | null;
  years: number;
  note: string;
}

export interface BackgroundSection {
  upbringing: string;
  event: { t: string; short: string; wound: string; tags: Tag[] };
  turningPoint: string;
}

export interface PersonalitySection {
  big5: Big5;
  traits: { t: string; law: number; good: number }[];
  temperament: { t: string; phrase: string; voices: string[] };
  stress: string;
  conflict: string;
  strangers: string;
  humor: string;
  strengths: string[];
  likes: string[];
  dislikes: string[];
  habit: string;
  quirks: string[];
}

export interface FlawsSection {
  defining: string;
  minor: string[];
  vice: string;
  deepFear: string;
  rooted: boolean;
  phobia: string;
  socialFear: string;
  coping: string;
}

export interface MotivationSection {
  want: string;
  short: string;
  why: string;
}

export interface MoralitySection {
  foundations: Record<string, number>;
  values: Record<string, number>;
  line: string;
  breakingPoint: string;
}

export interface GiftSection {
  list: { t: string; tier: number }[];
}

export interface AppearanceSection {
  build: string;
  features: string[];
  style: string;
  item: string;
}

export interface VoiceSection {
  style: string;
  desc: string;
  habits: string[];
  line: string;
}

export interface HookSection {
  t: string;
  built?: boolean;
}

export interface RelationshipsSection {
  list: { type: string; name: string; note: string }[];
}

export type Strengths = Record<"might" | "agility" | "wits" | "presence" | "resolve", number>;

export interface TabletopLayer {
  archetype: Archetype;
  strengths: Strengths;
  combatStyle: string;
  abilities: string[];
  partyHook: string;
  systems: { dnd5e: { class: string } };
}

export interface WriterLayer {
  lie: string;
  need: string;
  never: string;
  lieTags: Tag[];
  role: string;
  arcType: "positive" | "negative" | "flat";
  turn: string;
}

/** Every section also carries the tags it contributes to coherence. */
type WithTags<S> = S & { _tags: Tag[] };

export interface CoreSections {
  grade: WithTags<GradeSection>;
  identity: WithTags<IdentitySection>;
  love: WithTags<LoveSection>;
  background: WithTags<BackgroundSection>;
  personality: WithTags<PersonalitySection>;
  flaws: WithTags<FlawsSection>;
  motivation: WithTags<MotivationSection>;
  morality: WithTags<MoralitySection>;
  gift: WithTags<GiftSection>;
  appearance: WithTags<AppearanceSection>;
  voice: WithTags<VoiceSection>;
  hook: WithTags<HookSection>;
  relationships: WithTags<RelationshipsSection>;
}

export interface LayerSections {
  tabletop: WithTags<TabletopLayer>;
  writer: WithTags<WriterLayer>;
}

export type CoreKey = keyof CoreSections;
export type LayerKey = keyof LayerSections;
export type SectionKey = CoreKey | LayerKey;
export type AnySection = CoreSections[CoreKey] | LayerSections[LayerKey];

export interface Character {
  id: string;
  version: number;
  genre: GenreId;
  nature: "living" | "constructed";
  options: { orientation: "realistic" | "even" };
  seed: string;
  nonces: Partial<Record<SectionKey, number>>;
  locks: SectionKey[];
  core: CoreSections;
  layers: LayerSections;
  created: string;
  updated: string;
}

export type OrientationMode = "realistic" | "even";
