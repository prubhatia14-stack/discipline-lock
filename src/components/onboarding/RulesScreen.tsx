import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface RulesScreenProps {
  stakeAmount: number;
  durationDays: number;
  onContinue: () => void;
  onBack: () => void;
}

const PENALTY_PER_DAY = 100;

export function RulesScreen({ stakeAmount, durationDays, onContinue, onBack }: RulesScreenProps) {
  const [checkedRules, setCheckedRules] = useState<number[]>([]);

  const RULES = [
    "Log exactly 1 workout per day",
    `Missed day penalty: ₹${PENALTY_PER_DAY} (fixed)`,
    "Balance cannot go negative — max loss is your locked amount",
    `Complete all ${durationDays} days to get ₹${stakeAmount.toLocaleString()} back`,
  ];

  const toggleRule = (index: number) => {
    setCheckedRules((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  const allChecked = checkedRules.length === RULES.length;

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
            <h2 className="text-3xl font-bold uppercase">The Rules</h2>
            <p className="text-muted-foreground">Tap each rule to confirm you understand.</p>
          </div>

          <div className="space-y-3">
            {RULES.map((rule, index) => (
              <button
                key={index}
                onClick={() => toggleRule(index)}
                className={cn(
                  "w-full p-4 border-2 font-medium transition-all flex items-center gap-4 text-left",
                  checkedRules.includes(index)
                    ? "bg-foreground text-background"
                    : "hover:shadow-xs hover:translate-x-[2px] hover:translate-y-[2px]"
                )}
              >
                <div className={cn(
                  "w-6 h-6 border-2 flex items-center justify-center shrink-0",
                  checkedRules.includes(index) ? "border-background bg-background" : "border-current"
                )}>
                  {checkedRules.includes(index) && (
                    <Check className="w-4 h-4 text-foreground" />
                  )}
                </div>
                <span>{rule}</span>
              </button>
            ))}
          </div>

          <div className="p-4 border-2 border-dashed bg-muted/30">
            <p className="text-center text-sm text-muted-foreground">
              Your lock-in: <span className="font-bold text-foreground">₹{stakeAmount.toLocaleString()}</span>
              <br />
              <span className="text-xs">This is discipline, not gambling.</span>
            </p>
          </div>

          <Button 
            onClick={onContinue}
            disabled={!allChecked}
            className="w-full h-14 text-lg font-bold uppercase border-2 shadow-md hover:shadow-xs hover:translate-x-[3px] hover:translate-y-[3px] transition-all disabled:opacity-50"
          >
            I Understand
          </Button>
        </div>
      </div>
    </div>
  );
}
