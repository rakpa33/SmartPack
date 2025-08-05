/**
 * Mobile Chrome Specific Testing Script
 * Created: 2025-08-05
 * 
 * INVESTIGATION: Functional-validator reported Chrome/Mobile Chrome failures
 * CONTRADICTION: Automated tests show Chrome working
 * 
 * Purpose: Test Mobile Chrome specifically to understand the discrepancy
 */

const { chromium } = require('playwright');

async function testMobileChrome() {
  console.log('📱 MOBILE CHROME SPECIFIC TEST');
  console.log('🔍 Testing: Mobile Chrome user agent and viewport');
  console.log('🎯 Objective: Reproduce reported Chrome failures');
  console.log('');

  try {
    const browser = await chromium.launch({ headless: false });
    
    // Create mobile Chrome context
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36',
      viewport: { width: 375, height: 667 },
      isMobile: true,
      hasTouch: true
    });
    
    const page = await context.newPage();

    // Enhanced console logging
    page.on('console', msg => {
      const type = msg.type();
      console.log(`[MOBILE CHROME ${type.toUpperCase()}]`, msg.text());
    });

    console.log('📱 Mobile Chrome context created');
    
    // Navigate to app
    await page.goto('http://localhost:5177');
    await page.waitForLoadState('networkidle');
    console.log('📱 App loaded in mobile view');

    // Look for destination input
    const destinationInput = page.locator('[data-testid="destination-input-0"]');
    const isVisible = await destinationInput.isVisible();
    console.log(`📱 Destination input visible: ${isVisible}`);

    if (!isVisible) {
      // Try to take a screenshot to see what's on screen
      await page.screenshot({ path: 'temp-test-artifacts/mobile-chrome-view-20250805.png' });
      console.log('📱 Screenshot saved: mobile-chrome-view-20250805.png');
      
      // Try to find any forms or buttons
      const forms = await page.locator('form').count();
      const buttons = await page.locator('button').count();
      const inputs = await page.locator('input').count();
      
      console.log(`📱 Page elements: ${forms} forms, ${buttons} buttons, ${inputs} inputs`);
      
      throw new Error('Destination input not found in mobile view');
    }

    // Test mobile touch interaction
    console.log('📱 Testing mobile touch interaction...');
    
    await destinationInput.tap(); // Use tap instead of focus for mobile
    console.log('📱 Input tapped (focused)');
    
    await destinationInput.fill('Osaka');
    console.log('📱 Input filled with "Osaka"');
    
    const beforeBlur = await destinationInput.inputValue();
    console.log(`📱 Value before blur: "${beforeBlur}"`);
    
    // Mobile blur - tap somewhere else
    await page.tap('body');
    console.log('📱 Tapped body to trigger blur');
    
    // Wait for geocoding with extended timeout
    console.log('📱 Waiting for mobile geocoding...');
    await page.waitForTimeout(5000);
    
    const afterBlur = await destinationInput.inputValue();
    console.log(`📱 Value after blur: "${afterBlur}"`);
    
    const worked = afterBlur.includes(',');
    console.log(`📱 Mobile Chrome geocoding: ${worked ? '✅ WORKING' : '❌ BROKEN'}`);
    
    // Test network connectivity in mobile context
    const networkTest = await page.evaluate(async () => {
      try {
        const response = await fetch('https://nominatim.openstreetmap.org/search?q=Osaka&format=json&limit=1', {
          headers: {
            'Accept-Language': 'en',
            'User-Agent': 'SmartPack/1.0',
          },
        });
        const data = await response.json();
        return {
          success: true,
          result: data[0]?.display_name || 'No result'
        };
      } catch (error) {
        return {
          success: false,
          error: error.message
        };
      }
    });
    
    console.log(`📱 Mobile network test: ${networkTest.success ? '✅' : '❌'}`);
    if (networkTest.success) {
      console.log(`📱 API result: "${networkTest.result}"`);
    } else {
      console.log(`📱 Network error: ${networkTest.error}`);
    }

    await browser.close();

    return {
      mobileWorking: worked,
      beforeBlur,
      afterBlur,
      networkTest
    };

  } catch (error) {
    console.error('📱 Mobile Chrome test failed:', error.message);
    return { error: error.message };
  }
}

// Export for direct execution
if (require.main === module) {
  testMobileChrome().catch(console.error);
}

module.exports = { testMobileChrome };