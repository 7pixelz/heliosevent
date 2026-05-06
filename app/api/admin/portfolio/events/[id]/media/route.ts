import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '../../../../../../../lib/prisma';
import { verifyToken, COOKIE_NAME } from '../../../../../../../lib/auth';
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

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id: eventId } = await params;

  const event = await prisma.portfolioEvent.findUnique({ where: { id: eventId } });
  if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 });

  const contentType = req.headers.get('content-type') || '';

  // Adding a video URL
  if (contentType.includes('application/json')) {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: 'url required' }, { status: 400 });

    const maxOrder = await prisma.portfolioMedia.aggregate({ _max: { displayOrder: true }, where: { eventId } });
    const media = await prisma.portfolioMedia.create({
      data: { eventId, type: 'VIDEO', url, displayOrder: (maxOrder._max.displayOrder ?? 0) + 1 },
    });
    return NextResponse.json(media, { status: 201 });
  }

  // Uploading image files
  const fd = await req.formData();
  const files = fd.getAll('files') as File[];
  if (!files.length) return NextResponse.json({ error: 'No files' }, { status: 400 });

  const sb = supabaseAdmin();
  await ensureBucket(sb);

  const maxOrder = await prisma.portfolioMedia.aggregate({ _max: { displayOrder: true }, where: { eventId } });
  let displayOrder = (maxOrder._max.displayOrder ?? 0) + 1;

  const created = [];
  for (const file of files) {
    if (!file.size) continue;
    const ext = file.name.split('.').pop() || 'jpg';
    const path = `events/${eventId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await sb.storage.from(BUCKET).upload(path, await file.arrayBuffer(), { contentType: file.type, upsert: true });
    if (error) continue;
    const url = sb.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
    const media = await prisma.portfolioMedia.create({ data: { eventId, type: 'IMAGE', url, storagePath: path, displayOrder } });
    created.push(media);
    displayOrder++;
  }

  // Auto-set cover if event has none
  if (created.length && !event.coverImageUrl) {
    await prisma.portfolioEvent.update({ where: { id: eventId }, data: { coverImageUrl: created[0].url } });
  }

  return NextResponse.json(created, { status: 201 });
}
