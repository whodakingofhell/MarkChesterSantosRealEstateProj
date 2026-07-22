'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const errorMessages: Record<string, string> = {
    Configuration: 'There is a problem with the server configuration.',
    AccessDenied: 'Access was denied. You may not have permission to sign in.',
    Verification: 'The verification link may have expired or already been used.',
    Default: 'An authentication error occurred.',
  };

  const message = errorMessages[error || ''] || errorMessages.Default;

  return (
    <main className="min-h-screen flex items-center justify-center bg-secondary-50 py-12 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="bg-white rounded-lg shadow-md p-8">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h1 className="text-2xl font-bold text-secondary-900 mb-2">
            Authentication Error
          </h1>
          <p className="text-secondary-600 mb-6">
            {message}
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/auth/login"
              className="inline-block w-full py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 text-center"
            >
              Try Again
            </Link>
            <Link
              href="/"
              className="text-secondary-500 hover:text-secondary-700 text-sm"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center bg-secondary-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </main>
    }>
      <AuthErrorContent />
    </Suspense>
  );
}
