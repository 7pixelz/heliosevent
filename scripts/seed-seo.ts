import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL!.replace('?sslmode=require',''), ssl:{rejectUnauthorized:false} });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

const PAGES = [
  { pageKey:'home',      pageLabel:'Home Page',         metaTitle:'Event Management Company In Chennai | Event Organisers', metaDescription:'Helios Event Productions is a leading event management company in Chennai delivering corporate events, exhibitions, MICE, weddings, sports events and more across India and 20+ countries.', metaKeywords:'event management company chennai, corporate events chennai, helios event productions, event organisers chennai' },
  { pageKey:'about',     pageLabel:'About Us',           metaTitle:'About Helios Event Productions: Event Management Company', metaDescription:'Helios Event Productions has been organising exceptional events for 20+ years. Trusted by 100+ brands across India and abroad for corporate, MICE, entertainment and social events.', metaKeywords:'about helios event productions, event company chennai, event management team chennai' },
  { pageKey:'services',  pageLabel:'Services Listing',   metaTitle:'Best Event Service Provider In Chennai - Helios Events', metaDescription:'Explore the full range of event management services from Helios Event Productions — corporate events, MICE, exhibitions, sports events, weddings, government protocol and more.', metaKeywords:'event services chennai, best event service provider chennai, corporate event management, MICE events india' },
  { pageKey:'portfolio', pageLabel:'Portfolio',           metaTitle:'Event Portfolio | Events Organized by Helios Event', metaDescription:'Browse our portfolio of events — corporate meets, exhibitions, conferences, weddings, sports events and employee engagement programmes delivered across India and overseas.', metaKeywords:'event portfolio chennai, helios event gallery, corporate event photos india' },
  { pageKey:'blog',      pageLabel:'Blog',                metaTitle:'Event Management Blogs - Guides, Tips, Ideas - Helios Event', metaDescription:'Expert guides, tips and ideas on corporate event planning, MICE travel, team building, exhibitions and more from the Helios Event Productions team.', metaKeywords:'event management blog, corporate events tips, event planning india, event ideas chennai' },
  { pageKey:'contact',   pageLabel:'Contact Us',          metaTitle:'Contact Us For Event Management In Chennai - Helios Event', metaDescription:'Get in touch with Helios Event Productions for all your event planning needs. Reach our Chennai team for corporate events, weddings, exhibitions and MICE enquiries.', metaKeywords:'contact helios event, event company contact chennai, event management enquiry' },
  { pageKey:'get-quote', pageLabel:'Get a Quote',         metaTitle:'Get a Quote | Helios Event Productions Chennai', metaDescription:'Request a personalised event quote from Helios Event Productions. Tell us about your event requirements and we will craft a bespoke proposal within 24 hours.', metaKeywords:'event quote chennai, corporate event quote, plan event india, get event quote' },
];

async function main() {
  for (const p of PAGES) {
    await prisma.pageSeo.upsert({ where:{pageKey:p.pageKey}, update:p, create:p });
    console.log(`✓ ${p.pageLabel}`);
  }
  await prisma.$disconnect();
}
main().catch(e=>{console.error(e);process.exit(1)});
