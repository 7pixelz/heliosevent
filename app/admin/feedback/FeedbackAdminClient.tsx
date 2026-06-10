'use client';

import { useState } from 'react';

interface FeedbackEntry {
  id: string;
  service: number;
  timeline: number;
  appreciation: number;
  referral: number;
  experience: string | null;
  name: string;
  email: string | null;
  submittedAt: string;
}

const ACCENT = '#adc905';

function Stars({ n }: { n: number }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill={i < n ? ACCENT : '#d1d5db'}>
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
        </svg>
      ))}
      <span style={{ marginLeft: '6px', fontWeight: 700, color: '#374151', fontSize: '12px' }}>{n}/5</span>
    </span>
  );
}

function avg(e: FeedbackEntry) {
  return ((e.service + e.timeline + e.appreciation + e.referral) / 4).toFixed(1);
}


function avgColor(a: number) {
  if (a >= 8) return '#22c55e';
  if (a >= 6) return '#f59e0b';
  return '#ef4444';
}

export default function FeedbackAdminClient({ entries }: { entries: FeedbackEntry[] }) {
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [list, setList] = useState(entries);

  const visible = list.filter(e => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      e.name?.toLowerCase().includes(q) ||
      e.email?.toLowerCase().includes(q)
    );
  });

  const overallAvg = list.length
    ? (list.reduce((s, e) => s + parseFloat(avg(e)), 0) / list.length).toFixed(1)
    : '—';

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete feedback from "${name}"? This cannot be undone.`)) return;
    setDeleteId(id);
    await fetch(`/api/admin/feedback/${id}`, { method: 'DELETE' });
    setDeleteId(null);
    setList(prev => prev.filter(e => e.id !== id));
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#1a1f2e', margin: '0 0 4px', fontFamily: "'Inter',sans-serif" }}>Client Feedback</h1>
          <p style={{ fontSize: '13px', color: '#888', margin: 0, fontFamily: "'Inter',sans-serif" }}>
            {list.length} submission{list.length !== 1 ? 's' : ''}
            {list.length > 0 && (
              <span style={{ marginLeft: '12px', fontWeight: 700, color: avgColor(parseFloat(overallAvg)) }}>
                Avg {overallAvg}/10
              </span>
            )}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          {['Service', 'Timeline', 'Appreciation', 'Referral'].map(label => {
            const key = label.toLowerCase() as keyof FeedbackEntry;
            const a = list.length ? (list.reduce((s, e) => s + (e[key] as number), 0) / list.length).toFixed(1) : '—';
            return (
              <div key={label} style={{ padding: '6px 14px', borderRadius: '999px', background: '#f0f7d4', fontSize: '12px', fontWeight: 700, fontFamily: "'Inter',sans-serif", color: '#5a7200' }}>
                {label}: {a}
              </div>
            );
          })}
        </div>
      </div>

      {/* Search */}
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search by name or email…"
        style={{
          width: '100%', maxWidth: '380px', padding: '10px 16px', borderRadius: '10px',
          border: '1px solid #e5e7eb', fontSize: '13px', fontFamily: "'Inter',sans-serif",
          outline: 'none', marginBottom: '20px', boxSizing: 'border-box',
        }}
      />

      {/* List */}
      {visible.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: '14px', padding: '60px', textAlign: 'center', border: '1px solid #e8edf2' }}>
          <div style={{ fontSize: '36px', marginBottom: '12px' }}>⭐</div>
          <div style={{ fontSize: '15px', color: '#888', fontFamily: "'Inter',sans-serif" }}>
            {list.length === 0 ? 'No feedback submitted yet.' : 'No results match your search.'}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {visible.map(entry => {
            const a = parseFloat(avg(entry));
            const isDeleting = deleteId === entry.id;
            return (
              <div key={entry.id} style={{ background: '#fff', border: '1px solid #e8edf2', borderRadius: '14px', padding: '20px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', opacity: isDeleting ? 0.5 : 1, transition: 'opacity 0.2s' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>

                  {/* Left */}
                  <div style={{ flex: 1, minWidth: '280px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '15px', fontWeight: 700, color: '#1a1f2e', fontFamily: "'Inter',sans-serif" }}>{entry.name}</span>
                      <span style={{ fontSize: '13px', fontWeight: 800, color: avgColor(a), background: `${avgColor(a)}18`, padding: '2px 10px', borderRadius: '999px', fontFamily: "'Inter',sans-serif" }}>
                        Avg {avg(entry)}/5
                      </span>
                    </div>
                    {entry.email && (
                      <div style={{ fontSize: '12px', color: '#666', fontFamily: "'Inter',sans-serif", marginBottom: '10px' }}>✉️ {entry.email}</div>
                    )}

                    {/* Ratings */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '14px' }}>
                      {[
                        { label: 'Service',    val: entry.service },
                        { label: 'Timeline',   val: entry.timeline },
                        { label: 'Appreciation', val: entry.appreciation },
                        { label: 'Referral',   val: entry.referral },
                      ].map(({ label, val }) => (
                        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: "'Inter',sans-serif", width: '100px', flexShrink: 0 }}>{label}</span>
                          <Stars n={val} />
                        </div>
                      ))}
                    </div>

                  </div>

                  {/* Right */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px', flexShrink: 0 }}>
                    <div style={{ fontSize: '11px', color: '#aaa', fontFamily: "'Inter',sans-serif", whiteSpace: 'nowrap' }}>
                      {new Date(entry.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                    <button
                      onClick={() => handleDelete(entry.id, entry.name)}
                      disabled={isDeleting}
                      style={{
                        padding: '6px 10px', background: '#fee2e2', border: '1px solid #fca5a5',
                        borderRadius: '7px', color: '#b91c1c', fontSize: '13px', cursor: 'pointer',
                        fontFamily: "'Inter',sans-serif", opacity: isDeleting ? 0.6 : 1,
                      }}>
                      {isDeleting ? '…' : '🗑'}
                    </button>
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
