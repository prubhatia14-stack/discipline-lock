import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChallenge } from "@/context/ChallengeContext";
import { ProgressRing } from "@/components/ProgressRing";
import { AuditFlow } from "@/components/AuditFlow";
import { Button } from "@/components/ui/button";
import { differenceInDays, format, isToday } from "date-fns";
import { toast } from "sonner";
import { Flame, Calendar, TrendingDown } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const { challenge, setChallenge, logWorkout, applyPenalty } = useChallenge();
  const [showAudit, setShowAudit] = useState(false);
  const [auditCode, setAuditCode] = useState(0);

  if (!challenge) {
    navigate("/");
    return null;
  }

  const today = new Date();
  const daysRemaining = Math.max(0, differenceInDays(challenge.endDate, today));
  const daysElapsed = differenceInDays(today, challenge.startDate);
  const progress = Math.min(100, (challenge.workoutsCompleted / challenge.durationDays) * 100);
  
  const todayLogged = challenge.workoutLogs.some(
    (log) => isToday(new Date(log.date)) && log.logged
  );

  const handleLogWorkout = () => {
    if (todayLogged) {
      toast.info("Workout already logged today");
      return;
    }

    const { audited, auditCode: code } = logWorkout();
    
    if (audited) {
      setAuditCode(code);
      setShowAudit(true);
    } else {
      completeWorkout();
    }
  };

  const completeWorkout = () => {
    setChallenge({
      ...challenge,
      workoutsCompleted: challenge.workoutsCompleted + 1,
      currentStreak: challenge.currentStreak + 1,
      workoutLogs: [
        ...challenge.workoutLogs,
        { date: new Date(), logged: true, audited: false },
      ],
    });
    toast.success("Workout logged!");
  };

  const handleAuditComplete = (passed: boolean) => {
    setShowAudit(false);
    if (passed) {
      setChallenge({
        ...challenge,
        workoutsCompleted: challenge.workoutsCompleted + 1,
        currentStreak: challenge.currentStreak + 1,
        workoutLogs: [
          ...challenge.workoutLogs,
          { date: new Date(), logged: true, audited: true, auditPassed: true },
        ],
      });
      toast.success("Audit passed! Workout logged.");
    } else {
      setChallenge({
        ...challenge,
        remainingStake: 0,
        status: 'failed',
        workoutLogs: [
          ...challenge.workoutLogs,
          { date: new Date(), logged: false, audited: true, auditPassed: false },
        ],
      });
      toast.error("Audit failed. Challenge terminated.");
    }
  };

  const handleAuditCancel = () => {
    setShowAudit(false);
    setChallenge({
      ...challenge,
      remainingStake: 0,
      status: 'failed',
    });
    toast.error("Audit skipped. Challenge failed.");
  };

  const handleReset = () => {
    setChallenge(null);
    navigate("/");
  };

  if (challenge.status === 'failed') {
    return (
      <div className="dark min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-8 text-center">
        <div className="max-w-md space-y-8">
          <div className="w-24 h-24 border-4 border-destructive mx-auto flex items-center justify-center">
            <span className="text-4xl">✗</span>
          </div>
          <h1 className="text-4xl font-bold uppercase">Challenge Failed</h1>
          <p className="text-muted-foreground">Your stake has been forfeited.</p>
          <div className="p-4 border-2 border-destructive">
            <p className="text-2xl font-bold text-destructive">-₹{challenge.stakeAmount.toLocaleString()}</p>
          </div>
          <Button 
            onClick={handleReset}
            className="w-full h-14 text-lg font-bold uppercase border-2 shadow-md hover:shadow-xs hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
          >
            Start New Challenge
          </Button>
        </div>
      </div>
    );
  }

  if (daysRemaining === 0 && challenge.status === 'active') {
    return (
      <div className="dark min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-8 text-center">
        <div className="max-w-md space-y-8">
          <div className="w-24 h-24 border-4 mx-auto flex items-center justify-center">
            <span className="text-4xl">✓</span>
          </div>
          <h1 className="text-4xl font-bold uppercase">Challenge Complete</h1>
          <p className="text-muted-foreground">Congratulations! You stayed consistent.</p>
          <div className="p-4 border-2">
            <p className="text-sm text-muted-foreground">Your remaining stake</p>
            <p className="text-3xl font-bold">₹{challenge.remainingStake.toLocaleString()}</p>
          </div>
          <Button 
            onClick={handleReset}
            className="w-full h-14 text-lg font-bold uppercase border-2 shadow-md hover:shadow-xs hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
          >
            Start New Challenge
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      {showAudit && (
        <AuditFlow
          auditCode={auditCode}
          onComplete={handleAuditComplete}
          onCancel={handleAuditCancel}
        />
      )}

      <div className="min-h-screen flex flex-col p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <p className="text-sm text-muted-foreground uppercase">Remaining</p>
            <p className="text-4xl font-bold">₹{challenge.remainingStake.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground uppercase">Days Left</p>
            <p className="text-4xl font-bold">{daysRemaining}</p>
          </div>
        </div>

        {/* Progress Ring */}
        <div className="flex-1 flex items-center justify-center py-8">
          <ProgressRing progress={progress} size={280} strokeWidth={12}>
            <div className="text-center">
              <p className="text-6xl font-bold">{challenge.workoutsCompleted}</p>
              <p className="text-muted-foreground text-sm uppercase">
                / {challenge.durationDays} workouts
              </p>
            </div>
          </ProgressRing>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="border-2 p-4 text-center">
            <Flame className="w-6 h-6 mx-auto mb-2" />
            <p className="text-2xl font-bold">{challenge.currentStreak}</p>
            <p className="text-xs text-muted-foreground uppercase">Streak</p>
          </div>
          <div className="border-2 p-4 text-center">
            <Calendar className="w-6 h-6 mx-auto mb-2" />
            <p className="text-2xl font-bold">{daysElapsed}</p>
            <p className="text-xs text-muted-foreground uppercase">Day</p>
          </div>
          <div className="border-2 p-4 text-center">
            <TrendingDown className="w-6 h-6 mx-auto mb-2" />
            <p className="text-2xl font-bold text-destructive">
              {challenge.totalPenalties > 0 ? `-₹${challenge.totalPenalties}` : "₹0"}
            </p>
            <p className="text-xs text-muted-foreground uppercase">Penalties</p>
          </div>
        </div>

        {/* Log Button */}
        <Button 
          onClick={handleLogWorkout}
          disabled={todayLogged}
          className="w-full h-16 text-xl font-bold uppercase border-2 shadow-md hover:shadow-xs hover:translate-x-[3px] hover:translate-y-[3px] transition-all disabled:opacity-50"
        >
          {todayLogged ? "Logged Today ✓" : "Log Workout Today"}
        </Button>

        {/* Footer */}
        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground">
            Ends {format(challenge.endDate, "MMMM d, yyyy")}
          </p>
        </div>
      </div>
    </div>
  );
}
