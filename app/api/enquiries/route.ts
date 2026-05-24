import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '../../../lib/prisma';
import { sendEnquiryNotification } from '../../../lib/mailer';

const EnquirySchema = z.object({
  recaptchaToken: z.string().min(1, 'reCAPTCHA token missing'),
  website: z.string().max(0).optional(), // honeypot — must be empty
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phoneCode: z.string().default('+91'),
  phone: z.string().min(6, 'Invalid phone number'),
  company: z.string().min(1, 'Company name is required'),
  location: z.string().min(1, 'Location is required'),
  typeOfProgram: z.string().min(1, 'Type of event is required'),
  teamSize: z.string().optional().nullable(),
  budget: z.string().optional().nullable(),
  preferredDate: z.string().optional().nullable(),
  howDidYouHear: z.string().optional().nullable(),
});

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

    const parsed = EnquirySchema.safeParse(body);
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? 'Validation failed';
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const { recaptchaToken, website, ...fields } = parsed.data;

    // Honeypot — bots fill this, humans don't
    if (website) return NextResponse.json({ success: true }); // silently discard

    const valid = await verifyRecaptcha(recaptchaToken);
    if (!valid) {
      return NextResponse.json({ error: 'reCAPTCHA verification failed. Please try again.' }, { status: 400 });
    }

    const quote = await prisma.quote.create({
      data: {
        name: fields.name.trim(),
        email: fields.email.trim(),
        phoneCode: fields.phoneCode,
        phone: fields.phone.trim(),
        company: fields.company.trim(),
        location: fields.location.trim(),
        typeOfProgram: fields.typeOfProgram?.trim() || null,
        teamSize: fields.teamSize?.trim() || null,
        budget: fields.budget?.trim() || null,
        preferredDate: fields.preferredDate?.trim() || null,
        howDidYouHear: fields.howDidYouHear?.trim() || null,
      },
    });

    try {
      await sendEnquiryNotification(fields);
    } catch (err) {
      console.error('✗ Email notification failed:', err);
    }

    return NextResponse.json({ success: true, id: quote.id });
  } catch (e) {
    console.error('Enquiry submission error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
