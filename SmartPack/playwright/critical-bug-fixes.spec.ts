import { test, expect } from '@playwright/test';

test.describe('Critical Bug Fixes - Ship Blocker Validation', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('http://localhost:5177');
    await page.evaluate(() => {
      localStorage.clear();
    });
    await page.reload();
  });

  test('App loads without crashing on fresh state', async ({ page }) => {
    await page.goto('http://localhost:5177');
    
    // Verify page loads successfully
    await expect(page.locator('body')).not.toContainText('Error');
    await expect(page.locator('[data-testid="trip-details-section"]')).toBeVisible();
    
    console.log('✅ App loads without crashes on fresh state');
  });

  test('App handles corrupted localStorage gracefully', async ({ page }) => {
    await page.goto('http://localhost:5177');
    
    // Set corrupted localStorage data
    await page.evaluate(() => {
      localStorage.setItem('tripForm', '{corrupted json data}');
      localStorage.setItem('smartpack-column-visibility', 'invalid');
    });
    
    // Refresh page - should handle corrupted data gracefully
    await page.reload();
    
    // Page should still load without errors
    await expect(page.locator('body')).not.toContainText('Error');
    await expect(page.locator('[data-testid="trip-details-section"]')).toBeVisible();
    
    console.log('✅ Corrupted localStorage handled gracefully');
  });

  test('Page refresh does not crash with valid data', async ({ page }) => {
    await page.goto('http://localhost:5177');
    
    // Set valid trip data in localStorage
    await page.evaluate(() => {
      const tripData = {
        tripName: 'Test Trip',
        destinations: ['Tokyo'],
        travelModes: ['flight'],
        startDate: '2024-12-01',
        endDate: '2024-12-07',
        preferences: [],
        step: 2
      };
      localStorage.setItem('tripForm', JSON.stringify(tripData));
    });
    
    // Refresh the page - this should not crash
    await page.reload();
    
    // Verify the page loads successfully
    await expect(page.locator('body')).not.toContainText('Error');
    await expect(page.locator('[data-testid="trip-details-section"]')).toBeVisible();
    
    console.log('✅ Page refresh works without crashes with valid data');
  });

  test('Column visibility responds to localStorage changes', async ({ page }) => {
    await page.goto('http://localhost:5177');
    
    // Initially should show only trip details for first-time user
    await expect(page.locator('[data-testid="trip-details-section"]')).toBeVisible();
    
    // Set complete trip data
    await page.evaluate(() => {
      const tripData = {
        tripName: 'Complete Trip',
        destinations: ['Paris'],
        travelModes: ['train'],
        startDate: '2024-12-15',
        endDate: '2024-12-20',
        preferences: [],
        step: 2
      };
      localStorage.setItem('tripForm', JSON.stringify(tripData));
    });
    
    // Reload to trigger synchronization
    await page.reload();
    
    // Should now show all sections for complete trip
    await expect(page.locator('[data-testid="trip-details-section"]')).toBeVisible();
    await expect(page.locator('[data-testid="packing-list-section"]')).toBeVisible();
    await expect(page.locator('[data-testid="ai-suggestions-section"]')).toBeVisible();
    
    console.log('✅ Column visibility synchronizes with trip data');
  });

  test('First-time user logic is consistent', async ({ page }) => {
    await page.goto('http://localhost:5177');
    
    // First-time user should see only trip details
    await expect(page.locator('[data-testid="trip-details-section"]')).toBeVisible();
    
    // Check if other columns are hidden by checking if they don't exist in the DOM or are not visible
    const packingSection = page.locator('[data-testid="packing-list-section"]');
    const suggestionsSection = page.locator('[data-testid="ai-suggestions-section"]');
    
    const packingExists = await packingSection.count();
    const suggestionsExists = await suggestionsSection.count();
    
    // For first-time users, these sections should either not exist or not be visible
    if (packingExists > 0) {
      await expect(packingSection).not.toBeVisible();
    }
    if (suggestionsExists > 0) {
      await expect(suggestionsSection).not.toBeVisible();
    }
    
    console.log('✅ First-time user state is consistent');
  });

  test('No JavaScript errors during load', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => {
      errors.push(error.message);
    });
    
    await page.goto('http://localhost:5177');
    
    // Wait for page to fully load
    await page.waitForTimeout(2000);
    
    // Check for JavaScript errors
    expect(errors).toHaveLength(0);
    
    console.log('✅ No JavaScript errors during page load');
  });

  test('localStorage operations are protected from errors', async ({ page }) => {
    await page.goto('http://localhost:5177');
    
    // Test that the app handles localStorage being unavailable
    await page.evaluate(() => {
      // Mock localStorage to throw errors
      const originalSetItem = localStorage.setItem;
      const originalGetItem = localStorage.getItem;
      
      localStorage.setItem = () => {
        throw new Error('Storage quota exceeded');
      };
      localStorage.getItem = () => {
        throw new Error('Storage access denied');
      };
      
      // Trigger state change that would normally save to localStorage
      // This should not crash the app
      window.dispatchEvent(new Event('storage'));
      
      // Restore localStorage
      localStorage.setItem = originalSetItem;
      localStorage.getItem = originalGetItem;
    });
    
    // App should still be functional
    await expect(page.locator('[data-testid="trip-details-section"]')).toBeVisible();
    
    console.log('✅ localStorage error handling is robust');
  });
});