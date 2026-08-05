import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { prisma } from '../../../../../lib/prisma';
import { verifyToken, COOKIE_NAME } from '../../../../../lib/auth';
import { uploadObject, getPublicUrl, removeObjects } from '../../../../../lib/storage';
import { optimizeImage } from '../../../../../lib/image';

const BUCKET_HERO = 'hero-media';

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
      await removeObjects(BUCKET_HERO, [existing.storagePath]);
      const isVideo = file.type.startsWith('video/');
      const optimized = await optimizeImage(file, { maxWidth: 2560, quality: 78 });
      const storagePath = `${Date.now()}-hero-slide.${optimized.ext}`;

      const { error } = await uploadObject(BUCKET_HERO, storagePath, optimized.body, optimized.contentType);
      if (error) return NextResponse.json({ error }, { status: 500 });

      data.type = isVideo ? 'VIDEO' : 'IMAGE';
      data.mediaUrl = getPublicUrl(BUCKET_HERO, storagePath);
      data.storagePath = storagePath;
    }

    const updated = await prisma.heroSlide.update({ where: { id }, data });
    revalidatePath('/');
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

  await removeObjects(BUCKET_HERO, [slide.storagePath]);
  await prisma.heroSlide.delete({ where: { id } });
  revalidatePath('/');
  return NextResponse.json({ success: true });
}
