import { prisma } from '../../../lib/prisma';
import PortfolioAdminClient from './PortfolioAdminClient';

export const dynamic = 'force-dynamic';

export default async function PortfolioAdminPage() {
  const events = await prisma.portfolioEvent.findMany({
    orderBy: [{ createdAt: 'desc' }],
    select: { id: true, title: true, slug: true, category: true, clientName: true, coverImageUrl: true, isActive: true, featuredOnHome: true, displayOrder: true, _count: { select: { media: true } } },
  });
  return <PortfolioAdminClient initialEvents={events as never} />;
}
