// Reveal sound design. Everything is synthesized with the Web Audio API, so
// there are no audio files to download or license.
//
// Signal path: voices -> dry bus + reverb send -> compressor -> speakers.
// Cues: reel ticks and a wooden "thunk" for the name reel, rattles and clacks
// for the dice, a riser that builds with the dice total, then a sting for the
// grade, growing from a muted thud (Common) to a full fanfare (Legendary).

export class SoundEngine {
  readonly ctx: BaseAudioContext;
  private master: GainNode;
  private dry: GainNode;
  private reverb: ConvolverNode;
  private wet: GainNode;
  private noise: AudioBuffer;

  constructor(ctx: BaseAudioContext) {
    this.ctx = ctx;
    this.master = ctx.createGain();
    this.master.gain.value = 0.85;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -16;
    comp.knee.value = 8;
    comp.ratio.value = 4;
    comp.attack.value = 0.004;
    comp.release.value = 0.2;
    this.master.connect(comp).connect(ctx.destination);

    this.dry = ctx.createGain();
    this.dry.connect(this.master);
    this.reverb = ctx.createConvolver();
    this.reverb.buffer = this.impulse(2.4, 2.8);
    this.wet = ctx.createGain();
    this.wet.gain.value = 0.28;
    this.reverb.connect(this.wet).connect(this.master);

    this.noise = this.noiseBuffer(1.5);
  }

  get now(): number {
    return this.ctx.currentTime;
  }

  noiseBuffer(seconds: number): AudioBuffer {
    const { ctx } = this;
    const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * seconds), ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return buf;
  }

  // A stereo decaying-noise impulse makes a soft hall reverb.
  impulse(seconds: number, decay: number): AudioBuffer {
    const { ctx } = this;
    const len = Math.floor(ctx.sampleRate * seconds);
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
    return buf;
  }

  // Route a node to the dry bus and, optionally, the reverb.
  out(node: AudioNode, send = 0): void {
    node.connect(this.dry);
    if (send > 0) {
      const s = this.ctx.createGain();
      s.gain.value = send;
      node.connect(s).connect(this.reverb);
    }
  }

  env(t: number, peak: number, attack: number, decay: number, hold = 0): GainNode {
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(Math.max(peak, 0.0002), t + attack);
    if (hold) g.gain.setValueAtTime(Math.max(peak, 0.0002), t + attack + hold);
    g.gain.exponentialRampToValueAtTime(0.0001, t + attack + hold + decay);
    return g;
  }

  noiseSource(t: number, dur: number): AudioBufferSourceNode {
    const src = this.ctx.createBufferSource();
    src.buffer = this.noise;
    src.start(t, Math.random() * 0.5);
    src.stop(t + dur + 0.05);
    return src;
  }

  // ---------- voices ----------

  // Short filtered-noise click: reel ticks, dice rattle.
  click(t: number, freq = 2500, vol = 0.12, dur = 0.03, q = 6): void {
    const f = this.ctx.createBiquadFilter();
    f.type = "bandpass";
    f.frequency.value = freq;
    f.Q.value = q;
    const g = this.env(t, vol, 0.001, dur);
    this.noiseSource(t, dur).connect(f).connect(g);
    this.out(g, 0.05);
  }

  // Pitched sine that drops: thumps and booms.
  thump(t: number, from = 160, to = 50, vol = 0.5, dur = 0.25): void {
    const o = this.ctx.createOscillator();
    o.type = "sine";
    o.frequency.setValueAtTime(from, t);
    o.frequency.exponentialRampToValueAtTime(to, t + dur);
    const g = this.env(t, vol, 0.004, dur);
    o.connect(g);
    this.out(g, 0.1);
    o.start(t);
    o.stop(t + dur + 0.05);
  }

  // FM bell: bright attack, long ring, sent to the reverb.
  bell(t: number, freq: number, vol = 0.12, dur = 1.4, ratio = 3.5, send = 0.5): void {
    const { ctx } = this;
    const car = ctx.createOscillator();
    const mod = ctx.createOscillator();
    const modGain = ctx.createGain();
    car.frequency.value = freq;
    mod.frequency.value = freq * ratio;
    modGain.gain.setValueAtTime(freq * 2.2, t);
    modGain.gain.exponentialRampToValueAtTime(freq * 0.05, t + dur * 0.7);
    mod.connect(modGain).connect(car.frequency);
    const g = this.env(t, vol, 0.003, dur);
    car.connect(g);
    this.out(g, send);
    car.start(t);
    mod.start(t);
    car.stop(t + dur + 0.1);
    mod.stop(t + dur + 0.1);
  }

  // Plucked string: triangle through a closing low-pass.
  pluck(t: number, freq: number, vol = 0.18, dur = 0.5): void {
    const { ctx } = this;
    const o = ctx.createOscillator();
    o.type = "triangle";
    o.frequency.value = freq;
    const f = ctx.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.setValueAtTime(freq * 6, t);
    f.frequency.exponentialRampToValueAtTime(freq * 1.2, t + dur);
    const g = this.env(t, vol, 0.003, dur);
    o.connect(f).connect(g);
    this.out(g, 0.25);
    o.start(t);
    o.stop(t + dur + 0.05);
  }

  // Brass or choir pad: detuned saws through an opening filter.
  pad(t: number, freqs: number[], dur = 1.6, vol = 0.07, bright = 2400, attack = 0.08): void {
    const { ctx } = this;
    const f = ctx.createBiquadFilter();
    f.type = "lowpass";
    f.Q.value = 0.8;
    f.frequency.setValueAtTime(300, t);
    f.frequency.exponentialRampToValueAtTime(bright, t + attack + 0.25);
    f.frequency.exponentialRampToValueAtTime(500, t + dur);
    const g = this.env(t, vol, attack, dur - attack, 0.1);
    f.connect(g);
    this.out(g, 0.55);
    for (const fr of freqs) {
      for (const det of [-9, 0, 8]) {
        const o = ctx.createOscillator();
        o.type = "sawtooth";
        o.frequency.value = fr;
        o.detune.value = det;
        o.connect(f);
        o.start(t);
        o.stop(t + dur + 0.2);
      }
    }
  }

  // Filtered-noise sweep: rising tension or a cymbal-like swell.
  riser(t: number, dur: number, vol = 0.12, from = 400, to = 6000): void {
    const { ctx } = this;
    const f = ctx.createBiquadFilter();
    f.type = "bandpass";
    f.Q.value = 2.5;
    f.frequency.setValueAtTime(from, t);
    f.frequency.exponentialRampToValueAtTime(to, t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + dur * 0.95);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.06);
    this.noiseSource(t, dur + 0.1)
      .connect(f)
      .connect(g);
    this.out(g, 0.3);
  }

  // Crash: bright noise burst with a long tail.
  crash(t: number, vol = 0.18, dur = 1.6): void {
    const f = this.ctx.createBiquadFilter();
    f.type = "highpass";
    f.frequency.value = 3000;
    const g = this.env(t, vol, 0.002, dur);
    this.noiseSource(t, dur).connect(f).connect(g);
    this.out(g, 0.5);
  }

  // ---------- cues ----------

  tick(): void {
    this.click(this.now, 2200 + Math.random() * 600, 0.7, 0.025, 5);
    this.thump(this.now, 900, 600, 0.04, 0.02);
  }

  // The name reel stops: a wooden thunk and a soft chime.
  land(): void {
    const t = this.now;
    this.thump(t, 220, 90, 0.35, 0.12);
    this.click(t, 900, 0.5, 0.05, 3);
    this.bell(t + 0.02, 1046.5, 0.05, 0.6);
  }

  // Dice tumbling: a cluster of random clicks.
  rattle(): void {
    const t = this.now;
    for (let i = 0; i < 3; i++)
      this.click(t + Math.random() * 0.03, 1400 + Math.random() * 2400, 0.35 + Math.random() * 0.25, 0.02, 4);
  }

  // One die lands. Higher values sound brighter; 17s and 18s ring.
  dieLand(value: number): void {
    const t = this.now;
    const k = (value - 3) / 15;
    this.click(t, 1200 + k * 2000, 0.6, 0.05, 3);
    this.thump(t, 140 + k * 80, 70, 0.22, 0.09);
    this.pluck(t + 0.005, 220 * Math.pow(2, (value - 3) / 12), 0.1 + k * 0.06, 0.25);
    if (value >= 17) this.bell(t + 0.02, 1568, 0.06, 0.8);
  }

  // Tension before the grade. Longer and brighter when the dice ran hot.
  anticipation(tier: number): number {
    const t = this.now;
    const dur = [0.25, 0.4, 0.6, 0.85, 1.15][tier] ?? 0.5;
    this.riser(t, dur, 0.05 + tier * 0.025, 300, 2500 + tier * 1500);
    if (tier >= 2) {
      // a soft drumroll under the riser
      const n = Math.floor(dur / 0.045);
      for (let i = 0; i < n; i++) this.click(t + i * 0.045, 180 + Math.random() * 60, 0.15 + 0.35 * (i / n), 0.05, 2);
    }
    return dur;
  }

  // The grade lands.
  stamp(tier: number): void {
    const t = this.now;
    const C = 261.63;
    const st = (n: number) => C * Math.pow(2, n / 12);
    switch (tier) {
      case 0: // Common: understated
        this.thump(t, 180, 80, 0.3, 0.18);
        this.pluck(t, st(0), 0.14, 0.45);
        break;
      case 1: // Uncommon: a two-note chime
        this.thump(t, 200, 80, 0.28, 0.16);
        this.bell(t, st(19), 0.08, 1.1);
        this.bell(t + 0.12, st(24), 0.08, 1.4);
        break;
      case 2: // Rare: a bright arpeggio over a soft pad
        this.thump(t, 220, 70, 0.35, 0.2);
        [12, 16, 19, 24].forEach((n, i) => this.bell(t + i * 0.08, st(n), 0.075, 1.4));
        this.pad(t + 0.05, [st(0), st(7), st(16)], 1.6, 0.035, 1800, 0.15);
        break;
      case 3: // Epic: impact, brass chord, rising bells
        this.thump(t, 120, 40, 0.6, 0.5);
        this.crash(t, 0.08, 1.2);
        this.pad(t, [st(-12), st(-5), st(4), st(7)], 2.2, 0.06, 3200, 0.05);
        [12, 16, 19, 24, 28].forEach((n, i) => this.bell(t + 0.15 + i * 0.07, st(n), 0.07, 1.6));
        break;
      default: // Legendary: the full fanfare
        this.thump(t, 110, 32, 0.8, 0.8);
        this.crash(t, 0.14, 2.4);
        this.pad(t, [st(-12), st(-5), st(0), st(4), st(7), st(12)], 3.2, 0.06, 4200, 0.04);
        this.pad(t + 0.6, [st(-10), st(-3), st(2), st(5), st(9), st(14)], 2.6, 0.05, 4800, 0.12);
        [12, 16, 19, 24, 28, 31, 36].forEach((n, i) => this.bell(t + 0.2 + i * 0.06, st(n), 0.06, 2));
        [24, 28, 31, 36, 40, 43, 48, 43, 48].forEach((n, i) =>
          this.bell(t + 0.75 + i * 0.05, st(n), 0.035, 1.2, 2.01, 0.7),
        );
        this.bell(t + 1.35, st(36), 0.08, 3.2, 3.5, 0.8);
        break;
    }
  }

  // A section turning over: a soft paper flick.
  flip(): void {
    const t = this.now;
    const f = this.ctx.createBiquadFilter();
    f.type = "highpass";
    f.frequency.value = 2500;
    const g = this.env(t, 0.08, 0.01, 0.07);
    this.noiseSource(t, 0.1).connect(f).connect(g);
    this.out(g, 0.05);
  }

  // Settings changes and locks.
  ui(): void {
    this.click(this.now, 3000, 0.5, 0.02, 5);
  }
}
