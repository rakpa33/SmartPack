import React from 'react';
import type { ReactNode } from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
// import type-only imports at the top for clarity
import type { RenderResult } from '@testing-library/react';
import type { MemoryRouterProps } from 'react-router-dom';
// import your context providers here

export function renderWithProviders(
  ui: ReactNode,
  routerProps?: MemoryRouterProps
): RenderResult {
  // Add any context providers needed for your app
  return render(
    <MemoryRouter {...routerProps}>{ui}</MemoryRouter>
  );
}
