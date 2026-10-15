// The saved cast list in the sidebar.

import { GENRES, TIERS, cap, computeRarity, stripArticle } from "../engine/index.ts";
import { $, esc } from "./dom.ts";
import { isSaved, state } from "./state.ts";

/** Id of the character whose delete button is waiting for a second click. */
export const confirm: { id: string | null; timer?: ReturnType<typeof setTimeout> } = { id: null };

export function renderRoster(): void {
  const list = $("#roster");
  $("#cast-count").textContent = String(state.roster.length);
  if (!state.roster.length) {
    list.innerHTML =
      '<li><p class="roster-empty">Saved characters appear here. Roll one you like and choose Save to cast.</p></li>';
    return;
  }
  list.innerHTML = state.roster
    .map((c) => {
      const id = c.core.identity;
      const tier = computeRarity(c).tier;
      const current = c.id === state.current?.id;
      const confirming = confirm.id === c.id;
      return `<li class="${current ? "is-current" : ""}">
      <button type="button" class="open" data-action="open" data-id="${esc(c.id)}">
        <span class="r-name"><span class="dot t${tier}" title="${esc(TIERS[tier]?.label)}"></span>${esc(id.name)}</span>
        <span class="r-meta">${esc(cap(stripArticle(id.occupation.t)))} · ${esc(GENRES[c.genre].label)}</span>
      </button>
      <button type="button" class="del ${confirming ? "is-confirming" : ""}" data-action="delete" data-id="${esc(c.id)}" aria-label="Delete ${esc(id.name)}">${confirming ? "Delete?" : "✕"}</button>
    </li>`;
    })
    .join("");
}

export function renderSaveButton(): void {
  const b = $("#btn-save");
  const saved = isSaved();
  b.textContent = saved
    ? "Saved"
    : state.roster.some((r) => r.id === state.current?.id)
      ? "Save changes"
      : "Save to cast";
  b.classList.toggle("is-saved", saved);
}
