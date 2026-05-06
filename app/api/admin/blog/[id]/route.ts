import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import { verifyAdminToken } from '../../../../../lib/auth';
import { createClient } from '@supabase/supabase-js';

const BUCKET = 'blog-images';

function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

// PATCH — update post
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await verifyAdminToken(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;

  const ct = req.headers.get('content-type') || '';

  if (ct.includes('multipart/form-data')) {
    const fd = await req.formData();
    const title = (fd.get('title') as string || '').trim();
    const content = (fd.get('content') as string || '').trim();
    const excerpt = (fd.get('excerpt') as string || '').trim();
    const category = (fd.get('category') as string || '').trim();
    const tags = (fd.get('tags') as string || '').trim();
    const isPublished = fd.get('isPublished') === 'true';
    const metaTitle = (fd.get('metaTitle') as string || '').trim() || null;
    const metaDescription = (fd.get('metaDescription') as string || '').trim() || null;
    const metaKeywords = (fd.get('metaKeywords') as string || '').trim() || null;
    const file = fd.get('file') as File | null;

    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    let coverImageUrl = existing.coverImageUrl;
    let storagePath = existing.storagePath;

    if (file && file.size > 0) {
      const sb = supabaseAdmin();
      if (existing.storagePath && !existing.storagePath.startsWith('wp-import/')) {
        await sb.storage.from(BUCKET).remove([existing.storagePath]);
      }
      const ext = file.name.split('.').pop() || 'jpg';
      const path = `covers/${Date.now()}.${ext}`;
      const { error } = await sb.storage.from(BUCKET).upload(path, await file.arrayBuffer(), { contentType: file.type, upsert: true });
      if (!error) {
        storagePath = path;
        coverImageUrl = sb.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
      }
    }

    const wasPublished = existing.isPublished;
    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        title: title || existing.title,
        content: content || existing.content,
        excerpt: excerpt || existing.excerpt,
        coverImageUrl,
        storagePath,
        category: category || existing.category,
        tags: tags || existing.tags,
        isPublished,
        publishedAt: isPublished && !wasPublished ? new Date() : existing.publishedAt,
        metaTitle,
        metaDescription,
        metaKeywords,
        updatedAt: new Date(),
      },
    });
    return NextResponse.json(post);
  }

  // JSON patch — toggle publish / quick field update
  const body = await req.json();
  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const post = await prisma.blogPost.update({
    where: { id },
    data: {
      ...body,
      publishedAt: body.isPublished === true && !existing.isPublished ? new Date() : existing.publishedAt,
      updatedAt: new Date(),
    },
  });
  return NextResponse.json(post);
}

// DELETE
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await verifyAdminToken(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;

  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  if (post.storagePath && !post.storagePath.startsWith('wp-import/')) {
    await supabaseAdmin().storage.from(BUCKET).remove([post.storagePath]);
  }

  await prisma.blogPost.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
