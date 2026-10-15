// The export dialog: Markdown or JSON, copy or download.

import { toJSON, toMarkdown } from "../engine/index.ts";
import { $, inFrame, toast } from "./dom.ts";
import { renderGroups } from "./controls.ts";
import { state } from "./state.ts";

export function exportText(): string {
  const c = state.current;
  if (!c) return "";
  const { mode, system, level, format, orient, ethics } = state.settings;
  return format === "json" ? toJSON(c) : toMarkdown(c, { mode, system, level, showLove: orient !== "off", ethics });
}

export function fillExport(): void {
  $<HTMLTextAreaElement>("#export-text").value = exportText();
}

export function openExport(): void {
  renderGroups();
  fillExport();
  // Downloads are blocked when the app is embedded in another page.
  $("#btn-download").hidden = inFrame;
  const d = $<HTMLDialogElement>("#export-dialog");
  if (typeof d.showModal === "function") d.showModal();
  else d.setAttribute("open", "");
}

export async function copyExport(): Promise<void> {
  const ta = $<HTMLTextAreaElement>("#export-text");
  try {
    await navigator.clipboard.writeText(ta.value);
    toast("Copied");
  } catch {
    ta.focus();
    ta.select();
    toast("Text selected. Press Ctrl+C or ⌘C to copy");
  }
}

export function downloadExport(): void {
  const c = state.current;
  if (!c) return;
  const json = state.settings.format === "json";
  const blob = new Blob([exportText()], { type: json ? "application/json" : "text/markdown" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${c.core.identity.name.replace(/[^\w-]+/g, "-").toLowerCase()}.${json ? "json" : "md"}`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
