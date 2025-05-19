
import React from "react";
import { StepNode, FormField } from "@/types/task-builder";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ExerciseStepRendererProps {
  step: StepNode;
  answer: any;
  onAnswer: (value: any) => void;
}

export const ExerciseStepRenderer: React.FC<ExerciseStepRendererProps> = ({
  step,
  answer,
  onAnswer,
}) => {
  // Normalize field properties between inputType and type
  const normalizeFieldType = (field: any) => {
    return {
      ...field,
      type: field.type || field.inputType,
    };
  };

  // Handle form field change
  const handleFieldChange = (fieldId: string, value: any) => {
    const newAnswer = { ...(answer || {}) };
    newAnswer[fieldId] = value;
    onAnswer(newAnswer);
  };

  // Render a date input field
  const renderDateField = (field: FormField, value: string) => (
    <Input
      id={field.id}
      type="date"
      value={value || ""}
      onChange={(e) => handleFieldChange(field.id, e.target.value)}
      className="w-full"
    />
  );

  // Render a boolean field with radio buttons
  const renderBooleanField = (field: FormField, value: any) => (
    <RadioGroup
      value={value === true ? "true" : value === false ? "false" : ""}
      onValueChange={(val) => handleFieldChange(field.id, val === "true")}
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="true" id={`${field.id}-yes`} />
        <Label htmlFor={`${field.id}-yes`}>Yes</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="false" id={`${field.id}-no`} />
        <Label htmlFor={`${field.id}-no`}>No</Label>
      </div>
    </RadioGroup>
  );

  // Render a select field
  const renderSelectField = (field: FormField, value: any) => (
    <Select
      value={value || ""}
      onValueChange={(val) => handleFieldChange(field.id, val)}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={field.placeholder || "Select an option"} />
      </SelectTrigger>
      <SelectContent>
        {field.options?.map((option, idx) => (
          <SelectItem key={idx} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  // Render a checkbox field (for multiselect)
  const renderMultiselectField = (field: FormField, value: any) => (
    <div className="space-y-2">
      {field.options?.map((option, idx) => (
        <div key={idx} className="flex items-center space-x-2">
          <Checkbox
            id={`${field.id}-${option.value}`}
            checked={(value || []).includes(option.value)}
            onCheckedChange={(checked) => {
              const currentValues = Array.isArray(value) ? [...value] : [];
              if (checked) {
                handleFieldChange(field.id, [...currentValues, option.value]);
              } else {
                handleFieldChange(
                  field.id,
                  currentValues.filter((val) => val !== option.value)
                );
              }
            }}
          />
          <Label htmlFor={`${field.id}-${option.value}`}>{option.label}</Label>
        </div>
      ))}
    </div>
  );

  // Detect if this exercise has structured fields
  const hasStructuredFields = () => {
    return (
      (step.fields && step.fields.length > 0) ||
      (step.options && step.options.length > 0 && (step.inputType || step.type))
    );
  };

  // If the exercise is a question with defined type or inputType but no fields
  const normalizedStepType = step.inputType || step.type;
  
  if (normalizedStepType && !hasStructuredFields()) {
    // Single question with specific input type
    switch (normalizedStepType) {
      case "text":
        return (
          <div className="space-y-4">
            {step.content && (
              <div className="prose max-w-none mb-4" dangerouslySetInnerHTML={{ __html: step.content }} />
            )}
            <Input
              value={answer || ""}
              onChange={(e) => onAnswer(e.target.value)}
              placeholder="Enter your answer here..."
            />
          </div>
        );
      case "textarea":
        return (
          <div className="space-y-4">
            {step.content && (
              <div className="prose max-w-none mb-4" dangerouslySetInnerHTML={{ __html: step.content }} />
            )}
            <Textarea
              value={answer || ""}
              onChange={(e) => onAnswer(e.target.value)}
              placeholder="Enter your answer here..."
              rows={6}
            />
          </div>
        );
      case "select":
        return (
          <div className="space-y-4">
            {step.content && (
              <div className="prose max-w-none mb-4" dangerouslySetInnerHTML={{ __html: step.content }} />
            )}
            {renderSelectField(step as unknown as FormField, answer)}
          </div>
        );
      case "boolean":
        return (
          <div className="space-y-4">
            {step.content && (
              <div className="prose max-w-none mb-4" dangerouslySetInnerHTML={{ __html: step.content }} />
            )}
            {renderBooleanField(step as unknown as FormField, answer)}
          </div>
        );
      case "multiselect":
        return (
          <div className="space-y-4">
            {step.content && (
              <div className="prose max-w-none mb-4" dangerouslySetInnerHTML={{ __html: step.content }} />
            )}
            {renderMultiselectField(step as unknown as FormField, answer)}
          </div>
        );
      case "date":
        return (
          <div className="space-y-4">
            {step.content && (
              <div className="prose max-w-none mb-4" dangerouslySetInnerHTML={{ __html: step.content }} />
            )}
            {renderDateField(step as unknown as FormField, answer)}
          </div>
        );
      default:
        // Use textarea as fallback
        return (
          <div className="space-y-4">
            {step.content && (
              <div className="prose max-w-none mb-4" dangerouslySetInnerHTML={{ __html: step.content }} />
            )}
            <Textarea
              value={answer || ""}
              onChange={(e) => onAnswer(e.target.value)}
              placeholder="Enter your answer here..."
              rows={6}
            />
          </div>
        );
    }
  }

  // If the exercise has structured fields from step.fields
  if (step.fields && step.fields.length > 0) {
    return (
      <div className="space-y-4">
        {step.content && (
          <div className="prose max-w-none mb-4" dangerouslySetInnerHTML={{ __html: step.content }} />
        )}
        
        {step.fields.map((fieldData, index) => {
          const field = normalizeFieldType(fieldData);
          const fieldValue = answer?.[field.id] || "";
          const fieldType = field.type || field.inputType; // Ensure we check both type and inputType
          
          return (
            <div key={index} className="space-y-2">
              <Label>{field.label}</Label>
              
              {(fieldType === 'textarea') && (
                <Textarea
                  id={field.id}
                  value={fieldValue}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  placeholder={field.placeholder || "Enter your answer here..."}
                  rows={4}
                />
              )}
              
              {(fieldType === 'text') && (
                <Input
                  id={field.id}
                  value={fieldValue}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  placeholder={field.placeholder || "Enter your answer here..."}
                />
              )}
              
              {(fieldType === 'date') && (
                <Input
                  id={field.id}
                  type="date"
                  value={fieldValue}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  placeholder={field.placeholder || ""}
                />
              )}
              
              {(fieldType === 'boolean') && renderBooleanField(field, fieldValue)}
              
              {(fieldType === 'select') && field.options && renderSelectField(field, fieldValue)}
              
              {(fieldType === 'multiselect') && field.options && renderMultiselectField(field, fieldValue)}
            </div>
          );
        })}
      </div>
    );
  }

  // Default free-form exercise
  return (
    <div className="space-y-4">
      {step.content && (
        <div className="prose max-w-none mb-4" dangerouslySetInnerHTML={{ __html: step.content }} />
      )}
      
      <Textarea
        value={answer || ""}
        onChange={(e) => onAnswer(e.target.value)}
        placeholder="Enter your answer here..."
        rows={6}
      />
    </div>
  );
};
