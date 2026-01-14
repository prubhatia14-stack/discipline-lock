import { useNavigate } from "react-router-dom";
import { useChallenge } from "@/context/ChallengeContext";
import { useAuth } from "@/context/AuthContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { LogOut } from "lucide-react";

export default function Settings() {
  const navigate = useNavigate();
  const { challenge, setChallenge } = useChallenge();
  const { user, signOut } = useAuth();

  if (!challenge) {
    navigate("/");
    return null;
  }

  const handleResetChallenge = () => {
    setChallenge(null);
    localStorage.removeItem('habits_profile');
    toast.success("Challenge reset");
    navigate("/");
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out");
    navigate("/auth");
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold uppercase mb-6">Settings</h1>

        <div className="space-y-6">
          {/* App Info */}
          <div className="border-2 border-border p-4">
            <h2 className="font-bold uppercase mb-3">About</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Version</span>
                <span>1.1.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">App</span>
                <span>Habits</span>
              </div>
            </div>
          </div>

          {/* Account */}
          <div className="border-2 border-border p-4">
            <h2 className="font-bold uppercase mb-3">Account</h2>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email</span>
                <span className="truncate max-w-[180px]">{user?.email || "—"}</span>
              </div>
            </div>
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="w-full border-2 font-bold uppercase flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>

          {/* Danger Zone */}
          <div className="border-2 border-destructive p-4">
            <h2 className="font-bold uppercase mb-3 text-destructive">Danger Zone</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Resetting will delete your current challenge and all data. This cannot be undone.
            </p>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="w-full border-2 font-bold uppercase"
                >
                  Reset Challenge
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="dark bg-background border-2 border-border">
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-bold uppercase">
                    Reset Challenge?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This will delete all your challenge data including logs, stakes, and progress. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="border-2 border-border bg-transparent">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleResetChallenge}
                    className="bg-destructive text-destructive-foreground border-2 border-destructive"
                  >
                    Reset
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
