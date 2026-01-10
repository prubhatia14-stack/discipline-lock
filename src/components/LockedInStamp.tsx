import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface LockedInStampProps {
  trigger: boolean;
  onComplete?: () => void;
}

export function LockedInStamp({ trigger, onComplete }: LockedInStampProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const lastTriggerRef = useRef(false);

  useEffect(() => {
    // Only trigger on rising edge (false -> true transition)
    if (trigger && !lastTriggerRef.current && !isAnimating) {
      setIsAnimating(true);
      setIsVisible(true);

      // Fade out after display
      const fadeTimer = setTimeout(() => {
        setIsVisible(false);
      }, 600);

      // Complete animation
      const completeTimer = setTimeout(() => {
        setIsAnimating(false);
        onComplete?.();
      }, 900);

      lastTriggerRef.current = trigger;

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(completeTimer);
      };
    }
    
    // Track the trigger state
    lastTriggerRef.current = trigger;
  }, [trigger, isAnimating, onComplete]);

  if (!isAnimating) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      <div
        className={cn(
          "text-4xl md:text-5xl font-bold uppercase tracking-widest",
          "text-foreground/90 select-none",
          "transition-all duration-300 ease-out",
          isVisible
            ? "opacity-100 scale-100 rotate-[-3deg]"
            : "opacity-0 scale-110 rotate-0"
        )}
        style={{
          textShadow: "0 0 30px hsl(var(--foreground) / 0.3)",
        }}
      >
        LOCKED IN
      </div>
    </div>
  );
}
