import type { ReactNode } from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { MemoryRouterProps } from 'react-router-dom';
import { TripFormProvider } from '../src/hooks/TripFormContext';

export function renderWithProviders(
  ui: ReactNode,
  routerProps?: MemoryRouterProps
) {
  // Add any context providers needed for your app
  return render(
    <MemoryRouter {...routerProps}>
      <TripFormProvider>
        {ui}
      </TripFormProvider>
    </MemoryRouter>
  );
}
