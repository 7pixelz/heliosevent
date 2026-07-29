'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';

// Phone number is assembled at click-time (not present as static text in the
// page HTML) so simple regex-based scrapers that scan for wa.me/api.whatsapp.com
// links on the raw page source can't harvest it for spam/video-call bots.
const PARTS = ['91', '740', '103', '0000'];

function buildWhatsAppUrl(name: string, requirement: string) {
  const phone = PARTS.join('');
  const text = encodeURIComponent(`Hi, I'm ${name}. I'd like to plan an event on ${requirement}.`);
  return `https://wa.me/${phone}?text=${text}`;
}

interface WhatsAppGateContextValue {
  openGate: () => void;
}

const WhatsAppGateContext = createContext<WhatsAppGateContextValue | null>(null);

export function useWhatsAppGate() {
  const ctx = useContext(WhatsAppGateContext);
  if (!ctx) throw new Error('useWhatsAppGate must be used within WhatsAppGateProvider');
  return ctx;
}

const REQUIREMENT_OPTIONS = [
  'Corporate Events',
  'Entertainment Events',
  'Government & Protocol Events',
  'MICE Events',
  'Something else',
];

function AssistantBubble({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: '#fff', color: '#222', fontSize: '13.5px', lineHeight: 1.5,
      padding: '10px 14px', borderRadius: '14px 14px 14px 4px', maxWidth: '88%',
      alignSelf: 'flex-start', boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
      fontFamily: "'Inter',sans-serif",
    }}>
      {children}
    </div>
  );
}

function UserBubble({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: '#dcf8c6', color: '#111', fontSize: '13.5px', lineHeight: 1.5,
      padding: '10px 14px', borderRadius: '14px 14px 4px 14px', maxWidth: '88%',
      alignSelf: 'flex-end', boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
      fontFamily: "'Inter',sans-serif",
    }}>
      {children}
    </div>
  );
}

function WhatsAppLeadGateModal({ onClose }: { onClose: () => void }) {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [step, setStep] = useState<'menu' | 'name'>('menu');
  const [requirement, setRequirement] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);

  // Tracks the actually-visible area on mobile, since the on-screen keyboard
  // shrinks the visual viewport (and shifts its top offset) without shrinking
  // `dvh`/`100vh` on iOS Safari — without this the popup stays sized/positioned
  // for the full screen and drifts out of view above the keyboard.
  const [viewport, setViewport] = useState(() => ({
    height: typeof window !== 'undefined' ? (window.visualViewport?.height ?? window.innerHeight) : 0,
    offsetTop: typeof window !== 'undefined' ? (window.visualViewport?.offsetTop ?? 0) : 0,
  }));
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 640px)').matches : false
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  useEffect(() => {
    // No auto-focus here on purpose — focusing immediately on step change
    // opens the keyboard mid-transition on iOS, which is what caused the
    // popup to jump/misposition. Let the user tap the input themselves.
    messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight });
  }, [step]);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prevOverflow; };
  }, []);

  useEffect(() => {
    const vv = window.visualViewport;
    function update() {
      setViewport({ height: vv?.height ?? window.innerHeight, offsetTop: vv?.offsetTop ?? 0 });
    }
    vv?.addEventListener('resize', update);
    vv?.addEventListener('scroll', update);
    window.addEventListener('resize', update);
    update();
    return () => {
      vv?.removeEventListener('resize', update);
      vv?.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    const update = () => setIsMobile(mq.matches);
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  function chooseRequirement(value: string) {
    setRequirement(value);
    setInputValue('');
    setFormError('');
    setStep('name');
  }

  async function completeWithName(name: string, popup: Window | null) {
    if (!name.trim()) { popup?.close(); return; }
    setFormError('');
    setSubmitting(true);
    try {
      const token = executeRecaptcha ? await executeRecaptcha('whatsapp_gate') : '';
      const res = await fetch('/api/whatsapp-gate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recaptchaToken: token }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setFormError('Verification failed, please try again.');
        popup?.close();
        setSubmitting(false);
        return;
      }
      const url = buildWhatsAppUrl(name.trim(), requirement);
      if (popup) {
        popup.location.href = url;
      } else {
        // Popup was blocked when we tried to open it synchronously — fall back
        // to opening now (may still be blocked by strict browsers, but best effort).
        window.open(url, '_blank', 'noopener,noreferrer');
      }
      onClose();
      setStep('menu');
      setRequirement('');
      setInputValue('');
    } catch {
      setFormError('Something went wrong, please try again.');
      popup?.close();
    } finally {
      setSubmitting(false);
    }
  }

  function handleInputSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = inputValue.trim();
    if (!value) return;
    if (step === 'menu') {
      chooseRequirement(value);
    } else {
      // Open the tab synchronously, inside the click/submit handler, so it
      // still counts as a direct user gesture and isn't blocked by the
      // browser's popup blocker — we redirect it once verification finishes.
      const popup = window.open('about:blank', '_blank');
      if (popup) popup.opener = null;
      completeWithName(value, popup);
    }
  }

  return (
    <div
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="wa-gate-title"
      className="wa-gate-overlay"
      style={{
        position: 'fixed',
        top: `${viewport.offsetTop}px`,
        left: 0,
        right: 0,
        height: `${viewport.height}px`,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: '20px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="wa-gate-panel"
        style={{
          background: '#e9e3dc',
          borderRadius: '18px',
          width: '100%',
          maxWidth: '380px',
          height: isMobile ? `${Math.round(viewport.height * 0.92)}px` : 'min(560px, 80vh)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {/* Header */}
        <div style={{
          background: '#25d366', color: '#fff', padding: '16px 18px',
          display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0,
        }}>
          <div style={{
            width: '38px', height: '38px', borderRadius: '50%', background: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            overflow: 'hidden', padding: '6px', boxSizing: 'border-box',
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/favicon.ico" alt="Helios Event" width={22} height={22} style={{ objectFit: 'contain' }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div id="wa-gate-title" style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: '16px' }}>
              Helios Event
            </div>
            <div style={{ fontSize: '12px', opacity: 0.85 }}>How can we help you?</div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'transparent', border: 'none', color: '#fff', fontSize: '18px',
              cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center',
            }}
          >✕</button>
        </div>

        {/* Message area */}
        <div ref={messagesRef} style={{
          flex: 1, overflowY: 'auto', padding: '16px', display: 'flex',
          flexDirection: 'column', gap: '10px',
        }}>
          <AssistantBubble>Welcome to Helios Event!</AssistantBubble>

          {step === 'menu' && (
            <AssistantBubble>
              <div style={{ marginBottom: '10px' }}>I am looking for</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {REQUIREMENT_OPTIONS.map(opt => (
                  <button
                    key={opt}
                    onClick={() => chooseRequirement(opt)}
                    style={{
                      border: '1px solid #25d366', background: '#fff', color: '#128c5f',
                      borderRadius: '20px', padding: '8px 14px', fontSize: '13px',
                      fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter',sans-serif",
                      textAlign: 'left',
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </AssistantBubble>
          )}

          {step === 'name' && (
            <>
              <UserBubble>{requirement}</UserBubble>
              <AssistantBubble>Great! What&apos;s your name?</AssistantBubble>
            </>
          )}

          {formError && (
            <div style={{ fontSize: '12px', color: '#e53e3e', fontWeight: 500, alignSelf: 'center' }}>
              {formError}
            </div>
          )}
        </div>

        {/* Input bar */}
        <form
          onSubmit={handleInputSubmit}
          style={{
            display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px',
            background: '#fff', borderTop: '1px solid #eee', flexShrink: 0,
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder={step === 'menu' ? 'Or type your requirement…' : 'Type your name'}
            disabled={submitting}
            style={{
              flex: 1, border: '1px solid #ddd', borderRadius: '24px', padding: '10px 16px',
              // fontSize must stay >= 16px — iOS Safari auto-zooms the page on focus
              // for any input below that, which is what caused the popup to jump/scale
              fontSize: '16px', outline: 'none', fontFamily: "'Inter',sans-serif", color: '#111',
            }}
          />
          <button
            type="submit"
            aria-label="Send"
            disabled={submitting}
            style={{
              width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
              background: submitting ? '#7fd9a8' : '#25d366', border: 'none',
              cursor: submitting ? 'default' : 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="#fff"><path d="M2 21l21-9L2 3v7l15 2-15 2z"/></svg>
          </button>
        </form>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .wa-gate-overlay { align-items: flex-end !important; padding: 0 !important; }
          .wa-gate-panel {
            max-width: 100% !important;
            border-radius: 18px 18px 0 0 !important;
          }
        }
      `}</style>
    </div>
  );
}

export function WhatsAppGateProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const openGate = useCallback(() => setIsOpen(true), []);
  const closeGate = useCallback(() => setIsOpen(false), []);

  return (
    <WhatsAppGateContext.Provider value={{ openGate }}>
      {children}
      {isOpen && (
        <GoogleReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}>
          <WhatsAppLeadGateModal onClose={closeGate} />
        </GoogleReCaptchaProvider>
      )}
    </WhatsAppGateContext.Provider>
  );
}
