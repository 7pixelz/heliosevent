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
const img = (path: string) => `${BASE}/${path}`;

const EVENTS = [
  // ── Corporate Events ────────────────────────────────────────────
  {
    title: 'GYPROC Corporate Dealers Meet',
    slug: 'gyproc-corporate-dealers-meet',
    category: 'corporate-events',
    clientName: 'GYPROC',
    description: 'A high-energy dealers meet for GYPROC bringing together distributors, channel partners, and brand leadership for a day of strategy, recognition, and celebration.',
    coverImageUrl: img('2025/07/GYPROC-Corporate-Dealers-Meet-Eventing.jpg'),
    displayOrder: 1,
    images: [
      img('2025/07/GYPROC-Corporate-Dealers-Meet-Eventing.jpg'),
      img('2025/07/GYPROC-Dealers-Meet-Events-2.jpg'),
    ],
  },
  {
    title: 'Corporate Events Portfolio',
    slug: 'corporate-events-portfolio',
    category: 'corporate-events',
    description: 'A showcase of corporate event productions delivered by Helios Event — from product launches and leadership summits to award nights and brand activations.',
    coverImageUrl: img('2025/07/corporate-event-banner.jpg'),
    displayOrder: 2,
    images: [
      img('2025/07/corporate-event-banner.jpg'),
      img('2025/07/why-do-you-need-a-corporate-event-planner-in-chennai.jpg'),
    ],
  },

  // ── Employee Engagement ──────────────────────────────────────────
  {
    title: 'Employee Engagement Events',
    slug: 'employee-engagement-events',
    category: 'employee-engagement',
    description: 'Creative employee engagement programmes that foster team spirit, boost morale, and build lasting connections within organisations.',
    coverImageUrl: img('2025/07/employee-portfolio-1.png'),
    displayOrder: 3,
    images: [
      img('2025/07/employee-portfolio-1.png'),
      img('2025/07/employee-portfolio-2.jpg'),
      img('2025/07/employee-portfolio-3.jpg'),
      img('2025/07/employee-portfolio-4.jpg'),
      img('2025/07/employee-portfolio-5.jpg'),
      img('2025/07/employee-portfolio-6.jpg'),
      img('2025/07/employee-portfolio-7.jpg'),
      img('2025/07/employee-portfolio-8.png'),
      img('2025/07/employee-portfolio-9.png'),
      img('2025/07/employee-portfolio-10.png'),
      img('2025/07/employee-portfolio-11.jpg'),
    ],
  },

  // ── Seminars & Conferences ───────────────────────────────────────
  {
    title: 'RBI Conference',
    slug: 'rbi-conference',
    category: 'seminars-conferences',
    clientName: 'Reserve Bank of India',
    description: 'End-to-end execution of a high-profile Reserve Bank of India conference — seamless logistics, technical production, and protocol management.',
    coverImageUrl: img('2025/05/Case-Study-on-RBI-Conference-Execution3.jpg'),
    displayOrder: 4,
    images: [
      img('2025/05/Case-Study-on-RBI-Conference-Execution3.jpg'),
    ],
  },
  {
    title: 'Seminars & Conferences Portfolio',
    slug: 'seminars-conferences-portfolio',
    category: 'seminars-conferences',
    description: 'A portfolio of seminars, conferences, and knowledge-sharing events produced by Helios Event across industries — from academic summits to industry conclaves.',
    coverImageUrl: img('2025/07/seminar-1.jpg'),
    displayOrder: 5,
    images: [
      img('2025/07/seminar-1.jpg'),
      img('2025/07/seminar-2.jpg'),
      img('2025/07/seminar-3.jpg'),
      img('2025/07/seminar-4.jpg'),
      img('2025/07/seminar-5.jpg'),
      img('2025/07/seminar-6.jpg'),
      img('2025/07/seminar-7.jpg'),
      img('2025/07/seminar-8.jpg'),
      img('2025/07/seminar-9.jpg'),
      img('2025/07/seminar-10.jpg'),
      img('2025/08/Event-gallery-1.jpg'),
    ],
  },

  // ── Exhibitions ──────────────────────────────────────────────────
  {
    title: 'SCHUCO Exhibition, Chennai',
    slug: 'schuco-exhibition-chennai',
    category: 'exhibitions',
    clientName: 'SCHUCO',
    description: 'A premium brand exhibition for SCHUCO — featuring immersive product display zones, live demonstrations, and a curated visitor experience.',
    coverImageUrl: img('2025/07/SCHUCO-Exibition-Event-in-Chennai-1.jpg'),
    displayOrder: 6,
    images: [
      img('2025/07/SCHUCO-Exibition-Event-in-Chennai-1.jpg'),
    ],
  },
  {
    title: 'ISUZU Exhibition Event',
    slug: 'isuzu-exhibition',
    category: 'exhibitions',
    clientName: 'ISUZU',
    description: 'An automotive exhibition event for ISUZU featuring vehicle showcases, experiential test-drive zones, and branded display environments.',
    coverImageUrl: img('2025/07/ISUZU-Car-Exibition-Event.jpg'),
    displayOrder: 7,
    images: [
      img('2025/07/ISUZU-Car-Exibition-Event.jpg'),
      img('2025/07/ISUZU-Exibition-Event.jpg'),
    ],
  },
  {
    title: 'Exhibitions Portfolio',
    slug: 'exhibitions-portfolio',
    category: 'exhibitions',
    description: 'A showcase of exhibition and experiential installations designed and delivered by Helios Event — from trade show booths to immersive brand experience zones.',
    coverImageUrl: img('2025/07/exhibition-2.jpg'),
    displayOrder: 8,
    images: [
      img('2025/07/exhibition-2.jpg'),
      img('2025/07/ex1.png'),
      img('2025/07/ex2.png'),
      img('2025/07/ex3.png'),
    ],
  },

  // ── Sports Events ────────────────────────────────────────────────
  {
    title: 'Sports Events Portfolio',
    slug: 'sports-events-portfolio',
    category: 'sports-events',
    description: 'Corporate olympiads, tournaments, and sporting events managed end-to-end — venue, logistics, live scoring, and awards.',
    coverImageUrl: img('2025/07/sports-1.png'),
    displayOrder: 9,
    images: [
      img('2025/07/sports-1.png'),
      img('2025/07/sport-2.png'),
    ],
  },

  // ── Social & Wedding ─────────────────────────────────────────────
  {
    title: 'Weddings & Social Events',
    slug: 'weddings-social-events',
    category: 'social-wedding',
    description: 'Luxury weddings, sangeets, receptions, and milestone celebrations crafted with artistic décor, seamless execution, and deeply personal touches.',
    coverImageUrl: img('2025/07/wedding1.png'),
    displayOrder: 10,
    images: [
      img('2025/07/wedding1.png'),
      img('2025/07/wedding-2.png'),
      img('2025/07/wedding-3.png'),
      img('2025/07/wedding-4.png'),
      img('2025/07/wedding-5.png'),
      img('2025/07/wedding-6.png'),
      img('2025/07/wedding-7.png'),
      img('2025/07/wedding-8.png'),
      img('2025/07/wedding-9.png'),
      img('2025/07/wedding-10.png'),
      img('2025/07/wedding-11.png'),
      img('2025/07/wedding-12.png'),
      img('2025/07/wedding-13.png'),
    ],
  },
];

async function main() {
  console.log(`Seeding ${EVENTS.length} portfolio events…`);

  for (const ev of EVENTS) {
    const { images, ...fields } = ev;

    const existing = await prisma.portfolioEvent.findUnique({ where: { slug: ev.slug } });

    if (existing) {
      // Update fields but keep existing media
      await prisma.portfolioEvent.update({
        where: { slug: ev.slug },
        data: {
          title: fields.title,
          description: fields.description,
          category: fields.category,
          clientName: fields.clientName ?? null,
          coverImageUrl: fields.coverImageUrl ?? null,
          displayOrder: fields.displayOrder,
        },
      });
      console.log(`~ ${ev.title} (updated)`);
      continue;
    }

    await prisma.portfolioEvent.create({
      data: {
        ...fields,
        clientName: fields.clientName ?? null,
        coverImageUrl: fields.coverImageUrl ?? null,
        media: {
          create: images.map((url, i) => ({
            type: 'IMAGE',
            url,
            displayOrder: i,
          })),
        },
      },
    });
    console.log(`✓ ${ev.title} (${images.length} image${images.length !== 1 ? 's' : ''})`);
  }

  console.log('\nDone!');
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
