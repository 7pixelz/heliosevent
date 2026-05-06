import { prisma } from '../../../lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

function fmt(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

const STATUS_STYLES = {
  NEW: { bg: '#eff6ff', color: '#2563eb', dot: '#3b82f6' },
  CONTACTED: { bg: '#f0fdf4', color: '#16a34a', dot: '#22c55e' },
  CLOSED: { bg: '#f9fafb', color: '#6b7280', dot: '#9ca3af' },
};

export default async function DashboardPage() {
  const [counts, recent] = await Promise.all([
    prisma.quote.groupBy({ by: ['status'], _count: { _all: true } }),
    prisma.quote.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
  ]);

  const stats = { NEW: 0, CONTACTED: 0, CLOSED: 0, ALL: 0 };
  counts.forEach(c => {
    stats[c.status as keyof typeof stats] = c._count._all;
    stats.ALL += c._count._all;
  });

  const cards = [
    { label: 'Total Enquiries', value: stats.ALL, iconBg: '#4f6ef7', iconColor: '#fff' },
    { label: 'New', value: stats.NEW, iconBg: '#22c55e', iconColor: '#fff' },
    { label: 'Contacted', value: stats.CONTACTED, iconBg: '#a855f7', iconColor: '#fff' },
    { label: 'Closed', value: stats.CLOSED, iconBg: '#f97316', iconColor: '#fff' },
  ];

  const cardIcons = [
    <svg key="all" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
    <svg key="new" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>,
    <svg key="contacted" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.88a16 16 0 0 0 6.16 6.16l1.01-.9a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
    <svg key="closed" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#111', margin: 0 }}>Dashboard</h1>
        <p style={{ fontSize: '14px', color: '#888', margin: '6px 0 0' }}>Welcome to the admin panel</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '28px' }}>
        {cards.map((c, i) => (
          <div key={c.label} style={{
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}>
            <div>
              <div style={{ fontSize: '13px', color: '#888', marginBottom: '8px', fontWeight: 500 }}>{c.label}</div>
              <div style={{ fontSize: '36px', fontWeight: 800, color: '#111', lineHeight: 1 }}>{c.value}</div>
            </div>
            <div style={{
              width: '56px',
              height: '56px',
              background: c.iconBg,
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: c.iconColor,
            }}>
              {cardIcons[i]}
            </div>
          </div>
        ))}
      </div>

      {/* Recent enquiries */}
      <div style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#111' }}>Recent Enquiries</div>
            <div style={{ fontSize: '12px', color: '#aaa', marginTop: '2px' }}>Latest 5 submissions</div>
          </div>
          <Link href="/admin/enquiries" style={{
            fontSize: '13px', fontWeight: 600, color: '#5a7a00',
            textDecoration: 'none', padding: '7px 16px',
            background: '#f4fad5', borderRadius: '8px',
            border: '1px solid #d4e89a',
          }}>
            View all →
          </Link>
        </div>
        {recent.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#ccc', fontSize: '14px' }}>No enquiries yet.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#fafafa' }}>
                {['Name', 'Company', 'Team Size', 'Date', 'Status'].map(h => (
                  <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#999', letterSpacing: '1px', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recent.map(q => {
                const s = STATUS_STYLES[q.status as keyof typeof STATUS_STYLES];
                return (
                  <tr key={q.id} style={{ borderTop: '1px solid #f5f5f5' }}>
                    <td style={{ padding: '14px 20px' }}>
                      <a href={`/admin/enquiries/${q.id}`} style={{ fontWeight: 600, color: '#111', fontSize: '13px', textDecoration: 'none' }}>{q.name}</a>
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: '13px', color: '#555' }}>{q.company}</td>
                    <td style={{ padding: '14px 20px', fontSize: '13px', color: '#555' }}>{q.teamSize}</td>
                    <td style={{ padding: '14px 20px', fontSize: '12px', color: '#aaa' }}>{fmt(q.createdAt.toString())}</td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 700, background: s.bg, color: s.color, display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: s.dot, display: 'inline-block' }} />
                        {q.status}
                      </span>
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
