import React from 'react';
import { MapIcon, ClipboardIcon, LightBulbIcon } from '@heroicons/react/24/outline';
import { useColumnLayout } from '../hooks/useColumnLayout';
import type { ColumnId } from '../types/ColumnLayout';

interface NavigationButton {
  id: ColumnId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navigationButtons: NavigationButton[] = [
  {
    id: 'tripDetails',
    label: 'Trip Details',
    icon: MapIcon,
  },
  {
    id: 'packingChecklist',
    label: 'Packing Checklist',
    icon: ClipboardIcon,
  },
  {
    id: 'suggestions',
    label: 'Suggestions',
    icon: LightBulbIcon,
  },
];

/**
 * BottomNavigation: Column visibility controls
 * Enhanced Implementation: React.memo optimization for efficient column toggle performance
 */
const BottomNavigation: React.FC = React.memo(() => {
  const {
    columnVisibility,
    toggleColumn,
    getVisibleColumnCount,
    prefersReducedMotion,
    isAnimating
  } = useColumnLayout();

  // Memoize the toggle handler to prevent unnecessary re-renders
  const handleToggleColumn = React.useCallback((columnId: ColumnId) => {
    // Prevent hiding the last visible column
    if (columnVisibility[columnId] && getVisibleColumnCount() === 1) {
      return;
    }
    toggleColumn(columnId);
  }, [columnVisibility, getVisibleColumnCount, toggleColumn]);

  return (
    <nav
      className={`
        fixed bottom-0 left-1/2 transform -translate-x-1/2 z-50 
        bg-white border border-gray-200 rounded-t-lg shadow-lg 
        dark:bg-gray-800 dark:border-gray-700
        ${prefersReducedMotion ? '' : 'transition-all duration-300 ease-in-out'}
        ${isAnimating && !prefersReducedMotion ? 'animate-pulse' : ''}
      `}
      style={{
        // Enhanced visual feedback during column transitions
        ...(isAnimating && !prefersReducedMotion && {
          boxShadow: '0 -4px 20px rgba(59, 130, 246, 0.3)',
          transform: 'translateX(-50%) translateY(-2px)',
        })
      }}
      aria-label="Column visibility controls"
    >
      <div className="flex items-center gap-1 px-4 py-1">
        {navigationButtons.map(({ id, label, icon: Icon }) => {
          const isVisible = columnVisibility[id];
          const isLastVisible = isVisible && getVisibleColumnCount() === 1;

          return (
            <button
              key={id}
              onClick={() => handleToggleColumn(id)}
              disabled={isLastVisible}
              className={`
                flex items-center justify-center gap-2
                px-3 py-2 rounded-md text-sm font-medium
                ${prefersReducedMotion ? '' : 'transition-all duration-200 ease-in-out'}
                ${isVisible
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'bg-transparent text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }
                ${isLastVisible
                  ? 'opacity-50 cursor-not-allowed'
                  : (prefersReducedMotion ? '' : 'hover:scale-105 active:scale-95')
                }
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
                touch-manipulation min-w-0
              `}
              style={{
                // Enhanced visual feedback for active state during animations
                ...(isVisible && isAnimating && !prefersReducedMotion && {
                  boxShadow: '0 0 15px rgba(59, 130, 246, 0.6)',
                  transform: 'scale(1.05)',
                })
              }}
              aria-pressed={isVisible}
              aria-label={`${isVisible ? 'Hide' : 'Show'} ${label}`}
              type="button"
            >
              <Icon
                className={`
                  w-4 h-4 flex-shrink-0
                  ${isAnimating && isVisible && !prefersReducedMotion ? 'animate-bounce' : ''}
                `}
              />
              <span className="truncate">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
});

export default BottomNavigation;
