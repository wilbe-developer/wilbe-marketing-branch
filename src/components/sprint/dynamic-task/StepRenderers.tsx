
import React from 'react';
import { StepNode } from '@/types/task-builder';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StepRendererProps {
  step: StepNode;
  answer: any;
  handleAnswer: (stepId: string, value: any) => void;
}

export const ContentStepRenderer: React.FC<StepRendererProps> = ({ step }) => {
  return (
    <>
      {step.description && (
        <p className="text-gray-600 mb-4">{step.description}</p>
      )}
      
      {step.content && (
        <div className="prose max-w-none" 
          dangerouslySetInnerHTML={{ __html: step.content }} />
      )}
    </>
  );
};

export const QuestionStepRenderer: React.FC<StepRendererProps> = ({ 
  step, 
  answer, 
  handleAnswer 
}) => {
  if (!step.inputType) return null;

  switch (step.inputType) {
    case 'radio':
      return (
        <div className="space-y-2">
          {step.options?.map((option) => (
            <div key={option.value} className="flex items-start space-x-3">
              <input
                type="radio"
                id={option.value}
                name={step.id}
                value={option.value}
                checked={answer === option.value}
                onChange={() => handleAnswer(step.id, option.value)}
                className="mt-1"
              />
              <div>
                <label htmlFor={option.value} className="font-medium">
                  {option.label}
                </label>
                {option.description && (
                  <p className="text-sm text-gray-500">{option.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      );
    
    case 'select':
      return (
        <div className="space-y-2">
          <Select
            value={answer || ""}
            onValueChange={(value) => handleAnswer(step.id, value)}
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
          {answer && step.options?.find(o => o.value === answer)?.description && (
            <p className="text-sm text-gray-500 mt-1">
              {step.options.find(o => o.value === answer)?.description}
            </p>
          )}
        </div>
      );
    
    case 'multiselect':
      return (
        <div className="space-y-2">
          {step.options?.map((option) => (
            <div key={option.value} className="flex items-start space-x-3">
              <input
                type="checkbox"
                id={`${step.id}-${option.value}`}
                value={option.value}
                checked={Array.isArray(answer) && answer.includes(option.value)}
                onChange={(e) => {
                  const currentValues = Array.isArray(answer) 
                    ? [...answer] 
                    : [];
                  
                  if (e.target.checked) {
                    handleAnswer(step.id, [...currentValues, option.value]);
                  } else {
                    handleAnswer(
                      step.id, 
                      currentValues.filter(v => v !== option.value)
                    );
                  }
                }}
                className="mt-1"
              />
              <div>
                <label htmlFor={`${step.id}-${option.value}`} className="font-medium">
                  {option.label}
                </label>
                {option.description && (
                  <p className="text-sm text-gray-500">{option.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      );
    
    case 'text':
      return (
        <input
          type="text"
          value={answer || ''}
          onChange={(e) => handleAnswer(step.id, e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Your answer..."
        />
      );
    
    case 'textarea':
      return (
        <textarea
          value={answer || ''}
          onChange={(e) => handleAnswer(step.id, e.target.value)}
          className="w-full p-2 border rounded"
          rows={5}
          placeholder="Your answer..."
        />
      );
    
    case 'boolean':
      return (
        <div className="space-y-2">
          <div className="flex items-start space-x-3">
            <input
              type="radio"
              id={`${step.id}-yes`}
              name={step.id}
              value="true"
              checked={answer === true}
              onChange={() => handleAnswer(step.id, true)}
              className="mt-1"
            />
            <label htmlFor={`${step.id}-yes`} className="font-medium">Yes</label>
          </div>
          <div className="flex items-start space-x-3">
            <input
              type="radio"
              id={`${step.id}-no`}
              name={step.id}
              value="false"
              checked={answer === false}
              onChange={() => handleAnswer(step.id, false)}
              className="mt-1"
            />
            <label htmlFor={`${step.id}-no`} className="font-medium">No</label>
          </div>
        </div>
      );
    
    default:
      return null;
  }
};

export const FileUploadRenderer: React.FC<StepRendererProps> = ({ 
  step, 
  answer, 
  handleAnswer 
}) => {
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
      <p className="text-gray-500 mb-2">
        Upload a file
      </p>
      <input
        type="file"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleAnswer(step.id, e.target.files[0]);
          }
        }}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/80"
      />
    </div>
  );
};

export const ExerciseRenderer: React.FC<StepRendererProps> = ({ 
  step, 
  answer, 
  handleAnswer 
}) => {
  return (
    <div className="space-y-4">
      <textarea
        value={answer || ''}
        onChange={(e) => handleAnswer(step.id, e.target.value)}
        className="w-full p-2 border rounded"
        rows={6}
        placeholder="Enter your answer here..."
      />
    </div>
  );
};
