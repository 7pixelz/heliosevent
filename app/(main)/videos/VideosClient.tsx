'use client';

import { useState } from 'react';

interface Video {
  id: string;
  youtubeId: string;
  title: string;
  serviceSlug: string | null;
  serviceName?: string;
}

interface Props {
  videos: Video[];
  categories: { slug: string; name: string }[];
}

export default function VideosClient({ videos, categories }: Props) {
  const [activeSlug, setActiveSlug] = useState<string>('all');
  const [playing, setPlaying] = useState<string | null>(null);

  const filtered = activeSlug === 'all' ? videos : videos.filter(v => v.serviceSlug === activeSlug);

  return (
    <>
      <style>{`
        .vp-tab { padding: 9px 20px; border-radius: 100px; font-size: 13px; font-weight: 600; cursor: pointer; border: 1px solid rgba(255,255,255,0.12); background: transparent; color: rgba(255,255,255,0.55); font-family: 'Inter', sans-serif; transition: all 0.2s; white-space: nowrap; }
        .vp-tab:hover { border-color: #adc905; color: #adc905; }
        .vp-tab.active { background: #adc905; border-color: #adc905; color: #000; }
        .vp-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
        @media (min-width: 768px) { .vp-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (min-width: 1100px) { .vp-grid { grid-template-columns: repeat(4, 1fr); } }
        .vp-thumb { position: relative; aspect-ratio: 16/9; overflow: hidden; border-radius: 12px; cursor: pointer; background: #1a1a1a; }
        .vp-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.3s; }
        .vp-thumb:hover img { transform: scale(1.04); }
        .vp-play { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.3); transition: background 0.2s; }
        .vp-thumb:hover .vp-play { background: rgba(0,0,0,0.5); }
        .vp-play-btn { width: 52px; height: 52px; background: rgba(173,201,5,0.9); border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: transform 0.2s, background 0.2s; }
        .vp-thumb:hover .vp-play-btn { transform: scale(1.1); background: #adc905; }
        .vp-modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.88); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .vp-modal-inner { width: 100%; max-width: 900px; }
        .vp-iframe-wrap { position: relative; aspect-ratio: 16/9; border-radius: 12px; overflow: hidden; background: #000; }
        .vp-iframe-wrap iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: none; }
        .vp-modal-close { position: absolute; top: -44px; right: 0; background: none; border: none; color: #fff; font-size: 28px; cursor: pointer; line-height: 1; }
      `}</style>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '40px' }}>
        <button className={`vp-tab${activeSlug === 'all' ? ' active' : ''}`} onClick={() => setActiveSlug('all')}>
          All ({videos.length})
        </button>
        {categories.map(c => {
          const count = videos.filter(v => v.serviceSlug === c.slug).length;
          if (count === 0) return null;
          return (
            <button key={c.slug} className={`vp-tab${activeSlug === c.slug ? ' active' : ''}`} onClick={() => setActiveSlug(c.slug)}>
              {c.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'rgba(255,255,255,0.35)', fontSize: '15px', fontFamily: "'Inter', sans-serif" }}>
          No videos in this category yet.
        </div>
      ) : (
        <div className="vp-grid">
          {filtered.map(v => (
            <div key={v.id}>
              <div className="vp-thumb" onClick={() => setPlaying(v.youtubeId)}>
                <img
                  src={`https://img.youtube.com/vi/${v.youtubeId}/mqdefault.jpg`}
                  alt={v.title}
                  loading="lazy"
                />
                <div className="vp-play">
                  <div className="vp-play-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#000"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                  </div>
                </div>
              </div>
              <div style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.75)', marginTop: '10px', lineHeight: 1.4, fontFamily: "'Inter', sans-serif" }}>
                {v.title}
              </div>
              {v.serviceName && (
                <div style={{ fontSize: '11px', color: '#adc905', marginTop: '4px', fontFamily: "'Inter', sans-serif" }}>{v.serviceName}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {playing && (
        <div className="vp-modal-backdrop" onClick={() => setPlaying(null)}>
          <div className="vp-modal-inner" onClick={e => e.stopPropagation()}>
            <div style={{ position: 'relative' }}>
              <button className="vp-modal-close" onClick={() => setPlaying(null)}>✕</button>
              <div className="vp-iframe-wrap">
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
    </>
  );
}
