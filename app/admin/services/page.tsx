import { prisma } from '../../../lib/prisma';
import ServicesAdminClient from './ServicesAdminClient';

export const dynamic = 'force-dynamic';

export default async function AdminServicesPage() {
  const services = await prisma.service.findMany({
    orderBy: [{ type: 'asc' }, { displayOrder: 'asc' }],
  });
  return <ServicesAdminClient services={services as never} />;
}
