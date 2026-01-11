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
              Pre-pay your discipline
            </h1>
            
            <div className="space-y-2 text-lg text-muted-foreground">
              <p>Miss a workout. Lose money.</p>
              <p>Stay consistent. Get it all back.</p>
            </div>
          </div>
        </PageTransition>

        <PageTransition delay={200}>
          <div className="p-4 border-2 border-dashed bg-muted/30">
            <p className="text-sm text-muted-foreground italic">
              "I'm not gambling. I'm pre-paying my discipline."
            </p>
          </div>
        </PageTransition>

        <PageTransition delay={300}>
          <div className="pt-4">
            <Button 
              onClick={onContinue}
              className="w-full h-14 text-lg font-bold uppercase border-2 shadow-md active:shadow-xs active:translate-x-[3px] active:translate-y-[3px] transition-all select-none"
            >
              Start Challenge
            </Button>
          </div>
        </PageTransition>
      </div>
    </div>
  );
}
