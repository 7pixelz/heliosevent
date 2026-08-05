import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { prisma } from '../../../../lib/prisma';
import { verifyToken, COOKIE_NAME } from '../../../../lib/auth';
import { uploadObject, getPublicUrl } from '../../../../lib/storage';

const BUCKET_HERO = 'hero-media';

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifyToken(token);
}

export async function GET() {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const slides = await prisma.heroSlide.findMany({ orderBy: { displayOrder: 'asc' } });
  return NextResponse.json(slides);
}

export async function POST(req: NextRequest) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const form = await req.formData();
  const file = form.get('file') as File | null;
  const title = (form.get('title') as string | null)?.trim() || null;
  const subtitle = (form.get('subtitle') as string | null)?.trim() || null;
  const ctaText = (form.get('ctaText') as string | null)?.trim() || null;
  const ctaLink = (form.get('ctaLink') as string | null)?.trim() || null;

  if (!file) return NextResponse.json({ error: 'File is required' }, { status: 400 });

  const isVideo = file.type.startsWith('video/');
  const type = isVideo ? 'VIDEO' : 'IMAGE';
  const ext = file.name.split('.').pop()?.toLowerCase() || (isVideo ? 'mp4' : 'jpg');
  const storagePath = `${Date.now()}-hero-slide.${ext}`;

  const { error: uploadError } = await uploadObject(BUCKET_HERO, storagePath, file, file.type);

  if (uploadError) return NextResponse.json({ error: uploadError }, { status: 500 });

  const publicUrl = getPublicUrl(BUCKET_HERO, storagePath);

  const max = await prisma.heroSlide.aggregate({ _max: { displayOrder: true } });
  const nextOrder = (max._max.displayOrder ?? 0) + 1;

  const slide = await prisma.heroSlide.create({
    data: { type, mediaUrl: publicUrl, storagePath, title, subtitle, ctaText, ctaLink, displayOrder: nextOrder },
  });

  revalidatePath('/');
  return NextResponse.json(slide);
}
