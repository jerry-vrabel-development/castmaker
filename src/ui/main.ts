// Castmaker: entry point. Wires up events and loads the last character.

import "./styles.css";
import { registerSW } from "virtual:pwa-register";
import { GENRES, rollCharacter, upgradeCharacter, type Character, type SectionKey } from "../engine/index.ts";
import { $, inFrame } from "./dom.ts";
import { GROUPS, isGroupKey, renderGroups } from "./controls.ts";
import { copyExport, downloadExport, openExport } from "./exportDialog.ts";
import { deleteSaved, lock, openSaved, reroll, roll, save, setCurrent, setLevel, setSetting } from "./actions.ts";
import { isRevealing, skipReveal } from "./reveal.ts";
import { sfx } from "./sound.ts";
import { storage } from "./storage.ts";
import { CURRENT_KEY, readLocal, snapshotOf, state, type Settings } from "./state.ts";

document.addEventListener("click", (e) => {
  const target = e.target as Element | null;
  if (!target) return;
  // A click on the sheet mid-reveal skips to the result; a button click also does its job.
  if (isRevealing() && target.closest("#sheet")) {
    skipReveal();
    if (!target.closest("[data-action]")) return;
  }
  const seg = target.closest<HTMLElement>("[data-group]");
  if (seg) {
    const key = seg.dataset.group ?? "";
    const value = seg.dataset.value ?? "";
    if (isGroupKey(key) && GROUPS[key].options.some(([v]) => v === value)) {
      setSetting(key, value as Settings[typeof key]);
    }
    return;
  }
  const btn = target.closest<HTMLElement>("[data-action]");
  if (!btn) return;
  const { action, section, id } = btn.dataset;
  switch (action) {
    case "roll":
      roll();
      break;
    case "reroll":
      if (section) reroll(section as SectionKey);
      break;
    case "lock":
      if (section) lock(section as SectionKey);
      break;
    case "save":
      void save();
      break;
    case "export":
      openExport();
      break;
    case "copy":
      void copyExport();
      break;
    case "download":
      downloadExport();
      break;
    case "open":
      if (id) openSaved(id);
      break;
    case "delete":
      if (id) void deleteSaved(id);
      break;
  }
});

$<HTMLInputElement>("#level").addEventListener("change", (e) => {
  const input = e.target as HTMLInputElement;
  input.value = String(setLevel(input.value));
});

// R rolls, unless typing or a dialog is open.
document.addEventListener("keydown", (e) => {
  if (e.key !== "r" && e.key !== "R") return;
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  if ((e.target as Element | null)?.closest("input, textarea, dialog[open]")) return;
  e.preventDefault();
  roll();
});

async function start(): Promise<void> {
  sfx.enabled = state.settings.sound === "on";
  renderGroups();
  const persistent = await storage.init();
  $("#storage-note").hidden = persistent;
  state.roster = (await storage.list()).map(upgradeCharacter);
  const stored = readLocal<Character | null>(CURRENT_KEY, null);
  const last = stored && stored.core && GENRES[stored.genre] ? upgradeCharacter(stored) : null;
  if (last) {
    state.settings.genre = last.genre;
    renderGroups();
    const savedCopy = state.roster.find((r) => r.id === last.id);
    if (savedCopy) state.savedSnapshot = snapshotOf(savedCopy);
    setCurrent(last);
  } else {
    setCurrent(rollCharacter({ genre: state.settings.genre }));
  }

  // Offline support. Skipped when embedded in another page, where service
  // workers aren't allowed.
  if (!inFrame) registerSW({ immediate: true });
}

void start();
