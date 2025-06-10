
import React from "react";
import { StepNode } from "@/types/task-builder";
import {
  QuestionStepRenderer,
  ContentStepRenderer,
  UploadStepRenderer,
  ExerciseStepRenderer,
  CollaborationStepRenderer,
  TeamMemberStepRenderer
} from "./dynamic-step";

interface DynamicTaskStepProps {
  step: StepNode;
  answer: any;
  onAnswer: (value: any) => void;
  onFileUpload?: (file: File) => void;
  onBlur?: (fieldId?: string) => void;
  onFocus?: (fieldId?: string) => void;
}

const DynamicTaskStep: React.FC<DynamicTaskStepProps> = ({
  step,
  answer,
  onAnswer,
  onFileUpload,
  onBlur,
  onFocus,
}) => {
  console.log("DynamicTaskStep rendering:", { stepType: step.type, stepId: step.id, answer });

  switch (step.type) {
    case "question":
    case "form":
    case "conditionalQuestion":
    case "groupedQuestions":
      return (
        <QuestionStepRenderer
          step={step}
          answer={answer}
          onAnswer={onAnswer}
          onBlur={onBlur}
          onFocus={onFocus}
        />
      );

    case "content":
      return <ContentStepRenderer step={step} />;

    case "upload":
    case "file":
      return (
        <UploadStepRenderer
          step={step}
          answer={answer}
          onAnswer={onAnswer}
          onFileUpload={onFileUpload}
        />
      );

    case "exercise":
      return (
        <ExerciseStepRenderer
          step={step}
          answer={answer}
          onAnswer={onAnswer}
        />
      );

    case "collaboration":
      return <CollaborationStepRenderer step={step} />;

    case "team-members":
      return (
        <TeamMemberStepRenderer
          step={step}
          answer={answer}
          onAnswer={onAnswer}
        />
      );

    default:
      console.warn(`Unknown step type: ${step.type}`);
      return (
        <div className="p-4 border border-red-200 rounded-md">
          <p className="text-red-600">Unknown step type: {step.type}</p>
          <pre className="mt-2 text-sm bg-gray-100 p-2 rounded">
            {JSON.stringify(step, null, 2)}
          </pre>
        </div>
      );
  }
};

export default DynamicTaskStep;
