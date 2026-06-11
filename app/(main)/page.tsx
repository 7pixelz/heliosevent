export const revalidate = 300;

import Hero from '../../components/sections/Hero';
import Clients from '../../components/sections/Clients';
import Portfolio from '../../components/sections/Portfolio';
import Services from '../../components/sections/Services';
import Stats from '../../components/sections/Stats';
import Testimonials from '../../components/sections/Testimonials';

import CtaBanner from '../../components/sections/CtaBanner';
import Locations from '../../components/sections/LocationsClient';
import LeadForm from '../../components/sections/LeadForm';
import VideoGrid from '../../components/sections/VideoGrid';
import { prisma } from '../../lib/prisma';
import { getPageSeo, buildMeta } from '../../lib/seo';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo('home');
  return buildMeta({ title: seo?.metaTitle, description: seo?.metaDescription, keywords: seo?.metaKeywords, path: '/' });
}

export default async function Home() {
  let slides: { id: string; type: string; mediaUrl: string; title: string | null; subtitle: string | null; ctaText: string | null; ctaLink: string | null }[] = [];
  let logos: { id: string; name: string; imageUrl: string }[] = [];
  let mainServices: { id: string; icon: string; name: string; slug: string; description: string }[] = [];
  let portfolioEvents: { id: string; title: string; slug: string; category: string; clientName: string | null; coverImageUrl: string | null }[] = [];
  let homeVideos: { id: string; youtubeId: string; title: string }[] = [];

  try {
    [slides, logos, mainServices, portfolioEvents, homeVideos] = await Promise.all([
      prisma.heroSlide.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: 'asc' },
        select: { id: true, type: true, mediaUrl: true, title: true, subtitle: true, ctaText: true, ctaLink: true },
      }),
      prisma.clientLogo.findMany({
        where: { isVisible: true },
        orderBy: { displayOrder: 'asc' },
        select: { id: true, name: true, imageUrl: true },
      }),
      prisma.service.findMany({
        where: { isActive: true, type: 'MAIN' },
        orderBy: { displayOrder: 'asc' },
        select: { id: true, icon: true, name: true, slug: true, description: true },
      }),
      prisma.portfolioEvent.findMany({
        where: { isActive: true, NOT: { coverImageUrl: null } },
        orderBy: { displayOrder: 'asc' },
        take: 4,
        select: { id: true, title: true, slug: true, category: true, clientName: true, coverImageUrl: true },
      }),
      prisma.youtubeVideo.findMany({
        where: { isActive: true, showOnHome: true },
        orderBy: { displayOrder: 'asc' },
        take: 8,
        select: { id: true, youtubeId: true, title: true },
      }),
    ]);
  } catch {
    // DB unavailable — components use their own fallback data
  }

  return (
    <>
      <Hero slides={slides as never} />
      <Clients logos={logos} />
      <Portfolio events={portfolioEvents} />
      <Services mainServices={mainServices} />
      <Stats />
      <Testimonials />
      <VideoGrid videos={homeVideos} showViewAll />
      {/* <Pricing /> */}
      <CtaBanner />
      <Locations />
      <LeadForm />
    </>
  );
}
