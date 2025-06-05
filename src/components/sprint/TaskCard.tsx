
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { TaskChallengeLink } from "@/components/sprint/TaskChallengeLink";
import { WorkloadBadge } from "@/components/sprint/WorkloadBadge";
import { PATHS } from "@/lib/constants";
import { UserTaskProgress } from "@/types/sprint";

interface TaskCardProps {
  task: UserTaskProgress;
  disabled: boolean;
}

const TaskCard = ({ task, disabled }: TaskCardProps) => {
  const navigate = useNavigate();
  const isCompleted = task.progress?.completed || false;

  const handleClick = () => {
    if (!disabled) {
      navigate(`${PATHS.SPRINT_TASK}/${task.id}`);
    }
  };

  return (
    <div
      className={`rounded-lg overflow-hidden border transition-all bg-white ${
        disabled
          ? "opacity-50 cursor-not-allowed"
          : "cursor-pointer hover:border-brand-pink"
      }`}
      onClick={handleClick}
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold">{task.title}</h3>
          {task.workload && (
            <WorkloadBadge workload={task.workload} size="sm" />
          )}
        </div>

        <p className="text-gray-600 mb-3 text-sm line-clamp-2">{task.description}</p>

        <div className="flex justify-between items-center mt-4">
          <Badge
            variant={isCompleted ? "default" : "secondary"}
            className={isCompleted ? "bg-green-500 hover:bg-green-600" : ""}
          >
            {isCompleted ? "Completed" : "Pending"}
          </Badge>
          
          <TaskChallengeLink taskId={task.id} />
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
