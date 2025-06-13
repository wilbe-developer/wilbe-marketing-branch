
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { TaskChallengeLink } from "@/components/sprint/TaskChallengeLink";
import { WorkloadBadge } from "@/components/sprint/WorkloadBadge";
import { SprintStartPromptDialog } from "@/components/sprint/SprintStartPromptDialog";
import { useSprintCountdown } from "@/hooks/useSprintCountdown";
import { useSprintContext } from "@/hooks/useSprintContext";
import { PATHS } from "@/lib/constants";
import { UserTaskProgress } from "@/types/sprint";

interface TaskCardProps {
  task: UserTaskProgress;
  disabled: boolean;
}

const TaskCard = ({ task, disabled }: TaskCardProps) => {
  const navigate = useNavigate();
  const [showStartDialog, setShowStartDialog] = useState(false);
  const { currentSprintOwnerId } = useSprintContext();
  const { hasStarted } = useSprintCountdown(currentSprintOwnerId);
  const isCompleted = task.progress?.completed || false;

  const handleClick = () => {
    if (disabled) return;
    
    // Check if sprint timer has started
    if (!hasStarted) {
      setShowStartDialog(true);
      return;
    }
    
    // Normal navigation if timer has started
    navigate(`${PATHS.SPRINT_TASK}/${task.id}`);
  };

  return (
    <>
      <div
        className={`rounded-lg overflow-hidden border transition-all bg-white ${
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer hover:border-brand-pink"
        }`}
        onClick={handleClick}
      >
        <div className="p-4 md:p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <h3 className="text-lg font-semibold leading-tight flex-1">{task.title}</h3>
            {task.workload && (
              <div className="flex-shrink-0">
                <WorkloadBadge workload={task.workload} size="sm" />
              </div>
            )}
          </div>

          <p className="text-gray-600 mb-4 text-sm line-clamp-2">{task.description}</p>

          <div className="flex justify-between items-center">
            <Badge
              variant={isCompleted ? "default" : "secondary"}
              className={`${isCompleted ? "bg-green-500 hover:bg-green-600" : ""} text-xs`}
            >
              {isCompleted ? "Completed" : "Pending"}
            </Badge>
            
            <TaskChallengeLink taskId={task.id} />
          </div>
        </div>
      </div>

      <SprintStartPromptDialog 
        open={showStartDialog} 
        onOpenChange={setShowStartDialog} 
      />
    </>
  );
};

export default TaskCard;
