import type { Metadata } from 'next';
import { prisma } from '../../../lib/prisma';
import VideosClient from './VideosClient';
import Breadcrumbs from '../../../components/Breadcrumbs';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Videos | Helios Event Productions',
  description: 'Watch Helios Event Productions in action — corporate events, entertainment, exhibitions, government events and more.',
};

export default async function VideosPage() {
  const [rawVideos, services] = await Promise.all([
    prisma.youtubeVideo.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
      select: { id: true, youtubeId: true, title: true, serviceSlug: true },
    }),
    prisma.service.findMany({
      where: { isActive: true, type: 'MAIN', NOT: { name: { contains: 'edding', mode: 'insensitive' } } },
      select: { slug: true, name: true },
      orderBy: { displayOrder: 'asc' },
    }),
  ]);

  const serviceMap = Object.fromEntries(services.map(s => [s.slug, s.name]));
  const videos = rawVideos.map(v => ({
    ...v,
    serviceName: v.serviceSlug ? (serviceMap[v.serviceSlug] ?? undefined) : undefined,
  }));

  return (
    <div style={{ background: '#0f0f0f', minHeight: '100vh', paddingTop: '90px', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <div style={{ textAlign: 'left', marginBottom: '48px' }}>
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Videos' }]} />
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: '#adc905', marginBottom: '12px', fontFamily: "'Inter', sans-serif" }}>
            Our Work
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, color: '#fff', margin: '0 0 16px', fontFamily: "'Montserrat', sans-serif" }}>
            Videos
          </h1>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.45)', margin: 0, fontFamily: "'Inter', sans-serif" }}>
            {rawVideos.length} video{rawVideos.length !== 1 ? 's' : ''} across all categories
          </p>
        </div>

        <VideosClient videos={videos} categories={services} />
      </div>
    </div>
  );
}
