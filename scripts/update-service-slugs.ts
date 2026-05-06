import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!.replace('?sslmode=require', ''),
  ssl: { rejectUnauthorized: false },
});
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

const SLUG_MAP: Record<string, string> = {
  'corporate-events':           'corporate-event-management-in-chennai',
  'entertainment-events':       'entertainment-event-organizer-in-chennai',
  'government-protocol-events': 'government-events-planner-in-chennai',
  'mice-events':                'business-meeting-organizer-in-chennai',
  'exhibitions':                'exhibition-organizer-in-chennai',
  'sports-events':              'sports-event-management-company-in-chennai',
  'wedding-social-events':      'wedding-event-planner-in-chennai',
  'virtual-hybrid-events':      'virtual-hybrid-event-management-in-chennai',
  'gen-z-centric-events':       'gen-z-centric-event-management-in-chennai',
};

async function main() {
  for (const [oldSlug, newSlug] of Object.entries(SLUG_MAP)) {
    const svc = await prisma.service.findUnique({ where: { slug: oldSlug } });
    if (!svc) { console.log(`  SKIP  ${oldSlug} (not found)`); continue; }
    await prisma.service.update({ where: { slug: oldSlug }, data: { slug: newSlug } });
    console.log(`  OK    ${oldSlug}  →  ${newSlug}`);
  }
  await prisma.$disconnect();
  await pool.end();
}

main().catch(e => { console.error(e); process.exit(1); });
