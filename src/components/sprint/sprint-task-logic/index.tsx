
import React from "react";
import DeckTaskLogic from "./DeckTaskLogic";
import TeamTaskLogic from "./TeamTaskLogic";
import ScienceTaskLogic from "./ScienceTaskLogic";
import IpTaskLogic from "./IpTaskLogic";
import ProblemTaskLogic from "./ProblemTaskLogic";
import CustomerTaskLogic from "./CustomerTaskLogic";
import MarketTaskLogic from "./MarketTaskLogic";
import FundingTaskLogic from "./FundingTaskLogic";
import ExperimentTaskLogic from "./ExperimentTaskLogic";
import VisionTaskLogic from "./VisionTaskLogic";
import { SprintProfileShowOrAsk } from "../SprintProfileShowOrAsk";

interface SprintTaskLogicRouterProps {
  task: any;
  isCompleted: boolean;
  onComplete: (fileId?: string) => void;
  readOnly?: boolean;
}

export const SprintTaskLogicRouter: React.FC<SprintTaskLogicRouterProps> = ({
  task,
  isCompleted,
  onComplete,
  readOnly = false
}) => {
  const commonProps = {
    task,
    isCompleted,
    onComplete,
    readOnly
  };

  // Depending on task category, render the appropriate component
  switch (task?.category?.toLowerCase()) {
    case "team":
      return (
        <TeamTaskLogic
          task={task}
          isCompleted={isCompleted}
          onComplete={onComplete}
          hideMainQuestion={true}
          readOnly={readOnly}
        />
      );
      
    case "problem":
      return (
        <ProblemTaskLogic
          task={task}
          isCompleted={isCompleted}
          onComplete={onComplete}
          hideMainQuestion={true}
          readOnly={readOnly}
        />
      );
      
    case "science":
      return (
        <ScienceTaskLogic
          task={task}
          isCompleted={isCompleted}
          onComplete={onComplete}
          hideMainQuestion={true}
          readOnly={readOnly}
        />
      );
      
    case "customer":
      return (
        <CustomerTaskLogic
          task={task}
          isCompleted={isCompleted}
          onComplete={onComplete}
          hideMainQuestion={true}
          readOnly={readOnly}
        />
      );
      
    case "market":
      return (
        <MarketTaskLogic
          task={task}
          isCompleted={isCompleted}
          onComplete={onComplete}
          hideMainQuestion={true}
          readOnly={readOnly}
        />
      );
      
    case "ip":
      return (
        <IpTaskLogic
          task={task}
          isCompleted={isCompleted}
          onComplete={onComplete}
          hideMainQuestion={true}
          readOnly={readOnly}
        />
      );
      
    case "experiment":
      return (
        <ExperimentTaskLogic
          task={task}
          isCompleted={isCompleted}
          onComplete={onComplete}
          hideMainQuestion={true}
          readOnly={readOnly}
        />
      );
      
    case "vision":
      return (
        <VisionTaskLogic
          task={task}
          isCompleted={isCompleted}
          onComplete={onComplete}
          hideMainQuestion={true}
          readOnly={readOnly}
        />
      );
      
    case "deck":
      return (
        <DeckTaskLogic
          task={task}
          isCompleted={isCompleted}
          onComplete={onComplete}
          hideMainQuestion={true}
          readOnly={readOnly}
        />
      );
      
    case "funding":
      return (
        <FundingTaskLogic
          task={task}
          isCompleted={isCompleted}
          onComplete={onComplete}
          hideMainQuestion={true}
          readOnly={readOnly}
        />
      );
      
    default:
      return (
        <div className="p-4 bg-red-50 rounded border border-red-200">
          <h3 className="text-red-600 font-medium">
            Task Type Not Supported: {task?.category || "unknown"}
          </h3>
          <p className="text-red-500 mt-2">
            This task type is not yet implemented or there was an error with the task data.
          </p>
          {readOnly && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-yellow-700 text-sm font-medium">
                You are in view-only mode. You cannot edit this sprint.
              </p>
            </div>
          )}
        </div>
      );
  }
};

export default SprintTaskLogicRouter;
