'use client';

import { useState } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { z } from 'zod';
import CountryPicker from '../CountryPicker';

const contactInfo = [
  { icon: '📍', label: 'Location', val: '28, Judge Jubilee Hills Road, Mylapore, Chennai – 600 004' },
  { icon: '📞', label: 'Phone', val: '+91 7401 030 000' },
  { icon: '✉️', label: 'Email', val: 'plan@heliosevent.net' },
];

const FormSchema = z.object({
  name: z.string().min(2, 'Please enter your full name'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(6, 'Please enter a valid phone number'),
  company: z.string().min(1, 'Company name is required'),
  location: z.string().min(1, 'Location / venue is required'),
  teamSize: z.string().min(1, 'Team size is required'),
  targetAudiences: z.string().min(1, 'Target audience is required'),
  budget: z.string().min(1, 'Budget is required'),
});

type FormErrors = Partial<Record<keyof typeof FormSchema.shape, string>>;

const initialForm = {
  name: '', email: '', phoneCode: '+91', phone: '',
  company: '', location: '', teamSize: '', targetAudiences: '',
  preferredDate: '', duration: '', typeOfProgram: '', objectives: '',
  budget: '', additionalRequirements: '', howDidYouHear: '',
};

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '10px', fontWeight: 700, letterSpacing: '1.8px',
  textTransform: 'uppercase', color: 'rgba(0,0,0,0.45)',
  fontFamily: "'Inter',sans-serif", marginBottom: '6px',
};

function Field({
  label, required = false, error, children,
}: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={labelStyle}>{label}{required && ' *'}</label>
      {children}
      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '5px' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#e53e3e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span style={{ fontSize: '11px', color: '#e53e3e', fontFamily: "'Inter',sans-serif", fontWeight: 500 }}>
            {error}
          </span>
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

export default function ContactForm() {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<string, boolean>>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  function set(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
    // Clear error as user types
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }

  function touch(field: string) {
    setTouched(prev => ({ ...prev, [field]: true }));
    // Validate single field on blur
    const result = FormSchema.safeParse(form);
    if (!result.success) {
      const fieldError = result.error.flatten().fieldErrors[field as keyof FormErrors]?.[0];
      if (fieldError) setErrors(prev => ({ ...prev, [field]: fieldError }));
    }
  }

  function validate(): boolean {
    const result = FormSchema.safeParse(form);
    if (result.success) { setErrors({}); return true; }
    const fieldErrors: FormErrors = {};
    for (const [key, msgs] of Object.entries(result.error.flatten().fieldErrors)) {
      if (msgs?.[0]) fieldErrors[key as keyof FormErrors] = msgs[0];
    }
    setErrors(fieldErrors);
    // Mark all required fields as touched so errors show
    setTouched({ name: true, email: true, phone: true, company: true, location: true, teamSize: true, targetAudiences: true, budget: true });
    return false;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    if (!executeRecaptcha) { setSubmitError('reCAPTCHA not ready, please try again.'); return; }

    setLoading(true);
    setSubmitError('');

    try {
      const recaptchaToken = await executeRecaptcha('submit_enquiry');
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, recaptchaToken }),
      });
      const data = await res.json();
      if (!res.ok) { setSubmitError(data.error || 'Something went wrong.'); return; }
      setSuccess(true);
      setForm(initialForm);
      setErrors({});
      setTouched({});
    } catch {
      setSubmitError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const inp = (field: keyof FormErrors) => inputStyle(!!errors[field] && !!touched[field]);
  const err = (field: keyof FormErrors) => touched[field] ? errors[field] : undefined;

  return (
    <section id="contact" className="cf-section">
      <style>{`
        .cf-section {
          background: #fff;
          padding: 96px 60px;
          border-top: 1px solid #eee;
        }
        .cf-wrap {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1.6fr;
          gap: 80px;
          align-items: start;
        }
        .cf-form-box {
          background: #f9f9f9;
          border: 1px solid rgba(173,201,5,0.2);
          border-radius: 20px;
          padding: 44px 40px;
          position: relative;
          overflow: hidden;
        }
        .cf-row-3 {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 12px;
          margin-bottom: 12px;
        }
        .cf-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 24px;
        }
        @media (max-width: 900px) {
          .cf-section { padding: 60px 24px; }
          .cf-wrap { grid-template-columns: 1fr; gap: 40px; }
        }
        @media (max-width: 600px) {
          .cf-section { padding: 48px 16px; }
          .cf-wrap { gap: 32px; }
          .cf-form-box { padding: 28px 18px; border-radius: 16px; }
          .cf-row-3 { grid-template-columns: 1fr; }
          .cf-row-2 { grid-template-columns: 1fr; }
        }
      `}</style>
      <div className="cf-wrap">

        {/* Left — Info */}
        <div>
          <div style={{ fontSize: '10px', letterSpacing: '4px', textTransform: 'uppercase', color: '#adc905', fontFamily: "'Inter',sans-serif", fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <span style={{ width: '22px', height: '2px', background: '#adc905', display: 'inline-block' }} />
            Get In Touch
          </div>
          <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 'clamp(26px,3vw,42px)', color: '#111', lineHeight: 1.2, marginBottom: '16px' }}>
            Let's Plan Your<br />Next Event Together
          </h2>
          <p style={{ fontSize: '15px', color: '#6b7280', lineHeight: 1.8, marginBottom: '40px', fontFamily: "'Inter',sans-serif" }}>
            Tell us about your event and we'll get back to you within 24 hours with a tailored proposal.
          </p>
          {contactInfo.map((c, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '20px' }}>
              <div style={{ width: '40px', height: '40px', background: 'rgba(173,201,5,0.08)', border: '1px solid rgba(173,201,5,0.2)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>{c.icon}</div>
              <div>
                <div style={{ fontSize: '10px', color: '#adc905', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 700, fontFamily: "'Inter',sans-serif", marginBottom: '3px' }}>{c.label}</div>
                <div style={{ fontSize: '13px', color: '#555', fontFamily: "'Inter',sans-serif", lineHeight: 1.5 }}>{c.val}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Right — Form */}
        <div className="cf-form-box">
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg,#adc905,#ff6a00)' }} />

          {success ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ width: '64px', height: '64px', background: '#f0fdf4', border: '2px solid #22c55e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: '22px', color: '#111', marginBottom: '8px' }}>Enquiry Submitted!</h3>
              <p style={{ fontSize: '14px', color: '#6b7280', fontFamily: "'Inter',sans-serif" }}>We'll get back to you within 24 hours.</p>
              <button onClick={() => setSuccess(false)} style={{ marginTop: '24px', padding: '10px 24px', background: '#adc905', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: "'Inter',sans-serif" }}>
                Submit Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: '20px', color: '#111', marginBottom: '4px' }}>Fill Form To Connect With Us</h3>
              <p style={{ fontSize: '13px', color: '#888', fontFamily: "'Inter',sans-serif", marginBottom: '24px' }}>Fields marked * are required.</p>

              {/* Row 1 */}
              <div className="cf-row-3">
                <Field label="Your Name" required error={err('name')}>
                  <input type="text" placeholder="John Doe" value={form.name}
                    onChange={e => set('name', e.target.value)}
                    onBlur={() => touch('name')}
                    style={inp('name')} />
                </Field>
                <Field label="Official Email" required error={err('email')}>
                  <input type="email" placeholder="example@domain.com" value={form.email}
                    onChange={e => set('email', e.target.value)}
                    onBlur={() => touch('email')}
                    style={inp('email')} />
                </Field>
                <Field label="Phone Number" required error={err('phone')}>
                  <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: `1px solid ${errors.phone && touched.phone ? '#e53e3e' : '#e0e0e0'}`, borderRadius: '10px', padding: '0 12px', height: '42px', boxShadow: errors.phone && touched.phone ? '0 0 0 3px rgba(229,62,62,0.1)' : 'none', transition: 'border-color 0.2s' }}>
                    <CountryPicker onSelect={code => set('phoneCode', code)} />
                    <input type="tel" placeholder="00000 00000" value={form.phone}
                      onChange={e => set('phone', e.target.value)}
                      onBlur={() => touch('phone')}
                      style={{ flex: 1, background: 'transparent', border: 'none', color: '#111', fontSize: '13px', fontFamily: "'Inter',sans-serif", outline: 'none', minWidth: 0, marginLeft: '8px' }} />
                  </div>
                </Field>
              </div>

              {/* Row 2 */}
              <div className="cf-row-3">
                <Field label="Company Name" required error={err('company')}>
                  <input type="text" placeholder="xyz ltd." value={form.company}
                    onChange={e => set('company', e.target.value)}
                    onBlur={() => touch('company')}
                    style={inp('company')} />
                </Field>
                <Field label="Location / Venue" required error={err('location')}>
                  <input type="text" placeholder="Chennai / Bangalore" value={form.location}
                    onChange={e => set('location', e.target.value)}
                    onBlur={() => touch('location')}
                    style={inp('location')} />
                </Field>
                <Field label="Team Size" required error={err('teamSize')}>
                  <input type="text" placeholder="30 / 50 / 100 / 200" value={form.teamSize}
                    onChange={e => set('teamSize', e.target.value)}
                    onBlur={() => touch('teamSize')}
                    style={inp('teamSize')} />
                </Field>
              </div>

              {/* Row 3 */}
              <div className="cf-row-3">
                <Field label="Target Audiences" required error={err('targetAudiences')}>
                  <input type="text" placeholder="Leadership / Staff" value={form.targetAudiences}
                    onChange={e => set('targetAudiences', e.target.value)}
                    onBlur={() => touch('targetAudiences')}
                    style={inp('targetAudiences')} />
                </Field>
                <Field label="Preferred Date">
                  <input type="date" value={form.preferredDate}
                    onChange={e => set('preferredDate', e.target.value)}
                    style={inputStyle(false)} />
                </Field>
                <Field label="Duration">
                  <input type="text" placeholder="2-Hours / Full Day" value={form.duration}
                    onChange={e => set('duration', e.target.value)}
                    style={inputStyle(false)} />
                </Field>
              </div>

              {/* Row 4 */}
              <div className="cf-row-3">
                <Field label="Type of Program">
                  <input type="text" placeholder="Outbound / Team Building" value={form.typeOfProgram}
                    onChange={e => set('typeOfProgram', e.target.value)}
                    style={inputStyle(false)} />
                </Field>
                <Field label="Objectives">
                  <input type="text" placeholder="Team bonding, Communication" value={form.objectives}
                    onChange={e => set('objectives', e.target.value)}
                    style={inputStyle(false)} />
                </Field>
                <Field label="Budget" required error={err('budget')}>
                  <input type="text" placeholder="Only for Team Activities" value={form.budget}
                    onChange={e => set('budget', e.target.value)}
                    onBlur={() => touch('budget')}
                    style={inp('budget')} />
                </Field>
              </div>

              {/* Row 5 */}
              <div className="cf-row-2">
                <Field label="Additional Requirements">
                  <input type="text" placeholder="Any special requirements..." value={form.additionalRequirements}
                    onChange={e => set('additionalRequirements', e.target.value)}
                    style={inputStyle(false)} />
                </Field>
                <Field label="How Did You Hear About Us?">
                  <input type="text" placeholder="Google / LinkedIn / Referral" value={form.howDidYouHear}
                    onChange={e => set('howDidYouHear', e.target.value)}
                    style={inputStyle(false)} />
                </Field>
              </div>

              {submitError && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(229,62,62,0.06)', border: '1px solid rgba(229,62,62,0.25)', borderRadius: '8px', padding: '12px 14px', marginBottom: '16px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e53e3e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span style={{ fontSize: '13px', color: '#e53e3e', fontFamily: "'Inter',sans-serif" }}>{submitError}</span>
                </div>
              )}

              <button type="submit" disabled={loading} style={{ width: '100%', background: loading ? 'rgba(255,106,0,0.5)' : 'linear-gradient(90deg,#ff6a00,#ff8c38)', color: '#fff', fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: '15px', padding: '16px', border: 'none', borderRadius: '10px', cursor: loading ? 'not-allowed' : 'pointer', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                {loading ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Submitting…
                  </>
                ) : 'Send My Enquiry →'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

