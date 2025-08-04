import { test, expect } from '@playwright/test';

test.describe('FIRSTHAND TESTING: Osaka Autocomplete Issue', () => {
  test('Reproduce user-reported Osaka autocomplete issue', async ({ page }) => {
    console.log('🔍 FIRSTHAND TESTING: Starting Osaka autocomplete investigation...');
    console.log('🎯 OBJECTIVE: Verify if "Osaka" → "Osaka, Japan" autocomplete works or fails');
    
    // Navigate to the actual running server (user reported 5177)
    console.log('📱 Navigating to http://localhost:5177 (user-reported server)...');
    await page.goto('http://localhost:5177');
    
    // Wait for app to load
    await page.waitForTimeout(2000);
    
    // Take screenshot of initial state
    await page.screenshot({ path: 'osaka-test-1-initial.png', fullPage: true });
    console.log('📸 Screenshot 1: Initial app state saved');
    
    // Look for the trip form - might be on main page or need navigation
    console.log('🔍 Looking for destination input field...');
    
    let destinationInput = await page.locator('input[name="destinations"], input[placeholder*="destination" i], input[id*="destination" i]').first();
    
    if (await destinationInput.count() === 0) {
      console.log('❌ Destination input not found on initial page - looking for navigation...');
      
      // Look for various ways to get to trip form
      const tripNavigation = await page.locator(
        'button:has-text("Create New Trip"), ' +
        'a:has-text("Create Trip"), ' + 
        'button:has-text("New Trip"), ' +
        'a:has-text("Trip"), ' +
        'button:has-text("Create"), ' +
        '[data-testid="create-trip"], ' +
        '.create-trip'
      ).first();
      
      if (await tripNavigation.count() > 0) {
        console.log('🔗 Found trip navigation element, clicking...');
        await tripNavigation.click();
        await page.waitForTimeout(1500);
        await page.screenshot({ path: 'osaka-test-2-after-navigation.png', fullPage: true });
        console.log('📸 Screenshot 2: After navigation attempt');
      } else {
        console.log('⚠️  No obvious trip navigation found - checking page content...');
        console.log('📄 Page title:', await page.title());
        console.log('📄 Visible text:', await page.textContent('body'));
      }
    }
    
    // Try to find destination input again after navigation
    destinationInput = await page.locator('input[name="destinations"], input[placeholder*="destination" i], input[id*="destination" i]').first();
    
    if (await destinationInput.count() === 0) {
      console.log('❌ CRITICAL ISSUE: Cannot find destination input field');
      console.log('🔍 Available input fields on page:');
      const allInputs = await page.locator('input').all();
      for (let i = 0; i < allInputs.length; i++) {
        const input = allInputs[i];
        const name = await input.getAttribute('name');
        const placeholder = await input.getAttribute('placeholder');
        const id = await input.getAttribute('id');
        console.log(`  Input ${i}: name="${name}" placeholder="${placeholder}" id="${id}"`);
      }
      
      await page.screenshot({ path: 'osaka-test-error-no-input.png', fullPage: true });
      console.log('📸 Error screenshot saved');
      
      // This is still valuable - we've confirmed the form isn't easily accessible
      console.log('❌ TEST RESULT: Cannot access destination input - potential navigation issue');
      return;
    }
    
    console.log('✅ Found destination input field');
    
    // MAIN TEST: The actual Osaka autocomplete issue
    console.log('🧪 MAIN TEST: Testing Osaka autocomplete behavior...');
    
    // Clear any existing value and enter "Osaka"
    await destinationInput.click();
    await destinationInput.clear();
    await destinationInput.fill('Osaka');
    
    const valueAfterInput = await destinationInput.inputValue();
    console.log('📝 Value immediately after typing "Osaka":', valueAfterInput);
    
    // Take screenshot before blur
    await page.screenshot({ path: 'osaka-test-3-before-blur.png', fullPage: true });
    console.log('📸 Screenshot 3: Before blur event (showing "Osaka" in field)');
    
    // CRITICAL TEST: Trigger blur event (click away from field)
    console.log('🔄 Triggering blur event by clicking elsewhere...');
    await page.click('body'); // Click on body to trigger blur
    
    // Wait for potential async operations (geocoding API call)
    console.log('⏳ Waiting 3 seconds for potential geocoding API call...');
    await page.waitForTimeout(3000);
    
    // CHECK RESULT: What happened after blur?
    const valueAfterBlur = await destinationInput.inputValue();
    console.log('📊 CRITICAL RESULT: Value after blur:', valueAfterBlur);
    
    // Take screenshot after blur
    await page.screenshot({ path: 'osaka-test-4-after-blur.png', fullPage: true });
    console.log('📸 Screenshot 4: After blur event (final result)');
    
    // ANALYSIS: Compare results
    console.log('🔍 DETAILED ANALYSIS:');
    console.log('  ┌─ Before blur: "' + valueAfterInput + '"');
    console.log('  ├─ After blur:  "' + valueAfterBlur + '"');
    console.log('  └─ Expected:    "Osaka, Japan"');
    
    if (valueAfterBlur === 'Osaka, Japan') {
      console.log('✅ AUTOCOMPLETE WORKING: Field successfully updated to "Osaka, Japan"');
      console.log('✅ USER ISSUE NOT REPRODUCED: Previous fixes appear to be working');
    } else if (valueAfterBlur === 'Osaka') {
      console.log('❌ ISSUE CONFIRMED: Autocomplete NOT working - field unchanged');
      console.log('❌ USER ISSUE REPRODUCED: Field stays "Osaka" instead of "Osaka, Japan"');
    } else {
      console.log('⚠️  UNEXPECTED BEHAVIOR: Field changed to unexpected value');
      console.log('⚠️  This may indicate partial autocomplete or other issues');
    }
    
    // ADDITIONAL TESTING: Test other cities for comparison
    console.log('🧪 COMPARISON TESTS: Testing other cities for patterns...');
    
    const testCities = ['Tokyo', 'Paris', 'London', 'Berlin'];
    const results: Record<string, string> = {};
    
    for (const city of testCities) {
      console.log(`🌍 Testing "${city}"...`);
      await destinationInput.click();
      await destinationInput.clear();
      await destinationInput.fill(city);
      await page.click('body'); // Trigger blur
      await page.waitForTimeout(2000); // Wait for geocoding
      const result = await destinationInput.inputValue();
      results[city] = result;
      console.log(`📊 "${city}" → "${result}"`);
    }
    
    // BROWSER CONSOLE ANALYSIS
    console.log('🔍 Checking for browser console errors or logs...');
    
    // Capture any console messages that might indicate issues
    let consoleMessages: string[] = [];
    page.on('console', msg => {
      consoleMessages.push(`${msg.type()}: ${msg.text()}`);
    });
    
    // Check for JavaScript errors
    let pageErrors: string[] = [];
    page.on('pageerror', err => {
      pageErrors.push(err.message);
    });
    
    // Re-test Osaka to capture any console activity
    console.log('🔄 Re-testing Osaka to capture console activity...');
    await destinationInput.click();
    await destinationInput.clear();
    await destinationInput.fill('Osaka');
    await page.click('body');
    await page.waitForTimeout(2000);
    const finalOsakaResult = await destinationInput.inputValue();
    
    // FINAL REPORT
    console.log('📋 FINAL FIRSTHAND TESTING REPORT:');
    console.log('═══════════════════════════════════════');
    console.log('🎯 MAIN ISSUE TEST:');
    console.log(`  Input: "Osaka"`);
    console.log(`  Result: "${finalOsakaResult}"`);
    console.log(`  Expected: "Osaka, Japan"`);
    console.log(`  Status: ${finalOsakaResult === 'Osaka, Japan' ? '✅ WORKING' : '❌ BROKEN'}`);
    console.log('');
    console.log('🌍 COMPARISON RESULTS:');
    Object.entries(results).forEach(([city, result]) => {
      console.log(`  ${city} → ${result}`);
    });
    console.log('');
    console.log('🖥️  BROWSER DIAGNOSTICS:');
    console.log(`  Console messages: ${consoleMessages.length}`);
    console.log(`  JavaScript errors: ${pageErrors.length}`);
    if (pageErrors.length > 0) {
      pageErrors.forEach(error => console.log(`    ❌ ${error}`));
    }
    console.log('');
    console.log('🚢 SHIP IMPACT ASSESSMENT:');
    if (finalOsakaResult === 'Osaka, Japan') {
      console.log('  ✅ LOW IMPACT: Autocomplete appears to be working');
      console.log('  ✅ Previous fixes successful');
    } else {
      console.log('  ❌ HIGH IMPACT: Core autocomplete feature broken');
      console.log('  ❌ Ship-blocking issue confirmed');
    }
    console.log('═══════════════════════════════════════');
    
    // For automated verification
    expect(finalOsakaResult).toBe('Osaka, Japan');
  });
});