import { cn } from "@/lib/utils";

interface PyramidAnimationProps {
  isVisible: boolean;
  onComplete?: () => void;
}

export function PyramidAnimation({ isVisible, onComplete }: PyramidAnimationProps) {
  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm animate-fade-in"
      onAnimationEnd={() => {
        setTimeout(() => onComplete?.(), 1500);
      }}
    >
      <div className="relative">
        {/* Pyramid structure */}
        <div className="flex flex-col items-center gap-1">
          {/* Top block */}
          <div 
            className="w-16 h-8 bg-primary border-2 border-primary-foreground/20 animate-scale-in"
            style={{ animationDelay: "0ms" }}
          />
          {/* Second row */}
          <div className="flex gap-1">
            <div 
              className="w-16 h-8 bg-primary border-2 border-primary-foreground/20 animate-scale-in"
              style={{ animationDelay: "100ms" }}
            />
            <div 
              className="w-16 h-8 bg-primary border-2 border-primary-foreground/20 animate-scale-in"
              style={{ animationDelay: "150ms" }}
            />
          </div>
          {/* Third row */}
          <div className="flex gap-1">
            <div 
              className="w-16 h-8 bg-primary border-2 border-primary-foreground/20 animate-scale-in"
              style={{ animationDelay: "200ms" }}
            />
            <div 
              className="w-16 h-8 bg-primary border-2 border-primary-foreground/20 animate-scale-in"
              style={{ animationDelay: "250ms" }}
            />
            <div 
              className="w-16 h-8 bg-primary border-2 border-primary-foreground/20 animate-scale-in"
              style={{ animationDelay: "300ms" }}
            />
          </div>
          {/* Fourth row */}
          <div className="flex gap-1">
            <div 
              className="w-16 h-8 bg-primary border-2 border-primary-foreground/20 animate-scale-in"
              style={{ animationDelay: "350ms" }}
            />
            <div 
              className="w-16 h-8 bg-primary border-2 border-primary-foreground/20 animate-scale-in"
              style={{ animationDelay: "400ms" }}
            />
            <div 
              className="w-16 h-8 bg-primary border-2 border-primary-foreground/20 animate-scale-in"
              style={{ animationDelay: "450ms" }}
            />
            <div 
              className="w-16 h-8 bg-primary border-2 border-primary-foreground/20 animate-scale-in"
              style={{ animationDelay: "500ms" }}
            />
          </div>
        </div>
        
        {/* Glow effect */}
        <div className="absolute inset-0 bg-primary/20 blur-3xl -z-10 animate-pulse" />
        
        {/* Success text */}
        <p 
          className="text-center mt-8 text-xl font-bold uppercase animate-fade-in"
          style={{ animationDelay: "600ms" }}
        >
          Workout Logged!
        </p>
      </div>
    </div>
  );
}
