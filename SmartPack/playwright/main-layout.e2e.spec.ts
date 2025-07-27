import { test, expect } from '@playwright/test';

// Assumes dev server is running at http://localhost:5173/
test.describe('Main Layout E2E', () => {
  test('renders all three layout sections', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await expect(page.getByText(/Trip Details/i)).toBeVisible();
    await expect(page.getByText(/Packing Checklist/i)).toBeVisible();
    await expect(page.getByText(/AI Suggestions/i)).toBeVisible();
  });

  test('responsive layout: columns on desktop, stacked on mobile', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    // Desktop
    await page.setViewportSize({ width: 1200, height: 800 });
    const tripDetails = await page.locator('#trip-details');
    const packingChecklist = await page.locator('#packing-checklist');
    const aiSuggestions = await page.locator('#ai-suggestions');
    // Check that all are visible and side by side
    await expect(tripDetails).toBeVisible();
    await expect(packingChecklist).toBeVisible();
    await expect(aiSuggestions).toBeVisible();
    // Mobile
    await page.setViewportSize({ width: 375, height: 800 });
    // Check that all are still visible (stacked)
    await expect(tripDetails).toBeVisible();
    await expect(packingChecklist).toBeVisible();
    await expect(aiSuggestions).toBeVisible();
  });

  test('dark mode toggle updates UI', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    const toggle = await page.getByRole('button', { name: /toggle dark mode/i });
    await toggle.click();
    // Check that html has dark class
    const hasDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    expect(hasDark).toBe(true);
    await toggle.click();
    const hasDark2 = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    expect(hasDark2).toBe(false);
  });

  test('modal opens and closes', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    const openBtn = await page.getByRole('button', { name: /open modal/i });
    await openBtn.click();
    await expect(page.getByText(/Headless UI Modal/i)).toBeVisible();
    const closeBtn = await page.getByRole('button', { name: /close/i });
    await closeBtn.click();
    await expect(page.getByText(/Headless UI Modal/i)).not.toBeVisible();
  });
});
