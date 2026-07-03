/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
      // ── Old WordPress page slugs ──
      { source: '/about-us',        destination: '/about',     permanent: true },
      { source: '/about-us/',       destination: '/about',     permanent: true },
      { source: '/contact-us',      destination: '/contact',   permanent: true },
      { source: '/contact-us/',     destination: '/contact',   permanent: true },
      { source: '/event-gallery',   destination: '/portfolio', permanent: true },
      { source: '/event-gallery/',  destination: '/portfolio', permanent: true },

      // ── Old service pages ──
      { source: '/mice',                                    destination: '/services',                                                  permanent: true },
      { source: '/mice/',                                   destination: '/services',                                                  permanent: true },
      { source: '/sports-events',                           destination: '/services/sports-event-management-company-in-chennai',       permanent: true },
      { source: '/sports-events/',                          destination: '/services/sports-event-management-company-in-chennai',       permanent: true },
      { source: '/seminars-conferences',                    destination: '/services',                                                  permanent: true },
      { source: '/seminars-conferences/',                   destination: '/services',                                                  permanent: true },
      { source: '/corporate-event-organisers-in-chennai',  destination: '/services/corporate-event-management-in-chennai',            permanent: true },
      { source: '/corporate-event-organisers-in-chennai/', destination: '/services/corporate-event-management-in-chennai',            permanent: true },
      { source: '/amazing-race-for-corporates-gps-based-truss-run-events',  destination: '/services', permanent: true },
      { source: '/amazing-race-for-corporates-gps-based-truss-run-events/', destination: '/services', permanent: true },

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

      // ── Landing pages & misc → homepage ──
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
