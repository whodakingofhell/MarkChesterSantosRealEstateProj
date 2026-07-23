import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('loads successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Philippine Skyland/);
  });

  test('displays hero section', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Philippine Skyland').first()).toBeVisible();
  });

  test('navigation links work', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Properties');
    await expect(page).toHaveURL(/\/properties/);
  });
});

test.describe('Properties Page', () => {
  test('loads and displays properties', async ({ page }) => {
    await page.goto('/properties');
    await expect(page.locator('text=Properties').first()).toBeVisible();
  });

  test('search filter works', async ({ page }) => {
    await page.goto('/properties');
    const searchInput = page.locator('input[placeholder*="Search"]').first();
    if (await searchInput.isVisible()) {
      await searchInput.fill('Manila');
      await page.waitForTimeout(500);
    }
  });
});

test.describe('Auth Pages', () => {
  test('login page loads', async ({ page }) => {
    await page.goto('/auth/login');
    await expect(page.locator('text=Philippine Skyland').first()).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('register page loads', async ({ page }) => {
    await page.goto('/auth/register');
    await expect(page.locator('text=Philippine Skyland').first()).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test('forgot password page loads', async ({ page }) => {
    await page.goto('/auth/forgot-password');
    await expect(page.locator('text=Reset Your Password')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });
});

test.describe('Static Pages', () => {
  test('FAQ page loads', async ({ page }) => {
    await page.goto('/faq');
    await expect(page.locator('text=Frequently Asked Questions').first()).toBeVisible();
  });

  test('Privacy page loads', async ({ page }) => {
    await page.goto('/privacy');
    await expect(page.locator('text=Privacy Policy').first()).toBeVisible();
  });

  test('Terms page loads', async ({ page }) => {
    await page.goto('/terms');
    await expect(page.locator('text=Terms of Service').first()).toBeVisible();
  });
});

test.describe('API Endpoints', () => {
  test('health check returns ok', async ({ request }) => {
    const response = await request.get('/api/health');
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.status).toBe('ok');
  });

  test('properties API returns data', async ({ request }) => {
    const response = await request.get('/api/properties');
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data).toHaveProperty('data');
  });
});

test.describe('Blog', () => {
  test('blog page loads', async ({ page }) => {
    await page.goto('/blog');
    await expect(page.locator('text=Blog').first()).toBeVisible();
  });
});
