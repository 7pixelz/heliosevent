import { prisma } from '../../../lib/prisma';
import FeedbackAdminClient from './FeedbackAdminClient';

export const dynamic = 'force-dynamic';

export default async function FeedbackAdminPage() {
  const entries = await prisma.clientFeedback.findMany({
    orderBy: { submittedAt: 'desc' },
  });

  const serialized = entries.map(e => ({
    ...e,
    submittedAt: e.submittedAt.toISOString(),
  }));

  return <FeedbackAdminClient entries={serialized} />;
}
