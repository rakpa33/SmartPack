import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ColumnLayoutProvider, useColumnLayout } from '@hooks/useColumnLayout';
import type { ReactNode } from 'react';

// Mock window dimensions
const mockWindowDimensions = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });
};

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('useColumnLayout - Phase 4: Responsive Layout Logic', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockClear();
    mockWindowDimensions(1200, 800); // Default desktop
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <ColumnLayoutProvider>{children}</ColumnLayoutProvider>
  );

  describe('Desktop Horizontal Shrinking Priority', () => {
    it('should return correct shrinking priority order', () => {
      const { result } = renderHook(() => useColumnLayout(), { wrapper });

      const priority = result.current.getShrinkingPriority();
      expect(priority).toEqual(['suggestions', 'tripDetails', 'packingChecklist']);
    });

    it('should hide suggestions first when space is limited', () => {
      // Simulate narrow desktop width that can only fit 2 columns
      mockWindowDimensions(600, 800);

      const { result } = renderHook(() => useColumnLayout(), { wrapper });

      act(() => {
        result.current.enforceHorizontalConstraints();
      });

      // Suggestions should be hidden first due to priority
      expect(result.current.columnVisibility.suggestions).toBe(false);
      expect(result.current.columnVisibility.tripDetails).toBe(true);
      expect(result.current.columnVisibility.packingChecklist).toBe(true);
    });

    it('should hide trip details next if still too narrow', () => {
      // Simulate very narrow width that can only fit 1 column
      mockWindowDimensions(300, 800);

      const { result } = renderHook(() => useColumnLayout(), { wrapper });

      act(() => {
        result.current.enforceHorizontalConstraints();
      });

      // Only packing checklist should remain (highest priority)
      expect(result.current.columnVisibility.suggestions).toBe(false);
      expect(result.current.columnVisibility.tripDetails).toBe(false);
      expect(result.current.columnVisibility.packingChecklist).toBe(true);
    });
  });

  describe('Horizontal Scroll Limitation', () => {
    it('should determine if minimum widths can fit', () => {
      mockWindowDimensions(1000, 800);

      const { result } = renderHook(() => useColumnLayout(), { wrapper });

      // 3 columns at 275px each + drag handles should fit in 1000px
      const canFit3 = result.current.canFitMinimumWidths(['tripDetails', 'packingChecklist', 'suggestions']);
      expect(canFit3).toBe(true);

      // But not in 500px
      mockWindowDimensions(500, 800);
      const canFit3Narrow = result.current.canFitMinimumWidths(['tripDetails', 'packingChecklist', 'suggestions']);
      expect(canFit3Narrow).toBe(false);
    });

    it('should limit to max 2 min-width columns when space is tight', () => {
      mockWindowDimensions(600, 800); // Can fit 2 columns at minimum width

      const { result } = renderHook(() => useColumnLayout(), { wrapper });

      act(() => {
        result.current.enforceHorizontalConstraints();
      });

      const visibleCount = result.current.getVisibleColumnCount();
      expect(visibleCount).toBeLessThanOrEqual(2);
    });
  });

  describe('Responsive Width Calculation', () => {
    it('should distribute extra space proportionally on wide screens', () => {
      mockWindowDimensions(1400, 800); // Plenty of space

      const { result } = renderHook(() => useColumnLayout(), { wrapper });

      const responsiveWidths = result.current.getResponsiveWidths();

      // All columns should be larger than minimum width
      expect(responsiveWidths.tripDetails).toBeGreaterThan(275);
      expect(responsiveWidths.packingChecklist).toBeGreaterThan(275);
      expect(responsiveWidths.suggestions).toBeGreaterThan(275);

      // Packing checklist should get the most extra space (50%)
      expect(responsiveWidths.packingChecklist).toBeGreaterThan(responsiveWidths.tripDetails);
      expect(responsiveWidths.packingChecklist).toBeGreaterThan(responsiveWidths.suggestions);
    });

    it('should use minimum widths when space is tight', () => {
      mockWindowDimensions(900, 800); // Just enough for 3 min-width columns

      const { result } = renderHook(() => useColumnLayout(), { wrapper });

      const responsiveWidths = result.current.getResponsiveWidths();

      // Should be at or near minimum width
      expect(responsiveWidths.tripDetails).toBe(275);
      expect(responsiveWidths.packingChecklist).toBe(275);
      expect(responsiveWidths.suggestions).toBe(275);
    });

    it('should ensure packing checklist fills available space when priority system applies', () => {
      mockWindowDimensions(1200, 800);

      const { result } = renderHook(() => useColumnLayout(), { wrapper });

      const responsiveWidths = result.current.getResponsiveWidths();

      // Packing checklist should get priority in space allocation
      const packingWidth = responsiveWidths.packingChecklist;
      const tripWidth = responsiveWidths.tripDetails;
      const suggestionsWidth = responsiveWidths.suggestions;

      // Packing checklist should get the largest allocation
      expect(packingWidth).toBeGreaterThanOrEqual(tripWidth);
      expect(packingWidth).toBeGreaterThanOrEqual(suggestionsWidth);
    });
  });

  describe('Mobile Landscape Toggle Logic', () => {
    it('should enforce max 2 columns on mobile landscape', () => {
      mockWindowDimensions(600, 400); // Mobile landscape

      const { result } = renderHook(() => useColumnLayout(), { wrapper });

      // Should automatically enforce mobile landscape rules
      const visibleCount = result.current.getVisibleColumnCount();
      expect(visibleCount).toBeLessThanOrEqual(2);
    });

    it('should implement Trip Details ↔ Suggestions toggle when Packing Checklist is active', () => {
      mockWindowDimensions(600, 400); // Mobile landscape

      const { result } = renderHook(() => useColumnLayout(), { wrapper });

      // Ensure packing checklist is visible
      expect(result.current.columnVisibility.packingChecklist).toBe(true);

      // Should allow toggling between trip details and suggestions
      const initialTripVisible = result.current.columnVisibility.tripDetails;
      const initialSuggestionsVisible = result.current.columnVisibility.suggestions;

      // At most one of trip details or suggestions should be visible alongside packing checklist
      if (result.current.getVisibleColumnCount() === 2) {
        expect(initialTripVisible !== initialSuggestionsVisible).toBe(true); // XOR logic
      }
    });
  });

  describe('Integration with Existing Business Rules', () => {
    it('should maintain minimum 1 column visible rule', () => {
      mockWindowDimensions(200, 800); // Extremely narrow

      const { result } = renderHook(() => useColumnLayout(), { wrapper });

      act(() => {
        result.current.enforceHorizontalConstraints();
      });

      expect(result.current.getVisibleColumnCount()).toBeGreaterThanOrEqual(1);
    });

    it('should respect mobile portrait single column rule', () => {
      mockWindowDimensions(400, 800); // Mobile portrait

      const { result } = renderHook(() => useColumnLayout(), { wrapper });

      expect(result.current.getVisibleColumnCount()).toBe(1);
    });

    it('should work with existing column toggle functionality', () => {
      const { result } = renderHook(() => useColumnLayout(), { wrapper });

      act(() => {
        result.current.toggleColumn('suggestions');
      });

      // Should still be able to toggle columns
      expect(result.current.columnVisibility.suggestions).toBe(false);

      // Responsive widths should adjust accordingly
      const responsiveWidths = result.current.getResponsiveWidths();
      expect(responsiveWidths.tripDetails).toBeGreaterThan(275);
      expect(responsiveWidths.packingChecklist).toBeGreaterThan(275);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle window resize events', () => {
      const { result } = renderHook(() => useColumnLayout(), { wrapper });

      // Start wide
      mockWindowDimensions(1400, 800);
      let responsiveWidths = result.current.getResponsiveWidths();
      const widePackingWidth = responsiveWidths.packingChecklist;

      // Resize to narrow
      mockWindowDimensions(600, 800);

      // Trigger resize handling
      act(() => {
        window.dispatchEvent(new Event('resize'));
      });

      responsiveWidths = result.current.getResponsiveWidths();
      const narrowPackingWidth = responsiveWidths.packingChecklist;

      // Width should adjust to smaller screen
      expect(narrowPackingWidth).toBeLessThan(widePackingWidth);
    });

    it('should handle server-side rendering gracefully', () => {
      // Mock SSR environment
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;

      const { result } = renderHook(() => useColumnLayout(), { wrapper });

      // Should not throw and provide sensible defaults
      expect(result.current.canFitMinimumWidths(['tripDetails'])).toBe(true);
      expect(result.current.getResponsiveWidths()).toBeDefined();

      // Restore window
      global.window = originalWindow;
    });
  });
});
