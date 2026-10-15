import type { Genre, GenreId } from "../../types.ts";
import fantasy from "./fantasy.ts";
import modern from "./modern.ts";
import scifi from "./scifi.ts";

export const GENRES: Record<GenreId, Genre> = { fantasy, modern, scifi };
export const GENRE_ORDER: GenreId[] = ["fantasy", "modern", "scifi"];
