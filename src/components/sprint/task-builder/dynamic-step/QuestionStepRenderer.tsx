
import React from "react";
import { StepNode } from "@/types/task-builder";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  if (!step.inputType) return null;

  // Handle text input changes - save immediately without debounce
  const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // Save immediately on each change
    onAnswer(e.target.value);
  };

  switch (step.inputType) {
    case "radio":
      return (
        <RadioGroup value={answer || ""} onValueChange={onAnswer}>
          <div className="space-y-2">
            {step.options?.map((option, i) => (
              <div key={i} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={option.value}
                  id={`${step.id}-${option.value}`}
                />
                <Label htmlFor={`${step.id}-${option.value}`}>
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      );

    case "boolean":
      return (
        <RadioGroup
          value={answer?.toString() || ""}
          onValueChange={(value) => {
            if (step.inputType === "boolean") {
              onAnswer(value === "true");
            } else {
              onAnswer(value);
            }
          }}
        >
          <div className="space-y-2">
            <>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id={`${step.id}-true`} />
                <Label htmlFor={`${step.id}-true`}>Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id={`${step.id}-false`} />
                <Label htmlFor={`${step.id}-false`}>No</Label>
              </div>
            </>
          </div>
        </RadioGroup>
      );

    case "select":
      return (
        <Select value={answer || ""} onValueChange={onAnswer}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            {step.options?.map((option, i) => (
              <SelectItem key={i} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case "multiselect":
      return (
        <div className="space-y-2">
          {step.options?.map((option, i) => (
            <div key={i} className="flex items-center space-x-2">
              <Checkbox
                id={`${step.id}-${option.value}`}
                checked={Array.isArray(answer) && answer.includes(option.value)}
                onCheckedChange={(checked) => {
                  const currentValues = Array.isArray(answer) ? [...answer] : [];
                  if (checked) {
                    onAnswer([...currentValues, option.value]);
                  } else {
                    onAnswer(
                      currentValues.filter((val) => val !== option.value)
                    );
                  }
                }}
              />
              <Label htmlFor={`${step.id}-${option.value}`}>{option.label}</Label>
            </div>
          ))}
        </div>
      );

    case "textarea":
      return (
        <div className="space-y-2">
          <Textarea
            value={answer || ""}
            onChange={handleTextInputChange}
            placeholder="Enter your answer..."
            rows={4}
          />
        </div>
      );

    case "text":
    default:
      return (
        <div className="space-y-2">
          <Input
            value={answer || ""}
            onChange={handleTextInputChange}
            placeholder="Enter your answer..."
          />
        </div>
      );
  }
};
