import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface DurationScreenProps {
  initialDuration: number;
  initialPenalty: number;
  initialCommitmentDays: number;
  onContinue: (duration: number, penaltyPerDay: number, commitmentDays: number) => void;
  onBack: () => void;
}

const MIN_DAYS = 7;
const MAX_DAYS = 90;
const MIN_PENALTY = 50;
const MAX_PENALTY = 1000;
const PENALTY_STEP = 50;
const COMMITMENT_OPTIONS = [3, 4, 5, 6, 7];

export function DurationScreen({ initialDuration, initialPenalty, initialCommitmentDays, onContinue, onBack }: DurationScreenProps) {
  const [selectedDuration, setSelectedDuration] = useState(
    Math.max(MIN_DAYS, Math.min(MAX_DAYS, initialDuration))
  );
  const [penaltyPerDay, setPenaltyPerDay] = useState(initialPenalty);
  const [commitmentDays, setCommitmentDays] = useState(initialCommitmentDays);

  const calculatedStake = selectedDuration * penaltyPerDay;

  return (
    <div className="flex flex-col min-h-screen p-8 select-none">
      <button 
        onClick={onBack}
        className="self-start text-muted-foreground hover:text-foreground transition-colors uppercase text-sm font-medium select-none"
      >
        ← Back
      </button>

      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full">
        <div className="w-full space-y-7">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold uppercase">Build Your Challenge</h2>
            <p className="text-muted-foreground">
              I'm not gambling. I'm pre-paying my discipline.
            </p>
          </div>

          {/* Duration */}
          <div className="space-y-3">
            <div className="text-center">
              <p className="text-5xl font-bold">{selectedDuration}</p>
              <p className="text-muted-foreground uppercase text-sm">days</p>
            </div>
            <div className="px-2">
              <Slider
                value={[selectedDuration]}
                onValueChange={(value) => setSelectedDuration(value[0])}
                min={MIN_DAYS}
                max={MAX_DAYS}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <span>{MIN_DAYS} days</span>
                <span>{MAX_DAYS} days</span>
              </div>
            </div>
          </div>

          {/* Commitment days per week */}
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground uppercase text-center font-medium">
              Workout days per week
            </p>
            <div className="flex gap-2 justify-center">
              {COMMITMENT_OPTIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => setCommitmentDays(d)}
                  className={`w-12 h-12 border-2 font-bold text-lg transition-all ${
                    commitmentDays === d
                      ? "bg-foreground text-background shadow-md"
                      : "hover:shadow-xs hover:translate-x-[1px] hover:translate-y-[1px]"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Commit to at least 3 days a week
            </p>
          </div>

          {/* Penalty per day */}
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground uppercase text-center font-medium">
              Penalty per missed day
            </p>
            <div className="text-center">
              <p className="text-3xl font-bold">₹{penaltyPerDay}</p>
            </div>
            <div className="px-2">
              <Slider
                value={[penaltyPerDay]}
                onValueChange={(value) => setPenaltyPerDay(value[0])}
                min={MIN_PENALTY}
                max={MAX_PENALTY}
                step={PENALTY_STEP}
                className="w-full"
              />
              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <span>₹{MIN_PENALTY}</span>
                <span>₹{MAX_PENALTY}</span>
              </div>
            </div>
          </div>

          {/* Auto-calculated Stake */}
          <div className="border-2 p-5 text-center space-y-1">
            <p className="text-sm text-muted-foreground uppercase">Amount to Lock</p>
            <p className="text-4xl font-bold">₹{calculatedStake.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">
              ₹{penaltyPerDay} × {selectedDuration} days
            </p>
          </div>

          <Button 
            onClick={() => onContinue(selectedDuration, penaltyPerDay, commitmentDays)}
            className="w-full h-14 text-lg font-bold uppercase border-2 shadow-md hover:shadow-xs hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
