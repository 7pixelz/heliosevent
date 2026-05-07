'use client';

import { useState } from 'react';

export default function AccountPage() {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(''); setSuccess(false);
    if (next !== confirm) { setError('New passwords do not match'); return; }
    if (next.length < 8) { setError('Password must be at least 8 characters'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Something went wrong'); return; }
      setSuccess(true);
      setCurrent(''); setNext(''); setConfirm('');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const inp: React.CSSProperties = {
    width: '100%', padding: '11px 14px', borderRadius: '8px',
    border: '1px solid #e0e0e0', fontSize: '14px',
    fontFamily: "'Inter',sans-serif", outline: 'none', boxSizing: 'border-box',
  };
  const label: React.CSSProperties = {
    display: 'block', fontSize: '12px', fontWeight: 600,
    color: '#555', marginBottom: '6px', fontFamily: "'Inter',sans-serif",
  };

  return (
    <div style={{ maxWidth: '480px' }}>
      <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#1a1f2e', marginBottom: '6px', fontFamily: "'Inter',sans-serif" }}>
        Change Password
      </h1>
      <p style={{ fontSize: '13px', color: '#888', marginBottom: '28px', fontFamily: "'Inter',sans-serif" }}>
        Update your admin account password.
      </p>

      <div style={{ background: '#fff', borderRadius: '14px', padding: '28px', border: '1px solid #e8edf2', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
        {success && (
          <div style={{ background: '#f0fdf4', border: '1px solid #22c55e', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', fontSize: '14px', color: '#166534', fontFamily: "'Inter',sans-serif" }}>
            ✓ Password updated successfully.
          </div>
        )}
        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', fontSize: '14px', color: '#991b1b', fontFamily: "'Inter',sans-serif" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={label}>Current Password</label>
            <input type="password" value={current} onChange={e => setCurrent(e.target.value)} style={inp} required />
          </div>
          <div>
            <label style={label}>New Password</label>
            <input type="password" value={next} onChange={e => setNext(e.target.value)} style={inp} required />
          </div>
          <div>
            <label style={label}>Confirm New Password</label>
            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} style={inp} required />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '12px', borderRadius: '8px',
              background: loading ? '#ccc' : '#adc905',
              border: 'none', color: '#fff', fontSize: '14px',
              fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: "'Inter',sans-serif", marginTop: '4px',
            }}
          >
            {loading ? 'Updating…' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
