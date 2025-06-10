
import React, { useState, useEffect } from "react";
import { StepNode } from "@/types/task-builder";
import { FormFieldRenderer } from "./input-renderers";
import type { SaveStatus } from "@/hooks/useAutoSaveManager";

interface FormStepRendererProps {
  step: StepNode;
  answer: Record<string, any>;
  handleAnswer: (answer: Record<string, any>) => void;
  autoSaveManager?: {
    handleFieldChange: (fieldId: string, value: any, isTyping: boolean, saveCallback: (value: any) => Promise<void>) => void;
    startTyping: (fieldId: string) => void;
    stopTyping: (fieldId: string) => void;
    getSaveStatus: (fieldId: string) => SaveStatus;
    subscribeToStatus: (fieldId: string, callback: (status: SaveStatus) => void) => () => void;
    forceSave: (fieldId: string) => void;
  };
  onAutoSaveField?: (fieldId: string, value: any) => Promise<void>;
}

export const FormStepRenderer: React.FC<FormStepRendererProps> = ({
  step,
  answer = {},
  handleAnswer,
  autoSaveManager,
  onAutoSaveField,
}) => {
  const [formValues, setFormValues] = useState<Record<string, any>>(answer);

  // Update form values when answer prop changes (but only if not typing)
  useEffect(() => {
    if (!step.fields) return;
    
    const hasTypingFields = step.fields.some(field => 
      autoSaveManager && autoSaveManager.getSaveStatus(field.id) === 'typing'
    );
    
    if (!hasTypingFields) {
      setFormValues(answer);
    }
  }, [answer, step.fields, autoSaveManager]);

  const handleFieldChange = (fieldId: string, value: any) => {
    const newValues = { ...formValues, [fieldId]: value };
    setFormValues(newValues);
    
    // Update parent immediately for UI responsiveness
    handleAnswer(newValues);
    
    // Handle auto-save if manager is provided
    if (autoSaveManager && onAutoSaveField) {
      autoSaveManager.handleFieldChange(fieldId, value, true, (fieldValue) => 
        onAutoSaveField(fieldId, fieldValue)
      );
    }
  };

  const isFieldVisible = (field: any): boolean => {
    if (!field.conditions || field.conditions.length === 0) {
      return true;
    }

    return field.conditions.every((condition: any) => {
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

  if (!step.fields || step.fields.length === 0) {
    return <p className="text-gray-500">No form fields defined</p>;
  }

  return (
    <div className="space-y-4">
      {step.fields.map((field) => {
        if (!isFieldVisible(field)) return null;
        
        return (
          <FormFieldRenderer
            key={field.id}
            field={field}
            value={formValues[field.id]}
            onChange={(value) => handleFieldChange(field.id, value)}
            autoSaveManager={autoSaveManager}
            onAutoSave={onAutoSaveField ? (value) => onAutoSaveField(field.id, value) : undefined}
          />
        );
      })}
    </div>
  );
};
