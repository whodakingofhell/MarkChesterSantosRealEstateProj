import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { Providers } from '@/components/Providers';
import { Navbar } from '@/components/Navbar';
import { SessionTimeout } from '@/components/SessionTimeout';
import { Chatbot } from '@/components/Chatbot';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Philippine Skyland MGT and DEVT OPC (PPSMDO) - Licensed Real Estate Broker and Appraiser | Nelson Aczon',
    template: '%s | Philippine Skyland',
  },
  description: 'Enterprise-grade real estate platform for licensed Philippine brokers and appraisers. Manage properties, track transactions, handle appraisals, and grow your client base. Contact Globe +63 917 472 2107 or Smart +63 960 477 4147.',
  keywords: [
    'real estate broker Philippines', 'licensed real estate appraiser', 'property management Philippines',
    'Nelson Aczon', 'PPSMDO', 'Philippine Skyland', 'real estate platform', 'property appraisal',
    'Manila real estate', 'Cebu properties', 'Davao real estate', 'Philippine property',
    'broker license Philippines', 'PRC licensed broker', 'real estate transaction tracking',
  ],
  authors: [{ name: 'Nelson Aczon' }],
  creator: 'Nelson Aczon',
  publisher: 'Philippine Skyland MGT and DEVT OPC (PPSMDO)',
  metadataBase: new URL('https://philippine-skyland.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_PH',
    url: 'https://philippine-skyland.vercel.app',
    siteName: 'Philippine Skyland MGT and DEVT OPC (PPSMDO)',
    title: 'Philippine Skyland - Licensed Real Estate Broker and Appraiser Platform',
    description: 'Enterprise-grade real estate platform for licensed Philippine brokers and appraisers. Manage properties, track transactions, and grow your client base.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Philippine Skyland MGT and DEVT OPC',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Philippine Skyland - Licensed Real Estate Broker and Appraiser',
    description: 'Enterprise-grade real estate platform for licensed Philippine brokers and appraisers.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (theme === 'dark' || (!theme && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.className} bg-secondary-50 dark:bg-secondary-900 text-secondary-900 dark:text-secondary-100`}>
        <Providers>
          <SessionTimeout />
          <Navbar />
          {children}
          <Chatbot />
        </Providers>
      </body>
    </html>
  );
}
