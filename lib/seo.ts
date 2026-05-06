import type { Metadata } from 'next';
import { prisma } from './prisma';

const SITE = 'Helios Event Productions';
const BASE_URL = 'https://www.heliosevent.in';

export function buildMeta({
  title,
  description,
  keywords,
  path = '',
  image,
}: {
  title?: string | null;
  description?: string | null;
  keywords?: string | null;
  path?: string;
  image?: string | null;
}): Metadata {
  const t = title || SITE;
  const d = description || 'Leading event management company in Chennai — corporate events, MICE, exhibitions, weddings and more.';
  const url = `${BASE_URL}${path}`;

  return {
    title: t,
    description: d,
    keywords: keywords || undefined,
    alternates: { canonical: url },
    openGraph: {
      title: t,
      description: d,
      url,
      siteName: SITE,
      type: 'website',
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: t,
      description: d,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export async function getPageSeo(pageKey: string): Promise<{ metaTitle: string | null; metaDescription: string | null; metaKeywords: string | null } | null> {
  try {
    return await prisma.pageSeo.findUnique({
      where: { pageKey },
      select: { metaTitle: true, metaDescription: true, metaKeywords: true },
    });
  } catch {
    return null;
  }
}
