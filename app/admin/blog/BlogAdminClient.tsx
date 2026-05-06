'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  category: string | null;
  tags: string | null;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
}

interface Props { posts: Post[]; }

const inputSt: React.CSSProperties = {
  width: '100%', background: '#f9fafb', border: '1px solid #e5e7eb',
  borderRadius: '8px', padding: '10px 12px', fontSize: '13px',
  color: '#111', outline: 'none', boxSizing: 'border-box', fontFamily: "'Inter',sans-serif",
};
const labelSt: React.CSSProperties = {
  display: 'block', fontSize: '11px', fontWeight: 700, color: '#888',
  letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px',
};
const card: React.CSSProperties = {
  background: '#fff', border: '1px solid #e5e7eb',
  borderRadius: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
};

const emptyForm = { title: '', excerpt: '', content: '', category: '', tags: '', isPublished: false };

export default function BlogAdminClient({ posts: initial }: Props) {
  const router = useRouter();
  const [posts, setPosts] = useState(initial);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Create modal
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState(emptyForm);
  const [createFile, setCreateFile] = useState<File | null>(null);
  const [createPreview, setCreatePreview] = useState<string | null>(null);
  const [createError, setCreateError] = useState('');
  const createFileRef = useRef<HTMLInputElement>(null);

  // Edit modal
  const [editPost, setEditPost] = useState<Post | null>(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editPreview, setEditPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState('');
  const editFileRef = useRef<HTMLInputElement>(null);

  // Delete
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filtered = posts.filter(p => {
    if (filter === 'published' && !p.isPublished) return false;
    if (filter === 'draft' && p.isPublished) return false;
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  // ── Create ──
  function resetCreate() {
    setShowCreate(false); setCreateForm(emptyForm);
    setCreateFile(null); setCreatePreview(null); setCreateError('');
    if (createFileRef.current) createFileRef.current.value = '';
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!createForm.title.trim()) { setCreateError('Title is required'); return; }
    setCreating(true); setCreateError('');
    const fd = new FormData();
    Object.entries(createForm).forEach(([k, v]) => fd.append(k, String(v)));
    if (createFile) fd.append('file', createFile);
    const res = await fetch('/api/admin/blog', { method: 'POST', body: fd });
    const data = await res.json();
    if (!res.ok) { setCreateError(data.error || 'Failed'); setCreating(false); return; }
    setPosts(p => [data, ...p]);
    resetCreate(); setCreating(false);
  }

  function resetEdit() {
    setEditPost(null); setEditForm(emptyForm);
    setEditFile(null); setEditPreview(null); setEditError('');
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editPost) return;
    setSaving(true); setEditError('');
    const fd = new FormData();
    Object.entries(editForm).forEach(([k, v]) => fd.append(k, String(v)));
    if (editFile) fd.append('file', editFile);
    const res = await fetch(`/api/admin/blog/${editPost.id}`, { method: 'PATCH', body: fd });
    const data = await res.json();
    if (!res.ok) { setEditError(data.error || 'Failed'); setSaving(false); return; }
    setPosts(p => p.map(x => x.id === editPost.id ? { ...x, ...data } : x));
    resetEdit(); setSaving(false);
  }

  // ── Toggle publish ──
  async function togglePublish(id: string, current: boolean) {
    setActionLoading(id + '_pub');
    const res = await fetch(`/api/admin/blog/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPublished: !current }),
    });
    if (res.ok) {
      const u = await res.json();
      setPosts(p => p.map(x => x.id === id ? { ...x, isPublished: u.isPublished, publishedAt: u.publishedAt } : x));
    }
    setActionLoading(null);
  }

  // ── Delete ──
  async function handleDelete(id: string) {
    setActionLoading(id + '_del');
    const res = await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' });
    if (res.ok) setPosts(p => p.filter(x => x.id !== id));
    setActionLoading(null);
    setDeleteConfirm(null);
  }

  const CloseBtn = ({ onClick }: { onClick: () => void }) => (
    <button onClick={onClick} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', padding: '4px' }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  );

  function CoverDropZone({ preview, current, fileRef, onChange, onRemove }: {
    preview: string | null; current: string | null;
    fileRef: React.RefObject<HTMLInputElement | null>;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemove: () => void;
  }) {
    return (
      <div style={{ marginBottom: '14px' }}>
        <label style={labelSt}>Cover Image <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: '#bbb' }}>(optional)</span></label>
        <div onClick={() => fileRef.current?.click()} style={{ border: '2px dashed #e5e7eb', borderRadius: '10px', padding: '16px', textAlign: 'center', cursor: 'pointer', background: '#f9fafb', minHeight: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {preview || current ? (
            <img src={preview || current!} alt="" style={{ maxHeight: '80px', maxWidth: '100%', objectFit: 'cover', borderRadius: '6px' }} />
          ) : (
            <div style={{ fontSize: '13px', color: '#888', fontFamily: "'Inter',sans-serif" }}>Click to upload cover image</div>
          )}
          <input ref={fileRef} type="file" accept="image/*" onChange={onChange} style={{ display: 'none' }} />
        </div>
        {preview && <button type="button" onClick={onRemove} style={{ marginTop: '4px', fontSize: '12px', color: '#888', background: 'none', border: 'none', cursor: 'pointer' }}>Remove</button>}
      </div>
    );
  }

  function PostForm({ form, setForm, fileRef, preview, setFile, setPreview, current, error, onSubmit, loading, submitLabel }: {
    form: typeof emptyForm; setForm: (f: typeof emptyForm) => void;
    fileRef: React.RefObject<HTMLInputElement | null>;
    preview: string | null; setFile: (f: File | null) => void; setPreview: (s: string | null) => void;
    current: string | null; error: string; onSubmit: (e: React.FormEvent) => void;
    loading: boolean; submitLabel: string;
  }) {
    return (
      <form onSubmit={onSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelSt}>Title *</label>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Post title" style={inputSt} />
          </div>
          <div>
            <label style={labelSt}>Category</label>
            <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="Corporate Events" style={inputSt} />
          </div>
          <div>
            <label style={labelSt}>Tags <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: '#bbb' }}>(comma separated)</span></label>
            <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="team building, awards" style={inputSt} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelSt}>Excerpt</label>
            <textarea value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} placeholder="Short description shown in listing…" rows={2} style={{ ...inputSt, resize: 'vertical' }} />
          </div>
        </div>
        <CoverDropZone
          preview={preview} current={current} fileRef={fileRef}
          onChange={e => { const f = e.target.files?.[0]; if (f) { setFile(f); setPreview(URL.createObjectURL(f)); } }}
          onRemove={() => { setFile(null); setPreview(null); if (fileRef.current) fileRef.current.value = ''; }}
        />
        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: '#555', fontFamily: "'Inter',sans-serif" }}>
            <input type="checkbox" checked={form.isPublished} onChange={e => setForm({ ...form, isPublished: e.target.checked })} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
            Publish immediately
          </label>
        </div>
        {error && <div style={{ background: '#fff1f1', border: '1px solid #fca5a5', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#dc2626', marginBottom: '12px', fontFamily: "'Inter',sans-serif" }}>{error}</div>}
        <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: '#1a1f2e', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'Inter',sans-serif", opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Saving…' : submitLabel}
        </button>
      </form>
    );
  }

  const pub = posts.filter(p => p.isPublished).length;
  const draft = posts.filter(p => !p.isPublished).length;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#111', margin: 0 }}>Blog Posts</h1>
          <p style={{ fontSize: '13px', color: '#888', margin: '4px 0 0', fontFamily: "'Inter',sans-serif" }}>{pub} published · {draft} drafts</p>
        </div>
        <button onClick={() => setShowCreate(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', background: '#1a1f2e', color: '#fff', border: 'none', borderRadius: '9px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: "'Inter',sans-serif" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          New Post
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search posts…" style={{ ...inputSt, maxWidth: '260px' }} />
        {(['all', 'published', 'draft'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter',sans-serif", background: filter === f ? '#1a1f2e' : '#fff', color: filter === f ? '#fff' : '#555', borderColor: filter === f ? '#1a1f2e' : '#e5e7eb', textTransform: 'capitalize' }}>
            {f}
          </button>
        ))}
      </div>

      {/* ── Create Modal ── */}
      {showCreate && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '560px', boxShadow: '0 20px 60px rgba(0,0,0,0.25)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#111', margin: 0 }}>New Blog Post</h2>
              <CloseBtn onClick={resetCreate} />
            </div>
            <PostForm form={createForm} setForm={setCreateForm} fileRef={createFileRef} preview={createPreview} setFile={setCreateFile} setPreview={setCreatePreview} current={null} error={createError} onSubmit={handleCreate} loading={creating} submitLabel="Create Post" />
          </div>
        </div>
      )}

      {/* ── Edit Modal ── */}
      {editPost && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '560px', boxShadow: '0 20px 60px rgba(0,0,0,0.25)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#111', margin: 0 }}>Edit Post</h2>
              <CloseBtn onClick={resetEdit} />
            </div>
            <div style={{ marginBottom: '12px', padding: '8px 12px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', fontSize: '12px', color: '#92400e', fontFamily: "'Inter',sans-serif" }}>
              Slug: <strong>/blog/{editPost.slug}</strong>
            </div>
            <PostForm form={editForm} setForm={setEditForm} fileRef={editFileRef} preview={editPreview} setFile={setEditFile} setPreview={setEditPreview} current={editPost.coverImageUrl} error={editError} onSubmit={handleEdit} loading={saving} submitLabel="Save Changes" />
          </div>
        </div>
      )}

      {/* ── Delete Confirm ── */}
      {deleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '360px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#111', marginBottom: '8px' }}>Delete Post?</h3>
            <p style={{ fontSize: '13px', color: '#888', marginBottom: '24px', fontFamily: "'Inter',sans-serif" }}>This cannot be undone.</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setDeleteConfirm(null)} style={{ flex: 1, padding: '11px', background: '#f5f5f5', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter',sans-serif" }}>Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} disabled={!!actionLoading} style={{ flex: 1, padding: '11px', background: '#dc2626', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: "'Inter',sans-serif" }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* ── List ── */}
      {filtered.length === 0 ? (
        <div style={{ ...card, padding: '60px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#999', fontFamily: "'Inter',sans-serif" }}>No posts found</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map(post => (
            <div key={post.id} style={{ ...card, display: 'flex', gap: '0', overflow: 'hidden', opacity: post.isPublished ? 1 : 0.65 }}>
              {/* Cover */}
              <div style={{ width: '120px', flexShrink: 0, background: '#f0f0f0', position: 'relative' }}>
                {post.coverImageUrl
                  ? <img src={post.coverImageUrl} alt={post.title} style={{ width: '100%', height: '100px', objectFit: 'cover', display: 'block' }} />
                  : <div style={{ width: '100%', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                    </div>
                }
              </div>

              {/* Info */}
              <div style={{ flex: 1, padding: '14px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#111', fontFamily: "'Inter',sans-serif" }}>{post.title}</span>
                    {post.category && <span style={{ fontSize: '11px', padding: '2px 8px', background: '#f0f4ff', color: '#2563eb', borderRadius: '999px', fontWeight: 600, fontFamily: "'Inter',sans-serif" }}>{post.category}</span>}
                  </div>
                  {post.excerpt && <div style={{ fontSize: '12px', color: '#888', fontFamily: "'Inter',sans-serif", lineHeight: 1.5 }}>{post.excerpt.slice(0, 120)}{post.excerpt.length > 120 ? '…' : ''}</div>}
                  <div style={{ fontSize: '11px', color: '#bbb', marginTop: '6px', fontFamily: "'Inter',sans-serif" }}>
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Not published'}
                    {post.tags && <> · {post.tags.split(',').slice(0, 3).join(', ')}</>}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
                  <button onClick={() => router.push(`/admin/blog/${post.id}`)} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '5px 12px', fontSize: '12px', fontWeight: 700, borderRadius: '7px', border: '1px solid #e5e7eb', cursor: 'pointer', background: '#f0f4ff', color: '#2563eb', fontFamily: "'Inter',sans-serif" }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                    Edit
                  </button>
                  <a href={`/blog/${post.slug}`} target="_blank" style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '5px 12px', fontSize: '12px', fontWeight: 700, borderRadius: '7px', border: '1px solid #e5e7eb', cursor: 'pointer', background: '#f9fafb', color: '#555', fontFamily: "'Inter',sans-serif", textDecoration: 'none' }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                    View
                  </a>
                  <button onClick={() => togglePublish(post.id, post.isPublished)} disabled={actionLoading === post.id + '_pub'} style={{ padding: '5px 12px', fontSize: '12px', fontWeight: 700, borderRadius: '7px', border: '1px solid', cursor: 'pointer', fontFamily: "'Inter',sans-serif", background: post.isPublished ? '#f0fdf4' : '#f9fafb', color: post.isPublished ? '#16a34a' : '#888', borderColor: post.isPublished ? '#bbf7d0' : '#e5e7eb' }}>
                    {post.isPublished ? '● Published' : '○ Draft'}
                  </button>
                  <button onClick={() => setDeleteConfirm(post.id)} style={{ marginLeft: 'auto', padding: '5px 10px', background: '#fff1f1', border: '1px solid #fca5a5', borderRadius: '7px', cursor: 'pointer' }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /></svg>
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
