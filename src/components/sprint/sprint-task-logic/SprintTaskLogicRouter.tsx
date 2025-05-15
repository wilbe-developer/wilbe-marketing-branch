
import React from "react";
import TeamTaskLogic from "./TeamTaskLogic";
import IPTaskLogic from "./ip/IPTaskLogic";
import { SprintProfileShowOrAsk } from "../SprintProfileShowOrAsk";

export const SprintTaskLogicRouter = ({
  task,
  isCompleted,
  onComplete
}: {
  task: any;
  isCompleted: boolean;
  onComplete: (fileId?: string) => void;
}) => {
  // Main router for each logic task
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
        <IPTaskLogic
          task={task}
          isCompleted={isCompleted}
          onComplete={onComplete}
        />
      );
      
    default:
      return (
        <div className="p-6 text-center">
          <p className="text-gray-500">This task type is not yet implemented.</p>
        </div>
      );
  }
};
