import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DurationScreenProps {
  initialDuration: number;
  onContinue: (duration: number) => void;
  onBack: () => void;
}

const DURATION_OPTIONS = [
  { days: 14, label: "2 weeks", description: "Easy start" },
  { days: 30, label: "30 days", description: "Standard" },
  { days: 60, label: "60 days", description: "Serious" },
  { days: 90, label: "90 days", description: "Maximum" },
];

export function DurationScreen({ initialDuration, onContinue, onBack }: DurationScreenProps) {
  const [selectedDuration, setSelectedDuration] = useState(initialDuration);

  return (
    <div className="flex flex-col min-h-screen p-8 select-none">
      <button 
        onClick={onBack}
        className="self-start text-muted-foreground hover:text-foreground transition-colors uppercase text-sm font-medium select-none"
      >
        ← Back
      </button>

      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full">
        <div className="w-full space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold uppercase">Challenge duration</h2>
            <p className="text-muted-foreground">Longer durations increase audit strictness.</p>
          </div>

          <div className="space-y-4">
            {DURATION_OPTIONS.map((option) => (
              <button
                key={option.days}
                onClick={() => setSelectedDuration(option.days)}
                className={cn(
                  "w-full h-20 border-2 font-bold text-xl transition-all flex items-center justify-between px-6",
                  selectedDuration === option.days
                    ? "bg-foreground text-background shadow-md"
                    : "hover:shadow-xs hover:translate-x-[2px] hover:translate-y-[2px]"
                )}
              >
                <span>{option.label}</span>
                <span className={cn(
                  "text-sm font-normal uppercase",
                  selectedDuration === option.days ? "text-background/70" : "text-muted-foreground"
                )}>
                  {option.description}
                </span>
              </button>
            ))}
          </div>

          <Button 
            onClick={() => onContinue(selectedDuration)}
            className="w-full h-14 text-lg font-bold uppercase border-2 shadow-md hover:shadow-xs hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
