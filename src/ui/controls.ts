// The settings rail: segmented controls and the 5e level input.

import { GENRE_ORDER } from "../engine/index.ts";
import { $, esc } from "./dom.ts";
import { state, type Settings } from "./state.ts";

type GroupKey = Exclude<keyof Settings, "level">;

const GENRE_LABELS = { fantasy: "Fantasy", modern: "Modern", scifi: "Sci-fi" } as const;

export const GROUPS: Record<GroupKey, { el: string; options: [string, string][] }> = {
  genre: { el: "#genre-group", options: GENRE_ORDER.map((g) => [g, GENRE_LABELS[g]]) },
  mode: {
    el: "#mode-group",
    options: [
      ["tabletop", "Tabletop"],
      ["writer", "Writer"],
    ],
  },
  depth: {
    el: "#depth-group",
    options: [
      ["quick", "Quick NPC"],
      ["full", "Full character"],
    ],
  },
  system: {
    el: "#system-group",
    options: [
      ["dnd5e", "D&D 5e"],
      ["agnostic", "Any system"],
    ],
  },
  format: {
    el: "#format-group",
    options: [
      ["md", "Markdown"],
      ["json", "JSON"],
    ],
  },
  reveal: {
    el: "#reveal-group",
    options: [
      ["animated", "Spin"],
      ["instant", "Fast"],
    ],
  },
  sound: {
    el: "#sound-group",
    options: [
      ["on", "On"],
      ["off", "Off"],
    ],
  },
  orient: {
    el: "#orient-group",
    options: [
      ["realistic", "Real"],
      ["even", "Even"],
      ["off", "Hide"],
    ],
  },
  ethics: {
    el: "#ethics-group",
    options: [
      ["foundations", "Foundations"],
      ["values", "Values"],
      ["both", "Both"],
    ],
  },
};

export const isGroupKey = (k: string): k is GroupKey => k in GROUPS;

export function renderGroups(): void {
  for (const [key, g] of Object.entries(GROUPS) as [GroupKey, (typeof GROUPS)[GroupKey]][]) {
    $(g.el).innerHTML = g.options
      .map(
        ([v, label]) =>
          `<button type="button" role="radio" id="${key}-${v}" data-group="${key}" data-value="${v}" aria-checked="${state.settings[key] === v}">${esc(label)}</button>`,
      )
      .join("");
  }
  const tt = state.settings.mode === "tabletop";
  $("#tt-depth").hidden = !tt;
  $("#tt-system").hidden = !tt;
  $("#tt-level").hidden = !(tt && state.settings.system === "dnd5e");
  $<HTMLInputElement>("#level").value = String(state.settings.level);
}
