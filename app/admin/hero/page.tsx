import { prisma } from '../../../lib/prisma';
import HeroAdminClient from './HeroAdminClient';

export const dynamic = 'force-dynamic';

export default async function AdminHeroPage() {
  const slides = await prisma.heroSlide.findMany({ orderBy: { displayOrder: 'asc' } });
  return <HeroAdminClient slides={slides as never} />;
}
