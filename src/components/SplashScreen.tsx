import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { triggerHaptic } from "@/hooks/useHapticFeedback";

interface SplashScreenProps {
  onComplete: () => void;
  duration?: number;
  isQuick?: boolean;
}

export function SplashScreen({ onComplete, duration = 1500, isQuick = false }: SplashScreenProps) {
  const [isExiting, setIsExiting] = useState(false);
  const [showTagline, setShowTagline] = useState(false);

  const actualDuration = isQuick ? 400 : duration;

  useEffect(() => {
    // Haptic on logo appear
    if (!isQuick) {
      const hapticTimer = setTimeout(() => {
        triggerHaptic('medium');
      }, 300);

      // Show tagline after lock animates
      const taglineTimer = setTimeout(() => {
        setShowTagline(true);
      }, 800);

      const exitTimer = setTimeout(() => {
        setIsExiting(true);
      }, actualDuration - 300);

      const completeTimer = setTimeout(() => {
        onComplete();
      }, actualDuration);

      return () => {
        clearTimeout(hapticTimer);
        clearTimeout(taglineTimer);
        clearTimeout(exitTimer);
        clearTimeout(completeTimer);
      };
    } else {
      // Quick splash - just fade
      const exitTimer = setTimeout(() => {
        setIsExiting(true);
      }, actualDuration - 150);

      const completeTimer = setTimeout(() => {
        onComplete();
      }, actualDuration);

      return () => {
        clearTimeout(exitTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [actualDuration, onComplete, isQuick]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] bg-background text-foreground flex items-center justify-center dark select-none",
        "transition-all",
        isQuick ? "duration-150" : "duration-300",
        isExiting ? "opacity-0 scale-[1.02]" : "opacity-100 scale-100"
      )}
      style={{ backgroundColor: "#000" }}
    >
      <div className={cn(
        "text-center transition-transform duration-700",
        !isQuick && "animate-splash-scale"
      )}>
        {/* Lock icon animation */}
        <div className="mb-6 flex justify-center">
          <svg
            viewBox="0 0 64 64"
            className={cn("w-20 h-20", !isQuick && "animate-splash-lock")}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            {/* Lock body */}
            <rect
              x="12"
              y="28"
              width="40"
              height="32"
              rx="4"
              className={isQuick ? "" : "animate-splash-lock-body"}
              style={isQuick ? {} : { strokeDasharray: 144, strokeDashoffset: 144 }}
            />
            {/* Lock shackle */}
            <path
              d="M20 28V20C20 13.373 25.373 8 32 8C38.627 8 44 13.373 44 20V28"
              className={isQuick ? "" : "animate-splash-lock-shackle"}
              style={isQuick ? {} : { strokeDasharray: 60, strokeDashoffset: 60 }}
            />
            {/* Keyhole */}
            <circle
              cx="32"
              cy="42"
              r="4"
              className={isQuick ? "" : "animate-splash-keyhole"}
              style={isQuick ? {} : { opacity: 0 }}
            />
          </svg>
        </div>

        {/* Wordmark */}
        <h1 
          className={cn(
            "text-4xl font-bold tracking-widest uppercase",
            !isQuick && "animate-splash-text"
          )}
          style={isQuick ? {} : { opacity: 0 }}
        >
          LOCKIT
        </h1>

        {/* Tagline - only on full splash */}
        {!isQuick && (
          <p 
            className={cn(
              "mt-3 text-sm text-muted-foreground tracking-wider transition-all duration-500",
              showTagline ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            )}
          >
            Lock your discipline.
          </p>
        )}
      </div>
    </div>
  );
}
