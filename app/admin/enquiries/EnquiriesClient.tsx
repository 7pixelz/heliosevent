'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

interface Quote {
  id: string;
  name: string;
  email: string;
  phone: string;
  phoneCode: string;
  company: string;
  location: string;
  teamSize: string;
  budget: string;
  status: 'NEW' | 'CONTACTED' | 'CLOSED';
  createdAt: string;
  contactedAt: string | null;
  notes: string | null;
  preferredDate: string | null;
  typeOfProgram: string | null;
}

interface Props {
  quotes: Quote[];
  statusCounts: { NEW: number; CONTACTED: number; CLOSED: number; ALL: number };
  currentStatus?: string;
  currentSearch?: string;
}

const STATUS_STYLES = {
  NEW: { bg: '#eff6ff', color: '#2563eb', dot: '#3b82f6' },
  CONTACTED: { bg: '#f0fdf4', color: '#16a34a', dot: '#22c55e' },
  CLOSED: { bg: '#f9fafb', color: '#6b7280', dot: '#9ca3af' },
};

function fmt(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function EnquiriesClient({ quotes, statusCounts, currentStatus, currentSearch }: Props) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [search, setSearch] = useState(currentSearch ?? '');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  function applyFilter(status?: string, q?: string) {
    const params = new URLSearchParams();
    if (status && status !== 'ALL') params.set('status', status);
    if (q) params.set('q', q);
    startTransition(() => router.push(`/admin/enquiries?${params.toString()}`));
  }

  async function markContacted(id: string) {
    setActionLoading(id + '_contacted');
    await fetch(`/api/enquiries/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'CONTACTED' }) });
    setActionLoading(null);
    router.refresh();
  }

  async function markClosed(id: string) {
    setActionLoading(id + '_closed');
    await fetch(`/api/enquiries/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'CLOSED' }) });
    setActionLoading(null);
    router.refresh();
  }

  async function deleteEnquiry(id: string, name: string) {
    if (!confirm(`Delete enquiry from "${name}"? This cannot be undone.`)) return;
    setActionLoading(id + '_delete');
    await fetch(`/api/enquiries/${id}`, { method: 'DELETE' });
    setActionLoading(null);
    router.refresh();
  }

  const tabs = [
    { key: 'ALL', label: 'All', count: statusCounts.ALL },
    { key: 'NEW', label: 'New', count: statusCounts.NEW },
    { key: 'CONTACTED', label: 'Contacted', count: statusCounts.CONTACTED },
    { key: 'CLOSED', label: 'Closed', count: statusCounts.CLOSED },
  ];

  const activeTab = currentStatus?.toUpperCase() ?? 'ALL';

  return (
    <div>
      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#111', margin: 0 }}>Enquiries</h1>
          <p style={{ fontSize: '13px', color: '#888', margin: '4px 0 0' }}>{statusCounts.ALL} total enquiries received</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {[
            { label: 'New', count: statusCounts.NEW, color: '#2563eb', bg: '#eff6ff' },
            { label: 'Contacted', count: statusCounts.CONTACTED, color: '#16a34a', bg: '#f0fdf4' },
          ].map(s => (
            <div key={s.label} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '12px 20px', textAlign: 'center', minWidth: '80px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: '22px', fontWeight: 800, color: s.color }}>{s.count}</div>
              <div style={{ fontSize: '11px', color: '#aaa', marginTop: '2px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '4px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '4px', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
          {tabs.map(tab => (
            <button key={tab.key}
              onClick={() => applyFilter(tab.key === 'ALL' ? undefined : tab.key, search)}
              style={{ padding: '7px 16px', borderRadius: '7px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', border: 'none', background: activeTab === tab.key ? '#f0f7d4' : 'transparent', color: activeTab === tab.key ? '#7a9200' : '#888', transition: 'all 0.15s', fontFamily: "'Inter',sans-serif" }}
            >
              {tab.label} <span style={{ marginLeft: '4px', fontSize: '11px', opacity: 0.7 }}>{tab.count}</span>
            </button>
          ))}
        </div>

        <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && applyFilter(activeTab === 'ALL' ? undefined : activeTab, search)}
            placeholder="Search by name, email, company…"
            style={{ width: '100%', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '9px', padding: '9px 14px 9px 36px', fontSize: '13px', color: '#111', outline: 'none', boxSizing: 'border-box', fontFamily: "'Inter',sans-serif", boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}
          />
          <svg style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.35 }} width="14" height="14" viewBox="0 0 20 20" fill="none">
            <circle cx="9" cy="9" r="7" stroke="#111" strokeWidth="2"/>
            <path d="M14.5 14.5L18 18" stroke="#111" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <button onClick={() => applyFilter(activeTab === 'ALL' ? undefined : activeTab, search)}
          style={{ padding: '9px 18px', background: '#adc905', color: '#fff', border: 'none', borderRadius: '9px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: "'Inter',sans-serif" }}>
          Search
        </button>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
        {quotes.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#bbb', fontSize: '14px' }}>No enquiries found.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
                {['Name & Company', 'Contact', 'Team Size', 'Date', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#aaa', letterSpacing: '1px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {quotes.map((q, i) => {
                const s = STATUS_STYLES[q.status];
                return (
                  <tr key={q.id} style={{ borderTop: i > 0 ? '1px solid #f5f5f5' : 'none', transition: 'background 0.12s' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#fafafa'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                  >
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ fontWeight: 600, color: '#111', fontSize: '13px' }}>{q.name}</div>
                      <div style={{ fontSize: '12px', color: '#aaa', marginTop: '2px' }}>{q.company}</div>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ fontSize: '13px', color: '#444' }}>{q.email}</div>
                      <div style={{ fontSize: '12px', color: '#aaa', marginTop: '2px' }}>{q.phoneCode} {q.phone}</div>
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: '13px', color: '#555' }}>{q.teamSize}</td>
                    <td style={{ padding: '14px 20px', fontSize: '12px', color: '#aaa', whiteSpace: 'nowrap' }}>{fmt(q.createdAt)}</td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 700, background: s.bg, color: s.color, display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: s.dot, display: 'inline-block' }} />
                        {q.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        {q.status === 'NEW' && (
                          <button onClick={() => markContacted(q.id)} disabled={actionLoading === q.id + '_contacted'}
                            style={{ padding: '5px 12px', background: '#fff1f1', border: '1px solid #fca5a5', borderRadius: '7px', color: '#dc2626', fontSize: '11px', fontWeight: 700, cursor: 'pointer', fontFamily: "'Inter',sans-serif", whiteSpace: 'nowrap', opacity: actionLoading === q.id + '_contacted' ? 0.6 : 1 }}>
                            {actionLoading === q.id + '_contacted' ? '…' : 'Mark Contacted'}
                          </button>
                        )}
                        {q.status === 'CONTACTED' && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '5px 10px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '7px', color: '#16a34a', fontSize: '11px', fontWeight: 700, whiteSpace: 'nowrap' }}>
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                              Contacted
                            </span>
                            <button onClick={() => markClosed(q.id)} disabled={actionLoading === q.id + '_closed'}
                              style={{ padding: '5px 12px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '7px', color: '#6b7280', fontSize: '11px', fontWeight: 700, cursor: 'pointer', fontFamily: "'Inter',sans-serif", whiteSpace: 'nowrap', opacity: actionLoading === q.id + '_closed' ? 0.6 : 1 }}>
                              {actionLoading === q.id + '_closed' ? '…' : 'Close'}
                            </button>
                          </div>
                        )}
                        <a href={`/admin/enquiries/${q.id}`}
                          style={{ padding: '5px 12px', background: '#f8fce8', border: '1px solid #dff08a', borderRadius: '7px', color: '#7a9200', fontSize: '11px', fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                          View →
                        </a>
                        <button onClick={() => deleteEnquiry(q.id, q.name)} disabled={actionLoading === q.id + '_delete'}
                          style={{ padding: '5px 10px', background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '7px', color: '#b91c1c', fontSize: '11px', fontWeight: 700, cursor: 'pointer', fontFamily: "'Inter',sans-serif", opacity: actionLoading === q.id + '_delete' ? 0.6 : 1 }}>
                          {actionLoading === q.id + '_delete' ? '…' : '🗑'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
