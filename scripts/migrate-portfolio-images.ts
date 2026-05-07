/**
 * Migrates portfolio images from WordPress (old server) to Supabase storage.
 * Updates coverImageUrl on PortfolioEvent and url on PortfolioMedia records.
 *
 * Run: npx tsx scripts/migrate-portfolio-images.ts
 */

import https from 'https';
import http from 'http';
import { createClient } from '@supabase/supabase-js';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

const BUCKET = 'portfolio-media';
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

function isWpUrl(url: string | null): boolean {
  if (!url) return false;
  return url.includes('heliosevent.in/wp-content/uploads') ||
    url.includes('heliosevent.in/wp-content/');
}

function fetchBuffer(url: string): Promise<{ buffer: Buffer; contentType: string }> {
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

    const req = (mod as typeof https).request(options, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        const location = res.headers.location;
        if (location) return fetchBuffer(location).then(resolve).catch(reject);
        return reject(new Error('Redirect without location'));
      }
      if ((res.statusCode ?? 0) >= 400) {
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
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
    const { error } = await supabase.storage.createBucket(BUCKET, { public: true });
    if (error) throw new Error(`Failed to create bucket: ${error.message}`);
    console.log(`✓ Created bucket: ${BUCKET}`);
  }
}

function storagePath(eventId: string, originalUrl: string): string {
  const ext = originalUrl.split('.').pop()?.split('?')[0] || 'jpg';
  return `events/${eventId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
}

async function uploadToSupabase(
  filePath: string,
  buffer: Buffer,
  contentType: string
): Promise<string> {
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, buffer, { contentType, upsert: true });
  if (error) throw new Error(`Upload failed: ${error.message}`);
  return supabase.storage.from(BUCKET).getPublicUrl(filePath).data.publicUrl;
}

async function run() {
  await ensureBucket();

  const events = await prisma.portfolioEvent.findMany({
    include: { media: true },
  });

  console.log(`\nFound ${events.length} portfolio events\n`);
  let totalMigrated = 0;
  let totalSkipped = 0;
  let totalFailed = 0;

  for (const event of events) {
    console.log(`\n── ${event.title}`);

    // Migrate coverImageUrl
    if (isWpUrl(event.coverImageUrl)) {
      try {
        const { buffer, contentType } = await fetchBuffer(event.coverImageUrl!);
        const path = storagePath(event.id, event.coverImageUrl!);
        const newUrl = await uploadToSupabase(path, buffer, contentType);
        await prisma.portfolioEvent.update({
          where: { id: event.id },
          data: { coverImageUrl: newUrl },
        });
        console.log(`  ✓ Cover image migrated`);
        totalMigrated++;
      } catch (e) {
        console.error(`  ✗ Cover image failed: ${e}`);
        totalFailed++;
      }
    } else {
      console.log(`  – Cover already in Supabase, skipping`);
      totalSkipped++;
    }

    // Migrate media items
    for (const media of event.media) {
      if (media.type !== 'IMAGE') continue;
      if (!isWpUrl(media.url)) {
        console.log(`  – Media ${media.id} already in Supabase, skipping`);
        totalSkipped++;
        continue;
      }
      try {
        const { buffer, contentType } = await fetchBuffer(media.url);
        const path = storagePath(event.id, media.url);
        const newUrl = await uploadToSupabase(path, buffer, contentType);
        await prisma.portfolioMedia.update({
          where: { id: media.id },
          data: { url: newUrl, storagePath: path },
        });
        console.log(`  ✓ Media ${media.id} migrated`);
        totalMigrated++;
      } catch (e) {
        console.error(`  ✗ Media ${media.id} failed: ${e}`);
        totalFailed++;
      }
    }
  }

  console.log(`\n${'─'.repeat(40)}`);
  console.log(`Migrated : ${totalMigrated}`);
  console.log(`Skipped  : ${totalSkipped}`);
  console.log(`Failed   : ${totalFailed}`);
  console.log(`${'─'.repeat(40)}\n`);

  await prisma.$disconnect();
}

run().catch(e => { console.error(e); process.exit(1); });
