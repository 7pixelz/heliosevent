'use client';

import { useEffect, useState } from 'react';

const SEEN_KEY = 'helios_intro_seen';

export default function IntroAnimation() {
  const [phase, setPhase] = useState<'visible' | 'fadeout' | 'done'>('visible');

  useEffect(() => {
    if (sessionStorage.getItem(SEEN_KEY)) {
      setPhase('done');
      return;
    }
    sessionStorage.setItem(SEEN_KEY, '1');

    // Timeline:
    // 0.0s → logo fades in (CSS handles via animation-delay)
    // 1.4s → begin fade-out of overlay
    // 2.2s → remove from DOM
    const fadeTimer = setTimeout(() => setPhase('fadeout'), 2600);
    const doneTimer = setTimeout(() => setPhase('done'), 3400);
    return () => { clearTimeout(fadeTimer); clearTimeout(doneTimer); };
  }, []);

  if (phase === 'done') return null;

  return (
    <>
      <style>{`
        @keyframes hel-logo-in {
          0%   { opacity: 0; transform: scale(0.88); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes hel-flash {
          0%   { filter: brightness(1) drop-shadow(0 0 0px rgba(255,180,80,0)); }
          45%  { filter: brightness(2.8) drop-shadow(0 0 40px rgba(255,180,80,0.9)); }
          100% { filter: brightness(1) drop-shadow(0 0 0px rgba(255,180,80,0)); }
        }
        @keyframes hel-tag-in {
          0%   { opacity: 0; transform: translateY(14px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes hel-overlay-out {
          0%   { opacity: 1; }
          100% { opacity: 0; }
        }
        .hel-overlay {
          position: fixed; inset: 0; z-index: 9999;
          background: #000;
          display: flex; align-items: center; justify-content: center;
          flex-direction: column;
          animation: ${phase === 'fadeout' ? 'hel-overlay-out 0.8s ease forwards' : 'none'};
        }
        .hel-logo-wrap {
          position: relative;
          animation: hel-logo-in 0.7s cubic-bezier(0.22,1,0.36,1) 0.3s both;
        }
        .hel-logo-wrap img {
          animation: hel-flash 0.7s ease 1.05s both;
        }
        .hel-tagline {
          animation: hel-tag-in 0.6s cubic-bezier(0.22,1,0.36,1) 1.35s both;
          margin-top: 20px;
          font-family: 'Poppins', sans-serif;
          font-size: clamp(18px, 3vw, 28px);
          font-weight: 300;
          letter-spacing: 6px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.9);
        }
        .hel-skip {
          position: fixed; bottom: 32px; right: 32px;
          padding: 8px 18px; border: 1px solid rgba(255,255,255,0.2);
          border-radius: 999px; background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.5); font-size: 12px; font-weight: 600;
          font-family: 'Inter', sans-serif; letter-spacing: 1px;
          cursor: pointer; transition: all 0.2s;
          animation: hel-tag-in 0.4s ease 1.5s both;
        }
        .hel-skip:hover { border-color: rgba(255,255,255,0.4); color: rgba(255,255,255,0.8); }
      `}</style>

      <div className="hel-overlay" onClick={() => { setPhase('fadeout'); setTimeout(() => setPhase('done'), 800); }}>
        <div className="hel-logo-wrap">
          <img
            src="/assets/heliosevent_logo_white.webp"
            alt="Helios Event Productions"
            style={{ height: 'clamp(90px, 15vw, 160px)', width: 'auto', display: 'block' }}
          />
        </div>
        <div className="hel-tagline">
          Create Experiences.
        </div>
        <button
          className="hel-skip"
          onClick={e => { e.stopPropagation(); setPhase('fadeout'); setTimeout(() => setPhase('done'), 800); }}
        >
          Skip ›
        </button>
      </div>
    </>
  );
}
