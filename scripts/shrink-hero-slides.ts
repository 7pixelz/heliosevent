/**
 * Shrinks existing HeroSlide images in Supabase storage. One slide was a raw
 * 3.4MB PNG despite only ever being displayed as a full-bleed cover banner.
 * Resizes to max 2560px wide, converts to webp, re-uploads under a new path,
 * and updates the DB.
 *
 * Run: npx tsx scripts/shrink-hero-slides.ts
 */

import sharp from 'sharp';
import { createClient } from '@supabase/supabase-js';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

const BUCKET = 'hero-media';
const MAX_WIDTH = 2560;
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
  const slides = await prisma.heroSlide.findMany({
    where: { type: 'IMAGE' },
    select: { id: true, title: true, mediaUrl: true },
  });

  console.log(`Found ${slides.length} image hero slides\n`);

  let shrunk = 0, skipped = 0, failed = 0;

  for (const slide of slides) {
    const path = pathFromPublicUrl(slide.mediaUrl);
    if (!path) {
      console.log(`– ${slide.id}: not a ${BUCKET} URL, skipping`);
      skipped++;
      continue;
    }

    try {
      const { data: blob, error: dlErr } = await supabase.storage.from(BUCKET).download(path);
      if (dlErr || !blob) throw new Error(dlErr?.message || 'download failed');
      const original = Buffer.from(await blob.arrayBuffer());

      const meta = await sharp(original).metadata();
      if ((meta.width || 0) <= MAX_WIDTH && meta.format === 'webp' && original.length < 400_000) {
        console.log(`– ${slide.id}: already ${meta.width}x${meta.height} webp (${original.length}b), skipping`);
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
      await prisma.heroSlide.update({ where: { id: slide.id }, data: { mediaUrl: newUrl } });

      console.log(`✓ ${slide.id}: ${original.length}b (${meta.width}x${meta.height}) -> ${resized.length}b`);
      shrunk++;
    } catch (e) {
      console.error(`✗ ${slide.id}: ${e}`);
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
