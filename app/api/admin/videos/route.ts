import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '../../../../lib/prisma';
import { verifyToken, COOKIE_NAME } from '../../../../lib/auth';

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifyToken(token);
}

function extractYoutubeId(input: string): string {
  const trimmed = input.trim();
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const p of patterns) {
    const m = trimmed.match(p);
    if (m) return m[1];
  }
  return trimmed;
}

export async function GET() {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const videos = await prisma.youtubeVideo.findMany({ orderBy: { displayOrder: 'asc' } });
  return NextResponse.json(videos);
}

export async function POST(req: NextRequest) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { youtubeInput, title, serviceSlugs, showOnHome, displayOrder } = await req.json();
  const youtubeId = extractYoutubeId(youtubeInput);
  const video = await prisma.youtubeVideo.create({
    data: {
      youtubeId,
      title,
      serviceSlugs: serviceSlugs || null,
      showOnHome: showOnHome ?? true,
      displayOrder: displayOrder ?? 0,
    },
  });
  return NextResponse.json(video);
}
