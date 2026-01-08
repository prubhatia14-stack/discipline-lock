/**
 * Haptic feedback utility using the Vibration API
 * Provides smooth tactile responses for touch interactions
 */

type HapticPattern = 'light' | 'medium' | 'heavy' | 'success' | 'error';

const patterns: Record<HapticPattern, number | number[]> = {
  light: 10,      // Very subtle tap
  medium: 25,     // Standard button tap
  heavy: 50,      // Strong feedback
  success: [15, 50, 30], // Celebration pattern
  error: [50, 100, 50],  // Error pattern
};

export function triggerHaptic(pattern: HapticPattern = 'light') {
  // Check if Vibration API is supported
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(patterns[pattern]);
    } catch (e) {
      // Silently fail if vibration not available
    }
  }
}

export function useHapticFeedback() {
  const light = () => triggerHaptic('light');
  const medium = () => triggerHaptic('medium');
  const heavy = () => triggerHaptic('heavy');
  const success = () => triggerHaptic('success');
  const error = () => triggerHaptic('error');

  return { light, medium, heavy, success, error, trigger: triggerHaptic };
}
