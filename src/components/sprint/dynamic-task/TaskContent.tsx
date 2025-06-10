
import React from "react";
import { Button } from "@/components/ui/button";
import { CurrentStep } from "./CurrentStep";
import { TaskProgress } from "./TaskProgress";
import { TaskCompleted } from "./TaskCompleted";
import { StepNavigator } from "./StepNavigator";
import StaticPanels from "@/components/sprint/task-builder/StaticPanels";
import type { SaveStatus } from "@/hooks/useAutoSaveManager";

interface TaskContentProps {
  currentStepIndex: number;
  visibleSteps: any[];
  currentStep: any;
  answers: Record<string, any>;
  sprintProfile: any;
  taskDefinition: any;
  handleAnswer: (value: any) => void;
  handleFileUpload: (file: File) => void;
  goToStep: (index: number) => void;
  handleComplete: () => void;
  getStepProfileDependencies: (step: any) => any[];
  renderCurrentStepWithDependencies: () => React.ReactNode;
  isAdmin: boolean;
  taskId: string;
  autoSaveManager?: {
    handleFieldChange: (fieldId: string, value: any, isTyping: boolean, saveCallback: (value: any) => Promise<void>) => void;
    startTyping: (fieldId: string) => void;
    stopTyping: (fieldId: string) => void;
    getSaveStatus: (fieldId: string) => SaveStatus;
    subscribeToStatus: (fieldId: string, callback: (status: SaveStatus) => void) => () => void;
    forceSave: (fieldId: string) => void;
  };
  onAutoSaveField?: (fieldId: string, value: any) => Promise<void>;
}

export const TaskContent: React.FC<TaskContentProps> = ({
  currentStepIndex,
  visibleSteps,
  currentStep,
  answers,
  sprintProfile,
  taskDefinition,
  handleAnswer,
  handleFileUpload,
  goToStep,
  handleComplete,
  getStepProfileDependencies,
  renderCurrentStepWithDependencies,
  isAdmin,
  taskId,
  autoSaveManager,
  onAutoSaveField,
}) => {
  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <TaskProgress 
        currentStepIndex={currentStepIndex}
        totalSteps={visibleSteps.length}
      />
      
      {/* Current step */}
      {currentStep && (
        <CurrentStep
          step={currentStep}
          answer={answers[currentStep.id]}
          onAnswer={handleAnswer}
          onFileUpload={handleFileUpload}
          sprintProfile={sprintProfile}
          getStepProfileDependencies={getStepProfileDependencies}
          autoSaveManager={autoSaveManager}
          onAutoSaveField={onAutoSaveField}
        />
      )}
      
      {/* Static panels if any */}
      {taskDefinition.staticPanels && taskDefinition.staticPanels.length > 0 && (
        <StaticPanels
          panels={taskDefinition.staticPanels}
          profileAnswers={sprintProfile}
          stepAnswers={answers}
          isAdmin={isAdmin}
          taskId={taskId}
        />
      )}
      
      {/* Navigation */}
      <StepNavigator
        currentStepIndex={currentStepIndex}
        totalSteps={visibleSteps.length}
        canProceed={!!answers[currentStep?.id] || currentStep?.type !== "question"}
        onPrevious={() => goToStep(currentStepIndex - 1)}
        onNext={() => goToStep(currentStepIndex + 1)}
        onComplete={handleComplete}
        autoSaveManager={autoSaveManager}
        currentStepId={currentStep?.id}
      />
    </div>
  );
};
