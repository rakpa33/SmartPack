import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type {
  ColumnId,
  ColumnVisibility,
  ColumnWidths,
  DeviceType,
  ResponsiveBreakpoints
} from '../types/ColumnLayout';

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

// Device detection hook
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

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      if (width < breakpoints.mobile) {
        setDeviceType(height > width ? 'mobile-portrait' : 'mobile-landscape');
      } else if (width < breakpoints.tablet) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoints]);

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

  const getShrinkingPriority = (): ColumnId[] => {
    return ['suggestions', 'tripDetails', 'packingChecklist'];
  };

  const getVisibleColumns = (): ColumnId[] => {
    return (Object.keys(columnVisibility) as ColumnId[]).filter(
      columnId => columnVisibility[columnId]
    );
  };

  const canFitMinimumWidths = (columns: ColumnId[]): boolean => {
    if (typeof window === 'undefined') return true;

    const totalMinWidth = columns.length * MIN_COLUMN_WIDTH;
    const dragHandleSpace = Math.max(0, columns.length - 1) * DRAG_HANDLE_WIDTH;
    const availableWidth = window.innerWidth - 32;

    return availableWidth >= (totalMinWidth + dragHandleSpace);
  };

  const getResponsiveWidths = (): ColumnWidths => {
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
      visibleColumns.forEach(column => {
        responsiveWidths[column] = MIN_COLUMN_WIDTH;
      });
      return responsiveWidths;
    }
  };

  const enforceHorizontalConstraints = () => {
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

  // Enforce business rules when device type changes
  useEffect(() => {
    setColumnVisibility(prev => enforceVisibilityRules(prev, deviceType));
  }, [deviceType]);

  // Enforce horizontal constraints when window resizes
  useEffect(() => {
    enforceHorizontalConstraints();
  }, [deviceType, columnVisibility]); // eslint-disable-line react-hooks/exhaustive-deps

  const contextValue: ColumnLayoutContextValue = {
    columnVisibility,
    columnWidths,
    deviceType,
    toggleColumn,
    setColumnWidth,
    resetLayout,
    getVisibleColumnCount,
    getVisibleColumns,
    enforceBusinessRules,
    getResponsiveWidths,
    canFitMinimumWidths,
    getShrinkingPriority,
    enforceHorizontalConstraints,
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
