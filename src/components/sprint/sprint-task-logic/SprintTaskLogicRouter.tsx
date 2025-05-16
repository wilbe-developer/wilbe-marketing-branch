
import React from "react";
import TeamTaskLogic from "./TeamTaskLogic";
import GenericTaskLogic from "../task-system/GenericTaskLogic";
import { SprintProfileShowOrAsk } from "../SprintProfileShowOrAsk";
import { getTaskDefinition } from "@/data/task-definitions";

export const SprintTaskLogicRouter = ({
  task,
  isCompleted,
  onComplete
}: {
  task: any;
  isCompleted: boolean;
  onComplete: (fileId?: string) => void;
}) => {
  // Get task definition from registry
  const taskDefinition = getTaskDefinition(task.title);
  
  // If we have a definition for this task, use the generic task logic
  if (taskDefinition) {
    return (
      <GenericTaskLogic
        task={task}
        isCompleted={isCompleted}
        onComplete={onComplete}
        taskDefinition={taskDefinition}
      />
    );
  }
  
  // For backward compatibility, use existing task components
  switch (task.title) {
    case "Develop Team Building Plan":
    case "Team Profile":
      return (
        <TeamTaskLogic
          task={task}
          isCompleted={isCompleted}
          onComplete={onComplete}
          hideMainQuestion={true}
        />
      );
      
    case "IP & Technology Transfer":
      return (
        <TeamTaskLogic
          task={task}
          isCompleted={isCompleted}
          onComplete={onComplete}
          hideMainQuestion={true}
        />
      );
      
    default:
      return (
        <div className="p-6 text-center">
          <p className="text-gray-500">This task type is not yet implemented. Please define it in the task registry.</p>
        </div>
      );
  }
};

export default SprintTaskLogicRouter;
