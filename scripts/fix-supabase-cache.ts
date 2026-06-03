/**
 * Re-uploads all existing Supabase storage files with a 1-year cache header.
 * Run once: npx ts-node -r tsconfig-paths/register scripts/fix-supabase-cache.ts
 */
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const BUCKETS = [
  'hero-media',
  'client-logos',
  'portfolio-media',
  'blog-images',
  'service-media',
];

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

async function listAllFiles(bucket: string, prefix = ''): Promise<string[]> {
  const { data, error } = await sb.storage.from(bucket).list(prefix, { limit: 1000 });
  if (error || !data) return [];

  const paths: string[] = [];
  for (const item of data) {
    if (item.metadata) {
      // It's a file
      paths.push(prefix ? `${prefix}/${item.name}` : item.name);
    } else {
      // It's a folder — recurse
      const sub = await listAllFiles(bucket, prefix ? `${prefix}/${item.name}` : item.name);
      paths.push(...sub);
    }
  }
  return paths;
}

async function fixBucket(bucket: string) {
  console.log(`\n── ${bucket}`);
  const paths = await listAllFiles(bucket);
  console.log(`   ${paths.length} file(s) found`);

  for (const path of paths) {
    // Download
    const { data: blob, error: dlErr } = await sb.storage.from(bucket).download(path);
    if (dlErr || !blob) {
      console.log(`   ✗ download failed: ${path}`);
      continue;
    }

    // Re-upload at same path with 1-year cache
    const buffer = Buffer.from(await blob.arrayBuffer());
    const contentType = blob.type || 'application/octet-stream';

    const { error: upErr } = await sb.storage.from(bucket).upload(path, buffer, {
      contentType,
      upsert: true,
      cacheControl: '31536000',
    });

    if (upErr) {
      console.log(`   ✗ upload failed: ${path} — ${upErr.message}`);
    } else {
      console.log(`   ✓ ${path}`);
    }
  }
}

async function main() {
  console.log('Fixing Supabase cache headers (1 year)...');
  for (const bucket of BUCKETS) {
    await fixBucket(bucket);
  }
  console.log('\nDone.');
}

main().catch(console.error);
