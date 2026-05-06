'use client';

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/917401030000?text=Hi%2C%20Website%20Enquiry"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      style={{
        position: 'fixed',
        bottom: '32px',
        right: '24px',
        zIndex: 1001,
        width: '54px',
        height: '54px',
        borderRadius: '50%',
        background: '#25d366',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 20px rgba(37,211,102,0.5), 0 2px 8px rgba(0,0,0,0.2)',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLAnchorElement;
        el.style.transform = 'scale(1.1)';
        el.style.boxShadow = '0 6px 28px rgba(37,211,102,0.65), 0 3px 10px rgba(0,0,0,0.25)';
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLAnchorElement;
        el.style.transform = 'scale(1)';
        el.style.boxShadow = '0 4px 20px rgba(37,211,102,0.5), 0 2px 8px rgba(0,0,0,0.2)';
      }}
    >
      {/* WhatsApp SVG logo */}
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M16 2.667C8.636 2.667 2.667 8.636 2.667 16c0 2.347.618 4.558 1.7 6.474L2.667 29.333l7.059-1.674A13.267 13.267 0 0016 29.333c7.364 0 13.333-5.97 13.333-13.333S23.364 2.667 16 2.667z"
          fill="#fff"
        />
        <path
          d="M16 4.667C9.74 4.667 4.667 9.74 4.667 16c0 2.11.572 4.088 1.568 5.783l.23.388-1.02 3.726 3.831-.993.376.22A11.267 11.267 0 0016 27.333c6.26 0 11.333-5.073 11.333-11.333S22.26 4.667 16 4.667z"
          fill="#25D366"
        />
        <path
          d="M11.93 9.667c-.28-.624-.574-.637-.84-.648-.218-.01-.467-.009-.716-.009-.25 0-.656.094-.999.468-.343.375-1.31 1.28-1.31 3.12s1.342 3.62 1.53 3.87c.187.25 2.59 4.137 6.387 5.636 3.16 1.248 3.798 1 4.485.938.687-.062 2.217-.906 2.53-1.781.312-.875.312-1.624.218-1.781-.093-.156-.343-.25-.718-.437-.374-.188-2.217-1.094-2.561-1.219-.343-.125-.593-.187-.843.188-.25.374-.968 1.218-1.187 1.468-.218.25-.437.281-.812.094-.375-.188-1.583-.583-3.016-1.862-1.115-.996-1.868-2.226-2.086-2.601-.218-.374-.023-.577.164-.762.168-.167.375-.437.562-.656.188-.219.25-.375.375-.625.125-.25.063-.469-.031-.657-.093-.187-.83-2.032-1.15-2.764z"
          fill="#fff"
        />
      </svg>

      {/* Pulse ring */}
      <span style={{
        position: 'absolute',
        inset: 0,
        borderRadius: '50%',
        border: '2px solid rgba(37,211,102,0.6)',
        animation: 'wa-pulse 2s ease-out infinite',
        pointerEvents: 'none',
      }} />

      <style>{`
        @keyframes wa-pulse {
          0% { transform: scale(1); opacity: 0.8; }
          70% { transform: scale(1.5); opacity: 0; }
          100% { transform: scale(1.5); opacity: 0; }
        }
      `}</style>
    </a>
  );
}
