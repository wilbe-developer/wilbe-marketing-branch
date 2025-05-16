
import React, { useEffect } from "react";
import { useSprintProfileQuickEdit } from "@/hooks/useSprintProfileQuickEdit";
import { SprintProfileShowOrAsk } from "@/components/sprint/SprintProfileShowOrAsk";
import { useIPTaskData } from "@/hooks/useIPTaskData";
import IPStepContent from "./IPStepContent";

interface IPTaskLogicProps {
  task: any;
  isCompleted: boolean;
  onComplete: (fileId?: string) => void;
}

const IPTaskLogic: React.FC<IPTaskLogicProps> = ({ 
  task, 
  isCompleted, 
  onComplete 
}) => {
  const { sprintProfile } = useSprintProfileQuickEdit();
  
  // Use our data hook to handle the task data
  const { 
    steps,
    isLoading,
    handleComplete,
    handleStepChange,
    conditionalFlow,
    currentStepIndex,
    answers
  } = useIPTaskData(task, sprintProfile);

  // Wrap onComplete to use our handler with answers
  const completeTask = async (fileId?: string) => {
    const success = await handleComplete(answers || {}, fileId);
    if (success) {
      onComplete(fileId);
    }
    return success;
  };

  return (
    <div>
      <SprintProfileShowOrAsk
        profileKey="university_ip"
        label="Is your company reliant on something you've invented / created at a university?"
        type="boolean"
      >
        <IPStepContent
          steps={steps}
          isCompleted={isCompleted}
          onComplete={completeTask}
          onStepChange={handleStepChange}
          isLoading={isLoading}
          conditionalFlow={conditionalFlow}
        />
      </SprintProfileShowOrAsk>
    </div>
  );
};

export default IPTaskLogic;
