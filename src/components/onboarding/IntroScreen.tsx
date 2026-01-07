import { HoldButton } from "@/components/ui/HoldButton";

interface IntroScreenProps {
  onContinue: () => void;
}

export function IntroScreen({ onContinue }: IntroScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      <div className="max-w-md space-y-8">
        <h1 className="text-4xl font-bold tracking-tight uppercase">
          Put money on your consistency
        </h1>
        
        <div className="space-y-4 text-lg">
          <p className="text-muted-foreground">Miss workouts. Lose money.</p>
          <p className="text-muted-foreground">Stay consistent. Get it back.</p>
        </div>

        <div className="pt-8 space-y-3">
          <HoldButton 
            onHoldComplete={onContinue}
            holdDuration={3000}
            className="w-full h-14 text-lg font-bold uppercase border-2 shadow-md transition-all"
          >
            Hold to Start
          </HoldButton>
          <p className="text-xs text-muted-foreground">
            Hold for 3 seconds to begin
          </p>
        </div>
      </div>
    </div>
  );
}
