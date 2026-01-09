export interface Challenge {
  id: string;
  stakeAmount: number;
  durationDays: number;
  startDate: Date;
  endDate: Date;
  currentStreak: number;
  workoutsCompleted: number;
  totalPenalties: number;
  remainingStake: number;
  status: 'active' | 'completed' | 'failed';
  workoutLogs: WorkoutLog[];
}

export type WorkoutType = 'strength' | 'cardio' | 'mixed' | 'mobility' | 'other';
export type WorkoutIntensity = 'easy' | 'medium' | 'hard';

export interface WorkoutLog {
  date: Date;
  logged: boolean;
  missed?: boolean;
  audited: boolean;
  auditPassed?: boolean;
  workoutType?: WorkoutType;
  intensity?: WorkoutIntensity;
  notes?: string;
}

export interface OnboardingState {
  step: number;
  stakeAmount: number;
  durationDays: number;
  startDate: Date | null;
  rulesAccepted: boolean;
}

export interface UserProfile {
  name: string;
  timezone: string;
  reminderTime: string;
}

// Transaction types for wallet ledger
export type TransactionType = 'deposit' | 'penalty' | 'payout' | 'forfeit' | 'refund';
export type TransactionStatus = 'applied' | 'refunded' | 'forfeited' | 'pending';

export interface Transaction {
  id: string;
  challengeId: string;
  type: TransactionType;
  reason: string;
  amount: number;
  currency: string;
  createdAtTrusted: number; // trusted timestamp in ms
  dayKey: string; // YYYY-MM-DD based on trusted time
  status: TransactionStatus;
}

// Challenge history for completed/failed challenges
export interface ChallengeHistory {
  id: string;
  stakeAmount: number;
  durationDays: number;
  startDate: Date;
  endDate: Date;
  workoutsCompleted: number;
  totalPenalties: number;
  finalStake: number;
  status: 'completed' | 'failed' | 'abandoned';
  workoutLogs: WorkoutLog[];
  transactions: Transaction[];
}
