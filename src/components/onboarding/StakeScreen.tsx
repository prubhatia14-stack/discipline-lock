import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface StakeScreenProps {
  initialStake: number;
  onContinue: (stake: number) => void;
  onBack: () => void;
}

const STAKE_OPTIONS = [500, 1000, 3000, 5000];

export function StakeScreen({ initialStake, onContinue, onBack }: StakeScreenProps) {
  const [selectedStake, setSelectedStake] = useState(initialStake);
  const [customStake, setCustomStake] = useState("");
  const [isCustom, setIsCustom] = useState(false);

  const handlePresetSelect = (amount: number) => {
    setSelectedStake(amount);
    setIsCustom(false);
    setCustomStake("");
  };

  const handleCustomChange = (value: string) => {
    setCustomStake(value);
    const parsed = parseInt(value);
    if (!isNaN(parsed) && parsed >= 500) {
      setSelectedStake(parsed);
    }
    setIsCustom(true);
  };

  const isValid = selectedStake >= 500;

  return (
    <div className="flex flex-col min-h-screen p-8">
      <button 
        onClick={onBack}
        className="self-start text-muted-foreground hover:text-foreground transition-colors uppercase text-sm font-medium"
      >
        ← Back
      </button>

      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full">
        <div className="w-full space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold uppercase">Lock your stake</h2>
            <p className="text-muted-foreground">Minimum ₹500. Non-withdrawable until challenge ends.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {STAKE_OPTIONS.map((amount) => (
              <button
                key={amount}
                onClick={() => handlePresetSelect(amount)}
                className={cn(
                  "h-16 border-2 font-bold text-xl transition-all",
                  selectedStake === amount && !isCustom
                    ? "bg-foreground text-background shadow-md"
                    : "hover:shadow-xs hover:translate-x-[2px] hover:translate-y-[2px]"
                )}
              >
                ₹{amount.toLocaleString()}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <Input
              type="number"
              placeholder="Custom amount"
              value={customStake}
              onChange={(e) => handleCustomChange(e.target.value)}
              className={cn(
                "h-14 text-lg text-center font-bold border-2",
                isCustom && "ring-2 ring-foreground"
              )}
              min={500}
            />
          </div>

          <div className="text-center">
            <p className="text-2xl font-bold">₹{selectedStake.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Total locked amount</p>
          </div>

          <Button 
            onClick={() => onContinue(selectedStake)}
            disabled={!isValid}
            className="w-full h-14 text-lg font-bold uppercase border-2 shadow-md hover:shadow-xs hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
