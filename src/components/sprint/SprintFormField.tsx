
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";
import { Step } from "@/types/sprint-signup";

interface SprintFormFieldProps {
  step: Step;
  value: any;
  onChange: (field: string, value: any) => void;
  onFileUpload: (file: File | null) => void;
  toggleMultiSelect: (field: string, value: string) => void;
  uploadedFile: File | null;
}

export const SprintFormField: React.FC<SprintFormFieldProps> = ({
  step,
  value,
  onChange,
  onFileUpload,
  toggleMultiSelect,
  uploadedFile
}) => {
  // Handle input change for text and textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(step.id, e.target.value);
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileUpload(files[0]);
    } else {
      onFileUpload(null);
    }
  };

  switch (step.type) {
    case 'text':
      return (
        <Input 
          value={value || ''} 
          onChange={handleInputChange} 
          placeholder="Your answer" 
        />
      );
    
    case 'email':
      return (
        <Input 
          type="email" 
          value={value || ''} 
          onChange={handleInputChange} 
          placeholder="Your email" 
        />
      );
    
    case 'textarea':
      return (
        <Textarea 
          value={value || ''} 
          onChange={handleInputChange} 
          placeholder="Your answer" 
        />
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
      return step.options ? (
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
      ) : null;
    
    case 'conditional':
      if (!step.conditional) return null;
      
      // Find the matching condition
      const matchedCondition = step.conditional.find(condition => {
        // Extract the condition field and value
        const conditionField = condition.field;
        const conditionValue = condition.value;
        return value && value[conditionField] === conditionValue;
      });
      
      // If no condition matches, don't render anything
      if (!matchedCondition) return null;
      
      // Render the appropriate component based on the condition
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
