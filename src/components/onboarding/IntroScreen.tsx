import { Button } from "@/components/ui/button";

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

        <div className="pt-8">
          <Button 
            onClick={onContinue}
            className="w-full h-14 text-lg font-bold uppercase border-2 shadow-md hover:shadow-xs hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
          >
            Start
          </Button>
        </div>
      </div>
    </div>
  );
}
