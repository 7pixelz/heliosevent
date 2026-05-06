import { prisma } from '../../../../lib/prisma';
import { notFound } from 'next/navigation';
import PortfolioEventEditClient from './PortfolioEventEditClient';

export const dynamic = 'force-dynamic';

interface Props { params: Promise<{ id: string }> }

export default async function PortfolioEventEditPage({ params }: Props) {
  const { id } = await params;
  const event = await prisma.portfolioEvent.findUnique({
    where: { id },
    include: { media: { orderBy: { displayOrder: 'asc' } } },
  });
  if (!event) notFound();
  return <PortfolioEventEditClient event={event as never} />;
}
