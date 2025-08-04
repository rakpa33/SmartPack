import { test, expect } from '@playwright/test';

test.describe('Debug Osaka Console Logs', () => {
  test('Capture all console activity during Osaka autocomplete', async ({ page }) => {
    console.log('🔍 DEBUGGING: Capturing all console activity for Osaka autocomplete...');
    
    // Set up console message capturing
    const consoleMessages: string[] = [];
    const errorMessages: string[] = [];
    const networkRequests: string[] = [];
    
    page.on('console', msg => {
      const message = `[${msg.type()}] ${msg.text()}`;
      consoleMessages.push(message);
      console.log('🖥️  Browser console:', message);
    });
    
    page.on('pageerror', err => {
      const error = `Page error: ${err.message}`;
      errorMessages.push(error);
      console.log('❌ Page error:', error);
    });
    
    page.on('request', request => {
      const url = request.url();
      if (url.includes('nominatim') || url.includes('geocode')) {
        networkRequests.push(`REQUEST: ${request.method()} ${url}`);
        console.log('🌐 Network request:', `${request.method()} ${url}`);
      }
    });
    
    page.on('response', response => {
      const url = response.url();
      if (url.includes('nominatim') || url.includes('geocode')) {
        networkRequests.push(`RESPONSE: ${response.status()} ${url}`);
        console.log('📡 Network response:', `${response.status()} ${url}`);
      }
    });
    
    // Navigate to the app
    await page.goto('http://localhost:5177');
    await page.waitForTimeout(2000);
    
    // Find destination input
    const destinationInput = await page.locator('input[name="destinations"], input[placeholder*="destination" i]').first();
    
    if (await destinationInput.count() === 0) {
      console.log('❌ Need to navigate to form first');
      const createButton = await page.locator('button:has-text("Create"), a:has-text("Create")').first();
      if (await createButton.count() > 0) {
        await createButton.click();
        await page.waitForTimeout(1000);
      }
    }
    
    const destInput = await page.locator('input[name="destinations"], input[placeholder*="destination" i]').first();
    expect(await destInput.count()).toBeGreaterThan(0);
    
    console.log('🧪 STARTING OSAKA TEST WITH FULL CONSOLE CAPTURE...');
    console.log('═══════════════════════════════════════════════════');
    
    // Clear and enter Osaka
    await destInput.click();
    await destInput.clear();
    console.log('📝 Entering "Osaka"...');
    await destInput.fill('Osaka');
    
    const valueAfterInput = await destInput.inputValue();
    console.log('📊 Value after input:', valueAfterInput);
    
    // Trigger blur and wait for logs
    console.log('🔄 Triggering blur event...');
    await page.click('body');
    
    // Wait longer to capture all async operations and logs
    console.log('⏳ Waiting 5 seconds for all logs and network activity...');
    await page.waitForTimeout(5000);
    
    const valueAfterBlur = await destInput.inputValue();
    console.log('📊 Final value:', valueAfterBlur);
    
    console.log('═══════════════════════════════════════════════════');
    console.log('📋 DETAILED DEBUG REPORT:');
    console.log('');
    console.log('🖥️  CONSOLE MESSAGES (' + consoleMessages.length + ' total):');
    if (consoleMessages.length === 0) {
      console.log('  ❌ NO CONSOLE MESSAGES - This indicates the blur handler may not be firing');
    } else {
      consoleMessages.forEach((msg, i) => {
        console.log(`  ${i + 1}. ${msg}`);
      });
    }
    
    console.log('');
    console.log('🌐 NETWORK ACTIVITY (' + networkRequests.length + ' requests):');
    if (networkRequests.length === 0) {
      console.log('  ❌ NO GEOCODING REQUESTS - API calls are not being made');
    } else {
      networkRequests.forEach((req, i) => {
        console.log(`  ${i + 1}. ${req}`);
      });
    }
    
    console.log('');
    console.log('❌ ERRORS (' + errorMessages.length + ' total):');
    if (errorMessages.length === 0) {
      console.log('  ✅ No JavaScript errors detected');
    } else {
      errorMessages.forEach((err, i) => {
        console.log(`  ${i + 1}. ${err}`);
      });
    }
    
    console.log('');
    console.log('📊 FINAL ANALYSIS:');
    console.log('  Input value: "' + valueAfterInput + '"');
    console.log('  Final value: "' + valueAfterBlur + '"');
    console.log('  Expected: "Osaka, Osaka Prefecture, Japan" or "Osaka, Japan"');
    console.log('  Changed?: ' + (valueAfterInput !== valueAfterBlur));
    
    if (consoleMessages.length === 0) {
      console.log('');
      console.log('🚨 CRITICAL FINDING: No console messages suggests:');
      console.log('  1. handleDestinationBlur function is not being called');
      console.log('  2. onBlur event handler is not properly attached');
      console.log('  3. Event delegation issue or React synthetic event problem');
    } else if (networkRequests.length === 0) {
      console.log('');
      console.log('🚨 CRITICAL FINDING: Console logs present but no network requests suggests:');
      console.log('  1. handleDestinationBlur is called but geocode function fails');
      console.log('  2. Environment detection issue (test vs development)');
      console.log('  3. API call is being blocked or cancelled');
    } else if (valueAfterBlur === valueAfterInput) {
      console.log('');
      console.log('🚨 CRITICAL FINDING: Network requests made but no value change suggests:');
      console.log('  1. API response processing issue');
      console.log('  2. State update not working properly');
      console.log('  3. Condition check preventing update');
    }
    
    console.log('═══════════════════════════════════════════════════');
  });
});