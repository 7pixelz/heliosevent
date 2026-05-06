import { prisma } from '../../../lib/prisma';
import EnquiriesClient from './EnquiriesClient';

export const dynamic = 'force-dynamic';

export default async function EnquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const params = await searchParams;
  const statusFilter = params.status?.toUpperCase();
  const search = params.q?.trim();

  const where: Record<string, unknown> = {};
  if (statusFilter && ['NEW', 'CONTACTED', 'CLOSED'].includes(statusFilter)) {
    where.status = statusFilter;
  }
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { company: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [quotes, counts] = await Promise.all([
    prisma.quote.findMany({ where, orderBy: { createdAt: 'desc' } }),
    prisma.quote.groupBy({ by: ['status'], _count: { _all: true } }),
  ]);

  const statusCounts = { NEW: 0, CONTACTED: 0, CLOSED: 0, ALL: 0 };
  counts.forEach(c => {
    statusCounts[c.status as keyof typeof statusCounts] = c._count._all;
    statusCounts.ALL += c._count._all;
  });

  return <EnquiriesClient quotes={quotes as never} statusCounts={statusCounts} currentStatus={params.status} currentSearch={params.q} />;
}
