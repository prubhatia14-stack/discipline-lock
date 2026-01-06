import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChallenge } from "@/context/ChallengeContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { ProgressRing } from "@/components/ProgressRing";
import { toast } from "sonner";
import { Share2, Copy } from "lucide-react";

type CardTemplate = 'streak' | 'discipline' | 'status';

export default function Share() {
  const navigate = useNavigate();
  const { challenge } = useChallenge();
  const [selectedTemplate, setSelectedTemplate] = useState<CardTemplate>('streak');

  if (!challenge) {
    navigate("/");
    return null;
  }

  const progress = Math.min(100, (challenge.workoutsCompleted / challenge.durationDays) * 100);

  const templates: { id: CardTemplate; name: string }[] = [
    { id: 'streak', name: 'Streak Card' },
    { id: 'discipline', name: 'Discipline Card' },
    { id: 'status', name: 'Challenge Status' },
  ];

  const getShareText = () => {
    switch (selectedTemplate) {
      case 'streak':
        return `STREAK: ${challenge.currentStreak} DAYS\n₹${challenge.stakeAmount.toLocaleString()} LOCKED\n₹${challenge.totalPenalties} LOST\n\n#Habits #NoExcuses`;
      case 'discipline':
        return `I don't negotiate with laziness.\n\n${challenge.currentStreak} day streak • ${challenge.workoutsCompleted}/${challenge.durationDays} workouts\n\n#Discipline #Habits`;
      case 'status':
        return `Day ${challenge.workoutsCompleted}/${challenge.durationDays} complete\n${Math.round(progress)}% progress\n₹${challenge.remainingStake.toLocaleString()} remaining\n\n#ChallengeAccepted #Habits`;
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getShareText());
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Habits Challenge',
          text: getShareText(),
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      handleCopy();
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold uppercase mb-6">Share</h1>

        {/* Template Selector */}
        <div className="flex gap-2 mb-6">
          {templates.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTemplate(t.id)}
              className={`flex-1 py-2 px-3 text-sm font-medium border-2 transition-all ${
                selectedTemplate === t.id
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border hover:border-muted-foreground'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>

        {/* Card Preview */}
        <div className="border-2 border-border p-6 mb-6 bg-background">
          {selectedTemplate === 'streak' && (
            <div className="text-center space-y-4">
              <p className="text-xs text-muted-foreground uppercase">Streak</p>
              <p className="text-6xl font-bold">{challenge.currentStreak}</p>
              <p className="text-xl uppercase">Days</p>
              <div className="pt-4 border-t border-border space-y-1">
                <p className="text-sm">₹{challenge.stakeAmount.toLocaleString()} LOCKED</p>
                <p className="text-sm text-destructive">₹{challenge.totalPenalties} LOST</p>
              </div>
            </div>
          )}

          {selectedTemplate === 'discipline' && (
            <div className="text-center space-y-6">
              <p className="text-2xl font-bold italic">"I don't negotiate with laziness."</p>
              <div className="flex justify-center gap-8">
                <div>
                  <p className="text-3xl font-bold">{challenge.currentStreak}</p>
                  <p className="text-xs text-muted-foreground uppercase">Streak</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">{challenge.workoutsCompleted}</p>
                  <p className="text-xs text-muted-foreground uppercase">Workouts</p>
                </div>
              </div>
            </div>
          )}

          {selectedTemplate === 'status' && (
            <div className="flex flex-col items-center space-y-4">
              <ProgressRing progress={progress} size={140} strokeWidth={8}>
                <div className="text-center">
                  <p className="text-2xl font-bold">{challenge.workoutsCompleted}</p>
                  <p className="text-xs text-muted-foreground">/ {challenge.durationDays}</p>
                </div>
              </ProgressRing>
              <p className="text-lg font-bold">Day {challenge.workoutsCompleted}/{challenge.durationDays}</p>
              <p className="text-sm text-muted-foreground">₹{challenge.remainingStake.toLocaleString()} remaining</p>
            </div>
          )}
        </div>

        {/* Preview Text */}
        <div className="border-2 border-border p-4 mb-6 bg-muted/20">
          <p className="text-xs text-muted-foreground uppercase mb-2">Share Text</p>
          <pre className="text-sm whitespace-pre-wrap font-mono">{getShareText()}</pre>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleCopy}
            variant="outline"
            className="flex-1 h-12 font-bold uppercase border-2"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </Button>
          <Button
            onClick={handleShare}
            className="flex-1 h-12 font-bold uppercase border-2 shadow-md hover:shadow-xs hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
