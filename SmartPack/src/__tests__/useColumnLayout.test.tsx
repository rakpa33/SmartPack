import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ColumnLayoutProvider, useColumnLayout } from '@hooks/useColumnLayout';
import type { ReactNode } from 'react';

// Mock window.innerWidth and innerHeight for responsive testing
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

describe('useColumnLayout', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockClear();
    mockWindowDimensions(1024, 768); // Default desktop
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <ColumnLayoutProvider>{children}</ColumnLayoutProvider>
  );

  describe('State Management', () => {
    it('should initialize with default visibility state', () => {
      const { result } = renderHook(() => useColumnLayout(), { wrapper });

      expect(result.current.columnVisibility).toEqual({
        tripDetails: true,
        packingChecklist: true,
        suggestions: true,
      });
    });

    it('should toggle column visibility', () => {
      const { result } = renderHook(() => useColumnLayout(), { wrapper });

      act(() => {
        result.current.toggleColumn('tripDetails');
      });

      expect(result.current.columnVisibility.tripDetails).toBe(false);
      expect(result.current.columnVisibility.packingChecklist).toBe(true);
      expect(result.current.columnVisibility.suggestions).toBe(true);
    });

    it('should count visible columns correctly', () => {
      const { result } = renderHook(() => useColumnLayout(), { wrapper });

      expect(result.current.getVisibleColumnCount()).toBe(3);

      act(() => {
        result.current.toggleColumn('suggestions');
      });

      expect(result.current.getVisibleColumnCount()).toBe(2);
    });

    it('should return visible columns list', () => {
      const { result } = renderHook(() => useColumnLayout(), { wrapper });

      expect(result.current.getVisibleColumns()).toEqual([
        'tripDetails',
        'packingChecklist',
        'suggestions'
      ]);

      act(() => {
        result.current.toggleColumn('tripDetails');
      });

      expect(result.current.getVisibleColumns()).toEqual([
        'packingChecklist',
        'suggestions'
      ]);
    });
  });

  describe('localStorage Persistence', () => {
    it('should persist visibility changes to localStorage', () => {
      const { result } = renderHook(() => useColumnLayout(), { wrapper });

      act(() => {
        result.current.toggleColumn('tripDetails');
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'smartpack-column-visibility',
        JSON.stringify({
          tripDetails: false,
          packingChecklist: true,
          suggestions: true,
        })
      );
    });

    it('should load initial state from localStorage', () => {
      localStorageMock.getItem.mockReturnValue(
        JSON.stringify({
          tripDetails: false,
          packingChecklist: true,
          suggestions: false,
        })
      );

      const { result } = renderHook(() => useColumnLayout(), { wrapper });

      expect(result.current.columnVisibility).toEqual({
        tripDetails: false,
        packingChecklist: true,
        suggestions: false,
      });
    });

    it('should handle corrupted localStorage data gracefully', () => {
      localStorageMock.getItem.mockReturnValue('invalid-json');

      const { result } = renderHook(() => useColumnLayout(), { wrapper });

      expect(result.current.columnVisibility).toEqual({
        tripDetails: true,
        packingChecklist: true,
        suggestions: true,
      });
    });
  });

  describe('Responsive Breakpoint Logic', () => {
    it('should detect desktop device type', () => {
      mockWindowDimensions(1200, 800);

      const wrapperDesktop = ({ children }: { children: ReactNode }) => (
        <ColumnLayoutProvider>{children}</ColumnLayoutProvider>
      );

      const { result } = renderHook(() => useColumnLayout(), { wrapper: wrapperDesktop });

      // Trigger a resize event to update device type
      act(() => {
        window.dispatchEvent(new Event('resize'));
      });

      expect(result.current.deviceType).toBe('desktop');
    });

    it('should detect mobile portrait device type', () => {
      mockWindowDimensions(375, 667);

      const wrapperMobile = ({ children }: { children: ReactNode }) => (
        <ColumnLayoutProvider>{children}</ColumnLayoutProvider>
      );

      const { result } = renderHook(() => useColumnLayout(), { wrapper: wrapperMobile });

      // Trigger a resize event to update device type
      act(() => {
        window.dispatchEvent(new Event('resize'));
      });

      expect(result.current.deviceType).toBe('mobile-portrait');
    });

    it('should detect mobile landscape device type', () => {
      mockWindowDimensions(500, 375); // Width < 640 (mobile breakpoint)

      const wrapperMobile = ({ children }: { children: ReactNode }) => (
        <ColumnLayoutProvider>{children}</ColumnLayoutProvider>
      );

      const { result } = renderHook(() => useColumnLayout(), { wrapper: wrapperMobile });

      // Trigger a resize event to update device type
      act(() => {
        window.dispatchEvent(new Event('resize'));
      });

      expect(result.current.deviceType).toBe('mobile-landscape');
    });

    it('should detect tablet device type', () => {
      mockWindowDimensions(700, 1024); // Width between 640 and 768 for tablet

      const wrapperTablet = ({ children }: { children: ReactNode }) => (
        <ColumnLayoutProvider>{children}</ColumnLayoutProvider>
      );

      const { result } = renderHook(() => useColumnLayout(), { wrapper: wrapperTablet });

      // Trigger a resize event to update device type
      act(() => {
        window.dispatchEvent(new Event('resize'));
      });

      expect(result.current.deviceType).toBe('tablet');
    });
  });

  describe('Business Rules Enforcement', () => {
    it('should enforce minimum 1 column visible rule', () => {
      const { result } = renderHook(() => useColumnLayout(), { wrapper });

      // Try to hide all columns
      act(() => {
        result.current.toggleColumn('tripDetails');
        result.current.toggleColumn('packingChecklist');
        result.current.toggleColumn('suggestions');
      });

      // Should have at least one visible (packingChecklist as default)
      expect(result.current.getVisibleColumnCount()).toBeGreaterThanOrEqual(1);
      expect(result.current.columnVisibility.packingChecklist).toBe(true);
    });

    it('should enforce mobile portrait = max 1 column rule', () => {
      mockWindowDimensions(375, 667); // Mobile portrait
      const wrapperMobile = ({ children }: { children: ReactNode }) => (
        <ColumnLayoutProvider>{children}</ColumnLayoutProvider>
      );

      const { result } = renderHook(() => useColumnLayout(), { wrapper: wrapperMobile });

      // Should automatically reduce to 1 column on mobile portrait
      expect(result.current.getVisibleColumnCount()).toBe(1);
    });

    it('should enforce mobile landscape = max 2 columns rule', () => {
      mockWindowDimensions(500, 375); // Mobile landscape (width < 640)
      const wrapperMobile = ({ children }: { children: ReactNode }) => (
        <ColumnLayoutProvider>{children}</ColumnLayoutProvider>
      );

      const { result } = renderHook(() => useColumnLayout(), { wrapper: wrapperMobile });

      // Trigger a resize event to update device type
      act(() => {
        window.dispatchEvent(new Event('resize'));
      });

      // Should automatically reduce to max 2 columns on mobile landscape
      expect(result.current.getVisibleColumnCount()).toBeLessThanOrEqual(2);
    });

    it('should prioritize columns correctly in mobile portrait', () => {
      mockWindowDimensions(375, 667); // Mobile portrait
      const wrapperMobile = ({ children }: { children: ReactNode }) => (
        <ColumnLayoutProvider>{children}</ColumnLayoutProvider>
      );

      const { result } = renderHook(() => useColumnLayout(), { wrapper: wrapperMobile });

      // Trigger a resize event to update device type
      act(() => {
        window.dispatchEvent(new Event('resize'));
      });

      // Should show packing checklist by default (highest priority)
      expect(result.current.columnVisibility.packingChecklist).toBe(true);
      expect(result.current.getVisibleColumnCount()).toBe(1);
    });
  });

  describe('Column Width Management', () => {
    it('should set column width with minimum constraint', () => {
      const { result } = renderHook(() => useColumnLayout(), { wrapper });

      act(() => {
        result.current.setColumnWidth('tripDetails', 100); // Below minimum
      });

      expect(result.current.columnWidths.tripDetails).toBe(275); // Enforced minimum
    });

    it('should allow width above minimum', () => {
      const { result } = renderHook(() => useColumnLayout(), { wrapper });

      act(() => {
        result.current.setColumnWidth('tripDetails', 400);
      });

      expect(result.current.columnWidths.tripDetails).toBe(400);
    });

    it('should persist width changes to localStorage', () => {
      const { result } = renderHook(() => useColumnLayout(), { wrapper });

      act(() => {
        result.current.setColumnWidth('tripDetails', 400);
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'smartpack-column-widths',
        expect.stringContaining('"tripDetails":400')
      );
    });
  });

  describe('Layout Reset', () => {
    it('should reset to default visibility and widths', () => {
      const { result } = renderHook(() => useColumnLayout(), { wrapper });

      // Modify state
      act(() => {
        result.current.toggleColumn('tripDetails');
        result.current.setColumnWidth('suggestions', 500);
      });

      // Reset
      act(() => {
        result.current.resetLayout();
      });

      expect(result.current.columnVisibility).toEqual({
        tripDetails: true,
        packingChecklist: true,
        suggestions: true,
      });
      expect(result.current.columnWidths.suggestions).toBe(350); // Default width
    });

    it('should apply business rules on reset', () => {
      mockWindowDimensions(375, 667); // Mobile portrait
      const wrapperMobile = ({ children }: { children: ReactNode }) => (
        <ColumnLayoutProvider>{children}</ColumnLayoutProvider>
      );

      const { result } = renderHook(() => useColumnLayout(), { wrapper: wrapperMobile });

      act(() => {
        result.current.resetLayout();
      });

      // Should enforce mobile portrait rules even on reset
      expect(result.current.getVisibleColumnCount()).toBe(1);
    });
  });

  describe('Context Error Handling', () => {
    it('should throw error when used outside provider', () => {
      // Suppress console.error for this test since we expect an error
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

      expect(() => {
        renderHook(() => useColumnLayout());
      }).toThrow('useColumnLayout must be used within a ColumnLayoutProvider');

      consoleSpy.mockRestore();
    });
  });
});
