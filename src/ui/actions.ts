// Everything a person can do: roll, reroll, lock, save, open, delete, and
// change settings. Each action updates state, then re-renders what changed.

import {
  GENRES,
  rerollSection,
  rollCharacter,
  toggleLock,
  upgradeCharacter,
  type Character,
  type SectionKey,
} from "../engine/index.ts";
import { reducedMotion, toast } from "./dom.ts";
import { renderGroups } from "./controls.ts";
import { fillExport } from "./exportDialog.ts";
import { confirm, renderRoster, renderSaveButton } from "./roster.ts";
import { flashSection, isRevealing, skipReveal } from "./reveal.ts";
import { renderSheet } from "./sheet/render.ts";
import { sfx } from "./sound.ts";
import { storage } from "./storage.ts";
import { CURRENT_KEY, orientMode, saveSettings, snapshotOf, state, writeLocal, type Settings } from "./state.ts";

export function setCurrent(c: Character, animate = false): void {
  state.current = c;
  writeLocal(CURRENT_KEY, c);
  renderSheet(animate);
  renderSaveButton();
  renderRoster();
}

// After a full roll, jump back to the top so the reveal is in view.
function scrollToTop(): void {
  try {
    window.scrollTo({ top: 0, behavior: reducedMotion() ? "auto" : "smooth" });
  } catch {
    window.scrollTo(0, 0);
  }
}

export function roll(): void {
  // Rolling again mid-reveal skips to the result instead.
  if (isRevealing()) {
    skipReveal();
    return;
  }
  const prev = state.current;
  const c = rollCharacter({
    genre: state.settings.genre,
    prev,
    locks: prev?.locks || [],
    avoidRepeats: true,
    orientation: orientMode(),
  });
  // Keep the same record when identity is locked, so it stays one character.
  if (prev && prev.locks.includes("identity")) c.id = prev.id;
  if (c.id !== prev?.id) state.savedSnapshot = null;
  setCurrent(c, true);
  scrollToTop();
}

export function reroll(section: SectionKey): void {
  if (!state.current) return;
  if (isRevealing()) skipReveal();
  setCurrent(rerollSection(state.current, section, { avoidRepeats: true }), false);
  if (state.settings.reveal !== "animated" || reducedMotion()) return;
  flashSection(document.querySelector(`#sheet [data-section-key="${section}"]`));
}

export function lock(section: SectionKey): void {
  if (!state.current) return;
  sfx.ui();
  setCurrent(toggleLock(state.current, section));
}

async function refreshRoster(): Promise<void> {
  state.roster = (await storage.list()).map(upgradeCharacter);
}

export async function save(): Promise<void> {
  if (!state.current) return;
  const saved = await storage.save(state.current);
  state.current = saved;
  state.savedSnapshot = snapshotOf(saved);
  writeLocal(CURRENT_KEY, saved);
  await refreshRoster();
  renderSaveButton();
  renderRoster();
  toast(`Saved ${saved.core.identity.first}`);
}

export function openSaved(id: string): void {
  const c = state.roster.find((r) => r.id === id);
  if (!c) return;
  if (c.genre !== state.settings.genre) {
    state.settings.genre = c.genre;
    saveSettings();
    renderGroups();
  }
  state.savedSnapshot = snapshotOf(c);
  setCurrent(structuredClone(c), true);
}

// Deleting takes two clicks: the first turns the button into "Delete?".
export async function deleteSaved(id: string): Promise<void> {
  if (confirm.id !== id) {
    confirm.id = id;
    renderRoster();
    clearTimeout(confirm.timer);
    confirm.timer = setTimeout(() => {
      confirm.id = null;
      renderRoster();
    }, 3000);
    return;
  }
  confirm.id = null;
  await storage.remove(id);
  await refreshRoster();
  if (state.current?.id === id) state.savedSnapshot = null;
  renderRoster();
  renderSaveButton();
  toast("Deleted");
}

export function setSetting<K extends keyof Settings>(key: K, value: Settings[K]): void {
  if (state.settings[key] === value) return;
  state.settings[key] = value;
  saveSettings();
  renderGroups();
  sfx.enabled = state.settings.sound === "on";
  switch (key) {
    case "reveal":
      return;
    case "sound":
      if (value === "on") sfx.land();
      return;
    case "orient":
      // Switching between real-world and even odds rerolls only the love life.
      if (value !== "off" && state.current && state.current.options?.orientation !== value) {
        setCurrent(rerollSection(state.current, "love", { avoidRepeats: true, orientation: orientMode() }));
      } else renderSheet();
      return;
    case "genre":
      setCurrent(rollCharacter({ genre: state.settings.genre, avoidRepeats: true, orientation: orientMode() }), true);
      scrollToTop();
      toast(`New ${GENRES[state.settings.genre].label.toLowerCase()} character`);
      return;
    case "format":
      fillExport();
      return;
    default:
      renderSheet();
  }
}

export function setLevel(raw: string): number {
  const v = Math.max(1, Math.min(20, parseInt(raw, 10) || 1));
  state.settings.level = v;
  saveSettings();
  renderSheet();
  return v;
}
