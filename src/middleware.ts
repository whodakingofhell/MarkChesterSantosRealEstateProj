import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // Request ID for debugging/tracing
  response.headers.set('X-Request-Id', crypto.randomUUID());

  // API-specific checks
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth/')) {
    const userAgent = request.headers.get('user-agent');
    if (!userAgent || userAgent.length < 5) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots\\.txt|sitemap\\.xml|manifest\\.webmanifest|.*\\.(?:txt|xml|json|ico|png|jpg|svg|woff2)$).*)',
  ],
};
