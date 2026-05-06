const regions = [
  { region: '🏔 North India', accent: '#adc905', places: ['Agra','Auli','Chandigarh','Chail','Dalhousie','Dehradun','Delhi NCR','Dharamshala','Gangtok','Gulmarg','Jim Corbett','Kalimpong','Kasol','Kasauli','Lansdowne','Lucknow','Manali','Mussoorie','Nainital','Pahalgam','Rishikesh','Shimla','Srinagar','Spiti Valley'] },
  { region: '🌴 South India', accent: '#ff6a00', places: ['Alleppey','Bangalore','Chennai','Chikmagalur','Coimbatore','Coorg','Dandeli','Gokarna','Hampi','Hyderabad','Kochi','Kodaikanal','Kovalam','Munnar','Mysore','Nandi Hills','Ooty','Pondicherry','Thekkady','Trivandrum','Varkala','Visakhapatnam','Wayanad','Yelagiri Hills','Yercaud'] },
  { region: '🌊 East & Islands', accent: '#00bcd4', places: ['Bhubaneswar','Binsar','Darjeeling','Jamshedpur','Kolkata','Patna','Siliguri','Andaman','Lakshadweep','Cherrapunji','Guwahati','Shillong','Tawang'] },
  { region: '🏜 West India', accent: '#f59e0b', places: ['Ahmedabad','Alibaug','Daman And Diu','Goa','Igatpuri','Jaipur','Jaisalmer','Jodhpur','Khandala','Kumbhalgarh','Lavasa','Lonawala','Mahabaleshwar','Mount Abu','Mumbai','Nagpur','Neemrana','Pune','Rann of Kutch','Ranthambore','Udaipur','Vadodara'] },
  { region: '🌿 Central India', accent: '#a78bfa', places: ['Bhopal','Indore','Kanha','Pench'] },
  { region: '✈️ Overseas', accent: '#34d399', places: ['🇮🇳 India', '🇸🇬 Singapore', '🇭🇰 Hong Kong', '🇲🇴 Macau', '🇦🇺 Australia', '🇯🇵 Japan', '🇪🇸 Spain', '🇫🇷 France', '🇨🇭 Switzerland', '🇮🇩 Indonesia', '🇻🇳 Vietnam', '🇰🇪 Kenya', '🇦🇪 Dubai', '🇱🇰 Sri Lanka', '🇧🇩 Bangladesh', '🇳🇵 Nepal', '🇹🇭 Thailand'] },
];

export default function Locations() {
  return (
    <section style={{ background: '#0f0f0f', padding: '88px 60px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div style={{ fontSize: '10px', letterSpacing: '4px', textTransform: 'uppercase', color: '#adc905', fontFamily: "'Inter',sans-serif", fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '14px' }}>
            <span style={{ width: '22px', height: '2px', background: '#adc905', display: 'inline-block' }}></span>
            Our Reach
            <span style={{ width: '22px', height: '2px', background: '#adc905', display: 'inline-block' }}></span>
          </div>
          <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 'clamp(28px,3.5vw,46px)', color: '#fff', lineHeight: 1.15, marginBottom: '16px' }}>
            We Bring Events to Life<br />Anywhere You Are
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.4)', fontFamily: "'Inter',sans-serif", maxWidth: '520px', margin: '0 auto', lineHeight: 1.7 }}>
            From the Himalayas to the backwaters — we've managed events in 90+ destinations across India and overseas.
          </p>
        </div>

        {regions.map((group, gi) => (
          <div key={gi} style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: '13px', color: group.accent, letterSpacing: '0.5px' }}>{group.region}</span>
              <div style={{ flex: 1, height: '1px', background: `${group.accent}30` }}></div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {group.places.map((place, pi) => (
                <span key={pi} style={{ padding: '7px 16px', borderRadius: '999px', border: `1px solid ${group.accent}35`, background: `${group.accent}0d`, color: 'rgba(255,255,255,0.75)', fontSize: '13px', fontFamily: "'Inter',sans-serif", cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>{place}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
