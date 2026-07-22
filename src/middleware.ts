import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Request ID for debugging/tracing
  response.headers.set('X-Request-Id', crypto.randomUUID());

  // Skip all checks for auth callback routes (NextAuth needs them unblocked)
  if (request.nextUrl.pathname.startsWith('/api/auth/')) {
    return response;
  }

  // API-specific checks
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const userAgent = request.headers.get('user-agent');
    if (!userAgent || userAgent.length < 5) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};
