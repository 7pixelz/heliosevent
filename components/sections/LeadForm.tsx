'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGoogleReCaptcha, GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { z } from 'zod';
import CountryPicker from '../CountryPicker';

const Schema = z.object({
  name: z.string().min(2, 'Please enter your full name'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(6, 'Please enter a valid phone number'),
  company: z.string().min(1, 'Company name is required'),
  location: z.string().min(1, 'Location is required'),
  typeOfProgram: z.string().min(1, 'Please select a type of event'),
});

type Errors = Partial<Record<keyof typeof Schema.shape, string>>;

const EVENT_TYPES = [
  'Corporate Events', 'Entertainment Events', 'Exhibitions',
  'Government Protocol Events', 'Trade Body Association Events',
  'MICE Events', 'Sports Events', 'Wedding & Social Events',
  'Team Building', 'Corporate Games', 'Cultural Performances',
  'Employee Engagement', 'Conferences & Seminars', 'Brand Activations',
  'Other',
];

const init = {
  name: '', email: '', phoneCode: '+91', phone: '',
  company: '', location: '', typeOfProgram: '',
  teamSize: '', budget: '', preferredDate: '', howDidYouHear: '',
};

const labelSt: React.CSSProperties = {
  display: 'block', fontSize: '10px', fontWeight: 700,
  letterSpacing: '1.8px', textTransform: 'uppercase',
  color: 'rgba(0,0,0,0.4)', fontFamily: "'Inter',sans-serif", marginBottom: '6px',
};

function Field({ label, required = false, error, children }: {
  label: string; required?: boolean; error?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label style={labelSt}>{label}{required && ' *'}</label>
      {children}
      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '5px' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#e53e3e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span style={{ fontSize: '11px', color: '#e53e3e', fontFamily: "'Inter',sans-serif", fontWeight: 500 }}>{error}</span>
        </div>
      )}
    </div>
  );
}

function inputStyle(hasError: boolean): React.CSSProperties {
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

function LeadFormInner() {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const router = useRouter();
  const [form, setForm] = useState(init);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<string, boolean>>>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  function set(field: string, val: string) {
    setForm(p => ({ ...p, [field]: val }));
    if (errors[field as keyof Errors]) setErrors(p => ({ ...p, [field]: undefined }));
  }

  function touch(field: string) {
    setTouched(p => ({ ...p, [field]: true }));
    const r = Schema.safeParse(form);
    if (!r.success) {
      const fe = r.error.flatten().fieldErrors[field as keyof Errors]?.[0];
      if (fe) setErrors(p => ({ ...p, [field]: fe }));
    }
  }

  function validate() {
    const r = Schema.safeParse(form);
    if (r.success) { setErrors({}); return true; }
    const fe: Errors = {};
    for (const [k, msgs] of Object.entries(r.error.flatten().fieldErrors)) {
      if (msgs?.[0]) fe[k as keyof Errors] = msgs[0];
    }
    setErrors(fe);
    setTouched({ name: true, email: true, phone: true, company: true, location: true, typeOfProgram: true });
    return false;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    if (!executeRecaptcha) { setSubmitError('reCAPTCHA not ready. Please try again.'); return; }
    setLoading(true); setSubmitError('');
    try {
      const recaptchaToken = await executeRecaptcha('lead_form');
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, recaptchaToken, website: '' }),
      });
      const data = await res.json();
      if (!res.ok) { setSubmitError(data.error || 'Something went wrong.'); return; }
      router.push('/thankyou');
      setForm(init); setErrors({}); setTouched({});
    } catch {
      setSubmitError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const err = (f: keyof Errors) => touched[f] ? errors[f] : undefined;
  const inpSt = (f: keyof Errors) => inputStyle(!!errors[f] && !!touched[f]);

  return (
    <section style={{ background: 'linear-gradient(135deg,#1a1f2e 0%,#0f1318 100%)', padding: '72px 24px' }}>
      <style>{`
        .lf-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 16px; }
        .lf-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; }
        @media (max-width: 900px) { .lf-grid { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 600px) { .lf-grid, .lf-grid-2 { grid-template-columns: 1fr; } }
      `}</style>

      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(173,201,5,0.1)', border: '1px solid rgba(173,201,5,0.25)', borderRadius: '999px', padding: '5px 16px', marginBottom: '16px' }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#adc905', display: 'inline-block' }} />
            <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#adc905', fontFamily: "'Inter',sans-serif" }}>Free Quote · No Obligation</span>
          </div>
          <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 'clamp(24px,4vw,38px)', color: '#fff', margin: '0 0 12px', lineHeight: 1.2 }}>
            Let's Plan Your Next Event
          </h2>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', fontFamily: "'Inter',sans-serif", margin: 0 }}>
            Share a few details and we'll send you a personalised proposal within 24 hours.
          </p>
        </div>

        {/* White card */}
        <div style={{ background: '#fff', border: '1px solid #e8edf2', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.15)' }}>
          <div style={{ height: '4px', background: 'linear-gradient(90deg,#adc905,#ff6a00)' }} />
          <div style={{ padding: '36px' }}>
            <form onSubmit={handleSubmit} noValidate>
              <div style={{ marginBottom: '28px' }}>
                <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: '22px', color: '#111', margin: '0 0 6px' }}>Free Event Budget Consultation</h3>
                <p style={{ fontSize: '13px', color: '#888', fontFamily: "'Inter',sans-serif", margin: 0 }}>Fields marked * are required.</p>
              </div>

              {/* Required fields */}
              <div className="lf-grid">
                <Field label="Your Name" required error={err('name')}>
                  <input type="text" placeholder="John Doe" value={form.name}
                    onChange={e => set('name', e.target.value)} onBlur={() => touch('name')}
                    style={inpSt('name')} />
                </Field>
                <Field label="Official Email" required error={err('email')}>
                  <input type="email" placeholder="example@domain.com" value={form.email}
                    onChange={e => set('email', e.target.value)} onBlur={() => touch('email')}
                    style={inpSt('email')} />
                </Field>
                <Field label="Phone Number" required error={err('phone')}>
                  <div style={{
                    display: 'flex', alignItems: 'center', background: '#fff',
                    border: `1px solid ${errors.phone && touched.phone ? '#e53e3e' : '#e0e0e0'}`,
                    borderRadius: '10px', padding: '0 12px', height: '42px',
                    boxShadow: errors.phone && touched.phone ? '0 0 0 3px rgba(229,62,62,0.1)' : 'none',
                    transition: 'border-color 0.2s',
                  }}>
                    <CountryPicker onSelect={code => set('phoneCode', code)} />
                    <input type="tel" placeholder="00000 00000" value={form.phone}
                      onChange={e => set('phone', e.target.value.replace(/[^0-9+\s\-()]/g, ''))}
                      onBlur={() => touch('phone')}
                      style={{ flex: 1, background: 'transparent', border: 'none', color: '#111', fontSize: '13px', fontFamily: "'Inter',sans-serif", outline: 'none', minWidth: 0, marginLeft: '8px' }} />
                  </div>
                </Field>
              </div>

              <div className="lf-grid">
                <Field label="Company Name" required error={err('company')}>
                  <input type="text" placeholder="Acme Corp" value={form.company}
                    onChange={e => set('company', e.target.value)} onBlur={() => touch('company')}
                    style={inpSt('company')} />
                </Field>
                <Field label="Location / Venue" required error={err('location')}>
                  <input type="text" placeholder="Chennai / Bangalore" value={form.location}
                    onChange={e => set('location', e.target.value)} onBlur={() => touch('location')}
                    style={inpSt('location')} />
                </Field>
                <Field label="Type of Event" required error={err('typeOfProgram')}>
                  <select value={form.typeOfProgram}
                    onChange={e => set('typeOfProgram', e.target.value)}
                    onBlur={() => touch('typeOfProgram')}
                    style={{ ...inpSt('typeOfProgram'), appearance: 'none', cursor: 'pointer', paddingRight: '32px', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}>
                    <option value="">Select event type…</option>
                    {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </Field>
              </div>

              {/* Info banner */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', background: 'rgba(173,201,5,0.06)', border: '1px solid rgba(173,201,5,0.2)', borderRadius: '10px', padding: '12px 16px', marginBottom: '24px' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#adc905" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '1px' }}>
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="8" /><line x1="12" y1="12" x2="12" y2="16" />
                </svg>
                <p style={{ fontSize: '12px', color: '#5a6800', fontFamily: "'Inter',sans-serif", lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
                  The more details you share, the more curated and personalized we can make the package.
                </p>
              </div>

              {/* Optional section */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ height: '1px', flex: 1, background: '#e8edf2' }} />
                <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#bbb', fontFamily: "'Inter',sans-serif", whiteSpace: 'nowrap' }}>Optional details</span>
                <div style={{ height: '1px', flex: 1, background: '#e8edf2' }} />
              </div>

              <div className="lf-grid">
                <Field label="Team Size">
                  <input type="text" placeholder="30 / 50 / 100 / 200+" value={form.teamSize}
                    onChange={e => set('teamSize', e.target.value)}
                    style={inputStyle(false)} />
                </Field>
                <Field label="Budget">
                  <input type="text" placeholder="₹50K / ₹2L / ₹5L+" value={form.budget}
                    onChange={e => set('budget', e.target.value)}
                    style={inputStyle(false)} />
                </Field>
                <Field label="Preferred Date">
                  <input type="date" value={form.preferredDate}
                    onChange={e => set('preferredDate', e.target.value)}
                    style={inputStyle(false)} />
                </Field>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <Field label="How Did You Hear About Us?">
                  <input type="text" placeholder="Google / LinkedIn / Referral / Word of mouth" value={form.howDidYouHear}
                    onChange={e => set('howDidYouHear', e.target.value)}
                    style={inputStyle(false)} />
                </Field>
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
                width: '100%',
                background: loading ? 'rgba(255,106,0,0.5)' : 'linear-gradient(135deg,#ff6a00 0%,#ee0979 100%)',
                color: '#fff', fontFamily: "'Inter',sans-serif", fontWeight: 700,
                fontSize: '15px', padding: '16px', border: 'none', borderRadius: '10px',
                cursor: loading ? 'not-allowed' : 'pointer', letterSpacing: '0.5px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                boxShadow: loading ? 'none' : '0 4px 20px rgba(255,106,0,0.35)',
                transition: 'opacity 0.2s',
              }}>
                {loading ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Submitting…
                  </>
                ) : 'Get Free Consultation →'}
              </button>

              <p style={{ fontSize: '11px', color: '#bbb', textAlign: 'center', marginTop: '12px', fontFamily: "'Inter',sans-serif" }}>
                Protected by reCAPTCHA —{' '}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#adc905', textDecoration: 'none' }}>Privacy Policy</a>
                {' & '}
                <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" style={{ color: '#adc905', textDecoration: 'none' }}>Terms of Service</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function LeadForm() {
  return (
    <GoogleReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}>
      <LeadFormInner />
    </GoogleReCaptchaProvider>
  );
}
