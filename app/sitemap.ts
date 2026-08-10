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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                  lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/about`,       lastModified: now, changeFrequency: 'monthly', priority: 1.0 },
    { url: `${BASE}/contact`,     lastModified: now, changeFrequency: 'monthly', priority: 1.0 },
    { url: `${BASE}/get-quote`,   lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/portfolio`,   lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/services`,    lastModified: now, changeFrequency: 'monthly', priority: 1.0 },
    { url: `${BASE}/blog`,        lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/careers`,     lastModified: now, changeFrequency: 'monthly', priority: 1.0 },
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
