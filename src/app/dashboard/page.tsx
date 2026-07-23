'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showRevenue, setShowRevenue] = useState(false);
  const [stats, setStats] = useState({ properties: 0, revenue: 0, inquiries: 0, rating: 0 });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/dashboard/stats')
        .then((r) => r.json())
        .then((result) => {
          if (result.success && result.data) {
            setStats(result.data);
          }
        })
        .catch(() => {});
    }
  }, [status]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-secondary-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const userRole = (session.user as any)?.role;

  const getRoleDashboard = () => {
    switch (userRole) {
      case 'BROKER':
        return {
          title: 'Broker Dashboard',
          features: [
            { name: 'My Properties', href: '/dashboard/properties', icon: '🏠' },
            { name: 'Transactions', href: '/dashboard/transactions', icon: '💰' },
            { name: 'My Profile', href: '/dashboard/profile', icon: '👤' },
            { name: 'Client Inquiries', href: '/dashboard/inquiries', icon: '📧' },
          ],
        };
      case 'APPRAISER':
        return {
          title: 'Appraiser Dashboard',
          features: [
            { name: 'My Appraisals', href: '/dashboard/properties', icon: '📋' },
            { name: 'Transactions', href: '/dashboard/transactions', icon: '💰' },
            { name: 'My Profile', href: '/dashboard/profile', icon: '👤' },
            { name: 'Client Inquiries', href: '/dashboard/inquiries', icon: '📧' },
          ],
        };
      case 'CLIENT':
        return {
          title: 'Client Dashboard',
          features: [
            { name: 'Saved Properties', href: '/properties', icon: '❤️' },
            { name: 'My Inquiries', href: '/dashboard/inquiries', icon: '📧' },
            { name: 'Transactions', href: '/dashboard/transactions', icon: '💰' },
            { name: 'Profile', href: '/dashboard/profile', icon: '👤' },
          ],
        };
      default:
        return {
          title: 'Dashboard',
          features: [
            { name: 'My Properties', href: '/dashboard/properties', icon: '🏠' },
            { name: 'Transactions', href: '/dashboard/transactions', icon: '💰' },
            { name: 'My Profile', href: '/dashboard/profile', icon: '👤' },
            { name: 'Client Inquiries', href: '/dashboard/inquiries', icon: '📧' },
          ],
        };
    }
  };

  const dashboard = getRoleDashboard();

  function formatPrice(price: number): string {
    if (price >= 1000000) return `₱${(price / 1000000).toFixed(1)}M`;
    if (price >= 1000) return `₱${(price / 1000).toFixed(0)}K`;
    return `₱${price.toLocaleString()}`;
  }

  return (
    <main className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
      <section className="bg-white dark:bg-secondary-800 shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-white mb-2">
            {dashboard.title}
          </h1>
          <p className="text-secondary-600 dark:text-secondary-400">
            Welcome back, {session.user?.name || 'User'}
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-md p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🏠</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-secondary-900 dark:text-white">{stats.properties}</p>
                <p className="text-sm text-secondary-600 dark:text-secondary-400">Properties</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-md p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-secondary-900 dark:text-white">
                    {showRevenue ? formatPrice(stats.revenue) : '•••••'}
                  </p>
                  <button
                    onClick={() => setShowRevenue(!showRevenue)}
                    className="text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300 transition-colors"
                    aria-label={showRevenue ? 'Hide revenue' : 'Show revenue'}
                  >
                    {showRevenue ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                <p className="text-sm text-secondary-600 dark:text-secondary-400">Revenue</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-md p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📧</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-secondary-900 dark:text-white">{stats.inquiries}</p>
                <p className="text-sm text-secondary-600 dark:text-secondary-400">Inquiries</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-md p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                <span className="text-2xl">⭐</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-secondary-900 dark:text-white">{stats.rating > 0 ? stats.rating.toFixed(1) : '—'}</p>
                <p className="text-sm text-secondary-600 dark:text-secondary-400">Rating</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboard.features.map((feature) => (
            <Link
              key={feature.name}
              href={feature.href}
              className="bg-white dark:bg-secondary-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow dark:hover:bg-secondary-700"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
                {feature.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
