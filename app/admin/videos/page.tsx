import { prisma } from '../../../lib/prisma';
import VideoAdminClient from './VideoAdminClient';

export const dynamic = 'force-dynamic';

export default async function AdminVideosPage() {
  const [videos, services] = await Promise.all([
    prisma.youtubeVideo.findMany({ orderBy: { displayOrder: 'asc' } }),
    prisma.service.findMany({
      where: { isActive: true, type: 'MAIN', NOT: { name: { contains: 'edding', mode: 'insensitive' } } },
      select: { id: true, name: true, slug: true },
      orderBy: { displayOrder: 'asc' },
    }),
  ]);
  return <VideoAdminClient videos={videos as never} services={services} />;
}
