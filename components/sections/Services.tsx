import Link from 'next/link';

interface ServiceItem {
  id: string;
  icon: string;
  name: string;
  slug: string;
  description: string;
}

const FALLBACK_MAIN: ServiceItem[] = [
  { id: 'f1', icon: '🎤', name: 'Corporate Events', slug: 'corporate-events', description: 'Conferences, product launches & award nights crafted to impress.' },
  { id: 'f2', icon: '🎭', name: 'Entertainment Events', slug: 'entertainment-events', description: 'Live shows, concerts & cultural events with professional production.' },
  { id: 'f3', icon: '🏛️', name: 'Exhibitions', slug: 'exhibitions', description: 'Turnkey expo booths designed to attract and convert visitors.' },
  { id: 'f4', icon: '🏛️', name: 'Government Protocol Events', slug: 'government-protocol-events', description: 'Official ceremonies & state functions with utmost precision & protocol.' },
  { id: 'f5', icon: '🤝', name: 'Trade Body Association Events', slug: 'trade-body-association-events', description: 'Industry summits, trade shows & association meetings, fully executed.' },
  { id: 'f6', icon: '✈️', name: 'MICE Events', slug: 'mice-events', description: 'Meetings, incentives & corporate travel, seamlessly coordinated.' },
  { id: 'f7', icon: '⚽', name: 'Sports Events', slug: 'sports-events', description: 'Tournaments, sponsorships & athletic events with complete logistics.' },
  { id: 'f8', icon: '💒', name: 'Wedding & Social Events', slug: 'wedding-social-events', description: 'Luxury weddings, festivals & private celebrations with artistic décor.' },
];

const colorClasses = ['s1', 's2', 's3', 's4', 's5', 's6'];

export default function Services({ mainServices }: { mainServices?: ServiceItem[] }) {
  const main = mainServices && mainServices.length > 0 ? mainServices : FALLBACK_MAIN;

  return (
    <section className="services" id="services">
      <div className="svc-header fade-up">
        <div className="sec-label" style={{ color: 'rgba(173,201,5,.7)' }}>What We Do</div>
        <h2 className="svc-title">Our wide range of services</h2>
      </div>

      <div className="svc-grid">
        {main.map((svc, i) => (
          <Link key={svc.id} href={`/services/${svc.slug}`} style={{ textDecoration: 'none' }}>
            <div className={`svc-card ${colorClasses[i % colorClasses.length]} fade-up`} style={{ transitionDelay: `${(i % 4) * 0.07}s`, cursor: 'pointer' }}>
              <div className="svc-bg"></div>
              <div className="svc-icon">{svc.icon}</div>
              <div className="svc-overlay"></div>
              <div className="svc-body">
                <div className="svc-num">{String(i + 1).padStart(2, '0')}</div>
                <div className="svc-name">{svc.name}</div>
                <div className="svc-desc">{svc.description}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Activities sub-group — hidden for now */}

      <div className="svc-cta fade-up" style={{ transitionDelay: '.2s' }}>
        <Link href="/get-quote" style={{ textDecoration: 'none' }}>
          <button className="svc-view-all">Get a Custom Quote →</button>
        </Link>
      </div>
    </section>
  );
}
