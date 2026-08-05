import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '../../../../../../../../lib/prisma';
import { verifyToken, COOKIE_NAME } from '../../../../../../../../lib/auth';
import { removeObjects } from '../../../../../../../../lib/storage';

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
    await removeObjects(BUCKET, [media.storagePath]);
  }

  await prisma.portfolioMedia.delete({ where: { id: mediaId } });
  return NextResponse.json({ ok: true });
}
