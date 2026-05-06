'use client';

import { useRouter } from 'next/navigation';

interface Props {
  user: { name: string; email: string; role: string };
}

export default function AdminHeader({ user }: Props) {
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <header style={{ background: '#0f0f0f', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <img src="/assets/heliosevent_logo_white.webp" alt="Helios" style={{ height: '36px', width: 'auto' }} />
        <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.15)' }} />
        <span style={{ fontFamily: "'Inter',sans-serif", fontSize: '12px', fontWeight: 700, color: '#adc905', letterSpacing: '2px', textTransform: 'uppercase' }}>Admin</span>
      </div>

      {/* Nav */}
      <nav style={{ display: 'flex', gap: '4px' }}>
        {[
          { label: 'Enquiries', href: '/admin/enquiries' },
          { label: 'Dashboard', href: '/admin' },
        ].map((item) => (
          <a key={item.href} href={item.href} style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.6)', fontFamily: "'Inter',sans-serif", textDecoration: 'none', transition: 'all 0.15s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)'; }}
          >
            {item.label}
          </a>
        ))}
      </nav>

      {/* User + Logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff', fontFamily: "'Inter',sans-serif" }}>{user.name}</div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontFamily: "'Inter',sans-serif" }}>
            {user.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'}
          </div>
        </div>
        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg,#adc905,#ff6a00)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: '14px', color: '#000' }}>
          {user.name.charAt(0).toUpperCase()}
        </div>
        <button onClick={handleLogout} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'rgba(255,255,255,0.6)', fontSize: '12px', fontWeight: 600, fontFamily: "'Inter',sans-serif", cursor: 'pointer', transition: 'all 0.15s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,80,80,0.12)'; (e.currentTarget as HTMLElement).style.color = '#ff6b6b'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,80,80,0.3)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)'; }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}
