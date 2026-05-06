'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Service {
  id: string;
  type: string;
  icon: string;
  name: string;
  slug: string;
  description: string;
  coverImageUrl: string | null;
  isActive: boolean;
  displayOrder: number;
}

interface Props { services: Service[]; }

const inputSt: React.CSSProperties = {
  width: '100%', background: '#f9fafb', border: '1px solid #e5e7eb',
  borderRadius: '8px', padding: '10px 12px', fontSize: '13px',
  color: '#111', outline: 'none', boxSizing: 'border-box', fontFamily: "'Inter',sans-serif",
};
const labelSt: React.CSSProperties = {
  display: 'block', fontSize: '11px', fontWeight: 700, color: '#888',
  letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px',
};

export default function ServicesAdminClient({ services: initial }: Props) {
  const router = useRouter();
  const [services, setServices] = useState(initial);
  const [tab, setTab] = useState<'MAIN' | 'ACTIVITY'>('MAIN');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Add modal
  const [showAdd, setShowAdd] = useState(false);
  const [adding, setAdding] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', icon: '🎤', type: 'MAIN', description: '' });
  const [addError, setAddError] = useState('');
  const [addFile, setAddFile] = useState<File | null>(null);
  const [addPreview, setAddPreview] = useState<string | null>(null);
  const addFileRef = useRef<HTMLInputElement>(null);

  // Delete
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filtered = services.filter(s => s.type === tab);
  const mainCount = services.filter(s => s.type === 'MAIN').length;
  const actCount = services.filter(s => s.type === 'ACTIVITY').length;

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!addForm.name.trim()) { setAddError('Name is required'); return; }
    setAdding(true); setAddError('');
    const fd = new FormData();
    Object.entries(addForm).forEach(([k, v]) => fd.append(k, v));
    if (addFile) fd.append('file', addFile);
    const res = await fetch('/api/admin/services', { method: 'POST', body: fd });
    const data = await res.json();
    if (!res.ok) { setAddError(data.error || 'Failed'); setAdding(false); return; }
    setServices(s => [...s, data]);
    setShowAdd(false); setAddForm({ name: '', icon: '🎤', type: 'MAIN', description: '' });
    setAddFile(null); setAddPreview(null); setAdding(false);
  }

  async function toggleActive(id: string, current: boolean) {
    setActionLoading(id + '_act');
    const res = await fetch(`/api/admin/services/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !current }),
    });
    if (res.ok) { const u = await res.json(); setServices(s => s.map(x => x.id === id ? { ...x, isActive: u.isActive } : x)); }
    setActionLoading(null);
  }

  async function moveOrder(id: string, dir: 'up' | 'down') {
    const list = services.filter(s => s.type === tab);
    const idx = list.findIndex(s => s.id === id);
    if (dir === 'up' && idx === 0) return;
    if (dir === 'down' && idx === list.length - 1) return;
    const swap = dir === 'up' ? idx - 1 : idx + 1;
    const next = [...list];
    [next[idx], next[swap]] = [next[swap], next[idx]];
    setServices(s => [...s.filter(x => x.type !== tab), ...next]);
    setActionLoading(id + '_order');
    await Promise.all([
      fetch(`/api/admin/services/${next[idx].id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ displayOrder: idx + 1 }) }),
      fetch(`/api/admin/services/${next[swap].id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ displayOrder: swap + 1 }) }),
    ]);
    setActionLoading(null);
  }

  async function handleDelete(id: string) {
    setActionLoading(id + '_del');
    const res = await fetch(`/api/admin/services/${id}`, { method: 'DELETE' });
    if (res.ok) setServices(s => s.filter(x => x.id !== id));
    setActionLoading(null); setDeleteConfirm(null);
  }

  const CloseBtn = ({ onClick }: { onClick: () => void }) => (
    <button onClick={onClick} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', padding: '4px' }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
    </button>
  );

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#111', margin: 0 }}>Services</h1>
          <p style={{ fontSize: '13px', color: '#888', margin: '4px 0 0', fontFamily: "'Inter',sans-serif" }}>{mainCount} main services · {actCount} activities</p>
        </div>
        <button onClick={() => setShowAdd(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', background: '#1a1f2e', color: '#fff', border: 'none', borderRadius: '9px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: "'Inter',sans-serif" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Add Service
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
        {(['MAIN', 'ACTIVITY'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: '8px 20px', borderRadius: '8px', border: '1px solid', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: "'Inter',sans-serif", background: tab === t ? '#1a1f2e' : '#fff', color: tab === t ? '#fff' : '#555', borderColor: tab === t ? '#1a1f2e' : '#e5e7eb' }}>
            {t === 'MAIN' ? 'Main Services' : 'Activities'}
          </button>
        ))}
      </div>

      {/* Add Modal */}
      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '480px', boxShadow: '0 20px 60px rgba(0,0,0,0.25)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#111', margin: 0 }}>Add Service</h2>
              <CloseBtn onClick={() => { setShowAdd(false); setAddError(''); }} />
            </div>
            <form onSubmit={handleAdd}>
              <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={labelSt}>Icon</label>
                  <input value={addForm.icon} onChange={e => setAddForm(f => ({ ...f, icon: e.target.value }))} style={{ ...inputSt, fontSize: '22px', textAlign: 'center', padding: '8px' }} maxLength={4} />
                </div>
                <div>
                  <label style={labelSt}>Name *</label>
                  <input value={addForm.name} onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))} placeholder="Service name" style={inputSt} />
                </div>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={labelSt}>Type</label>
                <select value={addForm.type} onChange={e => setAddForm(f => ({ ...f, type: e.target.value }))} style={inputSt}>
                  <option value="MAIN">Main Service</option>
                  <option value="ACTIVITY">Activity</option>
                </select>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={labelSt}>Short Description</label>
                <textarea value={addForm.description} onChange={e => setAddForm(f => ({ ...f, description: e.target.value }))} placeholder="Shown on homepage card" rows={2} style={{ ...inputSt, resize: 'vertical' }} />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={labelSt}>Cover Image <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: '#bbb' }}>(optional)</span></label>
                <div onClick={() => addFileRef.current?.click()} style={{ border: '2px dashed #e5e7eb', borderRadius: '8px', padding: '16px', textAlign: 'center', cursor: 'pointer', background: '#f9fafb', minHeight: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {addPreview ? <img src={addPreview} alt="" style={{ maxHeight: '60px', borderRadius: '6px' }} /> : <span style={{ fontSize: '12px', color: '#aaa', fontFamily: "'Inter',sans-serif" }}>Click to upload</span>}
                  <input ref={addFileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) { setAddFile(f); setAddPreview(URL.createObjectURL(f)); } }} />
                </div>
              </div>
              {addError && <div style={{ background: '#fff1f1', border: '1px solid #fca5a5', borderRadius: '8px', padding: '10px', fontSize: '13px', color: '#dc2626', marginBottom: '12px', fontFamily: "'Inter',sans-serif" }}>{addError}</div>}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => { setShowAdd(false); setAddError(''); }} style={{ flex: 1, padding: '11px', background: '#f5f5f5', border: '1px solid #e5e7eb', borderRadius: '8px', color: '#555', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter',sans-serif" }}>Cancel</button>
                <button type="submit" disabled={adding} style={{ flex: 1, padding: '11px', background: '#1a1f2e', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: adding ? 'not-allowed' : 'pointer', fontFamily: "'Inter',sans-serif", opacity: adding ? 0.7 : 1 }}>
                  {adding ? 'Adding…' : 'Add Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '360px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#111', marginBottom: '8px' }}>Delete Service?</h3>
            <p style={{ fontSize: '13px', color: '#888', marginBottom: '24px', fontFamily: "'Inter',sans-serif" }}>This will remove all content for this service.</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setDeleteConfirm(null)} style={{ flex: 1, padding: '11px', background: '#f5f5f5', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter',sans-serif" }}>Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} disabled={!!actionLoading} style={{ flex: 1, padding: '11px', background: '#dc2626', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: "'Inter',sans-serif" }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filtered.map((svc, idx) => (
          <div key={svc.id} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', display: 'flex', overflow: 'hidden', opacity: svc.isActive ? 1 : 0.55, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            {/* Cover / Icon */}
            <div style={{ width: '100px', flexShrink: 0, background: '#1a1f2e', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '90px', position: 'relative' }}>
              {svc.coverImageUrl
                ? <img src={svc.coverImageUrl} alt={svc.name} style={{ width: '100%', height: '90px', objectFit: 'cover', display: 'block' }} />
                : <span style={{ fontSize: '32px' }}>{svc.icon}</span>
              }
              <div style={{ position: 'absolute', bottom: '4px', right: '4px', width: '20px', height: '20px', background: 'rgba(0,0,0,0.5)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '10px', fontWeight: 800, color: '#adc905', fontFamily: "'Inter',sans-serif" }}>{idx + 1}</span>
              </div>
            </div>

            {/* Info */}
            <div style={{ flex: 1, padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#111', fontFamily: "'Inter',sans-serif", marginBottom: '3px' }}>{svc.name}</div>
                <div style={{ fontSize: '12px', color: '#888', fontFamily: "'Inter',sans-serif" }}>{svc.description.slice(0, 80)}{svc.description.length > 80 ? '…' : ''}</div>
                <div style={{ fontSize: '11px', color: '#bbb', marginTop: '4px', fontFamily: "'Inter',sans-serif" }}>/services/{svc.slug}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <button onClick={() => router.push(`/admin/services/${svc.id}`)} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 14px', fontSize: '12px', fontWeight: 700, borderRadius: '7px', border: '1px solid #e5e7eb', cursor: 'pointer', background: '#f0f4ff', color: '#2563eb', fontFamily: "'Inter',sans-serif" }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                  Edit Content
                </button>
                <button onClick={() => toggleActive(svc.id, svc.isActive)} disabled={actionLoading === svc.id + '_act'} style={{ padding: '6px 12px', fontSize: '12px', fontWeight: 700, borderRadius: '7px', border: '1px solid', cursor: 'pointer', fontFamily: "'Inter',sans-serif", background: svc.isActive ? '#f0fdf4' : '#f9fafb', color: svc.isActive ? '#16a34a' : '#888', borderColor: svc.isActive ? '#bbf7d0' : '#e5e7eb' }}>
                  {svc.isActive ? '● Active' : '○ Hidden'}
                </button>
                <button onClick={() => moveOrder(svc.id, 'up')} disabled={idx === 0} style={{ padding: '6px 9px', background: '#f5f5f5', border: '1px solid #e5e7eb', borderRadius: '7px', cursor: idx === 0 ? 'not-allowed' : 'pointer', opacity: idx === 0 ? 0.4 : 1 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2.5"><polyline points="18 15 12 9 6 15" /></svg>
                </button>
                <button onClick={() => moveOrder(svc.id, 'down')} disabled={idx === filtered.length - 1} style={{ padding: '6px 9px', background: '#f5f5f5', border: '1px solid #e5e7eb', borderRadius: '7px', cursor: idx === filtered.length - 1 ? 'not-allowed' : 'pointer', opacity: idx === filtered.length - 1 ? 0.4 : 1 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
                </button>
                <a href={`/services/${svc.slug}`} target="_blank" style={{ padding: '6px 9px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '7px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                </a>
                <button onClick={() => setDeleteConfirm(svc.id)} style={{ padding: '6px 9px', background: '#fff1f1', border: '1px solid #fca5a5', borderRadius: '7px', cursor: 'pointer' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /></svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
