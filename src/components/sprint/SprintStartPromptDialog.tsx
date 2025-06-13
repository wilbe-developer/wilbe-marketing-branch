
import React from "react";
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
import { Play } from "lucide-react";
import { useSprintCountdown } from "@/hooks/useSprintCountdown";
import { useSprintContext } from "@/hooks/useSprintContext";

interface SprintStartPromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SprintStartPromptDialog = ({ open, onOpenChange }: SprintStartPromptDialogProps) => {
  const { currentSprintOwnerId, isSharedSprint, sprintOwnerName, canManage } = useSprintContext();
  const { startSprint } = useSprintCountdown(currentSprintOwnerId);

  const handleStartSprint = async () => {
    await startSprint();
    onOpenChange(false);
  };

  const getTitle = () => {
    if (isSharedSprint && !canManage) {
      return `${sprintOwnerName}'s BSF Timer Not Started`;
    }
    return "Start Your 10-Day BSF Timer";
  };

  const getDescription = () => {
    if (isSharedSprint && !canManage) {
      return `${sprintOwnerName} needs to start their 10-day BSF timer before you can access the tasks. Only the sprint owner or managers can start the timer.`;
    }
    return "You need to start your 10-day BSF timer to begin accessing and completing tasks. Once started, you'll have 10 days to complete BSF and qualify for investment assessment.";
  };

  const canStartTimer = !isSharedSprint || canManage;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            {getTitle()}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {getDescription()}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {canStartTimer && (
            <AlertDialogAction onClick={handleStartSprint}>
              <Play className="mr-2 h-4 w-4" />
              Start 10-Day BSF Timer
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
