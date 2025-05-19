
import React, { useState } from "react";
import { StepNode, FormField } from "@/types/task-builder";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CollaboratorsManagement } from "@/components/sprint/CollaboratorsManagement";

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
  const [isCollaboratorsDialogOpen, setIsCollaboratorsDialogOpen] = useState(false);

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

  // Render a collaboration field
  const renderCollaborationField = (field: FormField) => {
    return (
      <div className="mt-4 p-4 bg-blue-50 rounded-md border border-blue-100">
        <h4 className="font-medium text-blue-800 mb-3">{field.label || "Team Collaboration"}</h4>
        {field.text && <p className="text-sm text-blue-700 mb-4">{field.text}</p>}
        {!field.text && (
          <p className="text-sm text-blue-700 mb-4">
            Invite your team members to collaborate on this sprint. They will be able to view and contribute to tasks.
          </p>
        )}
        
        <Button 
          onClick={() => setIsCollaboratorsDialogOpen(true)}
          className="w-full flex items-center justify-center gap-2"
        >
          <Users className="h-4 w-4" />
          <span>Manage Collaborators</span>
        </Button>
        
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
  };

  // Render a content field
  const renderContentField = (field: FormField) => {
    // Handle collaboration fields (for backward compatibility with invite_link fields)
    if (field.type === 'collaboration' || field.id === 'invite_link') {
      return renderCollaborationField(field);
    }

    return (
      <div className="prose max-w-none mt-2">
        {field.content && (
          <div dangerouslySetInnerHTML={{ __html: field.content }} />
        )}
        {field.text && <p>{field.text}</p>}
      </div>
    );
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
        
        {step.inputType === 'collaboration' && renderCollaborationField({
          id: 'collaboration',
          label: "Team Collaboration",
          type: 'collaboration'
        })}
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

              {field.type === 'collaboration' && renderCollaborationField(field)}

              {field.type === 'content' && renderContentField(field)}
            </div>
          ))}
        </div>
      )}
    </>
  );
};
