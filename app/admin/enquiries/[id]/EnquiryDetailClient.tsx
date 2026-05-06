'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Quote {
  id: string;
  name: string;
  email: string;
  phone: string;
  phoneCode: string;
  company: string;
  location: string;
  teamSize: string;
  targetAudiences: string;
  budget: string;
  status: 'NEW' | 'CONTACTED' | 'CLOSED';
  createdAt: string;
  contactedAt: string | null;
  notes: string | null;
  preferredDate: string | null;
  duration: string | null;
  typeOfProgram: string | null;
  objectives: string | null;
  additionalRequirements: string | null;
  howDidYouHear: string | null;
}

interface Props { quote: Quote; }

const STATUS_STYLES = {
  NEW: { bg: '#eff6ff', color: '#2563eb', dot: '#3b82f6' },
  CONTACTED: { bg: '#f0fdf4', color: '#16a34a', dot: '#22c55e' },
  CLOSED: { bg: '#f9fafb', color: '#6b7280', dot: '#9ca3af' },
};

function fmt(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function Field({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div style={{ marginBottom: '18px' }}>
      <div style={{ fontSize: '10px', fontWeight: 700, color: '#aaa', letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontSize: '14px', color: '#333' }}>{value}</div>
    </div>
  );
}

const card: React.CSSProperties = { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '14px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' };

export default function EnquiryDetailClient({ quote }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [notes, setNotes] = useState(quote.notes ?? '');
  const [savingNotes, setSavingNotes] = useState(false);

  const s = STATUS_STYLES[quote.status];

  async function updateStatus(status: string) {
    setLoading(status);
    await fetch(`/api/enquiries/${quote.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setLoading(null);
    router.refresh();
  }

  async function saveNotes() {
    setSavingNotes(true);
    await fetch(`/api/enquiries/${quote.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes }),
    });
    setSavingNotes(false);
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
        <a href="/admin/enquiries" style={{ padding: '7px 14px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', color: '#555', fontSize: '12px', fontWeight: 600, textDecoration: 'none', fontFamily: "'Inter',sans-serif", boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
          ← Back
        </a>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#111', margin: 0 }}>{quote.name}</h1>
          <p style={{ fontSize: '13px', color: '#888', margin: '4px 0 0' }}>{quote.company} · Received {fmt(quote.createdAt)}</p>
        </div>
        <span style={{ padding: '5px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, background: s.bg, color: s.color, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: s.dot }} />
          {quote.status}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px', alignItems: 'start' }}>
        {/* Main */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={card}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#aaa', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '20px' }}>Contact Information</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 32px' }}>
              <Field label="Name" value={quote.name} />
              <Field label="Company" value={quote.company} />
              <Field label="Email" value={quote.email} />
              <Field label="Phone" value={`${quote.phoneCode} ${quote.phone}`} />
              <Field label="Location" value={quote.location} />
            </div>
          </div>

          <div style={card}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#aaa', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '20px' }}>Event Details</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 32px' }}>
              <Field label="Team Size" value={quote.teamSize} />
              <Field label="Budget" value={quote.budget} />
              <Field label="Target Audience" value={quote.targetAudiences} />
              <Field label="Type of Program" value={quote.typeOfProgram} />
              <Field label="Preferred Date" value={quote.preferredDate} />
              <Field label="Duration" value={quote.duration} />
            </div>
            <Field label="Objectives" value={quote.objectives} />
            <Field label="Additional Requirements" value={quote.additionalRequirements} />
            <Field label="How Did You Hear" value={quote.howDidYouHear} />
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={card}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#aaa', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '14px' }}>Actions</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {quote.status === 'NEW' && (
                <button onClick={() => updateStatus('CONTACTED')} disabled={loading === 'CONTACTED'}
                  style={{ padding: '10px', background: '#fff1f1', border: '1px solid #fca5a5', borderRadius: '8px', color: '#dc2626', fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: "'Inter',sans-serif", opacity: loading === 'CONTACTED' ? 0.6 : 1 }}>
                  {loading === 'CONTACTED' ? '…' : 'Mark as Contacted'}
                </button>
              )}
              {quote.status === 'CONTACTED' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 14px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', color: '#16a34a', fontSize: '12px', fontWeight: 700 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Contacted
                  </div>
                  <button onClick={() => updateStatus('CLOSED')} disabled={loading === 'CLOSED'}
                    style={{ padding: '10px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', color: '#6b7280', fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: "'Inter',sans-serif", opacity: loading === 'CLOSED' ? 0.6 : 1 }}>
                    {loading === 'CLOSED' ? '…' : 'Close Enquiry'}
                  </button>
                </div>
              )}
              {quote.status === 'CLOSED' && (
                <button onClick={() => updateStatus('NEW')} disabled={loading === 'NEW'}
                  style={{ padding: '10px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', color: '#2563eb', fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: "'Inter',sans-serif" }}>
                  {loading === 'NEW' ? '…' : 'Reopen'}
                </button>
              )}
              <a href={`mailto:${quote.email}`}
                style={{ padding: '10px', background: '#f8fce8', border: '1px solid #dff08a', borderRadius: '8px', color: '#7a9200', fontSize: '12px', fontWeight: 700, textDecoration: 'none', textAlign: 'center', fontFamily: "'Inter',sans-serif" }}>
                Send Email →
              </a>
            </div>
          </div>

          <div style={card}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#aaa', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '12px' }}>Notes</div>
            <textarea
              value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="Add notes about this enquiry…" rows={5}
              style={{ width: '100%', background: '#fafafa', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '10px 12px', fontSize: '13px', color: '#333', resize: 'vertical', outline: 'none', fontFamily: "'Inter',sans-serif", boxSizing: 'border-box' }}
            />
            <button onClick={saveNotes} disabled={savingNotes}
              style={{ marginTop: '8px', width: '100%', padding: '9px', background: savingNotes ? '#d4e84a' : '#adc905', color: '#fff', border: 'none', borderRadius: '7px', fontSize: '12px', fontWeight: 700, cursor: savingNotes ? 'not-allowed' : 'pointer', fontFamily: "'Inter',sans-serif" }}>
              {savingNotes ? 'Saving…' : 'Save Notes'}
            </button>
          </div>

          {quote.contactedAt && (
            <div style={card}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#aaa', letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: '4px' }}>Contacted At</div>
              <div style={{ fontSize: '13px', color: '#16a34a', fontWeight: 600 }}>{fmt(quote.contactedAt)}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
