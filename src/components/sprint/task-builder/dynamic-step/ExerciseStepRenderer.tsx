
import React from "react";
import { StepNode } from "@/types/task-builder";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  // If the exercise has a structured format with labeled inputs
  if (step.fields && step.fields.length > 0) {
    return (
      <div className="space-y-4">
        {step.content && (
          <div className="prose max-w-none mb-4" dangerouslySetInnerHTML={{ __html: step.content }} />
        )}
        
        {step.fields.map((field, index) => (
          <div key={index} className="space-y-2">
            <Label>{field.label}</Label>
            {field.type === 'textarea' ? (
              <Textarea
                value={answer?.[field.id] || ""}
                onChange={(e) => {
                  const newAnswer = { ...(answer || {}) };
                  newAnswer[field.id] = e.target.value;
                  onAnswer(newAnswer);
                }}
                placeholder={field.placeholder || "Enter your answer here..."}
                rows={4}
              />
            ) : (
              <Input
                value={answer?.[field.id] || ""}
                onChange={(e) => {
                  const newAnswer = { ...(answer || {}) };
                  newAnswer[field.id] = e.target.value;
                  onAnswer(newAnswer);
                }}
                placeholder={field.placeholder || "Enter your answer here..."}
              />
            )}
          </div>
        ))}
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
