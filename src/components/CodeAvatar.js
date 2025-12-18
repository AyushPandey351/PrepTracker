import React from 'react';

// Animated Code Ninja Avatar Component
function CodeAvatar() {
  return (
    <div className="code-avatar">
      {/* Orbiting code symbols */}
      <div className="orbit orbit-1">
        <span className="code-symbol symbol-1">{'<>'}</span>
      </div>
      <div className="orbit orbit-2">
        <span className="code-symbol symbol-2">{'/>'}</span>
      </div>
      <div className="orbit orbit-3">
        <span className="code-symbol symbol-3">{'{ }'}</span>
      </div>
      
      {/* Main avatar circle */}
      <div className="avatar-ring">
        <div className="avatar-inner">
          <svg viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Katana sword - behind ninja, over right shoulder */}
            <g className="katana">
              {/* Blade */}
              <rect x="35" y="-2" width="2.5" height="38" rx="0.5" fill="url(#bladeGradient)" className="blade" transform="rotate(20 36 18)"/>
              
              {/* Blade shine */}
              <line x1="36.2" y1="0" x2="36.2" y2="34" stroke="white" strokeWidth="0.5" opacity="0.9" className="blade-shine" transform="rotate(20 36 18)"/>
              
              {/* Blade tip */}
              <path d="M35 -2 L36.25 -6 L37.5 -2" fill="url(#bladeGradient)" transform="rotate(20 36 18)"/>
              
              {/* Guard (tsuba) */}
              <ellipse cx="36.25" cy="36" rx="3.5" ry="1.8" fill="url(#guardGradient)" className="sword-guard" transform="rotate(20 36 18)"/>
              
              {/* Handle */}
              <rect x="35" y="37" width="2.5" height="10" rx="0.5" fill="#2d1f0f" transform="rotate(20 36 18)"/>
              <line x1="35" y1="39" x2="37.5" y2="39" stroke="#1a1209" strokeWidth="0.8" transform="rotate(20 36 18)"/>
              <line x1="35" y1="41" x2="37.5" y2="41" stroke="#1a1209" strokeWidth="0.8" transform="rotate(20 36 18)"/>
              <line x1="35" y1="43" x2="37.5" y2="43" stroke="#1a1209" strokeWidth="0.8" transform="rotate(20 36 18)"/>
              <line x1="35" y1="45" x2="37.5" y2="45" stroke="#1a1209" strokeWidth="0.8" transform="rotate(20 36 18)"/>
            </g>
            
            {/* Head base */}
            <circle cx="25" cy="22" r="14" fill="#e8b89a"/>
            
            {/* Ninja mask - covers head and lower face */}
            <path d="M11 18 Q11 10 25 10 Q39 10 39 18 L39 22 Q39 26 35 28 L33 28 L33 30 Q33 34 25 34 Q17 34 17 30 L17 28 L15 28 Q11 26 11 22 Z" fill="#1a1a2e" className="ninja-mask"/>
            
            {/* Mask texture lines */}
            <path d="M13 20 Q25 22 37 20" stroke="#252538" strokeWidth="0.5" fill="none" opacity="0.5"/>
            <path d="M14 24 Q25 26 36 24" stroke="#252538" strokeWidth="0.5" fill="none" opacity="0.5"/>
            
            {/* Eye opening in mask */}
            <path d="M14 17 Q25 14 36 17 L36 23 Q25 26 14 23 Z" fill="#e8b89a"/>
            
            {/* Headband */}
            <rect x="10" y="13" width="30" height="5" fill="#0f1520"/>
            <rect x="10" y="13" width="30" height="5" fill="url(#headbandGradient)"/>
            
            {/* Headband knot */}
            <circle cx="38" cy="15.5" r="3" fill="#0f1520"/>
            <circle cx="38" cy="15.5" r="3" fill="url(#headbandGradient)"/>
            
            {/* Headband tails flowing */}
            <path d="M39 18 Q44 22 42 30" stroke="url(#headbandGradient)" strokeWidth="3" fill="none" strokeLinecap="round" className="headband-tail tail-1"/>
            <path d="M40 17 Q46 20 45 28" stroke="url(#headbandGradient)" strokeWidth="2.5" fill="none" strokeLinecap="round" className="headband-tail tail-2"/>
            
            {/* Headband shine */}
            <line x1="12" y1="14" x2="20" y2="14" stroke="#00d9ff" strokeWidth="0.8" opacity="0.6"/>
            
            {/* Headband symbol - code bracket */}
            <text x="25" y="17" textAnchor="middle" fill="#00d9ff" fontSize="5" fontFamily="monospace" fontWeight="bold" className="headband-symbol">{'</>'}</text>
            
            {/* Intense Ninja Eyes - no glasses! */}
            <ellipse cx="19.5" cy="19" rx="2.5" ry="2" fill="#1a1a2e" className="eye"/>
            <ellipse cx="30.5" cy="19" rx="2.5" ry="2" fill="#1a1a2e" className="eye"/>
            
            {/* Eye glow - cyan ninja power */}
            <ellipse cx="19.5" cy="19" rx="1.5" ry="1.2" fill="#00d9ff" opacity="0.3" className="eye-glow"/>
            <ellipse cx="30.5" cy="19" rx="1.5" ry="1.2" fill="#00d9ff" opacity="0.3" className="eye-glow"/>
            
            {/* Pupils */}
            <ellipse cx="19.5" cy="19" rx="1" ry="0.8" fill="#0a0a0a"/>
            <ellipse cx="30.5" cy="19" rx="1" ry="0.8" fill="#0a0a0a"/>
            
            {/* Eye shine */}
            <circle cx="20.2" cy="18.3" r="0.6" fill="white"/>
            <circle cx="31.2" cy="18.3" r="0.6" fill="white"/>
            
            {/* Determined eyebrows */}
            <path d="M15 16 L22 17.5" stroke="#1a1a2e" strokeWidth="2" fill="none" strokeLinecap="round"/>
            <path d="M28 17.5 L35 16" stroke="#1a1a2e" strokeWidth="2" fill="none" strokeLinecap="round"/>
            
            {/* Ninja outfit - cyber style */}
            <g className="ninja-outfit">
              {/* Base outfit */}
              <path d="M15 34 Q12 40 11 50 L39 50 Q38 40 35 34 Q25 31 15 34" fill="#0a0f18"/>
              
              {/* Collar / neck area */}
              <path d="M18 34 L25 38 L32 34" stroke="#00d9ff" strokeWidth="1" fill="none" opacity="0.6"/>
              <path d="M20 35 L25 37 L30 35" stroke="#00ff94" strokeWidth="0.5" fill="none" opacity="0.4"/>
              
              {/* Chest armor plate */}
              <path d="M18 36 L25 40 L32 36 L32 44 L25 48 L18 44 Z" fill="#0f1822" stroke="#00d9ff" strokeWidth="0.5" opacity="0.8"/>
              
              {/* Glowing lines on armor */}
              <line x1="25" y1="40" x2="25" y2="48" stroke="#00d9ff" strokeWidth="0.5" opacity="0.6" className="armor-line"/>
              <line x1="20" y1="38" x2="20" y2="45" stroke="#00d9ff" strokeWidth="0.3" opacity="0.4"/>
              <line x1="30" y1="38" x2="30" y2="45" stroke="#00d9ff" strokeWidth="0.3" opacity="0.4"/>
              
              {/* Shoulder pads */}
              <ellipse cx="14" cy="36" rx="4" ry="2" fill="#0f1822"/>
              <ellipse cx="14" cy="36" rx="3" ry="1.5" fill="none" stroke="#00d9ff" strokeWidth="0.4" opacity="0.5"/>
              <ellipse cx="36" cy="36" rx="4" ry="2" fill="#0f1822"/>
              <ellipse cx="36" cy="36" rx="3" ry="1.5" fill="none" stroke="#00d9ff" strokeWidth="0.4" opacity="0.5"/>
              
              {/* Belt */}
              <rect x="16" y="46" width="18" height="2" fill="#1a1209"/>
              <rect x="23" y="45.5" width="4" height="3" rx="0.5" fill="url(#guardGradient)" className="belt-buckle"/>
            </g>
            
            {/* Gradient definitions */}
            <defs>
              <linearGradient id="headbandGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00d9ff"/>
                <stop offset="50%" stopColor="#00ff94"/>
                <stop offset="100%" stopColor="#00d9ff"/>
              </linearGradient>
              <linearGradient id="bladeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#a8b5c4"/>
                <stop offset="30%" stopColor="#e8eef5"/>
                <stop offset="50%" stopColor="#ffffff"/>
                <stop offset="70%" stopColor="#e8eef5"/>
                <stop offset="100%" stopColor="#a8b5c4"/>
              </linearGradient>
              <linearGradient id="guardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffd700"/>
                <stop offset="50%" stopColor="#ffed4a"/>
                <stop offset="100%" stopColor="#b8860b"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      
      {/* Floating particles */}
      <div className="particle particle-1"></div>
      <div className="particle particle-2"></div>
      <div className="particle particle-3"></div>
      
      {/* Ninja stars */}
      <div className="ninja-star star-1">✦</div>
      <div className="ninja-star star-2">✦</div>
    </div>
  );
}

export default CodeAvatar;

