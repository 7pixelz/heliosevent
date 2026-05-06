import { prisma } from '../../../lib/prisma';
import PortfolioAdminClient from './PortfolioAdminClient';

export const dynamic = 'force-dynamic';

export default async function PortfolioAdminPage() {
  const events = await prisma.portfolioEvent.findMany({
    orderBy: [{ displayOrder: 'asc' }, { createdAt: 'asc' }],
    include: { _count: { select: { media: true } } },
  });
  return <PortfolioAdminClient initialEvents={events as never} />;
}
