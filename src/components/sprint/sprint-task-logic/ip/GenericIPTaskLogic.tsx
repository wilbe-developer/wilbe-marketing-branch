
import React from "react";
import { useSprintProfileQuickEdit } from "@/hooks/useSprintProfileQuickEdit";
import { SprintProfileShowOrAsk } from "@/components/sprint/SprintProfileShowOrAsk";
import { useGenericIPTaskData } from "@/hooks/useGenericIPTaskData";
import GenericStepContent from "../generic/GenericStepContent";
import { TaskStep } from "@/hooks/useTaskBase";

interface GenericIPTaskLogicProps {
  task: any;
  isCompleted: boolean;
  onComplete: (fileId?: string) => void;
}

const GenericIPTaskLogic: React.FC<GenericIPTaskLogicProps> = ({ 
  task, 
  isCompleted, 
  onComplete 
}) => {
  const { sprintProfile } = useSprintProfileQuickEdit();
  
  // Use our generic data hook to handle the task data
  const { 
    steps,
    isLoading,
    handleComplete,
    handleStepChange,
    conditionalFlow,
    answers,
    updateAnswers
  } = useGenericIPTaskData(task, sprintProfile);

  // Wrap onComplete to use our handler with answers
  const completeTask = async (fileId?: string) => {
    const success = await handleComplete(fileId);
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
        <GenericStepContent
          steps={steps as any} // Type assertion to fix compatibility
          isCompleted={isCompleted}
          onComplete={completeTask}
          onStepChange={handleStepChange}
          onAnswerUpdate={updateAnswers}
          isLoading={isLoading}
          conditionalFlow={conditionalFlow}
        />
      </SprintProfileShowOrAsk>
    </div>
  );
};

export default GenericIPTaskLogic;
