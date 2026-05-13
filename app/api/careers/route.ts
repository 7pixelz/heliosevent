import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { sendCareerNotification } from '../../../lib/mailer';
import { createClient } from '@supabase/supabase-js';

const BUCKET = 'career-resumes';

function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

async function ensureBucket(sb: ReturnType<typeof supabaseAdmin>) {
  const { data } = await sb.storage.listBuckets();
  if (!data?.find(b => b.name === BUCKET)) {
    await sb.storage.createBucket(BUCKET, { public: false });
  }
}

export async function POST(req: NextRequest) {
  try {
    const fd = await req.formData();

    const name = (fd.get('name') as string || '').trim();
    const email = (fd.get('email') as string || '').trim();
    const phone = (fd.get('phone') as string || '').trim();
    const position = (fd.get('position') as string || '').trim();
    const experience = (fd.get('experience') as string || '').trim();
    const currentRole = (fd.get('currentRole') as string || '').trim() || null;
    const message = (fd.get('message') as string || '').trim() || null;
    const resumeFile = fd.get('resume') as File | null;

    if (!name || !email || !phone || !position || !experience) {
      return NextResponse.json({ error: 'Please fill in all required fields.' }, { status: 400 });
    }

    let resumeUrl: string | null = null;
    if (resumeFile && resumeFile.size > 0) {
      const sb = supabaseAdmin();
      await ensureBucket(sb);
      const ext = resumeFile.name.split('.').pop() || 'pdf';
      const path = `resumes/${Date.now()}-${name.replace(/\s+/g, '-')}.${ext}`;
      const { error } = await sb.storage.from(BUCKET).upload(path, await resumeFile.arrayBuffer(), {
        contentType: resumeFile.type,
        upsert: false,
      });
      if (!error) {
        resumeUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/${BUCKET}/${path}`;
      }
    }

    const application = await prisma.careerApplication.create({
      data: { name, email, phone, position, experience, currentRole, message, resumeUrl },
    });

    try {
      await sendCareerNotification({ name, email, phone, position, experience, currentRole, message, resumeUrl });
    } catch (e) {
      console.error('Career email failed:', e);
    }

    return NextResponse.json({ success: true, id: application.id });
  } catch (e) {
    console.error('Career application error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
