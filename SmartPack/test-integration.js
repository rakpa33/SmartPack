// Full integration test for SmartPack
const puppeteer = require('puppeteer');

async function testIntegration() {
  console.log('Starting integration test...');
  
  const browser = await puppeteer.launch({
    headless: false, // Set to true for CI/CD
    defaultViewport: { width: 1280, height: 720 }
  });
  
  const page = await browser.newPage();
  
  // Enable console logging
  page.on('console', msg => {
    console.log('Browser log:', msg.text());
  });
  
  // Enable error logging
  page.on('error', err => {
    console.error('Browser error:', err);
  });
  
  page.on('pageerror', err => {
    console.error('Page error:', err);
  });
  
  // Listen for network requests
  page.on('request', request => {
    if (request.url().includes('localhost:3000')) {
      console.log('API Request:', request.method(), request.url());
      if (request.method() === 'POST') {
        console.log('Request body:', request.postData());
      }
    }
  });
  
  page.on('response', response => {
    if (response.url().includes('localhost:3000')) {
      console.log('API Response:', response.status(), response.url());
    }
  });
  
  try {
    // Navigate to the app
    console.log('Navigating to app...');
    await page.goto('http://localhost:5175', { waitUntil: 'networkidle2' });
    
    // Wait for the app to load
    await page.waitForSelector('input[name="tripName"]', { timeout: 5000 });
    console.log('App loaded successfully');
    
    // Fill in the form
    console.log('Filling in form...');
    await page.type('input[name="tripName"]', 'Test Trip to Paris');
    await page.type('input[name="startDate"]', '2025-08-10');
    await page.type('input[name="endDate"]', '2025-08-15');
    
    // Add destination
    await page.type('input[placeholder*="destination"]', 'Paris, France');
    await page.keyboard.press('Enter');
    
    // Select travel mode
    const planeButton = await page.$('button:has-text("✈️ Plane")');
    if (planeButton) {
      await planeButton.click();
    }
    
    // Save the form
    console.log('Saving form...');
    const saveButton = await page.$('button:has-text("Save")');
    if (saveButton) {
      await saveButton.click();
      console.log('Form saved');
      
      // Wait a bit for the form to process
      await page.waitForTimeout(2000);
      
      // Look for generate button
      const generateButton = await page.$('button:has-text("Generate Smart Packing List")');
      if (generateButton) {
        console.log('Generate button found, clicking...');
        await generateButton.click();
        
        // Wait for API response
        await page.waitForTimeout(5000);
        
        // Check for error or success
        const error = await page.$('.text-red-800');
        if (error) {
          const errorText = await error.textContent();
          console.error('Generation error:', errorText);
        } else {
          console.log('Generation successful!');
        }
      } else {
        console.error('Generate button not found');
      }
    } else {
      console.error('Save button not found');
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    // Keep browser open for debugging
    console.log('Test complete. Browser will remain open for inspection.');
    // await browser.close();
  }
}

testIntegration();