const TESTIMONIALS = [
  {
    name: 'Mr. Babu',
    role: 'Country Head',
    company: 'Hydra Specma',
    quote: 'We had the factory inauguration done by Helios Event Productions and we are very satisfied. We expect we will have more interactions with them in the future.',
    logoBg: '#1a1a1a',
    logoText: 'HydraSpecma',
    logoColor: '#f5c518',
  },
  {
    name: 'Ms. Sini',
    role: 'HR Manager',
    company: 'Jost India Auto Components',
    quote: 'Thanks for your extended support on our special day. Thanks and done a great job.',
    logoBg: '#fff',
    logoText: 'JOST',
    logoColor: '#1b3d8f',
    logoBorder: '#e5e7eb',
  },
  {
    name: 'Mr. Christopher',
    role: 'Marcom Head',
    company: 'Airtel',
    quote: 'Thanks for all your support for the huge success of the South hub event. Everyone appreciated the stage setup and the evening lawn setup. Feedback from the participants about the event is really good, thank you once again.',
    logoBg: '#e8001d',
    logoText: 'airtel',
    logoColor: '#fff',
  },
  {
    name: 'Mr. Chidambaram',
    role: 'Marcom',
    company: 'SIPCOT',
    quote: 'Helios Event Productions did an incredible job building the Tamil Nadu State Pavilion for Med Tech Expo. They were efficient and supportive, even meeting tight deadlines. The pavilion has been a huge hit! Thanks, Helios!',
    logoBg: '#fff',
    logoText: 'SIPCOT',
    logoColor: '#c0392b',
    logoBorder: '#e5e7eb',
  },
];

function Stars() {
  return (
    <div style={{ display: 'flex', gap: '3px' }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="#f5a623">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="testimonial">
      <style>{`
        .testi-grid {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(520px, 1fr));
          gap: 28px;
          padding: 0 16px;
        }
        .testi-card {
          display: flex;
          flex-direction: row;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(0,0,0,0.08);
        }
        .testi-strip {
          width: 160px;
          flex-shrink: 0;
          background: linear-gradient(170deg, #adc905 0%, #c8e606 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 28px 16px;
          position: relative;
        }
        .testi-quote-mark {
          position: absolute;
          top: 12px;
          left: 12px;
          font-size: 52px;
          font-weight: 900;
          color: rgba(0,0,0,0.18);
          line-height: 1;
          font-family: Georgia, serif;
          user-select: none;
        }
        .testi-body {
          flex: 1;
          background: #fff;
          padding: 28px 24px 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        @media (max-width: 600px) {
          .testi-grid {
            grid-template-columns: 1fr;
            gap: 20px;
            padding: 0 12px;
          }
          .testi-card {
            flex-direction: column;
          }
          .testi-strip {
            width: 100%;
            flex-direction: row;
            justify-content: flex-start;
            padding: 18px 20px;
            gap: 16px;
          }
          .testi-quote-mark {
            display: none;
          }
          .testi-body {
            padding: 20px 18px 18px;
          }
        }
      `}</style>

      <div className="test-hdr fade-up">
        <div className="sec-label">Client Stories</div>
        <h2 className="test-title">Hear it straight from our clients</h2>
      </div>

      <div className="testi-grid">
        {TESTIMONIALS.map((t, i) => (
          <div
            key={i}
            className="testi-card fade-up"
            style={{ transitionDelay: `${i * 0.08}s` }}
          >
            {/* Lime accent strip + logo */}
            <div className="testi-strip">
              <div className="testi-quote-mark">"</div>
              <div style={{
                width: '80px', height: '80px', borderRadius: '50%',
                background: t.logoBg,
                border: t.logoBorder ? `2px solid ${t.logoBorder}` : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden',
                boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                flexShrink: 0,
              }}>
                <span style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 900,
                  fontSize: t.logoText.length > 5 ? '10px' : '14px',
                  color: t.logoColor,
                  textAlign: 'center',
                  letterSpacing: '0.5px',
                  lineHeight: 1.2,
                  padding: '4px',
                }}>
                  {t.logoText}
                </span>
              </div>
              {/* Name shown inline on mobile strip */}
              <div className="testi-strip-name" style={{
                display: 'none',
              }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#1a1a1a', fontFamily: "'Poppins', sans-serif" }}>{t.name}</div>
                <div style={{ fontSize: '11px', color: '#444', fontFamily: "'Inter', sans-serif" }}>{t.company}</div>
              </div>
            </div>

            {/* Card body */}
            <div className="testi-body">
              <div>
                <div style={{
                  fontSize: '11px', fontWeight: 800, color: '#111',
                  fontFamily: "'Poppins', sans-serif",
                  textTransform: 'uppercase', letterSpacing: '1px',
                  marginBottom: '6px',
                }}>
                  Client Testimonial
                </div>
                <div style={{
                  width: '40px', height: '3px',
                  background: 'linear-gradient(to right, #adc905, #c8e606)',
                  borderRadius: '2px',
                }} />
              </div>

              <Stars />

              <p style={{
                fontSize: '14px', color: '#555',
                lineHeight: 1.8, margin: 0, flex: 1,
                fontFamily: "'Inter', sans-serif",
              }}>
                {t.quote}
              </p>

              <div style={{ paddingTop: '10px', borderTop: '1px solid #f3f4f6' }}>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#adc905', fontFamily: "'Poppins', sans-serif" }}>
                  {t.name}
                </div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#1a1a1a', fontFamily: "'Inter', sans-serif", marginTop: '2px' }}>
                  {t.role}
                </div>
                <div style={{ fontSize: '12px', color: '#888', fontFamily: "'Inter', sans-serif", marginTop: '1px' }}>
                  {t.company}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
