/**
 * Travel Modes E2E Tests
 * 
 * PURPOSE: End-to-end testing of travel mode selection and mode-specific features
 * 
 * SCOPE - This file should contain:
 * ✅ Travel mode selection UI testing (plane, car, train, etc.)
 * ✅ Mode-specific packing recommendations validation
 * ✅ Travel duration impact on suggestions
 * ✅ Cross-browser travel mode functionality
 * ✅ Mobile responsiveness for travel mode selection
 * ✅ Integration with AI suggestions based on travel mode
 * 
 * SCOPE - This file should NOT contain:
 * ❌ Pure AI logic testing (belongs in ai-packing-suggestions.spec.ts)
 * ❌ Form validation unit testing (belongs in integration tests)
 * ❌ Component isolation testing (belongs in src/__tests__)
 * ❌ API service testing (belongs in unit tests)
 * 
 * DEPENDENCIES:
 * - Complete SmartPack application
 * - Page object models (TripFormPage, MainLayoutPage)
 * - Travel mode configuration and logic
 * - AI service integration for mode-specific suggestions
 * 
 * MAINTENANCE:
 * - Add tests when new travel modes are supported
 * - Update when mode-specific logic changes
 * - Modify when UI components for travel selection change
 * - Review when AI suggestions for travel modes evolve
 * 
 * TESTING PATTERNS:
 * - Uses page object models for maintainability
 * - Tests complete user workflows across browsers
 * - Validates mode-specific behavior and suggestions
 * - Focuses on real user interactions and scenarios
 */

import { test as base, expect } from '@playwright/test';
import { TripFormPage } from './pages/trip-form.page';
import { MainLayoutPage } from './pages/main-layout.page';

type TestFixtures = {
  tripFormPage: TripFormPage;
  mainLayoutPage: MainLayoutPage;
};

const test = base.extend<TestFixtures>({
  tripFormPage: async ({ page }, testUse) => {
    const tripFormPage = new TripFormPage(page);
    await testUse(tripFormPage);
  },
  
  mainLayoutPage: async ({ page }, testUse) => {
    const mainLayoutPage = new MainLayoutPage(page);
    await testUse(mainLayoutPage);
  },
});

test.describe('SmartPack Travel Mode Optimization', () => {
  test.beforeEach(async ({ tripFormPage }) => {
    await tripFormPage.goto();
  });

  test('optimizes packing for plane travel', async ({ tripFormPage, mainLayoutPage }) => {
    await tripFormPage.fillCompleteTrip({
      tripName: 'International Flight',
      destination: 'Paris, France',
      details: 'International travel with airline restrictions',
      startDate: '2025-06-01',
      endDate: '2025-06-05',
      travelMode: 'plane'
    });

    await mainLayoutPage.waitForNavigation();
    await mainLayoutPage.generatePackingList();

    // Assert flight-specific items
    await mainLayoutPage.expectItemVisible('Travel-sized toiletries');
    await mainLayoutPage.expectItemVisible('Neck pillow');
    await mainLayoutPage.expectItemVisible('Entertainment/tablet');
    await mainLayoutPage.expectItemVisible('Portable charger');
    await mainLayoutPage.expectItemVisible('Travel documents folder');
  });

  test('optimizes packing for road trip', async ({ tripFormPage, mainLayoutPage }) => {
    await tripFormPage.fillCompleteTrip({
      tripName: 'Cross Country Adventure',
      destination: 'Grand Canyon, Arizona',
      details: 'Multi-day road trip with overnight stops',
      startDate: '2025-05-15',
      endDate: '2025-05-20',
      travelMode: 'car'
    });

    await mainLayoutPage.waitForNavigation();
    await mainLayoutPage.generatePackingList();

    // Assert road trip specific items
    await mainLayoutPage.expectItemVisible('Road snacks');
    await mainLayoutPage.expectItemVisible('Phone car charger');
    await mainLayoutPage.expectItemVisible('Emergency car kit');
    await mainLayoutPage.expectItemVisible('Cooler/drinks');
    await mainLayoutPage.expectItemVisible('Maps/GPS backup');
  });

  test('calculates quantities based on trip duration', async ({ tripFormPage, mainLayoutPage }) => {
    // Test short trip (3 days)
    await tripFormPage.fillCompleteTrip({
      tripName: 'Weekend Getaway',
      destination: 'Seattle, Washington',
      details: 'Short weekend city break',
      startDate: '2025-03-01',
      endDate: '2025-03-03',
      travelMode: 'plane'
    });

    await mainLayoutPage.waitForNavigation();
    await mainLayoutPage.generatePackingList();

    // Verify quantities for short trip (3 days = 4 pairs with extras)
    await mainLayoutPage.expectItemVisible('4 pairs underwear');
    await mainLayoutPage.expectItemVisible('4 pairs socks');
  });

  test('handles API errors gracefully', async ({ tripFormPage, mainLayoutPage, page }) => {
    // Intercept and fail the API call
    await page.route('**/generate', route => route.abort());

    await tripFormPage.fillCompleteTrip({
      tripName: 'Error Test Trip',
      destination: 'Test City',
      details: 'Testing error handling',
      startDate: '2025-04-01',
      endDate: '2025-04-03',
      travelMode: 'plane'
    });

    await mainLayoutPage.waitForNavigation();
    await mainLayoutPage.generatePackingList();

    // Verify graceful error handling
    await expect(page.locator('text=Error generating suggestions')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Please try again')).toBeVisible();
  });
});
