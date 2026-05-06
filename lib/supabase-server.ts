import { createClient } from '@supabase/supabase-js';

export const BUCKET_CLIENTS = 'client-logos';
export const BUCKET_HERO = 'hero-media';

export function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

export async function ensureBucket(bucket: string) {
  const sb = supabaseAdmin();
  const { data: buckets } = await sb.storage.listBuckets();
  const exists = buckets?.some(b => b.name === bucket);
  if (!exists) {
    await sb.storage.createBucket(bucket, { public: true, fileSizeLimit: 52428800 }); // 50MB
  }
}

// Keep backward compat
export const BUCKET = BUCKET_CLIENTS;
