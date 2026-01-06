import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useChallenge } from "@/context/ChallengeContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { UserProfile } from "@/types/challenge";

const defaultProfile: UserProfile = {
  name: "",
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  reminderTime: "08:00",
};

export default function Profile() {
  const navigate = useNavigate();
  const { challenge } = useChallenge();
  
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('habits_profile');
    return saved ? JSON.parse(saved) : defaultProfile;
  });

  if (!challenge) {
    navigate("/");
    return null;
  }

  const handleSave = () => {
    localStorage.setItem('habits_profile', JSON.stringify(profile));
    toast.success("Profile saved");
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold uppercase mb-6">Profile</h1>

        <div className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="uppercase text-sm">Name / Handle</Label>
            <Input
              id="name"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              placeholder="Enter your name"
              className="border-2 bg-transparent"
            />
          </div>

          {/* Timezone */}
          <div className="space-y-2">
            <Label htmlFor="timezone" className="uppercase text-sm">Timezone</Label>
            <Input
              id="timezone"
              value={profile.timezone}
              onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
              className="border-2 bg-transparent"
              readOnly
            />
            <p className="text-xs text-muted-foreground">Auto-detected from your browser</p>
          </div>

          {/* Reminder Time */}
          <div className="space-y-2">
            <Label htmlFor="reminderTime" className="uppercase text-sm">Preferred Reminder Time</Label>
            <Input
              id="reminderTime"
              type="time"
              value={profile.reminderTime}
              onChange={(e) => setProfile({ ...profile, reminderTime: e.target.value })}
              className="border-2 bg-transparent"
            />
          </div>

          {/* Payment History (Read-only) */}
          <div className="border-2 border-border p-4">
            <h2 className="font-bold uppercase mb-3">Payment History</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Challenge Stake</span>
                <span>₹{challenge.stakeAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Penalties</span>
                <span className="text-destructive">
                  {challenge.totalPenalties > 0 ? `-₹${challenge.totalPenalties}` : '₹0'}
                </span>
              </div>
              <div className="flex justify-between border-t border-border pt-2 mt-2">
                <span className="font-bold">Remaining</span>
                <span className="font-bold">₹{challenge.remainingStake.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <Button
            onClick={handleSave}
            className="w-full h-12 font-bold uppercase border-2 shadow-md hover:shadow-xs hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
          >
            Save Profile
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
