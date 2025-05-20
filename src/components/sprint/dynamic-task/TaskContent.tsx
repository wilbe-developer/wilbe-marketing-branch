
import React from "react";
import DynamicTaskStep from "../task-builder/DynamicTaskStep";
import StaticPanels from "../task-builder/StaticPanels";
import { Button } from "@/components/ui/button";
import { StepNode } from "@/types/task-builder";

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
  renderCurrentStepWithDependencies
}) => {
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
      
      {/* Static panels if any */}
      {taskDefinition.staticPanels && taskDefinition.staticPanels.length > 0 && (
        <StaticPanels
          panels={taskDefinition.staticPanels}
          profileAnswers={sprintProfile}
          stepAnswers={answers}
        />
      )}
      
      {/* Navigation buttons */}
      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={() => goToStep(currentStepIndex - 1)}
          disabled={currentStepIndex === 0}
        >
          Previous
        </Button>
        
        {currentStepIndex === visibleSteps.length - 1 ? (
          <Button onClick={handleComplete}>
            Complete Task
          </Button>
        ) : (
          <Button 
            onClick={() => goToStep(currentStepIndex + 1)}
            disabled={
              (!answers[currentStep?.id] && currentStep?.type === "question")
            }
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
};
