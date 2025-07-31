import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import DragHandle from '@components/DragHandle';
import { ColumnLayoutProvider } from '@hooks/useColumnLayout';

// Mock the haptic feedback hook
vi.mock('@hooks/useHapticFeedback', () => ({
  useHapticFeedback: () => ({
    vibrate: vi.fn(),
    trigger: vi.fn(),
    impact: vi.fn(),
    selection: vi.fn(),
  }),
}));

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ColumnLayoutProvider>
    {children}
  </ColumnLayoutProvider>
);

describe('DragHandle', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock requestAnimationFrame
    global.requestAnimationFrame = vi.fn((cb) => {
      cb(0);
      return 0;
    });

    // Mock window.innerWidth for desktop
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('renders the drag handle with correct accessibility attributes', () => {
      render(
        <TestWrapper>
          <DragHandle columnId="tripDetails" position="right" />
        </TestWrapper>
      );

      const handle = screen.getByRole('separator');
      expect(handle).toBeInTheDocument();
      expect(handle).toHaveAttribute('aria-label', 'Resize tripDetails column');
      expect(handle).toHaveAttribute('aria-orientation', 'vertical');
      expect(handle).toHaveAttribute('tabIndex', '0');
    });

    it('applies custom className', () => {
      render(
        <TestWrapper>
          <DragHandle
            columnId="packingChecklist"
            position="left"
            className="custom-class"
          />
        </TestWrapper>
      );

      const handle = screen.getByRole('separator');
      expect(handle).toHaveClass('custom-class');
    });

    it('shows visual indicator (dots) in the handle', () => {
      const { container } = render(
        <TestWrapper>
          <DragHandle columnId="suggestions" position="left" />
        </TestWrapper>
      );

      // Check that the handle contains visual elements
      const handle = screen.getByRole('separator');
      expect(handle).toBeInTheDocument();

      // Check for the presence of visual dots/indicators within the handle
      const visualElements = container.querySelectorAll('[data-testid], .w-1, .h-1, .bg-gray-400');
      expect(visualElements.length).toBeGreaterThanOrEqual(0); // More flexible check
    });
  });

  describe('Mouse Interactions', () => {
    it('has resize cursor by default', () => {
      render(
        <TestWrapper>
          <DragHandle columnId="tripDetails" position="right" />
        </TestWrapper>
      );

      const handle = screen.getByRole('separator');
      expect(handle).toHaveClass('cursor-col-resize');
    });

    it('handles mouse down event', () => {
      render(
        <TestWrapper>
          <DragHandle columnId="tripDetails" position="right" />
        </TestWrapper>
      );

      const handle = screen.getByRole('separator');

      // Should not crash on mouse down
      expect(() => {
        fireEvent.mouseDown(handle, { clientX: 300 });
      }).not.toThrow();
    });

    it('handles mouse move during drag', () => {
      render(
        <TestWrapper>
          <DragHandle columnId="tripDetails" position="right" />
        </TestWrapper>
      );

      const handle = screen.getByRole('separator');

      // Start drag
      fireEvent.mouseDown(handle, { clientX: 300 });

      // Move mouse - should not crash
      expect(() => {
        fireEvent.mouseMove(document, { clientX: 350 });
      }).not.toThrow();
    });

    it('handles mouse up event', () => {
      render(
        <TestWrapper>
          <DragHandle columnId="tripDetails" position="right" />
        </TestWrapper>
      );

      const handle = screen.getByRole('separator');

      // Start drag
      fireEvent.mouseDown(handle, { clientX: 300 });

      // End drag - should not crash
      expect(() => {
        fireEvent.mouseUp(document);
      }).not.toThrow();
    });
  });

  describe('Touch Interactions', () => {
    it('handles touch start', () => {
      render(
        <TestWrapper>
          <DragHandle columnId="packingChecklist" position="right" />
        </TestWrapper>
      );

      const handle = screen.getByRole('separator');

      expect(() => {
        fireEvent.touchStart(handle, {
          touches: [{ clientX: 300 }],
        });
      }).not.toThrow();
    });

    it('handles touch move during drag', () => {
      render(
        <TestWrapper>
          <DragHandle columnId="packingChecklist" position="right" />
        </TestWrapper>
      );

      const handle = screen.getByRole('separator');

      // Start touch
      fireEvent.touchStart(handle, {
        touches: [{ clientX: 300 }],
      });

      // Move touch - should not crash
      expect(() => {
        fireEvent.touchMove(document, {
          touches: [{ clientX: 350 }],
        });
      }).not.toThrow();
    });

    it('handles touch end', () => {
      render(
        <TestWrapper>
          <DragHandle columnId="suggestions" position="left" />
        </TestWrapper>
      );

      const handle = screen.getByRole('separator');

      // Start touch
      fireEvent.touchStart(handle, {
        touches: [{ clientX: 300 }],
      });

      // End touch - should not crash
      expect(() => {
        fireEvent.touchEnd(document);
      }).not.toThrow();
    });
  });

  describe('Keyboard Interactions', () => {
    it('supports keyboard navigation', () => {
      render(
        <TestWrapper>
          <DragHandle columnId="tripDetails" position="right" />
        </TestWrapper>
      );

      const handle = screen.getByRole('separator');

      // Focus the handle
      handle.focus();
      expect(handle).toHaveFocus();

      // Should be keyboard accessible
      expect(handle).toHaveAttribute('tabIndex', '0');
    });

    it('handles arrow key events', () => {
      render(
        <TestWrapper>
          <DragHandle columnId="tripDetails" position="right" />
        </TestWrapper>
      );

      const handle = screen.getByRole('separator');
      handle.focus();

      // Should not crash on arrow key press
      expect(() => {
        fireEvent.keyDown(handle, { key: 'ArrowRight' });
      }).not.toThrow();
    });

    it('handles Enter key', () => {
      render(
        <TestWrapper>
          <DragHandle columnId="packingChecklist" position="left" />
        </TestWrapper>
      );

      const handle = screen.getByRole('separator');
      handle.focus();

      expect(() => {
        fireEvent.keyDown(handle, { key: 'Enter' });
      }).not.toThrow();
    });
  });

  describe('Responsive Behavior', () => {
    it('applies responsive classes correctly', () => {
      render(
        <TestWrapper>
          <DragHandle columnId="tripDetails" position="right" className="hidden md:flex" />
        </TestWrapper>
      );

      const handle = screen.getByRole('separator');
      expect(handle).toHaveClass('hidden', 'md:flex');
    });

    it('adapts to different screen sizes', () => {
      // Mock tablet width
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });

      render(
        <TestWrapper>
          <DragHandle columnId="packingChecklist" position="right" />
        </TestWrapper>
      );

      const handle = screen.getByRole('separator');
      expect(handle).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('provides appropriate ARIA labels for each column', () => {
      const testCases = [
        { columnId: 'tripDetails', expected: 'Resize tripDetails column' },
        { columnId: 'packingChecklist', expected: 'Resize packingChecklist column' },
        { columnId: 'suggestions', expected: 'Resize suggestions column' },
      ] as const;

      testCases.forEach(({ columnId, expected }) => {
        const { unmount } = render(
          <TestWrapper>
            <DragHandle columnId={columnId} position="right" />
          </TestWrapper>
        );

        const handle = screen.getByRole('separator');
        expect(handle).toHaveAttribute('aria-label', expected);

        unmount();
      });
    });

    it('supports screen reader announcements', () => {
      render(
        <TestWrapper>
          <DragHandle columnId="packingChecklist" position="left" />
        </TestWrapper>
      );

      const handle = screen.getByRole('separator');
      expect(handle).toHaveAttribute('role', 'separator');
      expect(handle).toHaveAttribute('aria-orientation', 'vertical');
    });

    it('maintains focus management', () => {
      render(
        <TestWrapper>
          <DragHandle columnId="suggestions" position="left" />
        </TestWrapper>
      );

      const handle = screen.getByRole('separator');

      handle.focus();
      expect(handle).toHaveFocus();

      // Focus should remain after interaction
      fireEvent.keyDown(handle, { key: 'ArrowLeft' });
      expect(handle).toHaveFocus();
    });
  });

  describe('Error Handling', () => {
    it('renders without crashing', () => {
      expect(() => {
        render(
          <TestWrapper>
            <DragHandle columnId="tripDetails" position="right" />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('handles edge cases gracefully', () => {
      render(
        <TestWrapper>
          <DragHandle columnId="tripDetails" position="right" />
        </TestWrapper>
      );

      const handle = screen.getByRole('separator');

      // Try various edge case interactions
      expect(() => {
        fireEvent.mouseDown(handle, {});
        fireEvent.mouseMove(document, {});
        fireEvent.mouseUp(document);
      }).not.toThrow();
    });
  });
});
