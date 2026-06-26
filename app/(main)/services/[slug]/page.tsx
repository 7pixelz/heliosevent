import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { prisma } from '../../../../lib/prisma';
import { buildMeta } from '../../../../lib/seo';
import ServiceDetailClient from './ServiceDetailClient';

export const revalidate = 3600;

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params;
    const svc = await prisma.service.findUnique({
      where: { slug },
      select: { name: true, description: true, coverImageUrl: true, metaTitle: true, metaDescription: true, metaKeywords: true },
    });
    if (!svc) return {};
    return buildMeta({
      title: svc.metaTitle || `${svc.name} | Helios Event Productions`,
      description: svc.metaDescription || svc.description,
      keywords: svc.metaKeywords,
      path: `/services/${slug}`,
      image: svc.coverImageUrl,
    });
  } catch {
    return {};
  }
}

const BASE_URL = 'https://www.heliosevent.in';

const SERVICE_SCHEMA: Record<string, object> = {
  'corporate-event-management-in-chennai': {
    '@context': 'https://schema.org/',
    '@type': 'Article',
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE_URL}/services/corporate-event-management-in-chennai` },
    headline: 'Corporate Event Management Company in Chennai',
    description: 'Looking for corporate event organisers? Helios Event provide complete corporate event planning services for product launches, conferences, and business events.',
    image: { '@type': 'ImageObject', url: '', width: '', height: '' },
    author: { '@type': 'Organization', name: 'Heliosevent' },
    publisher: { '@type': 'Organization', name: 'Heliosevent', logo: { '@type': 'ImageObject', url: '', width: '', height: '' } },
    datePublished: '2026-06-11',
  },
  'government-events-planner-in-chennai': {
    '@context': 'https://schema.org/',
    '@type': 'BlogPosting',
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE_URL}/services/government-events-planner-in-chennai` },
    headline: 'Government & Protocol Events Management Company in Chennai',
    description: 'Helios Event is a leading government event management company in India offering professional protocol management, official ceremony planning, VIP coordination, and government summit organizing services.',
    image: { '@type': 'ImageObject', url: '', width: '', height: '' },
    author: { '@type': 'Organization', name: 'Heliosevent' },
    publisher: { '@type': 'Organization', name: 'Heliosevent', logo: { '@type': 'ImageObject', url: '', width: '', height: '' } },
    datePublished: '2026-06-11',
    dateModified: '2026-06-11',
  },
  'sports-event-management-company-in-chennai': {
    '@context': 'https://schema.org/',
    '@type': 'BlogPosting',
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE_URL}/services/sports-event-management-company-in-chennai` },
    headline: 'Sports Events Management in Chennai',
    description: 'Choose a professional sports event management company in Chennai for strategic planning, event coordination, sponsorship management, and successful sporting event execution.',
    image: { '@type': 'ImageObject', url: '', width: '', height: '' },
    author: { '@type': 'Organization', name: 'HelioEvents' },
    publisher: { '@type': 'Organization', name: 'HelioEvents', logo: { '@type': 'ImageObject', url: '', width: '', height: '' } },
    datePublished: '2026-06-11',
    dateModified: '2026-06-11',
  },
};

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const [service, videos, logos] = await Promise.all([
    prisma.service.findUnique({ where: { slug } }),
    prisma.youtubeVideo.findMany({
      where: { isActive: true, serviceSlug: slug },
      orderBy: { displayOrder: 'asc' },
      select: { id: true, youtubeId: true, title: true },
    }),
    prisma.clientLogo.findMany({
      where: { isVisible: true },
      orderBy: { displayOrder: 'asc' },
      select: { id: true, name: true, imageUrl: true },
    }),
  ]);
  if (!service) notFound();

  let portfolioEvents: { id: string; title: string; slug: string; clientName: string | null; coverImageUrl: string | null; category: string }[] = [];
  try {
    const ids: string[] = JSON.parse(service.linkedPortfolioIds || '[]');
    if (ids.length > 0) {
      portfolioEvents = await prisma.portfolioEvent.findMany({
        where: { id: { in: ids }, isActive: true },
        select: { id: true, title: true, slug: true, clientName: true, coverImageUrl: true, category: true },
      });
      portfolioEvents.sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));
    }
  } catch { /* ignore parse errors */ }

  const jsonLd = SERVICE_SCHEMA[slug];

  return (
    <>
      {jsonLd && (
        <Script
          id="service-json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ServiceDetailClient service={service} videos={videos} portfolioEvents={portfolioEvents} logos={logos} />
    </>
  );
}
