'use client';

import { useRef, useState } from 'react';

interface HeroSlide {
  id: string;
  type: 'IMAGE' | 'VIDEO';
  mediaUrl: string;
  storagePath: string;
  title: string | null;
  subtitle: string | null;
  ctaText: string | null;
  ctaLink: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
}

interface Props { slides: HeroSlide[]; }

const card: React.CSSProperties = {
  background: '#fff', border: '1px solid #e5e7eb',
  borderRadius: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
};

const inputSt: React.CSSProperties = {
  width: '100%', background: '#f9fafb', border: '1px solid #e5e7eb',
  borderRadius: '8px', padding: '10px 12px', fontSize: '13px',
  color: '#111', outline: 'none', boxSizing: 'border-box', fontFamily: "'Inter',sans-serif",
};

const labelSt: React.CSSProperties = {
  display: 'block', fontSize: '11px', fontWeight: 700, color: '#888',
  letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px',
};

const emptyForm = { titleWhite: '', titleAccent: '', subtitle: '', ctaText: '', ctaLink: '' };

export default function HeroAdminClient({ slides: initial }: Props) {
  const [slides, setSlides] = useState(initial);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Upload state
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [uploadIsVideo, setUploadIsVideo] = useState(false);
  const [uploadMeta, setUploadMeta] = useState(emptyForm);
  const [uploadError, setUploadError] = useState('');
  const uploadFileRef = useRef<HTMLInputElement>(null);

  // Edit state
  const [editSlide, setEditSlide] = useState<HeroSlide | null>(null);
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editPreview, setEditPreview] = useState<string | null>(null);
  const [editIsVideo, setEditIsVideo] = useState(false);
  const [editMeta, setEditMeta] = useState(emptyForm);
  const [editing, setEditing] = useState(false);
  const [editError, setEditError] = useState('');
  const editFileRef = useRef<HTMLInputElement>(null);

  // Delete state
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // ── Upload ──
  function onUploadFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const isVid = f.type.startsWith('video/');
    setUploadFile(f);
    setUploadIsVideo(isVid);
    setUploadPreview(URL.createObjectURL(f));
  }

  function resetUpload() {
    setShowUpload(false); setUploadError('');
    setUploadFile(null); setUploadPreview(null); setUploadIsVideo(false);
    setUploadMeta(emptyForm);
    if (uploadFileRef.current) uploadFileRef.current.value = '';
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!uploadFile) { setUploadError('Please select an image or video file'); return; }
    setUploading(true); setUploadError('');
    const fd = new FormData();
    fd.append('file', uploadFile);
    fd.append('title', [uploadMeta.titleWhite, uploadMeta.titleAccent].filter(Boolean).join('|'));
    fd.append('subtitle', uploadMeta.subtitle);
    fd.append('ctaText', uploadMeta.ctaText);
    fd.append('ctaLink', uploadMeta.ctaLink);
    const res = await fetch('/api/admin/hero', { method: 'POST', body: fd });
    const data = await res.json();
    if (!res.ok) { setUploadError(data.error || 'Upload failed'); setUploading(false); return; }
    setSlides(s => [...s, data]);
    resetUpload();
    setUploading(false);
  }

  // ── Edit ──
  function openEdit(slide: HeroSlide) {
    setEditSlide(slide);
    const parts = slide.title ? slide.title.split('|') : [];
    setEditMeta({ titleWhite: parts[0] || '', titleAccent: parts[1] || '', subtitle: slide.subtitle || '', ctaText: slide.ctaText || '', ctaLink: slide.ctaLink || '' });
    setEditFile(null); setEditPreview(null); setEditIsVideo(slide.type === 'VIDEO'); setEditError('');
    if (editFileRef.current) editFileRef.current.value = '';
  }

  function onEditFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setEditFile(f);
    setEditIsVideo(f.type.startsWith('video/'));
    setEditPreview(URL.createObjectURL(f));
  }

  function resetEdit() {
    setEditSlide(null); setEditFile(null); setEditPreview(null);
    setEditMeta(emptyForm); setEditError('');
    if (editFileRef.current) editFileRef.current.value = '';
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editSlide) return;
    setEditing(true); setEditError('');
    const fd = new FormData();
    fd.append('title', [editMeta.titleWhite, editMeta.titleAccent].filter(Boolean).join('|'));
    fd.append('subtitle', editMeta.subtitle);
    fd.append('ctaText', editMeta.ctaText);
    fd.append('ctaLink', editMeta.ctaLink);
    if (editFile) fd.append('file', editFile);
    const res = await fetch(`/api/admin/hero/${editSlide.id}`, { method: 'PATCH', body: fd });
    const data = await res.json();
    if (!res.ok) { setEditError(data.error || 'Update failed'); setEditing(false); return; }
    setSlides(s => s.map(x => x.id === editSlide.id ? data : x));
    resetEdit();
    setEditing(false);
  }

  // ── Toggle active ──
  async function toggleActive(id: string, current: boolean) {
    setActionLoading(id + '_act');
    const res = await fetch(`/api/admin/hero/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !current }),
    });
    if (res.ok) { const u = await res.json(); setSlides(s => s.map(x => x.id === id ? u : x)); }
    setActionLoading(null);
  }

  // ── Reorder ──
  async function moveOrder(id: string, dir: 'up' | 'down') {
    const idx = slides.findIndex(s => s.id === id);
    if (dir === 'up' && idx === 0) return;
    if (dir === 'down' && idx === slides.length - 1) return;
    const swap = dir === 'up' ? idx - 1 : idx + 1;
    const next = [...slides];
    [next[idx], next[swap]] = [next[swap], next[idx]];
    setSlides(next);
    setActionLoading(id + '_order');
    await Promise.all([
      fetch(`/api/admin/hero/${next[idx].id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ displayOrder: idx + 1 }) }),
      fetch(`/api/admin/hero/${next[swap].id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ displayOrder: swap + 1 }) }),
    ]);
    setActionLoading(null);
  }

  // ── Delete ──
  async function deleteSlide(id: string) {
    setActionLoading(id + '_del');
    const res = await fetch(`/api/admin/hero/${id}`, { method: 'DELETE' });
    if (res.ok) setSlides(s => s.filter(x => x.id !== id));
    setActionLoading(null);
    setDeleteConfirm(null);
  }

  // ── Shared file drop zone ──
  function DropZone({ preview, isVideo, fileRef, onChange, onRemove, current }: {
    preview: string | null; isVideo: boolean;
    fileRef: React.RefObject<HTMLInputElement | null>;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemove: () => void;
    current?: { url: string; type: 'IMAGE' | 'VIDEO' } | null;
  }) {
    return (
      <div>
        <div onClick={() => fileRef.current?.click()} style={{ border: '2px dashed #e5e7eb', borderRadius: '12px', padding: '20px', textAlign: 'center', cursor: 'pointer', background: '#f9fafb', minHeight: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {preview ? (
            isVideo
              ? <video src={preview} style={{ maxHeight: '80px', maxWidth: '100%', borderRadius: '6px' }} muted />
              : <img src={preview} alt="preview" style={{ maxHeight: '80px', maxWidth: '100%', objectFit: 'cover', borderRadius: '6px' }} />
          ) : current ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              {current.type === 'VIDEO'
                ? <video src={current.url} style={{ maxHeight: '70px', maxWidth: '100%', borderRadius: '6px' }} muted />
                : <img src={current.url} alt="current" style={{ maxHeight: '70px', maxWidth: '100%', objectFit: 'cover', borderRadius: '6px' }} />}
              <span style={{ fontSize: '11px', color: '#aaa', fontFamily: "'Inter',sans-serif" }}>Current — click to replace</span>
            </div>
          ) : (
            <div>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 8px', display: 'block' }}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <div style={{ fontSize: '13px', color: '#888', fontFamily: "'Inter',sans-serif" }}>Click to upload image or video</div>
              <div style={{ fontSize: '11px', color: '#bbb', fontFamily: "'Inter',sans-serif", marginTop: '4px' }}>JPG, PNG, WEBP · MP4, WEBM · Max 50MB</div>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*,video/*" onChange={onChange} style={{ display: 'none' }} />
        </div>
        {preview && (
          <button type="button" onClick={onRemove} style={{ marginTop: '6px', fontSize: '12px', color: '#888', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Inter',sans-serif" }}>Remove</button>
        )}
      </div>
    );
  }

  function MetaFields({ value, onChange }: { value: typeof emptyForm; onChange: (k: string, v: string) => void }) {
    return (
      <>
        <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '14px', marginBottom: '12px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#555', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px', fontFamily: "'Inter',sans-serif" }}>Hero Heading</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelSt}>White Text <span style={{ fontWeight: 400, letterSpacing: 0, textTransform: 'none', color: '#bbb' }}>(optional)</span></label>
              <input type="text" placeholder="Creating Unforgettable" value={value.titleWhite} onChange={e => onChange('titleWhite', e.target.value)} style={inputSt} />
            </div>
            <div>
              <label style={{ ...labelSt, color: '#adc905' }}>Accent Text <span style={{ fontWeight: 400, letterSpacing: 0, textTransform: 'none', color: '#bbb' }}>(optional, green)</span></label>
              <input type="text" placeholder="Event Experiences" value={value.titleAccent} onChange={e => onChange('titleAccent', e.target.value)} style={inputSt} />
            </div>
          </div>
          <div style={{ marginTop: '8px', fontSize: '11px', color: '#aaa', fontFamily: "'Inter',sans-serif" }}>Each word appears on its own line. Leave blank to use the defaults.</div>
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label style={labelSt}>Subtitle <span style={{ fontWeight: 400, letterSpacing: 0, textTransform: 'none', color: '#bbb' }}>(optional)</span></label>
          <input type="text" placeholder="Chennai's premier corporate event management company" value={value.subtitle} onChange={e => onChange('subtitle', e.target.value)} style={inputSt} />
          <div style={{ marginTop: '4px', fontSize: '11px', color: '#aaa', fontFamily: "'Inter',sans-serif" }}>Short description line shown below the heading with an orange accent bar</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
          <div>
            <label style={labelSt}>CTA Button Text <span style={{ fontWeight: 400, letterSpacing: 0, textTransform: 'none', color: '#bbb' }}>(optional)</span></label>
            <input type="text" placeholder="Plan Your Event" value={value.ctaText} onChange={e => onChange('ctaText', e.target.value)} style={inputSt} />
          </div>
          <div>
            <label style={labelSt}>CTA Button Link <span style={{ fontWeight: 400, letterSpacing: 0, textTransform: 'none', color: '#bbb' }}>(optional)</span></label>
            <input type="text" placeholder="/get-quote" value={value.ctaLink} onChange={e => onChange('ctaLink', e.target.value)} style={inputSt} />
          </div>
        </div>
      </>
    );
  }

  const CloseBtn = ({ onClick }: { onClick: () => void }) => (
    <button onClick={onClick} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', padding: '4px' }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  );

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#111', margin: 0 }}>Hero Slides</h1>
          <p style={{ fontSize: '13px', color: '#888', margin: '4px 0 0' }}>{slides.length} slide{slides.length !== 1 ? 's' : ''} · images & videos in homepage hero</p>
        </div>
        <button onClick={() => setShowUpload(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', background: '#1a1f2e', color: '#fff', border: 'none', borderRadius: '9px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: "'Inter',sans-serif" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          Add Slide
        </button>
      </div>

      {/* ── Upload Modal ── */}
      {showUpload && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '560px', boxShadow: '0 20px 60px rgba(0,0,0,0.25)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#111', margin: 0 }}>Add Hero Slide</h2>
              <CloseBtn onClick={resetUpload} />
            </div>
            <form onSubmit={handleUpload}>
              <div style={{ marginBottom: '16px' }}>
                <label style={labelSt}>Image or Video File *</label>
                <DropZone preview={uploadPreview} isVideo={uploadIsVideo} fileRef={uploadFileRef} onChange={onUploadFile}
                  onRemove={() => { setUploadPreview(null); setUploadFile(null); setUploadIsVideo(false); if (uploadFileRef.current) uploadFileRef.current.value = ''; }} current={null} />
                {uploadIsVideo && uploadPreview && (
                  <div style={{ marginTop: '8px', padding: '8px 12px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', fontSize: '12px', color: '#92400e', fontFamily: "'Inter',sans-serif" }}>
                    Video detected — keep under 20MB for best performance. Will autoplay muted & loop.
                  </div>
                )}
              </div>
              <MetaFields value={uploadMeta} onChange={(k, v) => setUploadMeta(p => ({ ...p, [k]: v }))} />
              {uploadError && <div style={{ background: '#fff1f1', border: '1px solid #fca5a5', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#dc2626', marginBottom: '16px', fontFamily: "'Inter',sans-serif" }}>{uploadError}</div>}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={resetUpload} style={{ flex: 1, padding: '11px', background: '#f5f5f5', border: '1px solid #e5e7eb', borderRadius: '8px', color: '#555', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter',sans-serif" }}>Cancel</button>
                <button type="submit" disabled={uploading} style={{ flex: 1, padding: '11px', background: '#1a1f2e', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: uploading ? 'not-allowed' : 'pointer', fontFamily: "'Inter',sans-serif", opacity: uploading ? 0.7 : 1 }}>
                  {uploading ? 'Uploading…' : 'Add Slide'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Edit Modal ── */}
      {editSlide && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '560px', boxShadow: '0 20px 60px rgba(0,0,0,0.25)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#111', margin: 0 }}>Edit Slide</h2>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '4px', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '999px', background: editSlide.type === 'VIDEO' ? '#fef3c7' : '#eff6ff', color: editSlide.type === 'VIDEO' ? '#92400e' : '#1d4ed8' }}>
                  {editSlide.type === 'VIDEO' ? '▶ VIDEO' : '🖼 IMAGE'}
                </span>
              </div>
              <CloseBtn onClick={resetEdit} />
            </div>
            <form onSubmit={handleEdit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={labelSt}>Replace Media <span style={{ fontWeight: 400, letterSpacing: 0, textTransform: 'none', color: '#bbb' }}>(optional)</span></label>
                <DropZone preview={editPreview} isVideo={editIsVideo} fileRef={editFileRef} onChange={onEditFile}
                  onRemove={() => { setEditPreview(null); setEditFile(null); if (editFileRef.current) editFileRef.current.value = ''; }}
                  current={{ url: editSlide.mediaUrl, type: editSlide.type }} />
              </div>
              <MetaFields value={editMeta} onChange={(k, v) => setEditMeta(p => ({ ...p, [k]: v }))} />
              {editError && <div style={{ background: '#fff1f1', border: '1px solid #fca5a5', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#dc2626', marginBottom: '16px', fontFamily: "'Inter',sans-serif" }}>{editError}</div>}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={resetEdit} style={{ flex: 1, padding: '11px', background: '#f5f5f5', border: '1px solid #e5e7eb', borderRadius: '8px', color: '#555', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter',sans-serif" }}>Cancel</button>
                <button type="submit" disabled={editing} style={{ flex: 1, padding: '11px', background: '#1a1f2e', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: editing ? 'not-allowed' : 'pointer', fontFamily: "'Inter',sans-serif", opacity: editing ? 0.7 : 1 }}>
                  {editing ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ── */}
      {deleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '360px', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ width: '52px', height: '52px', background: '#fff1f1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              </svg>
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#111', marginBottom: '8px' }}>Delete Slide?</h3>
            <p style={{ fontSize: '13px', color: '#888', marginBottom: '24px', fontFamily: "'Inter',sans-serif" }}>The media file will be permanently removed from storage.</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setDeleteConfirm(null)} style={{ flex: 1, padding: '11px', background: '#f5f5f5', border: '1px solid #e5e7eb', borderRadius: '8px', color: '#555', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter',sans-serif" }}>Cancel</button>
              <button onClick={() => deleteSlide(deleteConfirm)} disabled={!!actionLoading} style={{ flex: 1, padding: '11px', background: '#dc2626', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: "'Inter',sans-serif" }}>
                {actionLoading ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Empty state ── */}
      {slides.length === 0 && (
        <div style={{ ...card, padding: '60px 24px', textAlign: 'center' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 16px', display: 'block' }}>
            <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" />
          </svg>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#999', fontFamily: "'Inter',sans-serif" }}>No slides yet</div>
          <div style={{ fontSize: '13px', color: '#bbb', fontFamily: "'Inter',sans-serif", marginTop: '6px' }}>Click "Add Slide" to upload your first image or video</div>
        </div>
      )}

      {/* ── Slides list ── */}
      {slides.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {slides.map((slide, idx) => (
            <div key={slide.id} style={{ ...card, display: 'flex', gap: '0', overflow: 'hidden', opacity: slide.isActive ? 1 : 0.55 }}>
              {/* Thumbnail */}
              <div style={{ width: '200px', flexShrink: 0, background: '#111', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '120px' }}>
                {slide.type === 'VIDEO' ? (
                  <>
                    <video src={slide.mediaUrl} style={{ width: '100%', height: '120px', objectFit: 'cover', display: 'block' }} muted />
                    <div style={{ position: 'absolute', top: '8px', left: '8px', background: 'rgba(0,0,0,0.6)', borderRadius: '5px', padding: '3px 8px', fontSize: '10px', fontWeight: 700, color: '#fbbf24', letterSpacing: '1px', fontFamily: "'Inter',sans-serif" }}>▶ VIDEO</div>
                  </>
                ) : (
                  <img src={slide.mediaUrl} alt={slide.title || `Slide ${idx + 1}`} style={{ width: '100%', height: '120px', objectFit: 'cover', display: 'block' }} />
                )}
                <div style={{ position: 'absolute', bottom: '6px', right: '6px', width: '22px', height: '22px', background: '#1a1f2e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#adc905', fontFamily: "'Inter',sans-serif" }}>{idx + 1}</span>
                </div>
              </div>

              {/* Info */}
              <div style={{ flex: 1, padding: '16px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#111', fontFamily: "'Inter',sans-serif", marginBottom: '4px' }}>
                    {slide.title ? (
                      <>
                        <span style={{ color: '#111' }}>{slide.title.split('|')[0]}</span>
                        {slide.title.includes('|') && <span style={{ color: '#adc905' }}> / {slide.title.split('|')[1]}</span>}
                      </>
                    ) : (
                      <span style={{ color: '#bbb', fontWeight: 400 }}>Using defaults</span>
                    )}
                  </div>
                  {slide.subtitle && <div style={{ fontSize: '12px', color: '#888', fontFamily: "'Inter',sans-serif", marginBottom: '6px' }}>{slide.subtitle}</div>}
                  {slide.ctaText && (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#ff6a00', fontWeight: 700, fontFamily: "'Inter',sans-serif" }}>
                      CTA: "{slide.ctaText}" → {slide.ctaLink || '—'}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                  <button onClick={() => openEdit(slide)} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', fontSize: '12px', fontWeight: 700, borderRadius: '7px', border: '1px solid #e5e7eb', cursor: 'pointer', fontFamily: "'Inter',sans-serif", background: '#f0f4ff', color: '#2563eb' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                    Edit
                  </button>
                  <button onClick={() => toggleActive(slide.id, slide.isActive)} disabled={actionLoading === slide.id + '_act'} style={{ padding: '6px 12px', fontSize: '12px', fontWeight: 700, borderRadius: '7px', border: '1px solid', cursor: 'pointer', fontFamily: "'Inter',sans-serif", background: slide.isActive ? '#f0fdf4' : '#f9fafb', color: slide.isActive ? '#16a34a' : '#888', borderColor: slide.isActive ? '#bbf7d0' : '#e5e7eb' }}>
                    {slide.isActive ? '● Active' : '○ Hidden'}
                  </button>
                  <button onClick={() => moveOrder(slide.id, 'up')} disabled={idx === 0} title="Move up" style={{ padding: '6px 10px', background: '#f5f5f5', border: '1px solid #e5e7eb', borderRadius: '7px', cursor: idx === 0 ? 'not-allowed' : 'pointer', opacity: idx === 0 ? 0.4 : 1 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15" /></svg>
                  </button>
                  <button onClick={() => moveOrder(slide.id, 'down')} disabled={idx === slides.length - 1} title="Move down" style={{ padding: '6px 10px', background: '#f5f5f5', border: '1px solid #e5e7eb', borderRadius: '7px', cursor: idx === slides.length - 1 ? 'not-allowed' : 'pointer', opacity: idx === slides.length - 1 ? 0.4 : 1 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                  </button>
                  <button onClick={() => setDeleteConfirm(slide.id)} style={{ marginLeft: 'auto', padding: '6px 10px', background: '#fff1f1', border: '1px solid #fca5a5', borderRadius: '7px', cursor: 'pointer' }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    </svg>
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
