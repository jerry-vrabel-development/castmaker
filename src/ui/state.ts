// App state and the settings people choose, remembered between visits.

import type { Character, GenreId, OrientationMode } from "../engine/index.ts";

export interface Settings {
  genre: GenreId;
  mode: "tabletop" | "writer";
  depth: "quick" | "full";
  system: "dnd5e" | "agnostic";
  level: number;
  format: "md" | "json";
  reveal: "animated" | "instant";
  sound: "on" | "off";
  orient: "realistic" | "even" | "off";
  ethics: "foundations" | "values" | "both";
}

export const SETTINGS_KEY = "castmaker.settings.v1";
export const CURRENT_KEY = "castmaker.current.v1";

export const DEFAULT_SETTINGS: Settings = {
  genre: "fantasy",
  mode: "tabletop",
  depth: "full",
  system: "dnd5e",
  level: 1,
  format: "md",
  reveal: "animated",
  sound: "on",
  orient: "realistic",
  ethics: "both",
};

// Browser storage can be missing or blocked (private windows, embedded
// previews), so every read and write is allowed to fail quietly.
export function readLocal<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}
export function writeLocal(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage blocked */
  }
}

export interface AppState {
  settings: Settings;
  current: Character | null;
  /** The last saved version of the current character, to show "Saved" vs "Save changes". */
  savedSnapshot: string | null;
  roster: Character[];
}

export const state: AppState = {
  settings: { ...DEFAULT_SETTINGS, ...readLocal<Partial<Settings>>(SETTINGS_KEY, {}) },
  current: null,
  savedSnapshot: null,
  roster: [],
};

export const saveSettings = (): void => writeLocal(SETTINGS_KEY, state.settings);

export const orientMode = (): OrientationMode => (state.settings.orient === "even" ? "even" : "realistic");

export const snapshotOf = (c: Character): string => JSON.stringify(c.core) + JSON.stringify(c.layers);

export function isSaved(): boolean {
  const c = state.current;
  return !!c && state.savedSnapshot === snapshotOf(c);
}
