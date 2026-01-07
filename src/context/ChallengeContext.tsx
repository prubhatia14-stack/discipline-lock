import React, { createContext, useContext, useState, useEffect } from 'react';
import { Challenge, OnboardingState } from '@/types/challenge';

interface ChallengeContextType {
  challenge: Challenge | null;
  setChallenge: (challenge: Challenge | null) => void;
  onboarding: OnboardingState;
  setOnboarding: (state: OnboardingState) => void;
  resetOnboarding: () => void;
  logWorkout: () => { audited: boolean; auditCode: number };
  applyPenalty: (amount: number) => void;
}

const initialOnboarding: OnboardingState = {
  step: 1,
  stakeAmount: 1000,
  durationDays: 30,
  startDate: null,
  rulesAccepted: false,
};

const ChallengeContext = createContext<ChallengeContextType | undefined>(undefined);

export function ChallengeProvider({ children }: { children: React.ReactNode }) {
  const [challenge, setChallenge] = useState<Challenge | null>(() => {
    const saved = localStorage.getItem('habits_challenge');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        startDate: new Date(parsed.startDate),
        endDate: new Date(parsed.endDate),
        workoutLogs: parsed.workoutLogs.map((log: any) => ({
          ...log,
          date: new Date(log.date),
        })),
      };
    }
    return null;
  });

  const [onboarding, setOnboarding] = useState<OnboardingState>(initialOnboarding);

  useEffect(() => {
    if (challenge) {
      localStorage.setItem('habits_challenge', JSON.stringify(challenge));
    } else {
      localStorage.removeItem('habits_challenge');
    }
  }, [challenge]);

  const resetOnboarding = () => setOnboarding(initialOnboarding);

  const logWorkout = () => {
    const auditTriggered = Math.random() < 0.5; // 50% audit probability
    const auditCode = Math.floor(Math.random() * 90) + 10;
    
    return { audited: auditTriggered, auditCode };
  };

  const applyPenalty = (amount: number) => {
    if (challenge) {
      const newRemaining = challenge.remainingStake - amount;
      setChallenge({
        ...challenge,
        remainingStake: Math.max(0, newRemaining),
        totalPenalties: challenge.totalPenalties + amount,
        currentStreak: 0,
      });
    }
  };

  return (
    <ChallengeContext.Provider
      value={{
        challenge,
        setChallenge,
        onboarding,
        setOnboarding,
        resetOnboarding,
        logWorkout,
        applyPenalty,
      }}
    >
      {children}
    </ChallengeContext.Provider>
  );
}

export function useChallenge() {
  const context = useContext(ChallengeContext);
  if (context === undefined) {
    throw new Error('useChallenge must be used within a ChallengeProvider');
  }
  return context;
}
