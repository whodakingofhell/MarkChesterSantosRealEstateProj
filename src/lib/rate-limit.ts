import { NextRequest, NextResponse } from 'next/server';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first && first !== 'unknown') return first;
  }
  return (
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  message?: string;
}

export function rateLimit(config: RateLimitConfig) {
  const { windowMs, maxRequests, message } = config;

  return async function checkRateLimit(request: NextRequest): Promise<NextResponse | null> {
    const ip = getClientIP(request);
    const now = Date.now();
    const key = `${ip}:${request.nextUrl.pathname}`;

    let entry = store.get(key);

    if (!entry || now > entry.resetAt) {
      entry = { count: 0, resetAt: now + windowMs };
      store.set(key, entry);
    }

    entry.count++;

    if (entry.count > maxRequests) {
      const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
      return NextResponse.json(
        {
          error: message || 'Too many requests. Please try again later.',
          retryAfter,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(retryAfter),
            'X-RateLimit-Limit': String(maxRequests),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(Math.ceil(entry.resetAt / 1000)),
          },
        }
      );
    }

    return null;
  };
}

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  maxRequests: 10,
  message: 'Too many authentication attempts. Please try again in 15 minutes.',
});

export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  maxRequests: 60,
  message: 'Too many API requests. Please slow down.',
});

export const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  maxRequests: 5,
  message: 'Too many contact submissions. Please wait before trying again.',
});

export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  maxRequests: 3,
  message: 'Too many registration attempts. Please try again later.',
});

if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
      if (now > entry.resetAt) {
        store.delete(key);
      }
    }
  }, 10 * 60 * 1000);
}
