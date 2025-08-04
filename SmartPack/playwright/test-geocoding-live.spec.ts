import { test, expect } from '@playwright/test';

test.describe('URGENT: Live Geocoding Validation', () => {
  test('Validate actual geocoding behavior with console monitoring', async ({ page }) => {
    console.log('🚨 EMERGENCY VALIDATION: Testing live geocoding functionality');
    
    const consoleLogs: string[] = [];
    const consoleErrors: string[] = [];
    
    // Capture all console activity
    page.on('console', msg => {
      const text = `[${msg.type()}] ${msg.text()}`;
      consoleLogs.push(text);
      console.log('🖥️  Browser console:', text);
    });
    
    page.on('pageerror', error => {
      const text = `PAGE ERROR: ${error.message}`;
      consoleErrors.push(text);
      console.log('❌ Browser error:', text);
    });

    console.log('📱 Navigating to http://localhost:5177...');
    await page.goto('http://localhost:5177');
    
    // Wait for app to load
    await page.waitForLoadState('networkidle');
    
    console.log('🔍 Looking for destination input field...');
    
    // Try multiple selectors for destination field
    let destInput;
    try {
      destInput = await page.locator('input[name="destinations"]').first();
      if (await destInput.count() === 0) {
        destInput = await page.locator('input[placeholder*="destination" i]').first();
      }
      if (await destInput.count() === 0) {
        destInput = await page.locator('input[type="text"]').nth(1); // Second text input is usually destination
      }
    } catch (error) {
      console.error('❌ Could not find destination input:', error);
    }
    
    expect(await destInput.count()).toBeGreaterThan(0);
    console.log('✅ Found destination input field');
    
    // Clear any existing content and type Osaka
    await destInput.clear();
    await destInput.fill('Osaka');
    console.log('📝 Typed "Osaka" in destination field');
    
    // Get value before blur
    const valueBefore = await destInput.inputValue();
    console.log('📊 Value before blur:', valueBefore);
    
    // Clear console logs to focus on blur event
    consoleLogs.length = 0;
    
    console.log('🔄 Triggering blur event...');
    await destInput.blur();
    
    // Click somewhere else to ensure blur
    await page.click('body');
    
    // Wait for potential geocoding API call
    console.log('⏳ Waiting 5 seconds for geocoding...');
    await page.waitForTimeout(5000);
    
    // Get value after blur
    const valueAfter = await destInput.inputValue();
    console.log('📊 Value after blur:', valueAfter);
    
    // Check for console logs from handleDestinationBlur
    const geocodingLogs = consoleLogs.filter(log => 
      log.includes('handleDestinationBlur') || 
      log.includes('geocode') || 
      log.includes('TripForm')
    );
    
    console.log('🔍 Console logs analysis:');
    console.log('  Total console messages:', consoleLogs.length);
    console.log('  Geocoding-related logs:', geocodingLogs.length);
    console.log('  Console errors:', consoleErrors.length);
    
    if (geocodingLogs.length > 0) {
      console.log('📋 Geocoding logs found:');
      geocodingLogs.forEach((log, i) => {
        console.log(`  ${i + 1}: ${log}`);
      });
    } else {
      console.log('❌ NO geocoding logs found - function may not be executing');
    }
    
    if (consoleErrors.length > 0) {
      console.log('❌ Console errors detected:');
      consoleErrors.forEach((error, i) => {
        console.log(`  ${i + 1}: ${error}`);
      });
    }
    
    console.log('═══════════════════════════════════════');
    console.log('🎯 FINAL RESULTS:');
    console.log(`  Input: "Osaka"`);
    console.log(`  Before blur: "${valueBefore}"`);
    console.log(`  After blur:  "${valueAfter}"`);
    console.log(`  Expected:    "Osaka, Japan" or similar`);
    console.log(`  Function called: ${geocodingLogs.length > 0 ? 'YES' : 'NO'}`);
    console.log(`  Errors: ${consoleErrors.length}`);
    
    if (valueAfter === valueBefore && valueBefore === 'Osaka') {
      console.log('❌ CONFIRMED: Geocoding NOT working - value unchanged');
    } else if (valueAfter !== valueBefore) {
      console.log('✅ SUCCESS: Geocoding working - value changed');
    }
    console.log('═══════════════════════════════════════');
    
    // Take screenshot for evidence
    await page.screenshot({ path: 'geocoding-validation-evidence.png', fullPage: true });
    
    // The test passes if we gathered evidence - we're not testing success/failure here
    expect(consoleLogs.length).toBeGreaterThan(0); // Should have some console activity
  });
});