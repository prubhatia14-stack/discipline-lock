import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface MissedWorkoutDialogProps {
  open: boolean;
  penaltyAmount: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export function MissedWorkoutDialog({
  open,
  penaltyAmount,
  onConfirm,
  onCancel,
}: MissedWorkoutDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <AlertDialogContent className="dark bg-background border-2 border-border max-w-sm">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold uppercase">
            Apply Penalty
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            Apply penalty ₹{penaltyAmount} for today?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel className="border-2 border-border bg-transparent hover:bg-muted">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="border-2 bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Apply
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
