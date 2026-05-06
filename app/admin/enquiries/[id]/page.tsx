import { notFound } from 'next/navigation';
import { prisma } from '../../../../lib/prisma';
import EnquiryDetailClient from './EnquiryDetailClient';

export const dynamic = 'force-dynamic';

export default async function EnquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const quote = await prisma.quote.findUnique({ where: { id } });
  if (!quote) notFound();

  return <EnquiryDetailClient quote={quote as never} />;
}
