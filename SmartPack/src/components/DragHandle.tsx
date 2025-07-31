import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useColumnLayout } from '../hooks/useColumnLayout';
import { useRAF, useThrottle } from '../hooks/usePerformance';
import type { ColumnId } from '../types/ColumnLayout';

interface DragHandleProps {
  /** The column that this handle will resize when dragged */
  columnId: ColumnId;
  /** Position of the handle: 'left' or 'right' side of the column */
  position: 'left' | 'right';
  /** Optional className for styling */
  className?: string;
}

/**
 * DragHandle: Interactive column separator that allows resizing columns via drag
 * Features:
 * - Always visible column separator (dash/line like Trello)
 * - Hover state with blue highlight and bi-directional arrow cursor
 * - Real-time column resizing with 275px minimum width constraint
 * - "Close threshold" logic (>50% drag distance hides column)
 * - Haptic feedback for touch devices
 * - Phase 5: Smooth 500ms transitions and visual feedback states
 */
const DragHandle: React.FC<DragHandleProps> = ({ columnId, position, className = '' }) => {
  const {
    columnWidths,
    setColumnWidth,
    toggleColumn,
    deviceType,
    getTransitionStyles,
    prefersReducedMotion,
    isAnimating,
    setAnimating
  } = useColumnLayout();
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const dragStartX = useRef<number>(0);
  const initialWidth = useRef<number>(0);
  const handleRef = useRef<HTMLDivElement>(null);

  // Constants
  const MIN_COLUMN_WIDTH = 275;
  const CLOSE_THRESHOLD_PERCENTAGE = 0.5;

  // Haptic feedback for touch devices
  const triggerHapticFeedback = useCallback(() => {
    if ('vibrate' in navigator && (deviceType === 'mobile-portrait' || deviceType === 'mobile-landscape')) {
      navigator.vibrate(10); // Short vibration
    }
  }, [deviceType]);

  // Handle drag start
  const handleDragStart = useCallback((clientX: number) => {
    setIsDragging(true);
    dragStartX.current = clientX;
    initialWidth.current = columnWidths[columnId];
    triggerHapticFeedback();

    // Prevent text selection during drag
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';
  }, [columnId, columnWidths, triggerHapticFeedback]);

  // Handle drag move with RAF optimization for smooth performance
  const handleDragMoveRAF = useRAF((clientX: number) => {
    if (!isDragging) return;

    const deltaX = clientX - dragStartX.current;
    const adjustedDelta = position === 'right' ? deltaX : -deltaX;
    const newWidth = initialWidth.current + adjustedDelta;

    // Check if we should close the column (drag distance > 50% of initial width)
    const closeThreshold = initialWidth.current * CLOSE_THRESHOLD_PERCENTAGE;

    if (newWidth < closeThreshold) {
      // Close the column
      toggleColumn(columnId);
      triggerHapticFeedback();
      return;
    }

    // Apply minimum width constraint and update
    const constrainedWidth = Math.max(newWidth, MIN_COLUMN_WIDTH);
    setColumnWidth(columnId, constrainedWidth);
  });

  // Throttled drag move for high-frequency events
  const handleDragMove = useThrottle((clientX: number) => {
    handleDragMoveRAF(clientX);
  }, 16); // ~60fps throttling

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    setIsDragging(false);

    // Restore body styles
    document.body.style.userSelect = '';
    document.body.style.cursor = '';

    triggerHapticFeedback();

    // Phase 5: Trigger animation state for smooth transitions
    if (!prefersReducedMotion) {
      setAnimating(true);
      setTimeout(() => setAnimating(false), 500);
    }
  }, [triggerHapticFeedback, prefersReducedMotion, setAnimating]);

  // Mouse event handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientX);
  }, [handleDragStart]);

  // Touch event handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleDragStart(touch.clientX);
  }, [handleDragStart]);

  // Global mouse/touch move and end handlers
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      handleDragMove(e.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      handleDragMove(touch.clientX);
    };

    const handleMouseUp = () => handleDragEnd();
    const handleTouchEnd = () => handleDragEnd();

    // Add global event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    // Cleanup
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  // Don't render on mobile portrait (columns are stacked)
  if (deviceType === 'mobile-portrait') {
    return null;
  }

  return (
    <div
      ref={handleRef}
      className={`
        relative flex items-center justify-center
        w-2 h-full cursor-col-resize select-none
        ${prefersReducedMotion ? '' : 'transition-all duration-500 ease-in-out'}
        hover:bg-blue-500 hover:shadow-lg
        ${isDragging ? 'bg-blue-600 shadow-xl z-50' : 'bg-gray-300 dark:bg-gray-600'}
        ${isHovered || isDragging ? 'w-3' : 'w-2'}
        ${isAnimating && !prefersReducedMotion ? 'transform-gpu' : ''}
        ${className}
      `}
      style={{
        ...(!prefersReducedMotion && getTransitionStyles(columnId)),
        // Enhanced visual feedback during animation
        ...(isAnimating && !prefersReducedMotion && {
          boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)',
          transform: 'scaleY(1.02)',
        })
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="separator"
      aria-orientation="vertical"
      aria-label={`Resize ${columnId} column`}
      tabIndex={0}
      onKeyDown={(e) => {
        // Keyboard navigation support
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
          e.preventDefault();
          const direction = e.key === 'ArrowRight' ? 1 : -1;
          const step = e.shiftKey ? 50 : 10; // Shift for larger steps
          const currentWidth = columnWidths[columnId];
          const newWidth = currentWidth + (direction * step * (position === 'right' ? 1 : -1));
          const constrainedWidth = Math.max(newWidth, MIN_COLUMN_WIDTH);
          setColumnWidth(columnId, constrainedWidth);
          triggerHapticFeedback();
        }
      }}
    >
      {/* Visual separator line */}
      <div
        className={`
          w-0.5 h-16 rounded-full 
          ${prefersReducedMotion ? '' : 'transition-all duration-300'}
          ${isDragging || isHovered
            ? 'bg-white shadow-sm'
            : 'bg-gray-400 dark:bg-gray-500'
          }
        `}
        style={{
          // Enhanced visual feedback during animation
          ...(isAnimating && !prefersReducedMotion && {
            boxShadow: '0 0 10px rgba(255, 255, 255, 0.8)',
            transform: 'scaleX(1.5)',
          })
        }}
      />

      {/* Bi-directional arrow indicator on hover/drag */}
      {(isHovered || isDragging) && (
        <div className={`
          absolute inset-0 flex items-center justify-center
          ${prefersReducedMotion ? '' : 'animate-pulse'}
        `}>
          <div className="text-white text-xs font-bold select-none pointer-events-none">
            ⟷
          </div>
        </div>
      )}
    </div>
  );
};

export default DragHandle;
