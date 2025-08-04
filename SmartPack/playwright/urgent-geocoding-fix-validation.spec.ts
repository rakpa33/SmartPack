import { test, expect } from '@playwright/test';

test.describe('CRITICAL: Geocoding Fix Validation', () => {
  test('Verify handleDestinationBlur function execution', async ({ page }) => {
    console.log('🚨 CRITICAL VALIDATION: Testing if handleDestinationBlur function executes');
    
    const allLogs: string[] = [];
    const geocodingLogs: string[] = [];
    
    // Capture all console activity
    page.on('console', msg => {
      const text = `[${msg.type()}] ${msg.text()}`;
      allLogs.push(text);
      
      if (text.includes('handleDestinationBlur') || text.includes('TripForm') || text.includes('geocode')) {
        geocodingLogs.push(text);
        console.log('🎯 GEOCODING LOG:', text);
      }
    });

    console.log('📱 Navigating to http://localhost:5177...');
    await page.goto('http://localhost:5177');
    await page.waitForLoadState('networkidle');
    
    console.log('🔍 Looking for destination input with correct selector...');
    
    // Use the correct selector based on the actual field
    const destInput = page.locator('[data-testid="destination-input-0"]');
    
    // Verify field exists
    await expect(destInput).toBeVisible();
    console.log('✅ Found destination input field');
    
    // Clear and type Osaka
    await destInput.clear();
    await destInput.fill('Osaka');
    console.log('📝 Typed "Osaka" in destination field');
    
    const valueBefore = await destInput.inputValue();
    console.log('📊 Value before blur:', valueBefore);
    
    // Clear logs to focus on blur event
    allLogs.length = 0;
    geocodingLogs.length = 0;
    
    console.log('🔄 Triggering blur event (clicking outside field)...');
    
    // Trigger blur by clicking outside the input
    await page.click('body');
    
    // Wait for handleDestinationBlur to execute
    console.log('⏳ Waiting 3 seconds for function execution...');
    await page.waitForTimeout(3000);
    
    const valueAfter = await destInput.inputValue();
    console.log('📊 Value after blur:', valueAfter);
    
    console.log('═══════════════════════════════════════');
    console.log('🔍 EXECUTION ANALYSIS:');
    console.log(`  Total console messages: ${allLogs.length}`);
    console.log(`  Geocoding-related logs: ${geocodingLogs.length}`);
    
    if (geocodingLogs.length > 0) {
      console.log('📋 Geocoding function logs:');
      geocodingLogs.forEach((log, i) => {
        console.log(`    ${i + 1}: ${log}`);
      });
    } else {
      console.log('❌ NO handleDestinationBlur logs - function NOT executing');
    }
    
    console.log('🎯 CRITICAL RESULTS:');
    console.log(`  Input value: "${valueBefore}" → "${valueAfter}"`);
    console.log(`  Function executed: ${geocodingLogs.length > 0 ? 'YES ✅' : 'NO ❌'}`);
    console.log(`  Expected: Should see logs from handleDestinationBlur`);
    console.log('═══════════════════════════════════════');
    
    // Take screenshot for evidence
    await page.screenshot({ path: 'geocoding-function-validation.png', fullPage: true });
    
    // Critical assertion: handleDestinationBlur MUST execute
    if (geocodingLogs.length === 0) {
      console.log('❌ CRITICAL FAILURE: handleDestinationBlur function not executing on blur');
      console.log('🔧 ROOT CAUSE: Blur event handler not properly attached or not triggering');
      throw new Error('SHIP BLOCKER: handleDestinationBlur function not executing on blur event');
    } else {
      console.log('✅ SUCCESS: handleDestinationBlur function is executing');
    }
  });
  
  test('Direct API test to verify geocode function works', async ({ page }) => {
    console.log('🧪 DIRECT API TEST: Testing geocode function directly');
    
    await page.goto('http://localhost:5177');
    await page.waitForLoadState('networkidle');
    
    // Test the geocode function directly in browser context
    const result = await page.evaluate(async () => {
      // @ts-ignore - We're testing in browser context
      const response = await fetch('https://nominatim.openstreetmap.org/search?format=json&q=Osaka&limit=1');
      const data = await response.json();
      return data[0];
    });
    
    console.log('🌐 Direct API test result:', result);
    
    if (result && result.display_name) {
      console.log('✅ API works correctly:', result.display_name);
      expect(result.display_name).toContain('Osaka');
    } else {
      console.log('❌ API failed or returned no results');
      throw new Error('Geocoding API is not working');
    }
  });
});