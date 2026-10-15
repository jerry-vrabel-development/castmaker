// A thin wrapper around SoundEngine that creates the audio context on first
// use (browsers only allow sound after a click or key press) and stays silent
// if audio is unavailable or turned off.

import { SoundEngine } from "./audio.ts";

type Cue = "tick" | "land" | "flip" | "rattle" | "ui" | "dieLand" | "anticipation" | "stamp";

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

class Sfx {
  enabled = true;
  private engine: SoundEngine | null = null;

  private ensure(): SoundEngine | null {
    if (!this.enabled) return null;
    if (!this.engine) {
      try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        this.engine = Ctx ? new SoundEngine(new Ctx()) : null;
      } catch {
        this.engine = null;
      }
    }
    const ctx = this.engine?.ctx;
    if (ctx instanceof AudioContext && ctx.state === "suspended") ctx.resume().catch(() => {});
    return this.engine;
  }

  /** Play a cue. Returns a duration in seconds for cues that have one, otherwise 0. */
  private play(cue: Cue, arg?: number): number {
    const e = this.ensure();
    if (!e) return 0;
    try {
      const out = (e[cue] as (a?: number) => number | void).call(e, arg);
      return typeof out === "number" ? out : 0;
    } catch {
      return 0;
    }
  }

  tick() {
    this.play("tick");
  }
  land() {
    this.play("land");
  }
  flip() {
    this.play("flip");
  }
  rattle() {
    this.play("rattle");
  }
  ui() {
    this.play("ui");
  }
  dieLand(value: number) {
    this.play("dieLand", value);
  }
  anticipation(tier: number): number {
    return this.play("anticipation", tier);
  }
  stamp(tier: number) {
    this.play("stamp", tier);
  }
}

export const sfx = new Sfx();
