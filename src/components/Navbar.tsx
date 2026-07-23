'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { ThemeToggle } from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';
import { useState, useEffect } from 'react';

export function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLoggedIn = mounted && status === 'authenticated' && session;
  const isLoading = status === 'loading';

  const links = [
    { href: '/', label: 'Home' },
    { href: '/properties', label: 'Properties' },
    { href: '/blog', label: 'Blog' },
    { href: '/faq', label: 'FAQ' },
    { href: '/privacy', label: 'Privacy' },
    { href: '/terms', label: 'Terms' },
  ];

  return (
    <nav className="bg-white dark:bg-secondary-800 shadow-sm border-b border-secondary-200 dark:border-secondary-700 relative z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary-600">Philippine Skyland</span>
            <span className="text-xs text-secondary-500 dark:text-secondary-400 hidden sm:inline">PPSMDO</span>
          </Link>

          <div className="flex items-center gap-1 sm:gap-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm px-3 py-2 rounded-lg transition-colors ${
                  pathname === link.href
                    ? 'bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300 font-medium'
                    : 'text-secondary-600 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-secondary-50 dark:hover:bg-secondary-700'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {!isLoading && isLoggedIn && (
              <>
                <Link
                  href="/dashboard"
                  className={`text-sm px-3 py-2 rounded-lg transition-colors ${
                    pathname.startsWith('/dashboard')
                      ? 'bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300 font-medium'
                      : 'text-secondary-600 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-secondary-50 dark:hover:bg-secondary-700'
                  }`}
                >
                  Dashboard
                </Link>

                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg transition-colors text-secondary-600 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700"
                  >
                    <div className="w-7 h-7 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-primary-700 dark:text-primary-300">
                        {(session.user?.name || 'U').charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="hidden sm:inline max-w-[100px] truncate">{session.user?.name || 'User'}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {showUserMenu && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                      <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-secondary-800 rounded-lg shadow-lg border border-secondary-200 dark:border-secondary-700 py-1 z-50">
                        <div className="px-4 py-3 border-b border-secondary-100 dark:border-secondary-700">
                          <p className="text-sm font-medium text-secondary-900 dark:text-white">{session.user?.name}</p>
                          <p className="text-xs text-secondary-500 dark:text-secondary-400 truncate">{session.user?.email}</p>
                          <span className="inline-block mt-1 text-xs bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 px-2 py-0.5 rounded-full">
                            {(session.user as any)?.role || 'User'}
                          </span>
                        </div>
                        <Link
                          href="/dashboard"
                          onClick={() => setShowUserMenu(false)}
                          className="block px-4 py-2 text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700"
                        >
                          Dashboard
                        </Link>
                        <Link
                          href="/dashboard/profile"
                          onClick={() => setShowUserMenu(false)}
                          className="block px-4 py-2 text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700"
                        >
                          Edit Profile
                        </Link>
                        <hr className="border-secondary-100 dark:border-secondary-700 my-1" />
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            signOut({ callbackUrl: '/' });
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          Sign Out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}

            {!isLoading && !isLoggedIn && (
              <Link
                href="/auth/login"
                className="text-sm bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                Sign In
              </Link>
            )}

            {isLoading && (
              <div className="w-8 h-8 rounded-full bg-secondary-200 dark:bg-secondary-700 animate-pulse" />
            )}

            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
