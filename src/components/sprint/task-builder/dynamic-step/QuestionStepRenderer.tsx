
import React from "react";
import { StepNode } from "@/types/task-builder";
import { FormFieldRenderer } from "./input-renderers/FormFieldRenderer";

interface QuestionStepRendererProps {
  step: StepNode;
  answer: any;
  onAnswer: (value: any) => void;
  onAutoSave?: (value: any) => Promise<void>;
}

export const QuestionStepRenderer: React.FC<QuestionStepRendererProps> = ({
  step,
  answer,
  onAnswer,
  onAutoSave,
}) => {
  // Create a mock form field from the step properties
  const formField = {
    id: step.id,
    label: step.label,
    type: step.inputType || "text",
    placeholder: step.placeholder,
    options: step.options,
  };

  return (
    <div className="space-y-4">
      <FormFieldRenderer
        field={formField}
        value={answer}
        onChange={onAnswer}
        onAutoSave={onAutoSave}
      />
    </div>
  );
};
