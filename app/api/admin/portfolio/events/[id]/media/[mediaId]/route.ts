import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '../../../../../../../../lib/prisma';
import { verifyToken, COOKIE_NAME } from '../../../../../../../../lib/auth';
import { createClient } from '@supabase/supabase-js';

const BUCKET = 'portfolio-media';

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifyToken(token);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string; mediaId: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { mediaId } = await params;

  const media = await prisma.portfolioMedia.findUnique({ where: { id: mediaId } });
  if (!media) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  if (media.storagePath) {
    const sb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    );
    await sb.storage.from(BUCKET).remove([media.storagePath]);
  }

  await prisma.portfolioMedia.delete({ where: { id: mediaId } });
  return NextResponse.json({ ok: true });
}
