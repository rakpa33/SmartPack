import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ColumnLayoutProvider } from '@hooks/useColumnLayout';
import DragHandle from '@components/DragHandle';

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock haptic feedback
vi.mock('@hooks/useHapticFeedback', () => ({
  useHapticFeedback: () => ({
    vibrate: vi.fn(),
    trigger: vi.fn(),
    impact: vi.fn(),
    selection: vi.fn(),
  }),
}));

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ColumnLayoutProvider>
    {children}
  </ColumnLayoutProvider>
);

describe('Phase 3: Drag Handle System Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock window.innerWidth for desktop
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });

    // Mock requestAnimationFrame
    global.requestAnimationFrame = vi.fn((cb) => {
      cb(0);
      return 0;
    });
  });

  it('Phase 3: Successfully renders drag handles for all column pairs', () => {
    render(
      <TestWrapper>
        <div className="flex">
          {/* Simulate MainLayout structure */}
          <div className="column">Trip Details</div>
          <DragHandle columnId="tripDetails" position="right" />

          <div className="column">Packing Checklist</div>
          <DragHandle columnId="packingChecklist" position="right" />

          <div className="column">Suggestions</div>
        </div>
      </TestWrapper>
    );

    // Verify both drag handles are rendered
    const handles = screen.getAllByRole('separator');
    expect(handles).toHaveLength(2);

    // Verify correct accessibility labels
    expect(handles[0]).toHaveAttribute('aria-label', 'Resize tripDetails column');
    expect(handles[1]).toHaveAttribute('aria-label', 'Resize packingChecklist column');
  });

  it('Phase 3: Drag handles have proper accessibility and interaction setup', () => {
    render(
      <TestWrapper>
        <DragHandle columnId="tripDetails" position="right" />
      </TestWrapper>
    );

    const handle = screen.getByRole('separator');

    // Accessibility
    expect(handle).toHaveAttribute('role', 'separator');
    expect(handle).toHaveAttribute('aria-orientation', 'vertical');
    expect(handle).toHaveAttribute('tabIndex', '0');

    // Styling for interaction
    expect(handle).toHaveClass('cursor-col-resize');
    expect(handle).toHaveClass('select-none');
  });

  it('Phase 3: Drag handles are properly integrated with responsive design', () => {
    render(
      <TestWrapper>
        <DragHandle
          columnId="packingChecklist"
          position="right"
          className="hidden md:flex"
        />
      </TestWrapper>
    );

    const handle = screen.getByRole('separator');

    // Should have responsive classes applied
    expect(handle).toHaveClass('hidden');
    expect(handle).toHaveClass('md:flex');
  });

  it('Phase 3: Drag handles support all three column types', () => {
    const columnIds = ['tripDetails', 'packingChecklist', 'suggestions'] as const;

    columnIds.forEach((columnId) => {
      const { unmount } = render(
        <TestWrapper>
          <DragHandle columnId={columnId} position="right" />
        </TestWrapper>
      );

      const handle = screen.getByRole('separator');
      expect(handle).toBeInTheDocument();
      expect(handle).toHaveAttribute('aria-label', `Resize ${columnId} column`);

      unmount();
    });
  });

  it('Phase 3: System successfully integrates all three hooks (useColumnLayout, useResizable, useHapticFeedback)', () => {
    // This test verifies that all Phase 3 components can be instantiated together
    expect(() => {
      render(
        <TestWrapper>
          <DragHandle columnId="tripDetails" position="right" />
          <DragHandle columnId="packingChecklist" position="right" />
        </TestWrapper>
      );
    }).not.toThrow();

    // Verify multiple handles can coexist
    const handles = screen.getAllByRole('separator');
    expect(handles).toHaveLength(2);
  });
});
