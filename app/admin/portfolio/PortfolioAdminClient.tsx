'use client';

import { useState } from 'react';
import Link from 'next/link';

interface PortfolioEvent {
  id: string;
  title: string;
  slug: string;
  category: string;
  clientName: string | null;
  coverImageUrl: string | null;
  isActive: boolean;
  displayOrder: number;
  _count: { media: number };
}

const CATEGORIES = [
  { slug: 'corporate-events', label: 'Corporate Events' },
  { slug: 'employee-engagement', label: 'Employee Engagement' },
  { slug: 'seminars-conferences', label: 'Seminars & Conferences' },
  { slug: 'exhibitions', label: 'Exhibitions' },
  { slug: 'sports-events', label: 'Sports Events' },
  { slug: 'social-wedding', label: 'Social & Wedding Events' },
];

const catLabel = (slug: string) => CATEGORIES.find(c => c.slug === slug)?.label ?? slug;

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function PortfolioAdminClient({ initialEvents }: { initialEvents: PortfolioEvent[] }) {
  const [events, setEvents] = useState<PortfolioEvent[]>(initialEvents);
  const [activeTab, setActiveTab] = useState('all');
  const [showNewModal, setShowNewModal] = useState(false);
  const [creating, setCreating] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('corporate-events');
  const [newClient, setNewClient] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const filtered = activeTab === 'all' ? events : events.filter(e => e.category === activeTab);
  const countFor = (slug: string) => slug === 'all' ? events.length : events.filter(e => e.category === slug).length;

  async function createEvent() {
    if (!newTitle.trim()) return;
    setCreating(true);
    const res = await fetch('/api/admin/portfolio/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: newTitle.trim(),
        slug: slugify(newTitle.trim()),
        category: newCategory,
        clientName: newClient.trim() || null,
        description: newDesc.trim() || null,
      }),
    });
    if (res.ok) {
      const created = await res.json();
      setEvents(prev => [...prev, { ...created, _count: { media: 0 } }]);
      setShowNewModal(false);
      setNewTitle(''); setNewCategory('corporate-events'); setNewClient(''); setNewDesc('');
    }
    setCreating(false);
  }

  async function toggleActive(ev: PortfolioEvent) {
    const res = await fetch(`/api/admin/portfolio/events/${ev.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !ev.isActive }),
    });
    if (res.ok) setEvents(prev => prev.map(e => e.id === ev.id ? { ...e, isActive: !e.isActive } : e));
  }

  async function deleteEvent(ev: PortfolioEvent) {
    if (!confirm(`Delete "${ev.title}" and all its media?`)) return;
    const res = await fetch(`/api/admin/portfolio/events/${ev.id}`, { method: 'DELETE' });
    if (res.ok) setEvents(prev => prev.filter(e => e.id !== ev.id));
  }

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

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#111', margin: 0 }}>Portfolio Events</h1>
          <p style={{ color: '#888', fontSize: '13px', margin: '4px 0 0' }}>
            {events.length} events · {events.reduce((s, e) => s + e._count.media, 0)} total media
          </p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          style={{
            padding: '10px 20px', background: '#adc905', color: '#0d1117',
            border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 700,
            cursor: 'pointer', fontFamily: "'Inter', sans-serif",
          }}
        >
          + New Event
        </button>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {[{ slug: 'all', label: 'All' }, ...CATEGORIES].map(cat => (
          <button
            key={cat.slug}
            onClick={() => setActiveTab(cat.slug)}
            style={{
              padding: '7px 14px', borderRadius: '8px', border: '1px solid',
              cursor: 'pointer', fontFamily: "'Inter', sans-serif",
              fontSize: '13px', fontWeight: 500,
              borderColor: activeTab === cat.slug ? '#adc905' : '#e5e7eb',
              background: activeTab === cat.slug ? '#adc905' : '#fff',
              color: activeTab === cat.slug ? '#0d1117' : '#555',
            }}
          >
            {cat.label}
            <span style={{ marginLeft: '5px', opacity: 0.6, fontSize: '12px' }}>
              ({countFor(cat.slug)})
            </span>
          </button>
        ))}
      </div>

      {/* Events table */}
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '14px', overflow: 'hidden' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#bbb', fontSize: '14px' }}>
            No events in this category yet. Click &quot;+ New Event&quot; to create one.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#888', letterSpacing: '1px', textTransform: 'uppercase' }}>Event</th>
                <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#888', letterSpacing: '1px', textTransform: 'uppercase' }}>Category</th>
                <th style={{ padding: '12px 20px', textAlign: 'center', fontSize: '11px', fontWeight: 700, color: '#888', letterSpacing: '1px', textTransform: 'uppercase' }}>Media</th>
                <th style={{ padding: '12px 20px', textAlign: 'center', fontSize: '11px', fontWeight: 700, color: '#888', letterSpacing: '1px', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '12px 20px', textAlign: 'right', fontSize: '11px', fontWeight: 700, color: '#888', letterSpacing: '1px', textTransform: 'uppercase' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(ev => (
                <tr key={ev.id} style={{ borderBottom: '1px solid #f9fafb' }}>
                  {/* Event info */}
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      {ev.coverImageUrl ? (
                        <img
                          src={ev.coverImageUrl}
                          alt={ev.title}
                          style={{ width: '60px', height: '44px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }}
                        />
                      ) : (
                        <div style={{
                          width: '60px', height: '44px', borderRadius: '8px',
                          background: '#f3f4f6', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', fontSize: '20px', flexShrink: 0,
                        }}>
                          📷
                        </div>
                      )}
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#111' }}>{ev.title}</div>
                        {ev.clientName && (
                          <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>{ev.clientName}</div>
                        )}
                        <div style={{ fontSize: '11px', color: '#bbb', marginTop: '2px' }}>/portfolio/{ev.slug}</div>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{
                      display: 'inline-block', padding: '3px 10px', borderRadius: '6px',
                      background: '#f3f4f6', fontSize: '12px', fontWeight: 500, color: '#555',
                    }}>
                      {catLabel(ev.category)}
                    </span>
                  </td>

                  {/* Media count */}
                  <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#111' }}>
                      {ev._count.media}
                    </span>
                    <span style={{ fontSize: '12px', color: '#aaa', marginLeft: '3px' }}>files</span>
                  </td>

                  {/* Status */}
                  <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                    <button
                      onClick={() => toggleActive(ev)}
                      style={{
                        padding: '4px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                        fontSize: '12px', fontWeight: 600, fontFamily: "'Inter', sans-serif",
                        background: ev.isActive ? '#dcfce7' : '#fee2e2',
                        color: ev.isActive ? '#166534' : '#b91c1c',
                      }}
                    >
                      {ev.isActive ? 'Live' : 'Hidden'}
                    </button>
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <Link href={`/admin/portfolio/${ev.id}`}>
                        <button style={{
                          padding: '7px 16px', borderRadius: '7px', border: 'none', cursor: 'pointer',
                          fontSize: '13px', fontWeight: 600, fontFamily: "'Inter', sans-serif",
                          background: '#eff6ff', color: '#1d4ed8',
                        }}>
                          Edit
                        </button>
                      </Link>
                      <button
                        onClick={() => deleteEvent(ev)}
                        style={{
                          padding: '7px 14px', borderRadius: '7px', border: 'none', cursor: 'pointer',
                          fontSize: '13px', fontWeight: 600, fontFamily: "'Inter', sans-serif",
                          background: '#fee2e2', color: '#b91c1c',
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* New Event Modal */}
      {showNewModal && (
        <div
          onClick={() => setShowNewModal(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999, padding: '24px',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#fff', borderRadius: '16px', padding: '32px',
              width: '100%', maxWidth: '480px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
            }}
          >
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111', margin: '0 0 24px' }}>New Portfolio Event</h2>

            <div style={{ marginBottom: '16px' }}>
              <label style={lbl}>Event Title *</label>
              <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="e.g. Annual Awards Night 2025" style={inp} />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={lbl}>Category *</label>
              <select value={newCategory} onChange={e => setNewCategory(e.target.value)} style={inp}>
                {CATEGORIES.map(c => <option key={c.slug} value={c.slug}>{c.label}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={lbl}>Client Name</label>
              <input value={newClient} onChange={e => setNewClient(e.target.value)} placeholder="e.g. Tata Consultancy Services" style={inp} />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={lbl}>Short Description</label>
              <textarea
                value={newDesc}
                onChange={e => setNewDesc(e.target.value)}
                placeholder="Brief description of this event…"
                rows={3}
                style={{ ...inp, resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={createEvent}
                disabled={!newTitle.trim() || creating}
                style={{
                  flex: 1, padding: '12px', background: '#adc905', color: '#0d1117',
                  border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 700,
                  cursor: newTitle.trim() ? 'pointer' : 'not-allowed',
                  opacity: newTitle.trim() ? 1 : 0.5,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {creating ? 'Creating…' : 'Create Event'}
              </button>
              <button
                onClick={() => setShowNewModal(false)}
                style={{
                  padding: '12px 20px', background: '#f3f4f6', color: '#555',
                  border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600,
                  cursor: 'pointer', fontFamily: "'Inter', sans-serif",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
