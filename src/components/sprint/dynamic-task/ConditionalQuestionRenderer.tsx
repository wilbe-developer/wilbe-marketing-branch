
import React, { useState, useEffect } from 'react';
import { StepNode, FormField } from '@/types/task-builder';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';

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

  // Handle answer changes for the main question
  const handleMainAnswer = (value: any) => {
    // For boolean inputs, we need to handle both boolean and string representations
    const normalizedValue = step.inputType === 'boolean' ? normalizeBoolean(value) : value;
    
    // If there are no conditional inputs, just use the value directly
    if (!step.conditionalInputs) {
      handleAnswer(normalizedValue);
      return;
    }
    
    // If there are conditional inputs, we need to keep track of both the main value
    // and any additional inputs
    const prevAnswerObj = typeof answer === 'object' && answer !== null 
      ? answer 
      : { value: answer };
    
    handleAnswer({
      ...prevAnswerObj,
      value: normalizedValue,
    });
  };

  // Handle secondary/conditional answer changes
  const handleConditionalAnswer = (fieldId: string, fieldValue: any) => {
    // Ensure we have a properly structured answer object
    const answerObj = typeof answer === 'object' && answer !== null 
      ? { ...answer } 
      : { value: answer };
    
    handleAnswer({
      ...answerObj,
      [fieldId]: fieldValue
    });
  };

  // Helper to get the main answer value, accounting for both simple and complex answers
  const getMainAnswerValue = () => {
    if (typeof answer === 'object' && answer !== null && 'value' in answer) {
      return answer.value;
    }
    return answer;
  };

  // Render a content field
  const renderContentField = (field: FormField) => {
    return (
      <div className="prose max-w-none mt-2">
        {field.content && (
          <div dangerouslySetInnerHTML={{ __html: field.content }} />
        )}
        {field.text && <p>{field.text}</p>}
      </div>
    );
  };

  // Determine if we should show conditional inputs
  const mainValue = getMainAnswerValue();
  const stringMainValue = String(mainValue);
  
  // Get the conditional fields based on the answer
  const conditionalFields = step.conditionalInputs && 
    (step.conditionalInputs[mainValue] || step.conditionalInputs[stringMainValue]);

  return (
    <div className="space-y-6">
      {step.description && (
        <p className="text-gray-600 mb-4">{step.description}</p>
      )}
      
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

              {field.type === 'content' && renderContentField(field)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
