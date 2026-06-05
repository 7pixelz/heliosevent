'use client';

import { useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';

const GEO_INDIA = '/india-states.geojson';
const GEO_WORLD = '/world-countries.json';

/* ─── International ─── */
const intlRegions = [
  {
    label: 'Asia Pacific', color: '#ff6a00',
    destinations: [
      { name: 'Singapore',  flag: '🇸🇬', coords: [103.82,   1.35] as [number, number] },
      { name: 'Hong Kong',  flag: '🇭🇰', coords: [114.17,  22.32] as [number, number] },
      { name: 'Macau',      flag: '🇲🇴', coords: [113.55,  22.20] as [number, number] },
      { name: 'Japan',      flag: '🇯🇵', coords: [139.69,  35.69] as [number, number] },
      { name: 'Indonesia',  flag: '🇮🇩', coords: [106.85,  -6.21] as [number, number] },
      { name: 'Vietnam',    flag: '🇻🇳', coords: [105.85,  21.03] as [number, number] },
      { name: 'Thailand',   flag: '🇹🇭', coords: [100.52,  13.75] as [number, number] },
      { name: 'Sri Lanka',  flag: '🇱🇰', coords: [ 79.86,   6.93] as [number, number] },
      { name: 'Bangladesh', flag: '🇧🇩', coords: [ 90.41,  23.82] as [number, number] },
      { name: 'Nepal',      flag: '🇳🇵', coords: [ 85.32,  27.72] as [number, number] },
      { name: 'Australia',  flag: '🇦🇺', coords: [151.21, -33.87] as [number, number] },
    ],
  },
  {
    label: 'Middle East', color: '#fbbf24',
    destinations: [
      { name: 'Dubai', flag: '🇦🇪', coords: [55.30, 25.20] as [number, number] },
    ],
  },
  {
    label: 'Europe', color: '#34d399',
    destinations: [
      { name: 'Spain',       flag: '🇪🇸', coords: [ -3.70, 40.42] as [number, number] },
      { name: 'France',      flag: '🇫🇷', coords: [  2.35, 48.86] as [number, number] },
      { name: 'Switzerland', flag: '🇨🇭', coords: [  8.54, 47.38] as [number, number] },
    ],
  },
  {
    label: 'Africa', color: '#a78bfa',
    destinations: [
      { name: 'Kenya', flag: '🇰🇪', coords: [36.82, -1.29] as [number, number] },
    ],
  },
];

const intlColorMap = new Map<string, string>();
intlRegions.forEach(r => r.destinations.forEach(d => intlColorMap.set(d.name, r.color)));
const allIntl = intlRegions.flatMap(r => r.destinations);

/* ─── Domestic ─── */
const domesticRegions = [
  {
    label: 'South India', color: '#ff6a00',
    cities: [
      { name: 'Chennai',       coords: [ 80.27, 13.08] as [number, number] },
      { name: 'Bangalore',     coords: [ 77.59, 12.97] as [number, number] },
      { name: 'Hyderabad',     coords: [ 78.49, 17.39] as [number, number] },
      { name: 'Kochi',         coords: [ 76.27,  9.93] as [number, number] },
      { name: 'Coimbatore',    coords: [ 76.96, 11.02] as [number, number] },
      { name: 'Mysore',        coords: [ 76.64, 12.30] as [number, number] },
      { name: 'Ooty',          coords: [ 76.70, 11.41] as [number, number] },
      { name: 'Pondicherry',   coords: [ 79.81, 11.94] as [number, number] },
      { name: 'Trivandrum',    coords: [ 76.94,  8.52] as [number, number] },
      { name: 'Alleppey',      coords: [ 76.34,  9.50] as [number, number] },
      { name: 'Munnar',        coords: [ 77.06, 10.09] as [number, number] },
      { name: 'Thekkady',      coords: [ 77.17,  9.59] as [number, number] },
      { name: 'Varkala',       coords: [ 76.72,  8.74] as [number, number] },
      { name: 'Kovalam',       coords: [ 76.98,  8.40] as [number, number] },
      { name: 'Wayanad',       coords: [ 76.13, 11.69] as [number, number] },
      { name: 'Kodaikanal',    coords: [ 77.49, 10.24] as [number, number] },
      { name: 'Gokarna',       coords: [ 74.32, 14.55] as [number, number] },
      { name: 'Hampi',         coords: [ 76.46, 15.34] as [number, number] },
      { name: 'Dandeli',       coords: [ 74.62, 15.26] as [number, number] },
      { name: 'Yercaud',       coords: [ 78.21, 11.77] as [number, number] },
      { name: 'Yelagiri Hills',coords: [ 78.63, 12.58] as [number, number] },
      { name: 'Nandi Hills',   coords: [ 77.68, 13.37] as [number, number] },
      { name: 'Chikmagalur',   coords: [ 75.77, 13.32] as [number, number] },
      { name: 'Visakhapatnam', coords: [ 83.22, 17.69] as [number, number] },
      { name: 'Coorg',         coords: [ 75.81, 12.34] as [number, number] },
    ],
  },
  {
    label: 'North India', color: '#adc905',
    cities: [
      { name: 'Delhi NCR',   coords: [77.21, 28.61] as [number, number] },
      { name: 'Agra',        coords: [78.01, 27.18] as [number, number] },
      { name: 'Lucknow',     coords: [80.95, 26.85] as [number, number] },
      { name: 'Manali',      coords: [77.19, 32.24] as [number, number] },
      { name: 'Shimla',      coords: [77.17, 31.10] as [number, number] },
      { name: 'Chandigarh',  coords: [76.78, 30.73] as [number, number] },
      { name: 'Rishikesh',   coords: [78.27, 30.09] as [number, number] },
      { name: 'Dehradun',    coords: [78.03, 30.32] as [number, number] },
      { name: 'Mussoorie',   coords: [78.06, 30.45] as [number, number] },
      { name: 'Dharamshala', coords: [76.32, 32.22] as [number, number] },
      { name: 'Srinagar',    coords: [74.80, 34.08] as [number, number] },
      { name: 'Gulmarg',     coords: [74.38, 34.05] as [number, number] },
      { name: 'Pahalgam',    coords: [75.31, 34.01] as [number, number] },
      { name: 'Nainital',    coords: [79.46, 29.38] as [number, number] },
      { name: 'Gangtok',     coords: [88.61, 27.33] as [number, number] },
    ],
  },
  {
    label: 'West India', color: '#34d399',
    cities: [
      { name: 'Mumbai',         coords: [72.88, 19.08] as [number, number] },
      { name: 'Goa',            coords: [74.12, 15.30] as [number, number] },
      { name: 'Pune',           coords: [73.86, 18.52] as [number, number] },
      { name: 'Jaipur',         coords: [75.79, 26.91] as [number, number] },
      { name: 'Udaipur',        coords: [73.71, 24.59] as [number, number] },
      { name: 'Jodhpur',        coords: [73.02, 26.24] as [number, number] },
      { name: 'Jaisalmer',      coords: [70.91, 26.92] as [number, number] },
      { name: 'Ahmedabad',      coords: [72.57, 23.02] as [number, number] },
      { name: 'Vadodara',       coords: [73.18, 22.31] as [number, number] },
      { name: 'Rann of Kutch',  coords: [69.86, 23.73] as [number, number] },
      { name: 'Ranthambore',    coords: [76.50, 26.02] as [number, number] },
      { name: 'Kumbhalgarh',    coords: [73.59, 25.15] as [number, number] },
      { name: 'Nagpur',         coords: [79.09, 21.15] as [number, number] },
      { name: 'Mahabaleshwar',  coords: [73.66, 17.92] as [number, number] },
      { name: 'Khandala',       coords: [73.39, 18.77] as [number, number] },
      { name: 'Lavasa',         coords: [73.51, 18.40] as [number, number] },
    ],
  },
  {
    label: 'East India', color: '#818cf8',
    cities: [
      { name: 'Kolkata',      coords: [88.36, 22.57] as [number, number] },
      { name: 'Darjeeling',   coords: [88.26, 27.04] as [number, number] },
      { name: 'Guwahati',     coords: [91.74, 26.14] as [number, number] },
      { name: 'Shillong',     coords: [91.89, 25.58] as [number, number] },
      { name: 'Bhubaneswar',  coords: [85.82, 20.30] as [number, number] },
      { name: 'Patna',        coords: [85.14, 25.59] as [number, number] },
      { name: 'Cherrapunji',  coords: [91.73, 25.28] as [number, number] },
      { name: 'Jamshedpur',   coords: [86.20, 22.80] as [number, number] },
      { name: 'Binsar',       coords: [79.75, 29.72] as [number, number] },
    ],
  },
];

const domesticColorMap = new Map<string, string>();
domesticRegions.forEach(r => r.cities.forEach(c => domesticColorMap.set(c.name, r.color)));
const allDomestic = domesticRegions.flatMap(r => r.cities);

/* ─── Shared sub-components ─── */
function SectionHeader({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return (
    <div style={{ marginBottom: '36px' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
        <div style={{ height: '1px', width: '28px', background: 'rgba(173,201,5,0.4)' }} />
        <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: '#adc905', fontFamily: "'Inter',sans-serif" }}>{eyebrow}</span>
        <div style={{ height: '1px', width: '28px', background: 'rgba(173,201,5,0.4)' }} />
      </div>
      <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 'clamp(22px,3vw,32px)', color: '#fff', margin: '0 0 8px', lineHeight: 1.2 }}>{title}</h3>
      <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', fontFamily: "'Inter',sans-serif", margin: 0 }}>{subtitle}</p>
    </div>
  );
}

export default function Locations() {
  const [hoveredIntl, setHoveredIntl] = useState<string | null>(null);
  const [hoveredDom, setHoveredDom] = useState<string | null>(null);

  return (
    <section style={{ background: '#0a0c12', padding: '88px 24px' }}>
      <style>{`
        .loc-layout {
          display: grid;
          grid-template-columns: 55% 45%;
          gap: 0;
          align-items: start;
        }
        .loc-city-list {
          max-height: 520px;
          overflow-y: auto;
          padding: 0 8px 0 32px;
          scrollbar-width: thin;
          scrollbar-color: rgba(173,201,5,0.3) transparent;
        }
        .loc-city-list::-webkit-scrollbar { width: 4px; }
        .loc-city-list::-webkit-scrollbar-track { background: transparent; }
        .loc-city-list::-webkit-scrollbar-thumb { background: rgba(173,201,5,0.3); border-radius: 4px; }
        .loc-city-chip {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 4px 10px; border-radius: 999px;
          border: 1px solid transparent;
          font-size: 12px; font-family: 'Inter',sans-serif;
          color: rgba(255,255,255,0.55);
          cursor: default; transition: all 0.15s;
          margin: 3px; white-space: nowrap;
        }
        .loc-city-chip.active, .loc-city-chip:hover { color: #fff; background: rgba(255,255,255,0.06); }
        .loc-city-dot {
          width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0;
          transition: transform 0.15s;
        }
        .loc-city-chip.active .loc-city-dot,
        .loc-city-chip:hover .loc-city-dot { transform: scale(1.5); }
        .loc-region-label {
          font-size: 10px; font-weight: 700; letter-spacing: 2.5px;
          text-transform: uppercase; font-family: 'Inter',sans-serif;
          margin: 0 0 6px; padding-left: 4px;
        }
        .loc-region-block { margin-bottom: 20px; }
        .loc-divider {
          border: none;
          border-top: 1px solid rgba(255,255,255,0.07);
          margin: 72px 0;
        }
        @media(max-width: 860px) {
          .loc-layout { grid-template-columns: 1fr; }
          .loc-city-list { max-height: none; padding: 24px 0 0; }
        }
      `}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* ── Section title ── */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <div style={{ height: '1px', width: '32px', background: 'rgba(173,201,5,0.4)' }} />
            <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: '#adc905', fontFamily: "'Inter',sans-serif" }}>Where We've Delivered</span>
            <div style={{ height: '1px', width: '32px', background: 'rgba(173,201,5,0.4)' }} />
          </div>
          <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 'clamp(28px,4vw,44px)', color: '#fff', margin: '0 0 12px', lineHeight: 1.2 }}>
            Events Across the Globe
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.4)', fontFamily: "'Inter',sans-serif", margin: 0 }}>
            From the Himalayas to Europe — every dot is an event delivered.
          </p>
        </div>

        {/* ══ International ══ */}
        <SectionHeader
          eyebrow="International Destinations"
          title="✈️ Going Global"
          subtitle="16 countries across 4 continents — and counting."
        />

        <div className="loc-layout">
          {/* World map */}
          <div style={{ position: 'relative' }} onMouseLeave={() => setHoveredIntl(null)}>
            <ComposableMap
              projection="geoNaturalEarth1"
              projectionConfig={{ scale: 155 }}
              width={800} height={440}
              style={{ width: '100%', height: 'auto' }}
            >
              <Geographies geography={GEO_WORLD}>
                {({ geographies }) =>
                  geographies.map((geo: unknown) => (
                    <Geography
                      key={(geo as { rsmKey: string }).rsmKey}
                      geography={geo}
                      style={{
                        default: { fill: 'rgba(255,255,255,0.05)', stroke: 'rgba(255,255,255,0.1)', strokeWidth: 0.4, outline: 'none' },
                        hover:   { fill: 'rgba(173,201,5,0.1)',    stroke: 'rgba(173,201,5,0.2)',   strokeWidth: 0.4, outline: 'none' },
                        pressed: { outline: 'none' },
                      }}
                    />
                  ))
                }
              </Geographies>

              {allIntl.map(dest => {
                const isH = hoveredIntl === dest.name;
                const color = intlColorMap.get(dest.name) ?? '#adc905';
                return (
                  <Marker key={dest.name} coordinates={dest.coords}
                    onMouseEnter={() => setHoveredIntl(dest.name)}
                    onMouseLeave={() => setHoveredIntl(null)}
                  >
                    <circle r={isH ? 11 : 6}   fill={color} fillOpacity={isH ? 0.3 : 0.15} style={{ transition: 'r 0.15s' }} />
                    <circle r={isH ? 5.5 : 3.5} fill={color} stroke="rgba(255,255,255,0.5)" strokeWidth={0.8} style={{ cursor: 'pointer', transition: 'r 0.15s' }} />
                    {isH && (
                      <text textAnchor="middle" y={-14} style={{ fontFamily: 'Inter,sans-serif', fontSize: '10px', fontWeight: 700, fill: '#fff', pointerEvents: 'none' }}>
                        {dest.flag} {dest.name}
                      </text>
                    )}
                  </Marker>
                );
              })}
            </ComposableMap>
          </div>

          {/* International list */}
          <div className="loc-city-list">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '24px', paddingLeft: '4px' }}>
              {intlRegions.map(r => (
                <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: r.color, flexShrink: 0 }} />
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', fontFamily: "'Inter',sans-serif" }}>{r.label}</span>
                </div>
              ))}
            </div>

            {intlRegions.map(region => (
              <div key={region.label} className="loc-region-block">
                <div className="loc-region-label" style={{ color: region.color }}>{region.label}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {region.destinations.map(dest => (
                    <div
                      key={dest.name}
                      className={`loc-city-chip${hoveredIntl === dest.name ? ' active' : ''}`}
                      style={{
                        borderColor: hoveredIntl === dest.name ? `${region.color}40` : 'transparent',
                        background:  hoveredIntl === dest.name ? `${region.color}12` : undefined,
                        color:       hoveredIntl === dest.name ? '#fff' : undefined,
                        fontSize: '13px', padding: '6px 13px',
                      }}
                      onMouseEnter={() => setHoveredIntl(dest.name)}
                      onMouseLeave={() => setHoveredIntl(null)}
                    >
                      <div className="loc-city-dot" style={{ background: region.color, opacity: hoveredIntl === dest.name ? 1 : 0.6 }} />
                      <span style={{ marginRight: '3px' }}>{dest.flag}</span>
                      {dest.name}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div style={{ display: 'flex', gap: '24px', marginTop: '24px', paddingLeft: '4px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px' }}>
              {[{ num: '16+', label: 'Countries' }, { num: '4', label: 'Continents' }, { num: '20+', label: 'Years Delivering' }].map(s => (
                <div key={s.label} style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: '#adc905', fontFamily: "'Poppins',sans-serif", lineHeight: 1 }}>{s.num}</div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', fontFamily: "'Inter',sans-serif", marginTop: '4px' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <hr className="loc-divider" />

        {/* ══ Domestic ══ */}
        <SectionHeader
          eyebrow="Domestic Locations"
          title="🇮🇳 Across India"
          subtitle="85+ cities — from hill stations to coastal shores."
        />

        <div className="loc-layout">
          {/* India map */}
          <div style={{ position: 'relative' }} onMouseLeave={() => setHoveredDom(null)}>
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{ center: [82, 23], scale: 1050 }}
              width={700} height={680}
              style={{ width: '100%', height: 'auto' }}
            >
              <Geographies geography={GEO_INDIA}>
                {({ geographies }) =>
                  geographies.map((geo: unknown) => (
                    <Geography
                      key={(geo as { rsmKey: string }).rsmKey}
                      geography={geo}
                      style={{
                        default: { fill: 'rgba(255,255,255,0.04)', stroke: 'rgba(255,255,255,0.12)', strokeWidth: 0.5, outline: 'none' },
                        hover:   { fill: 'rgba(173,201,5,0.08)',   stroke: 'rgba(173,201,5,0.2)',    strokeWidth: 0.5, outline: 'none' },
                        pressed: { outline: 'none' },
                      }}
                    />
                  ))
                }
              </Geographies>

              {allDomestic.map(city => {
                const isH = hoveredDom === city.name;
                const color = domesticColorMap.get(city.name) ?? '#ff6a00';
                return (
                  <Marker key={city.name} coordinates={city.coords}
                    onMouseEnter={() => setHoveredDom(city.name)}
                    onMouseLeave={() => setHoveredDom(null)}
                  >
                    <circle r={isH ? 9 : 5}   fill={color} fillOpacity={isH ? 0.25 : 0.15} style={{ transition: 'r 0.15s' }} />
                    <circle r={isH ? 4.5 : 3} fill={color} stroke="rgba(255,255,255,0.4)" strokeWidth={0.5} style={{ cursor: 'pointer', transition: 'r 0.15s' }} />
                    {isH && (
                      <text textAnchor="middle" y={-10} style={{ fontFamily: 'Inter,sans-serif', fontSize: '9px', fontWeight: 700, fill: '#fff', pointerEvents: 'none' }}>
                        {city.name}
                      </text>
                    )}
                  </Marker>
                );
              })}
            </ComposableMap>
          </div>

          {/* Domestic list */}
          <div className="loc-city-list">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '24px', paddingLeft: '4px' }}>
              {domesticRegions.map(r => (
                <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: r.color, flexShrink: 0 }} />
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', fontFamily: "'Inter',sans-serif" }}>{r.label}</span>
                </div>
              ))}
            </div>

            {domesticRegions.map(region => (
              <div key={region.label} className="loc-region-block">
                <div className="loc-region-label" style={{ color: region.color }}>{region.label}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {region.cities.map(city => (
                    <div
                      key={city.name}
                      className={`loc-city-chip${hoveredDom === city.name ? ' active' : ''}`}
                      style={{
                        borderColor: hoveredDom === city.name ? `${region.color}40` : 'transparent',
                        background:  hoveredDom === city.name ? `${region.color}12` : undefined,
                        color:       hoveredDom === city.name ? '#fff' : undefined,
                      }}
                      onMouseEnter={() => setHoveredDom(city.name)}
                      onMouseLeave={() => setHoveredDom(null)}
                    >
                      <div className="loc-city-dot" style={{ background: region.color, opacity: hoveredDom === city.name ? 1 : 0.6 }} />
                      {city.name}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div style={{ display: 'flex', gap: '24px', marginTop: '24px', paddingLeft: '4px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px' }}>
              {[{ num: '85+', label: 'Domestic Cities' }, { num: '5', label: 'Regions' }, { num: '20+', label: 'Years Delivering' }].map(s => (
                <div key={s.label} style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: '#adc905', fontFamily: "'Poppins',sans-serif", lineHeight: 1 }}>{s.num}</div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', fontFamily: "'Inter',sans-serif", marginTop: '4px' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
