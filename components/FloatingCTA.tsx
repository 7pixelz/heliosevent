'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function FloatingCTA() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  // Hide on get-quote page; show after scrolling 300px
  const isQuotePage = pathname === '/get-quote';

  useEffect(() => {
    if (isQuotePage) return;
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [isQuotePage]);

  if (isQuotePage) return null;

  return (
    <a
      href="/get-quote"
      style={{
        position: 'fixed',
        bottom: '32px',
        left: '50%',
        transform: visible
          ? 'translateX(-50%) translateY(0)'
          : 'translateX(-50%) translateY(120px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '14px 28px',
        background: 'linear-gradient(135deg, #ff6a00 0%, #ee0979 100%)',
        color: '#fff',
        borderRadius: '100px',
        textDecoration: 'none',
        fontFamily: "'Inter', sans-serif",
        fontSize: '14px',
        fontWeight: 700,
        letterSpacing: '0.3px',
        boxShadow: '0 8px 32px rgba(255,106,0,0.45), 0 2px 8px rgba(0,0,0,0.2)',
        transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 12px 40px rgba(255,106,0,0.6), 0 4px 12px rgba(0,0,0,0.25)';
        (e.currentTarget as HTMLAnchorElement).style.transform = 'translateX(-50%) translateY(-3px)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 8px 32px rgba(255,106,0,0.45), 0 2px 8px rgba(0,0,0,0.2)';
        (e.currentTarget as HTMLAnchorElement).style.transform = 'translateX(-50%) translateY(0)';
      }}
    >
      {/* Calendar icon */}
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
      </svg>
      Plan Your Event
      {/* Pulse ring */}
      <span style={{
        position: 'absolute',
        inset: 0,
        borderRadius: '100px',
        border: '2px solid rgba(255,106,0,0.5)',
        animation: 'float-cta-pulse 2s ease-out infinite',
        pointerEvents: 'none',
      }} />
    </a>
  );
}
