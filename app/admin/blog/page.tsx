import { prisma } from '../../../lib/prisma';
import BlogAdminClient from './BlogAdminClient';

export const dynamic = 'force-dynamic';

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { publishedAt: 'desc' },
    select: { id: true, title: true, slug: true, excerpt: true, coverImageUrl: true, category: true, tags: true, isPublished: true, publishedAt: true, createdAt: true },
  });
  return <BlogAdminClient posts={posts as never} />;
}
