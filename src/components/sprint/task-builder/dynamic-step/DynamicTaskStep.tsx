
import React from "react";
import { StepNode } from "@/types/task-builder";
import { Card, CardContent } from "@/components/ui/card";
import { QuestionStepRenderer } from "./QuestionStepRenderer";
import { ContentStepRenderer } from "./ContentStepRenderer";
import { UploadStepRenderer } from "./UploadStepRenderer";
import { ExerciseStepRenderer } from "./ExerciseStepRenderer";
import { FormStepRenderer } from "@/components/sprint/dynamic-task/FormStepRenderer";
import { ConditionalQuestionRenderer } from "@/components/sprint/dynamic-task/ConditionalQuestionRenderer";

interface DynamicTaskStepProps {
  step: StepNode;
  answer: any;
  onAnswer: (value: any) => void;
  onFileUpload?: (file: File) => void;
}

const DynamicTaskStep: React.FC<DynamicTaskStepProps> = ({
  step,
  answer,
  onAnswer,
  onFileUpload,
}) => {
  // Normalize step properties (handle both type and inputType)
  const normalizedStep = {
    ...step,
    type: step.type || step.inputType,
  };

  switch (normalizedStep.type) {
    case "question":
      return (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{step.text}</h3>
              <QuestionStepRenderer
                step={step}
                answer={answer}
                onAnswer={onAnswer}
              />
            </div>
          </CardContent>
        </Card>
      );
      
    case "conditionalQuestion":
      return (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{step.text}</h3>
              <ConditionalQuestionRenderer
                step={step}
                answer={answer}
                handleAnswer={onAnswer}
              />
            </div>
          </CardContent>
        </Card>
      );
      
    case "form":
      return (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{step.text}</h3>
              <FormStepRenderer
                step={step}
                answer={answer}
                handleAnswer={onAnswer}
              />
            </div>
          </CardContent>
        </Card>
      );

    case "content":
      return <ContentStepRenderer step={step} answer={answer} handleAnswer={onAnswer} />;

    case "file":
    case "upload":
      return (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{step.text}</h3>
              <UploadStepRenderer
                step={step}
                answer={answer}
                onAnswer={onAnswer}
                onFileUpload={onFileUpload}
              />
            </div>
          </CardContent>
        </Card>
      );

    case "exercise":
    case "feedback":
    case "action":
      return (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{step.text}</h3>
              {step.description && (
                <p className="text-gray-600 mb-4">{step.description}</p>
              )}
              <ExerciseStepRenderer
                step={step}
                answer={answer}
                onAnswer={onAnswer}
              />
            </div>
          </CardContent>
        </Card>
      );

    case "team-members":
      return (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{step.text}</h3>
              {/* Use the TeamMemberStepRenderer for team member forms */}
              {/*
                This will work because DynamicTaskStep.tsx already imports 
                TeamMemberStepRenderer in the original file we're not modifying
              */}
              <div className="team-members-renderer">
                {React.createElement(
                  // Import from the module that contains the component
                  require('./TeamMemberStepRenderer').TeamMemberStepRenderer,
                  { step, answer, onAnswer }
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      );

    default:
      return (
        <Card>
          <CardContent className="pt-6">
            <div className="text-gray-500">Unknown step type: {step.type}</div>
          </CardContent>
        </Card>
      );
  }
};

export default DynamicTaskStep;
