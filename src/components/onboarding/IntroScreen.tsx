import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/PageTransition";

interface IntroScreenProps {
  onContinue: () => void;
}

export function IntroScreen({ onContinue }: IntroScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center relative overflow-hidden select-none">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/20 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,hsl(var(--background))_70%)] pointer-events-none" />
      
      <div className="max-w-md space-y-10 relative z-10">
        <PageTransition delay={100}>
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight uppercase leading-tight">
              Put money on your consistency
            </h1>
            
            <div className="space-y-2 text-lg text-muted-foreground">
              <p>Miss workouts. Lose money.</p>
              <p>Stay consistent. Get it back.</p>
            </div>
          </div>
        </PageTransition>

        <PageTransition delay={300}>
          <div className="pt-4">
            <Button 
              onClick={onContinue}
              className="w-full h-14 text-lg font-bold uppercase border-2 shadow-md active:shadow-xs active:translate-x-[3px] active:translate-y-[3px] transition-all select-none"
            >
              Start
            </Button>
          </div>
        </PageTransition>
      </div>
    </div>
  );
}
