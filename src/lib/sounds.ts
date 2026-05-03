/**
 * @file sounds.ts
 * @description Audio feedback utilities for the EVM Simulator using Web Audio API.
 * All functions fail silently if AudioContext is unavailable (SSR/unsupported browsers).
 */

let audioCtx: AudioContext | null = null;

/**
 * Returns a singleton AudioContext, lazily initializing it on first use.
 * @returns The shared AudioContext instance.
 */
function getAudioContext(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
}

/**
 * Plays a short beep tone — used for EVM button press feedback.
 * @param frequency - Tone frequency in Hz (default: 800).
 * @param duration - Tone duration in seconds (default: 0.15).
 */
export function playBeep(frequency = 800, duration = 0.15): void {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = frequency;
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch (error: unknown) {
    // AudioContext may not be available in SSR or unsupported browsers
    if (error instanceof Error) {
      console.warn('[sounds] playBeep failed:', error.message);
    }
  }
}

/**
 * Plays a rising three-note success chime — used after a successful vote cast.
 */
export function playSuccess(): void {
  try {
    const ctx = getAudioContext();
    const notes = [523, 659, 784];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = 'sine';
      const start = ctx.currentTime + i * 0.12;
      gain.gain.setValueAtTime(0.2, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.3);
      osc.start(start);
      osc.stop(start + 0.3);
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.warn('[sounds] playSuccess failed:', error.message);
    }
  }
}

/**
 * Plays a rapid click-burst — simulates the VVPAT paper slip print sound.
 */
export function playPrint(): void {
  try {
    const ctx = getAudioContext();
    for (let i = 0; i < 5; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 200 + Math.random() * 100;
      osc.type = 'square';
      const start = ctx.currentTime + i * 0.06;
      gain.gain.setValueAtTime(0.05, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.05);
      osc.start(start);
      osc.stop(start + 0.05);
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.warn('[sounds] playPrint failed:', error.message);
    }
  }
}
