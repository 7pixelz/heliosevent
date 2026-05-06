import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');

  const events = await prisma.portfolioEvent.findMany({
    where: {
      isActive: true,
      ...(category && category !== 'all' ? { category } : {}),
    },
    orderBy: [{ displayOrder: 'asc' }, { createdAt: 'asc' }],
    select: {
      id: true,
      title: true,
      slug: true,
      category: true,
      clientName: true,
      coverImageUrl: true,
      description: true,
      _count: { select: { media: true } },
    },
  });

  return NextResponse.json(events);
}
