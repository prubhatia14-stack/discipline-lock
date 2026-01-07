import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format, addDays } from "date-fns";

interface StartDateScreenProps {
  onContinue: (date: Date) => void;
  onBack: () => void;
}

export function StartDateScreen({ onContinue, onBack }: StartDateScreenProps) {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<Date>(today);

  // Limit to next 3 days only (today + 2 more)
  const dateOptions = Array.from({ length: 3 }, (_, i) => addDays(today, i));

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
            <h2 className="text-3xl font-bold uppercase">Start Date</h2>
            <p className="text-muted-foreground">Choose when your challenge begins.</p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {dateOptions.map((date, index) => (
              <button
                key={index}
                onClick={() => setSelectedDate(date)}
                className={cn(
                  "p-4 border-2 transition-all flex flex-col items-center",
                  selectedDate.toDateString() === date.toDateString()
                    ? "bg-foreground text-background shadow-md"
                    : "hover:shadow-xs hover:translate-x-[1px] hover:translate-y-[1px]"
                )}
              >
                <span className="text-xs uppercase font-medium">
                  {format(date, "EEE")}
                </span>
                <span className="text-2xl font-bold">
                  {format(date, "d")}
                </span>
                <span className={cn(
                  "text-xs",
                  selectedDate.toDateString() === date.toDateString() 
                    ? "text-background/70" 
                    : "text-muted-foreground"
                )}>
                  {format(date, "MMM")}
                </span>
              </button>
            ))}
          </div>

          {selectedDate.toDateString() === today.toDateString() && (
            <p className="text-center text-sm font-medium uppercase">
              Starting today
            </p>
          )}

          <Button 
            onClick={() => onContinue(selectedDate)}
            className="w-full h-14 text-lg font-bold uppercase border-2 shadow-md hover:shadow-xs hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
