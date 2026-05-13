'use client';

import { usePathname, useRouter } from 'next/navigation';

interface Props {
  user: { name: string; email: string; role: string };
}

const navItems = [
  {
    href: '/admin/dashboard',
    label: 'Dashboard',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    href: '/admin/enquiries',
    label: 'Enquiries',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    href: '/admin/users',
    label: 'Admin Users',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    href: '/admin/clients',
    label: 'Client Logos',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
  },
  {
    href: '/admin/services',
    label: 'Services',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    href: '/admin/blog',
    label: 'Blog Posts',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
  },
  {
    href: '/admin/portfolio',
    label: 'Portfolio',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    href: '/admin/careers',
    label: 'Careers',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      </svg>
    ),
  },
  {
    href: '/admin/seo',
    label: 'SEO',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
      </svg>
    ),
  },
  {
    href: '/admin/hero',
    label: 'Hero Slides',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
  },
];

export default function AdminSidebar({ user }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <aside style={{
      background: '#1a1f2e',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Inter', sans-serif",
    }}>

      {/* Logo */}
      <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <img
          src="/assets/heliosevent_logo_white.webp"
          alt="Helios Event"
          style={{ height: '36px', width: 'auto', display: 'block' }}
        />
        <div style={{
          marginTop: '6px', fontSize: '9px', letterSpacing: '3px',
          textTransform: 'uppercase', color: '#adc905', fontWeight: 700,
        }}>
          Admin Portal
        </div>
      </div>

      {/* Menu label */}
      <div style={{
        padding: '20px 16px 8px',
        fontSize: '11px', fontWeight: 700, letterSpacing: '2px',
        textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)',
      }}>
        Menu
      </div>

      {/* Nav items — using div to avoid global nav CSS */}
      <div style={{ padding: '0 10px', flex: 1 }}>
        {navItems.map(item => {
          const active = pathname === item.href ||
            (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));

          return (
            <a
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '11px 14px',
                borderRadius: '8px',
                marginBottom: '2px',
                fontSize: '14px',
                fontWeight: 500,
                textDecoration: 'none',
                color: active ? '#ffffff' : 'rgba(255,255,255,0.55)',
                background: active ? 'rgba(173,201,5,0.15)' : 'transparent',
                borderLeft: active ? '3px solid #adc905' : '3px solid transparent',
              }}
            >
              <span style={{ color: active ? '#adc905' : 'rgba(255,255,255,0.4)' }}>
                {item.icon}
              </span>
              {item.label}
            </a>
          );
        })}
      </div>

      {/* User info */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #adc905, #ff6a00)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: '14px', color: '#fff',
          }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>{user.name}</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>
              {user.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'}
            </div>
          </div>
        </div>

        <a
          href="/admin/account"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            width: '100%', padding: '11px', marginBottom: '8px',
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px', color: 'rgba(255,255,255,0.7)',
            fontSize: '13px', fontWeight: 600, textDecoration: 'none',
            fontFamily: "'Inter', sans-serif", boxSizing: 'border-box',
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          Change Password
        </a>

        <button
          onClick={handleLogout}
          style={{
            width: '100%', padding: '11px',
            background: '#e53e3e', border: 'none', borderRadius: '8px',
            color: '#fff', fontSize: '13px', fontWeight: 600,
            cursor: 'pointer', fontFamily: "'Inter', sans-serif",
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
}
