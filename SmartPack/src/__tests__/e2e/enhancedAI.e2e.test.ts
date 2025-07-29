import { test, expect } from '@playwright/test';

test.describe('Enhanced AI E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage and start fresh
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('Business trip generates intelligent recommendations', async ({ page }) => {
    // Fill out business trip form
    await page.fill('[aria-label="Trip Name"]', 'Corporate Conference 2025');
    await page.fill('[data-testid="destination-input-0"]', 'Tokyo, Japan');
    await page.fill('[aria-label="Trip Details"]', 'Important business meetings with international clients and conference presentations');
    await page.fill('[aria-label="Start Date"]', '2025-08-01');
    await page.fill('[aria-label="End Date"]', '2025-08-04');
    
    // Select plane travel
    await page.check('[aria-label="Plane"]');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for navigation to main layout
    await expect(page.locator('text=Trip Details')).toBeVisible({ timeout: 10000 });
    
    // Generate packing list
    await page.click('button:has-text("Generate Smart Packing List")');
    
    // Wait for AI response and verify business-specific items
    await expect(page.locator('text=Business suits/formal wear')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('text=Laptop + charger')).toBeVisible();
    await expect(page.locator('text=Business cards')).toBeVisible();
    
    // Verify smart quantity calculations (4 days = 6 pairs with extras)
    await expect(page.locator('text=6 pairs underwear')).toBeVisible();
    await expect(page.locator('text=6 pairs socks')).toBeVisible();
    
    // Verify destination-specific suggestions
    await expect(page.locator('text=Translation app')).toBeVisible();
    
    // Test that items can be checked/unchecked
    await page.click('input[type="checkbox"]:near(text="Business suits/formal wear")');
    await expect(page.locator('input[type="checkbox"]:near(text="Business suits/formal wear")')).toBeChecked();
    
    // Verify persistence by refreshing page
    await page.reload();
    await expect(page.locator('input[type="checkbox"]:near(text="Business suits/formal wear")')).toBeChecked();
  });

  test('Beach vacation generates appropriate gear recommendations', async ({ page }) => {
    // Fill out beach vacation form
    await page.fill('[aria-label="Trip Name"]', 'Hawaii Beach Paradise');
    await page.fill('[data-testid="destination-input-0"]', 'Honolulu, Hawaii');
    await page.fill('[aria-label="Trip Details"]', 'Relaxing beach vacation with swimming, surfing, and water sports');
    await page.fill('[aria-label="Start Date"]', '2025-07-15');
    await page.fill('[aria-label="End Date"]', '2025-07-22');
    
    // Select plane travel
    await page.check('[aria-label="Plane"]');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for navigation
    await expect(page.locator('text=Trip Details')).toBeVisible({ timeout: 10000 });
    
    // Generate packing list
    await page.click('button:has-text("Generate Smart Packing List")');
    
    // Verify beach-specific items
    await expect(page.locator('text=Swimwear')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('text=Beach towel')).toBeVisible();
    await expect(page.locator('text=Sunscreen (SPF 30+)')).toBeVisible();
    await expect(page.locator('text=Sunglasses')).toBeVisible();
    
    // Verify longer trip gets more underwear (7 days = 9 pairs)
    await expect(page.locator('text=9 pairs underwear')).toBeVisible();
    
    // Verify beach-specific suggestions
    await expect(page.locator('text=Insect repellent')).toBeVisible();
    await expect(page.locator('text=After-sun lotion')).toBeVisible();
  });

  test('Adventure trip generates outdoor gear recommendations', async ({ page }) => {
    // Fill out adventure trip form
    await page.fill('[aria-label="Trip Name"]', 'Rocky Mountain Expedition');
    await page.fill('[data-testid="destination-input-0"]', 'Rocky Mountain National Park, Colorado');
    await page.fill('[aria-label="Trip Details"]', 'Challenging mountain hiking and camping in cold weather conditions');
    await page.fill('[aria-label="Start Date"]', '2025-09-10');
    await page.fill('[aria-label="End Date"]', '2025-09-15');
    
    // Select car travel for road trip
    await page.check('[aria-label="Car"]');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for navigation
    await expect(page.locator('text=Trip Details')).toBeVisible({ timeout: 10000 });
    
    // Generate packing list
    await page.click('button:has-text("Generate Smart Packing List")');
    
    // Verify adventure-specific items
    await expect(page.locator('text=Hiking boots')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('text=First aid kit')).toBeVisible();
    await expect(page.locator('text=Winter jacket/coat')).toBeVisible();
    await expect(page.locator('text=Warm gloves')).toBeVisible();
    
    // Verify medium trip duration (5 days = 7 pairs)
    await expect(page.locator('text=7 pairs underwear')).toBeVisible();
    
    // Verify adventure-specific suggestions
    await expect(page.locator('text=Headlamp/flashlight')).toBeVisible();
    await expect(page.locator('text=Emergency whistle')).toBeVisible();
  });

  test('Cold weather trip generates appropriate winter gear', async ({ page }) => {
    // Fill out cold weather trip
    await page.fill('[aria-label="Trip Name"]', 'Iceland Winter Adventure');
    await page.fill('[data-testid="destination-input-0"]', 'Reykjavik, Iceland');
    await page.fill('[aria-label="Trip Details"]', 'Northern lights tour in freezing winter conditions');
    await page.fill('[aria-label="Start Date"]', '2025-01-15');
    await page.fill('[aria-label="End Date"]', '2025-01-18');
    
    await page.check('[aria-label="Plane"]');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Trip Details')).toBeVisible({ timeout: 10000 });
    await page.click('button:has-text("Generate Smart Packing List")');
    
    // Verify cold weather items
    await expect(page.locator('text=Winter jacket/coat')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('text=Warm gloves')).toBeVisible();
    await expect(page.locator('text=Warm hat/beanie')).toBeVisible();
    await expect(page.locator('text=Thermal underwear')).toBeVisible();
    
    // Verify cold weather suggestions
    await expect(page.locator('text=Hand warmers')).toBeVisible();
    await expect(page.locator('text=Thermal socks')).toBeVisible();
  });

  test('Plane travel generates flight-specific items', async ({ page }) => {
    // Fill out international flight trip
    await page.fill('[aria-label="Trip Name"]', 'International Business Flight');
    await page.fill('[data-testid="destination-input-0"]', 'London, UK');
    await page.fill('[aria-label="Trip Details"]', 'Long-haul international business flight');
    await page.fill('[aria-label="Start Date"]', '2025-06-01');
    await page.fill('[aria-label="End Date"]', '2025-06-05');
    
    await page.check('[aria-label="Plane"]');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Trip Details')).toBeVisible({ timeout: 10000 });
    await page.click('button:has-text("Generate Smart Packing List")');
    
    // Verify plane-specific items
    await expect(page.locator('text=Neck pillow')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('text=Headphones/earbuds')).toBeVisible();
    await expect(page.locator('text=Eye mask & earplugs')).toBeVisible();
    await expect(page.locator('text=Passport')).toBeVisible();
    
    // Verify plane-specific suggestions
    await expect(page.locator('text=Compression socks')).toBeVisible();
  });

  test('Road trip generates car-specific items', async ({ page }) => {
    // Fill out road trip
    await page.fill('[aria-label="Trip Name"]', 'Cross Country Road Trip');
    await page.fill('[data-testid="destination-input-0"]', 'Los Angeles, California');
    await page.fill('[aria-label="Trip Details"]', 'Epic cross-country road trip adventure');
    await page.fill('[aria-label="Start Date"]', '2025-07-10');
    await page.fill('[aria-label="End Date"]', '2025-07-15');
    
    await page.check('[aria-label="Car"]');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Trip Details')).toBeVisible({ timeout: 10000 });
    await page.click('button:has-text("Generate Smart Packing List")');
    
    // Verify car-specific items
    await expect(page.locator('text=Driver\'s license')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('text=Car phone charger')).toBeVisible();
    await expect(page.locator('text=Snacks & water')).toBeVisible();
    
    // Verify road trip suggestions
    await expect(page.locator('text=Emergency roadside kit')).toBeVisible();
  });

  test('Trip duration affects quantity calculations', async ({ page }) => {
    // Test very short trip (1 day)
    await page.fill('[aria-label="Trip Name"]', 'One Day Business Trip');
    await page.fill('[data-testid="destination-input-0"]', 'Chicago, Illinois');
    await page.fill('[aria-label="Start Date"]', '2025-08-01');
    await page.fill('[aria-label="End Date"]', '2025-08-01'); // Same day
    
    await page.check('[aria-label="Plane"]');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Trip Details')).toBeVisible({ timeout: 10000 });
    await page.click('button:has-text("Generate Smart Packing List")');
    
    // Should default to minimum quantities for same-day trip
    await expect(page.locator('text=3 pairs underwear')).toBeVisible({ timeout: 15000 });
    
    // Go back and test longer trip
    await page.click('button:has-text("Edit Trip")');
    await page.fill('[aria-label="End Date"]', '2025-08-15'); // 14 days
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Trip Details')).toBeVisible({ timeout: 10000 });
    await page.click('button:has-text("Generate Smart Packing List")');
    
    // Should cap at maximum quantities for long trip
    await expect(page.locator('text=14 pairs underwear')).toBeVisible({ timeout: 15000 });
  });

  test('App handles API errors gracefully', async ({ page }) => {
    // Mock API to return an error
    await page.route('**/generate', route => {
      route.fulfill({
        status: 503,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Service temporarily unavailable' })
      });
    });

    await page.fill('[aria-label="Trip Name"]', 'Test Trip');
    await page.fill('[data-testid="destination-input-0"]', 'Test City');
    await page.fill('[aria-label="Start Date"]', '2025-08-01');
    await page.fill('[aria-label="End Date"]', '2025-08-03');
    
    await page.check('[aria-label="Plane"]');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Trip Details')).toBeVisible({ timeout: 10000 });
    await page.click('button:has-text("Generate Smart Packing List")');
    
    // Should display error message
    await expect(page.locator('text=/error|failed|unavailable/i')).toBeVisible({ timeout: 15000 });
  });

  test('Enhanced AI suggestions persist across sessions', async ({ page }) => {
    // Create a business trip with AI suggestions
    await page.fill('[aria-label="Trip Name"]', 'Business Conference');
    await page.fill('[data-testid="destination-input-0"]', 'New York, USA');
    await page.fill('[aria-label="Trip Details"]', 'Important client meetings and presentations');
    await page.fill('[aria-label="Start Date"]', '2025-08-01');
    await page.fill('[aria-label="End Date"]', '2025-08-04');
    
    await page.check('[aria-label="Plane"]');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Trip Details')).toBeVisible({ timeout: 10000 });
    await page.click('button:has-text("Generate Smart Packing List")');
    
    // Wait for items to load and check one
    await expect(page.locator('text=Business suits/formal wear')).toBeVisible({ timeout: 15000 });
    await page.click('input[type="checkbox"]:near(text="Business suits/formal wear")');
    
    // Close and reopen browser (simulate new session)
    await page.close();
    const newPage = await page.context().newPage();
    await newPage.goto('/');
    
    // Should still have the checked state
    await expect(newPage.locator('input[type="checkbox"]:near(text="Business suits/formal wear")')).toBeChecked();
    
    // And still show AI-generated suggestions
    await expect(newPage.locator('text=Translation app')).toBeVisible();
  });

  test('Multiple destinations generate region-specific suggestions', async ({ page }) => {
    // Test multi-city European trip
    await page.fill('[aria-label="Trip Name"]', 'European Multi-City Tour');
    await page.fill('[data-testid="destination-input-0"]', 'Paris, France');
    
    // Add second destination
    await page.click('button:has-text("Add Destination")');
    await page.fill('[data-testid="destination-input-1"]', 'Rome, Italy');
    
    // Add third destination
    await page.click('button:has-text("Add Destination")');
    await page.fill('[data-testid="destination-input-2"]', 'Barcelona, Spain');
    
    await page.fill('[aria-label="Trip Details"]', 'Multi-city European cultural tour');
    await page.fill('[aria-label="Start Date"]', '2025-05-15');
    await page.fill('[aria-label="End Date"]', '2025-05-25');
    
    await page.check('[aria-label="Train"]');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Trip Details')).toBeVisible({ timeout: 10000 });
    await page.click('button:has-text("Generate Smart Packing List")');
    
    // Should generate Europe-specific suggestions
    await expect(page.locator('text=Comfortable walking shoes')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('text=Light jacket for evenings')).toBeVisible();
    
    // Should show all destinations in trip details
    await expect(page.locator('text=Paris, France')).toBeVisible();
    await expect(page.locator('text=Rome, Italy')).toBeVisible();
    await expect(page.locator('text=Barcelona, Spain')).toBeVisible();
  });
});
