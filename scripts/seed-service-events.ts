import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!.replace('?sslmode=require', ''),
  ssl: { rejectUnauthorized: false },
});
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

const sig = (icon: string, title: string, desc: string) => ({ icon, title, desc });
const diff = (title: string, desc: string) => ({ title, desc });

const SERVICES = [
  {
    type: 'MAIN',
    icon: '🎤',
    name: 'Corporate Events',
    slug: 'corporate-event-management-in-chennai',
    description: 'Conferences, product launches & award nights crafted to impress.',
    heroHeadline: 'Corporate Events, Delivered With Finesse',
    heroSubtitle: 'From boardroom strategy summits to large-scale annual meets, we design and execute corporate events that align with your brand, energise your people, and leave a lasting impression.',
    whatWeDo: 'Helios Event specialises in the full spectrum of corporate event management — from intimate leadership retreats to large-scale townhalls and innovation hackathons. We handle concept, logistics, production, and on-ground execution so your team can focus on what matters.',
    displayOrder: 1,
    signatureEvents: [
      sig('🌍', 'Global Leadership Retreats', 'Theme-based retreats designed to align leadership vision and drive strategic clarity.'),
      sig('🧠', 'Executive Simulation Labs', 'Immersive simulations that sharpen decision-making and executive presence.'),
      sig('🏢', 'Annual Business Meets & Townhalls', 'Large-format internal events that connect leadership with the entire organisation.'),
      sig('💡', 'Innovation Hackathons', 'Structured hackathons for global and cross-functional teams to solve real challenges.'),
      sig('🏆', 'Corporate Olympics', 'Multi-sport, multi-team competitions that build culture, energy, and camaraderie.'),
      sig('🔐', 'Escape Room Challenges', 'Customised escape room experiences that drive teamwork under pressure.'),
      sig('🥽', 'AR/VR Team Challenges', 'Next-gen team experiences using augmented and virtual reality technology.'),
      sig('🤝', 'Curated Networking Mixers', 'Structured networking events with ice-breakers and curated introductions.'),
    ],
    differentiators: [
      diff('End-to-End Execution', 'From concept to close, we manage every detail so you don\'t have to.'),
      diff('Brand-First Design', 'Every element is aligned with your brand identity and company culture.'),
      diff('Experienced Team', '15+ years of delivering corporate events across India and globally.'),
      diff('Scalable Formats', 'From 50-person offsites to 5,000-person townhalls — we scale seamlessly.'),
      diff('Post-Event Analytics', 'We provide engagement reports and feedback summaries after every event.'),
    ],
    faqs: [
      { question: 'How early should we book for a corporate event?', answer: 'We recommend booking at least 4–6 weeks in advance for mid-size events and 3+ months for large-scale conferences or destination retreats.' },
      { question: 'Do you handle venue sourcing?', answer: 'Yes — venue scouting, negotiation, and booking are all part of our full-service package.' },
      { question: 'Can you manage virtual or hybrid corporate events?', answer: 'Absolutely. We have a dedicated virtual production team for hybrid summits and fully online events.' },
      { question: 'Do you provide AV and technical production?', answer: 'Yes, our in-house production team handles all AV, lighting, stage design, and live streaming.' },
      { question: 'What cities do you operate in?', answer: 'We are headquartered in Chennai and operate pan-India as well as internationally.' },
    ],
  },
  {
    type: 'MAIN',
    icon: '🎭',
    name: 'Entertainment Events',
    slug: 'entertainment-event-organizer-in-chennai',
    description: 'Live shows, concerts & cultural events with professional production.',
    heroHeadline: 'Entertainment Events That Create Memories',
    heroSubtitle: 'High-energy, experience-led entertainment events that your audience will talk about long after the night ends.',
    whatWeDo: 'We produce entertainment events that are bold, immersive, and unforgettable — from celebrity nights and live concerts to themed parties and pop culture festivals. Our production team handles every technical and creative element.',
    displayOrder: 2,
    signatureEvents: [
      sig('🎵', 'Live Concerts & Celebrity Nights', 'End-to-end artist management, stage production, and audience experience.'),
      sig('😂', 'Stand-up Comedy Shows', 'Curated line-ups of top comedians for corporate and public audiences.'),
      sig('🌏', 'Cultural Fusion Nights', 'Multi-cultural celebrations blending music, food, and performance art.'),
      sig('🎉', 'Themed Parties', 'Bollywood, Retro, Futuristic — fully immersive themed event experiences.'),
      sig('🍹', 'Mixology Battles', 'Interactive cocktail competitions that entertain and engage guests.'),
      sig('🍳', 'Global Cooking Competitions', 'Team-based culinary events that combine fun and gastronomy.'),
      sig('🎪', 'Immersive Theatre Experiences', 'Story-driven, interactive theatre formats for unforgettable engagement.'),
      sig('🎧', 'EDM Nights & DJ Festivals', 'Professional DJ line-ups, stage lighting, and crowd management.'),
    ],
    differentiators: [
      diff('Creative Direction', 'In-house creative team that designs unique concepts for each event.'),
      diff('Artist Management', 'We handle all artist bookings, contracts, riders, and logistics.'),
      diff('Production Excellence', 'World-class stage, lighting, and sound setups for any scale.'),
      diff('Crowd Experience Design', 'We design the full audience journey, not just the stage.'),
      diff('Safety & Compliance', 'Fully licensed events with security, crowd management, and emergency protocols.'),
    ],
    faqs: [
      { question: 'Can you book celebrity performers?', answer: 'Yes — we have established relationships with artists, celebrities, and agencies across India.' },
      { question: 'Do you manage ticketing for public events?', answer: 'Yes, we can handle ticketing, registration, and entry management for public-facing events.' },
      { question: 'What is the minimum event size you work with?', answer: 'We work with events from 100 to 50,000+ attendees depending on the format.' },
      { question: 'Do you provide event insurance?', answer: 'We work with event insurance partners and can guide you through the process.' },
    ],
  },
  {
    type: 'MAIN',
    icon: '🏛️',
    name: 'Government & Protocol Events',
    slug: 'government-events-planner-in-chennai',
    description: 'Official ceremonies & state functions with utmost precision & protocol.',
    heroHeadline: 'Government & Protocol Events, Executed With Precision',
    heroSubtitle: 'Highly structured, compliance-heavy events handled with the dignity, precision, and professionalism they demand.',
    whatWeDo: 'We manage government summits, state ceremonies, diplomatic receptions, and public inaugurations with strict adherence to protocol, security requirements, and official guidelines. Our team is experienced in coordinating with government bodies and diplomatic missions.',
    displayOrder: 3,
    signatureEvents: [
      sig('🌐', 'Government Summits & Bilateral Meets', 'High-security, protocol-driven summits between government bodies and delegations.'),
      sig('🤝', 'State Visits & Diplomatic Receptions', 'Formal reception events for visiting dignitaries with full protocol management.'),
      sig('📋', 'Policy Launch Events', 'Public and media-facing launches of government initiatives and policy announcements.'),
      sig('🏗️', 'Public Infrastructure Inaugurations', 'Grand opening ceremonies for public infrastructure with official proceedings.'),
      sig('🏅', 'Award Ceremonies (State/National)', 'Official award functions at state and national level with full ceremonial setup.'),
      sig('🇮🇳', 'Republic & Independence Day Events', 'Flag hoisting ceremonies, cultural programmes, and march-pasts managed with precision.'),
      sig('✈️', 'Trade Delegation Hosting', 'End-to-end hosting of international trade delegations including hospitality and protocol.'),
      sig('🎎', 'Cultural Exchange Programs', 'Multi-cultural events that celebrate heritage and foster international relations.'),
    ],
    differentiators: [
      diff('Protocol Expertise', 'Deep understanding of government and diplomatic protocol across event types.'),
      diff('Security Coordination', 'Experienced in coordinating with security agencies and SPG/Z-category requirements.'),
      diff('Government Liaison', 'We manage all official paperwork, permissions, and departmental coordination.'),
      diff('Multilingual Capability', 'Support for events requiring translation, interpretation, and multilingual collateral.'),
      diff('Flawless Track Record', 'Zero-incident record across all government and diplomatic events managed.'),
    ],
    faqs: [
      { question: 'Do you have experience working with central government bodies?', answer: 'Yes — we have worked with central and state government departments across multiple events.' },
      { question: 'Can you manage events requiring Z-category security?', answer: 'Yes, we have experience coordinating with security agencies for high-security events.' },
      { question: 'Do you handle permits and official approvals?', answer: 'Yes — our team manages all necessary permissions, police NOCs, and official approvals.' },
    ],
  },
  {
    type: 'MAIN',
    icon: '✈️',
    name: 'MICE Events',
    slug: 'business-meeting-organizer-in-chennai',
    description: 'Meetings, incentives, conferences & exhibitions — seamlessly coordinated.',
    heroHeadline: 'MICE Events — Where Business Meets Experience',
    heroSubtitle: 'Formalized, travel-driven MICE events that combine business objectives with memorable experiences.',
    whatWeDo: 'MICE — Meetings, Incentives, Conferences, and Exhibitions — requires a unique blend of logistics, hospitality, and event production. We deliver end-to-end MICE management including venue, travel, content, and delegate experience.',
    displayOrder: 4,
    signatureEvents: [
      sig('🌍', 'Hybrid Global Summits', 'Multi-location summits connecting in-person and virtual attendees seamlessly.'),
      sig('📊', 'Annual Conferences & Conclaves', 'Full-service conference management from speaker curation to delegate management.'),
      sig('🤝', 'Partner & Investor Meets', 'Intimate, high-stakes business meetings designed for maximum impact.'),
      sig('🏆', 'Corporate Wellness Retreats', 'Incentive travel programmes combining wellness, team bonding, and rewards.'),
      sig('🌴', 'Luxury Offsites & Destination Experiences', 'Premium incentive trips to domestic and international destinations.'),
      sig('🧗', 'Adventure-Based Incentives', 'Adrenaline-fuelled team challenges in scenic outdoor locations.'),
      sig('🔬', 'Interactive Demo Labs', 'Exhibition-style product demonstration spaces within conferences.'),
      sig('🎯', 'Customer Experience Summits', 'Events that bring customers, partners, and leadership together around shared goals.'),
    ],
    differentiators: [
      diff('Travel & Hospitality Management', 'We manage flights, hotels, transfers, and visa coordination for all delegates.'),
      diff('Content & Speaker Management', 'From keynote sourcing to panel moderation — we manage the full conference agenda.'),
      diff('Delegate Experience Design', 'Every touchpoint from registration to farewell is crafted for maximum impact.'),
      diff('ROI-Focused Planning', 'We align every element with your business objectives and measurable outcomes.'),
      diff('Global Network', 'Partnerships with venues, DMCs, and vendors across India, SE Asia, Middle East, and Europe.'),
    ],
    faqs: [
      { question: 'Do you manage international MICE events?', answer: 'Yes — we have delivered MICE programmes in Singapore, Dubai, Bangkok, Bali, and across Europe.' },
      { question: 'What does your incentive travel package include?', answer: 'Flights, accommodation, transfers, activities, gala dinners, and all ground logistics.' },
      { question: 'Can you manage delegate registration and badge printing?', answer: 'Yes — we provide end-to-end delegate management including online registration, badge printing, and check-in systems.' },
    ],
  },
  {
    type: 'MAIN',
    icon: '🏟️',
    name: 'Exhibitions & Experiential',
    slug: 'exhibition-organizer-in-chennai',
    description: 'Immersive brand experience zones and turnkey expo booths that attract and convert.',
    heroHeadline: 'Exhibitions & Experiential Installations',
    heroSubtitle: 'Design-heavy, brand storytelling spaces that create immersive experiences and drive real engagement.',
    whatWeDo: 'We design and build exhibition booths, experiential installations, and brand experience zones that tell your story in three dimensions. From trade show participation to immersive pop-up activations, we combine design, technology, and storytelling.',
    displayOrder: 5,
    signatureEvents: [
      sig('🌌', 'Immersive Brand Experience Zones', 'Multi-sensory brand spaces that create deep emotional connections with visitors.'),
      sig('🌍', '"Around the World" Experiential Zones', 'Themed zones that transport visitors to different cultural or brand universes.'),
      sig('🏢', 'Trade Exhibitions & Expos', 'End-to-end booth design, build, and management for trade shows and expos.'),
      sig('🎨', 'Art Installations & Interactive Galleries', 'Custom art and interactive installations that generate social media and PR coverage.'),
      sig('🚀', 'Product Launch Display Booths', 'High-impact product launch environments designed to wow media and buyers.'),
      sig('🥽', 'Tech Experience Centers (AR/VR)', 'AR and VR-powered experience zones for tech brands and product showcases.'),
      sig('🏬', 'Pop-up Brand Installations', 'Short-run brand activations in malls, airports, and high-footfall locations.'),
    ],
    differentiators: [
      diff('In-House Design Studio', 'Our designers create 3D renders and production drawings before a single nail is hammered.'),
      diff('Fabrication & Build', 'We own fabrication capability — faster turnaround and better quality control.'),
      diff('Technology Integration', 'AR, VR, touchscreens, and interactive displays built into booth and zone design.'),
      diff('Sustainability Options', 'Reusable and modular booth systems for brands with ESG commitments.'),
      diff('Post-Show Storage', 'We offer storage and refurbishment of booth assets for repeat shows.'),
    ],
    faqs: [
      { question: 'Do you design and build exhibition booths?', answer: 'Yes — we handle concept, design, fabrication, installation, and dismantling of exhibition booths.' },
      { question: 'Can you work with our brand guidelines?', answer: 'Absolutely. All designs are created in strict alignment with your brand identity and guidelines.' },
      { question: 'Do you manage the logistics of booth materials across cities?', answer: 'Yes — we handle transportation, customs (for international shows), and storage.' },
    ],
  },
  {
    type: 'MAIN',
    icon: '⚽',
    name: 'Sports Events',
    slug: 'sports-event-management-company-in-chennai',
    description: 'Tournaments, fitness events & athletic experiences with complete logistics.',
    heroHeadline: 'Sports Events — Competitive, Energetic, Unforgettable',
    heroSubtitle: 'From corporate olympiads to charity marathons and e-sports tournaments — we manage every element of sporting event production.',
    whatWeDo: 'We manage the full lifecycle of sports events — from venue selection and participant registration to live scoring, awards, and broadcast. Whether it\'s a 50-person corporate cricket match or a 5,000-person charity run, we deliver it flawlessly.',
    displayOrder: 6,
    signatureEvents: [
      sig('🏅', 'Corporate Olympics', 'Multi-sport, multi-team competitions spanning a full day with ceremonies and awards.'),
      sig('🏃', 'Charity Runs & Marathons', 'Mass participation running events with route management, timing chips, and medals.'),
      sig('🏏', 'Inter-Company Tournaments', 'Cricket, football, and multi-sport leagues between corporates with branding and coverage.'),
      sig('💪', 'Fitness Bootcamps & HIIT Events', 'High-energy fitness events led by certified trainers for corporate wellness programmes.'),
      sig('🧗', 'Adventure Sports Events', 'Trekking, obstacle races, and outdoor challenge events in scenic locations.'),
      sig('🎮', 'E-Sports Tournaments', 'Online and LAN-based gaming tournaments with live commentary and prize pools.'),
      sig('🥇', 'League-Based Competitions', 'Season-long sporting leagues with fixtures, standings, and playoffs.'),
      sig('🏟️', 'Stadium Events & Sports Days', 'Large-format sports days with multi-activity zones and crowd entertainment.'),
    ],
    differentiators: [
      diff('Sports Management Expertise', 'Dedicated sports event team with experience across 20+ sports formats.'),
      diff('Live Scoring & Broadcast', 'Real-time score tracking, live commentary, and video coverage options.'),
      diff('Participant Management', 'Online registration, jersey distribution, scheduling, and communication.'),
      diff('Safety First', 'Qualified first aid, safety officers, and emergency protocols at every event.'),
      diff('Awards & Memorabilia', 'Custom trophies, medals, certificates, and branded merchandise.'),
    ],
    faqs: [
      { question: 'Can you manage a cricket tournament for 500 employees?', answer: 'Yes — we handle venue, teams, fixtures, umpires, catering, live scoring, and the awards ceremony.' },
      { question: 'Do you manage e-sports events?', answer: 'Yes — we set up gaming infrastructure, manage brackets, provide commentary, and stream live.' },
      { question: 'Can you organise a charity marathon in Chennai?', answer: 'Yes — we manage route planning, permissions, timing chips, participant kits, and post-event awards.' },
    ],
  },
  {
    type: 'MAIN',
    icon: '💒',
    name: 'Weddings & Social Events',
    slug: 'wedding-event-planner-in-chennai',
    description: 'Luxury weddings, milestone celebrations & private events with artistic décor.',
    heroHeadline: 'Weddings & Social Events — Your Moments, Perfected',
    heroSubtitle: 'Emotion-led, high-personalisation events for the moments that matter most in life.',
    whatWeDo: 'We create deeply personal event experiences — from destination weddings and luxury sangeets to milestone birthdays and family celebrations. Every element is designed around your story, your aesthetic, and your guests.',
    displayOrder: 7,
    signatureEvents: [
      sig('💍', 'Destination & Luxury Weddings', 'Fully planned destination weddings across India and internationally.'),
      sig('💐', 'Engagements & Receptions', 'Intimate and grand reception events with bespoke décor and hospitality.'),
      sig('🎵', 'Sangeet & Themed Celebrations', 'Musical, dance, and performance-led pre-wedding celebrations.'),
      sig('🎂', 'Birthday & Milestone Celebrations', 'Surprise parties, landmark birthdays, and anniversary events.'),
      sig('🥂', 'Private Luxury Parties', 'Exclusive private events with curated experiences and premium hospitality.'),
      sig('👨‍👩‍👧', 'Family Day Events', 'Fun-filled family events that blend corporate culture with social celebration.'),
      sig('🕯️', 'Cultural & Religious Ceremonies', 'Respectful, detailed execution of traditional ceremonies across cultures.'),
      sig('🌸', 'Baby Showers & Anniversaries', 'Intimate celebrations designed with personalised themes and décor.'),
    ],
    differentiators: [
      diff('Personal Consultation', 'Every wedding and social event begins with a deep personal consultation to understand your vision.'),
      diff('Décor & Styling', 'In-house styling team creating floral, fabric, and lighting designs that match your aesthetic.'),
      diff('Vendor Curation', 'We work with the best photographers, caterers, entertainers, and hospitality partners.'),
      diff('Day-Of Coordination', 'A dedicated event manager is on-site throughout your event day.'),
      diff('Complete Packages', 'From mehendi to reception — we offer bundled multi-day wedding packages.'),
    ],
    faqs: [
      { question: 'Do you manage destination weddings outside Chennai?', answer: 'Yes — we plan weddings across India and in popular international destinations like Bali, Dubai, and Europe.' },
      { question: 'Do you provide wedding photography and videography?', answer: 'We work with a curated network of photographers and videographers — we can recommend or include them in your package.' },
      { question: 'What is the minimum budget for a luxury wedding package?', answer: 'Our luxury wedding packages start from ₹15 lakhs. Contact us for a personalised quote.' },
    ],
  },
  {
    type: 'MAIN',
    icon: '⚡',
    name: 'Gen Z-Centric Events',
    slug: 'gen-z-centric-event-management-in-chennai',
    description: 'Experience-first event design built for the creator generation — bold, shareable, and purpose-driven.',
    heroHeadline: 'Gen Z-Centric Events — Bold, Shareable & Purpose-Driven',
    heroSubtitle: 'A design lens applied across all events — built for the generation that co-creates content, demands authenticity, and experiences life through a phone screen.',
    whatWeDo: 'Gen Z isn\'t just an audience — they\'re participants, co-creators, and amplifiers. We layer Gen Z-centric design thinking onto any event format: corporate, entertainment, sports, or social. The result? Events that trend, get shared, and feel genuinely alive. This isn\'t a category — it\'s a philosophy we embed into every brief.',
    displayOrder: 9,
    signatureEvents: [
      sig('🎬', 'Creator-Led Sessions', 'Format events around influencers and content creators who speak the Gen Z language authentically.'),
      sig('📸', 'Reel-Making & Content Zones', 'Dedicated, production-ready zones where attendees shoot, edit, and post content live at your event.'),
      sig('🎮', 'Gamified Challenges', 'Points, leaderboards, live quests, and rewards embedded throughout the event journey.'),
      sig('🌈', 'Instagrammable Installations', 'Art-directed photo moments and larger-than-life installations designed to go viral.'),
      sig('🎭', 'Pop-Culture Integrations', 'Event themes, references, and aesthetics pulled from current pop culture, memes, and trends.'),
      sig('🌱', 'Purpose-Driven Experiences', 'Sustainability, inclusivity, and social impact woven into the event narrative — not as a box-tick, but as a core design element.'),
      sig('🤝', 'Community-First Formats', 'Peer-to-peer, open-floor, and unconference-style formats that put audience in the driver\'s seat.'),
    ],
    differentiators: [
      diff('Trend-Forward Creative', 'Our creative team tracks Gen Z culture in real time and brings it into your event design.'),
      diff('Content-First Planning', 'Every element is designed to be documented — from set design to programming flow.'),
      diff('Authentic Talent Curation', 'We source creators and talent with genuine Gen Z followings, not just celebrity names.'),
      diff('Interactive Tech', 'Live polls, real-time leaderboards, AR filters, and audience response systems built in.'),
      diff('Post-Event Amplification', 'We help activate content collected at the event for brand social channels and PR.'),
    ],
    faqs: [
      { question: 'Is Gen Z event design only for youth brands?', answer: 'No — any brand engaging employees, customers, or delegates under 35 benefits from Gen Z-centric design thinking.' },
      { question: 'Can this be layered onto our existing corporate event?', answer: 'Absolutely. This is a design overlay, not a separate event type. We integrate it into your existing event format.' },
      { question: 'How do you measure success for these events?', answer: 'We track social impressions, content generated, engagement rate, and post-event sentiment alongside traditional metrics.' },
      { question: 'Do you work with influencers and content creators?', answer: 'Yes — we have a curated network of creators across categories who specialise in event-led content.' },
    ],
  },
  {
    type: 'MAIN',
    icon: '💻',
    name: 'Virtual & Hybrid Events',
    slug: 'virtual-hybrid-event-management-in-chennai',
    description: 'Digital-first events — virtual conferences, hybrid summits & live-streamed launches.',
    heroHeadline: 'Virtual & Hybrid Events — Scale Without Limits',
    heroSubtitle: 'Very relevant for scale and Gen Z audiences — digital-first event experiences that connect people wherever they are.',
    whatWeDo: 'We design and produce virtual and hybrid events that match the energy and professionalism of in-person experiences. From metaverse events and AI-based matchmaking to live-streamed product launches and virtual award ceremonies.',
    displayOrder: 8,
    signatureEvents: [
      sig('🎙️', 'Virtual Conferences & Webinars', 'Production-quality virtual events with live Q&A, polls, and networking lounges.'),
      sig('🌐', 'Hybrid Global Summits', 'Seamlessly connecting in-person and remote audiences in a single experience.'),
      sig('⚡', 'Virtual Hackathons', 'Online team challenges with real-time judging, collaboration tools, and prizes.'),
      sig('☕', 'Online Networking Lounges', 'Structured virtual networking with breakout rooms and conversation prompts.'),
      sig('🤖', 'AI-Based Matchmaking Events', 'Smart networking events using AI to connect attendees based on shared goals.'),
      sig('🌌', 'Metaverse Events & Virtual Expo Halls', 'Immersive virtual environments for brand experiences and exhibitions.'),
      sig('📡', 'Live-Streamed Product Launches', 'Multi-platform live streams with production quality for product and brand launches.'),
      sig('🏆', 'Digital Award Ceremonies', 'Fully virtual award shows with pre-recorded performances and live announcements.'),
    ],
    differentiators: [
      diff('Broadcast-Quality Production', 'Studio-grade cameras, lighting, and direction for every virtual event.'),
      diff('Platform Agnostic', 'We work across Zoom, Teams, Hopin, Airmeet, Gather, and custom platforms.'),
      diff('Technical Support', 'Dedicated tech support team available throughout the event duration.'),
      diff('Engagement Design', 'Polls, games, breakouts, and interactive elements built into every session.'),
      diff('Global Reach', 'Events delivered to audiences across time zones with multi-language support.'),
    ],
    faqs: [
      { question: 'What platforms do you support for virtual events?', answer: 'We work with Zoom, Teams, Hopin, Airmeet, Gather.town, and can also build custom virtual environments.' },
      { question: 'Can you live-stream to YouTube and LinkedIn simultaneously?', answer: 'Yes — we can multistream to all major platforms simultaneously.' },
      { question: 'How do you keep virtual audiences engaged?', answer: 'Through live polls, gamification, breakout rooms, networking lounges, and interactive activities designed specifically for online audiences.' },
    ],
  },
];

async function main() {
  console.log('Updating services with event types from PDF...');

  // Process each service
  for (const svc of SERVICES) {
    const { signatureEvents, differentiators, faqs, ...fields } = svc;

    await prisma.service.upsert({
      where: { slug: svc.slug },
      update: {
        ...fields,
        signatureEvents: JSON.stringify(signatureEvents),
        differentiators: JSON.stringify(differentiators),
        faqs: JSON.stringify(faqs),
        updatedAt: new Date(),
      },
      create: {
        ...fields,
        signatureEvents: JSON.stringify(signatureEvents),
        differentiators: JSON.stringify(differentiators),
        faqs: JSON.stringify(faqs),
      },
    });

    console.log(`✓ ${svc.name}`);
  }

  // Remove old services no longer in the list
  const activeSlugs = SERVICES.map(s => s.slug);
  const removed = await prisma.service.deleteMany({
    where: { type: 'MAIN', slug: { notIn: activeSlugs } },
  });

  if (removed.count > 0) console.log(`Removed ${removed.count} old service(s)`);

  console.log('\nDone! All 9 services updated with event types.');
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
