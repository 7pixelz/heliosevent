'use client';

import { useState, useRef } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';

const GEO_URL = '/india-states.geojson';

// [longitude, latitude]
const cities: { name: string; coords: [number, number] }[] = [
  // South India
  { name: 'Chennai', coords: [80.27, 13.08] },
  { name: 'Bangalore', coords: [77.59, 12.97] },
  { name: 'Hyderabad', coords: [78.49, 17.39] },
  { name: 'Kochi', coords: [76.27, 9.93] },
  { name: 'Coimbatore', coords: [76.96, 11.02] },
  { name: 'Mysore', coords: [76.64, 12.30] },
  { name: 'Ooty', coords: [76.70, 11.41] },
  { name: 'Pondicherry', coords: [79.81, 11.94] },
  { name: 'Trivandrum', coords: [76.94, 8.52] },
  { name: 'Alleppey', coords: [76.34, 9.50] },
  { name: 'Munnar', coords: [77.06, 10.09] },
  { name: 'Thekkady', coords: [77.17, 9.59] },
  { name: 'Varkala', coords: [76.72, 8.74] },
  { name: 'Kovalam', coords: [76.98, 8.40] },
  { name: 'Wayanad', coords: [76.13, 11.69] },
  { name: 'Kodaikanal', coords: [77.49, 10.24] },
  { name: 'Gokarna', coords: [74.32, 14.55] },
  { name: 'Hampi', coords: [76.46, 15.34] },
  { name: 'Dandeli', coords: [74.62, 15.26] },
  { name: 'Yercaud', coords: [78.21, 11.77] },
  { name: 'Yelagiri Hills', coords: [78.63, 12.58] },
  { name: 'Nandi Hills', coords: [77.68, 13.37] },
  { name: 'Chikmagalur', coords: [75.77, 13.32] },
  { name: 'Visakhapatnam', coords: [83.22, 17.69] },
  { name: 'Coorg', coords: [75.81, 12.34] },
  // North India
  { name: 'Delhi NCR', coords: [77.21, 28.61] },
  { name: 'Agra', coords: [78.01, 27.18] },
  { name: 'Lucknow', coords: [80.95, 26.85] },
  { name: 'Manali', coords: [77.19, 32.24] },
  { name: 'Shimla', coords: [77.17, 31.10] },
  { name: 'Chandigarh', coords: [76.78, 30.73] },
  { name: 'Rishikesh', coords: [78.27, 30.09] },
  { name: 'Dehradun', coords: [78.03, 30.32] },
  { name: 'Mussoorie', coords: [78.06, 30.45] },
  { name: 'Dharamshala', coords: [76.32, 32.22] },
  { name: 'Srinagar', coords: [74.80, 34.08] },
  { name: 'Gulmarg', coords: [74.38, 34.05] },
  { name: 'Pahalgam', coords: [75.31, 34.01] },
  { name: 'Nainital', coords: [79.46, 29.38] },
  { name: 'Gangtok', coords: [88.61, 27.33] },
  { name: 'Kalimpong', coords: [88.47, 27.07] },
  { name: 'Kasol', coords: [77.31, 32.01] },
  { name: 'Kasauli', coords: [76.96, 30.90] },
  { name: 'Auli', coords: [79.56, 30.52] },
  { name: 'Chail', coords: [77.20, 30.96] },
  { name: 'Dalhousie', coords: [75.97, 32.54] },
  { name: 'Lansdowne', coords: [78.69, 29.84] },
  { name: 'Spiti Valley', coords: [78.03, 32.24] },
  // West India
  { name: 'Mumbai', coords: [72.88, 19.08] },
  { name: 'Goa', coords: [74.12, 15.30] },
  { name: 'Pune', coords: [73.86, 18.52] },
  { name: 'Jaipur', coords: [75.79, 26.91] },
  { name: 'Udaipur', coords: [73.71, 24.59] },
  { name: 'Jodhpur', coords: [73.02, 26.24] },
  { name: 'Jaisalmer', coords: [70.91, 26.92] },
  { name: 'Ahmedabad', coords: [72.57, 23.02] },
  { name: 'Vadodara', coords: [73.18, 22.31] },
  { name: 'Rann of Kutch', coords: [69.86, 23.73] },
  { name: 'Ranthambore', coords: [76.50, 26.02] },
  { name: 'Kumbhalgarh', coords: [73.59, 25.15] },
  { name: 'Neemrana', coords: [76.39, 27.99] },
  { name: 'Mount Abu', coords: [72.72, 24.59] },
  { name: 'Nagpur', coords: [79.09, 21.15] },
  { name: 'Mahabaleshwar', coords: [73.66, 17.92] },
  { name: 'Lonavala', coords: [73.40, 18.75] },
  { name: 'Khandala', coords: [73.39, 18.77] },
  { name: 'Lavasa', coords: [73.51, 18.40] },
  { name: 'Igatpuri', coords: [73.55, 19.70] },
  { name: 'Alibaug', coords: [72.87, 18.64] },
  { name: 'Daman and Diu', coords: [72.83, 20.40] },
  // East & Islands
  { name: 'Kolkata', coords: [88.36, 22.57] },
  { name: 'Darjeeling', coords: [88.26, 27.04] },
  { name: 'Guwahati', coords: [91.74, 26.14] },
  { name: 'Shillong', coords: [91.89, 25.58] },
  { name: 'Bhubaneswar', coords: [85.82, 20.30] },
  { name: 'Patna', coords: [85.14, 25.59] },
  { name: 'Siliguri', coords: [88.40, 26.73] },
  { name: 'Tawang', coords: [91.86, 27.59] },
  { name: 'Cherrapunji', coords: [91.73, 25.28] },
  { name: 'Jamshedpur', coords: [86.20, 22.80] },
  { name: 'Binsar', coords: [79.75, 29.72] },
  // Central India
  { name: 'Bhopal', coords: [77.41, 23.26] },
  { name: 'Indore', coords: [75.86, 22.72] },
  { name: 'Kanha', coords: [80.61, 22.33] },
  { name: 'Pench', coords: [79.29, 21.74] },
];

const overseas = [
  '🇸🇬 Singapore', '🇭🇰 Hong Kong', '🇲🇴 Macau', '🇦🇺 Australia',
  '🇯🇵 Japan', '🇪🇸 Spain', '🇫🇷 France', '🇨🇭 Switzerland',
  '🇮🇩 Indonesia', '🇻🇳 Vietnam', '🇰🇪 Kenya', '🇦🇪 Dubai',
  '🇱🇰 Sri Lanka', '🇧🇩 Bangladesh', '🇳🇵 Nepal', '🇹🇭 Thailand',
];

export default function Locations() {
  const [tooltip, setTooltip] = useState<{ name: string; pctX: number; pctY: number } | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  return (
    <section style={{ background: '#0a0c12', padding: '88px 24px' }}>
      <style>{`
        .loc-map-wrap { position: relative; max-width: 700px; margin: 0 auto; }
        .loc-tooltip {
          position: absolute; pointerEvents: none;
          background: rgba(20,24,36,0.95); border: 1px solid rgba(173,201,5,0.3);
          borderRadius: 8px; padding: 5px 12px; fontSize: 12px; fontWeight: 600;
          color: #fff; fontFamily: 'Inter',sans-serif; whiteSpace: nowrap;
          transform: translate(-50%, -130%); zIndex: 10;
          boxShadow: 0 4px 16px rgba(0,0,0,0.4);
          pointerEvents: none;
        }
        .geo-path { transition: fill 0.2s; }
        .geo-path:hover { fill: rgba(173,201,5,0.12) !important; cursor: default; }
        .city-dot { cursor: pointer; transition: r 0.15s; }
        .city-dot:hover { r: 5; }
        .overseas-chip {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 7px 14px; border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.7); font-size: 13px;
          font-family: 'Inter',sans-serif; white-space: nowrap;
          transition: all 0.2s;
        }
        .overseas-chip:hover { border-color: rgba(173,201,5,0.3); background: rgba(173,201,5,0.06); color: #fff; }
      `}</style>

      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <div style={{ height: '1px', width: '32px', background: 'rgba(173,201,5,0.4)' }} />
            <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: '#adc905', fontFamily: "'Inter',sans-serif" }}>Where We've Delivered</span>
            <div style={{ height: '1px', width: '32px', background: 'rgba(173,201,5,0.4)' }} />
          </div>
          <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 'clamp(26px,4vw,40px)', color: '#fff', margin: '0 0 14px', lineHeight: 1.2 }}>
            90+ Destinations Across India
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.4)', fontFamily: "'Inter',sans-serif", margin: 0 }}>
            From the Himalayas to the backwaters — every dot is an event delivered.
          </p>
        </div>

        {/* Map */}
        <div ref={mapRef} className="loc-map-wrap" onMouseLeave={() => setTooltip(null)}>
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ center: [82, 23], scale: 1050 }}
            width={700}
            height={680}
            style={{ width: '100%', height: 'auto' }}
          >
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo: unknown) => (
                  <Geography
                    key={(geo as { rsmKey: string }).rsmKey}
                    geography={geo}
                    style={{
                      default: { fill: 'rgba(255,255,255,0.04)', stroke: 'rgba(255,255,255,0.12)', strokeWidth: 0.5, outline: 'none' },
                      hover: { fill: 'rgba(173,201,5,0.1)', stroke: 'rgba(173,201,5,0.25)', strokeWidth: 0.5, outline: 'none' },
                      pressed: { outline: 'none' },
                    }}
                  />
                ))
              }
            </Geographies>

            {cities.map(city => (
              <Marker
                key={city.name}
                coordinates={city.coords}
                onMouseEnter={(e: React.MouseEvent) => {
                  if (!mapRef.current) return;
                  const rect = mapRef.current.getBoundingClientRect();
                  setTooltip({
                    name: city.name,
                    pctX: ((e.clientX - rect.left) / rect.width) * 100,
                    pctY: ((e.clientY - rect.top) / rect.height) * 100,
                  });
                }}
                onMouseLeave={() => setTooltip(null)}
              >
                <circle r={6} fill="rgba(255,106,0,0.15)" />
                <circle r={3} fill="#ff6a00" stroke="rgba(255,255,255,0.3)" strokeWidth={0.5} style={{ cursor: 'pointer' }} />
              </Marker>
            ))}
          </ComposableMap>

          {tooltip && (
            <div
              style={{
                position: 'absolute',
                left: `${tooltip.pctX}%`,
                top: `${tooltip.pctY}%`,
                background: 'rgba(15,19,28,0.96)',
                border: '1px solid rgba(173,201,5,0.35)',
                borderRadius: '8px',
                padding: '5px 12px',
                fontSize: '12px',
                fontWeight: 600,
                color: '#fff',
                fontFamily: "'Inter',sans-serif",
                whiteSpace: 'nowrap',
                transform: 'translate(-50%, -130%)',
                zIndex: 10,
                boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
                pointerEvents: 'none',
              }}
            >
              <span style={{ color: '#adc905', marginRight: '4px' }}>•</span>
              {tooltip.name}
            </div>
          )}
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', margin: '32px 0 48px', flexWrap: 'wrap' }}>
          {[
            { num: '85+', label: 'Domestic Cities' },
            { num: '16+', label: 'International Destinations' },
            { num: '20+', label: 'Years of Delivery' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#adc905', fontFamily: "'Poppins',sans-serif", lineHeight: 1 }}>{s.num}</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontFamily: "'Inter',sans-serif", marginTop: '4px', letterSpacing: '0.5px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Overseas */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '36px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', justifyContent: 'center' }}>
            <div style={{ height: '1px', width: '32px', background: 'rgba(52,211,153,0.4)' }} />
            <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: '#34d399', fontFamily: "'Inter',sans-serif" }}>International Destinations</span>
            <div style={{ height: '1px', width: '32px', background: 'rgba(52,211,153,0.4)' }} />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
            {overseas.map(dest => (
              <div key={dest} className="overseas-chip">{dest}</div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
