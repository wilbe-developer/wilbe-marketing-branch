
import React from "react";
import { Button } from "@/components/ui/button";

export type QuestionStepProps = {
  question: string;
  options: Array<{ label: string; value: string }>;
  selectedAnswer: string;
  onAnswerSelect: (value: string) => void;
  disabled?: boolean;
};

const QuestionStep: React.FC<QuestionStepProps> = ({
  question,
  options,
  selectedAnswer,
  onAnswerSelect,
  disabled = false
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{question}</h3>
      <div className="flex flex-wrap gap-3">
        {options.map((option) => (
          <Button
            key={option.value}
            variant={selectedAnswer === option.value ? "default" : "outline"}
            onClick={() => onAnswerSelect(option.value)}
            disabled={disabled}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuestionStep;
