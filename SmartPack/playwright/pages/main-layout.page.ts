import { Page, Locator, expect } from '@playwright/test';

export class MainLayoutPage {
  readonly page: Page;
  readonly tripDetailsSection: Locator;
  readonly generatePackingListButton: Locator;
  readonly packingListSection: Locator;
  readonly aiSuggestionsSection: Locator;

  constructor(page: Page) {
    this.page = page;
    this.tripDetailsSection = page.locator('text=Trip Details');
    this.generatePackingListButton = page.locator('button:has-text("Get AI Suggestions")');
    this.packingListSection = page.locator('[data-testid="packing-list-section"]');
    this.aiSuggestionsSection = page.locator('h2:has-text("AI Suggestions")');
  }

  async waitForNavigation() {
    await expect(this.tripDetailsSection).toBeVisible({ timeout: 10000 });
  }

  async generatePackingList() {
    // Fill the refinement textbox to enable the button
    const refinementInput = this.page.getByRole('textbox', { name: 'What specific items or activities should we consider?' });
    await refinementInput.fill('Generate packing suggestions for this trip');
    
    // Wait for button to become enabled
    await expect(this.generatePackingListButton).toBeEnabled({ timeout: 5000 });
    
    await this.generatePackingListButton.click();
  }

  async expectItemVisible(itemText: string, timeout = 15000) {
    // Look for items in AI suggestions section specifically, with flexible text matching
    const suggestionsSection = this.page.locator('[data-testid="ai-suggestions-section"]');
    await expect(suggestionsSection.getByText(itemText, { exact: false }).first()).toBeVisible({ timeout });
  }

  async checkItem(itemText: string) {
    // Look for the item in the main packing checklist first
    try {
      const listItem = this.page.locator('li').filter({ hasText: itemText }).first();
      const checkbox = listItem.locator('input[type="checkbox"]');
      await checkbox.check({ timeout: 5000 });
      await expect(checkbox).toBeChecked();
    } catch {
      // If not found in main list, try to add it from suggestions first
      const suggestionsSection = this.page.locator('[data-testid="ai-suggestions-section"]');
      const addButton = suggestionsSection.getByRole('button', { name: new RegExp(`Add.*${itemText}.*to packing list`, 'i') });
      await addButton.click();
      
      // Then check it in the main list
      const listItem = this.page.locator('li').filter({ hasText: itemText }).first();
      const checkbox = listItem.locator('input[type="checkbox"]');
      await checkbox.check();
      await expect(checkbox).toBeChecked();
    }
  }

  async verifyItemChecked(itemText: string) {
    // Find the checkbox within the list item that contains the specified text
    const listItem = this.page.locator('li').filter({ hasText: itemText });
    const checkbox = listItem.locator('input[type="checkbox"]');
    await expect(checkbox).toBeChecked();
  }

  async verifyItemsPersistAfterReload(items: string[]) {
    await this.page.reload();
    for (const item of items) {
      await this.verifyItemChecked(item);
    }
  }
}
