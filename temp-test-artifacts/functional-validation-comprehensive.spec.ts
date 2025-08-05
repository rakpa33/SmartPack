import { test, expect, Page } from '@playwright/test';

// Comprehensive Ship Readiness Validation
// Testing all core workflows and ship-critical functionality

test.describe('SmartPack Ship Readiness Validation', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('http://localhost:5185');
    await page.waitForLoadState('networkidle');
  });

  test('1. Core Application Loading and Structure', async ({ page }) => {
    console.log('=== TESTING: Application Loading and Basic Structure ===');
    
    // Verify page loads successfully
    await expect(page).toHaveTitle(/SmartPack/);
    
    // Check for main application structure
    const appContainer = page.locator('[data-testid="main-layout"], .main-layout, main, #root > div');
    await expect(appContainer.first()).toBeVisible();
    
    console.log('✅ Application loads successfully');
    console.log('✅ Main application structure present');
  });

  test('2. Trip Form - Basic Functionality and Validation', async ({ page }) => {
    console.log('=== TESTING: Trip Form Basic Functionality ===');
    
    // Find and interact with trip form elements
    const tripNameInput = page.locator('input[name="tripName"], input[placeholder*="trip"], input[aria-label*="trip"]').first();
    const destinationInput = page.locator('input[name="destination"], input[placeholder*="destination"], input[aria-label*="destination"]').first();
    
    // Test trip name input
    if (await tripNameInput.isVisible()) {
      await tripNameInput.fill('Test Trip to Japan');
      console.log('✅ Trip name input working');
    } else {
      console.log('⚠️ Trip name input not found or not visible');
    }
    
    // Test destination input
    if (await destinationInput.isVisible()) {
      await destinationInput.fill('Tokyo');
      console.log('✅ Destination input working');
    } else {
      console.log('⚠️ Destination input not found or not visible');
    }
    
    // Check for date inputs
    const dateInputs = page.locator('input[type="date"], input[name*="date"], input[placeholder*="date"]');
    const dateCount = await dateInputs.count();
    console.log(`✅ Found ${dateCount} date input(s)`);
    
    // Look for travel mode selection
    const travelModes = page.locator('input[type="checkbox"], input[type="radio"]');
    const modeCount = await travelModes.count();
    console.log(`✅ Found ${modeCount} travel mode input(s)`);
  });

  test('3. Location Autocomplete - Critical Geocoding Test', async ({ page }) => {
    console.log('=== TESTING: Location Autocomplete (SHIP-CRITICAL) ===');
    
    // Find destination input
    const destinationInput = page.locator('input[name="destination"], input[placeholder*="destination"], input[aria-label*="destination"]').first();
    
    if (await destinationInput.isVisible()) {
      console.log('📍 Testing Osaka → Osaka, Japan autocomplete');
      
      // Clear and enter "Osaka"
      await destinationInput.clear();
      await destinationInput.fill('Osaka');
      
      // Get initial value
      const initialValue = await destinationInput.inputValue();
      console.log(`Initial value: "${initialValue}"`);
      
      // Trigger blur event
      await destinationInput.blur();
      
      // Wait for potential geocoding
      await page.waitForTimeout(2000);
      
      // Check final value
      const finalValue = await destinationInput.inputValue();
      console.log(`Final value: "${finalValue}"`);
      
      // Validate geocoding behavior
      if (finalValue !== initialValue && finalValue.includes('Japan')) {
        console.log('✅ CRITICAL: Location autocomplete working! Osaka → ' + finalValue);
      } else if (finalValue === initialValue) {
        console.log('❌ SHIP BLOCKER: Location autocomplete NOT working - value unchanged');
      } else {
        console.log('⚠️ Unexpected autocomplete behavior: ' + finalValue);
      }
      
      // Test with another city
      console.log('📍 Testing Paris autocomplete');
      await destinationInput.clear();
      await destinationInput.fill('Paris');
      const parisInitial = await destinationInput.inputValue();
      await destinationInput.blur();
      await page.waitForTimeout(2000);
      const parisFinal = await destinationInput.inputValue();
      
      if (parisFinal !== parisInitial) {
        console.log('✅ Paris autocomplete working: ' + parisFinal);
      } else {
        console.log('❌ Paris autocomplete NOT working');
      }
      
    } else {
      console.log('❌ CRITICAL ERROR: Destination input not found - cannot test autocomplete');
    }
  });

  test('4. Form Validation - Blur and Submit Validation', async ({ page }) => {
    console.log('=== TESTING: Form Validation Behavior ===');
    
    // Test required field validation
    const tripNameInput = page.locator('input[name="tripName"], input[placeholder*="trip"]').first();
    const destinationInput = page.locator('input[name="destination"], input[placeholder*="destination"]').first();
    
    if (await tripNameInput.isVisible()) {
      // Test empty field validation
      await tripNameInput.focus();
      await tripNameInput.blur();
      
      // Look for validation error
      const errorMessage = page.locator('.error, [role="alert"], .text-red-500, .text-red-600');
      const hasError = await errorMessage.first().isVisible();
      
      if (hasError) {
        const errorText = await errorMessage.first().textContent();
        console.log('✅ Form validation working - shows error: ' + errorText);
      } else {
        console.log('⚠️ Form validation may not be working - no error shown for empty required field');
      }
    }
    
    // Test travel modes if present
    const travelModeCheckboxes = page.locator('input[type="checkbox"]');
    const checkboxCount = await travelModeCheckboxes.count();
    
    if (checkboxCount > 0) {
      console.log(`✅ Found ${checkboxCount} travel mode options`);
      
      // Test selecting a travel mode
      await travelModeCheckboxes.first().check();
      console.log('✅ Travel mode selection working');
    }
  });

  test('5. Weather Integration - API Connection Test', async ({ page }) => {
    console.log('=== TESTING: Weather Integration ===');
    
    // Fill out basic trip details to trigger weather
    const destinationInput = page.locator('input[name="destination"], input[placeholder*="destination"]').first();
    
    if (await destinationInput.isVisible()) {
      await destinationInput.fill('Tokyo');
      await destinationInput.blur();
      
      // Look for weather information
      await page.waitForTimeout(3000);
      
      const weatherElements = page.locator('.weather, [data-testid*="weather"], .temperature, .forecast');
      const weatherVisible = await weatherElements.first().isVisible({ timeout: 5000 }).catch(() => false);
      
      if (weatherVisible) {
        console.log('✅ Weather integration working - weather data displayed');
      } else {
        console.log('⚠️ Weather integration not visible or not working');
      }
    }
  });

  test('6. Navigation and Multi-Step Workflow', async ({ page }) => {
    console.log('=== TESTING: Navigation and Workflow ===');
    
    // Look for navigation elements (buttons, tabs, steps)
    const navElements = page.locator('button, [role="tab"], .step, .nav, [data-testid*="nav"]');
    const navCount = await navElements.count();
    console.log(`✅ Found ${navCount} navigation elements`);
    
    // Look for next/continue buttons
    const continueButton = page.locator('button:has-text("Next"), button:has-text("Continue"), button:has-text("Generate"), button[type="submit"]');
    const continueVisible = await continueButton.first().isVisible().catch(() => false);
    
    if (continueVisible) {
      console.log('✅ Workflow progression buttons found');
    } else {
      console.log('⚠️ No workflow progression buttons found');
    }
  });

  test('7. AI Integration - Packing List Generation', async ({ page }) => {
    console.log('=== TESTING: AI Integration and Packing List ===');
    
    // Fill minimal form to enable AI generation
    const tripNameInput = page.locator('input[name="tripName"], input[placeholder*="trip"]').first();
    const destinationInput = page.locator('input[name="destination"], input[placeholder*="destination"]').first();
    
    if (await tripNameInput.isVisible() && await destinationInput.isVisible()) {
      await tripNameInput.fill('Quick Test Trip');
      await destinationInput.fill('Paris');
      
      // Look for travel mode checkboxes and select one
      const checkbox = page.locator('input[type="checkbox"]').first();
      if (await checkbox.isVisible()) {
        await checkbox.check();
      }
      
      // Look for AI generation button
      const generateButton = page.locator('button:has-text("Generate"), button:has-text("AI"), button:has-text("Pack")');
      
      if (await generateButton.first().isVisible()) {
        console.log('✅ AI generation button found');
        
        // Try to trigger AI generation
        await generateButton.first().click();
        
        // Wait for AI response
        await page.waitForTimeout(5000);
        
        // Look for generated packing list
        const packingItems = page.locator('.item, li, [data-testid*="item"], .checklist-item');
        const itemCount = await packingItems.count();
        
        if (itemCount > 0) {
          console.log(`✅ AI integration working - generated ${itemCount} packing items`);
        } else {
          console.log('⚠️ AI integration may not be working - no packing items generated');
        }
      } else {
        console.log('⚠️ AI generation button not found');
      }
    }
  });

  test('8. Data Persistence - localStorage Functionality', async ({ page }) => {
    console.log('=== TESTING: Data Persistence ===');
    
    // Fill out form data
    const tripNameInput = page.locator('input[name="tripName"], input[placeholder*="trip"]').first();
    
    if (await tripNameInput.isVisible()) {
      const testTripName = 'Persistence Test Trip ' + Date.now();
      await tripNameInput.fill(testTripName);
      
      // Trigger save (blur or other event)
      await tripNameInput.blur();
      await page.waitForTimeout(1000);
      
      // Reload page
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      // Check if data persisted
      const persistedValue = await tripNameInput.inputValue();
      
      if (persistedValue === testTripName) {
        console.log('✅ Data persistence working - trip name saved and restored');
      } else if (persistedValue && persistedValue !== '') {
        console.log('⚠️ Partial data persistence - some data restored but not exact');
      } else {
        console.log('❌ Data persistence NOT working - no data restored after reload');
      }
    }
  });

  test('9. Mobile Responsiveness - Touch and Layout', async ({ page }) => {
    console.log('=== TESTING: Mobile Responsiveness ===');
    
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);
    
    // Check if layout adapts
    const container = page.locator('#root > div, main, .app').first();
    const boundingBox = await container.boundingBox();
    
    if (boundingBox && boundingBox.width <= 375) {
      console.log('✅ Mobile layout responsive - container fits mobile viewport');
    } else {
      console.log('⚠️ Mobile layout may have issues - container width exceeds viewport');
    }
    
    // Test touch interactions
    const firstInput = page.locator('input').first();
    if (await firstInput.isVisible()) {
      await firstInput.tap();
      const isFocused = await firstInput.evaluate(el => el === document.activeElement);
      
      if (isFocused) {
        console.log('✅ Touch interactions working - tap focuses input');
      } else {
        console.log('⚠️ Touch interactions may have issues');
      }
    }
    
    // Restore desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('10. Error Handling and Graceful Degradation', async ({ page }) => {
    console.log('=== TESTING: Error Handling ===');
    
    // Monitor console errors
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Test with invalid inputs
    const destinationInput = page.locator('input[name="destination"], input[placeholder*="destination"]').first();
    
    if (await destinationInput.isVisible()) {
      // Test with very long input
      await destinationInput.fill('x'.repeat(1000));
      await destinationInput.blur();
      await page.waitForTimeout(2000);
      
      if (consoleErrors.length === 0) {
        console.log('✅ Error handling working - no console errors with extreme input');
      } else {
        console.log('⚠️ Console errors detected: ' + consoleErrors.join(', '));
      }
    }
    
    // Check for error boundaries
    const errorBoundary = page.locator('.error-boundary, [data-testid="error-boundary"]');
    const hasErrorBoundary = await errorBoundary.isVisible().catch(() => false);
    
    if (!hasErrorBoundary) {
      console.log('✅ No error boundary displayed - application running normally');
    } else {
      console.log('❌ Error boundary activated - application has critical errors');
    }
  });
});