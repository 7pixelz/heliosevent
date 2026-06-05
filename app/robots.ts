import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/feedback'],
      },
    ],
    sitemap: 'https://www.heliosevent.in/sitemap.xml',
  };
}
