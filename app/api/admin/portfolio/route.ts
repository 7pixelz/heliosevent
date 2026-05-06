import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '../../../../lib/prisma';
import { verifyToken, COOKIE_NAME } from '../../../../lib/auth';
import { createClient } from '@supabase/supabase-js';

const BUCKET = 'portfolio-media';

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifyToken(token);
}

function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

async function ensureBucket(sb: ReturnType<typeof supabaseAdmin>) {
  const { data } = await sb.storage.listBuckets();
  if (!data?.find(b => b.name === BUCKET)) {
    await sb.storage.createBucket(BUCKET, { public: true });
  }
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

  const sb = supabaseAdmin();
  await ensureBucket(sb);

  const maxOrder = await prisma.portfolioItem.aggregate({ _max: { displayOrder: true }, where: { category } });
  let displayOrder = (maxOrder._max.displayOrder ?? 0) + 1;

  const created: { url: string }[] = [];
  for (const file of files) {
    if (!file.size) continue;
    const ext = file.name.split('.').pop() || 'jpg';
    const path = `${category}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await sb.storage.from(BUCKET).upload(path, await file.arrayBuffer(), { contentType: file.type, upsert: true });
    if (error) continue;
    const imageUrl = sb.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
    const item = await prisma.portfolioItem.create({ data: { category, title, imageUrl, storagePath: path, displayOrder } });
    created.push(item);
    displayOrder++;
  }

  return NextResponse.json(created, { status: 201 });
}
