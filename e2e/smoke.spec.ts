import { test, expect } from '@playwright/test';

const routes = [
  { path: '/', expectedText: 'Tarô 78 Chaves' },
  { path: '/app', expectedText: 'Meu Painel Diário' },
  { path: '/jornada-do-louco', expectedText: 'A Jornada do Louco' },
  { path: '/lesson/0', expectedText: 'O Louco' },
  { path: '/module/arcanos-maiores', expectedText: 'Arcanos Maiores' },
  { path: '/trilhas', expectedText: 'Mapa Curricular' },
  { path: '/desafios', expectedText: 'Desafios' },
  { path: '/premium', expectedText: 'Premium' },
  { path: '/perfil', expectedText: 'Perfil' },
];

test.describe('Route Smoke Test', () => {
  for (const route of routes) {
    test(`should render ${route.path} without errors`, async ({ page }) => {
      // Monitor console for errors
      const consoleErrors: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
      });

      // Monitor network for 404s/chunk errors
      const failedRequests: string[] = [];
      page.on('requestfailed', request => {
        failedRequests.push(request.url());
      });

      await page.goto(route.path);
      
      // Wait for content to stabilize (simulating user wait)
      await page.waitForTimeout(2000);

      // 1. Check for blank screen (body should have content)
      const bodyContent = await page.textContent('body');
      expect(bodyContent?.trim().length).toBeGreaterThan(0);

      // 2. Check for expected text
      if (route.expectedText) {
        await expect(page.locator('body')).toContainText(route.expectedText);
      }

      // 3. Verify Header and BottomNav for internal routes
      if (route.path !== '/' && route.path !== '/auth') {
        await expect(page.locator('header')).toBeVisible();
        await expect(page.locator('nav')).toBeVisible(); // BottomNav
      }

      // 4. Console Errors Check
      const criticalErrors = consoleErrors.filter(err => 
        err.includes('Failed to fetch dynamically imported module') || 
        err.includes('error loading dynamically imported module')
      );
      expect(criticalErrors).toHaveLength(0);
    });
  }
});

test.describe('Mobile Viewport Tests', () => {
  const viewports = [
    { width: 360, height: 800 },
    { width: 390, height: 844 },
    { width: 430, height: 932 },
  ];

  for (const vp of viewports) {
    test(`should render correctly at ${vp.width}x${vp.height}`, async ({ page }) => {
      await page.setViewportSize(vp);
      await page.goto('/app');
      await page.waitForTimeout(1000);

      // Check overflow
      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      expect(overflow).toBe(false);

      // Check BottomNav
      await expect(page.locator('nav')).toBeVisible();
    });
  }
});
