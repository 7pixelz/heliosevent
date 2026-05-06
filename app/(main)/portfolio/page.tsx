'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface PortfolioEvent {
  id: string;
  title: string;
  slug: string;
  category: string;
  clientName: string | null;
  coverImageUrl: string | null;
  description: string | null;
  _count: { media: number };
}

const CATEGORIES = [
  { slug: 'all', label: 'All' },
  { slug: 'corporate-events', label: 'Corporate Events' },
  { slug: 'employee-engagement', label: 'Employee Engagement' },
  { slug: 'seminars-conferences', label: 'Seminars & Conferences' },
  { slug: 'exhibitions', label: 'Exhibitions' },
  { slug: 'sports-events', label: 'Sports Events' },
  { slug: 'social-wedding', label: 'Social & Wedding Events' },
];

const CAT_LABELS: Record<string, string> = Object.fromEntries(
  CATEGORIES.filter(c => c.slug !== 'all').map(c => [c.slug, c.label])
);

export default function PortfolioPage() {
  const [events, setEvents] = useState<PortfolioEvent[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/portfolio')
      .then(r => r.json())
      .then(data => { setEvents(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = activeTab === 'all' ? events : events.filter(e => e.category === activeTab);

  return (
    <>
      {/* ── Hero ── */}
      <section style={{
        background: 'linear-gradient(135deg, #0d1117 0%, #1a1f2e 60%, #0d1117 100%)',
        paddingTop: '140px', paddingBottom: '80px',
        textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(173,201,5,0.08) 0%, transparent 70%)',
        }} />
        <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{
            fontSize: '11px', fontWeight: 700, letterSpacing: '3px',
            textTransform: 'uppercase', color: 'rgba(173,201,5,0.8)',
            marginBottom: '16px', fontFamily: "'Inter', sans-serif",
          }}>
            Our Work
          </div>
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900,
            color: '#fff', margin: '0 0 20px', lineHeight: 1.1,
            fontFamily: "'Montserrat', sans-serif",
          }}>
            Portfolio
          </h1>
          <p style={{
            fontSize: '17px', color: 'rgba(255,255,255,0.55)',
            margin: 0, lineHeight: 1.7, fontFamily: "'Inter', sans-serif",
          }}>
            20+ years of unforgettable events — browse our work across corporate gatherings, exhibitions, weddings, and more.
          </p>
        </div>
      </section>

      {/* ── Filter Tabs ── */}
      <div style={{
        position: 'sticky', top: '72px', zIndex: 40,
        background: '#0d1117',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{
          maxWidth: '1200px', margin: '0 auto', padding: '0 24px',
          display: 'flex', gap: '0', overflowX: 'auto',
        }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.slug}
              onClick={() => setActiveTab(cat.slug)}
              style={{
                flexShrink: 0,
                padding: '16px 20px',
                background: 'transparent', border: 'none', cursor: 'pointer',
                fontSize: '13px', fontWeight: 600, fontFamily: "'Inter', sans-serif",
                color: activeTab === cat.slug ? '#adc905' : 'rgba(255,255,255,0.45)',
                borderBottom: `2px solid ${activeTab === cat.slug ? '#adc905' : 'transparent'}`,
                transition: 'color 0.2s, border-color 0.2s',
                whiteSpace: 'nowrap',
              }}
            >
              {cat.label}
              {cat.slug !== 'all' && (
                <span style={{
                  marginLeft: '6px', fontSize: '11px',
                  color: activeTab === cat.slug ? 'rgba(173,201,5,0.7)' : 'rgba(255,255,255,0.25)',
                }}>
                  ({events.filter(e => e.category === cat.slug).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Events Grid ── */}
      <section style={{ background: '#0d1117', padding: '60px 0 100px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          {loading ? (
            <div style={{
              minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'rgba(255,255,255,0.3)', fontFamily: "'Inter', sans-serif", fontSize: '15px',
            }}>
              Loading…
            </div>
          ) : filtered.length === 0 ? (
            <div style={{
              minHeight: '300px', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: '12px',
              color: 'rgba(255,255,255,0.3)', fontFamily: "'Inter', sans-serif",
            }}>
              <div style={{ fontSize: '40px' }}>📂</div>
              <div>No events in this category yet.</div>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '24px',
            }}>
              {filtered.map(ev => (
                <Link key={ev.id} href={`/portfolio/${ev.slug}`} style={{ textDecoration: 'none' }}>
                  <div
                    onMouseEnter={() => setHovered(ev.id)}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                      position: 'relative',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      aspectRatio: '4/3',
                      background: '#1a1f2e',
                      cursor: 'pointer',
                      transform: hovered === ev.id ? 'translateY(-4px)' : 'translateY(0)',
                      transition: 'transform 0.28s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.28s ease',
                      boxShadow: hovered === ev.id
                        ? '0 20px 60px rgba(0,0,0,0.5)'
                        : '0 4px 20px rgba(0,0,0,0.3)',
                    }}
                  >
                    {/* Cover image */}
                    {ev.coverImageUrl ? (
                      <img
                        src={ev.coverImageUrl}
                        alt={ev.title}
                        style={{
                          position: 'absolute', inset: 0,
                          width: '100%', height: '100%', objectFit: 'cover',
                          transform: hovered === ev.id ? 'scale(1.05)' : 'scale(1)',
                          transition: 'transform 0.5s ease',
                        }}
                      />
                    ) : (
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(135deg, #1a1f2e, #2a3040)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '48px',
                      }}>
                        📷
                      </div>
                    )}

                    {/* Gradient overlay */}
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.05) 100%)',
                    }} />

                    {/* Category badge — top left */}
                    <div style={{
                      position: 'absolute', top: '16px', left: '16px',
                      background: 'rgba(173,201,5,0.9)',
                      borderRadius: '6px', padding: '4px 10px',
                      fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px',
                      textTransform: 'uppercase', color: '#0d1117',
                      fontFamily: "'Inter', sans-serif",
                    }}>
                      {CAT_LABELS[ev.category] || ev.category}
                    </div>

                    {/* Photo count — top right */}
                    <div style={{
                      position: 'absolute', top: '16px', right: '16px',
                      background: 'rgba(0,0,0,0.55)',
                      borderRadius: '6px', padding: '4px 10px',
                      fontSize: '11px', fontWeight: 600,
                      color: 'rgba(255,255,255,0.85)',
                      fontFamily: "'Inter', sans-serif",
                      backdropFilter: 'blur(4px)',
                      display: 'flex', alignItems: 'center', gap: '5px',
                    }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                      </svg>
                      {ev._count.media}
                    </div>

                    {/* Bottom info */}
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0,
                      padding: '20px 20px 20px',
                    }}>
                      {ev.clientName && (
                        <div style={{
                          fontSize: '11px', fontWeight: 600, letterSpacing: '1px',
                          textTransform: 'uppercase', color: 'rgba(173,201,5,0.85)',
                          fontFamily: "'Inter', sans-serif", marginBottom: '4px',
                        }}>
                          {ev.clientName}
                        </div>
                      )}
                      <h3 style={{
                        margin: '0 0 6px',
                        fontSize: '18px', fontWeight: 800, color: '#fff',
                        fontFamily: "'Montserrat', sans-serif", lineHeight: 1.2,
                      }}>
                        {ev.title}
                      </h3>
                      {ev.description && (
                        <p style={{
                          margin: 0,
                          fontSize: '12px', color: 'rgba(255,255,255,0.55)',
                          fontFamily: "'Inter', sans-serif", lineHeight: 1.5,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}>
                          {ev.description}
                        </p>
                      )}
                      {/* Arrow on hover */}
                      <div style={{
                        marginTop: '10px',
                        fontSize: '12px', fontWeight: 700,
                        color: '#adc905', fontFamily: "'Inter', sans-serif",
                        opacity: hovered === ev.id ? 1 : 0,
                        transform: hovered === ev.id ? 'translateX(0)' : 'translateX(-8px)',
                        transition: 'opacity 0.2s, transform 0.2s',
                      }}>
                        View Event →
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

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
            Ready to be our next success story?
          </h2>
          <p style={{
            fontSize: '16px', color: 'rgba(0,0,0,0.55)',
            margin: '0 0 32px', fontFamily: "'Inter', sans-serif",
          }}>
            Join hundreds of brands who trust Helios Event for unforgettable experiences.
          </p>
          <Link href="/get-quote" style={{ textDecoration: 'none' }}>
            <button style={{
              padding: '15px 40px', background: '#0d1117', color: '#fff',
              border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 700,
              cursor: 'pointer', fontFamily: "'Inter', sans-serif",
            }}>
              Plan Your Event →
            </button>
          </Link>
        </div>
      </section>
    </>
  );
}
