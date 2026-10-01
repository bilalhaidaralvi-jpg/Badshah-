import React, { useState, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Camera, Sparkles, Heart, Volume2, Music, VolumeX } from 'lucide-react';
import {
  KittyIllustration,
  BunnyIllustration,
  BearIllustration,
  DuckIllustration,
} from './components/AnimalIllustrations';
import {
  playPopChime,
  playSkyTwinkle,
  playVoicePhrase,
  initAudio,
  MAHDIYA_PHRASES,
  VoicePhrase,
} from './soundEffects';
import { startMusic, toggleMusic, isMusicPlaying } from './musicLoop';

interface ActiveBubble {
  id: number;
  x: number;
  y: number;
}

interface FloatingStar {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  symbol: string;
}

interface AnimalData {
  id: 'kitty' | 'bunny' | 'bear' | 'duck';
  name: string;
  urduTitle: string;
  component: React.FC<{ isTapped: boolean; className?: string }>;
  bgColor: string;
  borderColor: string;
  shadowColor: string;
  floatClass: string;
  soundIndex: number;
}

const ANIMALS: AnimalData[] = [
  {
    id: 'kitty',
    name: 'Billi (Kitty)',
    urduTitle: 'بِلّی',
    component: KittyIllustration,
    bgColor: 'bg-pink-100/90',
    borderColor: 'border-pink-300',
    shadowColor: 'shadow-pink-300/60',
    floatClass: 'animate-baby-float-0',
    soundIndex: 0,
  },
  {
    id: 'bunny',
    name: 'Khargosh (Bunny)',
    urduTitle: 'خرگوش',
    component: BunnyIllustration,
    bgColor: 'bg-sky-100/90',
    borderColor: 'border-sky-300',
    shadowColor: 'shadow-sky-300/60',
    floatClass: 'animate-baby-float-1',
    soundIndex: 1,
  },
  {
    id: 'bear',
    name: 'Bhaloo (Bear)',
    urduTitle: 'بھالو',
    component: BearIllustration,
    bgColor: 'bg-amber-100/90',
    borderColor: 'border-pink-300',
    shadowColor: 'shadow-pink-300/60',
    floatClass: 'animate-baby-float-2',
    soundIndex: 2,
  },
  {
    id: 'duck',
    name: 'Battakh (Duck)',
    urduTitle: 'بطخ',
    component: DuckIllustration,
    bgColor: 'bg-yellow-100/90',
    borderColor: 'border-sky-300',
    shadowColor: 'shadow-sky-300/60',
    floatClass: 'animate-baby-float-3',
    soundIndex: 3,
  },
];

const STAR_SYMBOLS = ['⭐', '🌟', '✨', '💖', '🌸', '💫'];
const STAR_COLORS = ['#F472B6', '#38BDF8', '#FDE047', '#FB7185', '#60A5FA', '#F43F5E'];

// Default generated portrait of 2yo Mahdiya matching her pink jumpsuit & floral headband
const DEFAULT_MAHDIYA_IMAGE = '/src/assets/images/mahdiya_baby_1790866669880.jpg';

export default function App() {
  const [tappedId, setTappedId] = useState<string | null>(null);
  const [currentPhrase, setCurrentPhrase] = useState<VoicePhrase>({
    urduScript: 'مہدیہ! السلام علیکم!',
    romanText: 'Mahdiya! As-salamu Alaikum!',
    spokenTextUrdu: 'مہدیہ! السلام علیکم!',
    spokenTextRoman: 'Mahdiya! As-salamu Alaikum!',
  });
  const [speakerName, setSpeakerName] = useState<string>('Mahdiya');
  const [userPhoto, setUserPhoto] = useState<string>(() => {
    return localStorage.getItem('mahdiya_custom_photo') || DEFAULT_MAHDIYA_IMAGE;
  });
  const [musicOn, setMusicOn] = useState<boolean>(true);

  const [ripples, setRipples] = useState<ActiveBubble[]>([]);
  const [stars, setStars] = useState<FloatingStar[]>([]);
  const tapTimeoutRef = useRef<number | null>(null);
  const nextIdRef = useRef(0);
  const phraseIndexRef = useRef<Record<string, number>>({
    kitty: 0,
    bunny: 0,
    bear: 0,
    duck: 0,
    mahdiya: 0,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Toggle music on / off
  const handleMusicToggle = useCallback((e: React.SyntheticEvent) => {
    e.stopPropagation();
    initAudio();
    const newState = toggleMusic();
    setMusicOn(newState);
  }, []);

  // Trigger celebration & audio when Mahdiya or an animal is tapped
  const handleCharacterTap = useCallback(
    (e: React.SyntheticEvent, charId: 'kitty' | 'bunny' | 'bear' | 'duck' | 'mahdiya', displayName: string, soundIdx: number) => {
      e.stopPropagation();

      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const xPercent = (rect.left + rect.width / 2) / window.innerWidth;
      const yPercent = (rect.top + rect.height / 2) / window.innerHeight;

      // 1. Initialize audio & auto-start background cartoon music on tap
      initAudio();
      if (musicOn) {
        startMusic();
      }

      // 2. Trigger colorful star confetti burst
      try {
        confetti({
          particleCount: charId === 'mahdiya' ? 65 : 45,
          spread: 110,
          origin: { x: xPercent, y: yPercent },
          colors: ['#FFB6C1', '#F472B6', '#38BDF8', '#7DD3FC', '#FDE047', '#FFFFFF', '#FB7185'],
          shapes: ['star', 'circle'],
          scalar: 1.5,
          startVelocity: 35,
          ticks: 90,
          gravity: 0.9,
        });
      } catch (err) {
        console.warn('Confetti error:', err);
      }

      // 3. Play musical chime
      playPopChime(soundIdx);

      // 4. Get next rotating phrase for this character
      const phrases = MAHDIYA_PHRASES[charId] || MAHDIYA_PHRASES.mahdiya;
      const currentIdx = phraseIndexRef.current[charId] || 0;
      const phrase = phrases[currentIdx % phrases.length];
      phraseIndexRef.current[charId] = currentIdx + 1;

      setCurrentPhrase(phrase);
      setSpeakerName(displayName);
      setTappedId(charId);

      // 5. Play crystal clear Urdu baby voice saying phrase to Mahdiya (with music ducking)
      playVoicePhrase(phrase);

      if (tapTimeoutRef.current) {
        window.clearTimeout(tapTimeoutRef.current);
      }
      tapTimeoutRef.current = window.setTimeout(() => {
        setTappedId(null);
      }, 1900);

      // 5. Generate local floating stars and hearts
      const newFloatingStars: FloatingStar[] = [];
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const count = charId === 'mahdiya' ? 10 : 7;

      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + Math.random() * 0.4;
        const dist = 45 + Math.random() * 65;
        newFloatingStars.push({
          id: nextIdRef.current++,
          x: centerX + Math.cos(angle) * dist,
          y: centerY + Math.sin(angle) * dist,
          color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
          size: 26 + Math.random() * 24,
          symbol: STAR_SYMBOLS[Math.floor(Math.random() * STAR_SYMBOLS.length)],
        });
      }

      setStars((prev) => [...prev, ...newFloatingStars]);
      setTimeout(() => {
        setStars((prev) => prev.filter((s) => !newFloatingStars.some((ns) => ns.id === s.id)));
      }, 1400);
    },
    []
  );

  // Background sky tap: sensory ripples and twinkle chime
  const handleSkyTap = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    let clientX = 0;
    let clientY = 0;

    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    if (!clientX && !clientY) return;

    initAudio();
    if (musicOn) {
      startMusic();
    }

    playSkyTwinkle();

    const rippleId = nextIdRef.current++;
    setRipples((prev) => [...prev.slice(-6), { id: rippleId, x: clientX, y: clientY }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== rippleId));
    }, 800);

    const skyStars: FloatingStar[] = [
      {
        id: nextIdRef.current++,
        x: clientX,
        y: clientY - 15,
        color: '#F472B6',
        size: 26,
        symbol: '✨',
      },
      {
        id: nextIdRef.current++,
        x: clientX + (Math.random() * 40 - 20),
        y: clientY - 35,
        color: '#38BDF8',
        size: 28,
        symbol: '⭐',
      },
    ];

    setStars((prev) => [...prev, ...skyStars]);
    setTimeout(() => {
      setStars((prev) => prev.filter((s) => !skyStars.some((ss) => ss.id === s.id)));
    }, 1200);
  }, []);

  // Upload/change custom photo of baby Mahdiya
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const dataUrl = event.target.result as string;
          setUserPhoto(dataUrl);
          localStorage.setItem('mahdiya_custom_photo', dataUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      onPointerDown={handleSkyTap}
      className="relative w-screen h-screen overflow-hidden select-none touch-none flex flex-col items-center justify-between"
      style={{
        background: 'linear-gradient(180deg, #BAE6FD 0%, #E0F2FE 30%, #FCE7F3 75%, #FBCFE8 100%)',
      }}
    >
      {/* Hidden file input for updating Mahdiya's photo */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handlePhotoUpload}
        className="hidden"
      />

      {/* 🌈 Soft Pastel Rainbow Arc in Background */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[850px] h-[380px] pointer-events-none opacity-45">
        <svg viewBox="0 0 600 300" className="w-full h-full">
          <path d="M 50 300 A 250 250 0 0 1 550 300" fill="none" stroke="#F472B6" strokeWidth="20" strokeLinecap="round" opacity="0.6" />
          <path d="M 70 300 A 230 230 0 0 1 530 300" fill="none" stroke="#FDE047" strokeWidth="18" strokeLinecap="round" opacity="0.6" />
          <path d="M 90 300 A 210 210 0 0 1 510 300" fill="none" stroke="#38BDF8" strokeWidth="16" strokeLinecap="round" opacity="0.6" />
          <path d="M 110 300 A 190 190 0 0 1 490 300" fill="none" stroke="#E9D5FF" strokeWidth="14" strokeLinecap="round" opacity="0.6" />
        </svg>
      </div>

      {/* ☁️ Smiling Clouds */}
      <div className="absolute top-4 left-6 pointer-events-none opacity-85">
        <svg width="110" height="65" viewBox="0 0 120 70" fill="#FFFFFF">
          <ellipse cx="60" cy="45" rx="50" ry="25" fill="#FFFFFF" />
          <circle cx="40" cy="30" r="22" fill="#FFFFFF" />
          <circle cx="75" cy="28" r="26" fill="#FFFFFF" />
          <circle cx="50" cy="42" r="2.5" fill="#0284C7" />
          <circle cx="68" cy="42" r="2.5" fill="#0284C7" />
          <path d="M 55 48 Q 59 52 63 48" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" fill="none" />
          <circle cx="43" cy="46" r="3.5" fill="#F472B6" opacity="0.6" />
          <circle cx="75" cy="46" r="3.5" fill="#F472B6" opacity="0.6" />
        </svg>
      </div>

      <div className="absolute top-6 right-6 pointer-events-none opacity-90 hidden sm:block">
        <svg width="130" height="75" viewBox="0 0 140 80" fill="#FFFFFF">
          <ellipse cx="70" cy="50" rx="60" ry="28" fill="#FFFFFF" />
          <circle cx="45" cy="35" r="25" fill="#FFFFFF" />
          <circle cx="85" cy="32" r="30" fill="#FFFFFF" />
          <path d="M 58 48 Q 63 53 68 48" stroke="#EC4899" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M 76 48 Q 81 53 86 48" stroke="#EC4899" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <circle cx="53" cy="51" r="3.5" fill="#F472B6" opacity="0.7" />
          <circle cx="91" cy="51" r="3.5" fill="#F472B6" opacity="0.7" />
        </svg>
      </div>

      {/* Floating sparkles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <span className="absolute top-[14%] left-[16%] text-2xl animate-twinkle opacity-70">✨</span>
        <span className="absolute top-[10%] right-[20%] text-3xl animate-twinkle opacity-60 [animation-delay:1s]">⭐</span>
        <span className="absolute bottom-[22%] left-[6%] text-2xl animate-twinkle opacity-65 [animation-delay:1.5s]">🌟</span>
        <span className="absolute bottom-[18%] right-[8%] text-2xl animate-twinkle opacity-75 [animation-delay:0.5s]">💖</span>
        <span className="absolute top-[36%] left-[4%] text-2xl animate-twinkle opacity-50 [animation-delay:2s]">🌸</span>
      </div>

      {/* 🌟 Top Floating Speech Greeting Bubble (Speaks directly to Mahdiya) */}
      <header className="relative z-20 pt-2 sm:pt-4 px-3 flex flex-col items-center w-full max-w-2xl">
        {/* Viral Cartoon Music Toggle ("Dubi Dubi Dam Dam") */}
        <div className="mb-1.5 sm:mb-2 flex items-center justify-center">
          <button
            type="button"
            onClick={handleMusicToggle}
            className={`px-4 py-1.5 sm:px-5 sm:py-2 rounded-full border-2 shadow-md flex items-center gap-2 font-bold text-xs sm:text-sm active:scale-95 transition-all cursor-pointer ${
              musicOn
                ? 'bg-white/95 text-pink-600 border-pink-300 shadow-pink-200/50 ring-2 ring-pink-200'
                : 'bg-white/75 text-gray-500 border-gray-300'
            }`}
          >
            {musicOn ? (
              <>
                <Music className="w-4 h-4 text-pink-500 animate-spin [animation-duration:4s]" />
                <span className="tracking-wide">🎶 Dubi Dubi Dam Dam: ON</span>
                <span className="text-[11px] bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full font-semibold hidden sm:inline">
                  Auto-slow on talk
                </span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-gray-400" />
                <span>Music: OFF (Tap to Play)</span>
              </>
            )}
          </button>
        </div>

        <div
          role="button"
          tabIndex={0}
          aria-label="Replay Voice / آواز دوبارہ سنیں"
          onPointerDown={(e) => {
            e.stopPropagation();
            initAudio();
            if (musicOn) {
              startMusic();
            }
            playPopChime(4);
            playVoicePhrase(currentPhrase);
          }}
          className={`w-full transition-all duration-300 transform cursor-pointer active:scale-95 ${
            tappedId ? 'scale-105' : 'scale-100'
          }`}
        >
          <div className="bg-white/95 backdrop-blur-md px-5 py-2.5 sm:px-7 sm:py-3 rounded-3xl sm:rounded-full border-4 border-pink-400 shadow-xl shadow-pink-200/50 flex items-center justify-between gap-2 sm:gap-4 hover:border-pink-500 transition-colors">
            <span className="text-2xl sm:text-3xl animate-bounce">🌸</span>

            <div className="text-center flex-1">
              <div className="flex items-center justify-center gap-1.5 mb-0.5">
                <Volume2 className="w-5 h-5 text-pink-500 animate-pulse" />
                <h1 className="text-xl sm:text-3xl font-extrabold text-pink-600 tracking-wide font-['Fredoka'] drop-shadow-sm leading-tight">
                  {currentPhrase.romanText}
                </h1>
              </div>
              <p className="text-base sm:text-xl font-bold text-sky-600 tracking-wide font-sans">
                {currentPhrase.urduScript}
              </p>
            </div>

            <span className="text-2xl sm:text-3xl animate-bounce [animation-delay:0.3s]">⭐</span>
          </div>
        </div>
      </header>

      {/* 💖 CENTER STAGE: MAHDIYA'S PHOTO BUTTON & THE 4 BIG BOUNCING ANIMALS */}
      <main className="relative z-10 w-full max-w-4xl flex-1 flex flex-col items-center justify-center p-2 sm:p-4 gap-3 sm:gap-4">
        
        {/* ⭐ MAHDIYA'S BIG SPECIAL PHOTO BUTTON ⭐ */}
        <div className="relative flex flex-col items-center">
          <div
            role="button"
            tabIndex={0}
            aria-label="Tap Mahdiya's Photo"
            onPointerDown={(e) => handleCharacterTap(e, 'mahdiya', 'Mahdiya', 4)}
            className={`group relative w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 rounded-full border-[6px] border-pink-400 bg-gradient-to-tr from-pink-200 to-sky-200 shadow-2xl shadow-pink-300/80 flex items-center justify-center cursor-pointer select-none active:scale-95 transition-all duration-200 transform ${
              tappedId === 'mahdiya'
                ? 'scale-115 ring-8 ring-pink-400 animate-pulse'
                : 'animate-baby-float-0 hover:scale-105'
            }`}
          >
            {/* Sparkle crown above Mahdiya */}
            <div className="absolute -top-6 flex items-center gap-1 z-30">
              <span className="text-xl sm:text-2xl animate-bounce">👑</span>
              <span className="text-base sm:text-xl text-pink-600 font-extrabold bg-white/90 px-2 py-0.5 rounded-full shadow border border-pink-300">
                مہدیہ
              </span>
              <span className="text-xl sm:text-2xl animate-bounce [animation-delay:0.2s]">💖</span>
            </div>

            {/* Mahdiya's Photo */}
            <div className="w-[92%] h-[92%] rounded-full overflow-hidden border-2 border-white shadow-inner bg-pink-50">
              <img
                src={userPhoto}
                alt="Baby Mahdiya"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-110"
              />
            </div>

            {/* Little camera icon for parents to swap photo with original device photo */}
            <button
              type="button"
              title="Change Photo / تصویر بدلیں"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="absolute -bottom-1 -right-1 bg-white hover:bg-pink-50 text-pink-500 p-2 rounded-full border-2 border-pink-300 shadow-md transition-transform active:scale-90 z-20 cursor-pointer"
            >
              <Camera className="w-4 h-4" />
            </button>

            {/* Pop star explosion on tap */}
            {tappedId === 'mahdiya' && (
              <span className="absolute inset-0 rounded-full border-4 border-pink-400 animate-ping opacity-75 pointer-events-none" />
            )}
          </div>

          {/* Big Name Tag under Mahdiya */}
          <div className="mt-1 flex items-center gap-1.5 bg-white/90 px-4 py-1 rounded-full border-2 border-pink-300 shadow-md">
            <Heart className="w-4 h-4 text-pink-500 fill-pink-500 animate-pulse" />
            <span className="text-base sm:text-xl font-bold text-pink-600 font-['Fredoka']">
              Mahdiya (مہدیہ)
            </span>
            <Sparkles className="w-4 h-4 text-sky-400" />
          </div>
        </div>

        {/* 🐾 4 BIG BOUNCING ANIMALS (KITTY, BUNNY, BEAR, DUCK) */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6 max-w-3xl">
          {ANIMALS.map((animal) => {
            const isTapped = tappedId === animal.id;
            const AnimalIcon = animal.component;

            return (
              <div
                key={animal.id}
                role="button"
                tabIndex={0}
                aria-label={`Tap ${animal.name}`}
                onPointerDown={(e) => handleCharacterTap(e, animal.id, animal.name, animal.soundIndex)}
                className={`group relative aspect-square rounded-2xl sm:rounded-3xl border-4 sm:border-[5px] ${animal.borderColor} ${animal.bgColor} ${animal.shadowColor} shadow-xl flex flex-col items-center justify-center p-1.5 sm:p-3 cursor-pointer select-none active:scale-90 transition-all duration-200 transform ${
                  isTapped
                    ? 'scale-110 ring-6 ring-pink-300/90'
                    : animal.floatClass
                }`}
              >
                {/* Glow halo */}
                <div
                  className={`absolute inset-0 rounded-2xl sm:rounded-3xl transition-opacity duration-300 ${
                    isTapped
                      ? 'bg-gradient-to-tr from-pink-300/40 to-sky-300/40 opacity-100 animate-pulse'
                      : 'opacity-0'
                  }`}
                />

                {/* Stars bouncing above tapped animal */}
                {isTapped && (
                  <div className="absolute -top-6 sm:-top-8 flex items-center gap-1 animate-bounce z-30">
                    <span className="text-xl sm:text-3xl drop-shadow">⭐</span>
                    <span className="text-lg sm:text-2xl drop-shadow">💖</span>
                  </div>
                )}

                {/* Animal SVG Artwork */}
                <div className="relative w-full h-[76%] sm:h-[80%] flex items-center justify-center">
                  <AnimalIcon isTapped={isTapped} className={isTapped ? 'scale-110' : ''} />
                </div>

                {/* Cute Animal Name + Urdu Tag */}
                <div className="relative z-10 mt-0.5 sm:mt-1 text-center">
                  <span
                    className={`inline-block px-2 sm:px-3 py-0.5 rounded-full text-xs sm:text-sm md:text-base font-bold transition-all shadow-sm ${
                      isTapped
                        ? 'bg-pink-500 text-white scale-105'
                        : 'bg-white/95 text-pink-600 group-hover:scale-105'
                    }`}
                  >
                    {animal.name.split(' ')[0]}
                  </span>
                </div>

                {isTapped && (
                  <span className="absolute inset-0 rounded-2xl sm:rounded-3xl border-4 border-pink-400 animate-ping opacity-60 pointer-events-none" />
                )}
              </div>
            );
          })}
        </div>
      </main>

      {/* 🌸 Bottom Instruction & Friendly Guide */}
      <footer className="relative z-10 w-full pb-3 sm:pb-5 px-3 flex flex-col items-center pointer-events-none">
        <div className="flex items-center justify-center gap-2 bg-white/75 backdrop-blur-sm px-4 py-1.5 rounded-full border-2 border-pink-200 shadow-sm">
          <span className="text-lg sm:text-xl animate-bounce">🐱</span>
          <span className="text-pink-600 font-bold text-xs sm:text-base tracking-wide text-center">
            Tap Billi, Animals, ya Mahdiya ki photo ko dabayein!
          </span>
          <span className="text-lg sm:text-xl animate-bounce [animation-delay:0.3s]">🐥</span>
        </div>
      </footer>

      {/* 🌊 Sensory Touch Water/Sparkle Ripples */}
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="absolute rounded-full border-4 border-pink-400 bg-sky-200/40 animate-ripple pointer-events-none z-40"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 75,
            height: 75,
          }}
        />
      ))}

      {/* ✨ Floating Pop Stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute pointer-events-none select-none z-50 transition-all duration-1000 ease-out"
          style={{
            left: star.x,
            top: star.y,
            fontSize: `${star.size}px`,
            transform: 'translate(-50%, -50%)',
            animation: 'starTwinkle 1.2s ease-out forwards',
          }}
        >
          {star.symbol}
        </div>
      ))}
    </div>
  );
}
