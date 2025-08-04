import { test, expect } from '@playwright/test';

test.describe('Column Visibility Fix Validation', () => {
  test('should show Packing Checklist and AI Suggestions columns after saving valid trip data', async ({ page }) => {
    // Step 1: Navigate to app and clear localStorage to simulate first-time user
    await page.goto('http://localhost:5185');
    await page.evaluate(() => {
      localStorage.clear();
      console.log('✅ localStorage cleared for test');
    });
    
    // Reload to ensure clean first-time user state
    await page.reload();
    await page.waitForTimeout(500);

    // Step 2: Verify initial state - only Trip Details column should be visible
    console.log('🔍 Checking initial column visibility...');
    
    const tripDetailsVisible = await page.isVisible('[data-testid="trip-details-section"]');
    const packingListVisible = await page.isVisible('[data-testid="packing-list-section"]');
    const suggestionsVisible = await page.isVisible('[data-testid="ai-suggestions-section"]');
    
    console.log('Initial state:');
    console.log('  - Trip Details visible:', tripDetailsVisible);
    console.log('  - Packing List visible:', packingListVisible); 
    console.log('  - AI Suggestions visible:', suggestionsVisible);
    
    expect(tripDetailsVisible).toBe(true);
    expect(packingListVisible).toBe(false);
    expect(suggestionsVisible).toBe(false);

    // Step 3: Fill out the trip form with valid data
    console.log('📝 Filling out trip form...');
    
    // Trip name
    await page.fill('input[id="tripName"]', 'Test Trip to Tokyo');
    
    // Start date
    await page.fill('input[type="date"]', '2025-01-15');
    
    // End date  
    await page.fill('input[type="date"]:nth-of-type(2)', '2025-01-22');
    
    // Destination
    await page.fill('input[placeholder*="destination" i]', 'Tokyo, Japan');
    
    // Travel modes
    await page.click('text=Flight');
    await page.click('text=Train');
    
    // Preferences (if available)
    const preferencesInput = page.locator('input[placeholder*="preference" i]').first();
    if (await preferencesInput.isVisible()) {
      await preferencesInput.fill('Business travel');
    }

    // Step 4: Click Save button
    console.log('💾 Clicking Save button...');
    await page.click('button:has-text("Save")');
    
    // Wait for form to be saved and state updates to propagate
    await page.waitForTimeout(500);

    // Step 5: Check localStorage to verify data was saved
    const tripFormData = await page.evaluate(() => {
      const data = localStorage.getItem('tripForm');
      console.log('📊 Trip form data in localStorage:', data);
      return data ? JSON.parse(data) : null;
    });
    
    expect(tripFormData).toBeTruthy();
    expect(tripFormData.tripName).toBe('Test Trip to Tokyo');
    expect(tripFormData.destinations).toContain('Tokyo, Japan');
    expect(tripFormData.travelModes.length).toBeGreaterThan(0);

    // Step 6: Verify that columns are now visible
    console.log('🔍 Checking column visibility after save...');
    
    // Wait a bit more for column visibility changes to take effect
    await page.waitForTimeout(300);
    
    const tripDetailsAfter = await page.isVisible('[data-testid="trip-details-section"]');
    const packingListAfter = await page.isVisible('[data-testid="packing-list-section"]');
    const suggestionsAfter = await page.isVisible('[data-testid="ai-suggestions-section"]');
    
    console.log('After save:');
    console.log('  - Trip Details visible:', tripDetailsAfter);
    console.log('  - Packing List visible:', packingListAfter);
    console.log('  - AI Suggestions visible:', suggestionsAfter);

    // Step 7: Verify the fix worked
    expect(tripDetailsAfter).toBe(true);
    expect(packingListAfter).toBe(true); // This should now be true!
    expect(suggestionsAfter).toBe(true);  // This should now be true!

    // Step 8: Check localStorage column visibility state
    const columnVisibility = await page.evaluate(() => {
      const data = localStorage.getItem('smartpack-column-visibility');
      console.log('📊 Column visibility in localStorage:', data);
      return data ? JSON.parse(data) : null;
    });
    
    if (columnVisibility) {
      expect(columnVisibility.tripDetails).toBe(true);
      expect(columnVisibility.packingChecklist).toBe(true);
      expect(columnVisibility.suggestions).toBe(true);
    }

    console.log('✅ Test completed successfully!');
  });
});