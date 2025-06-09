import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Check, AlertCircle } from "lucide-react";
import { Step } from "@/types/sprint-signup";
import { validateEmail, validateLinkedInUrl } from "@/utils/validation";

interface SprintFormFieldProps {
  step: Step;
  value: any;
  formValues: any;
  onChange: (field: string, value: any) => void;
  onFileUpload: (file: File | null) => void;
  toggleMultiSelect: (field: string, value: string) => void;
  uploadedFile: File | null;
  validationErrors?: Record<string, string>;
  onValidationChange?: (field: string, isValid: boolean, canonicalValue?: string) => void;
}

export const SprintFormField: React.FC<SprintFormFieldProps> = ({
  step,
  value,
  formValues,
  onChange,
  onFileUpload,
  toggleMultiSelect,
  uploadedFile,
  validationErrors = {},
  onValidationChange
}) => {
  const [localError, setLocalError] = useState<string>('');
  const [isValidating, setIsValidating] = useState(false);

  // Check if field is required (considering opt-out)
  const isFieldRequired = () => {
    if (!step.required) return false;
    if (step.optOutField && formValues[step.optOutField]) return false;
    return true;
  };

  // Real-time validation for email and LinkedIn
  useEffect(() => {
    if (!value || !step.validation) return;

    const validateField = async () => {
      setIsValidating(true);
      let result;
      
      if (step.validation === 'email') {
        result = validateEmail(value);
      } else if (step.validation === 'linkedin') {
        // Skip validation if opted out
        if (step.optOutField && formValues[step.optOutField]) {
          result = { isValid: true };
        } else {
          result = validateLinkedInUrl(value);
        }
      } else {
        result = { isValid: true };
      }

      setLocalError(result.error || '');
      setIsValidating(false);
      
      if (onValidationChange) {
        onValidationChange(step.id, result.isValid, result.canonicalValue);
      }
    };

    const timeoutId = setTimeout(validateField, 300);
    return () => clearTimeout(timeoutId);
  }, [value, step.validation, step.id, step.optOutField, formValues, onValidationChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(step.id, e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileUpload(files[0]);
    } else {
      onFileUpload(null);
    }
  };

  const hasError = localError || validationErrors[step.id];
  const isOptedOut = step.optOutField && formValues[step.optOutField];

  switch (step.type) {
    case 'text':
    case 'email':
      return (
        <div className="space-y-2">
          <Input 
            value={value || ''} 
            onChange={handleInputChange} 
            placeholder={step.placeholder || "Your answer"}
            disabled={isOptedOut}
            className={hasError ? "border-red-500" : ""}
            type={step.type === 'email' ? 'email' : 'text'}
          />
          {step.validation === 'linkedin' && !isOptedOut && (
            <p className="text-xs text-gray-500">
              Example: https://www.linkedin.com/in/yourprofile
            </p>
          )}
          {hasError && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>{hasError}</span>
            </div>
          )}
          {isValidating && (
            <p className="text-xs text-gray-500">Validating...</p>
          )}
        </div>
      );
    
    case 'textarea':
      return (
        <div className="space-y-2">
          <Textarea 
            value={value || ''} 
            onChange={handleInputChange} 
            placeholder="Your answer"
            disabled={isOptedOut}
            className={hasError ? "border-red-500" : ""}
          />
          {hasError && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>{hasError}</span>
            </div>
          )}
        </div>
      );
    
    case 'file':
      return (
        <div className="flex flex-col space-y-4">
          <Input 
            type="file" 
            onChange={handleFileChange} 
            className="border-2 border-dashed border-gray-300 p-10 text-center cursor-pointer"
          />
          {uploadedFile && (
            <div className="flex items-center space-x-2 text-green-600">
              <Check size={16} />
              <span>{uploadedFile.name} selected</span>
            </div>
          )}
        </div>
      );
    
    case 'select':
      return step.options ? (
        <RadioGroup
          value={value || ''}
          onValueChange={(value) => onChange(step.id, value)}
          className="space-y-3"
        >
          {step.options.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={`${step.id}-${option.value}`} />
              <Label htmlFor={`${step.id}-${option.value}`} className="cursor-pointer">
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      ) : null;
    
    case 'checkbox':
      if (step.options) {
        // Multiple checkbox options
        return (
          <div className="space-y-3">
            {step.options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox 
                  checked={(value || []).includes(option.value)}
                  onCheckedChange={() => toggleMultiSelect(step.id, option.value)}
                  id={`${step.id}-${option.value}`} 
                />
                <Label htmlFor={`${step.id}-${option.value}`} className="cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        );
      } else {
        // Single checkbox (like opt-out)
        return (
          <div className="flex items-center space-x-2">
            <Checkbox 
              checked={value || false}
              onCheckedChange={(checked) => onChange(step.id, checked)}
              id={step.id}
            />
            <Label htmlFor={step.id} className="cursor-pointer">
              {step.question}
            </Label>
          </div>
        );
      }
    
    case 'conditional':
      if (!step.conditional) return null;
      
      const matchedCondition = step.conditional.find(condition => {
        const conditionField = condition.field;
        const conditionValue = condition.value;
        return formValues[conditionField] === conditionValue;
      });
      
      if (!matchedCondition) return null;
      
      const { componentType, componentProps = {} } = matchedCondition;
      
      if (componentType === 'textarea') {
        return (
          <Textarea
            value={value || ''}
            onChange={(e) => onChange(step.id, e.target.value)}
            placeholder={componentProps.placeholder || "Your answer"}
          />
        );
      } else if (componentType === 'input') {
        return (
          <Input
            value={value || ''}
            onChange={(e) => onChange(step.id, e.target.value)}
            placeholder={componentProps.placeholder || "Your answer"}
            type={componentProps.type || "text"}
          />
        );
      } else if (componentType === 'select') {
        try {
          const options = componentProps.options ? JSON.parse(componentProps.options) : [];
          return (
            <RadioGroup
              value={value || ''}
              onValueChange={(value) => onChange(step.id, value)}
              className="space-y-3"
            >
              {options.map((option: any) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`${step.id}-${option.value}`} />
                  <Label htmlFor={`${step.id}-${option.value}`} className="cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          );
        } catch (error) {
          console.error("Error parsing options:", error);
          return null;
        }
      }
      
      return null;
    
    default:
      return null;
  }
};
