import { test, expect } from '@playwright/test';

/**
 * FUNCTIONAL VALIDATOR: CRITICAL FORM WORKFLOW VALIDATION
 * 
 * This test specifically validates the fix implemented by the architecture analyzer
 * for the form submission → data display workflow.
 * 
 * FOCUS: Test the exact issue that was identified and fixed
 */

test.describe('Critical Form Data Display Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('http://localhost:5183');
    await page.waitForLoadState('networkidle');
    
    // Clear any localStorage data to start fresh
    await page.evaluate(() => {
      try {
        localStorage.clear();
      } catch (e) {
        console.log('Cannot clear localStorage:', e);
      }
    });
  });

  test('CRITICAL: Form Submission Data Display After Architecture Fix', async ({ page }) => {
    console.log('🧪 TESTING: Form submission → data display workflow after architecture fix');
    
    // Step 1: Verify app loads without loading state
    console.log('📋 Step 1: Verifying app loads properly...');
    
    await page.waitForTimeout(2000); // Wait for any initialization
    
    // Check that we're not stuck in loading
    const hasLoadingText = await page.locator('text=Loading...').isVisible();
    console.log(`   - General loading state visible: ${hasLoadingText}`);
    
    // Step 2: Locate and fill form elements
    console.log('📋 Step 2: Locating form elements...');
    
    const tripNameInput = page.locator('input[name="tripName"]');
    const destinationInput = page.locator('input').filter({ hasText: '' }).or(page.locator('input[placeholder*="destination"]')).first();
    const startDateInput = page.locator('input[name="startDate"]');
    const endDateInput = page.locator('input[name="endDate"]');
    const saveButton = page.locator('button').filter({ hasText: /save|submit/i });
    
    // Check visibility with longer timeout
    const tripNameVisible = await tripNameInput.isVisible({ timeout: 10000 });
    const destinationVisible = await destinationInput.isVisible({ timeout: 5000 });
    const startDateVisible = await startDateInput.isVisible({ timeout: 5000 });
    const endDateVisible = await endDateInput.isVisible({ timeout: 5000 });
    const saveButtonVisible = await saveButton.isVisible({ timeout: 5000 });
    
    console.log(`   - Trip name input visible: ${tripNameVisible}`);
    console.log(`   - Destination input visible: ${destinationVisible}`);
    console.log(`   - Start date input visible: ${startDateVisible}`);
    console.log(`   - End date input visible: ${endDateVisible}`);
    console.log(`   - Save button visible: ${saveButtonVisible}`);
    
    // If form elements are not visible, take a screenshot and analyze page content
    if (!tripNameVisible || !saveButtonVisible) {
      await page.screenshot({ path: 'test-results/form-elements-not-visible.png', fullPage: true });
      console.log('📸 Screenshot saved: form-elements-not-visible.png');
      
      const pageText = await page.textContent('body');
      console.log(`📄 Page content (first 500 chars): "${pageText.substring(0, 500)}"`);
      
      const allInputs = await page.$$eval('input', inputs => 
        inputs.map(input => ({
          type: input.type,
          name: input.name,
          placeholder: input.placeholder,
          value: input.value,
          visible: input.offsetParent !== null
        }))
      );
      console.log('🔍 All inputs found:', allInputs);
      
      const allButtons = await page.$$eval('button', buttons => 
        buttons.map(button => ({
          text: button.textContent?.trim(),
          visible: button.offsetParent !== null
        }))
      );
      console.log('🔍 All buttons found:', allButtons);
    }
    
    // Step 3: Fill form data (if elements are visible)
    if (tripNameVisible && saveButtonVisible) {
      console.log('📋 Step 3: Filling form with test data...');
      
      const testData = {
        tripName: 'Workflow Test Trip',
        destination: 'Kyoto, Japan',
        startDate: '2025-08-25',
        endDate: '2025-08-30'
      };
      
      await tripNameInput.fill(testData.tripName);
      console.log(`   - Filled trip name: ${testData.tripName}`);
      
      if (destinationVisible) {
        await destinationInput.fill(testData.destination);
        console.log(`   - Filled destination: ${testData.destination}`);
      }
      
      if (startDateVisible) {
        await startDateInput.fill(testData.startDate);
        console.log(`   - Filled start date: ${testData.startDate}`);
      }
      
      if (endDateVisible) {
        await endDateInput.fill(testData.endDate);
        console.log(`   - Filled end date: ${testData.endDate}`);
      }
      
      // Try to select a travel mode if checkboxes are available
      const planeCheckbox = page.locator('input[value="plane"]');
      if (await planeCheckbox.isVisible({ timeout: 2000 })) {
        await planeCheckbox.check();
        console.log('   - Selected plane travel mode');
      }
      
      // Step 4: Submit the form
      console.log('📋 Step 4: Submitting form...');
      await saveButton.click();
      await page.waitForTimeout(1000); // Wait for form processing
      
      // Step 5: CRITICAL VALIDATION - Check if data displays (not loading state)
      console.log('📋 Step 5: CRITICAL - Validating data display after submission...');
      
      // Wait a moment for any state updates
      await page.waitForTimeout(2000);
      
      // Check for the specific loading state that was problematic
      const hasTripDetailsLoading = await page.locator('text=Loading trip details...').isVisible({ timeout: 1000 });
      console.log(`   - "Loading trip details..." visible: ${hasTripDetailsLoading}`);
      
      // Check if our test data now appears on the page
      const hasTripName = await page.locator(`text=${testData.tripName}`).isVisible({ timeout: 5000 });
      const hasDestination = await page.locator(`text=${testData.destination}`).isVisible({ timeout: 3000 });
      const hasStartDate = await page.locator(`text=${testData.startDate}`).isVisible({ timeout: 3000 });
      
      console.log(`   - Trip name "${testData.tripName}" displays: ${hasTripName}`);
      console.log(`   - Destination "${testData.destination}" displays: ${hasDestination}`);
      console.log(`   - Start date "${testData.startDate}" displays: ${hasStartDate}`);
      
      // Step 6: Validate the fix worked
      console.log('📋 Step 6: Validating architecture fix effectiveness...');
      
      const dataDisplays = hasTripName || hasDestination || hasStartDate;
      const noLoadingState = !hasTripDetailsLoading;
      
      console.log(`   - Form data displays after submission: ${dataDisplays}`);
      console.log(`   - No persistent loading state: ${noLoadingState}`);
      
      // Take a screenshot of the final state
      await page.screenshot({ path: 'test-results/after-form-submission.png', fullPage: true });
      console.log('📸 Screenshot saved: after-form-submission.png');
      
      // CRITICAL ASSERTIONS for the architecture fix
      if (noLoadingState && dataDisplays) {
        console.log('✅ ARCHITECTURE FIX SUCCESSFUL: Form data displays properly after submission');
      } else if (!noLoadingState) {
        console.log('❌ ARCHITECTURE FIX FAILED: Still showing loading state after form submission');
      } else if (!dataDisplays) {
        console.log('⚠️ ARCHITECTURE FIX PARTIAL: No loading state but data not displaying');
      }
      
      // Test assertions
      expect(hasTripDetailsLoading).toBe(false); // Critical: No loading state after submission
      expect(dataDisplays).toBe(true); // Critical: Data should display
      
    } else {
      console.log('❌ CRITICAL ISSUE: Form elements not visible - cannot test workflow');
      throw new Error('Form elements not visible - core UI issue');
    }
    
    console.log('✅ CRITICAL WORKFLOW TEST COMPLETE');
  });

  test('Context State Flow Validation', async ({ page }) => {
    console.log('🧪 TESTING: TripFormContext state flow after form submission');
    
    await page.goto('http://localhost:5183');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Fill and submit a simple form
    const tripNameInput = page.locator('input[name="tripName"]');
    const saveButton = page.locator('button').filter({ hasText: /save/i });
    
    if (await tripNameInput.isVisible({ timeout: 5000 }) && await saveButton.isVisible({ timeout: 5000 })) {
      await tripNameInput.fill('Context Test Trip');
      
      // Select travel mode if available
      const walkingCheckbox = page.locator('input[value="walking"]');
      if (await walkingCheckbox.isVisible({ timeout: 2000 })) {
        await walkingCheckbox.check();
      }
      
      await saveButton.click();
      await page.waitForTimeout(1000);
      
      // Verify the context state updated by checking if data appears
      const hasContextData = await page.locator('text=Context Test Trip').isVisible({ timeout: 5000 });
      console.log(`   - TripFormContext state updated: ${hasContextData}`);
      
      expect(hasContextData).toBe(true);
      
    } else {
      console.log('⚠️ Cannot test context flow - form elements not visible');
    }
  });

  test('Page Refresh Data Persistence', async ({ page }) => {
    console.log('🧪 TESTING: Data persistence across page refresh');
    
    await page.goto('http://localhost:5183');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Set test data directly in localStorage to ensure it's there
    await page.evaluate(() => {
      const testData = {
        tripName: 'Persistence Test Trip',
        startDate: '2025-09-01',
        endDate: '2025-09-05',
        destinations: ['Nara, Japan'],
        travelModes: ['train'],
        preferences: [],
        step: 2
      };
      try {
        localStorage.setItem('tripForm', JSON.stringify(testData));
      } catch (e) {
        console.log('Cannot set localStorage:', e);
      }
    });
    
    // Refresh the page
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000); // Wait for context to load from localStorage
    
    // Check if persisted data displays
    const hasPersistedTrip = await page.locator('text=Persistence Test Trip').isVisible({ timeout: 10000 });
    const hasPersistedDestination = await page.locator('text=Nara, Japan').isVisible({ timeout: 5000 });
    const hasPersistedMode = await page.locator('text=train').isVisible({ timeout: 5000 });
    
    console.log(`   - Persisted trip name displays: ${hasPersistedTrip}`);
    console.log(`   - Persisted destination displays: ${hasPersistedDestination}`);
    console.log(`   - Persisted travel mode displays: ${hasPersistedMode}`);
    
    // Critical: Should not show loading state with persisted data
    const hasLoadingState = await page.locator('text=Loading trip details...').isVisible({ timeout: 2000 });
    console.log(`   - No loading state with persisted data: ${!hasLoadingState}`);
    
    const dataDisplays = hasPersistedTrip || hasPersistedDestination || hasPersistedMode;
    expect(dataDisplays).toBe(true);
    expect(hasLoadingState).toBe(false);
  });
});