import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Challenge, OnboardingState, Transaction, ChallengeHistory } from '@/types/challenge';
import { getTrustedNowStandalone, getDayKeyStandalone } from '@/hooks/useTrustedTime';

interface ChallengeContextType {
  challenge: Challenge | null;
  setChallenge: (challenge: Challenge | null) => void;
  onboarding: OnboardingState;
  setOnboarding: (state: OnboardingState) => void;
  resetOnboarding: () => void;
  logWorkout: () => { audited: boolean; auditCode: number };
  applyPenalty: (amount: number, reason?: string) => void;
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id' | 'createdAtTrusted' | 'dayKey'>) => void;
  challengeHistory: ChallengeHistory[];
  archiveCurrentChallenge: (status: 'completed' | 'failed' | 'abandoned') => void;
  checkMissedDays: () => number; // Returns number of penalties applied
}

const initialOnboarding: OnboardingState = {
  step: 1,
  stakeAmount: 1000,
  durationDays: 30,
  startDate: null,
  rulesAccepted: false,
};

const ChallengeContext = createContext<ChallengeContextType | undefined>(undefined);

const PENALTY_AMOUNT = 100;

export function ChallengeProvider({ children }: { children: React.ReactNode }) {
  const [challenge, setChallengeState] = useState<Challenge | null>(() => {
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

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('habits_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [challengeHistory, setChallengeHistory] = useState<ChallengeHistory[]>(() => {
    const saved = localStorage.getItem('habits_challenge_history');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((ch: any) => ({
        ...ch,
        startDate: new Date(ch.startDate),
        endDate: new Date(ch.endDate),
        workoutLogs: ch.workoutLogs.map((log: any) => ({
          ...log,
          date: new Date(log.date),
        })),
      }));
    }
    return [];
  });

  const [onboarding, setOnboarding] = useState<OnboardingState>(initialOnboarding);
  const [lastCheckedDay, setLastCheckedDay] = useState<string>(() => {
    return localStorage.getItem('habits_last_checked_day') || '';
  });

  // Persist challenge
  useEffect(() => {
    if (challenge) {
      localStorage.setItem('habits_challenge', JSON.stringify(challenge));
    } else {
      localStorage.removeItem('habits_challenge');
    }
  }, [challenge]);

  // Persist transactions
  useEffect(() => {
    localStorage.setItem('habits_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Persist challenge history
  useEffect(() => {
    localStorage.setItem('habits_challenge_history', JSON.stringify(challengeHistory));
  }, [challengeHistory]);

  // Persist last checked day
  useEffect(() => {
    localStorage.setItem('habits_last_checked_day', lastCheckedDay);
  }, [lastCheckedDay]);

  const setChallenge = useCallback((newChallenge: Challenge | null) => {
    setChallengeState(newChallenge);
  }, []);

  const addTransaction = useCallback((tx: Omit<Transaction, 'id' | 'createdAtTrusted' | 'dayKey'>) => {
    const trustedNow = getTrustedNowStandalone();
    const newTx: Transaction = {
      ...tx,
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAtTrusted: trustedNow,
      dayKey: getDayKeyStandalone(trustedNow),
    };
    setTransactions((prev) => [newTx, ...prev]);
    return newTx;
  }, []);

  const applyPenalty = useCallback((amount: number, reason: string = 'Missed workout') => {
    if (!challenge) return;

    const newRemaining = Math.max(0, challenge.remainingStake - amount);
    
    setChallengeState({
      ...challenge,
      remainingStake: newRemaining,
      totalPenalties: challenge.totalPenalties + amount,
      currentStreak: 0,
    });

    // Create transaction
    addTransaction({
      challengeId: challenge.id,
      type: 'penalty',
      reason,
      amount: -amount,
      currency: 'INR',
      status: 'applied',
    });
  }, [challenge, addTransaction]);

  const checkMissedDays = useCallback((): number => {
    if (!challenge || challenge.status !== 'active') return 0;

    const trustedNow = getTrustedNowStandalone();
    const todayKey = getDayKeyStandalone(trustedNow);
    const startDate = new Date(challenge.startDate);
    startDate.setHours(0, 0, 0, 0);

    // If challenge hasn't started, nothing to check
    if (trustedNow < startDate.getTime()) return 0;

    let penaltiesApplied = 0;
    const today = new Date(trustedNow);
    today.setHours(0, 0, 0, 0);

    // Find last checked date or start date
    const lastChecked = lastCheckedDay 
      ? new Date(lastCheckedDay) 
      : new Date(startDate.getTime() - 24 * 60 * 60 * 1000); // Day before start

    // Iterate through each day from lastChecked + 1 to yesterday
    const current = new Date(lastChecked);
    current.setDate(current.getDate() + 1);
    current.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let updatedChallenge = { ...challenge };
    const newLogs = [...challenge.workoutLogs];

    while (current <= yesterday && current >= startDate && current <= new Date(challenge.endDate)) {
      const dayKey = getDayKeyStandalone(current.getTime());
      
      // Check if there's a log for this day
      const hasLog = challenge.workoutLogs.some((log) => {
        const logDate = new Date(log.date);
        logDate.setHours(0, 0, 0, 0);
        return logDate.getTime() === current.getTime();
      });

      if (!hasLog) {
        // Apply penalty for missed day
        penaltiesApplied++;
        updatedChallenge = {
          ...updatedChallenge,
          remainingStake: Math.max(0, updatedChallenge.remainingStake - PENALTY_AMOUNT),
          totalPenalties: updatedChallenge.totalPenalties + PENALTY_AMOUNT,
          currentStreak: 0,
        };

        // Add missed log
        newLogs.push({
          date: new Date(current),
          logged: false,
          missed: true,
          audited: false,
        });

        // Create transaction
        addTransaction({
          challengeId: challenge.id,
          type: 'penalty',
          reason: `Missed workout (${dayKey})`,
          amount: -PENALTY_AMOUNT,
          currency: 'INR',
          status: 'applied',
        });
      }

      current.setDate(current.getDate() + 1);
    }

    if (penaltiesApplied > 0) {
      updatedChallenge.workoutLogs = newLogs;
      setChallengeState(updatedChallenge);
    }

    // Update last checked day to today
    setLastCheckedDay(todayKey);

    return penaltiesApplied;
  }, [challenge, lastCheckedDay, addTransaction]);

  // Check for missed days on mount
  useEffect(() => {
    if (challenge && challenge.status === 'active') {
      const missedCount = checkMissedDays();
      if (missedCount > 0) {
        console.log(`Applied ${missedCount} missed day penalties`);
      }
    }
  }, []); // Only on mount

  const archiveCurrentChallenge = useCallback((status: 'completed' | 'failed' | 'abandoned') => {
    if (!challenge) return;

    const historyEntry: ChallengeHistory = {
      id: challenge.id,
      stakeAmount: challenge.stakeAmount,
      durationDays: challenge.durationDays,
      startDate: challenge.startDate,
      endDate: challenge.endDate,
      workoutsCompleted: challenge.workoutsCompleted,
      totalPenalties: challenge.totalPenalties,
      finalStake: challenge.remainingStake,
      status,
      workoutLogs: challenge.workoutLogs,
      transactions: transactions.filter((tx) => tx.challengeId === challenge.id),
    };

    setChallengeHistory((prev) => [historyEntry, ...prev]);
    
    // Create final transaction
    if (status === 'completed') {
      addTransaction({
        challengeId: challenge.id,
        type: 'payout',
        reason: 'Challenge completed - stake returned',
        amount: challenge.remainingStake,
        currency: 'INR',
        status: 'applied',
      });
    } else if (status === 'failed') {
      addTransaction({
        challengeId: challenge.id,
        type: 'forfeit',
        reason: 'Challenge failed - stake forfeited',
        amount: -challenge.remainingStake,
        currency: 'INR',
        status: 'forfeited',
      });
    }
  }, [challenge, transactions, addTransaction]);

  const resetOnboarding = () => setOnboarding(initialOnboarding);

  const logWorkout = () => {
    const auditTriggered = Math.random() < 0.5; // 50% audit probability
    const auditCode = Math.floor(Math.random() * 90) + 10;
    
    return { audited: auditTriggered, auditCode };
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
        transactions,
        addTransaction,
        challengeHistory,
        archiveCurrentChallenge,
        checkMissedDays,
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
