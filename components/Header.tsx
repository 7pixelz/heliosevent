'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

interface ServiceItem { id: string; icon: string; name: string; slug: string }

// Sub-items shown in the right panel when hovering a service
const SERVICE_SUB_ITEMS: Record<string, { category: string; items: string[] }[]> = {
  'entertainment-event-organizer-in-chennai': [
    {
      category: 'Challenges & Contests',
      items: [
        'Sports Day', 'Team Building', 'Hackathon', 'Marathon',
        'Treasure Hunt', 'Innovation Challenge', 'Startup Pitch Contest', 'Gaming Tournament',
        'Quiz Competition', 'Talent Hunt', 'Fitness Challenge', 'Sales Contest',
        'Coding Challenge', 'Leadership Games', 'Escape Room Activities', 'Adventure Activities',
        'Campus Competitions', 'Reality Show Format Activities', 'Employee Engagement Activities',
        'Fun Fridays', 'Virtual Contests', 'Ideaathon', 'Photography Contest', 'Reel Making Contest',
      ],
    },
  ],
  'exhibition-organizer-in-chennai': [
    {
      category: 'Campaigns',
      items: [
        'ATL Activities', 'BTL Activities', 'Road Shows', 'SEO Activities',
        'Mall Activations', 'Retail Branding Campaigns', 'Product Sampling Activities', 'Influencer Campaigns',
        'Digital Campaigns', 'Social Media Campaigns', 'Election Campaign Support', 'Government Awareness Campaigns',
        'CSR Campaigns', 'Van Campaigns', 'Campus Activation', 'Brand Awareness Drives',
        'Public Engagement Activities', 'Flash Mob Campaigns', 'Employee Engagement Campaigns',
      ],
    },
  ],
  'corporate-event-management-in-chennai': [
    {
      category: 'Celebrations',
      items: [
        'Family Day', 'Kids Day', 'Employee Day', 'Annual Day',
        'Office Decor', 'Festival Decor', 'Long Service Awards', 'Founders Day',
        'Success Celebration Events', 'Milestone Celebrations', 'Employee Recognition Programs',
        'Cultural Fest', 'Theme Parties', 'Gala Nights', 'Farewell Events', 'Welcome Events',
        'New Office Launch Celebration', "Women's Day Celebration", 'Wellness Day', 'Team Outings',
        'Appreciation Day', 'Festive Carnivals', 'CSR Celebration Events', 'Anniversary Celebrations',
        'Rewards & Recognition Night', 'Influencer / Celebrity Engagement Events',
      ],
    },
  ],
};

const FALLBACK_MAIN: ServiceItem[] = [
  { id: 'f1', icon: '🎤', name: 'Corporate Events', slug: 'corporate-event-management-in-chennai' },
  { id: 'f2', icon: '🎭', name: 'Entertainment Events', slug: 'entertainment-events' },
  { id: 'f3', icon: '🏛️', name: 'Exhibitions', slug: 'exhibitions' },
  { id: 'f4', icon: '🏛️', name: 'Government Protocol Events', slug: 'government-protocol-events' },
  { id: 'f5', icon: '🤝', name: 'Trade Body Association Events', slug: 'trade-body-association-events' },
  { id: 'f6', icon: '✈️', name: 'MICE Events', slug: 'mice-events' },
  { id: 'f7', icon: '⚽', name: 'Sports Events', slug: 'sports-events' },
];


function DropdownMenu({ items, visible }: { items: ServiceItem[]; visible: boolean }) {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const subItems = hoveredSlug ? SERVICE_SUB_ITEMS[hoveredSlug] : null;

  return (
    /* Outer wrapper — fixed position, never changes size */
    <div style={{
      position: 'absolute', top: 'calc(100% + 12px)', left: '50%',
      transform: visible ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(-8px)',
      opacity: visible ? 1 : 0,
      pointerEvents: visible ? 'auto' : 'none',
      transition: 'opacity 0.18s ease, transform 0.18s ease',
      zIndex: 999,
    }}>
      {/* Service list — position:relative so sub-panel anchors to it */}
      <div
        style={{
          background: '#1a1f2e', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '14px', padding: '10px', minWidth: '260px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)', position: 'relative',
        }}
        onMouseLeave={() => setHoveredSlug(null)}
      >
        {/* Arrow */}
        <div style={{
          position: 'absolute', top: '-6px', left: '50%', transform: 'translateX(-50%)',
          width: '12px', height: '12px', background: '#1a1f2e',
          border: '1px solid rgba(255,255,255,0.1)',
          borderBottom: 'none', borderRight: 'none', rotate: '45deg',
        }} />

        {items.map(item => {
          const hasSub = !!SERVICE_SUB_ITEMS[item.slug];
          const isHovered = hoveredSlug === item.slug;
          return (
            <a
              key={item.id}
              href={`/services/${item.slug}`}
              onMouseEnter={() => setHoveredSlug(item.slug)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px',
                padding: '10px 14px', borderRadius: '8px', textDecoration: 'none',
                color: isHovered ? '#fff' : 'rgba(255,255,255,0.75)',
                background: isHovered ? 'rgba(173,201,5,0.12)' : 'transparent',
                fontSize: '13px', fontWeight: 500, fontFamily: "'Inter', sans-serif",
                transition: 'background 0.15s, color 0.15s', whiteSpace: 'nowrap',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '17px', lineHeight: 1 }}>{item.icon}</span>
                {item.name}
              </span>
              {hasSub && <span style={{ fontSize: '10px', color: '#adc905' }}>›</span>}
            </a>
          );
        })}

        {/* Sub-panel — absolutely positioned to the RIGHT of the service list, no layout shift */}
        {subItems && (
          <div
            onMouseEnter={() => setHoveredSlug(hoveredSlug)}
            style={{
              position: 'absolute', top: 0, left: 'calc(100% + 8px)',
              background: '#1a1f2e', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '14px', padding: '16px 20px',
              minWidth: '420px', maxWidth: '540px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              animation: 'fadeInSub 0.15s ease',
            }}
          >
            <style>{`@keyframes fadeInSub { from { opacity:0; transform:translateX(-6px); } to { opacity:1; transform:translateX(0); } }`}</style>
            {subItems.map(group => (
              <div key={group.category}>
                <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#adc905', marginBottom: '12px', fontFamily: "'Inter', sans-serif" }}>
                  {group.category}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px 16px' }}>
                  {group.items.map(subItem => (
                    <div key={subItem} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 0', color: 'rgba(255,255,255,0.6)', fontSize: '12px', fontFamily: "'Inter', sans-serif" }}>
                      <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#adc905', flexShrink: 0 }} />
                      {subItem}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MobileAccordion({ items, open }: { items: ServiceItem[]; open: boolean }) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  const totalItems = items.reduce((acc, item) => {
    const sub = SERVICE_SUB_ITEMS[item.slug];
    const subCount = sub ? sub.reduce((a, g) => a + g.items.length + 1, 0) : 0;
    return acc + 1 + (openSlug === item.slug ? subCount : 0);
  }, 0);

  return (
    <div style={{ overflow: 'hidden', maxHeight: open ? `${totalItems * 40 + 200}px` : '0', transition: 'max-height 0.3s ease' }}>
      {items.map(item => {
        const hasSub = !!SERVICE_SUB_ITEMS[item.slug];
        const isOpen = openSlug === item.slug;
        return (
          <div key={item.id}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <a
                href={`/services/${item.slug}`}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                  padding: '10px 12px', textDecoration: 'none', color: 'rgba(255,255,255,0.55)',
                  fontSize: '12px', fontFamily: "'Inter', sans-serif",
                  borderBottom: '1px solid rgba(173,201,5,0.04)',
                }}
              >
                <span>{item.icon}</span>{item.name}
              </a>
              {hasSub && (
                <button onClick={() => setOpenSlug(isOpen ? null : item.slug)} style={{ background: 'none', border: 'none', color: '#adc905', fontSize: '16px', padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid rgba(173,201,5,0.04)' }}>
                  {isOpen ? '−' : '+'}
                </button>
              )}
            </div>
            {hasSub && isOpen && (
              <div style={{ background: 'rgba(173,201,5,0.04)', padding: '10px 16px 14px' }}>
                {SERVICE_SUB_ITEMS[item.slug].map(group => (
                  <div key={group.category}>
                    <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#adc905', margin: '8px 0 8px', fontFamily: "'Inter', sans-serif" }}>{group.category}</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                      {group.items.map(subItem => (
                        <div key={subItem} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'rgba(255,255,255,0.45)', fontFamily: "'Inter', sans-serif", padding: '3px 0' }}>
                          <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: '#adc905', flexShrink: 0 }} />
                          {subItem}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
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

  function hoverOpen(setter: (v: boolean) => void, timer: { current: ReturnType<typeof setTimeout> | null }) {
    if (timer.current) clearTimeout(timer.current);
    setter(true);
  }
  function hoverClose(setter: (v: boolean) => void, timer: { current: ReturnType<typeof setTimeout> | null }) {
    timer.current = setTimeout(() => setter(false), 120);
  }

  return (
    <nav>
      <a href="/" className="nav-logo" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
        <Image src="/assets/heliosevent_logo_white.webp" alt="Helios Event Productions" width={205} height={56} priority sizes="(max-width:640px) 150px, 205px" style={{ height: '56px', width: 'auto' }} />
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
        <li><a href="/about" className={pathname === '/about' ? 'active' : ''} onClick={closeMobileMenu}>About Us</a></li>
        <li><a href="/careers" className={pathname === '/careers' ? 'active' : ''} onClick={closeMobileMenu}>Careers</a></li>
        <li><a href="/contact" className={pathname === '/contact' ? 'active' : ''} onClick={closeMobileMenu}>Contact</a></li>
        <li className="mobile-cta">
          <a href="/get-quote" className="nav-btn" onClick={closeMobileMenu} style={{ textDecoration: 'none', display: 'block', textAlign: 'center' }}>
            Plan Your Event
          </a>
        </li>
      </ul>

      <a href="/get-quote" className="nav-btn hide-mobile" style={{ textDecoration: 'none' }}>Plan Your Event</a>
      <button className="hamburger" aria-label="Toggle navigation menu" aria-expanded={mobileMenuOpen} onClick={() => setMobileMenuOpen(o => !o)}>
        <span className={`ham-line ${mobileMenuOpen ? 'active' : ''}`}></span>
        <span className={`ham-line ${mobileMenuOpen ? 'active' : ''}`}></span>
        <span className={`ham-line ${mobileMenuOpen ? 'active' : ''}`}></span>
      </button>
    </nav>
  );
}
