/**
 * Performance optimization hooks for SmartPack
 * 
 * Provides debounced resize calculations, RAF-optimized event handling,
 * and memoization utilities for heavy calculations.
 */

import { useCallback, useRef, useEffect, useMemo } from 'react';

/**
 * Debounce hook with cleanup - prevents excessive function calls
 */
export function useDebounce<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout>();

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  ) as T;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
}

/**
 * RAF-optimized callback hook - ensures smooth animations
 */
export function useRAF<T extends (...args: any[]) => void>(
  callback: T
): T {
  const rafRef = useRef<number>();
  const callbackRef = useRef(callback);

  // Keep callback ref updated
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const rafCallback = useCallback(
    (...args: Parameters<T>) => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      
      rafRef.current = requestAnimationFrame(() => {
        callbackRef.current(...args);
      });
    },
    []
  ) as T;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return rafCallback;
}

/**
 * Memoized calculation hook for heavy computations
 */
export function useMemoizedCalculation<T>(
  calculation: () => T,
  deps: React.DependencyList
): T {
  return useMemo(calculation, deps);
}

/**
 * Throttle hook for high-frequency events (like scroll, drag)
 */
export function useThrottle<T extends (...args: any[]) => void>(
  callback: T,
  limit: number
): T {
  const inThrottle = useRef(false);
  const callbackRef = useRef(callback);

  // Keep callback ref updated
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const throttledCallback = useCallback(
    (...args: Parameters<T>) => {
      if (!inThrottle.current) {
        callbackRef.current(...args);
        inThrottle.current = true;
        setTimeout(() => {
          inThrottle.current = false;
        }, limit);
      }
    },
    [limit]
  ) as T;

  return throttledCallback;
}

/**
 * Optimized resize observer hook with debouncing
 */
export function useOptimizedResize(
  callback: (entries: ResizeObserverEntry[]) => void,
  debounceMs: number = 150
) {
  const debouncedCallback = useDebounce(callback, debounceMs);
  const observerRef = useRef<ResizeObserver>();

  const observe = useCallback(
    (element: Element) => {
      if (!element) return;

      // Disconnect previous observer
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      // Create new observer with debounced callback
      observerRef.current = new ResizeObserver(debouncedCallback);
      observerRef.current.observe(element);
    },
    [debouncedCallback]
  );

  const disconnect = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return { observe, disconnect };
}
