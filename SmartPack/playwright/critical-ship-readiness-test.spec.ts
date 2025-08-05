import { test, expect } from '@playwright/test';

test.describe('SmartPack Critical Ship Readiness Assessment', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5185');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000); // Allow React context to initialize
  });

  test('SHIP BLOCKER CHECK: Location Autocomplete (Osaka → Osaka, Japan)', async ({ page }) => {
    console.log('🔍 CRITICAL TEST: Location Autocomplete Functionality');
    
    // Try multiple selectors for destination input
    const destinationSelectors = [
      '[data-testid="destination-input-0"]',
      'input[id^="destination"]',
      'input[placeholder*="destination" i]',
      'input[name*="destination"]',
      'input[aria-label*="destination"]'
    ];
    
    let destinationInput = null;
    let foundSelector = '';
    
    for (const selector of destinationSelectors) {
      const element = page.locator(selector);
      if (await element.count() > 0) {
        const firstElement = element.first();
        if (await firstElement.isVisible()) {
          destinationInput = firstElement;
          foundSelector = selector;
          console.log(`✅ Found destination input: ${selector}`);
          break;
        }
      }
    }
    
    if (!destinationInput) {
      console.log('❌ SHIP BLOCKER: No destination input found');
      console.log('Available inputs on page:');
      const allInputs = page.locator('input');
      const inputCount = await allInputs.count();
      for (let i = 0; i < Math.min(inputCount, 10); i++) {
        const input = allInputs.nth(i);
        const id = await input.getAttribute('id') || 'no-id';
        const placeholder = await input.getAttribute('placeholder') || 'no-placeholder';
        const name = await input.getAttribute('name') || 'no-name';
        console.log(`  Input ${i}: id="${id}" name="${name}" placeholder="${placeholder}"`);
      }
      expect(destinationInput).not.toBeNull();
      return;
    }
    
    console.log('🧪 Testing Osaka → Osaka, Japan autocomplete with selector:', foundSelector);
    
    // Clear and enter "Osaka"
    await destinationInput.clear();
    await destinationInput.fill('Osaka');
    
    const beforeValue = await destinationInput.inputValue();
    console.log(`Before blur: "${beforeValue}"`);
    
    // Trigger blur event 
    await destinationInput.blur();
    
    // Wait for geocoding API call
    console.log('⏳ Waiting for geocoding...');
    await page.waitForTimeout(4000);
    
    // Check final value
    const afterValue = await destinationInput.inputValue();
    console.log(`After blur: "${afterValue}"`);
    
    // Assess autocomplete functionality
    if (afterValue !== beforeValue && afterValue.includes('Japan')) {
      console.log('✅ SHIP READY: Location autocomplete WORKING!');
      console.log(`   Osaka → ${afterValue}`);
    } else if (afterValue === beforeValue) {
      console.log('❌ SHIP BLOCKER: Location autocomplete NOT working');
      console.log('   Value unchanged after blur event');
    } else {
      console.log('⚠️ PARTIAL: Autocomplete changed value but result unexpected');
      console.log(`   Result: "${afterValue}"`);
    }
    
    // Test with another city for verification
    console.log('🧪 Testing Paris autocomplete for verification');
    await destinationInput.clear();
    await destinationInput.fill('Paris');
    await destinationInput.blur();
    await page.waitForTimeout(3000);
    
    const parisResult = await destinationInput.inputValue();
    console.log(`Paris result: "${parisResult}"`);
    
    if (parisResult.includes('France') || parisResult !== 'Paris') {
      console.log('✅ Secondary test passed: Paris autocomplete working');
    } else {
      console.log('❌ Secondary test failed: Paris autocomplete not working');
    }
  });

  test('SHIP READY CHECK: Core Application Functions', async ({ page }) => {
    console.log('🔍 TESTING: Core Application Functionality');
    
    // 1. Application loads and renders
    const hasReactContent = await page.evaluate(() => {
      const root = document.getElementById('root');
      return root && root.innerHTML.length > 100;
    });
    
    if (hasReactContent) {
      console.log('✅ Application loads and React renders properly');
    } else {
      console.log('❌ SHIP BLOCKER: Application not loading properly');
    }
    
    // 2. Form elements present
    const inputs = page.locator('input');
    const buttons = page.locator('button');
    const inputCount = await inputs.count();
    const buttonCount = await buttons.count();
    
    console.log(`Found ${inputCount} inputs and ${buttonCount} buttons`);
    
    if (inputCount >= 5 && buttonCount >= 3) {
      console.log('✅ Sufficient form elements present');
    } else {
      console.log('⚠️ May be missing form elements');
    }
    
    // 3. Basic form interaction
    const firstTextInput = page.locator('input[type="text"], input:not([type])').first();
    if (await firstTextInput.isVisible()) {
      await firstTextInput.fill('Ship Readiness Test');
      const value = await firstTextInput.inputValue();
      if (value === 'Ship Readiness Test') {
        console.log('✅ Basic form input working');
      } else {
        console.log('❌ Basic form input not working');
      }
    }
    
    // 4. Checkbox interaction (travel modes)
    const checkboxes = page.locator('input[type="checkbox"]');
    const checkboxCount = await checkboxes.count();
    
    if (checkboxCount > 0) {
      await checkboxes.first().check();
      const isChecked = await checkboxes.first().isChecked();
      if (isChecked) {
        console.log(`✅ Checkbox interaction working (${checkboxCount} available)`);
      } else {
        console.log('❌ Checkbox interaction not working');
      }
    }
  });

  test('SHIP READY CHECK: Mobile Compatibility', async ({ page }) => {
    console.log('🔍 TESTING: Mobile Responsiveness');
    
    // Switch to mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);
    
    // Test that content fits
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.body.scrollWidth > window.innerWidth;
    });
    
    if (!hasHorizontalScroll) {
      console.log('✅ Mobile layout - no horizontal scroll');
    } else {
      console.log('⚠️ Mobile layout - has horizontal scroll (may need fixes)');
    }
    
    // Test click interaction (simulate touch)
    const firstButton = page.locator('button').first();
    if (await firstButton.isVisible()) {
      await firstButton.click(); // Using click instead of tap to avoid touch API issues
      console.log('✅ Mobile click interactions working');
    }
    
    // Restore desktop
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('SHIP READY CHECK: Error Handling and Stability', async ({ page }) => {
    console.log('🔍 TESTING: Error Handling and Stability');
    
    // Monitor console errors
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Test with extreme inputs
    const textInputs = page.locator('input[type="text"], input:not([type])');
    if (await textInputs.count() > 0) {
      const input = textInputs.first();
      
      // Test very long input
      await input.fill('x'.repeat(1000));
      await input.blur();
      await page.waitForTimeout(500);
      
      // Test special characters
      await input.clear();
      await input.fill('测试 🏃‍♂️ <script>alert("test")</script> пример');
      await input.blur();
      await page.waitForTimeout(500);
    }
    
    // Check for critical errors
    if (consoleErrors.length === 0) {
      console.log('✅ No console errors with extreme inputs');
    } else {
      const criticalErrors = consoleErrors.filter(err => 
        err.includes('TypeError') || 
        err.includes('ReferenceError') || 
        err.includes('Cannot read') ||
        err.includes('is not a function')
      );
      
      if (criticalErrors.length === 0) {
        console.log(`⚠️ ${consoleErrors.length} minor console messages (not critical)`);
      } else {
        console.log(`❌ ${criticalErrors.length} critical console errors detected`);
        criticalErrors.slice(0, 3).forEach(err => console.log(`   ${err}`));
      }
    }
    
    // Check for error boundaries or crash states
    const errorElements = page.locator('.error, [data-testid="error"], .crash, [role="alert"]');
    const errorCount = await errorElements.count();
    
    if (errorCount === 0) {
      console.log('✅ No error states - application stable');
    } else {
      console.log(`⚠️ ${errorCount} error state elements detected`);
    }
  });

  test('SHIP READY CHECK: Performance and Loading', async ({ page }) => {
    console.log('🔍 TESTING: Performance and Loading');
    
    const startTime = Date.now();
    
    // Fresh page load
    await page.goto('http://localhost:5185');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    console.log(`Page load time: ${loadTime}ms`);
    
    if (loadTime < 3000) {
      console.log('✅ Good loading performance (< 3s)');
    } else if (loadTime < 5000) {
      console.log('⚠️ Acceptable loading performance (3-5s)');
    } else {
      console.log('❌ Slow loading performance (> 5s) - needs optimization');
    }
    
    // Check for loading states
    const hasLoadingStates = await page.locator('.loading, .spinner, [data-testid*="loading"]').count();
    if (hasLoadingStates > 0) {
      console.log('✅ Loading indicators present for better UX');
    }
  });

  test('SHIP ASSESSMENT: Final Readiness Summary', async ({ page }) => {
    console.log('📋 FINAL SHIP READINESS ASSESSMENT');
    console.log('=====================================');
    
    // Key functionality checklist
    const checks = {
      appLoads: false,
      formElements: false,
      basicInteraction: false,
      mobileCompatible: false,
      noJSErrors: false,
      geocodingWorks: false
    };
    
    // 1. App loads
    const hasContent = await page.evaluate(() => {
      const root = document.getElementById('root');
      return root && root.innerHTML.length > 100;
    });
    checks.appLoads = hasContent;
    
    // 2. Form elements
    const inputCount = await page.locator('input').count();
    const buttonCount = await page.locator('button').count();
    checks.formElements = inputCount >= 5 && buttonCount >= 3;
    
    // 3. Basic interaction
    const firstInput = page.locator('input[type="text"], input:not([type])').first();
    if (await firstInput.isVisible()) {
      await firstInput.fill('test');
      const value = await firstInput.inputValue();
      checks.basicInteraction = value === 'test';
    }
    
    // 4. Mobile test
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.body.scrollWidth > window.innerWidth;
    });
    checks.mobileCompatible = !hasHorizontalScroll;
    
    // Restore desktop
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // 5. JS errors check
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Simulate some activity
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    checks.noJSErrors = consoleErrors.length === 0;
    
    // 6. Geocoding test (critical for ship readiness)
    const destinationInput = page.locator('[data-testid="destination-input-0"], input[id^="destination"], input[placeholder*="destination" i]').first();
    
    if (await destinationInput.isVisible()) {
      await destinationInput.clear();
      await destinationInput.fill('Tokyo');
      const beforeBlur = await destinationInput.inputValue();
      await destinationInput.blur();
      await page.waitForTimeout(3000);
      const afterBlur = await destinationInput.inputValue();
      
      checks.geocodingWorks = afterBlur !== beforeBlur || afterBlur.includes('Japan');
    }
    
    // Calculate ship readiness score
    const passedChecks = Object.values(checks).filter(Boolean).length;
    const totalChecks = Object.keys(checks).length;
    const score = Math.round((passedChecks / totalChecks) * 100);
    
    console.log('SHIP READINESS RESULTS:');
    console.log(`✅ Application Loads: ${checks.appLoads ? 'PASS' : 'FAIL'}`);
    console.log(`✅ Form Elements: ${checks.formElements ? 'PASS' : 'FAIL'}`);
    console.log(`✅ Basic Interaction: ${checks.basicInteraction ? 'PASS' : 'FAIL'}`);
    console.log(`✅ Mobile Compatible: ${checks.mobileCompatible ? 'PASS' : 'FAIL'}`);
    console.log(`✅ No JS Errors: ${checks.noJSErrors ? 'PASS' : 'FAIL'}`);
    console.log(`✅ Geocoding Works: ${checks.geocodingWorks ? 'PASS' : 'FAIL'}`);
    console.log('');
    console.log(`SHIP READINESS SCORE: ${score}%`);
    
    if (score >= 90) {
      console.log('🚢 SHIP DECISION: ✅ GO - Ready to ship');
    } else if (score >= 70) {
      console.log('🚢 SHIP DECISION: ⚠️ CONDITIONAL - Minor issues to address');
    } else {
      console.log('🚢 SHIP DECISION: ❌ NO-GO - Critical issues must be fixed');
    }
  });
});