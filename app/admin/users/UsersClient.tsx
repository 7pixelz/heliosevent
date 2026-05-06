'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'SUPER_ADMIN';
  createdAt: string;
}

interface Props { users: AdminUser[] }

function fmt(d: string) {
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

const card: React.CSSProperties = {
  background: '#fff', border: '1px solid #e5e7eb',
  borderRadius: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
};

export default function UsersClient({ users: initial }: Props) {
  const router = useRouter();
  const [users, setUsers] = useState(initial);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'ADMIN' });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  function setF(k: string, v: string) { setForm(p => ({ ...p, [k]: v })); }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setFormError('');
    const res = await fetch('/api/admin/users', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) { setFormError(data.error || 'Failed to create user'); setSaving(false); return; }
    setUsers(u => [...u, data]);
    setShowAdd(false);
    setForm({ name: '', email: '', password: '', role: 'ADMIN' });
    setSaving(false);
  }

  async function changeRole(id: string, role: string) {
    setActionLoading(id + '_role');
    const res = await fetch(`/api/admin/users/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    });
    if (res.ok) {
      const updated = await res.json();
      setUsers(u => u.map(x => x.id === id ? updated : x));
    }
    setActionLoading(null);
  }

  async function deleteUser(id: string) {
    setActionLoading(id + '_del');
    const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
    if (res.ok) setUsers(u => u.filter(x => x.id !== id));
    setActionLoading(null);
    setDeleteConfirm(null);
  }

  const inputSt: React.CSSProperties = {
    width: '100%', background: '#f9fafb', border: '1px solid #e5e7eb',
    borderRadius: '8px', padding: '10px 12px', fontSize: '13px',
    color: '#111', outline: 'none', boxSizing: 'border-box', fontFamily: "'Inter',sans-serif",
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#111', margin: 0 }}>Admin Users</h1>
          <p style={{ fontSize: '13px', color: '#888', margin: '4px 0 0' }}>{users.length} admin account{users.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setShowAdd(true)} style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '10px 18px', background: '#1a1f2e', color: '#fff',
          border: 'none', borderRadius: '9px', fontSize: '13px', fontWeight: 700,
          cursor: 'pointer', fontFamily: "'Inter',sans-serif",
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Admin
        </button>
      </div>

      {/* Add User Modal */}
      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '440px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#111', margin: 0 }}>Add Admin User</h2>
              <button onClick={() => { setShowAdd(false); setFormError(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', padding: '4px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAdd}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#888', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>Full Name</label>
                <input type="text" required placeholder="John Doe" value={form.name} onChange={e => setF('name', e.target.value)} style={inputSt} />
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#888', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>Email</label>
                <input type="email" required placeholder="admin@heliosevent.co" value={form.email} onChange={e => setF('email', e.target.value)} style={inputSt} />
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#888', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>Password</label>
                <input type="password" required placeholder="Min. 8 characters" value={form.password} onChange={e => setF('password', e.target.value)} style={inputSt} />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#888', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>Role</label>
                <select value={form.role} onChange={e => setF('role', e.target.value)} style={{ ...inputSt }}>
                  <option value="ADMIN">Admin</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                </select>
              </div>

              {formError && (
                <div style={{ background: '#fff1f1', border: '1px solid #fca5a5', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#dc2626', marginBottom: '16px', fontFamily: "'Inter',sans-serif" }}>
                  {formError}
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => { setShowAdd(false); setFormError(''); }} style={{ flex: 1, padding: '11px', background: '#f5f5f5', border: '1px solid #e5e7eb', borderRadius: '8px', color: '#555', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter',sans-serif" }}>
                  Cancel
                </button>
                <button type="submit" disabled={saving} style={{ flex: 1, padding: '11px', background: '#1a1f2e', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: "'Inter',sans-serif", opacity: saving ? 0.7 : 1 }}>
                  {saving ? 'Creating…' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '380px', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ width: '52px', height: '52px', background: '#fff1f1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" />
              </svg>
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#111', marginBottom: '8px' }}>Delete Admin User?</h3>
            <p style={{ fontSize: '13px', color: '#888', marginBottom: '24px', fontFamily: "'Inter',sans-serif" }}>This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setDeleteConfirm(null)} style={{ flex: 1, padding: '11px', background: '#f5f5f5', border: '1px solid #e5e7eb', borderRadius: '8px', color: '#555', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter',sans-serif" }}>
                Cancel
              </button>
              <button onClick={() => deleteUser(deleteConfirm)} disabled={!!actionLoading} style={{ flex: 1, padding: '11px', background: '#dc2626', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: "'Inter',sans-serif" }}>
                {actionLoading ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div style={{ ...card, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
              {['User', 'Email', 'Role', 'Joined', 'Actions'].map(h => (
                <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#999', letterSpacing: '1px', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={u.id} style={{ borderTop: i > 0 ? '1px solid #f5f5f5' : 'none' }}>
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg,#adc905,#ff6a00)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '14px', color: '#fff', flexShrink: 0, fontFamily: "'Inter',sans-serif" }}>
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontWeight: 600, fontSize: '14px', color: '#111' }}>{u.name}</span>
                  </div>
                </td>
                <td style={{ padding: '16px 20px', fontSize: '13px', color: '#555' }}>{u.email}</td>
                <td style={{ padding: '16px 20px' }}>
                  <select
                    value={u.role}
                    onChange={e => changeRole(u.id, e.target.value)}
                    disabled={actionLoading === u.id + '_role'}
                    style={{
                      padding: '5px 10px', fontSize: '12px', fontWeight: 700,
                      border: '1px solid #e5e7eb', borderRadius: '7px', cursor: 'pointer',
                      background: u.role === 'SUPER_ADMIN' ? '#f5f3ff' : '#f0f9ff',
                      color: u.role === 'SUPER_ADMIN' ? '#7c3aed' : '#0369a1',
                      outline: 'none', fontFamily: "'Inter',sans-serif",
                    }}
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                  </select>
                </td>
                <td style={{ padding: '16px 20px', fontSize: '12px', color: '#aaa', whiteSpace: 'nowrap' }}>{fmt(u.createdAt)}</td>
                <td style={{ padding: '16px 20px' }}>
                  <button
                    onClick={() => setDeleteConfirm(u.id)}
                    disabled={actionLoading === u.id + '_del'}
                    style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', background: '#fff1f1', border: '1px solid #fca5a5', borderRadius: '7px', color: '#dc2626', fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: "'Inter',sans-serif" }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    </svg>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
