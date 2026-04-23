import { test, expect } from '@playwright/test';

const pages = [
  { path: '/', label: 'Home' },
  { path: '/about/', label: 'About' },
  { path: '/services/', label: 'Services' },
  { path: '/faq/', label: 'FAQ' },
  { path: '/contact/', label: 'Contact' },
  { path: '/privacy/', label: 'Privacy' },
  { path: '/terms/', label: 'Terms' },
  { path: '/disclaimer/', label: 'Disclaimer' },
  { path: '/thank_you/', label: 'Thank You' },
];

// ── Footer ────────────────────────────────────────────────────────────────────

for (const { path, label } of pages) {
  test(`[${label}] footer has © copyright text`, async ({ page }) => {
    await page.goto(path);
    const copyright = page.locator('.footer-left');
    await expect(copyright).toContainText('Verde Assist Group');
    await expect(copyright).toContainText('All rights reserved');
  });

  test(`[${label}] footer has GothamWebDev link`, async ({ page }) => {
    await page.goto(path);
    const link = page.locator('.footer-brand-link');
    await expect(link).toBeVisible();
    await expect(link).toHaveText('GothamWebDev.com');
    await expect(link).toHaveAttribute('href', 'https://gothamwebdev.com');
  });

  test(`[${label}] footer has Privacy, Terms, Disclaimer links`, async ({ page }) => {
    await page.goto(path);
    const links = page.locator('.footer-links a');
    await expect(links.filter({ hasText: 'Privacy' })).toBeVisible();
    await expect(links.filter({ hasText: 'Terms' })).toBeVisible();
    await expect(links.filter({ hasText: 'Disclaimer' })).toBeVisible();
  });
}

// ── Footer layout — desktop (three columns) ───────────────────────────────────

test('[Home] footer left is left-aligned on desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1200, height: 800 });
  await page.goto('/');
  const left = page.locator('.footer-left');
  const center = page.locator('.footer-center');
  const right = page.locator('.footer-right');

  const leftBox  = await left.boundingBox();
  const centerBox = await center.boundingBox();
  const rightBox = await right.boundingBox();

  // All on same row: y positions close
  expect(Math.abs((leftBox?.y ?? 0) - (centerBox?.y ?? 0))).toBeLessThan(10);
  expect(Math.abs((leftBox?.y ?? 0) - (rightBox?.y ?? 0))).toBeLessThan(10);

  // Horizontal order: left < center < right
  expect((leftBox?.x ?? 0)).toBeLessThan(centerBox?.x ?? 0);
  expect((centerBox?.x ?? 0)).toBeLessThan(rightBox?.x ?? 0);
});

// ── Footer layout — mobile (stacked) ─────────────────────────────────────────

test('[Home] footer stacks vertically on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const left = page.locator('.footer-left');
  const center = page.locator('.footer-center');

  const leftBox  = await left.boundingBox();
  const centerBox = await center.boundingBox();

  // Center should be below left on mobile
  expect((centerBox?.y ?? 0)).toBeGreaterThan((leftBox?.y ?? 0));
});

// ── Schema — creator property ─────────────────────────────────────────────────

for (const { path, label } of pages) {
  test(`[${label}] JSON-LD schema contains GothamWebDev creator`, async ({ page }) => {
    await page.goto(path);
    const schemaText = await page.locator('script[type="application/ld+json"]').first().textContent();
    const schema = JSON.parse(schemaText ?? '{}');

    // creator may be nested under the root or inside isPartOf — walk the whole string
    expect(schemaText).toContain('"GothamWebDev"');
    expect(schemaText).toContain('https://gothamwebdev.com');
  });
}

// ── Navigation sanity ─────────────────────────────────────────────────────────

test('primary navigation links are present on home page', async ({ page }) => {
  // Sanity check that primary nav links exist in the DOM across responsive states.
  await page.goto('/');
  const nav = page.locator('#primary-navigation');
  await expect(nav.locator('a', { hasText: 'Services' })).toHaveCount(1);
  await expect(nav.locator('a', { hasText: 'About Us' })).toHaveCount(1);
  await expect(nav.locator('a', { hasText: 'FAQ' })).toHaveCount(1);
  await expect(nav.locator('a', { hasText: 'Contact' })).toHaveCount(1);
});
