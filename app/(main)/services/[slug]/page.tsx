import type { Metadata } from 'next';
import { prisma } from '../../../../lib/prisma';
import { buildMeta } from '../../../../lib/seo';
import ServiceDetailClient from './ServiceDetailClient';

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
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
}

export default function ServiceDetailPage() {
  return <ServiceDetailClient />;
}
