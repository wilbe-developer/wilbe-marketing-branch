import React, { useState } from "react";
import ContentStep from "./step-types/ContentStep";
import QuestionStep from "./step-types/QuestionStep";
import UploadStep from "./step-types/UploadStep";
import { Button } from "@/components/ui/button";

// Types for different step configurations
type ContentStepType = {
  type: "content";
  content: string | string[];
};

type QuestionStepType = {
  type: "question";
  question: string;
  options: Array<{ label: string; value: string }>;
};

type UploadStepType = {
  type: "upload";
  uploads: string[];
  action?: string;
};

export type Step = ContentStepType | QuestionStepType | UploadStepType;

type ConditionalFlow = {
  [stepIndex: number]: {
    [answer: string]: number;
  };
};

type StepBasedTaskLogicProps = {
  steps: Step[];
  isCompleted: boolean;
  onComplete: (fileId?: string) => void;
  conditionalFlow?: ConditionalFlow;
  readOnly?: boolean;
};

const StepBasedTaskLogic: React.FC<StepBasedTaskLogicProps> = ({
  steps,
  isCompleted,
  onComplete,
  conditionalFlow,
  readOnly = false
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [uploadedFileId, setUploadedFileId] = useState<string | undefined>();

  // Function to handle moving to next step
  const handleNext = () => {
    // Check if we have conditional flow rules for this step and answer
    if (
      conditionalFlow &&
      conditionalFlow[currentStep] &&
      answers[currentStep] &&
      conditionalFlow[currentStep][answers[currentStep]] !== undefined
    ) {
      // Jump to the specified step based on the answer
      setCurrentStep(conditionalFlow[currentStep][answers[currentStep]]);
    } else if (currentStep < steps.length - 1) {
      // Otherwise just go to the next step
      setCurrentStep(currentStep + 1);
    } else {
      // We're at the last step, complete the task
      onComplete(uploadedFileId);
    }
  };

  // Function to handle answer selection for question steps
  const handleAnswerSelect = (value: string) => {
    setAnswers({
      ...answers,
      [currentStep]: value,
    });
  };

  // Function to handle file upload completion
  const handleFileUploaded = (fileId: string) => {
    setUploadedFileId(fileId);
    // Don't auto-proceed on upload - let user click Next
  };

  // Early return if task is already completed
  if (isCompleted) {
    return (
      <div className="p-4 bg-green-50 border border-green-200 rounded-md">
        <p className="text-green-800 font-medium">
          ✅ This task has been completed.
        </p>
      </div>
    );
  }

  const currentStepData = steps[currentStep];

  // Determine if the Next button should be enabled
  const isNextEnabled = () => {
    if (readOnly) return false;
    
    if (currentStepData.type === "question") {
      return !!answers[currentStep]; // Enable only if an answer is selected
    }
    if (currentStepData.type === "upload") {
      return !!uploadedFileId; // Enable only if a file was uploaded
    }
    // For content steps, always enable the Next button
    return true;
  };

  return (
    <div className="space-y-6">
      {/* Display appropriate component based on current step type */}
      {currentStepData.type === "content" && (
        <ContentStep
          content={
            Array.isArray(currentStepData.content)
              ? currentStepData.content
              : [currentStepData.content]
          }
        />
      )}

      {currentStepData.type === "question" && (
        <QuestionStep
          question={currentStepData.question}
          options={currentStepData.options}
          selectedAnswer={answers[currentStep] || ""}
          onAnswerSelect={handleAnswerSelect}
          disabled={readOnly}
        />
      )}

      {currentStepData.type === "upload" && (
        <UploadStep
          uploads={currentStepData.uploads}
          action={currentStepData.action}
          onFileUploaded={handleFileUploaded}
          readOnly={readOnly}
        />
      )}

      {/* Navigation buttons */}
      <div className="flex justify-between mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0 || readOnly}
          className={currentStep === 0 ? "invisible" : ""}
        >
          Previous
        </Button>

        <Button
          type="button"
          onClick={handleNext}
          disabled={!isNextEnabled()}
        >
          {currentStep < steps.length - 1 ? "Next" : "Complete"}
        </Button>
      </div>
    </div>
  );
};

export default StepBasedTaskLogic;
