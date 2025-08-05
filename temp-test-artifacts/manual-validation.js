/**
 * FUNCTIONAL VALIDATOR: Manual Application State Check
 * 
 * Direct browser automation to check current application state
 */

const puppeteer = require('puppeteer');

async function validateAppState() {
  console.log('🧪 FUNCTIONAL VALIDATOR: Manual Application State Check');
  console.log('='.repeat(60));
  
  let browser;
  try {
    browser = await puppeteer.launch({ 
      headless: false,
      defaultViewport: null,
      args: ['--start-maximized']
    });
    
    const page = await browser.newPage();
    
    console.log('🌐 Navigating to http://localhost:5183...');
    await page.goto('http://localhost:5183', { waitUntil: 'networkidle0' });
    
    // Wait a moment for any loading states
    await page.waitForTimeout(2000);
    
    console.log('📊 Analyzing page content...');
    
    // Check for loading states
    const loadingElements = await page.$$eval('*', elements => {
      return elements
        .map(el => el.textContent)
        .filter(text => text && text.includes('Loading'))
        .slice(0, 5);
    });
    
    console.log('🔍 Loading states found:', loadingElements.length > 0 ? loadingElements : 'None');
    
    // Check for form elements
    const formElements = await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input')).map(input => ({
        type: input.type,
        name: input.name,
        placeholder: input.placeholder,
        visible: input.offsetParent !== null
      }));
      
      const buttons = Array.from(document.querySelectorAll('button')).map(button => ({
        text: button.textContent.trim(),
        visible: button.offsetParent !== null
      }));
      
      return { inputs, buttons };
    });
    
    console.log('📝 Form inputs found:', formElements.inputs.length);
    formElements.inputs.forEach((input, i) => {
      console.log(`   ${i + 1}. ${input.type} [${input.name}] "${input.placeholder}" (visible: ${input.visible})`);
    });
    
    console.log('🔘 Buttons found:', formElements.buttons.length);
    formElements.buttons.forEach((button, i) => {
      console.log(`   ${i + 1}. "${button.text}" (visible: ${button.visible})`);
    });
    
    // Check page title and main content
    const title = await page.title();
    console.log('📄 Page title:', title);
    
    const bodyText = await page.evaluate(() => document.body.textContent);
    const contentLength = bodyText.length;
    console.log('📏 Page content length:', contentLength, 'characters');
    
    if (contentLength < 200) {
      console.log('⚠️ Minimal content detected. First 200 characters:');
      console.log('"' + bodyText.substring(0, 200) + '"');
    }
    
    // Try to interact with the form if present
    console.log('🎯 Testing form interaction...');
    
    try {
      const tripNameInput = await page.$('input[name="tripName"]');
      if (tripNameInput) {
        await tripNameInput.type('Manual Test Trip');
        const value = await page.evaluate(el => el.value, tripNameInput);
        console.log('✅ Trip name input working:', value === 'Manual Test Trip');
      } else {
        console.log('❌ Trip name input not found');
      }
      
      const destinationInput = await page.$('input[placeholder*="destination"]');
      if (destinationInput) {
        await destinationInput.type('Manual Test City');
        const value = await page.evaluate(el => el.value, destinationInput);
        console.log('✅ Destination input working:', value === 'Manual Test City');
      } else {
        console.log('❌ Destination input not found');
      }
      
      const saveButton = await page.$('button:has-text("Save Trip")');
      if (saveButton) {
        console.log('✅ Save button found');
        await saveButton.click();
        await page.waitForTimeout(1000);
        
        // Check if data appears after save
        const hasTestTrip = await page.$eval('body', body => body.textContent.includes('Manual Test Trip'));
        const hasTestCity = await page.$eval('body', body => body.textContent.includes('Manual Test City'));
        
        console.log('📋 After form submission:');
        console.log('   - Trip name displays:', hasTestTrip);
        console.log('   - Destination displays:', hasTestCity);
        
        // Check for loading states after submission
        const postSubmissionLoading = await page.$$eval('*', elements => {
          return elements
            .map(el => el.textContent)
            .filter(text => text && text.includes('Loading'))
            .slice(0, 3);
        });
        
        console.log('🔄 Loading states after submission:', postSubmissionLoading.length > 0 ? postSubmissionLoading : 'None');
        
      } else {
        console.log('❌ Save button not found');
      }
      
    } catch (error) {
      console.log('❌ Form interaction error:', error.message);
    }
    
    // Take screenshot for documentation
    await page.screenshot({ path: 'manual-validation-screenshot.png', fullPage: true });
    console.log('📸 Screenshot saved as manual-validation-screenshot.png');
    
    console.log('='.repeat(60));
    console.log('🎯 VALIDATION SUMMARY:');
    console.log(`   - Page loads: ${contentLength > 100 ? 'SUCCESS' : 'MINIMAL'}`);
    console.log(`   - Forms present: ${formElements.inputs.length > 0 ? 'YES' : 'NO'}`);
    console.log(`   - Buttons present: ${formElements.buttons.length > 0 ? 'YES' : 'NO'}`);
    console.log(`   - Loading issues: ${loadingElements.length > 0 ? 'DETECTED' : 'NONE'}`);
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('❌ Validation error:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

validateAppState().catch(console.error);