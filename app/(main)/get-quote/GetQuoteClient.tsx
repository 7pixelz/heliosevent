'use client';

import { useState } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { z } from 'zod';
import CountryPicker from '../../../components/CountryPicker';

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

const trustPoints = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#adc905" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: '500+ Events Delivered',
    desc: 'From intimate boardroom meets to 2000-person galas — we\'ve done it all.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#adc905" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: '24-Hour Response',
    desc: 'Submit your enquiry today and receive a tailored proposal by tomorrow.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#adc905" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: 'Dedicated Event Planner',
    desc: 'A single point of contact from first call to final curtain — no handoffs.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#adc905" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    title: '98% Client Satisfaction',
    desc: 'Our clients return — and they bring their networks. That\'s our best metric.',
  },
];

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

export default function GetQuoteClient() {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<string, boolean>>>({});
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
    setTouched({ name: true, email: true, phone: true, company: true, location: true, teamSize: true, targetAudiences: true, budget: true });
    return false;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    if (!executeRecaptcha) { setSubmitError('reCAPTCHA not ready, please try again.'); return; }
    setLoading(true); setSubmitError('');
    try {
      const recaptchaToken = await executeRecaptcha('get_quote');
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, recaptchaToken }),
      });
      const data = await res.json();
      if (!res.ok) { setSubmitError(data.error || 'Something went wrong.'); return; }
      setSuccess(true);
      setForm(initialForm); setErrors({}); setTouched({});
    } catch {
      setSubmitError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const inpSt = (field: keyof FormErrors) => inputStyle(!!errors[field] && !!touched[field]);
  const err = (field: keyof FormErrors) => touched[field] ? errors[field] : undefined;

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <style>{`
        .gq-layout { display: grid; grid-template-columns: 340px 1fr; gap: 32px; align-items: start; }
        .gq-sidebar { display: flex; flex-direction: column; gap: 16px; position: sticky; top: 100px; }
        .gq-row-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 12px; }
        .gq-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 28px; }
        @media (max-width: 900px) {
          .gq-layout { grid-template-columns: 1fr; }
          .gq-sidebar { position: static; }
          .gq-row-3 { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 600px) {
          .gq-row-3 { grid-template-columns: 1fr; }
          .gq-row-2 { grid-template-columns: 1fr; margin-bottom: 16px; }
        }
      `}</style>

      {/* ── Hero ── */}
      <div style={{
        background: 'linear-gradient(135deg,#1a1f2e 0%,#0f1318 100%)',
        padding: '100px 24px 80px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 75% 50%, rgba(255,106,0,0.08) 0%, transparent 50%), radial-gradient(circle at 25% 30%, rgba(173,201,5,0.07) 0%, transparent 45%)' }} />
        <div style={{ maxWidth: '780px', margin: '0 auto', position: 'relative', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,106,0,0.1)', border: '1px solid rgba(255,106,0,0.25)', borderRadius: '999px', padding: '6px 18px', marginBottom: '22px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ff6a00', display: 'inline-block' }} />
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#ff6a00', fontFamily: "'Inter',sans-serif" }}>Free Quote · No Obligation</span>
          </div>
          <h1 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 'clamp(30px,5vw,54px)', color: '#fff', lineHeight: 1.15, margin: '0 0 18px' }}>
            Plan Your Event With<br />
            <span style={{ background: 'linear-gradient(90deg,#ff6a00,#ffaa00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Helios Event Productions</span>
          </h1>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)', fontFamily: "'Inter',sans-serif", lineHeight: 1.75, margin: 0 }}>
            Fill in your event details below and our team will craft a personalised proposal for you within 24 hours — completely free.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px 80px' }}>
        <div className="gq-layout">

          {/* ── Left Panel ── */}
          <div className="gq-sidebar">

            {/* Trust points */}
            <div style={{ background: '#fff', border: '1px solid #e8edf2', borderRadius: '18px', padding: '28px 24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#adc905', fontFamily: "'Inter',sans-serif", marginBottom: '20px' }}>Why Choose Us</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {trustPoints.map((p, i) => (
                  <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                    <div style={{ width: '42px', height: '42px', background: 'rgba(173,201,5,0.07)', border: '1px solid rgba(173,201,5,0.18)', borderRadius: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {p.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#111', fontFamily: "'Inter',sans-serif", marginBottom: '3px' }}>{p.title}</div>
                      <div style={{ fontSize: '12px', color: '#888', fontFamily: "'Inter',sans-serif", lineHeight: 1.55 }}>{p.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonial */}
            <div style={{ background: 'linear-gradient(135deg,#1a1f2e,#0f1318)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '18px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }}>
              <div style={{ display: 'flex', gap: '2px', marginBottom: '14px' }}>
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#ff6a00" stroke="none">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', fontFamily: "'Inter',sans-serif", lineHeight: 1.7, margin: '0 0 16px', fontStyle: 'italic' }}>
                "Helios transformed our annual conference into an experience our teams still talk about. The attention to detail was extraordinary."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg,#adc905,#ff6a00)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '14px', color: '#fff', fontFamily: "'Inter',sans-serif", flexShrink: 0 }}>
                  R
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', fontFamily: "'Inter',sans-serif" }}>Rajesh Kumar</div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontFamily: "'Inter',sans-serif" }}>HR Director, TechCorp India</div>
                </div>
              </div>
            </div>

            {/* Contact strip */}
            <div style={{ background: '#fff', border: '1px solid #e8edf2', borderRadius: '14px', padding: '18px 20px', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#888', fontFamily: "'Inter',sans-serif", marginBottom: '12px' }}>Prefer to Talk?</div>
              <a href="tel:+917401030000" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '8px' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ff6a00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 5.29 5.29l.96-.96a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#111', fontFamily: "'Inter',sans-serif" }}>+91 7401 030 000</span>
              </a>
              <a href="mailto:plan@heliosevent.net" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#adc905" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                </svg>
                <span style={{ fontSize: '13px', color: '#555', fontFamily: "'Inter',sans-serif" }}>plan@heliosevent.net</span>
              </a>
            </div>

          </div>

          {/* ── Form ── */}
          <div style={{ background: '#fff', border: '1px solid #e8edf2', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}>
            <div style={{ height: '4px', background: 'linear-gradient(90deg,#adc905,#ff6a00)' }} />
            <div style={{ padding: '36px 36px' }}>

              {success ? (
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                  <div style={{ width: '72px', height: '72px', background: '#f0fdf4', border: '2px solid #22c55e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: '24px', color: '#111', marginBottom: '10px' }}>Quote Request Sent!</h3>
                  <p style={{ fontSize: '15px', color: '#6b7280', fontFamily: "'Inter',sans-serif", lineHeight: 1.7, maxWidth: '360px', margin: '0 auto 12px' }}>
                    Thank you! Our team will review your requirements and send you a personalised proposal within 24 hours.
                  </p>
                  <p style={{ fontSize: '13px', color: '#aaa', fontFamily: "'Inter',sans-serif", marginBottom: '32px' }}>
                    Check your inbox at <strong style={{ color: '#555' }}>{form.email || 'your email'}</strong>
                  </p>
                  <button onClick={() => setSuccess(false)} style={{ padding: '12px 32px', background: 'linear-gradient(90deg,#ff6a00,#ff8c38)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: "'Inter',sans-serif", boxShadow: '0 4px 16px rgba(255,106,0,0.3)' }}>
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <div style={{ marginBottom: '28px' }}>
                    <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: '22px', color: '#111', margin: '0 0 6px' }}>Fill Form To Connect With Us</h2>
                    <p style={{ fontSize: '13px', color: '#888', fontFamily: "'Inter',sans-serif", margin: 0 }}>Fields marked * are required.</p>
                  </div>

                  {/* Row 1 */}
                  <div className="gq-row-3">
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
                          onChange={e => set('phone', e.target.value)} onBlur={() => touch('phone')}
                          style={{ flex: 1, background: 'transparent', border: 'none', color: '#111', fontSize: '13px', fontFamily: "'Inter',sans-serif", outline: 'none', minWidth: 0, marginLeft: '8px' }} />
                      </div>
                    </Field>
                  </div>

                  {/* Row 2 */}
                  <div className="gq-row-3">
                    <Field label="Company Name" required error={err('company')}>
                      <input type="text" placeholder="xyz ltd." value={form.company}
                        onChange={e => set('company', e.target.value)} onBlur={() => touch('company')}
                        style={inpSt('company')} />
                    </Field>
                    <Field label="Location / Venue" required error={err('location')}>
                      <input type="text" placeholder="Chennai / Bangalore" value={form.location}
                        onChange={e => set('location', e.target.value)} onBlur={() => touch('location')}
                        style={inpSt('location')} />
                    </Field>
                    <Field label="Team Size" required error={err('teamSize')}>
                      <input type="text" placeholder="30 / 50 / 100 / 200" value={form.teamSize}
                        onChange={e => set('teamSize', e.target.value)} onBlur={() => touch('teamSize')}
                        style={inpSt('teamSize')} />
                    </Field>
                  </div>

                  {/* Row 3 */}
                  <div className="gq-row-3">
                    <Field label="Target Audiences" required error={err('targetAudiences')}>
                      <input type="text" placeholder="Leadership / Staff" value={form.targetAudiences}
                        onChange={e => set('targetAudiences', e.target.value)} onBlur={() => touch('targetAudiences')}
                        style={inpSt('targetAudiences')} />
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
                  <div className="gq-row-3">
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
                        onChange={e => set('budget', e.target.value)} onBlur={() => touch('budget')}
                        style={inpSt('budget')} />
                    </Field>
                  </div>

                  {/* Row 5 */}
                  <div className="gq-row-2">
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(229,62,62,0.05)', border: '1px solid rgba(229,62,62,0.2)', borderRadius: '8px', padding: '12px 14px', marginBottom: '16px' }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#e53e3e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      <span style={{ fontSize: '13px', color: '#e53e3e', fontFamily: "'Inter',sans-serif" }}>{submitError}</span>
                    </div>
                  )}

                  <button type="submit" disabled={loading} style={{
                    width: '100%',
                    background: loading ? 'rgba(255,106,0,0.5)' : 'linear-gradient(90deg,#ff6a00,#ff8c38)',
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
                    ) : 'Send My Enquiry →'}
                  </button>

                  <p style={{ fontSize: '11px', color: '#bbb', textAlign: 'center', marginTop: '12px', fontFamily: "'Inter',sans-serif" }}>
                    Protected by reCAPTCHA · No spam, ever · 24-hr response guaranteed
                  </p>
                </form>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
