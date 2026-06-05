import { MetadataRoute } from 'next';
import { prisma } from '../lib/prisma';

const BASE = 'https://www.heliosevent.in';

const CHENNAI_SLUGS = [
  'event-planner-in-taramani',
  'event-management-in-omr',
  'event-management-in-oragadam',
  'event-management-in-vallam-chengalpattu',
  'event-management-in-sriperumbudur',
  'event-management-in-ambattur',
  'event-management-in-ekkatuthangal',
  'event-management-in-guindy',
  'event-management-in-sri-city',
  'event-management-in-siruseri',
  'event-management-in-porur',
  'event-planner-in-anna-salai',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                        lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/about`,             lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/contact`,           lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/get-quote`,         lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/portfolio`,         lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/services`,          lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/blog`,              lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE}/careers`,           lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/corporate-events`,  lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
  ];

  // Chennai location pages
  const chennaiPages: MetadataRoute.Sitemap = CHENNAI_SLUGS.map(slug => ({
    url: `${BASE}/chennai/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  // Dynamic: services
  let servicePages: MetadataRoute.Sitemap = [];
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    });
    servicePages = services.map(s => ({
      url: `${BASE}/services/${s.slug}`,
      lastModified: s.updatedAt,
      changeFrequency: 'monthly',
      priority: 0.7,
    }));
  } catch { /* DB unavailable at build time — skip */ }

  // Dynamic: portfolio events
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
      priority: 0.6,
    }));
  } catch { /* skip */ }

  // Dynamic: blog posts
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
      priority: 0.6,
    }));
  } catch { /* skip */ }

  return [...staticPages, ...chennaiPages, ...servicePages, ...portfolioPages, ...blogPages];
}
