import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '../../../../../lib/prisma';
import { verifyToken, COOKIE_NAME } from '../../../../../lib/auth';
import { supabaseAdmin } from '../../../../../lib/supabase-server';

const BUCKET = 'career-resumes';

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
  const { status } = await req.json();

  const validStatuses = ['NEW', 'REVIEWING', 'SHORTLISTED', 'ON_HOLD', 'REJECTED', 'HIRED'];
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  const application = await prisma.careerApplication.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json(application);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  const application = await prisma.careerApplication.findUnique({ where: { id } });
  if (!application) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Delete resume from storage if it exists
  if (application.resumeUrl) {
    const match = application.resumeUrl.match(/\/object\/career-resumes\/(.+)$/);
    const storagePath = match ? match[1] : application.resumeUrl.startsWith('http') ? null : application.resumeUrl;
    if (storagePath) {
      const sb = supabaseAdmin();
      await sb.storage.from(BUCKET).remove([storagePath]);
    }
  }

  await prisma.careerApplication.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
