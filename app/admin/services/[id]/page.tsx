import { prisma } from '../../../../lib/prisma';
import { notFound } from 'next/navigation';
import ServiceEditClient from './ServiceEditClient';

export const dynamic = 'force-dynamic';

export default async function ServiceEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = await prisma.service.findUnique({ where: { id } });
  if (!service) notFound();
  return <ServiceEditClient service={service as never} />;
}
