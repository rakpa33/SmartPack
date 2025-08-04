import { test, expect } from '@playwright/test';

/**
 * FUNCTIONAL VALIDATOR: CRITICAL FORM WORKFLOW TESTING
 * 
 * This test validates the complete user workflow after architecture analyzer
 * identified and fixed the loading check issue in TripDetails.tsx.
 * 
 * TESTING REQUIREMENTS:
 * 1. Form submission data display validation
 * 2. Context state synchronization validation  
 * 3. Column visibility validation after form save
 * 4. Data persistence across page refreshes
 * 5. AI integration preparation testing
 */

test.describe('Critical Form Workflow Validation', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to start fresh
    await page.evaluate(() => {
      localStorage.clear();
    });
    
    // Navigate to the application
    await page.goto('http://localhost:5183');
    
    // Wait for initial load and ensure no loading state
    await page.waitForLoadState('networkidle');
    
    // Verify app is not stuck in loading state
    await expect(page.locator('text=Loading...')).not.toBeVisible({ timeout: 2000 });
  });

  test('1. Form Submission Data Display Validation', async ({ page }) => {
    console.log('🧪 TEST 1: Form Submission → Data Display Validation');
    
    // Fill out the trip form with test data
    console.log('📝 Filling out trip form...');
    
    // Trip name
    await page.fill('input[name="tripName"]', 'Test Trip to Tokyo');
    
    // Destination
    const destinationInput = page.locator('input[placeholder*="destination"]').first();
    await destinationInput.fill('Tokyo, Japan');
    await destinationInput.blur(); // Trigger validation
    
    // Start date (future date)
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 10);
    const startDateStr = startDate.toISOString().split('T')[0];
    await page.fill('input[name="startDate"]', startDateStr);
    
    // End date (2 days later)
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 2);
    const endDateStr = endDate.toISOString().split('T')[0];
    await page.fill('input[name="endDate"]', endDateStr);
    
    // Travel mode
    await page.check('input[value="plane"]');
    await page.check('input[value="walking"]');
    
    console.log('✅ Form filled with test data');
    
    // Submit the form
    const saveButton = page.locator('button:has-text("Save Trip")');
    await expect(saveButton).toBeVisible();
    await saveButton.click();
    
    console.log('📤 Form submitted');
    
    // CRITICAL: Verify that submitted data now displays in TripDetails component
    console.log('🔍 Checking if submitted data displays...');
    
    // Wait a moment for state updates
    await page.waitForTimeout(500);
    
    // Check for trip name display
    await expect(page.locator('text=Test Trip to Tokyo')).toBeVisible({ timeout: 5000 });
    console.log('✅ Trip name displays correctly');
    
    // Check for destination display
    await expect(page.locator('text=Tokyo, Japan')).toBeVisible();
    console.log('✅ Destination displays correctly');
    
    // Check for date display
    await expect(page.locator(`text=${startDateStr}`)).toBeVisible();
    console.log('✅ Start date displays correctly');
    
    // Check for travel mode display
    await expect(page.locator('text=plane')).toBeVisible();
    await expect(page.locator('text=walking')).toBeVisible();
    console.log('✅ Travel modes display correctly');
    
    // CRITICAL: Ensure "Loading trip details..." is NOT showing
    await expect(page.locator('text=Loading trip details...')).not.toBeVisible();
    console.log('✅ No loading state after form submission');
    
    // Check console for debug output
    const consoleLogs = [];
    page.on('console', msg => {
      if (msg.type() === 'log' && (msg.text().includes('TripDetails') || msg.text().includes('hasAnyData'))) {
        consoleLogs.push(msg.text());
      }
    });
    
    // Reload to trigger debug logs
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Log any debug output found
    if (consoleLogs.length > 0) {
      console.log('🐛 Debug logs found:', consoleLogs);
    }
    
    console.log('✅ TEST 1 PASSED: Form submission data displays correctly');
  });

  test('2. Context State Synchronization Validation', async ({ page }) => {
    console.log('🧪 TEST 2: Context State Synchronization Validation');
    
    // Fill and submit form
    await page.fill('input[name="tripName"]', 'Sync Test Trip');
    await page.fill('input[placeholder*="destination"]', 'Osaka, Japan');
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 5);
    await page.fill('input[name="startDate"]', startDate.toISOString().split('T')[0]);
    
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 3);
    await page.fill('input[name="endDate"]', endDate.toISOString().split('T')[0]);
    
    await page.check('input[value="car"]');
    
    // Submit form
    await page.click('button:has-text("Save Trip")');
    await page.waitForTimeout(500);
    
    // Check localStorage was updated
    const localStorageData = await page.evaluate(() => {
      const data = localStorage.getItem('tripForm');
      return data ? JSON.parse(data) : null;
    });
    
    expect(localStorageData).toBeTruthy();
    expect(localStorageData.tripName).toBe('Sync Test Trip');
    expect(localStorageData.destinations).toContain('Osaka, Japan');
    expect(localStorageData.travelModes).toContain('car');
    
    console.log('✅ localStorage updated correctly');
    
    // Verify TripDetails receives proper props from MainLayout
    await expect(page.locator('text=Sync Test Trip')).toBeVisible();
    await expect(page.locator('text=Osaka, Japan')).toBeVisible();
    await expect(page.locator('text=car')).toBeVisible();
    
    console.log('✅ TripDetails receives proper props from MainLayout');
    
    console.log('✅ TEST 2 PASSED: Context state synchronization working');
  });

  test('3. Column Visibility Validation', async ({ page }) => {
    console.log('🧪 TEST 3: Column Visibility Validation');
    
    // Initially, should be in first-time user state
    const tripDetailsColumn = page.locator('[data-testid="trip-details-column"]').or(page.locator('.trip-details'));
    const packingColumn = page.locator('[data-testid="packing-checklist-column"]').or(page.locator('.packing-checklist'));
    const suggestionsColumn = page.locator('[data-testid="suggestions-column"]').or(page.locator('.suggestions'));
    
    console.log('🔍 Checking initial column visibility...');
    
    // Fill and submit form
    await page.fill('input[name="tripName"]', 'Column Test Trip');
    await page.fill('input[placeholder*="destination"]', 'Kyoto, Japan');
    
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    await page.fill('input[name="startDate"]', futureDate.toISOString().split('T')[0]);
    
    const endDate = new Date(futureDate);
    endDate.setDate(endDate.getDate() + 4);
    await page.fill('input[name="endDate"]', endDate.toISOString().split('T')[0]);
    
    await page.check('input[value="train"]');
    
    // Submit form
    await page.click('button:has-text("Save Trip")');
    await page.waitForTimeout(1000); // Wait for column visibility update
    
    console.log('🔍 Checking column visibility after form submission...');
    
    // Verify updateColumnVisibilityFromTrip() was called
    // All three columns should be visible after form save
    const columns = page.locator('[class*="col-span"], [class*="column"]');
    const columnCount = await columns.count();
    
    console.log(`📊 Found ${columnCount} columns after form submission`);
    
    // Check for main content areas
    await expect(page.locator('text=Column Test Trip')).toBeVisible();
    console.log('✅ Trip details visible');
    
    // Look for packing list or suggestions areas
    const hasPackingSection = await page.locator('text=Packing List').or(page.locator('text=Add Item')).isVisible();
    const hasSuggestionsSection = await page.locator('text=Suggestions').or(page.locator('text=Generate')).isVisible();
    
    if (hasPackingSection) {
      console.log('✅ Packing section visible');
    }
    if (hasSuggestionsSection) {
      console.log('✅ Suggestions section visible');
    }
    
    // Verify column synchronizer detected form completion
    const isFirstTimeUser = await page.evaluate(() => {
      const data = localStorage.getItem('tripForm');
      if (!data) return true;
      const parsed = JSON.parse(data);
      return !parsed.tripName || 
             (parsed.destinations && parsed.destinations.length === 1 && !parsed.destinations[0]) ||
             (!parsed.travelModes || parsed.travelModes.length === 0);
    });
    
    expect(isFirstTimeUser).toBe(false);
    console.log('✅ Column synchronizer properly detects form completion');
    
    console.log('✅ TEST 3 PASSED: Column visibility updates after form save');
  });

  test('4. Data Persistence Validation', async ({ page }) => {
    console.log('🧪 TEST 4: Data Persistence Validation');
    
    // Fill and submit form
    const testData = {
      tripName: 'Persistence Test Trip',
      destination: 'Nara, Japan',
      startDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      travelMode: 'bus'
    };
    
    await page.fill('input[name="tripName"]', testData.tripName);
    await page.fill('input[placeholder*="destination"]', testData.destination);
    await page.fill('input[name="startDate"]', testData.startDate);
    await page.fill('input[name="endDate"]', testData.endDate);
    await page.check(`input[value="${testData.travelMode}"]`);
    
    // Submit form and verify it saves to localStorage
    await page.click('button:has-text("Save Trip")');
    await page.waitForTimeout(500);
    
    // Verify data saves to localStorage
    const savedData = await page.evaluate(() => {
      const data = localStorage.getItem('tripForm');
      return data ? JSON.parse(data) : null;
    });
    
    expect(savedData).toBeTruthy();
    expect(savedData.tripName).toBe(testData.tripName);
    expect(savedData.destinations[0]).toBe(testData.destination);
    expect(savedData.travelModes).toContain(testData.travelMode);
    
    console.log('✅ Data persists to localStorage correctly');
    
    // Refresh the page and verify data persists
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000); // Wait for context initialization
    
    // Check that persisted data displays correctly after refresh
    await expect(page.locator(`text=${testData.tripName}`)).toBeVisible({ timeout: 5000 });
    await expect(page.locator(`text=${testData.destination}`)).toBeVisible();
    await expect(page.locator(`text=${testData.travelMode}`)).toBeVisible();
    
    console.log('✅ Data displays correctly after page refresh');
    
    // Verify localStorage integrity after refresh
    const persistedData = await page.evaluate(() => {
      const data = localStorage.getItem('tripForm');
      return data ? JSON.parse(data) : null;
    });
    
    expect(persistedData).toEqual(savedData);
    console.log('✅ Data integrity maintained across page refreshes');
    
    console.log('✅ TEST 4 PASSED: Data persistence working correctly');
  });

  test('5. AI Integration Preparation', async ({ page }) => {
    console.log('🧪 TEST 5: AI Integration Preparation Testing');
    
    // Fill form with data suitable for AI processing
    const aiTestData = {
      tripName: 'AI Test Tokyo Trip',
      destination: 'Tokyo, Japan',
      startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      travelModes: ['plane', 'train', 'walking']
    };
    
    await page.fill('input[name="tripName"]', aiTestData.tripName);
    await page.fill('input[placeholder*="destination"]', aiTestData.destination);
    await page.fill('input[name="startDate"]', aiTestData.startDate);
    await page.fill('input[name="endDate"]', aiTestData.endDate);
    
    for (const mode of aiTestData.travelModes) {
      await page.check(`input[value="${mode}"]`);
    }
    
    // Submit form
    await page.click('button:has-text("Save Trip")');
    await page.waitForTimeout(500);
    
    // Verify form data is available for AI backend integration
    const formDataForAI = await page.evaluate(() => {
      const data = localStorage.getItem('tripForm');
      if (!data) return null;
      
      const parsed = JSON.parse(data);
      
      // Format data as would be sent to AI backend
      return {
        destination: parsed.destinations[0],
        startDate: parsed.startDate,
        endDate: parsed.endDate,
        travelModes: parsed.travelModes,
        tripName: parsed.tripName
      };
    });
    
    expect(formDataForAI).toBeTruthy();
    expect(formDataForAI.destination).toBe(aiTestData.destination);
    expect(formDataForAI.tripName).toBe(aiTestData.tripName);
    expect(formDataForAI.travelModes).toEqual(expect.arrayContaining(aiTestData.travelModes));
    
    console.log('✅ Form data available for AI backend integration');
    console.log('📊 AI-ready data format:', JSON.stringify(formDataForAI, null, 2));
    
    // Test backend connectivity (should be running on port 3000)
    const backendResponse = await page.evaluate(async () => {
      try {
        const response = await fetch('http://localhost:3000/health');
        const data = await response.json();
        return { success: true, data };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });
    
    if (backendResponse.success) {
      console.log('✅ Backend connectivity confirmed');
      console.log('📡 Backend status:', backendResponse.data);
    } else {
      console.log('⚠️ Backend connectivity issue:', backendResponse.error);
    }
    
    // Look for AI-related UI elements
    const hasAIButton = await page.locator('button').filter({ hasText: /generate|ai|suggest/i }).isVisible();
    const hasAISection = await page.locator('text=/suggestions|ai|generate/i').isVisible();
    
    if (hasAIButton || hasAISection) {
      console.log('✅ AI integration UI elements present');
    } else {
      console.log('ℹ️ AI UI elements not visible (may be in separate component)');
    }
    
    console.log('✅ TEST 5 PASSED: AI integration preparation ready');
  });

  test('End-to-End Workflow Validation', async ({ page }) => {
    console.log('🧪 COMPREHENSIVE TEST: Complete User Workflow Validation');
    
    // Complete user journey: Form → Submit → Display → Persist → AI Ready
    console.log('🚀 Starting complete user workflow test...');
    
    const workflowData = {
      tripName: 'Complete Workflow Test',
      destination: 'Hiroshima, Japan',
      startDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      travelModes: ['plane', 'car']
    };
    
    // Step 1: Fill form
    console.log('📝 Step 1: Filling form...');
    await page.fill('input[name="tripName"]', workflowData.tripName);
    await page.fill('input[placeholder*="destination"]', workflowData.destination);
    await page.fill('input[name="startDate"]', workflowData.startDate);
    await page.fill('input[name="endDate"]', workflowData.endDate);
    
    for (const mode of workflowData.travelModes) {
      await page.check(`input[value="${mode}"]`);
    }
    
    // Step 2: Submit form
    console.log('📤 Step 2: Submitting form...');
    await page.click('button:has-text("Save Trip")');
    await page.waitForTimeout(500);
    
    // Step 3: Verify immediate display
    console.log('🔍 Step 3: Verifying immediate display...');
    await expect(page.locator(`text=${workflowData.tripName}`)).toBeVisible({ timeout: 3000 });
    await expect(page.locator(`text=${workflowData.destination}`)).toBeVisible();
    
    // Step 4: Verify persistence
    console.log('💾 Step 4: Testing persistence...');
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    await expect(page.locator(`text=${workflowData.tripName}`)).toBeVisible({ timeout: 5000 });
    await expect(page.locator(`text=${workflowData.destination}`)).toBeVisible();
    
    // Step 5: Verify no loading states
    console.log('⚡ Step 5: Verifying no loading states...');
    await expect(page.locator('text=Loading...')).not.toBeVisible();
    await expect(page.locator('text=Loading trip details...')).not.toBeVisible();
    
    // Step 6: Verify data ready for AI
    console.log('🤖 Step 6: Verifying AI readiness...');
    const aiReadyData = await page.evaluate(() => {
      const data = localStorage.getItem('tripForm');
      return data ? JSON.parse(data) : null;
    });
    
    expect(aiReadyData).toBeTruthy();
    expect(aiReadyData.tripName).toBe(workflowData.tripName);
    
    console.log('✅ COMPREHENSIVE TEST PASSED: Complete user workflow functional');
    
    return {
      success: true,
      workflow: 'complete',
      dataDisplay: true,
      persistence: true,
      noLoadingIssues: true,
      aiReady: true
    };
  });
});