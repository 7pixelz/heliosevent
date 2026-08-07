/**
 * One-time backfill: strips target="_blank" and rel="..." entirely from
 * internal links in stored BlogPost.content and Service.seoContent. The
 * Tiptap Link extension defaults every new link to those attributes
 * regardless of whether the URL is internal (fixed for new links going
 * forward in RichTextEditor.tsx / BlogEditClient.tsx + render-time cleanup in
 * lib/content.ts) — this cleans up everything authored before that fix. Safe
 * to re-run — rows needing no change are left untouched.
 *
 * Run: npx tsx scripts/fix-internal-nofollow.ts
 */

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';
import { cleanInternalLinks } from '../lib/content';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!.replace('?sslmode=require', ''),
  ssl: { rejectUnauthorized: false },
  max: 2,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);

async function run() {
  let updated = 0, unchanged = 0;

  const posts = await prisma.blogPost.findMany({ select: { id: true, slug: true, content: true } });
  console.log(`\n── Blog posts — ${posts.length} row(s)`);
  for (const post of posts) {
    const fixed = cleanInternalLinks(post.content);
    if (fixed !== post.content) {
      await prisma.blogPost.update({ where: { id: post.id }, data: { content: fixed } });
      console.log(`  ✓ ${post.slug}`);
      updated++;
    } else {
      unchanged++;
    }
  }

  const services = await prisma.service.findMany({ where: { seoContent: { not: null } }, select: { id: true, slug: true, seoContent: true } });
  console.log(`\n── Services (seoContent) — ${services.length} row(s)`);
  for (const svc of services) {
    const original = svc.seoContent!;
    const fixed = cleanInternalLinks(original);
    if (fixed !== original) {
      await prisma.service.update({ where: { id: svc.id }, data: { seoContent: fixed } });
      console.log(`  ✓ ${svc.slug}`);
      updated++;
    } else {
      unchanged++;
    }
  }

  console.log(`\n${'─'.repeat(40)}`);
  console.log(`Updated   : ${updated}`);
  console.log(`Unchanged : ${unchanged}`);
  console.log(`${'─'.repeat(40)}\n`);

  await prisma.$disconnect();
}

run().catch(e => { console.error(e); process.exit(1); });
