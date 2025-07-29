import { test as base } from '@playwright/test';
import { TripFormPage } from '../pages/trip-form.page';
import { MainLayoutPage } from '../pages/main-layout.page';

type TestFixtures = {
  tripFormPage: TripFormPage;
  mainLayoutPage: MainLayoutPage;
};

export const test = base.extend<TestFixtures>({
  tripFormPage: async ({ page }, use) => {
    const tripFormPage = new TripFormPage(page);
    await use(tripFormPage);
  },
  
  mainLayoutPage: async ({ page }, use) => {
    const mainLayoutPage = new MainLayoutPage(page);
    await use(mainLayoutPage);
  },
});

export { expect } from '@playwright/test';
