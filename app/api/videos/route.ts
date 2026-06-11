import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug');
  const videos = await prisma.youtubeVideo.findMany({
    where: {
      isActive: true,
      ...(slug ? { serviceSlug: slug } : { showOnHome: true }),
    },
    orderBy: { displayOrder: 'asc' },
    select: { id: true, youtubeId: true, title: true, serviceSlug: true },
  });
  return NextResponse.json(videos);
}
