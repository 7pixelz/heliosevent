import Link from 'next/link';
import { prisma } from '../../../lib/prisma';
import { getPageSeo, buildMeta } from '../../../lib/seo';

export const revalidate = 3600;
import type { Metadata } from 'next';
import LeadForm from '../../../components/sections/LeadForm';
import Breadcrumbs from '../../../components/Breadcrumbs';
import Stats from '../../../components/sections/Stats';
import Testimonials from '../../../components/sections/Testimonials';
import CtaBanner from '../../../components/sections/CtaBanner';
import Locations from '../../../components/sections/LocationsClient';
import { highlightExp } from '../../../lib/highlight';

type Service = { id: string; name: string; slug: string; icon: string; description: string; type: string; displayOrder: number; isActive: boolean; heroHeadline?: string | null; coverImageUrl?: string | null };

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo('services');
  return buildMeta({ title: seo?.metaTitle, description: seo?.metaDescription, keywords: seo?.metaKeywords, path: '/services' });
}

export default async function ServicesPage() {
  const mainServices = await prisma.service.findMany({
    where: { isActive: true, type: 'MAIN' },
    orderBy: { displayOrder: 'asc' },
  });

  const colorClasses = ['s1', 's2', 's3', 's4', 's5', 's6'];

  return (
    <>
      {/* Hero Banner */}
      <section className="page-hero" style={{
        background: 'linear-gradient(135deg, #0d1117 0%, #1a1f2e 50%, #0d1117 100%)',
        paddingTop: '140px',
        paddingBottom: '80px',
        textAlign: 'left',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(173,201,5,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Services' }]} />
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
      <section style={{ background: '#0d1117', padding: 'clamp(40px, 8vw, 80px) 0' }}>
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
                    <div className="svc-desc">{highlightExp(svc.description)}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Stats />
      <Testimonials />
      <CtaBanner />
      <Locations />
      <LeadForm />
    </>
  );
}
