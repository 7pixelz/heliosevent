import { prisma } from '../../../../lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export const revalidate = 3600;
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
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)))
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ');
}

function cleanContent(html: string) {
  return html
    .replace(/<h1(\s[^>]*)?>/gi, '<h2$1>').replace(/<\/h1>/gi, '</h2>')
    .replace(/<h2[^>]*>[\s\S]*?<\/h2>/, '')
    .replace(/<a[^>]*(?:facebook\.com\/helios|instagram\.com\/helios|linkedin\.com\/company\/helios|whatsapp\.com|wa\.me)[^>]*>[\s\S]*?<\/a>/gi, '')
    .replace(/<[^>]*class="[^"]*(?:social|share|sharedaddy)[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '')
    // Rewrite absolute heliosevent.in URLs to relative paths — prevents GA cross-domain
    // linker from appending ?_gl= junk when content links use the non-www hostname
    .replace(/href="https?:\/\/(?:www\.)?heliosevent\.in(\/[^"]*)"/gi, 'href="$1"')
    .replace(/href="https?:\/\/(?:www\.)?heliosevent\.in\/?"/gi, 'href="/"')
    // Remove target="_blank" from internal links (relative or heliosevent.in)
    .replace(/<a([^>]*href="(?:\/|https?:\/\/(?:www\.)?heliosevent\.in)[^"]*"[^>]*)\s+target="_blank"/gi, '<a$1')
    .replace(/<a([^>]*)\s+target="_blank"([^>]*href="(?:\/|https?:\/\/(?:www\.)?heliosevent\.in)[^"]*")/gi, '<a$1$2');
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

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.heliosevent.in' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://www.heliosevent.in/blog' },
      { '@type': 'ListItem', position: 3, name: decodeHtmlEntities(post.title), item: `https://www.heliosevent.in/blog/${slug}` },
    ],
  };

  return (
    <main style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {/* Hero */}
      <div style={{ position: 'relative', height: '420px', overflow: 'hidden', background: '#1a1f2e' }}>
        {post.coverImageUrl && (
          <img src={post.coverImageUrl} alt={post.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35 }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26,31,46,0.95) 0%, rgba(26,31,46,0.4) 100%)' }} />
        <div style={{ position: 'relative', maxWidth: '820px', margin: '0 auto', padding: '0 24px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: '32px' }}>
          {/* Breadcrumbs inside hero */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
            <Link href="/" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)', textDecoration: 'none', fontFamily: "'Inter',sans-serif" }}>Home</Link>
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', fontFamily: "'Inter',sans-serif" }}>›</span>
            <Link href="/blog" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)', textDecoration: 'none', fontFamily: "'Inter',sans-serif" }}>Blog</Link>
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', fontFamily: "'Inter',sans-serif" }}>›</span>
            <span style={{ fontSize: '12px', color: '#fff', fontFamily: "'Inter',sans-serif", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '340px' }}>{decodeHtmlEntities(post.title)}</span>
          </div>
          <h1 style={{ fontSize: 'clamp(24px,4vw,40px)', fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1.2, fontFamily: "'Inter',sans-serif" }}>{decodeHtmlEntities(post.title)}</h1>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '820px', margin: '0 auto', padding: '16px 24px' }}>
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
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#111', fontFamily: "'Inter',sans-serif", lineHeight: 1.4 }}>{decodeHtmlEntities(r.title)}</div>
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
