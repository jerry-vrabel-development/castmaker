// The prose layer. Rules decide every fact; a ProseProvider only writes
// sentences about those facts and must never change them.
//
// Interface:
//   { id, label, available: boolean, render(character) => ProseResult }
//   ProseResult: { pitch, backstory, gmNotes, arc: {start, turn, end}, wound,
//                  partyHook, hook, voiceLine, archetypeLabel }
//
// Planned providers (see README, "Zero-budget AI strategy"):
//   1. templates   — built in, offline, always available (this release)
//   2. byok        — user's own AI key, called straight from the browser
//   3. on-device   — small open model running in the browser
// An AI provider should start from the template result and only rewrite the
// prose fields, so the app keeps working if a call fails.

import type { Character } from "../types.ts";
import { TemplateProvider, type ProseResult } from "./templates.ts";

export interface ProseProvider {
  id: string;
  label: string;
  available: boolean;
  render(character: Character): ProseResult;
}

const providers: Record<string, ProseProvider> = { templates: TemplateProvider };

export function getProvider(id = "templates"): ProseProvider {
  const p = providers[id];
  return p && p.available ? p : TemplateProvider;
}

export function renderProse(character: Character, providerId?: string): ProseResult {
  return getProvider(providerId).render(character);
}
