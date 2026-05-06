'use client';

import { useState } from 'react';

interface SeoRecord {
  id: string;
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string | null;
}
interface PageRecord extends SeoRecord { pageKey: string; pageLabel: string; }
interface ServiceRecord extends SeoRecord { name: string; slug: string; icon: string; }
interface PortfolioRecord extends SeoRecord { title: string; slug: string; category: string; }
interface Props {
  pages: PageRecord[];
  services: ServiceRecord[];
  portfolio: PortfolioRecord[];
}

type TabKey = 'pages' | 'services' | 'portfolio';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'pages', label: 'Static Pages' },
  { key: 'services', label: 'Services' },
  { key: 'portfolio', label: 'Portfolio' },
];

const inp: React.CSSProperties = {
  width: '100%', padding: '9px 12px', borderRadius: '8px',
  border: '1px solid #e5e7eb', fontSize: '13px',
  fontFamily: "'Inter', sans-serif", color: '#111',
  background: '#fafafa', boxSizing: 'border-box',
};
const lbl: React.CSSProperties = {
  display: 'block', fontSize: '11px', fontWeight: 700,
  color: '#888', letterSpacing: '1px', textTransform: 'uppercase',
  marginBottom: '5px', fontFamily: "'Inter', sans-serif",
};

function SeoEditor({
  id, type, label, url,
  initTitle, initDesc, initKw,
  onSaved,
}: {
  id: string; type: string; label: string; url: string;
  initTitle: string | null; initDesc: string | null; initKw: string | null;
  onSaved: (id: string, title: string, desc: string, kw: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(initTitle || '');
  const [desc, setDesc] = useState(initDesc || '');
  const [kw, setKw] = useState(initKw || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const titleLen = title.length;
  const descLen = desc.length;

  async function save() {
    setSaving(true);
    const res = await fetch('/api/admin/seo', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, id, metaTitle: title, metaDescription: desc, metaKeywords: kw }),
    });
    if (res.ok) {
      onSaved(id, title, desc, kw);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
    setSaving(false);
  }

  const hasSeo = !!(initTitle || initDesc);

  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden', background: '#fff' }}>
      {/* Row header */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: '14px',
          padding: '14px 20px', cursor: 'pointer',
          background: open ? '#fafafa' : '#fff',
          borderBottom: open ? '1px solid #f3f4f6' : 'none',
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#111', fontFamily: "'Inter', sans-serif" }}>
            {label}
          </div>
          <div style={{ fontSize: '12px', color: '#aaa', marginTop: '2px', fontFamily: 'monospace' }}>
            {url}
          </div>
        </div>

        {/* SEO status badge */}
        <span style={{
          padding: '3px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 700,
          fontFamily: "'Inter', sans-serif",
          background: hasSeo ? '#f0fdf4' : '#fff7ed',
          color: hasSeo ? '#16a34a' : '#d97706',
        }}>
          {hasSeo ? '✓ SEO Set' : '⚠ Missing'}
        </span>

        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="#aaa" strokeWidth="2"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>

      {/* Editor panel */}
      {open && (
        <div style={{ padding: '20px 20px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Meta Title */}
          <div>
            <label style={lbl}>
              Meta Title
              <span style={{ marginLeft: '8px', fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: titleLen > 60 ? '#dc2626' : '#aaa' }}>
                {titleLen}/60 chars
              </span>
            </label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Page title for search engines…"
              style={{ ...inp, borderColor: titleLen > 60 ? '#fca5a5' : '#e5e7eb' }}
            />
            {titleLen > 60 && (
              <div style={{ fontSize: '11px', color: '#dc2626', marginTop: '4px' }}>
                Over 60 characters — Google may truncate this in search results.
              </div>
            )}
          </div>

          {/* Meta Description */}
          <div>
            <label style={lbl}>
              Meta Description
              <span style={{ marginLeft: '8px', fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: descLen > 160 ? '#dc2626' : descLen > 0 && descLen < 120 ? '#d97706' : '#aaa' }}>
                {descLen}/160 chars
              </span>
            </label>
            <textarea
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder="Brief description of this page for search results…"
              rows={3}
              style={{ ...inp, resize: 'vertical', borderColor: descLen > 160 ? '#fca5a5' : '#e5e7eb' }}
            />
            {descLen > 160 && (
              <div style={{ fontSize: '11px', color: '#dc2626', marginTop: '4px' }}>
                Over 160 characters — Google may truncate the snippet.
              </div>
            )}
            {descLen > 0 && descLen < 120 && (
              <div style={{ fontSize: '11px', color: '#d97706', marginTop: '4px' }}>
                Aim for 120–160 characters for best results.
              </div>
            )}
          </div>

          {/* Keywords */}
          <div>
            <label style={lbl}>Keywords</label>
            <input
              value={kw}
              onChange={e => setKw(e.target.value)}
              placeholder="comma separated, e.g. event management chennai, corporate events"
              style={inp}
            />
            <div style={{ fontSize: '11px', color: '#bbb', marginTop: '4px' }}>
              Comma-separated. Modern search engines weight content more than keywords, but it helps for tracking.
            </div>
          </div>

          {/* SERP Preview */}
          {(title || desc) && (
            <div style={{
              background: '#f8f9fa', border: '1px solid #e5e7eb',
              borderRadius: '10px', padding: '14px 16px',
            }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#888', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>
                Google Preview
              </div>
              <div style={{ fontSize: '18px', color: '#1a0dab', fontFamily: 'Arial, sans-serif', lineHeight: 1.3, marginBottom: '4px', wordBreak: 'break-word' }}>
                {title || '(no title)'}
              </div>
              <div style={{ fontSize: '13px', color: '#006621', fontFamily: 'Arial, sans-serif', marginBottom: '4px' }}>
                heliosevent.in › {url.replace(/^\//, '')}
              </div>
              <div style={{ fontSize: '13px', color: '#545454', fontFamily: 'Arial, sans-serif', lineHeight: 1.5, wordBreak: 'break-word' }}>
                {desc || '(no description)'}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={save}
              disabled={saving}
              style={{
                padding: '9px 24px', background: '#adc905', color: '#0d1117',
                border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 700,
                cursor: 'pointer', fontFamily: "'Inter', sans-serif",
              }}
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
            {saved && (
              <span style={{ fontSize: '13px', color: '#16a34a', fontWeight: 600 }}>✓ Saved</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SeoAdminClient({ pages, services, portfolio }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>('pages');

  // Local state mirrors for badges to update after save
  const [pageData, setPageData] = useState(pages);
  const [serviceData, setServiceData] = useState(services);
  const [portfolioData, setPortfolioData] = useState(portfolio);

  function updateRecord<T extends SeoRecord>(
    setter: React.Dispatch<React.SetStateAction<T[]>>,
    id: string, title: string, desc: string, kw: string
  ) {
    setter(prev => prev.map(r => r.id === id
      ? { ...r, metaTitle: title || null, metaDescription: desc || null, metaKeywords: kw || null }
      : r
    ));
  }

  const seoCount = (arr: SeoRecord[]) => arr.filter(r => r.metaTitle || r.metaDescription).length;
  const totalCount = (arr: SeoRecord[]) => arr.length;

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#111', margin: '0 0 4px' }}>SEO Management</h1>
        <p style={{ fontSize: '13px', color: '#888', margin: 0 }}>
          Manage meta titles, descriptions and keywords for all pages
        </p>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '28px' }}>
        {[
          { label: 'Static Pages', done: seoCount(pageData), total: totalCount(pageData) },
          { label: 'Services', done: seoCount(serviceData), total: totalCount(serviceData) },
          { label: 'Portfolio', done: seoCount(portfolioData), total: totalCount(portfolioData) },
        ].map(s => {
          const pct = s.total ? Math.round((s.done / s.total) * 100) : 0;
          return (
            <div key={s.label} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '16px 18px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>{s.label}</div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: pct === 100 ? '#16a34a' : pct > 50 ? '#d97706' : '#dc2626' }}>
                {s.done}/{s.total}
              </div>
              <div style={{ marginTop: '8px', height: '4px', background: '#f3f4f6', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: pct === 100 ? '#22c55e' : pct > 50 ? '#f59e0b' : '#ef4444', borderRadius: '2px', transition: 'width 0.3s' }} />
              </div>
              <div style={{ fontSize: '11px', color: '#aaa', marginTop: '4px' }}>{pct}% complete</div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '4px', marginBottom: '20px', width: 'fit-content', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '8px 20px', borderRadius: '7px', border: 'none', cursor: 'pointer',
              fontSize: '13px', fontWeight: 600, fontFamily: "'Inter', sans-serif",
              background: activeTab === tab.key ? '#f0f7d4' : 'transparent',
              color: activeTab === tab.key ? '#7a9200' : '#888',
              transition: 'all 0.15s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {activeTab === 'pages' && pageData.map(p => (
          <SeoEditor key={p.id} id={p.id} type="pages"
            label={p.pageLabel} url={`/${p.pageKey === 'home' ? '' : p.pageKey}`}
            initTitle={p.metaTitle} initDesc={p.metaDescription} initKw={p.metaKeywords}
            onSaved={(id, t, d, k) => updateRecord(setPageData, id, t, d, k)}
          />
        ))}

        {activeTab === 'services' && serviceData.map(s => (
          <SeoEditor key={s.id} id={s.id} type="services"
            label={`${s.icon} ${s.name}`} url={`/services/${s.slug}`}
            initTitle={s.metaTitle} initDesc={s.metaDescription} initKw={s.metaKeywords}
            onSaved={(id, t, d, k) => updateRecord(setServiceData, id, t, d, k)}
          />
        ))}

        {activeTab === 'portfolio' && portfolioData.map(p => (
          <SeoEditor key={p.id} id={p.id} type="portfolio"
            label={p.title} url={`/portfolio/${p.slug}`}
            initTitle={p.metaTitle} initDesc={p.metaDescription} initKw={p.metaKeywords}
            onSaved={(id, t, d, k) => updateRecord(setPortfolioData, id, t, d, k)}
          />
        ))}

      </div>
    </div>
  );
}
