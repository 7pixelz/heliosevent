'use client';

import Image from 'next/image';

interface Logo { id: string; name: string; imageUrl: string; }

export default function Clients({ logos }: { logos: Logo[] }) {
  if (logos.length === 0) return null;

  // Split logos into three rows
  const third = Math.ceil(logos.length / 3);
  const row1 = logos.slice(0, third);
  const row2 = logos.slice(third, third * 2);
  const row3 = logos.slice(third * 2);
  // Ensure each row has enough items to fill the viewport when duplicated
  while (row1.length < 5) row1.push(...row1);
  while (row2.length < 5) row2.push(...row2);
  while (row3.length < 5) row3.push(...row3);

  return (
    <section style={{ background: '#fff', padding: '80px 0', overflow: 'hidden', borderBottom: '1px solid #eee' }}>
      <style>{`
        @keyframes marquee-left {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0); }
        }
        .marquee-viewport {
          overflow: hidden;
          -webkit-mask-image: linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%);
          mask-image: linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%);
        }
        .marquee-track {
          display: flex;
          width: max-content;
          will-change: transform;
        }
        .marquee-track-left  { animation: marquee-left  38s linear infinite; }
        .marquee-track-right { animation: marquee-right 44s linear infinite; }
        .marquee-track-left2 { animation: marquee-left  50s linear infinite; }
        .marquee-viewport:hover .marquee-track { animation-play-state: paused; }
        .brand-logo-item {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px 36px;
          border: 1px solid #f0f0f0;
          border-radius: 14px;
          margin: 0 10px;
          background: #fff;
          transition: box-shadow 0.2s, border-color 0.2s;
          cursor: default;
        }
        .brand-logo-item:hover {
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          border-color: #e0e0e0;
        }
        .brand-logo-item img {
          height: 72px;
          width: 130px;
          max-width: 130px;
          object-fit: contain;
          transition: transform 0.2s ease;
        }
        .brand-logo-item:hover {
          box-shadow: 0 6px 24px rgba(0,0,0,0.1);
          border-color: #e0e0e0;
        }
        .brand-logo-item:hover img {
          transform: scale(1.08);
        }
      `}</style>

      {/* Heading */}
      <div style={{ textAlign: 'center', marginBottom: '48px', padding: '0 24px' }}>
        <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 'clamp(22px, 3.5vw, 44px)', fontWeight: 800, color: '#1a1a1a', margin: 0 }}>
          Brands That Love Helios
        </h2>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '15px', color: '#888', marginTop: '10px' }}>
          Trusted by {logos.length}+ leading organisations across industries
        </p>
      </div>

      {/* Row 1 — scrolls left */}
      <div className="marquee-viewport" style={{ marginBottom: '16px' }}>
        <div className="marquee-track marquee-track-left">
          {[...row1, ...row1].map((logo, i) => (
            <div key={`r1-${logo.id}-${i}`} className="brand-logo-item">
              <Image src={logo.imageUrl} alt={logo.name} width={130} height={72} quality={30} sizes="130px" style={{ width: '130px', height: '72px', objectFit: 'contain' }} />
            </div>
          ))}
        </div>
      </div>

      {/* Row 2 — scrolls right */}
      <div className="marquee-viewport" style={{ marginBottom: '16px' }}>
        <div className="marquee-track marquee-track-right">
          {[...row2, ...row2].map((logo, i) => (
            <div key={`r2-${logo.id}-${i}`} className="brand-logo-item">
              <Image src={logo.imageUrl} alt={logo.name} width={130} height={72} quality={30} sizes="130px" style={{ width: '130px', height: '72px', objectFit: 'contain' }} />
            </div>
          ))}
        </div>
      </div>

      {/* Row 3 — scrolls left (slower) */}
      <div className="marquee-viewport">
        <div className="marquee-track marquee-track-left2">
          {[...row3, ...row3].map((logo, i) => (
            <div key={`r3-${logo.id}-${i}`} className="brand-logo-item">
              <Image src={logo.imageUrl} alt={logo.name} width={130} height={72} quality={30} sizes="130px" style={{ width: '130px', height: '72px', objectFit: 'contain' }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
