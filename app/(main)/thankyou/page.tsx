import type { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Thank You | Helios Event Productions',
  description: 'Thank you for your enquiry. Our team will get back to you shortly.',
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return (
    <>
      {/* ── Conversion tracking scripts go here ── */}
      {/* Google Ads conversion, Meta Pixel event, etc. */}


      <div style={{
        background: '#0d1117', minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px 24px', paddingTop: '100px',
      }}>
        <div style={{ textAlign: 'center', maxWidth: '560px' }}>
          {/* Checkmark */}
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            background: 'rgba(173,201,5,0.12)', border: '2px solid #adc905',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 28px',
          }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#adc905" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <h1 style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 900,
            color: '#fff', margin: '0 0 16px', fontFamily: "'Montserrat', sans-serif",
          }}>
            Thank You!
          </h1>

          <p style={{
            fontSize: '17px', color: 'rgba(255,255,255,0.6)',
            margin: '0 0 12px', lineHeight: 1.7, fontFamily: "'Inter', sans-serif",
          }}>
            We've received your enquiry and our team will get back to you within <strong style={{ color: '#fff' }}>24 hours</strong>.
          </p>

          <p style={{
            fontSize: '14px', color: 'rgba(255,255,255,0.35)',
            margin: '0 0 40px', fontFamily: "'Inter', sans-serif",
          }}>
            In the meantime, feel free to explore our portfolio or follow us on social media.
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/" style={{
              padding: '13px 28px', background: '#adc905', color: '#000',
              borderRadius: '8px', textDecoration: 'none', fontSize: '14px',
              fontWeight: 700, fontFamily: "'Inter', sans-serif",
            }}>
              Back to Home
            </a>
            <a href="/portfolio" style={{
              padding: '13px 28px', background: 'transparent',
              border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.75)',
              borderRadius: '8px', textDecoration: 'none', fontSize: '14px',
              fontWeight: 600, fontFamily: "'Inter', sans-serif",
            }}>
              View Portfolio
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
