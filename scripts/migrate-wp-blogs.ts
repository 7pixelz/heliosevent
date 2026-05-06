/**
 * WordPress → Prisma blog migration script
 * Run: npx tsx scripts/migrate-wp-blogs.ts
 *
 * Fetches all published posts from heliosevent.in WP REST API,
 * downloads featured images to Supabase Storage (blog-images bucket),
 * and inserts them into the BlogPost table.
 *
 * Safe to re-run — skips posts already imported (matched by wpId).
 */

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { createClient } from '@supabase/supabase-js';
import * as https from 'https';
import * as http from 'http';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!.replace('?sslmode=require', ''),
  ssl: { rejectUnauthorized: false },
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const WP_BASE = 'https://www.heliosevent.in/wp-json/wp/v2';
const BUCKET = 'blog-images';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false },
});

// ── helpers ──────────────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function cleanElementorContent(html: string): string {
  return html
    // Remove scripts and styles entirely
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    // Remove SVG icons (social share buttons etc)
    .replace(/<svg[\s\S]*?<\/svg>/gi, '')
    // Remove all div tags (opening + closing) — keeps inner semantic content
    .replace(/<div[^>]*>/gi, '')
    .replace(/<\/div>/gi, '')
    // Remove span wrappers (keep inner text)
    .replace(/<span[^>]*>/gi, '')
    .replace(/<\/span>/gi, '')
    // Clean elementor class/data attrs from remaining tags
    .replace(/\s+class="[^"]*elementor[^"]*"/gi, '')
    .replace(/\s+data-[a-z][a-z0-9-]*="[^"]*"/gi, '')
    // Clean lazy-load image attrs
    .replace(/\s+loading="lazy"/gi, '')
    .replace(/\s+decoding="[^"]*"/gi, '')
    // Fix images: remove srcset/sizes, keep src and alt
    .replace(/<img([^>]*)>/gi, (_, attrs) => {
      const src = attrs.match(/src="([^"]*)"/)?.[1] || '';
      const alt = attrs.match(/alt="([^"]*)"/)?.[1] || '';
      if (!src) return '';
      return `<img src="${src}" alt="${alt}" style="max-width:100%;height:auto;">`;
    })
    // Remove empty anchor tags (social share links)
    .replace(/<a[^>]*>\s*<\/a>/gi, '')
    // Collapse whitespace / blank lines
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function fetchJson(url: string): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

function fetchBuffer(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      // follow redirects
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchBuffer(res.headers.location).then(resolve).catch(reject);
      }
      const chunks: Buffer[] = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

async function ensureBucket() {
  const { data: buckets } = await supabase.storage.listBuckets();
  if (!buckets?.find((b) => b.name === BUCKET)) {
    await supabase.storage.createBucket(BUCKET, { public: true });
    console.log(`  ✓ Created storage bucket "${BUCKET}"`);
  }
}

async function uploadImage(imageUrl: string, filename: string): Promise<{ publicUrl: string; path: string } | null> {
  try {
    const buffer = await fetchBuffer(imageUrl);
    const ext = imageUrl.split('?')[0].split('.').pop()?.toLowerCase() || 'jpg';
    const path = `wp-import/${filename}.${ext}`;
    const contentType = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';

    const { error } = await supabase.storage.from(BUCKET).upload(path, buffer, {
      contentType,
      upsert: true,
    });
    if (error) { console.warn(`    ⚠ Storage upload failed: ${error.message}`); return null; }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return { publicUrl: data.publicUrl, path };
  } catch (e) {
    console.warn(`    ⚠ Image download failed: ${(e as Error).message}`);
    return null;
  }
}

// ── main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🚀 Helios Event — WordPress Blog Migration\n');

  await ensureBucket();

  // Fetch all pages of posts
  let page = 1;
  const allPosts: WpPost[] = [];

  while (true) {
    const url = `${WP_BASE}/posts?per_page=100&page=${page}&_embed&status=publish`;
    console.log(`  Fetching page ${page}…`);
    let posts: WpPost[];
    try {
      posts = (await fetchJson(url)) as WpPost[];
    } catch {
      break;
    }
    if (!Array.isArray(posts) || posts.length === 0) break;
    allPosts.push(...posts);
    if (posts.length < 100) break;
    page++;
  }

  console.log(`\n  Found ${allPosts.length} posts to import\n`);

  let imported = 0;
  let skipped = 0;
  let errors = 0;

  for (const post of allPosts) {
    const title = stripHtml(post.title?.rendered || 'Untitled');
    console.log(`  → [${post.id}] ${title}`);

    // Skip if already imported
    const existing = await prisma.blogPost.findUnique({ where: { wpId: post.id } });
    if (existing) {
      console.log(`    ↩ Already imported — skipping`);
      skipped++;
      continue;
    }

    // Build slug (ensure unique)
    let slug = post.slug || slugify(title);
    const slugConflict = await prisma.blogPost.findUnique({ where: { slug } });
    if (slugConflict) slug = `${slug}-${post.id}`;

    // Raw content & excerpt
    const content = cleanElementorContent(post.content?.rendered || '');
    const rawExcerpt = post.excerpt?.rendered || '';
    const excerpt = rawExcerpt
      ? stripHtml(rawExcerpt).slice(0, 300)
      : stripHtml(content).slice(0, 300);

    // Category
    const categories: WpTerm[] = post._embedded?.['wp:term']?.[0] || [];
    const category = categories[0]?.name || null;

    // Tags
    const tagTerms: WpTerm[] = post._embedded?.['wp:term']?.[1] || [];
    const tags = tagTerms.map((t) => t.name).join(', ') || null;

    // Featured image
    let coverImageUrl: string | null = null;
    let storagePath: string | null = null;
    const media = post._embedded?.['wp:featuredmedia']?.[0];
    if (media?.source_url) {
      console.log(`    ↓ Downloading cover image…`);
      const uploaded = await uploadImage(media.source_url, `post-${post.id}`);
      if (uploaded) {
        coverImageUrl = uploaded.publicUrl;
        storagePath = uploaded.path;
        console.log(`    ✓ Cover image uploaded`);
      }
    }

    // Publish date
    const publishedAt = post.date ? new Date(post.date) : new Date();

    try {
      await prisma.blogPost.create({
        data: {
          title,
          slug,
          content,
          excerpt,
          coverImageUrl,
          storagePath,
          category,
          tags,
          isPublished: true,
          publishedAt,
          wpId: post.id,
        },
      });
      console.log(`    ✓ Imported`);
      imported++;
    } catch (e) {
      console.error(`    ✗ DB insert failed: ${(e as Error).message}`);
      errors++;
    }
  }

  console.log(`\n✅ Migration complete`);
  console.log(`   Imported : ${imported}`);
  console.log(`   Skipped  : ${skipped} (already in DB)`);
  console.log(`   Errors   : ${errors}\n`);
}

// ── types ─────────────────────────────────────────────────────────────────────

interface WpPost {
  id: number;
  slug: string;
  date: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url: string }>;
    'wp:term'?: Array<WpTerm[]>;
  };
}

interface WpTerm {
  id: number;
  name: string;
  slug: string;
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
