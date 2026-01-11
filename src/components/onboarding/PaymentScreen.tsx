import { Button } from "@/components/ui/button";
import { format, addDays } from "date-fns";
import { Lock, Shield } from "lucide-react";

interface PaymentScreenProps {
  stakeAmount: number;
  durationDays: number;
  startDate: Date;
  onConfirm: () => void;
  onBack: () => void;
}

const PENALTY_PER_DAY = 100;

export function PaymentScreen({ 
  stakeAmount, 
  durationDays, 
  startDate, 
  onConfirm, 
  onBack 
}: PaymentScreenProps) {
  const endDate = addDays(startDate, durationDays);

  return (
    <div className="flex flex-col min-h-screen p-8">
      <button 
        onClick={onBack}
        className="self-start text-muted-foreground hover:text-foreground transition-colors uppercase text-sm font-medium select-none active:scale-95"
      >
        ← Back
      </button>

      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full">
        <div className="w-full space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold uppercase select-none">Lock Your Discipline</h2>
            <p className="text-muted-foreground">Pre-pay for consistency. Get back what you don't burn.</p>
          </div>

          <div className="border-2 divide-y-2">
            <div className="p-4 flex justify-between items-center">
              <span className="text-muted-foreground">Amount to Lock</span>
              <span className="text-2xl font-bold">₹{stakeAmount.toLocaleString()}</span>
            </div>
            <div className="p-4 flex justify-between items-center">
              <span className="text-muted-foreground">Duration</span>
              <span className="font-bold">{durationDays} days</span>
            </div>
            <div className="p-4 flex justify-between items-center">
              <span className="text-muted-foreground">Penalty per miss</span>
              <span className="font-bold text-destructive">-₹{PENALTY_PER_DAY}</span>
            </div>
            <div className="p-4 flex justify-between items-center">
              <span className="text-muted-foreground">Start Date</span>
              <span className="font-bold">{format(startDate, "MMM d, yyyy")}</span>
            </div>
            <div className="p-4 flex justify-between items-center">
              <span className="text-muted-foreground">End Date</span>
              <span className="font-bold">{format(endDate, "MMM d, yyyy")}</span>
            </div>
          </div>

          {/* Safety Guarantee */}
          <div className="p-4 border-2 border-dashed bg-muted/30">
            <div className="flex items-center gap-3 text-sm">
              <Shield className="w-5 h-5 shrink-0" />
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">Zero-risk guarantee:</span> You can only lose what you lock. Balance never goes negative.
              </p>
            </div>
          </div>

          {/* Lock Info */}
          <div className="p-4 border-2 border-dashed bg-muted/30">
            <div className="flex items-center gap-3 text-sm">
              <Lock className="w-5 h-5 shrink-0" />
              <p className="text-muted-foreground">
                Complete all {durationDays} days = full ₹{stakeAmount.toLocaleString()} back. Miss days = ₹{PENALTY_PER_DAY} per miss deducted.
              </p>
            </div>
          </div>

          <Button 
            onClick={onConfirm}
            className="w-full h-14 text-lg font-bold uppercase border-2 shadow-md active:shadow-xs active:translate-x-[3px] active:translate-y-[3px] transition-all select-none"
          >
            Lock ₹{stakeAmount.toLocaleString()}
          </Button>
        </div>
      </div>
    </div>
  );
}
