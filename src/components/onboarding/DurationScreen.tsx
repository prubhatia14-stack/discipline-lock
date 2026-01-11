import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";

interface DurationScreenProps {
  initialDuration: number;
  onContinue: (duration: number) => void;
  onBack: () => void;
}

const PENALTY_PER_DAY = 100;
const MIN_DAYS = 7;
const MAX_DAYS = 90;

export function DurationScreen({ initialDuration, onContinue, onBack }: DurationScreenProps) {
  const [selectedDuration, setSelectedDuration] = useState(
    Math.max(MIN_DAYS, Math.min(MAX_DAYS, initialDuration))
  );

  const calculatedStake = selectedDuration * PENALTY_PER_DAY;

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
            <h2 className="text-3xl font-bold uppercase">Choose Duration</h2>
            <p className="text-muted-foreground">
              I'm not gambling. I'm pre-paying my discipline.
            </p>
          </div>

          {/* Duration Display */}
          <div className="text-center space-y-2">
            <p className="text-7xl font-bold">{selectedDuration}</p>
            <p className="text-muted-foreground uppercase text-sm">days</p>
          </div>

          {/* Slider */}
          <div className="px-2 py-6">
            <Slider
              value={[selectedDuration]}
              onValueChange={(value) => setSelectedDuration(value[0])}
              min={MIN_DAYS}
              max={MAX_DAYS}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>{MIN_DAYS} days</span>
              <span>{MAX_DAYS} days</span>
            </div>
          </div>

          {/* Auto-calculated Stake */}
          <div className="border-2 p-6 text-center space-y-2">
            <p className="text-sm text-muted-foreground uppercase">Amount to Lock</p>
            <p className="text-4xl font-bold">₹{calculatedStake.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">
              ₹{PENALTY_PER_DAY} × {selectedDuration} days
            </p>
          </div>

          {/* Info Box */}
          <div className="p-4 border-2 border-dashed bg-muted/30">
            <p className="text-sm text-muted-foreground text-center">
              Miss a day? Lose ₹{PENALTY_PER_DAY}. Complete all days? Get everything back.
            </p>
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
