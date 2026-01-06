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
