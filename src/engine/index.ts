// Public API of the Castmaker engine. Everything here runs without a browser.

export * from "./types.ts";
export {
  rollCharacter,
  rerollSection,
  toggleLock,
  upgradeCharacter,
  resetRecent,
  SECTIONS,
  CORE_SECTIONS,
  LAYER_SECTIONS,
  STRENGTHS,
  ARCHETYPES,
} from "./generate.ts";
export type { RollOptions } from "./generate.ts";
export { computeRarity, TIERS } from "./rarity.ts";
export type { RarityInfo } from "./rarity.ts";
export { gradeOdds, oddsAtLeast, oneIn, GRADE_MIN } from "./dice.ts";
export { renderProse, getProvider } from "./prose/provider.ts";
export type { ProseProvider } from "./prose/provider.ts";
export { textContext, loveLabel, giftList, foundationSummary, valuesSummary } from "./prose/templates.ts";
export type { ProseResult } from "./prose/templates.ts";
export { toMarkdown, toJSON } from "./export.ts";
export type { MarkdownOptions } from "./export.ts";
export { toDnd5e, alignment, signed, ABILITIES, ATTRIBUTION } from "./adapters/dnd5e.ts";
export { GENRES, GENRE_ORDER } from "./data/genres/index.ts";
export { fill, cap, stripArticle, PRONOUNS } from "./text.ts";
export type { TextContext } from "./text.ts";
export { BIG5 as BIG5_DIMS, FOUNDATIONS, VALUES } from "./data/psyche.ts";
