import Link from 'next/link';
import { prisma } from '../../../lib/prisma';
import { getPageSeo, buildMeta } from '../../../lib/seo';
import type { Metadata } from 'next';

type Service = { id: string; name: string; slug: string; icon: string; description: string; type: string; displayOrder: number; isActive: boolean; heroHeadline?: string | null; coverImageUrl?: string | null };

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo('services');
  return buildMeta({ title: seo?.metaTitle, description: seo?.metaDescription, keywords: seo?.metaKeywords, path: '/services' });
}

export default async function ServicesPage() {
  const [mainServices, activities] = await Promise.all([
    prisma.service.findMany({
      where: { isActive: true, type: 'MAIN' },
      orderBy: { displayOrder: 'asc' },
    }),
    prisma.service.findMany({
      where: { isActive: true, type: 'ACTIVITY' },
      orderBy: { displayOrder: 'asc' },
    }),
  ]);

  const colorClasses = ['s1', 's2', 's3', 's4', 's5', 's6'];

  return (
    <>
      {/* Hero Banner */}
      <section style={{
        background: 'linear-gradient(135deg, #0d1117 0%, #1a1f2e 50%, #0d1117 100%)',
        paddingTop: '140px',
        paddingBottom: '80px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(173,201,5,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{
            display: 'inline-block',
            fontSize: '11px', fontWeight: 700, letterSpacing: '3px',
            textTransform: 'uppercase', color: 'rgba(173,201,5,0.8)',
            marginBottom: '16px', fontFamily: "'Inter', sans-serif",
          }}>
            What We Do
          </div>
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800,
            color: '#fff', margin: '0 0 20px', lineHeight: 1.1,
            fontFamily: "'Montserrat', sans-serif",
          }}>
            Our Services
          </h1>
          <p style={{
            fontSize: '17px', color: 'rgba(255,255,255,0.6)',
            margin: 0, lineHeight: 1.7, fontFamily: "'Inter', sans-serif",
          }}>
            From intimate gatherings to grand spectacles — we design, produce and deliver events that leave lasting impressions.
          </p>
        </div>
      </section>

      {/* Main Services Grid */}
      <section style={{ background: '#0d1117', padding: '80px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ marginBottom: '48px' }}>
            <div style={{
              fontSize: '11px', fontWeight: 700, letterSpacing: '3px',
              textTransform: 'uppercase', color: 'rgba(173,201,5,0.7)',
              marginBottom: '10px', fontFamily: "'Inter', sans-serif",
            }}>
              Main Services
            </div>
            <h2 style={{
              fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 800,
              color: '#fff', margin: 0, fontFamily: "'Montserrat', sans-serif",
            }}>
              Our wide range of services
            </h2>
          </div>

          <div className="svc-grid">
            {mainServices.map((svc: Service, i: number) => (
              <Link key={svc.id} href={`/services/${svc.slug}`} style={{ textDecoration: 'none' }}>
                <div className={`svc-card ${colorClasses[i % colorClasses.length]}`} style={{ cursor: 'pointer' }}>
                  <div className="svc-bg"></div>
                  <div className="svc-icon">{svc.icon}</div>
                  <div className="svc-overlay"></div>
                  <div className="svc-body">
                    <div className="svc-num">{String(i + 1).padStart(2, '0')}</div>
                    <div className="svc-name">{svc.name}</div>
                    <div className="svc-desc">{svc.description}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section style={{ background: '#111420', padding: '80px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ marginBottom: '48px' }}>
            <div style={{
              fontSize: '11px', fontWeight: 700, letterSpacing: '3px',
              textTransform: 'uppercase', color: 'rgba(173,201,5,0.7)',
              marginBottom: '10px', fontFamily: "'Inter', sans-serif",
            }}>
              Activities
            </div>
            <h2 style={{
              fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 800,
              color: '#fff', margin: '0 0 10px', fontFamily: "'Montserrat', sans-serif",
            }}>
              Our Activity Events
            </h2>
            <p style={{
              color: 'rgba(255,255,255,0.45)', fontSize: '15px',
              fontFamily: "'Inter', sans-serif", margin: 0,
            }}>
              Curated experiences designed to engage, energise and inspire your team.
            </p>
          </div>

          <div className="act-cards-grid">
            {activities.map((item: Service) => (
              <Link key={item.id} href={`/services/${item.slug}`} style={{ textDecoration: 'none' }}>
                <div className="act-card" style={{ cursor: 'pointer' }}>
                  <div className="act-card-img">
                    {item.coverImageUrl ? (
                      <img
                        src={item.coverImageUrl}
                        alt={item.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div className="act-card-placeholder">
                        <span className="act-placeholder-icon">{item.icon}</span>
                        <span className="act-placeholder-label">View Details</span>
                      </div>
                    )}
                  </div>
                  <div className="act-card-body">
                    <h3 className="act-card-title">{item.name}</h3>
                    <p className="act-card-desc">{item.description}</p>
                    <button className="act-read-more">Read More →</button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section style={{ background: '#0d1117', padding: '80px 0' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <div style={{
            fontSize: '11px', fontWeight: 700, letterSpacing: '3px',
            textTransform: 'uppercase', color: 'rgba(173,201,5,0.7)',
            marginBottom: '10px', fontFamily: "'Inter', sans-serif",
          }}>
            Our Process
          </div>
          <h2 style={{
            fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 800,
            color: '#fff', margin: '0 0 48px', fontFamily: "'Montserrat', sans-serif",
          }}>
            How We Work
          </h2>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '32px',
          }}>
            {[
              { step: '01', title: 'Understand', desc: 'We start with a deep-dive discovery session to understand your event goals, audience, and brand.' },
              { step: '02', title: 'Design', desc: 'Our creative team crafts a bespoke event concept — from venue design to run-of-show timelines.' },
              { step: '03', title: 'Deliver', desc: 'Our production crew executes flawlessly on the day, so you can focus on your guests.' },
            ].map(item => (
              <div key={item.step} style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '16px', padding: '36px 28px', textAlign: 'left',
              }}>
                <div style={{
                  fontSize: '48px', fontWeight: 800, color: 'rgba(173,201,5,0.15)',
                  lineHeight: 1, marginBottom: '16px', fontFamily: "'Montserrat', sans-serif",
                }}>
                  {item.step}
                </div>
                <h3 style={{
                  fontSize: '20px', fontWeight: 700, color: '#fff',
                  margin: '0 0 12px', fontFamily: "'Montserrat', sans-serif",
                }}>
                  {item.title}
                </h3>
                <p style={{
                  fontSize: '14px', color: 'rgba(255,255,255,0.5)',
                  margin: 0, lineHeight: 1.7, fontFamily: "'Inter', sans-serif",
                }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{
        background: 'linear-gradient(135deg, #adc905 0%, #8fa804 100%)',
        padding: '64px 24px', textAlign: 'center',
      }}>
        <h2 style={{
          fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 800,
          color: '#0d1117', margin: '0 0 16px', fontFamily: "'Montserrat', sans-serif",
        }}>
          Ready to plan your next event?
        </h2>
        <p style={{
          fontSize: '17px', color: 'rgba(0,0,0,0.6)',
          margin: '0 0 32px', fontFamily: "'Inter', sans-serif",
        }}>
          Let our team turn your vision into reality. Get a personalised quote today.
        </p>
        <Link href="/get-quote" style={{ textDecoration: 'none' }}>
          <button style={{
            padding: '16px 40px', background: '#0d1117', color: '#fff',
            border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 700,
            cursor: 'pointer', fontFamily: "'Inter', sans-serif",
            letterSpacing: '0.5px',
          }}>
            Get a Custom Quote →
          </button>
        </Link>
      </section>
    </>
  );
}
