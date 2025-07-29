/**
 * Complete User Journey E2E Tests
 * 
 * PURPOSE: End-to-end testing of complete user workflows from trip planning to packing
 * 
 * SCOPE - This file should contain:
 * ✅ Complete user workflows (form → AI → packing → completion)
 * ✅ Multi-step journey validation across pages
 * ✅ State persistence throughout user sessions
 * ✅ Cross-browser workflow compatibility
 * ✅ Mobile user journey testing
 * ✅ Error recovery and workflow resilience
 * 
 * SCOPE - This file should NOT contain:
 * ❌ Individual feature testing (belongs in specific feature E2E tests)
 * ❌ Component unit testing (belongs in src/__tests__)
 * ❌ API service testing (belongs in unit tests)
 * ❌ Performance testing (separate performance test suite)
 * 
 * DEPENDENCIES:
 * - Complete SmartPack application
 * - Page object models (TripFormPage, MainLayoutPage)
 * - All application features integrated
 * - localStorage for state persistence testing
 * 
 * MAINTENANCE:
 * - Add journeys when new major features are added
 * - Update when user workflows change significantly
 * - Modify when navigation patterns change
 * - Review when critical user paths are redesigned
 * 
 * TESTING PATTERNS:
 * - Tests complete realistic user scenarios
 * - Validates end-to-end state management
 * - Uses page object models for complex workflows
 * - Focuses on critical business value scenarios
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

test.describe('SmartPack Complete User Journey', () => {
  test('completes full trip planning and packing workflow', async ({ 
    tripFormPage, 
    mainLayoutPage,
    page 
  }) => {
    // Step 1: Start fresh
    await tripFormPage.goto();
    
    // Step 2: Fill out comprehensive trip details
    await tripFormPage.fillCompleteTrip({
      tripName: 'European Business Adventure',
      destination: 'Vienna, Austria',
      details: 'Combining business meetings with cultural exploration and outdoor activities',
      startDate: '2025-08-15',
      endDate: '2025-08-22',
      travelMode: 'plane'
    });

    // Step 3: Verify navigation to main layout
    await mainLayoutPage.waitForNavigation();
    
    // Step 4: Verify trip details are displayed correctly
    await expect(page.locator('text=European Business Adventure')).toBeVisible();
    await expect(page.locator('text=Vienna, Austria')).toBeVisible();
    await expect(page.locator('text=Aug 15, 2025')).toBeVisible();
    await expect(page.locator('text=Aug 22, 2025')).toBeVisible();

    // Step 5: Generate AI-powered packing suggestions
    await mainLayoutPage.generatePackingList();

    // Step 6: Verify intelligent, context-aware suggestions
    // Business items
    await mainLayoutPage.expectItemVisible('Business suits/formal wear');
    await mainLayoutPage.expectItemVisible('Laptop + charger');
    
    // Destination-specific items  
    await mainLayoutPage.expectItemVisible('Comfortable walking shoes');
    
    // Travel mode specific items
    await mainLayoutPage.expectItemVisible('Travel-sized toiletries');
    await mainLayoutPage.expectItemVisible('Neck pillow');
    
    // Duration-appropriate quantities (7 days = 9 pairs)
    await mainLayoutPage.expectItemVisible('9 pairs underwear');
    await mainLayoutPage.expectItemVisible('9 pairs socks');

    // Step 7: Interact with packing list - check off items
    await mainLayoutPage.checkItem('Business suits/formal wear');
    await mainLayoutPage.checkItem('Laptop + charger');
    await mainLayoutPage.checkItem('Comfortable walking shoes');

    // Step 8: Verify persistence across page reload
    await mainLayoutPage.verifyItemsPersistAfterReload([
      'Business suits/formal wear',
      'Laptop + charger', 
      'Comfortable walking shoes'
    ]);

    // Step 9: Verify app state is maintained
    await expect(page.locator('text=European Business Adventure')).toBeVisible();
    await expect(page.locator('text=Vienna, Austria')).toBeVisible();
  });

  test('handles multiple destinations intelligently', async ({ 
    tripFormPage, 
    mainLayoutPage,
    page 
  }) => {
    await tripFormPage.goto();
    
    // Fill first destination
    await tripFormPage.fillBasicTripInfo(
      'Multi-City European Tour',
      'Paris, France',
      '2025-09-01',
      '2025-09-10'
    );
    
    // Add second destination
    await page.click('button:has-text("Add Destination")');
    await page.fill('[data-testid="destination-input-1"]', 'Barcelona, Spain');
    
    await tripFormPage.fillTripDetails('Cultural tour visiting museums, beaches, and local markets');
    await tripFormPage.selectTravelMode('plane');
    await tripFormPage.submitForm();

    await mainLayoutPage.waitForNavigation();
    await mainLayoutPage.generatePackingList();

    // Verify suggestions account for multiple climates/activities
    await mainLayoutPage.expectItemVisible('Beach towel'); // Barcelona beaches
    await mainLayoutPage.expectItemVisible('Comfortable walking shoes'); // City exploration
    await mainLayoutPage.expectItemVisible('Light jacket'); // Variable weather
  });
});
