
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface QuestionStepProps {
  question: string;
  initialValue?: string;
  onSave: (answer: string) => void;
  isSubmitting?: boolean;
  readOnly?: boolean;
}

export const QuestionStep: React.FC<QuestionStepProps> = ({
  question,
  initialValue = "",
  onSave,
  isSubmitting = false,
  readOnly = false
}) => {
  const [answer, setAnswer] = useState(initialValue || "");
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    // Update answer if initialValue changes (e.g. from loading progress)
    if (initialValue !== undefined && initialValue !== null) {
      setAnswer(initialValue);
      setIsModified(false);
    }
  }, [initialValue]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnswer(e.target.value);
    setIsModified(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(answer);
    setIsModified(false);
  };

  return (
    <div className="space-y-4">
      <div className="text-lg font-medium">{question}</div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          value={answer}
          onChange={handleChange}
          rows={6}
          placeholder="Enter your answer here..."
          className="w-full p-3"
          disabled={isSubmitting || readOnly}
        />
        
        {!readOnly && (
          <div className="flex justify-end">
            <Button 
              type="submit"
              disabled={!isModified || isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Answer"}
            </Button>
          </div>
        )}
        
        {readOnly && answer && (
          <div className="p-3 bg-gray-50 border border-gray-200 rounded text-sm text-gray-600">
            This is a view-only sprint. You cannot edit this response.
          </div>
        )}
      </form>
    </div>
  );
};

export default QuestionStep;
