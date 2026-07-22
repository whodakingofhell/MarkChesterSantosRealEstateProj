# 10-Layer Defense-in-Depth Security Stack
## Nelson Aczon License Broker & Appraiser Platform

**Document ID:** SEC-STACK-001  
**Version:** 1.0  
**Status:** Draft  
**Last Updated:** 2026-07-22  
**Review Board:** Cybersecurity Council, Executive Board  

---

## 1. Executive Summary

This document details the implementation of a 10-layer defense-in-depth security stack for the NALBAP platform. Each layer provides independent protection, ensuring that a breach in one layer does not compromise the entire system. This approach follows the principle of "merely impossible to destroy."

---

## 2. Defense-in-Depth Philosophy

### 2.1 Core Principle
No single security measure is relied upon. Each layer catches what the previous layer missed. An attacker must bypass ALL layers to succeed.

### 2.2 Attack Flow Visualization

```
┌─────────────────────────────────────────────────────────────┐
│                    ATTACK FLOW                               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Attacker ──▶ Layer 1: HTTPS + HSTS                         │
│                    │                                         │
│                    ▼                                         │
│              Layer 2: Content Security Policy                │
│                    │                                         │
│                    ▼                                         │
│              Layer 3: Turnstile CAPTCHA                      │
│                    │                                         │
│                    ▼                                         │
│              Layer 4: HMAC Request Signing                   │
│                    │                                         │
│                    ▼                                         │
│              Layer 5: Rate Limiting                          │
│                    │                                         │
│                    ▼                                         │
│              Layer 6: Per-Email Rate Limit                   │
│                    │                                         │
│                    ▼                                         │
│              Layer 7: Duplicate Guard                        │
│                    │                                         │
│                    ▼                                         │
│              Layer 8: Timestamp Freshness                    │
│                    │                                         │
│                    ▼                                         │
│              Layer 9: Input Validation (Zod)                 │
│                    │                                         │
│                    ▼                                         │
│              Layer 10: Honeypot                              │
│                    │                                         │
│                    ▼                                         │
│              ✅ Request Processed                            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Layer Implementation

### Layer 1: HTTPS + HSTS (Transport Security)

#### Purpose
Forces HTTPS for all communications, preventing man-in-the-middle attacks and SSL stripping.

#### Implementation
```typescript
// Middleware configuration
const securityHeaders = {
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '0',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  'X-DNS-Prefetch-Control': 'off',
  'X-Permitted-Cross-Domain-Policies': 'none',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'Origin-Agent-Cluster': '?1',
  'X-Download-Options': 'noopen',
};
```

#### Nginx Configuration
```nginx
server {
    listen 443 ssl http2;
    server_name nalbap.com;
    
    # SSL Configuration
    ssl_certificate /etc/ssl/certs/nalbap.com.pem;
    ssl_certificate_key /etc/ssl/private/nalbap.com.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers off;
    
    # HSTS Header
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    
    # Security Headers
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-XSS-Protection "0" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=()" always;
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name nalbap.com;
    return 301 https://$server_name$request_uri;
}
```

#### What It Stops
- Man-in-the-middle attacks
- SSL stripping attacks
- Protocol downgrade attacks

---

### Layer 2: Content Security Policy (CSP)

#### Purpose
Prevents XSS attacks, code injection, and unauthorized script execution.

#### Implementation
```typescript
// CSP with per-request nonce
function generateCSP(nonce: string): string {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://challenges.cloudflare.com`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://images.unsplash.com",
    "connect-src 'self'",
    "font-src 'self'",
    "object-src 'none'",
    "media-src 'self'",
    "frame-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join('; ');
}

// Middleware
export async function middleware(request: NextRequest) {
  const nonce = btoa(crypto.randomUUID());
  const csp = generateCSP(nonce);
  
  const responseHeaders = new Headers();
  responseHeaders.set('Content-Security-Policy', csp);
  responseHeaders.set('X-Request-Id', crypto.randomUUID());
  
  // ... apply other headers
  
  return NextResponse.next({
    request: {
      headers: request.headers,
    },
    responseHeaders,
  });
}
```

#### What It Stops
- XSS attacks (cross-site scripting)
- Code injection attacks
- Unauthorized script execution
- Clickjacking (via frame-ancestors)

---

### Layer 3: Turnstile CAPTCHA

#### Purpose
Blocks bots, automated spam, and credential stuffing attacks.

#### Client Implementation
```tsx
// Turnstile component
'use client';
import { Turnstile } from '@marsidev/react-turnstile';

interface TurnstileWidgetProps {
  onVerify: (token: string) => void;
}

export function TurnstileWidget({ onVerify }: TurnstileWidgetProps) {
  return (
    <Turnstile
      siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
      onSuccess={onVerify}
      options={{
        appearance: 'execute',
        execution: 'render',
      }}
    />
  );
}
```

#### Server Implementation
```typescript
// Turnstile verification
async function verifyTurnstile(token: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `secret=${encodeURIComponent(secretKey)}&response=${encodeURIComponent(token)}`,
  });
  
  const result = await response.json();
  return result.success === true;
}
```

#### API Route Integration
```typescript
// In API route
export async function POST(request: Request) {
  const body = await request.json();
  
  // Layer 3: Verify Turnstile
  if (!await verifyTurnstile(body.turnstileToken)) {
    return NextResponse.json(
      { error: 'CAPTCHA verification failed' },
      { status: 403 }
    );
  }
  
  // Continue processing...
}
```

#### What It Stops
- Bots and automated attacks
- Credential stuffing
- Form spam
- DDoS attacks (partial)

---

### Layer 4: HMAC Request Signing

#### Purpose
Prevents payload tampering and parameter injection attacks.

#### Client Implementation
```typescript
// HMAC signing with Web Crypto API
async function signPayload(
  payload: Record<string, unknown>,
  secret: string
): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  
  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const message = JSON.stringify(payload);
  const messageData = encoder.encode(message);
  
  const signature = await crypto.subtle.sign('HMAC', key, messageData);
  
  return btoa(String.fromCharCode(...new Uint8Array(signature)));
}
```

#### Server Implementation
```typescript
// HMAC verification with timingSafeEqual
import { createHmac, timingSafeEqual } from 'crypto';

function verifyHMAC(
  payload: Record<string, unknown>,
  signature: string,
  secret: string
): boolean {
  const hmac = createHmac('sha256', secret);
  hmac.update(JSON.stringify(payload));
  const expectedSignature = hmac.digest('base64');
  
  // Constant-time comparison
  const sigBuffer = Buffer.from(signature, 'base64');
  const expectedBuffer = Buffer.from(expectedSignature, 'base64');
  
  if (sigBuffer.length !== expectedBuffer.length) {
    return false;
  }
  
  return timingSafeEqual(sigBuffer, expectedBuffer);
}
```

#### What It Stops
- Payload tampering in transit
- Parameter injection attacks
- Man-in-the-middle data modification

---

### Layer 5: Rate Limiting (Per-IP)

#### Purpose
Prevents brute force attacks and denial of service.

#### Implementation
```typescript
// In-memory rate limiter
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map();
  private readonly maxRequests: number;
  private readonly windowMs: number;
  
  constructor(maxRequests: number, windowMs: number) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }
  
  check(ip: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const entry = this.limits.get(ip);
    
    if (!entry || now > entry.resetTime) {
      this.limits.set(ip, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return {
        allowed: true,
        remaining: this.maxRequests - 1,
        resetTime: now + this.windowMs,
      };
    }
    
    if (entry.count >= this.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime,
      };
    }
    
    entry.count++;
    return {
      allowed: true,
      remaining: this.maxRequests - entry.count,
      resetTime: entry.resetTime,
    };
  }
}

// Usage: 5 requests per minute per IP
const ipRateLimiter = new RateLimiter(5, 60 * 1000);
```

#### API Integration
```typescript
export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  
  // Layer 5: IP rate limiting
  const rateLimit = ipRateLimiter.check(ip);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': '5',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': rateLimit.resetTime.toString(),
          'Retry-After': Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString(),
        },
      }
    );
  }
  
  // Set rate limit headers
  const headers = new Headers();
  headers.set('X-RateLimit-Limit', '5');
  headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString());
  headers.set('X-RateLimit-Reset', rateLimit.resetTime.toString());
  
  // Continue processing...
}
```

#### What It Stops
- Brute force attacks
- Denial of service
- Credential stuffing

---

### Layer 6: Per-Email Rate Limiting

#### Purpose
Prevents targeted abuse and email bombing.

#### Implementation
```typescript
// Per-email rate limiter
const emailRateLimiter = new RateLimiter(3, 60 * 60 * 1000); // 3 per hour

export async function POST(request: Request) {
  const body = await request.json();
  
  // Layer 6: Per-email rate limiting
  const emailLimit = emailRateLimiter.check(body.email);
  if (!emailLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many submissions from this email' },
      { status: 429 }
    );
  }
  
  // Continue processing...
}
```

#### What It Stops
- Targeted abuse
- Email bombing
- VPN/proxy users (independent of IP)

---

### Layer 7: Duplicate Submission Guard

#### Purpose
Prevents accidental double-clicks and replay attacks.

#### Implementation
```typescript
// Duplicate guard
const recentSubmissions: Map<string, number> = new Map();

function isDuplicate(email: string, data: string, windowMs: number = 60000): boolean {
  const key = `${email}:${data}`;
  const now = Date.now();
  
  const lastSubmission = recentSubmissions.get(key);
  if (lastSubmission && now - lastSubmission < windowMs) {
    return true;
  }
  
  recentSubmissions.set(key, now);
  return false;
}

export async function POST(request: Request) {
  const body = await request.json();
  
  // Layer 7: Duplicate guard
  const dataHash = createHash('sha256')
    .update(JSON.stringify(body))
    .digest('hex');
  
  if (isDuplicate(body.email, dataHash)) {
    return NextResponse.json(
      { error: 'Duplicate submission detected' },
      { status: 409 }
    );
  }
  
  // Continue processing...
}
```

#### What It Stops
- Accidental double-clicks
- Replay attacks (within 60s window)

---

### Layer 8: Timestamp Freshness Check

#### Purpose
Prevents replay attacks and cached form submissions.

#### Client Implementation
```typescript
// Client sends timestamp
const clientTimestamp = Date.now();
```

#### Server Implementation
```typescript
export async function POST(request: Request) {
  const body = await request.json();
  
  // Layer 8: Timestamp freshness
  const timestampAge = Date.now() - body.clientTimestamp;
  const MAX_AGE_MS = 5 * 60 * 1000; // 5 minutes
  const FUTURE_TOLERANCE_MS = 10 * 1000; // 10 seconds
  
  if (timestampAge > MAX_AGE_MS || timestampAge < -FUTURE_TOLERANCE_MS) {
    return NextResponse.json(
      { error: 'Request expired or invalid timestamp' },
      { status: 400 }
    );
  }
  
  // Continue processing...
}
```

#### What It Stops
- Replay attacks
- Cached form submissions
- Session fixation

---

### Layer 9: Input Validation (Zod)

#### Purpose
Prevents injection attacks and malformed data.

#### Implementation
```typescript
import { z } from 'zod';

// Validation schema
const SubmissionSchema = z.object({
  email: z.string().email().max(254),
  name: z.string().min(1).max(100),
  phone: z.string().min(10).max(20).regex(/^\+?[\d\s-]+$/),
  propertyType: z.enum(['residential', 'commercial', 'industrial']),
  services: z.array(z.string()).min(1).max(10),
  message: z.string().max(5000).optional(),
  turnstileToken: z.string().max(4096),
  hmacSignature: z.string().max(512),
  clientTimestamp: z.number().positive(),
});

// Validation function
function validateInput(data: unknown) {
  const result = SubmissionSchema.safeParse(data);
  
  if (!result.success) {
    return {
      valid: false,
      errors: result.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      })),
    };
  }
  
  return {
    valid: true,
    data: result.data,
  };
}

export async function POST(request: Request) {
  const body = await request.json();
  
  // Layer 9: Input validation
  const validation = validateInput(body);
  if (!validation.valid) {
    return NextResponse.json(
      { error: 'Validation failed', details: validation.errors },
      { status: 400 }
    );
  }
  
  // Continue processing with validated data...
}
```

#### What It Stops
- Injection attacks (SQL, NoSQL, Command)
- Malformed data
- Buffer overflow attempts
- DoS via huge payloads

---

### Layer 10: Honeypot

#### Purpose
Silently blocks basic bots without providing error signals.

#### Client Implementation
```tsx
// Hidden honeypot field
<div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
  <input
    type="text"
    name="website"
    tabIndex={-1}
    autoComplete="off"
  />
</div>
```

#### Server Implementation
```typescript
export async function POST(request: Request) {
  const body = await request.json();
  
  // Layer 10: Honeypot check
  if (body.website) {
    // Silently return success to confuse bots
    return NextResponse.json(
      { success: true, message: 'Thank you for your submission' },
      { status: 200 }
    );
  }
  
  // Continue processing...
}
```

#### What It Stops
- Basic bots
- Form spam (silent rejection)

---

## 4. Additional Security Measures

### 4.1 CORS Policy

```typescript
// CORS configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['https://nalbap.com'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
  credentials: true,
  maxAge: 86400, // 24 hours
};

// Middleware
if (request.method === 'OPTIONS') {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': corsOptions.origin[0],
      'Access-Control-Allow-Methods': corsOptions.methods.join(','),
      'Access-Control-Allow-Headers': corsOptions.allowedHeaders.join(','),
      'Access-Control-Max-Age': corsOptions.maxAge.toString(),
    },
  });
}
```

### 4.2 Body Size Limit

```typescript
// Body size check in middleware
const MAX_BODY_SIZE = 65536; // 64KB

if (request.method === 'POST') {
  const contentLength = parseInt(request.headers.get('content-length') || '0');
  if (contentLength > MAX_BODY_SIZE) {
    return NextResponse.json(
      { error: 'Request body too large' },
      { status: 413 }
    );
  }
}
```

### 4.3 User-Agent Check

```typescript
// User-Agent validation
const REQUIRED_MIN_LENGTH = 5;

function validateUserAgent(userAgent: string | null): boolean {
  if (!userAgent || userAgent.length < REQUIRED_MIN_LENGTH) {
    return false;
  }
  
  // Block known bad user agents
  const blockedAgents = ['curl', 'wget', 'python-requests', 'scrapy'];
  const lowerAgent = userAgent.toLowerCase();
  
  return !blockedAgents.some(agent => lowerAgent.includes(agent));
}
```

### 4.4 Input Sanitization

```typescript
// Discord webhook sanitization
function sanitizeForDiscord(input: string): string {
  return input
    .replace(/@/g, '\u200B@') // Zero-width space before @
    .replace(/`/g, '`\u200B') // Zero-width space after `
    .replace(/\n{3,}/g, '\n\n') // Collapse triple newlines
    .substring(0, 1000); // Truncate to safe length
}

// Email HTML escaping
function escapeHtml(input: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  
  return input.replace(/[&<>"']/g, char => map[char]);
}
```

### 4.5 Health Check Lockdown

```typescript
// Health check endpoint
export async function GET() {
  // Return minimal info - no env vars, no version
  return NextResponse.json({ status: 'ok' });
}
```

---

## 5. Environment Variables

### Required Variables
```env
# Turnstile
NEXT_PUBLIC_TURNSTILE_SITE_KEY=...
TURNSTILE_SECRET_KEY=...

# HMAC
NEXT_PUBLIC_HMAC_SECRET=...
SUBMISSION_HMAC_SECRET=...       # Same as above

# Database
DATABASE_URL=postgresql://...

# Authentication
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://nalbap.com

# Email
SMTP_HOST=...
SMTP_PORT=...
SMTP_USER=...
SMTP_PASS=...

# File Storage
STORAGE_BUCKET=...
STORAGE_ACCESS_KEY=...
STORAGE_SECRET_KEY=...
```

### Optional Variables
```env
# Monitoring
SENTRY_DSN=...

# Notifications
DISCORD_WEBHOOK_URL=...

# Analytics
ANALYTICS_ID=...
```

---

## 6. Security Headers Summary

| Header | Value | Purpose |
|--------|-------|---------|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Forces HTTPS |
| `Content-Security-Policy` | Nonce-based | Prevents XSS |
| `X-Content-Type-Options` | `nosniff` | Prevents MIME sniffing |
| `X-Frame-Options` | `DENY` | Prevents clickjacking |
| `X-XSS-Protection` | `0` | Disables legacy XSS filter |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Limits referrer leakage |
| `Permissions-Policy` | `camera=(), microphone=(), ...` | Disables browser features |
| `X-DNS-Prefetch-Control` | `off` | Prevents DNS prefetching |
| `X-Permitted-Cross-Domain-Policies` | `none` | Blocks Flash/PDF cross-domain |
| `Cross-Origin-Opener-Policy` | `same-origin` | Isolates browsing context |
| `Cross-Origin-Resource-Policy` | `same-origin` | Prevents cross-origin reads |
| `Origin-Agent-Cluster` | `?1` | Enables origin-level isolation |
| `X-Download-Options` | `noopen` | Prevents IE file execution |
| `X-Request-Id` | UUID | Request tracing |

---

## 7. Testing the Security Stack

### Automated Testing
```typescript
// Security test suite
describe('Security Stack', () => {
  test('Layer 1: HTTPS enforced', async () => {
    const response = await fetch('http://nalbap.com');
    expect(response.status).toBe(301);
    expect(response.headers.get('location')).toMatch(/^https:\/\//);
  });
  
  test('Layer 5: Rate limiting works', async () => {
    const requests = Array(6).fill(null).map(() =>
      fetch('https://nalbap.com/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ /* valid payload */ }),
      })
    );
    
    const responses = await Promise.all(requests);
    const rateLimited = responses.filter(r => r.status === 429);
    expect(rateLimited.length).toBe(1);
  });
  
  test('Layer 9: Input validation rejects malformed data', async () => {
    const response = await fetch('https://nalbap.com/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'not-an-email' }),
    });
    
    expect(response.status).toBe(400);
  });
});
```

### Manual Testing
1. **SSL Test:** https://www.ssllabs.com/ssltest/
2. **Security Headers:** https://securityheaders.com/
3. **CSP Validator:** https://csp-evaluator.withgoogle.com/
4. **OWASP ZAP:** Automated security scanning

---

## 8. Review Board Assessment

### Cybersecurity Council Review

| Reviewer | Status | Comments |
|----------|--------|----------|
| **OWASP Contributor** | Pending | OWASP compliance |
| **Cloud Security Architect** | Pending | Cloud security |
| **Application Security Engineer** | Pending | App security |
| **Penetration Tester** | Pending | Attack surface |
| **Ethical Hacker** | Pending | Vulnerability assessment |
| **IAM Engineer** | Pending | Identity management |
| **Zero Trust Architect** | Pending | Zero trust design |
| **Security Compliance Auditor** | Pending | Compliance |

---

## 9. Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-07-22 | System | Initial draft |

---

**Next Review:** Social Media Integration Design  
**Dependencies:** Comprehensive Security Audit  
**Blockers:** Cybersecurity Council approval required
