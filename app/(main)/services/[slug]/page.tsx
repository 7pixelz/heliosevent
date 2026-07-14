import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { prisma } from '../../../../lib/prisma';
import { buildMeta } from '../../../../lib/seo';
import ServiceDetailClient from './ServiceDetailClient';

export const dynamic = 'force-dynamic';

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params;
    const svc = await prisma.service.findUnique({
      where: { slug },
      select: { name: true, description: true, coverImageUrl: true, metaTitle: true, metaDescription: true, metaKeywords: true, seoContent: true },
    });
    if (!svc) return {};
    return buildMeta({
      title: svc.metaTitle || `${svc.name} | Helios Event Productions`,
      description: svc.metaDescription || svc.description,
      keywords: svc.metaKeywords,
      path: `/services/${slug}`,
      image: svc.coverImageUrl,
    });
  } catch {
    return {};
  }
}

const BASE_URL = 'https://www.heliosevent.in';

const SERVICE_SCHEMA: Record<string, object> = {
  'corporate-event-management-in-chennai': {
    '@context': 'https://schema.org/',
    '@type': 'Article',
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE_URL}/services/corporate-event-management-in-chennai` },
    headline: 'Corporate Event Management Company in Chennai',
    description: 'Looking for corporate event organisers? Helios Event provide complete corporate event planning services for product launches, conferences, and business events.',
    image: { '@type': 'ImageObject', url: '', width: '', height: '' },
    author: { '@type': 'Organization', name: 'Heliosevent' },
    publisher: { '@type': 'Organization', name: 'Heliosevent', logo: { '@type': 'ImageObject', url: '', width: '', height: '' } },
    datePublished: '2026-06-11',
  },
  'government-events-planner-in-chennai': {
    '@context': 'https://schema.org/',
    '@type': 'BlogPosting',
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE_URL}/services/government-events-planner-in-chennai` },
    headline: 'Government & Protocol Events Management Company in Chennai',
    description: 'Helios Event is a leading government event management company in India offering professional protocol management, official ceremony planning, VIP coordination, and government summit organizing services.',
    image: { '@type': 'ImageObject', url: '', width: '', height: '' },
    author: { '@type': 'Organization', name: 'Heliosevent' },
    publisher: { '@type': 'Organization', name: 'Heliosevent', logo: { '@type': 'ImageObject', url: '', width: '', height: '' } },
    datePublished: '2026-06-11',
    dateModified: '2026-06-11',
  },
  'sports-event-management-company-in-chennai': {
    '@context': 'https://schema.org/',
    '@type': 'BlogPosting',
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE_URL}/services/sports-event-management-company-in-chennai` },
    headline: 'Sports Events Management in Chennai',
    description: 'Choose a professional sports event management company in Chennai for strategic planning, event coordination, sponsorship management, and successful sporting event execution.',
    image: { '@type': 'ImageObject', url: '', width: '', height: '' },
    author: { '@type': 'Organization', name: 'HelioEvents' },
    publisher: { '@type': 'Organization', name: 'HelioEvents', logo: { '@type': 'ImageObject', url: '', width: '', height: '' } },
    datePublished: '2026-06-11',
    dateModified: '2026-06-11',
  },
};

const faq = (name: string, text: string) => ({ '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text } });

const SERVICE_FAQ_SCHEMA: Record<string, object> = {
  'corporate-event-management-in-chennai': {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      faq('How does Helios create unique, immersive experiences for corporate events in Chennai?', 'We blend creative concepts with technology, incorporating interactive LED installations, AR/VR zones, dynamic stage designs, and themed décor to transform events into memorable brand narratives.'),
      faq('What is the typical timeline to plan a large-scale corporate event in Chennai?', 'For conferences and award nights, we suggest a 2–3 month lead time, while exhibitions and multi-day events benefit from a 4–6 month window for optimal planning and execution.'),
      faq('Do you handle government protocol or high-security events in Chennai?', 'Yes, Helios has extensive experience managing high-profile events with government dignitaries, coordinating with local authorities to ensure compliance and security measures are met.'),
      faq('How does Helios ensure brand consistency in corporate events in Chennai?', 'We collaborate with your marketing teams to align all elements — from stage design and collateral to digital screens and delegate kits — ensuring consistent brand messaging throughout the event.'),
      faq('What types of corporate events do you specialise in Chennai?', 'We specialise in conferences, dealer meets, award ceremonies, product launches, MICE events, and trade shows, along with entertainment and themed experiences.'),
      faq('Can Helios manage end-to-end event planning and execution in Chennai?', 'Yes, we provide comprehensive turnkey solutions from conceptualisation through post-event reporting, handling all aspects of event management.'),
      faq('What does a Corporate Event Planner do?', 'A Corporate Event Planner manages every aspect of a business event, including planning, venue selection, event design, vendor coordination, logistics, execution, and post-event support to ensure a successful event.'),
      faq('Why should I hire a corporate event planner in Chennai?', 'Hiring a professional Corporate Event Planner in Chennai helps save time, reduces planning stress, ensures smooth event execution, and delivers a memorable experience for employees, clients, and stakeholders.'),
      faq('What types of corporate events do you organize?', 'Helios Event Productions organizes annual day celebrations, employee engagement events, family day, kids day, conferences, product launches, award ceremonies, milestone celebrations, wellness day, gala nights, team outings, CSR events, office decor, festival decor, and many other corporate celebrations.'),
      faq('Do you provide complete corporate event management services?', 'Yes. We offer end-to-end corporate event management services, including venue selection, event planning, stage setup, branding, decor, entertainment, audiovisual support, catering, guest management, logistics, and on-site coordination.'),
      faq('Can you organize events for small and large businesses?', 'Absolutely. We provide customized business event planning solutions for startups, SMEs, corporate organizations, and multinational companies.'),
      faq('How much does corporate event management cost in Chennai?', 'The cost depends on factors such as the event type, number of guests, venue, decor, entertainment, catering, and technical requirements. We provide customized packages based on your budget and event requirements.'),
    ],
  },
  'government-events-planner-in-chennai': {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      faq('What kinds of government events do you plan?', 'We plan ministry events and government body functions, ensuring each event is structured, compliant, and tailored to official requirements from start to finish.'),
      faq('Do you handle protocol and security requirements?', 'Yes. We work with officials to manage security, protocol and on-site coordination so events meet government standards and run smoothly without operational gaps.'),
      faq('Can Helios manage all aspects of my government event?', 'Absolutely. We provide end-to-end event planning, including design, logistics, technical setups, guest management and post-event reporting for government events.'),
      faq('How long does planning typically take for government events?', 'Timelines vary by event scale, but planning early helps ensure custom production, vendor coordination and seamless execution without last-minute stress.'),
      faq('Do you integrate technology into government events?', 'Yes. We use modern technology to support presentations, staging, sound and guest experiences to make events engaging and functionally effective.'),
      faq('Do you coordinate with local authorities for permits?', 'We handle all compliance and coordination, including working with local authorities for permits and clearances needed for official government events.'),
    ],
  },
  'sports-event-management-company-in-chennai': {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      faq('What sports events do you organise?', 'We handle marathons, annual sports days, cyclothons, treasure hunts, car rallies, endurance races, adventure challenges and more — tailored to your specific needs in Chennai.'),
      faq('How soon should I book your sports event service?', 'For best results, book at least 8–12 weeks before your event date to secure venues, permits, staffing, and equipment without last-minute complications.'),
      faq('Do you handle permits and safety arrangements?', 'Yes. We coordinate local permissions, risk assessments, medical safety plans and crowd control to ensure compliance and participant security throughout.'),
      faq('Can you manage large participant numbers?', 'We handle events from small 100–500 participant gatherings to large competitions above 500 attendees, including registration and coordination processes.'),
      faq('What support do you offer on event day?', 'On the day of the event we provide full coordination, technical support, staff direction, emergency response readiness, timing systems, volunteer oversight and vendor management.'),
      faq('Will you help with event promotion and registrations?', 'Yes — we support online registrations, promotional planning and participant communication for maximum visibility and smooth enrolment.'),
    ],
  },
};

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const [service, videos, logos] = await Promise.all([
    prisma.service.findUnique({ where: { slug } }),
    prisma.youtubeVideo.findMany({
      where: {
        isActive: true,
        OR: [
          { serviceSlugs: { contains: `"${slug}"` } },
          { serviceSlug: slug },
        ],
      },
      orderBy: { displayOrder: 'asc' },
      select: { id: true, youtubeId: true, title: true },
    }),
    prisma.clientLogo.findMany({
      where: { isVisible: true },
      orderBy: { displayOrder: 'asc' },
      select: { id: true, name: true, imageUrl: true },
    }),
  ]);
  if (!service) notFound();

  let portfolioEvents: { id: string; title: string; slug: string; clientName: string | null; coverImageUrl: string | null; category: string }[] = [];
  try {
    const ids: string[] = JSON.parse(service.linkedPortfolioIds || '[]');
    if (ids.length > 0) {
      portfolioEvents = await prisma.portfolioEvent.findMany({
        where: { id: { in: ids }, isActive: true },
        select: { id: true, title: true, slug: true, clientName: true, coverImageUrl: true, category: true },
      });
      portfolioEvents.sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));
    }
  } catch { /* ignore parse errors */ }

  const jsonLd = SERVICE_SCHEMA[slug];
  const faqLd = SERVICE_FAQ_SCHEMA[slug];

  return (
    <>
      {jsonLd && (
        <Script
          id="service-json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {faqLd && (
        <Script
          id="service-faq-json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}
      <ServiceDetailClient service={service} videos={videos} portfolioEvents={portfolioEvents} logos={logos} />
    </>
  );
}
