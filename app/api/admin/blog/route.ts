import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { prisma } from '../../../../lib/prisma';
import { verifyToken, COOKIE_NAME } from '../../../../lib/auth';
import { uploadObject, getPublicUrl } from '../../../../lib/storage';
import { optimizeImage } from '../../../../lib/image';

const BUCKET = 'blog-images';

function slugify(text: string) {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifyToken(token);
}

// GET — list all posts
export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const posts = await prisma.blogPost.findMany({
    orderBy: { publishedAt: 'desc' },
    select: { id: true, title: true, slug: true, excerpt: true, coverImageUrl: true, category: true, tags: true, isPublished: true, publishedAt: true, createdAt: true },
  });
  return NextResponse.json(posts);
}

// POST — create post (with optional cover image upload)
export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const fd = await req.formData();
  const title = (fd.get('title') as string || '').trim();
  const content = (fd.get('content') as string || '').trim();
  const excerpt = (fd.get('excerpt') as string || '').trim();
  const category = (fd.get('category') as string || '').trim();
  const tags = (fd.get('tags') as string || '').trim();
  const isPublished = fd.get('isPublished') === 'true';
  const file = fd.get('file') as File | null;

  if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 });

  let slug = slugify(title);
  const conflict = await prisma.blogPost.findUnique({ where: { slug } });
  if (conflict) slug = `${slug}-${Date.now()}`;

  let coverImageUrl: string | null = null;
  let storagePath: string | null = null;

  if (file && file.size > 0) {
    const optimized = await optimizeImage(file, { maxWidth: 1920, quality: 75 });
    const path = `covers/${Date.now()}.${optimized.ext}`;
    const { error } = await uploadObject(BUCKET, path, optimized.body, optimized.contentType);
    if (!error) {
      storagePath = path;
      coverImageUrl = getPublicUrl(BUCKET, path);
    }
  }

  const post = await prisma.blogPost.create({
    data: {
      title,
      slug,
      content,
      excerpt: excerpt || null,
      coverImageUrl,
      storagePath,
      category: category || null,
      tags: tags || null,
      isPublished,
      publishedAt: isPublished ? new Date() : null,
    },
  });

  revalidatePath('/blog', 'layout');
  revalidatePath(`/blog/${post.slug}`);
  return NextResponse.json(post, { status: 201 });
}
