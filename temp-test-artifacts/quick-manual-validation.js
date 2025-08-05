/**
 * QUICK MANUAL VALIDATION - Check what's actually rendered
 */

import { chromium } from 'playwright';

async function quickValidation() {
  const browser = await chromium.launch({ headless: false, slowMo: 2000 });
  const page = await browser.newPage();
  
  try {
    console.log('🔍 Loading SmartPack...');
    await page.goto('http://localhost:5181');
    await page.waitForLoadState('networkidle');
    
    // Check if loading state is gone
    const hasLoading = await page.locator('text=Loading...').count() > 0;
    console.log(`Loading state present: ${hasLoading}`);
    
    // Take screenshot of current state
    await page.screenshot({ path: 'current-state.png', fullPage: true });
    console.log('Screenshot saved as current-state.png');
    
    // Check what travel mode elements exist
    const travelModeElements = await page.locator('input[type="checkbox"]').count();
    console.log(`Travel mode checkboxes found: ${travelModeElements}`);
    
    // List all input elements to see what's available
    const allInputs = await page.locator('input').all();
    console.log(`\nAll input elements found: ${allInputs.length}`);
    
    for (let i = 0; i < allInputs.length; i++) {
      const input = allInputs[i];
      const type = await input.getAttribute('type');
      const id = await input.getAttribute('id');
      const name = await input.getAttribute('name');
      const value = await input.getAttribute('value');
      console.log(`Input ${i}: type=${type}, id=${id}, name=${name}, value=${value}`);
    }
    
    // Check for any console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('❌ Console Error:', msg.text());
      }
    });
    
    console.log('\n⏱️ Waiting 10 seconds for manual inspection...');
    await page.waitForTimeout(10000);
    
  } finally {
    await browser.close();
  }
}

quickValidation().catch(console.error);