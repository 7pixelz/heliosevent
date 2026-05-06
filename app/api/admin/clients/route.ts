import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '../../../../lib/prisma';
import { verifyToken, COOKIE_NAME } from '../../../../lib/auth';
import { supabaseAdmin, ensureBucket, BUCKET_CLIENTS as BUCKET } from '../../../../lib/supabase-server';

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

  await ensureBucket(BUCKET);

  const form = await req.formData();
  const file = form.get('file') as File | null;
  const name = (form.get('name') as string | null)?.trim();

  if (!file || !name) {
    return NextResponse.json({ error: 'File and name are required' }, { status: 400 });
  }

  const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
  const storagePath = `${Date.now()}-${name.replace(/\s+/g, '-').toLowerCase()}.${ext}`;

  const sb = supabaseAdmin();
  const { error: uploadError } = await sb.storage
    .from(BUCKET)
    .upload(storagePath, file, { contentType: file.type, upsert: false });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data: urlData } = sb.storage.from(BUCKET).getPublicUrl(storagePath);

  const max = await prisma.clientLogo.aggregate({ _max: { displayOrder: true } });
  const nextOrder = (max._max.displayOrder ?? 0) + 1;

  const logo = await prisma.clientLogo.create({
    data: { name, imageUrl: urlData.publicUrl, storagePath, displayOrder: nextOrder },
  });

  return NextResponse.json(logo);
}
