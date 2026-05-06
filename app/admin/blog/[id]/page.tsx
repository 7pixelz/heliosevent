import { prisma } from '../../../../lib/prisma';
import { notFound } from 'next/navigation';
import BlogEditClient from './BlogEditClient';

export const dynamic = 'force-dynamic';

export default async function BlogEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) notFound();
  return <BlogEditClient post={post as never} />;
}
