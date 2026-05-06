'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Login failed'); return; }
      router.push('/admin/enquiries');
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: "'Inter',sans-serif" }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <img src="/assets/heliosevent_logo_white.webp" alt="Helios Event" style={{ height: '48px', width: 'auto', marginBottom: '12px' }} />
          <div style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: '#adc905', fontWeight: 700 }}>Admin Portal</div>
        </div>

        {/* Card */}
        <div style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '36px 32px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg,#adc905,#ff6a00)' }} />

          <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>Sign in</h1>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '28px' }}>Access the Helios admin dashboard</p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.5)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '8px' }}>Email</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)} required autoFocus
                placeholder="admin@heliosevent.co"
                style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px 14px', fontSize: '14px', color: '#fff', outline: 'none', boxSizing: 'border-box', fontFamily: "'Inter',sans-serif" }}
              />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.5)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '8px' }}>Password</label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)} required
                placeholder="••••••••"
                style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px 14px', fontSize: '14px', color: '#fff', outline: 'none', boxSizing: 'border-box', fontFamily: "'Inter',sans-serif" }}
              />
            </div>

            {error && (
              <div style={{ background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.25)', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#ff8080', marginBottom: '20px' }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} style={{ width: '100%', background: loading ? 'rgba(173,201,5,0.5)' : 'linear-gradient(90deg,#adc905,#c8e205)', color: '#000', fontWeight: 700, fontSize: '14px', padding: '13px', border: 'none', borderRadius: '10px', cursor: loading ? 'not-allowed' : 'pointer', letterSpacing: '0.3px' }}>
              {loading ? 'Signing in…' : 'Sign in →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
