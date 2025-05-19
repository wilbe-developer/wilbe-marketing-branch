
import React from "react";
import { StepNode } from "@/types/task-builder";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

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
  return (
    <div className="space-y-4">
      <Textarea
        value={answer || ""}
        onChange={(e) => onAnswer(e.target.value)}
        placeholder="Enter your answer here..."
        rows={6}
      />
      <Button onClick={() => onAnswer(answer || "")}>Save Answer</Button>
    </div>
  );
};
