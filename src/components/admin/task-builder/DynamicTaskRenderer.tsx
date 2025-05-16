import React, { useState, useEffect } from "react";
import {
  TaskDefinition,
  StepNode,
  Condition,
  ProfileQuestion
} from "@/types/task-builder";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface DynamicTaskRendererProps {
  taskDefinition: TaskDefinition;
  profileAnswers: Record<string, any>;
  stepAnswers: Record<string, any>;
  onProfileAnswerChange: (key: string, value: any) => void;
  onStepAnswerChange: (stepId: string, value: any) => void;
}

const DynamicTaskRenderer: React.FC<DynamicTaskRendererProps> = ({
  taskDefinition,
  profileAnswers,
  stepAnswers,
  onProfileAnswerChange,
  onStepAnswerChange,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [visibleSteps, setVisibleSteps] = useState<StepNode[]>([]);
  const [showProfileQuestions, setShowProfileQuestions] = useState(
    taskDefinition.profileQuestions.length > 0
  );

  // Evaluate a condition based on current answers
  const evaluateCondition = (condition: Condition): boolean => {
    let sourceValue: any;

    // Get the value we're checking based on the source
    if (condition.source.profileKey) {
      sourceValue = profileAnswers[condition.source.profileKey];
    } else if (condition.source.stepId) {
      sourceValue = stepAnswers[condition.source.stepId];
    } else {
      return false;
    }

    // If sourceValue is undefined/null, return false
    if (sourceValue === undefined || sourceValue === null) {
      return false;
    }

    // Evaluate the condition based on operator
    switch (condition.operator) {
      case "equals":
        return sourceValue === condition.value;
      case "not_equals":
        return sourceValue !== condition.value;
      case "in":
        return Array.isArray(condition.value) && condition.value.includes(sourceValue);
      case "not_in":
        return Array.isArray(condition.value) && !condition.value.includes(sourceValue);
      default:
        return false;
    }
  };

  // Check if a step should be visible based on its conditions
  const isStepVisible = (step: StepNode): boolean => {
    if (!step.conditions || step.conditions.length === 0) {
      return true;
    }

    return step.conditions.every((condition) => evaluateCondition(condition));
  };

  // Build visible steps list
  useEffect(() => {
    const flattenSteps = (stepsArray: StepNode[]): StepNode[] => {
      const result: StepNode[] = [];

      for (const step of stepsArray) {
        if (isStepVisible(step)) {
          result.push(step);

          // Check children if any
          if (step.children && step.children.length > 0) {
            result.push(...flattenSteps(step.children));
          }

          // Check for conditional steps based on answers
          const answer = stepAnswers[step.id];
          if (step.onAnswer && answer && step.onAnswer[answer]) {
            result.push(...flattenSteps(step.onAnswer[answer]));
          }
        }
      }

      return result;
    };

    if (taskDefinition.steps) {
      const visibleStepsList = flattenSteps(taskDefinition.steps);
      setVisibleSteps(visibleStepsList);
    }
  }, [taskDefinition, profileAnswers, stepAnswers]);

  const handleNext = () => {
    if (currentStepIndex < visibleSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleSubmitProfile = () => {
    setShowProfileQuestions(false);
  };

  const renderProfileQuestions = () => {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Profile Questions</h3>
          <p className="text-gray-500">
            Please answer these questions before proceeding
          </p>
        </div>

        {taskDefinition.profileQuestions.map((question, index) => (
          <div key={index} className="space-y-2">
            <Label htmlFor={`profile-${question.key}`}>{question.text}</Label>
            {renderProfileInput(question)}
          </div>
        ))}

        <Button onClick={handleSubmitProfile}>Continue</Button>
      </div>
    );
  };

  const renderProfileInput = (question: ProfileQuestion) => {
    const value = profileAnswers[question.key] || "";

    switch (question.type) {
      case "boolean":
        return (
          <RadioGroup
            value={value.toString()}
            onValueChange={(val) =>
              onProfileAnswerChange(question.key, val === "true")
            }
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id={`${question.key}-true`} />
              <Label htmlFor={`${question.key}-true`}>Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id={`${question.key}-false`} />
              <Label htmlFor={`${question.key}-false`}>No</Label>
            </div>
          </RadioGroup>
        );

      case "select":
        return (
          <Select
            value={value.toString()}
            onValueChange={(val) => onProfileAnswerChange(question.key, val)}
          >
            <SelectTrigger id={`profile-${question.key}`}>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {question.options?.map((option, i) => (
                <SelectItem key={i} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "multiselect":
        return (
          <div className="space-y-2">
            {question.options?.map((option, i) => (
              <div key={i} className="flex items-center space-x-2">
                <Checkbox
                  id={`${question.key}-${i}`}
                  checked={(value as string[])?.includes(option)}
                  onCheckedChange={(checked) => {
                    const currentValue = Array.isArray(value) ? [...value] : [];
                    if (checked) {
                      onProfileAnswerChange(question.key, [
                        ...currentValue,
                        option,
                      ]);
                    } else {
                      onProfileAnswerChange(
                        question.key,
                        currentValue.filter((val) => val !== option)
                      );
                    }
                  }}
                />
                <Label htmlFor={`${question.key}-${i}`}>{option}</Label>
              </div>
            ))}
          </div>
        );

      case "text":
      default:
        return (
          <Input
            id={`profile-${question.key}`}
            value={value}
            onChange={(e) => onProfileAnswerChange(question.key, e.target.value)}
            placeholder="Enter your answer"
          />
        );
    }
  };

  const renderStep = (step: StepNode) => {
    const stepValue = stepAnswers[step.id] || "";

    switch (step.type) {
      case "question":
        return (
          <div className="space-y-4">
            <div className="text-lg">{step.text}</div>
            {renderStepInput(step)}
          </div>
        );

      case "content":
        return (
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: step.text }} />
          </div>
        );

      case "file":
      case "upload":
        return (
          <div className="space-y-4">
            <div className="text-lg">{step.text}</div>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
              <p className="text-gray-500">
                Drag and drop a file here, or click to select
              </p>
              <Button variant="outline" className="mt-2">
                Select File
              </Button>
            </div>
          </div>
        );

      case "exercise":
      case "feedback":
      case "action":
        return (
          <div className="space-y-4">
            <div className="text-lg">{step.text}</div>
            <Textarea
              value={stepValue as string}
              onChange={(e) => onStepAnswerChange(step.id, e.target.value)}
              placeholder="Enter your answer"
              rows={6}
            />
          </div>
        );

      default:
        return <div>Unknown step type: {step.type}</div>;
    }
  };

  const renderStepInput = (step: StepNode) => {
    const value = stepAnswers[step.id] || "";

    if (!step.inputType) {
      return null;
    }

    switch (step.inputType) {
      case "radio":
        return (
          <RadioGroup
            value={value.toString()}
            onValueChange={(val) => onStepAnswerChange(step.id, val)}
          >
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
          </RadioGroup>
        );

      case "boolean":
        return (
          <RadioGroup
            value={value.toString()}
            onValueChange={(val) => onStepAnswerChange(step.id, val)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id={`${step.id}-true`} />
              <Label htmlFor={`${step.id}-true`}>Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id={`${step.id}-false`} />
              <Label htmlFor={`${step.id}-false`}>No</Label>
            </div>
          </RadioGroup>
        );

      case "select":
        return (
          <Select
            value={value.toString()}
            onValueChange={(val) => onStepAnswerChange(step.id, val)}
          >
            <SelectTrigger>
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
                  checked={
                    Array.isArray(value) && value.includes(option.value)
                  }
                  onCheckedChange={(checked) => {
                    const currentValue = Array.isArray(value) ? [...value] : [];
                    if (checked) {
                      onStepAnswerChange(step.id, [
                        ...currentValue,
                        option.value,
                      ]);
                    } else {
                      onStepAnswerChange(
                        step.id,
                        currentValue.filter((val) => val !== option.value)
                      );
                    }
                  }}
                />
                <Label htmlFor={`${step.id}-${option.value}`}>
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        );

      case "textarea":
        return (
          <Textarea
            value={value as string}
            onChange={(e) => onStepAnswerChange(step.id, e.target.value)}
            placeholder="Enter your answer"
            rows={4}
          />
        );

      case "text":
      default:
        return (
          <Input
            value={value as string}
            onChange={(e) => onStepAnswerChange(step.id, e.target.value)}
            placeholder="Enter your answer"
          />
        );
    }
  };

  const renderStaticPanels = () => {
    if (!taskDefinition.staticPanels || taskDefinition.staticPanels.length === 0) {
      return null;
    }

    const visiblePanels = taskDefinition.staticPanels.filter((panel) => {
      if (!panel.conditions || panel.conditions.length === 0) {
        return true;
      }
      return panel.conditions.every((condition) => evaluateCondition(condition));
    });

    if (visiblePanels.length === 0) {
      return null;
    }

    return (
      <div className="space-y-4 mt-6">
        {visiblePanels.map((panel, panelIndex) => (
          <Card key={panelIndex}>
            <CardHeader>
              <CardTitle>{panel.title}</CardTitle>
            </CardHeader>
            <CardContent>
              {panel.content && (
                <div className="prose" dangerouslySetInnerHTML={{ __html: panel.content }}/>
              )}
              {panel.items && panel.items.length > 0 && (
                <ul className="list-disc pl-5 space-y-2">
                  {panel.items
                    .sort((a, b) => (a.order || 0) - (b.order || 0))
                    .map((item, itemIndex) => (
                      <li key={itemIndex}>{item.text}</li>
                    ))}
                </ul>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  if (showProfileQuestions && taskDefinition.profileQuestions.length > 0) {
    return renderProfileQuestions();
  }

  if (visibleSteps.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-500">No steps to display</p>
      </div>
    );
  }

  const currentStep = visibleSteps[currentStepIndex];

  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-500">
        Step {currentStepIndex + 1} of {visibleSteps.length}
      </div>
      
      {currentStep && renderStep(currentStep)}
      
      {renderStaticPanels()}
      
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
          disabled={currentStepIndex === visibleSteps.length - 1}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default DynamicTaskRenderer;
