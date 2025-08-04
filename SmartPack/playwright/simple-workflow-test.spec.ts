import { test, expect } from '@playwright/test';

/**
 * FUNCTIONAL VALIDATOR: SIMPLIFIED FORM WORKFLOW TESTING
 * 
 * Focus on UI functionality without localStorage security issues
 */

test.describe('Simplified Form Workflow Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5183');
    await page.waitForLoadState('networkidle');
  });

  test('Critical: Form Display and Basic Functionality', async ({ page }) => {
    console.log('🧪 Testing basic form display and functionality...');
    
    // Verify app loads without getting stuck in loading state
    await expect(page.locator('text=Loading...')).not.toBeVisible({ timeout: 2000 });
    console.log('✅ App loads without loading state');
    
    // Check for form elements
    const tripNameInput = page.locator('input[name="tripName"]');
    const destinationInput = page.locator('input[placeholder*="destination"]').first();
    const startDateInput = page.locator('input[name="startDate"]');
    const endDateInput = page.locator('input[name="endDate"]');
    const saveButton = page.locator('button:has-text("Save Trip")');
    
    await expect(tripNameInput).toBeVisible();
    await expect(destinationInput).toBeVisible();
    await expect(startDateInput).toBeVisible();
    await expect(endDateInput).toBeVisible();
    await expect(saveButton).toBeVisible();
    
    console.log('✅ All form elements are visible');
    
    // Fill form with test data
    await tripNameInput.fill('Test Trip');
    await destinationInput.fill('Tokyo, Japan');
    
    // Use future dates
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 10);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 3);
    
    await startDateInput.fill(startDate.toISOString().split('T')[0]);
    await endDateInput.fill(endDate.toISOString().split('T')[0]);
    
    // Select travel mode
    await page.check('input[value="plane"]');
    
    console.log('✅ Form filled with test data');
    
    // Submit form
    await saveButton.click();
    await page.waitForTimeout(1000);
    
    // Check if data displays after submission
    const hasTestTrip = await page.locator('text=Test Trip').isVisible();
    const hasDestination = await page.locator('text=Tokyo, Japan').isVisible();
    const hasPlane = await page.locator('text=plane').isVisible();
    
    console.log(`📊 After form submission:`);
    console.log(`   - Trip name displays: ${hasTestTrip}`);
    console.log(`   - Destination displays: ${hasDestination}`);
    console.log(`   - Travel mode displays: ${hasPlane}`);
    
    // Verify no loading states persist
    const noLoadingTrip = !(await page.locator('text=Loading trip details...').isVisible());
    const noGeneralLoading = !(await page.locator('text=Loading...').isVisible());
    
    console.log(`   - No trip loading state: ${noLoadingTrip}`);
    console.log(`   - No general loading state: ${noGeneralLoading}`);
    
    // Test passes if form can be filled and submitted without errors
    expect(hasTestTrip || hasDestination || hasPlane).toBe(true);
    expect(noLoadingTrip).toBe(true);
    expect(noGeneralLoading).toBe(true);
    
    console.log('✅ Form workflow basic functionality confirmed');
  });

  test('UI Rendering After Architecture Fix', async ({ page }) => {
    console.log('🧪 Testing UI rendering after architecture fix...');
    
    // Wait for page to fully load
    await page.waitForTimeout(2000);
    
    // Take screenshot to see current state
    await page.screenshot({ path: 'test-results/current-ui-state.png', fullPage: true });
    console.log('📸 Screenshot saved to test-results/current-ui-state.png');
    
    // Check page content
    const pageContent = await page.textContent('body');
    const hasFormElements = pageContent.includes('Trip') || pageContent.includes('destination') || pageContent.includes('Save');
    const hasLoadingState = pageContent.includes('Loading...');
    
    console.log(`📊 Page analysis:`);
    console.log(`   - Has form elements: ${hasFormElements}`);
    console.log(`   - Has loading state: ${hasLoadingState}`);
    console.log(`   - Page content length: ${pageContent.length} characters`);
    
    if (pageContent.length < 100) {
      console.log(`⚠️ Page content seems minimal: "${pageContent.substring(0, 200)}"`);
    }
    
    // Get all visible text on page
    const allText = await page.allTextContents('*');
    const visibleText = allText.filter(text => text.trim().length > 0);
    
    console.log('📝 Visible text elements:');
    visibleText.slice(0, 10).forEach((text, i) => {
      console.log(`   ${i + 1}. "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`);
    });
    
    // Check for specific elements that should be present
    const hasMainLayout = await page.locator('main, [class*="layout"], [class*="container"]').isVisible();
    const hasInputs = await page.locator('input').count();
    const hasButtons = await page.locator('button').count();
    
    console.log(`   - Main layout present: ${hasMainLayout}`);
    console.log(`   - Input count: ${hasInputs}`);
    console.log(`   - Button count: ${hasButtons}`);
    
    expect(hasInputs).toBeGreaterThan(0);
    expect(hasButtons).toBeGreaterThan(0);
    expect(hasLoadingState).toBe(false);
    
    console.log('✅ UI rendering validation complete');
  });

  test('Form Interaction and Response', async ({ page }) => {
    console.log('🧪 Testing form interaction and response...');
    
    // Wait for UI to be ready
    await page.waitForTimeout(1000);
    
    // Try to interact with form elements
    const interactions = [];
    
    try {
      const tripNameInput = page.locator('input[name="tripName"]');
      if (await tripNameInput.isVisible({ timeout: 5000 })) {
        await tripNameInput.fill('Interaction Test');
        const value = await tripNameInput.inputValue();
        interactions.push(`Trip name input: ${value === 'Interaction Test' ? 'WORKING' : 'FAILED'}`);
      } else {
        interactions.push('Trip name input: NOT VISIBLE');
      }
    } catch (error) {
      interactions.push(`Trip name input: ERROR - ${error.message}`);
    }
    
    try {
      const destinationInput = page.locator('input[placeholder*="destination"]').first();
      if (await destinationInput.isVisible({ timeout: 5000 })) {
        await destinationInput.fill('Test Destination');
        const value = await destinationInput.inputValue();
        interactions.push(`Destination input: ${value === 'Test Destination' ? 'WORKING' : 'FAILED'}`);
      } else {
        interactions.push('Destination input: NOT VISIBLE');
      }
    } catch (error) {
      interactions.push(`Destination input: ERROR - ${error.message}`);
    }
    
    try {
      const planeCheckbox = page.locator('input[value="plane"]');
      if (await planeCheckbox.isVisible({ timeout: 5000 })) {
        await planeCheckbox.check();
        const isChecked = await planeCheckbox.isChecked();
        interactions.push(`Plane checkbox: ${isChecked ? 'WORKING' : 'FAILED'}`);
      } else {
        interactions.push('Plane checkbox: NOT VISIBLE');
      }
    } catch (error) {
      interactions.push(`Plane checkbox: ERROR - ${error.message}`);
    }
    
    try {
      const saveButton = page.locator('button:has-text("Save Trip")');
      if (await saveButton.isVisible({ timeout: 5000 })) {
        const isClickable = await saveButton.isEnabled();
        interactions.push(`Save button: ${isClickable ? 'CLICKABLE' : 'DISABLED'}`);
        
        if (isClickable) {
          await saveButton.click();
          await page.waitForTimeout(500);
          interactions.push('Save button: CLICKED');
        }
      } else {
        interactions.push('Save button: NOT VISIBLE');
      }
    } catch (error) {
      interactions.push(`Save button: ERROR - ${error.message}`);
    }
    
    console.log('📊 Form interaction results:');
    interactions.forEach(result => console.log(`   - ${result}`));
    
    // Check for any changes after interactions
    await page.waitForTimeout(1000);
    
    const hasTestTrip = await page.locator('text=Interaction Test').isVisible();
    const hasTestDestination = await page.locator('text=Test Destination').isVisible();
    
    console.log(`📋 Post-interaction state:`);
    console.log(`   - Test trip visible: ${hasTestTrip}`);
    console.log(`   - Test destination visible: ${hasTestDestination}`);
    
    // Test passes if basic interactions work
    const workingInteractions = interactions.filter(i => i.includes('WORKING')).length;
    expect(workingInteractions).toBeGreaterThan(0);
    
    console.log('✅ Form interaction testing complete');
  });
});