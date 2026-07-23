'use client';

import { useState, useEffect, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function LoginForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);
  const [resendSuccess, setResendSuccess] = useState('');

  useEffect(() => {
    const errorParam = searchParams.get('error');
    const message = searchParams.get('message');
    const reset = searchParams.get('reset');
    const locked = searchParams.get('locked');

    if (errorParam === 'email-not-verified' || message === 'email-not-verified') {
      setError('Please verify your email before signing in. Check your inbox for the verification link.');
    } else if (errorParam === 'account-locked' || locked === 'true') {
      setError('Your account has been temporarily locked due to too many failed login attempts. Please try again in 15 minutes.');
    } else if (message === 'verified' || message === 'already-verified') {
      setSuccess('Email verified successfully! You can now sign in.');
    } else if (reset === 'success') {
      setSuccess('Password has been reset successfully! You can now sign in with your new password.');
    }
  }, [searchParams]);

  async function handleResendVerification() {
    if (!email) {
      setError('Please enter your email address first.');
      return;
    }
    setResendingEmail(true);
    setResendSuccess('');
    setError('');
    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (res.ok) {
        setResendSuccess(data.message || 'Verification email sent! Check your inbox.');
      } else {
        setError(data.error || 'Failed to resend verification email.');
      }
    } catch {
      setError('Failed to resend verification email.');
    } finally {
      setResendingEmail(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const checkRes = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const checkData = await checkRes.json();

      if (checkData.exists && !checkData.isEmailVerified) {
        setError('Please verify your email before signing in. Check your inbox for the verification link, or click "Resend verification email" below.');
        setIsLoading(false);
        return;
      }

      if (checkData.exists && checkData.isLocked) {
        setError('Your account has been temporarily locked due to too many failed login attempts. Please try again in 15 minutes.');
        setIsLoading(false);
        return;
      }

      const result = await signIn('credentials', {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
        callbackUrl: '/dashboard',
      });

      if (result?.error) {
        setError('Invalid email or password. Please try again.');
        setIsLoading(false);
      } else if (result?.url) {
        window.location.href = result.url;
      } else {
        window.location.href = '/dashboard';
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError('A connection error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-secondary-50 dark:bg-secondary-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-center text-3xl font-bold text-secondary-900 dark:text-white">
            Philippine Skyland
          </h1>
          <h2 className="mt-2 text-center text-xl text-secondary-600 dark:text-secondary-400">
            MGT and DEVT OPC (PPSMDO)
          </h2>
          <p className="mt-1 text-center text-sm text-secondary-500 dark:text-secondary-500">
            Licensed Real Estate Broker and Appraiser
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-sm">
            {error}
            {error.includes('verify your email') && (
              <div className="mt-2">
                <button
                  onClick={handleResendVerification}
                  disabled={resendingEmail}
                  className="text-sm font-medium text-red-800 dark:text-red-200 underline hover:no-underline disabled:opacity-50"
                >
                  {resendingEmail ? 'Sending...' : 'Resend verification email'}
                </button>
              </div>
            )}
          </div>
        )}

        {success && (
          <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg text-sm">
            {success}
          </div>
        )}

        {resendSuccess && (
          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 px-4 py-3 rounded-lg text-sm">
            {resendSuccess}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg shadow-sm bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg shadow-sm bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center justify-end">
              <Link href="/auth/forgot-password" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-secondary-600 dark:text-secondary-400">
              Don&apos;t have an account?{' '}
              <Link href="/auth/register" className="text-primary-600 hover:text-primary-700 font-medium">
                Register here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center bg-secondary-50 dark:bg-secondary-900">
        <div className="text-secondary-500">Loading...</div>
      </main>
    }>
      <LoginForm />
    </Suspense>
  );
}
