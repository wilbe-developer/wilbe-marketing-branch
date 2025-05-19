
import React, { useState, useEffect } from 'react';
import { StepNode, FormField } from '@/types/task-builder';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface FormStepRendererProps {
  step: StepNode;
  answer: Record<string, any> | null;
  handleAnswer: (value: Record<string, any>) => void;
}

export const FormStepRenderer: React.FC<FormStepRendererProps> = ({
  step,
  answer,
  handleAnswer,
}) => {
  // Initialize form state with existing answers or empty object
  const [formValues, setFormValues] = useState<Record<string, any>>(answer || {});

  // Update local state when answer prop changes
  useEffect(() => {
    if (answer) {
      setFormValues(answer);
    }
  }, [answer]);

  // Handle field value change
  const handleFieldChange = (fieldId: string, value: any) => {
    const updatedValues = { ...formValues, [fieldId]: value };
    setFormValues(updatedValues);
    handleAnswer(updatedValues);
  };

  // If there are no fields, return null
  if (!step.fields || step.fields.length === 0) {
    return <p className="text-gray-500">No form fields defined.</p>;
  }

  return (
    <div className="space-y-6">
      {step.description && (
        <p className="text-gray-600 mb-4">{step.description}</p>
      )}
      
      <div className="space-y-4">
        {step.fields.map((field: FormField) => (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>{field.label}</Label>
            
            {/* Render different input types based on field.type */}
            {field.type === 'text' && (
              <Input
                id={field.id}
                value={formValues[field.id] || ''}
                onChange={(e) => handleFieldChange(field.id, e.target.value)}
                placeholder={field.placeholder || ''}
              />
            )}
            
            {field.type === 'textarea' && (
              <Textarea
                id={field.id}
                value={formValues[field.id] || ''}
                onChange={(e) => handleFieldChange(field.id, e.target.value)}
                placeholder={field.placeholder || ''}
                rows={4}
              />
            )}
            
            {field.type === 'select' && field.options && (
              <Select
                value={formValues[field.id] || ''}
                onValueChange={(value) => handleFieldChange(field.id, value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={field.placeholder || 'Select an option'} />
                </SelectTrigger>
                <SelectContent>
                  {field.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            {field.type === 'checkbox' && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={field.id}
                  checked={formValues[field.id] || false}
                  onCheckedChange={(checked) => handleFieldChange(field.id, checked)}
                />
                <Label htmlFor={field.id} className="ml-2">{field.placeholder || ''}</Label>
              </div>
            )}
            
            {field.type === 'radio' && field.options && (
              <RadioGroup
                value={formValues[field.id] || ''}
                onValueChange={(value) => handleFieldChange(field.id, value)}
              >
                {field.options.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={`${field.id}-${option.value}`} />
                    <Label htmlFor={`${field.id}-${option.value}`}>{option.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
