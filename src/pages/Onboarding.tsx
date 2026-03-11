import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChallenge } from "@/context/ChallengeContext";
import { IntroScreen } from "@/components/onboarding/IntroScreen";
import { DurationScreen } from "@/components/onboarding/DurationScreen";
import { RulesScreen } from "@/components/onboarding/RulesScreen";
import { PaymentScreen } from "@/components/onboarding/PaymentScreen";
import { PageTransition } from "@/components/PageTransition";
import { addDays } from "date-fns";
import { toast } from "sonner";

export default function Onboarding() {
  const navigate = useNavigate();
  const { setChallenge } = useChallenge();
  
  const [step, setStep] = useState(1);
  const [durationDays, setDurationDays] = useState(30);
  const [penaltyPerDay, setPenaltyPerDay] = useState(100);
  const [commitmentDays, setCommitmentDays] = useState(5);

  const stakeAmount = durationDays * penaltyPerDay;
  const startDate = new Date();

  const handleConfirm = () => {
    const challenge = {
      id: crypto.randomUUID(),
      stakeAmount,
      durationDays,
      penaltyPerDay,
      commitmentDaysPerWeek: commitmentDays,
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
    toast.success("Challenge started! Your discipline is now locked in.");
    navigate("/dashboard");
  };

  return (
    <div className="dark min-h-screen bg-background text-foreground overflow-hidden">
      {step === 1 && (
        <PageTransition key="intro">
          <IntroScreen onContinue={() => setStep(2)} />
        </PageTransition>
      )}
      {step === 2 && (
        <PageTransition key="duration">
          <DurationScreen
            initialDuration={durationDays}
            initialPenalty={penaltyPerDay}
            initialCommitmentDays={commitmentDays}
            onContinue={(duration, penalty, days) => {
              setDurationDays(duration);
              setPenaltyPerDay(penalty);
              setCommitmentDays(days);
              setStep(3);
            }}
            onBack={() => setStep(1)}
          />
        </PageTransition>
      )}
      {step === 3 && (
        <PageTransition key="rules">
          <RulesScreen
            stakeAmount={stakeAmount}
            durationDays={durationDays}
            penaltyPerDay={penaltyPerDay}
            commitmentDaysPerWeek={commitmentDays}
            onContinue={() => setStep(4)}
            onBack={() => setStep(2)}
          />
        </PageTransition>
      )}
      {step === 4 && (
        <PageTransition key="payment">
          <PaymentScreen
            stakeAmount={stakeAmount}
            durationDays={durationDays}
            penaltyPerDay={penaltyPerDay}
            commitmentDaysPerWeek={commitmentDays}
            startDate={startDate}
            onConfirm={handleConfirm}
            onBack={() => setStep(3)}
          />
        </PageTransition>
      )}
    </div>
  );
}
