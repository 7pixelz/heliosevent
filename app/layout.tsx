import type { Metadata } from 'next';
import Script from 'next/script';
import { Poppins, Inter } from 'next/font/google';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
});

const LOCAL_BUSINESS_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Helios Event Productions',
  image: 'https://www.heliosevent.in/assets/heliosevent_logo_white.webp',
  '@id': 'https://www.heliosevent.in/#localbusiness',
  url: 'https://www.heliosevent.in/',
  telephone: '+91 74010 30000',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '28, Judge Jambulingam Road, Mylapore,',
    addressLocality: 'chennai',
    postalCode: '600 004',
    addressCountry: 'IN',
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    opens: '09:00',
    closes: '17:00',
  },
};

const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Helios Event Productions',
  alternateName: 'Helios',
  url: 'https://www.heliosevent.in/',
  logo: 'https://www.heliosevent.in/assets/heliosevent_logo_white.webp',
};

export const metadata: Metadata = {
  title: 'Helios Event - Premium Event Management Solutions',
  description: 'Helios Event Productions offers comprehensive event management services for corporate events, weddings, exhibitions, and more.',
  keywords: 'event management, corporate events, wedding planning, exhibitions',
  icons: {
    icon: '/assets/favicon.ico',
    shortcut: '/assets/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${inter.variable}`} suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCAL_BUSINESS_SCHEMA) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_SCHEMA) }}
        />
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-PR42FKQ');`,
          }}
        />
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PR42FKQ"
            height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
          }}
        />
        {children}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-97N68GER4R"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-97N68GER4R');
          `}
        </Script>
      </body>
    </html>
  );
}
