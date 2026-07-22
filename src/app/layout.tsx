import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { Providers } from '@/components/Providers';
import { Navbar } from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Philippine Skyland MGT and DEVT OPC (PPSMDO) - Licensed Real Estate Broker and Appraiser | Nelson Aczon',
  description: 'Philippine Skyland MGT and DEVT OPC (PPSMDO) - Licensed real estate broker and appraiser. Property appraisal management platform for Philippine real estate professionals.',
  keywords: ['real estate', 'broker', 'appraiser', 'Philippines', 'property', 'license', 'Nelson Aczon', 'PPSMDO', 'Philippine Skyland'],
  authors: [{ name: 'Nelson Aczon' }],
  openGraph: {
    type: 'website',
    locale: 'en_PH',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'Philippine Skyland MGT and DEVT OPC (PPSMDO)',
    title: 'Philippine Skyland MGT and DEVT OPC (PPSMDO) - Licensed Real Estate Broker and Appraiser',
    description: 'Licensed real estate broker and appraiser. Property appraisal management platform.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Philippine Skyland MGT and DEVT OPC (PPSMDO) - Licensed Real Estate Broker and Appraiser',
    description: 'Licensed real estate broker and appraiser. Property appraisal management platform.',
  },
  robots: {
    index: true,
    follow: true,
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
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
