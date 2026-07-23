'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';

const INACTIVITY_TIMEOUT = 30 * 60 * 1000;
const WARNING_BEFORE = 60 * 1000;
const BACKGROUND_SIGNOUT_SECONDS = 60;

export function SessionTimeout() {
  const { data: session, status } = useSession();
  const [showWarning, setShowWarning] = useState(false);
  const [showCloseWarning, setShowCloseWarning] = useState(false);
  const [countdown, setCountdown] = useState(WARNING_BEFORE / 1000);
  const [bgCountdown, setBgCountdown] = useState(BACKGROUND_SIGNOUT_SECONDS);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warningRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const bgTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bgCountdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sessionRef = useRef(session);
  const statusRef = useRef(status);

  sessionRef.current = session;
  statusRef.current = status;

  const cleanup = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (warningRef.current) clearTimeout(warningRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
    if (bgTimerRef.current) clearTimeout(bgTimerRef.current);
    if (bgCountdownRef.current) clearInterval(bgCountdownRef.current);
  }, []);

  const performSignout = useCallback((reason: string) => {
    try {
      const sessionCookie = document.cookie
        .split('; ')
        .find((c) => c.startsWith('__Secure-next-auth.session-token=') || c.startsWith('next-auth.session-token='));
      const token = sessionCookie ? sessionCookie.split('=')[1] : '';

      if (token && navigator.sendBeacon) {
        const csrfMeta = document.querySelector('meta[name="csrf-token"]');
        const csrfToken = csrfMeta?.getAttribute('content') || '';

        const body = new URLSearchParams();
        body.append('csrfToken', csrfToken);
        body.append('callbackUrl', '/auth/login?reason=' + reason);
        body.append('json', 'true');

        navigator.sendBeacon('/api/auth/signout', body);
      } else if (token) {
        fetch('/api/auth/signout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `callbackUrl=/auth/login?reason=${reason}&json=true`,
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      // Silent fail on unload
    }
  }, []);

  const resetTimer = useCallback(() => {
    cleanup();
    setShowWarning(false);
    setShowCloseWarning(false);
    setCountdown(WARNING_BEFORE / 1000);

    if (statusRef.current !== 'authenticated') return;

    warningRef.current = setTimeout(() => {
      setShowWarning(true);
      setCountdown(WARNING_BEFORE / 1000);

      countdownRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            cleanup();
            signOut({ callbackUrl: '/auth/login?reason=timeout' });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, INACTIVITY_TIMEOUT - WARNING_BEFORE);

    timerRef.current = setTimeout(() => {
      cleanup();
      signOut({ callbackUrl: '/auth/login?reason=timeout' });
    }, INACTIVITY_TIMEOUT);
  }, [cleanup]);

  useEffect(() => {
    if (status !== 'authenticated') {
      cleanup();
      return;
    }

    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    const onActivity = () => resetTimer();

    activityEvents.forEach((e) => document.addEventListener(e, onActivity, { passive: true }));
    resetTimer();

    return () => {
      cleanup();
      activityEvents.forEach((e) => document.removeEventListener(e, onActivity));
    };
  }, [status, resetTimer]);

  // Tab close: signout via beacon + browser warning
  useEffect(() => {
    if (status !== 'authenticated') return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      performSignout('tab_closed');
      e.preventDefault();
      e.returnValue = '';
    };

    const handleUnload = () => {
      performSignout('tab_closed');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('unload', handleUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('unload', handleUnload);
    };
  }, [status, performSignout]);

  // Tab hidden: show custom warning, auto-signout after 60s
  useEffect(() => {
    if (status !== 'authenticated') return;

    const handleVisibility = () => {
      if (document.hidden) {
        if (statusRef.current !== 'authenticated') return;

        setShowCloseWarning(true);
        setBgCountdown(BACKGROUND_SIGNOUT_SECONDS);

        bgCountdownRef.current = setInterval(() => {
          setBgCountdown((prev) => {
            if (prev <= 1) {
              cleanup();
              performSignout('tab_hidden');
              signOut({ callbackUrl: '/auth/login?reason=tab_closed' });
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        bgTimerRef.current = setTimeout(() => {
          cleanup();
          performSignout('tab_hidden');
          signOut({ callbackUrl: '/auth/login?reason=tab_closed' });
        }, BACKGROUND_SIGNOUT_SECONDS * 1000);
      } else {
        if (bgTimerRef.current) clearTimeout(bgTimerRef.current);
        if (bgCountdownRef.current) clearInterval(bgCountdownRef.current);
        setShowCloseWarning(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      if (bgTimerRef.current) clearTimeout(bgTimerRef.current);
      if (bgCountdownRef.current) clearInterval(bgCountdownRef.current);
    };
  }, [status, cleanup, performSignout]);

  // Inactivity warning
  if (showWarning && status === 'authenticated') {
    const minutes = Math.floor(countdown / 60);
    const seconds = countdown % 60;

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-white dark:bg-secondary-800 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 text-center">
          <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-2">
            Session Expiring Soon
          </h3>
          <p className="text-secondary-600 dark:text-secondary-400 mb-4">
            You will be logged out due to inactivity in:
          </p>
          <div className="text-4xl font-mono font-bold text-primary-600 mb-6">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
          <p className="text-sm text-secondary-500 dark:text-secondary-400 mb-6">
            Move your mouse or press any key to stay logged in.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => {
                cleanup();
                setShowWarning(false);
                resetTimer();
              }}
              className="flex-1 bg-primary-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              Stay Logged In
            </button>
            <button
              onClick={() => {
                cleanup();
                signOut({ callbackUrl: '/auth/login' });
              }}
              className="flex-1 bg-secondary-100 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-300 py-2.5 px-4 rounded-lg font-medium hover:bg-secondary-200 dark:hover:bg-secondary-600 transition-colors"
            >
              Log Out Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Tab close/hidden warning
  if (showCloseWarning && status === 'authenticated') {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-white dark:bg-secondary-800 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-2">
            Tab Left Open
          </h3>
          <p className="text-secondary-600 dark:text-secondary-400 mb-4">
            Your tab was closed or switched. You will be logged out in:
          </p>
          <div className="text-4xl font-mono font-bold text-red-600 mb-6">
            {String(Math.floor(bgCountdown / 60)).padStart(2, '0')}:{String(bgCountdown % 60).padStart(2, '0')}
          </div>
          <p className="text-sm text-secondary-500 dark:text-secondary-400 mb-6">
            Switch back to this tab to stay logged in, or sign out now.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => {
                cleanup();
                setShowCloseWarning(false);
              }}
              className="flex-1 bg-primary-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              I&apos;m Back
            </button>
            <button
              onClick={() => {
                cleanup();
                performSignout('manual');
                signOut({ callbackUrl: '/auth/login' });
              }}
              className="flex-1 bg-secondary-100 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-300 py-2.5 px-4 rounded-lg font-medium hover:bg-secondary-200 dark:hover:bg-secondary-600 transition-colors"
            >
              Log Out Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
