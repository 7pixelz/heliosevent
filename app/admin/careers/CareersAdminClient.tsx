'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Application {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  currentRole: string | null;
  message: string | null;
  resumeUrl: string | null;
  status: string;
  createdAt: string;
}

const STATUSES = [
  { value: 'NEW',        label: 'New',        color: '#adc905', bg: 'rgba(173,201,5,0.1)' },
  { value: 'REVIEWING',  label: 'Reviewing',  color: '#ff6a00', bg: 'rgba(255,106,0,0.1)' },
  { value: 'SHORTLISTED',label: 'Shortlisted',color: '#2563eb', bg: 'rgba(37,99,235,0.1)' },
  { value: 'ON_HOLD',    label: 'On Hold',    color: '#d97706', bg: 'rgba(217,119,6,0.1)' },
  { value: 'REJECTED',   label: 'Rejected',   color: '#e53e3e', bg: 'rgba(229,62,62,0.1)' },
  { value: 'HIRED',      label: 'Hired',      color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
];

function statusStyle(value: string) {
  return STATUSES.find(s => s.value === value) ?? STATUSES[0];
}

function resumeHref(resumeUrl: string) {
  const match = resumeUrl.match(/\/object\/career-resumes\/(.+)$/);
  const path = match ? match[1] : resumeUrl.startsWith('http') ? null : resumeUrl;
  return path ? `/api/admin/resume?path=${encodeURIComponent(path)}` : resumeUrl;
}

export default function CareersAdminClient({ applications: initial }: { applications: Application[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState('ALL');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  async function updateStatus(id: string, status: string) {
    setActionLoading(id + '_status');
    await fetch(`/api/admin/careers/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setActionLoading(null);
    router.refresh();
  }

  async function deleteApplication(id: string, name: string) {
    if (!confirm(`Delete application from "${name}"? This cannot be undone.`)) return;
    setActionLoading(id + '_delete');
    await fetch(`/api/admin/careers/${id}`, { method: 'DELETE' });
    setActionLoading(null);
    router.refresh();
  }

  const counts = STATUSES.reduce((acc, s) => {
    acc[s.value] = initial.filter(a => a.status === s.value).length;
    return acc;
  }, {} as Record<string, number>);

  const visible = filter === 'ALL' ? initial : initial.filter(a => a.status === filter);

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#1a1f2e', margin: '0 0 4px', fontFamily: "'Inter',sans-serif" }}>Career Applications</h1>
          <p style={{ fontSize: '13px', color: '#888', margin: 0, fontFamily: "'Inter',sans-serif" }}>{initial.length} total application{initial.length !== 1 ? 's' : ''}</p>
        </div>
        {/* Summary chips */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {STATUSES.filter(s => counts[s.value] > 0).map(s => (
            <div key={s.value} style={{ padding: '6px 14px', borderRadius: '999px', background: s.bg, color: s.color, fontSize: '12px', fontWeight: 700, fontFamily: "'Inter',sans-serif" }}>
              {s.label}: {counts[s.value]}
            </div>
          ))}
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '4px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '4px', marginBottom: '20px', width: 'fit-content', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
        {[{ value: 'ALL', label: 'All', count: initial.length }, ...STATUSES.map(s => ({ ...s, count: counts[s.value] }))].map(tab => (
          <button key={tab.value} onClick={() => setFilter(tab.value)}
            style={{
              padding: '7px 14px', borderRadius: '7px', fontSize: '12px', fontWeight: 600,
              cursor: 'pointer', border: 'none', fontFamily: "'Inter',sans-serif",
              background: filter === tab.value ? '#f0f7d4' : 'transparent',
              color: filter === tab.value ? '#7a9200' : '#888',
              transition: 'all 0.15s',
            }}>
            {tab.label} <span style={{ opacity: 0.6, marginLeft: '3px' }}>{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Applications list */}
      {visible.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: '14px', padding: '60px', textAlign: 'center', border: '1px solid #e8edf2' }}>
          <div style={{ fontSize: '36px', marginBottom: '12px' }}>📋</div>
          <div style={{ fontSize: '15px', color: '#888', fontFamily: "'Inter',sans-serif" }}>No applications found.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {visible.map(app => {
            const st = statusStyle(app.status);
            const isStatusLoading = actionLoading === app.id + '_status';
            const isDeleteLoading = actionLoading === app.id + '_delete';
            return (
              <div key={app.id} style={{ background: '#fff', border: '1px solid #e8edf2', borderRadius: '14px', padding: '20px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>

                  {/* Left: applicant info */}
                  <div style={{ flex: 1, minWidth: '240px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '15px', fontWeight: 700, color: '#1a1f2e', fontFamily: "'Inter',sans-serif" }}>{app.name}</span>
                      <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 10px', borderRadius: '999px', background: st.bg, color: st.color, fontFamily: "'Inter',sans-serif", letterSpacing: '1px', textTransform: 'uppercase' }}>
                        {st.label}
                      </span>
                    </div>
                    <div style={{ fontSize: '13px', color: '#ff6a00', fontWeight: 600, fontFamily: "'Inter',sans-serif", marginBottom: '8px' }}>{app.position}</div>
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: app.message ? '8px' : '0' }}>
                      <span style={{ fontSize: '12px', color: '#666', fontFamily: "'Inter',sans-serif" }}>✉️ {app.email}</span>
                      <span style={{ fontSize: '12px', color: '#666', fontFamily: "'Inter',sans-serif" }}>📞 {app.phone}</span>
                      <span style={{ fontSize: '12px', color: '#666', fontFamily: "'Inter',sans-serif" }}>⏱ {app.experience}</span>
                      {app.currentRole && <span style={{ fontSize: '12px', color: '#666', fontFamily: "'Inter',sans-serif" }}>🏢 {app.currentRole}</span>}
                    </div>
                    {app.message && (
                      <div style={{ fontSize: '13px', color: '#555', fontFamily: "'Inter',sans-serif", lineHeight: 1.6, maxWidth: '560px' }}>
                        {app.message.slice(0, 200)}{app.message.length > 200 ? '…' : ''}
                      </div>
                    )}
                  </div>

                  {/* Right: date + actions */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px', flexShrink: 0 }}>
                    <div style={{ fontSize: '11px', color: '#aaa', fontFamily: "'Inter',sans-serif", whiteSpace: 'nowrap' }}>
                      {new Date(app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>

                    {/* Status selector */}
                    <select
                      value={app.status}
                      disabled={isStatusLoading}
                      onChange={e => updateStatus(app.id, e.target.value)}
                      style={{
                        padding: '6px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 600,
                        fontFamily: "'Inter',sans-serif", border: `1px solid ${st.color}40`,
                        background: st.bg, color: st.color, cursor: 'pointer', outline: 'none',
                        opacity: isStatusLoading ? 0.6 : 1,
                      }}
                    >
                      {STATUSES.map(s => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      {app.resumeUrl && (
                        <a href={resumeHref(app.resumeUrl)} target="_blank" rel="noopener noreferrer"
                          style={{ fontSize: '12px', fontWeight: 700, color: '#fff', background: '#adc905', padding: '6px 14px', borderRadius: '7px', textDecoration: 'none', fontFamily: "'Inter',sans-serif", whiteSpace: 'nowrap' }}>
                          Resume ↓
                        </a>
                      )}
                      <button
                        onClick={() => deleteApplication(app.id, app.name)}
                        disabled={isDeleteLoading}
                        style={{
                          padding: '6px 10px', background: '#fee2e2', border: '1px solid #fca5a5',
                          borderRadius: '7px', color: '#b91c1c', fontSize: '13px', cursor: 'pointer',
                          fontFamily: "'Inter',sans-serif", opacity: isDeleteLoading ? 0.6 : 1,
                        }}>
                        {isDeleteLoading ? '…' : '🗑'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
