'use client';

import { useState } from 'react';

interface Logo { id: string; name: string; imageUrl: string; }

const PAGE_SIZE = 25;

export default function Clients({ logos }: { logos: Logo[] }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? logos : logos.slice(0, PAGE_SIZE);

  if (logos.length === 0) return null;

  return (
    <section style={{ background: '#fff', padding: '80px 56px', borderBottom: '1px solid #eee', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 'clamp(28px, 3.5vw, 48px)', fontWeight: 800, color: '#1a1a1a' }}>
          Brands That Love Helios
        </h2>
      </div>
      <div style={{ width: '100%', maxWidth: '1200px', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', border: '1px solid #eee' }}>
        {visible.map((logo, i) => (
          <div key={logo.id} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '32px 24px',
            borderRight: (i + 1) % 5 === 0 ? 'none' : '1px solid #eee',
            borderBottom: '1px solid #eee',
            background: '#fff',
          }}>
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
