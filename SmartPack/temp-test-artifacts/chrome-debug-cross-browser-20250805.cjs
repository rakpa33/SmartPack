/**
 * Chrome-Specific Cross-Browser Debugging Script
 * Created: 2025-08-05
 * 
 * CRITICAL SHIP BLOCKER: Location autocomplete works in Safari/Firefox but fails in Chrome/Mobile Chrome
 * 
 * Purpose: Identify Chrome-specific differences in:
 * 1. Blur event handling
 * 2. Async/await execution timing  
 * 3. Fetch API behavior
 * 4. DOM event binding
 * 5. JavaScript engine differences
 */

const { chromium, firefox, webkit } = require('playwright');

async function debugChromeGeocoding() {
  console.log('🔍 CHROME-SPECIFIC GEOCODING DEBUG - Cross-Browser Analysis');
  console.log('📋 Testing: Location autocomplete across browser engines');
  console.log('🎯 Target: "Osaka" → "Osaka, Osaka Prefecture, Japan"');
  console.log('');

  // Test across all browsers
  const browsers = [
    { name: 'Chrome', engine: chromium },
    { name: 'Firefox', engine: firefox },
    { name: 'Safari', engine: webkit }
  ];

  const results = {};

  for (const { name, engine } of browsers) {
    console.log(`🌐 Testing ${name}...`);
    
    try {
      const browser = await engine.launch({ headless: false });
      const context = await browser.newContext();
      const page = await context.newPage();

      // Enable console logging
      page.on('console', msg => {
        console.log(`[${name} Console]`, msg.text());
      });

      // Navigate to app
      await page.goto('http://localhost:5177');
      await page.waitForLoadState('networkidle');

      // Navigate to trip edit form
      console.log(`[${name}] Navigating to trip form...`);
      await page.click('text=Create New Trip');
      await page.waitForSelector('[data-testid="destination-input-0"]');
      
      // Test basic element interaction
      const destinationInput = page.locator('[data-testid="destination-input-0"]');
      console.log(`[${name}] Found destination input: ${await destinationInput.isVisible()}`);

      // Test focus/blur cycle with detailed timing
      console.log(`[${name}] Starting focus/blur cycle...`);
      
      await destinationInput.focus();
      console.log(`[${name}] Input focused`);
      
      await destinationInput.fill('Osaka');
      console.log(`[${name}] Filled with "Osaka"`);
      
      // Wait briefly to ensure value is set
      await page.waitForTimeout(100);
      
      const valueBeforeBlur = await destinationInput.inputValue();
      console.log(`[${name}] Value before blur: "${valueBeforeBlur}"`);
      
      // Trigger blur event - this is the critical step
      console.log(`[${name}] Triggering blur event...`);
      await destinationInput.blur();
      
      // Wait for potential geocoding (different timing in different browsers)
      console.log(`[${name}] Waiting for geocoding...`);
      await page.waitForTimeout(3000); // Extended wait for geocoding
      
      const valueAfterBlur = await destinationInput.inputValue();
      console.log(`[${name}] Value after blur: "${valueAfterBlur}"`);
      
      // Test direct API call from browser context
      console.log(`[${name}] Testing direct API call...`);
      const apiResult = await page.evaluate(async () => {
        try {
          const response = await fetch('https://nominatim.openstreetmap.org/search?q=Osaka&format=json&limit=1', {
            headers: {
              'Accept-Language': 'en',
              'User-Agent': 'SmartPack/1.0',
            },
          });
          const data = await response.json();
          return data[0]?.display_name || 'No result';
        } catch (error) {
          return `API Error: ${error.message}`;
        }
      });
      console.log(`[${name}] Direct API result: "${apiResult}"`);

      // Test handleDestinationBlur function availability
      const functionTest = await page.evaluate(() => {
        // Try to access the React component's function
        const input = document.querySelector('[data-testid="destination-input-0"]');
        if (input) {
          const reactFiber = Object.keys(input).find(key => key.startsWith('__reactFiber'));
          if (reactFiber) {
            console.log('React fiber found:', !!input[reactFiber]);
            return 'React component accessible';
          }
        }
        return 'React component not accessible';
      });
      console.log(`[${name}] React component test: ${functionTest}`);

      // Store results
      results[name] = {
        valueBeforeBlur,
        valueAfterBlur,
        apiResult,
        geocodingWorked: valueAfterBlur !== valueBeforeBlur && valueAfterBlur.includes(','),
        functionAccessible: functionTest
      };

      console.log(`[${name}] ✅ Test completed`);
      console.log('');

      await browser.close();
      
    } catch (error) {
      console.error(`[${name}] ❌ Test failed:`, error.message);
      results[name] = { error: error.message };
    }
  }

  // Analysis
  console.log('📊 CROSS-BROWSER ANALYSIS RESULTS:');
  console.log('=====================================');
  
  Object.entries(results).forEach(([browser, result]) => {
    if (result.error) {
      console.log(`${browser}: ❌ ERROR - ${result.error}`);
    } else {
      const status = result.geocodingWorked ? '✅ WORKING' : '❌ BROKEN';
      console.log(`${browser}: ${status}`);
      console.log(`  Before: "${result.valueBeforeBlur}"`);
      console.log(`  After:  "${result.valueAfterBlur}"`);
      console.log(`  API:    "${result.apiResult}"`);
      console.log(`  React:  ${result.functionAccessible}`);
    }
    console.log('');
  });

  // Root cause analysis
  console.log('🔍 ROOT CAUSE ANALYSIS:');
  const workingBrowsers = Object.entries(results).filter(([_, result]) => result.geocodingWorked);
  const brokenBrowsers = Object.entries(results).filter(([_, result]) => !result.error && !result.geocodingWorked);
  
  if (workingBrowsers.length > 0 && brokenBrowsers.length > 0) {
    console.log('📋 BROWSER-SPECIFIC ISSUE CONFIRMED:');
    console.log(`  Working: ${workingBrowsers.map(([name]) => name).join(', ')}`);
    console.log(`  Broken:  ${brokenBrowsers.map(([name]) => name).join(', ')}`);
    console.log('');
    console.log('🔧 POTENTIAL CAUSES:');
    console.log('  1. Blur event timing differences');
    console.log('  2. Async/await execution order variations');
    console.log('  3. Fetch API CORS/network handling differences');
    console.log('  4. React event handler binding differences');
    console.log('  5. JavaScript engine event loop differences');
  }

  return results;
}

// Export for direct execution
if (require.main === module) {
  debugChromeGeocoding().catch(console.error);
}

module.exports = { debugChromeGeocoding };