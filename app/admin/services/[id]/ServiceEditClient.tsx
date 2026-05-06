'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

interface SigEvent { icon: string; title: string; desc: string; }
interface Differentiator { title: string; desc: string; }
interface FAQ { question: string; answer: string; }

interface Service {
  id: string; type: string; icon: string; name: string; slug: string;
  description: string; heroHeadline: string | null; heroSubtitle: string | null;
  whatWeDo: string | null; signatureEvents: string | null;
  differentiators: string | null; faqs: string | null;
  coverImageUrl: string | null; isActive: boolean;
}

const inputSt: React.CSSProperties = {
  width: '100%', background: '#f9fafb', border: '1px solid #e5e7eb',
  borderRadius: '8px', padding: '10px 12px', fontSize: '13px',
  color: '#111', outline: 'none', boxSizing: 'border-box', fontFamily: "'Inter',sans-serif",
};
const labelSt: React.CSSProperties = {
  display: 'block', fontSize: '11px', fontWeight: 700, color: '#888',
  letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px',
};
const sectionCard: React.CSSProperties = {
  background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', marginBottom: '16px',
};

function parseJSON<T>(s: string | null, fallback: T): T {
  if (!s) return fallback;
  try { return JSON.parse(s) as T; } catch { return fallback; }
}

export default function ServiceEditClient({ service }: { service: Service }) {
  const router = useRouter();
  const coverRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(service.name);
  const [icon, setIcon] = useState(service.icon);
  const [description, setDescription] = useState(service.description);
  const [type, setType] = useState(service.type);
  const [isActive, setIsActive] = useState(service.isActive);
  const [heroHeadline, setHeroHeadline] = useState(service.heroHeadline || '');
  const [heroSubtitle, setHeroSubtitle] = useState(service.heroSubtitle || '');
  const [whatWeDo, setWhatWeDo] = useState(service.whatWeDo || '');
  const [coverPreview, setCoverPreview] = useState<string | null>(service.coverImageUrl);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const [sigEvents, setSigEvents] = useState<SigEvent[]>(
    parseJSON(service.signatureEvents, [{ icon: '🎯', title: '', desc: '' }])
  );
  const [differentiators, setDifferentiators] = useState<Differentiator[]>(
    parseJSON(service.differentiators, [{ title: '', desc: '' }])
  );
  const [faqs, setFaqs] = useState<FAQ[]>(
    parseJSON(service.faqs, [{ question: '', answer: '' }])
  );

  async function handleSave() {
    setSaving(true); setError(''); setSaved(false);
    const fd = new FormData();
    fd.append('name', name);
    fd.append('icon', icon);
    fd.append('description', description);
    fd.append('type', type);
    fd.append('isActive', String(isActive));
    fd.append('heroHeadline', heroHeadline);
    fd.append('heroSubtitle', heroSubtitle);
    fd.append('whatWeDo', whatWeDo);
    fd.append('signatureEvents', JSON.stringify(sigEvents));
    fd.append('differentiators', JSON.stringify(differentiators));
    fd.append('faqs', JSON.stringify(faqs));
    if (coverFile) fd.append('file', coverFile);

    const res = await fetch(`/api/admin/services/${service.id}`, { method: 'PATCH', body: fd });
    const data = await res.json();
    if (!res.ok) { setError(data.error || 'Save failed'); setSaving(false); return; }
    setSaved(true); setSaving(false);
    setTimeout(() => setSaved(false), 3000);
  }

  // Repeater helpers
  function updateSig(i: number, field: keyof SigEvent, val: string) {
    setSigEvents(s => s.map((x, j) => j === i ? { ...x, [field]: val } : x));
  }
  function updateDiff(i: number, field: keyof Differentiator, val: string) {
    setDifferentiators(s => s.map((x, j) => j === i ? { ...x, [field]: val } : x));
  }
  function updateFaq(i: number, field: keyof FAQ, val: string) {
    setFaqs(s => s.map((x, j) => j === i ? { ...x, [field]: val } : x));
  }

  const addBtn = (onClick: () => void) => (
    <button type="button" onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '10px', padding: '7px 14px', background: '#f0f4ff', border: '1px dashed #93c5fd', borderRadius: '7px', fontSize: '12px', fontWeight: 700, color: '#2563eb', cursor: 'pointer', fontFamily: "'Inter',sans-serif" }}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg> Add Row
    </button>
  );

  const removeBtn = (onClick: () => void) => (
    <button type="button" onClick={onClick} style={{ padding: '4px 8px', background: '#fff1f1', border: '1px solid #fca5a5', borderRadius: '6px', cursor: 'pointer', flexShrink: 0 }}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
    </button>
  );

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => router.push('/admin/services')} style={{ background: 'none', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '8px 14px', fontSize: '13px', fontWeight: 600, color: '#555', cursor: 'pointer', fontFamily: "'Inter',sans-serif" }}>← Back</button>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#111', margin: 0 }}>{service.icon} {service.name}</h1>
            <div style={{ fontSize: '12px', color: '#aaa', fontFamily: "'Inter',sans-serif", marginTop: '2px' }}>/services/{service.slug}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <a href={`/services/${service.slug}`} target="_blank" style={{ padding: '9px 16px', background: '#f5f5f5', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: '#555', textDecoration: 'none', fontFamily: "'Inter',sans-serif" }}>View Page ↗</a>
          <button onClick={handleSave} disabled={saving} style={{ padding: '9px 22px', background: saved ? '#16a34a' : '#1a1f2e', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 700, color: '#fff', cursor: saving ? 'not-allowed' : 'pointer', fontFamily: "'Inter',sans-serif", opacity: saving ? 0.7 : 1 }}>
            {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save Changes'}
          </button>
        </div>
      </div>

      {error && <div style={{ background: '#fff1f1', border: '1px solid #fca5a5', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#dc2626', marginBottom: '16px', fontFamily: "'Inter',sans-serif" }}>{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '20px', alignItems: 'start' }}>

        {/* ── Left: Content ── */}
        <div>
          {/* Hero */}
          <div style={sectionCard}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#adc905', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '14px', fontFamily: "'Inter',sans-serif" }}>Hero Section</div>
            <div style={{ marginBottom: '12px' }}>
              <label style={labelSt}>Hero Headline</label>
              <input value={heroHeadline} onChange={e => setHeroHeadline(e.target.value)} placeholder="Corporate Events, Delivered With Finesse" style={{ ...inputSt, fontSize: '15px', fontWeight: 600 }} />
            </div>
            <div>
              <label style={labelSt}>Hero Subtitle</label>
              <textarea value={heroSubtitle} onChange={e => setHeroSubtitle(e.target.value)} placeholder="Short intro paragraph shown below the headline…" rows={3} style={{ ...inputSt, resize: 'vertical' }} />
            </div>
          </div>

          {/* What We Do */}
          <div style={sectionCard}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#adc905', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '14px', fontFamily: "'Inter',sans-serif" }}>What We Do</div>
            <textarea value={whatWeDo} onChange={e => setWhatWeDo(e.target.value)} placeholder="Describe what your team does for this service…" rows={4} style={{ ...inputSt, resize: 'vertical' }} />
          </div>

          {/* Signature Events */}
          <div style={sectionCard}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#adc905', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '14px', fontFamily: "'Inter',sans-serif" }}>Signature Events / Sub-Services</div>
            {sigEvents.map((s, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '48px 1fr 2fr auto', gap: '8px', marginBottom: '10px', alignItems: 'start' }}>
                <input value={s.icon} onChange={e => updateSig(i, 'icon', e.target.value)} style={{ ...inputSt, textAlign: 'center', fontSize: '18px', padding: '8px 4px' }} maxLength={4} />
                <input value={s.title} onChange={e => updateSig(i, 'title', e.target.value)} placeholder="Title" style={inputSt} />
                <input value={s.desc} onChange={e => updateSig(i, 'desc', e.target.value)} placeholder="Short description" style={inputSt} />
                {sigEvents.length > 1 && removeBtn(() => setSigEvents(s => s.filter((_, j) => j !== i)))}
              </div>
            ))}
            {addBtn(() => setSigEvents(s => [...s, { icon: '🎯', title: '', desc: '' }]))}
          </div>

          {/* Differentiators */}
          <div style={sectionCard}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#adc905', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '14px', fontFamily: "'Inter',sans-serif" }}>Why Choose Us</div>
            {differentiators.map((d, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: '8px', marginBottom: '10px', alignItems: 'start' }}>
                <input value={d.title} onChange={e => updateDiff(i, 'title', e.target.value)} placeholder="Title" style={inputSt} />
                <input value={d.desc} onChange={e => updateDiff(i, 'desc', e.target.value)} placeholder="Description" style={inputSt} />
                {differentiators.length > 1 && removeBtn(() => setDifferentiators(s => s.filter((_, j) => j !== i)))}
              </div>
            ))}
            {addBtn(() => setDifferentiators(s => [...s, { title: '', desc: '' }]))}
          </div>

          {/* FAQs */}
          <div style={sectionCard}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#adc905', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '14px', fontFamily: "'Inter',sans-serif" }}>FAQs</div>
            {faqs.map((f, i) => (
              <div key={i} style={{ marginBottom: '14px', padding: '14px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #f0f0f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label style={{ ...labelSt, marginBottom: 0 }}>Q{i + 1}</label>
                  {faqs.length > 1 && removeBtn(() => setFaqs(s => s.filter((_, j) => j !== i)))}
                </div>
                <input value={f.question} onChange={e => updateFaq(i, 'question', e.target.value)} placeholder="Question" style={{ ...inputSt, marginBottom: '8px' }} />
                <textarea value={f.answer} onChange={e => updateFaq(i, 'answer', e.target.value)} placeholder="Answer" rows={2} style={{ ...inputSt, resize: 'vertical' }} />
              </div>
            ))}
            {addBtn(() => setFaqs(s => [...s, { question: '', answer: '' }]))}
          </div>
        </div>

        {/* ── Right Sidebar ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Cover image */}
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '16px' }}>
            <label style={labelSt}>Cover Image</label>
            <div onClick={() => coverRef.current?.click()} style={{ border: '2px dashed #e5e7eb', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', minHeight: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb' }}>
              {coverPreview
                ? <img src={coverPreview} alt="" style={{ width: '100%', maxHeight: '160px', objectFit: 'cover', display: 'block' }} />
                : <div style={{ fontSize: '12px', color: '#aaa', fontFamily: "'Inter',sans-serif", textAlign: 'center', padding: '16px' }}>Click to upload</div>
              }
              <input ref={coverRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) { setCoverFile(f); setCoverPreview(URL.createObjectURL(f)); } }} />
            </div>
            {coverPreview && <button type="button" onClick={() => { setCoverFile(null); setCoverPreview(null); }} style={{ marginTop: '6px', fontSize: '11px', color: '#888', background: 'none', border: 'none', cursor: 'pointer' }}>Remove</button>}
          </div>

          {/* Basic info */}
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={labelSt}>Basic Info</label>
            <div style={{ display: 'grid', gridTemplateColumns: '52px 1fr', gap: '8px' }}>
              <div>
                <label style={{ ...labelSt, marginBottom: '4px' }}>Icon</label>
                <input value={icon} onChange={e => setIcon(e.target.value)} style={{ ...inputSt, textAlign: 'center', fontSize: '20px', padding: '8px 4px' }} maxLength={4} />
              </div>
              <div>
                <label style={{ ...labelSt, marginBottom: '4px' }}>Name</label>
                <input value={name} onChange={e => setName(e.target.value)} style={inputSt} />
              </div>
            </div>
            <div>
              <label style={{ ...labelSt, marginBottom: '4px' }}>Type</label>
              <select value={type} onChange={e => setType(e.target.value)} style={inputSt}>
                <option value="MAIN">Main Service</option>
                <option value="ACTIVITY">Activity</option>
              </select>
            </div>
            <div>
              <label style={{ ...labelSt, marginBottom: '4px' }}>Homepage Card Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} style={{ ...inputSt, resize: 'vertical' }} />
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#555', cursor: 'pointer', fontFamily: "'Inter',sans-serif" }}>
              <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} style={{ width: '15px', height: '15px' }} />
              Active (visible on site)
            </label>
          </div>

          {/* Slug */}
          <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '14px' }}>
            <label style={labelSt}>URL Slug</label>
            <div style={{ fontSize: '12px', color: '#555', fontFamily: "'Inter',sans-serif", wordBreak: 'break-all' }}>/services/<strong>{service.slug}</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
}
