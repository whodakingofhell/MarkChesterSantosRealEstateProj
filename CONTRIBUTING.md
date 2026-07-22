# Contributing to Philippine Skyland

Thank you for your interest in contributing to Philippine Skyland. This document provides guidelines and instructions for contributing.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Messages](#commit-messages)
- [Reporting Issues](#reporting-issues)

---

## Code of Conduct

- Be respectful and professional in all interactions
- Focus on constructive feedback
- Prioritize the security and privacy of user data
- Follow Philippine real estate regulations and ethical standards

---

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Git
- PostgreSQL database (local or Neon free tier)

### Setup

```bash
# Fork and clone the repository
git clone https://github.com/MarkChesterSantos/MarkChesterSantosRealEstateProj.git
cd MarkChesterSantosRealEstateProj

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your database and API keys

# Initialize database
npx prisma generate
npx prisma db push

# Seed test data
node prisma/seed-production.js

# Start development
npm run dev
```

---

## Development Workflow

1. Create a new branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following the [coding standards](#coding-standards)

3. Run quality checks before committing:
   ```bash
   npm run lint
   npm run typecheck
   npm run test
   ```

4. Commit your changes with a descriptive message

5. Push your branch and open a pull request

---

## Pull Request Process

1. **Title:** Use a clear, descriptive title (e.g., `feat: add property image upload`, `fix: resolve login session expiry`)
2. **Description:** Explain what changed and why
3. **Screenshots:** Include screenshots for UI changes
4. **Testing:** Describe how you tested your changes
5. **Checklist:**
   - [ ] Code follows project conventions
   - [ ] `npm run lint` passes
   - [ ] `npm run typecheck` passes
   - [ ] No secrets or credentials committed
   - [ ] Environment variables are documented in `.env.example` if added
   - [ ] Database changes include Prisma schema migration

---

## Coding Standards

### TypeScript / Next.js

- Use TypeScript for all new files
- Prefer `interface` over `type` for object shapes
- Use Next.js App Router conventions (`src/app/`)
- Server components by default; add `'use client'` only when needed

### Styling

- Use Tailwind CSS utility classes
- Follow the existing color scheme (primary, secondary, accent)
- Ensure responsive design (mobile-first)
- Test both light and dark modes

### Security

- **Never** commit `.env`, `.env.local`, or any file containing secrets
- Validate all user input with Zod schemas
- Sanitize user-generated content before rendering
- Use parameterized queries (Prisma handles this automatically)
- Add rate limiting to new API endpoints

### File Structure

- Place components in `src/components/`
- Place API routes in `src/app/api/<resource>/`
- Place utility functions in `src/lib/`
- Place type definitions in `src/types/`
- Place tests in `tests/unit/`

---

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <description>

[optional body]
[optional footer]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `style` | Code style changes (formatting, no logic change) |
| `refactor` | Code refactoring (no feature or fix) |
| `test` | Adding or updating tests |
| `chore` | Build process, CI/CD, dependencies |
| `security` | Security improvements |

### Examples

```
feat(properties): add image upload with S3 support
fix(auth): resolve session expiry not refreshing properly
docs: update README with deployment instructions
security(api): add rate limiting to contact form endpoint
```

---

## Reporting Issues

When reporting bugs, please include:

1. **Description:** Clear summary of the issue
2. **Steps to Reproduce:** Numbered steps to trigger the bug
3. **Expected Behavior:** What should happen
4. **Actual Behavior:** What actually happens
5. **Environment:** OS, browser, Node.js version
6. **Screenshots:** If applicable
7. **Console Errors:** Any relevant error messages

---

## Security Vulnerabilities

If you discover a security vulnerability, **do not** open a public issue. Instead, email [nelsonaczon@gmail.com](mailto:nelsonaczon@gmail.com) with:

- Description of the vulnerability
- Steps to reproduce
- Potential impact assessment
- Suggested fix (if any)

You will receive a response within 48 hours.

---

## Questions?

Contact Nelson Aczon:
- **Email:** nelsonaczon@gmail.com
- **Globe:** +63 917 472 2107
- **Smart:** +63 960 477 4147

---

Thank you for contributing to Philippine Skyland!
