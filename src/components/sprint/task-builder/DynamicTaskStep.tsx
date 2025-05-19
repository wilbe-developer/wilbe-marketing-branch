
import React from "react";
import { StepNode } from "@/types/task-builder";
import { QuestionStepRenderer } from "./dynamic-step/QuestionStepRenderer";
import { Card, CardContent } from "@/components/ui/card";

interface DynamicTaskStepProps {
  step: StepNode;
  answer: any;
  onAnswer: (value: any) => void;
  onFileUpload?: (file: File) => void;
}

const DynamicTaskStep: React.FC<DynamicTaskStepProps> = ({
  step,
  answer,
  onAnswer,
  onFileUpload,
}) => {
  if (!step) return null;

  // Helper function to handle file uploads
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onFileUpload) {
      onFileUpload(e.target.files[0]);
    }
  };

  switch (step.type) {
    case "question":
    case "conditionalQuestion":
    case "form":
    case "groupedQuestions":
      return (
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-3">{step.text}</h3>
          {step.description && (
            <p className="text-gray-600 mb-4">{step.description}</p>
          )}
          <QuestionStepRenderer step={step} answer={answer} onAnswer={onAnswer} />
        </div>
      );

    case "content":
      return (
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-3">{step.text}</h3>
          {step.description && (
            <p className="text-gray-600 mb-4">{step.description}</p>
          )}
          {step.content && (
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: step.content }}
            />
          )}
        </div>
      );

    case "file":
    case "upload":
      return (
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-3">{step.text}</h3>
          {step.description && (
            <p className="text-gray-600 mb-4">{step.description}</p>
          )}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <p className="text-gray-500 mb-2">Upload a file</p>
            <input
              type="file"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/80"
            />
            {answer && answer.fileName && (
              <p className="mt-2 text-sm text-green-600">
                Uploaded: {answer.fileName}
              </p>
            )}
          </div>
        </div>
      );

    case "exercise":
    case "feedback":
    case "action":
      return (
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-3">{step.text}</h3>
          {step.description && (
            <p className="text-gray-600 mb-4">{step.description}</p>
          )}
          <textarea
            value={answer || ""}
            onChange={(e) => onAnswer(e.target.value)}
            className="w-full p-3 border rounded-md"
            rows={6}
            placeholder="Enter your answer here..."
          />
        </div>
      );

    default:
      return (
        <div className="text-red-500">
          Unknown step type: {step.type}
        </div>
      );
  }
};

export default DynamicTaskStep;
