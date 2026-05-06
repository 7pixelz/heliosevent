import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '../../../../../lib/prisma';
import { verifyToken, COOKIE_NAME } from '../../../../../lib/auth';

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifyToken(token);
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const events = await prisma.portfolioEvent.findMany({
    orderBy: [{ displayOrder: 'asc' }, { createdAt: 'asc' }],
    include: { _count: { select: { media: true } } },
  });

  return NextResponse.json(events);
}

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { title, category, description, clientName, slug } = body;

  if (!title || !category || !slug) {
    return NextResponse.json({ error: 'title, category, slug required' }, { status: 400 });
  }

  const maxOrder = await prisma.portfolioEvent.aggregate({ _max: { displayOrder: true } });
  const displayOrder = (maxOrder._max.displayOrder ?? 0) + 1;

  const event = await prisma.portfolioEvent.create({
    data: { title, slug, category, description: description || null, clientName: clientName || null, displayOrder },
  });

  return NextResponse.json(event, { status: 201 });
}
