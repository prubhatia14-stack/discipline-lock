import { useNavigate } from "react-router-dom";
import { useChallenge } from "@/context/ChallengeContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { format } from "date-fns";
import { Check } from "lucide-react";

const PENALTY_PER_DAY = 100;

export default function Stakes() {
  const navigate = useNavigate();
  const { challenge } = useChallenge();

  if (!challenge) {
    navigate("/");
    return null;
  }

  const rules = [
    "Log 1 workout per day",
    "Minimum workout time: 45 minutes",
    "20% random audits",
    `Missed day penalty: ₹${PENALTY_PER_DAY}`,
    "Audit failure = challenge failed",
  ];

  return (
    <DashboardLayout>
      <div className="p-6 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold uppercase mb-6">Stakes & Rules</h1>

        {/* Current Stake Info */}
        <div className="border-2 border-border p-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground uppercase">Total Staked</p>
              <p className="text-2xl font-bold">₹{challenge.stakeAmount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground uppercase">Remaining</p>
              <p className="text-2xl font-bold">₹{challenge.remainingStake.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground uppercase">Penalties</p>
              <p className="text-2xl font-bold text-destructive">
                {challenge.totalPenalties > 0 ? `-₹${challenge.totalPenalties}` : '₹0'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground uppercase">Duration</p>
              <p className="text-2xl font-bold">{challenge.durationDays} days</p>
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="border-2 border-border p-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground uppercase">Start Date</p>
              <p className="font-bold">{format(new Date(challenge.startDate), "MMM d, yyyy")}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground uppercase">End Date</p>
              <p className="font-bold">{format(new Date(challenge.endDate), "MMM d, yyyy")}</p>
            </div>
          </div>
        </div>

        {/* Rules */}
        <div className="border-2 border-border p-4">
          <h2 className="font-bold uppercase mb-4">Rules</h2>
          <ul className="space-y-3">
            {rules.map((rule, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 border-2 border-border flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3" />
                </div>
                <span className="text-sm">{rule}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Status */}
        <div className="mt-6 border-2 border-border p-4">
          <p className="text-sm text-muted-foreground uppercase mb-1">Challenge Status</p>
          <p className={`font-bold uppercase ${
            challenge.status === 'active' ? 'text-green-500' :
            challenge.status === 'completed' ? 'text-primary' : 'text-destructive'
          }`}>
            {challenge.status}
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
