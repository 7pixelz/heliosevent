'use client';

import { useEffect, useState } from 'react';

const SEEN_KEY = 'helios_intro_seen_v2';

export default function IntroAnimation() {
  const [phase, setPhase] = useState<'visible' | 'fadeout' | 'done'>('done');

  useEffect(() => {
    if (navigator.webdriver || /HeadlessChrome|HeadlessChromium/i.test(navigator.userAgent)) return;
    if (sessionStorage.getItem(SEEN_KEY)) return;
    sessionStorage.setItem(SEEN_KEY, '1');
    setPhase('visible');

    // Timeline:
    // 0.3s  → symbol fades in (0.8s)
    // 1.2s  → glow flash peaks (0.9s)
    // 2.1s  → symbol fades out (0.5s)
    // 2.5s  → full logo fades in (0.8s)
    // 3.2s  → tagline rises up (0.6s)
    // 4.6s  → overlay begins fade-out
    // 5.4s  → removed from DOM
    const fadeTimer = setTimeout(() => setPhase('fadeout'), 4600);
    const doneTimer = setTimeout(() => setPhase('done'), 5400);
    return () => { clearTimeout(fadeTimer); clearTimeout(doneTimer); };
  }, []);

  if (phase === 'done') return null;

  function skip() {
    setPhase('fadeout');
    setTimeout(() => setPhase('done'), 800);
  }

  return (
    <>
      <style>{`
        @keyframes hel-sym-in {
          from { opacity: 0; transform: scale(0.82); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes hel-sym-glow {
          0%   { filter: brightness(0.7) drop-shadow(0 0   0px rgba(180,230,0,0)); }
          50%  { filter: brightness(4)   drop-shadow(0 0  70px rgba(190,240,0,0.95)) drop-shadow(0 0 120px rgba(190,240,0,0.4)); }
          100% { filter: brightness(0.7) drop-shadow(0 0   0px rgba(180,230,0,0)); }
        }
        @keyframes hel-sym-out {
          from { opacity: 1; transform: scale(1); }
          to   { opacity: 0; transform: scale(1.08); }
        }
        @keyframes hel-logo-in {
          from { opacity: 0; transform: scale(0.9); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes hel-tag-in {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes hel-overlay-out {
          from { opacity: 1; }
          to   { opacity: 0; }
        }
        @keyframes hel-skip-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .hel-overlay {
          position: fixed; inset: 0; z-index: 9999;
          background: #000;
          display: flex; align-items: center; justify-content: center;
          flex-direction: column;
          animation: ${phase === 'fadeout' ? 'hel-overlay-out 0.8s ease forwards' : 'none'};
        }
        .hel-center {
          position: relative;
          display: flex; align-items: center; justify-content: center;
        }
        .hel-symbol {
          position: absolute;
          animation:
            hel-sym-in  0.8s ease          0.3s both,
            hel-sym-glow 0.9s ease         1.2s both,
            hel-sym-out  0.45s ease        2.1s forwards;
        }
        .hel-logo {
          animation: hel-logo-in 0.8s cubic-bezier(0.22,1,0.36,1) 2.5s both;
        }
        .hel-tagline {
          animation: hel-tag-in 0.65s cubic-bezier(0.22,1,0.36,1) 3.15s both;
          margin-top: 22px;
          font-family: 'Poppins', sans-serif;
          font-size: clamp(14px, 2.5vw, 22px);
          font-weight: 300;
          letter-spacing: 7px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.85);
        }
        .hel-skip {
          position: fixed; bottom: 32px; right: 32px;
          padding: 8px 18px; border: 1px solid rgba(255,255,255,0.18);
          border-radius: 999px; background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.45); font-size: 12px; font-weight: 600;
          font-family: 'Inter', sans-serif; letter-spacing: 1px;
          cursor: pointer; transition: all 0.2s;
          animation: hel-skip-in 0.4s ease 1.8s both;
        }
        .hel-skip:hover { border-color: rgba(255,255,255,0.4); color: rgba(255,255,255,0.8); }
      `}</style>

      <div className="hel-overlay" onClick={skip}>
        {/* Symbol + Logo share the same center point */}
        <div className="hel-center">
          <img
            src="/assets/helios_intro_new.webp"
            alt=""
            className="hel-symbol"
            style={{ height: 'clamp(100px, 16vw, 160px)', width: 'auto' }}
          />
          <img
            src="/assets/heliosevent_logo_white.webp"
            alt="Helios Event Productions"
            className="hel-logo"
            style={{ height: 'clamp(90px, 15vw, 160px)', width: 'auto', display: 'block' }}
          />
        </div>

        <div className="hel-tagline">Create Experiences.</div>

        <button
          className="hel-skip"
          onClick={e => { e.stopPropagation(); skip(); }}
        >
          Skip ›
        </button>
      </div>
    </>
  );
}
