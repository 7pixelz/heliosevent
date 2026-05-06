/**
 * Seed blog post SEO meta from WordPress site
 * Run: npx tsx scripts/seed-blog-seo.ts
 *
 * For each BlogPost in the DB, fetches the corresponding WordPress page and
 * extracts the <title> and <meta name="description"> tags, then updates
 * metaTitle + metaDescription if they are currently empty.
 *
 * Safe to re-run — skips posts that already have metaTitle set.
 */

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as https from 'https';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!.replace('?sslmode=require', ''),
  ssl: { rejectUnauthorized: false },
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const WP_BASE = 'https://www.heliosevent.in/blog/';

function fetchHtml(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      // Follow a single redirect
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        fetchHtml(res.headers.location).then(resolve).catch(reject);
        return;
      }
      let body = '';
      res.setEncoding('utf8');
      res.on('data', chunk => { body += chunk; });
      res.on('end', () => resolve(body));
    });
    req.on('error', reject);
    req.setTimeout(15000, () => { req.destroy(); reject(new Error('timeout')); });
  });
}

function extractTitle(html: string): string | null {
  // Prefer <title> tag
  const m = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (!m) return null;
  const raw = m[1].trim();
  // Remove trailing " - Site Name" or " | Site Name" suffixes
  return raw.replace(/\s*[\-|]\s*Helios Event.*$/i, '').trim() || raw;
}

function extractDescription(html: string): string | null {
  // og:description first (usually cleaner), fall back to meta name=description
  const og = html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i)
    || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:description["']/i);
  if (og) return og[1].trim();

  const desc = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)
    || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i);
  if (desc) return desc[1].trim();

  return null;
}

async function main() {
  const posts = await prisma.blogPost.findMany({
    select: { id: true, slug: true, title: true, metaTitle: true, metaDescription: true },
    orderBy: { publishedAt: 'desc' },
  });

  console.log(`Found ${posts.length} blog posts in DB\n`);

  let updated = 0;
  let skipped = 0;
  let failed = 0;

  for (const post of posts) {
    if (post.metaTitle) {
      console.log(`  SKIP  ${post.slug} (already has metaTitle)`);
      skipped++;
      continue;
    }

    const url = `${WP_BASE}${post.slug}/`;
    try {
      const html = await fetchHtml(url);
      const title = extractTitle(html);
      const description = extractDescription(html);

      if (!title && !description) {
        console.log(`  MISS  ${post.slug} — no meta found at ${url}`);
        failed++;
        continue;
      }

      await prisma.blogPost.update({
        where: { id: post.id },
        data: {
          metaTitle: title || undefined,
          metaDescription: description || undefined,
        },
      });

      console.log(`  OK    ${post.slug}`);
      if (title) console.log(`        title: ${title}`);
      if (description) console.log(`        desc:  ${description.slice(0, 80)}…`);
      updated++;

      // Polite delay to avoid hammering the WP server
      await new Promise(r => setTimeout(r, 300));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.log(`  ERR   ${post.slug} — ${msg}`);
      failed++;
    }
  }

  console.log(`\nDone — updated: ${updated}, skipped: ${skipped}, failed/missed: ${failed}`);
  await prisma.$disconnect();
  await pool.end();
}

main().catch(e => { console.error(e); process.exit(1); });
