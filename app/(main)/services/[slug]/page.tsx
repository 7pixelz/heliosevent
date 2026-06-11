import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
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

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const [service, videos] = await Promise.all([
    prisma.service.findUnique({ where: { slug } }),
    prisma.youtubeVideo.findMany({
      where: { isActive: true, serviceSlug: slug },
      orderBy: { displayOrder: 'asc' },
      select: { id: true, youtubeId: true, title: true },
    }),
  ]);
  if (!service) notFound();

  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/services/${slug}`,
    },
    headline: service.metaTitle || service.name,
    description: service.metaDescription || service.description,
    image: service.coverImageUrl ? {
      '@type': 'ImageObject',
      url: service.coverImageUrl,
    } : undefined,
    author: {
      '@type': 'Organization',
      name: 'Helios Event Productions',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Helios Event Productions',
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/assets/heliosevent_logo_white.webp`,
      },
    },
    datePublished: service.createdAt.toISOString().split('T')[0],
    dateModified: service.updatedAt.toISOString().split('T')[0],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ServiceDetailClient service={service} videos={videos} />
    </>
  );
}
