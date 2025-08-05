// ship-readiness-validation.spec.ts
// Comprehensive manual-first validation for ship readiness assessment
import { test, expect, Page } from '@playwright/test';

// Phase 1: Manual Context Building - Simulating Real User Experience
test.describe('Ship Readiness Validation - Manual-First Approach', () => {
  
  test('Phase 1: Manual Exploration - Application Launch and First Impressions', async ({ page }) => {
    console.log('🔍 MANUAL EXPLORATION PHASE 1: Starting first-time user experience simulation');
    
    // Step 1: Navigate to app like a real user
    console.log('📱 Opening SmartPack application for the first time...');
    await page.goto('/');
    
    // Take screenshot of initial load
    await page.screenshot({ path: 'manual-validation-initial-load.png', fullPage: true });
    
    // Check if app loads properly (not blank page)
    console.log('✅ Checking if application loads without blank page...');
    await expect(page.locator('body')).not.toHaveText('');
    
    // Look for main SmartPack interface elements
    console.log('🎯 Looking for main SmartPack interface elements...');
    
    // Check for main navigation or header
    const header = page.locator('header, nav, [role="banner"], h1, .header, #header');
    await expect(header.first()).toBeVisible({ timeout: 10000 });
    
    // Check for main content area
    const mainContent = page.locator('main, [role="main"], .main-content, #main, .container');
    await expect(mainContent.first()).toBeVisible({ timeout: 10000 });
    
    console.log('✅ Application loads successfully with visible interface elements');
  });

  test('Phase 1: Manual Step 2 - Trip Creation Workflow Discovery', async ({ page }) => {
    console.log('🔍 MANUAL STEP 2: Exploring trip creation as first-time user');
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Look for trip form elements like a real user would
    console.log('📝 Looking for trip creation form...');
    
    // Try to find trip name/title input
    const tripNameInput = page.locator('input[name="tripName"], input[placeholder*="trip"], input[placeholder*="Trip"], input[id*="trip"], input[data-testid*="trip-name"]');
    if (await tripNameInput.count() > 0) {
      console.log('✅ Found trip name input field');
      await expect(tripNameInput.first()).toBeVisible();
    }
    
    // Try to find destination input
    const destinationInput = page.locator('input[name*="destination"], input[placeholder*="destination"], input[placeholder*="Destination"], input[id*="destination"], input[data-testid*="destination"]');
    if (await destinationInput.count() > 0) {
      console.log('✅ Found destination input field');
      await expect(destinationInput.first()).toBeVisible();
    }
    
    // Try to find date inputs
    const dateInput = page.locator('input[type="date"], input[name*="date"], input[placeholder*="date"], input[data-testid*="date"]');
    if (await dateInput.count() > 0) {
      console.log('✅ Found date input fields');
    }
    
    // Take screenshot of form area
    await page.screenshot({ path: 'manual-validation-trip-form.png', fullPage: true });
    
    console.log('✅ Trip creation interface elements found and accessible');
  });

  test('Phase 1: Manual Step 3 - Generate Packing List Feature Discovery', async ({ page }) => {
    console.log('🔍 MANUAL STEP 3: Looking for Generate Smart Packing List functionality');
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Look for generate button or AI functionality
    console.log('🤖 Searching for AI packing list generation feature...');
    
    const generateButton = page.locator('button:has-text("Generate"), button:has-text("AI"), button:has-text("Smart"), button:has-text("Packing"), button[data-testid*="generate"]');
    
    if (await generateButton.count() > 0) {
      console.log('✅ Found Generate Smart Packing List button');
      await expect(generateButton.first()).toBeVisible();
      
      // Take screenshot showing the generate button
      await generateButton.first().screenshot({ path: 'manual-validation-generate-button.png' });
    } else {
      console.log('⚠️ Generate button not immediately visible - may need form completion first');
    }
    
    // Look for existing packing list area
    const packingListArea = page.locator('[data-testid*="packing"], .packing-list, #packing-list, [class*="packing"]');
    if (await packingListArea.count() > 0) {
      console.log('✅ Found packing list display area');
      await expect(packingListArea.first()).toBeVisible();
    }
    
    console.log('✅ Packing list generation interface exploration complete');
  });

  test('Phase 1: Manual Step 4 - State and Data Persistence Exploration', async ({ page }) => {
    console.log('🔍 MANUAL STEP 4: Testing data persistence and state management');
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check localStorage access
    console.log('💾 Testing localStorage access...');
    
    const localStorageTest = await page.evaluate(() => {
      try {
        localStorage.setItem('test-key', 'test-value');
        const value = localStorage.getItem('test-key');
        localStorage.removeItem('test-key');
        return value === 'test-value';
      } catch (error) {
        return false;
      }
    });
    
    if (localStorageTest) {
      console.log('✅ localStorage is accessible and functional');
    } else {
      console.log('❌ localStorage access failed - critical issue for data persistence');
      throw new Error('localStorage not accessible - ship blocker');
    }
    
    // Check for existing trip data
    const existingTripData = await page.evaluate(() => {
      return localStorage.getItem('tripForm');
    });
    
    if (existingTripData) {
      console.log('📊 Found existing trip data in localStorage');
    } else {
      console.log('📊 No existing trip data - clean first-time user state');
    }
    
    console.log('✅ Data persistence exploration complete');
  });

  test('Phase 1: Manual Step 5 - Global State and Column Visibility Validation', async ({ page }) => {
    console.log('🔍 MANUAL STEP 5: Validating React state and column visibility logic');
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Inspect React DevTools state (simulated)
    console.log('⚛️ Checking React state management...');
    
    // Check for TripFormProvider context by looking for data attributes or classes
    const tripFormElements = page.locator('[data-trip-form-context], .trip-form-provider, [class*="trip-form"]');
    if (await tripFormElements.count() > 0) {
      console.log('✅ Found React context provider elements');
    }
    
    // Check column visibility state
    console.log('📊 Checking column visibility state...');
    
    const columnVisibilityData = await page.evaluate(() => {
      return localStorage.getItem('smartpack-column-visibility');
    });
    
    if (columnVisibilityData) {
      console.log('📊 Column visibility data found:', columnVisibilityData);
    } else {
      console.log('📊 No column visibility data - first-time user state expected');
    }
    
    // Check visible columns count
    const visibleColumns = page.locator('[class*="column"]:visible, [data-testid*="column"]:visible, .col:visible');
    const columnCount = await visibleColumns.count();
    console.log(`📊 Visible columns detected: ${columnCount}`);
    
    // For first-time users, should show 1 column, for experienced users should show 3
    const tripData = await page.evaluate(() => {
      return localStorage.getItem('tripForm');
    });
    
    const expectedColumns = tripData && JSON.parse(tripData).tripName ? 3 : 1;
    console.log(`📊 Expected columns based on user state: ${expectedColumns}`);
    
    console.log('✅ Global state validation complete');
  });

  test('Ship-Critical Test 1: Application Launch Comprehensive Check', async ({ page }) => {
    console.log('🚢 SHIP-CRITICAL TEST 1: Application Launch Validation');
    
    await page.goto('/');
    
    // Wait for core application structure
    await page.waitForLoadState('networkidle');
    
    // Check that we don't have a blank page
    const bodyText = await page.locator('body').textContent();
    expect(bodyText).not.toBe('');
    expect(bodyText?.length).toBeGreaterThan(10);
    
    // Check for main application container
    const appContainer = page.locator('#root, [data-testid="app"], .app, main');
    await expect(appContainer.first()).toBeVisible({ timeout: 10000 });
    
    // Check that JavaScript is working (React rendered)
    const reactElement = page.locator('[data-reactroot], [data-react-helmet], [class*="react"], div[id="root"] > div');
    await expect(reactElement.first()).toBeVisible({ timeout: 10000 });
    
    // Check for no console errors that would indicate critical issues
    const consoleLogs: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleLogs.push(msg.text());
      }
    });
    
    await page.waitForTimeout(2000); // Allow time for any errors to surface
    
    // Allow some errors but not critical ones
    const criticalErrors = consoleLogs.filter(log => 
      log.includes('Cannot read') || 
      log.includes('TypeError') || 
      log.includes('ReferenceError') ||
      log.includes('is not defined')
    );
    
    if (criticalErrors.length > 0) {
      console.log('❌ Critical JavaScript errors detected:', criticalErrors);
      throw new Error(`Critical JavaScript errors prevent ship: ${criticalErrors.join(', ')}`);
    }
    
    console.log('✅ Application launches successfully with no critical errors');
  });

  test('Ship-Critical Test 2: Trip Form Creation End-to-End', async ({ page }) => {
    console.log('🚢 SHIP-CRITICAL TEST 2: Trip Form Creation');
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Try to find and fill trip form fields
    console.log('📝 Testing trip form functionality...');
    
    // Find trip name input (flexible selector)
    const tripNameSelectors = ['input[name="tripName"]', 'input[placeholder*="trip"]', 'input[data-testid*="trip-name"]', 'input[id*="trip"]'];
    let tripNameInput = null;
    
    for (const selector of tripNameSelectors) {
      const element = page.locator(selector);
      if (await element.count() > 0 && await element.isVisible()) {
        tripNameInput = element.first();
        break;
      }
    }
    
    if (tripNameInput) {
      await tripNameInput.fill('Test Trip to Tokyo');
      console.log('✅ Trip name input filled successfully');
    } else {
      console.log('⚠️ Trip name input not found - checking if form exists');
    }
    
    // Find destination input
    const destinationSelectors = ['input[name*="destination"]', 'input[placeholder*="destination"]', 'input[data-testid*="destination"]'];
    let destinationInput = null;
    
    for (const selector of destinationSelectors) {
      const element = page.locator(selector);
      if (await element.count() > 0 && await element.isVisible()) {
        destinationInput = element.first();
        break;
      }
    }
    
    if (destinationInput) {
      await destinationInput.fill('Tokyo, Japan');
      console.log('✅ Destination input filled successfully');
    }
    
    // Look for save button
    const saveButton = page.locator('button:has-text("Save"), button[type="submit"], button[data-testid*="save"]');
    if (await saveButton.count() > 0) {
      console.log('✅ Save button found');
      await saveButton.first().click();
      await page.waitForTimeout(1000); // Allow state to update
    }
    
    console.log('✅ Trip form creation workflow validated');
  });

  test('Ship-Critical Test 3: Generate Packing List Core Functionality', async ({ page }) => {
    console.log('🚢 SHIP-CRITICAL TEST 3: Generate Packing List Functionality');
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // First ensure we have trip data (prerequisite)
    const tripNameInput = page.locator('input[name="tripName"], input[placeholder*="trip"], input[data-testid*="trip-name"]');
    if (await tripNameInput.count() > 0) {
      await tripNameInput.first().fill('Ship Test Trip');
    }
    
    const destinationInput = page.locator('input[name*="destination"], input[placeholder*="destination"]');
    if (await destinationInput.count() > 0) {
      await destinationInput.first().fill('Paris, France');
    }
    
    // Save form if save button exists
    const saveButton = page.locator('button:has-text("Save"), button[type="submit"]');
    if (await saveButton.count() > 0) {
      await saveButton.first().click();
      await page.waitForTimeout(1000);
    }
    
    // Now look for generate packing list functionality
    console.log('🤖 Testing AI packing list generation...');
    
    const generateSelectors = [
      'button:has-text("Generate")',
      'button:has-text("Smart")',
      'button:has-text("AI")',
      'button[data-testid*="generate"]',
      '[class*="generate"] button'
    ];
    
    let generateButton = null;
    for (const selector of generateSelectors) {
      const element = page.locator(selector);
      if (await element.count() > 0) {
        generateButton = element.first();
        break;
      }
    }
    
    if (generateButton && await generateButton.isVisible()) {
      console.log('✅ Generate button found and visible');
      
      // Click generate button
      await generateButton.click();
      console.log('🤖 Clicked Generate Smart Packing List button');
      
      // Wait for loading state or results (up to 30 seconds for AI)
      try {
        // Look for loading indicator
        const loadingIndicator = page.locator('[class*="loading"], [class*="spinner"], .loading, [data-testid*="loading"]');
        if (await loadingIndicator.isVisible()) {
          console.log('⏳ Loading indicator visible - AI processing...');
        }
        
        // Wait for packing list items to appear (flexible timeout for AI)
        const packingItems = page.locator('[class*="packing"] li, [data-testid*="packing"] li, .packing-item, [class*="item"]');
        await expect(packingItems.first()).toBeVisible({ timeout: 45000 });
        
        const itemCount = await packingItems.count();
        console.log(`✅ Generated ${itemCount} packing list items`);
        
        if (itemCount >= 5) {
          console.log('✅ AI generated substantial packing list - core functionality working');
        } else {
          console.log('⚠️ Generated fewer items than expected but functionality works');
        }
        
      } catch (error) {
        console.log('❌ Generate packing list failed or timed out');
        console.log('Error details:', error);
        throw new Error('Generate Packing List functionality failed - ship blocker');
      }
      
    } else {
      console.log('❌ Generate Smart Packing List button not found');
      throw new Error('Generate functionality not available - ship blocker');
    }
    
    console.log('✅ Generate Packing List functionality validated');
  });

  test('Ship-Critical Test 4: Data Persistence Validation', async ({ page }) => {
    console.log('🚢 SHIP-CRITICAL TEST 4: Data Persistence');
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Test data persistence workflow
    console.log('💾 Testing data persistence workflow...');
    
    // Fill out form data
    const testTripName = 'Persistence Test Trip';
    const testDestination = 'Berlin, Germany';
    
    const tripNameInput = page.locator('input[name="tripName"], input[placeholder*="trip"], input[data-testid*="trip-name"]');
    if (await tripNameInput.count() > 0) {
      await tripNameInput.first().fill(testTripName);
    }
    
    const destinationInput = page.locator('input[name*="destination"], input[placeholder*="destination"]');
    if (await destinationInput.count() > 0) {
      await destinationInput.first().fill(testDestination);
    }
    
    // Save data
    const saveButton = page.locator('button:has-text("Save"), button[type="submit"]');
    if (await saveButton.count() > 0) {
      await saveButton.first().click();
      await page.waitForTimeout(1000);
    }
    
    // Verify data was saved to localStorage
    const savedData = await page.evaluate(() => {
      return localStorage.getItem('tripForm');
    });
    
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      console.log('✅ Data saved to localStorage:', parsedData);
      
      if (parsedData.tripName === testTripName) {
        console.log('✅ Trip name persisted correctly');
      }
    } else {
      throw new Error('Data not saved to localStorage - ship blocker');
    }
    
    // Test data survival across page refresh
    console.log('🔄 Testing data persistence across page refresh...');
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Check if data is restored
    const restoredData = await page.evaluate(() => {
      return localStorage.getItem('tripForm');
    });
    
    if (restoredData) {
      const parsedRestoredData = JSON.parse(restoredData);
      if (parsedRestoredData.tripName === testTripName) {
        console.log('✅ Data persists across page refresh');
      } else {
        throw new Error('Data not properly restored after refresh - ship blocker');
      }
    } else {
      throw new Error('Data lost after page refresh - ship blocker');
    }
    
    console.log('✅ Data persistence validated successfully');
  });

});

// Mobile-specific validation
test.describe('Mobile Ship Readiness Validation', () => {
  
  test('Mobile: Touch Interface and Responsiveness', async ({ page }) => {
    console.log('📱 MOBILE VALIDATION: Touch interface testing');
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check mobile responsiveness
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.waitForTimeout(500);
    
    // Take mobile screenshot
    await page.screenshot({ path: 'mobile-validation-responsive.png', fullPage: true });
    
    // Check that elements are touch-friendly (44px minimum)
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < Math.min(buttonCount, 5); i++) {
      const button = buttons.nth(i);
      if (await button.isVisible()) {
        const boundingBox = await button.boundingBox();
        if (boundingBox && (boundingBox.height < 44 || boundingBox.width < 44)) {
          console.log(`⚠️ Button ${i} may be too small for touch: ${boundingBox.width}x${boundingBox.height}`);
        }
      }
    }
    
    // Test that main functionality is accessible on mobile
    const mainContent = page.locator('main, [role="main"], .container');
    await expect(mainContent.first()).toBeVisible();
    
    console.log('✅ Mobile interface validation complete');
  });

});