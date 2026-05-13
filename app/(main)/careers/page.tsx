'use client';

import { useState } from 'react';

const BENEFITS = [
  { icon: '📚', title: 'Learning Opportunities', desc: 'We encourage our team members to learn continuously and add more skills to their arsenal.' },
  { icon: '👩‍💼', title: 'Women-Friendly Environment', desc: "We're strong advocates of women's rights and promote equal opportunities for working women." },
  { icon: '🏆', title: 'Employee Recognition', desc: 'We ensure that the hardest working people in our teams get the recognition they deserve.' },
  { icon: '🌿', title: 'Personal & Sick Leaves', desc: 'We promote a healthy work-life balance by providing ample amounts of personal and sick leaves.' },
  { icon: '🚀', title: 'Professional Development', desc: 'We help our employees realise their potential by opening opportunities for career growth.' },
  { icon: '🎁', title: 'Perks & Bonuses', desc: "We've built a work culture that enables employees to enjoy exclusive and unique benefits." },
];

const POSITIONS = [
  'Event Manager',
  'Event Coordinator',
  'Creative Designer',
  'Business Development Executive',
  'Marketing Executive',
  'Operations Executive',
  'Audio Visual Technician',
  'Other / Internship',
];

const EXPERIENCE_OPTIONS = [
  'Fresher (0–1 years)',
  '1–2 years',
  '2–4 years',
  '4–7 years',
  '7+ years',
];

const inp: React.CSSProperties = {
  width: '100%', padding: '11px 14px', borderRadius: '10px',
  border: '1px solid #e0e0e0', fontSize: '14px',
  fontFamily: "'Inter',sans-serif", color: '#111',
  outline: 'none', boxSizing: 'border-box', background: '#fff',
};
const label: React.CSSProperties = {
  display: 'block', fontSize: '11px', fontWeight: 700,
  letterSpacing: '1.5px', textTransform: 'uppercase',
  color: 'rgba(0,0,0,0.45)', fontFamily: "'Inter',sans-serif", marginBottom: '6px',
};

export default function CareersPage() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', position: '', experience: '',
    currentRole: '', message: '',
  });
  const [resume, setResume] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  function set(field: string, value: string) {
    setForm(p => ({ ...p, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.phone || !form.position || !form.experience) {
      setError('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (resume) fd.append('resume', resume);
      const res = await fetch('/api/careers', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Something went wrong.'); return; }
      setSuccess(true);
      setForm({ name: '', email: '', phone: '', position: '', experience: '', currentRole: '', message: '' });
      setResume(null);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      <style>{`
        .career-benefits { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }
        .career-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media(max-width:768px) {
          .career-benefits { grid-template-columns: 1fr; }
          .career-form-row { grid-template-columns: 1fr; }
        }
        input:focus, select:focus, textarea:focus { border-color: #adc905 !important; box-shadow: 0 0 0 3px rgba(173,201,5,0.1); }
      `}</style>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg,#1a1f2e 0%,#0f1318 100%)', padding: '100px 24px 72px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(173,201,5,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,106,0,0.06) 0%, transparent 40%)' }} />
        <div style={{ maxWidth: '860px', margin: '0 auto', position: 'relative', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(173,201,5,0.1)', border: '1px solid rgba(173,201,5,0.25)', borderRadius: '999px', padding: '6px 16px', marginBottom: '20px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#adc905', display: 'inline-block' }} />
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#adc905', fontFamily: "'Inter',sans-serif" }}>We're Hiring</span>
          </div>
          <h1 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 'clamp(28px,5vw,52px)', color: '#fff', lineHeight: 1.15, margin: '0 0 16px' }}>
            Join. Grow. Succeed.
          </h1>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.6)', fontFamily: "'Inter',sans-serif", maxWidth: '600px', margin: '0 auto', lineHeight: 1.8 }}>
            Helios Event is one of the most renowned names in the event management space. At Helios, you'll work on diverse, high-impact projects — from corporate summits and luxury weddings to global conferences and brand activations.
          </p>
        </div>
      </div>

      {/* Benefits */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '72px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: '#adc905', fontFamily: "'Inter',sans-serif", marginBottom: '10px' }}>Why Helios</div>
          <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 'clamp(24px,3.5vw,36px)', color: '#1a1f2e', margin: 0 }}>Benefits & Perks</h2>
          <p style={{ fontSize: '15px', color: '#666', fontFamily: "'Inter',sans-serif", marginTop: '12px', maxWidth: '540px', margin: '12px auto 0', lineHeight: 1.7 }}>
            With customer delight at the core of our business ethos, our practices are strongly rooted in our values.
          </p>
        </div>

        <div className="career-benefits">
          {BENEFITS.map(b => (
            <div key={b.title} style={{ background: '#fff', border: '1px solid #e8edf2', borderRadius: '16px', padding: '28px 24px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: '32px', marginBottom: '14px' }}>{b.icon}</div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#1a1f2e', fontFamily: "'Inter',sans-serif", marginBottom: '8px' }}>{b.title}</div>
              <div style={{ fontSize: '13px', color: '#666', fontFamily: "'Inter',sans-serif", lineHeight: 1.7 }}>{b.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Join section */}
      <div style={{ background: 'linear-gradient(135deg,#1a1f2e,#0f1318)', padding: '64px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 'clamp(22px,3vw,34px)', color: '#fff', margin: '0 0 16px' }}>
            Your journey toward professional growth starts here.
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.55)', fontFamily: "'Inter',sans-serif", lineHeight: 1.8, margin: 0 }}>
            Join a passionate team that thrives on creativity, precision, and turning big ideas into unforgettable experiences. Give your career a head start by associating with the leading event management service providers.
          </p>
        </div>
      </div>

      {/* Application Form */}
      <div style={{ maxWidth: '780px', margin: '0 auto', padding: '72px 24px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: '#adc905', fontFamily: "'Inter',sans-serif", marginBottom: '10px' }}>Apply Now</div>
          <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 'clamp(22px,3vw,32px)', color: '#1a1f2e', margin: 0 }}>Send Us Your Application</h2>
        </div>

        <div style={{ background: '#fff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.07)', border: '1px solid #e8edf2' }}>
          <div style={{ height: '3px', background: 'linear-gradient(90deg,#adc905,#ff6a00)' }} />
          <div style={{ padding: '36px' }}>

            {success ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ width: '68px', height: '68px', background: '#f0fdf4', border: '2px solid #22c55e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                </div>
                <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: '22px', color: '#111', marginBottom: '10px' }}>Application Submitted!</h3>
                <p style={{ fontSize: '14px', color: '#6b7280', fontFamily: "'Inter',sans-serif", lineHeight: 1.6, maxWidth: '360px', margin: '0 auto 28px' }}>
                  Thank you for your interest in Helios Event. Our HR team will review your profile and get back to you within 5–7 business days.
                </p>
                <button onClick={() => setSuccess(false)} style={{ padding: '11px 28px', background: '#adc905', color: '#fff', border: 'none', borderRadius: '9px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: "'Inter',sans-serif" }}>
                  Submit Another Application
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                {error && (
                  <div style={{ background: 'rgba(229,62,62,0.05)', border: '1px solid rgba(229,62,62,0.2)', borderRadius: '8px', padding: '12px 14px', marginBottom: '20px', fontSize: '13px', color: '#e53e3e', fontFamily: "'Inter',sans-serif" }}>
                    {error}
                  </div>
                )}

                <div className="career-form-row" style={{ marginBottom: '16px' }}>
                  <div>
                    <label style={label}>Full Name *</label>
                    <input type="text" placeholder="John Doe" value={form.name} onChange={e => set('name', e.target.value)} style={inp} required />
                  </div>
                  <div>
                    <label style={label}>Email Address *</label>
                    <input type="email" placeholder="you@example.com" value={form.email} onChange={e => set('email', e.target.value)} style={inp} required />
                  </div>
                </div>

                <div className="career-form-row" style={{ marginBottom: '16px' }}>
                  <div>
                    <label style={label}>Phone Number *</label>
                    <input type="tel" placeholder="+91 00000 00000" value={form.phone} onChange={e => set('phone', e.target.value)} style={inp} required />
                  </div>
                  <div>
                    <label style={label}>Position Applying For *</label>
                    <select value={form.position} onChange={e => set('position', e.target.value)} style={{ ...inp, appearance: 'none' }} required>
                      <option value="">Select a position</option>
                      {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                </div>

                <div className="career-form-row" style={{ marginBottom: '16px' }}>
                  <div>
                    <label style={label}>Years of Experience *</label>
                    <select value={form.experience} onChange={e => set('experience', e.target.value)} style={{ ...inp, appearance: 'none' }} required>
                      <option value="">Select experience</option>
                      {EXPERIENCE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={label}>Current Role / Company</label>
                    <input type="text" placeholder="e.g. Event Coordinator at XYZ" value={form.currentRole} onChange={e => set('currentRole', e.target.value)} style={inp} />
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={label}>Cover Letter / Message</label>
                  <textarea
                    placeholder="Tell us why you'd be a great fit for Helios Event..."
                    value={form.message}
                    onChange={e => set('message', e.target.value)}
                    rows={4}
                    style={{ ...inp, resize: 'vertical', lineHeight: 1.6 }}
                  />
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={label}>Resume / CV (PDF, DOC — max 5MB)</label>
                  <div style={{ border: '2px dashed #e0e0e0', borderRadius: '10px', padding: '20px', textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.2s' }}
                    onDragOver={e => { e.preventDefault(); (e.currentTarget as HTMLDivElement).style.borderColor = '#adc905'; }}
                    onDragLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#e0e0e0'; }}
                    onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) setResume(f); (e.currentTarget as HTMLDivElement).style.borderColor = '#e0e0e0'; }}
                  >
                    {resume ? (
                      <div style={{ fontFamily: "'Inter',sans-serif" }}>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#adc905' }}>✓ {resume.name}</div>
                        <button type="button" onClick={() => setResume(null)} style={{ marginTop: '6px', fontSize: '12px', color: '#e53e3e', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Inter',sans-serif" }}>Remove</button>
                      </div>
                    ) : (
                      <>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#adc905" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '8px' }}>
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        <div style={{ fontSize: '13px', color: '#666', fontFamily: "'Inter',sans-serif", marginBottom: '8px' }}>Drag & drop your resume here or</div>
                        <label style={{ display: 'inline-block', padding: '8px 20px', background: '#f0f4e8', borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: '#adc905', cursor: 'pointer', fontFamily: "'Inter',sans-serif" }}>
                          Browse File
                          <input type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) setResume(f); }} />
                        </label>
                      </>
                    )}
                  </div>
                </div>

                <button type="submit" disabled={loading} style={{
                  width: '100%', padding: '15px', borderRadius: '10px',
                  background: loading ? 'rgba(255,106,0,0.5)' : 'linear-gradient(90deg,#ff6a00,#ff8c38)',
                  color: '#fff', fontFamily: "'Inter',sans-serif", fontWeight: 700,
                  fontSize: '15px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: loading ? 'none' : '0 4px 16px rgba(255,106,0,0.3)',
                }}>
                  {loading ? 'Submitting…' : 'Submit Application →'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
