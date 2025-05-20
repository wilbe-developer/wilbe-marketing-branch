
import React from "react";
import { StepNode } from "@/types/task-builder";
import { MainQuestionRenderer, ConditionalFieldRenderer } from "./input-renderers";

interface ConditionalQuestionRendererProps {
  step: StepNode;
  answer: any;
  handleAnswer: (value: any) => void;
}

export const ConditionalQuestionRenderer: React.FC<ConditionalQuestionRendererProps> = ({
  step,
  answer,
  handleAnswer,
}) => {
  // Convert the boolean string to actual boolean if needed
  const normalizeBoolean = (value: any) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  };

  // Get the main answer value, accounting for both simple and complex answers
  const getMainAnswerValue = () => {
    if (typeof answer === 'object' && answer !== null && 'value' in answer) {
      return answer.value;
    }
    return answer;
  };

  const mainValue = getMainAnswerValue();
  const stringMainValue = mainValue !== null && mainValue !== undefined ? String(mainValue) : '';
  
  // Get the conditional fields based on the answer
  const conditionalFields = step.conditionalInputs && 
    (step.conditionalInputs[mainValue] || step.conditionalInputs[stringMainValue]);

  // Handle main answer changes
  const handleMainAnswer = (value: any) => {
    const normalizedValue = step.inputType === 'boolean' ? normalizeBoolean(value) : value;
    
    if (!step.conditionalInputs) {
      handleAnswer(normalizedValue);
      return;
    }
    
    const prevAnswerObj = typeof answer === 'object' && answer !== null 
      ? answer 
      : { value: answer };
    
    handleAnswer({
      ...prevAnswerObj,
      value: normalizedValue,
    });
  };

  // Handle conditional field changes
  const handleConditionalAnswer = (fieldId: string, fieldValue: any) => {
    const answerObj = typeof answer === 'object' && answer !== null 
      ? { ...answer } 
      : { value: answer };
    
    handleAnswer({
      ...answerObj,
      [fieldId]: fieldValue
    });
  };

  return (
    <>
      {/* Render the main question input */}
      <div className="space-y-4">
        <MainQuestionRenderer 
          step={step} 
          value={answer} 
          onChange={handleMainAnswer} 
        />
      </div>
      
      {/* Render conditional inputs if applicable */}
      {conditionalFields && conditionalFields.length > 0 && (
        <div className="mt-6 pl-4 border-l-2 border-gray-200 space-y-4">
          {conditionalFields.map((field) => (
            <div key={field.id} className="space-y-2">
              <ConditionalFieldRenderer
                field={field}
                value={answer?.[field.id]}
                onChange={handleConditionalAnswer}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
};
