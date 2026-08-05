import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '../../../../lib/prisma';
import { verifyToken, COOKIE_NAME } from '../../../../lib/auth';
import { uploadObject, getPublicUrl } from '../../../../lib/storage';

const BUCKET = 'portfolio-media';

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifyToken(token);
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const items = await prisma.portfolioItem.findMany({ orderBy: [{ category: 'asc' }, { displayOrder: 'asc' }] });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const fd = await req.formData();
  const category = (fd.get('category') as string || '').trim();
  const title = (fd.get('title') as string || '').trim() || null;
  const files = fd.getAll('files') as File[];

  if (!category) return NextResponse.json({ error: 'Category required' }, { status: 400 });
  if (!files.length) return NextResponse.json({ error: 'At least one file required' }, { status: 400 });

  const maxOrder = await prisma.portfolioItem.aggregate({ _max: { displayOrder: true }, where: { category } });
  let displayOrder = (maxOrder._max.displayOrder ?? 0) + 1;

  const created: Record<string, unknown>[] = [];
  for (const file of files) {
    if (!file.size) continue;
    const ext = file.name.split('.').pop() || 'jpg';
    const path = `${category}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await uploadObject(BUCKET, path, file, file.type);
    if (error) continue;
    const imageUrl = getPublicUrl(BUCKET, path);
    const item = await prisma.portfolioItem.create({ data: { category, title, imageUrl, storagePath: path, displayOrder } });
    created.push(item);
    displayOrder++;
  }

  return NextResponse.json(created, { status: 201 });
}
