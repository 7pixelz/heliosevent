import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '../../../lib/prisma';
import { sendEnquiryNotification } from '../../../lib/mailer';

const EnquirySchema = z.object({
  recaptchaToken: z.string().min(1, 'reCAPTCHA token missing'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phoneCode: z.string().default('+91'),
  phone: z.string().min(6, 'Invalid phone number'),
  company: z.string().min(1, 'Company is required'),
  location: z.string().min(1, 'Location is required'),
  teamSize: z.string().min(1, 'Team size is required'),
  targetAudiences: z.string().min(1, 'Target audience is required'),
  budget: z.string().min(1, 'Budget is required'),
  preferredDate: z.string().optional().nullable(),
  duration: z.string().optional().nullable(),
  typeOfProgram: z.string().optional().nullable(),
  objectives: z.string().optional().nullable(),
  additionalRequirements: z.string().optional().nullable(),
  howDidYouHear: z.string().optional().nullable(),
});

async function verifyRecaptcha(token: string): Promise<boolean> {
  const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
  });
  const data = await res.json();
  return data.success && data.score >= 0.5;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parsed = EnquirySchema.safeParse(body);
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? 'Validation failed';
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const { recaptchaToken, ...fields } = parsed.data;

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
        teamSize: fields.teamSize.trim(),
        targetAudiences: fields.targetAudiences.trim(),
        budget: fields.budget.trim(),
        preferredDate: fields.preferredDate?.trim() || null,
        duration: fields.duration?.trim() || null,
        typeOfProgram: fields.typeOfProgram?.trim() || null,
        objectives: fields.objectives?.trim() || null,
        additionalRequirements: fields.additionalRequirements?.trim() || null,
        howDidYouHear: fields.howDidYouHear?.trim() || null,
      },
    });

    // Send email notification
    try {
      await sendEnquiryNotification(fields);
      console.log('✓ Email notification sent');
    } catch (err) {
      console.error('✗ Email notification failed:', err);
    }

    return NextResponse.json({ success: true, id: quote.id });
  } catch (e) {
    console.error('Enquiry submission error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
