import { Page, Locator } from '@playwright/test';

export class TripFormPage {
  readonly page: Page;
  readonly tripNameInput: Locator;
  readonly startDateInput: Locator;
  readonly endDateInput: Locator;
  readonly tripDetailsInput: Locator;
  readonly destinationInput: Locator;
  readonly planeCheckbox: Locator;
  readonly carCheckbox: Locator;
  readonly trainCheckbox: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.tripNameInput = page.locator('[aria-label="Trip Name"]');
    this.startDateInput = page.locator('[aria-label="Start Date"]');
    this.endDateInput = page.locator('[aria-label="End Date"]');
    this.tripDetailsInput = page.locator('[aria-label="Trip Details"]');
    this.destinationInput = page.locator('[data-testid="destination-input-0"]');
    this.planeCheckbox = page.locator('[aria-label="Plane"]');
    this.carCheckbox = page.locator('[aria-label="Car"]');
    this.trainCheckbox = page.locator('[aria-label="Train"]');
    this.submitButton = page.locator('button[type="submit"]');
  }

  async goto() {
    await this.page.goto('/');
    await this.page.evaluate(() => localStorage.clear());
  }

  async fillBasicTripInfo(tripName: string, destination: string, startDate: string, endDate: string) {
    await this.tripNameInput.fill(tripName);
    await this.destinationInput.fill(destination);
    await this.startDateInput.fill(startDate);
    await this.endDateInput.fill(endDate);
  }

  async fillTripDetails(details: string) {
    await this.tripDetailsInput.fill(details);
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
    details: string;
    startDate: string;
    endDate: string;
    travelMode: 'plane' | 'car' | 'train';
  }) {
    await this.fillBasicTripInfo(options.tripName, options.destination, options.startDate, options.endDate);
    await this.fillTripDetails(options.details);
    await this.selectTravelMode(options.travelMode);
    await this.submitForm();
  }
}
