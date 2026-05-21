'use client';

import { useState } from 'react';

const photos = ['team1.jpeg', 'team2.jpeg', 'team3.jpeg'];

export default function TeamGallery() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <>
      <style>{`
        .team-card { cursor: zoom-in; }
        .team-card img { transition: transform 0.4s ease; }
        .team-card:hover img { transform: scale(1.05); }
        .team-lightbox {
          position: fixed; inset: 0; z-index: 9999;
          background: rgba(0,0,0,0.92);
          display: flex; align-items: center; justify-content: center;
          padding: 24px;
          animation: lb-in 0.2s ease;
        }
        @keyframes lb-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .team-lightbox img {
          max-width: 100%; max-height: 90vh;
          border-radius: 16px;
          box-shadow: 0 24px 80px rgba(0,0,0,0.8);
          animation: lb-img-in 0.25s cubic-bezier(0.22,1,0.36,1);
        }
        @keyframes lb-img-in {
          from { transform: scale(0.92); opacity: 0; }
          to   { transform: scale(1);    opacity: 1; }
        }
        .team-lb-close {
          position: fixed; top: 20px; right: 24px;
          width: 44px; height: 44px; border-radius: 50%;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          color: #fff; font-size: 22px; line-height: 1;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: background 0.2s;
        }
        .team-lb-close:hover { background: rgba(255,255,255,0.2); }
      `}</style>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        {photos.map((file, i) => (
          <div
            key={i}
            className="team-card"
            style={{ borderRadius: '20px', overflow: 'hidden', aspectRatio: '4/3', position: 'relative', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
            onClick={() => setActive(`/assets/teams/${file}`)}
          >
            <img
              src={`/assets/teams/${file}`}
              alt="Helios Event Team"
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26,31,46,0.5) 0%, transparent 50%)' }} />
            {/* Zoom hint */}
            <div style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(0,0,0,0.5)', borderRadius: '8px', padding: '5px 8px', color: '#fff', fontSize: '11px', fontFamily: "'Inter',sans-serif", display: 'flex', alignItems: 'center', gap: '4px' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
              Zoom
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {active && (
        <div className="team-lightbox" onClick={() => setActive(null)}>
          <button className="team-lb-close" onClick={() => setActive(null)}>✕</button>
          <img src={active} alt="Team" onClick={e => e.stopPropagation()} />
        </div>
      )}
    </>
  );
}
