'use client';

import { useRef, useState } from 'react';

interface Logo {
  id: string;
  name: string;
  imageUrl: string;
  displayOrder: number;
  isVisible: boolean;
  createdAt: string;
}

interface Props { logos: Logo[]; }

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

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export default function ClientsAdminClient({ logos: initial }: Props) {
  const [logos, setLogos] = useState(initial);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Upload state
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadName, setUploadName] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState('');
  const uploadFileRef = useRef<HTMLInputElement>(null);

  // Edit state
  const [editLogo, setEditLogo] = useState<Logo | null>(null);
  const [editName, setEditName] = useState('');
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editPreview, setEditPreview] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [editError, setEditError] = useState('');
  const editFileRef = useRef<HTMLInputElement>(null);

  // Delete state
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // ── Upload handlers ──
  function onUploadFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploadFile(f);
    setUploadName(prev => prev || f.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '));
    setUploadPreview(URL.createObjectURL(f));
  }

  function resetUpload() {
    setShowUpload(false); setUploadError('');
    setUploadFile(null); setUploadName(''); setUploadPreview(null);
    if (uploadFileRef.current) uploadFileRef.current.value = '';
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!uploadFile || !uploadName.trim()) { setUploadError('Name and file are required'); return; }
    setUploading(true); setUploadError('');
    const fd = new FormData();
    fd.append('file', uploadFile);
    fd.append('name', uploadName.trim());
    const res = await fetch('/api/admin/clients', { method: 'POST', body: fd });
    const data = await res.json();
    if (!res.ok) { setUploadError(data.error || 'Upload failed'); setUploading(false); return; }
    setLogos(l => [...l, data]);
    resetUpload();
    setUploading(false);
  }

  // ── Edit handlers ──
  function openEdit(logo: Logo) {
    setEditLogo(logo);
    setEditName(logo.name);
    setEditFile(null);
    setEditPreview(null);
    setEditError('');
    if (editFileRef.current) editFileRef.current.value = '';
  }

  function onEditFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setEditFile(f);
    setEditPreview(URL.createObjectURL(f));
  }

  function resetEdit() {
    setEditLogo(null); setEditName(''); setEditFile(null);
    setEditPreview(null); setEditError('');
    if (editFileRef.current) editFileRef.current.value = '';
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editLogo || !editName.trim()) { setEditError('Brand name is required'); return; }
    setEditing(true); setEditError('');

    let res: Response;
    if (editFile) {
      // FormData for image replacement
      const fd = new FormData();
      fd.append('name', editName.trim());
      fd.append('file', editFile);
      res = await fetch(`/api/admin/clients/${editLogo.id}`, { method: 'PATCH', body: fd });
    } else {
      // JSON for name-only update
      res = await fetch(`/api/admin/clients/${editLogo.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName.trim() }),
      });
    }

    const data = await res.json();
    if (!res.ok) { setEditError(data.error || 'Update failed'); setEditing(false); return; }
    setLogos(l => l.map(x => x.id === editLogo.id ? data : x));
    resetEdit();
    setEditing(false);
  }

  // ── Visibility toggle ──
  async function toggleVisibility(id: string, current: boolean) {
    setActionLoading(id + '_vis');
    const res = await fetch(`/api/admin/clients/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isVisible: !current }),
    });
    if (res.ok) {
      const updated = await res.json();
      setLogos(l => l.map(x => x.id === id ? updated : x));
    }
    setActionLoading(null);
  }

  // ── Reorder ──
  async function moveOrder(id: string, dir: 'up' | 'down') {
    const idx = logos.findIndex(l => l.id === id);
    if (dir === 'up' && idx === 0) return;
    if (dir === 'down' && idx === logos.length - 1) return;
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
    const newLogos = [...logos];
    [newLogos[idx], newLogos[swapIdx]] = [newLogos[swapIdx], newLogos[idx]];
    setLogos(newLogos);
    setActionLoading(id + '_order');
    await Promise.all([
      fetch(`/api/admin/clients/${newLogos[idx].id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ displayOrder: idx + 1 }) }),
      fetch(`/api/admin/clients/${newLogos[swapIdx].id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ displayOrder: swapIdx + 1 }) }),
    ]);
    setActionLoading(null);
  }

  // ── Delete ──
  async function deleteLogo(id: string) {
    setActionLoading(id + '_del');
    const res = await fetch(`/api/admin/clients/${id}`, { method: 'DELETE' });
    if (res.ok) setLogos(l => l.filter(x => x.id !== id));
    setActionLoading(null);
    setDeleteConfirm(null);
  }

  // ── File drop zone (reusable) ──
  function FileDropZone({ preview, fileRef, onChange, onRemove }: {
    preview: string | null;
    fileRef: React.RefObject<HTMLInputElement | null>;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemove: () => void;
  }) {
    return (
      <div>
        <div onClick={() => fileRef.current?.click()} style={{ border: '2px dashed #e5e7eb', borderRadius: '12px', padding: '24px 20px', textAlign: 'center', cursor: 'pointer', background: '#f9fafb' }}>
          {preview ? (
            <img src={preview} alt="preview" style={{ maxHeight: '72px', maxWidth: '150px', objectFit: 'contain', margin: '0 auto', display: 'block' }} />
          ) : (
            <>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 8px', display: 'block' }}>
                <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
              </svg>
              <div style={{ fontSize: '13px', color: '#888', fontFamily: "'Inter',sans-serif" }}>Click to choose image</div>
              <div style={{ fontSize: '11px', color: '#bbb', fontFamily: "'Inter',sans-serif", marginTop: '3px' }}>PNG, JPG, WEBP, SVG · Max 5MB</div>
            </>
          )}
          <input ref={fileRef} type="file" accept="image/*" onChange={onChange} style={{ display: 'none' }} />
        </div>
        {preview && (
          <button type="button" onClick={onRemove} style={{ marginTop: '6px', fontSize: '12px', color: '#888', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Inter',sans-serif" }}>
            Remove image
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#111', margin: 0 }}>Client Logos</h1>
          <p style={{ fontSize: '13px', color: '#888', margin: '4px 0 0' }}>{logos.length} logo{logos.length !== 1 ? 's' : ''} · shown on homepage</p>
        </div>
        <button onClick={() => setShowUpload(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', background: '#1a1f2e', color: '#fff', border: 'none', borderRadius: '9px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: "'Inter',sans-serif" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          Upload Logo
        </button>
      </div>

      {/* ── Upload Modal ── */}
      {showUpload && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '460px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#111', margin: 0 }}>Upload Client Logo</h2>
              <button onClick={resetUpload} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', padding: '4px' }}><CloseIcon /></button>
            </div>
            <form onSubmit={handleUpload}>
              <div style={{ marginBottom: '14px' }}>
                <label style={labelSt}>Brand Name</label>
                <input type="text" required placeholder="e.g. Adani Group" value={uploadName} onChange={e => setUploadName(e.target.value)} style={inputSt} />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={labelSt}>Logo File</label>
                <FileDropZone
                  preview={uploadPreview}
                  fileRef={uploadFileRef}
                  onChange={onUploadFileChange}
                  onRemove={() => { setUploadPreview(null); setUploadFile(null); if (uploadFileRef.current) uploadFileRef.current.value = ''; }}
                />
              </div>
              {uploadError && <div style={{ background: '#fff1f1', border: '1px solid #fca5a5', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#dc2626', marginBottom: '16px', fontFamily: "'Inter',sans-serif" }}>{uploadError}</div>}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={resetUpload} style={{ flex: 1, padding: '11px', background: '#f5f5f5', border: '1px solid #e5e7eb', borderRadius: '8px', color: '#555', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter',sans-serif" }}>Cancel</button>
                <button type="submit" disabled={uploading} style={{ flex: 1, padding: '11px', background: '#1a1f2e', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: uploading ? 'not-allowed' : 'pointer', fontFamily: "'Inter',sans-serif", opacity: uploading ? 0.7 : 1 }}>
                  {uploading ? 'Uploading…' : 'Upload Logo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Edit Modal ── */}
      {editLogo && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '460px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#111', margin: 0 }}>Edit Logo</h2>
              <button onClick={resetEdit} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', padding: '4px' }}><CloseIcon /></button>
            </div>
            <form onSubmit={handleEdit}>
              <div style={{ marginBottom: '14px' }}>
                <label style={labelSt}>Brand Name</label>
                <input type="text" required value={editName} onChange={e => setEditName(e.target.value)} style={inputSt} />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={labelSt}>Replace Image <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: '#bbb' }}>(optional — leave blank to keep current)</span></label>
                {/* Current image preview */}
                {!editPreview && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '10px', marginBottom: '10px' }}>
                    <img src={editLogo.imageUrl} alt={editLogo.name} style={{ maxHeight: '48px', maxWidth: '100px', objectFit: 'contain' }} />
                    <span style={{ fontSize: '12px', color: '#888', fontFamily: "'Inter',sans-serif" }}>Current image</span>
                  </div>
                )}
                <FileDropZone
                  preview={editPreview}
                  fileRef={editFileRef}
                  onChange={onEditFileChange}
                  onRemove={() => { setEditPreview(null); setEditFile(null); if (editFileRef.current) editFileRef.current.value = ''; }}
                />
              </div>
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
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#111', marginBottom: '8px' }}>Delete Logo?</h3>
            <p style={{ fontSize: '13px', color: '#888', marginBottom: '24px', fontFamily: "'Inter',sans-serif" }}>This removes the logo from storage and the homepage.</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setDeleteConfirm(null)} style={{ flex: 1, padding: '11px', background: '#f5f5f5', border: '1px solid #e5e7eb', borderRadius: '8px', color: '#555', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter',sans-serif" }}>Cancel</button>
              <button onClick={() => deleteLogo(deleteConfirm)} disabled={!!actionLoading} style={{ flex: 1, padding: '11px', background: '#dc2626', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: "'Inter',sans-serif" }}>
                {actionLoading ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Empty state ── */}
      {logos.length === 0 && (
        <div style={{ ...card, padding: '60px 24px', textAlign: 'center' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 16px', display: 'block' }}>
            <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
          </svg>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#999', fontFamily: "'Inter',sans-serif" }}>No logos uploaded yet</div>
          <div style={{ fontSize: '13px', color: '#bbb', fontFamily: "'Inter',sans-serif", marginTop: '6px' }}>Click "Upload Logo" to add your first client logo</div>
        </div>
      )}

      {/* ── Logos Grid ── */}
      {logos.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
          {logos.map((logo, idx) => (
            <div key={logo.id} style={{ ...card, padding: '0', overflow: 'hidden', opacity: logo.isVisible ? 1 : 0.55 }}>
              {/* Logo preview */}
              <div style={{ background: '#f9fafb', padding: '24px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100px', borderBottom: '1px solid #f0f0f0' }}>
                <img src={logo.imageUrl} alt={logo.name} style={{ maxHeight: '60px', maxWidth: '140px', objectFit: 'contain' }} />
              </div>
              {/* Name + actions */}
              <div style={{ padding: '12px 14px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#111', fontFamily: "'Inter',sans-serif", marginBottom: '10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={logo.name}>{logo.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  {/* Edit */}
                  <button
                    onClick={() => openEdit(logo)}
                    title="Edit name or image"
                    style={{ padding: '5px 10px', fontSize: '11px', fontWeight: 700, borderRadius: '6px', border: '1px solid #e5e7eb', cursor: 'pointer', fontFamily: "'Inter',sans-serif", background: '#f0f4ff', color: '#2563eb', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    Edit
                  </button>
                  {/* Visibility */}
                  <button
                    onClick={() => toggleVisibility(logo.id, logo.isVisible)}
                    disabled={actionLoading === logo.id + '_vis'}
                    title={logo.isVisible ? 'Hide' : 'Show'}
                    style={{ padding: '5px 10px', fontSize: '11px', fontWeight: 700, borderRadius: '6px', border: '1px solid', cursor: 'pointer', fontFamily: "'Inter',sans-serif", background: logo.isVisible ? '#f0fdf4' : '#f9fafb', color: logo.isVisible ? '#16a34a' : '#888', borderColor: logo.isVisible ? '#bbf7d0' : '#e5e7eb' }}
                  >
                    {logo.isVisible ? '● On' : '○ Off'}
                  </button>
                  {/* Up */}
                  <button onClick={() => moveOrder(logo.id, 'up')} disabled={idx === 0} title="Move up" style={{ padding: '5px 8px', background: '#f5f5f5', border: '1px solid #e5e7eb', borderRadius: '6px', cursor: idx === 0 ? 'not-allowed' : 'pointer', opacity: idx === 0 ? 0.4 : 1 }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15" /></svg>
                  </button>
                  {/* Down */}
                  <button onClick={() => moveOrder(logo.id, 'down')} disabled={idx === logos.length - 1} title="Move down" style={{ padding: '5px 8px', background: '#f5f5f5', border: '1px solid #e5e7eb', borderRadius: '6px', cursor: idx === logos.length - 1 ? 'not-allowed' : 'pointer', opacity: idx === logos.length - 1 ? 0.4 : 1 }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                  </button>
                  {/* Delete */}
                  <button onClick={() => setDeleteConfirm(logo.id)} title="Delete" style={{ marginLeft: 'auto', padding: '5px 8px', background: '#fff1f1', border: '1px solid #fca5a5', borderRadius: '6px', cursor: 'pointer' }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
