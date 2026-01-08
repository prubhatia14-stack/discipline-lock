import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useChallenge } from "@/context/ChallengeContext";
import { SplashScreen } from "@/components/SplashScreen";

export default function Index() {
  const navigate = useNavigate();
  const { challenge } = useChallenge();
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
  }, []);

  useEffect(() => {
    if (!showSplash) {
      if (challenge && challenge.status === 'active') {
        navigate("/dashboard");
      } else {
        navigate("/onboarding");
      }
    }
  }, [challenge, navigate, showSplash]);

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} duration={1500} />;
  }

  return (
    <div className="dark min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
