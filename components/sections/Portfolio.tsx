import Link from 'next/link';
import { prisma } from '../../lib/prisma';

const CAT_LABELS: Record<string, string> = {
  'corporate-events': 'Corporate',
  'employee-engagement': 'Employee Engagement',
  'seminars-conferences': 'Conference',
  'exhibitions': 'Exhibition',
  'sports-events': 'Sports',
  'social-wedding': 'Wedding',
};

const FALLBACK = [
  { id: 'cmossftzf0000m40k1wvej8ut', title: 'GYPROC Corporate Dealers Meet', slug: 'gyproc-corporate-dealers-meet', category: 'corporate-events', clientName: 'GYPROC', coverImageUrl: 'https://dndigemwjlbukfauxyqx.supabase.co/storage/v1/object/public/portfolio-media/events/cmossftzf0000m40k1wvej8ut/1778154202618-jh6vds4q3h.jpg' },
  { id: 'cmossfuoc0003m40krrny4cx6', title: 'Corporate Events Portfolio', slug: 'corporate-events-portfolio', category: 'corporate-events', clientName: null, coverImageUrl: 'https://dndigemwjlbukfauxyqx.supabase.co/storage/v1/object/public/portfolio-media/events/cmossfuoc0003m40krrny4cx6/1778154204853-1elw5ck5m3e.jpg' },
  { id: 'cmossfvd60006m40kfv104n23', title: 'Employee Engagement Events', slug: 'employee-engagement-events', category: 'employee-engagement', clientName: null, coverImageUrl: 'https://dndigemwjlbukfauxyqx.supabase.co/storage/v1/object/public/portfolio-media/events/cmossfvd60006m40kfv104n23/1778154207431-138bxpzsqvk.png' },
  { id: 'cmossfw1x000im40kgkhkoh2q', title: 'RBI Conference', slug: 'rbi-conference', category: 'seminars-conferences', clientName: 'Reserve Bank of India', coverImageUrl: 'https://dndigemwjlbukfauxyqx.supabase.co/storage/v1/object/public/portfolio-media/events/cmossfw1x000im40kgkhkoh2q/1778154215070-k3x25mbqiyg.jpg' },
];

export default async function Portfolio() {
  let events = FALLBACK;

  try {
    const db = await prisma.portfolioEvent.findMany({
      where: { isActive: true, NOT: { coverImageUrl: null } },
      orderBy: { displayOrder: 'asc' },
      take: 4,
      select: { id: true, title: true, slug: true, category: true, clientName: true, coverImageUrl: true },
    });
    if (db.length > 0) events = db as typeof FALLBACK;
  } catch {
    // use fallback
  }

  return (
    <section className="portfolio">
      <div className="port-hdr fade-up">
        <div className="sec-label">Our Work</div>
        <h2 className="port-title">Events That Made An Impression</h2>
      </div>

      <div className="port-grid">
        {events.map((ev, i) => (
          <Link
            key={ev.id}
            href={`/portfolio/${ev.slug}`}
            style={{ textDecoration: 'none', transitionDelay: `${i * 0.08}s` }}
            className="port-card fade-up"
          >
            <div className="port-img">
              <div
                className="port-img-inner"
                style={{ position: 'relative', background: '#1a1f2e' }}
              >
                {ev.coverImageUrl && (
                  <img
                    src={ev.coverImageUrl}
                    alt={ev.title}
                    style={{
                      position: 'absolute', inset: 0,
                      width: '100%', height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                )}
              </div>
            </div>
            <div className="port-body">
              <div className="port-tags">
                <span className="port-tag">
                  {CAT_LABELS[ev.category] || ev.category}
                </span>
              </div>
              <div className="port-name">{ev.title}</div>
              {ev.clientName && (
                <div className="port-sub">{ev.clientName}</div>
              )}
              <div className="port-arrow">View Project →</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="port-cta fade-up" style={{ transitionDelay: '.2s' }}>
        <Link href="/portfolio" style={{ textDecoration: 'none' }}>
          <button className="port-view-all">View All Portfolio →</button>
        </Link>
      </div>
    </section>
  );
}
