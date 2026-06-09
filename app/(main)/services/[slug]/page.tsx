import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '../../../../lib/prisma';
import { buildMeta } from '../../../../lib/seo';
import ServiceDetailClient from './ServiceDetailClient';

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params;
    const svc = await prisma.service.findUnique({
      where: { slug },
      select: { name: true, description: true, coverImageUrl: true },
    });
    if (!svc) return {};
    return buildMeta({
      title: `${svc.name} | Helios Event Productions`,
      description: svc.description,
      path: `/services/${slug}`,
      image: svc.coverImageUrl,
    });
  } catch {
    return {};
  }
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = await prisma.service.findUnique({ where: { slug } });
  if (!service) notFound();
  return <ServiceDetailClient service={service} />;
}
