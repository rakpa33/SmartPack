import { useState, useRef, useCallback, useEffect } from 'react';
import { useColumnLayout } from './useColumnLayout';
import type { ColumnId } from '../types/ColumnLayout';

interface UseResizableOptions {
  columnId: ColumnId;
  minWidth?: number;
  closeThreshold?: number;
  onResize?: (width: number) => void;
  onClose?: () => void;
}

interface UseResizableReturn {
  isDragging: boolean;
  isResizing: boolean;
  startResize: (clientX: number) => void;
  handleRef: React.RefObject<HTMLElement>;
}

/**
 * useResizable: Custom hook for column resizing functionality
 * 
 * Provides drag-based resizing with:
 * - Minimum width constraints
 * - Close threshold detection
 * - Smooth animation support
 * - Touch and mouse event handling
 * - Performance optimization with RAF
 */
export function useResizable({
  columnId,
  minWidth = 275,
  closeThreshold = 0.5,
  onResize,
  onClose
}: UseResizableOptions): UseResizableReturn {
  const { columnWidths, setColumnWidth, toggleColumn } = useColumnLayout();
  
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  
  const handleRef = useRef<HTMLElement>(null);
  const dragStartX = useRef<number>(0);
  const initialWidth = useRef<number>(0);
  const rafId = useRef<number | null>(null);
  const pendingWidth = useRef<number | null>(null);

  // Debounced resize function using RAF for performance
  const applyResize = useCallback(() => {
    if (pendingWidth.current !== null) {
      const width = pendingWidth.current;
      pendingWidth.current = null;
      
      // Check close threshold
      const threshold = initialWidth.current * closeThreshold;
      if (width < threshold) {
        toggleColumn(columnId);
        onClose?.();
        return;
      }

      // Apply minimum width constraint
      const constrainedWidth = Math.max(width, minWidth);
      setColumnWidth(columnId, constrainedWidth);
      onResize?.(constrainedWidth);
    }
    rafId.current = null;
  }, [columnId, minWidth, closeThreshold, setColumnWidth, toggleColumn, onResize, onClose]);

  // Schedule a resize operation
  const scheduleResize = useCallback((width: number) => {
    pendingWidth.current = width;
    
    if (rafId.current === null) {
      rafId.current = requestAnimationFrame(applyResize);
    }
  }, [applyResize]);

  // Start resize operation
  const startResize = useCallback((clientX: number) => {
    setIsDragging(true);
    setIsResizing(true);
    dragStartX.current = clientX;
    initialWidth.current = columnWidths[columnId];

    // Prevent text selection during drag
    document.body.style.userSelect = 'none';
    document.documentElement.style.cursor = 'col-resize';
  }, [columnId, columnWidths]);

  // Handle drag movement
  const handleDragMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;

    e.preventDefault();
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const deltaX = clientX - dragStartX.current;
    const newWidth = initialWidth.current + deltaX;

    scheduleResize(newWidth);
  }, [isDragging, scheduleResize]);

  // End resize operation
  const endResize = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);

    // Restore document styles
    document.body.style.userSelect = '';
    document.documentElement.style.cursor = '';

    // Cancel any pending RAF
    if (rafId.current !== null) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }

    // Apply final resize if pending
    if (pendingWidth.current !== null) {
      applyResize();
    }
  }, [applyResize]);

  // Setup global event listeners when dragging
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => handleDragMove(e);
    const handleTouchMove = (e: TouchEvent) => handleDragMove(e);
    const handleMouseUp = () => endResize();
    const handleTouchEnd = () => endResize();

    // Add event listeners
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
  }, [isDragging, handleDragMove, endResize]);

  // Cleanup RAF on unmount
  useEffect(() => {
    return () => {
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  return {
    isDragging,
    isResizing,
    startResize,
    handleRef
  };
}

export default useResizable;
