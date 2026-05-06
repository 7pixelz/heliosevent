import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '../../../../../lib/prisma';
import { verifyToken, COOKIE_NAME } from '../../../../../lib/auth';
import { supabaseAdmin, BUCKET_HERO } from '../../../../../lib/supabase-server';

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifyToken(token);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const contentType = req.headers.get('content-type') || '';

  // FormData = media file replacement + metadata
  if (contentType.includes('multipart/form-data')) {
    const form = await req.formData();
    const file = form.get('file') as File | null;
    const existing = await prisma.heroSlide.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const data: Record<string, unknown> = {
      title: (form.get('title') as string | null)?.trim() || null,
      subtitle: (form.get('subtitle') as string | null)?.trim() || null,
      ctaText: (form.get('ctaText') as string | null)?.trim() || null,
      ctaLink: (form.get('ctaLink') as string | null)?.trim() || null,
    };

    if (file) {
      await supabaseAdmin().storage.from(BUCKET_HERO).remove([existing.storagePath]);
      const isVideo = file.type.startsWith('video/');
      const ext = file.name.split('.').pop()?.toLowerCase() || (isVideo ? 'mp4' : 'jpg');
      const storagePath = `${Date.now()}-hero-slide.${ext}`;

      const { error } = await supabaseAdmin().storage
        .from(BUCKET_HERO)
        .upload(storagePath, file, { contentType: file.type, upsert: false });
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });

      const { data: urlData } = supabaseAdmin().storage.from(BUCKET_HERO).getPublicUrl(storagePath);
      data.type = isVideo ? 'VIDEO' : 'IMAGE';
      data.mediaUrl = urlData.publicUrl;
      data.storagePath = storagePath;
    }

    const updated = await prisma.heroSlide.update({ where: { id }, data });
    return NextResponse.json(updated);
  }

  // JSON = isActive / displayOrder updates
  const body = await req.json();
  const data: Record<string, unknown> = {};
  if (typeof body.isActive === 'boolean') data.isActive = body.isActive;
  if (typeof body.displayOrder === 'number') data.displayOrder = body.displayOrder;

  const updated = await prisma.heroSlide.update({ where: { id }, data });
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const slide = await prisma.heroSlide.findUnique({ where: { id } });
  if (!slide) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await supabaseAdmin().storage.from(BUCKET_HERO).remove([slide.storagePath]);
  await prisma.heroSlide.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
