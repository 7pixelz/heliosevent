import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  const [main, activities] = await Promise.all([
    prisma.service.findMany({
      where: { isActive: true, type: 'MAIN' },
      orderBy: { displayOrder: 'asc' },
      select: { id: true, icon: true, name: true, slug: true },
    }),
    prisma.service.findMany({
      where: { isActive: true, type: 'ACTIVITY' },
      orderBy: { displayOrder: 'asc' },
      select: { id: true, icon: true, name: true, slug: true },
    }),
  ]);
  return NextResponse.json({ main, activities });
}
