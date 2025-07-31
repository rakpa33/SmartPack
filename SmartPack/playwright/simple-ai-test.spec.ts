import { test, expect } from '@playwright/test';

test('AI suggestions are generated and visible', async ({ page }) => {
  // Go to app
  await page.goto('/');
  
  // Fill trip form
  await page.getByRole('textbox', { name: 'Trip Name' }).fill('Test Trip');
  await page.getByRole('textbox', { name: 'Start Date' }).fill('2025-08-01');
  await page.getByRole('textbox', { name: 'End Date' }).fill('2025-08-04');
  await page.locator('[data-testid="destination-input-0"]').fill('Tokyo, Japan');
  await page.getByRole('textbox', { name: 'Trip Details (optional)' }).fill('Business trip');
  await page.getByRole('checkbox', { name: 'Plane' }).check();
  await page.locator('button[type="submit"]').click();

  // Wait for navigation
  await expect(page.locator('text=Trip Details')).toBeVisible({ timeout: 10000 });

  // Generate suggestions
  const refinementInput = page.getByRole('textbox', { name: 'What specific items or activities should we consider?' });
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
