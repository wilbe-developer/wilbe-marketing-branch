
import React from "react";
import { StepNode } from "@/types/task-builder";
import { Card, CardContent } from "@/components/ui/card";
import { QuestionStepRenderer } from "./QuestionStepRenderer";
import { ContentStepRenderer } from "./ContentStepRenderer";
import { UploadStepRenderer } from "./UploadStepRenderer";
import { ExerciseStepRenderer } from "./ExerciseStepRenderer";
import { CollaborationStepRenderer } from "./CollaborationStepRenderer";
import { FormStepRenderer } from "@/components/sprint/dynamic-task/FormStepRenderer";
import { ConditionalQuestionRenderer } from "@/components/sprint/dynamic-task/ConditionalQuestionRenderer";
import { normalizeStepType } from "@/utils/taskStepUtils";
import { TeamMemberStepRenderer } from "./TeamMemberStepRenderer";
import { parseMarkdown } from "@/utils/markdownUtils";

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
  console.log("DynamicTaskStep rendering step with type:", step.type);
  
  // Normalize step type to ensure consistent handling across the application
  const normalizedType = normalizeStepType(step.type);
  console.log("Normalized step type:", normalizedType);

  // Render description with markdown support
  const renderDescription = () => {
    if (step.description_markdown) {
      return (
        <div 
          className="text-gray-600 prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: parseMarkdown(step.description_markdown) }}
        />
      );
    } else if (step.description) {
      return <p className="text-gray-600">{step.description}</p>;
    }
    return null;
  };

  // Handle form step type
  if (step.type === 'form') {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{step.text}</h3>
            {renderDescription()}
            <FormStepRenderer
              step={step}
              answer={answer}
              handleAnswer={onAnswer}
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Handle conditionalQuestion step type
  if (step.type === 'conditionalQuestion') {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{step.text}</h3>
            {renderDescription()}
            <ConditionalQuestionRenderer
              step={step}
              answer={answer}
              handleAnswer={onAnswer}
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Handle collaboration step type
  if (normalizedType === 'collaboration') {
    console.log("Rendering collaboration step:", step);
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{step.text || step.description}</h3>
            {renderDescription()}
            <CollaborationStepRenderer step={step} answer={answer} handleAnswer={onAnswer} />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Handle team-members step type
  if (normalizedType === 'team-members') {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{step.text}</h3>
            {renderDescription()}
            <TeamMemberStepRenderer 
              step={step} 
              answer={answer} 
              handleAnswer={onAnswer} 
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Now handle the rest of the step types based on normalized step type
  switch (normalizedType) {
    case "question":
      return (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{step.text}</h3>
              {renderDescription()}
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

    case "upload":
    case "file":
      return (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{step.text}</h3>
              {renderDescription()}
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
      return (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{step.text}</h3>
              {renderDescription()}
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
      console.warn(`Unhandled step type in DynamicTaskStep: ${step.type} -> ${normalizedType}`);
      return (
        <Card>
          <CardContent className="pt-6">
            <div className="text-gray-500">
              <p>Unknown step type: {step.type}</p>
              <p className="text-sm text-red-500 mt-2">This step type is not supported yet.</p>
            </div>
          </CardContent>
        </Card>
      );
  }
};

export default DynamicTaskStep;
