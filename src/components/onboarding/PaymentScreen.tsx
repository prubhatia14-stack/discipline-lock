import { Button } from "@/components/ui/button";
import { format, addDays } from "date-fns";
import { Lock } from "lucide-react";

interface PaymentScreenProps {
  stakeAmount: number;
  durationDays: number;
  startDate: Date;
  onConfirm: () => void;
  onBack: () => void;
}

export function PaymentScreen({ 
  stakeAmount, 
  durationDays, 
  startDate, 
  onConfirm, 
  onBack 
}: PaymentScreenProps) {
  const endDate = addDays(startDate, durationDays);
  const penaltyPerDay = 100;

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
            <h2 className="text-3xl font-bold uppercase">Confirm & Lock</h2>
            <p className="text-muted-foreground">Your money will be locked until challenge completion.</p>
          </div>

          <div className="border-2 divide-y-2">
            <div className="p-4 flex justify-between items-center">
              <span className="text-muted-foreground">Total Locked</span>
              <span className="text-2xl font-bold">₹{stakeAmount.toLocaleString()}</span>
            </div>
            <div className="p-4 flex justify-between items-center">
              <span className="text-muted-foreground">Duration</span>
              <span className="font-bold">{durationDays} days</span>
            </div>
            <div className="p-4 flex justify-between items-center">
              <span className="text-muted-foreground">Penalty per miss</span>
              <span className="font-bold text-destructive">-₹{penaltyPerDay}</span>
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

          <div className="p-4 border-2 border-dashed bg-muted/50">
            <div className="flex items-center gap-3 text-sm">
              <Lock className="w-5 h-5 shrink-0" />
              <p className="text-muted-foreground">
                Funds are non-refundable until challenge ends. Failed audits result in full stake forfeiture.
              </p>
            </div>
          </div>

          <Button 
            onClick={onConfirm}
            className="w-full h-14 text-lg font-bold uppercase border-2 shadow-md hover:shadow-xs hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
          >
            Lock My Money
          </Button>
        </div>
      </div>
    </div>
  );
}
