import { prisma } from '../../../../lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    select: { title: true, excerpt: true, coverImageUrl: true, metaTitle: true, metaDescription: true, metaKeywords: true },
  });
  if (!post) return {};
  const { buildMeta } = await import('../../../../lib/seo');
  return buildMeta({
    title: post.metaTitle || `${post.title} | Helios Event Blog`,
    description: post.metaDescription || post.excerpt,
    keywords: post.metaKeywords,
    path: `/blog/${slug}`,
    image: post.coverImageUrl,
  });
}

function decodeHtmlEntities(str: string) {
  return str
    .replace(/&#0*38;/g, '&')
    .replace(/&amp;/g, '&')
    .replace(/&#0*60;/g, '<')
    .replace(/&#0*62;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0*39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

function cleanContent(html: string) {
  return html
    .replace(/<h1(\s[^>]*)?>/gi, '<h2$1>').replace(/<\/h1>/gi, '</h2>')
    .replace(/<a[^>]*(?:facebook\.com\/helios|instagram\.com\/helios|linkedin\.com\/company\/helios|whatsapp\.com|wa\.me)[^>]*>[\s\S]*?<\/a>/gi, '')
    .replace(/<[^>]*class="[^"]*(?:social|share|sharedaddy)[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '');
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post || !post.isPublished) notFound();

  const related = await prisma.blogPost.findMany({
    where: { isPublished: true, category: post.category || undefined, NOT: { id: post.id } },
    orderBy: { publishedAt: 'desc' },
    take: 3,
    select: { title: true, slug: true, coverImageUrl: true, publishedAt: true },
  });

  return (
    <main style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{ position: 'relative', height: '360px', overflow: 'hidden', background: '#1a1f2e' }}>
        {post.coverImageUrl && (
          <img src={post.coverImageUrl} alt={post.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35 }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26,31,46,0.95) 0%, rgba(26,31,46,0.4) 100%)' }} />
        <div style={{ position: 'relative', maxWidth: '820px', margin: '0 auto', padding: '0 24px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: '48px' }}>
          {post.category && <span style={{ fontSize: '11px', fontWeight: 700, color: '#ff6a00', letterSpacing: '2px', textTransform: 'uppercase', fontFamily: "'Inter',sans-serif", marginBottom: '12px' }}>{post.category}</span>}
          <h1 style={{ fontSize: 'clamp(24px,4vw,40px)', fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1.2, fontFamily: "'Inter',sans-serif" }}>{decodeHtmlEntities(post.title)}</h1>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '820px', margin: '0 auto', padding: '48px 24px' }}>
        <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: '#888', textDecoration: 'none', fontFamily: "'Inter',sans-serif", marginBottom: '32px' }}>
          ← Back to Blog
        </Link>
        <div
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: cleanContent(post.content) }}
          style={{ fontFamily: "'Inter',sans-serif", fontSize: '16px', lineHeight: 1.8, color: '#333' }}
        />

        {/* Related posts */}
        {related.length > 0 && (
          <div style={{ marginTop: '60px', paddingTop: '40px', borderTop: '1px solid #e5e7eb' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#111', marginBottom: '20px', fontFamily: "'Inter',sans-serif" }}>Related Posts</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
              {related.map((r: { slug: string; title: string; coverImageUrl?: string | null; category?: string | null; publishedAt?: Date | string | null }) => (
                <Link key={r.slug} href={`/blog/${r.slug}`} style={{ textDecoration: 'none' }}>
                  <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                    {r.coverImageUrl
                      ? <img src={r.coverImageUrl} alt={r.title} style={{ width: '100%', height: '120px', objectFit: 'cover', display: 'block' }} />
                      : <div style={{ width: '100%', height: '120px', background: '#e5e7eb' }} />
                    }
                    <div style={{ padding: '12px 14px' }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#111', fontFamily: "'Inter',sans-serif", lineHeight: 1.4 }}>{r.title}</div>
                      <div style={{ fontSize: '11px', color: '#ff6a00', marginTop: '4px', fontFamily: "'Inter',sans-serif", fontWeight: 700 }}>Read More →</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
