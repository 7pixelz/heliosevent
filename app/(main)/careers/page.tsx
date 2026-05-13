'use client';

import { useState } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { z } from 'zod';

const FormSchema = z.object({
  name:       z.string().min(2, 'Please enter your full name'),
  email:      z.string().email('Please enter a valid email address'),
  phone:      z.string().min(6, 'Please enter a valid phone number'),
  position:   z.string().min(2, 'Please enter the position you are applying for'),
  experience: z.string().min(1, 'Please select your experience level'),
});

type FormErrors = Partial<Record<keyof typeof FormSchema.shape, string>>;

const EXPERIENCE_OPTIONS = [
  'Fresher (0–1 years)',
  '1–2 years',
  '2–4 years',
  '4–7 years',
  '7+ years',
];

const BENEFITS = [
  { icon: '📚', title: 'Learning Opportunities', desc: 'We encourage our team members to learn continuously and add more skills to their arsenal.' },
  { icon: '👩‍💼', title: 'Women-Friendly Environment', desc: "We're strong advocates of women's rights and promote equal opportunities for working women." },
  { icon: '🏆', title: 'Employee Recognition', desc: 'We ensure that the hardest working people in our teams get the recognition they deserve.' },
  { icon: '🌿', title: 'Personal & Sick Leaves', desc: 'We promote a healthy work-life balance by providing ample amounts of personal and sick leaves.' },
  { icon: '🚀', title: 'Professional Development', desc: 'We help our employees realise their potential by opening opportunities for career growth.' },
  { icon: '🎁', title: 'Perks & Bonuses', desc: "We've built a work culture that enables employees to enjoy exclusive and unique benefits." },
];

const labelSt: React.CSSProperties = {
  display: 'block', fontSize: '10px', fontWeight: 700,
  letterSpacing: '1.6px', textTransform: 'uppercase',
  color: 'rgba(0,0,0,0.4)', fontFamily: "'Inter',sans-serif", marginBottom: '5px',
};

function Field({ label, required = false, error, children }: {
  label: string; required?: boolean; error?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label style={labelSt}>{label}{required && ' *'}</label>
      {children}
      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#e53e3e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span style={{ fontSize: '11px', color: '#e53e3e', fontFamily: "'Inter',sans-serif", fontWeight: 500 }}>{error}</span>
        </div>
      )}
    </div>
  );
}

function inp(hasError: boolean): React.CSSProperties {
  return {
    width: '100%', background: '#fff',
    border: `1px solid ${hasError ? '#e53e3e' : '#e0e0e0'}`,
    borderRadius: '10px', padding: '11px 12px', fontSize: '13px',
    fontFamily: "'Inter',sans-serif", color: '#111', outline: 'none',
    boxSizing: 'border-box',
    boxShadow: hasError ? '0 0 0 3px rgba(229,62,62,0.1)' : 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  };
}

const initialForm = {
  name: '', email: '', phone: '', position: '',
  experience: '', currentRole: '', message: '',
};

export default function CareersPage() {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<string, boolean>>>({});
  const [resume, setResume] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  function set(field: string, value: string) {
    setForm(p => ({ ...p, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors(p => ({ ...p, [field]: undefined }));
    }
  }

  function touch(field: string) {
    setTouched(p => ({ ...p, [field]: true }));
    const result = FormSchema.safeParse(form);
    if (!result.success) {
      const fe = result.error.flatten().fieldErrors[field as keyof FormErrors]?.[0];
      if (fe) setErrors(p => ({ ...p, [field]: fe }));
    }
  }

  function validate(): boolean {
    const result = FormSchema.safeParse(form);
    if (result.success) { setErrors({}); return true; }
    const fe: FormErrors = {};
    for (const [k, msgs] of Object.entries(result.error.flatten().fieldErrors)) {
      if (msgs?.[0]) fe[k as keyof FormErrors] = msgs[0];
    }
    setErrors(fe);
    setTouched({ name: true, email: true, phone: true, position: true, experience: true });
    return false;
  }

  const inpSt = (field: keyof FormErrors) => inp(!!errors[field] && !!touched[field]);
  const err = (field: keyof FormErrors) => touched[field] ? errors[field] : undefined;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    if (!executeRecaptcha) { setSubmitError('reCAPTCHA not ready, please try again.'); return; }
    setLoading(true); setSubmitError('');
    try {
      const recaptchaToken = await executeRecaptcha('career_application');
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append('recaptchaToken', recaptchaToken);
      if (resume) fd.append('resume', resume);
      const res = await fetch('/api/careers', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) { setSubmitError(data.error || 'Something went wrong.'); return; }
      setSuccess(true);
      setForm(initialForm); setErrors({}); setTouched({}); setResume(null);
    } catch {
      setSubmitError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      <style>{`
        .career-benefits { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }
        .career-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 12px; }
        @media(max-width:768px) {
          .career-benefits { grid-template-columns: 1fr; }
          .career-form-row { grid-template-columns: 1fr; }
        }
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

      {/* Join strip */}
      <div style={{ background: 'linear-gradient(135deg,#1a1f2e,#0f1318)', padding: '64px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 'clamp(22px,3vw,34px)', color: '#fff', margin: '0 0 16px' }}>
            Your journey toward professional growth starts here.
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.55)', fontFamily: "'Inter',sans-serif", lineHeight: 1.8, margin: 0 }}>
            Join a passionate team that thrives on creativity, precision, and turning big ideas into unforgettable experiences.
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
                <div style={{ marginBottom: '20px' }}>
                  <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: '20px', color: '#111', margin: '0 0 4px' }}>Your Details</h2>
                  <p style={{ fontSize: '13px', color: '#888', fontFamily: "'Inter',sans-serif", margin: 0 }}>Fields marked * are required.</p>
                </div>

                {/* Row 1 */}
                <div className="career-form-row">
                  <Field label="Full Name" required error={err('name')}>
                    <input type="text" placeholder="John Doe" value={form.name}
                      onChange={e => set('name', e.target.value)} onBlur={() => touch('name')}
                      style={inpSt('name')} />
                  </Field>
                  <Field label="Email Address" required error={err('email')}>
                    <input type="email" placeholder="you@example.com" value={form.email}
                      onChange={e => set('email', e.target.value)} onBlur={() => touch('email')}
                      style={inpSt('email')} />
                  </Field>
                </div>

                {/* Row 2 */}
                <div className="career-form-row">
                  <Field label="Phone Number" required error={err('phone')}>
                    <input type="tel" placeholder="+91 00000 00000" value={form.phone}
                      onChange={e => set('phone', e.target.value)} onBlur={() => touch('phone')}
                      style={inpSt('phone')} />
                  </Field>
                  <Field label="Position Applying For" required error={err('position')}>
                    <input type="text" placeholder="e.g. Event Manager, Designer…" value={form.position}
                      onChange={e => set('position', e.target.value)} onBlur={() => touch('position')}
                      style={inpSt('position')} />
                  </Field>
                </div>

                {/* Row 3 */}
                <div className="career-form-row">
                  <Field label="Years of Experience" required error={err('experience')}>
                    <select value={form.experience}
                      onChange={e => set('experience', e.target.value)} onBlur={() => touch('experience')}
                      style={{ ...inpSt('experience'), appearance: 'none' }}>
                      <option value="">Select experience</option>
                      {EXPERIENCE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </Field>
                  <Field label="Current Role / Company">
                    <input type="text" placeholder="e.g. Event Coordinator at XYZ" value={form.currentRole}
                      onChange={e => set('currentRole', e.target.value)}
                      style={inp(false)} />
                  </Field>
                </div>

                {/* Cover Letter */}
                <div style={{ marginBottom: '12px' }}>
                  <Field label="Cover Letter / Message">
                    <textarea placeholder="Tell us why you'd be a great fit for Helios Event…"
                      value={form.message} onChange={e => set('message', e.target.value)}
                      rows={4} style={{ ...inp(false), resize: 'vertical', lineHeight: 1.6 }} />
                  </Field>
                </div>

                {/* Resume Upload */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={labelSt}>Resume / CV (PDF, DOC — max 5MB)</label>
                  <div
                    style={{ border: `2px dashed ${resume ? '#adc905' : '#e0e0e0'}`, borderRadius: '10px', padding: '20px', textAlign: 'center', transition: 'border-color 0.2s' }}
                    onDragOver={e => { e.preventDefault(); (e.currentTarget as HTMLDivElement).style.borderColor = '#adc905'; }}
                    onDragLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = resume ? '#adc905' : '#e0e0e0'; }}
                    onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) setResume(f); }}
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
                          <input type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }}
                            onChange={e => { const f = e.target.files?.[0]; if (f) setResume(f); }} />
                        </label>
                      </>
                    )}
                  </div>
                </div>

                {submitError && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(229,62,62,0.05)', border: '1px solid rgba(229,62,62,0.2)', borderRadius: '8px', padding: '12px 14px', marginBottom: '16px' }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#e53e3e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <span style={{ fontSize: '13px', color: '#e53e3e', fontFamily: "'Inter',sans-serif" }}>{submitError}</span>
                  </div>
                )}

                <button type="submit" disabled={loading} style={{
                  width: '100%', padding: '15px', borderRadius: '10px',
                  background: loading ? 'rgba(255,106,0,0.5)' : 'linear-gradient(90deg,#ff6a00,#ff8c38)',
                  color: '#fff', fontFamily: "'Inter',sans-serif", fontWeight: 700,
                  fontSize: '15px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  boxShadow: loading ? 'none' : '0 4px 16px rgba(255,106,0,0.3)',
                }}>
                  {loading ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                      Submitting…
                    </>
                  ) : 'Submit Application →'}
                </button>

                <p style={{ fontSize: '11px', color: '#aaa', textAlign: 'center', marginTop: '12px', fontFamily: "'Inter',sans-serif" }}>
                  Protected by reCAPTCHA · Your data is safe with us
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
