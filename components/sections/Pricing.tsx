const plans = [
  {
    num: '01', accent: '#adc905',
    tag: 'Activities Only',
    price: '₹2,500', priceEnd: '– ₹4,000',
    popular: false,
    desc: 'Perfect for a full-day engagement with structured activities and professional facilitation.',
    features: ['Full Day Programme','All Team Activities','Props & Materials','Senior Facilitator','Support Staff','PA System & Mic','Transport Included'],
  },
  {
    num: '02', accent: '#ff6a00',
    tag: 'Activities + Venue',
    price: '₹4,500', priceEnd: '– ₹6,500',
    popular: false,
    desc: 'Add a dedicated venue — open lawn or conference hall — to your activity package.',
    features: ['Full Day Programme','Welcome Refreshments','Open Lawn / Hall','All Team Activities','Props & Materials','Senior Facilitator','Support Staff','PA System & Mic','Transport Included'],
  },
  {
    num: '03', accent: '#f59e0b',
    tag: 'Stay, Food & Activities',
    price: '₹7,500', priceEnd: '– ₹12,500',
    popular: true,
    desc: 'Our most popular plan — overnight stay, meals, venue, and all activities covered end-to-end.',
    features: ['1-Night Stay','Double Sharing Room','Buffet Meal Included','Morning Tea & Snacks','Conference Hall','Open Lawn','All Team Activities','Props & Materials','Senior Facilitator','PA System & Mic','Facilitators Stay & Food'],
  },
  {
    num: '04', accent: '#34d399',
    tag: 'Overseas Team Outing',
    price: '₹22,500', priceEnd: '– ₹32,500',
    popular: false,
    desc: 'A premium overseas experience with sightseeing, stay, meals, and world-class activities.',
    features: ['2-Night Stay','Double Sharing','All Meals Included','Sightseeing Tours','Local Transfers','Conference Hall','All Team Activities','Props & Materials','Senior Facilitator','Support Staff','Facilitators Stay & Food'],
  },
];

export default function Pricing() {
  return (
    <section style={{ background: '#0a0a0a', padding: '96px 60px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div style={{ fontSize: '10px', letterSpacing: '4px', textTransform: 'uppercase', color: '#adc905', fontFamily: "'Inter',sans-serif", fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '14px' }}>
            <span style={{ width: '22px', height: '2px', background: '#adc905', display: 'inline-block' }}></span>
            Packages & Pricing
            <span style={{ width: '22px', height: '2px', background: '#adc905', display: 'inline-block' }}></span>
          </div>
          <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 'clamp(28px,3.5vw,46px)', color: '#fff', lineHeight: 1.15, marginBottom: '14px' }}>
            Pick the Right Plan<br />for Your Team
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.4)', fontFamily: "'Inter',sans-serif", maxWidth: '480px', margin: '0 auto', lineHeight: 1.7 }}>
            All prices are per person + 18% GST. Minimum group of 30. Custom quotes available.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '20px', alignItems: 'start' }}>
          {plans.map((plan, i) => (
            <div key={i} style={{ borderRadius: '20px', background: plan.popular ? '#1a1a1a' : '#111', border: plan.popular ? `1.5px solid ${plan.accent}` : '1px solid rgba(255,255,255,0.07)', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '4px', background: plan.accent, borderRadius: '20px 20px 0 0' }}></div>
              <div style={{ position: 'absolute', top: '12px', right: '16px', fontFamily: "'Poppins',sans-serif", fontWeight: 900, fontSize: '72px', color: 'rgba(255,255,255,0.04)', lineHeight: 1, userSelect: 'none' }}>{plan.num}</div>
              {plan.popular && (
                <div style={{ position: 'absolute', top: '20px', left: '20px', background: plan.accent, color: '#000', fontSize: '9px', fontWeight: 800, fontFamily: "'Inter',sans-serif", padding: '4px 10px', borderRadius: '999px', letterSpacing: '1px' }}>MOST POPULAR</div>
              )}
              <div style={{ padding: plan.popular ? '52px 24px 28px' : '28px 24px 28px', display: 'flex', flexDirection: 'column', gap: '0', flex: 1 }}>
                <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: plan.accent, fontFamily: "'Inter',sans-serif", marginBottom: '10px' }}>{plan.tag}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '6px' }}>
                  <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 900, fontSize: '28px', color: '#fff' }}>{plan.price}</span>
                  <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: '14px', color: 'rgba(255,255,255,0.4)' }}>{plan.priceEnd}</span>
                </div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontFamily: "'Inter',sans-serif", marginBottom: '18px' }}>per person · +18% GST</div>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', fontFamily: "'Inter',sans-serif", lineHeight: 1.7, marginBottom: '22px' }}>{plan.desc}</p>
                <div style={{ height: '1px', background: 'rgba(255,255,255,0.07)', marginBottom: '18px' }}></div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '28px', flex: 1 }}>
                  {plan.features.map((f, fi) => (
                    <span key={fi} style={{ padding: '5px 12px', borderRadius: '999px', background: `${plan.accent}15`, border: `1px solid ${plan.accent}30`, color: 'rgba(255,255,255,0.7)', fontSize: '11px', fontFamily: "'Inter',sans-serif" }}>{f}</span>
                  ))}
                </div>
                <a href="#contact" style={{ display: 'block', textAlign: 'center', background: plan.popular ? plan.accent : 'transparent', color: plan.popular ? '#000' : plan.accent, border: `1.5px solid ${plan.accent}`, fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: '13px', padding: '13px', borderRadius: '10px', textDecoration: 'none', letterSpacing: '0.5px' }}>
                  Get a Custom Quote →
                </a>
              </div>
            </div>
          ))}
        </div>

        <p style={{ textAlign: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.2)', fontFamily: "'Inter',sans-serif", marginTop: '36px' }}>
          Prices vary based on location, season & group size. Contact us for a tailored quote.
        </p>
      </div>
    </section>
  );
}
