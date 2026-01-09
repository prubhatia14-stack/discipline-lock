import { useNavigate } from "react-router-dom";
import { useChallenge } from "@/context/ChallengeContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { format } from "date-fns";
import { Wallet as WalletIcon, ArrowDownRight, ArrowUpRight, TrendingDown, Shield, Clock } from "lucide-react";

export default function Wallet() {
  const navigate = useNavigate();
  const { challenge, transactions } = useChallenge();

  if (!challenge) {
    navigate("/");
    return null;
  }

  const challengeTransactions = transactions.filter((tx) => tx.challengeId === challenge.id);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownRight className="w-4 h-4 text-green-500" />;
      case 'penalty':
        return <TrendingDown className="w-4 h-4 text-destructive" />;
      case 'payout':
        return <ArrowUpRight className="w-4 h-4 text-green-500" />;
      case 'forfeit':
        return <TrendingDown className="w-4 h-4 text-destructive" />;
      case 'refund':
        return <ArrowUpRight className="w-4 h-4 text-blue-500" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'applied':
        return <span className="text-[10px] px-2 py-0.5 bg-muted rounded uppercase">Applied</span>;
      case 'refunded':
        return <span className="text-[10px] px-2 py-0.5 bg-blue-500/20 text-blue-500 rounded uppercase">Refunded</span>;
      case 'forfeited':
        return <span className="text-[10px] px-2 py-0.5 bg-destructive/20 text-destructive rounded uppercase">Forfeited</span>;
      case 'pending':
        return <span className="text-[10px] px-2 py-0.5 bg-yellow-500/20 text-yellow-500 rounded uppercase">Pending</span>;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-500';
      case 'completed':
        return 'text-blue-500';
      case 'failed':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <WalletIcon className="w-6 h-6" />
          <h1 className="text-2xl font-bold uppercase">Wallet</h1>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="border-2 border-border p-4">
            <p className="text-xs text-muted-foreground uppercase mb-1">Locked Stake</p>
            <p className="text-2xl font-bold">₹{challenge.stakeAmount.toLocaleString()}</p>
          </div>
          <div className="border-2 border-border p-4">
            <p className="text-xs text-muted-foreground uppercase mb-1">Remaining</p>
            <p className="text-2xl font-bold text-green-500">₹{challenge.remainingStake.toLocaleString()}</p>
          </div>
          <div className="border-2 border-border p-4">
            <p className="text-xs text-muted-foreground uppercase mb-1">Total Penalties</p>
            <p className="text-2xl font-bold text-destructive">
              {challenge.totalPenalties > 0 ? `-₹${challenge.totalPenalties.toLocaleString()}` : '₹0'}
            </p>
          </div>
          <div className="border-2 border-border p-4">
            <p className="text-xs text-muted-foreground uppercase mb-1">Status</p>
            <p className={`text-2xl font-bold uppercase ${getStatusColor(challenge.status)}`}>
              {challenge.status}
            </p>
          </div>
        </div>

        {/* Transaction Ledger */}
        <div className="border-2 border-border">
          <div className="p-4 border-b-2 border-border flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <h2 className="font-bold uppercase">Transaction History</h2>
          </div>

          {challengeTransactions.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <p>No transactions yet</p>
              <p className="text-sm mt-1">Transactions will appear here as you progress</p>
            </div>
          ) : (
            <div className="divide-y-2 divide-border">
              {challengeTransactions.map((tx) => (
                <div key={tx.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 border-2 border-border flex items-center justify-center">
                      {getTransactionIcon(tx.type)}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{tx.reason}</p>
                      <p className="text-xs text-muted-foreground">{tx.dayKey}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${tx.amount < 0 ? 'text-destructive' : 'text-green-500'}`}>
                      {tx.amount < 0 ? `-₹${Math.abs(tx.amount)}` : `+₹${tx.amount}`}
                    </p>
                    {getStatusBadge(tx.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
