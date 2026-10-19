/**
 * Web Audio API synthesizer for Suika Game sound effects.
 * Synthesizes cheerful chimes, pops, and fanfares without external audio file dependencies.
 */

class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;

  constructor() {
    // AudioContext will be initialized on first user interaction
    const saved = localStorage.getItem('suika_sound_muted');
    if (saved !== null) {
      this.muted = saved === 'true';
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public toggleMute(): boolean {
    this.muted = !this.muted;
    localStorage.setItem('suika_sound_muted', String(this.muted));
    return this.muted;
  }

  public playDropSound() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(380, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch {
      // AudioContext playback error fallback
    }
  }

  public playMergeSound(tier: number) {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      // Musical pentatonic / chromatic scale that ascends joyfully with each fruit tier
      const notes = [
        261.63, // 0: Cherry (C4)
        293.66, // 1: Strawberry (D4)
        329.63, // 2: Grape (E4)
        392.00, // 3: Tangerine (G4)
        440.00, // 4: Persimmon (A4)
        523.25, // 5: Apple (C5)
        587.33, // 6: Pear (D5)
        659.25, // 7: Peach (E5)
        783.99, // 8: Pineapple (G5)
        880.00, // 9: Melon (A5)
        1046.50, // 10: Watermelon (C6)
      ];

      const baseFreq = notes[Math.min(tier, notes.length - 1)];

      // Primary tone
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();

      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(baseFreq * 1.25, ctx.currentTime + 0.08);

      gain1.gain.setValueAtTime(0.24, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);

      osc1.start();
      osc1.stop(ctx.currentTime + 0.28);

      // Sweet harmonic overtone
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(baseFreq * 2, ctx.currentTime + 0.04);

      gain2.gain.setValueAtTime(0.12, ctx.currentTime + 0.04);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.32);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc2.start(ctx.currentTime + 0.04);
      osc2.stop(ctx.currentTime + 0.32);

      // If Watermelon achieved (tier 10), trigger grand fanfare!
      if (tier >= 10) {
        this.playWatermelonFanfare();
      }
    } catch {
      // AudioContext playback error fallback
    }
  }

  public playWatermelonFanfare() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const chords = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C E G C E
      chords.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

        const startTime = ctx.currentTime + idx * 0.08;
        gain.gain.setValueAtTime(0.2, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.6);
      });
    } catch {
      // Audio error fallback
    }
  }

  public playComboSound(combo: number) {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const freq = 440 + Math.min(combo * 110, 880);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch {
      // Audio error fallback
    }
  }

  public playBounceSound(velocity = 1) {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(110, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(55, ctx.currentTime + 0.06);

      const vol = Math.min(Math.max(velocity * 0.04, 0.03), 0.12);
      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } catch {
      // Audio error fallback
    }
  }

  public playJiggleSound() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(90, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(150, ctx.currentTime + 0.1);
      osc.frequency.linearRampToValueAtTime(70, ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch {
      // Audio error fallback
    }
  }

  public playWarningBeep() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(750, ctx.currentTime);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch {
      // Audio error fallback
    }
  }

  public playGameOverSound() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const tones = [440, 415.3, 392, 349.2];
      tones.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.18);

        const startTime = ctx.currentTime + idx * 0.18;
        gain.gain.setValueAtTime(0.18, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.35);
      });
    } catch {
      // Audio error fallback
    }
  }
}

export const soundFx = new SoundSynthesizer();
