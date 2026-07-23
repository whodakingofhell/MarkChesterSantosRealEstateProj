# Philippine Skyland - MGT and DEVT OPC (PPSMDO)

<!-- Logo placeholder: replace with your actual logo -->
<!-- ![Philippine Skyland Logo](public/images/logo.png) -->

**Enterprise-grade real estate broker and appraisal management platform for Philippine real estate professionals.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-Proprietary-red)](#license)

**Live Demo:** https://philippine-skyland.vercel.app

---

## Features

### Core Platform
- **Property Listings Management** — Full CRUD for property listings with images, documents, and detailed specifications
- **Broker & Appraiser Profiles** — Professional profiles with license verification, specializations, ratings, and reviews
- **Transaction Tracking** — End-to-end transaction management with commission calculations
- **Appraisal Workflow** — Scheduling, status tracking, and reporting for property appraisals
- **Client Inquiries** — Client inquiry management with property type and budget preferences
- **Contact System** — Contact form with email forwarding to broker/appraiser profiles

### Authentication & Security
- **JWT Authentication** — Secure login/register with bcrypt password hashing
- **Role-Based Access Control (RBAC)** — Admin, Broker, Appraiser, and Client roles
- **Email Verification** — Mandatory email verification before account activation
- **Password Reset** — Secure token-based password reset with 1-hour expiry
- **Account Lockout** — Automatic 15-minute lockout after 5 failed login attempts
- **11-Layer Security Stack** — CSRF protection, rate limiting, input sanitization, HMAC API signing, audit logging
- **Cloudflare Turnstile CAPTCHA** — Bot protection on registration and contact forms
- **DB Audit Logging** — Complete audit trail of all security events stored in PostgreSQL
- **Session Management** — Secure JWT sessions with `__Secure-` cookie prefix in production
- **Server-Side Review Authentication** — Reviews require signed-in users to prevent fake review injection
- **Full Zod Validation** — Property creation endpoint validates all input via Zod schemas
- **Brute-Force Rate Limiting** — Password change uses stricter authLimiter (10/15min)
- **Security Headers** — X-Frame-Options, X-Content-Type-Options, Cache-Control, X-Request-Id

### User Experience
- **Responsive Design** — Mobile-first responsive UI with Tailwind CSS
- **Dark/Light Mode** — Theme toggle with system preference detection
- **Public Profile Pages** — SEO-friendly professional profile pages with slug-based URLs
- **FAQ, Privacy Policy, Terms of Service** — Legal and informational pages
- **30-Minute Session Timeout** — Inactivity timer with 60-second warning notification
- **AI Chatbot** — Floating FAQ chatbot widget for instant user support
- **Background Tab Detection** — Auto-signout when browser tab is hidden for 60 seconds

### DevOps & Quality
- **Database Seeding** — Automated seed scripts for production and test accounts
- **Email Notifications** — SMTP email integration via Nodemailer
- **Health Check API** — `/api/health` endpoint for uptime monitoring
- **Comprehensive Documentation** — Architecture docs, API specs, and user personas in `/docs`

---

## Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **PostgreSQL** database (e.g., [Neon](https://console.neon.tech) free tier)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/MarkChesterSantos/MarkChesterSantosRealEstateProj.git
cd MarkChesterSantosRealEstateProj

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values (see Environment Variables below)

# 4. Initialize database
npx prisma generate
npx prisma db push

# 5. Seed database
node prisma/seed-production.js

# 6. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

| Variable | Description | Example |
|---|---|---|
| `NEXT_PUBLIC_APP_URL` | Application base URL | `http://localhost:3000` |
| `NEXT_PUBLIC_APP_NAME` | Application display name | `Philippine Skyland MGT and DEVT OPC` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host/db?sslmode=require` |
| `NEXTAUTH_SECRET` | NextAuth secret key | Random 64-char string |
| `NEXTAUTH_URL` | NextAuth base URL | `http://localhost:3000` |
| `JWT_SECRET` | JWT signing secret | Random 64-char string |
| `JWT_EXPIRES_IN` | JWT token expiration | `7d` |
| `SMTP_HOST` | SMTP server host | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP server port | `587` |
| `SMTP_USER` | SMTP username (email) | `your-email@gmail.com` |
| `SMTP_PASS` | SMTP password (app password) | `your-app-password` |
| `SMTP_FROM` | Email sender address | `Philippine Skyland <your-email@gmail.com>` |
| `STORAGE_TYPE` | File storage backend | `local` or `s3` |
| `STORAGE_BUCKET` | S3 bucket name | `your-bucket-name` |
| `STORAGE_ACCESS_KEY` | S3 access key | `your-access-key` |
| `STORAGE_SECRET_KEY` | S3 secret key | `your-secret-key` |
| `STORAGE_REGION` | S3 region | `ap-southeast-1` |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile secret | (optional) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile site key | (optional) |
| `HMAC_SECRET` | HMAC API signing secret | Random 64-char string |
| `SENTRY_DSN` | Sentry error tracking DSN | (optional) |
| `LOG_LEVEL` | Application log level | `info` |
| `BACKUP_DIR` | Backup directory path | `./backups` |
| `BACKUP_RETENTION_DAYS` | Backup retention period | `30` |

---

## Project Structure

```
NALBAP-App/
├── prisma/
│   ├── schema.prisma          # Database schema (13 models)
│   ├── seed-production.js     # Production seed (Nelson Aczon account)
│   └── seed-test-accounts.js  # Test accounts (Client, Appraiser, Admin)
├── public/                    # Static assets
├── scripts/                   # Shell scripts (backup, restore)
├── src/
│   ├── app/
│   │   ├── api/               # REST API routes
│   │   │   ├── appraisals/    # Appraisal CRUD
│   │   │   ├── auth/          # Login, register, verify-email, forgot-password, reset-password, change-password, NextAuth
│   │   │   ├── contact/       # Contact form submission
│   │   │   ├── health/        # Health check endpoint
│   │   │   ├── properties/    # Property CRUD
│   │   │   ├── reviews/       # Review system
│   │   │   └── transactions/  # Transaction management
│   │   ├── auth/              # Auth pages (login, register, forgot-password, reset-password, error)
│   │   ├── dashboard/         # Dashboard (properties, transactions, inquiries, profile)
│   │   ├── faq/               # FAQ page
│   │   ├── privacy/           # Privacy policy
│   │   ├── profile/           # Public profile pages
│   │   ├── properties/        # Property listing and detail pages
│   │   ├── terms/             # Terms of service
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Homepage
│   ├── components/            # React components
│   │   ├── ContactButtons.tsx
│   │   ├── ContactForm.tsx
│   │   ├── Navbar.tsx
│   │   ├── Providers.tsx
│   │   ├── SessionTimeout.tsx
│   │   ├── ThemeToggle.tsx
│   │   ├── Turnstile.tsx
│   │   └── Chatbot.tsx
│   ├── lib/                   # Utility modules
│   │   ├── auth.ts            # NextAuth + account lockout
│   │   ├── crypto.ts          # Encryption utilities
│   │   ├── email.ts           # SMTP email (verification, password reset, notifications)
│   │   ├── env.ts             # Environment variable validation
│   │   ├── logger.ts          # Structured logging + DB audit trail
│   │   ├── prisma.ts          # Prisma client singleton
│   │   ├── rate-limit.ts      # Rate limiting middleware
│   │   ├── sanitize.ts        # Input sanitization
│   │   ├── turnstile.ts       # Turnstile CAPTCHA verification
│   │   └── validation.ts      # Zod validation schemas
│   ├── middleware.ts           # Next.js middleware (auth, security headers)
│   ├── styles/                # Global styles
│   └── types/                 # TypeScript type definitions
├── tests/                     # Test files
├── docs/                      # Project documentation (19 sections)
├── .env.example               # Environment variable template
├── .gitignore
├── Build-and-Run.bat          # Windows build script
├── Start.bat                  # Windows dev start script
├── QUICKSTART.txt             # Quick start guide
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
└── vercel.json                # Vercel deployment config
```

---

## API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/health` | Health check | No |
| `POST` | `/api/auth/register` | User registration | No |
| `GET` | `/api/auth/verify-email` | Verify email address | No |
| `POST` | `/api/auth/forgot-password` | Request password reset | No |
| `POST` | `/api/auth/reset-password` | Reset password with token | No |
| `POST` | `/api/auth/change-password` | Change password | Yes |
| `GET/POST` | `/api/auth/[...nextauth]` | NextAuth handlers | No |
| `GET` | `/api/properties` | List properties | No |
| `POST` | `/api/properties` | Create property | Yes (Broker) |
| `GET` | `/api/properties/:id` | Get property details | No |
| `PUT` | `/api/properties/:id` | Update property | Yes (Owner) |
| `DELETE` | `/api/properties/:id` | Delete property | Yes (Owner) |
| `GET` | `/api/transactions` | List transactions | Yes |
| `POST` | `/api/transactions` | Create transaction | Yes (Broker) |
| `GET` | `/api/appraisals` | List appraisals | Yes |
| `POST` | `/api/appraisals` | Create appraisal | Yes (Appraiser) |
| `GET` | `/api/reviews` | List reviews | No |
| `POST` | `/api/reviews` | Submit review | Yes |
| `POST` | `/api/contact` | Submit contact form | No |

---

## Security Features

This platform implements an **11-layer security defense stack**:

1. **Input Validation** — Zod schemas validate all incoming data
2. **Input Sanitization** — XSS prevention on all user-generated content
3. **CSRF Protection** — Cross-site request forgery tokens on state-changing requests
4. **Rate Limiting** — Request throttling on API endpoints with IP validation
5. **bcrypt Password Hashing** — 12-round salted hashes for all passwords
6. **JWT Authentication** — Signed tokens with configurable expiration
7. **Role-Based Access Control** — Granular permission checks per endpoint
8. **HMAC API Signing** — Request integrity verification via HMAC signatures
9. **Cloudflare Turnstile** — Bot protection on sensitive forms
10. **Audit Logging** — Complete trail of all security events with IP and user agent
11. **DB Audit Persistence** — Security events stored permanently in PostgreSQL AuditLog table

Additional protections:
- Security headers via Next.js middleware (X-Frame-Options, CSP, X-Content-Type-Options, Cache-Control)
- Secure cookie prefix (`__Secure-`) in production
- Email verification required before account activation
- Account lockout after 5 failed login attempts (15-minute cooldown)
- Password reset tokens with 1-hour expiry and single-use validation
- SQL injection prevention via Prisma ORM
- Environment variable validation at startup
- IP spoofing protection via x-forwarded-for chain validation
- Health endpoint minimizes information disclosure (returns status only)

---

## Test Accounts

After running the seed script, the following accounts are available:

| Role | Email | Password | Description |
|------|-------|----------|-------------|
| **Broker** | `nelsonaczon@gmail.com` | `Nelson@2026!` | Primary broker account (Nelson Aczon) |
| **Client** | `maria@test.com` | `Test@2026!` | Test client (Maria Santos) |
| **Client** | `juan@test.com` | `Test@2026!` | Test client (Juan Dela Cruz) |
| **Appraiser** | `roberto@test.com` | `Test@2026!` | Test appraiser (Roberto Reyes) |
| **Admin** | `admin@philippineskyland.com` | `Admin@2026!` | Administrator account |

> **Note:** These are test credentials. Change all passwords before production deployment.

---

## Deployment

### Vercel (Recommended)

1. Push this repository to GitHub
2. Import the project in [Vercel Dashboard](https://vercel.com/new)
3. Configure environment variables in **Settings > Environment Variables**
4. Set `NEXTAUTH_URL` to your production domain
5. Deploy — Vercel auto-detects Next.js and configures the build

```bash
# Vercel CLI deployment
npx vercel --prod
```

### Manual Deployment

```bash
# Build
npm run build

# Start production server
npm run start
```

### Database Setup for Production

```bash
# Push schema to production database
npx prisma db push

# Seed production data
node prisma/seed-production.js
```

---

## Scripts Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Generate Prisma client and build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run test` | Run Jest tests |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:seed` | Seed database with test data |

---

## License

This is proprietary software. All rights reserved by **Philippine Skyland MGT and DEVT OPC (PPSMDO)**.

Unauthorized copying, modification, distribution, or use of this software is strictly prohibited without explicit written permission from the owner.

---

## Contact

**Nelson Aczon** — Licensed Real Estate Broker and Appraiser

| Channel | Details |
|---------|---------|
| **Globe** | +63 917 472 2107 |
| **Smart** | +63 960 477 4147 |
| **Email** | nelsonaczon@gmail.com |

---

*Built with care for Philippine real estate professionals.*
