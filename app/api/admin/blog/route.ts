import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { verifyAdminToken } from '../../../../lib/auth';
import { createClient } from '@supabase/supabase-js';

const BUCKET = 'blog-images';

function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

async function ensureBucket(sb: ReturnType<typeof supabaseAdmin>) {
  const { data } = await sb.storage.listBuckets();
  if (!data?.find(b => b.name === BUCKET)) {
    await sb.storage.createBucket(BUCKET, { public: true });
  }
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}

// GET — list all posts
export async function GET(req: NextRequest) {
  const admin = await verifyAdminToken(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const posts = await prisma.blogPost.findMany({
    orderBy: { publishedAt: 'desc' },
    select: { id: true, title: true, slug: true, excerpt: true, coverImageUrl: true, category: true, tags: true, isPublished: true, publishedAt: true, createdAt: true },
  });
  return NextResponse.json(posts);
}

// POST — create post (with optional cover image upload)
export async function POST(req: NextRequest) {
  const admin = await verifyAdminToken(req);
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
    const sb = supabaseAdmin();
    await ensureBucket(sb);
    const ext = file.name.split('.').pop() || 'jpg';
    const path = `covers/${Date.now()}.${ext}`;
    const { error } = await sb.storage.from(BUCKET).upload(path, await file.arrayBuffer(), { contentType: file.type, upsert: true });
    if (!error) {
      storagePath = path;
      coverImageUrl = sb.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
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

  return NextResponse.json(post, { status: 201 });
}
