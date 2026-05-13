import { prisma } from '../../../lib/prisma';
import CareersAdminClient from './CareersAdminClient';

export const dynamic = 'force-dynamic';

export default async function CareersAdminPage() {
  const applications = await prisma.careerApplication.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const serialized = applications.map(a => ({
    ...a,
    createdAt: a.createdAt.toISOString(),
  }));

  return <CareersAdminClient applications={serialized} />;
}
