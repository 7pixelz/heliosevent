export default function Loading() {
  return (
    <>
      <style>{`
        @keyframes hel-progress {
          0%   { width: 0%;   opacity: 1; }
          70%  { width: 85%;  opacity: 1; }
          100% { width: 100%; opacity: 0; }
        }
        .hel-loading-bar {
          position: fixed;
          top: 0; left: 0;
          height: 3px;
          background: linear-gradient(90deg, #adc905, #ff6a00);
          animation: hel-progress 1.2s ease-out forwards;
          z-index: 9998;
          box-shadow: 0 0 8px rgba(173,201,5,0.6);
        }
      `}</style>
      <div className="hel-loading-bar" />
      <div style={{ minHeight: '100vh' }} />
    </>
  );
}
