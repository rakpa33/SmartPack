import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type {
  ColumnId,
  ColumnVisibility,
  ColumnWidths,
  DeviceType,
  ResponsiveBreakpoints
} from '../types/ColumnLayout';
import { useDebounce } from './usePerformance';

// Import the default breakpoints as a value
const DEFAULT_BREAKPOINTS: ResponsiveBreakpoints = {
  mobile: 640,
  tablet: 768,
  desktop: 1024,
  mobilePortrait: 480,
};

interface ColumnLayoutContextValue {
  columnVisibility: ColumnVisibility;
  columnWidths: ColumnWidths;
  deviceType: DeviceType;
  toggleColumn: (columnId: ColumnId) => void;
  setColumnWidth: (columnId: ColumnId, width: number) => void;
  resetLayout: () => void;
  getVisibleColumnCount: () => number;
  getVisibleColumns: () => ColumnId[];
  enforceBusinessRules: () => void;
  // Phase 4: Responsive Layout Logic
  getResponsiveWidths: () => ColumnWidths;
  canFitMinimumWidths: (columns: ColumnId[]) => boolean;
  getShrinkingPriority: () => ColumnId[];
  enforceHorizontalConstraints: () => void;
  // Phase 5: Animation & Visual Polish
  isAnimating: boolean;
  animationDuration: number;
  prefersReducedMotion: boolean;
  getTransitionStyles: (columnId: ColumnId) => React.CSSProperties;
  setAnimating: (animating: boolean) => void;
}

const ColumnLayoutContext = createContext<ColumnLayoutContextValue | null>(null);

interface ColumnLayoutProviderProps {
  children: ReactNode;
  initialVisibility?: Partial<ColumnVisibility>;
  initialWidths?: Partial<ColumnWidths>;
  breakpoints?: Partial<ResponsiveBreakpoints>;
}

const DEFAULT_VISIBILITY: ColumnVisibility = {
  tripDetails: true,
  packingChecklist: true,
  suggestions: true,
};

const DEFAULT_WIDTHS: ColumnWidths = {
  tripDetails: 350,
  packingChecklist: 400,
  suggestions: 350,
};

const STORAGE_KEYS = {
  visibility: 'smartpack-column-visibility',
  widths: 'smartpack-column-widths',
} as const;

// Device detection hook with performance optimization
function useDeviceType(breakpoints: ResponsiveBreakpoints): DeviceType {
  const [deviceType, setDeviceType] = useState<DeviceType>(() => {
    if (typeof window === 'undefined') return 'desktop';

    const width = window.innerWidth;
    const height = window.innerHeight;

    if (width < breakpoints.mobile) {
      return height > width ? 'mobile-portrait' : 'mobile-landscape';
    } else if (width < breakpoints.tablet) {
      return 'tablet';
    } else {
      return 'desktop';
    }
  });

  // Debounced resize handler to prevent excessive re-renders
  const debouncedHandleResize = useDebounce(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    if (width < breakpoints.mobile) {
      setDeviceType(height > width ? 'mobile-portrait' : 'mobile-landscape');
    } else if (width < breakpoints.tablet) {
      setDeviceType('tablet');
    } else {
      setDeviceType('desktop');
    }
  }, 150); // 150ms debounce for smooth performance

  useEffect(() => {
    window.addEventListener('resize', debouncedHandleResize);
    return () => window.removeEventListener('resize', debouncedHandleResize);
  }, [debouncedHandleResize, breakpoints]);

  return deviceType;
}

export function ColumnLayoutProvider({
  children,
  initialVisibility = {},
  initialWidths = {},
  breakpoints = DEFAULT_BREAKPOINTS
}: ColumnLayoutProviderProps) {
  const finalBreakpoints = { ...DEFAULT_BREAKPOINTS, ...breakpoints };
  const deviceType = useDeviceType(finalBreakpoints);

  // Load from localStorage or use defaults
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>(() => {
    if (typeof window === 'undefined') return { ...DEFAULT_VISIBILITY, ...initialVisibility };

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.visibility);
      const parsed = stored ? JSON.parse(stored) : {};
      return { ...DEFAULT_VISIBILITY, ...parsed, ...initialVisibility };
    } catch {
      return { ...DEFAULT_VISIBILITY, ...initialVisibility };
    }
  });

  const [columnWidths, setColumnWidths] = useState<ColumnWidths>(() => {
    if (typeof window === 'undefined') return { ...DEFAULT_WIDTHS, ...initialWidths };

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.widths);
      const parsed = stored ? JSON.parse(stored) : {};
      return { ...DEFAULT_WIDTHS, ...parsed, ...initialWidths };
    } catch {
      return { ...DEFAULT_WIDTHS, ...initialWidths };
    }
  });

  // Phase 5: Animation state
  const [isAnimating, setIsAnimating] = useState(false);
  const animationDuration = 500; // 500ms transitions

  // Detect motion preferences
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  // Set up motion preference listener
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.visibility, JSON.stringify(columnVisibility));
  }, [columnVisibility]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.widths, JSON.stringify(columnWidths));
  }, [columnWidths]);

  // Business rules enforcement
  const enforceVisibilityRules = (visibility: ColumnVisibility, device: DeviceType): ColumnVisibility => {
    const visibleCount = Object.values(visibility).filter(Boolean).length;

    // Rule 1: Minimum 1 column visible always
    if (visibleCount === 0) {
      return { ...visibility, packingChecklist: true };
    }

    // Rule 2: Mobile portrait = max 1 column
    if (device === 'mobile-portrait' && visibleCount > 1) {
      if (visibility.packingChecklist) {
        return { tripDetails: false, packingChecklist: true, suggestions: false };
      } else if (visibility.tripDetails) {
        return { tripDetails: true, packingChecklist: false, suggestions: false };
      } else {
        return { tripDetails: false, packingChecklist: false, suggestions: true };
      }
    }

    // Rule 3: Mobile landscape = max 2 columns
    if (device === 'mobile-landscape' && visibleCount > 2) {
      if (visibility.tripDetails && visibility.packingChecklist && visibility.suggestions) {
        return { ...visibility, suggestions: false };
      }
    }

    return visibility;
  };

  // Phase 4: Responsive Layout Logic Methods
  const MIN_COLUMN_WIDTH = 275;
  const DRAG_HANDLE_WIDTH = 8;

  // Memoized expensive calculations for performance
  const getShrinkingPriority = useCallback((): ColumnId[] => {
    return ['suggestions', 'tripDetails', 'packingChecklist'];
  }, []);
  const getVisibleColumns = useCallback((): ColumnId[] => {
    return (Object.keys(columnVisibility) as ColumnId[]).filter(
      columnId => columnVisibility[columnId]
    );
  }, [columnVisibility]);

  const canFitMinimumWidths = useCallback((columns: ColumnId[]): boolean => {
    if (typeof window === 'undefined') return true;

    const totalMinWidth = columns.length * MIN_COLUMN_WIDTH;
    const dragHandleSpace = Math.max(0, columns.length - 1) * DRAG_HANDLE_WIDTH;
    const availableWidth = window.innerWidth - 32;

    return availableWidth >= (totalMinWidth + dragHandleSpace);
  }, []);

  const getResponsiveWidths = useCallback((): ColumnWidths => {
    if (typeof window === 'undefined') return columnWidths;

    const visibleColumns = getVisibleColumns();
    const availableWidth = window.innerWidth - 32;
    const dragHandleSpace = Math.max(0, visibleColumns.length - 1) * DRAG_HANDLE_WIDTH;
    const usableWidth = availableWidth - dragHandleSpace;

    const totalMinWidth = visibleColumns.length * MIN_COLUMN_WIDTH;

    if (usableWidth >= totalMinWidth) {
      const extraSpace = usableWidth - totalMinWidth;
      const responsiveWidths: ColumnWidths = { ...columnWidths };

      if (visibleColumns.includes('packingChecklist')) {
        responsiveWidths.packingChecklist = MIN_COLUMN_WIDTH + (extraSpace * 0.5);
      }
      if (visibleColumns.includes('tripDetails')) {
        responsiveWidths.tripDetails = MIN_COLUMN_WIDTH + (extraSpace * 0.25);
      }
      if (visibleColumns.includes('suggestions')) {
        responsiveWidths.suggestions = MIN_COLUMN_WIDTH + (extraSpace * 0.25);
      }

      return responsiveWidths;
    } else {
      const responsiveWidths: ColumnWidths = { ...columnWidths };
      visibleColumns.forEach((column: ColumnId) => {
        responsiveWidths[column] = MIN_COLUMN_WIDTH;
      });
      return responsiveWidths;
    }
  }, [columnVisibility, columnWidths, getVisibleColumns]);

  const enforceHorizontalConstraints = useCallback(() => {
    const visibleColumns = getVisibleColumns();

    if (!canFitMinimumWidths(visibleColumns) && visibleColumns.length > 1) {
      const priority = getShrinkingPriority();

      // Find the first column to hide based on priority
      for (const columnToHide of priority) {
        if (visibleColumns.includes(columnToHide)) {
          const remainingColumns = visibleColumns.filter((col: ColumnId) => col !== columnToHide);

          if (canFitMinimumWidths(remainingColumns)) {
            // Return new visibility state instead of setting state directly
            return {
              ...columnVisibility,
              [columnToHide]: false
            };
          }
        }
      }
    }

    return columnVisibility; // No changes needed
  }, [columnVisibility, getVisibleColumns, canFitMinimumWidths, getShrinkingPriority]);

  const toggleColumn = (columnId: ColumnId) => {
    setColumnVisibility(prev => {
      const newVisibility = {
        ...prev,
        [columnId]: !prev[columnId],
      };
      return enforceVisibilityRules(newVisibility, deviceType);
    });
  };

  const setColumnWidth = (columnId: ColumnId, width: number) => {
    const constrainedWidth = Math.max(width, MIN_COLUMN_WIDTH);
    setColumnWidths(prev => ({
      ...prev,
      [columnId]: constrainedWidth,
    }));
  };

  const resetLayout = () => {
    const resetVisibility = enforceVisibilityRules(DEFAULT_VISIBILITY, deviceType);
    setColumnVisibility(resetVisibility);
    setColumnWidths(DEFAULT_WIDTHS);
  };

  const getVisibleColumnCount = (): number => {
    return Object.values(columnVisibility).filter(Boolean).length;
  };

  const enforceBusinessRules = () => {
    setColumnVisibility(prev => enforceVisibilityRules(prev, deviceType));
  };

  // Phase 5: Animation & Visual Polish Methods
  const getTransitionStyles = (): React.CSSProperties => {
    const duration = prefersReducedMotion ? 0 : animationDuration;

    return {
      transition: `width ${duration}ms cubic-bezier(0.4, 0, 0.2, 1), 
                   opacity ${duration}ms cubic-bezier(0.4, 0, 0.2, 1),
                   transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
      willChange: isAnimating ? 'width, opacity, transform' : 'auto',
    };
  };

  const setAnimating = (animating: boolean) => {
    setIsAnimating(animating);
  };

  // Enhanced toggle with animation support
  const toggleColumnWithAnimation = (columnId: ColumnId) => {
    if (!prefersReducedMotion) {
      setIsAnimating(true);

      // Clear animation state after transition completes
      setTimeout(() => {
        setIsAnimating(false);
      }, animationDuration);
    }

    toggleColumn(columnId);
  };

  // Enforce business rules when device type changes
  useEffect(() => {
    setColumnVisibility(prev => enforceVisibilityRules(prev, deviceType));
  }, [deviceType]);

  // Phase 4: Only enforce horizontal constraints when window size changes, not on every visibility change
  useEffect(() => {
    const handleResize = () => {
      const visibleColumns = getVisibleColumns();
      if (!canFitMinimumWidths(visibleColumns)) {
        const priority = getShrinkingPriority();
        let columnsToCheck = [...visibleColumns];

        for (const columnToHide of priority) {
          if (columnsToCheck.includes(columnToHide) && columnsToCheck.length > 1) {
            columnsToCheck = columnsToCheck.filter(col => col !== columnToHide);

            if (canFitMinimumWidths(columnsToCheck)) {
              setColumnVisibility(prev => ({
                ...prev,
                [columnToHide]: false
              }));
              break;
            }
          }
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Only on mount/unmount

  const contextValue: ColumnLayoutContextValue = {
    columnVisibility,
    columnWidths,
    deviceType,
    toggleColumn: toggleColumnWithAnimation, // Use animated version
    setColumnWidth,
    resetLayout,
    getVisibleColumnCount,
    getVisibleColumns,
    enforceBusinessRules,
    getResponsiveWidths,
    canFitMinimumWidths,
    getShrinkingPriority,
    enforceHorizontalConstraints,
    // Phase 5: Animation & Visual Polish
    isAnimating,
    animationDuration,
    prefersReducedMotion,
    getTransitionStyles,
    setAnimating,
  };

  return (
    <ColumnLayoutContext.Provider value={contextValue}>
      {children}
    </ColumnLayoutContext.Provider>
  );
}

export function useColumnLayout(): ColumnLayoutContextValue {
  const context = useContext(ColumnLayoutContext);
  if (!context) {
    throw new Error('useColumnLayout must be used within a ColumnLayoutProvider');
  }
  return context;
}
