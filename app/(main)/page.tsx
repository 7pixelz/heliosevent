import { Suspense } from 'react';
import Hero from '../../components/sections/Hero';
import Clients from '../../components/sections/Clients';
import Portfolio from '../../components/sections/Portfolio';
import Services from '../../components/sections/Services';
import Stats from '../../components/sections/Stats';
import Testimonials from '../../components/sections/Testimonials';

import CtaBanner from '../../components/sections/CtaBanner';
import Locations from '../../components/sections/Locations';
import ContactForm from '../../components/sections/ContactForm';
import { prisma } from '../../lib/prisma';
import { getPageSeo, buildMeta } from '../../lib/seo';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo('home');
  return buildMeta({ title: seo?.metaTitle, description: seo?.metaDescription, keywords: seo?.metaKeywords, path: '/' });
}

export default async function Home() {
  const [slides, logos, mainServices] = await Promise.all([
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
  ]);

  return (
    <>
      <Hero slides={slides as never} />
      <Clients logos={logos} />
      <Suspense fallback={null}><Portfolio /></Suspense>
      <Services mainServices={mainServices} />
      <Stats />
      <Testimonials />
      {/* <Pricing /> */}
      <CtaBanner />
      <Locations />
      <ContactForm />
    </>
  );
}
