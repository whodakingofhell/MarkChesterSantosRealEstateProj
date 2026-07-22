'use client';

import { useEffect, useRef, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';

const INACTIVITY_TIMEOUT = 30 * 60 * 1000;
const WARNING_BEFORE = 60 * 1000;
const COUNTDOWN_SECONDS = 60;

export function SessionTimeout() {
  const { data: session, status } = useSession();
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warningRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cleanup = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (warningRef.current) clearTimeout(warningRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
  };

  const resetTimer = () => {
    cleanup();
    setShowWarning(false);
    setCountdown(COUNTDOWN_SECONDS);

    if (status !== 'authenticated') return;

    warningRef.current = setTimeout(() => {
      setShowWarning(true);
      setCountdown(COUNTDOWN_SECONDS);

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
  };

  useEffect(() => {
    if (status !== 'authenticated') {
      cleanup();
      return;
    }

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach((event) => document.addEventListener(event, resetTimer, { passive: true }));
    resetTimer();

    return () => {
      cleanup();
      events.forEach((event) => document.removeEventListener(event, resetTimer));
    };
  }, [status]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (status === 'authenticated') {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [status]);

  if (!showWarning || status !== 'authenticated') return null;

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
