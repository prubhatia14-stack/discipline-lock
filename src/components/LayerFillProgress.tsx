import { cn } from "@/lib/utils";

interface LayerFillProgressProps {
  completed: number;
  total: number;
  missed?: number;
  className?: string;
}

export function LayerFillProgress({
  completed,
  total,
  missed = 0,
  className,
}: LayerFillProgressProps) {
  const fillPercent = Math.min(100, (completed / total) * 100);
  const missedPercent = Math.min(100, (missed / total) * 100);

  return (
    <div className={cn("relative w-full", className)}>
      {/* Main container */}
      <div className="relative h-48 w-full border-2 border-border overflow-hidden bg-muted/20">
        {/* Missed indicator at top */}
        {missed > 0 && (
          <div
            className="absolute top-0 left-0 right-0 bg-destructive/30 transition-all duration-500"
            style={{ height: `${missedPercent}%` }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
            </div>
          </div>
        )}

        {/* Fill from bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 bg-foreground/90 transition-all duration-700 ease-out"
          style={{ height: `${fillPercent}%` }}
        >
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent to-foreground/10" />
          
          {/* Layer lines */}
          <div className="absolute inset-0 flex flex-col justify-end">
            {Array.from({ length: Math.min(completed, 10) }).map((_, i) => (
              <div
                key={i}
                className="h-px bg-background/20 w-full"
                style={{ marginBottom: `${(100 / Math.min(completed, 10)) * i}%` }}
              />
            ))}
          </div>
        </div>

        {/* Center stats */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center">
            <p
              className={cn(
                "text-5xl font-bold transition-colors duration-300",
                fillPercent > 50 ? "text-background" : "text-foreground"
              )}
            >
              {completed}
            </p>
            <p
              className={cn(
                "text-sm uppercase tracking-wider transition-colors duration-300",
                fillPercent > 50 ? "text-background/70" : "text-muted-foreground"
              )}
            >
              / {total} days
            </p>
          </div>
        </div>
      </div>

      {/* Labels */}
      <div className="flex justify-between mt-2 text-xs text-muted-foreground uppercase">
        <span>Progress</span>
        <span>{Math.round(fillPercent)}%</span>
      </div>
    </div>
  );
}
