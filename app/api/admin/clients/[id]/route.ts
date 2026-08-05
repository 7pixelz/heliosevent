import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { prisma } from '../../../../../lib/prisma';
import { verifyToken, COOKIE_NAME } from '../../../../../lib/auth';
import { uploadObject, getPublicUrl, removeObjects } from '../../../../../lib/storage';
import { optimizeImage } from '../../../../../lib/image';

const BUCKET = 'client-logos';

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

  // FormData = image replacement + optional name update
  if (contentType.includes('multipart/form-data')) {
    const form = await req.formData();
    const file = form.get('file') as File | null;
    const name = (form.get('name') as string | null)?.trim();

    const existing = await prisma.clientLogo.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const data: Record<string, unknown> = {};
    if (name) data.name = name;

    if (file) {
      // Delete old file from storage
      await removeObjects(BUCKET, [existing.storagePath]);

      const optimized = await optimizeImage(file, { maxWidth: 300, quality: 85 });
      const storagePath = `${Date.now()}-${(name || existing.name).replace(/\s+/g, '-').toLowerCase()}.${optimized.ext}`;

      const { error: uploadError } = await uploadObject(BUCKET, storagePath, optimized.body, optimized.contentType);

      if (uploadError) return NextResponse.json({ error: uploadError }, { status: 500 });

      data.imageUrl = getPublicUrl(BUCKET, storagePath);
      data.storagePath = storagePath;
    }

    const updated = await prisma.clientLogo.update({ where: { id }, data });
    revalidatePath('/');
    return NextResponse.json(updated);
  }

  // JSON = visibility / order / name-only update
  const body = await req.json();
  const data: Record<string, unknown> = {};
  if (typeof body.isVisible === 'boolean') data.isVisible = body.isVisible;
  if (typeof body.displayOrder === 'number') data.displayOrder = body.displayOrder;
  if (typeof body.name === 'string') data.name = body.name.trim();

  const updated = await prisma.clientLogo.update({ where: { id }, data });
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const logo = await prisma.clientLogo.findUnique({ where: { id } });
  if (!logo) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await removeObjects(BUCKET, [logo.storagePath]);
  await prisma.clientLogo.delete({ where: { id } });
  revalidatePath('/');
  return NextResponse.json({ success: true });
}
