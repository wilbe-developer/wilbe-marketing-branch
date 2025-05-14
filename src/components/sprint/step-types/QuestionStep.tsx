
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export interface QuestionStepProps {
  question: string;
  selectedAnswer?: string;
  onAnswerSelect: (value: string) => void;
  options?: Array<{
    label: string;
    value: string;
  }>;
}

const QuestionStep: React.FC<QuestionStepProps> = ({
  question,
  selectedAnswer,
  onAnswerSelect,
  options
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-xl font-semibold mb-4">{question}</h3>
        
        {options && options.length > 0 ? (
          <RadioGroup 
            value={selectedAnswer} 
            onValueChange={onAnswerSelect}
            className="space-y-3"
          >
            {options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value} className="cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        ) : (
          <div className="text-muted-foreground">No options available</div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuestionStep;
