import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const STATIC_FILE_EXTENSIONS = ['.txt', '.xml', '.json', '.ico', '.webmanifest', '.png', '.jpg', '.svg', '.woff2'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware entirely for static files, SEO files, and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    STATIC_FILE_EXTENSIONS.some(ext => pathname.endsWith(ext)) ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname === '/manifest.webmanifest'
  ) {
    return NextResponse.next();
  }

  const response = NextResponse.next();

  // Request ID for debugging/tracing
  response.headers.set('X-Request-Id', crypto.randomUUID());

  // API-specific checks
  if (pathname.startsWith('/api/')) {
    const userAgent = request.headers.get('user-agent');
    if (!userAgent || userAgent.length < 5) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
};
