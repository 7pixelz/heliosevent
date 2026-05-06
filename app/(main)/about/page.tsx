import type { Metadata } from 'next';
import Link from 'next/link';
import { getPageSeo, buildMeta } from '../../../lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo('about');
  return buildMeta({ title: seo?.metaTitle, description: seo?.metaDescription, keywords: seo?.metaKeywords, path: '/about' });
}

const values = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    label: 'Commitment',
    tagline: 'To never say never',
    description: "and do our best to deliver on our promises and our clients' requirements.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
      </svg>
    ),
    label: 'Solutions',
    tagline: 'To provide turnkey solutions',
    description: 'and help our clients navigate through the various aspects of organising successful events.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" /><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
      </svg>
    ),
    label: 'Innovation',
    tagline: 'To continuously innovate',
    description: 'and help our clients put forth their brand message in new and ever-engaging ways.',
  },
];

const stats = [
  { number: '20+', label: 'Years of Experience' },
  { number: '100+', label: 'Brands Served' },
  { number: '20+', label: 'Countries' },
  { number: '500+', label: 'Events Delivered' },
];

const destinations = [
  '🇮🇳 India', '🇸🇬 Singapore', '🇭🇰 Hong Kong', '🇲🇴 Macau',
  '🇦🇺 Australia', '🇯🇵 Japan', '🇪🇸 Spain', '🇫🇷 France',
  '🇨🇭 Switzerland', '🇮🇩 Indonesia', '🇻🇳 Vietnam', '🇰🇪 Kenya',
  '🇦🇪 Dubai', '🇱🇰 Sri Lanka', '🇧🇩 Bangladesh', '🇳🇵 Nepal', '🇹🇭 Thailand',
];

export default function AboutPage() {
  return (
    <main>

      {/* ── Hero Banner ── */}
      <section style={{ position: 'relative', height: '480px', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/assets/banners/img3.webp)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(26,31,46,0.92) 0%, rgba(26,31,46,0.7) 60%, rgba(26,31,46,0.4) 100%)' }} />
        <div style={{ position: 'relative', maxWidth: '1200px', margin: '0 auto', padding: '0 40px', width: '100%' }}>
          <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase', color: '#adc905', fontFamily: "'Inter',sans-serif", marginBottom: '14px' }}>Who We Are</p>
          <h1 style={{ fontSize: 'clamp(36px,6vw,64px)', fontWeight: 900, color: '#fff', margin: '0 0 20px', lineHeight: 1.05, fontFamily: "'Inter',sans-serif" }}>
            Our <span style={{ color: '#adc905' }}>Story</span>
          </h1>
          <p style={{ fontSize: 'clamp(14px,1.6vw,18px)', color: 'rgba(255,255,255,0.65)', maxWidth: '520px', lineHeight: 1.7, fontFamily: "'Inter',sans-serif", margin: 0 }}>
            Two decades of crafting unforgettable experiences for the world's leading brands.
          </p>
        </div>
      </section>

      {/* ── Stats Strip ── */}
      <section style={{ background: '#adc905', padding: '0' }}>
        <div className="about-stats-grid" style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {stats.map((s, i) => (
            <div key={i} style={{ padding: '28px 24px', textAlign: 'center', borderRight: i < stats.length - 1 ? '1px solid rgba(0,0,0,0.12)' : 'none' }}>
              <div style={{ fontSize: 'clamp(28px,4vw,42px)', fontWeight: 900, color: '#1a1f2e', fontFamily: "'Inter',sans-serif", lineHeight: 1 }}>{s.number}</div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(26,31,46,0.7)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '6px', fontFamily: "'Inter',sans-serif" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Our Story ── */}
      <section style={{ background: '#fff', padding: 'clamp(60px,8vw,100px) 40px' }}>
        <div className="about-story-grid" style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
          {/* Text */}
          <div>
            <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: '#ff6a00', fontFamily: "'Inter',sans-serif", marginBottom: '14px' }}>About Helios Event</p>
            <h2 style={{ fontSize: 'clamp(28px,3.5vw,42px)', fontWeight: 900, color: '#1a1f2e', margin: '0 0 24px', lineHeight: 1.15, fontFamily: "'Inter',sans-serif" }}>
              A Reliable Partner for<br /><span style={{ color: '#adc905' }}>Exceptional Events</span>
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <p style={{ fontSize: '15px', color: '#555', lineHeight: 1.8, fontFamily: "'Inter',sans-serif", margin: 0 }}>
                To act as a reliable and experiential event organisation partner for our valued clients and help them put together successful events with the help of our experience, expertise and undying commitment to high service standards.
              </p>
              <p style={{ fontSize: '15px', color: '#555', lineHeight: 1.8, fontFamily: "'Inter',sans-serif", margin: 0 }}>
                At Helios Event, we are committed to going above and beyond to ensure our clients are able to deliver disruptive experiences. We started our journey in the event organisation space over two decades ago. During this time, we have organised delightful events for over 100+ brands.
              </p>
              <p style={{ fontSize: '15px', color: '#555', lineHeight: 1.8, fontFamily: "'Inter',sans-serif", margin: 0 }}>
                Proficient with cutting-edge experiential technology, our team hopes to continue helping our clients deliver memorable experiences, both in the real and the virtual world.
              </p>
            </div>

            {/* Destinations */}
            <div style={{ marginTop: '32px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#aaa', fontFamily: "'Inter',sans-serif", marginBottom: '12px' }}>We've worked across</div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {destinations.map(d => (
                  <span key={d} style={{ padding: '6px 14px', background: '#f5f6fa', border: '1px solid #e5e7eb', borderRadius: '999px', fontSize: '13px', fontWeight: 600, color: '#1a1f2e', fontFamily: "'Inter',sans-serif" }}>{d}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="about-img-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '200px 200px', gap: '12px' }}>
            <div style={{ gridRow: '1 / 3', borderRadius: '16px', overflow: 'hidden' }}>
              <img src="/assets/banners/img2.jpg" alt="Helios Event" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            <div style={{ borderRadius: '16px', overflow: 'hidden', background: '#1a1f2e', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '36px', fontWeight: 900, color: '#adc905', fontFamily: "'Inter',sans-serif", lineHeight: 1 }}>20+</div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '2px', fontFamily: "'Inter',sans-serif", textAlign: 'center' }}>Years of Excellence</div>
            </div>
            <div style={{ borderRadius: '16px', overflow: 'hidden', background: '#adc905', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '36px', fontWeight: 900, color: '#1a1f2e', fontFamily: "'Inter',sans-serif", lineHeight: 1 }}>100+</div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(26,31,46,0.7)', textTransform: 'uppercase', letterSpacing: '2px', fontFamily: "'Inter',sans-serif", textAlign: 'center' }}>Brands Served</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Our Values ── */}
      <section style={{ background: '#f5f6fa', padding: 'clamp(60px,8vw,100px) 40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: '#ff6a00', fontFamily: "'Inter',sans-serif", marginBottom: '14px' }}>What Drives Us</p>
            <h2 style={{ fontSize: 'clamp(28px,3.5vw,42px)', fontWeight: 900, color: '#1a1f2e', margin: '0 0 16px', fontFamily: "'Inter',sans-serif", lineHeight: 1.15 }}>
              Our <span style={{ color: '#adc905' }}>Values</span>
            </h2>
            <p style={{ fontSize: '15px', color: '#888', fontFamily: "'Inter',sans-serif", maxWidth: '520px', margin: '0 auto', lineHeight: 1.7 }}>
              With customer delight at the core of our business ethos, our practices are strongly rooted in these values.
            </p>
          </div>

          <div className="about-values-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '28px' }}>
            {values.map((v, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: '20px', padding: '40px 32px', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', position: 'relative', overflow: 'hidden', border: '1px solid #f0f0f0' }}>
                {/* Accent bar */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: i === 0 ? '#ff6a00' : i === 1 ? '#adc905' : '#1a1f2e' }} />
                {/* Icon */}
                <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: i === 0 ? 'rgba(255,106,0,0.08)' : i === 1 ? 'rgba(173,201,5,0.1)' : 'rgba(26,31,46,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', color: i === 0 ? '#ff6a00' : i === 1 ? '#7a9000' : '#1a1f2e' }}>
                  {v.icon}
                </div>
                <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#1a1f2e', margin: '0 0 8px', fontFamily: "'Inter',sans-serif" }}>{v.label}</h3>
                <p style={{ fontSize: '15px', fontWeight: 700, color: '#333', margin: '0 0 6px', fontFamily: "'Inter',sans-serif", fontStyle: 'italic' }}>{v.tagline}</p>
                <p style={{ fontSize: '14px', color: '#888', margin: 0, lineHeight: 1.7, fontFamily: "'Inter',sans-serif" }}>{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Video Strip ── */}
      <section style={{ position: 'relative', height: '400px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <video autoPlay muted loop playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} src="/assets/videos/HYUNDAI_Partnership.mp4" />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(26,31,46,0.8)' }} />
        <div style={{ position: 'relative', textAlign: 'center', padding: '0 24px' }}>
          <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase', color: '#adc905', fontFamily: "'Inter',sans-serif", marginBottom: '16px' }}>See Our Work</p>
          <h2 style={{ fontSize: 'clamp(26px,4vw,44px)', fontWeight: 900, color: '#fff', margin: '0 0 28px', lineHeight: 1.15, fontFamily: "'Inter',sans-serif" }}>
            Turning Visions Into<br /><span style={{ color: '#ff6a00' }}>Reality</span>
          </h2>
          <Link href="/get-quote" style={{ display: 'inline-block', padding: '14px 36px', background: '#ff6a00', color: '#fff', textDecoration: 'none', borderRadius: '50px', fontSize: '14px', fontWeight: 700, fontFamily: "'Inter',sans-serif", letterSpacing: '0.5px' }}>
            Plan Your Event
          </Link>
        </div>
      </section>


    </main>
  );
}
