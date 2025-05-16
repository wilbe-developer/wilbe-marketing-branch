
import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface QuestionStepProps {
  question: string;
  options?: Array<{ label: string; value: string }>;
  content?: string;
  selectedAnswer?: string;
  onAnswerSelect: (value: string) => void;
}

const QuestionStep: React.FC<QuestionStepProps> = ({
  question,
  options,
  content,
  selectedAnswer,
  onAnswerSelect,
}) => {
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onAnswerSelect(e.target.value);
  };

  return (
    <>
      <h2 className="text-lg font-semibold mb-4">{question}</h2>
      
      {content && (
        <p className="mb-4 text-gray-700">{content}</p>
      )}
      
      {options ? (
        <div className="flex flex-wrap gap-3 mb-4">
          {options.map(option => (
            <Button
              key={option.value}
              variant={selectedAnswer === option.value ? "default" : "outline"}
              onClick={() => onAnswerSelect(option.value)}
              className="flex-grow md:flex-grow-0"
            >
              {option.label}
            </Button>
          ))}
        </div>
      ) : (
        <Textarea
          value={selectedAnswer || ''}
          onChange={handleTextChange}
          placeholder="Type your answer here..."
          className="min-h-[120px] w-full mb-4"
        />
      )}
    </>
  );
};

export default QuestionStep;
