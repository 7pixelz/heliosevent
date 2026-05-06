import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '../../../../lib/prisma';
import { verifyToken, COOKIE_NAME } from '../../../../lib/auth';

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifyToken(token);
}

// GET /api/admin/seo?type=pages|services|portfolio|blog
export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const type = new URL(req.url).searchParams.get('type') || 'pages';

  if (type === 'pages') {
    const pages = await prisma.pageSeo.findMany({ orderBy: { createdAt: 'asc' } });
    return NextResponse.json(pages);
  }
  if (type === 'services') {
    const services = await prisma.service.findMany({
      where: { type: 'MAIN' },
      orderBy: { displayOrder: 'asc' },
      select: { id: true, name: true, slug: true, icon: true, metaTitle: true, metaDescription: true, metaKeywords: true },
    });
    return NextResponse.json(services);
  }
  if (type === 'portfolio') {
    const events = await prisma.portfolioEvent.findMany({
      orderBy: { displayOrder: 'asc' },
      select: { id: true, title: true, slug: true, category: true, metaTitle: true, metaDescription: true, metaKeywords: true },
    });
    return NextResponse.json(events);
  }
  if (type === 'blog') {
    const posts = await prisma.blogPost.findMany({
      orderBy: { publishedAt: 'desc' },
      select: { id: true, title: true, slug: true, isPublished: true, metaTitle: true, metaDescription: true, metaKeywords: true },
    });
    return NextResponse.json(posts);
  }

  return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
}

// PATCH /api/admin/seo  body: { type, id, metaTitle, metaDescription, metaKeywords }
export async function PATCH(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { type, id, metaTitle, metaDescription, metaKeywords } = await req.json();
  const data = {
    metaTitle: metaTitle || null,
    metaDescription: metaDescription || null,
    metaKeywords: metaKeywords || null,
  };

  if (type === 'pages') {
    const updated = await prisma.pageSeo.update({ where: { id }, data: { ...data, updatedAt: new Date() } });
    return NextResponse.json(updated);
  }
  if (type === 'services') {
    const updated = await prisma.service.update({ where: { id }, data: { ...data, updatedAt: new Date() } });
    return NextResponse.json(updated);
  }
  if (type === 'portfolio') {
    const updated = await prisma.portfolioEvent.update({ where: { id }, data: { ...data, updatedAt: new Date() } });
    return NextResponse.json(updated);
  }
  if (type === 'blog') {
    const updated = await prisma.blogPost.update({ where: { id }, data: { ...data, updatedAt: new Date() } });
    return NextResponse.json(updated);
  }

  return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
}
