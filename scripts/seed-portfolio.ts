import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!.replace('?sslmode=require', ''),
  ssl: { rejectUnauthorized: false },
});
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

const BASE = 'https://www.heliosevent.in/wp-content/uploads';

const item = (category: string, path: string, title?: string) => ({
  category,
  imageUrl: `${BASE}/${path}`,
  title: title || null,
});

const ITEMS = [
  // ── Corporate Events ───────────────────────────────────────────
  item('corporate-events', '2025/07/GYPROC-Corporate-Dealers-Meet-Eventing.jpg',   'GYPROC Corporate Dealers Meet'),
  item('corporate-events', '2025/07/GYPROC-Dealers-Meet-Events-2.jpg',             'GYPROC Dealers Meet'),
  item('corporate-events', '2025/07/why-do-you-need-a-corporate-event-planner-in-chennai.jpg', 'Corporate Event Planning'),
  item('corporate-events', '2025/07/corporate-event-banner.jpg',                   'Corporate Event'),

  // ── Employee Engagement ────────────────────────────────────────
  item('employee-engagement', '2025/07/employee-portfolio-1.png'),
  item('employee-engagement', '2025/07/employee-portfolio-2.jpg'),
  item('employee-engagement', '2025/07/employee-portfolio-3.jpg'),
  item('employee-engagement', '2025/07/employee-portfolio-4.jpg'),
  item('employee-engagement', '2025/07/employee-portfolio-5.jpg'),
  item('employee-engagement', '2025/07/employee-portfolio-6.jpg'),
  item('employee-engagement', '2025/07/employee-portfolio-7.jpg'),
  item('employee-engagement', '2025/07/employee-portfolio-8.png'),
  item('employee-engagement', '2025/07/employee-portfolio-9.png'),
  item('employee-engagement', '2025/07/employee-portfolio-10.png'),
  item('employee-engagement', '2025/07/employee-portfolio-11.jpg'),

  // ── Seminars & Conferences ─────────────────────────────────────
  item('seminars-conferences', '2025/07/seminar-1.jpg'),
  item('seminars-conferences', '2025/07/seminar-2.jpg'),
  item('seminars-conferences', '2025/07/seminar-3.jpg'),
  item('seminars-conferences', '2025/07/seminar-4.jpg'),
  item('seminars-conferences', '2025/07/seminar-5.jpg'),
  item('seminars-conferences', '2025/07/seminar-6.jpg'),
  item('seminars-conferences', '2025/07/seminar-7.jpg'),
  item('seminars-conferences', '2025/07/seminar-8.jpg'),
  item('seminars-conferences', '2025/07/seminar-9.jpg'),
  item('seminars-conferences', '2025/07/seminar-10.jpg'),
  item('seminars-conferences', '2025/08/Event-gallery-1.jpg',                      'Event Gallery'),
  item('seminars-conferences', '2025/05/Case-Study-on-RBI-Conference-Execution3.jpg', 'RBI Conference'),

  // ── Exhibitions ────────────────────────────────────────────────
  item('exhibitions', '2025/07/SCHUCO-Exibition-Event-in-Chennai-1.jpg',  'SCHUCO Exhibition, Chennai'),
  item('exhibitions', '2025/07/exhibition-2.jpg'),
  item('exhibitions', '2025/07/ISUZU-Car-Exibition-Event.jpg',            'ISUZU Car Exhibition'),
  item('exhibitions', '2025/07/ISUZU-Exibition-Event.jpg',               'ISUZU Exhibition'),
  item('exhibitions', '2025/07/ex1.png'),
  item('exhibitions', '2025/07/ex2.png'),
  item('exhibitions', '2025/07/ex3.png'),

  // ── Sports Events ──────────────────────────────────────────────
  item('sports-events', '2025/07/sports-1.png'),
  item('sports-events', '2025/07/sport-2.png'),

  // ── Social & Wedding Events ────────────────────────────────────
  item('social-wedding', '2025/07/wedding1.png'),
  item('social-wedding', '2025/07/wedding-2.png'),
  item('social-wedding', '2025/07/wedding-3.png'),
  item('social-wedding', '2025/07/wedding-4.png'),
  item('social-wedding', '2025/07/wedding-5.png'),
  item('social-wedding', '2025/07/wedding-6.png'),
  item('social-wedding', '2025/07/wedding-7.png'),
  item('social-wedding', '2025/07/wedding-8.png'),
  item('social-wedding', '2025/07/wedding-9.png'),
  item('social-wedding', '2025/07/wedding-10.png'),
  item('social-wedding', '2025/07/wedding-11.png'),
  item('social-wedding', '2025/07/wedding-12.png'),
  item('social-wedding', '2025/07/wedding-13.png'),
];

async function main() {
  console.log(`Seeding ${ITEMS.length} portfolio items…`);

  let added = 0;
  let skipped = 0;

  for (let i = 0; i < ITEMS.length; i++) {
    const it = ITEMS[i];
    const existing = await prisma.portfolioItem.findFirst({ where: { imageUrl: it.imageUrl } });
    if (existing) { skipped++; continue; }

    await prisma.portfolioItem.create({
      data: { ...it, displayOrder: i, isActive: true },
    });
    added++;
  }

  console.log(`Done! ${added} added, ${skipped} already existed.`);
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
