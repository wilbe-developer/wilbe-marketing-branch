
import React from "react";
import DynamicTaskStep from "../task-builder/DynamicTaskStep";
import StaticPanels from "../task-builder/StaticPanels";
import { Button } from "@/components/ui/button";
import { StepNode } from "@/types/task-builder";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/lib/constants";
import { toast } from "sonner";
import type { SaveStatus } from "@/hooks/useAutoSaveManager";

interface TaskContentProps {
  currentStepIndex: number;
  visibleSteps: StepNode[];
  currentStep: StepNode | undefined;
  answers: Record<string, any>;
  sprintProfile: any;
  taskDefinition: any;
  handleAnswer: (value: any) => Promise<void>;
  handleFileUpload: (file: File) => Promise<void>;
  goToStep: (index: number) => void;
  handleComplete: () => Promise<void>;
  getStepProfileDependencies: (step: any) => any[];
  renderCurrentStepWithDependencies: () => React.ReactNode;
  isAdmin?: boolean;
  taskId?: string;
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
  isAdmin = false,
  taskId,
  autoSaveManager,
  onAutoSaveField
}) => {
  const navigate = useNavigate();

  const handleNavigation = async (direction: 'next' | 'previous') => {
    // Force save any pending changes before navigation
    if (currentStep && autoSaveManager) {
      autoSaveManager.forceSave(currentStep.id);
    }
    
    if (direction === 'next') {
      goToStep(currentStepIndex + 1);
    } else {
      goToStep(currentStepIndex - 1);
    }
  };

  const handleTaskCompletion = async () => {
    try {
      // Force save any pending changes before completing
      if (currentStep && autoSaveManager) {
        autoSaveManager.forceSave(currentStep.id);
      }
      
      await handleComplete();
      
      // Show success message and navigate back to dashboard
      toast.success("Task completed successfully!");
      setTimeout(() => {
        navigate(PATHS.SPRINT_DASHBOARD);
      }, 1500);
    } catch (error) {
      console.error("Error completing task:", error);
      toast.error("Failed to complete the task. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="flex justify-between text-sm text-gray-500">
        <div>
          Step {currentStepIndex + 1} of {visibleSteps.length}
        </div>
        <div>
          {Math.round(((currentStepIndex + 1) / visibleSteps.length) * 100)}% complete
        </div>
      </div>
      
      {/* Current step */}
      {currentStep && renderCurrentStepWithDependencies()}
      
      {/* Navigation buttons - moved here to be right after the step */}
      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={() => handleNavigation('previous')}
          disabled={currentStepIndex === 0}
        >
          Previous
        </Button>
        
        {currentStepIndex === visibleSteps.length - 1 ? (
          <Button onClick={handleTaskCompletion}>
            Complete Task
          </Button>
        ) : (
          <Button 
            onClick={() => handleNavigation('next')}
            disabled={
              (!answers[currentStep?.id] && currentStep?.type === "question")
            }
          >
            Next
          </Button>
        )}
      </div>
      
      {/* Static panels with admin support */}
      {taskDefinition.staticPanels && taskDefinition.staticPanels.length > 0 && (
        <StaticPanels
          panels={taskDefinition.staticPanels}
          profileAnswers={sprintProfile}
          stepAnswers={answers}
          isAdmin={isAdmin}
          taskId={taskId}
        />
      )}
    </div>
  );
};
