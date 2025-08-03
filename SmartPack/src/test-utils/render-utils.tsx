import type { ReactNode } from 'react';
import { render, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { MemoryRouterProps } from 'react-router-dom';

export function renderWithProviders(
  ui: ReactNode,
  routerProps?: MemoryRouterProps
) {
  // Wrap render in act to handle state updates
  let renderResult: ReturnType<typeof render>;
  
  act(() => {
    renderResult = render(
      <MemoryRouter {...routerProps}>{ui}</MemoryRouter>
    );
  });
  
  return renderResult!;
}
