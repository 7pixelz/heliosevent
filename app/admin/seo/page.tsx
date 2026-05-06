import SeoAdminClient from './SeoAdminClient';
import { prisma } from '../../../lib/prisma';

export const dynamic = 'force-dynamic';

export default async function SeoAdminPage() {
  const [pages, services, portfolio] = await Promise.all([
    prisma.pageSeo.findMany({ orderBy: { createdAt: 'asc' } }),
    prisma.service.findMany({
      where: { type: 'MAIN' }, orderBy: { displayOrder: 'asc' },
      select: { id: true, name: true, slug: true, icon: true, metaTitle: true, metaDescription: true, metaKeywords: true },
    }),
    prisma.portfolioEvent.findMany({
      orderBy: { displayOrder: 'asc' },
      select: { id: true, title: true, slug: true, category: true, metaTitle: true, metaDescription: true, metaKeywords: true },
    }),
  ]);

  return <SeoAdminClient pages={pages as never} services={services as never} portfolio={portfolio as never} />;
}
