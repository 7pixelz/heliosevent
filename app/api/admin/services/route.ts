import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '../../../../lib/prisma';
import { verifyToken, COOKIE_NAME } from '../../../../lib/auth';
import { createClient } from '@supabase/supabase-js';

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifyToken(token);
}

const BUCKET = 'service-media';

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

function slugify(text: string) {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const services = await prisma.service.findMany({ orderBy: [{ type: 'asc' }, { displayOrder: 'asc' }] });
  return NextResponse.json(services);
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const fd = await req.formData();
  const name = (fd.get('name') as string || '').trim();
  const type = (fd.get('type') as string || 'MAIN').trim();
  const icon = (fd.get('icon') as string || '🎤').trim();
  const description = (fd.get('description') as string || '').trim();
  const file = fd.get('file') as File | null;

  if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });

  let slug = slugify(name);
  const conflict = await prisma.service.findUnique({ where: { slug } });
  if (conflict) slug = `${slug}-${Date.now()}`;

  const maxOrder = await prisma.service.aggregate({ _max: { displayOrder: true }, where: { type } });
  const displayOrder = (maxOrder._max.displayOrder ?? 0) + 1;

  let coverImageUrl: string | null = null;
  let storagePath: string | null = null;

  if (file && file.size > 0) {
    const sb = supabaseAdmin();
    await ensureBucket(sb);
    const ext = file.name.split('.').pop() || 'jpg';
    const path = `covers/${Date.now()}.${ext}`;
    const { error } = await sb.storage.from(BUCKET).upload(path, await file.arrayBuffer(), { contentType: file.type, upsert: true });
    if (!error) {
      storagePath = path;
      coverImageUrl = sb.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
    }
  }

  const service = await prisma.service.create({
    data: { name, slug, type, icon, description, coverImageUrl, storagePath, displayOrder },
  });

  return NextResponse.json(service, { status: 201 });
}
