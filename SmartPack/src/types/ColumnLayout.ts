/**
 * Types for the Trello-style resizable layout system
 */

export type ColumnId = 'tripDetails' | 'packingChecklist' | 'suggestions';

export interface ColumnVisibility {
  tripDetails: boolean;
  packingChecklist: boolean;
  suggestions: boolean;
}

export interface ColumnWidths {
  tripDetails: number;
  packingChecklist: number;
  suggestions: number;
}

export interface ColumnLayoutState {
  visibility: ColumnVisibility;
  widths: ColumnWidths;
  isResizing: boolean;
  activeColumn?: ColumnId;
}

export interface ColumnLayoutContextType {
  state: ColumnLayoutState;
  toggleColumn: (columnId: ColumnId) => void;
  setColumnWidth: (columnId: ColumnId, width: number) => void;
  resetToDefaults: () => void;
}

export type DeviceType = 'mobile-portrait' | 'mobile-landscape' | 'tablet' | 'desktop';

export interface ResponsiveBreakpoints {
  mobile: number;
  tablet: number;
  desktop: number;
  mobilePortrait: number;
}

export const DEFAULT_BREAKPOINTS: ResponsiveBreakpoints = {
  mobile: 640,
  tablet: 768,
  desktop: 1024,
  mobilePortrait: 480,
};

export const MIN_COLUMN_WIDTH = 275;

export const DEFAULT_COLUMN_WIDTHS: ColumnWidths = {
  tripDetails: MIN_COLUMN_WIDTH,
  packingChecklist: MIN_COLUMN_WIDTH * 2, // Larger default for main content
  suggestions: MIN_COLUMN_WIDTH,
};

export const DEFAULT_COLUMN_VISIBILITY: ColumnVisibility = {
  tripDetails: true,
  packingChecklist: true,
  suggestions: true,
};
