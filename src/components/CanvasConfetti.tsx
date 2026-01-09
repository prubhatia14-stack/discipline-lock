import { useEffect, useRef, useCallback } from "react";
import confetti from "canvas-confetti";

interface CanvasConfettiProps {
  trigger: boolean;
  onComplete?: () => void;
}

export function CanvasConfetti({ trigger, onComplete }: CanvasConfettiProps) {
  const hasTriggered = useRef(false);

  const fireConfetti = useCallback(() => {
    const duration = 800;
    const end = Date.now() + duration;

    const colors = ["#ffffff", "#888888", "#cccccc"];

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors,
        ticks: 200,
        gravity: 1.2,
        scalar: 0.9,
        drift: 0,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors,
        ticks: 200,
        gravity: 1.2,
        scalar: 0.9,
        drift: 0,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      } else {
        onComplete?.();
      }
    };

    // Initial burst from center
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { x: 0.5, y: 0.5 },
      colors,
      ticks: 150,
      gravity: 1,
      scalar: 1,
    });

    frame();
  }, [onComplete]);

  useEffect(() => {
    if (trigger && !hasTriggered.current) {
      hasTriggered.current = true;
      fireConfetti();
    }
    
    if (!trigger) {
      hasTriggered.current = false;
    }
  }, [trigger, fireConfetti]);

  return null;
}

// Export a function to trigger confetti programmatically
export function triggerWorkoutSuccessAnimation(): Promise<void> {
  return new Promise((resolve) => {
    const colors = ["#ffffff", "#888888", "#cccccc"];

    // Center burst
    confetti({
      particleCount: 60,
      spread: 80,
      origin: { x: 0.5, y: 0.5 },
      colors,
      ticks: 150,
      gravity: 1,
      scalar: 1,
    });

    // Side bursts
    setTimeout(() => {
      confetti({
        particleCount: 30,
        angle: 60,
        spread: 50,
        origin: { x: 0, y: 0.6 },
        colors,
        ticks: 150,
      });
      confetti({
        particleCount: 30,
        angle: 120,
        spread: 50,
        origin: { x: 1, y: 0.6 },
        colors,
        ticks: 150,
      });
    }, 150);

    setTimeout(resolve, 900);
  });
}
