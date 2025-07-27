import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import MainLayout from '../components/MainLayout';
import '@testing-library/jest-dom';

describe('MainLayout accessibility', () => {
  it('has no accessibility violations (including color contrast)', async () => {
    const { container } = render(
      <MainLayout>
        <div>Test Child</div>
      </MainLayout>
    );
    const results = await axe(container);
    expect(results.violations.length).toBe(0);
  });
});
