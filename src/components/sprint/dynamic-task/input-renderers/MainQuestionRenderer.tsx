
import React from "react";
import { StepNode } from "@/types/task-builder";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CollaborationFieldRenderer } from "./CollaborationFieldRenderer";

interface MainQuestionRendererProps {
  step: StepNode;
  value: any;
  onChange: (value: any) => void;
}

export const MainQuestionRenderer: React.FC<MainQuestionRendererProps> = ({
  step,
  value,
  onChange,
}) => {
  // Get the main value
  const mainValue = typeof value === 'object' && value !== null && 'value' in value
    ? value.value 
    : value;

  // Handle boolean conversion
  const normalizeBoolean = (val: any) => {
    if (val === 'true') return true;
    if (val === 'false') return false;
    return val;
  };

  switch (step.inputType) {
    case 'select':
      return (
        <Select
          value={String(mainValue) || ''}
          onValueChange={onChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            {step.options?.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    
    case 'radio':
      return (
        <RadioGroup
          value={String(mainValue) || ''}
          onValueChange={onChange}
        >
          {step.options?.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={`${step.id}-${option.value}`} />
              <Label htmlFor={`${step.id}-${option.value}`}>{option.label}</Label>
            </div>
          ))}
        </RadioGroup>
      );
    
    case 'boolean':
      return (
        <RadioGroup
          value={String(mainValue) || ''}
          onValueChange={(stringValue) => onChange(normalizeBoolean(stringValue))}
        >
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id={`${step.id}-true`} />
              <Label htmlFor={`${step.id}-true`}>Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id={`${step.id}-false`} />
              <Label htmlFor={`${step.id}-false`}>No</Label>
            </div>
          </div>
        </RadioGroup>
      );
    
    case 'text':
      return (
        <Input
          value={mainValue || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter your answer"
        />
      );
    
    case 'textarea':
      return (
        <Textarea
          value={mainValue || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter your answer"
          rows={4}
        />
      );
    
    case 'collaboration':
      return <CollaborationFieldRenderer />;
    
    default:
      return null;
  }
};
