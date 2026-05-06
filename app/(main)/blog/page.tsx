import { prisma } from '../../../lib/prisma';
import Link from 'next/link';
import type { Metadata } from 'next';

import { getPageSeo, buildMeta } from '../../../lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo('blog');
  return buildMeta({ title: seo?.metaTitle, description: seo?.metaDescription, keywords: seo?.metaKeywords, path: '/blog' });
}

export const dynamic = 'force-dynamic';

const PER_PAGE = 12;

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam || '1', 10));
  const skip = (page - 1) * PER_PAGE;

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: 'desc' },
      skip,
      take: PER_PAGE,
      select: { id: true, title: true, slug: true, excerpt: true, coverImageUrl: true, category: true, publishedAt: true },
    }),
    prisma.blogPost.count({ where: { isPublished: true } }),
  ]);

  const totalPages = Math.ceil(total / PER_PAGE);

  // Build page numbers to show: always first, last, current ±2, with ellipsis
  function pageNumbers(): (number | '…')[] {
    const pages: (number | '…')[] = [];
    const range = new Set<number>();
    [1, totalPages].forEach(p => range.add(p));
    for (let i = Math.max(1, page - 2); i <= Math.min(totalPages, page + 2); i++) range.add(i);
    const sorted = Array.from(range).sort((a, b) => a - b);
    sorted.forEach((p, i) => {
      if (i > 0 && p - (sorted[i - 1] as number) > 1) pages.push('…');
      pages.push(p);
    });
    return pages;
  }

  return (
    <main style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      {/* Hero banner */}
      <section style={{ background: '#1a1f2e', paddingTop: '100px', padding: '100px 24px 60px', textAlign: 'center' }}>
        <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: '#adc905', fontFamily: "'Inter',sans-serif", marginBottom: '12px' }}>
          Helios Event
        </p>
        <h1 style={{ fontSize: 'clamp(32px,5vw,52px)', fontWeight: 900, color: '#fff', margin: '0 0 16px', fontFamily: "'Inter',sans-serif", lineHeight: 1.1 }}>
          Event Planning <span style={{ color: '#adc905' }}>Insights</span>
        </h1>
        <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.6)', fontFamily: "'Inter',sans-serif", maxWidth: '480px', margin: '0 auto' }}>
          Tips, ideas and inspiration for corporate events, team building, and more.
        </p>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', fontFamily: "'Inter',sans-serif", marginTop: '12px' }}>
          {total} articles
        </p>
      </section>

      {/* Grid */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '56px 24px 40px' }}>
        {posts.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#999', fontFamily: "'Inter',sans-serif", fontSize: '15px', padding: '60px 0' }}>
            No posts published yet.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '28px' }}>
            {posts.map((post: { id: string; title: string; slug: string; excerpt?: string | null; coverImageUrl?: string | null; category?: string | null; publishedAt?: Date | null }) => (
              <Link key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                <article className="blog-card">
                  <div style={{ height: '200px', background: '#e5e7eb', overflow: 'hidden' }}>
                    {post.coverImageUrl
                      ? <img src={post.coverImageUrl} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a1f2e' }}>
                          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5">
                            <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                          </svg>
                        </div>
                    }
                  </div>
                  <div style={{ padding: '20px 22px 24px' }}>
                    {post.category && (
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#ff6a00', letterSpacing: '1px', textTransform: 'uppercase', fontFamily: "'Inter',sans-serif" }}>
                        {post.category}
                      </span>
                    )}
                    <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#111', margin: '8px 0 10px', lineHeight: 1.35, fontFamily: "'Inter',sans-serif" }}>
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.6, fontFamily: "'Inter',sans-serif", margin: '0 0 14px' }}>
                        {post.excerpt.slice(0, 130)}{post.excerpt.length > 130 ? '…' : ''}
                      </p>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#ff6a00', fontFamily: "'Inter',sans-serif" }}>Read More →</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 72px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', flexWrap: 'wrap' }}>
          {/* Prev */}
          {page > 1 ? (
            <Link href={`/blog?page=${page - 1}`} style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              padding: '9px 18px', borderRadius: '8px', textDecoration: 'none',
              background: '#fff', border: '1px solid #e5e7eb',
              fontSize: '13px', fontWeight: 600, color: '#555',
              fontFamily: "'Inter',sans-serif",
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}>
              ← Prev
            </Link>
          ) : (
            <span style={{
              padding: '9px 18px', borderRadius: '8px',
              background: '#f3f4f6', border: '1px solid #e5e7eb',
              fontSize: '13px', fontWeight: 600, color: '#ccc',
              fontFamily: "'Inter',sans-serif",
            }}>
              ← Prev
            </span>
          )}

          {/* Page numbers */}
          {pageNumbers().map((p, i) =>
            p === '…' ? (
              <span key={`ellipsis-${i}`} style={{ padding: '9px 6px', color: '#aaa', fontSize: '13px', fontFamily: "'Inter',sans-serif" }}>…</span>
            ) : (
              <Link
                key={p}
                href={`/blog?page=${p}`}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '38px', height: '38px', borderRadius: '8px', textDecoration: 'none',
                  background: p === page ? '#adc905' : '#fff',
                  border: `1px solid ${p === page ? '#adc905' : '#e5e7eb'}`,
                  fontSize: '13px', fontWeight: 700,
                  color: p === page ? '#0d1117' : '#555',
                  fontFamily: "'Inter',sans-serif",
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                }}
              >
                {p}
              </Link>
            )
          )}

          {/* Next */}
          {page < totalPages ? (
            <Link href={`/blog?page=${page + 1}`} style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              padding: '9px 18px', borderRadius: '8px', textDecoration: 'none',
              background: '#fff', border: '1px solid #e5e7eb',
              fontSize: '13px', fontWeight: 600, color: '#555',
              fontFamily: "'Inter',sans-serif",
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}>
              Next →
            </Link>
          ) : (
            <span style={{
              padding: '9px 18px', borderRadius: '8px',
              background: '#f3f4f6', border: '1px solid #e5e7eb',
              fontSize: '13px', fontWeight: 600, color: '#ccc',
              fontFamily: "'Inter',sans-serif",
            }}>
              Next →
            </span>
          )}
        </div>
      )}

      {/* Page info */}
      {totalPages > 1 && (
        <p style={{ textAlign: 'center', color: '#bbb', fontSize: '12px', fontFamily: "'Inter',sans-serif", paddingBottom: '40px', marginTop: '-40px' }}>
          Page {page} of {totalPages} · {total} articles
        </p>
      )}
    </main>
  );
}
