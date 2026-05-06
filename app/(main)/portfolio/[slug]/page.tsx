import type { Metadata } from 'next';
import { prisma } from '../../../../lib/prisma';
import { buildMeta } from '../../../../lib/seo';
import PortfolioEventClient from './PortfolioEventClient';

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const ev = await prisma.portfolioEvent.findUnique({
    where: { slug },
    select: { title: true, description: true, coverImageUrl: true, metaTitle: true, metaDescription: true, metaKeywords: true },
  });
  if (!ev) return {};
  return buildMeta({
    title: ev.metaTitle || `${ev.title} | Helios Event Portfolio`,
    description: ev.metaDescription || ev.description,
    keywords: ev.metaKeywords,
    path: `/portfolio/${slug}`,
    image: ev.coverImageUrl,
  });
}

export default function PortfolioEventPage() {
  return <PortfolioEventClient />;
}
