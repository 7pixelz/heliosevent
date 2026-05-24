'use client';

import { useEffect, useState } from 'react';

interface HeroSlide {
  id: string;
  type: 'IMAGE' | 'VIDEO';
  mediaUrl: string;
  title: string | null;
  subtitle: string | null;
  ctaText: string | null;
  ctaLink: string | null;
}

const FALLBACK: HeroSlide[] = [
  { id: 'f1', type: 'IMAGE', mediaUrl: '/assets/banners/img1.jpg', title: null, subtitle: null, ctaText: null, ctaLink: null },
  { id: 'f2', type: 'IMAGE', mediaUrl: '/assets/banners/img2.jpg', title: null, subtitle: null, ctaText: null, ctaLink: null },
];

function parseTitle(title: string | null) {
  const parts = title ? title.split('|') : [];
  const whiteWords = (parts[0] || 'Creating Unforgettable').split(' ').filter(Boolean);
  const accentWords = (parts[1] || 'Event Experiences').split(' ').filter(Boolean);
  return { whiteWords, accentWords };
}

export default function Hero({ slides: propSlides }: { slides?: HeroSlide[] }) {
  const slides = propSlides && propSlides.length > 0 ? propSlides : FALLBACK;
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => setCurrent(c => (c + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [slides.length]);

  const { whiteWords, accentWords } = parseTitle(slides[current]?.title ?? null);

  return (
    <section className="hero" style={{ position: 'relative', overflow: 'hidden' }}>

      {/* ── Slides ── */}
      {slides.map((slide, i) => (
        <div key={slide.id} style={{ position: 'absolute', inset: 0, opacity: current === i ? 1 : 0, transition: 'opacity 1s ease', zIndex: 0 }}>
          {slide.type === 'VIDEO' ? (
            <video
              src={slide.mediaUrl}
              autoPlay muted loop playsInline
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          ) : (
            <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${slide.mediaUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
          )}
        </div>
      ))}

      {/* Overlay gradient */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.35) 100%)', zIndex: 1 }} />
      <div className="hero-overlay-gradient" style={{ zIndex: 2 }} />

      {/* ── Dot indicators ── */}
      {slides.length > 1 && (
        <div style={{ position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px', zIndex: 4 }}>
          {slides.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} style={{ width: current === i ? '24px' : '8px', height: '8px', borderRadius: '4px', background: current === i ? '#ff6a00' : 'rgba(255,255,255,0.5)', border: 'none', cursor: 'pointer', padding: 0, transition: 'all 0.3s' }} />
          ))}
        </div>
      )}

      {/* ── Content ── */}
      <div className="hero-content" style={{ position: 'relative', zIndex: 3 }}>
        <h1 className="hero-title">
          {whiteWords.map((w, i) => (
            <span key={`w${i}`} style={{ display: 'block' }}>{w}</span>
          ))}
          {accentWords.map((w, i) => (
            <span key={`a${i}`} className="g" style={{ display: 'block' }}>{w}</span>
          ))}
        </h1>

        {slides[current]?.subtitle && (
          <p style={{
            fontSize: 'clamp(15px, 1.6vw, 20px)',
            color: '#ffffff',
            fontFamily: "'Inter', sans-serif",
            fontWeight: 300,
            letterSpacing: '0.02em',
            lineHeight: 1.5,
            marginBottom: '32px',
            maxWidth: '560px',
            borderLeft: '3px solid #ff6a00',
            paddingLeft: '14px',
          }}>
            {slides[current].subtitle}
          </p>
        )}

        <div className="hero-cta-row">
          <a
            href={slides[current]?.ctaLink || '/get-quote'}
            className="hero-btn"
            style={{ textDecoration: 'none' }}
          >
            {slides[current]?.ctaText || 'Plan Your Event'}
          </a>
          <a href="/portfolio" className="hero-btn-ghost" style={{ textDecoration: 'none' }}>View Portfolio</a>
        </div>
      </div>

    </section>
  );
}
