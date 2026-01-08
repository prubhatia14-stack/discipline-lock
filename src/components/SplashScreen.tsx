import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface SplashScreenProps {
  onComplete: () => void;
  duration?: number;
}

export function SplashScreen({ onComplete, duration = 1500 }: SplashScreenProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, duration - 300);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, duration);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [duration, onComplete]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] bg-background flex items-center justify-center transition-opacity duration-300 dark",
        isExiting ? "opacity-0" : "opacity-100"
      )}
      style={{ backgroundColor: "#000" }}
    >
      <div className="text-center">
        {/* Lock icon animation */}
        <div className="mb-6 flex justify-center">
          <svg
            viewBox="0 0 64 64"
            className="w-20 h-20 animate-splash-lock"
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
              className="animate-splash-lock-body"
              style={{ strokeDasharray: 144, strokeDashoffset: 144 }}
            />
            {/* Lock shackle */}
            <path
              d="M20 28V20C20 13.373 25.373 8 32 8C38.627 8 44 13.373 44 20V28"
              className="animate-splash-lock-shackle"
              style={{ strokeDasharray: 60, strokeDashoffset: 60 }}
            />
            {/* Keyhole */}
            <circle
              cx="32"
              cy="42"
              r="4"
              className="animate-splash-keyhole"
              style={{ opacity: 0 }}
            />
          </svg>
        </div>

        {/* Wordmark */}
        <h1 
          className="text-4xl font-bold tracking-widest uppercase animate-splash-text"
          style={{ opacity: 0 }}
        >
          LOCKIT
        </h1>
      </div>
    </div>
  );
}
