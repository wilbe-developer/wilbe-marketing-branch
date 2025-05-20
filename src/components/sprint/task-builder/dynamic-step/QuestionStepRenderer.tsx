
import React, { useState, useEffect } from "react";
import { StepNode, FormField } from "@/types/task-builder";
import { Card, CardContent } from "@/components/ui/card";
import {
  TextInputRenderer,
  SelectInputRenderer,
  RadioInputRenderer,
  BooleanInputRenderer,
  CheckboxInputRenderer,
  FormFieldRenderer
} from "./input-renderers";

interface QuestionStepRendererProps {
  step: StepNode;
  answer: any;
  onAnswer: (value: any) => void;
}

export const QuestionStepRenderer: React.FC<QuestionStepRendererProps> = ({
  step,
  answer,
  onAnswer,
}) => {
  // For handling form-type answers with multiple fields
  const [formValues, setFormValues] = useState<Record<string, any>>(answer || {});

  // Effect to handle initialization of form values from answer
  useEffect(() => {
    if (step.type === "form" || step.type === "conditionalQuestion" || step.type === "groupedQuestions") {
      setFormValues(answer || {});
    }
  }, [step, answer]);

  // Helper to update a specific field in a form
  const updateFormField = (fieldId: string, value: any) => {
    const newValues = { ...formValues, [fieldId]: value };
    setFormValues(newValues);
    onAnswer(newValues);
  };

  // Check if a field should be visible based on conditions
  const isFieldVisible = (field: FormField): boolean => {
    if (!field.conditions || field.conditions.length === 0) {
      return true;
    }

    return field.conditions.every((condition) => {
      const sourceValue = condition.source.fieldId 
        ? formValues[condition.source.fieldId]
        : null;

      switch (condition.operator) {
        case "equals":
          return sourceValue === condition.value;
        case "not_equals":
          return sourceValue !== condition.value;
        case "in":
          return Array.isArray(condition.value) && condition.value.includes(sourceValue);
        case "not_in":
          return Array.isArray(condition.value) && !condition.value.includes(sourceValue);
        default:
          return false;
      }
    });
  };

  // Handle form type with multiple inputs
  if (step.type === "form" && step.fields && step.fields.length > 0) {
    return (
      <div className="space-y-4">
        {step.fields.map((field) => {
          if (!isFieldVisible(field)) return null;
          
          return (
            <FormFieldRenderer
              key={field.id}
              field={field}
              value={formValues[field.id]}
              onChange={(value) => updateFormField(field.id, value)}
            />
          );
        })}
      </div>
    );
  }

  // Handle grouped questions in one step
  if (step.type === "groupedQuestions" && step.questions && step.questions.length > 0) {
    return (
      <div className="space-y-6">
        {step.questions.map((question, index) => {
          // Check if this question should be visible based on other answers in the group
          if (question.conditions && question.conditions.length > 0) {
            const shouldShow = question.conditions.every(condition => {
              const sourceValue = condition.source.fieldId 
                ? formValues[condition.source.fieldId] 
                : null;
                
              switch (condition.operator) {
                case "equals":
                  return sourceValue === condition.value;
                case "not_equals":
                  return sourceValue !== condition.value;
                case "in":
                  return Array.isArray(condition.value) && condition.value.includes(sourceValue);
                case "not_in":
                  return Array.isArray(condition.value) && !condition.value.includes(sourceValue);
                default:
                  return false;
              }
            });
            
            if (!shouldShow) return null;
          }
          
          return (
            <Card key={index} className="border-slate-200">
              <CardContent className="pt-4">
                <QuestionStepRenderer
                  step={question}
                  answer={formValues[question.id]}
                  onAnswer={(value) => updateFormField(question.id, value)}
                />
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  }

  // Handle conditional question with follow-up inputs
  if (step.type === "conditionalQuestion") {
    return (
      <div className="space-y-4">
        {/* Primary question */}
        {renderStandardQuestion()}
        
        {/* Conditional follow-up fields based on selected option */}
        {step.conditionalInputs && answer && step.conditionalInputs[answer] && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            {step.conditionalInputs[answer].map((field) => (
              <FormFieldRenderer
                key={field.id}
                field={field}
                value={formValues[field.id]}
                onChange={(value) => updateFormField(field.id, value)}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Standard question handling
  return renderStandardQuestion();

  // Helper function to render standard question types
  function renderStandardQuestion() {
    if (!step.inputType) return null;

    switch (step.inputType) {
      case "radio":
        return (
          <RadioInputRenderer
            id={step.id}
            value={answer || ""}
            options={step.options}
            onChange={onAnswer}
          />
        );

      case "boolean":
        return (
          <BooleanInputRenderer
            id={step.id}
            value={answer || ""}
            onChange={(value) => onAnswer(value)}
          />
        );

      case "select":
        return (
          <SelectInputRenderer
            id={step.id}
            value={answer || ""}
            options={step.options}
            onChange={onAnswer}
          />
        );

      case "multiselect":
        return (
          <CheckboxInputRenderer
            id={step.id}
            value={Array.isArray(answer) ? answer : []}
            options={step.options}
            onChange={onAnswer}
          />
        );

      case "textarea":
        return (
          <TextInputRenderer
            id={step.id}
            value={answer || ""}
            type="textarea"
            onChange={onAnswer}
          />
        );

      case "text":
      default:
        return (
          <TextInputRenderer
            id={step.id}
            value={answer || ""}
            type="text"
            onChange={onAnswer}
          />
        );
    }
  }
};
