
import React from "react";
import { useDynamicTask } from "@/hooks/task-builder/useDynamicTask";
import { useSprintProfileQuickEdit } from "@/hooks/useSprintProfileQuickEdit";
import { useAuth } from "@/hooks/useAuth";
import { useAutoSaveManager } from "@/hooks/useAutoSaveManager";
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
  const { isAdmin } = useAuth();
  const { manager: autoSaveManager } = useAutoSaveManager();
  
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

  // Auto-save handler for individual fields
  const handleAutoSaveField = async (fieldId: string, value: any) => {
    if (!currentStep) return;
    
    try {
      // For simple question steps (non-form types), save the value directly to the step
      // For form steps, wrap the value in the field structure
      const isSimpleQuestion = currentStep.type === "question" || 
                              currentStep.type === "exercise" ||
                              currentStep.type === "conditionalQuestion" ||
                              (currentStep.type === "form" && currentStep.fields && currentStep.fields.length === 1);
      
      let updatedAnswer;
      if (isSimpleQuestion && fieldId === currentStep.id) {
        // For simple questions where fieldId matches stepId, save value directly
        updatedAnswer = value;
      } else {
        // For form steps or multi-field steps, maintain field structure
        const currentAnswer = answers[currentStep.id] || {};
        updatedAnswer = { ...currentAnswer, [fieldId]: value };
      }
      
      await answerNode(currentStep.id, updatedAnswer);
    } catch (error) {
      console.error("Error auto-saving field:", error);
      throw error; // Re-throw to trigger error handling in AutoSaveManager
    }
  };

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
      // Force save any pending changes before completing
      if (currentStep) {
        autoSaveManager.forceSave(currentStep.id);
      }
      
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
        autoSaveManager={autoSaveManager}
        onAutoSaveField={handleAutoSaveField}
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
        isAdmin={isAdmin}
        taskId={task.id}
        autoSaveManager={autoSaveManager}
        onAutoSaveField={handleAutoSaveField}
      />
    </ProfileQuestionsRenderer>
  );
};

export default DynamicTaskLogic;
