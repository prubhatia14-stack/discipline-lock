import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useChallenge } from "@/context/ChallengeContext";

export default function Index() {
  const navigate = useNavigate();
  const { challenge } = useChallenge();

  useEffect(() => {
    if (challenge && challenge.status === 'active') {
      navigate("/dashboard");
    } else {
      navigate("/onboarding");
    }
  }, [challenge, navigate]);

  return (
    <div className="dark min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
