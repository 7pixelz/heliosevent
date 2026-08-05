import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken, COOKIE_NAME } from '../../../../lib/auth';
import { getSignedDownloadUrl } from '../../../../lib/storage';

const BUCKET = 'career-resumes';

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifyToken(token);
}

export async function GET(req: NextRequest) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const url = new URL(req.url);
  const path = url.searchParams.get('path');
  if (!path) return NextResponse.json({ error: 'Missing path' }, { status: 400 });

  try {
    const signedUrl = await getSignedDownloadUrl(BUCKET, path, 60); // 60 second expiry
    return NextResponse.redirect(signedUrl);
  } catch {
    return NextResponse.json({ error: 'Could not generate download URL' }, { status: 500 });
  }
}
