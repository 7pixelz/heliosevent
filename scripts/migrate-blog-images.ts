/**
 * Migrates blog images from WordPress to Supabase:
 *   - coverImageUrl on each BlogPost
 *   - All <img src="...heliosevent.in/wp-content/..."> inside post content HTML
 *
 * Run: npx tsx scripts/migrate-blog-images.ts
 */

import https from 'https';
import http from 'http';
import { IncomingMessage } from 'http';
import { createClient } from '@supabase/supabase-js';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

const BUCKET = 'blog-images';
const OLD_IP = '69.62.80.189';
const OLD_HOST = 'www.heliosevent.in';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!.replace('?sslmode=require', ''),
  ssl: { rejectUnauthorized: false },
  max: 2,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

function isWpUrl(url: string): boolean {
  return url.includes('heliosevent.in/wp-content/');
}

function fetchBuffer(url: string, depth = 0): Promise<{ buffer: Buffer; contentType: string }> {
  if (depth > 3) return Promise.reject(new Error('Too many redirects'));
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const isHttps = parsed.protocol === 'https:';
    const mod = isHttps ? https : http;
    const options = {
      hostname: OLD_IP,
      port: isHttps ? 443 : 80,
      path: parsed.pathname + parsed.search,
      method: 'GET',
      headers: { Host: OLD_HOST },
      rejectUnauthorized: false,
    };
    const req = (mod as typeof https).request(options, (res: IncomingMessage) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        const loc = res.headers.location;
        if (loc) return fetchBuffer(loc, depth + 1).then(resolve).catch(reject);
        return reject(new Error('Redirect without location'));
      }
      if ((res.statusCode ?? 0) >= 400) return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      const chunks: Buffer[] = [];
      res.on('data', (c: Buffer) => chunks.push(c));
      res.on('end', () => resolve({
        buffer: Buffer.concat(chunks),
        contentType: (res.headers['content-type'] as string) || 'image/jpeg',
      }));
    });
    req.on('error', reject);
    req.end();
  });
}

async function ensureBucket() {
  const { data } = await supabase.storage.listBuckets();
  if (!data?.find(b => b.name === BUCKET)) {
    await supabase.storage.createBucket(BUCKET, { public: true });
    console.log(`✓ Created bucket: ${BUCKET}`);
  }
}

function makePath(postId: string, originalUrl: string): string {
  const ext = originalUrl.split('.').pop()?.split('?')[0]?.toLowerCase() || 'jpg';
  return `posts/${postId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
}

async function upload(storagePath: string, buffer: Buffer, contentType: string): Promise<string> {
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, buffer, { contentType, upsert: true });
  if (error) throw new Error(error.message);
  return supabase.storage.from(BUCKET).getPublicUrl(storagePath).data.publicUrl;
}

// Cache so the same WP URL isn't downloaded twice
const urlCache = new Map<string, string>();

async function migrateUrl(wpUrl: string, postId: string): Promise<string> {
  if (urlCache.has(wpUrl)) return urlCache.get(wpUrl)!;
  const { buffer, contentType } = await fetchBuffer(wpUrl);
  const path = makePath(postId, wpUrl);
  const newUrl = await upload(path, buffer, contentType);
  urlCache.set(wpUrl, newUrl);
  return newUrl;
}

async function run() {
  await ensureBucket();

  const posts = await prisma.blogPost.findMany();
  console.log(`\nFound ${posts.length} blog posts\n`);

  let migrated = 0;
  let skipped = 0;
  let failed = 0;

  for (const post of posts) {
    console.log(`\n── ${post.title.slice(0, 60)}`);
    const updates: { coverImageUrl?: string; content?: string; storagePath?: string } = {};

    // 1. Cover image
    if (post.coverImageUrl && isWpUrl(post.coverImageUrl)) {
      try {
        updates.coverImageUrl = await migrateUrl(post.coverImageUrl, post.id);
        console.log(`  ✓ Cover image migrated`);
        migrated++;
      } catch (e) {
        console.error(`  ✗ Cover failed: ${e}`);
        failed++;
      }
    } else {
      skipped++;
    }

    // 2. Inline images inside content HTML
    const wpImgRegex = /src="(https?:\/\/(?:www\.)?heliosevent\.in\/wp-content\/[^"]+)"/g;
    let content = post.content;
    let match: RegExpExecArray | null;
    let contentChanged = false;

    while ((match = wpImgRegex.exec(post.content)) !== null) {
      const oldUrl = match[1];
      try {
        const newUrl = await migrateUrl(oldUrl, post.id);
        content = content.split(oldUrl).join(newUrl);
        contentChanged = true;
        console.log(`  ✓ Inline image migrated`);
        migrated++;
      } catch (e) {
        console.error(`  ✗ Inline image failed (${oldUrl.split('/').pop()}): ${e}`);
        failed++;
      }
    }

    if (contentChanged) updates.content = content;

    if (Object.keys(updates).length > 0) {
      await prisma.blogPost.update({ where: { id: post.id }, data: updates });
    }
  }

  console.log(`\n${'─'.repeat(40)}`);
  console.log(`Migrated : ${migrated}`);
  console.log(`Skipped  : ${skipped}`);
  console.log(`Failed   : ${failed}`);
  console.log(`${'─'.repeat(40)}\n`);

  await prisma.$disconnect();
}

run().catch(e => { console.error(e); process.exit(1); });
