import React, { useState, useEffect } from 'react';
import { StepNode, FormField } from '@/types/task-builder';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { TeamMember } from '@/hooks/team-members/types';
import TeamMemberForm from '@/components/sprint/step-types/TeamMemberForm';
import { CollaborationStepRenderer } from '@/components/sprint/task-builder/dynamic-step/CollaborationStepRenderer';

export interface StepRendererProps {
  step: StepNode;
  answer: any;
  handleAnswer: (value: any) => void;
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
  // For handling form-type answers with multiple fields
  const [formValues, setFormValues] = useState<Record<string, any>>(answer || {});

  // Effect to handle initialization of form values from answer
  useEffect(() => {
    if (step.type === "form" || step.type === "conditionalQuestion" || step.type === "groupedQuestions") {
      setFormValues(answer || {});
    }
  }, [step, answer]);

  // Helper to update a specific field in a form
  const updateFormField = (fieldId: string, value: any) => {
    const newValues = { ...formValues, [fieldId]: value };
    setFormValues(newValues);
    handleAnswer(newValues);
  };

  // Handle text input changes - save immediately without debounce
  const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    handleAnswer(e.target.value);
  };

  // Check if a field should be visible based on conditions
  const isFieldVisible = (field: FormField): boolean => {
    if (!field.conditions || field.conditions.length === 0) {
      return true;
    }

    return field.conditions.every((condition) => {
      const sourceValue = condition.source.fieldId 
        ? formValues[condition.source.fieldId]
        : null;

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
    });
  };

  // Handle form type with multiple inputs
  if (step.type === "form" && step.fields && step.fields.length > 0) {
    return (
      <div className="space-y-4">
        {step.fields.map((field) => {
          if (!isFieldVisible(field)) return null;
          
          return renderFormField(field);
        })}
      </div>
    );
  }

  // Handle grouped questions in one step
  if (step.type === "groupedQuestions" && step.questions && step.questions.length > 0) {
    return (
      <div className="space-y-6">
        {step.questions.map((question, index) => {
          // Check if this question should be visible based on other answers in the group
          if (question.conditions && question.conditions.length > 0) {
            const shouldShow = question.conditions.every(condition => {
              const sourceValue = condition.source.fieldId 
                ? formValues[condition.source.fieldId] 
                : null;
                
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
            });
            
            if (!shouldShow) return null;
          }
          
          return (
            <Card key={index} className="border-slate-200">
              <CardContent className="pt-4">
                <QuestionStepRenderer
                  step={question}
                  answer={formValues[question.id]}
                  handleAnswer={(value) => updateFormField(question.id, value)}
                />
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  }

  // Handle conditional question with follow-up inputs
  if (step.type === "conditionalQuestion") {
    return (
      <div className="space-y-4">
        {/* Primary question - must have inputType */}
        {step.inputType && renderStandardQuestion()}
        
        {/* Conditional follow-up fields based on selected option */}
        {step.conditionalInputs && answer && step.conditionalInputs[answer] && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            {step.conditionalInputs[answer].map((field) => renderFormField(field))}
          </div>
        )}
      </div>
    );
  }

  if (!step.inputType) return null;

  // Standard question handling
  return renderStandardQuestion();

  // Helper function to render standard question types
  function renderStandardQuestion() {
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
                  onChange={() => {
                    handleAnswer(option.value);
                    
                    // If this option has a conditional input, initialize the form values
                    if (option.conditionalInput) {
                      const newValues = { 
                        ...formValues, 
                        [option.conditionalInput.id]: ""
                      };
                      setFormValues(newValues);
                    }
                  }}
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
            
            {/* Show conditional input for the selected option */}
            {step.options?.map((option) => (
              answer === option.value && option.conditionalInput && (
                <div key={`cond-${option.value}`} className="mt-2 ml-6 pl-3 border-l-2 border-gray-200">
                  {renderFormField(option.conditionalInput)}
                </div>
              )
            ))}
          </div>
        );
      
      case 'select':
        return (
          <div className="space-y-2">
            <Select
              value={answer || ""}
              onValueChange={(val) => {
                handleAnswer(val);
                
                // If this option has a conditional input, initialize the form values
                const selectedOption = step.options?.find(o => o.value === val);
                if (selectedOption?.conditionalInput) {
                  const newValues = { 
                    ...formValues, 
                    [selectedOption.conditionalInput.id]: ""
                  };
                  setFormValues(newValues);
                }
              }}
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
            
            {/* Show conditional input for the selected option */}
            {step.options?.map((option) => (
              answer === option.value && option.conditionalInput && (
                <div key={`cond-${option.value}`} className="mt-2 border-t pt-2">
                  {renderFormField(option.conditionalInput)}
                </div>
              )
            ))}
            
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
                      handleAnswer([...currentValues, option.value]);
                      
                      // If this option has a conditional input, initialize the form values
                      if (option.conditionalInput) {
                        const newValues = { 
                          ...formValues, 
                          [option.conditionalInput.id]: ""
                        };
                        setFormValues(newValues);
                      }
                    } else {
                      handleAnswer(
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
            
            {/* Show conditional inputs for selected options */}
            {Array.isArray(answer) && step.options?.filter(option => 
              answer.includes(option.value) && option.conditionalInput
            ).map((option) => (
              <div key={`cond-${option.value}`} className="mt-2 ml-6 pl-3 border-l-2 border-gray-200">
                <p className="text-sm font-medium mb-1">For "{option.label}":</p>
                {renderFormField(option.conditionalInput!)}
              </div>
            ))}
          </div>
        );
      
      case 'text':
        return (
          <input
            type="text"
            value={answer || ''}
            onChange={handleTextInputChange}
            className="w-full p-2 border rounded"
            placeholder="Your answer..."
          />
        );
      
      case 'textarea':
        return (
          <textarea
            value={answer || ''}
            onChange={handleTextInputChange}
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
                onChange={() => handleAnswer(true)}
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
                onChange={() => handleAnswer(false)}
                className="mt-1"
              />
              <label htmlFor={`${step.id}-no`} className="font-medium">No</label>
            </div>
            
            {/* Show conditional content based on boolean answer */}
            {answer === true && step.conditionalInputs?.['true'] && (
              <div className="mt-2 ml-6 pl-3 border-l-2 border-gray-200">
                {step.conditionalInputs['true'].map(field => renderFormField(field))}
              </div>
            )}
            
            {answer === false && step.conditionalInputs?.['false'] && (
              <div className="mt-2 ml-6 pl-3 border-l-2 border-gray-200">
                {step.conditionalInputs['false'].map(field => renderFormField(field))}
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  }
  
  // Helper function to render a single form field
  function renderFormField(field: FormField) {
    const fieldValue = formValues[field.id] || "";

    switch (field.type) {
      case "text":
        return (
          <div key={field.id} className="space-y-2 mb-4">
            <Label htmlFor={field.id}>{field.label}</Label>
            <Input
              id={field.id}
              value={fieldValue}
              onChange={(e) => updateFormField(field.id, e.target.value)}
              placeholder={field.placeholder}
              className="w-full"
            />
          </div>
        );
      case "textarea":
        return (
          <div key={field.id} className="space-y-2 mb-4">
            <Label htmlFor={field.id}>{field.label}</Label>
            <Textarea
              id={field.id}
              value={fieldValue}
              onChange={(e) => updateFormField(field.id, e.target.value)}
              placeholder={field.placeholder}
              rows={4}
              className="w-full"
            />
          </div>
        );
      case "select":
        return (
          <div key={field.id} className="space-y-2 mb-4">
            <Label htmlFor={field.id}>{field.label}</Label>
            <Select
              value={fieldValue}
              onValueChange={(value) => updateFormField(field.id, value)}
            >
              <SelectTrigger id={field.id}>
                <SelectValue placeholder={field.placeholder || "Select an option"} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option, i) => (
                  <SelectItem key={i} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      case "radio":
        return (
          <div key={field.id} className="space-y-2 mb-4">
            <Label>{field.label}</Label>
            <div className="space-y-2 mt-2">
              {field.options?.map((option, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={`${field.id}-${option.value}`}
                    name={field.id}
                    value={option.value}
                    checked={fieldValue === option.value}
                    onChange={() => updateFormField(field.id, option.value)}
                    className="mt-1"
                  />
                  <label htmlFor={`${field.id}-${option.value}`}>{option.label}</label>
                </div>
              ))}
            </div>
          </div>
        );
      case "checkbox":
        return (
          <div key={field.id} className="space-y-2 mb-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={field.id}
                checked={Boolean(fieldValue)}
                onChange={(e) => updateFormField(field.id, e.target.checked)}
                className="mt-1"
              />
              <label htmlFor={field.id}>{field.label}</label>
            </div>
          </div>
        );
      default:
        return null;
    }
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
            handleAnswer(e.target.files[0]);
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
        onChange={(e) => handleAnswer(e.target.value)}
        className="w-full p-2 border rounded"
        rows={6}
        placeholder="Enter your answer here..."
      />
    </div>
  );
};

export const TeamMemberStepRenderer: React.FC<StepRendererProps> = ({
  step,
  answer,
  handleAnswer,
}) => {
  // Initialize team members state
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(
    Array.isArray(answer) ? answer : [
      {
        id: crypto.randomUUID(),
        name: "",
        profile_description: "",
        employment_status: "",
        trigger_points: "",
        relationship_description: "",
      }
    ]
  );

  // Update team members when answer changes
  useEffect(() => {
    if (Array.isArray(answer) && answer.length > 0) {
      setTeamMembers(answer);
    }
  }, [answer]);

  // Add a new team member
  const handleAddMember = () => {
    const newMember: TeamMember = {
      id: crypto.randomUUID(),
      name: "",
      profile_description: "",
      employment_status: "",
      trigger_points: "",
      relationship_description: "",
    };
    
    const updatedMembers = [...teamMembers, newMember];
    setTeamMembers(updatedMembers);
    handleAnswer(updatedMembers);
  };

  // Remove a team member
  const handleRemoveMember = (index: number) => {
    const updatedMembers = [...teamMembers];
    updatedMembers.splice(index, 1);
    setTeamMembers(updatedMembers);
    handleAnswer(updatedMembers);
  };

  // Update a team member
  const handleUpdateMember = (index: number, field: keyof TeamMember, value: string) => {
    const updatedMembers = [...teamMembers];
    updatedMembers[index] = {
      ...updatedMembers[index],
      [field]: value,
    };
    setTeamMembers(updatedMembers);
    handleAnswer(updatedMembers);
  };

  return (
    <TeamMemberForm
      teamMembers={teamMembers}
      memberType={step.memberType || "Co-founder"} // Default to "Co-founder" if not specified
      onAdd={handleAddMember}
      onRemove={handleRemoveMember}
      onUpdate={handleUpdateMember}
    />
  );
};

export const CollaborationRenderer: React.FC<StepRendererProps> = ({
  step,
  answer,
  handleAnswer,
}) => {
  return (
    <CollaborationStepRenderer
      step={step}
      answer={answer}
      handleAnswer={handleAnswer}
    />
  );
};
