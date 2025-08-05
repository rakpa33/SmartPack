// Debug script to investigate why handleDestinationBlur is not executing
// Created: 2025-08-05 21:30
// Purpose: Test blur event execution and function attachment

import { test, expect } from '@playwright/test';

test.describe('Debug Blur Handler Execution', () => {
  test('should verify blur handler execution with comprehensive debugging', async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');

    console.log('🔍 Starting blur handler execution debugging...');

    // Check if we can find the destination input
    const destinationInput = page.locator('[data-testid="destination-input-0"]').first();
    await expect(destinationInput).toBeVisible();
    console.log('✅ Destination input found');

    // Add comprehensive console logging to check if function exists
    await page.evaluate(() => {
      console.log('🔧 Injecting debug handlers...');
      
      // Override console.warn to capture blur events
      const originalWarn = console.warn;
      window.capturedWarnings = [];
      console.warn = function(...args) {
        window.capturedWarnings.push(args.join(' '));
        originalWarn.apply(console, args);
      };

      // Override console.log to capture all logs
      const originalLog = console.log;
      window.capturedLogs = [];
      console.log = function(...args) {
        window.capturedLogs.push(args.join(' '));
        originalLog.apply(console, args);
      };
    });

    // Focus on the input
    await destinationInput.click();
    await destinationInput.fill('Osaka');
    console.log('📝 Filled input with "Osaka"');

    // Trigger blur event
    await page.locator('body').click(); // Click elsewhere to trigger blur
    console.log('👆 Clicked elsewhere to trigger blur');

    // Wait a moment for any async operations
    await page.waitForTimeout(2000);

    // Check what was captured
    const capturedWarnings = await page.evaluate(() => window.capturedWarnings || []);
    const capturedLogs = await page.evaluate(() => window.capturedLogs || []);

    console.log('📊 Captured warnings:', capturedWarnings);
    console.log('📊 Captured logs:', capturedLogs);

    // Check if blur warning was captured
    const blurWarnings = capturedWarnings.filter(warning => 
      warning.includes('BLUR EVENT FIRED')
    );
    
    console.log('🚨 Blur warnings found:', blurWarnings.length);
    
    if (blurWarnings.length === 0) {
      console.error('❌ CRITICAL: No blur event warnings captured - handler not executing!');
      
      // Check if the component is actually rendered
      const inputElement = await page.locator('[data-testid="destination-input-0"]').first();
      const inputExists = await inputElement.count() > 0;
      console.log('🔍 Input element exists:', inputExists);
      
      if (inputExists) {
        // Get the actual onBlur handler from the DOM
        const hasOnBlur = await inputElement.evaluate(el => {
          return typeof el.onblur === 'function';
        });
        console.log('🔍 Input has onBlur handler:', hasOnBlur);
        
        // Try to manually trigger the blur event
        await inputElement.evaluate(el => {
          console.log('🔧 Manually triggering blur event...');
          el.dispatchEvent(new Event('blur', { bubbles: true }));
        });
        
        // Wait and check again
        await page.waitForTimeout(1000);
        const newWarnings = await page.evaluate(() => window.capturedWarnings || []);
        const newBlurWarnings = newWarnings.filter(warning => 
          warning.includes('BLUR EVENT FIRED')
        );
        console.log('🔧 After manual trigger, blur warnings:', newBlurWarnings.length);
      }
    } else {
      console.log('✅ Blur event handler is executing');
      
      // Check if geocoding logs were captured
      const geocodingLogs = capturedLogs.filter(log => 
        log.includes('handleDestinationBlur called') || 
        log.includes('Calling geocodeCity') ||
        log.includes('Geocoding result')
      );
      
      console.log('🌍 Geocoding logs found:', geocodingLogs.length);
      console.log('🌍 Geocoding logs:', geocodingLogs);
      
      if (geocodingLogs.length === 0) {
        console.error('❌ CRITICAL: Blur handler executing but geocoding function not called!');
      }
    }

    // Check final input value
    const finalValue = await destinationInput.inputValue();
    console.log('📍 Final input value:', finalValue);
    
    if (finalValue === 'Osaka') {
      console.error('❌ SHIP BLOCKER: Input value unchanged - geocoding failed');
    } else {
      console.log('✅ Input value changed to:', finalValue);
    }

    // Take screenshot for evidence
    await page.screenshot({ 
      path: 'temp-test-artifacts/blur-debug-screenshot-20250805.png',
      fullPage: true 
    });
  });

  test('should test with multiple cities to confirm systematic failure', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');

    const cities = ['Osaka', 'Tokyo', 'Paris', 'London'];
    
    for (const city of cities) {
      console.log(`🔍 Testing city: ${city}`);
      
      const destinationInput = page.locator('[data-testid="destination-input-0"]').first();
      await destinationInput.click();
      await destinationInput.fill(city);
      
      // Trigger blur
      await page.locator('body').click();
      await page.waitForTimeout(1500);
      
      const finalValue = await destinationInput.inputValue();
      console.log(`📍 ${city} final value: ${finalValue}`);
      
      if (finalValue === city) {
        console.error(`❌ ${city}: No geocoding occurred`);
      } else {
        console.log(`✅ ${city}: Geocoded to ${finalValue}`);
      }
    }
  });
});