import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { WorkoutType, WorkoutIntensity } from "@/types/challenge";
import { Dumbbell, Heart, Shuffle, StretchHorizontal, HelpCircle } from "lucide-react";

interface QuickLogSheetProps {
  open: boolean;
  onComplete: (data: { type: WorkoutType; intensity: WorkoutIntensity; notes?: string }) => void;
  onCancel: () => void;
}

const workoutTypes: { value: WorkoutType; label: string; icon: React.ReactNode }[] = [
  { value: 'strength', label: 'Strength', icon: <Dumbbell className="w-5 h-5" /> },
  { value: 'cardio', label: 'Cardio', icon: <Heart className="w-5 h-5" /> },
  { value: 'mixed', label: 'Mixed', icon: <Shuffle className="w-5 h-5" /> },
  { value: 'mobility', label: 'Mobility', icon: <StretchHorizontal className="w-5 h-5" /> },
  { value: 'other', label: 'Other', icon: <HelpCircle className="w-5 h-5" /> },
];

const intensities: { value: WorkoutIntensity; label: string }[] = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

export function QuickLogSheet({ open, onComplete, onCancel }: QuickLogSheetProps) {
  const [type, setType] = useState<WorkoutType | null>(null);
  const [intensity, setIntensity] = useState<WorkoutIntensity | null>(null);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState("");

  const canComplete = type !== null && intensity !== null;

  const handleComplete = () => {
    if (!type || !intensity) return;
    onComplete({
      type,
      intensity,
      notes: notes.trim() || undefined,
    });
    // Reset state
    setType(null);
    setIntensity(null);
    setShowNotes(false);
    setNotes("");
  };

  return (
    <Drawer open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DrawerContent className="dark bg-background border-t-2 border-border">
        <div className="mx-auto w-full max-w-md p-6">
          <DrawerHeader className="p-0 mb-6">
            <DrawerTitle className="text-xl font-bold uppercase text-center">
              Quick Log
            </DrawerTitle>
          </DrawerHeader>

          {/* Workout Type */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground uppercase mb-3">Workout Type</p>
            <div className="grid grid-cols-5 gap-2">
              {workoutTypes.map((wt) => (
                <button
                  key={wt.value}
                  onClick={() => setType(wt.value)}
                  className={`flex flex-col items-center justify-center p-3 border-2 transition-all ${
                    type === wt.value
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:border-muted-foreground"
                  }`}
                >
                  {wt.icon}
                  <span className="text-xs mt-1">{wt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Intensity */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground uppercase mb-3">Intensity</p>
            <div className="grid grid-cols-3 gap-2">
              {intensities.map((int) => (
                <button
                  key={int.value}
                  onClick={() => setIntensity(int.value)}
                  className={`py-3 px-4 border-2 font-medium transition-all ${
                    intensity === int.value
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:border-muted-foreground"
                  }`}
                >
                  {int.label}
                </button>
              ))}
            </div>
          </div>

          {/* Optional Notes */}
          {!showNotes ? (
            <button
              onClick={() => setShowNotes(true)}
              className="text-sm text-muted-foreground underline mb-6 block"
            >
              Add note (optional)
            </button>
          ) : (
            <div className="mb-6">
              <Textarea
                placeholder="Notes (max 140 chars)"
                maxLength={140}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="border-2 bg-transparent resize-none"
                rows={2}
              />
              <p className="text-xs text-muted-foreground mt-1 text-right">
                {notes.length}/140
              </p>
            </div>
          )}

          {/* Complete Button */}
          <Button
            onClick={handleComplete}
            disabled={!canComplete}
            className="w-full h-14 text-lg font-bold uppercase border-2 shadow-md hover:shadow-xs hover:translate-x-[3px] hover:translate-y-[3px] transition-all disabled:opacity-50"
          >
            Log Workout
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
