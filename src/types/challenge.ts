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

export interface WorkoutLog {
  date: Date;
  logged: boolean;
  audited: boolean;
  auditPassed?: boolean;
}

export interface OnboardingState {
  step: number;
  stakeAmount: number;
  durationDays: number;
  startDate: Date | null;
  rulesAccepted: boolean;
}
