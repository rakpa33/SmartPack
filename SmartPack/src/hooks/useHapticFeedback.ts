import { useCallback } from 'react';
import { useColumnLayout } from './useColumnLayout';

export type HapticFeedbackType = 'light' | 'medium' | 'heavy' | 'selection' | 'impact' | 'notification';

interface HapticFeedbackOptions {
  /** Duration of vibration in milliseconds (for web vibration API) */
  duration?: number;
  /** Pattern of vibrations for complex feedback */
  pattern?: number[];
  /** Whether to enable haptic feedback */
  enabled?: boolean;
}

/**
 * useHapticFeedback: Custom hook for providing haptic feedback on touch devices
 * 
 * Features:
 * - Cross-platform haptic feedback (iOS, Android, Web)
 * - Different feedback types for various interactions
 * - Automatic device detection and feature availability
 * - Fallback to web vibration API when native haptics unavailable
 */
export function useHapticFeedback(options: HapticFeedbackOptions = {}) {
  const { deviceType } = useColumnLayout();
  const {
    pattern = [10],
    enabled = true
  } = options;

  // Check if device supports haptic feedback
  const isHapticCapable = useCallback(() => {
    return (
      enabled &&
      (deviceType === 'mobile-portrait' || deviceType === 'mobile-landscape') &&
      ('vibrate' in navigator || 'hapticFeedback' in window)
    );
  }, [enabled, deviceType]);

  // Trigger haptic feedback with fallbacks
  const triggerHaptic = useCallback((type: HapticFeedbackType = 'light') => {
    if (!isHapticCapable()) return;

    try {
      // Try native haptic feedback first (iOS/Android in web view)
      if ('hapticFeedback' in window) {
        const haptic = (window as any).hapticFeedback;
        
        switch (type) {
          case 'light':
            haptic.impactOccurred?.('light');
            break;
          case 'medium':
            haptic.impactOccurred?.('medium');
            break;
          case 'heavy':
            haptic.impactOccurred?.('heavy');
            break;
          case 'selection':
            haptic.selectionChanged?.();
            break;
          case 'impact':
            haptic.impactOccurred?.('rigid');
            break;
          case 'notification':
            haptic.notificationOccurred?.('success');
            break;
        }
        return;
      }

      // Fallback to web vibration API
      if ('vibrate' in navigator) {
        let vibrationPattern: number[];
        
        switch (type) {
          case 'light':
            vibrationPattern = [5];
            break;
          case 'medium':
            vibrationPattern = [10];
            break;
          case 'heavy':
            vibrationPattern = [20];
            break;
          case 'selection':
            vibrationPattern = [3];
            break;
          case 'impact':
            vibrationPattern = [15, 10, 15];
            break;
          case 'notification':
            vibrationPattern = [20, 50, 20];
            break;
          default:
            vibrationPattern = pattern;
        }

        navigator.vibrate(vibrationPattern);
      }
    } catch (error) {
      // Silently fail - haptic feedback is not critical functionality
      console.debug('Haptic feedback failed:', error);
    }
  }, [isHapticCapable, pattern]);

  // Convenience methods for common interactions
  const hapticFeedback = {
    /** Light tap feedback for button presses */
    tap: () => triggerHaptic('light'),
    
    /** Medium feedback for important actions */
    impact: () => triggerHaptic('medium'),
    
    /** Heavy feedback for significant actions */
    strong: () => triggerHaptic('heavy'),
    
    /** Selection feedback for list/option selection */
    select: () => triggerHaptic('selection'),
    
    /** Success/completion feedback */
    success: () => triggerHaptic('notification'),
    
    /** Error/warning feedback */
    error: () => triggerHaptic('heavy'),
    
    /** Drag start feedback */
    dragStart: () => triggerHaptic('medium'),
    
    /** Drag end/drop feedback */
    dragEnd: () => triggerHaptic('light'),
    
    /** Threshold reached feedback (e.g., close threshold) */
    threshold: () => triggerHaptic('impact'),
    
    /** Custom feedback with specific type */
    custom: (type: HapticFeedbackType) => triggerHaptic(type)
  };

  return {
    isHapticCapable: isHapticCapable(),
    triggerHaptic,
    ...hapticFeedback
  };
}

export default useHapticFeedback;
