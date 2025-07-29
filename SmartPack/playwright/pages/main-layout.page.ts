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
    this.generatePackingListButton = page.locator('button:has-text("Generate Smart Packing List")');
    this.packingListSection = page.locator('[data-testid="packing-list-section"]');
    this.aiSuggestionsSection = page.locator('h2:has-text("AI Suggestions")');
  }

  async waitForNavigation() {
    await expect(this.tripDetailsSection).toBeVisible({ timeout: 10000 });
  }

  async generatePackingList() {
    await this.generatePackingListButton.click();
  }

  async expectItemVisible(itemText: string, timeout = 15000) {
    await expect(this.page.locator(`text=${itemText}`)).toBeVisible({ timeout });
  }

  async checkItem(itemText: string) {
    const checkbox = this.page.locator(`input[type="checkbox"]:near(text="${itemText}")`);
    await checkbox.check();
    await expect(checkbox).toBeChecked();
  }

  async verifyItemChecked(itemText: string) {
    const checkbox = this.page.locator(`input[type="checkbox"]:near(text="${itemText}")`);
    await expect(checkbox).toBeChecked();
  }

  async verifyItemsPersistAfterReload(items: string[]) {
    await this.page.reload();
    for (const item of items) {
      await this.verifyItemChecked(item);
    }
  }
}
