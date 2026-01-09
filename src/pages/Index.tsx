import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useChallenge } from "@/context/ChallengeContext";
import { SplashScreen } from "@/components/SplashScreen";
import { useAppLaunchAnimation } from "@/hooks/useAppLaunchAnimation";

export default function Index() {
  const navigate = useNavigate();
  const { challenge } = useChallenge();
  const { showFullSplash, showQuickSplash, splashComplete, completeSplash } = useAppLaunchAnimation();

  useEffect(() => {
    if (splashComplete) {
      if (challenge && challenge.status === 'active') {
        navigate("/dashboard");
      } else {
        navigate("/onboarding");
      }
    }
  }, [challenge, navigate, splashComplete]);

  if (showFullSplash || showQuickSplash) {
    return (
      <SplashScreen 
        onComplete={completeSplash} 
        duration={1500}
        isQuick={showQuickSplash}
      />
    );
  }

  return (
    <div className="dark min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
