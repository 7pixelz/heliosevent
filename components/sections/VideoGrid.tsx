'use client';

import { useState } from 'react';

interface Video {
  id: string;
  youtubeId: string;
  title: string;
}

interface Props {
  videos: Video[];
  heading?: string;
}

export default function VideoGrid({ videos, heading = 'Our Videos' }: Props) {
  const [playing, setPlaying] = useState<string | null>(null);

  if (videos.length === 0) return null;

  return (
    <section style={{ padding: '60px 0', background: '#0f0f0f' }}>
      <style>{`
        .vg-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
        @media (min-width: 768px) { .vg-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (min-width: 1100px) { .vg-grid { grid-template-columns: repeat(4, 1fr); } }
        .vg-thumb { position: relative; aspect-ratio: 16/9; overflow: hidden; border-radius: 12px; cursor: pointer; background: #1a1a1a; }
        .vg-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.3s; }
        .vg-thumb:hover img { transform: scale(1.04); }
        .vg-play { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.3); transition: background 0.2s; }
        .vg-thumb:hover .vg-play { background: rgba(0,0,0,0.5); }
        .vg-play-btn { width: 52px; height: 52px; background: rgba(173,201,5,0.9); border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: transform 0.2s, background 0.2s; }
        .vg-thumb:hover .vg-play-btn { transform: scale(1.1); background: #adc905; }
        .vg-title { font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.75); margin-top: 10px; line-height: 1.4; font-family: 'Inter', sans-serif; }
        .vg-modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.88); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .vg-modal-inner { width: 100%; max-width: 900px; }
        .vg-iframe-wrap { position: relative; aspect-ratio: 16/9; border-radius: 12px; overflow: hidden; background: #000; }
        .vg-iframe-wrap iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: none; }
        .vg-modal-close { position: absolute; top: -44px; right: 0; background: none; border: none; color: #fff; font-size: 28px; cursor: pointer; line-height: 1; }
      `}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '32px', fontWeight: 800, color: '#fff', marginBottom: '8px', fontFamily: "'Inter', sans-serif" }}>
          {heading}
        </h2>
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.45)', fontSize: '15px', marginBottom: '40px', fontFamily: "'Inter', sans-serif" }}>
          Watch us in action
        </p>

        <div className="vg-grid">
          {videos.map(v => (
            <div key={v.id}>
              <div className="vg-thumb" onClick={() => setPlaying(v.youtubeId)}>
                <img
                  src={`https://img.youtube.com/vi/${v.youtubeId}/mqdefault.jpg`}
                  alt={v.title}
                  loading="lazy"
                />
                <div className="vg-play">
                  <div className="vg-play-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#000"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                  </div>
                </div>
              </div>
              <div className="vg-title">{v.title}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {playing && (
        <div className="vg-modal-backdrop" onClick={() => setPlaying(null)}>
          <div className="vg-modal-inner" onClick={e => e.stopPropagation()}>
            <div style={{ position: 'relative' }}>
              <button className="vg-modal-close" onClick={() => setPlaying(null)}>✕</button>
              <div className="vg-iframe-wrap">
                <iframe
                  src={`https://www.youtube.com/embed/${playing}?autoplay=1&rel=0`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
