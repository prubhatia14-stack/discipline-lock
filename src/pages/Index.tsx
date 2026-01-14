import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useChallenge } from "@/context/ChallengeContext";
import { useAuth } from "@/context/AuthContext";
import { SplashScreen } from "@/components/SplashScreen";
import { useAppLaunchAnimation } from "@/hooks/useAppLaunchAnimation";

export default function Index() {
  const navigate = useNavigate();
  const { challenge } = useChallenge();
  const { user, loading: authLoading } = useAuth();
  const { showFullSplash, showQuickSplash, splashComplete, completeSplash } = useAppLaunchAnimation();

  useEffect(() => {
    // Wait for both splash and auth to complete
    if (!splashComplete || authLoading) return;

    // If no user, go to auth
    if (!user) {
      navigate("/auth");
      return;
    }

    // User is authenticated, check challenge status
    if (challenge && challenge.status === 'active') {
      navigate("/dashboard");
    } else {
      navigate("/onboarding");
    }
  }, [challenge, navigate, splashComplete, user, authLoading]);

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
