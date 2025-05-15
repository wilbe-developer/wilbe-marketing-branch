
import React from "react";
import TeamTaskLogic from "./TeamTaskLogic";
import ProblemTaskLogic from "./ProblemTaskLogic";
import CustomerTaskLogic from "./CustomerTaskLogic";
import MarketTaskLogic from "./MarketTaskLogic";
import ExperimentTaskLogic from "./ExperimentTaskLogic";
import VisionTaskLogic from "./VisionTaskLogic";
import FundingTaskLogic from "./FundingTaskLogic";
import DeckTaskLogic from "./DeckTaskLogic";
import ScienceTaskLogic from "./ScienceTaskLogic";
import IpTaskLogic from "./IpTaskLogic";
import IpDetailedTaskLogic from "./IpDetailedTaskLogic";

interface SprintTaskLogicRouterProps {
  task: any;
  isCompleted: boolean;
  onComplete: (fileId?: string) => void;
}

export const SprintTaskLogicRouter: React.FC<SprintTaskLogicRouterProps> = ({
  task,
  isCompleted,
  onComplete
}) => {
  // Route to the appropriate task logic component based on task category
  const renderTaskLogic = () => {
    const category = task?.category?.toLowerCase();
    
    switch (category) {
      case 'team':
        return <TeamTaskLogic task={task} isCompleted={isCompleted} onComplete={onComplete} />;
      case 'problem':
        return <ProblemTaskLogic task={task} isCompleted={isCompleted} onComplete={onComplete} />;
      case 'customer':
        return <CustomerTaskLogic task={task} isCompleted={isCompleted} onComplete={onComplete} />;
      case 'market':
        return <MarketTaskLogic task={task} isCompleted={isCompleted} onComplete={onComplete} />;
      case 'experiment':
        return <ExperimentTaskLogic task={task} isCompleted={isCompleted} onComplete={onComplete} />;
      case 'vision':
        return <VisionTaskLogic task={task} isCompleted={isCompleted} onComplete={onComplete} />;
      case 'funding':
        return <FundingTaskLogic task={task} isCompleted={isCompleted} onComplete={onComplete} />;
      case 'deck':
        return <DeckTaskLogic task={task} isCompleted={isCompleted} onComplete={onComplete} />;
      case 'science':
        return <ScienceTaskLogic task={task} isCompleted={isCompleted} onComplete={onComplete} />;
      case 'ip':
        return <IpTaskLogic task={task} isCompleted={isCompleted} onComplete={onComplete} />;
      case 'intellectual_property':
        return <IpDetailedTaskLogic task={task} isCompleted={isCompleted} onComplete={onComplete} />;
      default:
        return (
          <div className="p-4 bg-yellow-50 text-yellow-800 rounded-md">
            <p>No specialized component found for this task type. You can still upload files if required.</p>
          </div>
        );
    }
  };
  
  return renderTaskLogic();
};
