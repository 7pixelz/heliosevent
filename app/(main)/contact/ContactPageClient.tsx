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

export default function ContactPageClient() {
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
      const recaptchaToken = await executeRecaptcha('contact_page_enquiry');
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

  const inpSt = (field: keyof FormErrors) => inp(!!errors[field] && !!touched[field]);
  const err = (field: keyof FormErrors) => touched[field] ? errors[field] : undefined;

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <style>{`
        .contact-info-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .contact-map-form { display: grid; grid-template-columns: 1fr 1.5fr; gap: 28px; align-items: start; }
        .contact-form-row-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 12px; }
        .contact-form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; }
        @media (max-width: 900px) {
          .contact-map-form { grid-template-columns: 1fr; }
        }
        @media (max-width: 700px) {
          .contact-info-grid { grid-template-columns: 1fr; }
          .contact-form-row-3 { grid-template-columns: 1fr; }
          .contact-form-row-2 { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* ── Hero ── */}
      <div style={{
        background: 'linear-gradient(135deg,#1a1f2e 0%,#0f1318 100%)',
        padding: '100px 24px 72px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(173,201,5,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,106,0,0.06) 0%, transparent 40%)' }} />
        <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(173,201,5,0.1)', border: '1px solid rgba(173,201,5,0.25)', borderRadius: '999px', padding: '6px 16px', marginBottom: '20px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#adc905', display: 'inline-block' }} />
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#adc905', fontFamily: "'Inter',sans-serif" }}>Get In Touch</span>
          </div>
          <h1 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 'clamp(32px,5vw,58px)', color: '#fff', lineHeight: 1.15, margin: '0 0 16px' }}>
            Let's Create Something<br />
            <span style={{ background: 'linear-gradient(90deg,#adc905,#ff6a00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Extraordinary</span>
          </h1>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.55)', fontFamily: "'Inter',sans-serif", maxWidth: '520px', margin: '0 auto', lineHeight: 1.7 }}>
            Tell us about your event vision and we'll craft a tailored proposal within 24 hours.
          </p>
        </div>
      </div>

      {/* ── Info Cards ── */}
      <div style={{ maxWidth: '1100px', margin: '-36px auto 0', padding: '0 24px', position: 'relative', zIndex: 10 }}>
        <div className="contact-info-grid">

          {/* Address */}
          <div style={{ background: '#fff', border: '1px solid #e8edf2', borderRadius: '16px', padding: '24px 24px 24px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ width: '44px', height: '44px', background: 'rgba(173,201,5,0.08)', border: '1px solid rgba(173,201,5,0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#adc905" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#adc905', fontFamily: "'Inter',sans-serif", marginBottom: '6px' }}>Office Address</div>
              <div style={{ fontSize: '13px', color: '#444', fontFamily: "'Inter',sans-serif", lineHeight: 1.6 }}>
                28, Judge Jubilee Hills Road,<br />Jagadambal Colony Durgapam,<br />Mylapore, Chennai – 600 004<br />Tamil Nadu, India
              </div>
            </div>
          </div>

          {/* Phone & Email */}
          <div style={{ background: '#fff', border: '1px solid #e8edf2', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ width: '44px', height: '44px', background: 'rgba(255,106,0,0.06)', border: '1px solid rgba(255,106,0,0.18)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff6a00" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 5.29 5.29l.96-.96a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#ff6a00', fontFamily: "'Inter',sans-serif", marginBottom: '6px' }}>Call & Email</div>
              <a href="tel:+917401030000" style={{ display: 'block', fontSize: '14px', color: '#111', fontFamily: "'Inter',sans-serif", fontWeight: 700, textDecoration: 'none', marginBottom: '4px' }}>+91 7401 030 000</a>
              <a href="mailto:plan@heliosevent.net" style={{ fontSize: '13px', color: '#555', fontFamily: "'Inter',sans-serif", textDecoration: 'none' }}>plan@heliosevent.net</a>
            </div>
          </div>

          {/* Working Hours */}
          <div style={{ background: '#fff', border: '1px solid #e8edf2', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ width: '44px', height: '44px', background: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.15)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#2563eb', fontFamily: "'Inter',sans-serif", marginBottom: '6px' }}>Working Hours</div>
              <div style={{ fontSize: '13px', color: '#444', fontFamily: "'Inter',sans-serif", lineHeight: 1.7 }}>
                Monday – Saturday<br />
                <span style={{ fontWeight: 700, color: '#111' }}>9:00 AM – 7:00 PM IST</span><br />
                <span style={{ fontSize: '12px', color: '#888' }}>Sunday: By Appointment</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Map + Form ── */}
      <div style={{ maxWidth: '1100px', margin: '36px auto 80px', padding: '0 24px' }}>
        <div className="contact-map-form">

          {/* Map */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            <div style={{ background: '#fff', border: '1px solid #e8edf2', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
              <div style={{ padding: '18px 20px', borderBottom: '1px solid #f0f4f8' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#adc905', fontFamily: "'Inter',sans-serif", marginBottom: '2px' }}>Find Us On Map</div>
                <div style={{ fontSize: '13px', color: '#888', fontFamily: "'Inter',sans-serif" }}>Helios Event Productions, Mylapore</div>
              </div>
              <div style={{ position: 'relative', height: '360px' }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.8591832618786!2d80.2704157!3d13.044634000000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a52662ed0632c99%3A0xa787eee5724f1ed!2sHelios%20Event%20Productions!5e0!3m2!1sen!2sae!4v1777471920169!5m2!1sen!2sae"
                  width="100%"
                  height="360"
                  style={{ border: 0, display: 'block' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div style={{ padding: '16px 20px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: '#888', fontFamily: "'Inter',sans-serif" }}>Mylapore, Chennai – 600 004</span>
                <a
                  href="https://maps.google.com/?q=Helios+Event+Productions+Chennai"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: '12px', fontWeight: 700, color: '#adc905', fontFamily: "'Inter',sans-serif", textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  Open in Maps
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick contact strip */}
            <div style={{ marginTop: '16px', background: 'linear-gradient(135deg,#1a1f2e,#0f1318)', borderRadius: '16px', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontFamily: "'Inter',sans-serif" }}>Quick Contact</div>
              <a href="tel:+917401030000" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ width: '32px', height: '32px', background: 'rgba(255,106,0,0.15)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ff6a00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 5.29 5.29l.96-.96a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontFamily: "'Inter',sans-serif", letterSpacing: '1px', textTransform: 'uppercase' }}>Call Us</div>
                  <div style={{ fontSize: '14px', color: '#fff', fontFamily: "'Inter',sans-serif", fontWeight: 700 }}>+91 7401 030 000</div>
                </div>
              </a>
              <a href="mailto:plan@heliosevent.net" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ width: '32px', height: '32px', background: 'rgba(173,201,5,0.15)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#adc905" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontFamily: "'Inter',sans-serif", letterSpacing: '1px', textTransform: 'uppercase' }}>Email Us</div>
                  <div style={{ fontSize: '13px', color: '#fff', fontFamily: "'Inter',sans-serif", fontWeight: 700 }}>plan@heliosevent.net</div>
                </div>
              </a>
            </div>
          </div>

          {/* Form */}
          <div style={{ background: '#fff', border: '1px solid #e8edf2', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}>
            <div style={{ height: '3px', background: 'linear-gradient(90deg,#adc905,#ff6a00)' }} />
            <div style={{ padding: '32px 32px' }}>

              {success ? (
                <div style={{ textAlign: 'center', padding: '48px 0' }}>
                  <div style={{ width: '68px', height: '68px', background: '#f0fdf4', border: '2px solid #22c55e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: '22px', color: '#111', marginBottom: '10px' }}>Enquiry Received!</h3>
                  <p style={{ fontSize: '14px', color: '#6b7280', fontFamily: "'Inter',sans-serif", lineHeight: 1.6, maxWidth: '320px', margin: '0 auto 28px' }}>
                    Thank you for reaching out. Our team will review your enquiry and get back to you within 24 hours.
                  </p>
                  <button onClick={() => setSuccess(false)} style={{ padding: '11px 28px', background: '#adc905', color: '#fff', border: 'none', borderRadius: '9px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: "'Inter',sans-serif" }}>
                    Submit Another Enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <div style={{ marginBottom: '24px' }}>
                    <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: '20px', color: '#111', margin: '0 0 4px' }}>Send Us Your Enquiry</h2>
                    <p style={{ fontSize: '13px', color: '#888', fontFamily: "'Inter',sans-serif", margin: 0 }}>Fields marked * are required.</p>
                  </div>

                  {/* Row 1 */}
                  <div className="contact-form-row-3">
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
                  <div className="contact-form-row-3">
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
                  <div className="contact-form-row-3">
                    <Field label="Target Audiences" required error={err('targetAudiences')}>
                      <input type="text" placeholder="Leadership / Staff" value={form.targetAudiences}
                        onChange={e => set('targetAudiences', e.target.value)} onBlur={() => touch('targetAudiences')}
                        style={inpSt('targetAudiences')} />
                    </Field>
                    <Field label="Preferred Date">
                      <input type="date" value={form.preferredDate}
                        onChange={e => set('preferredDate', e.target.value)}
                        style={inp(false)} />
                    </Field>
                    <Field label="Duration">
                      <input type="text" placeholder="2-Hours / Full Day" value={form.duration}
                        onChange={e => set('duration', e.target.value)}
                        style={inp(false)} />
                    </Field>
                  </div>

                  {/* Row 4 */}
                  <div className="contact-form-row-3">
                    <Field label="Type of Program">
                      <input type="text" placeholder="Outbound / Team Building" value={form.typeOfProgram}
                        onChange={e => set('typeOfProgram', e.target.value)}
                        style={inp(false)} />
                    </Field>
                    <Field label="Objectives">
                      <input type="text" placeholder="Team bonding, Communication" value={form.objectives}
                        onChange={e => set('objectives', e.target.value)}
                        style={inp(false)} />
                    </Field>
                    <Field label="Budget" required error={err('budget')}>
                      <input type="text" placeholder="Only for Team Activities" value={form.budget}
                        onChange={e => set('budget', e.target.value)} onBlur={() => touch('budget')}
                        style={inpSt('budget')} />
                    </Field>
                  </div>

                  {/* Row 5 */}
                  <div className="contact-form-row-2">
                    <Field label="Additional Requirements">
                      <input type="text" placeholder="Any special requirements..." value={form.additionalRequirements}
                        onChange={e => set('additionalRequirements', e.target.value)}
                        style={inp(false)} />
                    </Field>
                    <Field label="How Did You Hear About Us?">
                      <input type="text" placeholder="Google / LinkedIn / Referral" value={form.howDidYouHear}
                        onChange={e => set('howDidYouHear', e.target.value)}
                        style={inp(false)} />
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
                    width: '100%', background: loading ? 'rgba(255,106,0,0.5)' : 'linear-gradient(90deg,#ff6a00,#ff8c38)',
                    color: '#fff', fontFamily: "'Inter',sans-serif", fontWeight: 700,
                    fontSize: '15px', padding: '15px', border: 'none', borderRadius: '10px',
                    cursor: loading ? 'not-allowed' : 'pointer', letterSpacing: '0.5px',
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
                    ) : 'Send My Enquiry →'}
                  </button>

                  <p style={{ fontSize: '11px', color: '#aaa', textAlign: 'center', marginTop: '12px', fontFamily: "'Inter',sans-serif" }}>
                    Protected by reCAPTCHA · Your data is safe with us
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
