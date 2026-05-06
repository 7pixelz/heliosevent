'use client';

import { useState } from 'react';

interface Logo { id: string; name: string; imageUrl: string; }

const PAGE_SIZE = 25;

export default function Clients({ logos }: { logos: Logo[] }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? logos : logos.slice(0, PAGE_SIZE);

  if (logos.length === 0) return null;

  return (
    <section className="clients-section">
      <style>{`
        .clients-section {
          background: #fff;
          padding: 80px 56px;
          border-bottom: 1px solid #eee;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .clients-grid {
          width: 100%;
          max-width: 1200px;
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          border-top: 1px solid #eee;
          border-left: 1px solid #eee;
        }
        .clients-grid-item {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 32px 24px;
          border-right: 1px solid #eee;
          border-bottom: 1px solid #eee;
          background: #fff;
        }
        @media (max-width: 900px) {
          .clients-section { padding: 60px 24px; }
          .clients-grid { grid-template-columns: repeat(3, 1fr); }
          .clients-grid-item { padding: 24px 16px; }
          .clients-grid-item:last-child:nth-child(3n+1) { grid-column: span 3; }
          .clients-grid-item:last-child:nth-child(3n+2) { grid-column: span 2; }
        }
        @media (max-width: 500px) {
          .clients-section { padding: 48px 16px; }
          .clients-grid { grid-template-columns: repeat(2, 1fr); }
          .clients-grid-item { padding: 20px 12px; }
          .clients-grid-item:last-child:nth-child(odd) { grid-column: span 2; }
        }
      `}</style>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 'clamp(22px, 3.5vw, 48px)', fontWeight: 800, color: '#1a1a1a' }}>
          Brands That Love Helios
        </h2>
      </div>
      <div className="clients-grid">
        {visible.map((logo) => (
          <div key={logo.id} className="clients-grid-item">
            <img
              src={logo.imageUrl}
              alt={logo.name}
              style={{ maxHeight: '70px', width: 'auto', maxWidth: '130px', objectFit: 'contain', filter: 'grayscale(30%)', transition: 'filter 0.2s' }}
            />
          </div>
        ))}
      </div>
      {logos.length > PAGE_SIZE && (
        <button
          onClick={() => setExpanded(e => !e)}
          style={{ marginTop: '36px', padding: '12px 40px', fontFamily: "'Inter', sans-serif", fontSize: '13px', fontWeight: 700, color: '#111', background: '#fff', border: '1.5px solid #ccc', borderRadius: '8px', cursor: 'pointer', letterSpacing: '0.5px' }}
        >
          {expanded ? 'Show Less ↑' : 'Load More ↓'}
        </button>
      )}
    </section>
  );
}
