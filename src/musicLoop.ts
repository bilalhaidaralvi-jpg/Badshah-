// Catchy viral cartoon toddler background music: "Dubi Dubi Dam Dam" (Chipi Chipi Chapa Chapa)
// Synthesized with Web Audio API: 100% reliable, zero latency, seamless infinite loop & smooth ducking!

let audioCtx: AudioContext | null = null;
let isPlaying = false;
let isMuted = false;
let masterMusicGain: GainNode | null = null;
let duckGain: GainNode | null = null;
let intervalId: number | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Frequencies for the "Dubi Dubi Dam Dam" melody
const C4 = 261.63;
const D4 = 293.66;
const E4 = 329.63;
const F4 = 349.23;
const G4 = 392.0;
const A4 = 440.0;
const B4 = 493.88;
const C5 = 523.25;
const D5 = 587.33;
const E5 = 659.25;
const F5 = 698.46;
const G5 = 783.99;
const A5 = 880.0;

// Upbeat "Chipi chipi chapa chapa dubi dubi daba daba" melody structure
// 16 steps per cycle, 135 BPM -> ~111ms per sixteenth note
const MELODY_SEQUENCE = [
  // Measure 1: Chi-pi Chi-pi, Cha-pa Cha-pa (C5 C5 C5 C5, D5 D5 D5 D5)
  { note: C5, dur: 0.09, time: 0 },
  { note: C5, dur: 0.09, time: 0.11 },
  { note: C5, dur: 0.09, time: 0.22 },
  { note: C5, dur: 0.09, time: 0.33 },
  { note: D5, dur: 0.09, time: 0.44 },
  { note: D5, dur: 0.09, time: 0.55 },
  { note: D5, dur: 0.09, time: 0.66 },
  { note: D5, dur: 0.09, time: 0.77 },

  // Measure 2: Du-bi Du-bi, Da-ba Da-ba (E5 E5 E5 E5, F5 F5 F5 F5)
  { note: E5, dur: 0.09, time: 0.88 },
  { note: E5, dur: 0.09, time: 0.99 },
  { note: E5, dur: 0.09, time: 1.10 },
  { note: E5, dur: 0.09, time: 1.21 },
  { note: F5, dur: 0.09, time: 1.32 },
  { note: F5, dur: 0.09, time: 1.43 },
  { note: F5, dur: 0.09, time: 1.54 },
  { note: F5, dur: 0.09, time: 1.65 },

  // Measure 3: Má-gi-co mi Du-bi Du-bi (G5 G5 F5 E5, D5 D5 C5 D5)
  { note: G5, dur: 0.12, time: 1.76 },
  { note: G5, dur: 0.09, time: 1.90 },
  { note: F5, dur: 0.09, time: 2.02 },
  { note: E5, dur: 0.12, time: 2.14 },
  { note: D5, dur: 0.09, time: 2.28 },
  { note: D5, dur: 0.09, time: 2.40 },
  { note: C5, dur: 0.09, time: 2.52 },
  { note: D5, dur: 0.12, time: 2.64 },

  // Measure 4: Boom Boom Boom Boom! (Dam Dam Dam Dam!)
  { note: E5, dur: 0.12, time: 2.78 },
  { note: E5, dur: 0.12, time: 2.95 },
  { note: E5, dur: 0.12, time: 3.12 },
  { note: C5, dur: 0.22, time: 3.29 },
];

const BASS_SEQUENCE = [
  // Measure 1
  { note: C4, dur: 0.15, time: 0 },
  { note: G4, dur: 0.12, time: 0.22 },
  { note: C4, dur: 0.15, time: 0.44 },
  { note: G4, dur: 0.12, time: 0.66 },

  // Measure 2
  { note: A4, dur: 0.15, time: 0.88 },
  { note: E4, dur: 0.12, time: 1.10 },
  { note: F4, dur: 0.15, time: 1.32 },
  { note: C4, dur: 0.12, time: 1.54 },

  // Measure 3
  { note: G4, dur: 0.15, time: 1.76 },
  { note: D4, dur: 0.12, time: 1.98 },
  { note: G4, dur: 0.15, time: 2.20 },
  { note: D4, dur: 0.12, time: 2.42 },

  // Measure 4 (Dam Dam Dam Dam)
  { note: C4, dur: 0.14, time: 2.64 },
  { note: C4, dur: 0.14, time: 2.85 },
  { note: C4, dur: 0.14, time: 3.06 },
  { note: C4, dur: 0.25, time: 3.27 },
];

const CYCLE_DURATION = 3.55; // seconds per loop

function scheduleLoop(startTime: number) {
  if (!audioCtx || !duckGain) return;

  // 1. Play cute toy marimba / music-box lead
  MELODY_SEQUENCE.forEach(({ note, dur, time }) => {
    if (!audioCtx || !duckGain) return;
    const noteStart = startTime + time;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'triangle'; // Sweet cartoon flute / marimba sound
    osc.frequency.setValueAtTime(note, noteStart);

    gain.gain.setValueAtTime(0, noteStart);
    gain.gain.linearRampToValueAtTime(0.24, noteStart + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, noteStart + dur + 0.08);

    osc.connect(gain);
    gain.connect(duckGain);

    osc.start(noteStart);
    osc.stop(noteStart + dur + 0.1);
  });

  // 2. Play bouncy cartoon bass
  BASS_SEQUENCE.forEach(({ note, dur, time }) => {
    if (!audioCtx || !duckGain) return;
    const noteStart = startTime + time;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine'; // Soft rounded cartoon bounce
    osc.frequency.setValueAtTime(note / 2, noteStart);

    gain.gain.setValueAtTime(0, noteStart);
    gain.gain.linearRampToValueAtTime(0.28, noteStart + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, noteStart + dur);

    osc.connect(gain);
    gain.connect(duckGain);

    osc.start(noteStart);
    osc.stop(noteStart + dur + 0.05);
  });

  // 3. Play cartoon pop drum beats (Dam Dam Dum Dum)
  for (let i = 0; i < 8; i++) {
    const beatTime = startTime + i * (CYCLE_DURATION / 8);
    // Soft kick/bubble pop
    const kickOsc = audioCtx.createOscillator();
    const kickGain = audioCtx.createGain();
    kickOsc.type = 'sine';
    kickOsc.frequency.setValueAtTime(160, beatTime);
    kickOsc.frequency.exponentialRampToValueAtTime(45, beatTime + 0.08);

    kickGain.gain.setValueAtTime(0.22, beatTime);
    kickGain.gain.exponentialRampToValueAtTime(0.001, beatTime + 0.09);

    kickOsc.connect(kickGain);
    kickGain.connect(duckGain);

    kickOsc.start(beatTime);
    kickOsc.stop(beatTime + 0.1);
  }
}

export function startMusic() {
  if (isPlaying) return;

  const ctx = getAudioContext();
  if (!masterMusicGain) {
    masterMusicGain = ctx.createGain();
    masterMusicGain.gain.setValueAtTime(isMuted ? 0 : 0.35, ctx.currentTime);
    masterMusicGain.connect(ctx.destination);
  }

  if (!duckGain) {
    duckGain = ctx.createGain();
    duckGain.gain.setValueAtTime(1.0, ctx.currentTime);
    duckGain.connect(masterMusicGain);
  }

  isPlaying = true;

  let nextStartTime = ctx.currentTime + 0.05;
  scheduleLoop(nextStartTime);

  // Loop periodically
  intervalId = window.setInterval(() => {
    if (!isPlaying) return;
    const now = ctx.currentTime;
    if (now + 0.5 >= nextStartTime + CYCLE_DURATION) {
      nextStartTime += CYCLE_DURATION;
      scheduleLoop(nextStartTime);
    }
  }, 400);
}

export function stopMusic() {
  isPlaying = false;
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

export function toggleMusic(): boolean {
  isMuted = !isMuted;
  if (masterMusicGain && audioCtx) {
    const targetGain = isMuted ? 0 : 0.35;
    masterMusicGain.gain.linearRampToValueAtTime(targetGain, audioCtx.currentTime + 0.15);
  }
  if (!isPlaying && !isMuted) {
    startMusic();
  }
  return !isMuted;
}

export function isMusicPlaying(): boolean {
  return isPlaying && !isMuted;
}

// 🦆 AUDIO DUCKING: When voice speaks, smoothly lower music volume to 10%
export function duckMusic() {
  if (duckGain && audioCtx) {
    const now = audioCtx.currentTime;
    duckGain.gain.cancelScheduledValues(now);
    duckGain.gain.setValueAtTime(duckGain.gain.value, now);
    duckGain.gain.linearRampToValueAtTime(0.12, now + 0.15); // Drop to 12% so voice is crystal clear!
  }
}

// 🔊 RESTORE MUSIC: When voice finishes, smoothly bring music back up to 100%
export function restoreMusic() {
  if (duckGain && audioCtx) {
    const now = audioCtx.currentTime;
    duckGain.gain.cancelScheduledValues(now);
    duckGain.gain.setValueAtTime(duckGain.gain.value, now);
    duckGain.gain.linearRampToValueAtTime(1.0, now + 0.4); // Smooth return to cheerful volume
  }
}
