// Audio playback and synthesis for toddler sensory play
import { duckMusic, restoreMusic } from './musicLoop';

let audioCtx: AudioContext | null = null;
let currentHtmlAudio: HTMLAudioElement | null = null;
let duckTimeoutId: number | null = null;

// Ensure audio context is ready on user gesture
export function initAudio() {
  try {
    if (!audioCtx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    if ('speechSynthesis' in window && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  } catch (e) {
    console.warn('initAudio error:', e);
  }
}

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

// Play a cheerful, bright toddler xylophone chime chord
export function playPopChime(animalIndex: number = 0) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const basePitches = [
      [523.25, 659.25, 783.99, 1046.50], // Kitty
      [587.33, 739.99, 880.00, 1174.66], // Bunny
      [440.00, 554.37, 659.25, 880.00],  // Bear
      [659.25, 830.61, 987.77, 1318.51], // Duck
      [523.25, 659.25, 783.99, 1046.50, 1318.51], // Mahdiya
    ];

    const notes = basePitches[animalIndex % basePitches.length];

    // Pop bubble burst
    const popOsc = ctx.createOscillator();
    const popGain = ctx.createGain();
    popOsc.type = 'sine';
    popOsc.frequency.setValueAtTime(320, now);
    popOsc.frequency.exponentialRampToValueAtTime(850, now + 0.06);
    popGain.gain.setValueAtTime(0.35, now);
    popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    popOsc.connect(popGain);
    popGain.connect(ctx.destination);
    popOsc.start(now);
    popOsc.stop(now + 0.12);

    // Arpeggiated twinkles
    notes.forEach((freq, i) => {
      const noteTime = now + 0.03 + i * 0.04;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0, noteTime);
      gain.gain.linearRampToValueAtTime(0.2, noteTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.45);
    });
  } catch (e) {
    console.warn('Audio playback error', e);
  }
}

// Play gentle sensory background chime when tapping the sky
export function playSkyTwinkle() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const randomFreqs = [784, 880, 988, 1046, 1175, 1318];
    const freq = randomFreqs[Math.floor(Math.random() * randomFreqs.length)];

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.4);
  } catch (e) {
    console.warn('Audio error', e);
  }
}

export interface VoicePhrase {
  urduScript: string;
  romanText: string;
  audioFile?: string;
  spokenTextUrdu: string;
  spokenTextRoman: string;
}

export const MAHDIYA_PHRASES: Record<string, VoicePhrase[]> = {
  kitty: [
    {
      urduScript: 'مہدیہ! کیسی ہو؟ میاؤں!',
      romanText: 'Mahdiya! Kaisi ho? Meow!',
      audioFile: '/audio/kitty_1.wav',
      spokenTextUrdu: 'مہدیہ! کیسی ہو؟ میاؤں!',
      spokenTextRoman: 'Mah-dee-ya! Kaisi ho? Meow!',
    },
    {
      urduScript: 'مہدیہ! کیا کر رہی ہو؟',
      romanText: 'Mahdiya! Kya kar rahi ho?',
      audioFile: '/audio/kitty_2.wav',
      spokenTextUrdu: 'مہدیہ! کیا کر رہی ہو؟',
      spokenTextRoman: 'Mah-dee-ya! Kya kar rahi ho?',
    },
    {
      urduScript: 'مہدیہ! تمہارا بابا کدھر ہے؟',
      romanText: 'Mahdiya! Tumhara Baba kidhar hai?',
      audioFile: '/audio/kitty_3.wav',
      spokenTextUrdu: 'مہدیہ! تمہارا بابا کدھر ہے؟',
      spokenTextRoman: 'Mah-dee-ya! Tumhara Baba kidhar hai?',
    },
    {
      urduScript: 'مہدیہ! تمہاری ماما کدھر ہے؟',
      romanText: 'Mahdiya! Tumhari Mama kidhar hai?',
      audioFile: '/audio/mahdiya_mama.wav',
      spokenTextUrdu: 'مہدیہ! تمہاری ماما کدھر ہے؟',
      spokenTextRoman: 'Mah-dee-ya! Tumhari Mama kidhar hai?',
    },
    {
      urduScript: 'مہدیہ! السلام علیکم!',
      romanText: 'Mahdiya! As-salamu Alaikum!',
      audioFile: '/audio/mahdiya_salam.wav',
      spokenTextUrdu: 'مہدیہ! السلام علیکم!',
      spokenTextRoman: 'Mah-dee-ya! As-salamu Alaikum!',
    },
  ],
  bunny: [
    {
      urduScript: 'مہدیہ! تمہاری ماما کدھر ہے؟',
      romanText: 'Mahdiya! Tumhari Mama kidhar hai?',
      audioFile: '/audio/mahdiya_mama.wav',
      spokenTextUrdu: 'مہدیہ! تمہاری ماما کدھر ہے؟',
      spokenTextRoman: 'Mah-dee-ya! Tumhari Mama kidhar hai?',
    },
    {
      urduScript: 'مہدیہ! کیسی ہو، پیاری گڑیا؟',
      romanText: 'Mahdiya! Kaisi ho, pyari guriya?',
      audioFile: '/audio/mahdiya_kaisi_ho.wav',
      spokenTextUrdu: 'مہدیہ! کیسی ہو، پیاری گڑیا؟',
      spokenTextRoman: 'Mah-dee-ya! Kaisi ho, pyari guriya?',
    },
    {
      urduScript: 'مہدیہ! السلام علیکم!',
      romanText: 'Mahdiya! As-salamu Alaikum!',
      audioFile: '/audio/mahdiya_salam.wav',
      spokenTextUrdu: 'مہدیہ! السلام علیکم!',
      spokenTextRoman: 'Mah-dee-ya! As-salamu Alaikum!',
    },
    {
      urduScript: 'مہدیہ! تمہارا بابا کدھر ہے؟',
      romanText: 'Mahdiya! Tumhara Baba kidhar hai?',
      audioFile: '/audio/mahdiya_baba.wav',
      spokenTextUrdu: 'مہدیہ! تمہارا بابا کدھر ہے؟',
      spokenTextRoman: 'Mah-dee-ya! Tumhara Baba kidhar hai?',
    },
  ],
  bear: [
    {
      urduScript: 'مہدیہ! تمہارا بابا کدھر ہے؟',
      romanText: 'Mahdiya! Tumhara Baba kidhar hai?',
      audioFile: '/audio/mahdiya_baba.wav',
      spokenTextUrdu: 'مہدیہ! تمہارا بابا کدھر ہے؟',
      spokenTextRoman: 'Mah-dee-ya! Tumhara Baba kidhar hai?',
    },
    {
      urduScript: 'مہدیہ! پیاری مہدیہ، السلام علیکم!',
      romanText: 'Mahdiya! Pyari Mahdiya, As-salamu Alaikum!',
      audioFile: '/audio/mahdiya_salam.wav',
      spokenTextUrdu: 'مہدیہ! پیاری مہدیہ، السلام علیکم!',
      spokenTextRoman: 'Mah-dee-ya! Pyari Mahdiya, As-salamu Alaikum!',
    },
    {
      urduScript: 'مہدیہ! کیا کر رہی ہو؟',
      romanText: 'Mahdiya! Kya kar rahi ho?',
      audioFile: '/audio/mahdiya_kya_kar_rahi_ho.wav',
      spokenTextUrdu: 'مہدیہ! کیا کر رہی ہو؟',
      spokenTextRoman: 'Mah-dee-ya! Kya kar rahi ho?',
    },
    {
      urduScript: 'مہدیہ! تمہاری ماما کدھر ہے؟',
      romanText: 'Mahdiya! Tumhari Mama kidhar hai?',
      audioFile: '/audio/mahdiya_mama.wav',
      spokenTextUrdu: 'مہدیہ! تمہاری ماما کدھر ہے؟',
      spokenTextRoman: 'Mah-dee-ya! Tumhari Mama kidhar hai?',
    },
  ],
  duck: [
    {
      urduScript: 'مہدیہ! کیا کر رہی ہو؟',
      romanText: 'Mahdiya! Kya kar rahi ho?',
      audioFile: '/audio/mahdiya_kya_kar_rahi_ho.wav',
      spokenTextUrdu: 'مہدیہ! کیا کر رہی ہو؟',
      spokenTextRoman: 'Mah-dee-ya! Kya kar rahi ho?',
    },
    {
      urduScript: 'مہدیہ! کیسی ہو، پیاری گڑیا؟',
      romanText: 'Mahdiya! Kaisi ho, pyari guriya?',
      audioFile: '/audio/mahdiya_kaisi_ho.wav',
      spokenTextUrdu: 'مہدیہ! کیسی ہو، پیاری گڑیا؟',
      spokenTextRoman: 'Mah-dee-ya! Kaisi ho, pyari guriya?',
    },
    {
      urduScript: 'مہدیہ! تمہارا بابا کدھر ہے؟',
      romanText: 'Mahdiya! Tumhara Baba kidhar hai?',
      audioFile: '/audio/mahdiya_baba.wav',
      spokenTextUrdu: 'مہدیہ! تمہارا بابا کدھر ہے؟',
      spokenTextRoman: 'Mah-dee-ya! Tumhara Baba kidhar hai?',
    },
    {
      urduScript: 'مہدیہ! السلام علیکم!',
      romanText: 'Mahdiya! As-salamu Alaikum!',
      audioFile: '/audio/mahdiya_salam.wav',
      spokenTextUrdu: 'مہدیہ! السلام علیکم!',
      spokenTextRoman: 'Mah-dee-ya! As-salamu Alaikum!',
    },
  ],
  mahdiya: [
    {
      urduScript: 'مہدیہ! کیسی ہو، پیاری گڑیا؟',
      romanText: 'Mahdiya! Kaisi ho, pyari guriya?',
      audioFile: '/audio/mahdiya_kaisi_ho.wav',
      spokenTextUrdu: 'مہدیہ! کیسی ہو، پیاری گڑیا؟',
      spokenTextRoman: 'Mah-dee-ya! Kaisi ho, pyari guriya?',
    },
    {
      urduScript: 'مہدیہ! کیا کر رہی ہو؟',
      romanText: 'Mahdiya! Kya kar rahi ho?',
      audioFile: '/audio/mahdiya_kya_kar_rahi_ho.wav',
      spokenTextUrdu: 'مہدیہ! کیا کر رہی ہو؟',
      spokenTextRoman: 'Mah-dee-ya! Kya kar rahi ho?',
    },
    {
      urduScript: 'مہدیہ! تمہارا بابا کدھر ہے؟',
      romanText: 'Mahdiya! Tumhara Baba kidhar hai?',
      audioFile: '/audio/mahdiya_baba.wav',
      spokenTextUrdu: 'مہدیہ! تمہارا بابا کدھر ہے؟',
      spokenTextRoman: 'Mah-dee-ya! Tumhara Baba kidhar hai?',
    },
    {
      urduScript: 'مہدیہ! تمہاری ماما کدھر ہے؟',
      romanText: 'Mahdiya! Tumhari Mama kidhar hai?',
      audioFile: '/audio/mahdiya_mama.wav',
      spokenTextUrdu: 'مہدیہ! تمہاری ماما کدھر ہے؟',
      spokenTextRoman: 'Mah-dee-ya! Tumhari Mama kidhar hai?',
    },
    {
      urduScript: 'مہدیہ! السلام علیکم!',
      romanText: 'Mahdiya! As-salamu Alaikum!',
      audioFile: '/audio/mahdiya_salam.wav',
      spokenTextUrdu: 'مہدیہ! السلام علیکم!',
      spokenTextRoman: 'Mah-dee-ya! As-salamu Alaikum!',
    },
  ],
};

let activeUtterance: SpeechSynthesisUtterance | null = null;

function safeRestoreMusic(delayMs: number = 2200) {
  if (duckTimeoutId) {
    window.clearTimeout(duckTimeoutId);
  }
  duckTimeoutId = window.setTimeout(() => {
    restoreMusic();
  }, delayMs);
}

// Speech synthesis fallback
export function speakBabyVoiceFallback(phrase: VoicePhrase) {
  if (!('speechSynthesis' in window)) return;

  try {
    duckMusic(); // Lower music volume while speaking
    safeRestoreMusic(2400);

    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    const voices = window.speechSynthesis.getVoices();
    const urduVoice = voices.find(
      (v) =>
        v.lang.startsWith('ur') ||
        v.lang.startsWith('hi') ||
        v.lang.includes('PK') ||
        v.lang.includes('IN')
    );

    const textToSpeak = urduVoice ? phrase.spokenTextUrdu : phrase.spokenTextRoman;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    utterance.pitch = 1.85;
    utterance.rate = 0.88;
    utterance.volume = 1.0;

    if (urduVoice) {
      utterance.voice = urduVoice;
      utterance.lang = urduVoice.lang;
    } else {
      const preferred = voices.find(
        (v) =>
          (v.name.includes('Samantha') ||
            v.name.includes('Victoria') ||
            v.name.includes('Karen') ||
            v.name.includes('Zira') ||
            v.name.includes('Female') ||
            v.name.includes('Natural')) &&
          !v.name.includes('Male')
      );
      if (preferred) {
        utterance.voice = preferred;
      }
    }

    activeUtterance = utterance;
    utterance.onend = () => {
      activeUtterance = null;
      restoreMusic();
    };
    utterance.onerror = () => {
      activeUtterance = null;
      restoreMusic();
    };

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis error:', err);
    restoreMusic();
  }
}

// PRIMARY: Plays authentic, studio-quality Urdu baby voice WAV audio file with automatic music ducking
export function playVoicePhrase(phrase: VoicePhrase) {
  initAudio();

  // 1. Duck background music so voice is crystal clear!
  duckMusic();

  if (phrase.audioFile) {
    try {
      if (currentHtmlAudio) {
        currentHtmlAudio.pause();
        currentHtmlAudio.currentTime = 0;
      }

      const audio = new Audio(phrase.audioFile);
      audio.volume = 1.0;
      currentHtmlAudio = audio;

      audio.onended = () => {
        restoreMusic();
      };
      audio.onerror = () => {
        restoreMusic();
      };

      // Safety fallback in case onended doesn't fire
      safeRestoreMusic(2800);

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Audio play failed, using fallback:', err);
          speakBabyVoiceFallback(phrase);
        });
      }
      return;
    } catch (err) {
      console.warn('Audio constructor failed:', err);
    }
  }

  speakBabyVoiceFallback(phrase);
}
