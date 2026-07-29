import { NextRequest, NextResponse } from 'next/server';

async function verifyRecaptcha(token: string): Promise<boolean> {
  const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
  });
  const data = await res.json();
  return data.success && data.score >= 0.7;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const token = typeof body?.recaptchaToken === 'string' ? body.recaptchaToken : '';
    if (!token) {
      return NextResponse.json({ ok: false, error: 'reCAPTCHA token missing' }, { status: 400 });
    }

    const valid = await verifyRecaptcha(token);
    if (!valid) {
      return NextResponse.json({ ok: false, error: 'reCAPTCHA verification failed' }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('WhatsApp gate verification error:', e);
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 });
  }
}
