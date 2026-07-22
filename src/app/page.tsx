'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function Home() {
  const { data: session, status } = useSession();
  const isLoggedIn = status === 'authenticated' && session;

  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'RealEstateAgent',
            name: 'Philippine Skyland MGT and DEVT OPC (PPSMDO)',
            description: 'Licensed real estate broker and appraiser. Enterprise-grade property management platform for Philippine real estate professionals.',
            url: 'https://philippine-skyland.vercel.app',
            telephone: '+639174722107',
            email: 'nelsonaczon@gmail.com',
            address: {
              '@type': 'PostalAddress',
              addressCountry: 'PH',
            },
            areaServed: {
              '@type': 'Country',
              name: 'Philippines',
            },
            hasOfferCatalog: {
              '@type': 'OfferCatalog',
              name: 'Real Estate Services',
              itemListElement: [
                {
                  '@type': 'Offer',
                  itemOffered: {
                    '@type': 'Service',
                    name: 'Property Brokerage',
                    description: 'Licensed real estate brokerage services for buying, selling, and leasing properties in the Philippines.',
                  },
                },
                {
                  '@type': 'Offer',
                  itemOffered: {
                    '@type': 'Service',
                    name: 'Property Appraisal',
                    description: 'Professional property appraisal and valuation services by PRC-licensed appraisers.',
                  },
                },
              ],
            },
            founder: {
              '@type': 'Person',
              name: 'Nelson Aczon',
            },
          }),
        }}
      />
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          {isLoggedIn && (
            <div className="mb-6 inline-flex items-center gap-2 bg-white/15 backdrop-blur px-4 py-2 rounded-full text-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Logged in as <span className="font-semibold">{session.user?.name}</span>
              <span className="text-primary-200">({(session.user as any)?.role})</span>
            </div>
          )}
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Philippine Skyland
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-100">
            MGT and DEVT OPC (PPSMDO) Licensed Real Estate Broker and Appraiser
          </p>
          <p className="text-lg mb-12 text-primary-200 max-w-2xl mx-auto">
            Enterprise-grade property appraisal management platform for Philippine real estate professionals
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isLoggedIn ? (
              <>
                <Link
                  href="/dashboard"
                  className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
                >
                  Go to Dashboard
                </Link>
                <Link
                  href="/properties"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
                >
                  Browse Properties
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/auth/register"
                  className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
                >
                  Get Started
                </Link>
                <Link
                  href="/auth/login"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary-50 dark:bg-secondary-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-secondary-900 dark:text-white">
            Platform Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', title: 'Professional Profiles', desc: 'Public profiles with direct contact buttons for brokers and appraisers' },
              { icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', title: 'Property Management', desc: 'List, search, and manage properties with advanced filters' },
              { icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', title: 'Transaction Tracking', desc: 'Complete transaction lifecycle with commission tracking' },
              { icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01', title: 'Appraisal Management', desc: 'Mobile-first field work with automated report generation' },
              { icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z', title: 'Enterprise Security', desc: '10-layer defense-in-depth security stack' },
              { icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', title: 'Multi-Tenant Support', desc: 'SaaS-ready with company isolation and branding' },
            ].map((feature) => (
              <div key={feature.title} className="bg-white dark:bg-secondary-800 p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-secondary-900 dark:text-white">{feature.title}</h3>
                <p className="text-secondary-600 dark:text-secondary-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-secondary-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Transform Your Real Estate Business?
          </h2>
          <p className="text-xl mb-8 text-secondary-300 max-w-2xl mx-auto">
            Join thousands of licensed brokers and appraisers using Philippine Skyland
          </p>
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Go to Dashboard
            </Link>
          ) : (
            <Link
              href="/auth/register"
              className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Start Free Trial
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-secondary-100 dark:bg-secondary-800">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold text-secondary-900 dark:text-white mb-4">Philippine Skyland</h3>
              <p className="text-secondary-600 dark:text-secondary-400 text-sm">
                MGT and DEVT OPC (PPSMDO) Licensed Real Estate Broker and Appraiser
              </p>
              <p className="text-secondary-600 dark:text-secondary-400 text-sm mt-2">Nelson Aczon</p>
            </div>
            <div>
              <h4 className="font-semibold text-secondary-900 dark:text-white mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-secondary-600 dark:text-secondary-400">
                <li><Link href="/properties" className="hover:text-primary-600">Properties</Link></li>
                <li><Link href="/faq" className="hover:text-primary-600">FAQ</Link></li>
                <li><Link href="/profile/nelson-aczon" className="hover:text-primary-600">Our Broker</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-secondary-900 dark:text-white mb-4">Contact Us</h4>
              <ul className="space-y-2 text-sm text-secondary-600 dark:text-secondary-400">
                <li>Globe: +63 917 472 2107</li>
                <li>Smart: +63 960 477 4147</li>
                <li>Email: nelsonaczon@gmail.com</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-secondary-900 dark:text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-secondary-600 dark:text-secondary-400">
                <li><Link href="/privacy" className="hover:text-primary-600">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-primary-600">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-secondary-200 dark:border-secondary-700 mt-8 pt-8 text-center text-sm text-secondary-600 dark:text-secondary-400">
            © {new Date().getFullYear()} Philippine Skyland MGT and DEVT OPC (PPSMDO). All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
