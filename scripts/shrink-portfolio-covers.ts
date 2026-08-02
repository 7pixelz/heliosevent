/**
 * Shrinks existing PortfolioEvent cover images in Supabase storage.
 * Several covers were uploaded at full size (up to 1500x1001, 200KB+) despite
 * only ever being displayed at 400px wide or smaller. Resizes to max 800px
 * wide, converts to webp, re-uploads under a new path, and updates the DB.
 *
 * Run: npx tsx scripts/shrink-portfolio-covers.ts
 */

import sharp from 'sharp';
import { createClient } from '@supabase/supabase-js';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

const BUCKET = 'portfolio-media';
const MAX_WIDTH = 800;
const QUALITY = 78;

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

function pathFromPublicUrl(url: string): string | null {
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return decodeURIComponent(url.slice(idx + marker.length));
}

async function run() {
  const events = await prisma.portfolioEvent.findMany({
    where: { coverImageUrl: { not: null } },
    select: { id: true, title: true, coverImageUrl: true },
  });

  console.log(`Found ${events.length} portfolio events with a cover image\n`);

  let shrunk = 0, skipped = 0, failed = 0;

  for (const ev of events) {
    const path = pathFromPublicUrl(ev.coverImageUrl!);
    if (!path) {
      console.log(`– ${ev.title}: not a ${BUCKET} URL, skipping`);
      skipped++;
      continue;
    }

    try {
      const { data: blob, error: dlErr } = await supabase.storage.from(BUCKET).download(path);
      if (dlErr || !blob) throw new Error(dlErr?.message || 'download failed');
      const original = Buffer.from(await blob.arrayBuffer());

      const meta = await sharp(original).metadata();
      if ((meta.width || 0) <= MAX_WIDTH && meta.format === 'webp') {
        console.log(`– ${ev.title}: already ${meta.width}x${meta.height} webp, skipping`);
        skipped++;
        continue;
      }

      const resized = await sharp(original)
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toBuffer();

      const newPath = path.replace(/\.[a-zA-Z0-9]+$/, '') + '-shrunk.webp';
      const { error: upErr } = await supabase.storage.from(BUCKET).upload(newPath, resized, {
        contentType: 'image/webp',
        upsert: true,
        cacheControl: '31536000',
      });
      if (upErr) throw new Error(upErr.message);

      const newUrl = supabase.storage.from(BUCKET).getPublicUrl(newPath).data.publicUrl;
      await prisma.portfolioEvent.update({ where: { id: ev.id }, data: { coverImageUrl: newUrl } });

      console.log(`✓ ${ev.title}: ${original.length}b (${meta.width}x${meta.height}) -> ${resized.length}b`);
      shrunk++;
    } catch (e) {
      console.error(`✗ ${ev.title}: ${e}`);
      failed++;
    }
  }

  console.log(`\n${'─'.repeat(40)}`);
  console.log(`Shrunk  : ${shrunk}`);
  console.log(`Skipped : ${skipped}`);
  console.log(`Failed  : ${failed}`);
  console.log(`${'─'.repeat(40)}\n`);

  await prisma.$disconnect();
}

run().catch(e => { console.error(e); process.exit(1); });
