'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

interface ServiceItem { id: string; icon: string; name: string; slug: string }

const FALLBACK_MAIN: ServiceItem[] = [
  { id: 'f1', icon: '🎤', name: 'Corporate Events', slug: 'corporate-events' },
  { id: 'f2', icon: '🎭', name: 'Entertainment Events', slug: 'entertainment-events' },
  { id: 'f3', icon: '🏛️', name: 'Exhibitions', slug: 'exhibitions' },
  { id: 'f4', icon: '🏛️', name: 'Government Protocol Events', slug: 'government-protocol-events' },
  { id: 'f5', icon: '🤝', name: 'Trade Body Association Events', slug: 'trade-body-association-events' },
  { id: 'f6', icon: '✈️', name: 'MICE Events', slug: 'mice-events' },
  { id: 'f7', icon: '⚽', name: 'Sports Events', slug: 'sports-events' },
  { id: 'f8', icon: '💒', name: 'Wedding & Social Events', slug: 'wedding-social-events' },
];


function DropdownMenu({ items, visible }: { items: ServiceItem[]; visible: boolean }) {
  return (
    <div style={{
      position: 'absolute', top: 'calc(100% + 12px)', left: '50%',
      transform: visible ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(-8px)',
      background: '#1a1f2e',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '14px',
      padding: '10px',
      minWidth: '240px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
      opacity: visible ? 1 : 0,
      pointerEvents: visible ? 'auto' : 'none',
      transition: 'opacity 0.18s ease, transform 0.18s ease',
      zIndex: 999,
    }}>
      {/* arrow */}
      <div style={{
        position: 'absolute', top: '-6px', left: '50%', transform: 'translateX(-50%)',
        width: '12px', height: '12px',
        background: '#1a1f2e',
        border: '1px solid rgba(255,255,255,0.1)',
        borderBottom: 'none', borderRight: 'none',
        rotate: '45deg',
      }} />
      {items.map(item => (
        <a
          key={item.id}
          href={`/services/${item.slug}`}
          style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 14px', borderRadius: '8px',
            textDecoration: 'none', color: 'rgba(255,255,255,0.75)',
            fontSize: '13px', fontWeight: 500,
            fontFamily: "'Inter', sans-serif",
            transition: 'background 0.15s, color 0.15s',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(173,201,5,0.12)';
            (e.currentTarget as HTMLAnchorElement).style.color = '#fff';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
            (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.75)';
          }}
        >
          <span style={{ fontSize: '17px', lineHeight: 1 }}>{item.icon}</span>
          {item.name}
        </a>
      ))}
    </div>
  );
}

function MobileAccordion({ items, open }: { items: ServiceItem[]; open: boolean }) {
  return (
    <div style={{
      overflow: 'hidden',
      maxHeight: open ? `${items.length * 42}px` : '0',
      transition: 'max-height 0.25s ease',
    }}>
      {items.map(item => (
        <a
          key={item.id}
          href={`/services/${item.slug}`}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            padding: '10px 24px',
            textDecoration: 'none', color: 'rgba(255,255,255,0.55)',
            fontSize: '12px', fontFamily: "'Inter', sans-serif",
            borderBottom: '1px solid rgba(173,201,5,0.04)',
          }}
        >
          <span>{item.icon}</span>
          {item.name}
        </a>
      ))}
    </div>
  );
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mainServices, setMainServices] = useState<ServiceItem[]>(FALLBACK_MAIN);

  const servicesTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pathname = usePathname();

  useEffect(() => {
    fetch('/api/services')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.main?.length) setMainServices(data.main);
      })
      .catch(() => {});
  }, []);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileServicesOpen(false);
  };

  const isServicesActive = pathname.startsWith('/services');

  function hoverOpen(setter: (v: boolean) => void, timer: React.MutableRefObject<ReturnType<typeof setTimeout> | null>) {
    if (timer.current) clearTimeout(timer.current);
    setter(true);
  }
  function hoverClose(setter: (v: boolean) => void, timer: React.MutableRefObject<ReturnType<typeof setTimeout> | null>) {
    timer.current = setTimeout(() => setter(false), 120);
  }

  return (
    <nav>
      <a href="/" className="nav-logo" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
        <img src="/assets/heliosevent_logo_white.webp" alt="Helios Event Productions" style={{ height: '56px', width: 'auto' }} />
      </a>

      <ul className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
        <li>
          <a href="/" className={pathname === '/' ? 'active' : ''} onClick={closeMobileMenu}>Home</a>
        </li>

        {/* Services dropdown */}
        <li
          style={{ position: 'relative' }}
          onMouseEnter={() => hoverOpen(setServicesOpen, servicesTimer)}
          onMouseLeave={() => hoverClose(setServicesOpen, servicesTimer)}
        >
          <a
            href="#"
            onClick={e => { e.preventDefault(); setMobileServicesOpen(o => !o); }}
            className={`nav-dropdown-link${isServicesActive ? ' active' : ''}`}
          >
            Services
            <svg
              width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5"
              style={{ transition: 'transform 0.2s', transform: (servicesOpen || mobileServicesOpen) ? 'rotate(180deg)' : 'none', opacity: 0.6 }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </a>

          {/* Desktop dropdown */}
          <div className="hide-mobile">
            <DropdownMenu items={mainServices} visible={servicesOpen} />
          </div>

          {/* Mobile accordion */}
          <div className="show-mobile-only">
            <MobileAccordion items={mainServices} open={mobileServicesOpen} />
          </div>
        </li>

        {/* Activities dropdown — hidden for now */}

        <li><a href="/portfolio" className={pathname === '/portfolio' ? 'active' : ''} onClick={closeMobileMenu}>Portfolio</a></li>
        <li><a href="/about" className={pathname === '/about' ? 'active' : ''} onClick={closeMobileMenu}>About</a></li>
        <li><a href="/blog" className={pathname.startsWith('/blog') ? 'active' : ''} onClick={closeMobileMenu}>Blog</a></li>
        <li><a href="/contact" className={pathname === '/contact' ? 'active' : ''} onClick={closeMobileMenu}>Contact</a></li>
        <li className="mobile-cta">
          <a href="/get-quote" className="nav-btn" onClick={closeMobileMenu} style={{ textDecoration: 'none', display: 'block', textAlign: 'center' }}>
            Plan Your Event
          </a>
        </li>
      </ul>

      <a href="/get-quote" className="nav-btn hide-mobile" style={{ textDecoration: 'none' }}>Plan Your Event</a>
      <button className="hamburger" onClick={() => setMobileMenuOpen(o => !o)}>
        <span className={`ham-line ${mobileMenuOpen ? 'active' : ''}`}></span>
        <span className={`ham-line ${mobileMenuOpen ? 'active' : ''}`}></span>
        <span className={`ham-line ${mobileMenuOpen ? 'active' : ''}`}></span>
      </button>
    </nav>
  );
}
