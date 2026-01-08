import * as React from "react";
import { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./button";
import { type VariantProps } from "class-variance-authority";
import { triggerHaptic } from "@/hooks/useHapticFeedback";

interface HoldButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  holdDuration?: number; // in milliseconds
  onHoldComplete: () => void;
  children: React.ReactNode;
}

export function HoldButton({
  holdDuration = 3000,
  onHoldComplete,
  children,
  className,
  variant,
  size,
  disabled,
  ...props
}: HoldButtonProps) {
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const lastMilestoneRef = useRef<number>(0);

  const startHold = useCallback(() => {
    if (disabled) return;
    setIsHolding(true);
    startTimeRef.current = Date.now();
    lastMilestoneRef.current = 0;
    
    // Initial haptic on start
    triggerHaptic('light');
    
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const newProgress = Math.min((elapsed / holdDuration) * 100, 100);
      setProgress(newProgress);
      
      // Subtle haptic feedback at milestones (25%, 50%, 75%)
      const milestone = Math.floor(newProgress / 25);
      if (milestone > lastMilestoneRef.current && milestone < 4) {
        triggerHaptic('light');
        lastMilestoneRef.current = milestone;
      }
      
      if (newProgress >= 100) {
        clearInterval(intervalRef.current!);
        // Strong success haptic on completion
        triggerHaptic('success');
        onHoldComplete();
        setProgress(0);
        setIsHolding(false);
      }
    }, 16); // ~60fps
  }, [holdDuration, onHoldComplete, disabled]);

  const endHold = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setProgress(0);
    setIsHolding(false);
  }, []);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <button
      className={cn(
        buttonVariants({ variant, size }),
        "relative overflow-hidden select-none",
        className
      )}
      onMouseDown={startHold}
      onMouseUp={endHold}
      onMouseLeave={endHold}
      onTouchStart={startHold}
      onTouchEnd={endHold}
      onTouchCancel={endHold}
      onContextMenu={handleContextMenu}
      disabled={disabled}
      style={{
        WebkitUserSelect: "none",
        WebkitTouchCallout: "none",
        userSelect: "none",
      } as React.CSSProperties}
      {...props}
    >
      {/* Progress fill */}
      <div
        className={cn(
          "absolute inset-0 bg-primary-foreground/20 transition-none",
          isHolding ? "opacity-100" : "opacity-0"
        )}
        style={{ 
          width: `${progress}%`,
          transition: "none"
        }}
      />
      
      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
      
      {/* Ring indicator */}
      {isHolding && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <circle
              className="stroke-primary-foreground/30"
              fill="none"
              strokeWidth="2"
              r="10"
              cx="12"
              cy="12"
            />
            <circle
              className="stroke-primary-foreground"
              fill="none"
              strokeWidth="2"
              r="10"
              cx="12"
              cy="12"
              strokeDasharray={`${2 * Math.PI * 10}`}
              strokeDashoffset={`${2 * Math.PI * 10 * (1 - progress / 100)}`}
              style={{ 
                transform: "rotate(-90deg)",
                transformOrigin: "center"
              }}
            />
          </svg>
        </div>
      )}
    </button>
  );
}
