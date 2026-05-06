import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '../../../../lib/prisma';
import { verifyToken, COOKIE_NAME } from '../../../../lib/auth';
import { supabaseAdmin, ensureBucket, BUCKET_HERO } from '../../../../lib/supabase-server';

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

  await ensureBucket(BUCKET_HERO);

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

  const sb = supabaseAdmin();
  const { error: uploadError } = await sb.storage
    .from(BUCKET_HERO)
    .upload(storagePath, file, { contentType: file.type, upsert: false });

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

  const { data: urlData } = sb.storage.from(BUCKET_HERO).getPublicUrl(storagePath);

  const max = await prisma.heroSlide.aggregate({ _max: { displayOrder: true } });
  const nextOrder = (max._max.displayOrder ?? 0) + 1;

  const slide = await prisma.heroSlide.create({
    data: { type, mediaUrl: urlData.publicUrl, storagePath, title, subtitle, ctaText, ctaLink, displayOrder: nextOrder },
  });

  return NextResponse.json(slide);
}
