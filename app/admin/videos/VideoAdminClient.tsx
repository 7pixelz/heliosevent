'use client';

import { useState } from 'react';

interface Video {
  id: string;
  youtubeId: string;
  title: string;
  serviceSlug: string | null;
  serviceSlugs: string | null;
  showOnHome: boolean;
  displayOrder: number;
  isActive: boolean;
}

interface Service {
  id: string;
  name: string;
  slug: string;
}

interface Props {
  videos: Video[];
  services: Service[];
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

export default function VideoAdminClient({ videos: initial, services }: Props) {
  const [videos, setVideos] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [editVideo, setEditVideo] = useState<Video | null>(null);

  // Add form state
  const [addInput, setAddInput] = useState('');
  const [addTitle, setAddTitle] = useState('');
  const [addSlugs, setAddSlugs] = useState<string[]>([]);
  const [addOnHome, setAddOnHome] = useState(true);
  const [addOrder, setAddOrder] = useState(0);
  const [addError, setAddError] = useState('');

  // Edit form state
  const [editInput, setEditInput] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editSlugs, setEditSlugs] = useState<string[]>([]);
  const [editOnHome, setEditOnHome] = useState(true);
  const [editOrder, setEditOrder] = useState(0);
  const [editActive, setEditActive] = useState(true);
  const [editError, setEditError] = useState('');

  function parseSlugs(v: Video): string[] {
    try { return JSON.parse(v.serviceSlugs || '[]'); } catch { return v.serviceSlug ? [v.serviceSlug] : []; }
  }

  function toggleSlug(slug: string, current: string[], set: (v: string[]) => void) {
    set(current.includes(slug) ? current.filter(s => s !== slug) : [...current, slug]);
  }

  async function refresh() {
    const res = await fetch('/api/admin/videos');
    if (res.ok) setVideos(await res.json());
  }

  async function handleAdd() {
    if (!addInput.trim() || !addTitle.trim()) { setAddError('YouTube URL/ID and title are required'); return; }
    setLoading(true); setAddError('');
    const res = await fetch('/api/admin/videos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ youtubeInput: addInput, title: addTitle, serviceSlugs: JSON.stringify(addSlugs), showOnHome: addOnHome, displayOrder: addOrder }),
    });
    if (res.ok) {
      await refresh();
      setShowAdd(false); setAddInput(''); setAddTitle(''); setAddSlugs([]); setAddOnHome(true); setAddOrder(0);
    } else {
      setAddError('Failed to add video');
    }
    setLoading(false);
  }

  function openEdit(v: Video) {
    setEditVideo(v);
    setEditInput(v.youtubeId);
    setEditTitle(v.title);
    setEditSlugs(parseSlugs(v));
    setEditOnHome(v.showOnHome);
    setEditOrder(v.displayOrder);
    setEditActive(v.isActive);
    setEditError('');
  }

  async function handleEdit() {
    if (!editVideo) return;
    if (!editInput.trim() || !editTitle.trim()) { setEditError('YouTube ID and title are required'); return; }
    setLoading(true); setEditError('');
    const res = await fetch(`/api/admin/videos/${editVideo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ youtubeId: editInput.trim(), title: editTitle, serviceSlugs: JSON.stringify(editSlugs), showOnHome: editOnHome, displayOrder: editOrder, isActive: editActive }),
    });
    if (res.ok) {
      await refresh();
      setEditVideo(null);
    } else {
      setEditError('Failed to update video');
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this video?')) return;
    setActionLoading(id);
    await fetch(`/api/admin/videos/${id}`, { method: 'DELETE' });
    await refresh();
    setActionLoading(null);
  }

  async function toggleActive(v: Video) {
    setActionLoading(v.id);
    await fetch(`/api/admin/videos/${v.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !v.isActive }),
    });
    await refresh();
    setActionLoading(null);
  }

  const btnPrimary: React.CSSProperties = {
    background: '#adc905', color: '#000', border: 'none', borderRadius: '8px',
    padding: '10px 20px', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
    fontFamily: "'Inter',sans-serif",
  };
  const btnGhost: React.CSSProperties = {
    background: 'transparent', color: '#555', border: '1px solid #e5e7eb', borderRadius: '8px',
    padding: '10px 20px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
    fontFamily: "'Inter',sans-serif",
  };

  function FormFields({ input, setInput, title, setTitle, slugs, setSlugs, onHome, setOnHome, order, setOrder, active, setActive, showActive, error }: {
    input: string; setInput: (v: string) => void;
    title: string; setTitle: (v: string) => void;
    slugs: string[]; setSlugs: (v: string[]) => void;
    onHome: boolean; setOnHome: (v: boolean) => void;
    order: number; setOrder: (v: number) => void;
    active?: boolean; setActive?: (v: boolean) => void;
    showActive?: boolean; error: string;
  }) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div>
          <label style={labelSt}>YouTube URL or Video ID *</label>
          <input style={inputSt} placeholder="https://youtu.be/xxxxx or video ID" value={input} onChange={e => setInput(e.target.value)} />
          <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>Paste a full YouTube URL or just the 11-character video ID</div>
        </div>
        <div>
          <label style={labelSt}>Title *</label>
          <input style={inputSt} placeholder="Video title" value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        <div>
          <label style={labelSt}>Service Categories (select multiple)</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto', padding: '10px 12px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            {services.map(s => (
              <label key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', cursor: 'pointer', fontFamily: "'Inter',sans-serif" }}>
                <input
                  type="checkbox"
                  checked={slugs.includes(s.slug)}
                  onChange={() => toggleSlug(s.slug, slugs, setSlugs)}
                  style={{ width: '15px', height: '15px', accentColor: '#adc905' }}
                />
                {s.name}
              </label>
            ))}
          </div>
          {slugs.length > 0 && <div style={{ fontSize: '11px', color: '#adc905', marginTop: '4px', fontWeight: 600 }}>{slugs.length} categor{slugs.length === 1 ? 'y' : 'ies'} selected</div>}
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer', fontFamily: "'Inter',sans-serif" }}>
            <input type="checkbox" checked={onHome} onChange={e => setOnHome(e.target.checked)} />
            Show on Homepage
          </label>
          {showActive && setActive && (
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer', fontFamily: "'Inter',sans-serif" }}>
              <input type="checkbox" checked={active} onChange={e => setActive(e.target.checked)} />
              Active
            </label>
          )}
        </div>
        <div>
          <label style={labelSt}>Display Order</label>
          <input type="number" style={inputSt} value={order} onChange={e => setOrder(Number(e.target.value))} />
        </div>
        {error && <div style={{ color: '#e53e3e', fontSize: '13px' }}>{error}</div>}
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: '#111' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 700 }}>YouTube Videos</h1>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#888' }}>{videos.length} video{videos.length !== 1 ? 's' : ''}</p>
        </div>
        <button style={btnPrimary} onClick={() => { setShowAdd(true); setAddError(''); }}>+ Add Video</button>
      </div>

      {/* Add modal */}
      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', width: '100%', maxWidth: '520px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <h2 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: 700 }}>Add Video</h2>
            <FormFields
              input={addInput} setInput={setAddInput}
              title={addTitle} setTitle={setAddTitle}
              slugs={addSlugs} setSlugs={setAddSlugs}
              onHome={addOnHome} setOnHome={setAddOnHome}
              order={addOrder} setOrder={setAddOrder}
              error={addError}
            />
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button style={btnGhost} onClick={() => setShowAdd(false)}>Cancel</button>
              <button style={btnPrimary} onClick={handleAdd} disabled={loading}>{loading ? 'Saving…' : 'Add Video'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editVideo && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', width: '100%', maxWidth: '520px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <h2 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: 700 }}>Edit Video</h2>
            <FormFields
              input={editInput} setInput={setEditInput}
              title={editTitle} setTitle={setEditTitle}
              slugs={editSlugs} setSlugs={setEditSlugs}
              onHome={editOnHome} setOnHome={setEditOnHome}
              order={editOrder} setOrder={setEditOrder}
              active={editActive} setActive={setEditActive}
              showActive error={editError}
            />
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button style={btnGhost} onClick={() => setEditVideo(null)}>Cancel</button>
              <button style={btnPrimary} onClick={handleEdit} disabled={loading}>{loading ? 'Saving…' : 'Save Changes'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Video list */}
      {videos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#888', background: '#f9fafb', borderRadius: '14px', border: '1px dashed #e5e7eb' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>▶</div>
          <div style={{ fontSize: '15px', fontWeight: 600 }}>No videos yet</div>
          <div style={{ fontSize: '13px', marginTop: '4px' }}>Click "Add Video" to add your first YouTube video</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {videos.map(v => (
            <div key={v.id} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', opacity: v.isActive ? 1 : 0.55 }}>
              <div style={{ position: 'relative' }}>
                <img
                  src={`https://img.youtube.com/vi/${v.youtubeId}/mqdefault.jpg`}
                  alt={v.title}
                  style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block' }}
                />
                {!v.isActive && (
                  <div style={{ position: 'absolute', top: '8px', right: '8px', background: '#e53e3e', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                    Inactive
                  </div>
                )}
                <a
                  href={`https://www.youtube.com/watch?v=${v.youtubeId}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <div style={{ width: '44px', height: '44px', background: 'rgba(0,0,0,0.6)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                  </div>
                </a>
              </div>
              <div style={{ padding: '14px' }}>
                <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '6px', lineHeight: 1.4 }}>{v.title}</div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                  {v.showOnHome && <span style={{ fontSize: '11px', background: '#f0f4d0', color: '#5a6e00', padding: '2px 8px', borderRadius: '20px', fontWeight: 600 }}>Homepage</span>}
                  {parseSlugs(v).map(slug => <span key={slug} style={{ fontSize: '11px', background: '#e8edf2', color: '#555', padding: '2px 8px', borderRadius: '20px', fontWeight: 600 }}>{services.find(s => s.slug === slug)?.name ?? slug}</span>)}
                  <span style={{ fontSize: '11px', background: '#f3f4f6', color: '#888', padding: '2px 8px', borderRadius: '20px' }}>Order: {v.displayOrder}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    style={{ flex: 1, padding: '8px', background: '#f3f4f6', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter',sans-serif", color: '#333' }}
                    onClick={() => openEdit(v)}
                  >
                    Edit
                  </button>
                  <button
                    style={{ flex: 1, padding: '8px', background: v.isActive ? '#fff7ed' : '#f0f4d0', border: `1px solid ${v.isActive ? '#fed7aa' : '#d0e08a'}`, borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter',sans-serif", color: v.isActive ? '#c05621' : '#5a6e00' }}
                    onClick={() => toggleActive(v)}
                    disabled={actionLoading === v.id}
                  >
                    {v.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    style={{ padding: '8px 12px', background: '#fff5f5', border: '1px solid #fed7d7', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', color: '#e53e3e' }}
                    onClick={() => handleDelete(v.id)}
                    disabled={actionLoading === v.id}
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
