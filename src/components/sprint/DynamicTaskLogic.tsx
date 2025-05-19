
import React, { useState, useEffect } from 'react';
import { SprintTaskDefinition, StepNode } from '@/types/task-builder';
import { Button } from '@/components/ui/button';
import { useSprintProfileQuickEdit } from '@/hooks/useSprintProfileQuickEdit';
import { flattenSteps, evaluateStepVisibility } from '@/utils/taskDefinitionAdapter';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DynamicTaskLogicProps {
  taskDefinition: SprintTaskDefinition;
  isCompleted: boolean;
  onComplete: (fileId?: string) => Promise<void>;
  initialAnswers?: Record<string, any>;
}

export const DynamicTaskLogic: React.FC<DynamicTaskLogicProps> = ({
  taskDefinition,
  isCompleted,
  onComplete,
  initialAnswers = {}
}) => {
  const { sprintProfile } = useSprintProfileQuickEdit();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>(initialAnswers);
  
  // Get all steps and filter visible ones based on conditions
  const allSteps = taskDefinition.definition.steps || [];
  const flattenedSteps = flattenSteps(allSteps);
  
  // Filter steps based on visibility conditions
  const visibleSteps = flattenedSteps.filter(step => 
    evaluateStepVisibility(step, sprintProfile || {}, answers)
  );
  
  const currentStep = visibleSteps[currentStepIndex];
  
  // If completed, show a summary
  if (isCompleted) {
    return (
      <div className="space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-green-800 font-medium">Task Completed</h3>
          <p className="text-green-700 text-sm mt-1">
            You have successfully completed this task.
          </p>
        </div>
        
        {Object.keys(answers).length > 0 && (
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Your Answers</h3>
            <div className="space-y-2">
              {visibleSteps.map(step => (
                answers[step.id] && (
                  <div key={step.id} className="text-sm">
                    <div className="font-medium">{step.text}</div>
                    <div className="text-gray-600 mt-1">
                      {typeof answers[step.id] === 'object' 
                        ? JSON.stringify(answers[step.id]) 
                        : answers[step.id].toString()}
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
  
  // Handle answering a step
  const handleAnswer = (stepId: string, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [stepId]: value
    }));
  };
  
  // Go to next step or complete if last step
  const handleNext = () => {
    if (currentStepIndex < visibleSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      handleComplete();
    }
  };
  
  // Go to previous step
  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };
  
  // Complete the task
  const handleComplete = async () => {
    try {
      await onComplete();
      toast("Task completed successfully!");
    } catch (error) {
      console.error("Error completing task:", error);
      toast("Failed to complete task. Please try again.");
    }
  };
  
  if (!currentStep) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">No steps found for this task.</p>
      </div>
    );
  }
  
  // Render the current step
  return (
    <div className="space-y-6">
      <div className="flex justify-between text-sm text-gray-500">
        <div>Step {currentStepIndex + 1} of {visibleSteps.length}</div>
        <div>
          {Math.round(((currentStepIndex + 1) / visibleSteps.length) * 100)}% complete
        </div>
      </div>
      
      <div className="border rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">{currentStep.text}</h3>
        
        {currentStep.description && (
          <p className="text-gray-600 mb-4">{currentStep.description}</p>
        )}
        
        {/* Step content based on type */}
        <div className="mb-6">
          {currentStep.type === 'content' && currentStep.content && (
            <div className="prose max-w-none" 
              dangerouslySetInnerHTML={{ __html: currentStep.content }} />
          )}
          
          {currentStep.type === 'question' && (
            <div className="space-y-4">
              {/* Render different input types */}
              {currentStep.inputType === 'radio' && currentStep.options && (
                <div className="space-y-2">
                  {currentStep.options.map((option) => (
                    <div key={option.value} className="flex items-start space-x-3">
                      <input
                        type="radio"
                        id={option.value}
                        name={currentStep.id}
                        value={option.value}
                        checked={answers[currentStep.id] === option.value}
                        onChange={() => handleAnswer(currentStep.id, option.value)}
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
              )}
              
              {/* New Select Input Type */}
              {currentStep.inputType === 'select' && currentStep.options && (
                <div className="space-y-2">
                  <Select
                    value={answers[currentStep.id] || ""}
                    onValueChange={(value) => handleAnswer(currentStep.id, value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      {currentStep.options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {answers[currentStep.id] && currentStep.options.find(o => o.value === answers[currentStep.id])?.description && (
                    <p className="text-sm text-gray-500 mt-1">
                      {currentStep.options.find(o => o.value === answers[currentStep.id])?.description}
                    </p>
                  )}
                </div>
              )}
              
              {/* New MultiSelect Input Type */}
              {currentStep.inputType === 'multiselect' && currentStep.options && (
                <div className="space-y-2">
                  {currentStep.options.map((option) => (
                    <div key={option.value} className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        id={`${currentStep.id}-${option.value}`}
                        value={option.value}
                        checked={Array.isArray(answers[currentStep.id]) && answers[currentStep.id].includes(option.value)}
                        onChange={(e) => {
                          const currentValues = Array.isArray(answers[currentStep.id]) 
                            ? [...answers[currentStep.id]] 
                            : [];
                          
                          if (e.target.checked) {
                            handleAnswer(currentStep.id, [...currentValues, option.value]);
                          } else {
                            handleAnswer(
                              currentStep.id, 
                              currentValues.filter(v => v !== option.value)
                            );
                          }
                        }}
                        className="mt-1"
                      />
                      <div>
                        <label htmlFor={`${currentStep.id}-${option.value}`} className="font-medium">
                          {option.label}
                        </label>
                        {option.description && (
                          <p className="text-sm text-gray-500">{option.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {currentStep.inputType === 'text' && (
                <input
                  type="text"
                  value={answers[currentStep.id] || ''}
                  onChange={(e) => handleAnswer(currentStep.id, e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Your answer..."
                />
              )}
              
              {currentStep.inputType === 'textarea' && (
                <textarea
                  value={answers[currentStep.id] || ''}
                  onChange={(e) => handleAnswer(currentStep.id, e.target.value)}
                  className="w-full p-2 border rounded"
                  rows={5}
                  placeholder="Your answer..."
                />
              )}
              
              {currentStep.inputType === 'boolean' && (
                <div className="space-y-2">
                  <div className="flex items-start space-x-3">
                    <input
                      type="radio"
                      id={`${currentStep.id}-yes`}
                      name={currentStep.id}
                      value="true"
                      checked={answers[currentStep.id] === true}
                      onChange={() => handleAnswer(currentStep.id, true)}
                      className="mt-1"
                    />
                    <label htmlFor={`${currentStep.id}-yes`} className="font-medium">Yes</label>
                  </div>
                  <div className="flex items-start space-x-3">
                    <input
                      type="radio"
                      id={`${currentStep.id}-no`}
                      name={currentStep.id}
                      value="false"
                      checked={answers[currentStep.id] === false}
                      onChange={() => handleAnswer(currentStep.id, false)}
                      className="mt-1"
                    />
                    <label htmlFor={`${currentStep.id}-no`} className="font-medium">No</label>
                  </div>
                </div>
              )}
              
              {/* Add other input types as needed */}
            </div>
          )}
          
          {(currentStep.type === 'upload' || currentStep.type === 'file') && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <p className="text-gray-500 mb-2">
                Upload a file
              </p>
              <input
                type="file"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleAnswer(currentStep.id, e.target.files[0]);
                  }
                }}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/80"
              />
            </div>
          )}
          
          {(currentStep.type === 'exercise') && (
            <div className="space-y-4">
              <textarea
                value={answers[currentStep.id] || ''}
                onChange={(e) => handleAnswer(currentStep.id, e.target.value)}
                className="w-full p-2 border rounded"
                rows={6}
                placeholder="Enter your answer here..."
              />
            </div>
          )}
        </div>
        
        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStepIndex === 0}
          >
            Previous
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={
              (currentStep.type === 'question' && !answers[currentStep.id]) ||
              ((currentStep.type === 'upload' || currentStep.type === 'file') && !answers[currentStep.id])
            }
          >
            {currentStepIndex === visibleSteps.length - 1 ? 'Complete' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DynamicTaskLogic;
