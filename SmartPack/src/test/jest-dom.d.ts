/**
 * Custom Jest DOM matchers type definitions for Vitest
 * Extends the default Vitest matchers with @testing-library/jest-dom functionality
 */

import '@testing-library/jest-dom';

declare global {
  namespace Vi {
    interface JestAssertion<T = any> {
      // Jest-axe accessibility matcher
      toHaveNoViolations(): T;
      
      // @testing-library/jest-dom matchers
      toBeInTheDocument(): T;
      toBeVisible(): T;
      toBeEmptyDOMElement(): T;
      toBeInvalid(): T;
      toBeRequired(): T;
      toBeValid(): T;
      toBeChecked(): T;
      toBePartiallyChecked(): T;
      toHaveAttribute(attr: string, value?: any): T;
      toHaveClass(...classNames: string[]): T;
      toHaveFocus(): T;
      toHaveFormValues(expectedValues: Record<string, any>): T;
      toHaveStyle(css: string | Record<string, any>): T;
      toHaveTextContent(text: string | RegExp | ((content: string) => boolean)): T;
      toHaveValue(value: string | string[] | number): T;
      toHaveDisplayValue(value: string | RegExp | (string | RegExp)[]): T;
      toBeDisabled(): T;
      toBeEnabled(): T;
      toHaveDescription(description?: string | RegExp): T;
      toHaveAccessibleDescription(description?: string | RegExp): T;
      toHaveAccessibleName(name?: string | RegExp): T;
      toHaveAccessibleErrorMessage(message?: string | RegExp): T;
    }
  }
}