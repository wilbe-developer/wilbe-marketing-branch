
import React from "react";
import { useDynamicTask } from "@/hooks/task-builder/useDynamicTask";
import { useSprintProfileQuickEdit } from "@/hooks/useSprintProfileQuickEdit";
import { ProfileQuestionsRenderer } from "./dynamic-task/ProfileQuestionsRenderer";
import { TaskContent } from "./dynamic-task/TaskContent";
import { StepDependencyHelper, getStepProfileDependencies } from "./dynamic-task/StepDependencyHelper";
import { toast } from "sonner";

interface DynamicTaskLogicProps {
  task: any;
  isCompleted: boolean;
  onComplete: (fileId?: string) => void;
  initialAnswers?: Record<string, any>;
}

const DynamicTaskLogic: React.FC<DynamicTaskLogicProps> = ({
  task,
  isCompleted,
  onComplete,
  initialAnswers = {}
}) => {
  const { sprintProfile } = useSprintProfileQuickEdit();
  
  const {
    taskDefinition,
    isLoading,
    visibleSteps,
    currentStep,
    currentStepIndex,
    answers,
    answerNode,
    uploadFile,
    updateProfile,
    completeTask,
    goToStep,
  } = useDynamicTask({
    taskId: task.id,
    sprintProfile,
  });

  const handleAnswer = async (value: any) => {
    if (!currentStep) return;
    
    try {
      await answerNode(currentStep.id, value);
    } catch (error) {
      console.error("Error saving answer:", error);
      toast.error("Failed to save your answer. Please try again.");
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!currentStep) return;
    
    try {
      await uploadFile(currentStep.id, file);
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file. Please try again.");
    }
  };

  const handleComplete = async () => {
    try {
      await completeTask();
      onComplete();
      toast.success("Task completed successfully!");
    } catch (error) {
      console.error("Error completing task:", error);
      toast.error("Failed to complete the task. Please try again.");
    }
  };

  // Render current step with profile dependencies
  const renderCurrentStepWithDependencies = () => {
    if (!currentStep || !taskDefinition) return null;
    
    return (
      <StepDependencyHelper
        step={currentStep}
        sprintProfile={sprintProfile}
        answer={answers[currentStep.id]}
        handleAnswer={handleAnswer}
        handleFileUpload={handleFileUpload}
        taskDefinition={taskDefinition}
      />
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!taskDefinition) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500 mb-4">Task definition not found</p>
      </div>
    );
  }

  return (
    <ProfileQuestionsRenderer
      taskDefinition={taskDefinition}
      sprintProfile={sprintProfile}
    >
      <TaskContent
        currentStepIndex={currentStepIndex}
        visibleSteps={visibleSteps}
        currentStep={currentStep}
        answers={answers}
        sprintProfile={sprintProfile}
        taskDefinition={taskDefinition}
        handleAnswer={handleAnswer}
        handleFileUpload={handleFileUpload}
        goToStep={goToStep}
        handleComplete={handleComplete}
        getStepProfileDependencies={getStepProfileDependencies}
        renderCurrentStepWithDependencies={renderCurrentStepWithDependencies}
      />
    </ProfileQuestionsRenderer>
  );
};

export default DynamicTaskLogic;
