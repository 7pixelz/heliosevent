const SERVICES = [
  { title: 'Corporate Events', desc: 'We organize corporate meetings, conferences, employee engagement programs, annual day celebrations, product launches, award ceremonies, and business events tailored to your organizational goals.' },
  { title: 'Entertainment Events', desc: 'From live concerts and celebrity appearances to cultural programs, music festivals, and stage shows, we create unforgettable entertainment experiences for audiences of all sizes.' },
  { title: 'Government & Protocol Events', desc: 'Our team specializes in planning and managing government functions, official ceremonies, protocol events, public gatherings, and VIP events with the highest standards of professionalism.' },
  { title: 'MICE Events', desc: 'We provide complete planning and management for Meetings, Incentives, Conferences, and Exhibitions, ensuring seamless coordination and successful business events.' },
  { title: 'Exhibitions & Experiential Events', desc: 'From trade shows and expos to brand activation and experiential marketing campaigns, we create engaging experiences that strengthen brand visibility and audience interaction.' },
  { title: 'Sports Events', desc: 'We organize corporate sports tournaments, marathons, athletic meets, school and college sports events, and large-scale sporting events with complete event coordination.' },
  { title: 'Virtual & Hybrid Events', desc: 'Our virtual and hybrid event solutions combine innovative technology with professional event management, enabling businesses to connect with audiences anywhere in the world.' },
  { title: 'GenZ-Centric Events', desc: 'We design creative, trend-driven events for younger audiences, including college festivals, youth engagement programs, influencer events, and interactive brand experiences.' },
];

const FAQS = [
  { q: 'What is an event management company?', a: 'An event management company specializes in planning, organizing, and executing events of all sizes. From corporate events and conferences to exhibitions, weddings, entertainment shows, and private celebrations, companies like Helios manage every aspect of an event to ensure a seamless and memorable experience.' },
  { q: 'What services does Helios Event provide?', a: 'Corporate events, entertainment events, government and protocol events, MICE events, exhibitions, experiential events, sports events, virtual and hybrid events, event decor, stage production, entertainment, and on-site event management are some of the event management services offered by Helios Event.' },
  { q: 'How can I select the best event management company?', a: 'When choosing an event management services, consider their industry experience, portfolio, client reviews, service offerings, creativity, execution capabilities, and ability to deliver events within your budget and timeline. Helios Event is committed to delivering customized event solutions with professionalism and attention to detail.' },
  { q: 'What are the reasons to hire a professional event management company?', a: 'Hiring a professional event management company saves time, reduces stress, ensures smooth coordination, provides access to reliable vendors, and delivers a well-organized event with professional execution.' },
  { q: 'How much does hiring an event management services in Chennai cost?', a: 'The cost depends on several factors, including the type of event, venue, number of attendees, decor, entertainment, catering, technical requirements, and customization.' },
  { q: 'Which Chennai event management company is the best?', a: 'The best event management planner is one that understands your objectives, offers end-to-end event management services, has an experienced event organizer team, and consistently delivers successful events with professionalism and creativity.' },
  { q: 'When should I start planning my event with an event planner?', a: 'For the best venue availability and seamless planning, it is recommended to book an event planner at least 4 to 8 weeks before your event. Larger events may require additional planning time.' },
  { q: 'Are corporate and private events organized by event management planner?', a: 'Yes. Most professional event management companies organize corporate events, government events, MICE events, exhibitions, sports events, entertainment programs, weddings, birthday celebrations, and other social gatherings.' },
  { q: 'Why should I hire a professional event organizer instead of planning the event myself?', a: 'Professional event organizers have the expertise, vendor network, and resources to manage complex event logistics efficiently. This allows you to focus on your guests while ensuring every aspect of the event is executed smoothly.' },
  { q: 'Do event management companies offer customized event packages?', a: 'Yes. Professional event management companies provide customized packages based on your event type, audience, budget, and specific requirements, ensuring every event is tailored to your expectations.' },
  { q: 'How can I get a quotation for event management services?', a: 'You can contact the event management planner with your event details, including the event type, preferred date, location, estimated guest count, and specific requirements.' },
  { q: 'Does Helios Event organize both corporate and private events?', a: 'Yes. Helios Event organizes corporate events, MICE events, exhibitions, entertainment shows, sports events, government events, and a wide range of social celebrations tailored to client requirements.' },
  { q: 'Does Helios Event provide venue booking and decoration services?', a: 'Yes. We help with branding, entertainment, hospitality, audiovisual production, stage setup, lighting, venue selection, event decor, and full event organization.' },
  { q: 'Does Helios Event offer customized event packages?', a: 'Absolutely. Every event is customized based on your objectives, audience, budget, and event requirements to deliver a unique and memorable experience.' },
];

const RELATED = [
  'Corporate Event Management in Chennai', 'Employee Engagement Activities', 'Entertainment Event Management', 'Government & Protocol Events',
  'MICE Event Management', 'Exhibition & Experiential Events', 'Sports Event Management', 'Virtual & Hybrid Events', 'GenZ-Centric Events',
  'Annual Day Event Management', 'Family Day Event Organisers', 'Employee Day Celebration', 'Kids Day Celebration', 'Team Outing Organisers',
  'Office Decoration Services', 'Festival Decoration Services', 'Product Launch Event Management', 'Conference & Seminar Management',
  'Brand Activation Events', 'Roadshow Event Management', 'Award Ceremony Organisers', 'Corporate Theme Parties', 'Gala Night Event Management',
  'CSR Event Management', 'Celebrity Management Services', 'Audio Visual Production', 'Stage Decoration Services', 'Event Production Company',
  'Corporate Event Planner in Chennai', 'Event Decorators in Chennai', 'Conference Organisers in Chennai', 'Exhibition Stall Design',
  'Event Branding Services', 'Wedding Event Management', 'Birthday Party Organisers', 'College Cultural Event Management',
  'Sports Tournament Organisers', 'Live Concert Organisers', 'Event Management Services in Chennai', 'Best Event Management Company in Chennai',
];

export default function HomeSeoContent() {
  return (
    <section style={{ background: '#fff', borderTop: '1px solid #f0f0f0' }}>
      <div className="blog-content blog-content-sm" style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 24px' }}>
        <h2>Best Event Management Company in Chennai</h2>
        <p>
          Whether you're organizing a corporate event, birthday celebration, product launch, exhibition, or social gathering, partnering with a trusted Event Management Company in Chennai ensures every detail is handled professionally. At Helios Event, we offer end-to-end event management services tailored to your vision, budget, and objectives. Our experienced event organizer team works closely with clients to create exceptional events that leave a lasting impression on guests.
        </p>
        <p>
          As a leading event management company, we specializes in delivering customized event organizing services for corporate, social, and private events across Chennai. From venue selection and creative event planning to decor, entertainment, technical production, catering, and on-site coordination, we manage every aspect of your event with professionalism and attention to detail. If you are searching for event management companies near me or the best event planners near me, Helios is your trusted partner for creating unforgettable event experiences.
        </p>

        <h2>Our Event Management Services in Chennai</h2>
        <p>
          As a leading Event Management Company in Chennai, We offer end-to-end event management services across diverse industries and event categories. Our experienced event organizer team delivers customized solutions to ensure every event is planned and executed with precision.
        </p>
        {SERVICES.map(s => (
          <div key={s.title}>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
          </div>
        ))}

        <h2>Frequently Asked Questions</h2>
        {FAQS.map(f => (
          <div key={f.q}>
            <h3>{f.q}</h3>
            <p>{f.a}</p>
          </div>
        ))}

        <h2>Related Event Management Services in Chennai</h2>
        <p>{RELATED.join(' | ')}</p>
      </div>
    </section>
  );
}
