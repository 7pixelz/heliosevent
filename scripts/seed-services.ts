import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!.replace('?sslmode=require', ''),
  ssl: { rejectUnauthorized: false },
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const mainServices = [
  {
    icon: '🎤', name: 'Corporate Events', slug: 'corporate-events', displayOrder: 1,
    description: 'Conferences, product launches & award nights crafted to impress.',
    heroHeadline: 'Corporate Events, Delivered With Finesse',
    heroSubtitle: 'The success of your corporate event depends on how it influences the bottom line of your business. We have delivered hundreds of successful corporate events for leading brands across India.',
    whatWeDo: 'We specialise in end-to-end corporate event management — from initial concept and planning to flawless on-ground execution. Our team aligns every event element with your brand identity and business objectives, ensuring a memorable experience for every attendee.',
    signatureEvents: JSON.stringify([
      { icon: '👥', title: 'Employee Engagement', desc: 'Events designed to motivate, recognise and connect your workforce.' },
      { icon: '🎙️', title: 'Seminars & Conferences', desc: 'Professional knowledge-sharing summits and industry conclaves.' },
      { icon: '🚀', title: 'Brand & Product Launches', desc: 'High-impact launches that generate buzz and drive market adoption.' },
      { icon: '🤝', title: 'Dealer/Channel Partner Meetings', desc: 'Strategic partner events that strengthen business relationships.' },
      { icon: '📰', title: 'Press Meets', desc: 'Media events crafted to maximise coverage and brand visibility.' },
      { icon: '📣', title: 'BTL Activations', desc: 'Below-the-line campaigns that create direct brand engagement.' },
    ]),
    differentiators: JSON.stringify([
      { title: '20+ Years Experience', desc: 'Two decades of delivering successful corporate events across India and beyond.' },
      { title: 'Business-Experience Alignment', desc: 'Every element is aligned with your brand identity and business goals.' },
      { title: 'Attention to Detail', desc: 'From logistics to décor, nothing is left to chance.' },
      { title: 'Latest Technology Access', desc: 'Cutting-edge AV, virtual event platforms, and experiential tech.' },
      { title: 'Transparency', desc: 'Clear communication, honest timelines, and no hidden costs.' },
    ]),
    faqs: JSON.stringify([
      { question: 'How far in advance should we book?', answer: 'We recommend 2–3 months for standard corporate events and 4–6 months for large-scale conferences or award ceremonies.' },
      { question: 'Do you handle government protocol events?', answer: 'Yes. We have extensive experience managing government and official ceremonies with full protocol compliance.' },
      { question: 'Can you manage virtual or hybrid events?', answer: 'Absolutely. We offer end-to-end virtual and hybrid event management using the latest streaming and engagement platforms.' },
      { question: 'What is your pricing structure?', answer: 'Pricing is customised based on scope, headcount, venue, and services required. Contact us for a detailed quote.' },
      { question: 'Do you provide event décor and AV setup?', answer: 'Yes, we offer complete turnkey services including theme décor, stage design, AV, lighting, and technical crew.' },
      { question: 'Which cities do you operate in?', answer: 'We primarily operate across India with a strong presence in Chennai, and have delivered events internationally in Switzerland, Spain, France, and Dubai.' },
    ]),
  },
  {
    icon: '🎭', name: 'Entertainment Events', slug: 'entertainment-events', displayOrder: 2,
    description: 'Live shows, concerts & cultural events with professional production.',
    heroHeadline: 'Entertainment That Captivates Every Audience',
    heroSubtitle: 'From live concerts and cultural galas to celebrity-hosted evenings, we produce entertainment experiences that leave your audience talking long after the curtain falls.',
    whatWeDo: 'Our entertainment event division handles everything from artist booking and stage production to lighting design and crowd management. We transform venues into immersive entertainment destinations.',
    signatureEvents: JSON.stringify([
      { icon: '🎵', title: 'Live Concerts', desc: 'Full-scale live music productions with professional sound and lighting.' },
      { icon: '🎬', title: 'Cultural Galas', desc: 'Themed evenings celebrating art, culture and tradition.' },
      { icon: '🌟', title: 'Celebrity Appearances', desc: 'End-to-end celebrity management and hosted events.' },
      { icon: '🎪', title: 'Themed Parties', desc: 'Elaborate themed events with immersive décor and entertainment.' },
      { icon: '🎊', title: 'Award Nights', desc: 'Glamorous award ceremonies with red carpet production.' },
      { icon: '🎠', title: 'Festival Events', desc: 'Large-scale public festivals and community celebrations.' },
    ]),
    differentiators: JSON.stringify([
      { title: 'Artist Network', desc: 'Access to a wide network of performers, celebrities and entertainment acts.' },
      { title: 'Production Expertise', desc: 'World-class stage, lighting and sound production capabilities.' },
      { title: 'Creative Direction', desc: 'In-house creative team to design unique entertainment concepts.' },
      { title: 'Crowd Management', desc: 'Experienced event security and crowd flow management.' },
      { title: 'End-to-End Service', desc: 'From concept to curtain call, we manage every detail.' },
    ]),
    faqs: JSON.stringify([
      { question: 'Can you book specific artists or performers?', answer: 'Yes. We have an established artist management network and can facilitate bookings based on your budget and requirements.' },
      { question: 'What size venues can you handle?', answer: 'We have experience managing events from intimate 100-person gatherings to large-scale concerts with 10,000+ attendees.' },
      { question: 'Do you provide technical riders for artists?', answer: 'Yes, we coordinate all technical requirements including sound checks, rider fulfilment, and backstage management.' },
    ]),
  },
  {
    icon: '🏛️', name: 'Exhibitions', slug: 'exhibitions', displayOrder: 3,
    description: 'Turnkey expo booths designed to attract and convert visitors.',
    heroHeadline: 'Exhibitions That Draw Crowds & Drive Business',
    heroSubtitle: 'We design and execute exhibition stands and expo pavilions that showcase your brand powerfully — from concept and fabrication to on-site management.',
    whatWeDo: 'Our exhibitions team handles complete booth design, fabrication, logistics and on-ground management. We ensure your brand stands out on the expo floor and drives meaningful visitor engagement.',
    signatureEvents: JSON.stringify([
      { icon: '🏗️', title: 'Booth Design & Fabrication', desc: 'Custom-built stands from concept to installation.' },
      { icon: '💡', title: 'Interactive Displays', desc: 'Touchscreens, demos and engagement zones that attract visitors.' },
      { icon: '🌐', title: 'Virtual Exhibitions', desc: 'Online expo platforms for hybrid and digital trade shows.' },
      { icon: '📦', title: 'Logistics Management', desc: 'End-to-end shipping, setup and teardown coordination.' },
      { icon: '🎯', title: 'Lead Capture', desc: 'Systems and tools to capture and track visitor leads effectively.' },
      { icon: '🤝', title: 'B2B Meeting Facilitation', desc: 'Structured networking and meeting scheduling at trade events.' },
    ]),
    differentiators: JSON.stringify([
      { title: 'Creative Design', desc: 'Award-winning booth designs that maximise brand impact.' },
      { title: 'Fabrication In-house', desc: 'Own fabrication capabilities ensure quality and cost efficiency.' },
      { title: 'Pan-India Presence', desc: 'We support exhibitions at all major venues across India.' },
      { title: 'On-ground Team', desc: 'Dedicated on-site crew for setup, management and teardown.' },
      { title: 'Technology Integration', desc: 'AR/VR, touchscreen and experiential tech built into stands.' },
    ]),
    faqs: JSON.stringify([
      { question: 'Do you handle international exhibitions?', answer: 'Yes, we have managed exhibition presence for Indian brands at international trade shows in Europe and the Middle East.' },
      { question: 'Can you design a stand to match our brand guidelines?', answer: 'Absolutely. Our design team works closely with your marketing team to ensure full brand compliance.' },
    ]),
  },
  {
    icon: '🏛️', name: 'Government Protocol Events', slug: 'government-protocol-events', displayOrder: 4,
    description: 'Official ceremonies & state functions with utmost precision & protocol.',
    heroHeadline: 'Government Events Executed With Precision',
    heroSubtitle: 'We bring decades of experience in managing high-profile government ceremonies, state functions, and official events with the precision, dignity and protocol they demand.',
    whatWeDo: 'Government protocol events require the highest standards of planning and execution. Our experienced team manages VIP logistics, security coordination, official ceremonies and large-scale public events with full protocol compliance.',
    signatureEvents: JSON.stringify([
      { icon: '🎖️', title: 'State Ceremonies', desc: 'Official government functions with full protocol management.' },
      { icon: '🤝', title: 'Diplomatic Events', desc: 'High-level meetings and receptions for dignitaries.' },
      { icon: '🎗️', title: 'Inauguration Events', desc: 'Project and institution inauguration ceremonies.' },
      { icon: '🏅', title: 'Award Ceremonies', desc: 'Government and public sector award functions.' },
      { icon: '📢', title: 'Public Rallies', desc: 'Large-scale public events with crowd and logistics management.' },
      { icon: '🌐', title: 'International Summits', desc: 'Multi-nation conferences and bilateral summit support.' },
    ]),
    differentiators: JSON.stringify([
      { title: 'Protocol Expertise', desc: 'Deep understanding of government ceremony protocols and VIP requirements.' },
      { title: 'Security Coordination', desc: 'Experienced in coordinating with security agencies and SPG requirements.' },
      { title: 'Reliability', desc: 'Zero-error execution for events where there is no room for mistakes.' },
      { title: 'Discretion', desc: 'Absolute confidentiality and professionalism at all times.' },
      { title: 'Scale', desc: 'Capable of managing events from 100 to 100,000+ attendees.' },
    ]),
    faqs: JSON.stringify([
      { question: 'Do you work with state and central government bodies?', answer: 'Yes, we have worked with multiple state governments and central government departments across India.' },
      { question: 'How do you handle VIP security coordination?', answer: 'We work closely with the relevant security agencies, providing detailed event plans and coordinating logistics well in advance.' },
    ]),
  },
  {
    icon: '🤝', name: 'Trade Body Association Events', slug: 'trade-body-association-events', displayOrder: 5,
    description: 'Industry summits, trade shows & association meetings, fully executed.',
    heroHeadline: 'Industry Events That Unite & Inspire',
    heroSubtitle: 'We manage end-to-end events for trade bodies, industry chambers, and professional associations — bringing members together for meaningful exchange and collaboration.',
    whatWeDo: 'From annual general meetings and industry summits to awards and networking events, we help trade associations create high-value experiences that strengthen member relationships and drive industry conversations.',
    signatureEvents: JSON.stringify([
      { icon: '🏢', title: 'Annual General Meetings', desc: 'Professional AGMs with structured agenda and AV support.' },
      { icon: '🌐', title: 'Industry Summits', desc: 'Large-scale sector conferences with keynotes and panels.' },
      { icon: '🤝', title: 'Networking Events', desc: 'Structured B2B networking sessions and roundtables.' },
      { icon: '🏅', title: 'Industry Awards', desc: 'Sector-wide awards recognising excellence and achievement.' },
      { icon: '📚', title: 'Training & Workshops', desc: 'Capacity-building events for industry professionals.' },
      { icon: '🎪', title: 'Trade Fairs', desc: 'Member showcase events and trade exhibitions.' },
    ]),
    differentiators: JSON.stringify([
      { title: 'Industry Understanding', desc: 'Deep knowledge of various industry sectors and their event needs.' },
      { title: 'Member Engagement', desc: 'Programmes designed to maximise member participation.' },
      { title: 'Governance Support', desc: 'Help with agenda planning, speaker management and proceedings.' },
      { title: 'Sponsorship Management', desc: 'Event sponsorship packaging and sponsor servicing.' },
      { title: 'Post-Event Reporting', desc: 'Comprehensive event reports for association records.' },
    ]),
    faqs: JSON.stringify([
      { question: 'Can you manage our annual member conference?', answer: 'Yes. We have extensive experience managing multi-day industry conferences with hundreds to thousands of delegates.' },
    ]),
  },
  {
    icon: '✈️', name: 'MICE Events', slug: 'mice-events', displayOrder: 6,
    description: 'Meetings, incentives & corporate travel, seamlessly coordinated.',
    heroHeadline: 'MICE Experiences That Motivate & Reward',
    heroSubtitle: 'We specialise in Meetings, Incentives, Conferences and Exhibitions — delivering seamless MICE programmes across India and internationally.',
    whatWeDo: 'Our MICE division handles everything from venue sourcing and travel logistics to itinerary design and on-ground management. We create incentive programmes that truly motivate your teams and reward high performers.',
    signatureEvents: JSON.stringify([
      { icon: '✈️', title: 'Incentive Travel', desc: 'International and domestic reward trips for top performers.' },
      { icon: '🏨', title: 'Venue Sourcing', desc: 'Access to a curated network of premium venues across the globe.' },
      { icon: '📋', title: 'Corporate Meetings', desc: 'Board meetings, leadership conclaves and strategy offsites.' },
      { icon: '🌍', title: 'International Conferences', desc: 'Multi-country event management and delegate travel.' },
      { icon: '🎯', title: 'Team Offsites', desc: 'Retreats and team-building escapes with curated activities.' },
      { icon: '🚌', title: 'Group Travel Logistics', desc: 'End-to-end group travel with flights, hotels and transfers.' },
    ]),
    differentiators: JSON.stringify([
      { title: 'Global Network', desc: 'Partner network across 30+ countries for seamless international MICE.' },
      { title: 'Cost Optimisation', desc: 'Bulk buying power and vendor relationships for better pricing.' },
      { title: 'Experience Design', desc: 'Unique local experiences and immersive cultural programmes.' },
      { title: 'Single Point of Contact', desc: 'One dedicated manager for all aspects of your MICE programme.' },
      { title: 'Visa & Compliance', desc: 'Support with travel documentation and compliance requirements.' },
    ]),
    faqs: JSON.stringify([
      { question: 'Which international destinations do you specialise in?', answer: 'We have managed MICE programmes in Switzerland, Spain, France, Dubai, Singapore, Thailand, and across India.' },
      { question: 'Can you handle groups of 500+ people for international travel?', answer: 'Yes. We have experience managing large group travel and incentive programmes for 500 to 2,000+ participants.' },
    ]),
  },
  {
    icon: '⚽', name: 'Sports Events', slug: 'sports-events', displayOrder: 7,
    description: 'Tournaments, sponsorships & athletic events with complete logistics.',
    heroHeadline: 'Sports Events That Energise & Unite',
    heroSubtitle: 'From corporate sports tournaments to large-scale athletic competitions, we bring the energy, logistics and passion to make every sporting event a success.',
    whatWeDo: 'We manage all aspects of sports event production — from venue setup and team coordination to scoreboard systems, commentary, awards and spectator experience.',
    signatureEvents: JSON.stringify([
      { icon: '🏆', title: 'Corporate Tournaments', desc: 'IPL-style cricket, football and badminton leagues for corporates.' },
      { icon: '🏃', title: 'Marathons & Runs', desc: 'City-wide running events with full logistics and timing systems.' },
      { icon: '🥊', title: 'Sports Leagues', desc: 'Season-long league management across multiple teams.' },
      { icon: '🎽', title: 'Sports Days', desc: 'Annual company sports days with multi-sport programmes.' },
      { icon: '🏅', title: 'Award Ceremonies', desc: 'Sports award nights recognising athletic achievement.' },
      { icon: '📺', title: 'Live Streaming', desc: 'Professional coverage and live streaming of sporting events.' },
    ]),
    differentiators: JSON.stringify([
      { title: 'Sports Expertise', desc: 'Dedicated sports event team with deep domain knowledge.' },
      { title: 'Logistics Mastery', desc: 'Seamless coordination of venues, equipment and teams.' },
      { title: 'Technology', desc: 'Live scoring, timing systems and digital leaderboards.' },
      { title: 'Safety First', desc: 'Medical support and safety protocols at every event.' },
      { title: 'Fan Experience', desc: 'Spectator engagement programmes that build excitement.' },
    ]),
    faqs: JSON.stringify([
      { question: 'Can you organise an IPL-style cricket tournament for our employees?', answer: 'Absolutely. Corporate cricket leagues are one of our most popular offerings, with full match management, scoring and awards.' },
    ]),
  },
  {
    icon: '💒', name: 'Wedding & Social Events', slug: 'wedding-social-events', displayOrder: 8,
    description: 'Luxury weddings, festivals & private celebrations with artistic décor.',
    heroHeadline: 'Celebrations Crafted With Love & Luxury',
    heroSubtitle: 'Your most special moments deserve extraordinary experiences. We bring artistry, attention to detail and flawless execution to every wedding and social celebration.',
    whatWeDo: 'From intimate gatherings to grand celebrations, our social events team creates personalised experiences that reflect your unique story. Every detail — from floral design to entertainment — is curated to perfection.',
    signatureEvents: JSON.stringify([
      { icon: '💍', title: 'Luxury Weddings', desc: 'Grand wedding ceremonies with theme décor and complete management.' },
      { icon: '🎂', title: 'Birthday Celebrations', desc: 'Milestone birthday events from intimate dinners to grand parties.' },
      { icon: '🎊', title: 'Anniversary Events', desc: 'Silver and golden jubilee celebrations for families and couples.' },
      { icon: '🌸', title: 'Engagement Ceremonies', desc: 'Beautifully styled engagement and pre-wedding functions.' },
      { icon: '🎉', title: 'Festival Celebrations', desc: 'Private festival and cultural celebration events.' },
      { icon: '🍽️', title: 'Private Dining Events', desc: 'Curated dining experiences for exclusive gatherings.' },
    ]),
    differentiators: JSON.stringify([
      { title: 'Personalisation', desc: 'Every event is custom-designed to reflect your personal style.' },
      { title: 'Vendor Network', desc: 'Access to the best florists, caterers, photographers and entertainers.' },
      { title: 'Luxury Décor', desc: 'In-house décor team specialising in premium floral and theme design.' },
      { title: 'Day-of Coordination', desc: 'Dedicated event coordinator to manage every detail on the day.' },
      { title: 'Budget Management', desc: 'Transparent budgeting and cost management throughout.' },
    ]),
    faqs: JSON.stringify([
      { question: 'Do you manage destination weddings?', answer: 'Yes. We have organised destination weddings across India and internationally, handling travel, accommodation and full event management.' },
      { question: 'What is your minimum budget for weddings?', answer: 'We work across a range of budgets. Contact us for a consultation and we will design the best experience within your budget.' },
    ]),
  },
];

const activities = [
  {
    icon: '🏆', name: 'Team Building Activities', slug: 'team-building-activities', displayOrder: 1,
    description: 'Structured activities that motivate team members, foster collaboration, and drive overall performance through shared challenges.',
    heroHeadline: 'Team Building That Actually Works',
    heroSubtitle: 'We design team building experiences that go beyond fun — creating meaningful connections, improving communication, and driving real performance improvements.',
    whatWeDo: 'Our team building programmes are rooted in behavioural science and designed for measurable impact. From outdoor adventures to indoor workshops, we create experiences that bring teams together.',
  },
  {
    icon: '🎯', name: 'Corporate Games & Sports', slug: 'corporate-games-sports', displayOrder: 2,
    description: 'Competitive and fun sporting events tailored for corporate groups — from mini-olympics to IPL-style tournaments.',
    heroHeadline: 'Where Competition Meets Camaraderie',
    heroSubtitle: 'Our corporate games and sports programmes create the perfect balance of healthy competition and team spirit — energising your workforce and building lasting bonds.',
    whatWeDo: 'From large-scale corporate Olympics to focused sports days, we manage all aspects of your corporate sports event — equipment, referees, scoring, and awards.',
  },
  {
    icon: '🎭', name: 'Cultural Performances', slug: 'cultural-performances', displayOrder: 3,
    description: 'Curated cultural shows, themed performances, and entertainment experiences that celebrate diversity and creativity.',
    heroHeadline: 'Cultural Experiences That Inspire',
    heroSubtitle: 'We curate rich cultural performances and entertainment experiences that celebrate India\'s diversity and bring your teams together through shared moments of joy.',
    whatWeDo: 'From classical dance performances and folk music to themed cultural evenings, our entertainment curation team sources the best talent across India to create unforgettable cultural experiences.',
  },
  {
    icon: '💡', name: 'Employee Engagement', slug: 'employee-engagement', displayOrder: 4,
    description: 'Interactive programmes designed to boost morale, strengthen workplace relationships, and improve team communication.',
    heroHeadline: 'Engagement That Transforms Teams',
    heroSubtitle: 'We design and deliver employee engagement programmes that genuinely move the needle — from morale and motivation to collaboration and retention.',
    whatWeDo: 'Our employee engagement specialists design programmes tailored to your organisation\'s culture and goals. Whether it\'s a recognition event, a team retreat, or an ongoing engagement calendar, we bring it to life.',
  },
  {
    icon: '🎤', name: 'Conferences & Seminars', slug: 'conferences-seminars', displayOrder: 5,
    description: 'End-to-end management of corporate conferences, product launches, press meets, and knowledge-sharing summits.',
    heroHeadline: 'Conferences That Create Impact',
    heroSubtitle: 'We manage every detail of your conference or seminar — from agenda design and speaker management to AV production and delegate experience.',
    whatWeDo: 'Our conference management team handles the full lifecycle of your event — pre-event planning, on-site production, and post-event follow-up — ensuring a seamless experience for every delegate.',
  },
  {
    icon: '🚀', name: 'Brand Activations', slug: 'brand-activations', displayOrder: 6,
    description: 'BTL and experiential marketing activations that create lasting impressions and drive direct brand engagement.',
    heroHeadline: 'Activations That Put Your Brand Centre Stage',
    heroSubtitle: 'We create experiential brand activations that engage consumers directly, build brand affinity, and drive measurable results for your marketing campaigns.',
    whatWeDo: 'From mall activations and roadshows to pop-up experiences and guerrilla marketing, our activation team designs and executes campaigns that make your brand impossible to ignore.',
  },
];

async function main() {
  console.log('\n🌱 Seeding Services...\n');

  // Clear existing
  await prisma.service.deleteMany({});

  for (const s of mainServices) {
    await prisma.service.create({ data: { ...s, type: 'MAIN' } });
    console.log(`  ✓ Main: ${s.name}`);
  }
  for (const a of activities) {
    await prisma.service.create({ data: { ...a, type: 'ACTIVITY' } });
    console.log(`  ✓ Activity: ${a.name}`);
  }

  console.log(`\n✅ Seeded ${mainServices.length} main services + ${activities.length} activities\n`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
