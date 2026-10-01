import React from 'react';

interface AnimalProps {
  isTapped: boolean;
  className?: string;
}

// 🐱 CUTE KITTY
export const KittyIllustration: React.FC<AnimalProps> = ({ isTapped, className = '' }) => {
  return (
    <svg viewBox="0 0 200 200" className={`w-full h-full drop-shadow-lg transition-transform ${className}`}>
      <defs>
        <radialGradient id="kittyBodyGrad" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#FFF1F5" />
          <stop offset="85%" stopColor="#FDE2E8" />
          <stop offset="100%" stopColor="#FCCFD8" />
        </radialGradient>
        <linearGradient id="kittyEarPink" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F472B6" />
          <stop offset="100%" stopColor="#FB7185" />
        </linearGradient>
      </defs>

      {/* Ears */}
      <polygon points="45,85 25,25 90,55" fill="#FDE2E8" stroke="#F472B6" strokeWidth="4" strokeLinejoin="round" />
      <polygon points="45,80 34,36 82,58" fill="url(#kittyEarPink)" />

      <polygon points="155,85 175,25 110,55" fill="#FDE2E8" stroke="#F472B6" strokeWidth="4" strokeLinejoin="round" />
      <polygon points="155,80 166,36 118,58" fill="url(#kittyEarPink)" />

      {/* Head / Body */}
      <circle cx="100" cy="115" r="70" fill="url(#kittyBodyGrad)" stroke="#F472B6" strokeWidth="4" />

      {/* Cute Forehead Hair Tuft */}
      <path d="M 94 48 C 98 42, 102 42, 106 48" stroke="#FB7185" strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* Big Sparkling Eyes */}
      {isTapped ? (
        // Happy squinty arched eyes when tapped
        <g stroke="#831843" strokeWidth="5" strokeLinecap="round" fill="none">
          <path d="M 68 108 Q 78 95 88 108" />
          <path d="M 112 108 Q 122 95 132 108" />
        </g>
      ) : (
        // Big baby sparkle eyes
        <g>
          <ellipse cx="78" cy="108" rx="12" ry="14" fill="#374151" />
          <ellipse cx="122" cy="108" rx="12" ry="14" fill="#374151" />
          {/* Sparkles */}
          <circle cx="75" cy="104" r="4.5" fill="#FFFFFF" />
          <circle cx="82" cy="112" r="2" fill="#FFFFFF" />
          <circle cx="119" cy="104" r="4.5" fill="#FFFFFF" />
          <circle cx="126" cy="112" r="2" fill="#FFFFFF" />
        </g>
      )}

      {/* Rosy Cheeks */}
      <ellipse cx="60" cy="122" rx="11" ry="7" fill="#FDA4AF" opacity="0.85" />
      <ellipse cx="140" cy="122" rx="11" ry="7" fill="#FDA4AF" opacity="0.85" />

      {/* Tiny Nose */}
      <polygon points="96,118 104,118 100,123" fill="#F43F5E" />

      {/* Smiling Mouth */}
      <path d="M 94 125 Q 100 131 100 126 Q 100 131 106 125" fill="none" stroke="#831843" strokeWidth="3.5" strokeLinecap="round" />

      {/* Whiskers */}
      <g stroke="#FB7185" strokeWidth="2.5" strokeLinecap="round">
        <line x1="42" y1="112" x2="22" y2="108" />
        <line x1="40" y1="122" x2="18" y2="124" />
        <line x1="158" y1="112" x2="178" y2="108" />
        <line x1="160" y1="122" x2="182" y2="124" />
      </g>

      {/* Paws waving at bottom */}
      <ellipse cx="72" cy="168" rx="14" ry="12" fill="#FFFFFF" stroke="#F472B6" strokeWidth="3" />
      <ellipse cx="128" cy="168" rx="14" ry="12" fill="#FFFFFF" stroke="#F472B6" strokeWidth="3" />
      {/* Pink paw pads */}
      <circle cx="72" cy="168" r="4.5" fill="#FDA4AF" />
      <circle cx="128" cy="168" r="4.5" fill="#FDA4AF" />

      {/* Little Star Bell */}
      <circle cx="100" cy="170" r="7" fill="#FDE047" stroke="#EAB308" strokeWidth="2" />
    </svg>
  );
};

// 🐰 CUTE BUNNY
export const BunnyIllustration: React.FC<AnimalProps> = ({ isTapped, className = '' }) => {
  return (
    <svg viewBox="0 0 200 200" className={`w-full h-full drop-shadow-lg transition-transform ${className}`}>
      <defs>
        <radialGradient id="bunnyBodyGrad" cx="50%" cy="45%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="85%" stopColor="#F9FAFB" />
          <stop offset="100%" stopColor="#F3E8FF" />
        </radialGradient>
        <linearGradient id="bunnyEarInner" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FBCFE8" />
          <stop offset="100%" stopColor="#F472B6" />
        </linearGradient>
      </defs>

      {/* Left Ear */}
      <g className={isTapped ? 'animate-wiggle' : ''}>
        <path d="M 68 85 C 48 30, 45 10, 65 10 C 85 10, 85 45, 80 85 Z" fill="#FFFFFF" stroke="#38BDF8" strokeWidth="3.5" />
        <path d="M 68 75 C 55 35, 54 22, 65 20 C 76 18, 77 45, 75 75 Z" fill="url(#bunnyEarInner)" opacity="0.8" />
      </g>

      {/* Right Ear */}
      <g className={isTapped ? 'animate-wiggle' : ''}>
        <path d="M 132 85 C 152 30, 155 10, 135 10 C 115 10, 115 45, 120 85 Z" fill="#FFFFFF" stroke="#38BDF8" strokeWidth="3.5" />
        <path d="M 132 75 C 145 35, 146 22, 135 20 C 124 18, 123 45, 125 75 Z" fill="url(#bunnyEarInner)" opacity="0.8" />
      </g>

      {/* Head */}
      <ellipse cx="100" cy="120" rx="66" ry="60" fill="url(#bunnyBodyGrad)" stroke="#38BDF8" strokeWidth="3.5" />

      {/* Big Eyes */}
      {isTapped ? (
        <g stroke="#0369A1" strokeWidth="5" strokeLinecap="round" fill="none">
          <path d="M 70 115 Q 80 102 90 115" />
          <path d="M 110 115 Q 120 102 130 115" />
        </g>
      ) : (
        <g>
          <ellipse cx="80" cy="115" rx="11" ry="13" fill="#1E293B" />
          <ellipse cx="120" cy="115" rx="11" ry="13" fill="#1E293B" />
          {/* Highlights */}
          <circle cx="77" cy="111" r="4.5" fill="#FFFFFF" />
          <circle cx="83" cy="118" r="1.8" fill="#FFFFFF" />
          <circle cx="117" cy="111" r="4.5" fill="#FFFFFF" />
          <circle cx="123" cy="118" r="1.8" fill="#FFFFFF" />
        </g>
      )}

      {/* Rosy Cheeks */}
      <ellipse cx="64" cy="128" rx="12" ry="7" fill="#F472B6" opacity="0.7" />
      <ellipse cx="136" cy="128" rx="12" ry="7" fill="#F472B6" opacity="0.7" />

      {/* Little Button Nose */}
      <ellipse cx="100" cy="124" rx="5" ry="4" fill="#F43F5E" />

      {/* Smile and Buck Teeth */}
      <path d="M 95 129 Q 100 134 100 130 Q 100 134 105 129" fill="none" stroke="#0369A1" strokeWidth="3" strokeLinecap="round" />
      <rect x="97" y="132" width="6" height="6" rx="1" fill="#FFFFFF" stroke="#0369A1" strokeWidth="1.5" />

      {/* Whiskers */}
      <g stroke="#BAE6FD" strokeWidth="2.5" strokeLinecap="round">
        <line x1="48" y1="120" x2="30" y2="116" />
        <line x1="47" y1="128" x2="28" y2="132" />
        <line x1="152" y1="120" x2="170" y2="116" />
        <line x1="153" y1="128" x2="172" y2="132" />
      </g>

      {/* Flower Hair Accessory */}
      <g transform="translate(132, 70)">
        <circle cx="0" cy="-6" r="5" fill="#F472B6" />
        <circle cx="6" cy="0" r="5" fill="#F472B6" />
        <circle cx="0" cy="6" r="5" fill="#F472B6" />
        <circle cx="-6" cy="0" r="5" fill="#F472B6" />
        <circle cx="0" cy="0" r="4.5" fill="#FDE047" />
      </g>

      {/* Little Bunny Paws */}
      <ellipse cx="80" cy="168" rx="12" ry="10" fill="#FFFFFF" stroke="#38BDF8" strokeWidth="3" />
      <ellipse cx="120" cy="168" rx="12" ry="10" fill="#FFFFFF" stroke="#38BDF8" strokeWidth="3" />
    </svg>
  );
};

// 🐻 CUTE TEDDY BEAR
export const BearIllustration: React.FC<AnimalProps> = ({ isTapped, className = '' }) => {
  return (
    <svg viewBox="0 0 200 200" className={`w-full h-full drop-shadow-lg transition-transform ${className}`}>
      <defs>
        <radialGradient id="bearFurGrad" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#FED7AA" />
          <stop offset="85%" stopColor="#FDBA74" />
          <stop offset="100%" stopColor="#FB923C" />
        </radialGradient>
        <radialGradient id="bearSnoutGrad" cx="50%" cy="45%" r="50%">
          <stop offset="0%" stopColor="#FFFBEB" />
          <stop offset="100%" stopColor="#FEF3C7" />
        </radialGradient>
      </defs>

      {/* Round Bear Ears */}
      <circle cx="50" cy="65" r="28" fill="#FB923C" stroke="#EA580C" strokeWidth="3" />
      <circle cx="50" cy="65" r="16" fill="#FBCFE8" />

      <circle cx="150" cy="65" r="28" fill="#FB923C" stroke="#EA580C" strokeWidth="3" />
      <circle cx="150" cy="65" r="16" fill="#FBCFE8" />

      {/* Head */}
      <circle cx="100" cy="115" r="68" fill="url(#bearFurGrad)" stroke="#EA580C" strokeWidth="3.5" />

      {/* Eyes */}
      {isTapped ? (
        <g stroke="#7C2D12" strokeWidth="5" strokeLinecap="round" fill="none">
          <path d="M 68 100 Q 78 88 88 100" />
          <path d="M 112 100 Q 122 88 132 100" />
        </g>
      ) : (
        <g>
          <ellipse cx="78" cy="100" rx="10" ry="12" fill="#451A03" />
          <ellipse cx="122" cy="100" rx="10" ry="12" fill="#451A03" />
          <circle cx="75" cy="97" r="4" fill="#FFFFFF" />
          <circle cx="81" cy="103" r="1.5" fill="#FFFFFF" />
          <circle cx="119" cy="97" r="4" fill="#FFFFFF" />
          <circle cx="125" cy="103" r="1.5" fill="#FFFFFF" />
        </g>
      )}

      {/* Rosy Cheeks */}
      <ellipse cx="58" cy="118" rx="12" ry="8" fill="#FB7185" opacity="0.8" />
      <ellipse cx="142" cy="118" rx="12" ry="8" fill="#FB7185" opacity="0.8" />

      {/* Snout */}
      <ellipse cx="100" cy="126" rx="26" ry="20" fill="url(#bearSnoutGrad)" stroke="#FDBA74" strokeWidth="2" />

      {/* Bear Nose */}
      <path d="M 92 118 Q 100 114 108 118 Q 100 128 92 118 Z" fill="#7C2D12" />

      {/* Cute Smile */}
      <path d="M 100 125 L 100 133" stroke="#7C2D12" strokeWidth="3" strokeLinecap="round" />
      <path d="M 93 133 Q 100 139 107 133" fill="none" stroke="#7C2D12" strokeWidth="3" strokeLinecap="round" />

      {/* Little Bear Paws */}
      <circle cx="68" cy="168" r="15" fill="#FB923C" stroke="#EA580C" strokeWidth="2.5" />
      <circle cx="68" cy="168" r="7" fill="#FBCFE8" />

      <circle cx="132" cy="168" r="15" fill="#FB923C" stroke="#EA580C" strokeWidth="2.5" />
      <circle cx="132" cy="168" r="7" fill="#FBCFE8" />
    </svg>
  );
};

// 🦆 CUTE DUCKLING
export const DuckIllustration: React.FC<AnimalProps> = ({ isTapped, className = '' }) => {
  return (
    <svg viewBox="0 0 200 200" className={`w-full h-full drop-shadow-lg transition-transform ${className}`}>
      <defs>
        <radialGradient id="duckGrad" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="85%" stopColor="#FDE047" />
          <stop offset="100%" stopColor="#FACC15" />
        </radialGradient>
        <linearGradient id="beakGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FB923C" />
          <stop offset="100%" stopColor="#F97316" />
        </linearGradient>
      </defs>

      {/* Head feather tuft */}
      <path d="M 100 52 C 90 28, 105 18, 102 38 C 112 25, 122 34, 105 52 Z" fill="#FDE047" stroke="#EAB308" strokeWidth="2.5" />

      {/* Little Pink Bow on tuft */}
      <g transform="translate(108, 42)">
        <polygon points="0,0 -8,-5 -8,5" fill="#F472B6" />
        <polygon points="0,0 8,-5 8,5" fill="#F472B6" />
        <circle cx="0" cy="0" r="3" fill="#FB7185" />
      </g>

      {/* Head / Body */}
      <circle cx="100" cy="115" r="68" fill="url(#duckGrad)" stroke="#EAB308" strokeWidth="3.5" />

      {/* Flappy Little Wings */}
      <g className={isTapped ? 'animate-bounce' : ''}>
        <ellipse cx="38" cy="125" rx="16" ry="22" fill="#FDE047" stroke="#EAB308" strokeWidth="2.5" transform="rotate(-15, 38, 125)" />
        <ellipse cx="162" cy="125" rx="16" ry="22" fill="#FDE047" stroke="#EAB308" strokeWidth="2.5" transform="rotate(15, 162, 125)" />
      </g>

      {/* Eyes */}
      {isTapped ? (
        <g stroke="#713F12" strokeWidth="5" strokeLinecap="round" fill="none">
          <path d="M 68 102 Q 78 90 88 102" />
          <path d="M 112 102 Q 122 90 132 102" />
        </g>
      ) : (
        <g>
          <ellipse cx="78" cy="102" rx="11" ry="13" fill="#1C1917" />
          <ellipse cx="122" cy="102" rx="11" ry="13" fill="#1C1917" />
          <circle cx="75" cy="98" r="4.5" fill="#FFFFFF" />
          <circle cx="81" cy="105" r="1.8" fill="#FFFFFF" />
          <circle cx="119" cy="98" r="4.5" fill="#FFFFFF" />
          <circle cx="125" cy="105" r="1.8" fill="#FFFFFF" />
        </g>
      )}

      {/* Rosy Cheeks */}
      <ellipse cx="58" cy="120" rx="11" ry="7" fill="#F472B6" opacity="0.8" />
      <ellipse cx="142" cy="120" rx="11" ry="7" fill="#F472B6" opacity="0.8" />

      {/* Duck Beak */}
      <ellipse cx="100" cy="126" rx="22" ry="14" fill="url(#beakGrad)" stroke="#EA580C" strokeWidth="2" />
      <path d="M 82 126 Q 100 136 118 126" stroke="#C2410C" strokeWidth="2.5" fill="none" />
      {/* Open smiling mouth */}
      {isTapped && (
        <path d="M 90 127 Q 100 136 110 127 Z" fill="#991B1B" />
      )}
      <ellipse cx="94" cy="123" rx="1.5" ry="2" fill="#C2410C" />
      <ellipse cx="106" cy="123" rx="1.5" ry="2" fill="#C2410C" />

      {/* Webbed Feet at bottom */}
      <path d="M 72 170 C 62 170, 60 182, 70 182 C 78 182, 84 175, 78 170 Z" fill="#FB923C" stroke="#EA580C" strokeWidth="2" />
      <path d="M 128 170 C 138 170, 140 182, 130 182 C 122 182, 116 175, 122 170 Z" fill="#FB923C" stroke="#EA580C" strokeWidth="2" />
    </svg>
  );
};
