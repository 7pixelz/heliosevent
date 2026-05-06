import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '../../../../../../lib/prisma';
import { verifyToken, COOKIE_NAME } from '../../../../../../lib/auth';
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

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const event = await prisma.portfolioEvent.findUnique({
    where: { id },
    include: { media: { orderBy: { displayOrder: 'asc' } } },
  });
  if (!event) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(event);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;

  const contentType = req.headers.get('content-type') || '';

  if (contentType.includes('multipart/form-data')) {
    const fd = await req.formData();
    const file = fd.get('coverImage') as File | null;

    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    const title = fd.get('title') as string;
    const description = fd.get('description') as string;
    const clientName = fd.get('clientName') as string;
    const category = fd.get('category') as string;

    if (title) updateData.title = title;
    if (description !== null) updateData.description = description || null;
    if (clientName !== null) updateData.clientName = clientName || null;
    if (category) updateData.category = category;

    if (file && file.size > 0) {
      const sb = supabaseAdmin();
      const ext = file.name.split('.').pop() || 'jpg';
      const path = `covers/${id}-${Date.now()}.${ext}`;
      await sb.storage.from(BUCKET).upload(path, await file.arrayBuffer(), { contentType: file.type, upsert: true });
      updateData.coverImageUrl = sb.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
    }

    const event = await prisma.portfolioEvent.update({ where: { id }, data: updateData });
    return NextResponse.json(event);
  }

  const body = await req.json();
  const event = await prisma.portfolioEvent.update({ where: { id }, data: { ...body, updatedAt: new Date() } });
  return NextResponse.json(event);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;

  const media = await prisma.portfolioMedia.findMany({ where: { eventId: id } });
  const paths = media.filter(m => m.storagePath).map(m => m.storagePath!);
  if (paths.length) await supabaseAdmin().storage.from(BUCKET).remove(paths);

  await prisma.portfolioEvent.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
