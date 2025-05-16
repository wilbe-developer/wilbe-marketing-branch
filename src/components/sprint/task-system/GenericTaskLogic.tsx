
import React from "react";
import { useSprintProfileQuickEdit } from "@/hooks/useSprintProfileQuickEdit";
import { SprintProfileShowOrAsk } from "@/components/sprint/SprintProfileShowOrAsk";
import { useTaskData } from "@/hooks/useTaskData";
import GenericStepContent from "@/components/sprint/sprint-task-logic/generic/GenericStepContent";
import { TaskDefinition } from "@/types/task-definition";
import { Step } from "@/components/sprint/StepBasedTaskLogic";

interface GenericTaskLogicProps {
  task: any;
  isCompleted: boolean;
  onComplete: (fileId?: string) => void;
  taskDefinition: TaskDefinition;
}

const GenericTaskLogic: React.FC<GenericTaskLogicProps> = ({ 
  task, 
  isCompleted, 
  onComplete,
  taskDefinition
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
  } = useTaskData({
    task, 
    sprintProfile,
    taskDefinition
  });

  // Wrap onComplete to use our handler with answers
  const completeTask = async (fileId?: string) => {
    const success = await handleComplete(fileId);
    if (success) {
      onComplete(fileId);
    }
    return success;
  };

  // If the task has a profile dependency, show the profile question first
  if (taskDefinition.profileKey) {
    return (
      <div>
        <SprintProfileShowOrAsk
          profileKey={taskDefinition.profileKey}
          label={taskDefinition.profileLabel || ""}
          type={taskDefinition.profileType || "boolean"}
          options={taskDefinition.profileOptions}
        >
          <GenericStepContent
            steps={steps}
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
  }

  // If no profile dependency, render steps directly
  return (
    <div>
      <GenericStepContent
        steps={steps}
        isCompleted={isCompleted}
        onComplete={completeTask}
        onStepChange={handleStepChange}
        onAnswerUpdate={updateAnswers}
        isLoading={isLoading}
        conditionalFlow={conditionalFlow}
      />
    </div>
  );
};

export default GenericTaskLogic;
