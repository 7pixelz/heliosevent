/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  experimental: {
    optimizeCss: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2560],
    imageSizes: [32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  async redirects() {
    return [
      // ── Subdomains → homepage ──
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'hyundai.heliosevent.in' }],
        destination: 'https://www.heliosevent.in',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'events.heliosevent.in' }],
        destination: 'https://www.heliosevent.in',
        permanent: true,
      },

      // ── /demo → homepage ──
      { source: '/demo', destination: '/', permanent: true },
      { source: '/demo/', destination: '/', permanent: true },

      // ── Old WordPress page slugs ──
      { source: '/about-us',        destination: '/about',     permanent: true },
      { source: '/about-us/',       destination: '/about',     permanent: true },
      { source: '/contact-us',      destination: '/contact',   permanent: true },
      { source: '/contact-us/',     destination: '/contact',   permanent: true },
      { source: '/event-gallery',   destination: '/portfolio', permanent: true },
      { source: '/event-gallery/',  destination: '/portfolio', permanent: true },

      // ── Low-data service & Chennai location pages → corporate event management ──
      { source: '/services/cultural-performances',                    destination: '/services/corporate-event-management-in-chennai', permanent: true },
      { source: '/services/cultural-performances/',                   destination: '/services/corporate-event-management-in-chennai', permanent: true },
      { source: '/services/employee-engagement',                      destination: '/services/corporate-event-management-in-chennai', permanent: true },
      { source: '/services/employee-engagement/',                     destination: '/services/corporate-event-management-in-chennai', permanent: true },
      { source: '/services/corporate-games-sports',                   destination: '/services/corporate-event-management-in-chennai', permanent: true },
      { source: '/services/corporate-games-sports/',                  destination: '/services/corporate-event-management-in-chennai', permanent: true },
      { source: '/chennai/event-management-in-sriperumbudur',         destination: '/services/corporate-event-management-in-chennai', permanent: true },
      { source: '/chennai/event-management-in-sriperumbudur/',        destination: '/services/corporate-event-management-in-chennai', permanent: true },
      { source: '/chennai/event-management-in-guindy',                destination: '/services/corporate-event-management-in-chennai', permanent: true },
      { source: '/chennai/event-management-in-guindy/',               destination: '/services/corporate-event-management-in-chennai', permanent: true },
      { source: '/chennai/event-management-in-ambattur',              destination: '/services/corporate-event-management-in-chennai', permanent: true },
      { source: '/chennai/event-management-in-ambattur/',             destination: '/services/corporate-event-management-in-chennai', permanent: true },
      { source: '/chennai/event-management-in-porur',                   destination: '/services/corporate-event-management-in-chennai', permanent: true },
      { source: '/chennai/event-management-in-porur/',                  destination: '/services/corporate-event-management-in-chennai', permanent: true },
      { source: '/chennai/event-planner-in-taramani',                   destination: '/services/corporate-event-management-in-chennai', permanent: true },
      { source: '/chennai/event-planner-in-taramani/',                  destination: '/services/corporate-event-management-in-chennai', permanent: true },
      { source: '/chennai/event-management-in-omr',                     destination: '/services/corporate-event-management-in-chennai', permanent: true },
      { source: '/chennai/event-management-in-omr/',                    destination: '/services/corporate-event-management-in-chennai', permanent: true },
      { source: '/chennai/event-management-in-oragadam',                destination: '/services/corporate-event-management-in-chennai', permanent: true },
      { source: '/chennai/event-management-in-oragadam/',               destination: '/services/corporate-event-management-in-chennai', permanent: true },
      { source: '/chennai/event-management-in-vallam-chengalpattu',     destination: '/services/corporate-event-management-in-chennai', permanent: true },
      { source: '/chennai/event-management-in-vallam-chengalpattu/',    destination: '/services/corporate-event-management-in-chennai', permanent: true },
      { source: '/chennai/event-management-in-ekkatuthangal',           destination: '/services/corporate-event-management-in-chennai', permanent: true },
      { source: '/chennai/event-management-in-ekkatuthangal/',          destination: '/services/corporate-event-management-in-chennai', permanent: true },
      { source: '/chennai/event-management-in-sri-city',                destination: '/services/corporate-event-management-in-chennai', permanent: true },
      { source: '/chennai/event-management-in-sri-city/',               destination: '/services/corporate-event-management-in-chennai', permanent: true },
      { source: '/chennai/event-management-in-siruseri',                destination: '/services/corporate-event-management-in-chennai', permanent: true },
      { source: '/chennai/event-management-in-siruseri/',               destination: '/services/corporate-event-management-in-chennai', permanent: true },
      { source: '/chennai/event-planner-in-anna-salai',                 destination: '/services/corporate-event-management-in-chennai', permanent: true },
      { source: '/chennai/event-planner-in-anna-salai/',                destination: '/services/corporate-event-management-in-chennai', permanent: true },

      // ── Old WordPress root service slugs (all linked from blog posts) ──
      { source: '/corporate-events',                destination: '/services/corporate-event-management-in-chennai',  permanent: true },
      { source: '/corporate-events/',               destination: '/services/corporate-event-management-in-chennai',  permanent: true },
      { source: '/employee-engagement',             destination: '/services/employee-engagement',                    permanent: true },
      { source: '/employee-engagement/',            destination: '/services/employee-engagement',                    permanent: true },
      { source: '/brand-product-launches',          destination: '/',                                                permanent: true },
      { source: '/brand-product-launches/',         destination: '/',                                                permanent: true },
      { source: '/trade-body-association-events',   destination: '/',                                                permanent: true },
      { source: '/trade-body-association-events/',  destination: '/',                                                permanent: true },

      // ── Old blog URLs at root level (no /blog/ prefix) ──
      { source: '/off-site-retreat-10-effective-team-building-strategies-you-can-use',  destination: '/blog/off-site-retreat-10-effective-team-building-strategies-you-can-use', permanent: true },
      { source: '/off-site-retreat-10-effective-team-building-strategies-you-can-use/', destination: '/blog/off-site-retreat-10-effective-team-building-strategies-you-can-use', permanent: true },
      { source: '/unique-corporate-gifts-options-corporate-gift-ideas',                 destination: '/blog/unique-corporate-gifts-options-corporate-gift-ideas',                permanent: true },
      { source: '/unique-corporate-gifts-options-corporate-gift-ideas/',                destination: '/blog/unique-corporate-gifts-options-corporate-gift-ideas',                permanent: true },

      // ── Dead /services/* slugs linked from blog posts ──
      { source: '/services/conference-seminars-organizer-in-chennai',  destination: '/services/conferences-seminars',                permanent: true },
      { source: '/services/conference-seminars-organizer-in-chennai/', destination: '/services/conferences-seminars',                permanent: true },
      { source: '/services/press-conference-organizer-in-chennai',     destination: '/services/government-events-planner-in-chennai', permanent: true },
      { source: '/services/press-conference-organizer-in-chennai/',    destination: '/services/government-events-planner-in-chennai', permanent: true },
      { source: '/services/channel-partner-meeting-organizer-in-chennai',  destination: '/services/business-meeting-organizer-in-chennai', permanent: true },
      { source: '/services/channel-partner-meeting-organizer-in-chennai/', destination: '/services/business-meeting-organizer-in-chennai', permanent: true },

      // ── Old service pages → active service pages only ──
      { source: '/mice',                                    destination: '/services/business-meeting-organizer-in-chennai',            permanent: true },
      { source: '/mice/',                                   destination: '/services/business-meeting-organizer-in-chennai',            permanent: true },
      { source: '/sports-events',                           destination: '/services/sports-event-management-company-in-chennai',       permanent: true },
      { source: '/sports-events/',                          destination: '/services/sports-event-management-company-in-chennai',       permanent: true },
      { source: '/corporate-event-organisers-in-chennai',  destination: '/services/corporate-event-management-in-chennai',            permanent: true },
      { source: '/corporate-event-organisers-in-chennai/', destination: '/services/corporate-event-management-in-chennai',            permanent: true },
      { source: '/seminars-conferences',                    destination: '/',                                                          permanent: true },
      { source: '/seminars-conferences/',                   destination: '/',                                                          permanent: true },
      { source: '/amazing-race-for-corporates-gps-based-truss-run-events',  destination: '/', permanent: true },
      { source: '/amazing-race-for-corporates-gps-based-truss-run-events/', destination: '/', permanent: true },

      // ── Old portfolio / case study pages ──
      { source: '/event-gallery',  destination: '/portfolio', permanent: true },
      { source: '/event-gallery/', destination: '/portfolio', permanent: true },
      { source: '/case-study-sangam-steel-product-launch-event-by-helios-event-productions',  destination: '/portfolio', permanent: true },
      { source: '/case-study-sangam-steel-product-launch-event-by-helios-event-productions/', destination: '/portfolio', permanent: true },
      { source: '/global-value-webs-annual-employee-celebration-2025',  destination: '/portfolio', permanent: true },
      { source: '/global-value-webs-annual-employee-celebration-2025/', destination: '/portfolio', permanent: true },

      // ── Old blog posts at root level → /blog ──
      { source: '/helios-2026-corporate-events-planning-guide',                                     destination: '/blog', permanent: true },
      { source: '/helios-2026-corporate-events-planning-guide/',                                    destination: '/blog', permanent: true },
      { source: '/wedding-planning-guide-on-a-budget-in-chennai',                                   destination: '/blog', permanent: true },
      { source: '/wedding-planning-guide-on-a-budget-in-chennai/',                                  destination: '/blog', permanent: true },
      { source: '/guide-to-a-successful-inauguration-event-planning-helios-event',                  destination: '/blog', permanent: true },
      { source: '/guide-to-a-successful-inauguration-event-planning-helios-event/',                 destination: '/blog', permanent: true },
      { source: '/guide-to-create-ganesh-chaturthi-celebrations-at-office-helios',                  destination: '/blog', permanent: true },
      { source: '/guide-to-create-ganesh-chaturthi-celebrations-at-office-helios/',                 destination: '/blog', permanent: true },
      { source: '/best-ideas-for-world-music-day-2023-celebration-at-work',                         destination: '/blog', permanent: true },
      { source: '/best-ideas-for-world-music-day-2023-celebration-at-work/',                        destination: '/blog', permanent: true },
      { source: '/unlocking-vibrant-navratri-celebration-ideas-in-the-office',                      destination: '/blog', permanent: true },
      { source: '/unlocking-vibrant-navratri-celebration-ideas-in-the-office/',                     destination: '/blog', permanent: true },
      { source: '/world-health-day-activities-in-the-office',                                       destination: '/blog', permanent: true },
      { source: '/world-health-day-activities-in-the-office/',                                      destination: '/blog', permanent: true },
      { source: '/gudi-padwa-celebration-ideas-activity-in-office-2024',                            destination: '/blog', permanent: true },
      { source: '/gudi-padwa-celebration-ideas-activity-in-office-2024/',                           destination: '/blog', permanent: true },
      { source: '/celebrating-international-yoga-day-2024-in-the-office',                           destination: '/blog', permanent: true },
      { source: '/celebrating-international-yoga-day-2024-in-the-office/',                          destination: '/blog', permanent: true },
      { source: '/earth-day-activities-7-inspiring-activities-to-celebrate-earth-day-atwork',       destination: '/blog', permanent: true },
      { source: '/earth-day-activities-7-inspiring-activities-to-celebrate-earth-day-atwork/',      destination: '/blog', permanent: true },
      { source: '/celebrating-world-environment-day-2024-in-the-office',                            destination: '/blog', permanent: true },
      { source: '/celebrating-world-environment-day-2024-in-the-office/',                           destination: '/blog', permanent: true },
      { source: '/tamil-hindu-wedding-ceremony-kalyanam-traditions-and-rituals',                    destination: '/blog', permanent: true },
      { source: '/tamil-hindu-wedding-ceremony-kalyanam-traditions-and-rituals/',                   destination: '/blog', permanent: true },
      { source: '/6-ways-to-bring-employees-together-for-international-yoga-day-2023-celebration',  destination: '/blog', permanent: true },
      { source: '/6-ways-to-bring-employees-together-for-international-yoga-day-2023-celebration/', destination: '/blog', permanent: true },
      { source: '/5-ways-to-celebrate-world-environment-day-2023-at-office',                        destination: '/blog', permanent: true },
      { source: '/5-ways-to-celebrate-world-environment-day-2023-at-office/',                       destination: '/blog', permanent: true },
      { source: '/lohri-celebrations-ideas-in-office-decorations-and-activities',                   destination: '/blog', permanent: true },
      { source: '/lohri-celebrations-ideas-in-office-decorations-and-activities/',                  destination: '/blog', permanent: true },

      // ── Blog pagination & categories (pattern) ──
      { source: '/blog/page/:num',          destination: '/blog', permanent: true },
      { source: '/blog/page/:num/',         destination: '/blog', permanent: true },
      { source: '/blog/category/:cat',      destination: '/blog', permanent: true },
      { source: '/blog/category/:cat/',     destination: '/blog', permanent: true },
      { source: '/blog/category/:cat/feed', destination: '/blog', permanent: true },
      { source: '/blog/category/:cat/feed/',destination: '/blog', permanent: true },
      { source: '/category/:cat',           destination: '/blog', permanent: true },
      { source: '/category/:cat/',          destination: '/blog', permanent: true },
      { source: '/blog/:slug/feed',         destination: '/blog', permanent: true },
      { source: '/blog/:slug/feed/',        destination: '/blog', permanent: true },

      // ── Old WordPress root-level service pages ──
      { source: '/entertainment-events',  destination: '/services/entertainment-event-organizer-in-chennai', permanent: true },
      { source: '/entertainment-events/', destination: '/services/entertainment-event-organizer-in-chennai', permanent: true },
      { source: '/social-wedding-events',                             destination: 'https://www.nakshatrawedding.com/', permanent: true },
      { source: '/social-wedding-events/',                            destination: 'https://www.nakshatrawedding.com/', permanent: true },
      { source: '/services/wedding-event-planner-in-chennai',        destination: 'https://www.nakshatrawedding.com/', permanent: true },
      { source: '/services/wedding-event-planner-in-chennai/',       destination: 'https://www.nakshatrawedding.com/', permanent: true },
      { source: '/press-meets',  destination: '/services/government-events-planner-in-chennai', permanent: true },
      { source: '/press-meets/', destination: '/services/government-events-planner-in-chennai', permanent: true },

      // ── Dead /services/* sub-pages ──
      { source: '/services/digital-marketing',                         destination: '/services', permanent: true },
      { source: '/services/digital-marketing/',                        destination: '/services', permanent: true },
      { source: '/services/product-launch-event-planner-in-chennai',  destination: '/', permanent: true },
      { source: '/services/product-launch-event-planner-in-chennai/', destination: '/', permanent: true },
      { source: '/services/employee-engagement-planner-in-chennai',   destination: '/', permanent: true },
      { source: '/services/employee-engagement-planner-in-chennai/',  destination: '/', permanent: true },
      { source: '/services/trade-show-organizer-in-chennai',          destination: '/services/exhibition-organizer-in-chennai', permanent: true },
      { source: '/services/trade-show-organizer-in-chennai/',         destination: '/services/exhibition-organizer-in-chennai', permanent: true },
      { source: '/services/btl-activities-service-in-chennai',        destination: '/', permanent: true },
      { source: '/services/btl-activities-service-in-chennai/',       destination: '/', permanent: true },

      // ── Landing pages & misc → homepage ──
      { source: '/new',                                 destination: '/', permanent: true },
      { source: '/new/',                                destination: '/', permanent: true },
      { source: '/home-old',                            destination: '/', permanent: true },
      { source: '/home-old/',                           destination: '/', permanent: true },
      { source: '/landing-page',                        destination: '/', permanent: true },
      { source: '/landing-page/',                       destination: '/', permanent: true },
      { source: '/lp_business_gift',                    destination: '/', permanent: true },
      { source: '/lp/:path*',                           destination: '/', permanent: true },
      { source: '/become-a-vendor',                     destination: '/', permanent: true },
      { source: '/become-a-vendor/',                    destination: '/', permanent: true },
      { source: '/chennai',                             destination: '/', permanent: true },
      { source: '/chennai/',                            destination: '/', permanent: true },
      { source: '/entry',                               destination: '/', permanent: true },
      { source: '/entry/',                              destination: '/', permanent: true },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/wp-content/uploads/:path*',
        destination: '/api/wp-media/:path*',
      },
    ];
  },
}

module.exports = nextConfig
