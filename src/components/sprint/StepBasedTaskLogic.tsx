
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useStepNavigation } from "@/hooks/useStepNavigation";
import QuestionStep from "./step-types/QuestionStep";
import ContentStep from "./step-types/ContentStep";
import UploadStep from "./step-types/UploadStep";
import CollaborationStep from "./step-types/CollaborationStep";
import { useIsMobile } from "@/hooks/use-mobile";
import { StepContext, StepContextType } from "@/hooks/team-step-builder/types";

export type StepType = "question" | "content" | "upload" | "collaboration";

export interface Step {
  type: StepType;
  context?: StepContextType;
  question?: string;
  content?: string | React.ReactNode | (string | React.ReactNode)[];
  options?: Array<{
    label: string;
    value: string;
  }>;
  uploads?: string[];
  action?: string;
  description?: string;
}

interface StepBasedTaskLogicProps {
  steps: Step[];
  isCompleted: boolean;
  onComplete: (fileId?: string) => void;
  conditionalFlow?: Record<number, Record<string, number>>;
  onStepChange?: (step: number, context?: StepContext) => void;
  onAnswerUpdate?: (stepIndex: number, answer: any) => void;
}

const StepBasedTaskLogic: React.FC<StepBasedTaskLogicProps> = ({
  steps,
  isCompleted,
  onComplete,
  conditionalFlow = {},
  onStepChange,
  onAnswerUpdate
}) => {
  
  const isMobile = useIsMobile();
  
  const {
    currentStep,
    answers,
    isLastStep,
    isSubmitting,
    handleAnswerSelect,
    goToNextStep,
    goToPreviousStep,
    progress,
    handleComplete
  } = useStepNavigation({ 
    totalSteps: steps.length, 
    onComplete, 
    conditionalFlow 
  });
  
  // Wrapper for handleAnswerSelect that also calls onAnswerUpdate
  const handleAnswer = (value: string) => {
    handleAnswerSelect(value);
    
    // Call the parent component's onAnswerUpdate if provided
    if (onAnswerUpdate) {
      onAnswerUpdate(currentStep, value);
    }
  };
  
  // Call onStepChange when the current step changes
  useEffect(() => {
    // Only call onStepChange when the step actually changes and when the steps array is populated
    if (onStepChange && steps[currentStep]) {
      // Convert StepContextType to StepContext object if it exists
      const contextObject = steps[currentStep].context 
        ? { type: steps[currentStep].context as StepContextType } 
        : undefined;
      
      onStepChange(currentStep, contextObject);
    }
  }, [currentStep, onStepChange, steps]);

  // If there are no steps, don't render anything
  if (!steps || steps.length === 0) {
    return null;
  }
  
  const step = steps[currentStep];
  if (!step) {
    return null; // Safety check for invalid step
  }
  
  // Log current step for debugging
  console.log("Current step:", step);
  console.log("Current step type:", step.type);
  
  const hasAnswer = answers[currentStep] !== undefined || step.type === 'content' || step.type === 'upload' || step.type === 'collaboration';
  
  return (
    <div className={isMobile ? "mx-0" : ""}>
      {/* Progress indicator */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-muted-foreground">
          Step {currentStep + 1} of {steps.length}
        </div>
        <div className="w-1/2 bg-gray-200 rounded-full h-2">
          <div 
            className="bg-brand-pink h-2 rounded-full transition-all duration-500" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      
      {/* Step content */}
      <div className={`min-h-[200px] ${isMobile ? 'mb-4' : 'mb-6'}`}>
        {step.type === 'question' && (
          <QuestionStep
            question={step.question || ''}
            content={typeof step.content === 'string' ? step.content : undefined}
            options={step.options}
            selectedAnswer={answers[currentStep]}
            onAnswerSelect={handleAnswer}
          />
        )}
        
        {step.type === 'content' && step.content && (
          <ContentStep content={step.content} />
        )}
        
        {step.type === 'upload' && (
          <UploadStep
            action={step.action}
            uploads={step.uploads}
            isCompleted={isCompleted}
            onComplete={(fileId) => handleComplete(fileId)}
          />
        )}

        {step.type === 'collaboration' && (
          <CollaborationStep
            description={step.description}
            onComplete={() => handleComplete()}
          />
        )}
      </div>
      
      {/* Navigation buttons */}
      <div className="flex justify-between mt-4">
        <Button
          variant="outline"
          onClick={goToPreviousStep}
          disabled={currentStep === 0}
          size={isMobile ? "sm" : "default"}
        >
          <ArrowLeft className={`${isMobile ? 'mr-1 h-3 w-3' : 'mr-2 h-4 w-4'}`} /> 
          {isMobile ? "Prev" : "Previous"}
        </Button>
        
        {step.type === 'upload' ? (
          // For upload steps, the Complete button is handled by UploadStep component
          <div></div>
        ) : isLastStep ? (
          <Button
            onClick={() => handleComplete()}
            disabled={!hasAnswer || isSubmitting}
            size={isMobile ? "sm" : "default"}
          >
            {isSubmitting ? 'Saving...' : 'Complete'}
          </Button>
        ) : (
          <Button
            onClick={goToNextStep}
            disabled={!hasAnswer}
            size={isMobile ? "sm" : "default"}
          >
            Next <ArrowRight className={`${isMobile ? 'ml-1 h-3 w-3' : 'ml-2 h-4 w-4'}`} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default StepBasedTaskLogic;
