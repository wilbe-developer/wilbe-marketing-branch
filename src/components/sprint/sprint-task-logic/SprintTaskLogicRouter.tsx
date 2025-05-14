
import React from "react";
import CustomerTaskLogic from "./CustomerTaskLogic";
import DeckTaskLogic from "./DeckTaskLogic";
import ExperimentTaskLogic from "./ExperimentTaskLogic";
import FundingTaskLogic from "./FundingTaskLogic";
import IpTaskLogic from "./IpTaskLogic";
import MarketTaskLogic from "./MarketTaskLogic";
import ProblemTaskLogic from "./ProblemTaskLogic";
import ScienceTaskLogic from "./ScienceTaskLogic";
import TeamTaskLogic from "./TeamTaskLogic";
import VisionTaskLogic from "./VisionTaskLogic";

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
      return <TeamTaskLogic {...commonProps} />;
    case "problem":
      return <ProblemTaskLogic {...commonProps} />;
    case "science":
      return <ScienceTaskLogic {...commonProps} />;
    case "customer":
      return <CustomerTaskLogic {...commonProps} />;
    case "market":
      return <MarketTaskLogic {...commonProps} />;
    case "ip":
      return <IpTaskLogic {...commonProps} />;
    case "experiment":
      return <ExperimentTaskLogic {...commonProps} />;
    case "vision":
      return <VisionTaskLogic {...commonProps} />;
    case "deck":
      return <DeckTaskLogic {...commonProps} />;
    case "funding":
      return <FundingTaskLogic {...commonProps} />;
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
