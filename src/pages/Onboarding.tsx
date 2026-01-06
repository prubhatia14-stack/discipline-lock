import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChallenge } from "@/context/ChallengeContext";
import { IntroScreen } from "@/components/onboarding/IntroScreen";
import { StakeScreen } from "@/components/onboarding/StakeScreen";
import { DurationScreen } from "@/components/onboarding/DurationScreen";
import { RulesScreen } from "@/components/onboarding/RulesScreen";
import { StartDateScreen } from "@/components/onboarding/StartDateScreen";
import { PaymentScreen } from "@/components/onboarding/PaymentScreen";
import { addDays } from "date-fns";
import { toast } from "sonner";

export default function Onboarding() {
  const navigate = useNavigate();
  const { setChallenge } = useChallenge();
  
  const [step, setStep] = useState(1);
  const [stakeAmount, setStakeAmount] = useState(1000);
  const [durationDays, setDurationDays] = useState(30);
  const [startDate, setStartDate] = useState<Date>(new Date());

  const handleConfirm = () => {
    const challenge = {
      id: crypto.randomUUID(),
      stakeAmount,
      durationDays,
      startDate,
      endDate: addDays(startDate, durationDays),
      currentStreak: 0,
      workoutsCompleted: 0,
      totalPenalties: 0,
      remainingStake: stakeAmount,
      status: 'active' as const,
      workoutLogs: [],
    };
    
    setChallenge(challenge);
    toast.success("Challenge started! Your money is now locked.");
    navigate("/dashboard");
  };

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      {step === 1 && (
        <IntroScreen onContinue={() => setStep(2)} />
      )}
      {step === 2 && (
        <StakeScreen
          initialStake={stakeAmount}
          onContinue={(stake) => {
            setStakeAmount(stake);
            setStep(3);
          }}
          onBack={() => setStep(1)}
        />
      )}
      {step === 3 && (
        <DurationScreen
          initialDuration={durationDays}
          onContinue={(duration) => {
            setDurationDays(duration);
            setStep(4);
          }}
          onBack={() => setStep(2)}
        />
      )}
      {step === 4 && (
        <RulesScreen
          stakeAmount={stakeAmount}
          onContinue={() => setStep(5)}
          onBack={() => setStep(3)}
        />
      )}
      {step === 5 && (
        <StartDateScreen
          onContinue={(date) => {
            setStartDate(date);
            setStep(6);
          }}
          onBack={() => setStep(4)}
        />
      )}
      {step === 6 && (
        <PaymentScreen
          stakeAmount={stakeAmount}
          durationDays={durationDays}
          startDate={startDate}
          onConfirm={handleConfirm}
          onBack={() => setStep(5)}
        />
      )}
    </div>
  );
}
