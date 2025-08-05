import { test, expect } from '@playwright/test';

test.describe('Osaka Autocomplete Manual Testing', () => {
  test('Manual test: Osaka destination autocomplete behavior', async ({ page }) => {
    console.log('🔍 FIRSTHAND TESTING: Starting Osaka autocomplete investigation...');
    
    // Navigate to the app
    await page.goto('http://localhost:5177');
    console.log('📱 Navigated to http://localhost:5177');
    
    // Wait for app to load
    await page.waitForTimeout(2000);
    
    // Take screenshot of initial state
    await page.screenshot({ path: 'osaka-test-1-initial.png', fullPage: true });
    console.log('📸 Screenshot 1: Initial app state');
    
    // Find the destination input field
    const destinationInput = await page.locator('input[name="destinations"], input[placeholder*="destination" i], input[id*="destination" i]').first();
    
    if (await destinationInput.count() === 0) {
      console.log('❌ Destination input not found on initial page');
      
      // Look for navigation to trip form
      const tripButton = await page.locator('button:has-text("Create New Trip"), a:has-text("Create"), button:has-text("New Trip")').first();
      if (await tripButton.count() > 0) {
        console.log('🔗 Found trip creation button, clicking...');
        await tripButton.click();
        await page.waitForTimeout(1000);
        await page.screenshot({ path: 'osaka-test-2-after-navigation.png', fullPage: true });
        console.log('📸 Screenshot 2: After navigation to trip form');
      }
    }
    
    // Try to find destination input again
    const destInput = await page.locator('input[name="destinations"], input[placeholder*="destination" i], input[id*="destination" i]').first();
    
    if (await destInput.count() === 0) {
      console.log('❌ CRITICAL: Cannot find destination input field');
      await page.screenshot({ path: 'osaka-test-error-no-input.png', fullPage: true });
      console.log('📄 Page HTML:', await page.content());
      return;
    }
    
    console.log('✅ Found destination input field');
    
    // MAIN TEST: Enter "Osaka" and trigger blur
    console.log('🧪 MAIN TEST: Entering "Osaka" in destination field...');
    
    // Clear any existing value
    await destInput.click();
    await destInput.clear();
    
    // Enter "Osaka"
    await destInput.fill('Osaka');
    const valueAfterInput = await destInput.inputValue();
    console.log('📝 Value after entering "Osaka":', valueAfterInput);
    
    // Take screenshot before blur
    await page.screenshot({ path: 'osaka-test-3-before-blur.png', fullPage: true });
    console.log('📸 Screenshot 3: Before blur event');
    
    // Trigger blur by clicking elsewhere (body or another element)
    await page.click('body');
    console.log('🔄 Triggered blur event by clicking on body');
    
    // Wait for any async operations (geocoding API calls)
    await page.waitForTimeout(3000);
    
    // Check the value after blur
    const valueAfterBlur = await destInput.inputValue();
    console.log('📊 CRITICAL RESULT: Value after blur:', valueAfterBlur);
    
    // Take screenshot after blur
    await page.screenshot({ path: 'osaka-test-4-after-blur.png', fullPage: true });
    console.log('📸 Screenshot 4: After blur event');
    
    // Log the comparison
    console.log('🔍 COMPARISON:');
    console.log('  - Before blur: "' + valueAfterInput + '"');
    console.log('  - After blur:  "' + valueAfterBlur + '"');
    console.log('  - Expected:    "Osaka, Japan"');
    
    if (valueAfterBlur === 'Osaka, Japan') {
      console.log('✅ SUCCESS: Autocomplete working correctly');
    } else if (valueAfterBlur === 'Osaka') {
      console.log('❌ ISSUE CONFIRMED: Autocomplete not working - value unchanged');
    } else {
      console.log('⚠️  UNEXPECTED: Value changed to something unexpected');
    }
    
    // Test other cities for comparison
    console.log('🧪 COMPARISON TESTS: Testing other cities...');
    
    const testCities = ['Tokyo', 'Paris', 'London'];
    for (const city of testCities) {
      console.log(`🌍 Testing "${city}"...`);
      await destInput.click();
      await destInput.clear();
      await destInput.fill(city);
      await page.click('body');
      await page.waitForTimeout(2000);
      const result = await destInput.inputValue();
      console.log(`📊 "${city}" result: "${result}"`);
    }
    
    // Check for console errors or logs
    const logs = await page.evaluate(() => {
      // @ts-ignore
      return window.testLogs || [];
    });
    
    console.log('📋 Browser console activity during test:', logs);
    
    console.log('✅ FIRSTHAND TESTING COMPLETE');
    console.log('📊 SUMMARY:');
    console.log('  - Osaka input result:', valueAfterBlur);
    console.log('  - Issue reproduced:', valueAfterBlur !== 'Osaka, Japan');
    console.log('  - App accessible:', 'Yes');
    console.log('  - Form functional:', 'Testing completed');
  });
});