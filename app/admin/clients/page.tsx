import { prisma } from '../../../lib/prisma';
import ClientsAdminClient from './ClientsAdminClient';

export const dynamic = 'force-dynamic';

export default async function AdminClientsPage() {
  const logos = await prisma.clientLogo.findMany({ orderBy: { displayOrder: 'asc' } });
  return <ClientsAdminClient logos={logos as never} />;
}
