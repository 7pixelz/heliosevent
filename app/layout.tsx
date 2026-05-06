import type { Metadata } from 'next';
import './globals.css';

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
      </head>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
