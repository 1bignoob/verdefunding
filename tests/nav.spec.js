// @ts-check
const { test, expect, devices } = require('@playwright/test');

test.use({ ...devices['Pixel 5'] });

test('mobile menu opens and closes on outside click', async ({ page }) => {
  await page.goto('/');
  const toggle = page.locator('.nav-toggle');
  const nav = page.locator('#primary-navigation');

  await toggle.click();
  await expect(nav).toHaveAttribute('aria-hidden', 'false');

  await page.locator('body').click({ position: { x: 10, y: 400 } });
  await expect(nav).toHaveAttribute('aria-hidden', 'true');
});

test('mobile menu has Call Us button', async ({ page }) => {
  await page.goto('/');
  const toggle = page.locator('.nav-toggle');
  await toggle.click();
  const callBtn = page.locator('#primary-navigation .nav-mobile-call');
  await expect(callBtn).toBeVisible();
});
