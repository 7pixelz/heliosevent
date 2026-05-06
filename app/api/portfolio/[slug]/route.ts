import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const event = await prisma.portfolioEvent.findUnique({
    where: { slug, isActive: true },
    include: {
      media: {
        orderBy: { displayOrder: 'asc' },
        select: { id: true, type: true, url: true, displayOrder: true },
      },
    },
  });

  if (!event) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(event);
}
