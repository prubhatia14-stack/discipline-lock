import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  size: number;
  velocityX: number;
  velocityY: number;
}

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "hsl(142, 76%, 36%)", // green
  "hsl(48, 96%, 53%)",  // gold
  "hsl(280, 87%, 65%)", // purple
];

export function ConfettiCelebration({ trigger }: { trigger: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (trigger && !isAnimating) {
      setIsAnimating(true);
      
      // Create particles
      const newParticles: Particle[] = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: 50 + (Math.random() - 0.5) * 20,
        y: 50,
        rotation: Math.random() * 360,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 8 + Math.random() * 8,
        velocityX: (Math.random() - 0.5) * 15,
        velocityY: -10 - Math.random() * 10,
      }));
      
      setParticles(newParticles);
      
      // Clear after animation
      setTimeout(() => {
        setParticles([]);
        setIsAnimating(false);
      }, 2500);
    }
  }, [trigger, isAnimating]);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-confetti"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            transform: `rotate(${particle.rotation}deg)`,
            "--velocity-x": particle.velocityX,
            "--velocity-y": particle.velocityY,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
