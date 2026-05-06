'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  category: string | null;
  tags: string | null;
  isPublished: boolean;
  publishedAt: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string | null;
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

function ToolbarBtn({ onClick, active, title, children }: { onClick: () => void; active?: boolean; title: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      style={{
        padding: '5px 9px', borderRadius: '5px', border: 'none', cursor: 'pointer',
        background: active ? '#1a1f2e' : 'transparent',
        color: active ? '#fff' : '#444',
        fontSize: '13px', fontWeight: 600,
        fontFamily: "'Inter',sans-serif",
        display: 'flex', alignItems: 'center',
      }}
    >
      {children}
    </button>
  );
}

export default function BlogEditClient({ post }: { post: Post }) {
  const router = useRouter();
  const [title, setTitle] = useState(post.title);
  const [excerpt, setExcerpt] = useState(post.excerpt || '');
  const [category, setCategory] = useState(post.category || '');
  const [tags, setTags] = useState(post.tags || '');
  const [isPublished, setIsPublished] = useState(post.isPublished);
  const [coverPreview, setCoverPreview] = useState<string | null>(post.coverImageUrl);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [metaTitle, setMetaTitle] = useState(post.metaTitle || '');
  const [metaDescription, setMetaDescription] = useState(post.metaDescription || '');
  const [metaKeywords, setMetaKeywords] = useState(post.metaKeywords || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const coverRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Image.configure({ allowBase64: true }),
      Link.configure({ openOnClick: false }),
    ],
    content: post.content,
    editorProps: {
      attributes: {
        style: 'min-height:400px;outline:none;font-family:Inter,sans-serif;font-size:15px;line-height:1.8;color:#333;',
      },
    },
  });

  async function handleSave() {
    if (!title.trim()) { setError('Title is required'); return; }
    setSaving(true); setError(''); setSaved(false);

    const fd = new FormData();
    fd.append('title', title);
    fd.append('content', editor?.getHTML() || '');
    fd.append('excerpt', excerpt);
    fd.append('category', category);
    fd.append('tags', tags);
    fd.append('isPublished', String(isPublished));
    fd.append('metaTitle', metaTitle);
    fd.append('metaDescription', metaDescription);
    fd.append('metaKeywords', metaKeywords);
    if (coverFile) fd.append('file', coverFile);

    const res = await fetch(`/api/admin/blog/${post.id}`, { method: 'PATCH', body: fd });
    const data = await res.json();
    if (!res.ok) { setError(data.error || 'Save failed'); setSaving(false); return; }
    setSaved(true);
    setSaving(false);
    setTimeout(() => setSaved(false), 3000);
  }

  function insertImage() {
    const url = prompt('Image URL:');
    if (url) editor?.chain().focus().setImage({ src: url }).run();
  }

  function setLink() {
    const url = prompt('Link URL:');
    if (url) editor?.chain().focus().setLink({ href: url }).run();
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => router.push('/admin/blog')} style={{ background: 'none', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '8px 14px', fontSize: '13px', fontWeight: 600, color: '#555', cursor: 'pointer', fontFamily: "'Inter',sans-serif", display: 'flex', alignItems: 'center', gap: '6px' }}>
            ← Back
          </button>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#111', margin: 0 }}>Edit Post</h1>
            <div style={{ fontSize: '12px', color: '#aaa', fontFamily: "'Inter',sans-serif", marginTop: '2px' }}>/blog/{post.slug}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#555', fontFamily: "'Inter',sans-serif", cursor: 'pointer' }}>
            <input type="checkbox" checked={isPublished} onChange={e => setIsPublished(e.target.checked)} style={{ width: '15px', height: '15px', cursor: 'pointer' }} />
            Published
          </label>
          <a href={`/blog/${post.slug}`} target="_blank" style={{ padding: '9px 16px', background: '#f5f5f5', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: '#555', textDecoration: 'none', fontFamily: "'Inter',sans-serif" }}>
            View Post ↗
          </a>
          <button onClick={handleSave} disabled={saving} style={{ padding: '9px 22px', background: '#1a1f2e', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 700, color: '#fff', cursor: saving ? 'not-allowed' : 'pointer', fontFamily: "'Inter',sans-serif", opacity: saving ? 0.7 : 1 }}>
            {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save Changes'}
          </button>
        </div>
      </div>

      {error && <div style={{ background: '#fff1f1', border: '1px solid #fca5a5', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#dc2626', marginBottom: '16px', fontFamily: "'Inter',sans-serif" }}>{error}</div>}
      {saved && <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#16a34a', marginBottom: '16px', fontFamily: "'Inter',sans-serif" }}>Changes saved successfully.</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '24px', alignItems: 'start' }}>

        {/* ── Left: Content ── */}
        <div>
          {/* Title */}
          <div style={{ marginBottom: '16px' }}>
            <label style={labelSt}>Title *</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Post title" style={{ ...inputSt, fontSize: '18px', fontWeight: 700, padding: '12px 14px' }} />
          </div>

          {/* Rich text editor */}
          <div style={{ marginBottom: '16px' }}>
            <label style={labelSt}>Content</label>
            <div style={{ border: '1px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden', background: '#fff' }}>
              {/* Toolbar */}
              <div style={{ display: 'flex', gap: '2px', padding: '8px 10px', borderBottom: '1px solid #f0f0f0', background: '#fafafa', flexWrap: 'wrap' }}>
                <ToolbarBtn onClick={() => editor?.chain().focus().toggleBold().run()} active={editor?.isActive('bold')} title="Bold"><strong>B</strong></ToolbarBtn>
                <ToolbarBtn onClick={() => editor?.chain().focus().toggleItalic().run()} active={editor?.isActive('italic')} title="Italic"><em>I</em></ToolbarBtn>
                <ToolbarBtn onClick={() => editor?.chain().focus().toggleStrike().run()} active={editor?.isActive('strike')} title="Strikethrough"><s>S</s></ToolbarBtn>

                <div style={{ width: '1px', background: '#e5e7eb', margin: '2px 6px' }} />

                <ToolbarBtn onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} active={editor?.isActive('heading', { level: 2 })} title="Heading 2">H2</ToolbarBtn>
                <ToolbarBtn onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} active={editor?.isActive('heading', { level: 3 })} title="Heading 3">H3</ToolbarBtn>

                <div style={{ width: '1px', background: '#e5e7eb', margin: '2px 6px' }} />

                <ToolbarBtn onClick={() => editor?.chain().focus().toggleBulletList().run()} active={editor?.isActive('bulletList')} title="Bullet List">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="9" y1="6" x2="20" y2="6" /><line x1="9" y1="12" x2="20" y2="12" /><line x1="9" y1="18" x2="20" y2="18" /><circle cx="4" cy="6" r="1" fill="currentColor" /><circle cx="4" cy="12" r="1" fill="currentColor" /><circle cx="4" cy="18" r="1" fill="currentColor" /></svg>
                </ToolbarBtn>
                <ToolbarBtn onClick={() => editor?.chain().focus().toggleOrderedList().run()} active={editor?.isActive('orderedList')} title="Numbered List">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="10" y1="6" x2="21" y2="6" /><line x1="10" y1="12" x2="21" y2="12" /><line x1="10" y1="18" x2="21" y2="18" /><path d="M4 6h1v4" /><path d="M4 10h2" /><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" /></svg>
                </ToolbarBtn>
                <ToolbarBtn onClick={() => editor?.chain().focus().toggleBlockquote().run()} active={editor?.isActive('blockquote')} title="Quote">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" /><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" /></svg>
                </ToolbarBtn>

                <div style={{ width: '1px', background: '#e5e7eb', margin: '2px 6px' }} />

                <ToolbarBtn onClick={setLink} active={editor?.isActive('link')} title="Add Link">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
                </ToolbarBtn>
                <ToolbarBtn onClick={insertImage} title="Insert Image">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                </ToolbarBtn>

                <div style={{ width: '1px', background: '#e5e7eb', margin: '2px 6px' }} />

                <ToolbarBtn onClick={() => editor?.chain().focus().undo().run()} title="Undo">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 14 4 9 9 4" /><path d="M20 20v-7a4 4 0 0 0-4-4H4" /></svg>
                </ToolbarBtn>
                <ToolbarBtn onClick={() => editor?.chain().focus().redo().run()} title="Redo">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 14 20 9 15 4" /><path d="M4 20v-7a4 4 0 0 1 4-4h12" /></svg>
                </ToolbarBtn>
              </div>

              {/* Editor area */}
              <div style={{ padding: '20px 24px' }}>
                <style>{`
                  .tiptap-editor h1,.tiptap-editor h2,.tiptap-editor h3{font-weight:800;color:#111;margin:1.5em 0 0.5em;line-height:1.25;}
                  .tiptap-editor h2{font-size:22px;}
                  .tiptap-editor h3{font-size:18px;}
                  .tiptap-editor p{margin:0 0 1em;}
                  .tiptap-editor ul,.tiptap-editor ol{padding-left:1.6em;margin:0 0 1em;}
                  .tiptap-editor li{margin-bottom:0.4em;}
                  .tiptap-editor img{max-width:100%;border-radius:8px;margin:1em 0;}
                  .tiptap-editor a{color:#ff6a00;text-decoration:underline;}
                  .tiptap-editor blockquote{border-left:4px solid #ff6a00;margin:1em 0;padding:10px 16px;background:#fff8f5;border-radius:0 6px 6px 0;}
                  .tiptap-editor .ProseMirror-focused{outline:none;}
                `}</style>
                <div className="tiptap-editor">
                  <EditorContent editor={editor} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: Sidebar ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Cover image */}
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '16px' }}>
            <label style={labelSt}>Cover Image</label>
            <div onClick={() => coverRef.current?.click()} style={{ border: '2px dashed #e5e7eb', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', minHeight: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb' }}>
              {coverPreview
                ? <img src={coverPreview} alt="" style={{ width: '100%', maxHeight: '160px', objectFit: 'cover', display: 'block' }} />
                : <div style={{ fontSize: '12px', color: '#aaa', fontFamily: "'Inter',sans-serif", textAlign: 'center', padding: '16px' }}>Click to upload cover</div>
              }
              <input ref={coverRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => {
                const f = e.target.files?.[0];
                if (f) { setCoverFile(f); setCoverPreview(URL.createObjectURL(f)); }
              }} />
            </div>
            {coverPreview && (
              <button type="button" onClick={() => { setCoverFile(null); setCoverPreview(null); }} style={{ marginTop: '6px', fontSize: '11px', color: '#888', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Inter',sans-serif" }}>Remove</button>
            )}
          </div>

          {/* Meta */}
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={labelSt}>Meta</label>
            <div>
              <label style={{ ...labelSt, marginBottom: '4px' }}>Category</label>
              <input value={category} onChange={e => setCategory(e.target.value)} placeholder="Corporate Events" style={inputSt} />
            </div>
            <div>
              <label style={{ ...labelSt, marginBottom: '4px' }}>Tags <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: '#bbb' }}>(comma separated)</span></label>
              <input value={tags} onChange={e => setTags(e.target.value)} placeholder="team building, awards" style={inputSt} />
            </div>
            <div>
              <label style={{ ...labelSt, marginBottom: '4px' }}>Excerpt</label>
              <textarea value={excerpt} onChange={e => setExcerpt(e.target.value)} placeholder="Short description for listing page…" rows={3} style={{ ...inputSt, resize: 'vertical' }} />
            </div>
          </div>

          {/* Slug */}
          <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '14px' }}>
            <label style={labelSt}>URL Slug</label>
            <div style={{ fontSize: '12px', color: '#555', fontFamily: "'Inter',sans-serif", wordBreak: 'break-all' }}>/blog/<strong>{post.slug}</strong></div>
            <div style={{ fontSize: '11px', color: '#bbb', marginTop: '4px', fontFamily: "'Inter',sans-serif" }}>Slug cannot be changed after import</div>
          </div>

          {/* SEO */}
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={labelSt}>SEO</label>
            <div>
              <label style={{ ...labelSt, marginBottom: '4px' }}>
                Meta Title
                <span style={{ marginLeft: '6px', fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: metaTitle.length > 60 ? '#dc2626' : '#bbb' }}>
                  {metaTitle.length}/60
                </span>
              </label>
              <input
                value={metaTitle}
                onChange={e => setMetaTitle(e.target.value)}
                placeholder="SEO title (leave blank to use post title)"
                style={{ ...inputSt, borderColor: metaTitle.length > 60 ? '#fca5a5' : '#e5e7eb' }}
              />
            </div>
            <div>
              <label style={{ ...labelSt, marginBottom: '4px' }}>
                Meta Description
                <span style={{ marginLeft: '6px', fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: metaDescription.length > 160 ? '#dc2626' : '#bbb' }}>
                  {metaDescription.length}/160
                </span>
              </label>
              <textarea
                value={metaDescription}
                onChange={e => setMetaDescription(e.target.value)}
                placeholder="Description for search results…"
                rows={3}
                style={{ ...inputSt, resize: 'vertical', borderColor: metaDescription.length > 160 ? '#fca5a5' : '#e5e7eb' }}
              />
            </div>
            <div>
              <label style={{ ...labelSt, marginBottom: '4px' }}>Keywords</label>
              <input
                value={metaKeywords}
                onChange={e => setMetaKeywords(e.target.value)}
                placeholder="corporate events, team building, chennai"
                style={inputSt}
              />
            </div>
            {(metaTitle || metaDescription) && (
              <div style={{ background: '#f8f9fa', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '12px 14px' }}>
                <div style={{ fontSize: '10px', fontWeight: 700, color: '#888', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>Preview</div>
                <div style={{ fontSize: '16px', color: '#1a0dab', fontFamily: 'Arial,sans-serif', lineHeight: 1.3, marginBottom: '3px', wordBreak: 'break-word' }}>
                  {metaTitle || title || '(no title)'}
                </div>
                <div style={{ fontSize: '12px', color: '#006621', fontFamily: 'Arial,sans-serif', marginBottom: '3px' }}>
                  heliosevent.in › blog › {post.slug}
                </div>
                <div style={{ fontSize: '12px', color: '#545454', fontFamily: 'Arial,sans-serif', lineHeight: 1.5, wordBreak: 'break-word' }}>
                  {metaDescription || excerpt || '(no description)'}
                </div>
              </div>
            )}
          </div>

          {/* Published date */}
          {post.publishedAt && (
            <div style={{ fontSize: '12px', color: '#aaa', fontFamily: "'Inter',sans-serif", padding: '0 4px' }}>
              Published: {new Date(post.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
