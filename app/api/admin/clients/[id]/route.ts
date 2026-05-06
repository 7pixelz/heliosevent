import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '../../../../../lib/prisma';
import { verifyToken, COOKIE_NAME } from '../../../../../lib/auth';
import { supabaseAdmin, BUCKET_CLIENTS as BUCKET } from '../../../../../lib/supabase-server';

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
      await supabaseAdmin().storage.from(BUCKET).remove([existing.storagePath]);

      const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
      const storagePath = `${Date.now()}-${(name || existing.name).replace(/\s+/g, '-').toLowerCase()}.${ext}`;

      const { error: uploadError } = await supabaseAdmin().storage
        .from(BUCKET)
        .upload(storagePath, file, { contentType: file.type, upsert: false });

      if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

      const { data: urlData } = supabaseAdmin().storage.from(BUCKET).getPublicUrl(storagePath);
      data.imageUrl = urlData.publicUrl;
      data.storagePath = storagePath;
    }

    const updated = await prisma.clientLogo.update({ where: { id }, data });
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

  await supabaseAdmin().storage.from(BUCKET).remove([logo.storagePath]);
  await prisma.clientLogo.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
