
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CollaboratorsManagement } from '@/components/sprint/CollaboratorsManagement';

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

  // State for the collaborators dialog
  const [isCollaboratorsDialogOpen, setIsCollaboratorsDialogOpen] = useState(false);

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
    // Check if this is the special invite_link field for collaborators
    if (field.id === 'invite_link') {
      return (
        <div className="mt-4 p-4 bg-blue-50 rounded-md border border-blue-100">
          <h4 className="font-medium text-blue-800 mb-3">Team Collaboration</h4>
          <p className="text-sm text-blue-700 mb-4">
            Invite your team members to collaborate on this sprint. They will be able to view and contribute to tasks.
          </p>
          
          <Button 
            onClick={() => setIsCollaboratorsDialogOpen(true)}
            className="w-full flex items-center justify-center gap-2"
          >
            <Users className="h-4 w-4" />
            <span>Manage Collaborators</span>
          </Button>
          
          {/* Dialog for managing collaborators */}
          <Dialog open={isCollaboratorsDialogOpen} onOpenChange={setIsCollaboratorsDialogOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Manage Team Collaborators</DialogTitle>
                <DialogDescription>
                  Add or remove team members who can collaborate on your sprint.
                </DialogDescription>
              </DialogHeader>
              
              <CollaboratorsManagement />
            </DialogContent>
          </Dialog>
        </div>
      );
    }
    
    // Regular content field rendering
    return (
      <div className="prose max-w-none mt-2">
        {field.content && (
          <div dangerouslySetInnerHTML={{ __html: field.content }} />
        )}
        {field.text && <p>{field.text}</p>}
      </div>
    );
  };

  // Normalize field properties (handle both type and inputType)
  const normalizeFieldType = (field: any) => {
    return {
      ...field,
      type: field.type || field.inputType,
    };
  };

  // Determine if we should show conditional inputs
  const mainValue = getMainAnswerValue();
  const stringMainValue = String(mainValue);
  
  // Get the conditional fields based on the answer
  const conditionalFields = step.conditionalInputs && 
    (step.conditionalInputs[mainValue] || step.conditionalInputs[stringMainValue]);

  // Normalize step inputType/type
  const stepInputType = step.inputType || step.type;

  return (
    <div className="space-y-6">
      {step.description && (
        <p className="text-gray-600 mb-4">{step.description}</p>
      )}
      
      {/* Render the main question input */}
      <div className="space-y-4">
        {(stepInputType === 'select') && step.options && (
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
        
        {stepInputType === 'radio' && step.options && (
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
        
        {stepInputType === 'boolean' && (
          <RadioGroup
            value={mainValue === true ? 'true' : mainValue === false ? 'false' : ''}
            onValueChange={(value) => handleMainAnswer(value === 'true')}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id={`${step.id}-yes`} />
              <Label htmlFor={`${step.id}-yes`}>Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id={`${step.id}-no`} />
              <Label htmlFor={`${step.id}-no`}>No</Label>
            </div>
          </RadioGroup>
        )}
        
        {stepInputType === 'text' && (
          <Input
            value={mainValue || ''}
            onChange={(e) => handleMainAnswer(e.target.value)}
            placeholder="Enter your answer"
          />
        )}
        
        {stepInputType === 'textarea' && (
          <Textarea
            value={mainValue || ''}
            onChange={(e) => handleMainAnswer(e.target.value)}
            placeholder="Enter your answer"
            rows={4}
          />
        )}
        
        {stepInputType === 'date' && (
          <Input
            type="date"
            value={mainValue || ''}
            onChange={(e) => handleMainAnswer(e.target.value)}
            placeholder="Enter a date"
          />
        )}
        
        {stepInputType === 'multiselect' && step.options && (
          <div className="space-y-2">
            {step.options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`${step.id}-${option.value}`}
                  checked={Array.isArray(mainValue) && mainValue.includes(option.value)}
                  onCheckedChange={(checked) => {
                    const currentValues = Array.isArray(mainValue) ? [...mainValue] : [];
                    if (checked) {
                      handleMainAnswer([...currentValues, option.value]);
                    } else {
                      handleMainAnswer(
                        currentValues.filter((val) => val !== option.value)
                      );
                    }
                  }}
                />
                <Label htmlFor={`${step.id}-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Render the invite_link field even if there are no conditional fields */}
      {!conditionalFields && step.fields && step.fields.some(field => field.id === 'invite_link') && (
        <div className="mt-6 space-y-4">
          {step.fields
            .filter(field => field.id === 'invite_link')
            .map((field) => (
              <div key={field.id}>
                {renderContentField(field)}
              </div>
            ))}
        </div>
      )}
      
      {/* Render conditional inputs if applicable */}
      {conditionalFields && conditionalFields.length > 0 && (
        <div className="mt-6 pl-4 border-l-2 border-gray-200 space-y-4">
          {conditionalFields.map((fieldData: FormField) => {
            const field = normalizeFieldType(fieldData);
            const fieldType = field.type || field.inputType; // Ensure we check both type and inputType
            
            // Handle both content fields and exercise fields that should render the editor
            if (fieldType === 'content' || field.id === 'invite_link') {
              return (
                <div key={field.id}>
                  {renderContentField(field)}
                </div>
              );
            }

            // For exercise type, render a textarea for the answer
            if (fieldType === 'exercise') {
              return (
                <div key={field.id} className="space-y-2">
                  {field.label && <Label htmlFor={field.id}>{field.label}</Label>}
                  {field.text && <p className="text-sm text-gray-600">{field.text}</p>}
                  <Textarea
                    id={field.id}
                    value={answer?.[field.id] || ''}
                    onChange={(e) => handleConditionalAnswer(field.id, e.target.value)}
                    placeholder="Enter your answer here..."
                    rows={4}
                  />
                </div>
              );
            }
            
            return (
              <div key={field.id} className="space-y-2">
                {field.label && <Label htmlFor={field.id}>{field.label}</Label>}
                
                {fieldType === 'text' && (
                  <Input
                    id={field.id}
                    value={answer?.[field.id] || ''}
                    onChange={(e) => handleConditionalAnswer(field.id, e.target.value)}
                    placeholder={field.placeholder || ''}
                  />
                )}
                
                {fieldType === 'textarea' && (
                  <Textarea
                    id={field.id}
                    value={answer?.[field.id] || ''}
                    onChange={(e) => handleConditionalAnswer(field.id, e.target.value)}
                    placeholder={field.placeholder || ''}
                    rows={4}
                  />
                )}
                
                {fieldType === 'date' && (
                  <Input
                    id={field.id}
                    type="date"
                    value={answer?.[field.id] || ''}
                    onChange={(e) => handleConditionalAnswer(field.id, e.target.value)}
                    placeholder={field.placeholder || ''}
                  />
                )}
                
                {fieldType === 'select' && field.options && (
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
                
                {fieldType === 'boolean' && (
                  <RadioGroup
                    value={answer?.[field.id] === true ? 'true' : answer?.[field.id] === false ? 'false' : ''}
                    onValueChange={(value) => handleConditionalAnswer(field.id, value === 'true')}
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
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
