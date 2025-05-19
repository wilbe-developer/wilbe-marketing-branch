
import React from "react";
import { StepNode } from "@/types/task-builder";
import { Card, CardContent } from "@/components/ui/card";
import { QuestionStepRenderer } from "./QuestionStepRenderer";
import { ContentStepRenderer } from "./ContentStepRenderer";
import { UploadStepRenderer } from "./UploadStepRenderer";
import { ExerciseStepRenderer } from "./ExerciseStepRenderer";

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
  switch (step.type) {
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
              <ExerciseStepRenderer
                step={step}
                answer={answer}
                onAnswer={onAnswer}
              />
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
