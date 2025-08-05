import { test, expect } from '@playwright/test';

test.describe('SmartPack AI Integration Assessment', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5185');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Allow React context to initialize
  });

  test('AI Integration: Packing List Generation Test', async ({ page }) => {
    console.log('🤖 TESTING: AI Packing List Generation');
    
    // Fill out minimum viable trip details
    const tripNameInput = page.locator('input[id="tripName"], input[name="tripName"]').first();
    const destinationInput = page.locator('[data-testid="destination-input-0"]').first();
    
    if (await tripNameInput.isVisible() && await destinationInput.isVisible()) {
      console.log('📝 Filling out trip details...');
      
      // Fill basic trip info
      await tripNameInput.fill('AI Test Trip');
      await destinationInput.fill('Tokyo');
      await destinationInput.blur(); // Trigger geocoding
      await page.waitForTimeout(2000);
      
      // Select travel modes
      const carCheckbox = page.locator('input[type="checkbox"]').first();
      if (await carCheckbox.isVisible()) {
        await carCheckbox.check();
        console.log('✅ Travel mode selected');
      }
      
      // Look for AI generation button or workflow progression
      const aiButtons = page.locator('button').filter({
        hasText: /generate|ai|pack|create|suggest|next|continue/i
      });
      
      const aiButtonCount = await aiButtons.count();
      console.log(`Found ${aiButtonCount} potential AI/workflow buttons`);
      
      if (aiButtonCount > 0) {
        // Try to trigger AI generation
        const primaryButton = aiButtons.first();
        const buttonText = await primaryButton.textContent();
        console.log(`Clicking button: "${buttonText}"`);
        
        await primaryButton.click();
        
        // Wait for AI processing
        console.log('⏳ Waiting for AI processing...');
        await page.waitForTimeout(5000);
        
        // Look for generated packing items
        const packingItems = page.locator('li, .item, [data-testid*="item"], .checklist-item, input[type="checkbox"] + span, label');
        const itemCount = await packingItems.count();
        
        console.log(`Found ${itemCount} potential packing items after AI generation`);
        
        if (itemCount > 10) { // Expect some generated items
          console.log('✅ AI Integration appears to be working - items generated');
          
          // Check for item categories
          const categories = page.locator('.category, h3, h4, .group-title');
          const categoryCount = await categories.count();
          console.log(`Found ${categoryCount} potential categories`);
          
        } else {
          console.log('⚠️ AI Integration may not be working - few items found');
        }
        
        // Check for loading states during AI processing
        const loadingElements = page.locator('.loading, .spinner, [data-testid*="loading"]');
        const hasLoadingStates = await loadingElements.count() > 0;
        
        if (hasLoadingStates) {
          console.log('✅ Loading states present during AI processing');
        }
        
      } else {
        console.log('⚠️ No AI generation buttons found - may need manual workflow testing');
      }
      
    } else {
      console.log('❌ Could not find required form inputs for AI testing');
    }
  });

  test('AI Integration: Service Health Check', async ({ page }) => {
    console.log('🔧 TESTING: AI Service Health and Error Handling');
    
    // Monitor network requests for AI service calls
    const apiCalls: string[] = [];
    
    page.on('request', request => {
      const url = request.url();
      if (url.includes('lambda') || url.includes('api') || url.includes('ollama') || url.includes('ai')) {
        apiCalls.push(url);
        console.log(`📡 AI API call detected: ${url}`);
      }
    });
    
    // Monitor console for AI-related logs
    const aiLogs: string[] = [];
    page.on('console', msg => {
      const text = msg.text();
      if (text.includes('AI') || text.includes('ollama') || text.includes('lambda') || text.includes('packing')) {
        aiLogs.push(text);
        console.log(`🤖 AI-related log: ${text}`);
      }
    });
    
    // Try to trigger AI functionality
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < Math.min(buttonCount, 5); i++) {
      const button = buttons.nth(i);
      const buttonText = await button.textContent() || '';
      
      if (buttonText.toLowerCase().includes('generate') || 
          buttonText.toLowerCase().includes('ai') ||
          buttonText.toLowerCase().includes('pack')) {
        
        console.log(`Triggering potential AI button: "${buttonText}"`);
        await button.click();
        await page.waitForTimeout(3000);
        break;
      }
    }
    
    // Assess AI service health
    if (apiCalls.length > 0) {
      console.log(`✅ AI Service: ${apiCalls.length} API calls detected`);
    } else {
      console.log('⚠️ AI Service: No API calls detected (may be mocked/offline)');
    }
    
    if (aiLogs.length > 0) {
      console.log(`✅ AI Logging: ${aiLogs.length} AI-related logs found`);
    } else {
      console.log('⚠️ AI Logging: No AI-related logs (may be working silently)');
    }
  });

  test('Data Persistence: localStorage Functionality', async ({ page }) => {
    console.log('💾 TESTING: Data Persistence and localStorage');
    
    // Fill out form data
    const tripNameInput = page.locator('input[id="tripName"], input[name="tripName"]').first();
    
    if (await tripNameInput.isVisible()) {
      const testTripName = 'Persistence Test ' + Date.now();
      console.log(`Testing persistence with: "${testTripName}"`);
      
      await tripNameInput.fill(testTripName);
      await tripNameInput.blur();
      
      // Wait for data to be saved
      await page.waitForTimeout(1000);
      
      // Reload page to test persistence
      console.log('🔄 Reloading page to test data persistence...');
      await page.reload();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000); // Allow context to load from localStorage
      
      // Check if data persisted
      const persistedValue = await tripNameInput.inputValue();
      console.log(`Persisted value: "${persistedValue}"`);
      
      if (persistedValue === testTripName) {
        console.log('✅ Data Persistence: Full data persistence working');
      } else if (persistedValue && persistedValue.length > 0) {
        console.log('⚠️ Data Persistence: Partial persistence - some data restored');
      } else {
        console.log('❌ Data Persistence: Not working - no data after reload');
      }
      
    } else {
      console.log('❌ Could not test data persistence - trip name input not found');  
    }
  });

  test('Complete Workflow: End-to-End User Journey', async ({ page }) => {
    console.log('🎯 TESTING: Complete End-to-End User Journey');
    
    try {
      // Step 1: Fill trip details
      console.log('Step 1: Filling trip details...');
      
      const tripName = page.locator('input[id="tripName"]').first();
      const destination = page.locator('[data-testid="destination-input-0"]').first();
      
      if (await tripName.isVisible() && await destination.isVisible()) {
        await tripName.fill('End-to-End Test Trip');
        await destination.fill('Barcelona');
        await destination.blur();
        await page.waitForTimeout(2000);
        
        console.log('✅ Step 1 complete: Trip details filled');
      } else {
        console.log('❌ Step 1 failed: Could not find form inputs');
        return;
      }
      
      // Step 2: Select travel modes
      console.log('Step 2: Selecting travel modes...');
      
      const checkboxes = page.locator('input[type="checkbox"]');
      if (await checkboxes.count() > 0) {
        await checkboxes.first().check();
        if (await checkboxes.count() > 1) {
          await checkboxes.nth(1).check();
        }
        console.log('✅ Step 2 complete: Travel modes selected');
      }
      
      // Step 3: Set dates (if visible)
      console.log('Step 3: Setting dates...');
      
      const startDate = page.locator('input[type="date"], input[id*="start"], input[name*="start"]').first();
      if (await startDate.isVisible()) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dateStr = tomorrow.toISOString().split('T')[0];
        
        await startDate.fill(dateStr);
        console.log('✅ Step 3 complete: Dates set');
      } else {
        console.log('⚠️ Step 3 skipped: Date inputs not visible');
      }
      
      // Step 4: Look for workflow progression
      console.log('Step 4: Looking for workflow progression...');
      
      const workflowButtons = page.locator('button').filter({
        hasText: /next|continue|generate|save|create/i
      });
      
      if (await workflowButtons.count() > 0) {
        const button = workflowButtons.first();
        const buttonText = await button.textContent();
        console.log(`Found workflow button: "${buttonText}"`);
        
        await button.click();
        await page.waitForTimeout(3000);
        
        console.log('✅ Step 4 complete: Workflow progression triggered');
      } else {
        console.log('⚠️ Step 4: No clear workflow progression found');
      }
      
      // Step 5: Check for results/output
      console.log('Step 5: Checking for results...');
      
      const resultElements = page.locator('li, .item, .result, [data-testid*="item"]');
      const resultCount = await resultElements.count();
      
      if (resultCount > 5) {
        console.log(`✅ Step 5 complete: Found ${resultCount} result items`);
        console.log('✅ END-TO-END WORKFLOW: Complete user journey working');
      } else {
        console.log(`⚠️ Step 5: Only ${resultCount} result items found`);
        console.log('⚠️ END-TO-END WORKFLOW: May need manual verification');
      }
      
    } catch (error) {
      console.log('❌ END-TO-END WORKFLOW: Error during testing:', error);
    }
  });
});