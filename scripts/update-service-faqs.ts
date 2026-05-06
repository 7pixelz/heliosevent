import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!.replace('?sslmode=require', ''),
  ssl: { rejectUnauthorized: false },
});
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

const faq = (question: string, answer: string) => ({ question, answer });

const SERVICE_FAQS: Record<string, { question: string; answer: string }[]> = {
  'corporate-event-management-in-chennai': [
    faq('How does Helios create unique, immersive experiences for corporate events in Chennai?', 'We blend creative concepts with technology, incorporating interactive LED installations, AR/VR zones, dynamic stage designs, and themed décor to transform events into memorable brand narratives.'),
    faq('What is the typical timeline to plan a large-scale corporate event in Chennai?', 'For conferences and award nights, we suggest a 2–3 month lead time, while exhibitions and multi-day events benefit from a 4–6 month window for optimal planning and execution.'),
    faq('Do you handle government protocol or high-security events in Chennai?', 'Yes, Helios has extensive experience managing high-profile events with government dignitaries, coordinating with local authorities to ensure compliance and security measures are met.'),
    faq('How does Helios ensure brand consistency in corporate events in Chennai?', 'We collaborate with your marketing teams to align all elements — from stage design and collateral to digital screens and delegate kits — ensuring consistent brand messaging throughout the event.'),
    faq('What types of corporate events do you specialise in Chennai?', 'We specialise in conferences, dealer meets, award ceremonies, product launches, MICE events, and trade shows, along with entertainment and themed experiences.'),
    faq('Can Helios manage end-to-end event planning and execution in Chennai?', 'Yes, we provide comprehensive turnkey solutions from conceptualisation through post-event reporting, handling all aspects of event management.'),
  ],
  'entertainment-event-organizer-in-chennai': [
    faq('What entertainment events do you organise?', 'We plan and execute live shows, award nights, reality shows, celebrity events, festivals, fests, and live concerts with professional coordination and technical setup.'),
    faq('Do you handle large concerts?', 'Yes, we manage large concerts with equipment setup, crowd coordination, sound systems, stage production, artist handling, and safety measures for various audience sizes.'),
    faq('Can you organise celebrity and high-profile shows?', 'Yes, we coordinate celebrity events with careful scheduling, technical management, guest handling, and on-site logistics while maintaining quality throughout.'),
    faq('How much experience do you have with entertainment events?', 'With over 20 years of experience planning entertainment events across 12 countries, our team anticipates challenges and delivers engaging experiences every time.'),
    faq('Can you manage festival and fest planning?', 'Yes, we handle end-to-end festival planning including logistics, scheduling, stage design, performances, crowd flow, and entertainment segments.'),
    faq('What makes your entertainment event service different?', 'Our approach combines deep experience, attention to detail, the latest technology, and proactive challenge mitigation for smooth, audience-engaging events.'),
  ],
  'government-events-planner-in-chennai': [
    faq('What kinds of government events do you plan?', 'We plan ministry events and government body functions, ensuring each event is structured, compliant, and tailored to official requirements from start to finish.'),
    faq('Do you handle protocol and security requirements?', 'Yes. We work with officials to manage security, protocol and on-site coordination so events meet government standards and run smoothly without operational gaps.'),
    faq('Can Helios manage all aspects of my government event?', 'Absolutely. We provide end-to-end event planning, including design, logistics, technical setups, guest management and post-event reporting for government events.'),
    faq('How long does planning typically take for government events?', 'Timelines vary by event scale, but planning early helps ensure custom production, vendor coordination and seamless execution without last-minute stress.'),
    faq('Do you integrate technology into government events?', 'Yes. We use modern technology to support presentations, staging, sound and guest experiences to make events engaging and functionally effective.'),
    faq('Do you coordinate with local authorities for permits?', 'We handle all compliance and coordination, including working with local authorities for permits and clearances needed for official government events.'),
  ],
  'business-meeting-organizer-in-chennai': [
    faq('What services does Helios provide for business meetings and MICE events?', 'We plan and manage corporate meetings and MICE events, including destination gatherings, international meet-ups, and sightseeing tours, with full support from concept to execution.'),
    faq('How much experience does Helios Event have in MICE?', 'Helios Event has over 20 years of experience organising MICE and corporate events, having worked with hundreds of clients across multiple countries for professional, efficient event delivery.'),
    faq('Can you handle large corporate meetings and conferences?', 'Yes. We support events of various scales, from smaller meetings to large conferences and multi-day MICE events, with detailed planning and logistics management.'),
    faq('Can you organize international business meetings?', 'Yes, Helios Event specialises in organising international corporate meetings, handling logistics, venues, and travel arrangements to ensure seamless events worldwide.'),
    faq('What makes your business meeting planning different?', 'We emphasise attention to detail, use of modern event technology, and personalised planning tailored to corporate goals, aiming for smooth execution and memorable experiences.'),
    faq('Is end-to-end MICE planning included?', 'Yes. Helios Event manages everything from initial consultation and venue sourcing to technical setup, guest coordination, and post-event activities.'),
  ],
  'exhibition-organizer-in-chennai': [
    faq('What exhibition services do you provide?', 'We plan and manage exhibitions, from concept and stall design to logistics and attendee engagement, helping companies showcase products and attract sponsors effectively for memorable expo experiences.'),
    faq('How long does exhibition planning take?', 'Planning depends on event size, but larger multi-day exhibitions typically need months of preparation for venue arrangements, custom fabrication, and smooth execution.'),
    faq('Do you handle stall design and setup?', 'Yes. We create custom stall designs and 3D layouts, integrating technology and branding to help your booths stand out to visitors and clients.'),
    faq('Will you manage exhibitors and sponsors?', 'We coordinate exhibitor registrations, sponsor packages, and event requirements to maintain smooth interactions and ensure both exhibitors and sponsors are well taken care of.'),
    faq('Can you promote the exhibition?', 'Yes. Our promotion strategies include reaching target audiences, increasing visibility, and driving attendance through coordinated marketing efforts for better event turnout.'),
    faq('Do you offer end-to-end exhibition support?', 'Absolutely. From planning, venue sourcing, technical setup, and on-ground coordination to post-event review, we cover every aspect to deliver a professionally managed exhibition.'),
  ],
  'sports-event-management-company-in-chennai': [
    faq('What sports events do you organise?', 'We handle marathons, annual sports days, cyclothons, treasure hunts, car rallies, endurance races, adventure challenges and more — tailored to your specific needs in Chennai.'),
    faq('How soon should I book your sports event service?', 'For best results, book at least 8–12 weeks before your event date to secure venues, permits, staffing, and equipment without last-minute complications.'),
    faq('Do you handle permits and safety arrangements?', 'Yes. We coordinate local permissions, risk assessments, medical safety plans and crowd control to ensure compliance and participant security throughout.'),
    faq('Can you manage large participant numbers?', 'We handle events from small 100–500 participant gatherings to large competitions above 500 attendees, including registration and coordination processes.'),
    faq('What support do you offer on event day?', 'On the day of the event we provide full coordination, technical support, staff direction, emergency response readiness, timing systems, volunteer oversight and vendor management.'),
    faq('Will you help with event promotion and registrations?', 'Yes — we support online registrations, promotional planning and participant communication for maximum visibility and smooth enrolment.'),
  ],
  'wedding-event-planner-in-chennai': [
    faq('What services are included in your wedding planning?', 'Helios Event handles venue search, catering, decoration, entertainment, guest management, photography, hairstylists, rituals, invitations and more to ensure comprehensive Chennai wedding organisation and seamless execution.'),
    faq('Do you offer custom wedding packages?', 'Yes, we create flexible arrangements based on your specific needs, budget, and celebration size, allowing you to select various service combinations or request fully tailored planning aligned with your vision.'),
    faq('Can you manage weddings at different locations in Chennai?', 'Absolutely. Our planners work across Chennai and nearby areas, assisting with suitable venue selection and coordinating logistics, catering, décor, and guest services regardless of celebration location.'),
    faq('Will a planner be present on the wedding day?', 'Yes, a dedicated planner oversees the event from beginning to end, managing vendor coordination, schedules, setup, and guest requirements so you can focus on enjoying the celebration.'),
    faq('How far in advance should I book wedding planning services?', 'Booking several months ahead is recommended to secure preferred venues, trusted vendors, and adequate planning time for a smoother overall experience.'),
    faq('Do you coordinate with external vendors like photographers and caterers?', 'Yes, the team works with trusted photographers, caterers, entertainers, and other vendors, managing communication, timelines, and quality standards throughout your wedding.'),
  ],
};

async function main() {
  for (const [slug, faqs] of Object.entries(SERVICE_FAQS)) {
    const svc = await prisma.service.findUnique({ where: { slug } });
    if (!svc) { console.log(`  SKIP  ${slug} (not found)`); continue; }
    await prisma.service.update({
      where: { slug },
      data: { faqs: JSON.stringify(faqs) },
    });
    console.log(`  OK    ${slug} — ${faqs.length} FAQs`);
  }
  await prisma.$disconnect();
  await pool.end();
}

main().catch(e => { console.error(e); process.exit(1); });
