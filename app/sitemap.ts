import { MetadataRoute } from 'next';
import { prisma } from '../lib/prisma';

const BASE = 'https://www.heliosevent.in';

// Service slugs that don't resolve independently — each has a pre-existing
// legacy redirect that takes precedence (see project_service_url_migration memory).
const NON_INDEPENDENT_SERVICE_SLUGS = new Set([
  'corporate-games-sports',
  'cultural-performances',
  'employee-engagement',
  'wedding-event-planner-in-chennai',
]);

export const revalidate = 3600;

// Bump a page's date here only when that page's actual content changes —
// not on every sitemap regeneration. Google treats lastmod as a signal of
// real edits; a date that moves on its own (e.g. new Date() each run) is
// misleading and can cause Google to start ignoring it.
const STATIC_LASTMOD: Record<string, string> = {
  '':           '2026-08-18',
  '/about':     '2026-08-18',
  '/contact':   '2026-08-18',
  '/get-quote': '2026-08-18',
  '/portfolio': '2026-08-18',
  '/services':  '2026-08-18',
  '/blog':      '2026-08-18',
  '/careers':   '2026-08-18',
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                  lastModified: new Date(STATIC_LASTMOD['']),           changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/about`,       lastModified: new Date(STATIC_LASTMOD['/about']),     changeFrequency: 'monthly', priority: 1.0 },
    { url: `${BASE}/contact`,     lastModified: new Date(STATIC_LASTMOD['/contact']),   changeFrequency: 'monthly', priority: 1.0 },
    { url: `${BASE}/get-quote`,   lastModified: new Date(STATIC_LASTMOD['/get-quote']), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/portfolio`,   lastModified: new Date(STATIC_LASTMOD['/portfolio']), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/services`,    lastModified: new Date(STATIC_LASTMOD['/services']),  changeFrequency: 'monthly', priority: 1.0 },
    { url: `${BASE}/blog`,        lastModified: new Date(STATIC_LASTMOD['/blog']),      changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/careers`,     lastModified: new Date(STATIC_LASTMOD['/careers']),   changeFrequency: 'monthly', priority: 1.0 },
  ];

  let servicePages: MetadataRoute.Sitemap = [];
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    });
    servicePages = services
      .filter(s => !NON_INDEPENDENT_SERVICE_SLUGS.has(s.slug))
      .map(s => ({
        url: `${BASE}/${s.slug}`,
        lastModified: s.updatedAt,
        changeFrequency: 'monthly',
        priority: 1.0,
      }));
  } catch { /* DB unavailable at build time — skip */ }

  let portfolioPages: MetadataRoute.Sitemap = [];
  try {
    const events = await prisma.portfolioEvent.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    });
    portfolioPages = events.map(e => ({
      url: `${BASE}/portfolio/${e.slug}`,
      lastModified: e.updatedAt,
      changeFrequency: 'monthly',
      priority: 1.0,
    }));
  } catch { /* skip */ }

  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const posts = await prisma.blogPost.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    });
    blogPages = posts.map(p => ({
      url: `${BASE}/blog/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: 'weekly',
      priority: 1.0,
    }));
  } catch { /* skip */ }

  return [...staticPages, ...servicePages, ...portfolioPages, ...blogPages];
}
