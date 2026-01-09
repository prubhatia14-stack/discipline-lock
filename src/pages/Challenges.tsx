import { useNavigate } from "react-router-dom";
import { useChallenge } from "@/context/ChallengeContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { format } from "date-fns";
import { History, Trophy, XCircle, Clock, ChevronRight } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChallengeHistory } from "@/types/challenge";

export default function Challenges() {
  const navigate = useNavigate();
  const { challenge, challengeHistory } = useChallenge();
  const [selectedChallenge, setSelectedChallenge] = useState<ChallengeHistory | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Trophy className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-destructive" />;
      case 'abandoned':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-500';
      case 'failed':
        return 'text-destructive';
      case 'abandoned':
        return 'text-yellow-500';
      default:
        return 'text-muted-foreground';
    }
  };

  const getNetOutcome = (ch: ChallengeHistory) => {
    if (ch.status === 'completed') {
      return ch.finalStake - ch.stakeAmount + ch.stakeAmount; // Get back remaining
    }
    return -ch.totalPenalties - (ch.status === 'failed' ? ch.stakeAmount - ch.totalPenalties : 0);
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <History className="w-6 h-6" />
          <h1 className="text-2xl font-bold uppercase">Challenge History</h1>
        </div>

        {/* Current Challenge */}
        {challenge && (
          <div className="mb-8">
            <h2 className="text-sm text-muted-foreground uppercase mb-3">Current Challenge</h2>
            <div className="border-2 border-primary p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold">{challenge.durationDays}-Day Challenge</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(challenge.startDate), "MMM d")} - {format(new Date(challenge.endDate), "MMM d, yyyy")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-500">₹{challenge.remainingStake.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground uppercase">Remaining</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-green-500 font-medium uppercase">Active</span>
                <span className="text-muted-foreground">{challenge.workoutsCompleted}/{challenge.durationDays} workouts</span>
              </div>
            </div>
          </div>
        )}

        {/* Past Challenges */}
        <div>
          <h2 className="text-sm text-muted-foreground uppercase mb-3">Past Challenges</h2>
          
          {challengeHistory.length === 0 ? (
            <div className="border-2 border-border p-8 text-center text-muted-foreground">
              <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No past challenges</p>
              <p className="text-sm mt-1">Complete your first challenge to see history here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {challengeHistory.map((ch) => {
                const netOutcome = ch.status === 'completed' ? ch.finalStake : -ch.totalPenalties;
                return (
                  <button
                    key={ch.id}
                    onClick={() => setSelectedChallenge(ch)}
                    className="w-full border-2 border-border p-4 text-left hover:border-muted-foreground transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(ch.status)}
                        <div>
                          <p className="font-bold">{ch.durationDays}-Day Challenge</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(ch.startDate), "MMM d")} - {format(new Date(ch.endDate), "MMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className={`font-bold ${netOutcome >= 0 ? 'text-green-500' : 'text-destructive'}`}>
                            {netOutcome >= 0 ? `+₹${netOutcome}` : `-₹${Math.abs(netOutcome)}`}
                          </p>
                          <p className={`text-xs uppercase ${getStatusColor(ch.status)}`}>{ch.status}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Challenge Detail Dialog */}
      <Dialog open={!!selectedChallenge} onOpenChange={() => setSelectedChallenge(null)}>
        <DialogContent className="dark bg-background border-2 border-border max-w-md max-h-[80vh] overflow-y-auto">
          {selectedChallenge && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {getStatusIcon(selectedChallenge.status)}
                  <span>{selectedChallenge.durationDays}-Day Challenge</span>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                {/* Summary */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="border-2 border-border p-3">
                    <p className="text-xs text-muted-foreground uppercase">Staked</p>
                    <p className="font-bold">₹{selectedChallenge.stakeAmount.toLocaleString()}</p>
                  </div>
                  <div className="border-2 border-border p-3">
                    <p className="text-xs text-muted-foreground uppercase">Final</p>
                    <p className={`font-bold ${selectedChallenge.finalStake > 0 ? 'text-green-500' : 'text-destructive'}`}>
                      ₹{selectedChallenge.finalStake.toLocaleString()}
                    </p>
                  </div>
                  <div className="border-2 border-border p-3">
                    <p className="text-xs text-muted-foreground uppercase">Workouts</p>
                    <p className="font-bold">{selectedChallenge.workoutsCompleted}/{selectedChallenge.durationDays}</p>
                  </div>
                  <div className="border-2 border-border p-3">
                    <p className="text-xs text-muted-foreground uppercase">Penalties</p>
                    <p className="font-bold text-destructive">
                      {selectedChallenge.totalPenalties > 0 ? `-₹${selectedChallenge.totalPenalties}` : '₹0'}
                    </p>
                  </div>
                </div>

                {/* Dates */}
                <div className="text-sm text-muted-foreground">
                  <p>{format(new Date(selectedChallenge.startDate), "MMMM d, yyyy")} - {format(new Date(selectedChallenge.endDate), "MMMM d, yyyy")}</p>
                </div>

                {/* Transaction History */}
                {selectedChallenge.transactions.length > 0 && (
                  <div className="border-2 border-border">
                    <div className="p-3 border-b-2 border-border">
                      <h3 className="text-sm font-bold uppercase">Transactions</h3>
                    </div>
                    <div className="max-h-48 overflow-y-auto divide-y-2 divide-border">
                      {selectedChallenge.transactions.map((tx) => (
                        <div key={tx.id} className="p-3 flex items-center justify-between text-sm">
                          <div>
                            <p className="font-medium">{tx.reason}</p>
                            <p className="text-xs text-muted-foreground">{tx.dayKey}</p>
                          </div>
                          <p className={tx.amount < 0 ? 'text-destructive' : 'text-green-500'}>
                            {tx.amount < 0 ? `-₹${Math.abs(tx.amount)}` : `+₹${tx.amount}`}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Workout Log Summary */}
                <div className="border-2 border-border">
                  <div className="p-3 border-b-2 border-border">
                    <h3 className="text-sm font-bold uppercase">Workout Summary</h3>
                  </div>
                  <div className="p-3 grid grid-cols-3 gap-2 text-center text-sm">
                    <div>
                      <p className="text-xl font-bold text-green-500">
                        {selectedChallenge.workoutLogs.filter((l) => l.logged).length}
                      </p>
                      <p className="text-xs text-muted-foreground">Logged</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-destructive">
                        {selectedChallenge.workoutLogs.filter((l) => l.missed).length}
                      </p>
                      <p className="text-xs text-muted-foreground">Missed</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-yellow-500">
                        {selectedChallenge.workoutLogs.filter((l) => l.audited).length}
                      </p>
                      <p className="text-xs text-muted-foreground">Audited</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
