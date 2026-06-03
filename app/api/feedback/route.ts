import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '../../../lib/prisma';
import { sendFeedbackNotification } from '../../../lib/mailer';

const FeedbackSchema = z.object({
  service:      z.number().int().min(1).max(5),
  timeline:     z.number().int().min(1).max(5),
  appreciation: z.number().int().min(1).max(5),
  referral:     z.number().int().min(1).max(5),
  experience:   z.string().min(1, 'Please share your story'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = FeedbackSchema.safeParse(body);
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? 'Validation failed';
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const { service, timeline, appreciation, referral, experience } = parsed.data;

    await prisma.clientFeedback.create({
      data: {
        service,
        timeline,
        appreciation,
        referral,
        experience: experience.trim(),
      },
    });

    try {
      await sendFeedbackNotification({ service, timeline, appreciation, referral, experience });
    } catch (err) {
      console.error('✗ Feedback email notification failed:', err);
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Feedback submission error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
