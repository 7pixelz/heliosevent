/**
 * One-time re-shrink pass over images already migrated to R2. The earlier
 * shrink-*.ts scripts fixed the backlog as of early August, but nothing
 * resizes at upload time, so anything uploaded since (or auto-set as an
 * event cover from a gallery upload) can still be raw/oversized. Since
 * `unoptimized` is now permanent sitewide (R2 migration), there's no
 * Vercel-side resize to fall back on, so PageSpeed flags these directly.
 *
 * Downloads each object straight from R2, resizes/recompresses to webp if
 * it's above the target width or not already webp, uploads under a new key
 * (avoids serving a stale CDN-cached copy at the old key), and updates the
 * DB row. Safe to re-run — already-correct rows are skipped.
 *
 * Run: npx tsx scripts/reshrink-r2-images.ts
 * Optionally scope to one bucket: npx tsx scripts/reshrink-r2-images.ts portfolio-media
 */

import sharp from 'sharp';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import 'dotenv/config';
import { getPublicUrl } from '../lib/storage';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!.replace('?sslmode=require', ''),
  ssl: { rejectUnauthorized: false },
  max: 2,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);

const s3 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const scopeBucket = process.argv[2];

async function getObjectBuffer(bucket: string, key: string): Promise<Buffer> {
  const res = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
  const chunks: Uint8Array[] = [];
  for await (const chunk of res.Body as AsyncIterable<Uint8Array>) chunks.push(chunk);
  return Buffer.concat(chunks);
}

async function putObjectBuffer(bucket: string, key: string, body: Buffer): Promise<void> {
  await s3.send(new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: body,
    ContentType: 'image/webp',
    CacheControl: 'public, max-age=31536000, immutable',
  }));
}

let shrunk = 0, skipped = 0, failed = 0;

async function reshrinkField<T extends { id: string; storagePath: string | null }>(
  label: string,
  bucket: string,
  rows: T[],
  maxWidth: number,
  quality: number,
  update: (id: string, data: { url: string; storagePath: string }) => Promise<unknown>
) {
  if (scopeBucket && scopeBucket !== bucket) return;
  console.log(`\n── ${label} (bucket: ${bucket}) — ${rows.length} row(s)`);

  for (const row of rows) {
    if (!row.storagePath) {
      skipped++;
      continue;
    }

    try {
      const original = await getObjectBuffer(bucket, row.storagePath);
      const meta = await sharp(original).metadata();

      // Skip only if already at/under target width, already webp, AND not
      // suspiciously large for its dimensions (catches high/lossless-quality
      // webp files that are the right size but poorly compressed).
      if ((meta.width || 0) <= maxWidth && meta.format === 'webp' && original.length <= 350_000) {
        skipped++;
        continue;
      }

      const resized = await sharp(original)
        .rotate()
        .resize({ width: maxWidth, withoutEnlargement: true })
        .webp({ quality })
        .toBuffer();

      const newPath = row.storagePath.replace(/\.[a-zA-Z0-9]+$/, '') + '-opt.webp';
      await putObjectBuffer(bucket, newPath, resized);
      const newUrl = getPublicUrl(bucket, newPath);
      await update(row.id, { url: newUrl, storagePath: newPath });

      console.log(`  ✓ ${row.id}: ${original.length}b (${meta.width}x${meta.height}, ${meta.format}) -> ${resized.length}b`);
      shrunk++;
    } catch (e) {
      console.error(`  ✗ ${row.id}: ${e}`);
      failed++;
    }
  }
}

async function run() {
  const [heroSlides, clientLogos, services, blogPosts, portfolioItems, portfolioEvents, portfolioMedia] =
    await Promise.all([
      prisma.heroSlide.findMany({ where: { type: 'IMAGE' } }),
      prisma.clientLogo.findMany(),
      prisma.service.findMany({ where: { coverImageUrl: { not: null } } }),
      prisma.blogPost.findMany({ where: { coverImageUrl: { not: null } } }),
      prisma.portfolioItem.findMany(),
      prisma.portfolioEvent.findMany({ where: { coverImageUrl: { not: null } } }),
      prisma.portfolioMedia.findMany({ where: { type: 'IMAGE' } }),
    ]);

  await reshrinkField('Hero slides', 'hero-media', heroSlides, 2560, 78, (id, d) =>
    prisma.heroSlide.update({ where: { id }, data: { mediaUrl: d.url, storagePath: d.storagePath } })
  );

  await reshrinkField('Client logos', 'client-logos', clientLogos, 300, 85, (id, d) =>
    prisma.clientLogo.update({ where: { id }, data: { imageUrl: d.url, storagePath: d.storagePath } })
  );

  await reshrinkField('Services', 'service-media', services, 1920, 75, (id, d) =>
    prisma.service.update({ where: { id }, data: { coverImageUrl: d.url, storagePath: d.storagePath } })
  );

  await reshrinkField('Blog posts', 'blog-images', blogPosts, 1920, 75, (id, d) =>
    prisma.blogPost.update({ where: { id }, data: { coverImageUrl: d.url, storagePath: d.storagePath } })
  );

  await reshrinkField('Portfolio items (legacy grid)', 'portfolio-media', portfolioItems, 800, 78, (id, d) =>
    prisma.portfolioItem.update({ where: { id }, data: { imageUrl: d.url, storagePath: d.storagePath } })
  );

  await reshrinkField('Portfolio events (covers)', 'portfolio-media', portfolioEvents, 800, 78, (id, d) =>
    prisma.portfolioEvent.update({ where: { id }, data: { coverImageUrl: d.url, storagePath: d.storagePath } })
  );

  await reshrinkField('Portfolio media (gallery images)', 'portfolio-media', portfolioMedia, 1600, 78, (id, d) =>
    prisma.portfolioMedia.update({ where: { id }, data: { url: d.url, storagePath: d.storagePath } })
  );

  console.log(`\n${'─'.repeat(40)}`);
  console.log(`Shrunk  : ${shrunk}`);
  console.log(`Skipped : ${skipped}`);
  console.log(`Failed  : ${failed}`);
  console.log(`${'─'.repeat(40)}\n`);

  await prisma.$disconnect();
}

run().catch(e => { console.error(e); process.exit(1); });
