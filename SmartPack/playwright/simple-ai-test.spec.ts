import { test, expect } from '@playwright/test';

test('AI suggestions are generated and visible', async ({ page }) => {
  // Set viewport to desktop size to ensure all columns are visible
  await page.setViewportSize({ width: 1280, height: 720 });
  // Generate dynamic future dates to ensure validation passes
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() + 7); // 7 days from today
  const endDate = new Date(today);
  endDate.setDate(today.getDate() + 14); // 14 days from today
  
  const startDateString = startDate.toISOString().split('T')[0]; // YYYY-MM-DD format
  const endDateString = endDate.toISOString().split('T')[0]; // YYYY-MM-DD format
  
  // Go to app
  await page.goto('/');
  
  // Wait for app to load
  await page.waitForLoadState('networkidle');
  
  // Fill trip form to become a non-first-time user
  await page.locator('#tripName').fill('Test Trip');
  await page.locator('#startDate').fill(startDateString);
  await page.locator('#endDate').fill(endDateString);
  await page.locator('[data-testid="destination-input-0"]').fill('Tokyo, Japan');
  await page.locator('#preferences').fill('Business trip');
  await page.getByRole('checkbox', { name: 'Plane' }).check();
  
  // Wait for the submit button to be enabled (form validation to pass)
  await page.waitForSelector('button[type="submit"]:not([disabled])', { timeout: 10000 });
  await page.locator('button[type="submit"]').click();

  // Wait for navigation to Trip Details page
  await expect(page.locator('text=Trip Details')).toBeVisible({ timeout: 10000 });
  
  // Wait for page to fully load after form submission
  await page.waitForLoadState('networkidle');
  
  // Wait for the form data to appear in the Trip Details to confirm it's no longer a first-time user
  await expect(page.locator('text=Test Trip')).toBeVisible({ timeout: 10000 });
  await expect(page.locator('text=Tokyo, Japan')).toBeVisible({ timeout: 5000 });
  
  // On desktop viewport, all columns should now be visible
  // Wait for the layout to stabilize and columns to appear
  await page.waitForTimeout(3000);
  
  // Wait for the AI suggestions section to be visible
  await expect(page.locator('[data-testid="ai-suggestions-section"]')).toBeVisible({ timeout: 10000 });

  // Generate suggestions - wait for the custom prompt input to be available
  const refinementInput = page.locator('#custom-prompt');
  await expect(refinementInput).toBeVisible({ timeout: 10000 });
  await refinementInput.fill('Generate packing suggestions for this trip');
  
  await expect(page.locator('button:has-text("Get AI Suggestions")')).toBeEnabled({ timeout: 5000 });
  await page.locator('button:has-text("Get AI Suggestions")').click();

  // Wait for AI suggestions to appear
  await expect(page.locator('text=Ollama Online')).toBeVisible({ timeout: 30000 });
  
  // Verify suggestions section has content
  const suggestionsSection = page.locator('[data-testid="ai-suggestions-section"]');
  await expect(suggestionsSection).toBeVisible();
  
  // Look for any AI-generated suggestion
  await expect(suggestionsSection.locator('text=Ollama AI').first()).toBeVisible({ timeout: 15000 });
  
  console.log('✅ AI suggestions generated successfully!');
});
