import { prisma } from '../../../lib/prisma';

export const dynamic = 'force-dynamic';

export default async function CareersAdminPage() {
  const applications = await prisma.careerApplication.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const statusColor: Record<string, string> = {
    NEW: '#adc905',
    REVIEWING: '#ff6a00',
    SHORTLISTED: '#2563eb',
    REJECTED: '#e53e3e',
    HIRED: '#22c55e',
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#1a1f2e', margin: '0 0 4px', fontFamily: "'Inter',sans-serif" }}>Career Applications</h1>
          <p style={{ fontSize: '13px', color: '#888', margin: 0, fontFamily: "'Inter',sans-serif" }}>{applications.length} total application{applications.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {applications.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: '14px', padding: '60px', textAlign: 'center', border: '1px solid #e8edf2' }}>
          <div style={{ fontSize: '36px', marginBottom: '12px' }}>📋</div>
          <div style={{ fontSize: '15px', color: '#888', fontFamily: "'Inter',sans-serif" }}>No applications yet.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {applications.map(app => (
            <div key={app.id} style={{ background: '#fff', border: '1px solid #e8edf2', borderRadius: '14px', padding: '20px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '15px', fontWeight: 700, color: '#1a1f2e', fontFamily: "'Inter',sans-serif" }}>{app.name}</span>
                    <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 10px', borderRadius: '999px', background: `${statusColor[app.status] || '#adc905'}18`, color: statusColor[app.status] || '#adc905', fontFamily: "'Inter',sans-serif", letterSpacing: '1px', textTransform: 'uppercase' }}>
                      {app.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#ff6a00', fontWeight: 600, fontFamily: "'Inter',sans-serif", marginBottom: '8px' }}>{app.position}</div>
                  <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '12px', color: '#666', fontFamily: "'Inter',sans-serif" }}>✉️ {app.email}</span>
                    <span style={{ fontSize: '12px', color: '#666', fontFamily: "'Inter',sans-serif" }}>📞 {app.phone}</span>
                    <span style={{ fontSize: '12px', color: '#666', fontFamily: "'Inter',sans-serif" }}>⏱ {app.experience}</span>
                    {app.currentRole && <span style={{ fontSize: '12px', color: '#666', fontFamily: "'Inter',sans-serif" }}>🏢 {app.currentRole}</span>}
                  </div>
                  {app.message && (
                    <div style={{ marginTop: '10px', fontSize: '13px', color: '#555', fontFamily: "'Inter',sans-serif", lineHeight: 1.6, maxWidth: '600px' }}>
                      {app.message.slice(0, 200)}{app.message.length > 200 ? '…' : ''}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                  <div style={{ fontSize: '11px', color: '#aaa', fontFamily: "'Inter',sans-serif", whiteSpace: 'nowrap' }}>
                    {new Date(app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                  {app.resumeUrl && (
                    <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', fontWeight: 700, color: '#fff', background: '#adc905', padding: '6px 14px', borderRadius: '7px', textDecoration: 'none', fontFamily: "'Inter',sans-serif", whiteSpace: 'nowrap' }}>
                      Download Resume
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
