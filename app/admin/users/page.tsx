import { prisma } from '../../../lib/prisma';
import UsersClient from './UsersClient';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  const users = await prisma.adminUser.findMany({
    orderBy: { createdAt: 'asc' },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  return <UsersClient users={users as never} />;
}
