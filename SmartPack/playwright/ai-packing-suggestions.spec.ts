/**
 * AI Packing Suggestions E2E Tests
 * 
 * PURPOSE: End-to-end testing of AI-powered packing suggestions across real browsers
 * 
 * SCOPE - This file should contain:
 * ✅ Complete AI workflow testing (form → generation → results)
 * ✅ Cross-browser validation of AI features
 * ✅ Real network request testing (or mocked service responses)
 * ✅ Visual validation of AI-generated content
 * ✅ Performance testing for AI generation times
 * ✅ Different trip scenarios and edge cases
 * 
 * SCOPE - This file should NOT contain:
 * ❌ Unit testing of individual components (belongs in src/__tests__)
 * ❌ API service unit testing (belongs in apiService.test.ts)
 * ❌ Pure form validation (belongs in integration tests)
 * ❌ Accessibility testing (use jest-axe in component tests)
 * 
 * DEPENDENCIES:
 * - Complete SmartPack application
 * - Page object models (TripFormPage, MainLayoutPage)
 * - AI service endpoints (mocked or real)
 * - Playwright fixtures and test setup
 * 
 * MAINTENANCE:
 * - Add scenarios when new AI features are implemented
 * - Update when AI service endpoints change
 * - Modify when UI components for AI features change
 * - Review when new trip types are supported
 * 
 * TESTING PATTERNS:
 * - Uses page object models for maintainability
 * - Tests real user workflows in browsers
 * - Includes cross-browser compatibility testing
 * - Validates visual elements and interactions
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

test.describe('SmartPack AI Packing Suggestions', () => {
  test.beforeEach(async ({ tripFormPage }) => {
    await tripFormPage.goto();
  });

  test('generates business trip recommendations', async ({ tripFormPage, mainLayoutPage }) => {
    // Arrange & Act
    await tripFormPage.fillCompleteTrip({
      tripName: 'Corporate Conference 2025',
      destination: 'Tokyo, Japan',
      details: 'Important business meetings with international clients and conference presentations',
      startDate: '2025-08-01',
      endDate: '2025-08-04',
      travelMode: 'plane'
    });

    // Wait for navigation and generate suggestions
    await mainLayoutPage.waitForNavigation();
    await mainLayoutPage.generatePackingList();

    // Assert business-specific recommendations
    await mainLayoutPage.expectItemVisible('Business suits/formal wear');
    await mainLayoutPage.expectItemVisible('Laptop + charger');
    await mainLayoutPage.expectItemVisible('Business cards');
    
    // Verify smart quantity calculations (4 days = 6 pairs with extras)
    await mainLayoutPage.expectItemVisible('6 pairs underwear');
    await mainLayoutPage.expectItemVisible('6 pairs socks');
    
    // Verify destination-specific suggestions
    await mainLayoutPage.expectItemVisible('Translation app');
    
    // Test item persistence
    await mainLayoutPage.checkItem('Business suits/formal wear');
    await mainLayoutPage.verifyItemsPersistAfterReload(['Business suits/formal wear']);
  });

  test('generates beach vacation recommendations', async ({ tripFormPage, mainLayoutPage }) => {
    // Arrange & Act
    await tripFormPage.fillCompleteTrip({
      tripName: 'Hawaii Beach Paradise',
      destination: 'Honolulu, Hawaii',
      details: 'Relaxing beach vacation with swimming, surfing, and water sports',
      startDate: '2025-07-15',
      endDate: '2025-07-22',
      travelMode: 'plane'
    });

    await mainLayoutPage.waitForNavigation();
    await mainLayoutPage.generatePackingList();

    // Assert beach-specific recommendations
    await mainLayoutPage.expectItemVisible('Swimwear');
    await mainLayoutPage.expectItemVisible('Beach towel');
    await mainLayoutPage.expectItemVisible('Sunscreen (SPF 30+)');
    await mainLayoutPage.expectItemVisible('Sunglasses');
    
    // Verify longer trip gets more underwear (7 days = 9 pairs)
    await mainLayoutPage.expectItemVisible('9 pairs underwear');
    
    // Verify beach-specific suggestions
    await mainLayoutPage.expectItemVisible('Insect repellent');
    await mainLayoutPage.expectItemVisible('After-sun lotion');
  });

  test('generates adventure trip recommendations', async ({ tripFormPage, mainLayoutPage }) => {
    // Arrange & Act
    await tripFormPage.fillCompleteTrip({
      tripName: 'Rocky Mountain Expedition',
      destination: 'Rocky Mountain National Park, Colorado',
      details: 'Challenging mountain hiking and camping in cold weather conditions',
      startDate: '2025-09-10',
      endDate: '2025-09-15',
      travelMode: 'car'
    });

    await mainLayoutPage.waitForNavigation();
    await mainLayoutPage.generatePackingList();

    // Assert adventure-specific recommendations
    await mainLayoutPage.expectItemVisible('Hiking boots');
    await mainLayoutPage.expectItemVisible('Backpack');
    await mainLayoutPage.expectItemVisible('Warm layers/fleece');
    await mainLayoutPage.expectItemVisible('First aid kit');
    await mainLayoutPage.expectItemVisible('Headlamp/flashlight');
    
    // Verify road trip specific items
    await mainLayoutPage.expectItemVisible('Road snacks');
    await mainLayoutPage.expectItemVisible('Phone car charger');
  });

  test('adapts recommendations for cold weather destinations', async ({ tripFormPage, mainLayoutPage }) => {
    // Arrange & Act
    await tripFormPage.fillCompleteTrip({
      tripName: 'Winter Wonderland',
      destination: 'Reykjavik, Iceland',
      details: 'Northern lights viewing and winter photography in freezing temperatures',
      startDate: '2025-12-01',
      endDate: '2025-12-05',
      travelMode: 'plane'
    });

    await mainLayoutPage.waitForNavigation();
    await mainLayoutPage.generatePackingList();

    // Assert cold weather recommendations
    await mainLayoutPage.expectItemVisible('Winter coat');
    await mainLayoutPage.expectItemVisible('Thermal underwear');
    await mainLayoutPage.expectItemVisible('Warm hat/beanie');
    await mainLayoutPage.expectItemVisible('Insulated gloves');
    await mainLayoutPage.expectItemVisible('Snow boots');
    await mainLayoutPage.expectItemVisible('Hand/foot warmers');
  });
});
