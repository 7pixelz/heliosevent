import React from 'react';
import Link from 'next/link';

export interface Crumb {
  label: string;
  href?: string; // omit on the last (current) item
}

const FONT = "'Inter',sans-serif";

export default function Breadcrumbs({ items, center = false }: { items: Crumb[]; center?: boolean }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px',
      justifyContent: center ? 'center' : 'flex-start',
      marginBottom: '14px',
    }}>
      {items.map((item, i) => (
        <React.Fragment key={i}>
          {i > 0 && (
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', fontFamily: FONT }}>›</span>
          )}
          {item.href ? (
            <Link href={item.href} style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)', textDecoration: 'none', fontFamily: FONT }}>
              {item.label}
            </Link>
          ) : (
            <span style={{ fontSize: '12px', color: '#fff', fontFamily: FONT, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '340px' }}>
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
