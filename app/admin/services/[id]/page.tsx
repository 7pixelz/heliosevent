import { prisma } from '../../../../lib/prisma';
import { notFound } from 'next/navigation';
import ServiceEditClient from './ServiceEditClient';

export const dynamic = 'force-dynamic';

export default async function ServiceEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [service, portfolioEvents] = await Promise.all([
    prisma.service.findUnique({ where: { id } }),
    prisma.portfolioEvent.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true, category: true, clientName: true, coverImageUrl: true },
    }),
  ]);
  if (!service) notFound();
  return <ServiceEditClient service={service as never} portfolioEvents={portfolioEvents} />;
}
