import { test, expect } from '@playwright/test';

test.describe('TripForm E2E', () => {
  test('user can complete the form and see main layout', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByLabel('Trip Name')).toBeVisible();
    await page.getByLabel('Trip Name').fill('My Trip');
    await page.getByLabel('Destination').fill('Paris');
    await page.getByLabel('Car').check();
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    await page.getByLabel('Start Date').fill(today.toISOString().slice(0,10));
    await page.getByLabel('End Date').fill(tomorrow.toISOString().slice(0,10));
    await page.getByText('Next').click();
    // Should see MainLayout content
    await expect(page.getByText('Packing Checklist')).toBeVisible();
    await expect(page.getByText('AI Suggestions')).toBeVisible();
  });

  test('shows validation errors for invalid input', async ({ page }) => {
    await page.goto('/');
    await page.getByText('Next').click();
    await expect(page.getByText(/required/i)).toBeVisible();
    await page.getByLabel('Destination').fill('NotARealCity');
    await page.getByText('Next').click();
    await expect(page.getByText(/valid city/i)).toBeVisible();
  });
});
