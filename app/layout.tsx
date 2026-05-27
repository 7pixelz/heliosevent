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
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Preload above-fold logo — Header is 'use client' so Next.js won't auto-preload it */}
        <link
          rel="preload"
          as="image"
          // @ts-ignore
          imagesrcset="/_next/image?url=%2Fassets%2Fheliosevent_logo_white.webp&w=128&q=75 128w, /_next/image?url=%2Fassets%2Fheliosevent_logo_white.webp&w=256&q=75 256w, /_next/image?url=%2Fassets%2Fheliosevent_logo_white.webp&w=384&q=75 384w"
          imagesizes="(max-width:640px) 150px, 205px"
          fetchPriority="high"
        />
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
      </head>
      <body className={`${poppins.variable} ${inter.variable}`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
