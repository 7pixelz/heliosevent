'use client';

import { useState } from 'react';
import Image from 'next/image';

import { highlightExp } from '../../lib/highlight';

const STEPS = [
  {
    key: 'service',
    label: 'SERVICE',
    title: 'How would you rate our overall service quality?',
    subtitle: 'Rate the quality, professionalism and care we delivered',
  },
  {
    key: 'timeline',
    label: 'TIMELINE',
    title: 'Were our responses and deliveries on time?',
    subtitle: 'Rate our punctuality and communication throughout',
  },
  {
    key: 'appreciation',
    label: 'APPRECIATION',
    title: 'Did you receive appreciation for your event?',
    subtitle: 'Rate how much your attendees enjoyed the experience',
  },
  {
    key: 'referral',
    label: 'REFERRAL',
    title: 'Would you recommend Helios Event to others?',
    subtitle: 'How likely are you to refer us to a friend or colleague?',
  },
  {
    key: 'story',
    label: 'SHARE',
    title: 'Tell us about your experience',
    subtitle: 'Share your story in a few words',
  },
];

const ACCENT = '#b4e600';

export default function FeedbackPage() {
  const [step, setStep] = useState(0);
  const [ratings, setRatings] = useState({ service: 0, timeline: 0, appreciation: 0, referral: 0 });
  const [hovered, setHovered] = useState(0);
  const [experience, setExperience] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  function copyMessage() {
    navigator.clipboard.writeText(experience).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  const currentStep = STEPS[step];
  const isStory = step === 4;
  const currentRating = ratings[currentStep.key as keyof typeof ratings] ?? 0;
  const displayStars = isStory ? 0 : (hovered || currentRating);

  const canNext = isStory ? experience.trim().length > 0 && name.trim().length > 0 : currentRating > 0;

  async function handleSubmit() {
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...ratings, experience, name, email }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Error ${res.status}`);
      }
      setSubmitted(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0c12', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ textAlign: 'center', maxWidth: '480px' }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>✨</div>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '28px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>
            Thank You{name ? `, ${name.split(' ')[0]}` : ''}!
          </h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '15px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: '32px' }}>
            Your feedback means the world to us. It helps us create even better <span style={{ color: '#b4e600' }}>experiences</span> for every event we touch.
          </p>
          <div style={{ display: 'inline-block', background: ACCENT, color: '#0a0c12', fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: '13px', letterSpacing: '1.5px', padding: '12px 28px', borderRadius: '999px' }}>
            HELIOS EVENT PRODUCTIONS
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0c12', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 20px 60px' }}>
      <style>{`@media (max-width: 480px) { .fb-name-grid { grid-template-columns: 1fr !important; } }`}</style>

      {/* Logo */}
      <div style={{ marginBottom: '28px' }}>
        <Image src="/assets/heliosevent_logo_white.webp" alt="Helios Event Productions" width={160} height={44} style={{ height: '44px', width: 'auto' }} />
      </div>

      {/* Badge + Heading */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ display: 'inline-block', background: ACCENT, color: '#0a0c12', fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: '11px', letterSpacing: '2px', padding: '6px 18px', borderRadius: '999px', marginBottom: '20px' }}>
          CLIENT FEEDBACK
        </div>
        <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 'clamp(22px, 5vw, 36px)', fontWeight: 800, color: '#fff', lineHeight: 1.2, margin: '0 0 10px' }}>
          How did we make<br />your moment shine?
        </h1>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: 'rgba(255,255,255,0.45)', margin: 0 }}>
          5 quick questions &nbsp;·&nbsp; takes 60 seconds
        </p>
      </div>

      {/* Card */}
      <div style={{ width: '100%', maxWidth: '560px', background: '#0f1320', border: '1px solid #1e2640', borderRadius: '20px', overflow: 'hidden' }}>

        {/* Progress Steps */}
        <div style={{ borderBottom: '1px solid #1e2640', padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
            {/* connector line */}
            <div style={{ position: 'absolute', top: '14px', left: '14px', right: '14px', height: '1px', background: '#1e2640', zIndex: 0 }} />
            <div style={{ position: 'absolute', top: '14px', left: '14px', height: '1px', background: ACCENT, zIndex: 0, width: `${(step / 4) * 100}%`, transition: 'width 0.4s ease' }} />
            {STEPS.map((s, i) => (
              <div key={s.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', zIndex: 1 }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: i < step ? ACCENT : i === step ? 'transparent' : '#1e2640',
                  border: i === step ? `2px solid ${ACCENT}` : i < step ? 'none' : '2px solid #2a3050',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: i < step ? '#0a0c12' : i === step ? ACCENT : '#4a5570',
                  fontSize: '12px', fontWeight: 700, fontFamily: "'Inter', sans-serif",
                  transition: 'all 0.3s',
                }}>
                  {i < step ? '✓' : 'STARS'[i]}
                </div>
                <span style={{ fontSize: '9px', letterSpacing: '1px', fontFamily: "'Inter', sans-serif", color: i === step ? ACCENT : i < step ? 'rgba(255,255,255,0.5)' : '#2a3050', fontWeight: 600 }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Question */}
        <div style={{ padding: '36px 32px 28px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 'clamp(18px, 4vw, 24px)', fontWeight: 700, color: '#fff', fontStyle: 'italic', margin: '0 0 8px' }}>
            "{highlightExp(currentStep.title)}"
          </h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: 'rgba(255,255,255,0.4)', margin: '0 0 32px' }}>
            {highlightExp(currentStep.subtitle)}
          </p>

          {/* Star Rating */}
          {!isStory && (
            <>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '12px', paddingTop: '16px' }}>
                {Array.from({ length: 5 }, (_, i) => i + 1).map(n => (
                  <button
                    key={n}
                    onClick={() => setRatings(r => ({ ...r, [currentStep.key]: n }))}
                    onMouseEnter={() => setHovered(n)}
                    onMouseLeave={() => setHovered(0)}
                    style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: '4px', lineHeight: 1, transition: 'transform 0.1s', transform: n <= displayStars ? 'scale(1.15)' : 'scale(1)' }}
                    aria-label={`Rate ${n}`}
                  >
                    {hovered === n && (
                      <span style={{ position: 'absolute', top: '-22px', left: '50%', transform: 'translateX(-50%)', background: ACCENT, color: '#0a0c12', borderRadius: '4px', padding: '2px 6px', fontSize: '11px', fontWeight: 800, fontFamily: "'Inter', sans-serif", lineHeight: 1.5, whiteSpace: 'nowrap', pointerEvents: 'none' }}>
                        {n}
                      </span>
                    )}
                    <svg width="clamp(28px, 8vw, 44px)" height="clamp(28px, 8vw, 44px)" viewBox="0 0 24 24" fill={n <= displayStars ? ACCENT : '#2a3050'} style={{ display: 'block', transition: 'fill 0.15s' }}>
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                    </svg>
                  </button>
                ))}
              </div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: (hovered > 0 || currentRating > 0) ? ACCENT : 'rgba(255,255,255,0.2)', letterSpacing: '1px', margin: 0, minHeight: '18px' }}>
                {hovered > 0 ? `${hovered} / 5` : currentRating > 0 ? `${currentRating} / 5` : 'TAP A STAR'}
              </p>
            </>
          )}

          {/* Story Step */}
          {isStory && (
            <div style={{ textAlign: 'left' }}>
              <textarea
                value={experience}
                onChange={e => setExperience(e.target.value)}
                placeholder="Tell us what made your event special, or how we can serve you even better..."
                rows={5}
                style={{ width: '100%', background: '#0a0c12', border: '1px solid #1e2640', borderRadius: '12px', padding: '16px', color: '#fff', fontFamily: "'Inter', sans-serif", fontSize: '14px', lineHeight: 1.7, resize: 'vertical', outline: 'none', boxSizing: 'border-box', marginBottom: '10px' }}
              />
              {experience.trim().length > 0 && (
                <button
                  type="button"
                  onClick={copyMessage}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', background: copied ? 'rgba(180,230,0,0.15)' : 'rgba(255,255,255,0.06)', border: `1px solid ${copied ? ACCENT : 'rgba(255,255,255,0.12)'}`, borderRadius: '8px', padding: '7px 14px', color: copied ? ACCENT : 'rgba(255,255,255,0.55)', fontFamily: "'Inter', sans-serif", fontSize: '12px', fontWeight: 600, cursor: 'pointer', marginBottom: '14px', transition: 'all 0.2s' }}
                >
                  {copied ? '✓ Copied!' : '⎘ Copy message'}
                  {!copied && <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>— paste it in Google Review</span>}
                </button>
              )}
              <div className="fb-name-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '8px' }}>
                <div>
                  <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Your name *"
                    required
                    style={{ width: '100%', background: '#0a0c12', border: `1px solid ${name.trim() ? '#1e2640' : '#3a2040'}`, borderRadius: '10px', padding: '12px 16px', color: '#fff', fontFamily: "'Inter', sans-serif", fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <input
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Email (optional)"
                  type="email"
                  style={{ width: '100%', background: '#0a0c12', border: '1px solid #1e2640', borderRadius: '10px', padding: '12px 16px', color: '#fff', fontFamily: "'Inter', sans-serif", fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: 'rgba(255,255,255,0.3)', margin: '0 0 16px', letterSpacing: '0.3px' }}>* Required</p>

              {/* Google Review */}
              <div style={{ margin: '24px 0 0', background: 'rgba(180,230,0,0.06)', border: `1px solid rgba(180,230,0,0.2)`, borderRadius: '14px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '28px' }}>⭐</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#fff', fontSize: '14px', marginBottom: '4px' }}>Leave us a Google Review</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: 'rgba(255,255,255,0.45)', marginBottom: '10px' }}>Your review helps others discover Helios and means the world to our team.</div>
                  <a href="https://www.google.com/maps/place/Helios+Event+Productions/@13.0448125,80.2680382,16.79z/data=!4m16!1m7!3m6!1s0x3a52662ed0632c99:0xa787eee5724f1ed!2sHelios+Event+Productions!8m2!3d13.044634!4d80.2704157!16s%2Fg%2F1tfg62dy!3m7!1s0x3a52662ed0632c99:0xa787eee5724f1ed!8m2!3d13.044634!4d80.2704157!9m1!1b1!16s%2Fg%2F1tfg62dy" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', background: ACCENT, color: '#0a0c12', fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: '12px', letterSpacing: '0.5px', padding: '8px 18px', borderRadius: '8px', textDecoration: 'none' }}>
                    ✦ Write a Google Review
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer / CTA */}
        <div style={{ padding: '0 32px 32px' }}>
          {error && <p style={{ color: '#ff6b6b', fontFamily: "'Inter', sans-serif", fontSize: '13px', textAlign: 'center', marginBottom: '12px' }}>{error}</p>}
          {!isStory ? (
            <button
              onClick={() => { if (canNext) setStep(s => s + 1); }}
              disabled={!canNext}
              style={{ width: '100%', padding: '16px', background: canNext ? '#fff' : '#1e2640', color: canNext ? '#0a0c12' : '#3a4560', fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: '15px', letterSpacing: '0.5px', border: 'none', borderRadius: '12px', cursor: canNext ? 'pointer' : 'not-allowed', transition: 'all 0.2s' }}
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canNext || submitting}
              style={{ width: '100%', padding: '18px', background: canNext ? '#0a0c12' : '#1e2640', color: canNext ? ACCENT : '#3a4560', fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: '14px', letterSpacing: '2px', border: `2px solid ${canNext ? ACCENT : '#1e2640'}`, borderRadius: '12px', cursor: canNext && !submitting ? 'pointer' : 'not-allowed', transition: 'all 0.2s' }}
            >
              {submitting ? 'SUBMITTING...' : 'SUBMIT MY FEEDBACK ✦'}
            </button>
          )}
        </div>
      </div>

      {/* Footer */}
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: 'rgba(255,255,255,0.2)', marginTop: '32px', letterSpacing: '0.5px' }}>
        Helios Event Productions &nbsp;·&nbsp; Events | Exhibitions | Wedding
      </p>
    </div>
  );
}
