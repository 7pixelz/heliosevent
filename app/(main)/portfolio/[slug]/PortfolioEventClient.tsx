'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface MediaItem {
  id: string;
  type: string;
  url: string;
  displayOrder: number;
}

interface PortfolioEventDetail {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string;
  clientName: string | null;
  coverImageUrl: string | null;
  eventDate: string | null;
  media: MediaItem[];
}

const CAT_LABELS: Record<string, string> = {
  'corporate-events': 'Corporate Events',
  'employee-engagement': 'Employee Engagement',
  'seminars-conferences': 'Seminars & Conferences',
  'exhibitions': 'Exhibitions',
  'sports-events': 'Sports Events',
  'social-wedding': 'Social & Wedding Events',
};

function isYouTube(url: string) {
  return url.includes('youtube.com') || url.includes('youtu.be');
}

function getYouTubeId(url: string) {
  const match = url.match(/(?:youtu\.be\/|v=)([^&?/]+)/);
  return match ? match[1] : null;
}

function VideoPlayer({ url }: { url: string }) {
  if (isYouTube(url)) {
    const id = getYouTubeId(url);
    return (
      <iframe
        src={`https://www.youtube.com/embed/${id}`}
        style={{ width: '100%', height: '100%', border: 'none' }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }
  return (
    <video
      src={url}
      controls
      style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#000' }}
    />
  );
}

function Lightbox({
  items, index, onClose, onNav,
}: {
  items: MediaItem[];
  index: number;
  onClose: () => void;
  onNav: (i: number) => void;
}) {
  const item = items[index];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNav(Math.min(index + 1, items.length - 1));
      if (e.key === 'ArrowLeft') onNav(Math.max(index - 1, 0));
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [index, items.length, onClose, onNav]);

  if (!item) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.96)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 9999, padding: '20px',
      }}
    >
      {/* Prev */}
      {index > 0 && (
        <button
          onClick={e => { e.stopPropagation(); onNav(index - 1); }}
          style={{
            position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '50%', width: '48px', height: '48px', cursor: 'pointer',
            color: '#fff', fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >‹</button>
      )}
      {/* Next */}
      {index < items.length - 1 && (
        <button
          onClick={e => { e.stopPropagation(); onNav(index + 1); }}
          style={{
            position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '50%', width: '48px', height: '48px', cursor: 'pointer',
            color: '#fff', fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >›</button>
      )}
      {/* Close */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute', top: '20px', right: '20px',
          background: 'rgba(255,255,255,0.1)', border: 'none',
          borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer',
          color: '#fff', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >✕</button>

      {/* Counter */}
      <div style={{
        position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
        color: 'rgba(255,255,255,0.5)', fontSize: '13px', fontFamily: "'Inter', sans-serif",
      }}>
        {index + 1} / {items.length}
      </div>

      {/* Media */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: '90vw', maxHeight: '85vh',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {item.type === 'VIDEO' ? (
          <div style={{ width: 'min(900px, 90vw)', height: 'min(506px, 60vh)' }}>
            <VideoPlayer url={item.url} />
          </div>
        ) : (
          <img
            src={item.url}
            alt=""
            style={{
              maxWidth: '90vw', maxHeight: '85vh',
              objectFit: 'contain', borderRadius: '8px',
            }}
          />
        )}
      </div>
    </div>
  );
}

export default function PortfolioEventPage() {
  const { slug } = useParams<{ slug: string }>();
  const [event, setEvent] = useState<PortfolioEventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    fetch(`/api/portfolio/${slug}`)
      .then(r => { if (!r.ok) { setNotFound(true); setLoading(false); return null; } return r.json(); })
      .then(data => { if (data) { setEvent(data); setLoading(false); } });
  }, [slug]);

  const openLightbox = useCallback((i: number) => setLightboxIndex(i), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const navLightbox = useCallback((i: number) => setLightboxIndex(i), []);

  if (loading) return (
    <div style={{
      minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0d1117', color: 'rgba(255,255,255,0.35)',
      fontFamily: "'Inter', sans-serif",
    }}>
      Loading…
    </div>
  );

  if (notFound || !event) return (
    <div style={{
      minHeight: '60vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: '#0d1117', color: '#fff', fontFamily: "'Inter', sans-serif", gap: '16px',
    }}>
      <div style={{ fontSize: '18px' }}>Event not found.</div>
      <Link href="/portfolio" style={{ color: '#adc905', textDecoration: 'none' }}>
        ← Back to Portfolio
      </Link>
    </div>
  );

  const images = event.media.filter(m => m.type === 'IMAGE');
  const videos = event.media.filter(m => m.type === 'VIDEO');

  return (
    <>
      {/* ── Hero ── */}
      <section style={{
        minHeight: '480px', display: 'flex', alignItems: 'flex-end',
        position: 'relative', overflow: 'hidden',
        background: '#0d1117', paddingTop: '90px',
      }}>
        {event.coverImageUrl && (
          <>
            <img
              src={event.coverImageUrl}
              alt={event.title}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.2) 100%)',
            }} />
          </>
        )}

        <div style={{ position: 'relative', maxWidth: '1100px', margin: '0 auto', padding: '0 24px 56px', width: '100%' }}>
          <Link href="/portfolio" style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            color: 'rgba(255,255,255,0.45)', textDecoration: 'none',
            fontSize: '13px', fontFamily: "'Inter', sans-serif", marginBottom: '24px',
          }}>
            ← Portfolio
          </Link>

          {event.clientName && (
            <div style={{
              fontSize: '11px', fontWeight: 700, letterSpacing: '2px',
              textTransform: 'uppercase', color: '#adc905',
              fontFamily: "'Inter', sans-serif", marginBottom: '8px',
            }}>
              {event.clientName}
            </div>
          )}

          <h1 style={{
            fontSize: 'clamp(1.8rem, 4.5vw, 3rem)', fontWeight: 900,
            color: '#fff', margin: '0 0 16px', lineHeight: 1.15,
            fontFamily: "'Montserrat', sans-serif",
          }}>
            {event.title}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span style={{
              background: 'rgba(173,201,5,0.9)', borderRadius: '6px',
              padding: '4px 12px', fontSize: '11px', fontWeight: 700,
              letterSpacing: '1.5px', textTransform: 'uppercase',
              color: '#0d1117', fontFamily: "'Inter', sans-serif",
            }}>
              {CAT_LABELS[event.category] || event.category}
            </span>
            <span style={{
              color: 'rgba(255,255,255,0.4)', fontSize: '13px',
              fontFamily: "'Inter', sans-serif",
              display: 'flex', alignItems: 'center', gap: '5px',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              {images.length} photo{images.length !== 1 ? 's' : ''}
              {videos.length > 0 && ` · ${videos.length} video${videos.length !== 1 ? 's' : ''}`}
            </span>
          </div>
        </div>
      </section>

      {/* ── Description ── */}
      {event.description && (
        <section style={{ background: '#fff', padding: '56px 0' }}>
          <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 24px' }}>
            <div style={{
              width: '48px', height: '4px', borderRadius: '2px',
              background: 'linear-gradient(to right, #adc905, #d4f007)',
              marginBottom: '24px',
            }} />
            <p style={{
              fontSize: '17px', color: '#444', lineHeight: 1.9,
              fontFamily: "'Inter', sans-serif", margin: 0,
            }}>
              {event.description}
            </p>
          </div>
        </section>
      )}

      {/* ── Photo Gallery ── */}
      {images.length > 0 && (
        <section style={{ background: '#0d1117', padding: '72px 0' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
            <div style={{ marginBottom: '40px' }}>
              <div style={{
                fontSize: '11px', fontWeight: 700, letterSpacing: '3px',
                textTransform: 'uppercase', color: 'rgba(173,201,5,0.75)',
                marginBottom: '10px', fontFamily: "'Inter', sans-serif",
              }}>
                Gallery
              </div>
              <h2 style={{
                fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', fontWeight: 800,
                color: '#fff', margin: 0, fontFamily: "'Montserrat', sans-serif",
              }}>
                Event Photos
              </h2>
            </div>

            {/* Masonry-style CSS columns grid */}
            <div style={{
              columns: 'auto 280px',
              columnGap: '16px',
            }}>
              {images.map((img, i) => (
                <div
                  key={img.id}
                  onClick={() => openLightbox(i)}
                  style={{
                    marginBottom: '16px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    breakInside: 'avoid',
                    cursor: 'pointer',
                    position: 'relative',
                  }}
                  className="portfolio-img-wrap"
                >
                  <img
                    src={img.url}
                    alt={`${event.title} — photo ${i + 1}`}
                    style={{
                      width: '100%', display: 'block',
                      transition: 'transform 0.35s ease',
                    }}
                    className="portfolio-img"
                  />
                  {/* Hover overlay */}
                  <div
                    className="portfolio-img-overlay"
                    style={{
                      position: 'absolute', inset: 0,
                      background: 'rgba(0,0,0,0)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'background 0.25s',
                    }}
                  >
                    <svg
                      width="32" height="32" viewBox="0 0 24 24" fill="none"
                      stroke="white" strokeWidth="1.5" style={{ opacity: 0, transition: 'opacity 0.25s' }}
                      className="portfolio-zoom-icon"
                    >
                      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                      <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Videos ── */}
      {videos.length > 0 && (
        <section style={{ background: '#111420', padding: '72px 0' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
            <div style={{ marginBottom: '40px' }}>
              <div style={{
                fontSize: '11px', fontWeight: 700, letterSpacing: '3px',
                textTransform: 'uppercase', color: 'rgba(173,201,5,0.75)',
                marginBottom: '10px', fontFamily: "'Inter', sans-serif",
              }}>
                Videos
              </div>
              <h2 style={{
                fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', fontWeight: 800,
                color: '#fff', margin: 0, fontFamily: "'Montserrat', sans-serif",
              }}>
                Event Videos
              </h2>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '20px',
            }}>
              {videos.map((vid, i) => (
                <div
                  key={vid.id}
                  onClick={() => openLightbox(images.length + i)}
                  style={{
                    aspectRatio: '16/9',
                    borderRadius: '12px', overflow: 'hidden',
                    background: '#000', cursor: 'pointer', position: 'relative',
                  }}
                >
                  {isYouTube(vid.url) ? (
                    <img
                      src={`https://img.youtube.com/vi/${getYouTubeId(vid.url)}/hqdefault.jpg`}
                      alt="Video thumbnail"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <video src={vid.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  )}
                  {/* Play button */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'rgba(0,0,0,0.4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <div style={{
                      width: '56px', height: '56px', borderRadius: '50%',
                      background: 'rgba(255,255,255,0.9)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="#0d1117">
                        <polygon points="5 3 19 12 5 21 5 3"/>
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section style={{
        background: 'linear-gradient(135deg, #adc905 0%, #c8e606 100%)',
        padding: '72px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-60px', right: '-60px', width: '280px', height: '280px',
          borderRadius: '50%', background: 'rgba(255,255,255,0.08)', pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative' }}>
          <h2 style={{
            fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 900,
            color: '#0d1117', margin: '0 0 14px', fontFamily: "'Montserrat', sans-serif",
          }}>
            Want an event like this?
          </h2>
          <p style={{
            fontSize: '16px', color: 'rgba(0,0,0,0.55)',
            margin: '0 0 32px', fontFamily: "'Inter', sans-serif",
          }}>
            Tell us about your vision and let us make it happen.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/get-quote" style={{ textDecoration: 'none' }}>
              <button style={{
                padding: '15px 36px', background: '#0d1117', color: '#fff',
                border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 700,
                cursor: 'pointer', fontFamily: "'Inter', sans-serif",
              }}>
                Get a Custom Quote →
              </button>
            </Link>
            <Link href="/portfolio" style={{ textDecoration: 'none' }}>
              <button style={{
                padding: '15px 28px', background: 'transparent', color: '#0d1117',
                border: '2px solid rgba(0,0,0,0.25)', borderRadius: '8px',
                fontSize: '15px', fontWeight: 700,
                cursor: 'pointer', fontFamily: "'Inter', sans-serif",
              }}>
                View All Events
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          items={event.media}
          index={lightboxIndex}
          onClose={closeLightbox}
          onNav={navLightbox}
        />
      )}
    </>
  );
}
