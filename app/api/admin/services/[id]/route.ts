import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '../../../../../lib/prisma';
import { verifyToken, COOKIE_NAME } from '../../../../../lib/auth';
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

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;

  const existing = await prisma.service.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const ct = req.headers.get('content-type') || '';

  if (ct.includes('multipart/form-data')) {
    const fd = await req.formData();
    const file = fd.get('file') as File | null;

    let coverImageUrl = existing.coverImageUrl;
    let storagePath = existing.storagePath;

    if (file && file.size > 0) {
      const sb = supabaseAdmin();
      if (existing.storagePath) await sb.storage.from(BUCKET).remove([existing.storagePath]);
      const ext = file.name.split('.').pop() || 'jpg';
      const path = `covers/${Date.now()}.${ext}`;
      const { error } = await sb.storage.from(BUCKET).upload(path, await file.arrayBuffer(), { contentType: file.type, upsert: true });
      if (!error) {
        storagePath = path;
        coverImageUrl = supabaseAdmin().storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
      }
    }

    const getString = (key: string) => (fd.get(key) as string | null)?.trim() || null;

    const service = await prisma.service.update({
      where: { id },
      data: {
        name: getString('name') || existing.name,
        icon: getString('icon') || existing.icon,
        description: getString('description') || existing.description,
        heroHeadline: getString('heroHeadline'),
        heroSubtitle: getString('heroSubtitle'),
        whatWeDo: getString('whatWeDo'),
        signatureEvents: getString('signatureEvents'),
        differentiators: getString('differentiators'),
        faqs: getString('faqs'),
        type: getString('type') || existing.type,
        isActive: fd.get('isActive') === 'true',
        coverImageUrl,
        storagePath,
        updatedAt: new Date(),
      },
    });
    return NextResponse.json(service);
  }

  // JSON patch — toggle isActive, reorder, quick field updates
  const body = await req.json();
  const service = await prisma.service.update({
    where: { id },
    data: { ...body, updatedAt: new Date() },
  });
  return NextResponse.json(service);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;

  const service = await prisma.service.findUnique({ where: { id } });
  if (!service) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  if (service.storagePath) {
    await supabaseAdmin().storage.from(BUCKET).remove([service.storagePath]);
  }
  await prisma.service.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
