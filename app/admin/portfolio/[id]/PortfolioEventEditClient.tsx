'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';

interface MediaItem {
  id: string;
  type: string;
  url: string;
  displayOrder: number;
}

interface PortfolioEvent {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string;
  clientName: string | null;
  coverImageUrl: string | null;
  isActive: boolean;
  media: MediaItem[];
}

const CATEGORIES = [
  { slug: 'corporate-events', label: 'Corporate Events' },
  { slug: 'employee-engagement', label: 'Employee Engagement' },
  { slug: 'seminars-conferences', label: 'Seminars & Conferences' },
  { slug: 'exhibitions', label: 'Exhibitions' },
  { slug: 'sports-events', label: 'Sports Events' },
  { slug: 'social-wedding', label: 'Social & Wedding Events' },
];

const inp: React.CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: '8px',
  border: '1px solid #e5e7eb', fontSize: '14px', fontFamily: "'Inter', sans-serif",
  color: '#111', background: '#fafafa', boxSizing: 'border-box',
};
const lbl: React.CSSProperties = {
  display: 'block', fontSize: '11px', fontWeight: 700, color: '#888',
  letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px',
  fontFamily: "'Inter', sans-serif",
};
const card: React.CSSProperties = {
  background: '#fff', border: '1px solid #e5e7eb',
  borderRadius: '14px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
};

export default function PortfolioEventEditClient({ event: initialEvent }: { event: PortfolioEvent }) {
  const [event, setEvent] = useState(initialEvent);
  const [media, setMedia] = useState<MediaItem[]>(initialEvent.media);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [addingVideo, setAddingVideo] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const images = media.filter(m => m.type === 'IMAGE');
  const videos = media.filter(m => m.type === 'VIDEO');

  async function saveInfo() {
    setSaving(true);
    const fd = new FormData();
    fd.append('title', event.title);
    fd.append('description', event.description || '');
    fd.append('clientName', event.clientName || '');
    fd.append('category', event.category);
    if (coverFile) fd.append('coverImage', coverFile);

    const res = await fetch(`/api/admin/portfolio/events/${event.id}`, { method: 'PATCH', body: fd });
    if (res.ok) {
      const updated = await res.json();
      setEvent(prev => ({ ...prev, ...updated }));
      setCoverFile(null);
      setCoverPreview(null);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
    setSaving(false);
  }

  async function uploadImages(files: FileList | null) {
    if (!files || !files.length) return;
    setUploading(true);
    const fd = new FormData();
    Array.from(files).forEach(f => fd.append('files', f));
    const res = await fetch(`/api/admin/portfolio/events/${event.id}/media`, { method: 'POST', body: fd });
    if (res.ok) {
      const created: MediaItem[] = await res.json();
      setMedia(prev => [...prev, ...created]);
      // Auto-set cover if none
      if (!event.coverImageUrl && created.length) {
        setEvent(prev => ({ ...prev, coverImageUrl: created[0].url }));
      }
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  }

  async function addVideo() {
    if (!videoUrl.trim()) return;
    setAddingVideo(true);
    const res = await fetch(`/api/admin/portfolio/events/${event.id}/media`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: videoUrl.trim() }),
    });
    if (res.ok) {
      const created: MediaItem = await res.json();
      setMedia(prev => [...prev, created]);
      setVideoUrl('');
    }
    setAddingVideo(false);
  }

  async function deleteMedia(m: MediaItem) {
    if (!confirm('Remove this media item?')) return;
    const res = await fetch(`/api/admin/portfolio/events/${event.id}/media/${m.id}`, { method: 'DELETE' });
    if (res.ok) {
      setMedia(prev => prev.filter(x => x.id !== m.id));
      if (event.coverImageUrl === m.url) {
        setEvent(prev => ({ ...prev, coverImageUrl: null }));
      }
    }
  }

  async function setCover(url: string) {
    const res = await fetch(`/api/admin/portfolio/events/${event.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ coverImageUrl: url }),
    });
    if (res.ok) setEvent(prev => ({ ...prev, coverImageUrl: url }));
  }

  function onCoverPick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setCoverFile(f);
    setCoverPreview(URL.createObjectURL(f));
  }

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px', flexWrap: 'wrap' }}>
        <Link href="/admin/portfolio" style={{ color: '#888', textDecoration: 'none', fontSize: '13px' }}>
          ← Portfolio
        </Link>
        <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#111', margin: 0, flex: 1 }}>
          Edit: {event.title}
        </h1>
        <a href={`/portfolio/${event.slug}`} target="_blank" rel="noopener noreferrer"
          style={{ fontSize: '12px', color: '#888', textDecoration: 'none' }}>
          Preview ↗
        </a>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px', alignItems: 'start' }}>

        {/* ── Left: Details + Media ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Event Info */}
          <div style={card}>
            <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#111', margin: '0 0 20px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Event Details
            </h2>

            <div style={{ marginBottom: '16px' }}>
              <label style={lbl}>Event Title *</label>
              <input
                value={event.title}
                onChange={e => setEvent(prev => ({ ...prev, title: e.target.value }))}
                style={inp}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={lbl}>Category</label>
                <select
                  value={event.category}
                  onChange={e => setEvent(prev => ({ ...prev, category: e.target.value }))}
                  style={inp}
                >
                  {CATEGORIES.map(c => <option key={c.slug} value={c.slug}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label style={lbl}>Client Name</label>
                <input
                  value={event.clientName || ''}
                  onChange={e => setEvent(prev => ({ ...prev, clientName: e.target.value }))}
                  placeholder="e.g. Tata Motors"
                  style={inp}
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={lbl}>Description</label>
              <textarea
                value={event.description || ''}
                onChange={e => setEvent(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                placeholder="Describe this event — what happened, the scale, the outcome…"
                style={{ ...inp, resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button
                onClick={saveInfo}
                disabled={saving}
                style={{
                  padding: '10px 24px', background: '#adc905', color: '#0d1117',
                  border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 700,
                  cursor: 'pointer', fontFamily: "'Inter', sans-serif",
                }}
              >
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
              {saved && (
                <span style={{ fontSize: '13px', color: '#16a34a', fontWeight: 600 }}>
                  ✓ Saved
                </span>
              )}
            </div>
          </div>

          {/* Upload New Images */}
          <div style={card}>
            <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#111', margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Add Photos
            </h2>
            <div
              style={{
                border: `2px dashed ${dragOver ? '#adc905' : '#d1d5db'}`,
                borderRadius: '10px', padding: '32px', textAlign: 'center', cursor: 'pointer',
                background: dragOver ? 'rgba(173,201,5,0.04)' : '#fafafa',
                transition: 'all 0.15s',
              }}
              onClick={() => fileRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); uploadImages(e.dataTransfer.files); }}
            >
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>📁</div>
              <div style={{ fontSize: '14px', color: '#555', fontWeight: 500 }}>
                {uploading ? 'Uploading…' : 'Click or drag & drop images here'}
              </div>
              <div style={{ fontSize: '12px', color: '#aaa', marginTop: '4px' }}>
                JPG, PNG, WebP — multiple files supported
              </div>
              <input ref={fileRef} type="file" multiple accept="image/*" style={{ display: 'none' }}
                onChange={e => uploadImages(e.target.files)} />
            </div>
          </div>

          {/* Add Video URL */}
          <div style={card}>
            <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#111', margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Add Video
            </h2>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                value={videoUrl}
                onChange={e => setVideoUrl(e.target.value)}
                placeholder="YouTube URL or direct video URL…"
                style={{ ...inp, flex: 1 }}
              />
              <button
                onClick={addVideo}
                disabled={!videoUrl.trim() || addingVideo}
                style={{
                  padding: '10px 20px', background: '#0d1117', color: '#fff',
                  border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
                  cursor: videoUrl.trim() ? 'pointer' : 'not-allowed',
                  opacity: videoUrl.trim() ? 1 : 0.4,
                  fontFamily: "'Inter', sans-serif", whiteSpace: 'nowrap',
                }}
              >
                {addingVideo ? 'Adding…' : '+ Add'}
              </button>
            </div>
            <div style={{ fontSize: '12px', color: '#aaa', marginTop: '8px' }}>
              Supports YouTube links and direct .mp4 / .mov URLs
            </div>
          </div>

          {/* Photos Grid */}
          {images.length > 0 && (
            <div style={card}>
              <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#111', margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Photos ({images.length})
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                gap: '12px',
              }}>
                {images.map(img => (
                  <div key={img.id} style={{
                    position: 'relative', borderRadius: '10px', overflow: 'hidden',
                    aspectRatio: '4/3', background: '#f3f4f6',
                    border: event.coverImageUrl === img.url ? '3px solid #adc905' : '1px solid #e5e7eb',
                  }}>
                    <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

                    {/* Cover badge */}
                    {event.coverImageUrl === img.url && (
                      <div style={{
                        position: 'absolute', top: '6px', left: '6px',
                        background: '#adc905', borderRadius: '4px',
                        padding: '2px 7px', fontSize: '10px', fontWeight: 700, color: '#0d1117',
                      }}>
                        Cover
                      </div>
                    )}

                    {/* Actions */}
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0,
                      background: 'rgba(255,255,255,0.95)', borderTop: '1px solid #e5e7eb',
                      display: 'flex', gap: '4px', padding: '5px',
                    }}>
                      {event.coverImageUrl !== img.url && (
                        <button
                          onClick={() => setCover(img.url)}
                          style={{
                            flex: 1, padding: '4px 6px', borderRadius: '5px', border: 'none',
                            cursor: 'pointer', fontSize: '10px', fontWeight: 600,
                            background: '#f0fdf4', color: '#166534',
                            fontFamily: "'Inter', sans-serif",
                          }}
                        >
                          Set Cover
                        </button>
                      )}
                      <button
                        onClick={() => deleteMedia(img)}
                        style={{
                          flex: 1, padding: '4px 6px', borderRadius: '5px', border: 'none',
                          cursor: 'pointer', fontSize: '10px', fontWeight: 600,
                          background: '#fee2e2', color: '#b91c1c',
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Videos Grid */}
          {videos.length > 0 && (
            <div style={card}>
              <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#111', margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Videos ({videos.length})
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {videos.map(vid => (
                  <div key={vid.id} style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '12px 16px', background: '#f9fafb',
                    border: '1px solid #e5e7eb', borderRadius: '10px',
                  }}>
                    <span style={{ fontSize: '24px' }}>🎬</span>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <div style={{ fontSize: '12px', color: '#555', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                        {vid.url}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteMedia(vid)}
                      style={{
                        padding: '6px 12px', borderRadius: '6px', border: 'none',
                        cursor: 'pointer', fontSize: '12px', fontWeight: 600,
                        background: '#fee2e2', color: '#b91c1c',
                        fontFamily: "'Inter', sans-serif", flexShrink: 0,
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Right Sidebar ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'sticky', top: '24px' }}>

          {/* Cover Image */}
          <div style={card}>
            <h2 style={{ fontSize: '13px', fontWeight: 700, color: '#111', margin: '0 0 14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Cover Image
            </h2>
            <div style={{
              aspectRatio: '4/3', borderRadius: '10px', overflow: 'hidden',
              background: '#f3f4f6', marginBottom: '12px', position: 'relative',
            }}>
              {coverPreview ? (
                <img src={coverPreview} alt="Cover preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : event.coverImageUrl ? (
                <img src={event.coverImageUrl} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '32px', color: '#ccc' }}>
                  📷
                </div>
              )}
            </div>
            <label style={{
              display: 'block', textAlign: 'center', padding: '9px',
              background: '#f3f4f6', borderRadius: '8px', cursor: 'pointer',
              fontSize: '13px', fontWeight: 600, color: '#555',
              fontFamily: "'Inter', sans-serif",
            }}>
              Upload New Cover
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={onCoverPick} />
            </label>
            {coverFile && (
              <div style={{ fontSize: '12px', color: '#aaa', marginTop: '6px', textAlign: 'center' }}>
                Save changes to apply new cover
              </div>
            )}
            {images.length > 0 && (
              <div style={{ fontSize: '12px', color: '#aaa', marginTop: '8px', textAlign: 'center' }}>
                Or click &quot;Set Cover&quot; on any photo below
              </div>
            )}
          </div>

          {/* Visibility */}
          <div style={card}>
            <h2 style={{ fontSize: '13px', fontWeight: 700, color: '#111', margin: '0 0 14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Visibility
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '14px', color: '#555' }}>
                {event.isActive ? 'Visible on portfolio' : 'Hidden from portfolio'}
              </span>
              <button
                onClick={async () => {
                  const res = await fetch(`/api/admin/portfolio/events/${event.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ isActive: !event.isActive }),
                  });
                  if (res.ok) setEvent(prev => ({ ...prev, isActive: !prev.isActive }));
                }}
                style={{
                  padding: '6px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                  fontSize: '13px', fontWeight: 600, fontFamily: "'Inter', sans-serif",
                  background: event.isActive ? '#fee2e2' : '#dcfce7',
                  color: event.isActive ? '#b91c1c' : '#166534',
                }}
              >
                {event.isActive ? 'Hide' : 'Publish'}
              </button>
            </div>
          </div>

          {/* Slug */}
          <div style={card}>
            <h2 style={{ fontSize: '13px', fontWeight: 700, color: '#111', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              URL Slug
            </h2>
            <div style={{
              fontSize: '12px', color: '#888', fontFamily: 'monospace',
              background: '#f9fafb', padding: '8px 12px', borderRadius: '6px',
              wordBreak: 'break-all',
            }}>
              /portfolio/{event.slug}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
