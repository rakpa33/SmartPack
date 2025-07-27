declare module 'jest-axe' {
  import { AxeResults, AxeRunOptions } from 'axe-core';
  import { MatcherFunction } from 'expect';

  export function axe(
    html: HTMLElement | string,
    options?: AxeRunOptions
  ): Promise<AxeResults>;

  export const toHaveNoViolations: MatcherFunction;
}
