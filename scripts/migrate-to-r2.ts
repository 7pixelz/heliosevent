/**
 * One-time backfill: copies every Supabase Storage object referenced in the
 * database into the equivalent Cloudflare R2 bucket (same key), then updates
 * the DB row to point at the new R2 public URL. Safe to re-run — rows already
 * pointing at an R2 domain (or, for the private career-resumes bucket, keys
 * that already exist in R2) are skipped.
 *
 * Requires R2_ACCOUNT_ID / R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY / R2_ENDPOINT
 * in .env (Phase 0 must be done — buckets created, custom domains attached).
 *
 * Run: npx tsx scripts/migrate-to-r2.ts
 * Optionally scope to one bucket: npx tsx scripts/migrate-to-r2.ts client-logos
 */

import { createClient } from '@supabase/supabase-js';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { S3Client, HeadObjectCommand } from '@aws-sdk/client-s3';
import 'dotenv/config';
import { uploadObject, getPublicUrl } from '../lib/storage';

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

const s3 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const R2_DOMAIN_FRAGMENT = 'cdn.heliosevent.in';
const scopeBucket = process.argv[2]; // optional CLI arg to limit to one bucket

function keyFromSupabaseUrl(url: string, bucket: string): string | null {
  const marker = `/object/public/${bucket}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return decodeURIComponent(url.slice(idx + marker.length));
}

async function fetchPublicBytes(url: string): Promise<{ buffer: Buffer; contentType: string }> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch failed: HTTP ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  const contentType = res.headers.get('content-type') || 'application/octet-stream';
  return { buffer, contentType };
}

async function objectExistsInR2(bucket: string, key: string): Promise<boolean> {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
    return true;
  } catch {
    return false;
  }
}

let migrated = 0;
let skipped = 0;
let failed = 0;

async function migratePublicField<T extends { id: string; storagePath: string | null }>(
  label: string,
  bucket: string,
  rows: (T & Record<string, unknown>)[],
  urlField: string,
  update: (id: string, data: { url: string; storagePath: string }) => Promise<unknown>
) {
  if (scopeBucket && scopeBucket !== bucket) return;
  console.log(`\n── ${label} (bucket: ${bucket}) — ${rows.length} row(s)`);

  for (const row of rows) {
    const url = row[urlField] as string | null;
    if (!url) continue;
    if (url.includes(R2_DOMAIN_FRAGMENT)) {
      skipped++;
      continue;
    }

    const key = row.storagePath || keyFromSupabaseUrl(url, bucket);
    if (!key) {
      console.error(`  ✗ ${row.id}: could not derive storage key from "${url}"`);
      failed++;
      continue;
    }

    try {
      const { buffer, contentType } = await fetchPublicBytes(url);
      const { error } = await uploadObject(bucket, key, buffer, contentType);
      if (error) throw new Error(error);
      const newUrl = getPublicUrl(bucket, key);
      await update(row.id, { url: newUrl, storagePath: key });
      console.log(`  ✓ ${row.id}`);
      migrated++;
    } catch (e) {
      console.error(`  ✗ ${row.id}: ${e}`);
      failed++;
    }
  }
}

async function migrateResumes() {
  const bucket = 'career-resumes';
  if (scopeBucket && scopeBucket !== bucket) return;

  const applications = await prisma.careerApplication.findMany({
    where: { resumeUrl: { not: null } },
  });
  console.log(`\n── Career resumes (bucket: ${bucket}) — ${applications.length} row(s)`);

  for (const app of applications) {
    const path = app.resumeUrl!;
    if (path.startsWith('http')) {
      console.error(`  ✗ ${app.id}: unexpected full URL in resumeUrl, skipping: ${path}`);
      failed++;
      continue;
    }

    if (await objectExistsInR2(bucket, path)) {
      skipped++;
      continue;
    }

    try {
      const { data, error: signError } = await supabase.storage.from(bucket).createSignedUrl(path, 60);
      if (signError || !data?.signedUrl) throw new Error(signError?.message || 'Could not sign URL');
      const { buffer, contentType } = await fetchPublicBytes(data.signedUrl);
      const { error } = await uploadObject(bucket, path, buffer, contentType);
      if (error) throw new Error(error);
      console.log(`  ✓ ${app.id}`);
      migrated++;
    } catch (e) {
      console.error(`  ✗ ${app.id}: ${e}`);
      failed++;
    }
  }
}

async function migrateBlogContentImages() {
  const bucket = 'blog-images';
  if (scopeBucket && scopeBucket !== bucket) return;

  const posts = await prisma.blogPost.findMany({ select: { id: true, content: true } });
  console.log(`\n── Blog post content images (bucket: ${bucket}) — ${posts.length} post(s)`);

  const urlCache = new Map<string, string>(); // supabase url -> r2 url

  for (const post of posts) {
    const urlPattern = new RegExp(`https?:\\/\\/dndigemwjlbukfauxyqx\\.supabase\\.co\\/storage\\/v1\\/object\\/public\\/${bucket}\\/[^"'\\s)]+`, 'g');
    const matches = [...new Set(post.content.match(urlPattern) || [])];
    if (!matches.length) continue;

    let newContent = post.content;
    let changed = false;

    for (const supabaseUrl of matches) {
      let r2Url = urlCache.get(supabaseUrl);
      if (!r2Url) {
        const key = keyFromSupabaseUrl(supabaseUrl, bucket);
        if (!key) {
          console.error(`  ✗ ${post.id}: could not derive storage key from "${supabaseUrl}"`);
          failed++;
          continue;
        }
        try {
          if (await objectExistsInR2(bucket, key)) {
            r2Url = getPublicUrl(bucket, key);
          } else {
            const { buffer, contentType } = await fetchPublicBytes(supabaseUrl);
            const { error } = await uploadObject(bucket, key, buffer, contentType);
            if (error) throw new Error(error);
            r2Url = getPublicUrl(bucket, key);
          }
          urlCache.set(supabaseUrl, r2Url);
        } catch (e) {
          console.error(`  ✗ ${post.id}: ${e}`);
          failed++;
          continue;
        }
      }
      newContent = newContent.split(supabaseUrl).join(r2Url);
      changed = true;
    }

    if (changed) {
      await prisma.blogPost.update({ where: { id: post.id }, data: { content: newContent } });
      console.log(`  ✓ ${post.id} (${matches.length} image(s))`);
      migrated++;
    }
  }
}

async function run() {
  const [heroSlides, clientLogos, services, blogPosts, portfolioItems, portfolioEvents, portfolioMedia] =
    await Promise.all([
      prisma.heroSlide.findMany({ where: { mediaUrl: { not: '' } } }),
      prisma.clientLogo.findMany(),
      prisma.service.findMany({ where: { coverImageUrl: { not: null } } }),
      prisma.blogPost.findMany({ where: { coverImageUrl: { not: null } } }),
      prisma.portfolioItem.findMany(),
      prisma.portfolioEvent.findMany({ where: { coverImageUrl: { not: null } } }),
      prisma.portfolioMedia.findMany({ where: { type: 'IMAGE' } }),
    ]);

  await migratePublicField('Hero slides', 'hero-media', heroSlides, 'mediaUrl', (id, data) =>
    prisma.heroSlide.update({ where: { id }, data: { mediaUrl: data.url, storagePath: data.storagePath } })
  );

  await migratePublicField('Client logos', 'client-logos', clientLogos, 'imageUrl', (id, data) =>
    prisma.clientLogo.update({ where: { id }, data: { imageUrl: data.url, storagePath: data.storagePath } })
  );

  await migratePublicField('Services', 'service-media', services, 'coverImageUrl', (id, data) =>
    prisma.service.update({ where: { id }, data: { coverImageUrl: data.url, storagePath: data.storagePath } })
  );

  await migratePublicField('Blog posts', 'blog-images', blogPosts, 'coverImageUrl', (id, data) =>
    prisma.blogPost.update({ where: { id }, data: { coverImageUrl: data.url, storagePath: data.storagePath } })
  );

  await migratePublicField('Portfolio items (legacy grid)', 'portfolio-media', portfolioItems, 'imageUrl', (id, data) =>
    prisma.portfolioItem.update({ where: { id }, data: { imageUrl: data.url, storagePath: data.storagePath } })
  );

  await migratePublicField('Portfolio events (covers)', 'portfolio-media', portfolioEvents, 'coverImageUrl', (id, data) =>
    prisma.portfolioEvent.update({ where: { id }, data: { coverImageUrl: data.url, storagePath: data.storagePath } })
  );

  await migratePublicField('Portfolio media (gallery images)', 'portfolio-media', portfolioMedia, 'url', (id, data) =>
    prisma.portfolioMedia.update({ where: { id }, data: { url: data.url, storagePath: data.storagePath } })
  );

  await migrateResumes();
  await migrateBlogContentImages();

  console.log(`\n${'─'.repeat(40)}`);
  console.log(`Migrated : ${migrated}`);
  console.log(`Skipped  : ${skipped}`);
  console.log(`Failed   : ${failed}`);
  console.log(`${'─'.repeat(40)}\n`);

  await prisma.$disconnect();
}

run().catch(e => { console.error(e); process.exit(1); });
