import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { prisma } from '../../../../lib/prisma';
import { verifyToken, COOKIE_NAME } from '../../../../lib/auth';
import { uploadObject, getPublicUrl } from '../../../../lib/storage';
import { optimizeImage } from '../../../../lib/image';

const BUCKET = 'client-logos';

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifyToken(token);
}

export async function GET() {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const logos = await prisma.clientLogo.findMany({ orderBy: { displayOrder: 'asc' } });
  return NextResponse.json(logos);
}

export async function POST(req: NextRequest) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const form = await req.formData();
  const file = form.get('file') as File | null;
  const name = (form.get('name') as string | null)?.trim();

  if (!file || !name) {
    return NextResponse.json({ error: 'File and name are required' }, { status: 400 });
  }

  const optimized = await optimizeImage(file, { maxWidth: 300, quality: 85 });
  const storagePath = `${Date.now()}-${name.replace(/\s+/g, '-').toLowerCase()}.${optimized.ext}`;

  const { error: uploadError } = await uploadObject(BUCKET, storagePath, optimized.body, optimized.contentType);

  if (uploadError) {
    return NextResponse.json({ error: uploadError }, { status: 500 });
  }

  const publicUrl = getPublicUrl(BUCKET, storagePath);

  const max = await prisma.clientLogo.aggregate({ _max: { displayOrder: true } });
  const nextOrder = (max._max.displayOrder ?? 0) + 1;

  const logo = await prisma.clientLogo.create({
    data: { name, imageUrl: publicUrl, storagePath, displayOrder: nextOrder },
  });

  revalidatePath('/');
  return NextResponse.json(logo);
}
