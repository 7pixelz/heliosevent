'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface SignatureEvent { icon: string; title: string; desc: string }
interface Differentiator { title: string; desc: string }
interface FAQ { question: string; answer: string }

interface ServiceDetail {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  heroHeadline: string | null;
  heroSubtitle: string | null;
  whatWeDo: string | null;
  signatureEvents: string | null;
  differentiators: string | null;
  faqs: string | null;
  coverImageUrl: string | null;
  type: string;
}

function parseJSON<T>(val: string | null | undefined, fallback: T): T {
  if (!val) return fallback;
  try { return JSON.parse(val) as T; } catch { return fallback; }
}

function FAQAccordion({ faqs }: { faqs: FAQ[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {faqs.map((faq, i) => (
        <div key={i} style={{
          background: '#fff',
          border: `1px solid ${open === i ? '#adc905' : '#e5e7eb'}`,
          borderRadius: '12px', overflow: 'hidden',
          transition: 'border-color 0.2s',
          boxShadow: open === i ? '0 4px 20px rgba(173,201,5,0.1)' : '0 1px 4px rgba(0,0,0,0.04)',
        }}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', padding: '20px 24px',
              background: 'transparent', border: 'none', cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <span style={{
              fontSize: '15px', fontWeight: 600, color: '#111',
              fontFamily: "'Montserrat', sans-serif", paddingRight: '24px',
            }}>
              {faq.question}
            </span>
            <span style={{
              flexShrink: 0, width: '28px', height: '28px', borderRadius: '50%',
              background: open === i ? '#adc905' : '#f3f4f6',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '18px', color: open === i ? '#fff' : '#555',
              transition: 'all 0.2s', fontWeight: 700, lineHeight: 1,
            }}>
              {open === i ? '−' : '+'}
            </span>
          </button>
          {open === i && (
            <div style={{
              padding: '0 24px 20px',
              fontSize: '14px', color: '#555',
              lineHeight: 1.8, fontFamily: "'Inter', sans-serif",
            }}>
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [service, setService] = useState<ServiceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/services/${slug}`)
      .then(r => { if (!r.ok) { setNotFound(true); setLoading(false); return null; } return r.json(); })
      .then(data => { if (data) { setService(data); setLoading(false); } });
  }, [slug]);

  if (loading) return (
    <div style={{
      minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0d1117', color: 'rgba(255,255,255,0.4)',
      fontFamily: "'Inter', sans-serif", fontSize: '15px',
    }}>
      Loading…
    </div>
  );

  if (notFound || !service) return (
    <div style={{
      minHeight: '60vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: '#0d1117', color: '#fff', fontFamily: "'Inter', sans-serif",
      gap: '16px',
    }}>
      <div style={{ fontSize: '18px' }}>Service not found.</div>
      <Link href="/services" style={{ color: '#adc905', textDecoration: 'none', fontSize: '14px' }}>
        ← Back to Services
      </Link>
    </div>
  );

  const sigEvents = parseJSON<SignatureEvent[]>(service.signatureEvents, []);
  const diffs = parseJSON<Differentiator[]>(service.differentiators, []);
  const faqs = parseJSON<FAQ[]>(service.faqs, []);
  const headline = service.heroHeadline || service.name;

  return (
    <>
      {/* ── HERO — Dark with image overlay ── */}
      <section style={{
        minHeight: '560px',
        display: 'flex', alignItems: 'center',
        position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(135deg, #0d1117 0%, #1a2030 100%)',
        paddingTop: '90px',
      }}>
        {service.coverImageUrl && (
          <>
            <img
              src={service.coverImageUrl}
              alt={service.name}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to right, rgba(13,17,23,0.95) 40%, rgba(13,17,23,0.65) 100%)',
            }} />
          </>
        )}
        {/* Decorative radial glow */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 60% 80% at 15% 60%, rgba(173,201,5,0.12) 0%, transparent 65%)',
        }} />

        <div style={{ position: 'relative', maxWidth: '1100px', margin: '0 auto', padding: '80px 24px', width: '100%' }}>
          {/* Breadcrumb */}
          <Link href="/services" style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            color: 'rgba(255,255,255,0.45)', textDecoration: 'none',
            fontSize: '13px', fontFamily: "'Inter', sans-serif", marginBottom: '28px',
            letterSpacing: '0.3px',
          }}>
            ← All Services
          </Link>

          <div style={{ maxWidth: '700px' }}>
            {/* Badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              background: 'rgba(173,201,5,0.12)', border: '1px solid rgba(173,201,5,0.3)',
              borderRadius: '100px', padding: '7px 18px', marginBottom: '24px',
            }}>
              <span style={{ fontSize: '20px' }}>{service.icon}</span>
              <span style={{
                fontSize: '11px', fontWeight: 700, letterSpacing: '2px',
                textTransform: 'uppercase', color: '#adc905',
                fontFamily: "'Inter', sans-serif",
              }}>
                {service.type === 'ACTIVITY' ? 'Activity' : 'Service'}
              </span>
            </div>

            <h1 style={{
              fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 900,
              color: '#fff', margin: '0 0 20px', lineHeight: 1.12,
              fontFamily: "'Montserrat', sans-serif",
            }}>
              {headline}
            </h1>

            {service.heroSubtitle && (
              <p style={{
                fontSize: '17px', color: 'rgba(255,255,255,0.62)',
                margin: '0 0 36px', lineHeight: 1.75,
                fontFamily: "'Inter', sans-serif",
                borderLeft: '3px solid #adc905', paddingLeft: '18px',
              }}>
                {service.heroSubtitle}
              </p>
            )}

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link href="/get-quote" style={{ textDecoration: 'none' }}>
                <button style={{
                  padding: '14px 32px', background: '#adc905', color: '#0d1117',
                  border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 700,
                  cursor: 'pointer', fontFamily: "'Inter', sans-serif", letterSpacing: '0.5px',
                }}>
                  Get a Quote →
                </button>
              </Link>
              <Link href="/contact" style={{ textDecoration: 'none' }}>
                <button style={{
                  padding: '14px 28px', background: 'transparent', color: 'rgba(255,255,255,0.75)',
                  border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px',
                  fontSize: '14px', fontWeight: 600,
                  cursor: 'pointer', fontFamily: "'Inter', sans-serif",
                }}>
                  Talk to Us
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT WE DO — Light ── */}
      {service.whatWeDo && (
        <section style={{ background: '#fff', padding: '96px 0' }}>
          <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0', alignItems: 'flex-start' }}>
              <div style={{
                fontSize: '11px', fontWeight: 700, letterSpacing: '3px',
                textTransform: 'uppercase', color: '#adc905',
                marginBottom: '10px', fontFamily: "'Inter', sans-serif",
              }}>
                What We Do
              </div>
              <h2 style={{
                fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 800,
                color: '#111', margin: '0 0 28px', fontFamily: "'Montserrat', sans-serif",
              }}>
                About {service.name}
              </h2>
              <div style={{
                width: '60px', height: '4px', borderRadius: '2px',
                background: 'linear-gradient(to right, #adc905, #d4f007)',
                marginBottom: '32px',
              }} />
              <div style={{
                fontSize: '16px', color: '#444',
                lineHeight: 1.9, fontFamily: "'Inter', sans-serif",
                whiteSpace: 'pre-wrap', maxWidth: '820px',
              }}>
                {service.whatWeDo}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── SIGNATURE EVENTS — Dark ── */}
      {sigEvents.length > 0 && (
        <section style={{ background: '#0d1117', padding: '96px 0' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
              <div style={{
                fontSize: '11px', fontWeight: 700, letterSpacing: '3px',
                textTransform: 'uppercase', color: 'rgba(173,201,5,0.75)',
                marginBottom: '12px', fontFamily: "'Inter', sans-serif",
              }}>
                What&apos;s Included
              </div>
              <h2 style={{
                fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 800,
                color: '#fff', margin: '0 0 16px', fontFamily: "'Montserrat', sans-serif",
              }}>
                Signature Events &amp; Specialties
              </h2>
              <p style={{
                fontSize: '15px', color: 'rgba(255,255,255,0.45)',
                margin: 0, fontFamily: "'Inter', sans-serif",
                maxWidth: '560px', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.7,
              }}>
                A curated portfolio of formats we execute under {service.name}.
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '20px',
            }}>
              {sigEvents.map((ev, i) => (
                <div key={i} style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '16px', padding: '32px 28px',
                  position: 'relative', overflow: 'hidden',
                }}>
                  {/* Subtle number watermark */}
                  <div style={{
                    position: 'absolute', top: '12px', right: '20px',
                    fontSize: '48px', fontWeight: 900, color: 'rgba(173,201,5,0.06)',
                    fontFamily: "'Montserrat', sans-serif", lineHeight: 1, userSelect: 'none',
                  }}>
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div style={{ fontSize: '36px', marginBottom: '16px' }}>{ev.icon}</div>
                  <h3 style={{
                    fontSize: '17px', fontWeight: 700, color: '#fff',
                    margin: '0 0 10px', fontFamily: "'Montserrat', sans-serif",
                  }}>
                    {ev.title}
                  </h3>
                  <p style={{
                    fontSize: '14px', color: 'rgba(255,255,255,0.48)',
                    margin: 0, lineHeight: 1.75, fontFamily: "'Inter', sans-serif",
                  }}>
                    {ev.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── WHY CHOOSE US — Light ── */}
      {diffs.length > 0 && (
        <section style={{ background: '#f6f8f2', padding: '96px 0' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
              <div style={{
                fontSize: '11px', fontWeight: 700, letterSpacing: '3px',
                textTransform: 'uppercase', color: '#adc905',
                marginBottom: '12px', fontFamily: "'Inter', sans-serif",
              }}>
                Our Edge
              </div>
              <h2 style={{
                fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 800,
                color: '#111', margin: 0, fontFamily: "'Montserrat', sans-serif",
              }}>
                Why Choose Helios Event?
              </h2>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '20px',
            }}>
              {diffs.map((d, i) => (
                <div key={i} style={{
                  display: 'flex', gap: '20px', alignItems: 'flex-start',
                  background: '#fff',
                  border: '1px solid #e8ecdc',
                  borderRadius: '16px', padding: '28px 24px',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                }}>
                  <div style={{
                    flexShrink: 0, width: '44px', height: '44px',
                    background: 'linear-gradient(135deg, #adc905 0%, #c8e606 100%)',
                    borderRadius: '12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#0d1117', fontWeight: 900, fontSize: '15px',
                    fontFamily: "'Montserrat', sans-serif",
                  }}>
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div>
                    <h3 style={{
                      fontSize: '16px', fontWeight: 700, color: '#111',
                      margin: '0 0 8px', fontFamily: "'Montserrat', sans-serif",
                    }}>
                      {d.title}
                    </h3>
                    <p style={{
                      fontSize: '14px', color: '#666',
                      margin: 0, lineHeight: 1.75, fontFamily: "'Inter', sans-serif",
                    }}>
                      {d.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ — Dark ── */}
      {faqs.length > 0 && (
        <section style={{ background: '#111420', padding: '96px 0' }}>
          <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 24px' }}>
            <div style={{ textAlign: 'center', marginBottom: '52px' }}>
              <div style={{
                fontSize: '11px', fontWeight: 700, letterSpacing: '3px',
                textTransform: 'uppercase', color: 'rgba(173,201,5,0.75)',
                marginBottom: '12px', fontFamily: "'Inter', sans-serif",
              }}>
                FAQs
              </div>
              <h2 style={{
                fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 800,
                color: '#fff', margin: 0, fontFamily: "'Montserrat', sans-serif",
              }}>
                Frequently Asked Questions
              </h2>
            </div>
            <FAQAccordion faqs={faqs} />
          </div>
        </section>
      )}

      {/* ── CTA STRIP — Lime ── */}
      <section style={{
        background: 'linear-gradient(135deg, #adc905 0%, #c8e606 100%)',
        padding: '80px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{
          position: 'absolute', top: '-60px', right: '-60px', width: '280px', height: '280px',
          borderRadius: '50%', background: 'rgba(255,255,255,0.08)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-80px', left: '-40px', width: '200px', height: '200px',
          borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative' }}>
          <div style={{
            fontSize: '11px', fontWeight: 700, letterSpacing: '3px',
            textTransform: 'uppercase', color: 'rgba(13,17,23,0.5)',
            marginBottom: '14px', fontFamily: "'Inter', sans-serif",
          }}>
            Let&apos;s Work Together
          </div>
          <h2 style={{
            fontSize: 'clamp(1.6rem, 3.5vw, 2.6rem)', fontWeight: 900,
            color: '#0d1117', margin: '0 0 16px', fontFamily: "'Montserrat', sans-serif",
          }}>
            Ready to plan your {service.name}?
          </h2>
          <p style={{
            fontSize: '16px', color: 'rgba(0,0,0,0.55)',
            margin: '0 0 36px', fontFamily: "'Inter', sans-serif", lineHeight: 1.6,
          }}>
            Contact our team and let us create something extraordinary for you.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/get-quote" style={{ textDecoration: 'none' }}>
              <button style={{
                padding: '15px 36px', background: '#0d1117', color: '#fff',
                border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 700,
                cursor: 'pointer', fontFamily: "'Inter', sans-serif", letterSpacing: '0.5px',
              }}>
                Get a Custom Quote →
              </button>
            </Link>
            <Link href="/services" style={{ textDecoration: 'none' }}>
              <button style={{
                padding: '15px 32px', background: 'transparent', color: '#0d1117',
                border: '2px solid rgba(0,0,0,0.25)', borderRadius: '8px',
                fontSize: '15px', fontWeight: 700,
                cursor: 'pointer', fontFamily: "'Inter', sans-serif",
              }}>
                View All Services
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Chennai Locations */}
      <section style={{ background: '#0d1117', padding: '56px clamp(20px, 6vw, 80px)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#adc905', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px' }}>
            We Serve Across Chennai
          </div>
          <h3 style={{ fontSize: 'clamp(18px, 2.5vw, 28px)', fontWeight: 800, color: '#fff', marginBottom: '28px', fontFamily: "'Poppins', sans-serif" }}>
            Event Planner in Chennai — By Location
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
            {[
              { label: 'Taramani', slug: 'event-planner-in-taramani' },
              { label: 'OMR', slug: 'event-management-in-omr' },
              { label: 'Oragadam', slug: 'event-management-in-oragadam' },
              { label: 'Vallam Chengalpattu', slug: 'event-management-in-vallam-chengalpattu' },
              { label: 'Sriperumbudur', slug: 'event-management-in-sriperumbudur' },
              { label: 'Ambattur', slug: 'event-management-in-ambattur' },
              { label: 'Ekkatuthangal', slug: 'event-management-in-ekkatuthangal' },
              { label: 'Guindy', slug: 'event-management-in-guindy' },
              { label: 'Sri City', slug: 'event-management-in-sri-city' },
              { label: 'Siruseri', slug: 'event-management-in-siruseri' },
              { label: 'Porur', slug: 'event-management-in-porur' },
              { label: 'Anna Salai', slug: 'event-planner-in-anna-salai' },
            ].map(loc => (
              <Link key={loc.slug} href={`/chennai/${loc.slug}`} style={{ textDecoration: 'none' }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '8px 18px', borderRadius: '999px',
                  border: '1px solid rgba(173,201,5,0.3)',
                  background: 'rgba(173,201,5,0.08)',
                  color: 'rgba(255,255,255,0.75)', fontSize: '13px',
                  fontFamily: "'Inter', sans-serif", whiteSpace: 'nowrap',
                  transition: 'all 0.2s',
                }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#adc905" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                  {loc.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
