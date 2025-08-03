import { Page, Locator } from '@playwright/test';

export class TripFormPage {
  readonly page: Page;
  readonly tripNameInput: Locator;
  readonly startDateInput: Locator;
  readonly endDateInput: Locator;
  readonly preferencesInput: Locator;
  readonly destinationInput: Locator;
  readonly planeCheckbox: Locator;
  readonly carCheckbox: Locator;
  readonly trainCheckbox: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.tripNameInput = page.locator('#tripName');
    this.startDateInput = page.locator('#startDate');
    this.endDateInput = page.locator('#endDate');
    this.preferencesInput = page.locator('#preferences');
    this.destinationInput = page.locator('[data-testid="destination-input-0"]');
    this.planeCheckbox = page.getByRole('checkbox', { name: 'Plane' });
    this.carCheckbox = page.getByRole('checkbox', { name: 'Car' });
    this.trainCheckbox = page.getByRole('checkbox', { name: 'Train' });
    this.submitButton = page.locator('button[type="submit"]');
  }

  async goto() {
    await this.page.goto('/');
    await this.page.evaluate(() => localStorage.clear());
  }

  async fillBasicTripInfo(tripName: string, destination: string, startDate: string, endDate: string) {
    // Wait for form to be visible and ready
    await this.tripNameInput.waitFor({ state: 'visible' });
    
    await this.tripNameInput.fill(tripName);
    await this.destinationInput.fill(destination);
    await this.startDateInput.fill(startDate);
    await this.endDateInput.fill(endDate);
  }

  async fillPreferences(preferences: string) {
    await this.preferencesInput.fill(preferences);
  }

  async selectTravelMode(mode: 'plane' | 'car' | 'train') {
    switch (mode) {
      case 'plane':
        await this.planeCheckbox.check();
        break;
      case 'car':
        await this.carCheckbox.check();
        break;
      case 'train':
        await this.trainCheckbox.check();
        break;
    }
  }

  async submitForm() {
    await this.submitButton.click();
  }

  async fillCompleteTrip(options: {
    tripName: string;
    destination: string;
    preferences: string;
    startDate: string;
    endDate: string;
    travelMode: 'plane' | 'car' | 'train';
  }) {
    await this.fillBasicTripInfo(options.tripName, options.destination, options.startDate, options.endDate);
    await this.fillPreferences(options.preferences);
    await this.selectTravelMode(options.travelMode);
    await this.submitForm();
  }
}
