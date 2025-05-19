
import React from "react";
import { StepNode, FormField } from "@/types/task-builder";
import { QuestionStepRenderer } from "./dynamic-step/QuestionStepRenderer";
import { Card, CardContent } from "@/components/ui/card";
import { TeamMemberStepRenderer } from "./dynamic-step/TeamMemberStepRenderer";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
  if (!step) return null;

  // Helper function to handle file uploads
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onFileUpload) {
      onFileUpload(e.target.files[0]);
    }
  };

  // Helper for conditional question rendering
  const renderConditionalQuestion = () => {
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
    const stringMainValue = String(mainValue);
    
    // Get the conditional fields based on the answer
    const conditionalFields = step.conditionalInputs && 
      (step.conditionalInputs[mainValue] || step.conditionalInputs[stringMainValue]);

    // Handle main answer changes
    const handleMainAnswer = (value: any) => {
      const normalizedValue = step.inputType === 'boolean' ? normalizeBoolean(value) : value;
      
      if (!step.conditionalInputs) {
        onAnswer(normalizedValue);
        return;
      }
      
      const prevAnswerObj = typeof answer === 'object' && answer !== null 
        ? answer 
        : { value: answer };
      
      onAnswer({
        ...prevAnswerObj,
        value: normalizedValue,
      });
    };

    // Handle conditional field changes
    const handleConditionalAnswer = (fieldId: string, fieldValue: any) => {
      const answerObj = typeof answer === 'object' && answer !== null 
        ? { ...answer } 
        : { value: answer };
      
      onAnswer({
        ...answerObj,
        [fieldId]: fieldValue
      });
    };

    return (
      <>
        {/* Render the main question input */}
        <div className="space-y-4">
          {step.inputType === 'select' && step.options && (
            <Select
              value={String(mainValue) || ''}
              onValueChange={handleMainAnswer}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {step.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          {step.inputType === 'radio' && step.options && (
            <RadioGroup
              value={String(mainValue) || ''}
              onValueChange={handleMainAnswer}
            >
              {step.options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`${step.id}-${option.value}`} />
                  <Label htmlFor={`${step.id}-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          )}
          
          {step.inputType === 'boolean' && (
            <div className="flex items-center space-x-3">
              <Switch
                checked={!!mainValue}
                onCheckedChange={handleMainAnswer}
                id={`${step.id}-toggle`}
              />
              <Label htmlFor={`${step.id}-toggle`}>
                {mainValue ? 'Yes' : 'No'}
              </Label>
            </div>
          )}
          
          {step.inputType === 'text' && (
            <Input
              value={mainValue || ''}
              onChange={(e) => handleMainAnswer(e.target.value)}
              placeholder="Enter your answer"
            />
          )}
          
          {step.inputType === 'textarea' && (
            <Textarea
              value={mainValue || ''}
              onChange={(e) => handleMainAnswer(e.target.value)}
              placeholder="Enter your answer"
              rows={4}
            />
          )}
        </div>
        
        {/* Render conditional inputs if applicable */}
        {conditionalFields && conditionalFields.length > 0 && (
          <div className="mt-6 pl-4 border-l-2 border-gray-200 space-y-4">
            {conditionalFields.map((field: FormField) => (
              <div key={field.id} className="space-y-2">
                {field.label && <Label htmlFor={field.id}>{field.label}</Label>}
                
                {field.type === 'text' && (
                  <Input
                    id={field.id}
                    value={answer?.[field.id] || ''}
                    onChange={(e) => handleConditionalAnswer(field.id, e.target.value)}
                    placeholder={field.placeholder || ''}
                  />
                )}
                
                {field.type === 'textarea' && (
                  <Textarea
                    id={field.id}
                    value={answer?.[field.id] || ''}
                    onChange={(e) => handleConditionalAnswer(field.id, e.target.value)}
                    placeholder={field.placeholder || ''}
                    rows={4}
                  />
                )}
                
                {field.type === 'select' && field.options && (
                  <Select
                    value={answer?.[field.id] || ''}
                    onValueChange={(value) => handleConditionalAnswer(field.id, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={field.placeholder || 'Select an option'} />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {field.content && (
                  <div className="prose max-w-none">
                    {field.content}
                  </div>
                )}
                
                {/* Content type field */}
                {field.type === 'content' && (
                  <div className="prose max-w-none mt-2">
                    {field.text}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </>
    );
  };

  // Helper for form rendering
  const renderForm = () => {
    if (!step.fields || step.fields.length === 0) {
      return <p className="text-gray-500">No form fields defined.</p>;
    }

    // Initialize form state with existing answers or empty object
    const formValues = answer || {};

    // Handle field value change
    const handleFieldChange = (fieldId: string, value: any) => {
      const updatedValues = { ...formValues, [fieldId]: value };
      onAnswer(updatedValues);
    };

    return (
      <div className="space-y-4">
        {step.fields.map((field: FormField) => (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>{field.label}</Label>
            
            {/* Render different input types based on field.type */}
            {field.type === 'text' && (
              <Input
                id={field.id}
                value={formValues[field.id] || ''}
                onChange={(e) => handleFieldChange(field.id, e.target.value)}
                placeholder={field.placeholder || ''}
              />
            )}
            
            {field.type === 'textarea' && (
              <Textarea
                id={field.id}
                value={formValues[field.id] || ''}
                onChange={(e) => handleFieldChange(field.id, e.target.value)}
                placeholder={field.placeholder || ''}
                rows={4}
              />
            )}
            
            {field.type === 'select' && field.options && (
              <Select
                value={formValues[field.id] || ''}
                onValueChange={(value) => handleFieldChange(field.id, value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={field.placeholder || 'Select an option'} />
                </SelectTrigger>
                <SelectContent>
                  {field.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            {field.type === 'checkbox' && (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={field.id}
                  checked={formValues[field.id] || false}
                  onChange={(e) => handleFieldChange(field.id, e.target.checked)}
                />
                <Label htmlFor={field.id} className="ml-2">{field.placeholder || ''}</Label>
              </div>
            )}
            
            {field.type === 'radio' && field.options && (
              <RadioGroup
                value={formValues[field.id] || ''}
                onValueChange={(value) => handleFieldChange(field.id, value)}
              >
                {field.options.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={`${field.id}-${option.value}`} />
                    <Label htmlFor={`${field.id}-${option.value}`}>{option.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          </div>
        ))}
      </div>
    );
  };

  switch (step.type) {
    case "question":
    case "conditionalQuestion":
    case "form":
    case "groupedQuestions":
      return (
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-3">{step.text}</h3>
          {step.description && (
            <p className="text-gray-600 mb-4">{step.description}</p>
          )}
          
          {step.type === "form" && renderForm()}
          {step.type === "conditionalQuestion" && renderConditionalQuestion()}
          {step.type === "question" && (
            <QuestionStepRenderer step={step} answer={answer} onAnswer={onAnswer} />
          )}
        </div>
      );

    case "team-members":
      return (
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-3">{step.text}</h3>
          {step.description && (
            <p className="text-gray-600 mb-4">{step.description}</p>
          )}
          <TeamMemberStepRenderer step={step} answer={answer} onAnswer={onAnswer} />
        </div>
      );

    case "content":
      return (
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-3">{step.text}</h3>
          {step.description && (
            <p className="text-gray-600 mb-4">{step.description}</p>
          )}
          {step.content && (
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: step.content }}
            />
          )}
        </div>
      );

    case "file":
    case "upload":
      return (
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-3">{step.text}</h3>
          {step.description && (
            <p className="text-gray-600 mb-4">{step.description}</p>
          )}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <p className="text-gray-500 mb-2">Upload a file</p>
            <input
              type="file"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/80"
            />
            {answer && answer.fileName && (
              <p className="mt-2 text-sm text-green-600">
                Uploaded: {answer.fileName}
              </p>
            )}
          </div>
        </div>
      );

    case "exercise":
    case "feedback":
    case "action":
      return (
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-3">{step.text}</h3>
          {step.description && (
            <p className="text-gray-600 mb-4">{step.description}</p>
          )}
          <textarea
            value={answer || ""}
            onChange={(e) => onAnswer(e.target.value)}
            className="w-full p-3 border rounded-md"
            rows={6}
            placeholder="Enter your answer here..."
          />
        </div>
      );

    default:
      return (
        <div className="text-red-500">
          Unknown step type: {step.type}
        </div>
      );
  }
};

export default DynamicTaskStep;
