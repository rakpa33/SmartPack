/**
 * FUNCTIONAL VALIDATOR: Ship Readiness Assessment Test
 * Testing critical MainLayout behavior issue identified by bug-crusher
 */

import { test, expect } from '@playwright/test';

test.describe('Ship Readiness Validation: MainLayout State Management', () => {
  test('CRITICAL: Form submission state disconnect - first-time user workflow', async ({ page }) => {
    console.log('🧪 Testing critical ship blocker: MainLayout state disconnect after form submission');
    
    // Navigate to application
    await page.goto('http://localhost:5177');
    
    // Wait for app to load
    await page.waitForSelector('[data-testid="trip-details-section"]', { timeout: 10000 });
    
    // STEP 1: Verify first-time user state
    console.log('📋 Step 1: Checking first-time user state');
    
    // Should be in editing mode automatically for first-time users
    const editForm = page.locator('form.space-y-6');
    await expect(editForm).toBeVisible();
    console.log('✅ Form is visible (expected for first-time users)');
    
    // Check if bottom navigation is hidden (first-time user behavior)
    const bottomNav = page.locator('[data-testid="bottom-navigation"]');
    const isBottomNavVisible = await bottomNav.isVisible().catch(() => false);
    console.log(`📱 Bottom navigation visible: ${isBottomNavVisible} (should be false for first-time users)`);
    
    // STEP 2: Fill out complete form
    console.log('📝 Step 2: Filling out complete trip form');
    
    await page.fill('#tripName', 'Tokyo Adventure');
    await page.fill('[data-testid="destination-input-0"]', 'Tokyo');
    
    // Trigger blur event to test geocoding
    await page.click('#tripName'); // Click somewhere else to trigger blur
    await page.waitForTimeout(2000); // Wait for potential geocoding
    
    // Check if destination was updated via geocoding
    const destinationValue = await page.inputValue('[data-testid="destination-input-0"]');
    console.log(`🌏 Destination after blur: "${destinationValue}" (should be enhanced if geocoding works)`);
    
    // Select travel modes
    await page.check('input[type="checkbox"][value="Plane"]').catch(() => {
      // Try alternative selector if the first doesn't work
      page.locator('label:has-text("Plane") input').check();
    });
    
    // Set dates
    const today = new Date();
    const startDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000); // 1 week from now
    const endDate = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000); // 2 weeks from now
    
    await page.fill('#startDate', startDate.toISOString().split('T')[0]);
    await page.fill('#endDate', endDate.toISOString().split('T')[0]);
    
    console.log('✅ Form filled with all required data');
    
    // STEP 3: Submit form and observe behavior
    console.log('💾 Step 3: Submitting form and checking state changes');
    
    // Get current localStorage state before submission
    const stateBefore = await page.evaluate(() => {
      const saved = localStorage.getItem('tripForm');
      return saved ? JSON.parse(saved) : null;
    });
    console.log('📊 TripForm state before submission:', stateBefore);
    
    // Submit the form
    await page.click('button[type="submit"]:has-text("Save")');
    console.log('🚀 Form submitted');
    
    // Wait a moment for state updates
    await page.waitForTimeout(1000);
    
    // STEP 4: Validate state after submission
    console.log('🔍 Step 4: Validating state after form submission');
    
    // Check if form is still visible (it should be closed if working correctly)
    const isFormStillVisible = await editForm.isVisible().catch(() => false);
    console.log(`📝 Form still visible after save: ${isFormStillVisible} (should be false if working)`);
    
    // Get localStorage state after submission
    const stateAfter = await page.evaluate(() => {
      const saved = localStorage.getItem('tripForm');
      return saved ? JSON.parse(saved) : null;
    });
    console.log('📊 TripForm state after submission:', stateAfter);
    
    // Check if bottom navigation appeared (indicating successful state update)
    await page.waitForTimeout(1000);
    const isBottomNavVisibleAfter = await bottomNav.isVisible().catch(() => false);
    console.log(`📱 Bottom navigation visible after save: ${isBottomNavVisibleAfter} (should be true if state updated)`);
    
    // STEP 5: Critical bug validation
    console.log('🚨 Step 5: Critical bug validation');
    
    const criticalIssues = [];
    
    // Issue 1: Check if form state was actually saved to context
    if (stateAfter && stateAfter.tripName === 'Tokyo Adventure') {
      console.log('✅ TripForm context state was updated with form data');
    } else {
      console.log('❌ CRITICAL: TripForm context state was NOT updated');
      criticalIssues.push('Form data not saved to context state');
    }
    
    // Issue 2: Check if MainLayout behavior changed
    if (isBottomNavVisibleAfter && !isBottomNavVisible) {
      console.log('✅ MainLayout behavior changed correctly (bottom nav appeared)');
    } else {
      console.log('❌ CRITICAL: MainLayout behavior did NOT change after form submission');
      criticalIssues.push('MainLayout still thinks user is first-time user after form submission');
    }
    
    // Issue 3: Check if form closed properly
    if (!isFormStillVisible) {
      console.log('✅ Form closed properly after submission');
    } else {
      console.log('⚠️ Form still visible after submission (may indicate incomplete save)');
      criticalIssues.push('Form did not close after save');
    }
    
    // STEP 6: Ship readiness assessment
    console.log('⚖️ Step 6: Ship readiness assessment');
    
    if (criticalIssues.length === 0) {
      console.log('🚢 SHIP READY: All critical user workflow issues resolved');
    } else {
      console.log(`❌ CANNOT SHIP: ${criticalIssues.length} critical issues found:`);
      criticalIssues.forEach((issue, i) => {
        console.log(`   ${i + 1}. ${issue}`);
      });
    }
    
    // Expect no critical issues for shipping
    expect(criticalIssues).toHaveLength(0);
  });
  
  test('VALIDATION: Geocoding functionality test', async ({ page }) => {
    console.log('🌍 Testing geocoding functionality separately');
    
    await page.goto('http://localhost:5177');
    await page.waitForSelector('[data-testid="destination-input-0"]');
    
    // Test geocoding with Osaka
    await page.fill('[data-testid="destination-input-0"]', 'Osaka');
    console.log('📍 Entered "Osaka" in destination field');
    
    // Trigger blur event
    await page.click('#tripName');
    console.log('🔄 Triggered blur event');
    
    // Wait for potential geocoding
    await page.waitForTimeout(3000);
    
    // Check result
    const finalValue = await page.inputValue('[data-testid="destination-input-0"]');
    console.log(`🎯 Final destination value: "${finalValue}"`);
    
    if (finalValue !== 'Osaka') {
      console.log('✅ Geocoding worked - destination was enhanced');
    } else {
      console.log('❌ Geocoding failed - destination unchanged');
    }
  });
});