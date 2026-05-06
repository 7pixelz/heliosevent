import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const LOCATIONS: Record<string, {
  area: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  tagline: string;
  intro: string;
  services: { title: string; desc: string }[];
  faqs: { q: string; a: string }[];
}> = {
  'event-planner-in-taramani': {
    area: 'Taramani',
    title: 'Premier Event Management Services in Taramani, Chennai',
    metaTitle: 'Corporate Event Management in Taramani - Event Organizer',
    metaDescription: 'Helios Event Productions offers professional event management in Taramani, Chennai. Corporate events, sports days, annual day celebrations and more. Call +91 7401030000.',
    tagline: 'Your trusted partner for Corporate, Sports, Festival & Celebration Events in Taramani, Chennai.',
    intro: 'Helios Event Productions is Taramani\'s most trusted event management company, delivering flawless corporate events, sports days, annual celebrations, employee engagement programmes and product launches for companies across the Taramani IT corridor.',
    services: [
      { title: 'Corporate Event Management', desc: 'End-to-end corporate event planning and execution for companies in Taramani — from board meetings to large-scale conferences.' },
      { title: 'Sports Day Event Organizers', desc: 'Energetic sports day events designed to boost team morale and employee wellness at your Taramani campus.' },
      { title: 'Annual Day Celebrations', desc: 'Memorable annual day and company anniversary celebrations with entertainment, awards and customised experiences.' },
      { title: 'Employee Engagement Activities', desc: 'Creative team-building and engagement programmes tailored to your workforce and company culture.' },
      { title: 'Product Launch Events', desc: 'High-impact product launch events in Taramani that generate buzz and leave lasting impressions on your audience.' },
      { title: 'Festival Event Organizers', desc: 'Pongal, Diwali, Christmas and all festival celebrations managed with cultural authenticity and corporate polish.' },
      { title: 'Hybrid & Virtual Events', desc: 'Seamless hybrid and virtual event solutions for Taramani-based companies with distributed teams.' },
      { title: 'Exhibition Stall Design', desc: 'Creative exhibition stall design, fabrication and management for trade shows and expos.' },
    ],
    faqs: [
      { q: 'What types of events do you manage in Taramani?', a: 'We handle all event types including corporate conferences, team building activities, product launches, annual day celebrations, sports days, exhibitions, and hybrid/virtual events for companies in Taramani.' },
      { q: 'How much does event management cost in Taramani?', a: 'Pricing depends on the event type, scale, and services required. We offer flexible packages to suit all budgets. Contact us for a free, no-obligation quote tailored to your needs.' },
      { q: 'Do you provide end-to-end event management?', a: 'Yes. We handle everything from concept and planning to vendor coordination, logistics, on-site execution and post-event reporting — you just show up.' },
      { q: 'Can you customize events for our brand?', a: 'Absolutely. Every event is customized to reflect your brand identity, company values and specific objectives. We don\'t do cookie-cutter events.' },
      { q: 'Can you manage large-scale events?', a: 'Yes. We have successfully managed events for 50 to 5,000+ attendees across Tamil Nadu. Our team scales to any event size.' },
      { q: 'How far in advance should we book?', a: 'We recommend booking at least 3–4 weeks in advance for mid-size events. For large events or peak season dates, 6–8 weeks is ideal to secure the best venues and vendors.' },
    ],
  },
  'event-management-in-omr': {
    area: 'OMR',
    title: 'Corporate Event Planners OMR Chennai — Virtual & Live',
    metaTitle: 'Corporate Event Planners OMR Chennai - Virtual & Live Events',
    metaDescription: 'Top corporate event planners in OMR Chennai. Specialising in office inaugurations, annual days, awards, employee engagement and virtual events. Call +91 7401030000.',
    tagline: 'Your trusted partner for Corporate, Awards, Conferences & Employee Engagement Events in OMR, Chennai.',
    intro: 'Helios Event Productions is the leading event management company along the OMR IT corridor. We design and deliver corporate events, office inaugurations, annual functions, awards ceremonies, employee engagement activities and virtual events for the thriving business community on Old Mahabalipuram Road.',
    services: [
      { title: 'Corporate Event Planners in OMR', desc: 'Comprehensive corporate event management for IT and tech companies along the OMR corridor — from intimate team events to large-scale conferences.' },
      { title: 'Office Inauguration Events', desc: 'Memorable office inauguration ceremonies with ribbon-cutting, cultural performances, media coverage and client hospitality.' },
      { title: 'Annual Day Event Organisers', desc: 'Grand annual day celebrations that recognise employee achievements and strengthen company culture.' },
      { title: 'Corporate Awards Ceremony', desc: 'Prestigious awards ceremonies designed to honour top performers and motivate your entire team.' },
      { title: 'Employee Engagement Activities', desc: 'Fun and impactful employee engagement programmes — from team-building outings to on-site activity days.' },
      { title: 'Product Launch Events', desc: 'Buzz-worthy product launches for tech and IT companies with AV production, PR coordination and live streaming.' },
      { title: 'Virtual Event Organisers', desc: 'Fully managed virtual and hybrid events with professional streaming, interactive sessions and flawless technical execution.' },
      { title: 'Business Conference Organisers', desc: 'Professional business conferences, seminars and summits for companies along the OMR tech corridor.' },
    ],
    faqs: [
      { q: 'What types of events do you manage in OMR?', a: 'We specialise in corporate events for IT and tech companies along OMR — office inaugurations, annual functions, awards ceremonies, employee engagement, product launches, virtual events and business conferences.' },
      { q: 'Do you handle both physical and virtual events in OMR?', a: 'Yes. We manage fully on-site events, fully virtual events, and hybrid formats that combine both — ideal for OMR companies with remote and distributed teams.' },
      { q: 'How much does corporate event management cost in OMR?', a: 'Costs vary by event type and scale. We offer packages for startups as well as large enterprises. Contact us for a customised quote.' },
      { q: 'Can you organise large-scale conferences in OMR?', a: 'Absolutely. We have managed conferences for 500–5,000+ attendees, including international delegates, across Chennai\'s OMR and IT corridors.' },
      { q: 'Can you customize the event for our company brand?', a: 'Every element — from stage design to branding materials — is customized to align with your company\'s identity and event objectives.' },
      { q: 'How far in advance should we book your services?', a: 'For most corporate events in OMR, we recommend booking 3–4 weeks in advance. For large conferences or peak-season dates, 6–8 weeks ensures the best results.' },
    ],
  },
  'event-management-in-oragadam': {
    area: 'Oragadam',
    title: 'Event Management in Oragadam — Industrial & Corporate Events',
    metaTitle: 'Event Management in Oragadam Chennai - Industrial & Corporate',
    metaDescription: 'Professional event management company in Oragadam Chennai. Factory inaugurations, annual days, employee engagement & corporate events for industrial clients. Call +91 7401030000.',
    tagline: 'Trusted event partner for industrial, corporate and community events in Oragadam.',
    intro: 'Oragadam is Tamil Nadu\'s premier industrial hub, home to global automotive and manufacturing giants. Helios Event Productions specialises in factory inaugurations, annual day celebrations, employee engagement events and dealer meets for the industrial community in Oragadam and the surrounding Sriperumbudur-Oragadam corridor.',
    services: [
      { title: 'Factory & Plant Inaugurations', desc: 'Grand inauguration ceremonies for new factories and manufacturing facilities — protocol management, media coordination and guest hospitality included.' },
      { title: 'Annual Day Celebrations', desc: 'Memorable annual functions for manufacturing companies that celebrate employee achievements and company milestones.' },
      { title: 'Dealer & Distributor Meets', desc: 'High-energy dealer meets and channel partner events that strengthen your distribution network and launch new products.' },
      { title: 'Employee Engagement Activities', desc: 'Customised team-building and engagement programmes for blue-collar and white-collar workforces in Oragadam.' },
      { title: 'Corporate Award Ceremonies', desc: 'Recognition events that celebrate top performers, long-service employees and outstanding teams.' },
      { title: 'Sports Day Events', desc: 'Exciting sports day events and inter-department tournaments designed for large industrial workforces.' },
      { title: 'Product Launch Events', desc: 'Impactful product and vehicle launch events with stage production, lighting, AV and media management.' },
      { title: 'CSR & Community Events', desc: 'Corporate social responsibility events and community outreach programmes for Oragadam-based companies.' },
    ],
    faqs: [
      { q: 'What types of events do you manage in Oragadam?', a: 'We specialise in industrial and corporate events in Oragadam — factory inaugurations, annual days, dealer meets, employee engagement, sports days, product launches and CSR events.' },
      { q: 'Can you manage events for large industrial workforces?', a: 'Yes. We regularly manage events for 500–5,000+ employees, including mixed blue-collar and white-collar workforces in industrial settings.' },
      { q: 'Do you handle factory inauguration ceremonies?', a: 'Absolutely. We manage every aspect of plant and factory inaugurations — from venue dressing and protocol to media coverage and guest management.' },
      { q: 'Can you customize events for automotive and manufacturing brands?', a: 'Yes. We tailor every event to reflect your brand identity, whether you\'re in automotive, electronics, pharma or heavy manufacturing.' },
      { q: 'How much does event management cost in Oragadam?', a: 'Pricing is based on event size, services and requirements. We offer competitive packages for industrial clients. Contact us for a free quote.' },
      { q: 'How far in advance should we book?', a: 'We recommend 4–6 weeks for most events. For large-scale inaugurations or events with VIP guests, book 8–10 weeks in advance.' },
    ],
  },
  'event-management-in-vallam-chengalpattu': {
    area: 'Vallam Chengalpattu',
    title: 'Event Management in Vallam, Chengalpattu — Industrial Events',
    metaTitle: 'Event Management in Vallam Chengalpattu - Corporate & Industrial',
    metaDescription: 'Event management company in Vallam, Chengalpattu. Corporate events, factory inaugurations, annual days and employee engagement for industrial clients. Call +91 7401030000.',
    tagline: 'Expert event management for corporate and industrial clients in Vallam, Chengalpattu.',
    intro: 'Helios Event Productions serves the growing industrial and business community in Vallam, Chengalpattu. With the Special Economic Zone and automotive clusters in the region, we deliver world-class factory inaugurations, corporate events, annual day celebrations and dealer meets for companies in this fast-developing industrial corridor.',
    services: [
      { title: 'Factory Inauguration Events', desc: 'Complete factory and plant inauguration management — from gate décor to VIP protocol and media coordination.' },
      { title: 'Corporate Annual Day Events', desc: 'Annual day celebrations that bring together your entire workforce to recognise achievements and build culture.' },
      { title: 'Dealer & Channel Partner Meets', desc: 'Structured dealer meets and partner conferences that motivate your network and launch new products effectively.' },
      { title: 'Employee Engagement Programmes', desc: 'Engaging team-building activities and company events tailored for industrial workforces in Vallam.' },
      { title: 'Product Launch Events', desc: 'Impactful product launches with full AV, stage and presentation production.' },
      { title: 'Corporate Award Ceremonies', desc: 'Recognition events that honour your best employees and inspire the entire team.' },
      { title: 'Sports & Recreation Events', desc: 'Sports day events, tournaments and recreational activities for large industrial employee groups.' },
      { title: 'CSR Events', desc: 'Community and CSR events that connect your company with the local Chengalpattu community.' },
    ],
    faqs: [
      { q: 'What events do you manage in Vallam Chengalpattu?', a: 'We cover factory inaugurations, corporate annual days, dealer meets, employee engagement, product launches, awards ceremonies and sports events in Vallam and the broader Chengalpattu district.' },
      { q: 'Can you handle SEZ and industrial estate events?', a: 'Yes. We have experience managing events within Special Economic Zones and industrial estates, including compliance with security and protocol requirements.' },
      { q: 'Do you manage events for large manufacturing workforces?', a: 'Absolutely. We regularly deliver events for 500–5,000+ employees across manufacturing, automotive and logistics sectors.' },
      { q: 'How do you handle events in remote industrial locations?', a: 'We manage full logistics including transport, tent/venue setup, power, catering coordination and on-site crew for locations like Vallam and Chengalpattu.' },
      { q: 'How much does event management cost?', a: 'Costs depend on event scale and scope. We offer transparent, competitive packages for industrial clients. Contact us for a free quote.' },
      { q: 'How early should we book?', a: 'For large industrial events, 6–8 weeks in advance is ideal. Smaller events can be booked with 3–4 weeks notice.' },
    ],
  },
  'event-management-in-sriperumbudur': {
    area: 'Sriperumbudur',
    title: 'Event Management in Sriperumbudur — Corporate & Industrial Events',
    metaTitle: 'Event Management Company in Sriperumbudur - Corporate Events',
    metaDescription: 'Leading event management company in Sriperumbudur. Factory inaugurations, annual days, dealer meets, employee engagement for automotive and tech companies. Call +91 7401030000.',
    tagline: 'Helios Event Productions — your trusted partner for corporate and industrial events in Sriperumbudur.',
    intro: 'Sriperumbudur is one of India\'s most important industrial corridors, home to companies like Samsung, Kia Motors, Nokia, Foxconn and more. Helios Event Productions has deep expertise in delivering flawless factory inaugurations, VIP dealer meets, employee engagement events and annual day celebrations for the corporate and industrial community in Sriperumbudur.',
    services: [
      { title: 'Factory & Facility Inaugurations', desc: 'Grand inauguration ceremonies for new plants and facilities in Sriperumbudur\'s industrial estates, including VIP protocol and media management.' },
      { title: 'Dealer & Distributor Meets', desc: 'High-impact dealer meets and channel partner events for automotive and electronics companies in Sriperumbudur.' },
      { title: 'Annual Day Celebrations', desc: 'Corporate annual day events that celebrate milestones and recognise employee contributions across your Sriperumbudur operations.' },
      { title: 'Employee Engagement Activities', desc: 'Team-building and engagement programmes for manufacturing workforces — from outdoor activities to on-site events.' },
      { title: 'Corporate Award Ceremonies', desc: 'Prestigious award ceremonies for large manufacturing organisations in Sriperumbudur.' },
      { title: 'Product Launch Events', desc: 'New product and vehicle launches with professional AV production, lighting rigs and media coordination.' },
      { title: 'Sports Day Events', desc: 'Large-scale sports days and inter-department tournaments for your Sriperumbudur workforce.' },
      { title: 'Training & Conference Events', desc: 'Corporate training days, townhalls and conferences for management teams across the Sriperumbudur belt.' },
    ],
    faqs: [
      { q: 'What events do you manage in Sriperumbudur?', a: 'We specialise in factory inaugurations, dealer meets, annual days, employee engagement, product launches, awards ceremonies, sports days and corporate conferences in Sriperumbudur.' },
      { q: 'Do you have experience with automotive and electronics companies?', a: 'Yes. We have managed events for major automotive, electronics and tech manufacturing companies across the Sriperumbudur industrial belt.' },
      { q: 'Can you manage international VIP and delegations?', a: 'Yes. We handle full protocol management including transportation, hospitality, translation and ceremonial arrangements for international guests.' },
      { q: 'Can you manage events for 2,000+ employees?', a: 'Absolutely. We regularly manage large-scale events for 1,000–5,000+ attendees in industrial settings across Tamil Nadu.' },
      { q: 'How much does event management cost in Sriperumbudur?', a: 'Pricing varies based on event type and scope. We offer flexible packages to match your budget. Contact us for a tailored quote.' },
      { q: 'How far in advance should we book?', a: 'For large events, 6–8 weeks ahead is recommended. Smaller corporate events can be booked with 3–4 weeks notice.' },
    ],
  },
  'event-management-in-ambattur': {
    area: 'Ambattur',
    title: 'Event Management in Ambattur — Corporate & Industrial Events',
    metaTitle: 'Event Management Company in Ambattur Chennai - Corporate Events',
    metaDescription: 'Professional event management in Ambattur Chennai. Corporate events, annual days, employee engagement, product launches for Ambattur Industrial Estate companies. Call +91 7401030000.',
    tagline: 'Expert event management for the Ambattur Industrial Estate and corporate community.',
    intro: 'Ambattur is home to one of Chennai\'s oldest and largest industrial estates. Helios Event Productions serves companies across Ambattur with professional event management — delivering corporate events, annual day celebrations, employee engagement programmes and dealer meets that match global standards for local and multinational businesses.',
    services: [
      { title: 'Corporate Event Management', desc: 'Comprehensive corporate event management for Ambattur Industrial Estate companies — conferences, townhalls and business meetings.' },
      { title: 'Annual Day Celebrations', desc: 'Memorable annual day events with entertainment, awards and employee recognition programmes.' },
      { title: 'Employee Engagement Activities', desc: 'Dynamic team-building and employee engagement programmes for manufacturing and industrial workforces in Ambattur.' },
      { title: 'Product Launch Events', desc: 'Professional product launches with AV production, stage design and media coordination for Ambattur-based companies.' },
      { title: 'Dealer & Channel Partner Meets', desc: 'Effective dealer meets and distributor conferences that energise your sales network.' },
      { title: 'Award Ceremonies', desc: 'Prestigious award nights and recognition events for employees and business partners.' },
      { title: 'Sports Day Events', desc: 'Exciting sports day events and inter-team tournaments for industrial workforces in Ambattur.' },
      { title: 'Factory Inauguration Events', desc: 'End-to-end factory and office inauguration management including décor, catering and VIP arrangements.' },
    ],
    faqs: [
      { q: 'What events do you manage in Ambattur?', a: 'We manage corporate events, annual days, employee engagement, dealer meets, product launches, awards ceremonies, sports days and factory inaugurations for companies in Ambattur.' },
      { q: 'Do you have experience in the Ambattur Industrial Estate?', a: 'Yes. We have managed numerous events for companies within the Ambattur Industrial Estate, with experience in navigating estate logistics and security protocols.' },
      { q: 'Can you manage events at short notice?', a: 'For smaller events, we can mobilise in as little as 2 weeks. For larger events we recommend 4–6 weeks for the best outcomes.' },
      { q: 'Do you provide event venues in Ambattur?', a: 'We have partnerships with halls, hotels and open grounds in and around Ambattur. We can recommend and book the ideal venue for your event.' },
      { q: 'How much does event management cost in Ambattur?', a: 'Costs depend on event scale and scope. We offer transparent pricing and flexible packages. Contact us for a free quote.' },
      { q: 'Do you handle end-to-end event logistics?', a: 'Yes — from concept, vendor management and venue booking to on-site execution and post-event reporting, we handle everything.' },
    ],
  },
  'event-management-in-ekkatuthangal': {
    area: 'Ekkatuthangal',
    title: 'Event Management in Ekkatuthangal, Chennai',
    metaTitle: 'Event Management Company in Ekkatuthangal Chennai',
    metaDescription: 'Helios Event Productions delivers corporate events, annual days, product launches and employee engagement in Ekkatuthangal, Chennai. Call +91 7401030000.',
    tagline: 'Professional event management services for businesses in Ekkatuthangal, Chennai.',
    intro: 'Ekkatuthangal is a prime commercial and industrial hub in South Chennai, home to a diverse mix of manufacturing, logistics and service companies. Helios Event Productions delivers polished corporate events, product launches, annual day celebrations and team-building programmes for businesses across Ekkatuthangal and the surrounding South Chennai business district.',
    services: [
      { title: 'Corporate Event Management', desc: 'Professional corporate event planning and execution for companies in Ekkatuthangal — conferences, business meetings and townhalls.' },
      { title: 'Annual Day Celebrations', desc: 'Grand annual day events with entertainment, awards and employee recognition for Ekkatuthangal-based companies.' },
      { title: 'Product Launch Events', desc: 'High-impact product launches with full stage, lighting and AV production in Ekkatuthangal and nearby venues.' },
      { title: 'Employee Engagement Activities', desc: 'Creative engagement and team-building programmes designed for South Chennai workforces.' },
      { title: 'Award Ceremonies', desc: 'Memorable awards nights that recognise excellence within your organisation.' },
      { title: 'Dealer & Partner Meets', desc: 'Motivating dealer meets and channel partner events for companies in the South Chennai corridor.' },
      { title: 'Sports Day Events', desc: 'Well-organised sports days and recreational activities for corporate employees in Ekkatuthangal.' },
      { title: 'Exhibition & Trade Show Support', desc: 'Exhibition stall design, fabrication and management for companies participating in Chennai trade shows.' },
    ],
    faqs: [
      { q: 'What events do you manage in Ekkatuthangal?', a: 'We handle corporate events, annual days, product launches, employee engagement, dealer meets, awards ceremonies and sports days for businesses in Ekkatuthangal.' },
      { q: 'Do you know good venues near Ekkatuthangal?', a: 'Yes. We work with hotels, banquet halls and event spaces across South Chennai including venues close to Ekkatuthangal and Guindy.' },
      { q: 'How do I get a quote for my event?', a: 'Contact us via phone (+91 7401030000), email (plan@heliosevent.net) or the enquiry form. We will respond with a tailored proposal within 24 hours.' },
      { q: 'Can you handle both small and large events?', a: 'Yes. We manage events for 50 to 5,000+ attendees with equal attention to detail regardless of scale.' },
      { q: 'How much does event management cost?', a: 'Pricing is based on event type, size and services. We offer flexible packages to suit all budgets. Contact us for a free quote.' },
      { q: 'How far in advance should I book?', a: 'We recommend 3–4 weeks for smaller events and 6–8 weeks for larger productions to ensure the best vendors and venues.' },
    ],
  },
  'event-management-in-guindy': {
    area: 'Guindy',
    title: 'Event Management in Guindy, Chennai — Corporate & Industrial',
    metaTitle: 'Corporate Event Management in Guindy Chennai - Helios Event',
    metaDescription: 'Top event management company in Guindy Chennai. Corporate events, exhibitions, annual days, product launches for Guindy Industrial Estate and CMBT area companies. Call +91 7401030000.',
    tagline: 'Your event management partner in Guindy — from the Industrial Estate to the IT Expressway.',
    intro: 'Guindy is one of Chennai\'s most important commercial and industrial hubs, home to the Guindy Industrial Estate, TIDEL Park and major corporate offices. Helios Event Productions delivers exceptional corporate events, exhibitions, product launches, annual day celebrations and employee engagement programmes for the diverse business community in Guindy.',
    services: [
      { title: 'Corporate Event Management', desc: 'End-to-end corporate event planning for Guindy Industrial Estate companies, IT parks and corporate offices.' },
      { title: 'Exhibition & Trade Show Events', desc: 'Professional exhibition stall design and management for companies participating in trade shows at Guindy venues.' },
      { title: 'Annual Day Celebrations', desc: 'Polished annual day events combining entertainment, awards and employee recognition.' },
      { title: 'Product Launch Events', desc: 'High-profile product launches with full production — stage, AV, media and PR coordination.' },
      { title: 'Employee Engagement Activities', desc: 'Engaging team-building and employee wellness events for corporate workforces in Guindy and TIDEL Park.' },
      { title: 'Corporate Award Ceremonies', desc: 'Memorable award nights recognising top performers and business achievements.' },
      { title: 'Conference & Seminar Management', desc: 'Professional conferences, seminars and business summits for Guindy\'s corporate and industrial community.' },
      { title: 'Factory Inauguration Events', desc: 'Inauguration ceremonies for new facilities and offices in the Guindy area.' },
    ],
    faqs: [
      { q: 'What events do you manage in Guindy?', a: 'We manage corporate events, exhibitions, annual days, product launches, employee engagement, award ceremonies, conferences and factory inaugurations for businesses in Guindy.' },
      { q: 'Do you manage events in the Guindy Industrial Estate?', a: 'Yes. We have experience managing events within the Guindy Industrial Estate and work within the estate\'s operational protocols.' },
      { q: 'Do you organise exhibitions near Guindy?', a: 'Yes. We manage exhibition stall design, build and management for companies exhibiting at Chennai Trade Centre and other venues near Guindy.' },
      { q: 'How quickly can you organise an event in Guindy?', a: 'For smaller events, we can deliver in 2–3 weeks. For larger productions, 4–6 weeks is ideal for the best results.' },
      { q: 'How much does event management cost in Guindy?', a: 'Costs vary by event scope. We offer competitive, transparent pricing. Contact us for a free customised quote.' },
      { q: 'Do you provide complete event logistics?', a: 'Yes — venue sourcing, vendors, AV, décor, catering coordination, on-site management and post-event review — all handled by our team.' },
    ],
  },
  'event-management-in-sri-city': {
    area: 'Sri City',
    title: 'Event Management in Sri City — Industrial & Corporate Events',
    metaTitle: 'Event Management in Sri City Andhra Pradesh - Corporate Events',
    metaDescription: 'Professional event management company for Sri City industrial township. Factory inaugurations, annual days, employee engagement and corporate events. Call +91 7401030000.',
    tagline: 'Delivering world-class corporate and industrial events across Sri City Special Economic Zone.',
    intro: 'Sri City is a world-class integrated business city in Andhra Pradesh, home to over 200 global companies across manufacturing, logistics, IT and services. Helios Event Productions is the preferred event partner for Sri City companies, delivering factory inaugurations, international dealer meets, annual day celebrations and large-scale employee engagement events within this prestigious SEZ.',
    services: [
      { title: 'Factory & Plant Inaugurations', desc: 'Grand inauguration ceremonies for new manufacturing plants and facilities in Sri City — with full protocol, VIP management and media coverage.' },
      { title: 'International Dealer Meets', desc: 'High-profile dealer meets and distributor conferences for global brands operating out of Sri City.' },
      { title: 'Annual Day Celebrations', desc: 'Memorable annual day events for multinational workforces in Sri City with multilingual hosting and cultural programming.' },
      { title: 'Employee Engagement Activities', desc: 'Large-scale team-building and employee engagement programmes for the diverse workforce at Sri City.' },
      { title: 'Corporate Award Ceremonies', desc: 'Prestigious recognition events aligned with international brand standards for global companies.' },
      { title: 'Product & Vehicle Launches', desc: 'Professionally managed product and vehicle launches with stage production, media and influencer coordination.' },
      { title: 'Corporate Conferences', desc: 'Business conferences and townhalls for senior leadership and management teams across Sri City\'s business community.' },
      { title: 'CSR & Community Events', desc: 'Corporate social responsibility events and community initiatives for companies based in Sri City.' },
    ],
    faqs: [
      { q: 'What events do you manage in Sri City?', a: 'We manage factory inaugurations, international dealer meets, annual days, employee engagement, product launches, award ceremonies, conferences and CSR events for Sri City companies.' },
      { q: 'Can you manage events within Sri City SEZ?', a: 'Yes. We are familiar with SEZ protocols and security requirements and have managed events within Sri City and similar special economic zones.' },
      { q: 'Do you manage events for international companies?', a: 'Absolutely. We have extensive experience working with multinational companies and can accommodate multilingual requirements and international brand standards.' },
      { q: 'Can you manage large-scale events for 2,000+ employees?', a: 'Yes. We regularly deliver events for large manufacturing workforces, including events for 2,000–5,000+ attendees.' },
      { q: 'How much does event management cost in Sri City?', a: 'Pricing depends on event type, scale and services. We provide transparent, competitive quotes for all clients. Contact us to discuss your requirements.' },
      { q: 'How far in advance should we book?', a: 'For large events with international delegates, 8–10 weeks in advance is ideal. For standard corporate events, 4–6 weeks is sufficient.' },
    ],
  },
  'event-management-in-siruseri': {
    area: 'Siruseri',
    title: 'Event Management in Siruseri, Chennai — IT & Corporate Events',
    metaTitle: 'Event Management Company in Siruseri SIPCOT IT Park Chennai',
    metaDescription: 'Professional event management in Siruseri Chennai. Corporate events, annual days, product launches and employee engagement for SIPCOT IT Park companies. Call +91 7401030000.',
    tagline: 'Your trusted event partner for IT companies and corporates in Siruseri, Chennai.',
    intro: 'Siruseri is home to the prestigious SIPCOT IT Park, one of South India\'s largest IT hubs. Helios Event Productions serves the Siruseri IT community with professional corporate events, annual day celebrations, tech conferences, employee engagement programmes and product launches tailored to the culture and expectations of world-class IT companies.',
    services: [
      { title: 'IT Corporate Event Management', desc: 'End-to-end event management for IT companies in Siruseri SIPCOT — from townhalls to large-scale conferences.' },
      { title: 'Annual Day & Year-end Events', desc: 'Vibrant annual day celebrations and year-end parties for IT and tech company workforces in Siruseri.' },
      { title: 'Employee Engagement Activities', desc: 'Creative team-building, hackathons, fun Fridays and engagement programmes for IT professionals.' },
      { title: 'Tech Conferences & Summits', desc: 'Professionally managed tech conferences, DevSummits and industry events for Siruseri\'s IT community.' },
      { title: 'Product & Software Launch Events', desc: 'Product and software launch events with live demos, media coordination and client hospitality.' },
      { title: 'Corporate Award Ceremonies', desc: 'Prestigious technology and innovation awards that celebrate excellence within your IT organisation.' },
      { title: 'Virtual & Hybrid Events', desc: 'Fully managed virtual and hybrid events for distributed IT teams across time zones.' },
      { title: 'Office Inauguration Events', desc: 'New office and facility inauguration ceremonies for growing IT companies in Siruseri.' },
    ],
    faqs: [
      { q: 'What events do you manage in Siruseri?', a: 'We specialise in IT corporate events in Siruseri — annual days, tech conferences, employee engagement, product launches, award ceremonies, virtual events and office inaugurations.' },
      { q: 'Do you have experience with SIPCOT IT Park events?', a: 'Yes. We have managed multiple events for companies within SIPCOT IT Park and are familiar with the campus protocols and logistics.' },
      { q: 'Can you manage virtual and hybrid events for IT teams?', a: 'Absolutely. We provide complete virtual and hybrid event production — streaming, interactive platforms, moderation and technical support.' },
      { q: 'Do you handle year-end parties for IT companies?', a: 'Yes. Year-end parties and annual day celebrations are among our most popular services for IT companies in Siruseri.' },
      { q: 'How much does event management cost in Siruseri?', a: 'Costs depend on event type and scale. We offer packages for startups, mid-size and large IT enterprises. Contact us for a tailored quote.' },
      { q: 'How far in advance should we book?', a: 'For year-end events and peak season bookings, we recommend 6–8 weeks. For other corporate events, 3–4 weeks is typically sufficient.' },
    ],
  },
  'event-management-in-porur': {
    area: 'Porur',
    title: 'Event Management in Porur, Chennai — Corporate & Social Events',
    metaTitle: 'Event Management Company in Porur Chennai - Corporate Events',
    metaDescription: 'Leading event management company in Porur Chennai. Corporate events, weddings, annual days, employee engagement and product launches. Call +91 7401030000.',
    tagline: 'Professional event management for corporate and social events in Porur, Chennai.',
    intro: 'Porur is one of Chennai\'s fastest-growing suburbs, home to a thriving mix of IT companies, manufacturing units and residential communities. Helios Event Productions delivers premium corporate events, product launches, annual day celebrations, weddings and social events for clients across Porur and the West Chennai corridor.',
    services: [
      { title: 'Corporate Event Management', desc: 'End-to-end corporate event planning and execution for companies in Porur — conferences, meetings and townhalls.' },
      { title: 'Annual Day Celebrations', desc: 'Memorable annual day events combining entertainment, awards and employee appreciation.' },
      { title: 'Wedding & Social Events', desc: 'Elegant weddings and social celebrations for Porur families with complete event design and management.' },
      { title: 'Product Launch Events', desc: 'Impactful product launches with professional stage, lighting, AV and media production.' },
      { title: 'Employee Engagement Activities', desc: 'Fun and productive team-building and engagement events for corporate employees in Porur.' },
      { title: 'Corporate Award Ceremonies', desc: 'Well-produced award ceremonies that recognise and motivate your best performers.' },
      { title: 'Birthday & Celebration Events', desc: 'Milestone birthday parties and personal celebrations managed with flair and attention to detail.' },
      { title: 'Sports Day Events', desc: 'Energetic sports days and recreational activities for corporate teams in Porur.' },
    ],
    faqs: [
      { q: 'What events do you manage in Porur?', a: 'We handle corporate events, annual days, weddings, social celebrations, product launches, employee engagement, award ceremonies and sports days in Porur.' },
      { q: 'Do you manage weddings in Porur?', a: 'Yes. We manage both traditional Tamil weddings and modern celebrations in Porur, with complete décor, catering coordination and entertainment.' },
      { q: 'Can you manage both corporate and personal events?', a: 'Absolutely. We are equally experienced in corporate and social/personal events and bring the same professionalism to both.' },
      { q: 'What venues do you recommend near Porur?', a: 'We work with several banquet halls, hotels and event spaces in and around Porur and can recommend the best venue for your event type and guest count.' },
      { q: 'How much does event management cost in Porur?', a: 'Pricing varies by event type and requirements. We offer flexible packages to fit all budgets. Contact us for a free quote.' },
      { q: 'How far in advance should I book?', a: 'For weddings and large events, 2–3 months in advance is ideal. For corporate events, 3–4 weeks is usually sufficient.' },
    ],
  },
  'event-planner-in-anna-salai': {
    area: 'Anna Salai',
    title: 'Event Planner in Anna Salai, Chennai — Corporate & Premium Events',
    metaTitle: 'Event Planner in Anna Salai Chennai - Corporate & Premium Events',
    metaDescription: 'Top event planner in Anna Salai (Mount Road) Chennai. Premium corporate events, product launches, press conferences and brand activations. Call +91 7401030000.',
    tagline: 'Chennai\'s most trusted event partner for premium corporate and brand events on Anna Salai.',
    intro: 'Anna Salai (Mount Road) is the heart of commercial Chennai, lined with corporate offices, luxury hotels and major business hubs. Helios Event Productions delivers premium corporate events, press conferences, product launches, brand activations and award ceremonies for the prestige businesses and brands headquartered on Anna Salai and the Central Chennai corridor.',
    services: [
      { title: 'Premium Corporate Events', desc: 'World-class corporate events for Anna Salai\'s top businesses — board meetings, leadership summits and executive dinners.' },
      { title: 'Press Conference Management', desc: 'Professional press conferences and media events with journalist coordination, AV production and PR support.' },
      { title: 'Product Launch Events', desc: 'High-profile product and brand launches in Chennai\'s premium venues along Anna Salai and the Central CBD.' },
      { title: 'Brand Activations', desc: 'Creative brand activation events and experiential marketing campaigns for Anna Salai\'s retail and corporate brands.' },
      { title: 'Annual Day Celebrations', desc: 'Elegant annual day events for corporate offices headquartered on Anna Salai and Mount Road.' },
      { title: 'Award Ceremonies', desc: 'Prestigious awards galas and recognition events at Chennai\'s finest hotels along Anna Salai.' },
      { title: 'Corporate Conference Management', desc: 'Large-scale conferences and business summits at premium venues — WTCM, hotels and corporate campuses.' },
      { title: 'Exhibition & Trade Events', desc: 'Exhibition management and trade event support for companies with Anna Salai addresses.' },
    ],
    faqs: [
      { q: 'What events do you manage in Anna Salai?', a: 'We manage premium corporate events, press conferences, product launches, brand activations, annual days, award galas and conferences for businesses on Anna Salai and in Central Chennai.' },
      { q: 'Which venues on Anna Salai do you work with?', a: 'We work with all major hotels and event venues on and around Anna Salai, including ITC Grand Chola, Hilton, and other premium business hotels in Central Chennai.' },
      { q: 'Can you organise press conferences in Chennai?', a: 'Yes. Press conference management is one of our specialities — we handle media invites, AV setup, backdrop branding, live streaming and post-event media packs.' },
      { q: 'Do you manage events for luxury and premium brands?', a: 'Absolutely. We understand the standards required for premium brand events and deliver experiences that match the highest expectations.' },
      { q: 'How much does a premium event in Anna Salai cost?', a: 'Costs vary based on venue, production scale and services. We provide transparent quotes with no hidden costs. Contact us for a free consultation.' },
      { q: 'How far in advance should we book for Anna Salai venues?', a: 'Premium venues on Anna Salai get booked quickly. We recommend booking 6–8 weeks in advance for the best venue availability and production time.' },
    ],
  },
};

const WHY_CHOOSE = [
  { icon: '🏆', title: 'Experienced Team', desc: '20+ years of delivering flawless events across Tamil Nadu and India.' },
  { icon: '💡', title: 'Creative Solutions', desc: 'Unique concepts tailored to your brand identity and event objectives.' },
  { icon: '🔄', title: 'End-to-End Service', desc: 'We handle everything — concept, logistics, execution and post-event review.' },
  { icon: '💰', title: 'Budget-Friendly', desc: 'Transparent pricing with flexible packages to suit all event budgets.' },
];

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return Object.keys(LOCATIONS).map(slug => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const loc = LOCATIONS[slug];
  if (!loc) return {};
  return {
    title: loc.metaTitle,
    description: loc.metaDescription,
    keywords: `event management ${loc.area.toLowerCase()}, event planner ${loc.area.toLowerCase()} chennai, corporate events ${loc.area.toLowerCase()}`,
    alternates: { canonical: `/chennai/${slug}` },
    openGraph: {
      title: loc.metaTitle,
      description: loc.metaDescription,
      url: `https://heliosevent.in/chennai/${slug}`,
      type: 'website',
    },
  };
}

export default async function LocationPage({ params }: Props) {
  const { slug } = await params;
  const loc = LOCATIONS[slug];
  if (!loc) notFound();

  return (
    <main style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0d1117 0%, #1a1f2e 50%, #0f1a0f 100%)',
        padding: 'clamp(80px, 10vw, 120px) clamp(20px, 6vw, 80px)',
        position: 'relative', overflow: 'hidden', textAlign: 'center',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(173,201,5,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
        {/* Breadcrumb */}
        <div style={{ position: 'relative', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontFamily: "'Inter', sans-serif" }}>
          <Link href="/" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <Link href="/services" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Services</Link>
          <span>/</span>
          <span style={{ color: '#adc905' }}>{loc.area}</span>
        </div>
        <div style={{ position: 'relative', display: 'inline-block', background: 'rgba(173,201,5,0.12)', border: '1px solid rgba(173,201,5,0.3)', borderRadius: '100px', padding: '6px 18px', fontSize: '11px', fontWeight: 700, color: '#adc905', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '20px' }}>
          Chennai — {loc.area}
        </div>
        <h1 style={{ position: 'relative', fontSize: 'clamp(24px, 4vw, 48px)', fontWeight: 900, color: '#fff', lineHeight: 1.2, marginBottom: '16px', fontFamily: "'Poppins', sans-serif", maxWidth: '800px', margin: '0 auto 16px' }}>
          {loc.title}
        </h1>
        <p style={{ position: 'relative', fontSize: 'clamp(14px, 2vw, 17px)', color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, maxWidth: '640px', margin: '0 auto 36px', fontFamily: "'Inter', sans-serif" }}>
          {loc.tagline}
        </p>
        <div style={{ position: 'relative', display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/get-quote" style={{ padding: '14px 32px', background: 'linear-gradient(135deg, #adc905, #c8e606)', color: '#0d1117', fontWeight: 700, borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontFamily: "'Inter', sans-serif" }}>
            Get a Free Quote
          </Link>
          <a href="https://wa.me/917401030000?text=Hi%2C%20I%20need%20event%20management%20in%20{loc.area}" target="_blank" rel="noopener noreferrer" style={{ padding: '14px 32px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontWeight: 600, borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontFamily: "'Inter', sans-serif" }}>
            WhatsApp Us
          </a>
        </div>
      </div>

      {/* Intro */}
      <div style={{ background: '#fff', padding: 'clamp(48px, 6vw, 80px) clamp(20px, 6vw, 80px)' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 'clamp(15px, 1.8vw, 18px)', color: '#444', lineHeight: 1.85, fontFamily: "'Inter', sans-serif" }}>
            {loc.intro}
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div style={{ background: '#f8f9fa', padding: 'clamp(48px, 6vw, 80px) clamp(20px, 6vw, 80px)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#adc905', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px' }}>What We Offer</div>
            <h2 style={{ fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 800, color: '#111', fontFamily: "'Poppins', sans-serif" }}>
              Comprehensive Event Services in {loc.area}
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
            {loc.services.map((svc, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px 22px', borderTop: '3px solid #adc905' }}>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#111', marginBottom: '8px', fontFamily: "'Poppins', sans-serif" }}>{svc.title}</div>
                <div style={{ fontSize: '13px', color: '#666', lineHeight: 1.7, fontFamily: "'Inter', sans-serif" }}>{svc.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div style={{ background: '#fff', padding: 'clamp(48px, 6vw, 80px) clamp(20px, 6vw, 80px)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#adc905', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px' }}>Why Helios</div>
            <h2 style={{ fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 800, color: '#111', fontFamily: "'Poppins', sans-serif" }}>
              Why Choose Our Event Services
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '24px' }}>
            {WHY_CHOOSE.map((item, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '32px 20px', background: '#f8f9fa', borderRadius: '16px' }}>
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>{item.icon}</div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#111', marginBottom: '8px', fontFamily: "'Poppins', sans-serif" }}>{item.title}</div>
                <div style={{ fontSize: '13px', color: '#666', lineHeight: 1.7, fontFamily: "'Inter', sans-serif" }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ background: '#f8f9fa', padding: 'clamp(48px, 6vw, 80px) clamp(20px, 6vw, 80px)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#adc905', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px' }}>FAQ</div>
            <h2 style={{ fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 800, color: '#111', fontFamily: "'Poppins', sans-serif" }}>
              Frequently Asked Questions
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {loc.faqs.map((faq, i) => (
              <details key={i} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden' }}>
                <summary style={{ padding: '18px 20px', fontSize: '15px', fontWeight: 600, color: '#111', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: "'Poppins', sans-serif" }}>
                  {faq.q}
                  <span style={{ color: '#adc905', flexShrink: 0, marginLeft: '12px', fontSize: '20px', fontWeight: 300 }}>+</span>
                </summary>
                <div style={{ padding: '0 20px 18px', fontSize: '14px', color: '#555', lineHeight: 1.8, fontFamily: "'Inter', sans-serif" }}>
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Strip */}
      <div style={{ background: 'linear-gradient(135deg, #adc905 0%, #c8e606 100%)', padding: 'clamp(48px, 6vw, 72px) clamp(20px, 6vw, 80px)', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(22px, 3vw, 38px)', fontWeight: 900, color: '#0d1117', marginBottom: '12px', fontFamily: "'Poppins', sans-serif" }}>
          Ready to Plan Your Event in {loc.area}?
        </h2>
        <p style={{ fontSize: '16px', color: '#2a3000', marginBottom: '32px', fontFamily: "'Inter', sans-serif" }}>
          Talk to our team today — we'll get back with a tailored proposal within 24 hours.
        </p>
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/get-quote" style={{ padding: '14px 36px', background: '#0d1117', color: '#fff', fontWeight: 700, borderRadius: '8px', textDecoration: 'none', fontSize: '15px', fontFamily: "'Inter', sans-serif" }}>
            Get a Free Quote
          </Link>
          <a href="tel:+917401030000" style={{ padding: '14px 36px', background: 'rgba(0,0,0,0.15)', color: '#0d1117', fontWeight: 700, borderRadius: '8px', textDecoration: 'none', fontSize: '15px', fontFamily: "'Inter', sans-serif" }}>
            +91 7401 030 000
          </a>
        </div>
      </div>

      {/* Other Locations */}
      <div style={{ background: '#1a1f2e', padding: 'clamp(40px, 5vw, 60px) clamp(20px, 6vw, 80px)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#adc905', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '20px' }}>We Also Serve</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
            {Object.entries(LOCATIONS).filter(([s]) => s !== slug).map(([s, l]) => (
              <Link key={s} href={`/chennai/${s}`} style={{ padding: '7px 18px', borderRadius: '999px', border: '1px solid rgba(173,201,5,0.3)', background: 'rgba(173,201,5,0.08)', color: 'rgba(255,255,255,0.7)', fontSize: '13px', textDecoration: 'none', fontFamily: "'Inter', sans-serif", whiteSpace: 'nowrap' }}>
                {l.area}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
