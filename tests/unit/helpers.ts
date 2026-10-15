import { GENRE_ORDER, rollCharacter, type Character } from "../../src/engine/index.ts";

/** Roll a fixed, reproducible set of characters across every genre. */
export function rollMany(perGenre: number, prefix = "t"): Character[] {
  const out: Character[] = [];
  for (const genre of GENRE_ORDER) {
    for (let i = 0; i < perGenre; i++) {
      out.push(rollCharacter({ genre, seed: `${prefix}-${genre}-${i}`, orientation: i % 2 ? "even" : "realistic" }));
    }
  }
  return out;
}

/** A character without the fields that change on every run (id and timestamps). */
export function stable(c: Character): Omit<Character, "id" | "created" | "updated"> {
  const { id: _id, created: _c, updated: _u, ...rest } = c;
  return rest;
}
